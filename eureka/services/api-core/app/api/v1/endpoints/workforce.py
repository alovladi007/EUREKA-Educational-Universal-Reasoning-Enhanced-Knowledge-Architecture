"""
Phase 15 — Workforce training affiliate REST surface.

15.1 Partnerships + seats
  POST   /partnerships                              create (admin)
  GET    /partnerships                              list (admin sees all in org)
  GET    /partnerships/{id}
  POST   /partnerships/{id}/action                  activate/pause/expire
  GET    /partnerships/{id}/seat-utilisation        seat usage breakdown
  POST   /partnerships/{id}/seats/bulk-assign       CSV-ready bulk import
  POST   /partnerships/{id}/seats/{user_id}/release release one seat

15.2 Programs + assignments
  POST   /partnerships/{id}/programs                create program
  GET    /partnerships/{id}/programs                list
  POST   /programs/{program_id}/assign              bulk-assign workers
  GET    /programs/{program_id}/assignments         list assignments
  POST   /programs/{program_id}/assignments/{aid}/complete  mark done

15.3 Compliance
  POST   /partnerships/{id}/compliance              create requirement
  GET    /partnerships/{id}/compliance              list requirements
  POST   /me/compliance/{requirement_id}/attest     learner-side attestation
  GET    /me/compliance                             my compliance status

15.4 Analytics
  GET    /partnerships/{id}/analytics               aggregate KPIs

15.5 Worker portal
  GET    /me/training                               my assigned programs + compliance
  GET    /me/training/team                          (manager) my reports' status
"""

from __future__ import annotations

import csv
import io
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.user import User
from app.models.workforce import (
    AssignmentStatus,
    ComplianceDueDate,
    ComplianceRequirement,
    ComplianceStatusEnum,
    InstitutionPartnership,
    PartnershipStatus,
    ProgramAssignment,
    ProgramMilestone,
    ProgramStatus,
    RegulationKind,
    SeatAssignment,
    TrainingAttestation,
    WorkforceProgram,
)
from app.schemas.workforce import (
    AttestationResponse,
    AttestRequest,
    ComplianceDueDateResponse,
    ComplianceRequirementCreate,
    ComplianceRequirementResponse,
    MyComplianceItem,
    MyTrainingProgram,
    MyTrainingResponse,
    PartnershipActionRequest,
    PartnershipCreateRequest,
    PartnershipResponse,
    ProgramAssignBulkResponse,
    ProgramAssignmentResponse,
    ProgramAssignRequest,
    ProgramCreateRequest,
    ProgramResponse,
    SeatBulkAssignRequest,
    SeatBulkAssignResponse,
    SeatResponse,
    SeatUtilisationResponse,
    WorkforceAnalyticsResponse,
    WorkforceFunnelRow,
)
from app.services import workforce as wf_svc
from app.utils.dependencies import get_current_user


router = APIRouter()


# P1.5: centralized in app/utils/rbac.py (was a local duplicate).
from app.utils.rbac import is_admin as _is_admin  # noqa: E402


def _require_admin(user: User) -> None:
    if not _is_admin(user):
        raise HTTPException(status_code=403, detail="admin role required")


def _utc() -> datetime:
    return datetime.now(timezone.utc)


async def _get_partnership_or_404(
    db: AsyncSession, partnership_id: UUID, user: User
) -> InstitutionPartnership:
    p = await db.get(InstitutionPartnership, partnership_id)
    if p is None:
        raise HTTPException(status_code=404, detail="partnership not found")
    if p.org_id != user.org_id and not _is_admin(user):
        raise HTTPException(status_code=403, detail="not in your org")
    return p


# ---------------------------------------------------------------------------
# 15.1 Partnerships + seats
# ---------------------------------------------------------------------------


@router.post("/partnerships", response_model=PartnershipResponse, status_code=201)
async def create_partnership(
    payload: PartnershipCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    p = InstitutionPartnership(**payload.model_dump())
    db.add(p)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        if "uniq" in str(exc).lower() or "duplicate" in str(exc).lower():
            raise HTTPException(status_code=409, detail="partnership for this org already exists") from exc
        raise
    await db.refresh(p)
    return p


@router.get("/partnerships", response_model=list[PartnershipResponse])
async def list_partnerships(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    q = await db.execute(
        select(InstitutionPartnership)
        .where(InstitutionPartnership.org_id == current_user.org_id)
        .order_by(InstitutionPartnership.created_at.desc())
    )
    return list(q.scalars().all())


@router.get("/partnerships/{partnership_id}", response_model=PartnershipResponse)
async def get_partnership(
    partnership_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    return await _get_partnership_or_404(db, partnership_id, current_user)


@router.post("/partnerships/{partnership_id}/action", response_model=PartnershipResponse)
async def partnership_action(
    partnership_id: UUID,
    payload: PartnershipActionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    p = await _get_partnership_or_404(db, partnership_id, current_user)
    now = _utc()
    if payload.action == "activate":
        p.status = PartnershipStatus.active.value
        p.activated_at = p.activated_at or now
        p.paused_at = None
    elif payload.action == "pause":
        p.status = PartnershipStatus.paused.value
        p.paused_at = now
    elif payload.action == "expire":
        p.status = PartnershipStatus.expired.value
    else:
        raise HTTPException(status_code=400, detail="action must be activate|pause|expire")
    await db.commit()
    await db.refresh(p)
    return p


@router.get("/partnerships/{partnership_id}/seat-utilisation", response_model=SeatUtilisationResponse)
async def seat_utilisation(
    partnership_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    p = await _get_partnership_or_404(db, partnership_id, current_user)
    q = await db.execute(
        select(SeatAssignment).where(
            SeatAssignment.partnership_id == partnership_id,
            SeatAssignment.released_at.is_(None),
        )
    )
    seats = list(q.scalars().all())
    by_team: dict[str, int] = {}
    by_role: dict[str, int] = {}
    for s in seats:
        by_team[s.team_label or "—"] = by_team.get(s.team_label or "—", 0) + 1
        by_role[s.role_label or "—"] = by_role.get(s.role_label or "—", 0) + 1
    return SeatUtilisationResponse(
        partnership_id=partnership_id,
        contracted_seats=p.contracted_seats,
        active_seats=len(seats),
        available_seats=max(0, p.contracted_seats - len(seats)),
        by_team=by_team,
        by_role=by_role,
    )


@router.post(
    "/partnerships/{partnership_id}/seats/bulk-assign",
    response_model=SeatBulkAssignResponse,
)
async def bulk_assign_seats(
    partnership_id: UUID,
    payload: SeatBulkAssignRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    p = await _get_partnership_or_404(db, partnership_id, current_user)

    # Current active seat count
    cnt_q = await db.execute(
        text(
            "SELECT COUNT(*) FROM seat_assignments "
            "WHERE partnership_id = :pid AND released_at IS NULL"
        ),
        {"pid": str(partnership_id)},
    )
    active = int(cnt_q.scalar() or 0)
    available = max(0, p.contracted_seats - active)

    # Build a fast lookup of any existing users by email + active seat lookup.
    emails = [r.email.lower() for r in payload.rows]
    existing_user_q = await db.execute(
        text("SELECT id, email FROM users WHERE LOWER(email) = ANY(:emails)"),
        {"emails": emails},
    )
    existing_users = {row.email.lower(): row.id for row in existing_user_q.fetchall()}

    assigned = 0
    skipped = 0
    over_capacity = 0

    for row in payload.rows:
        if available <= 0:
            over_capacity += 1
            continue
        email_lc = row.email.lower()
        user_id = existing_users.get(email_lc)
        if user_id is None:
            # JIT create the user with a no-password account (will set on first login).
            ins = await db.execute(
                text(
                    """
                    INSERT INTO users
                        (id, org_id, email, hashed_password, first_name, last_name,
                         role, is_active, is_email_verified)
                    VALUES
                        (uuid_generate_v4(), :org, :email, '!', :fn, :ln,
                         'student', TRUE, FALSE)
                    RETURNING id
                    """
                ),
                {
                    "org": str(p.org_id),
                    "email": row.email,
                    "fn": row.first_name or "Worker",
                    "ln": row.last_name or "—",
                },
            )
            user_id = ins.scalar()
            existing_users[email_lc] = user_id

        # Skip if already has an active seat
        already_q = await db.execute(
            text(
                """
                SELECT 1 FROM seat_assignments
                 WHERE partnership_id = :pid AND user_id = :uid AND released_at IS NULL
                """
            ),
            {"pid": str(partnership_id), "uid": str(user_id)},
        )
        if already_q.first():
            skipped += 1
            continue

        # Lookup manager
        mgr_uid = None
        if row.manager_email:
            mq = await db.execute(
                text("SELECT id FROM users WHERE LOWER(email) = LOWER(:e)"),
                {"e": row.manager_email},
            )
            mgr_uid = mq.scalar()

        seat = SeatAssignment(
            partnership_id=partnership_id,
            user_id=user_id,
            assigned_by=current_user.id,
            role_label=row.role_label,
            team_label=row.team_label,
            manager_user_id=mgr_uid,
        )
        db.add(seat)
        assigned += 1
        available -= 1

    await db.commit()
    return SeatBulkAssignResponse(
        assigned=assigned,
        skipped=skipped,
        over_capacity=over_capacity,
        seat_utilisation=active + assigned,
        contracted_seats=p.contracted_seats,
    )


@router.post(
    "/partnerships/{partnership_id}/seats/{user_id}/release",
    response_model=SeatResponse,
)
async def release_seat(
    partnership_id: UUID,
    user_id: UUID,
    reason: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    await _get_partnership_or_404(db, partnership_id, current_user)
    q = await db.execute(
        select(SeatAssignment).where(
            SeatAssignment.partnership_id == partnership_id,
            SeatAssignment.user_id == user_id,
            SeatAssignment.released_at.is_(None),
        )
    )
    seat = q.scalar_one_or_none()
    if seat is None:
        raise HTTPException(status_code=404, detail="active seat not found")
    seat.released_at = _utc()
    seat.release_reason = reason
    await db.commit()
    await db.refresh(seat)
    return seat


# ---------------------------------------------------------------------------
# 15.2 Programs
# ---------------------------------------------------------------------------


@router.post("/partnerships/{partnership_id}/programs", response_model=ProgramResponse, status_code=201)
async def create_program(
    partnership_id: UUID,
    payload: ProgramCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    await _get_partnership_or_404(db, partnership_id, current_user)
    data = payload.model_dump(exclude={"milestones"})
    prog = WorkforceProgram(
        partnership_id=partnership_id,
        created_by=current_user.id,
        status=ProgramStatus.active.value,
        **data,
    )
    db.add(prog)
    try:
        await db.flush()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="program slug already exists in this partnership") from exc

    for m in payload.milestones:
        db.add(ProgramMilestone(program_id=prog.id, **m.model_dump()))

    await db.commit()
    await db.refresh(prog)
    return prog


@router.get("/partnerships/{partnership_id}/programs", response_model=list[ProgramResponse])
async def list_programs(
    partnership_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    await _get_partnership_or_404(db, partnership_id, current_user)
    q = await db.execute(
        select(WorkforceProgram)
        .where(WorkforceProgram.partnership_id == partnership_id)
        .order_by(WorkforceProgram.created_at.desc())
    )
    return list(q.scalars().all())


@router.post(
    "/programs/{program_id}/assign",
    response_model=ProgramAssignBulkResponse,
)
async def bulk_assign_program(
    program_id: UUID,
    payload: ProgramAssignRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    program = await db.get(WorkforceProgram, program_id)
    if program is None:
        raise HTTPException(status_code=404, detail="program not found")
    await _get_partnership_or_404(db, program.partnership_id, current_user)

    new_assignments = 0
    already_assigned = 0
    plans_created = 0
    for uid in payload.user_ids:
        result = await wf_svc.assign_program(
            db, program=program, user_id=uid,
            assigned_by=current_user.id, due_at=payload.due_at,
        )
        if result.created:
            new_assignments += 1
            if result.study_plan_id is not None:
                plans_created += 1
        else:
            already_assigned += 1
    return ProgramAssignBulkResponse(
        program_id=program_id,
        new_assignments=new_assignments,
        already_assigned=already_assigned,
        study_plans_created=plans_created,
    )


@router.get(
    "/programs/{program_id}/assignments",
    response_model=list[ProgramAssignmentResponse],
)
async def list_program_assignments(
    program_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    program = await db.get(WorkforceProgram, program_id)
    if program is None:
        raise HTTPException(status_code=404, detail="program not found")
    await _get_partnership_or_404(db, program.partnership_id, current_user)
    q = await db.execute(
        select(ProgramAssignment)
        .where(ProgramAssignment.program_id == program_id)
        .order_by(ProgramAssignment.assigned_at.desc())
    )
    return list(q.scalars().all())


@router.post(
    "/programs/{program_id}/assignments/{assignment_id}/complete",
    response_model=ProgramAssignmentResponse,
)
async def complete_assignment(
    program_id: UUID,
    assignment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin-only — workforce-program completion is normally driven by mastery
    crossing the target, but the L&D admin can mark complete manually."""
    _require_admin(current_user)
    assignment = await db.get(ProgramAssignment, assignment_id)
    if assignment is None or assignment.program_id != program_id:
        raise HTTPException(status_code=404, detail="assignment not found")
    return await wf_svc.mark_program_completed(db, assignment=assignment)


# ---------------------------------------------------------------------------
# 15.3 Compliance
# ---------------------------------------------------------------------------


@router.post(
    "/partnerships/{partnership_id}/compliance",
    response_model=ComplianceRequirementResponse,
    status_code=201,
)
async def create_compliance_requirement(
    partnership_id: UUID,
    payload: ComplianceRequirementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    await _get_partnership_or_404(db, partnership_id, current_user)
    if payload.regulation not in {k.value for k in RegulationKind}:
        raise HTTPException(status_code=400, detail="unknown regulation")
    data = payload.model_dump()
    extra = data.pop("metadata", {}) or {}
    req = ComplianceRequirement(
        partnership_id=partnership_id,
        extra=extra,
        **data,
    )
    db.add(req)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="code already exists for this partnership") from exc
    await db.refresh(req)
    return req


@router.get(
    "/partnerships/{partnership_id}/compliance",
    response_model=list[ComplianceRequirementResponse],
)
async def list_compliance_requirements(
    partnership_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    await _get_partnership_or_404(db, partnership_id, current_user)
    q = await db.execute(
        select(ComplianceRequirement)
        .where(ComplianceRequirement.partnership_id == partnership_id)
        .order_by(ComplianceRequirement.created_at.desc())
    )
    return list(q.scalars().all())


@router.post(
    "/me/compliance/{requirement_id}/attest",
    response_model=AttestationResponse,
)
async def attest(
    requirement_id: UUID,
    payload: AttestRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    req = await db.get(ComplianceRequirement, requirement_id)
    if req is None or not req.is_active:
        raise HTTPException(status_code=404, detail="requirement not found")
    if not req.attestation_required:
        raise HTTPException(status_code=400, detail="this requirement does not accept self-attestations")
    attestation = await wf_svc.record_attestation(
        db,
        requirement=req,
        user_id=current_user.id,
        statement=payload.statement,
        ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    return attestation


@router.get("/me/compliance", response_model=list[ComplianceDueDateResponse])
async def my_compliance(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Re-evaluate before returning so the user sees fresh statuses.
    rows = await wf_svc.evaluate_compliance(db, user_id=current_user.id)
    return rows


# ---------------------------------------------------------------------------
# 15.4 Analytics
# ---------------------------------------------------------------------------


@router.get(
    "/partnerships/{partnership_id}/analytics",
    response_model=WorkforceAnalyticsResponse,
)
async def workforce_analytics(
    partnership_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    p = await _get_partnership_or_404(db, partnership_id, current_user)

    # Active seats + breakdowns
    seats_q = await db.execute(
        select(SeatAssignment).where(
            SeatAssignment.partnership_id == partnership_id,
            SeatAssignment.released_at.is_(None),
        )
    )
    seats = list(seats_q.scalars().all())
    seat_user_ids = {s.user_id for s in seats}
    seats_by_team_role: dict[str, dict] = {}
    seats_by_role_only: dict[str, dict] = {}
    for s in seats:
        team = s.team_label or "—"
        role = s.role_label or "—"
        seats_by_team_role.setdefault(team, {"seats": 0, "users": set()})
        seats_by_team_role[team]["seats"] += 1
        seats_by_team_role[team]["users"].add(s.user_id)
        seats_by_role_only.setdefault(role, {"seats": 0, "users": set()})
        seats_by_role_only[role]["seats"] += 1
        seats_by_role_only[role]["users"].add(s.user_id)

    # Active programs
    prog_q = await db.execute(
        select(WorkforceProgram).where(
            WorkforceProgram.partnership_id == partnership_id,
            WorkforceProgram.status == ProgramStatus.active.value,
        )
    )
    programs = list(prog_q.scalars().all())
    program_ids = [p.id for p in programs]

    # Assignment stats
    assignments_total = 0
    assignments_overdue = 0
    user_stats: dict[UUID, dict] = {}   # user_id → {in_progress, completed, overdue}
    if program_ids and seat_user_ids:
        ass_q = await db.execute(
            select(ProgramAssignment).where(
                ProgramAssignment.program_id.in_(program_ids),
                ProgramAssignment.user_id.in_(seat_user_ids),
            )
        )
        for a in ass_q.scalars().all():
            assignments_total += 1
            us = user_stats.setdefault(
                a.user_id, {"in_progress": 0, "completed": 0, "overdue": 0}
            )
            if a.status == AssignmentStatus.overdue.value or (
                a.due_at is not None
                and a.completed_at is None
                and a.due_at < _utc()
            ):
                us["overdue"] += 1
                assignments_overdue += 1
            elif a.status == AssignmentStatus.completed.value:
                us["completed"] += 1
            else:
                us["in_progress"] += 1

    # Compliance stats
    compliance_overdue = 0
    compliance_due_soon = 0
    if seat_user_ids:
        req_q = await db.execute(
            select(ComplianceRequirement.id).where(
                ComplianceRequirement.partnership_id == partnership_id,
                ComplianceRequirement.is_active.is_(True),
            )
        )
        req_ids = [r[0] for r in req_q.all()]
        if req_ids:
            cdd_q = await db.execute(
                select(ComplianceDueDate).where(
                    ComplianceDueDate.requirement_id.in_(req_ids),
                    ComplianceDueDate.user_id.in_(seat_user_ids),
                )
            )
            for c in cdd_q.scalars().all():
                if c.status in (
                    ComplianceStatusEnum.overdue.value,
                    ComplianceStatusEnum.expired.value,
                ):
                    compliance_overdue += 1
                elif c.status == ComplianceStatusEnum.due_soon.value:
                    compliance_due_soon += 1

    def _funnel(group_map: dict[str, dict]) -> list[WorkforceFunnelRow]:
        rows = []
        for label, info in group_map.items():
            users = info["users"]
            ip = sum(user_stats.get(u, {}).get("in_progress", 0) for u in users)
            cp = sum(user_stats.get(u, {}).get("completed", 0) for u in users)
            ov = sum(user_stats.get(u, {}).get("overdue", 0) for u in users)
            rows.append(WorkforceFunnelRow(
                label=label,
                seat_count=info["seats"],
                in_progress=ip,
                completed=cp,
                overdue=ov,
            ))
        rows.sort(key=lambda r: -r.seat_count)
        return rows

    return WorkforceAnalyticsResponse(
        partnership_id=partnership_id,
        active_seats=len(seats),
        contracted_seats=p.contracted_seats,
        programs_active=len(programs),
        assignments_total=assignments_total,
        assignments_overdue=assignments_overdue,
        compliance_overdue=compliance_overdue,
        compliance_due_soon=compliance_due_soon,
        by_team=_funnel(seats_by_team_role),
        by_role=_funnel(seats_by_role_only),
    )


# ---------------------------------------------------------------------------
# 15.5 Worker portal
# ---------------------------------------------------------------------------


@router.get("/me/training", response_model=MyTrainingResponse)
async def my_training(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Programs assigned to me
    ass_q = await db.execute(
        select(ProgramAssignment, WorkforceProgram)
        .join(WorkforceProgram, WorkforceProgram.id == ProgramAssignment.program_id)
        .where(ProgramAssignment.user_id == current_user.id)
        .order_by(
            ProgramAssignment.due_at.asc().nulls_last(),
            ProgramAssignment.assigned_at.desc(),
        )
    )
    programs = [
        MyTrainingProgram(
            assignment=ProgramAssignmentResponse.model_validate(a, from_attributes=True),
            program=ProgramResponse.model_validate(p, from_attributes=True),
        )
        for a, p in ass_q.all()
    ]
    # Compliance items
    await wf_svc.evaluate_compliance(db, user_id=current_user.id)
    cmp_q = await db.execute(
        select(ComplianceDueDate, ComplianceRequirement)
        .join(ComplianceRequirement, ComplianceRequirement.id == ComplianceDueDate.requirement_id)
        .where(ComplianceDueDate.user_id == current_user.id)
        .order_by(ComplianceDueDate.due_at.asc())
    )
    compliance = [
        MyComplianceItem(
            requirement=ComplianceRequirementResponse.model_validate(r, from_attributes=True),
            due_date=ComplianceDueDateResponse.model_validate(d, from_attributes=True),
        )
        for d, r in cmp_q.all()
    ]
    return MyTrainingResponse(programs=programs, compliance=compliance)


@router.get("/me/training/team", response_model=list[ProgramAssignmentResponse])
async def my_team_training(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Manager view: assignments for direct reports (seats where I am manager_user_id)."""
    seats_q = await db.execute(
        select(SeatAssignment.user_id).where(
            SeatAssignment.manager_user_id == current_user.id,
            SeatAssignment.released_at.is_(None),
        )
    )
    report_ids = [r[0] for r in seats_q.all()]
    if not report_ids:
        return []
    q = await db.execute(
        select(ProgramAssignment)
        .where(ProgramAssignment.user_id.in_(report_ids))
        .order_by(ProgramAssignment.due_at.asc().nulls_last())
    )
    return list(q.scalars().all())

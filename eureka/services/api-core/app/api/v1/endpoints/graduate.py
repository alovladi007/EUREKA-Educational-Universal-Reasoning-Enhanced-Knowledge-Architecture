"""
Phase 16.1 — Graduate school REST surface.

Programs (admin)
  POST   /graduate/programs                          create
  GET    /graduate/programs                          list (org-scoped)
  GET    /graduate/programs/{program_id}             detail (+ skill_targets)
  PATCH  /graduate/programs/{program_id}             update fields

Enrollments
  POST   /graduate/programs/{program_id}/enrollments         admin/coordinator enrolls a learner
  GET    /graduate/programs/{program_id}/enrollments         admin lists enrollments
  POST   /graduate/enrollments/{enrollment_id}/action        lifecycle transition
  PATCH  /graduate/enrollments/{enrollment_id}               supervisor / focus update

Milestones
  POST   /graduate/enrollments/{enrollment_id}/milestones    create
  GET    /graduate/enrollments/{enrollment_id}/milestones    list
  POST   /graduate/milestones/{milestone_id}/submit          learner submits
  POST   /graduate/milestones/{milestone_id}/decide          supervisor decides

Learner-side
  GET    /me/graduate                                        my enrollments rollup
"""

from __future__ import annotations

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.graduate import (
    DegreeMilestone,
    GradEnrollmentStatus,
    GraduateEnrollment,
    GraduateProgram,
    MilestoneStatus,
    ProgramSkillTarget,
)
from app.models.user import User
from app.schemas.graduate import (
    EnrollmentActionRequest,
    EnrollmentCreateRequest,
    EnrollmentResponse,
    EnrollmentUpdateRequest,
    MilestoneCreateRequest,
    MilestoneDecisionRequest,
    MilestoneResponse,
    MilestoneSubmitRequest,
    MyEnrollmentSummary,
    MyGraduateResponse,
    ProgramCreateRequest,
    ProgramDetailResponse,
    ProgramResponse,
    ProgramUpdateRequest,
    SkillTargetResponse,
)
from app.services import graduate as grad_svc
from app.utils.dependencies import get_current_user


router = APIRouter()


def _role(user: User) -> str:
    return user.role.value if hasattr(user.role, "value") else (user.role or "")


# P1.5: _is_admin centralized in app/utils/rbac.py. _role + _is_faculty
# stay local (_is_faculty includes "teacher" and _role is still used by it).
from app.utils.rbac import is_admin as _is_admin  # noqa: E402


def _is_faculty(user: User) -> bool:
    return _role(user) in ("teacher", "org_admin", "super_admin")


def _require_admin(user: User) -> None:
    if not _is_admin(user):
        raise HTTPException(status_code=403, detail="admin role required")


# ---------------------------------------------------------------------------
# Programs
# ---------------------------------------------------------------------------


async def _get_program_or_404(db: AsyncSession, program_id: UUID, user: User) -> GraduateProgram:
    p = await db.get(GraduateProgram, program_id)
    if p is None:
        raise HTTPException(status_code=404, detail="program not found")
    if p.org_id != user.org_id and not _is_admin(user):
        raise HTTPException(status_code=403, detail="not in your org")
    return p


@router.post("/graduate/programs", response_model=ProgramResponse, status_code=201)
async def create_program(
    payload: ProgramCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    body = payload.model_dump(exclude={"skill_targets"})
    program = GraduateProgram(
        **body,
        org_id=current_user.org_id,
        created_by=current_user.id,
    )
    db.add(program)
    try:
        await db.flush()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="program slug already exists in org") from exc

    for spec in payload.skill_targets:
        db.add(ProgramSkillTarget(program_id=program.id, **spec.model_dump()))

    await db.commit()
    await db.refresh(program)
    return program


@router.get("/graduate/programs", response_model=list[ProgramResponse])
async def list_programs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: Optional[str] = None,
):
    q = select(GraduateProgram).where(GraduateProgram.org_id == current_user.org_id)
    if status:
        q = q.where(GraduateProgram.status == status)
    q = q.order_by(GraduateProgram.created_at.desc())
    rows = (await db.execute(q)).scalars().all()
    return list(rows)


@router.get("/graduate/programs/{program_id}", response_model=ProgramDetailResponse)
async def get_program(
    program_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    p = await _get_program_or_404(db, program_id, current_user)
    targets = (await db.execute(
        select(ProgramSkillTarget).where(ProgramSkillTarget.program_id == program_id)
    )).scalars().all()
    enrol_count = (await db.execute(
        select(func.count(GraduateEnrollment.id)).where(
            GraduateEnrollment.program_id == program_id
        )
    )).scalar_one()

    payload = ProgramResponse.model_validate(p).model_dump()
    return ProgramDetailResponse(
        **payload,
        skill_targets=[SkillTargetResponse.model_validate(t) for t in targets],
        enrollments_count=int(enrol_count or 0),
    )


@router.patch("/graduate/programs/{program_id}", response_model=ProgramResponse)
async def update_program(
    program_id: UUID,
    payload: ProgramUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    p = await _get_program_or_404(db, program_id, current_user)
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(p, k, v)
    await db.commit()
    await db.refresh(p)
    return p


# ---------------------------------------------------------------------------
# Enrollments
# ---------------------------------------------------------------------------


async def _get_enrollment_or_404(
    db: AsyncSession, enrollment_id: UUID, user: User
) -> GraduateEnrollment:
    e = await db.get(GraduateEnrollment, enrollment_id)
    if e is None:
        raise HTTPException(status_code=404, detail="enrollment not found")
    program = await db.get(GraduateProgram, e.program_id)
    if program is None:
        raise HTTPException(status_code=404, detail="program for enrollment missing")
    # learner-self or in-org admin/supervisor
    if e.user_id == user.id:
        return e
    if e.supervisor_user_id == user.id:
        return e
    if program.org_id == user.org_id and _is_admin(user):
        return e
    raise HTTPException(status_code=403, detail="not authorised for this enrollment")


@router.post(
    "/graduate/programs/{program_id}/enrollments",
    response_model=EnrollmentResponse,
    status_code=201,
)
async def create_enrollment(
    program_id: UUID,
    payload: EnrollmentCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    program = await _get_program_or_404(db, program_id, current_user)
    result = await grad_svc.enroll_in_program(
        db,
        program=program,
        user_id=payload.user_id,
        supervisor_user_id=payload.supervisor_user_id,
        expected_graduation_year=payload.expected_graduation_year,
    )
    await db.commit()
    await db.refresh(result.enrollment)
    return result.enrollment


@router.get(
    "/graduate/programs/{program_id}/enrollments",
    response_model=list[EnrollmentResponse],
)
async def list_enrollments(
    program_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: Optional[str] = None,
):
    _require_admin(current_user)
    await _get_program_or_404(db, program_id, current_user)
    q = select(GraduateEnrollment).where(GraduateEnrollment.program_id == program_id)
    if status:
        q = q.where(GraduateEnrollment.status == status)
    q = q.order_by(GraduateEnrollment.created_at.desc())
    return list((await db.execute(q)).scalars().all())


@router.get(
    "/graduate/enrollments/{enrollment_id}",
    response_model=EnrollmentResponse,
)
async def get_enrollment(
    enrollment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """GET-by-id for an enrollment. Returns full row incl. lifecycle stamps.
    Auth: learner-self, supervisor, or in-org admin."""
    return await _get_enrollment_or_404(db, enrollment_id, current_user)


@router.post(
    "/graduate/enrollments/{enrollment_id}/action",
    response_model=EnrollmentResponse,
)
async def enrollment_action(
    enrollment_id: UUID,
    payload: EnrollmentActionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    e = await _get_enrollment_or_404(db, enrollment_id, current_user)
    # Withdraw is self-allowed; other transitions require admin/supervisor.
    if payload.action != "withdraw" and not (_is_admin(current_user) or e.supervisor_user_id == current_user.id):
        raise HTTPException(status_code=403, detail="admin or supervisor only")
    try:
        await grad_svc.advance_enrollment(
            db, enrollment=e, action=payload.action, reason=payload.reason
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    await db.commit()
    await db.refresh(e)
    return e


@router.patch(
    "/graduate/enrollments/{enrollment_id}", response_model=EnrollmentResponse
)
async def update_enrollment(
    enrollment_id: UUID,
    payload: EnrollmentUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    e = await _get_enrollment_or_404(db, enrollment_id, current_user)
    body = payload.model_dump(exclude_unset=True)
    # Only admin/supervisor can change supervisor_user_id; learner can self-edit focus.
    if "supervisor_user_id" in body and not (_is_admin(current_user) or e.supervisor_user_id == current_user.id):
        raise HTTPException(status_code=403, detail="admin or supervisor only")
    for k, v in body.items():
        setattr(e, k, v)
    await db.commit()
    await db.refresh(e)
    return e


# ---------------------------------------------------------------------------
# Milestones
# ---------------------------------------------------------------------------


async def _get_milestone_or_404(
    db: AsyncSession, milestone_id: UUID, user: User
) -> tuple[DegreeMilestone, GraduateEnrollment]:
    m = await db.get(DegreeMilestone, milestone_id)
    if m is None:
        raise HTTPException(status_code=404, detail="milestone not found")
    e = await _get_enrollment_or_404(db, m.enrollment_id, user)
    return m, e


@router.post(
    "/graduate/enrollments/{enrollment_id}/milestones",
    response_model=MilestoneResponse,
    status_code=201,
)
async def create_milestone(
    enrollment_id: UUID,
    payload: MilestoneCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    e = await _get_enrollment_or_404(db, enrollment_id, current_user)
    if not (_is_admin(current_user) or e.supervisor_user_id == current_user.id):
        raise HTTPException(status_code=403, detail="admin or supervisor only")
    m = DegreeMilestone(enrollment_id=enrollment_id, **payload.model_dump())
    db.add(m)
    await db.flush()
    await grad_svc.recompute_progress(db, enrollment=e)
    await db.commit()
    await db.refresh(m)
    return m


@router.get(
    "/graduate/enrollments/{enrollment_id}/milestones",
    response_model=list[MilestoneResponse],
)
async def list_milestones(
    enrollment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _get_enrollment_or_404(db, enrollment_id, current_user)
    rows = (await db.execute(
        select(DegreeMilestone)
        .where(DegreeMilestone.enrollment_id == enrollment_id)
        .order_by(DegreeMilestone.sequence, DegreeMilestone.created_at)
    )).scalars().all()
    return list(rows)


@router.post("/graduate/milestones/{milestone_id}/submit", response_model=MilestoneResponse)
async def submit_milestone_endpoint(
    milestone_id: UUID,
    payload: MilestoneSubmitRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    m, e = await _get_milestone_or_404(db, milestone_id, current_user)
    # Only the learner enrolled can submit.
    if e.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="learner-only action")
    await grad_svc.submit_milestone(db, milestone=m, artifact_url=payload.artifact_url)
    await db.commit()
    await db.refresh(m)
    return m


@router.post("/graduate/milestones/{milestone_id}/decide", response_model=MilestoneResponse)
async def decide_milestone_endpoint(
    milestone_id: UUID,
    payload: MilestoneDecisionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    m, e = await _get_milestone_or_404(db, milestone_id, current_user)
    # Decisions require admin or the supervisor of the enrollment.
    if not (_is_admin(current_user) or e.supervisor_user_id == current_user.id):
        raise HTTPException(status_code=403, detail="admin or supervisor only")
    try:
        await grad_svc.decide_milestone(
            db,
            milestone=m,
            decision=payload.decision,
            decided_by=current_user.id,
            notes=payload.notes,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    await grad_svc.recompute_progress(db, enrollment=e)
    await db.commit()
    await db.refresh(m)
    return m


# ---------------------------------------------------------------------------
# Learner-side rollup
# ---------------------------------------------------------------------------


@router.get("/me/graduate/available-programs", response_model=list[ProgramResponse])
async def list_available_programs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Programs in the learner's org that are active + not already-enrolled."""
    enrolled_ids = set(map(str, (await db.execute(
        select(GraduateEnrollment.program_id).where(GraduateEnrollment.user_id == current_user.id)
    )).scalars().all()))
    q = (
        select(GraduateProgram)
        .where(
            GraduateProgram.org_id == current_user.org_id,
            GraduateProgram.status == "active",
        )
        .order_by(GraduateProgram.created_at.desc())
    )
    rows = (await db.execute(q)).scalars().all()
    return [r for r in rows if str(r.id) not in enrolled_ids]


@router.post(
    "/me/graduate/programs/{program_id}/enroll",
    response_model=EnrollmentResponse,
    status_code=201,
)
async def self_enroll(
    program_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Learner self-enrolls in an org-wide active program. Idempotent —
    if already enrolled, returns the existing row."""
    program = await db.get(GraduateProgram, program_id)
    if program is None:
        raise HTTPException(status_code=404, detail="program not found")
    if program.org_id != current_user.org_id:
        raise HTTPException(status_code=403, detail="program not in your org")
    if program.status != "active":
        raise HTTPException(status_code=409, detail="program is not active")
    result = await grad_svc.enroll_in_program(
        db,
        program=program,
        user_id=current_user.id,
        supervisor_user_id=None,
        expected_graduation_year=None,
    )
    await db.commit()
    await db.refresh(result.enrollment)
    return result.enrollment


@router.get("/me/graduate", response_model=MyGraduateResponse)
async def my_graduate(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (await db.execute(
        select(GraduateEnrollment, GraduateProgram)
        .join(GraduateProgram, GraduateProgram.id == GraduateEnrollment.program_id)
        .where(GraduateEnrollment.user_id == current_user.id)
        .order_by(GraduateEnrollment.created_at.desc())
    )).all()
    out: list[MyEnrollmentSummary] = []
    for enrol, program in rows:
        nxt = (await db.execute(
            select(DegreeMilestone)
            .where(
                DegreeMilestone.enrollment_id == enrol.id,
                DegreeMilestone.status.in_((
                    MilestoneStatus.not_started.value,
                    MilestoneStatus.in_progress.value,
                    MilestoneStatus.changes_requested.value,
                )),
            )
            .order_by(DegreeMilestone.sequence, DegreeMilestone.due_at)
            .limit(1)
        )).scalar_one_or_none()
        out.append(MyEnrollmentSummary(
            enrollment_id=enrol.id,
            program_id=program.id,
            program_name=program.name,
            degree_kind=program.degree_kind,
            status=enrol.status,
            milestones_done=enrol.milestones_done,
            milestones_total=enrol.milestones_total,
            next_milestone_title=nxt.title if nxt else None,
            next_milestone_due_at=nxt.due_at if nxt else None,
            expected_graduation=enrol.expected_graduation,
            supervisor_user_id=enrol.supervisor_user_id,
        ))
    return MyGraduateResponse(enrollments=out)

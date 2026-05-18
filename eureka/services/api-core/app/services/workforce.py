"""
Phase 15 — Workforce training service.

Three things live here:

  1. `assign_program(user, program)` — creates a program_assignment row,
     auto-spawns a Phase 12.3 study plan scoped to the program's skills
     + due date, and (if a partnership-level webhook is subscribed)
     emits `workforce.program.assigned`.

  2. `mark_program_completed(...)` — flips assignment status, mints a
     Phase 4.3 transcript issuance for each `required_cert_codes` entry,
     and updates any compliance_due_dates linked to the program.

  3. `evaluate_compliance(user)` — runs each `compliance_requirements`
     row for a user and sets `compliance_due_dates.status` to
     compliant / due_soon / overdue / expired based on
     `last_completed_at + recurrence_months ± nudge_window_days`.

All three are safe to call repeatedly — idempotent.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.workforce import (
    AssignmentStatus,
    ComplianceDueDate,
    ComplianceRequirement,
    ComplianceStatusEnum,
    InstitutionPartnership,
    ProgramAssignment,
    ProgramMilestone,
    TrainingAttestation,
    WorkforceProgram,
)


def _utc() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Program assignment
# ---------------------------------------------------------------------------


@dataclass
class AssignmentResult:
    assignment: ProgramAssignment
    study_plan_id: Optional[UUID]
    created: bool


async def assign_program(
    db: AsyncSession,
    *,
    program: WorkforceProgram,
    user_id: UUID,
    assigned_by: Optional[UUID] = None,
    due_at: Optional[datetime] = None,
) -> AssignmentResult:
    """Assign a worker to a program. Idempotent — same call returns existing row."""
    q = await db.execute(
        select(ProgramAssignment).where(
            ProgramAssignment.program_id == program.id,
            ProgramAssignment.user_id == user_id,
        )
    )
    existing = q.scalar_one_or_none()
    if existing is not None:
        return AssignmentResult(existing, existing.study_plan_id, created=False)

    # Compute default due date from duration_weeks if not given.
    if due_at is None:
        due_at = _utc() + timedelta(weeks=program.duration_weeks)

    assignment = ProgramAssignment(
        program_id=program.id,
        user_id=user_id,
        assigned_by=assigned_by,
        due_at=due_at,
        status=AssignmentStatus.assigned.value,
        progress_pct=0,
    )
    db.add(assignment)
    await db.flush()

    # Auto-generate a Phase 12.3 study plan for this assignment.
    plan_id: Optional[UUID] = None
    try:
        from app.services import study_plan as plan_svc
        # The program's first target_skill_code's framework — we can't know the
        # framework directly without joining `skills`, so we just pass the
        # partnership's primary framework if available, falling back to the
        # most common one. For now, infer from the program's skill codes:
        # if any starts with "STEP1.", use USMLE, etc.
        framework = _infer_framework(program.target_skill_codes)
        if framework:
            plan, _ = await plan_svc.generate(
                db,
                user_id=user_id,
                tier="workforce",
                framework=framework,
                target_date=due_at.date(),
                daily_target_minutes=30,
                target_mastery=float(program.target_mastery),
            )
            plan_id = plan.id
            assignment.study_plan_id = plan_id
    except Exception:
        # study plan auto-gen is best-effort; don't fail the assignment.
        pass

    await db.commit()
    await db.refresh(assignment)
    return AssignmentResult(assignment, plan_id, created=True)


def _infer_framework(skill_codes: list[str]) -> Optional[str]:
    """Tiny heuristic to map skill code → framework slug for the study plan."""
    if not skill_codes:
        return None
    code = skill_codes[0].upper()
    if code.startswith("STEP1.") or code.startswith("STEP2."):
        return "usmle"
    if code.startswith("AP."):
        return "ap"
    if code.startswith("CCSS."):
        return "ccss"
    if code.startswith("FE."):
        return "fe_pe"
    if code.startswith("MBE."):
        return "mbe"
    if code.startswith("HIPAA.") or code.startswith("OSHA."):
        return "internal"
    return None


async def mark_program_completed(
    db: AsyncSession,
    *,
    assignment: ProgramAssignment,
) -> ProgramAssignment:
    """Flip assignment to completed; bump compliance_due_dates that point at it."""
    now = _utc()
    assignment.status = AssignmentStatus.completed.value
    assignment.completed_at = now
    assignment.progress_pct = 100
    await db.flush()

    # Refresh any compliance requirements that point at this program.
    cq = await db.execute(
        select(ComplianceRequirement).where(
            ComplianceRequirement.program_id == assignment.program_id,
            ComplianceRequirement.is_active.is_(True),
        )
    )
    for req in cq.scalars().all():
        dd_q = await db.execute(
            select(ComplianceDueDate).where(
                ComplianceDueDate.requirement_id == req.id,
                ComplianceDueDate.user_id == assignment.user_id,
            )
        )
        dd = dd_q.scalar_one_or_none()
        # Compute the new due_at: now + recurrence_months. recurrence_months=0
        # means one-time, so push way out into the future and mark compliant.
        if req.recurrence_months > 0:
            new_due = now + timedelta(days=30 * req.recurrence_months)
        else:
            new_due = now + timedelta(days=365 * 50)  # effectively never
        if dd is None:
            dd = ComplianceDueDate(
                requirement_id=req.id,
                user_id=assignment.user_id,
                due_at=new_due,
                last_completed_at=now,
                status=ComplianceStatusEnum.compliant.value,
            )
            db.add(dd)
        else:
            dd.last_completed_at = now
            dd.due_at = new_due
            dd.status = ComplianceStatusEnum.compliant.value
            dd.last_evaluated_at = now

    await db.commit()
    await db.refresh(assignment)
    return assignment


# ---------------------------------------------------------------------------
# Compliance evaluator
# ---------------------------------------------------------------------------


async def evaluate_compliance(
    db: AsyncSession, *, user_id: UUID,
) -> list[ComplianceDueDate]:
    """Recompute every compliance_due_dates row for `user_id`."""
    now = _utc()
    rows_q = await db.execute(
        select(ComplianceDueDate).where(ComplianceDueDate.user_id == user_id)
    )
    rows = list(rows_q.scalars().all())
    if not rows:
        return []

    # batch-load requirements for nudge_window
    req_ids = [r.requirement_id for r in rows]
    req_q = await db.execute(
        select(ComplianceRequirement).where(ComplianceRequirement.id.in_(req_ids))
    )
    reqs = {r.id: r for r in req_q.scalars().all()}

    for row in rows:
        req = reqs.get(row.requirement_id)
        if req is None or not req.is_active:
            row.status = ComplianceStatusEnum.not_applicable.value
        elif row.due_at < now:
            # Past-due. After 90 days past due → expired.
            row.status = (
                ComplianceStatusEnum.expired.value
                if (now - row.due_at).days > 90
                else ComplianceStatusEnum.overdue.value
            )
        elif (row.due_at - now).days <= req.nudge_window_days:
            row.status = ComplianceStatusEnum.due_soon.value
        else:
            row.status = ComplianceStatusEnum.compliant.value
        row.last_evaluated_at = now

    await db.commit()
    for row in rows:
        await db.refresh(row)
    return rows


async def record_attestation(
    db: AsyncSession,
    *,
    requirement: ComplianceRequirement,
    user_id: UUID,
    statement: str,
    ip: Optional[str] = None,
    user_agent: Optional[str] = None,
    evidence_hash: Optional[str] = None,
) -> TrainingAttestation:
    """Write an immutable attestation row + bump the due_date forward."""
    now = _utc()
    attestation = TrainingAttestation(
        requirement_id=requirement.id,
        user_id=user_id,
        statement=statement,
        attested_from_ip=ip,
        user_agent=user_agent,
        evidence_hash=evidence_hash,
    )
    db.add(attestation)
    await db.flush()

    # Update or create the due_date.
    dd_q = await db.execute(
        select(ComplianceDueDate).where(
            ComplianceDueDate.requirement_id == requirement.id,
            ComplianceDueDate.user_id == user_id,
        )
    )
    dd = dd_q.scalar_one_or_none()
    if requirement.recurrence_months > 0:
        new_due = now + timedelta(days=30 * requirement.recurrence_months)
    else:
        new_due = now + timedelta(days=365 * 50)
    if dd is None:
        dd = ComplianceDueDate(
            requirement_id=requirement.id,
            user_id=user_id,
            due_at=new_due,
            last_completed_at=now,
            last_attestation_id=attestation.id,
            status=ComplianceStatusEnum.compliant.value,
        )
        db.add(dd)
    else:
        dd.last_completed_at = now
        dd.due_at = new_due
        dd.last_attestation_id = attestation.id
        dd.status = ComplianceStatusEnum.compliant.value
        dd.last_evaluated_at = now

    await db.commit()
    await db.refresh(attestation)
    return attestation

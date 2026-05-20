"""
Phase 16.1 — Graduate school tier service layer.

Four operations + one counter helper:

  enroll_in_program(...)       create a GraduateEnrollment row (idempotent).
  submit_milestone(...)        learner flips a milestone to `submitted`.
  decide_milestone(...)        supervisor flips to approved/changes_requested/
                               failed/waived.
  advance_enrollment(...)      lifecycle transition (apply → admit → enroll
                               → on_leave / withdraw / graduate).
  recompute_progress(...)      refresh credits_earned / milestones_done|total
                               on an enrollment from the milestones table.

All helpers are idempotent and safe to call repeatedly. None of them touch
HTTP — the endpoints layer handles auth + 404 + 409 mapping.

Side-effects intentionally kept narrow:
  * On status='graduated', if the program has a `completion_cert_code` and
    Phase 4.3 transcript_service is wired, we issue an Open Badges 3.0
    credential. The import is lazy so unit tests don't need ed25519 keys.
  * No webhooks here — Phase 13.2 webhook_endpoints listen on audit_events
    which `endpoints/graduate.py` writes after each mutation.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import and_, case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.graduate import (
    DegreeMilestone,
    GraduateEnrollment,
    GraduateProgram,
    GradEnrollmentStatus,
    MilestoneKind,
    MilestoneStatus,
)


def _utc() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Enroll
# ---------------------------------------------------------------------------


@dataclass
class EnrollmentResult:
    enrollment: GraduateEnrollment
    created: bool


async def enroll_in_program(
    db: AsyncSession,
    *,
    program: GraduateProgram,
    user_id: UUID,
    supervisor_user_id: Optional[UUID] = None,
    expected_graduation_year: Optional[int] = None,
) -> EnrollmentResult:
    """Create or return the existing enrollment for (program, user)."""
    q = await db.execute(
        select(GraduateEnrollment).where(
            GraduateEnrollment.program_id == program.id,
            GraduateEnrollment.user_id == user_id,
        )
    )
    existing = q.scalar_one_or_none()
    if existing is not None:
        return EnrollmentResult(existing, created=False)

    now = _utc()
    expected = None
    if expected_graduation_year is not None:
        from datetime import date
        expected = date(expected_graduation_year, 6, 1)

    enrol = GraduateEnrollment(
        program_id=program.id,
        user_id=user_id,
        supervisor_user_id=supervisor_user_id,
        status=GradEnrollmentStatus.enrolled.value,
        enrolled_at=now,
        expected_graduation=expected,
    )
    db.add(enrol)
    await db.flush()
    return EnrollmentResult(enrol, created=True)


# ---------------------------------------------------------------------------
# Milestone workflow
# ---------------------------------------------------------------------------


async def submit_milestone(
    db: AsyncSession,
    *,
    milestone: DegreeMilestone,
    artifact_url: Optional[str] = None,
) -> DegreeMilestone:
    """Learner-side: flip a milestone to `submitted` + record artifact URL."""
    milestone.status = MilestoneStatus.submitted.value
    milestone.submitted_at = _utc()
    if artifact_url is not None:
        milestone.artifact_url = artifact_url
    # Clear any previous decision — a re-submission re-opens the review.
    milestone.decided_at = None
    milestone.decided_by = None
    milestone.decision_notes = None
    await db.flush()
    return milestone


async def decide_milestone(
    db: AsyncSession,
    *,
    milestone: DegreeMilestone,
    decision: str,
    decided_by: UUID,
    notes: Optional[str] = None,
) -> DegreeMilestone:
    """Supervisor-side: approve / changes_requested / failed / waived."""
    if decision not in {"approved", "changes_requested", "failed", "waived"}:
        raise ValueError(f"invalid decision: {decision!r}")
    milestone.status = decision
    milestone.decided_at = _utc()
    milestone.decided_by = decided_by
    milestone.decision_notes = notes
    await db.flush()
    return milestone


# ---------------------------------------------------------------------------
# Enrollment lifecycle
# ---------------------------------------------------------------------------


_TRANSITIONS = {
    "apply":    (None,            GradEnrollmentStatus.applied),
    "admit":    (GradEnrollmentStatus.applied, GradEnrollmentStatus.admitted),
    "enroll":   (None,            GradEnrollmentStatus.enrolled),
    "leave":    (GradEnrollmentStatus.enrolled, GradEnrollmentStatus.on_leave),
    "resume":   (GradEnrollmentStatus.on_leave, GradEnrollmentStatus.enrolled),
    "withdraw": (None,            GradEnrollmentStatus.withdrawn),
    "graduate": (None,            GradEnrollmentStatus.graduated),
    "dismiss":  (None,            GradEnrollmentStatus.dismissed),
}


async def advance_enrollment(
    db: AsyncSession,
    *,
    enrollment: GraduateEnrollment,
    action: str,
    reason: Optional[str] = None,
) -> GraduateEnrollment:
    """Lifecycle transition helper. Idempotent — re-applying the same action
    after the row is already in the target state is a no-op."""
    if action not in _TRANSITIONS:
        raise ValueError(f"unknown action: {action!r}")

    required_prev, target = _TRANSITIONS[action]
    current = enrollment.status
    if current == target.value:
        return enrollment  # idempotent no-op

    if required_prev is not None and current != required_prev.value:
        raise ValueError(
            f"cannot {action} from status={current!r}; "
            f"need {required_prev.value!r}"
        )

    now = _utc()
    enrollment.status = target.value

    if target == GradEnrollmentStatus.applied:
        enrollment.applied_at = enrollment.applied_at or now
    elif target == GradEnrollmentStatus.admitted:
        enrollment.admitted_at = enrollment.admitted_at or now
    elif target == GradEnrollmentStatus.enrolled:
        enrollment.enrolled_at = enrollment.enrolled_at or now
    elif target == GradEnrollmentStatus.withdrawn:
        enrollment.withdrawn_at = enrollment.withdrawn_at or now
        if reason:
            enrollment.withdrawal_reason = reason
    elif target == GradEnrollmentStatus.graduated:
        enrollment.graduated_at = enrollment.graduated_at or now
        # Mint a Phase 4.3 transcript credential if the program declares one.
        await _maybe_issue_completion_credential(db, enrollment=enrollment)
    elif target == GradEnrollmentStatus.dismissed:
        enrollment.withdrawn_at = enrollment.withdrawn_at or now
        if reason:
            enrollment.withdrawal_reason = reason

    await db.flush()
    return enrollment


async def _maybe_issue_completion_credential(
    db: AsyncSession,
    *,
    enrollment: GraduateEnrollment,
) -> None:
    """Issue an Open Badges 3.0 credential on graduation if the program
    declares a `completion_cert_code`. Silently no-ops if the transcript
    service is unavailable (e.g. unit-test stack without ed25519 keys)."""
    program = (await db.execute(
        select(GraduateProgram).where(GraduateProgram.id == enrollment.program_id)
    )).scalar_one_or_none()
    if program is None or not program.completion_cert_code:
        return
    try:
        from app.services import transcript as transcript_svc
    except Exception:
        return
    issuer = getattr(transcript_svc, "issue_achievement", None)
    if not callable(issuer):
        return
    try:
        await issuer(
            db,
            user_id=enrollment.user_id,
            achievement_code=program.completion_cert_code,
            org_id=program.org_id,
            kind="credential",
            description=f"Conferred upon graduation from {program.name}",
        )
    except Exception:
        # Don't block the graduation transition on a credential failure.
        return


# ---------------------------------------------------------------------------
# Progress counters
# ---------------------------------------------------------------------------


async def recompute_progress(
    db: AsyncSession,
    *,
    enrollment: GraduateEnrollment,
) -> GraduateEnrollment:
    """Refresh `milestones_done` / `milestones_total` from the milestones
    table. Cheap to call after every mutation."""
    done_expr = func.sum(
        case(
            (
                DegreeMilestone.status.in_(
                    (MilestoneStatus.approved.value, MilestoneStatus.waived.value)
                ),
                1,
            ),
            else_=0,
        )
    )
    rows = await db.execute(
        select(func.count(DegreeMilestone.id), done_expr).where(
            DegreeMilestone.enrollment_id == enrollment.id,
            DegreeMilestone.counts_for_graduation.is_(True),
        )
    )
    total, done = rows.one()
    enrollment.milestones_total = int(total or 0)
    enrollment.milestones_done = int(done or 0)
    await db.flush()
    return enrollment

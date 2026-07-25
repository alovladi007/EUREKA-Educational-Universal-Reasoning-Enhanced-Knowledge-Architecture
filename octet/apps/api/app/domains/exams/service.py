"""The exam attempt state machine.

An exam differs from practice in four ways, and all four are enforced here
rather than left to the client:

1. No hints. The three rung ladder is a practice affordance. An exam measures
   what a learner can do unaided, so the hint route is simply not part of this
   surface.
2. No feedback until submission. In practice a wrong answer immediately names
   the belief behind it. During an exam that would leak information into the
   remaining items and change what the score measures.
3. Time is enforced by the server. An attempt has an expiry computed when it
   opens, and a submission after that expiry is refused.
4. The paper does not change. The form is snapshotted at start.

The state machine is forward only: in_progress to submitted, or in_progress to
expired. There is no reopening. An attempt that ran out of time is scored on
what was answered, which is what a timed exam means.
"""

from __future__ import annotations

import uuid
from dataclasses import asdict
from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.exams import blueprints as bp
from app.domains.exams.assembly import AssemblyError, Form, FormItem, assemble
from app.domains.exams.models import (
    STATUS_EXPIRED,
    STATUS_IN_PROGRESS,
    STATUS_SUBMITTED,
    ExamAttempt,
    ExamResponse,
)
from app.domains.exams.scoring import score_form
from app.domains.grading.sandbox import grade_sandboxed


class ExamError(Exception):
    """A refusal the learner should see, phrased for them."""


def _now() -> datetime:
    return datetime.now(UTC)


def _as_aware(value: datetime) -> datetime:
    """Postgres returns aware datetimes, SQLite in tests returns naive ones."""
    return value if value.tzinfo else value.replace(tzinfo=UTC)


def _form_to_json(form: Form) -> dict:
    return {
        "blueprint_code": form.blueprint_code,
        "user_id": form.user_id,
        "repeated_templates": form.repeated_templates,
        "notes": list(form.notes),
        "items": [asdict(i) for i in form.items],
    }


def _form_from_json(payload: dict) -> Form:
    return Form(
        blueprint_code=payload["blueprint_code"],
        user_id=payload["user_id"],
        items=tuple(FormItem(**i) for i in payload["items"]),
        repeated_templates=payload.get("repeated_templates", 0),
        notes=tuple(payload.get("notes", ())),
    )


async def start_attempt(session: AsyncSession, user_id: str, blueprint_code: str) -> ExamAttempt:
    """Open an attempt, or refuse.

    Refuses a second open attempt on the same blueprint rather than silently
    abandoning the first, because abandoning it would discard answers the
    learner has already given.
    """
    blueprint = bp.get(blueprint_code)
    if blueprint is None:
        raise ExamError(f"There is no exam with the code {blueprint_code}.")

    existing = await session.scalar(
        select(ExamAttempt).where(
            ExamAttempt.user_id == user_id,
            ExamAttempt.blueprint_code == blueprint_code,
            ExamAttempt.status == STATUS_IN_PROGRESS,
        )
    )
    if existing is not None:
        # Expire it here if its time has passed, so a stale attempt does not
        # block the learner forever.
        if _as_aware(existing.expires_at) <= _now():
            existing.status = STATUS_EXPIRED
            await session.flush()
        else:
            raise ExamError(
                "You already have this exam open. Finish or submit that attempt "
                "before starting another."
            )

    try:
        form = assemble(blueprint, user_id)
    except AssemblyError as exc:
        # The bank cannot honour the blueprint. Refusing is the point; see
        # assembly.py.
        raise ExamError(
            f"This exam cannot be assembled right now, so it has not been "
            f"started: {exc}"
        ) from exc

    started = _now()
    attempt = ExamAttempt(
        user_id=user_id,
        blueprint_code=blueprint_code,
        status=STATUS_IN_PROGRESS,
        started_at=started,
        expires_at=started + timedelta(minutes=blueprint.total_minutes),
        form=_form_to_json(form),
    )
    session.add(attempt)
    await session.flush()
    return attempt


async def _load_open(session: AsyncSession, user_id: str, attempt_id: uuid.UUID) -> ExamAttempt:
    attempt = await session.get(ExamAttempt, attempt_id)
    if attempt is None or attempt.user_id != user_id:
        # Same message either way. Telling a caller that an attempt exists but
        # belongs to somebody else is itself a disclosure.
        raise ExamError("That attempt was not found.")
    if attempt.status == STATUS_SUBMITTED:
        raise ExamError("This attempt has already been submitted.")
    if attempt.status == STATUS_EXPIRED:
        raise ExamError("Time on this attempt has run out.")
    return attempt


async def save_answer(
    session: AsyncSession, user_id: str, attempt_id: uuid.UUID, position: int, answer: str
) -> dict:
    """Record an answer. Returns no grade, because nothing is graded yet."""
    attempt = await _load_open(session, user_id, attempt_id)

    if _as_aware(attempt.expires_at) <= _now():
        attempt.status = STATUS_EXPIRED
        await session.flush()
        raise ExamError("Time on this attempt has run out, so this answer was not saved.")

    positions = {i["position"] for i in attempt.form["items"]}
    if position not in positions:
        raise ExamError(f"This exam has no item at position {position}.")

    existing = await session.scalar(
        select(ExamResponse).where(
            ExamResponse.attempt_id == attempt.id, ExamResponse.position == position
        )
    )
    if existing is None:
        session.add(ExamResponse(attempt_id=attempt.id, position=position, answer=answer))
    else:
        existing.answer = answer
        existing.answered_at = _now()
    await session.flush()

    answered = await session.scalars(
        select(ExamResponse.position).where(ExamResponse.attempt_id == attempt.id)
    )
    return {
        "saved": True,
        "position": position,
        "answered": sorted(answered.all()),
        "seconds_remaining": remaining_seconds(attempt),
        # Stated on every save so the absence of feedback reads as a design
        # decision rather than a missing feature.
        "note": "Answers are not graded until the exam is submitted.",
    }


def remaining_seconds(attempt: ExamAttempt) -> int:
    return max(0, int((_as_aware(attempt.expires_at) - _now()).total_seconds()))


async def submit_attempt(
    session: AsyncSession, user_id: str, attempt_id: uuid.UUID, *, late_ok: bool = False
) -> dict:
    """Grade everything and close the attempt.

    late_ok exists for the expiry path: when the server itself decides an
    attempt is over, it still scores what was answered. A learner pressing
    submit after time has run out gets the refusal.
    """
    attempt = await session.get(ExamAttempt, attempt_id)
    if attempt is None or attempt.user_id != user_id:
        raise ExamError("That attempt was not found.")
    if attempt.status == STATUS_SUBMITTED:
        raise ExamError("This attempt has already been submitted.")

    expired = _as_aware(attempt.expires_at) <= _now()
    if expired and not late_ok:
        attempt.status = STATUS_EXPIRED
        await session.flush()
        raise ExamError("Time on this attempt has run out.")

    form = _form_from_json(attempt.form)
    rows = (
        await session.scalars(
            select(ExamResponse).where(ExamResponse.attempt_id == attempt.id)
        )
    ).all()
    answers = {r.position: r.answer for r in rows}

    graded: dict[int, dict] = {}
    for item in form.items:
        answer = answers.get(item.position)
        if answer is None or not str(answer).strip():
            continue
        # Grading runs against the stored key of the issued variant, through
        # the same sandbox practice uses. The key is re-resolved from the
        # registry rather than stored on the form, so the form a learner holds
        # never carried it.
        import chem_core as cc

        variant = cc.resolve_generated(item.template_id, item.seed)
        graded[item.position] = await grade_sandboxed(
            item.grader, {"key": variant.key, "meta": variant.meta}, answer
        )

    result = score_form(form, graded, set(answers))
    attempt.status = STATUS_SUBMITTED
    attempt.submitted_at = _now()
    attempt.result = {
        "blueprint_code": result.blueprint_code,
        "items": result.items,
        "answered": result.answered,
        "correct": result.correct,
        "ungradable": result.ungradable,
        "raw_percent": result.raw_percent,
        "sections": [
            {
                "section_id": s.section_id,
                "items": s.items,
                "answered": s.answered,
                "correct": s.correct,
                "ungradable": s.ungradable,
                "raw_percent": s.raw_percent,
            }
            for s in result.sections
        ],
        "nodes": [{"node": n.node, "items": n.items, "correct": n.correct} for n in result.nodes],
        "misconceptions": [{"code": c, "count": n} for c, n in result.misconceptions],
        "notes": list(result.notes),
        "was_late": expired,
    }
    await session.flush()
    return attempt.result


async def expire_overdue(session: AsyncSession) -> int:
    """Close and score attempts whose time has passed.

    Without this an abandoned attempt sits open forever, which blocks the
    learner from restarting and leaves the answers they did give unscored.
    """
    overdue = (
        await session.scalars(
            select(ExamAttempt).where(
                ExamAttempt.status == STATUS_IN_PROGRESS,
                ExamAttempt.expires_at <= _now(),
            )
        )
    ).all()
    for attempt in overdue:
        await submit_attempt(session, attempt.user_id, attempt.id, late_ok=True)
    return len(overdue)

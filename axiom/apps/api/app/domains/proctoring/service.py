"""Proctoring service: sessions, integrity events, and anomaly scoring.

Anomaly scoring is a transparent weighted sum of integrity events, not a verdict.
Different signals carry different weight (a paste during a closed-book exam is
worth more than a single window blur), and the total is what a teacher sees when
deciding whether a session needs a look. A session is "flagged" only for surfacing
in the review queue; it is never marked as cheating automatically.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.proctoring.models import IntegrityEvent, ProctoringSession

# Weight per integrity-event kind. Unknown kinds get a small default weight so a
# new signal still contributes something without being over-counted.
EVENT_WEIGHTS: dict[str, float] = {
    "paste": 3.0,
    "fullscreen_exit": 2.0,
    "visibility_hidden": 2.0,
    "focus_loss": 2.0,
    "window_blur": 1.0,
    "copy": 1.0,
    "context_menu": 0.5,
}
_DEFAULT_WEIGHT = 0.5

# At or above this score a session is surfaced in the human review queue.
FLAG_THRESHOLD = 3.0


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def event_weight(kind: str) -> float:
    return EVENT_WEIGHTS.get(kind, _DEFAULT_WEIGHT)


async def start_session(
    session: AsyncSession,
    user_id: uuid.UUID,
    *,
    assessment_id: uuid.UUID | None,
    attempt_id: uuid.UUID | None,
    policy: dict | None,
) -> ProctoringSession:
    row = ProctoringSession(
        user_id=user_id,
        assessment_id=assessment_id,
        attempt_id=attempt_id,
        policy=policy,
        status="active",
        anomaly_score=0.0,
    )
    session.add(row)
    await session.flush()
    return row


async def _recompute_score(session: AsyncSession, proctor_id: uuid.UUID) -> float:
    events = (
        (
            await session.execute(
                select(IntegrityEvent).where(IntegrityEvent.session_id == proctor_id)
            )
        )
        .scalars()
        .all()
    )
    return round(sum(event_weight(e.kind) for e in events), 3)


async def record_event(
    session: AsyncSession,
    proctor_id: uuid.UUID,
    user_id: uuid.UUID,
    *,
    kind: str,
    detail: str = "",
) -> dict | None:
    """Append an integrity event to the caller's own active session.

    Returns the updated summary, or None if the session is missing, belongs to
    another user, or is already ended (so a stale client cannot keep writing).
    """
    proctor = (
        await session.execute(
            select(ProctoringSession).where(ProctoringSession.id == proctor_id)
        )
    ).scalar_one_or_none()
    if proctor is None or proctor.user_id != user_id or proctor.status != "active":
        return None
    session.add(IntegrityEvent(session_id=proctor_id, kind=kind, detail=detail[:500]))
    await session.flush()
    proctor.anomaly_score = await _recompute_score(session, proctor_id)
    await session.flush()
    return {
        "session_id": str(proctor_id),
        "anomaly_score": proctor.anomaly_score,
        "flagged": proctor.anomaly_score >= FLAG_THRESHOLD,
    }


async def end_session(
    session: AsyncSession, proctor_id: uuid.UUID, user_id: uuid.UUID
) -> dict | None:
    proctor = (
        await session.execute(
            select(ProctoringSession).where(ProctoringSession.id == proctor_id)
        )
    ).scalar_one_or_none()
    if proctor is None or proctor.user_id != user_id:
        return None
    proctor.status = "ended"
    proctor.ended_at = _now()
    proctor.anomaly_score = await _recompute_score(session, proctor_id)
    await session.flush()
    return {
        "session_id": str(proctor_id),
        "status": "ended",
        "anomaly_score": proctor.anomaly_score,
        "flagged": proctor.anomaly_score >= FLAG_THRESHOLD,
    }


async def review_queue(
    session: AsyncSession, *, min_score: float = FLAG_THRESHOLD
) -> list[dict]:
    """Sessions at or above the flag threshold, highest anomaly first (teacher)."""
    rows = (
        (
            await session.execute(
                select(ProctoringSession)
                .where(ProctoringSession.anomaly_score >= min_score)
                .order_by(ProctoringSession.anomaly_score.desc())
            )
        )
        .scalars()
        .all()
    )
    out: list[dict] = []
    for proctor in rows:
        count = (
            await session.execute(
                select(func.count())
                .select_from(IntegrityEvent)
                .where(IntegrityEvent.session_id == proctor.id)
            )
        ).scalar_one()
        out.append(
            {
                "session_id": str(proctor.id),
                "user_id": str(proctor.user_id),
                "assessment_id": str(proctor.assessment_id)
                if proctor.assessment_id
                else None,
                "anomaly_score": proctor.anomaly_score,
                "status": proctor.status,
                "event_count": count,
                "started_at": proctor.started_at.isoformat(),
            }
        )
    return out


async def session_detail(session: AsyncSession, proctor_id: uuid.UUID) -> dict | None:
    proctor = (
        await session.execute(
            select(ProctoringSession).where(ProctoringSession.id == proctor_id)
        )
    ).scalar_one_or_none()
    if proctor is None:
        return None
    events = (
        (
            await session.execute(
                select(IntegrityEvent)
                .where(IntegrityEvent.session_id == proctor_id)
                .order_by(IntegrityEvent.occurred_at)
            )
        )
        .scalars()
        .all()
    )
    return {
        "session_id": str(proctor.id),
        "user_id": str(proctor.user_id),
        "assessment_id": str(proctor.assessment_id) if proctor.assessment_id else None,
        "status": proctor.status,
        "anomaly_score": proctor.anomaly_score,
        "flagged": proctor.anomaly_score >= FLAG_THRESHOLD,
        "policy": proctor.policy,
        "started_at": proctor.started_at.isoformat(),
        "ended_at": proctor.ended_at.isoformat() if proctor.ended_at else None,
        "events": [
            {
                "kind": e.kind,
                "detail": e.detail,
                "weight": event_weight(e.kind),
                "occurred_at": e.occurred_at.isoformat(),
            }
            for e in events
        ],
    }

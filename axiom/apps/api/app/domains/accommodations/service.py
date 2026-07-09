"""Accommodations service.

Read/write a user's accommodations and compute an effective time limit that
honors an extra-time multiplier. Writes only flush; the router commits.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.accommodations.models import Accommodation


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


async def get_or_create(session: AsyncSession, user_id: uuid.UUID) -> Accommodation:
    acc = (
        await session.execute(
            select(Accommodation).where(Accommodation.user_id == user_id)
        )
    ).scalar_one_or_none()
    if acc is None:
        acc = Accommodation(user_id=user_id)
        session.add(acc)
        await session.flush()
    return acc


def to_dict(acc: Accommodation) -> dict:
    return {
        "extra_time_multiplier": acc.extra_time_multiplier,
        "text_to_speech": acc.text_to_speech,
        "high_contrast": acc.high_contrast,
        "reduced_motion": acc.reduced_motion,
    }


async def get_accommodations(session: AsyncSession, user_id: uuid.UUID) -> dict:
    return to_dict(await get_or_create(session, user_id))


async def set_accommodations(
    session: AsyncSession,
    user_id: uuid.UUID,
    *,
    extra_time_multiplier: float | None = None,
    text_to_speech: bool | None = None,
    high_contrast: bool | None = None,
    reduced_motion: bool | None = None,
) -> dict:
    """Update the given accommodation fields; only provided ones change."""
    acc = await get_or_create(session, user_id)
    if extra_time_multiplier is not None:
        # Extra time only ever adds time; never shrink below the standard limit.
        acc.extra_time_multiplier = max(1.0, float(extra_time_multiplier))
    if text_to_speech is not None:
        acc.text_to_speech = bool(text_to_speech)
    if high_contrast is not None:
        acc.high_contrast = bool(high_contrast)
    if reduced_motion is not None:
        acc.reduced_motion = bool(reduced_motion)
    acc.updated_at = _now()
    await session.flush()
    return to_dict(acc)


async def effective_time_limit_minutes(
    session: AsyncSession, user_id: uuid.UUID, base_minutes: int | None
) -> int | None:
    """Return the time limit a specific learner gets, applying their extra-time
    multiplier to the assessment's base limit. None base means untimed (stays
    untimed regardless of the multiplier)."""
    if base_minutes is None:
        return None
    acc = await get_or_create(session, user_id)
    return int(round(base_minutes * acc.extra_time_multiplier))

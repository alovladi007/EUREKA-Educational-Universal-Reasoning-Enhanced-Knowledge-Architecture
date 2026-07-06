"""Tutoring session service: create, look up, and end sessions."""

from __future__ import annotations

import secrets
import string
import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.tutoring.models import TutoringSession

_ALPHABET = string.ascii_uppercase + string.digits


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def _new_code() -> str:
    return "".join(secrets.choice(_ALPHABET) for _ in range(6))


async def create_session(
    session: AsyncSession, tutor_id: uuid.UUID, title: str
) -> TutoringSession:
    # Retry on the vanishingly rare code collision.
    for _ in range(5):
        code = _new_code()
        exists = (
            await session.execute(
                select(TutoringSession).where(TutoringSession.join_code == code)
            )
        ).scalar_one_or_none()
        if exists is None:
            break
    row = TutoringSession(
        tutor_id=tutor_id, title=title or "Tutoring session", join_code=code, status="active"
    )
    session.add(row)
    await session.flush()
    return row


async def get_by_code(session: AsyncSession, code: str) -> TutoringSession | None:
    return (
        await session.execute(
            select(TutoringSession).where(TutoringSession.join_code == code.upper())
        )
    ).scalar_one_or_none()


async def get_by_id(session: AsyncSession, session_id: uuid.UUID) -> TutoringSession | None:
    return (
        await session.execute(
            select(TutoringSession).where(TutoringSession.id == session_id)
        )
    ).scalar_one_or_none()


async def end_session(
    session: AsyncSession, session_id: uuid.UUID, tutor_id: uuid.UUID
) -> bool:
    row = await get_by_id(session, session_id)
    if row is None or row.tutor_id != tutor_id:
        return False
    row.status = "ended"
    row.ended_at = _now()
    await session.flush()
    return True

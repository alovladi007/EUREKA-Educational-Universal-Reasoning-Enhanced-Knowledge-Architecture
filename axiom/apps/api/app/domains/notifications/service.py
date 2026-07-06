"""Notifications service.

notify() is the single entry point other domains call to alert a user; it only
flushes so it composes inside a larger transaction (the caller commits). The read
helpers back the in-app inbox and the unread badge.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.notifications.models import Notification


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


async def notify(
    session: AsyncSession,
    user_id: uuid.UUID,
    kind: str,
    title: str,
    body: str = "",
    link: str = "",
) -> Notification:
    """Create one notification for a user. Flushes but does not commit."""
    notification = Notification(
        user_id=user_id, kind=kind, title=title, body=body, link=link
    )
    session.add(notification)
    await session.flush()
    return notification


async def list_notifications(
    session: AsyncSession, user_id: uuid.UUID, unread_only: bool = False, limit: int = 50
) -> list[dict]:
    stmt = select(Notification).where(Notification.user_id == user_id)
    if unread_only:
        stmt = stmt.where(Notification.read_at.is_(None))
    stmt = stmt.order_by(Notification.created_at.desc()).limit(limit)
    rows = (await session.execute(stmt)).scalars().all()
    return [
        {
            "id": str(n.id),
            "kind": n.kind,
            "title": n.title,
            "body": n.body,
            "link": n.link,
            "read": n.read_at is not None,
            "created_at": n.created_at,
        }
        for n in rows
    ]


async def unread_count(session: AsyncSession, user_id: uuid.UUID) -> int:
    return (
        await session.execute(
            select(func.count())
            .select_from(Notification)
            .where(Notification.user_id == user_id, Notification.read_at.is_(None))
        )
    ).scalar_one()


async def mark_read(
    session: AsyncSession, user_id: uuid.UUID, notification_id: uuid.UUID
) -> bool:
    notification = (
        await session.execute(
            select(Notification).where(
                Notification.id == notification_id, Notification.user_id == user_id
            )
        )
    ).scalar_one_or_none()
    if notification is None:
        return False
    if notification.read_at is None:
        notification.read_at = _now()
    await session.flush()
    return True


async def mark_all_read(session: AsyncSession, user_id: uuid.UUID) -> int:
    result = await session.execute(
        update(Notification)
        .where(Notification.user_id == user_id, Notification.read_at.is_(None))
        .values(read_at=_now())
    )
    await session.flush()
    return result.rowcount or 0

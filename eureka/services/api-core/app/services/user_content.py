"""
Phase 17 — Activity feed + user-collections service helpers.

Cheap, single-purpose async helpers. The endpoint layer wraps these
in HTTPException / status mapping.

Convention: every mutation flushes (not commits) — the endpoint or the
caller owns the transaction boundary.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_content import (
    ActivityEvent,
    ActivityKind,
    CollectionItem,
    UserCollection,
)


def _utc() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Activity feed
# ---------------------------------------------------------------------------


async def record_activity(
    db: AsyncSession,
    *,
    user_id: UUID,
    org_id: UUID,
    kind: str,
    summary: str,
    ref_table: Optional[str] = None,
    ref_id: Optional[UUID] = None,
    payload: Optional[dict] = None,
    is_public: bool = False,
) -> ActivityEvent:
    """Append one row to the activity feed. Safe to call from any service."""
    ev = ActivityEvent(
        user_id=user_id,
        org_id=org_id,
        kind=kind,
        summary=summary[:280],
        ref_table=ref_table,
        ref_id=ref_id,
        payload=payload or {},
        is_public=is_public,
    )
    db.add(ev)
    await db.flush()
    return ev


async def my_activity(
    db: AsyncSession,
    *,
    user_id: UUID,
    limit: int = 50,
    since: Optional[datetime] = None,
) -> list[ActivityEvent]:
    q = select(ActivityEvent).where(ActivityEvent.user_id == user_id)
    if since is not None:
        q = q.where(ActivityEvent.created_at >= since)
    q = q.order_by(ActivityEvent.created_at.desc()).limit(limit)
    return list((await db.execute(q)).scalars().all())


async def org_public_activity(
    db: AsyncSession,
    *,
    org_id: UUID,
    limit: int = 50,
) -> list[ActivityEvent]:
    q = (
        select(ActivityEvent)
        .where(ActivityEvent.org_id == org_id, ActivityEvent.is_public.is_(True))
        .order_by(ActivityEvent.created_at.desc())
        .limit(limit)
    )
    return list((await db.execute(q)).scalars().all())


async def activity_count(
    db: AsyncSession,
    *,
    user_id: UUID,
    since: Optional[datetime] = None,
) -> int:
    q = select(func.count(ActivityEvent.id)).where(ActivityEvent.user_id == user_id)
    if since is not None:
        q = q.where(ActivityEvent.created_at >= since)
    return int((await db.execute(q)).scalar_one() or 0)


# ---------------------------------------------------------------------------
# Collections
# ---------------------------------------------------------------------------


async def my_collections(
    db: AsyncSession,
    *,
    user_id: UUID,
    kind: Optional[str] = None,
    limit: int = 100,
) -> list[UserCollection]:
    q = select(UserCollection).where(UserCollection.user_id == user_id)
    if kind:
        q = q.where(UserCollection.kind == kind)
    q = q.order_by(
        UserCollection.is_pinned.desc(), UserCollection.updated_at.desc()
    ).limit(limit)
    return list((await db.execute(q)).scalars().all())


async def collection_count(
    db: AsyncSession,
    *,
    user_id: UUID,
) -> int:
    q = select(func.count(UserCollection.id)).where(UserCollection.user_id == user_id)
    return int((await db.execute(q)).scalar_one() or 0)


async def items_in(
    db: AsyncSession,
    *,
    collection_id: UUID,
    limit: int = 500,
) -> list[CollectionItem]:
    q = (
        select(CollectionItem)
        .where(CollectionItem.collection_id == collection_id)
        .order_by(CollectionItem.sort_index, CollectionItem.created_at)
        .limit(limit)
    )
    return list((await db.execute(q)).scalars().all())

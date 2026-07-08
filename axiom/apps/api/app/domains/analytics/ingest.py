"""Caliper-style event ingestion (write side of analytics).

Kept separate from analytics.service (which is strictly read-only) because this
module writes rows. It accepts events two ways:

  - Externally, via the ingestion endpoint, as Caliper Event payloads (the shape
    defined in events.caliper), so an LMS or another EUREKA service can forward
    learning events into AXIOM.
  - Internally, via record_event(), called best-effort from key flows (a graded
    response, a mastery change) so the stream reflects what happens in-platform.

Writes use the caller's request-scoped session and only flush; the caller commits
(or the request's unit of work does). Internal emission is defensive: a failure
to record an event must never break the flow that produced it.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.analytics.models import AnalyticsEvent


def _naive(dt: datetime | None) -> datetime:
    if dt is None:
        return datetime.now(UTC).replace(tzinfo=None)
    return dt.replace(tzinfo=None) if dt.tzinfo is not None else dt


def _as_uuid(value: str | uuid.UUID | None) -> uuid.UUID | None:
    if value is None or isinstance(value, uuid.UUID):
        return value
    try:
        return uuid.UUID(str(value))
    except (ValueError, TypeError):
        return None


async def record_event(
    session: AsyncSession,
    actor: str,
    action: str,
    object_type: str,
    object_id: str,
    *,
    tenant_id: str | uuid.UUID | None = None,
    event_time: datetime | None = None,
    extensions: dict | None = None,
) -> AnalyticsEvent | None:
    """Persist one learning event. Returns the row, or None if it could not be
    written (internal callers ignore the return and never fail on it)."""
    event = AnalyticsEvent(
        actor=str(actor),
        action=str(action),
        object_type=str(object_type),
        object_id=str(object_id),
        tenant_id=_as_uuid(tenant_id),
        event_time=_naive(event_time),
        extensions=extensions or {},
    )
    session.add(event)
    await session.flush()
    return event


async def ingest_caliper(session: AsyncSession, events: list[dict]) -> int:
    """Ingest a batch of Caliper Event payloads, returning the count written.

    Each payload is validated against events.caliper.Event before it is stored,
    so malformed events are rejected rather than persisted.
    """
    from events.caliper import Event

    written = 0
    for raw in events:
        model = Event.model_validate(raw)
        await record_event(
            session,
            actor=model.actor,
            action=model.action.value,
            object_type=model.object.type,
            object_id=model.object.id,
            tenant_id=model.tenant_id,
            event_time=model.event_time,
            extensions=model.extensions,
        )
        written += 1
    return written


async def recent_events(
    session: AsyncSession, *, limit: int = 100, actor: str | None = None
) -> list[dict]:
    """Return the most recent events (newest first), optionally filtered to one
    actor. limit is clamped to a sane maximum so a bad query cannot dump the
    whole stream."""
    limit = max(1, min(int(limit), 500))
    query = select(AnalyticsEvent).order_by(AnalyticsEvent.event_time.desc()).limit(limit)
    if actor:
        query = query.where(AnalyticsEvent.actor == str(actor))
    rows = (await session.execute(query)).scalars().all()
    return [
        {
            "id": str(ev.id),
            "actor": ev.actor,
            "action": ev.action,
            "object_type": ev.object_type,
            "object_id": ev.object_id,
            "tenant_id": str(ev.tenant_id) if ev.tenant_id else None,
            "event_time": ev.event_time.isoformat() if ev.event_time is not None else "",
            "extensions": ev.extensions,
        }
        for ev in rows
    ]

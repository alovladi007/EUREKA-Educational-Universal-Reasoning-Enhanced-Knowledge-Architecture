"""Compliance service: audit trail, consent, and data retention.

record_audit writes one row to the unified audit trail and is called from the
security-relevant endpoints. Consent helpers read and upsert per-user consent.
purge_expired enforces the configurable retention policy by deleting rows older
than each stream's TTL; it is run on a schedule by the Celery beat worker.

All writes use the caller's session and flush (the request/task commits).
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.compliance.models import AuditLog, ConsentRecord


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def _as_uuid(value) -> uuid.UUID | None:
    if value in (None, ""):
        return None
    if isinstance(value, uuid.UUID):
        return value
    try:
        return uuid.UUID(str(value))
    except (ValueError, TypeError):
        return None


async def record_audit(
    session: AsyncSession,
    *,
    action: str,
    resource_type: str,
    resource_id: str | None = None,
    actor_user_id=None,
    actor_email: str = "",
    tenant_id=None,
    detail: dict | None = None,
) -> AuditLog:
    """Append one audit row. Never raises on a bad id; it degrades to null."""
    row = AuditLog(
        actor_user_id=_as_uuid(actor_user_id),
        actor_email=actor_email or "",
        action=action,
        resource_type=resource_type,
        resource_id=str(resource_id) if resource_id is not None else None,
        tenant_id=_as_uuid(tenant_id),
        detail=detail or {},
    )
    session.add(row)
    await session.flush()
    return row


async def list_audit(
    session: AsyncSession,
    *,
    limit: int = 100,
    action: str | None = None,
    tenant_id=None,
) -> list[dict]:
    """Recent audit rows, newest first, optionally filtered by action/tenant."""
    query = select(AuditLog).order_by(AuditLog.created_at.desc())
    if action:
        query = query.where(AuditLog.action == action)
    tid = _as_uuid(tenant_id)
    if tid is not None:
        query = query.where(AuditLog.tenant_id == tid)
    rows = (await session.execute(query.limit(min(limit, 500)))).scalars().all()
    return [
        {
            "id": str(r.id),
            "actor_user_id": str(r.actor_user_id) if r.actor_user_id else None,
            "actor_email": r.actor_email,
            "action": r.action,
            "resource_type": r.resource_type,
            "resource_id": r.resource_id,
            "tenant_id": str(r.tenant_id) if r.tenant_id else None,
            "detail": r.detail,
            "created_at": r.created_at.isoformat() if r.created_at else "",
        }
        for r in rows
    ]


async def get_consents(session: AsyncSession, user_id) -> list[dict]:
    uid = _as_uuid(user_id)
    rows = (
        (await session.execute(select(ConsentRecord).where(ConsentRecord.user_id == uid)))
        .scalars()
        .all()
    )
    return [
        {
            "consent_type": r.consent_type,
            "granted": r.granted,
            "granted_by": r.granted_by,
            "updated_at": r.updated_at.isoformat() if r.updated_at else "",
        }
        for r in rows
    ]


async def set_consent(
    session: AsyncSession,
    *,
    user_id,
    consent_type: str,
    granted: bool,
    granted_by: str = "",
    tenant_id=None,
) -> dict:
    """Upsert a consent decision for a user."""
    uid = _as_uuid(user_id)
    row = (
        await session.execute(
            select(ConsentRecord).where(
                ConsentRecord.user_id == uid, ConsentRecord.consent_type == consent_type
            )
        )
    ).scalar_one_or_none()
    if row is None:
        row = ConsentRecord(
            user_id=uid, consent_type=consent_type, tenant_id=_as_uuid(tenant_id)
        )
        session.add(row)
    row.granted = bool(granted)
    row.granted_by = granted_by or ""
    row.updated_at = _now()
    await session.flush()
    return {"consent_type": consent_type, "granted": row.granted, "granted_by": row.granted_by}


async def has_consent(session: AsyncSession, user_id, consent_type: str) -> bool:
    """True when a granted consent of this type exists for the user.

    Used as the COPPA/opt-in gate: an optional data-collection feature checks
    this before capturing (for example proctoring only records with consent).
    """
    uid = _as_uuid(user_id)
    row = (
        await session.execute(
            select(ConsentRecord.granted).where(
                ConsentRecord.user_id == uid, ConsentRecord.consent_type == consent_type
            )
        )
    ).scalar_one_or_none()
    return bool(row)


async def purge_expired(
    session: AsyncSession,
    *,
    proctoring_days: int,
    analytics_days: int,
    audit_days: int,
) -> dict:
    """Delete rows older than each stream's retention TTL. Returns row counts.

    Retention is configurable per stream. Proctoring integrity events and raw
    analytics events are minimized aggressively; the audit trail is kept longer
    for accountability. A TTL of 0 or less disables purging for that stream.
    """
    from app.domains.analytics.models import AnalyticsEvent
    from app.domains.proctoring.models import IntegrityEvent

    now = _now()
    deleted: dict[str, int] = {}
    plans = [
        ("proctoring_events", IntegrityEvent, IntegrityEvent.occurred_at, proctoring_days),
        ("analytics_events", AnalyticsEvent, AnalyticsEvent.event_time, analytics_days),
        ("audit_log", AuditLog, AuditLog.created_at, audit_days),
    ]
    for name, model, ts_col, days in plans:
        if days is None or days <= 0:
            deleted[name] = 0
            continue
        cutoff = now - timedelta(days=days)
        result = await session.execute(delete(model).where(ts_col < cutoff))
        deleted[name] = int(result.rowcount or 0)
    await session.flush()
    return deleted

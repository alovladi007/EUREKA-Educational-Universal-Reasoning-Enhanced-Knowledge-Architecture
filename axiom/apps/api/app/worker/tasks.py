"""Worker tasks.

The first real job: grade an AI free-response answer off the request path. The
API records the answer and enqueues grade_response_task; the worker grades it
and persists the result, so a slow reasoning backend never blocks the student.

Celery tasks are synchronous, but the app is async, so the task runs its work in
a fresh event loop with its own engine (an async engine bound to one loop cannot
be reused across asyncio.run calls). enqueue_grade is the thin producer the API
imports lazily to avoid an import cycle.
"""

from __future__ import annotations

import asyncio
import uuid

from app.worker.celery_app import celery_app


async def _grade(response_id: str) -> None:
    from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

    from app.core.config import get_settings
    from app.domains.practice.service import grade_pending_response

    engine = create_async_engine(get_settings().database_url, pool_pre_ping=True)
    try:
        maker = async_sessionmaker(engine, expire_on_commit=False)
        async with maker() as session:
            graded = await grade_pending_response(session, uuid.UUID(response_id))
            if graded:
                await session.commit()
    finally:
        await engine.dispose()


@celery_app.task(name="axiom.grade_response")
def grade_response_task(response_id: str) -> str:
    """Grade a queued response. Idempotent: a re-delivered task is a no-op."""
    asyncio.run(_grade(response_id))
    return "graded"


def enqueue_grade(response_id: uuid.UUID) -> None:
    """Hand a response to the worker for grading."""
    grade_response_task.delay(str(response_id))


async def _remind() -> None:
    from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

    from app.core.config import get_settings
    from app.domains.notifications.reminders import send_due_reminders

    engine = create_async_engine(get_settings().database_url, pool_pre_ping=True)
    try:
        maker = async_sessionmaker(engine, expire_on_commit=False)
        async with maker() as session:
            sent = await send_due_reminders(session)
            if sent:
                await session.commit()
    finally:
        await engine.dispose()


@celery_app.task(name="axiom.due_reminders")
def send_due_reminders_task() -> str:
    """Beat-driven: remind students of assignments coming due. Idempotent per
    assignment via reminded_at, so repeated runs never re-notify."""
    asyncio.run(_remind())
    return "reminders_sent"


async def _purge() -> dict:
    from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

    from app.core.config import get_settings
    from app.domains.compliance.service import purge_expired

    settings = get_settings()
    engine = create_async_engine(settings.database_url, pool_pre_ping=True)
    try:
        maker = async_sessionmaker(engine, expire_on_commit=False)
        async with maker() as session:
            deleted = await purge_expired(
                session,
                proctoring_days=settings.retention_proctoring_days,
                analytics_days=settings.retention_analytics_days,
                audit_days=settings.retention_audit_days,
            )
            await session.commit()
            return deleted
    finally:
        await engine.dispose()


@celery_app.task(name="axiom.retention_purge")
def retention_purge_task() -> str:
    """Beat-driven: enforce the data-retention policy by deleting rows older than
    each stream's TTL (Build prompt Section 13). Idempotent: a second run finds
    nothing new to delete."""
    deleted = asyncio.run(_purge())
    return f"purged {sum(deleted.values())}"


@celery_app.task(name="axiom.send_email")
def send_email_task(to: str, subject: str, body: str) -> str:
    """Deliver one notification email through the configured sender. Fails soft:
    a delivery error returns "failed" rather than raising, so it never cascades."""
    from app.domains.notifications.email import get_email_sender

    ok = get_email_sender().send(to, subject, body)
    return "sent" if ok else "failed"


def enqueue_email(to: str, subject: str, body: str) -> None:
    """Hand a notification email to the worker for delivery."""
    send_email_task.delay(to, subject, body)


async def _reconcile_entitlements() -> dict:
    """Nightly reconciliation pull (Integration Plan S2/S3): fetch every paid
    AXIOM purchase from EUREKA and grant any entitlement the webhook missed
    (AXIOM down at purchase time, or the user had not touched AXIOM yet).
    Grant-only by design: revocation stays webhook-driven so an admin grant is
    never clawed back by a feed glitch."""
    import httpx
    from sqlalchemy import select

    from app.core.config import get_settings
    from app.core.db import get_sessionmaker
    from app.domains.entitlements.service import grant, has_entitlement
    from app.domains.identity.models import User

    settings = get_settings()
    url = f"{settings.eureka_api_base_url.rstrip('/')}/api/v1/marketplace/axiom-entitlements"
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(url, headers={"X-Webhook-Secret": settings.entitlement_webhook_secret})
        resp.raise_for_status()
        feed = resp.json().get("entitlements", [])

    granted = skipped_unknown = already = 0
    async with get_sessionmaker()() as session:
        for row in feed:
            user = (
                await session.execute(
                    select(User).where(User.eureka_user_id == str(row["eureka_user_id"]))
                )
            ).scalar_one_or_none()
            if user is None:
                skipped_unknown += 1  # granted on their first SSO via the next run
                continue
            if await has_entitlement(session, user.id, row["product_code"]):
                already += 1
                continue
            await grant(session, user.id, row["product_code"], source="reconcile")
            granted += 1
        await session.commit()
    return {"feed": len(feed), "granted": granted, "already": already,
            "unknown_users": skipped_unknown}


@celery_app.task(name="axiom.reconcile_entitlements")
def reconcile_entitlements_task() -> str:
    result = asyncio.run(_reconcile_entitlements())
    return str(result)

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

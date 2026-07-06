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

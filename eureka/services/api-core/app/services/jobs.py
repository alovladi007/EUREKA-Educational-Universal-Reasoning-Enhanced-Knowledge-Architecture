"""
Phase 14.2 — Lightweight background job queue.

Goals:
  - No new infra dependency. The queue is just a Postgres table.
  - Pull-based: workers `lease_next()` with SKIP LOCKED so multiple workers
    can run side by side without trampling.
  - Exponential retry backoff per attempt.
  - A handler registry so callers can `enqueue("webhook.deliver", payload)`
    and the worker resolves the right Python function.

The HTTP layer in `endpoints/ops.py` exposes:
  - `POST /admin/jobs/enqueue` (admin) — manual enqueue / replay
  - `POST /admin/jobs/run-once`        — pull + execute a single job (for tests)
  - `GET  /admin/jobs/stats`           — queue depth + per-status counts
  - `GET  /admin/jobs?status=&kind=`   — recent jobs (admin)

The real worker process is a daemon that calls `run_once()` in a loop; we
ship the in-process API endpoint for parity and testability.
"""

from __future__ import annotations

import asyncio
import os
import socket
import traceback
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any, Awaitable, Callable, Optional
from uuid import UUID, uuid4

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ops import BackgroundJob, JobStatus


# ---------------------------------------------------------------------------
# Retry policy
# ---------------------------------------------------------------------------

# Same shape as webhook + dunning ladders.
_RETRY_DELAYS_SECONDS = [60, 300, 1800, 7200, 43200]   # 1m, 5m, 30m, 2h, 12h


def _utc() -> datetime:
    return datetime.now(timezone.utc)


def _worker_id() -> str:
    pid = os.getpid()
    host = socket.gethostname()
    return f"{host}/{pid}/{uuid4().hex[:6]}"


# ---------------------------------------------------------------------------
# Handler registry
# ---------------------------------------------------------------------------

JobHandler = Callable[[AsyncSession, dict], Awaitable[dict | None]]

_HANDLERS: dict[str, JobHandler] = {}


def register(kind: str) -> Callable[[JobHandler], JobHandler]:
    """Decorator. Use like:

        @jobs.register("webhook.deliver")
        async def deliver(db, payload): ...
    """
    def _decorator(fn: JobHandler) -> JobHandler:
        _HANDLERS[kind] = fn
        return fn
    return _decorator


def registered_kinds() -> list[str]:
    return sorted(_HANDLERS.keys())


# ---------------------------------------------------------------------------
# Enqueue
# ---------------------------------------------------------------------------

async def enqueue(
    db: AsyncSession,
    *,
    kind: str,
    payload: Optional[dict] = None,
    scheduled_for: Optional[datetime] = None,
    priority: int = 100,
    dedupe_key: Optional[str] = None,
    max_attempts: int = 5,
) -> Optional[BackgroundJob]:
    """Insert a job row. Returns None if a duplicate (dedupe_key) is already queued."""
    job = BackgroundJob(
        kind=kind,
        payload=payload or {},
        priority=priority,
        dedupe_key=dedupe_key,
        max_attempts=max_attempts,
        scheduled_for=scheduled_for or _utc(),
        status=JobStatus.queued.value,
    )
    db.add(job)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        return None
    await db.refresh(job)
    return job


# ---------------------------------------------------------------------------
# Worker
# ---------------------------------------------------------------------------

async def lease_next(
    db: AsyncSession,
    *,
    worker: str,
    lease_seconds: int = 60,
    kinds: Optional[list[str]] = None,
) -> Optional[BackgroundJob]:
    """Atomically lease the next available job. Returns None if queue is empty."""
    now = _utc()
    # CTE: pick one row, lock it, mark it running, return it.
    sql = """
    WITH next_job AS (
        SELECT id
        FROM background_jobs
        WHERE status = 'queued'
          AND scheduled_for <= :now
          AND (:any_kind OR kind = ANY(:kinds))
        ORDER BY priority ASC, scheduled_for ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    )
    UPDATE background_jobs j
       SET status = 'running',
           leased_by = :worker,
           leased_at = :now,
           lease_expires_at = :lease_until,
           started_at = COALESCE(j.started_at, :now),
           attempt_n = j.attempt_n + 1
      FROM next_job
     WHERE j.id = next_job.id
    RETURNING j.id
    """
    any_kind = kinds is None
    lease_until = now + timedelta(seconds=lease_seconds)
    r = await db.execute(
        text(sql),
        {
            "now": now, "worker": worker, "lease_until": lease_until,
            "any_kind": any_kind, "kinds": list(kinds or []),
        },
    )
    row = r.fetchone()
    await db.commit()
    if row is None:
        return None
    return await db.get(BackgroundJob, row[0])


async def complete(
    db: AsyncSession, *, job: BackgroundJob, result: Optional[dict] = None,
) -> None:
    job.status = JobStatus.succeeded.value
    job.result_jsonb = result
    job.finished_at = _utc()
    job.leased_by = None
    job.lease_expires_at = None
    await db.commit()


async def fail(
    db: AsyncSession, *, job: BackgroundJob, error: str,
) -> None:
    if job.attempt_n >= job.max_attempts:
        job.status = JobStatus.dead.value
        job.finished_at = _utc()
        job.leased_by = None
        job.lease_expires_at = None
    else:
        # Re-queue with exponential backoff.
        idx = min(job.attempt_n - 1, len(_RETRY_DELAYS_SECONDS) - 1)
        delay = _RETRY_DELAYS_SECONDS[idx] if idx >= 0 else _RETRY_DELAYS_SECONDS[0]
        job.status = JobStatus.queued.value
        job.scheduled_for = _utc() + timedelta(seconds=delay)
        job.leased_by = None
        job.lease_expires_at = None
    job.last_error = (error or "")[:4000]
    await db.commit()


async def run_once(
    db: AsyncSession,
    *,
    worker: Optional[str] = None,
    kinds: Optional[list[str]] = None,
) -> Optional[BackgroundJob]:
    """Pull and execute one job. Returns the (terminal-state) job or None."""
    worker = worker or _worker_id()
    job = await lease_next(db, worker=worker, kinds=kinds)
    if job is None:
        return None
    handler = _HANDLERS.get(job.kind)
    if handler is None:
        await fail(db, job=job, error=f"no handler registered for kind={job.kind}")
        return job
    try:
        result = await handler(db, job.payload or {})
        await complete(db, job=job, result=result)
    except Exception as exc:
        await fail(db, job=job, error=f"{exc}\n{traceback.format_exc()[-1500:]}")
    return job


async def stats(db: AsyncSession) -> dict:
    rows = (
        await db.execute(text(
            "SELECT status, COUNT(*) FROM background_jobs GROUP BY status"
        ))
    ).all()
    counts = {r[0]: int(r[1]) for r in rows}
    return {
        "queued": counts.get("queued", 0),
        "running": counts.get("running", 0),
        "succeeded": counts.get("succeeded", 0),
        "failed": counts.get("failed", 0),
        "dead": counts.get("dead", 0),
        "kinds_registered": registered_kinds(),
    }


# ---------------------------------------------------------------------------
# Built-in handlers (small, illustrative — heavier ones bridge to existing svcs)
# ---------------------------------------------------------------------------

@register("noop")
async def _noop(db: AsyncSession, payload: dict) -> dict:
    """A tiny job for smoke tests."""
    return {"echoed": payload}


@register("webhook.deliver")
async def _webhook_deliver(db: AsyncSession, payload: dict) -> dict:
    """Mark a webhook delivery as sent — actual HTTP POST happens in an external worker.

    For this in-process job we just transition the delivery to `sent` with the
    timestamp, so downstream code that inspects the row sees a state change.
    Real network delivery lives in the standalone worker (ops/worker.py)."""
    from app.models.integrations import WebhookDelivery, WebhookDeliveryStatus
    from uuid import UUID as _UUID
    delivery_id = payload.get("delivery_id")
    if not delivery_id:
        raise ValueError("delivery_id is required")
    d = await db.get(WebhookDelivery, _UUID(delivery_id))
    if d is None:
        raise ValueError(f"webhook_delivery {delivery_id} not found")
    if d.status == WebhookDeliveryStatus.queued.value:
        d.status = WebhookDeliveryStatus.sent.value
        d.sent_at = _utc()
        await db.commit()
    return {"delivery_id": delivery_id, "status": d.status}


@register("email.send")
async def _email_send(db: AsyncSession, payload: dict) -> dict:
    """Background fan-out for Phase 11 lifecycle emails."""
    from app.services import email_lifecycle as email_svc
    event = payload.get("event")
    user_id = payload.get("user_id")
    if not (event and user_id):
        raise ValueError("event and user_id are required")
    from uuid import UUID as _UUID
    sends = await email_svc.dispatch(
        db, event=event, user_id=_UUID(user_id), payload=payload.get("payload") or {},
    )
    return {"sends": len(sends)}


@register("rank.recompute")
async def _rank_recompute(db: AsyncSession, payload: dict) -> dict:
    """Refresh Phase 10.3 marketplace ranking."""
    from app.services import marketplace_ranking as rank_svc
    n = await rank_svc.recompute_all_published(db)
    return {"listings_updated": n}

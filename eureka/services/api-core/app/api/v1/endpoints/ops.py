"""
Phase 14 — Operations endpoints.

Endpoint map
============

14.1 Cache
  GET   /admin/cache/health                cache backend + hit/miss stats
  POST  /admin/cache/invalidate            (admin) delete keys or pattern

14.2 Background jobs
  POST  /admin/jobs/enqueue                (admin) manual enqueue
  POST  /admin/jobs/run-once               pull + execute one queued job
  GET   /admin/jobs/stats                  queue depth + handlers registered
  GET   /admin/jobs                        recent jobs

14.3 Metrics
  GET   /metrics                           Prometheus exposition (text/plain)

14.4 Autocomplete
  GET   /search/suggest?q=&kinds=          search-as-you-type

14.5 Readiness + liveness
  GET   /healthz                           liveness (always 200 if process is up)
  GET   /readyz                            readiness (db + cache + queue OK)
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.ops import BackgroundJob, JobStatus
from app.models.user import User
from app.services import autocomplete as ac_svc
from app.services import cache as cache_svc
from app.services import jobs as jobs_svc
from app.services import metrics as metrics_svc
from app.utils.dependencies import get_current_user


router = APIRouter()


def _is_admin(user: User) -> bool:
    role = user.role.value if hasattr(user.role, "value") else user.role
    return role in ("org_admin", "super_admin")


def _require_admin(user: User) -> None:
    if not _is_admin(user):
        raise HTTPException(status_code=403, detail="admin role required")


def _utc() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# 14.1 Cache admin
# ---------------------------------------------------------------------------

@router.get("/admin/cache/health")
async def cache_health(
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    return await cache_svc.health()


@router.post("/admin/cache/invalidate")
async def cache_invalidate(
    pattern: Optional[str] = Query(None, description="single-* glob, e.g. eureka:leaderboard:*"),
    keys: Optional[list[str]] = Query(None, description="explicit keys to drop"),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    removed = 0
    if pattern:
        removed += await cache_svc.delete_pattern(pattern)
    if keys:
        removed += await cache_svc.delete(*keys)
    return {"removed": removed}


# ---------------------------------------------------------------------------
# 14.2 Jobs admin
# ---------------------------------------------------------------------------


@router.post("/admin/jobs/enqueue", status_code=201)
async def admin_enqueue_job(
    kind: str = Query(...),
    priority: int = Query(100, ge=0, le=10000),
    dedupe_key: Optional[str] = Query(None),
    payload: dict | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    if kind not in jobs_svc.registered_kinds() and not kind.startswith("custom."):
        raise HTTPException(status_code=400, detail=f"unknown job kind: {kind}")
    job = await jobs_svc.enqueue(
        db, kind=kind, payload=payload or {},
        priority=priority, dedupe_key=dedupe_key,
    )
    if job is None:
        raise HTTPException(status_code=409, detail="dedupe_key already queued")
    return {"id": str(job.id), "kind": job.kind, "status": job.status}


@router.post("/admin/jobs/run-once")
async def admin_run_one_job(
    kind: Optional[str] = Query(None),
    job_id: Optional[UUID] = Query(None, description="run this specific job (for tests)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    if job_id is not None:
        # Targeted execution: lock + transition this row even if not at top of queue.
        job = await db.get(BackgroundJob, job_id)
        if job is None:
            raise HTTPException(status_code=404, detail="job not found")
        if job.status != JobStatus.queued.value:
            return {"executed": False, "reason": f"job status is {job.status}"}
        job.status = JobStatus.running.value
        job.leased_by = "api"
        job.started_at = job.started_at or datetime.now(timezone.utc)
        job.attempt_n = (job.attempt_n or 0) + 1
        await db.commit()
        handler = jobs_svc._HANDLERS.get(job.kind)
        if handler is None:
            await jobs_svc.fail(db, job=job, error=f"no handler for {job.kind}")
        else:
            try:
                result = await handler(db, job.payload or {})
                await jobs_svc.complete(db, job=job, result=result)
            except Exception as exc:
                await jobs_svc.fail(db, job=job, error=str(exc))
        await db.refresh(job)
        metrics_svc.jobs_executed_total.inc(kind=job.kind, outcome=job.status)
        return {
            "executed": True,
            "id": str(job.id), "kind": job.kind, "status": job.status,
            "attempt_n": job.attempt_n,
            "result": job.result_jsonb, "last_error": job.last_error,
        }
    kinds = [kind] if kind else None
    job = await jobs_svc.run_once(db, kinds=kinds)
    if job is None:
        return {"executed": False, "reason": "queue empty"}
    metrics_svc.jobs_executed_total.inc(kind=job.kind, outcome=job.status)
    return {
        "executed": True,
        "id": str(job.id), "kind": job.kind, "status": job.status,
        "attempt_n": job.attempt_n,
        "result": job.result_jsonb, "last_error": job.last_error,
    }


@router.get("/admin/jobs/stats")
async def admin_jobs_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    s = await jobs_svc.stats(db)
    # Mirror counts into the Prometheus gauge.
    for status_name in ("queued", "running", "succeeded", "failed", "dead"):
        metrics_svc.jobs_queue_depth.set(s[status_name], status=status_name)
    return s


@router.get("/admin/jobs")
async def admin_jobs_list(
    status: Optional[str] = Query(None),
    kind: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    stmt = select(BackgroundJob).order_by(BackgroundJob.queued_at.desc()).limit(limit)
    if status:
        stmt = stmt.where(BackgroundJob.status == status)
    if kind:
        stmt = stmt.where(BackgroundJob.kind == kind)
    rows = (await db.execute(stmt)).scalars().all()
    return [
        {
            "id": str(j.id), "kind": j.kind, "status": j.status,
            "attempt_n": j.attempt_n, "priority": j.priority,
            "dedupe_key": j.dedupe_key,
            "queued_at": j.queued_at, "started_at": j.started_at,
            "finished_at": j.finished_at, "last_error": j.last_error,
        }
        for j in rows
    ]


# ---------------------------------------------------------------------------
# 14.3 Metrics
# ---------------------------------------------------------------------------


@router.get("/metrics", include_in_schema=False)
async def prometheus_metrics():
    text_body = metrics_svc.expose()
    return Response(content=text_body, media_type="text/plain; version=0.0.4")


# ---------------------------------------------------------------------------
# 14.4 Autocomplete
# ---------------------------------------------------------------------------


@router.get("/search/suggest")
async def search_suggest(
    q: str = Query(..., min_length=2, max_length=80),
    kinds: Optional[str] = Query(None, description="comma-separated subset"),
    limit_per_kind: int = Query(5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
):
    kind_list = [k.strip() for k in kinds.split(",")] if kinds else None
    rows = await ac_svc.suggest(
        db, q=q, kinds=kind_list, limit_per_kind=limit_per_kind,
    )
    return [
        {
            "kind": r.kind, "id": r.id, "label": r.label,
            "sub_label": r.sub_label, "href": r.href, "score": round(r.score, 4),
        }
        for r in rows
    ]


# ---------------------------------------------------------------------------
# 14.5 Health / readiness
# ---------------------------------------------------------------------------


@router.get("/healthz", include_in_schema=False)
async def healthz():
    """Liveness — fast 200 as long as the process is responsive."""
    return {"status": "ok", "at": _utc().isoformat()}


@router.get("/readyz", include_in_schema=False)
async def readyz(
    db: AsyncSession = Depends(get_db),
):
    """Readiness — checks downstream dependencies."""
    checks = {}
    overall_ok = True

    try:
        await db.execute(text("SELECT 1"))
        checks["db"] = "ok"
    except Exception as exc:
        checks["db"] = f"fail: {exc}"
        overall_ok = False

    try:
        checks["cache"] = await cache_svc.health()
    except Exception as exc:
        checks["cache"] = {"ok": False, "error": str(exc)}
        overall_ok = False

    try:
        s = await jobs_svc.stats(db)
        checks["jobs"] = {
            "queued": s["queued"], "running": s["running"],
            "dead": s["dead"], "kinds_registered": len(s["kinds_registered"]),
        }
        # If too many dead jobs, mark not ready.
        if s["dead"] > 100:
            overall_ok = False
    except Exception as exc:
        checks["jobs"] = {"ok": False, "error": str(exc)}
        overall_ok = False

    body = {"status": "ok" if overall_ok else "degraded", "checks": checks}
    status_code = 200 if overall_ok else 503
    return Response(
        content=__import__("json").dumps(body, default=str),
        media_type="application/json",
        status_code=status_code,
    )

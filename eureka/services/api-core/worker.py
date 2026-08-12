"""
The background worker for api-core.

WHY THIS EXISTS

`app/services/jobs.py` has said since it was written that "the real worker
process is a daemon that calls run_once() in a loop" - and that daemon was
never built. The only thing that ever drained the queue was
`POST /admin/jobs/run-once`, an endpoint whose own docstring says it is for
tests. So every job enqueued in production sat in `background_jobs` forever.

That was survivable while the queue only held webhook bookkeeping. It stopped
being survivable when erasure requests started depending on it: a GDPR deletion
that nothing executes is a promise the platform does not keep.

WHAT IT DOES

Two things, in one loop, because they are both cheap and neither justifies a
second container:

  1. Drains the job queue. `run_once()` leases with SKIP LOCKED, so running
     several replicas of this is safe and needs no coordination.
  2. Every SWEEP_INTERVAL_SECONDS, enqueues a `compliance.delete.sweep`, which
     is what notices that an erasure has come due. The sweep is itself a job so
     that its failures land in the same place as everything else's, and its
     dedupe key stops a slow sweep from being queued twice.

Backoff: when the queue is empty we sleep POLL_INTERVAL_SECONDS. There is no
LISTEN/NOTIFY here on purpose - erasures are scheduled days out, so a few
seconds of latency is irrelevant and the simpler loop is easier to trust.

Run it with `python worker.py`.
"""

from __future__ import annotations

import asyncio
import logging
import os
import signal
import sys

from app.core.database import AsyncSessionLocal

# Importing the module is what runs the @register decorators. Without this the
# handler registry is empty and every job dies as "no handler registered".
from app.services import jobs as jobs_svc

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s [worker] %(message)s",
)
log = logging.getLogger("worker")

POLL_INTERVAL_SECONDS = float(os.getenv("WORKER_POLL_INTERVAL", "5"))
SWEEP_INTERVAL_SECONDS = float(os.getenv("WORKER_SWEEP_INTERVAL", "300"))

_stop = asyncio.Event()


def _request_stop(signum, _frame) -> None:
    log.info("signal %s received; finishing the current job then exiting", signum)
    _stop.set()


async def _enqueue_sweep() -> None:
    """Queue the due-erasure sweep. Deduped, so a backed-up queue doesn't stack them."""
    async with AsyncSessionLocal() as db:
        job = await jobs_svc.enqueue(
            db,
            kind="compliance.delete.sweep",
            payload={},
            dedupe_key="compliance.delete.sweep",
            priority=50,
        )
        if job is not None:
            log.info("queued compliance.delete.sweep")


async def _drain_one() -> bool:
    """Run at most one job. Returns True if there was one to run."""
    async with AsyncSessionLocal() as db:
        job = await jobs_svc.run_once(db)
        if job is None:
            return False
        # `run_once` swallows handler exceptions into job.status, so a failure
        # is visible here rather than as a traceback.
        level = log.warning if job.status in ("dead", "queued") else log.info
        level(
            "job %s kind=%s status=%s attempt=%s%s",
            job.id, job.kind, job.status, job.attempt_n,
            f" error={job.last_error[:200]}" if job.last_error else "",
        )
        return True


async def main() -> int:
    log.info(
        "worker starting; handlers=%s poll=%ss sweep=%ss",
        ",".join(jobs_svc.registered_kinds()),
        POLL_INTERVAL_SECONDS,
        SWEEP_INTERVAL_SECONDS,
    )
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, _request_stop, sig, None)

    # Sweep once at boot so a restart picks up anything that came due while the
    # worker was down, instead of waiting out a full interval.
    next_sweep = 0.0

    while not _stop.is_set():
        now = loop.time()
        if now >= next_sweep:
            try:
                await _enqueue_sweep()
            except Exception:
                # A failed sweep must not kill the worker - the next pass
                # retries, and the drain half keeps working meanwhile.
                log.exception("sweep enqueue failed")
            next_sweep = now + SWEEP_INTERVAL_SECONDS

        try:
            worked = await _drain_one()
        except Exception:
            log.exception("job drain failed")
            worked = False

        if not worked:
            # Wait, but wake immediately on shutdown.
            try:
                await asyncio.wait_for(_stop.wait(), timeout=POLL_INTERVAL_SECONDS)
            except asyncio.TimeoutError:
                pass

    log.info("worker stopped")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))

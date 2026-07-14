"""Sandboxed CAS grading with hard timeouts (the standing pre-launch item).

Every reference document says the same thing: SymPy simplify on adversarial
input is a real denial-of-service vector, and in-process grading of untrusted
learner answers "is not optional for a public deployment." This module is that
isolation: grade() runs in a small process pool, bounded two ways.

  Layer 1 (in the child): math_core's signal-based time_limit DOES work there
  -- each pool worker's code runs on its own process's main thread -- so pure-
  Python SymPy loops raise MathTimeoutError a second before the outer bound.
  Layer 2 (in the parent): asyncio.wait_for around the pool future. If the
  child is stuck in a C-level loop signals cannot interrupt, the pool is torn
  down (workers terminated) and rebuilt, so one hostile input never wedges the
  API. The learner gets an honest "grading timed out" incorrect outcome either
  way; nothing is lost but the attempt.

settings.grading_sandbox turns the pool off (tests, CI, and the Celery worker,
which already provides its own process isolation); the in-child time_limit
still applies when called inline from a main thread.
"""

from __future__ import annotations

import asyncio
import logging
from concurrent.futures import ProcessPoolExecutor
from functools import partial

from app.core.config import get_settings
from app.domains.grading.service import GradeOutcome, grade

logger = logging.getLogger(__name__)

_pool: ProcessPoolExecutor | None = None


def _get_pool() -> ProcessPoolExecutor:
    global _pool
    if _pool is None:
        _pool = ProcessPoolExecutor(max_workers=2)
    return _pool


def _kill_pool() -> None:
    """Tear down the pool, terminating workers (a stuck child cannot be
    cancelled politely). The private _processes access is the standard
    workaround for ProcessPoolExecutor exposing no terminate API."""
    global _pool
    if _pool is None:
        return
    try:
        for proc in list(getattr(_pool, "_processes", {}).values()):
            try:
                proc.terminate()
            except Exception:  # noqa: BLE001
                pass
        _pool.shutdown(wait=False, cancel_futures=True)
    finally:
        _pool = None


def _grade_in_child(kind: str, correct: str, student_answer: str, *,
                    options=None, tolerance=None, explanation: str = "",
                    milestones=None, meta=None, seconds: float = 7.0):
    """Runs inside a pool worker: its own process main thread, so the signal
    guard is real. Returns a plain tuple (dataclass fields) for pickling."""
    from math_core._safe import MathTimeoutError, time_limit

    try:
        with time_limit(seconds):
            out = grade(kind, correct, student_answer, options=options,
                        tolerance=tolerance, explanation=explanation,
                        milestones=milestones, meta=meta)
    except MathTimeoutError:
        return (False, 0.0, "cas", 1.0,
                "grading timed out (the expression was too expensive to check)",
                str(correct), explanation, [])
    return (out.is_correct, out.score, out.grader, out.confidence, out.detail,
            out.correct_display, out.explanation, out.step_credits)


async def grade_sandboxed(kind: str, correct: str, student_answer: str, *,
                          options=None, tolerance=None, explanation: str = "",
                          milestones=None, meta=None) -> GradeOutcome:
    """grade(), isolated. The drop-in async entry point for untrusted input."""
    settings = get_settings()
    if not settings.grading_sandbox:
        return grade(kind, correct, student_answer, options=options,
                     tolerance=tolerance, explanation=explanation,
                     milestones=milestones, meta=meta)

    timeout = settings.grading_timeout_seconds
    call = partial(
        _grade_in_child, kind, str(correct), student_answer,
        options=options, tolerance=tolerance, explanation=explanation,
        milestones=milestones, meta=meta, seconds=max(timeout - 1.0, 1.0),
    )
    loop = asyncio.get_running_loop()
    try:
        fields = await asyncio.wait_for(
            loop.run_in_executor(_get_pool(), call), timeout=timeout
        )
        return GradeOutcome(*fields)
    except asyncio.TimeoutError:
        logger.warning("grading sandbox: hard timeout on kind=%s; pool recycled", kind)
        _kill_pool()
        return GradeOutcome(
            False, 0.0, "cas", 1.0,
            "grading timed out (the expression was too expensive to check)",
            str(correct), explanation,
        )
    except Exception as exc:  # noqa: BLE001 - BrokenProcessPool and kin
        logger.error("grading sandbox: pool failure (%s); recycled", exc)
        _kill_pool()
        return GradeOutcome(
            False, 0.0, "cas", 0.0,
            "grading failed in the sandbox; please retry",
            str(correct), explanation,
        )

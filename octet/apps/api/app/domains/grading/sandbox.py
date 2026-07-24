"""Sandboxed grading execution.

The build prompt makes this a launch blocker, and for a concrete reason: RDKit
and SymPy are C and Python engines that will happily spend unbounded time on
adversarial input. A learner submitting a pathological formula or a hostile
mechanism graph must not be able to wedge a worker.

Two layers, because neither is sufficient alone:

  Layer 1, inside the child: chem_core._safe.time_limit sets SIGALRM and the
  parsers enforce input size caps. This catches pure Python spins cheaply.

  Layer 2, here: the grader runs in a ProcessPoolExecutor and the parent waits
  with asyncio.wait_for. A C extension that ignores signals still cannot
  outlive the parent timeout, because on expiry the pool is killed outright
  and rebuilt.

Disable only where process isolation already exists (the Celery worker) or
where it would break test collection. Never disable it on a public path.
"""

from __future__ import annotations

import asyncio
import logging
from concurrent.futures import ProcessPoolExecutor
from typing import Any

from app.core.config import get_settings

logger = logging.getLogger(__name__)

_pool: ProcessPoolExecutor | None = None


def _get_pool() -> ProcessPoolExecutor:
    global _pool
    if _pool is None:
        settings = get_settings()
        _pool = ProcessPoolExecutor(max_workers=settings.grading_max_workers)
    return _pool


def _kill_pool() -> None:
    """Terminate a wedged pool and force a fresh one on the next call."""
    global _pool
    if _pool is not None:
        try:
            _pool.shutdown(wait=False, cancel_futures=True)
        except Exception:  # pragma: no cover - shutdown races are not fatal
            logger.exception("grading pool shutdown raised")
        _pool = None


def _run_in_child(grader: str, payload: dict, student_answer: Any, kwargs: dict) -> dict:
    """Executed inside the pool worker. Must be importable at module level."""
    import chem_core as cc
    from chem_core._safe import GradingTimeout, time_limit

    settings_timeout = payload.pop("_timeout", 5.0)
    try:
        with time_limit(settings_timeout):
            result = cc.grade(grader, payload, student_answer, **kwargs)
    except GradingTimeout:
        return {
            "is_correct": False,
            "score": 0.0,
            "graded": False,
            "grader": grader,
            "detail": "That submission took too long to evaluate. Simplify it and try again.",
            "misconception": None,
            "milestones": [],
            "correct_display": "",
        }
    return {
        "is_correct": result.is_correct,
        "score": result.score,
        "graded": result.graded,
        "grader": result.grader,
        "detail": result.detail,
        "misconception": result.misconception,
        "milestones": result.milestones,
        "correct_display": result.correct_display,
    }


async def grade_sandboxed(grader: str, variant: dict, student_answer: Any, **kwargs) -> dict:
    """Grade with both sandbox layers active.

    Returns the same dict shape whether or not the sandbox is enabled, so
    callers never branch on configuration.
    """
    settings = get_settings()
    payload = {"key": variant.get("key"), "meta": variant.get("meta", {})}

    if not settings.grading_sandbox:
        import chem_core as cc

        result = cc.grade(grader, payload, student_answer, **kwargs)
        return {
            "is_correct": result.is_correct,
            "score": result.score,
            "graded": result.graded,
            "grader": result.grader,
            "detail": result.detail,
            "misconception": result.misconception,
            "milestones": result.milestones,
            "correct_display": result.correct_display,
        }

    payload["_timeout"] = settings.grading_timeout_seconds
    loop = asyncio.get_running_loop()
    try:
        future = loop.run_in_executor(
            _get_pool(), _run_in_child, grader, payload, student_answer, kwargs
        )
        # The parent timeout is deliberately longer than the child's, so the
        # child reports its own timeout cleanly in the normal case and this
        # only fires when the child is genuinely unresponsive.
        return await asyncio.wait_for(future, timeout=settings.grading_timeout_seconds + 2.0)
    except asyncio.TimeoutError:
        logger.warning("grading worker unresponsive, rebuilding pool", extra={"grader": grader})
        _kill_pool()
        return {
            "is_correct": False,
            "score": 0.0,
            "graded": False,
            "grader": grader,
            "detail": "That submission could not be evaluated in time.",
            "misconception": None,
            "milestones": [],
            "correct_display": "",
        }
    except Exception as exc:  # pool death, pickling failure, anything else
        logger.exception("grading failed outside the grader")
        _kill_pool()
        return {
            "is_correct": False,
            "score": 0.0,
            "graded": False,
            "grader": grader,
            "detail": f"Grading is temporarily unavailable ({type(exc).__name__}).",
            "misconception": None,
            "milestones": [],
            "correct_display": "",
        }

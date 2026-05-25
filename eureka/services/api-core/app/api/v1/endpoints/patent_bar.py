"""
Patent Bar Command Center endpoints (P1-3).

Mirrors the test-prep microservice's `/api/v1/patent-bar/{analytics,
review-queue}` shape but reads from api-core's `user_progress` table
(P0-5) instead of test-prep's `QBankSession`/`Question` tables. This
gives the front-end Command Center an auth-protected, api-core-only
path that works even when the test-prep microservice on :8200 isn't
running (which is the common dev case — test-prep is behind
`docker compose --profile full up -d test-prep`).

The two services produce overlapping-but-different data:

  • test-prep version aggregates per-question detail, so it can break
    weakness down by MPEP chapter, statute, content_type, trap_type —
    facets that live on Question.tags and are not propagated to
    user_progress (which is rolled up to (user, exam, topic)).

  • This api-core version aggregates per-topic rollup, so it returns
    `weakness_by_topic` populated (the primary axis the Command Center
    page renders) and leaves the chapter/statute/etc. arrays empty for
    the page to fall back to test-prep if available.

The front-end api-client prefers this api-core endpoint and falls back
to test-prep on 4xx/5xx, so the Command Center now degrades gracefully
across three states:
  1) api-core + user_progress data → real per-topic weakness.
  2) api-core empty (no attempts yet) → page renders zero-state.
  3) api-core unreachable → falls back to test-prep (legacy path).
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User, UserProgress
from app.utils.dependencies import get_current_active_user


router = APIRouter()

EXAM = "PATENT_BAR"

# Threshold for the "slow & inaccurate" risk flag — mirrors the test-prep
# version (avg_time > 120s AND accuracy < 55%).
_RISK_TIME_THRESHOLD_S = 120.0
_RISK_ACCURACY_THRESHOLD = 0.55

# Mastery cutoff for the review-queue "needs work" set. Anything below
# this is surfaced as a topic the user should revisit. Picked at 0.6
# because mastery_from_accuracy() uses Laplace smoothing so 0.6 ≈
# "55-60% accuracy with ≥3 attempts" — the natural weakness band.
_REVIEW_QUEUE_MASTERY_CEILING = 0.6


def _finalize_topic_row(row: UserProgress) -> dict:
    """Shape a single UserProgress row into the Command Center's
    weakness-row shape (matches test-prep's `_finalize`)."""
    total = int(row.attempts)
    correct = int(row.correct)
    accuracy = (correct / total) if total > 0 else 0.0
    avg_time = float(row.avg_seconds)
    risk = avg_time > _RISK_TIME_THRESHOLD_S and accuracy < _RISK_ACCURACY_THRESHOLD
    return {
        "key": row.topic_id,
        "attempts": total,
        "correct": correct,
        "accuracy": round(accuracy, 4),
        "avg_time_seconds": round(avg_time, 1),
        "risk_slow_inaccurate": risk,
        "mastery_level": round(float(row.mastery_level), 4),
        "last_seen_at": row.last_seen_at.isoformat() if row.last_seen_at else None,
    }


@router.get("/me/patent-bar/analytics")
async def patent_bar_analytics(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Per-topic Patent Bar weakness analytics for the current user.

    Returns the same envelope as the legacy test-prep endpoint so the
    front-end Command Center page can consume either source without
    branching its render logic. The chapter / statute / content_type /
    trap_type arrays come back EMPTY here — those facets require per-
    question detail that user_progress doesn't carry. The Command
    Center page can union with the test-prep response when available.
    """
    result = await db.execute(
        select(UserProgress)
        .where(UserProgress.user_id == current_user.id)
        .where(UserProgress.exam_type == EXAM)
        .order_by(UserProgress.mastery_level.asc())
    )
    rows = result.scalars().all()

    weakness_by_topic = [_finalize_topic_row(r) for r in rows]

    # Synthetic scatter points so the time-vs-accuracy chart isn't blank:
    # one point per (topic) at (avg_seconds, accuracy). y is binary in the
    # test-prep version (is_correct) — here we use the topic accuracy as
    # a continuous proxy in [0,1]. Front-end can detect via point shape
    # if it cares (the existing chart treats any object with x/y).
    time_accuracy_points = [
        {
            "topic_id": r.topic_id,
            "attempts": int(r.attempts),
            "time_spent_seconds": round(float(r.avg_seconds), 1),
            "is_correct": float(r.correct) / float(r.attempts) >= 0.5 if r.attempts else False,
            "accuracy": round((float(r.correct) / float(r.attempts)) if r.attempts else 0.0, 4),
        }
        for r in rows
        if r.attempts > 0
    ]

    slow_inaccurate = [
        row["key"]
        for row in weakness_by_topic
        if row.get("risk_slow_inaccurate") and row["attempts"] >= 2
    ]

    total_attempts = sum(int(r.attempts) for r in rows)

    return {
        "exam_type": EXAM,
        "source": "api-core",
        "total_answered": total_attempts,
        # The primary axis populated by api-core:
        "weakness_by_topic": weakness_by_topic[:50],
        # Facets we can't compute from user_progress (require per-question
        # tags). Returned empty so the front-end can `?.length` safely
        # and optionally union with test-prep's response.
        "weakness_by_mpep_chapter": [],
        "weakness_by_statute": [],
        "weakness_by_content_type": [],
        "weakness_by_trap_type": [],
        "time_accuracy_points": time_accuracy_points[-500:],
        "summary": {
            "slow_inaccurate_buckets": slow_inaccurate[:10],
            # Helpful KPIs that the legacy endpoint omits — Command Center
            # already tolerates extra fields and the new LSAT analytics
            # page wants them.
            "topics_attempted": len(weakness_by_topic),
            "average_mastery": round(
                (sum(r.mastery_level for r in rows) / len(rows)) if rows else 0.0,
                4,
            ),
        },
    }


@router.get("/me/patent-bar/review-queue")
async def patent_bar_review_queue(
    limit: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Topics the current user should revisit — lowest mastery first.

    Test-prep's review-queue returns SRS flashcards anchored to missed
    questions. api-core has no SRS table yet (queued as P1-4), so this
    endpoint returns the next-best signal: topics where the user's
    mastery is below the weakness band (≤ 0.6) with at least 2
    attempts. Shape mirrors test-prep's `{ cards, total }` envelope —
    each "card" here is a topic the user should drill.
    """
    result = await db.execute(
        select(UserProgress)
        .where(UserProgress.user_id == current_user.id)
        .where(UserProgress.exam_type == EXAM)
        .where(UserProgress.attempts >= 2)
        .where(UserProgress.mastery_level <= _REVIEW_QUEUE_MASTERY_CEILING)
        .order_by(UserProgress.mastery_level.asc())
        .limit(limit)
    )
    rows = result.scalars().all()

    cards = [
        {
            "id": str(r.id),
            # `front`/`back` keep the test-prep contract so the Command
            # Center can render the same card component for either source.
            "front": f"Review: {r.topic_id}",
            "back": (
                f"You're at {round(float(r.mastery_level) * 100)}% mastery on "
                f"{r.topic_id} after {r.attempts} attempt(s). Drill this topic in "
                f"the QBank and re-check."
            ),
            "tags": {
                "topic_id": r.topic_id,
                "source": "user_progress",
                "exam_type": EXAM,
            },
            "progress": {
                "attempts": int(r.attempts),
                "correct": int(r.correct),
                "accuracy": round(
                    (float(r.correct) / float(r.attempts)) if r.attempts else 0.0,
                    4,
                ),
                "mastery_level": round(float(r.mastery_level), 4),
                "last_seen_at": r.last_seen_at.isoformat() if r.last_seen_at else None,
            },
        }
        for r in rows
    ]

    return {
        "source": "api-core",
        "cards": cards,
        "total": len(cards),
    }

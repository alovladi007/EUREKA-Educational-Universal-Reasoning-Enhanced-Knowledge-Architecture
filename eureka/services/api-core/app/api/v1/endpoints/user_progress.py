"""
Cross-exam user_progress endpoints (P0-5).

Three endpoints under /api/v1:
  GET   /me/progress?exam_type=X        → rows for the current user
  POST  /me/progress                    → upsert one (exam, topic) row
  GET   /me/progress/summary?exam_type=X → aggregated KPIs

The practice page calls POST after every answered question. Per-exam
Analytics dashboards call GET (for the heatmap) and the summary
(for the KPI strip).
"""

from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User, UserProgress
from app.models.user_progress import ExamTypeKind
from app.schemas.user_progress import (
    ProgressRow,
    ProgressSummary,
    RecordAttemptRequest,
)
from app.utils.dependencies import get_current_active_user


router = APIRouter()


@router.get("/me/progress", response_model=List[ProgressRow])
async def list_my_progress(
    exam_type: ExamTypeKind,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Return every progress row the current user has for one exam.

    Used by the per-exam Analytics dashboards to render the weakness
    heatmap. Returns an empty list (NOT 404) if the user hasn't
    attempted anything in this exam yet.
    """
    result = await db.execute(
        select(UserProgress)
        .where(UserProgress.user_id == current_user.id)
        .where(UserProgress.exam_type == exam_type.value)
        .order_by(UserProgress.topic_id.asc())
    )
    rows = result.scalars().all()
    return rows


@router.post("/me/progress", response_model=ProgressRow)
async def record_progress(
    body: RecordAttemptRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Upsert one attempt against (user, exam, topic).

    Behavior:
      • If no row exists, INSERT with attempts=1, correct={0,1},
        avg_seconds=seconds (or 0).
      • If a row exists, UPDATE — attempts +=1, correct += {0,1},
        avg_seconds updated via running mean (weighted by attempts),
        mastery_level recomputed from the smoothed accuracy.

    Returns the post-update row so the client can refresh local state.
    """
    # Find existing row for this triple.
    result = await db.execute(
        select(UserProgress)
        .where(UserProgress.user_id == current_user.id)
        .where(UserProgress.exam_type == body.exam_type.value)
        .where(UserProgress.topic_id == body.topic_id)
    )
    row = result.scalar_one_or_none()

    delta_correct = 1 if body.is_correct else 0
    seconds = float(body.seconds) if body.seconds is not None else 0.0

    if row is None:
        row = UserProgress(
            user_id=current_user.id,
            exam_type=body.exam_type.value,
            topic_id=body.topic_id,
            attempts=1,
            correct=delta_correct,
            avg_seconds=seconds,
        )
        row.mastery_level = row.mastery_from_accuracy()
        db.add(row)
    else:
        # Running mean — weight the prior mean by the prior count.
        prior_n = row.attempts
        new_n = prior_n + 1
        if body.seconds is not None and seconds > 0:
            row.avg_seconds = (row.avg_seconds * prior_n + seconds) / new_n
        row.attempts = new_n
        row.correct = row.correct + delta_correct
        row.mastery_level = row.mastery_from_accuracy()
        # last_seen_at refreshes implicitly via the column default isn't
        # enough on UPDATE — set it explicitly.
        from datetime import datetime, timezone
        row.last_seen_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(row)
    return row


@router.get("/me/progress/summary", response_model=ProgressSummary)
async def progress_summary(
    exam_type: ExamTypeKind,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Aggregated KPIs for the current user on one exam.

    Drives the KPI strip and weakness list on the per-exam Analytics
    dashboards. If the user has no attempts yet, returns a zeroed
    summary (NOT 404).
    """
    result = await db.execute(
        select(UserProgress)
        .where(UserProgress.user_id == current_user.id)
        .where(UserProgress.exam_type == exam_type.value)
    )
    rows = result.scalars().all()

    total_topics = len(rows)
    total_attempts = sum(r.attempts for r in rows)
    total_correct = sum(r.correct for r in rows)
    accuracy = (total_correct / total_attempts) if total_attempts else 0.0
    average_mastery = (
        sum(r.mastery_level for r in rows) / total_topics
        if total_topics
        else 0.0
    )
    avg_seconds = (
        sum(r.avg_seconds * r.attempts for r in rows) / total_attempts
        if total_attempts
        else 0.0
    )

    # Weakest topics with at least 3 attempts (filter out 1/1 noise).
    qualifying = [r for r in rows if r.attempts >= 3]
    weakest = sorted(qualifying, key=lambda r: r.mastery_level)[:5]

    return ProgressSummary(
        exam_type=exam_type,
        total_topics=total_topics,
        topics_attempted=total_topics,
        total_attempts=total_attempts,
        total_correct=total_correct,
        accuracy=accuracy,
        average_mastery=average_mastery,
        average_seconds_per_question=avg_seconds,
        weakest_topics=[ProgressRow.model_validate(r) for r in weakest],
    )

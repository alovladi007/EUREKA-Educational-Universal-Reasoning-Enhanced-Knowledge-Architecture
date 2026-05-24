"""Pydantic schemas for the user_progress endpoints (P0-5)."""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.user_progress import ExamTypeKind


class ProgressRow(BaseModel):
    """One topic's progress for one user (the storage row + read shape)."""
    id: UUID
    user_id: UUID
    exam_type: ExamTypeKind
    topic_id: str
    attempts: int
    correct: int
    avg_seconds: float
    mastery_level: float
    last_seen_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class RecordAttemptRequest(BaseModel):
    """Body for POST /me/progress.

    Sent by the practice page after each question. The endpoint
    upserts the matching row, incrementing attempts and (if correct)
    correct, and updates avg_seconds via running mean.
    """
    exam_type: ExamTypeKind
    topic_id: str = Field(..., min_length=1, max_length=80)
    is_correct: bool
    # Time the user spent on the question, in seconds. Optional because
    # not all callers track it (flashcard review skips this signal).
    seconds: Optional[float] = Field(default=None, ge=0, le=3600)


class ProgressSummary(BaseModel):
    """Aggregated KPIs for one user / one exam.

    Shape mirrors what the per-exam Analytics dashboards already render
    (`Patent Bar command center`, `mcat-analytics`, `lsat-analytics`).
    """
    exam_type: ExamTypeKind
    total_topics: int
    topics_attempted: int
    total_attempts: int
    total_correct: int
    accuracy: float = Field(..., ge=0.0, le=1.0)
    average_mastery: float = Field(..., ge=0.0, le=1.0)
    average_seconds_per_question: float = Field(..., ge=0.0)
    weakest_topics: List[ProgressRow] = Field(
        ...,
        description="Up to 5 topics with the lowest mastery_level (≥3 attempts).",
    )

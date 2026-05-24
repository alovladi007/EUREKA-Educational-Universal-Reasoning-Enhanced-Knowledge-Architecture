"""
Cross-exam per-topic learning progress (P0-5).

Tracks attempts/accuracy/mastery for any exam topic the user practices on
EUREKA — Patent Bar chapters, MCAT foundational concepts, LSAT question
types, CISSP domains, etc. Used by:

  • The Practice page (record answer outcome after each question)
  • Per-exam Analytics dashboards (weakness heatmaps, summary KPIs)
  • The Study Plan page (recommend topics with low mastery)
  • SRS / adaptive engines (input signal alongside srs_cards)

We intentionally key by (user_id, exam_type, topic_id) rather than by
question_id — topic-level rollup is what the analytics pages render. Per-
question history lives in attempt_logs / mock_attempts (see exam.py) and
in the test-prep microservice's question_attempts table.
"""

from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime, Float, ForeignKey, Index, Integer, String, UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ExamTypeKind(str, enum.Enum):
    """Stable identifiers matching the frontend's exam-config.ts keys."""
    PATENT_BAR = "PATENT_BAR"
    MCAT = "MCAT"
    LSAT = "LSAT"
    CISSP = "CISSP"
    SECURITY_PLUS = "SECURITY_PLUS"
    FE_EE = "FE_EE"
    FE_ME = "FE_ME"
    PE_EE = "PE_EE"
    SAT = "SAT"
    GRE = "GRE"
    GMAT = "GMAT"


class UserProgress(Base):
    """Per-user, per-topic learning state.

    A row exists once a user has at least one attempt on a topic.
    Subsequent attempts upsert: attempts += 1, correct += {0,1},
    avg_seconds is updated as a running mean, mastery_level is recomputed
    from the rolling accuracy (with a stability term to dampen early
    high/low accuracy from tiny sample sizes).
    """

    __tablename__ = "user_progress"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    # The exam this progress row belongs to. String (not native enum) so
    # adding a new exam doesn't require a DB migration — we'll validate
    # against ExamTypeKind in the endpoint layer.
    exam_type: Mapped[str] = mapped_column(String(32), nullable=False)
    # Stable topic id from exam-curriculum.ts (e.g. "pa_subject_matter" for
    # Patent Bar, "fc4" for MCAT, "lr_strengthen" for LSAT). Free-form so
    # frontend can introduce new topic ids without a backend deploy.
    topic_id: Mapped[str] = mapped_column(String(80), nullable=False)

    attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    correct: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    avg_seconds: Mapped[float] = mapped_column(
        Float, default=0.0, nullable=False
    )
    # Mastery score 0–1. Computed from rolling accuracy with a Laplace
    # smoothing term so a user with 1/1 doesn't show 100% mastery.
    mastery_level: Mapped[float] = mapped_column(
        Float, default=0.0, nullable=False
    )
    last_seen_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    __table_args__ = (
        # One row per (user, exam, topic); upsert by this composite key.
        UniqueConstraint(
            "user_id", "exam_type", "topic_id",
            name="uq_user_progress_user_exam_topic",
        ),
        # Indexes for the two query paths:
        # 1) Per-user per-exam page render (analytics, study plan).
        Index(
            "ix_user_progress_user_exam",
            "user_id", "exam_type",
        ),
        # 2) Cross-user topic rollup (rare; used by admin / cohort views).
        Index(
            "ix_user_progress_exam_topic",
            "exam_type", "topic_id",
        ),
    )

    def mastery_from_accuracy(self) -> float:
        """Smoothed accuracy → mastery in [0,1].

        Uses a Wilson-style adjustment with 2 "phantom" attempts (1
        correct, 1 incorrect) so 1/1 doesn't read as 100% mastery and a
        single mistake from 0/1 doesn't read as 0%. Caps to [0,1].
        """
        n = self.attempts + 2
        c = self.correct + 1  # phantom correct
        if n == 0:
            return 0.0
        return max(0.0, min(1.0, c / n))

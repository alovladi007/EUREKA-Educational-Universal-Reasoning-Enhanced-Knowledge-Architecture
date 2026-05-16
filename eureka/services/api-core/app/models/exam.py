"""
Exam analytics + mock ORM (Phase 7, 2026-05). See
eureka/ops/db/10_exam_analytics.sql.
"""

from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean, CheckConstraint, Column, DateTime, Enum, ForeignKey, Index,
    Integer, Numeric, String, Text, UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID

from app.core.database import Base


class MockAttemptStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    EXPIRED = "expired"
    ABANDONED = "abandoned"


def _vals(e):
    return lambda obj: [m.value for m in obj]


class AttemptLog(Base):
    __tablename__ = "attempt_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.id", ondelete="CASCADE"), nullable=False, index=True)

    answer_index = Column(Integer, nullable=True)
    answer_value = Column(Numeric, nullable=True)
    answer_text = Column(Text, nullable=True)
    is_correct = Column(Boolean, nullable=False)

    time_taken_ms = Column(Integer, nullable=True)
    hints_used = Column(Integer, nullable=False, default=0)
    max_hint_level = Column(Integer, nullable=False, default=0)

    source = Column(String(40), nullable=False, default="practice")
    agent_session_id = Column(UUID(as_uuid=True), nullable=True)
    mock_attempt_id = Column(UUID(as_uuid=True), nullable=True)

    theta_at_attempt = Column(Numeric(6, 3), nullable=True)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class ExamBlueprint(Base):
    __tablename__ = "exam_blueprints"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String(100), nullable=False, unique=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    bank_slugs = Column(ARRAY(String), nullable=False, default=list)
    skill_weights = Column(JSONB, nullable=False, default=list)
    item_count = Column(Integer, nullable=False, default=40)
    time_limit_min = Column(Integer, nullable=False, default=60)
    score_mapping = Column(JSONB, nullable=False, default=list)
    pass_threshold_scaled = Column(Numeric(6, 2), nullable=True)
    difficulty_b_range = Column(ARRAY(Numeric), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)


class MockAttempt(Base):
    __tablename__ = "mock_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    blueprint_id = Column(UUID(as_uuid=True), ForeignKey("exam_blueprints.id", ondelete="CASCADE"), nullable=False)

    status = Column(
        Enum(MockAttemptStatus, name="mock_attempt_status", values_callable=_vals(MockAttemptStatus)),
        nullable=False, default=MockAttemptStatus.IN_PROGRESS,
    )
    started_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)
    deadline_at = Column(DateTime, nullable=False)

    correct_count = Column(Integer, nullable=True)
    answered_count = Column(Integer, nullable=True)
    theta = Column(Numeric(6, 3), nullable=True)
    theta_se = Column(Numeric(6, 3), nullable=True)
    scaled_score = Column(Numeric(6, 2), nullable=True)
    predicted_pass = Column(Boolean, nullable=True)
    pass_probability = Column(Numeric(4, 3), nullable=True)
    scoring_snapshot = Column(JSONB, nullable=True)

    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)


class MockAttemptItem(Base):
    __tablename__ = "mock_attempt_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mock_attempt_id = Column(UUID(as_uuid=True), ForeignKey("mock_attempts.id", ondelete="CASCADE"), nullable=False, index=True)
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    position = Column(Integer, nullable=False)
    answer_index = Column(Integer, nullable=True)
    answer_value = Column(Numeric, nullable=True)
    is_correct = Column(Boolean, nullable=True)
    time_taken_ms = Column(Integer, nullable=True)
    flagged = Column(Boolean, nullable=False, default=False)
    irt_info_contribution = Column(Numeric(6, 3), nullable=True)
    answered_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("mock_attempt_id", "item_id", name="uq_attempt_item"),
        UniqueConstraint("mock_attempt_id", "position", name="uq_attempt_position"),
    )


__all__ = [
    "AttemptLog", "ExamBlueprint", "MockAttempt", "MockAttemptItem",
    "MockAttemptStatus",
]

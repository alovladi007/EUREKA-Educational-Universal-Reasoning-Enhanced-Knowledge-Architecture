"""
SQLAlchemy ORM models for the Assessment Engine.

Maps to the `assessments` and `questions` tables seeded by
eureka/ops/db/00_init_complete.sql.

The `assessment_attempts` and `question_responses` tables are not yet
seeded; they're declared here so the routes import, but real schema
design lives in Phase 5 (see docs/BACKLOG.md). Until the migration
adding those tables lands, runtime calls to attempt/response endpoints
will fail at the SQL layer — that's expected. The /health endpoint
works regardless.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.utils.database import Base


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    assignment_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    assessment_type = Column(String(50), nullable=False)
    total_points = Column(Numeric(10, 2), nullable=False, default=0)
    passing_score = Column(Numeric(5, 2), nullable=True, default=70.00)
    time_limit_minutes = Column(Integer, nullable=True)
    max_attempts = Column(Integer, nullable=True, default=1)
    shuffle_questions = Column(Boolean, default=False)
    shuffle_answers = Column(Boolean, default=False)
    show_correct_answers = Column(Boolean, default=True)
    available_from = Column(DateTime, nullable=True)
    available_until = Column(DateTime, nullable=True)
    is_published = Column(Boolean, default=False)
    extra_metadata = Column("metadata", JSONB, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)


class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = Column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), nullable=False)
    points = Column(Numeric(10, 2), nullable=False, default=1)
    order_index = Column(Integer, nullable=False, default=0)
    answer_options = Column(JSONB, nullable=True)
    correct_answer = Column(JSONB, nullable=True)
    explanation = Column(Text, nullable=True)
    hints = Column(JSONB, default=list)
    difficulty = Column(String(20), default="medium")
    tags = Column(JSONB, default=list)
    extra_metadata = Column("metadata", JSONB, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)


class AssessmentAttempt(Base):
    """
    Tracks one learner's attempt at one assessment.

    TODO (Phase 5.1): add `assessment_attempts` table to
    eureka/ops/db/00_init_complete.sql. Columns mirror this model.
    """

    __tablename__ = "assessment_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = Column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    # P2-8 tenancy: org of the learner at attempt time, copied from the JWT
    # claim. Nullable because pre-existing rows (and tokens without an org)
    # have no value; access checks treat NULL as "owner only".
    org_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    # Contract repair: the routes, auto-grader, and response schemas always
    # expected these; the model was written thinner than the code using it.
    attempt_number = Column(Integer, nullable=False, default=1)
    is_late = Column(Boolean, nullable=False, default=False)
    status = Column(String(20), nullable=False, default="in_progress")
    started_at = Column(DateTime, default=datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)
    time_spent_seconds = Column(Integer, nullable=True)
    score = Column(Numeric(10, 2), nullable=True)
    max_score = Column(Numeric(10, 2), nullable=True)
    percentage = Column(Numeric(5, 2), nullable=True)
    passed = Column(Boolean, nullable=True)
    extra_metadata = Column("metadata", JSONB, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)


class QuestionResponse(Base):
    """
    Tracks one learner's answer to one question inside an attempt.

    TODO (Phase 5.1): add `question_responses` table to
    eureka/ops/db/00_init_complete.sql. Columns mirror this model.
    """

    __tablename__ = "question_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    attempt_id = Column(
        UUID(as_uuid=True),
        ForeignKey("assessment_attempts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    question_id = Column(
        UUID(as_uuid=True),
        ForeignKey("questions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    response_text = Column(Text, nullable=True)
    response_data = Column(JSONB, nullable=True)
    is_correct = Column(Boolean, nullable=True)
    score = Column(Numeric(10, 2), nullable=True)
    points_earned = Column(Numeric(10, 2), nullable=True)
    points_possible = Column(Numeric(10, 2), nullable=True)
    ai_feedback = Column(Text, nullable=True)
    extra_metadata = Column("metadata", JSONB, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)


class GradingResult(Base):
    """
    One grading record per attempt. Auto-graded scores land here first;
    if a human regrades, the same row gets the final score.

    Reconciled (P2-8 session): the seed SQL's `grading_results` is a
    different, submission-based legacy table (0 rows, no other reader), so
    this model owns its own table instead of colliding with it.
    """

    __tablename__ = "attempt_grading_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    attempt_id = Column(
        UUID(as_uuid=True),
        ForeignKey("assessment_attempts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    grading_status = Column(String(20), nullable=False, default="pending")
    auto_graded_score = Column(Numeric(10, 2), nullable=True)
    ai_graded_score = Column(Numeric(10, 2), nullable=True)
    manual_graded_score = Column(Numeric(10, 2), nullable=True)
    final_score = Column(Numeric(10, 2), nullable=True)
    graded_at = Column(DateTime, nullable=True)
    extra_metadata = Column("metadata", JSONB, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)


# Re-export enums used by routes; they live in schemas.py and are referenced
# via the canonical `app.models` import path the routes already use.
from app.schemas import AttemptStatus, GradingStatus, QuestionType  # noqa: E402


class ResponseFeedback(Base):
    """
    AI-generated feedback for a question response. One row per regen.

    TODO (Phase 5.1): add `response_feedback` table to init SQL.
    """

    __tablename__ = "response_feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    response_id = Column(
        UUID(as_uuid=True),
        ForeignKey("question_responses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    feedback_text = Column(Text, nullable=False)
    feedback_type = Column(String(40), nullable=False, default="ai")
    model_used = Column(String(80), nullable=True)
    extra_metadata = Column("metadata", JSONB, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)


__all__ = [
    "Assessment",
    "Question",
    "AssessmentAttempt",
    "QuestionResponse",
    "GradingResult",
    "ResponseFeedback",
    "AttemptStatus",
    "GradingStatus",
    "QuestionType",
]

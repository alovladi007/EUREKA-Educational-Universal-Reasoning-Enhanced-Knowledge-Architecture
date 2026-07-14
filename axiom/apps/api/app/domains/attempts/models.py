"""Attempt and result ORM models.

A Response always references the ItemVariant seen (when the source was a
template) AND the ItemTemplate it came from, so analytics can aggregate across
variants at the template level. Every GradingRecord stores the grader type
(cas, exact, numeric, ai, human) and a confidence value. ReasoningTrace records
why a grade or an adaptive decision was made.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, Float, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.core.db import Base


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    # Naive UTC to match the TIMESTAMP (without time zone) columns. Passing an
    # aware datetime to a naive column makes asyncpg raise on Postgres.
    return datetime.now(UTC).replace(tzinfo=None)


class Attempt(Base):
    __tablename__ = "attempts"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    assessment_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("assessments.id", ondelete="SET NULL"), nullable=True, index=True
    )
    kind: Mapped[str] = mapped_column(String(24), nullable=False, default="practice")
    status: Mapped[str] = mapped_column(String(24), nullable=False, default="in_progress")
    started_at: Mapped[datetime] = mapped_column(default=_now)
    submitted_at: Mapped[datetime | None] = mapped_column(nullable=True)
    correct_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    answered_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    score_scaled: Mapped[float | None] = mapped_column(Float, nullable=True)

    responses: Mapped[list[Response]] = relationship(
        back_populates="attempt", cascade="all, delete-orphan"
    )


class Response(Base):
    __tablename__ = "responses"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    attempt_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("attempts.id", ondelete="CASCADE"), index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    node_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="CASCADE"), index=True
    )
    # Exactly one of item_id or (template_id + variant_id) identifies the source.
    item_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("items.id", ondelete="SET NULL"), nullable=True
    )
    template_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("item_templates.id", ondelete="SET NULL"), nullable=True, index=True
    )
    variant_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("item_variants.id", ondelete="SET NULL"), nullable=True
    )
    answer: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    submitted_at: Mapped[datetime | None] = mapped_column(nullable=True)

    attempt: Mapped[Attempt] = relationship(back_populates="responses")
    score: Mapped[Score | None] = relationship(
        back_populates="response", uselist=False, cascade="all, delete-orphan"
    )


class Score(Base):
    __tablename__ = "scores"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    response_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("responses.id", ondelete="CASCADE"), unique=True, index=True
    )
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    max_score: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)

    response: Mapped[Response] = relationship(back_populates="score")


class StepCredit(Base):
    """Partial credit per expected milestone for show-your-work items (Phase 2)."""

    __tablename__ = "step_credits"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    response_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("responses.id", ondelete="CASCADE"), index=True
    )
    milestone: Mapped[str] = mapped_column(String(200), nullable=False)
    awarded: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    note: Mapped[str] = mapped_column(String(500), nullable=False, default="")


class GradeOverride(Base):
    """A teacher's override of an AI-produced grade (Phase 3).

    AI grading of free-response work is always human-overridable. One override
    per response supersedes the automatic score of record; the automatic grade
    stays visible in the GradingRecord and ReasoningTrace for the audit trail.
    """

    __tablename__ = "grade_overrides"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    response_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("responses.id", ondelete="CASCADE"), unique=True, index=True
    )
    score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    note: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    overridden_by: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(default=_now)


class GradingRecord(Base):
    __tablename__ = "grading_records"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    response_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("responses.id", ondelete="CASCADE"), index=True
    )
    grader: Mapped[str] = mapped_column(
        String(16), nullable=False
    )  # cas, exact, numeric, ai, human
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)
    detail: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(default=_now)


class ReasoningTrace(Base):
    """Why a grade or an adaptive decision was made. subject_type is 'grading'
    or 'adaptive'; subject_id points at the relevant row."""

    __tablename__ = "reasoning_traces"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    subject_type: Mapped[str] = mapped_column(String(24), nullable=False, index=True)
    subject_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False, index=True)
    kind: Mapped[str] = mapped_column(String(32), nullable=False)
    content: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(default=_now)


class MissedQuestion(Base):
    """Save-and-redo entry for a missed question (EM-19, from the reference
    review layer). Every wrong answer upserts a row with the exact prompt the
    learner saw; a correct re-attempt on the SAME question (same item, or same
    template variant, so retry serves the very numbers missed) clears it, and a
    later miss reopens it with the miss count preserved."""

    __tablename__ = "missed_questions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    node_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="CASCADE"), index=True
    )
    item_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("items.id", ondelete="CASCADE"), nullable=True
    )
    template_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("item_templates.id", ondelete="CASCADE"), nullable=True
    )
    variant_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("item_variants.id", ondelete="CASCADE"), nullable=True
    )
    prompt: Mapped[str] = mapped_column(Text, nullable=False, default="")
    last_answer: Mapped[str] = mapped_column(Text, nullable=False, default="")
    misconception_code: Mapped[str | None] = mapped_column(String(32), nullable=True)
    miss_count: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    status: Mapped[str] = mapped_column(String(12), nullable=False, default="open")
    created_at: Mapped[datetime] = mapped_column(default=_now)
    updated_at: Mapped[datetime] = mapped_column(default=_now, onupdate=_now)

"""Adaptive ORM models.

MasteryState is the current, one-row-per (user, node) view. MasteryEvent is the
append-only history that carries the evidence behind every change (which
response moved it, and the probability before and after). This makes mastery
explainable: a teacher can answer why the number is what it is.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, Float, ForeignKey, Integer, String, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from app.core.db import Base


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    # Naive UTC to match the TIMESTAMP (without time zone) columns.
    return datetime.now(UTC).replace(tzinfo=None)


# Mastery signals (Extension Section 8). For proof-based nodes AXIOM tracks two
# independent competences per node: can APPLY the result, and can PROVE it. They
# are different skills; a learner can have one without the other. Computational
# nodes only ever use "apply".
MASTERY_SIGNALS = ("apply", "prove")


class MasteryState(Base):
    __tablename__ = "mastery_states"
    __table_args__ = (
        UniqueConstraint("user_id", "node_id", "signal", name="uq_mastery_user_node_signal"),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    node_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="CASCADE"), index=True
    )
    # "apply" or "prove" (see MASTERY_SIGNALS). Defaults to "apply" so every
    # pre-existing row keeps its meaning.
    signal: Mapped[str] = mapped_column(
        String(8), nullable=False, default="apply", server_default="apply"
    )
    p_known: Mapped[float] = mapped_column(Float, nullable=False, default=0.2)
    level: Mapped[str] = mapped_column(String(16), nullable=False, default="novice")
    updated_at: Mapped[datetime] = mapped_column(default=_now)


class MasteryEvent(Base):
    """Append-only evidence for every mastery change.

    grader and grader_confidence record which grader produced the evidence and
    how much to trust it (Extension Section 8: a formally verified proof is
    stronger evidence than an AI-assisted provisional pass). signal records
    whether this evidence bears on applying or proving the node.
    """

    __tablename__ = "mastery_events"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    node_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="CASCADE"), index=True
    )
    response_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("responses.id", ondelete="SET NULL"), nullable=True
    )
    correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    p_known_before: Mapped[float] = mapped_column(Float, nullable=False)
    p_known_after: Mapped[float] = mapped_column(Float, nullable=False)
    signal: Mapped[str] = mapped_column(
        String(8), nullable=False, default="apply", server_default="apply"
    )
    grader: Mapped[str | None] = mapped_column(String(16), nullable=True)
    grader_confidence: Mapped[float] = mapped_column(
        Float, nullable=False, default=1.0, server_default="1.0"
    )
    created_at: Mapped[datetime] = mapped_column(default=_now)


class IRTParameters(Base):
    """Item response theory parameters (2PL/3PL). Calibrated from data in
    Phase 2; the table exists now so the shape is stable."""

    __tablename__ = "irt_parameters"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    item_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("items.id", ondelete="CASCADE"), nullable=True
    )
    template_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("item_templates.id", ondelete="CASCADE"), nullable=True
    )
    a: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)  # discrimination
    b: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)  # difficulty
    c: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)  # guessing


class LearningPathState(Base):
    __tablename__ = "learning_path_states"
    __table_args__ = (UniqueConstraint("user_id", name="uq_path_user"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    current_node_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="SET NULL"), nullable=True
    )
    plan: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    updated_at: Mapped[datetime] = mapped_column(default=_now)


class ReviewSchedule(Base):
    """SM-2 spaced-repetition schedule per (user, node)."""

    __tablename__ = "review_schedules"
    __table_args__ = (UniqueConstraint("user_id", "node_id", name="uq_review_user_node"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    node_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="CASCADE"), index=True
    )
    ease: Mapped[float] = mapped_column(Float, nullable=False, default=2.5)
    interval_days: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    reps: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    due_at: Mapped[datetime] = mapped_column(default=_now)


class CatSession(Base):
    """A computerized adaptive test session. theta is the running ability
    estimate, standard_error its posterior SD; administered records the items
    seen with their outcome so theta can be re-estimated after each response."""

    __tablename__ = "cat_sessions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    status: Mapped[str] = mapped_column(String(24), nullable=False, default="in_progress")
    theta: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    standard_error: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)
    item_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    administered: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    pending_item_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("items.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(default=_now)
    updated_at: Mapped[datetime] = mapped_column(default=_now)

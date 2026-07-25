"""Spaced repetition scheduling state.

One table, and deliberately only one. A flashcard's text is never stored
here: cards are derived from the authored lessons in app.data.lessons at
read time, so a content fix to a lesson propagates to its cards without a
migration or a re-import. What the database owns is the part the lessons
cannot know: where each learner stands with each card on the SM-2 schedule.

A card that has no row for a learner is "new". The first review creates the
row; from then on the row carries the whole SM-2 state (repetitions,
interval, ease) plus when the card is next due.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
    Integer,
    String,
    UniqueConstraint,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class SrsState(Base):
    """Per learner, per card. Created on first review, updated on every one.

    Column defaults apply at flush, not at construction, so code that builds
    a fresh row and immediately does arithmetic on it must set the zeros
    explicitly (the same rule NodeMastery construction follows).
    """

    __tablename__ = "srs_states"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    # f"{node_code}:{kind}", resolved against the derived card set at read
    # time. Not a foreign key on purpose: the cards live in authored code,
    # not in a table.
    card_id: Mapped[str] = mapped_column(String(128), nullable=False)

    repetitions: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    interval_days: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    ease: Mapped[float] = mapped_column(Float, nullable=False, default=2.5)
    due_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    last_grade: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (
        UniqueConstraint("user_id", "card_id", name="uq_srs_state_user_card"),
    )

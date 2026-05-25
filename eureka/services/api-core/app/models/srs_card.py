"""
Spaced-Repetition System (SRS) flashcards (P1-4).

A generic SM-2 (SuperMemo 2) implementation that any exam surface can
plug into — Patent Bar miss-driven cards, LSAT formal-logic decks,
MCAT formulas, user-authored notes, etc. Each card carries enough
state to schedule its next review via the canonical SM-2 update rule:

  • ease_factor   — quality multiplier, starts at 2.5, floor 1.3
  • interval_days — number of days until next review (after a pass)
  • repetitions   — consecutive successful reviews (resets to 0 on a fail)
  • next_review   — the timestamp the card next becomes "due"

On every review the card is graded 0..5. The /me/srs/cards/{id}/review
endpoint applies the SM-2 update and persists. /me/srs/cards/due
returns cards whose next_review ≤ now.

We intentionally store `deck` as a free-form string (typically the
exam_type — "PATENT_BAR", "LSAT", etc., or "general" for cross-cutting
decks) instead of a FK to a decks table. Most users will own at most
a few decks, and a string column lets the front-end introduce new
exam types without a backend deploy. The (user_id, deck) index keeps
the listing query fast.

The test-prep microservice has its own Flashcard / FlashcardProgress
tables (used by /api/v1/patent-bar/{review-queue,flashcards/from-
misses}). This api-core table is the auth-protected, cross-exam
replacement — same role as P0-5's user_progress vs test-prep's
QBankSession.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


# SM-2 defaults — match the original SuperMemo 2 spec so any client
# that already knows the algorithm produces identical scheduling.
SM2_INITIAL_EASE_FACTOR = 2.5
SM2_MIN_EASE_FACTOR = 1.3
SM2_PASS_QUALITY_THRESHOLD = 3  # q ≥ 3 counts as a "pass"


class SrsCard(Base):
    """One SRS-managed flashcard for one user."""

    __tablename__ = "srs_cards"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    # Free-form bucket — usually the exam_type ("PATENT_BAR", "LSAT"),
    # but can be "general", a custom user deck name, etc.
    deck: Mapped[str] = mapped_column(
        String(64), nullable=False, default="general"
    )
    front: Mapped[str] = mapped_column(Text, nullable=False)
    back: Mapped[str] = mapped_column(Text, nullable=False)
    # Optional JSON metadata — typically {"exam_type": "...", "topic_id":
    # "...", "source": "qbank_miss", ...}. Free-form so callers can
    # attach whatever provenance signals they want.
    tags: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # ── SM-2 scheduling state ──────────────────────────────────────
    ease_factor: Mapped[float] = mapped_column(
        Float, nullable=False, default=SM2_INITIAL_EASE_FACTOR
    )
    interval_days: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0
    )
    repetitions: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0
    )
    next_review: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    last_review: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # ── Lifetime counters (for stats) ──────────────────────────────
    total_reviews: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0
    )
    total_correct: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    __table_args__ = (
        # Listing/due queries always filter by user first, then deck.
        Index("ix_srs_cards_user_deck", "user_id", "deck"),
        # Due-card scan: WHERE user_id = … AND next_review <= now.
        Index("ix_srs_cards_user_due", "user_id", "next_review"),
    )

    # ── SM-2 update rule ───────────────────────────────────────────
    #
    # Canonical SuperMemo 2 (Wozniak 1990):
    #
    #   if q < 3:
    #       repetitions := 0
    #       interval    := 1
    #   else:
    #       repetitions += 1
    #       interval := {
    #           1            if repetitions == 1
    #           6            if repetitions == 2
    #           round(interval * EF) otherwise
    #       }
    #
    #   EF := EF + (0.1 − (5 − q) × (0.08 + (5 − q) × 0.02))
    #   EF := max(1.3, EF)
    #   next_review := now + interval days
    #
    # We never reset EF on a failure — only repetitions/interval.
    # That's the standard SM-2 behavior; clients can call /reset to
    # wipe EF if they want.
    def apply_sm2(self, quality: int, now: datetime) -> None:
        """Mutate this card's scheduling state per the SM-2 rule."""
        q = max(0, min(5, int(quality)))

        if q < SM2_PASS_QUALITY_THRESHOLD:
            # Failure — reset the streak, repeat tomorrow.
            self.repetitions = 0
            self.interval_days = 1
        else:
            self.repetitions += 1
            if self.repetitions == 1:
                self.interval_days = 1
            elif self.repetitions == 2:
                self.interval_days = 6
            else:
                # Round to avoid 1.43-day intervals; SM-2 spec uses
                # integer days.
                self.interval_days = max(
                    1, int(round(self.interval_days * self.ease_factor))
                )

        # Update ease factor regardless of pass/fail.
        ef_delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
        self.ease_factor = max(
            SM2_MIN_EASE_FACTOR, float(self.ease_factor) + ef_delta
        )

        # Counters + scheduling timestamps.
        self.total_reviews += 1
        if q >= SM2_PASS_QUALITY_THRESHOLD:
            self.total_correct += 1
        self.last_review = now
        # next_review uses days as the SM-2 unit; clients that want
        # sub-day cadence (e.g. cramming) can override with /reset.
        from datetime import timedelta

        self.next_review = now + timedelta(days=self.interval_days)

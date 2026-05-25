"""Pydantic schemas for the SRS endpoints (P1-4)."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class SrsCardOut(BaseModel):
    """Storage row + read shape for a single SRS card."""

    id: UUID
    user_id: UUID
    deck: str
    front: str
    back: str
    tags: Optional[Dict[str, Any]] = None
    ease_factor: float
    interval_days: int
    repetitions: int
    next_review: datetime
    last_review: Optional[datetime] = None
    total_reviews: int
    total_correct: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SrsCardCreate(BaseModel):
    """Body for POST /me/srs/cards — author a new card."""

    deck: str = Field(default="general", min_length=1, max_length=64)
    front: str = Field(..., min_length=1)
    back: str = Field(..., min_length=1)
    tags: Optional[Dict[str, Any]] = None


class SrsCardUpdate(BaseModel):
    """Body for PATCH /me/srs/cards/{id} — edit content (not scheduling)."""

    front: Optional[str] = Field(default=None, min_length=1)
    back: Optional[str] = Field(default=None, min_length=1)
    deck: Optional[str] = Field(default=None, min_length=1, max_length=64)
    tags: Optional[Dict[str, Any]] = None


class SrsReviewRequest(BaseModel):
    """Body for POST /me/srs/cards/{id}/review — grade a review.

    The SM-2 quality scale (0-5):
      0 — Total blackout, wrong answer
      1 — Wrong answer but the correct one felt familiar
      2 — Wrong answer; recall felt easy after seeing it
      3 — Correct answer but required serious effort
      4 — Correct answer with hesitation
      5 — Perfect recall

    Clients with a simpler UI (just "Again / Hard / Good / Easy") should
    map: Again=0, Hard=3, Good=4, Easy=5.
    """

    quality: int = Field(..., ge=0, le=5)


class SrsStats(BaseModel):
    """Aggregated SRS state for the current user (optionally one deck)."""

    deck: Optional[str] = None
    total_cards: int
    due_now: int
    learning: int = Field(
        ..., description="Cards with repetitions < 2 (still in the early SM-2 ramp)."
    )
    mature: int = Field(
        ..., description="Cards with interval_days ≥ 21 (long-term retention zone)."
    )
    reviews_today: int
    average_ease: float = Field(
        ..., ge=0.0, description="Average EF across all the user's cards in this deck."
    )


class SrsCardList(BaseModel):
    cards: List[SrsCardOut]
    total: int

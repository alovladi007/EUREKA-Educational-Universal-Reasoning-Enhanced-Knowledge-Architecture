"""
Spaced-Repetition System (SRS) endpoints (P1-4).

CRUD + review for srs_cards. Uses the SM-2 algorithm (see
app/models/srs_card.py for the math). All endpoints are scoped to the
current authenticated user.

Routes (all under /api/v1):
  GET    /me/srs/cards                   — list cards (optional deck filter)
  GET    /me/srs/cards/due               — cards whose next_review ≤ now
  GET    /me/srs/stats                   — counts, due-today, avg ease
  POST   /me/srs/cards                   — create a card
  PATCH  /me/srs/cards/{id}              — edit content (front/back/deck/tags)
  DELETE /me/srs/cards/{id}              — delete a card
  POST   /me/srs/cards/{id}/review       — grade a review, applies SM-2
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User
from app.models.srs_card import SrsCard
from app.schemas.srs import (
    SrsCardCreate,
    SrsCardList,
    SrsCardOut,
    SrsCardUpdate,
    SrsReviewRequest,
    SrsStats,
)
from app.utils.dependencies import get_current_active_user


router = APIRouter()


# Mature-card threshold mirrors Anki's default (≥ 21 days). Cards in
# that zone are considered "long-term retention" for stats purposes.
_MATURE_INTERVAL_DAYS = 21


@router.get("/me/srs/cards", response_model=SrsCardList)
async def list_my_cards(
    deck: Optional[str] = Query(default=None, max_length=64),
    limit: int = Query(default=200, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """List the current user's SRS cards, optionally filtered by deck."""
    where = [SrsCard.user_id == current_user.id]
    if deck:
        where.append(SrsCard.deck == deck)

    total = (
        await db.execute(select(func.count(SrsCard.id)).where(*where))
    ).scalar_one()

    result = await db.execute(
        select(SrsCard)
        .where(*where)
        .order_by(SrsCard.next_review.asc())
        .offset(offset)
        .limit(limit)
    )
    cards = result.scalars().all()
    return SrsCardList(cards=cards, total=int(total))


@router.get("/me/srs/cards/due", response_model=SrsCardList)
async def list_due_cards(
    deck: Optional[str] = Query(default=None, max_length=64),
    limit: int = Query(default=50, ge=1, le=500),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Cards whose next_review is at-or-before now — the review queue.

    Ordered by next_review asc so the most-overdue cards come first.
    """
    now = datetime.now(timezone.utc)
    where = [
        SrsCard.user_id == current_user.id,
        SrsCard.next_review <= now,
    ]
    if deck:
        where.append(SrsCard.deck == deck)

    total = (
        await db.execute(select(func.count(SrsCard.id)).where(*where))
    ).scalar_one()

    result = await db.execute(
        select(SrsCard)
        .where(*where)
        .order_by(SrsCard.next_review.asc())
        .limit(limit)
    )
    cards = result.scalars().all()
    return SrsCardList(cards=cards, total=int(total))


@router.get("/me/srs/stats", response_model=SrsStats)
async def srs_stats(
    deck: Optional[str] = Query(default=None, max_length=64),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Aggregated SRS counts for the current user (optionally one deck)."""
    now = datetime.now(timezone.utc)
    where = [SrsCard.user_id == current_user.id]
    if deck:
        where.append(SrsCard.deck == deck)

    result = await db.execute(select(SrsCard).where(*where))
    cards = result.scalars().all()

    total_cards = len(cards)
    due_now = sum(1 for c in cards if c.next_review and c.next_review <= now)
    learning = sum(1 for c in cards if c.repetitions < 2)
    mature = sum(1 for c in cards if c.interval_days >= _MATURE_INTERVAL_DAYS)
    today_start = datetime.combine(
        now.date(), datetime.min.time(), tzinfo=timezone.utc
    )
    reviews_today = sum(
        1 for c in cards if c.last_review and c.last_review >= today_start
    )
    avg_ease = (
        sum(float(c.ease_factor) for c in cards) / total_cards
        if total_cards
        else 0.0
    )

    return SrsStats(
        deck=deck,
        total_cards=total_cards,
        due_now=due_now,
        learning=learning,
        mature=mature,
        reviews_today=reviews_today,
        average_ease=round(avg_ease, 3),
    )


@router.post(
    "/me/srs/cards",
    response_model=SrsCardOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_card(
    body: SrsCardCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Author a new card. It's due immediately (next_review = now)."""
    card = SrsCard(
        user_id=current_user.id,
        deck=body.deck,
        front=body.front,
        back=body.back,
        tags=body.tags,
    )
    db.add(card)
    await db.commit()
    await db.refresh(card)
    return card


@router.patch("/me/srs/cards/{card_id}", response_model=SrsCardOut)
async def update_card(
    card_id: UUID,
    body: SrsCardUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Edit a card's content (front/back/deck/tags). Scheduling state is
    untouched — use /review to advance, or DELETE + create to fully reset."""
    result = await db.execute(
        select(SrsCard).where(
            and_(SrsCard.id == card_id, SrsCard.user_id == current_user.id)
        )
    )
    card = result.scalar_one_or_none()
    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Card not found"
        )

    if body.front is not None:
        card.front = body.front
    if body.back is not None:
        card.back = body.back
    if body.deck is not None:
        card.deck = body.deck
    if body.tags is not None:
        card.tags = body.tags

    await db.commit()
    await db.refresh(card)
    return card


@router.delete("/me/srs/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_card(
    card_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Permanently delete a card."""
    result = await db.execute(
        select(SrsCard).where(
            and_(SrsCard.id == card_id, SrsCard.user_id == current_user.id)
        )
    )
    card = result.scalar_one_or_none()
    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Card not found"
        )
    await db.delete(card)
    await db.commit()
    return None


@router.post("/me/srs/cards/{card_id}/review", response_model=SrsCardOut)
async def review_card(
    card_id: UUID,
    body: SrsReviewRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Grade a review (0-5) and advance the card via SM-2.

    See app/models/srs_card.py:SrsCard.apply_sm2 for the exact rule.
    Returns the updated card so the client can refresh its next_review
    badge without a follow-up GET.
    """
    result = await db.execute(
        select(SrsCard).where(
            and_(SrsCard.id == card_id, SrsCard.user_id == current_user.id)
        )
    )
    card = result.scalar_one_or_none()
    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Card not found"
        )

    card.apply_sm2(quality=body.quality, now=datetime.now(timezone.utc))
    await db.commit()
    await db.refresh(card)
    return card

"""SME review workflow for the MCAT bank (C5; AUDIT MC-7).

The review states already exist on every item and passage
(draft/in_review/approved/flagged/retired, with reviewer identity columns);
what was missing is the workflow that moves them and the serving layer that
obeys them. This router is the workflow; the serving rules live where
serving happens (mcat_qbank.py, mcat_mock.py) and are:

  - FLAGGED and RETIRED content never serves, anywhere.
  - DRAFT serves only in the free practice surfaces, always with the
    AI-generated disclaimer.
  - The PAID pool is approved-only: an entitled learner's simulator draw
    uses approved items exclusively, and refuses (with the reason) rather
    than padding from the draft pool. Unreviewed content is never sold.

Reviewers are teachers and admins (require_teacher). Approval records WHO
approved and WHEN on the row itself - an approval without a named reviewer
is not an approval.
"""

from __future__ import annotations

import uuid as uuid_mod
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User
from app.models.item_bank import Item, ItemBank, ItemReviewStatus, Passage
from app.utils.dependencies import require_teacher

router = APIRouter()

BANK_SLUG = "mcat-qbank-v1"


class ReviewIn(BaseModel):
    notes: str | None = Field(None, max_length=2000)


async def _bank(db: AsyncSession) -> ItemBank:
    bank = (
        await db.execute(select(ItemBank).where(ItemBank.slug == BANK_SLUG))
    ).scalar_one_or_none()
    if bank is None:
        raise HTTPException(503, "The MCAT item bank is not seeded on this deployment.")
    return bank


@router.get("/mcat/sme/queue")
async def sme_queue(
    status_filter: str = "draft",
    limit: int = 20,
    offset: int = 0,
    current_user: User = Depends(require_teacher),
    db: AsyncSession = Depends(get_db),
):
    """Items awaiting review - WITH keys and explanations: the reviewer's
    job is to judge them."""
    if not 1 <= limit <= 100:
        raise HTTPException(422, "limit must be between 1 and 100")
    try:
        wanted = ItemReviewStatus(status_filter)
    except ValueError:
        raise HTTPException(
            422,
            f"unknown status {status_filter!r}; valid: "
            f"{', '.join(s.value for s in ItemReviewStatus)}",
        )
    bank = await _bank(db)
    counts = dict(
        (
            await db.execute(
                select(Item.review_status, func.count())
                .where(Item.bank_id == bank.id, Item.deleted_at.is_(None))
                .group_by(Item.review_status)
            )
        ).all()
    )
    items = (
        (
            await db.execute(
                select(Item)
                .where(
                    Item.bank_id == bank.id,
                    Item.deleted_at.is_(None),
                    Item.review_status == wanted,
                )
                .order_by(Item.created_at)
                .offset(offset)
                .limit(limit)
            )
        )
        .scalars()
        .all()
    )
    return {
        "counts": {s.value: int(counts.get(s, 0)) for s in ItemReviewStatus},
        "items": [
            {
                "item_id": str(i.id),
                "stem": i.content.get("stem"),
                "options": list(i.content.get("options", [])),
                "correct_index": int(i.content["correct_index"]),
                "explanation": i.explanation,
                "section": i.extra_metadata.get("section"),
                "subtopic": i.extra_metadata.get("subtopic"),
                "review_status": i.review_status.value,
                "review_notes": i.review_notes,
                "attempts_count": i.attempts_count,
            }
            for i in items
        ],
    }


async def _item(db: AsyncSession, item_id: uuid_mod.UUID) -> Item:
    bank = await _bank(db)
    item = (
        await db.execute(
            select(Item).where(
                Item.id == item_id,
                Item.bank_id == bank.id,
                Item.deleted_at.is_(None),
            )
        )
    ).scalar_one_or_none()
    if item is None:
        raise HTTPException(404, "unknown item")
    return item


@router.post("/mcat/sme/items/{item_id}/approve")
async def approve_item(
    item_id: uuid_mod.UUID,
    body: ReviewIn,
    current_user: User = Depends(require_teacher),
    db: AsyncSession = Depends(get_db),
):
    """Approve: the named reviewer stands behind the item. Recorded on the
    row - reviewer identity, timestamp, notes."""
    item = await _item(db, item_id)
    item.review_status = ItemReviewStatus.APPROVED
    item.reviewed_by = current_user.id
    item.reviewed_at = datetime.utcnow()
    item.review_notes = body.notes
    await db.commit()
    return {
        "item_id": str(item.id),
        "review_status": item.review_status.value,
        "reviewed_by": str(current_user.id),
        "reviewed_at": item.reviewed_at.isoformat() + "Z",
    }


@router.post("/mcat/sme/items/{item_id}/flag")
async def flag_item(
    item_id: uuid_mod.UUID,
    body: ReviewIn,
    current_user: User = Depends(require_teacher),
    db: AsyncSession = Depends(get_db),
):
    """Flag: the item stops serving everywhere until the flag is resolved.
    Notes are required - a flag without a reason helps nobody."""
    if not body.notes or not body.notes.strip():
        raise HTTPException(422, "flagging requires notes explaining the problem")
    item = await _item(db, item_id)
    item.review_status = ItemReviewStatus.FLAGGED
    item.reviewed_by = current_user.id
    item.reviewed_at = datetime.utcnow()
    item.review_notes = body.notes
    await db.commit()
    return {"item_id": str(item.id), "review_status": item.review_status.value}


@router.post("/mcat/sme/passages/{passage_id}/approve")
async def approve_passage(
    passage_id: uuid_mod.UUID,
    body: ReviewIn,
    current_user: User = Depends(require_teacher),
    db: AsyncSession = Depends(get_db),
):
    bank = await _bank(db)
    passage = (
        await db.execute(
            select(Passage).where(
                Passage.id == passage_id,
                Passage.bank_id == bank.id,
                Passage.deleted_at.is_(None),
            )
        )
    ).scalar_one_or_none()
    if passage is None:
        raise HTTPException(404, "unknown passage")
    passage.review_status = ItemReviewStatus.APPROVED
    passage.reviewed_by = current_user.id
    passage.reviewed_at = datetime.utcnow()
    await db.commit()
    return {
        "passage_id": str(passage.id),
        "review_status": passage.review_status.value,
    }

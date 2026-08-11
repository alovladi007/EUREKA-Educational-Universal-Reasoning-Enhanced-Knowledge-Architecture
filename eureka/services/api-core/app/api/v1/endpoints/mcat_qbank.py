"""MCAT QBank served from the server item bank (C1 step 2; AUDIT MC-1/MC-4/MC-5).

Replaces the client-bundled 580-item bank. The rules this router exists to
enforce:

  - The answer key and the explanation are returned ONLY in the grading
    response, after an answer is submitted. Serving carries neither.
  - Grading is server-side, against the bank row - the client reports a
    choice, never a verdict.
  - Every graded response becomes an attempt_logs row (answer, correctness,
    time), which is what honest analytics and any future IRT calibration
    stand on. Aggregates derive from these rows; they are never accepted
    from the client.

Access: any authenticated user, matching the product as it stands (the same
items were previously free in the client bundle - moving them server-side is
an integrity fix, not a price change). The paid gates stay where they are:
the full-length simulator (C3) and any APPROVED-only paid pool (C5).

Review honesty: every item in this bank is review_status='draft'
(AI-generated, awaiting SME review) and the responses say so - both a
per-item review_status field and a bank-level disclaimer. Per C5, draft
items may serve in free practice with their standing disclosed; they are
excluded from any paid pool until approved.
"""

from __future__ import annotations

import uuid as uuid_mod

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User
from app.models.exam import AttemptLog
from app.models.item_bank import Item, ItemBank
from app.utils.dependencies import get_current_active_user

router = APIRouter()

BANK_SLUG = "mcat-qbank-v1"

DISCLAIMER = (
    "These items are AI-generated and awaiting subject-matter-expert review "
    "(review_status is shown per item). They are practice material, not "
    "validated exam content."
)


class QbankSubmitIn(BaseModel):
    item_id: uuid_mod.UUID
    choice_index: int = Field(..., ge=0, le=7)
    seconds: int = Field(0, ge=0, le=3600)


async def _bank(db: AsyncSession) -> ItemBank:
    bank = (
        await db.execute(select(ItemBank).where(ItemBank.slug == BANK_SLUG))
    ).scalar_one_or_none()
    if bank is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "The MCAT item bank is not seeded on this deployment.",
        )
    return bank


@router.get("/mcat/qbank/overview")
async def qbank_overview(
    _user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Sections and subtopics with item counts, for building a selector.
    Counts come from the bank, not a hardcoded list."""
    bank = await _bank(db)
    rows = (
        await db.execute(
            select(
                Item.extra_metadata["topic_id"].as_integer().label("topic_id"),
                Item.extra_metadata["section"].as_string().label("section"),
                Item.extra_metadata["subtopic"].as_string().label("subtopic"),
                func.count().label("n"),
            )
            .where(Item.bank_id == bank.id, Item.deleted_at.is_(None))
            .group_by("topic_id", "section", "subtopic")
        )
    ).all()
    sections: dict[int, dict] = {}
    for topic_id, section, subtopic, n in rows:
        s = sections.setdefault(
            int(topic_id), {"topic_id": int(topic_id), "section": section,
                            "items": 0, "subtopics": []}
        )
        s["items"] += int(n)
        s["subtopics"].append({"subtopic": subtopic, "items": int(n)})
    for s in sections.values():
        s["subtopics"].sort(key=lambda x: x["subtopic"] or "")
    return {
        "sections": [sections[k] for k in sorted(sections)],
        "disclaimer": DISCLAIMER,
    }


@router.get("/mcat/qbank/items")
async def qbank_items(
    topic_id: int | None = None,
    subtopic: str | None = None,
    count: int = 10,
    _user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """A random draw of items - WITHOUT keys or explanations. Those exist
    only in the grading response."""
    if not 1 <= count <= 40:
        raise HTTPException(422, "count must be between 1 and 40")
    bank = await _bank(db)
    q = select(Item).where(Item.bank_id == bank.id, Item.deleted_at.is_(None))
    if topic_id is not None:
        q = q.where(Item.extra_metadata["topic_id"].as_integer() == topic_id)
    if subtopic:
        q = q.where(Item.extra_metadata["subtopic"].as_string() == subtopic)
    items = (
        (await db.execute(q.order_by(func.random()).limit(count))).scalars().all()
    )
    return {
        "items": [
            {
                "item_id": str(i.id),
                "stem": i.content.get("stem"),
                "options": list(i.content.get("options", [])),
                "option_count": len(i.content.get("options", [])),
                "difficulty": i.difficulty_nominal,
                "section": i.extra_metadata.get("section"),
                "subtopic": i.extra_metadata.get("subtopic"),
                "review_status": i.review_status.value,
            }
            for i in items
        ],
        "disclaimer": DISCLAIMER,
    }


@router.post("/mcat/qbank/submit")
async def qbank_submit(
    body: QbankSubmitIn,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Grade one answer server-side and log the response.

    The key and the explanation appear here - after the answer - and
    nowhere else."""
    bank = await _bank(db)
    item = (
        await db.execute(
            select(Item).where(
                Item.id == body.item_id,
                Item.bank_id == bank.id,
                Item.deleted_at.is_(None),
            )
        )
    ).scalar_one_or_none()
    if item is None:
        raise HTTPException(404, "unknown item")
    options = list(item.content.get("options", []))
    if body.choice_index >= len(options):
        raise HTTPException(
            422, f"choice_index out of range: this item has {len(options)} options"
        )
    correct_index = int(item.content["correct_index"])
    is_correct = body.choice_index == correct_index

    db.add(
        AttemptLog(
            user_id=current_user.id,
            item_id=item.id,
            answer_index=body.choice_index,
            is_correct=is_correct,
            time_taken_ms=body.seconds * 1000,
            source="mcat_qbank",
        )
    )
    item.attempts_count = (item.attempts_count or 0) + 1
    await db.commit()

    return {
        "is_correct": is_correct,
        "correct_index": correct_index,
        "correct_text": str(options[correct_index]),
        "chosen_index": body.choice_index,
        "explanation": item.explanation,
        "section": item.extra_metadata.get("section"),
        "subtopic": item.extra_metadata.get("subtopic"),
        "review_status": item.review_status.value,
        "disclaimer": DISCLAIMER,
    }

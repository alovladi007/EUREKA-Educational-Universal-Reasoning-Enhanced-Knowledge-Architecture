"""NCLEX-RN QBank served from the server item bank (NX-3).

Same contract as the MCAT server bank (mcat_qbank.py), which this follows
deliberately rather than inventing a second pattern:

  - The answer key and the explanation are returned ONLY in the grading
    response, after an answer is submitted. Serving carries neither.
  - Grading is server-side, against the bank row — the client reports a
    choice, never a verdict.
  - Every graded response becomes an attempt_logs row (source
    'nclex_qbank'), the substrate for honest analytics and any future
    calibration.

What NCLEX adds over the MCAT contract:

  - SATA ("select all that apply") items: kind=mcq_multi, submitted as a
    set of indices. Graded ALL-OR-NOTHING — the classic NCLEX standard for
    SATA — with the per-option breakdown included in the response so the
    UI can show which selections were right without softening the score.
  - A per-item `verification` tier surfaced from metadata:
    'calc-verified' (dosage keys computed and dual-path checked) vs
    'unverified' (AI-authored clinical content pending SME review). Both
    are DRAFT in review_status terms; the badge tells the student which
    kind of trust each item has earned.

Access: any authenticated user — these items were previously free in the
client bundle, so serving them server-side is an integrity fix, not a
price change (the MCAT precedent, C1).
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
from app.models.item_bank import Item, ItemBank, ItemKind, ItemReviewStatus
from app.utils.dependencies import get_current_active_user

router = APIRouter()

BANK_SLUG = "nclex-qbank-v1"

DISCLAIMER = (
    "Dosage-calculation items carry computed, dual-path-verified keys "
    "(badged calc-verified). Clinical items are AI-authored and awaiting "
    "subject-matter-expert review. None of this bank is SME-approved yet; "
    "it is practice material, not validated exam content."
)


class QbankSubmitIn(BaseModel):
    item_id: uuid_mod.UUID
    # Exactly one of the two must be present; enforced in the handler where
    # the item's kind is known (a schema validator cannot see the item).
    choice_index: int | None = Field(None, ge=0, le=7)
    choice_indices: list[int] | None = Field(None, max_length=8)
    seconds: int = Field(0, ge=0, le=3600)


async def _bank(db: AsyncSession) -> ItemBank:
    bank = (
        await db.execute(select(ItemBank).where(ItemBank.slug == BANK_SLUG))
    ).scalar_one_or_none()
    if bank is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "The NCLEX item bank is not seeded on this deployment.",
        )
    return bank


def _serving_view(i: Item) -> dict:
    """The shape an unanswered item travels in: stem and options, no key."""
    return {
        "item_id": str(i.id),
        "kind": i.kind.value,  # mcq_single | mcq_multi — the UI needs this
        "stem": i.content.get("stem"),
        "options": list(i.content.get("options", [])),
        "option_count": len(i.content.get("options", [])),
        # Author-assigned label, NOT a measured statistic.
        "difficulty_nominal": i.difficulty_nominal,
        "topic_id": i.extra_metadata.get("topic_id"),
        "category_id": i.extra_metadata.get("category_id"),
        "section": i.extra_metadata.get("section"),
        "subtopic": i.extra_metadata.get("subtopic"),
        "verification": i.extra_metadata.get("verification"),
        "review_status": i.review_status.value,
    }


@router.get("/nclex/qbank/overview")
async def qbank_overview(
    _user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """The 8 Client Needs categories with item counts, from the bank —
    not a hardcoded list, so authored growth shows up without a deploy."""
    bank = await _bank(db)
    rows = (
        await db.execute(
            select(
                Item.extra_metadata["topic_id"].as_integer().label("topic_id"),
                Item.extra_metadata["category_id"].as_string().label("category_id"),
                Item.extra_metadata["section"].as_string().label("section"),
                Item.extra_metadata["subtopic"].as_string().label("subtopic"),
                func.count().label("n"),
            )
            .where(Item.bank_id == bank.id, Item.deleted_at.is_(None))
            .group_by("topic_id", "category_id", "section", "subtopic")
        )
    ).all()
    sections: dict[int, dict] = {}
    for topic_id, category_id, section, subtopic, n in rows:
        s = sections.setdefault(
            int(topic_id),
            {
                "topic_id": int(topic_id),
                "category_id": category_id,
                "section": section,
                "items": 0,
                "subtopics": [],
            },
        )
        s["items"] += int(n)
        s["subtopics"].append({"subtopic": subtopic, "items": int(n)})
    for s in sections.values():
        s["subtopics"].sort(key=lambda x: x["subtopic"] or "")
    return {
        "sections": [sections[k] for k in sorted(sections)],
        "disclaimer": DISCLAIMER,
    }


@router.get("/nclex/qbank/items")
async def qbank_items(
    topic_id: int | None = None,
    subtopic: str | None = None,
    count: int = 10,
    _user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """A random draw — WITHOUT keys or explanations. Those exist only in
    the grading response."""
    if not 1 <= count <= 40:
        raise HTTPException(422, "count must be between 1 and 40")
    bank = await _bank(db)
    q = select(Item).where(
        Item.bank_id == bank.id,
        Item.deleted_at.is_(None),
        # Serving rule shared with MCAT: flagged and retired never serve.
        Item.review_status.notin_(
            (ItemReviewStatus.FLAGGED, ItemReviewStatus.RETIRED)
        ),
    )
    if topic_id is not None:
        q = q.where(Item.extra_metadata["topic_id"].as_integer() == topic_id)
    if subtopic:
        q = q.where(Item.extra_metadata["subtopic"].as_string() == subtopic)
    items = (
        (await db.execute(q.order_by(func.random()).limit(count))).scalars().all()
    )
    return {"items": [_serving_view(i) for i in items], "disclaimer": DISCLAIMER}


@router.post("/nclex/qbank/submit")
async def qbank_submit(
    body: QbankSubmitIn,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Grade one answer server-side and log the response. The key and the
    explanation appear here — after the answer — and nowhere else."""
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

    if item.kind == ItemKind.MCQ_MULTI:
        if body.choice_indices is None or body.choice_index is not None:
            raise HTTPException(
                422, "this is a select-all-that-apply item: submit choice_indices"
            )
        chosen = sorted(set(body.choice_indices))
        if not chosen:
            raise HTTPException(422, "choice_indices must not be empty")
        if any(c < 0 or c >= len(options) for c in chosen):
            raise HTTPException(
                422, f"choice index out of range: this item has {len(options)} options"
            )
        correct = sorted(item.content["correct_indices"])
        # All-or-nothing: the classic NCLEX SATA standard. The breakdown in
        # the response shows partial detail without softening the score.
        is_correct = chosen == correct
        log_extra = {"choice_indices": chosen}
        answer_index = None
        verdict = {
            "correct_indices": correct,
            "correct_texts": [str(options[i]) for i in correct],
            "chosen_indices": chosen,
            "n_correct_selected": len(set(chosen) & set(correct)),
            "n_incorrect_selected": len(set(chosen) - set(correct)),
            "n_missed": len(set(correct) - set(chosen)),
            "scoring": "all_or_nothing",
        }
    else:
        if body.choice_index is None or body.choice_indices is not None:
            raise HTTPException(422, "this item takes a single choice_index")
        if body.choice_index >= len(options):
            raise HTTPException(
                422, f"choice_index out of range: this item has {len(options)} options"
            )
        correct_index = int(item.content["correct_index"])
        is_correct = body.choice_index == correct_index
        log_extra = {}
        answer_index = body.choice_index
        verdict = {
            "correct_index": correct_index,
            "correct_text": str(options[correct_index]),
            "chosen_index": body.choice_index,
        }

    db.add(
        AttemptLog(
            user_id=current_user.id,
            item_id=item.id,
            answer_index=answer_index,
            is_correct=is_correct,
            time_taken_ms=body.seconds * 1000,
            source="nclex_qbank",
            extra_metadata=log_extra,
        )
    )
    item.attempts_count = (item.attempts_count or 0) + 1
    await db.commit()

    return {
        "is_correct": is_correct,
        "kind": item.kind.value,
        **verdict,
        "explanation": item.explanation,
        "section": item.extra_metadata.get("section"),
        "subtopic": item.extra_metadata.get("subtopic"),
        "verification": item.extra_metadata.get("verification"),
        "review_status": item.review_status.value,
        "disclaimer": DISCLAIMER,
    }

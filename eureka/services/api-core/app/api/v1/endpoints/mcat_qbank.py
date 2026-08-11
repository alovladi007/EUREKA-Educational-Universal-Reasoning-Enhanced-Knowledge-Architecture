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
from sqlalchemy import Integer, and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User
from app.models.exam import AttemptLog
from app.models.item_bank import Item, ItemBank, Passage
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
    # Passage-attached items are excluded from the discrete draw: an item
    # written against a passage is unanswerable without it (serve those via
    # /passage-set).
    q = select(Item).where(
        Item.bank_id == bank.id,
        Item.deleted_at.is_(None),
        Item.passage_id.is_(None),
    )
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


@router.get("/mcat/qbank/passages")
async def qbank_passages(
    _user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """The available passage sets, with counts and review standing."""
    bank = await _bank(db)
    rows = (
        await db.execute(
            select(Passage, func.count(Item.id))
            .join(Item, Item.passage_id == Passage.id, isouter=True)
            .where(Passage.bank_id == bank.id, Passage.deleted_at.is_(None))
            .group_by(Passage.id)
            .order_by(Passage.topic_id, Passage.title)
        )
    ).all()
    return {
        "passages": [
            {
                "passage_id": str(p.id),
                "title": p.title,
                "topic_id": p.topic_id,
                "section": p.section,
                "question_count": int(n),
                "review_status": p.review_status.value,
            }
            for p, n in rows
        ],
        "disclaimer": DISCLAIMER,
    }


@router.get("/mcat/qbank/passage-set/{passage_id}")
async def qbank_passage_set(
    passage_id: uuid_mod.UUID,
    _user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """One passage with its attached items - the passage text travels, the
    keys and explanations do not (grading stays per-item via /submit)."""
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
    items = (
        (
            await db.execute(
                select(Item)
                .where(Item.passage_id == passage.id, Item.deleted_at.is_(None))
                .order_by(Item.created_at)
            )
        )
        .scalars()
        .all()
    )
    return {
        "passage": {
            "passage_id": str(passage.id),
            "title": passage.title,
            "body": passage.body,
            "topic_id": passage.topic_id,
            "section": passage.section,
            "review_status": passage.review_status.value,
        },
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


# -- Review center (C4, AUDIT MC-12) ----------------------------------------
#
# Fed entirely by attempt_logs - the response-level record the qbank and the
# simulator write. Nothing here is client-claimed, nothing is a percentile:
# it is this account's recorded answers, with the counts beside every figure.
# Keys and explanations appear here because every listed item was already
# graded - review is the one place they belong.

REVIEW_SOURCES = ("mcat_qbank", "mcat_mock")


@router.get("/mcat/review/summary")
async def review_summary(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Accuracy by section and by subtopic (worst first), from recorded
    responses only."""
    bank = await _bank(db)
    rows = (
        await db.execute(
            select(
                Item.extra_metadata["section"].as_string().label("section"),
                Item.extra_metadata["subtopic"].as_string().label("subtopic"),
                func.count().label("attempts"),
                func.sum(func.cast(AttemptLog.is_correct, Integer)).label("correct"),
            )
            .join(Item, Item.id == AttemptLog.item_id)
            .where(
                AttemptLog.user_id == current_user.id,
                AttemptLog.source.in_(REVIEW_SOURCES),
                Item.bank_id == bank.id,
            )
            .group_by("section", "subtopic")
        )
    ).all()

    by_section: dict[str, dict] = {}
    by_subtopic = []
    for section, subtopic, attempts, correct in rows:
        correct = int(correct or 0)
        attempts = int(attempts)
        s = by_section.setdefault(
            section, {"section": section, "attempts": 0, "correct": 0}
        )
        s["attempts"] += attempts
        s["correct"] += correct
        by_subtopic.append(
            {
                "subtopic": subtopic,
                "section": section,
                "attempts": attempts,
                "correct": correct,
                "accuracy": round(correct / attempts, 3) if attempts else None,
            }
        )
    for s in by_section.values():
        s["accuracy"] = (
            round(s["correct"] / s["attempts"], 3) if s["attempts"] else None
        )
    by_subtopic.sort(key=lambda x: (x["accuracy"] is None, x["accuracy"], -x["attempts"]))
    return {
        "by_section": sorted(by_section.values(), key=lambda s: s["section"] or ""),
        "weakest_subtopics": by_subtopic[:12],
        "note": (
            "This account's recorded responses only (practice and simulator), "
            "with attempt counts beside every figure. No percentile: there is "
            "no cohort to compare against."
        ),
    }


@router.get("/mcat/review/missed")
async def review_missed(
    limit: int = 20,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Items whose LATEST recorded response is wrong, most recent first.
    Answering one correctly (in practice or a sitting) drops it off."""
    if not 1 <= limit <= 50:
        raise HTTPException(422, "limit must be between 1 and 50")
    bank = await _bank(db)
    latest = (
        select(
            AttemptLog.item_id.label("item_id"),
            func.max(AttemptLog.created_at).label("mx"),
        )
        .where(
            AttemptLog.user_id == current_user.id,
            AttemptLog.source.in_(REVIEW_SOURCES),
        )
        .group_by(AttemptLog.item_id)
        .subquery()
    )
    rows = (
        await db.execute(
            select(AttemptLog, Item)
            .join(
                latest,
                and_(
                    AttemptLog.item_id == latest.c.item_id,
                    AttemptLog.created_at == latest.c.mx,
                ),
            )
            .join(Item, Item.id == AttemptLog.item_id)
            .where(
                AttemptLog.user_id == current_user.id,
                AttemptLog.source.in_(REVIEW_SOURCES),
                AttemptLog.is_correct.is_(False),
                Item.bank_id == bank.id,
                Item.deleted_at.is_(None),
            )
            .order_by(AttemptLog.created_at.desc())
            .limit(limit * 2)  # headroom for same-timestamp duplicates
        )
    ).all()

    counts = dict(
        (
            await db.execute(
                select(AttemptLog.item_id, func.count())
                .where(
                    AttemptLog.user_id == current_user.id,
                    AttemptLog.source.in_(REVIEW_SOURCES),
                )
                .group_by(AttemptLog.item_id)
            )
        ).all()
    )

    seen: set = set()
    missed = []
    for log, item in rows:
        if item.id in seen or len(missed) >= limit:
            continue
        seen.add(item.id)
        options = list(item.content.get("options", []))
        missed.append(
            {
                "item_id": str(item.id),
                "stem": item.content.get("stem"),
                "options": options,
                "chosen_index": log.answer_index,
                "correct_index": int(item.content["correct_index"]),
                "explanation": item.explanation,
                "section": item.extra_metadata.get("section"),
                "subtopic": item.extra_metadata.get("subtopic"),
                "times_attempted": int(counts.get(item.id, 0)),
                "last_missed_at": log.created_at.isoformat() + "Z",
                "source": log.source,
            }
        )
    return {
        "missed": missed,
        "note": (
            "Each entry is the latest recorded response for that question. "
            "Answer it correctly anywhere - practice or a sitting - and it "
            "leaves this list."
        ),
    }

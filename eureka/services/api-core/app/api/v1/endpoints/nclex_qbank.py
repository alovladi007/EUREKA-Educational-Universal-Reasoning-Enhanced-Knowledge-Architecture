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
from app.models.item_bank import Item, ItemBank, ItemKind, ItemReviewStatus, Passage
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
        # Case-study questions are unanswerable without their scenario - they
        # serve only via /case-study/{id}, never in the discrete draw (the
        # same rule MCAT applies to passage-attached items).
        Item.passage_id.is_(None),
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
        "strategy": item.extra_metadata.get("strategy"),
        "section": item.extra_metadata.get("section"),
        "subtopic": item.extra_metadata.get("subtopic"),
        "verification": item.extra_metadata.get("verification"),
        "review_status": item.review_status.value,
        "disclaimer": DISCLAIMER,
    }


# -- NGN unfolding case studies (NX-14) ---------------------------------------
#
# Next Gen NCLEX presents an evolving clinical scenario with six sequential
# questions that walk the clinical-judgment steps (recognize cues -> analyze
# -> prioritize -> generate solutions -> act -> evaluate). Structurally this
# is the MCAT passage pattern: a Passage row carries the initial scenario,
# attached Items carry the phase updates in their stems, and creation order
# is presentation order. Grading goes through the SAME /submit as everything
# else - a case question is a bank item and logs like one.


@router.get("/nclex/qbank/case-studies")
async def case_studies(
    _user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """The available unfolding case studies, with counts and review standing."""
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
        "case_studies": [
            {
                "case_id": str(p.id),
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


@router.get("/nclex/qbank/case-study/{case_id}")
async def case_study(
    case_id: uuid_mod.UUID,
    _user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """One case study: the initial scenario plus its questions in
    presentation order. Phase updates live in each question's stem; keys
    and explanations exist only in the grading response."""
    bank = await _bank(db)
    case = (
        await db.execute(
            select(Passage).where(
                Passage.id == case_id,
                Passage.bank_id == bank.id,
                Passage.deleted_at.is_(None),
            )
        )
    ).scalar_one_or_none()
    if case is None:
        raise HTTPException(404, "unknown case study")
    items = (
        (
            await db.execute(
                select(Item)
                .where(
                    Item.passage_id == case.id,
                    Item.deleted_at.is_(None),
                    Item.review_status.notin_(
                        (ItemReviewStatus.FLAGGED, ItemReviewStatus.RETIRED)
                    ),
                )
                .order_by(Item.created_at)
            )
        )
        .scalars()
        .all()
    )
    return {
        "case": {
            "case_id": str(case.id),
            "title": case.title,
            "scenario": case.body,
            "topic_id": case.topic_id,
            "section": case.section,
            "review_status": case.review_status.value,
        },
        "items": [_serving_view(i) for i in items],
        "disclaimer": DISCLAIMER,
    }


# -- Review center (NX-9) -----------------------------------------------------
#
# The MCAT review pattern (mcat_qbank.py C4) applied to source
# 'nclex_qbank': fed entirely by attempt_logs, nothing client-claimed, no
# percentile. Keys and explanations appear here because every listed item
# was already graded - review is the one place they belong. The NCLEX
# addition: SATA misses return the chosen index set from the log's
# metadata alongside the correct set.

REVIEW_SOURCE = "nclex_qbank"


@router.get("/nclex/review/summary")
async def review_summary(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Accuracy by Client Needs category and by subtopic (worst first),
    from recorded responses only."""
    from sqlalchemy import Integer, func as sa_func

    bank = await _bank(db)
    rows = (
        await db.execute(
            select(
                Item.extra_metadata["section"].as_string().label("section"),
                Item.extra_metadata["subtopic"].as_string().label("subtopic"),
                sa_func.count().label("attempts"),
                sa_func.sum(sa_func.cast(AttemptLog.is_correct, Integer)).label("correct"),
            )
            .join(Item, Item.id == AttemptLog.item_id)
            .where(
                AttemptLog.user_id == current_user.id,
                AttemptLog.source == REVIEW_SOURCE,
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
            "This account's recorded responses only, with attempt counts "
            "beside every figure. No percentile: there is no cohort to "
            "compare against."
        ),
    }


@router.get("/nclex/review/missed")
async def review_missed(
    limit: int = 20,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Items whose LATEST recorded response is wrong, most recent first.
    Answering one correctly drops it off."""
    from sqlalchemy import and_ as sa_and, func as sa_func

    if not 1 <= limit <= 50:
        raise HTTPException(422, "limit must be between 1 and 50")
    bank = await _bank(db)
    latest = (
        select(
            AttemptLog.item_id.label("item_id"),
            sa_func.max(AttemptLog.created_at).label("mx"),
        )
        .where(
            AttemptLog.user_id == current_user.id,
            AttemptLog.source == REVIEW_SOURCE,
        )
        .group_by(AttemptLog.item_id)
        .subquery()
    )
    rows = (
        await db.execute(
            select(AttemptLog, Item)
            .join(
                latest,
                sa_and(
                    AttemptLog.item_id == latest.c.item_id,
                    AttemptLog.created_at == latest.c.mx,
                ),
            )
            .join(Item, Item.id == AttemptLog.item_id)
            .where(
                AttemptLog.user_id == current_user.id,
                AttemptLog.source == REVIEW_SOURCE,
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
                select(AttemptLog.item_id, sa_func.count())
                .where(
                    AttemptLog.user_id == current_user.id,
                    AttemptLog.source == REVIEW_SOURCE,
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
        entry = {
            "item_id": str(item.id),
            "kind": item.kind.value,
            "stem": item.content.get("stem"),
            "options": options,
            "explanation": item.explanation,
            "strategy": item.extra_metadata.get("strategy"),
            "section": item.extra_metadata.get("section"),
            "subtopic": item.extra_metadata.get("subtopic"),
            "verification": item.extra_metadata.get("verification"),
            "times_attempted": int(counts.get(item.id, 0)),
            "last_missed_at": log.created_at.isoformat() + "Z",
        }
        if item.kind == ItemKind.MCQ_MULTI:
            entry["correct_indices"] = sorted(item.content["correct_indices"])
            entry["chosen_indices"] = (log.extra_metadata or {}).get("choice_indices")
        else:
            entry["correct_index"] = int(item.content["correct_index"])
            entry["chosen_index"] = log.answer_index
        missed.append(entry)
    return {
        "missed": missed,
        "note": (
            "Each entry is the latest recorded response for that question. "
            "Answer it correctly and it leaves this list."
        ),
    }

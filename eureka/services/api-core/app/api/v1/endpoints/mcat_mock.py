"""MCAT full-length simulator, server-graded (C3; AUDIT MC-2/MC-9).

Replaces the removed client-side simulation. The rules:

  - The server draws the form, holds the clock, and grades. The client
    reports choices, never a verdict; keys and explanations appear only in
    the results, after submission.
  - Results are RAW and PER-SECTION only. The 472-528 scale requires
    equating data this platform does not have, so theta / scaled_score /
    pass_probability stay NULL on the attempt row - deliberately, not as
    an oversight. When calibration exists (C6 threshold), scoring can be
    revisited; nothing is predicted before then.
  - Every graded response also lands in attempt_logs (source='mcat_mock'),
    the same response-level record the qbank writes.

Access: authenticated users. The pool rule (C5) does the honest gating:
an MCAT-entitled learner's sitting draws SME-APPROVED items only -
unreviewed content is never sold - and refuses with the reason rather than
padding; free sittings may use draft items with the disclaimer, never
flagged or retired ones.

Forms are ExamBlueprint rows (get-or-created by slug): mcat-mini-v1 - 16
questions, 4 per section, 40 minutes, for a short sitting; mcat-full-v1 -
230 questions in the real 59/53/59/59 section distribution, 375 minutes.
score_mapping stays empty on both: there is no equating table to put in it.
"""

from __future__ import annotations

import uuid as uuid_mod
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User
from app.models.exam import (
    AttemptLog, ExamBlueprint, MockAttempt, MockAttemptItem, MockAttemptStatus,
)
from app.models.item_bank import Item, ItemBank, ItemReviewStatus
from app.utils.dependencies import get_current_active_user
from app.utils.entitlements import has_exam_access

router = APIRouter()

BANK_SLUG = "mcat-qbank-v1"

SECTION_NAMES = {
    0: "Chemical and Physical Foundations",
    1: "Critical Analysis and Reasoning Skills",
    2: "Biological and Biochemical Foundations",
    3: "Psychological, Social, and Biological Foundations",
}

FORMS = {
    "mini": {
        "slug": "mcat-mini-v1",
        "name": "MCAT mini form (16 questions)",
        "section_counts": {0: 4, 1: 4, 2: 4, 3: 4},
        "time_limit_min": 40,
    },
    "full": {
        "slug": "mcat-full-v1",
        "name": "MCAT full form (230 questions)",
        "section_counts": {0: 59, 1: 53, 2: 59, 3: 59},
        "time_limit_min": 375,
    },
}

NO_SCALE_NOTE = (
    "Results are raw and per-section only. A 472-528 scaled score requires "
    "equating data this platform does not have; none is shown and none is "
    "predicted."
)

DISCLAIMER = (
    "These items are AI-generated and awaiting subject-matter-expert review. "
    "They are practice material, not validated exam content."
)


class MockStartIn(BaseModel):
    form: str = Field("mini", pattern="^(mini|full)$")


class MockAnswer(BaseModel):
    position: int = Field(..., ge=0)
    choice_index: int | None = Field(None, ge=0, le=7)


class MockSubmitIn(BaseModel):
    answers: list[MockAnswer] = Field(..., max_length=300)


async def _bank(db: AsyncSession) -> ItemBank:
    bank = (
        await db.execute(select(ItemBank).where(ItemBank.slug == BANK_SLUG))
    ).scalar_one_or_none()
    if bank is None:
        raise HTTPException(503, "The MCAT item bank is not seeded on this deployment.")
    return bank


async def _blueprint(db: AsyncSession, form_key: str) -> ExamBlueprint:
    spec = FORMS[form_key]
    bp = (
        await db.execute(
            select(ExamBlueprint).where(ExamBlueprint.slug == spec["slug"])
        )
    ).scalar_one_or_none()
    if bp is None:
        bp = ExamBlueprint(
            slug=spec["slug"],
            name=spec["name"],
            description=NO_SCALE_NOTE,
            bank_slugs=[BANK_SLUG],
            skill_weights=[],
            item_count=sum(spec["section_counts"].values()),
            time_limit_min=spec["time_limit_min"],
            score_mapping=[],  # no equating data exists; deliberately empty
            extra_metadata={
                "section_counts": {str(k): v for k, v in spec["section_counts"].items()},
                "form": form_key,
            },
        )
        db.add(bp)
        await db.flush()
    return bp


def _served_item(i: Item, position: int) -> dict:
    return {
        "position": position,
        "item_id": str(i.id),
        "stem": i.content.get("stem"),
        "options": list(i.content.get("options", [])),
        "option_count": len(i.content.get("options", [])),
        "topic_id": i.extra_metadata.get("topic_id"),
        "section": i.extra_metadata.get("section"),
        "subtopic": i.extra_metadata.get("subtopic"),
    }


@router.post("/mcat/mock/start")
async def mock_start(
    body: MockStartIn,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Draw a form and open the attempt. No keys travel."""
    bank = await _bank(db)
    bp = await _blueprint(db, body.form)
    spec = FORMS[body.form]

    # C5 pool rule: an ENTITLED learner's sitting draws approved items only -
    # unreviewed content is never sold - and refuses with the reason rather
    # than padding from the draft pool. Free sittings may use draft items
    # (disclaimer shown) but never flagged or retired ones.
    paid = await has_exam_access(db, current_user, "MCAT")
    if paid:
        status_clause = Item.review_status == ItemReviewStatus.APPROVED
    else:
        status_clause = Item.review_status.notin_(
            (ItemReviewStatus.FLAGGED, ItemReviewStatus.RETIRED)
        )

    drawn: list[Item] = []
    for topic_id, n in spec["section_counts"].items():
        rows = (
            (
                await db.execute(
                    select(Item)
                    .where(
                        Item.bank_id == bank.id,
                        Item.deleted_at.is_(None),
                        Item.passage_id.is_(None),
                        status_clause,
                        Item.extra_metadata["topic_id"].as_integer() == topic_id,
                    )
                    .order_by(func.random())
                    .limit(n)
                )
            )
            .scalars()
            .all()
        )
        if len(rows) < n:
            pool = "SME-approved" if paid else "servable"
            raise HTTPException(
                503,
                f"section {topic_id} has only {len(rows)} {pool} items; "
                f"the {body.form} form needs {n}. The form is not padded"
                + (" from unreviewed content." if paid else "."),
            )
        drawn.extend(rows)

    attempt = MockAttempt(
        user_id=current_user.id,
        blueprint_id=bp.id,
        deadline_at=datetime.utcnow() + timedelta(minutes=spec["time_limit_min"]),
        extra_metadata={"form": body.form, "bank": BANK_SLUG},
    )
    db.add(attempt)
    await db.flush()
    for pos, item in enumerate(drawn):
        db.add(
            MockAttemptItem(mock_attempt_id=attempt.id, item_id=item.id, position=pos)
        )
    await db.commit()

    return {
        "attempt_id": str(attempt.id),
        "form": body.form,
        "time_limit_min": spec["time_limit_min"],
        "deadline_at": attempt.deadline_at.isoformat() + "Z",
        "items": [_served_item(i, pos) for pos, i in enumerate(drawn)],
        "note": NO_SCALE_NOTE,
        "disclaimer": DISCLAIMER,
    }


async def _owned_attempt(
    db: AsyncSession, attempt_id: uuid_mod.UUID, user: User
) -> MockAttempt:
    attempt = (
        await db.execute(
            select(MockAttempt).where(
                MockAttempt.id == attempt_id, MockAttempt.user_id == user.id
            )
        )
    ).scalar_one_or_none()
    if attempt is None:
        raise HTTPException(404, "unknown attempt")
    return attempt


@router.post("/mcat/mock/{attempt_id}/submit")
async def mock_submit(
    attempt_id: uuid_mod.UUID,
    body: MockSubmitIn,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Grade the whole sitting server-side. Unanswered positions count wrong
    in the raw score and are reported as unanswered."""
    attempt = await _owned_attempt(db, attempt_id, current_user)
    if attempt.status != MockAttemptStatus.IN_PROGRESS:
        raise HTTPException(409, f"attempt is {attempt.status.value}, not in progress")

    rows = (
        (
            await db.execute(
                select(MockAttemptItem, Item)
                .join(Item, Item.id == MockAttemptItem.item_id)
                .where(MockAttemptItem.mock_attempt_id == attempt.id)
                .order_by(MockAttemptItem.position)
            )
        )
        .all()
    )
    answers = {a.position: a.choice_index for a in body.answers}

    now = datetime.utcnow()
    correct = answered = 0
    by_section: dict[str, dict] = {}
    review = []
    for mai, item in rows:
        choice = answers.get(mai.position)
        options = list(item.content.get("options", []))
        if choice is not None and choice >= len(options):
            raise HTTPException(
                422, f"position {mai.position}: choice_index out of range"
            )
        key = int(item.content["correct_index"])
        is_correct = choice == key
        mai.answer_index = choice
        mai.is_correct = is_correct
        mai.answered_at = now if choice is not None else None
        if choice is not None:
            answered += 1
            db.add(
                AttemptLog(
                    user_id=current_user.id,
                    item_id=item.id,
                    answer_index=choice,
                    is_correct=is_correct,
                    source="mcat_mock",
                    mock_attempt_id=attempt.id,
                )
            )
            item.attempts_count = (item.attempts_count or 0) + 1
        if is_correct:
            correct += 1
        tid = str(item.extra_metadata.get("topic_id"))
        sec = by_section.setdefault(
            tid,
            {"section": item.extra_metadata.get("section"),
             "correct": 0, "answered": 0, "total": 0},
        )
        sec["total"] += 1
        if choice is not None:
            sec["answered"] += 1
        if is_correct:
            sec["correct"] += 1
        review.append(
            {
                "position": mai.position,
                "stem": item.content.get("stem"),
                "options": options,
                "chosen_index": choice,
                "correct_index": key,
                "is_correct": is_correct,
                "explanation": item.explanation,
                "section": item.extra_metadata.get("section"),
                "subtopic": item.extra_metadata.get("subtopic"),
            }
        )

    attempt.status = MockAttemptStatus.SUBMITTED
    attempt.submitted_at = now
    attempt.correct_count = correct
    attempt.answered_count = answered
    # theta / scaled_score / pass_probability stay NULL: no equating data.
    attempt.scoring_snapshot = {
        "by_section": by_section,
        "note": NO_SCALE_NOTE,
    }
    await db.commit()

    return {
        "attempt_id": str(attempt.id),
        "raw": {"correct": correct, "answered": answered, "total": len(rows)},
        "by_section": by_section,
        "review": review,
        "note": NO_SCALE_NOTE,
        "disclaimer": DISCLAIMER,
    }


@router.get("/mcat/mock/history")
async def mock_history(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """This account's sittings: raw and per-section, nothing invented."""
    rows = (
        (
            await db.execute(
                select(MockAttempt)
                .where(MockAttempt.user_id == current_user.id)
                .order_by(MockAttempt.started_at.desc())
                .limit(50)
            )
        )
        .scalars()
        .all()
    )
    out = []
    for a in rows:
        if a.extra_metadata.get("bank") != BANK_SLUG:
            continue
        total = (
            await db.execute(
                select(func.count()).where(MockAttemptItem.mock_attempt_id == a.id)
            )
        ).scalar_one()
        out.append(
            {
                "attempt_id": str(a.id),
                "form": a.extra_metadata.get("form"),
                "status": a.status.value,
                "started_at": a.started_at.isoformat() + "Z",
                "submitted_at": a.submitted_at.isoformat() + "Z" if a.submitted_at else None,
                "correct": a.correct_count,
                "answered": a.answered_count,
                "total": int(total),
                "by_section": (a.scoring_snapshot or {}).get("by_section"),
            }
        )
    return {"attempts": out, "note": NO_SCALE_NOTE}

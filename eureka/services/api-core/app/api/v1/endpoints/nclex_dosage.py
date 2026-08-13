"""NCLEX Dosage Mastery — server-generated, server-graded med-math practice.

The OCTET-chemistry pattern applied to nursing dosage calculation: every item
is generated fresh on request, its answer key verified through two independent
computation paths BEFORE it is served (app/services/nclex_dosage.py refuses to
return an item whose paths disagree), grading happens here against the stored
key, and a wrong answer is diagnosed against the classic error values computed
for that item's exact parameters.

The rules this router enforces, same as mcat_qbank:

  - The expected answer, the worked explanation, and the misconception table
    are returned ONLY in the grading response. Serving carries the stem, the
    unit, and the rounding instruction — nothing a client could grade with.
  - Grading is server-side. The client reports a number, never a verdict.
  - Every graded response becomes an attempt_logs row (answer_value,
    correctness, time, family, diagnosis), which is what the stats endpoint
    aggregates — measured, never predicted.

Honesty: the answer KEYS are machine-verified (dual-path, plus a third
TypeScript path in CI for the static banks emitted from the same module).
The stem TEMPLATES are authored and not yet SME-reviewed, and every response
carries that distinction — review_status stays 'draft' until a nurse educator
signs off on the templates.

Storage: items land in the existing item-bank tables (bank slug
`nclex-dosage-engine-v1`, kind=numeric, content JSONB) — no schema changes.
"""

from __future__ import annotations

import uuid as uuid_mod

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User
from app.models.exam import AttemptLog
from app.models.item_bank import Item, ItemBank, ItemKind
from app.services import nclex_dosage as engine
from app.utils.dependencies import get_current_active_user

router = APIRouter()

BANK_SLUG = "nclex-dosage-engine-v1"
ATTEMPT_SOURCE = "nclex_dosage"

KEY_NOTE = (
    "Answer keys are machine-verified: two independent computation paths must "
    "agree before an item is served."
)
TEMPLATE_NOTE = (
    "Item templates are authored practice material, not yet reviewed by a "
    "nursing subject-matter expert."
)


class NextIn(BaseModel):
    family: str | None = Field(
        None, description="A dosage family key from /overview, or null for mixed practice."
    )


class SubmitIn(BaseModel):
    item_id: uuid_mod.UUID
    answer: float = Field(..., ge=-1e9, le=1e9)
    seconds: int = Field(0, ge=0, le=3600)


async def _bank(db: AsyncSession) -> ItemBank:
    """The engine's bank row, created on first use. Unlike the seeded MCAT
    bank, an empty deployment is not an error state here — generation IS the
    seeding."""
    bank = (
        await db.execute(select(ItemBank).where(ItemBank.slug == BANK_SLUG))
    ).scalar_one_or_none()
    if bank is None:
        bank = ItemBank(
            slug=BANK_SLUG,
            name="NCLEX Dosage Calculation Engine",
            description=(
                "Server-generated dosage-calculation items. Keys are dual-path "
                "machine-verified at generation time; stems are authored templates."
            ),
            tier="test_prep",
        )
        db.add(bank)
        await db.flush()
    return bank


@router.get("/nclex/dosage/overview")
async def overview(
    user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """The family list plus this user's measured per-family record."""
    stats = await _stats_rows(db, user)
    return {
        "families": [
            {
                "key": key,
                "label": engine.FAMILY_LABELS[key],
                **stats.get(key, {"answered": 0, "correct": 0}),
            }
            for key in sorted(engine.GENERATORS)
        ],
        "key_note": KEY_NOTE,
        "template_note": TEMPLATE_NOTE,
    }


@router.post("/nclex/dosage/next")
async def next_item(
    body: NextIn,
    _user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate, verify, persist, and serve one item — without its key."""
    if body.family is not None and body.family not in engine.GENERATORS:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY,
                            f"unknown dosage family: {body.family}")
    try:
        gen = engine.generate(body.family)
    except engine.VerificationError as exc:
        # The two computation paths disagreed. This is a bug to surface, not
        # a case to retry into silence.
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"item verification failed; nothing was served: {exc}",
        )

    bank = await _bank(db)
    item = Item(
        bank_id=bank.id,
        family_id=engine.family_uuid(gen.family),
        kind=ItemKind.NUMERIC,
        content=gen.content(),
        explanation=gen.explanation,
        tags=["nclex", "dosage", gen.family],
        estimated_time_sec=90,
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)

    return {
        "item_id": str(item.id),
        "family": gen.family,
        "family_label": engine.FAMILY_LABELS[gen.family],
        "stem": gen.stem,
        "unit": gen.unit,
        "round_decimals": gen.round,
        "key_note": KEY_NOTE,
        "template_note": TEMPLATE_NOTE,
        # Deliberately absent: expected, explanation, misconceptions.
    }


@router.post("/nclex/dosage/submit")
async def submit(
    body: SubmitIn,
    user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Grade a numeric answer server-side; return the verdict, the worked
    explanation, and — when the answer matches a classic error's value for
    this item's parameters — the named misconception with coaching."""
    bank = await _bank(db)
    item = (
        await db.execute(
            select(Item).where(Item.id == body.item_id, Item.bank_id == bank.id)
        )
    ).scalar_one_or_none()
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "dosage item not found")

    content = item.content
    is_correct = engine.grade(content, body.answer)
    misconception = None if is_correct else engine.diagnose(content, body.answer)

    db.add(AttemptLog(
        user_id=user.id,
        item_id=item.id,
        answer_value=body.answer,
        is_correct=is_correct,
        time_taken_ms=body.seconds * 1000,
        source=ATTEMPT_SOURCE,
        extra_metadata={
            "family": content["family"],
            "misconception": misconception["key"] if misconception else None,
        },
    ))
    await db.commit()

    nd = int(content["round"])
    return {
        "is_correct": is_correct,
        "expected": content["expected"],
        "expected_display": f"{content['expected']:g} {content['unit']}",
        "unit": content["unit"],
        "round_decimals": nd,
        "explanation": content["explanation"],
        "misconception": misconception,
        "key_note": KEY_NOTE,
        "template_note": TEMPLATE_NOTE,
    }


async def _stats_rows(db: AsyncSession, user: User) -> dict[str, dict]:
    """Per-family answered/correct counts for one user, from attempt_logs.
    Family comes from the attempt row's own metadata so the aggregate never
    needs to re-read item content."""
    rows = (
        await db.execute(
            select(
                AttemptLog.extra_metadata["family"].astext.label("family"),
                func.count().label("answered"),
                func.count().filter(AttemptLog.is_correct).label("correct"),
            )
            .where(
                AttemptLog.user_id == user.id,
                AttemptLog.source == ATTEMPT_SOURCE,
            )
            # GROUP BY ordinal, not the expression: asyncpg binds the 'family'
            # path literal as a fresh parameter on each appearance ($1 in the
            # SELECT, $2 in the GROUP BY), and Postgres refuses to assume two
            # parameters are equal — "must appear in the GROUP BY clause".
            .group_by(text("1"))
        )
    ).all()
    return {
        r.family: {"answered": int(r.answered), "correct": int(r.correct)}
        for r in rows
        if r.family
    }


@router.get("/nclex/dosage/stats")
async def stats(
    user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """This user's measured record, per family and overall. Nothing here is
    predicted or estimated — every number is a count of graded attempts."""
    per_family = await _stats_rows(db, user)
    answered = sum(v["answered"] for v in per_family.values())
    correct = sum(v["correct"] for v in per_family.values())
    return {
        "families": [
            {
                "key": key,
                "label": engine.FAMILY_LABELS[key],
                **per_family.get(key, {"answered": 0, "correct": 0}),
            }
            for key in sorted(engine.GENERATORS)
        ],
        "answered": answered,
        "correct": correct,
    }

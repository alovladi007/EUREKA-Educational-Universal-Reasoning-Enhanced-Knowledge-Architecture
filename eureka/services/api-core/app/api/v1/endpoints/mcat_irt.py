"""MCAT calibration readiness and calibration (C6; AUDIT MC-5 follow-on).

The response log has existed since C1; what C6 adds is the stated
threshold, the honest readiness report, and a calibration route that
refuses to estimate below it. The reasoning lives in
docs/mcat/IRT_CALIBRATION.md - this module is that document in code.

The threshold is BOTH conditions, per item:
  - at least MIN_RESPONSES responses, and
  - from at least MIN_DISTINCT_LEARNERS distinct learners.

Both, because responses and learners are not interchangeable: item and
person parameters are fit jointly, so 300 answers from five learners
mostly describes those five learners.

Nothing is claimed before an item clears it. /status exists so the gap is
visible rather than glossed over, and it reports zeros happily.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User
from app.models.exam import AttemptLog
from app.models.item_bank import Item, ItemBank
from app.services.irt import calibrate
from app.utils.dependencies import get_current_active_user, require_admin

router = APIRouter()

BANK_SLUG = "mcat-qbank-v1"

# See docs/mcat/IRT_CALIBRATION.md for why these values and not others.
MIN_RESPONSES = 300
MIN_DISTINCT_LEARNERS = 100

THRESHOLD_NOTE = (
    f"An item is eligible for calibration at >= {MIN_RESPONSES} responses "
    f"from >= {MIN_DISTINCT_LEARNERS} distinct learners - both conditions, "
    "per item. Below that, no difficulty is estimated and none is shown: "
    "the bank's difficulty labels are author-assigned, not measured. "
    "Calibration does not unlock scaled scoring; that needs equating data, "
    "which response volume alone never supplies."
)


async def _bank(db: AsyncSession) -> ItemBank:
    bank = (
        await db.execute(select(ItemBank).where(ItemBank.slug == BANK_SLUG))
    ).scalar_one_or_none()
    if bank is None:
        raise HTTPException(503, "The MCAT item bank is not seeded on this deployment.")
    return bank


async def _eligibility(db: AsyncSession, bank: ItemBank) -> dict:
    """Per-item response and distinct-learner counts, against the threshold."""
    rows = (
        await db.execute(
            select(
                Item.id,
                func.count(AttemptLog.id).label("responses"),
                func.count(func.distinct(AttemptLog.user_id)).label("learners"),
            )
            .join(AttemptLog, AttemptLog.item_id == Item.id, isouter=True)
            .where(Item.bank_id == bank.id, Item.deleted_at.is_(None))
            .group_by(Item.id)
        )
    ).all()

    total_items = len(rows)
    eligible = [
        r for r in rows if r.responses >= MIN_RESPONSES and r.learners >= MIN_DISTINCT_LEARNERS
    ]
    responses_total = sum(int(r.responses) for r in rows)
    best = max(rows, key=lambda r: (r.responses, r.learners), default=None)
    return {
        "total_items": total_items,
        "eligible_items": len(eligible),
        "eligible_item_ids": [str(r.id) for r in eligible],
        "responses_logged": responses_total,
        "most_answered_item": (
            {
                "responses": int(best.responses),
                "distinct_learners": int(best.learners),
            }
            if best is not None
            else None
        ),
    }


@router.get("/mcat/irt/status")
async def irt_status(
    _user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Calibration readiness, stated plainly - including when it is zero."""
    bank = await _bank(db)
    stats = await _eligibility(db, bank)
    calibrated = (
        await db.execute(
            select(func.count())
            .select_from(Item)
            .where(
                Item.bank_id == bank.id,
                Item.deleted_at.is_(None),
                Item.irt_calibrated_at.isnot(None),
            )
        )
    ).scalar_one()

    return {
        "threshold": {
            "min_responses_per_item": MIN_RESPONSES,
            "min_distinct_learners_per_item": MIN_DISTINCT_LEARNERS,
            "model": "2PL",
            "document": "docs/mcat/IRT_CALIBRATION.md",
        },
        "bank": {
            "total_items": stats["total_items"],
            "responses_logged": stats["responses_logged"],
            "most_answered_item": stats["most_answered_item"],
        },
        "eligible_items": stats["eligible_items"],
        "calibrated_items": int(calibrated),
        "ready_to_calibrate": stats["eligible_items"] > 0,
        "difficulty_shown": "nominal (author-assigned)"
        if int(calibrated) == 0
        else "measured for calibrated items, nominal for the rest",
        "note": THRESHOLD_NOTE,
    }


@router.post("/mcat/irt/calibrate")
async def irt_calibrate(
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Fit the 2PL over items that individually clear the threshold.

    Admin-only, and it refuses rather than estimating from thin data: if no
    item is eligible, nothing is written and the response says how far off
    the bank is. The MCAT path never uses the shared fitter's demo default.
    """
    bank = await _bank(db)
    stats = await _eligibility(db, bank)
    if stats["eligible_items"] == 0:
        raise HTTPException(
            409,
            {
                "message": (
                    "No item has cleared the calibration threshold, so nothing "
                    "was estimated."
                ),
                "threshold": {
                    "min_responses_per_item": MIN_RESPONSES,
                    "min_distinct_learners_per_item": MIN_DISTINCT_LEARNERS,
                },
                "most_answered_item": stats["most_answered_item"],
                "responses_logged": stats["responses_logged"],
            },
        )

    result = await calibrate(db, min_attempts_per_item=MIN_RESPONSES)
    await db.commit()
    return {
        "items_calibrated": len(result.items),
        "learners_with_theta": len(result.thetas),
        "iterations": result.iterations,
        "log_likelihood": result.log_likelihood,
        "threshold_applied": {
            "min_responses_per_item": MIN_RESPONSES,
            "min_distinct_learners_per_item": MIN_DISTINCT_LEARNERS,
        },
        "note": THRESHOLD_NOTE,
    }

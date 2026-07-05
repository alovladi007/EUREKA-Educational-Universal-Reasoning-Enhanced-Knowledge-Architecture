"""Classical-test-theory item calibration into IRTParameters.

Before enough data exists for full marginal-maximum-likelihood IRT calibration,
classical statistics still give a usable read on an item: the p-value (fraction
correct) maps to difficulty and the point-biserial correlation (how well the
item separates strong from weak learners) maps to discrimination. This module
computes those two statistics per item and delegates the classical-to-IRT
mapping to calibrate_from_stats, then upserts the result so the CAT engine and
analytics read stable parameters.

Items with too few responses are skipped and return None rather than emitting a
noisy, low-confidence estimate, so the caller can be honest about coverage.
"""

from __future__ import annotations

import math
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.adaptive.irt import calibrate_from_stats
from app.domains.adaptive.models import IRTParameters
from app.domains.assessment.models import Item
from app.domains.attempts.models import Response, Score

# Below this many scored responses the classical statistics are too unstable to
# trust, so the item is left uncalibrated.
MIN_RESPONSES = 5

# Used when the point-biserial is undefined (a degenerate group split). A
# moderate positive discrimination is a safe, documented default rather than
# zero, which would make the item carry no information.
PB_FALLBACK = 0.3


async def calibrate_item(session: AsyncSession, item_id: uuid.UUID) -> dict | None:
    """Compute classical statistics for one item and upsert its IRTParameters.

    The point-biserial correlates each responder's outcome on THIS item with
    their overall proportion correct across all their scored responses (the
    total-score criterion). Returns None when there are too few responses to
    calibrate honestly.
    """
    rows = (
        await session.execute(
            select(Score.is_correct, Response.user_id)
            .join(Response, Response.id == Score.response_id)
            .where(Response.item_id == item_id)
        )
    ).all()

    n = len(rows)
    if n < MIN_RESPONSES:
        return None

    p_value = sum(1 for is_correct, _uid in rows if is_correct) / n

    # Each responder's total is their proportion correct across every scored
    # response they have, the classical total-score criterion for discrimination.
    responder_ids = {uid for _ic, uid in rows}
    totals: dict[uuid.UUID, float] = {}
    for uid in responder_ids:
        user_rows = (
            await session.execute(
                select(Score.is_correct)
                .join(Response, Response.id == Score.response_id)
                .where(Response.user_id == uid)
            )
        ).all()
        if user_rows:
            totals[uid] = sum(1 for (ic,) in user_rows if ic) / len(user_rows)
        else:
            totals[uid] = 0.0

    group1 = [totals[uid] for is_correct, uid in rows if is_correct]
    group0 = [totals[uid] for is_correct, uid in rows if not is_correct]
    all_totals = [totals[uid] for _ic, uid in rows]

    mean_all = sum(all_totals) / len(all_totals)
    variance = sum((t - mean_all) ** 2 for t in all_totals) / len(all_totals)
    s = math.sqrt(variance)

    if s == 0 or not group1 or not group0:
        pb = PB_FALLBACK
    else:
        m1 = sum(group1) / len(group1)
        m0 = sum(group0) / len(group0)
        p = p_value
        q = 1.0 - p
        pb = (m1 - m0) / s * math.sqrt(p * q)
        pb = min(max(pb, 0.0), 1.0)

    params = calibrate_from_stats(p_value, pb, n)

    existing = (
        await session.execute(
            select(IRTParameters).where(IRTParameters.item_id == item_id)
        )
    ).scalar_one_or_none()
    if existing is None:
        existing = IRTParameters(item_id=item_id)
        session.add(existing)
    existing.a = params.a
    existing.b = params.b
    existing.c = params.c
    await session.flush()

    return {
        "item_id": str(item_id),
        "n": n,
        "p_value": round(p_value, 4),
        "point_biserial": round(pb, 4),
        "a": params.a,
        "b": params.b,
        "c": params.c,
    }


async def calibrate_all(session: AsyncSession) -> dict:
    """Calibrate every item with enough data and report what was updated.

    Items short on responses are silently skipped (calibrate_item returns None),
    so the count reflects only items with a trustworthy estimate.
    """
    items = (await session.execute(select(Item))).scalars().all()
    results: list[dict] = []
    for item in items:
        result = await calibrate_item(session, item.id)
        if result is not None:
            results.append(result)
    return {"calibrated": len(results), "items": results}

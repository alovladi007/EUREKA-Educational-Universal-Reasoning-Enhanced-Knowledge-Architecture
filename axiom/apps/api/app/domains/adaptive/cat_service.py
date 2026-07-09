"""Computerized adaptive testing (CAT) session service.

A CAT session administers one item at a time, re-estimates the learner ability
(theta) after every response, and picks the next item by maximum Fisher
information at the current theta. Stopping is driven by measurement precision:
the session ends once the standard error falls below SE_STOP (after a minimum
number of items) or a hard item cap is reached, so short tests still measure
low-precision learners and confident learners finish early.

The item parameters used for selection come from calibrated IRTParameters when
they exist; otherwise a difficulty-derived fallback keeps the algorithm running
before calibration data accrues, so a fresh bank is still testable.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.adaptive.irt import (
    ItemParams,
    estimate_theta,
    select_next,
)
from app.domains.adaptive.models import CatSession, IRTParameters
from app.domains.assessment.models import Item
from app.domains.grading.service import grade

# Stop once the standard error is at or below this, but only after MIN_ITEMS so
# a lucky early streak cannot end the test prematurely. MAX_ITEMS caps length
# even when precision never converges (e.g. a very short or noisy bank).
SE_STOP = 0.3
MIN_ITEMS = 5
MAX_ITEMS = 20

# Selected-response kinds admit guessing, so a non-zero lower asymptote (c) is
# used for the difficulty-derived fallback below.
_GUESSING_KINDS = ("mcq_single", "mcq_multi", "true_false")


def _now_naive() -> datetime:
    # Naive UTC to match the TIMESTAMP (without time zone) columns. Passing an
    # aware datetime to a naive column makes asyncpg raise on Postgres.
    return datetime.now(UTC).replace(tzinfo=None)


async def _item_params(session: AsyncSession, item: Item) -> ItemParams:
    """Resolve the IRT parameters for an item.

    Calibrated IRTParameters are preferred because they reflect real response
    data. When none exist yet the difficulty field is mapped into a b on the
    theta scale so selection still works, keeping an uncalibrated bank usable.
    """
    row = (
        await session.execute(
            select(IRTParameters).where(IRTParameters.item_id == item.id)
        )
    ).scalar_one_or_none()
    if row is not None:
        return ItemParams(a=row.a, b=row.b, c=row.c)

    b = (item.difficulty - 0.5) * 4.0
    b = min(max(b, -3.0), 3.0)
    c = 0.2 if item.kind in _GUESSING_KINDS else 0.0
    return ItemParams(a=1.0, b=b, c=c)


def _item_payload(item: Item) -> dict:
    return {
        "item_id": str(item.id),
        "kind": item.kind,
        "prompt": item.prompt,
        "options": item.options,
    }


def _selection_reason(information: float, theta: float) -> dict:
    """Explain why the CAT chose this item (Build prompt Section 9: every
    adaptive decision writes a rationale). An item is chosen because it carries
    the most Fisher information at the current ability estimate, which is where
    it most sharpens the measurement."""
    return {
        "rule": "maximum-information",
        "theta": round(theta, 4),
        "information": round(information, 4),
        "reason": (
            f"selected for maximum Fisher information ({information:.3f}) at the "
            f"current ability estimate theta {theta:.2f}"
        ),
    }


async def start_cat(session: AsyncSession, user_id: uuid.UUID) -> dict:
    """Open a CAT session and serve the first item.

    The first item is chosen at theta = 0 (the prior mean), which is the best
    guess before any evidence. An empty bank returns a done marker instead of
    raising so the caller can render a friendly message.
    """
    cat = CatSession(
        user_id=user_id,
        status="in_progress",
        theta=0.0,
        standard_error=1.0,
        item_count=0,
        administered=[],
    )
    session.add(cat)

    items = (await session.execute(select(Item))).scalars().all()
    if not items:
        return {"done": True, "message": "No items available for adaptive testing yet."}

    candidates: list[tuple[str, ItemParams]] = []
    by_id: dict[str, Item] = {}
    for item in items:
        params = await _item_params(session, item)
        candidates.append((str(item.id), params))
        by_id[str(item.id)] = item

    next_id, info = select_next(0.0, candidates)
    if next_id is None:
        return {"done": True, "message": "No items available for adaptive testing yet."}

    first = by_id[next_id]
    cat.pending_item_id = first.id
    await session.flush()

    return {
        "session_id": str(cat.id),
        "done": False,
        "theta": 0.0,
        "standard_error": 1.0,
        "item_count": 0,
        "item": _item_payload(first),
        "selection": _selection_reason(info, 0.0),
    }


async def answer_cat(
    session: AsyncSession, cat_session_id: uuid.UUID, student_answer: str
) -> dict:
    """Grade the pending item, re-estimate theta, and serve the next item or stop.

    Theta is re-estimated from the full administered history via EAP rather than
    incrementally, so it is always well defined even at all-correct or
    all-incorrect patterns.
    """
    cat = (
        await session.execute(select(CatSession).where(CatSession.id == cat_session_id))
    ).scalar_one_or_none()
    if cat is None:
        return {"error": "session not found"}
    if cat.status != "in_progress":
        return {"error": "session not active"}
    if cat.pending_item_id is None:
        return {"error": "no pending item"}

    item = (
        await session.execute(select(Item).where(Item.id == cat.pending_item_id))
    ).scalar_one_or_none()
    if item is None:
        return {"error": "pending item not found"}

    params = await _item_params(session, item)
    outcome = grade(
        item.kind,
        str(item.correct),
        student_answer,
        options=item.options,
        tolerance=item.tolerance,
    )

    entry = {
        "item_id": str(item.id),
        "a": params.a,
        "b": params.b,
        "c": params.c,
        "correct": outcome.is_correct,
    }
    # Reassign so SQLAlchemy detects the JSON change; mutating in place would not
    # mark the column dirty and the append would be lost on flush.
    cat.administered = cat.administered + [entry]
    cat.item_count += 1

    responses = [
        (ItemParams(a=e["a"], b=e["b"], c=e["c"]), e["correct"]) for e in cat.administered
    ]
    theta, se = estimate_theta(responses)
    cat.theta = theta
    cat.standard_error = se

    seen_ids = {e["item_id"] for e in cat.administered}
    stop = cat.item_count >= MAX_ITEMS or (
        cat.item_count >= MIN_ITEMS and se <= SE_STOP
    )

    if not stop:
        items = (await session.execute(select(Item))).scalars().all()
        candidates: list[tuple[str, ItemParams]] = []
        by_id: dict[str, Item] = {}
        for candidate in items:
            if str(candidate.id) in seen_ids:
                continue
            candidates.append((str(candidate.id), await _item_params(session, candidate)))
            by_id[str(candidate.id)] = candidate
        next_id, info = select_next(theta, candidates)
        if next_id is None:
            stop = True
        else:
            nxt = by_id[next_id]
            cat.pending_item_id = nxt.id
            cat.updated_at = _now_naive()
            await session.flush()
            return {
                "done": False,
                "session_id": str(cat.id),
                "theta": round(theta, 4),
                "standard_error": round(se, 4),
                "item_count": cat.item_count,
                "is_correct": outcome.is_correct,
                "item": _item_payload(nxt),
                "selection": _selection_reason(info, theta),
            }

    cat.status = "completed"
    cat.pending_item_id = None
    cat.updated_at = _now_naive()
    await session.flush()
    return {
        "done": True,
        "session_id": str(cat.id),
        "theta": round(theta, 4),
        "standard_error": round(se, 4),
        "item_count": cat.item_count,
        "is_correct": outcome.is_correct,
    }


async def get_cat(session: AsyncSession, cat_session_id: uuid.UUID) -> dict:
    """Return the current session state, including the pending item when active.

    Exposed so a client can resume a session (e.g. after a reload) without
    re-answering, recovering the outstanding question and running estimates.
    """
    cat = (
        await session.execute(select(CatSession).where(CatSession.id == cat_session_id))
    ).scalar_one_or_none()
    if cat is None:
        return {"error": "session not found"}

    result: dict = {
        "session_id": str(cat.id),
        "status": cat.status,
        "theta": round(cat.theta, 4),
        "standard_error": round(cat.standard_error, 4),
        "item_count": cat.item_count,
        "done": cat.status != "in_progress",
    }
    if cat.status == "in_progress" and cat.pending_item_id is not None:
        item = (
            await session.execute(select(Item).where(Item.id == cat.pending_item_id))
        ).scalar_one_or_none()
        if item is not None:
            result["item"] = _item_payload(item)
    return result

"""
Mock exam service (Phase 7 Session 7.4, 2026-05).

generate_mock_items()    Pick N items from the blueprint's source banks,
                         weighted to match skill_weights, within the
                         blueprint's IRT difficulty window. Returns an
                         ordered list of (item_id, position).

score_mock_attempt()     After the learner submits, fetch every answered
                         item, fit a theta via IRT, map to scaled score,
                         compute pass probability, and persist the
                         summary onto mock_attempts.
"""

from __future__ import annotations

import random
from datetime import datetime, timedelta
from typing import Any
from uuid import UUID

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.exam import (
    AttemptLog, ExamBlueprint, MockAttempt, MockAttemptItem, MockAttemptStatus,
)
from app.models.item_bank import Item, ItemBank
from app.services.irt import (
    estimate_theta_and_se, p_correct, pass_probability, scaled_score,
)


# ---------------------------------------------------------------------------
# Item picking
# ---------------------------------------------------------------------------


async def generate_mock_items(
    db: AsyncSession,
    blueprint: ExamBlueprint,
) -> list[tuple[UUID, int]]:
    """
    Returns a list of (item_id, position) tuples — `blueprint.item_count`
    items balanced across skill_weights, drawn from `blueprint.bank_slugs`,
    optionally constrained by the IRT b range.

    Algorithm:
      1. Compute per-skill quota from skill_weights (normalised + rounded
         to total = item_count).
      2. For each (skill, quota) sample `quota` items from the bank(s)
         tagged into that skill, within the b-range if calibrated.
      3. If any quota underfills (insufficient items), backfill randomly
         from the bank pool ignoring skill weights.
      4. Shuffle positions.
    """
    # Resolve bank IDs
    bank_q = await db.execute(
        select(ItemBank).where(ItemBank.slug.in_(blueprint.bank_slugs))
    )
    bank_ids = [b.id for b in bank_q.scalars().all()]
    if not bank_ids:
        return []

    weights: list[dict[str, Any]] = blueprint.skill_weights or []
    total_weight = sum(float(w.get("weight", 0)) for w in weights) or 1.0
    item_count = blueprint.item_count
    quotas: dict[str, int] = {}
    if weights:
        for w in weights:
            quotas[str(w["skill_code"])] = max(
                1, round(item_count * float(w.get("weight", 0)) / total_weight)
            )
        # Adjust to exactly item_count
        diff = item_count - sum(quotas.values())
        if diff != 0 and quotas:
            keys = list(quotas.keys())
            i = 0
            while diff != 0:
                quotas[keys[i % len(keys)]] += 1 if diff > 0 else -1
                if quotas[keys[i % len(keys)]] < 0:
                    quotas[keys[i % len(keys)]] = 0
                diff = item_count - sum(quotas.values())
                i += 1
                if i > 1000:
                    break

    # Difficulty window
    b_lo, b_hi = (-3.0, 3.0)
    if blueprint.difficulty_b_range and len(blueprint.difficulty_b_range) == 2:
        b_lo, b_hi = float(blueprint.difficulty_b_range[0]), float(blueprint.difficulty_b_range[1])

    selected: list[UUID] = []
    if quotas:
        for skill_code, n in quotas.items():
            sql = """
            SELECT i.id
            FROM items i
            JOIN content_skills cs
              ON cs.content_kind = 'question' AND cs.content_id = i.id
            JOIN skills s ON s.id = cs.skill_id
            WHERE s.code = :code
              AND i.bank_id = ANY(:banks)
              AND i.deleted_at IS NULL
              AND i.review_status IN ('approved', 'draft')
              AND (i.irt_difficulty IS NULL
                   OR (i.irt_difficulty BETWEEN :blo AND :bhi))
            ORDER BY random()
            LIMIT :n
            """
            r = await db.execute(
                text(sql),
                {"code": skill_code, "banks": [str(b) for b in bank_ids],
                 "blo": b_lo, "bhi": b_hi, "n": n},
            )
            selected.extend(row[0] for row in r.fetchall())

    # Backfill if short
    if len(selected) < item_count:
        sql = """
        SELECT i.id
        FROM items i
        WHERE i.bank_id = ANY(:banks)
          AND i.deleted_at IS NULL
          AND i.review_status IN ('approved', 'draft')
          AND i.id <> ALL(:excluded)
        ORDER BY random()
        LIMIT :n
        """
        r = await db.execute(
            text(sql),
            {
                "banks": [str(b) for b in bank_ids],
                "excluded": [str(s) for s in selected] or [str(uuid_zero())],
                "n": item_count - len(selected),
            },
        )
        selected.extend(row[0] for row in r.fetchall())

    selected = selected[:item_count]
    random.shuffle(selected)
    return [(iid, idx) for idx, iid in enumerate(selected)]


def uuid_zero():
    from uuid import UUID
    return UUID("00000000-0000-0000-0000-000000000000")


# ---------------------------------------------------------------------------
# Starting + answering + scoring
# ---------------------------------------------------------------------------


async def start_attempt(
    db: AsyncSession,
    *,
    user_id: UUID,
    blueprint: ExamBlueprint,
) -> MockAttempt:
    """Create the attempt + populate mock_attempt_items in one transaction."""
    deadline = datetime.utcnow() + timedelta(minutes=blueprint.time_limit_min)
    attempt = MockAttempt(
        user_id=user_id,
        blueprint_id=blueprint.id,
        deadline_at=deadline,
    )
    db.add(attempt)
    await db.flush()

    item_positions = await generate_mock_items(db, blueprint)
    for item_id, position in item_positions:
        db.add(MockAttemptItem(
            mock_attempt_id=attempt.id, item_id=item_id, position=position,
        ))
    await db.commit()
    await db.refresh(attempt)
    return attempt


async def submit_answer(
    db: AsyncSession,
    *,
    attempt: MockAttempt,
    item_id: UUID,
    answer_index: int | None,
    answer_value: float | None,
    time_taken_ms: int | None,
    flagged: bool = False,
) -> dict:
    """Grade a single item answer + persist to mock_attempt_items + attempt_logs."""
    item = await db.get(Item, item_id)
    if item is None:
        raise ValueError("item not found")
    correct_idx = (item.content or {}).get("correct_index")
    is_correct = (
        answer_index is not None
        and correct_idx is not None
        and int(answer_index) == int(correct_idx)
    )

    # mock_attempt_items row
    mai_r = await db.execute(
        select(MockAttemptItem).where(
            MockAttemptItem.mock_attempt_id == attempt.id,
            MockAttemptItem.item_id == item_id,
        )
    )
    mai = mai_r.scalar_one_or_none()
    if mai is None:
        raise ValueError("item not in this mock")
    mai.answer_index = answer_index
    mai.answer_value = answer_value
    mai.is_correct = is_correct
    mai.time_taken_ms = time_taken_ms
    mai.flagged = flagged
    mai.answered_at = datetime.utcnow()

    # attempt_logs row (so analytics + IRT pick it up later)
    db.add(AttemptLog(
        user_id=attempt.user_id,
        item_id=item_id,
        answer_index=answer_index,
        answer_value=answer_value,
        is_correct=is_correct,
        time_taken_ms=time_taken_ms,
        source="mock",
        mock_attempt_id=attempt.id,
    ))

    await db.commit()
    return {
        "item_id": str(item_id),
        "correct": is_correct,
        "answered_at": mai.answered_at.isoformat() + "Z",
    }


async def score_submitted(
    db: AsyncSession,
    *,
    attempt: MockAttempt,
    blueprint: ExamBlueprint,
) -> MockAttempt:
    """
    Walk every answered item, build (a, b, y) responses, run IRT theta
    estimation, map to scaled score, compute pass probability, persist
    the summary. Idempotent: re-running re-scores from current data.
    """
    rows_r = await db.execute(
        text(
            """
            SELECT i.irt_discrimination, i.irt_difficulty, mai.is_correct
            FROM mock_attempt_items mai
            JOIN items i ON i.id = mai.item_id
            WHERE mai.mock_attempt_id = :id AND mai.is_correct IS NOT NULL
            """
        ),
        {"id": str(attempt.id)},
    )
    responses: list[tuple[float, float, int]] = []
    for a, b, y in rows_r.fetchall():
        a_val = float(a) if a is not None else 1.0
        b_val = float(b) if b is not None else 0.0
        responses.append((a_val, b_val, 1 if y else 0))

    theta, se = estimate_theta_and_se(responses)
    mapping = blueprint.score_mapping or []
    scaled = scaled_score(theta, mapping)
    threshold = float(blueprint.pass_threshold_scaled) if blueprint.pass_threshold_scaled is not None else None
    p_pass = pass_probability(scaled, threshold, se)

    attempt.theta = round(theta, 3)
    attempt.theta_se = round(se, 3)
    attempt.scaled_score = round(scaled, 2) if scaled is not None else None
    attempt.predicted_pass = (p_pass >= 0.5) if p_pass is not None else None
    attempt.pass_probability = round(p_pass, 3) if p_pass is not None else None
    attempt.scoring_snapshot = {
        "mapping": mapping, "threshold": threshold,
        "n_answered": len(responses),
        "n_correct": sum(y for _, _, y in responses),
    }
    attempt.correct_count = sum(y for _, _, y in responses)
    attempt.answered_count = len(responses)
    attempt.status = MockAttemptStatus.SUBMITTED
    attempt.submitted_at = datetime.utcnow()
    await db.commit()
    await db.refresh(attempt)
    return attempt

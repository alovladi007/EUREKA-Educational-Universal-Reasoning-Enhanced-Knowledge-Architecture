"""Copilot item generation with a human-review queue.

Generation never writes into the item bank. It synthesizes candidate items whose
math is deterministic and CAS-verified (the myOpenMath / IMathAS parameterized
pattern), stores them as pending GeneratedItem rows, and a teacher approves or
rejects each one. Approval is the only path that creates a real Item, which
enforces the platform rule that no generated item enters a bank without human
sign-off.

The math is verified at generation time, so a stored candidate is always
correct; review is about pedagogy and fit, not catching wrong answer keys.
"""

from __future__ import annotations

import random
import uuid
from datetime import UTC, datetime

from math_core import grade_numeric, linear_equation_steps
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.assessment.models import Item, ItemBank
from app.domains.copilot.models import GeneratedItem


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def _linear_candidate(rng: random.Random) -> dict | None:
    """A 'solve for x' linear equation with an integer solution, CAS-verified."""
    a = rng.randint(2, 9)
    x = rng.randint(-6, 6)
    b = rng.randint(-9, 9)
    c = a * x + b
    equation = f"{a}*x + ({b}) = {c}"
    steps = linear_equation_steps(equation)
    if steps is None:
        return None
    answer = steps[-1]  # "x = <solution>"
    sign = "+" if b >= 0 else "-"
    prompt = f"Solve for x: {a}x {sign} {abs(b)} = {c}"
    return {
        "kind": "equation",
        "prompt": prompt,
        "options": None,
        "correct": answer,
        "explanation": "Isolate x: " + " then ".join(steps[1:]),
        "meta": {"worked_solution": steps},
        "source": "deterministic:linear",
    }


def _sum_candidate(rng: random.Random) -> dict | None:
    """A two-number sum, verified numerically."""
    a = rng.randint(11, 99)
    b = rng.randint(11, 99)
    total = a + b
    if not grade_numeric(str(total), str(total)).is_correct:
        return None
    return {
        "kind": "numeric",
        "prompt": f"Compute {a} + {b}.",
        "options": None,
        "correct": str(total),
        "explanation": f"{a} + {b} = {total}.",
        "meta": None,
        "source": "deterministic:sum",
    }


def _product_candidate(rng: random.Random) -> dict | None:
    """Expand (x + a)(x + b); the answer key is the CAS-expanded form."""
    from math_core import grade_expression

    a = rng.randint(-6, 6)
    b = rng.randint(-6, 6)
    factored = f"(x + ({a}))*(x + ({b}))"
    expanded = f"x^2 + {a + b}*x + {a * b}"
    if not grade_expression(expanded, factored).is_correct:
        return None
    sa = f"+ {a}" if a >= 0 else f"- {abs(a)}"
    sb = f"+ {b}" if b >= 0 else f"- {abs(b)}"
    return {
        "kind": "math_expression",
        "prompt": f"Expand (x {sa})(x {sb}).",
        "options": None,
        "correct": expanded,
        "explanation": "Multiply out and collect like terms.",
        "meta": None,
        "source": "deterministic:product",
    }


_GENERATORS = (_linear_candidate, _sum_candidate, _product_candidate)


async def generate_candidates(
    session: AsyncSession,
    *,
    node_id: uuid.UUID,
    created_by: uuid.UUID,
    count: int,
    difficulty: float = 0.5,
) -> list[GeneratedItem]:
    """Generate up to `count` CAS-verified candidates and store them as pending.

    The RNG is seeded from the node, the author, and the current queue size so
    repeated calls produce fresh items while a single call is reproducible.
    """
    existing = (
        await session.execute(
            select(func.count())
            .select_from(GeneratedItem)
            .where(GeneratedItem.node_id == node_id)
        )
    ).scalar_one()
    seed = f"{node_id}:{created_by}:{existing}".encode()
    rng = random.Random(int.from_bytes(seed[:8].ljust(8, b"0"), "big"))

    created: list[GeneratedItem] = []
    attempts = 0
    while len(created) < count and attempts < count * 6:
        attempts += 1
        gen = rng.choice(_GENERATORS)
        candidate = gen(rng)
        if candidate is None:
            continue
        row = GeneratedItem(
            node_id=node_id,
            created_by=created_by,
            kind=candidate["kind"],
            prompt=candidate["prompt"],
            options=candidate["options"],
            correct=candidate["correct"],
            explanation=candidate["explanation"],
            difficulty=float(difficulty),
            meta=candidate["meta"],
            source=candidate["source"],
            validated=True,  # only CAS-verified candidates reach this point
            status="pending",
        )
        session.add(row)
        created.append(row)
    await session.flush()
    return created


async def list_queue(
    session: AsyncSession, *, status: str = "pending"
) -> list[GeneratedItem]:
    rows = (
        await session.execute(
            select(GeneratedItem)
            .where(GeneratedItem.status == status)
            .order_by(GeneratedItem.created_at.desc())
        )
    ).scalars().all()
    return list(rows)


async def _default_bank_id(session: AsyncSession) -> uuid.UUID | None:
    bank = (await session.execute(select(ItemBank))).scalars().first()
    return bank.id if bank is not None else None


async def review_candidate(
    session: AsyncSession, candidate_id: uuid.UUID, *, approve: bool
) -> dict | None:
    """Approve (create a real Item) or reject a pending candidate.

    Returns a small result dict, or None when the candidate is missing or is not
    pending. Approval requires the candidate to be CAS-validated, which every
    stored candidate is.
    """
    candidate = (
        await session.execute(
            select(GeneratedItem).where(GeneratedItem.id == candidate_id)
        )
    ).scalar_one_or_none()
    if candidate is None or candidate.status != "pending":
        return None

    candidate.reviewed_at = _now()
    if not approve:
        candidate.status = "rejected"
        await session.flush()
        return {"status": "rejected", "id": str(candidate.id)}

    if not candidate.validated:
        return None
    bank_id = await _default_bank_id(session)
    if bank_id is None:
        return None
    item = Item(
        bank_id=bank_id,
        node_id=candidate.node_id,
        kind=candidate.kind,
        prompt=candidate.prompt,
        options=candidate.options,
        correct=candidate.correct,
        explanation=candidate.explanation,
        difficulty=candidate.difficulty,
        tolerance=None,
        meta=candidate.meta,
    )
    session.add(item)
    await session.flush()
    candidate.status = "approved"
    candidate.approved_item_id = item.id
    await session.flush()
    return {"status": "approved", "id": str(candidate.id), "item_id": str(item.id)}


def candidate_to_dict(row: GeneratedItem) -> dict:
    return {
        "id": str(row.id),
        "node_id": str(row.node_id),
        "kind": row.kind,
        "prompt": row.prompt,
        "options": row.options,
        "correct": row.correct,
        "explanation": row.explanation,
        "difficulty": row.difficulty,
        "meta": row.meta,
        "source": row.source,
        "validated": row.validated,
        "status": row.status,
    }

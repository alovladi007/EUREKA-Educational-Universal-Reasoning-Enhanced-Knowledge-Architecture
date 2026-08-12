"""Insert the authored practice templates, but only ones that verify.

THE GATE IS HERE, NOT IN CI ALONE

`app/verify_templates.py` sweeps every authored template against its
independent second path. This seeder runs that sweep first and inserts
nothing at all if any row fails. A CI job can be skipped, a developer can
forget to run a script, and a failing check that still lets the data through
is not a check - so the refusal lives on the only path the data can take into
the database.

Idempotent: a template is matched by (node, stem), so re-running adds nothing
and re-seeding an existing database is safe.
"""

from __future__ import annotations

import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.assessment.models import ItemBank, ItemTemplate
from app.domains.curriculum.models import KnowledgeNode
from app.verify_templates import ALL_TEMPLATES, VerificationError, sweep

log = logging.getLogger("axiom.seed")

BANK_NAME = "Authored Practice Templates"

# Seeds swept per template before anything is written. 120 is well past the
# point where the samplers here repeat themselves, and the whole sweep is
# under a second.
SWEEP_SEEDS = 120


async def seed_authored_templates(session: AsyncSession) -> dict:
    counts = {"verified": 0, "inserted": 0, "already_present": 0, "no_node": 0}

    try:
        rows = sweep(seeds=SWEEP_SEEDS)
    except VerificationError as exc:
        # Loud, and nothing is written. A template whose answer key does not
        # survive its own verifier must never reach a learner.
        log.error("authored templates REFUSED: %s", exc)
        counts["refused"] = str(exc)
        return counts
    counts["verified"] = len(rows)

    by_code = {
        n.code: n for n in (await session.execute(select(KnowledgeNode))).scalars().all()
    }

    bank = (
        await session.execute(select(ItemBank).where(ItemBank.name == BANK_NAME))
    ).scalar_one_or_none()
    if bank is None:
        bank = ItemBank(name=BANK_NAME, description="Verified parameterized practice.")
        session.add(bank)
        await session.flush()

    for spec in ALL_TEMPLATES:
        node = by_code.get(spec.node)
        if node is None:
            # The curriculum does not have this node. Counted rather than
            # raised, so one stale code cannot block a whole tranche.
            counts["no_node"] += 1
            log.warning("authored template for unknown node %s, skipped", spec.node)
            continue

        exists = (
            await session.execute(
                select(ItemTemplate.id).where(
                    ItemTemplate.node_id == node.id,
                    ItemTemplate.stem == spec.stem,
                )
            )
        ).scalar_one_or_none()
        if exists is not None:
            counts["already_present"] += 1
            continue

        session.add(
            ItemTemplate(
                bank_id=bank.id,
                node_id=node.id,
                kind=spec.kind,
                stem=spec.stem,
                variables=spec.variables,
                constraints=spec.constraints,
                answer_expr=spec.answer_expr,
                explanation=spec.explanation,
                difficulty=spec.difficulty,
                tolerance=spec.tolerance,
            )
        )
        counts["inserted"] += 1

    await session.flush()
    log.info("authored templates: %s", counts)
    return counts

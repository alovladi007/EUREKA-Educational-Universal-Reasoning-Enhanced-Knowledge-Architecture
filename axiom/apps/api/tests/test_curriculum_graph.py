"""Curriculum & Proof Extension, Wave A.

The full tier 0-6 ladder is seeded and its Section-2 prerequisite backbone is
enforced by the adaptive path planner. The headline check is the Section 10
acceptance criterion: the planner refuses to route a learner into a Tier 5
proof course (real analysis) until the Tier 4 proof-transition techniques it
needs show mastery.
"""

from __future__ import annotations

from sqlalchemy import func, select

from app.domains.adaptive.bkt import level_for
from app.domains.adaptive.models import MasteryState
from app.domains.adaptive.service import PREREQ_BAR, plan_path
from app.domains.curriculum.graph import CURRICULUM_NODES, seed_curriculum_graph
from app.domains.curriculum.models import KnowledgeNode
from app.domains.identity.models import User


async def _node(db_session, code: str) -> KnowledgeNode:
    return (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == code))
    ).scalar_one()


async def _master(db_session, user_id, code: str, p: float = 0.85) -> None:
    node = await _node(db_session, code)
    db_session.add(
        MasteryState(
            user_id=user_id, node_id=node.id, signal="apply", p_known=p, level=level_for(p)
        )
    )
    await db_session.flush()


async def test_ladder_nodes_and_taxonomy_seeded(db_session):
    # Every ladder node is present (seeded via conftest's seed()).
    codes = {
        c
        for c in (await db_session.execute(select(KnowledgeNode.code))).scalars().all()
    }
    for code, *_ in CURRICULUM_NODES:
        assert code in codes, f"missing ladder node {code}"

    real = await _node(db_session, "REALAN")
    assert real.tier == 5 and real.kind == "concept" and real.track == "pure"
    induction = await _node(db_session, "PT.INDUCTION")
    assert induction.kind == "proof_technique" and induction.tier == 4
    linalg = await _node(db_session, "LINALG")
    assert linalg.track == "applied"


async def test_seed_is_idempotent(db_session):
    before = (
        await db_session.execute(select(func.count()).select_from(KnowledgeNode))
    ).scalar_one()
    added = await seed_curriculum_graph(db_session)
    after = (
        await db_session.execute(select(func.count()).select_from(KnowledgeNode))
    ).scalar_one()
    assert added == 0
    assert before == after


async def test_tier5_locked_until_proof_techniques_mastered(db_session):
    """Real analysis stays locked while a required Tier 4 technique is unmastered,
    and unlocks the moment that technique crosses the mastery bar."""
    user = User(eureka_user_id="ex-a-gate", email="gate@x.com", display_name="Gate")
    db_session.add(user)
    await db_session.flush()

    def status_of(plan: dict, code: str) -> str:
        return next(row["status"] for row in plan["plan"] if row["code"] == code)

    # Master real analysis's course prerequisite and two of its three required
    # techniques, but NOT epsilon-delta.
    for code in ("INTROPROOF", "PT.INDUCTION", "PT.CONTRADICTION"):
        await _master(db_session, user.id, code)

    plan = await plan_path(db_session, user.id)
    assert status_of(plan, "REALAN") == "locked"

    # Now master the missing technique above the prerequisite bar.
    await _master(db_session, user.id, "PT.EPSILONDELTA", p=PREREQ_BAR + 0.1)

    plan = await plan_path(db_session, user.id)
    assert status_of(plan, "REALAN") == "available"

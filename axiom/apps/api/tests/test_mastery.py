"""Acceptance (Phase 1): mastery on a node changes in the expected direction
after correct and incorrect responses, with the evidence recorded."""

from __future__ import annotations

from sqlalchemy import select

from app.domains.adaptive.service import apply_mastery, list_evidence, list_mastery
from app.domains.curriculum.models import KnowledgeNode
from app.domains.identity.models import User


async def _node(db_session, code: str) -> KnowledgeNode:
    return (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == code))
    ).scalar_one()


async def test_mastery_direction_and_evidence(db_session):
    user = User(eureka_user_id="stud-mastery", email="m@x.com", display_name="Mastery Student")
    db_session.add(user)
    await db_session.flush()
    node = await _node(db_session, "ALG.1")

    first = await apply_mastery(db_session, user.id, node.id, correct=True, response_id=None)
    assert first["p_known_after"] > first["p_known_before"]

    second = await apply_mastery(db_session, user.id, node.id, correct=True, response_id=None)
    assert second["p_known_after"] > second["p_known_before"]

    wrong = await apply_mastery(db_session, user.id, node.id, correct=False, response_id=None)
    assert wrong["p_known_after"] < wrong["p_known_before"]

    # Evidence is append only: one row per response.
    evidence = await list_evidence(db_session, user.id, node.id)
    assert len(evidence) == 3
    assert [e["correct"] for e in evidence] == [True, True, False]

    states = await list_mastery(db_session, user.id)
    assert any(s["node_id"] == str(node.id) for s in states)

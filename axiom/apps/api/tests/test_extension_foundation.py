"""Curriculum and Proof Extension, EX-0 foundation.

Locks in the schema-level machinery the later proof waves build on:
  - grader-trust weighting: a low-confidence grader moves mastery less than a
    fully trusted grader for the same correct response (Extension Section 8);
  - prove vs apply signals: the two competences are tracked as independent
    MasteryState rows and never collide;
  - node taxonomy defaults (computational_skill) and the definition / theorem
    reference library round-trip, JSON technique lists included.
"""

from __future__ import annotations

from sqlalchemy import select

from app.domains.adaptive.models import MASTERY_SIGNALS, MasteryState
from app.domains.adaptive.service import apply_mastery, list_evidence, list_mastery
from app.domains.curriculum.models import (
    NODE_KINDS,
    Definition,
    KnowledgeNode,
    Theorem,
)
from app.domains.identity.models import User


async def _fresh_node(db_session, code: str, **kw) -> KnowledgeNode:
    node = KnowledgeNode(code=code, title=code, description="", **kw)
    db_session.add(node)
    await db_session.flush()
    return node


async def test_node_kind_defaults_to_computational_skill(db_session):
    node = await _fresh_node(db_session, "EX0.default")
    assert node.kind == "computational_skill"
    assert "proof_technique" in NODE_KINDS
    assert "theorem_with_proof" in NODE_KINDS


async def test_grader_trust_weights_the_mastery_move(db_session):
    """A fully trusted grader moves mastery strictly more than a half-trusted
    one for the same correct response from the same starting point."""
    user = User(eureka_user_id="ex0-trust", email="trust@x.com", display_name="Trust")
    db_session.add(user)
    await db_session.flush()
    trusted_node = await _fresh_node(db_session, "EX0.trusted")
    weak_node = await _fresh_node(db_session, "EX0.weak")

    trusted = await apply_mastery(
        db_session, user.id, trusted_node.id, correct=True, response_id=None,
        grader="formal", grader_confidence=1.0,
    )
    weak = await apply_mastery(
        db_session, user.id, weak_node.id, correct=True, response_id=None,
        grader="ai", grader_confidence=0.5,
    )

    # Same start (both fresh at p_l0), same correct outcome: full trust gains
    # more than half trust, and half trust still moves upward.
    assert trusted["p_known_before"] == weak["p_known_before"]
    trusted_gain = trusted["p_known_after"] - trusted["p_known_before"]
    weak_gain = weak["p_known_after"] - weak["p_known_before"]
    assert trusted_gain > weak_gain > 0

    # The grader and its confidence are recorded on the evidence.
    evidence = await list_evidence(db_session, user.id, weak_node.id)
    assert evidence[0]["grader"] == "ai"
    assert evidence[0]["grader_confidence"] == 0.5


async def test_prove_and_apply_signals_are_independent(db_session):
    """A node's apply and prove competences are separate rows and separate
    trajectories: proving it well does not lift the apply estimate."""
    user = User(eureka_user_id="ex0-signal", email="sig@x.com", display_name="Signal")
    db_session.add(user)
    await db_session.flush()
    node = await _fresh_node(db_session, "EX0.thm", kind="theorem_with_proof")

    # Two prove-correct responses, no apply evidence.
    await apply_mastery(
        db_session, user.id, node.id, correct=True, response_id=None, signal="prove"
    )
    prove = await apply_mastery(
        db_session, user.id, node.id, correct=True, response_id=None, signal="prove"
    )

    states = (
        (
            await db_session.execute(
                select(MasteryState).where(
                    MasteryState.user_id == user.id, MasteryState.node_id == node.id
                )
            )
        )
        .scalars()
        .all()
    )
    # A prove row exists and has advanced; no apply row was created.
    by_signal = {s.signal: s for s in states}
    assert set(by_signal) == {"prove"}
    assert round(by_signal["prove"].p_known, 4) == prove["p_known_after"]
    assert set(MASTERY_SIGNALS) == {"apply", "prove"}

    # The default apply view does not surface the prove-only node.
    apply_view = await list_mastery(db_session, user.id, signal="apply")
    assert all(s["node_id"] != str(node.id) for s in apply_view)
    prove_view = await list_mastery(db_session, user.id, signal="prove")
    assert any(s["node_id"] == str(node.id) and s["signal"] == "prove" for s in prove_view)


async def test_definition_and_theorem_library_round_trip(db_session):
    node = await _fresh_node(db_session, "EX0.reflib", kind="concept")
    db_session.add(
        Definition(
            course_code="real-analysis",
            node_id=node.id,
            term="Cauchy sequence",
            statement="A sequence whose terms grow arbitrarily close for large indices.",
            notation="for all eps>0 there is N ...",
        )
    )
    db_session.add(
        Theorem(
            course_code="real-analysis",
            node_id=node.id,
            name="Monotone Convergence Theorem",
            statement="A bounded monotone sequence of reals converges.",
            proof_sketch="Use the least upper bound property.",
            techniques=["epsilon_delta", "completeness"],
            depends_on=["Completeness of the reals"],
        )
    )
    await db_session.flush()

    d = (
        await db_session.execute(select(Definition).where(Definition.term == "Cauchy sequence"))
    ).scalar_one()
    assert d.course_code == "real-analysis"
    t = (
        await db_session.execute(
            select(Theorem).where(Theorem.name == "Monotone Convergence Theorem")
        )
    ).scalar_one()
    assert t.techniques == ["epsilon_delta", "completeness"]
    assert t.depends_on == ["Completeness of the reals"]

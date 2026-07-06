"""Curriculum & Proof Extension, Wave D.

Covers the three Wave D behaviors:
  - free-form proof grading is an AI first pass with line-level gap feedback,
    never a final verdict (Section 4.3);
  - proof-technique mastery transfers across courses (Section 8, Section 10);
  - the copilot proof tutor gives a graduated, non-answer hint and points at the
    first gap in the draft (Section 7).
"""

from __future__ import annotations

from sqlalchemy import select

from app.domains.adaptive.bkt import DEFAULT_PARAMS
from app.domains.adaptive.models import MasteryState
from app.domains.assessment.models import Item, ItemBank
from app.domains.attempts.models import Attempt, Response
from app.domains.copilot import service as copilot
from app.domains.curriculum.models import KnowledgeNode
from app.domains.grading.free_response import grade_free_form_proof
from app.domains.identity.models import User


async def _node(db_session, code: str) -> KnowledgeNode:
    return (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == code))
    ).scalar_one()


async def _bank(db_session) -> ItemBank:
    return (await db_session.execute(select(ItemBank))).scalars().first()


async def test_free_form_proof_is_ai_first_pass_with_gaps():
    rubric = [
        {"criterion": "base case", "points": 1, "keywords": ["base case", "n = 1"]},
        {"criterion": "inductive step", "points": 1, "keywords": ["inductive", "assume"]},
    ]
    proof = "Base case: for n = 1 the sum is 1, which matches the formula."
    outcome = await grade_free_form_proof("a full induction proof", proof, rubric)

    # AI-assisted, never a verdict: it is labeled ai and remains overridable.
    assert outcome.grader == "ai"
    # It covered the base case but not the inductive step, so the missing
    # milestone is surfaced as a suspected gap.
    assert 0.0 < outcome.score < 1.0
    assert "suspected gaps" in outcome.detail
    assert "inductive step" in outcome.detail


async def test_proof_technique_mastery_transfers_across_courses(db_session):
    """Grading a proof on one course's node that declares it uses a technique
    raises that technique node's mastery -- transfer across courses."""
    from app.domains.practice.service import finalize_response_grade

    user = User(eureka_user_id="ex-d-xfer", email="x@x.com", display_name="Xfer")
    db_session.add(user)
    await db_session.flush()

    alg = await _node(db_session, "ALG.1")  # a different course than induction
    tech = await _node(db_session, "PT.INDUCTION")
    bank = await _bank(db_session)

    item = Item(
        bank_id=bank.id,
        node_id=alg.id,
        kind="short_text",
        prompt="A short item that exercises induction.",
        options=None,
        correct="4|four",
        explanation="",
        meta={"techniques": ["PT.INDUCTION"]},
    )
    db_session.add(item)
    await db_session.flush()
    attempt = Attempt(user_id=user.id, kind="practice")
    db_session.add(attempt)
    await db_session.flush()
    response = Response(
        attempt_id=attempt.id, user_id=user.id, node_id=alg.id, item_id=item.id, answer={}
    )
    db_session.add(response)
    await db_session.flush()

    result = await finalize_response_grade(db_session, user.id, response, "4")

    # The response was correct and the technique transfer is reported.
    assert result["is_correct"] is True
    transferred = {t["code"] for t in result["technique_transfer"]}
    assert "PT.INDUCTION" in transferred

    # The technique node now has an apply-signal mastery above the prior default,
    # even though the graded item lived on a different node (ALG.1).
    state = (
        await db_session.execute(
            select(MasteryState).where(
                MasteryState.user_id == user.id,
                MasteryState.node_id == tech.id,
                MasteryState.signal == "apply",
            )
        )
    ).scalar_one()
    assert state.p_known > DEFAULT_PARAMS.p_l0


async def test_proof_tutor_graduated_hint_and_gap(db_session):
    user = User(eureka_user_id="ex-d-tutor", email="t@x.com", display_name="Tutor")
    db_session.add(user)
    await db_session.flush()

    node = await _node(db_session, "INTROPROOF")
    bank = await _bank(db_session)
    item = Item(
        bank_id=bank.id,
        node_id=node.id,
        kind="free_form_proof",
        prompt="Prove the claim.",
        options=None,
        correct="reference",
        explanation="",
        meta={"milestones": ["base case", "inductive step", "conclusion"]},
    )
    db_session.add(item)
    await db_session.flush()
    attempt = Attempt(user_id=user.id, kind="practice")
    db_session.add(attempt)
    await db_session.flush()
    response = Response(
        attempt_id=attempt.id, user_id=user.id, node_id=node.id, item_id=item.id, answer={}
    )
    db_session.add(response)
    await db_session.flush()

    # The draft establishes the base case only; the first gap is the next
    # milestone, and the hint is present but is not the final answer.
    result = await copilot.proof_tutor(
        db_session,
        user.id,
        response_token=str(response.id),
        draft="We start with the base case, which clearly holds.",
        level=0,
    )
    assert result["ai_generated"] is True
    assert result["level"] == 0
    assert result["established"] == 1
    assert result["gap"] == "inductive step"
    assert result["hint"]

    # A higher level still returns guidance (graduated), never the answer key.
    deeper = await copilot.proof_tutor(
        db_session, user.id, response_token=str(response.id), draft="", level=2
    )
    assert deeper["level"] == 2
    assert deeper["gap"] == "base case"
    assert deeper["hint"]

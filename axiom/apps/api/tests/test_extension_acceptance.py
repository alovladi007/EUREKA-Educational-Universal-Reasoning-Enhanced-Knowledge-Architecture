"""Curriculum & Proof Extension, Section 10 acceptance criteria.

One consolidated test per criterion, so the whole extension has a single
acceptance gate. The individual graders and flows are covered in depth in their
own test files; this file asserts the end-to-end contracts the extension names.
"""

from __future__ import annotations

import json

from sqlalchemy import select

from app.domains.adaptive.bkt import DEFAULT_PARAMS, level_for
from app.domains.adaptive.models import MasteryState
from app.domains.adaptive.service import PREREQ_BAR, plan_path
from app.domains.assessment.models import Item, ItemBank
from app.domains.attempts.models import Attempt, Response, StepCredit
from app.domains.curriculum.models import KnowledgeNode
from app.domains.grading import formal as formal_mod
from app.domains.grading.formal import FormalVerdict, grade_formal_proof
from app.domains.grading.free_response import grade_free_form_proof
from app.domains.grading.mixed import grade_mixed
from app.domains.grading.moderation import REVIEW_KINDS
from app.domains.grading.service import grade
from app.domains.identity.models import User


class _StubKernel:
    async def verify(self, proof: str, *, prelude: str = "") -> FormalVerdict:
        ok = "theorem" in proof and "sorry" not in proof
        return FormalVerdict(ok, True, "stub-kernel", "accepted" if ok else "rejected")


async def _node(db_session, code: str) -> KnowledgeNode:
    return (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == code))
    ).scalar_one()


async def _bank(db_session) -> ItemBank:
    return (await db_session.execute(select(ItemBank))).scalars().first()


# Criterion 1: a formal-track item is accepted only when the kernel verifies it,
# and a deliberately broken proof is rejected.
async def test_c1_formal_accept_only_when_verified(monkeypatch):
    monkeypatch.setattr(formal_mod, "get_formal_verifier", lambda: _StubKernel())
    assert (await grade_formal_proof("theorem t : True := by trivial")).is_correct is True
    assert (await grade_formal_proof("theorem t : True := by sorry")).is_correct is False


# Criterion 2: a proof-assembly item grades a correct ordering as full credit and
# a wrong ordering as partial or zero, deterministically.
async def test_c2_proof_assembly_deterministic():
    key = json.dumps(["a", "b", "c"])
    assert grade("proof_assembly", key, key).score == 1.0
    wrong = grade("proof_assembly", key, json.dumps(["c", "b", "a"]))
    assert wrong.is_correct is False and wrong.score < 1.0


# Criterion 3: a free-form proof runs the AI first pass, produces line-level gap
# feedback, and belongs to the human-review queue (never auto-finalized).
async def test_c3_free_form_proof_ai_first_pass_and_review():
    rubric = [
        {"criterion": "base", "points": 1, "keywords": ["base case"]},
        {"criterion": "step", "points": 1, "keywords": ["inductive"]},
    ]
    outcome = await grade_free_form_proof("ref", "Only the base case here.", rubric)
    assert outcome.grader == "ai"
    assert "suspected gaps" in outcome.detail
    assert "free_form_proof" in REVIEW_KINDS


# Criterion 4: a proof technique's mastery increases after a graded proof that
# uses it, in a different course than where it was first learned.
async def test_c4_technique_transfer_across_courses(db_session):
    from app.domains.practice.service import finalize_response_grade

    user = User(eureka_user_id="c4", email="c4@x.com", display_name="C4")
    db_session.add(user)
    await db_session.flush()
    alg = await _node(db_session, "ALG.1")
    tech = await _node(db_session, "PT.CONTRADICTION")
    bank = await _bank(db_session)
    item = Item(
        bank_id=bank.id, node_id=alg.id, kind="short_text", prompt="p",
        options=None, correct="4", explanation="", meta={"techniques": ["PT.CONTRADICTION"]},
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

    await finalize_response_grade(db_session, user.id, response, "4")
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


# Criterion 5: the path planner refuses to route a learner into a Tier 5 proof
# course until the Tier 4 proof-transition techniques meet the mastery threshold.
async def test_c5_tier5_gated_by_tier4_techniques(db_session):
    user = User(eureka_user_id="c5", email="c5@x.com", display_name="C5")
    db_session.add(user)
    await db_session.flush()

    async def master(code: str, p: float) -> None:
        node = await _node(db_session, code)
        db_session.add(
            MasteryState(
                user_id=user.id, node_id=node.id, signal="apply", p_known=p,
                level=level_for(p),
            )
        )
        await db_session.flush()

    for code in ("INTROPROOF", "PT.INDUCTION", "PT.CONTRADICTION"):
        await master(code, PREREQ_BAR + 0.1)
    plan = await plan_path(db_session, user.id)
    status = {row["code"]: row["status"] for row in plan["plan"]}
    assert status["REALAN"] == "locked"  # epsilon-delta still unmastered

    await master("PT.EPSILONDELTA", PREREQ_BAR + 0.1)
    plan = await plan_path(db_session, user.id)
    status = {row["code"]: row["status"] for row in plan["plan"]}
    assert status["REALAN"] == "available"


# Criterion 6: a mixed compute-then-prove item splits grading -- the computed
# part to CAS, the proof part to the proof grader -- with both recorded.
async def test_c6_mixed_splits_and_records(db_session):
    from app.domains.practice.service import finalize_response_grade

    meta = {
        "parts": [
            {"label": "A", "kind": "math_expression", "correct": "2*x"},
            {
                "label": "B",
                "kind": "free_form_proof",
                "correct": "ref",
                "rubric": [{"criterion": "c", "points": 1, "keywords": ["increasing"]}],
            },
        ]
    }
    # Unit: the split is visible in the per-part grader tags.
    answer = json.dumps(["2*x", "the function is increasing"])
    outcome = await grade_mixed(meta, answer)
    assert outcome.grader == "mixed" and len(outcome.step_credits) == 2
    assert "[cas]" in outcome.step_credits[0]["note"]
    assert "[ai]" in outcome.step_credits[1]["note"]

    # Integration: both part results are recorded on the attempt as StepCredits.
    user = User(eureka_user_id="c6", email="c6@x.com", display_name="C6")
    db_session.add(user)
    await db_session.flush()
    node = await _node(db_session, "CALC1")
    bank = await _bank(db_session)
    item = Item(
        bank_id=bank.id, node_id=node.id, kind="mixed", prompt="compute then prove",
        options=None, correct="", explanation="", meta=meta,
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
    await finalize_response_grade(db_session, user.id, response, answer)

    credits = (
        await db_session.execute(
            select(StepCredit).where(StepCredit.response_id == response.id)
        )
    ).scalars().all()
    assert len(credits) == 2
    notes = " ".join(c.note for c in credits)
    assert "[cas]" in notes and "[ai]" in notes

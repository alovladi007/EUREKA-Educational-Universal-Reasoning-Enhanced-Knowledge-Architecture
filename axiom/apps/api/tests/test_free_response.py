"""Free-response AI grading: rubric scoring, grade outcome, and human override."""

from __future__ import annotations

from sqlalchemy import select

from app.domains.assessment.models import Item, ItemBank
from app.domains.attempts.models import Attempt, GradeOverride, Response, Score
from app.domains.copilot.reasoning import (
    MockReasoningProvider,
    RubricCriterion,
    RubricScoreRequest,
)
from app.domains.curriculum.models import KnowledgeNode
from app.domains.grading.free_response import grade_free_response
from app.domains.grading.moderation import list_free_response_grades, override_grade
from app.domains.identity.models import User
from tests.conftest import AUTH


async def test_rubric_scoring_partial_credit_and_flags_unassessable():
    provider = MockReasoningProvider()
    request = RubricScoreRequest(
        response_text="Subtract 4 from both sides, so x equals 5.",
        criteria=[
            RubricCriterion("inverse operation", 1, ["subtract", "inverse"]),
            RubricCriterion("both sides", 1, ["both sides"]),
            RubricCriterion("solution", 1, ["x = 5", "equals 5", "five"]),
            RubricCriterion("unassessable", 1, []),
        ],
    )
    result = await provider.score_rubric(request)
    assert result.total_possible == 4.0
    assert 0.0 < result.total_awarded < 4.0
    # Three of four criteria carry keywords, so confidence is 0.75.
    assert result.confidence == 0.75
    assert any("teacher review" in c.rationale for c in result.criteria)


async def test_grade_free_response_is_ai_graded_with_breakdown():
    rubric = [
        {"criterion": "c1", "points": 1, "keywords": ["subtract"]},
        {"criterion": "c2", "points": 1, "keywords": ["both sides"]},
    ]
    outcome = await grade_free_response("ref", "Subtract 4 from both sides.", rubric)
    assert outcome.grader == "ai"
    assert outcome.is_correct is True
    assert outcome.score == 1.0
    assert [c["milestone"] for c in outcome.step_credits] == ["c1", "c2"]


async def test_override_supersedes_ai_grade(db_session):
    bank = (await db_session.execute(select(ItemBank))).scalars().first()
    node = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "ALG.4"))
    ).scalar_one()
    teacher = User(eureka_user_id="t9", email="t9@x.com", display_name="T Nine")
    student = User(eureka_user_id="s9", email="s9@x.com", display_name="S Nine")
    db_session.add_all([teacher, student])
    await db_session.flush()

    item = Item(
        bank_id=bank.id,
        node_id=node.id,
        kind="free_response",
        prompt="Explain how to solve it.",
        correct="ref",
        explanation="",
        difficulty=0.5,
        meta={"rubric": []},
    )
    db_session.add(item)
    await db_session.flush()
    attempt = Attempt(user_id=student.id, kind="practice", status="in_progress")
    db_session.add(attempt)
    await db_session.flush()
    resp = Response(
        attempt_id=attempt.id,
        user_id=student.id,
        node_id=node.id,
        item_id=item.id,
        answer={"raw": "my answer"},
    )
    db_session.add(resp)
    await db_session.flush()
    db_session.add(Score(response_id=resp.id, is_correct=False, score=0.2))
    await db_session.flush()

    result = await override_grade(
        db_session, resp.id, score=1.0, is_correct=True, note="looks correct", teacher_id=teacher.id
    )
    assert result["score"] == 1.0
    assert result["overrode_ai_score"] == 0.2

    updated = (
        await db_session.execute(select(Score).where(Score.response_id == resp.id))
    ).scalar_one()
    assert updated.score == 1.0 and updated.is_correct is True

    override = (
        await db_session.execute(
            select(GradeOverride).where(GradeOverride.response_id == resp.id)
        )
    ).scalar_one()
    assert override.overridden_by == teacher.id

    listing = await list_free_response_grades(db_session)
    assert any(row["response_id"] == str(resp.id) and row["overridden"] for row in listing)


async def test_review_and_override_require_teacher(client):
    review = await client.get("/api/v1/grading/free-response/review", headers=AUTH)
    assert review.status_code == 403
    override = await client.post(
        "/api/v1/grading/00000000-0000-0000-0000-000000000000/override",
        json={"score": 1.0, "is_correct": True},
        headers=AUTH,
    )
    assert override.status_code == 403

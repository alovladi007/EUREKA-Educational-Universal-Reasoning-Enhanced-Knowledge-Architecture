"""Async grading: the worker core, idempotency, and the result-polling status."""

from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import select

from app.domains.assessment.models import Item, ItemBank
from app.domains.attempts.models import Attempt, GradingRecord, Response, Score
from app.domains.curriculum.models import KnowledgeNode
from app.domains.identity.models import User
from app.domains.practice.service import grade_pending_response, response_result
from tests.conftest import AUTH


def _naive_now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


async def _free_response_setup(db_session):
    """A user plus a queued (submitted, ungraded) free-response response."""
    bank = (await db_session.execute(select(ItemBank))).scalars().first()
    node = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "ALG.4"))
    ).scalar_one()
    user = User(eureka_user_id="ag1", email="ag1@x.com", display_name="Ag One")
    db_session.add(user)
    await db_session.flush()

    item = Item(
        bank_id=bank.id,
        node_id=node.id,
        kind="free_response",
        prompt="Explain how to solve it.",
        correct="Subtract 4 from both sides.",
        explanation="",
        difficulty=0.5,
        meta={"rubric": [{"criterion": "inverse", "points": 1, "keywords": ["subtract"]}]},
    )
    db_session.add(item)
    await db_session.flush()
    attempt = Attempt(user_id=user.id, kind="practice", status="in_progress")
    db_session.add(attempt)
    await db_session.flush()
    response = Response(
        attempt_id=attempt.id,
        user_id=user.id,
        node_id=node.id,
        item_id=item.id,
        answer={"raw": "Subtract 4 from both sides."},
        submitted_at=_naive_now(),
    )
    db_session.add(response)
    await db_session.flush()
    return user, response


async def test_grade_pending_response_grades_and_is_idempotent(db_session):
    _user, response = await _free_response_setup(db_session)

    assert await grade_pending_response(db_session, response.id) is True
    score = (
        await db_session.execute(select(Score).where(Score.response_id == response.id))
    ).scalar_one()
    assert score is not None
    grading = (
        await db_session.execute(
            select(GradingRecord).where(GradingRecord.response_id == response.id)
        )
    ).scalar_one()
    assert grading.grader == "ai"

    # A re-delivered task must not double-grade.
    assert await grade_pending_response(db_session, response.id) is False


async def test_response_result_status_transitions(db_session):
    user, response = await _free_response_setup(db_session)

    # It is submitted but not yet scored, so it reads as grading.
    pending = await response_result(db_session, user.id, str(response.id))
    assert pending["status"] == "grading"

    await grade_pending_response(db_session, response.id)
    done = await response_result(db_session, user.id, str(response.id))
    assert done["status"] == "graded"
    assert done["ai_graded"] is True
    assert done["grader"] == "ai"


async def test_response_result_unanswered(db_session):
    node = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "ALG.1"))
    ).scalar_one()
    user = User(eureka_user_id="ag2", email="ag2@x.com", display_name="Ag Two")
    db_session.add(user)
    await db_session.flush()
    item = (await db_session.execute(select(Item).where(Item.node_id == node.id))).scalars().first()
    attempt = Attempt(user_id=user.id, kind="practice", status="in_progress")
    db_session.add(attempt)
    await db_session.flush()
    response = Response(
        attempt_id=attempt.id, user_id=user.id, node_id=node.id, item_id=item.id, answer={}
    )
    db_session.add(response)
    await db_session.flush()

    result = await response_result(db_session, user.id, str(response.id))
    assert result["status"] == "unanswered"


async def test_practice_response_endpoint_reports_graded(client):
    # With async grading off in tests, answering grades inline; the poll endpoint
    # then reports the graded result.
    served = (await client.post("/api/v1/practice/next", json={}, headers=AUTH)).json()
    await client.post(
        "/api/v1/practice/answer",
        json={"response_token": served["response_token"], "answer": "5"},
        headers=AUTH,
    )
    result = await client.get(
        f"/api/v1/practice/response/{served['response_token']}", headers=AUTH
    )
    assert result.status_code == 200
    assert result.json()["status"] == "graded"

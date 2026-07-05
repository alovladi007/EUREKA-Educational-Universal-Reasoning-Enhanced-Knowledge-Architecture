"""Teacher flow: RBAC gate plus author, assign, deliver, and results."""

from __future__ import annotations

from sqlalchemy import select

from app.domains.assessment.service import (
    assign,
    create_assessment,
    results,
    start_attempt,
)
from app.domains.curriculum.models import KnowledgeNode
from app.domains.identity.models import User
from app.domains.practice.service import answer
from tests.conftest import AUTH


async def test_student_cannot_create_assessment(client):
    # The mock identity is a student, so the teacher-gated route is forbidden.
    resp = await client.post(
        "/api/v1/assessments",
        json={"title": "Quiz", "node_ids": ["ALG.1"], "item_count": 2},
        headers=AUTH,
    )
    assert resp.status_code == 403


async def test_teacher_authors_assigns_and_reads_results(db_session):
    teacher = User(eureka_user_id="teach-1", email="t@x.com", display_name="Teacher One")
    student = User(eureka_user_id="learn-1", email="l@x.com", display_name="Learner One")
    db_session.add_all([teacher, student])
    await db_session.flush()

    node = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "ALG.1"))
    ).scalar_one()

    assessment = await create_assessment(
        db_session, teacher.id, "Algebra Quiz 1", [node.id], item_count=3
    )
    await db_session.commit()

    added = await assign(db_session, assessment.id, [student.id])
    await db_session.commit()
    assert added == 1

    served = await start_attempt(db_session, assessment.id, student.id)
    await db_session.commit()
    assert served["count"] >= 1

    for item in served["items"]:
        await answer(db_session, student.id, item["response_token"], "999")

    report = await results(db_session, assessment.id)
    assert report["title"] == "Algebra Quiz 1"
    assert len(report["results"]) == 1
    assert report["results"][0]["answered"] == served["count"]
    assert report["results"][0]["display_name"] == "Learner One"

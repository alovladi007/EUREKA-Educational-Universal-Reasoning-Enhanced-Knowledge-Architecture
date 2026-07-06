"""Assessment availability windows: server-side enforcement of open/close."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from sqlalchemy import select

from app.domains.assessment.service import assign, create_assessment, start_attempt
from app.domains.curriculum.models import KnowledgeNode
from app.domains.identity.models import User


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


async def _setup(db_session, suffix: str):
    teacher = User(eureka_user_id=f"wt{suffix}", email=f"wt{suffix}@x.com", display_name="W T")
    student = User(eureka_user_id=f"ws{suffix}", email=f"ws{suffix}@x.com", display_name="W S")
    db_session.add_all([teacher, student])
    await db_session.flush()
    node = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "ALG.1"))
    ).scalar_one()
    return teacher, student, node


async def test_start_blocked_before_open(db_session):
    teacher, student, node = await _setup(db_session, "1")
    assessment = await create_assessment(
        db_session, teacher.id, "Future Quiz", [node.id], 2, open_at=_now() + timedelta(hours=1)
    )
    await assign(db_session, assessment.id, [student.id])
    result = await start_attempt(db_session, assessment.id, student.id)
    assert result.get("reason") == "not_open"


async def test_start_blocked_after_close(db_session):
    teacher, student, node = await _setup(db_session, "2")
    assessment = await create_assessment(
        db_session, teacher.id, "Past Quiz", [node.id], 2, close_at=_now() - timedelta(hours=1)
    )
    await assign(db_session, assessment.id, [student.id])
    result = await start_attempt(db_session, assessment.id, student.id)
    assert result.get("reason") == "closed"


async def test_start_allowed_within_window(db_session):
    teacher, student, node = await _setup(db_session, "3")
    assessment = await create_assessment(
        db_session,
        teacher.id,
        "Open Quiz",
        [node.id],
        2,
        open_at=_now() - timedelta(hours=1),
        close_at=_now() + timedelta(hours=1),
    )
    await assign(db_session, assessment.id, [student.id])
    result = await start_attempt(db_session, assessment.id, student.id)
    assert "error" not in result
    assert result["count"] >= 1


async def test_start_reports_open_time_when_blocked(db_session):
    teacher, student, node = await _setup(db_session, "4")
    open_at = _now() + timedelta(hours=3)
    assessment = await create_assessment(
        db_session, teacher.id, "Scheduled Quiz", [node.id], 2, open_at=open_at
    )
    await assign(db_session, assessment.id, [student.id])
    result = await start_attempt(db_session, assessment.id, student.id)
    # The block carries when the assessment opens, so the client can say so.
    assert result["reason"] == "not_open"
    assert result["open_at"] == open_at.isoformat()

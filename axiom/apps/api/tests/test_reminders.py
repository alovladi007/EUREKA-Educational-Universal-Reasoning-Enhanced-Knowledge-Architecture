"""Assignment due-date reminders: the beat-driven scan."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from sqlalchemy import select

from app.domains.assessment.models import AssignmentTarget
from app.domains.assessment.service import assign, create_assessment
from app.domains.curriculum.models import KnowledgeNode
from app.domains.identity.models import User
from app.domains.notifications.reminders import send_due_reminders
from app.domains.notifications.service import list_notifications


def _naive_now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


async def _teacher_student_node(db_session, suffix: str):
    teacher = User(eureka_user_id=f"rt{suffix}", email=f"rt{suffix}@x.com", display_name="R T")
    student = User(eureka_user_id=f"rs{suffix}", email=f"rs{suffix}@x.com", display_name="R S")
    db_session.add_all([teacher, student])
    await db_session.flush()
    node = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "ALG.1"))
    ).scalar_one()
    return teacher, student, node


async def test_due_soon_reminder_sent_once(db_session):
    teacher, student, node = await _teacher_student_node(db_session, "1")
    assessment = await create_assessment(
        db_session, teacher.id, "Due Quiz", [node.id], item_count=2
    )
    due = _naive_now() + timedelta(hours=2)
    await assign(db_session, assessment.id, [student.id], due_at=due)

    assert await send_due_reminders(db_session) == 1

    notes = await list_notifications(db_session, student.id)
    assert any(n["kind"] == "reminder" and "Due Quiz" in n["body"] for n in notes)

    target = (
        await db_session.execute(
            select(AssignmentTarget).where(AssignmentTarget.assessment_id == assessment.id)
        )
    ).scalar_one()
    assert target.reminded_at is not None

    # Idempotent: a second run reminds nobody.
    assert await send_due_reminders(db_session) == 0


async def test_far_future_assignment_not_reminded(db_session):
    teacher, student, node = await _teacher_student_node(db_session, "2")
    assessment = await create_assessment(
        db_session, teacher.id, "Later Quiz", [node.id], item_count=2
    )
    due = _naive_now() + timedelta(days=30)
    await assign(db_session, assessment.id, [student.id], due_at=due)

    assert await send_due_reminders(db_session) == 0


async def test_no_due_date_never_reminded(db_session):
    teacher, student, node = await _teacher_student_node(db_session, "3")
    assessment = await create_assessment(
        db_session, teacher.id, "No Due Quiz", [node.id], item_count=2
    )
    await assign(db_session, assessment.id, [student.id])  # no due_at

    assert await send_due_reminders(db_session) == 0

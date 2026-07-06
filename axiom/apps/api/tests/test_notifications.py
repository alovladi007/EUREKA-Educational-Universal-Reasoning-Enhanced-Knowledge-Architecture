"""In-app notifications: service flow, an emit hook, and the endpoints."""

from __future__ import annotations

import uuid

from sqlalchemy import select

from app.domains.assessment.service import assign, create_assessment
from app.domains.curriculum.models import KnowledgeNode
from app.domains.identity.models import User
from app.domains.notifications.service import (
    list_notifications,
    mark_all_read,
    mark_read,
    notify,
    unread_count,
)
from tests.conftest import AUTH


async def test_notify_list_mark_and_count(db_session):
    user = User(eureka_user_id="n1", email="n1@x.com", display_name="N One")
    db_session.add(user)
    await db_session.flush()

    await notify(db_session, user.id, "system", "Hello", "a body", "/x")
    await notify(db_session, user.id, "badge", "Badge earned", "First Correct", "/achievements")

    assert await unread_count(db_session, user.id) == 2
    items = await list_notifications(db_session, user.id)
    assert len(items) == 2

    first_id = uuid.UUID(items[0]["id"])
    assert await mark_read(db_session, user.id, first_id) is True
    assert await unread_count(db_session, user.id) == 1

    unread = await list_notifications(db_session, user.id, unread_only=True)
    assert len(unread) == 1

    assert await mark_all_read(db_session, user.id) == 1
    assert await unread_count(db_session, user.id) == 0


async def test_assignment_emits_notification(db_session):
    teacher = User(eureka_user_id="nt", email="nt@x.com", display_name="N Teacher")
    student = User(eureka_user_id="ns", email="ns@x.com", display_name="N Student")
    db_session.add_all([teacher, student])
    await db_session.flush()

    node = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "ALG.1"))
    ).scalar_one()
    assessment = await create_assessment(db_session, teacher.id, "Quiz N", [node.id], item_count=2)
    added = await assign(db_session, assessment.id, [student.id])
    assert added == 1

    items = await list_notifications(db_session, student.id)
    assert any(i["kind"] == "assignment" and "Quiz N" in i["body"] for i in items)


async def test_notification_endpoints(client):
    listing = await client.get("/api/v1/notifications", headers=AUTH)
    assert listing.status_code == 200
    body = listing.json()
    assert "items" in body and "unread_count" in body

    count = await client.get("/api/v1/notifications/unread-count", headers=AUTH)
    assert count.status_code == 200
    assert "count" in count.json()

    read_all = await client.post("/api/v1/notifications/read-all", headers=AUTH)
    assert read_all.status_code == 200
    assert "marked" in read_all.json()

"""Tests for proctoring: sessions, integrity events, anomaly scoring, review."""

from __future__ import annotations

import uuid

import pytest

from app.domains.proctoring import service as svc
from tests.conftest import AUTH

# --- anomaly scoring / service ------------------------------------------


@pytest.mark.asyncio
async def test_events_accumulate_a_weighted_anomaly_score(db_session):
    user_id = uuid.uuid4()
    proctor = await svc.start_session(
        db_session, user_id, assessment_id=None, attempt_id=None, policy={"block_copy": True}
    )
    # A window blur (weight 1) then a paste (weight 3) -> score 4, over threshold.
    await svc.record_event(db_session, proctor.id, user_id, kind="window_blur")
    result = await svc.record_event(db_session, proctor.id, user_id, kind="paste")
    assert result is not None
    assert result["anomaly_score"] == pytest.approx(4.0)
    assert result["flagged"] is True


@pytest.mark.asyncio
async def test_event_on_another_users_session_is_rejected(db_session):
    owner = uuid.uuid4()
    proctor = await svc.start_session(
        db_session, owner, assessment_id=None, attempt_id=None, policy=None
    )
    intruder = uuid.uuid4()
    assert (
        await svc.record_event(db_session, proctor.id, intruder, kind="paste") is None
    )


@pytest.mark.asyncio
async def test_ended_session_rejects_further_events(db_session):
    user_id = uuid.uuid4()
    proctor = await svc.start_session(
        db_session, user_id, assessment_id=None, attempt_id=None, policy=None
    )
    await svc.end_session(db_session, proctor.id, user_id)
    assert (
        await svc.record_event(db_session, proctor.id, user_id, kind="paste") is None
    )


@pytest.mark.asyncio
async def test_review_queue_lists_only_flagged_sessions(db_session):
    quiet_user, noisy_user = uuid.uuid4(), uuid.uuid4()
    quiet = await svc.start_session(
        db_session, quiet_user, assessment_id=None, attempt_id=None, policy=None
    )
    await svc.record_event(db_session, quiet.id, quiet_user, kind="context_menu")  # 0.5
    noisy = await svc.start_session(
        db_session, noisy_user, assessment_id=None, attempt_id=None, policy=None
    )
    for _ in range(2):
        await svc.record_event(db_session, noisy.id, noisy_user, kind="paste")  # 6.0

    flagged = await svc.review_queue(db_session)
    ids = [row["session_id"] for row in flagged]
    assert str(noisy.id) in ids
    assert str(quiet.id) not in ids


# --- endpoints -----------------------------------------------------------


@pytest.mark.asyncio
async def test_student_can_run_a_session(client):
    started = await client.post("/api/v1/proctoring/sessions", json={}, headers=AUTH)
    assert started.status_code == 200, started.text
    sid = started.json()["session_id"]

    event = await client.post(
        f"/api/v1/proctoring/sessions/{sid}/events",
        json={"kind": "paste", "detail": "pasted 12 chars"},
        headers=AUTH,
    )
    assert event.status_code == 200
    assert event.json()["anomaly_score"] == pytest.approx(3.0)

    ended = await client.post(f"/api/v1/proctoring/sessions/{sid}/end", headers=AUTH)
    assert ended.status_code == 200 and ended.json()["status"] == "ended"


@pytest.mark.asyncio
async def test_review_is_teacher_only(client):
    # The default mock principal is a student.
    res = await client.get("/api/v1/proctoring/review", headers=AUTH)
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_teacher_reviews_a_flagged_session(as_teacher, client):
    started = await client.post("/api/v1/proctoring/sessions", json={}, headers=AUTH)
    sid = started.json()["session_id"]
    for _ in range(2):
        await client.post(
            f"/api/v1/proctoring/sessions/{sid}/events",
            json={"kind": "paste"},
            headers=AUTH,
        )
    queue = await client.get("/api/v1/proctoring/review", headers=AUTH)
    assert queue.status_code == 200
    assert any(s["session_id"] == sid for s in queue.json()["sessions"])

    detail = await client.get(f"/api/v1/proctoring/sessions/{sid}", headers=AUTH)
    assert detail.status_code == 200
    assert detail.json()["flagged"] is True
    assert len(detail.json()["events"]) == 2

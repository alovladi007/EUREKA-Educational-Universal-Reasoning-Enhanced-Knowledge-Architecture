"""Tests for copilot item generation, the review queue, and teacher assist.

Item generation is verified end to end: candidates are CAS-validated, they land
in a pending queue rather than the bank, approval creates a real Item, and the
whole flow is gated to teaching roles.
"""

from __future__ import annotations

import pytest

from tests.conftest import AUTH


@pytest.mark.asyncio
async def test_generation_is_forbidden_for_students(client):
    res = await client.post(
        "/api/v1/copilot/generate-items", json={"node": "ALG.1", "count": 2}, headers=AUTH
    )
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_generate_validates_and_queues(as_teacher, client):
    res = await client.post(
        "/api/v1/copilot/generate-items",
        json={"node": "ALG.1", "count": 3},
        headers=AUTH,
    )
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["generated"] >= 1
    # Every stored candidate was CAS-validated.
    assert all(c["validated"] is True for c in body["candidates"])

    queue = await client.get("/api/v1/copilot/generated", headers=AUTH)
    assert queue.status_code == 200
    assert len(queue.json()["candidates"]) >= body["generated"]


@pytest.mark.asyncio
async def test_approve_creates_a_real_item(as_teacher, client):
    gen = await client.post(
        "/api/v1/copilot/generate-items",
        json={"node": "ALG.1", "count": 1},
        headers=AUTH,
    )
    candidate_id = gen.json()["candidates"][0]["id"]

    approved = await client.post(
        f"/api/v1/copilot/generated/{candidate_id}/review",
        json={"action": "approve"},
        headers=AUTH,
    )
    assert approved.status_code == 200, approved.text
    body = approved.json()
    assert body["status"] == "approved" and "item_id" in body

    # The approved item now exists in the bank and is visible to authoring.
    items = await client.get("/api/v1/authoring/items?node=ALG.1", headers=AUTH)
    ids = [i["id"] for i in items.json()["items"]]
    assert body["item_id"] in ids


@pytest.mark.asyncio
async def test_reject_does_not_create_an_item(as_teacher, client):
    gen = await client.post(
        "/api/v1/copilot/generate-items",
        json={"node": "ALG.1", "count": 1},
        headers=AUTH,
    )
    candidate_id = gen.json()["candidates"][0]["id"]

    rejected = await client.post(
        f"/api/v1/copilot/generated/{candidate_id}/review",
        json={"action": "reject"},
        headers=AUTH,
    )
    assert rejected.status_code == 200 and rejected.json()["status"] == "rejected"

    # Reviewing it again fails: it is no longer pending.
    again = await client.post(
        f"/api/v1/copilot/generated/{candidate_id}/review",
        json={"action": "approve"},
        headers=AUTH,
    )
    assert again.status_code == 404


@pytest.mark.asyncio
async def test_teacher_assist_returns_grounded_response(as_teacher, client):
    res = await client.post(
        "/api/v1/copilot/teacher-assist",
        json={"task": "draft_quiz", "node": "ALG.1"},
        headers=AUTH,
    )
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["task"] == "draft_quiz"
    assert body["ai_generated"] is True
    assert isinstance(body["suggested_items"], list)


@pytest.mark.asyncio
async def test_teacher_assist_rejects_unknown_task(as_teacher, client):
    res = await client.post(
        "/api/v1/copilot/teacher-assist",
        json={"task": "nope", "node": "ALG.1"},
        headers=AUTH,
    )
    assert res.status_code == 404

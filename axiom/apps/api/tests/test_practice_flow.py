"""Integration: the student practice loop works end to end."""

from __future__ import annotations

from tests.conftest import AUTH


async def test_practice_next_answer_and_mastery(client):
    nxt = await client.post("/api/v1/practice/next", json={}, headers=AUTH)
    assert nxt.status_code == 200
    served = nxt.json()
    assert not served.get("done"), "a fresh student should have something to practice"
    assert served["response_token"]
    assert served["prompt"]
    assert served["kind"] in ("mcq_single", "numeric", "math_expression", "equation")

    ans = await client.post(
        "/api/v1/practice/answer",
        json={"response_token": served["response_token"], "answer": "5"},
        headers=AUTH,
    )
    assert ans.status_code == 200
    body = ans.json()
    assert "is_correct" in body
    assert "mastery" in body
    assert "p_known_before" in body["mastery"]
    assert "p_known_after" in body["mastery"]

    mastery = await client.get("/api/v1/mastery/me", headers=AUTH)
    assert mastery.status_code == 200
    assert len(mastery.json()["states"]) >= 1

    node_id = body["mastery"]["node_id"]
    evidence = await client.get(f"/api/v1/mastery/me/evidence/{node_id}", headers=AUTH)
    assert evidence.status_code == 200
    assert len(evidence.json()["events"]) >= 1


async def test_learning_path_has_statuses(client):
    resp = await client.get("/api/v1/learning-path/me", headers=AUTH)
    assert resp.status_code == 200
    body = resp.json()
    assert len(body["plan"]) >= 6
    assert all(step["status"] in ("available", "locked", "mastered") for step in body["plan"])
    # The first node has no prerequisites, so it must be available at the start.
    assert body["recommended_node_id"]


async def test_diagnostic_start_serves_items(client):
    resp = await client.post("/api/v1/diagnostic/start", headers=AUTH)
    assert resp.status_code == 200
    assert resp.json()["count"] >= 1

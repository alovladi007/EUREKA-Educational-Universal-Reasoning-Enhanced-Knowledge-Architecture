"""Integration: a CAT session serves items, updates theta, and terminates."""

from __future__ import annotations

from tests.conftest import AUTH


async def test_cat_runs_to_completion(client):
    start = await client.post("/api/v1/cat/start", headers=AUTH)
    assert start.status_code == 200
    body = start.json()
    assert not body.get("done"), "the seeded bank has items, so a session should start"
    assert body["item"]["item_id"]
    session_id = body["session_id"]

    done = False
    last = body
    # The seeded bank is small, so the session stops by SE threshold or by
    # exhausting the pool well within this bound.
    for _ in range(30):
        ans = await client.post(
            f"/api/v1/cat/{session_id}/answer",
            json={"answer": "0"},
            headers=AUTH,
        )
        assert ans.status_code == 200
        last = ans.json()
        assert "theta" in last and "standard_error" in last
        if last.get("done"):
            done = True
            break

    assert done, "a finite bank must terminate the CAT session"
    assert last["item_count"] >= 5  # MIN_ITEMS floor before an early stop


async def test_cat_state_is_resumable(client):
    start = (await client.post("/api/v1/cat/start", headers=AUTH)).json()
    session_id = start["session_id"]
    state = await client.get(f"/api/v1/cat/{session_id}", headers=AUTH)
    assert state.status_code == 200
    body = state.json()
    assert body["status"] == "in_progress"
    assert body["item"]["item_id"] == start["item"]["item_id"]

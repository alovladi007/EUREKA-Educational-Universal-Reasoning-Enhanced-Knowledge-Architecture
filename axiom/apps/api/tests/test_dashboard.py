"""Dashboard summary."""

from __future__ import annotations


async def test_dashboard_requires_token(client):
    resp = await client.get("/api/v1/dashboard/summary")
    assert resp.status_code == 401


async def test_dashboard_summary_shape(client):
    resp = await client.get(
        "/api/v1/dashboard/summary", headers={"Authorization": "Bearer devtoken"}
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["user"]["display_name"] == "Dev Student"
    assert isinstance(body["modules"], list)
    assert len(body["modules"]) >= 1
    # Phase 0 is honest: nothing is faked, mastery is empty, modules are planned.
    assert body["mastery_summary"] is None
    assert all(m["status"] in ("available", "planned") for m in body["modules"])

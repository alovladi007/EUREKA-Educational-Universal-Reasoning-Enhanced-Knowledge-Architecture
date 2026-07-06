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
    # Honest by construction: mastery is not faked here, and every module
    # carries a real readiness status (available or planned), never a guess.
    assert body["mastery_summary"] is None
    assert all(m["status"] in ("available", "planned") for m in body["modules"])
    # Analytics shipped in Phase 2, so it must no longer be advertised as planned.
    analytics = next(m for m in body["modules"] if m["key"] == "analytics")
    assert analytics["status"] == "available"

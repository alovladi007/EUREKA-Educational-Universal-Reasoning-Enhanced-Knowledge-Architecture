"""Health and readiness probes."""

from __future__ import annotations


async def test_health_ok(client):
    resp = await client.get("/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["service"] == "axiom-api"


async def test_ready_ok(client):
    resp = await client.get("/ready")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ready"


async def test_openapi_served(client):
    resp = await client.get("/openapi.json")
    assert resp.status_code == 200
    spec = resp.json()
    assert "/api/v1/me" in spec["paths"]
    assert "/api/v1/dashboard/summary" in spec["paths"]

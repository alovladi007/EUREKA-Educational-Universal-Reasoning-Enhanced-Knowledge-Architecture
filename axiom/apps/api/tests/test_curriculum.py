"""Integration: curriculum and content surface, plus the OpenAPI contract."""

from __future__ import annotations

from tests.conftest import AUTH


async def test_graph(client):
    resp = await client.get("/api/v1/curriculum/graph", headers=AUTH)
    assert resp.status_code == 200
    body = resp.json()
    assert len(body["nodes"]) >= 6
    assert len(body["edges"]) >= 6
    assert all("kind" in e for e in body["edges"])


async def test_frameworks(client):
    resp = await client.get("/api/v1/curriculum/frameworks", headers=AUTH)
    assert resp.status_code == 200
    assert any(f["code"] == "AAF" for f in resp.json())


async def test_lesson_for_node(client):
    resp = await client.get("/api/v1/content/nodes/ALG.1/lesson", headers=AUTH)
    assert resp.status_code == 200
    body = resp.json()
    assert body["title"]
    assert len(body["steps"]) >= 2


async def test_openapi_lists_phase1_routes(client):
    resp = await client.get("/openapi.json")
    assert resp.status_code == 200
    paths = resp.json()["paths"]
    for path in (
        "/api/v1/curriculum/graph",
        "/api/v1/practice/next",
        "/api/v1/practice/answer",
        "/api/v1/mastery/me",
        "/api/v1/learning-path/me",
        "/api/v1/assessments",
    ):
        assert path in paths, f"missing {path} in OpenAPI"

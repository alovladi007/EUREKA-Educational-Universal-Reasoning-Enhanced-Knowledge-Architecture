"""Tests for the Content Studio authoring service and endpoints.

Two layers:
  - service level (db_session): create, list, update, delete, and validation,
    which need no auth and cover the CRUD directly.
  - endpoint level (client): the role gate (a student is forbidden, an anonymous
    caller is unauthorized) and, with a teaching principal, the full API loop
    including preview-grade, which runs the real grader on a sample answer.
"""

from __future__ import annotations

import pytest
from shared_schemas.identity import Principal

from app.core.security import MockEurekaIdentity
from app.domains.authoring import service as svc
from tests.conftest import AUTH

TEACHER = Principal(
    sub="00000000-0000-0000-0000-000000000009",
    email="teacher@axiom.local",
    display_name="Dev Teacher",
    roles=["teacher"],
    tenant_id=None,
)


@pytest.fixture
def as_teacher(monkeypatch):
    """Make the mock identity return a teaching principal for this test."""
    monkeypatch.setattr(MockEurekaIdentity, "_FIXED", TEACHER)
    yield


# --- service level -------------------------------------------------------


@pytest.mark.asyncio
async def test_service_create_list_update_delete(db_session):
    created = await svc.create_item(
        db_session,
        {
            "node": "ALG.1",
            "kind": "math_expression",
            "prompt": "Factor x^2 - 1.",
            "correct": "(x-1)*(x+1)",
        },
    )
    await db_session.commit()
    item_id = created["id"]

    rows = await svc.list_items(
        db_session, node_id=await svc.resolve_node_id(db_session, "ALG.1")
    )
    assert any(r["id"] == item_id for r in rows)

    updated = await svc.update_item(
        db_session, __import__("uuid").UUID(item_id), {"prompt": "Factor x^2 - 4."}
    )
    assert updated["prompt"] == "Factor x^2 - 4."

    assert await svc.delete_item(db_session, __import__("uuid").UUID(item_id)) is True


@pytest.mark.asyncio
async def test_service_rejects_unknown_kind_and_node(db_session):
    with pytest.raises(svc.AuthoringError):
        await svc.create_item(
            db_session, {"node": "ALG.1", "kind": "not_a_kind", "prompt": "x", "correct": "x"}
        )
    with pytest.raises(svc.AuthoringError):
        await svc.create_item(
            db_session,
            {"node": "NOPE.404", "kind": "numeric", "prompt": "x", "correct": "1"},
        )


# --- role gate -----------------------------------------------------------


@pytest.mark.asyncio
async def test_anonymous_is_unauthorized(client):
    res = await client.get("/api/v1/authoring/nodes")
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_student_is_forbidden(client):
    # The default mock principal is a student, which must not author.
    res = await client.get("/api/v1/authoring/nodes", headers=AUTH)
    assert res.status_code == 403


# --- endpoint level (teaching principal) --------------------------------


@pytest.mark.asyncio
async def test_endpoint_loop_for_teacher(as_teacher, client):
    nodes = await client.get("/api/v1/authoring/nodes", headers=AUTH)
    assert nodes.status_code == 200
    assert any(n["code"] == "ALG.1" for n in nodes.json()["nodes"])

    draft = {
        "node": "ALG.1",
        "kind": "math_expression",
        "prompt": "Factor $x^2 - 1$.",
        "correct": "(x-1)*(x+1)",
        "explanation": "Difference of squares.",
        "difficulty": 0.4,
    }
    created = await client.post("/api/v1/authoring/items", json=draft, headers=AUTH)
    assert created.status_code == 200, created.text
    item_id = created.json()["id"]

    patched = await client.put(
        f"/api/v1/authoring/items/{item_id}",
        json={"prompt": "Factor $x^2 - 4$.", "correct": "(x-2)*(x+2)"},
        headers=AUTH,
    )
    assert patched.status_code == 200
    assert patched.json()["prompt"] == "Factor $x^2 - 4$."

    deleted = await client.delete(f"/api/v1/authoring/items/{item_id}", headers=AUTH)
    assert deleted.status_code == 200 and deleted.json()["deleted"] is True


@pytest.mark.asyncio
async def test_preview_grade_uses_the_real_grader(as_teacher, client):
    right = await client.post(
        "/api/v1/authoring/preview-grade",
        json={"kind": "math_expression", "correct": "x^2 - 1", "sample_answer": "(x-1)*(x+1)"},
        headers=AUTH,
    )
    assert right.status_code == 200, right.text
    assert right.json()["is_correct"] is True

    wrong = await client.post(
        "/api/v1/authoring/preview-grade",
        json={"kind": "math_expression", "correct": "x^2 - 1", "sample_answer": "x^2 + 1"},
        headers=AUTH,
    )
    assert wrong.status_code == 200 and wrong.json()["is_correct"] is False


@pytest.mark.asyncio
async def test_verify_solution_endpoint(as_teacher, client):
    good = await client.post(
        "/api/v1/authoring/verify-solution",
        json={"steps": ["2*x + 3 = 11", "2*x = 8", "x = 4"]},
        headers=AUTH,
    )
    assert good.status_code == 200 and good.json()["ok"] is True

    bad = await client.post(
        "/api/v1/authoring/verify-solution",
        json={"steps": ["2*x + 3 = 11", "2*x = 9", "x = 4"]},
        headers=AUTH,
    )
    assert bad.status_code == 200 and bad.json()["ok"] is False


@pytest.mark.asyncio
async def test_generate_solution_endpoint(as_teacher, client):
    ok = await client.post(
        "/api/v1/authoring/generate-solution",
        json={"equation": "2*x + 3 = 11"},
        headers=AUTH,
    )
    assert ok.status_code == 200
    body = ok.json()
    assert body["ok"] is True and body["steps"][-1].replace(" ", "") == "x=4"

    nope = await client.post(
        "/api/v1/authoring/generate-solution",
        json={"equation": "x^2 = 4"},
        headers=AUTH,
    )
    assert nope.status_code == 200 and nope.json()["ok"] is False

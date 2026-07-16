"""
Integration tests for XR Labs (/api/v1/xr/*) — the authoring loop, session
lifecycle, and ownership boundaries built in XR-1..XR-4.

Same idiom as the other integration suites: seed users directly in Postgres,
log in over the live API, exercise the endpoints. The regressions these lock
down all shipped as real bugs:
  - publish produced experiences the viewer could not render (no scene_data)
  - saved scene projects were unreachable (no GET endpoint at all)
  - sessions reported hardcoded 100% completion and a hardcoded 5-star rating
  - avg_rating was never computed from anything
  - ending a session twice double-awarded XP
"""

from __future__ import annotations

import os
import uuid

import httpx
import psycopg2
import pytest
from passlib.context import CryptContext


API_BASE = os.environ.get("API_CORE_URL", "http://localhost:8000")
PG_DSN = os.environ.get("PG_DSN", "postgresql://eureka:eureka_dev_password@localhost:5434/eureka")
PWD = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")
ORG = "550e8400-e29b-41d4-a716-446655440000"

SCENE = {
    "objects": [
        {
            "id": "obj_1",
            "name": "Cube 1",
            "type": "cube",
            "position": [0, 1, 0],
            "rotation": [0, 0, 0],
            "scale": [1, 1, 1],
            "properties": {"color": 16711680},
        },
        {
            "id": "obj_2",
            "name": "Sphere 1",
            "type": "sphere",
            "position": [2, 1, 0],
            "rotation": [0, 0, 0],
            "scale": [1, 1, 1],
            "properties": {"color": 65280},
        },
    ],
    "lights": [],
    "cameras": [],
}


def _conn():
    return psycopg2.connect(PG_DSN)


def _make_user(role: str = "student") -> dict:
    suffix = uuid.uuid4().hex[:8]
    email = f"xr-{role}-{suffix}@example.com"
    pw = "XrTest123!"
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(), %s, %s, %s, 'Xr', 'Test', %s, TRUE, TRUE)
            RETURNING id
            """,
            (ORG, email, PWD.hash(pw), role),
        )
        user_id = cur.fetchone()[0]
        c.commit()
    r = httpx.post(
        f"{API_BASE}/api/v1/auth/login",
        json={"email": email, "password": pw},
        timeout=30,
    )
    r.raise_for_status()
    token = r.json()["access_token"]
    return {"id": str(user_id), "headers": {"Authorization": f"Bearer {token}"}}


@pytest.fixture(scope="module")
def owner():
    return _make_user()


@pytest.fixture(scope="module")
def other():
    return _make_user()


@pytest.fixture(scope="module")
def project(owner):
    r = httpx.post(
        f"{API_BASE}/api/v1/xr/scene-builder/projects",
        headers=owner["headers"],
        json={
            "projectName": "Test Lab",
            "description": "integration",
            "category": "science",
            "sceneData": SCENE,
        },
        timeout=30,
    )
    assert r.status_code == 200, r.text
    return r.json()["project"]["id"]


# ── catalog ────────────────────────────────────────────────────────────────


def test_experiences_list_is_public():
    r = httpx.get(f"{API_BASE}/api/v1/xr/experiences", timeout=30)
    assert r.status_code == 200
    assert isinstance(r.json()["experiences"], list)


def test_builtin_portals_are_registered():
    """XR-4: the portals must exist as experiences so runs earn sessions/XP."""
    r = httpx.get(f"{API_BASE}/api/v1/xr/experiences", timeout=30)
    routes = {
        e["scene_file_url"]
        for e in r.json()["experiences"]
        if e["scene_file_url"].startswith("/dashboard/")
    }
    assert "/dashboard/xr-labs/molecules" in routes
    assert "/dashboard/xr-labs/anatomy" in routes


# ── XR-1: the authoring loop ───────────────────────────────────────────────


def test_project_roundtrips_with_its_scene(owner, project):
    """The G2 regression: saved projects used to be unreachable."""
    r = httpx.get(
        f"{API_BASE}/api/v1/xr/scene-builder/projects/{project}",
        headers=owner["headers"],
        timeout=30,
    )
    assert r.status_code == 200
    body = r.json()["project"]
    assert body["projectName"] == "Test Lab"
    assert len(body["sceneData"]["objects"]) == 2


def test_project_appears_in_my_projects(owner, project):
    r = httpx.get(
        f"{API_BASE}/api/v1/xr/scene-builder/projects",
        headers=owner["headers"],
        timeout=30,
    )
    assert r.status_code == 200
    assert project in {p["id"] for p in r.json()["projects"]}


def test_other_user_cannot_read_or_delete_project(other, project):
    assert (
        httpx.get(
            f"{API_BASE}/api/v1/xr/scene-builder/projects/{project}",
            headers=other["headers"],
            timeout=30,
        ).status_code
        == 404
    )
    assert (
        httpx.delete(
            f"{API_BASE}/api/v1/xr/scene-builder/projects/{project}",
            headers=other["headers"],
            timeout=30,
        ).status_code
        == 404
    )


def test_projects_require_auth():
    assert httpx.get(f"{API_BASE}/api/v1/xr/scene-builder/projects", timeout=30).status_code in (401, 403)


def test_publish_carries_the_scene(owner, project):
    """The G1 regression: published scenes rendered as an empty void."""
    r = httpx.post(
        f"{API_BASE}/api/v1/xr/scene-builder/projects/{project}/publish",
        headers=owner["headers"],
        json={"difficulty_level": "beginner", "duration_minutes": 10, "tags": ["test"]},
        timeout=30,
    )
    assert r.status_code == 200, r.text
    eid = r.json()["experienceId"]

    got = httpx.get(f"{API_BASE}/api/v1/xr/experiences/{eid}", timeout=30).json()["experience"]
    assert len(got["scene_data"]["objects"]) == 2, "publish must copy scene_data"
    assert got["source_project_id"] == project


# ── XR-8: unpublish (publishing used to be one-way) ────────────────────────


def test_unpublish_takes_the_experience_out_of_the_catalog(owner):
    """XR-8: a published scene can be pulled back down; it leaves the public
    catalog, publishedCount drops to 0, and re-unpublishing is a no-op."""
    proj = httpx.post(
        f"{API_BASE}/api/v1/xr/scene-builder/projects",
        headers=owner["headers"],
        json={"projectName": "Unpublish Lab", "category": "science", "sceneData": SCENE},
        timeout=30,
    ).json()["project"]["id"]
    eid = httpx.post(
        f"{API_BASE}/api/v1/xr/scene-builder/projects/{proj}/publish",
        headers=owner["headers"],
        json={"duration_minutes": 5},
        timeout=30,
    ).json()["experienceId"]

    # published: in the catalog, and My Projects reports publishedCount >= 1
    ids = [e["id"] for e in httpx.get(f"{API_BASE}/api/v1/xr/experiences", timeout=30).json()["experiences"]]
    assert eid in ids
    mine = httpx.get(f"{API_BASE}/api/v1/xr/scene-builder/projects", headers=owner["headers"], timeout=30).json()["projects"]
    assert next(p for p in mine if p["id"] == proj)["publishedCount"] >= 1

    # unpublish
    r = httpx.post(
        f"{API_BASE}/api/v1/xr/scene-builder/projects/{proj}/unpublish",
        headers=owner["headers"], timeout=30,
    )
    assert r.status_code == 200, r.text
    assert r.json()["unpublished"] >= 1

    ids = [e["id"] for e in httpx.get(f"{API_BASE}/api/v1/xr/experiences", timeout=30).json()["experiences"]]
    assert eid not in ids, "unpublished experience must leave the public catalog"
    mine = httpx.get(f"{API_BASE}/api/v1/xr/scene-builder/projects", headers=owner["headers"], timeout=30).json()["projects"]
    assert next(p for p in mine if p["id"] == proj)["publishedCount"] == 0

    # idempotent: a second unpublish reports 0, no error
    again = httpx.post(
        f"{API_BASE}/api/v1/xr/scene-builder/projects/{proj}/unpublish",
        headers=owner["headers"], timeout=30,
    )
    assert again.status_code == 200 and again.json()["unpublished"] == 0

    httpx.delete(f"{API_BASE}/api/v1/xr/scene-builder/projects/{proj}", headers=owner["headers"], timeout=30)


def test_other_user_cannot_unpublish_my_project(owner, other):
    proj = httpx.post(
        f"{API_BASE}/api/v1/xr/scene-builder/projects",
        headers=owner["headers"],
        json={"projectName": "Guarded Lab", "category": "science", "sceneData": SCENE},
        timeout=30,
    ).json()["project"]["id"]
    r = httpx.post(
        f"{API_BASE}/api/v1/xr/scene-builder/projects/{proj}/unpublish",
        headers=other["headers"], timeout=30,
    )
    assert r.status_code == 404, "unpublish must be owner-scoped"
    httpx.delete(f"{API_BASE}/api/v1/xr/scene-builder/projects/{proj}", headers=owner["headers"], timeout=30)


# ── XR-2: session lifecycle, ratings, XP ───────────────────────────────────


@pytest.fixture(scope="module")
def experience(owner, project):
    r = httpx.post(
        f"{API_BASE}/api/v1/xr/scene-builder/projects/{project}/publish",
        headers=owner["headers"],
        json={"duration_minutes": 10},
        timeout=30,
    )
    return r.json()["experienceId"]


def test_session_records_real_completion_and_rating(owner, experience):
    start = httpx.post(
        f"{API_BASE}/api/v1/xr/sessions/start",
        headers=owner["headers"],
        json={"experience_id": experience, "device_type": "web_browser"},
        timeout=30,
    )
    assert start.status_code == 200, start.text
    sid = start.json()["session"]["id"]

    end = httpx.post(
        f"{API_BASE}/api/v1/xr/sessions/{sid}/end",
        headers=owner["headers"],
        json={"completion_percentage": 80, "user_rating": 4},
        timeout=30,
    )
    assert end.status_code == 200, end.text
    session = end.json()["session"]
    assert session["status"] == "completed"
    assert session["completion_percentage"] == 80, "must store the client's real number"
    assert session["user_rating"] == 4, "must store the user's rating, not a hardcoded 5"
    assert end.json()["xp_awarded"] >= 25, "completing >=50% earns XP"


def test_end_is_idempotent(owner, experience):
    sid = httpx.post(
        f"{API_BASE}/api/v1/xr/sessions/start",
        headers=owner["headers"],
        json={"experience_id": experience},
        timeout=30,
    ).json()["session"]["id"]
    first = httpx.post(
        f"{API_BASE}/api/v1/xr/sessions/{sid}/end",
        headers=owner["headers"],
        json={"completion_percentage": 60, "user_rating": 3},
        timeout=30,
    ).json()
    second = httpx.post(
        f"{API_BASE}/api/v1/xr/sessions/{sid}/end",
        headers=owner["headers"],
        json={"completion_percentage": 100, "user_rating": 5},
        timeout=30,
    ).json()
    assert first["xp_awarded"] >= 25
    assert second.get("already_ended") is True
    assert second["session"]["user_rating"] == 3, "re-ending must not overwrite"
    assert second["session"]["completion_percentage"] == 60
    assert "xp_awarded" not in second or not second.get("xp_awarded")


def test_avg_rating_is_computed_from_sessions(owner, experience):
    exp = httpx.get(f"{API_BASE}/api/v1/xr/experiences/{experience}", timeout=30).json()["experience"]
    assert exp["avg_rating"] is not None and exp["avg_rating"] > 0, (
        "avg_rating must reflect real session ratings"
    )


def test_session_carries_org_id(owner, experience):
    sid = httpx.post(
        f"{API_BASE}/api/v1/xr/sessions/start",
        headers=owner["headers"],
        json={"experience_id": experience},
        timeout=30,
    ).json()["session"]["id"]
    with _conn() as c, c.cursor() as cur:
        cur.execute("SELECT org_id FROM xr_sessions WHERE id = %s", (sid,))
        assert str(cur.fetchone()[0]) == ORG, "P2-8: sessions are learner data"


def test_other_user_cannot_end_my_session(owner, other, experience):
    sid = httpx.post(
        f"{API_BASE}/api/v1/xr/sessions/start",
        headers=owner["headers"],
        json={"experience_id": experience},
        timeout=30,
    ).json()["session"]["id"]
    r = httpx.post(
        f"{API_BASE}/api/v1/xr/sessions/{sid}/end",
        headers=other["headers"],
        json={"completion_percentage": 1},
        timeout=30,
    )
    assert r.status_code == 404


def test_my_sessions_lists_only_mine(owner, other, experience):
    mine = httpx.get(
        f"{API_BASE}/api/v1/xr/me/sessions", headers=owner["headers"], timeout=30
    ).json()["sessions"]
    theirs = httpx.get(
        f"{API_BASE}/api/v1/xr/me/sessions", headers=other["headers"], timeout=30
    ).json()["sessions"]
    assert len(mine) > 0
    assert all(s["title"] for s in mine), "history joins the experience title"
    assert len(theirs) == 0


def test_start_session_requires_auth(experience):
    r = httpx.post(
        f"{API_BASE}/api/v1/xr/sessions/start",
        json={"experience_id": experience},
        timeout=30,
    )
    assert r.status_code in (401, 403)


# ── XR-3: asset library ────────────────────────────────────────────────────


def test_register_and_find_asset(owner):
    name = f"Test Model {uuid.uuid4().hex[:6]}"
    r = httpx.post(
        f"{API_BASE}/api/v1/xr/asset-library/assets",
        headers=owner["headers"],
        json={
            "asset_name": name,
            "file_url": "http://localhost:8300/api/v1/files/public/xr-assets/x/y.glb",
            "file_format": "glb",
            "category_name": "Uploads",
        },
        timeout=30,
    )
    assert r.status_code == 201, r.text
    found = httpx.get(
        f"{API_BASE}/api/v1/xr/asset-library/search", params={"q": name}, timeout=30
    ).json()["assets"]
    assert any(a["asset_name"] == name for a in found)


def test_register_asset_requires_auth():
    r = httpx.post(
        f"{API_BASE}/api/v1/xr/asset-library/assets",
        json={"asset_name": "nope", "file_url": "http://x/y.glb"},
        timeout=30,
    )
    assert r.status_code in (401, 403)


# ── cleanup ────────────────────────────────────────────────────────────────


def test_owner_can_delete_project(owner, project):
    r = httpx.delete(
        f"{API_BASE}/api/v1/xr/scene-builder/projects/{project}",
        headers=owner["headers"],
        timeout=30,
    )
    assert r.status_code == 204
    assert (
        httpx.get(
            f"{API_BASE}/api/v1/xr/scene-builder/projects/{project}",
            headers=owner["headers"],
            timeout=30,
        ).status_code
        == 404
    )

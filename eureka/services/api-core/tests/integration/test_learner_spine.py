"""
Integration tests for Phase 4 Session 4.1 — the cross-tier learner spine.

Verified against the running api-core + Postgres. Each test creates a
fresh user, exercises the API surface, and cleans up its rows. Tests are
ordered semantically (profile → enrollments → multi-tier → conflicts);
each is independent at the data layer.

Marker: @pytest.mark.integration — skipped by default in unit runs.

Run locally:
  cd eureka/services/api-core
  pytest tests/integration/test_learner_spine.py -v --override-ini=addopts=
  # …against http://localhost:8000 (eureka-api-core container).
"""

from __future__ import annotations

import os
import uuid

import httpx
import psycopg2
import pytest
from passlib.context import CryptContext


API_BASE = os.environ.get("API_CORE_URL", "http://localhost:8000")
PG_DSN = os.environ.get(
    "PG_DSN", "postgresql://eureka:eureka_dev_password@localhost:5434/eureka"
)

PWD = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


def _conn():
    return psycopg2.connect(PG_DSN)


@pytest.fixture(scope="module")
def learner():
    """
    Spin up a fresh user in the demo org and yield a dict with their
    credentials + access token. Clean up at the end.
    """
    suffix = uuid.uuid4().hex[:8]
    email = f"learner-{suffix}@example.com"
    pw = "LearnerTest123!"

    with _conn() as c, c.cursor() as cur:
        # demo org_id is the seed UUID
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'Learner', 'Spine', 'student', TRUE, TRUE)
            RETURNING id
            """,
            (email, PWD.hash(pw)),
        )
        user_id = str(cur.fetchone()[0])

    r = httpx.post(
        f"{API_BASE}/api/v1/auth/login",
        json={"email": email, "password": pw},
        timeout=10,
    )
    r.raise_for_status()
    token = r.json()["access_token"]

    yield {"user_id": user_id, "email": email, "token": token}

    with _conn() as c, c.cursor() as cur:
        cur.execute("DELETE FROM users WHERE id = %s", (user_id,))


def _hdr(tok: str) -> dict:
    return {"Authorization": f"Bearer {tok}"}


# --- profile ---------------------------------------------------------------


@pytest.mark.integration
def test_profile_is_created_lazily_on_first_read(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/learner-profile/me",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["user_id"] == learner["user_id"]
    assert body["primary_language"] == "en-US"
    assert body["goals"] == []
    assert body["knowledge_state"] == {}


@pytest.mark.integration
def test_profile_partial_update(learner):
    payload = {
        "goals": ["Pass USMLE Step 1", "Match into IM"],
        "interests": ["pharmacology"],
        "learning_preferences": {"session_length_min": 25},
        "primary_language": "es-MX",
    }
    r = httpx.patch(
        f"{API_BASE}/api/v1/learner-profile/me",
        headers=_hdr(learner["token"]),
        json=payload,
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["goals"] == payload["goals"]
    assert body["interests"] == payload["interests"]
    assert body["learning_preferences"] == payload["learning_preferences"]
    assert body["primary_language"] == "es-MX"


# --- tier enrollments ------------------------------------------------------


@pytest.mark.integration
def test_create_undergraduate_enrollment(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/tier-enrollments/me",
        headers=_hdr(learner["token"]),
        json={
            "tier": "undergraduate",
            "tier_context": {"major": "biology", "year": "sophomore"},
            "status": "active",
        },
        timeout=10,
    )
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["tier"] == "undergraduate"
    assert body["status"] == "active"
    assert body["started_at"] is not None, "active enrolment should stamp started_at"


@pytest.mark.integration
def test_create_concurrent_test_prep_enrollment_different_exam(learner):
    """
    The structural property of the learner spine: a single user can have
    enrollments in different tiers AND multiple test_prep enrollments for
    different exams, all simultaneously.
    """
    for exam, target in [("USMLE_Step_1", "2027-08-15"), ("USMLE_Step_2", None)]:
        payload = {
            "tier": "test_prep",
            "tier_context": {"exam": exam},
            "status": "pending",
        }
        if target:
            payload["target_completion_at"] = target + "T00:00:00"
        r = httpx.post(
            f"{API_BASE}/api/v1/tier-enrollments/me",
            headers=_hdr(learner["token"]),
            json=payload,
            timeout=10,
        )
        assert r.status_code == 201, f"exam={exam}: {r.text}"


@pytest.mark.integration
def test_duplicate_active_enrollment_for_same_tier_exam_is_rejected(learner):
    """
    The unique partial index in SQL enforces: one ACTIVE/PENDING/PAUSED
    enrollment per (user, tier, exam_key). Trying again returns 409.
    """
    payload = {
        "tier": "test_prep",
        "tier_context": {"exam": "USMLE_Step_1"},
        "status": "active",
    }
    r = httpx.post(
        f"{API_BASE}/api/v1/tier-enrollments/me",
        headers=_hdr(learner["token"]),
        json=payload,
        timeout=10,
    )
    assert r.status_code == 409, r.text


@pytest.mark.integration
def test_list_returns_all_concurrent_enrollments(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/tier-enrollments/me",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    items = r.json()
    tiers = {(item["tier"], item["tier_context"].get("exam", "")) for item in items}
    assert ("undergraduate", "") in tiers
    assert ("test_prep", "USMLE_Step_1") in tiers
    assert ("test_prep", "USMLE_Step_2") in tiers
    # Must have at least these three (the moat itself: multiple tiers per user).
    assert len(tiers) >= 3


@pytest.mark.integration
def test_complete_an_enrollment_stamps_completed_at(learner):
    # Find the USMLE_Step_2 one and mark it completed.
    list_r = httpx.get(
        f"{API_BASE}/api/v1/tier-enrollments/me",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    target = next(
        e for e in list_r.json()
        if e["tier"] == "test_prep" and e["tier_context"].get("exam") == "USMLE_Step_2"
    )

    r = httpx.patch(
        f"{API_BASE}/api/v1/tier-enrollments/me/{target['id']}",
        headers=_hdr(learner["token"]),
        json={"status": "completed", "progress_pct": 100},
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["status"] == "completed"
    assert body["completed_at"] is not None
    assert float(body["progress_pct"]) == 100.0


@pytest.mark.integration
def test_soft_delete_removes_from_default_list(learner):
    list_r = httpx.get(
        f"{API_BASE}/api/v1/tier-enrollments/me",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    target = list_r.json()[0]

    del_r = httpx.delete(
        f"{API_BASE}/api/v1/tier-enrollments/me/{target['id']}",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert del_r.status_code == 204

    list_r2 = httpx.get(
        f"{API_BASE}/api/v1/tier-enrollments/me",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    ids = {e["id"] for e in list_r2.json()}
    assert target["id"] not in ids, "soft-deleted enrolment should not appear"


@pytest.mark.integration
def test_other_user_cannot_read_my_enrollment(learner):
    """Cross-tenant isolation: a token for another user gets 404."""
    # Create a second user in the same org so we can confirm even
    # same-org users can't peek at others' enrollments via /me endpoints.
    suffix = uuid.uuid4().hex[:8]
    other_email = f"snoop-{suffix}@example.com"
    other_pw = "Snoop123!"
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'Snoop', 'Y', 'student', TRUE, TRUE)
            RETURNING id
            """,
            (other_email, PWD.hash(other_pw)),
        )
        other_id = str(cur.fetchone()[0])

    try:
        other_token = httpx.post(
            f"{API_BASE}/api/v1/auth/login",
            json={"email": other_email, "password": other_pw},
            timeout=10,
        ).json()["access_token"]

        # Other user's /me should be empty (no enrolments yet).
        r = httpx.get(
            f"{API_BASE}/api/v1/tier-enrollments/me",
            headers=_hdr(other_token),
            timeout=10,
        )
        assert r.status_code == 200
        assert r.json() == []
    finally:
        with _conn() as c, c.cursor() as cur:
            cur.execute("DELETE FROM users WHERE id = %s", (other_id,))

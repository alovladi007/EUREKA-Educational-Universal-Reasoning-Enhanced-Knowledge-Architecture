"""
Integration tests for transcript (Phase 4 Session 4.3, 2026-05).

Runs against the live api-core + Postgres.
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


def _conn():
    return psycopg2.connect(PG_DSN)


@pytest.fixture(scope="module")
def learner():
    suffix = uuid.uuid4().hex[:8]
    email = f"tr-{suffix}@example.com"
    pw = "TrTest123!"
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'Tr', 'Tester', 'student', TRUE, TRUE)
            RETURNING id
            """,
            (email, PWD.hash(pw)),
        )
        user_id = str(cur.fetchone()[0])
    token = httpx.post(
        f"{API_BASE}/api/v1/auth/login",
        json={"email": email, "password": pw},
        timeout=10,
    ).json()["access_token"]
    yield {"user_id": user_id, "token": token}
    with _conn() as c, c.cursor() as cur:
        cur.execute("DELETE FROM users WHERE id = %s", (user_id,))


def _hdr(t):
    return {"Authorization": f"Bearer {t}"}


@pytest.mark.integration
def test_record_achievement(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/achievements",
        headers=_hdr(learner["token"]),
        json={
            "kind": "exam_passed",
            "title": "USMLE Step 1 — Passed",
            "description": "Scored 245.",
            "extra_metadata": {"score": 245, "exam": "USMLE_Step_1"},
        },
        timeout=10,
    )
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["title"].startswith("USMLE Step 1")
    assert body["extra_metadata"]["score"] == 245


@pytest.mark.integration
def test_list_achievements(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/achievements/me",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    items = r.json()
    assert any("USMLE Step 1" in a["title"] for a in items)


@pytest.mark.integration
def test_issue_transcript_and_get(learner):
    issue_r = httpx.post(
        f"{API_BASE}/api/v1/transcript/me/issue",
        headers=_hdr(learner["token"]),
        timeout=15,
    )
    assert issue_r.status_code == 201, issue_r.text
    body = issue_r.json()
    assert body["signature_b64"], "expected non-empty signature"
    assert body["achievements_count"] >= 1
    payload = body["payload"]
    assert "@context" in payload
    assert "OpenBadgeCredential" in payload["type"]
    assert payload["issuer"]["name"] == "EUREKA Platform"

    get_r = httpx.get(
        f"{API_BASE}/api/v1/transcript/me",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert get_r.status_code == 200
    assert get_r.json()["id"] == body["id"]


@pytest.mark.integration
def test_re_issue_supersedes_prior(learner):
    first_r = httpx.post(
        f"{API_BASE}/api/v1/transcript/me/issue",
        headers=_hdr(learner["token"]),
        timeout=15,
    )
    assert first_r.status_code == 201, first_r.text
    first_id = first_r.json()["id"]

    second_r = httpx.post(
        f"{API_BASE}/api/v1/transcript/me/issue",
        headers=_hdr(learner["token"]),
        timeout=15,
    )
    assert second_r.status_code == 201, second_r.text
    second_id = second_r.json()["id"]
    assert first_id != second_id

    # The /me endpoint returns the current one — should be the second.
    cur_r = httpx.get(
        f"{API_BASE}/api/v1/transcript/me",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert cur_r.json()["id"] == second_id


@pytest.mark.integration
def test_verify_signature(learner):
    issue_r = httpx.post(
        f"{API_BASE}/api/v1/transcript/me/issue",
        headers=_hdr(learner["token"]),
        timeout=15,
    )
    iid = issue_r.json()["id"]
    v = httpx.get(
        f"{API_BASE}/api/v1/transcript/{iid}/verify",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert v.status_code == 200, v.text
    body = v.json()
    assert body["verified"] is True
    assert body["algorithm"] == "Ed25519"


@pytest.mark.integration
def test_tampered_payload_fails_verification(learner):
    issue_r = httpx.post(
        f"{API_BASE}/api/v1/transcript/me/issue",
        headers=_hdr(learner["token"]),
        timeout=15,
    )
    iid = issue_r.json()["id"]
    # Tamper directly in the DB — swap a value in the JSON payload.
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            UPDATE transcript_issuances
            SET payload = jsonb_set(payload, '{credentialSubject,name}', '"Imposter"'::jsonb)
            WHERE id = %s
            """,
            (iid,),
        )
    v = httpx.get(
        f"{API_BASE}/api/v1/transcript/{iid}/verify",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert v.status_code == 200
    body = v.json()
    assert body["verified"] is False
    assert "Signature" in (body["reason"] or "")

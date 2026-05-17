"""
Integration tests for Phase 9 (institutional / B2B).

Exercises cohorts (9.1) + analytics + at-risk (9.3) + LTI JWKS (9.2) + SSO config CRUD (9.4).
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
def admin():
    suffix = uuid.uuid4().hex[:8]
    email = f"p9admin-{suffix}@example.com"
    pw = "P9AdminTest123!"
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'P9', 'Admin', 'org_admin', TRUE, TRUE)
            RETURNING id
            """,
            (email, PWD.hash(pw)),
        )
        user_id = str(cur.fetchone()[0])
    tok = httpx.post(
        f"{API_BASE}/api/v1/auth/login",
        json={"email": email, "password": pw},
        timeout=10,
    ).json()["access_token"]
    yield {"user_id": user_id, "token": tok}
    with _conn() as c, c.cursor() as cur:
        cur.execute("UPDATE cohorts SET org_id = '550e8400-e29b-41d4-a716-446655440000' WHERE org_id IN (SELECT org_id FROM users WHERE id = %s)", (user_id,))
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        except Exception:
            pass


@pytest.fixture(scope="module")
def learner():
    suffix = uuid.uuid4().hex[:8]
    email = f"p9learner-{suffix}@example.com"
    pw = "P9LearnerTest123!"
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'P9', 'Learner', 'student', TRUE, TRUE)
            RETURNING id
            """,
            (email, PWD.hash(pw)),
        )
        user_id = str(cur.fetchone()[0])
    yield {"user_id": user_id, "email": email}
    with _conn() as c, c.cursor() as cur:
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        except Exception:
            pass


def _hdr(t):
    return {"Authorization": f"Bearer {t}"}


# ---------------------------------------------------------------------------
# Cohorts (9.1)
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def cohort(admin):
    slug = f"p9-{uuid.uuid4().hex[:6]}"
    r = httpx.post(
        f"{API_BASE}/api/v1/cohorts",
        headers=_hdr(admin["token"]),
        json={
            "slug": slug,
            "name": "Phase 9 test cohort",
            "description": "Test cohort for Phase 9",
            "target_skill_codes": ["STEP1.CARD.HF", "STEP1.PHARM"],
            "target_mastery": 0.85,
            "min_weekly_attempts": 10,
        },
        timeout=10,
    )
    assert r.status_code == 201, r.text
    return r.json()


@pytest.mark.integration
def test_create_cohort(admin, cohort):
    assert cohort["target_skill_codes"] == ["STEP1.CARD.HF", "STEP1.PHARM"]
    assert float(cohort["target_mastery"]) == 0.85
    assert cohort["status"] == "planning"


@pytest.mark.integration
def test_duplicate_slug_409(admin, cohort):
    r = httpx.post(
        f"{API_BASE}/api/v1/cohorts",
        headers=_hdr(admin["token"]),
        json={"slug": cohort["slug"], "name": "dup"},
        timeout=10,
    )
    assert r.status_code == 409, r.text


@pytest.mark.integration
def test_add_and_list_members(admin, cohort, learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/cohorts/{cohort['id']}/members",
        headers=_hdr(admin["token"]),
        json={"user_id": learner["user_id"], "role": "learner"},
        timeout=10,
    )
    assert r.status_code == 201, r.text

    list_r = httpx.get(
        f"{API_BASE}/api/v1/cohorts/{cohort['id']}/members",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert list_r.status_code == 200
    members = list_r.json()
    assert any(m["user_id"] == learner["user_id"] for m in members)


@pytest.mark.integration
def test_remove_member_sets_left_at(admin, cohort, learner):
    r = httpx.delete(
        f"{API_BASE}/api/v1/cohorts/{cohort['id']}/members/{learner['user_id']}",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert r.status_code == 204
    # Re-list should now be empty for this learner
    list_r = httpx.get(
        f"{API_BASE}/api/v1/cohorts/{cohort['id']}/members",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    ids = {m["user_id"] for m in list_r.json()}
    assert learner["user_id"] not in ids


# ---------------------------------------------------------------------------
# Analytics + at-risk (9.3)
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_cohort_analytics_shape(admin, cohort):
    r = httpx.get(
        f"{API_BASE}/api/v1/cohorts/{cohort['id']}/analytics",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert r.status_code == 200
    body = r.json()
    for key in ("name", "n_learners", "n_active_learners_7d",
                "target_skill_codes", "target_mastery_threshold",
                "per_skill", "mocks_summary", "attempts_total",
                "attempts_last_7d"):
        assert key in body


@pytest.mark.integration
def test_at_risk_flags_inactive_learner(admin, cohort, learner):
    # Re-add learner so they show up in at-risk
    httpx.post(
        f"{API_BASE}/api/v1/cohorts/{cohort['id']}/members",
        headers=_hdr(admin["token"]),
        json={"user_id": learner["user_id"], "role": "learner"},
        timeout=10,
    )
    r = httpx.get(
        f"{API_BASE}/api/v1/cohorts/{cohort['id']}/at-risk",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    rows = r.json()
    assert rows, "should have at least one learner ranked"
    me = next(r for r in rows if r["user_id"] == learner["user_id"])
    assert me["at_risk"] is True
    assert me["score_mastery"] == 0.0
    assert any("target skills at threshold" in n for n in me["notes"])


# ---------------------------------------------------------------------------
# SSO (9.4) — config CRUD only (full OIDC flow needs an IdP)
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_sso_config_crud(admin):
    r = httpx.post(
        f"{API_BASE}/api/v1/sso/configs",
        headers=_hdr(admin["token"]),
        json={
            "name": "test-oidc",
            "protocol": "oidc",
            "issuer": "https://idp.example.com",
            "discovery_url": "https://idp.example.com/.well-known/openid-configuration",
            "client_id": "test-client",
            "client_secret": "test-secret",
            "attribute_mapping": {"email": "email"},
        },
        timeout=10,
    )
    assert r.status_code == 201, r.text
    cfg = r.json()
    assert cfg["protocol"] == "oidc"
    assert cfg["client_id"] == "test-client"
    # client_secret must NEVER appear in the response (it's encrypted)
    assert "client_secret" not in cfg
    assert "client_secret_encrypted" not in cfg


# ---------------------------------------------------------------------------
# LTI 1.3 (9.2)
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_lti_jwks_publishes_valid_rsa_key():
    """Public endpoint — anyone (no auth) can fetch our JWKS."""
    r = httpx.get(f"{API_BASE}/api/v1/lti/.well-known/jwks.json", timeout=10)
    assert r.status_code == 200, r.text
    body = r.json()
    assert "keys" in body
    assert body["keys"], "must have at least one key"
    key = body["keys"][0]
    assert key["kty"] == "RSA"
    assert key["alg"] == "RS256"
    assert key["use"] == "sig"

    # Verify the modulus is 2048 bits
    import base64
    n_bytes = base64.urlsafe_b64decode(key["n"] + "==")
    assert len(n_bytes) == 256, f"expected 2048-bit RSA modulus; got {len(n_bytes) * 8} bits"


@pytest.mark.integration
def test_lti_register_platform_409_on_dup(admin):
    payload = {
        "issuer": f"https://canvas.example.edu/{uuid.uuid4().hex[:6]}",
        "client_id": "canvas-eureka-tool",
        "deployment_id": "1",
        "auth_login_url": "https://canvas.example.edu/api/lti/authorize_redirect",
        "auth_token_url": "https://canvas.example.edu/login/oauth2/token",
        "jwks_url": "https://canvas.example.edu/api/lti/security/jwks",
    }
    r = httpx.post(
        f"{API_BASE}/api/v1/lti/platforms",
        headers=_hdr(admin["token"]),
        json=payload,
        timeout=10,
    )
    assert r.status_code == 201

    # Duplicate registration: same iss/client_id/deployment → 409
    r2 = httpx.post(
        f"{API_BASE}/api/v1/lti/platforms",
        headers=_hdr(admin["token"]),
        json=payload,
        timeout=10,
    )
    assert r2.status_code == 409


@pytest.mark.integration
def test_non_admin_cannot_create_cohort():
    """Cross-role check: a learner role cannot create cohorts."""
    suffix = uuid.uuid4().hex[:8]
    email = f"snoop-{suffix}@example.com"
    pw = "SnoopTest123!"
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'S', 'X', 'student', TRUE, TRUE)
            RETURNING id
            """,
            (email, PWD.hash(pw)),
        )
        user_id = str(cur.fetchone()[0])
    try:
        tok = httpx.post(
            f"{API_BASE}/api/v1/auth/login",
            json={"email": email, "password": pw},
            timeout=10,
        ).json()["access_token"]
        r = httpx.post(
            f"{API_BASE}/api/v1/cohorts",
            headers=_hdr(tok),
            json={"slug": f"snoop-{suffix}", "name": "should-fail"},
            timeout=10,
        )
        assert r.status_code == 403
    finally:
        with _conn() as c, c.cursor() as cur:
            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))

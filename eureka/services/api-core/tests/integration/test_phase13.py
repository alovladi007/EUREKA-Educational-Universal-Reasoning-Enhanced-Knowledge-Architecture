"""
Integration tests for Phase 13 (platform integrations + extensibility).

Exercises:
  - 13.1 API key mint, list, revoke
  - 13.2 webhook CRUD + test fire + delivery outcome + retry math
  - 13.3 embed token mint + JWT verify + revoke
  - 13.4 OAuth app register + admin approve + public read
  - 13.5 GDPR export with selectable sections, deletion-request + cancel,
         audit log captures all of the above
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


def _hdr(t):
    return {"Authorization": f"Bearer {t}"}


def _mk_user(email: str, pw: str, role: str = "student") -> tuple[str, str]:
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'P13', 'U', %s, TRUE, TRUE)
            RETURNING id
            """,
            (email, PWD.hash(pw), role),
        )
        uid = str(cur.fetchone()[0])
    tok = httpx.post(
        f"{API_BASE}/api/v1/auth/login",
        json={"email": email, "password": pw},
        timeout=10,
    ).json()["access_token"]
    return uid, tok


@pytest.fixture(scope="module")
def admin():
    suffix = uuid.uuid4().hex[:8]
    uid, tok = _mk_user(f"p13adm-{suffix}@example.com", "P13AdminTest123!", "org_admin")
    yield {"user_id": uid, "token": tok}
    with _conn() as c, c.cursor() as cur:
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (uid,))
        except Exception:
            pass


@pytest.fixture(scope="module")
def learner():
    suffix = uuid.uuid4().hex[:8]
    uid, tok = _mk_user(f"p13u-{suffix}@example.com", "P13UserTest123!", "student")
    yield {"user_id": uid, "token": tok}
    with _conn() as c, c.cursor() as cur:
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (uid,))
        except Exception:
            pass


# ---------------------------------------------------------------------------
# 13.1 API keys
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_api_key_mint_returns_presented_token_once(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/api-keys",
        headers=_hdr(learner["token"]),
        json={"name": "Test key", "scopes": ["read:profile"], "rate_limit_per_min": 60},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["key_id"].startswith("eur_pk_")
    assert body["presented_token"].startswith(body["key_id"] + ".")
    assert body["status"] == "active"


@pytest.mark.integration
def test_revoke_api_key(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/api-keys",
        headers=_hdr(learner["token"]),
        json={"name": "Doomed key"},
        timeout=10,
    )
    kid = r.json()["id"]
    rev = httpx.post(
        f"{API_BASE}/api/v1/me/api-keys/{kid}/revoke",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert rev.status_code == 200
    assert rev.json()["status"] == "revoked"


@pytest.mark.integration
def test_org_owned_requires_admin(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/api-keys",
        headers=_hdr(learner["token"]),
        json={"name": "Org key attempt", "org_owned": True},
        timeout=10,
    )
    assert r.status_code == 403


# ---------------------------------------------------------------------------
# 13.2 Webhooks
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def webhook(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/webhooks",
        headers=_hdr(learner["token"]),
        json={"name": "Test webhook",
              "url": "https://example.test/hook",
              "subscribed_events": ["*"]},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    return r.json()


@pytest.mark.integration
def test_webhook_create_returns_secret_once(webhook):
    assert "signing_secret" in webhook
    assert len(webhook["signing_secret"]) >= 20
    assert webhook["is_active"] is True


@pytest.mark.integration
def test_webhook_test_and_outcome(admin, webhook):
    test_r = httpx.post(
        f"{API_BASE}/api/v1/admin/webhooks/{webhook['id']}/test",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert test_r.status_code == 200, test_r.text
    deliveries = test_r.json()
    assert len(deliveries) == 1
    delivery_id = deliveries[0]["id"]
    assert deliveries[0]["status"] == "queued"

    # Record success outcome
    out_r = httpx.post(
        f"{API_BASE}/api/v1/admin/webhooks/deliveries/{delivery_id}/outcome",
        headers=_hdr(admin["token"]),
        json={"success": True, "status_code": 200},
        timeout=10,
    )
    assert out_r.status_code == 200
    assert out_r.json()["status"] == "delivered"
    assert out_r.json()["delivered_at"] is not None


@pytest.mark.integration
def test_webhook_failure_schedules_retry(admin, webhook):
    test_r = httpx.post(
        f"{API_BASE}/api/v1/admin/webhooks/{webhook['id']}/test",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    delivery_id = test_r.json()[0]["id"]
    out_r = httpx.post(
        f"{API_BASE}/api/v1/admin/webhooks/deliveries/{delivery_id}/outcome",
        headers=_hdr(admin["token"]),
        json={"success": False, "status_code": 500, "body_excerpt": "remote 500"},
        timeout=10,
    )
    assert out_r.status_code == 200
    body = out_r.json()
    assert body["status"] == "failed"
    assert body["next_retry_at"] is not None
    assert body["attempt_n"] == 1


# ---------------------------------------------------------------------------
# 13.3 Embed SDK
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_embed_token_roundtrip(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/embed-tokens",
        headers=_hdr(learner["token"]),
        json={"widget_kind": "leaderboard",
              "params": {"limit": 10},
              "allowed_origins": ["https://partner.edu"],
              "ttl_minutes": 30},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    token = r.json()["token"]

    v = httpx.post(f"{API_BASE}/api/v1/embed/verify?token={token}", timeout=10)
    assert v.status_code == 200
    claims = v.json()["claims"]
    assert claims["widget"] == "leaderboard"
    assert claims["origins"] == ["https://partner.edu"]


@pytest.mark.integration
def test_embed_token_invalid_token_401():
    r = httpx.post(
        f"{API_BASE}/api/v1/embed/verify?token=not.a.real.jwt",
        timeout=10,
    )
    assert r.status_code == 401


# ---------------------------------------------------------------------------
# 13.4 OAuth apps
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def oauth_app(learner, admin):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/oauth-apps",
        headers=_hdr(learner["token"]),
        json={"name": "Partner app",
              "description": "test",
              "redirect_uris": ["https://partner.test/oauth/callback"],
              "allowed_scopes": ["read:profile", "read:attempts"]},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    app = r.json()
    assert app["status"] == "pending"
    assert app["client_id"].startswith("eur_app_")
    assert "client_secret" in app

    # Admin approves so public lookup can find it.
    appr = httpx.post(
        f"{API_BASE}/api/v1/admin/oauth-apps/{app['id']}/review",
        headers=_hdr(admin["token"]),
        json={"action": "approve"},
        timeout=10,
    )
    assert appr.status_code == 200
    return appr.json()


@pytest.mark.integration
def test_oauth_app_approved_appears_public(oauth_app):
    r = httpx.get(
        f"{API_BASE}/api/v1/oauth-apps/{oauth_app['client_id']}/public",
        timeout=10,
    )
    assert r.status_code == 200
    assert r.json()["status"] == "approved"
    assert r.json()["name"] == "Partner app"


@pytest.mark.integration
def test_oauth_pending_app_not_public(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/oauth-apps",
        headers=_hdr(learner["token"]),
        json={"name": "Unapproved",
              "redirect_uris": ["https://x.test/cb"],
              "allowed_scopes": ["read:profile"]},
        timeout=10,
    )
    cid = r.json()["client_id"]
    pub = httpx.get(f"{API_BASE}/api/v1/oauth-apps/{cid}/public", timeout=10)
    assert pub.status_code == 404


# ---------------------------------------------------------------------------
# 13.5 Compliance — export, deletion, audit
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_export_with_selected_sections(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/compliance/export",
        headers=_hdr(learner["token"]),
        json={"sections": ["profile", "attempts", "engagement"]},
        timeout=20,
    )
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["status"] == "ready"
    payload = body["payload_jsonb"]
    assert "sections" in payload
    assert set(payload["sections"].keys()) == {"profile", "attempts", "engagement"}


@pytest.mark.integration
def test_deletion_request_and_cancel(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/compliance/delete",
        headers=_hdr(learner["token"]),
        json={"reason": "leaving", "days_until_execution": 14},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    d = r.json()
    assert d["status"] == "scheduled"
    assert d["scheduled_for"]

    # double-request → 409
    dup = httpx.post(
        f"{API_BASE}/api/v1/me/compliance/delete",
        headers=_hdr(learner["token"]),
        json={"reason": "again"},
        timeout=10,
    )
    assert dup.status_code == 409

    # cancel
    cancel = httpx.post(
        f"{API_BASE}/api/v1/me/compliance/delete/{d['id']}/cancel?reason=changed-mind",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert cancel.status_code == 200
    assert cancel.json()["status"] == "canceled"


@pytest.mark.integration
def test_audit_log_captures_create_and_revoke(admin):
    r = httpx.get(
        f"{API_BASE}/api/v1/admin/audit?limit=100",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    events = r.json()
    names = {e["event_name"] for e in events}
    # Each prior test in this module emits at least one audit event.
    assert "api_key.create" in names
    assert "api_key.revoke" in names
    assert "compliance.export.request" in names
    assert "compliance.delete.request" in names

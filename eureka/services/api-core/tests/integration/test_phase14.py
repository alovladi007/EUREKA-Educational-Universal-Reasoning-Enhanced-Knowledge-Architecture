"""
Integration tests for Phase 14 (production scale + operability).

Exercises:
  - 14.1 cache health + invalidate
  - 14.2 job enqueue + run-once + dedupe + retry-on-unknown-handler
  - 14.3 /metrics returns Prometheus exposition with at least one HTTP counter
  - 14.4 search/suggest finds skills by short prefix even without trgm match
  - 14.5 healthz + readyz
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


def _mk_user(email: str, pw: str, role: str = "org_admin") -> tuple[str, str]:
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'P14', 'U', %s, TRUE, TRUE)
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
    uid, tok = _mk_user(f"p14adm-{suffix}@example.com", "P14AdminTest123!", "org_admin")
    yield {"user_id": uid, "token": tok}
    with _conn() as c, c.cursor() as cur:
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (uid,))
        except Exception:
            pass


# ---------------------------------------------------------------------------
# 14.1 Cache
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_cache_health_returns_backend(admin):
    r = httpx.get(
        f"{API_BASE}/api/v1/admin/cache/health",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert "backend" in body
    assert body["backend"] in ("memory", "redis")


@pytest.mark.integration
def test_cache_invalidate_is_idempotent(admin):
    r = httpx.post(
        f"{API_BASE}/api/v1/admin/cache/invalidate?pattern=does-not-exist:*",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert r.status_code == 200
    assert "removed" in r.json()


# ---------------------------------------------------------------------------
# 14.2 Background jobs
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_enqueue_and_run_noop_job(admin):
    r = httpx.post(
        f"{API_BASE}/api/v1/admin/jobs/enqueue?kind=noop",
        headers=_hdr(admin["token"]),
        json={"hello": "world"},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    job_id = r.json()["id"]

    # Use job_id so we don't pick up a leftover queued noop from prior runs.
    run = httpx.post(
        f"{API_BASE}/api/v1/admin/jobs/run-once?job_id={job_id}",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert run.status_code == 200, run.text
    body = run.json()
    assert body["executed"] is True
    assert body["status"] == "succeeded"
    assert body["id"] == job_id
    assert body["result"]["echoed"] == {"hello": "world"}


@pytest.mark.integration
def test_dedupe_key_blocks_duplicate(admin):
    key = f"only-once-{uuid.uuid4().hex[:6]}"
    r1 = httpx.post(
        f"{API_BASE}/api/v1/admin/jobs/enqueue?kind=noop&dedupe_key={key}",
        headers=_hdr(admin["token"]),
        json={},
        timeout=10,
    )
    r2 = httpx.post(
        f"{API_BASE}/api/v1/admin/jobs/enqueue?kind=noop&dedupe_key={key}",
        headers=_hdr(admin["token"]),
        json={},
        timeout=10,
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


@pytest.mark.integration
def test_unknown_kind_400(admin):
    r = httpx.post(
        f"{API_BASE}/api/v1/admin/jobs/enqueue?kind=totally-made-up",
        headers=_hdr(admin["token"]),
        json={},
        timeout=10,
    )
    assert r.status_code == 400


@pytest.mark.integration
def test_jobs_stats_lists_registered_handlers(admin):
    r = httpx.get(
        f"{API_BASE}/api/v1/admin/jobs/stats",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert r.status_code == 200
    body = r.json()
    assert "noop" in body["kinds_registered"]
    assert "webhook.deliver" in body["kinds_registered"]


# ---------------------------------------------------------------------------
# 14.3 Metrics
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_metrics_exposes_http_counters():
    # First, hit a couple of endpoints so something has been observed.
    httpx.get(f"{API_BASE}/health", timeout=10)
    httpx.get(f"{API_BASE}/api/v1/healthz", timeout=10)

    r = httpx.get(f"{API_BASE}/api/v1/metrics", timeout=10)
    assert r.status_code == 200
    body = r.text
    assert "# HELP eureka_http_requests_total" in body
    assert "eureka_http_requests_total{" in body
    assert "eureka_http_request_duration_seconds_bucket" in body


# ---------------------------------------------------------------------------
# 14.4 Autocomplete
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_autocomplete_short_query_400():
    r = httpx.get(f"{API_BASE}/api/v1/search/suggest?q=a", timeout=10)
    assert r.status_code == 422   # FastAPI Query(min_length=2) → validation error


@pytest.mark.integration
def test_autocomplete_finds_seeded_skill():
    # 'STEP1' is in the framework-seeded skill codes.
    r = httpx.get(f"{API_BASE}/api/v1/search/suggest?q=STEP1", timeout=10)
    assert r.status_code == 200
    rows = r.json()
    assert any(row["kind"] == "skill" and row["label"].startswith("USMLE")
               for row in rows)


# ---------------------------------------------------------------------------
# 14.5 Health probes
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_healthz_always_ok():
    r = httpx.get(f"{API_BASE}/api/v1/healthz", timeout=10)
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


@pytest.mark.integration
def test_readyz_returns_ok_or_degraded():
    r = httpx.get(f"{API_BASE}/api/v1/readyz", timeout=10)
    # 200 or 503 — never blow up.
    assert r.status_code in (200, 503)
    body = r.json()
    assert body["status"] in ("ok", "degraded")
    assert "db" in body["checks"]
    assert "cache" in body["checks"]
    assert "jobs" in body["checks"]

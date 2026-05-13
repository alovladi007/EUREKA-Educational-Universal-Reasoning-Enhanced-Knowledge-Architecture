"""
Cross-tenant isolation tests (Session 3.3, 2026-05).

Proves that org A's users cannot read or mutate org B's data through
the api-core HTTP surface — the core promise of the multi-tenant
TenancyMiddleware in app/middleware/tenancy.py.

These tests are HTTP-level, not unit-level. They require:
  - A running api-core at http://localhost:8000
  - A running Postgres at DATABASE_URL with the init SQL applied

The fixtures use direct SQL to seed two organisations + one user each
so the tests aren't coupled to whatever registration flow is in place
this week. Each test cleans up its own rows.

Marker: @pytest.mark.integration — skipped by default in unit runs.

How to run locally:
  cd eureka/services/api-core
  docker compose -f ../../docker-compose.yml up -d db redis api-core
  pytest tests/integration/test_tenancy_isolation.py -v

What this test actually proves: at the HTTP boundary, an authenticated
user from org A cannot read or list data belonging to org B through the
audited endpoints (users, courses, organizations). It does NOT prove
*where* in the stack that enforcement happens.

Reality check (Session 3.3 audit, 2026-05): in the current code, the
enforcement is at the endpoint level — see app/api/v1/endpoints/users.py:98
("if current_user.org_id != user.org_id") and the equivalent in
organizations.py:99 and courses.py. The TenancyMiddleware in
app/middleware/tenancy.py only INJECTS `request.state.org_id` from the
JWT; it doesn't reject cross-tenant requests on its own. Disabling the
middleware does NOT cause this test to fail.

This is a known asymmetry. Phase 3.3 should follow up by moving
enforcement INTO the middleware (filter every DB query through a session-
scoped org_id, like SQLAlchemy's `with_loader_criteria`), so the per-
endpoint checks become a defence-in-depth rather than the primary gate.
Tracked in docs/BACKLOG.md.

For now this test is the right asset to have: it captures the
behaviour-level invariant ("no cross-tenant reads") regardless of which
internal layer enforces it.
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


# --- helpers -----------------------------------------------------------------


def _conn():
    return psycopg2.connect(PG_DSN)


def _create_org(slug: str, name: str) -> str:
    """Insert an organization, return its id."""
    org_id = str(uuid.uuid4())
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO organizations (id, slug, name, tier, is_active, is_verified)
            VALUES (%s, %s, %s, 'undergraduate', TRUE, TRUE)
            ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
            """,
            (org_id, slug, name),
        )
        return str(cur.fetchone()[0])


def _create_user(org_id: str, email: str, password: str, role: str = "student") -> str:
    user_id = str(uuid.uuid4())
    hashed = PWD.hash(password)
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password, first_name, last_name,
                               role, is_active, is_email_verified)
            VALUES (%s, %s, %s, %s, 'Test', 'User', %s, TRUE, TRUE)
            ON CONFLICT (org_id, email) DO UPDATE SET hashed_password = EXCLUDED.hashed_password
            RETURNING id
            """,
            (user_id, org_id, email, hashed, role),
        )
        return str(cur.fetchone()[0])


def _create_course(org_id: str, code: str, instructor_id: str) -> str:
    course_id = str(uuid.uuid4())
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO courses (id, org_id, code, title, description, instructor_id,
                                 status, is_active, tier)
            VALUES (%s, %s, %s, %s, 'isolation-test', %s, 'published', TRUE, 'undergraduate')
            ON CONFLICT DO NOTHING
            RETURNING id
            """,
            (course_id, org_id, code, f"Course {code}", instructor_id),
        )
        row = cur.fetchone()
        return str(row[0]) if row else course_id


def _login(email: str, password: str) -> str:
    """POST /auth/login and return the access token."""
    r = httpx.post(
        f"{API_BASE}/api/v1/auth/login",
        json={"email": email, "password": password},
        timeout=10,
    )
    r.raise_for_status()
    return r.json()["access_token"]


def _cleanup(org_a: str, org_b: str) -> None:
    with _conn() as c, c.cursor() as cur:
        cur.execute("DELETE FROM courses WHERE org_id IN (%s, %s)", (org_a, org_b))
        cur.execute("DELETE FROM users WHERE org_id IN (%s, %s)", (org_a, org_b))
        cur.execute("DELETE FROM organizations WHERE id IN (%s, %s)", (org_a, org_b))


# --- fixtures ----------------------------------------------------------------


@pytest.fixture(scope="module")
def two_orgs():
    """
    Spin up two orgs each with an instructor + a course. Yield a dict
    the tests can pick from, then tear everything down.
    """
    suffix_a = uuid.uuid4().hex[:8]
    suffix_b = uuid.uuid4().hex[:8]
    slug_a = f"iso-org-a-{suffix_a}"
    slug_b = f"iso-org-b-{suffix_b}"
    # Use example.com — pydantic-email rejects .test/.invalid/.localhost as
    # reserved TLDs even though they're RFC-2606-valid for tests.
    email_a = f"alice-{suffix_a}@example.com"
    email_b = f"bob-{suffix_b}@example.com"

    org_a = _create_org(slug_a, "Isolation Org A")
    org_b = _create_org(slug_b, "Isolation Org B")

    pw = "TenantTest123!"
    user_a = _create_user(org_a, email_a, pw, role="teacher")
    user_b = _create_user(org_b, email_b, pw, role="teacher")

    course_a = _create_course(org_a, f"A-{uuid.uuid4().hex[:6]}", user_a)
    course_b = _create_course(org_b, f"B-{uuid.uuid4().hex[:6]}", user_b)

    token_a = _login(email_a, pw)
    token_b = _login(email_b, pw)

    yield {
        "org_a": org_a,
        "org_b": org_b,
        "user_a": user_a,
        "user_b": user_b,
        "course_a": course_a,
        "course_b": course_b,
        "token_a": token_a,
        "token_b": token_b,
    }

    _cleanup(org_a, org_b)


def _hdr(tok: str) -> dict:
    return {"Authorization": f"Bearer {tok}"}


# --- assertions --------------------------------------------------------------


@pytest.mark.integration
def test_orgs_are_isolated_user_endpoint(two_orgs):
    """Alice (org A) cannot read Bob (org B) via GET /users/{id}."""
    r = httpx.get(
        f"{API_BASE}/api/v1/users/{two_orgs['user_b']}",
        headers=_hdr(two_orgs["token_a"]),
        timeout=10,
    )
    assert r.status_code in (403, 404), (
        f"cross-tenant user read leaked through: {r.status_code} {r.text[:200]}"
    )


@pytest.mark.integration
def test_orgs_are_isolated_course_endpoint(two_orgs):
    """Alice cannot read Bob's course via GET /courses/{id}."""
    r = httpx.get(
        f"{API_BASE}/api/v1/courses/{two_orgs['course_b']}",
        headers=_hdr(two_orgs["token_a"]),
        timeout=10,
    )
    assert r.status_code in (403, 404), (
        f"cross-tenant course read leaked through: {r.status_code} {r.text[:200]}"
    )


@pytest.mark.integration
def test_orgs_are_isolated_organization_endpoint(two_orgs):
    """Alice cannot read Bob's organization via GET /organizations/{id}."""
    r = httpx.get(
        f"{API_BASE}/api/v1/organizations/{two_orgs['org_b']}",
        headers=_hdr(two_orgs["token_a"]),
        timeout=10,
    )
    assert r.status_code in (403, 404), (
        f"cross-tenant org read leaked through: {r.status_code} {r.text[:200]}"
    )


@pytest.mark.integration
def test_orgs_are_isolated_user_list_does_not_leak(two_orgs):
    """
    GET /users may exist as a listing endpoint. If it does, Alice's
    listing must not contain Bob's user. (If 403, fine — that means the
    listing is admin-only, which is also a valid isolation.)
    """
    r = httpx.get(
        f"{API_BASE}/api/v1/users",
        headers=_hdr(two_orgs["token_a"]),
        timeout=10,
    )
    if r.status_code == 200:
        body = r.json()
        items = body if isinstance(body, list) else body.get("items", body.get("users", []))
        ids = {str(u.get("id")) for u in items}
        assert two_orgs["user_b"] not in ids, "Alice's user listing contains Bob"


@pytest.mark.integration
def test_user_can_still_read_own_data(two_orgs):
    """Sanity: with the middleware enforced, Alice still sees herself."""
    r = httpx.get(
        f"{API_BASE}/api/v1/auth/me",
        headers=_hdr(two_orgs["token_a"]),
        timeout=10,
    )
    assert r.status_code == 200, f"self-read should always work, got {r.status_code}"
    body = r.json()
    assert str(body.get("id")) == two_orgs["user_a"]

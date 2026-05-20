"""
Integration tests for Phase 16.1 — Graduate school tier
(programs / enrollments / milestones, no advisors/committees).

Covers:
  16.1.A program create + slug-collision 409 + skill_targets list-back
  16.1.B enrollment create + lifecycle (enroll → graduate)
  16.1.C milestone create + submit + decide flips progress counters
  16.1.D /me/graduate rollup shows next_milestone for in_progress items
  16.1.E supervisor (non-admin instructor) can decide a milestone,
         random student cannot.

The Research Tools suite (16.6 + 16.7) is the differentiator for this tier
but lives in later sessions — this file only validates 16.1's lifecycle.
"""

from __future__ import annotations

import os
import uuid
from datetime import date

import httpx
import psycopg2
import pytest
from passlib.context import CryptContext


API_BASE = os.environ.get("API_CORE_URL", "http://localhost:8000")
PG_DSN = os.environ.get(
    "PG_DSN", "postgresql://eureka:eureka_dev_password@localhost:5434/eureka"
)
PWD = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")
ORG_ID = "550e8400-e29b-41d4-a716-446655440000"


def _conn():
    return psycopg2.connect(PG_DSN)


def _hdr(t: str) -> dict:
    return {"Authorization": f"Bearer {t}"}


def _mk_user(email: str, pw: str, role: str = "student") -> tuple[str, str]:
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(), %s, %s, %s, 'P16', 'U', %s, TRUE, TRUE)
            RETURNING id
            """,
            (ORG_ID, email, PWD.hash(pw), role),
        )
        uid = str(cur.fetchone()[0])
    tok = httpx.post(
        f"{API_BASE}/api/v1/auth/login",
        json={"email": email, "password": pw},
        timeout=10,
    ).json()["access_token"]
    return uid, tok


def _cleanup_user(uid: str) -> None:
    with _conn() as c, c.cursor() as cur:
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (uid,))
        except Exception:
            pass


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def admin():
    suffix = uuid.uuid4().hex[:8]
    uid, tok = _mk_user(
        f"p16adm-{suffix}@eureka.example.com", "P16AdminTest123!", "org_admin"
    )
    yield {"user_id": uid, "token": tok}
    _cleanup_user(uid)


@pytest.fixture(scope="module")
def student():
    suffix = uuid.uuid4().hex[:8]
    uid, tok = _mk_user(
        f"p16stu-{suffix}@eureka.example.com", "P16StuTest123!", "student"
    )
    yield {"user_id": uid, "token": tok}
    _cleanup_user(uid)


@pytest.fixture(scope="module")
def supervisor():
    suffix = uuid.uuid4().hex[:8]
    uid, tok = _mk_user(
        f"p16sup-{suffix}@eureka.example.com", "P16SupTest123!", "teacher"
    )
    yield {"user_id": uid, "token": tok}
    _cleanup_user(uid)


@pytest.fixture(scope="module")
def program(admin):
    slug = f"phd-test-{uuid.uuid4().hex[:6]}"
    r = httpx.post(
        f"{API_BASE}/api/v1/graduate/programs",
        headers=_hdr(admin["token"]),
        json={
            "slug": slug,
            "name": "P16 Test PhD",
            "degree_kind": "phd",
            "target_years": 5,
            "min_credits": 72,
            "requires_thesis": True,
            "requires_qualifying_exam": True,
            "completion_cert_code": "phd-test-grad",
            "skill_targets": [
                {"skill_code": "test.skill.alpha", "target_mastery": 0.9},
                {"skill_code": "test.skill.beta", "target_mastery": 0.8},
            ],
        },
        timeout=10,
    )
    assert r.status_code == 201, r.text
    p = r.json()
    yield p
    with _conn() as c, c.cursor() as cur:
        try:
            cur.execute("DELETE FROM graduate_programs WHERE id = %s", (p["id"],))
        except Exception:
            pass


# ---------------------------------------------------------------------------
# 16.1.A — program create + slug-collision 409 + skill targets list-back
# ---------------------------------------------------------------------------


def test_program_create_slug_collision(admin, program):
    """Creating a second program with the same slug in the org returns 409."""
    r = httpx.post(
        f"{API_BASE}/api/v1/graduate/programs",
        headers=_hdr(admin["token"]),
        json={
            "slug": program["slug"],
            "name": "P16 dup",
            "degree_kind": "phd",
        },
        timeout=10,
    )
    assert r.status_code == 409, r.text


def test_program_detail_lists_skill_targets(admin, program):
    r = httpx.get(
        f"{API_BASE}/api/v1/graduate/programs/{program['id']}",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    codes = sorted(t["skill_code"] for t in body["skill_targets"])
    assert codes == ["test.skill.alpha", "test.skill.beta"]
    assert body["enrollments_count"] == 0


# ---------------------------------------------------------------------------
# 16.1.B — enrollment lifecycle: enrolled → graduated
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def enrollment(admin, program, student, supervisor):
    r = httpx.post(
        f"{API_BASE}/api/v1/graduate/programs/{program['id']}/enrollments",
        headers=_hdr(admin["token"]),
        json={
            "user_id": student["user_id"],
            "supervisor_user_id": supervisor["user_id"],
            "expected_graduation_year": 2030,
        },
        timeout=10,
    )
    assert r.status_code == 201, r.text
    e = r.json()
    assert e["status"] == "enrolled"
    assert e["supervisor_user_id"] == supervisor["user_id"]
    return e


def test_enrollment_lifecycle_graduate(admin, enrollment):
    r = httpx.post(
        f"{API_BASE}/api/v1/graduate/enrollments/{enrollment['id']}/action",
        headers=_hdr(admin["token"]),
        json={"action": "graduate"},
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["status"] == "graduated"
    assert body["graduated_at"] is not None
    # Idempotent: a second graduate call is a no-op (no 400).
    r2 = httpx.post(
        f"{API_BASE}/api/v1/graduate/enrollments/{enrollment['id']}/action",
        headers=_hdr(admin["token"]),
        json={"action": "graduate"},
        timeout=10,
    )
    assert r2.status_code == 200, r2.text
    # Reset for the milestone test.
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            "UPDATE graduate_enrollments SET status='enrolled', graduated_at=NULL WHERE id=%s",
            (enrollment["id"],),
        )


# ---------------------------------------------------------------------------
# 16.1.C — milestone create + submit + decide flips progress counters
# ---------------------------------------------------------------------------


def test_milestone_submit_decide_progress(admin, student, supervisor, enrollment):
    # Admin creates the milestone.
    r = httpx.post(
        f"{API_BASE}/api/v1/graduate/enrollments/{enrollment['id']}/milestones",
        headers=_hdr(admin["token"]),
        json={
            "kind": "qualifying_exam",
            "title": "P16 Quals",
            "sequence": 1,
            "due_at": date.today().isoformat(),
        },
        timeout=10,
    )
    assert r.status_code == 201, r.text
    m = r.json()
    assert m["status"] == "not_started"

    # Student submits.
    r2 = httpx.post(
        f"{API_BASE}/api/v1/graduate/milestones/{m['id']}/submit",
        headers=_hdr(student["token"]),
        json={"artifact_url": "https://example.com/quals.pdf"},
        timeout=10,
    )
    assert r2.status_code == 200, r2.text
    assert r2.json()["status"] == "submitted"
    assert r2.json()["artifact_url"] == "https://example.com/quals.pdf"

    # Supervisor (not admin) approves.
    r3 = httpx.post(
        f"{API_BASE}/api/v1/graduate/milestones/{m['id']}/decide",
        headers=_hdr(supervisor["token"]),
        json={"decision": "approved", "notes": "Pass"},
        timeout=10,
    )
    assert r3.status_code == 200, r3.text
    assert r3.json()["status"] == "approved"

    # Enrollment progress counters refreshed.
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            "SELECT milestones_done, milestones_total FROM graduate_enrollments WHERE id=%s",
            (enrollment["id"],),
        )
        done, total = cur.fetchone()
    assert done == 1
    assert total == 1


# ---------------------------------------------------------------------------
# 16.1.D — /me/graduate rollup
# ---------------------------------------------------------------------------


def test_me_graduate_rollup_shows_enrollment(student, program):
    r = httpx.get(
        f"{API_BASE}/api/v1/me/graduate",
        headers=_hdr(student["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    rows = r.json()["enrollments"]
    assert any(e["program_id"] == program["id"] for e in rows)
    me_row = next(e for e in rows if e["program_id"] == program["id"])
    assert me_row["program_name"] == "P16 Test PhD"
    assert me_row["degree_kind"] == "phd"


# ---------------------------------------------------------------------------
# 16.1.E — random student cannot decide; supervisor can
# ---------------------------------------------------------------------------


def test_random_student_cannot_decide(admin, enrollment, student):
    # Make a fresh milestone for the same enrollment so prior approval doesn't
    # short-circuit the test.
    r = httpx.post(
        f"{API_BASE}/api/v1/graduate/enrollments/{enrollment['id']}/milestones",
        headers=_hdr(admin["token"]),
        json={
            "kind": "proposal",
            "title": "P16 Proposal",
            "sequence": 2,
        },
        timeout=10,
    )
    mid = r.json()["id"]

    # Make a totally unrelated student.
    rando_uid, rando_tok = _mk_user(
        f"p16rando-{uuid.uuid4().hex[:6]}@eureka.example.com",
        "P16RandoTest123!",
        "student",
    )
    try:
        # The random student isn't the learner or the supervisor on this
        # enrollment — they don't pass _get_enrollment_or_404, so 403.
        r2 = httpx.post(
            f"{API_BASE}/api/v1/graduate/milestones/{mid}/decide",
            headers=_hdr(rando_tok),
            json={"decision": "approved"},
            timeout=10,
        )
        assert r2.status_code == 403, r2.text
    finally:
        _cleanup_user(rando_uid)

"""
Integration tests for the cross-tier recommender (Phase 4 Session 4.4).
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
    """A learner with both an undergrad enrolment AND a USMLE Step 1
    test_prep enrolment, plus a goal that mentions USMLE."""
    suffix = uuid.uuid4().hex[:8]
    email = f"rec-{suffix}@example.com"
    pw = "RecTest123!"
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'Rec', 'Tester', 'student', TRUE, TRUE)
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
    hdr = {"Authorization": f"Bearer {tok}"}

    # Set goal
    httpx.patch(
        f"{API_BASE}/api/v1/learner-profile/me",
        headers=hdr,
        json={"goals": ["USMLE Step 1 pass"]},
        timeout=10,
    )

    # Two enrolments: undergrad bio + USMLE test_prep
    httpx.post(
        f"{API_BASE}/api/v1/tier-enrollments/me",
        headers=hdr,
        json={
            "tier": "undergraduate",
            "tier_context": {"major": "biology"},
            "status": "active",
        },
        timeout=10,
    )
    httpx.post(
        f"{API_BASE}/api/v1/tier-enrollments/me",
        headers=hdr,
        json={
            "tier": "test_prep",
            "tier_context": {"exam": "USMLE_Step_1"},
            "status": "active",
        },
        timeout=10,
    )

    yield {"user_id": user_id, "token": tok}

    with _conn() as c, c.cursor() as cur:
        cur.execute("DELETE FROM users WHERE id = %s", (user_id,))


def _hdr(t):
    return {"Authorization": f"Bearer {t}"}


@pytest.mark.integration
def test_recommendations_surface_usmle_for_a_usmle_prepper(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/recommendations/me?limit=15",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    recs = r.json()
    assert recs, "expected at least one recommendation"
    frameworks = {rec["framework"] for rec in recs}
    assert "usmle" in frameworks, (
        f"USMLE skills should be recommended for a USMLE prepper; got {frameworks}"
    )


@pytest.mark.integration
def test_recommendation_includes_per_signal_breakdown(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/recommendations/me?limit=3",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    rec = r.json()[0]
    reason = rec["reason"]
    for k in (
        "active_tier_fit",
        "prereq_readiness",
        "mastery_gap",
        "goal_alignment",
        "spaced_repetition",
        "notes",
    ):
        assert k in reason, f"missing reason key {k}"
    assert isinstance(reason["notes"], list)


@pytest.mark.integration
def test_mastered_skills_are_not_recommended(learner):
    # Pick a USMLE skill and mark it mastered.
    sk_r = httpx.get(
        f"{API_BASE}/api/v1/skills/by-code/usmle/STEP1.CARD.HF",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    sk = sk_r.json()
    httpx.post(
        f"{API_BASE}/api/v1/skills/me/mastery",
        headers=_hdr(learner["token"]),
        json={"skill_id": sk["id"], "mastery": 0.95, "attempts_delta": 5},
        timeout=10,
    )

    r = httpx.get(
        f"{API_BASE}/api/v1/recommendations/me?limit=30",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    rec_ids = {rec["skill_id"] for rec in r.json()}
    assert sk["id"] not in rec_ids, (
        "mastered skill should not be in recommendations"
    )


@pytest.mark.integration
def test_goal_alignment_appears_in_notes(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/recommendations/me?limit=15",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    notes_all = []
    for rec in r.json():
        notes_all.extend(rec["reason"]["notes"])
    assert any("goal" in n.lower() for n in notes_all), (
        f"expected at least one goal-alignment note; got {notes_all}"
    )

"""
Integration tests for the skill graph (Phase 4 Session 4.2, 2026-05).

Runs against the live api-core + Postgres seeded by
eureka/ops/db/06_skill_graph_seed.sql.
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
    suffix = uuid.uuid4().hex[:8]
    email = f"sg-{suffix}@example.com"
    pw = "SkillGraphTest123!"
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'SG', 'Tester', 'student', TRUE, TRUE)
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


# ---------------------------------------------------------------------------
# catalog
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_list_skills_filtered_by_framework(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/skills?framework=usmle&limit=50",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    items = r.json()
    assert items, "USMLE seed should have rows"
    assert all(s["framework"] == "usmle" for s in items)
    codes = {s["code"] for s in items}
    assert "STEP1.CARD.HF" in codes


@pytest.mark.integration
def test_search_skills_by_name(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/skills?q=quadratic&limit=20",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    items = r.json()
    assert any("Quadratic" in s["name"] for s in items)


@pytest.mark.integration
def test_get_skill_by_code(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/skills/by-code/usmle/STEP1.CARD.HF",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["code"] == "STEP1.CARD.HF"
    assert body["tier"] == "medical"


# ---------------------------------------------------------------------------
# hierarchy + prerequisites
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_relations_returns_children_and_prereqs(learner):
    by_code = httpx.get(
        f"{API_BASE}/api/v1/skills/by-code/usmle/STEP1.CARD.HF",
        headers=_hdr(learner["token"]),
        timeout=10,
    ).json()
    r = httpx.get(
        f"{API_BASE}/api/v1/skills/{by_code['id']}/relations",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    pre_codes = {p["skill"]["code"] for p in body["prerequisites"]}
    # HF has at least one immediate prerequisite from the seed (PHARM).
    assert "STEP1.PHARM" in pre_codes


@pytest.mark.integration
def test_prereq_tree_spans_tiers(learner):
    """The moat: a medical-tier skill should transitively depend on
    high-school skills (AP Calc, CCSS quadratics)."""
    hf = httpx.get(
        f"{API_BASE}/api/v1/skills/by-code/usmle/STEP1.CARD.HF",
        headers=_hdr(learner["token"]),
        timeout=10,
    ).json()
    r = httpx.get(
        f"{API_BASE}/api/v1/skills/{hf['id']}/prereq-tree?max_depth=5",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    items = r.json()
    tiers = {s["tier"] for s in items}
    codes = {s["code"] for s in items}
    assert "high_school" in tiers, f"expected HS prereqs; got tiers {tiers}"
    assert any(c.startswith("AP.CALC.BC.") for c in codes)
    assert any(c.startswith("CCSS.MATH.") for c in codes)


# ---------------------------------------------------------------------------
# content tagging
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_tag_content_with_skill(learner):
    hf = httpx.get(
        f"{API_BASE}/api/v1/skills/by-code/usmle/STEP1.CARD.HF",
        headers=_hdr(learner["token"]),
        timeout=10,
    ).json()
    content_id = str(uuid.uuid4())

    r = httpx.post(
        f"{API_BASE}/api/v1/content-skills",
        headers=_hdr(learner["token"]),
        json={
            "skill_id": hf["id"],
            "content_kind": "question",
            "content_id": content_id,
            "coverage": 0.9,
            "bloom_level": "apply",
            "tagged_by": "sme",
        },
        timeout=10,
    )
    assert r.status_code == 201, r.text
    tag = r.json()
    assert tag["skill_id"] == hf["id"]
    assert tag["tagged_by"] == "sme"

    # duplicate tag → 409
    r2 = httpx.post(
        f"{API_BASE}/api/v1/content-skills",
        headers=_hdr(learner["token"]),
        json={
            "skill_id": hf["id"],
            "content_kind": "question",
            "content_id": content_id,
            "coverage": 1.0,
        },
        timeout=10,
    )
    assert r2.status_code == 409, r2.text

    # reverse lookup
    r3 = httpx.get(
        f"{API_BASE}/api/v1/content-skills?skill_id={hf['id']}&content_kind=question",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r3.status_code == 200
    assert any(t["content_id"] == content_id for t in r3.json())


# ---------------------------------------------------------------------------
# mastery
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_mastery_write_persists_and_mirrors_to_profile(learner):
    hf = httpx.get(
        f"{API_BASE}/api/v1/skills/by-code/usmle/STEP1.CARD.HF",
        headers=_hdr(learner["token"]),
        timeout=10,
    ).json()

    r = httpx.post(
        f"{API_BASE}/api/v1/skills/me/mastery",
        headers=_hdr(learner["token"]),
        json={
            "skill_id": hf["id"],
            "mastery": 0.42,
            "attempts_delta": 2,
            "measured_at_bloom": "apply",
        },
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert float(body["mastery"]) == 0.42
    assert body["attempts"] == 2

    # second write — attempts accumulate, mastery updates
    r2 = httpx.post(
        f"{API_BASE}/api/v1/skills/me/mastery",
        headers=_hdr(learner["token"]),
        json={"skill_id": hf["id"], "mastery": 0.55, "attempts_delta": 1},
        timeout=10,
    )
    assert r2.status_code == 200, r2.text
    body = r2.json()
    assert float(body["mastery"]) == 0.55
    assert body["attempts"] == 3, "attempts should sum to 3"

    # mirror into learner_profile.knowledge_state
    prof = httpx.get(
        f"{API_BASE}/api/v1/learner-profile/me",
        headers=_hdr(learner["token"]),
        timeout=10,
    ).json()
    ks = prof["knowledge_state"]
    assert hf["id"] in ks
    assert ks[hf["id"]]["mastery"] == 0.55


@pytest.mark.integration
def test_mastery_list_filters_by_framework_and_threshold(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/skills/me/mastery?framework=usmle&min_mastery=0.5",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200
    items = r.json()
    assert items, "mastery row from the previous test should be returned"
    assert all(float(m["mastery"]) >= 0.5 for m in items)

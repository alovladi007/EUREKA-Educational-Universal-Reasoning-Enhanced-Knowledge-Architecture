"""
Integration tests for Phase 7 (exam realism + analytics).

Exercises:
  - record attempt → IRT calibration → params on items
  - blueprint + mock attempt + score path
  - analytics aggregates
  - FSRS-lite spaced-repetition rating
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
    email = f"p7-{suffix}@example.com"
    pw = "P7Test123!"
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'P7', 'Test', 'student', TRUE, TRUE)
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
        cur.execute("UPDATE exam_blueprints SET created_by = NULL WHERE created_by = %s", (user_id,))
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        except Exception:
            pass


def _hdr(t):
    return {"Authorization": f"Bearer {t}"}


def _items_in_bank(token: str, bank_slug: str, limit: int = 6) -> list[dict]:
    return httpx.get(
        f"{API_BASE}/api/v1/item-banks/{bank_slug}/items?limit={limit}",
        headers=_hdr(token),
        timeout=10,
    ).json()


# ---------------------------------------------------------------------------
# Attempts + IRT
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_record_attempt_autogrades(learner):
    items = _items_in_bank(learner["token"], "usmle-step-1-cardio", limit=1)
    item = items[0]
    correct = item["content"]["correct_index"]

    # Submit the wrong answer
    wrong_idx = (correct + 1) % len(item["content"]["options"])
    r = httpx.post(
        f"{API_BASE}/api/v1/attempts",
        headers=_hdr(learner["token"]),
        json={"item_id": item["id"], "answer_index": wrong_idx, "time_taken_ms": 50000},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    assert r.json()["is_correct"] is False


@pytest.mark.integration
def test_irt_calibration_runs(learner):
    """At minimum, calibration returns a sane summary and writes params back."""
    # Generate a handful more attempts so calibration has data
    items = _items_in_bank(learner["token"], "usmle-step-1-cardio", limit=4)
    for item in items:
        # Half wrong, half right
        idx = item["content"]["correct_index"]
        if items.index(item) % 2:
            idx = (idx + 1) % len(item["content"]["options"])
        httpx.post(
            f"{API_BASE}/api/v1/attempts",
            headers=_hdr(learner["token"]),
            json={"item_id": item["id"], "answer_index": idx},
            timeout=10,
        )

    r = httpx.post(
        f"{API_BASE}/api/v1/irt/calibrate?min_attempts=1",
        headers=_hdr(learner["token"]),
        timeout=30,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["items_calibrated"] >= 1
    assert body["learners_with_theta"] >= 1
    assert body["iterations"] >= 1


# ---------------------------------------------------------------------------
# Blueprint + mock
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def blueprint(learner):
    """Create a small blueprint for the mock tests to use."""
    slug = f"p7-mock-{uuid.uuid4().hex[:6]}"
    r = httpx.post(
        f"{API_BASE}/api/v1/exam-blueprints",
        headers=_hdr(learner["token"]),
        json={
            "slug": slug,
            "name": "Phase 7 test blueprint",
            "description": "test only",
            "bank_slugs": ["usmle-step-1-cardio"],
            "skill_weights": [
                {"skill_code": "STEP1.CARD.HF", "weight": 0.5},
                {"skill_code": "STEP1.PHARM", "weight": 0.5},
            ],
            "item_count": 5,
            "time_limit_min": 10,
            "score_mapping": [
                {"theta": -2.0, "score": 150},
                {"theta": 0.0, "score": 210},
                {"theta": 2.0, "score": 270},
            ],
            "pass_threshold_scaled": 200,
        },
        timeout=10,
    )
    assert r.status_code == 201, r.text
    return r.json()


@pytest.mark.integration
def test_mock_start_creates_items(learner, blueprint):
    r = httpx.post(
        f"{API_BASE}/api/v1/mock-attempts?blueprint_slug={blueprint['slug']}",
        headers=_hdr(learner["token"]),
        timeout=15,
    )
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["status"] == "in_progress"

    items_r = httpx.get(
        f"{API_BASE}/api/v1/mock-attempts/{body['id']}/items",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert items_r.status_code == 200
    items = items_r.json()
    assert len(items) == 5
    # Correct index should be hidden until submitted
    for it in items:
        assert "correct_index" not in (it.get("content") or {})


@pytest.mark.integration
def test_mock_answer_and_submit_produces_scaled_score(learner, blueprint):
    start_r = httpx.post(
        f"{API_BASE}/api/v1/mock-attempts?blueprint_slug={blueprint['slug']}",
        headers=_hdr(learner["token"]),
        timeout=15,
    )
    attempt_id = start_r.json()["id"]
    items = httpx.get(
        f"{API_BASE}/api/v1/mock-attempts/{attempt_id}/items",
        headers=_hdr(learner["token"]),
        timeout=10,
    ).json()
    # Answer everything with index=2 (deterministic; some will hit, some won't)
    for it in items:
        a_r = httpx.post(
            f"{API_BASE}/api/v1/mock-attempts/{attempt_id}/answer",
            headers=_hdr(learner["token"]),
            json={"item_id": it["item_id"], "answer_index": 2, "time_taken_ms": 30000},
            timeout=10,
        )
        assert a_r.status_code == 200, a_r.text

    final = httpx.post(
        f"{API_BASE}/api/v1/mock-attempts/{attempt_id}/submit",
        headers=_hdr(learner["token"]),
        timeout=15,
    )
    assert final.status_code == 200, final.text
    body = final.json()
    assert body["status"] == "submitted"
    assert body["answered_count"] == 5
    assert body["scaled_score"] is not None
    assert body["predicted_pass"] is not None
    # Correct answers now visible
    items2 = httpx.get(
        f"{API_BASE}/api/v1/mock-attempts/{attempt_id}/items",
        headers=_hdr(learner["token"]),
        timeout=10,
    ).json()
    assert all("correct_index" in (it.get("content") or {}) for it in items2)


# ---------------------------------------------------------------------------
# Analytics
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_per_skill_analytics(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/analytics/me/skills",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    rows = r.json()
    assert rows, "expected at least one skill aggregate from prior attempts"
    for row in rows:
        assert "code" in row
        assert "correct_pct" in row
        assert 0 <= row["correct_pct"] <= 100


@pytest.mark.integration
def test_strengths_weaknesses(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/analytics/me/strengths-weaknesses?k=3",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert "strongest" in body and "weakest" in body


# ---------------------------------------------------------------------------
# Spaced repetition (7.5)
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_fsrs_rate_progressions(learner):
    skill_r = httpx.get(
        f"{API_BASE}/api/v1/skills/by-code/usmle/STEP1.CARD.HF",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    skill = skill_r.json()

    # rate "good" → interval grows
    g_r = httpx.post(
        f"{API_BASE}/api/v1/spaced-repetition/me/rate",
        headers=_hdr(learner["token"]),
        json={"skill_id": skill["id"], "rating": "good"},
        timeout=10,
    )
    assert g_r.status_code == 200, g_r.text
    good = g_r.json()
    assert good["new_interval_days"] > 0
    assert good["mastery_delta"] >= 0

    # rate "again" → interval shrinks, mastery dips
    a_r = httpx.post(
        f"{API_BASE}/api/v1/spaced-repetition/me/rate",
        headers=_hdr(learner["token"]),
        json={"skill_id": skill["id"], "rating": "again"},
        timeout=10,
    )
    assert a_r.status_code == 200
    again = a_r.json()
    assert again["new_interval_days"] < good["new_interval_days"]
    assert again["mastery_delta"] < 0


@pytest.mark.integration
def test_due_today_returns_list(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/spaced-repetition/me/due",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200
    assert isinstance(r.json(), list)

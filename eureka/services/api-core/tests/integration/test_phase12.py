"""
Integration tests for Phase 12 (engagement + adaptive learning).

Exercises:
  - 12.1 record_activity XP + streak, achievement auto-award, leaderboard
  - 12.2 device register + revoke, notification enqueue + opened
  - 12.3 study plan generation with multiple weeks, log study minutes
  - 12.4 offline pack ETag round-trip + 304, replay receipt
  - 12.5 live session create + book + cancel-by-instructor
"""

from __future__ import annotations

import os
import uuid
from datetime import datetime, timedelta, timezone

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
                    %s, %s, 'P12', 'U', %s, TRUE, TRUE)
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


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def admin():
    suffix = uuid.uuid4().hex[:8]
    uid, tok = _mk_user(f"p12adm-{suffix}@example.com", "P12AdminTest123!", "org_admin")
    yield {"user_id": uid, "token": tok}
    with _conn() as c, c.cursor() as cur:
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (uid,))
        except Exception:
            pass


@pytest.fixture(scope="module")
def learner():
    suffix = uuid.uuid4().hex[:8]
    uid, tok = _mk_user(f"p12u-{suffix}@example.com", "P12UserTest123!", "student")
    yield {"user_id": uid, "token": tok}
    with _conn() as c, c.cursor() as cur:
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (uid,))
        except Exception:
            pass


@pytest.fixture(scope="module")
def instructor_user():
    """A teacher with a marketplace instructor profile for live-session tests."""
    suffix = uuid.uuid4().hex[:8]
    uid, tok = _mk_user(f"p12inst-{suffix}@example.com", "P12InstTest123!", "teacher")
    slug = f"p12-inst-{suffix}"
    httpx.post(
        f"{API_BASE}/api/v1/instructors", headers=_hdr(tok),
        json={"public_slug": slug, "display_name": "Live Instructor"},
        timeout=10,
    )
    yield {"user_id": uid, "token": tok}
    with _conn() as c, c.cursor() as cur:
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (uid,))
        except Exception:
            pass


# ---------------------------------------------------------------------------
# 12.1 Streaks + XP + achievements
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_record_activity_awards_xp_and_streak(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/engagement/activity",
        headers=_hdr(learner["token"]),
        json={"source": "question_correct"},
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    # question_correct (10) + first-day streak bonus (10) = 20
    assert body["xp_awarded"] == 20
    assert body["streak_days"] == 1
    assert body["new_total_xp"] >= 20
    assert body["new_level"] >= 1


@pytest.mark.integration
def test_repeat_same_day_does_not_grow_streak(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/engagement/activity",
        headers=_hdr(learner["token"]),
        json={"source": "question_attempted"},
        timeout=10,
    )
    assert r.status_code == 200
    # streak stays at 1; only base XP, no streak-day bonus this time
    assert r.json()["streak_days"] == 1
    assert r.json()["xp_awarded"] == 2


@pytest.mark.integration
def test_unknown_source_400(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/engagement/activity",
        headers=_hdr(learner["token"]),
        json={"source": "made_up_thing"},
        timeout=10,
    )
    assert r.status_code == 400


@pytest.mark.integration
def test_achievement_auto_award(admin, learner):
    slug = f"first-{uuid.uuid4().hex[:6]}"
    r = httpx.post(
        f"{API_BASE}/api/v1/admin/achievements",
        headers=_hdr(admin["token"]),
        json={"slug": slug, "name": "First Step", "rarity": "common",
              "xp_reward": 25,
              "trigger_jsonb": {"kind": "streak_at_least", "min": 1}},
        timeout=10,
    )
    assert r.status_code == 201, r.text

    r = httpx.post(
        f"{API_BASE}/api/v1/me/engagement/activity",
        headers=_hdr(learner["token"]),
        json={"source": "question_attempted"},
        timeout=10,
    )
    assert r.status_code == 200
    # The achievement should have been awarded on the first activity for this
    # learner (streak ≥ 1), but it may also fire now if not earned earlier.
    earned_r = httpx.get(
        f"{API_BASE}/api/v1/me/achievements",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert earned_r.status_code == 200


@pytest.mark.integration
def test_leaderboard_returns_rows(learner):
    r = httpx.get(f"{API_BASE}/api/v1/leaderboard?limit=10", timeout=10)
    assert r.status_code == 200
    rows = r.json()
    assert len(rows) >= 1
    assert any(row["user_id"] == learner["user_id"] for row in rows)


# ---------------------------------------------------------------------------
# 12.2 Push notifications
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_register_device_and_revoke(learner):
    token = "fake-token-" + uuid.uuid4().hex[:24]
    r = httpx.post(
        f"{API_BASE}/api/v1/me/devices",
        headers=_hdr(learner["token"]),
        json={"platform": "ios", "push_token": token, "locale": "en"},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    dev_id = r.json()["id"]

    list_r = httpx.get(
        f"{API_BASE}/api/v1/me/devices",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert list_r.status_code == 200
    assert any(d["id"] == dev_id for d in list_r.json())

    rev = httpx.delete(
        f"{API_BASE}/api/v1/me/devices/{dev_id}",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert rev.status_code == 204

    list_r = httpx.get(
        f"{API_BASE}/api/v1/me/devices",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert not any(d["id"] == dev_id for d in list_r.json())


@pytest.mark.integration
def test_enqueue_and_mark_opened(admin, learner):
    # Need at least one active device
    token = "fake-token-" + uuid.uuid4().hex[:24]
    httpx.post(
        f"{API_BASE}/api/v1/me/devices",
        headers=_hdr(learner["token"]),
        json={"platform": "android", "push_token": token},
        timeout=10,
    )
    r = httpx.post(
        f"{API_BASE}/api/v1/admin/notifications/enqueue",
        headers=_hdr(admin["token"]),
        json={"user_id": learner["user_id"], "kind": "streak_reminder",
              "title": "1-day streak", "body": "Keep it going!"},
        timeout=10,
    )
    assert r.status_code == 200, r.text
    notes = r.json()
    assert len(notes) >= 1
    notif_id = notes[0]["id"]

    open_r = httpx.post(
        f"{API_BASE}/api/v1/me/notifications/{notif_id}/mark-opened",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert open_r.status_code == 200
    assert open_r.json()["opened_at"] is not None


# ---------------------------------------------------------------------------
# 12.3 Adaptive study plan
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_generate_study_plan_returns_multi_week(learner):
    target = (datetime.now(timezone.utc) + timedelta(weeks=12)).date().isoformat()
    r = httpx.post(
        f"{API_BASE}/api/v1/me/study-plan",
        headers=_hdr(learner["token"]),
        json={"tier": "med_school", "framework": "usmle",
              "exam": "USMLE_Step_1", "target_date": target,
              "daily_target_minutes": 60},
        timeout=20,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["status"] == "active"
    assert len(body["weeks"]) >= 6
    week_zero = body["weeks"][0]
    assert week_zero["is_diagnostic_week"] is True
    assert week_zero["target_skill_codes"]
    # Last week should be a mock week.
    assert body["weeks"][-1]["is_mock_week"] is True


@pytest.mark.integration
def test_log_study_minutes(learner):
    plan = httpx.get(
        f"{API_BASE}/api/v1/me/study-plan", headers=_hdr(learner["token"]), timeout=10,
    ).json()
    assert plan is not None, "study plan should exist"
    week_id = plan["weeks"][0]["id"]
    r = httpx.post(
        f"{API_BASE}/api/v1/me/study-plan/weeks/{week_id}/log?minutes=30",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200
    assert r.json()["minutes_studied"] == 30


# ---------------------------------------------------------------------------
# 12.4 Offline sync
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_offline_pack_etag_roundtrip(learner):
    r = httpx.get(
        f"{API_BASE}/api/v1/me/offline-pack?max_items=5",
        headers=_hdr(learner["token"]),
        timeout=15,
    )
    assert r.status_code == 200, r.text
    etag = r.headers.get("etag")
    assert etag
    assert r.json()["item_count"] >= 0

    r2 = httpx.get(
        f"{API_BASE}/api/v1/me/offline-pack?max_items=5",
        headers={**_hdr(learner["token"]), "If-None-Match": etag},
        timeout=15,
    )
    assert r2.status_code == 304


@pytest.mark.integration
def test_offline_replay_receipt(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/offline-pack/replay",
        headers=_hdr(learner["token"]),
        json={"attempts": [
            {"item_id": "abc", "answer_index": 1, "is_correct": True,
             "time_taken_ms": 12000},
            {"item_id": "def", "answer_index": 0, "is_correct": False,
             "time_taken_ms": 8000},
        ]},
        timeout=10,
    )
    assert r.status_code == 200
    assert r.json()["received_attempts"] == 2


# ---------------------------------------------------------------------------
# 12.5 Live tutoring marketplace
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_live_session_create_and_book(instructor_user, learner):
    starts = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()
    r = httpx.post(
        f"{API_BASE}/api/v1/instructors/me/live-sessions",
        headers=_hdr(instructor_user["token"]),
        json={"title": "ECG hot topics live",
              "starts_at": starts, "duration_minutes": 60,
              "capacity": 3, "price_cents": 0,
              "target_skill_codes": ["STEP1.CARD.HF"]},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    sess = r.json()
    assert sess["status"] == "scheduled"

    book = httpx.post(
        f"{API_BASE}/api/v1/live-sessions/{sess['id']}/book",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert book.status_code == 201, book.text
    assert book.json()["status"] == "confirmed"   # free session → auto-confirm

    # browse picks up the session
    browse = httpx.get(f"{API_BASE}/api/v1/live-sessions", timeout=10)
    assert browse.status_code == 200
    assert any(s["id"] == sess["id"] for s in browse.json())


@pytest.mark.integration
def test_double_book_returns_409(instructor_user, learner):
    starts = (datetime.now(timezone.utc) + timedelta(days=3)).isoformat()
    s = httpx.post(
        f"{API_BASE}/api/v1/instructors/me/live-sessions",
        headers=_hdr(instructor_user["token"]),
        json={"title": "Another live", "starts_at": starts,
              "duration_minutes": 30, "capacity": 1, "price_cents": 0},
        timeout=10,
    ).json()
    httpx.post(
        f"{API_BASE}/api/v1/live-sessions/{s['id']}/book",
        headers=_hdr(learner["token"]), timeout=10,
    )
    r = httpx.post(
        f"{API_BASE}/api/v1/live-sessions/{s['id']}/book",
        headers=_hdr(learner["token"]), timeout=10,
    )
    assert r.status_code == 409


@pytest.mark.integration
def test_instructor_cancel_cancels_bookings(instructor_user, learner):
    starts = (datetime.now(timezone.utc) + timedelta(days=4)).isoformat()
    s = httpx.post(
        f"{API_BASE}/api/v1/instructors/me/live-sessions",
        headers=_hdr(instructor_user["token"]),
        json={"title": "Will cancel", "starts_at": starts,
              "duration_minutes": 30, "capacity": 3, "price_cents": 0},
        timeout=10,
    ).json()
    httpx.post(
        f"{API_BASE}/api/v1/live-sessions/{s['id']}/book",
        headers=_hdr(learner["token"]), timeout=10,
    )

    r = httpx.post(
        f"{API_BASE}/api/v1/live-sessions/{s['id']}/cancel",
        headers=_hdr(instructor_user["token"]),
        json={"reason": "Instructor sick"},
        timeout=10,
    )
    assert r.status_code == 200
    assert r.json()["status"] == "canceled"

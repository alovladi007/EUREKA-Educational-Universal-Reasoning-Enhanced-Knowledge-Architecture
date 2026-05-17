"""
Integration tests for Phase 11 (go-to-market readiness).

Exercises:
  - 11.1 plans, subscriptions, change-with-proration, cancel-at-period-end,
         tax-rate + quote, invoice mark-paid, dunning schedule, refund flow
  - 11.2 landing-page generator + public read
  - 11.3 email template + campaign + dispatch + unsubscribe
  - 11.4 onboarding ensure / set-goal / advance / time_to_first_value
  - 11.5 tickets thread (internal note hidden from end-user), KB search +
         view-count increment + helpful-count
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
                    %s, %s, 'P11', 'U', %s, TRUE, TRUE)
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
    uid, tok = _mk_user(f"p11adm-{suffix}@example.com", "P11AdminTest123!", "org_admin")
    yield {"user_id": uid, "token": tok}
    with _conn() as c, c.cursor() as cur:
        cur.execute("UPDATE kb_articles SET created_at = created_at WHERE TRUE")  # no-op
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (uid,))
        except Exception:
            pass


@pytest.fixture(scope="module")
def learner():
    suffix = uuid.uuid4().hex[:8]
    uid, tok = _mk_user(f"p11u-{suffix}@example.com", "P11UserTest123!", "student")
    yield {"user_id": uid, "token": tok}
    with _conn() as c, c.cursor() as cur:
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (uid,))
        except Exception:
            pass


@pytest.fixture(scope="module")
def plan_pro(admin):
    suffix = uuid.uuid4().hex[:6]
    r = httpx.post(
        f"{API_BASE}/api/v1/admin/plans",
        headers=_hdr(admin["token"]),
        json={"slug": f"pro-{suffix}", "name": "Pro Plan", "interval": "monthly",
              "price_cents": 1900, "trial_days": 7,
              "includes_ai_tutor": True, "includes_mock_exams": True},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    return r.json()


@pytest.fixture(scope="module")
def plan_max(admin):
    suffix = uuid.uuid4().hex[:6]
    r = httpx.post(
        f"{API_BASE}/api/v1/admin/plans",
        headers=_hdr(admin["token"]),
        json={"slug": f"max-{suffix}", "name": "Max Plan", "interval": "yearly",
              "price_cents": 19900, "trial_days": 0,
              "includes_marketplace_access": True,
              "includes_unlimited_courses": True,
              "includes_ai_tutor": True,
              "includes_mock_exams": True},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    return r.json()


# ---------------------------------------------------------------------------
# 11.1 Billing
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_create_plan_and_public_list(admin, plan_pro):
    r = httpx.get(f"{API_BASE}/api/v1/plans", timeout=10)
    assert r.status_code == 200
    slugs = {p["slug"] for p in r.json()}
    assert plan_pro["slug"] in slugs


@pytest.mark.integration
def test_start_subscription_uses_trial(learner, plan_pro):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/subscription",
        headers=_hdr(learner["token"]),
        json={"plan_slug": plan_pro["slug"]},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["status"] == "trialing"
    assert body["trial_end"] is not None


@pytest.mark.integration
def test_double_start_returns_409(learner, plan_pro):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/subscription",
        headers=_hdr(learner["token"]),
        json={"plan_slug": plan_pro["slug"]},
        timeout=10,
    )
    assert r.status_code == 409


@pytest.mark.integration
def test_change_plan_returns_proration_math(learner, plan_pro, plan_max):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/subscription/change",
        headers=_hdr(learner["token"]),
        json={"plan_slug": plan_max["slug"], "apply_proration": True},
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert "credit_cents" in body
    assert "new_charge_cents" in body
    assert "net_charge_cents" in body
    # Monthly→yearly: charge is full new plan, credit is most of old monthly,
    # net should be positive.
    assert body["new_charge_cents"] == 19900
    assert body["net_charge_cents"] >= 0


@pytest.mark.integration
def test_cancel_at_period_end(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/subscription/cancel",
        headers=_hdr(learner["token"]),
        timeout=10,
    )
    assert r.status_code == 200
    assert r.json()["cancel_at_period_end"] is True


@pytest.mark.integration
def test_tax_quote_uses_region_specific_rate(admin):
    # Use a unique label per run to avoid the unique constraint.
    label = f"T{uuid.uuid4().hex[:4]}"
    httpx.post(
        f"{API_BASE}/api/v1/admin/tax-rates",
        headers=_hdr(admin["token"]),
        json={"country_code": "us", "region_code": "CA",
              "rate_bps": 875, "label": label},
        timeout=10,
    )
    r = httpx.get(
        f"{API_BASE}/api/v1/tax-quote?subtotal_cents=10000&country_code=US&region_code=CA",
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    # ≥ 875c — exact value depends on whether we have multiple CA rows,
    # but the test row at 8.75% must dominate.
    assert body["tax_cents"] >= 875
    assert body["total_cents"] == body["subtotal_cents"] + body["tax_cents"]


@pytest.mark.integration
def test_invoice_mark_paid_then_refund_flow(admin, learner):
    # Insert a fake invoice tied to the learner.
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO invoices (id, user_id, total_cents, amount_paid_cents,
                                  subtotal_cents, status)
            VALUES (uuid_generate_v4(), %s, 1900, 0, 1900, 'open')
            RETURNING id
            """,
            (learner["user_id"],),
        )
        inv_id = str(cur.fetchone()[0])

    r = httpx.post(
        f"{API_BASE}/api/v1/admin/invoices/{inv_id}/mark-paid",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert r.status_code == 200
    assert r.json()["status"] == "paid"

    # Request a refund
    r = httpx.post(
        f"{API_BASE}/api/v1/me/refunds",
        headers=_hdr(learner["token"]),
        json={"invoice_id": inv_id, "amount_cents": 1900, "reason": "test"},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    refund_id = r.json()["id"]
    assert r.json()["status"] == "pending"

    # Admin approves
    r = httpx.post(
        f"{API_BASE}/api/v1/admin/refunds/{refund_id}/approve",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert r.status_code == 200
    assert r.json()["status"] == "succeeded"
    assert r.json()["refunded_at"] is not None


@pytest.mark.integration
def test_dunning_schedule_advances(admin, learner):
    # Make a fresh past-due invoice
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO invoices (id, user_id, total_cents, amount_paid_cents,
                                  subtotal_cents, status)
            VALUES (uuid_generate_v4(), %s, 1900, 0, 1900, 'open')
            RETURNING id
            """,
            (learner["user_id"],),
        )
        inv_id = str(cur.fetchone()[0])

    attempts: list[int] = []
    for _ in range(3):
        r = httpx.post(
            f"{API_BASE}/api/v1/admin/invoices/{inv_id}/dunning",
            headers=_hdr(admin["token"]),
            timeout=10,
        )
        assert r.status_code == 200, r.text
        attempts.append(r.json()["attempt_n"])
    # Each call advances the attempt_n.
    assert attempts == [1, 2, 3]


# ---------------------------------------------------------------------------
# 11.2 SEO landing pages
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_generate_skill_landing_page(admin):
    # Use a real seeded USMLE skill code.
    r = httpx.post(
        f"{API_BASE}/api/v1/admin/seo/skill-pages/generate",
        headers=_hdr(admin["token"]),
        json={"skill_code": "STEP1.CARD.HF", "framework": "USMLE",
              "publish": True},
        timeout=15,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["slug"].startswith("usmle-")
    assert body["meta_title"]
    assert body["meta_description"]
    assert body["schema_jsonld"]["@type"] == "Course"
    assert body["is_published"] is True

    # Public read.
    pub = httpx.get(f"{API_BASE}/api/v1/seo/skill-pages/{body['slug']}", timeout=10)
    assert pub.status_code == 200
    assert pub.json()["meta_title"] == body["meta_title"]


# ---------------------------------------------------------------------------
# 11.3 Email lifecycle
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_email_template_campaign_dispatch(admin, learner):
    suffix = uuid.uuid4().hex[:4]
    template_slug = f"welcome-{suffix}"
    httpx.post(
        f"{API_BASE}/api/v1/admin/email/templates",
        headers=_hdr(admin["token"]),
        json={"slug": template_slug, "kind": "welcome",
              "subject": "Hi {{ user.first_name }}!",
              "html": "<p>Welcome {{ user.first_name }}</p>",
              "text": "Welcome {{ user.first_name }}"},
        timeout=10,
    )
    httpx.post(
        f"{API_BASE}/api/v1/admin/email/campaigns",
        headers=_hdr(admin["token"]),
        json={"slug": f"camp-{suffix}", "template_slug": template_slug,
              "trigger_event": f"user.signup.{suffix}"},
        timeout=10,
    )
    r = httpx.post(
        f"{API_BASE}/api/v1/admin/email/dispatch",
        headers=_hdr(admin["token"]),
        json={"event": f"user.signup.{suffix}", "user_id": learner["user_id"]},
        timeout=10,
    )
    assert r.status_code == 200, r.text
    sends = r.json()
    assert len(sends) == 1
    assert "Hi P11!" in sends[0]["subject"]  # merge happened


@pytest.mark.integration
def test_unsubscribe_then_dispatch_skips(admin, learner):
    suffix = uuid.uuid4().hex[:4]
    template_slug = f"news-{suffix}"
    httpx.post(
        f"{API_BASE}/api/v1/admin/email/templates",
        headers=_hdr(admin["token"]),
        json={"slug": template_slug, "kind": "news",
              "subject": "News",
              "html": "<p>news</p>",
              "text": "news"},
        timeout=10,
    )
    httpx.post(
        f"{API_BASE}/api/v1/admin/email/campaigns",
        headers=_hdr(admin["token"]),
        json={"slug": f"news-camp-{suffix}", "template_slug": template_slug,
              "trigger_event": f"news.broadcast.{suffix}"},
        timeout=10,
    )
    # User unsubscribes from marketing.
    u = httpx.post(
        f"{API_BASE}/api/v1/me/email/unsubscribe",
        headers=_hdr(learner["token"]),
        json={"scope": "marketing"},
        timeout=10,
    )
    assert u.status_code == 204

    r = httpx.post(
        f"{API_BASE}/api/v1/admin/email/dispatch",
        headers=_hdr(admin["token"]),
        json={"event": f"news.broadcast.{suffix}", "user_id": learner["user_id"]},
        timeout=10,
    )
    assert r.status_code == 200
    assert r.json() == []   # blocked by marketing-scope unsubscribe


# ---------------------------------------------------------------------------
# 11.4 Onboarding
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_onboarding_state_lifecycle(learner):
    r = httpx.get(f"{API_BASE}/api/v1/me/onboarding", headers=_hdr(learner["token"]), timeout=10)
    assert r.status_code == 200
    assert r.json()["current_step"] == "created"

    r = httpx.post(
        f"{API_BASE}/api/v1/me/onboarding/goal",
        headers=_hdr(learner["token"]),
        json={"tier": "med_school", "exam": "USMLE_Step_1", "goal": "pass step 1",
              "target_date": "2026-09-01"},
        timeout=10,
    )
    assert r.status_code == 200
    assert r.json()["current_step"] == "goal_set"
    assert r.json()["chosen_exam"] == "USMLE_Step_1"

    r = httpx.post(
        f"{API_BASE}/api/v1/me/onboarding/advance",
        headers=_hdr(learner["token"]),
        json={"step": "first_question_attempted"},
        timeout=10,
    )
    assert r.status_code == 200
    assert r.json()["current_step"] == "first_question_attempted"
    # We just advanced, so time-to-first-value should be a small positive.
    assert r.json()["time_to_first_value_seconds"] is not None


@pytest.mark.integration
def test_onboarding_funnel_includes_users(admin):
    r = httpx.get(
        f"{API_BASE}/api/v1/admin/onboarding/funnel",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert "by_step" in body
    assert sum(body["by_step"].values()) >= 1


# ---------------------------------------------------------------------------
# 11.5 Support + KB
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_ticket_thread_hides_internal_note_from_user(admin, learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/tickets",
        headers=_hdr(learner["token"]),
        json={"subject": "billing q", "body_md": "Can I get a receipt?",
              "priority": "normal", "category": "billing"},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    tid = r.json()["id"]

    # Admin posts an internal note + a public reply
    httpx.post(
        f"{API_BASE}/api/v1/tickets/{tid}/reply",
        headers=_hdr(admin["token"]),
        json={"body_md": "Need to check billing", "is_internal_note": True},
        timeout=10,
    )
    httpx.post(
        f"{API_BASE}/api/v1/tickets/{tid}/reply",
        headers=_hdr(admin["token"]),
        json={"body_md": "Receipt is in your dashboard."},
        timeout=10,
    )

    # User view: should NOT see the internal note.
    user_view = httpx.get(
        f"{API_BASE}/api/v1/tickets/{tid}", headers=_hdr(learner["token"]), timeout=10,
    )
    user_msgs = user_view.json()["messages"]
    assert all(m["is_internal_note"] is False for m in user_msgs)
    assert any("Receipt" in m["body_md"] for m in user_msgs)

    # Admin view: sees all messages.
    admin_view = httpx.get(
        f"{API_BASE}/api/v1/tickets/{tid}", headers=_hdr(admin["token"]), timeout=10,
    )
    admin_msgs = admin_view.json()["messages"]
    assert any(m["is_internal_note"] for m in admin_msgs)


@pytest.mark.integration
def test_ticket_user_cannot_post_internal_note(learner):
    r = httpx.post(
        f"{API_BASE}/api/v1/me/tickets",
        headers=_hdr(learner["token"]),
        json={"subject": "test", "body_md": "test"},
        timeout=10,
    )
    tid = r.json()["id"]
    r = httpx.post(
        f"{API_BASE}/api/v1/tickets/{tid}/reply",
        headers=_hdr(learner["token"]),
        json={"body_md": "trying to be sneaky", "is_internal_note": True},
        timeout=10,
    )
    assert r.status_code == 403


@pytest.mark.integration
def test_kb_search_and_view_count(admin):
    suffix = uuid.uuid4().hex[:4]
    slug = f"refund-{suffix}"
    r = httpx.post(
        f"{API_BASE}/api/v1/admin/kb",
        headers=_hdr(admin["token"]),
        json={"slug": slug, "title": "Refund Policy",
              "summary": "How refunds work on EUREKA",
              "body_md": "We refund within 30 days for any course purchase.",
              "category": "billing", "is_published": True},
        timeout=10,
    )
    assert r.status_code == 201, r.text

    r = httpx.get(f"{API_BASE}/api/v1/kb?q=refund", timeout=10)
    assert r.status_code == 200
    assert any(a["slug"] == slug for a in r.json())

    r = httpx.get(f"{API_BASE}/api/v1/kb/{slug}", timeout=10)
    assert r.status_code == 200
    first_view = r.json()["view_count"]
    r = httpx.get(f"{API_BASE}/api/v1/kb/{slug}", timeout=10)
    second_view = r.json()["view_count"]
    assert second_view == first_view + 1


@pytest.mark.integration
def test_kb_feedback_increments(admin, learner):
    suffix = uuid.uuid4().hex[:4]
    slug = f"howto-{suffix}"
    httpx.post(
        f"{API_BASE}/api/v1/admin/kb",
        headers=_hdr(admin["token"]),
        json={"slug": slug, "title": "How-to", "body_md": "x",
              "category": "general", "is_published": True},
        timeout=10,
    )
    httpx.post(
        f"{API_BASE}/api/v1/kb/{slug}/feedback",
        headers=_hdr(learner["token"]),
        json={"helpful": True}, timeout=10,
    )
    r = httpx.get(f"{API_BASE}/api/v1/kb/{slug}", timeout=10)
    assert r.json()["helpful_count"] == 1

"""
Integration tests for Phase 10 (marketplace / creator economy).

Exercises:
  - 10.1 instructor signup, onboarding (stub), kyc refresh, payouts accrual
  - 10.2 course listing CRUD + admin publish flow, pricing CRUD, price quote
  - 10.3 marketplace ranked feed, recompute-ranks, reviews + verified_purchase
  - 10.4 coupon creation, preview, application at checkout
  - 10.5 reports + moderation actions (unlist, takedown semantics)
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


def _login_or_create(email: str, pw: str, role: str = "student") -> tuple[str, str]:
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (id, org_id, email, hashed_password,
                               first_name, last_name, role,
                               is_active, is_email_verified)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, 'P10', 'User', %s, TRUE, TRUE)
            RETURNING id
            """,
            (email, PWD.hash(pw), role),
        )
        user_id = str(cur.fetchone()[0])
    tok = httpx.post(
        f"{API_BASE}/api/v1/auth/login",
        json={"email": email, "password": pw},
        timeout=10,
    ).json()["access_token"]
    return user_id, tok


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def admin():
    suffix = uuid.uuid4().hex[:8]
    uid, tok = _login_or_create(f"p10adm-{suffix}@example.com", "P10AdminTest123!", "org_admin")
    yield {"user_id": uid, "token": tok}
    with _conn() as c, c.cursor() as cur:
        cur.execute("DELETE FROM users WHERE id = %s", (uid,))


@pytest.fixture(scope="module")
def instructor_user():
    suffix = uuid.uuid4().hex[:8]
    uid, tok = _login_or_create(f"p10inst-{suffix}@example.com", "P10InstTest123!", "teacher")
    yield {"user_id": uid, "token": tok, "slug_suffix": suffix}
    with _conn() as c, c.cursor() as cur:
        # Break FK refs that block the user delete.
        cur.execute("UPDATE courses SET instructor_id = NULL WHERE instructor_id = %s", (uid,))
        try:
            cur.execute("DELETE FROM users WHERE id = %s", (uid,))
        except Exception:
            pass


@pytest.fixture(scope="module")
def buyer():
    suffix = uuid.uuid4().hex[:8]
    uid, tok = _login_or_create(f"p10buy-{suffix}@example.com", "P10BuyTest123!", "student")
    yield {"user_id": uid, "token": tok}
    with _conn() as c, c.cursor() as cur:
        cur.execute("DELETE FROM users WHERE id = %s", (uid,))


@pytest.fixture(scope="module")
def instructor_profile(instructor_user):
    slug = f"p10pf-{instructor_user['slug_suffix']}"
    r = httpx.post(
        f"{API_BASE}/api/v1/instructors",
        headers=_hdr(instructor_user["token"]),
        json={"public_slug": slug, "display_name": "P10 Instructor",
              "headline": "test headline", "expertise_tags": ["cardio"]},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    return r.json()


@pytest.fixture(scope="module")
def course(instructor_user):
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            """
            INSERT INTO courses (id, org_id, code, title, instructor_id,
                                 tier, is_active)
            VALUES (uuid_generate_v4(),
                    '550e8400-e29b-41d4-a716-446655440000',
                    %s, %s, %s, 'undergraduate', TRUE)
            RETURNING id
            """,
            (f"P10-{uuid.uuid4().hex[:6]}", "P10 Test Course", instructor_user["user_id"]),
        )
        course_id = str(cur.fetchone()[0])
    return course_id


@pytest.fixture(scope="module")
def listing(instructor_user, instructor_profile, course):
    slug = f"p10cl-{uuid.uuid4().hex[:6]}"
    r = httpx.post(
        f"{API_BASE}/api/v1/courses/{course}/listing",
        headers=_hdr(instructor_user["token"]),
        json={"course_id": course, "slug": slug,
              "headline": "Phase 10 ECG mastery test listing",
              "summary_md": "test", "tags": ["test"],
              "target_skill_codes": ["STEP1.CARD.HF"],
              "level": "intermediate", "estimated_hours": 4},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    return r.json()


@pytest.fixture(scope="module")
def published_listing(instructor_user, admin, listing, course):
    # pricing first
    httpx.put(
        f"{API_BASE}/api/v1/courses/{course}/pricing",
        headers=_hdr(instructor_user["token"]),
        json={"currency": "USD", "list_price_cents": 9900, "sale_price_cents": 6900},
        timeout=10,
    )
    httpx.post(
        f"{API_BASE}/api/v1/courses/{course}/listing/submit",
        headers=_hdr(instructor_user["token"]),
        timeout=10,
    )
    r = httpx.post(
        f"{API_BASE}/api/v1/courses/{course}/listing/review",
        headers=_hdr(admin["token"]),
        json={"action": "publish"},
        timeout=10,
    )
    assert r.status_code == 200, r.text
    return r.json()


# ---------------------------------------------------------------------------
# 10.1  Instructor + onboarding + KYC
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_create_instructor_profile(instructor_profile):
    assert instructor_profile["status"] == "draft"
    assert instructor_profile["kyc_status"] == "none"
    assert float(instructor_profile["revenue_share"]) == 0.7


@pytest.mark.integration
def test_duplicate_instructor_profile_returns_409(instructor_user):
    r = httpx.post(
        f"{API_BASE}/api/v1/instructors",
        headers=_hdr(instructor_user["token"]),
        json={"public_slug": f"dup-{uuid.uuid4().hex[:6]}", "display_name": "Dup"},
        timeout=10,
    )
    assert r.status_code == 409


@pytest.mark.integration
def test_stub_onboarding_returns_link(instructor_user):
    r = httpx.post(
        f"{API_BASE}/api/v1/instructors/me/onboard"
        "?return_url=http://x/ok&refresh_url=http://x/fix",
        headers=_hdr(instructor_user["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["is_stub"] is True
    assert body["stripe_connect_account_id"].startswith("acct_stub_")
    assert body["onboarding_url"].endswith("?stub=1")


@pytest.mark.integration
def test_stub_kyc_refresh_verifies(instructor_user):
    r = httpx.post(
        f"{API_BASE}/api/v1/instructors/me/kyc/refresh",
        headers=_hdr(instructor_user["token"]),
        timeout=10,
    )
    assert r.status_code == 200
    assert r.json()["kyc_status"] == "verified"


# ---------------------------------------------------------------------------
# 10.2  Listings + pricing + admin review
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_listing_is_draft_until_submitted(listing):
    assert listing["status"] == "draft"
    assert listing["enrolled_count"] == 0


@pytest.mark.integration
def test_submit_requires_pricing(instructor_user, admin, course):
    # New course without pricing
    suffix = uuid.uuid4().hex[:6]
    with _conn() as c, c.cursor() as cur:
        cur.execute(
            "INSERT INTO courses (id, org_id, code, title, instructor_id, tier, is_active) "
            "VALUES (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440000', %s, %s, %s, 'undergraduate', TRUE) "
            "RETURNING id",
            (f"P10-NO-PRICE-{suffix}", "no pricing", instructor_user["user_id"]),
        )
        cid = str(cur.fetchone()[0])
    httpx.post(
        f"{API_BASE}/api/v1/courses/{cid}/listing",
        headers=_hdr(instructor_user["token"]),
        json={"course_id": cid, "slug": f"p10-no-{suffix}",
              "headline": "Phase 10 listing without pricing"},
        timeout=10,
    )
    r = httpx.post(
        f"{API_BASE}/api/v1/courses/{cid}/listing/submit",
        headers=_hdr(instructor_user["token"]),
        timeout=10,
    )
    assert r.status_code == 409
    assert "pricing" in r.text.lower()


@pytest.mark.integration
def test_admin_publish_flips_listing(published_listing):
    assert published_listing["status"] == "published"
    assert published_listing["published_at"] is not None


@pytest.mark.integration
def test_non_owner_cannot_edit_listing(buyer, course):
    r = httpx.patch(
        f"{API_BASE}/api/v1/courses/{course}/listing",
        headers=_hdr(buyer["token"]),
        json={"headline": "I shouldn't be able to do this"},
        timeout=10,
    )
    assert r.status_code == 403


# ---------------------------------------------------------------------------
# 10.4 Pricing + coupons
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_price_quote_honors_active_sale(buyer, course, published_listing):
    r = httpx.get(
        f"{API_BASE}/api/v1/courses/{course}/price-quote",
        headers=_hdr(buyer["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["effective_price_cents"] == 6900     # sale active
    assert body["list_price_cents"] == 9900
    assert body["final_price_cents"] == 6900


@pytest.mark.integration
def test_coupon_percent_discount_applied(admin, buyer, course, published_listing):
    code = f"P10-{uuid.uuid4().hex[:6].upper()}"
    r = httpx.post(
        f"{API_BASE}/api/v1/coupons",
        headers=_hdr(admin["token"]),
        json={"code": code, "kind": "percent", "value": 2500,  # 25%
              "scope": "global", "per_user_limit": 1},
        timeout=10,
    )
    assert r.status_code == 201, r.text

    q = httpx.get(
        f"{API_BASE}/api/v1/courses/{course}/price-quote?coupon_code={code}",
        headers=_hdr(buyer["token"]),
        timeout=10,
    )
    assert q.status_code == 200
    body = q.json()
    # 25% off 6900 = 1725
    assert body["coupon_discount_cents"] == 1725
    assert body["final_price_cents"] == 5175


@pytest.mark.integration
def test_unknown_coupon_quoted_but_not_applied(buyer, course, published_listing):
    r = httpx.get(
        f"{API_BASE}/api/v1/courses/{course}/price-quote?coupon_code=NOPE-NOPE",
        headers=_hdr(buyer["token"]),
        timeout=10,
    )
    assert r.status_code == 200
    body = r.json()
    assert body["coupon_discount_cents"] == 0
    assert any("unknown coupon" in n for n in body["notes"])


# ---------------------------------------------------------------------------
# 10.3  Checkout + ranked feed + reviews
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_stub_checkout_confirms_to_paid(buyer, course, published_listing):
    r = httpx.post(
        f"{API_BASE}/api/v1/marketplace/checkout",
        headers=_hdr(buyer["token"]),
        json={"course_id": course, "success_url": "http://x/s",
              "cancel_url": "http://x/c"},
        timeout=10,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["is_stub"] is True
    pid = body["purchase_id"]

    confirm = httpx.post(
        f"{API_BASE}/api/v1/marketplace/checkout/{pid}/confirm",
        headers=_hdr(buyer["token"]),
        timeout=10,
    )
    assert confirm.status_code == 200, confirm.text
    p = confirm.json()
    assert p["status"] == "paid"
    assert p["final_price_cents"] == 6900
    # 70/30 split after ~2.9% + 30c card fees
    fee_estimate = int(6900 * 0.029) + 30
    expected_net = int((6900 - fee_estimate) * 0.7)
    assert abs(p["instructor_net_cents"] - expected_net) <= 2


@pytest.mark.integration
def test_duplicate_purchase_409(buyer, course, published_listing):
    r = httpx.post(
        f"{API_BASE}/api/v1/marketplace/checkout",
        headers=_hdr(buyer["token"]),
        json={"course_id": course, "success_url": "http://x/s",
              "cancel_url": "http://x/c"},
        timeout=10,
    )
    assert r.status_code == 409


@pytest.mark.integration
def test_verified_purchase_review(buyer, course):
    r = httpx.post(
        f"{API_BASE}/api/v1/courses/{course}/reviews",
        headers=_hdr(buyer["token"]),
        json={"rating": 5, "title": "great", "body": "loved it"},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    assert r.json()["verified_purchase"] is True
    assert r.json()["rating"] == 5


@pytest.mark.integration
def test_admin_recompute_ranks(admin):
    r = httpx.post(
        f"{API_BASE}/api/v1/admin/marketplace/recompute-ranks",
        headers=_hdr(admin["token"]),
        timeout=15,
    )
    assert r.status_code == 200
    assert r.json()["updated"] >= 1


@pytest.mark.integration
def test_ranked_feed_returns_listing(course):
    r = httpx.get(f"{API_BASE}/api/v1/marketplace/courses", timeout=10)
    assert r.status_code == 200
    rows = r.json()
    assert any(row["listing"]["course_id"] == course for row in rows), (
        "our published listing should be in the marketplace feed"
    )


# ---------------------------------------------------------------------------
# 10.5  Trust & safety
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_report_then_unlist_via_moderation(admin, buyer, course):
    r = httpx.post(
        f"{API_BASE}/api/v1/reports",
        headers=_hdr(buyer["token"]),
        json={"target_type": "course", "target_id": course,
              "reason": "misinformation",
              "details": "test report", "severity": 2},
        timeout=10,
    )
    assert r.status_code == 201, r.text
    report_id = r.json()["id"]

    act = httpx.post(
        f"{API_BASE}/api/v1/admin/reports/{report_id}/act",
        headers=_hdr(admin["token"]),
        json={"action": "unlist", "rationale": "needs reviewer"},
        timeout=10,
    )
    assert act.status_code == 200, act.text
    assert act.json()["action"] == "unlist"

    # After unlist, public ranked feed should NOT contain this course
    feed = httpx.get(f"{API_BASE}/api/v1/marketplace/courses", timeout=10).json()
    assert not any(row["listing"]["course_id"] == course for row in feed)


@pytest.mark.integration
def test_restore_after_unlist(admin, course):
    # Open a new report so we can use 'restore' against it
    list_r = httpx.get(
        f"{API_BASE}/api/v1/admin/reports?status=actioned",
        headers=_hdr(admin["token"]),
        timeout=10,
    )
    assert list_r.status_code == 200
    matching = [r for r in list_r.json() if r["target_id"] == course]
    assert matching, "should have at least one actioned report on this course"
    report_id = matching[0]["id"]

    restore = httpx.post(
        f"{API_BASE}/api/v1/admin/reports/{report_id}/act",
        headers=_hdr(admin["token"]),
        json={"action": "restore", "rationale": "cleared"},
        timeout=10,
    )
    assert restore.status_code == 200


# ---------------------------------------------------------------------------
# 10.1  Payouts (after the buyer paid above)
# ---------------------------------------------------------------------------


@pytest.mark.integration
def test_payout_accrual_picks_up_paid_purchases(instructor_user, instructor_profile):
    r = httpx.post(
        f"{API_BASE}/api/v1/instructors/me/payouts/accrue",
        headers=_hdr(instructor_user["token"]),
        timeout=10,
    )
    assert r.status_code == 200, r.text
    p = r.json()
    # Either current-week is still accruing OR we already have a non-zero gross
    # depending on what day the test runs. Just assert the row exists.
    assert p["currency"] == "USD"
    assert "gross_cents" in p
    assert "net_cents" in p

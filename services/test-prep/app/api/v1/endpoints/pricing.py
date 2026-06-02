"""
Test Prep Pricing Plans API
Provides 3 plan options: Test Prep Only (Videos+Notes), QBank Only, Complete Bundle
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.models import User
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


class PlanFeatures(BaseModel):
    video_access: bool
    notes_access: bool
    qbank_access: bool
    practice_exams: int
    tutor_hours: int
    analytics_access: bool
    mobile_app: bool
    downloadable_content: bool
    live_sessions: bool


class PricingPlan(BaseModel):
    id: str
    plan_name: str
    plan_type: str  # test_prep_only, qbank_only, complete_bundle
    exam_category: str
    billing_period: str
    price_usd: float
    original_price_usd: Optional[float] = None
    features: PlanFeatures
    question_bank_size: Optional[int] = None
    video_hours: Optional[int] = None
    max_practice_exams: Optional[int] = None
    description: str
    highlights: List[str]
    is_featured: bool


def get_pricing_plans(exam_category: str) -> List[PricingPlan]:
    """Generate pricing plans for specific exam category"""

    # Plan 1: Test Prep Only (Videos + Notes)
    test_prep_only = PricingPlan(
        id=f"{exam_category.lower()}_test_prep_only",
        plan_name=f"{exam_category} Test Prep - Videos & Notes",
        plan_type="test_prep_only",
        exam_category=exam_category,
        billing_period="month",
        price_usd=49.99,
        original_price_usd=79.99,
        features=PlanFeatures(
            video_access=True,
            notes_access=True,
            qbank_access=False,
            practice_exams=0,
            tutor_hours=0,
            analytics_access=True,
            mobile_app=True,
            downloadable_content=True,
            live_sessions=False
        ),
        video_hours=40,
        description=f"Comprehensive video lectures and study notes for {exam_category} preparation",
        highlights=[
            f"40+ hours of expert {exam_category} video lectures",
            "Downloadable PDF study notes for all topics",
            "Mobile app access for learning on-the-go",
            "Progress tracking and analytics",
            "Lifetime updates to content"
        ],
        is_featured=False
    )

    # Plan 2: QBank Only (Questions Only)
    qbank_only = PricingPlan(
        id=f"{exam_category.lower()}_qbank_only",
        plan_name=f"{exam_category} QBank Only",
        plan_type="qbank_only",
        exam_category=exam_category,
        billing_period="month",
        price_usd=39.99,
        original_price_usd=59.99,
        features=PlanFeatures(
            video_access=False,
            notes_access=False,
            qbank_access=True,
            practice_exams=5,
            tutor_hours=0,
            analytics_access=True,
            mobile_app=True,
            downloadable_content=False,
            live_sessions=False
        ),
        question_bank_size=2000,
        max_practice_exams=5,
        description=f"Access to extensive {exam_category} question bank with detailed explanations",
        highlights=[
            f"2,000+ {exam_category} practice questions",
            "5 full-length practice exams",
            "Detailed answer explanations",
            "Performance analytics and insights",
            "Adaptive difficulty adjustment"
        ],
        is_featured=False
    )

    # Plan 3: Complete Bundle (Everything)
    complete_bundle = PricingPlan(
        id=f"{exam_category.lower()}_complete_bundle",
        plan_name=f"{exam_category} Complete Bundle",
        plan_type="complete_bundle",
        exam_category=exam_category,
        billing_period="month",
        price_usd=79.99,
        original_price_usd=139.99,
        features=PlanFeatures(
            video_access=True,
            notes_access=True,
            qbank_access=True,
            practice_exams=10,
            tutor_hours=2,
            analytics_access=True,
            mobile_app=True,
            downloadable_content=True,
            live_sessions=True
        ),
        video_hours=40,
        question_bank_size=2000,
        max_practice_exams=10,
        description=f"Complete {exam_category} preparation package with videos, notes, and question bank",
        highlights=[
            f"40+ hours of video lectures + 2,000+ questions",
            "All study materials downloadable",
            "10 full-length practice exams",
            "2 hours/month of 1-on-1 tutor support",
            "Access to live Q&A sessions",
            "Priority email support"
        ],
        is_featured=True
    )

    return [test_prep_only, qbank_only, complete_bundle]


@router.get("/plans", response_model=dict)
async def get_plans(
    exam_category: str = Query("GRE", description="Exam category (GRE, GMAT, SAT, MCAT, LSAT, etc.)")
):
    """
    Get available pricing plans for a specific exam category.
    Returns 3 plan types:
    1. Test Prep Only - Videos + Study Notes
    2. QBank Only - Practice Questions
    3. Complete Bundle - Everything included
    """
    try:
        plans = get_pricing_plans(exam_category.upper())
        return {
            "success": True,
            "exam_category": exam_category.upper(),
            "plans": [plan.dict() for plan in plans],
            "currency": "USD",
            "billing_options": ["monthly", "annual"],
            "annual_discount_percent": 20
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch plans: {str(e)}")


@router.post("/subscribe")
async def create_subscription(
    plan_id: str,
    success_url: str,
    cancel_url: str
):
    """
    Create a subscription checkout session for a pricing plan.

    Track B feature-flag scaffold. Behaviour by environment:

      * STRIPE_SECRET_KEY set → create a REAL Stripe Checkout Session.
        The plan's Stripe Price id is read from STRIPE_PRICE_<PLAN_ID>
        (e.g. STRIPE_PRICE_COMPLETE_BUNDLE). Activates the moment the
        key + price ids are configured — no code change needed.
      * No key, non-production → return a clearly-LABELED mock
        (`"mock": true`) so the checkout flow can be exercised in
        dev/demo without real payments.
      * No key, production → 503. We refuse to fake a successful
        checkout in prod (the previous code returned an UNLABELED
        `mock_session_123` success unconditionally, which would have
        silently "succeeded" payments in production).
    """
    import os

    stripe_key = os.environ.get("STRIPE_SECRET_KEY", "").strip()
    environment = os.environ.get("ENVIRONMENT", "development").strip().lower()

    # ── Real Stripe path ────────────────────────────────────────────
    if stripe_key:
        try:
            import stripe  # lazy: only required when a key is configured
        except ImportError:
            raise HTTPException(
                status_code=503,
                detail="STRIPE_SECRET_KEY is set but the `stripe` package "
                       "is not installed in this service.",
            )
        stripe.api_key = stripe_key
        price_id = os.environ.get(f"STRIPE_PRICE_{plan_id.upper()}", "").strip()
        if not price_id:
            raise HTTPException(
                status_code=400,
                detail=f"No Stripe price configured for plan '{plan_id}'. "
                       f"Set STRIPE_PRICE_{plan_id.upper()} to the Stripe Price id.",
            )
        try:
            session = stripe.checkout.Session.create(
                mode="subscription",
                line_items=[{"price": price_id, "quantity": 1}],
                success_url=f"{success_url}?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=cancel_url,
                metadata={"plan_id": plan_id},
            )
            return {
                "success": True,
                "live": True,
                "checkoutUrl": session.url,
                "sessionId": session.id,
                "message": "Stripe checkout session created.",
            }
        except Exception as e:  # Stripe API / network error
            raise HTTPException(status_code=502, detail=f"Stripe checkout failed: {str(e)}")

    # ── No key configured ───────────────────────────────────────────
    if environment == "production":
        raise HTTPException(
            status_code=503,
            detail="Payments are not configured (STRIPE_SECRET_KEY unset).",
        )

    # Non-production: labeled mock so the UI flow works in dev/demo.
    return {
        "success": True,
        "mock": True,
        "checkoutUrl": f"{success_url}?session_id=mock_session_dev&plan={plan_id}",
        "sessionId": "mock_session_dev",
        "message": "MOCK checkout — no STRIPE_SECRET_KEY configured (non-production). "
                   "Set STRIPE_SECRET_KEY + STRIPE_PRICE_* to enable real payments.",
    }


@router.get("/my-subscription")
async def get_my_subscription(
    current_user: User = Depends(get_current_user),
):
    """Current user's subscription state (P3 mock→real).

    Was a fixed `has_subscription: False / inactive` for everyone,
    ignoring the user entirely. Now reflects the real `User.is_premium`
    flag. (There's no dedicated subscription table yet — plan dates /
    Stripe customer id would live there — so plan detail is coarse:
    premium vs free. Wire the table + Stripe webhooks for full detail.)
    """
    is_premium = bool(getattr(current_user, "is_premium", False))
    return {
        "success": True,
        "has_subscription": is_premium,
        "plan": "premium" if is_premium else None,
        "status": "active" if is_premium else "inactive",
        "trial_available": not is_premium,
    }

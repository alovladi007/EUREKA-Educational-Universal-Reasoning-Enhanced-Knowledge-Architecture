"""
Test Prep Pricing Plans API
Provides 3 plan options: Test Prep Only (Videos+Notes), QBank Only, Complete Bundle
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

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
    This would integrate with Stripe in production.
    """
    try:
        # In production, this would create a Stripe checkout session
        # For now, return a mock response
        return {
            "success": True,
            "checkoutUrl": f"{success_url}?session_id=mock_session_123&plan={plan_id}",
            "sessionId": "mock_session_123",
            "message": "Checkout session created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create subscription: {str(e)}")


@router.get("/my-subscription")
async def get_my_subscription():
    """Get current user's subscription details"""
    # Mock response - would query database in production
    return {
        "success": True,
        "has_subscription": False,
        "plan": None,
        "status": "inactive",
        "trial_available": True
    }

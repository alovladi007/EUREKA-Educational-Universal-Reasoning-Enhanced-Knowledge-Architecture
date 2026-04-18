"""Resume billing endpoints — Stripe checkout + subscription management."""

import logging
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/billing", tags=["billing"])


class CheckoutRequest(BaseModel):
    plan: str = "pro"  # "pro" | "team"
    success_url: str = "http://localhost:3000/dashboard/resume-builder?upgrade=success"
    cancel_url: str = "http://localhost:3000/dashboard/resume-builder?upgrade=cancel"


class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str


PLAN_PRICES = {
    "pro": "price_pro_monthly",   # Replace with real Stripe price ID
    "team": "price_team_monthly",  # Replace with real Stripe price ID
}


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(request: CheckoutRequest):
    """Create a Stripe Checkout session for plan upgrade."""
    stripe_key = getattr(settings, "STRIPE_SECRET_KEY", None)
    if not stripe_key:
        # Return a mock checkout for development
        return CheckoutResponse(
            checkout_url=request.success_url + "&mock=true",
            session_id="cs_mock_" + request.plan,
        )

    try:
        import stripe
        stripe.api_key = stripe_key

        price_id = PLAN_PRICES.get(request.plan)
        if not price_id:
            raise HTTPException(status_code=400, detail=f"Invalid plan: {request.plan}")

        session = stripe.checkout.Session.create(
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=request.success_url,
            cancel_url=request.cancel_url,
        )

        return CheckoutResponse(
            checkout_url=session.url,
            session_id=session.id,
        )
    except ImportError:
        raise HTTPException(status_code=503, detail="Stripe not installed. Run: pip install stripe")
    except Exception as e:
        logger.error(f"Stripe checkout error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events for subscription updates."""
    stripe_key = getattr(settings, "STRIPE_SECRET_KEY", None)
    webhook_secret = getattr(settings, "STRIPE_WEBHOOK_SECRET", None)

    if not stripe_key or not webhook_secret:
        return JSONResponse(content={"status": "webhooks not configured"}, status_code=200)

    try:
        import stripe
        stripe.api_key = stripe_key

        payload = await request.body()
        sig_header = request.headers.get("stripe-signature")

        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            customer_id = session.get("customer")
            subscription_id = session.get("subscription")
            logger.info(f"Checkout completed: customer={customer_id}, subscription={subscription_id}")
            # TODO: Update user's plan in database

        elif event["type"] == "customer.subscription.updated":
            subscription = event["data"]["object"]
            status = subscription.get("status")
            logger.info(f"Subscription updated: status={status}")
            # TODO: Update plan status

        elif event["type"] == "customer.subscription.deleted":
            logger.info("Subscription cancelled")
            # TODO: Downgrade to free plan

        return JSONResponse(content={"status": "ok"}, status_code=200)

    except Exception as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/plans")
async def get_plans():
    """Get available subscription plans and pricing."""
    return {
        "plans": [
            {
                "id": "free",
                "name": "Free",
                "price": 0,
                "interval": "month",
                "features": [
                    "1 resume",
                    "3 basic templates",
                    "5 AI credits/month",
                    "3 PDF exports/month (watermarked)",
                    "1 ATS check/month",
                ],
            },
            {
                "id": "pro",
                "name": "Pro",
                "price": 9,
                "interval": "month",
                "features": [
                    "Unlimited resumes",
                    "All 8+ templates",
                    "Unlimited AI credits",
                    "Unlimited exports (no watermark)",
                    "Unlimited ATS checks",
                    "Version history",
                    "Share analytics",
                    "Custom share slug",
                    "Profile photo",
                ],
            },
            {
                "id": "team",
                "name": "Team",
                "price": 29,
                "interval": "month",
                "per_seat": True,
                "features": [
                    "Everything in Pro",
                    "Custom branding",
                    "Team management",
                    "Priority AI",
                    "Custom domain for shares",
                ],
            },
        ],
    }

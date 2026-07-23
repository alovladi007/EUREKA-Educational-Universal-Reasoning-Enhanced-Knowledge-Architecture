"""
Test-prep billing + entitlements endpoints (WS5).

  GET  /billing/test-prep/products      → real product catalogue (public)
  GET  /me/entitlements                 → current user's entitlements
  POST /billing/test-prep/checkout      → Stripe Checkout Session (test keys)
  POST /billing/test-prep/webhook       → signature-verified; writes entitlement
  POST /billing/test-prep/comp          → admin-only comp/trial grant
  POST /me/test-prep/mock-results       → record a completed Real Exam Mock
  GET  /me/test-prep/mock-results       → list the user's mock results

HONESTY RULES BUILT IN:
  - No mock checkout fallback: without STRIPE_SECRET_KEY the checkout
    endpoint returns 503 "billing not configured" — it never fabricates a
    session (deliberate divergence from resume_billing's mock=true path).
  - The webhook rejects unsigned/badly-signed payloads outright; an
    entitlement can only be written by a verified Stripe event, an admin
    comp grant, or (never) fabrication.
  - Mock-result recording is entitlement-gated SERVER-side via
    has_exam_access — the client gate is UX only.
  - Checkout uses price_data from the products table (single source of
    truth); no Stripe dashboard price IDs to drift out of sync in dev.
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models import User
from app.models.billing import Entitlement, Product
from app.models.mock_result import MockResult
from app.utils.dependencies import get_current_active_user, require_admin
from app.utils.entitlements import has_exam_access

logger = logging.getLogger(__name__)

router = APIRouter()


# ---------- schemas ----------

class ProductOut(BaseModel):
    sku: str
    exam_code: str
    name: str
    description: str
    price_cents: int
    currency: str
    interval: str
    access_days: Optional[int]

    class Config:
        from_attributes = True


class EntitlementOut(BaseModel):
    exam_code: str
    sku: str
    status: str
    source: str
    expires_at: Optional[datetime]

    class Config:
        from_attributes = True


class CheckoutRequest(BaseModel):
    sku: str
    success_url: str = "http://localhost:4040/dashboard/test-prep/patent_bar?checkout=success"
    cancel_url: str = "http://localhost:4040/dashboard/test-prep/patent_bar?checkout=cancel"


class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str


class CompGrantRequest(BaseModel):
    email: str
    sku: str
    source: str = Field(default="comp", pattern="^(comp|trial)$")


class MockResultIn(BaseModel):
    exam_type: str
    correct: int
    total: int
    per_section: dict
    started_at: datetime
    completed_at: datetime


class MockResultOut(MockResultIn):
    id: uuid.UUID

    class Config:
        from_attributes = True


# ---------- helpers ----------

async def _get_product(db: AsyncSession, sku: str) -> Product:
    product = (
        await db.execute(select(Product).where(Product.sku == sku, Product.active == True))  # noqa: E712
    ).scalar_one_or_none()
    if product is None:
        raise HTTPException(status_code=404, detail=f"Unknown product sku: {sku}")
    return product


async def _grant_entitlement(
    db: AsyncSession, user_id: uuid.UUID, product: Product, source: str, external_ref: str | None,
) -> Entitlement:
    """Idempotent upsert: one entitlement row per (user, exam)."""
    existing = (
        await db.execute(
            select(Entitlement).where(
                Entitlement.user_id == user_id,
                Entitlement.exam_code == product.exam_code,
            )
        )
    ).scalar_one_or_none()
    expires = (
        datetime.now(timezone.utc) + timedelta(days=product.access_days)
        if product.access_days
        else None
    )
    if existing:
        existing.status = "active"
        existing.sku = product.sku
        existing.source = source
        existing.external_ref = external_ref
        existing.expires_at = expires
        await db.commit()
        return existing
    ent = Entitlement(
        user_id=user_id, exam_code=product.exam_code, sku=product.sku,
        status="active", source=source, external_ref=external_ref, expires_at=expires,
    )
    db.add(ent)
    await db.commit()
    return ent


# ---------- endpoints ----------

@router.get("/billing/test-prep/products", response_model=List[ProductOut])
async def list_products(db: AsyncSession = Depends(get_db)):
    """Active catalogue. Rows exist only for real sellable SKUs (seeded by migration)."""
    rows = (await db.execute(select(Product).where(Product.active == True))).scalars().all()  # noqa: E712
    return rows


@router.get("/me/entitlements", response_model=List[EntitlementOut])
async def my_entitlements(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (
        await db.execute(select(Entitlement).where(Entitlement.user_id == current_user.id))
    ).scalars().all()
    return rows


@router.post("/billing/test-prep/checkout", response_model=CheckoutResponse)
async def create_checkout(
    body: CheckoutRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a real Stripe Checkout Session (test mode until live keys are set).

    Returns 503 when Stripe is not configured — deliberately NO mock-checkout
    fallback: a fake session that "succeeds" would fabricate an entitlement.
    """
    stripe_key = getattr(settings, "STRIPE_SECRET_KEY", None)
    if not stripe_key:
        raise HTTPException(
            status_code=503,
            detail="Billing is not configured (STRIPE_SECRET_KEY unset). "
                   "Add Stripe TEST keys to enable checkout.",
        )
    product = await _get_product(db, body.sku)
    try:
        import stripe
        stripe.api_key = stripe_key
        session = stripe.checkout.Session.create(
            mode="payment" if product.interval == "one_time" else "subscription",
            line_items=[{
                "price_data": {
                    "currency": product.currency,
                    "unit_amount": product.price_cents,
                    "product_data": {"name": product.name},
                    **({"recurring": {"interval": "month"}} if product.interval == "monthly" else {}),
                },
                "quantity": 1,
            }],
            metadata={"user_id": str(current_user.id), "sku": product.sku},
            customer_email=current_user.email,
            success_url=body.success_url,
            cancel_url=body.cancel_url,
        )
        return CheckoutResponse(checkout_url=session.url, session_id=session.id)
    except ImportError:
        raise HTTPException(status_code=503, detail="stripe library not installed")
    except HTTPException:
        raise
    except Exception as e:  # Stripe API errors
        logger.error("Stripe checkout error: %s", e)
        raise HTTPException(status_code=502, detail=f"Stripe error: {e}")


@router.post("/billing/test-prep/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Stripe webhook: on verified checkout.session.completed, write the entitlement.

    The signature IS the authentication — unsigned or badly-signed payloads
    are rejected with 400; an unconfigured webhook secret rejects with 503
    (never a silent 200 that drops paid events).
    """
    webhook_secret = getattr(settings, "STRIPE_WEBHOOK_SECRET", None)
    if not webhook_secret:
        raise HTTPException(status_code=503, detail="STRIPE_WEBHOOK_SECRET unset")
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")
    try:
        import stripe
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except ImportError:
        raise HTTPException(status_code=503, detail="stripe library not installed")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid webhook signature: {e}")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        meta = session.get("metadata") or {}
        user_id, sku = meta.get("user_id"), meta.get("sku")
        if not user_id or not sku:
            logger.warning("checkout.session.completed without user_id/sku metadata: %s", session.get("id"))
            return {"status": "ignored", "reason": "missing metadata"}
        product = await _get_product(db, sku)
        ent = await _grant_entitlement(
            db, uuid.UUID(user_id), product, source="stripe", external_ref=session.get("id"),
        )
        logger.info("Entitlement granted via Stripe: user=%s exam=%s ref=%s", user_id, ent.exam_code, ent.external_ref)
        return {"status": "entitlement_granted", "exam_code": ent.exam_code}
    return {"status": "ignored", "type": event["type"]}


@router.post("/billing/test-prep/comp", response_model=EntitlementOut)
async def comp_grant(
    body: CompGrantRequest,
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Admin-only comp/trial grant — the audited non-payment path (source recorded)."""
    target = (
        await db.execute(select(User).where(User.email == body.email))
    ).scalar_one_or_none()
    if target is None:
        raise HTTPException(status_code=404, detail=f"No user with email {body.email}")
    product = await _get_product(db, body.sku)
    return await _grant_entitlement(db, target.id, product, source=body.source, external_ref=None)


@router.post("/me/test-prep/mock-results", response_model=MockResultOut)
async def record_mock_result(
    body: MockResultIn,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Persist a completed Real Exam Mock. SERVER-side entitlement gate:
    the mock is paid-tier, so recording requires an active entitlement."""
    if not await has_exam_access(db, current_user, body.exam_type):
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={"message": f"An active {body.exam_type} entitlement is required.",
                    "exam_code": body.exam_type},
        )
    if not (0 <= body.correct <= body.total and body.total > 0):
        raise HTTPException(status_code=422, detail="correct/total out of range")
    row = MockResult(
        user_id=current_user.id, exam_type=body.exam_type, correct=body.correct,
        total=body.total, per_section=body.per_section,
        started_at=body.started_at, completed_at=body.completed_at,
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.get("/me/test-prep/mock-results", response_model=List[MockResultOut])
async def list_mock_results(
    exam_type: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (
        await db.execute(
            select(MockResult)
            .where(MockResult.user_id == current_user.id, MockResult.exam_type == exam_type)
            .order_by(MockResult.completed_at.desc())
        )
    ).scalars().all()
    return rows

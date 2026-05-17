"""
Phase 10.4 — pricing + coupon application.

Computes the effective price of a course at the current time and
optionally applies a coupon. Splits the result into:
    list / sale / effective / coupon_discount / final
plus the platform-fee + instructor-net split using the instructor's revenue_share.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.marketplace import (
    Coupon,
    CouponKind,
    CouponRedemption,
    CouponScope,
    CoursePricing,
    InstructorProfile,
)


@dataclass
class PriceQuote:
    course_id: UUID
    currency: str
    list_price_cents: int
    sale_price_cents: Optional[int]
    effective_price_cents: int       # min(list, sale-if-active)
    coupon_code: Optional[str]
    coupon_discount_cents: int
    final_price_cents: int
    instructor_net_cents: int
    platform_fee_cents: int
    is_free: bool
    notes: list[str] = field(default_factory=list)


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _coupon_applies_to_course(coupon: Coupon, course_id: UUID, course_category: Optional[str] = None) -> bool:
    """Return True if the coupon is valid for this course."""
    if coupon.scope == CouponScope.global_.value:
        return True
    if coupon.scope == CouponScope.course.value:
        return coupon.scope_id == course_id
    if coupon.scope == CouponScope.category.value and course_category:
        return str(coupon.scope_id) == course_category
    # org + cohort scopes only matter at checkout time when the buyer is known;
    # treat as applicable here and let the caller short-circuit.
    return True


async def _per_user_uses(db: AsyncSession, coupon_id: UUID, user_id: UUID) -> int:
    q = await db.execute(
        select(CouponRedemption).where(
            CouponRedemption.coupon_id == coupon_id,
            CouponRedemption.user_id == user_id,
        )
    )
    return len(list(q.scalars().all()))


async def validate_coupon(
    db: AsyncSession,
    *,
    code: str,
    user_id: Optional[UUID],
    course_id: UUID,
    course_category: Optional[str] = None,
) -> tuple[Coupon | None, str | None]:
    """Look up the coupon and check its window + caps."""
    q = await db.execute(select(Coupon).where(Coupon.code == code))
    coupon = q.scalar_one_or_none()
    if coupon is None:
        return None, "unknown coupon"
    if not coupon.is_active:
        return None, "coupon inactive"
    now = _now()
    if coupon.valid_from and coupon.valid_from > now:
        return None, "coupon not yet active"
    if coupon.valid_to and coupon.valid_to < now:
        return None, "coupon expired"
    if coupon.max_redemptions is not None and coupon.used_count >= coupon.max_redemptions:
        return None, "coupon redemption cap reached"
    if not _coupon_applies_to_course(coupon, course_id, course_category):
        return None, "coupon not applicable to this course"
    if user_id is not None and coupon.per_user_limit:
        used = await _per_user_uses(db, coupon.id, user_id)
        if used >= coupon.per_user_limit:
            return None, "coupon already used by this learner"
    return coupon, None


def _apply_discount(price_cents: int, coupon: Coupon) -> int:
    if coupon.kind == CouponKind.percent.value:
        # value is basis points: 2500 = 25%
        return (price_cents * coupon.value) // 10000
    # amount_off: integer cents
    return min(coupon.value, price_cents)


async def quote(
    db: AsyncSession,
    *,
    course_id: UUID,
    instructor: InstructorProfile,
    user_id: Optional[UUID] = None,
    coupon_code: Optional[str] = None,
) -> PriceQuote:
    """Build a full PriceQuote for this course right now."""
    pricing_q = await db.execute(select(CoursePricing).where(CoursePricing.course_id == course_id))
    pricing = pricing_q.scalar_one_or_none()
    notes: list[str] = []

    if pricing is None:
        # No pricing row → treat as free (a course can be listed but not yet priced).
        notes.append("no pricing set; treating as free")
        return PriceQuote(
            course_id=course_id, currency="USD",
            list_price_cents=0, sale_price_cents=None,
            effective_price_cents=0, coupon_code=None, coupon_discount_cents=0,
            final_price_cents=0, instructor_net_cents=0, platform_fee_cents=0,
            is_free=True, notes=notes,
        )

    if pricing.is_free:
        notes.append("course is free")
        return PriceQuote(
            course_id=course_id, currency=pricing.currency,
            list_price_cents=pricing.list_price_cents, sale_price_cents=pricing.sale_price_cents,
            effective_price_cents=0, coupon_code=None, coupon_discount_cents=0,
            final_price_cents=0, instructor_net_cents=0, platform_fee_cents=0,
            is_free=True, notes=notes,
        )

    now = _now()
    sale_active = (
        pricing.sale_price_cents is not None
        and (pricing.sale_starts_at is None or pricing.sale_starts_at <= now)
        and (pricing.sale_ends_at is None or pricing.sale_ends_at >= now)
    )
    effective = pricing.sale_price_cents if sale_active else pricing.list_price_cents
    if sale_active:
        notes.append(f"sale active: {pricing.sale_price_cents}c (was {pricing.list_price_cents}c)")

    coupon_discount = 0
    applied_code: Optional[str] = None
    if coupon_code:
        coupon, err = await validate_coupon(
            db, code=coupon_code, user_id=user_id, course_id=course_id,
        )
        if err is not None:
            notes.append(f"coupon ignored: {err}")
        else:
            coupon_discount = _apply_discount(effective, coupon)
            applied_code = coupon.code
            notes.append(f"coupon {coupon.code} → -{coupon_discount}c")

    final = max(0, effective - coupon_discount)

    # Instructor revenue split. Payment fees are estimated at the standard
    # Stripe 2.9% + 30¢ (deducted from the gross). Anything we keep on top is
    # the platform take.
    payment_fee = int(final * 0.029) + 30 if final > 0 else 0
    revenue_share = float(instructor.revenue_share or 0.7)
    instructor_net = int((final - payment_fee) * revenue_share)
    platform_fee = max(0, final - payment_fee - instructor_net)

    return PriceQuote(
        course_id=course_id,
        currency=pricing.currency,
        list_price_cents=pricing.list_price_cents,
        sale_price_cents=pricing.sale_price_cents,
        effective_price_cents=effective,
        coupon_code=applied_code,
        coupon_discount_cents=coupon_discount,
        final_price_cents=final,
        instructor_net_cents=instructor_net,
        platform_fee_cents=platform_fee,
        is_free=False,
        notes=notes,
    )

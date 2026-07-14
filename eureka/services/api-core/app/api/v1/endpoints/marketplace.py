"""
Phase 10 — Marketplace + creator economy REST surface.

Endpoint map
============

Instructor / 10.1
  POST   /instructors                        create my instructor profile
  GET    /instructors/me                     get my profile
  PATCH  /instructors/me                     update bio / headline / etc
  POST   /instructors/me/onboard             start Stripe Connect onboarding (or stub)
  POST   /instructors/me/kyc/refresh         reconcile KYC state from Stripe
  GET    /instructors/me/payouts             my payout ledger
  POST   /instructors/me/payouts/accrue      recompute accruing payout for last week
  GET    /instructors/{slug}                 public storefront read

Listings / 10.2
  POST   /courses/{course_id}/listing        create / draft a listing
  PATCH  /courses/{course_id}/listing        update draft fields
  POST   /courses/{course_id}/listing/submit  submit for review
  POST   /courses/{course_id}/listing/review  (admin) publish / reject / unlist
  GET    /listings/{slug}                    public read

Pricing / 10.2
  PUT    /courses/{course_id}/pricing        set pricing
  GET    /courses/{course_id}/pricing
  GET    /courses/{course_id}/price-quote    apply current sale + optional coupon

Checkout + reviews / 10.2 + 10.3
  POST   /marketplace/checkout               start Stripe checkout (or stub)
  POST   /marketplace/checkout/{purchase_id}/confirm  dev-only confirm (no Stripe webhook needed)
  GET    /marketplace/courses                ranked marketplace feed
  POST   /courses/{course_id}/reviews        post a review
  GET    /courses/{course_id}/reviews

Coupons / 10.4
  POST   /coupons                            (admin) create
  GET    /coupons                            (admin) list
  GET    /coupons/{code}/preview?course_id=  (auth) preview the discount

Trust & safety / 10.5
  POST   /reports                            create a content report
  GET    /admin/reports                      (admin) triage queue
  POST   /admin/reports/{id}/act             (admin) apply a moderation action

Admin ranking / 10.3
  POST   /admin/marketplace/recompute-ranks  (admin) re-rank all published listings
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.utils.dependencies import get_current_user
from app.models.course import Course
from app.models.marketplace import (
    ContentReport,
    Coupon,
    CouponKind,
    CouponRedemption,
    CouponScope,
    CourseListing,
    CoursePricing,
    CourseReview,
    InstructorKycEvent,
    InstructorPayout,
    InstructorProfile,
    InstructorStatus,
    KycStatus,
    ListingStatus,
    MarketplacePurchase,
    ModerationAction,
    PayoutStatus,
    PurchaseStatus,
    ReportReason,
    ReportStatus,
)
from app.models.user import User
from app.schemas.marketplace import (
    CheckoutRequest,
    CheckoutResponse,
    CouponCreateRequest,
    CouponResponse,
    InstructorOnboardingLinkResponse,
    InstructorOnboardRequest,
    InstructorResponse,
    InstructorUpdateRequest,
    ListingCreateRequest,
    ListingResponse,
    ListingReviewRequest,
    ListingUpdateRequest,
    ModerationActionRequest,
    ModerationActionResponse,
    PayoutResponse,
    PriceQuoteResponse,
    PricingRequest,
    PricingResponse,
    PurchaseResponse,
    RankedListingResponse,
    ReportCreateRequest,
    ReportResponse,
    ReviewCreateRequest,
    ReviewResponse,
)
from app.services import marketplace_instructor as inst_svc
from app.services import marketplace_moderation as mod_svc
from app.services import marketplace_pricing as price_svc
from app.services.axiom_entitlements import maybe_grant_for_purchase
from app.services import marketplace_ranking as rank_svc


router = APIRouter()


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------


# P1.5: centralized in app/utils/rbac.py (was a local duplicate).
from app.utils.rbac import is_admin as _is_admin  # noqa: E402


def _require_admin(user: User) -> None:
    if not _is_admin(user):
        raise HTTPException(status_code=403, detail="admin role required")


async def _get_my_instructor(db: AsyncSession, user: User) -> InstructorProfile:
    q = await db.execute(select(InstructorProfile).where(InstructorProfile.user_id == user.id))
    p = q.scalar_one_or_none()
    if p is None:
        raise HTTPException(status_code=404, detail="instructor profile not found; POST /instructors first")
    return p


def _now() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# 10.1 Instructor
# ---------------------------------------------------------------------------


@router.post("/instructors", response_model=InstructorResponse, status_code=201)
async def create_instructor(
    payload: InstructorOnboardRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InstructorProfile:
    existing = await db.execute(select(InstructorProfile).where(InstructorProfile.user_id == current_user.id))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(status_code=409, detail="you already have an instructor profile")
    p = InstructorProfile(
        user_id=current_user.id,
        public_slug=payload.public_slug,
        display_name=payload.display_name,
        headline=payload.headline,
        bio_md=payload.bio_md,
        avatar_url=payload.avatar_url,
        expertise_tags=payload.expertise_tags,
        website_url=payload.website_url,
        payout_currency=payload.payout_currency,
    )
    db.add(p)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        if "public_slug" in str(exc):
            raise HTTPException(status_code=409, detail="public_slug already taken") from exc
        raise
    await db.refresh(p)
    return p


@router.get("/instructors/me", response_model=InstructorResponse)
async def get_my_instructor(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InstructorProfile:
    return await _get_my_instructor(db, current_user)


@router.patch("/instructors/me", response_model=InstructorResponse)
async def update_my_instructor(
    payload: InstructorUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InstructorProfile:
    p = await _get_my_instructor(db, current_user)
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(p, k, v)
    await db.commit()
    await db.refresh(p)
    return p


@router.post("/instructors/me/onboard", response_model=InstructorOnboardingLinkResponse)
async def start_onboarding(
    return_url: str = Query(...),
    refresh_url: str = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    p = await _get_my_instructor(db, current_user)
    link = await inst_svc.start_onboarding(db, instructor=p, return_url=return_url, refresh_url=refresh_url)
    return InstructorOnboardingLinkResponse(
        instructor_id=link.instructor_id,
        stripe_connect_account_id=link.stripe_connect_account_id,
        onboarding_url=link.onboarding_url,
        is_stub=link.is_stub,
    )


@router.post("/instructors/me/kyc/refresh", response_model=InstructorResponse)
async def refresh_my_kyc(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    p = await _get_my_instructor(db, current_user)
    return await inst_svc.refresh_kyc(db, instructor=p)


@router.get("/instructors/me/payouts", response_model=list[PayoutResponse])
async def my_payouts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    p = await _get_my_instructor(db, current_user)
    q = await db.execute(
        select(InstructorPayout).where(InstructorPayout.instructor_id == p.id)
        .order_by(InstructorPayout.period_start.desc())
    )
    return list(q.scalars().all())


@router.post("/instructors/me/payouts/accrue", response_model=PayoutResponse)
async def accrue_my_payout(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    p = await _get_my_instructor(db, current_user)
    return await inst_svc.accrue_period(db, instructor=p)


@router.get("/instructors/{slug}", response_model=InstructorResponse)
async def get_public_instructor(
    slug: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(select(InstructorProfile).where(InstructorProfile.public_slug == slug))
    p = q.scalar_one_or_none()
    if p is None:
        raise HTTPException(status_code=404, detail="instructor not found")
    return p


# ---------------------------------------------------------------------------
# 10.2 Course listings + pricing
# ---------------------------------------------------------------------------


async def _own_course_or_403(db: AsyncSession, course_id: UUID, user: User) -> Course:
    course = await db.get(Course, course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="course not found")
    if course.instructor_id != user.id and not _is_admin(user):
        raise HTTPException(status_code=403, detail="you do not own this course")
    return course


@router.post("/courses/{course_id}/listing", response_model=ListingResponse, status_code=201)
async def create_listing(
    course_id: UUID,
    payload: ListingCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.course_id != course_id:
        raise HTTPException(status_code=400, detail="course_id mismatch")
    await _own_course_or_403(db, course_id, current_user)
    inst = await _get_my_instructor(db, current_user)
    existing = await db.execute(select(CourseListing).where(CourseListing.course_id == course_id))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(status_code=409, detail="listing already exists; PATCH it instead")
    listing = CourseListing(
        course_id=course_id,
        instructor_id=inst.id,
        slug=payload.slug,
        headline=payload.headline,
        summary_md=payload.summary_md,
        hero_image_url=payload.hero_image_url,
        promo_video_url=payload.promo_video_url,
        tags=payload.tags,
        target_skill_codes=payload.target_skill_codes,
        level=payload.level,
        language=payload.language,
        estimated_hours=payload.estimated_hours,
    )
    db.add(listing)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        if "slug" in str(exc):
            raise HTTPException(status_code=409, detail="slug already taken") from exc
        raise
    await db.refresh(listing)
    return listing


@router.patch("/courses/{course_id}/listing", response_model=ListingResponse)
async def update_listing(
    course_id: UUID,
    payload: ListingUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _own_course_or_403(db, course_id, current_user)
    q = await db.execute(select(CourseListing).where(CourseListing.course_id == course_id))
    listing = q.scalar_one_or_none()
    if listing is None:
        raise HTTPException(status_code=404, detail="listing not found")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(listing, k, v)
    if listing.status == ListingStatus.rejected.value:
        listing.status = ListingStatus.draft.value
        listing.rejected_reason = None
    await db.commit()
    await db.refresh(listing)
    return listing


@router.post("/courses/{course_id}/listing/submit", response_model=ListingResponse)
async def submit_listing(
    course_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _own_course_or_403(db, course_id, current_user)
    q = await db.execute(select(CourseListing).where(CourseListing.course_id == course_id))
    listing = q.scalar_one_or_none()
    if listing is None:
        raise HTTPException(status_code=404, detail="listing not found")
    if listing.status not in (ListingStatus.draft.value, ListingStatus.rejected.value):
        raise HTTPException(status_code=409, detail=f"cannot submit from status={listing.status}")
    pricing_q = await db.execute(select(CoursePricing).where(CoursePricing.course_id == course_id))
    if pricing_q.scalar_one_or_none() is None:
        raise HTTPException(status_code=409, detail="pricing must be set before submission")
    listing.status = ListingStatus.pending_review.value
    await db.commit()
    await db.refresh(listing)
    return listing


@router.post("/courses/{course_id}/listing/review", response_model=ListingResponse)
async def review_listing(
    course_id: UUID,
    payload: ListingReviewRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    q = await db.execute(select(CourseListing).where(CourseListing.course_id == course_id))
    listing = q.scalar_one_or_none()
    if listing is None:
        raise HTTPException(status_code=404, detail="listing not found")
    if payload.action == "publish":
        if listing.status != ListingStatus.pending_review.value:
            raise HTTPException(status_code=409, detail="listing not in pending_review")
        listing.status = ListingStatus.published.value
        listing.published_at = _now()
        # Bump instructor's published count.
        inst = await db.get(InstructorProfile, listing.instructor_id)
        if inst is not None:
            inst.total_courses_published += 1
            if inst.status == InstructorStatus.draft.value:
                inst.status = InstructorStatus.approved.value
    elif payload.action == "reject":
        listing.status = ListingStatus.rejected.value
        listing.rejected_reason = payload.rejected_reason
    elif payload.action == "unlist":
        listing.status = ListingStatus.unlisted.value
    else:
        raise HTTPException(status_code=400, detail="action must be publish|reject|unlist")
    await db.commit()
    await db.refresh(listing)
    return listing


@router.get("/listings/{slug}", response_model=ListingResponse)
async def get_listing_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    q = await db.execute(
        select(CourseListing).where(
            CourseListing.slug == slug,
            CourseListing.status == ListingStatus.published.value,
        )
    )
    listing = q.scalar_one_or_none()
    if listing is None:
        raise HTTPException(status_code=404, detail="listing not found")
    return listing


@router.put("/courses/{course_id}/pricing", response_model=PricingResponse)
async def upsert_pricing(
    course_id: UUID,
    payload: PricingRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _own_course_or_403(db, course_id, current_user)
    q = await db.execute(select(CoursePricing).where(CoursePricing.course_id == course_id))
    p = q.scalar_one_or_none()
    if p is None:
        p = CoursePricing(course_id=course_id, **payload.model_dump())
        db.add(p)
    else:
        for k, v in payload.model_dump().items():
            setattr(p, k, v)
    await db.commit()
    await db.refresh(p)
    return p


@router.get("/courses/{course_id}/pricing", response_model=PricingResponse)
async def get_pricing(
    course_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(select(CoursePricing).where(CoursePricing.course_id == course_id))
    p = q.scalar_one_or_none()
    if p is None:
        raise HTTPException(status_code=404, detail="pricing not set")
    return p


@router.get("/courses/{course_id}/price-quote", response_model=PriceQuoteResponse)
async def price_quote(
    course_id: UUID,
    coupon_code: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    listing_q = await db.execute(select(CourseListing).where(CourseListing.course_id == course_id))
    listing = listing_q.scalar_one_or_none()
    if listing is None:
        raise HTTPException(status_code=404, detail="listing not found")
    inst = await db.get(InstructorProfile, listing.instructor_id)
    if inst is None:
        raise HTTPException(status_code=404, detail="instructor not found")
    q = await price_svc.quote(
        db, course_id=course_id, instructor=inst,
        user_id=current_user.id, coupon_code=coupon_code,
    )
    return PriceQuoteResponse(**q.__dict__)


# ---------------------------------------------------------------------------
# 10.2 + 10.3 — checkout, ranked feed, reviews
# ---------------------------------------------------------------------------


@router.post("/marketplace/checkout", response_model=CheckoutResponse)
async def start_checkout(
    payload: CheckoutRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    listing_q = await db.execute(select(CourseListing).where(
        CourseListing.course_id == payload.course_id,
        CourseListing.status == ListingStatus.published.value,
    ))
    listing = listing_q.scalar_one_or_none()
    if listing is None:
        raise HTTPException(status_code=404, detail="course not on the marketplace")
    inst = await db.get(InstructorProfile, listing.instructor_id)
    if inst is None:
        raise HTTPException(status_code=404, detail="instructor missing")

    # Already paid?
    dup_q = await db.execute(
        select(MarketplacePurchase).where(
            MarketplacePurchase.user_id == current_user.id,
            MarketplacePurchase.course_id == payload.course_id,
            MarketplacePurchase.status == PurchaseStatus.paid.value,
        )
    )
    if dup_q.scalar_one_or_none() is not None:
        raise HTTPException(status_code=409, detail="already purchased")

    quote = await price_svc.quote(
        db, course_id=payload.course_id, instructor=inst,
        user_id=current_user.id, coupon_code=payload.coupon_code,
    )

    coupon_id: Optional[UUID] = None
    if quote.coupon_code:
        coupon_row = await db.execute(select(Coupon).where(Coupon.code == quote.coupon_code))
        coupon_obj = coupon_row.scalar_one_or_none()
        coupon_id = coupon_obj.id if coupon_obj else None

    purchase = MarketplacePurchase(
        user_id=current_user.id,
        course_id=payload.course_id,
        instructor_id=inst.id,
        currency=quote.currency,
        list_price_cents=quote.list_price_cents,
        discount_cents=quote.coupon_discount_cents + max(0, quote.list_price_cents - quote.effective_price_cents),
        final_price_cents=quote.final_price_cents,
        platform_fee_cents=quote.platform_fee_cents,
        payment_fee_cents=int(quote.final_price_cents * 0.029) + (30 if quote.final_price_cents > 0 else 0),
        instructor_net_cents=quote.instructor_net_cents,
        coupon_id=coupon_id,
        status=PurchaseStatus.pending.value,
    )
    db.add(purchase)
    await db.commit()
    await db.refresh(purchase)

    if quote.is_free or quote.final_price_cents == 0:
        # Free → mark paid immediately, no checkout session.
        purchase.status = PurchaseStatus.paid.value
        purchase.paid_at = _now()
        if coupon_id:
            db.add(CouponRedemption(
                coupon_id=coupon_id, user_id=current_user.id,
                purchase_id=purchase.id, course_id=payload.course_id,
                discount_cents=quote.coupon_discount_cents,
            ))
            await db.execute(
                Coupon.__table__.update().where(Coupon.id == coupon_id).values(
                    used_count=Coupon.used_count + 1
                )
            )
        await db.commit()
        # AXIOM entitlement (Integration Plan S3): a paid course that maps to
        # an AXIOM SKU unlocks the AXIOM units; best-effort, never blocks.
        await maybe_grant_for_purchase(db, current_user.id, payload.course_id)
        return CheckoutResponse(
            purchase_id=purchase.id, checkout_url=None, is_free=True, is_stub=True,
        )

    key = getattr(__import__("app.core.config", fromlist=["settings"]).settings, "STRIPE_SECRET_KEY", None)
    if not key:
        # Stub mode — return our own confirm URL.
        confirm_url = f"{request.base_url}api/v1/marketplace/checkout/{purchase.id}/confirm"
        purchase.stripe_session_id = f"cs_stub_{purchase.id.hex[:24]}"
        await db.commit()
        return CheckoutResponse(
            purchase_id=purchase.id, checkout_url=confirm_url, is_free=False, is_stub=True,
        )

    try:
        import stripe
        stripe.api_key = key
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=[{
                "price_data": {
                    "currency": quote.currency.lower(),
                    "product_data": {"name": listing.headline},
                    "unit_amount": quote.final_price_cents,
                },
                "quantity": 1,
            }],
            success_url=payload.success_url,
            cancel_url=payload.cancel_url,
            metadata={"purchase_id": str(purchase.id)},
            payment_intent_data={
                "transfer_data": {"destination": inst.stripe_connect_account_id} if inst.stripe_connect_account_id else None,
                "application_fee_amount": quote.platform_fee_cents,
            } if inst.stripe_connect_account_id else None,
        )
        purchase.stripe_session_id = session.id
        await db.commit()
        return CheckoutResponse(
            purchase_id=purchase.id, checkout_url=session.url, is_free=False, is_stub=False,
        )
    except ImportError:
        # fall back to stub
        purchase.stripe_session_id = f"cs_stub_{purchase.id.hex[:24]}"
        await db.commit()
        confirm_url = f"{request.base_url}api/v1/marketplace/checkout/{purchase.id}/confirm"
        return CheckoutResponse(
            purchase_id=purchase.id, checkout_url=confirm_url, is_free=False, is_stub=True,
        )


@router.post("/marketplace/checkout/{purchase_id}/confirm", response_model=PurchaseResponse)
async def confirm_stub_checkout(
    purchase_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Dev/stub confirmation hook. In prod, replaced by Stripe webhook."""
    purchase = await db.get(MarketplacePurchase, purchase_id)
    if purchase is None:
        raise HTTPException(status_code=404, detail="purchase not found")
    if purchase.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="not your purchase")
    if not (purchase.stripe_session_id and purchase.stripe_session_id.startswith("cs_stub_")):
        raise HTTPException(status_code=409, detail="this confirm endpoint is stub-only")
    if purchase.status == PurchaseStatus.paid.value:
        return purchase
    purchase.status = PurchaseStatus.paid.value
    purchase.paid_at = _now()
    if purchase.coupon_id:
        db.add(CouponRedemption(
            coupon_id=purchase.coupon_id, user_id=purchase.user_id,
            purchase_id=purchase.id, course_id=purchase.course_id,
            discount_cents=purchase.discount_cents,
        ))
        await db.execute(
            Coupon.__table__.update().where(Coupon.id == purchase.coupon_id).values(
                used_count=Coupon.used_count + 1
            )
        )
    inst = await db.get(InstructorProfile, purchase.instructor_id)
    if inst is not None:
        inst.total_sales_cents = (inst.total_sales_cents or 0) + purchase.final_price_cents
    await db.commit()
    await db.refresh(purchase)
    # AXIOM entitlement (Integration Plan S3); best-effort, never blocks.
    await maybe_grant_for_purchase(db, purchase.user_id, purchase.course_id)
    return purchase


@router.get("/marketplace/courses", response_model=list[RankedListingResponse])
async def ranked_marketplace(
    q: Optional[str] = Query(None, description="free-text search over headline+tags"),
    tag: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(CourseListing, InstructorProfile)
        .join(InstructorProfile, InstructorProfile.id == CourseListing.instructor_id)
        .where(CourseListing.status == ListingStatus.published.value)
    )
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(or_(CourseListing.headline.ilike(like), CourseListing.summary_md.ilike(like)))
    if tag:
        stmt = stmt.where(CourseListing.tags.any(tag))
    stmt = stmt.order_by(CourseListing.rank_score.desc()).limit(limit)
    rows = (await db.execute(stmt)).all()
    out: list[RankedListingResponse] = []
    for listing, instructor in rows:
        pricing_q = await db.execute(select(CoursePricing).where(CoursePricing.course_id == listing.course_id))
        pricing = pricing_q.scalar_one_or_none()
        if pricing is None or pricing.is_free:
            final = 0
            listp = 0
            cur = "USD"
        else:
            now = _now()
            sale_active = (
                pricing.sale_price_cents is not None
                and (pricing.sale_starts_at is None or pricing.sale_starts_at <= now)
                and (pricing.sale_ends_at is None or pricing.sale_ends_at >= now)
            )
            final = pricing.sale_price_cents if sale_active else pricing.list_price_cents
            listp = pricing.list_price_cents
            cur = pricing.currency
        out.append(RankedListingResponse(
            listing=ListingResponse.model_validate(listing),
            instructor_display_name=instructor.display_name,
            final_price_cents=final, list_price_cents=listp, currency=cur,
        ))
    return out


@router.post("/admin/marketplace/recompute-ranks")
async def admin_recompute_ranks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    n = await rank_svc.recompute_all_published(db)
    return {"updated": n}


@router.post("/courses/{course_id}/reviews", response_model=ReviewResponse, status_code=201)
async def post_review(
    course_id: UUID,
    payload: ReviewCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verified purchase if any paid row exists.
    paid_q = await db.execute(
        select(MarketplacePurchase).where(
            MarketplacePurchase.user_id == current_user.id,
            MarketplacePurchase.course_id == course_id,
            MarketplacePurchase.status == PurchaseStatus.paid.value,
        )
    )
    verified = paid_q.scalar_one_or_none() is not None
    review = CourseReview(
        course_id=course_id, user_id=current_user.id,
        rating=payload.rating, title=payload.title, body=payload.body,
        verified_purchase=verified,
    )
    db.add(review)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="you have already reviewed this course") from exc
    await db.refresh(review)
    return review


@router.get("/courses/{course_id}/reviews", response_model=list[ReviewResponse])
async def list_reviews(
    course_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    q = await db.execute(
        select(CourseReview).where(CourseReview.course_id == course_id, CourseReview.flagged.is_(False))
        .order_by(CourseReview.created_at.desc())
    )
    return list(q.scalars().all())


# ---------------------------------------------------------------------------
# 10.4 Coupons
# ---------------------------------------------------------------------------


@router.post("/coupons", response_model=CouponResponse, status_code=201)
async def create_coupon(
    payload: CouponCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    coupon = Coupon(
        code=payload.code.upper(),
        description=payload.description,
        kind=payload.kind,
        value=payload.value,
        currency=payload.currency,
        scope=payload.scope,
        scope_id=payload.scope_id,
        max_redemptions=payload.max_redemptions,
        per_user_limit=payload.per_user_limit,
        valid_from=payload.valid_from or _now(),
        valid_to=payload.valid_to,
        is_active=payload.is_active,
        created_by=current_user.id,
    )
    db.add(coupon)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="coupon code already exists") from exc
    await db.refresh(coupon)
    return coupon


@router.get("/coupons", response_model=list[CouponResponse])
async def list_coupons(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    q = await db.execute(select(Coupon).order_by(Coupon.created_at.desc()))
    return list(q.scalars().all())


@router.get("/coupons/{code}/preview", response_model=PriceQuoteResponse)
async def preview_coupon(
    code: str,
    course_id: UUID = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    listing_q = await db.execute(select(CourseListing).where(CourseListing.course_id == course_id))
    listing = listing_q.scalar_one_or_none()
    if listing is None:
        raise HTTPException(status_code=404, detail="course not found")
    inst = await db.get(InstructorProfile, listing.instructor_id)
    if inst is None:
        raise HTTPException(status_code=404, detail="instructor not found")
    q = await price_svc.quote(
        db, course_id=course_id, instructor=inst, user_id=current_user.id, coupon_code=code,
    )
    return PriceQuoteResponse(**q.__dict__)


# ---------------------------------------------------------------------------
# 10.5 Trust & safety
# ---------------------------------------------------------------------------


@router.post("/reports", response_model=ReportResponse, status_code=201)
async def create_report(
    payload: ReportCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.reason not in {r.value for r in ReportReason}:
        raise HTTPException(status_code=400, detail="unknown reason")
    if payload.target_type not in ("course", "review", "item", "comment", "instructor"):
        raise HTTPException(status_code=400, detail="unknown target_type")
    r = ContentReport(
        reporter_id=current_user.id,
        target_type=payload.target_type, target_id=payload.target_id,
        reason=payload.reason, details=payload.details, evidence_url=payload.evidence_url,
        severity=payload.severity,
    )
    db.add(r)
    await db.commit()
    await db.refresh(r)
    return r


@router.get("/admin/reports", response_model=list[ReportResponse])
async def admin_list_reports(
    status: str = Query("open"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    q = await db.execute(
        select(ContentReport).where(ContentReport.status == status)
        .order_by(ContentReport.severity.asc(), ContentReport.created_at.asc())
    )
    return list(q.scalars().all())


@router.post("/admin/reports/{report_id}/act", response_model=ModerationActionResponse)
async def admin_act_on_report(
    report_id: UUID,
    payload: ModerationActionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    report = await db.get(ContentReport, report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="report not found")
    try:
        action = await mod_svc.execute_action(
            db, report=report, actor_id=current_user.id,
            action=payload.action, rationale=payload.rationale, extra=payload.extra,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return ModerationActionResponse.model_validate(action, from_attributes=True)

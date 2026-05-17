"""
Phase 10 — Marketplace / creator-economy Pydantic schemas.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


# -- instructor ---------------------------------------------------------------

class InstructorOnboardRequest(BaseModel):
    public_slug: str = Field(..., min_length=3, max_length=80, pattern=r"^[a-z0-9][a-z0-9-]*$")
    display_name: str = Field(..., min_length=2, max_length=160)
    headline: Optional[str] = Field(None, max_length=280)
    bio_md: Optional[str] = None
    avatar_url: Optional[str] = None
    expertise_tags: list[str] = Field(default_factory=list)
    website_url: Optional[str] = None
    payout_currency: str = Field("USD", min_length=3, max_length=3)


class InstructorUpdateRequest(BaseModel):
    display_name: Optional[str] = Field(None, min_length=2, max_length=160)
    headline: Optional[str] = Field(None, max_length=280)
    bio_md: Optional[str] = None
    avatar_url: Optional[str] = None
    expertise_tags: Optional[list[str]] = None
    website_url: Optional[str] = None


class InstructorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    public_slug: str
    display_name: str
    headline: Optional[str]
    bio_md: Optional[str]
    avatar_url: Optional[str]
    expertise_tags: list[str]
    website_url: Optional[str]
    kyc_status: str
    payout_currency: str
    revenue_share: float
    status: str
    total_sales_cents: int
    total_courses_published: int
    avg_rating: Optional[float]
    created_at: datetime


class InstructorOnboardingLinkResponse(BaseModel):
    instructor_id: UUID
    stripe_connect_account_id: Optional[str]
    onboarding_url: Optional[str]
    is_stub: bool


class KycEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    source: str
    previous_status: Optional[str]
    new_status: str
    note: Optional[str]
    occurred_at: datetime


class PayoutResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    period_start: date
    period_end: date
    currency: str
    gross_cents: int
    platform_fee_cents: int
    payment_fee_cents: int
    refunds_cents: int
    net_cents: int
    status: str
    stripe_payout_id: Optional[str]
    paid_at: Optional[datetime]
    created_at: datetime


# -- listings + pricing -------------------------------------------------------

class ListingCreateRequest(BaseModel):
    course_id: UUID
    slug: str = Field(..., min_length=3, max_length=160, pattern=r"^[a-z0-9][a-z0-9-]*$")
    headline: str = Field(..., min_length=8, max_length=280)
    summary_md: Optional[str] = None
    hero_image_url: Optional[str] = None
    promo_video_url: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    target_skill_codes: list[str] = Field(default_factory=list)
    level: Optional[str] = None
    language: str = Field("en", min_length=2, max_length=8)
    estimated_hours: Optional[float] = Field(None, ge=0, le=1000)


class ListingUpdateRequest(BaseModel):
    headline: Optional[str] = Field(None, min_length=8, max_length=280)
    summary_md: Optional[str] = None
    hero_image_url: Optional[str] = None
    promo_video_url: Optional[str] = None
    tags: Optional[list[str]] = None
    target_skill_codes: Optional[list[str]] = None
    level: Optional[str] = None
    language: Optional[str] = Field(None, min_length=2, max_length=8)
    estimated_hours: Optional[float] = Field(None, ge=0, le=1000)


class ListingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_id: UUID
    instructor_id: UUID
    slug: str
    headline: str
    summary_md: Optional[str]
    hero_image_url: Optional[str]
    promo_video_url: Optional[str]
    tags: list[str]
    target_skill_codes: list[str]
    level: Optional[str]
    language: str
    estimated_hours: Optional[float]
    status: str
    enrolled_count: int
    review_count: int
    avg_rating: Optional[float]
    rank_score: float
    published_at: Optional[datetime]
    rejected_reason: Optional[str]
    created_at: datetime


class ListingReviewRequest(BaseModel):
    """Admin action on a listing: publish / reject / unlist."""
    action: str  # "publish" | "reject" | "unlist"
    rejected_reason: Optional[str] = None


class PricingRequest(BaseModel):
    currency: str = Field("USD", min_length=3, max_length=3)
    list_price_cents: int = Field(..., ge=0)
    sale_price_cents: Optional[int] = Field(None, ge=0)
    sale_starts_at: Optional[datetime] = None
    sale_ends_at: Optional[datetime] = None
    is_free: bool = False
    bulk_tiers: dict = Field(default_factory=dict)

    @model_validator(mode="after")
    def _sale_lt_list(self):
        if self.sale_price_cents is not None and self.sale_price_cents > self.list_price_cents:
            raise ValueError("sale_price_cents must be ≤ list_price_cents")
        return self


class PricingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    course_id: UUID
    currency: str
    list_price_cents: int
    sale_price_cents: Optional[int]
    sale_starts_at: Optional[datetime]
    sale_ends_at: Optional[datetime]
    is_free: bool
    bulk_tiers: dict
    updated_at: datetime


class PriceQuoteResponse(BaseModel):
    """Result of evaluating a price for a course at this moment, possibly with a coupon."""
    course_id: UUID
    currency: str
    list_price_cents: int
    sale_price_cents: Optional[int]
    effective_price_cents: int       # price before coupon
    coupon_code: Optional[str]
    coupon_discount_cents: int
    final_price_cents: int           # what user pays
    instructor_net_cents: int        # what creator gets
    platform_fee_cents: int
    is_free: bool
    notes: list[str] = Field(default_factory=list)


# -- purchases / checkout -----------------------------------------------------

class CheckoutRequest(BaseModel):
    course_id: UUID
    coupon_code: Optional[str] = None
    success_url: str
    cancel_url: str


class CheckoutResponse(BaseModel):
    purchase_id: UUID
    checkout_url: Optional[str]
    is_free: bool
    is_stub: bool


class PurchaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    course_id: UUID
    instructor_id: UUID
    currency: str
    list_price_cents: int
    discount_cents: int
    final_price_cents: int
    instructor_net_cents: int
    platform_fee_cents: int
    payment_fee_cents: int
    status: str
    stripe_session_id: Optional[str]
    stripe_payment_intent_id: Optional[str]
    coupon_id: Optional[UUID]
    paid_at: Optional[datetime]
    refunded_at: Optional[datetime]
    refund_reason: Optional[str]
    created_at: datetime


# -- reviews ------------------------------------------------------------------

class ReviewCreateRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = Field(None, max_length=160)
    body: Optional[str] = None


class ReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_id: UUID
    user_id: UUID
    rating: int
    title: Optional[str]
    body: Optional[str]
    verified_purchase: bool
    helpful_count: int
    flagged: bool
    created_at: datetime


# -- coupons ------------------------------------------------------------------

class CouponCreateRequest(BaseModel):
    code: str = Field(..., min_length=3, max_length=60, pattern=r"^[A-Za-z0-9_-]+$")
    description: Optional[str] = None
    kind: str  # "percent" | "amount_off"
    value: int = Field(..., gt=0)
    currency: str = Field("USD", min_length=3, max_length=3)
    scope: str = "global"
    scope_id: Optional[UUID] = None
    max_redemptions: Optional[int] = Field(None, gt=0)
    per_user_limit: int = Field(1, ge=1)
    valid_from: Optional[datetime] = None
    valid_to: Optional[datetime] = None
    is_active: bool = True


class CouponResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    code: str
    description: Optional[str]
    kind: str
    value: int
    currency: str
    scope: str
    scope_id: Optional[UUID]
    max_redemptions: Optional[int]
    used_count: int
    per_user_limit: int
    valid_from: datetime
    valid_to: Optional[datetime]
    is_active: bool
    created_at: datetime


# -- ranking ------------------------------------------------------------------

class RankedListingResponse(BaseModel):
    listing: ListingResponse
    instructor_display_name: str
    final_price_cents: int
    list_price_cents: int
    currency: str


# -- trust & safety -----------------------------------------------------------

class ReportCreateRequest(BaseModel):
    target_type: str
    target_id: UUID
    reason: str
    details: Optional[str] = None
    evidence_url: Optional[str] = None
    severity: int = Field(3, ge=1, le=5)


class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    reporter_id: Optional[UUID]
    target_type: str
    target_id: UUID
    reason: str
    details: Optional[str]
    evidence_url: Optional[str]
    status: str
    severity: int
    assigned_to: Optional[UUID]
    resolved_at: Optional[datetime]
    resolution_note: Optional[str]
    created_at: datetime


class ModerationActionRequest(BaseModel):
    action: str  # ModerationActionKind value
    rationale: Optional[str] = None
    extra: dict = Field(default_factory=dict)


class ModerationActionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    report_id: Optional[UUID]
    actor_id: Optional[UUID]
    target_type: str
    target_id: UUID
    action: str
    rationale: Optional[str]
    extra: dict = Field(default_factory=dict)
    occurred_at: datetime

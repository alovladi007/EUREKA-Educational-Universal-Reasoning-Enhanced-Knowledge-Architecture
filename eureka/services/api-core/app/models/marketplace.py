"""
Phase 10 — Marketplace / creator economy ORM.

Tables defined in eureka/ops/db/12_marketplace.sql.
"""

from __future__ import annotations

import enum
import uuid
from datetime import date, datetime

from sqlalchemy import (
    Boolean, CheckConstraint, Date, DateTime, ForeignKey, Index, Integer,
    Numeric, SmallInteger, String, Text, UniqueConstraint, func, BigInteger,
)
from sqlalchemy.dialects.postgresql import ARRAY, ENUM, JSONB, UUID


# PG enum bridges (create_type=False — the SQL migration created them).
_PG_INSTRUCTOR_STATUS = ENUM("draft", "pending_review", "approved", "suspended", name="instructor_status", create_type=False)
_PG_KYC_STATUS = ENUM("none", "pending", "verified", "rejected", name="kyc_status", create_type=False)
_PG_PAYOUT_STATUS = ENUM("accruing", "ready", "paid", "failed", "reversed", name="payout_status", create_type=False)
_PG_LISTING_STATUS = ENUM("draft", "pending_review", "published", "rejected", "unlisted", name="listing_status", create_type=False)
_PG_PURCHASE_STATUS = ENUM("pending", "paid", "refunded", "failed", name="purchase_status", create_type=False)
_PG_COUPON_SCOPE = ENUM("global", "org", "course", "cohort", "category", name="coupon_scope", create_type=False)
_PG_COUPON_KIND = ENUM("percent", "amount_off", name="coupon_kind", create_type=False)
_PG_REPORT_STATUS = ENUM("open", "triaged", "actioned", "dismissed", name="report_status", create_type=False)
_PG_REPORT_REASON = ENUM(
    "copyright", "plagiarism", "harassment", "hate", "sexual",
    "violence", "self_harm", "spam", "misinformation",
    "medical_misinformation", "safety_critical", "other",
    name="report_reason", create_type=False,
)
_PG_MOD_ACTION_KIND = ENUM(
    "unlist", "redact", "takedown", "shadow_ban",
    "notify_creator", "restore", "suspend_instructor",
    name="moderation_action_kind", create_type=False,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


# -- enums --------------------------------------------------------------------

class InstructorStatus(str, enum.Enum):
    draft = "draft"
    pending_review = "pending_review"
    approved = "approved"
    suspended = "suspended"


class KycStatus(str, enum.Enum):
    none = "none"
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class PayoutStatus(str, enum.Enum):
    accruing = "accruing"
    ready = "ready"
    paid = "paid"
    failed = "failed"
    reversed = "reversed"


class ListingStatus(str, enum.Enum):
    draft = "draft"
    pending_review = "pending_review"
    published = "published"
    rejected = "rejected"
    unlisted = "unlisted"


class PurchaseStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    refunded = "refunded"
    failed = "failed"


class CouponScope(str, enum.Enum):
    global_ = "global"
    org = "org"
    course = "course"
    cohort = "cohort"
    category = "category"


class CouponKind(str, enum.Enum):
    percent = "percent"
    amount_off = "amount_off"


class ReportStatus(str, enum.Enum):
    open = "open"
    triaged = "triaged"
    actioned = "actioned"
    dismissed = "dismissed"


class ReportReason(str, enum.Enum):
    copyright = "copyright"
    plagiarism = "plagiarism"
    harassment = "harassment"
    hate = "hate"
    sexual = "sexual"
    violence = "violence"
    self_harm = "self_harm"
    spam = "spam"
    misinformation = "misinformation"
    medical_misinformation = "medical_misinformation"
    safety_critical = "safety_critical"
    other = "other"


class ModerationActionKind(str, enum.Enum):
    unlist = "unlist"
    redact = "redact"
    takedown = "takedown"
    shadow_ban = "shadow_ban"
    notify_creator = "notify_creator"
    restore = "restore"
    suspend_instructor = "suspend_instructor"


# -- tables -------------------------------------------------------------------

class InstructorProfile(Base):
    __tablename__ = "instructor_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    public_slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(160), nullable=False)
    headline: Mapped[str | None] = mapped_column(String(280))
    bio_md: Mapped[str | None] = mapped_column(Text)
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    expertise_tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    website_url: Mapped[str | None] = mapped_column(String(500))
    stripe_connect_account_id: Mapped[str | None] = mapped_column(String(80))
    kyc_status: Mapped[str] = mapped_column(_PG_KYC_STATUS, default=KycStatus.none.value, nullable=False)
    kyc_last_event_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    payout_currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    revenue_share: Mapped[float] = mapped_column(Numeric(4, 3), default=0.700, nullable=False)
    status: Mapped[str] = mapped_column(_PG_INSTRUCTOR_STATUS, default=InstructorStatus.draft.value, nullable=False)
    total_sales_cents: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    total_courses_published: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    avg_rating: Mapped[float | None] = mapped_column(Numeric(3, 2))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class InstructorKycEvent(Base):
    __tablename__ = "instructor_kyc_events"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    instructor_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("instructor_profiles.id", ondelete="CASCADE"), nullable=False)
    source: Mapped[str] = mapped_column(String(80), nullable=False)
    previous_status: Mapped[str | None] = mapped_column(_PG_KYC_STATUS)
    new_status: Mapped[str] = mapped_column(_PG_KYC_STATUS, nullable=False)
    requirements: Mapped[dict] = mapped_column(JSONB, default=dict)
    note: Mapped[str | None] = mapped_column(Text)
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class InstructorPayout(Base):
    __tablename__ = "instructor_payouts"
    __table_args__ = (
        UniqueConstraint("instructor_id", "period_start", "period_end", name="uq_instructor_payout_period"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instructor_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("instructor_profiles.id", ondelete="CASCADE"), nullable=False)
    period_start: Mapped[date] = mapped_column(Date, nullable=False)
    period_end: Mapped[date] = mapped_column(Date, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    gross_cents: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    platform_fee_cents: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    payment_fee_cents: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    refunds_cents: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    net_cents: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    status: Mapped[str] = mapped_column(_PG_PAYOUT_STATUS, default=PayoutStatus.accruing.value, nullable=False)
    stripe_payout_id: Mapped[str | None] = mapped_column(String(80))
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class CourseListing(Base):
    __tablename__ = "course_listings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), unique=True, nullable=False)
    instructor_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("instructor_profiles.id", ondelete="RESTRICT"), nullable=False)
    slug: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    headline: Mapped[str] = mapped_column(String(280), nullable=False)
    summary_md: Mapped[str | None] = mapped_column(Text)
    hero_image_url: Mapped[str | None] = mapped_column(String(500))
    promo_video_url: Mapped[str | None] = mapped_column(String(500))
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    target_skill_codes: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    level: Mapped[str | None] = mapped_column(String(40))
    language: Mapped[str] = mapped_column(String(8), default="en", nullable=False)
    estimated_hours: Mapped[float | None] = mapped_column(Numeric(5, 2))
    status: Mapped[str] = mapped_column(_PG_LISTING_STATUS, default=ListingStatus.draft.value, nullable=False)
    enrolled_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    review_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    avg_rating: Mapped[float | None] = mapped_column(Numeric(3, 2))
    rank_score: Mapped[float] = mapped_column(Numeric(10, 4), default=0, nullable=False)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    rejected_reason: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class CoursePricing(Base):
    __tablename__ = "course_pricing"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), unique=True, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    list_price_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    sale_price_cents: Mapped[int | None] = mapped_column(Integer)
    sale_starts_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    sale_ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_free: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    bulk_tiers: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class MarketplacePurchase(Base):
    __tablename__ = "marketplace_purchases"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="RESTRICT"), nullable=False)
    instructor_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("instructor_profiles.id", ondelete="RESTRICT"), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    list_price_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    discount_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    final_price_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    platform_fee_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    payment_fee_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    instructor_net_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    stripe_session_id: Mapped[str | None] = mapped_column(String(120))
    stripe_payment_intent_id: Mapped[str | None] = mapped_column(String(120))
    coupon_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    status: Mapped[str] = mapped_column(_PG_PURCHASE_STATUS, default=PurchaseStatus.pending.value, nullable=False)
    refunded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    refund_reason: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class CourseReview(Base):
    __tablename__ = "course_reviews"
    __table_args__ = (
        UniqueConstraint("course_id", "user_id", name="uq_review_per_user_course"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    title: Mapped[str | None] = mapped_column(String(160))
    body: Mapped[str | None] = mapped_column(Text)
    verified_purchase: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    helpful_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    flagged: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Coupon(Base):
    __tablename__ = "coupons"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    kind: Mapped[str] = mapped_column(_PG_COUPON_KIND, nullable=False)
    value: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    scope: Mapped[str] = mapped_column(_PG_COUPON_SCOPE, default=CouponScope.global_.value, nullable=False)
    scope_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    max_redemptions: Mapped[int | None] = mapped_column(Integer)
    used_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    per_user_limit: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    valid_from: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    valid_to: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class CouponRedemption(Base):
    __tablename__ = "coupon_redemptions"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    coupon_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("coupons.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    purchase_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("marketplace_purchases.id", ondelete="SET NULL"))
    course_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="SET NULL"))
    discount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    redeemed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ContentReport(Base):
    __tablename__ = "content_reports"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reporter_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    target_type: Mapped[str] = mapped_column(String(40), nullable=False)
    target_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    reason: Mapped[str] = mapped_column(_PG_REPORT_REASON, nullable=False)
    details: Mapped[str | None] = mapped_column(Text)
    evidence_url: Mapped[str | None] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(_PG_REPORT_STATUS, default=ReportStatus.open.value, nullable=False)
    severity: Mapped[int] = mapped_column(SmallInteger, default=3, nullable=False)
    assigned_to: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    resolution_note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ModerationAction(Base):
    __tablename__ = "moderation_actions"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    report_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("content_reports.id", ondelete="SET NULL"))
    actor_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    target_type: Mapped[str] = mapped_column(String(40), nullable=False)
    target_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    action: Mapped[str] = mapped_column(_PG_MOD_ACTION_KIND, nullable=False)
    rationale: Mapped[str | None] = mapped_column(Text)
    extra: Mapped[dict] = mapped_column("metadata", JSONB, default=dict)
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

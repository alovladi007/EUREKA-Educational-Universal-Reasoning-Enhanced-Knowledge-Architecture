"""
Phase 11 — Go-to-market readiness ORM.

Tables defined in eureka/ops/db/13_gtm.sql.
"""

from __future__ import annotations

import enum
import uuid
from datetime import date, datetime

from sqlalchemy import (
    BigInteger, Boolean, CheckConstraint, Date, DateTime, ForeignKey, Index,
    Integer, SmallInteger, String, Text, UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import ARRAY, ENUM, JSONB, TSVECTOR, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


# -- enums (Python side) ------------------------------------------------------

class SubscriptionInterval(str, enum.Enum):
    monthly = "monthly"
    yearly = "yearly"


class SubscriptionStatus(str, enum.Enum):
    trialing = "trialing"
    active = "active"
    past_due = "past_due"
    canceled = "canceled"
    expired = "expired"
    unpaid = "unpaid"


class InvoiceStatus(str, enum.Enum):
    open = "open"
    paid = "paid"
    void = "void"
    uncollectible = "uncollectible"


class RefundStatus(str, enum.Enum):
    pending = "pending"
    succeeded = "succeeded"
    failed = "failed"
    canceled = "canceled"


class DunningOutcome(str, enum.Enum):
    queued = "queued"
    in_progress = "in_progress"
    paid = "paid"
    failed = "failed"
    abandoned = "abandoned"


class EmailSendStatus(str, enum.Enum):
    queued = "queued"
    sent = "sent"
    delivered = "delivered"
    bounced = "bounced"
    failed = "failed"
    opened = "opened"
    clicked = "clicked"
    unsubscribed = "unsubscribed"


class OnboardingStep(str, enum.Enum):
    created = "created"
    tier_selected = "tier_selected"
    goal_set = "goal_set"
    placement_taken = "placement_taken"
    first_recommendation_shown = "first_recommendation_shown"
    first_question_attempted = "first_question_attempted"
    first_session_complete = "first_session_complete"
    fully_onboarded = "fully_onboarded"


class TicketStatus(str, enum.Enum):
    open = "open"
    awaiting_user = "awaiting_user"
    awaiting_team = "awaiting_team"
    resolved = "resolved"
    closed = "closed"


class TicketPriority(str, enum.Enum):
    low = "low"
    normal = "normal"
    high = "high"
    urgent = "urgent"


class TicketCategory(str, enum.Enum):
    billing = "billing"
    account = "account"
    content_issue = "content_issue"
    bug = "bug"
    feature_request = "feature_request"
    safety = "safety"
    institutional = "institutional"
    other = "other"


# -- Postgres ENUM bridges ----------------------------------------------------

_PG_SUB_INTERVAL = ENUM("monthly", "yearly", name="subscription_interval", create_type=False)
_PG_SUB_STATUS = ENUM(
    "trialing", "active", "past_due", "canceled", "expired", "unpaid",
    name="subscription_status", create_type=False,
)
_PG_INV_STATUS = ENUM("open", "paid", "void", "uncollectible", name="invoice_status", create_type=False)
_PG_REF_STATUS = ENUM("pending", "succeeded", "failed", "canceled", name="refund_status", create_type=False)
_PG_DUN_OUTCOME = ENUM(
    "queued", "in_progress", "paid", "failed", "abandoned",
    name="dunning_outcome", create_type=False,
)
_PG_EMAIL_STATUS = ENUM(
    "queued", "sent", "delivered", "bounced", "failed", "opened", "clicked", "unsubscribed",
    name="email_send_status", create_type=False,
)
_PG_ONBOARDING_STEP = ENUM(
    "created", "tier_selected", "goal_set", "placement_taken",
    "first_recommendation_shown", "first_question_attempted",
    "first_session_complete", "fully_onboarded",
    name="onboarding_step", create_type=False,
)
_PG_TICKET_STATUS = ENUM(
    "open", "awaiting_user", "awaiting_team", "resolved", "closed",
    name="ticket_status", create_type=False,
)
_PG_TICKET_PRIORITY = ENUM("low", "normal", "high", "urgent", name="ticket_priority", create_type=False)
_PG_TICKET_CATEGORY = ENUM(
    "billing", "account", "content_issue", "bug", "feature_request",
    "safety", "institutional", "other",
    name="ticket_category", create_type=False,
)


# -- 11.1 Billing tables ------------------------------------------------------

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    interval: Mapped[str] = mapped_column(_PG_SUB_INTERVAL, nullable=False)
    price_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    trial_days: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    includes_marketplace_access: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    includes_unlimited_courses: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    includes_ai_tutor: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    includes_mock_exams: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    perks: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    stripe_price_id: Mapped[str | None] = mapped_column(String(80))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plan_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("subscription_plans.id", ondelete="RESTRICT"), nullable=False)
    status: Mapped[str] = mapped_column(_PG_SUB_STATUS, default=SubscriptionStatus.trialing.value, nullable=False)
    current_period_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    current_period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    cancel_at_period_end: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    canceled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    trial_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    stripe_subscription_id: Mapped[str | None] = mapped_column(String(80))
    stripe_customer_id: Mapped[str | None] = mapped_column(String(80))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    stripe_pm_id: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    type: Mapped[str] = mapped_column(String(40), default="card", nullable=False)
    brand: Mapped[str | None] = mapped_column(String(40))
    last4: Mapped[str | None] = mapped_column(String(8))
    exp_month: Mapped[int | None] = mapped_column(SmallInteger)
    exp_year: Mapped[int | None] = mapped_column(SmallInteger)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    detached_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subscription_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("subscriptions.id", ondelete="SET NULL"))
    purchase_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    subtotal_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    discount_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    tax_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    amount_paid_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(_PG_INV_STATUS, default=InvoiceStatus.open.value, nullable=False)
    period_start: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    period_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    issued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    voided_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    hosted_url: Mapped[str | None] = mapped_column(String(500))
    pdf_url: Mapped[str | None] = mapped_column(String(500))
    stripe_invoice_id: Mapped[str | None] = mapped_column(String(80))
    line_items: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Refund(Base):
    __tablename__ = "refunds"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("invoices.id", ondelete="SET NULL"))
    purchase_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    reason: Mapped[str | None] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(_PG_REF_STATUS, default=RefundStatus.pending.value, nullable=False)
    stripe_refund_id: Mapped[str | None] = mapped_column(String(80))
    requested_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    refunded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class DunningAttempt(Base):
    __tablename__ = "dunning_attempts"
    __table_args__ = (
        UniqueConstraint("invoice_id", "attempt_n", name="uq_dunning_invoice_attempt"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    invoice_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False)
    attempt_n: Mapped[int] = mapped_column(Integer, nullable=False)
    attempted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    outcome: Mapped[str] = mapped_column(_PG_DUN_OUTCOME, default=DunningOutcome.queued.value, nullable=False)
    next_retry_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    note: Mapped[str | None] = mapped_column(Text)


class TaxRate(Base):
    __tablename__ = "tax_rates"
    __table_args__ = (
        UniqueConstraint("country_code", "region_code", "label", "effective_from"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    country_code: Mapped[str] = mapped_column(String(2), nullable=False)
    region_code: Mapped[str | None] = mapped_column(String(8))
    rate_bps: Mapped[int] = mapped_column(Integer, nullable=False)
    label: Mapped[str] = mapped_column(String(60), nullable=False)
    inclusive: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    effective_from: Mapped[date] = mapped_column(Date, nullable=False)
    effective_to: Mapped[date | None] = mapped_column(Date)


# -- 11.2 SEO -----------------------------------------------------------------

class SkillLandingPage(Base):
    __tablename__ = "skill_landing_pages"
    __table_args__ = (
        UniqueConstraint("skill_code", "framework", "locale"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    skill_code: Mapped[str] = mapped_column(String(120), nullable=False)
    framework: Mapped[str] = mapped_column(String(40), nullable=False)
    slug: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    locale: Mapped[str] = mapped_column(String(8), default="en", nullable=False)
    h1: Mapped[str] = mapped_column(String(240), nullable=False)
    meta_title: Mapped[str] = mapped_column(String(240), nullable=False)
    meta_description: Mapped[str] = mapped_column(String(320), nullable=False)
    body_md: Mapped[str | None] = mapped_column(Text)
    faq: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    schema_jsonld: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    canonical_url: Mapped[str | None] = mapped_column(String(500))
    related_listing_ids: Mapped[list[uuid.UUID]] = mapped_column(ARRAY(UUID(as_uuid=True)), default=list)
    related_item_ids: Mapped[list[uuid.UUID]] = mapped_column(ARRAY(UUID(as_uuid=True)), default=list)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    last_generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# -- 11.3 Email lifecycle -----------------------------------------------------

class EmailTemplate(Base):
    __tablename__ = "email_templates"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    kind: Mapped[str] = mapped_column(String(40), nullable=False)
    locale: Mapped[str] = mapped_column(String(8), default="en", nullable=False)
    subject: Mapped[str] = mapped_column(String(240), nullable=False)
    html: Mapped[str] = mapped_column(Text, nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class EmailCampaign(Base):
    __tablename__ = "email_campaigns"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    template_slug: Mapped[str] = mapped_column(String(80), nullable=False)
    trigger_event: Mapped[str] = mapped_column(String(80), nullable=False)
    delay_minutes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    filter_jsonb: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class EmailSend(Base):
    __tablename__ = "email_sends"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    campaign_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("email_campaigns.id", ondelete="SET NULL"))
    template_slug: Mapped[str] = mapped_column(String(80), nullable=False)
    to_email: Mapped[str] = mapped_column(String(255), nullable=False)
    subject: Mapped[str] = mapped_column(String(240), nullable=False)
    status: Mapped[str] = mapped_column(_PG_EMAIL_STATUS, default=EmailSendStatus.queued.value, nullable=False)
    provider: Mapped[str | None] = mapped_column(String(40))
    provider_message_id: Mapped[str | None] = mapped_column(String(120))
    queued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    opened_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    clicked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    bounced_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    error_message: Mapped[str | None] = mapped_column(Text)
    context_jsonb: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)


class EmailUnsubscribe(Base):
    __tablename__ = "email_unsubscribes"
    __table_args__ = (
        UniqueConstraint("user_id", "scope", name="uq_unsub_user_scope"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scope: Mapped[str] = mapped_column(String(80), nullable=False)
    reason: Mapped[str | None] = mapped_column(Text)
    unsubscribed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# -- 11.4 Onboarding ----------------------------------------------------------

class OnboardingState(Base):
    __tablename__ = "onboarding_states"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    current_step: Mapped[str] = mapped_column(_PG_ONBOARDING_STEP, default=OnboardingStep.created.value, nullable=False)
    chosen_tier: Mapped[str | None] = mapped_column(String(40))
    chosen_exam: Mapped[str | None] = mapped_column(String(80))
    chosen_goal: Mapped[str | None] = mapped_column(Text)
    target_date: Mapped[date | None] = mapped_column(Date)
    step_history: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    first_recommendation_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    first_attempt_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    first_session_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class OnboardingEvent(Base):
    __tablename__ = "onboarding_events"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    step: Mapped[str] = mapped_column(_PG_ONBOARDING_STEP, nullable=False)
    kind: Mapped[str] = mapped_column(String(20), nullable=False)
    extra: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# -- 11.5 Support + KB -------------------------------------------------------

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject: Mapped[str] = mapped_column(String(240), nullable=False)
    status: Mapped[str] = mapped_column(_PG_TICKET_STATUS, default=TicketStatus.open.value, nullable=False)
    priority: Mapped[str] = mapped_column(_PG_TICKET_PRIORITY, default=TicketPriority.normal.value, nullable=False)
    category: Mapped[str] = mapped_column(_PG_TICKET_CATEGORY, default=TicketCategory.other.value, nullable=False)
    assigned_to: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    last_user_reply_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_team_reply_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    related_kind: Mapped[str | None] = mapped_column(String(40))
    related_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    extra: Mapped[dict] = mapped_column("metadata", JSONB, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class SupportMessage(Base):
    __tablename__ = "support_messages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("support_tickets.id", ondelete="CASCADE"), nullable=False)
    author_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    is_internal_note: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    body_md: Mapped[str] = mapped_column(Text, nullable=False)
    attachments: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class KbArticle(Base):
    __tablename__ = "kb_articles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(240), nullable=False)
    summary: Mapped[str | None] = mapped_column(Text)
    body_md: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(60), default="general", nullable=False)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    locale: Mapped[str] = mapped_column(String(8), default="en", nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    view_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    helpful_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    not_helpful_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    # Auto-maintained by a Postgres trigger.
    search_tsv = mapped_column(TSVECTOR, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

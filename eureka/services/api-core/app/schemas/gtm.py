"""
Phase 11 — Go-to-market Pydantic schemas.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------- 11.1 Billing ----------

class PlanCreateRequest(BaseModel):
    slug: str = Field(..., min_length=3, max_length=60, pattern=r"^[a-z0-9][a-z0-9-]*$")
    name: str = Field(..., min_length=3, max_length=120)
    description: Optional[str] = None
    interval: str  # 'monthly' | 'yearly'
    price_cents: int = Field(..., ge=0)
    currency: str = Field("USD", min_length=3, max_length=3)
    trial_days: int = Field(0, ge=0, le=90)
    includes_marketplace_access: bool = False
    includes_unlimited_courses: bool = False
    includes_ai_tutor: bool = False
    includes_mock_exams: bool = False
    perks: list[str] = Field(default_factory=list)
    stripe_price_id: Optional[str] = None
    sort_order: int = 0


class PlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    name: str
    description: Optional[str]
    interval: str
    price_cents: int
    currency: str
    trial_days: int
    includes_marketplace_access: bool
    includes_unlimited_courses: bool
    includes_ai_tutor: bool
    includes_mock_exams: bool
    perks: list[str]
    is_active: bool
    sort_order: int


class SubscriptionStartRequest(BaseModel):
    plan_slug: str


class SubscriptionChangeRequest(BaseModel):
    plan_slug: str
    apply_proration: bool = True


class ProrationResponse(BaseModel):
    credit_cents: int
    new_charge_cents: int
    net_charge_cents: int
    period_days: int
    remaining_days: int
    description: str


class SubscriptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    plan_id: UUID
    status: str
    current_period_start: datetime
    current_period_end: datetime
    cancel_at_period_end: bool
    canceled_at: Optional[datetime]
    trial_end: Optional[datetime]


class InvoiceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    subscription_id: Optional[UUID]
    purchase_id: Optional[UUID]
    currency: str
    subtotal_cents: int
    discount_cents: int
    tax_cents: int
    total_cents: int
    amount_paid_cents: int
    status: str
    period_start: Optional[datetime]
    period_end: Optional[datetime]
    issued_at: datetime
    paid_at: Optional[datetime]
    voided_at: Optional[datetime]
    line_items: list


class RefundCreateRequest(BaseModel):
    invoice_id: Optional[UUID] = None
    purchase_id: Optional[UUID] = None
    amount_cents: int = Field(..., gt=0)
    reason: Optional[str] = None


class RefundResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    invoice_id: Optional[UUID]
    purchase_id: Optional[UUID]
    user_id: UUID
    amount_cents: int
    currency: str
    reason: Optional[str]
    status: str
    refunded_at: Optional[datetime]
    created_at: datetime


class DunningResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    invoice_id: UUID
    attempt_n: int
    attempted_at: datetime
    outcome: str
    next_retry_at: Optional[datetime]
    note: Optional[str]


class TaxRateCreateRequest(BaseModel):
    country_code: str = Field(..., min_length=2, max_length=2)
    region_code: Optional[str] = Field(None, max_length=8)
    rate_bps: int = Field(..., ge=0, le=10000)
    label: str = Field(..., max_length=60)
    inclusive: bool = False
    effective_from: Optional[date] = None
    effective_to: Optional[date] = None


class TaxQuoteResponse(BaseModel):
    rate_bps: int
    tax_cents: int
    label: str
    inclusive: bool
    subtotal_cents: int
    total_cents: int


# ---------- 11.2 SEO ----------

class LandingPageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    skill_code: str
    framework: str
    slug: str
    locale: str
    h1: str
    meta_title: str
    meta_description: str
    body_md: Optional[str]
    faq: list
    schema_jsonld: dict
    is_published: bool
    related_listing_ids: list[UUID]
    last_generated_at: datetime


class LandingPageGenerateRequest(BaseModel):
    skill_code: str
    framework: str
    locale: str = "en"
    publish: bool = False


# ---------- 11.3 Email ----------

class TemplateCreateRequest(BaseModel):
    slug: str = Field(..., min_length=3, max_length=80, pattern=r"^[a-z0-9][a-z0-9_-]*$")
    kind: str = Field(..., max_length=40)
    locale: str = Field("en", min_length=2, max_length=8)
    subject: str = Field(..., min_length=3, max_length=240)
    html: str
    text: str
    description: Optional[str] = None
    is_active: bool = True


class TemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    kind: str
    locale: str
    subject: str
    html: str
    text: str
    description: Optional[str]
    is_active: bool


class CampaignCreateRequest(BaseModel):
    slug: str = Field(..., min_length=3, max_length=80, pattern=r"^[a-z0-9][a-z0-9_-]*$")
    template_slug: str
    trigger_event: str = Field(..., min_length=3, max_length=80)
    delay_minutes: int = Field(0, ge=0, le=14 * 24 * 60)
    filter_jsonb: dict = Field(default_factory=dict)
    is_active: bool = True


class CampaignResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    template_slug: str
    trigger_event: str
    delay_minutes: int
    filter_jsonb: dict
    is_active: bool
    created_at: datetime


class EmailDispatchRequest(BaseModel):
    """Admin / dev-only: synthesise an event to test campaigns."""
    event: str
    user_id: UUID
    payload: dict = Field(default_factory=dict)


class EmailSendResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: Optional[UUID]
    campaign_id: Optional[UUID]
    template_slug: str
    to_email: str
    subject: str
    status: str
    provider: Optional[str]
    queued_at: datetime
    sent_at: Optional[datetime]
    opened_at: Optional[datetime]


class UnsubscribeRequest(BaseModel):
    scope: str = "marketing"
    reason: Optional[str] = None


# ---------- 11.4 Onboarding ----------

class OnboardingStateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: UUID
    current_step: str
    chosen_tier: Optional[str]
    chosen_exam: Optional[str]
    chosen_goal: Optional[str]
    target_date: Optional[date]
    step_history: list
    started_at: datetime
    first_recommendation_at: Optional[datetime]
    first_attempt_at: Optional[datetime]
    first_session_at: Optional[datetime]
    completed_at: Optional[datetime]
    time_to_first_value_seconds: Optional[float] = None


class OnboardingSetGoalRequest(BaseModel):
    tier: Optional[str] = None
    exam: Optional[str] = None
    goal: Optional[str] = None
    target_date: Optional[str] = None


class OnboardingAdvanceRequest(BaseModel):
    step: str
    extra: dict = Field(default_factory=dict)


# ---------- 11.5 Support + KB ----------

class TicketCreateRequest(BaseModel):
    subject: str = Field(..., min_length=3, max_length=240)
    body_md: str = Field(..., min_length=1)
    priority: str = "normal"
    category: str = "other"
    related_kind: Optional[str] = None
    related_id: Optional[UUID] = None


class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    subject: str
    status: str
    priority: str
    category: str
    assigned_to: Optional[UUID]
    last_user_reply_at: Optional[datetime]
    last_team_reply_at: Optional[datetime]
    resolved_at: Optional[datetime]
    related_kind: Optional[str]
    related_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime


class TicketReplyRequest(BaseModel):
    body_md: str = Field(..., min_length=1)
    is_internal_note: bool = False
    attachments: list = Field(default_factory=list)


class TicketUpdateRequest(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    assigned_to: Optional[UUID] = None


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    ticket_id: UUID
    author_id: Optional[UUID]
    is_internal_note: bool
    body_md: str
    attachments: list
    created_at: datetime


class KbArticleCreateRequest(BaseModel):
    slug: str = Field(..., min_length=3, max_length=160, pattern=r"^[a-z0-9][a-z0-9-]*$")
    title: str = Field(..., min_length=3, max_length=240)
    summary: Optional[str] = None
    body_md: str = Field(..., min_length=1)
    category: str = "general"
    tags: list[str] = Field(default_factory=list)
    locale: str = "en"
    is_published: bool = False


class KbArticleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    title: str
    summary: Optional[str]
    body_md: str
    category: str
    tags: list[str]
    locale: str
    is_published: bool
    view_count: int
    helpful_count: int
    not_helpful_count: int
    created_at: datetime
    updated_at: datetime


class KbFeedbackRequest(BaseModel):
    helpful: bool

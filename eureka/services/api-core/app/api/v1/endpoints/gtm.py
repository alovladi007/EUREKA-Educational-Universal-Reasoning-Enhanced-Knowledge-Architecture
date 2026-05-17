"""
Phase 11 — Go-to-market REST surface.

Endpoint map
============

11.1 Billing
  POST   /admin/plans                          create plan (admin)
  GET    /plans                                public price list
  POST   /me/subscription                      start a subscription
  GET    /me/subscription                      my subscription
  POST   /me/subscription/change               change plan (proration)
  POST   /me/subscription/cancel               cancel (default: at period end)
  POST   /admin/tax-rates                      register a tax row
  GET    /tax-quote                            preview tax on a subtotal
  GET    /me/invoices                          my invoices
  POST   /admin/invoices/{id}/mark-paid        admin: mark invoice paid (stub)
  POST   /admin/invoices/{id}/dunning          schedule next dunning attempt
  POST   /me/refunds                           request a refund
  POST   /admin/refunds/{id}/approve           approve refund (admin)

11.2 SEO
  POST   /admin/seo/skill-pages/generate       (admin) generate a page from a skill
  GET    /seo/skill-pages/{slug}               public: read a published page
  GET    /admin/seo/skill-pages                (admin) list

11.3 Email lifecycle
  POST   /admin/email/templates                (admin) upsert template
  POST   /admin/email/campaigns                (admin) create campaign
  POST   /admin/email/dispatch                 (admin) fire an event manually
  GET    /me/email/sends                       my email send history
  POST   /me/email/unsubscribe                 unsubscribe (scope: marketing/all)

11.4 Onboarding
  GET    /me/onboarding                        my state (+ time_to_first_value)
  POST   /me/onboarding/goal                   set tier/exam/goal/target_date
  POST   /me/onboarding/advance                advance to next step
  GET    /admin/onboarding/funnel              (admin) aggregate funnel metrics

11.5 Support + KB
  POST   /me/tickets                           open a ticket
  GET    /me/tickets                           my tickets
  GET    /tickets/{id}                         get one ticket (+ thread)
  POST   /tickets/{id}/reply                   add a reply
  PATCH  /admin/tickets/{id}                   (admin) update status/priority/assignee
  POST   /admin/kb                             (admin) create KB article
  PATCH  /admin/kb/{slug}                      (admin) update KB article
  GET    /kb                                   public KB search (?q=)
  GET    /kb/{slug}                            public KB read (increments views)
  POST   /kb/{slug}/feedback                   helpful/not-helpful
"""

from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import desc, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.gtm import (
    DunningAttempt,
    DunningOutcome,
    EmailCampaign,
    EmailSend,
    EmailSendStatus,
    EmailTemplate,
    EmailUnsubscribe,
    Invoice,
    InvoiceStatus,
    KbArticle,
    OnboardingState,
    OnboardingStep,
    PaymentMethod,
    Refund,
    RefundStatus,
    SkillLandingPage,
    Subscription,
    SubscriptionPlan,
    SubscriptionStatus,
    SupportMessage,
    SupportTicket,
    TaxRate,
    TicketStatus,
)
from app.models.skill import Skill
from app.models.user import User
from app.schemas.gtm import (
    CampaignCreateRequest,
    CampaignResponse,
    DunningResponse,
    EmailDispatchRequest,
    EmailSendResponse,
    InvoiceResponse,
    KbArticleCreateRequest,
    KbArticleResponse,
    KbFeedbackRequest,
    LandingPageGenerateRequest,
    LandingPageResponse,
    MessageResponse,
    OnboardingAdvanceRequest,
    OnboardingSetGoalRequest,
    OnboardingStateResponse,
    PlanCreateRequest,
    PlanResponse,
    ProrationResponse,
    RefundCreateRequest,
    RefundResponse,
    SubscriptionChangeRequest,
    SubscriptionResponse,
    SubscriptionStartRequest,
    TaxQuoteResponse,
    TaxRateCreateRequest,
    TemplateCreateRequest,
    TemplateResponse,
    TicketCreateRequest,
    TicketReplyRequest,
    TicketResponse,
    TicketUpdateRequest,
    UnsubscribeRequest,
)
from app.services import billing as billing_svc
from app.services import email_lifecycle as email_svc
from app.services import onboarding as onboarding_svc
from app.services import seo_landing as seo_svc
from app.utils.dependencies import get_current_user


router = APIRouter()


def _is_admin(user: User) -> bool:
    role = user.role.value if hasattr(user.role, "value") else user.role
    return role in ("org_admin", "super_admin")


def _require_admin(user: User) -> None:
    if not _is_admin(user):
        raise HTTPException(status_code=403, detail="admin role required")


def _utc() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# 11.1 Billing — plans, subscriptions, invoices, refunds, tax, dunning
# ---------------------------------------------------------------------------


@router.post("/admin/plans", response_model=PlanResponse, status_code=201)
async def create_plan(
    payload: PlanCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    plan = SubscriptionPlan(**payload.model_dump())
    db.add(plan)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="plan slug already exists") from exc
    await db.refresh(plan)
    return plan


@router.get("/plans", response_model=list[PlanResponse])
async def list_plans(db: AsyncSession = Depends(get_db)):
    q = await db.execute(
        select(SubscriptionPlan).where(SubscriptionPlan.is_active.is_(True))
        .order_by(SubscriptionPlan.sort_order, SubscriptionPlan.price_cents)
    )
    return list(q.scalars().all())


@router.post("/me/subscription", response_model=SubscriptionResponse, status_code=201)
async def start_subscription(
    payload: SubscriptionStartRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan_q = await db.execute(select(SubscriptionPlan).where(SubscriptionPlan.slug == payload.plan_slug))
    plan = plan_q.scalar_one_or_none()
    if plan is None:
        raise HTTPException(status_code=404, detail="plan not found")
    # Refuse if there's already an active sub.
    active_q = await db.execute(
        select(Subscription).where(
            Subscription.user_id == current_user.id,
            Subscription.status.in_(("trialing", "active", "past_due")),
        )
    )
    if active_q.scalar_one_or_none() is not None:
        raise HTTPException(status_code=409, detail="you already have an active subscription")
    sub = await billing_svc.start_subscription(db, user_id=current_user.id, plan=plan)
    return sub


@router.get("/me/subscription", response_model=Optional[SubscriptionResponse])
async def get_my_subscription(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(
        select(Subscription).where(Subscription.user_id == current_user.id)
        .order_by(Subscription.created_at.desc()).limit(1)
    )
    return q.scalar_one_or_none()


@router.post("/me/subscription/change", response_model=ProrationResponse)
async def change_my_plan(
    payload: SubscriptionChangeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sub_q = await db.execute(
        select(Subscription).where(
            Subscription.user_id == current_user.id,
            Subscription.status.in_(("trialing", "active", "past_due")),
        )
    )
    sub = sub_q.scalar_one_or_none()
    if sub is None:
        raise HTTPException(status_code=404, detail="no active subscription")
    plan_q = await db.execute(select(SubscriptionPlan).where(SubscriptionPlan.slug == payload.plan_slug))
    new_plan = plan_q.scalar_one_or_none()
    if new_plan is None:
        raise HTTPException(status_code=404, detail="plan not found")
    if new_plan.id == sub.plan_id:
        raise HTTPException(status_code=409, detail="already on that plan")
    _, proration = await billing_svc.change_plan(
        db, subscription=sub, new_plan=new_plan, apply_proration=payload.apply_proration,
    )
    if proration is None:
        return ProrationResponse(
            credit_cents=0, new_charge_cents=new_plan.price_cents,
            net_charge_cents=new_plan.price_cents,
            period_days=0, remaining_days=0,
            description="No proration applied.",
        )
    return ProrationResponse(**proration.__dict__)


@router.post("/me/subscription/cancel", response_model=SubscriptionResponse)
async def cancel_my_subscription(
    at_period_end: bool = Query(True),
    reason: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sub_q = await db.execute(
        select(Subscription).where(
            Subscription.user_id == current_user.id,
            Subscription.status.in_(("trialing", "active", "past_due")),
        )
    )
    sub = sub_q.scalar_one_or_none()
    if sub is None:
        raise HTTPException(status_code=404, detail="no active subscription")
    return await billing_svc.cancel_subscription(db, subscription=sub, at_period_end=at_period_end, reason=reason)


@router.post("/admin/tax-rates", status_code=201)
async def create_tax_rate(
    payload: TaxRateCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    tr = TaxRate(
        country_code=payload.country_code.upper(),
        region_code=payload.region_code,
        rate_bps=payload.rate_bps,
        label=payload.label,
        inclusive=payload.inclusive,
        effective_from=payload.effective_from or date.today(),
        effective_to=payload.effective_to,
    )
    db.add(tr)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="tax rate already exists") from exc
    await db.refresh(tr)
    return {"id": str(tr.id)}


@router.get("/tax-quote", response_model=TaxQuoteResponse)
async def tax_quote(
    subtotal_cents: int = Query(..., ge=0),
    country_code: str = Query(..., min_length=2, max_length=2),
    region_code: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = await billing_svc.quote_tax(
        db, subtotal_cents=subtotal_cents,
        country_code=country_code.upper(), region_code=region_code,
    )
    total = subtotal_cents if q.inclusive else subtotal_cents + q.tax_cents
    return TaxQuoteResponse(
        rate_bps=q.rate_bps, tax_cents=q.tax_cents, label=q.label,
        inclusive=q.inclusive, subtotal_cents=subtotal_cents, total_cents=total,
    )


@router.get("/me/invoices", response_model=list[InvoiceResponse])
async def my_invoices(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(
        select(Invoice).where(Invoice.user_id == current_user.id)
        .order_by(Invoice.issued_at.desc())
    )
    return list(q.scalars().all())


@router.post("/admin/invoices/{invoice_id}/mark-paid", response_model=InvoiceResponse)
async def admin_mark_invoice_paid(
    invoice_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    inv = await db.get(Invoice, invoice_id)
    if inv is None:
        raise HTTPException(status_code=404, detail="invoice not found")
    inv.status = InvoiceStatus.paid.value
    inv.paid_at = _utc()
    inv.amount_paid_cents = inv.total_cents
    await db.commit()
    await db.refresh(inv)
    return inv


@router.post("/admin/invoices/{invoice_id}/dunning", response_model=DunningResponse)
async def admin_schedule_dunning(
    invoice_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    inv = await db.get(Invoice, invoice_id)
    if inv is None:
        raise HTTPException(status_code=404, detail="invoice not found")
    return await billing_svc.schedule_dunning(db, invoice=inv)


@router.post("/me/refunds", response_model=RefundResponse, status_code=201)
async def request_refund(
    payload: RefundCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.invoice_id is None and payload.purchase_id is None:
        raise HTTPException(status_code=400, detail="invoice_id or purchase_id required")
    currency = "USD"
    if payload.invoice_id:
        inv = await db.get(Invoice, payload.invoice_id)
        if inv is None:
            raise HTTPException(status_code=404, detail="invoice not found")
        if inv.user_id != current_user.id and not _is_admin(current_user):
            raise HTTPException(status_code=403, detail="not your invoice")
        currency = inv.currency
        if payload.amount_cents > inv.amount_paid_cents:
            raise HTTPException(status_code=400, detail="refund exceeds amount paid")
    refund = Refund(
        invoice_id=payload.invoice_id, purchase_id=payload.purchase_id,
        user_id=current_user.id, amount_cents=payload.amount_cents,
        currency=currency, reason=payload.reason,
        status=RefundStatus.pending.value, requested_by=current_user.id,
    )
    db.add(refund)
    await db.commit()
    await db.refresh(refund)
    return refund


@router.post("/admin/refunds/{refund_id}/approve", response_model=RefundResponse)
async def admin_approve_refund(
    refund_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    refund = await db.get(Refund, refund_id)
    if refund is None:
        raise HTTPException(status_code=404, detail="refund not found")
    refund.status = RefundStatus.succeeded.value
    refund.refunded_at = _utc()
    await db.commit()
    await db.refresh(refund)
    return refund


# ---------------------------------------------------------------------------
# 11.2 SEO
# ---------------------------------------------------------------------------


@router.post("/admin/seo/skill-pages/generate", response_model=LandingPageResponse)
async def admin_generate_landing_page(
    payload: LandingPageGenerateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    q = await db.execute(
        select(Skill).where(Skill.code == payload.skill_code)
    )
    skill = q.scalar_one_or_none()
    if skill is None:
        raise HTTPException(status_code=404, detail="skill not found")
    return await seo_svc.generate_or_refresh(db, skill=skill, locale=payload.locale, publish=payload.publish)


@router.get("/seo/skill-pages/{slug}", response_model=LandingPageResponse)
async def public_landing_page(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    q = await db.execute(
        select(SkillLandingPage).where(SkillLandingPage.slug == slug, SkillLandingPage.is_published.is_(True))
    )
    page = q.scalar_one_or_none()
    if page is None:
        raise HTTPException(status_code=404, detail="not found")
    return page


@router.get("/admin/seo/skill-pages", response_model=list[LandingPageResponse])
async def admin_list_landing_pages(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    q = await db.execute(select(SkillLandingPage).order_by(SkillLandingPage.last_generated_at.desc()).limit(200))
    return list(q.scalars().all())


# ---------------------------------------------------------------------------
# 11.3 Email lifecycle
# ---------------------------------------------------------------------------


@router.post("/admin/email/templates", response_model=TemplateResponse, status_code=201)
async def admin_upsert_template(
    payload: TemplateCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    q = await db.execute(select(EmailTemplate).where(EmailTemplate.slug == payload.slug))
    tpl = q.scalar_one_or_none()
    if tpl is None:
        tpl = EmailTemplate(**payload.model_dump())
        db.add(tpl)
    else:
        for k, v in payload.model_dump().items():
            setattr(tpl, k, v)
    await db.commit()
    await db.refresh(tpl)
    return tpl


@router.post("/admin/email/campaigns", response_model=CampaignResponse, status_code=201)
async def admin_create_campaign(
    payload: CampaignCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    camp = EmailCampaign(**payload.model_dump())
    db.add(camp)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="campaign slug already exists") from exc
    await db.refresh(camp)
    return camp


@router.post("/admin/email/dispatch", response_model=list[EmailSendResponse])
async def admin_dispatch_event(
    payload: EmailDispatchRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    sends = await email_svc.dispatch(
        db, event=payload.event, user_id=payload.user_id, payload=payload.payload,
    )
    return sends


@router.get("/me/email/sends", response_model=list[EmailSendResponse])
async def my_email_sends(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(
        select(EmailSend).where(EmailSend.user_id == current_user.id)
        .order_by(EmailSend.queued_at.desc()).limit(100)
    )
    return list(q.scalars().all())


@router.post("/me/email/unsubscribe", status_code=204)
async def unsubscribe(
    payload: UnsubscribeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = EmailUnsubscribe(user_id=current_user.id, scope=payload.scope, reason=payload.reason)
    db.add(row)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()


# ---------------------------------------------------------------------------
# 11.4 Onboarding
# ---------------------------------------------------------------------------


@router.get("/me/onboarding", response_model=OnboardingStateResponse)
async def get_my_onboarding(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    state = await onboarding_svc.ensure_state(db, user_id=current_user.id)
    out = OnboardingStateResponse.model_validate(state, from_attributes=True)
    out.time_to_first_value_seconds = onboarding_svc.time_to_first_value(state)
    return out


@router.post("/me/onboarding/goal", response_model=OnboardingStateResponse)
async def set_my_goal(
    payload: OnboardingSetGoalRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    state = await onboarding_svc.set_goal(
        db, user_id=current_user.id,
        tier=payload.tier, exam=payload.exam,
        goal=payload.goal, target_date=payload.target_date,
    )
    out = OnboardingStateResponse.model_validate(state, from_attributes=True)
    out.time_to_first_value_seconds = onboarding_svc.time_to_first_value(state)
    return out


@router.post("/me/onboarding/advance", response_model=OnboardingStateResponse)
async def advance_my_onboarding(
    payload: OnboardingAdvanceRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        state = await onboarding_svc.advance_to(
            db, user_id=current_user.id, step=payload.step, extra=payload.extra,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    out = OnboardingStateResponse.model_validate(state, from_attributes=True)
    out.time_to_first_value_seconds = onboarding_svc.time_to_first_value(state)
    return out


@router.get("/admin/onboarding/funnel")
async def admin_onboarding_funnel(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    rows = (await db.execute(
        select(OnboardingState.current_step, func.count(OnboardingState.user_id))
        .group_by(OnboardingState.current_step)
    )).all()
    avg_q = await db.execute(
        select(func.avg(
            func.extract("epoch", OnboardingState.first_attempt_at - OnboardingState.started_at)
        )).where(OnboardingState.first_attempt_at.is_not(None))
    )
    avg_ttv = avg_q.scalar()
    return {
        "by_step": {step: int(count) for step, count in rows},
        "avg_time_to_first_value_seconds": float(avg_ttv) if avg_ttv is not None else None,
    }


# ---------------------------------------------------------------------------
# 11.5 Support + KB
# ---------------------------------------------------------------------------


@router.post("/me/tickets", response_model=TicketResponse, status_code=201)
async def create_ticket(
    payload: TicketCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = SupportTicket(
        user_id=current_user.id,
        subject=payload.subject,
        priority=payload.priority,
        category=payload.category,
        related_kind=payload.related_kind,
        related_id=payload.related_id,
    )
    db.add(ticket)
    await db.flush()
    msg = SupportMessage(
        ticket_id=ticket.id, author_id=current_user.id, body_md=payload.body_md,
    )
    db.add(msg)
    ticket.last_user_reply_at = _utc()
    await db.commit()
    await db.refresh(ticket)
    return ticket


@router.get("/me/tickets", response_model=list[TicketResponse])
async def my_tickets(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(
        select(SupportTicket).where(SupportTicket.user_id == current_user.id)
        .order_by(SupportTicket.created_at.desc())
    )
    return list(q.scalars().all())


@router.get("/tickets/{ticket_id}")
async def get_ticket(
    ticket_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = await db.get(SupportTicket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="ticket not found")
    if ticket.user_id != current_user.id and not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="not your ticket")
    msgs_q = await db.execute(
        select(SupportMessage).where(SupportMessage.ticket_id == ticket_id)
        .order_by(SupportMessage.created_at)
    )
    msgs = list(msgs_q.scalars().all())
    return {
        "ticket": TicketResponse.model_validate(ticket, from_attributes=True),
        "messages": [
            MessageResponse.model_validate(m, from_attributes=True)
            for m in msgs
            # hide internal notes from the requesting end-user
            if (not m.is_internal_note) or _is_admin(current_user)
        ],
    }


@router.post("/tickets/{ticket_id}/reply", response_model=MessageResponse, status_code=201)
async def reply_to_ticket(
    ticket_id: UUID,
    payload: TicketReplyRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = await db.get(SupportTicket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="ticket not found")
    if ticket.user_id != current_user.id and not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="not your ticket")
    if payload.is_internal_note and not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="only admins can post internal notes")
    msg = SupportMessage(
        ticket_id=ticket.id, author_id=current_user.id,
        body_md=payload.body_md, attachments=payload.attachments,
        is_internal_note=payload.is_internal_note,
    )
    db.add(msg)
    now = _utc()
    if _is_admin(current_user):
        ticket.last_team_reply_at = now
        if ticket.status == TicketStatus.open.value:
            ticket.status = TicketStatus.awaiting_user.value
    else:
        ticket.last_user_reply_at = now
        if ticket.status == TicketStatus.awaiting_user.value:
            ticket.status = TicketStatus.awaiting_team.value
    await db.commit()
    await db.refresh(msg)
    return msg


@router.patch("/admin/tickets/{ticket_id}", response_model=TicketResponse)
async def admin_update_ticket(
    ticket_id: UUID,
    payload: TicketUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    ticket = await db.get(SupportTicket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="ticket not found")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(ticket, k, v)
    if data.get("status") in (TicketStatus.resolved.value, TicketStatus.closed.value):
        ticket.resolved_at = _utc()
    await db.commit()
    await db.refresh(ticket)
    return ticket


@router.post("/admin/kb", response_model=KbArticleResponse, status_code=201)
async def admin_create_kb_article(
    payload: KbArticleCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    article = KbArticle(**payload.model_dump())
    db.add(article)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="slug already exists") from exc
    await db.refresh(article)
    return article


@router.patch("/admin/kb/{slug}", response_model=KbArticleResponse)
async def admin_update_kb_article(
    slug: str,
    payload: KbArticleCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    q = await db.execute(select(KbArticle).where(KbArticle.slug == slug))
    article = q.scalar_one_or_none()
    if article is None:
        raise HTTPException(status_code=404, detail="article not found")
    for k, v in payload.model_dump().items():
        setattr(article, k, v)
    await db.commit()
    await db.refresh(article)
    return article


@router.get("/kb", response_model=list[KbArticleResponse])
async def search_kb(
    q: Optional[str] = Query(None, description="search term"),
    category: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(KbArticle).where(KbArticle.is_published.is_(True))
    if q:
        # Use the search_tsv index when possible.
        stmt = stmt.where(
            KbArticle.search_tsv.op("@@")(func.plainto_tsquery("english", q))
        ).order_by(
            desc(func.ts_rank(KbArticle.search_tsv, func.plainto_tsquery("english", q)))
        )
    else:
        stmt = stmt.order_by(KbArticle.view_count.desc())
    if category:
        stmt = stmt.where(KbArticle.category == category)
    stmt = stmt.limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get("/kb/{slug}", response_model=KbArticleResponse)
async def get_kb_article(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    q = await db.execute(select(KbArticle).where(KbArticle.slug == slug, KbArticle.is_published.is_(True)))
    article = q.scalar_one_or_none()
    if article is None:
        raise HTTPException(status_code=404, detail="article not found")
    article.view_count = (article.view_count or 0) + 1
    await db.commit()
    await db.refresh(article)
    return article


@router.post("/kb/{slug}/feedback", status_code=204)
async def kb_feedback(
    slug: str,
    payload: KbFeedbackRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(select(KbArticle).where(KbArticle.slug == slug))
    article = q.scalar_one_or_none()
    if article is None:
        raise HTTPException(status_code=404, detail="article not found")
    if payload.helpful:
        article.helpful_count += 1
    else:
        article.not_helpful_count += 1
    await db.commit()

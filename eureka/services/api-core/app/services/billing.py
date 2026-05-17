"""
Phase 11.1 — Billing maturity service.

Pure-Python business logic for:
  - subscription lifecycle (start, change, cancel-at-period-end, immediate cancel)
  - proration math (charge or credit when a plan is changed mid-period)
  - tax computation per (country, region) on a subtotal
  - dunning policy (when to retry a failed invoice and when to give up)

All Stripe calls live in the endpoint layer; this module is offline-friendly
so tests can validate the math without hitting the network.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.gtm import (
    DunningAttempt,
    DunningOutcome,
    Invoice,
    InvoiceStatus,
    Subscription,
    SubscriptionInterval,
    SubscriptionPlan,
    SubscriptionStatus,
    TaxRate,
)


def _utc() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Period math
# ---------------------------------------------------------------------------


def period_end(start: datetime, interval: str) -> datetime:
    if interval == SubscriptionInterval.monthly.value:
        # Approximate 30 days; we don't try to match Stripe's exact billing math here,
        # we just need consistent renewals for our own ledger.
        return start + timedelta(days=30)
    if interval == SubscriptionInterval.yearly.value:
        return start + timedelta(days=365)
    raise ValueError(f"unknown interval: {interval}")


# ---------------------------------------------------------------------------
# Proration
# ---------------------------------------------------------------------------


@dataclass
class ProrationResult:
    credit_cents: int                 # how much we credit from the old plan
    new_charge_cents: int             # how much we charge for the new plan's remaining time
    net_charge_cents: int             # max(0, new_charge_cents - credit_cents)
    period_days: int
    remaining_days: int
    description: str


def proration_for_plan_change(
    *,
    old_plan_price: int,
    new_plan_price: int,
    old_interval: str,
    new_interval: str,
    current_period_start: datetime,
    current_period_end: datetime,
    switch_at: Optional[datetime] = None,
) -> ProrationResult:
    """
    Time-based proration.

    Credit = old_plan_price * remaining_fraction_of_old_period
    Charge = new_plan_price * remaining_fraction_of_new_period
    Net    = max(0, charge - credit).

    Both fractions are computed over their own period lengths so that
    changing month → year doesn't accidentally credit / charge against
    wildly different denominators.
    """
    switch_at = switch_at or _utc()
    if switch_at < current_period_start:
        switch_at = current_period_start
    if switch_at > current_period_end:
        switch_at = current_period_end

    old_total = (current_period_end - current_period_start).total_seconds()
    remaining_old = max(0.0, (current_period_end - switch_at).total_seconds())
    remaining_frac_old = remaining_old / old_total if old_total > 0 else 0.0

    new_period_seconds = (
        period_end(switch_at, new_interval) - switch_at
    ).total_seconds()
    if new_interval == old_interval:
        # Charge same period length, not whatever Stripe might do.
        remaining_frac_new = remaining_frac_old
    else:
        remaining_frac_new = 1.0

    credit = int(round(old_plan_price * remaining_frac_old))
    charge = int(round(new_plan_price * remaining_frac_new))
    net = max(0, charge - credit)

    period_days = int(old_total / 86400)
    remaining_days = int(remaining_old / 86400)
    desc = (
        f"Prorating from old plan ({old_plan_price}c every {period_days}d) "
        f"with {remaining_days}d remaining "
        f"to new plan ({new_plan_price}c, {new_interval})."
    )
    return ProrationResult(
        credit_cents=credit,
        new_charge_cents=charge,
        net_charge_cents=net,
        period_days=period_days,
        remaining_days=remaining_days,
        description=desc,
    )


# ---------------------------------------------------------------------------
# Tax
# ---------------------------------------------------------------------------


@dataclass
class TaxQuote:
    rate_bps: int                     # 875 = 8.75%
    tax_cents: int                    # tax on the given subtotal
    label: str
    inclusive: bool                   # True when tax was already included


async def quote_tax(
    db: AsyncSession,
    *,
    subtotal_cents: int,
    country_code: Optional[str],
    region_code: Optional[str] = None,
    on_date: Optional[date] = None,
) -> TaxQuote:
    if not country_code or subtotal_cents <= 0:
        return TaxQuote(rate_bps=0, tax_cents=0, label="no tax (unknown jurisdiction)", inclusive=False)
    on_date = on_date or date.today()
    q = select(TaxRate).where(
        TaxRate.country_code == country_code,
        TaxRate.effective_from <= on_date,
        (TaxRate.effective_to.is_(None)) | (TaxRate.effective_to >= on_date),
    ).order_by(TaxRate.effective_from.desc())
    rates = list((await db.execute(q)).scalars().all())
    # Prefer a region-specific row if it exists.
    region_rate = next((r for r in rates if region_code and r.region_code == region_code), None)
    country_rate = next((r for r in rates if r.region_code is None), None)
    chosen = region_rate or country_rate
    if chosen is None:
        return TaxQuote(rate_bps=0, tax_cents=0, label=f"no tax registered for {country_code}", inclusive=False)
    if chosen.inclusive:
        # Tax already included in subtotal — back-compute the tax portion.
        # tax = subtotal - subtotal / (1 + rate)
        rate = chosen.rate_bps / 10000.0
        tax = int(round(subtotal_cents - subtotal_cents / (1 + rate)))
    else:
        tax = (subtotal_cents * chosen.rate_bps) // 10000
    return TaxQuote(rate_bps=chosen.rate_bps, tax_cents=tax, label=chosen.label, inclusive=chosen.inclusive)


# ---------------------------------------------------------------------------
# Dunning
# ---------------------------------------------------------------------------

# Exponential retry: 1d, 3d, 7d, 14d, then give up.
DUNNING_SCHEDULE_DAYS = [1, 3, 7, 14]


async def schedule_dunning(
    db: AsyncSession,
    *,
    invoice: Invoice,
    now: Optional[datetime] = None,
) -> DunningAttempt:
    """Queue the next dunning attempt for a past-due invoice."""
    now = now or _utc()
    q = await db.execute(
        select(DunningAttempt).where(DunningAttempt.invoice_id == invoice.id)
        .order_by(DunningAttempt.attempt_n.desc()).limit(1)
    )
    last = q.scalar_one_or_none()
    attempt_n = (last.attempt_n + 1) if last else 1
    if attempt_n > len(DUNNING_SCHEDULE_DAYS):
        # Past last retry — mark abandoned.
        attempt = DunningAttempt(
            invoice_id=invoice.id, attempt_n=attempt_n,
            outcome=DunningOutcome.abandoned.value,
            next_retry_at=None, note="exceeded retry schedule",
        )
        invoice.status = InvoiceStatus.uncollectible.value
        db.add(attempt)
        await db.commit()
        await db.refresh(attempt)
        return attempt

    days = DUNNING_SCHEDULE_DAYS[attempt_n - 1]
    attempt = DunningAttempt(
        invoice_id=invoice.id, attempt_n=attempt_n,
        outcome=DunningOutcome.queued.value,
        next_retry_at=now + timedelta(days=days),
    )
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)
    return attempt


# ---------------------------------------------------------------------------
# Subscription lifecycle
# ---------------------------------------------------------------------------


async def start_subscription(
    db: AsyncSession,
    *,
    user_id: UUID,
    plan: SubscriptionPlan,
    start_at: Optional[datetime] = None,
) -> Subscription:
    """Create a subscription. Honors plan.trial_days for trial_end."""
    start_at = start_at or _utc()
    pe = period_end(start_at, plan.interval)
    trial_end = start_at + timedelta(days=plan.trial_days) if plan.trial_days else None
    status = (
        SubscriptionStatus.trialing.value if trial_end and trial_end > start_at
        else SubscriptionStatus.active.value
    )
    sub = Subscription(
        user_id=user_id, plan_id=plan.id, status=status,
        current_period_start=start_at, current_period_end=pe, trial_end=trial_end,
    )
    db.add(sub)
    await db.commit()
    await db.refresh(sub)
    return sub


async def change_plan(
    db: AsyncSession,
    *,
    subscription: Subscription,
    new_plan: SubscriptionPlan,
    apply_proration: bool = True,
) -> tuple[Subscription, Optional[ProrationResult]]:
    """
    Switch the subscription's plan, optionally with proration.

    Returns (updated_subscription, proration_result_or_None).
    """
    old_plan = await db.get(SubscriptionPlan, subscription.plan_id)
    proration: Optional[ProrationResult] = None
    if apply_proration and old_plan is not None:
        proration = proration_for_plan_change(
            old_plan_price=old_plan.price_cents,
            new_plan_price=new_plan.price_cents,
            old_interval=old_plan.interval,
            new_interval=new_plan.interval,
            current_period_start=subscription.current_period_start,
            current_period_end=subscription.current_period_end,
        )
    subscription.plan_id = new_plan.id
    # Reset the period to a fresh new-plan period.
    now = _utc()
    subscription.current_period_start = now
    subscription.current_period_end = period_end(now, new_plan.interval)
    subscription.status = SubscriptionStatus.active.value
    subscription.cancel_at_period_end = False
    await db.commit()
    await db.refresh(subscription)
    return subscription, proration


async def cancel_subscription(
    db: AsyncSession,
    *,
    subscription: Subscription,
    at_period_end: bool = True,
    reason: Optional[str] = None,
) -> Subscription:
    if at_period_end:
        subscription.cancel_at_period_end = True
    else:
        subscription.status = SubscriptionStatus.canceled.value
        subscription.canceled_at = _utc()
    await db.commit()
    await db.refresh(subscription)
    return subscription

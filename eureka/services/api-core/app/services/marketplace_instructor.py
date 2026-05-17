"""
Phase 10.1 — instructor onboarding + payouts.

`Stripe Connect Express` is the real flow. We integrate against it when
STRIPE_SECRET_KEY is set; otherwise we run in stub mode where the same
endpoints return synthesized account ids + onboarding URLs so the rest of
the platform (UI, tests, billing math) can be exercised end-to-end without
hitting Stripe.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.marketplace import (
    InstructorKycEvent,
    InstructorPayout,
    InstructorProfile,
    KycStatus,
    MarketplacePurchase,
    PayoutStatus,
    PurchaseStatus,
)


def _stripe_key() -> Optional[str]:
    return getattr(settings, "STRIPE_SECRET_KEY", None) or os.environ.get("STRIPE_SECRET_KEY")


@dataclass
class OnboardingLink:
    instructor_id: UUID
    stripe_connect_account_id: Optional[str]
    onboarding_url: Optional[str]
    is_stub: bool


async def start_onboarding(
    db: AsyncSession, *, instructor: InstructorProfile, return_url: str, refresh_url: str
) -> OnboardingLink:
    """Kick off Stripe Connect Express onboarding (or stub it)."""
    key = _stripe_key()
    if not key:
        # Stub mode: pretend onboarding succeeded immediately.
        if instructor.stripe_connect_account_id is None:
            instructor.stripe_connect_account_id = f"acct_stub_{instructor.id.hex[:16]}"
        if instructor.kyc_status == KycStatus.none.value:
            await _record_kyc(
                db, instructor=instructor, source="stub.onboard",
                previous=instructor.kyc_status, new=KycStatus.pending.value,
                note="Stripe not configured; stub onboarding link returned.",
            )
            instructor.kyc_status = KycStatus.pending.value
        await db.commit()
        return OnboardingLink(
            instructor_id=instructor.id,
            stripe_connect_account_id=instructor.stripe_connect_account_id,
            onboarding_url=f"{return_url}?stub=1",
            is_stub=True,
        )
    try:
        import stripe
        stripe.api_key = key
        if instructor.stripe_connect_account_id is None:
            account = stripe.Account.create(
                type="express",
                capabilities={"transfers": {"requested": True}},
                metadata={"instructor_id": str(instructor.id)},
            )
            instructor.stripe_connect_account_id = account.id
            await _record_kyc(
                db, instructor=instructor, source="stripe.account.created",
                previous=instructor.kyc_status, new=KycStatus.pending.value,
                note=f"Stripe Connect account {account.id} created.",
            )
            instructor.kyc_status = KycStatus.pending.value
        link = stripe.AccountLink.create(
            account=instructor.stripe_connect_account_id,
            refresh_url=refresh_url, return_url=return_url, type="account_onboarding",
        )
        await db.commit()
        return OnboardingLink(
            instructor_id=instructor.id,
            stripe_connect_account_id=instructor.stripe_connect_account_id,
            onboarding_url=link.url, is_stub=False,
        )
    except ImportError:
        # Library not installed: treat as stub.
        return await start_onboarding(db, instructor=instructor, return_url=return_url, refresh_url=refresh_url)


async def refresh_kyc(db: AsyncSession, *, instructor: InstructorProfile) -> InstructorProfile:
    """Poll Stripe for the current account status and reconcile."""
    key = _stripe_key()
    if not key or not instructor.stripe_connect_account_id:
        # Stub: nudge from pending → verified after first refresh.
        if instructor.kyc_status == KycStatus.pending.value:
            await _record_kyc(
                db, instructor=instructor, source="stub.refresh",
                previous=instructor.kyc_status, new=KycStatus.verified.value,
                note="Stripe not configured; auto-verifying for dev/stub.",
            )
            instructor.kyc_status = KycStatus.verified.value
            await db.commit()
        return instructor
    try:
        import stripe
        stripe.api_key = key
        acct = stripe.Account.retrieve(instructor.stripe_connect_account_id)
        new_status = KycStatus.verified.value if acct.charges_enabled and acct.payouts_enabled else (
            KycStatus.rejected.value if acct.requirements.disabled_reason else KycStatus.pending.value
        )
        if new_status != instructor.kyc_status:
            await _record_kyc(
                db, instructor=instructor, source="stripe.account.refresh",
                previous=instructor.kyc_status, new=new_status,
                note=str(acct.requirements.disabled_reason) if acct.requirements.disabled_reason else None,
                requirements={
                    "currently_due": list(acct.requirements.currently_due or []),
                    "past_due": list(acct.requirements.past_due or []),
                },
            )
            instructor.kyc_status = new_status
            await db.commit()
        return instructor
    except ImportError:
        return instructor


async def _record_kyc(
    db: AsyncSession, *,
    instructor: InstructorProfile,
    source: str,
    previous: Optional[str],
    new: str,
    note: Optional[str] = None,
    requirements: Optional[dict] = None,
) -> None:
    ev = InstructorKycEvent(
        instructor_id=instructor.id,
        source=source, previous_status=previous, new_status=new,
        note=note, requirements=requirements or {},
    )
    db.add(ev)
    instructor.kyc_last_event_at = datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Payouts
# ---------------------------------------------------------------------------

def _last_period(today: Optional[date] = None) -> tuple[date, date]:
    """Last full week ending Sunday."""
    today = today or date.today()
    # Sunday is weekday 6; we want the most recently completed Mon..Sun.
    days_since_sunday = (today.weekday() + 1) % 7  # Mon=0 → 1 day since last Sunday
    period_end = today - timedelta(days=days_since_sunday)
    period_start = period_end - timedelta(days=6)
    return period_start, period_end


async def accrue_period(
    db: AsyncSession,
    *,
    instructor: InstructorProfile,
    period_start: Optional[date] = None,
    period_end: Optional[date] = None,
) -> InstructorPayout:
    """Compute (or refresh) the accruing payout row for this period."""
    if period_start is None or period_end is None:
        period_start, period_end = _last_period()

    q = await db.execute(
        select(InstructorPayout).where(
            InstructorPayout.instructor_id == instructor.id,
            InstructorPayout.period_start == period_start,
            InstructorPayout.period_end == period_end,
        )
    )
    payout = q.scalar_one_or_none()
    if payout is None:
        payout = InstructorPayout(
            instructor_id=instructor.id, period_start=period_start, period_end=period_end,
            currency=instructor.payout_currency or "USD",
        )
        db.add(payout)

    period_start_dt = datetime.combine(period_start, datetime.min.time(), tzinfo=timezone.utc)
    period_end_dt = datetime.combine(period_end, datetime.max.time(), tzinfo=timezone.utc)
    paid_q = await db.execute(
        select(
            func.coalesce(func.sum(MarketplacePurchase.final_price_cents), 0).label("gross"),
            func.coalesce(func.sum(MarketplacePurchase.platform_fee_cents), 0).label("plat"),
            func.coalesce(func.sum(MarketplacePurchase.payment_fee_cents), 0).label("pay"),
            func.coalesce(func.sum(MarketplacePurchase.instructor_net_cents), 0).label("net"),
        ).where(
            MarketplacePurchase.instructor_id == instructor.id,
            MarketplacePurchase.status == PurchaseStatus.paid.value,
            MarketplacePurchase.paid_at >= period_start_dt,
            MarketplacePurchase.paid_at <= period_end_dt,
        )
    )
    paid_row = paid_q.one()

    refunds_q = await db.execute(
        select(
            func.coalesce(func.sum(MarketplacePurchase.final_price_cents), 0).label("refunded"),
        ).where(
            MarketplacePurchase.instructor_id == instructor.id,
            MarketplacePurchase.status == PurchaseStatus.refunded.value,
            MarketplacePurchase.refunded_at >= period_start_dt,
            MarketplacePurchase.refunded_at <= period_end_dt,
        )
    )
    refunds = int(refunds_q.scalar() or 0)

    payout.gross_cents = int(paid_row.gross or 0)
    payout.platform_fee_cents = int(paid_row.plat or 0)
    payout.payment_fee_cents = int(paid_row.pay or 0)
    payout.refunds_cents = refunds
    payout.net_cents = max(0, int(paid_row.net or 0) - refunds)
    if payout.status == PayoutStatus.accruing.value and date.today() > period_end:
        payout.status = PayoutStatus.ready.value
    await db.commit()
    await db.refresh(payout)
    return payout

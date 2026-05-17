"""
Phase 10.3 — marketplace ranking algorithm.

Scores published listings by:
    rank = w_sales * z(sales_30d)
         + w_rating * (avg_rating - 3) / 2          [maps 1..5 → -1..+1]
         + w_completion * completion_rate
         + w_freshness * exp(-days_since_published / 60)
         - w_refunds  * refund_rate

The result is written back to course_listings.rank_score so the marketplace
landing page can order by it without recomputing.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enrollment import Enrollment
from app.models.marketplace import (
    CourseListing,
    CourseReview,
    ListingStatus,
    MarketplacePurchase,
    PurchaseStatus,
)


@dataclass
class RankWeights:
    sales: float = 0.35
    rating: float = 0.25
    completion: float = 0.15
    freshness: float = 0.10
    refunds: float = 0.15
    enrolled: float = 0.10        # secondary boost from raw enrollment count


def _now() -> datetime:
    return datetime.now(timezone.utc)


async def _recent_sales_count(db: AsyncSession, listing: CourseListing, since: datetime) -> int:
    q = await db.execute(
        select(func.count(MarketplacePurchase.id)).where(
            MarketplacePurchase.course_id == listing.course_id,
            MarketplacePurchase.status == PurchaseStatus.paid.value,
            MarketplacePurchase.paid_at >= since,
        )
    )
    return int(q.scalar() or 0)


async def _refund_rate(db: AsyncSession, listing: CourseListing) -> float:
    q = await db.execute(
        select(
            func.count(MarketplacePurchase.id).filter(
                MarketplacePurchase.course_id == listing.course_id,
                MarketplacePurchase.status == PurchaseStatus.paid.value,
            ).label("paid"),
            func.count(MarketplacePurchase.id).filter(
                MarketplacePurchase.course_id == listing.course_id,
                MarketplacePurchase.status == PurchaseStatus.refunded.value,
            ).label("refunded"),
        )
    )
    row = q.one()
    paid = int(row.paid or 0)
    refunded = int(row.refunded or 0)
    return refunded / (paid + refunded) if (paid + refunded) > 0 else 0.0


async def _completion_rate(db: AsyncSession, listing: CourseListing) -> float:
    """Use enrollments table as a proxy: rows with progress >= 0.8."""
    try:
        q = await db.execute(
            select(
                func.count(Enrollment.id).label("total"),
                func.count(Enrollment.id).filter(Enrollment.progress >= 0.8).label("done"),
            ).where(Enrollment.course_id == listing.course_id)
        )
        row = q.one()
        total = int(row.total or 0)
        done = int(row.done or 0)
        return done / total if total > 0 else 0.0
    except Exception:
        return 0.0


async def _rating_for(db: AsyncSession, listing: CourseListing) -> tuple[Optional[float], int]:
    q = await db.execute(
        select(
            func.avg(CourseReview.rating).label("avg"),
            func.count(CourseReview.id).label("n"),
        ).where(CourseReview.course_id == listing.course_id, CourseReview.flagged.is_(False))
    )
    row = q.one()
    avg = float(row.avg) if row.avg is not None else None
    n = int(row.n or 0)
    return avg, n


async def recompute_listing(
    db: AsyncSession, listing: CourseListing, weights: RankWeights | None = None
) -> float:
    """Recompute one listing's rank_score and persist denorm columns."""
    w = weights or RankWeights()
    since_30d = _now() - timedelta(days=30)
    sales_30 = await _recent_sales_count(db, listing, since_30d)
    refunds = await _refund_rate(db, listing)
    completion = await _completion_rate(db, listing)
    avg_rating, review_count = await _rating_for(db, listing)

    enrolled_q = await db.execute(
        select(func.count(MarketplacePurchase.id)).where(
            MarketplacePurchase.course_id == listing.course_id,
            MarketplacePurchase.status == PurchaseStatus.paid.value,
        )
    )
    enrolled = int(enrolled_q.scalar() or 0)

    days = (_now() - (listing.published_at or listing.created_at)).total_seconds() / 86400.0
    freshness = math.exp(-days / 60.0)

    # log-scale sales so a single mega-hit doesn't dominate
    sales_signal = math.log10(1 + sales_30)
    enrolled_signal = math.log10(1 + enrolled)
    rating_signal = ((avg_rating or 3.0) - 3.0) / 2.0  # 1..5 → -1..+1

    score = (
        w.sales * sales_signal
        + w.rating * rating_signal
        + w.completion * completion
        + w.freshness * freshness
        + w.enrolled * enrolled_signal
        - w.refunds * refunds
    )

    # persist
    listing.enrolled_count = enrolled
    listing.review_count = review_count
    listing.avg_rating = round(avg_rating, 2) if avg_rating is not None else None
    listing.rank_score = round(score, 4)
    await db.flush()
    return score


async def recompute_all_published(db: AsyncSession) -> int:
    """Recompute every published listing. Returns number of listings updated."""
    q = await db.execute(
        select(CourseListing).where(CourseListing.status == ListingStatus.published.value)
    )
    listings = list(q.scalars().all())
    for listing in listings:
        await recompute_listing(db, listing)
    await db.commit()
    return len(listings)

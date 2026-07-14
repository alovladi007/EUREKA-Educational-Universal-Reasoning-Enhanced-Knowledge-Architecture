"""Entitlement ORM model (Integration Work Plan, Section 3).

An Entitlement says a user has active access to an AXIOM product (a course:
Linear Algebra, ODEs, PDEs and Fourier). Rows are written by the EUREKA webhook
(purchase, refund, expiry) or by an admin grant; they are read on the practice
hot path through a short-TTL in-process cache, never by calling EUREKA or
Stripe per request.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


class Entitlement(Base):
    __tablename__ = "entitlements"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    # Product codes are the AXIOM course SKUs, e.g. axiom-linear-algebra.
    product_code: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    # Null means no expiry (a lifetime purchase); otherwise access ends here.
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(), nullable=True)
    # Where the row came from: webhook | admin | seed.
    source: Mapped[str] = mapped_column(String(32), nullable=False, default="webhook")
    created_at: Mapped[datetime] = mapped_column(default=_now)
    updated_at: Mapped[datetime] = mapped_column(default=_now, onupdate=_now)

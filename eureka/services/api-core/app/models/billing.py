"""
Test-prep billing: product catalogue + per-user entitlements (WS5 / WS1 of
docs/monetization/PATENT_BAR_BUILD_PROMPT.md).

DECISION OF RECORD (per the build prompt's "decide early and record it"):
entitlements live HERE in api-core — the auth authority — not in the legacy
Node services/test-prep (:3010) Stripe scaffolding. The legacy
test_prep_plans / test_prep_subscriptions tables are not used; there is one
billing system. No fake catalogue rows: `products` is seeded (by migration)
only with real sellable SKUs.

Model:
  products      — sellable catalogue (sku, exam_code, price, interval).
  entitlements  — who can access which exam, why (stripe|comp|trial), and
                  until when (NULL expires_at = does not expire).

Access rule (has_exam_access): an ACTIVE entitlement for the exam_code that
has not expired. Enforced server-side via app/utils/entitlements.py and
mirrored client-side by the useEntitlements hook (the client gate is UX;
the server gate is the authority).
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean, DateTime, ForeignKey, Index, Integer, String, UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Product(Base):
    """A sellable test-prep product (one row per real SKU — never fabricated)."""

    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    sku: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    exam_code: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    price_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), nullable=False, default="usd")
    # one_time | monthly — one_time grants non-expiring access unless
    # access_days is set (then expires_at = purchase + access_days).
    interval: Mapped[str] = mapped_column(String(16), nullable=False, default="one_time")
    access_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class Entitlement(Base):
    """A user's right to access one exam's paid content."""

    __tablename__ = "entitlements"
    __table_args__ = (
        UniqueConstraint("user_id", "exam_code", name="uq_entitlement_user_exam"),
        Index("ix_entitlements_user", "user_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    exam_code: Mapped[str] = mapped_column(String(32), nullable=False)
    sku: Mapped[str] = mapped_column(String(64), nullable=False)
    # active | expired | refunded
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="active")
    # stripe | comp | trial — how the entitlement came to exist (audit trail)
    source: Mapped[str] = mapped_column(String(16), nullable=False)
    # Stripe checkout session / payment reference for stripe-sourced rows.
    external_ref: Mapped[str | None] = mapped_column(String(128), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

"""Compliance ORM models (Build prompt Section 13).

Two append-only concerns:

  AuditLog     - a unified security audit trail. Every security-relevant action
                 (a grade override, a role or accommodation change, a data
                 export, a consent decision) writes one row: who did it, to what,
                 in which tenant, and when. This is the single audit surface the
                 build prompt calls for, distinct from the domain-specific
                 evidence trails (mastery events, XP ledger).

  ConsentRecord - parental/data-processing consent per user (FERPA/COPPA). A
                 minor's account requires a granted parental consent before the
                 platform collects optional data (proctoring, analytics); the
                 gate reads these rows.

Both are append-friendly and carry tenant_id so audit and consent stay scoped
per organization.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, ForeignKey, String, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from app.core.db import Base

# Consent types the platform recognizes. parental is the COPPA gate for minors;
# data_processing is the general FERPA data-use consent; proctoring gates the
# opt-in integrity capture.
CONSENT_TYPES = ("parental", "data_processing", "proctoring")


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    # Naive UTC to match the TIMESTAMP (without time zone) columns.
    return datetime.now(UTC).replace(tzinfo=None)


class AuditLog(Base):
    __tablename__ = "audit_log"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    actor_user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True, index=True)
    actor_email: Mapped[str] = mapped_column(String(320), nullable=False, default="")
    action: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    resource_type: Mapped[str] = mapped_column(String(64), nullable=False)
    resource_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    tenant_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True, index=True)
    detail: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(default=_now, index=True)


class ConsentRecord(Base):
    __tablename__ = "consent_records"
    __table_args__ = (
        UniqueConstraint("user_id", "consent_type", name="uq_consent_user_type"),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    consent_type: Mapped[str] = mapped_column(String(32), nullable=False)
    granted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    # Who granted it (a parent/guardian name or email for parental consent).
    granted_by: Mapped[str] = mapped_column(String(320), nullable=False, default="")
    tenant_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(default=_now)
    updated_at: Mapped[datetime] = mapped_column(default=_now)

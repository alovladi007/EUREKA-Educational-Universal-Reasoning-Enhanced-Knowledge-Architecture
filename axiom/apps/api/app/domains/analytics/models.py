"""Analytics ORM models.

AnalyticsEvent is the persisted, Caliper-style learning-event stream (Build
prompt Section 12: "Ingest Caliper-style events"). The shape mirrors
events.caliper.Event so producers can hand an Event straight to the ingestion
service. It is append-only: rows are written by the ingestion endpoint and by
key flows (a graded response, a mastery change) and read back for rollups and
audit. High volume in production would partition this table by event_time; the
column shape does not change when it does.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import String, Uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from app.core.db import Base


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    # Naive UTC to match the TIMESTAMP (without time zone) columns.
    return datetime.now(UTC).replace(tzinfo=None)


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    # actor is the EUREKA user id (kept as a string to match the Caliper schema
    # and to tolerate non-UUID external actors).
    actor: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    action: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    object_type: Mapped[str] = mapped_column(String(64), nullable=False)
    object_id: Mapped[str] = mapped_column(String(128), nullable=False)
    tenant_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True, index=True)
    event_time: Mapped[datetime] = mapped_column(default=_now, index=True)
    extensions: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(default=_now)

"""Accommodation ORM model (Build prompt Section 13).

One row per user carrying the accessibility accommodations that apply across the
product and mid-assessment: an extra-time multiplier for timed work, text-to-
speech, a high-contrast theme, and reduced motion. A teacher or admin can set a
student's accommodations; a learner can set their own display preferences. The
delivery layer reads extra_time_multiplier when computing a timed assessment's
effective limit, so extra time is honored automatically rather than by hand.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


class Accommodation(Base):
    __tablename__ = "accommodations"
    __table_args__ = (UniqueConstraint("user_id", name="uq_accommodation_user"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    # Multiplier on a timed assessment's limit (1.0 = standard, 1.5 = time-and-a-
    # half, 2.0 = double time). Never below 1.0.
    extra_time_multiplier: Mapped[float] = mapped_column(
        Float, nullable=False, default=1.0, server_default="1.0"
    )
    text_to_speech: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )
    high_contrast: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )
    reduced_motion: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=_now)

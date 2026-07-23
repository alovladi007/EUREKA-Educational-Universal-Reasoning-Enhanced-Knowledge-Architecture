"""
Completed Real Exam Mock results (WS5).

Server-side persistence for the WS4 mock (previously localStorage-only —
recorded as a known limit in STATUS 15). One row per completed mock run.
Recording is entitlement-gated server-side (the mock is paid-tier); reads
return only the requesting user's rows.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class MockResult(Base):
    __tablename__ = "mock_results"
    __table_args__ = (
        Index("ix_mock_results_user_exam", "user_id", "exam_type"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    exam_type: Mapped[str] = mapped_column(String(32), nullable=False)
    correct: Mapped[int] = mapped_column(Integer, nullable=False)
    total: Mapped[int] = mapped_column(Integer, nullable=False)
    # {section_id: {correct, total}} — same shape the mock page computes.
    per_section: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

"""OCTET -> MCAT wiring (Phase B): the mapping table and the attempt log.

octet_mcat_map is SME-reviewable DATA mapping OCTET curriculum nodes onto
AAMC MCAT content categories (FC4/FC5). Every row carries a rationale and
review='pending' until a named reviewer confirms it; rows are versioned
rather than silently edited. The serving layer reads only active rows, so a
disputed mapping is deactivated, not deleted.

mcat_chem_attempts records every MCAT-mode chemistry response with its OCTET
node and AAMC category. It exists for own-account weakness analytics and,
later, honest IRT calibration once there are enough real responses. It
carries no percentile and supports no cohort claim.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    BigInteger, Boolean, DateTime, ForeignKey, Index, Integer, String,
    UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class OctetMcatMap(Base):
    """One OCTET node's place in the AAMC MCAT content outline. Reviewable data."""

    __tablename__ = "octet_mcat_map"
    __table_args__ = (
        UniqueConstraint("octet_node", "mcat_category", "version",
                         name="uq_octet_mcat_node_cat_version"),
        Index("ix_octet_mcat_map_category", "mcat_category"),
        Index("ix_octet_mcat_map_node", "octet_node"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    octet_node: Mapped[str] = mapped_column(String(64), nullable=False)
    octet_node_title: Mapped[str] = mapped_column(String(200), nullable=False)
    mcat_category: Mapped[str] = mapped_column(String(8), nullable=False)
    foundational_concept: Mapped[str] = mapped_column(String(8), nullable=False)
    rationale: Mapped[str] = mapped_column(String(500), nullable=False)
    review: Mapped[str] = mapped_column(String(16), nullable=False, default="pending")
    reviewer: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class McatChemAttempt(Base):
    """One graded MCAT-mode chemistry response. Own-account analytics only."""

    __tablename__ = "mcat_chem_attempts"
    __table_args__ = (
        Index("ix_mcat_chem_attempts_user_cat", "user_id", "mcat_category"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    template_id: Mapped[str] = mapped_column(String(80), nullable=False)
    seed: Mapped[int] = mapped_column(BigInteger, nullable=False)
    octet_node: Mapped[str] = mapped_column(String(64), nullable=False)
    mcat_category: Mapped[str] = mapped_column(String(8), nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    misconception: Mapped[str | None] = mapped_column(String(64), nullable=True)
    seconds: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    answered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

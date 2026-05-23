"""
Phase 16.2 — Research workspaces ORM.

Tables in eureka/ops/db/21_research_workspaces.sql:
  research_workspaces — one per project; optional graduate_enrollment link.
  lit_review_entries  — one row per cited reference; raw + normalized metadata.
  workspace_drafts    — markdown drafts (chapters, sections, talk outlines).

DB triggers maintain reference_count / draft_count / last_activity_at — the
service layer does NOT bump those columns manually.
"""

from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean, CheckConstraint, DateTime, ForeignKey, Integer,
    String, Text, func,
)
from sqlalchemy.dialects.postgresql import ARRAY, ENUM, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


# -- Python enums (mirror the PG types) ---------------------------------------

class WorkspaceKind(str, enum.Enum):
    thesis = "thesis"
    paper = "paper"
    grant_application = "grant_application"
    literature_review = "literature_review"
    meta_analysis = "meta_analysis"
    replication_study = "replication_study"
    class_project = "class_project"
    misc = "misc"


class WorkspaceStatus(str, enum.Enum):
    active = "active"
    paused = "paused"
    completed = "completed"
    archived = "archived"


class ReferenceSource(str, enum.Enum):
    crossref = "crossref"
    arxiv = "arxiv"
    pubmed = "pubmed"
    semantic_scholar = "semantic_scholar"
    manual = "manual"
    doi = "doi"
    isbn = "isbn"


class DraftKind(str, enum.Enum):
    thesis_chapter = "thesis_chapter"
    paper_section = "paper_section"
    grant_section = "grant_section"
    lit_review_summary = "lit_review_summary"
    talk_outline = "talk_outline"
    misc = "misc"


# -- PG enum bridges (create_type=False — SQL owns the type) ------------------

_PG_WORKSPACE_KIND = ENUM(
    "thesis", "paper", "grant_application", "literature_review",
    "meta_analysis", "replication_study", "class_project", "misc",
    name="workspace_kind", create_type=False,
)
_PG_WORKSPACE_STATUS = ENUM(
    "active", "paused", "completed", "archived",
    name="workspace_status", create_type=False,
)
_PG_REFERENCE_SOURCE = ENUM(
    "crossref", "arxiv", "pubmed", "semantic_scholar", "manual", "doi", "isbn",
    name="reference_source", create_type=False,
)
_PG_DRAFT_KIND = ENUM(
    "thesis_chapter", "paper_section", "grant_section",
    "lit_review_summary", "talk_outline", "misc",
    name="draft_kind", create_type=False,
)


# -- research_workspaces ------------------------------------------------------

class ResearchWorkspace(Base):
    __tablename__ = "research_workspaces"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    enrollment_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("graduate_enrollments.id", ondelete="SET NULL"),
    )
    title: Mapped[str] = mapped_column(String(280), nullable=False)
    description_md: Mapped[str | None] = mapped_column(Text)
    kind: Mapped[str] = mapped_column(_PG_WORKSPACE_KIND, default=WorkspaceKind.paper.value, nullable=False)
    status: Mapped[str] = mapped_column(_PG_WORKSPACE_STATUS, default=WorkspaceStatus.active.value, nullable=False)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    skill_code: Mapped[str | None] = mapped_column(String(120))
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    reference_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    draft_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_activity_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


# -- lit_review_entries -------------------------------------------------------

class LitReviewEntry(Base):
    __tablename__ = "lit_review_entries"
    __table_args__ = (
        CheckConstraint(
            "read_status IN ('unread','reading','read','dismissed')",
            name="ck_lit_entries_read_status",
        ),
        CheckConstraint(
            "year IS NULL OR (year BETWEEN 1500 AND 2200)",
            name="ck_lit_entries_year",
        ),
        CheckConstraint(
            "rating IS NULL OR rating BETWEEN 1 AND 5",
            name="ck_lit_entries_rating",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("research_workspaces.id", ondelete="CASCADE"),
        nullable=False,
    )
    source: Mapped[str] = mapped_column(
        _PG_REFERENCE_SOURCE, default=ReferenceSource.manual.value, nullable=False
    )
    doi: Mapped[str | None] = mapped_column(String(280))
    arxiv_id: Mapped[str | None] = mapped_column(String(80))
    pubmed_id: Mapped[str | None] = mapped_column(String(40))
    isbn: Mapped[str | None] = mapped_column(String(20))
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    authors: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    venue: Mapped[str | None] = mapped_column(String(280))
    year: Mapped[int | None] = mapped_column(Integer)
    abstract: Mapped[str | None] = mapped_column(Text)
    user_notes_md: Mapped[str | None] = mapped_column(Text)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    read_status: Mapped[str] = mapped_column(String(20), default="unread", nullable=False)
    rating: Mapped[int | None] = mapped_column(Integer)
    bibtex: Mapped[str | None] = mapped_column(Text)
    raw_metadata: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


# -- workspace_drafts ---------------------------------------------------------

class WorkspaceDraft(Base):
    __tablename__ = "workspace_drafts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("research_workspaces.id", ondelete="CASCADE"),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(280), nullable=False)
    kind: Mapped[str] = mapped_column(_PG_DRAFT_KIND, default=DraftKind.misc.value, nullable=False)
    sort_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    body_md: Mapped[str] = mapped_column(Text, default="", nullable=False)
    word_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

"""Phase 16.2 — Research workspaces Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional, Union
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# Phase 19 lesson: Pydantic v2 doesn't auto-coerce UUID → str at serialization
# when from_attributes=True. Accept Union[UUID, str] on response ID fields so
# either form serializes cleanly through JSON.
IdField = Union[UUID, str]


# -- workspaces ---------------------------------------------------------------

class WorkspaceCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=280)
    description_md: Optional[str] = None
    kind: str = Field("paper", max_length=40)
    status: str = Field("active", max_length=20)
    tags: list[str] = Field(default_factory=list, max_length=64)
    skill_code: Optional[str] = Field(None, max_length=120)
    is_public: bool = False
    enrollment_id: Optional[UUID] = None


class WorkspaceUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=280)
    description_md: Optional[str] = None
    kind: Optional[str] = Field(None, max_length=40)
    status: Optional[str] = Field(None, max_length=20)
    tags: Optional[list[str]] = Field(None, max_length=64)
    skill_code: Optional[str] = Field(None, max_length=120)
    is_public: Optional[bool] = None


class WorkspaceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: IdField
    user_id: IdField
    enrollment_id: Optional[IdField] = None
    title: str
    description_md: Optional[str] = None
    kind: str
    status: str
    tags: list[str] = Field(default_factory=list)
    skill_code: Optional[str] = None
    is_public: bool
    reference_count: int
    draft_count: int
    last_activity_at: datetime
    created_at: datetime
    updated_at: datetime


# -- lit_review_entries -------------------------------------------------------

class LitReviewEntryCreate(BaseModel):
    source: str = Field("manual", max_length=40)
    doi: Optional[str] = Field(None, max_length=280)
    arxiv_id: Optional[str] = Field(None, max_length=80)
    pubmed_id: Optional[str] = Field(None, max_length=40)
    isbn: Optional[str] = Field(None, max_length=20)
    title: str = Field(..., min_length=1, max_length=500)
    authors: list[str] = Field(default_factory=list)
    venue: Optional[str] = Field(None, max_length=280)
    year: Optional[int] = Field(None, ge=1500, le=2200)
    abstract: Optional[str] = None
    user_notes_md: Optional[str] = None
    tags: list[str] = Field(default_factory=list, max_length=64)
    read_status: str = Field("unread", max_length=20)
    rating: Optional[int] = Field(None, ge=1, le=5)
    bibtex: Optional[str] = None
    raw_metadata: dict[str, Any] = Field(default_factory=dict)


class LitReviewEntryUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    authors: Optional[list[str]] = None
    venue: Optional[str] = Field(None, max_length=280)
    year: Optional[int] = Field(None, ge=1500, le=2200)
    abstract: Optional[str] = None
    user_notes_md: Optional[str] = None
    tags: Optional[list[str]] = Field(None, max_length=64)
    read_status: Optional[str] = Field(None, max_length=20)
    rating: Optional[int] = Field(None, ge=1, le=5)
    bibtex: Optional[str] = None


class LitReviewEntryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: IdField
    workspace_id: IdField
    source: str
    doi: Optional[str] = None
    arxiv_id: Optional[str] = None
    pubmed_id: Optional[str] = None
    isbn: Optional[str] = None
    title: str
    authors: list[str] = Field(default_factory=list)
    venue: Optional[str] = None
    year: Optional[int] = None
    abstract: Optional[str] = None
    user_notes_md: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    read_status: str
    rating: Optional[int] = None
    bibtex: Optional[str] = None
    raw_metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime


# -- drafts -------------------------------------------------------------------

class DraftCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=280)
    kind: str = Field("misc", max_length=40)
    sort_index: int = Field(0, ge=0, le=10000)
    body_md: str = ""
    tags: list[str] = Field(default_factory=list, max_length=64)


class DraftUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=280)
    kind: Optional[str] = Field(None, max_length=40)
    sort_index: Optional[int] = Field(None, ge=0, le=10000)
    body_md: Optional[str] = None
    tags: Optional[list[str]] = Field(None, max_length=64)


class DraftResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: IdField
    workspace_id: IdField
    title: str
    kind: str
    sort_index: int
    body_md: str
    word_count: int
    tags: list[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


# -- detail (workspace + nested refs + drafts) --------------------------------

class WorkspaceDetailResponse(WorkspaceResponse):
    references: list[LitReviewEntryResponse] = Field(default_factory=list)
    drafts: list[DraftResponse] = Field(default_factory=list)


# -- BibTeX export ------------------------------------------------------------

class BibTexExportResponse(BaseModel):
    bibtex: str
    format: str = "bibtex"
    count: int


# -- external lookup body -----------------------------------------------------

class LookupRequest(BaseModel):
    kind: str  # 'doi' | 'arxiv'
    value: str = Field(..., min_length=1, max_length=300)


class LookupResponse(BaseModel):
    found: bool
    source: Optional[str] = None
    title: Optional[str] = None
    authors: list[str] = Field(default_factory=list)
    venue: Optional[str] = None
    year: Optional[int] = None
    abstract: Optional[str] = None
    doi: Optional[str] = None
    arxiv_id: Optional[str] = None
    raw: dict[str, Any] = Field(default_factory=dict)

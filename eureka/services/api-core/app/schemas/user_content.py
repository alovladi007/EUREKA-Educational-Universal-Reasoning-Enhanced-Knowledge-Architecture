"""Phase 17 — Activity feed + user collections Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# -- activity ----------------------------------------------------------------

class ActivityEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    org_id: UUID
    kind: str
    summary: str
    ref_table: Optional[str]
    ref_id: Optional[UUID]
    payload: dict
    is_public: bool
    created_at: datetime


class ActivityCreateRequest(BaseModel):
    kind: str
    summary: str = Field(..., min_length=1, max_length=280)
    ref_table: Optional[str] = Field(None, max_length=80)
    ref_id: Optional[UUID] = None
    payload: dict = Field(default_factory=dict)
    is_public: bool = False


# -- collections --------------------------------------------------------------

class CollectionCreateRequest(BaseModel):
    kind: str = "notebook"
    title: str = Field(..., min_length=1, max_length=200)
    description_md: Optional[str] = None
    tags: list[str] = Field(default_factory=list, max_length=20)
    skill_code: Optional[str] = Field(None, max_length=120)
    is_pinned: bool = False
    is_public: bool = False


class CollectionUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description_md: Optional[str] = None
    tags: Optional[list[str]] = None
    skill_code: Optional[str] = Field(None, max_length=120)
    is_pinned: Optional[bool] = None
    is_public: Optional[bool] = None


class CollectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    kind: str
    title: str
    description_md: Optional[str]
    tags: list[str]
    skill_code: Optional[str]
    is_pinned: bool
    is_public: bool
    item_count: int
    created_at: datetime
    updated_at: datetime


# -- collection items ---------------------------------------------------------

class ItemCreateRequest(BaseModel):
    kind: str
    ref_table: Optional[str] = Field(None, max_length=80)
    ref_id: Optional[UUID] = None
    title: Optional[str] = Field(None, max_length=280)
    body_md: Optional[str] = None
    url: Optional[str] = Field(None, max_length=2000)
    sort_index: int = Field(0, ge=0, le=100000)
    payload: dict = Field(default_factory=dict)


class ItemUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, max_length=280)
    body_md: Optional[str] = None
    url: Optional[str] = Field(None, max_length=2000)
    sort_index: Optional[int] = Field(None, ge=0, le=100000)
    payload: Optional[dict] = None


class ItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    collection_id: UUID
    kind: str
    ref_table: Optional[str]
    ref_id: Optional[UUID]
    title: Optional[str]
    body_md: Optional[str]
    url: Optional[str]
    sort_index: int
    payload: dict
    created_at: datetime
    updated_at: datetime


# -- dashboard rollup ---------------------------------------------------------

class DashboardSummary(BaseModel):
    user_id: UUID
    org_id: UUID
    activity_count_7d: int = 0
    achievement_count: int = 0
    collection_count: int = 0
    enrollment_count: int = 0
    next_due_milestone_title: Optional[str] = None
    next_due_milestone_at: Optional[datetime] = None
    recent_activity: list[ActivityEventResponse] = Field(default_factory=list)

"""Phase 18 — Community + learning resources Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# -- threads -----------------------------------------------------------------

class ThreadCreateRequest(BaseModel):
    title: str = Field(..., min_length=4, max_length=280)
    body_md: str = Field(..., min_length=1)
    tags: list[str] = Field(default_factory=list, max_length=10)
    skill_code: Optional[str] = Field(None, max_length=120)
    tier: Optional[str] = Field(None, max_length=40)


class ThreadUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=4, max_length=280)
    body_md: Optional[str] = None
    tags: Optional[list[str]] = None
    pinned: Optional[bool] = None
    locked: Optional[bool] = None


class ThreadResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    org_id: UUID
    user_id: UUID
    title: str
    body_md: str
    tags: list[str]
    skill_code: Optional[str]
    tier: Optional[str]
    pinned: bool
    locked: bool
    reply_count: int
    upvote_count: int
    last_activity_at: datetime
    created_at: datetime
    updated_at: datetime


# -- posts -------------------------------------------------------------------

class PostCreateRequest(BaseModel):
    body_md: str = Field(..., min_length=1)
    parent_post_id: Optional[UUID] = None


class PostResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    thread_id: UUID
    user_id: UUID
    parent_post_id: Optional[UUID]
    body_md: str
    upvote_count: int
    is_accepted_answer: bool
    created_at: datetime
    updated_at: datetime
    # Per-kind reaction counts ({"upvote": 2, "helpful": 1, ...}) and the
    # current viewer's reactions — populated by the thread-detail endpoint.
    reactions: dict[str, int] = Field(default_factory=dict)
    my_reactions: list[str] = Field(default_factory=list)


class ThreadDetailResponse(BaseModel):
    thread: ThreadResponse
    posts: list[PostResponse] = Field(default_factory=list)
    thread_reactions: dict[str, int] = Field(default_factory=dict)
    my_thread_reactions: list[str] = Field(default_factory=list)


# -- reactions ---------------------------------------------------------------

class ReactionRequest(BaseModel):
    kind: str = "upvote"  # upvote | helpful | insightful


class ReactionResponse(BaseModel):
    target_kind: str
    target_id: UUID
    kind: str
    upvote_count: int


# -- resources ---------------------------------------------------------------

class ResourceCreateRequest(BaseModel):
    title: str = Field(..., min_length=4, max_length=280)
    kind: str  # video | article | book | paper | tutorial | documentation | course | tool | dataset | other
    url: Optional[str] = Field(None, max_length=2000)
    description_md: Optional[str] = None
    skill_code: Optional[str] = Field(None, max_length=120)
    tier: Optional[str] = Field(None, max_length=40)
    tags: list[str] = Field(default_factory=list, max_length=20)
    is_public: bool = True


class ResourceUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=4, max_length=280)
    description_md: Optional[str] = None
    url: Optional[str] = Field(None, max_length=2000)
    tags: Optional[list[str]] = None
    is_public: Optional[bool] = None


class ResourceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    org_id: Optional[UUID]
    created_by: Optional[UUID]
    title: str
    kind: str
    url: Optional[str]
    description_md: Optional[str]
    skill_code: Optional[str]
    tier: Optional[str]
    tags: list[str]
    is_public: bool
    upvote_count: int
    sme_endorsed: bool
    created_at: datetime
    updated_at: datetime

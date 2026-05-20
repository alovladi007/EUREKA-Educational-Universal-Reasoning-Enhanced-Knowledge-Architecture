"""
Phase 17 — Activity feed + user collections ORM.

Three small tables shared by the lightweight sidebar surfaces that
previously rendered hardcoded data (notebook, resources, community feed,
dashboard home).

Tables in eureka/ops/db/19_user_content.sql.
"""

from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean, DateTime, ForeignKey, Integer, String, Text, func,
)
from sqlalchemy.dialects.postgresql import ARRAY, ENUM, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


# -- enums --------------------------------------------------------------------

class ActivityKind(str, enum.Enum):
    attempt_completed = "attempt_completed"
    mock_completed = "mock_completed"
    skill_mastered = "skill_mastered"
    course_enrolled = "course_enrolled"
    course_completed = "course_completed"
    note_created = "note_created"
    collection_created = "collection_created"
    collection_item_added = "collection_item_added"
    community_posted = "community_posted"
    community_replied = "community_replied"
    achievement_earned = "achievement_earned"
    streak_milestone = "streak_milestone"
    tutor_session = "tutor_session"
    resource_bookmarked = "resource_bookmarked"
    profile_updated = "profile_updated"
    system = "system"


class CollectionKind(str, enum.Enum):
    notebook = "notebook"
    reading_list = "reading_list"
    bookmark_set = "bookmark_set"
    community_saved = "community_saved"
    study_set = "study_set"
    custom = "custom"


class CollectionItemKind(str, enum.Enum):
    note = "note"
    skill = "skill"
    item = "item"
    course = "course"
    listing = "listing"
    kb_article = "kb_article"
    thread = "thread"
    url = "url"
    achievement = "achievement"
    attempt = "attempt"
    custom = "custom"


# -- PG enum bridges (create_type=False — schema owns them) -------------------

_PG_ACTIVITY_KIND = ENUM(
    *[e.value for e in ActivityKind], name="activity_kind", create_type=False,
)
_PG_COLLECTION_KIND = ENUM(
    *[e.value for e in CollectionKind], name="collection_kind", create_type=False,
)
_PG_COLLECTION_ITEM_KIND = ENUM(
    *[e.value for e in CollectionItemKind], name="collection_item_kind", create_type=False,
)


# -- activity_events ----------------------------------------------------------

class ActivityEvent(Base):
    __tablename__ = "activity_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    org_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    kind: Mapped[str] = mapped_column(_PG_ACTIVITY_KIND, nullable=False)
    summary: Mapped[str] = mapped_column(String(280), nullable=False)
    ref_table: Mapped[str | None] = mapped_column(String(80))
    ref_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    payload: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# -- user_collections ---------------------------------------------------------

class UserCollection(Base):
    __tablename__ = "user_collections"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    kind: Mapped[str] = mapped_column(_PG_COLLECTION_KIND, default=CollectionKind.notebook.value, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description_md: Mapped[str | None] = mapped_column(Text)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    skill_code: Mapped[str | None] = mapped_column(String(120))
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    item_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    extra: Mapped[dict] = mapped_column("metadata", JSONB, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class CollectionItem(Base):
    __tablename__ = "collection_items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    collection_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user_collections.id", ondelete="CASCADE"), nullable=False)
    kind: Mapped[str] = mapped_column(_PG_COLLECTION_ITEM_KIND, nullable=False)
    ref_table: Mapped[str | None] = mapped_column(String(80))
    ref_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    title: Mapped[str | None] = mapped_column(String(280))
    body_md: Mapped[str | None] = mapped_column(Text)
    url: Mapped[str | None] = mapped_column(Text)
    sort_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    payload: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

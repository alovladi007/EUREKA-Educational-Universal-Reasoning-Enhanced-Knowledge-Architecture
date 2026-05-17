"""
Phase 12 — Engagement + adaptive learning ORM.

Tables in eureka/ops/db/14_engagement.sql.
"""

from __future__ import annotations

import enum
import uuid
from datetime import date, datetime

from sqlalchemy import (
    BigInteger, Boolean, CheckConstraint, Date, DateTime, ForeignKey, Index,
    Integer, Numeric, String, Text, UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import ARRAY, ENUM, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


# -- enums (Python) -----------------------------------------------------------

class DevicePlatform(str, enum.Enum):
    ios = "ios"
    android = "android"
    web = "web"


class NotificationKind(str, enum.Enum):
    streak_reminder = "streak_reminder"
    streak_broken = "streak_broken"
    study_plan_today = "study_plan_today"
    mastery_milestone = "mastery_milestone"
    mock_exam_due = "mock_exam_due"
    spaced_rep_due = "spaced_rep_due"
    live_session_starting = "live_session_starting"
    live_session_booked = "live_session_booked"
    price_drop = "price_drop"
    instructor_announcement = "instructor_announcement"
    support_reply = "support_reply"
    generic = "generic"


class NotificationStatus(str, enum.Enum):
    queued = "queued"
    sent = "sent"
    delivered = "delivered"
    failed = "failed"


class AchievementRarity(str, enum.Enum):
    common = "common"
    uncommon = "uncommon"
    rare = "rare"
    legendary = "legendary"


class StudyPlanStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    completed = "completed"
    archived = "archived"


class LiveSessionStatus(str, enum.Enum):
    scheduled = "scheduled"
    live = "live"
    completed = "completed"
    canceled = "canceled"
    no_show = "no_show"


class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    canceled = "canceled"
    attended = "attended"
    missed = "missed"


# -- PG enum bridges ----------------------------------------------------------

_PG_DEVICE_PLATFORM = ENUM("ios", "android", "web", name="device_platform", create_type=False)
_PG_NOTIF_KIND = ENUM(
    "streak_reminder", "streak_broken", "study_plan_today",
    "mastery_milestone", "mock_exam_due", "spaced_rep_due",
    "live_session_starting", "live_session_booked",
    "price_drop", "instructor_announcement", "support_reply", "generic",
    name="notification_kind", create_type=False,
)
_PG_NOTIF_STATUS = ENUM(
    "queued", "sent", "delivered", "failed",
    name="notification_status", create_type=False,
)
_PG_ACH_RARITY = ENUM(
    "common", "uncommon", "rare", "legendary",
    name="achievement_rarity", create_type=False,
)
_PG_PLAN_STATUS = ENUM(
    "draft", "active", "completed", "archived",
    name="study_plan_status", create_type=False,
)
_PG_LIVE_STATUS = ENUM(
    "scheduled", "live", "completed", "canceled", "no_show",
    name="live_session_status", create_type=False,
)
_PG_BOOKING_STATUS = ENUM(
    "pending", "confirmed", "canceled", "attended", "missed",
    name="booking_status", create_type=False,
)


# -- 12.1 Streaks + XP + achievements ----------------------------------------

class EngagementState(Base):
    __tablename__ = "engagement_states"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    current_streak_days: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    longest_streak_days: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_active_on: Mapped[date | None] = mapped_column(Date)
    xp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    level: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    show_on_leaderboard: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class XpEvent(Base):
    __tablename__ = "xp_events"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    source: Mapped[str] = mapped_column(String(60), nullable=False)
    xp_delta: Mapped[int] = mapped_column(Integer, nullable=False)
    ref_kind: Mapped[str | None] = mapped_column(String(40))
    ref_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    rarity: Mapped[str] = mapped_column(_PG_ACH_RARITY, default=AchievementRarity.common.value, nullable=False)
    icon_url: Mapped[str | None] = mapped_column(String(500))
    xp_reward: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    trigger_jsonb: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    __table_args__ = (
        UniqueConstraint("user_id", "achievement_id", name="uq_user_achievement"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    achievement_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False)
    earned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    progress_jsonb: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)


# -- 12.2 Push notifications --------------------------------------------------

class NotificationDevice(Base):
    __tablename__ = "notification_devices"
    __table_args__ = (
        UniqueConstraint("push_token", name="uq_device_token"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    platform: Mapped[str] = mapped_column(_PG_DEVICE_PLATFORM, nullable=False)
    push_token: Mapped[str] = mapped_column(String(500), nullable=False)
    app_version: Mapped[str | None] = mapped_column(String(40))
    locale: Mapped[str] = mapped_column(String(8), default="en", nullable=False)
    timezone: Mapped[str | None] = mapped_column(String(60))
    preferences: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class PushNotification(Base):
    __tablename__ = "push_notifications"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    device_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("notification_devices.id", ondelete="SET NULL"))
    kind: Mapped[str] = mapped_column(_PG_NOTIF_KIND, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    deep_link: Mapped[str | None] = mapped_column(String(500))
    data: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    status: Mapped[str] = mapped_column(_PG_NOTIF_STATUS, default=NotificationStatus.queued.value, nullable=False)
    provider: Mapped[str | None] = mapped_column(String(40))
    provider_message_id: Mapped[str | None] = mapped_column(String(120))
    error_message: Mapped[str | None] = mapped_column(Text)
    queued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    opened_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


# -- 12.3 Study plans ---------------------------------------------------------

class StudyPlan(Base):
    __tablename__ = "study_plans"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tier: Mapped[str] = mapped_column(String(40), nullable=False)
    framework: Mapped[str] = mapped_column(String(40), nullable=False)
    exam: Mapped[str | None] = mapped_column(String(80))
    target_date: Mapped[date] = mapped_column(Date, nullable=False)
    daily_target_minutes: Mapped[int] = mapped_column(Integer, default=60, nullable=False)
    target_mastery: Mapped[float] = mapped_column(Numeric(4, 3), default=0.80, nullable=False)
    status: Mapped[str] = mapped_column(_PG_PLAN_STATUS, default=StudyPlanStatus.active.value, nullable=False)
    generated_jsonb: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    generator_version: Mapped[str] = mapped_column(String(20), default="v1", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class StudyPlanWeek(Base):
    __tablename__ = "study_plan_weeks"
    __table_args__ = (
        UniqueConstraint("plan_id", "week_index", name="uq_plan_week"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plan_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("study_plans.id", ondelete="CASCADE"), nullable=False)
    week_index: Mapped[int] = mapped_column(Integer, nullable=False)
    starts_on: Mapped[date] = mapped_column(Date, nullable=False)
    ends_on: Mapped[date] = mapped_column(Date, nullable=False)
    target_skill_codes: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    target_item_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    target_minutes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_diagnostic_week: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_mock_week: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_review_week: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    recommended_item_ids: Mapped[list[uuid.UUID]] = mapped_column(ARRAY(UUID(as_uuid=True)), default=list)
    completed_item_ids: Mapped[list[uuid.UUID]] = mapped_column(ARRAY(UUID(as_uuid=True)), default=list)
    minutes_studied: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


# -- 12.4 Offline sync --------------------------------------------------------

class OfflineBundle(Base):
    __tablename__ = "offline_bundles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    kind: Mapped[str] = mapped_column(String(40), nullable=False)
    etag: Mapped[str] = mapped_column(String(80), nullable=False)
    payload_jsonb: Mapped[dict] = mapped_column(JSONB, nullable=False)
    size_bytes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    item_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    skill_codes: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class OfflineSyncReceipt(Base):
    __tablename__ = "offline_sync_receipts"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    bundle_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("offline_bundles.id", ondelete="SET NULL"))
    device_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("notification_devices.id", ondelete="SET NULL"))
    attempts_replayed_jsonb: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    received_attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    received_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# -- 12.5 Live sessions -------------------------------------------------------

class LiveSession(Base):
    __tablename__ = "live_sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instructor_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    instructor_kind: Mapped[str] = mapped_column(String(20), default="marketplace", nullable=False)
    title: Mapped[str] = mapped_column(String(240), nullable=False)
    description_md: Mapped[str | None] = mapped_column(Text)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    booked_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    price_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    target_skill_codes: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    meeting_url: Mapped[str | None] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(_PG_LIVE_STATUS, default=LiveSessionStatus.scheduled.value, nullable=False)
    canceled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    cancel_reason: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class LiveSessionBooking(Base):
    __tablename__ = "live_session_bookings"
    __table_args__ = (
        UniqueConstraint("session_id", "user_id", name="uq_session_user"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("live_sessions.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status: Mapped[str] = mapped_column(_PG_BOOKING_STATUS, default=BookingStatus.pending.value, nullable=False)
    purchase_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    seat_number: Mapped[int | None] = mapped_column(Integer)
    joined_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    canceled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    cancel_reason: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

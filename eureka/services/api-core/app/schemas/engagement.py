"""
Phase 12 — Engagement Pydantic schemas.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# -- 12.1 Streaks + XP + achievements ----------------------------------------

class EngagementStateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: UUID
    current_streak_days: int
    longest_streak_days: int
    last_active_on: Optional[date]
    xp: int
    level: int
    show_on_leaderboard: bool


class RecordActivityRequest(BaseModel):
    source: str  # see XP_RULES keys
    ref_kind: Optional[str] = None
    ref_id: Optional[UUID] = None
    xp_override: Optional[int] = None


class RecordActivityResponse(BaseModel):
    xp_awarded: int
    new_total_xp: int
    new_level: int
    leveled_up: bool
    streak_days: int
    streak_started_or_continued: bool
    streak_broken: bool
    new_achievements: list[str] = Field(default_factory=list)


class AchievementCreateRequest(BaseModel):
    slug: str = Field(..., min_length=3, max_length=80, pattern=r"^[a-z0-9][a-z0-9_-]*$")
    name: str = Field(..., max_length=120)
    description: Optional[str] = None
    rarity: str = "common"
    icon_url: Optional[str] = None
    xp_reward: int = Field(0, ge=0, le=10000)
    trigger_jsonb: dict = Field(default_factory=dict)
    is_active: bool = True


class AchievementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    name: str
    description: Optional[str]
    rarity: str
    icon_url: Optional[str]
    xp_reward: int
    trigger_jsonb: dict
    is_active: bool


class UserAchievementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    achievement_id: UUID
    earned_at: datetime
    progress_jsonb: dict


class LeaderboardRow(BaseModel):
    user_id: UUID
    xp: Optional[int] = None
    level: Optional[int] = None
    current_streak_days: Optional[int] = None
    xp_in_window: Optional[int] = None
    period_days: Optional[int] = None


# -- 12.2 Push notifications --------------------------------------------------

class DeviceRegisterRequest(BaseModel):
    platform: str  # ios|android|web
    push_token: str = Field(..., min_length=8, max_length=500)
    app_version: Optional[str] = None
    locale: str = "en"
    timezone: Optional[str] = None
    preferences: dict = Field(default_factory=dict)


class DeviceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    platform: str
    app_version: Optional[str]
    locale: str
    timezone: Optional[str]
    preferences: dict
    last_seen_at: datetime
    revoked_at: Optional[datetime]


class NotificationEnqueueRequest(BaseModel):
    user_id: UUID
    kind: str
    title: str = Field(..., max_length=200)
    body: str
    deep_link: Optional[str] = None
    data: dict = Field(default_factory=dict)


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    device_id: Optional[UUID]
    kind: str
    title: str
    body: str
    deep_link: Optional[str]
    data: dict
    status: str
    provider: Optional[str]
    queued_at: datetime
    sent_at: Optional[datetime]
    delivered_at: Optional[datetime]
    opened_at: Optional[datetime]


# -- 12.3 Study plans ---------------------------------------------------------

class StudyPlanGenerateRequest(BaseModel):
    tier: str
    framework: str
    target_date: date
    exam: Optional[str] = None
    daily_target_minutes: int = Field(60, ge=5, le=600)
    target_mastery: float = Field(0.80, ge=0.5, le=1.0)


class StudyPlanWeekResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    week_index: int
    starts_on: date
    ends_on: date
    target_skill_codes: list[str]
    target_item_count: int
    target_minutes: int
    is_diagnostic_week: bool
    is_mock_week: bool
    is_review_week: bool
    recommended_item_ids: list[UUID]
    completed_item_ids: list[UUID]
    minutes_studied: int
    completed_at: Optional[datetime]


class StudyPlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    tier: str
    framework: str
    exam: Optional[str]
    target_date: date
    daily_target_minutes: int
    target_mastery: float
    status: str
    generator_version: str
    created_at: datetime
    weeks: list[StudyPlanWeekResponse] = Field(default_factory=list)


# -- 12.4 Offline sync --------------------------------------------------------

class OfflineBundleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    kind: str
    etag: str
    payload_jsonb: dict
    size_bytes: int
    item_count: int
    generated_at: datetime
    expires_at: Optional[datetime]


class OfflineReplayRequest(BaseModel):
    bundle_id: Optional[UUID] = None
    device_id: Optional[UUID] = None
    attempts: list[dict] = Field(default_factory=list)


class OfflineReplayResponse(BaseModel):
    receipt_id: int
    received_attempts: int


# -- 12.5 Live sessions -------------------------------------------------------

class LiveSessionCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=240)
    description_md: Optional[str] = None
    starts_at: datetime
    duration_minutes: int = Field(..., ge=5, le=480)
    capacity: int = Field(1, ge=1, le=500)
    price_cents: int = Field(0, ge=0)
    currency: str = "USD"
    target_skill_codes: list[str] = Field(default_factory=list)
    meeting_url: Optional[str] = None


class LiveSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    instructor_id: UUID
    instructor_kind: str
    title: str
    description_md: Optional[str]
    starts_at: datetime
    duration_minutes: int
    capacity: int
    booked_count: int
    price_cents: int
    currency: str
    target_skill_codes: list[str]
    meeting_url: Optional[str]
    status: str
    canceled_at: Optional[datetime]
    cancel_reason: Optional[str]
    created_at: datetime


class LiveSessionCancelRequest(BaseModel):
    reason: Optional[str] = None


class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    session_id: UUID
    user_id: UUID
    status: str
    seat_number: Optional[int]
    joined_at: Optional[datetime]
    canceled_at: Optional[datetime]
    cancel_reason: Optional[str]
    created_at: datetime

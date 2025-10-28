"""
High School Tier - Pydantic Schemas

Gamification schemas for badges, points, leaderboards, and parent portal.
"""

from datetime import datetime
from typing import Optional, Dict, Any, List
from uuid import UUID
from pydantic import BaseModel, Field, validator


# ========================================
# Badge Schemas
# ========================================

class BadgeBase(BaseModel):
    """Base badge schema"""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    icon_url: Optional[str] = None
    category: str = Field(..., description="academic, participation, achievement, social")
    tier: str = Field(default="high_school")
    points: int = Field(default=0, ge=0)
    requirements: Optional[Dict[str, Any]] = None
    is_active: bool = True


class BadgeCreate(BadgeBase):
    """Schema for creating a badge"""
    pass


class BadgeUpdate(BaseModel):
    """Schema for updating a badge"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    icon_url: Optional[str] = None
    category: Optional[str] = None
    points: Optional[int] = Field(None, ge=0)
    requirements: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class BadgeResponse(BadgeBase):
    """Schema for badge response"""
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# ========================================
# User Badge Schemas
# ========================================

class UserBadgeBase(BaseModel):
    """Base user badge schema"""
    user_id: UUID
    badge_id: UUID
    progress: Optional[Dict[str, Any]] = None


class UserBadgeCreate(UserBadgeBase):
    """Schema for awarding a badge"""
    pass


class UserBadgeResponse(BaseModel):
    """Schema for user badge response"""
    id: UUID
    user_id: UUID
    badge_id: UUID
    earned_at: datetime
    progress: Optional[Dict[str, Any]] = None
    badge: Optional[BadgeResponse] = None

    class Config:
        from_attributes = True


# ========================================
# Game Points Schemas
# ========================================

class GamePointsBase(BaseModel):
    """Base game points schema"""
    user_id: UUID


class GamePointsCreate(GamePointsBase):
    """Schema for creating game points record"""
    pass


class GamePointsUpdate(BaseModel):
    """Schema for updating game points"""
    total_points: Optional[int] = Field(None, ge=0)
    level: Optional[int] = Field(None, ge=1)
    streak_days: Optional[int] = Field(None, ge=0)
    achievements_count: Optional[int] = Field(None, ge=0)


class GamePointsResponse(BaseModel):
    """Schema for game points response"""
    id: UUID
    user_id: UUID
    total_points: int
    level: int
    streak_days: int
    last_activity_date: Optional[datetime] = None
    achievements_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PointsAwardRequest(BaseModel):
    """Schema for awarding points"""
    user_id: UUID
    points: int = Field(..., gt=0)
    reason: str = Field(..., min_length=1)


# ========================================
# Leaderboard Schemas
# ========================================

class LeaderboardEntryBase(BaseModel):
    """Base leaderboard entry schema"""
    org_id: UUID
    course_id: Optional[UUID] = None
    user_id: UUID
    score: int = Field(default=0, ge=0)
    period: str = Field(..., description="weekly, monthly, all_time")
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None


class LeaderboardEntryCreate(LeaderboardEntryBase):
    """Schema for creating leaderboard entry"""
    pass


class LeaderboardEntryUpdate(BaseModel):
    """Schema for updating leaderboard entry"""
    score: Optional[int] = Field(None, ge=0)
    rank: Optional[int] = Field(None, ge=1)


class LeaderboardEntryResponse(BaseModel):
    """Schema for leaderboard entry response"""
    id: UUID
    org_id: UUID
    course_id: Optional[UUID] = None
    user_id: UUID
    score: int
    rank: Optional[int] = None
    period: str
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None
    updated_at: datetime
    # User info (joined from API-Core)
    user_name: Optional[str] = None

    class Config:
        from_attributes = True


class LeaderboardQuery(BaseModel):
    """Schema for leaderboard query parameters"""
    org_id: UUID
    course_id: Optional[UUID] = None
    period: str = Field(default="all_time", description="weekly, monthly, all_time")
    limit: int = Field(default=10, ge=1, le=100)


# ========================================
# Parental Consent Schemas
# ========================================

class ParentalConsentBase(BaseModel):
    """Base parental consent schema"""
    student_id: UUID
    parent_email: str = Field(..., regex=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    parent_name: Optional[str] = Field(None, max_length=200)


class ParentalConsentCreate(ParentalConsentBase):
    """Schema for creating parental consent"""
    pass


class ParentalConsentUpdate(BaseModel):
    """Schema for updating parental consent"""
    parent_name: Optional[str] = Field(None, max_length=200)
    consent_given: Optional[bool] = None
    consent_date: Optional[datetime] = None


class ParentalConsentResponse(BaseModel):
    """Schema for parental consent response"""
    id: UUID
    student_id: UUID
    parent_email: str
    parent_name: Optional[str] = None
    consent_given: bool
    consent_date: Optional[datetime] = None
    verified_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ConsentVerificationRequest(BaseModel):
    """Schema for verifying parental consent"""
    verification_token: str


# ========================================
# Parent Activity Schemas
# ========================================

class ParentActivityBase(BaseModel):
    """Base parent activity schema"""
    parent_email: str
    student_id: UUID
    activity_type: str = Field(..., description="viewed_grades, viewed_attendance, sent_message")
    activity_data: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None


class ParentActivityCreate(ParentActivityBase):
    """Schema for creating parent activity"""
    pass


class ParentActivityResponse(BaseModel):
    """Schema for parent activity response"""
    id: UUID
    parent_email: str
    student_id: UUID
    activity_type: str
    activity_data: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ========================================
# List Response Schemas
# ========================================

class BadgeListResponse(BaseModel):
    """Schema for list of badges"""
    data: List[BadgeResponse]
    total: int
    page: int
    page_size: int


class UserBadgeListResponse(BaseModel):
    """Schema for list of user badges"""
    data: List[UserBadgeResponse]
    total: int
    page: int
    page_size: int


class LeaderboardResponse(BaseModel):
    """Schema for leaderboard response"""
    data: List[LeaderboardEntryResponse]
    total: int
    period: str


class ParentActivityListResponse(BaseModel):
    """Schema for list of parent activities"""
    data: List[ParentActivityResponse]
    total: int
    page: int
    page_size: int

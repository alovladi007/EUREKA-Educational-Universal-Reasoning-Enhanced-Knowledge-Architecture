"""
High School Tier Models

Gamification, badges, leaderboards, and parent portal models.
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Badge(Base):
    """Achievement badges for students"""
    __tablename__ = "badges"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    icon_url = Column(String(500))
    category = Column(String(50))  # academic, participation, achievement, social
    tier = Column(String(50), nullable=False)  # high_school
    points = Column(Integer, default=0)
    requirements = Column(JSON)  # Criteria to earn the badge
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())


class UserBadge(Base):
    """Badges earned by users"""
    __tablename__ = "user_badges"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    badge_id = Column(UUID(as_uuid=True), ForeignKey("badges.id"), nullable=False)
    earned_at = Column(DateTime, server_default=func.now())
    progress = Column(JSON)  # Progress towards badge requirements
    
    badge = relationship("Badge")


class GamePoints(Base):
    """Gamification points tracking"""
    __tablename__ = "game_points"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, unique=True)
    total_points = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak_days = Column(Integer, default=0)
    last_activity_date = Column(DateTime)
    achievements_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())


class LeaderboardEntry(Base):
    """Leaderboard rankings"""
    __tablename__ = "leaderboard_entries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), nullable=False)
    course_id = Column(UUID(as_uuid=True))  # Optional - course-specific leaderboard
    user_id = Column(UUID(as_uuid=True), nullable=False)
    score = Column(Integer, default=0)
    rank = Column(Integer)
    period = Column(String(20))  # weekly, monthly, all_time
    period_start = Column(DateTime)
    period_end = Column(DateTime)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class ParentalConsent(Base):
    """COPPA compliance - parental consent records"""
    __tablename__ = "parental_consents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), nullable=False)
    parent_email = Column(String(255), nullable=False)
    parent_name = Column(String(200))
    consent_given = Column(Boolean, default=False)
    consent_date = Column(DateTime)
    consent_ip = Column(String(45))
    verification_token = Column(String(255))
    verification_sent_at = Column(DateTime)
    verified_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())


class ParentActivity(Base):
    """Parent portal activity logs"""
    __tablename__ = "parent_activities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parent_email = Column(String(255), nullable=False)
    student_id = Column(UUID(as_uuid=True), nullable=False)
    activity_type = Column(String(50))  # viewed_grades, viewed_attendance, sent_message
    activity_data = Column(JSON)
    ip_address = Column(String(45))
    created_at = Column(DateTime, server_default=func.now())

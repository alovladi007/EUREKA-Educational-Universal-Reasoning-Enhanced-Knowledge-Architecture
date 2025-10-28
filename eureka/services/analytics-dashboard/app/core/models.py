"""
Analytics Dashboard Service - Database Models

Provides comprehensive analytics for students, courses, and learning outcomes.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, 
    ForeignKey, Text, JSON, Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
import uuid
import enum

Base = declarative_base()


class MetricType(str, enum.Enum):
    """Types of metrics"""
    ENGAGEMENT = "engagement"
    PERFORMANCE = "performance"
    PROGRESS = "progress"
    COMPLETION = "completion"
    TIME_SPENT = "time_spent"
    ASSESSMENT_SCORE = "assessment_score"


class AlertSeverity(str, enum.Enum):
    """Alert severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TrendDirection(str, enum.Enum):
    """Trend direction"""
    UP = "up"
    DOWN = "down"
    STABLE = "stable"


# 1. Student Analytics - Individual Performance
class StudentAnalytics(Base):
    """Aggregated analytics for individual students"""
    __tablename__ = "student_analytics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Engagement metrics
    total_logins = Column(Integer, default=0)
    days_active = Column(Integer, default=0)
    average_session_minutes = Column(Float, default=0.0)
    last_activity = Column(DateTime)
    
    # Progress metrics
    concepts_started = Column(Integer, default=0)
    concepts_completed = Column(Integer, default=0)
    completion_percentage = Column(Float, default=0.0)
    
    # Performance metrics
    average_assessment_score = Column(Float, default=0.0)
    assessments_taken = Column(Integer, default=0)
    assessments_passed = Column(Integer, default=0)
    
    # Time metrics
    total_time_minutes = Column(Integer, default=0)
    time_this_week = Column(Integer, default=0)
    time_this_month = Column(Integer, default=0)
    
    # Badges & achievements
    total_badges = Column(Integer, default=0)
    total_points = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    
    # Timestamps
    period_start = Column(DateTime, default=datetime.utcnow)
    period_end = Column(DateTime)
    last_calculated = Column(DateTime, default=datetime.utcnow)


# 2. Course Analytics - Course-Wide Metrics
class CourseAnalytics(Base):
    """Aggregated analytics for courses"""
    __tablename__ = "course_analytics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), nullable=False, unique=True, index=True)
    
    # Enrollment metrics
    total_students = Column(Integer, default=0)
    active_students = Column(Integer, default=0)
    inactive_students = Column(Integer, default=0)
    
    # Completion metrics
    average_completion_rate = Column(Float, default=0.0)
    students_completed = Column(Integer, default=0)
    
    # Performance metrics
    average_grade = Column(Float, default=0.0)
    pass_rate = Column(Float, default=0.0)
    
    # Engagement metrics
    average_time_per_student = Column(Float, default=0.0)
    total_course_time = Column(Integer, default=0)
    
    # Content metrics
    most_viewed_content = Column(JSON, default=list)
    difficult_concepts = Column(JSON, default=list)
    
    # Assessment metrics
    assessments_created = Column(Integer, default=0)
    assessments_submitted = Column(Integer, default=0)
    average_assessment_score = Column(Float, default=0.0)
    
    # Timestamps
    period_start = Column(DateTime, default=datetime.utcnow)
    period_end = Column(DateTime)
    last_calculated = Column(DateTime, default=datetime.utcnow)


# 3. Learning Outcomes - Achievement Tracking
class LearningOutcome(Base):
    """Track achievement of learning outcomes"""
    __tablename__ = "learning_outcomes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Outcome details
    name = Column(String(200), nullable=False)
    description = Column(Text)
    target_mastery = Column(Float, default=0.85)  # 85% mastery target
    
    # Associated concepts
    concept_ids = Column(JSON, default=list)
    assessment_ids = Column(JSON, default=list)
    
    # Achievement stats
    students_achieved = Column(Integer, default=0)
    average_mastery = Column(Float, default=0.0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# 4. Student Outcome Achievement
class StudentOutcomeAchievement(Base):
    """Track individual student achievement of learning outcomes"""
    __tablename__ = "student_outcome_achievements"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    outcome_id = Column(UUID(as_uuid=True), ForeignKey("learning_outcomes.id"), nullable=False)
    
    # Achievement
    is_achieved = Column(Boolean, default=False)
    mastery_level = Column(Float, default=0.0)
    
    # Evidence
    supporting_assessments = Column(JSON, default=list)
    achieved_concepts = Column(JSON, default=list)
    
    # Timestamps
    first_attempt = Column(DateTime, default=datetime.utcnow)
    achieved_at = Column(DateTime)


# 5. At-Risk Alerts - Proactive Identification
class AtRiskAlert(Base):
    """Identify and track at-risk students"""
    __tablename__ = "at_risk_alerts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Alert details
    alert_type = Column(String(100), nullable=False)  # low_engagement, failing_grades, etc.
    severity = Column(SQLEnum(AlertSeverity), default=AlertSeverity.MEDIUM)
    
    # Risk factors
    risk_score = Column(Float)  # 0.0 - 1.0
    contributing_factors = Column(JSON, default=list)
    
    # Description
    message = Column(Text)
    recommendation = Column(Text)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(UUID(as_uuid=True))
    acknowledged_at = Column(DateTime)
    
    # Resolution
    is_resolved = Column(Boolean, default=False)
    resolution_notes = Column(Text)
    resolved_at = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# 6. Engagement Events - Activity Tracking
class EngagementEvent(Base):
    """Track individual engagement events for detailed analytics"""
    __tablename__ = "engagement_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), index=True)
    
    # Event details
    event_type = Column(String(100), nullable=False)  # login, view_content, submit_assignment, etc.
    event_category = Column(String(50))  # engagement, learning, assessment
    
    # Event data
    resource_id = Column(UUID(as_uuid=True))  # ID of content, assessment, etc.
    resource_type = Column(String(50))  # content, assessment, discussion, etc.
    
    # Metadata
    duration_seconds = Column(Integer)
    event_metadata = Column(JSON)  # Renamed from 'metadata' to avoid SQLAlchemy conflict
    
    # Timestamp
    occurred_at = Column(DateTime, default=datetime.utcnow, index=True)


# 7. Performance Trends - Time Series Data
class PerformanceTrend(Base):
    """Track performance trends over time"""
    __tablename__ = "performance_trends"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Metric
    metric_type = Column(SQLEnum(MetricType), nullable=False)
    metric_value = Column(Float, nullable=False)
    
    # Trend analysis
    trend_direction = Column(SQLEnum(TrendDirection))
    change_percentage = Column(Float)
    
    # Period
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    
    # Comparison
    previous_value = Column(Float)
    
    # Timestamp
    recorded_at = Column(DateTime, default=datetime.utcnow)


# 8. Cohort Analytics - Group Comparisons
class CohortAnalytics(Base):
    """Analytics for student cohorts"""
    __tablename__ = "cohort_analytics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    cohort_name = Column(String(200), nullable=False)
    
    # Cohort definition
    student_ids = Column(JSON, default=list)
    course_ids = Column(JSON, default=list)
    
    # Metrics
    average_performance = Column(Float, default=0.0)
    average_engagement = Column(Float, default=0.0)
    completion_rate = Column(Float, default=0.0)
    
    # Comparisons
    compared_to_cohorts = Column(JSON, default=list)
    
    # Period
    period_start = Column(DateTime, default=datetime.utcnow)
    period_end = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    last_calculated = Column(DateTime, default=datetime.utcnow)

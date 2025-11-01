"""
Analytics Dashboard Service - Pydantic Schemas
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field
from app.core.models import MetricType, AlertSeverity, TrendDirection


# ============= Student Analytics Schemas =============

class StudentAnalyticsBase(BaseModel):
    total_logins: int = 0
    days_active: int = 0
    average_session_minutes: float = 0.0
    concepts_started: int = 0
    concepts_completed: int = 0
    completion_percentage: float = Field(0.0, ge=0.0, le=100.0)
    average_assessment_score: float = Field(0.0, ge=0.0, le=100.0)
    assessments_taken: int = 0
    assessments_passed: int = 0
    total_time_minutes: int = 0
    time_this_week: int = 0
    time_this_month: int = 0
    total_badges: int = 0
    total_points: int = 0
    current_streak: int = 0


class StudentAnalyticsResponse(StudentAnalyticsBase):
    id: UUID
    user_id: UUID
    course_id: UUID
    last_activity: Optional[datetime] = None
    period_start: datetime
    period_end: Optional[datetime] = None
    last_calculated: datetime
    
    class Config:
        from_attributes = True


# ============= Course Analytics Schemas =============

class CourseAnalyticsBase(BaseModel):
    total_students: int = 0
    active_students: int = 0
    inactive_students: int = 0
    average_completion_rate: float = Field(0.0, ge=0.0, le=100.0)
    students_completed: int = 0
    average_grade: float = Field(0.0, ge=0.0, le=100.0)
    pass_rate: float = Field(0.0, ge=0.0, le=100.0)
    average_time_per_student: float = 0.0
    total_course_time: int = 0
    assessments_created: int = 0
    assessments_submitted: int = 0
    average_assessment_score: float = Field(0.0, ge=0.0, le=100.0)


class CourseAnalyticsResponse(CourseAnalyticsBase):
    id: UUID
    course_id: UUID
    most_viewed_content: List[Dict[str, Any]] = Field(default_factory=list)
    difficult_concepts: List[Dict[str, Any]] = Field(default_factory=list)
    period_start: datetime
    period_end: Optional[datetime] = None
    last_calculated: datetime
    
    class Config:
        from_attributes = True


# ============= Learning Outcome Schemas =============

class LearningOutcomeBase(BaseModel):
    name: str = Field(..., max_length=200)
    description: Optional[str] = None
    target_mastery: float = Field(0.85, ge=0.0, le=1.0)
    concept_ids: List[UUID] = Field(default_factory=list)
    assessment_ids: List[UUID] = Field(default_factory=list)


class LearningOutcomeCreate(LearningOutcomeBase):
    course_id: UUID


class LearningOutcomeUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    target_mastery: Optional[float] = Field(None, ge=0.0, le=1.0)
    concept_ids: Optional[List[UUID]] = None
    assessment_ids: Optional[List[UUID]] = None


class LearningOutcomeResponse(LearningOutcomeBase):
    id: UUID
    course_id: UUID
    students_achieved: int
    average_mastery: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============= Student Outcome Achievement Schemas =============

class StudentOutcomeAchievementResponse(BaseModel):
    id: UUID
    user_id: UUID
    outcome_id: UUID
    is_achieved: bool
    mastery_level: float
    supporting_assessments: List[UUID]
    achieved_concepts: List[UUID]
    first_attempt: datetime
    achieved_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============= At-Risk Alert Schemas =============

class AtRiskAlertBase(BaseModel):
    alert_type: str = Field(..., max_length=100)
    severity: AlertSeverity
    risk_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    contributing_factors: List[str] = Field(default_factory=list)
    message: Optional[str] = None
    recommendation: Optional[str] = None


class AtRiskAlertCreate(AtRiskAlertBase):
    user_id: UUID
    course_id: UUID


class AtRiskAlertUpdate(BaseModel):
    is_acknowledged: Optional[bool] = None
    acknowledged_by: Optional[UUID] = None
    is_resolved: Optional[bool] = None
    resolution_notes: Optional[str] = None


class AtRiskAlertResponse(AtRiskAlertBase):
    id: UUID
    user_id: UUID
    course_id: UUID
    is_active: bool
    is_acknowledged: bool
    acknowledged_by: Optional[UUID] = None
    acknowledged_at: Optional[datetime] = None
    is_resolved: bool
    resolution_notes: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============= Engagement Event Schemas =============

class EngagementEventCreate(BaseModel):
    user_id: UUID
    course_id: Optional[UUID] = None
    event_type: str = Field(..., max_length=100)
    event_category: Optional[str] = Field(None, max_length=50)
    resource_id: Optional[UUID] = None
    resource_type: Optional[str] = Field(None, max_length=50)
    duration_seconds: Optional[int] = Field(None, ge=0)
    event_metadata: Optional[Dict[str, Any]] = None


class EngagementEventResponse(BaseModel):
    id: UUID
    user_id: UUID
    course_id: Optional[UUID] = None
    event_type: str
    event_category: Optional[str] = None
    resource_id: Optional[UUID] = None
    resource_type: Optional[str] = None
    duration_seconds: Optional[int] = None
    event_metadata: Optional[Dict[str, Any]] = None
    occurred_at: datetime
    
    class Config:
        from_attributes = True


# ============= Performance Trend Schemas =============

class PerformanceTrendResponse(BaseModel):
    id: UUID
    user_id: UUID
    course_id: UUID
    metric_type: MetricType
    metric_value: float
    trend_direction: Optional[TrendDirection] = None
    change_percentage: Optional[float] = None
    period_start: datetime
    period_end: datetime
    previous_value: Optional[float] = None
    recorded_at: datetime
    
    class Config:
        from_attributes = True


# ============= Cohort Analytics Schemas =============

class CohortAnalyticsBase(BaseModel):
    cohort_name: str = Field(..., max_length=200)
    student_ids: List[UUID] = Field(default_factory=list)
    course_ids: List[UUID] = Field(default_factory=list)


class CohortAnalyticsCreate(CohortAnalyticsBase):
    organization_id: UUID


class CohortAnalyticsResponse(CohortAnalyticsBase):
    id: UUID
    organization_id: UUID
    average_performance: float
    average_engagement: float
    completion_rate: float
    compared_to_cohorts: List[Dict[str, Any]]
    period_start: datetime
    period_end: Optional[datetime] = None
    created_at: datetime
    last_calculated: datetime
    
    class Config:
        from_attributes = True


# ============= Dashboard Summaries =============

class StudentDashboardSummary(BaseModel):
    """Complete dashboard summary for a student"""
    user_id: UUID
    analytics: StudentAnalyticsResponse
    alerts: List[AtRiskAlertResponse]
    recent_performance: List[PerformanceTrendResponse]
    achievements: List[StudentOutcomeAchievementResponse]
    engagement_score: float  # 0-100
    performance_rating: str  # excellent, good, average, below_average, poor


class CourseDashboardSummary(BaseModel):
    """Complete dashboard summary for a course"""
    course_id: UUID
    analytics: CourseAnalyticsResponse
    at_risk_students: List[AtRiskAlertResponse]
    top_performers: List[Dict[str, Any]]
    struggling_students: List[Dict[str, Any]]
    engagement_trends: List[PerformanceTrendResponse]
    learning_outcome_progress: List[LearningOutcomeResponse]


class OrganizationDashboardSummary(BaseModel):
    """Complete dashboard summary for an organization"""
    organization_id: UUID
    total_students: int
    total_courses: int
    active_courses: int
    average_course_completion: float
    total_at_risk_students: int
    most_popular_courses: List[Dict[str, Any]]
    cohort_comparisons: List[CohortAnalyticsResponse]


# ============= Request Models =============

class CalculateAnalyticsRequest(BaseModel):
    """Request to calculate/recalculate analytics"""
    entity_type: str = Field(..., pattern="^(student|course|organization|cohort)$")
    entity_id: UUID
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None


class IdentifyAtRiskRequest(BaseModel):
    """Request to identify at-risk students"""
    course_id: Optional[UUID] = None
    organization_id: Optional[UUID] = None
    severity_threshold: Optional[AlertSeverity] = None


class ComparePerformanceRequest(BaseModel):
    """Request to compare student/cohort performance"""
    entity_ids: List[UUID]
    entity_type: str = Field(..., pattern="^(student|cohort)$")
    course_id: UUID
    metrics: List[MetricType] = Field(default_factory=list)

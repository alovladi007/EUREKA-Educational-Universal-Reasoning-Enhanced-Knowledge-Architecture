"""
Analytics Dashboard Service - API Endpoints
"""
from datetime import datetime
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.core.database import get_db
from app.core.models import (
    StudentAnalytics, CourseAnalytics, AtRiskAlert, EngagementEvent,
    LearningOutcome, StudentOutcomeAchievement, PerformanceTrend, CohortAnalytics
)
from app.schemas import (
    StudentAnalyticsResponse, CourseAnalyticsResponse,
    AtRiskAlertResponse, AtRiskAlertUpdate,
    EngagementEventCreate, EngagementEventResponse,
    LearningOutcomeCreate, LearningOutcomeUpdate, LearningOutcomeResponse,
    StudentOutcomeAchievementResponse, PerformanceTrendResponse,
    CohortAnalyticsCreate, CohortAnalyticsResponse,
    CalculateAnalyticsRequest, IdentifyAtRiskRequest,
    StudentDashboardSummary
)
from app.services.analytics_service import AnalyticsService
from app.core.auth_guard import CurrentUser, require_user, is_staff

# Every analytics route requires a valid access token (previously all data was
# unauthenticated). Per-learner endpoints additionally enforce ownership below.
router = APIRouter(dependencies=[Depends(require_user)])
analytics_service = AnalyticsService()


def _ensure_self_or_staff(user: CurrentUser, target_user_id: UUID) -> None:
    """Reject cross-learner access: a learner may only read their own records;
    staff (teacher/admin/researcher) may read any."""
    if is_staff(user):
        return
    if str(target_user_id) != str(user.get("user_id")):
        raise HTTPException(status_code=403, detail="Not authorized for this learner's data")


# ============= Student Analytics =============

@router.post("/analytics/student/calculate", response_model=StudentAnalyticsResponse)
async def calculate_student_analytics(
    user_id: UUID,
    course_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: CurrentUser = Depends(require_user)
):
    """Calculate analytics for a student in a course"""
    _ensure_self_or_staff(user, user_id)
    analytics = await analytics_service.calculate_student_analytics(
        db=db,
        user_id=user_id,
        course_id=course_id
    )
    return analytics


@router.get("/analytics/student/{user_id}", response_model=List[StudentAnalyticsResponse])
async def get_student_analytics(
    user_id: UUID,
    course_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db),
    user: CurrentUser = Depends(require_user)
):
    """Get analytics for a student"""
    _ensure_self_or_staff(user, user_id)
    query = select(StudentAnalytics).where(StudentAnalytics.user_id == user_id)
    
    if course_id:
        query = query.where(StudentAnalytics.course_id == course_id)
    
    result = await db.execute(query)
    return result.scalars().all()


# ============= Course Analytics =============

@router.get("/analytics/course/{course_id}", response_model=CourseAnalyticsResponse)
async def get_course_analytics(
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get analytics for a course"""
    result = await db.execute(
        select(CourseAnalytics).where(CourseAnalytics.course_id == course_id)
    )
    analytics = result.scalar_one_or_none()
    
    if not analytics:
        raise HTTPException(status_code=404, detail="Course analytics not found")
    
    return analytics


# ============= At-Risk Alerts =============

@router.post("/at-risk/identify", response_model=List[AtRiskAlertResponse])
async def identify_at_risk(
    request: IdentifyAtRiskRequest,
    db: AsyncSession = Depends(get_db)
):
    """Identify at-risk students"""
    alerts = await analytics_service.identify_at_risk_students(
        db=db,
        course_id=request.course_id
    )
    return alerts


@router.get("/at-risk/student/{user_id}", response_model=List[AtRiskAlertResponse])
async def get_student_alerts(
    user_id: UUID,
    active_only: bool = True,
    db: AsyncSession = Depends(get_db),
    user: CurrentUser = Depends(require_user)
):
    """Get at-risk alerts for a student"""
    _ensure_self_or_staff(user, user_id)
    query = select(AtRiskAlert).where(AtRiskAlert.user_id == user_id)
    
    if active_only:
        query = query.where(
            and_(
                AtRiskAlert.is_active == True,
                AtRiskAlert.is_resolved == False
            )
        )
    
    result = await db.execute(query.order_by(AtRiskAlert.severity.desc()))
    return result.scalars().all()


@router.get("/at-risk/course/{course_id}", response_model=List[AtRiskAlertResponse])
async def get_course_alerts(
    course_id: UUID,
    active_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """Get at-risk alerts for a course"""
    query = select(AtRiskAlert).where(AtRiskAlert.course_id == course_id)
    
    if active_only:
        query = query.where(
            and_(
                AtRiskAlert.is_active == True,
                AtRiskAlert.is_resolved == False
            )
        )
    
    result = await db.execute(query.order_by(AtRiskAlert.severity.desc()))
    return result.scalars().all()


@router.patch("/at-risk/{alert_id}", response_model=AtRiskAlertResponse)
async def update_alert(
    alert_id: UUID,
    alert_update: AtRiskAlertUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update an at-risk alert"""
    from datetime import datetime
    
    result = await db.execute(
        select(AtRiskAlert).where(AtRiskAlert.id == alert_id)
    )
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    update_data = alert_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(alert, field, value)
    
    if alert.is_acknowledged and not alert.acknowledged_at:
        alert.acknowledged_at = datetime.utcnow()
    
    if alert.is_resolved and not alert.resolved_at:
        alert.resolved_at = datetime.utcnow()
        alert.is_active = False
    
    await db.commit()
    await db.refresh(alert)
    return alert


# ============= Engagement Events =============

@router.post("/events", response_model=EngagementEventResponse)
async def log_engagement_event(
    event: EngagementEventCreate,
    db: AsyncSession = Depends(get_db)
):
    """Log an engagement event"""
    db_event = EngagementEvent(**event.dict())
    db.add(db_event)
    await db.commit()
    await db.refresh(db_event)
    return db_event


@router.get("/events/user/{user_id}", response_model=List[EngagementEventResponse])
async def get_user_events(
    user_id: UUID,
    course_id: Optional[UUID] = None,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    user: CurrentUser = Depends(require_user)
):
    """Get engagement events for a user"""
    _ensure_self_or_staff(user, user_id)
    query = select(EngagementEvent).where(EngagementEvent.user_id == user_id)
    
    if course_id:
        query = query.where(EngagementEvent.course_id == course_id)
    
    result = await db.execute(
        query.order_by(EngagementEvent.occurred_at.desc()).limit(limit)
    )
    return result.scalars().all()


# ============= Dashboards =============

@router.get("/dashboard/student/{user_id}/course/{course_id}", 
            response_model=StudentDashboardSummary)
async def get_student_dashboard(
    user_id: UUID,
    course_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: CurrentUser = Depends(require_user)
):
    """Get complete dashboard summary for a student"""
    _ensure_self_or_staff(user, user_id)
    # Get analytics
    result = await db.execute(
        select(StudentAnalytics).where(
            and_(
                StudentAnalytics.user_id == user_id,
                StudentAnalytics.course_id == course_id
            )
        )
    )
    analytics = result.scalar_one_or_none()
    
    if not analytics:
        raise HTTPException(status_code=404, detail="Analytics not found")
    
    # Get alerts
    alerts_result = await db.execute(
        select(AtRiskAlert).where(
            and_(
                AtRiskAlert.user_id == user_id,
                AtRiskAlert.course_id == course_id,
                AtRiskAlert.is_active == True
            )
        )
    )
    alerts = alerts_result.scalars().all()
    
    # Calculate engagement score
    engagement_score = min(100, (
        (analytics.days_active / 30 * 50) +  # 50% weight for active days
        (min(analytics.total_logins, 20) / 20 * 50)  # 50% weight for logins
    ))
    
    # Determine performance rating
    if analytics.average_assessment_score >= 90:
        rating = "excellent"
    elif analytics.average_assessment_score >= 75:
        rating = "good"
    elif analytics.average_assessment_score >= 60:
        rating = "average"
    elif analytics.average_assessment_score >= 50:
        rating = "below_average"
    else:
        rating = "poor"
    
    return StudentDashboardSummary(
        user_id=user_id,
        analytics=analytics,
        alerts=alerts,
        recent_performance=[],  # TODO: Add performance trends
        achievements=[],  # TODO: Add achievements
        engagement_score=engagement_score,
        performance_rating=rating
    )


# ============= Learning Outcomes =============

@router.post("/outcomes", response_model=LearningOutcomeResponse, status_code=201)
async def create_learning_outcome(
    outcome: LearningOutcomeCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new learning outcome"""
    db_outcome = LearningOutcome(**outcome.dict())
    db.add(db_outcome)
    await db.commit()
    await db.refresh(db_outcome)
    return db_outcome


@router.get("/outcomes/{outcome_id}", response_model=LearningOutcomeResponse)
async def get_learning_outcome(
    outcome_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific learning outcome"""
    result = await db.execute(
        select(LearningOutcome).where(LearningOutcome.id == outcome_id)
    )
    outcome = result.scalar_one_or_none()

    if not outcome:
        raise HTTPException(status_code=404, detail="Learning outcome not found")

    return outcome


@router.get("/courses/{course_id}/outcomes", response_model=List[LearningOutcomeResponse])
async def list_course_outcomes(
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """List all learning outcomes for a course"""
    result = await db.execute(
        select(LearningOutcome).where(LearningOutcome.course_id == course_id)
    )
    return result.scalars().all()


@router.patch("/outcomes/{outcome_id}", response_model=LearningOutcomeResponse)
async def update_learning_outcome(
    outcome_id: UUID,
    outcome_update: LearningOutcomeUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a learning outcome"""
    result = await db.execute(
        select(LearningOutcome).where(LearningOutcome.id == outcome_id)
    )
    outcome = result.scalar_one_or_none()

    if not outcome:
        raise HTTPException(status_code=404, detail="Learning outcome not found")

    update_data = outcome_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(outcome, field, value)

    await db.commit()
    await db.refresh(outcome)
    return outcome


@router.delete("/outcomes/{outcome_id}", status_code=204)
async def delete_learning_outcome(
    outcome_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a learning outcome"""
    result = await db.execute(
        select(LearningOutcome).where(LearningOutcome.id == outcome_id)
    )
    outcome = result.scalar_one_or_none()

    if not outcome:
        raise HTTPException(status_code=404, detail="Learning outcome not found")

    await db.delete(outcome)
    await db.commit()
    return None


# ============= Student Outcome Achievements =============

@router.get("/users/{user_id}/achievements", response_model=List[StudentOutcomeAchievementResponse])
async def get_student_achievements(
    user_id: UUID,
    outcome_id: Optional[UUID] = None,
    achieved_only: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """Get student outcome achievements"""
    query = select(StudentOutcomeAchievement).where(StudentOutcomeAchievement.user_id == user_id)

    if outcome_id:
        query = query.where(StudentOutcomeAchievement.outcome_id == outcome_id)

    if achieved_only:
        query = query.where(StudentOutcomeAchievement.is_achieved == True)

    result = await db.execute(query.order_by(StudentOutcomeAchievement.achieved_at.desc()))
    return result.scalars().all()


@router.get("/outcomes/{outcome_id}/achievements", response_model=List[StudentOutcomeAchievementResponse])
async def get_outcome_achievements(
    outcome_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get all students who achieved a specific outcome"""
    result = await db.execute(
        select(StudentOutcomeAchievement).where(
            and_(
                StudentOutcomeAchievement.outcome_id == outcome_id,
                StudentOutcomeAchievement.is_achieved == True
            )
        )
    )
    return result.scalars().all()


# ============= Performance Trends =============

@router.post("/trends", response_model=PerformanceTrendResponse, status_code=201)
async def create_performance_trend(
    user_id: UUID,
    course_id: UUID,
    metric_type: str,
    metric_value: float,
    period_start: datetime,
    period_end: datetime,
    db: AsyncSession = Depends(get_db)
):
    """Create a performance trend record"""
    from app.core.models import MetricType
    from datetime import datetime

    trend = PerformanceTrend(
        user_id=user_id,
        course_id=course_id,
        metric_type=MetricType(metric_type),
        metric_value=metric_value,
        period_start=period_start,
        period_end=period_end
    )
    db.add(trend)
    await db.commit()
    await db.refresh(trend)
    return trend


@router.get("/trends/user/{user_id}", response_model=List[PerformanceTrendResponse])
async def get_user_performance_trends(
    user_id: UUID,
    course_id: Optional[UUID] = None,
    metric_type: Optional[str] = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Get performance trends for a user"""
    from app.core.models import MetricType

    query = select(PerformanceTrend).where(PerformanceTrend.user_id == user_id)

    if course_id:
        query = query.where(PerformanceTrend.course_id == course_id)

    if metric_type:
        query = query.where(PerformanceTrend.metric_type == MetricType(metric_type))

    result = await db.execute(
        query.order_by(PerformanceTrend.period_start.desc()).limit(limit)
    )
    return result.scalars().all()


# ============= Cohort Analytics =============

@router.post("/cohorts", response_model=CohortAnalyticsResponse, status_code=201)
async def create_cohort(
    cohort: CohortAnalyticsCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new cohort for analytics"""
    db_cohort = CohortAnalytics(**cohort.dict())
    db.add(db_cohort)
    await db.commit()
    await db.refresh(db_cohort)
    return db_cohort


@router.get("/cohorts/{cohort_id}", response_model=CohortAnalyticsResponse)
async def get_cohort(
    cohort_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific cohort"""
    result = await db.execute(
        select(CohortAnalytics).where(CohortAnalytics.id == cohort_id)
    )
    cohort = result.scalar_one_or_none()

    if not cohort:
        raise HTTPException(status_code=404, detail="Cohort not found")

    return cohort


@router.get("/organizations/{org_id}/cohorts", response_model=List[CohortAnalyticsResponse])
async def list_organization_cohorts(
    org_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """List all cohorts for an organization"""
    result = await db.execute(
        select(CohortAnalytics).where(CohortAnalytics.organization_id == org_id)
    )
    return result.scalars().all()


@router.delete("/cohorts/{cohort_id}", status_code=204)
async def delete_cohort(
    cohort_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a cohort"""
    result = await db.execute(
        select(CohortAnalytics).where(CohortAnalytics.id == cohort_id)
    )
    cohort = result.scalar_one_or_none()

    if not cohort:
        raise HTTPException(status_code=404, detail="Cohort not found")

    await db.delete(cohort)
    await db.commit()
    return None


# ============= Delete Operations =============

@router.delete("/at-risk/{alert_id}", status_code=204)
async def delete_alert(
    alert_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete an at-risk alert"""
    result = await db.execute(
        select(AtRiskAlert).where(AtRiskAlert.id == alert_id)
    )
    alert = result.scalar_one_or_none()

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    await db.delete(alert)
    await db.commit()
    return None


@router.delete("/events/{event_id}", status_code=204)
async def delete_engagement_event(
    event_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete an engagement event"""
    result = await db.execute(
        select(EngagementEvent).where(EngagementEvent.id == event_id)
    )
    event = result.scalar_one_or_none()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    await db.delete(event)
    await db.commit()
    return None

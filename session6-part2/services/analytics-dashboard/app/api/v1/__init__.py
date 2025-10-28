"""
Analytics Dashboard Service - API Endpoints
"""
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.core.database import get_db
from app.core.models import (
    StudentAnalytics, CourseAnalytics, AtRiskAlert, EngagementEvent
)
from app.schemas import (
    StudentAnalyticsResponse, CourseAnalyticsResponse,
    AtRiskAlertResponse, AtRiskAlertUpdate,
    EngagementEventCreate, EngagementEventResponse,
    CalculateAnalyticsRequest, IdentifyAtRiskRequest,
    StudentDashboardSummary
)
from app.services.analytics_service import AnalyticsService

router = APIRouter()
analytics_service = AnalyticsService()


# ============= Student Analytics =============

@router.post("/analytics/student/calculate", response_model=StudentAnalyticsResponse)
async def calculate_student_analytics(
    user_id: UUID,
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Calculate analytics for a student in a course"""
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
    db: AsyncSession = Depends(get_db)
):
    """Get analytics for a student"""
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
    db: AsyncSession = Depends(get_db)
):
    """Get at-risk alerts for a student"""
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
    db: AsyncSession = Depends(get_db)
):
    """Get engagement events for a user"""
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
    db: AsyncSession = Depends(get_db)
):
    """Get complete dashboard summary for a student"""
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

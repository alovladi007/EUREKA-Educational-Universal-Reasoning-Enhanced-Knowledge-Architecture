"""
Analytics Dashboard Service - Core Business Logic

Calculates metrics, identifies at-risk students, and generates insights.
"""
from datetime import datetime, timedelta
from typing import List, Optional, Dict
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.core.models import (
    StudentAnalytics, AtRiskAlert, EngagementEvent,
    PerformanceTrend, MetricType, AlertSeverity, TrendDirection
)
from app.core.config import get_settings

settings = get_settings()


class AnalyticsService:
    """Core service for analytics calculation and insights"""
    
    async def calculate_student_analytics(
        self,
        db: AsyncSession,
        user_id: UUID,
        course_id: UUID,
        period_start: Optional[datetime] = None,
        period_end: Optional[datetime] = None
    ) -> StudentAnalytics:
        """Calculate comprehensive analytics for a student"""
        if not period_end:
            period_end = datetime.utcnow()
        if not period_start:
            period_start = period_end - timedelta(days=30)
        
        # Get or create analytics record
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
            analytics = StudentAnalytics(
                user_id=user_id,
                course_id=course_id,
                period_start=period_start
            )
            db.add(analytics)
        
        # Calculate engagement metrics
        engagement_data = await self._calculate_engagement_metrics(
            db, user_id, course_id, period_start, period_end
        )
        analytics.total_logins = engagement_data['total_logins']
        analytics.days_active = engagement_data['days_active']
        analytics.average_session_minutes = engagement_data['avg_session_minutes']
        analytics.last_activity = engagement_data['last_activity']
        
        # Calculate time metrics
        time_data = await self._calculate_time_metrics(
            db, user_id, course_id, period_start, period_end
        )
        analytics.total_time_minutes = time_data['total_time']
        analytics.time_this_week = time_data['time_this_week']
        analytics.time_this_month = time_data['time_this_month']
        
        analytics.period_end = period_end
        analytics.last_calculated = datetime.utcnow()
        
        await db.commit()
        await db.refresh(analytics)
        
        return analytics
    
    async def _calculate_engagement_metrics(
        self, db: AsyncSession, user_id: UUID, course_id: UUID,
        period_start: datetime, period_end: datetime
    ) -> Dict:
        """Calculate engagement metrics from events"""
        result = await db.execute(
            select(EngagementEvent).where(
                and_(
                    EngagementEvent.user_id == user_id,
                    EngagementEvent.course_id == course_id,
                    EngagementEvent.occurred_at >= period_start,
                    EngagementEvent.occurred_at <= period_end
                )
            )
        )
        events = result.scalars().all()
        
        logins = [e for e in events if e.event_type == 'login']
        unique_days = len(set(e.occurred_at.date() for e in events))
        
        sessions_with_duration = [e for e in events if e.duration_seconds]
        avg_session = (
            sum(e.duration_seconds for e in sessions_with_duration) / len(sessions_with_duration) / 60
            if sessions_with_duration else 0.0
        )
        
        last_activity = max((e.occurred_at for e in events), default=None)
        
        return {
            'total_logins': len(logins),
            'days_active': unique_days,
            'avg_session_minutes': avg_session,
            'last_activity': last_activity
        }
    
    async def _calculate_time_metrics(
        self, db: AsyncSession, user_id: UUID, course_id: UUID,
        period_start: datetime, period_end: datetime
    ) -> Dict:
        """Calculate time spent metrics"""
        result = await db.execute(
            select(EngagementEvent).where(
                and_(
                    EngagementEvent.user_id == user_id,
                    EngagementEvent.course_id == course_id,
                    EngagementEvent.occurred_at >= period_start,
                    EngagementEvent.occurred_at <= period_end,
                    EngagementEvent.duration_seconds.isnot(None)
                )
            )
        )
        events = result.scalars().all()
        
        total_seconds = sum(e.duration_seconds for e in events)
        
        week_ago = datetime.utcnow() - timedelta(days=7)
        week_events = [e for e in events if e.occurred_at >= week_ago]
        week_seconds = sum(e.duration_seconds for e in week_events)
        
        month_ago = datetime.utcnow() - timedelta(days=30)
        month_events = [e for e in events if e.occurred_at >= month_ago]
        month_seconds = sum(e.duration_seconds for e in month_events)
        
        return {
            'total_time': int(total_seconds / 60),
            'time_this_week': int(week_seconds / 60),
            'time_this_month': int(month_seconds / 60)
        }
    
    async def identify_at_risk_students(
        self,
        db: AsyncSession,
        course_id: Optional[UUID] = None
    ) -> List[AtRiskAlert]:
        """Identify students at risk of failing or dropping out"""
        alerts = []
        
        query = select(StudentAnalytics)
        if course_id:
            query = query.where(StudentAnalytics.course_id == course_id)
        
        result = await db.execute(query)
        all_analytics = result.scalars().all()
        
        for analytics in all_analytics:
            risk_factors = []
            risk_score = 0.0
            
            # Check low engagement
            if analytics.days_active < settings.LOW_ENGAGEMENT_DAYS:
                risk_factors.append("low_engagement")
                risk_score += 0.3
            
            # Check failing performance
            if analytics.average_assessment_score < settings.FAILING_THRESHOLD * 100:
                risk_factors.append("failing_grades")
                risk_score += 0.4
            
            # Check inactivity
            if analytics.last_activity:
                days_inactive = (datetime.utcnow() - analytics.last_activity).days
                if days_inactive > 14:
                    risk_factors.append("prolonged_inactivity")
                    risk_score += 0.3
            
            # Create alert if at risk
            if risk_score >= settings.AT_RISK_THRESHOLD:
                existing_alert = await db.execute(
                    select(AtRiskAlert).where(
                        and_(
                            AtRiskAlert.user_id == analytics.user_id,
                            AtRiskAlert.course_id == analytics.course_id,
                            AtRiskAlert.is_active == True,
                            AtRiskAlert.is_resolved == False
                        )
                    )
                )
                
                alert = existing_alert.scalar_one_or_none()
                
                if not alert:
                    severity = self._calculate_alert_severity(risk_score)
                    alert = AtRiskAlert(
                        user_id=analytics.user_id,
                        course_id=analytics.course_id,
                        alert_type="at_risk",
                        severity=severity,
                        risk_score=risk_score,
                        contributing_factors=risk_factors,
                        message=self._generate_alert_message(risk_factors, risk_score),
                        recommendation=self._generate_recommendation(risk_factors)
                    )
                    db.add(alert)
                    alerts.append(alert)
        
        await db.commit()
        
        for alert in alerts:
            await db.refresh(alert)
        
        return alerts
    
    def _calculate_alert_severity(self, risk_score: float) -> AlertSeverity:
        """Determine alert severity from risk score"""
        if risk_score >= 0.9:
            return AlertSeverity.CRITICAL
        elif risk_score >= 0.75:
            return AlertSeverity.HIGH
        elif risk_score >= 0.6:
            return AlertSeverity.MEDIUM
        else:
            return AlertSeverity.LOW
    
    def _generate_alert_message(self, factors: List[str], score: float) -> str:
        """Generate human-readable alert message"""
        if "failing_grades" in factors and "low_engagement" in factors:
            return f"Student is at risk (score: {score:.1%}): Poor performance combined with low engagement"
        elif "failing_grades" in factors:
            return f"Student is at risk (score: {score:.1%}): Consistently low assessment scores"
        elif "low_engagement" in factors:
            return f"Student is at risk (score: {score:.1%}): Very low course engagement"
        else:
            return f"Student is at risk (score: {score:.1%}): Multiple concerning factors"
    
    def _generate_recommendation(self, factors: List[str]) -> str:
        """Generate actionable recommendation"""
        recommendations = []
        
        if "failing_grades" in factors:
            recommendations.append("Schedule one-on-one tutoring")
        if "low_engagement" in factors:
            recommendations.append("Send motivational check-in")
        if "prolonged_inactivity" in factors:
            recommendations.append("Contact student to identify barriers")
        
        return "; ".join(recommendations) if recommendations else "Monitor progress closely"

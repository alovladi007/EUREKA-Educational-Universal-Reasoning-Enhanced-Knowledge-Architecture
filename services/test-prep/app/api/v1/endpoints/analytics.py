"""
Analytics API endpoints - Enhanced with advanced analytics
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.models import User, QuestionAttempt, StudySession
from app.api.v1.endpoints.auth import get_current_user
from app.services.analytics_service import AnalyticsService
from datetime import datetime, timedelta

router = APIRouter()
analytics_service = AnalyticsService()

@router.get("/user-stats")
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive user statistics"""
    # Calculate various stats
    today = datetime.utcnow().date()
    
    questions_today = db.query(func.count(QuestionAttempt.id)).filter(
        QuestionAttempt.user_id == current_user.id,
        func.date(QuestionAttempt.timestamp) == today
    ).scalar() or 0
    
    return {
        "total_questions": current_user.total_questions_answered,
        "overall_accuracy": round(current_user.overall_accuracy * 100, 1) if current_user.overall_accuracy else 0,
        "current_streak": current_user.current_streak_days,
        "questions_today": questions_today,
        "total_study_time": current_user.total_study_time_minutes,
        "ability_level": "Intermediate"  # Calculate based on ability
    }

@router.get("/recent-activity")
async def get_recent_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recent user activity"""
    recent_sessions = db.query(StudySession).filter(
        StudySession.user_id == current_user.id
    ).order_by(StudySession.start_time.desc()).limit(10).all()
    
    activities = []
    for session in recent_sessions:
        activities.append({
            "type": f"{session.session_type.title()} Session",
            "time": session.start_time.strftime("%Y-%m-%d %H:%M"),
            "details": f"{session.total_questions} questions, {round(session.accuracy * 100)}% accuracy"
        })
    
    return {"activities": activities}

@router.get("/performance-trends")
async def get_performance_trends(
    days: int = 7,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get performance trends over time"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    daily_stats = db.query(
        func.date(QuestionAttempt.timestamp).label("date"),
        func.count(QuestionAttempt.id).label("questions"),
        func.avg(func.cast(QuestionAttempt.is_correct, func.Float)).label("accuracy")
    ).filter(
        QuestionAttempt.user_id == current_user.id,
        QuestionAttempt.timestamp >= start_date
    ).group_by(
        func.date(QuestionAttempt.timestamp)
    ).all()
    
    return {
        "trends": [
            {
                "date": stat.date.isoformat() if stat.date else None,
                "questions": stat.questions,
                "accuracy": round(stat.accuracy * 100, 1) if stat.accuracy else 0
            }
            for stat in daily_stats
        ]
    }


# ===== ENHANCED ANALYTICS ENDPOINTS =====


@router.get("/comprehensive")
async def get_comprehensive_analytics(
    exam_type: str = Query(..., description="Exam type (GRE, GMAT, etc.)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive analytics including metrics, predictions, insights, trends, and recommendations

    This is the most complete analytics endpoint providing all available data
    """
    analytics_data = await analytics_service.get_user_analytics(
        db=db,
        user_id=str(current_user.id),
        exam_type=exam_type
    )

    # Convert dataclasses to dicts for JSON serialization
    return {
        'user_id': analytics_data.user_id,
        'exam_type': analytics_data.exam_type,
        'metrics': {
            'readiness_score': analytics_data.metrics.readiness_score,
            'theta': analytics_data.metrics.theta,
            'theta_se': analytics_data.metrics.theta_se,
            'percentile': analytics_data.metrics.percentile,
            'questions_answered': analytics_data.metrics.questions_answered,
            'accuracy_by_difficulty': analytics_data.metrics.accuracy_by_difficulty,
            'average_time_per_question': analytics_data.metrics.average_time_per_question,
            'study_streak': analytics_data.metrics.study_streak,
            'total_study_hours': analytics_data.metrics.total_study_hours,
            'weakness_index': analytics_data.metrics.weakness_index,
            'improvement_rate': analytics_data.metrics.improvement_rate,
            'consistency': analytics_data.metrics.consistency,
            'topic_mastery': {
                topic: {
                    'mastery': tm.mastery,
                    'questions_answered': tm.questions_answered,
                    'accuracy': tm.accuracy,
                    'avg_time': tm.avg_time,
                    'last_practiced': tm.last_practiced.isoformat(),
                    'trend': tm.trend,
                    'confidence_interval': tm.confidence_interval,
                    'gap_to_target': tm.gap_to_target
                }
                for topic, tm in analytics_data.metrics.topic_mastery.items()
            }
        },
        'predictions': {
            'exam_score': {
                'expected': analytics_data.predictions.exam_score.expected,
                'confidence': analytics_data.predictions.exam_score.confidence,
                'range': analytics_data.predictions.exam_score.range,
                'percentile_projection': analytics_data.predictions.exam_score.percentile_projection
            },
            'readiness_date': analytics_data.predictions.readiness_date.isoformat(),
            'probability_of_target': analytics_data.predictions.probability_of_target,
            'critical_topics': analytics_data.predictions.critical_topics,
            'risk_factors': [
                {
                    'type': rf.type,
                    'severity': rf.severity,
                    'impact': rf.impact,
                    'mitigation': rf.mitigation
                }
                for rf in analytics_data.predictions.risk_factors
            ],
            'success_probability': analytics_data.predictions.success_probability
        },
        'insights': [
            {
                'id': insight.id,
                'type': insight.type.value,
                'title': insight.title,
                'description': insight.description,
                'importance': insight.importance,
                'actionable': insight.actionable,
                'recommendations': insight.recommendations,
                'timestamp': insight.timestamp.isoformat()
            }
            for insight in analytics_data.insights
        ],
        'trends': {
            'overall': {
                'direction': analytics_data.trends.overall.direction,
                'magnitude': analytics_data.trends.overall.magnitude,
                'confidence': analytics_data.trends.overall.confidence,
                'forecast': analytics_data.trends.overall.forecast
            },
            'time_management': {
                'direction': analytics_data.trends.time_management.direction,
                'magnitude': analytics_data.trends.time_management.magnitude,
                'confidence': analytics_data.trends.time_management.confidence
            },
            'consistency': {
                'direction': analytics_data.trends.consistency.direction,
                'magnitude': analytics_data.trends.consistency.magnitude,
                'confidence': analytics_data.trends.consistency.confidence
            }
        },
        'peer_comparison': {
            'percentile_rank': analytics_data.comparisons.percentile_rank,
            'average_score': analytics_data.comparisons.average_score,
            'peer_group_size': analytics_data.comparisons.peer_group_size,
            'strengths': analytics_data.comparisons.strengths,
            'weaknesses': analytics_data.comparisons.weaknesses
        },
        'recommendations': [
            {
                'id': rec.id,
                'priority': rec.priority,
                'type': rec.type,
                'title': rec.title,
                'description': rec.description,
                'estimated_impact': rec.estimated_impact,
                'time_required': rec.time_required,
                'resources': [
                    {
                        'type': r.type,
                        'title': r.title,
                        'duration': r.duration
                    }
                    for r in rec.resources
                ]
            }
            for rec in analytics_data.recommendations
        ]
    }


@router.get("/readiness")
async def get_readiness_score(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Calculate multi-factor readiness score

    Returns overall readiness score and breakdown by factors:
    - Content Mastery (35%)
    - Consistency (20%)
    - Time Management (15%)
    - Accuracy (20%)
    - Difficulty Handling (10%)
    """
    readiness = analytics_service.calculate_readiness_score(
        db=db,
        user_id=str(current_user.id)
    )

    return readiness


@router.get("/insights")
async def get_insights(
    exam_type: str = Query(..., description="Exam type"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get actionable insights about performance

    Returns insights categorized by type:
    - Strengths: Areas of excellence
    - Weaknesses: Areas needing improvement
    - Patterns: Detected performance patterns
    - Opportunities: Potential improvements
    - Milestones: Achievements
    """
    analytics_data = await analytics_service.get_user_analytics(
        db=db,
        user_id=str(current_user.id),
        exam_type=exam_type
    )

    return {
        'insights': [
            {
                'id': insight.id,
                'type': insight.type.value,
                'title': insight.title,
                'description': insight.description,
                'importance': insight.importance,
                'actionable': insight.actionable,
                'recommendations': insight.recommendations,
                'timestamp': insight.timestamp.isoformat()
            }
            for insight in analytics_data.insights
        ]
    }


@router.get("/predictions")
async def get_predictions(
    exam_type: str = Query(..., description="Exam type"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get predictions about future performance

    Returns:
    - Predicted exam score with confidence interval
    - Readiness date estimate
    - Probability of reaching target score
    - Critical topics to focus on
    - Risk factors and mitigation strategies
    """
    analytics_data = await analytics_service.get_user_analytics(
        db=db,
        user_id=str(current_user.id),
        exam_type=exam_type
    )

    predictions = analytics_data.predictions

    return {
        'exam_score': {
            'expected': predictions.exam_score.expected,
            'confidence': predictions.exam_score.confidence,
            'range': predictions.exam_score.range,
            'percentile_projection': predictions.exam_score.percentile_projection
        },
        'readiness_date': predictions.readiness_date.isoformat(),
        'probability_of_target': predictions.probability_of_target,
        'critical_topics': predictions.critical_topics,
        'risk_factors': [
            {
                'type': rf.type,
                'severity': rf.severity,
                'impact': rf.impact,
                'mitigation': rf.mitigation
            }
            for rf in predictions.risk_factors
        ],
        'success_probability': predictions.success_probability
    }


@router.get("/trends")
async def get_trends(
    exam_type: str = Query(..., description="Exam type"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get performance trends with statistical analysis

    Returns trend analysis for:
    - Overall performance (using Mann-Kendall test)
    - Time management
    - Study consistency
    - Forecasts for next 5 periods
    """
    analytics_data = await analytics_service.get_user_analytics(
        db=db,
        user_id=str(current_user.id),
        exam_type=exam_type
    )

    trends = analytics_data.trends

    return {
        'overall': {
            'direction': trends.overall.direction,
            'magnitude': trends.overall.magnitude,
            'confidence': trends.overall.confidence,
            'forecast': trends.overall.forecast,
            'interpretation': _interpret_trend(trends.overall)
        },
        'time_management': {
            'direction': trends.time_management.direction,
            'magnitude': trends.time_management.magnitude,
            'confidence': trends.time_management.confidence,
            'interpretation': _interpret_trend(trends.time_management)
        },
        'consistency': {
            'direction': trends.consistency.direction,
            'magnitude': trends.consistency.magnitude,
            'confidence': trends.consistency.confidence,
            'interpretation': _interpret_trend(trends.consistency)
        }
    }


@router.get("/peer-comparison")
async def get_peer_comparison(
    exam_type: str = Query(..., description="Exam type"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Compare performance to peers

    Returns:
    - Percentile rank among peers
    - Peer group average
    - Relative strengths and weaknesses
    - Unique patterns
    """
    analytics_data = await analytics_service.get_user_analytics(
        db=db,
        user_id=str(current_user.id),
        exam_type=exam_type
    )

    comparison = analytics_data.comparisons

    return {
        'percentile_rank': comparison.percentile_rank,
        'average_score': comparison.average_score,
        'peer_group_size': comparison.peer_group_size,
        'strengths': comparison.strengths,
        'weaknesses': comparison.weaknesses,
        'unique_patterns': comparison.unique_patterns,
        'interpretation': _interpret_percentile(comparison.percentile_rank)
    }


@router.get("/recommendations")
async def get_recommendations(
    exam_type: str = Query(..., description="Exam type"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get personalized study recommendations

    Returns prioritized recommendations with:
    - Recommended actions
    - Estimated impact
    - Time required
    - Learning resources
    """
    analytics_data = await analytics_service.get_user_analytics(
        db=db,
        user_id=str(current_user.id),
        exam_type=exam_type
    )

    return {
        'recommendations': [
            {
                'id': rec.id,
                'priority': rec.priority,
                'type': rec.type,
                'title': rec.title,
                'description': rec.description,
                'estimated_impact': rec.estimated_impact,
                'time_required': rec.time_required,
                'resources': [
                    {
                        'type': r.type,
                        'title': r.title,
                        'duration': r.duration
                    }
                    for r in rec.resources
                ]
            }
            for rec in analytics_data.recommendations
        ]
    }


@router.get("/topic-mastery")
async def get_topic_mastery(
    exam_type: str = Query(..., description="Exam type"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed mastery breakdown by topic

    Returns for each topic:
    - Mastery level (0-1)
    - Number of questions answered
    - Accuracy
    - Average time
    - Trend (improving/declining/stable)
    - Confidence interval
    - Gap to target mastery
    """
    analytics_data = await analytics_service.get_user_analytics(
        db=db,
        user_id=str(current_user.id),
        exam_type=exam_type
    )

    topics = []
    for topic, tm in analytics_data.metrics.topic_mastery.items():
        topics.append({
            'topic': topic,
            'mastery': round(tm.mastery * 100, 1),
            'questions_answered': tm.questions_answered,
            'accuracy': round(tm.accuracy * 100, 1),
            'avg_time': round(tm.avg_time, 1),
            'last_practiced': tm.last_practiced.isoformat(),
            'trend': tm.trend,
            'confidence_interval': [round(ci * 100, 1) for ci in tm.confidence_interval],
            'gap_to_target': round(tm.gap_to_target * 100, 1),
            'status': _get_mastery_status(tm.mastery)
        })

    # Sort by gap to target (descending) to show what needs most work
    topics.sort(key=lambda x: x['gap_to_target'], reverse=True)

    return {'topics': topics}


# Helper functions

def _interpret_trend(trend) -> str:
    """Interpret trend for user-friendly message"""
    if trend.direction == 'up':
        if trend.confidence > 0.8:
            return 'Strong upward trend - keep up the great work!'
        else:
            return 'Slight improvement detected - continue current approach'
    elif trend.direction == 'down':
        if trend.confidence > 0.8:
            return 'Declining trend detected - consider reviewing study strategy'
        else:
            return 'Slight decline - may need more consistent practice'
    else:
        return 'Performance is stable - consider challenging yourself more'


def _interpret_percentile(percentile: float) -> str:
    """Interpret percentile rank"""
    if percentile >= 90:
        return 'Excellent - Top 10% of peers'
    elif percentile >= 75:
        return 'Very Good - Top 25% of peers'
    elif percentile >= 50:
        return 'Good - Above average performance'
    elif percentile >= 25:
        return 'Fair - Room for improvement'
    else:
        return 'Needs Work - Focus on fundamentals'


def _get_mastery_status(mastery: float) -> str:
    """Get mastery status label"""
    if mastery >= 0.9:
        return 'Mastered'
    elif mastery >= 0.7:
        return 'Proficient'
    elif mastery >= 0.5:
        return 'Developing'
    else:
        return 'Needs Practice'

"""
Analytics API endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models import User, QuestionAttempt, StudySession
from app.api.v1.endpoints.auth import get_current_user
from datetime import datetime, timedelta

router = APIRouter()

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

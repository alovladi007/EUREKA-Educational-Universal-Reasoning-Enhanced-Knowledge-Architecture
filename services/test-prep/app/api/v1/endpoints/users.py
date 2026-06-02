"""
Users API endpoints
"""
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import User
from app.models.qbank_session import QBankSession
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


def _ability_level(accuracy: float, answered: int) -> str:
    """Derive a coarse ability label from real accuracy + volume."""
    if answered < 20:
        return "Beginner"
    if accuracy >= 85:
        return "Advanced"
    if accuracy >= 70:
        return "Intermediate"
    return "Developing"


def _today_start() -> datetime:
    n = datetime.utcnow()
    return datetime(n.year, n.month, n.day)

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "education_level": current_user.education_level,
        "target_exams": current_user.target_exams,
        "is_premium": current_user.is_premium,
        "total_questions_answered": current_user.total_questions_answered,
        "overall_accuracy": current_user.overall_accuracy,
        "current_streak_days": current_user.current_streak_days
    }

@router.put("/profile")
async def update_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    # Update user fields
    for key, value in profile_data.items():
        if hasattr(current_user, key) and key not in ["id", "email", "username"]:
            setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)

    return {"message": "Profile updated successfully"}

@router.get("/me/stats")
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Real user statistics aggregated from the caller's QBank sessions
    (P3 mock→real). Was a hardcoded 125/89/71.2 fixture."""
    total_q, total_correct, total_secs = db.query(
        func.coalesce(func.sum(QBankSession.questions_answered), 0),
        func.coalesce(func.sum(QBankSession.correct_count), 0),
        func.coalesce(func.sum(QBankSession.total_time_seconds), 0),
    ).filter(QBankSession.user_id == current_user.id).one()
    total_q, total_correct, total_secs = int(total_q), int(total_correct), int(total_secs)
    accuracy = round(total_correct / total_q * 100, 1) if total_q else 0.0

    q_today, correct_today, secs_today = db.query(
        func.coalesce(func.sum(QBankSession.questions_answered), 0),
        func.coalesce(func.sum(QBankSession.correct_count), 0),
        func.coalesce(func.sum(QBankSession.total_time_seconds), 0),
    ).filter(
        QBankSession.user_id == current_user.id,
        QBankSession.started_at >= _today_start(),
    ).one()
    q_today, correct_today, secs_today = int(q_today), int(correct_today), int(secs_today)
    acc_today = round(correct_today / q_today * 100, 1) if q_today else 0.0

    return {
        "total_questions": total_q,
        "correct_answers": total_correct,
        "overall_accuracy": accuracy,
        "current_streak": int(current_user.current_streak_days or 0),
        # No points ledger table yet — derive deterministically (10/correct).
        "total_points": total_correct * 10,
        "total_study_time": total_secs // 60,  # minutes
        "ability_level": _ability_level(accuracy, total_q),
        "daily_goal_progress": secs_today // 60,  # minutes today
        "questions_today": q_today,
        "accuracy_today": acc_today,
    }

@router.get("/me/progress")
async def get_user_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Real progress: recent sessions + today's goal progress (P3
    mock→real). Was a hardcoded GRE activity list."""
    total_q, total_correct = db.query(
        func.coalesce(func.sum(QBankSession.questions_answered), 0),
        func.coalesce(func.sum(QBankSession.correct_count), 0),
    ).filter(QBankSession.user_id == current_user.id).one()
    total_q, total_correct = int(total_q), int(total_correct)
    accuracy = round(total_correct / total_q * 100, 1) if total_q else 0.0

    recent = (
        db.query(QBankSession)
        .filter(QBankSession.user_id == current_user.id)
        .order_by(QBankSession.started_at.desc())
        .limit(10)
        .all()
    )
    activities = []
    for s in recent:
        answered = int(s.questions_answered or 0)
        correct = int(s.correct_count or 0)
        acc = round(correct / answered * 100, 1) if answered else 0.0
        activities.append({
            "type": "Mock Exam" if (s.mode or "") == "timed" else "Practice Session",
            "exam": s.exam_type,
            "score": int(acc),
            "timestamp": (s.started_at.isoformat() if s.started_at else None),
            "questions": answered,
            "accuracy": acc,
        })

    q_today, secs_today = db.query(
        func.coalesce(func.sum(QBankSession.questions_answered), 0),
        func.coalesce(func.sum(QBankSession.total_time_seconds), 0),
    ).filter(
        QBankSession.user_id == current_user.id,
        QBankSession.started_at >= _today_start(),
    ).one()

    return {
        "currentLevel": _ability_level(accuracy, total_q),
        "abilityScore": round(accuracy / 100, 2),
        "activities": activities,
        "dailyGoals": {
            "minutesGoal": 30,
            "minutesCompleted": int(secs_today) // 60,
            "questionsGoal": 20,
            "questionsCompleted": int(q_today),
        },
    }

@router.get("/me/achievements")
async def get_user_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Real achievements computed from the caller's actual activity (P3
    mock→real). Was a hardcoded unlocked/locked list."""
    session_count = (
        db.query(func.count(QBankSession.id))
        .filter(QBankSession.user_id == current_user.id)
        .scalar()
    ) or 0
    total_q, total_correct = db.query(
        func.coalesce(func.sum(QBankSession.questions_answered), 0),
        func.coalesce(func.sum(QBankSession.correct_count), 0),
    ).filter(QBankSession.user_id == current_user.id).one()
    accuracy = (int(total_correct) / int(total_q) * 100) if int(total_q) else 0.0
    streak = int(current_user.current_streak_days or 0)

    defs = [
        ("first_practice", "First Practice", "Complete your first practice session",
         session_count >= 1),
        ("streak_7", "Week Warrior", "Maintain a 7-day streak",
         streak >= 7),
        ("accuracy_90", "Accuracy Master", "Achieve 90% accuracy (50+ questions)",
         accuracy >= 90 and int(total_q) >= 50),
    ]
    achievements = [
        {"id": i, "name": n, "description": d, "unlocked": bool(u)}
        for (i, n, d, u) in defs
    ]
    return {
        "achievements": achievements,
        "totalUnlocked": sum(1 for a in achievements if a["unlocked"]),
        "totalAchievements": len(achievements),
    }

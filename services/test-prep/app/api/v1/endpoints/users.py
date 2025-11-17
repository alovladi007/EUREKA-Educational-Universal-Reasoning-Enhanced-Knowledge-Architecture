"""
Users API endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import User
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

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
async def get_user_stats():
    """Get user statistics (mock data for development)"""
    return {
        "total_questions": 125,
        "correct_answers": 89,
        "overall_accuracy": 71.2,
        "current_streak": 5,
        "total_points": 1250,
        "total_study_time": 420,  # in minutes
        "ability_level": "Intermediate",
        "daily_goal_progress": 25,  # minutes completed today
        "questions_today": 15,
        "accuracy_today": 76.0
    }

@router.get("/me/progress")
async def get_user_progress():
    """Get user progress data (mock data for development)"""
    return {
        "currentLevel": "Intermediate",
        "abilityScore": 0.42,
        "activities": [
            {
                "type": "Practice Session",
                "exam": "GRE",
                "score": 75,
                "timestamp": "2025-11-11T10:30:00",
                "questions": 20,
                "accuracy": 75.0
            },
            {
                "type": "Mock Exam",
                "exam": "GRE",
                "score": 82,
                "timestamp": "2025-11-10T14:20:00",
                "questions": 40,
                "accuracy": 82.0
            },
            {
                "type": "Practice Session",
                "exam": "GRE",
                "score": 68,
                "timestamp": "2025-11-09T15:45:00",
                "questions": 15,
                "accuracy": 68.0
            }
        ],
        "dailyGoals": {
            "minutesGoal": 30,
            "minutesCompleted": 25,
            "questionsGoal": 20,
            "questionsCompleted": 15
        }
    }

@router.get("/me/achievements")
async def get_user_achievements():
    """Get user achievements (mock data for development)"""
    return {
        "achievements": [
            {"id": "first_practice", "name": "First Practice", "description": "Complete your first practice session", "unlocked": True},
            {"id": "streak_7", "name": "Week Warrior", "description": "Maintain a 7-day streak", "unlocked": False},
            {"id": "accuracy_90", "name": "Accuracy Master", "description": "Achieve 90% accuracy", "unlocked": False}
        ],
        "totalUnlocked": 1,
        "totalAchievements": 3
    }

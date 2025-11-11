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

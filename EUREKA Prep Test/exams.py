"""
Exams API endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import User, ExamResult
from app.api.v1.endpoints.auth import get_current_user
from datetime import datetime

router = APIRouter()

@router.post("/start")
async def start_exam(
    exam_config: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start a new exam session"""
    # Create exam session logic here
    return {"exam_id": "test_id", "message": "Exam started"}

@router.get("/results/{exam_id}")
async def get_exam_result(
    exam_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get exam results"""
    result = db.query(ExamResult).filter(
        ExamResult.id == exam_id,
        ExamResult.user_id == current_user.id
    ).first()
    
    if result:
        return {
            "score": result.score,
            "percentile": result.percentile,
            "total_questions": result.total_questions,
            "correct_answers": result.correct_answers
        }
    
    return {"error": "Exam result not found"}

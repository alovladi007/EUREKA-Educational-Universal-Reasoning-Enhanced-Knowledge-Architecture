"""
Grading endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.utils.database import get_db
from app.models import AssessmentAttempt, QuestionResponse
from app.schemas import AutoGradeRequest, AutoGradeResponse, AIGradeRequest, AIGradeResponse
from app.services.auto_grader import auto_grade_attempt
from app.services.ai_grader import ai_grade_response

router = APIRouter()

@router.post("/auto-grade", response_model=AutoGradeResponse)
async def auto_grade(
    request: AutoGradeRequest,
    db: AsyncSession = Depends(get_db)
):
    """Auto-grade an assessment attempt (MCQ, True/False)"""
    
    # Get attempt
    result = await db.execute(
        select(AssessmentAttempt).where(AssessmentAttempt.id == request.attempt_id)
    )
    attempt = result.scalar_one_or_none()
    
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attempt {request.attempt_id} not found"
        )
    
    # Grade the attempt
    grading_result = await auto_grade_attempt(request.attempt_id, db)
    
    return grading_result

@router.post("/ai-grade", response_model=AIGradeResponse)
async def ai_grade(
    request: AIGradeRequest,
    db: AsyncSession = Depends(get_db)
):
    """AI-grade a single essay response"""
    
    # Get response
    result = await db.execute(
        select(QuestionResponse).where(QuestionResponse.id == request.response_id)
    )
    response = result.scalar_one_or_none()
    
    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Response {request.response_id} not found"
        )
    
    # Grade with AI
    grading_result = await ai_grade_response(
        response_id=request.response_id,
        question_text=request.question_text,
        response_text=request.response_text,
        rubric=request.rubric,
        db=db
    )
    
    return grading_result

@router.get("/attempt/{attempt_id}/results")
async def get_attempt_results(
    attempt_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get detailed grading results for an attempt"""
    
    # Get attempt with responses
    result = await db.execute(
        select(AssessmentAttempt).where(AssessmentAttempt.id == attempt_id)
    )
    attempt = result.scalar_one_or_none()
    
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attempt {attempt_id} not found"
        )
    
    # Get responses
    result = await db.execute(
        select(QuestionResponse)
        .where(QuestionResponse.attempt_id == attempt_id)
        .order_by(QuestionResponse.created_at)
    )
    responses = result.scalars().all()
    
    return {
        "attempt_id": attempt.id,
        "user_id": attempt.user_id,
        "score": attempt.score,
        "max_score": attempt.max_score,
        "percentage": attempt.percentage,
        "status": attempt.status,
        "submitted_at": attempt.submitted_at,
        "responses": [
            {
                "question_id": r.question_id,
                "response_text": r.response_text,
                "is_correct": r.is_correct,
                "points_earned": r.points_earned,
                "points_possible": r.points_possible
            }
            for r in responses
        ]
    }

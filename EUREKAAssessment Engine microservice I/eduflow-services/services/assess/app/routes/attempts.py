"""
Assessment attempt endpoints (for students taking assessments)
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from uuid import UUID
from datetime import datetime

from app.utils.database import get_db
from app.models import (
    Assessment, AssessmentAttempt, QuestionResponse,
    Question, AttemptStatus, GradingStatus, GradingResult
)
from app.schemas import (
    AttemptStart, AttemptSubmit, AttemptResponse,
    AttemptListResponse, QuestionResponseResult
)

router = APIRouter()

@router.post("/start", response_model=AttemptResponse, status_code=status.HTTP_201_CREATED)
async def start_attempt(
    attempt_data: AttemptStart,
    db: AsyncSession = Depends(get_db)
):
    """Start a new assessment attempt"""
    
    # Get assessment
    result = await db.execute(
        select(Assessment).where(Assessment.id == attempt_data.assessment_id)
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment {attempt_data.assessment_id} not found"
        )
    
    if not assessment.is_published:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Assessment is not published"
        )
    
    # Check how many attempts user has made
    result = await db.execute(
        select(func.count())
        .select_from(AssessmentAttempt)
        .where(
            AssessmentAttempt.assessment_id == attempt_data.assessment_id,
            AssessmentAttempt.user_id == attempt_data.user_id
        )
    )
    attempt_count = result.scalar() or 0
    
    if attempt_count >= assessment.attempts_allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Maximum attempts ({assessment.attempts_allowed}) reached"
        )
    
    # Check if assessment is available
    now = datetime.utcnow()
    if assessment.start_date and now < assessment.start_date:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Assessment has not started yet"
        )
    
    if assessment.due_date and now > assessment.due_date and not assessment.late_submission_allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Assessment deadline has passed"
        )
    
    # Create attempt
    is_late = assessment.due_date and now > assessment.due_date
    attempt = AssessmentAttempt(
        assessment_id=attempt_data.assessment_id,
        user_id=attempt_data.user_id,
        attempt_number=attempt_count + 1,
        status=AttemptStatus.IN_PROGRESS,
        is_late=is_late,
        max_score=assessment.total_points
    )
    
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)
    
    return attempt

@router.post("/{attempt_id}/submit", response_model=AttemptResponse)
async def submit_attempt(
    attempt_id: UUID,
    submission: AttemptSubmit,
    db: AsyncSession = Depends(get_db)
):
    """Submit assessment attempt"""
    
    # Get attempt
    result = await db.execute(
        select(AssessmentAttempt).where(AssessmentAttempt.id == attempt_id)
    )
    attempt = result.scalar_one_or_none()
    
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attempt {attempt_id} not found"
        )
    
    if attempt.status != AttemptStatus.IN_PROGRESS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attempt has already been submitted"
        )
    
    # Get assessment and questions
    result = await db.execute(
        select(Assessment).where(Assessment.id == attempt.assessment_id)
    )
    assessment = result.scalar_one()
    
    result = await db.execute(
        select(Question)
        .where(Question.assessment_id == assessment.id)
        .order_by(Question.order_index)
    )
    questions = {q.id: q for q in result.scalars().all()}
    
    # Save responses
    for response_data in submission.responses:
        question = questions.get(response_data.question_id)
        if not question:
            continue
        
        response = QuestionResponse(
            attempt_id=attempt_id,
            question_id=response_data.question_id,
            response_text=response_data.response_text,
            response_data=response_data.response_data,
            points_possible=question.points
        )
        db.add(response)
    
    # Update attempt status
    attempt.status = AttemptStatus.SUBMITTED
    attempt.submitted_at = datetime.utcnow()
    attempt.time_spent_seconds = int((attempt.submitted_at - attempt.started_at).total_seconds())
    
    await db.commit()
    await db.refresh(attempt)
    
    # Trigger auto-grading in background (for now, we'll do it synchronously)
    # In production, you'd use Celery or similar
    from app.services.auto_grader import auto_grade_attempt
    await auto_grade_attempt(attempt_id, db)
    
    await db.refresh(attempt)
    
    # Load responses
    result = await db.execute(
        select(QuestionResponse).where(QuestionResponse.attempt_id == attempt_id)
    )
    attempt.responses = result.scalars().all()
    
    return attempt

@router.get("/{attempt_id}", response_model=AttemptResponse)
async def get_attempt(
    attempt_id: UUID,
    include_responses: bool = Query(True),
    db: AsyncSession = Depends(get_db)
):
    """Get attempt by ID"""
    
    result = await db.execute(
        select(AssessmentAttempt).where(AssessmentAttempt.id == attempt_id)
    )
    attempt = result.scalar_one_or_none()
    
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attempt {attempt_id} not found"
        )
    
    if include_responses:
        result = await db.execute(
            select(QuestionResponse).where(QuestionResponse.attempt_id == attempt_id)
        )
        attempt.responses = result.scalars().all()
    
    return attempt

@router.get("/", response_model=AttemptListResponse)
async def list_attempts(
    assessment_id: Optional[UUID] = Query(None),
    user_id: Optional[UUID] = Query(None),
    status: Optional[AttemptStatus] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """List attempts with filters"""
    
    query = select(AssessmentAttempt)
    
    if assessment_id:
        query = query.where(AssessmentAttempt.assessment_id == assessment_id)
    if user_id:
        query = query.where(AssessmentAttempt.user_id == user_id)
    if status:
        query = query.where(AssessmentAttempt.status == status)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)
    
    # Paginate
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    attempts = result.scalars().all()
    
    return {
        "items": attempts,
        "total": total or 0,
        "page": page,
        "page_size": page_size,
        "total_pages": ((total or 0) + page_size - 1) // page_size
    }

@router.delete("/{attempt_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_attempt(
    attempt_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete attempt (admin only)"""
    
    result = await db.execute(
        select(AssessmentAttempt).where(AssessmentAttempt.id == attempt_id)
    )
    attempt = result.scalar_one_or_none()
    
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attempt {attempt_id} not found"
        )
    
    await db.delete(attempt)
    await db.commit()

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

from app.core.auth_guard import CurrentUser, is_staff, require_user

router = APIRouter()


def _assert_attempt_access(user: CurrentUser, attempt, *, owner_only: bool = False) -> None:
    """P2-8 tenant/ownership gate: the owner always passes; staff pass only for
    attempts in their own org (attempts carry org_id from the creator's token).
    owner_only routes (submit) never accept staff acting for a learner."""
    if str(attempt.user_id) == str(user.get("user_id")):
        return
    if (not owner_only and is_staff(user) and user.get("org_id")
            and attempt.org_id is not None
            and str(attempt.org_id) == str(user.get("org_id"))):
        return
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                        detail="Not authorized for this attempt")

@router.post("/start", response_model=AttemptResponse, status_code=status.HTTP_201_CREATED)
async def start_attempt(
    attempt_data: AttemptStart,
    db: AsyncSession = Depends(get_db),
    user: CurrentUser = Depends(require_user),
):
    """Start a new assessment attempt (P2-8: identity comes from the token —
    a body-supplied user_id is ignored, so attempts cannot be started as
    someone else)."""
    attempt_data.user_id = UUID(str(user["user_id"]))
    
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
    
    if assessment.max_attempts is not None and attempt_count >= assessment.max_attempts:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Maximum attempts ({assessment.max_attempts}) reached"
        )
    
    # Check if assessment is available (the model has no late-submission
    # concept: available_until is a hard cutoff)
    now = datetime.utcnow()
    if assessment.available_from and now < assessment.available_from:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Assessment has not started yet"
        )
    
    if assessment.available_until and now > assessment.available_until:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Assessment deadline has passed"
        )
    
    # Create attempt
    attempt = AssessmentAttempt(
        assessment_id=attempt_data.assessment_id,
        user_id=attempt_data.user_id,
        attempt_number=attempt_count + 1,
        status=AttemptStatus.IN_PROGRESS,
        is_late=False,
        max_score=assessment.total_points,
        org_id=UUID(str(user["org_id"])) if user.get("org_id") else None,
    )
    
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)
    
    return attempt

@router.post("/{attempt_id}/submit", response_model=AttemptResponse)
async def submit_attempt(
    attempt_id: UUID,
    submission: AttemptSubmit,
    db: AsyncSession = Depends(get_db),
    user: CurrentUser = Depends(require_user),
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
    
    _assert_attempt_access(user, attempt, owner_only=True)

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
    db: AsyncSession = Depends(get_db),
    user: CurrentUser = Depends(require_user),
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
    
    _assert_attempt_access(user, attempt)

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
    db: AsyncSession = Depends(get_db),
    user: CurrentUser = Depends(require_user),
):
    """List attempts. Learners see only their own; staff see their org's
    (P2-8: rows carry org_id, and a staff caller without an org claim gets
    self-only rather than everything)."""

    query = select(AssessmentAttempt)

    if is_staff(user) and user.get("org_id"):
        query = query.where(AssessmentAttempt.org_id == UUID(str(user["org_id"])))
        if user_id:
            query = query.where(AssessmentAttempt.user_id == user_id)
    else:
        query = query.where(AssessmentAttempt.user_id == UUID(str(user["user_id"])))

    if assessment_id:
        query = query.where(AssessmentAttempt.assessment_id == assessment_id)
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
    db: AsyncSession = Depends(get_db),
    user: CurrentUser = Depends(require_user),
):
    """Delete attempt (staff of the attempt's org only)."""
    if not is_staff(user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Staff role required")
    
    result = await db.execute(
        select(AssessmentAttempt).where(AssessmentAttempt.id == attempt_id)
    )
    attempt = result.scalar_one_or_none()
    
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attempt {attempt_id} not found"
        )
    
    _assert_attempt_access(user, attempt)
    await db.delete(attempt)
    await db.commit()

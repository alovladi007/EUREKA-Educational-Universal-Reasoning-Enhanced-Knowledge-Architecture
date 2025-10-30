"""
Assessment CRUD endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from uuid import UUID

from app.utils.database import get_db
from app.models import Assessment, Question
from app.schemas import (
    AssessmentCreate, AssessmentUpdate, AssessmentResponse,
    AssessmentListResponse, QuestionCreate, QuestionResponse
)

router = APIRouter()

@router.post("/", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(
    assessment_data: AssessmentCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new assessment"""
    
    # Create assessment
    assessment = Assessment(
        course_id=assessment_data.course_id,
        title=assessment_data.title,
        description=assessment_data.description,
        assessment_type=assessment_data.assessment_type,
        total_points=assessment_data.total_points,
        passing_score=assessment_data.passing_score,
        time_limit_minutes=assessment_data.time_limit_minutes,
        attempts_allowed=assessment_data.attempts_allowed,
        start_date=assessment_data.start_date,
        due_date=assessment_data.due_date,
        late_submission_allowed=assessment_data.late_submission_allowed,
        late_penalty_percent=assessment_data.late_penalty_percent,
        shuffle_questions=assessment_data.shuffle_questions,
        show_correct_answers=assessment_data.show_correct_answers,
        show_feedback=assessment_data.show_feedback
    )
    
    db.add(assessment)
    await db.flush()  # Get assessment.id
    
    # Add questions if provided
    if assessment_data.questions:
        for idx, q_data in enumerate(assessment_data.questions):
            question = Question(
                assessment_id=assessment.id,
                question_type=q_data.question_type,
                question_text=q_data.question_text,
                points=q_data.points,
                order_index=q_data.order_index or idx,
                options=[opt.dict() for opt in q_data.options] if q_data.options else None,
                correct_answer=q_data.correct_answer,
                explanation=q_data.explanation,
                rubric=q_data.rubric,
                code_template=q_data.code_template,
                test_cases=q_data.test_cases
            )
            db.add(question)
    
    await db.commit()
    await db.refresh(assessment)
    
    # Load questions
    result = await db.execute(
        select(Question).where(Question.assessment_id == assessment.id).order_by(Question.order_index)
    )
    assessment.questions = result.scalars().all()
    
    return assessment

@router.get("/", response_model=AssessmentListResponse)
async def list_assessments(
    course_id: Optional[UUID] = Query(None),
    assessment_type: Optional[str] = Query(None),
    is_published: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """List assessments with filters"""
    
    # Build query
    query = select(Assessment)
    
    if course_id:
        query = query.where(Assessment.course_id == course_id)
    if assessment_type:
        query = query.where(Assessment.assessment_type == assessment_type)
    if is_published is not None:
        query = query.where(Assessment.is_published == is_published)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)
    
    # Paginate
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    assessments = result.scalars().all()
    
    return {
        "items": assessments,
        "total": total or 0,
        "page": page,
        "page_size": page_size,
        "total_pages": ((total or 0) + page_size - 1) // page_size
    }

@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: UUID,
    include_questions: bool = Query(True),
    db: AsyncSession = Depends(get_db)
):
    """Get assessment by ID"""
    
    result = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment {assessment_id} not found"
        )
    
    # Load questions if requested
    if include_questions:
        result = await db.execute(
            select(Question)
            .where(Question.assessment_id == assessment_id)
            .order_by(Question.order_index)
        )
        assessment.questions = result.scalars().all()
    
    return assessment

@router.patch("/{assessment_id}", response_model=AssessmentResponse)
async def update_assessment(
    assessment_id: UUID,
    assessment_data: AssessmentUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update assessment"""
    
    result = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment {assessment_id} not found"
        )
    
    # Update fields
    update_data = assessment_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(assessment, field, value)
    
    await db.commit()
    await db.refresh(assessment)
    
    return assessment

@router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete assessment"""
    
    result = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment {assessment_id} not found"
        )
    
    await db.delete(assessment)
    await db.commit()

@router.post("/{assessment_id}/publish", response_model=AssessmentResponse)
async def publish_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Publish assessment (make it available to students)"""
    
    result = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment {assessment_id} not found"
        )
    
    assessment.is_published = True
    await db.commit()
    await db.refresh(assessment)
    
    return assessment

@router.post("/{assessment_id}/unpublish", response_model=AssessmentResponse)
async def unpublish_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Unpublish assessment (hide from students)"""
    
    result = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment {assessment_id} not found"
        )
    
    assessment.is_published = False
    await db.commit()
    await db.refresh(assessment)
    
    return assessment

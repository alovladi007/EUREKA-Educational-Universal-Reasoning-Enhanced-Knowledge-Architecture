"""
Question management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.utils.database import get_db
from app.models import Question
from app.schemas import QuestionCreate, QuestionUpdate, QuestionResponse

router = APIRouter()

@router.post("/", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
async def create_question(
    question_data: QuestionCreate,
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Add a question to an assessment"""
    
    question = Question(
        assessment_id=assessment_id,
        question_type=question_data.question_type,
        question_text=question_data.question_text,
        points=question_data.points,
        order_index=question_data.order_index,
        options=[opt.dict() for opt in question_data.options] if question_data.options else None,
        correct_answer=question_data.correct_answer,
        explanation=question_data.explanation,
        rubric=question_data.rubric,
        code_template=question_data.code_template,
        test_cases=question_data.test_cases
    )
    
    db.add(question)
    await db.commit()
    await db.refresh(question)
    
    return question

@router.get("/{question_id}", response_model=QuestionResponse)
async def get_question(
    question_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get question by ID"""
    
    result = await db.execute(
        select(Question).where(Question.id == question_id)
    )
    question = result.scalar_one_or_none()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question {question_id} not found"
        )
    
    return question

@router.patch("/{question_id}", response_model=QuestionResponse)
async def update_question(
    question_id: UUID,
    question_data: QuestionUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update question"""
    
    result = await db.execute(
        select(Question).where(Question.id == question_id)
    )
    question = result.scalar_one_or_none()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question {question_id} not found"
        )
    
    # Update fields
    update_data = question_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "options" and value:
            value = [opt.dict() if hasattr(opt, 'dict') else opt for opt in value]
        setattr(question, field, value)
    
    await db.commit()
    await db.refresh(question)
    
    return question

@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_question(
    question_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete question"""
    
    result = await db.execute(
        select(Question).where(Question.id == question_id)
    )
    question = result.scalar_one_or_none()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question {question_id} not found"
        )
    
    await db.delete(question)
    await db.commit()

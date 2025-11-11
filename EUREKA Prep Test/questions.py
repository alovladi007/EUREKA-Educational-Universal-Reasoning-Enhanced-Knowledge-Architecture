"""
Questions API endpoints for CRUD operations and question bank management
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from pydantic import BaseModel
from datetime import datetime

from app.core.database import get_db
from app.models import Question, User
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


class QuestionCreate(BaseModel):
    question_text: str
    question_type: str
    options: Optional[dict] = None
    correct_answer: dict
    explanation: str
    hint: Optional[str] = None
    exam_type: str
    subject: str
    topic: str
    subtopic: Optional[str] = None
    difficulty_label: str = "Medium"
    estimated_time_seconds: int = 60
    tags: List[str] = []


class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    explanation: Optional[str] = None
    hint: Optional[str] = None
    difficulty_label: Optional[str] = None
    tags: Optional[List[str]] = None


class QuestionFilter(BaseModel):
    exam_type: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    difficulty_label: Optional[str] = None
    tags: Optional[List[str]] = None


@router.get("/")
async def get_questions(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    exam_type: Optional[str] = None,
    subject: Optional[str] = None,
    topic: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get paginated list of questions with optional filters
    """
    query = db.query(Question).filter(Question.flagged == False)
    
    # Apply filters
    if exam_type:
        query = query.filter(Question.exam_type == exam_type)
    if subject:
        query = query.filter(Question.subject == subject)
    if topic:
        query = query.filter(Question.topic == topic)
    if difficulty:
        query = query.filter(Question.difficulty_label == difficulty)
    if search:
        query = query.filter(
            or_(
                Question.question_text.ilike(f"%{search}%"),
                Question.topic.ilike(f"%{search}%"),
                Question.subtopic.ilike(f"%{search}%")
            )
        )
    
    # Get total count
    total = query.count()
    
    # Paginate
    offset = (page - 1) * per_page
    questions = query.offset(offset).limit(per_page).all()
    
    # Format response
    return {
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
        "questions": [
            {
                "id": q.id,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "exam_type": q.exam_type,
                "subject": q.subject,
                "topic": q.topic,
                "difficulty_label": q.difficulty_label,
                "success_rate": q.success_rate,
                "exposure_count": q.exposure_count,
                "created_at": q.created_at
            }
            for q in questions
        ]
    }


@router.get("/{question_id}")
async def get_question(
    question_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific question by ID
    """
    question = db.query(Question).filter(Question.id == question_id).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    return {
        "id": question.id,
        "question_text": question.question_text,
        "question_type": question.question_type,
        "options": question.options,
        "correct_answer": question.correct_answer,
        "explanation": question.explanation,
        "hint": question.hint,
        "exam_type": question.exam_type,
        "subject": question.subject,
        "topic": question.topic,
        "subtopic": question.subtopic,
        "difficulty": question.difficulty,
        "difficulty_label": question.difficulty_label,
        "tags": question.tags,
        "success_rate": question.success_rate,
        "avg_time_seconds": question.avg_time_seconds,
        "exposure_count": question.exposure_count
    }


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_question(
    question_data: QuestionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new question (requires admin or premium user)
    """
    if not (current_user.is_admin or current_user.is_premium):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or premium users can create questions"
        )
    
    # Map difficulty label to numeric difficulty
    difficulty_map = {
        "Easy": -1.0,
        "Medium": 0.0,
        "Hard": 1.0,
        "Expert": 2.0
    }
    
    question = Question(
        question_text=question_data.question_text,
        question_type=question_data.question_type,
        options=question_data.options,
        correct_answer=question_data.correct_answer,
        explanation=question_data.explanation,
        hint=question_data.hint,
        exam_type=question_data.exam_type,
        subject=question_data.subject,
        topic=question_data.topic,
        subtopic=question_data.subtopic,
        difficulty=difficulty_map.get(question_data.difficulty_label, 0.0),
        difficulty_label=question_data.difficulty_label,
        estimated_time_seconds=question_data.estimated_time_seconds,
        tags=question_data.tags,
        author_id=current_user.id,
        is_official=current_user.is_admin,
        created_at=datetime.utcnow()
    )
    
    db.add(question)
    db.commit()
    db.refresh(question)
    
    return {
        "message": "Question created successfully",
        "question_id": question.id
    }


@router.put("/{question_id}")
async def update_question(
    question_id: str,
    question_update: QuestionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a question (author or admin only)
    """
    question = db.query(Question).filter(Question.id == question_id).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Check permissions
    if not (current_user.is_admin or question.author_id == current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this question"
        )
    
    # Update fields
    update_data = question_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(question, field, value)
    
    question.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Question updated successfully"}


@router.delete("/{question_id}")
async def delete_question(
    question_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a question (admin only)
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete questions"
        )
    
    question = db.query(Question).filter(Question.id == question_id).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    db.delete(question)
    db.commit()
    
    return {"message": "Question deleted successfully"}


@router.post("/{question_id}/flag")
async def flag_question(
    question_id: str,
    reason: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Flag a question for review
    """
    question = db.query(Question).filter(Question.id == question_id).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    question.flagged = True
    question.flag_count += 1
    db.commit()
    
    return {"message": "Question flagged for review"}


@router.get("/stats/overview")
async def get_question_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get question bank statistics
    """
    total_questions = db.query(func.count(Question.id)).scalar()
    
    stats_by_exam = db.query(
        Question.exam_type,
        func.count(Question.id).label("count"),
        func.avg(Question.success_rate).label("avg_success_rate")
    ).group_by(Question.exam_type).all()
    
    stats_by_difficulty = db.query(
        Question.difficulty_label,
        func.count(Question.id).label("count")
    ).group_by(Question.difficulty_label).all()
    
    return {
        "total_questions": total_questions,
        "by_exam_type": [
            {
                "exam_type": stat.exam_type,
                "count": stat.count,
                "avg_success_rate": float(stat.avg_success_rate) if stat.avg_success_rate else 0
            }
            for stat in stats_by_exam
        ],
        "by_difficulty": [
            {
                "difficulty": stat.difficulty_label,
                "count": stat.count
            }
            for stat in stats_by_difficulty
        ]
    }


@router.get("/topics/{exam_type}")
async def get_topics_by_exam(
    exam_type: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get available topics for a specific exam type
    """
    topics = db.query(
        Question.subject,
        Question.topic,
        func.count(Question.id).label("question_count")
    ).filter(
        Question.exam_type == exam_type
    ).group_by(
        Question.subject,
        Question.topic
    ).all()
    
    # Organize by subject
    subjects = {}
    for topic in topics:
        if topic.subject not in subjects:
            subjects[topic.subject] = []
        subjects[topic.subject].append({
            "topic": topic.topic,
            "question_count": topic.question_count
        })
    
    return {
        "exam_type": exam_type,
        "subjects": subjects
    }

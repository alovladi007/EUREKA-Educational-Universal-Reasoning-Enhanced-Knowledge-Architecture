"""
Assessment Engine Service - API Endpoints

Provides automated grading, assessment management, and performance analytics.
"""
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func

from app.core.database import get_db
from app.core.models import (
    Assessment, Question, Rubric, Submission, Answer,
    RubricScore, AssessmentAnalytics, SubmissionStatus
)
from app.schemas import (
    # Assessment
    AssessmentCreate, AssessmentUpdate, AssessmentResponse,
    # Question
    QuestionCreate, QuestionUpdate, QuestionResponse,
    # Rubric
    RubricCreate, RubricResponse,
    # Submission
    SubmissionCreate, SubmissionResponse, SubmitAnswersRequest,
    # Answer
    AnswerCreate, AnswerResponse,
    # Grading
    GradeRequest, GradeResponse,
    # Analytics
    AssessmentAnalyticsResponse
)
from app.services.grading_service import GradingService

router = APIRouter()
grading_service = GradingService()


# ============= Assessments =============

@router.post("/assessments", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(
    assessment: AssessmentCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new assessment (quiz, exam, assignment)"""
    db_assessment = Assessment(**assessment.dict())
    db.add(db_assessment)
    await db.commit()
    await db.refresh(db_assessment)
    return db_assessment


@router.get("/assessments/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: UUID,
    include_questions: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """Get an assessment"""
    result = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    if include_questions:
        questions_result = await db.execute(
            select(Question)
            .where(Question.assessment_id == assessment_id)
            .order_by(Question.created_at)
        )
        assessment.questions = questions_result.scalars().all()
    
    return assessment


@router.get("/assessments/course/{course_id}", response_model=List[AssessmentResponse])
async def list_course_assessments(
    course_id: UUID,
    assessment_type: Optional[str] = None,
    published_only: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """List all assessments for a course"""
    query = select(Assessment).where(Assessment.course_id == course_id)
    
    if assessment_type:
        query = query.where(Assessment.assessment_type == assessment_type)
    
    if published_only:
        query = query.where(Assessment.is_published == True)
    
    result = await db.execute(query.order_by(Assessment.created_at.desc()))
    return result.scalars().all()


@router.patch("/assessments/{assessment_id}", response_model=AssessmentResponse)
async def update_assessment(
    assessment_id: UUID,
    assessment_update: AssessmentUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update an assessment"""
    result = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    update_data = assessment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(assessment, field, value)
    
    await db.commit()
    await db.refresh(assessment)
    return assessment


@router.delete("/assessments/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete an assessment (soft delete)"""
    result = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    await db.delete(assessment)
    await db.commit()


# ============= Questions =============

@router.post("/questions", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
async def create_question(
    question: QuestionCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new question"""
    # Verify assessment exists
    result = await db.execute(
        select(Assessment).where(Assessment.id == question.assessment_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    db_question = Question(**question.dict())
    db.add(db_question)
    await db.commit()
    await db.refresh(db_question)
    return db_question


@router.get("/questions/{question_id}", response_model=QuestionResponse)
async def get_question(
    question_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific question"""
    result = await db.execute(
        select(Question).where(Question.id == question_id)
    )
    question = result.scalar_one_or_none()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return question


@router.get("/assessments/{assessment_id}/questions", response_model=List[QuestionResponse])
async def list_assessment_questions(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """List all questions for an assessment"""
    result = await db.execute(
        select(Question)
        .where(Question.assessment_id == assessment_id)
        .order_by(Question.created_at)
    )
    return result.scalars().all()


@router.patch("/questions/{question_id}", response_model=QuestionResponse)
async def update_question(
    question_id: UUID,
    question_update: QuestionUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a question"""
    result = await db.execute(
        select(Question).where(Question.id == question_id)
    )
    question = result.scalar_one_or_none()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    update_data = question_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(question, field, value)
    
    await db.commit()
    await db.refresh(question)
    return question


# ============= Rubrics =============

@router.post("/rubrics", response_model=RubricResponse, status_code=status.HTTP_201_CREATED)
async def create_rubric(
    rubric: RubricCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a grading rubric"""
    # Verify question exists
    result = await db.execute(
        select(Question).where(Question.id == rubric.question_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Question not found")
    
    db_rubric = Rubric(**rubric.dict())
    db.add(db_rubric)
    await db.commit()
    await db.refresh(db_rubric)
    return db_rubric


@router.get("/rubrics/{rubric_id}", response_model=RubricResponse)
async def get_rubric(
    rubric_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a rubric"""
    result = await db.execute(
        select(Rubric).where(Rubric.id == rubric_id)
    )
    rubric = result.scalar_one_or_none()
    
    if not rubric:
        raise HTTPException(status_code=404, detail="Rubric not found")
    
    return rubric


@router.get("/questions/{question_id}/rubrics", response_model=List[RubricResponse])
async def list_question_rubrics(
    question_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """List all rubrics for a question"""
    result = await db.execute(
        select(Rubric).where(Rubric.question_id == question_id)
    )
    return result.scalars().all()


# ============= Submissions =============

@router.post("/submissions", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def start_submission(
    submission: SubmissionCreate,
    db: AsyncSession = Depends(get_db)
):
    """Start a new assessment submission"""
    # Verify assessment exists
    result = await db.execute(
        select(Assessment).where(Assessment.id == submission.assessment_id)
    )
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Check attempt limit
    attempts_result = await db.execute(
        select(func.count(Submission.id))
        .where(
            and_(
                Submission.assessment_id == submission.assessment_id,
                Submission.user_id == submission.user_id
            )
        )
    )
    attempts = attempts_result.scalar()
    
    if assessment.max_attempts and attempts >= assessment.max_attempts:
        raise HTTPException(
            status_code=400, 
            detail=f"Maximum attempts ({assessment.max_attempts}) reached"
        )
    
    db_submission = Submission(
        **submission.dict(),
        attempt_number=attempts + 1,
        status=SubmissionStatus.IN_PROGRESS
    )
    db.add(db_submission)
    await db.commit()
    await db.refresh(db_submission)
    return db_submission


@router.post("/submissions/submit", response_model=SubmissionResponse)
async def submit_answers(
    request: SubmitAnswersRequest,
    db: AsyncSession = Depends(get_db)
):
    """Submit answers for grading"""
    from datetime import datetime
    
    # Get submission
    result = await db.execute(
        select(Submission).where(Submission.id == request.submission_id)
    )
    submission = result.scalar_one_or_none()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    if submission.status != SubmissionStatus.IN_PROGRESS:
        raise HTTPException(status_code=400, detail="Submission already submitted")
    
    # Create answer records
    for answer_data in request.answers:
        db_answer = Answer(**answer_data.dict(), submission_id=submission.id)
        db.add(db_answer)
    
    submission.status = SubmissionStatus.SUBMITTED
    submission.submitted_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(submission)
    
    return submission


@router.get("/submissions/{submission_id}", response_model=SubmissionResponse)
async def get_submission(
    submission_id: UUID,
    include_answers: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """Get a submission"""
    result = await db.execute(
        select(Submission).where(Submission.id == submission_id)
    )
    submission = result.scalar_one_or_none()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    if include_answers:
        answers_result = await db.execute(
            select(Answer)
            .where(Answer.submission_id == submission_id)
            .order_by(Answer.created_at)
        )
        submission.answers = answers_result.scalars().all()
    
    return submission


@router.get("/users/{user_id}/submissions", response_model=List[SubmissionResponse])
async def list_user_submissions(
    user_id: UUID,
    assessment_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all submissions for a user"""
    query = select(Submission).where(Submission.user_id == user_id)
    
    if assessment_id:
        query = query.where(Submission.assessment_id == assessment_id)
    
    result = await db.execute(query.order_by(Submission.submitted_at.desc()))
    return result.scalars().all()


# ============= Grading =============

@router.post("/grade", response_model=GradeResponse)
async def grade_submission(
    request: GradeRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Grade a submission.
    Uses multi-strategy grading: auto-grade for MC/TF, AI for essays/code.
    """
    # Get submission
    result = await db.execute(
        select(Submission).where(Submission.id == request.submission_id)
    )
    submission = result.scalar_one_or_none()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    if submission.status == SubmissionStatus.GRADED:
        raise HTTPException(status_code=400, detail="Submission already graded")
    
    # Grade the submission
    grade_result = await grading_service.grade_submission(
        db=db,
        submission_id=submission.id,
        use_ai=request.use_ai,
        generate_feedback=request.generate_feedback
    )
    
    return grade_result


@router.get("/submissions/{submission_id}/grade", response_model=GradeResponse)
async def get_submission_grade(
    submission_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get the grade for a submission"""
    result = await db.execute(
        select(Submission).where(Submission.id == submission_id)
    )
    submission = result.scalar_one_or_none()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    if submission.status != SubmissionStatus.GRADED:
        raise HTTPException(status_code=400, detail="Submission not graded yet")
    
    # Get answers with feedback
    answers_result = await db.execute(
        select(Answer).where(Answer.submission_id == submission_id)
    )
    answers = answers_result.scalars().all()
    
    return GradeResponse(
        submission_id=submission.id,
        total_score=submission.total_score,
        max_score=0,  # Would need to calculate from assessment
        percentage=submission.percentage,
        grade=submission.grade,
        overall_feedback="",  # Could aggregate from answers
        answers_graded=len(answers),
        ai_graded=sum(1 for a in answers if a.graded_by_ai),
        auto_graded=sum(1 for a in answers if not a.graded_by_ai)
    )


# ============= Analytics =============

@router.get("/analytics/{assessment_id}", response_model=AssessmentAnalyticsResponse)
async def get_assessment_analytics(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get analytics for an assessment"""
    result = await db.execute(
        select(AssessmentAnalytics).where(
            AssessmentAnalytics.assessment_id == assessment_id
        )
    )
    analytics = result.scalar_one_or_none()
    
    if not analytics:
        # Calculate analytics if not exists
        analytics = await grading_service.calculate_assessment_analytics(
            db=db,
            assessment_id=assessment_id
        )
    
    return analytics


@router.post("/analytics/{assessment_id}/calculate", response_model=AssessmentAnalyticsResponse)
async def calculate_assessment_analytics(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Recalculate analytics for an assessment"""
    analytics = await grading_service.calculate_assessment_analytics(
        db=db,
        assessment_id=assessment_id
    )
    return analytics

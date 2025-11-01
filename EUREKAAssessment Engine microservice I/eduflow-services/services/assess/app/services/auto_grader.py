"""
Auto-grading service for MCQ and True/False questions
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from datetime import datetime

from app.models import (
    AssessmentAttempt, QuestionResponse, Question,
    GradingResult, GradingStatus, AttemptStatus, QuestionType
)
from app.schemas import AutoGradeResponse

async def auto_grade_attempt(attempt_id: UUID, db: AsyncSession) -> AutoGradeResponse:
    """
    Auto-grade an assessment attempt
    
    Grades:
    - Multiple choice questions
    - True/False questions
    
    Returns grading results
    """
    
    # Get attempt
    result = await db.execute(
        select(AssessmentAttempt).where(AssessmentAttempt.id == attempt_id)
    )
    attempt = result.scalar_one()
    
    # Get responses
    result = await db.execute(
        select(QuestionResponse).where(QuestionResponse.attempt_id == attempt_id)
    )
    responses = result.scalars().all()
    
    # Get questions
    question_ids = [r.question_id for r in responses]
    result = await db.execute(
        select(Question).where(Question.id.in_(question_ids))
    )
    questions = {q.id: q for q in result.scalars().all()}
    
    # Grade each response
    total_score = 0.0
    max_score = 0.0
    graded_count = 0
    
    for response in responses:
        question = questions.get(response.question_id)
        if not question:
            continue
        
        max_score += question.points
        response.points_possible = question.points
        
        # Auto-grade MCQ and T/F
        if question.question_type in [QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE]:
            is_correct = (
                response.response_text and
                question.correct_answer and
                response.response_text.strip().lower() == question.correct_answer.strip().lower()
            )
            
            response.is_correct = is_correct
            response.points_earned = question.points if is_correct else 0.0
            total_score += response.points_earned
            graded_count += 1
            
        else:
            # Other types need manual or AI grading
            response.is_correct = None
            response.points_earned = None
    
    # Calculate percentage
    percentage = (total_score / max_score * 100) if max_score > 0 else 0
    
    # Update attempt
    attempt.score = total_score
    attempt.max_score = max_score
    attempt.percentage = percentage
    attempt.status = AttemptStatus.GRADED if graded_count == len(responses) else AttemptStatus.SUBMITTED
    
    # Create or update grading result
    result = await db.execute(
        select(GradingResult).where(GradingResult.attempt_id == attempt_id)
    )
    grading_result = result.scalar_one_or_none()
    
    if not grading_result:
        grading_result = GradingResult(
            attempt_id=attempt_id,
            grading_status=GradingStatus.AUTO_GRADED,
            auto_graded_score=total_score,
            final_score=total_score,
            graded_at=datetime.utcnow()
        )
        db.add(grading_result)
    else:
        grading_result.auto_graded_score = total_score
        grading_result.final_score = total_score
        grading_result.grading_status = GradingStatus.AUTO_GRADED
        grading_result.graded_at = datetime.utcnow()
    
    await db.commit()
    
    return AutoGradeResponse(
        attempt_id=attempt_id,
        total_score=total_score,
        max_score=max_score,
        percentage=percentage,
        graded_questions=graded_count,
        total_questions=len(responses),
        grading_status=GradingStatus.AUTO_GRADED
    )

def check_answer(user_answer: str, correct_answer: str, question_type: QuestionType) -> bool:
    """
    Check if a user's answer is correct
    
    Args:
        user_answer: The user's submitted answer
        correct_answer: The correct answer
        question_type: Type of question
        
    Returns:
        True if correct, False otherwise
    """
    if not user_answer or not correct_answer:
        return False
    
    # Normalize answers
    user_ans = user_answer.strip().lower()
    correct_ans = correct_answer.strip().lower()
    
    if question_type == QuestionType.MULTIPLE_CHOICE:
        # Exact match for MCQ (option ID)
        return user_ans == correct_ans
    
    elif question_type == QuestionType.TRUE_FALSE:
        # Handle various true/false formats
        true_values = ["true", "t", "yes", "y", "1"]
        false_values = ["false", "f", "no", "n", "0"]
        
        user_bool = user_ans in true_values
        correct_bool = correct_ans in true_values
        
        return user_bool == correct_bool
    
    else:
        # For other types, exact match
        return user_ans == correct_ans

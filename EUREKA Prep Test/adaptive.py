"""
Adaptive Learning API endpoints
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from app.core.database import get_db
from app.core.redis_client import redis_client
from app.models import User, Question, QuestionAttempt, StudySession
from app.api.v1.endpoints.auth import get_current_user
from app.ml.adaptive_engine import adaptive_engine

router = APIRouter()


# Pydantic models
class QuestionResponse(BaseModel):
    question_id: str
    user_answer: dict
    time_spent_seconds: int
    confidence_level: Optional[int] = None
    hint_used: bool = False


class NextQuestionRequest(BaseModel):
    exam_type: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    session_id: Optional[str] = None


class AbilityReport(BaseModel):
    overall_ability: float
    confidence_interval: float
    topic_abilities: dict
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[dict]
    total_attempts: int
    overall_accuracy: float


@router.post("/next-question")
async def get_next_question(
    request: NextQuestionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the next adaptive question based on user's current ability
    """
    # Get user's recent attempts for ability estimation
    recent_attempts = db.query(QuestionAttempt).filter(
        QuestionAttempt.user_id == current_user.id
    ).order_by(QuestionAttempt.timestamp.desc()).limit(50).all()
    
    # Prepare response pattern for ability estimation
    response_pattern = []
    attempted_questions = []
    
    for attempt in recent_attempts:
        question = db.query(Question).filter(Question.id == attempt.question_id).first()
        if question:
            response_pattern.append({
                'difficulty': question.difficulty,
                'discrimination': question.discrimination,
                'guessing': question.guessing,
                'correct': attempt.is_correct
            })
            attempted_questions.append(question.id)
    
    # Estimate current ability
    if response_pattern:
        user_ability, _ = adaptive_engine.estimate_ability_eap(response_pattern)
    else:
        user_ability = 0.0  # Default ability for new users
    
    # Build query for available questions
    query = db.query(Question).filter(Question.flagged == False)
    
    if request.exam_type:
        query = query.filter(Question.exam_type == request.exam_type)
    if request.subject:
        query = query.filter(Question.subject == request.subject)
    if request.topic:
        query = query.filter(Question.topic == request.topic)
    
    available_questions = query.all()
    
    if not available_questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No questions available with the specified criteria"
        )
    
    # Prepare questions for adaptive selection
    questions_data = [
        {
            'id': q.id,
            'difficulty': q.difficulty,
            'discrimination': q.discrimination,
            'guessing': q.guessing,
            'topic': q.topic,
            'exposure_count': q.exposure_count
        }
        for q in available_questions
    ]
    
    # Select next question using adaptive algorithm
    next_question_data = adaptive_engine.select_next_question(
        user_ability, 
        questions_data,
        attempted_questions
    )
    
    if not next_question_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not select an appropriate question"
        )
    
    # Get full question details
    next_question = db.query(Question).filter(Question.id == next_question_data['id']).first()
    
    # Calculate probability of correct answer
    probability = adaptive_engine.calculate_irt_probability(
        user_ability,
        next_question.difficulty,
        next_question.discrimination,
        next_question.guessing
    )
    
    # Update exposure count
    next_question.exposure_count += 1
    db.commit()
    
    # Cache user ability estimate
    await redis_client.set_json(
        f"user_ability:{current_user.id}",
        {"ability": user_ability, "timestamp": datetime.utcnow().isoformat()},
        expire=3600
    )
    
    return {
        "question": {
            "id": next_question.id,
            "question_text": next_question.question_text,
            "question_type": next_question.question_type,
            "options": next_question.options,
            "hint": next_question.hint if request.session_id else None,  # Show hint only in sessions
            "image_url": next_question.image_url,
            "estimated_time_seconds": next_question.estimated_time_seconds,
            "topic": next_question.topic,
            "difficulty_label": next_question.difficulty_label
        },
        "metadata": {
            "user_ability": round(user_ability, 2),
            "question_difficulty": round(next_question.difficulty, 2),
            "probability_correct": round(probability, 2),
            "adaptive_reason": "maximum_information"
        }
    }


@router.post("/submit-answer")
async def submit_answer(
    response: QuestionResponse,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit an answer and update user's ability estimate
    """
    # Get question
    question = db.query(Question).filter(Question.id == response.question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Check if answer is correct
    is_correct = False
    if question.question_type == "multiple_choice":
        is_correct = response.user_answer.get("selected") == question.correct_answer
    elif question.question_type == "true_false":
        is_correct = response.user_answer.get("answer") == question.correct_answer
    # Add more question type validations as needed
    
    # Get current ability estimate
    cached_ability = await redis_client.get_json(f"user_ability:{current_user.id}")
    if cached_ability:
        ability_before = cached_ability['ability']
    else:
        ability_before = 0.0
    
    # Create question attempt record
    attempt = QuestionAttempt(
        user_id=current_user.id,
        question_id=question.id,
        user_answer=response.user_answer,
        is_correct=is_correct,
        time_spent_seconds=response.time_spent_seconds,
        confidence_level=response.confidence_level,
        hint_used=response.hint_used,
        ability_estimate_before=ability_before,
        question_difficulty=question.difficulty
    )
    
    # Calculate information gain
    information = adaptive_engine.calculate_information(
        ability_before,
        question.difficulty,
        question.discrimination,
        question.guessing
    )
    attempt.information_gain = information
    
    # Update ability estimate
    recent_attempts = db.query(QuestionAttempt).filter(
        QuestionAttempt.user_id == current_user.id
    ).order_by(QuestionAttempt.timestamp.desc()).limit(20).all()
    
    response_pattern = [
        {
            'difficulty': question.difficulty,
            'discrimination': question.discrimination,
            'guessing': question.guessing,
            'correct': is_correct
        }
    ]
    
    for past_attempt in recent_attempts:
        past_question = db.query(Question).filter(Question.id == past_attempt.question_id).first()
        if past_question:
            response_pattern.append({
                'difficulty': past_question.difficulty,
                'discrimination': past_question.discrimination,
                'guessing': past_question.guessing,
                'correct': past_attempt.is_correct
            })
    
    # Calculate new ability estimate
    new_ability, standard_error = adaptive_engine.estimate_ability_eap(response_pattern)
    attempt.ability_estimate_after = new_ability
    
    # Update user statistics
    current_user.total_questions_answered += 1
    current_user.total_study_time_minutes += response.time_spent_seconds // 60
    
    # Update overall accuracy
    total_correct = db.query(QuestionAttempt).filter(
        QuestionAttempt.user_id == current_user.id,
        QuestionAttempt.is_correct == True
    ).count()
    current_user.overall_accuracy = total_correct / current_user.total_questions_answered
    
    # Update question statistics
    question.success_rate = (
        question.success_rate * question.exposure_count + (1 if is_correct else 0)
    ) / (question.exposure_count + 1)
    
    if question.avg_time_seconds:
        question.avg_time_seconds = (
            question.avg_time_seconds * question.exposure_count + response.time_spent_seconds
        ) / (question.exposure_count + 1)
    else:
        question.avg_time_seconds = response.time_spent_seconds
    
    # Save to database
    db.add(attempt)
    db.commit()
    
    # Cache new ability
    await redis_client.set_json(
        f"user_ability:{current_user.id}",
        {"ability": new_ability, "timestamp": datetime.utcnow().isoformat()},
        expire=3600
    )
    
    return {
        "is_correct": is_correct,
        "correct_answer": question.correct_answer,
        "explanation": question.explanation,
        "ability_change": round(new_ability - ability_before, 3),
        "new_ability": round(new_ability, 2),
        "confidence_interval": round(standard_error * 1.96, 3),
        "performance": {
            "total_answered": current_user.total_questions_answered,
            "overall_accuracy": round(current_user.overall_accuracy, 2),
            "information_gained": round(information, 3)
        }
    }


@router.get("/ability-report", response_model=AbilityReport)
async def get_ability_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive ability report for the current user
    """
    # Get all user attempts
    attempts = db.query(QuestionAttempt).filter(
        QuestionAttempt.user_id == current_user.id
    ).all()
    
    if not attempts:
        return AbilityReport(
            overall_ability=0.0,
            confidence_interval=2.0,
            topic_abilities={},
            strengths=[],
            weaknesses=[],
            recommendations=[],
            total_attempts=0,
            overall_accuracy=0.0
        )
    
    # Prepare data for analysis
    attempts_data = []
    for attempt in attempts:
        question = db.query(Question).filter(Question.id == attempt.question_id).first()
        if question:
            attempts_data.append({
                'difficulty': question.difficulty,
                'discrimination': question.discrimination,
                'guessing': question.guessing,
                'correct': attempt.is_correct,
                'topic': question.topic,
                'subject': question.subject,
                'time_spent': attempt.time_spent_seconds
            })
    
    # Generate report using adaptive engine
    report = adaptive_engine.generate_ability_report(attempts_data)
    
    return AbilityReport(**report)


@router.get("/learning-path")
async def get_personalized_learning_path(
    exam_type: str,
    target_date: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate a personalized learning path based on user's ability and goals
    """
    # Get ability report
    attempts = db.query(QuestionAttempt).filter(
        QuestionAttempt.user_id == current_user.id
    ).all()
    
    attempts_data = []
    for attempt in attempts:
        question = db.query(Question).filter(Question.id == attempt.question_id).first()
        if question and question.exam_type == exam_type:
            attempts_data.append({
                'difficulty': question.difficulty,
                'discrimination': question.discrimination,
                'guessing': question.guessing,
                'correct': attempt.is_correct,
                'topic': question.topic,
                'subject': question.subject
            })
    
    report = adaptive_engine.generate_ability_report(attempts_data) if attempts_data else None
    
    # Calculate study plan
    learning_path = {
        "exam_type": exam_type,
        "current_readiness": "beginner" if not report else (
            "advanced" if report['overall_ability'] > 1 else
            "intermediate" if report['overall_ability'] > -0.5 else "beginner"
        ),
        "estimated_hours_needed": max(20, int(100 * (1 - (report['overall_ability'] + 3) / 6))) if report else 100,
        "focus_areas": []
    }
    
    # Identify focus areas
    if report:
        # Weakest topics need most attention
        for weakness in report['weaknesses']:
            learning_path['focus_areas'].append({
                "topic": weakness,
                "priority": "high",
                "recommended_questions": 30,
                "current_ability": report['topic_abilities'].get(weakness, {}).get('ability', -1),
                "target_difficulty_range": [-1, 0.5]
            })
        
        # Maintain strengths
        for strength in report['strengths']:
            learning_path['focus_areas'].append({
                "topic": strength,
                "priority": "maintenance",
                "recommended_questions": 10,
                "current_ability": report['topic_abilities'].get(strength, {}).get('ability', 1),
                "target_difficulty_range": [0.5, 2]
            })
    else:
        # New user - start with fundamentals
        topics = db.query(Question.topic).filter(
            Question.exam_type == exam_type
        ).distinct().limit(5).all()
        
        for topic in topics:
            learning_path['focus_areas'].append({
                "topic": topic[0],
                "priority": "high",
                "recommended_questions": 20,
                "current_ability": 0,
                "target_difficulty_range": [-1, 1]
            })
    
    # Add schedule
    if target_date:
        from datetime import datetime
        target = datetime.fromisoformat(target_date)
        days_until = (target - datetime.utcnow()).days
        learning_path['schedule'] = {
            "days_until_exam": days_until,
            "daily_questions": max(10, learning_path['estimated_hours_needed'] * 20 // days_until) if days_until > 0 else 20,
            "daily_minutes": max(30, learning_path['estimated_hours_needed'] * 60 // days_until) if days_until > 0 else 60
        }
    
    return learning_path


@router.post("/calibrate-question/{question_id}")
async def calibrate_question_parameters(
    question_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Calibrate IRT parameters for a question based on response data (admin only)
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can calibrate questions"
        )
    
    # Get all attempts for this question
    attempts = db.query(QuestionAttempt).filter(
        QuestionAttempt.question_id == question_id
    ).all()
    
    if len(attempts) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient data for calibration (minimum 10 attempts required)"
        )
    
    # Prepare calibration data
    calibration_data = []
    for attempt in attempts:
        if attempt.ability_estimate_before is not None:
            calibration_data.append({
                'user_ability': attempt.ability_estimate_before,
                'is_correct': attempt.is_correct
            })
    
    # Calibrate parameters
    new_params = adaptive_engine.calibrate_question_parameters(calibration_data)
    
    if new_params:
        question = db.query(Question).filter(Question.id == question_id).first()
        question.difficulty = new_params['difficulty']
        question.discrimination = new_params['discrimination']
        question.confidence_interval = new_params['confidence']
        question.last_calibrated = datetime.utcnow()
        db.commit()
        
        return {
            "message": "Question parameters calibrated successfully",
            "new_parameters": new_params,
            "attempts_used": len(calibration_data)
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Calibration failed"
        )

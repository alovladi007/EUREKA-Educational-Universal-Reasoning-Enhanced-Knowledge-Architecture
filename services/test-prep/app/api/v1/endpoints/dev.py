"""
Development endpoints with no authentication required
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
import random

from app.core.database import get_db
from app.models import Question

router = APIRouter()


@router.post("/adaptive/next-question")
async def get_next_question_dev(
    exam_type: Optional[str] = None,
    subject: Optional[str] = None,
    topic: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get next question without authentication (development only)
    """
    query = db.query(Question)

    if exam_type:
        query = query.filter(Question.exam_type == exam_type)
    if subject:
        query = query.filter(Question.subject == subject)
    if topic:
        query = query.filter(Question.topic == topic)

    # Get random question
    questions = query.all()
    if not questions:
        return {"error": "No questions found", "question": None}

    question = random.choice(questions)

    return {
        "question": {
            "id": question.id,
            "question_text": question.question_text,
            "question_type": question.question_type,
            "options": question.options,
            "exam_type": question.exam_type,
            "subject": question.subject,
            "topic": question.topic,
            "difficulty_label": question.difficulty_label,
            "estimated_time_seconds": question.estimated_time_seconds,
            "hint": question.hint
        },
        "metadata": {
            "user_ability": 0.0,
            "question_difficulty": question.difficulty,
            "success_probability": 0.5
        }
    }


@router.post("/adaptive/submit-answer")
async def submit_answer_dev(
    question_id: str,
    user_answer: dict,
    time_spent_seconds: int,
    hint_used: bool = False,
    confidence_level: int = 3,
    db: Session = Depends(get_db)
):
    """
    Submit answer without authentication (development only)
    """
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        return {"error": "Question not found"}

    # Simple correct answer check
    is_correct = user_answer.get("selected") == question.correct_answer.get("correct_option")

    return {
        "is_correct": is_correct,
        "correct_answer": question.correct_answer,
        "explanation": question.explanation,
        "new_ability": 0.1 if is_correct else -0.1,
        "ability_change": 0.05,
        "time_spent": time_spent_seconds,
        "hint_used": hint_used
    }


@router.get("/adaptive/learning-path")
async def get_learning_path_dev(
    exam_type: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Get learning path without authentication (development only)
    """
    return {
        "exam_type": exam_type,
        "current_ability": 0.0,
        "target_ability": 0.8,
        "focus_areas": [
            {"topic": "Algebra", "priority": "high", "mastery": 0.45},
            {"topic": "Geometry", "priority": "medium", "mastery": 0.62},
            {"topic": "Statistics", "priority": "high", "mastery": 0.38}
        ],
        "recommended_questions": 50,
        "estimated_study_hours": 20
    }


@router.get("/analytics/performance")
async def get_performance_analytics_dev(
    time_range: Optional[str] = Query("7_days"),
    exam_type: Optional[str] = None
):
    """
    Get performance analytics without authentication (development only)
    """
    return {
        "timeRange": time_range,
        "examType": exam_type,
        "overallAccuracy": 71.2,
        "totalQuestions": 125,
        "correctAnswers": 89,
        "averageTimePerQuestion": 95,
        "performanceByDay": [
            {"date": "2025-11-05", "accuracy": 65.0, "questions": 15},
            {"date": "2025-11-06", "accuracy": 72.5, "questions": 20},
            {"date": "2025-11-07", "accuracy": 68.0, "questions": 18},
            {"date": "2025-11-08", "accuracy": 75.0, "questions": 22},
            {"date": "2025-11-09", "accuracy": 70.0, "questions": 25},
            {"date": "2025-11-10", "accuracy": 73.5, "questions": 15},
            {"date": "2025-11-11", "accuracy": 76.0, "questions": 10}
        ],
        "strengthAreas": ["Geometry", "Data Analysis"],
        "weaknessAreas": ["Algebra", "Reading Comprehension"]
    }


@router.get("/analytics/topics")
async def get_topic_performance_dev(
    exam_type: Optional[str] = None
):
    """
    Get topic performance without authentication (development only)
    """
    return {
        "topics": [
            {
                "name": "Algebra",
                "questionsAttempted": 45,
                "accuracy": 68.5,
                "averageTime": 105,
                "difficulty": "hard",
                "recommendation": "Focus on linear equations and inequalities"
            },
            {
                "name": "Geometry",
                "questionsAttempted": 30,
                "accuracy": 75.0,
                "averageTime": 85,
                "difficulty": "medium",
                "recommendation": "Continue practicing solid geometry"
            },
            {
                "name": "Statistics",
                "questionsAttempted": 25,
                "accuracy": 72.0,
                "averageTime": 90,
                "difficulty": "medium",
                "recommendation": "Review probability distributions"
            },
            {
                "name": "Reading Comprehension",
                "questionsAttempted": 15,
                "accuracy": 65.0,
                "averageTime": 120,
                "difficulty": "hard",
                "recommendation": "Practice timed reading passages"
            },
            {
                "name": "Data Analysis",
                "questionsAttempted": 10,
                "accuracy": 80.0,
                "averageTime": 75,
                "difficulty": "easy",
                "recommendation": "Excellent progress, maintain pace"
            }
        ],
        "examType": exam_type or "GRE"
    }


@router.get("/analytics/study-plan")
async def get_study_plan_dev(
    exam_type: Optional[str] = None
):
    """
    Get study plan without authentication (development only)
    """
    return {
        "examType": exam_type or "GRE",
        "targetDate": "2025-12-15",
        "daysRemaining": 34,
        "recommendedDailyMinutes": 60,
        "weeklyPlan": [
            {
                "week": 1,
                "focus": "Algebra fundamentals",
                "goals": ["Complete 50 algebra questions", "Review linear equations"],
                "estimatedTime": 420
            },
            {
                "week": 2,
                "focus": "Geometry review",
                "goals": ["Practice coordinate geometry", "Master circle theorems"],
                "estimatedTime": 360
            },
            {
                "week": 3,
                "focus": "Statistics and probability",
                "goals": ["Learn probability rules", "Practice data interpretation"],
                "estimatedTime": 400
            },
            {
                "week": 4,
                "focus": "Reading comprehension",
                "goals": ["Timed passage practice", "Vocabulary building"],
                "estimatedTime": 380
            }
        ],
        "milestones": [
            {"date": "2025-11-18", "goal": "Complete first practice test"},
            {"date": "2025-11-25", "goal": "Achieve 75% accuracy in weak areas"},
            {"date": "2025-12-02", "goal": "Complete second practice test"},
            {"date": "2025-12-09", "goal": "Final review and practice test"}
        ]
    }

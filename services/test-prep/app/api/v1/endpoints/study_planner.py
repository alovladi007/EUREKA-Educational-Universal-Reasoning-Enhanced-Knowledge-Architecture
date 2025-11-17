"""
Study Planner API endpoints
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime

from app.core.database import get_db
from app.services.study_planner import StudyPlannerService

router = APIRouter()
planner = StudyPlannerService()


class GeneratePlanRequest(BaseModel):
    """Request to generate study plan"""
    user_id: str
    exam_type: str
    exam_date: str  # ISO format
    target_score: float
    current_score: float
    available_hours: float
    topic_mastery: Dict[str, float]  # topic -> mastery level (0-1)


@router.post("/generate")
async def generate_study_plan(
    request: GeneratePlanRequest,
    db: Session = Depends(get_db)
):
    """
    Generate personalized study plan

    Creates optimized weekly study schedules with:
    - Topic allocations using dynamic programming
    - Practice session scheduling
    - Mock exam scheduling
    - Milestone tracking
    - Outcome predictions
    """
    try:
        # Parse exam date
        exam_date = datetime.fromisoformat(request.exam_date)

        # Generate plan
        plan = planner.generate_study_plan(
            user_id=request.user_id,
            exam_type=request.exam_type,
            exam_date=exam_date,
            target_score=request.target_score,
            current_score=request.current_score,
            available_hours=request.available_hours,
            topic_mastery=request.topic_mastery
        )

        # Convert to dict for JSON response
        return {
            'plan_id': plan.id,
            'user_id': plan.user_id,
            'exam_date': plan.exam_date.isoformat(),
            'target_score': plan.target_score,
            'current_score': plan.current_score,
            'hours_per_week': plan.hours_per_week,
            'total_weeks': len(plan.weeks),
            'confidence_score': round(plan.confidence_score, 3),
            'expected_outcome': {
                'predicted_score': round(plan.expected_outcome['predicted_score'], 1),
                'confidence': round(plan.expected_outcome['confidence'], 3),
                'probability_range': plan.expected_outcome['probability_range'],
                'strengths': plan.expected_outcome['strengths'],
                'risks': plan.expected_outcome['risks']
            },
            'focus_areas': [
                {
                    'topic_id': area.topic_id,
                    'topic_name': area.topic_name,
                    'current_mastery': round(area.current_mastery, 3),
                    'target_mastery': round(area.target_mastery, 3),
                    'time_required': round(area.time_required, 1),
                    'strategy': area.strategy
                }
                for area in plan.focus_areas
            ],
            'weekly_summary': [
                {
                    'week': week.week_number,
                    'start_date': week.start_date.isoformat(),
                    'end_date': week.end_date.isoformat(),
                    'total_hours': week.total_hours,
                    'topics_count': len(week.topics),
                    'practice_sessions': len(week.practices),
                    'mock_exams': len(week.mock_exams),
                    'goals': week.goals,
                    'expected_progress': round(week.expected_progress, 1)
                }
                for week in plan.weeks
            ],
            'milestones': [
                {
                    'id': milestone.id,
                    'week_number': milestone.week_number,
                    'type': milestone.milestone_type,
                    'target': milestone.target,
                    'importance': milestone.importance,
                    'reward': milestone.reward
                }
                for milestone in plan.milestones
            ]
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate plan: {str(e)}")


@router.get("/plan/{plan_id}/week/{week_number}")
async def get_weekly_plan(
    plan_id: str,
    week_number: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed weekly plan

    Returns complete information for a specific week including:
    - Topic allocations with time breakdowns
    - Scheduled practice sessions
    - Mock exams
    - Goals and expected progress
    """
    # In production, fetch from database
    # For now, return structure example
    raise HTTPException(
        status_code=501,
        detail="Weekly plan retrieval requires database integration"
    )


@router.post("/plan/{plan_id}/adjust")
async def adjust_plan(
    plan_id: str,
    adjustments: Dict,
    db: Session = Depends(get_db)
):
    """
    Adjust study plan based on actual progress

    Allows for adaptive modifications:
    - Reallocate time based on performance
    - Adjust difficulty levels
    - Add/remove topics
    - Modify milestones
    """
    raise HTTPException(
        status_code=501,
        detail="Plan adjustment requires database integration"
    )


@router.get("/recommendations")
async def get_study_recommendations(
    user_id: str,
    exam_type: str,
    db: Session = Depends(get_db)
):
    """
    Get personalized study recommendations

    Returns smart recommendations based on:
    - Current performance
    - Time until exam
    - Topic mastery levels
    - Learning patterns
    """
    # Placeholder recommendations
    return {
        'recommendations': [
            {
                'type': 'practice',
                'priority': 'high',
                'title': 'Focus on weak areas',
                'description': 'Dedicate 60% of study time to topics below 50% mastery',
                'estimated_impact': 0.15,
                'time_required': 10
            },
            {
                'type': 'strategy',
                'priority': 'medium',
                'title': 'Improve time management',
                'description': 'Practice timed sections to build pacing skills',
                'estimated_impact': 0.10,
                'time_required': 5
            },
            {
                'type': 'review',
                'priority': 'medium',
                'title': 'Spaced repetition',
                'description': 'Review previously mastered topics weekly',
                'estimated_impact': 0.08,
                'time_required': 3
            }
        ]
    }

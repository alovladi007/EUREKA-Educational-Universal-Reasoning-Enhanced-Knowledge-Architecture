"""
Adaptive testing endpoints using advanced IRT engine
Full implementation with no placeholders
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Dict, List, Optional
from pydantic import BaseModel
import json

from app.core.database import get_db
from app.services.adaptive_engine import (
    AdaptiveEngine,
    AdaptiveState,
    IRTParameters,
    ResponseHistory
)
from app.models.question import Question

router = APIRouter()
engine = AdaptiveEngine()

# In-memory session storage (in production, use Redis or database)
# Key: session_id, Value: session data
active_sessions: Dict[str, Dict] = {}


class StartSessionRequest(BaseModel):
    """Request to start a new adaptive session"""
    user_id: str
    exam_type: str  # GRE, GMAT, LSAT, MCAT
    section: Optional[str] = None  # e.g., "Quantitative Reasoning", "Verbal Reasoning"


class SubmitResponseRequest(BaseModel):
    """Request to submit an answer"""
    session_id: str
    question_id: str
    answer_index: int
    time_spent: int  # seconds


@router.post("/session/start")
async def start_adaptive_session(
    request: StartSessionRequest,
    db: Session = Depends(get_db)
):
    """
    Start a new adaptive testing session

    Returns session_id and first question
    """
    # Create initial state
    state = engine.create_initial_state()

    # Generate session ID
    import time
    session_id = f"{request.user_id}_{request.exam_type}_{int(time.time())}"

    # Get item bank
    query = db.query(Question).filter(Question.exam == request.exam_type)

    if request.section:
        query = query.filter(Question.section == request.section)

    questions = query.all()

    if not questions:
        raise HTTPException(
            status_code=404,
            detail=f"No questions found for {request.exam_type}"
        )

    # Convert to dict format for engine
    item_bank = [
        {
            'id': q.id,
            'stem': q.stem,
            'choices': json.loads(q.choices) if q.choices else [],
            'correct_index': q.correct_index,
            'explanation': q.explanation,
            'topic': q.topic,
            'irt_a': q.irt_a or 1.0,
            'irt_b': q.irt_b or 0.0,
            'irt_c': q.irt_c or 0.25,
            'difficulty_label': q.difficulty_label
        }
        for q in questions
    ]

    # Select first question
    first_question = engine.select_next_question(state, item_bank)

    if not first_question:
        raise HTTPException(status_code=500, detail="Could not select question")

    # Store session
    active_sessions[session_id] = {
        'state': state,
        'item_bank': item_bank,
        'exam_type': request.exam_type,
        'section': request.section,
        'user_id': request.user_id
    }

    # Calculate expected probability
    prob = engine.calculate_probability(
        state.theta,
        IRTParameters(
            a=first_question['irt_a'],
            b=first_question['irt_b'],
            c=first_question['irt_c']
        )
    )

    return {
        'session_id': session_id,
        'question': {
            'id': first_question['id'],
            'stem': first_question['stem'],
            'choices': first_question['choices'],
            'topic': first_question['topic'],
            'difficulty': first_question['difficulty_label']
        },
        'metadata': {
            'current_theta': round(state.theta, 3),
            'theta_se': round(state.theta_se, 3),
            'questions_answered': 0,
            'expected_probability': round(prob, 3),
            'should_stop': False
        }
    }


@router.post("/session/submit")
async def submit_response(
    request: SubmitResponseRequest,
    db: Session = Depends(get_db)
):
    """
    Submit an answer and get next question

    Returns feedback and next question (or final results if complete)
    """
    # Get session
    if request.session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = active_sessions[request.session_id]
    state: AdaptiveState = session['state']
    item_bank: List[Dict] = session['item_bank']

    # Find the question
    current_question = next(
        (q for q in item_bank if q['id'] == request.question_id),
        None
    )

    if not current_question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Check if correct
    is_correct = request.answer_index == current_question['correct_index']

    # Update ability estimate
    item_params = IRTParameters(
        a=current_question['irt_a'],
        b=current_question['irt_b'],
        c=current_question['irt_c']
    )

    new_state = engine.update_theta(
        state,
        is_correct,
        item_params,
        item_id=request.question_id,
        topic=current_question['topic'],
        time_spent=request.time_spent
    )

    # Update session
    session['state'] = new_state

    # Check if should stop
    should_stop = engine.should_stop(new_state)

    # Build response
    response_data = {
        'correct': is_correct,
        'correct_answer': current_question['correct_index'],
        'explanation': current_question['explanation'],
        'new_theta': round(new_state.theta, 3),
        'theta_se': round(new_state.theta_se, 3),
        'questions_answered': new_state.questions_answered,
        'should_stop': should_stop
    }

    if should_stop:
        # Session complete - calculate final score
        exam_type = session['exam_type']
        scaled_score = engine.theta_to_score(new_state.theta, exam_type)

        # Calculate topic mastery
        topics = list(set(r.topic for r in new_state.responses))
        topic_mastery = {
            topic: round(engine.calculate_mastery(new_state.responses, topic), 3)
            for topic in topics
        }

        # Calculate accuracy
        total = len(new_state.responses)
        correct_count = sum(1 for r in new_state.responses if r.response)
        accuracy = correct_count / total if total > 0 else 0

        response_data['final_results'] = {
            'theta': round(new_state.theta, 3),
            'theta_se': round(new_state.theta_se, 3),
            'scaled_score': scaled_score,
            'total_questions': total,
            'correct': correct_count,
            'accuracy': round(accuracy, 3),
            'topic_mastery': topic_mastery,
            'total_time': sum(r.time_spent for r in new_state.responses)
        }

        # Clean up session
        del active_sessions[request.session_id]

    else:
        # Select next question
        next_question = engine.select_next_question(new_state, item_bank)

        if not next_question:
            raise HTTPException(
                status_code=500,
                detail="No more suitable questions available"
            )

        # Calculate expected probability for next question
        prob = engine.calculate_probability(
            new_state.theta,
            IRTParameters(
                a=next_question['irt_a'],
                b=next_question['irt_b'],
                c=next_question['irt_c']
            )
        )

        response_data['next_question'] = {
            'id': next_question['id'],
            'stem': next_question['stem'],
            'choices': next_question['choices'],
            'topic': next_question['topic'],
            'difficulty': next_question['difficulty_label'],
            'expected_probability': round(prob, 3)
        }

    return response_data


@router.get("/session/{session_id}/status")
async def get_session_status(session_id: str):
    """Get current status of an adaptive session"""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = active_sessions[session_id]
    state: AdaptiveState = session['state']

    # Calculate topic distribution
    topic_counts = {}
    for resp in state.responses:
        topic_counts[resp.topic] = topic_counts.get(resp.topic, 0) + 1

    # Calculate performance by difficulty
    difficulty_performance = {'easy': [], 'medium': [], 'hard': []}
    for resp in state.responses:
        # Classify by IRT difficulty parameter
        if resp.irt_params.b < -0.5:
            diff_level = 'easy'
        elif resp.irt_params.b > 0.5:
            diff_level = 'hard'
        else:
            diff_level = 'medium'

        difficulty_performance[diff_level].append(1 if resp.response else 0)

    # Calculate accuracy by difficulty
    diff_accuracy = {}
    for level, results in difficulty_performance.items():
        if results:
            diff_accuracy[level] = sum(results) / len(results)
        else:
            diff_accuracy[level] = None

    return {
        'session_id': session_id,
        'exam_type': session['exam_type'],
        'section': session['section'],
        'current_theta': round(state.theta, 3),
        'theta_se': round(state.theta_se, 3),
        'questions_answered': state.questions_answered,
        'should_stop': engine.should_stop(state),
        'topic_distribution': topic_counts,
        'difficulty_accuracy': diff_accuracy,
        'estimated_score': engine.theta_to_score(state.theta, session['exam_type'])
    }


@router.delete("/session/{session_id}")
async def end_session(session_id: str):
    """Manually end an adaptive session"""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    del active_sessions[session_id]

    return {'message': 'Session ended successfully'}


@router.get("/sessions/active")
async def list_active_sessions():
    """List all active sessions (for debugging)"""
    return {
        'active_sessions': [
            {
                'session_id': sid,
                'user_id': session['user_id'],
                'exam_type': session['exam_type'],
                'questions_answered': session['state'].questions_answered
            }
            for sid, session in active_sessions.items()
        ]
    }

"""
EUREKA Pedagogical Intelligence Layer - Cognitive Modeling API

Endpoints for learner cognitive state tracking and prediction.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
import logging

from app.models.dkt import DKTModel, encode_practice_sequence
from app.models.irt import IRTModel
from app.models.forgetting import SpacedRepetitionScheduler
from app.core.compliance import compliance
from app.core.ethics import ethics

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory storage (replace with database in production)
learner_states = {}
dkt_model_cache = {}
irt_model = IRTModel(model_type="2PL")
sr_scheduler = SpacedRepetitionScheduler()


# Request/Response Models
class PracticeItem(BaseModel):
    """Single practice item"""
    concept_id: int = Field(..., description="Concept ID")
    is_correct: bool = Field(..., description="Whether response was correct")
    timestamp: Optional[datetime] = None
    difficulty_rating: Optional[int] = Field(None, ge=1, le=5, description="Subjective difficulty (1-5)")


class CognitiveStateRequest(BaseModel):
    """Request for cognitive state"""
    learner_id: str = Field(..., description="Unique learner identifier")
    include_predictions: bool = Field(True, description="Include next-item predictions")
    num_concepts: Optional[int] = Field(50, description="Number of concepts in curriculum")


class CognitiveUpdateRequest(BaseModel):
    """Request to update cognitive state"""
    learner_id: str = Field(..., description="Unique learner identifier")
    practice_sequence: List[PracticeItem] = Field(..., description="Sequence of practice items")
    num_concepts: int = Field(50, description="Number of concepts in curriculum")


class CognitiveStateResponse(BaseModel):
    """Cognitive state response"""
    learner_id: str
    mastery_state: Dict[int, float] = Field(..., description="Mastery probability per concept")
    ability_estimate: float = Field(..., description="IRT ability estimate (theta)")
    next_item_predictions: Optional[Dict[int, float]] = None
    spaced_repetition: Optional[List[Dict]] = None
    last_updated: datetime
    total_practices: int


class CognitiveUpdateResponse(BaseModel):
    """Cognitive update response"""
    learner_id: str
    updated: bool
    new_mastery: Dict[int, float]
    new_ability: float
    recommendations: List[str]


@router.get("/state", response_model=CognitiveStateResponse)
async def get_cognitive_state(
    learner_id: str,
    include_predictions: bool = True,
    num_concepts: int = 50
):
    """
    Get current cognitive state for a learner.

    Returns DKT mastery estimates, IRT ability, and spaced repetition due items.
    """
    # Compliance check on learner_id
    sanitized = compliance.sanitize(learner_id, context='learner_id')
    if not sanitized['is_safe']:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid learner_id: {sanitized['violations']}"
        )

    learner_id = sanitized['sanitized_text']

    # Get or initialize state
    if learner_id not in learner_states:
        # Cold start
        return CognitiveStateResponse(
            learner_id=learner_id,
            mastery_state={i: 0.5 for i in range(num_concepts)},  # Neutral prior
            ability_estimate=0.0,  # Average ability
            next_item_predictions={i: 0.5 for i in range(num_concepts)} if include_predictions else None,
            spaced_repetition=[],
            last_updated=datetime.now(),
            total_practices=0
        )

    state = learner_states[learner_id]

    # Get spaced repetition due items
    sr_due = sr_scheduler.get_due_items(limit=10)

    response = CognitiveStateResponse(
        learner_id=learner_id,
        mastery_state=state.get('mastery', {}),
        ability_estimate=state.get('ability', 0.0),
        next_item_predictions=state.get('predictions', {}) if include_predictions else None,
        spaced_repetition=sr_due,
        last_updated=state.get('last_updated', datetime.now()),
        total_practices=state.get('total_practices', 0)
    )

    logger.info(f"Retrieved cognitive state for learner {learner_id}")
    return response


@router.post("/update", response_model=CognitiveUpdateResponse)
async def update_cognitive_state(request: CognitiveUpdateRequest):
    """
    Update cognitive state based on practice sequence.

    Processes practice items through DKT and IRT models, updates mastery
    and ability estimates, and provides personalized recommendations.
    """
    # Compliance check
    sanitized = compliance.sanitize(request.learner_id, context='learner_id')
    if not sanitized['is_safe']:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid learner_id: {sanitized['violations']}"
        )

    learner_id = sanitized['sanitized_text']

    if not request.practice_sequence:
        raise HTTPException(status_code=400, detail="Practice sequence cannot be empty")

    # Initialize or get existing state
    if learner_id not in learner_states:
        learner_states[learner_id] = {
            'mastery': {i: 0.5 for i in range(request.num_concepts)},
            'ability': 0.0,
            'predictions': {},
            'last_updated': datetime.now(),
            'total_practices': 0,
            'history': []
        }

    state = learner_states[learner_id]

    # Convert practice sequence
    practice_dicts = [
        {
            'concept_id': item.concept_id,
            'is_correct': item.is_correct,
            'item_id': item.concept_id  # For IRT
        }
        for item in request.practice_sequence
    ]

    # Update DKT model
    encoded_sequence = encode_practice_sequence(practice_dicts, request.num_concepts)

    # Get or create DKT model for this curriculum
    if request.num_concepts not in dkt_model_cache:
        dkt_model_cache[request.num_concepts] = DKTModel(
            num_concepts=request.num_concepts,
            hidden_dim=128,
            num_layers=2
        )

    dkt_model = dkt_model_cache[request.num_concepts]

    # Predict mastery for each concept
    import torch
    with torch.no_grad():
        inputs = torch.FloatTensor(encoded_sequence).unsqueeze(0)
        outputs, _ = dkt_model(inputs)
        mastery_probs = outputs[0, -1, :].numpy()

    new_mastery = {i: float(prob) for i, prob in enumerate(mastery_probs)}

    # Update IRT ability
    new_ability = irt_model.estimate_ability(learner_id, practice_dicts, method="MAP")

    # Update spaced repetition for each practiced item
    for item in request.practice_sequence:
        sr_scheduler.record_review(
            item_id=f"concept_{item.concept_id}",
            was_correct=item.is_correct,
            difficulty_rating=item.difficulty_rating
        )

    # Generate recommendations
    recommendations = []

    # Identify weak concepts
    weak_concepts = [
        concept_id for concept_id, prob in new_mastery.items()
        if prob < 0.6
    ]

    if weak_concepts:
        recommendations.append(
            f"Focus on concepts: {', '.join(map(str, weak_concepts[:5]))} (mastery < 60%)"
        )

    # Check recent performance
    recent_correct = sum(1 for item in request.practice_sequence if item.is_correct)
    recent_total = len(request.practice_sequence)
    recent_accuracy = recent_correct / recent_total if recent_total > 0 else 0

    if recent_accuracy < 0.5:
        recommendations.append(
            "Consider reviewing prerequisite concepts or requesting help"
        )
    elif recent_accuracy > 0.9:
        recommendations.append(
            "Excellent work! Ready for more challenging material"
        )

    # Ethics check on recommendations
    for rec in recommendations:
        ethics_check = ethics.check(rec, context='recommendation')
        if not ethics_check['is_ethical']:
            logger.warning(f"Ethics concern in recommendation: {ethics_check['concerns']}")

    # Update state
    state['mastery'] = new_mastery
    state['ability'] = new_ability
    state['last_updated'] = datetime.now()
    state['total_practices'] += len(request.practice_sequence)
    state['history'].extend(practice_dicts)

    logger.info(
        f"Updated cognitive state for {learner_id}: "
        f"ability={new_ability:.2f}, practices={state['total_practices']}"
    )

    return CognitiveUpdateResponse(
        learner_id=learner_id,
        updated=True,
        new_mastery=new_mastery,
        new_ability=new_ability,
        recommendations=recommendations
    )


@router.get("/predict")
async def predict_next_item(
    learner_id: str,
    concept_id: int,
    num_concepts: int = 50
):
    """
    Predict probability of correctness for next item in a concept.

    Uses DKT model to generate prediction based on learner's history.
    """
    # Compliance check
    sanitized = compliance.sanitize(learner_id, context='learner_id')
    if not sanitized['is_safe']:
        raise HTTPException(status_code=400, detail="Invalid learner_id")

    learner_id = sanitized['sanitized_text']

    # Get state
    if learner_id not in learner_states:
        # Cold start: use IRT cold start prediction
        prob = irt_model.cold_start_predict(concept_id)
        return {
            'learner_id': learner_id,
            'concept_id': concept_id,
            'probability': prob,
            'method': 'IRT_cold_start',
            'confidence': 'low'
        }

    state = learner_states[learner_id]

    # Use DKT mastery estimate
    mastery = state.get('mastery', {})
    prob = mastery.get(concept_id, 0.5)

    return {
        'learner_id': learner_id,
        'concept_id': concept_id,
        'probability': prob,
        'method': 'DKT',
        'confidence': 'high' if state['total_practices'] > 10 else 'medium'
    }

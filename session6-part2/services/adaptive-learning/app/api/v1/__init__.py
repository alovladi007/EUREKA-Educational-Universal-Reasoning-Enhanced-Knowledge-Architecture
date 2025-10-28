"""
Adaptive Learning Service - API Endpoints
"""
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.core.database import get_db
from app.core.models import (
    Concept, StudentMastery, LearningPath, Recommendation, SkillGap
)
from app.schemas import (
    # Concept
    ConceptCreate, ConceptUpdate, ConceptResponse,
    # Mastery
    StudentMasteryCreate, StudentMasteryUpdate, StudentMasteryResponse,
    # Path
    LearningPathCreate, LearningPathUpdate, LearningPathResponse,
    # Recommendation
    RecommendationCreate, RecommendationResponse,
    # Skill Gap
    SkillGapCreate, SkillGapUpdate, SkillGapResponse,
    # Special requests
    GeneratePathRequest, GetRecommendationsRequest, UpdateMasteryRequest,
    MasteryOverview, SkillGapReport
)
from app.services.adaptive_service import AdaptiveLearningService

router = APIRouter()
adaptive_service = AdaptiveLearningService()


# ============= Concepts =============

@router.post("/concepts", response_model=ConceptResponse, status_code=status.HTTP_201_CREATED)
async def create_concept(
    concept: ConceptCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new concept in the knowledge graph"""
    db_concept = Concept(**concept.dict())
    db.add(db_concept)
    await db.commit()
    await db.refresh(db_concept)
    return db_concept


@router.get("/concepts/{concept_id}", response_model=ConceptResponse)
async def get_concept(
    concept_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific concept"""
    result = await db.execute(
        select(Concept).where(Concept.id == concept_id)
    )
    concept = result.scalar_one_or_none()
    
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found")
    
    return concept


@router.get("/courses/{course_id}/concepts", response_model=List[ConceptResponse])
async def list_course_concepts(
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """List all concepts for a course"""
    result = await db.execute(
        select(Concept).where(Concept.course_id == course_id)
    )
    return result.scalars().all()


@router.patch("/concepts/{concept_id}", response_model=ConceptResponse)
async def update_concept(
    concept_id: UUID,
    concept_update: ConceptUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a concept"""
    result = await db.execute(
        select(Concept).where(Concept.id == concept_id)
    )
    concept = result.scalar_one_or_none()
    
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found")
    
    update_data = concept_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(concept, field, value)
    
    await db.commit()
    await db.refresh(concept)
    return concept


# ============= Learning Paths =============

@router.post("/learning-paths/generate", response_model=LearningPathResponse)
async def generate_learning_path(
    request: GeneratePathRequest,
    db: AsyncSession = Depends(get_db)
):
    """Generate a personalized learning path"""
    path = await adaptive_service.generate_learning_path(
        db=db,
        user_id=request.user_id,
        course_id=request.course_id,
        target_difficulty=request.target_difficulty,
        max_concepts=request.max_concepts
    )
    return path


@router.get("/learning-paths/{path_id}", response_model=LearningPathResponse)
async def get_learning_path(
    path_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific learning path"""
    result = await db.execute(
        select(LearningPath).where(LearningPath.id == path_id)
    )
    path = result.scalar_one_or_none()
    
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found")
    
    return path


@router.get("/users/{user_id}/learning-paths", response_model=List[LearningPathResponse])
async def list_user_paths(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """List all learning paths for a user"""
    result = await db.execute(
        select(LearningPath).where(LearningPath.user_id == user_id)
    )
    return result.scalars().all()


@router.patch("/learning-paths/{path_id}", response_model=LearningPathResponse)
async def update_learning_path(
    path_id: UUID,
    path_update: LearningPathUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a learning path (e.g., mark progress)"""
    result = await db.execute(
        select(LearningPath).where(LearningPath.id == path_id)
    )
    path = result.scalar_one_or_none()
    
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found")
    
    update_data = path_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(path, field, value)
    
    await db.commit()
    await db.refresh(path)
    return path


# ============= Mastery Tracking =============

@router.get("/users/{user_id}/mastery", response_model=List[StudentMasteryResponse])
async def get_user_mastery(
    user_id: UUID,
    course_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get mastery records for a user"""
    query = select(StudentMastery).where(StudentMastery.user_id == user_id)
    
    if course_id:
        # Join with Concept to filter by course
        query = query.join(Concept, StudentMastery.concept_id == Concept.id)
        query = query.where(Concept.course_id == course_id)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/users/{user_id}/mastery/overview", response_model=MasteryOverview)
async def get_mastery_overview(
    user_id: UUID,
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get mastery overview for a user in a course"""
    from sqlalchemy import func
    from app.core.models import MasteryLevel
    
    # Get all mastery records with concept info
    result = await db.execute(
        select(StudentMastery, Concept)
        .join(Concept, StudentMastery.concept_id == Concept.id)
        .where(
            and_(
                StudentMastery.user_id == user_id,
                Concept.course_id == course_id
            )
        )
    )
    mastery_records = result.all()
    
    if not mastery_records:
        raise HTTPException(status_code=404, detail="No mastery data found")
    
    # Calculate stats
    total = len(mastery_records)
    mastered = sum(1 for m, _ in mastery_records if m.mastery_level == MasteryLevel.MASTERED)
    learning = sum(1 for m, _ in mastery_records if m.mastery_level == MasteryLevel.LEARNING)
    not_started = sum(1 for m, _ in mastery_records if m.mastery_level == MasteryLevel.NOT_STARTED)
    
    avg_mastery = sum(m.mastery_score for m, _ in mastery_records) / total
    avg_confidence = sum(m.confidence_score for m, _ in mastery_records) / total
    total_time = sum(m.time_spent_minutes for m, _ in mastery_records)
    
    return MasteryOverview(
        user_id=user_id,
        course_id=course_id,
        total_concepts=total,
        mastered_concepts=mastered,
        learning_concepts=learning,
        not_started_concepts=not_started,
        average_mastery_score=avg_mastery,
        average_confidence=avg_confidence,
        total_time_spent_minutes=total_time
    )


@router.post("/mastery/update", response_model=StudentMasteryResponse)
async def update_mastery(
    request: UpdateMasteryRequest,
    db: AsyncSession = Depends(get_db)
):
    """Update mastery based on assessment performance"""
    mastery = await adaptive_service.update_mastery(
        db=db,
        user_id=request.user_id,
        concept_id=request.concept_id,
        assessment_score=request.assessment_score,
        time_spent_minutes=request.time_spent_minutes
    )
    return mastery


# ============= Recommendations =============

@router.post("/recommendations/generate", response_model=List[RecommendationResponse])
async def generate_recommendations(
    request: GetRecommendationsRequest,
    db: AsyncSession = Depends(get_db)
):
    """Generate personalized learning recommendations"""
    recommendations = await adaptive_service.generate_recommendations(
        db=db,
        user_id=request.user_id,
        course_id=request.course_id,
        limit=request.limit
    )
    return recommendations


@router.get("/users/{user_id}/recommendations", response_model=List[RecommendationResponse])
async def get_user_recommendations(
    user_id: UUID,
    active_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """Get recommendations for a user"""
    query = select(Recommendation).where(Recommendation.user_id == user_id)
    
    if active_only:
        query = query.where(Recommendation.is_active == True)
    
    result = await db.execute(query.order_by(Recommendation.priority.desc()))
    return result.scalars().all()


@router.patch("/recommendations/{rec_id}/view", response_model=RecommendationResponse)
async def mark_recommendation_viewed(
    rec_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Mark a recommendation as viewed"""
    from datetime import datetime
    
    result = await db.execute(
        select(Recommendation).where(Recommendation.id == rec_id)
    )
    rec = result.scalar_one_or_none()
    
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    
    rec.is_viewed = True
    rec.viewed_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(rec)
    return rec


@router.patch("/recommendations/{rec_id}/act", response_model=RecommendationResponse)
async def mark_recommendation_acted_on(
    rec_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Mark a recommendation as acted upon"""
    from datetime import datetime
    
    result = await db.execute(
        select(Recommendation).where(Recommendation.id == rec_id)
    )
    rec = result.scalar_one_or_none()
    
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    
    rec.is_acted_on = True
    rec.acted_on_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(rec)
    return rec


# ============= Skill Gaps =============

@router.post("/skill-gaps/analyze", response_model=SkillGapReport)
async def analyze_skill_gaps(
    user_id: UUID,
    course_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db)
):
    """Analyze and identify skill gaps for a user"""
    gaps = await adaptive_service.identify_skill_gaps(
        db=db,
        user_id=user_id,
        course_id=course_id
    )
    
    critical_gaps = [g for g in gaps if g.severity >= 0.8]
    
    return SkillGapReport(
        user_id=user_id,
        course_id=course_id,
        total_gaps=len(gaps),
        critical_gaps=len(critical_gaps),
        gaps=gaps
    )


@router.get("/users/{user_id}/skill-gaps", response_model=List[SkillGapResponse])
async def get_user_skill_gaps(
    user_id: UUID,
    unaddressed_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """Get skill gaps for a user"""
    query = select(SkillGap).where(SkillGap.user_id == user_id)
    
    if unaddressed_only:
        query = query.where(SkillGap.is_addressed == False)
    
    result = await db.execute(query.order_by(SkillGap.severity.desc()))
    return result.scalars().all()


@router.patch("/skill-gaps/{gap_id}", response_model=SkillGapResponse)
async def update_skill_gap(
    gap_id: UUID,
    gap_update: SkillGapUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a skill gap (e.g., mark as addressed)"""
    from datetime import datetime
    
    result = await db.execute(
        select(SkillGap).where(SkillGap.id == gap_id)
    )
    gap = result.scalar_one_or_none()
    
    if not gap:
        raise HTTPException(status_code=404, detail="Skill gap not found")
    
    update_data = gap_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(gap, field, value)
    
    if gap.is_addressed and not gap.addressed_at:
        gap.addressed_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(gap)
    return gap

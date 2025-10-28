"""
Adaptive Learning Service - Pydantic Schemas
"""
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field
from app.core.models import DifficultyLevel, MasteryLevel, PathStatus


# ============= Concept Schemas =============

class ConceptBase(BaseModel):
    name: str = Field(..., max_length=200)
    description: Optional[str] = None
    difficulty_level: DifficultyLevel = DifficultyLevel.INTERMEDIATE
    prerequisites: List[UUID] = Field(default_factory=list)
    content_ids: List[UUID] = Field(default_factory=list)
    assessment_ids: List[UUID] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    estimated_time_minutes: Optional[int] = None


class ConceptCreate(ConceptBase):
    course_id: UUID


class ConceptUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    difficulty_level: Optional[DifficultyLevel] = None
    prerequisites: Optional[List[UUID]] = None
    content_ids: Optional[List[UUID]] = None
    assessment_ids: Optional[List[UUID]] = None
    tags: Optional[List[str]] = None
    estimated_time_minutes: Optional[int] = None


class ConceptResponse(ConceptBase):
    id: UUID
    course_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============= Student Mastery Schemas =============

class StudentMasteryBase(BaseModel):
    mastery_level: MasteryLevel = MasteryLevel.NOT_STARTED
    mastery_score: float = Field(0.0, ge=0.0, le=1.0)
    confidence_score: float = Field(0.0, ge=0.0, le=1.0)
    attempts: int = Field(0, ge=0)
    correct_attempts: int = Field(0, ge=0)
    time_spent_minutes: int = Field(0, ge=0)


class StudentMasteryCreate(BaseModel):
    user_id: UUID
    concept_id: UUID


class StudentMasteryUpdate(BaseModel):
    mastery_level: Optional[MasteryLevel] = None
    mastery_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    confidence_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    attempts: Optional[int] = Field(None, ge=0)
    correct_attempts: Optional[int] = Field(None, ge=0)
    time_spent_minutes: Optional[int] = Field(None, ge=0)


class StudentMasteryResponse(StudentMasteryBase):
    id: UUID
    user_id: UUID
    concept_id: UUID
    last_practice_date: Optional[datetime] = None
    first_encountered: datetime
    last_updated: datetime
    mastered_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============= Learning Path Schemas =============

class LearningPathBase(BaseModel):
    name: str = Field(..., max_length=200)
    description: Optional[str] = None
    target_difficulty: Optional[DifficultyLevel] = None
    concept_sequence: List[UUID] = Field(default_factory=list)
    estimated_completion_hours: Optional[float] = None


class LearningPathCreate(LearningPathBase):
    user_id: UUID
    course_id: UUID


class LearningPathUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    target_difficulty: Optional[DifficultyLevel] = None
    concept_sequence: Optional[List[UUID]] = None
    current_position: Optional[int] = Field(None, ge=0)
    completed_concepts: Optional[List[UUID]] = None
    status: Optional[PathStatus] = None


class LearningPathResponse(LearningPathBase):
    id: UUID
    user_id: UUID
    course_id: UUID
    current_position: int
    completed_concepts: List[UUID]
    status: PathStatus
    actual_completion_hours: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============= Recommendation Schemas =============

class RecommendationBase(BaseModel):
    recommendation_type: str = Field(..., max_length=50)
    priority: int = Field(5, ge=1, le=10)
    concept_id: Optional[UUID] = None
    content_id: Optional[UUID] = None
    assessment_id: Optional[UUID] = None
    reason: Optional[str] = None
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)


class RecommendationCreate(RecommendationBase):
    user_id: UUID


class RecommendationResponse(RecommendationBase):
    id: UUID
    user_id: UUID
    is_viewed: bool
    is_acted_on: bool
    viewed_at: Optional[datetime] = None
    acted_on_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= Skill Gap Schemas =============

class SkillGapBase(BaseModel):
    severity: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    failed_assessments: List[UUID] = Field(default_factory=list)
    weak_prerequisites: List[UUID] = Field(default_factory=list)
    suggested_content: List[UUID] = Field(default_factory=list)
    suggested_practice: List[UUID] = Field(default_factory=list)


class SkillGapCreate(SkillGapBase):
    user_id: UUID
    concept_id: UUID


class SkillGapUpdate(BaseModel):
    severity: Optional[float] = Field(None, ge=0.0, le=1.0)
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    is_addressed: Optional[bool] = None


class SkillGapResponse(SkillGapBase):
    id: UUID
    user_id: UUID
    concept_id: UUID
    is_addressed: bool
    addressed_at: Optional[datetime] = None
    identified_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============= Practice Session Schemas =============

class PracticeSessionBase(BaseModel):
    concept_id: Optional[UUID] = None
    difficulty_level: Optional[DifficultyLevel] = None
    questions_answered: int = Field(0, ge=0)
    correct_answers: int = Field(0, ge=0)
    accuracy: Optional[float] = Field(None, ge=0.0, le=1.0)
    average_time_seconds: Optional[float] = Field(None, ge=0.0)
    difficulty_adjustments: List[dict] = Field(default_factory=list)
    duration_minutes: Optional[int] = Field(None, ge=0)


class PracticeSessionCreate(PracticeSessionBase):
    user_id: UUID


class PracticeSessionResponse(PracticeSessionBase):
    id: UUID
    user_id: UUID
    started_at: datetime
    ended_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============= Request/Response Models =============

class GeneratePathRequest(BaseModel):
    """Request to generate a personalized learning path"""
    user_id: UUID
    course_id: UUID
    target_difficulty: Optional[DifficultyLevel] = None
    max_concepts: int = Field(10, ge=1, le=50)


class GetRecommendationsRequest(BaseModel):
    """Request for learning recommendations"""
    user_id: UUID
    course_id: Optional[UUID] = None
    limit: int = Field(5, ge=1, le=10)


class UpdateMasteryRequest(BaseModel):
    """Request to update mastery based on assessment"""
    user_id: UUID
    concept_id: UUID
    assessment_score: float = Field(..., ge=0.0, le=1.0)
    time_spent_minutes: int = Field(..., ge=0)


class MasteryOverview(BaseModel):
    """Overview of student mastery across concepts"""
    user_id: UUID
    course_id: UUID
    total_concepts: int
    mastered_concepts: int
    learning_concepts: int
    not_started_concepts: int
    average_mastery_score: float
    average_confidence: float
    total_time_spent_minutes: int


class SkillGapReport(BaseModel):
    """Report of identified skill gaps"""
    user_id: UUID
    course_id: Optional[UUID] = None
    total_gaps: int
    critical_gaps: int
    gaps: List[SkillGapResponse]

"""
Adaptive Learning Service - Database Models

Handles knowledge graphs, mastery tracking, and personalized learning paths.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, 
    ForeignKey, Text, JSON, Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
import uuid
import enum

Base = declarative_base()


class DifficultyLevel(str, enum.Enum):
    """Difficulty levels for content"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class MasteryLevel(str, enum.Enum):
    """Mastery levels for concepts"""
    NOT_STARTED = "not_started"
    LEARNING = "learning"
    PRACTICED = "practiced"
    MASTERED = "mastered"
    EXPERT = "expert"


class PathStatus(str, enum.Enum):
    """Learning path statuses"""
    ACTIVE = "active"
    COMPLETED = "completed"
    ABANDONED = "abandoned"
    PAUSED = "paused"


# 1. Knowledge Graph - Concept Relationships
class Concept(Base):
    """Individual learning concepts in the knowledge graph"""
    __tablename__ = "concepts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Concept details
    name = Column(String(200), nullable=False)
    description = Column(Text)
    difficulty_level = Column(SQLEnum(DifficultyLevel), default=DifficultyLevel.INTERMEDIATE)
    
    # Prerequisites (JSON array of concept IDs)
    prerequisites = Column(JSON, default=list)
    
    # Related content
    content_ids = Column(JSON, default=list)  # Links to course_content
    assessment_ids = Column(JSON, default=list)  # Links to assessments
    
    # Metadata
    tags = Column(JSON, default=list)
    estimated_time_minutes = Column(Integer)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# 2. Student Mastery - Concept Understanding
class StudentMastery(Base):
    """Tracks student mastery of individual concepts"""
    __tablename__ = "student_mastery"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    concept_id = Column(UUID(as_uuid=True), ForeignKey("concepts.id"), nullable=False, index=True)
    
    # Mastery tracking
    mastery_level = Column(SQLEnum(MasteryLevel), default=MasteryLevel.NOT_STARTED)
    mastery_score = Column(Float, default=0.0)  # 0.0 - 1.0
    confidence_score = Column(Float, default=0.0)  # 0.0 - 1.0
    
    # Practice stats
    attempts = Column(Integer, default=0)
    correct_attempts = Column(Integer, default=0)
    last_practice_date = Column(DateTime)
    
    # Time tracking
    time_spent_minutes = Column(Integer, default=0)
    
    # Timestamps
    first_encountered = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    mastered_at = Column(DateTime)


# 3. Learning Paths - Personalized Sequences
class LearningPath(Base):
    """Personalized learning paths for students"""
    __tablename__ = "learning_paths"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Path details
    name = Column(String(200), nullable=False)
    description = Column(Text)
    
    # Path configuration
    target_difficulty = Column(SQLEnum(DifficultyLevel))
    concept_sequence = Column(JSON, default=list)  # Ordered list of concept IDs
    
    # Progress
    current_position = Column(Integer, default=0)
    completed_concepts = Column(JSON, default=list)
    
    # Status
    status = Column(SQLEnum(PathStatus), default=PathStatus.ACTIVE)
    
    # Metadata
    estimated_completion_hours = Column(Float)
    actual_completion_hours = Column(Float)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)


# 4. Recommendations - Next Steps
class Recommendation(Base):
    """AI-generated learning recommendations"""
    __tablename__ = "recommendations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Recommendation details
    recommendation_type = Column(String(50))  # practice, review, new_content, assessment
    priority = Column(Integer, default=5)  # 1-10
    
    # Content
    concept_id = Column(UUID(as_uuid=True), ForeignKey("concepts.id"))
    content_id = Column(UUID(as_uuid=True))
    assessment_id = Column(UUID(as_uuid=True))
    
    # Reasoning
    reason = Column(Text)
    confidence = Column(Float)  # 0.0 - 1.0
    
    # Action tracking
    is_viewed = Column(Boolean, default=False)
    is_acted_on = Column(Boolean, default=False)
    viewed_at = Column(DateTime)
    acted_on_at = Column(DateTime)
    
    # Validity
    expires_at = Column(DateTime)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)


# 5. Skill Gaps - Areas Needing Improvement
class SkillGap(Base):
    """Identified skill gaps for students"""
    __tablename__ = "skill_gaps"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    concept_id = Column(UUID(as_uuid=True), ForeignKey("concepts.id"), nullable=False)
    
    # Gap details
    severity = Column(Float)  # 0.0 - 1.0 (how critical)
    confidence = Column(Float)  # 0.0 - 1.0 (how sure we are)
    
    # Evidence
    failed_assessments = Column(JSON, default=list)
    weak_prerequisites = Column(JSON, default=list)
    
    # Remediation
    suggested_content = Column(JSON, default=list)
    suggested_practice = Column(JSON, default=list)
    
    # Status
    is_addressed = Column(Boolean, default=False)
    addressed_at = Column(DateTime)
    
    # Timestamps
    identified_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# 6. Practice Sessions - Adaptive Practice
class PracticeSession(Base):
    """Records of adaptive practice sessions"""
    __tablename__ = "practice_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    concept_id = Column(UUID(as_uuid=True), ForeignKey("concepts.id"))
    
    # Session details
    difficulty_level = Column(SQLEnum(DifficultyLevel))
    questions_answered = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    
    # Performance
    accuracy = Column(Float)  # 0.0 - 1.0
    average_time_seconds = Column(Float)
    
    # Adaptation
    difficulty_adjustments = Column(JSON, default=list)  # Track difficulty changes
    
    # Duration
    duration_minutes = Column(Integer)
    
    # Timestamps
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime)

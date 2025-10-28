"""
AI Tutor Service - Database Models

Handles conversations, messages, RAG content, knowledge tracking, and session analytics.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, 
    ForeignKey, Text, JSON, ARRAY
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
import uuid

Base = declarative_base()


# 1. Tutor Conversations - Session Management
class TutorConversation(Base):
    """Manages tutoring conversation sessions"""
    __tablename__ = "tutor_conversations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Conversation details
    title = Column(String(200), nullable=False)
    subject = Column(String(100))
    difficulty_level = Column(String(50))  # beginner, intermediate, advanced
    
    # Teaching preferences
    use_socratic_method = Column(Boolean, default=True)
    teaching_style = Column(String(50))  # guiding, direct, exploratory
    
    # Status
    is_active = Column(Boolean, default=True)
    message_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime)


# 2. Tutor Messages - Individual Messages
class TutorMessage(Base):
    """Individual messages in tutoring conversations"""
    __tablename__ = "tutor_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("tutor_conversations.id"), nullable=False, index=True)
    
    # Message details
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    
    # Context used (for RAG)
    context_used = Column(JSON, default=list)  # List of content IDs used
    sources = Column(JSON, default=list)  # Source documents
    
    # Quality metrics
    confidence_score = Column(Float)  # AI's confidence in response (0.0-1.0)
    tokens_used = Column(Integer)
    
    # Feedback
    was_helpful = Column(Boolean)
    feedback_text = Column(Text)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# 3. Course Content - RAG Content with Embeddings
class CourseContent(Base):
    """Course content with vector embeddings for RAG"""
    __tablename__ = "course_content"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Content details
    content_type = Column(String(50), nullable=False)  # lecture, reading, video, etc.
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    
    # Vector embedding for similarity search
    embedding = Column(ARRAY(Float))  # 1536 dimensions for OpenAI embeddings
    
    # Organization
    module_id = Column(UUID(as_uuid=True))
    week_number = Column(Integer)
    topics = Column(JSON, default=list)
    
    # Metadata
    difficulty = Column(String(50))
    estimated_time_minutes = Column(Integer)
    source_url = Column(String(500))
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# 4. Student Knowledge - Knowledge State Tracking
class StudentKnowledge(Base):
    """Tracks student knowledge and understanding"""
    __tablename__ = "student_knowledge"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    topic = Column(String(200), nullable=False)
    
    # Knowledge metrics
    mastery_level = Column(Float, default=0.0)  # 0.0 - 1.0
    confidence = Column(Float, default=0.0)  # 0.0 - 1.0
    
    # Interaction stats
    questions_asked = Column(Integer, default=0)
    correct_responses = Column(Integer, default=0)
    total_attempts = Column(Integer, default=0)
    
    # Learning state
    difficulty_level = Column(String(50), default="beginner")
    needs_review = Column(Boolean, default=False)
    
    # Timestamps
    first_encountered = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    mastered_at = Column(DateTime)


# 5. Tutor Sessions - Session Analytics
class TutorSession(Base):
    """Analytics for individual tutoring sessions"""
    __tablename__ = "tutor_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("tutor_conversations.id"), nullable=False)
    
    # Session metrics
    duration_seconds = Column(Integer)
    messages_exchanged = Column(Integer, default=0)
    
    # Content covered
    topics_covered = Column(JSON, default=list)
    concepts_learned = Column(JSON, default=list)
    
    # Quality metrics
    satisfaction_score = Column(Float)  # User feedback (0.0-5.0)
    avg_confidence = Column(Float)  # Average AI confidence
    
    # Timestamps
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime)

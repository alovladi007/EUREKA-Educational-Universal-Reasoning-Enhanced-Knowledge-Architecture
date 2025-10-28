"""
Database models for Tutor-LLM Service
"""
from sqlalchemy import Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class Conversation(Base):
    """Tutoring conversation session"""
    __tablename__ = "tutor_conversations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    
    # Conversation metadata
    title = Column(String(255), nullable=True)
    subject = Column(String(100), nullable=True)
    difficulty_level = Column(String(50), default="intermediate")
    
    # Teaching preferences
    use_socratic_method = Column(Boolean, default=True)
    teaching_style = Column(String(50), default="adaptive")  # adaptive, direct, socratic
    language = Column(String(10), default="en")
    
    # State
    is_active = Column(Boolean, default=True)
    message_count = Column(Integer, default=0)
    
    # Tracking
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_activity = Column(DateTime(timezone=True), server_default=func.now())


class Message(Base):
    """Individual message in a conversation"""
    __tablename__ = "tutor_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("tutor_conversations.id"), nullable=False, index=True)
    
    # Message content
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    
    # Context used (for RAG)
    context_used = Column(JSON, nullable=True)  # IDs of content chunks used
    confidence_score = Column(Float, nullable=True)
    
    # Metadata
    tokens_used = Column(Integer, nullable=True)
    model_used = Column(String(100), nullable=True)
    
    # Feedback
    was_helpful = Column(Boolean, nullable=True)
    feedback_text = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CourseContent(Base):
    """Course content for RAG"""
    __tablename__ = "course_content"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Content
    content_type = Column(String(50), nullable=False)  # lecture, reading, video_transcript, assignment
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    
    # Metadata
    module_id = Column(UUID(as_uuid=True), nullable=True)
    week_number = Column(Integer, nullable=True)
    difficulty = Column(String(20), nullable=True)
    topics = Column(ARRAY(String), nullable=True)
    
    # Vector embedding (for similarity search)
    embedding = Column(ARRAY(Float), nullable=True)  # Will store the vector
    
    # Source
    source_url = Column(String(1000), nullable=True)
    author = Column(String(255), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class StudentKnowledge(Base):
    """Track student's knowledge state for adaptive learning"""
    __tablename__ = "student_knowledge"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Knowledge tracking
    topic = Column(String(255), nullable=False)
    mastery_level = Column(Float, default=0.0)  # 0.0 to 1.0
    confidence = Column(Float, default=0.0)  # 0.0 to 1.0
    
    # Learning metrics
    questions_asked = Column(Integer, default=0)
    correct_responses = Column(Integer, default=0)
    total_attempts = Column(Integer, default=0)
    
    # Recommendations
    difficulty_level = Column(String(20), default="intermediate")
    needs_review = Column(Boolean, default=False)
    suggested_resources = Column(JSON, nullable=True)
    
    # Timestamps
    last_practiced = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class TutorSession(Base):
    """Track tutoring sessions for analytics"""
    __tablename__ = "tutor_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("tutor_conversations.id"), nullable=False)
    
    # Session metrics
    duration_seconds = Column(Integer, nullable=True)
    messages_exchanged = Column(Integer, default=0)
    topics_covered = Column(ARRAY(String), nullable=True)
    
    # Learning outcomes
    concepts_learned = Column(ARRAY(String), nullable=True)
    questions_resolved = Column(Integer, default=0)
    satisfaction_score = Column(Integer, nullable=True)  # 1-5
    
    # Session data
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)

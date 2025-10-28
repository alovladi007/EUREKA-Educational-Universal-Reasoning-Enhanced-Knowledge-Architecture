"""
Pydantic schemas for Tutor-LLM Service
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

# ============================================================================
# Conversation Schemas
# ============================================================================

class ConversationCreate(BaseModel):
    """Create a new conversation"""
    user_id: UUID
    course_id: Optional[UUID] = None
    title: Optional[str] = None
    subject: Optional[str] = None
    difficulty_level: str = Field(default="intermediate", pattern="^(beginner|intermediate|advanced)$")
    use_socratic_method: bool = True
    teaching_style: str = Field(default="adaptive", pattern="^(adaptive|direct|socratic)$")

class ConversationResponse(BaseModel):
    """Conversation response"""
    id: UUID
    user_id: UUID
    course_id: Optional[UUID]
    title: Optional[str]
    subject: Optional[str]
    difficulty_level: str
    use_socratic_method: bool
    teaching_style: str
    is_active: bool
    message_count: int
    created_at: datetime
    last_activity: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# Message Schemas
# ============================================================================

class MessageCreate(BaseModel):
    """Send a message"""
    conversation_id: UUID
    content: str = Field(..., min_length=1, max_length=5000)

class MessageResponse(BaseModel):
    """Message response"""
    id: UUID
    conversation_id: UUID
    role: str
    content: str
    context_used: Optional[List[UUID]] = None
    confidence_score: Optional[float] = None
    tokens_used: Optional[int] = None
    model_used: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConversationWithMessages(BaseModel):
    """Conversation with all messages"""
    conversation: ConversationResponse
    messages: List[MessageResponse]


# ============================================================================
# Tutoring Request/Response
# ============================================================================

class TutorRequest(BaseModel):
    """Request for AI tutoring"""
    conversation_id: Optional[UUID] = None
    user_id: UUID
    course_id: Optional[UUID] = None
    message: str = Field(..., min_length=1, max_length=5000)
    
    # Optional preferences
    use_rag: bool = True
    use_socratic_method: Optional[bool] = None
    difficulty_level: Optional[str] = None
    include_examples: bool = True
    
    @validator('difficulty_level')
    def validate_difficulty(cls, v):
        if v and v not in ['beginner', 'intermediate', 'advanced']:
            raise ValueError('Invalid difficulty level')
        return v

class TutorResponse(BaseModel):
    """AI tutor response"""
    conversation_id: UUID
    message_id: UUID
    response: str
    sources_used: List[Dict[str, Any]] = []
    confidence: float
    follow_up_suggestions: List[str] = []
    topics_covered: List[str] = []
    
    class Config:
        from_attributes = True


# ============================================================================
# Course Content Schemas
# ============================================================================

class CourseContentCreate(BaseModel):
    """Add course content for RAG"""
    course_id: UUID
    content_type: str = Field(..., pattern="^(lecture|reading|video_transcript|assignment)$")
    title: str = Field(..., min_length=1, max_length=500)
    content: str = Field(..., min_length=1)
    module_id: Optional[UUID] = None
    week_number: Optional[int] = Field(None, ge=1, le=52)
    difficulty: Optional[str] = Field(None, pattern="^(beginner|intermediate|advanced)$")
    topics: Optional[List[str]] = None
    source_url: Optional[str] = None
    author: Optional[str] = None

class CourseContentResponse(BaseModel):
    """Course content response"""
    id: UUID
    course_id: UUID
    content_type: str
    title: str
    content: str
    topics: Optional[List[str]]
    difficulty: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# Knowledge Tracking Schemas
# ============================================================================

class StudentKnowledgeUpdate(BaseModel):
    """Update student knowledge"""
    topic: str
    was_correct: bool
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)

class StudentKnowledgeResponse(BaseModel):
    """Student knowledge state"""
    id: UUID
    user_id: UUID
    course_id: UUID
    topic: str
    mastery_level: float
    confidence: float
    questions_asked: int
    correct_responses: int
    total_attempts: int
    difficulty_level: str
    needs_review: bool
    last_practiced: Optional[datetime]
    
    class Config:
        from_attributes = True


# ============================================================================
# Analytics Schemas
# ============================================================================

class TutorAnalytics(BaseModel):
    """Analytics for tutoring sessions"""
    user_id: UUID
    total_conversations: int
    total_messages: int
    average_session_duration: float
    topics_mastered: List[str]
    topics_needing_review: List[str]
    total_time_spent_seconds: int
    average_satisfaction: Optional[float]
    knowledge_growth: Dict[str, float]  # topic -> growth percentage

class FeedbackCreate(BaseModel):
    """Submit feedback on a message"""
    message_id: UUID
    was_helpful: bool
    feedback_text: Optional[str] = None

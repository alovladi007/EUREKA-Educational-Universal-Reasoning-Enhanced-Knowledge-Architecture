"""
AI Tutor Service - Pydantic Schemas

Request/response models for API validation.
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field


# ============= Tutor Request/Response =============

class TutorRequest(BaseModel):
    """Request to ask the AI tutor a question"""
    user_id: UUID
    course_id: UUID
    message: str = Field(..., min_length=1)
    conversation_id: Optional[UUID] = None
    use_rag: bool = True
    use_socratic_method: bool = True


class SourceDocument(BaseModel):
    """Source document used in response"""
    id: UUID
    title: str
    content_type: str
    similarity: float
    excerpt: Optional[str] = None


class TutorResponse(BaseModel):
    """Response from the AI tutor"""
    conversation_id: UUID
    message_id: UUID
    response: str
    sources_used: List[SourceDocument] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)
    follow_up_suggestions: List[str] = Field(default_factory=list)
    timestamp: datetime


# ============= Conversation Schemas =============

class ConversationBase(BaseModel):
    """Base conversation schema"""
    title: str = Field(..., max_length=200)
    subject: Optional[str] = Field(None, max_length=100)
    difficulty_level: Optional[str] = None
    use_socratic_method: bool = True
    teaching_style: Optional[str] = None


class ConversationCreate(ConversationBase):
    """Create new conversation"""
    user_id: UUID
    course_id: UUID


class ConversationUpdate(BaseModel):
    """Update conversation"""
    title: Optional[str] = Field(None, max_length=200)
    is_active: Optional[bool] = None
    teaching_style: Optional[str] = None


class ConversationResponse(ConversationBase):
    """Conversation response"""
    id: UUID
    user_id: UUID
    course_id: UUID
    is_active: bool
    message_count: int
    created_at: datetime
    updated_at: datetime
    last_activity: datetime
    ended_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============= Message Schemas =============

class MessageBase(BaseModel):
    """Base message schema"""
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str


class MessageCreate(MessageBase):
    """Create new message"""
    conversation_id: UUID
    context_used: List[UUID] = Field(default_factory=list)
    confidence_score: Optional[float] = Field(None, ge=0.0, le=1.0)


class MessageResponse(MessageBase):
    """Message response"""
    id: UUID
    conversation_id: UUID
    context_used: List[UUID]
    sources: List[Dict[str, Any]]
    confidence_score: Optional[float] = None
    tokens_used: Optional[int] = None
    was_helpful: Optional[bool] = None
    feedback_text: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= Course Content Schemas =============

class CourseContentBase(BaseModel):
    """Base course content schema"""
    content_type: str = Field(..., max_length=50)
    title: str = Field(..., max_length=200)
    content: str
    module_id: Optional[UUID] = None
    week_number: Optional[int] = Field(None, ge=1, le=52)
    topics: List[str] = Field(default_factory=list)
    difficulty: Optional[str] = None
    estimated_time_minutes: Optional[int] = Field(None, ge=0)
    source_url: Optional[str] = Field(None, max_length=500)


class CourseContentCreate(CourseContentBase):
    """Create new course content"""
    course_id: UUID


class CourseContentResponse(CourseContentBase):
    """Course content response"""
    id: UUID
    course_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============= Student Knowledge Schemas =============

class StudentKnowledgeBase(BaseModel):
    """Base student knowledge schema"""
    topic: str = Field(..., max_length=200)
    mastery_level: float = Field(0.0, ge=0.0, le=1.0)
    confidence: float = Field(0.0, ge=0.0, le=1.0)
    questions_asked: int = Field(0, ge=0)
    correct_responses: int = Field(0, ge=0)
    total_attempts: int = Field(0, ge=0)
    difficulty_level: str = "beginner"
    needs_review: bool = False


class StudentKnowledgeCreate(BaseModel):
    """Create student knowledge record"""
    user_id: UUID
    course_id: UUID
    topic: str


class KnowledgeUpdateRequest(BaseModel):
    """Request to update knowledge state"""
    user_id: UUID
    course_id: UUID
    topic: str
    correct: bool
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)


class StudentKnowledgeResponse(StudentKnowledgeBase):
    """Student knowledge response"""
    id: UUID
    user_id: UUID
    course_id: UUID
    first_encountered: datetime
    last_updated: datetime
    mastered_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============= Session Analytics Schemas =============

class SessionBase(BaseModel):
    """Base session schema"""
    duration_seconds: Optional[int] = Field(None, ge=0)
    messages_exchanged: int = Field(0, ge=0)
    topics_covered: List[str] = Field(default_factory=list)
    concepts_learned: List[str] = Field(default_factory=list)
    satisfaction_score: Optional[float] = Field(None, ge=0.0, le=5.0)
    avg_confidence: Optional[float] = Field(None, ge=0.0, le=1.0)


class SessionCreate(BaseModel):
    """Create session"""
    user_id: UUID
    conversation_id: UUID


class SessionResponse(SessionBase):
    """Session response"""
    id: UUID
    user_id: UUID
    conversation_id: UUID
    started_at: datetime
    ended_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class SessionAnalytics(BaseModel):
    """Complete session analytics"""
    user_id: UUID
    total_sessions: int
    total_messages: int
    total_duration_seconds: int
    average_satisfaction: float
    topics_covered: List[str]
    concepts_learned: List[str]
    recent_sessions: List[SessionResponse]


# ============= Feedback Schemas =============

class FeedbackCreate(BaseModel):
    """Submit feedback on a tutor response"""
    message_id: UUID
    was_helpful: bool
    feedback_text: Optional[str] = None


class FeedbackResponse(BaseModel):
    """Feedback response"""
    message_id: UUID
    was_helpful: bool
    feedback_text: Optional[str] = None
    submitted_at: datetime


# ============= RAG Query Schemas =============

class RAGQueryRequest(BaseModel):
    """Request for RAG content search"""
    course_id: UUID
    query: str
    top_k: int = Field(5, ge=1, le=20)
    min_similarity: float = Field(0.7, ge=0.0, le=1.0)


class RAGSearchResult(BaseModel):
    """Individual RAG search result"""
    content_id: UUID
    title: str
    content: str
    content_type: str
    similarity: float
    topics: List[str]

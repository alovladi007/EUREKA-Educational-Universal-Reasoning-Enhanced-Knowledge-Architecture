"""
AI Tutor Service - API Endpoints (FIXED VERSION)

Provides AI-powered tutoring with RAG, conversation management, and knowledge tracking.
"""
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.core.database import get_db
from app.core.models import (
    TutorConversation, TutorMessage, CourseContent, 
    StudentKnowledge, TutorSession
)
from app.schemas import (
    # Tutor request/response
    TutorRequest, TutorResponse,
    # Conversation
    ConversationCreate, ConversationResponse, ConversationWithMessages,
    # Message
    MessageResponse,
    # Content
    CourseContentCreate, CourseContentResponse,
    # Knowledge
    StudentKnowledgeResponse, KnowledgeUpdateRequest,
    # Session
    SessionAnalytics, SessionResponse,
    # Feedback
    FeedbackCreate, FeedbackResponse
)
from app.services.ai_service import AITutoringService

router = APIRouter()
ai_service = AITutoringService()


# ============= Tutoring =============

@router.post("/ask", response_model=TutorResponse)
async def ask_tutor(
    request: TutorRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Ask the AI tutor a question.
    Uses RAG to retrieve relevant course content and generates personalized response.
    """
    # Get or create conversation
    if request.conversation_id:
        result = await db.execute(
            select(TutorConversation).where(TutorConversation.id == request.conversation_id)
        )
        conversation = result.scalar_one_or_none()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        # Create new conversation
        conversation = TutorConversation(
            user_id=request.user_id,
            course_id=request.course_id,
            title=f"Question about {request.message[:50]}...",
            use_socratic_method=request.use_socratic_method
        )
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)
    
    # Generate AI response
    tutor_response = await ai_service.generate_response(
        db=db,
        conversation_id=conversation.id,
        user_id=request.user_id,
        course_id=request.course_id,
        message=request.message,
        use_rag=request.use_rag,
        use_socratic_method=request.use_socratic_method
    )
    
    # Update conversation
    conversation.message_count += 1
    conversation.last_activity = tutor_response.timestamp
    await db.commit()
    
    return tutor_response


# ============= Conversations =============

@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conversation: ConversationCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new tutoring conversation"""
    db_conversation = TutorConversation(**conversation.model_dump())
    db.add(db_conversation)
    await db.commit()
    await db.refresh(db_conversation)
    return db_conversation


@router.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: UUID,
    include_messages: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """Get a conversation with optional message history"""
    result = await db.execute(
        select(TutorConversation).where(TutorConversation.id == conversation_id)
    )
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if include_messages:
        # Get messages
        messages_result = await db.execute(
            select(TutorMessage)
            .where(TutorMessage.conversation_id == conversation_id)
            .order_by(TutorMessage.created_at)
        )
        messages = messages_result.scalars().all()
        
        # Convert to response model with messages
        conversation_dict = {
            "id": conversation.id,
            "user_id": conversation.user_id,
            "course_id": conversation.course_id,
            "title": conversation.title,
            "subject": conversation.subject,
            "difficulty_level": conversation.difficulty_level,
            "use_socratic_method": conversation.use_socratic_method,
            "teaching_style": conversation.teaching_style,
            "is_active": conversation.is_active,
            "message_count": conversation.message_count,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at,
            "last_activity": conversation.last_activity,
            "ended_at": conversation.ended_at,
            "messages": [MessageResponse.model_validate(msg) for msg in messages]
        }
        return ConversationWithMessages(**conversation_dict)
    
    return ConversationResponse.model_validate(conversation)


@router.get("/users/{user_id}/conversations", response_model=List[ConversationResponse])
async def list_user_conversations(
    user_id: UUID,
    course_id: Optional[UUID] = None,
    active_only: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """List all conversations for a user"""
    query = select(TutorConversation).where(TutorConversation.user_id == user_id)
    
    if course_id:
        query = query.where(TutorConversation.course_id == course_id)
    
    if active_only:
        query = query.where(TutorConversation.is_active == True)
    
    result = await db.execute(query.order_by(TutorConversation.last_activity.desc()))
    return result.scalars().all()


@router.post("/conversations/{conversation_id}/end", response_model=ConversationResponse)
async def end_conversation(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """End a tutoring conversation"""
    from datetime import datetime
    
    result = await db.execute(
        select(TutorConversation).where(TutorConversation.id == conversation_id)
    )
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conversation.is_active = False
    conversation.ended_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(conversation)
    return conversation


# ============= Course Content (RAG) =============

@router.post("/content", response_model=CourseContentResponse, status_code=status.HTTP_201_CREATED)
async def add_course_content(
    content: CourseContentCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Add course content for RAG.
    Automatically generates embeddings for semantic search.
    """
    # Generate embedding
    embedding = await ai_service.generate_embedding(content.content)
    
    db_content = CourseContent(
        **content.model_dump(),
        embedding=embedding
    )
    db.add(db_content)
    await db.commit()
    await db.refresh(db_content)
    return db_content


@router.get("/content/course/{course_id}", response_model=List[CourseContentResponse])
async def list_course_content(
    course_id: UUID,
    content_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all content for a course"""
    query = select(CourseContent).where(CourseContent.course_id == course_id)
    
    if content_type:
        query = query.where(CourseContent.content_type == content_type)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/content/{content_id}", response_model=CourseContentResponse)
async def get_content(
    content_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get specific course content"""
    result = await db.execute(
        select(CourseContent).where(CourseContent.id == content_id)
    )
    content = result.scalar_one_or_none()
    
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    return content


# ============= Knowledge Tracking =============

@router.get("/knowledge/{user_id}", response_model=List[StudentKnowledgeResponse])
async def get_student_knowledge(
    user_id: UUID,
    course_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get knowledge state for a student"""
    query = select(StudentKnowledge).where(StudentKnowledge.user_id == user_id)
    
    if course_id:
        query = query.where(StudentKnowledge.course_id == course_id)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/knowledge/update", response_model=StudentKnowledgeResponse)
async def update_knowledge(
    request: KnowledgeUpdateRequest,
    db: AsyncSession = Depends(get_db)
):
    """Update student knowledge based on interaction"""
    knowledge = await ai_service.update_knowledge_state(
        db=db,
        user_id=request.user_id,
        course_id=request.course_id,
        topic=request.topic,
        correct=request.correct,
        confidence=request.confidence
    )
    return knowledge


# ============= Analytics =============

@router.get("/analytics/{user_id}", response_model=SessionAnalytics)
async def get_user_analytics(
    user_id: UUID,
    course_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get tutoring analytics for a user"""
    from datetime import datetime, timedelta
    from sqlalchemy import func
    
    # Get sessions
    query = select(TutorSession).where(TutorSession.user_id == user_id)
    
    if course_id:
        query = query.where(
            TutorSession.conversation_id.in_(
                select(TutorConversation.id).where(
                    TutorConversation.course_id == course_id
                )
            )
        )
    
    result = await db.execute(query)
    sessions = result.scalars().all()
    
    if not sessions:
        raise HTTPException(status_code=404, detail="No analytics data found")
    
    # Calculate stats
    total_sessions = len(sessions)
    total_messages = sum(s.messages_exchanged for s in sessions)
    total_duration = sum(s.duration_seconds or 0 for s in sessions)
    avg_satisfaction = sum(s.satisfaction_score or 0 for s in sessions) / total_sessions if total_sessions > 0 else 0
    
    # Get all topics covered
    all_topics = []
    for s in sessions:
        if s.topics_covered:
            all_topics.extend(s.topics_covered)
    unique_topics = list(set(all_topics))
    
    # Get concepts learned
    all_concepts = []
    for s in sessions:
        if s.concepts_learned:
            all_concepts.extend(s.concepts_learned)
    unique_concepts = list(set(all_concepts))
    
    # Convert sessions to response models
    recent_sessions = [SessionResponse.model_validate(s) for s in sessions[-5:]]
    
    return SessionAnalytics(
        user_id=user_id,
        total_sessions=total_sessions,
        total_messages=total_messages,
        total_duration_seconds=total_duration,
        average_satisfaction=avg_satisfaction,
        topics_covered=unique_topics,
        concepts_learned=unique_concepts,
        recent_sessions=recent_sessions
    )


# ============= Feedback =============

@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(
    feedback: FeedbackCreate,
    db: AsyncSession = Depends(get_db)
):
    """Submit feedback on a tutor response"""
    # Find the message
    result = await db.execute(
        select(TutorMessage).where(TutorMessage.id == feedback.message_id)
    )
    message = result.scalar_one_or_none()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Update message with feedback
    message.was_helpful = feedback.was_helpful
    message.feedback_text = feedback.feedback_text
    
    await db.commit()
    await db.refresh(message)
    
    return FeedbackResponse(
        message_id=message.id,
        was_helpful=message.was_helpful,
        feedback_text=message.feedback_text,
        submitted_at=message.updated_at
    )

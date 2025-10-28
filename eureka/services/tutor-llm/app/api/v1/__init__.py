"""
API Endpoints for Tutor-LLM Service
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID

from app.core.database import get_db
from app.schemas import *
from app import crud
from app.services.ai_service import ai_service

router = APIRouter()

# ============================================================================
# Tutoring Endpoints
# ============================================================================

@router.post("/ask", response_model=TutorResponse, status_code=status.HTTP_200_OK)
async def ask_tutor(
    request: TutorRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Ask the AI tutor a question
    
    This endpoint:
    1. Creates or retrieves a conversation
    2. Retrieves relevant course content (RAG)
    3. Generates an AI response
    4. Tracks student knowledge
    """
    # Get or create conversation
    if request.conversation_id:
        conversation = await crud.get_conversation(db, request.conversation_id)
        if not conversation:
            raise HTTPException(404, "Conversation not found")
    else:
        # Create new conversation
        conv_data = ConversationCreate(
            user_id=request.user_id,
            course_id=request.course_id,
            use_socratic_method=request.use_socratic_method or True,
            difficulty_level=request.difficulty_level or "intermediate"
        )
        conversation = await crud.create_conversation(db, conv_data)
    
    # Save user message
    user_message = await crud.create_message(
        db,
        conversation.id,
        role="user",
        content=request.message
    )
    
    # Get relevant course content (RAG)
    relevant_content = []
    sources_used = []
    
    if request.use_rag and request.course_id:
        # Get all course content
        all_content = await crud.get_course_content(db, request.course_id)
        
        if all_content:
            # Retrieve most relevant content
            content_with_scores = await ai_service.retrieve_relevant_content(
                request.message,
                all_content,
                top_k=5
            )
            relevant_content = [content for content, _ in content_with_scores]
            sources_used = [
                {
                    "id": str(content.id),
                    "title": content.title,
                    "type": content.content_type,
                    "similarity": score
                }
                for content, score in content_with_scores
            ]
    
    # Get conversation history for context
    recent_messages = await crud.get_recent_messages(
        db,
        conversation.id,
        count=10
    )
    
    # Format messages for AI
    message_history = [
        {"role": msg.role, "content": msg.content}
        for msg in recent_messages[:-1]  # Exclude the current message
    ]
    message_history.append({"role": "user", "content": request.message})
    
    # Generate AI response
    system_prompt = f"""You are an expert AI tutor helping a student learn. 
The student is at {conversation.difficulty_level} level.
Be patient, encouraging, and adapt your explanations to their level."""
    
    response_text, tokens_used = await ai_service.generate_response(
        message_history,
        system_prompt,
        relevant_content=relevant_content,
        use_socratic=conversation.use_socratic_method
    )
    
    # Calculate confidence
    confidence = await ai_service.calculate_confidence(
        request.message,
        [(c, s) for c, s in zip(relevant_content, [src["similarity"] for src in sources_used])] if sources_used else []
    )
    
    # Save AI response
    assistant_message = await crud.create_message(
        db,
        conversation.id,
        role="assistant",
        content=response_text,
        context_used=[UUID(src["id"]) for src in sources_used] if sources_used else None,
        confidence_score=confidence,
        tokens_used=tokens_used,
        model_used="gpt-4-turbo-preview"
    )
    
    # Update conversation activity
    await crud.update_conversation_activity(db, conversation.id)
    
    # Generate follow-up suggestions
    follow_ups = ai_service.generate_follow_up_suggestions(
        request.message,
        None  # Could fetch student knowledge here
    )
    
    # Extract topics (simple keyword extraction)
    topics = []  # In production, use NLP for topic extraction
    
    await db.commit()
    
    return TutorResponse(
        conversation_id=conversation.id,
        message_id=assistant_message.id,
        response=response_text,
        sources_used=sources_used,
        confidence=confidence,
        follow_up_suggestions=follow_ups[:3],
        topics_covered=topics
    )


# ============================================================================
# Conversation Endpoints
# ============================================================================

@router.post("/conversations", response_model=ConversationResponse)
async def create_new_conversation(
    data: ConversationCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new tutoring conversation"""
    conversation = await crud.create_conversation(db, data)
    await db.commit()
    return conversation

@router.get("/conversations/{conversation_id}", response_model=ConversationWithMessages)
async def get_conversation_detail(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get conversation with all messages"""
    conversation = await crud.get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(404, "Conversation not found")
    
    messages = await crud.get_conversation_messages(db, conversation_id)
    
    return ConversationWithMessages(
        conversation=conversation,
        messages=messages
    )

@router.get("/users/{user_id}/conversations", response_model=List[ConversationResponse])
async def get_user_conversations_endpoint(
    user_id: UUID,
    course_id: Optional[UUID] = None,
    is_active: Optional[bool] = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Get all conversations for a user"""
    conversations = await crud.get_user_conversations(
        db, user_id, course_id, is_active, limit
    )
    return conversations

@router.post("/conversations/{conversation_id}/end")
async def end_conversation_endpoint(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """End a conversation"""
    conversation = await crud.get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(404, "Conversation not found")
    
    await crud.end_conversation(db, conversation_id)
    await db.commit()
    
    return {"message": "Conversation ended"}


# ============================================================================
# Course Content Endpoints (for RAG)
# ============================================================================

@router.post("/content", response_model=CourseContentResponse)
async def add_course_content(
    data: CourseContentCreate,
    db: AsyncSession = Depends(get_db)
):
    """Add course content for RAG"""
    # Generate embedding for the content
    embedding = await ai_service.generate_embedding(data.content)
    
    content = await crud.create_course_content(db, data, embedding)
    await db.commit()
    
    return content

@router.get("/content/course/{course_id}", response_model=List[CourseContentResponse])
async def get_course_content_endpoint(
    course_id: UUID,
    content_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all content for a course"""
    content = await crud.get_course_content(db, course_id, content_type)
    return content


# ============================================================================
# Knowledge Tracking Endpoints
# ============================================================================

@router.get("/knowledge/{user_id}", response_model=List[StudentKnowledgeResponse])
async def get_student_knowledge(
    user_id: UUID,
    course_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get student's knowledge state"""
    knowledge = await crud.get_student_knowledge_state(db, user_id, course_id)
    return knowledge

@router.post("/knowledge/update")
async def update_knowledge(
    user_id: UUID,
    course_id: UUID,
    topic: str,
    update: StudentKnowledgeUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update student knowledge after practice"""
    knowledge = await crud.update_student_knowledge(
        db,
        user_id,
        course_id,
        topic,
        update.was_correct,
        update.confidence
    )
    await db.commit()
    
    return knowledge

@router.get("/knowledge/{user_id}/review", response_model=List[StudentKnowledgeResponse])
async def get_topics_needing_review_endpoint(
    user_id: UUID,
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get topics that need review"""
    topics = await crud.get_topics_needing_review(db, user_id, course_id)
    return topics


# ============================================================================
# Analytics Endpoints
# ============================================================================

@router.get("/analytics/{user_id}", response_model=TutorAnalytics)
async def get_tutor_analytics(
    user_id: UUID,
    days: int = 30,
    db: AsyncSession = Depends(get_db)
):
    """Get tutoring analytics for a user"""
    analytics_data = await crud.get_user_analytics(db, user_id, days)
    
    # Calculate knowledge growth
    knowledge_growth = {}
    for state in analytics_data["knowledge_states"]:
        knowledge_growth[state.topic] = state.mastery_level
    
    return TutorAnalytics(
        user_id=user_id,
        total_conversations=analytics_data["total_conversations"],
        total_messages=analytics_data["total_messages"],
        average_session_duration=0.0,  # TODO: Calculate from sessions
        topics_mastered=analytics_data["topics_mastered"],
        topics_needing_review=analytics_data["topics_needing_review"],
        total_time_spent_seconds=0,  # TODO: Calculate from sessions
        average_satisfaction=None,  # TODO: Calculate from feedback
        knowledge_growth=knowledge_growth
    )


# ============================================================================
# Feedback Endpoints
# ============================================================================

@router.post("/feedback")
async def submit_feedback(
    feedback: FeedbackCreate,
    db: AsyncSession = Depends(get_db)
):
    """Submit feedback on a tutor response"""
    await crud.add_message_feedback(
        db,
        feedback.message_id,
        feedback.was_helpful,
        feedback.feedback_text
    )
    await db.commit()
    
    return {"message": "Feedback submitted"}

"""
CRUD operations for Tutor-LLM Service
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, update, delete
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime, timedelta

from app.core.models import (
    Conversation, Message, CourseContent,
    StudentKnowledge, TutorSession
)
from app.schemas import (
    ConversationCreate, MessageCreate, CourseContentCreate,
    StudentKnowledgeUpdate
)

# ============================================================================
# Conversation CRUD
# ============================================================================

async def create_conversation(
    db: AsyncSession,
    data: ConversationCreate
) -> Conversation:
    """Create a new conversation"""
    conversation = Conversation(**data.model_dump())
    db.add(conversation)
    await db.flush()
    await db.refresh(conversation)
    return conversation

async def get_conversation(
    db: AsyncSession,
    conversation_id: UUID
) -> Optional[Conversation]:
    """Get conversation by ID"""
    result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    )
    return result.scalar_one_or_none()

async def get_user_conversations(
    db: AsyncSession,
    user_id: UUID,
    course_id: Optional[UUID] = None,
    is_active: Optional[bool] = None,
    limit: int = 50
) -> List[Conversation]:
    """Get all conversations for a user"""
    query = select(Conversation).where(Conversation.user_id == user_id)
    
    if course_id:
        query = query.where(Conversation.course_id == course_id)
    if is_active is not None:
        query = query.where(Conversation.is_active == is_active)
    
    query = query.order_by(Conversation.last_activity.desc()).limit(limit)
    
    result = await db.execute(query)
    return list(result.scalars().all())

async def update_conversation_activity(
    db: AsyncSession,
    conversation_id: UUID
) -> None:
    """Update last activity timestamp"""
    await db.execute(
        update(Conversation)
        .where(Conversation.id == conversation_id)
        .values(
            last_activity=datetime.utcnow(),
            message_count=Conversation.message_count + 1
        )
    )

async def end_conversation(
    db: AsyncSession,
    conversation_id: UUID
) -> None:
    """Mark conversation as inactive"""
    await db.execute(
        update(Conversation)
        .where(Conversation.id == conversation_id)
        .values(is_active=False)
    )


# ============================================================================
# Message CRUD
# ============================================================================

async def create_message(
    db: AsyncSession,
    conversation_id: UUID,
    role: str,
    content: str,
    context_used: Optional[List[UUID]] = None,
    confidence_score: Optional[float] = None,
    tokens_used: Optional[int] = None,
    model_used: Optional[str] = None
) -> Message:
    """Create a new message"""
    message = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
        context_used=context_used,
        confidence_score=confidence_score,
        tokens_used=tokens_used,
        model_used=model_used
    )
    db.add(message)
    await db.flush()
    await db.refresh(message)
    return message

async def get_conversation_messages(
    db: AsyncSession,
    conversation_id: UUID,
    limit: Optional[int] = None
) -> List[Message]:
    """Get all messages in a conversation"""
    query = select(Message).where(Message.conversation_id == conversation_id)
    query = query.order_by(Message.created_at.asc())
    
    if limit:
        query = query.limit(limit)
    
    result = await db.execute(query)
    return list(result.scalars().all())

async def get_recent_messages(
    db: AsyncSession,
    conversation_id: UUID,
    count: int = 10
) -> List[Message]:
    """Get recent messages for context"""
    query = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(count)
    )
    
    result = await db.execute(query)
    messages = list(result.scalars().all())
    return list(reversed(messages))  # Return in chronological order

async def add_message_feedback(
    db: AsyncSession,
    message_id: UUID,
    was_helpful: bool,
    feedback_text: Optional[str] = None
) -> None:
    """Add feedback to a message"""
    await db.execute(
        update(Message)
        .where(Message.id == message_id)
        .values(
            was_helpful=was_helpful,
            feedback_text=feedback_text
        )
    )


# ============================================================================
# Course Content CRUD
# ============================================================================

async def create_course_content(
    db: AsyncSession,
    data: CourseContentCreate,
    embedding: Optional[List[float]] = None
) -> CourseContent:
    """Create course content with embedding"""
    content = CourseContent(
        **data.model_dump(),
        embedding=embedding
    )
    db.add(content)
    await db.flush()
    await db.refresh(content)
    return content

async def get_course_content(
    db: AsyncSession,
    course_id: UUID,
    content_type: Optional[str] = None
) -> List[CourseContent]:
    """Get all content for a course"""
    query = select(CourseContent).where(CourseContent.course_id == course_id)
    
    if content_type:
        query = query.where(CourseContent.content_type == content_type)
    
    result = await db.execute(query)
    return list(result.scalars().all())

async def search_course_content(
    db: AsyncSession,
    course_id: UUID,
    topics: List[str]
) -> List[CourseContent]:
    """Search content by topics"""
    query = select(CourseContent).where(
        and_(
            CourseContent.course_id == course_id,
            CourseContent.topics.overlap(topics)
        )
    )
    
    result = await db.execute(query)
    return list(result.scalars().all())


# ============================================================================
# Student Knowledge CRUD
# ============================================================================

async def get_or_create_student_knowledge(
    db: AsyncSession,
    user_id: UUID,
    course_id: UUID,
    topic: str
) -> StudentKnowledge:
    """Get or create student knowledge entry"""
    result = await db.execute(
        select(StudentKnowledge).where(
            and_(
                StudentKnowledge.user_id == user_id,
                StudentKnowledge.course_id == course_id,
                StudentKnowledge.topic == topic
            )
        )
    )
    knowledge = result.scalar_one_or_none()
    
    if not knowledge:
        knowledge = StudentKnowledge(
            user_id=user_id,
            course_id=course_id,
            topic=topic
        )
        db.add(knowledge)
        await db.flush()
        await db.refresh(knowledge)
    
    return knowledge

async def update_student_knowledge(
    db: AsyncSession,
    user_id: UUID,
    course_id: UUID,
    topic: str,
    was_correct: bool,
    confidence: Optional[float] = None
) -> StudentKnowledge:
    """Update student knowledge based on practice"""
    knowledge = await get_or_create_student_knowledge(db, user_id, course_id, topic)
    
    # Update metrics
    knowledge.questions_asked += 1
    knowledge.total_attempts += 1
    if was_correct:
        knowledge.correct_responses += 1
    
    # Calculate new mastery level
    accuracy = knowledge.correct_responses / knowledge.total_attempts
    knowledge.mastery_level = min(accuracy * 1.2, 1.0)  # Cap at 1.0
    
    # Update confidence
    if confidence is not None:
        knowledge.confidence = confidence
    
    # Update difficulty and review status
    if knowledge.mastery_level >= 0.8:
        knowledge.difficulty_level = "advanced"
        knowledge.needs_review = False
    elif knowledge.mastery_level >= 0.5:
        knowledge.difficulty_level = "intermediate"
        knowledge.needs_review = False
    else:
        knowledge.difficulty_level = "beginner"
        knowledge.needs_review = True
    
    knowledge.last_practiced = datetime.utcnow()
    
    await db.flush()
    await db.refresh(knowledge)
    return knowledge

async def get_student_knowledge_state(
    db: AsyncSession,
    user_id: UUID,
    course_id: Optional[UUID] = None
) -> List[StudentKnowledge]:
    """Get all knowledge states for a student"""
    query = select(StudentKnowledge).where(StudentKnowledge.user_id == user_id)
    
    if course_id:
        query = query.where(StudentKnowledge.course_id == course_id)
    
    result = await db.execute(query)
    return list(result.scalars().all())

async def get_topics_needing_review(
    db: AsyncSession,
    user_id: UUID,
    course_id: UUID
) -> List[StudentKnowledge]:
    """Get topics that need review"""
    query = select(StudentKnowledge).where(
        and_(
            StudentKnowledge.user_id == user_id,
            StudentKnowledge.course_id == course_id,
            StudentKnowledge.needs_review == True
        )
    ).order_by(StudentKnowledge.mastery_level.asc())
    
    result = await db.execute(query)
    return list(result.scalars().all())


# ============================================================================
# Session CRUD
# ============================================================================

async def create_tutor_session(
    db: AsyncSession,
    user_id: UUID,
    conversation_id: UUID
) -> TutorSession:
    """Create a new tutoring session"""
    session = TutorSession(
        user_id=user_id,
        conversation_id=conversation_id
    )
    db.add(session)
    await db.flush()
    await db.refresh(session)
    return session

async def end_tutor_session(
    db: AsyncSession,
    session_id: UUID,
    topics_covered: List[str],
    concepts_learned: List[str],
    satisfaction_score: Optional[int] = None
) -> None:
    """End a tutoring session"""
    await db.execute(
        update(TutorSession)
        .where(TutorSession.id == session_id)
        .values(
            ended_at=datetime.utcnow(),
            topics_covered=topics_covered,
            concepts_learned=concepts_learned,
            satisfaction_score=satisfaction_score
        )
    )

async def get_user_analytics(
    db: AsyncSession,
    user_id: UUID,
    days: int = 30
) -> Dict[str, Any]:
    """Get analytics for a user"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Get conversation count
    conv_result = await db.execute(
        select(func.count(Conversation.id))
        .where(
            and_(
                Conversation.user_id == user_id,
                Conversation.created_at >= cutoff_date
            )
        )
    )
    total_conversations = conv_result.scalar()
    
    # Get message count
    msg_result = await db.execute(
        select(func.count(Message.id))
        .join(Conversation, Message.conversation_id == Conversation.id)
        .where(
            and_(
                Conversation.user_id == user_id,
                Message.created_at >= cutoff_date
            )
        )
    )
    total_messages = msg_result.scalar()
    
    # Get knowledge states
    knowledge_states = await get_student_knowledge_state(db, user_id)
    
    topics_mastered = [
        k.topic for k in knowledge_states if k.mastery_level >= 0.8
    ]
    topics_needing_review = [
        k.topic for k in knowledge_states if k.needs_review
    ]
    
    return {
        "total_conversations": total_conversations,
        "total_messages": total_messages,
        "topics_mastered": topics_mastered,
        "topics_needing_review": topics_needing_review,
        "knowledge_states": knowledge_states
    }

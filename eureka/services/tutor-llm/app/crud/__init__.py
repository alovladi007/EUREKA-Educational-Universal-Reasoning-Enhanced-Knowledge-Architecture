"""
AI Tutor Service - CRUD Operations (FIXED VERSION)

Database operations for tutoring service.
"""
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.core.models import (
    TutorConversation, TutorMessage, CourseContent,
    StudentKnowledge, TutorSession
)


# ============= Conversation CRUD =============

async def create_conversation(
    db: AsyncSession,
    user_id: UUID,
    course_id: UUID,
    title: str,
    **kwargs
) -> TutorConversation:
    """Create a new conversation"""
    conversation = TutorConversation(
        user_id=user_id,
        course_id=course_id,
        title=title,
        **kwargs
    )
    db.add(conversation)
    await db.commit()
    await db.refresh(conversation)
    return conversation


async def get_conversation(
    db: AsyncSession,
    conversation_id: UUID
) -> Optional[TutorConversation]:
    """Get a conversation by ID"""
    result = await db.execute(
        select(TutorConversation).where(TutorConversation.id == conversation_id)
    )
    return result.scalar_one_or_none()


async def list_user_conversations(
    db: AsyncSession,
    user_id: UUID,
    course_id: Optional[UUID] = None,
    active_only: bool = False
) -> List[TutorConversation]:
    """List conversations for a user"""
    query = select(TutorConversation).where(TutorConversation.user_id == user_id)
    
    if course_id:
        query = query.where(TutorConversation.course_id == course_id)
    
    if active_only:
        query = query.where(TutorConversation.is_active == True)
    
    result = await db.execute(query.order_by(TutorConversation.last_activity.desc()))
    return result.scalars().all()


async def update_conversation(
    db: AsyncSession,
    conversation_id: UUID,
    **kwargs
) -> TutorConversation:
    """Update a conversation"""
    conversation = await get_conversation(db, conversation_id)
    if not conversation:
        raise ValueError("Conversation not found")
    
    for key, value in kwargs.items():
        setattr(conversation, key, value)
    
    await db.commit()
    await db.refresh(conversation)
    return conversation


# ============= Message CRUD =============

async def create_message(
    db: AsyncSession,
    conversation_id: UUID,
    role: str,
    content: str,
    **kwargs
) -> TutorMessage:
    """Create a new message"""
    message = TutorMessage(
        conversation_id=conversation_id,
        role=role,
        content=content,
        **kwargs
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message


async def get_conversation_messages(
    db: AsyncSession,
    conversation_id: UUID
) -> List[TutorMessage]:
    """Get all messages in a conversation"""
    result = await db.execute(
        select(TutorMessage)
        .where(TutorMessage.conversation_id == conversation_id)
        .order_by(TutorMessage.created_at)
    )
    return result.scalars().all()


# ============= Course Content CRUD =============

async def create_content(
    db: AsyncSession,
    course_id: UUID,
    content: str,
    **kwargs
) -> CourseContent:
    """Create course content"""
    db_content = CourseContent(
        course_id=course_id,
        content=content,
        **kwargs
    )
    db.add(db_content)
    await db.commit()
    await db.refresh(db_content)
    return db_content


async def get_content(
    db: AsyncSession,
    content_id: UUID
) -> Optional[CourseContent]:
    """Get content by ID"""
    result = await db.execute(
        select(CourseContent).where(CourseContent.id == content_id)
    )
    return result.scalar_one_or_none()


async def list_course_content(
    db: AsyncSession,
    course_id: UUID,
    content_type: Optional[str] = None
) -> List[CourseContent]:
    """List content for a course"""
    query = select(CourseContent).where(CourseContent.course_id == course_id)
    
    if content_type:
        query = query.where(CourseContent.content_type == content_type)
    
    result = await db.execute(query)
    return result.scalars().all()


async def search_content_by_embedding(
    db: AsyncSession,
    course_id: UUID,
    query_embedding: List[float],
    top_k: int = 5
) -> List[CourseContent]:
    """
    Search content using vector similarity.
    Note: This requires pgvector extension in PostgreSQL.
    """
    # For now, return all content (would need pgvector for real similarity search)
    return await list_course_content(db, course_id)


# ============= Student Knowledge CRUD =============

async def create_or_update_knowledge(
    db: AsyncSession,
    user_id: UUID,
    course_id: UUID,
    topic: str,
    **kwargs
) -> StudentKnowledge:
    """Create or update knowledge state"""
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
    
    # Extract mastery_delta if present
    mastery_delta = kwargs.pop('mastery_delta', None)
    
    if not knowledge:
        # Create new knowledge record
        initial_mastery = mastery_delta if mastery_delta is not None else 0.0
        knowledge = StudentKnowledge(
            user_id=user_id,
            course_id=course_id,
            topic=topic,
            mastery_level=initial_mastery,
            **kwargs
        )
        db.add(knowledge)
    else:
        # Update existing knowledge
        if mastery_delta is not None:
            # Apply delta to mastery level (cap at 1.0)
            knowledge.mastery_level = min(1.0, max(0.0, knowledge.mastery_level + mastery_delta))
        
        # Update other fields
        for key, value in kwargs.items():
            setattr(knowledge, key, value)
        
        # Update total attempts
        knowledge.total_attempts += 1
        
        # Update last_updated timestamp
        knowledge.last_updated = datetime.utcnow()
        
        # Check if mastered
        if knowledge.mastery_level >= 0.85 and not knowledge.mastered_at:
            knowledge.mastered_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(knowledge)
    return knowledge


async def get_student_knowledge(
    db: AsyncSession,
    user_id: UUID,
    course_id: Optional[UUID] = None,
    topic: Optional[str] = None
) -> List[StudentKnowledge]:
    """Get knowledge state for a student"""
    query = select(StudentKnowledge).where(StudentKnowledge.user_id == user_id)
    
    if course_id:
        query = query.where(StudentKnowledge.course_id == course_id)
    
    if topic:
        query = query.where(StudentKnowledge.topic == topic)
    
    result = await db.execute(query)
    return result.scalars().all()


# ============= Session CRUD =============

async def create_session(
    db: AsyncSession,
    user_id: UUID,
    conversation_id: UUID,
    **kwargs
) -> TutorSession:
    """Create a tutoring session"""
    session = TutorSession(
        user_id=user_id,
        conversation_id=conversation_id,
        **kwargs
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


async def update_session(
    db: AsyncSession,
    session_id: UUID,
    **kwargs
) -> TutorSession:
    """Update a session"""
    result = await db.execute(
        select(TutorSession).where(TutorSession.id == session_id)
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise ValueError("Session not found")
    
    for key, value in kwargs.items():
        setattr(session, key, value)
    
    await db.commit()
    await db.refresh(session)
    return session


async def get_user_sessions(
    db: AsyncSession,
    user_id: UUID,
    limit: Optional[int] = None
) -> List[TutorSession]:
    """Get sessions for a user"""
    query = select(TutorSession).where(TutorSession.user_id == user_id)
    
    if limit:
        query = query.limit(limit)
    
    result = await db.execute(query.order_by(TutorSession.started_at.desc()))
    return result.scalars().all()

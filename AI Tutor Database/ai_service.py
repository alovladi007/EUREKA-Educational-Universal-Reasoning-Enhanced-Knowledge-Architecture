"""
AI Tutor Service - AI Integration

Handles RAG, embeddings, and AI model interactions.
"""
from datetime import datetime
from typing import List, Optional, Dict
from uuid import UUID
import numpy as np
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.core.config import get_settings
from app.core.models import (
    TutorConversation, TutorMessage, CourseContent, 
    StudentKnowledge, TutorSession
)
from app.schemas import TutorResponse, SourceDocument
from app.crud import (
    create_message, get_conversation_messages,
    create_or_update_knowledge
)

settings = get_settings()


class AITutoringService:
    """Core AI tutoring service with RAG capabilities"""
    
    def __init__(self):
        self.openai_client = None
        self.anthropic_client = None
        self._initialize_clients()
    
    def _initialize_clients(self):
        """Initialize AI clients if API keys are available"""
        if settings.OPENAI_API_KEY:
            try:
                from openai import AsyncOpenAI
                self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            except ImportError:
                print("OpenAI package not installed")
        
        if settings.ANTHROPIC_API_KEY:
            try:
                from anthropic import AsyncAnthropic
                self.anthropic_client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            except ImportError:
                print("Anthropic package not installed")
    
    # ============= Embedding Generation =============
    
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate vector embedding for text using OpenAI"""
        if not self.openai_client:
            # Return dummy embedding if no API key
            return [0.0] * settings.EMBEDDING_DIMENSIONS
        
        try:
            response = await self.openai_client.embeddings.create(
                model=settings.EMBEDDING_MODEL,
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return [0.0] * settings.EMBEDDING_DIMENSIONS
    
    # ============= RAG Content Retrieval =============
    
    async def retrieve_relevant_content(
        self,
        db: AsyncSession,
        course_id: UUID,
        query: str,
        top_k: int = None
    ) -> List[CourseContent]:
        """Retrieve relevant course content using RAG"""
        if top_k is None:
            top_k = settings.TOP_K_RESULTS
        
        # Generate query embedding
        query_embedding = await self.generate_embedding(query)
        
        # Get all content for the course
        result = await db.execute(
            select(CourseContent).where(CourseContent.course_id == course_id)
        )
        all_content = result.scalars().all()
        
        if not all_content:
            return []
        
        # Calculate cosine similarity for each content item
        similarities = []
        for content in all_content:
            if content.embedding:
                similarity = self._cosine_similarity(query_embedding, content.embedding)
                if similarity >= settings.SIMILARITY_THRESHOLD:
                    similarities.append((content, similarity))
        
        # Sort by similarity and return top k
        similarities.sort(key=lambda x: x[1], reverse=True)
        return [content for content, _ in similarities[:top_k]]
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        try:
            a = np.array(vec1)
            b = np.array(vec2)
            return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
        except Exception:
            return 0.0
    
    # ============= AI Response Generation =============
    
    async def generate_response(
        self,
        db: AsyncSession,
        conversation_id: UUID,
        user_id: UUID,
        course_id: UUID,
        message: str,
        use_rag: bool = True,
        use_socratic_method: bool = True
    ) -> TutorResponse:
        """Generate AI tutor response with RAG and Socratic method"""
        
        # Create user message
        user_message = await create_message(
            db=db,
            conversation_id=conversation_id,
            role="user",
            content=message
        )
        
        # Retrieve relevant content if RAG is enabled
        relevant_content = []
        context_ids = []
        if use_rag:
            relevant_content = await self.retrieve_relevant_content(
                db=db,
                course_id=course_id,
                query=message
            )
            context_ids = [content.id for content in relevant_content]
        
        # Get conversation history
        history = await get_conversation_messages(db, conversation_id)
        
        # Generate AI response
        ai_response, confidence = await self._call_ai_model(
            message=message,
            history=history,
            relevant_content=relevant_content,
            use_socratic_method=use_socratic_method
        )
        
        # Generate follow-up suggestions
        follow_ups = []
        if settings.GENERATE_FOLLOW_UPS:
            follow_ups = await self._generate_follow_ups(
                message=message,
                response=ai_response,
                context=relevant_content
            )
        
        # Create assistant message
        assistant_message = await create_message(
            db=db,
            conversation_id=conversation_id,
            role="assistant",
            content=ai_response,
            context_used=context_ids,
            confidence_score=confidence
        )
        
        # Build source documents
        sources = [
            SourceDocument(
                id=content.id,
                title=content.title,
                content_type=content.content_type,
                similarity=0.9,  # Would calculate actual similarity
                excerpt=content.content[:200] if content.content else None
            )
            for content in relevant_content
        ]
        
        return TutorResponse(
            conversation_id=conversation_id,
            message_id=assistant_message.id,
            response=ai_response,
            sources_used=sources,
            confidence=confidence,
            follow_up_suggestions=follow_ups,
            timestamp=datetime.utcnow()
        )
    
    async def _call_ai_model(
        self,
        message: str,
        history: List[TutorMessage],
        relevant_content: List[CourseContent],
        use_socratic_method: bool
    ) -> tuple[str, float]:
        """Call AI model (OpenAI or Anthropic) to generate response"""
        
        # Build context from relevant content
        context = "\n\n".join([
            f"**{content.title}**:\n{content.content[:500]}..."
            for content in relevant_content
        ])
        
        # Build system prompt
        system_prompt = self._build_system_prompt(use_socratic_method, context)
        
        # Build message history
        messages = []
        for msg in history[-10:]:  # Last 10 messages for context
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Add current message
        messages.append({
            "role": "user",
            "content": message
        })
        
        # Try OpenAI first
        if self.openai_client:
            try:
                response = await self.openai_client.chat.completions.create(
                    model=settings.OPENAI_MODEL,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        *messages
                    ],
                    temperature=settings.OPENAI_TEMPERATURE,
                    max_tokens=settings.OPENAI_MAX_TOKENS
                )
                
                content = response.choices[0].message.content
                # Calculate confidence based on finish_reason
                confidence = 0.9 if response.choices[0].finish_reason == "stop" else 0.7
                
                return content, confidence
                
            except Exception as e:
                print(f"OpenAI error: {e}")
        
        # Try Anthropic as fallback
        if self.anthropic_client:
            try:
                response = await self.anthropic_client.messages.create(
                    model=settings.ANTHROPIC_MODEL,
                    system=system_prompt,
                    messages=messages,
                    temperature=settings.ANTHROPIC_TEMPERATURE,
                    max_tokens=settings.ANTHROPIC_MAX_TOKENS
                )
                
                content = response.content[0].text
                confidence = 0.9 if response.stop_reason == "end_turn" else 0.7
                
                return content, confidence
                
            except Exception as e:
                print(f"Anthropic error: {e}")
        
        # Fallback response if no AI available
        return self._generate_fallback_response(message, relevant_content), 0.5
    
    def _build_system_prompt(self, use_socratic_method: bool, context: str) -> str:
        """Build system prompt for AI tutor"""
        base_prompt = """You are an expert AI tutor helping students learn. Your role is to:
- Provide clear, accurate explanations
- Be encouraging and supportive
- Adapt to the student's level
- Use examples and analogies
- Check for understanding
"""
        
        if use_socratic_method:
            base_prompt += """
- Use the Socratic method: guide students to discover answers through thoughtful questions
- Don't give direct answers immediately; help students think through problems
- Ask probing questions that lead to deeper understanding
"""
        
        if context:
            base_prompt += f"""

**Relevant course content for context:**
{context}

Use this content to inform your response, but explain concepts in your own words.
"""
        
        return base_prompt
    
    async def _generate_follow_ups(
        self,
        message: str,
        response: str,
        context: List[CourseContent]
    ) -> List[str]:
        """Generate follow-up question suggestions"""
        # Simple rule-based follow-ups for now
        follow_ups = [
            "Can you give me an example of how this works?",
            "What are some common mistakes to avoid?",
            "How does this relate to other concepts we've learned?"
        ]
        
        return follow_ups[:settings.MAX_FOLLOW_UP_QUESTIONS]
    
    def _generate_fallback_response(
        self, 
        message: str, 
        content: List[CourseContent]
    ) -> str:
        """Generate fallback response when AI is unavailable"""
        if content:
            return f"""I found some relevant course material about "{message}". 
            
Based on the course content, this topic covers important concepts that build on your previous learning. 

Would you like me to break down any specific aspect of this topic? I can help explain the fundamentals or work through examples together."""
        
        return f"""That's a great question about "{message}"! While I'm experiencing some technical limitations right now, I encourage you to:

1. Review the related course materials
2. Try working through some practice problems
3. Discuss with classmates or your instructor

What specific aspect would you like to focus on?"""
    
    # ============= Knowledge State Tracking =============
    
    async def update_knowledge_state(
        self,
        db: AsyncSession,
        user_id: UUID,
        course_id: UUID,
        topic: str,
        correct: bool,
        confidence: Optional[float] = None
    ) -> StudentKnowledge:
        """Update student's knowledge state based on interaction"""
        
        # Calculate new mastery level
        # Simple exponential moving average
        alpha = 0.3  # Weight for new data
        new_score = 1.0 if correct else 0.0
        
        knowledge = await create_or_update_knowledge(
            db=db,
            user_id=user_id,
            course_id=course_id,
            topic=topic,
            mastery_delta=new_score * alpha,
            confidence=confidence or 0.7
        )
        
        return knowledge

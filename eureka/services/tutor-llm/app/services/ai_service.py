"""
AI Service for LLM interactions with RAG
Supports both OpenAI and Anthropic models
"""
from typing import List, Dict, Any, Optional, Tuple
import openai
from anthropic import Anthropic
import numpy as np
from datetime import datetime

from app.core.config import settings
from app.core.models import Message, CourseContent, StudentKnowledge

class AIService:
    """AI service for tutoring with RAG"""
    
    def __init__(self):
        self.openai_client = None
        self.anthropic_client = None
        
        # Initialize clients if API keys are provided
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
            self.openai_client = openai
            
        if settings.ANTHROPIC_API_KEY:
            self.anthropic_client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    
    async def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for text using OpenAI
        
        Args:
            text: Text to embed
            
        Returns:
            List of floats representing the embedding
        """
        if not self.openai_client:
            # Return dummy embedding if no API key
            return [0.0] * settings.EMBEDDING_DIMENSION
        
        try:
            response = await self.openai_client.embeddings.create(
                model=settings.EMBEDDING_MODEL,
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return [0.0] * settings.EMBEDDING_DIMENSION
    
    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        vec1_array = np.array(vec1)
        vec2_array = np.array(vec2)
        
        dot_product = np.dot(vec1_array, vec2_array)
        norm1 = np.linalg.norm(vec1_array)
        norm2 = np.linalg.norm(vec2_array)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return float(dot_product / (norm1 * norm2))
    
    async def retrieve_relevant_content(
        self,
        query: str,
        course_contents: List[CourseContent],
        top_k: int = None
    ) -> List[Tuple[CourseContent, float]]:
        """
        Retrieve most relevant course content using RAG
        
        Args:
            query: User's question
            course_contents: Available course content
            top_k: Number of results to return
            
        Returns:
            List of (content, similarity_score) tuples
        """
        if not course_contents:
            return []
        
        top_k = top_k or settings.TOP_K_RESULTS
        
        # Generate query embedding
        query_embedding = await self.generate_embedding(query)
        
        # Calculate similarities
        similarities = []
        for content in course_contents:
            if content.embedding:
                similarity = self.cosine_similarity(query_embedding, content.embedding)
                similarities.append((content, similarity))
        
        # Sort by similarity and return top k
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:top_k]
    
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str,
        relevant_content: Optional[List[CourseContent]] = None,
        use_socratic: bool = True,
        model: str = None
    ) -> Tuple[str, int]:
        """
        Generate AI response using LLM
        
        Args:
            messages: Conversation history
            system_prompt: System instructions
            relevant_content: RAG context
            use_socratic: Use Socratic teaching method
            model: Model to use (defaults to config)
            
        Returns:
            Tuple of (response_text, tokens_used)
        """
        # Prepare context from RAG
        context = ""
        if relevant_content:
            context = "\n\n### Relevant Course Material:\n"
            for content in relevant_content:
                context += f"\n**{content.title}** ({content.content_type}):\n{content.content[:500]}...\n"
        
        # Adjust system prompt based on teaching style
        teaching_instructions = ""
        if use_socratic:
            teaching_instructions = """
Use the Socratic method: Instead of directly answering, guide the student to discover the answer through thoughtful questions. 
Ask probing questions that lead to understanding. Build on the student's knowledge.
"""
        
        full_system_prompt = f"""{system_prompt}
        
{teaching_instructions}

{context}

Remember to:
- Be encouraging and supportive
- Break complex topics into digestible parts
- Use examples when helpful
- Check for understanding
- Adapt to the student's level
"""
        
        # Use OpenAI by default (or fallback to mock response)
        if self.openai_client:
            try:
                response = await self.openai_client.chat.completions.create(
                    model=model or settings.OPENAI_MODEL,
                    messages=[
                        {"role": "system", "content": full_system_prompt},
                        *messages
                    ],
                    temperature=settings.OPENAI_TEMPERATURE,
                    max_tokens=settings.OPENAI_MAX_TOKENS,
                )
                
                return (
                    response.choices[0].message.content,
                    response.usage.total_tokens
                )
            except Exception as e:
                print(f"Error generating response: {e}")
        
        # Fallback response if no API key or error
        return self._generate_fallback_response(messages[-1]["content"]), 0
    
    def _generate_fallback_response(self, user_message: str) -> str:
        """Generate a fallback response when AI is not available"""
        responses = {
            "hello": "Hello! I'm your AI tutor. How can I help you learn today?",
            "help": "I can help you understand course material, answer questions, and guide you through problems. What would you like to learn about?",
            "explain": "I'd be happy to explain! Let me break this down into simpler concepts...",
            "default": "That's a great question! Let me help you think through this. What do you already know about this topic?"
        }
        
        message_lower = user_message.lower()
        for key, response in responses.items():
            if key in message_lower:
                return response
        
        return responses["default"]
    
    async def calculate_confidence(
        self,
        query: str,
        relevant_content: List[Tuple[CourseContent, float]]
    ) -> float:
        """
        Calculate confidence score based on available context
        
        Args:
            query: User's question
            relevant_content: Retrieved content with similarity scores
            
        Returns:
            Confidence score between 0 and 1
        """
        if not relevant_content:
            return 0.3  # Low confidence without context
        
        # Average similarity of top results
        avg_similarity = sum(score for _, score in relevant_content) / len(relevant_content)
        
        # Factor in number of relevant sources
        source_factor = min(len(relevant_content) / settings.TOP_K_RESULTS, 1.0)
        
        # Combined confidence
        confidence = (avg_similarity * 0.7) + (source_factor * 0.3)
        
        return min(max(confidence, 0.0), 1.0)
    
    def generate_follow_up_suggestions(
        self,
        topic: str,
        student_knowledge: Optional[StudentKnowledge] = None
    ) -> List[str]:
        """Generate follow-up question suggestions"""
        suggestions = [
            f"Can you explain {topic} in more depth?",
            f"What are some real-world applications of {topic}?",
            f"How does {topic} relate to other concepts we've learned?",
        ]
        
        if student_knowledge and student_knowledge.mastery_level < 0.5:
            suggestions.insert(0, f"Can you give me an example of {topic}?")
        
        return suggestions

# Singleton instance
ai_service = AIService()

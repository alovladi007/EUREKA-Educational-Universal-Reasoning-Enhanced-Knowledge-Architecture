"""
AI grading service using OpenAI GPT-4 for essay grading
"""

import os
from typing import Dict, Any, Optional
from uuid import UUID
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

from app.models import QuestionResponse, ResponseFeedback
from app.schemas import AIGradeResponse

# Initialize OpenAI client
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_AVAILABLE and OPENAI_API_KEY:
    client = OpenAI(api_key=OPENAI_API_KEY)
else:
    client = None

async def ai_grade_response(
    response_id: UUID,
    question_text: str,
    response_text: str,
    rubric: Optional[Dict[str, Any]],
    db: AsyncSession
) -> AIGradeResponse:
    """
    Grade an essay response using AI
    
    Args:
        response_id: ID of the response to grade
        question_text: The question that was asked
        response_text: The student's response
        rubric: Grading rubric (optional)
        db: Database session
        
    Returns:
        AIGradeResponse with score, feedback, and suggestions
    """
    
    if not client:
        # Fallback: return mock grading if OpenAI not available
        return await _mock_ai_grade(response_id, response_text, rubric, db)
    
    # Get response from database
    result = await db.execute(
        select(QuestionResponse).where(QuestionResponse.id == response_id)
    )
    response = result.scalar_one()
    
    max_score = response.points_possible
    
    # Build prompt
    prompt = _build_grading_prompt(question_text, response_text, rubric, max_score)
    
    try:
        # Call OpenAI API
        completion = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert educator grading student essays. Provide detailed, constructive feedback."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,  # Lower temperature for consistent grading
            max_tokens=1000
        )
        
        # Parse response
        ai_response = completion.choices[0].message.content
        grading_result = _parse_ai_response(ai_response, max_score)
        
        # Update response in database
        response.is_correct = grading_result["score"] >= (max_score * 0.7)  # 70% is passing
        response.points_earned = grading_result["score"]
        
        # Create or update feedback
        result = await db.execute(
            select(ResponseFeedback).where(ResponseFeedback.response_id == response_id)
        )
        feedback = result.scalar_one_or_none()
        
        if not feedback:
            feedback = ResponseFeedback(
                response_id=response_id,
                feedback_text=grading_result["feedback"],
                is_ai_generated=True,
                ai_model_used="gpt-4-turbo-preview",
                confidence_score=grading_result["confidence"],
                strengths=grading_result["strengths"],
                weaknesses=grading_result["weaknesses"],
                suggestions=grading_result["suggestions"]
            )
            db.add(feedback)
        else:
            feedback.feedback_text = grading_result["feedback"]
            feedback.is_ai_generated = True
            feedback.ai_model_used = "gpt-4-turbo-preview"
            feedback.confidence_score = grading_result["confidence"]
            feedback.strengths = grading_result["strengths"]
            feedback.weaknesses = grading_result["weaknesses"]
            feedback.suggestions = grading_result["suggestions"]
        
        await db.commit()
        
        return AIGradeResponse(
            response_id=response_id,
            score=grading_result["score"],
            max_score=max_score,
            feedback=grading_result["feedback"],
            strengths=grading_result["strengths"],
            weaknesses=grading_result["weaknesses"],
            suggestions=grading_result["suggestions"],
            confidence_score=grading_result["confidence"]
        )
        
    except Exception as e:
        # Fallback to mock grading on error
        print(f"AI grading error: {e}")
        return await _mock_ai_grade(response_id, response_text, rubric, db)

def _build_grading_prompt(
    question_text: str,
    response_text: str,
    rubric: Optional[Dict[str, Any]],
    max_score: float
) -> str:
    """Build the grading prompt for OpenAI"""
    
    prompt = f"""Grade the following essay response:

QUESTION:
{question_text}

STUDENT RESPONSE:
{response_text}

MAXIMUM SCORE: {max_score} points
"""
    
    if rubric:
        prompt += f"\nGRADING RUBRIC:\n{_format_rubric(rubric)}\n"
    
    prompt += """
Please provide your grading in the following format:

SCORE: [numerical score out of maximum]
CONFIDENCE: [0.0 to 1.0]
FEEDBACK: [overall feedback paragraph]
STRENGTHS: [bullet point], [bullet point], ...
WEAKNESSES: [bullet point], [bullet point], ...
SUGGESTIONS: [bullet point], [bullet point], ...

Be specific, constructive, and encouraging in your feedback.
"""
    
    return prompt

def _format_rubric(rubric: Dict[str, Any]) -> str:
    """Format rubric for prompt"""
    if not rubric:
        return "No specific rubric provided."
    
    formatted = []
    for criterion, description in rubric.items():
        formatted.append(f"- {criterion}: {description}")
    return "\n".join(formatted)

def _parse_ai_response(ai_response: str, max_score: float) -> Dict[str, Any]:
    """Parse the AI's grading response"""
    
    lines = ai_response.strip().split("\n")
    result = {
        "score": 0.0,
        "confidence": 0.8,
        "feedback": "",
        "strengths": [],
        "weaknesses": [],
        "suggestions": []
    }
    
    current_section = None
    
    for line in lines:
        line = line.strip()
        
        if line.startswith("SCORE:"):
            try:
                score_str = line.replace("SCORE:", "").strip().split()[0]
                result["score"] = min(float(score_str), max_score)
            except:
                result["score"] = max_score * 0.7
        
        elif line.startswith("CONFIDENCE:"):
            try:
                conf_str = line.replace("CONFIDENCE:", "").strip()
                result["confidence"] = float(conf_str)
            except:
                result["confidence"] = 0.8
        
        elif line.startswith("FEEDBACK:"):
            current_section = "feedback"
            result["feedback"] = line.replace("FEEDBACK:", "").strip()
        
        elif line.startswith("STRENGTHS:"):
            current_section = "strengths"
            strengths_text = line.replace("STRENGTHS:", "").strip()
            if strengths_text:
                result["strengths"] = [s.strip() for s in strengths_text.split(",")]
        
        elif line.startswith("WEAKNESSES:"):
            current_section = "weaknesses"
            weaknesses_text = line.replace("WEAKNESSES:", "").strip()
            if weaknesses_text:
                result["weaknesses"] = [w.strip() for w in weaknesses_text.split(",")]
        
        elif line.startswith("SUGGESTIONS:"):
            current_section = "suggestions"
            suggestions_text = line.replace("SUGGESTIONS:", "").strip()
            if suggestions_text:
                result["suggestions"] = [s.strip() for s in suggestions_text.split(",")]
        
        elif line and current_section:
            if current_section == "feedback":
                result["feedback"] += " " + line
            elif line.startswith("-"):
                item = line.lstrip("-").strip()
                result[current_section].append(item)
    
    return result

async def _mock_ai_grade(
    response_id: UUID,
    response_text: str,
    rubric: Optional[Dict[str, Any]],
    db: AsyncSession
) -> AIGradeResponse:
    """
    Mock AI grading for when OpenAI is not available
    """
    
    # Get response from database
    result = await db.execute(
        select(QuestionResponse).where(QuestionResponse.id == response_id)
    )
    response = result.scalar_one()
    
    max_score = response.points_possible
    
    # Simple mock grading based on length
    word_count = len(response_text.split())
    score = min(max_score, max_score * (word_count / 200))  # Assume 200 words is full credit
    
    strengths = ["Clear attempt at answering the question"]
    weaknesses = []
    suggestions = []
    
    if word_count < 50:
        weaknesses.append("Response is too brief")
        suggestions.append("Provide more detailed explanation")
    
    if word_count < 100:
        weaknesses.append("Could use more supporting details")
        suggestions.append("Add specific examples to support your points")
    
    feedback = f"Your response demonstrates {'good' if score >= max_score * 0.7 else 'partial'} understanding of the topic. "
    feedback += " ".join(strengths) + ". " if strengths else ""
    feedback += "Consider: " + ", ".join(suggestions) + "." if suggestions else ""
    
    # Update response
    response.points_earned = score
    response.is_correct = score >= (max_score * 0.7)
    
    # Create feedback
    result = await db.execute(
        select(ResponseFeedback).where(ResponseFeedback.response_id == response_id)
    )
    feedback_record = result.scalar_one_or_none()
    
    if not feedback_record:
        feedback_record = ResponseFeedback(
            response_id=response_id,
            feedback_text=feedback,
            is_ai_generated=False,  # Mock grading
            ai_model_used="mock_grader",
            confidence_score=0.6,
            strengths=strengths,
            weaknesses=weaknesses,
            suggestions=suggestions
        )
        db.add(feedback_record)
    
    await db.commit()
    
    return AIGradeResponse(
        response_id=response_id,
        score=score,
        max_score=max_score,
        feedback=feedback,
        strengths=strengths,
        weaknesses=weaknesses,
        suggestions=suggestions,
        confidence_score=0.6
    )

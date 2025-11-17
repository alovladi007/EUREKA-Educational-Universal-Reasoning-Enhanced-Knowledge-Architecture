"""
AI Content Generation API endpoints
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional

from app.services.ai_orchestrator import AIOrchestrator, ExplanationRequest

router = APIRouter()
orchestrator = AIOrchestrator()


class GenerateQuestionsRequest(BaseModel):
    """Request to generate questions"""
    exam: str
    topic: str
    difficulty: str
    count: int = 5


class ExplanationAPIRequest(BaseModel):
    """API request for explanation"""
    question: str
    choices: List[str]
    correct_answer: int
    user_answer: int
    topic: str


class StudyPlanRequest(BaseModel):
    """Request for AI-generated study plan"""
    user_id: str
    exam_date: str
    target_score: int
    current_score: int
    weak_areas: List[str]
    available_hours: int


@router.post("/generate/questions")
async def generate_questions(request: GenerateQuestionsRequest):
    """
    Generate exam questions using AI

    Uses LLMs to create high-quality questions with:
    - Realistic stems and distractors
    - Detailed explanations
    - IRT parameters
    - Cognitive level classifications

    Falls back to template generation if API keys not configured
    """
    try:
        questions = await orchestrator.generate_questions(
            exam=request.exam,
            topic=request.topic,
            difficulty=request.difficulty,
            count=request.count
        )

        return {
            'count': len(questions),
            'questions': [
                {
                    'stem': q.stem,
                    'choices': q.choices,
                    'correct_index': q.correct_index,
                    'explanation': q.explanation,
                    'difficulty': q.difficulty,
                    'irt_parameters': {
                        'a': q.irt_params['a'],
                        'b': q.irt_params['b'],
                        'c': q.irt_params['c']
                    },
                    'topics': q.topics,
                    'cognitive_level': q.cognitive_level
                }
                for q in questions
            ],
            'generation_method': 'AI' if orchestrator.openai_client or orchestrator.anthropic_client else 'Template'
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")


@router.post("/explain")
async def get_explanation(request: ExplanationAPIRequest):
    """
    Get personalized explanation for a question

    Provides:
    - Why the correct answer is right
    - Why incorrect answers are wrong
    - Common mistakes
    - Key concepts
    - Study tips

    Uses AI when available, falls back to templates
    """
    try:
        explanation_request = ExplanationRequest(
            question=request.question,
            choices=request.choices,
            correct_answer=request.correct_answer,
            user_answer=request.user_answer,
            topic=request.topic
        )

        result = await orchestrator.generate_explanation(explanation_request)

        return {
            'explanation': result['explanation'],
            'concepts_covered': result['conceptsCovered'],
            'common_mistakes': result['commonMistakes'],
            'related_topics': result['relatedTopics'],
            'study_tips': result['studyTips'],
            'is_correct': request.user_answer == request.correct_answer
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation generation failed: {str(e)}")


@router.post("/study-plan/generate")
async def generate_ai_study_plan(request: StudyPlanRequest):
    """
    Generate AI-powered study plan

    Creates personalized plan using:
    - Current performance analysis
    - Time until exam
    - Weak areas identification
    - Learning rate estimation

    Returns weekly breakdown with focus areas and milestones
    """
    try:
        plan = await orchestrator.generate_study_plan(
            user_id=request.user_id,
            exam_date=request.exam_date,
            target_score=request.target_score,
            current_score=request.current_score,
            weak_areas=request.weak_areas,
            available_hours=request.available_hours
        )

        return {
            'study_plan': plan,
            'generation_method': 'AI' if orchestrator.anthropic_client else 'Algorithmic'
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Study plan generation failed: {str(e)}")


@router.post("/analyze/performance")
async def analyze_performance(responses: List[Dict]):
    """
    Analyze student performance using AI

    Analyzes response patterns to identify:
    - Strengths and weaknesses
    - Learning trends
    - Optimal study strategies
    - Score predictions

    Returns actionable recommendations
    """
    try:
        if not responses:
            raise HTTPException(status_code=400, detail="No responses provided")

        analysis = await orchestrator.analyze_performance(responses)

        return {
            'strengths': analysis['strengths'],
            'weaknesses': analysis['weaknesses'],
            'recommendations': analysis['recommendations'],
            'predicted_score': analysis['predicted_score'],
            'confidence': round(analysis['confidence'], 3),
            'total_responses_analyzed': len(responses)
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Performance analysis failed: {str(e)}")


@router.get("/capabilities")
async def get_ai_capabilities():
    """
    Get available AI capabilities

    Returns information about:
    - Available AI models
    - Supported features
    - API key status
    """
    return {
        'openai_available': orchestrator.openai_client is not None,
        'anthropic_available': orchestrator.anthropic_client is not None,
        'features': {
            'question_generation': True,
            'explanations': True,
            'study_plans': True,
            'performance_analysis': True
        },
        'fallback_mode': not (orchestrator.openai_client or orchestrator.anthropic_client),
        'note': 'Configure OPENAI_API_KEY or ANTHROPIC_API_KEY for full AI features'
    }


@router.post("/question/enhance")
async def enhance_question(
    question_id: str,
    enhancement_type: str = "explanation"
):
    """
    Enhance existing question with AI

    Enhancement types:
    - explanation: Generate detailed explanation
    - distractors: Improve answer choices
    - difficulty: Calibrate difficulty level
    - hints: Generate progressive hints
    """
    # Placeholder for question enhancement
    return {
        'question_id': question_id,
        'enhancement_type': enhancement_type,
        'status': 'requires_implementation',
        'note': 'Question enhancement requires database integration'
    }

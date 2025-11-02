"""
Research API endpoints
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import logging

from app.core.config import settings
from app.agents.research_crew import ResearchCrew

router = APIRouter()
logger = logging.getLogger(__name__)

# Global research crew instance
research_crew = ResearchCrew(llm_model=settings.DEFAULT_LLM_MODEL)


# ===== Request/Response Models =====

class ResearchWorkflowRequest(BaseModel):
    """Research workflow request"""
    topic: str = Field(..., min_length=5, max_length=500)
    keywords: List[str] = Field(..., min_items=1, max_items=10)
    num_papers: int = Field(default=10, ge=1, le=50)
    learner_id: Optional[str] = None


class PaperAnalysisRequest(BaseModel):
    """Single paper analysis request"""
    arxiv_id: str = Field(..., pattern=r"^\d{4}\.\d{4,5}(v\d+)?$")
    learner_id: Optional[str] = None


class HypothesisGenerationRequest(BaseModel):
    """Hypothesis generation request"""
    research_area: str
    context: str
    num_hypotheses: int = Field(default=5, ge=1, le=10)


# ===== Endpoints =====

@router.post("/workflow", response_model=Dict)
async def run_research_workflow(request: ResearchWorkflowRequest):
    """
    Run full research workflow

    Multi-agent crew performs:
    1. Literature review
    2. Hypothesis generation
    3. Experiment design
    4. Analysis planning

    This is an educational simulation for learners to
    understand the research process.
    """
    logger.info(
        f"Research workflow request",
        extra={
            'topic': request.topic,
            'keywords': request.keywords,
            'learner_id': request.learner_id
        }
    )

    # Check API key availability
    if not settings.OPENAI_API_KEY and not settings.ANTHROPIC_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="LLM API keys not configured. Research workflows unavailable."
        )

    try:
        result = research_crew.research_workflow(
            topic=request.topic,
            keywords=request.keywords,
            num_papers=request.num_papers
        )

        if result['status'] == 'error':
            raise HTTPException(status_code=500, detail=result['error'])

        return result

    except Exception as e:
        logger.error(f"Workflow execution failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-paper", response_model=Dict)
async def analyze_paper(request: PaperAnalysisRequest):
    """
    Analyze a single academic paper

    Extracts:
    - Key contributions
    - Methodology
    - Results
    - Limitations
    - Future directions
    """
    logger.info(f"Paper analysis request: {request.arxiv_id}")

    if not settings.OPENAI_API_KEY and not settings.ANTHROPIC_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="LLM API keys not configured"
        )

    try:
        result = research_crew.paper_analysis_workflow(request.arxiv_id)

        if result['status'] == 'error':
            raise HTTPException(status_code=500, detail=result['error'])

        return result

    except Exception as e:
        logger.error(f"Paper analysis failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search-papers", response_model=Dict)
async def search_papers(
    query: str,
    max_results: int = 10,
    sort_by: str = "relevance"  # relevance, lastUpdatedDate, submittedDate
):
    """
    Search arXiv for papers

    Returns:
        List of papers with title, authors, abstract, arxiv_id
    """
    logger.info(f"Paper search: {query}")

    # In production: Use arxiv API
    # For now: Mock response
    mock_results = {
        'query': query,
        'results': [
            {
                'arxiv_id': '2301.12345',
                'title': 'Deep Learning for Educational Assessment',
                'authors': ['Smith, J.', 'Doe, A.'],
                'abstract': 'We propose a novel approach...',
                'published': '2023-01-15',
                'categories': ['cs.LG', 'cs.AI']
            }
        ],
        'total': 1
    }

    return mock_results


@router.post("/generate-hypotheses", response_model=Dict)
async def generate_hypotheses(request: HypothesisGenerationRequest):
    """
    Generate research hypotheses

    Given a research area and context, generate testable hypotheses
    """
    logger.info(f"Hypothesis generation: {request.research_area}")

    # In production: Use hypothesis generator agent
    mock_hypotheses = [
        {
            'id': 1,
            'hypothesis': 'Spaced repetition improves long-term retention more than massed practice',
            'testability': 'high',
            'novelty': 'medium',
            'suggested_method': 'Randomized controlled trial with 2x2 design'
        }
    ]

    return {
        'research_area': request.research_area,
        'hypotheses': mock_hypotheses,
        'total': len(mock_hypotheses)
    }


@router.get("/research-trends", response_model=Dict)
async def get_research_trends(
    field: str = "education",
    time_window_years: int = 5
):
    """
    Analyze research trends in a field

    Returns:
        - Top keywords
        - Emerging topics
        - Citation patterns
        - Collaboration networks
    """
    logger.info(f"Research trends analysis: {field}")

    # In production: Analyze paper corpus
    mock_trends = {
        'field': field,
        'top_keywords': [
            {'keyword': 'adaptive learning', 'count': 1250, 'trend': 'rising'},
            {'keyword': 'metacognition', 'count': 890, 'trend': 'stable'},
            {'keyword': 'personalization', 'count': 760, 'trend': 'rising'}
        ],
        'emerging_topics': [
            {'topic': 'AI tutors', 'growth_rate': 85.3},
            {'topic': 'learning analytics', 'growth_rate': 62.1}
        ],
        'time_window_years': time_window_years
    }

    return mock_trends

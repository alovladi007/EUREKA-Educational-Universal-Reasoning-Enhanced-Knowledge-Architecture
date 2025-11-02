"""
Content management API endpoints
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import logging

from app.core.config import settings
from app.core.compliance import compliance

router = APIRouter()
logger = logging.getLogger(__name__)


# ===== Request/Response Models =====

class ContentSubmissionRequest(BaseModel):
    """Content submission request"""
    creator_id: str = Field(..., min_length=1, max_length=255)
    title: str = Field(..., min_length=1, max_length=500)
    description: str = Field(..., min_length=10, max_length=5000)
    content_type: str = Field(..., pattern="^(scorm|xapi|h5p|video|pdf|interactive)$")
    price_usd: float = Field(..., ge=0.0, le=9999.99)
    tags: Optional[List[str]] = None
    difficulty_level: Optional[str] = Field(None, pattern="^(beginner|intermediate|advanced)$")
    duration_minutes: Optional[int] = Field(None, ge=1, le=10000)


class ContentResponse(BaseModel):
    """Content response"""
    id: int
    creator_id: str
    title: str
    description: str
    content_type: str
    status: str
    price_usd: float
    is_free: bool
    views_count: int
    purchases_count: int
    rating_avg: Optional[float]
    created_at: datetime
    published_at: Optional[datetime]


class ContentListResponse(BaseModel):
    """Content list response"""
    items: List[ContentResponse]
    total: int
    page: int
    page_size: int


class ComplianceCheckResponse(BaseModel):
    """Compliance check result"""
    is_safe: bool
    violations: List[str]
    risk_score: float
    sanitized_title: str
    sanitized_description: str


# ===== Endpoints =====

@router.post("/submit", response_model=dict)
async def submit_content(request: ContentSubmissionRequest):
    """
    Submit new content to marketplace

    Steps:
    1. Validate compliance (PII, profanity, prohibited content)
    2. Validate pricing
    3. Create content record (draft status)
    4. Return content ID and upload instructions
    """
    logger.info(f"Content submission from creator: {request.creator_id}")

    # Compliance check
    compliance_result = compliance.validate_content_submission(
        title=request.title,
        description=request.description
    )

    if not compliance_result['is_safe']:
        logger.warning(
            f"Content failed compliance: {compliance_result['violations']}",
            extra={'creator_id': request.creator_id}
        )
        raise HTTPException(
            status_code=400,
            detail={
                'error': 'Content failed compliance check',
                'violations': compliance_result['violations'],
                'risk_score': compliance_result['risk_score']
            }
        )

    # Pricing validation
    pricing_result = compliance.validate_pricing(
        price_usd=request.price_usd,
        min_price=settings.MIN_PRICE_USD if request.price_usd > 0 else 0.0,
        max_price=settings.MAX_PRICE_USD
    )

    if not pricing_result['is_valid']:
        raise HTTPException(status_code=400, detail=pricing_result['error'])

    # In production: Create database record
    # For now: Mock response
    content_id = 12345  # Mock ID

    logger.info(
        f"Content submitted successfully",
        extra={
            'content_id': content_id,
            'creator_id': request.creator_id,
            'compliance_score': compliance_result['risk_score']
        }
    )

    return {
        'content_id': content_id,
        'status': 'draft',
        'sanitized_title': compliance_result['sanitized_title'],
        'sanitized_description': compliance_result['sanitized_description'],
        'upload_url': f"/api/v1/content/{content_id}/upload",
        'next_steps': [
            'Upload content file to provided URL',
            'Submit for review when ready',
            'Wait for approval (typically 24-48 hours)'
        ]
    }


@router.get("/check-compliance", response_model=ComplianceCheckResponse)
async def check_content_compliance(title: str, description: str):
    """
    Pre-check content compliance before submission
    Helps creators avoid rejected submissions
    """
    result = compliance.validate_content_submission(title, description)

    return ComplianceCheckResponse(
        is_safe=result['is_safe'],
        violations=result['violations'],
        risk_score=result['risk_score'],
        sanitized_title=result['sanitized_title'],
        sanitized_description=result['sanitized_description']
    )


@router.get("/browse", response_model=dict)
async def browse_content(
    page: int = 1,
    page_size: int = 20,
    content_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    difficulty: Optional[str] = None,
    sort_by: str = "popular"  # popular, recent, price_low, price_high
):
    """
    Browse marketplace content

    Filters:
    - content_type: scorm, xapi, h5p, video, pdf
    - price range
    - difficulty: beginner, intermediate, advanced
    - sort: popular (by purchases), recent, price
    """
    logger.info(
        f"Browse request",
        extra={
            'page': page,
            'content_type': content_type,
            'sort_by': sort_by
        }
    )

    # In production: Query database with filters and pagination
    # For now: Mock response
    mock_items = [
        {
            'id': 1,
            'creator_id': 'creator_001',
            'title': 'Introduction to Python Programming',
            'description': 'Learn Python basics through interactive exercises',
            'content_type': 'interactive',
            'status': 'published',
            'price_usd': 29.99,
            'is_free': False,
            'views_count': 1250,
            'purchases_count': 87,
            'rating_avg': 4.7,
            'created_at': datetime.utcnow(),
            'published_at': datetime.utcnow()
        }
    ]

    return {
        'items': mock_items,
        'total': 1,
        'page': page,
        'page_size': page_size,
        'has_more': False
    }


@router.get("/{content_id}", response_model=dict)
async def get_content_details(content_id: int):
    """Get detailed content information"""
    # In production: Query database
    # For now: Mock response

    return {
        'id': content_id,
        'creator_id': 'creator_001',
        'title': 'Introduction to Python Programming',
        'description': 'Learn Python basics through interactive exercises',
        'content_type': 'interactive',
        'status': 'published',
        'price_usd': 29.99,
        'is_free': False,
        'views_count': 1250,
        'purchases_count': 87,
        'rating_avg': 4.7,
        'tags': ['python', 'programming', 'beginner'],
        'difficulty_level': 'beginner',
        'duration_minutes': 180,
        'created_at': datetime.utcnow(),
        'published_at': datetime.utcnow(),
        'creator_profile': {
            'display_name': 'Expert Educator',
            'total_content_count': 12,
            'avg_rating': 4.8
        }
    }


@router.post("/{content_id}/purchase", response_model=dict)
async def purchase_content(content_id: int, learner_id: str):
    """
    Initiate content purchase

    Steps:
    1. Validate content exists and is published
    2. Check if already purchased
    3. Create Stripe payment intent
    4. Return client secret for frontend
    """
    logger.info(f"Purchase request", extra={'content_id': content_id, 'learner_id': learner_id})

    # In production:
    # - Query content from DB
    # - Check purchase history
    # - Create Stripe payment intent
    # - Store transaction record

    return {
        'transaction_id': 67890,
        'amount_usd': 29.99,
        'stripe_client_secret': 'pi_mock_secret_12345',
        'status': 'pending',
        'message': 'Complete payment on frontend'
    }


@router.get("/creator/{creator_id}/dashboard", response_model=dict)
async def get_creator_dashboard(creator_id: str):
    """Get creator dashboard stats"""
    # In production: Aggregate from database

    return {
        'creator_id': creator_id,
        'total_content': 5,
        'total_revenue_usd': 2450.75,
        'total_learners': 123,
        'avg_rating': 4.6,
        'pending_payout_usd': 315.50,
        'recent_sales': [
            {'content_id': 1, 'amount_usd': 29.99, 'date': datetime.utcnow()}
        ]
    }

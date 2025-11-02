"""
VC (Venture Capital) Simulation API
Gamified investment simulation for learners
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import logging

from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


# ===== Request/Response Models =====

class VCInvestmentRequest(BaseModel):
    """VC investment request"""
    vc_learner_id: str = Field(..., min_length=1)
    content_id: int = Field(..., gt=0)
    investment_amount_usd: float = Field(..., gt=0, le=50000)
    equity_percentage: float = Field(..., gt=0, le=100)


class VCInvestmentResponse(BaseModel):
    """VC investment response"""
    investment_id: int
    content_id: int
    investment_amount_usd: float
    equity_percentage: float
    status: str
    created_at: datetime


class VCPortfolioItem(BaseModel):
    """Portfolio investment item"""
    investment_id: int
    content_id: int
    content_title: str
    investment_amount_usd: float
    equity_percentage: float
    total_revenue_generated_usd: float
    roi_usd: float
    roi_percentage: float
    status: str


class VCPortfolioResponse(BaseModel):
    """VC portfolio overview"""
    vc_learner_id: str
    total_capital_usd: float
    invested_capital_usd: float
    available_capital_usd: float
    total_roi_usd: float
    avg_roi_percentage: float
    active_investments: int
    investments: List[VCPortfolioItem]


class VCInvestmentOpportunity(BaseModel):
    """Investment opportunity for browsing"""
    content_id: int
    title: str
    description: str
    creator_id: str
    asking_amount_usd: float
    equity_offered: float
    current_traction: dict
    risk_score: float
    potential_roi_estimate: float


# ===== Endpoints =====

@router.post("/invest", response_model=VCInvestmentResponse)
async def make_investment(request: VCInvestmentRequest):
    """
    Make VC investment in content

    Learners can invest virtual capital in content and earn returns
    based on future sales. Gamified VC simulation.

    Business Logic:
    1. Check available capital
    2. Validate investment amount (max per content)
    3. Calculate equity percentage
    4. Create investment record
    5. Track ROI as content generates revenue
    """
    logger.info(
        f"VC investment request",
        extra={
            'learner_id': request.vc_learner_id,
            'content_id': request.content_id,
            'amount': request.investment_amount_usd
        }
    )

    # Validate investment amount
    if request.investment_amount_usd > settings.VC_MAX_INVESTMENT_PER_CONTENT:
        raise HTTPException(
            status_code=400,
            detail=f"Investment exceeds maximum of ${settings.VC_MAX_INVESTMENT_PER_CONTENT}"
        )

    # Validate equity percentage
    if request.equity_percentage < 1.0 or request.equity_percentage > 50.0:
        raise HTTPException(
            status_code=400,
            detail="Equity percentage must be between 1% and 50%"
        )

    # In production:
    # - Check learner's available capital
    # - Validate content exists and is investable
    # - Create investment record
    # - Deduct capital from learner's account

    investment_id = 54321  # Mock ID

    logger.info(
        f"Investment created",
        extra={
            'investment_id': investment_id,
            'learner_id': request.vc_learner_id
        }
    )

    return VCInvestmentResponse(
        investment_id=investment_id,
        content_id=request.content_id,
        investment_amount_usd=request.investment_amount_usd,
        equity_percentage=request.equity_percentage,
        status='active',
        created_at=datetime.utcnow()
    )


@router.get("/portfolio/{vc_learner_id}", response_model=VCPortfolioResponse)
async def get_portfolio(vc_learner_id: str):
    """
    Get VC portfolio for learner
    Shows all investments, ROI, and performance
    """
    logger.info(f"Portfolio request for: {vc_learner_id}")

    # In production: Query from database and aggregate
    mock_investments = [
        VCPortfolioItem(
            investment_id=1,
            content_id=101,
            content_title="Advanced Data Structures",
            investment_amount_usd=5000.0,
            equity_percentage=10.0,
            total_revenue_generated_usd=12000.0,
            roi_usd=1200.0,
            roi_percentage=24.0,
            status='active'
        ),
        VCPortfolioItem(
            investment_id=2,
            content_id=102,
            content_title="Machine Learning Fundamentals",
            investment_amount_usd=10000.0,
            equity_percentage=15.0,
            total_revenue_generated_usd=8000.0,
            roi_usd=1200.0,
            roi_percentage=12.0,
            status='active'
        )
    ]

    total_invested = sum(inv.investment_amount_usd for inv in mock_investments)
    total_roi = sum(inv.roi_usd for inv in mock_investments)
    avg_roi = (total_roi / total_invested * 100) if total_invested > 0 else 0.0

    return VCPortfolioResponse(
        vc_learner_id=vc_learner_id,
        total_capital_usd=settings.VC_STARTING_CAPITAL,
        invested_capital_usd=total_invested,
        available_capital_usd=settings.VC_STARTING_CAPITAL - total_invested,
        total_roi_usd=total_roi,
        avg_roi_percentage=avg_roi,
        active_investments=len(mock_investments),
        investments=mock_investments
    )


@router.get("/opportunities", response_model=List[VCInvestmentOpportunity])
async def browse_investment_opportunities(
    min_roi: Optional[float] = None,
    max_risk: Optional[float] = None,
    limit: int = 20
):
    """
    Browse investment opportunities

    Filters:
    - min_roi: Minimum estimated ROI percentage
    - max_risk: Maximum risk score (0.0-1.0)
    - limit: Number of results

    Returns content looking for investment
    """
    logger.info(f"Browse opportunities: min_roi={min_roi}, max_risk={max_risk}")

    # In production: Query database with filters
    mock_opportunities = [
        VCInvestmentOpportunity(
            content_id=201,
            title="Quantum Computing Basics",
            description="Comprehensive introduction to quantum computing concepts",
            creator_id="creator_042",
            asking_amount_usd=25000.0,
            equity_offered=20.0,
            current_traction={
                'views': 450,
                'demo_signups': 85,
                'projected_sales_month1': 50
            },
            risk_score=0.35,
            potential_roi_estimate=45.0
        ),
        VCInvestmentOpportunity(
            content_id=202,
            title="Full Stack Web Development Bootcamp",
            description="12-week intensive coding bootcamp",
            creator_id="creator_089",
            asking_amount_usd=50000.0,
            equity_offered=15.0,
            current_traction={
                'views': 2100,
                'demo_signups': 320,
                'projected_sales_month1': 180
            },
            risk_score=0.18,
            potential_roi_estimate=65.0
        )
    ]

    # Apply filters
    filtered = mock_opportunities
    if min_roi is not None:
        filtered = [opp for opp in filtered if opp.potential_roi_estimate >= min_roi]
    if max_risk is not None:
        filtered = [opp for opp in filtered if opp.risk_score <= max_risk]

    return filtered[:limit]


@router.get("/leaderboard", response_model=dict)
async def get_vc_leaderboard(limit: int = 10):
    """
    Get VC leaderboard
    Top investors by ROI, best performing portfolios
    """
    # In production: Aggregate from database
    mock_leaderboard = [
        {
            'rank': 1,
            'learner_id': 'vc_expert_001',
            'display_name': 'Warren Buffet Jr.',
            'total_investments': 15,
            'total_roi_usd': 45000.0,
            'avg_roi_percentage': 78.5,
            'best_investment': 'AI Ethics Course (250% ROI)'
        },
        {
            'rank': 2,
            'learner_id': 'vc_expert_002',
            'display_name': 'Tech Investor Pro',
            'total_investments': 22,
            'total_roi_usd': 38000.0,
            'avg_roi_percentage': 62.3,
            'best_investment': 'Blockchain Fundamentals (180% ROI)'
        }
    ]

    return {
        'leaderboard': mock_leaderboard[:limit],
        'total_vcs': 250,
        'total_invested_usd': 5000000.0,
        'total_roi_generated_usd': 1250000.0
    }


@router.post("/{investment_id}/exit", response_model=dict)
async def exit_investment(investment_id: int, vc_learner_id: str):
    """
    Exit an investment
    Learner sells their equity stake back to creator or marketplace
    """
    logger.info(f"Exit investment: {investment_id} by {vc_learner_id}")

    # In production:
    # - Validate ownership
    # - Calculate final ROI
    # - Return capital + gains to learner
    # - Update investment status to 'exited'

    return {
        'investment_id': investment_id,
        'status': 'exited',
        'final_roi_usd': 1500.0,
        'final_roi_percentage': 30.0,
        'capital_returned_usd': 6500.0,
        'exited_at': datetime.utcnow()
    }

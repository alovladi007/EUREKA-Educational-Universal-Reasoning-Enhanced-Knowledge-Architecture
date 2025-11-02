"""
Database models for marketplace content
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import enum

Base = declarative_base()


class ContentType(str, enum.Enum):
    """Content type enumeration"""
    SCORM = "scorm"
    XAPI = "xapi"
    H5P = "h5p"
    VIDEO = "video"
    PDF = "pdf"
    INTERACTIVE = "interactive"


class ContentStatus(str, enum.Enum):
    """Content status enumeration"""
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class Content(Base):
    """Marketplace content item"""
    __tablename__ = "contents"

    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(String(255), nullable=False, index=True)

    # Content metadata
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    content_type = Column(Enum(ContentType), nullable=False)
    status = Column(Enum(ContentStatus), default=ContentStatus.DRAFT, nullable=False, index=True)

    # Pricing
    price_usd = Column(Float, nullable=False)
    is_free = Column(Boolean, default=False)

    # Storage
    storage_path = Column(String(1000), nullable=True)
    file_size_bytes = Column(Integer, nullable=True)

    # Metadata
    tags = Column(Text, nullable=True)  # JSON array as text
    difficulty_level = Column(String(50), nullable=True)  # beginner, intermediate, advanced
    duration_minutes = Column(Integer, nullable=True)

    # Analytics
    views_count = Column(Integer, default=0)
    purchases_count = Column(Integer, default=0)
    rating_avg = Column(Float, nullable=True)
    rating_count = Column(Integer, default=0)

    # Compliance
    compliance_risk_score = Column(Float, default=0.0)
    compliance_checked_at = Column(DateTime, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    published_at = Column(DateTime, nullable=True)

    # Relationships
    transactions = relationship("Transaction", back_populates="content")
    vc_investments = relationship("VCInvestment", back_populates="content")


class Transaction(Base):
    """Purchase transaction"""
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id"), nullable=False, index=True)
    learner_id = Column(String(255), nullable=False, index=True)

    # Payment details
    amount_usd = Column(Float, nullable=False)
    platform_fee_usd = Column(Float, nullable=False)
    creator_payout_usd = Column(Float, nullable=False)

    # Stripe integration
    stripe_payment_intent_id = Column(String(255), nullable=True, unique=True)
    stripe_charge_id = Column(String(255), nullable=True)

    # Status
    status = Column(String(50), default="pending", nullable=False)  # pending, completed, failed, refunded

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    content = relationship("Content", back_populates="transactions")


class VCInvestment(Base):
    """VC investment in content"""
    __tablename__ = "vc_investments"

    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id"), nullable=False, index=True)
    vc_learner_id = Column(String(255), nullable=False, index=True)

    # Investment details
    investment_amount_usd = Column(Float, nullable=False)
    equity_percentage = Column(Float, nullable=False)  # % of future revenue

    # Performance
    total_revenue_generated_usd = Column(Float, default=0.0)
    total_roi_usd = Column(Float, default=0.0)
    roi_percentage = Column(Float, default=0.0)

    # Status
    status = Column(String(50), default="active", nullable=False)  # active, exited, defaulted

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    exited_at = Column(DateTime, nullable=True)

    # Relationships
    content = relationship("Content", back_populates="vc_investments")


class CreatorProfile(Base):
    """Creator profile with stats"""
    __tablename__ = "creator_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), nullable=False, unique=True, index=True)

    # Profile
    display_name = Column(String(255), nullable=False)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(1000), nullable=True)

    # Stats
    total_content_count = Column(Integer, default=0)
    total_revenue_usd = Column(Float, default=0.0)
    total_learners = Column(Integer, default=0)
    avg_rating = Column(Float, nullable=True)

    # Stripe
    stripe_account_id = Column(String(255), nullable=True, unique=True)
    stripe_account_verified = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

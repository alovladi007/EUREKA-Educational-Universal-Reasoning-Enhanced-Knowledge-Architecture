"""
Organization database model for EUREKA API Core

SQLAlchemy ORM model for organizations table.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Organization(Base):
    """Organization model - represents educational institutions"""
    __tablename__ = "organizations"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Basic Information
    name = Column(String(255), nullable=False)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    tier = Column(String(50), nullable=False, index=True)

    # Contact Information
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    website = Column(String(500), nullable=True)

    # Address Information
    address_line1 = Column(String(255), nullable=True)
    address_line2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    country = Column(String(2), nullable=False, default="US")

    # Configuration (stored as JSON)
    settings = Column(JSONB, nullable=False, default=dict)
    tier_config = Column(JSONB, nullable=False, default=dict)

    # Compliance Flags
    ferpa_compliant = Column(Boolean, nullable=False, default=True)
    coppa_compliant = Column(Boolean, nullable=False, default=False)
    hipaa_compliant = Column(Boolean, nullable=False, default=False)

    # Status Flags
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    is_verified = Column(Boolean, nullable=False, default=False)

    # Audit Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    courses = relationship("Course", back_populates="organization", cascade="all, delete-orphan")

    # Constraints and Indexes
    __table_args__ = (
        # Check constraints for data validation
        CheckConstraint(
            "tier IN ('high_school', 'undergraduate', 'graduate', 'professional_medical', 'professional_law', 'professional_mba', 'professional_engineering')",
            name='ck_organizations_tier'
        ),
        CheckConstraint(
            "slug ~ '^[a-z0-9-]+$'",
            name='ck_organizations_slug_format'
        ),
        CheckConstraint(
            "country ~ '^[A-Z]{2}$'",
            name='ck_organizations_country_code'
        ),
        # Index for active organizations by tier
        Index('ix_organizations_active_tier', 'is_active', 'tier'),
    )

    def __repr__(self):
        return f"<Organization {self.name} ({self.tier})>"

    def to_dict(self):
        """Convert organization to dictionary"""
        return {
            "id": str(self.id),
            "name": self.name,
            "slug": self.slug,
            "tier": self.tier,
            "email": self.email,
            "phone": self.phone,
            "website": self.website,
            "address_line1": self.address_line1,
            "address_line2": self.address_line2,
            "city": self.city,
            "state": self.state,
            "postal_code": self.postal_code,
            "country": self.country,
            "settings": self.settings,
            "tier_config": self.tier_config,
            "ferpa_compliant": self.ferpa_compliant,
            "coppa_compliant": self.coppa_compliant,
            "hipaa_compliant": self.hipaa_compliant,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    @property
    def full_address(self) -> str:
        """Get formatted full address"""
        parts = []
        if self.address_line1:
            parts.append(self.address_line1)
        if self.address_line2:
            parts.append(self.address_line2)
        if self.city:
            parts.append(self.city)
        if self.state:
            parts.append(self.state)
        if self.postal_code:
            parts.append(self.postal_code)
        if self.country:
            parts.append(self.country)
        return ", ".join(parts)

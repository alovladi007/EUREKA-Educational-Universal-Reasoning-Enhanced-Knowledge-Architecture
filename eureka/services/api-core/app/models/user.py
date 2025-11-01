"""
User database model for EUREKA API Core

SQLAlchemy ORM model for users table.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class User(Base):
    """User model - represents all users in EUREKA platform"""
    __tablename__ = "users"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)

    # Authentication
    email = Column(String(255), nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)

    # Profile Information
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    display_name = Column(String(200), nullable=True)
    avatar_url = Column(String(500), nullable=True)

    # User Metadata
    role = Column(String(50), nullable=False, default="student", index=True)
    locale = Column(String(10), nullable=False, default="en-US")
    timezone = Column(String(50), nullable=False, default="UTC")
    preferences = Column(JSONB, nullable=True)

    # Status Flags
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    email_verified = Column(Boolean, nullable=False, default=False)

    # Security Fields
    is_banned = Column(Boolean, nullable=False, default=False)
    ban_reason = Column(String, nullable=True)
    failed_login_attempts = Column(Integer, nullable=False, default=0)
    locked_until = Column(DateTime, nullable=True)

    # COPPA Compliance (Children's Online Privacy Protection Act)
    date_of_birth = Column(DateTime, nullable=True)
    parent_email = Column(String(255), nullable=True)
    parental_consent_given = Column(Boolean, nullable=False, default=False)
    parental_consent_date = Column(DateTime, nullable=True)

    # Audit Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)
    deleted_at = Column(DateTime, nullable=True)  # Soft delete support

    # Relationships
    organization = relationship("Organization", back_populates="users")
    enrollments = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")
    taught_courses = relationship("Course", back_populates="instructor", foreign_keys="Course.instructor_id")

    # Indexes for performance
    __table_args__ = (
        # Unique constraint on email per organization
        Index('ix_users_org_email', 'org_id', 'email', unique=True),

        # Check constraints for data validation
        CheckConstraint(
            "role IN ('student', 'teacher', 'admin', 'parent', 'staff')",
            name='ck_users_role'
        ),
        CheckConstraint(
            "email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$'",
            name='ck_users_email_format'
        ),
    )

    def __repr__(self):
        return f"<User {self.email} ({self.role})>"

    @property
    def full_name(self) -> str:
        """Get user's full name"""
        return f"{self.first_name} {self.last_name}"

    @property
    def is_under_13(self) -> bool:
        """Check if user is under 13 years old (COPPA)"""
        if not self.date_of_birth:
            return False
        age = (datetime.utcnow() - self.date_of_birth).days / 365.25
        return age < 13

    def to_dict(self):
        """Convert user to dictionary (excluding password)"""
        return {
            "id": str(self.id),
            "org_id": str(self.org_id),
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "display_name": self.display_name,
            "avatar_url": self.avatar_url,
            "role": self.role,
            "locale": self.locale,
            "timezone": self.timezone,
            "is_active": self.is_active,
            "email_verified": self.email_verified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_login_at": self.last_login_at.isoformat() if self.last_login_at else None,
        }

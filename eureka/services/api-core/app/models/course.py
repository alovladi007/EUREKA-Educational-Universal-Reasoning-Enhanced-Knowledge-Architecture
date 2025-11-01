"""
Course database model for EUREKA API Core

SQLAlchemy ORM model for courses table.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Course(Base):
    """Course model - represents educational courses"""
    __tablename__ = "courses"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    # Basic Information
    title = Column(String(255), nullable=False)
    code = Column(String(50), nullable=True, index=True)
    description = Column(String, nullable=True)
    tier = Column(String(50), nullable=False, index=True)

    # Curriculum (stored as JSON)
    syllabus = Column(JSONB, nullable=True)
    learning_objectives = Column(ARRAY(String), nullable=True)
    standards = Column(JSONB, nullable=True)

    # Metadata
    subject = Column(String(100), nullable=True, index=True)
    level = Column(String(50), nullable=True)  # beginner, intermediate, advanced, expert
    credits = Column(Integer, nullable=True)

    # Settings (stored as JSON)
    settings = Column(JSONB, nullable=False, default=dict)

    # Status Flags
    is_published = Column(Boolean, nullable=False, default=False, index=True)
    is_archived = Column(Boolean, nullable=False, default=False, index=True)

    # Schedule
    start_date = Column(DateTime, nullable=True, index=True)
    end_date = Column(DateTime, nullable=True)

    # Audit Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="courses")
    instructor = relationship("User", back_populates="taught_courses", foreign_keys=[instructor_id])
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")

    # Constraints and Indexes
    __table_args__ = (
        # Unique constraint on course code per organization
        Index('ix_courses_org_code', 'org_id', 'code', unique=True),

        # Check constraints for data validation
        CheckConstraint(
            "tier IN ('high_school', 'undergraduate', 'graduate', 'professional_medical', 'professional_law', 'professional_mba', 'professional_engineering')",
            name='ck_courses_tier'
        ),
        CheckConstraint(
            "level IN ('beginner', 'intermediate', 'advanced', 'expert')",
            name='ck_courses_level'
        ),
        CheckConstraint(
            "credits >= 0",
            name='ck_courses_credits_positive'
        ),
        CheckConstraint(
            "end_date IS NULL OR start_date IS NULL OR end_date > start_date",
            name='ck_courses_dates_valid'
        ),

        # Indexes for performance
        Index('ix_courses_org_published', 'org_id', 'is_published'),
        Index('ix_courses_tier_subject', 'tier', 'subject'),
        Index('ix_courses_start_date', 'start_date'),
    )

    def __repr__(self):
        return f"<Course {self.title} ({self.code or 'no-code'})>"

    def to_dict(self):
        """Convert course to dictionary"""
        return {
            "id": str(self.id),
            "org_id": str(self.org_id),
            "instructor_id": str(self.instructor_id) if self.instructor_id else None,
            "title": self.title,
            "code": self.code,
            "description": self.description,
            "tier": self.tier,
            "syllabus": self.syllabus,
            "learning_objectives": self.learning_objectives,
            "standards": self.standards,
            "subject": self.subject,
            "level": self.level,
            "credits": self.credits,
            "settings": self.settings,
            "is_published": self.is_published,
            "is_archived": self.is_archived,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    @property
    def is_active(self) -> bool:
        """Check if course is currently active"""
        if not self.is_published or self.is_archived:
            return False
        if not self.start_date:
            return True
        now = datetime.utcnow()
        if self.end_date:
            return self.start_date <= now <= self.end_date
        return self.start_date <= now

    @property
    def enrollment_count(self) -> int:
        """Get count of active enrollments"""
        return len([e for e in self.enrollments if e.status == 'active'])

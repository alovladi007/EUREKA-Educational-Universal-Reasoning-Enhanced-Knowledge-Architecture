"""
Enrollment database model for EUREKA API Core

SQLAlchemy ORM model for enrollments table (user-course relationships).
"""

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Index, CheckConstraint, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Enrollment(Base):
    """Enrollment model - represents student enrollment in courses"""
    __tablename__ = "enrollments"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)

    # Enrollment Status
    status = Column(String(50), nullable=False, default="active", index=True)

    # Progress Tracking
    progress_percent = Column(Integer, nullable=False, default=0)
    mastery_level = Column(Integer, nullable=False, default=0)

    # Timestamps
    enrolled_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    completed_at = Column(DateTime, nullable=True, index=True)
    withdrawn_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

    # Constraints and Indexes
    __table_args__ = (
        # Unique constraint - user can only enroll once per course
        UniqueConstraint('user_id', 'course_id', name='uq_enrollments_user_course'),

        # Check constraints for data validation
        CheckConstraint(
            "status IN ('active', 'completed', 'withdrawn', 'dropped')",
            name='ck_enrollments_status'
        ),
        CheckConstraint(
            "progress_percent >= 0 AND progress_percent <= 100",
            name='ck_enrollments_progress_valid'
        ),
        CheckConstraint(
            "mastery_level >= 0 AND mastery_level <= 100",
            name='ck_enrollments_mastery_valid'
        ),
        CheckConstraint(
            "completed_at IS NULL OR completed_at >= enrolled_at",
            name='ck_enrollments_completed_after_enrolled'
        ),
        CheckConstraint(
            "withdrawn_at IS NULL OR withdrawn_at >= enrolled_at",
            name='ck_enrollments_withdrawn_after_enrolled'
        ),

        # Indexes for performance
        Index('ix_enrollments_user_status', 'user_id', 'status'),
        Index('ix_enrollments_course_status', 'course_id', 'status'),
        Index('ix_enrollments_enrolled_at', 'enrolled_at'),
    )

    def __repr__(self):
        return f"<Enrollment user={self.user_id} course={self.course_id} status={self.status}>"

    def to_dict(self):
        """Convert enrollment to dictionary"""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "course_id": str(self.course_id),
            "status": self.status,
            "progress_percent": self.progress_percent,
            "mastery_level": self.mastery_level,
            "enrolled_at": self.enrolled_at.isoformat() if self.enrolled_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "withdrawn_at": self.withdrawn_at.isoformat() if self.withdrawn_at else None,
        }

    @property
    def is_active(self) -> bool:
        """Check if enrollment is active"""
        return self.status == 'active'

    @property
    def is_completed(self) -> bool:
        """Check if enrollment is completed"""
        return self.status == 'completed'

    @property
    def days_enrolled(self) -> int:
        """Calculate number of days enrolled"""
        end_date = self.completed_at or self.withdrawn_at or datetime.utcnow()
        return (end_date - self.enrolled_at).days

    def complete(self):
        """Mark enrollment as completed"""
        self.status = 'completed'
        self.completed_at = datetime.utcnow()
        self.progress_percent = 100

    def withdraw(self):
        """Mark enrollment as withdrawn"""
        self.status = 'withdrawn'
        self.withdrawn_at = datetime.utcnow()

"""
Enrollment database model for EUREKA API Core

SQLAlchemy ORM model for enrollments table (user-course relationships).
"""

from sqlalchemy import Column, String, DateTime, Numeric, ForeignKey, Index, CheckConstraint, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Enrollment(Base):
    """Enrollment model — a student's enrollment in a course.

    Columns mirror the canonical DB table (ops/db/00_init_complete.sql, the
    de-facto source of truth). The ORM had drifted badly: it declared
    `progress_percent` (Integer), `mastery_level` and `withdrawn_at`, but the
    real table has `progress_percentage` (numeric), `final_grade`,
    `last_accessed_at` and `metadata`, and has NO mastery_level / withdrawn_at
    columns. That drift made *every* query selecting this model 500 against
    Postgres ("column enrollments.progress_percent does not exist"). The
    Python attribute `progress_percent` is kept (FE/API contract) but bound
    explicitly to the real `progress_percentage` column.
    """
    __tablename__ = "enrollments"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)

    # Status — DB enrollment_status enum: active | completed | dropped | failed
    status = Column(String(50), nullable=False, default="active", index=True)

    # Progress: attr name stays `progress_percent`, real column is
    # `progress_percentage` numeric(5,2).
    progress_percent = Column("progress_percentage", Numeric(5, 2), nullable=False, default=0)
    final_grade = Column(Numeric, nullable=True)

    # Timestamps
    enrolled_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True, index=True)
    last_accessed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

    # Constraints and Indexes (only those whose columns actually exist).
    __table_args__ = (
        UniqueConstraint('user_id', 'course_id', name='uq_enrollments_user_course'),
        CheckConstraint(
            "completed_at IS NULL OR completed_at >= enrolled_at",
            name='ck_enrollments_completed_after_enrolled'
        ),
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
            "progress_percent": float(self.progress_percent) if self.progress_percent is not None else 0.0,
            "final_grade": float(self.final_grade) if self.final_grade is not None else None,
            "enrolled_at": self.enrolled_at.isoformat() if self.enrolled_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "last_accessed_at": self.last_accessed_at.isoformat() if self.last_accessed_at else None,
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
        end_date = self.completed_at or datetime.utcnow()
        return (end_date - self.enrolled_at).days

    def complete(self):
        """Mark enrollment as completed"""
        self.status = 'completed'
        self.completed_at = datetime.utcnow()
        self.progress_percent = 100

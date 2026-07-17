"""
Grade database model for EUREKA API Core

SQLAlchemy ORM model for the grades table (per-assignment grades on an
enrollment). Columns mirror ops/db/00_init_complete.sql exactly (CI's
schema-drift check compares the two); if you add a column here, add it to
the init SQL and a migration too.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, Numeric, ForeignKey, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Grade(Base):
    """Grade model - a graded assignment attempt within an enrollment"""
    __tablename__ = "grades"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False, index=True)
    assignment_id = Column(UUID(as_uuid=True), ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False, index=True)
    graded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)

    # Scoring
    score = Column(Numeric(10, 2), nullable=True)
    max_score = Column(Numeric(10, 2), nullable=False)
    percentage = Column(Numeric(5, 2), nullable=True)
    feedback = Column(Text, nullable=True)
    graded_at = Column(DateTime, nullable=True)

    # Submission linkage
    submission_url = Column(String(500), nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    is_late = Column(Boolean, nullable=True, default=False)
    attempt_number = Column(Integer, nullable=True, default=1)

    # Misc (DB column is literally named "metadata" — a reserved attribute
    # name on declarative classes, hence the mapped attribute name)
    extra_metadata = Column("metadata", JSONB, nullable=True, default=dict)

    # Audit Timestamps
    created_at = Column(DateTime, nullable=True, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)

    # Relationships
    enrollment = relationship("Enrollment")
    assignment = relationship("Assignment")
    grader = relationship("User", foreign_keys=[graded_by])

    __table_args__ = (
        UniqueConstraint("enrollment_id", "assignment_id", "attempt_number", name="unique_grade_attempt"),
    )

    def __repr__(self):
        return f"<Grade enrollment={self.enrollment_id} assignment={self.assignment_id} score={self.score}>"

    def to_dict(self):
        """Convert grade to dictionary"""
        return {
            "id": str(self.id),
            "enrollment_id": str(self.enrollment_id),
            "assignment_id": str(self.assignment_id),
            "graded_by": str(self.graded_by) if self.graded_by else None,
            "score": float(self.score) if self.score is not None else None,
            "max_score": float(self.max_score) if self.max_score is not None else None,
            "percentage": float(self.percentage) if self.percentage is not None else None,
            "feedback": self.feedback,
            "graded_at": self.graded_at.isoformat() if self.graded_at else None,
            "submission_url": self.submission_url,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "is_late": self.is_late,
            "attempt_number": self.attempt_number,
            "metadata": self.extra_metadata,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def calculate_percentage(self):
        """Calculate percentage from score / max_score"""
        if not self.max_score:
            return None
        if self.score is None:
            return None
        return float(self.score) / float(self.max_score) * 100

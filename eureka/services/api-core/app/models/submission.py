"""
Submission database model for EUREKA API Core

SQLAlchemy ORM model for the submissions table (assessment submissions).
Columns mirror ops/db/00_init_complete.sql exactly (CI's schema-drift check
compares the two); if you add a column here, add it to the init SQL and a
migration too.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, Numeric, ForeignKey, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Submission(Base):
    """Submission model - a learner's attempt at an assessment"""
    __tablename__ = "submissions"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    # FK to assessments in the DB; plain UUID here because assessments has
    # no ORM model in api-core (the assess service owns that domain).
    assessment_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    graded_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Attempt Tracking
    attempt_number = Column(Integer, nullable=False, default=1)

    # Status (DB column is the `submission_status` Postgres enum)
    status = Column(String(50), nullable=True, default="draft", index=True)

    # Timestamps
    started_at = Column(DateTime, nullable=True, default=datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)
    graded_at = Column(DateTime, nullable=True)

    # Scoring
    score = Column(Numeric(10, 2), nullable=True)
    max_score = Column(Numeric(10, 2), nullable=True)
    percentage = Column(Numeric(5, 2), nullable=True)
    time_spent_seconds = Column(Integer, nullable=True)
    is_late = Column(Boolean, nullable=True, default=False)
    feedback = Column(Text, nullable=True)

    # Misc (DB column is literally named "metadata" — a reserved attribute
    # name on declarative classes, hence the mapped attribute name)
    extra_metadata = Column("metadata", JSONB, nullable=True, default=dict)

    # Audit Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    grader = relationship("User", foreign_keys=[graded_by])

    __table_args__ = (
        UniqueConstraint("assessment_id", "user_id", "attempt_number", name="unique_submission_attempt"),
    )

    def __repr__(self):
        return f"<Submission user={self.user_id} assessment={self.assessment_id} status={self.status}>"

    def to_dict(self):
        """Convert submission to dictionary"""
        return {
            "id": str(self.id),
            "assessment_id": str(self.assessment_id),
            "user_id": str(self.user_id),
            "graded_by": str(self.graded_by) if self.graded_by else None,
            "attempt_number": self.attempt_number,
            "status": self.status,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "graded_at": self.graded_at.isoformat() if self.graded_at else None,
            "score": float(self.score) if self.score is not None else None,
            "max_score": float(self.max_score) if self.max_score is not None else None,
            "percentage": float(self.percentage) if self.percentage is not None else None,
            "time_spent_seconds": self.time_spent_seconds,
            "is_late": self.is_late,
            "feedback": self.feedback,
            "metadata": self.extra_metadata,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    @property
    def is_graded(self) -> bool:
        """Check if submission has been graded"""
        return self.status in ("graded", "returned")

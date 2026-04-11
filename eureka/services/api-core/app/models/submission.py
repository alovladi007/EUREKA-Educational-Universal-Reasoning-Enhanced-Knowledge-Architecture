"""
Submission database model for EUREKA API Core

SQLAlchemy ORM model for assignment submissions table.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, ForeignKey, Index, CheckConstraint, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Submission(Base):
    """Submission model - represents student assignment submissions"""
    __tablename__ = "submissions"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    assignment_id = Column(UUID(as_uuid=True), ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    graded_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Submission Content
    content = Column(Text, nullable=True)
    attachments = Column(JSONB, nullable=True)  # List of file references
    submission_metadata = Column(JSONB, nullable=True)

    # Attempt Tracking
    attempt_number = Column(Integer, nullable=False, default=1)

    # Timestamps
    submitted_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)  # For timed assignments

    # Grading
    status = Column(String(50), nullable=False, default="submitted", index=True)
    score = Column(Float, nullable=True)
    max_score = Column(Float, nullable=True)
    grade_percentage = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    rubric_scores = Column(JSONB, nullable=True)  # Detailed rubric evaluation
    graded_at = Column(DateTime, nullable=True, index=True)

    # Late Submission
    is_late = Column(Boolean, nullable=False, default=False)
    late_penalty_applied = Column(Float, nullable=True)

    # AI Grading
    ai_graded = Column(Boolean, nullable=False, default=False)
    ai_confidence_score = Column(Float, nullable=True)
    requires_manual_review = Column(Boolean, nullable=False, default=False)

    # Plagiarism Detection
    plagiarism_score = Column(Float, nullable=True)
    plagiarism_report = Column(JSONB, nullable=True)

    # Audit Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)

    # Relationships
    assignment = relationship("Assignment", back_populates="submissions")
    user = relationship("User", foreign_keys=[user_id])
    grader = relationship("User", foreign_keys=[graded_by])

    # Constraints and Indexes
    __table_args__ = (
        # Check constraints for data validation
        CheckConstraint(
            "status IN ('draft', 'submitted', 'grading', 'graded', 'returned', 'resubmit_requested')",
            name='ck_submissions_status'
        ),
        CheckConstraint(
            "attempt_number > 0",
            name='ck_submissions_attempt_positive'
        ),
        CheckConstraint(
            "score IS NULL OR score >= 0",
            name='ck_submissions_score_positive'
        ),
        CheckConstraint(
            "max_score IS NULL OR max_score > 0",
            name='ck_submissions_max_score_positive'
        ),
        CheckConstraint(
            "grade_percentage IS NULL OR (grade_percentage >= 0 AND grade_percentage <= 100)",
            name='ck_submissions_percentage_valid'
        ),
        CheckConstraint(
            "late_penalty_applied IS NULL OR (late_penalty_applied >= 0 AND late_penalty_applied <= 100)",
            name='ck_submissions_penalty_valid'
        ),
        CheckConstraint(
            "ai_confidence_score IS NULL OR (ai_confidence_score >= 0 AND ai_confidence_score <= 1)",
            name='ck_submissions_ai_confidence_valid'
        ),
        CheckConstraint(
            "plagiarism_score IS NULL OR (plagiarism_score >= 0 AND plagiarism_score <= 100)",
            name='ck_submissions_plagiarism_valid'
        ),
        CheckConstraint(
            "graded_at IS NULL OR graded_at >= submitted_at",
            name='ck_submissions_graded_after_submitted'
        ),

        # Indexes for performance
        Index('ix_submissions_user_assignment', 'user_id', 'assignment_id'),
        Index('ix_submissions_assignment_status', 'assignment_id', 'status'),
        Index('ix_submissions_user_status', 'user_id', 'status'),
        Index('ix_submissions_submitted_at', 'submitted_at'),
        Index('ix_submissions_requires_review', 'requires_manual_review', 'status'),
    )

    def __repr__(self):
        return f"<Submission user={self.user_id} assignment={self.assignment_id} status={self.status}>"

    def to_dict(self):
        """Convert submission to dictionary"""
        return {
            "id": str(self.id),
            "assignment_id": str(self.assignment_id),
            "user_id": str(self.user_id),
            "graded_by": str(self.graded_by) if self.graded_by else None,
            "content": self.content,
            "attachments": self.attachments,
            "metadata": self.submission_metadata,
            "attempt_number": self.attempt_number,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "status": self.status,
            "score": self.score,
            "max_score": self.max_score,
            "grade_percentage": self.grade_percentage,
            "feedback": self.feedback,
            "rubric_scores": self.rubric_scores,
            "graded_at": self.graded_at.isoformat() if self.graded_at else None,
            "is_late": self.is_late,
            "late_penalty_applied": self.late_penalty_applied,
            "ai_graded": self.ai_graded,
            "ai_confidence_score": self.ai_confidence_score,
            "requires_manual_review": self.requires_manual_review,
            "plagiarism_score": self.plagiarism_score,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    @property
    def is_graded(self) -> bool:
        """Check if submission has been graded"""
        return self.status in ['graded', 'returned']

    @property
    def final_score(self) -> float:
        """Calculate final score after late penalty"""
        if self.score is None:
            return None
        if not self.is_late or not self.late_penalty_applied:
            return self.score
        return self.score * (1 - self.late_penalty_applied / 100)

    def calculate_grade_percentage(self):
        """Calculate grade percentage from score and max_score"""
        if self.score is None or self.max_score is None or self.max_score == 0:
            return None
        final = self.final_score
        return (final / self.max_score) * 100

    def grade(self, score: float, max_score: float, feedback: str = None, graded_by_id: uuid.UUID = None):
        """Grade this submission"""
        self.score = score
        self.max_score = max_score
        self.feedback = feedback
        self.graded_by = graded_by_id
        self.graded_at = datetime.utcnow()
        self.status = 'graded'
        self.grade_percentage = self.calculate_grade_percentage()

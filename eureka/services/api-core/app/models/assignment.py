"""
Assignment database model for EUREKA API Core

SQLAlchemy ORM model for assignments table.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Index, CheckConstraint, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Assignment(Base):
    """Assignment model - represents course assignments and assessments"""
    __tablename__ = "assignments"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Basic Information
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)

    # Assignment Type and Configuration
    assignment_type = Column(String(50), nullable=False, index=True)  # homework, quiz, exam, project, lab, essay
    max_points = Column(Integer, nullable=False, default=100)
    weight = Column(Integer, nullable=False, default=1)  # Weight in final grade calculation

    # Settings (stored as JSON)
    settings = Column(JSONB, nullable=False, default=dict)
    rubric = Column(JSONB, nullable=True)  # Grading rubric

    # Due Dates
    available_from = Column(DateTime, nullable=True, index=True)
    due_date = Column(DateTime, nullable=True)
    late_submission_allowed = Column(Boolean, nullable=False, default=False)
    late_penalty_percent = Column(Integer, nullable=False, default=0)

    # Attempts
    max_attempts = Column(Integer, nullable=True)  # NULL means unlimited
    time_limit_minutes = Column(Integer, nullable=True)  # NULL means no time limit

    # Status Flags
    is_published = Column(Boolean, nullable=False, default=False, index=True)
    is_graded = Column(Boolean, nullable=False, default=True)

    # Audit Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)

    # Relationships
    course = relationship("Course", backref="assignments")
    creator = relationship("User", foreign_keys=[created_by])
    submissions = relationship("Submission", back_populates="assignment", cascade="all, delete-orphan")

    # Constraints and Indexes
    __table_args__ = (
        # Check constraints for data validation
        CheckConstraint(
            "assignment_type IN ('homework', 'quiz', 'exam', 'project', 'lab', 'essay', 'discussion', 'presentation')",
            name='ck_assignments_type'
        ),
        CheckConstraint(
            "max_points > 0",
            name='ck_assignments_max_points_positive'
        ),
        CheckConstraint(
            "weight > 0",
            name='ck_assignments_weight_positive'
        ),
        CheckConstraint(
            "late_penalty_percent >= 0 AND late_penalty_percent <= 100",
            name='ck_assignments_penalty_valid'
        ),
        CheckConstraint(
            "max_attempts IS NULL OR max_attempts > 0",
            name='ck_assignments_attempts_positive'
        ),
        CheckConstraint(
            "time_limit_minutes IS NULL OR time_limit_minutes > 0",
            name='ck_assignments_time_limit_positive'
        ),
        CheckConstraint(
            "due_date IS NULL OR available_from IS NULL OR due_date >= available_from",
            name='ck_assignments_dates_valid'
        ),

        # Indexes for performance
        Index('ix_assignments_course_published', 'course_id', 'is_published'),
        Index('ix_assignments_course_type', 'course_id', 'assignment_type'),
        Index('ix_assignments_due_date', 'due_date'),
    )

    def __repr__(self):
        return f"<Assignment {self.title} ({self.assignment_type})>"

    def to_dict(self):
        """Convert assignment to dictionary"""
        return {
            "id": str(self.id),
            "course_id": str(self.course_id),
            "created_by": str(self.created_by) if self.created_by else None,
            "title": self.title,
            "description": self.description,
            "instructions": self.instructions,
            "assignment_type": self.assignment_type,
            "max_points": self.max_points,
            "weight": self.weight,
            "settings": self.settings,
            "rubric": self.rubric,
            "available_from": self.available_from.isoformat() if self.available_from else None,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "late_submission_allowed": self.late_submission_allowed,
            "late_penalty_percent": self.late_penalty_percent,
            "max_attempts": self.max_attempts,
            "time_limit_minutes": self.time_limit_minutes,
            "is_published": self.is_published,
            "is_graded": self.is_graded,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    @property
    def is_available(self) -> bool:
        """Check if assignment is currently available"""
        if not self.is_published:
            return False
        if not self.available_from:
            return True
        return datetime.utcnow() >= self.available_from

    @property
    def is_overdue(self) -> bool:
        """Check if assignment is past due date"""
        if not self.due_date:
            return False
        return datetime.utcnow() > self.due_date

    @property
    def accepts_submissions(self) -> bool:
        """Check if assignment currently accepts submissions"""
        if not self.is_available:
            return False
        if self.is_overdue and not self.late_submission_allowed:
            return False
        return True

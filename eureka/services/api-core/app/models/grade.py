"""
Grade database model for EUREKA API Core

SQLAlchemy ORM model for grades table (final course grades).
"""

from sqlalchemy import Column, String, Boolean, Float, DateTime, ForeignKey, Index, CheckConstraint, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Grade(Base):
    """Grade model - represents final grades for courses"""
    __tablename__ = "grades"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    graded_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Grade Information
    letter_grade = Column(String(5), nullable=True)  # A+, A, A-, B+, etc.
    numeric_grade = Column(Float, nullable=True)  # 0-100 or 0.0-4.0
    points_earned = Column(Float, nullable=False, default=0.0)
    points_possible = Column(Float, nullable=False, default=0.0)
    percentage = Column(Float, nullable=True)

    # Grade Breakdown (stored as JSON)
    breakdown = Column(JSONB, nullable=True)  # Breakdown by assignment type
    assignment_grades = Column(JSONB, nullable=True)  # Individual assignment scores

    # Status
    status = Column(String(50), nullable=False, default="in_progress", index=True)
    is_final = Column(Boolean, nullable=False, default=False)

    # Comments
    comments = Column(Text, nullable=True)

    # Audit Timestamps
    calculated_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    finalized_at = Column(DateTime, nullable=True, index=True)
    posted_at = Column(DateTime, nullable=True)

    # Relationships
    enrollment = relationship("Enrollment")
    course = relationship("Course")
    user = relationship("User", foreign_keys=[user_id])
    grader = relationship("User", foreign_keys=[graded_by])

    # Constraints and Indexes
    __table_args__ = (
        # Unique constraint - one grade per enrollment
        UniqueConstraint('enrollment_id', name='uq_grades_enrollment'),

        # Check constraints for data validation
        CheckConstraint(
            "status IN ('in_progress', 'complete', 'posted', 'withdrawn')",
            name='ck_grades_status'
        ),
        CheckConstraint(
            "numeric_grade IS NULL OR numeric_grade >= 0",
            name='ck_grades_numeric_positive'
        ),
        CheckConstraint(
            "points_earned >= 0",
            name='ck_grades_points_earned_positive'
        ),
        CheckConstraint(
            "points_possible > 0",
            name='ck_grades_points_possible_positive'
        ),
        CheckConstraint(
            "percentage IS NULL OR (percentage >= 0 AND percentage <= 100)",
            name='ck_grades_percentage_valid'
        ),
        CheckConstraint(
            "finalized_at IS NULL OR finalized_at >= calculated_at",
            name='ck_grades_finalized_after_calculated'
        ),
        CheckConstraint(
            "posted_at IS NULL OR posted_at >= calculated_at",
            name='ck_grades_posted_after_calculated'
        ),

        # Indexes for performance
        Index('ix_grades_user_course', 'user_id', 'course_id'),
        Index('ix_grades_course_status', 'course_id', 'status'),
        Index('ix_grades_user_final', 'user_id', 'is_final'),
    )

    def __repr__(self):
        return f"<Grade user={self.user_id} course={self.course_id} grade={self.letter_grade or self.percentage}>"

    def to_dict(self):
        """Convert grade to dictionary"""
        return {
            "id": str(self.id),
            "enrollment_id": str(self.enrollment_id),
            "course_id": str(self.course_id),
            "user_id": str(self.user_id),
            "graded_by": str(self.graded_by) if self.graded_by else None,
            "letter_grade": self.letter_grade,
            "numeric_grade": self.numeric_grade,
            "points_earned": self.points_earned,
            "points_possible": self.points_possible,
            "percentage": self.percentage,
            "breakdown": self.breakdown,
            "assignment_grades": self.assignment_grades,
            "status": self.status,
            "is_final": self.is_final,
            "comments": self.comments,
            "calculated_at": self.calculated_at.isoformat() if self.calculated_at else None,
            "finalized_at": self.finalized_at.isoformat() if self.finalized_at else None,
            "posted_at": self.posted_at.isoformat() if self.posted_at else None,
        }

    def calculate_percentage(self):
        """Calculate percentage from points"""
        if self.points_possible == 0:
            return 0.0
        return (self.points_earned / self.points_possible) * 100

    def calculate_letter_grade(self, percentage: float = None) -> str:
        """Convert percentage to letter grade"""
        pct = percentage if percentage is not None else self.percentage
        if pct is None:
            return None

        # Standard grading scale
        if pct >= 97: return "A+"
        if pct >= 93: return "A"
        if pct >= 90: return "A-"
        if pct >= 87: return "B+"
        if pct >= 83: return "B"
        if pct >= 80: return "B-"
        if pct >= 77: return "C+"
        if pct >= 73: return "C"
        if pct >= 70: return "C-"
        if pct >= 67: return "D+"
        if pct >= 63: return "D"
        if pct >= 60: return "D-"
        return "F"

    def finalize(self, graded_by_id: uuid.UUID = None):
        """Finalize the grade"""
        self.percentage = self.calculate_percentage()
        self.letter_grade = self.calculate_letter_grade()
        self.status = 'complete'
        self.is_final = True
        self.finalized_at = datetime.utcnow()
        if graded_by_id:
            self.graded_by = graded_by_id

    def post(self):
        """Post the grade (make visible to student)"""
        if not self.is_final:
            raise ValueError("Cannot post a grade that is not finalized")
        self.status = 'posted'
        self.posted_at = datetime.utcnow()

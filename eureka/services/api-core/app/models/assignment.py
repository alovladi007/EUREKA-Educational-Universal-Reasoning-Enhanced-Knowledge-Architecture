"""
Assignment database model for EUREKA API Core

SQLAlchemy ORM model for the assignments table. Columns mirror
ops/db/00_init_complete.sql exactly (CI's schema-drift check compares the
two); if you add a column here, add it to the init SQL and a migration too.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Numeric, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Assignment(Base):
    """Assignment model - represents course assignments"""
    __tablename__ = "assignments"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    # FK to course_modules in the DB; plain UUID here because course_modules
    # has no ORM model (a ForeignKey would break metadata.create_all in tests).
    module_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Basic Information
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)

    # Type and grading configuration
    # DB column is the `assignment_type` Postgres enum
    # ('homework','quiz','exam','project','discussion').
    assignment_type = Column(String(50), nullable=False, index=True)
    max_points = Column(Numeric(10, 2), nullable=False)
    rubric = Column(JSONB, nullable=True)

    # Due dates / late policy
    due_date = Column(DateTime, nullable=True, index=True)
    allow_late_submission = Column(Boolean, nullable=True, default=True)
    late_penalty_percentage = Column(Numeric(5, 2), nullable=True, default=0)

    # Status
    is_published = Column(Boolean, nullable=True, default=False)

    # Audit Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)

    # Relationships
    course = relationship("Course", backref="assignments")

    def __repr__(self):
        return f"<Assignment {self.title} ({self.assignment_type})>"

    def to_dict(self):
        """Convert assignment to dictionary"""
        return {
            "id": str(self.id),
            "course_id": str(self.course_id),
            "module_id": str(self.module_id) if self.module_id else None,
            "title": self.title,
            "description": self.description,
            "instructions": self.instructions,
            "assignment_type": self.assignment_type,
            "max_points": float(self.max_points) if self.max_points is not None else None,
            "rubric": self.rubric,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "allow_late_submission": self.allow_late_submission,
            "late_penalty_percentage": float(self.late_penalty_percentage) if self.late_penalty_percentage is not None else None,
            "is_published": self.is_published,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    @property
    def is_overdue(self) -> bool:
        """Check if assignment is past due date"""
        if not self.due_date:
            return False
        return datetime.utcnow() > self.due_date

    @property
    def accepts_submissions(self) -> bool:
        """Check if assignment currently accepts submissions"""
        if not self.is_published:
            return False
        if self.is_overdue and not self.allow_late_submission:
            return False
        return True

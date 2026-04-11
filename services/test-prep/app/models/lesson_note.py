"""
User notes model — personal notes attached to lessons or exam topics
"""
from sqlalchemy import (
    Column, String, Integer, Text, DateTime, Boolean, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class LessonNote(Base):
    __tablename__ = "lesson_notes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    lesson_id = Column(String, ForeignKey("video_lessons.id"), nullable=True, index=True)

    # Context — a note can be attached to a lesson or just to an exam/section/topic
    exam_type = Column(String(50), nullable=False, index=True)
    section_id = Column(String(100), nullable=True)
    topic = Column(String(200), nullable=True)

    title = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)
    color_label = Column(String(20), nullable=True)  # yellow, blue, green, red, purple
    is_pinned = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)

    # For notes tied to a specific video timestamp
    video_timestamp_seconds = Column(Integer, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lesson = relationship("VideoLesson", back_populates="notes")

    __table_args__ = (
        Index("ix_lesson_notes_user_exam", "user_id", "exam_type"),
    )

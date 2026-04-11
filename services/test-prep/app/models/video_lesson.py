"""
Video lesson and lesson progress models
"""
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class VideoLesson(Base):
    __tablename__ = "video_lessons"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    exam_type = Column(String(50), nullable=False, index=True)
    section_id = Column(String(100), nullable=False, index=True)
    topic = Column(String(200), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    video_url = Column(String(1000), nullable=False)
    thumbnail_url = Column(String(1000), nullable=True)
    duration_seconds = Column(Integer, nullable=False, default=0)
    sort_order = Column(Integer, nullable=False, default=0)

    # Lesson content
    transcript = Column(Text, nullable=True)
    official_notes = Column(Text, nullable=True)
    key_concepts = Column(Text, nullable=True)  # JSON array of key concepts
    resources = Column(Text, nullable=True)  # JSON array of {title, url}

    # Metadata
    instructor_name = Column(String(200), nullable=True)
    difficulty_level = Column(String(20), nullable=True)
    is_free = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Stats (denormalized for performance)
    view_count = Column(Integer, default=0)
    avg_rating = Column(Float, default=0.0)

    progress = relationship("UserLessonProgress", back_populates="lesson")
    notes = relationship("LessonNote", back_populates="lesson")

    __table_args__ = (
        Index("ix_video_lessons_exam_section", "exam_type", "section_id"),
        Index("ix_video_lessons_exam_order", "exam_type", "sort_order"),
    )


class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    lesson_id = Column(String, ForeignKey("video_lessons.id"), nullable=False, index=True)

    watched_seconds = Column(Integer, default=0)
    total_seconds = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    last_position_seconds = Column(Integer, default=0)
    watch_count = Column(Integer, default=1)
    rating = Column(Integer, nullable=True)  # 1-5

    started_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lesson = relationship("VideoLesson", back_populates="progress")

    __table_args__ = (
        Index("ix_user_lesson_progress_user_lesson", "user_id", "lesson_id", unique=True),
    )

"""
Flashcard models — system cards and user's own cards
"""
from sqlalchemy import (
    Column, String, Integer, Float, Text, DateTime, Boolean, ForeignKey, Index
)
from datetime import datetime
import uuid

from app.core.database import Base


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    exam_type = Column(String(50), nullable=False, index=True)
    section_id = Column(String(100), nullable=True, index=True)
    topic = Column(String(200), nullable=True)

    front = Column(Text, nullable=False)
    back = Column(Text, nullable=False)
    hint = Column(Text, nullable=True)
    tags = Column(Text, nullable=True)  # JSON array
    difficulty = Column(String(20), nullable=True)  # easy | medium | hard

    # Ownership: null = system card, set = user-created
    created_by = Column(String, ForeignKey("users.id"), nullable=True)
    is_published = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("ix_flashcards_exam_section", "exam_type", "section_id"),
    )


class FlashcardProgress(Base):
    """Tracks spaced-repetition state per user per card."""
    __tablename__ = "flashcard_progress"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    flashcard_id = Column(String, ForeignKey("flashcards.id"), nullable=False, index=True)

    # Spaced repetition fields
    ease_factor = Column(Float, default=2.5)
    interval_days = Column(Integer, default=1)
    repetitions = Column(Integer, default=0)
    next_review = Column(DateTime, nullable=True)

    # Stats
    times_seen = Column(Integer, default=0)
    times_correct = Column(Integer, default=0)
    times_incorrect = Column(Integer, default=0)
    last_rating = Column(Integer, nullable=True)  # 1=again, 2=hard, 3=good, 4=easy
    streak = Column(Integer, default=0)

    last_reviewed = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("ix_flashcard_progress_user_card", "user_id", "flashcard_id", unique=True),
        Index("ix_flashcard_progress_next_review", "user_id", "next_review"),
    )

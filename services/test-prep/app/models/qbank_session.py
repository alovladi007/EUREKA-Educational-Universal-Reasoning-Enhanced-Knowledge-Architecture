"""
QBank session model — tracks dedicated question-bank practice runs
"""
from sqlalchemy import (
    Column, String, Integer, Float, Text, DateTime, Boolean, ForeignKey, Index
)
from datetime import datetime
import uuid

from app.core.database import Base


class QBankSession(Base):
    """A user-initiated QBank practice run: timed, tutor, or review mode."""
    __tablename__ = "qbank_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    exam_type = Column(String(50), nullable=False, index=True)

    # Configuration
    mode = Column(String(20), nullable=False, default="tutor")  # tutor | timed | review
    section_ids = Column(Text, nullable=True)   # JSON array of section_ids selected
    topic_filter = Column(Text, nullable=True)  # JSON array of topic strings
    difficulty_filter = Column(String(20), nullable=True)  # easy | medium | hard | mixed
    question_count = Column(Integer, nullable=False, default=20)
    time_limit_seconds = Column(Integer, nullable=True)  # null = unlimited

    # Progress
    questions_answered = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    incorrect_count = Column(Integer, default=0)
    skipped_count = Column(Integer, default=0)
    flagged_count = Column(Integer, default=0)
    score_percent = Column(Float, nullable=True)

    # Timing
    total_time_seconds = Column(Integer, default=0)
    avg_time_per_question = Column(Float, nullable=True)

    # State
    is_complete = Column(Boolean, default=False)
    current_question_index = Column(Integer, default=0)
    question_order = Column(Text, nullable=True)  # JSON array of question IDs in order
    answers = Column(Text, nullable=True)  # JSON dict {question_id: {answer_index, is_correct, time_spent, flagged}}

    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("ix_qbank_sessions_user_exam", "user_id", "exam_type"),
    )

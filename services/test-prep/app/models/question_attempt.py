"""
Question Attempt model for tracking user responses and performance
"""
from sqlalchemy import Column, String, Text, Integer, Float, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class QuestionAttempt(Base):
    """
    Records each attempt a user makes at answering a question
    """
    __tablename__ = "question_attempts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Foreign Keys
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    question_id = Column(String, ForeignKey("questions.id"), nullable=False)
    session_id = Column(String, ForeignKey("study_sessions.id"))
    exam_result_id = Column(String, ForeignKey("exam_results.id"))
    
    # Response Data
    user_answer = Column(JSON, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    partial_credit = Column(Float, default=0.0)  # For partial credit questions
    
    # Timing
    time_spent_seconds = Column(Integer, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Context
    attempt_number = Column(Integer, default=1)  # Which attempt for this question
    confidence_level = Column(Integer)  # 1-5 user confidence rating
    hint_used = Column(Boolean, default=False)
    explanation_viewed = Column(Boolean, default=False)
    
    # Adaptive Learning Context
    ability_estimate_before = Column(Float)  # User's ability estimate before this question
    ability_estimate_after = Column(Float)  # Updated ability estimate after this question
    question_difficulty = Column(Float)  # Difficulty at time of attempt
    probability_correct = Column(Float)  # IRT probability of correct answer
    information_gain = Column(Float)  # How much this question improved ability estimate
    
    # Performance Metrics
    speed_percentile = Column(Float)  # How fast compared to others
    accuracy_streak = Column(Integer, default=0)  # Current streak at time of attempt
    
    # Feedback
    flagged = Column(Boolean, default=False)
    flag_reason = Column(String(200))
    user_notes = Column(Text)
    
    # Relationships
    user = relationship("User", back_populates="attempts")
    question = relationship("Question", back_populates="attempts")
    session = relationship("StudySession", back_populates="attempts")
    exam_result = relationship("ExamResult", back_populates="attempts")
    
    def __repr__(self):
        return f"<QuestionAttempt {self.user_id[:8]} - {self.question_id[:8]} - {'Correct' if self.is_correct else 'Incorrect'}>"


class StudySession(Base):
    """
    Study session tracking for analytics
    """
    __tablename__ = "study_sessions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Session Info
    session_type = Column(String(50), nullable=False)  # practice, exam, review
    exam_type = Column(String(50))  # GRE, GMAT, etc.
    subject = Column(String(100))
    topic = Column(String(200))
    
    # Timing
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True))
    duration_seconds = Column(Integer)
    
    # Performance
    total_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    accuracy = Column(Float, default=0.0)
    avg_time_per_question = Column(Float)
    
    # Adaptive Learning
    starting_ability = Column(Float)
    ending_ability = Column(Float)
    ability_change = Column(Float)
    
    # Metadata
    device_type = Column(String(50))  # web, mobile, tablet
    completed = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="sessions")
    attempts = relationship("QuestionAttempt", back_populates="session", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<StudySession {self.id[:8]} - {self.session_type}>"

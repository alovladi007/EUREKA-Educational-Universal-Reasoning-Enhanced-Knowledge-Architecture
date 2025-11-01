"""
SQLAlchemy models for Assessment Engine

Matches the database schema from init-assessment-engine.sql
"""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from app.utils.database import Base

class AssessmentType(str, enum.Enum):
    QUIZ = "quiz"
    EXAM = "exam"
    HOMEWORK = "homework"
    PRACTICE = "practice"

class QuestionType(str, enum.Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"
    ESSAY = "essay"
    CODE = "code"
    MATCHING = "matching"

class AttemptStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    GRADED = "graded"
    INCOMPLETE = "incomplete"

class GradingStatus(str, enum.Enum):
    PENDING = "pending"
    AUTO_GRADED = "auto_graded"
    MANUALLY_GRADED = "manually_graded"
    AI_GRADED = "ai_graded"

# Models

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    assessment_type = Column(Enum(AssessmentType), nullable=False)
    total_points = Column(Float, default=100.0)
    passing_score = Column(Float)
    time_limit_minutes = Column(Integer)
    attempts_allowed = Column(Integer, default=1)
    is_published = Column(Boolean, default=False)
    start_date = Column(DateTime(timezone=True))
    due_date = Column(DateTime(timezone=True))
    late_submission_allowed = Column(Boolean, default=False)
    late_penalty_percent = Column(Float, default=0.0)
    shuffle_questions = Column(Boolean, default=False)
    show_correct_answers = Column(Boolean, default=True)
    show_feedback = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan")
    attempts = relationship("AssessmentAttempt", back_populates="assessment")

class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    question_type = Column(Enum(QuestionType), nullable=False)
    question_text = Column(Text, nullable=False)
    points = Column(Float, default=1.0)
    order_index = Column(Integer)
    options = Column(JSON)  # For MCQ: [{"id": "a", "text": "Answer A"}]
    correct_answer = Column(Text)  # For MCQ: "a", For T/F: "true"
    explanation = Column(Text)
    rubric = Column(JSON)  # Grading rubric for essays
    code_template = Column(Text)  # For code questions
    test_cases = Column(JSON)  # For code questions
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    assessment = relationship("Assessment", back_populates="questions")
    responses = relationship("QuestionResponse", back_populates="question")

class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    attempt_number = Column(Integer, default=1)
    status = Column(Enum(AttemptStatus), default=AttemptStatus.IN_PROGRESS)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    submitted_at = Column(DateTime(timezone=True))
    time_spent_seconds = Column(Integer)
    score = Column(Float)
    max_score = Column(Float)
    percentage = Column(Float)
    is_late = Column(Boolean, default=False)
    late_penalty_applied = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    assessment = relationship("Assessment", back_populates="attempts")
    responses = relationship("QuestionResponse", back_populates="attempt", cascade="all, delete-orphan")
    grading_result = relationship("GradingResult", back_populates="attempt", uselist=False)

class QuestionResponse(Base):
    __tablename__ = "question_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    attempt_id = Column(UUID(as_uuid=True), ForeignKey("assessment_attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    response_text = Column(Text)
    response_data = Column(JSON)  # For structured responses
    is_correct = Column(Boolean)
    points_earned = Column(Float)
    points_possible = Column(Float)
    time_spent_seconds = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    attempt = relationship("AssessmentAttempt", back_populates="responses")
    question = relationship("Question", back_populates="responses")
    feedback = relationship("ResponseFeedback", back_populates="response", uselist=False)

class GradingResult(Base):
    __tablename__ = "grading_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    attempt_id = Column(UUID(as_uuid=True), ForeignKey("assessment_attempts.id", ondelete="CASCADE"), nullable=False, unique=True)
    grading_status = Column(Enum(GradingStatus), default=GradingStatus.PENDING)
    auto_graded_score = Column(Float)
    manual_graded_score = Column(Float)
    final_score = Column(Float)
    graded_by_user_id = Column(UUID(as_uuid=True))
    graded_at = Column(DateTime(timezone=True))
    feedback = Column(Text)
    grading_time_seconds = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    attempt = relationship("AssessmentAttempt", back_populates="grading_result")

class ResponseFeedback(Base):
    __tablename__ = "response_feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    response_id = Column(UUID(as_uuid=True), ForeignKey("question_responses.id", ondelete="CASCADE"), nullable=False, unique=True)
    feedback_text = Column(Text)
    is_ai_generated = Column(Boolean, default=False)
    ai_model_used = Column(String(100))
    confidence_score = Column(Float)
    strengths = Column(JSON)
    weaknesses = Column(JSON)
    suggestions = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    response = relationship("QuestionResponse", back_populates="feedback")

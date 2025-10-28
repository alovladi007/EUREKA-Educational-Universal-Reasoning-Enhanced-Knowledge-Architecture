"""
Database models for Assessment Engine
"""
from sqlalchemy import Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class Assessment(Base):
    """Assessment/Quiz/Exam"""
    __tablename__ = "assessments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Assessment info
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    assessment_type = Column(String(50), nullable=False)  # quiz, exam, assignment, homework
    
    # Configuration
    total_points = Column(Float, default=100.0)
    passing_score = Column(Float, default=60.0)
    time_limit_minutes = Column(Integer, nullable=True)
    
    # Settings
    shuffle_questions = Column(Boolean, default=False)
    show_correct_answers = Column(Boolean, default=True)
    allow_multiple_attempts = Column(Boolean, default=True)
    max_attempts = Column(Integer, default=3)
    
    # Grading
    auto_grade = Column(Boolean, default=True)
    use_rubric = Column(Boolean, default=False)
    
    # Status
    is_published = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    due_date = Column(DateTime(timezone=True), nullable=True)


class Question(Base):
    """Question in an assessment"""
    __tablename__ = "questions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"), nullable=False, index=True)
    
    # Question content
    question_type = Column(String(50), nullable=False)  # multiple_choice, true_false, short_answer, essay, code, math
    question_text = Column(Text, nullable=False)
    question_number = Column(Integer, nullable=False)
    
    # Points
    points = Column(Float, default=1.0)
    
    # Multiple choice options
    options = Column(JSON, nullable=True)  # [{"id": "A", "text": "..."}]
    correct_answer = Column(Text, nullable=True)  # For auto-gradable questions
    
    # Answer key (for AI grading)
    answer_key = Column(Text, nullable=True)  # Expected answer or key points
    keywords = Column(ARRAY(String), nullable=True)  # Important keywords to check
    
    # Metadata
    difficulty = Column(String(20), default="medium")  # easy, medium, hard
    topics = Column(ARRAY(String), nullable=True)
    
    # Media
    has_image = Column(Boolean, default=False)
    image_url = Column(String(1000), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Rubric(Base):
    """Grading rubric for questions"""
    __tablename__ = "rubrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id"), nullable=False, index=True)
    
    # Rubric name
    name = Column(String(255), nullable=False)
    
    # Criteria
    criteria = Column(JSON, nullable=False)  # [{"name": "...", "points": ..., "description": "..."}]
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Submission(Base):
    """Student submission for an assessment"""
    __tablename__ = "submissions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Submission info
    attempt_number = Column(Integer, default=1)
    
    # Status
    status = Column(String(20), default="in_progress")  # in_progress, submitted, graded
    
    # Scoring
    total_score = Column(Float, nullable=True)
    max_score = Column(Float, nullable=True)
    percentage = Column(Float, nullable=True)
    grade = Column(String(5), nullable=True)  # A, B, C, etc.
    
    # Timing
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    graded_at = Column(DateTime(timezone=True), nullable=True)
    time_spent_seconds = Column(Integer, nullable=True)
    
    # Feedback
    overall_feedback = Column(Text, nullable=True)
    ai_generated_feedback = Column(Boolean, default=False)


class Answer(Base):
    """Student answer to a question"""
    __tablename__ = "answers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submission_id = Column(UUID(as_uuid=True), ForeignKey("submissions.id"), nullable=False, index=True)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id"), nullable=False, index=True)
    
    # Answer content
    answer_text = Column(Text, nullable=True)
    selected_option = Column(String(10), nullable=True)  # For multiple choice
    
    # Grading
    is_correct = Column(Boolean, nullable=True)
    points_earned = Column(Float, nullable=True)
    points_possible = Column(Float, nullable=True)
    
    # Feedback
    feedback = Column(Text, nullable=True)
    graded_by_ai = Column(Boolean, default=False)
    
    # Similarity (for plagiarism detection)
    similarity_score = Column(Float, nullable=True)
    flagged_for_review = Column(Boolean, default=False)
    
    # Timestamps
    answered_at = Column(DateTime(timezone=True), server_default=func.now())
    graded_at = Column(DateTime(timezone=True), nullable=True)


class RubricScore(Base):
    """Score for each rubric criterion"""
    __tablename__ = "rubric_scores"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    answer_id = Column(UUID(as_uuid=True), ForeignKey("answers.id"), nullable=False, index=True)
    rubric_id = Column(UUID(as_uuid=True), ForeignKey("rubrics.id"), nullable=False)
    
    # Criterion being scored
    criterion_name = Column(String(255), nullable=False)
    
    # Score
    points_earned = Column(Float, nullable=False)
    points_possible = Column(Float, nullable=False)
    
    # Feedback for this criterion
    feedback = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AssessmentAnalytics(Base):
    """Analytics for assessments"""
    __tablename__ = "assessment_analytics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"), nullable=False, index=True)
    
    # Statistics
    total_submissions = Column(Integer, default=0)
    average_score = Column(Float, nullable=True)
    median_score = Column(Float, nullable=True)
    highest_score = Column(Float, nullable=True)
    lowest_score = Column(Float, nullable=True)
    
    # Distribution
    score_distribution = Column(JSON, nullable=True)  # {"0-20": 5, "21-40": 10, ...}
    
    # Difficulty analysis
    easy_questions_avg = Column(Float, nullable=True)
    medium_questions_avg = Column(Float, nullable=True)
    hard_questions_avg = Column(Float, nullable=True)
    
    # Question analysis
    question_performance = Column(JSON, nullable=True)  # {question_id: avg_score}
    
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

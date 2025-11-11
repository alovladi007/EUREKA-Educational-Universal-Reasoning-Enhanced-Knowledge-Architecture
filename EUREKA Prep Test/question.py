"""
Question model with Item Response Theory (IRT) parameters
"""
from sqlalchemy import Column, String, Text, Integer, Float, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class Question(Base):
    """
    Question model with adaptive learning parameters
    """
    __tablename__ = "questions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Content
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), nullable=False)  # multiple_choice, true_false, fill_blank, essay
    options = Column(JSON)  # For multiple choice questions
    correct_answer = Column(JSON, nullable=False)  # Can be string or list for multiple correct answers
    explanation = Column(Text)  # Detailed explanation of the answer
    hint = Column(Text)  # Optional hint for the question
    
    # Media
    image_url = Column(String(500))
    video_url = Column(String(500))
    audio_url = Column(String(500))
    
    # Categorization
    exam_type = Column(String(50), nullable=False, index=True)  # GRE, GMAT, SAT, etc.
    subject = Column(String(100), nullable=False, index=True)  # Math, Verbal, Science, etc.
    topic = Column(String(200), nullable=False, index=True)  # Algebra, Reading Comprehension, etc.
    subtopic = Column(String(200))  # Linear Equations, Main Idea, etc.
    skills_tested = Column(JSON)  # List of skills this question tests
    
    # IRT Parameters (Item Response Theory)
    difficulty = Column(Float, nullable=False, default=0.0)  # -3 to +3 (theta scale)
    discrimination = Column(Float, nullable=False, default=1.0)  # How well question differentiates abilities
    guessing = Column(Float, nullable=False, default=0.25)  # Probability of guessing correctly
    upper_asymptote = Column(Float, default=1.0)  # Maximum probability of correct answer
    
    # Adaptive Parameters
    exposure_count = Column(Integer, default=0)  # How many times question has been shown
    success_rate = Column(Float, default=0.5)  # Overall success rate
    avg_time_seconds = Column(Integer)  # Average time to answer
    confidence_interval = Column(Float, default=1.0)  # Confidence in IRT parameters
    
    # Quality Metrics
    quality_score = Column(Float, default=0.0)  # 0-1 score based on user feedback
    flagged = Column(Boolean, default=False)  # Flagged for review
    flag_count = Column(Integer, default=0)
    review_status = Column(String(50), default="pending")  # pending, approved, rejected
    
    # Source
    source = Column(String(200))  # Original source of question
    author_id = Column(String, ForeignKey("users.id"))
    is_official = Column(Boolean, default=False)  # Official vs user-generated
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_calibrated = Column(DateTime(timezone=True))  # Last IRT calibration
    
    # Tags for advanced filtering
    tags = Column(JSON, default=[])
    difficulty_label = Column(String(20))  # Easy, Medium, Hard, Expert
    estimated_time_seconds = Column(Integer, default=60)
    
    # Relationships
    attempts = relationship("QuestionAttempt", back_populates="question", cascade="all, delete-orphan")
    author = relationship("User", foreign_keys=[author_id])
    
    def __repr__(self):
        return f"<Question {self.id[:8]} - {self.exam_type}/{self.topic}>"
    
    def get_irt_probability(self, ability: float) -> float:
        """
        Calculate probability of correct answer using 3-parameter IRT model
        P(θ) = c + (1-c) / (1 + e^(-a(θ-b)))
        where:
        - θ (theta) = student ability
        - a = discrimination parameter
        - b = difficulty parameter  
        - c = guessing parameter
        """
        import math
        exp_val = math.exp(-self.discrimination * (ability - self.difficulty))
        probability = self.guessing + (self.upper_asymptote - self.guessing) / (1 + exp_val)
        return probability

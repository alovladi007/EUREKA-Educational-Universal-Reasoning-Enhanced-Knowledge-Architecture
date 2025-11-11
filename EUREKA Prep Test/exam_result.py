"""
Exam Result model for tracking complete exam performances
"""
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class ExamResult(Base):
    """
    Complete exam results and analytics
    """
    __tablename__ = "exam_results"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Exam Information
    exam_type = Column(String(50), nullable=False)  # GRE, GMAT, SAT, etc.
    exam_name = Column(String(200))
    exam_mode = Column(String(50), nullable=False)  # practice, mock, diagnostic
    
    # Scoring
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    score = Column(Float, nullable=False)
    scaled_score = Column(Float)  # Standardized score (e.g., 130-170 for GRE)
    percentile = Column(Float)  # Percentile rank
    
    # Section Scores (for multi-section exams)
    section_scores = Column(JSON, default={})  # {"verbal": 155, "quant": 168, "writing": 4.5}
    section_percentiles = Column(JSON, default={})
    
    # Timing
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True))
    total_duration_seconds = Column(Integer)
    time_per_section = Column(JSON, default={})
    
    # Performance Analytics
    accuracy_by_topic = Column(JSON, default={})  # {"algebra": 0.85, "geometry": 0.72}
    avg_time_by_topic = Column(JSON, default={})
    difficulty_distribution = Column(JSON, default={})  # How many easy/medium/hard questions
    
    # Adaptive Metrics
    final_ability_estimate = Column(Float)
    ability_by_section = Column(JSON, default={})
    confidence_interval = Column(Float)
    
    # Comparison
    peer_comparison = Column(JSON, default={})  # Comparison with other users
    improvement_from_last = Column(Float)  # Percentage improvement from last attempt
    
    # Feedback
    strengths = Column(JSON, default=[])  # Identified strong areas
    weaknesses = Column(JSON, default=[])  # Areas needing improvement
    ai_feedback = Column(Text)  # AI-generated feedback
    recommended_topics = Column(JSON, default=[])  # Topics to focus on
    
    # Status
    completed = Column(Boolean, default=False)
    flagged_for_review = Column(Boolean, default=False)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="exam_results")
    attempts = relationship("QuestionAttempt", back_populates="exam_result", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<ExamResult {self.exam_type} - Score: {self.score}>"


class StudyPlan(Base):
    """
    Personalized study plans for users
    """
    __tablename__ = "study_plans"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Plan Details
    plan_name = Column(String(200), nullable=False)
    exam_type = Column(String(50), nullable=False)
    target_date = Column(DateTime(timezone=True), nullable=False)
    target_score = Column(Float)
    
    # Schedule
    study_days_per_week = Column(Integer, default=5)
    minutes_per_day = Column(Integer, default=60)
    preferred_study_times = Column(JSON, default=[])  # ["morning", "evening"]
    
    # Content Distribution
    topic_weights = Column(JSON, default={})  # {"algebra": 0.3, "geometry": 0.2, ...}
    difficulty_progression = Column(String(50), default="adaptive")  # adaptive, linear, custom
    
    # Progress
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    completion_percentage = Column(Float, default=0.0)
    total_study_minutes = Column(Integer, default=0)
    milestones = Column(JSON, default=[])
    
    # Performance Tracking
    initial_diagnostic_score = Column(Float)
    current_estimated_score = Column(Float)
    projected_score = Column(Float)
    
    # Status
    is_active = Column(Boolean, default=True)
    status = Column(String(50), default="active")  # active, paused, completed, abandoned
    
    # AI Recommendations
    ai_adjustments = Column(JSON, default=[])  # History of AI-recommended adjustments
    last_adjustment_date = Column(DateTime(timezone=True))
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="study_plans")
    
    def __repr__(self):
        return f"<StudyPlan {self.plan_name} - {self.exam_type}>"


class UserAchievement(Base):
    """
    Gamification achievements for user engagement
    """
    __tablename__ = "user_achievements"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Achievement Info
    achievement_type = Column(String(100), nullable=False)  # streak, accuracy, speed, milestone
    achievement_name = Column(String(200), nullable=False)
    achievement_description = Column(Text)
    icon_url = Column(String(500))
    
    # Progress
    current_value = Column(Float, default=0)
    target_value = Column(Float, nullable=False)
    progress_percentage = Column(Float, default=0.0)
    
    # Status
    unlocked = Column(Boolean, default=False)
    unlocked_at = Column(DateTime(timezone=True))
    
    # Rewards
    points_awarded = Column(Integer, default=0)
    badge_level = Column(String(50))  # bronze, silver, gold, platinum
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="achievements")
    
    def __repr__(self):
        return f"<UserAchievement {self.achievement_name} - {'Unlocked' if self.unlocked else 'Locked'}>"

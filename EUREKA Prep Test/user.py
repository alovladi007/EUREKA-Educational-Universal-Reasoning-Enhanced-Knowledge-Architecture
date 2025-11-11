"""
User model for authentication and profile management
"""
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class User(Base):
    """
    User model for the platform
    """
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    full_name = Column(String(255))
    hashed_password = Column(String(255), nullable=False)
    
    # Profile
    avatar_url = Column(String(500))
    bio = Column(String(1000))
    education_level = Column(String(50))  # high_school, undergraduate, graduate, professional
    target_exams = Column(JSON)  # List of exam types user is preparing for
    
    # Settings
    preferred_difficulty = Column(Integer, default=5)  # 1-10 scale
    daily_goal_minutes = Column(Integer, default=30)
    notification_preferences = Column(JSON, default={})
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Statistics (cached)
    total_questions_answered = Column(Integer, default=0)
    total_study_time_minutes = Column(Integer, default=0)
    current_streak_days = Column(Integer, default=0)
    longest_streak_days = Column(Integer, default=0)
    overall_accuracy = Column(Float, default=0.0)
    
    # Relationships
    sessions = relationship("StudySession", back_populates="user", cascade="all, delete-orphan")
    attempts = relationship("QuestionAttempt", back_populates="user", cascade="all, delete-orphan")
    exam_results = relationship("ExamResult", back_populates="user", cascade="all, delete-orphan")
    study_plans = relationship("StudyPlan", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User {self.username}>"

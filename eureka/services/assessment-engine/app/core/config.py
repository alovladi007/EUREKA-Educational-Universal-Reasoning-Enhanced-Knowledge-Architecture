"""
Configuration for Assessment Engine
"""
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Service configuration"""
    
    # Service
    SERVICE_NAME: str = "assessment-engine"
    PORT: int = 8003
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://eureka:eureka123@localhost:5432/eureka"
    
    # OpenAI for grading
    OPENAI_API_KEY: Optional[str] = None
    GRADING_MODEL: str = "gpt-4-turbo-preview"
    GRADING_TEMPERATURE: float = 0.3  # Lower temperature for consistent grading
    
    # Assessment Configuration
    SIMILARITY_THRESHOLD: float = 0.85  # Threshold for answer similarity
    PASSING_GRADE: float = 60.0
    
    # Question Types
    QUESTION_TYPES: list[str] = [
        "multiple_choice",
        "true_false",
        "short_answer",
        "essay",
        "code",
        "math"
    ]
    
    # Grading
    AUTO_GRADE_TYPES: list[str] = ["multiple_choice", "true_false"]
    AI_GRADE_TYPES: list[str] = ["short_answer", "essay", "code"]
    
    class Config:
        env_file = ".env"

settings = Settings()

"""
Adaptive Learning Service - Configuration
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Service configuration"""
    
    # Service info
    SERVICE_NAME: str = "adaptive-learning"
    VERSION: str = "1.0.0"
    PORT: int = 8004
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://eureka:eureka123@localhost:5432/eureka"
    
    # Adaptive learning parameters
    MASTERY_THRESHOLD: float = 0.85  # 85% to be considered mastered
    CONFIDENCE_THRESHOLD: float = 0.75  # 75% confidence required
    MIN_ATTEMPTS_FOR_MASTERY: int = 3  # Minimum attempts before mastery
    
    # Difficulty adjustment
    DIFFICULTY_STEP_SIZE: float = 0.1  # How much to adjust difficulty
    ACCURACY_THRESHOLD_UP: float = 0.8  # Increase difficulty if > 80%
    ACCURACY_THRESHOLD_DOWN: float = 0.5  # Decrease difficulty if < 50%
    
    # Recommendations
    MAX_RECOMMENDATIONS: int = 5
    RECOMMENDATION_EXPIRY_HOURS: int = 24
    
    # Skill gaps
    GAP_SEVERITY_THRESHOLD: float = 0.6  # Mark as gap if severity > 60%
    
    # Learning paths
    DEFAULT_PATH_LENGTH: int = 10  # Default concepts in a path
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()

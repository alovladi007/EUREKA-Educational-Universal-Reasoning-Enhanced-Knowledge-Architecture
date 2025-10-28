"""
Analytics Dashboard Service - Configuration
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Service configuration"""
    
    # Service info
    SERVICE_NAME: str = "analytics-dashboard"
    VERSION: str = "1.0.0"
    PORT: int = 8005
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://eureka:eureka123@localhost:5432/eureka"
    
    # Analytics parameters
    AT_RISK_THRESHOLD: float = 0.6  # 60% risk score triggers alert
    LOW_ENGAGEMENT_DAYS: int = 7  # Days of inactivity = low engagement
    FAILING_THRESHOLD: float = 0.6  # Below 60% = failing
    
    # Performance metrics
    PERFORMANCE_EXCELLENT: float = 0.9  # 90%+
    PERFORMANCE_GOOD: float = 0.75  # 75%+
    PERFORMANCE_AVERAGE: float = 0.6  # 60%+
    
    # Engagement metrics
    ENGAGEMENT_HIGH_LOGINS_PER_WEEK: int = 5
    ENGAGEMENT_HIGH_TIME_PER_WEEK: int = 300  # 5 hours
    
    # Calculation intervals
    ANALYTICS_REFRESH_HOURS: int = 6  # Recalculate every 6 hours
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()

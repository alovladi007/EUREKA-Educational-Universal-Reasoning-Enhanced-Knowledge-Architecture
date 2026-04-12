"""
Application configuration settings
"""
from typing import List, Optional, Union
from pydantic_settings import BaseSettings
import os
import json


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    # Application
    APP_NAME: str = "EUREKA Test Prep"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    PORT: int = int(os.getenv("PORT", "8200"))

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./qbank/questions.db"
    )

    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # CORS — stored as comma-separated string to avoid pydantic-settings parsing issues
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://localhost:8000,https://eureka-test-prep.com"

    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse ALLOWED_ORIGINS string into a list."""
        if not self.ALLOWED_ORIGINS:
            return ["http://localhost:3000"]
        # Handle both JSON array and comma-separated formats
        raw = self.ALLOWED_ORIGINS.strip()
        if raw.startswith("["):
            try:
                parsed = json.loads(raw)
                if isinstance(parsed, list):
                    return [str(s).strip() for s in parsed]
            except (json.JSONDecodeError, TypeError):
                pass
        return [s.strip() for s in raw.split(",") if s.strip()]
    
    # OpenAI
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    
    # Adaptive Engine Settings
    MIN_QUESTIONS_FOR_ADAPTATION: int = 5
    DIFFICULTY_LEVELS: int = 10
    IRT_DISCRIMINATION_PARAM: float = 1.0
    IRT_GUESSING_PARAM: float = 0.25
    
    # Question Bank
    QUESTIONS_PER_PAGE: int = 20
    MAX_QUESTION_LENGTH: int = 5000
    
    # Exam Settings
    DEFAULT_EXAM_DURATION_MINUTES: int = 180
    MIN_QUESTIONS_PER_EXAM: int = 20
    MAX_QUESTIONS_PER_EXAM: int = 200
    
    # Analytics
    ANALYTICS_RETENTION_DAYS: int = 365
    PERFORMANCE_CACHE_TTL: int = 3600  # 1 hour in seconds
    
    # Email (for notifications)
    SMTP_HOST: Optional[str] = os.getenv("SMTP_HOST")
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER")
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD")
    
    # File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Celery
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/1")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/2")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()

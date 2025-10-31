"""
Configuration for EUREKA Medical School Service
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Medical School service configuration."""
    
    # Service Info
    SERVICE_NAME: str = "medical-school"
    PORT: int = 8020
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://eureka:eureka123@localhost:5432/eureka"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/10"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:4500",
        "http://localhost:8000",
    ]
    
    # API Core Integration
    API_CORE_URL: str = "http://localhost:8000"
    TUTOR_LLM_URL: str = "http://localhost:8002"
    ASSESSMENT_ENGINE_URL: str = "http://localhost:8003"
    
    # HIPAA Compliance
    HIPAA_MODE: bool = True
    PHI_LOGGING: bool = False  # Never log PHI
    AUTO_LOGOFF_MINUTES: int = 15
    AUDIT_RETENTION_YEARS: int = 6
    
    # Medical Education Settings
    USMLE_DIFFICULTY_LEVELS: List[str] = ["Step 1", "Step 2 CK", "Step 2 CS", "Step 3"]
    DEFAULT_CASE_DURATION_MINUTES: int = 20
    OSCE_STATION_DURATION_MINUTES: int = 10
    
    # AI Integration
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    AI_MODEL: str = "gpt-4-turbo-preview"
    AI_TEMPERATURE: float = 0.7
    
    # De-identification
    ENABLE_AUTO_DEIDENTIFICATION: bool = True
    PHI_DETECTION_THRESHOLD: float = 0.8
    
    # Content Limits
    MAX_CASE_COMPLEXITY: int = 5  # 1-5 scale
    MAX_DIFFERENTIAL_ITEMS: int = 10
    MAX_HISTORY_LENGTH: int = 2000
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

"""
EUREKA Pedagogical Intelligence Layer - Configuration
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""

    # Service Info
    SERVICE_NAME: str = "EUREKA Pedagogical Intelligence"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"

    # API
    API_V1_PREFIX: str = "/api/v1"
    PORT: int = 8040

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://eureka:eureka_dev_password@localhost:5432/eureka"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/9"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8040",
    ]

    # ML Model Settings
    DKT_HIDDEN_DIM: int = 128
    DKT_NUM_LAYERS: int = 2
    DKT_DROPOUT: float = 0.2
    DKT_MIN_AUC: float = 0.72  # Minimum acceptable AUC

    IRT_MODEL_TYPE: str = "2PL"  # 2PL or 3PL
    IRT_COLD_START_PRIOR: float = 0.5  # Prior for new learners

    # Forgetting Curve
    FORGETTING_INITIAL_STRENGTH: float = 1.0
    FORGETTING_DECAY_RATE: float = 0.5
    FORGETTING_MIN_INTERVAL_DAYS: int = 1

    # Metacognition Coach
    METACOG_REFLECTION_PROMPTS: List[str] = [
        "What was the most challenging part of today's learning?",
        "What strategy helped you the most?",
        "What would you do differently next time?",
        "How confident do you feel about what you learned?",
    ]

    # Tone Adapter States
    TONE_STATES: List[str] = ["neutral", "encouraging", "challenging", "supportive", "frustrated"]

    # Compliance
    COMPLIANCE_ENABLED: bool = True
    ETHICS_CHECK_ENABLED: bool = True

    # External Services
    API_CORE_URL: str = "http://localhost:8000"
    TUTOR_LLM_URL: str = "http://localhost:8010"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

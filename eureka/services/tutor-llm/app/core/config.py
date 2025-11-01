"""
AI Tutor Service - Configuration
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Service configuration"""
    
    # Service info
    SERVICE_NAME: str = "ai-tutor"
    VERSION: str = "1.0.0"
    PORT: int = 8050
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://eureka:eureka123@localhost:5432/eureka"
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    OPENAI_TEMPERATURE: float = 0.7
    OPENAI_MAX_TOKENS: int = 1000
    
    # Anthropic Configuration (optional alternative)
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-3-opus-20240229"
    ANTHROPIC_TEMPERATURE: float = 0.7
    ANTHROPIC_MAX_TOKENS: int = 1000
    
    # Embedding Configuration
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    EMBEDDING_DIMENSIONS: int = 1536
    
    # RAG Configuration
    TOP_K_RESULTS: int = 5  # Number of similar chunks to retrieve
    SIMILARITY_THRESHOLD: float = 0.7  # Minimum similarity score
    
    # Teaching Configuration
    USE_SOCRATIC_METHOD: bool = True
    GENERATE_FOLLOW_UPS: bool = True
    MAX_FOLLOW_UP_QUESTIONS: int = 3
    
    # Knowledge Tracking
    MASTERY_THRESHOLD: float = 0.85  # 85% mastery required
    CONFIDENCE_THRESHOLD: float = 0.75  # 75% confidence required
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()

# Create a settings instance for easy import
settings = get_settings()

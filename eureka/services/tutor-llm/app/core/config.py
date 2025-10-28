"""
Configuration for Tutor-LLM Service
"""
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Service configuration"""
    
    # Service
    SERVICE_NAME: str = "tutor-llm"
    PORT: int = 8050  # Changed from 8002 to avoid conflict with ATLAS-ML
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://eureka:eureka123@localhost:5432/eureka"
    
    # OpenAI
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    OPENAI_TEMPERATURE: float = 0.7
    OPENAI_MAX_TOKENS: int = 2000
    
    # Anthropic (Claude)
    ANTHROPIC_API_KEY: Optional[str] = None
    ANTHROPIC_MODEL: str = "claude-3-opus-20240229"
    
    # RAG Configuration
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    EMBEDDING_DIMENSION: int = 1536
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    TOP_K_RESULTS: int = 5
    
    # Conversation
    MAX_CONVERSATION_HISTORY: int = 20
    CONVERSATION_TIMEOUT_HOURS: int = 24
    
    # Teaching Style
    USE_SOCRATIC_METHOD: bool = True
    DIFFICULTY_LEVELS: list[str] = ["beginner", "intermediate", "advanced"]
    
    class Config:
        env_file = ".env"

settings = Settings()

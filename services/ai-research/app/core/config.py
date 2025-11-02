"""
Configuration for AI Research Core
"""
from pydantic_settings import BaseSettings
from typing import Optional, List


class Settings(BaseSettings):
    """Application settings"""

    # Service Info
    SERVICE_NAME: str = "EUREKA AI Research Core"
    VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"

    # LLM API Keys
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    # Multi-Agent Settings
    DEFAULT_LLM_MODEL: str = "gpt-4-turbo-preview"
    MAX_AGENTS_PER_CREW: int = 5
    AGENT_TIMEOUT_SECONDS: int = 300
    ENABLE_AGENT_MEMORY: bool = True

    # Research Settings
    ARXIV_MAX_RESULTS: int = 10
    PAPER_CACHE_DIR: str = "/data/research/papers"
    ENABLE_WEB_SEARCH: bool = True

    # Federated Learning
    FL_SERVER_ADDRESS: str = "0.0.0.0:8080"
    FL_MIN_CLIENTS: int = 2
    FL_ROUNDS: int = 3
    FL_FRACTION_FIT: float = 0.5

    # Vector Database
    CHROMA_DB_PATH: str = "/data/research/chromadb"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # External Services
    PEDAGOGY_SERVICE_URL: str = "http://localhost:8040"
    API_CORE_URL: str = "http://localhost:8000"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

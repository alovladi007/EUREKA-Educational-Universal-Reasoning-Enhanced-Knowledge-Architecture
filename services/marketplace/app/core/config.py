"""
Configuration for EUREKA Marketplace Service
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""

    # Service Info
    SERVICE_NAME: str = "EUREKA Marketplace"
    VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://eureka:eureka@localhost:5432/eureka_marketplace"

    # Payment Processing
    STRIPE_API_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    STRIPE_PUBLISHABLE_KEY: Optional[str] = None

    # Storage
    CONTENT_STORAGE_PATH: str = "/data/marketplace/content"
    MAX_CONTENT_SIZE_MB: int = 500
    ALLOWED_CONTENT_TYPES: list = [
        "application/zip",  # SCORM packages
        "application/json",  # xAPI statements
        "text/html",  # H5P content
        "video/mp4",
        "application/pdf"
    ]

    # Marketplace Settings
    CREATOR_COMMISSION_RATE: float = 0.70  # 70% to creator
    PLATFORM_FEE_RATE: float = 0.30  # 30% platform fee
    MIN_PRICE_USD: float = 0.99
    MAX_PRICE_USD: float = 9999.99

    # VC Simulation Settings
    VC_STARTING_CAPITAL: float = 100000.00
    VC_MAX_INVESTMENT_PER_CONTENT: float = 50000.00
    VC_MIN_ROI_THRESHOLD: float = 0.15  # 15% ROI

    # Security & Compliance
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    COMPLIANCE_ENABLED: bool = True

    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:8080"]

    # External Services
    PEDAGOGY_SERVICE_URL: str = "http://localhost:8040"
    API_CORE_URL: str = "http://localhost:8000"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

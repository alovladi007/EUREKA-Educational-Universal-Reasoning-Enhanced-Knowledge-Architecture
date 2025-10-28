"""
Configuration settings for EUREKA API Core

Loads configuration from environment variables with validation.
"""

from pydantic_settings import BaseSettings
from pydantic import Field, PostgresDsn, validator
from typing import List, Optional
import secrets


class Settings(BaseSettings):
    """Application settings"""
    
    # Environment
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    DEBUG: bool = Field(default=True, env="DEBUG")
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    
    # API
    API_TITLE: str = "EUREKA API Core"
    API_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: PostgresDsn = Field(..., env="DATABASE_URL")
    DB_POOL_SIZE: int = Field(default=20, env="DB_POOL_SIZE")
    DB_MAX_OVERFLOW: int = Field(default=10, env="DB_MAX_OVERFLOW")
    DB_ECHO: bool = Field(default=False, env="DB_ECHO")
    
    # Redis
    REDIS_URL: str = Field(..., env="REDIS_URL")
    REDIS_MAX_CONNECTIONS: int = Field(default=50, env="REDIS_MAX_CONNECTIONS")
    
    # Security
    JWT_SECRET: str = Field(default_factory=lambda: secrets.token_urlsafe(32), env="JWT_SECRET")
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    JWT_EXPIRATION_MINUTES: int = Field(default=60, env="JWT_EXPIRATION_MINUTES")
    REFRESH_TOKEN_EXPIRATION_DAYS: int = Field(default=30, env="REFRESH_TOKEN_EXPIRATION_DAYS")
    
    # Password hashing
    PWD_CONTEXT_SCHEMES: List[str] = ["bcrypt"]
    PWD_CONTEXT_DEPRECATED: str = "auto"
    
    # CORS
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:3001"],
        env="CORS_ORIGINS"
    )
    
    # S3/MinIO
    S3_ENDPOINT: str = Field(..., env="S3_ENDPOINT")
    S3_ACCESS_KEY: str = Field(..., env="S3_ACCESS_KEY")
    S3_SECRET_KEY: str = Field(..., env="S3_SECRET_KEY")
    S3_BUCKET_NAME: str = Field(default="eureka", env="S3_BUCKET_NAME")
    S3_REGION: str = Field(default="us-east-1", env="S3_REGION")
    
    # Auth Provider
    AUTH_PROVIDER: str = Field(default="ory", env="AUTH_PROVIDER")
    
    # Ory Kratos/Hydra
    ORY_KRATOS_URL: Optional[str] = Field(default=None, env="ORY_KRATOS_URL")
    ORY_HYDRA_URL: Optional[str] = Field(default=None, env="ORY_HYDRA_URL")
    
    # Auth0
    AUTH0_DOMAIN: Optional[str] = Field(default=None, env="AUTH0_DOMAIN")
    AUTH0_CLIENT_ID: Optional[str] = Field(default=None, env="AUTH0_CLIENT_ID")
    AUTH0_CLIENT_SECRET: Optional[str] = Field(default=None, env="AUTH0_CLIENT_SECRET")
    AUTH0_AUDIENCE: Optional[str] = Field(default=None, env="AUTH0_AUDIENCE")
    
    # SMTP
    SMTP_HOST: Optional[str] = Field(default=None, env="SMTP_HOST")
    SMTP_PORT: int = Field(default=587, env="SMTP_PORT")
    SMTP_USERNAME: Optional[str] = Field(default=None, env="SMTP_USERNAME")
    SMTP_PASSWORD: Optional[str] = Field(default=None, env="SMTP_PASSWORD")
    SMTP_FROM_EMAIL: str = Field(default="noreply@eureka.edu", env="SMTP_FROM_EMAIL")
    SMTP_FROM_NAME: str = Field(default="EUREKA Platform", env="SMTP_FROM_NAME")
    
    # Compliance
    FERPA_MODE: bool = Field(default=True, env="FERPA_MODE")
    DATA_RETENTION_DAYS: int = Field(default=2555, env="DATA_RETENTION_DAYS")  # 7 years
    HIPAA_MODE: bool = Field(default=False, env="HIPAA_MODE")
    COPPA_MODE: bool = Field(default=True, env="COPPA_MODE")
    PARENTAL_CONSENT_REQUIRED: bool = Field(default=True, env="PARENTAL_CONSENT_REQUIRED")
    MINIMUM_AGE: int = Field(default=13, env="MINIMUM_AGE")
    
    # Feature Flags
    FEATURE_GAMIFICATION: bool = Field(default=True, env="FEATURE_GAMIFICATION")
    FEATURE_MOBILE_APP: bool = Field(default=True, env="FEATURE_MOBILE_APP")
    FEATURE_PROCTORING: bool = Field(default=False, env="FEATURE_PROCTORING")
    FEATURE_RESEARCH_MODE: bool = Field(default=False, env="FEATURE_RESEARCH_MODE")
    FEATURE_MULTILINGUAL: bool = Field(default=True, env="FEATURE_MULTILINGUAL")
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = Field(default=60, env="RATE_LIMIT_PER_MINUTE")
    RATE_LIMIT_PER_HOUR: int = Field(default=1000, env="RATE_LIMIT_PER_HOUR")
    
    # Monitoring
    SENTRY_DSN: Optional[str] = Field(default=None, env="SENTRY_DSN")
    
    # Internationalization
    DEFAULT_LOCALE: str = Field(default="en-US", env="DEFAULT_LOCALE")
    SUPPORTED_LOCALES: List[str] = Field(
        default=["en-US", "es-ES", "zh-CN", "de-DE"],
        env="SUPPORTED_LOCALES"
    )
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 50
    MAX_PAGE_SIZE: int = 500
    
    # Vault (for production secrets)
    VAULT_ENABLED: bool = Field(default=False, env="VAULT_ENABLED")
    VAULT_ADDR: Optional[str] = Field(default=None, env="VAULT_ADDR")
    VAULT_TOKEN: Optional[str] = Field(default=None, env="VAULT_TOKEN")
    
    @validator("CORS_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        """Parse CORS origins from string or list"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    @validator("SUPPORTED_LOCALES", pre=True)
    def parse_locales(cls, v):
        """Parse supported locales from string or list"""
        if isinstance(v, str):
            return [locale.strip() for locale in v.split(",")]
        return v
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Create global settings instance
settings = Settings()

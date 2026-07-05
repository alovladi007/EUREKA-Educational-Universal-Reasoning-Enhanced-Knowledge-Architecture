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
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://eureka:eurekapass@localhost:5432/eureka",
        env="DATABASE_URL"
    )
    DB_POOL_SIZE: int = Field(default=20, env="DB_POOL_SIZE")
    DB_MAX_OVERFLOW: int = Field(default=10, env="DB_MAX_OVERFLOW")
    DB_ECHO: bool = Field(default=False, env="DB_ECHO")
    
    # Redis
    REDIS_URL: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    REDIS_MAX_CONNECTIONS: int = Field(default=50, env="REDIS_MAX_CONNECTIONS")
    
    # Security
    JWT_SECRET: str = Field(default_factory=lambda: secrets.token_urlsafe(32), env="JWT_SECRET")
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    JWT_EXPIRATION_MINUTES: int = Field(default=60, env="JWT_EXPIRATION_MINUTES")
    REFRESH_TOKEN_EXPIRATION_DAYS: int = Field(default=30, env="REFRESH_TOKEN_EXPIRATION_DAYS")
    
    # Password hashing.
    # argon2id is the active scheme; bcrypt is kept for verifying legacy
    # hashes seeded in 2026-05 and earlier. The "deprecated=auto" plus
    # CryptContext.needs_update() machinery in app/utils/auth.py:verify_password
    # will transparently rehash a successful bcrypt login to argon2id.
    PWD_CONTEXT_SCHEMES: List[str] = ["argon2", "bcrypt"]
    PWD_CONTEXT_DEPRECATED: str = "auto"

    # MFA (TOTP)
    # Used to encrypt the per-user TOTP secret at rest (Fernet envelope).
    # In dev this is generated at boot; production must set MFA_ENVELOPE_KEY
    # explicitly so the key survives container restarts. See docs/SECURITY.md.
    MFA_ENVELOPE_KEY: str = Field(
        default_factory=lambda: __import__("base64").urlsafe_b64encode(
            __import__("secrets").token_bytes(32)
        ).decode(),
        env="MFA_ENVELOPE_KEY",
    )
    MFA_ISSUER: str = Field(default="EUREKA", env="MFA_ISSUER")
    MFA_REQUIRED_ROLES: List[str] = Field(
        default=["org_admin", "super_admin", "instructor"],
        env="MFA_REQUIRED_ROLES",
    )
    
    # CORS
    CORS_ORIGINS: List[str] = Field(
        default=[
            "http://localhost:3000", "http://localhost:3001",
            "http://localhost:4040", "http://localhost:4041",
        ],
        env="CORS_ORIGINS"
    )
    
    # S3/MinIO
    S3_ENDPOINT: str = Field(default="http://localhost:9000", env="S3_ENDPOINT")
    S3_ACCESS_KEY: str = Field(default="minioadmin", env="S3_ACCESS_KEY")
    S3_SECRET_KEY: str = Field(default="minioadmin", env="S3_SECRET_KEY")
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
    
    # AI / LLM
    ANTHROPIC_API_KEY: Optional[str] = Field(default=None, env="ANTHROPIC_API_KEY")
    OPENAI_API_KEY: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
    AI_MODEL: str = Field(default="claude-sonnet-4-20250514", env="AI_MODEL")
    AI_MAX_TOKENS: int = Field(default=2000, env="AI_MAX_TOKENS")
    AI_TEMPERATURE: float = Field(default=0.7, env="AI_TEMPERATURE")

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

    @validator("DEBUG")
    def _force_debug_off_in_prod(cls, v, values):
        """Never run with DEBUG on in production, even if the env var says so.

        DEBUG=True exposes /docs + /redoc and returns raw exception strings
        on 500s (see main.py). Its default is True for local dev, so a
        deploy that forgets DEBUG=false would leak internals — this hard
        override closes that gap. ENVIRONMENT is validated first (defined
        earlier), so it's available in `values`.
        """
        if str(values.get("ENVIRONMENT", "development")).lower() == "production":
            return False
        return v
    
    @validator("SUPPORTED_LOCALES", pre=True)
    def parse_locales(cls, v):
        """Parse supported locales from string or list"""
        if isinstance(v, str):
            return [locale.strip() for locale in v.split(",")]
        return v

    @validator("JWT_SECRET")
    def _require_strong_jwt_secret_in_prod(cls, v, values):
        """P1.3c: refuse to boot in production with a weak/unset JWT secret.

        JWT_SECRET defaults to a random per-boot value when the env var is
        unset — fine for local dev, but in production that invalidates
        every token on restart and gives multi-replica deploys
        inconsistent secrets (tokens minted by one replica fail on
        another). It's also a footgun to ship a known dev secret. In
        `ENVIRONMENT=production` we require the env var to be explicitly
        set to a strong, non-default value; dev/test are unaffected.
        """
        if values.get("ENVIRONMENT") == "production":
            import os
            raw = os.environ.get("JWT_SECRET")
            weak = {
                "",
                "dev_jwt_secret_change_in_production",
                "eureka_dev_secret_key_change_in_production",
                "your-secret-key-here-change-in-production",
            }
            if not raw or raw in weak or len(v) < 32:
                raise ValueError(
                    "JWT_SECRET must be explicitly set to a strong (>=32 char), "
                    "non-default value when ENVIRONMENT=production. The env var "
                    "is missing or set to a known dev placeholder."
                )
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Create global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Return the global settings singleton."""
    return settings

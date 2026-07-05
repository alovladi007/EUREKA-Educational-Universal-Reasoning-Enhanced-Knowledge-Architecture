"""Application settings.

All configuration comes from environment variables (prefix AXIOM_). Defaults
are safe for local development. In production the identity provider must be
"hmac" or "jwks" and the EUREKA secret must be set to the real shared secret.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="AXIOM_", env_file=".env", extra="ignore")

    # Environment
    env: Literal["development", "staging", "production"] = "development"
    service_name: str = "axiom-api"
    version: str = "0.1.0"

    # Database. Async SQLAlchemy URL. Local default uses the compose Postgres.
    database_url: str = "postgresql+asyncpg://axiom:axiom@localhost:5440/axiom"

    # Redis (cache, Celery broker and backend).
    redis_url: str = "redis://localhost:6390/0"

    # CORS. The AXIOM web app runs on 4100; EUREKA on 4040.
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:4100",
            "http://localhost:4040",
        ]
    )

    # EUREKA integration (Section 17 of the build spec).
    # identity_provider selects how AXIOM verifies incoming tokens:
    #   "mock" - accept any token, return a fixed dev principal (local only).
    #   "hmac" - verify EUREKA HS256 JWTs with the shared secret.
    #   "jwks" - reserved for production (verify against EUREKA JWKS). Not built
    #            in Phase 0; selecting it raises at startup so we fail loud.
    identity_provider: Literal["mock", "hmac", "jwks"] = "mock"
    eureka_jwt_secret: str = "eureka_dev_secret_key_change_in_production"
    eureka_jwt_algorithm: str = "HS256"
    eureka_jwt_audience: str | None = None
    # Optional EUREKA base URL for the user directory enrichment (pull sync).
    eureka_api_base_url: str = "http://localhost:8000"
    # When true, the identity service calls EUREKA /api/v1/auth/me to enrich a
    # freshly seen user. When false (default in Phase 0), it derives a minimal
    # profile from the token claims so AXIOM does not hard-depend on EUREKA
    # being reachable during local development.
    eureka_directory_enrichment: bool = False

    # Observability
    log_level: str = "INFO"
    otel_exporter_otlp_endpoint: str | None = None

    @property
    def is_production(self) -> bool:
        return self.env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()

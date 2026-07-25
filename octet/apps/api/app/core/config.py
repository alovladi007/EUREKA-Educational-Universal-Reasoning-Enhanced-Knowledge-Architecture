"""OCTET settings.

Same shape as AXIOM's settings module with the env prefix changed, so the two
verticals stay operationally identical. Every subsystem that could have more
than one implementation is a Literal provider switch rather than a hard import,
which is how the grading sandbox, the identity bridge and (later) the tutor
gateway get swapped per environment.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="OCTET_", env_file=".env", extra="ignore")

    app_name: str = "OCTET"
    environment: Literal["local", "test", "staging", "production"] = "local"
    api_prefix: str = "/api/v1"

    database_url: str = "postgresql+asyncpg://octet:octet@localhost:5442/octet"
    redis_url: str = "redis://localhost:6393/0"

    # EUREKA is the identity provider. OCTET never owns auth.
    identity_provider: Literal["mock", "hmac", "jwks"] = "hmac"
    jwt_secret: str = "dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    eureka_api_url: str = "http://api-core:8000"

    # Grading sandbox. RDKit and SymPy on adversarial input are DoS vectors,
    # so the sandbox is on everywhere except the test suite and the Celery
    # worker, which already has process isolation.
    grading_sandbox: bool = True
    grading_timeout_seconds: float = 5.0
    grading_max_workers: int = 2

    cors_origins: str = "http://localhost:4200,http://localhost:4040"

    # Where a completed LTI launch hands the learner off. OCTET's web app is on
    # 4200 under the port band recorded in the integration contract.
    web_base_url: str = "http://localhost:4200"

    # The LTI tool's RSA private key (PEM). Supplied in production so the JWKS
    # key id survives a restart. Empty means generate an ephemeral key.
    lti_tool_private_key: str = ""
    # Outbound calls to a platform (JWKS fetch, AGS token and score) are bounded
    # so a slow LMS cannot hold an OCTET request open.
    lti_http_timeout_seconds: float = 8.0

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

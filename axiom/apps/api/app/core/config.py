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

    # Copilot reasoning (Phase 3). reasoning_provider selects the backend the
    # copilot calls, behind a swappable interface (ADR 0001):
    #   "mock"   - deterministic, curriculum-grounded responses. Local and tests.
    #   "eureka" - call EUREKA's reasoning core over HTTP. Falls back to the mock
    #              on any error so development never hard-depends on it.
    reasoning_provider: Literal["mock", "eureka"] = "mock"
    eureka_reasoning_base_url: str = "http://localhost:8000"
    reasoning_timeout_seconds: float = 8.0

    # How the copilot ranks grounding passages (ADR 0006):
    #   "lexical"  - exact token overlap (the original ranker).
    #   "semantic" - cosine over deterministic local embeddings (offline).
    #   "hybrid"   - lexical plus semantic, which catches related word forms an
    #                exact match misses. This is the default.
    retrieval_mode: Literal["lexical", "semantic", "hybrid"] = "hybrid"

    # Integrations (Phase 4).
    # Where the web app lives, used to redirect an LTI launch into AXIOM.
    web_base_url: str = "http://localhost:4100"
    # The tool's RSA private key (PEM) for the LTI JWKS and AGS/token assertions.
    # Empty in development generates an ephemeral key at first use; production
    # must supply a stable key so the JWKS kid does not change across restarts.
    lti_tool_private_key: str = ""

    # When true, slow AI free-response grading is handed to the Celery worker and
    # the client polls for the result; other kinds always grade inline. If the
    # broker is unreachable the request grades inline as a fallback, so an answer
    # is never lost. Tests set this false to keep grading synchronous.
    async_grading: bool = True

    # Assignment due-date reminders. The beat scheduler runs the reminder scan
    # every reminder_interval_seconds; a student is reminded once when an
    # assignment falls due within reminder_window_hours.
    reminder_interval_seconds: float = 3600.0
    reminder_window_hours: float = 24.0

    # Email delivery for notifications. email_provider selects the backend:
    # "console" logs the message (dev and tests), "smtp" sends over SMTP.
    # Delivery runs on the worker and fails soft, so the in-app notification is
    # never blocked by email. Only assignment, reminder, and grade kinds email.
    # SMTP credentials come from the environment in production; never commit them.
    email_enabled: bool = True
    email_provider: Literal["console", "smtp"] = "console"
    email_from: str = "axiom@localhost"
    smtp_host: str = "localhost"
    smtp_port: int = 25
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_use_tls: bool = True

    # Formal proof verification (Curriculum & Proof Extension, Section 4.1).
    # formal_verifier selects the proof-assistant backend for formal-track items:
    #   "none" - no toolchain; formal proofs are routed to manual review and
    #            never auto-passed (the honest default for a fresh install).
    #   "lean" - verify with a Lean 4 toolchain via a resource-limited
    #            subprocess. lean_binary is the executable to run.
    # A pass is only ever produced by a real kernel; there is no heuristic
    # stand-in for verification.
    formal_verifier: Literal["none", "lean"] = "none"
    lean_binary: str = "lean"
    formal_timeout_seconds: float = 20.0

    # Observability
    log_level: str = "INFO"
    otel_exporter_otlp_endpoint: str | None = None

    @property
    def is_production(self) -> bool:
        return self.env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()

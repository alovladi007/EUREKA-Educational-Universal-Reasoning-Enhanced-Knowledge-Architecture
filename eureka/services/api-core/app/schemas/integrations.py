"""
Phase 13 — Platform integrations Pydantic schemas.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


# -- 13.1 API keys ------------------------------------------------------------

class ApiKeyCreateRequest(BaseModel):
    name: str = Field(..., min_length=3, max_length=120)
    description: Optional[str] = None
    scopes: list[str] = Field(default_factory=list)
    rate_limit_per_min: int = Field(60, ge=0, le=10000)
    org_owned: bool = Field(False, description="If true, key belongs to caller's org instead of caller user.")
    expires_at: Optional[datetime] = None


class ApiKeyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    key_id: str
    user_id: Optional[UUID]
    org_id: Optional[UUID]
    name: str
    description: Optional[str]
    scopes: list[str]
    rate_limit_per_min: int
    status: str
    last_used_at: Optional[datetime]
    expires_at: Optional[datetime]
    created_at: datetime


class ApiKeyMintedResponse(ApiKeyResponse):
    # The full secret in the form "<key_id>.<secret>". ONLY returned at create.
    presented_token: str


# -- 13.2 Webhooks ------------------------------------------------------------

class WebhookCreateRequest(BaseModel):
    name: str = Field(..., min_length=3, max_length=120)
    url: str = Field(..., max_length=500)
    subscribed_events: list[str] = Field(default_factory=lambda: ["*"])
    org_owned: bool = False


class WebhookResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    url: str
    subscribed_events: list[str]
    is_active: bool
    last_success_at: Optional[datetime]
    last_failure_at: Optional[datetime]
    consecutive_failures: int
    created_at: datetime


class WebhookCreatedResponse(WebhookResponse):
    # Returned only at create time so the consumer can verify signatures.
    signing_secret: str


class WebhookDeliveryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    endpoint_id: UUID
    event: str
    status: str
    attempt_n: int
    last_status_code: Optional[int]
    last_response_excerpt: Optional[str]
    queued_at: datetime
    sent_at: Optional[datetime]
    delivered_at: Optional[datetime]
    next_retry_at: Optional[datetime]


class WebhookDeliveryOutcomeRequest(BaseModel):
    success: bool
    status_code: Optional[int] = None
    body_excerpt: Optional[str] = None


# -- 13.3 Embed tokens --------------------------------------------------------

class EmbedTokenCreateRequest(BaseModel):
    widget_kind: str  # "leaderboard" | "question" | "course_card" | "study_plan"
    params: dict = Field(default_factory=dict)
    allowed_origins: list[str] = Field(default_factory=list)
    ttl_minutes: int = Field(60, ge=1, le=1440)
    org_owned: bool = False


class EmbedTokenResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    widget_kind: str
    params: dict
    allowed_origins: list[str]
    expires_at: datetime
    revoked_at: Optional[datetime]
    created_at: datetime


class EmbedTokenMintedResponse(EmbedTokenResponse):
    token: str    # JWT, only returned at create


# -- 13.4 OAuth apps ----------------------------------------------------------

class OauthAppCreateRequest(BaseModel):
    name: str = Field(..., min_length=3, max_length=120)
    description: Optional[str] = None
    homepage_url: Optional[str] = None
    logo_url: Optional[str] = None
    redirect_uris: list[str] = Field(..., min_length=1)
    allowed_scopes: list[str] = Field(default_factory=list)
    org_owned: bool = False


class OauthAppResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    description: Optional[str]
    homepage_url: Optional[str]
    logo_url: Optional[str]
    client_id: str
    redirect_uris: list[str]
    allowed_scopes: list[str]
    status: str
    grant_count: int
    created_at: datetime
    approved_at: Optional[datetime]


class OauthAppMintedResponse(OauthAppResponse):
    client_secret: str   # returned only at create


class OauthAppApproveRequest(BaseModel):
    action: str  # "approve" | "suspend"


# -- 13.5 Compliance ----------------------------------------------------------

class ExportRequest(BaseModel):
    sections: Optional[list[str]] = None


class ExportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    status: str
    sections: list[str]
    payload_jsonb: Optional[dict]
    download_url: Optional[str]
    requested_at: datetime
    completed_at: Optional[datetime]
    expires_at: Optional[datetime]
    error_message: Optional[str]


class DeletionRequest(BaseModel):
    reason: Optional[str] = None
    days_until_execution: int = Field(30, ge=1, le=180)


class DeletionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    status: str
    reason: Optional[str]
    scheduled_for: datetime
    executed_at: Optional[datetime]
    canceled_at: Optional[datetime]
    canceled_reason: Optional[str]
    requested_at: datetime


class AuditEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    actor_user_id: Optional[UUID]
    subject_user_id: Optional[UUID]
    org_id: Optional[UUID]
    event_name: str
    severity: str
    request_ip: Optional[str]
    user_agent: Optional[str]
    extra: dict
    occurred_at: datetime

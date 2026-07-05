"""Identity and dashboard wire schemas.

AXIOM does not run its own password system. It verifies EUREKA-issued tokens
and syncs a minimal user record. The canonical role taxonomy mirrors EUREKA:
student, teacher, tutor, parent, org_admin, super_admin, researcher, author.
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class RoleName(str, Enum):
    """Canonical AXIOM role taxonomy, aligned to EUREKA roles."""

    student = "student"
    teacher = "teacher"
    tutor = "tutor"
    parent = "parent"
    org_admin = "org_admin"
    super_admin = "super_admin"
    researcher = "researcher"
    author = "author"


class Principal(BaseModel):
    """The verified identity extracted from an EUREKA token.

    This is what the identity provider returns after verifying a bearer token.
    It is not persisted directly; the identity service upserts a User from it.
    """

    model_config = ConfigDict(extra="ignore")

    sub: str = Field(description="EUREKA user id (UUID string)")
    email: str | None = None
    display_name: str | None = None
    roles: list[str] = Field(default_factory=list)
    tenant_id: str | None = None


class UserRef(BaseModel):
    """A compact user reference embedded in other payloads."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    display_name: str
    roles: list[str] = Field(default_factory=list)


class UserOut(BaseModel):
    """The full user record returned by GET /api/v1/me."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    eureka_user_id: str
    email: str
    display_name: str
    roles: list[str] = Field(default_factory=list)
    tenant_id: str | None = None
    created_at: datetime | None = None


class ModuleInfo(BaseModel):
    """A dashboard module tile.

    status is "available" when the module is usable in the current phase, and
    "planned" when it is on the roadmap but not built yet. The frontend labels
    planned modules honestly so the empty state does not overstate readiness.
    """

    key: str
    name: str
    status: str = Field(pattern=r"^(available|planned)$")
    description: str


class DashboardSummary(BaseModel):
    """Payload for GET /api/v1/dashboard/summary."""

    user: UserRef
    modules: list[ModuleInfo]
    mastery_summary: dict | None = None


class HealthOut(BaseModel):
    """Payload for GET /health."""

    status: str = "ok"
    service: str = "axiom-api"
    version: str = "0.1.0"

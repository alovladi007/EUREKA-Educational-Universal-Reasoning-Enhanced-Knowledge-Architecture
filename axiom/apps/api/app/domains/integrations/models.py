"""Integrations ORM models: LTI 1.3 platform registrations and launches.

An LtiPlatform is a registered LMS (an issuer plus its client id, deployment,
and endpoints). An LtiNonce is the short-lived state/nonce minted at OIDC login
and verified at launch (a one-time value that stops a replayed id_token). An
LtiLaunch records a validated launch: who launched, from which resource link,
and where AGS scores go back.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from app.core.db import Base


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


class LtiPlatform(Base):
    __tablename__ = "lti_platforms"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    # The platform's issuer (iss), unique per registration.
    issuer: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    client_id: Mapped[str] = mapped_column(String(255), nullable=False)
    deployment_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    # OIDC auth endpoint the tool redirects to during login.
    auth_login_url: Mapped[str] = mapped_column(String(500), nullable=False)
    # OAuth2 token endpoint used for AGS client-credentials.
    auth_token_url: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    # The platform's JWKS URL (production) for id_token verification.
    jwks_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    # An optional pinned public key (PEM) for offline / test verification.
    public_key_pem: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=_now)


class LtiNonce(Base):
    __tablename__ = "lti_nonces"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    state: Mapped[str] = mapped_column(String(64), nullable=False, unique=True, index=True)
    nonce: Mapped[str] = mapped_column(String(64), nullable=False)
    issuer: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=_now)


class LtiLaunch(Base):
    __tablename__ = "lti_launches"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    platform_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("lti_platforms.id", ondelete="CASCADE"), index=True
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    sub: Mapped[str] = mapped_column(String(255), nullable=False)
    resource_link_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    context_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    roles: Mapped[list | None] = mapped_column(JSON, nullable=True)
    message_type: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    # AGS line item to post a score back to (when the platform grants AGS).
    ags_lineitem_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=_now)

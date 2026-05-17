"""
Institutional / B2B ORM (Phase 9, 2026-05). See
eureka/ops/db/11_institutional.sql.
"""

from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean, CheckConstraint, Column, DateTime, Enum, ForeignKey, Index,
    Integer, Numeric, String, Text, UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID

from app.core.database import Base


class CohortStatus(str, enum.Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class CohortRole(str, enum.Enum):
    LEARNER = "learner"
    INSTRUCTOR = "instructor"
    OBSERVER = "observer"


class SsoProtocol(str, enum.Enum):
    OIDC = "oidc"
    SAML = "saml"
    GOOGLE_WORKSPACE = "google_workspace"


def _vals(e):
    return lambda obj: [m.value for m in obj]


class Cohort(Base):
    __tablename__ = "cohorts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    slug = Column(String(100), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)

    status = Column(
        Enum(CohortStatus, name="cohort_status", values_callable=_vals(CohortStatus)),
        nullable=False, default=CohortStatus.PLANNING,
    )
    starts_at = Column(DateTime, nullable=True)
    ends_at = Column(DateTime, nullable=True)

    target_skill_codes = Column(ARRAY(String), nullable=False, default=list)
    target_mastery = Column(Numeric(3, 2), nullable=False, default=0.85)
    min_weekly_attempts = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    __table_args__ = (UniqueConstraint("org_id", "slug", name="cohort_slug_per_org"),)


class CohortMembership(Base):
    __tablename__ = "cohort_memberships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cohort_id = Column(UUID(as_uuid=True), ForeignKey("cohorts.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(
        Enum(CohortRole, name="cohort_role", values_callable=_vals(CohortRole)),
        nullable=False, default=CohortRole.LEARNER,
    )
    joined_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    left_at = Column(DateTime, nullable=True)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)

    __table_args__ = (UniqueConstraint("cohort_id", "user_id", "role", name="uq_cohort_user_role"),)


class CohortBlueprint(Base):
    __tablename__ = "cohort_blueprints"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cohort_id = Column(UUID(as_uuid=True), ForeignKey("cohorts.id", ondelete="CASCADE"), nullable=False, index=True)
    blueprint_id = Column(UUID(as_uuid=True), ForeignKey("exam_blueprints.id", ondelete="CASCADE"), nullable=False)
    is_required = Column(Boolean, nullable=False, default=True)
    target_date = Column(DateTime, nullable=True)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("cohort_id", "blueprint_id", name="uq_cohort_blueprint"),)


class SsoIdpConfig(Base):
    __tablename__ = "sso_idp_configs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    protocol = Column(
        Enum(SsoProtocol, name="sso_protocol", values_callable=_vals(SsoProtocol)),
        nullable=False,
    )
    issuer = Column(Text, nullable=True)
    discovery_url = Column(Text, nullable=True)
    client_id = Column(Text, nullable=True)
    client_secret_encrypted = Column(Text, nullable=True)
    saml_entity_id = Column(Text, nullable=True)
    saml_metadata_xml = Column(Text, nullable=True)
    attribute_mapping = Column(JSONB, nullable=False, default=dict)
    default_role = Column(String(40), nullable=False, default="student")
    just_in_time_provisioning = Column(Boolean, nullable=False, default=True)
    auto_enroll_cohort_id = Column(UUID(as_uuid=True), ForeignKey("cohorts.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)


class LtiPlatform(Base):
    __tablename__ = "lti_platforms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    issuer = Column(Text, nullable=False)
    client_id = Column(Text, nullable=False)
    deployment_id = Column(Text, nullable=False)
    auth_login_url = Column(Text, nullable=False)
    auth_token_url = Column(Text, nullable=False)
    auth_token_aud = Column(Text, nullable=True)
    jwks_url = Column(Text, nullable=False)
    target_cohort_id = Column(UUID(as_uuid=True), ForeignKey("cohorts.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    __table_args__ = (UniqueConstraint("issuer", "client_id", "deployment_id", name="uq_lti_platform"),)


class LtiKey(Base):
    __tablename__ = "lti_keys"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    kid = Column(String(120), nullable=False, unique=True)
    algorithm = Column(String(40), nullable=False, default="RS256")
    public_pem = Column(Text, nullable=False)
    private_pem_encrypted = Column(Text, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    rotated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


__all__ = [
    "Cohort", "CohortMembership", "CohortBlueprint",
    "SsoIdpConfig", "LtiPlatform", "LtiKey",
    "CohortStatus", "CohortRole", "SsoProtocol",
]

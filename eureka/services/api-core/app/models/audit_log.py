"""
AuditLog database model for EUREKA API Core

SQLAlchemy ORM model for the audit_logs table. Columns mirror
ops/db/00_init_complete.sql exactly (CI's schema-drift check compares the
two); if you add a column here, add it to the init SQL and a migration too.

Note: the compliance audit trail written by the running platform lives in
`audit_events` (ops/db/15_integrations.sql); this table is the classic
per-resource change log.
"""

from sqlalchemy import Column, String, DateTime, ForeignKey, Index, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class AuditLog(Base):
    """AuditLog model - tracks system changes for compliance and security"""
    __tablename__ = "audit_logs"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    # Action Information (DB column is the `audit_action` Postgres enum)
    action = Column(String(100), nullable=False, index=True)
    resource_type = Column(String(100), nullable=False, index=True)
    resource_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Details
    changes = Column(JSONB, nullable=True)  # Before/after for updates

    # Request Information
    ip_address = Column(INET, nullable=True)
    user_agent = Column(Text, nullable=True)

    # Timestamp
    occurred_at = Column(DateTime, nullable=True, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User")
    organization = relationship("Organization")

    # Indexes for compliance queries
    __table_args__ = (
        Index('ix_audit_logs_resource', 'resource_type', 'resource_id', 'occurred_at'),
    )

    def __repr__(self):
        return f"<AuditLog {self.action} on {self.resource_type} by user={self.user_id}>"

    def to_dict(self):
        """Convert audit log to dictionary"""
        return {
            "id": str(self.id),
            "org_id": str(self.org_id),
            "user_id": str(self.user_id) if self.user_id else None,
            "action": self.action,
            "resource_type": self.resource_type,
            "resource_id": str(self.resource_id) if self.resource_id else None,
            "changes": self.changes,
            "ip_address": str(self.ip_address) if self.ip_address else None,
            "user_agent": self.user_agent,
            "occurred_at": self.occurred_at.isoformat() if self.occurred_at else None,
        }

    @classmethod
    def log(cls, action: str, resource_type: str, org_id: uuid.UUID,
            user_id: uuid.UUID = None, resource_id: uuid.UUID = None,
            changes: dict = None, ip_address: str = None, user_agent: str = None):
        """Create an audit log entry"""
        return cls(
            org_id=org_id,
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            changes=changes,
            ip_address=ip_address,
            user_agent=user_agent,
        )

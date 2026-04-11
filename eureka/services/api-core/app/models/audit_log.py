"""
AuditLog database model for EUREKA API Core

SQLAlchemy ORM model for audit_logs table (tracking all system changes).
"""

from sqlalchemy import Column, String, DateTime, ForeignKey, Index, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class AuditLog(Base):
    """AuditLog model - tracks all system changes for compliance and security"""
    __tablename__ = "audit_logs"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True, index=True)

    # Action Information
    action = Column(String(100), nullable=False, index=True)  # create, read, update, delete, login, logout, etc.
    resource_type = Column(String(100), nullable=False, index=True)  # user, course, assignment, etc.
    resource_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Details
    description = Column(Text, nullable=True)
    changes = Column(JSONB, nullable=True)  # Before/after for updates
    extra_metadata = Column(JSONB, nullable=True)

    # Request Information
    ip_address = Column(INET, nullable=True, index=True)
    user_agent = Column(String(500), nullable=True)
    request_method = Column(String(10), nullable=True)  # GET, POST, PUT, DELETE
    request_path = Column(String(500), nullable=True)

    # Status
    status = Column(String(50), nullable=False, default="success", index=True)  # success, failure, error
    error_message = Column(Text, nullable=True)

    # Timestamp
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User")
    organization = relationship("Organization")

    # Indexes for performance and compliance queries
    __table_args__ = (
        Index('ix_audit_logs_user_action', 'user_id', 'action', 'created_at'),
        Index('ix_audit_logs_org_action', 'org_id', 'action', 'created_at'),
        Index('ix_audit_logs_resource', 'resource_type', 'resource_id', 'created_at'),
        Index('ix_audit_logs_action_status', 'action', 'status', 'created_at'),
        Index('ix_audit_logs_ip_created', 'ip_address', 'created_at'),
        Index('ix_audit_logs_created_at_desc', created_at.desc()),
    )

    def __repr__(self):
        return f"<AuditLog {self.action} on {self.resource_type} by user={self.user_id}>"

    def to_dict(self):
        """Convert audit log to dictionary"""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id) if self.user_id else None,
            "org_id": str(self.org_id) if self.org_id else None,
            "action": self.action,
            "resource_type": self.resource_type,
            "resource_id": str(self.resource_id) if self.resource_id else None,
            "description": self.description,
            "changes": self.changes,
            "metadata": self.extra_metadata,
            "ip_address": str(self.ip_address) if self.ip_address else None,
            "user_agent": self.user_agent,
            "request_method": self.request_method,
            "request_path": self.request_path,
            "status": self.status,
            "error_message": self.error_message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    @classmethod
    def log(cls, action: str, resource_type: str, user_id: uuid.UUID = None,
            org_id: uuid.UUID = None, resource_id: uuid.UUID = None,
            description: str = None, changes: dict = None, metadata: dict = None,
            ip_address: str = None, user_agent: str = None,
            request_method: str = None, request_path: str = None,
            status: str = "success", error_message: str = None):
        """Create an audit log entry"""
        return cls(
            user_id=user_id,
            org_id=org_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            description=description,
            changes=changes,
            extra_metadata=metadata,
            ip_address=ip_address,
            user_agent=user_agent,
            request_method=request_method,
            request_path=request_path,
            status=status,
            error_message=error_message
        )

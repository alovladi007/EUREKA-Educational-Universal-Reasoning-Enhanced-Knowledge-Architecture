"""
RefreshToken database model for EUREKA API Core

SQLAlchemy ORM model for the refresh_tokens table. Columns mirror
ops/db/00_init_complete.sql exactly (CI's schema-drift check compares the
two); if you add a column here, add it to the init SQL and a migration too.

Note: the live auth flow issues stateless JWT refresh tokens (revocation is
jti-based); this table exists for deployments that opt into server-side
refresh-token storage.
"""

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Index, Text
from sqlalchemy.dialects.postgresql import UUID, INET
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
import uuid

from app.core.database import Base


class RefreshToken(Base):
    """RefreshToken model - stores JWT refresh tokens"""
    __tablename__ = "refresh_tokens"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Token Data
    token = Column(String(500), nullable=False, unique=True, index=True)
    ip_address = Column(INET, nullable=True)
    user_agent = Column(Text, nullable=True)

    # Status Flags
    is_revoked = Column(Boolean, nullable=True, default=False, index=True)

    # Timestamps
    created_at = Column(DateTime, nullable=True, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False, index=True)
    revoked_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", backref="refresh_tokens")

    # Indexes
    __table_args__ = (
        Index('ix_refresh_tokens_user_active', 'user_id', 'is_revoked', 'expires_at'),
    )

    def __repr__(self):
        return f"<RefreshToken user={self.user_id} expired={self.is_expired}>"

    def to_dict(self):
        """Convert refresh token to dictionary"""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "ip_address": str(self.ip_address) if self.ip_address else None,
            "user_agent": self.user_agent,
            "is_revoked": self.is_revoked,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
        }

    @property
    def is_expired(self) -> bool:
        """Check if token is expired"""
        return datetime.utcnow() > self.expires_at

    @property
    def is_valid(self) -> bool:
        """Check if token is valid (not revoked, not expired)"""
        return not self.is_revoked and not self.is_expired

    def revoke(self):
        """Revoke this refresh token"""
        self.is_revoked = True
        self.revoked_at = datetime.utcnow()

    @classmethod
    def create_for_user(cls, user_id: uuid.UUID, token: str, user_agent: str = None,
                        ip_address: str = None, expires_in_days: int = 7):
        """Create a new refresh token for a user"""
        return cls(
            user_id=user_id,
            token=token,
            user_agent=user_agent,
            ip_address=ip_address,
            expires_at=datetime.utcnow() + timedelta(days=expires_in_days)
        )

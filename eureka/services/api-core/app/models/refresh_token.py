"""
RefreshToken database model for EUREKA API Core

SQLAlchemy ORM model for refresh_tokens table (JWT refresh tokens).
"""

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
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
    device_info = Column(String(255), nullable=True)  # User agent, device name
    ip_address = Column(String(50), nullable=True)

    # Status Flags
    is_revoked = Column(Boolean, nullable=False, default=False, index=True)
    is_used = Column(Boolean, nullable=False, default=False)

    # Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    expires_at = Column(DateTime, nullable=False, index=True)
    revoked_at = Column(DateTime, nullable=True)
    used_at = Column(DateTime, nullable=True)

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
            "device_info": self.device_info,
            "ip_address": self.ip_address,
            "is_revoked": self.is_revoked,
            "is_used": self.is_used,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
        }

    @property
    def is_expired(self) -> bool:
        """Check if token is expired"""
        return datetime.utcnow() > self.expires_at

    @property
    def is_valid(self) -> bool:
        """Check if token is valid (not revoked, not expired, not used)"""
        return not self.is_revoked and not self.is_expired and not self.is_used

    def revoke(self):
        """Revoke this refresh token"""
        self.is_revoked = True
        self.revoked_at = datetime.utcnow()

    def use(self):
        """Mark token as used"""
        self.is_used = True
        self.used_at = datetime.utcnow()

    @classmethod
    def create_for_user(cls, user_id: uuid.UUID, token: str, device_info: str = None,
                        ip_address: str = None, expires_in_days: int = 7):
        """Create a new refresh token for a user"""
        return cls(
            user_id=user_id,
            token=token,
            device_info=device_info,
            ip_address=ip_address,
            expires_at=datetime.utcnow() + timedelta(days=expires_in_days)
        )

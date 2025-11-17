"""
Notification database model for EUREKA API Core

SQLAlchemy ORM model for notifications table.
"""

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Index, CheckConstraint, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Notification(Base):
    """Notification model - system notifications for users"""
    __tablename__ = "notifications"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=True, index=True)

    # Notification Type and Priority
    type = Column(String(50), nullable=False, index=True)  # assignment, grade, message, system, etc.
    priority = Column(String(20), nullable=False, default="normal", index=True)  # low, normal, high, urgent

    # Content
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    action_text = Column(String(100), nullable=True)  # Button text like "View Assignment"
    action_url = Column(String(500), nullable=True)  # Where the action button should go

    # Reference Information (what this notification is about)
    reference_type = Column(String(100), nullable=True, index=True)  # assignment, course, user, etc.
    reference_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Metadata
    data = Column(JSONB, nullable=True)  # Additional data for notification

    # Status Flags
    is_read = Column(Boolean, nullable=False, default=False, index=True)
    is_sent = Column(Boolean, nullable=False, default=False)  # For email/push notifications
    is_deleted = Column(Boolean, nullable=False, default=False, index=True)  # Soft delete

    # Channels
    sent_via_email = Column(Boolean, nullable=False, default=False)
    sent_via_push = Column(Boolean, nullable=False, default=False)
    sent_via_sms = Column(Boolean, nullable=False, default=False)

    # Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    read_at = Column(DateTime, nullable=True, index=True)
    sent_at = Column(DateTime, nullable=True)
    deleted_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User")
    organization = relationship("Organization")

    # Constraints and Indexes
    __table_args__ = (
        # Check constraints for data validation
        CheckConstraint(
            "type IN ('assignment', 'grade', 'message', 'announcement', 'reminder', 'system', 'achievement', 'deadline')",
            name='ck_notifications_type'
        ),
        CheckConstraint(
            "priority IN ('low', 'normal', 'high', 'urgent')",
            name='ck_notifications_priority'
        ),
        CheckConstraint(
            "read_at IS NULL OR read_at >= created_at",
            name='ck_notifications_read_after_created'
        ),

        # Indexes for performance
        Index('ix_notifications_user_unread', 'user_id', 'is_read', 'created_at'),
        Index('ix_notifications_user_type', 'user_id', 'type', 'created_at'),
        Index('ix_notifications_user_priority', 'user_id', 'priority', 'created_at'),
        Index('ix_notifications_reference', 'reference_type', 'reference_id'),
        Index('ix_notifications_created_desc', created_at.desc()),
        Index('ix_notifications_unsent', 'is_sent', 'created_at'),
    )

    def __repr__(self):
        return f"<Notification {self.type} for user={self.user_id} read={self.is_read}>"

    def to_dict(self):
        """Convert notification to dictionary"""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "org_id": str(self.org_id) if self.org_id else None,
            "type": self.type,
            "priority": self.priority,
            "title": self.title,
            "message": self.message,
            "action_text": self.action_text,
            "action_url": self.action_url,
            "reference_type": self.reference_type,
            "reference_id": str(self.reference_id) if self.reference_id else None,
            "data": self.data,
            "is_read": self.is_read,
            "is_sent": self.is_sent,
            "is_deleted": self.is_deleted,
            "sent_via_email": self.sent_via_email,
            "sent_via_push": self.sent_via_push,
            "sent_via_sms": self.sent_via_sms,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "read_at": self.read_at.isoformat() if self.read_at else None,
            "sent_at": self.sent_at.isoformat() if self.sent_at else None,
        }

    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = datetime.utcnow()

    def mark_as_sent(self, via_email: bool = False, via_push: bool = False, via_sms: bool = False):
        """Mark notification as sent"""
        self.is_sent = True
        self.sent_at = datetime.utcnow()
        if via_email:
            self.sent_via_email = True
        if via_push:
            self.sent_via_push = True
        if via_sms:
            self.sent_via_sms = True

    def soft_delete(self):
        """Soft delete notification"""
        self.is_deleted = True
        self.deleted_at = datetime.utcnow()

    @classmethod
    def create_for_user(cls, user_id: uuid.UUID, type: str, title: str, message: str,
                        org_id: uuid.UUID = None, priority: str = "normal",
                        action_text: str = None, action_url: str = None,
                        reference_type: str = None, reference_id: uuid.UUID = None,
                        data: dict = None):
        """Create a new notification for a user"""
        return cls(
            user_id=user_id,
            org_id=org_id,
            type=type,
            priority=priority,
            title=title,
            message=message,
            action_text=action_text,
            action_url=action_url,
            reference_type=reference_type,
            reference_id=reference_id,
            data=data
        )

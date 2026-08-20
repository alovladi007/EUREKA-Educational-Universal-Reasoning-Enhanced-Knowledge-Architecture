"""
Notification database model for EUREKA API Core

Mirrors `notifications` as created by ops/db/00_init_complete.sql.

WHY THIS MODEL IS THIN
----------------------
This model previously declared an aspirational superset: 12 columns the live
table has never had (org_id, type, priority, action_text, data, is_sent,
is_deleted, deleted_at, sent_at, sent_via_email/push/sms) and none of the 4
the table actually has (notification_type, channels, metadata, expires_at).
The schema-drift gate reported all 16 once it was repaired in 2026-08.

Nothing imported it. `Notification` appears in no endpoint, service, or CRUD
module — only in `app/models/__init__.py`. The columns were never used because
the model was never used, so the drift was 100% cosmetic and the resolution is
convergence, not a migration: adding 12 unused columns to a live table (4 rows)
would be churn with a downgrade path and no consumer.

This follows the precedent set in 2026-07 for api-core's other dormant models
(assignments, submissions, grades, refresh_tokens, audit_logs, file_uploads),
recorded in the docstring of scripts/check_schema_drift.py: dormant model
drifting from init SQL -> rewrite the model to mirror the SQL.

NOT TO BE CONFUSED WITH `PushNotification` (app/models/engagement.py, table
`push_notifications`). That is the notification table the platform actually
writes to, it is declared in ops/db/14_engagement.sql, it HAS `sent_at`, and
app/services/push_notify.py sets it there. The two tables have similar names
and no relationship.

If in-app notifications are built for real, extend BOTH this model and the init
SQL together, in one alembic revision.
"""

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Index, text
from sqlalchemy.dialects.postgresql import ARRAY, ENUM, JSONB, UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


# -- PG enum bridges (create_type=False — SQL owns the type) ------------------

_PG_NOTIFICATION_TYPE = ENUM(
    "info", "success", "warning", "error", "grade", "message", "announcement",
    name="notification_type", create_type=False,
)
_PG_NOTIFICATION_CHANNEL = ENUM(
    "in_app", "email", "sms", "push",
    name="notification_channel", create_type=False,
)


class Notification(Base):
    """In-app notification. Currently written by no application code."""

    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    notification_type = Column(_PG_NOTIFICATION_TYPE, nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(String, nullable=False)

    # DEFAULTS ARE PYTHON-SIDE ON PURPOSE.
    #
    # ops/db/00_init_complete.sql owns the server defaults for this table
    # (ARRAY['in_app'::notification_channel], '{}'::jsonb, false,
    # CURRENT_TIMESTAMP). Restating them here as `server_default=text(...)`
    # emits Postgres literals into every CREATE TABLE — including the one the
    # test harness runs against sqlite, where `ARRAY['in_app'::notification_
    # channel]` is a syntax error that fails create_all and errors out every
    # test using the db_session fixture. Python-side defaults express the same
    # intent and are dialect-portable.
    channels = Column(ARRAY(_PG_NOTIFICATION_CHANNEL), default=lambda: ["in_app"])

    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime, nullable=True)

    # What the notification is about.
    reference_type = Column(String(100), nullable=True)
    reference_id = Column(UUID(as_uuid=True), nullable=True)
    action_url = Column(String(500), nullable=True)

    # `metadata` is reserved on the declarative Base (it is the MetaData
    # object), so the attribute is `meta` while the column keeps the name the
    # table uses. The drift checker compares COLUMN names, so this matches.
    meta = Column("metadata", JSONB, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    user = relationship("User")

    # Index names mirror ops/db/00_init_complete.sql.
    __table_args__ = (
        Index("idx_notifications_user", "user_id"),
        Index(
            "idx_notifications_unread",
            "user_id",
            "is_read",
            postgresql_where=text("is_read = false"),
        ),
        Index("idx_notifications_created", "created_at"),
    )

    def __repr__(self):
        return (
            f"<Notification {self.notification_type} "
            f"user={self.user_id} read={self.is_read}>"
        )

    def to_dict(self):
        """Convert notification to dictionary"""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "notification_type": self.notification_type,
            "title": self.title,
            "message": self.message,
            "channels": list(self.channels) if self.channels else [],
            "is_read": self.is_read,
            "reference_type": self.reference_type,
            "reference_id": str(self.reference_id) if self.reference_id else None,
            "action_url": self.action_url,
            "metadata": self.meta,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "read_at": self.read_at.isoformat() if self.read_at else None,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
        }

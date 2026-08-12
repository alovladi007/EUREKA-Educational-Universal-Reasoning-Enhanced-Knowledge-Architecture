"""HelpRequest: a question the in-app helper handed to a human.

Columns mirror ops/db/26_help_requests.sql exactly (CI's schema-drift check
compares the two); if you add a column here, add it to the init SQL and a
migration too.
"""

from datetime import datetime
import uuid

from sqlalchemy import Column, DateTime, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class HelpRequest(Base):
    """An escalation from the helper: it could not, or must not, answer."""

    __tablename__ = "help_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    question = Column(Text, nullable=False)
    page_path = Column(String(500))
    topic_keys = Column(String(500), nullable=False, default="")
    # 'no_match' (the helper did not recognise it) or 'policy' (it recognised
    # it and refused on purpose, because the answer is a decision).
    reason = Column(String(32), nullable=False, default="no_match")
    status = Column(String(24), nullable=False, default="open")
    resolution = Column(Text)
    resolved_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    resolved_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    __table_args__ = (
        Index("idx_help_requests_status_created", "status", "created_at"),
        Index("idx_help_requests_user", "user_id"),
    )

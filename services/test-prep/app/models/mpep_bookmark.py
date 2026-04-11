"""
User bookmarks for MPEP practice browser (exam-style navigation aid).
"""
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Index
from datetime import datetime
import uuid

from app.core.database import Base


class MpepBookmark(Base):
    __tablename__ = "mpep_bookmarks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    url = Column(Text, nullable=False)
    chapter = Column(String(32), nullable=True)  # e.g. "2100"
    notes = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (Index("ix_mpep_bookmarks_user_sort", "user_id", "sort_order"),)

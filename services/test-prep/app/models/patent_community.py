"""
Patent Bar — cohort roster, study groups, and course / group messaging.
"""
from datetime import datetime
import uuid

from sqlalchemy import Column, String, Text, DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship

from app.core.database import Base


class PatentCourseRoster(Base):
    """Learner profile visible to others in the same exam cohort."""

    __tablename__ = "patent_course_roster"
    __table_args__ = (
        UniqueConstraint("exam_type", "user_id", name="uq_patent_roster_exam_user"),
        Index("ix_patent_roster_exam", "exam_type"),
    )

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    exam_type = Column(String(64), nullable=False)
    user_id = Column(String(128), nullable=False)
    display_name = Column(String(200), nullable=False)
    avatar_url = Column(String(1000), nullable=True)
    tagline = Column(String(300), nullable=True)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)


class PatentStudyGroup(Base):
    __tablename__ = "patent_study_groups"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    exam_type = Column(String(64), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(String(128), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    members = relationship(
        "PatentStudyGroupMember",
        back_populates="group",
        cascade="all, delete-orphan",
    )


class PatentStudyGroupMember(Base):
    __tablename__ = "patent_study_group_members"
    __table_args__ = (Index("ix_patent_sg_member_user", "user_id"),)

    group_id = Column(String(36), ForeignKey("patent_study_groups.id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(String(128), primary_key=True)
    joined_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    group = relationship("PatentStudyGroup", back_populates="members")


class PatentCommunityMessage(Base):
    """Course wall (group_id NULL) or study-group thread."""

    __tablename__ = "patent_community_messages"
    __table_args__ = (
        Index("ix_patent_comm_msg_exam_time", "exam_type", "created_at"),
        Index("ix_patent_comm_msg_group_time", "group_id", "created_at"),
    )

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    exam_type = Column(String(64), nullable=False)
    group_id = Column(String(36), ForeignKey("patent_study_groups.id", ondelete="CASCADE"), nullable=True, index=True)
    user_id = Column(String(128), nullable=False)
    display_name = Column(String(200), nullable=True)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)

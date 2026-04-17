"""Resume database models."""

from sqlalchemy import Column, String, Boolean, Integer, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


def generate_uuid():
    return str(uuid.uuid4())


def generate_slug():
    return uuid.uuid4().hex[:10]


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    title = Column(String, default="My Resume")
    slug = Column(String, unique=True, default=generate_slug, index=True)
    is_public = Column(Boolean, default=False)
    template_id = Column(String, default="meridian")
    data = Column(JSON, nullable=False, default=dict)  # Full ResumeData JSON
    template_config = Column(JSON, nullable=True, default=dict)  # Section visibility, etc.
    ats_score = Column(Integer, nullable=True)
    view_count = Column(Integer, default=0)
    last_export_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    versions = relationship("ResumeVersion", back_populates="resume", cascade="all, delete-orphan")


class ResumeVersion(Base):
    __tablename__ = "resume_versions"

    id = Column(String, primary_key=True, default=generate_uuid)
    resume_id = Column(String, ForeignKey("resumes.id"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False)
    label = Column(String, nullable=True)  # e.g., "Before AI edit", "Applied to Google"
    data = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    resume = relationship("Resume", back_populates="versions")

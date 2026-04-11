"""
Patent Bar live instruction: office hours slots and cohort tracks (scheduling layer).
"""
from sqlalchemy import Column, String, Integer, Text, DateTime, Boolean, Index
from datetime import datetime
import uuid

from app.core.database import Base


class PatentOfficeHoursSlot(Base):
    __tablename__ = "patent_office_hours_slots"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    exam_type = Column(String(50), nullable=False, default="PATENT_BAR", index=True)

    label = Column(String(300), nullable=False)
    cadence = Column(String(200), nullable=False)
    time_local = Column(String(120), nullable=False, default="—")
    topic_focus = Column(Text, nullable=False)
    duration_min = Column(Integer, nullable=False, default=60)
    join_url = Column(String(2000), nullable=True)
    next_occurrence_at = Column(DateTime, nullable=True)

    sort_order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (Index("ix_patent_oh_exam_sort", "exam_type", "sort_order"),)


class PatentCohort(Base):
    __tablename__ = "patent_cohorts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    exam_type = Column(String(50), nullable=False, default="PATENT_BAR", index=True)

    name = Column(String(300), nullable=False)
    description = Column(Text, nullable=False)
    weeks_planned = Column(Integer, nullable=False)
    start_window = Column(String(400), nullable=False)
    capacity_planned = Column(Integer, nullable=True)
    enrolled_count = Column(Integer, default=0)
    enrollment_open = Column(Boolean, default=True)

    sort_order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (Index("ix_patent_cohort_exam_sort", "exam_type", "sort_order"),)

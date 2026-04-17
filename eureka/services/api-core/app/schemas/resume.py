"""Resume Pydantic schemas for API request/response."""

from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime


class ResumeCreate(BaseModel):
    title: str = "My Resume"
    template_id: str = "meridian"
    data: dict = Field(default_factory=dict)
    template_config: Optional[dict] = None


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    template_id: Optional[str] = None
    data: Optional[dict] = None
    template_config: Optional[dict] = None
    is_public: Optional[bool] = None
    slug: Optional[str] = None
    ats_score: Optional[int] = None


class ResumeResponse(BaseModel):
    id: str
    user_id: Optional[str]
    title: str
    slug: str
    is_public: bool
    template_id: str
    data: dict
    template_config: Optional[dict]
    ats_score: Optional[int]
    view_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ResumeListItem(BaseModel):
    id: str
    title: str
    slug: str
    is_public: bool
    template_id: str
    ats_score: Optional[int]
    view_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ResumeVersionCreate(BaseModel):
    label: Optional[str] = None
    data: dict


class ResumeVersionResponse(BaseModel):
    id: str
    resume_id: str
    version_number: int
    label: Optional[str]
    data: dict
    created_at: datetime

    class Config:
        from_attributes = True


class ResumeShareUpdate(BaseModel):
    is_public: bool
    slug: Optional[str] = None


class ResumePublicResponse(BaseModel):
    """Response for public share page — no auth required."""
    title: str
    template_id: str
    data: dict
    template_config: Optional[dict]

    class Config:
        from_attributes = True

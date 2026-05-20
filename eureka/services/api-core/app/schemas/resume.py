"""Resume Pydantic schemas for API request/response."""

from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Union
from datetime import datetime
from uuid import UUID


# Type alias: SQLAlchemy returns UUID, but the API contract says string.
# Pydantic v2 doesn't auto-coerce UUID → str, so we accept either and the
# field-validators below stringify on the way out.
_IdField = Union[UUID, str]


def _uuid_to_str(value):
    """Coerce a UUID (or anything stringifiable) to str."""
    return str(value) if value is not None else None


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
    model_config = ConfigDict(from_attributes=True)

    id: _IdField
    user_id: Optional[_IdField] = None
    title: str
    slug: Optional[str] = None
    is_public: bool
    template_id: str
    data: dict
    template_config: Optional[dict] = None
    ats_score: Optional[int] = None
    view_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None


class ResumeListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: _IdField
    title: str
    slug: Optional[str] = None
    is_public: bool
    template_id: str
    ats_score: Optional[int] = None
    view_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None


class ResumeVersionCreate(BaseModel):
    label: Optional[str] = None
    data: dict


class ResumeVersionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: _IdField
    resume_id: _IdField
    version_number: int
    label: Optional[str] = None
    data: dict
    created_at: datetime


class ResumeShareUpdate(BaseModel):
    is_public: bool
    slug: Optional[str] = None


class ResumePublicResponse(BaseModel):
    """Response for public share page — no auth required."""
    model_config = ConfigDict(from_attributes=True)

    title: str
    template_id: str
    data: dict
    template_config: Optional[dict] = None

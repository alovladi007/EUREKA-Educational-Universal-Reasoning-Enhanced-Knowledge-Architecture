"""
Pydantic schemas for organizations

Request/response models for organization endpoints.
"""

from pydantic import BaseModel, EmailStr, Field, validator, HttpUrl
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID


class OrganizationCreate(BaseModel):
    """Organization creation request"""
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=3, max_length=100, pattern="^[a-z0-9-]+$")
    tier: str = Field(..., description="Educational tier")
    
    # Contact info
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    website: Optional[HttpUrl] = None
    
    # Address
    address_line1: Optional[str] = Field(None, max_length=255)
    address_line2: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    postal_code: Optional[str] = Field(None, max_length=20)
    country: str = Field(default="US", max_length=2)
    
    # Settings
    settings: Optional[Dict[str, Any]] = Field(default_factory=dict)
    tier_config: Optional[Dict[str, Any]] = Field(default_factory=dict)
    
    # Compliance
    ferpa_compliant: bool = True
    coppa_compliant: bool = False
    hipaa_compliant: bool = False
    
    @validator('tier')
    def validate_tier(cls, v):
        """Validate tier is one of the supported types"""
        valid_tiers = [
            'high_school', 'undergraduate', 'graduate',
            'professional_medical', 'professional_law',
            'professional_mba', 'professional_engineering'
        ]
        if v not in valid_tiers:
            raise ValueError(f'Tier must be one of: {", ".join(valid_tiers)}')
        return v
    
    @validator('slug')
    def validate_slug(cls, v):
        """Validate slug format"""
        if not v.islower():
            raise ValueError('Slug must be lowercase')
        if '__' in v:
            raise ValueError('Slug cannot contain consecutive underscores')
        if v.startswith('-') or v.endswith('-'):
            raise ValueError('Slug cannot start or end with hyphen')
        return v


class OrganizationUpdate(BaseModel):
    """Organization update request"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    website: Optional[HttpUrl] = None
    address_line1: Optional[str] = Field(None, max_length=255)
    address_line2: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    postal_code: Optional[str] = Field(None, max_length=20)
    country: Optional[str] = Field(None, max_length=2)
    settings: Optional[Dict[str, Any]] = None
    tier_config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    
    class Config:
        extra = 'ignore'


class OrganizationResponse(BaseModel):
    """Organization response model"""
    id: UUID
    name: str
    slug: str
    tier: str
    email: Optional[str]
    phone: Optional[str]
    website: Optional[str]
    address_line1: Optional[str]
    address_line2: Optional[str]
    city: Optional[str]
    state: Optional[str]
    postal_code: Optional[str]
    country: str
    settings: Dict[str, Any]
    tier_config: Dict[str, Any]
    ferpa_compliant: bool
    coppa_compliant: bool
    hipaa_compliant: bool
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class OrganizationList(BaseModel):
    """Paginated list of organizations"""
    items: list[OrganizationResponse]
    total: int
    page: int
    page_size: int
    pages: int


class OrganizationStats(BaseModel):
    """Organization statistics"""
    org_id: UUID
    total_users: int
    active_users: int
    total_courses: int
    active_courses: int
    total_enrollments: int
    active_enrollments: int

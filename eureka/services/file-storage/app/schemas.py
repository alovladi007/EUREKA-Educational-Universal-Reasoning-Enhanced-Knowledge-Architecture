"""
File Storage Service - Pydantic Schemas
"""
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field


class FileUploadResponse(BaseModel):
    """Response after file upload"""
    file_id: Optional[UUID] = None
    file_path: str
    filename: str
    content_type: str
    size: int
    file_hash: str
    bucket: str
    etag: str
    download_url: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)


class FileInfo(BaseModel):
    """File metadata information"""
    file_path: str
    filename: str
    size: int
    content_type: str
    last_modified: datetime
    etag: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class FileListResponse(BaseModel):
    """Response for file listing"""
    files: list[FileInfo]
    total: int
    prefix: Optional[str] = None


class PresignedUrlResponse(BaseModel):
    """Presigned URL for file access"""
    url: str
    expires_in_seconds: int
    file_path: str


class FileDeleteResponse(BaseModel):
    """Response after file deletion"""
    success: bool
    file_path: str
    message: str


class FileUploadRequest(BaseModel):
    """Request to upload a file with metadata"""
    user_id: Optional[UUID] = None
    course_id: Optional[UUID] = None
    assignment_id: Optional[UUID] = None
    folder: str = "general"  # Folder/category for organization
    description: Optional[str] = None


class ErrorResponse(BaseModel):
    """Error response"""
    error: str
    detail: Optional[str] = None
    status_code: int

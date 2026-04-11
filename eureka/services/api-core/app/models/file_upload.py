"""
FileUpload database model for EUREKA API Core

SQLAlchemy ORM model for file_uploads table.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, BigInteger, ForeignKey, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class FileUpload(Base):
    """FileUpload model - tracks uploaded files"""
    __tablename__ = "file_uploads"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign Keys
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    # File Information
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(1000), nullable=False)  # Path in S3/MinIO
    file_size_bytes = Column(BigInteger, nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_hash = Column(String(64), nullable=True)  # SHA-256 hash for deduplication

    # Storage Information
    bucket_name = Column(String(255), nullable=False)
    object_key = Column(String(1000), nullable=False)
    storage_class = Column(String(50), nullable=False, default="STANDARD")

    # Reference Information (what this file is attached to)
    reference_type = Column(String(100), nullable=True, index=True)  # assignment, submission, profile, etc.
    reference_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Virus Scanning
    virus_scanned = Column(Boolean, nullable=False, default=False)
    virus_scan_result = Column(String(50), nullable=True)  # clean, infected, error
    virus_scan_details = Column(String, nullable=True)

    # Access Control
    is_public = Column(Boolean, nullable=False, default=False, index=True)
    access_count = Column(Integer, nullable=False, default=0)

    # Status
    is_deleted = Column(Boolean, nullable=False, default=False, index=True)  # Soft delete

    # Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    deleted_at = Column(DateTime, nullable=True)
    last_accessed_at = Column(DateTime, nullable=True)

    # Relationships
    organization = relationship("Organization")
    uploader = relationship("User", foreign_keys=[uploaded_by])

    # Constraints and Indexes
    __table_args__ = (
        # Check constraints for data validation
        CheckConstraint(
            "file_size_bytes > 0",
            name='ck_file_uploads_size_positive'
        ),
        CheckConstraint(
            "virus_scan_result IS NULL OR virus_scan_result IN ('clean', 'infected', 'error')",
            name='ck_file_uploads_scan_result'
        ),
        CheckConstraint(
            "storage_class IN ('STANDARD', 'REDUCED_REDUNDANCY', 'GLACIER', 'DEEP_ARCHIVE')",
            name='ck_file_uploads_storage_class'
        ),
        CheckConstraint(
            "access_count >= 0",
            name='ck_file_uploads_access_count_positive'
        ),

        # Indexes for performance
        Index('ix_file_uploads_org_type', 'org_id', 'reference_type'),
        Index('ix_file_uploads_reference', 'reference_type', 'reference_id'),
        Index('ix_file_uploads_uploader_created', 'uploaded_by', 'created_at'),
        Index('ix_file_uploads_hash', 'file_hash'),  # For deduplication
        Index('ix_file_uploads_mime_type', 'mime_type'),
        Index('ix_file_uploads_virus_scanned', 'virus_scanned', 'virus_scan_result'),
    )

    def __repr__(self):
        return f"<FileUpload {self.filename} ({self.file_size_bytes} bytes)>"

    def to_dict(self):
        """Convert file upload to dictionary"""
        return {
            "id": str(self.id),
            "org_id": str(self.org_id),
            "uploaded_by": str(self.uploaded_by) if self.uploaded_by else None,
            "filename": self.filename,
            "original_filename": self.original_filename,
            "file_path": self.file_path,
            "file_size_bytes": self.file_size_bytes,
            "mime_type": self.mime_type,
            "file_hash": self.file_hash,
            "bucket_name": self.bucket_name,
            "object_key": self.object_key,
            "storage_class": self.storage_class,
            "reference_type": self.reference_type,
            "reference_id": str(self.reference_id) if self.reference_id else None,
            "virus_scanned": self.virus_scanned,
            "virus_scan_result": self.virus_scan_result,
            "is_public": self.is_public,
            "access_count": self.access_count,
            "is_deleted": self.is_deleted,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "deleted_at": self.deleted_at.isoformat() if self.deleted_at else None,
            "last_accessed_at": self.last_accessed_at.isoformat() if self.last_accessed_at else None,
        }

    @property
    def file_size_mb(self) -> float:
        """Get file size in megabytes"""
        return self.file_size_bytes / (1024 * 1024)

    @property
    def is_safe(self) -> bool:
        """Check if file passed virus scan"""
        return self.virus_scanned and self.virus_scan_result == 'clean'

    @property
    def file_extension(self) -> str:
        """Get file extension"""
        if '.' in self.filename:
            return self.filename.rsplit('.', 1)[1].lower()
        return ''

    def soft_delete(self):
        """Soft delete the file"""
        self.is_deleted = True
        self.deleted_at = datetime.utcnow()

    def record_access(self):
        """Record that this file was accessed"""
        self.access_count += 1
        self.last_accessed_at = datetime.utcnow()

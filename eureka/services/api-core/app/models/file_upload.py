"""
FileUpload database model for EUREKA API Core

SQLAlchemy ORM model for the file_uploads table. Columns mirror
ops/db/00_init_complete.sql exactly (CI's schema-drift check compares the
two); if you add a column here, add it to the init SQL and a migration too.
"""

from sqlalchemy import Column, String, Boolean, DateTime, BigInteger, ForeignKey, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
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
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # File Information
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size_bytes = Column(BigInteger, nullable=False)
    mime_type = Column(String(100), nullable=False)

    # Storage Information
    storage_type = Column(String(50), nullable=True, default="s3")
    bucket_name = Column(String(100), nullable=True)
    object_key = Column(String(500), nullable=True)

    # Access Control
    is_public = Column(Boolean, nullable=True, default=False)

    # Reference Information (what this file is attached to)
    reference_type = Column(String(100), nullable=True, index=True)
    reference_id = Column(UUID(as_uuid=True), nullable=True, index=True)

    # Misc (DB column is literally named "metadata" — a reserved attribute
    # name on declarative classes, hence the mapped attribute name)
    extra_metadata = Column("metadata", JSONB, nullable=True, default=dict)

    # Timestamps
    created_at = Column(DateTime, nullable=True, default=datetime.utcnow, index=True)

    # Relationships
    organization = relationship("Organization")
    uploader = relationship("User", foreign_keys=[uploaded_by])

    # Constraints and Indexes
    __table_args__ = (
        CheckConstraint(
            "storage_type IN ('s3', 'local', 'azure', 'gcs')",
            name='ck_file_uploads_storage_type'
        ),
        Index('ix_file_uploads_reference', 'reference_type', 'reference_id'),
    )

    def __repr__(self):
        return f"<FileUpload {self.filename} ({self.file_size_bytes} bytes)>"

    def to_dict(self):
        """Convert file upload to dictionary"""
        return {
            "id": str(self.id),
            "org_id": str(self.org_id),
            "uploaded_by": str(self.uploaded_by),
            "filename": self.filename,
            "original_filename": self.original_filename,
            "file_path": self.file_path,
            "file_size_bytes": self.file_size_bytes,
            "mime_type": self.mime_type,
            "storage_type": self.storage_type,
            "bucket_name": self.bucket_name,
            "object_key": self.object_key,
            "is_public": self.is_public,
            "reference_type": self.reference_type,
            "reference_id": str(self.reference_id) if self.reference_id else None,
            "metadata": self.extra_metadata,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    @property
    def file_size_mb(self) -> float:
        """Get file size in megabytes"""
        return self.file_size_bytes / (1024 * 1024)

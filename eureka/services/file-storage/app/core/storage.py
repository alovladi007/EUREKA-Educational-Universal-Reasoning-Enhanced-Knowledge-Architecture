"""
File Storage Service - S3/MinIO Client

Handles all interactions with object storage (MinIO/S3).
"""
import hashlib
import io
from datetime import timedelta
from typing import BinaryIO, Optional
from minio import Minio
from minio.error import S3Error
import logging

from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


class StorageClient:
    """S3/MinIO storage client"""

    def __init__(self):
        """Initialize MinIO client"""
        self.client = Minio(
            settings.S3_ENDPOINT,
            access_key=settings.S3_ACCESS_KEY,
            secret_key=settings.S3_SECRET_KEY,
            secure=settings.S3_SECURE
        )
        self.bucket_name = settings.S3_BUCKET_NAME
        self._ensure_bucket_exists()

    def _ensure_bucket_exists(self):
        """Create bucket if it doesn't exist"""
        try:
            if not self.client.bucket_exists(self.bucket_name):
                self.client.make_bucket(self.bucket_name, location=settings.S3_REGION)
                logger.info(f"Created bucket: {self.bucket_name}")
            else:
                logger.info(f"Bucket exists: {self.bucket_name}")
        except S3Error as e:
            logger.error(f"Error ensuring bucket exists: {e}")
            raise

    def upload_file(
        self,
        file_data: BinaryIO,
        file_path: str,
        content_type: str = "application/octet-stream",
        metadata: Optional[dict] = None
    ) -> dict:
        """
        Upload a file to S3/MinIO

        Args:
            file_data: File binary data
            file_path: Path/key in S3 (e.g., "assignments/user123/file.pdf")
            content_type: MIME type of the file
            metadata: Optional metadata dict

        Returns:
            dict with upload info (etag, size, etc.)
        """
        try:
            # Calculate file size
            file_data.seek(0, 2)  # Seek to end
            file_size = file_data.tell()
            file_data.seek(0)  # Reset to beginning

            # Calculate SHA-256 hash
            file_hash = self._calculate_hash(file_data)
            file_data.seek(0)  # Reset again

            # Upload to MinIO
            result = self.client.put_object(
                self.bucket_name,
                file_path,
                file_data,
                length=file_size,
                content_type=content_type,
                metadata=metadata or {}
            )

            logger.info(f"Uploaded file: {file_path} (size: {file_size} bytes)")

            return {
                "bucket": self.bucket_name,
                "file_path": file_path,
                "etag": result.etag,
                "size": file_size,
                "content_type": content_type,
                "file_hash": file_hash
            }

        except S3Error as e:
            logger.error(f"Error uploading file {file_path}: {e}")
            raise

    def download_file(self, file_path: str) -> bytes:
        """
        Download a file from S3/MinIO

        Args:
            file_path: Path/key in S3

        Returns:
            File bytes
        """
        try:
            response = self.client.get_object(self.bucket_name, file_path)
            file_data = response.read()
            response.close()
            response.release_conn()

            logger.info(f"Downloaded file: {file_path}")
            return file_data

        except S3Error as e:
            logger.error(f"Error downloading file {file_path}: {e}")
            raise

    def delete_file(self, file_path: str) -> bool:
        """
        Delete a file from S3/MinIO

        Args:
            file_path: Path/key in S3

        Returns:
            True if successful
        """
        try:
            self.client.remove_object(self.bucket_name, file_path)
            logger.info(f"Deleted file: {file_path}")
            return True

        except S3Error as e:
            logger.error(f"Error deleting file {file_path}: {e}")
            raise

    def get_presigned_url(
        self,
        file_path: str,
        expires: timedelta = timedelta(hours=1)
    ) -> str:
        """
        Generate a presigned URL for temporary file access

        Args:
            file_path: Path/key in S3
            expires: URL expiration time

        Returns:
            Presigned URL
        """
        try:
            url = self.client.presigned_get_object(
                self.bucket_name,
                file_path,
                expires=expires
            )
            logger.info(f"Generated presigned URL for: {file_path}")
            return url

        except S3Error as e:
            logger.error(f"Error generating presigned URL for {file_path}: {e}")
            raise

    def list_files(self, prefix: str = "", max_files: int = 1000) -> list:
        """
        List files in S3/MinIO

        Args:
            prefix: Filter by prefix (e.g., "assignments/user123/")
            max_files: Maximum number of files to return

        Returns:
            List of file objects
        """
        try:
            objects = self.client.list_objects(
                self.bucket_name,
                prefix=prefix,
                recursive=True
            )

            files = []
            for obj in objects:
                if len(files) >= max_files:
                    break
                files.append({
                    "name": obj.object_name,
                    "size": obj.size,
                    "last_modified": obj.last_modified,
                    "etag": obj.etag
                })

            logger.info(f"Listed {len(files)} files with prefix: {prefix}")
            return files

        except S3Error as e:
            logger.error(f"Error listing files with prefix {prefix}: {e}")
            raise

    def file_exists(self, file_path: str) -> bool:
        """
        Check if a file exists in S3/MinIO

        Args:
            file_path: Path/key in S3

        Returns:
            True if file exists
        """
        try:
            self.client.stat_object(self.bucket_name, file_path)
            return True
        except S3Error:
            return False

    def get_file_info(self, file_path: str) -> dict:
        """
        Get metadata about a file

        Args:
            file_path: Path/key in S3

        Returns:
            File metadata dict
        """
        try:
            stat = self.client.stat_object(self.bucket_name, file_path)

            return {
                "file_path": file_path,
                "size": stat.size,
                "last_modified": stat.last_modified,
                "content_type": stat.content_type,
                "etag": stat.etag,
                "metadata": stat.metadata
            }

        except S3Error as e:
            logger.error(f"Error getting file info for {file_path}: {e}")
            raise

    @staticmethod
    def _calculate_hash(file_data: BinaryIO) -> str:
        """Calculate SHA-256 hash of file"""
        sha256_hash = hashlib.sha256()
        for byte_block in iter(lambda: file_data.read(4096), b""):
            sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()


# Global storage client instance
_storage_client: Optional[StorageClient] = None


def get_storage_client() -> StorageClient:
    """Get or create storage client instance"""
    global _storage_client
    if _storage_client is None:
        _storage_client = StorageClient()
    return _storage_client

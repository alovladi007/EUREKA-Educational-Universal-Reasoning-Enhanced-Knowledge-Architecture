"""
File Storage Service - File Management API Endpoints
"""
import os
import uuid
from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Form, Query
from fastapi.responses import StreamingResponse
import io
import logging

from app.core.storage import get_storage_client, StorageClient
from app.core.config import get_settings
from app.schemas import (
    FileUploadResponse, FileInfo, FileListResponse,
    PresignedUrlResponse, FileDeleteResponse
)

settings = get_settings()
logger = logging.getLogger(__name__)
router = APIRouter()


def validate_file_extension(filename: str) -> bool:
    """Check if file extension is allowed"""
    ext = os.path.splitext(filename)[1].lower()
    return ext in settings.ALLOWED_EXTENSIONS


def validate_file_size(file_size: int) -> bool:
    """Check if file size is within limits"""
    max_size_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    return file_size <= max_size_bytes


@router.post("/upload", response_model=FileUploadResponse, status_code=201)
async def upload_file(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None),
    course_id: Optional[str] = Form(None),
    assignment_id: Optional[str] = Form(None),
    folder: str = Form("general"),
    description: Optional[str] = Form(None),
    storage: StorageClient = Depends(get_storage_client)
):
    """
    Upload a file to storage

    Args:
        file: The file to upload
        user_id: Optional user ID (for organizing files)
        course_id: Optional course ID
        assignment_id: Optional assignment ID
        folder: Folder/category for organization
        description: Optional file description

    Returns:
        Upload confirmation with file details
    """
    try:
        # Validate file extension
        if not validate_file_extension(file.filename):
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Allowed types: {settings.ALLOWED_EXTENSIONS}"
            )

        # Read file content
        file_content = await file.read()
        file_size = len(file_content)

        # Validate file size
        if not validate_file_size(file_size):
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE_MB}MB"
            )

        # Generate unique file path
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]

        # Organize by folder and user_id if provided
        if user_id:
            file_path = f"{folder}/{user_id}/{file_id}{file_extension}"
        else:
            file_path = f"{folder}/{file_id}{file_extension}"

        # Upload to storage
        file_stream = io.BytesIO(file_content)
        upload_result = storage.upload_file(
            file_data=file_stream,
            file_path=file_path,
            content_type=file.content_type or "application/octet-stream",
            metadata={
                "original_filename": file.filename,
                "user_id": user_id or "",
                "course_id": course_id or "",
                "assignment_id": assignment_id or "",
                "description": description or ""
            }
        )

        # Generate presigned URL for immediate access (24 hours)
        download_url = storage.get_presigned_url(file_path, expires=timedelta(hours=24))

        logger.info(f"File uploaded successfully: {file_path}")

        return FileUploadResponse(
            file_id=uuid.UUID(file_id),
            file_path=file_path,
            filename=file.filename,
            content_type=file.content_type or "application/octet-stream",
            size=file_size,
            file_hash=upload_result["file_hash"],
            bucket=upload_result["bucket"],
            etag=upload_result["etag"],
            download_url=download_url
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/download/{file_path:path}")
async def download_file(
    file_path: str,
    storage: StorageClient = Depends(get_storage_client)
):
    """
    Download a file from storage

    Args:
        file_path: Path to file in storage

    Returns:
        File content as streaming response
    """
    try:
        # Check if file exists
        if not storage.file_exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")

        # Get file info
        file_info = storage.get_file_info(file_path)

        # Download file
        file_data = storage.download_file(file_path)

        # Get original filename from metadata if available
        filename = file_info.get("metadata", {}).get("X-Amz-Meta-Original_filename", file_path.split("/")[-1])

        logger.info(f"File downloaded: {file_path}")

        # Return as streaming response
        return StreamingResponse(
            io.BytesIO(file_data),
            media_type=file_info["content_type"],
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Length": str(file_info["size"])
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error downloading file {file_path}: {e}")
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")


@router.get("/info/{file_path:path}", response_model=FileInfo)
async def get_file_info(
    file_path: str,
    storage: StorageClient = Depends(get_storage_client)
):
    """
    Get metadata about a file

    Args:
        file_path: Path to file in storage

    Returns:
        File metadata
    """
    try:
        if not storage.file_exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")

        info = storage.get_file_info(file_path)
        filename = info.get("metadata", {}).get("X-Amz-Meta-Original_filename", file_path.split("/")[-1])

        return FileInfo(
            file_path=file_path,
            filename=filename,
            size=info["size"],
            content_type=info["content_type"],
            last_modified=info["last_modified"],
            etag=info["etag"],
            metadata=info.get("metadata", {})
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting file info for {file_path}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get file info: {str(e)}")


@router.get("/presigned-url/{file_path:path}", response_model=PresignedUrlResponse)
async def get_presigned_url(
    file_path: str,
    expires_hours: int = Query(1, ge=1, le=168),  # 1 hour to 7 days
    storage: StorageClient = Depends(get_storage_client)
):
    """
    Generate a presigned URL for temporary file access

    Args:
        file_path: Path to file in storage
        expires_hours: URL expiration in hours (default: 1, max: 168/7 days)

    Returns:
        Presigned URL with expiration info
    """
    try:
        if not storage.file_exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")

        url = storage.get_presigned_url(file_path, expires=timedelta(hours=expires_hours))

        return PresignedUrlResponse(
            url=url,
            expires_in_seconds=expires_hours * 3600,
            file_path=file_path
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating presigned URL for {file_path}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate URL: {str(e)}")


@router.get("/list", response_model=FileListResponse)
async def list_files(
    prefix: str = Query("", description="Filter files by prefix (e.g., 'assignments/user123/')"),
    max_files: int = Query(100, ge=1, le=1000, description="Maximum files to return"),
    storage: StorageClient = Depends(get_storage_client)
):
    """
    List files in storage

    Args:
        prefix: Filter by prefix/folder
        max_files: Maximum number of files to return

    Returns:
        List of files with metadata
    """
    try:
        files = storage.list_files(prefix=prefix, max_files=max_files)

        file_list = []
        for f in files:
            file_list.append(FileInfo(
                file_path=f["name"],
                filename=f["name"].split("/")[-1],
                size=f["size"],
                content_type="application/octet-stream",  # MinIO doesn't return this in list
                last_modified=f["last_modified"],
                etag=f["etag"],
                metadata={}
            ))

        return FileListResponse(
            files=file_list,
            total=len(file_list),
            prefix=prefix if prefix else None
        )

    except Exception as e:
        logger.error(f"Error listing files with prefix {prefix}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list files: {str(e)}")


@router.delete("/delete/{file_path:path}", response_model=FileDeleteResponse)
async def delete_file(
    file_path: str,
    storage: StorageClient = Depends(get_storage_client)
):
    """
    Delete a file from storage

    Args:
        file_path: Path to file in storage

    Returns:
        Deletion confirmation
    """
    try:
        if not storage.file_exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")

        storage.delete_file(file_path)

        logger.info(f"File deleted: {file_path}")

        return FileDeleteResponse(
            success=True,
            file_path=file_path,
            message="File deleted successfully"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting file {file_path}: {e}")
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")


@router.delete("/bulk-delete", response_model=dict)
async def bulk_delete_files(
    file_paths: list[str],
    storage: StorageClient = Depends(get_storage_client)
):
    """
    Delete multiple files from storage

    Args:
        file_paths: List of file paths to delete

    Returns:
        Deletion results
    """
    try:
        results = {
            "deleted": [],
            "failed": [],
            "not_found": []
        }

        for file_path in file_paths:
            try:
                if not storage.file_exists(file_path):
                    results["not_found"].append(file_path)
                    continue

                storage.delete_file(file_path)
                results["deleted"].append(file_path)

            except Exception as e:
                logger.error(f"Error deleting {file_path}: {e}")
                results["failed"].append({"file": file_path, "error": str(e)})

        return {
            "success": len(results["failed"]) == 0,
            "results": results,
            "summary": {
                "total": len(file_paths),
                "deleted": len(results["deleted"]),
                "failed": len(results["failed"]),
                "not_found": len(results["not_found"])
            }
        }

    except Exception as e:
        logger.error(f"Error in bulk delete: {e}")
        raise HTTPException(status_code=500, detail=f"Bulk delete failed: {str(e)}")

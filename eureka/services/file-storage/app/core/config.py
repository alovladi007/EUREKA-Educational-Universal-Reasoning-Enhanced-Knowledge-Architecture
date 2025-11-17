"""
File Storage Service - Configuration
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Service configuration"""

    # Service info
    SERVICE_NAME: str = "file-storage"
    VERSION: str = "1.0.0"
    PORT: int = 8006

    # MinIO/S3 Configuration
    S3_ENDPOINT: str = "localhost:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_BUCKET_NAME: str = "eureka-files"
    S3_SECURE: bool = False  # Use HTTP for local MinIO
    S3_REGION: str = "us-east-1"

    # File Upload Limits
    MAX_FILE_SIZE_MB: int = 100
    ALLOWED_EXTENSIONS: list = [
        # Documents
        ".pdf", ".doc", ".docx", ".txt", ".rtf", ".odt",
        # Images
        ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp",
        # Videos
        ".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm",
        # Archives
        ".zip", ".tar", ".gz", ".rar", ".7z",
        # Code
        ".py", ".js", ".java", ".cpp", ".c", ".h", ".cs", ".html", ".css",
        # Spreadsheets
        ".xls", ".xlsx", ".csv",
        # Presentations
        ".ppt", ".pptx",
        # Other
        ".json", ".xml", ".md"
    ]

    # Virus Scanning
    ENABLE_VIRUS_SCAN: bool = False  # Set to True if ClamAV is available

    # Storage paths
    TEMP_UPLOAD_DIR: str = "/tmp/eureka-uploads"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()

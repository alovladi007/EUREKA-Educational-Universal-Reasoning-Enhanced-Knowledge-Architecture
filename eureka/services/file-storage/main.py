"""
EUREKA File Storage Service

FastAPI application for handling file uploads, storage, and retrieval.
Integrates with MinIO/S3 for object storage.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time

from app.api.v1 import router as api_router
from app.core.config import get_settings

settings = get_settings()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="EUREKA File Storage Service",
    description="File upload, storage, and retrieval service with S3/MinIO integration",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Include API routes
app.include_router(api_router, prefix="/api/v1", tags=["files"])

# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    """Health check - service is running"""
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "version": settings.VERSION
    }

# Readiness check
@app.get("/ready", tags=["health"])
async def readiness_check():
    """Readiness check - can accept requests"""
    from app.core.storage import get_storage_client

    try:
        # Test storage connection
        storage = get_storage_client()
        # Simple check that client exists and bucket is accessible
        storage.file_exists("health-check-dummy")  # Won't exist, but tests connection
        storage_status = "connected"
    except Exception as e:
        logger.error(f"Storage connection error: {e}")
        storage_status = "disconnected"

    return {
        "status": "ready" if storage_status == "connected" else "not_ready",
        "storage": storage_status,
        "bucket": settings.S3_BUCKET_NAME
    }

# Root endpoint
@app.get("/", tags=["root"])
async def root():
    """Service information"""
    return {
        "service": "EUREKA File Storage Service",
        "version": settings.VERSION,
        "description": "File upload, download, and management with S3/MinIO",
        "docs": "/docs",
        "features": [
            "File upload (multipart)",
            "File download",
            "Presigned URLs",
            "File listing",
            "Bulk operations",
            "S3/MinIO integration"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True
    )

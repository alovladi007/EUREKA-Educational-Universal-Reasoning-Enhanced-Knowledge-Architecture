"""
EUREKA Content Service

Manages course content, lessons, modules, and learning materials.
Port: 8004
"""
from fastapi import Depends, FastAPI, HTTPException

# P0-3 (Gap Register): every data route requires a valid access token
# (was fully unauthenticated); / and /health stay public for probes.
from auth_guard import require_user

_authed = [Depends(require_user)]
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime
from enum import Enum
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="EUREKA Content Service",
    description="Course content management and delivery",
    version="1.0.0",
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


# Enums
class ContentType(str, Enum):
    LESSON = "lesson"
    VIDEO = "video"
    READING = "reading"
    QUIZ = "quiz"
    ASSIGNMENT = "assignment"
    DISCUSSION = "discussion"
    LAB = "lab"
    PROJECT = "project"


class ContentStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


# Schemas
class ContentBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    content_type: ContentType
    content_url: Optional[str] = None
    content_body: Optional[str] = None  # HTML/Markdown content
    duration_minutes: Optional[int] = None
    order_index: int = 0
    is_required: bool = True
    points_possible: Optional[int] = None


class ContentCreate(ContentBase):
    course_id: UUID
    module_id: Optional[UUID] = None


class ContentUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    content_url: Optional[str] = None
    content_body: Optional[str] = None
    duration_minutes: Optional[int] = None
    order_index: Optional[int] = None
    is_required: Optional[bool] = None
    points_possible: Optional[int] = None
    status: Optional[ContentStatus] = None


class ContentResponse(ContentBase):
    id: UUID
    course_id: UUID
    module_id: Optional[UUID] = None
    status: ContentStatus
    views_count: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[UUID] = None

    class Config:
        from_attributes = True


class ModuleBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    order_index: int = 0


class ModuleCreate(ModuleBase):
    course_id: UUID


class ModuleResponse(ModuleBase):
    id: UUID
    course_id: UUID
    content_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


# In-memory storage (replace with database in production)
content_db: dict[UUID, dict] = {}
modules_db: dict[UUID, dict] = {}


# ============= Module Endpoints =============

@app.post("/api/v1/modules", dependencies=_authed, response_model=ModuleResponse, status_code=201)
async def create_module(module: ModuleCreate):
    """Create a new content module"""
    module_id = uuid4()
    module_data = {
        **module.dict(),
        "id": module_id,
        "content_count": 0,
        "created_at": datetime.utcnow()
    }
    modules_db[module_id] = module_data
    logger.info(f"Created module: {module_id}")
    return module_data


@app.get("/api/v1/modules/{module_id}", dependencies=_authed, response_model=ModuleResponse)
async def get_module(module_id: UUID):
    """Get a specific module"""
    if module_id not in modules_db:
        raise HTTPException(status_code=404, detail="Module not found")
    return modules_db[module_id]


@app.get("/api/v1/courses/{course_id}/modules", dependencies=_authed, response_model=List[ModuleResponse])
async def list_course_modules(course_id: UUID):
    """List all modules for a course"""
    modules = [m for m in modules_db.values() if m["course_id"] == course_id]
    return sorted(modules, key=lambda x: x["order_index"])


@app.delete("/api/v1/modules/{module_id}", dependencies=_authed, status_code=204)
async def delete_module(module_id: UUID):
    """Delete a module"""
    if module_id not in modules_db:
        raise HTTPException(status_code=404, detail="Module not found")
    del modules_db[module_id]
    logger.info(f"Deleted module: {module_id}")
    return None


# ============= Content Endpoints =============

@app.post("/api/v1/content", dependencies=_authed, response_model=ContentResponse, status_code=201)
async def create_content(content: ContentCreate, created_by: Optional[UUID] = None):
    """Create new course content"""
    content_id = uuid4()
    content_data = {
        **content.dict(),
        "id": content_id,
        "status": ContentStatus.DRAFT,
        "views_count": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "created_by": created_by
    }
    content_db[content_id] = content_data

    # Update module content count
    if content.module_id and content.module_id in modules_db:
        modules_db[content.module_id]["content_count"] += 1

    logger.info(f"Created content: {content_id}")
    return content_data


@app.get("/api/v1/content/{content_id}", dependencies=_authed, response_model=ContentResponse)
async def get_content(content_id: UUID):
    """Get specific content"""
    if content_id not in content_db:
        raise HTTPException(status_code=404, detail="Content not found")

    # Increment view count
    content_db[content_id]["views_count"] += 1

    return content_db[content_id]


@app.get("/api/v1/courses/{course_id}/content", dependencies=_authed, response_model=List[ContentResponse])
async def list_course_content(
    course_id: UUID,
    module_id: Optional[UUID] = None,
    content_type: Optional[ContentType] = None,
    status: Optional[ContentStatus] = None
):
    """List all content for a course with optional filters"""
    content_list = [c for c in content_db.values() if c["course_id"] == course_id]

    if module_id:
        content_list = [c for c in content_list if c.get("module_id") == module_id]

    if content_type:
        content_list = [c for c in content_list if c["content_type"] == content_type]

    if status:
        content_list = [c for c in content_list if c["status"] == status]

    return sorted(content_list, key=lambda x: x["order_index"])


@app.patch("/api/v1/content/{content_id}", response_model=ContentResponse)
async def update_content(content_id: UUID, content_update: ContentUpdate):
    """Update content"""
    if content_id not in content_db:
        raise HTTPException(status_code=404, detail="Content not found")

    content = content_db[content_id]
    update_data = content_update.dict(exclude_unset=True)

    for field, value in update_data.items():
        content[field] = value

    content["updated_at"] = datetime.utcnow()

    logger.info(f"Updated content: {content_id}")
    return content


@app.delete("/api/v1/content/{content_id}", dependencies=_authed, status_code=204)
async def delete_content(content_id: UUID):
    """Delete content"""
    if content_id not in content_db:
        raise HTTPException(status_code=404, detail="Content not found")

    content = content_db[content_id]

    # Update module content count
    if content.get("module_id") and content["module_id"] in modules_db:
        modules_db[content["module_id"]]["content_count"] -= 1

    del content_db[content_id]
    logger.info(f"Deleted content: {content_id}")
    return None


@app.post("/api/v1/content/{content_id}/publish", dependencies=_authed, response_model=ContentResponse)
async def publish_content(content_id: UUID):
    """Publish content (make it available to students)"""
    if content_id not in content_db:
        raise HTTPException(status_code=404, detail="Content not found")

    content_db[content_id]["status"] = ContentStatus.PUBLISHED
    content_db[content_id]["updated_at"] = datetime.utcnow()

    logger.info(f"Published content: {content_id}")
    return content_db[content_id]


# ============= Health & Info Endpoints =============

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "content",
        "version": "1.0.0"
    }


@app.get("/")
async def root():
    """Service information"""
    return {
        "service": "EUREKA Content Service",
        "version": "1.0.0",
        "status": "running",
        "features": [
            "Course content management",
            "Module organization",
            "Multiple content types",
            "Content publishing workflow",
            "View tracking"
        ],
        "endpoints": {
            "modules": "/api/v1/modules",
            "content": "/api/v1/content",
            "docs": "/docs"
        },
        "stats": {
            "total_modules": len(modules_db),
            "total_content": len(content_db)
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8004,
        reload=True
    )

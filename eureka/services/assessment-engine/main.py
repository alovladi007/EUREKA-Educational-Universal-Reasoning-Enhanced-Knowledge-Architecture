"""
EUREKA Assessment Engine Service
Auto-grading and assessment with rubric-based scoring
Port: 8003
"""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.api.v1 import router as api_router
from app.core.config import settings
from app.core.database import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print("📝 Starting Assessment Engine Service...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print(f"✅ Assessment Engine running on port {settings.PORT}")
    yield
    # Shutdown
    print("👋 Shutting down Assessment Engine...")

app = FastAPI(
    title="EUREKA Assessment Engine",
    description="Auto-grading and assessment with rubric-based scoring",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(api_router, prefix="/api/v1/assess")

@app.get("/")
async def root():
    """Service info"""
    return {
        "service": "assessment-engine",
        "version": "1.0.0",
        "status": "running",
        "features": [
            "Auto-grading (multiple choice, short answer, essay)",
            "Rubric-based scoring",
            "Answer similarity detection",
            "Feedback generation",
            "Plagiarism detection"
        ]
    }

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "healthy", "service": "assessment-engine"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True
    )

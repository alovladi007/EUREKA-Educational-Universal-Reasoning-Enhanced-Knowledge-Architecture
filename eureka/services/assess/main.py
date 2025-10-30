"""
Assessment Engine Service
FastAPI application for managing assessments, questions, and grading
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.utils.database import init_db, close_db
from app.routes import assessments, questions, attempts, grading

# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    print("✅ Assessment Engine database initialized")
    yield
    # Shutdown
    await close_db()
    print("👋 Assessment Engine shutting down")

# Create FastAPI app
app = FastAPI(
    title="Assessment Engine API",
    description="Manage assessments, questions, attempts, and grading",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(assessments.router, prefix="/api/v1/assessments", tags=["Assessments"])
app.include_router(questions.router, prefix="/api/v1/questions", tags=["Questions"])
app.include_router(attempts.router, prefix="/api/v1/attempts", tags=["Attempts"])
app.include_router(grading.router, prefix="/api/v1/grading", tags=["Grading"])

@app.get("/")
async def root():
    return {
        "service": "Assessment Engine",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "assessments": "/api/v1/assessments",
            "questions": "/api/v1/questions",
            "attempts": "/api/v1/attempts",
            "grading": "/api/v1/grading"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "assessment-engine"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)

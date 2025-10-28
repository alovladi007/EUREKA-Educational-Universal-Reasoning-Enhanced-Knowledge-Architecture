"""
EUREKA Tutor-LLM Service
AI-powered tutoring with RAG (Retrieval-Augmented Generation)
Port: 8002
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
    print("🤖 Starting Tutor-LLM Service...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print(f"✅ Tutor-LLM Service running on port {settings.PORT}")
    yield
    # Shutdown
    print("👋 Shutting down Tutor-LLM Service...")

app = FastAPI(
    title="EUREKA Tutor-LLM Service",
    description="AI-powered tutoring with RAG for personalized learning",
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
app.include_router(api_router, prefix="/api/v1/tutor")

@app.get("/")
async def root():
    """Service info"""
    return {
        "service": "tutor-llm",
        "version": "1.0.0",
        "status": "running",
        "features": [
            "AI tutoring with RAG",
            "Conversation management",
            "Personalized learning",
            "Socratic teaching",
            "Multi-modal support"
        ]
    }

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "healthy", "service": "tutor-llm"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True
    )

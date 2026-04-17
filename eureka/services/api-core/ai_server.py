"""
Lightweight AI-only server for the Resume Builder.
Runs independently of the full api-core (no database required).

Usage: uvicorn ai_server:app --port 8000 --reload
"""

import sys
from types import SimpleNamespace

# Patch the auth dependency to skip database lookup
# This makes AI endpoints work without PostgreSQL
import app.utils.dependencies as deps
async def _mock_current_user():
    return SimpleNamespace(id="dev-user", email="dev@eureka.edu", role="admin")
deps.get_current_user = _mock_current_user

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints.resume_ai import router as ai_router
from app.api.v1.endpoints.resume_exports import router as exports_router

app = FastAPI(
    title="EUREKA Resume AI Service",
    version="1.0.0",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount AI and export routers under /api/v1
app.include_router(ai_router, prefix="/api/v1")
app.include_router(exports_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"service": "EUREKA Resume AI", "status": "running", "docs": "/docs"}


@app.get("/api/v1/")
async def api_root():
    return {
        "service": "EUREKA Resume AI",
        "endpoints": {
            "ai_summary": "/api/v1/resumes/ai/generate-summary",
            "ai_bullets": "/api/v1/resumes/ai/generate-bullets",
            "ai_tailor": "/api/v1/resumes/ai/tailor",
            "ai_skills": "/api/v1/resumes/ai/suggest-skills",
            "ai_ats": "/api/v1/resumes/ai/ats-score",
            "ai_tone": "/api/v1/resumes/ai/check-tone",
            "templates": "/api/v1/exports/templates",
        },
        "docs": "/docs",
    }

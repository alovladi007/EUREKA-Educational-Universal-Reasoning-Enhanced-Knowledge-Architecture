"""
EUREKA High School Tier Service

Provides gamification, badges, parent portal, and HS-specific features.
"""

import os
from fastapi import Depends, FastAPI

# P0-3 (Gap Register): every data route requires a valid access token
# (was fully unauthenticated); / and /health stay public for probes.
from auth_guard import require_user

_authed = [Depends(require_user)]
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="EUREKA High School Tier",
    description="Gamification, badges, parent portal, and K-12 features",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    # Explicit allowlist, never "*" with credentials: browsers reject the
    # combination outright, so the wildcard never actually worked for the
    # credentialed requests this app makes, and it advertises intent to
    # trust any origin. Override per environment with CORS_ORIGINS
    # (comma-separated); the default covers the local web and admin apps.
    allow_origins=[o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:4040,http://localhost:4041").split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "tier-hs"}

@app.get("/")
async def root():
    return {
        "service": "EUREKA High School Tier",
        "version": "1.0.0",
        "features": [
            "gamification",
            "badges",
            "parent_portal",
            "standards_alignment"
        ]
    }

@app.get("/api/v1/courses", dependencies=_authed)
async def get_courses():
    return {
        "courses": [],
        "statistics": {
            "total_courses": 12,
            "completed_courses": 3,
            "in_progress": 5,
            "average_grade": 85
        }
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", "8001"))
    uvicorn.run(app, host="0.0.0.0", port=port)

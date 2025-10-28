"""
EUREKA High School Tier Service

Provides gamification, badges, parent portal, and HS-specific features.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="EUREKA High School Tier",
    description="Gamification, badges, parent portal, and K-12 features",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

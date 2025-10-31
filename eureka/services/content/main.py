"""
EUREKA Content Service
Placeholder - To be implemented
"""
from fastapi import FastAPI

app = FastAPI(
    title="EUREKA Content Service",
    description="Content management and delivery (placeholder)",
    version="0.1.0"
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "content", "implemented": False}

@app.get("/")
async def root():
    return {
        "service": "content",
        "status": "placeholder",
        "message": "Service implementation pending"
    }

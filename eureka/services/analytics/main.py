"""
EUREKA Analytics Service
Placeholder - To be implemented
"""
from fastapi import FastAPI

app = FastAPI(
    title="EUREKA Analytics Service",
    description="Analytics and reporting (placeholder)",
    version="0.1.0"
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "analytics", "implemented": False}

@app.get("/")
async def root():
    return {
        "service": "analytics",
        "status": "placeholder",
        "message": "Service implementation pending"
    }

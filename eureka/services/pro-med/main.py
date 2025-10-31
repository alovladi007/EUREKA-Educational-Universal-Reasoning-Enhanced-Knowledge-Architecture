"""
EUREKA Medical School Service
Placeholder - To be implemented
"""
from fastapi import FastAPI

app = FastAPI(
    title="EUREKA Medical School Service",
    description="Medical School tier (placeholder)",
    version="0.1.0"
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "pro-med", "implemented": False}

@app.get("/")
async def root():
    return {
        "service": "pro-med",
        "tier": "professional",
        "status": "placeholder",
        "message": "Service implementation pending"
    }

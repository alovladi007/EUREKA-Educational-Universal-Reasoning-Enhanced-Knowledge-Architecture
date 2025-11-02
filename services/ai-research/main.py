"""
EUREKA AI Research Core
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.api.v1 import research

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan"""
    logger.info(f"Starting {settings.SERVICE_NAME}")
    logger.info(f"Multi-agent orchestration enabled: {settings.ENABLE_AGENT_MEMORY}")

    # In production: Initialize vector DB, load models
    yield

    logger.info(f"Shutting down {settings.SERVICE_NAME}")


app = FastAPI(
    title=settings.SERVICE_NAME,
    description="Multi-agent AI research core with federated learning and hypothesis generation",
    version=settings.VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        'service': settings.SERVICE_NAME,
        'version': settings.VERSION,
        'status': 'operational',
        'features': [
            'Multi-agent research workflows',
            'Paper analysis',
            'Hypothesis generation',
            'Federated learning (coming soon)'
        ]
    }


@app.get("/health")
async def health_check():
    return {
        'status': 'healthy',
        'service': settings.SERVICE_NAME
    }


app.include_router(
    research.router,
    prefix=f"{settings.API_V1_PREFIX}/research",
    tags=["Research"]
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8060, reload=True)

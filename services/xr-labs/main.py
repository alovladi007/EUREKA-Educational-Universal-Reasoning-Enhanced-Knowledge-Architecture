"""EUREKA XR Labs - Immersive & Experiential Learning"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="EUREKA XR Labs", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        'service': 'EUREKA XR Labs',
        'features': ['WebXR simulations', 'Physics sandbox', '3D scenarios', 'VR/AR learning']
    }

@app.get("/health")
async def health():
    return {'status': 'healthy'}

# Simulation endpoints would go here
# /api/v1/simulations/create
# /api/v1/simulations/run
# /api/v1/webxr/scenes

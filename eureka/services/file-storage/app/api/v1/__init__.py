"""API v1 endpoints"""
from fastapi import APIRouter
from app.api.v1 import files

router = APIRouter()
router.include_router(files.router, prefix="/files", tags=["files"])

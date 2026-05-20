"""Resume API endpoints — async (rewritten 2026-05 to fix AsyncSession bug)."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.utils.dependencies import get_current_user
from app.crud.resume import (
    create_resume,
    get_resume,
    get_resume_by_slug,
    list_resumes,
    update_resume,
    delete_resume,
    duplicate_resume,
    create_version,
    list_versions,
    increment_view_count,
)
from app.schemas.resume import (
    ResumeCreate,
    ResumeUpdate,
    ResumeResponse,
    ResumeListItem,
    ResumeVersionCreate,
    ResumeVersionResponse,
    ResumeShareUpdate,
    ResumePublicResponse,
)

router = APIRouter(prefix="/resumes", tags=["resumes"])


# ── Resume CRUD ──────────────────────────────────────────────


@router.post("", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def api_create_resume(
    resume_in: ResumeCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Create a new resume."""
    return await create_resume(db, current_user.id, resume_in)


@router.get("", response_model=List[ResumeListItem])
async def api_list_resumes(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """List all resumes for the current user."""
    return await list_resumes(db, current_user.id)


@router.get("/{resume_id}", response_model=ResumeResponse)
async def api_get_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get a specific resume by ID."""
    resume = await get_resume(db, resume_id, current_user.id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.patch("/{resume_id}", response_model=ResumeResponse)
async def api_update_resume(
    resume_id: str,
    resume_in: ResumeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Update a resume (partial update)."""
    resume = await update_resume(db, resume_id, current_user.id, resume_in)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def api_delete_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Delete a resume."""
    if not await delete_resume(db, resume_id, current_user.id):
        raise HTTPException(status_code=404, detail="Resume not found")


@router.post("/{resume_id}/duplicate", response_model=ResumeResponse)
async def api_duplicate_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Duplicate a resume."""
    resume = await duplicate_resume(db, resume_id, current_user.id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


# ── Sharing ──────────────────────────────────────────────────


@router.patch("/{resume_id}/share", response_model=ResumeResponse)
async def api_update_share(
    resume_id: str,
    share_in: ResumeShareUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Toggle public/private and optionally set custom slug."""
    update_data = ResumeUpdate(
        is_public=share_in.is_public,
        slug=share_in.slug,
    )
    resume = await update_resume(db, resume_id, current_user.id, update_data)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.get("/shared/{slug}", response_model=ResumePublicResponse)
async def api_get_public_resume(slug: str, db: AsyncSession = Depends(get_db)):
    """Get a public resume by share slug (no auth required)."""
    resume = await get_resume_by_slug(db, slug)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found or not public")
    # Track view
    await increment_view_count(db, slug)
    return resume


# ── Version History ──────────────────────────────────────────


@router.post(
    "/{resume_id}/versions",
    response_model=ResumeVersionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def api_create_version(
    resume_id: str,
    version_in: ResumeVersionCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Save a named version of a resume."""
    version = await create_version(db, resume_id, current_user.id, version_in)
    if not version:
        raise HTTPException(status_code=404, detail="Resume not found")
    return version


@router.get("/{resume_id}/versions", response_model=List[ResumeVersionResponse])
async def api_list_versions(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """List all versions of a resume."""
    return await list_versions(db, resume_id, current_user.id)

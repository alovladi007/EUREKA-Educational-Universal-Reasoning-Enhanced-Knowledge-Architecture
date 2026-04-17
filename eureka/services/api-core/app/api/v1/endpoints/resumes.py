"""Resume API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.auth.dependencies import get_current_user
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
def api_create_resume(
    resume_in: ResumeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Create a new resume."""
    return create_resume(db, current_user.id, resume_in)


@router.get("", response_model=List[ResumeListItem])
def api_list_resumes(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """List all resumes for the current user."""
    return list_resumes(db, current_user.id)


@router.get("/{resume_id}", response_model=ResumeResponse)
def api_get_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get a specific resume by ID."""
    resume = get_resume(db, resume_id, current_user.id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.patch("/{resume_id}", response_model=ResumeResponse)
def api_update_resume(
    resume_id: str,
    resume_in: ResumeUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Update a resume (partial update)."""
    resume = update_resume(db, resume_id, current_user.id, resume_in)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def api_delete_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Delete a resume."""
    if not delete_resume(db, resume_id, current_user.id):
        raise HTTPException(status_code=404, detail="Resume not found")


@router.post("/{resume_id}/duplicate", response_model=ResumeResponse)
def api_duplicate_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Duplicate a resume."""
    resume = duplicate_resume(db, resume_id, current_user.id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


# ── Sharing ──────────────────────────────────────────────────


@router.patch("/{resume_id}/share", response_model=ResumeResponse)
def api_update_share(
    resume_id: str,
    share_in: ResumeShareUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Toggle public/private and optionally set custom slug."""
    update_data = ResumeUpdate(
        is_public=share_in.is_public,
        slug=share_in.slug,
    )
    resume = update_resume(db, resume_id, current_user.id, update_data)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.get("/shared/{slug}", response_model=ResumePublicResponse)
def api_get_public_resume(slug: str, db: Session = Depends(get_db)):
    """Get a public resume by share slug (no auth required)."""
    resume = get_resume_by_slug(db, slug)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found or not public")
    # Track view
    increment_view_count(db, slug)
    return resume


# ── Version History ──────────────────────────────────────────


@router.post("/{resume_id}/versions", response_model=ResumeVersionResponse, status_code=status.HTTP_201_CREATED)
def api_create_version(
    resume_id: str,
    version_in: ResumeVersionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Save a named version of a resume."""
    version = create_version(db, resume_id, current_user.id, version_in)
    if not version:
        raise HTTPException(status_code=404, detail="Resume not found")
    return version


@router.get("/{resume_id}/versions", response_model=List[ResumeVersionResponse])
def api_list_versions(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """List all versions of a resume."""
    return list_versions(db, resume_id, current_user.id)

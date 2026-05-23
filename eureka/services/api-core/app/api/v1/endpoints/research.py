"""
Phase 16.2 — Research workspaces REST surface.

Workspaces (auth required, user owns their workspaces)
  POST   /me/research/workspaces              create
  GET    /me/research/workspaces              list my own (filter: status, kind)
  GET    /me/research/workspaces/{id}         detail (+ references + drafts)
  PATCH  /me/research/workspaces/{id}         update
  DELETE /me/research/workspaces/{id}         delete

References
  POST   /me/research/workspaces/{id}/references          add (DOI-deduped)
  POST   /me/research/workspaces/{id}/references/lookup   CrossRef / arXiv lookup
                                                          (does NOT store; frontend
                                                          reviews + POSTs to /references)
  GET    /me/research/workspaces/{id}/references          list
  PATCH  /me/research/references/{ref_id}                 update
  DELETE /me/research/references/{ref_id}                 delete

Drafts
  POST   /me/research/workspaces/{id}/drafts              create
  GET    /me/research/workspaces/{id}/drafts              list (ordered by sort_index)
  PATCH  /me/research/drafts/{draft_id}                   update
  DELETE /me/research/drafts/{draft_id}                   delete

Export
  GET    /me/research/workspaces/{id}/export/bibtex       BibTeX export

Ownership pattern: workspace.user_id == current_user.id, else 404
(not 403 — avoid leaking existence). Public workspaces are readable by
anyone in the org (read-only path) but not modifiable.
"""

from __future__ import annotations

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.research import (
    LitReviewEntry,
    ResearchWorkspace,
    WorkspaceDraft,
)
from app.models.user import User
from app.schemas.research import (
    BibTexExportResponse,
    DraftCreate,
    DraftResponse,
    DraftUpdate,
    LitReviewEntryCreate,
    LitReviewEntryResponse,
    LitReviewEntryUpdate,
    LookupRequest,
    LookupResponse,
    WorkspaceCreate,
    WorkspaceDetailResponse,
    WorkspaceResponse,
    WorkspaceUpdate,
)
from app.services import research as research_svc
from app.utils.dependencies import get_current_user


router = APIRouter()


# ---------------------------------------------------------------------------
# Ownership guards
# ---------------------------------------------------------------------------


async def _get_owned_workspace_or_404(
    db: AsyncSession,
    workspace_id: UUID,
    user: User,
    *,
    allow_public_read: bool = False,
) -> ResearchWorkspace:
    ws = await db.get(ResearchWorkspace, workspace_id)
    if ws is None:
        raise HTTPException(status_code=404, detail="workspace not found")
    if ws.user_id == user.id:
        return ws
    if allow_public_read and ws.is_public:
        return ws
    # Deliberately 404 instead of 403 — don't leak workspace existence.
    raise HTTPException(status_code=404, detail="workspace not found")


async def _get_owned_reference_or_404(
    db: AsyncSession, ref_id: UUID, user: User
) -> tuple[LitReviewEntry, ResearchWorkspace]:
    entry = await db.get(LitReviewEntry, ref_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="reference not found")
    ws = await _get_owned_workspace_or_404(db, entry.workspace_id, user)
    return entry, ws


async def _get_owned_draft_or_404(
    db: AsyncSession, draft_id: UUID, user: User
) -> tuple[WorkspaceDraft, ResearchWorkspace]:
    draft = await db.get(WorkspaceDraft, draft_id)
    if draft is None:
        raise HTTPException(status_code=404, detail="draft not found")
    ws = await _get_owned_workspace_or_404(db, draft.workspace_id, user)
    return draft, ws


# ---------------------------------------------------------------------------
# Workspaces
# ---------------------------------------------------------------------------


@router.post(
    "/me/research/workspaces",
    response_model=WorkspaceResponse,
    status_code=201,
)
async def create_workspace_endpoint(
    payload: WorkspaceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ws = await research_svc.create_workspace(
        db, user_id=current_user.id, payload=payload
    )
    await db.commit()
    await db.refresh(ws)
    return ws


@router.get("/me/research/workspaces", response_model=list[WorkspaceResponse])
async def list_workspaces_endpoint(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: Optional[str] = None,
    kind: Optional[str] = None,
    limit: int = 100,
):
    return await research_svc.list_my_workspaces(
        db, user_id=current_user.id, status=status, kind=kind, limit=limit
    )


@router.get(
    "/me/research/workspaces/{workspace_id}",
    response_model=WorkspaceDetailResponse,
)
async def get_workspace_detail_endpoint(
    workspace_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ws = await _get_owned_workspace_or_404(
        db, workspace_id, current_user, allow_public_read=True
    )
    refs = await research_svc.list_references(db, workspace_id=workspace_id)
    drafts = await research_svc.list_drafts(db, workspace_id=workspace_id)
    base = WorkspaceResponse.model_validate(ws).model_dump()
    return WorkspaceDetailResponse(
        **base,
        references=[LitReviewEntryResponse.model_validate(r) for r in refs],
        drafts=[DraftResponse.model_validate(d) for d in drafts],
    )


@router.patch(
    "/me/research/workspaces/{workspace_id}",
    response_model=WorkspaceResponse,
)
async def update_workspace_endpoint(
    workspace_id: UUID,
    payload: WorkspaceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ws = await _get_owned_workspace_or_404(db, workspace_id, current_user)
    ws = await research_svc.update_workspace(db, workspace=ws, payload=payload)
    await db.commit()
    await db.refresh(ws)
    return ws


@router.delete(
    "/me/research/workspaces/{workspace_id}",
    status_code=204,
)
async def delete_workspace_endpoint(
    workspace_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ws = await _get_owned_workspace_or_404(db, workspace_id, current_user)
    await research_svc.delete_workspace(db, workspace=ws)
    await db.commit()
    return None


# ---------------------------------------------------------------------------
# References
# ---------------------------------------------------------------------------


@router.post(
    "/me/research/workspaces/{workspace_id}/references",
    response_model=LitReviewEntryResponse,
    status_code=201,
)
async def add_reference_endpoint(
    workspace_id: UUID,
    payload: LitReviewEntryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _get_owned_workspace_or_404(db, workspace_id, current_user)
    entry = await research_svc.add_reference(
        db, workspace_id=workspace_id, payload=payload
    )
    await db.commit()
    await db.refresh(entry)
    return entry


@router.post(
    "/me/research/workspaces/{workspace_id}/references/lookup",
    response_model=LookupResponse,
)
async def lookup_reference_endpoint(
    workspace_id: UUID,
    payload: LookupRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Resolve a DOI / arXiv ID via the external metadata service. Returns the
    normalized fields. Does NOT persist — frontend reviews then POSTs to
    /references with the chosen values."""
    await _get_owned_workspace_or_404(db, workspace_id, current_user)
    kind = (payload.kind or "").lower()
    if kind == "doi":
        result = await research_svc.lookup_crossref(payload.value)
    elif kind == "arxiv":
        result = await research_svc.lookup_arxiv(payload.value)
    else:
        raise HTTPException(status_code=400, detail="kind must be 'doi' or 'arxiv'")
    if result is None:
        return LookupResponse(found=False)
    return LookupResponse(**result)


@router.get(
    "/me/research/workspaces/{workspace_id}/references",
    response_model=list[LitReviewEntryResponse],
)
async def list_references_endpoint(
    workspace_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _get_owned_workspace_or_404(
        db, workspace_id, current_user, allow_public_read=True
    )
    return await research_svc.list_references(db, workspace_id=workspace_id)


@router.patch(
    "/me/research/references/{ref_id}",
    response_model=LitReviewEntryResponse,
)
async def update_reference_endpoint(
    ref_id: UUID,
    payload: LitReviewEntryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry, _ = await _get_owned_reference_or_404(db, ref_id, current_user)
    entry = await research_svc.update_reference(db, entry=entry, payload=payload)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete(
    "/me/research/references/{ref_id}",
    status_code=204,
)
async def delete_reference_endpoint(
    ref_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry, _ = await _get_owned_reference_or_404(db, ref_id, current_user)
    await research_svc.delete_reference(db, entry=entry)
    await db.commit()
    return None


# ---------------------------------------------------------------------------
# Drafts
# ---------------------------------------------------------------------------


@router.post(
    "/me/research/workspaces/{workspace_id}/drafts",
    response_model=DraftResponse,
    status_code=201,
)
async def create_draft_endpoint(
    workspace_id: UUID,
    payload: DraftCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _get_owned_workspace_or_404(db, workspace_id, current_user)
    draft = await research_svc.create_draft(
        db, workspace_id=workspace_id, payload=payload
    )
    await db.commit()
    await db.refresh(draft)
    return draft


@router.get(
    "/me/research/workspaces/{workspace_id}/drafts",
    response_model=list[DraftResponse],
)
async def list_drafts_endpoint(
    workspace_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _get_owned_workspace_or_404(
        db, workspace_id, current_user, allow_public_read=True
    )
    return await research_svc.list_drafts(db, workspace_id=workspace_id)


@router.patch(
    "/me/research/drafts/{draft_id}",
    response_model=DraftResponse,
)
async def update_draft_endpoint(
    draft_id: UUID,
    payload: DraftUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    draft, _ = await _get_owned_draft_or_404(db, draft_id, current_user)
    draft = await research_svc.update_draft(db, draft=draft, payload=payload)
    await db.commit()
    await db.refresh(draft)
    return draft


@router.delete(
    "/me/research/drafts/{draft_id}",
    status_code=204,
)
async def delete_draft_endpoint(
    draft_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    draft, _ = await _get_owned_draft_or_404(db, draft_id, current_user)
    await research_svc.delete_draft(db, draft=draft)
    await db.commit()
    return None


# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------


@router.get(
    "/me/research/workspaces/{workspace_id}/export/bibtex",
    response_model=BibTexExportResponse,
)
async def export_bibtex_endpoint(
    workspace_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _get_owned_workspace_or_404(
        db, workspace_id, current_user, allow_public_read=True
    )
    bibtex, count = await research_svc.export_bibtex(db, workspace_id=workspace_id)
    return BibTexExportResponse(bibtex=bibtex, format="bibtex", count=count)

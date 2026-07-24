"""R-1 — research collaboration: workspace sharing + lab groups.

Extends the existing solo research workspace (research.py). v1: workspace
members get READ access ("shared with me" listing + the owner manages the
member list by email); collaborator write access is R-2. Research groups are
org-visible, open-join labs/reading groups.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.research import LitReviewEntry, ResearchWorkspace, WorkspaceDraft
from app.models.research_collab import (
    ResearchGroup,
    ResearchGroupMember,
    ResearchWorkspaceMember,
)
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.utils.rbac import is_admin

router = APIRouter()


async def _names(db: AsyncSession, ids: list[UUID]) -> dict[UUID, str]:
    if not ids:
        return {}
    users = (await db.execute(select(User).where(User.id.in_(set(ids))))).scalars().all()
    return {u.id: (u.display_name or f"{u.first_name} {u.last_name}") for u in users}


# ---------------------------------------------------------------------------
# Workspace sharing
# ---------------------------------------------------------------------------


class WsMemberAddRequest(BaseModel):
    email: EmailStr
    role: str = Field("viewer", pattern="^(viewer|collaborator)$")


class WsMemberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: UUID
    role: str
    joined_at: datetime
    name: Optional[str] = None


class SharedWorkspaceResponse(BaseModel):
    id: UUID
    title: str
    kind: str
    status: str
    owner_name: Optional[str] = None
    my_role: str


async def _own_workspace(db: AsyncSession, wid: UUID, user: User) -> ResearchWorkspace:
    w = await db.get(ResearchWorkspace, wid)
    if w is None:
        raise HTTPException(status_code=404, detail="workspace not found")
    if w.user_id != user.id and not is_admin(user):
        raise HTTPException(status_code=403, detail="only the owner manages members")
    return w


@router.get("/me/research/workspaces/{workspace_id}/members", response_model=list[WsMemberResponse])
async def list_ws_members(
    workspace_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    w = await db.get(ResearchWorkspace, workspace_id)
    if w is None:
        raise HTTPException(status_code=404, detail="workspace not found")
    rows = list((await db.execute(
        select(ResearchWorkspaceMember).where(ResearchWorkspaceMember.workspace_id == workspace_id)
    )).scalars().all())
    # Owner and members can see the list.
    if w.user_id != current_user.id and current_user.id not in {m.user_id for m in rows} and not is_admin(current_user):
        raise HTTPException(status_code=403, detail="not a member")
    names = await _names(db, [m.user_id for m in rows])
    out = []
    for m in rows:
        mr = WsMemberResponse.model_validate(m)
        mr.name = names.get(m.user_id)
        out.append(mr)
    return out


@router.post("/me/research/workspaces/{workspace_id}/members", response_model=WsMemberResponse, status_code=201)
async def add_ws_member(
    workspace_id: UUID,
    payload: WsMemberAddRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _own_workspace(db, workspace_id, current_user)
    target = (await db.execute(
        select(User).where(User.email == str(payload.email), User.org_id == current_user.org_id)
    )).scalar_one_or_none()
    if target is None:
        raise HTTPException(status_code=404, detail="no user with that email in your organization")
    if target.id == current_user.id:
        raise HTTPException(status_code=409, detail="you already own this workspace")
    m = ResearchWorkspaceMember(
        workspace_id=workspace_id, user_id=target.id, role=payload.role, added_by=current_user.id,
    )
    db.add(m)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=409, detail="already a member")
    await db.refresh(m)
    r = WsMemberResponse.model_validate(m)
    r.name = target.display_name or f"{target.first_name} {target.last_name}"
    return r


@router.delete("/me/research/workspaces/{workspace_id}/members/{user_id}", status_code=204)
async def remove_ws_member(
    workspace_id: UUID,
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    w = await db.get(ResearchWorkspace, workspace_id)
    if w is None:
        raise HTTPException(status_code=404, detail="workspace not found")
    # Owner can remove anyone; a member can remove themselves (leave).
    if w.user_id != current_user.id and user_id != current_user.id and not is_admin(current_user):
        raise HTTPException(status_code=403, detail="not allowed")
    m = (await db.execute(
        select(ResearchWorkspaceMember).where(
            ResearchWorkspaceMember.workspace_id == workspace_id,
            ResearchWorkspaceMember.user_id == user_id,
        )
    )).scalar_one_or_none()
    if m is not None:
        await db.delete(m)
        await db.commit()


@router.get("/me/research/shared-workspaces", response_model=list[SharedWorkspaceResponse])
async def list_shared_workspaces(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Workspaces shared WITH me (read access via membership)."""
    rows = (await db.execute(
        select(ResearchWorkspaceMember, ResearchWorkspace)
        .join(ResearchWorkspace, ResearchWorkspace.id == ResearchWorkspaceMember.workspace_id)
        .where(ResearchWorkspaceMember.user_id == current_user.id)
        .order_by(ResearchWorkspaceMember.joined_at.desc())
    )).all()
    names = await _names(db, [w.user_id for _, w in rows])
    return [
        SharedWorkspaceResponse(
            id=w.id, title=w.title, kind=str(w.kind), status=str(w.status),
            owner_name=names.get(w.user_id), my_role=m.role,
        )
        for m, w in rows
    ]


class LitEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    authors: list[str]
    venue: Optional[str]
    year: Optional[int]
    read_status: str
    user_notes_md: Optional[str]


class DraftOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    kind: str
    updated_at: datetime


class WorkspaceOverview(BaseModel):
    id: UUID
    title: str
    description_md: Optional[str]
    kind: str
    status: str
    tags: list[str]
    owner_name: Optional[str]
    my_role: str  # owner | viewer | collaborator
    lit_review: list[LitEntryOut]
    drafts: list[DraftOut]


@router.get("/research/workspaces/{workspace_id}/overview", response_model=WorkspaceOverview)
async def workspace_overview(
    workspace_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Read-only workspace view for the owner AND shared members — this is
    what 'read access' concretely grants."""
    w = await db.get(ResearchWorkspace, workspace_id)
    if w is None:
        raise HTTPException(status_code=404, detail="workspace not found")
    my_role = "owner" if w.user_id == current_user.id else None
    if my_role is None:
        m = (await db.execute(
            select(ResearchWorkspaceMember).where(
                ResearchWorkspaceMember.workspace_id == workspace_id,
                ResearchWorkspaceMember.user_id == current_user.id,
            )
        )).scalar_one_or_none()
        if m is None and not is_admin(current_user):
            raise HTTPException(status_code=403, detail="not shared with you")
        my_role = m.role if m else "admin"
    entries = (await db.execute(
        select(LitReviewEntry).where(LitReviewEntry.workspace_id == workspace_id)
        .order_by(LitReviewEntry.created_at.desc()).limit(100)
    )).scalars().all()
    drafts = (await db.execute(
        select(WorkspaceDraft).where(WorkspaceDraft.workspace_id == workspace_id)
        .order_by(WorkspaceDraft.updated_at.desc()).limit(50)
    )).scalars().all()
    return WorkspaceOverview(
        id=w.id, title=w.title, description_md=w.description_md,
        kind=str(w.kind), status=str(w.status), tags=list(w.tags or []),
        owner_name=(await _names(db, [w.user_id])).get(w.user_id),
        my_role=my_role,
        lit_review=[LitEntryOut.model_validate(e) for e in entries],
        drafts=[DraftOut.model_validate(d) for d in drafts],
    )


# ---------------------------------------------------------------------------
# Research groups (labs / reading groups)
# ---------------------------------------------------------------------------


class RGroupCreateRequest(BaseModel):
    name: str = Field(..., min_length=3, max_length=160)
    description_md: Optional[str] = None
    tags: list[str] = Field(default_factory=list, max_length=10)


class RGroupResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    org_id: UUID
    user_id: UUID
    name: str
    description_md: Optional[str]
    tags: list[str]
    member_count: int
    created_at: datetime
    is_member: bool = False
    owner_name: Optional[str] = None


@router.post("/research-groups", response_model=RGroupResponse, status_code=201)
async def create_rgroup(
    payload: RGroupCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    g = ResearchGroup(
        org_id=current_user.org_id, user_id=current_user.id,
        name=payload.name, description_md=payload.description_md, tags=payload.tags,
    )
    db.add(g)
    await db.flush()
    db.add(ResearchGroupMember(group_id=g.id, user_id=current_user.id, role="pi"))
    await db.commit()
    await db.refresh(g)
    r = RGroupResponse.model_validate(g)
    r.is_member = True
    r.owner_name = (await _names(db, [g.user_id])).get(g.user_id)
    return r


@router.get("/research-groups", response_model=list[RGroupResponse])
async def list_rgroups(
    q: Optional[str] = Query(None, max_length=120),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    qry = select(ResearchGroup).where(ResearchGroup.org_id == current_user.org_id)
    if q:
        qry = qry.where(ResearchGroup.name.ilike(f"%{q}%"))
    rows = list((await db.execute(qry.order_by(ResearchGroup.created_at.desc()).limit(limit))).scalars().all())
    my_ids = {
        m for (m,) in (await db.execute(
            select(ResearchGroupMember.group_id).where(ResearchGroupMember.user_id == current_user.id)
        )).all()
    }
    names = await _names(db, [r.user_id for r in rows])
    out = []
    for g in rows:
        gr = RGroupResponse.model_validate(g)
        gr.is_member = g.id in my_ids
        gr.owner_name = names.get(g.user_id)
        out.append(gr)
    return out


@router.post("/research-groups/{group_id}/join", response_model=RGroupResponse)
async def join_rgroup(
    group_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    g = await db.get(ResearchGroup, group_id)
    if g is None or g.org_id != current_user.org_id:
        raise HTTPException(status_code=404, detail="group not found")
    db.add(ResearchGroupMember(group_id=group_id, user_id=current_user.id, role="member"))
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
    await db.refresh(g)
    r = RGroupResponse.model_validate(g)
    r.is_member = True
    r.owner_name = (await _names(db, [g.user_id])).get(g.user_id)
    return r


@router.post("/research-groups/{group_id}/leave", status_code=204)
async def leave_rgroup(
    group_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    g = await db.get(ResearchGroup, group_id)
    if g is None or g.org_id != current_user.org_id:
        raise HTTPException(status_code=404, detail="group not found")
    if g.user_id == current_user.id:
        raise HTTPException(status_code=409, detail="PI cannot leave; delete the group instead")
    m = (await db.execute(
        select(ResearchGroupMember).where(
            ResearchGroupMember.group_id == group_id,
            ResearchGroupMember.user_id == current_user.id,
        )
    )).scalar_one_or_none()
    if m is not None:
        await db.delete(m)
        await db.commit()


@router.delete("/research-groups/{group_id}", status_code=204)
async def delete_rgroup(
    group_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    g = await db.get(ResearchGroup, group_id)
    if g is None or g.org_id != current_user.org_id:
        raise HTTPException(status_code=404, detail="group not found")
    if g.user_id != current_user.id and not is_admin(current_user):
        raise HTTPException(status_code=403, detail="only the PI can delete")
    await db.delete(g)
    await db.commit()

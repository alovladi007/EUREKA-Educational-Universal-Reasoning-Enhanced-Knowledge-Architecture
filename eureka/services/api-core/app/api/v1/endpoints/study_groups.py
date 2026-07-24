"""Study groups — exam/tier cohorts with group-scoped community threads.

v1 semantics (deliberate, documented): groups are visible to the whole org
and open to join. Membership is required to post threads into a group.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.study_group import StudyGroup, StudyGroupMember
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.utils.rbac import is_admin

router = APIRouter()


class GroupCreateRequest(BaseModel):
    name: str = Field(..., min_length=3, max_length=160)
    description_md: Optional[str] = None
    exam_code: Optional[str] = Field(None, max_length=40)
    tier: Optional[str] = Field(None, max_length=40)


class GroupUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=160)
    description_md: Optional[str] = None
    exam_code: Optional[str] = Field(None, max_length=40)
    tier: Optional[str] = Field(None, max_length=40)


class GroupResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    org_id: UUID
    user_id: UUID
    name: str
    description_md: Optional[str]
    exam_code: Optional[str]
    tier: Optional[str]
    member_count: int
    created_at: datetime
    updated_at: datetime
    is_member: bool = False
    owner_name: Optional[str] = None


class MemberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: UUID
    role: str
    joined_at: datetime
    name: Optional[str] = None


async def _names(db: AsyncSession, ids: list[UUID]) -> dict[UUID, str]:
    if not ids:
        return {}
    users = (await db.execute(select(User).where(User.id.in_(set(ids))))).scalars().all()
    return {u.id: (u.display_name or f"{u.first_name} {u.last_name}") for u in users}


@router.post("/study-groups", response_model=GroupResponse, status_code=201)
async def create_group(
    payload: GroupCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    g = StudyGroup(
        org_id=current_user.org_id, user_id=current_user.id,
        name=payload.name, description_md=payload.description_md,
        exam_code=payload.exam_code, tier=payload.tier,
    )
    db.add(g)
    await db.flush()
    db.add(StudyGroupMember(group_id=g.id, user_id=current_user.id, role="owner"))
    await db.commit()
    await db.refresh(g)
    r = GroupResponse.model_validate(g)
    r.is_member = True
    r.owner_name = (await _names(db, [g.user_id])).get(g.user_id)
    return r


@router.get("/study-groups", response_model=list[GroupResponse])
async def list_groups(
    exam_code: Optional[str] = None,
    mine: bool = Query(False),
    q: Optional[str] = Query(None, max_length=120),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    qry = select(StudyGroup).where(StudyGroup.org_id == current_user.org_id)
    if exam_code:
        qry = qry.where(StudyGroup.exam_code == exam_code)
    if q:
        qry = qry.where(StudyGroup.name.ilike(f"%{q}%"))
    qry = qry.order_by(StudyGroup.created_at.desc()).limit(limit)
    rows = list((await db.execute(qry)).scalars().all())
    my_ids = {
        m for (m,) in (await db.execute(
            select(StudyGroupMember.group_id).where(StudyGroupMember.user_id == current_user.id)
        )).all()
    }
    if mine:
        rows = [r for r in rows if r.id in my_ids]
    names = await _names(db, [r.user_id for r in rows])
    out = []
    for r in rows:
        gr = GroupResponse.model_validate(r)
        gr.is_member = r.id in my_ids
        gr.owner_name = names.get(r.user_id)
        out.append(gr)
    return out


async def _get_group(db: AsyncSession, gid: UUID, user: User) -> StudyGroup:
    g = await db.get(StudyGroup, gid)
    if g is None or g.org_id != user.org_id:
        raise HTTPException(status_code=404, detail="group not found")
    return g


@router.get("/study-groups/{group_id}", response_model=GroupResponse)
async def get_group(
    group_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    g = await _get_group(db, group_id, current_user)
    member = (await db.execute(
        select(StudyGroupMember).where(
            StudyGroupMember.group_id == group_id,
            StudyGroupMember.user_id == current_user.id,
        )
    )).scalar_one_or_none()
    r = GroupResponse.model_validate(g)
    r.is_member = member is not None
    r.owner_name = (await _names(db, [g.user_id])).get(g.user_id)
    return r


@router.get("/study-groups/{group_id}/members", response_model=list[MemberResponse])
async def list_members(
    group_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _get_group(db, group_id, current_user)
    rows = list((await db.execute(
        select(StudyGroupMember).where(StudyGroupMember.group_id == group_id)
        .order_by(StudyGroupMember.joined_at)
    )).scalars().all())
    names = await _names(db, [m.user_id for m in rows])
    out = []
    for m in rows:
        mr = MemberResponse.model_validate(m)
        mr.name = names.get(m.user_id)
        out.append(mr)
    return out


@router.post("/study-groups/{group_id}/join", response_model=GroupResponse)
async def join_group(
    group_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _get_group(db, group_id, current_user)
    db.add(StudyGroupMember(group_id=group_id, user_id=current_user.id, role="member"))
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()  # already a member — idempotent
    return await get_group(group_id, db, current_user)


@router.post("/study-groups/{group_id}/leave", response_model=GroupResponse)
async def leave_group(
    group_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    g = await _get_group(db, group_id, current_user)
    if g.user_id == current_user.id:
        raise HTTPException(status_code=409, detail="owner cannot leave; delete the group instead")
    m = (await db.execute(
        select(StudyGroupMember).where(
            StudyGroupMember.group_id == group_id,
            StudyGroupMember.user_id == current_user.id,
        )
    )).scalar_one_or_none()
    if m is not None:
        await db.delete(m)
        await db.commit()
    return await get_group(group_id, db, current_user)


@router.patch("/study-groups/{group_id}", response_model=GroupResponse)
async def update_group(
    group_id: UUID,
    payload: GroupUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    g = await _get_group(db, group_id, current_user)
    if g.user_id != current_user.id and not is_admin(current_user):
        raise HTTPException(status_code=403, detail="only the owner can update")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(g, k, v)
    await db.commit()
    return await get_group(group_id, db, current_user)


@router.delete("/study-groups/{group_id}", status_code=204)
async def delete_group(
    group_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    g = await _get_group(db, group_id, current_user)
    if g.user_id != current_user.id and not is_admin(current_user):
        raise HTTPException(status_code=403, detail="only the owner can delete")
    await db.delete(g)
    await db.commit()

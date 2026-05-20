"""
Phase 18 — Real community + learning-resources REST surface.

Community (discussion forum)
  POST   /community/threads                       create thread (auth)
  GET    /community/threads                       list (filter by tier?, skill?, q?)
  GET    /community/threads/{id}                  detail incl. posts
  PATCH  /community/threads/{id}                  author/admin update
  DELETE /community/threads/{id}                  author/admin
  POST   /community/threads/{id}/posts            reply
  POST   /community/posts/{id}/accept             thread author marks accepted
  POST   /community/threads/{id}/react            upvote / helpful / insightful (idempotent)
  POST   /community/posts/{id}/react              same
  DELETE /community/threads/{id}/react            unvote
  DELETE /community/posts/{id}/react              unvote

Resources (curated catalog)
  POST   /resources                               create
  GET    /resources                               list (filter tier?, skill?, kind?, q?)
  GET    /resources/{id}                          detail
  PATCH  /resources/{id}                          author/admin
  DELETE /resources/{id}                          author/admin
  POST   /resources/{id}/upvote                   one per user
  DELETE /resources/{id}/upvote                   unvote
"""

from __future__ import annotations

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, literal, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.community import (
    CommunityPost,
    CommunityReaction,
    CommunityTargetKind,
    CommunityThread,
    LearningResource,
    LearningResourceVote,
)
from app.models.user import User
from app.schemas.community import (
    PostCreateRequest,
    PostResponse,
    ReactionRequest,
    ReactionResponse,
    ResourceCreateRequest,
    ResourceResponse,
    ResourceUpdateRequest,
    ThreadCreateRequest,
    ThreadDetailResponse,
    ThreadResponse,
    ThreadUpdateRequest,
)
from app.utils.dependencies import get_current_user


router = APIRouter()


def _role(u: User) -> str:
    return u.role.value if hasattr(u.role, "value") else (u.role or "")


def _is_admin(u: User) -> bool:
    return _role(u) in ("org_admin", "super_admin")


# ---------------------------------------------------------------------------
# Community threads
# ---------------------------------------------------------------------------


@router.post("/community/threads", response_model=ThreadResponse, status_code=201)
async def create_thread(
    payload: ThreadCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    t = CommunityThread(
        org_id=current_user.org_id,
        user_id=current_user.id,
        **payload.model_dump(),
    )
    db.add(t)
    await db.commit()
    await db.refresh(t)
    return t


@router.get("/community/threads", response_model=list[ThreadResponse])
async def list_threads(
    tier: Optional[str] = None,
    skill_code: Optional[str] = None,
    q: Optional[str] = Query(None, max_length=120),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    qry = select(CommunityThread).where(CommunityThread.org_id == current_user.org_id)
    if tier:
        qry = qry.where(CommunityThread.tier == tier)
    if skill_code:
        qry = qry.where(CommunityThread.skill_code == skill_code)
    if q:
        pat = f"%{q.lower()}%"
        qry = qry.where(or_(
            CommunityThread.title.ilike(pat),
            CommunityThread.body_md.ilike(pat),
        ))
    qry = qry.order_by(CommunityThread.pinned.desc(), CommunityThread.last_activity_at.desc()).limit(limit)
    return list((await db.execute(qry)).scalars().all())


async def _own_or_admin_thread(db: AsyncSession, tid: UUID, u: User) -> CommunityThread:
    t = await db.get(CommunityThread, tid)
    if t is None:
        raise HTTPException(status_code=404, detail="thread not found")
    if t.user_id != u.id and not _is_admin(u):
        raise HTTPException(status_code=403, detail="not yours")
    return t


@router.get("/community/threads/{thread_id}", response_model=ThreadDetailResponse)
async def get_thread(
    thread_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    t = await db.get(CommunityThread, thread_id)
    if t is None:
        raise HTTPException(status_code=404, detail="thread not found")
    if t.org_id != current_user.org_id:
        raise HTTPException(status_code=403, detail="not in your org")
    posts = (await db.execute(
        select(CommunityPost).where(CommunityPost.thread_id == thread_id).order_by(CommunityPost.created_at)
    )).scalars().all()
    return ThreadDetailResponse(
        thread=ThreadResponse.model_validate(t),
        posts=[PostResponse.model_validate(p) for p in posts],
    )


@router.patch("/community/threads/{thread_id}", response_model=ThreadResponse)
async def update_thread(
    thread_id: UUID,
    payload: ThreadUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    t = await _own_or_admin_thread(db, thread_id, current_user)
    body = payload.model_dump(exclude_unset=True)
    # pinned / locked require admin
    if "pinned" in body or "locked" in body:
        if not _is_admin(current_user):
            raise HTTPException(status_code=403, detail="admin only for pinned/locked")
    for k, v in body.items():
        setattr(t, k, v)
    await db.commit()
    await db.refresh(t)
    return t


@router.delete("/community/threads/{thread_id}", status_code=204)
async def delete_thread(
    thread_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    t = await _own_or_admin_thread(db, thread_id, current_user)
    await db.delete(t)
    await db.commit()


# ---------------------------------------------------------------------------
# Community posts
# ---------------------------------------------------------------------------


@router.post(
    "/community/threads/{thread_id}/posts",
    response_model=PostResponse,
    status_code=201,
)
async def create_post(
    thread_id: UUID,
    payload: PostCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    t = await db.get(CommunityThread, thread_id)
    if t is None:
        raise HTTPException(status_code=404, detail="thread not found")
    if t.org_id != current_user.org_id:
        raise HTTPException(status_code=403, detail="not in your org")
    if t.locked:
        raise HTTPException(status_code=409, detail="thread is locked")
    p = CommunityPost(
        thread_id=thread_id,
        user_id=current_user.id,
        parent_post_id=payload.parent_post_id,
        body_md=payload.body_md,
    )
    db.add(p)
    await db.commit()
    await db.refresh(p)
    return p


@router.post("/community/posts/{post_id}/accept", response_model=PostResponse)
async def accept_post(
    post_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    p = await db.get(CommunityPost, post_id)
    if p is None:
        raise HTTPException(status_code=404, detail="post not found")
    t = await db.get(CommunityThread, p.thread_id)
    if t is None or (t.user_id != current_user.id and not _is_admin(current_user)):
        raise HTTPException(status_code=403, detail="only thread author can accept")
    p.is_accepted_answer = True
    await db.commit()
    await db.refresh(p)
    return p


# ---------------------------------------------------------------------------
# Reactions
# ---------------------------------------------------------------------------


async def _react(
    db: AsyncSession, *, user_id: UUID, target_kind: str, target_id: UUID, kind: str
) -> tuple[str, UUID, str, int]:
    """Idempotent — same (user, target, kind) → returns existing."""
    r = CommunityReaction(
        user_id=user_id, target_kind=target_kind, target_id=target_id, kind=kind
    )
    db.add(r)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
    # Re-read upvote_count for the target
    if target_kind == "thread":
        t = await db.get(CommunityThread, target_id)
        count = t.upvote_count if t else 0
    else:
        p = await db.get(CommunityPost, target_id)
        count = p.upvote_count if p else 0
    return target_kind, target_id, kind, count


@router.post("/community/threads/{thread_id}/react", response_model=ReactionResponse)
async def react_thread(
    thread_id: UUID,
    payload: ReactionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tk, tid, kind, count = await _react(
        db, user_id=current_user.id, target_kind="thread", target_id=thread_id, kind=payload.kind
    )
    return ReactionResponse(target_kind=tk, target_id=tid, kind=kind, upvote_count=count)


@router.post("/community/posts/{post_id}/react", response_model=ReactionResponse)
async def react_post(
    post_id: UUID,
    payload: ReactionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tk, tid, kind, count = await _react(
        db, user_id=current_user.id, target_kind="post", target_id=post_id, kind=payload.kind
    )
    return ReactionResponse(target_kind=tk, target_id=tid, kind=kind, upvote_count=count)


@router.delete("/community/threads/{thread_id}/react", status_code=204)
async def unreact_thread(
    thread_id: UUID,
    kind: str = Query("upvote"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    r = (await db.execute(
        select(CommunityReaction).where(
            CommunityReaction.user_id == current_user.id,
            CommunityReaction.target_kind == "thread",
            CommunityReaction.target_id == thread_id,
            CommunityReaction.kind == kind,
        )
    )).scalar_one_or_none()
    if r is not None:
        await db.delete(r)
        await db.commit()


@router.delete("/community/posts/{post_id}/react", status_code=204)
async def unreact_post(
    post_id: UUID,
    kind: str = Query("upvote"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    r = (await db.execute(
        select(CommunityReaction).where(
            CommunityReaction.user_id == current_user.id,
            CommunityReaction.target_kind == "post",
            CommunityReaction.target_id == post_id,
            CommunityReaction.kind == kind,
        )
    )).scalar_one_or_none()
    if r is not None:
        await db.delete(r)
        await db.commit()


# ---------------------------------------------------------------------------
# Learning resources catalog
# ---------------------------------------------------------------------------


@router.post("/resources", response_model=ResourceResponse, status_code=201)
async def create_resource(
    payload: ResourceCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    r = LearningResource(
        org_id=current_user.org_id,
        created_by=current_user.id,
        **payload.model_dump(),
    )
    db.add(r)
    await db.commit()
    await db.refresh(r)
    return r


@router.get("/resources", response_model=list[ResourceResponse])
async def list_resources(
    tier: Optional[str] = None,
    skill_code: Optional[str] = None,
    kind: Optional[str] = None,
    q: Optional[str] = Query(None, max_length=120),
    tag: Optional[str] = Query(None, max_length=60),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    qry = select(LearningResource).where(
        or_(
            LearningResource.org_id == current_user.org_id,
            LearningResource.is_public.is_(True),
        )
    )
    if tier:
        qry = qry.where(LearningResource.tier == tier)
    if skill_code:
        qry = qry.where(LearningResource.skill_code == skill_code)
    if kind:
        qry = qry.where(LearningResource.kind == kind)
    if q:
        # q searches title + description + tags membership (Postgres ANY()
        # on the TEXT[] column) so a query like q=xr surfaces resources
        # whose title doesn't contain "xr" but that are tagged xr/vr/ar/etc.
        pat = f"%{q.lower()}%"
        qry = qry.where(or_(
            LearningResource.title.ilike(pat),
            LearningResource.description_md.ilike(pat),
            literal(q.lower()) == func.any(LearningResource.tags),
        ))
    if tag:
        # Exact-tag filter on the tags[] array.
        qry = qry.where(literal(tag.lower()) == func.any(LearningResource.tags))
    qry = qry.order_by(
        LearningResource.sme_endorsed.desc(),
        LearningResource.upvote_count.desc(),
        LearningResource.created_at.desc(),
    ).limit(limit)
    return list((await db.execute(qry)).scalars().all())


@router.get("/resources/{resource_id}", response_model=ResourceResponse)
async def get_resource(
    resource_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    r = await db.get(LearningResource, resource_id)
    if r is None:
        raise HTTPException(status_code=404, detail="resource not found")
    if not r.is_public and r.org_id != current_user.org_id:
        raise HTTPException(status_code=403, detail="not in your org")
    return r


@router.patch("/resources/{resource_id}", response_model=ResourceResponse)
async def update_resource(
    resource_id: UUID,
    payload: ResourceUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    r = await db.get(LearningResource, resource_id)
    if r is None:
        raise HTTPException(status_code=404, detail="resource not found")
    if r.created_by != current_user.id and not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="not yours")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(r, k, v)
    await db.commit()
    await db.refresh(r)
    return r


@router.delete("/resources/{resource_id}", status_code=204)
async def delete_resource(
    resource_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    r = await db.get(LearningResource, resource_id)
    if r is None:
        raise HTTPException(status_code=404, detail="resource not found")
    if r.created_by != current_user.id and not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="not yours")
    await db.delete(r)
    await db.commit()


@router.post("/resources/{resource_id}/upvote", response_model=ResourceResponse)
async def upvote_resource(
    resource_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    v = LearningResourceVote(resource_id=resource_id, user_id=current_user.id)
    db.add(v)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
    r = await db.get(LearningResource, resource_id)
    if r is None:
        raise HTTPException(status_code=404, detail="resource not found")
    await db.refresh(r)
    return r


@router.delete("/resources/{resource_id}/upvote", response_model=ResourceResponse)
async def unupvote_resource(
    resource_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    v = (await db.execute(
        select(LearningResourceVote).where(
            LearningResourceVote.resource_id == resource_id,
            LearningResourceVote.user_id == current_user.id,
        )
    )).scalar_one_or_none()
    if v is not None:
        await db.delete(v)
        await db.commit()
    r = await db.get(LearningResource, resource_id)
    if r is None:
        raise HTTPException(status_code=404, detail="resource not found")
    await db.refresh(r)
    return r

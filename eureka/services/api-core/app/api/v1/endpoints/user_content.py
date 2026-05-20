"""
Phase 17 — Activity feed + user collections + dashboard rollup REST surface.

Backs the lightweight sidebar surfaces that previously rendered hardcoded
data (notebook, resources, community feed, dashboard home).

Activity
  POST   /me/activity                          record an event (rare; most
                                               services use the helper)
  GET    /me/activity                          my activity (paged)
  GET    /community/feed                       org-wide public activity feed

Collections (notebook / reading-list / bookmarks / community saved)
  POST   /me/collections                       create
  GET    /me/collections                       list (filterable by kind)
  GET    /me/collections/{id}                  detail (incl. items)
  PATCH  /me/collections/{id}                  update
  DELETE /me/collections/{id}                  delete
  POST   /me/collections/{id}/items            add item
  PATCH  /me/collections/{id}/items/{item_id}  update item
  DELETE /me/collections/{id}/items/{item_id}  delete item

Dashboard
  GET    /me/dashboard                         rollup for /dashboard home
                                               (counts + next milestone +
                                               recent activity)
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.engagement import UserAchievement
from app.models.graduate import DegreeMilestone, GraduateEnrollment, MilestoneStatus
from app.models.learner import TierEnrollment
from app.models.user import User
from app.models.user_content import CollectionItem, UserCollection
from app.schemas.user_content import (
    ActivityCreateRequest,
    ActivityEventResponse,
    CollectionCreateRequest,
    CollectionResponse,
    CollectionUpdateRequest,
    DashboardSummary,
    ItemCreateRequest,
    ItemResponse,
    ItemUpdateRequest,
)
from app.services import user_content as uc_svc
from app.utils.dependencies import get_current_user


router = APIRouter()


# ---------------------------------------------------------------------------
# Activity feed
# ---------------------------------------------------------------------------


@router.post("/me/activity", response_model=ActivityEventResponse, status_code=201)
async def record_activity(
    payload: ActivityCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ev = await uc_svc.record_activity(
        db,
        user_id=current_user.id,
        org_id=current_user.org_id,
        kind=payload.kind,
        summary=payload.summary,
        ref_table=payload.ref_table,
        ref_id=payload.ref_id,
        payload=payload.payload,
        is_public=payload.is_public,
    )
    await db.commit()
    await db.refresh(ev)
    return ev


@router.get("/me/activity", response_model=list[ActivityEventResponse])
async def list_my_activity(
    limit: int = Query(50, ge=1, le=200),
    days: int = Query(30, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    since = datetime.now(timezone.utc) - timedelta(days=days)
    rows = await uc_svc.my_activity(db, user_id=current_user.id, limit=limit, since=since)
    return rows


@router.get("/community/feed", response_model=list[ActivityEventResponse])
async def org_public_feed(
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Org-wide public activity feed for /community."""
    return await uc_svc.org_public_activity(db, org_id=current_user.org_id, limit=limit)


# ---------------------------------------------------------------------------
# Collections
# ---------------------------------------------------------------------------


async def _own_collection_or_404(
    db: AsyncSession, collection_id: UUID, user: User
) -> UserCollection:
    c = await db.get(UserCollection, collection_id)
    if c is None:
        raise HTTPException(status_code=404, detail="collection not found")
    if c.user_id != user.id and not c.is_public:
        raise HTTPException(status_code=403, detail="not yours")
    return c


@router.post("/me/collections", response_model=CollectionResponse, status_code=201)
async def create_collection(
    payload: CollectionCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    c = UserCollection(user_id=current_user.id, **payload.model_dump())
    db.add(c)
    await db.flush()
    await uc_svc.record_activity(
        db,
        user_id=current_user.id,
        org_id=current_user.org_id,
        kind="collection_created",
        summary=f"Created {payload.kind}: {payload.title}",
        ref_table="user_collections",
        ref_id=c.id,
    )
    await db.commit()
    await db.refresh(c)
    return c


@router.get("/me/collections", response_model=list[CollectionResponse])
async def list_my_collections(
    kind: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await uc_svc.my_collections(db, user_id=current_user.id, kind=kind)


@router.get("/me/collections/{collection_id}")
async def get_collection(
    collection_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    c = await _own_collection_or_404(db, collection_id, current_user)
    items = await uc_svc.items_in(db, collection_id=collection_id)
    return {
        "collection": CollectionResponse.model_validate(c),
        "items": [ItemResponse.model_validate(i) for i in items],
    }


@router.patch("/me/collections/{collection_id}", response_model=CollectionResponse)
async def update_collection(
    collection_id: UUID,
    payload: CollectionUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    c = await _own_collection_or_404(db, collection_id, current_user)
    if c.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="not yours")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(c, k, v)
    await db.commit()
    await db.refresh(c)
    return c


@router.delete("/me/collections/{collection_id}", status_code=204)
async def delete_collection(
    collection_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    c = await _own_collection_or_404(db, collection_id, current_user)
    if c.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="not yours")
    await db.delete(c)
    await db.commit()


# ---------- items inside a collection ----------


@router.post(
    "/me/collections/{collection_id}/items",
    response_model=ItemResponse,
    status_code=201,
)
async def add_item(
    collection_id: UUID,
    payload: ItemCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    c = await _own_collection_or_404(db, collection_id, current_user)
    if c.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="not yours")
    it = CollectionItem(collection_id=collection_id, **payload.model_dump())
    db.add(it)
    await db.flush()
    await uc_svc.record_activity(
        db,
        user_id=current_user.id,
        org_id=current_user.org_id,
        kind="collection_item_added",
        summary=(payload.title or payload.kind)[:280],
        ref_table="collection_items",
        ref_id=it.id,
        payload={"collection_id": str(collection_id)},
    )
    await db.commit()
    await db.refresh(it)
    return it


@router.patch(
    "/me/collections/{collection_id}/items/{item_id}", response_model=ItemResponse
)
async def update_item(
    collection_id: UUID,
    item_id: UUID,
    payload: ItemUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    c = await _own_collection_or_404(db, collection_id, current_user)
    if c.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="not yours")
    it = await db.get(CollectionItem, item_id)
    if it is None or it.collection_id != collection_id:
        raise HTTPException(status_code=404, detail="item not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(it, k, v)
    await db.commit()
    await db.refresh(it)
    return it


@router.delete(
    "/me/collections/{collection_id}/items/{item_id}", status_code=204
)
async def delete_item(
    collection_id: UUID,
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    c = await _own_collection_or_404(db, collection_id, current_user)
    if c.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="not yours")
    it = await db.get(CollectionItem, item_id)
    if it is None or it.collection_id != collection_id:
        raise HTTPException(status_code=404, detail="item not found")
    await db.delete(it)
    await db.commit()


# ---------------------------------------------------------------------------
# Dashboard rollup
# ---------------------------------------------------------------------------


@router.get("/me/dashboard", response_model=DashboardSummary)
async def my_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Single-call rollup that backs /dashboard home — no more mock data."""
    since = datetime.now(timezone.utc) - timedelta(days=7)
    recent = await uc_svc.my_activity(db, user_id=current_user.id, limit=10, since=since)
    counts = {
        "activity_count_7d": await uc_svc.activity_count(db, user_id=current_user.id, since=since),
        "collection_count": await uc_svc.collection_count(db, user_id=current_user.id),
    }
    achievement_count = int((await db.execute(
        select(func.count(UserAchievement.id)).where(UserAchievement.user_id == current_user.id)
    )).scalar_one() or 0)
    enrollment_count = int((await db.execute(
        select(func.count(TierEnrollment.id)).where(TierEnrollment.user_id == current_user.id)
    )).scalar_one() or 0)

    # Next due graduate milestone, if any.
    nxt = (await db.execute(
        select(DegreeMilestone)
        .join(GraduateEnrollment, GraduateEnrollment.id == DegreeMilestone.enrollment_id)
        .where(
            GraduateEnrollment.user_id == current_user.id,
            DegreeMilestone.status.in_((
                MilestoneStatus.not_started.value,
                MilestoneStatus.in_progress.value,
                MilestoneStatus.changes_requested.value,
            )),
        )
        .order_by(DegreeMilestone.due_at)
        .limit(1)
    )).scalar_one_or_none()

    return DashboardSummary(
        user_id=current_user.id,
        org_id=current_user.org_id,
        activity_count_7d=counts["activity_count_7d"],
        achievement_count=achievement_count,
        collection_count=counts["collection_count"],
        enrollment_count=enrollment_count,
        next_due_milestone_title=nxt.title if nxt else None,
        next_due_milestone_at=(
            datetime.combine(nxt.due_at, datetime.min.time()) if nxt and nxt.due_at else None
        ),
        recent_activity=[ActivityEventResponse.model_validate(r) for r in recent],
    )

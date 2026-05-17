"""
Phase 12.4 — Offline sync.

`build_item_pack(user, max_items=20)` packages up the learner's most-relevant
items (currently due for spaced repetition + skill-gap items) into a
self-contained JSON bundle the mobile client can stash locally. ETag is the
sha256 of the canonical payload, so the client can `If-None-Match` next time.
"""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.engagement import OfflineBundle, OfflineSyncReceipt
from app.models.item_bank import Item
from app.models.skill import ContentSkill, LearnerSkillMastery


def _utc() -> datetime:
    return datetime.now(timezone.utc)


async def _candidate_item_ids(
    db: AsyncSession, *, user_id: UUID, max_items: int
) -> list[UUID]:
    # Pull items tagged to the user's lowest-mastery skills first.
    masteries_q = await db.execute(
        select(LearnerSkillMastery.skill_id, LearnerSkillMastery.mastery)
        .where(LearnerSkillMastery.user_id == user_id)
        .order_by(LearnerSkillMastery.mastery.asc().nullsfirst())
        .limit(20)
    )
    weak_skill_ids = [sid for sid, _ in masteries_q.all()]

    if weak_skill_ids:
        q = await db.execute(
            select(Item.id)
            .join(ContentSkill, ContentSkill.content_id == Item.id)
            .where(ContentSkill.skill_id.in_(weak_skill_ids))
            .limit(max_items * 2)
        )
        ids: list[UUID] = []
        seen: set[UUID] = set()
        for (iid,) in q.all():
            if iid in seen:
                continue
            seen.add(iid)
            ids.append(iid)
            if len(ids) >= max_items:
                break
        if ids:
            return ids

    # Fallback: most recent items globally.
    q = await db.execute(select(Item.id).order_by(Item.created_at.desc()).limit(max_items))
    return [row[0] for row in q.all()]


def _serialise_item(it: Item) -> dict:
    """Reduce an Item ORM row to the offline-friendly subset."""
    return {
        "id": str(it.id),
        "content": it.content,
        "skill_codes": [],   # filled in below
        "irt_difficulty": float(it.irt_difficulty) if getattr(it, "irt_difficulty", None) is not None else None,
        "irt_discrimination": float(it.irt_discrimination) if getattr(it, "irt_discrimination", None) is not None else None,
    }


async def build_item_pack(
    db: AsyncSession, *, user_id: UUID, max_items: int = 20,
    ttl_hours: int = 48,
) -> OfflineBundle:
    ids = await _candidate_item_ids(db, user_id=user_id, max_items=max_items)
    if not ids:
        payload = {"items": [], "skills": []}
    else:
        items_q = await db.execute(select(Item).where(Item.id.in_(ids)))
        items = list(items_q.scalars().all())
        items_dict = {it.id: _serialise_item(it) for it in items}
        skills_q = await db.execute(
            select(ContentSkill.content_id, ContentSkill.skill_id)
            .where(ContentSkill.content_id.in_(ids))
        )
        for content_id, sid in skills_q.all():
            items_dict[content_id]["skill_codes"].append(str(sid))
        payload = {
            "items": [items_dict[i] for i in ids if i in items_dict],
            "skills": [],   # caller can layer skill metadata onto items via id
        }
    canonical = json.dumps(payload, sort_keys=True, default=str)
    etag = hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:64]

    # Reuse an existing bundle if the etag matches.
    existing_q = await db.execute(
        select(OfflineBundle).where(
            OfflineBundle.user_id == user_id,
            OfflineBundle.kind == "item_pack",
            OfflineBundle.etag == etag,
            (OfflineBundle.expires_at.is_(None)) | (OfflineBundle.expires_at > _utc()),
        ).order_by(OfflineBundle.generated_at.desc()).limit(1)
    )
    cached = existing_q.scalar_one_or_none()
    if cached is not None:
        return cached

    bundle = OfflineBundle(
        user_id=user_id, kind="item_pack", etag=etag,
        payload_jsonb=payload, size_bytes=len(canonical),
        item_count=len(payload["items"]),
        expires_at=_utc() + timedelta(hours=ttl_hours),
    )
    db.add(bundle)
    await db.commit()
    await db.refresh(bundle)
    return bundle


async def record_replay(
    db: AsyncSession,
    *,
    user_id: UUID,
    bundle_id: Optional[UUID],
    device_id: Optional[UUID],
    attempts: list[dict],
) -> OfflineSyncReceipt:
    """Receive a batch of offline attempts the device replayed back."""
    receipt = OfflineSyncReceipt(
        user_id=user_id, bundle_id=bundle_id, device_id=device_id,
        attempts_replayed_jsonb=attempts,
        received_attempts=len(attempts),
    )
    db.add(receipt)
    await db.commit()
    await db.refresh(receipt)
    return receipt

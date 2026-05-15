"""
Item-bank endpoints (Phase 5 Sessions 5.1 + 5.2 + 5.7).

Mounted under /api/v1.

Banks
  POST   /item-banks                                  create a bank
  GET    /item-banks                                  list (filter: framework, tier)
  GET    /item-banks/{slug}                           get by slug

Items
  POST   /items                                       create item (also tags + source + embedding)
  GET    /items/{id}                                  read
  GET    /item-banks/{bank_slug}/items                paginated list

Variants
  POST   /items/{id}/variants                         AI-generate N variants
  GET    /items/{id}/variants                         list variants for an item

Search
  GET    /items/search?q=...                          hybrid keyword + semantic + tag-boost
"""

from __future__ import annotations

from datetime import datetime
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.item_bank import (
    Item,
    ItemBank,
    ItemSource,
    ItemSourceKind,
    ItemVariant,
    ItemReviewStatus,
)
from app.models.skill import ContentKind, ContentSkill, Skill, SkillFramework
from app.models.user import User
from app.schemas.item_bank import (
    BankCreate,
    BankResponse,
    ItemCreate,
    ItemResponse,
    SearchHit,
    VariantGenerateRequest,
    VariantResponse,
)
from app.services.item_search import (
    DEFAULT_EMBED_MODEL,
    hybrid_search,
    upsert_item_embedding,
)
from app.services.variant_generator import (
    cross_grade,
    generate_variants,
)
from app.utils.dependencies import get_current_user


router = APIRouter()


def _index_text(item: Item) -> str:
    """The text projection used for keyword + embedding indexing."""
    parts = [
        item.content.get("stem") or item.content.get("vignette") or "",
        " ".join(item.content.get("options", []) or []),
        item.explanation or "",
    ]
    return " ".join(p for p in parts if p)


# ---------------------------------------------------------------------------
# Banks
# ---------------------------------------------------------------------------


@router.post("/item-banks", response_model=BankResponse, status_code=201)
async def create_bank(
    payload: BankCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ItemBank:
    b = ItemBank(
        slug=payload.slug,
        name=payload.name,
        description=payload.description,
        framework=payload.framework,
        tier=payload.tier,
        default_license=payload.default_license,
        default_attribution=payload.default_attribution,
    )
    db.add(b)
    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        if "item_banks_slug_key" in str(exc) or "duplicate key" in str(exc):
            raise HTTPException(status_code=409, detail="slug already in use") from exc
        raise
    await db.refresh(b)
    return b


@router.get("/item-banks", response_model=list[BankResponse])
async def list_banks(
    framework: SkillFramework | None = None,
    tier: str | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[ItemBank]:
    stmt = select(ItemBank).where(ItemBank.is_active.is_(True))
    if framework:
        stmt = stmt.where(ItemBank.framework == framework)
    if tier:
        stmt = stmt.where(ItemBank.tier == tier)
    r = await db.execute(stmt.order_by(ItemBank.slug))
    return list(r.scalars().all())


@router.get("/item-banks/{slug}", response_model=BankResponse)
async def get_bank(
    slug: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ItemBank:
    r = await db.execute(select(ItemBank).where(ItemBank.slug == slug))
    b = r.scalar_one_or_none()
    if b is None:
        raise HTTPException(status_code=404, detail="bank not found")
    return b


@router.get("/item-banks/{slug}/items", response_model=list[ItemResponse])
async def list_bank_items(
    slug: str,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[Item]:
    bank_q = await db.execute(select(ItemBank).where(ItemBank.slug == slug))
    bank = bank_q.scalar_one_or_none()
    if bank is None:
        raise HTTPException(status_code=404, detail="bank not found")
    r = await db.execute(
        select(Item)
        .where(Item.bank_id == bank.id, Item.deleted_at.is_(None))
        .order_by(Item.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return list(r.scalars().all())


# ---------------------------------------------------------------------------
# Items
# ---------------------------------------------------------------------------


@router.post("/items", response_model=ItemResponse, status_code=201)
async def create_item(
    payload: ItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Item:
    bank = await db.get(ItemBank, payload.bank_id)
    if bank is None:
        raise HTTPException(status_code=404, detail="bank not found")

    family_id = uuid4()  # base item — own family
    item = Item(
        bank_id=payload.bank_id,
        family_id=family_id,
        kind=payload.kind,
        content=payload.content,
        explanation=payload.explanation,
        difficulty_nominal=payload.difficulty_nominal,
        bloom_level=payload.bloom_level,
        estimated_time_sec=payload.estimated_time_sec,
        tags=payload.tags,
        review_status=payload.review_status,
        created_by=current_user.id,
    )
    db.add(item)
    await db.flush()  # need item.id below

    # Source row
    src = payload.source
    if src is None:
        src_kind = ItemSourceKind.COMMUNITY
        license_ = bank.default_license
    else:
        src_kind = src.source_kind
        license_ = src.license or bank.default_license
    db.add(
        ItemSource(
            item_id=item.id,
            source_kind=src_kind,
            source_uri=src.source_uri if src else None,
            source_name=src.source_name if src else None,
            license=license_,
            attribution=src.attribution if src else bank.default_attribution,
        )
    )

    # Tag into skills via the content_skills M2M from Phase 4.2
    for sid in payload.skill_ids:
        db.add(
            ContentSkill(
                skill_id=sid,
                content_kind=ContentKind.QUESTION,
                content_id=item.id,
                tagged_by="api",
            )
        )

    await db.commit()
    await db.refresh(item)

    # Index for search (best-effort; failures don't block creation).
    try:
        await upsert_item_embedding(db, item.id, _index_text(item))
        await db.commit()
    except Exception:
        await db.rollback()

    return item


@router.get("/items/{item_id}", response_model=ItemResponse)
async def get_item(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Item:
    item = await db.get(Item, item_id)
    if item is None or item.deleted_at is not None:
        raise HTTPException(status_code=404, detail="item not found")
    return item


# ---------------------------------------------------------------------------
# Variants (5.2)
# ---------------------------------------------------------------------------


@router.post(
    "/items/{item_id}/variants",
    response_model=list[VariantResponse],
    status_code=201,
)
async def generate_item_variants(
    item_id: UUID,
    payload: VariantGenerateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ItemVariant]:
    base = await db.get(Item, item_id)
    if base is None or base.deleted_at is not None:
        raise HTTPException(status_code=404, detail="base item not found")

    drafts = generate_variants(
        base_content=base.content,
        base_explanation=base.explanation,
        count=payload.count,
        target_difficulty=payload.target_difficulty,
    )
    if not drafts:
        raise HTTPException(status_code=500, detail="variant generation produced no candidates")

    method = "claude" if __import__("os").environ.get("ANTHROPIC_API_KEY", "").strip() else "stub"
    out_variants: list[ItemVariant] = []

    for draft in drafts:
        variant_item = Item(
            bank_id=base.bank_id,
            family_id=base.family_id,
            kind=base.kind,
            content=draft.to_content(),
            explanation=draft.explanation,
            difficulty_nominal=payload.target_difficulty or base.difficulty_nominal,
            bloom_level=base.bloom_level,
            estimated_time_sec=base.estimated_time_sec,
            tags=base.tags,
            review_status=(
                ItemReviewStatus.DRAFT
                if payload.sme_review_required
                else ItemReviewStatus.APPROVED
            ),
            created_by=current_user.id,
        )
        db.add(variant_item)
        await db.flush()

        # Inherit skill tags from the base
        base_tags_q = await db.execute(
            select(ContentSkill).where(
                ContentSkill.content_kind == ContentKind.QUESTION,
                ContentSkill.content_id == base.id,
            )
        )
        for tag in base_tags_q.scalars().all():
            db.add(
                ContentSkill(
                    skill_id=tag.skill_id,
                    content_kind=ContentKind.QUESTION,
                    content_id=variant_item.id,
                    coverage=tag.coverage,
                    bloom_level=tag.bloom_level,
                    tagged_by="ai_variant",
                )
            )

        # Source row marking AI lineage
        db.add(
            ItemSource(
                item_id=variant_item.id,
                source_kind=ItemSourceKind.AI_GENERATED,
                source_name="Claude variant generator",
                license="EUREKA-Internal",
                attribution=f"AI-generated variant of item {base.id}",
                extra_metadata={"base_item_id": str(base.id), "method": method},
            )
        )

        # Variant linkage
        variant_row = ItemVariant(
            family_id=base.family_id,
            item_id=variant_item.id,
            base_item_id=base.id,
            generation_method=method,
            generation_metadata={
                "target_difficulty": payload.target_difficulty,
                "ran_crossgrader": payload.run_crossgrader,
            },
        )

        if payload.run_crossgrader:
            cg = cross_grade(
                base_content=base.content,
                base_explanation=base.explanation,
                variant_content=draft.to_content(),
                variant_explanation=draft.explanation,
            )
            variant_row.crossgrader_agrees = cg.agrees
            variant_row.crossgrader_score = cg.score
            variant_row.crossgrader_notes = cg.notes
            variant_row.crossgrader_at = datetime.utcnow()
            if not cg.agrees:
                variant_item.review_status = ItemReviewStatus.FLAGGED

        db.add(variant_row)
        out_variants.append(variant_row)

        # Best-effort embedding
        try:
            await upsert_item_embedding(db, variant_item.id, _index_text(variant_item))
        except Exception:
            pass

    await db.commit()
    for v in out_variants:
        await db.refresh(v)
    return out_variants


@router.get("/items/{item_id}/variants", response_model=list[VariantResponse])
async def list_variants(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[ItemVariant]:
    base = await db.get(Item, item_id)
    if base is None:
        raise HTTPException(status_code=404, detail="item not found")
    r = await db.execute(
        select(ItemVariant).where(ItemVariant.family_id == base.family_id)
    )
    return list(r.scalars().all())


# ---------------------------------------------------------------------------
# Search (5.7)
# ---------------------------------------------------------------------------


@router.get("/item-search", response_model=list[SearchHit])
async def search_items(
    q: str = Query(..., min_length=2, max_length=300),
    bank_slug: str | None = None,
    framework: SkillFramework | None = None,
    skill_id: UUID | None = None,
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[dict]:
    bank_id: UUID | None = None
    if bank_slug:
        bank_q = await db.execute(select(ItemBank).where(ItemBank.slug == bank_slug))
        bank = bank_q.scalar_one_or_none()
        if bank is None:
            raise HTTPException(status_code=404, detail="bank not found")
        bank_id = bank.id

    hits = await hybrid_search(
        db,
        query=q,
        limit=limit,
        bank_id=bank_id,
        framework_filter=framework.value if framework else None,
        skill_id=skill_id,
        embed_model=DEFAULT_EMBED_MODEL,
    )

    if not hits:
        return []

    # Hydrate items in one query
    hit_ids = [h.item_id for h in hits]
    items_q = await db.execute(select(Item).where(Item.id.in_(hit_ids)))
    items_by_id = {it.id: it for it in items_q.scalars().all()}

    out = []
    for h in hits:
        it = items_by_id.get(h.item_id)
        if it is None:
            continue
        out.append(
            {
                "item": ItemResponse.model_validate(it).model_dump(mode="json"),
                "score": round(h.score, 5),
                "keyword_rank": h.keyword_rank,
                "semantic_rank": h.semantic_rank,
                "skill_boost": h.skill_boost,
            }
        )
    return out

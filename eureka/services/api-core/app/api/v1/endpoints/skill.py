"""
Skill-graph endpoints (Phase 4 Session 4.2).

Mounted under /api/v1.

Catalog
  GET    /skills                      list/search/filter (framework, tier, name)
  GET    /skills/{id}                 single skill
  GET    /skills/{id}/relations       single + parent / children / prereqs / used-by
  GET    /skills/{id}/prereq-tree     recursive transitive prerequisites (DAG)
  GET    /skills/by-code/{fw}/{code}  natural-key lookup

Content tagging
  POST   /content-skills              tag a content artifact with a skill
  GET    /content-skills              filter by content_kind+id or skill_id

Mastery (learner-self)
  GET    /skills/me/mastery           list current user's per-skill mastery
  POST   /skills/me/mastery           write a mastery update (used by tutor/assess)

Auth: all endpoints require a token. Cross-tenant: a learner sees only
their own mastery. Catalog is global — skills aren't scoped to an org.
"""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, or_, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.learner import LearnerProfile
from app.models.skill import (
    ContentKind,
    ContentSkill,
    LearnerSkillMastery,
    Skill,
    SkillFramework,
    SkillPrerequisite,
)
from app.models.user import User
from app.schemas.skill import (
    ContentTagRequest,
    ContentTagResponse,
    MasteryResponse,
    MasteryWriteRequest,
    PrereqEdge,
    SkillResponse,
    SkillWithRelations,
)
from app.utils.dependencies import get_current_user


router = APIRouter()


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------


async def _get_skill_or_404(db: AsyncSession, skill_id: UUID) -> Skill:
    skill = await db.get(Skill, skill_id)
    if skill is None or not skill.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    return skill


# ---------------------------------------------------------------------------
# Catalog
# ---------------------------------------------------------------------------


@router.get("/skills", response_model=list[SkillResponse])
async def list_skills(
    framework: SkillFramework | None = None,
    tier: str | None = None,
    q: str | None = Query(default=None, min_length=2, max_length=200),
    parent_id: UUID | None = None,
    only_roots: bool = False,
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[Skill]:
    stmt = select(Skill).where(Skill.is_active.is_(True))
    if framework is not None:
        stmt = stmt.where(Skill.framework == framework)
    if tier is not None:
        stmt = stmt.where(Skill.tier == tier)
    if parent_id is not None:
        stmt = stmt.where(Skill.parent_id == parent_id)
    if only_roots:
        stmt = stmt.where(Skill.parent_id.is_(None))
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(Skill.name.ilike(like), Skill.code.ilike(like)))
    stmt = stmt.order_by(Skill.framework, Skill.code).limit(limit).offset(offset)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get("/skills/by-code/{framework}/{code:path}", response_model=SkillResponse)
async def get_skill_by_code(
    framework: SkillFramework,
    code: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Skill:
    result = await db.execute(
        select(Skill).where(
            and_(
                Skill.framework == framework,
                Skill.code == code,
                Skill.is_active.is_(True),
            )
        )
    )
    skill = result.scalar_one_or_none()
    if skill is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    return skill


@router.get("/skills/{skill_id}", response_model=SkillResponse)
async def get_skill(
    skill_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Skill:
    return await _get_skill_or_404(db, skill_id)


@router.get("/skills/{skill_id}/relations", response_model=SkillWithRelations)
async def get_skill_with_relations(
    skill_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    skill = await _get_skill_or_404(db, skill_id)

    children_q = await db.execute(
        select(Skill).where(Skill.parent_id == skill.id, Skill.is_active.is_(True)).order_by(Skill.code)
    )
    children = list(children_q.scalars().all())

    prereq_q = await db.execute(
        select(SkillPrerequisite, Skill)
        .join(Skill, Skill.id == SkillPrerequisite.prerequisite_id)
        .where(SkillPrerequisite.successor_id == skill.id)
    )
    prerequisites = [
        PrereqEdge.model_validate(
            {"skill": SkillResponse.model_validate(pre), "strength": edge.strength, "rationale": edge.rationale}
        )
        for edge, pre in prereq_q.all()
    ]

    used_by_q = await db.execute(
        select(SkillPrerequisite, Skill)
        .join(Skill, Skill.id == SkillPrerequisite.successor_id)
        .where(SkillPrerequisite.prerequisite_id == skill.id)
    )
    used_by = [
        PrereqEdge.model_validate(
            {"skill": SkillResponse.model_validate(succ), "strength": edge.strength, "rationale": edge.rationale}
        )
        for edge, succ in used_by_q.all()
    ]

    base = SkillResponse.model_validate(skill).model_dump()
    return SkillWithRelations(
        **base,
        children=[SkillResponse.model_validate(c) for c in children],
        prerequisites=prerequisites,
        used_by=used_by,
    )


@router.get(
    "/skills/{skill_id}/prereq-tree",
    response_model=list[SkillResponse],
    summary="Recursive transitive prerequisites (DAG flattened, no cycles).",
)
async def get_prereq_tree(
    skill_id: UUID,
    max_depth: int = Query(default=5, ge=1, le=10),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[Skill]:
    """
    Recursive walk over skill_prerequisites starting from skill_id,
    returning every transitive prerequisite up to max_depth hops.

    Implemented as a single recursive CTE — much cheaper than N round-
    trips. Cycle guard via the depth limit + visited-array trick.
    """
    skill = await _get_skill_or_404(db, skill_id)

    cte_sql = text(
        """
        WITH RECURSIVE walk AS (
            SELECT
                s.id, s.framework, s.code, s.name, s.description, s.tier,
                s.bloom_level, s.parent_id, s.depth, s.is_active,
                s.metadata AS extra_metadata, s.created_at,
                1 AS hops,
                ARRAY[s.id] AS visited
            FROM skill_prerequisites sp
            JOIN skills s ON s.id = sp.prerequisite_id
            WHERE sp.successor_id = :root_id AND s.is_active

            UNION ALL

            SELECT
                s.id, s.framework, s.code, s.name, s.description, s.tier,
                s.bloom_level, s.parent_id, s.depth, s.is_active,
                s.metadata AS extra_metadata, s.created_at,
                walk.hops + 1,
                walk.visited || s.id
            FROM walk
            JOIN skill_prerequisites sp ON sp.successor_id = walk.id
            JOIN skills s ON s.id = sp.prerequisite_id
            WHERE NOT (s.id = ANY(walk.visited))
              AND walk.hops < :max_depth
              AND s.is_active
        )
        SELECT DISTINCT ON (id)
            id, framework, code, name, description, tier, bloom_level,
            parent_id, depth, is_active, extra_metadata, created_at
        FROM walk
        ORDER BY id, hops
        """
    )
    result = await db.execute(cte_sql, {"root_id": str(skill.id), "max_depth": max_depth})
    rows = result.mappings().all()
    return [SkillResponse.model_validate(dict(row)) for row in rows]


# ---------------------------------------------------------------------------
# Content tagging
# ---------------------------------------------------------------------------


@router.post(
    "/content-skills",
    response_model=ContentTagResponse,
    status_code=status.HTTP_201_CREATED,
)
async def tag_content_with_skill(
    payload: ContentTagRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ContentSkill:
    await _get_skill_or_404(db, payload.skill_id)
    tag = ContentSkill(
        skill_id=payload.skill_id,
        content_kind=payload.content_kind,
        content_id=payload.content_id,
        coverage=payload.coverage,
        bloom_level=payload.bloom_level,
        tagged_by=payload.tagged_by,
    )
    db.add(tag)
    try:
        await db.commit()
    except Exception as exc:  # noqa: BLE001
        await db.rollback()
        if "uq_content_skill" in str(exc):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This content is already tagged with that skill.",
            ) from exc
        raise
    await db.refresh(tag)
    return tag


@router.get("/content-skills", response_model=list[ContentTagResponse])
async def list_content_skill_tags(
    content_kind: ContentKind | None = None,
    content_id: UUID | None = None,
    skill_id: UUID | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[ContentSkill]:
    if not any([content_id, skill_id]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pass at least one of content_id or skill_id",
        )
    stmt = select(ContentSkill)
    if content_kind is not None:
        stmt = stmt.where(ContentSkill.content_kind == content_kind)
    if content_id is not None:
        stmt = stmt.where(ContentSkill.content_id == content_id)
    if skill_id is not None:
        stmt = stmt.where(ContentSkill.skill_id == skill_id)
    result = await db.execute(stmt.order_by(ContentSkill.created_at.desc()).limit(500))
    return list(result.scalars().all())


# ---------------------------------------------------------------------------
# Learner mastery
# ---------------------------------------------------------------------------


@router.get("/skills/me/mastery", response_model=list[MasteryResponse])
async def list_my_mastery(
    framework: SkillFramework | None = None,
    min_mastery: float = Query(default=0.0, ge=0, le=1),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[LearnerSkillMastery]:
    stmt = (
        select(LearnerSkillMastery)
        .join(Skill, Skill.id == LearnerSkillMastery.skill_id)
        .where(
            LearnerSkillMastery.user_id == current_user.id,
            LearnerSkillMastery.mastery >= min_mastery,
        )
    )
    if framework is not None:
        stmt = stmt.where(Skill.framework == framework)
    stmt = stmt.order_by(LearnerSkillMastery.mastery.desc()).limit(500)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.post(
    "/skills/me/mastery",
    response_model=MasteryResponse,
    status_code=status.HTTP_200_OK,
    summary="Upsert mastery for the current user on a skill.",
)
async def write_my_mastery(
    payload: MasteryWriteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> LearnerSkillMastery:
    """
    Called by tutor / assess (Phase 6) after a learner exercises a skill.
    Upserts the LearnerSkillMastery row AND mirrors the value into
    learner_profiles.knowledge_state so both stores stay in sync.
    """
    await _get_skill_or_404(db, payload.skill_id)

    existing_q = await db.execute(
        select(LearnerSkillMastery).where(
            and_(
                LearnerSkillMastery.user_id == current_user.id,
                LearnerSkillMastery.skill_id == payload.skill_id,
            )
        )
    )
    record = existing_q.scalar_one_or_none()

    if record is None:
        record = LearnerSkillMastery(
            user_id=current_user.id,
            skill_id=payload.skill_id,
            mastery=payload.mastery,
            attempts=payload.attempts_delta,
            last_practiced_at=datetime.utcnow(),
            next_review_at=payload.next_review_at,
            measured_at_bloom=payload.measured_at_bloom,
        )
        db.add(record)
    else:
        record.mastery = payload.mastery
        record.attempts = (record.attempts or 0) + payload.attempts_delta
        record.last_practiced_at = datetime.utcnow()
        if payload.next_review_at is not None:
            record.next_review_at = payload.next_review_at
        if payload.measured_at_bloom is not None:
            record.measured_at_bloom = payload.measured_at_bloom

    # Mirror into learner_profiles.knowledge_state JSONB (lazy-create the
    # profile if it's somehow missing — same shape as the lazy create in
    # the learner endpoint).
    profile_q = await db.execute(
        select(LearnerProfile).where(LearnerProfile.user_id == current_user.id)
    )
    profile = profile_q.scalar_one_or_none()
    if profile is None:
        profile = LearnerProfile(user_id=current_user.id)
        db.add(profile)
        await db.flush()

    knowledge = dict(profile.knowledge_state or {})
    knowledge[str(payload.skill_id)] = {
        "mastery": float(payload.mastery),
        "attempts": (record.attempts if record.attempts else payload.attempts_delta),
        "last_practiced": datetime.utcnow().isoformat(),
        "bloom": payload.measured_at_bloom.value if payload.measured_at_bloom else None,
    }
    profile.knowledge_state = knowledge

    await db.commit()
    await db.refresh(record)
    return record

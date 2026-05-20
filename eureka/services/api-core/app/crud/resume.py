"""Resume CRUD operations — async (was sync, broke on AsyncSession)."""

from typing import Optional, List

from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.resume import Resume, ResumeVersion
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeVersionCreate


async def create_resume(db: AsyncSession, user_id: str, resume_in: ResumeCreate) -> Resume:
    resume = Resume(
        user_id=user_id,
        title=resume_in.title,
        template_id=resume_in.template_id,
        data=resume_in.data,
        template_config=resume_in.template_config,
    )
    db.add(resume)
    await db.commit()
    await db.refresh(resume)
    return resume


async def get_resume(db: AsyncSession, resume_id: str, user_id: str) -> Optional[Resume]:
    q = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == user_id)
    )
    return q.scalar_one_or_none()


async def get_resume_by_slug(db: AsyncSession, slug: str) -> Optional[Resume]:
    q = await db.execute(
        select(Resume).where(Resume.slug == slug, Resume.is_public.is_(True))
    )
    return q.scalar_one_or_none()


async def list_resumes(db: AsyncSession, user_id: str) -> List[Resume]:
    q = await db.execute(
        select(Resume)
        .where(Resume.user_id == user_id)
        .order_by(desc(Resume.updated_at))
    )
    return list(q.scalars().all())


async def update_resume(
    db: AsyncSession, resume_id: str, user_id: str, resume_in: ResumeUpdate
) -> Optional[Resume]:
    resume = await get_resume(db, resume_id, user_id)
    if not resume:
        return None
    update_data = resume_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(resume, key, value)
    await db.commit()
    await db.refresh(resume)
    return resume


async def delete_resume(db: AsyncSession, resume_id: str, user_id: str) -> bool:
    resume = await get_resume(db, resume_id, user_id)
    if not resume:
        return False
    await db.delete(resume)
    await db.commit()
    return True


async def duplicate_resume(
    db: AsyncSession, resume_id: str, user_id: str
) -> Optional[Resume]:
    original = await get_resume(db, resume_id, user_id)
    if not original:
        return None
    new_resume = Resume(
        user_id=user_id,
        title=f"{original.title} (Copy)",
        template_id=original.template_id,
        data=original.data,
        template_config=original.template_config,
    )
    db.add(new_resume)
    await db.commit()
    await db.refresh(new_resume)
    return new_resume


async def create_version(
    db: AsyncSession,
    resume_id: str,
    user_id: str,
    version_in: ResumeVersionCreate,
) -> Optional[ResumeVersion]:
    resume = await get_resume(db, resume_id, user_id)
    if not resume:
        return None
    max_version = int(
        (
            await db.execute(
                select(func.count(ResumeVersion.id)).where(
                    ResumeVersion.resume_id == resume_id
                )
            )
        ).scalar_one()
        or 0
    )
    version = ResumeVersion(
        resume_id=resume_id,
        version_number=max_version + 1,
        label=version_in.label,
        data=version_in.data,
    )
    db.add(version)
    await db.commit()
    await db.refresh(version)
    return version


async def list_versions(
    db: AsyncSession, resume_id: str, user_id: str
) -> List[ResumeVersion]:
    resume = await get_resume(db, resume_id, user_id)
    if not resume:
        return []
    q = await db.execute(
        select(ResumeVersion)
        .where(ResumeVersion.resume_id == resume_id)
        .order_by(desc(ResumeVersion.created_at))
    )
    return list(q.scalars().all())


async def increment_view_count(db: AsyncSession, slug: str) -> None:
    resume = await get_resume_by_slug(db, slug)
    if resume:
        resume.view_count = (resume.view_count or 0) + 1
        await db.commit()

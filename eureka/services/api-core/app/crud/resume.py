"""Resume CRUD operations."""

from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional, List
from app.models.resume import Resume, ResumeVersion
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeVersionCreate


def create_resume(db: Session, user_id: str, resume_in: ResumeCreate) -> Resume:
    resume = Resume(
        user_id=user_id,
        title=resume_in.title,
        template_id=resume_in.template_id,
        data=resume_in.data,
        template_config=resume_in.template_config,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


def get_resume(db: Session, resume_id: str, user_id: str) -> Optional[Resume]:
    return db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == user_id,
    ).first()


def get_resume_by_slug(db: Session, slug: str) -> Optional[Resume]:
    return db.query(Resume).filter(
        Resume.slug == slug,
        Resume.is_public == True,
    ).first()


def list_resumes(db: Session, user_id: str) -> List[Resume]:
    return db.query(Resume).filter(
        Resume.user_id == user_id,
    ).order_by(desc(Resume.updated_at)).all()


def update_resume(db: Session, resume_id: str, user_id: str, resume_in: ResumeUpdate) -> Optional[Resume]:
    resume = get_resume(db, resume_id, user_id)
    if not resume:
        return None
    update_data = resume_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(resume, key, value)
    db.commit()
    db.refresh(resume)
    return resume


def delete_resume(db: Session, resume_id: str, user_id: str) -> bool:
    resume = get_resume(db, resume_id, user_id)
    if not resume:
        return False
    db.delete(resume)
    db.commit()
    return True


def duplicate_resume(db: Session, resume_id: str, user_id: str) -> Optional[Resume]:
    original = get_resume(db, resume_id, user_id)
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
    db.commit()
    db.refresh(new_resume)
    return new_resume


def create_version(db: Session, resume_id: str, user_id: str, version_in: ResumeVersionCreate) -> Optional[ResumeVersion]:
    resume = get_resume(db, resume_id, user_id)
    if not resume:
        return None
    # Get next version number
    max_version = db.query(ResumeVersion).filter(
        ResumeVersion.resume_id == resume_id
    ).count()
    version = ResumeVersion(
        resume_id=resume_id,
        version_number=max_version + 1,
        label=version_in.label,
        data=version_in.data,
    )
    db.add(version)
    db.commit()
    db.refresh(version)
    return version


def list_versions(db: Session, resume_id: str, user_id: str) -> List[ResumeVersion]:
    resume = get_resume(db, resume_id, user_id)
    if not resume:
        return []
    return db.query(ResumeVersion).filter(
        ResumeVersion.resume_id == resume_id
    ).order_by(desc(ResumeVersion.created_at)).all()


def increment_view_count(db: Session, slug: str) -> None:
    resume = db.query(Resume).filter(Resume.slug == slug, Resume.is_public == True).first()
    if resume:
        resume.view_count = (resume.view_count or 0) + 1
        db.commit()

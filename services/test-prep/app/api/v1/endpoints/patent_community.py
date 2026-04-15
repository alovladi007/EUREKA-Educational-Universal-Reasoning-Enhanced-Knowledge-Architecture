"""
Patent Bar cohort: roster (avatars), course chat, study groups.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from app.core.database import get_db
from app.models.patent_community import (
    PatentCourseRoster,
    PatentStudyGroup,
    PatentStudyGroupMember,
    PatentCommunityMessage,
)

router = APIRouter()

EXAM_DEFAULT = "PATENT_BAR"


@router.post("/profile")
def upsert_roster_profile(data: dict, db: Session = Depends(get_db)):
    """Register / update this learner in the course directory (name + avatar for classmates)."""
    exam_type = (data.get("exam_type") or EXAM_DEFAULT).upper()
    user_id = data.get("user_id")
    display_name = (data.get("display_name") or "").strip()
    if not user_id or not display_name:
        raise HTTPException(400, "user_id and display_name required")

    avatar_url = (data.get("avatar_url") or "").strip() or None
    tagline = (data.get("tagline") or "").strip() or None

    row = (
        db.query(PatentCourseRoster)
        .filter(PatentCourseRoster.exam_type == exam_type, PatentCourseRoster.user_id == user_id)
        .first()
    )
    if row:
        row.display_name = display_name[:200]
        row.avatar_url = avatar_url[:1000] if avatar_url else None
        row.tagline = tagline[:300] if tagline else None
        row.updated_at = datetime.utcnow()
    else:
        row = PatentCourseRoster(
            id=str(uuid.uuid4()),
            exam_type=exam_type,
            user_id=user_id,
            display_name=display_name[:200],
            avatar_url=avatar_url[:1000] if avatar_url else None,
            tagline=tagline[:300] if tagline else None,
            updated_at=datetime.utcnow(),
        )
        db.add(row)
    db.commit()
    db.refresh(row)
    return {"status": "ok", "id": row.id}


@router.get("/roster")
def get_roster(
    exam_type: str = Query(EXAM_DEFAULT),
    db: Session = Depends(get_db),
):
    exam_type = exam_type.upper()
    rows = (
        db.query(PatentCourseRoster)
        .filter(PatentCourseRoster.exam_type == exam_type)
        .order_by(PatentCourseRoster.display_name)
        .all()
    )
    return {
        "exam_type": exam_type,
        "learners": [
            {
                "user_id": r.user_id,
                "display_name": r.display_name,
                "avatar_url": r.avatar_url,
                "tagline": r.tagline,
                "updated_at": r.updated_at.isoformat() if r.updated_at else None,
            }
            for r in rows
        ],
    }


@router.get("/messages")
def list_messages(
    exam_type: str = Query(EXAM_DEFAULT),
    group_id: str | None = Query(None),
    limit: int = Query(80, ge=1, le=200),
    db: Session = Depends(get_db),
):
    exam_type = exam_type.upper()
    q = db.query(PatentCommunityMessage).filter(PatentCommunityMessage.exam_type == exam_type)
    if group_id:
        q = q.filter(PatentCommunityMessage.group_id == group_id)
    else:
        q = q.filter(PatentCommunityMessage.group_id.is_(None))
    rows = q.order_by(PatentCommunityMessage.created_at.desc()).limit(limit).all()
    rows = list(reversed(rows))
    return {
        "exam_type": exam_type,
        "group_id": group_id,
        "messages": [
            {
                "id": r.id,
                "user_id": r.user_id,
                "display_name": r.display_name,
                "body": r.body,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in rows
        ],
    }


@router.post("/messages")
def post_message(data: dict, db: Session = Depends(get_db)):
    exam_type = (data.get("exam_type") or EXAM_DEFAULT).upper()
    user_id = data.get("user_id")
    body = (data.get("body") or "").strip()
    if not user_id or not body:
        raise HTTPException(400, "user_id and body required")
    if len(body) > 4000:
        raise HTTPException(400, "body too long")

    group_id = data.get("group_id")
    if group_id:
        g = db.query(PatentStudyGroup).filter(PatentStudyGroup.id == group_id, PatentStudyGroup.exam_type == exam_type).first()
        if not g:
            raise HTTPException(404, "Study group not found")
        mem = (
            db.query(PatentStudyGroupMember)
            .filter(PatentStudyGroupMember.group_id == group_id, PatentStudyGroupMember.user_id == user_id)
            .first()
        )
        if not mem:
            raise HTTPException(403, "Join this group before posting")

    display_name = (data.get("display_name") or "").strip() or None
    if not display_name:
        r0 = (
            db.query(PatentCourseRoster)
            .filter(PatentCourseRoster.exam_type == exam_type, PatentCourseRoster.user_id == user_id)
            .first()
        )
        if r0:
            display_name = r0.display_name

    msg = PatentCommunityMessage(
        id=str(uuid.uuid4()),
        exam_type=exam_type,
        group_id=group_id,
        user_id=user_id,
        display_name=display_name[:200] if display_name else None,
        body=body,
        created_at=datetime.utcnow(),
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {"id": msg.id, "status": "created"}


@router.get("/groups")
def list_groups(
    exam_type: str = Query(EXAM_DEFAULT),
    user_id: str | None = Query(None),
    db: Session = Depends(get_db),
):
    exam_type = exam_type.upper()
    groups = db.query(PatentStudyGroup).filter(PatentStudyGroup.exam_type == exam_type).order_by(PatentStudyGroup.created_at.desc()).all()
    member_counts = {}
    if groups:
        counts = (
            db.query(PatentStudyGroupMember.group_id, func.count(PatentStudyGroupMember.user_id))
            .filter(PatentStudyGroupMember.group_id.in_([g.id for g in groups]))
            .group_by(PatentStudyGroupMember.group_id)
            .all()
        )
        member_counts = {gid: c for gid, c in counts}

    mine = set()
    if user_id:
        mrows = db.query(PatentStudyGroupMember).filter(PatentStudyGroupMember.user_id == user_id).all()
        mine = {m.group_id for m in mrows}

    return {
        "exam_type": exam_type,
        "groups": [
            {
                "id": g.id,
                "name": g.name,
                "description": g.description,
                "created_by": g.created_by,
                "created_at": g.created_at.isoformat() if g.created_at else None,
                "member_count": member_counts.get(g.id, 0),
                "is_member": g.id in mine,
            }
            for g in groups
        ],
    }


@router.post("/groups")
def create_group(data: dict, db: Session = Depends(get_db)):
    exam_type = (data.get("exam_type") or EXAM_DEFAULT).upper()
    name = (data.get("name") or "").strip()
    created_by = data.get("created_by")
    if not name or not created_by:
        raise HTTPException(400, "name and created_by required")

    g = PatentStudyGroup(
        id=str(uuid.uuid4()),
        exam_type=exam_type,
        name=name[:200],
        description=(data.get("description") or "").strip() or None,
        created_by=created_by[:128],
        created_at=datetime.utcnow(),
    )
    db.add(g)
    db.add(PatentStudyGroupMember(group_id=g.id, user_id=created_by[:128], joined_at=datetime.utcnow()))
    db.commit()
    db.refresh(g)
    return {"id": g.id, "status": "created"}


@router.post("/groups/{group_id}/join")
def join_group(group_id: str, data: dict, db: Session = Depends(get_db)):
    user_id = data.get("user_id")
    if not user_id:
        raise HTTPException(400, "user_id required")
    g = db.query(PatentStudyGroup).filter(PatentStudyGroup.id == group_id).first()
    if not g:
        raise HTTPException(404, "Group not found")
    exists = (
        db.query(PatentStudyGroupMember)
        .filter(PatentStudyGroupMember.group_id == group_id, PatentStudyGroupMember.user_id == user_id)
        .first()
    )
    if exists:
        return {"status": "already_member"}
    db.add(PatentStudyGroupMember(group_id=group_id, user_id=user_id[:128], joined_at=datetime.utcnow()))
    db.commit()
    return {"status": "joined"}

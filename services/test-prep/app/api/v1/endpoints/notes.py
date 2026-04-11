"""
Notes API — create, read, update, delete personal study notes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.core.database import get_db
from app.models.lesson_note import LessonNote

router = APIRouter()


@router.get("/")
def list_notes(
    exam_type: str = Query(...),
    user_id: str = Query("demo_user"),
    section_id: Optional[str] = None,
    lesson_id: Optional[str] = None,
    pinned_only: bool = False,
    db: Session = Depends(get_db),
):
    q = db.query(LessonNote).filter(
        LessonNote.user_id == user_id,
        LessonNote.exam_type == exam_type,
        LessonNote.is_archived == False,
    )
    if section_id:
        q = q.filter(LessonNote.section_id == section_id)
    if lesson_id:
        q = q.filter(LessonNote.lesson_id == lesson_id)
    if pinned_only:
        q = q.filter(LessonNote.is_pinned == True)

    notes = q.order_by(LessonNote.is_pinned.desc(), LessonNote.updated_at.desc()).all()
    return {
        "notes": [_note_dict(n) for n in notes],
        "total": len(notes),
    }


@router.get("/{note_id}")
def get_note(note_id: str, db: Session = Depends(get_db)):
    note = db.query(LessonNote).filter(LessonNote.id == note_id).first()
    if not note:
        raise HTTPException(404, "Note not found")
    return _note_dict(note)


@router.post("/")
def create_note(data: dict, db: Session = Depends(get_db)):
    note = LessonNote(
        user_id=data.get("user_id", "demo_user"),
        lesson_id=data.get("lesson_id"),
        exam_type=data["exam_type"],
        section_id=data.get("section_id"),
        topic=data.get("topic"),
        title=data.get("title"),
        content=data["content"],
        color_label=data.get("color_label", "yellow"),
        is_pinned=data.get("is_pinned", False),
        video_timestamp_seconds=data.get("video_timestamp_seconds"),
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return _note_dict(note)


@router.put("/{note_id}")
def update_note(note_id: str, data: dict, db: Session = Depends(get_db)):
    note = db.query(LessonNote).filter(LessonNote.id == note_id).first()
    if not note:
        raise HTTPException(404, "Note not found")

    for field in ("title", "content", "color_label", "is_pinned", "is_archived",
                   "section_id", "topic", "video_timestamp_seconds"):
        if field in data:
            setattr(note, field, data[field])

    note.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(note)
    return _note_dict(note)


@router.delete("/{note_id}")
def delete_note(note_id: str, db: Session = Depends(get_db)):
    note = db.query(LessonNote).filter(LessonNote.id == note_id).first()
    if not note:
        raise HTTPException(404, "Note not found")
    db.delete(note)
    db.commit()
    return {"status": "deleted"}


def _note_dict(n: LessonNote) -> dict:
    return {
        "id": n.id,
        "user_id": n.user_id,
        "lesson_id": n.lesson_id,
        "exam_type": n.exam_type,
        "section_id": n.section_id,
        "topic": n.topic,
        "title": n.title,
        "content": n.content,
        "color_label": n.color_label,
        "is_pinned": n.is_pinned,
        "is_archived": n.is_archived,
        "video_timestamp_seconds": n.video_timestamp_seconds,
        "created_at": n.created_at.isoformat() if n.created_at else None,
        "updated_at": n.updated_at.isoformat() if n.updated_at else None,
    }

"""
Video lessons API — browse lessons, track progress, manage content
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import datetime
import json

from app.core.database import get_db
from app.models.video_lesson import VideoLesson, UserLessonProgress

router = APIRouter()


# ── Browse & read ──────────────────────────────────────────────

@router.get("/")
def list_lessons(
    exam_type: str = Query(...),
    section_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(VideoLesson).filter(
        VideoLesson.exam_type == exam_type,
        VideoLesson.is_published == True,
    )
    if section_id:
        q = q.filter(VideoLesson.section_id == section_id)
    lessons = q.order_by(VideoLesson.sort_order).all()

    sections: dict[str, list] = {}
    for l in lessons:
        sec = l.section_id
        if sec not in sections:
            sections[sec] = []
        sections[sec].append(_lesson_dict(l))

    return {"exam_type": exam_type, "sections": sections, "total": len(lessons)}


@router.get("/{lesson_id}")
def get_lesson(lesson_id: str, db: Session = Depends(get_db)):
    lesson = db.query(VideoLesson).filter(VideoLesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(404, "Lesson not found")
    lesson.view_count = (lesson.view_count or 0) + 1
    db.commit()
    return _lesson_dict(lesson, full=True)


# ── Progress tracking ──────────────────────────────────────────

@router.get("/progress/{exam_type}")
def get_progress(
    exam_type: str,
    user_id: str = Query("demo_user"),
    db: Session = Depends(get_db),
):
    total = db.query(func.count(VideoLesson.id)).filter(
        VideoLesson.exam_type == exam_type,
        VideoLesson.is_published == True,
    ).scalar() or 0

    completed = db.query(func.count(UserLessonProgress.id)).join(VideoLesson).filter(
        VideoLesson.exam_type == exam_type,
        UserLessonProgress.user_id == user_id,
        UserLessonProgress.is_completed == True,
    ).scalar() or 0

    in_progress = db.query(func.count(UserLessonProgress.id)).join(VideoLesson).filter(
        VideoLesson.exam_type == exam_type,
        UserLessonProgress.user_id == user_id,
        UserLessonProgress.is_completed == False,
    ).scalar() or 0

    total_watch_time = db.query(func.sum(UserLessonProgress.watched_seconds)).join(VideoLesson).filter(
        VideoLesson.exam_type == exam_type,
        UserLessonProgress.user_id == user_id,
    ).scalar() or 0

    return {
        "exam_type": exam_type,
        "total_lessons": total,
        "completed": completed,
        "in_progress": in_progress,
        "not_started": total - completed - in_progress,
        "completion_percent": round((completed / total) * 100, 1) if total > 0 else 0,
        "total_watch_time_seconds": total_watch_time,
    }


@router.post("/progress")
def update_progress(
    data: dict,
    db: Session = Depends(get_db),
):
    user_id = data.get("user_id", "demo_user")
    lesson_id = data["lesson_id"]
    position = data.get("position_seconds", 0)
    duration = data.get("duration_seconds", 0)

    progress = db.query(UserLessonProgress).filter(
        UserLessonProgress.user_id == user_id,
        UserLessonProgress.lesson_id == lesson_id,
    ).first()

    if not progress:
        progress = UserLessonProgress(
            user_id=user_id,
            lesson_id=lesson_id,
            total_seconds=duration,
        )
        db.add(progress)

    progress.last_position_seconds = position
    progress.watched_seconds = max(progress.watched_seconds or 0, position)
    progress.total_seconds = duration or progress.total_seconds

    if duration > 0 and position >= duration * 0.9:
        if not progress.is_completed:
            progress.is_completed = True
            progress.completed_at = datetime.utcnow()

    progress.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(progress)

    return {"status": "ok", "is_completed": progress.is_completed}


# ── Admin: create / seed lessons ───────────────────────────────

@router.post("/")
def create_lesson(data: dict, db: Session = Depends(get_db)):
    lesson = VideoLesson(
        exam_type=data["exam_type"],
        section_id=data["section_id"],
        topic=data.get("topic", ""),
        title=data["title"],
        description=data.get("description"),
        video_url=data["video_url"],
        thumbnail_url=data.get("thumbnail_url"),
        duration_seconds=data.get("duration_seconds", 0),
        sort_order=data.get("sort_order", 0),
        transcript=data.get("transcript"),
        official_notes=data.get("official_notes"),
        key_concepts=json.dumps(data.get("key_concepts", [])),
        resources=json.dumps(data.get("resources", [])),
        instructor_name=data.get("instructor_name"),
        difficulty_level=data.get("difficulty_level"),
        is_free=data.get("is_free", False),
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return _lesson_dict(lesson)


@router.post("/seed")
def seed_lessons(data: dict, db: Session = Depends(get_db)):
    """Bulk-seed lessons for an exam type. Body: { lessons: [...] }"""
    created = 0
    for item in data.get("lessons", []):
        lesson = VideoLesson(
            exam_type=item["exam_type"],
            section_id=item["section_id"],
            topic=item.get("topic", ""),
            title=item["title"],
            description=item.get("description"),
            video_url=item.get("video_url", ""),
            thumbnail_url=item.get("thumbnail_url"),
            duration_seconds=item.get("duration_seconds", 0),
            sort_order=item.get("sort_order", created),
            official_notes=item.get("official_notes"),
            key_concepts=json.dumps(item.get("key_concepts", [])),
            instructor_name=item.get("instructor_name"),
            difficulty_level=item.get("difficulty_level"),
            is_free=item.get("is_free", False),
        )
        db.add(lesson)
        created += 1
    db.commit()
    return {"created": created}


# ── Helpers ────────────────────────────────────────────────────

def _lesson_dict(l: VideoLesson, full: bool = False) -> dict:
    d = {
        "id": l.id,
        "exam_type": l.exam_type,
        "section_id": l.section_id,
        "topic": l.topic,
        "title": l.title,
        "description": l.description,
        "video_url": l.video_url,
        "thumbnail_url": l.thumbnail_url,
        "duration_seconds": l.duration_seconds,
        "sort_order": l.sort_order,
        "instructor_name": l.instructor_name,
        "difficulty_level": l.difficulty_level,
        "is_free": l.is_free,
        "view_count": l.view_count,
        "avg_rating": l.avg_rating,
    }
    if full:
        d.update({
            "transcript": l.transcript,
            "official_notes": l.official_notes,
            "key_concepts": json.loads(l.key_concepts) if l.key_concepts else [],
            "resources": json.loads(l.resources) if l.resources else [],
        })
    return d

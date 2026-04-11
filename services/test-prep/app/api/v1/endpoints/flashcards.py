"""
Flashcards API — browse decks, study with spaced repetition, create custom cards
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import Optional
from datetime import datetime, timedelta
import json, math

from app.core.database import get_db
from app.models.flashcard import Flashcard, FlashcardProgress

router = APIRouter()


# ── Browse ─────────────────────────────────────────────────────

@router.get("/")
def list_flashcards(
    exam_type: str = Query(...),
    section_id: Optional[str] = None,
    user_id: str = Query("demo_user"),
    db: Session = Depends(get_db),
):
    q = db.query(Flashcard).filter(
        Flashcard.exam_type == exam_type,
        Flashcard.is_published == True,
        or_(Flashcard.created_by == None, Flashcard.created_by == user_id),
    )
    if section_id:
        q = q.filter(Flashcard.section_id == section_id)

    cards = q.order_by(Flashcard.section_id, Flashcard.sort_order).all()

    sections: dict[str, list] = {}
    for c in cards:
        sec = c.section_id or "general"
        if sec not in sections:
            sections[sec] = []
        sections[sec].append(_card_dict(c))

    return {"exam_type": exam_type, "sections": sections, "total": len(cards)}


@router.get("/due")
def get_due_cards(
    exam_type: str = Query(...),
    user_id: str = Query("demo_user"),
    limit: int = 20,
    db: Session = Depends(get_db),
):
    """Get cards due for review (spaced repetition)."""
    now = datetime.utcnow()

    # Cards with progress that are due
    due_with_progress = (
        db.query(Flashcard, FlashcardProgress)
        .join(FlashcardProgress, FlashcardProgress.flashcard_id == Flashcard.id)
        .filter(
            Flashcard.exam_type == exam_type,
            FlashcardProgress.user_id == user_id,
            FlashcardProgress.next_review <= now,
        )
        .order_by(FlashcardProgress.next_review)
        .limit(limit)
        .all()
    )

    # New cards never seen
    seen_ids = (
        db.query(FlashcardProgress.flashcard_id)
        .filter(FlashcardProgress.user_id == user_id)
        .subquery()
    )
    new_cards = (
        db.query(Flashcard)
        .filter(
            Flashcard.exam_type == exam_type,
            Flashcard.is_published == True,
            ~Flashcard.id.in_(seen_ids),
        )
        .limit(max(0, limit - len(due_with_progress)))
        .all()
    )

    result = []
    for card, progress in due_with_progress:
        d = _card_dict(card)
        d["progress"] = _progress_dict(progress)
        result.append(d)
    for card in new_cards:
        d = _card_dict(card)
        d["progress"] = None
        result.append(d)

    return {"cards": result, "total_due": len(result)}


# ── Study (rate a card) ────────────────────────────────────────

@router.post("/review")
def review_card(data: dict, db: Session = Depends(get_db)):
    """
    Rate a flashcard after reviewing it.
    rating: 1=again, 2=hard, 3=good, 4=easy
    """
    user_id = data.get("user_id", "demo_user")
    card_id = data["flashcard_id"]
    rating = data["rating"]  # 1-4

    card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
    if not card:
        raise HTTPException(404, "Flashcard not found")

    progress = db.query(FlashcardProgress).filter(
        FlashcardProgress.user_id == user_id,
        FlashcardProgress.flashcard_id == card_id,
    ).first()

    if not progress:
        progress = FlashcardProgress(user_id=user_id, flashcard_id=card_id)
        db.add(progress)

    progress.times_seen += 1
    progress.last_rating = rating
    progress.last_reviewed = datetime.utcnow()

    if rating >= 3:
        progress.times_correct += 1
        progress.streak += 1
    else:
        progress.times_incorrect += 1
        progress.streak = 0

    # SM-2 spaced repetition algorithm
    ef = progress.ease_factor
    if rating == 1:  # again
        progress.repetitions = 0
        progress.interval_days = 1
        ef = max(1.3, ef - 0.2)
    elif rating == 2:  # hard
        progress.interval_days = max(1, int(progress.interval_days * 1.2))
        ef = max(1.3, ef - 0.15)
    elif rating == 3:  # good
        if progress.repetitions == 0:
            progress.interval_days = 1
        elif progress.repetitions == 1:
            progress.interval_days = 6
        else:
            progress.interval_days = int(math.ceil(progress.interval_days * ef))
        progress.repetitions += 1
    elif rating == 4:  # easy
        if progress.repetitions == 0:
            progress.interval_days = 4
        else:
            progress.interval_days = int(math.ceil(progress.interval_days * ef * 1.3))
        ef = ef + 0.15
        progress.repetitions += 1

    progress.ease_factor = ef
    progress.next_review = datetime.utcnow() + timedelta(days=progress.interval_days)
    db.commit()

    return {
        "status": "ok",
        "next_review": progress.next_review.isoformat(),
        "interval_days": progress.interval_days,
        "streak": progress.streak,
        "ease_factor": round(progress.ease_factor, 2),
    }


# ── Stats ──────────────────────────────────────────────────────

@router.get("/stats")
def get_stats(
    exam_type: str = Query(...),
    user_id: str = Query("demo_user"),
    db: Session = Depends(get_db),
):
    total = db.query(func.count(Flashcard.id)).filter(
        Flashcard.exam_type == exam_type, Flashcard.is_published == True
    ).scalar() or 0

    studied = db.query(func.count(FlashcardProgress.id)).join(Flashcard).filter(
        Flashcard.exam_type == exam_type,
        FlashcardProgress.user_id == user_id,
    ).scalar() or 0

    mastered = db.query(func.count(FlashcardProgress.id)).join(Flashcard).filter(
        Flashcard.exam_type == exam_type,
        FlashcardProgress.user_id == user_id,
        FlashcardProgress.streak >= 3,
    ).scalar() or 0

    due_now = db.query(func.count(FlashcardProgress.id)).join(Flashcard).filter(
        Flashcard.exam_type == exam_type,
        FlashcardProgress.user_id == user_id,
        FlashcardProgress.next_review <= datetime.utcnow(),
    ).scalar() or 0

    return {
        "total_cards": total,
        "studied": studied,
        "not_started": total - studied,
        "mastered": mastered,
        "due_now": due_now + (total - studied),
    }


# ── CRUD (user-created cards) ─────────────────────────────────

@router.post("/")
def create_flashcard(data: dict, db: Session = Depends(get_db)):
    raw_tags = data.get("tags", [])
    tags_json = json.dumps(raw_tags) if not isinstance(raw_tags, str) else raw_tags
    card = Flashcard(
        exam_type=data["exam_type"],
        section_id=data.get("section_id"),
        topic=data.get("topic"),
        front=data["front"],
        back=data["back"],
        hint=data.get("hint"),
        tags=tags_json,
        difficulty=data.get("difficulty"),
        created_by=data.get("user_id", "demo_user"),
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return _card_dict(card)


@router.delete("/{card_id}")
def delete_flashcard(card_id: str, db: Session = Depends(get_db)):
    card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
    if not card:
        raise HTTPException(404, "Flashcard not found")
    db.delete(card)
    db.commit()
    return {"status": "deleted"}


@router.post("/seed")
def seed_flashcards(data: dict, db: Session = Depends(get_db)):
    """Bulk-seed flashcards. Body: { cards: [...] }"""
    created = 0
    for item in data.get("cards", []):
        card = Flashcard(
            exam_type=item["exam_type"],
            section_id=item.get("section_id"),
            topic=item.get("topic"),
            front=item["front"],
            back=item["back"],
            hint=item.get("hint"),
            tags=json.dumps(item.get("tags", [])),
            difficulty=item.get("difficulty"),
            sort_order=item.get("sort_order", created),
        )
        db.add(card)
        created += 1
    db.commit()
    return {"created": created}


# ── Helpers ────────────────────────────────────────────────────

def _card_dict(c: Flashcard) -> dict:
    tags_parsed = None
    if c.tags:
        try:
            tags_parsed = json.loads(c.tags)
        except Exception:
            tags_parsed = []
    if isinstance(tags_parsed, dict):
        tag_out = tags_parsed
    elif isinstance(tags_parsed, list):
        tag_out = tags_parsed
    else:
        tag_out = []

    d = {
        "id": c.id,
        "exam_type": c.exam_type,
        "section_id": c.section_id,
        "topic": c.topic,
        "front": c.front,
        "back": c.back,
        "hint": c.hint,
        "difficulty": c.difficulty,
        "tags": tag_out,
        "created_by": c.created_by,
    }
    if isinstance(tags_parsed, dict):
        if tags_parsed.get("mpep_chapter"):
            d["mpep_chapter"] = tags_parsed["mpep_chapter"]
        if tags_parsed.get("statute"):
            d["statute_ref"] = tags_parsed["statute"]
        if tags_parsed.get("source"):
            d["tag_source"] = tags_parsed["source"]
    return d


def _progress_dict(p: FlashcardProgress) -> dict:
    return {
        "times_seen": p.times_seen,
        "times_correct": p.times_correct,
        "streak": p.streak,
        "ease_factor": round(p.ease_factor, 2),
        "interval_days": p.interval_days,
        "next_review": p.next_review.isoformat() if p.next_review else None,
        "last_rating": p.last_rating,
    }

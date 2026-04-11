"""
Patent Bar — MPEP bookmarks, weakness analytics, flashcards from missed rules.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from collections import defaultdict
import json
import uuid

from app.core.database import get_db
from app.models.question import Question
from app.models.qbank_session import QBankSession
from app.models.flashcard import Flashcard, FlashcardProgress
from app.models.mpep_bookmark import MpepBookmark
from app.models.patent_live import PatentOfficeHoursSlot, PatentCohort

router = APIRouter()

EXAM = "PATENT_BAR"


def _parse_question_tags(raw: str | None) -> dict:
    if not raw:
        return {}
    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            return data
        if isinstance(data, list):
            return {}
    except Exception:
        pass
    return {}


def _patent_meta(q: Question) -> dict:
    meta = _parse_question_tags(q.tags)
    mpep_chapter = meta.get("mpep_chapter") or meta.get("mpep") or (q.section if q.section and q.section.isdigit() else None)
    statute = meta.get("statute") or meta.get("statute_section") or meta.get("usc")
    topic = meta.get("patent_topic") or meta.get("topic_label") or q.topic
    return {
        "mpep_chapter": str(mpep_chapter) if mpep_chapter is not None else None,
        "statute": str(statute) if statute is not None else None,
        "topic": topic,
        "content_type": meta.get("content_type") or "procedure",
        "trap_type": meta.get("trap_type") or "Unassigned",
    }


def _bucket_key(kind: str, meta: dict) -> str:
    if kind == "mpep_chapter":
        return meta.get("mpep_chapter") or "Unassigned"
    if kind == "statute":
        return meta.get("statute") or "Unassigned"
    if kind == "content_type":
        return meta.get("content_type") or "Unassigned"
    if kind == "trap_type":
        return meta.get("trap_type") or "Unassigned"
    return meta.get("topic") or "General"


@router.get("/analytics")
def patent_bar_analytics(
    user_id: str = Query("demo_user"),
    db: Session = Depends(get_db),
):
    """
    Weakness by MPEP chapter / statute / topic; time vs accuracy; risk flags.
    """
    sessions = (
        db.query(QBankSession)
        .filter(
            QBankSession.user_id == user_id,
            QBankSession.exam_type == EXAM,
        )
        .all()
    )

    detail_points: list[dict] = []
    agg_mpep: dict[str, dict] = defaultdict(lambda: {"correct": 0, "total": 0, "time_sum": 0.0})
    agg_statute: dict[str, dict] = defaultdict(lambda: {"correct": 0, "total": 0, "time_sum": 0.0})
    agg_topic: dict[str, dict] = defaultdict(lambda: {"correct": 0, "total": 0, "time_sum": 0.0})
    agg_content: dict[str, dict] = defaultdict(lambda: {"correct": 0, "total": 0, "time_sum": 0.0})
    agg_trap: dict[str, dict] = defaultdict(lambda: {"correct": 0, "total": 0, "time_sum": 0.0})

    for session in sessions:
        answers = json.loads(session.answers or "{}")
        if not answers:
            continue
        for qid_str, ans in answers.items():
            q = db.query(Question).filter(Question.id == str(qid_str)).first()
            if not q or q.exam != EXAM:
                continue
            meta = _patent_meta(q)
            t = float(ans.get("time_spent") or 0)
            ok = bool(ans.get("is_correct"))

            for kind, bucket_map in (
                ("mpep_chapter", agg_mpep),
                ("statute", agg_statute),
                ("topic", agg_topic),
                ("content_type", agg_content),
                ("trap_type", agg_trap),
            ):
                key = _bucket_key(kind, meta)
                b = bucket_map[key]
                b["total"] += 1
                b["time_sum"] += t
                if ok:
                    b["correct"] += 1

            detail_points.append(
                {
                    "question_id": str(q.id),
                    "mpep_chapter": meta.get("mpep_chapter"),
                    "statute": meta.get("statute"),
                    "topic": meta.get("topic"),
                    "content_type": meta.get("content_type"),
                    "trap_type": meta.get("trap_type"),
                    "time_spent_seconds": t,
                    "is_correct": ok,
                }
            )

    def _finalize(m: dict[str, dict]) -> list[dict]:
        rows = []
        for key, v in m.items():
            total = v["total"]
            if total == 0:
                continue
            acc = v["correct"] / total
            avg_t = v["time_sum"] / total
            risk = avg_t > 120 and acc < 0.55
            rows.append(
                {
                    "key": key,
                    "attempts": total,
                    "correct": v["correct"],
                    "accuracy": round(acc, 4),
                    "avg_time_seconds": round(avg_t, 1),
                    "risk_slow_inaccurate": risk,
                }
            )
        rows.sort(key=lambda r: (r["accuracy"], -r["avg_time_seconds"]))
        return rows

    weakness_mpep = _finalize(agg_mpep)
    weakness_statute = _finalize(agg_statute)
    weakness_topic = _finalize(agg_topic)
    weakness_content = _finalize(agg_content)
    weakness_trap = _finalize(agg_trap)

    return {
        "exam_type": EXAM,
        "total_answered": len(detail_points),
        "weakness_by_mpep_chapter": weakness_mpep[:40],
        "weakness_by_statute": weakness_statute[:40],
        "weakness_by_topic": weakness_topic[:50],
        "weakness_by_content_type": weakness_content[:20],
        "weakness_by_trap_type": weakness_trap[:30],
        "time_accuracy_points": detail_points[-500:],
        "summary": {
            "slow_inaccurate_buckets": [
                r["key"]
                for r in weakness_mpep
                if r.get("risk_slow_inaccurate") and r["attempts"] >= 2
            ][:10],
        },
    }


@router.get("/bookmarks")
def list_bookmarks(
    user_id: str = Query("demo_user"),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(MpepBookmark)
        .filter(MpepBookmark.user_id == user_id)
        .order_by(MpepBookmark.sort_order, MpepBookmark.created_at)
        .all()
    )
    return {
        "bookmarks": [
            {
                "id": r.id,
                "title": r.title,
                "url": r.url,
                "chapter": r.chapter,
                "notes": r.notes,
                "sort_order": r.sort_order,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in rows
        ]
    }


@router.post("/bookmarks")
def create_bookmark(data: dict, db: Session = Depends(get_db)):
    user_id = data.get("user_id", "demo_user")
    title = data.get("title")
    url = data.get("url")
    if not title or not url:
        raise HTTPException(400, "title and url required")
    row = MpepBookmark(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=title[:500],
        url=url,
        chapter=data.get("chapter"),
        notes=data.get("notes"),
        sort_order=int(data.get("sort_order", 0)),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"id": row.id, "status": "created"}


@router.delete("/bookmarks/{bookmark_id}")
def delete_bookmark(bookmark_id: str, user_id: str = Query("demo_user"), db: Session = Depends(get_db)):
    row = (
        db.query(MpepBookmark)
        .filter(MpepBookmark.id == bookmark_id, MpepBookmark.user_id == user_id)
        .first()
    )
    if not row:
        raise HTTPException(404, "Bookmark not found")
    db.delete(row)
    db.commit()
    return {"status": "deleted"}


@router.post("/flashcards/from-misses")
def flashcards_from_misses(data: dict, db: Session = Depends(get_db)):
    """
    Create flashcards from incorrect QBank answers, tagged with MPEP/statute anchors for SRS.
    """
    user_id = data.get("user_id", "demo_user")
    limit = min(int(data.get("limit", 25)), 100)

    sessions = (
        db.query(QBankSession)
        .filter(QBankSession.user_id == user_id, QBankSession.exam_type == EXAM)
        .order_by(QBankSession.updated_at.desc())
        .limit(80)
        .all()
    )

    misses: list[tuple[Question, dict]] = []
    for session in sessions:
        answers = json.loads(session.answers or "{}")
        for qid_str, ans in answers.items():
            if ans.get("is_correct"):
                continue
            q = db.query(Question).filter(Question.id == str(qid_str)).first()
            if q and q.exam == EXAM:
                misses.append((q, ans))
            if len(misses) >= limit * 3:
                break
        if len(misses) >= limit * 3:
            break

    created = 0
    seen_front = set()
    for q, _ans in misses:
        if created >= limit:
            break
        meta = _patent_meta(q)
        front = (q.stem or "")[:320].strip()
        if not front or front in seen_front:
            continue
        seen_front.add(front)
        back_parts = [q.explanation or "", ""]
        if meta.get("mpep_chapter"):
            back_parts.append(f"MPEP Ch. {meta['mpep_chapter']}")
        if meta.get("statute"):
            back_parts.append(str(meta["statute"]))
        back = "\n".join([p for p in back_parts if p])[:8000]

        tags = {
            "mpep_chapter": meta.get("mpep_chapter"),
            "statute": meta.get("statute"),
            "patent_topic": meta.get("topic"),
            "source": "qbank_miss",
            "question_id": str(q.id),
        }
        card = Flashcard(
            exam_type=EXAM,
            section_id=meta.get("mpep_chapter") or q.section,
            topic=meta.get("topic"),
            front=front,
            back=back,
            hint=None,
            tags=json.dumps(tags),
            difficulty="medium",
            created_by=user_id,
        )
        db.add(card)
        created += 1

    db.commit()
    return {"created": created}


@router.get("/review-queue")
def review_queue(
    user_id: str = Query("demo_user"),
    limit: int = Query(30),
    db: Session = Depends(get_db),
):
    """Due flashcards that carry MPEP/statute tags (miss-driven SRS)."""
    now = datetime.utcnow()
    limit = min(limit, 100)

    q = (
        db.query(Flashcard, FlashcardProgress)
        .join(FlashcardProgress, FlashcardProgress.flashcard_id == Flashcard.id)
        .filter(
            Flashcard.exam_type == EXAM,
            FlashcardProgress.user_id == user_id,
            FlashcardProgress.next_review <= now,
        )
    )
    rows = q.order_by(FlashcardProgress.next_review).limit(limit * 2).all()

    anchored = []
    for card, prog in rows:
        raw = card.tags or ""
        try:
            t = json.loads(raw)
        except Exception:
            t = {}
        if isinstance(t, dict) and (t.get("mpep_chapter") or t.get("statute") or t.get("source") == "qbank_miss"):
            anchored.append(
                {
                    "id": card.id,
                    "front": card.front,
                    "back": card.back,
                    "tags": t,
                    "progress": {
                        "next_review": prog.next_review.isoformat() if prog.next_review else None,
                        "interval_days": prog.interval_days,
                    },
                }
            )
        if len(anchored) >= limit:
            break

    return {"cards": anchored, "total": len(anchored)}


# ── Live instruction (office hours & cohorts) ──────────────────

_DEFAULT_OFFICE_HOURS = [
    {
        "label": "MPEP navigation & search",
        "cadence": "Weekly (day TBD)",
        "time_local": "—",
        "topic_focus": "High-yield chapters 700, 2100; exam-style search drills.",
        "duration_min": 60,
        "sort_order": 0,
    },
    {
        "label": "Prosecution Q&A",
        "cadence": "Weekly (day TBD)",
        "time_local": "—",
        "topic_focus": "OA responses, restriction, appeals overview.",
        "duration_min": 60,
        "sort_order": 1,
    },
    {
        "label": "Open floor",
        "cadence": "Biweekly (TBD)",
        "time_local": "—",
        "topic_focus": "Bring missed QBank topics; live MPEP lookups.",
        "duration_min": 45,
        "sort_order": 2,
    },
]

_DEFAULT_COHORTS = [
    {
        "name": "12-week Patent Bar sprint",
        "description": "Structured syllabus aligned to EUREKA topic map; peer accountability checkpoints.",
        "weeks_planned": 12,
        "start_window": "Rolling — enroll when cohort opens",
        "capacity_planned": 40,
        "sort_order": 0,
    },
    {
        "name": "Mock exam weekends",
        "description": "Timed blocks + debrief; mirrors Prometric-style pacing.",
        "weeks_planned": 2,
        "start_window": "Before each exam window — TBD",
        "capacity_planned": None,
        "sort_order": 1,
    },
]


def _ensure_patent_live_seed(db: Session) -> None:
    """Insert default slots/cohorts once per empty table for PATENT_BAR."""
    n_oh = db.query(PatentOfficeHoursSlot).filter(PatentOfficeHoursSlot.exam_type == EXAM).count()
    if n_oh == 0:
        for row in _DEFAULT_OFFICE_HOURS:
            db.add(
                PatentOfficeHoursSlot(
                    id=str(uuid.uuid4()),
                    exam_type=EXAM,
                    label=row["label"],
                    cadence=row["cadence"],
                    time_local=row["time_local"],
                    topic_focus=row["topic_focus"],
                    duration_min=row["duration_min"],
                    sort_order=row["sort_order"],
                    is_published=True,
                )
            )
    n_c = db.query(PatentCohort).filter(PatentCohort.exam_type == EXAM).count()
    if n_c == 0:
        for row in _DEFAULT_COHORTS:
            db.add(
                PatentCohort(
                    id=str(uuid.uuid4()),
                    exam_type=EXAM,
                    name=row["name"],
                    description=row["description"],
                    weeks_planned=row["weeks_planned"],
                    start_window=row["start_window"],
                    capacity_planned=row["capacity_planned"],
                    enrolled_count=0,
                    enrollment_open=True,
                    sort_order=row["sort_order"],
                    is_published=True,
                )
            )
    if n_oh == 0 or n_c == 0:
        db.commit()


@router.get("/live/office-hours")
def list_office_hours(db: Session = Depends(get_db)):
    """Published office hour slot definitions (recurring / template rows)."""
    _ensure_patent_live_seed(db)
    rows = (
        db.query(PatentOfficeHoursSlot)
        .filter(
            PatentOfficeHoursSlot.exam_type == EXAM,
            PatentOfficeHoursSlot.is_published == True,
        )
        .order_by(PatentOfficeHoursSlot.sort_order, PatentOfficeHoursSlot.label)
        .all()
    )
    return {
        "exam_type": EXAM,
        "scheduling_connected": True,
        "slots": [
            {
                "id": r.id,
                "label": r.label,
                "cadence": r.cadence,
                "time_local": r.time_local,
                "topic_focus": r.topic_focus,
                "duration_min": r.duration_min,
                "join_url": r.join_url,
                "next_occurrence_at": r.next_occurrence_at.isoformat() if r.next_occurrence_at else None,
            }
            for r in rows
        ],
    }


@router.get("/live/cohorts")
def list_cohorts(db: Session = Depends(get_db)):
    """Published cohort tracks with capacity hints."""
    _ensure_patent_live_seed(db)
    rows = (
        db.query(PatentCohort)
        .filter(
            PatentCohort.exam_type == EXAM,
            PatentCohort.is_published == True,
        )
        .order_by(PatentCohort.sort_order, PatentCohort.name)
        .all()
    )
    return {
        "exam_type": EXAM,
        "cohorts": [
            {
                "id": r.id,
                "name": r.name,
                "description": r.description,
                "weeks_planned": r.weeks_planned,
                "start_window": r.start_window,
                "capacity_planned": r.capacity_planned,
                "enrolled_count": r.enrolled_count or 0,
                "enrollment_open": bool(r.enrollment_open),
            }
            for r in rows
        ],
    }

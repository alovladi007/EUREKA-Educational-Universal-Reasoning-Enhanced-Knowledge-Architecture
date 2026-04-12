"""
CISSP QBank API — works with the actual PostgreSQL schema.

The main qbank.py uses an ORM model (Question) whose columns (stem, choices,
correct_index, exam, section) don't match the actual PostgreSQL schema
(question_text, answer_options, correct_answer jsonb, tags jsonb). This module
provides CISSP-specific endpoints using raw SQL against the real schema.

The frontend QBankTab calls the same /qbank/* URL paths; the main qbank router
dispatches to this module when exam_type == "CISSP".
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session as DBSession
from sqlalchemy import text
from typing import Optional
from datetime import datetime
import json, random, uuid

from app.core.database import get_db

router = APIRouter()

CISSP_ASSESSMENT_ID = "a1550000-0000-0000-0000-000000000001"

# Section ID → display name mapping
SECTION_NAME_MAP = {
    "security_risk": "Security & Risk Management",
    "asset_security": "Asset Security",
    "security_architecture": "Security Architecture & Engineering",
    "comm_network": "Communication & Network Security",
    "iam": "Identity & Access Management (IAM)",
    "security_assessment": "Security Assessment & Testing",
    "security_operations": "Security Operations",
    "software_security": "Software Development Security",
}


def _fetch_cissp_questions(db: DBSession, section_ids: list = None,
                           difficulty: str = None) -> list:
    """Fetch CISSP questions from PostgreSQL using raw SQL."""
    sql = """
        SELECT id, question_text, answer_options, correct_answer,
               explanation, difficulty, tags, metadata
        FROM questions
        WHERE assessment_id = :aid
    """
    params = {"aid": CISSP_ASSESSMENT_ID}

    if section_ids:
        # Filter by section names matching the section_ids
        section_names = [SECTION_NAME_MAP.get(sid, sid) for sid in section_ids]
        # Use jsonb contains for each section name
        placeholders = []
        for i, name in enumerate(section_names):
            key = f"sec_{i}"
            placeholders.append(f"tags->>'section' = :{key}")
            params[key] = name
        if placeholders:
            sql += " AND (" + " OR ".join(placeholders) + ")"

    if difficulty:
        sql += " AND difficulty = :diff"
        params["diff"] = difficulty

    result = db.execute(text(sql), params)
    rows = result.fetchall()

    questions = []
    for row in rows:
        tags = row[6] if isinstance(row[6], dict) else json.loads(row[6]) if row[6] else {}
        meta = row[7] if isinstance(row[7], dict) else json.loads(row[7]) if row[7] else {}
        options = row[2] if isinstance(row[2], list) else json.loads(row[2]) if row[2] else []
        correct = row[3] if isinstance(row[3], dict) else json.loads(row[3]) if row[3] else {}

        questions.append({
            "id": str(row[0]),
            "question_text": row[1],
            "options": [{"index": o.get("index", i), "text": o.get("text", "")}
                        for i, o in enumerate(options)],
            "correct_index": correct.get("index", 0),
            "explanation": row[4],
            "difficulty_label": row[5],
            "section": tags.get("section", ""),
            "topic": tags.get("sub_objective", ""),
            "tags": tags,
            "metadata": meta,
        })

    return questions


# ── In-memory session store (simple, no ORM dependency) ────────

_sessions: dict = {}


@router.post("/cissp/sessions")
def create_cissp_session(data: dict, db: DBSession = Depends(get_db)):
    """Create a CISSP QBank session."""
    mode = data.get("mode", "tutor")
    section_ids = data.get("section_ids", [])
    difficulty = data.get("difficulty")
    count = min(data.get("question_count", 20), 200)

    questions = _fetch_cissp_questions(db, section_ids, difficulty)
    if not questions:
        raise HTTPException(404, "No CISSP questions found")

    selected = random.sample(questions, min(count, len(questions)))
    session_id = str(uuid.uuid4())

    _sessions[session_id] = {
        "id": session_id,
        "mode": mode,
        "questions": selected,
        "answers": {},
        "correct_count": 0,
        "questions_answered": 0,
        "total_time": 0,
        "is_complete": False,
        "started_at": datetime.utcnow().isoformat(),
    }

    first_q = selected[0] if selected else None
    return {
        "session_id": session_id,
        "mode": mode,
        "question_count": len(selected),
        "current_index": 0,
        "question": _format_question(first_q, mode) if first_q else None,
    }


@router.get("/cissp/sessions/{session_id}/question/{index}")
def get_cissp_question(session_id: str, index: int):
    """Get a CISSP question by index."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    questions = session["questions"]
    if index < 0 or index >= len(questions):
        raise HTTPException(400, "Index out of range")

    q = questions[index]
    prev = session["answers"].get(q["id"])

    return {
        "index": index,
        "total": len(questions),
        "question": _format_question(q, session["mode"]),
        "previous_answer": prev,
        "is_last": index == len(questions) - 1,
    }


@router.post("/cissp/sessions/{session_id}/answer")
def submit_cissp_answer(session_id: str, data: dict):
    """Submit a CISSP answer."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found")
    if session["is_complete"]:
        raise HTTPException(400, "Session already completed")

    question_id = data["question_id"]
    answer_index = data["answer_index"]
    time_spent = data.get("time_spent_seconds", 0)

    # Find the question
    q = next((q for q in session["questions"] if q["id"] == question_id), None)
    if not q:
        raise HTTPException(404, "Question not found in session")

    is_correct = answer_index == q["correct_index"]

    already_answered = question_id in session["answers"]
    session["answers"][question_id] = {
        "answer_index": answer_index,
        "is_correct": is_correct,
        "time_spent": time_spent,
    }

    if not already_answered:
        session["questions_answered"] += 1
        if is_correct:
            session["correct_count"] += 1

    session["total_time"] += time_spent

    answered = session["questions_answered"]
    score = round((session["correct_count"] / answered * 100), 1) if answered > 0 else 0

    result = {
        "is_correct": is_correct,
        "correct_index": q["correct_index"],
        "score_percent": score,
        "questions_answered": answered,
        "correct_count": session["correct_count"],
    }

    if session["mode"] == "tutor":
        result["explanation"] = q["explanation"]

    return result


@router.post("/cissp/sessions/{session_id}/complete")
def complete_cissp_session(session_id: str):
    """Complete a CISSP session."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    session["is_complete"] = True
    answered = session["questions_answered"]
    score = round((session["correct_count"] / answered * 100), 1) if answered > 0 else 0

    review = []
    for q in session["questions"]:
        ans = session["answers"].get(q["id"], {})
        review.append({
            "question_id": q["id"],
            "question_text": q["question_text"],
            "topic": q.get("topic", ""),
            "section": q.get("section", ""),
            "your_answer": ans.get("answer_index"),
            "correct_index": q["correct_index"],
            "is_correct": ans.get("is_correct", False),
            "time_spent": ans.get("time_spent", 0),
            "explanation": q["explanation"],
        })

    return {
        "session_id": session_id,
        "score_percent": score,
        "questions_answered": answered,
        "correct_count": session["correct_count"],
        "total_questions": len(session["questions"]),
        "total_time_seconds": session["total_time"],
        "is_complete": True,
        "review": review,
    }


@router.get("/cissp/stats")
def get_cissp_stats(db: DBSession = Depends(get_db)):
    """Get CISSP question bank stats."""
    result = db.execute(text("""
        SELECT
            tags->>'section' as section,
            COUNT(*) as count
        FROM questions
        WHERE assessment_id = :aid
        GROUP BY tags->>'section'
        ORDER BY tags->>'section'
    """), {"aid": CISSP_ASSESSMENT_ID})

    sections = [{"section": row[0], "count": row[1]} for row in result]
    total = sum(s["count"] for s in sections)

    return {
        "exam_type": "CISSP",
        "total_questions": total,
        "sections": sections,
    }


def _format_question(q: dict, mode: str) -> dict:
    """Format a question for the frontend."""
    d = {
        "id": q["id"],
        "question_text": q["question_text"],
        "topic": q.get("topic", ""),
        "section": q.get("section", ""),
        "difficulty_label": q.get("difficulty_label", "medium"),
        "options": q["options"],
    }
    if mode == "review":
        d["correct_index"] = q["correct_index"]
        d["explanation"] = q["explanation"]
    return d

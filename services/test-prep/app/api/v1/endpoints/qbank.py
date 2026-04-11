"""
QBank API — create sessions, answer questions, get results
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import datetime
import json, random

from app.core.database import get_db
from app.models.question import Question
from app.models.qbank_session import QBankSession

router = APIRouter()


def _parse_q_tags(question: Question) -> dict:
    if not question.tags:
        return {}
    try:
        data = json.loads(question.tags)
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def _patent_matches_filters(question: Question, patent_filters: dict) -> bool:
    """Optional filters for PATENT_BAR items (tags JSON). Untagged questions pass content/format filters."""
    if not patent_filters:
        return True
    meta = _parse_q_tags(question)

    if patent_filters.get("aia_era"):
        want = patent_filters["aia_era"]
        got = meta.get("aia_era")
        if got and got != want:
            return False

    cts = patent_filters.get("content_types")
    if cts:
        ct = meta.get("content_type")
        if ct and ct not in cts:
            return False

    fts = patent_filters.get("question_formats")
    if fts:
        qf = meta.get("question_format")
        if qf and qf not in fts:
            return False

    traps = patent_filters.get("trap_types")
    if traps:
        tr = meta.get("trap_type")
        if tr and tr not in traps:
            return False

    return True


# ── Session lifecycle ──────────────────────────────────────────

@router.post("/sessions")
def create_session(data: dict, db: Session = Depends(get_db)):
    """Start a new QBank practice session."""
    exam_type = data["exam_type"]
    mode = data.get("mode", "tutor")
    section_ids = data.get("section_ids", [])
    topics = data.get("topics", [])
    difficulty = data.get("difficulty")
    count = min(data.get("question_count", 20), 100)
    time_limit = data.get("time_limit_seconds")
    patent_filters = data.get("patent_filters") or {}

    # Build question query
    q = db.query(Question).filter(Question.exam == exam_type)
    if section_ids:
        q = q.filter(Question.section.in_(section_ids))
    if topics:
        q = q.filter(Question.topic.in_(topics))
    if difficulty:
        q = q.filter(Question.difficulty_label == difficulty)

    available = q.all()
    if exam_type == "PATENT_BAR" and patent_filters:
        available = [qn for qn in available if _patent_matches_filters(qn, patent_filters)]
    if not available:
        raise HTTPException(404, f"No questions found for {exam_type}")

    selected = random.sample(available, min(count, len(available)))
    question_ids = [str(qn.id) for qn in selected]

    session = QBankSession(
        user_id=data.get("user_id", "demo_user"),
        exam_type=exam_type,
        mode=mode,
        section_ids=json.dumps(section_ids),
        topic_filter=json.dumps(topics),
        difficulty_filter=difficulty,
        question_count=len(question_ids),
        time_limit_seconds=time_limit,
        question_order=json.dumps(question_ids),
        answers=json.dumps({}),
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    first_q = selected[0] if selected else None
    return {
        "session_id": session.id,
        "mode": mode,
        "question_count": len(question_ids),
        "time_limit_seconds": time_limit,
        "current_index": 0,
        "question": _question_for_session(first_q, mode) if first_q else None,
    }


@router.get("/sessions/{session_id}")
def get_session(session_id: str, db: Session = Depends(get_db)):
    session = _get_session(session_id, db)
    return _session_dict(session)


@router.get("/sessions/{session_id}/question/{index}")
def get_question_at_index(session_id: str, index: int, db: Session = Depends(get_db)):
    """Get a specific question by index in the session."""
    session = _get_session(session_id, db)
    order = json.loads(session.question_order or "[]")
    if index < 0 or index >= len(order):
        raise HTTPException(400, "Index out of range")

    question_id = order[index]
    question = db.query(Question).filter(Question.id == str(question_id)).first()
    if not question:
        raise HTTPException(404, "Question not found")

    answers = json.loads(session.answers or "{}")
    prev_answer = answers.get(question_id)

    session.current_question_index = index
    db.commit()

    return {
        "index": index,
        "total": len(order),
        "question": _question_for_session(question, session.mode),
        "previous_answer": prev_answer,
        "is_last": index == len(order) - 1,
    }


@router.post("/sessions/{session_id}/answer")
def submit_answer(session_id: str, data: dict, db: Session = Depends(get_db)):
    """Submit an answer for a question in the session."""
    session = _get_session(session_id, db)
    if session.is_complete:
        raise HTTPException(400, "Session already completed")

    question_id = str(data["question_id"])
    answer_index = data["answer_index"]
    time_spent = data.get("time_spent_seconds", 0)
    flagged = data.get("flagged", False)

    question = db.query(Question).filter(Question.id == str(question_id)).first()
    if not question:
        raise HTTPException(404, "Question not found")

    is_correct = answer_index == question.correct_index

    answers = json.loads(session.answers or "{}")
    already_answered = question_id in answers
    answers[question_id] = {
        "answer_index": answer_index,
        "is_correct": is_correct,
        "time_spent": time_spent,
        "flagged": flagged,
    }
    session.answers = json.dumps(answers)

    if not already_answered:
        session.questions_answered += 1
        if is_correct:
            session.correct_count += 1
        else:
            session.incorrect_count += 1
    else:
        old = answers.get(question_id, {})
        if old.get("is_correct") != is_correct:
            if is_correct:
                session.correct_count += 1
                session.incorrect_count = max(0, session.incorrect_count - 1)
            else:
                session.incorrect_count += 1
                session.correct_count = max(0, session.correct_count - 1)

    session.total_time_seconds += time_spent
    if session.questions_answered > 0:
        session.avg_time_per_question = session.total_time_seconds / session.questions_answered
        session.score_percent = round((session.correct_count / session.questions_answered) * 100, 1)

    if flagged:
        session.flagged_count = sum(1 for a in answers.values() if a.get("flagged"))

    session.updated_at = datetime.utcnow()
    db.commit()

    result = {
        "is_correct": is_correct,
        "correct_index": question.correct_index,
        "score_percent": session.score_percent,
        "questions_answered": session.questions_answered,
        "correct_count": session.correct_count,
    }
    if session.mode == "tutor":
        result["explanation"] = question.explanation
        if question.exam == "PATENT_BAR":
            pm = _patent_meta(question)
            result["patent"] = {
                "aia_era": pm.get("aia_era"),
                "content_type": pm.get("content_type"),
                "trap_type": pm.get("trap_type"),
                "mpep_revision_reviewed": pm.get("mpep_revision_reviewed"),
                "correct_rule_cite": pm.get("correct_rule_cite"),
                "mpep_chapter": pm.get("mpep_chapter"),
                "statute_section": pm.get("statute_section"),
            }
            if not is_correct and pm.get("distractor_explanations"):
                de = pm["distractor_explanations"]
                key = str(answer_index)
                if isinstance(de, dict) and key in de:
                    result["why_wrong_mpep"] = de[key]

    return result


@router.post("/sessions/{session_id}/complete")
def complete_session(session_id: str, db: Session = Depends(get_db)):
    """Mark a session as complete and return final results."""
    session = _get_session(session_id, db)
    session.is_complete = True
    session.completed_at = datetime.utcnow()
    if session.questions_answered > 0:
        session.score_percent = round((session.correct_count / session.questions_answered) * 100, 1)
    db.commit()
    return _session_results(session, db)


# ── History ────────────────────────────────────────────────────

@router.get("/history")
def get_history(
    exam_type: str = Query(...),
    user_id: str = Query("demo_user"),
    limit: int = 20,
    db: Session = Depends(get_db),
):
    sessions = db.query(QBankSession).filter(
        QBankSession.user_id == user_id,
        QBankSession.exam_type == exam_type,
        QBankSession.is_complete == True,
    ).order_by(QBankSession.completed_at.desc()).limit(limit).all()

    return {
        "sessions": [_session_dict(s) for s in sessions],
        "total": len(sessions),
    }


# ── Topic stats ────────────────────────────────────────────────

@router.get("/stats")
def get_qbank_stats(
    exam_type: str = Query(...),
    user_id: str = Query("demo_user"),
    db: Session = Depends(get_db),
):
    total_questions = db.query(func.count(Question.id)).filter(
        Question.exam == exam_type
    ).scalar() or 0

    sections = db.query(Question.section, func.count(Question.id)).filter(
        Question.exam == exam_type
    ).group_by(Question.section).all()

    completed_sessions = db.query(func.count(QBankSession.id)).filter(
        QBankSession.user_id == user_id,
        QBankSession.exam_type == exam_type,
        QBankSession.is_complete == True,
    ).scalar() or 0

    avg_score = db.query(func.avg(QBankSession.score_percent)).filter(
        QBankSession.user_id == user_id,
        QBankSession.exam_type == exam_type,
        QBankSession.is_complete == True,
    ).scalar()

    return {
        "exam_type": exam_type,
        "total_questions": total_questions,
        "sections": [{"section": s, "count": c} for s, c in sections],
        "completed_sessions": completed_sessions,
        "avg_score_percent": round(avg_score, 1) if avg_score else None,
    }


# ── Helpers ────────────────────────────────────────────────────

def _get_session(session_id: str, db: Session) -> QBankSession:
    session = db.query(QBankSession).filter(QBankSession.id == session_id).first()
    if not session:
        raise HTTPException(404, "Session not found")
    return session


def _patent_meta(q: Question) -> dict:
    meta = _parse_q_tags(q)
    sec = q.section or ""
    mpep_chapter = meta.get("mpep_chapter") or meta.get("mpep")
    if mpep_chapter is None and sec.isdigit():
        mpep_chapter = sec
    statute = meta.get("statute") or meta.get("statute_section") or meta.get("usc")
    topic = meta.get("patent_topic") or meta.get("topic_label") or q.topic
    distr = meta.get("distractor_explanations") or meta.get("wrong_choice_mpep")
    return {
        "mpep_chapter": str(mpep_chapter) if mpep_chapter is not None else None,
        "statute_section": str(statute) if statute is not None else None,
        "patent_topic": topic,
        "mpep_anchor": meta.get("mpep_anchor") or meta.get("anchor"),
        "aia_era": meta.get("aia_era") or "post_aia",
        "content_type": meta.get("content_type") or "procedure",
        "trap_type": meta.get("trap_type"),
        "question_format": meta.get("question_format") or "standard_mcq",
        "mpep_revision_reviewed": meta.get("mpep_revision_reviewed") or "R-01.2024",
        "oed_style": bool(meta.get("oed_style", False)),
        "distractor_explanations": distr if isinstance(distr, dict) else None,
        "correct_rule_cite": meta.get("correct_rule_cite"),
    }


def _question_for_session(q: Question, mode: str) -> dict:
    options = []
    try:
        raw = json.loads(q.choices) if isinstance(q.choices, str) else q.choices
        if isinstance(raw, list):
            options = [{"index": i, "text": (o.get("text", o) if isinstance(o, dict) else str(o))}
                       for i, o in enumerate(raw)]
    except Exception:
        pass

    d = {
        "id": q.id,
        "question_text": q.stem,
        "topic": q.topic,
        "section": q.section,
        "subtopic": q.subtopic,
        "difficulty_label": q.difficulty_label,
        "options": options,
    }
    if q.exam == "PATENT_BAR":
        pm = _patent_meta(q)
        if mode not in ("review",) and pm.get("distractor_explanations") is not None:
            pm = {k: v for k, v in pm.items() if k != "distractor_explanations"}
        d["patent"] = pm
    if mode == "review":
        d["correct_index"] = q.correct_index
        d["explanation"] = q.explanation
    return d


def _session_dict(s: QBankSession) -> dict:
    return {
        "id": s.id,
        "exam_type": s.exam_type,
        "mode": s.mode,
        "question_count": s.question_count,
        "questions_answered": s.questions_answered,
        "correct_count": s.correct_count,
        "incorrect_count": s.incorrect_count,
        "skipped_count": s.skipped_count,
        "flagged_count": s.flagged_count,
        "score_percent": s.score_percent,
        "total_time_seconds": s.total_time_seconds,
        "avg_time_per_question": s.avg_time_per_question,
        "time_limit_seconds": s.time_limit_seconds,
        "is_complete": s.is_complete,
        "current_question_index": s.current_question_index,
        "started_at": s.started_at.isoformat() if s.started_at else None,
        "completed_at": s.completed_at.isoformat() if s.completed_at else None,
    }


def _session_results(s: QBankSession, db: Session) -> dict:
    d = _session_dict(s)
    answers = json.loads(s.answers or "{}")
    order = json.loads(s.question_order or "[]")

    review = []
    for qid in order:
        question = db.query(Question).filter(Question.id == str(qid)).first()
        answer_data = answers.get(str(qid), answers.get(qid, {}))
        if question:
            row = {
                "question_id": question.id,
                "question_text": question.stem,
                "topic": question.topic,
                "your_answer": answer_data.get("answer_index"),
                "correct_index": question.correct_index,
                "is_correct": answer_data.get("is_correct", False),
                "time_spent": answer_data.get("time_spent", 0),
                "flagged": answer_data.get("flagged", False),
                "explanation": question.explanation,
            }
            if question.exam == "PATENT_BAR":
                row["patent"] = _patent_meta(question)
            review.append(row)
    d["review"] = review
    return d

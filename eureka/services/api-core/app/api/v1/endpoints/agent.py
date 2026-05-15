"""
Agent (AI tutor) endpoints — Phase 6 Sessions 6.1 + 6.2 + 6.3 + 6.4.

Mounted under /api/v1.

Sessions
  POST   /agent/sessions                          start a tutor session
  GET    /agent/sessions/me                       list current user's sessions
  GET    /agent/sessions/{id}                     fetch one + recent messages
  POST   /agent/sessions/{id}/end                 mark completed

Turn (the core)
  POST   /agent/sessions/{id}/turn                send a user message;
                                                  returns assistant turn + traces

Tracing / introspection
  GET    /agent/sessions/{id}/messages            paginated message log
  GET    /agent/sessions/{id}/traces              tool-call audit trail

Anti-hallucination
  POST   /agent/messages/{message_id}/flag        learner-reported issue

RAG ops (admin / system)
  POST   /agent/rag/ingest                        re-index item bank + skills
  GET    /agent/rag/retrieve                      raw hybrid retrieval probe
"""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.agent import (
    AgentMessage, AgentMode, AgentSession, AgentSessionStatus, AgentTrace,
    FlaggedResponse,
)
from app.models.user import User
from app.schemas.agent import (
    FlagCreate, FlagResponse, MessageResponse, SessionCreate, SessionResponse,
    TraceResponse, TurnRequest, TurnResponse,
)
from app.services.rag import (
    ingest_item_bank, ingest_skill_graph, retrieve as rag_retrieve,
)
from app.services.tutor_agent import build_system_prompt, turn as run_turn
from app.utils.dependencies import get_current_user


router = APIRouter()


# ---------------------------------------------------------------------------
# Sessions
# ---------------------------------------------------------------------------


@router.post("/agent/sessions", response_model=SessionResponse, status_code=201)
async def start_session(
    payload: SessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AgentSession:
    from app.models.skill import Skill
    skill = None
    if payload.skill_id:
        skill = await db.get(Skill, payload.skill_id)
        if skill is None:
            raise HTTPException(status_code=404, detail="skill not found")

    session = AgentSession(
        user_id=current_user.id,
        skill_id=payload.skill_id,
        item_id=payload.item_id,
        mode=payload.mode,
        status=AgentSessionStatus.ACTIVE,
    )
    # Snapshot the system prompt for reproducibility
    session.system_prompt = build_system_prompt(session, skill)
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


@router.get("/agent/sessions/me", response_model=list[SessionResponse])
async def list_my_sessions(
    status_filter: AgentSessionStatus | None = None,
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AgentSession]:
    stmt = select(AgentSession).where(AgentSession.user_id == current_user.id)
    if status_filter:
        stmt = stmt.where(AgentSession.status == status_filter)
    stmt = stmt.order_by(AgentSession.started_at.desc()).limit(limit)
    r = await db.execute(stmt)
    return list(r.scalars().all())


@router.get("/agent/sessions/{session_id}", response_model=SessionResponse)
async def get_session(
    session_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AgentSession:
    s = await db.get(AgentSession, session_id)
    if s is None or s.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="session not found")
    return s


@router.post("/agent/sessions/{session_id}/end", response_model=SessionResponse)
async def end_session(
    session_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AgentSession:
    from datetime import datetime
    s = await db.get(AgentSession, session_id)
    if s is None or s.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="session not found")
    s.status = AgentSessionStatus.COMPLETED
    s.ended_at = datetime.utcnow()
    await db.commit()
    await db.refresh(s)
    return s


# ---------------------------------------------------------------------------
# Turn — the actual tutoring loop
# ---------------------------------------------------------------------------


@router.post("/agent/sessions/{session_id}/turn", response_model=TurnResponse)
async def session_turn(
    session_id: UUID,
    payload: TurnRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TurnResponse:
    s = await db.get(AgentSession, session_id)
    if s is None or s.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="session not found")
    if s.status != AgentSessionStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="session is not active")

    out = await run_turn(db, session=s, user=current_user, user_message=payload.message)

    return TurnResponse(
        session_id=session_id,
        message=MessageResponse.model_validate(out.assistant_message),
        hint_level=out.hint_level,
        groundedness_score=out.groundedness_score,
        traces=[TraceResponse.model_validate(t) for t in out.tool_traces],
    )


# ---------------------------------------------------------------------------
# Introspection
# ---------------------------------------------------------------------------


@router.get("/agent/sessions/{session_id}/messages", response_model=list[MessageResponse])
async def session_messages(
    session_id: UUID,
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AgentMessage]:
    s = await db.get(AgentSession, session_id)
    if s is None or s.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="session not found")
    r = await db.execute(
        select(AgentMessage)
        .where(AgentMessage.session_id == session_id)
        .order_by(AgentMessage.created_at)
        .limit(limit)
    )
    return list(r.scalars().all())


@router.get("/agent/sessions/{session_id}/traces", response_model=list[TraceResponse])
async def session_traces(
    session_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AgentTrace]:
    s = await db.get(AgentSession, session_id)
    if s is None or s.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="session not found")
    r = await db.execute(
        select(AgentTrace)
        .where(AgentTrace.session_id == session_id)
        .order_by(AgentTrace.created_at)
    )
    return list(r.scalars().all())


# ---------------------------------------------------------------------------
# Flagging (6.4)
# ---------------------------------------------------------------------------


@router.post("/agent/messages/{message_id}/flag", response_model=FlagResponse, status_code=201)
async def flag_message(
    message_id: UUID,
    payload: FlagCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FlaggedResponse:
    msg = await db.get(AgentMessage, message_id)
    if msg is None:
        raise HTTPException(status_code=404, detail="message not found")
    # Verify caller owns the session (no cross-user flagging)
    session = await db.get(AgentSession, msg.session_id)
    if session is None or session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="message not found")
    flag = FlaggedResponse(
        message_id=message_id,
        reporter_user_id=current_user.id,
        kind=payload.kind,
        learner_note=payload.learner_note,
    )
    db.add(flag)
    await db.commit()
    await db.refresh(flag)
    return flag


# ---------------------------------------------------------------------------
# RAG ops
# ---------------------------------------------------------------------------


@router.post("/agent/rag/ingest", response_model=dict)
async def rag_ingest(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Walk the item bank + skill graph and write knowledge_chunks.
    Idempotent on source_uri. Admin-only in practice; for now: any
    authenticated user (we'll role-gate in 6.4b)."""
    items = await ingest_item_bank(db)
    skills = await ingest_skill_graph(db)
    await db.commit()
    return {"item_chunks_upserted": items, "skill_chunks_upserted": skills}


@router.get("/agent/rag/retrieve", response_model=list[dict])
async def rag_retrieve_probe(
    q: str = Query(..., min_length=2),
    framework: str | None = None,
    skill_id: UUID | None = None,
    limit: int = Query(8, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[dict]:
    """Raw retrieval probe — what would the tutor see for this query?"""
    chunks = await rag_retrieve(
        db, query=q, framework_filter=framework, skill_id=skill_id, limit=limit
    )
    return [c.to_citation() | {"score": round(c.score, 4),
                                 "keyword_rank": c.keyword_rank,
                                 "semantic_rank": c.semantic_rank} for c in chunks]

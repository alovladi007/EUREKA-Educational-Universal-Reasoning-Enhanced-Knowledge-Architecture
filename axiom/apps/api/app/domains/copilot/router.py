"""Copilot routes: hints, explanations, and grounded tutoring chat.

Every response is explicitly AI-assisted (ai_generated is true) and carries the
curriculum sources it was grounded in, so a teacher can audit and override it.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from shared_schemas.identity import UserOut
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user, require_roles
from app.domains.copilot import generation as gen
from app.domains.copilot import service as svc
from app.domains.copilot.service import _resolve_node

router = APIRouter(prefix="/copilot", tags=["copilot"])

author_only = require_roles("teacher", "org_admin", "super_admin", "author")


class HintRequest(BaseModel):
    node: str | None = None
    response_token: str | None = None
    question: str = ""


class ProofTutorRequest(BaseModel):
    node: str | None = None
    response_token: str | None = None
    draft: str = ""
    level: int = 0


class ExplainRequest(BaseModel):
    node: str
    question: str = ""


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    node: str | None = None


@router.post("/hint", summary="A scaffolded hint that does not reveal the answer")
async def hint(
    body: HintRequest,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    result = await svc.hint(
        session,
        uuid.UUID(user.id),
        node_ref=body.node,
        response_token=body.response_token,
        question=body.question,
    )
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/proof-tutor", summary="Graduated Socratic proof hints and gap detection")
async def proof_tutor(
    body: ProofTutorRequest,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    result = await svc.proof_tutor(
        session,
        uuid.UUID(user.id),
        node_ref=body.node,
        response_token=body.response_token,
        draft=body.draft,
        level=body.level,
    )
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/explain", summary="Explain a concept grounded in lesson material")
async def explain(
    body: ExplainRequest,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    result = await svc.explain(
        session, uuid.UUID(user.id), node_ref=body.node, question=body.question
    )
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/chat", summary="One grounded tutoring chat turn")
async def chat(
    body: ChatRequest,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    if not body.message.strip():
        raise HTTPException(status_code=400, detail="message is empty")
    result = await svc.chat(
        session,
        uuid.UUID(user.id),
        message=body.message,
        session_id=body.session_id,
        node_ref=body.node,
    )
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.get("/sessions/{session_id}", summary="A tutoring session transcript")
async def session_history(
    session_id: str,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    result = await svc.get_session_history(session, uuid.UUID(user.id), session_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


# --- item generation with a human-review queue (author roles) ------------


class GenerateItemsRequest(BaseModel):
    node: str
    count: int = 3
    difficulty: float = 0.5


class ReviewRequest(BaseModel):
    action: str  # approve | reject


class TeacherAssistRequest(BaseModel):
    task: str  # draft_quiz | explain_errors | suggest_intervention
    node: str
    notes: str = ""


@router.post("/generate-items", summary="Generate CAS-verified candidate items (author)")
async def generate_items(
    body: GenerateItemsRequest,
    session: AsyncSession = Depends(get_session),
    author: UserOut = Depends(author_only),
) -> dict:
    node = await _resolve_node(session, body.node)
    if node is None:
        raise HTTPException(status_code=404, detail="node not found")
    count = max(1, min(body.count, 10))
    rows = await gen.generate_candidates(
        session,
        node_id=node.id,
        created_by=uuid.UUID(author.id),
        count=count,
        difficulty=body.difficulty,
    )
    await session.commit()
    return {
        "generated": len(rows),
        "candidates": [gen.candidate_to_dict(r) for r in rows],
    }


@router.get("/generated", summary="The pending item-generation review queue (author)")
async def generated_queue(
    status: str = "pending",
    session: AsyncSession = Depends(get_session),
    author: UserOut = Depends(author_only),
) -> dict:
    rows = await gen.list_queue(session, status=status)
    return {"candidates": [gen.candidate_to_dict(r) for r in rows]}


@router.post("/generated/{candidate_id}/review", summary="Approve or reject a candidate (author)")
async def review_generated(
    candidate_id: str,
    body: ReviewRequest,
    session: AsyncSession = Depends(get_session),
    author: UserOut = Depends(author_only),
) -> dict:
    try:
        parsed = uuid.UUID(candidate_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="invalid candidate id") from exc
    if body.action not in ("approve", "reject"):
        raise HTTPException(status_code=400, detail="action must be approve or reject")
    result = await gen.review_candidate(session, parsed, approve=body.action == "approve")
    if result is None:
        raise HTTPException(status_code=404, detail="candidate not found or not pending")
    await session.commit()
    return result


@router.post("/teacher-assist", summary="Teacher assistant, grounded and AI-assisted (author)")
async def teacher_assist(
    body: TeacherAssistRequest,
    session: AsyncSession = Depends(get_session),
    author: UserOut = Depends(author_only),
) -> dict:
    result = await svc.teacher_assist(
        session, uuid.UUID(author.id), task=body.task, node_ref=body.node, notes=body.notes
    )
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

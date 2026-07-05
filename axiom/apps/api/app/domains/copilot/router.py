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
from app.core.security import get_current_user
from app.domains.copilot import service as svc

router = APIRouter(prefix="/copilot", tags=["copilot"])


class HintRequest(BaseModel):
    node: str | None = None
    response_token: str | None = None
    question: str = ""


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

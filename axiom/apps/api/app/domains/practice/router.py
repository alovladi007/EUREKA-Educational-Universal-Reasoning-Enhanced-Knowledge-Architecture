"""Practice and diagnostic routes."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from shared_schemas.identity import UserOut
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user
from app.domains.curriculum.models import KnowledgeNode
from app.domains.practice.service import answer as answer_service
from app.domains.practice.service import (
    missed_questions,
    missed_summary,
    response_result,
    retry_missed,
    review_mistakes,
    serve_next,
)

router = APIRouter(tags=["practice"])


class NextRequest(BaseModel):
    node_id: str | None = None


class AnswerRequest(BaseModel):
    response_token: str
    answer: str


@router.post("/practice/next", summary="Serve the next practice question")
async def practice_next(
    body: NextRequest,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    node_id = None
    if body.node_id:
        node = (
            await session.execute(select(KnowledgeNode).where(KnowledgeNode.code == body.node_id))
        ).scalar_one_or_none()
        if node is not None:
            node_id = node.id
        else:
            try:
                node_id = uuid.UUID(body.node_id)
            except ValueError:
                node_id = None
    result = await serve_next(session, uuid.UUID(user.id), node_id)
    await session.commit()
    return result


@router.post("/practice/answer", summary="Grade a practice answer and update mastery")
async def practice_answer(
    body: AnswerRequest,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    return await answer_service(session, uuid.UUID(user.id), body.response_token, body.answer)


@router.get("/practice/mistakes", summary="My recent incorrect answers to review")
async def practice_mistakes(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    items = await review_mistakes(session, uuid.UUID(user.id))
    return {"items": items}


@router.get("/practice/response/{response_token}", summary="Grading status and result")
async def practice_response_result(
    response_token: str,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    """Poll a response's grading status. Used for AI free-response grades that
    are handed to the worker; returns status grading until the worker finishes,
    then the graded result."""
    return await response_result(session, uuid.UUID(user.id), response_token)


@router.post("/diagnostic/start", summary="Start a placement diagnostic")
async def diagnostic_start(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    """Serve one question per node that has content. Answering these through
    /practice/answer seeds mastery and produces a placement."""
    nodes = (
        (await session.execute(select(KnowledgeNode).order_by(KnowledgeNode.code))).scalars().all()
    )
    served: list[dict] = []
    for node in nodes:
        result = await serve_next(session, uuid.UUID(user.id), node.id)
        if not result.get("done"):
            served.append(result)
    await session.commit()
    return {"items": served, "count": len(served)}


@router.get("/review/missed", summary="My saved missed questions (save-and-redo)")
async def review_missed(
    status: str = "open",
    node: str | None = None,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> list[dict]:
    return await missed_questions(session, uuid.UUID(user.id), status=status, node_code=node)


@router.get("/review/summary", summary="Open miss counts by skill")
async def review_summary(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> list[dict]:
    return await missed_summary(session, uuid.UUID(user.id))


@router.post("/review/retry/{missed_id}", summary="Redo a missed question (exact variant, no answer leakage)")
async def review_retry(
    missed_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    result = await retry_missed(session, uuid.UUID(user.id), missed_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

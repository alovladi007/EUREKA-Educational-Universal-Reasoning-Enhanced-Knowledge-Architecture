"""Copilot routes: hints, explanations, and grounded tutoring chat.

Every response carries the curriculum sources it was grounded in, so a teacher
can audit and override it, and an `ai_generated` flag that says whether a
language model actually wrote the text. That flag used to be hardcoded true;
it is now reported by the provider, because with no model key configured the
reasoning service composes replies from passages and calling that AI
generation tells a learner something untrue.

Every model-spending endpoint is rate limited per user - see limits.py for why
the cap ships before the key does.
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
from app.domains.copilot import limits
from app.domains.copilot import service as svc
from app.domains.copilot.service import _resolve_node

router = APIRouter(prefix="/copilot", tags=["copilot"])

author_only = require_roles("teacher", "org_admin", "super_admin", "author")


async def _enforce(bucket: str, user: UserOut) -> None:
    """Count this call against the user's budget, or refuse with a 429.

    The refusal names the window and when it resets, because "try again later"
    without a number is not actionable.
    """
    decision = await limits.check(bucket, str(user.id))
    if not decision.allowed:
        raise HTTPException(
            status_code=429,
            detail=(
                f"Copilot limit reached: {decision.limit} {bucket} requests per "
                f"{limits.get_window_minutes()} minutes. Resets in "
                f"{decision.reset_seconds // 60 + 1} minute(s)."
            ),
        )


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
    await _enforce("tutor", user)
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
    await _enforce("tutor", user)
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
    await _enforce("tutor", user)
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
    await _enforce("tutor", user)
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
    await _enforce("authoring", user)
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


@router.get("/embeddings/status", summary="pgvector semantic store status")
async def embeddings_status(
    session: AsyncSession = Depends(get_session),
    _: UserOut = Depends(get_current_user),
) -> dict:
    from app.core.config import get_settings
    from app.domains.copilot import pgvector_store

    return {
        "store": get_settings().retrieval_store,
        "embedding_provider": get_settings().embedding_provider,
        "rows": await pgvector_store.count(session),
    }


@router.post("/embeddings/rebuild", summary="Rebuild the pgvector semantic store (author)")
async def embeddings_rebuild(
    session: AsyncSession = Depends(get_session),
    _: UserOut = Depends(author_only),
) -> dict:
    from app.domains.copilot import pgvector_store

    written = await pgvector_store.rebuild(session)
    await session.commit()
    return {"rebuilt": written}


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
    await _enforce("authoring", user)
    result = await svc.teacher_assist(
        session, uuid.UUID(author.id), task=body.task, node_ref=body.node, notes=body.notes
    )
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


class CounterexampleRequest(BaseModel):
    predicate: str
    candidates: list[str]
    var: str = "n"


@router.post("/counterexample-search", summary="Search for a counterexample (author)")
async def counterexample_search(
    body: CounterexampleRequest,
    _: UserOut = Depends(author_only),
) -> dict:
    """Validate that a suspected-false claim really is false, before it becomes a
    find-the-error or counterexample item. Deterministic, CAS-backed."""
    await _enforce("authoring", user)
    from app.domains.copilot.proof_tools import search_counterexample

    return search_counterexample(body.predicate, body.candidates, body.var)


@router.post("/proof-practice", summary="Generate a provable statement with a verified reference")
async def proof_practice(
    difficulty: str = "intro",
    salt: int = 0,
    _: UserOut = Depends(author_only),
) -> dict:
    """Emit a provable statement with a known reference proof, verified by the
    formal kernel where formalizable and otherwise flagged for human review."""
    await _enforce("authoring", user)
    from app.domains.copilot.proof_tools import generate_proof_practice

    return await generate_proof_practice(difficulty, salt)

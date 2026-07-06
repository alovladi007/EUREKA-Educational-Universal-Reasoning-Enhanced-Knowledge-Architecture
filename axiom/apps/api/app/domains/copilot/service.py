"""Copilot service: hints, explanations, and grounded tutoring chat.

Every reply is produced by the swappable reasoning provider from retrieved
curriculum passages, so it is auditable (it carries its sources) and clearly
AI-assisted. A hint requested while the learner is answering a specific item
withholds the answer-bearing worked explanation and asks the provider not to
reveal the answer, so the copilot nudges rather than solves.

Assistant chat turns are persisted with their provider and sources; hints and
one-off explanations are stateless but leave a ReasoningTrace so a teacher can
see what the copilot said and why.
"""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.assessment.models import Item, ItemVariant
from app.domains.attempts.models import ReasoningTrace, Response
from app.domains.copilot.models import CopilotMessage, CopilotSession
from app.domains.copilot.reasoning import (
    Passage,
    ReasoningRequest,
    get_reasoning_provider,
)
from app.domains.copilot.retrieval import retrieve
from app.domains.curriculum.models import KnowledgeNode

# How many prior turns of a chat to give the provider as context.
_HISTORY_TURNS = 6


async def _resolve_node(
    session: AsyncSession, ref: str | None
) -> KnowledgeNode | None:
    if not ref:
        return None
    node = (
        await session.execute(select(KnowledgeNode).where(KnowledgeNode.code == ref))
    ).scalar_one_or_none()
    if node is not None:
        return node
    try:
        node_uuid = uuid.UUID(ref)
    except ValueError:
        return None
    return (
        await session.execute(select(KnowledgeNode).where(KnowledgeNode.id == node_uuid))
    ).scalar_one_or_none()


async def _prompt_for_response(session: AsyncSession, response: Response) -> str:
    """The question text a learner is looking at, for grounding a hint."""
    if response.item_id is not None:
        item = (
            await session.execute(select(Item).where(Item.id == response.item_id))
        ).scalar_one_or_none()
        return item.prompt if item is not None else ""
    if response.variant_id is not None:
        variant = (
            await session.execute(
                select(ItemVariant).where(ItemVariant.id == response.variant_id)
            )
        ).scalar_one_or_none()
        return variant.prompt if variant is not None else ""
    return ""


def _sources_payload(passages: list[Passage]) -> list[dict]:
    return [{"source": p.source, "kind": p.kind, "text": p.text} for p in passages]


async def _trace(
    session: AsyncSession, subject_id: uuid.UUID, kind: str, content: dict
) -> None:
    session.add(
        ReasoningTrace(
            subject_type="copilot", subject_id=subject_id, kind=kind, content=content
        )
    )


async def hint(
    session: AsyncSession,
    user_id: uuid.UUID,
    *,
    node_ref: str | None = None,
    response_token: str | None = None,
    question: str = "",
) -> dict:
    """A scaffolded hint. For an active item it never reveals the answer.

    node scope comes from response_token (the item's node) when present,
    otherwise from node_ref. Answer-bearing worked explanations are withheld so
    the hint cannot leak the solution.
    """
    node: KnowledgeNode | None = None
    query = question

    if response_token:
        try:
            response_id = uuid.UUID(response_token)
        except ValueError:
            return {"error": "invalid response token"}
        response = (
            await session.execute(
                select(Response).where(
                    Response.id == response_id, Response.user_id == user_id
                )
            )
        ).scalar_one_or_none()
        if response is None:
            return {"error": "response not found"}
        node = (
            await session.execute(
                select(KnowledgeNode).where(KnowledgeNode.id == response.node_id)
            )
        ).scalar_one_or_none()
        if not query:
            query = await _prompt_for_response(session, response)
    else:
        node = await _resolve_node(session, node_ref)

    node_id = node.id if node is not None else None
    passages = await retrieve(
        session, query, node_id=node_id, limit=3, include_items=False
    )
    provider = get_reasoning_provider()
    result = await provider.generate(
        ReasoningRequest(task="hint", question=query, passages=passages, reveal_answer=False)
    )

    trace_id = uuid.uuid4()
    await _trace(
        session,
        trace_id,
        "hint",
        {"provider": result.provider, "node": node.code if node else None, "query": query},
    )
    await session.commit()
    return {
        "ai_generated": True,
        "provider": result.provider,
        "grounded": result.grounded,
        "hint": result.text,
        "node_code": node.code if node is not None else None,
        "sources": _sources_payload(passages),
    }


async def explain(
    session: AsyncSession,
    user_id: uuid.UUID,
    *,
    node_ref: str,
    question: str = "",
) -> dict:
    """A concept explanation grounded in the node's lesson material."""
    node = await _resolve_node(session, node_ref)
    if node is None:
        return {"error": "node not found"}

    query = question or node.title
    passages = await retrieve(session, query, node_id=node.id, limit=4, include_items=True)
    provider = get_reasoning_provider()
    result = await provider.generate(
        ReasoningRequest(task="explain", question=query, passages=passages, reveal_answer=True)
    )

    await _trace(
        session, uuid.uuid4(), "explain", {"provider": result.provider, "node": node.code}
    )
    await session.commit()
    return {
        "ai_generated": True,
        "provider": result.provider,
        "grounded": result.grounded,
        "explanation": result.text,
        "node_code": node.code,
        "sources": _sources_payload(passages),
    }


async def chat(
    session: AsyncSession,
    user_id: uuid.UUID,
    *,
    message: str,
    session_id: str | None = None,
    node_ref: str | None = None,
) -> dict:
    """One tutoring chat turn, grounded and persisted in a threaded session."""
    convo: CopilotSession | None = None
    if session_id:
        try:
            sid = uuid.UUID(session_id)
        except ValueError:
            return {"error": "invalid session id"}
        convo = (
            await session.execute(
                select(CopilotSession).where(
                    CopilotSession.id == sid, CopilotSession.user_id == user_id
                )
            )
        ).scalar_one_or_none()
        if convo is None:
            return {"error": "session not found"}

    if convo is None:
        node = await _resolve_node(session, node_ref)
        convo = CopilotSession(
            user_id=user_id,
            node_id=node.id if node is not None else None,
            title=(message[:80] if message else "Tutoring session"),
        )
        session.add(convo)
        await session.flush()

    session.add(
        CopilotMessage(session_id=convo.id, user_id=user_id, role="user", content=message)
    )

    prior = (
        (
            await session.execute(
                select(CopilotMessage)
                .where(CopilotMessage.session_id == convo.id)
                .order_by(CopilotMessage.created_at.desc())
                .limit(_HISTORY_TURNS)
            )
        )
        .scalars()
        .all()
    )
    history = [{"role": m.role, "content": m.content} for m in reversed(prior)]

    passages = await retrieve(
        session, message, node_id=convo.node_id, limit=4, include_items=True
    )
    provider = get_reasoning_provider()
    result = await provider.generate(
        ReasoningRequest(
            task="chat", question=message, passages=passages, history=history
        )
    )

    session.add(
        CopilotMessage(
            session_id=convo.id,
            user_id=user_id,
            role="assistant",
            content=result.text,
            provider=result.provider,
            sources=_sources_payload(passages),
        )
    )
    await session.commit()
    return {
        "session_id": str(convo.id),
        "ai_generated": True,
        "provider": result.provider,
        "grounded": result.grounded,
        "reply": result.text,
        "sources": _sources_payload(passages),
    }


_TEACHER_TASKS = {
    "draft_quiz": (
        "Draft a short quiz for {title}. Suggest 3 to 5 questions that cover the "
        "key skills of this topic, referencing the lesson material."
    ),
    "explain_errors": (
        "Several students made these errors on {title}: {notes}. Explain the "
        "likely misconception and how to address it in class."
    ),
    "suggest_intervention": (
        "Students are struggling with {title}. Suggest a targeted intervention "
        "and the next practice to assign, grounded in the lesson material."
    ),
}


async def teacher_assist(
    session: AsyncSession,
    user_id: uuid.UUID,
    *,
    task: str,
    node_ref: str,
    notes: str = "",
) -> dict:
    """A teacher-facing assistant: draft a quiz, explain a class-wide error, or
    suggest an intervention, grounded in the node's material and labeled
    AI-assisted. For draft_quiz it also returns the node's real items as concrete
    suggestions, so the teacher gets ready-to-use questions, not only prose.
    """
    if task not in _TEACHER_TASKS:
        return {"error": f"unknown task: {task}"}
    node = await _resolve_node(session, node_ref)
    if node is None:
        return {"error": "node not found"}

    question = _TEACHER_TASKS[task].format(title=node.title, notes=notes or "(none given)")
    passages = await retrieve(session, question, node_id=node.id, limit=4, include_items=True)
    provider = get_reasoning_provider()
    result = await provider.generate(
        ReasoningRequest(
            task="explain", question=question, passages=passages, reveal_answer=True
        )
    )

    suggested_items: list[dict] = []
    if task == "draft_quiz":
        items = (
            (
                await session.execute(
                    select(Item).where(Item.node_id == node.id).limit(5)
                )
            )
            .scalars()
            .all()
        )
        suggested_items = [
            {"id": str(i.id), "kind": i.kind, "prompt": i.prompt} for i in items
        ]

    await _trace(
        session,
        uuid.uuid4(),
        "teacher_assist",
        {"provider": result.provider, "node": node.code, "task": task},
    )
    await session.commit()
    return {
        "ai_generated": True,
        "task": task,
        "provider": result.provider,
        "grounded": result.grounded,
        "response": result.text,
        "node_code": node.code,
        "suggested_items": suggested_items,
        "sources": _sources_payload(passages),
    }


async def get_session_history(
    session: AsyncSession, user_id: uuid.UUID, session_id: str
) -> dict:
    try:
        sid = uuid.UUID(session_id)
    except ValueError:
        return {"error": "invalid session id"}
    convo = (
        await session.execute(
            select(CopilotSession).where(
                CopilotSession.id == sid, CopilotSession.user_id == user_id
            )
        )
    ).scalar_one_or_none()
    if convo is None:
        return {"error": "session not found"}

    messages = (
        (
            await session.execute(
                select(CopilotMessage)
                .where(CopilotMessage.session_id == convo.id)
                .order_by(CopilotMessage.created_at)
            )
        )
        .scalars()
        .all()
    )
    return {
        "session_id": str(convo.id),
        "node_id": str(convo.node_id) if convo.node_id else None,
        "title": convo.title,
        "messages": [
            {
                "role": m.role,
                "content": m.content,
                "provider": m.provider,
                "sources": m.sources or [],
                "created_at": m.created_at,
            }
            for m in messages
        ],
    }

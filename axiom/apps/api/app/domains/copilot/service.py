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

from app.domains.adaptive.models import MasteryState
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
from app.domains.practice.service import review_mistakes

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


async def _generator_hint_ladder(session: AsyncSession, response: Response) -> dict | None:
    """Authored three-rung hint ladder for generator-backed template questions
    (EM-18, AXIOM Teaching Model: orient, method, first step). The rung
    escalates with each request on the same response, and the ladder is served
    before any model-generated hint because it was written for this exact
    template. Returns None when the response is not generator-backed."""
    if response.template_id is None or response.variant_id is None:
        return None
    variant = (
        await session.execute(
            select(ItemVariant).where(ItemVariant.id == response.variant_id)
        )
    ).scalar_one_or_none()
    if variant is None or not isinstance(variant.values, dict):
        return None
    generator_id = variant.values.get("generator")
    if not generator_id:
        return None
    from math_core.generators import HINTS

    ladder = HINTS.get(str(generator_id))
    if not ladder:
        return None
    served = int(variant.values.get("hints_served", 0))
    rung = min(served, len(ladder) - 1)
    variant.values = {**variant.values, "hints_served": served + 1}
    await session.flush()
    names = ("orient", "method", "first step")
    return {
        "hint": ladder[rung],
        "rung": rung + 1,
        "rung_name": names[rung] if rung < len(names) else f"rung {rung + 1}",
        "rungs_total": len(ladder),
        "provider": "authored-ladder",
        "grounded": True,
    }


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
        ladder = await _generator_hint_ladder(session, response)
        if ladder is not None:
            return ladder
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
        "ai_generated": result.model_backed,
        "provider": result.provider,
        "grounded": result.grounded,
        "hint": result.text,
        "node_code": node.code if node is not None else None,
        "sources": _sources_payload(passages),
    }


async def proof_tutor(
    session: AsyncSession,
    user_id: uuid.UUID,
    *,
    node_ref: str | None = None,
    response_token: str | None = None,
    draft: str = "",
    level: int = 0,
) -> dict:
    """Proof-tutor mode (Extension Section 7): graduated Socratic hints that
    never hand over the proof, plus gap detection on the student's draft.

    Grounded in the course's lessons, definitions, and theorems through the
    retriever. The graduated hint level controls how far the copilot goes -- a
    nudge toward the technique, then the first step, then the next step -- but it
    never reveals the answer. Gap detection is server-side: it compares the draft
    against the active item's required milestones and names the first step the
    argument has not yet established, without revealing the rest of the proof.
    """
    from app.domains.grading.service import _milestone_hit, _norm_text

    node: KnowledgeNode | None = None
    milestones: list[str] = []
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
        ladder = await _generator_hint_ladder(session, response)
        if ladder is not None:
            return ladder
        node = (
            await session.execute(
                select(KnowledgeNode).where(KnowledgeNode.id == response.node_id)
            )
        ).scalar_one_or_none()
        if response.item_id is not None:
            item = (
                await session.execute(select(Item).where(Item.id == response.item_id))
            ).scalar_one_or_none()
            if item is not None and isinstance(item.meta, dict):
                milestones = [str(m) for m in (item.meta.get("milestones") or [])]
    else:
        node = await _resolve_node(session, node_ref)

    node_id = node.id if node is not None else None
    query = node.title if node is not None else "this proof"
    passages = await retrieve(session, query, node_id=node_id, limit=3, include_items=False)

    # Graduated Socratic hint. The level shapes how far the copilot goes but it
    # never reveals the answer (reveal_answer=False).
    level = max(0, min(2, int(level)))
    ladder = [
        "Point me toward the right proof technique, without any steps.",
        "Give only the first step of the proof.",
        "Given my current progress, suggest just the next step.",
    ]
    provider = get_reasoning_provider()
    result = await provider.generate(
        ReasoningRequest(
            task="hint",
            question=f"{ladder[level]} ({query})",
            passages=passages,
            reveal_answer=False,
        )
    )

    # Gap detection: the first required milestone the draft has not established.
    # A prose milestone is established when its normalized text appears in the
    # draft; an algebraic milestone when a line matches it symbolically.
    gap: str | None = None
    established = 0
    draft_norm = _norm_text(draft)
    draft_lines = [ln for ln in (draft or "").splitlines() if ln.strip()]
    for milestone in milestones:
        m_norm = _norm_text(milestone)
        hit = (bool(m_norm) and m_norm in draft_norm) or any(
            _milestone_hit(line, milestone) for line in draft_lines
        )
        if hit:
            established += 1
        elif gap is None:
            gap = milestone

    trace_id = uuid.uuid4()
    await _trace(
        session,
        trace_id,
        "proof_tutor",
        {"provider": result.provider, "node": node.code if node else None, "level": level},
    )
    await session.commit()
    return {
        "ai_generated": result.model_backed,
        "provider": result.provider,
        "grounded": result.grounded,
        "level": level,
        "hint": result.text,
        "gap": gap,
        "established": established,
        "milestone_count": len(milestones),
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
        "ai_generated": result.model_backed,
        "provider": result.provider,
        "grounded": result.grounded,
        "explanation": result.text,
        "node_code": node.code,
        "sources": _sources_payload(passages),
    }


# The learner's own record, as grounding passages.
#
# WHY PASSAGES RATHER THAN A NEW FIELD
#
# The copilot already grounds on passages, cites them as sources, and shows
# them to the learner. Feeding the learner's own state through the same channel
# means it is cited like everything else - a reply that leans on "you have
# missed this twice" says so in its sources rather than appearing to know it by
# magic - and it needs no change to the provider contract.
#
# WHAT IS DELIBERATELY LEFT OUT
#
# The correct answers to past mistakes. The learner has already seen them in
# Review, so including them is not a leak in the strict sense, but a tutor
# holding the key to a question the learner may be about to retry is one
# accident away from handing it over. The node, the misconception and the
# learner's own wrong answer are enough to teach from.
#
# Only this user's rows are ever read. There is no path here to another
# learner's data.
_WEAK_SKILLS = 3
_RECENT_MISTAKES = 3


async def _learner_passages(
    session: AsyncSession, user_id: uuid.UUID
) -> list[Passage]:
    out: list[Passage] = []

    weak = (
        (
            await session.execute(
                select(MasteryState, KnowledgeNode)
                .join(KnowledgeNode, KnowledgeNode.id == MasteryState.node_id)
                .where(MasteryState.user_id == user_id)
                .order_by(MasteryState.p_known.asc())
                .limit(_WEAK_SKILLS)
            )
        )
        .all()
    )
    if weak:
        lines = [
            f"{node.title} ({node.code}): {round(state.p_known * 100)}% estimated"
            for state, node in weak
        ]
        out.append(
            Passage(
                source="Your mastery record",
                kind="learner",
                text=(
                    "This learner's weakest skills by estimated mastery, from "
                    "their own graded attempts: " + "; ".join(lines) + "."
                ),
            )
        )

    missed = await review_mistakes(session, user_id)
    if missed:
        lines = [
            f"{m['node_title']}: answered {m['your_answer']!r}"
            for m in missed[:_RECENT_MISTAKES]
        ]
        out.append(
            Passage(
                source="Your recent mistakes",
                kind="learner",
                text=(
                    "Questions this learner recently got wrong, and what they "
                    "answered (the correct answers are deliberately withheld "
                    "from you): " + "; ".join(lines) + "."
                ),
            )
        )

    return out


# How many of the learner's own previous turns join the retrieval query. Two
# is enough to carry a subject through a follow-up without letting an older,
# abandoned topic outvote the current one.
_QUERY_CONTEXT_TURNS = 2


def _retrieval_query(message: str, history: list[dict]) -> str:
    """Build the search text for a chat turn from its conversational context.

    A short follow-up gets the learner's recent turns prepended; a long, self
    contained question does not need them and is used as-is, so a fully stated
    question is never diluted by an unrelated earlier one.
    """
    text = (message or "").strip()
    if len(text.split()) >= 8:
        return text
    recent = [
        (h.get("content") or "").strip()
        for h in history
        if h.get("role") == "user" and (h.get("content") or "").strip() != text
    ][-_QUERY_CONTEXT_TURNS:]
    return " ".join([*recent, text]).strip() or text


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

    # Retrieve on the CONVERSATION, not just the latest utterance.
    #
    # A follow-up is usually a fragment - "why does it need one?" - and
    # retrieving on those five words alone returned uniqueness proofs and
    # antiderivatives in a conversation that was about induction. The learner's
    # own recent turns carry the subject; the assistant's do not (they are
    # mostly quoted passages, and feeding them back re-retrieves whatever was
    # already found, which narrows onto the first answer instead of the topic).
    retrieval_query = _retrieval_query(message, history)
    passages = await retrieve(
        session, retrieval_query, node_id=convo.node_id, limit=4, include_items=True
    )
    # The learner's own record goes last, so a curriculum passage is never
    # displaced by it: the tutor should still be grounded in the mathematics
    # first and personalised second.
    passages = [*passages, *await _learner_passages(session, user_id)]
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
        "ai_generated": result.model_backed,
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
        "ai_generated": result.model_backed,
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

"""
Tool-use tutor agent (Phase 6 Sessions 6.2 + 6.3 + 6.4).

A Claude-driven tutoring loop with six tools, a Socratic hint-ladder
state machine, and a grounded-output check on every assistant turn.

THE LOOP

  1. Caller invokes turn(session, user_message). We append the user
     message to agent_messages, then enter the agent loop.
  2. Each iteration: send Claude the system prompt (Socratic mode +
     active skill focus + hint level) + the running message list +
     the tool schemas.
  3. If Claude returns text → that's the assistant turn. We run
     groundedness check, persist, and return.
  4. If Claude returns a tool_use → we execute the tool, persist a
     trace row, and feed the result back as a tool message.
  5. Cap at MAX_TOOL_HOPS to prevent runaway loops.

TOOLS (each one is a thin wrapper around already-built services)

  lookup_skill_state          read learner_skill_mastery for a skill
  retrieve_content            call services.rag.retrieve()
  get_question                pick an item from the bank for a skill
  grade_attempt               grade an MCQ answer
  recommend_next              call services.recommender.recommend()
  update_mastery              upsert mastery (with profile mirror)

The tutor is given the same skill_id the session was created for so
its tool calls default to that focus. Hint level is read from the
agent_sessions row and injected into the system prompt; bump_hint()
moves it up one step on the next learner "I don't know" cue.

STUB MODE

If ANTHROPIC_API_KEY is unset, the agent runs in a deterministic stub
mode that produces a structured Socratic reply without calling Claude.
Same shape, no network, suitable for CI.
"""

from __future__ import annotations

import asyncio
import json
import os
import re
import time
from dataclasses import dataclass, field
from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.observability import get_logger
from app.models.agent import (
    AgentMessage,
    AgentRole,
    AgentSession,
    AgentSessionStatus,
    AgentTrace,
)
from app.models.item_bank import Item
from app.models.learner import LearnerProfile
from app.models.skill import LearnerSkillMastery, Skill
from app.services.rag import RetrievedChunk, groundedness, retrieve

log = get_logger(__name__)

MAX_TOOL_HOPS = 8  # Defence against runaway loops.

# ---------------------------------------------------------------------------
# System-prompt builder
# ---------------------------------------------------------------------------

_HINT_LADDER_DIRECTIVES = {
    0: "Default to asking a leading question that prompts the learner to figure it out. Do not give the answer.",
    1: "The learner is stuck. Provide a nudge — point them at the concept without revealing the answer.",
    2: "The learner is still stuck. Give a partial worked example. Leave the final step for them.",
    3: "The learner has asked twice for the answer. Reveal it with a clear explanation and a follow-up check.",
}


def build_system_prompt(session: AgentSession, skill: Skill | None) -> str:
    """The system prompt is RECOMPUTED each turn so changes to hint_level
    take immediate effect."""
    # session.hint_level can be None before the SQLAlchemy default is
    # flushed; treat that as 0 (no hint given yet).
    hint = session.hint_level if session.hint_level is not None else 0
    mode_value = session.mode.value if hasattr(session.mode, "value") else session.mode
    mode_directive = (
        _HINT_LADDER_DIRECTIVES[hint]
        if mode_value == "socratic"
        else "Give a clear, complete answer with worked steps."
    )
    skill_block = ""
    if skill is not None:
        skill_block = (
            f"\nActive skill focus: {skill.framework}/{skill.code} — {skill.name}. "
            f"All retrievals + practice items default to this skill."
        )
    return f"""You are EUREKA's tutoring agent. You teach learners across HS → professional
tiers under a single identity, using a shared skill graph + item bank.

Hard rules (no exceptions):
  - Every factual claim must be supported by a retrieved chunk. Call
    `retrieve_content` BEFORE asserting anything you're not 100% sure of.
  - Cite sources by their URI when you do assert facts. Inline format:
    "[ref:<source_uri>]". The frontend renders these as links.
  - Use the provided tools for state — never invent the learner's mastery
    or invent an item ID.
  - When the learner is wrong, name the misconception, then guide them
    via the hint ladder. Do not insult.

Socratic hint level: {session.hint_level} — {mode_directive}
{skill_block}

Respond to the LATEST learner message. Use tools as needed. Then write
a final assistant message that the learner sees."""


# ---------------------------------------------------------------------------
# Tool implementations — each returns a JSON-serialisable dict
# ---------------------------------------------------------------------------


@dataclass
class ToolResult:
    ok: bool
    data: dict[str, Any]
    error: str | None = None
    latency_ms: int = 0


async def _tool_lookup_skill_state(
    db: AsyncSession, user_id: UUID, skill_id: UUID
) -> ToolResult:
    t0 = time.time()
    r = await db.execute(
        select(LearnerSkillMastery).where(
            LearnerSkillMastery.user_id == user_id,
            LearnerSkillMastery.skill_id == skill_id,
        )
    )
    row = r.scalar_one_or_none()
    out = {
        "skill_id": str(skill_id),
        "mastery": float(row.mastery) if row else 0.0,
        "attempts": row.attempts if row else 0,
        "last_practiced_at": row.last_practiced_at.isoformat() + "Z" if row and row.last_practiced_at else None,
    }
    return ToolResult(ok=True, data=out, latency_ms=int((time.time() - t0) * 1000))


async def _tool_retrieve_content(
    db: AsyncSession, query: str, skill_id: UUID | None, framework: str | None
) -> ToolResult:
    t0 = time.time()
    chunks = await retrieve(db, query=query, skill_id=skill_id, framework_filter=framework, limit=6)
    return ToolResult(
        ok=True,
        data={"chunks": [c.to_citation() | {"score": round(c.score, 4)} for c in chunks]},
        latency_ms=int((time.time() - t0) * 1000),
    )


async def _tool_get_question(
    db: AsyncSession, skill_id: UUID, difficulty: str | None
) -> ToolResult:
    """Pick an item tagged with the skill. Naive: most recent first; a
    real implementation would use IRT to pick at the learner's ability."""
    t0 = time.time()
    from app.models.skill import ContentKind, ContentSkill
    tag_q = await db.execute(
        select(ContentSkill).where(
            ContentSkill.skill_id == skill_id,
            ContentSkill.content_kind == ContentKind.QUESTION,
        ).limit(20)
    )
    item_ids = [t.content_id for t in tag_q.scalars().all()]
    if not item_ids:
        return ToolResult(ok=False, data={}, error="no items tagged with this skill")
    item_q = await db.execute(
        select(Item).where(Item.id.in_(item_ids), Item.deleted_at.is_(None))
    )
    items = list(item_q.scalars().all())
    if difficulty:
        items = [i for i in items if i.difficulty_nominal == difficulty] or items
    if not items:
        return ToolResult(ok=False, data={}, error="no live items")
    chosen = items[0]
    return ToolResult(
        ok=True,
        data={
            "item_id": str(chosen.id),
            "kind": chosen.kind.value if hasattr(chosen.kind, "value") else chosen.kind,
            "stem": chosen.content.get("stem") or chosen.content.get("vignette"),
            "options": chosen.content.get("options"),
            "difficulty": chosen.difficulty_nominal,
            "estimated_time_sec": chosen.estimated_time_sec,
        },
        latency_ms=int((time.time() - t0) * 1000),
    )


async def _tool_grade_attempt(
    db: AsyncSession, item_id: UUID, answer_index: int | None, answer_text: str | None
) -> ToolResult:
    t0 = time.time()
    item = await db.get(Item, item_id)
    if item is None:
        return ToolResult(ok=False, data={}, error="item not found")
    correct = (item.content or {}).get("correct_index")
    if answer_index is not None and correct is not None:
        is_correct = (int(answer_index) == int(correct))
        return ToolResult(
            ok=True,
            data={
                "correct": is_correct,
                "correct_index": correct,
                "explanation": item.explanation or "",
            },
            latency_ms=int((time.time() - t0) * 1000),
        )
    return ToolResult(ok=True, data={"graded": False, "reason": "auto-grade only supports MCQ index"},
                      latency_ms=int((time.time() - t0) * 1000))


async def _tool_recommend_next(db: AsyncSession, user) -> ToolResult:
    from app.services.recommender import recommend
    t0 = time.time()
    recs = await recommend(db, user, limit=5)
    return ToolResult(
        ok=True,
        data={"recommendations": [r.to_dict() for r in recs]},
        latency_ms=int((time.time() - t0) * 1000),
    )


async def _tool_update_mastery(
    db: AsyncSession, user_id: UUID, skill_id: UUID, mastery: float
) -> ToolResult:
    """Mirror to both learner_skill_mastery and learner_profile.knowledge_state."""
    t0 = time.time()
    from datetime import datetime
    r = await db.execute(
        select(LearnerSkillMastery).where(
            LearnerSkillMastery.user_id == user_id,
            LearnerSkillMastery.skill_id == skill_id,
        )
    )
    row = r.scalar_one_or_none()
    mastery = max(0.0, min(1.0, float(mastery)))
    if row is None:
        row = LearnerSkillMastery(
            user_id=user_id, skill_id=skill_id, mastery=mastery, attempts=1,
            last_practiced_at=datetime.utcnow(),
        )
        db.add(row)
    else:
        row.mastery = mastery
        row.attempts = (row.attempts or 0) + 1
        row.last_practiced_at = datetime.utcnow()
    prof_q = await db.execute(
        select(LearnerProfile).where(LearnerProfile.user_id == user_id)
    )
    profile = prof_q.scalar_one_or_none()
    if profile is not None:
        ks = dict(profile.knowledge_state or {})
        ks[str(skill_id)] = {**ks.get(str(skill_id), {}), "mastery": mastery,
                              "attempts": row.attempts, "last_practiced": datetime.utcnow().isoformat()}
        profile.knowledge_state = ks
    await db.flush()
    return ToolResult(ok=True, data={"mastery": mastery, "attempts": row.attempts},
                      latency_ms=int((time.time() - t0) * 1000))


# ---------------------------------------------------------------------------
# Tool dispatch + Claude tool schema
# ---------------------------------------------------------------------------

TOOL_SCHEMAS = [
    {
        "name": "lookup_skill_state",
        "description": "Read the current learner's mastery on a skill (returns mastery 0..1, attempts).",
        "input_schema": {
            "type": "object",
            "properties": {"skill_id": {"type": "string"}},
            "required": ["skill_id"],
        },
    },
    {
        "name": "retrieve_content",
        "description": "Hybrid keyword+semantic search over the knowledge corpus (item stems, explanations, skill descriptions). MUST be called before asserting any fact.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "skill_id": {"type": "string"},
                "framework": {"type": "string"},
            },
            "required": ["query"],
        },
    },
    {
        "name": "get_question",
        "description": "Pick a practice item from the bank for a skill at a given difficulty.",
        "input_schema": {
            "type": "object",
            "properties": {
                "skill_id": {"type": "string"},
                "difficulty": {"type": "string", "enum": ["easy", "medium", "hard", "expert"]},
            },
            "required": ["skill_id"],
        },
    },
    {
        "name": "grade_attempt",
        "description": "Grade a learner's answer on an MCQ item.",
        "input_schema": {
            "type": "object",
            "properties": {
                "item_id": {"type": "string"},
                "answer_index": {"type": "integer"},
                "answer_text": {"type": "string"},
            },
            "required": ["item_id"],
        },
    },
    {
        "name": "recommend_next",
        "description": "Get the top recommended skills the learner should work on next.",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "update_mastery",
        "description": "Write a new mastery value for the current learner on a skill.",
        "input_schema": {
            "type": "object",
            "properties": {
                "skill_id": {"type": "string"},
                "mastery": {"type": "number", "minimum": 0, "maximum": 1},
            },
            "required": ["skill_id", "mastery"],
        },
    },
]


async def _dispatch_tool(
    name: str, args: dict[str, Any], db: AsyncSession, user, session: AgentSession
) -> ToolResult:
    try:
        if name == "lookup_skill_state":
            return await _tool_lookup_skill_state(db, user.id, UUID(args["skill_id"]))
        if name == "retrieve_content":
            sid = UUID(args["skill_id"]) if args.get("skill_id") else session.skill_id
            return await _tool_retrieve_content(db, args["query"], sid, args.get("framework"))
        if name == "get_question":
            return await _tool_get_question(db, UUID(args["skill_id"]), args.get("difficulty"))
        if name == "grade_attempt":
            return await _tool_grade_attempt(
                db, UUID(args["item_id"]),
                args.get("answer_index"), args.get("answer_text"),
            )
        if name == "recommend_next":
            return await _tool_recommend_next(db, user)
        if name == "update_mastery":
            return await _tool_update_mastery(
                db, user.id, UUID(args["skill_id"]), float(args["mastery"])
            )
        return ToolResult(ok=False, data={}, error=f"unknown tool {name}")
    except Exception as exc:
        log.warning("tutor_agent.tool_error", tool=name, error=str(exc))
        return ToolResult(ok=False, data={}, error=f"{type(exc).__name__}: {exc}")


# ---------------------------------------------------------------------------
# Anthropic client (lazy)
# ---------------------------------------------------------------------------


def _anthropic():
    key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not key or key.startswith("sk-ant-your") or key.startswith("<paste"):
        return None
    try:
        from anthropic import Anthropic
        return Anthropic(api_key=key)
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Stub mode — deterministic Socratic reply, calls retrieve once
# ---------------------------------------------------------------------------


async def _stub_turn(
    db: AsyncSession,
    *,
    session: AgentSession,
    skill: Skill | None,
    user_message: str,
) -> tuple[str, list[dict]]:
    """When no API key is configured, fabricate a Socratic-shaped reply
    that exercises retrieve + grounds. Returns (assistant_text, citations)."""
    query_terms = skill.name if skill else user_message
    chunks = await retrieve(db, query=query_terms, skill_id=session.skill_id, limit=4)

    ladder = {
        0: "Let's reason through this together. What do you already know about this concept?",
        1: "Here's a nudge: think about the key mechanism involved.",
        2: "Partial worked example follows. Try the final step yourself.",
        3: "Here's the full answer with reasoning:",
    }.get(session.hint_level, "Let's keep going.")

    cited = " ".join(f"[ref:{c.source_uri}]" for c in chunks[:2]) if chunks else ""
    text_out = (
        f"{ladder}\n\nBased on what you asked: {user_message[:140]}\n\n"
        f"Relevant sources I found: {cited or '(no retrieved content)'}."
    )
    return text_out, [c.to_citation() for c in chunks[:2]]


# ---------------------------------------------------------------------------
# Real Claude loop
# ---------------------------------------------------------------------------


async def _claude_turn(
    db: AsyncSession,
    *,
    session: AgentSession,
    skill: Skill | None,
    history: list[dict],   # prior messages in claude format
    user,
) -> tuple[str, list[dict], list[dict]]:
    """Returns (assistant_text, citations, tool_trace_records)."""
    client = _anthropic()
    system = build_system_prompt(session, skill)
    messages = list(history)
    trace_records: list[dict] = []

    for hop in range(MAX_TOOL_HOPS):
        # Synchronous SDK call wrapped via to_thread to keep the event loop free.
        msg = await asyncio.to_thread(
            client.messages.create,
            model=session.model or "claude-opus-4-7",
            max_tokens=2048,
            system=system,
            tools=TOOL_SCHEMAS,
            messages=messages,
        )

        # Did Claude request a tool?
        tool_uses = [b for b in msg.content if getattr(b, "type", None) == "tool_use"]
        text_blocks = [b.text for b in msg.content if getattr(b, "type", None) == "text"]

        if not tool_uses:
            # Final assistant turn
            final_text = "\n".join(text_blocks).strip()
            # Extract citations of the form [ref:<source_uri>]
            uris = re.findall(r"\[ref:([^\]]+)\]", final_text)
            return final_text, [{"source_uri": u} for u in uris], trace_records

        # Append the assistant turn that requested the tools
        messages.append({"role": "assistant", "content": msg.content})
        # Run every tool the model requested
        tool_result_blocks = []
        for tu in tool_uses:
            result = await _dispatch_tool(tu.name, tu.input or {}, db, user, session)
            trace_records.append({
                "tool_name": tu.name,
                "args": tu.input or {},
                "result": result.data if result.ok else {"error": result.error},
                "ok": result.ok,
                "error": result.error,
                "latency_ms": result.latency_ms,
            })
            tool_result_blocks.append({
                "type": "tool_result",
                "tool_use_id": tu.id,
                "content": json.dumps(result.data if result.ok else {"error": result.error}),
                "is_error": not result.ok,
            })
        messages.append({"role": "user", "content": tool_result_blocks})

    # Hit hop limit without a final text reply
    return (
        "(I made too many tool calls and ran out of budget. Please rephrase or try again.)",
        [],
        trace_records,
    )


# ---------------------------------------------------------------------------
# Public turn() entry point
# ---------------------------------------------------------------------------


@dataclass
class TurnOutcome:
    assistant_message: AgentMessage
    citations: list[dict]
    groundedness_score: float
    hint_level: int
    tool_traces: list[AgentTrace] = field(default_factory=list)


async def turn(
    db: AsyncSession,
    *,
    session: AgentSession,
    user,
    user_message: str,
) -> TurnOutcome:
    """One conversation turn. Caller passes the existing session row + the
    learner's new message. We append messages + traces, run groundedness,
    bump hint level when the learner signals they're stuck, return the
    assistant message."""
    from datetime import datetime

    # Detect "I don't know" / "give me a hint" cues → bump hint level
    cues = re.search(r"\b(don'?t know|stuck|give( me)? (a )?hint|help|i give up)\b",
                     user_message.lower())
    if cues and session.hint_level < 3 and session.mode.value == "socratic":
        session.hint_level += 1

    # Persist the user message
    db.add(AgentMessage(session_id=session.id, role=AgentRole.USER, content=user_message))
    session.last_activity_at = datetime.utcnow()
    await db.flush()

    # Load skill (for system prompt)
    skill = None
    if session.skill_id:
        skill = await db.get(Skill, session.skill_id)

    # Reconstruct the message history Claude needs
    hist_q = await db.execute(
        select(AgentMessage).where(AgentMessage.session_id == session.id)
        .order_by(AgentMessage.created_at)
    )
    hist_msgs = list(hist_q.scalars().all())

    # Run the loop
    if _anthropic() is None:
        text_out, citations = await _stub_turn(
            db, session=session, skill=skill, user_message=user_message
        )
        tool_traces: list[dict] = []
    else:
        claude_history = []
        for m in hist_msgs:
            if m.role == AgentRole.USER:
                claude_history.append({"role": "user", "content": m.content})
            elif m.role == AgentRole.ASSISTANT:
                claude_history.append({"role": "assistant", "content": m.content})
        text_out, citations, tool_traces = await _claude_turn(
            db, session=session, skill=skill, history=claude_history, user=user
        )

    # Groundedness pass over the final text against the URIs in citations
    cited_uris = [c["source_uri"] for c in citations if isinstance(c, dict) and "source_uri" in c]
    chunks_for_grounding: list[RetrievedChunk] = []
    if cited_uris:
        # Hydrate the cited chunks' text from DB so the grounding check
        # works against what was actually cited.
        from sqlalchemy import text as sa_text
        ch_q = await db.execute(
            sa_text("SELECT id, source_uri, text FROM knowledge_chunks WHERE source_uri = ANY(:uris)"),
            {"uris": cited_uris},
        )
        for row in ch_q.fetchall():
            chunks_for_grounding.append(
                RetrievedChunk(
                    chunk_id=row[0], source_uri=row[1], text=row[2],
                    framework=None, skill_id=None, score=0.0,
                )
            )
    grounding = groundedness(text_out, chunks_for_grounding)

    # Persist the assistant turn
    assistant = AgentMessage(
        session_id=session.id, role=AgentRole.ASSISTANT, content=text_out,
        citations=citations, groundedness_score=round(grounding.score, 2),
        model=session.model,
    )
    db.add(assistant)
    await db.flush()

    # Persist tool traces
    trace_rows: list[AgentTrace] = []
    for t in tool_traces:
        row = AgentTrace(
            session_id=session.id,
            message_id=assistant.id,
            tool_name=t["tool_name"],
            args=t.get("args") or {},
            result=t.get("result") or {},
            ok=t.get("ok", True),
            error=t.get("error"),
            latency_ms=t.get("latency_ms"),
        )
        db.add(row)
        trace_rows.append(row)

    await db.commit()
    await db.refresh(assistant)
    return TurnOutcome(
        assistant_message=assistant,
        citations=citations,
        groundedness_score=round(grounding.score, 3),
        hint_level=session.hint_level,
        tool_traces=trace_rows,
    )

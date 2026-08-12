"""The in-app helper: answer from what the platform does, or fetch a human.

    POST /help/ask        a question -> an answer, or an honest hand-off
    GET  /help/topics     the registry, for suggestion chips
    POST /help/escalate   record a question for an administrator
    GET  /help/requests   the queue (admin)
    POST /help/requests/{id}/resolve   close one with an answer (admin)

The helper never improvises. It answers from app/services/help_registry.py or
it escalates - see help_service.py for why there is deliberately no third
branch. `ai_generated` is reported the same way AXIOM's tutor reports it: true
only when a model actually wrote the reply.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.utils.dependencies import get_current_active_user
from app.models.help_request import HelpRequest
from app.services import help_service as hs
from app.services.help_registry import TOPICS

router = APIRouter()

_ADMIN_ROLES = {"admin", "super_admin", "org_admin", "support"}


def _is_admin(user) -> bool:
    role = (getattr(user, "role", "") or "").lower()
    roles = {str(r).lower() for r in (getattr(user, "roles", None) or [])}
    return role in _ADMIN_ROLES or bool(roles & _ADMIN_ROLES)


class AskRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    # Where they were when they asked. Often the only thing that makes a
    # question like "this is not loading" answerable.
    page_path: str | None = None


class TopicOut(BaseModel):
    key: str
    title: str
    route: str
    summary: str
    tasks: list[str]
    restricted: bool


@router.get("/help/topics", summary="What the helper knows about")
async def help_topics() -> dict:
    return {
        "topics": [
            TopicOut(
                key=t.key,
                title=t.title,
                route=t.route,
                summary=t.summary,
                tasks=list(t.tasks),
                restricted=t.restricted,
            ).model_dump()
            for t in TOPICS
        ]
    }


@router.post("/help/ask", summary="Ask the helper a question")
async def help_ask(
    body: AskRequest,
    current_user=Depends(get_current_active_user),
) -> dict:
    question = body.question.strip()

    policy = hs.must_escalate(question)
    if policy:
        return {
            "handled": False,
            "answer": policy,
            "links": [],
            "ai_generated": False,
            "provider": "policy",
            "should_escalate": True,
            "escalate_reason": "policy",
        }

    matches = hs.match_topics(question)
    if not matches:
        return {
            "handled": False,
            "answer": hs.NO_MATCH_TEXT,
            "links": [],
            "ai_generated": False,
            "provider": "no-match",
            "should_escalate": True,
            "escalate_reason": "no_match",
        }

    links = [
        {"label": m.topic.title, "href": m.topic.route, "restricted": m.topic.restricted}
        for m in matches
    ]

    # Ask the reasoning core to phrase it, grounded ONLY on the matched
    # registry entries. If it is unavailable the registry text is returned
    # directly - accurate either way, and honestly labelled either way.
    answer = hs.compose_fallback(question, matches)
    ai_generated = False
    provider = "registry"
    try:
        from app.api.v1.endpoints.reasoning import (  # local import: optional dep
            GenerateRequest,
            Passage,
            generate,
        )

        result = await generate(
            GenerateRequest(
                task="help",
                question=question,
                reveal_answer=True,
                passages=[Passage(**p) for p in hs.grounding_passages(matches)],
                history=[],
            )
        )
        if result.text.strip():
            answer = result.text
            provider = result.provider
            ai_generated = bool(result.model_backed)
    except Exception:
        # The helper is more useful flat than absent.
        pass

    return {
        "handled": True,
        "answer": answer,
        "links": links,
        "topics": [m.topic.key for m in matches],
        "ai_generated": ai_generated,
        "provider": provider,
        # Even a handled question can be escalated: the person decides whether
        # the answer worked, not the helper.
        "should_escalate": False,
        "escalate_reason": "",
    }


class EscalateRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    page_path: str | None = None
    topic_keys: list[str] = Field(default_factory=list)
    reason: str = "no_match"


@router.post("/help/escalate", summary="Send a question to an administrator")
async def help_escalate(
    body: EscalateRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> dict:
    row = HelpRequest(
        user_id=getattr(current_user, "id", None),
        question=body.question.strip(),
        page_path=(body.page_path or "")[:500] or None,
        topic_keys=",".join(body.topic_keys)[:500],
        reason="policy" if body.reason == "policy" else "no_match",
        status="open",
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return {
        "id": str(row.id),
        "status": row.status,
        # A reference the person can quote, so "I asked about this" is
        # checkable rather than a memory.
        "reference": str(row.id)[:8],
        "message": (
            "Sent to an administrator. Quote reference "
            f"{str(row.id)[:8]} if you follow this up."
        ),
    }


@router.get("/help/requests", summary="Open help requests (admin)")
async def help_requests(
    status: str = Query("open"),
    limit: int = Query(50, le=200),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> dict:
    if not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="Administrator role required.")
    stmt = (
        select(HelpRequest)
        .where(HelpRequest.status == status)
        .order_by(HelpRequest.created_at.desc())
        .limit(limit)
    )
    rows = (await db.execute(stmt)).scalars().all()
    return {
        "requests": [
            {
                "id": str(r.id),
                "reference": str(r.id)[:8],
                "question": r.question,
                "page_path": r.page_path,
                "topic_keys": [k for k in (r.topic_keys or "").split(",") if k],
                "reason": r.reason,
                "status": r.status,
                "resolution": r.resolution,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in rows
        ],
        "count": len(rows),
    }


class ResolveRequest(BaseModel):
    resolution: str = Field(min_length=1, max_length=4000)


@router.post("/help/requests/{request_id}/resolve", summary="Resolve one (admin)")
async def help_resolve(
    request_id: uuid.UUID,
    body: ResolveRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> dict:
    if not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="Administrator role required.")
    row = (
        await db.execute(select(HelpRequest).where(HelpRequest.id == request_id))
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Help request not found.")
    row.resolution = body.resolution
    row.status = "resolved"
    row.resolved_by = getattr(current_user, "id", None)
    row.resolved_at = datetime.now(timezone.utc)
    await db.commit()
    return {"id": str(row.id), "status": row.status}

"""The in-app helper: answer from what EUREKA has, or open a real ticket.

    POST /help/ask        a question -> an answer, or an honest hand-off
    GET  /help/topics     the module registry, for suggestion chips
    POST /help/escalate   opens a SupportTicket in the existing queue

IT OWNS NO STORAGE AND NO QUEUE

An earlier version of this file created a `help_requests` table and its own
admin endpoints. That was a duplicate: EUREKA already has support tickets
(`/me/tickets`, `/tickets/{id}/reply`, `/admin/tickets/{id}` in gtm.py, with
status, priority, category, assignment and a threaded conversation) and a
published knowledge base (`/kb`). Two queues means half the questions land
where nobody is looking, and the "we answer within one business day" promise
on the Help Center only covers one of them.

So this endpoint is a front door, not a system:

  answers come from  the KB articles the team writes  +  a registry of the
                     modules that exist (help_registry.py)
  escalation goes to POST-equivalent of /me/tickets - the same queue, the same
                     SLA, the same admin tools

`ai_generated` is reported the way AXIOM's tutor reports it: true only when a
model actually wrote the reply.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.gtm import KbArticle, SupportMessage, SupportTicket
from app.services import help_service as hs
from app.services.help_registry import TOPICS
from app.utils.dependencies import get_current_active_user

router = APIRouter()

# How many published KB articles can inform one answer. Small on purpose: the
# helper quotes and links, it does not paste the knowledge base at someone.
_KB_LIMIT = 3


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


async def _kb_matches(db: AsyncSession, question: str) -> list[KbArticle]:
    """Published KB articles relevant to the question.

    Only `is_published` rows are ever read: a draft is by definition something
    the team has not agreed to say yet, and a helper quoting one publishes it
    by accident.
    """
    words = [w for w in hs._words(question) if len(w) > 2]
    if not words:
        return []
    clauses = []
    for w in words[:6]:
        like = f"%{w}%"
        clauses += [
            KbArticle.title.ilike(like),
            KbArticle.summary.ilike(like),
            KbArticle.body_md.ilike(like),
        ]
    stmt = (
        select(KbArticle)
        .where(KbArticle.is_published.is_(True), or_(*clauses))
        .order_by(KbArticle.view_count.desc())
        .limit(_KB_LIMIT)
    )
    return list((await db.execute(stmt)).scalars().all())


@router.post("/help/ask", summary="Ask the helper a question")
async def help_ask(
    body: AskRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> dict:
    question = body.question.strip()

    policy = hs.must_escalate(question)
    kb = await _kb_matches(db, question)

    # A policy question escalates - but if the team has PUBLISHED an answer,
    # show it first. "Refunds are available within 7 days" is a fact the KB is
    # allowed to state; deciding one person's refund is not.
    if policy:
        return {
            "handled": bool(kb),
            "answer": (
                (
                    "Here is what the help centre says, and I am sending this "
                    "to a person as well because the decision is theirs:\n\n"
                    + "\n\n".join(f"{a.title} — {a.summary or ''}".strip(" —") for a in kb)
                )
                if kb
                else policy
            ),
            "links": [_kb_link(a) for a in kb],
            "ai_generated": False,
            "provider": "policy",
            "should_escalate": True,
            "escalate_reason": "policy",
        }

    matches = hs.match_topics(question)
    if not matches and not kb:
        return {
            "handled": False,
            "answer": hs.NO_MATCH_TEXT,
            "links": [],
            "ai_generated": False,
            "provider": "no-match",
            "should_escalate": True,
            "escalate_reason": "no_match",
        }

    links = [_kb_link(a) for a in kb] + [
        {"label": m.topic.title, "href": m.topic.route, "restricted": m.topic.restricted}
        for m in matches
    ]

    # Grounding: the team's own articles first, then the module registry.
    # Nothing else is supplied, which is what stops the helper describing
    # features and policies that do not exist.
    passages = [
        {
            "source": f"Help centre: {a.title}",
            "kind": "kb",
            "text": (a.summary or "") + "\n\n" + (a.body_md or ""),
        }
        for a in kb
    ] + hs.grounding_passages(matches)

    answer = _fallback(kb, matches, question)
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
                passages=[Passage(**p) for p in passages],
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
        "kb_slugs": [a.slug for a in kb],
        "ai_generated": ai_generated,
        "provider": provider,
        # Even a handled question can be escalated: whether the answer worked
        # is the reader's call, not the helper's.
        "should_escalate": False,
        "escalate_reason": "",
    }


def _kb_link(article: KbArticle) -> dict:
    return {
        "label": article.title,
        "href": f"/help/{article.slug}",
        "restricted": False,
    }


def _fallback(kb: list[KbArticle], matches, question: str) -> str:
    """The answer when no model is available. Accurate, just flatter."""
    parts = []
    for a in kb:
        parts.append(f"{a.title} — {a.summary or 'see the help centre article'}")
    if matches:
        parts.append(hs.compose_fallback(question, matches))
    return "\n\n".join(parts) if parts else hs.NO_MATCH_TEXT


class EscalateRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    page_path: str | None = None
    topic_keys: list[str] = Field(default_factory=list)
    reason: str = "no_match"


# The helper's guess at a ticket category, from the reason it gave up. It is a
# starting point for triage, not a claim: an administrator can change it, and
# "other" is the honest default when the helper simply did not understand.
_CATEGORY = {"policy": "billing", "no_match": "other"}


@router.post("/help/escalate", summary="Open a support ticket from the helper")
async def help_escalate(
    body: EscalateRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_active_user),
) -> dict:
    """Open a real ticket in the existing queue.

    Not a private table. This lands in the same place as a ticket raised from
    the Help Center, so it inherits the one-business-day promise, the admin
    tools, and the reply thread - and support sees one queue rather than two.
    """
    question = body.question.strip()
    subject = question if len(question) <= 120 else question[:117] + "..."

    # The context an administrator needs and the person will not think to
    # include: where they were, and what the helper tried before giving up.
    context = [f"Asked through the in-app helper.", f"Page: {body.page_path or 'unknown'}"]
    if body.topic_keys:
        context.append("Helper matched these areas but did not resolve it: " + ", ".join(body.topic_keys))
    else:
        context.append("The helper matched nothing, so this may be a gap in the help centre.")

    ticket = SupportTicket(
        user_id=current_user.id,
        subject=subject,
        priority="normal",
        category=_CATEGORY.get(body.reason, "other"),
    )
    db.add(ticket)
    await db.flush()
    db.add(
        SupportMessage(
            ticket_id=ticket.id,
            author_id=current_user.id,
            body_md=question + "\n\n---\n" + "\n".join(context),
        )
    )
    ticket.last_user_reply_at = func.now()
    await db.commit()
    await db.refresh(ticket)

    return {
        "ticket_id": str(ticket.id),
        "status": ticket.status,
        # Short enough to read out, and it is the real ticket id so support can
        # find it without a second lookup table.
        "reference": str(ticket.id)[:8],
        "message": (
            "Opened support ticket "
            f"{str(ticket.id)[:8]}. Support answers within one business day, "
            "and you can follow it in your tickets."
        ),
    }

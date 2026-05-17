"""
Phase 11.3 — Email lifecycle.

`dispatch(event_name, user_id, payload)` looks up active campaigns matching
the event and queues `email_sends` rows. If `RESEND_API_KEY` is set the
queued send is delivered via Resend; otherwise it stays in `queued` state
and the test/dev harness can simulate delivery via /admin/email-sends/{id}/mark.
"""

from __future__ import annotations

import os
import re
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.gtm import (
    EmailCampaign,
    EmailSend,
    EmailSendStatus,
    EmailTemplate,
    EmailUnsubscribe,
)
from app.models.user import User


_MERGE_FIELD = re.compile(r"\{\{\s*([A-Za-z0-9_.]+)\s*\}\}")


def render_template(text: str, payload: dict) -> str:
    """Tiny mustache-style merge: {{ foo.bar }} → payload['foo']['bar']."""
    def _resolve(match: re.Match[str]) -> str:
        path = match.group(1).split(".")
        node: object = payload
        for key in path:
            if isinstance(node, dict) and key in node:
                node = node[key]
            else:
                return ""
        return str(node)
    return _MERGE_FIELD.sub(_resolve, text)


async def _is_unsubscribed(db: AsyncSession, user_id: UUID, campaign_slug: str) -> bool:
    q = await db.execute(
        select(EmailUnsubscribe).where(
            EmailUnsubscribe.user_id == user_id,
            EmailUnsubscribe.scope.in_(("all", "marketing", campaign_slug)),
        )
    )
    return q.scalar_one_or_none() is not None


async def dispatch(
    db: AsyncSession,
    *,
    event: str,
    user_id: UUID,
    payload: Optional[dict] = None,
) -> list[EmailSend]:
    """Find active campaigns for the event and queue sends."""
    payload = payload or {}
    cq = await db.execute(
        select(EmailCampaign).where(
            EmailCampaign.trigger_event == event,
            EmailCampaign.is_active.is_(True),
        )
    )
    campaigns = list(cq.scalars().all())
    if not campaigns:
        return []

    user = await db.get(User, user_id)
    if user is None or not user.email:
        return []

    sends: list[EmailSend] = []
    for camp in campaigns:
        if await _is_unsubscribed(db, user_id, camp.slug):
            continue
        tq = await db.execute(
            select(EmailTemplate).where(
                EmailTemplate.slug == camp.template_slug,
                EmailTemplate.is_active.is_(True),
            )
        )
        tpl = tq.scalar_one_or_none()
        if tpl is None:
            continue

        # Merge basic user fields into payload so templates can {{ user.first_name }}.
        merged = {
            "user": {
                "first_name": user.first_name or "",
                "last_name": user.last_name or "",
                "email": user.email,
            },
            **payload,
        }
        subject = render_template(tpl.subject, merged)
        send = EmailSend(
            user_id=user_id, campaign_id=camp.id, template_slug=tpl.slug,
            to_email=user.email, subject=subject,
            status=EmailSendStatus.queued.value, provider="stub",
            context_jsonb=merged,
        )
        db.add(send)
        sends.append(send)
    await db.commit()
    for s in sends:
        await db.refresh(s)
    # Attempt immediate delivery if Resend is wired up.
    for s in sends:
        await _try_deliver(db, send=s)
    return sends


async def _try_deliver(db: AsyncSession, *, send: EmailSend) -> None:
    """Attempt provider send (Resend) if configured; else leave queued."""
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        return
    try:
        import resend  # type: ignore
        resend.api_key = api_key
        tq = await db.execute(select(EmailTemplate).where(EmailTemplate.slug == send.template_slug))
        tpl = tq.scalar_one_or_none()
        if tpl is None:
            return
        html = render_template(tpl.html, send.context_jsonb)
        text = render_template(tpl.text, send.context_jsonb)
        r = resend.Emails.send({
            "from": os.environ.get("RESEND_FROM", "EUREKA <no-reply@eureka.dev>"),
            "to": send.to_email,
            "subject": send.subject,
            "html": html,
            "text": text,
        })
        send.provider = "resend"
        send.provider_message_id = r.get("id") if isinstance(r, dict) else None
        send.status = EmailSendStatus.sent.value
        send.sent_at = datetime.now(timezone.utc)
    except ImportError:
        return
    except Exception as exc:  # pragma: no cover
        send.status = EmailSendStatus.failed.value
        send.error_message = str(exc)
    finally:
        await db.commit()

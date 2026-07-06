"""Assignment due-date reminders.

send_due_reminders is the periodic job the beat scheduler drives. It finds
assignments coming due within the configured window that have not been reminded,
creates an in-app notification for each student, and stamps reminded_at so each
assignment is reminded exactly once. Pure of Celery, so it is unit-testable with
a plain session and an injected clock.
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.domains.assessment.models import Assessment, AssignmentTarget
from app.domains.notifications.service import notify


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


async def send_due_reminders(session: AsyncSession, now: datetime | None = None) -> int:
    """Remind students of assignments due within the window. Returns the count.

    Idempotent: only targets with a due date, no reminder yet, and a due time at
    or before now plus the window are reminded, and each is stamped so a later
    run does not remind it again.
    """
    now = now or _now()
    window = now + timedelta(hours=get_settings().reminder_window_hours)

    rows = (
        await session.execute(
            select(AssignmentTarget, Assessment)
            .join(Assessment, Assessment.id == AssignmentTarget.assessment_id)
            .where(
                AssignmentTarget.due_at.is_not(None),
                AssignmentTarget.reminded_at.is_(None),
                AssignmentTarget.due_at <= window,
            )
        )
    ).all()

    sent = 0
    for target, assessment in rows:
        due_label = target.due_at.strftime("%Y-%m-%d %H:%M UTC") if target.due_at else "soon"
        await notify(
            session,
            target.user_id,
            "reminder",
            "Assignment due soon",
            f"{assessment.title} is due {due_label}.",
            link="/practice",
        )
        target.reminded_at = now
        sent += 1

    await session.flush()
    return sent

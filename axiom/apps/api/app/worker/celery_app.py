"""Celery application.

Broker and backend are Redis. A single sample task proves the pipeline. Real
task modules are registered per domain as later phases land.
"""

from __future__ import annotations

from celery import Celery

from app.core.config import get_settings

settings = get_settings()

celery_app = Celery(
    "axiom",
    broker=settings.redis_url,
    backend=settings.redis_url,
)
celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    task_track_started=True,
    timezone="UTC",
    enable_utc=True,
)

# The beat scheduler runs the assignment due-date reminder scan on an interval.
celery_app.conf.beat_schedule = {
    "assignment-due-reminders": {
        "task": "axiom.due_reminders",
        "schedule": settings.reminder_interval_seconds,
    },
}


@celery_app.task(name="axiom.ping")
def ping() -> str:
    """A trivial task used by the smoke check to prove the worker runs."""
    return "pong"


# Register every ORM model on Base.metadata so a task's own engine can resolve
# cross-domain foreign keys (for example notifications.user_id -> users.id)
# regardless of which task's import chain runs. Kept at the bottom, after the app
# object exists.
from app.domains.adaptive import models as _adaptive_models  # noqa: E402, F401
from app.domains.assessment import models as _assessment_models  # noqa: E402, F401
from app.domains.attempts import models as _attempts_models  # noqa: E402, F401
from app.domains.content import models as _content_models  # noqa: E402, F401
from app.domains.copilot import models as _copilot_models  # noqa: E402, F401
from app.domains.curriculum import models as _curriculum_models  # noqa: E402, F401
from app.domains.gamification import models as _gamification_models  # noqa: E402, F401
from app.domains.identity import models as _identity_models  # noqa: E402, F401
from app.domains.integrations import models as _integrations_models  # noqa: E402, F401
from app.domains.notifications import models as _notifications_models  # noqa: E402, F401
from app.domains.proctoring import models as _proctoring_models  # noqa: E402, F401
from app.domains.tutoring import models as _tutoring_models  # noqa: E402, F401

# Import task modules so their @celery_app.task jobs register on the app. tasks
# import celery_app, which already exists here.
from app.worker import tasks as _tasks  # noqa: E402, F401

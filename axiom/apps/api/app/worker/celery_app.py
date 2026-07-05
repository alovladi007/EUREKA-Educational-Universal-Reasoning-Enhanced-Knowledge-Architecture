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


@celery_app.task(name="axiom.ping")
def ping() -> str:
    """A trivial task used by the smoke check to prove the worker runs."""
    return "pong"

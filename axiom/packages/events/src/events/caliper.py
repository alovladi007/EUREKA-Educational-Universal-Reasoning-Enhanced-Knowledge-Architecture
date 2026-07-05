"""Caliper-style event model.

Kept deliberately small for Phase 0. The analytics service (Phase 2) will
consume these off a queue and roll them up. The shape is stable so downstream
consumers can rely on it.
"""

from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field


class EventAction(str, Enum):
    """The verb of the event, a subset of the Caliper action vocabulary."""

    started = "Started"
    submitted = "Submitted"
    graded = "Graded"
    mastery_changed = "MasteryChanged"
    awarded = "Awarded"
    flagged = "Flagged"
    viewed = "Viewed"


class EventObject(BaseModel):
    """The thing the action was performed on."""

    model_config = ConfigDict(extra="allow")

    type: str
    id: str


class Event(BaseModel):
    """A single learning event.

    actor is the EUREKA user id. tenant_id scopes the event to an organization.
    extensions carries action-specific detail (score, mastery delta, item id).
    """

    id: str = Field(default_factory=lambda: str(uuid4()))
    actor: str
    action: EventAction
    object: EventObject
    tenant_id: str | None = None
    event_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    extensions: dict = Field(default_factory=dict)


def make_event(
    actor: str,
    action: EventAction,
    object_type: str,
    object_id: str,
    *,
    tenant_id: str | None = None,
    event_time: datetime | None = None,
    **extensions: object,
) -> Event:
    """Convenience constructor.

    event_time is passed in by the caller (do not rely on an implicit clock in
    contexts that must be deterministic). Defaults to now when omitted.
    """

    return Event(
        actor=actor,
        action=action,
        object=EventObject(type=object_type, id=object_id),
        tenant_id=tenant_id,
        event_time=event_time or datetime.now(timezone.utc),
        extensions=dict(extensions),
    )

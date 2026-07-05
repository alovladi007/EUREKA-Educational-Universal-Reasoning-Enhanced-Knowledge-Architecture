# axiom-events

Caliper-style learning event definitions for AXIOM. Every meaningful action
emits an Event; the analytics service (Phase 2) ingests and rolls them up.

## Shape

An Event has an actor (EUREKA user id), an action (Started, Submitted, Graded,
MasteryChanged, Awarded, Flagged, Viewed), an object (type plus id), an
optional tenant id, an event time, and a free-form extensions bag.

## Usage

    from events import make_event, EventAction

    ev = make_event(
        actor="<eureka-user-id>",
        action=EventAction.graded,
        object_type="Attempt",
        object_id="<attempt-id>",
        tenant_id="<tenant-id>",
        score=1.0,
        grader="cas",
    )

## Conventions

- Pydantic v2 only. ASCII punctuation only.

"""Caliper-style learning event definitions for AXIOM.

Every meaningful action (a graded attempt, a mastery change, an XP award, an
integrity flag) emits an Event. analytics ingests these. The schema is a
pragmatic subset of the IMS Caliper Analytics vocabulary: an actor, an action,
an object, a timestamp, and a free-form extensions bag.
"""

from events.caliper import Event, EventAction, EventObject, make_event

__all__ = ["Event", "EventAction", "EventObject", "make_event"]

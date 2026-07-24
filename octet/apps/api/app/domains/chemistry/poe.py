"""Signed tickets carrying predict, observe, explain state.

The teaching value of a predict, observe, explain item rests entirely on the
ordering. A learner who can see the simulation before committing to a
prediction is not predicting, and a prediction that can be edited afterwards
is not a commitment. So the ordering has to be enforced by the server, not by
the client politely following the steps.

Holding that state in process memory would work on one worker and break on
two, and would lose every in flight attempt on restart. Instead the state
travels with the client inside an HMAC signed ticket. The client cannot forge
a ticket claiming a prediction it never made, because it does not have the
signing key. The server does not have to remember anything.

The ticket binds the user id, so one learner's ticket cannot be replayed by
another, and it carries an issue time so a stale ticket can be rejected.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time

from app.core.config import get_settings

TICKET_TTL_SECONDS = 60 * 60 * 6
PHASES = ("predict", "observe", "explain", "done")


class TicketError(ValueError):
    """Raised when a ticket is missing, malformed, forged, or expired."""


def _b64(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")


def _unb64(text: str) -> bytes:
    padding = "=" * (-len(text) % 4)
    return base64.urlsafe_b64decode(text + padding)


def _sign(payload: bytes) -> str:
    secret = get_settings().jwt_secret.encode("utf-8")
    return _b64(hmac.new(secret, payload, hashlib.sha256).digest())


def issue(state: dict) -> str:
    """Sign a state dict into a ticket."""
    body = json.dumps(state, separators=(",", ":"), sort_keys=True).encode("utf-8")
    return f"{_b64(body)}.{_sign(body)}"


def read(ticket: str, *, user_id: str, now: float | None = None) -> dict:
    """Verify and decode a ticket, or raise TicketError.

    Signature is checked with a constant time compare before the payload is
    trusted for anything at all.
    """
    if not ticket or "." not in ticket:
        raise TicketError("no attempt ticket was supplied")
    encoded, signature = ticket.rsplit(".", 1)
    try:
        body = _unb64(encoded)
    except Exception as exc:
        raise TicketError("attempt ticket is malformed") from exc
    if not hmac.compare_digest(_sign(body), signature):
        raise TicketError("attempt ticket signature does not verify")
    try:
        state = json.loads(body)
    except json.JSONDecodeError as exc:
        raise TicketError("attempt ticket payload is not readable") from exc
    if not isinstance(state, dict):
        raise TicketError("attempt ticket payload is not an object")

    if state.get("user") != user_id:
        raise TicketError("attempt ticket belongs to a different learner")
    issued = float(state.get("iat", 0))
    current = time.time() if now is None else now
    if current - issued > TICKET_TTL_SECONDS:
        raise TicketError("attempt ticket has expired, start the activity again")
    if state.get("phase") not in PHASES:
        raise TicketError("attempt ticket names an unknown phase")
    return state


def start(user_id: str, item_id: str, *, now: float | None = None) -> dict:
    return {
        "user": user_id,
        "item": item_id,
        "phase": "predict",
        "iat": float(time.time() if now is None else now),
    }


def require_phase(state: dict, expected: str) -> None:
    """Refuse an out of order step, and say why in the learner's terms."""
    actual = state.get("phase")
    if actual == expected:
        return
    if PHASES.index(actual) > PHASES.index(expected):
        if expected == "predict":
            raise TicketError(
                "This prediction is already recorded. A prediction cannot be "
                "changed once the result is visible."
            )
        raise TicketError(f"The {expected} step is already complete.")
    raise TicketError(f"Complete the {actual} step before the {expected} step.")

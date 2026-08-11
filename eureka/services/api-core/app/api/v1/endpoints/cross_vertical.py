"""Cross-vertical mastery (integration contract item 2.1, decided 2026-08-10).

The decision the contract asked for: EUREKA exposes cross-vertical mastery,
rather than verticals querying each other directly. Two verticals asking each
other becomes N-squared as verticals are added, and the shell already holds
identity - so the shell holds the crossing point too.

GET /me/cross-vertical/mastery?vertical=axiom forwards to the vertical's own
mastery endpoint with the CALLER'S token (the verticals share the EUREKA
identity, so the vertical answers for the same learner and applies its own
auth). This service adds no interpretation: the vertical owns its mastery
model, and this endpoint returns that answer unmodified, naming its source.

OCTET's concrete use: chemistry nodes that lean on mathematics (the build
prompt names C110, C201, OD01, PS05) can ask here whether the learner's AXIOM
work already covers the prerequisite, instead of holding its own copy of
another vertical's mastery state.
"""

from __future__ import annotations

import logging

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request

from app.core.config import settings
from app.models import User
from app.utils.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter()

# vertical -> (base URL, mastery path). Adding a vertical is one line here
# once it exposes a mastery endpoint that accepts the shared EUREKA token.
VERTICALS: dict[str, tuple[str, str]] = {
    "axiom": (settings.AXIOM_API_URL, "/api/v1/mastery/me"),
}


@router.get("/me/cross-vertical/mastery")
async def cross_vertical_mastery(
    vertical: str,
    request: Request,
    _user: User = Depends(get_current_active_user),
):
    """The caller's own mastery state in another vertical, verbatim."""
    key = vertical.strip().lower()
    if key not in VERTICALS:
        raise HTTPException(
            422,
            f"unknown vertical {vertical!r}; available: {', '.join(sorted(VERTICALS))}",
        )
    base, path = VERTICALS[key]
    auth = request.headers.get("authorization", "")
    if not auth.lower().startswith("bearer "):
        raise HTTPException(401, "missing bearer token")
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(f"{base}{path}", headers={"Authorization": auth})
    except httpx.HTTPError as exc:
        logger.error("cross-vertical call failed: %s %s", key, exc)
        raise HTTPException(503, f"the {key} vertical is unreachable") from exc
    if resp.status_code >= 400:
        raise HTTPException(resp.status_code, resp.text[:500])
    return {"vertical": key, "source": f"{key} mastery API", "mastery": resp.json()}

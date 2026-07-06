"""Tutoring routes: session REST plus the shared-whiteboard WebSocket relay.

REST (signed-in users) creates and looks up sessions. The WebSocket endpoint is
the live channel: authenticated by a token query parameter (a browser cannot set
an Authorization header on a WebSocket), it relays whiteboard, cursor, chat, and
pushed-item messages to the other peers in the room.

Video and recording are intentionally absent: they require a real-time media
server (WebRTC SFU such as LiveKit or mediasoup), which is out of scope here. The
signaling channel exists; the media plane does not.
"""

from __future__ import annotations

import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    WebSocket,
    WebSocketDisconnect,
)
from pydantic import BaseModel
from shared_schemas.identity import UserOut
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session, get_sessionmaker
from app.core.security import get_current_user, get_identity
from app.domains.tutoring import service as svc
from app.domains.tutoring.hub import Peer, hub

router = APIRouter(prefix="/tutoring", tags=["tutoring"])

# Message types a peer may broadcast. Anything else is ignored, so a client
# cannot use the relay as a general-purpose fan-out.
_RELAY_TYPES = {"draw", "clear", "cursor", "chat", "push_item"}


class CreateSession(BaseModel):
    title: str = "Tutoring session"


def _session_dict(row) -> dict:
    return {
        "id": str(row.id),
        "title": row.title,
        "join_code": row.join_code,
        "status": row.status,
        "tutor_id": str(row.tutor_id),
    }


@router.post("/sessions", summary="Open a tutoring session (returns a join code)")
async def create(
    body: CreateSession,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    row = await svc.create_session(session, uuid.UUID(user.id), body.title)
    await session.commit()
    return _session_dict(row)


@router.get("/sessions/{code}", summary="Look up a tutoring session by join code")
async def get(
    code: str,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    row = await svc.get_by_code(session, code)
    if row is None or row.status != "active":
        raise HTTPException(status_code=404, detail="session not found or ended")
    return {**_session_dict(row), "peers": hub.count(str(row.id))}


@router.post("/sessions/{session_id}/end", summary="End a tutoring session (tutor)")
async def end(
    session_id: str,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    try:
        parsed = uuid.UUID(session_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="invalid session id") from exc
    ok = await svc.end_session(session, parsed, uuid.UUID(user.id))
    if not ok:
        raise HTTPException(status_code=404, detail="session not found or not yours")
    await session.commit()
    return {"status": "ended"}


@router.websocket("/ws/{session_id}")
async def tutoring_ws(
    websocket: WebSocket,
    session_id: str,
    token: str = Query(default=""),
) -> None:
    # Authenticate from the token query param (WebSockets carry no auth header).
    try:
        principal = get_identity().verify(token)
    except Exception:  # noqa: BLE001 - any verification failure rejects the socket.
        await websocket.close(code=1008)
        return
    try:
        sid = uuid.UUID(session_id)
    except ValueError:
        await websocket.close(code=1008)
        return

    # Validate the session with a short-lived DB session, then release it so the
    # long-lived socket does not hold a connection open.
    async with get_sessionmaker()() as db:
        row = await svc.get_by_id(db, sid)
    if row is None or row.status != "active":
        await websocket.close(code=1008)
        return

    await websocket.accept()
    peer = Peer(principal.sub, websocket.send_json)
    await hub.join(session_id, peer)
    await hub.broadcast(session_id, {"type": "presence", "count": hub.count(session_id)})
    try:
        while True:
            message = await websocket.receive_json()
            if not isinstance(message, dict) or message.get("type") not in _RELAY_TYPES:
                continue
            message["from"] = principal.sub
            await hub.broadcast(session_id, message, exclude=peer)
    except WebSocketDisconnect:
        pass
    finally:
        await hub.leave(session_id, peer)
        await hub.broadcast(session_id, {"type": "presence", "count": hub.count(session_id)})

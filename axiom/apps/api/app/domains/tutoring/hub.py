"""In-process WebSocket hub for tutoring rooms.

A room is the set of live connections for one tutoring session. A message from
any peer is relayed to the others, which is what makes the whiteboard, cursors,
chat, and pushed items shared in real time.

Scope note: this hub is per-process, so it works within a single API instance.
Scaling to multiple instances needs a shared bus (Redis pub/sub) behind the same
broadcast() interface; that is a deployment upgrade, not a change callers see.
"""

from __future__ import annotations

import asyncio
from collections import defaultdict


class Peer:
    """A connected client. Wraps whatever object can send_json/JSON text.

    Kept minimal (a send coroutine and an id) so the hub can be unit-tested with
    a fake peer that has no real socket.
    """

    def __init__(self, peer_id: str, send):  # send: Callable[[dict], Awaitable]
        self.peer_id = peer_id
        self.send = send


class TutoringHub:
    def __init__(self) -> None:
        self._rooms: dict[str, set[Peer]] = defaultdict(set)
        self._lock = asyncio.Lock()

    async def join(self, room: str, peer: Peer) -> None:
        async with self._lock:
            self._rooms[room].add(peer)

    async def leave(self, room: str, peer: Peer) -> None:
        async with self._lock:
            self._rooms.get(room, set()).discard(peer)
            if not self._rooms.get(room):
                self._rooms.pop(room, None)

    def peers(self, room: str) -> set[Peer]:
        return set(self._rooms.get(room, set()))

    def count(self, room: str) -> int:
        return len(self._rooms.get(room, set()))

    async def broadcast(self, room: str, message: dict, *, exclude: Peer | None = None) -> None:
        """Send message to every peer in the room except the sender.

        A peer whose send fails is dropped from the room, so a dead connection
        does not block the others.
        """
        dead: list[Peer] = []
        for peer in self.peers(room):
            if peer is exclude:
                continue
            try:
                await peer.send(message)
            except Exception:  # noqa: BLE001 - a broken peer is simply removed.
                dead.append(peer)
        for peer in dead:
            await self.leave(room, peer)


# One hub per API process.
hub = TutoringHub()

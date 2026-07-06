"""Tests for the tutoring hub (the relay core) and the session REST endpoints.

The WebSocket relay logic lives in TutoringHub and is unit-tested with fake peers
(no real socket needed), so the shared-state behavior - broadcast to others,
exclude the sender, drop a dead peer - is verified deterministically. The session
lifecycle is tested through the REST endpoints.
"""

from __future__ import annotations

import pytest

from app.domains.tutoring.hub import Peer, TutoringHub
from tests.conftest import AUTH

# --- hub (relay core) ----------------------------------------------------


@pytest.mark.asyncio
async def test_broadcast_reaches_others_but_not_sender():
    got = {"a": [], "b": []}

    async def send_a(m):
        got["a"].append(m)

    async def send_b(m):
        got["b"].append(m)

    hub = TutoringHub()
    pa, pb = Peer("a", send_a), Peer("b", send_b)
    await hub.join("room", pa)
    await hub.join("room", pb)
    assert hub.count("room") == 2

    await hub.broadcast("room", {"type": "draw", "x": 1}, exclude=pa)
    assert got["a"] == []
    assert got["b"] == [{"type": "draw", "x": 1}]


@pytest.mark.asyncio
async def test_dead_peer_is_dropped():
    async def send_ok(_m):
        return None

    async def send_dead(_m):
        raise RuntimeError("socket closed")

    hub = TutoringHub()
    ok, dead = Peer("ok", send_ok), Peer("dead", send_dead)
    await hub.join("room", ok)
    await hub.join("room", dead)

    await hub.broadcast("room", {"type": "chat"})
    # The failing peer is removed; the healthy one remains.
    assert hub.count("room") == 1


@pytest.mark.asyncio
async def test_leave_empties_the_room():
    hub = TutoringHub()
    p = Peer("x", lambda _m: None)  # send is never called here
    await hub.join("room", p)
    await hub.leave("room", p)
    assert hub.count("room") == 0


# --- session REST --------------------------------------------------------


@pytest.mark.asyncio
async def test_create_and_get_session(client):
    created = await client.post(
        "/api/v1/tutoring/sessions", json={"title": "Algebra help"}, headers=AUTH
    )
    assert created.status_code == 200, created.text
    body = created.json()
    assert len(body["join_code"]) == 6 and body["status"] == "active"

    found = await client.get(
        f"/api/v1/tutoring/sessions/{body['join_code']}", headers=AUTH
    )
    assert found.status_code == 200
    assert found.json()["id"] == body["id"] and found.json()["peers"] == 0


@pytest.mark.asyncio
async def test_get_unknown_code_is_404(client):
    res = await client.get("/api/v1/tutoring/sessions/ZZZZZZ", headers=AUTH)
    assert res.status_code == 404


@pytest.mark.asyncio
async def test_owner_can_end_session(client):
    created = await client.post("/api/v1/tutoring/sessions", json={}, headers=AUTH)
    sid = created.json()["id"]
    ended = await client.post(f"/api/v1/tutoring/sessions/{sid}/end", headers=AUTH)
    assert ended.status_code == 200 and ended.json()["status"] == "ended"
    # A code lookup no longer finds it once ended.
    code = created.json()["join_code"]
    assert (await client.get(f"/api/v1/tutoring/sessions/{code}", headers=AUTH)).status_code == 404

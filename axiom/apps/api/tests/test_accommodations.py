"""RW-6: accommodations and accessibility (Build prompt Section 13).

Extra time, text-to-speech, high-contrast, and reduced-motion accommodations,
and the effective time limit an extra-time accommodation produces.
"""

from __future__ import annotations

from app.domains.accommodations.service import (
    effective_time_limit_minutes,
    get_accommodations,
    set_accommodations,
)
from app.domains.identity.models import User
from tests.conftest import AUTH


async def _user(session, tag: str) -> User:
    user = User(eureka_user_id=tag, email=f"{tag}@x.com", display_name=tag)
    session.add(user)
    await session.flush()
    return user


async def test_defaults_and_update(db_session):
    user = await _user(db_session, "acc1")
    defaults = await get_accommodations(db_session, user.id)
    assert defaults["extra_time_multiplier"] == 1.0
    assert defaults["high_contrast"] is False

    updated = await set_accommodations(
        db_session, user.id, extra_time_multiplier=1.5, high_contrast=True, text_to_speech=True
    )
    assert updated["extra_time_multiplier"] == 1.5
    assert updated["high_contrast"] is True
    assert updated["text_to_speech"] is True


async def test_extra_time_never_below_standard(db_session):
    user = await _user(db_session, "acc2")
    # A multiplier below 1.0 would shorten a test; extra time only ever adds.
    updated = await set_accommodations(db_session, user.id, extra_time_multiplier=0.5)
    assert updated["extra_time_multiplier"] == 1.0


async def test_effective_time_limit_applies_multiplier(db_session):
    user = await _user(db_session, "acc3")
    await set_accommodations(db_session, user.id, extra_time_multiplier=1.5)
    assert await effective_time_limit_minutes(db_session, user.id, 30) == 45
    # An untimed assessment stays untimed regardless of the multiplier.
    assert await effective_time_limit_minutes(db_session, user.id, None) is None


async def test_my_accommodations_endpoints(client):
    got = await client.get("/api/v1/accommodations/me", headers=AUTH)
    assert got.status_code == 200
    assert "extra_time_multiplier" in got.json()

    put = await client.put(
        "/api/v1/accommodations/me",
        json={"high_contrast": True, "reduced_motion": True},
        headers=AUTH,
    )
    assert put.status_code == 200
    assert put.json()["high_contrast"] is True


async def test_setting_a_students_accommodations_is_teacher_only(client):
    # The mock identity is a student; setting another user's accommodations is
    # a teacher/admin action.
    resp = await client.put(
        "/api/v1/accommodations/users/00000000-0000-0000-0000-000000000001",
        json={"extra_time_multiplier": 2.0},
        headers=AUTH,
    )
    assert resp.status_code == 403

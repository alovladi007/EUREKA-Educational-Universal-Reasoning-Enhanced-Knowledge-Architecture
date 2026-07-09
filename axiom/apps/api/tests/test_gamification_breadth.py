"""RW-5: gamification breadth.

Opt-in leaderboard (privacy), avatars/aliases, and skill-graph-tied quests.
"""

from __future__ import annotations

from sqlalchemy import select

from app.domains.curriculum.models import KnowledgeNode
from app.domains.gamification.service import (
    leaderboard,
    list_quests,
    record_practice_result,
    seed_quests,
    set_preferences,
)
from app.domains.identity.models import User


async def _make_user(session, tag: str) -> User:
    user = User(eureka_user_id=tag, email=f"{tag}@x.com", display_name=f"Real {tag}")
    session.add(user)
    await session.flush()
    return user


async def test_leaderboard_is_opt_in_and_uses_alias(db_session):
    opted = await _make_user(db_session, "g_opt")
    hidden = await _make_user(db_session, "g_hide")
    # Give both some XP so ordering is defined.
    await record_practice_result(
        db_session, opted.id, correct=True, leveled_up=False, mastered=False
    )
    await record_practice_result(
        db_session, hidden.id, correct=True, leveled_up=False, mastered=False
    )

    await set_preferences(
        db_session, opted.id, leaderboard_opt_in=True, display_alias="Ada", avatar="star"
    )
    await set_preferences(db_session, hidden.id, leaderboard_opt_in=False)

    board = await leaderboard(db_session)
    listed_ids = {row["user_id"] for row in board}
    assert str(opted.id) in listed_ids
    assert str(hidden.id) not in listed_ids  # not opted in -> not shown
    ada = next(r for r in board if r["user_id"] == str(opted.id))
    assert ada["name"] == "Ada"  # alias, not the real display name
    assert ada["name"] != "Real g_opt"
    assert ada["avatar"] == "star"


async def test_preferences_update_only_given_fields(db_session):
    user = await _make_user(db_session, "g_pref")
    await set_preferences(db_session, user.id, avatar="rocket")
    prefs = await set_preferences(db_session, user.id, leaderboard_opt_in=True)
    assert prefs["avatar"] == "rocket"  # unchanged
    assert prefs["leaderboard_opt_in"] is True


async def test_quest_completes_on_target_node_mastery(db_session):
    await seed_quests(db_session)
    prealg = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "PREALG"))
    ).scalar_one_or_none()
    assert prealg is not None, "expected the seeded PREALG node"
    user = await _make_user(db_session, "g_quest")

    result = await record_practice_result(
        db_session, user.id, correct=True, leveled_up=True, mastered=True, node_id=prealg.id
    )
    assert "master_prealg" in result["completed_quests"]

    quests = await list_quests(db_session, user.id)
    prealg_quest = next(q for q in quests if q["code"] == "master_prealg")
    assert prealg_quest["status"] == "completed"

    # Completing again does not double-award.
    again = await record_practice_result(
        db_session, user.id, correct=True, leveled_up=False, mastered=True, node_id=prealg.id
    )
    assert "master_prealg" not in again["completed_quests"]

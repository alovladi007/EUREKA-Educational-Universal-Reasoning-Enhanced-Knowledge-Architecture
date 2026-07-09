"""Gamification: XP, levels, streaks, and badges tied to real progress."""

from __future__ import annotations

from sqlalchemy import select

from app.domains.attempts.models import Attempt, Response, Score
from app.domains.curriculum.models import KnowledgeNode
from app.domains.gamification.service import (
    award_xp,
    get_profile,
    leaderboard,
    record_practice_result,
    seed_badges,
    set_preferences,
)
from app.domains.identity.models import User
from tests.conftest import AUTH


async def _correct_score(db_session, user_id, node_id) -> None:
    """Persist one correct scored response so badge counters have real history."""
    attempt = Attempt(user_id=user_id, kind="practice", status="in_progress")
    db_session.add(attempt)
    await db_session.flush()
    resp = Response(attempt_id=attempt.id, user_id=user_id, node_id=node_id, answer={})
    db_session.add(resp)
    await db_session.flush()
    db_session.add(Score(response_id=resp.id, is_correct=True, score=1.0))
    await db_session.flush()


async def test_seed_badges_is_idempotent(db_session):
    # conftest already seeded the catalogue, so a second run inserts nothing.
    assert await seed_badges(db_session) == 0


async def test_award_xp_rolls_level(db_session):
    user = User(eureka_user_id="g1", email="g1@x.com", display_name="G One")
    db_session.add(user)
    await db_session.flush()
    await award_xp(db_session, user.id, 120, "correct")
    profile = await get_profile(db_session, user.id)
    assert profile["xp_total"] == 120
    assert profile["level"] == 2  # 1 + 120 // 100


async def test_record_practice_result_awards_first_correct(db_session):
    user = User(eureka_user_id="g2", email="g2@x.com", display_name="G Two")
    db_session.add(user)
    await db_session.flush()
    node = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "ALG.1"))
    ).scalar_one()
    await _correct_score(db_session, user.id, node.id)

    result = await record_practice_result(
        db_session, user.id, correct=True, leveled_up=False, mastered=False
    )
    assert result["xp_total"] == 10
    assert result["streak_days"] == 1
    assert "first_correct" in result["new_badges"]


async def test_leaderboard_orders_by_xp(db_session):
    alpha = User(eureka_user_id="lb1", email="lb1@x.com", display_name="Alpha")
    beta = User(eureka_user_id="lb2", email="lb2@x.com", display_name="Beta")
    db_session.add_all([alpha, beta])
    await db_session.flush()
    await award_xp(db_session, alpha.id, 50, "correct")
    await award_xp(db_session, beta.id, 200, "correct")
    # Leaderboards are opt-in and listed under an alias; both opt in here.
    await set_preferences(db_session, alpha.id, leaderboard_opt_in=True, display_alias="Alpha")
    await set_preferences(db_session, beta.id, leaderboard_opt_in=True, display_alias="Beta")

    board = await leaderboard(db_session)
    names = [row["name"] for row in board]
    assert "Beta" in names and "Alpha" in names
    assert names.index("Beta") < names.index("Alpha")


async def test_gamification_me_endpoint(client):
    resp = await client.get("/api/v1/gamification/me", headers=AUTH)
    assert resp.status_code == 200
    body = resp.json()
    for key in ("xp_total", "level", "streak_days", "badges"):
        assert key in body


async def test_practice_answer_returns_gamification(client):
    served = (await client.post("/api/v1/practice/next", json={}, headers=AUTH)).json()
    ans = await client.post(
        "/api/v1/practice/answer",
        json={"response_token": served["response_token"], "answer": "10"},
        headers=AUTH,
    )
    assert ans.status_code == 200
    body = ans.json()
    assert "gamification" in body
    assert body["gamification"]["streak_days"] >= 1

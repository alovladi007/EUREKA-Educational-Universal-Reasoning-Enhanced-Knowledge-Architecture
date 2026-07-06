"""Tests for the SM-2 spaced-repetition algorithm and its scheduling wiring."""

from __future__ import annotations

import uuid

import pytest
from sqlalchemy import select

from app.domains.adaptive.models import ReviewSchedule
from app.domains.adaptive.service import due_reviews, schedule_review
from app.domains.adaptive.sm2 import (
    Sm2State,
    quality_from_correct,
    sm2_update,
)
from app.domains.curriculum.models import KnowledgeNode


def test_interval_progression_grows():
    # A fresh, well-recalled item goes 1 -> 6 -> interval*ease.
    state = Sm2State(ease=2.5, interval_days=0, reps=0)
    state = sm2_update(state, 5)
    assert state.interval_days == 1 and state.reps == 1
    state = sm2_update(state, 5)
    assert state.interval_days == 6 and state.reps == 2
    state = sm2_update(state, 5)
    # Third success multiplies by the (raised) ease, so it exceeds 6.
    assert state.interval_days > 6 and state.reps == 3


def test_lapse_resets_reps_and_interval():
    state = Sm2State(ease=2.6, interval_days=20, reps=4)
    lapsed = sm2_update(state, 2)
    assert lapsed.reps == 0
    assert lapsed.interval_days == 1
    # A lapse lowers the ease but never below the floor.
    assert lapsed.ease < state.ease
    assert lapsed.ease >= 1.3


def test_ease_has_a_floor():
    state = Sm2State(ease=1.3, interval_days=1, reps=1)
    for _ in range(5):
        state = sm2_update(state, 0)
    assert state.ease >= 1.3


def test_quality_mapping():
    assert quality_from_correct(True) == 5
    assert quality_from_correct(False) == 2
    assert quality_from_correct(True, 0.5) >= 3
    assert quality_from_correct(True, 1.0) == 5


@pytest.mark.asyncio
async def test_schedule_only_starts_once_mastered(db_session):
    node = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "ALG.1"))
    ).scalar_one()
    user_id = uuid.uuid4()

    # Not mastered and no existing schedule: nothing is created.
    none = await schedule_review(
        db_session, user_id, node.id, is_correct=True, score=1.0, mastery_level="developing"
    )
    assert none is None

    # Mastered: a schedule is created and becomes due after the interval.
    created = await schedule_review(
        db_session, user_id, node.id, is_correct=True, score=1.0, mastery_level="mastered"
    )
    assert created is not None and created["interval_days"] == 1
    row = (
        await db_session.execute(
            select(ReviewSchedule).where(
                ReviewSchedule.user_id == user_id, ReviewSchedule.node_id == node.id
            )
        )
    ).scalar_one()
    assert row.reps == 1


@pytest.mark.asyncio
async def test_due_reviews_lists_overdue_nodes(db_session):
    from datetime import UTC, datetime, timedelta

    node = (
        await db_session.execute(select(KnowledgeNode).where(KnowledgeNode.code == "ALG.2"))
    ).scalar_one()
    user_id = uuid.uuid4()
    db_session.add(
        ReviewSchedule(
            user_id=user_id,
            node_id=node.id,
            ease=2.5,
            interval_days=1,
            reps=1,
            due_at=datetime.now(UTC).replace(tzinfo=None) - timedelta(days=1),
        )
    )
    await db_session.flush()
    due = await due_reviews(db_session, user_id)
    assert any(r["code"] == "ALG.2" for r in due)

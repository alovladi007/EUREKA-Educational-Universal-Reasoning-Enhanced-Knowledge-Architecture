"""
Unit tests for SrsCard.apply_sm2 — the SuperMemo 2 update rule (P1-4).

The math is pure (no DB), so these tests construct SrsCard instances
in memory and call apply_sm2 directly. We don't go through the session,
the endpoint, or the schema layer — those are integration concerns.

Coverage targets:
  1) Initial pass: interval 0 → 1 day, repetitions 0 → 1.
  2) Second pass: interval 1 → 6 days, repetitions 1 → 2.
  3) Third+ pass: interval := round(interval × EF), repetitions += 1.
  4) Fail (q < 3) resets repetitions=0, interval=1 regardless of prior
     state. EF is updated but does NOT reset.
  5) EF floor at 1.3 — pounding "Again" can never push EF below floor.
  6) EF delta math matches Wozniak 1990 spec: ef += 0.1 − (5−q)(0.08+(5−q)×0.02).
  7) Counter updates: total_reviews +=1; total_correct +=1 iff pass.
  8) next_review := now + interval days (exact, to-the-second).
  9) Quality is clamped to [0,5] — q=-1 behaves like 0; q=7 behaves like 5.

We rely on `from app.models.srs_card import SrsCard, …` — no DB session
needed because SrsCard just inherits from Base; constructing an
unsaved instance is allowed.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4

import pytest

from app.models.srs_card import (
    SM2_INITIAL_EASE_FACTOR,
    SM2_MIN_EASE_FACTOR,
    SM2_PASS_QUALITY_THRESHOLD,
    SrsCard,
)


# ── Helpers ────────────────────────────────────────────────────────


def _new_card(
    *,
    ease_factor: float = SM2_INITIAL_EASE_FACTOR,
    interval_days: int = 0,
    repetitions: int = 0,
    total_reviews: int = 0,
    total_correct: int = 0,
) -> SrsCard:
    """Build a fresh in-memory SrsCard with the requested state.

    Bypasses the SQLAlchemy session — the model doesn't need to be
    persisted to test apply_sm2 since the function only mutates
    instance attributes.
    """
    return SrsCard(
        id=uuid4(),
        user_id=uuid4(),
        deck="test",
        front="Q",
        back="A",
        ease_factor=ease_factor,
        interval_days=interval_days,
        repetitions=repetitions,
        total_reviews=total_reviews,
        total_correct=total_correct,
    )


def _ef_delta(q: int) -> float:
    """Reference implementation of the SM-2 EF delta — kept here so the
    tests don't accidentally re-test against the model's own math."""
    return 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)


# ── Pass ladder: interval grows 1 → 6 → round(interval × EF) ────────


def test_first_pass_sets_interval_to_1_day_and_increments_reps():
    card = _new_card()  # reps=0, interval=0
    now = datetime(2026, 5, 24, 12, 0, 0, tzinfo=timezone.utc)

    card.apply_sm2(quality=5, now=now)

    assert card.repetitions == 1
    assert card.interval_days == 1
    assert card.next_review == now + timedelta(days=1)


def test_second_pass_sets_interval_to_6_days():
    card = _new_card(repetitions=1, interval_days=1)
    now = datetime(2026, 5, 25, tzinfo=timezone.utc)

    card.apply_sm2(quality=4, now=now)

    assert card.repetitions == 2
    assert card.interval_days == 6
    assert card.next_review == now + timedelta(days=6)


def test_third_pass_uses_ease_factor_multiplier():
    # reps=2, interval=6 → next interval = round(6 × EF). With initial
    # EF 2.5 and a q=4 review, EF becomes 2.5 + Δ(4) = 2.5 + 0.0 = 2.5,
    # so next interval = round(6 × 2.5) = 15.
    card = _new_card(
        ease_factor=SM2_INITIAL_EASE_FACTOR,
        interval_days=6,
        repetitions=2,
    )
    now = datetime(2026, 5, 30, tzinfo=timezone.utc)

    card.apply_sm2(quality=4, now=now)

    assert card.repetitions == 3
    assert card.interval_days == 15
    assert card.next_review == now + timedelta(days=15)


def test_pass_ladder_clamps_minimum_interval_to_1():
    # If EF were pushed all the way down to 1.3 and interval somehow
    # became 0.x via rounding, the model clamps to 1 day so we never
    # schedule "0-day from now" → infinite loop.
    card = _new_card(
        ease_factor=SM2_MIN_EASE_FACTOR,
        interval_days=0,  # contrived state — shouldn't happen normally
        repetitions=2,    # so the multiplier branch fires
    )
    now = datetime.now(timezone.utc)
    card.apply_sm2(quality=3, now=now)
    assert card.interval_days >= 1


# ── Fail (q < 3) resets the streak ─────────────────────────────────


@pytest.mark.parametrize("q", [0, 1, 2])
def test_fail_resets_repetitions_and_interval_regardless_of_quality(q):
    card = _new_card(repetitions=7, interval_days=42)
    now = datetime.now(timezone.utc)

    card.apply_sm2(quality=q, now=now)

    assert card.repetitions == 0
    assert card.interval_days == 1
    assert card.next_review == now + timedelta(days=1)


def test_fail_updates_ease_factor_but_does_not_reset_it():
    # SM-2 is intentional about NOT resetting EF on a single failure
    # (otherwise users churn EF on hard cards). Verify the function
    # only nudges EF by the standard delta.
    card = _new_card(ease_factor=2.0)
    expected_ef = max(SM2_MIN_EASE_FACTOR, 2.0 + _ef_delta(0))

    card.apply_sm2(quality=0, now=datetime.now(timezone.utc))

    assert card.ease_factor == pytest.approx(expected_ef, abs=1e-9)


# ── EF floor + EF delta ────────────────────────────────────────────


def test_ease_factor_never_drops_below_floor():
    """Repeated q=0 grades push EF down, but it must never fall below 1.3."""
    card = _new_card(ease_factor=SM2_MIN_EASE_FACTOR + 0.01)
    now = datetime.now(timezone.utc)

    # 20 consecutive failures — way more than enough to push past floor
    # if the clamp were broken.
    for _ in range(20):
        card.apply_sm2(quality=0, now=now)

    assert card.ease_factor == pytest.approx(SM2_MIN_EASE_FACTOR, abs=1e-9)
    assert card.ease_factor >= SM2_MIN_EASE_FACTOR


@pytest.mark.parametrize(
    "quality, expected_delta",
    [
        (5, 0.10),   # Easy → +0.10
        (4, 0.00),   # Good → 0
        (3, -0.14),  # Hard → -0.14
        (2, -0.32),  # Failed but easy on review → -0.32
        (1, -0.54),  # Failed, vague familiarity → -0.54
        (0, -0.80),  # Total blackout → -0.80
    ],
)
def test_ease_factor_delta_matches_spec(quality, expected_delta):
    """The exact EF deltas from the Wozniak 1990 formula. These numbers
    are the ones any third-party SM-2 client computes — drift here
    would silently break compatibility."""
    card = _new_card(ease_factor=2.5)
    card.apply_sm2(quality=quality, now=datetime.now(timezone.utc))
    assert card.ease_factor == pytest.approx(2.5 + expected_delta, abs=1e-9)


# ── Counters ───────────────────────────────────────────────────────


def test_total_reviews_increments_on_every_grade():
    card = _new_card()
    now = datetime.now(timezone.utc)

    for q in [5, 0, 3, 4, 2]:
        card.apply_sm2(quality=q, now=now)

    assert card.total_reviews == 5


def test_total_correct_increments_only_on_pass():
    card = _new_card()
    now = datetime.now(timezone.utc)

    # 3 passes (q ≥ 3), 2 fails (q < 3)
    for q in [5, 0, 3, 4, 2]:
        card.apply_sm2(quality=q, now=now)

    assert card.total_correct == 3
    assert card.total_reviews == 5


def test_pass_threshold_is_three():
    """q=3 is the borderline pass — make sure the model treats it as
    such (matches SM2_PASS_QUALITY_THRESHOLD constant)."""
    assert SM2_PASS_QUALITY_THRESHOLD == 3
    card = _new_card()
    card.apply_sm2(quality=3, now=datetime.now(timezone.utc))
    assert card.total_correct == 1
    assert card.repetitions == 1
    assert card.interval_days == 1

    card2 = _new_card()
    card2.apply_sm2(quality=2, now=datetime.now(timezone.utc))
    assert card2.total_correct == 0
    assert card2.repetitions == 0


# ── Scheduling ─────────────────────────────────────────────────────


def test_next_review_is_now_plus_interval_days_exact():
    card = _new_card()
    now = datetime(2026, 5, 24, 13, 27, 13, tzinfo=timezone.utc)

    card.apply_sm2(quality=5, now=now)

    # interval = 1 (first pass), so next_review should be exactly 1 day later
    # — to the second. SM-2 uses integer days as the unit; the time-of-day
    # carries through.
    assert card.next_review == datetime(2026, 5, 25, 13, 27, 13, tzinfo=timezone.utc)


def test_last_review_records_review_timestamp():
    card = _new_card()
    assert card.last_review is None

    now = datetime(2026, 5, 24, 8, 0, 0, tzinfo=timezone.utc)
    card.apply_sm2(quality=4, now=now)
    assert card.last_review == now


# ── Quality input handling ─────────────────────────────────────────


@pytest.mark.parametrize(
    "raw_q, effective_q",
    [
        (-1, 0),   # below range clamps to 0 (worst grade)
        (-100, 0),
        (6, 5),    # above range clamps to 5 (best grade)
        (7, 5),
        (3.7, 3),  # non-int gets truncated by int() — quality is integer
    ],
)
def test_quality_clamps_to_valid_range(raw_q, effective_q):
    """Bad client-side inputs (negative, >5, floats) should be coerced
    to the canonical 0–5 range so the math is well-defined."""
    card = _new_card()
    card_ref = _new_card()
    now = datetime.now(timezone.utc)

    card.apply_sm2(quality=raw_q, now=now)
    card_ref.apply_sm2(quality=effective_q, now=now)

    # All scheduling state should match the clamped equivalent.
    assert card.repetitions == card_ref.repetitions
    assert card.interval_days == card_ref.interval_days
    assert card.ease_factor == pytest.approx(card_ref.ease_factor, abs=1e-9)


# ── Compound scenario: long-running learning trajectory ────────────


def test_realistic_pass_trajectory_with_default_easiness():
    """Walk a brand-new card through the SM-2 ladder using all 'Good'
    (q=4) grades — the most common real-user pattern. After 5 passes:

      review 1: interval 1
      review 2: interval 6
      review 3: round(6 × 2.5)  = 15
      review 4: round(15 × 2.5) = 38
      review 5: round(38 × 2.5) = 95

    (EF is unchanged because q=4 has delta 0.)
    """
    card = _new_card()
    now = datetime(2026, 1, 1, tzinfo=timezone.utc)

    intervals = []
    for _ in range(5):
        card.apply_sm2(quality=4, now=now)
        intervals.append(card.interval_days)

    assert intervals == [1, 6, 15, 38, 95]
    assert card.ease_factor == pytest.approx(2.5, abs=1e-9)
    assert card.repetitions == 5
    assert card.total_correct == 5
    assert card.total_reviews == 5


def test_realistic_fail_then_recover_resets_then_climbs():
    """Pass-pass-pass-fail-pass — verifies fail resets to 1 day,
    then the next pass starts the ladder over at 1 → 6 → round(6 × EF)."""
    card = _new_card()
    now = datetime(2026, 1, 1, tzinfo=timezone.utc)

    intervals = []
    for q in [4, 4, 4, 0, 4]:
        card.apply_sm2(quality=q, now=now)
        intervals.append(card.interval_days)

    # 1 (pass-1), 6 (pass-2), 15 (pass-3, 6×2.5), 1 (FAIL reset), 1 (pass after reset)
    assert intervals == [1, 6, 15, 1, 1]
    assert card.repetitions == 1
    assert card.total_correct == 4
    assert card.total_reviews == 5

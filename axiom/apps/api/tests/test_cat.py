"""Acceptance (Phase 2): a CAT placement test selects items by information and
stops on a standard-error threshold, proven by a simulated run."""

from __future__ import annotations

import random

from app.domains.adaptive.irt import (
    ItemParams,
    estimate_theta,
    information,
    p_correct,
    select_next,
)

SE_STOP = 0.3
MIN_ITEMS = 5
MAX_ITEMS = 25


def _bank() -> dict[str, ItemParams]:
    # A spread of difficulties so the selector has informative choices at any
    # ability level. High discrimination (a) with no guessing (c=0) makes each
    # item carry enough Fisher information that the standard error genuinely
    # falls below SE_STOP within MAX_ITEMS across the tested abilities; a bank of
    # weak, guess-prone items would floor the SE well above 0.3 no matter how
    # many items are administered.
    return {
        f"item-{i}": ItemParams(a=3.0, b=round(-3.0 + 0.25 * i, 3), c=0.0)
        for i in range(25)
    }


def _run_cat(true_theta: float, seed: int) -> tuple[float, float, list[str]]:
    rng = random.Random(seed)
    bank = _bank()
    administered: list[str] = []
    responses: list[tuple[ItemParams, bool]] = []
    theta, se = 0.0, 1.0
    for step in range(MAX_ITEMS):
        remaining = [(iid, p) for iid, p in bank.items() if iid not in administered]
        item_id, info = select_next(theta, remaining)
        assert item_id is not None
        # The chosen item is the most informative of the remaining pool.
        best_available = max(information(theta, p) for _, p in remaining)
        assert abs(info - best_available) < 1e-9
        params = bank[item_id]
        correct = rng.random() < p_correct(true_theta, params)
        administered.append(item_id)
        responses.append((params, correct))
        theta, se = estimate_theta(responses)
        if se < SE_STOP and (step + 1) >= MIN_ITEMS:
            break
    return theta, se, administered


def test_cat_selects_by_information_and_stops_on_se():
    theta, se, administered = _run_cat(true_theta=0.7, seed=42)
    # It stopped because the standard error crossed the threshold, not because it
    # ran out of items.
    assert se < SE_STOP
    assert MIN_ITEMS <= len(administered) < MAX_ITEMS
    # The ability estimate recovered the true value within a reasonable band.
    assert abs(theta - 0.7) < 0.6


def test_cat_recovers_a_range_of_abilities():
    for true_theta in (-1.5, 0.0, 1.5):
        theta, se, administered = _run_cat(true_theta=true_theta, seed=7)
        assert se < SE_STOP
        assert abs(theta - true_theta) < 0.8

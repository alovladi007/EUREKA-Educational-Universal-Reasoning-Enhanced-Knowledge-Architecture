"""BKT unit tests: mastery moves in the expected direction."""

from __future__ import annotations

from app.domains.adaptive.bkt import bkt_update, level_for


def test_correct_answer_raises_p_known():
    assert bkt_update(0.3, correct=True) > 0.3


def test_incorrect_answer_lowers_p_known():
    assert bkt_update(0.6, correct=False) < 0.6


def test_repeated_correct_approaches_mastery():
    p = 0.2
    for _ in range(8):
        p = bkt_update(p, correct=True)
    assert p > 0.9


def test_level_bands():
    assert level_for(0.95) == "mastered"
    assert level_for(0.75) == "proficient"
    assert level_for(0.5) == "developing"
    assert level_for(0.1) == "novice"

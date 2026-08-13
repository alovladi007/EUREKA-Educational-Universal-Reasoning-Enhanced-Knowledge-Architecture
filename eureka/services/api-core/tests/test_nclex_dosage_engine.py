"""
Unit tests for the NCLEX dosage generation engine (pure — no DB, no HTTP).

The engine's contract:
  1. every generated item's key agrees across the generator and verifier
     computation paths (this is asserted inside generate(); here we hammer it
     across thousands of seeded generations so a parameter-pool edge case
     cannot hide),
  2. no misconception value ever equals the key (a matching value would
     diagnose CORRECT answers as errors),
  3. grading accepts exactly the correctly rounded answer and rejects
     neighbors at the stated precision,
  4. diagnosis attributes a planted classic error and stays silent on noise.
"""

from __future__ import annotations

import random

import pytest

from app.services.nclex_dosage import (
    FAMILY_LABELS,
    GENERATORS,
    VERIFIERS,
    VerificationError,
    diagnose,
    family_uuid,
    generate,
    grade,
    verify,
)


def test_every_family_has_generator_verifier_and_label():
    assert set(GENERATORS) == set(VERIFIERS) == set(FAMILY_LABELS)


@pytest.mark.parametrize("family", sorted(GENERATORS))
def test_five_hundred_generations_per_family_all_dual_path_verify(family):
    """generate() raises on any path disagreement; surviving 500 seeded draws
    per family means every pool combination the RNG can reach verifies."""
    rng = random.Random(20260413)
    for _ in range(500):
        item = generate(family, rng)
        assert item.family == family
        assert item.expected == round(item.expected, item.round)
        assert item.unit
        assert item.stem
        assert item.explanation


@pytest.mark.parametrize("family", sorted(GENERATORS))
def test_misconception_values_never_collide_with_the_key(family):
    rng = random.Random(7)
    for _ in range(300):
        item = generate(family, rng)
        tol = 10 ** (-item.round) / 2 + 1e-9
        for m in item.misconceptions:
            assert abs(round(m.value, item.round) - item.expected) > tol, (
                f"{family}: misconception {m.key}={m.value} equals key {item.expected} "
                f"(params={item.params})"
            )


def test_verify_raises_on_a_corrupted_key():
    rng = random.Random(1)
    item = generate("tablets", rng)
    item.expected = item.expected + 1  # simulate a bad generator
    with pytest.raises(VerificationError):
        verify(item)


def test_grading_accepts_only_the_correctly_rounded_answer():
    rng = random.Random(99)
    for _ in range(200):
        item = generate(None, rng)
        c = item.content()
        step = 10 ** (-item.round)
        assert grade(c, item.expected) is True
        # One rounding step away must fail.
        assert grade(c, item.expected + step) is False
        assert grade(c, item.expected - step) is False


def test_grading_tolerates_float_representation_noise():
    rng = random.Random(3)
    item = generate("infusion-time", rng)
    c = item.content()
    assert grade(c, c["expected"] + 1e-12) is True


def test_diagnose_names_a_planted_classic_error():
    """Every family: answering WITH each misconception's own value must
    diagnose exactly that misconception."""
    rng = random.Random(42)
    for family in sorted(GENERATORS):
        item = generate(family, rng)
        c = item.content()
        for m in item.misconceptions:
            hit = diagnose(c, m.value)
            assert hit is not None, f"{family}: {m.key} value {m.value} not diagnosed"
            assert hit["key"] == m.key
            assert hit["coaching"]


def test_diagnose_stays_silent_on_unrecognized_noise():
    rng = random.Random(5)
    item = generate("iv-rate-mlhr", rng)
    c = item.content()
    # A value that is neither the key nor any known error value.
    weird = c["expected"] * 7 + 13.37
    assert diagnose(c, weird) is None


def test_unknown_family_is_a_loud_error():
    with pytest.raises(KeyError):
        generate("intrathecal-nonsense")


def test_family_uuids_are_stable_and_distinct():
    ids = {family_uuid(f) for f in GENERATORS}
    assert len(ids) == len(GENERATORS)
    assert family_uuid("tablets") == family_uuid("tablets")


def test_content_payload_carries_everything_the_grader_needs():
    rng = random.Random(11)
    item = generate("dose-by-weight", rng)
    c = item.content()
    for key in ("family", "stem", "params", "expected", "unit", "round",
                "explanation", "misconceptions"):
        assert key in c
    # And the misconceptions are plain dicts (JSONB-safe).
    assert all(isinstance(m, dict) for m in c["misconceptions"])


def test_lb_weight_items_actually_exercise_the_conversion():
    """The pound-vs-kilogram trap is the family's reason to exist; make sure
    the RNG actually produces both variants."""
    rng = random.Random(2)
    seen_lb = seen_kg = False
    for _ in range(200):
        item = generate("dose-by-weight", rng)
        if item.params["weight_is_lb"]:
            seen_lb = True
            assert any(m.key == "no_lb_conversion" for m in item.misconceptions)
        else:
            seen_kg = True
    assert seen_lb and seen_kg

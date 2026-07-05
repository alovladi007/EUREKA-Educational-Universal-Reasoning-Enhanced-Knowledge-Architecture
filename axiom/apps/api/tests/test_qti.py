"""Round-trip tests for the QTI 3.0 import and export module.

These tests are standalone: they import only from app.domains.assessment.qti and
rely on no fixtures and no database. The acceptance criterion is "import a bank,
export it, and re-import without loss", proved here by field-by-field equality
after single, bank, and double round trips.
"""

from __future__ import annotations

from app.domains.assessment.qti import (
    bank_to_qti,
    item_to_qti,
    qti_to_bank,
    qti_to_item,
)


def _mcq_item() -> dict:
    return {
        "identifier": "alg-mcq-001",
        "kind": "mcq_single",
        "prompt": "What is 2 + 2?",
        "options": ["3", "4", "5", "22"],
        "correct": "1",
        "explanation": "Adding 2 and 2 gives 4, which is option index 1.",
    }


def _numeric_item() -> dict:
    return {
        "identifier": "alg-num-001",
        "kind": "numeric",
        "prompt": "Solve for x: x - 7 = 0.",
        "options": None,
        "correct": "7",
        "explanation": "Add 7 to both sides.",
    }


def _math_expression_item() -> dict:
    return {
        "identifier": "alg-expr-001",
        "kind": "math_expression",
        "prompt": "Expand (x + 1)(x + 2).",
        "options": None,
        "correct": "x^2 + 3x + 2",
        "explanation": "",
    }


def _equation_item() -> dict:
    return {
        "identifier": "alg-eqn-001",
        "kind": "equation",
        "prompt": "Write the line through (0, 1) with slope 2.",
        "options": None,
        "correct": "y = 2x + 1",
        "explanation": "Use slope-intercept form with b equal to 1.",
    }


def _all_items() -> list[dict]:
    return [
        _mcq_item(),
        _numeric_item(),
        _math_expression_item(),
        _equation_item(),
    ]


def _assert_item_equal(actual: dict, expected: dict) -> None:
    for field in ("identifier", "kind", "prompt", "options", "correct", "explanation"):
        assert actual[field] == expected[field], (
            f"field {field!r} differs: {actual[field]!r} != {expected[field]!r}"
        )
    # No extra or missing keys beyond the AXIOM item shape.
    assert set(actual) == set(expected)


def test_round_trip_mcq_single() -> None:
    item = _mcq_item()
    restored = qti_to_item(item_to_qti(item))
    _assert_item_equal(restored, item)


def test_round_trip_numeric() -> None:
    item = _numeric_item()
    restored = qti_to_item(item_to_qti(item))
    _assert_item_equal(restored, item)


def test_round_trip_math_expression() -> None:
    item = _math_expression_item()
    restored = qti_to_item(item_to_qti(item))
    _assert_item_equal(restored, item)


def test_round_trip_equation() -> None:
    item = _equation_item()
    restored = qti_to_item(item_to_qti(item))
    _assert_item_equal(restored, item)


def test_mcq_correct_index_maps_through_choice_identifier() -> None:
    item = _mcq_item()
    xml = item_to_qti(item)
    # Export maps index 1 -> choice-1; import maps it back to "1".
    assert "choice-1" in xml
    restored = qti_to_item(xml)
    assert restored["correct"] == "1"


def test_bank_round_trip_preserves_count_and_fields() -> None:
    items = _all_items()
    xml = bank_to_qti(items)
    restored = qti_to_bank(xml)

    assert len(restored) == len(items)
    for restored_item, original in zip(restored, items, strict=True):
        _assert_item_equal(restored_item, original)


def test_double_round_trip_is_stable() -> None:
    items = _all_items()

    xml1 = bank_to_qti(items)
    bank1 = qti_to_bank(xml1)
    xml2 = bank_to_qti(bank1)
    bank2 = qti_to_bank(xml2)

    # The serialized form is stable across a second export.
    assert xml1 == xml2

    assert len(bank2) == len(items)
    for restored_item, original in zip(bank2, items, strict=True):
        _assert_item_equal(restored_item, original)


def test_single_item_double_round_trip_is_stable() -> None:
    for item in _all_items():
        xml1 = item_to_qti(item)
        item1 = qti_to_item(xml1)
        xml2 = item_to_qti(item1)
        item2 = qti_to_item(xml2)

        assert xml1 == xml2
        _assert_item_equal(item2, item)

"""Unit tests for the Phase 2 item kinds added to the grading service.

Pure and database-free: they exercise grade() and grade_step_credit() directly
so the selection and constructed-response logic is verified in isolation.
"""

from __future__ import annotations

from app.domains.grading.service import grade, grade_step_credit


def test_mcq_multi_requires_exact_set():
    right = grade("mcq_multi", "[0, 2, 3]", "[3, 0, 2]")
    assert right.is_correct and right.score == 1.0
    # A subset is not full credit; the whole set must match.
    partial = grade("mcq_multi", "[0, 2, 3]", "[0, 2]")
    assert not partial.is_correct and partial.score == 0.0


def test_mcq_multi_accepts_comma_list():
    assert grade("mcq_multi", "[1, 2]", "1,2").is_correct


def test_true_false_normalizes_forms():
    assert grade("true_false", "true", "T").is_correct
    assert grade("true_false", "false", "0").is_correct
    assert not grade("true_false", "true", "false").is_correct


def test_short_text_accepts_any_listed_alternative():
    key = "distributive|distributive property|the distributive property"
    assert grade("short_text", key, "Distributive Property").is_correct
    assert grade("short_text", key, "distributive").is_correct
    assert not grade("short_text", key, "associative").is_correct


def test_plot_points_is_order_independent():
    assert grade("plot_points", "[[1, 5], [2, 7]]", "[[2, 7], [1, 5]]").is_correct
    assert not grade("plot_points", "[[1, 5], [2, 7]]", "[[1, 5]]").is_correct


def test_show_work_partial_credit_scales_with_milestones():
    milestones = ["2*x = 8", "x = 4"]
    full, frac_full = grade_step_credit(milestones, "2x = 8\nx = 4")
    assert frac_full == 1.0
    assert all(step["awarded"] for step in full)

    partial, frac_partial = grade_step_credit(milestones, "2x = 8")
    assert frac_partial == 0.5
    assert partial[0]["awarded"] and not partial[1]["awarded"]


def test_show_work_grade_sets_step_credits_and_score():
    outcome = grade(
        "show_work", "4", "2*x = 8\nx = 4", milestones=["2*x = 8", "x = 4"]
    )
    assert outcome.is_correct
    assert outcome.score == 1.0
    assert len(outcome.step_credits) == 2


def test_plot_function_grades_by_cas_equivalence():
    # Any equivalent form of the same function graphs identically and is correct.
    assert grade("plot_function", "(x-1)*(x+1)", "x^2 - 1").is_correct
    assert grade("plot_function", "2*x + 3", "3 + 2*x").is_correct
    # A different function is not correct.
    assert not grade("plot_function", "x^2", "x^3").is_correct


def test_draw_line_matches_line_through_the_two_points():
    # Points (0,1) and (1,3) lie on y = 2x + 1.
    assert grade("draw_line", "y = 2*x + 1", "[[0, 1], [1, 3]]").is_correct
    # A shallower line does not match.
    assert not grade("draw_line", "y = 2*x + 1", "[[0, 0], [1, 1]]").is_correct


def test_draw_line_handles_vertical_and_degenerate():
    assert grade("draw_line", "x = 3", "[[3, 0], [3, 5]]").is_correct
    # A single point cannot define a line.
    one = grade("draw_line", "y = x", "[[0, 0]]")
    assert not one.is_correct
    # Two identical points cannot define a line.
    same = grade("draw_line", "y = x", "[[2, 2], [2, 2]]")
    assert not same.is_correct


def test_ordering_requires_exact_sequence():
    key = '["a", "b", "c"]'
    assert grade("ordering", key, '["a", "b", "c"]').is_correct
    # A wrong order is incorrect.
    assert not grade("ordering", key, '["b", "a", "c"]').is_correct
    # A missing element is incorrect.
    assert not grade("ordering", key, '["a", "b"]').is_correct


def test_matching_is_order_independent_but_pairing_exact():
    key = '[["A", "1"], ["B", "2"]]'
    assert grade("matching", key, '[["B", "2"], ["A", "1"]]').is_correct
    # A wrong pairing is incorrect.
    assert not grade("matching", key, '[["A", "2"], ["B", "1"]]').is_correct


def test_unsupported_kind_is_not_correct():
    outcome = grade("does_not_exist", "1", "1")
    assert not outcome.is_correct
    assert "unsupported" in outcome.detail

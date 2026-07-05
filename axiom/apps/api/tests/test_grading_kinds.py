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


def test_unsupported_kind_is_not_correct():
    outcome = grade("does_not_exist", "1", "1")
    assert not outcome.is_correct
    assert "unsupported" in outcome.detail

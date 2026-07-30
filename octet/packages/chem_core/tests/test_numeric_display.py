"""correct_display honours the item's own significant figure demand.

An item that says "report to 3 significant figures" once showed its key as
"22.34 g" (four figures) in review, contradicting the prompt it graded the
learner against. When expected_sig_figs is set, every correct_display path
must render the key rounded to exactly that many figures.
"""

from __future__ import annotations

from chem_core.numeric import grade_numeric


def test_correct_display_rounds_to_demanded_sig_figs_on_a_miss():
    result = grade_numeric(22.34, "gram", "999", expected_sig_figs=3)
    assert not result.is_correct
    assert result.correct_display == "22.3 gram"


def test_correct_display_rounds_to_demanded_sig_figs_on_the_correct_path():
    result = grade_numeric(22.34, "gram", "22.3 g", expected_sig_figs=3)
    assert result.is_correct
    assert result.correct_display == "22.3 gram"


def test_correct_display_keeps_significant_trailing_zeros():
    # %g alone would print 1.5, which reads as two figures against a three
    # figure demand; the display must carry the trailing zero.
    result = grade_numeric(1.5, "gram", "999", expected_sig_figs=3)
    assert result.correct_display == "1.50 gram"


def test_correct_display_unchanged_when_no_sig_figs_demanded():
    result = grade_numeric(22.34, "gram", "999")
    assert result.correct_display == "22.34 gram"

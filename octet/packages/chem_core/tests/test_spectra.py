"""Tests for grader 10, structure elucidation.

The verifier tests matter more than the grading tests here. Grading an
elucidation answer is the easy half: it is a canonical SMILES comparison, the
same identity test grader 4 already passes. The half that can silently ruin
content is an item whose stated data does not fit its own key, because a
learner who reasons correctly from that data gets marked wrong and has no way
to tell that the item, not their reasoning, is at fault.

So each planted fault below is a mistake an author could plausibly make, and
every one of them has to be caught before the item can ship.
"""

from __future__ import annotations

import chem_core as cc
import pytest

from chem_core.spectra import Signal, SpectrumItem, grade_spectrum, verify_bank, verify_spectrum_item

P_XYLENE = SpectrumItem(
    node="ORG1.U10.NMR-SYMMETRY",
    formula="C8H10",
    answer="Cc1ccc(C)cc1",
    signals=(
        Signal(6, "2.30", "s", "two equivalent methyl groups"),
        Signal(4, "7.05", "s", "four equivalent aromatic hydrogens"),
    ),
    source="Integration derived from symmetry; shifts from a cited reference table.",
)


class TestVerifierCatchesBrokenItems:
    def test_a_sound_item_passes(self):
        result = verify_spectrum_item(P_XYLENE)
        assert result.ok, result.detail

    def test_formula_disagreeing_with_the_key_is_caught(self):
        broken = SpectrumItem(
            node="x", formula="C8H12", answer="Cc1ccc(C)cc1",
            signals=(Signal(6), Signal(4)),
        )
        result = verify_spectrum_item(broken)
        assert not result.ok
        assert "C8H10" in result.detail

    def test_signal_count_disagreeing_with_symmetry_is_caught(self):
        """The para/meta trap: meta-xylene gives four signals, not two.

        An author who writes the para data and the meta structure produces an
        item that reads perfectly and cannot be solved.
        """
        broken = SpectrumItem(
            node="x", formula="C8H10", answer="Cc1cccc(C)c1",
            signals=(Signal(6), Signal(4)),
        )
        result = verify_spectrum_item(broken)
        assert not result.ok
        assert "4 proton environment" in result.detail

    def test_wrong_integration_ratio_is_caught(self):
        broken = SpectrumItem(
            node="x", formula="C8H10", answer="Cc1ccc(C)cc1",
            signals=(Signal(5), Signal(5)),
        )
        result = verify_spectrum_item(broken)
        assert not result.ok
        assert "6:4" in result.detail

    def test_proton_total_disagreeing_with_the_key_is_caught(self):
        broken = SpectrumItem(
            node="x", formula="C8H10", answer="Cc1ccc(C)cc1",
            signals=(Signal(6), Signal(3)),
        )
        result = verify_spectrum_item(broken)
        assert not result.ok
        assert "10 hydrogen" in result.detail

    def test_shifts_without_a_source_are_refused(self):
        """The verifier cannot check a chemical shift, so it demands a source.

        This is the one place the module admits a limit rather than passing
        silently. A shift claim with no citation is exactly the kind of fluent
        invention this whole phase is defending against.
        """
        broken = SpectrumItem(
            node="x", formula="C8H10", answer="Cc1ccc(C)cc1",
            signals=(Signal(6, "2.30", "s"), Signal(4, "7.05", "s")),
        )
        result = verify_spectrum_item(broken)
        assert not result.ok
        assert "no source" in result.detail

    def test_an_item_with_no_shift_claims_needs_no_source(self):
        bare = SpectrumItem(
            node="x", formula="C8H10", answer="Cc1ccc(C)cc1",
            signals=(Signal(6), Signal(4)),
        )
        assert verify_spectrum_item(bare).ok

    def test_ir_bands_also_require_a_source(self):
        broken = SpectrumItem(
            node="x", formula="C8H10", answer="Cc1ccc(C)cc1",
            signals=(Signal(6), Signal(4)),
            ir_bands=("3030 cm-1 aromatic C-H",),
        )
        assert not verify_spectrum_item(broken).ok

    def test_an_unreadable_key_is_caught(self):
        broken = SpectrumItem(node="x", formula="C8H10", answer="not-a-molecule")
        result = verify_spectrum_item(broken)
        assert not result.ok
        assert "not readable" in result.detail

    def test_a_passing_item_reports_what_it_left_unchecked(self):
        result = verify_spectrum_item(P_XYLENE)
        assert result.ok
        assert "unchecked" in result.detail

    def test_verify_bank_reports_every_failure_not_just_the_first(self):
        bad_one = SpectrumItem(node="a", formula="C8H12", answer="Cc1ccc(C)cc1")
        bad_two = SpectrumItem(node="b", formula="C8H10", answer="broken{")
        results = verify_bank([bad_one, P_XYLENE, bad_two])
        assert [node for node, r in results if not r.ok] == ["a", "b"]


class TestGrading:
    def test_the_intended_structure_is_correct(self):
        result = grade_spectrum(P_XYLENE, "Cc1ccc(C)cc1")
        assert result.is_correct and result.score == 1.0

    def test_a_different_spelling_of_the_same_structure_is_correct(self):
        assert grade_spectrum(P_XYLENE, "c1cc(C)ccc1C").is_correct

    def test_an_isomer_gets_partial_credit_and_a_reason(self):
        """A right-formula wrong-connectivity answer is the characteristic
        elucidation error, and it earns a diagnosis rather than a bare zero."""
        result = grade_spectrum(P_XYLENE, "Cc1cccc(C)c1")
        assert not result.is_correct
        assert result.score == 0.25
        assert result.misconception == "ISOMER-INCONSISTENT-WITH-DATA"
        assert "4 proton environment" in result.detail

    def test_the_isomer_message_states_the_data_it_fails_to_fit(self):
        result = grade_spectrum(P_XYLENE, "CCc1ccccc1")
        assert "6:4" in result.detail

    def test_a_wrong_formula_is_named_as_such(self):
        result = grade_spectrum(P_XYLENE, "CCO")
        assert result.misconception == "WRONG-FORMULA"
        assert "C2H6O" in result.detail

    def test_hostile_input_is_ungradable_never_an_exception(self):
        result = grade_spectrum(P_XYLENE, "C(((%%%")
        assert not result.graded
        assert not result.is_correct

    @pytest.mark.parametrize("hostile", ["", "   ", "\x00", "C" * 5000, "<script>"])
    def test_no_submission_raises(self, hostile):
        result = grade_spectrum(P_XYLENE, hostile)
        assert isinstance(result, cc.GradeResult)


class TestDispatch:
    def test_spectrum_grades_through_the_shared_entry_point(self):
        variant = {
            "key": "Cc1ccc(C)cc1",
            "meta": {"formula": "C8H10", "signals": [{"protons": 6}, {"protons": 4}]},
        }
        assert cc.grade("spectrum", variant, "Cc1ccc(C)cc1").is_correct
        assert cc.grade("spectrum", variant, "Cc1cccc(C)c1").score == 0.25

    def test_spectrum_is_declared_live(self):
        assert "spectrum" in cc.SUPPORTED_GRADERS

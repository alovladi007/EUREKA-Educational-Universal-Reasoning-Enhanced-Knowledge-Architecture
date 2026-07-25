"""Tests for grader 11, one retrosynthetic step.

The design claim under test is that retrosynthesis can be graded without
judgement: a disconnection is backed by a real forward reaction, and a proposed
precursor set is correct exactly when running that reaction rebuilds the
target. So the tests check two independent things: that the grader accepts an
answer that genuinely builds the molecule and rejects one that does not, and
that the item verifier refuses an item whose own key does not build its own
target.
"""

from __future__ import annotations

import chem_core as cc
import pytest

from chem_core.retro import LIBRARY, RetroItem, grade_retro, verify_retro_item

ETHER = RetroItem(
    node="ORG2.WILLIAMSON",
    target="CCOCC",
    disconnections=(LIBRARY["williamson"], LIBRARY["grignard_carbonyl"]),
    key_disconnection="Williamson ether synthesis",
    key_precursors=("CCO", "CCBr"),
    prompt="Give a one-step synthesis of diethyl ether.",
)

ALCOHOL = RetroItem(
    node="ORG2.ALCOHOLGRIGNARD",
    target="CCC(C)O",
    disconnections=(LIBRARY["grignard_carbonyl"], LIBRARY["williamson"]),
    key_disconnection="Organometallic addition to a carbonyl",
    key_precursors=("CC=O", "CC[Mg]"),
)


class TestGrading:
    def test_precursors_that_build_the_target_are_correct(self):
        result = grade_retro(ETHER, "Williamson ether synthesis", ["CCO", "CCBr"])
        assert result.is_correct and result.score == 1.0

    def test_precursor_order_does_not_matter(self):
        assert grade_retro(ETHER, "Williamson ether synthesis", ["CCBr", "CCO"]).is_correct

    def test_a_different_spelling_of_the_precursors_still_builds_it(self):
        assert grade_retro(ETHER, "Williamson ether synthesis", ["OCC", "BrCC"]).is_correct

    def test_wrong_precursors_are_rejected_with_the_skeleton_reason(self):
        # Methanol instead of ethanol: the carbon count no longer reaches the
        # target, so no reaction could join them.
        result = grade_retro(ETHER, "Williamson ether synthesis", ["CO", "CCBr"])
        assert not result.is_correct
        assert result.misconception == "RETRO-WRONG-PRECURSORS"

    def test_right_fragments_wrong_disconnection_earns_partial_credit(self):
        # The atoms are all present, but a carbonyl addition does not make an
        # ether from an alcohol and an alkyl halide.
        result = grade_retro(ETHER, "Organometallic addition to a carbonyl", ["CCO", "CCBr"])
        assert not result.is_correct
        assert 0 < result.score < 1
        assert result.misconception == "RETRO-FRAGMENTS-DO-NOT-JOIN"

    def test_a_disconnection_not_offered_is_named_as_such(self):
        result = grade_retro(ETHER, "Diels Alder", ["CCO", "CCBr"])
        assert not result.is_correct
        assert "not one of the offered" in result.detail

    def test_the_grignard_item_grades(self):
        assert grade_retro(
            ALCOHOL, "Organometallic addition to a carbonyl", ["CC=O", "CC[Mg]"]
        ).is_correct

    @pytest.mark.parametrize("hostile", ["", "   ", "not-a-molecule", "C" * 5000])
    def test_hostile_precursors_are_ungradable_never_an_exception(self, hostile):
        result = grade_retro(ETHER, "Williamson ether synthesis", [hostile])
        assert isinstance(result, cc.GradeResult)
        assert not result.is_correct

    def test_too_many_precursors_are_refused(self):
        result = grade_retro(ETHER, "Williamson ether synthesis", ["C", "C", "C", "C", "C"])
        assert not result.graded


class TestItemVerifier:
    def test_a_sound_item_passes(self):
        assert verify_retro_item(ETHER).ok
        assert verify_retro_item(ALCOHOL).ok

    def test_an_item_whose_key_does_not_build_its_target_is_caught(self):
        # Key precursors build dimethyl ether, not the diethyl ether target.
        broken = RetroItem(
            node="x",
            target="CCOCC",
            disconnections=(LIBRARY["williamson"],),
            key_disconnection="Williamson ether synthesis",
            key_precursors=("CO", "CBr"),
        )
        result = verify_retro_item(broken)
        assert not result.ok
        assert "unanswerable" in result.detail

    def test_a_key_naming_an_unoffered_disconnection_is_caught(self):
        broken = RetroItem(
            node="x",
            target="CCOCC",
            disconnections=(LIBRARY["williamson"],),
            key_disconnection="Fischer esterification",
            key_precursors=("CCO", "CCBr"),
        )
        assert not verify_retro_item(broken).ok

    def test_an_unreadable_target_is_caught(self):
        broken = RetroItem(node="x", target="not-a-molecule", disconnections=(LIBRARY["williamson"],))
        assert not verify_retro_item(broken).ok

    def test_every_library_disconnection_is_a_usable_reaction(self):
        for name, disc in LIBRARY.items():
            item = RetroItem(
                node="x",
                target="CCOCC",
                disconnections=(disc,),
                key_disconnection=disc.name,
                key_precursors=("CCO", "CCBr"),
            )
            # We are not asserting it builds the ether, only that the template
            # runs without erroring, which is what the verifier probes.
            result = verify_retro_item(item)
            assert isinstance(result.ok, bool), name


class TestDispatch:
    def _variant(self) -> dict:
        return {
            "key": "CCOCC",
            "meta": {
                "node": "ORG2.WILLIAMSON",
                "disconnections": [
                    {
                        "name": "Williamson ether synthesis",
                        "forward_smarts": "[C:1][OH:2].[C:3][Cl,Br,I:4]>>[C:1][O:2][C:3]",
                        "forms": "ether C-O bond",
                    }
                ],
                "key_disconnection": "Williamson ether synthesis",
                "key_precursors": ["CCO", "CCBr"],
            },
        }

    def test_retro_grades_through_the_shared_entry_point(self):
        answer = {"disconnection": "Williamson ether synthesis", "precursors": ["CCO", "CCBr"]}
        assert cc.grade("retro", self._variant(), answer).is_correct
        wrong = {"disconnection": "Williamson ether synthesis", "precursors": ["CO", "CCBr"]}
        assert not cc.grade("retro", self._variant(), wrong).is_correct

    def test_retro_is_declared_live(self):
        assert "retro" in cc.SUPPORTED_GRADERS

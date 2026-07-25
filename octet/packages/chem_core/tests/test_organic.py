"""Tests for the organic verification toolkit.

Worth recording how these went, because it is the reason the module exists.
While writing them I asserted three organic facts from memory and got all
three wrong: I mislabelled meso tartaric acid as the R,R diastereomer, I put
aspirin at eight degrees of unsaturation when it has six, and I wrote
m-xylene's integration ratio in the wrong order. The code was right every
time.

I am a fluent generator of organic chemistry prose and an unreliable source of
organic chemistry fact. That gap does not show up on reading, which is exactly
why authored organic content has to be checked by derivation rather than by
review.
"""

from __future__ import annotations

import pytest

from chem_core.organic import (
    are_diastereomers,
    are_enantiomers,
    degrees_of_unsaturation,
    proton_environments,
    reaction_conserves_atoms,
    stereocentres,
    verify_environment_claim,
    verify_stereo_claim,
    verify_unsaturation_claim,
)

# Tartaric acid, verified by reading descriptors back rather than by trusting
# the way the SMILES was typed.
TARTARIC_SS = "O[C@H](C(=O)O)[C@H](O)C(=O)O"
TARTARIC_RR = "O[C@@H](C(=O)O)[C@@H](O)C(=O)O"
TARTARIC_MESO = "O[C@@H](C(=O)O)[C@H](O)C(=O)O"


class TestStereocentres:
    def test_assigns_cip_descriptors(self):
        assert [c.descriptor for c in stereocentres("OC[C@@H](O)C=O")] == ["R"]
        assert [c.descriptor for c in stereocentres("OC[C@H](O)C=O")] == ["S"]

    def test_reports_unassigned_centres_rather_than_guessing(self):
        centres = stereocentres("OCC(O)C=O")
        assert [c.descriptor for c in centres] == ["?"]

    def test_a_wrong_claim_is_refused(self):
        result = verify_stereo_claim("OC[C@@H](O)C=O", "S")
        assert not result.ok
        assert "['R']" in result.detail

    def test_a_right_claim_passes(self):
        assert verify_stereo_claim("OC[C@@H](O)C=O", "R").ok

    def test_an_unassigned_centre_cannot_carry_a_claim(self):
        assert not verify_stereo_claim("OCC(O)C=O", "R").ok

    def test_claim_with_wrong_number_of_centres_is_refused(self):
        result = verify_stereo_claim(TARTARIC_RR, "R")
        assert not result.ok
        assert "2 stereocentre" in result.detail

    def test_bad_smiles_is_refused_not_crashed(self):
        assert not verify_stereo_claim("not a molecule", "R").ok


class TestIsomerRelationships:
    def test_mirror_images_are_enantiomers(self):
        assert are_enantiomers(TARTARIC_RR, TARTARIC_SS) is True

    def test_enantiomers_are_not_diastereomers(self):
        assert are_diastereomers(TARTARIC_RR, TARTARIC_SS) is False

    def test_meso_against_a_chiral_form_is_a_diastereomer(self):
        assert are_diastereomers(TARTARIC_RR, TARTARIC_MESO) is True
        assert are_enantiomers(TARTARIC_RR, TARTARIC_MESO) is False

    def test_meso_is_achiral_so_its_two_spellings_are_one_compound(self):
        """R,S and S,R tartaric acid are the same molecule, not a pair.

        The internal mirror plane makes them identical, so neither relationship
        holds. This case is here because it is the one I got wrong by hand, and
        an author writing a lesson on meso compounds is walking straight into
        it.
        """
        other_spelling = "O[C@H](C(=O)O)[C@@H](O)C(=O)O"
        assert are_enantiomers(TARTARIC_MESO, other_spelling) is False
        assert are_diastereomers(TARTARIC_MESO, other_spelling) is False

    def test_different_constitutions_are_neither(self):
        assert are_enantiomers("CCO", "COC") is False
        assert are_diastereomers("CCO", "COC") is False


class TestDegreesOfUnsaturation:
    @pytest.mark.parametrize(
        "formula,expected",
        [
            ("C6H6", 4),  # benzene
            ("C7H8", 4),  # toluene
            ("C6H12", 1),  # cyclohexane
            ("C6H14", 0),  # hexane
            ("C4H6", 2),  # butadiene
            ("C10H8", 7),  # naphthalene
            ("C9H8O4", 6),  # aspirin: oxygen is ignored
            ("C7H5N", 6),  # benzonitrile: nitrogen adds one
            ("C6H5Cl", 4),  # halogen counts as hydrogen
            ("C2H6O", 0),  # ethanol
        ],
    )
    def test_matches_textbook_values(self, formula, expected):
        assert degrees_of_unsaturation(formula) == expected

    def test_refuses_a_formula_containing_an_element_it_cannot_handle(self):
        assert degrees_of_unsaturation("C6H5Fe") is None

    def test_refuses_a_formula_with_no_carbon(self):
        assert degrees_of_unsaturation("H2O") is None


class TestUnsaturationVerifier:
    @pytest.mark.parametrize(
        "smiles,expected",
        [
            ("c1ccccc1", 4),
            ("Cc1ccccc1", 4),
            ("c1ccc2ccccc2c1", 7),
            ("C1CCCCC1", 1),
            ("O=C1CCCCC1", 2),
            ("N#Cc1ccccc1", 6),
            ("CC(=O)Oc1ccccc1C(=O)O", 6),
            ("CCO", 0),
        ],
    )
    def test_both_routes_agree_with_the_claim(self, smiles, expected):
        result = verify_unsaturation_claim(smiles, expected)
        assert result.ok, result.detail

    def test_aromatic_rings_are_counted(self):
        """Regression: aromatic bonds report order 1.5.

        int(round(1.5 - 1)) is 0 under banker's rounding, so benzene's three pi
        bonds scored zero and the graph route returned 1 against the formula's
        4. Only the two-route comparison caught it.
        """
        assert verify_unsaturation_claim("c1ccccc1", 4).ok
        assert verify_unsaturation_claim("c1ccccc1", 1).detail

    def test_a_wrong_claim_is_refused(self):
        result = verify_unsaturation_claim("c1ccccc1", 3)
        assert not result.ok
        assert "gives 4" in result.detail

    def test_a_charged_species_is_refused_rather_than_miscounted(self):
        result = verify_unsaturation_claim("CC(=O)[O-]", 1)
        assert not result.ok
        assert "charge" in result.detail


class TestProtonEnvironments:
    @pytest.mark.parametrize(
        "smiles,name,expected",
        [
            ("Cc1ccccc1", "toluene", [3, 2, 2, 1]),
            ("c1ccccc1", "benzene", [6]),
            ("CC(C)(C)C", "neopentane", [12]),
            ("CC(C)C", "isobutane", [9, 1]),
            ("CCCC", "butane", [6, 4]),
            ("ClCCCl", "1,2-dichloroethane", [4]),
            ("CCOC(C)=O", "ethyl acetate", [3, 3, 2]),
            ("Cc1cccc(C)c1", "m-xylene", [6, 2, 1, 1]),
            ("Cc1ccc(C)cc1", "p-xylene", [6, 4]),
        ],
    )
    def test_symmetry_gives_the_integration_ratio(self, smiles, name, expected):
        assert proton_environments(smiles) == expected, name

    def test_para_substitution_is_more_symmetric_than_meta(self):
        """The check that makes an aromatic substitution lesson verifiable.

        Para gives two signals, meta gives four. A lesson claiming otherwise is
        wrong, and this is the derivation that says so.
        """
        assert len(proton_environments("Cc1ccc(C)cc1")) == 2
        assert len(proton_environments("Cc1cccc(C)c1")) == 4

    def test_verifier_refuses_a_wrong_signal_count(self):
        result = verify_environment_claim("Cc1ccccc1", 3)
        assert not result.ok
        assert "3:2:2:1" in result.detail

    def test_verifier_accepts_the_right_count(self):
        assert verify_environment_claim("Cc1ccccc1", 4).ok

    def test_a_molecule_with_no_hydrogens_returns_empty(self):
        assert proton_environments("O=C=O") == []


class TestReactionBalance:
    def test_a_balanced_reaction_passes(self):
        assert reaction_conserves_atoms(["C", "ClCl"], ["CCl", "Cl"]).ok

    def test_an_unbalanced_reaction_is_refused(self):
        result = reaction_conserves_atoms(["C"], ["CCl"])
        assert not result.ok
        assert "balance" in result.detail

    def test_passing_does_not_claim_the_reaction_proceeds(self):
        """The success message has to say what it does not establish.

        Atom conservation is necessary and nowhere near sufficient. A verifier
        whose pass message reads as endorsement would get cited as one.
        """
        result = reaction_conserves_atoms(["C", "ClCl"], ["CCl", "Cl"])
        assert result.ok
        assert "does not establish" in result.detail

    def test_an_unreadable_structure_is_refused(self):
        assert not reaction_conserves_atoms(["nonsense{"], ["C"]).ok

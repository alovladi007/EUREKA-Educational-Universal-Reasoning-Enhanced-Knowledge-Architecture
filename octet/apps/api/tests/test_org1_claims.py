"""Every chemical claim in every authored organic lesson must hold.

This is the test that makes authored organic content trustworthy, and it is
worth being precise about what it does and does not establish.

It establishes that the facts a lesson chose to make checkable are correct,
re-derived from structure by RDKit rather than reviewed by reading. When ORG1
Unit 4 was first written, this check rejected 5 of its 25 claims, including two
CIP descriptors that were simply inverted. Every one of those errors was
written confidently and none looked wrong on the page.

It does not establish that a lesson is correct. Prose that states a fact and
omits the corresponding claim escapes this check entirely, which is why
_check_organic_lessons_carry_claims blocks an organic lesson with no claims at
all, and why the authoring rule is that structural facts get a claim beside
them.
"""

from __future__ import annotations

import pytest

from app.compliance import green, run
from app.data.claims import Environments, Formula, Relationship, Source, Stereo, Unsaturation
from app.data.claims import check_all, failures
from app.data.lessons import LESSONS

ORGANIC = {code: lesson for code, lesson in LESSONS.items() if code.startswith("ORG")}


def test_there_is_authored_organic_content_to_check():
    """Guard against this whole file silently passing on an empty set."""
    assert ORGANIC, "no organic lessons are authored, so nothing was verified"


@pytest.mark.parametrize("code", sorted(ORGANIC))
def test_every_claim_in_an_organic_lesson_holds(code):
    lesson = ORGANIC[code]
    bad = failures(lesson.claims)
    assert not bad, "\n".join(
        f"{code}: {type(c).__name__} {r.detail}" for c, r in bad
    )


@pytest.mark.parametrize("code", sorted(ORGANIC))
def test_every_organic_lesson_carries_at_least_one_claim(code):
    """Prose alone is unverified, so an empty claim tuple is a failure."""
    assert ORGANIC[code].claims, f"{code} asserts nothing checkable"


def test_compliance_blocks_on_a_false_claim():
    """The gate has to bite, not merely exist.

    Verified by mutation rather than by inspection: a deliberately inverted
    descriptor must turn the checklist red. Without this, a claim checker that
    silently returned ok for everything would look identical to a working one.
    """
    real = Stereo("OC[C@@H](O)C=O", ("R",))
    assert real.check().ok

    inverted = Stereo("OC[C@@H](O)C=O", ("S",))
    assert not inverted.check().ok
    assert failures((inverted,))


def test_the_checklist_is_green_with_the_content_as_authored():
    report = run()
    assert green(), report["blocking"]


class TestClaimTypes:
    """Each claim type must reject what it is meant to reject."""

    def test_stereo_rejects_an_inverted_descriptor(self):
        assert not Stereo("OC[C@@H](O)C=O", ("S",)).check().ok

    def test_stereo_rejects_the_wrong_number_of_centres(self):
        assert not Stereo("O[C@@H](C(=O)O)[C@@H](O)C(=O)O", ("R",)).check().ok

    def test_formula_rejects_a_mismatch(self):
        assert Formula("CCO", "C2H6O").check().ok
        assert not Formula("CCO", "C2H6").check().ok

    def test_unsaturation_rejects_a_mismatch(self):
        assert Unsaturation("c1ccccc1", 4).check().ok
        assert not Unsaturation("c1ccccc1", 3).check().ok

    def test_environments_rejects_a_wrong_ratio(self):
        assert Environments("Cc1ccccc1", (3, 2, 2, 1)).check().ok
        assert not Environments("Cc1ccccc1", (3, 3, 2)).check().ok

    def test_relationship_rejects_a_wrong_kind(self):
        rr = "O[C@@H](C(=O)O)[C@@H](O)C(=O)O"
        ss = "O[C@H](C(=O)O)[C@H](O)C(=O)O"
        meso = "O[C@@H](C(=O)O)[C@H](O)C(=O)O"
        assert Relationship(rr, ss, "enantiomers").check().ok
        assert not Relationship(rr, ss, "diastereomers").check().ok
        assert Relationship(rr, meso, "diastereomers").check().ok
        assert not Relationship(rr, meso, "enantiomers").check().ok

    def test_relationship_catches_two_spellings_of_one_compound(self):
        """The meso trap, which is the one an author is most likely to hit.

        R,S and S,R tartaric acid look like a pair and are one molecule. A
        lesson calling them enantiomers must fail.
        """
        meso_a = "O[C@@H](C(=O)O)[C@H](O)C(=O)O"
        meso_b = "O[C@H](C(=O)O)[C@@H](O)C(=O)O"
        assert Relationship(meso_a, meso_b, "identical").check().ok
        assert not Relationship(meso_a, meso_b, "enantiomers").check().ok
        assert not Relationship(meso_a, meso_b, "diastereomers").check().ok

    def test_relationship_rejects_an_unknown_kind(self):
        assert not Relationship("CCO", "COC", "cousins").check().ok

    def test_constitutional_isomers_are_distinguished_from_stereoisomers(self):
        assert Relationship("CCO", "COC", "constitutional").check().ok
        rr = "O[C@@H](C(=O)O)[C@@H](O)C(=O)O"
        ss = "O[C@H](C(=O)O)[C@H](O)C(=O)O"
        assert not Relationship(rr, ss, "constitutional").check().ok

    def test_source_requires_an_actual_citation(self):
        assert Source("Enantiomers share melting points.", "Clayden, ch. 14").check().ok
        assert not Source("Enantiomers share melting points.", "").check().ok
        assert not Source("Enantiomers share melting points.", "   ").check().ok

    def test_a_source_never_claims_the_number_was_verified(self):
        result = Source("The pKa of acetic acid is 4.76.", "CRC Handbook").check()
        assert result.ok
        assert "unchecked" in result.detail

    def test_an_unreadable_structure_fails_rather_than_passing(self):
        for claim in (
            Stereo("not-a-molecule", ("R",)),
            Formula("not-a-molecule", "C2H6O"),
            Environments("not-a-molecule", (1,)),
            Relationship("not-a-molecule", "CCO", "enantiomers"),
        ):
            assert not claim.check().ok, claim


def test_check_all_returns_a_row_per_claim():
    claims = (Formula("CCO", "C2H6O"), Formula("CCO", "WRONG"))
    rows = check_all(claims)
    assert len(rows) == 2
    assert [r.ok for _, r in rows] == [True, False]

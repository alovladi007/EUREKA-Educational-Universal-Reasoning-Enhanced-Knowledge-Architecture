"""Exam assembly and scoring.

The tests that matter here are the refusals. An exam engine that quietly
degrades produces a score whose meaning nobody can state afterwards, so the
cases asserted hardest are the ones where it must fail loudly instead.
"""

from __future__ import annotations

import pytest

import chem_core as cc
from app.domains.exams.assembly import AssemblyError, assemble, check_feasible
from app.domains.exams.blueprints import (
    BLUEPRINTS,
    Blueprint,
    SectionSpec,
    unit_exam,
)
from app.domains.exams.scoring import score_form

USER = "learner-1"


# ---------------------------------------------------------------------------
# The catalogue only lists exams that can actually be built
# ---------------------------------------------------------------------------


def test_catalogue_is_not_empty():
    assert BLUEPRINTS


def test_every_catalogued_blueprint_is_feasible():
    """A listed exam that cannot be assembled is worse than no exam."""
    for code, blueprint in BLUEPRINTS.items():
        assert check_feasible(blueprint) == [], code


def test_every_catalogued_blueprint_assembles():
    for code, blueprint in BLUEPRINTS.items():
        form = assemble(blueprint, USER)
        assert len(form.items) == blueprint.total_items, code


def test_no_blueprint_claims_external_alignment():
    """Claiming an ACS or AP blueprint without the published outline is fabrication."""
    for blueprint in BLUEPRINTS.values():
        haystack = f"{blueprint.title} {blueprint.description} {blueprint.basis}".lower()
        for claim in ("acs ", "advanced placement", "mcat", "ib chemistry"):
            assert claim not in haystack, f"{blueprint.code} claims {claim}"


def test_blueprints_carry_their_basis_and_review_status():
    for blueprint in BLUEPRINTS.values():
        assert blueprint.basis.strip()
        assert blueprint.review == "pending"


# ---------------------------------------------------------------------------
# Refusals
# ---------------------------------------------------------------------------


def test_a_section_on_nodes_with_no_items_is_refused():
    """The central rule: refuse rather than substitute.

    ORG1 is mapped but unauthored and carries no templates. A blueprint over
    it must fail to assemble, not quietly fill itself from general chemistry,
    because a score from those items would not describe organic chemistry.
    """
    bogus = unit_exam("ORG1-U1", "Structure and Bonding", ("ORG1.ORBITALS", "ORG1.HYBRIDORG"), 6)
    assert check_feasible(bogus)
    with pytest.raises(AssemblyError):
        assemble(bogus, USER)


def test_a_section_naming_an_unknown_node_is_refused():
    bogus = Blueprint(
        code="exam.bogus",
        title="Bogus",
        description="",
        scope="",
        sections=(SectionSpec("S1", "S1", ("NOT.A.NODE",), 4, 10),),
        basis="test fixture",
    )
    assert any("unknown node" in p for p in check_feasible(bogus))
    with pytest.raises(AssemblyError):
        assemble(bogus, USER)


def test_thin_bank_is_reported_rather_than_hidden():
    """Repeating a template is allowed, but the form has to say it happened."""
    blueprint = BLUEPRINTS["exam.unit.gen1-u3"]
    form = assemble(blueprint, USER)
    if form.repeated_templates:
        assert any("more than once" in n for n in form.notes)


# ---------------------------------------------------------------------------
# The form itself
# ---------------------------------------------------------------------------


def test_a_form_never_carries_an_answer_key():
    """Same rule as the practice serve path, and it matters more here."""
    for blueprint in BLUEPRINTS.values():
        form = assemble(blueprint, USER)
        for item in form.items:
            assert "exact_g" not in item.meta
            assert "exact_x" not in item.meta
            if item.grader == "mc":
                assert "correct_index" not in item.meta


def test_every_item_was_independently_verified():
    """An exam item with an unverified key is the worst place for one."""
    for blueprint in BLUEPRINTS.values():
        for item in assemble(blueprint, USER).items:
            assert item.verified_by, f"{item.template_id} was served unverified"


def test_a_form_is_stable_for_one_learner():
    """A reload must not be a reroll."""
    blueprint = BLUEPRINTS["exam.unit.gen1-u3"]
    first = assemble(blueprint, USER)
    second = assemble(blueprint, USER)
    assert [i.seed for i in first.items] == [i.seed for i in second.items]
    assert [i.prompt for i in first.items] == [i.prompt for i in second.items]


def test_two_learners_get_different_variants():
    blueprint = BLUEPRINTS["exam.unit.gen1-u3"]
    a = assemble(blueprint, "learner-a")
    b = assemble(blueprint, "learner-b")
    assert [i.seed for i in a.items] != [i.seed for i in b.items]
    # Same blueprint, so the same skills in the same order.
    assert [i.template_id for i in a.items] == [i.template_id for i in b.items]


def test_items_only_come_from_the_nodes_the_blueprint_asked_for():
    for blueprint in BLUEPRINTS.values():
        allowed = {c for s in blueprint.sections for c in s.node_codes}
        for item in assemble(blueprint, USER).items:
            assert item.node in allowed, f"{item.node} was not in the blueprint"


def test_a_section_spreads_across_its_nodes_before_repeating():
    """An exam that exhausts one node before moving on is a worse sample."""
    blueprint = BLUEPRINTS["exam.unit.gen1-u3"]
    form = assemble(blueprint, USER)
    first_five = [i.node for i in form.items[:5]]
    assert len(set(first_five)) > 1


# ---------------------------------------------------------------------------
# Scoring, and what it refuses to claim
# ---------------------------------------------------------------------------


def _graded(is_correct: bool, *, graded: bool = True, misconception: str | None = None) -> dict:
    return {
        "is_correct": is_correct,
        "score": 1.0 if is_correct else 0.0,
        "graded": graded,
        "grader": "numeric",
        "detail": "",
        "misconception": misconception,
        "milestones": [],
    }


def test_scoring_counts_correct_answers():
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    graded = {i.position: _graded(i.position % 2 == 0) for i in form.items}
    result = score_form(form, graded, {i.position for i in form.items})
    assert result.items == len(form.items)
    assert result.correct == sum(1 for i in form.items if i.position % 2 == 0)


def test_unanswered_items_are_not_counted_as_wrong_beliefs():
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    result = score_form(form, {}, set())
    assert result.answered == 0
    assert result.correct == 0
    assert all(not r.answered for r in result.item_results)


def test_ungradable_answers_are_separated_from_wrong_ones():
    """An unreadable answer is not evidence of a wrong belief."""
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    positions = {i.position for i in form.items}
    graded = {i.position: _graded(False, graded=False) for i in form.items}
    result = score_form(form, graded, positions)
    assert result.ungradable == len(form.items)
    # Every item ungradable means nothing was measured, so there is no percent.
    assert result.raw_percent is None


def test_result_never_reports_a_scaled_score_or_a_pass_mark():
    """The honesty rule this module exists to enforce."""
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    result = score_form(form, {i.position: _graded(True) for i in form.items},
                        {i.position for i in form.items})
    fields = set(result.__dataclass_fields__)
    for forbidden in ("scaled_score", "predicted_grade", "passed", "band", "percentile"):
        assert forbidden not in fields
    assert any("no scaled score" in n.lower() for n in result.notes)


def test_misconceptions_are_tallied_for_remediation():
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    graded = {i.position: _graded(False, misconception="SIGFIG") for i in form.items}
    result = score_form(form, graded, {i.position for i in form.items})
    assert result.misconceptions
    assert result.misconceptions[0][0] == "SIGFIG"
    assert result.misconceptions[0][1] == len(form.items)


def test_per_node_breakdown_covers_every_node_on_the_form():
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    result = score_form(form, {i.position: _graded(True) for i in form.items},
                        {i.position for i in form.items})
    assert {n.node for n in result.nodes} == {i.node for i in form.items}
    assert sum(n.items for n in result.nodes) == len(form.items)


def test_section_totals_reconcile_with_the_overall_total():
    form = assemble(BLUEPRINTS["exam.unit.gen1-u3"], USER)
    graded = {i.position: _graded(i.position % 3 == 0) for i in form.items}
    result = score_form(form, graded, {i.position for i in form.items})
    assert sum(s.items for s in result.sections) == result.items
    assert sum(s.correct for s in result.sections) == result.correct

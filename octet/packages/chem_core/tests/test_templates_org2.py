"""ORG2 practice templates: every variant verifies, every distractor is keyed.

These templates make ORG2 units practiceable. The property that matters is the
same one that protects the rest of the engine: a served variant's key was
confirmed by a route the generator did not use, and no multiple choice item
ships a distractor without a named misconception behind it.
"""

from __future__ import annotations

import chem_core as cc
import pytest

from chem_core.templates_org2 import ORG2_HINTS, ORG2_MISCONCEPTIONS, ORG2_TEMPLATES

TEMPLATE_IDS = sorted(ORG2_TEMPLATES)


def test_the_module_registered_itself():
    for tid in TEMPLATE_IDS:
        assert tid in cc.REGISTRY, f"{tid} is not wired into the registry"


@pytest.mark.parametrize("tid", TEMPLATE_IDS)
def test_every_variant_verifies_across_seeds(tid):
    entry = ORG2_TEMPLATES[tid]
    for seed in range(16):
        variant = entry["gen"](seed)
        result = entry["ver"](variant)
        assert result.ok, f"{tid} seed {seed}: {result.detail}"


@pytest.mark.parametrize("tid", TEMPLATE_IDS)
def test_every_mc_distractor_keys_a_known_misconception(tid):
    entry = ORG2_TEMPLATES[tid]
    for seed in range(16):
        variant = entry["gen"](seed)
        if variant.grader != "mc":
            continue
        issues = cc.validate_choices(variant.meta["choices"], variant.meta["correct_index"])
        assert not issues, f"{tid} seed {seed}: {issues}"


@pytest.mark.parametrize("tid", TEMPLATE_IDS)
def test_every_template_has_a_three_rung_ladder(tid):
    assert tid in ORG2_HINTS
    rungs = ORG2_HINTS[tid]
    assert len(rungs) == 3
    assert all(r.strip() for r in rungs)


@pytest.mark.parametrize("tid", TEMPLATE_IDS)
def test_the_stored_key_grades_as_correct(tid):
    entry = ORG2_TEMPLATES[tid]
    variant = entry["gen"](4)
    answer = variant.meta["correct_index"] if variant.grader == "mc" else variant.key
    assert cc.grade(variant.grader, variant, answer).is_correct


def test_the_amino_acid_template_reads_cysteine_as_r_not_s():
    """The subtle case that only a derived descriptor gets right.

    L-cysteine is R because its sulfur side chain outranks the carboxyl. If the
    template ever hard-coded S for L-amino acids this would fail, which is the
    point of keeping the descriptor derived.
    """
    entry = ORG2_TEMPLATES["org2.aminoacid.config.v1"]
    seen = {}
    for seed in range(16):
        v = entry["gen"](seed)
        name = v.prompt.split(" is drawn")[0]
        correct = v.meta["choices"][v.meta["correct_index"]]["text"]
        seen[name] = correct
    assert seen.get("L-cysteine") == "R", seen
    assert seen.get("L-alanine") == "S", seen


def test_new_misconceptions_are_pending_and_route_somewhere():
    # chem_core has no view of the curriculum graph, so routing to a real node
    # is checked by the app compliance suite; here we assert the shape that
    # makes that check possible and that nothing is falsely marked reviewed.
    for code, m in ORG2_MISCONCEPTIONS.items():
        assert m.routes_to.startswith("ORG2."), f"{code} does not route into ORG2"
        assert m.review == "pending"
        assert m.source

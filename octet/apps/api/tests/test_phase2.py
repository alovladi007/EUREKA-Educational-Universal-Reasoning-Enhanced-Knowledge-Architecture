"""Phase 2 gate: compliance checklist green.

These tests are the gate, not illustrations. Each maps to a line of the
teaching model checklist or the build prompt's Phase 2 deliverables.
"""

from __future__ import annotations

import chem_core as cc
import pytest

from app.compliance import run
from app.data.curriculum import EDGES, NODES, NODES_BY_CODE, tier_counts, topological_order
from app.data.lessons import LESSONS
from app.data.molecule_build import validate_library
from app.data.molecules import MOLECULES, molecule_pool
from app.domains.adaptive.bkt import bkt_update, level_for
from app.domains.adaptive.picker import pick_next, plan_path
from app.domains.adaptive.sm2 import Sm2State, sm2_update
from app.domains.attempts.review import open_missed, record_outcome, retry_payload
from app.domains.practice.diagnostic import build_diagnostic, score_diagnostic


# --------------------------- the gate itself ---------------------------

def test_compliance_checklist_is_green():
    report = run()
    assert report["green"], f"blocking problems: {report['blocking'][:10]}"


def test_phase2_deliverable_counts():
    counts = tier_counts()
    assert counts == {"CF": 12, "G1": 24, "G2": 24}, counts
    assert len(LESSONS) == 60
    assert len(cc.REGISTRY) >= 20, "Phase 2 specifies 20 or more templates"
    assert validate_library()["built"] == 200


# --------------------------- curriculum ---------------------------

def test_graph_is_acyclic_and_fully_connected():
    order = topological_order()
    assert order is not None and len(order) == len(NODES)
    for a, b in EDGES:
        assert a in NODES_BY_CODE and b in NODES_BY_CODE


def test_every_node_has_a_lesson_in_the_six_part_arc():
    for node in NODES:
        lesson = LESSONS.get(node.code)
        assert lesson is not None, f"{node.code} has no lesson"
        assert lesson.missing_parts() == [], f"{node.code}: {lesson.missing_parts()}"


def test_lesson_misconceptions_all_exist_in_the_library():
    for code, lesson in LESSONS.items():
        if lesson.misconception:
            assert lesson.misconception in cc.MISCONCEPTIONS, f"{code} names {lesson.misconception}"


def test_lessons_are_plain_ascii_house_style():
    """No em dashes, en dashes, ellipses or curly quotes anywhere in content."""
    banned = {"—", "–", "…", "“", "”", "‘", "’"}
    for code, lesson in LESSONS.items():
        blob = " ".join(lesson.parts().values())
        found = banned & set(blob)
        assert not found, f"{code} uses {found}"


# --------------------------- molecules ---------------------------

def test_molecule_library_builds_and_every_smiles_parses():
    report = validate_library()
    assert report["ok"], report["problems"]


def test_no_molecule_carries_a_policy_exclusion_flag():
    """Section 18: nothing in the weapons, explosives, CW or controlled
    substance categories may be in the library at all."""
    flagged = [m.name for m in MOLECULES if m.safety_flags]
    assert not flagged, f"policy flagged entries present: {flagged}"
    assert len(molecule_pool()) == len(MOLECULES)


def test_every_molecule_has_a_real_world_note():
    """Real molecule framing is required everywhere, so no entry may be bare."""
    for m in MOLECULES:
        assert m.real_world_note.strip(), f"{m.name} has no real world note"


# --------------------------- templates ---------------------------

def test_twelve_seed_sweep_across_all_templates():
    report = cc.sweep(12)
    failures = {t: r["failures"] for t, r in report.items() if r["failures"]}
    assert not failures, failures


def test_every_template_targets_a_real_node_and_has_a_ladder():
    coverage = cc.hint_coverage(list(cc.REGISTRY))
    assert coverage == {"missing": [], "incomplete": []}
    for tid, entry in cc.REGISTRY.items():
        assert entry["node"] in NODES_BY_CODE, f"{tid} targets {entry['node']}"


def test_numeric_grader_accepts_its_own_key_and_names_slips():
    v = cc.resolve_generated("molarity.compute.v1", 3)
    assert cc.grade("numeric", v, v.key).is_correct
    slip = cc.grade("numeric", v, str(v.meta["grams"] / v.meta["litres"]))
    assert not slip.is_correct and slip.detail


@pytest.mark.parametrize("payload", ["", "abc", "NaN", "1e999", "'; DROP TABLE x; --", "9" * 500])
def test_numeric_grader_never_raises(payload):
    v = cc.resolve_generated("gaslaw.ideal.v1", 2)
    result = cc.grade("numeric", v, payload)
    assert isinstance(result, cc.GradeResult)
    assert not result.is_correct


# --------------------------- adaptive engine ---------------------------

def test_bkt_moves_toward_mastery_and_back():
    p = 0.25
    for _ in range(5):
        p = bkt_update(p, True)
    assert level_for(p) == "mastered"
    assert bkt_update(0.8, False) < 0.8


def test_sm2_lapse_resets_interval():
    state = Sm2State()
    for _ in range(3):
        state = sm2_update(state, 5)
    assert state.interval_days > 6
    assert sm2_update(state, 2).interval_days == 1


def test_path_planner_gates_on_prerequisites_and_explains_itself():
    planned = plan_path({})
    assert planned["recommended_node"] in NODES_BY_CODE
    blocked = [p for p in planned["plan"] if p["state"] == "blocked"]
    assert blocked, "a cold start should have blocked nodes"
    for entry in planned["plan"]:
        assert entry["reason"].strip(), f"{entry['node']} has no reason"


def test_picker_prefers_remediation_over_the_frontier():
    choice = pick_next({}, last_misconception_route="C.G1.STOICH")
    assert choice.policy == "remediation"
    assert "C.G1.STOICH" == choice.node


# --------------------------- diagnostic and review ---------------------------

def test_diagnostic_covers_distinct_nodes_and_hides_keys():
    items = build_diagnostic("learner-1", limit=12)
    assert len({i.node for i in items}) == len(items)
    for item in items:
        assert "key" not in item.meta
        assert "value" not in item.meta


def test_diagnostic_scores_into_starting_mastery():
    items = build_diagnostic("learner-1", limit=6)
    scored = score_diagnostic([{"node": i.node, "correct": True} for i in items])
    assert scored["nodes_measured"] == len(items)
    assert all(v > 0.25 for v in scored["mastery"].values())


def test_missed_question_reopens_and_clears():
    store = []
    for _ in range(2):
        record_outcome(store, user_id="u", node="C.G1.STOICH",
                       template_id="stoich.mass_to_mass.v1", seed=7, prompt="p",
                       is_correct=False, student_answer="1", misconception="NO-RATIO")
    assert open_missed(store, "u")[0].miss_count == 2
    record_outcome(store, user_id="u", node="C.G1.STOICH",
                   template_id="stoich.mass_to_mass.v1", seed=7, prompt="p", is_correct=True)
    assert not open_missed(store, "u")


def test_retry_reserves_the_same_variant_without_the_key():
    store = []
    record_outcome(store, user_id="u", node="C.G1.MOLE", template_id="mole.mass_to_moles.v1",
                   seed=11, prompt="p", is_correct=False, student_answer="x")
    payload = retry_payload(store[0])
    assert payload["seed"] == 11
    assert "key" not in payload and "answer" not in payload

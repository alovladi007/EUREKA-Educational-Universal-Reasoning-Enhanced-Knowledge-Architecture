"""Phase 1 gate: graders verified.

The acceptance criteria this file enforces, quoting the build prompt:

  "12-seed sweeps green; adversarial inputs (malformed SMILES, zero
   coefficients, absurd units, hostile mechanism graphs) return graded-false
   with diagnosis, never a 500 ... hint_coverage() gates CI."

Every test here is a gate, not an illustration.
"""

from __future__ import annotations

import math

import pytest

import chem_core as cc


# ---------------------------------------------------------------------------
# The sweep gate
# ---------------------------------------------------------------------------


def test_sweep_twelve_seeds_all_templates_verify():
    report = cc.sweep(12)
    assert report, "registry is empty"
    failures = {tid: r["failures"] for tid, r in report.items() if r["failures"]}
    assert not failures, f"independent verification failed: {failures}"
    for tid, r in report.items():
        assert r["ok"] == r["total"] == 12, f"{tid} verified {r['ok']} of {r['total']}"


def test_every_template_has_a_three_rung_hint_ladder():
    coverage = cc.hint_coverage(list(cc.REGISTRY))
    assert not coverage["missing"], f"templates with no hint ladder: {coverage['missing']}"
    assert not coverage["incomplete"], f"incomplete ladders: {coverage['incomplete']}"


def test_hint_rungs_are_ordered_and_bounded():
    for tid in cc.REGISTRY:
        assert cc.rung(tid, 1) and cc.rung(tid, 2) and cc.rung(tid, 3)
        assert cc.rung(tid, 0) is None
        assert cc.rung(tid, 4) is None, "there is no fourth rung, the solution is not a hint"


def test_variants_are_deterministic_per_seed():
    for tid in cc.REGISTRY:
        a = cc.resolve_generated(tid, 3)
        b = cc.resolve_generated(tid, 3)
        assert a.key == b.key and a.prompt == b.prompt, f"{tid} is not deterministic"


def test_resolve_records_which_verifier_passed():
    for tid in cc.REGISTRY:
        v = cc.resolve_generated(tid, 5)
        assert v.meta.get("verified_by"), f"{tid} served without recording its verifier"


def test_unknown_template_raises():
    with pytest.raises(KeyError):
        cc.resolve_generated("does.not.exist.v1", 1)


# ---------------------------------------------------------------------------
# Grader 1: formula
# ---------------------------------------------------------------------------


def test_formula_correct_and_hill_order():
    r = cc.grade_formula("C9H8O4", "C9H8O4")
    assert r.is_correct and r.score == 1.0
    assert cc.parse_formula("O4C9H8").hill() == "C9H8O4"


def test_formula_accepts_equivalent_ordering_and_groups():
    assert cc.grade_formula("Ca(OH)2", "CaO2H2").is_correct
    assert cc.parse_formula("CuSO4.5H2O").counts["H"] == 10


def test_formula_diagnoses_empirical_versus_molecular():
    r = cc.grade_formula("C6H12O6", "CH2O")
    assert not r.is_correct
    assert r.misconception == "EMP-MOL"
    assert "empirical" in r.detail.lower()


def test_formula_empirical_mode_accepts_the_reduced_ratio():
    assert cc.grade_formula("CH2O", "C6H12O6", mode="empirical").is_correct


def test_formula_diagnoses_missing_charge():
    r = cc.grade_formula("SO4^2-", "SO4")
    assert not r.is_correct and r.misconception == "CHG-OMIT"


def test_formula_verifier_catches_a_wrong_key():
    good = cc.verify_formula_key("C9H8O4", "CC(=O)Oc1ccccc1C(=O)O")
    assert good.ok
    bad = cc.verify_formula_key("C9H9O4", "CC(=O)Oc1ccccc1C(=O)O")
    assert not bad.ok, "verifier accepted a key RDKit disagrees with"


def test_formula_verifier_fails_closed_on_bad_smiles():
    r = cc.verify_formula_key("H2O", "this is not smiles")
    assert not r.ok


# ---------------------------------------------------------------------------
# Grader 2: balance
# ---------------------------------------------------------------------------


def test_balance_correct_answer_accepted_in_both_input_forms():
    skeleton = "C3H8 + O2 -> CO2 + H2O"
    assert cc.grade_balance(skeleton, "1,5,3,4").is_correct
    assert cc.grade_balance(skeleton, "C3H8 + 5 O2 -> 3 CO2 + 4 H2O").is_correct


def test_balance_rejects_non_minimal_but_gives_partial_credit():
    r = cc.grade_balance("C3H8 + O2 -> CO2 + H2O", "2,10,6,8")
    assert not r.is_correct
    assert r.misconception == "NOT-MINIMAL"
    assert r.score > 0, "atoms did balance, so this is not a zero"


def test_balance_diagnoses_the_element_that_is_off():
    skeleton = "C3H8 + O2 -> CO2 + H2O"
    coefficients = [1, 5, 2, 4]
    r = cc.grade_balance(skeleton, ",".join(str(c) for c in coefficients))
    assert not r.is_correct
    assert r.misconception == "ATOM-CONSERV"
    # The report must name an element that is genuinely imbalanced. With this
    # answer both carbon and oxygen are off, and the grader reports the largest
    # imbalance, so assert against the real residual rather than a guess.
    from chem_core.balance import _apply

    residual = cc.conservation_residual(_apply(cc.parse_equation(skeleton), coefficients))
    offending = {k for k in residual if k != "__charge__"}
    assert offending, "this fixture is supposed to be unbalanced"
    assert any(el in r.detail for el in offending), r.detail


def test_balance_enforces_charge_conservation():
    eq = cc.parse_equation("Fe^2+ + Ce^4+ -> Fe^3+ + Ce^3+")
    assert cc.is_balanced(eq), "this one is charge balanced as written"
    bad = cc.parse_equation("Fe^2+ -> Fe^3+")
    assert not cc.is_balanced(bad), "charge is created from nothing here"


def test_balance_verifier_rejects_common_factor_and_bad_counts():
    assert cc.verify_balance_key("C3H8 + O2 -> CO2 + H2O", [1, 5, 3, 4]).ok
    assert not cc.verify_balance_key("C3H8 + O2 -> CO2 + H2O", [2, 10, 6, 8]).ok
    assert not cc.verify_balance_key("C3H8 + O2 -> CO2 + H2O", [1, 5, 3]).ok
    assert not cc.verify_balance_key("C3H8 + O2 -> CO2 + H2O", [1, 5, 2, 4]).ok


def test_balance_solver_and_verifier_agree_across_fixtures():
    from chem_core._fixtures import HYDROCARBONS

    for name, _c, _h in HYDROCARBONS:
        skeleton = f"{name} + O2 -> CO2 + H2O"
        coefficients = cc.solve_coefficients(cc.parse_equation(skeleton))
        assert coefficients is not None, skeleton
        assert cc.verify_balance_key(skeleton, coefficients).ok, skeleton


# ---------------------------------------------------------------------------
# Grader 3: stoichiometry
# ---------------------------------------------------------------------------


def _propane_problem() -> cc.StoichProblem:
    # C3H8 + 5 O2 -> 3 CO2 + 4 H2O
    return cc.StoichProblem(
        given_mass_g=10.0,
        from_formula="C3H8",
        to_formula="CO2",
        from_coefficient=1,
        to_coefficient=3,
        sig_figs=3,
    )


def test_stoich_correct_value_accepted():
    p = _propane_problem()
    s = cc.solve_stoichiometry(p)
    r = cc.grade_stoichiometry(p, f"{s.rounded_g:g}")
    assert r.is_correct and r.score == 1.0


def test_stoich_localizes_the_first_wrong_milestone():
    p = _propane_problem()
    s = cc.solve_stoichiometry(p)
    r = cc.grade_stoichiometry(p, f"{s.moles_to:g}")
    assert not r.is_correct
    assert r.misconception == "MOLES-NOT-MASS"
    failed = r.first_failed_milestone()
    assert failed and failed["name"] == "conversion"


def test_stoich_diagnoses_a_skipped_mole_ratio():
    p = _propane_problem()
    s = cc.solve_stoichiometry(p)
    one_to_one = p.given_mass_g * (s.molar_mass_to / s.molar_mass_from)
    r = cc.grade_stoichiometry(p, f"{one_to_one:g}")
    assert not r.is_correct and r.misconception == "IGNORED-RATIO"


def test_stoich_flags_significant_figures_without_calling_it_wrong_chemistry():
    p = _propane_problem()
    s = cc.solve_stoichiometry(p)
    r = cc.grade_stoichiometry(p, f"{s.answer_g:.8f}")
    assert not r.is_correct
    assert r.misconception == "SIGFIG"
    assert r.score >= 0.75, "the chemistry was right, this is a reporting error"


def test_sig_fig_counting_follows_the_stated_policy():
    assert cc.sig_figs("2.50") == 3
    assert cc.sig_figs("0.0025") == 2
    assert cc.sig_figs("100") == 1
    assert cc.sig_figs("100.") == 3
    assert cc.sig_figs("1.20e3") == 3


def test_stoich_verifier_catches_a_wrong_key():
    p = _propane_problem()
    s = cc.solve_stoichiometry(p)
    assert cc.verify_stoichiometry_key(p, s.answer_g).ok
    assert not cc.verify_stoichiometry_key(p, s.answer_g * 1.01).ok


# ---------------------------------------------------------------------------
# Grader 7: equilibrium
# ---------------------------------------------------------------------------


def _acetic() -> cc.EquilibriumProblem:
    return cc.EquilibriumProblem(
        k=1.8e-5,
        initial={"CH3COOH": 0.100, "H3O+": 0.0, "A-": 0.0},
        stoich={"CH3COOH": -1, "H3O+": 1, "A-": 1},
        label="acetic acid",
    )


def test_equilibrium_solves_and_verifies():
    p = _acetic()
    s = cc.solve_equilibrium(p)
    assert 1e-4 < s.x < 2e-3
    assert cc.verify_equilibrium_key(p, s.x).ok
    assert s.approximation_valid, "at 0.1 M acetic acid the five percent rule holds"


def test_equilibrium_verifier_rejects_wrong_and_unphysical_roots():
    p = _acetic()
    s = cc.solve_equilibrium(p)
    assert not cc.verify_equilibrium_key(p, s.x * 2).ok
    assert not cc.verify_equilibrium_key(p, -1.0).ok
    assert not cc.verify_equilibrium_key(p, 10.0).ok, "extent exceeds the limiting reactant"


def test_equilibrium_grades_correct_answer_and_diagnoses_ph_poh():
    p = _acetic()
    s = cc.solve_equilibrium(p)
    assert cc.grade_equilibrium(p, f"{s.x:.4g}").is_correct
    ph = cc.ph_from_hydronium(s.x)
    r = cc.grade_equilibrium(p, f"{14 - ph:.2f}", target="pH")
    assert not r.is_correct and r.misconception == "PH-POH"


def test_equilibrium_flags_an_invalid_small_x_approximation():
    # A dilute solution of a moderately strong weak acid breaks the five
    # percent rule, which is exactly when the approximation misleads.
    p = cc.EquilibriumProblem(
        k=6.8e-4,
        initial={"HF": 0.0010, "H3O+": 0.0, "A-": 0.0},
        stoich={"HF": -1, "H3O+": 1, "A-": 1},
    )
    s = cc.solve_equilibrium(p)
    assert not s.approximation_valid
    r = cc.grade_equilibrium(p, f"{s.approximate_x:.4g}")
    assert not r.is_correct and r.misconception == "APPROX-INVALID"


def test_mass_action_at_the_solved_root_reproduces_k():
    p = _acetic()
    s = cc.solve_equilibrium(p)
    assert math.isclose(cc.mass_action(p, s.x), p.k, rel_tol=1e-6)


# ---------------------------------------------------------------------------
# Grader 6: multiple choice
# ---------------------------------------------------------------------------


def test_mc_names_the_belief_and_never_states_the_answer():
    v = cc.resolve_generated("mc.subscript_coefficient.v1", 1)
    choices = v.meta["choices"]
    r = cc.grade_mc(v.meta["correct_index"], 1, choices)
    assert not r.is_correct
    assert r.misconception == "SUB-COEF"
    m = cc.MISCONCEPTIONS["SUB-COEF"]
    assert m.name in r.detail and m.counterexample in r.detail
    assert "answer is" not in r.detail.lower()


def test_mc_correct_choice_scores_full():
    v = cc.resolve_generated("mc.subscript_coefficient.v1", 2)
    r = cc.grade_mc(v.meta["correct_index"], v.meta["correct_index"], v.meta["choices"])
    assert r.is_correct and r.score == 1.0


def test_every_generated_mc_item_passes_structural_validation():
    for seed in range(12):
        v = cc.resolve_generated("mc.subscript_coefficient.v1", seed)
        assert cc.validate_choices(v.meta["choices"], v.meta["correct_index"]) == []


# ---------------------------------------------------------------------------
# Misconception library integrity
# ---------------------------------------------------------------------------


def test_every_misconception_routes_to_a_node_and_cites_a_source():
    for code, m in cc.MISCONCEPTIONS.items():
        assert m.routes_to, f"{code} routes nowhere"
        assert m.source, f"{code} has no citation"
        assert m.counterexample, f"{code} has no counterexample"
        assert m.name and m.description


def test_library_review_status_is_honest():
    from chem_core.misconceptions import unreviewed

    pending = unreviewed()
    for code in pending:
        assert cc.MISCONCEPTIONS[code].review != "reviewed"
        assert not cc.MISCONCEPTIONS[code].reviewer, (
            "an entry cannot name a reviewer while its status is pending"
        )


def test_every_misconception_a_grader_can_emit_exists_in_the_library():
    emitted = {
        "CHG-OMIT", "EMP-MOL", "SUB-COEF", "COEF-NONPOS", "NOT-MINIMAL",
        "ATOM-CONSERV", "CHG-BAL", "MOLES-NOT-MASS", "NO-RATIO", "IGNORED-RATIO",
        "RATIO-INVERTED", "WRONG-MOLAR-MASS", "SIGFIG", "APPROX-INVALID",
        "PH-POH", "K-SQUARE",
    }
    missing = sorted(emitted - set(cc.MISCONCEPTIONS))
    assert not missing, f"graders emit codes the library does not define: {missing}"


# ---------------------------------------------------------------------------
# Adversarial input: graded=False with a diagnosis, never an exception
# ---------------------------------------------------------------------------


HOSTILE = [
    "",
    "   ",
    ")))(((",
    "'; DROP TABLE items; --",
    "<script>alert(1)</script>",
    "Xx99Zz",
    "C0H0",
    "C-1H4",
    "H" * 5000,
    "1e999",
    "NaN",
    "inf",
    "\x00\x01\x02",
    "水素",
    "9" * 400,
    "(" * 300 + ")" * 300,
]


@pytest.mark.parametrize("payload", HOSTILE)
def test_formula_grader_never_raises(payload):
    r = cc.grade_formula("H2O", payload)
    assert isinstance(r, cc.GradeResult)
    assert not r.is_correct
    if not r.graded:
        assert r.detail, "an ungradable submission must still explain itself"


@pytest.mark.parametrize("payload", HOSTILE)
def test_balance_grader_never_raises(payload):
    r = cc.grade_balance("C3H8 + O2 -> CO2 + H2O", payload)
    assert isinstance(r, cc.GradeResult)
    assert not r.is_correct
    assert r.detail


@pytest.mark.parametrize("payload", HOSTILE)
def test_stoich_grader_never_raises(payload):
    r = cc.grade_stoichiometry(_propane_problem(), payload)
    assert isinstance(r, cc.GradeResult)
    assert not r.is_correct
    assert r.detail


@pytest.mark.parametrize("payload", HOSTILE)
def test_equilibrium_grader_never_raises(payload):
    r = cc.grade_equilibrium(_acetic(), payload)
    assert isinstance(r, cc.GradeResult)
    assert not r.is_correct
    assert r.detail


@pytest.mark.parametrize("payload", [None, "abc", -1, 999, 2.5, [], {}])
def test_mc_grader_never_raises(payload):
    choices = [
        {"index": 0, "text": "a", "misconception": None},
        {"index": 1, "text": "b", "misconception": "SUB-COEF"},
    ]
    r = cc.grade_mc(0, payload, choices)
    assert isinstance(r, cc.GradeResult)
    assert not r.is_correct


def test_zero_and_negative_coefficients_are_rejected_not_crashed():
    r = cc.grade_balance("C3H8 + O2 -> CO2 + H2O", "0,5,3,4")
    assert not r.is_correct and r.misconception == "COEF-NONPOS"
    r2 = cc.grade_balance("C3H8 + O2 -> CO2 + H2O", "-1,5,3,4")
    assert not r2.is_correct


def test_malformed_equation_key_is_an_authoring_error_not_a_learner_error():
    r = cc.grade_balance("this is not an equation", "1,1")
    assert not r.graded
    assert "item key" in r.detail


def test_oversized_input_is_capped_rather_than_parsed():
    r = cc.grade_formula("H2O", "C" * 100_000)
    assert not r.is_correct
    assert not r.graded


# ---------------------------------------------------------------------------
# Dispatch contract
# ---------------------------------------------------------------------------


def test_grade_dispatch_routes_every_supported_grader():
    for tid in cc.REGISTRY:
        v = cc.resolve_generated(tid, 4)
        result = cc.grade(v.grader, v, v.key if v.grader != "mc" else v.meta["correct_index"])
        assert isinstance(result, cc.GradeResult)
        assert result.is_correct, f"{tid} did not accept its own stored key"


def test_grade_dispatch_refuses_graders_from_later_phases():
    # Structure, Lewis, mechanism, spectra and retro arrive in later phases.
    # They must raise rather than quietly pass a learner.
    for later in ("structure", "lewis", "mechanism", "spectra-elucidation", "retro-step"):
        with pytest.raises(KeyError):
            cc.grade(later, {"key": "x", "meta": {}}, "anything")


@pytest.mark.parametrize("payload", ["NaN", "nan", "inf", "-inf", "Infinity"])
def test_non_finite_numbers_are_ungradable_not_merely_wrong(payload):
    """NaN parses as a float but is not a measurement, so it is not gradable."""
    r = cc.grade_stoichiometry(_propane_problem(), payload)
    assert not r.graded, f"{payload} was graded as a number"
    r2 = cc.grade_equilibrium(_acetic(), payload)
    assert not r2.graded, f"{payload} was graded as a concentration"

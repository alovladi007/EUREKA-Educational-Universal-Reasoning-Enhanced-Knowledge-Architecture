"""Phase 3 tests: structure grading, simulations, and predict observe explain.

The tests that matter most here are the ordering ones. A predict, observe,
explain activity whose steps can be taken out of order is not the activity it
claims to be, so those are asserted directly against the ticket layer rather
than through the happy path.
"""

from __future__ import annotations

import time

import pytest

import chem_core as cc
from chem_core.simulate import (
    STRONG_KA,
    EquilibriumSetup,
    TitrationSetup,
    equilibrium_shift,
    reaction_quotient,
    solve_extent,
    solve_ph,
    titration_curve,
    titration_landmarks,
    verify_equilibrium_shift,
    verify_titration,
)

# ---------------------------------------------------------------------------
# Titration engine: checked against values a textbook states independently
# ---------------------------------------------------------------------------

STRONG = TitrationSetup(0.100, 25.00, 0.100, STRONG_KA, "HCl")
WEAK = TitrationSetup(0.100, 25.00, 0.100, 1.75e-5, "CH3COOH")


def test_strong_acid_initial_ph_is_one():
    """0.100 M strong acid is 0.100 M in hydronium, so pH is 1.00 exactly."""
    assert solve_ph(STRONG, 0.0) == pytest.approx(1.00, abs=0.005)


def test_strong_strong_equivalence_is_neutral():
    """Nothing but water and spectator ions remains, so pH is 7.00."""
    landmarks = titration_landmarks(STRONG)
    assert landmarks["equivalence_pH"] == pytest.approx(7.00, abs=0.01)


def test_weak_acid_initial_ph_matches_the_quadratic():
    """The usual classroom approximation is sqrt(Ka * C), derived separately."""
    import math

    approximate = -math.log10(math.sqrt(1.75e-5 * 0.100))
    assert solve_ph(WEAK, 0.0) == pytest.approx(approximate, abs=0.01)


def test_half_equivalence_ph_equals_pka():
    """Henderson-Hasselbalch says pH is pKa when the pair is equimolar."""
    landmarks = titration_landmarks(WEAK)
    assert landmarks["half_equivalence_pH"] == pytest.approx(WEAK.pka, abs=0.02)


def test_weak_acid_equivalence_is_basic():
    """Acetate is a weak base, so equivalence lands above 7 and not at it."""
    landmarks = titration_landmarks(WEAK)
    assert landmarks["equivalence_pH"] > 7.5


def test_curve_is_monotonically_increasing():
    """Adding base can never lower the pH."""
    curve = titration_curve(WEAK, 61)
    values = [p["pH"] for p in curve]
    assert all(b >= a for a, b in zip(values, values[1:]))


def test_buffer_region_is_flat_against_the_equivalence_jump():
    """The buffer claim compared against the right thing.

    An earlier version of this test asserted the buffer region is flatter than
    the strong acid curve over the same volumes. That is false, and the engine
    said so: over 5 mL to 20 mL the strong acid moves 0.78 units and the weak
    acid moves 1.20. Both are flat there, for different reasons, because the
    strong acid still has plenty of unreacted hydronium that far from
    equivalence.

    What buffering actually claims is flatness relative to what the same
    solution does when the buffer is spent, so that is what is compared.
    """
    buffered = solve_ph(WEAK, 20.0) - solve_ph(WEAK, 5.0)
    across_equivalence = solve_ph(WEAK, 27.5) - solve_ph(WEAK, 22.5)
    # 15 mL inside the buffer region against 5 mL spanning equivalence.
    assert buffered < 1.5
    assert across_equivalence > 4.0
    per_mL_buffered = buffered / 15.0
    per_mL_equivalence = across_equivalence / 5.0
    assert per_mL_equivalence > 10 * per_mL_buffered


def test_strong_acid_has_the_sharper_equivalence_jump():
    """A weak acid starts higher and ends the same, so its jump is smaller."""
    strong_jump = solve_ph(STRONG, 27.5) - solve_ph(STRONG, 22.5)
    weak_jump = solve_ph(WEAK, 27.5) - solve_ph(WEAK, 22.5)
    assert strong_jump > weak_jump


def test_titration_verifier_accepts_both_setups():
    for setup in (STRONG, WEAK):
        ok, detail = verify_titration(setup)
        assert ok, detail


# ---------------------------------------------------------------------------
# Equilibrium engine
# ---------------------------------------------------------------------------

HI = EquilibriumSetup(
    stoich={"H2": -1, "I2": -1, "HI": 2},
    initial={"H2": 0.100, "I2": 0.100, "HI": 0.0},
    k=50.5,
)


def test_extent_from_zero_product_matches_the_closed_form():
    """With HI at zero the quadratic solves by hand: 2x/(0.1-x) = sqrt(K).

    This is the case that caught a real sign bug in the bracketing, where a
    species starting at exactly zero made the residual non-monotone and the
    solver returned zero extent, so it is asserted explicitly.
    """
    import math

    root = math.sqrt(50.5)
    expected = 0.100 * root / (2.0 + root)
    assert solve_extent(HI, HI.initial) == pytest.approx(expected, rel=1e-6)


def test_equilibrated_state_has_q_equal_to_k():
    x = solve_extent(HI, HI.initial)
    settled = {s: HI.initial[s] + c * x for s, c in HI.stoich.items()}
    assert reaction_quotient(HI, settled) == pytest.approx(HI.k, rel=1e-6)


def _settled() -> EquilibriumSetup:
    from dataclasses import replace

    x = solve_extent(HI, HI.initial)
    return replace(HI, initial={s: HI.initial[s] + c * x for s, c in HI.stoich.items()})


def test_adding_reactant_drives_forward():
    result = equilibrium_shift(_settled(), {"H2": 0.050})
    assert result["direction"] == "forward"
    ok, detail = verify_equilibrium_shift(_settled(), result)
    assert ok, detail


def test_adding_product_drives_reverse():
    result = equilibrium_shift(_settled(), {"HI": 0.050})
    assert result["direction"] == "reverse"


def test_removing_reactant_drives_reverse():
    result = equilibrium_shift(_settled(), {"I2": -0.005})
    assert result["direction"] == "reverse"


def test_no_stress_produces_no_shift():
    """This is the catalyst case. A catalyst applies no stress, so nothing moves."""
    result = equilibrium_shift(_settled(), {})
    assert result["direction"] == "none"
    assert result["extent"] == pytest.approx(0.0, abs=1e-9)


def test_k_is_unchanged_by_every_stress():
    """The named misconception is that a shift changes K. It does not."""
    settled = _settled()
    for stress in ({"H2": 0.050}, {"HI": 0.050}, {"I2": -0.005}, {}):
        result = equilibrium_shift(settled, stress)
        assert result["q_after"] == pytest.approx(settled.k, rel=1e-6)


# ---------------------------------------------------------------------------
# Scenario content and its verification
# ---------------------------------------------------------------------------


def test_every_poe_key_agrees_with_its_own_simulation():
    """The core Phase 3 guarantee for grader 12."""
    from app.data.simulations import OUTCOME_RULES, POE_ITEMS, run_scenario

    assert POE_ITEMS, "there are no activities to verify"
    for item_id, item in POE_ITEMS.items():
        outcome = OUTCOME_RULES[item_id](run_scenario(item.scenario))
        verified = cc.verify_prediction_key(item, {"outcome": outcome})
        assert verified.ok, f"{item_id}: {verified.detail}"


def test_every_poe_distractor_keys_a_known_misconception():
    from app.data.simulations import POE_ITEMS

    for item_id, item in POE_ITEMS.items():
        for options, key in (
            (item.predict_options, item.predict_key),
            (item.explain_options, item.explain_key),
        ):
            assert cc.check_options(options, key) == [], item_id
            for option in options:
                if option.id != key:
                    assert option.misconception in cc.MISCONCEPTIONS, (
                        f"{item_id} option {option.id}"
                    )


def test_scenarios_referenced_by_activities_exist():
    from app.data.simulations import POE_ITEMS, SCENARIOS

    for item in POE_ITEMS.values():
        assert item.scenario in SCENARIOS


# ---------------------------------------------------------------------------
# Grader 12
# ---------------------------------------------------------------------------


def _item():
    from app.data.simulations import POE_ITEMS

    return POE_ITEMS["poe.titr.weak-equivalence"]


def test_correct_prediction_scores_one():
    result = cc.grade_prediction(_item(), "above7")
    assert result.is_correct and result.score == 1.0


def test_wrong_prediction_names_the_belief_not_just_wrong():
    result = cc.grade_prediction(_item(), "equals7")
    assert not result.is_correct
    assert result.misconception == "EQUIV-IS-NEUTRAL"
    assert result.detail.strip()


def test_unknown_option_is_ungradable_not_wrong():
    """A selection outside the offered set is a client fault, not a wrong answer."""
    result = cc.grade_prediction(_item(), "not-an-option")
    assert not result.graded


def test_prediction_dispatches_through_the_shared_entry_point():
    item = _item()
    result = cc.grade(
        "prediction",
        {
            "key": item.predict_key,
            "meta": {
                "item_id": item.id,
                "options": [
                    {
                        "id": o.id,
                        "text": o.text,
                        "misconception": o.misconception,
                        "feedback": o.feedback,
                    }
                    for o in item.predict_options
                ],
            },
        },
        "above7",
    )
    assert result.is_correct


# ---------------------------------------------------------------------------
# Grader 4
# ---------------------------------------------------------------------------


def test_same_molecule_written_differently_is_correct():
    """Kekule versus aromatic notation is the same benzene."""
    result = cc.grade_structure("c1ccccc1", "C1=CC=CC=C1")
    assert result.is_correct


def test_constitutional_isomer_is_diagnosed_not_merely_wrong():
    """Ethanol and dimethyl ether share C2H6O and are different substances."""
    result = cc.grade_structure("CCO", "COC")
    assert not result.is_correct
    assert result.misconception == "CONSTITUTIONAL-ISOMER"


def test_stereochemistry_slip_is_partial_credit_under_strict_policy():
    result = cc.grade_structure(r"C/C=C/C", r"C/C=C\C", stereo="strict")
    assert not result.is_correct
    assert result.misconception == "STEREO-IGNORED"
    assert result.score == pytest.approx(0.5)


def test_loose_stereo_policy_accepts_either_arrangement():
    """General chemistry has not taught stereochemistry, so it is not assessed."""
    result = cc.grade_structure(r"C/C=C/C", r"C/C=C\C", stereo="loose")
    assert result.is_correct


def test_unparseable_structure_is_ungradable_not_wrong():
    """Five bonds to carbon is a drawing fault, and saying so beats scoring zero."""
    result = cc.grade_structure("CCO", "C(C)(C)(C)(C)C(")
    assert not result.graded


def test_structure_key_verifier_uses_inchi():
    result = cc.verify_structure_key("CCO")
    assert result.ok and result.method == "inchikey-agreement"


def test_structure_verifier_rejects_a_mismatched_library_key():
    result = cc.verify_structure_key("CCO", expected_inchikey="THIS-IS-NOT-A-KEY")
    assert not result.ok


def test_structure_template_serves_a_verified_variant():
    variant = cc.resolve_generated("structure.draw.v1", 7)
    assert variant.grader == "structure"
    assert cc.canonical(variant.key) == variant.key


def test_structure_template_hint_ladder_never_contains_the_key():
    variant = cc.resolve_generated("structure.draw.v1", 3)
    for level in (1, 2, 3):
        assert variant.key.lower() not in (cc.rung("structure.draw.v1", level) or "").lower()


# ---------------------------------------------------------------------------
# Ticket layer: the ordering guarantees
# ---------------------------------------------------------------------------


def test_ticket_round_trips():
    from app.domains.chemistry import poe

    state = poe.start("user-1", "poe.titr.weak-equivalence")
    assert poe.read(poe.issue(state), user_id="user-1")["item"] == state["item"]


def test_tampered_ticket_is_rejected():
    from app.domains.chemistry import poe

    ticket = poe.issue(poe.start("user-1", "poe.titr.weak-equivalence"))
    body, signature = ticket.rsplit(".", 1)
    with pytest.raises(poe.TicketError):
        poe.read(f"{body}x.{signature}", user_id="user-1")


def test_ticket_cannot_be_replayed_by_another_learner():
    from app.domains.chemistry import poe

    ticket = poe.issue(poe.start("user-1", "poe.titr.weak-equivalence"))
    with pytest.raises(poe.TicketError):
        poe.read(ticket, user_id="user-2")


def test_forged_phase_without_the_key_is_rejected():
    """The whole design rests on this: state is client held but not client writable."""
    import base64
    import json

    from app.domains.chemistry import poe

    forged = {
        "user": "user-1",
        "item": "poe.titr.weak-equivalence",
        "phase": "explain",
        "iat": time.time(),
    }
    body = base64.urlsafe_b64encode(json.dumps(forged).encode()).decode().rstrip("=")
    with pytest.raises(poe.TicketError):
        poe.read(f"{body}.not-a-real-signature", user_id="user-1")


def test_expired_ticket_is_rejected():
    from app.domains.chemistry import poe

    stale = poe.start("user-1", "poe.titr.weak-equivalence")
    stale["iat"] = time.time() - poe.TICKET_TTL_SECONDS - 60
    with pytest.raises(poe.TicketError):
        poe.read(poe.issue(stale), user_id="user-1")


def test_observing_before_predicting_is_refused():
    from app.domains.chemistry import poe

    state = poe.start("user-1", "poe.titr.weak-equivalence")
    with pytest.raises(poe.TicketError):
        poe.require_phase(state, "observe")


def test_explaining_before_observing_is_refused():
    from app.domains.chemistry import poe

    state = poe.start("user-1", "poe.titr.weak-equivalence")
    state["phase"] = "observe"
    with pytest.raises(poe.TicketError):
        poe.require_phase(state, "explain")


def test_prediction_cannot_be_revised_after_the_result_is_visible():
    """A prediction you can change once you have seen the answer is not one."""
    from app.domains.chemistry import poe

    state = poe.start("user-1", "poe.titr.weak-equivalence")
    state["phase"] = "observe"
    with pytest.raises(poe.TicketError) as excinfo:
        poe.require_phase(state, "predict")
    assert "cannot be changed" in str(excinfo.value)


def test_attempt_state_machine_refuses_the_same_jumps():
    attempt = cc.PoeAttempt(item_id="poe.titr.weak-equivalence")
    ok, why = attempt.can_advance_to("observe")
    assert not ok and why
    attempt.prediction = "above7"
    assert attempt.can_advance_to("observe")[0]
    assert not attempt.can_advance_to("explain")[0]


# ---------------------------------------------------------------------------
# Periodic table and triangle views
# ---------------------------------------------------------------------------


def test_periodic_table_has_every_element_exactly_once():
    from app.data import periodic

    assert len(periodic.ELEMENTS) == 118
    numbers = [e.number for e in periodic.ELEMENTS]
    assert numbers == list(range(1, 119))
    assert len({e.symbol for e in periodic.ELEMENTS}) == 118


def test_unmeasured_properties_are_none_rather_than_invented():
    """Helium has no Pauling electronegativity, and the table must say so."""
    from app.data import periodic

    assert periodic.BY_SYMBOL["He"].electronegativity is None


def test_trend_range_reflects_only_measured_values():
    from app.data import periodic

    values = periodic.trend_values("electronegativity")
    low, high = periodic.trend_range("electronegativity")
    assert low == min(values.values())
    assert high == max(values.values())
    assert len(values) < 118, "some elements genuinely have no value"


def test_unknown_trend_field_raises():
    from app.data import periodic

    with pytest.raises(ValueError):
        periodic.trend_values("not_a_property")


def test_every_triangle_eligible_node_has_a_complete_view():
    from app.data.curriculum import NODES
    from app.data.triangle_views import TRIANGLE_VIEWS

    eligible = [n.code for n in NODES if n.triangle_eligible and n.tier in ("G1", "G2")]
    assert len(eligible) == 18
    for code in eligible:
        view = TRIANGLE_VIEWS[code]
        for level in ("macroscopic", "particulate", "symbolic", "connector", "pitfall"):
            assert str(getattr(view, level)).strip(), f"{code} {level}"


# ---------------------------------------------------------------------------
# The Phase 3 gate
# ---------------------------------------------------------------------------


def test_compliance_is_green():
    from app.compliance import run

    report = run()
    assert report["green"], report["blocking"][:10]


def test_compliance_counts_the_new_surfaces():
    from app.compliance import run

    counts = run()["counts"]
    assert counts["triangle_views"] == 18
    assert counts["elements"] == 118
    assert counts["poe_activities"] >= 4

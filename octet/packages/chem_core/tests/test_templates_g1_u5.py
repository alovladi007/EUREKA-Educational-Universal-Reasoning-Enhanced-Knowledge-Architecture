"""GEN1 Unit 5 thermochemistry templates.

The registry-wide dispatch test already grades every template's own key, but
at a single seed. That is thin cover for a generator: the defect this module
actually shipped with was seed-dependent, and one seed would not have found it.

At first the bond enthalpy generator picked four bond values independently and
subtracted the sums. At seeds 6 and 34 the sums happened to be equal, so dH
came out exactly zero, and zero has no significant figure count, so
format_sig_figs(0.0, 3) returned "0.00", the numeric grader read one figure
where the data carried three, and the item rejected its own key. A sweep found
it in seconds. The generator now chooses the answer first and back-solves one
bond from it, and the verifier refuses a zero as well, so the same mistake
cannot come back through a different route.

So the sweep here is wide, and it asserts the physical identities the
verifiers are built on rather than re-running the generators' arithmetic.
"""

from __future__ import annotations

import math

import pytest

import chem_core as cc
from chem_core.templates_g1_u5 import C_WATER, M_WATER, TEMPLATES_G1_U5

TEMPLATE_IDS = sorted(TEMPLATES_G1_U5)

# Wide enough to have caught the real defect with room to spare (it was at
# seeds 6 and 34), narrow enough not to dominate the suite. 200 seeds took four
# minutes on its own, which is the kind of cost that gets a file excluded from
# CI and then quietly stops protecting anything.
SEEDS = range(80)

U5_NODES = {
    "GEN1.ENERGYBASICS",
    "GEN1.FIRSTLAW",
    "GEN1.HEATCAPACITY",
    "GEN1.CALORIMETRY",
    "GEN1.ENTHALPY",
    "GEN1.THERMOSTOICH",
    "GEN1.HESS",
    "GEN1.FORMATION",
    "GEN1.BONDENTHALPY",
}


def _variant(tid: str, seed: int):
    return TEMPLATES_G1_U5[tid]["gen"](seed)


# ---------------------------------------------------------------------------
# The sweep
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("tid", TEMPLATE_IDS)
def test_the_verifier_agrees_across_the_seed_range(tid):
    for seed in SEEDS:
        v = _variant(tid, seed)
        result = TEMPLATES_G1_U5[tid]["ver"](v)
        assert result.ok, f"{tid} seed {seed}: {result.detail}"


@pytest.mark.parametrize("tid", TEMPLATE_IDS)
def test_every_item_accepts_its_own_key_across_the_seed_range(tid):
    """The check that caught the zero-enthalpy defect."""
    for seed in SEEDS:
        v = _variant(tid, seed)
        answer = v.meta["correct_index"] if v.grader == "mc" else v.key
        result = cc.grade(v.grader, v, answer)
        assert result.is_correct, f"{tid} seed {seed}: {result.detail}"


@pytest.mark.parametrize("tid", TEMPLATE_IDS)
def test_generation_is_deterministic(tid):
    for seed in (0, 7, 41, 199):
        assert _variant(tid, seed).key == _variant(tid, seed).key


# ---------------------------------------------------------------------------
# The physical identities the verifiers rest on
# ---------------------------------------------------------------------------


class TestPhysicalIdentities:
    def test_calorimetry_conserves_energy_and_lands_between_the_two(self):
        for seed in SEEDS:
            v = _variant("thermo.calorimetry.v1", seed)
            tf = v.meta["value"]
            q_m = v.meta["m_metal_g"] * v.meta["c_metal"] * (tf - v.meta["t_metal_C"])
            q_w = v.meta["m_water_g"] * C_WATER * (tf - v.meta["t_water_C"])
            assert abs(q_m + q_w) < 1e-6 * max(abs(q_m), 1.0)
            assert q_m < 0 < q_w, "the metal must cool and the water must warm"
            lo, hi = sorted((v.meta["t_metal_C"], v.meta["t_water_C"]))
            assert lo < tf < hi

    def test_hess_closes_the_cycle(self):
        for seed in SEEDS:
            v = _variant("thermo.hess.v1", seed)
            loop = v.meta["value"] + v.meta["dh2_kJ"] - v.meta["dh1_kJ"]
            assert abs(loop) < 1e-9 * max(abs(v.meta["dh1_kJ"]), 1.0)

    def test_formation_and_its_reverse_cancel(self):
        for seed in SEEDS:
            v = _variant("thermo.formation.v1", seed)
            reverse = (v.meta["hf_a"] + 2 * v.meta["hf_b"]) - (v.meta["hf_c"] + v.meta["hf_d"])
            assert abs(reverse + v.meta["value"]) < 1e-9 * max(abs(v.meta["value"]), 1.0)

    def test_bond_enthalpy_never_comes_out_zero(self):
        """The regression. Seeds 6 and 34 were the original offenders."""
        for seed in SEEDS:
            v = _variant("thermo.bond_enthalpy.v1", seed)
            assert v.meta["value"] != 0, f"seed {seed} gives dH = 0, which has no sig figs"
            assert abs(v.meta["value"]) >= 24.0

    def test_bond_enthalpies_stay_physically_plausible(self):
        """A back-solved value could drift somewhere no real bond lives."""
        for seed in SEEDS:
            v = _variant("thermo.bond_enthalpy.v1", seed)
            for b in v.meta["broken"] + v.meta["formed"]:
                assert 150.0 <= b <= 800.0, f"seed {seed} produced a {b} kJ/mol bond"

    def test_the_first_law_is_undone_by_the_reverse_process(self):
        for seed in SEEDS:
            v = _variant("thermo.first_law.v1", seed)
            assert abs(v.meta["value"] + (-v.meta["q_J"] - v.meta["w_J"])) < 1e-9

    def test_heat_capacity_is_additive_over_stages(self):
        for seed in SEEDS:
            v = _variant("thermo.heat_capacity.v1", seed)
            m, dt = v.meta["mass_g"], v.meta["delta_t_K"]
            staged = m * C_WATER * dt * 0.3 + m * C_WATER * dt * 0.7
            assert math.isclose(staged, v.meta["value"], rel_tol=1e-9)

    def test_thermostoich_round_trips_through_the_molar_mass(self):
        for seed in SEEDS:
            v = _variant("thermo.thermostoich.v1", seed)
            grams_back = (v.meta["value"] / v.meta["dh_per_mol_kJ"]) * M_WATER
            assert math.isclose(grams_back, v.meta["grams"], rel_tol=1e-9)

    def test_an_exothermic_reaction_keeps_its_sign(self):
        for seed in SEEDS:
            assert _variant("thermo.enthalpy_amount.v1", seed).meta["value"] < 0
            assert _variant("thermo.thermostoich.v1", seed).meta["value"] < 0


# ---------------------------------------------------------------------------
# The verifiers have to be able to fail
# ---------------------------------------------------------------------------


class TestVerifiersBite:
    """A verifier that cannot reject anything is decoration.

    Each of these corrupts a variant the way the corresponding mistake would
    and requires the verifier to notice.
    """

    def test_calorimetry_rejects_a_wrong_final_temperature(self):
        v = _variant("thermo.calorimetry.v1", 3)
        v.meta["value"] += 5.0
        assert not TEMPLATES_G1_U5["thermo.calorimetry.v1"]["ver"](v).ok

    def test_hess_rejects_adding_instead_of_reversing(self):
        v = _variant("thermo.hess.v1", 3)
        v.meta["value"] = v.meta["dh1_kJ"] + v.meta["dh2_kJ"]   # the classic slip
        assert not TEMPLATES_G1_U5["thermo.hess.v1"]["ver"](v).ok

    def test_formation_rejects_reactants_minus_products(self):
        v = _variant("thermo.formation.v1", 3)
        v.meta["value"] = -v.meta["value"]
        assert not TEMPLATES_G1_U5["thermo.formation.v1"]["ver"](v).ok

    def test_bond_enthalpy_rejects_formed_minus_broken(self):
        v = _variant("thermo.bond_enthalpy.v1", 3)
        v.meta["value"] = sum(v.meta["formed"]) - sum(v.meta["broken"])
        assert not TEMPLATES_G1_U5["thermo.bond_enthalpy.v1"]["ver"](v).ok

    def test_bond_enthalpy_rejects_a_zero_answer(self):
        v = _variant("thermo.bond_enthalpy.v1", 3)
        v.meta["value"] = 0.0
        v.meta["formed"] = list(v.meta["broken"])
        assert not TEMPLATES_G1_U5["thermo.bond_enthalpy.v1"]["ver"](v).ok

    def test_first_law_rejects_subtracting_work(self):
        v = _variant("thermo.first_law.v1", 3)
        v.meta["value"] = v.meta["q_J"] - v.meta["w_J"]
        ok = TEMPLATES_G1_U5["thermo.first_law.v1"]["ver"](v).ok
        assert not ok or v.meta["w_J"] == 0

    def test_enthalpy_rejects_a_positive_key_for_an_exothermic_reaction(self):
        v = _variant("thermo.enthalpy_amount.v1", 3)
        v.meta["value"] = abs(v.meta["value"])
        assert not TEMPLATES_G1_U5["thermo.enthalpy_amount.v1"]["ver"](v).ok

    def test_energy_basics_rejects_a_key_the_numbers_do_not_support(self):
        v = _variant("thermo.energy_basics.v1", 3)
        v.meta["correct_index"] = 2
        assert not TEMPLATES_G1_U5["thermo.energy_basics.v1"]["ver"](v).ok


# ---------------------------------------------------------------------------
# Wiring
# ---------------------------------------------------------------------------


class TestWiring:
    def test_all_nine_are_registered(self):
        for tid in TEMPLATE_IDS:
            assert tid in cc.REGISTRY, f"{tid} is not wired into the registry"
        assert len(TEMPLATE_IDS) == 9

    def test_one_template_per_node_and_every_node_covered(self):
        nodes = [TEMPLATES_G1_U5[t]["node"] for t in TEMPLATE_IDS]
        assert set(nodes) == U5_NODES
        assert len(nodes) == len(set(nodes)), "two templates landed on one node"

    def test_every_template_has_a_three_rung_ladder(self):
        coverage = cc.hint_coverage(TEMPLATE_IDS)
        assert coverage["missing"] == []
        assert coverage["incomplete"] == []

    def test_the_new_misconceptions_are_live_and_route_somewhere_real(self):
        for code in ("THERMO-HEAT-IS-TEMPERATURE", "THERMO-MORE-MASS-MORE-RISE"):
            assert code in cc.MISCONCEPTIONS
            m = cc.MISCONCEPTIONS[code]
            assert m.routes_to in U5_NODES
            assert m.counterexample.strip()

    def test_the_new_misconceptions_are_not_claimed_as_reviewed(self):
        """No SME has seen these. They say so, like every other entry."""
        for code in ("THERMO-HEAT-IS-TEMPERATURE", "THERMO-MORE-MASS-MORE-RISE"):
            assert cc.MISCONCEPTIONS[code].review == "pending"
            assert cc.MISCONCEPTIONS[code].reviewer == ""

    def test_every_mc_distractor_keys_a_real_misconception(self):
        v = _variant("thermo.energy_basics.v1", 5)
        wrong = [c for c in v.meta["choices"] if c["index"] != v.meta["correct_index"]]
        assert wrong, "an mc item with no distractors is not a diagnostic"
        for choice in wrong:
            assert choice["misconception"] in cc.MISCONCEPTIONS
        keyed = next(c for c in v.meta["choices"] if c["index"] == v.meta["correct_index"])
        assert keyed["misconception"] is None

    def test_constants_carry_a_source(self):
        """No unattributed magic numbers in a prompt."""
        for tid in TEMPLATE_IDS:
            v = _variant(tid, 1)
            assert v.meta.get("constant_source", "").strip(), f"{tid} has no constant_source"

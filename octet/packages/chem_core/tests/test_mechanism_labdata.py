"""Tests for grader 8 (mechanism) and grader 9 (lab data).

The design claims under test:

Mechanism: a stepwise mechanism can be graded without judgement, because every
elementary step is a real forward reaction, and a claimed intermediate is
correct at a step exactly when running the step produces it. So the tests
check that a genuine path grades correct, that a coherent path to the wrong
regiochemistry is diagnosed by consequence rather than refused at the step,
that the first failing step is localized, and that the item verifier refuses
an item whose own key path does not build its own product.

Lab data: the dataset must determine its own answer. The verifier recovers the
key FROM THE DATA by an independent numeric route (regression for kinetics,
half-equivalence interpolation for titration), so the tests check that route
against known inputs, check that non-determining data is refused, and check
the wrong-order / wrong-landmark diagnoses.

Both graders take the standard adversarial battery: hostile input never
raises and never grades correct.
"""

from __future__ import annotations

import json
import math

import chem_core as cc
import pytest

from chem_core.labdata import (
    fit_rate_constant,
    grade_labdata,
    interpolate_at,
    linear_fit,
    verify_kinetics_item,
    verify_titration_item,
)
from chem_core.mechanism import (
    STEP_LIBRARY,
    MechanismItem,
    grade_mechanism,
    verify_mechanism_item,
)

MENU = tuple(
    STEP_LIBRARY[k]
    for k in ("protonate_alkene", "halide_attack", "hydride_shift", "water_attack")
)

HBR_ITEM = MechanismItem(
    node="ORG1.HXADDITION",
    start="CC(C)=C",
    steps_menu=MENU,
    key_path=(("protonate_alkene", "C[C+](C)C"), ("halide_attack", "CC(C)(C)Br")),
    product="CC(C)(C)Br",
    wrong_products=(("CC(C)CBr", "MARKOVNIKOV-INVERTED"),),
)

SHIFT_ITEM = MechanismItem(
    node="ORG1.HXADDITION",
    start="CC(C)C=C",
    steps_menu=MENU,
    key_path=(
        ("protonate_alkene", "CC(C)[CH+]C"),
        ("hydride_shift", "CC[C+](C)C"),
        ("halide_attack", "CCC(C)(C)Br"),
    ),
    product="CCC(C)(C)Br",
    wrong_products=(("CC(C)C(C)Br", "MECH-NO-SHIFT"),),
)


class TestMechanismGrading:
    def test_correct_path_grades_correct(self):
        r = grade_mechanism(
            HBR_ITEM,
            [
                {"step": "protonate_alkene", "intermediate": "C[C+](C)C"},
                {"step": "halide_attack", "intermediate": "CC(C)(C)Br"},
            ],
        )
        assert r.is_correct and r.score == 1.0
        assert all(m["ok"] for m in r.milestones)

    def test_smiles_form_does_not_matter(self):
        # A non-canonical but identical SMILES for the same cation.
        r = grade_mechanism(
            HBR_ITEM,
            [
                {"step": "protonate_alkene", "intermediate": "[C+](C)(C)C"},
                {"step": "halide_attack", "intermediate": "BrC(C)(C)C"},
            ],
        )
        assert r.is_correct

    def test_anti_markovnikov_path_is_diagnosed_by_consequence(self):
        # Both steps fire; the path is coherent chemistry to the minor
        # product, so the belief is named rather than the step refused.
        r = grade_mechanism(
            HBR_ITEM,
            [
                {"step": "protonate_alkene", "intermediate": "CC(C)[CH2+]"},
                {"step": "halide_attack", "intermediate": "CC(C)CBr"},
            ],
        )
        assert not r.is_correct
        assert r.misconception == "MARKOVNIKOV-INVERTED"
        assert all(m["ok"] for m in r.milestones)

    def test_missed_hydride_shift_is_diagnosed(self):
        r = grade_mechanism(
            SHIFT_ITEM,
            [
                {"step": "protonate_alkene", "intermediate": "CC(C)[CH+]C"},
                {"step": "halide_attack", "intermediate": "CC(C)C(C)Br"},
            ],
        )
        assert not r.is_correct
        assert r.misconception == "MECH-NO-SHIFT"

    def test_hydride_shift_path_grades_correct(self):
        r = grade_mechanism(
            SHIFT_ITEM,
            [
                {"step": "protonate_alkene", "intermediate": "CC(C)[CH+]C"},
                {"step": "hydride_shift", "intermediate": "CC[C+](C)C"},
                {"step": "halide_attack", "intermediate": "CCC(C)(C)Br"},
            ],
        )
        assert r.is_correct

    def test_first_failing_step_is_localized(self):
        # halide attack cannot fire on a neutral alkene.
        r = grade_mechanism(
            HBR_ITEM, [{"step": "halide_attack", "intermediate": "CC(C)(C)Br"}]
        )
        assert not r.is_correct
        first = r.first_failed_milestone()
        assert first is not None and first["step"] == 1

    def test_step_fires_but_wrong_structure_claimed(self):
        r = grade_mechanism(
            HBR_ITEM,
            [{"step": "protonate_alkene", "intermediate": "CC(C)(C)Br"}],
        )
        assert not r.is_correct
        assert "does fire here" in r.milestones[0]["detail"]

    def test_unknown_step_is_refused_with_the_menu(self):
        r = grade_mechanism(
            HBR_ITEM, [{"step": "magic", "intermediate": "CC(C)(C)Br"}]
        )
        assert not r.is_correct
        assert "not one of the offered steps" in r.detail


class TestMechanismAdversarial:
    """Hostile input never raises and never grades correct."""

    @pytest.mark.parametrize(
        "payload",
        [
            [],
            "not a list",
            {"step": "protonate_alkene"},
            [{"step": "protonate_alkene", "intermediate": "((("}],
            [{"step": "protonate_alkene", "intermediate": "C" * 500}],
            [{"nonsense": True}],
            [{"step": None, "intermediate": None}],
            [{"step": "protonate_alkene", "intermediate": "C[C+](C)C"}] * 10,
            [42],
            [{"step": "protonate_alkene", "intermediate": "\x00\x01"}],
        ],
    )
    def test_never_raises_never_correct(self, payload):
        r = grade_mechanism(HBR_ITEM, payload)  # must not raise
        assert not r.is_correct

    def test_dispatch_json_string_and_garbage(self):
        v = cc.resolve_generated("org.mech.hbr_markovnikov.v1", 1)
        ans = json.dumps(
            {
                "path": [
                    {"step": "protonate_alkene", "intermediate": "C[C+](C)C"},
                    {"step": "halide_attack", "intermediate": "CC(C)(C)Br"},
                ]
            }
        )
        assert cc.grade("mechanism", v, ans).is_correct
        assert not cc.grade("mechanism", v, "{{{{").is_correct
        assert not cc.grade("mechanism", v, "<script>x</script>").is_correct


class TestMechanismVerifier:
    def test_key_path_verifies(self):
        for item in (HBR_ITEM, SHIFT_ITEM):
            r = verify_mechanism_item(item)
            assert r.ok, r.detail

    def test_broken_key_path_is_refused(self):
        broken = MechanismItem(
            node=HBR_ITEM.node,
            start=HBR_ITEM.start,
            steps_menu=HBR_ITEM.steps_menu,
            # halide attack first: does not fire on the alkene.
            key_path=(("halide_attack", "CC(C)(C)Br"),),
            product="CC(C)(C)Br",
        )
        assert not verify_mechanism_item(broken).ok

    def test_key_path_ending_elsewhere_is_refused(self):
        wrong_end = MechanismItem(
            node=HBR_ITEM.node,
            start=HBR_ITEM.start,
            steps_menu=HBR_ITEM.steps_menu,
            key_path=(("protonate_alkene", "C[C+](C)C"),),
            product="CC(C)(C)Br",
        )
        assert not verify_mechanism_item(wrong_end).ok

    def test_conservation_catches_an_atom_dropping_key(self):
        # A key whose stored intermediate quietly loses a carbon.
        dropped = MechanismItem(
            node=HBR_ITEM.node,
            start=HBR_ITEM.start,
            steps_menu=HBR_ITEM.steps_menu,
            key_path=(("protonate_alkene", "C[CH+]C"), ("halide_attack", "CC(C)Br")),
            product="CC(C)Br",
        )
        assert not verify_mechanism_item(dropped).ok


class TestLabdataRecoveryRoutes:
    """The independent numeric routes, against known ground truth."""

    def test_linear_fit_recovers_a_known_line(self):
        xs = [0.0, 1.0, 2.0, 3.0, 4.0]
        ys = [2.0 + 3.0 * x for x in xs]
        slope, intercept, r2 = linear_fit(xs, ys)
        assert abs(slope - 3.0) < 1e-12
        assert abs(intercept - 2.0) < 1e-12
        assert abs(r2 - 1.0) < 1e-12

    def test_first_order_fit_recovers_k(self):
        k, a0 = 0.0231, 0.500
        data = [{"t": t, "conc": a0 * math.exp(-k * t)} for t in range(0, 121, 15)]
        fit = fit_rate_constant(data, 1)
        assert fit is not None
        assert abs(fit[0] - k) / k < 1e-9

    def test_second_order_fit_recovers_k(self):
        k, a0 = 0.045, 0.800
        data = [{"t": t, "conc": a0 / (1 + k * a0 * t)} for t in range(0, 241, 30)]
        fit = fit_rate_constant(data, 2)
        assert fit is not None
        assert abs(fit[0] - k) / k < 1e-9

    def test_interpolation_reads_a_known_curve(self):
        data = [{"vol_mL": v, "pH": 3.0 + 0.1 * v} for v in range(0, 26, 5)]
        got = interpolate_at(data, "vol_mL", "pH", 12.5)
        assert got is not None and abs(got - 4.25) < 1e-12

    def test_interpolation_refuses_out_of_range(self):
        data = [{"vol_mL": 5.0, "pH": 4.0}, {"vol_mL": 10.0, "pH": 5.0}]
        assert interpolate_at(data, "vol_mL", "pH", 20.0) is None


class TestLabdataVerifier:
    def test_good_kinetics_data_verifies(self):
        k, a0 = 0.0231, 0.500
        data = [
            {"t": t, "conc": float(f"{a0 * math.exp(-k * t):.4g}")}
            for t in (0, 10, 20, 30, 45, 60, 90, 120)
        ]
        r = verify_kinetics_item(data, k, 1)
        assert r.ok, r.detail

    def test_wrong_key_is_refused(self):
        k, a0 = 0.0231, 0.500
        data = [
            {"t": t, "conc": float(f"{a0 * math.exp(-k * t):.4g}")}
            for t in (0, 10, 20, 30, 45, 60, 90, 120)
        ]
        assert not verify_kinetics_item(data, k * 1.5, 1).ok

    def test_non_discriminating_data_is_refused(self):
        # Two points fit every order perfectly: the data does not determine
        # the order, and the verifier must say so.
        k, a0 = 0.0231, 0.500
        data = [
            {"t": t, "conc": a0 * math.exp(-k * t)} for t in (0, 10)
        ]
        r = verify_kinetics_item(data, k, 1)
        assert not r.ok

    def test_titration_curve_verifies_and_wrong_pka_is_refused(self):
        # A synthetic curve whose half-equivalence pH is exactly the pKa.
        pka, eq = 4.76, 25.0
        data = [
            {"vol_mL": 0.0, "pH": 2.9},
            {"vol_mL": 6.25, "pH": 4.28},
            {"vol_mL": 12.5, "pH": pka},
            {"vol_mL": 18.75, "pH": 5.24},
            {"vol_mL": 25.0, "pH": 8.7},
        ]
        assert verify_titration_item(data, pka, eq).ok
        assert not verify_titration_item(data, pka + 1.0, eq).ok

    def test_curve_not_bracketing_halfeq_is_refused(self):
        data = [{"vol_mL": 20.0, "pH": 5.5}, {"vol_mL": 25.0, "pH": 8.7}]
        assert not verify_titration_item(data, 4.76, 25.0).ok


class TestLabdataGrading:
    def test_correct_answer_grades_correct(self):
        r = grade_labdata(0.0231, "1/s", "0.0231 1/s", expected_sig_figs=3)
        assert r.is_correct
        assert r.grader == "labdata"

    def test_wrong_order_slip_is_diagnosed(self):
        wrong_paths = [
            {
                "value": 0.00311,
                "misconception": "ORDER-FROM-COEFFICIENT",
                "detail": "wrong integrated law",
            }
        ]
        r = grade_labdata(0.0231, "1/s", "0.00311", wrong_paths=wrong_paths)
        assert not r.is_correct
        assert r.misconception == "ORDER-FROM-COEFFICIENT"

    @pytest.mark.parametrize(
        "payload",
        ["", "banana", "<script>1</script>", "NaN", "1e999", "0.0231; DROP TABLE"],
    )
    def test_adversarial_never_raises(self, payload):
        r = grade_labdata(0.0231, "1/s", payload)
        assert not r.is_correct


class TestTemplatesAndServing:
    def test_twelve_seed_sweep_all_new_templates(self):
        for tid in (
            "org.mech.hbr_markovnikov.v1",
            "org.mech.acid_hydration.v1",
            "lab.kinetics_k.v1",
            "lab.titration_pka.v1",
        ):
            for seed in range(12):
                v = cc.resolve_generated(tid, seed)  # raises if unverifiable
                assert v.grader in ("mechanism", "labdata")

    def test_new_graders_are_supported_and_dispatch(self):
        assert "mechanism" in cc.SUPPORTED_GRADERS
        assert "labdata" in cc.SUPPORTED_GRADERS

    def test_hint_ladders_have_three_rungs(self):
        from chem_core.hints import HINTS

        for tid in (
            "org.mech.hbr_markovnikov.v1",
            "org.mech.acid_hydration.v1",
            "lab.kinetics_k.v1",
            "lab.titration_pka.v1",
        ):
            assert len(HINTS[tid]) == 3

    def test_new_misconceptions_route_to_real_nodes(self):
        from chem_core.misconceptions import MISCONCEPTIONS

        for code in ("MARKOVNIKOV-INVERTED", "MECH-NO-SHIFT", "PKA-READ-AT-EQUIVALENCE"):
            assert code in MISCONCEPTIONS
            assert MISCONCEPTIONS[code].review == "pending"


class TestLatencyBudget:
    """p95 grading latency stays inside the 500 ms budget for the numeric
    graders, per the Phase 1 evidence. Same budget applied here."""

    def _p95_ms(self, fn, n: int = 30) -> float:
        import time

        times = []
        for _ in range(n):
            t0 = time.perf_counter()
            fn()
            times.append((time.perf_counter() - t0) * 1000.0)
        times.sort()
        return times[int(0.95 * (len(times) - 1))]

    def test_mechanism_p95_under_budget(self):
        path = [
            {"step": "protonate_alkene", "intermediate": "C[C+](C)C"},
            {"step": "halide_attack", "intermediate": "CC(C)(C)Br"},
        ]
        p95 = self._p95_ms(lambda: grade_mechanism(HBR_ITEM, path))
        assert p95 < 500, f"mechanism p95 {p95:.1f} ms"

    def test_labdata_p95_under_budget(self):
        p95 = self._p95_ms(lambda: grade_labdata(0.0231, "1/s", "0.0231"))
        assert p95 < 500, f"labdata p95 {p95:.1f} ms"

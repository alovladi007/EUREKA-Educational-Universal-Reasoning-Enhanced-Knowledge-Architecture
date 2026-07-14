"""Foundations question generators (EM-18): every generator verifies through an
independent path across seeds, every ladder is complete, and the live adapter
produces gradable shapes for both single- and multi-key answers.
"""

from __future__ import annotations

import json

from math_core import GENERATOR_REGISTRY, resolve_generated
from math_core.generators import HINTS, sweep


def test_sweep_all_generators_verify():
    results = sweep(6)
    failures = {t: r for t, r in results.items() if r["ok"] != r["total"]}
    assert not failures, failures
    assert len(results) == 19


def test_every_template_has_a_three_rung_ladder():
    for tid in GENERATOR_REGISTRY:
        assert len(HINTS.get(tid, [])) == 3, tid


def test_registry_targets_foundations_nodes():
    for tid, entry in GENERATOR_REGISTRY.items():
        assert entry["node"][:2] in ("C1", "C2", "C3", "PS", "DM"), (tid, entry["node"])


def test_adapter_single_key_shape():
    q = resolve_generated("T-C1-deriv", 7)
    assert q.kind == "math_expression" and q.correct and len(q.hints) == 3


def test_adapter_multi_key_shape():
    q = resolve_generated("T-C3-partials", 3)
    assert q.kind == "linear_system"
    key = q.meta["key"]
    assert set(key) == {"fx", "fy"}
    assert json.loads(q.correct) == {k: str(v) for k, v in json.loads(q.correct).items()}
    assert "JSON object" in q.prompt


def test_determinism_same_seed_same_variant():
    a = resolve_generated("T-PS-binom", 11)
    b = resolve_generated("T-PS-binom", 11)
    assert a.prompt == b.prompt and a.correct == b.correct
    c = resolve_generated("T-PS-binom", 12)
    assert (c.prompt, c.correct) != (a.prompt, a.correct)

"""End-to-end demo for AXIOM Linear Algebra Unit 1.

Proves the claims in one run:
  1. Seed data validates against the Pydantic schemas and passes referential
     integrity (edges, misconception routes, and distractor keys all resolve).
  2. The verified-everything gate recomputes each static item key with SymPy.
  3. The parameterized template seeds distinct variants, each verified to have a
     unique solution equal to the intended answer.
  4. Every grader accepts correct responses in varied forms and rejects wrong
     ones, and a misconception-keyed distractor routes to a remediation node.
"""

from __future__ import annotations

import json

import sympy as sp

from axiom_schemas import UnitSeed
from axiom_grading import (
    generate_unique_3x3,
    grade_rref,
    grade_solution_point,
    grade_solution_set,
    verify_linear_system_key,
    verify_unique_solution,
)


def line(title: str) -> None:
    print("\n" + "=" * 70)
    print(title)
    print("=" * 70)


def main() -> None:
    with open("linalg_unit1_seed.json") as f:
        raw = json.load(f)

    # 1. Schema validation and referential integrity.
    line("1. Schema validation and referential integrity")
    seed = UnitSeed.model_validate(raw)
    problems = seed.check_referential_integrity()
    print(f"unit: {seed.title}")
    print(f"nodes: {len(seed.nodes)}  edges: {len(seed.edges)}  "
          f"misconceptions: {len(seed.misconceptions)}  items: {len(seed.items)}")
    print(f"referential integrity problems: {len(problems)}")
    for p in problems:
        print("  PROBLEM:", p)
    assert not problems, "referential integrity failed"
    print("PASS: seed is well formed")

    items = {it.id: it for it in seed.items}
    misc = {m.code: m for m in seed.misconceptions}
    nodes = {n.id: n for n in seed.nodes}

    # 2. Verified-everything gate on a static keyed item (Item A).
    line("2. Verified-everything gate on Item A")
    a = items["LA-U1-A"]
    spec = a.answer_spec
    ok = verify_linear_system_key(spec["coeffs"], spec["rhs"], spec["key"])
    print(f"stem: {a.stem}")
    print(f"stored key: {spec['key']}")
    print(f"SymPy recomputed key matches stored key: {ok}")
    assert ok
    print("PASS: key is machine-verified, not author-asserted")

    # 3. Parameterized template: seed variants and verify each.
    line("3. Parameterized template LA-U1-B: three verified variants")
    for seed_val in (101, 202, 303):
        A, b, x = generate_unique_3x3(seed_val, **items["LA-U1-B"].template.params)
        verified = verify_unique_solution(A, b, x)
        print(f"  seed {seed_val}: A rows {A.tolist()}  b {list(b)}  "
              f"unique solution {list(x)}  verified {verified}")
        assert verified
    print("PASS: every seeded variant has a unique solution equal to the key")

    # 4a. Grade Item A: a correct answer in a non-obvious form, and a wrong one.
    line("4a. CAS point grader accepts equivalent forms, rejects wrong")
    key = a.answer_spec["key"]
    good = grade_solution_point({"x": "4/2", "y": "1+0"}, key)   # 2 and 1 in disguise
    bad = grade_solution_point({"x": "2", "y": "0"}, key)
    print(f"  response x=4/2, y=1+0 -> correct={good.correct} ({good.detail})")
    print(f"  response x=2,   y=0   -> correct={bad.correct} ({bad.detail})")
    assert good.correct and not bad.correct
    print("PASS: symbolic equivalence, not string match")

    # 4b. Grade Item C: two different valid reductions reach the same RREF.
    line("4b. RREF grader: any valid reduction path is accepted")
    pm = items["LA-U1-C"].answer_spec["problem_matrix"]
    ref_rref, pivots = sp.Matrix(pm).rref()
    print(f"  problem matrix: {pm}")
    print(f"  unique RREF:    {ref_rref.tolist()}   pivots {pivots}")
    r_good = grade_rref(ref_rref.tolist(), pm)
    r_bad = grade_rref([[1, 2, 0], [0, 0, 1], [0, 0, 0]], pm)
    print(f"  correct RREF submitted -> {r_good.correct} ({r_good.detail})")
    print(f"  wrong matrix submitted -> {r_bad.correct} ({r_bad.detail})")
    assert r_good.correct and not r_bad.correct
    print("PASS")

    # 4c. Grade Item E: two different correct parameterizations both accepted.
    line("4c. Solution-set grader: different valid parameterizations accepted")
    e = items["LA-U1-E"].answer_spec
    # Reference-style answer.
    g1 = grade_solution_set(e["A"], e["b"], [2, 0, 5], [[-1, 1, 0]])
    # A different particular point and an oppositely-signed direction (same set).
    g2 = grade_solution_set(e["A"], e["b"], [0, 2, 5], [[1, -1, 0]])
    # A wrong direction that does not lie in the null space.
    g3 = grade_solution_set(e["A"], e["b"], [2, 0, 5], [[1, 1, 0]])
    print(f"  x=(2,0,5)+t(-1,1,0) -> {g1.correct} ({g1.detail})")
    print(f"  x=(0,2,5)+t(1,-1,0) -> {g2.correct} ({g2.detail})")
    print(f"  x=(2,0,5)+t(1,1,0)  -> {g3.correct} ({g3.detail})")
    assert g1.correct and g2.correct and not g3.correct
    print("PASS: affine solution-set equality, any valid basis")

    # 4d. Item D: a wrong choice diagnoses a misconception and routes remediation.
    line("4d. Misconception-keyed multiple choice drives remediation routing")
    d = items["LA-U1-D"]
    print(f"  stem: {d.stem}")
    for c in d.choices:
        tag = "correct" if c.correct else f"keyed to {c.misconception}"
        print(f"    ({c.key}) {c.text}  [{tag}]")
    chosen = next(c for c in d.choices if c.key == "b")  # the always-unique error
    m = misc[chosen.misconception]
    dest = nodes[m.routes_to]
    print(f"  learner picks (b). Diagnosis: {m.code} {m.name}.")
    print(f"  routes to node {dest.id}: {dest.title}")
    assert chosen.misconception == "M3" and m.routes_to == "N10"
    print("PASS: wrong answer becomes a diagnosis plus a remediation target")

    line("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()

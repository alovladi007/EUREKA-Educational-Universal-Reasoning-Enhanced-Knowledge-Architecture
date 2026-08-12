"""Sweep every authored template against its independent verifier.

THE RULE THIS ENFORCES

No generated answer key is served until a second computational path agrees
with it. `resolve_template` produces the key by substituting sampled values
into `answer_expr` and simplifying with SymPy; the paired verifier recomputes
the same quantity in plain Python by a different route. This sweeps many seeds
per template and fails on the first disagreement.

WHAT IT ALSO CATCHES, WHICH IS MOST OF WHAT GOES WRONG

A template can be arithmetically correct and still broken:

  - unsatisfiable constraints, so no sample is ever found
  - a stem placeholder with no matching variable, so the learner reads "{n}"
  - a non-integer answer where the question implies a whole number
  - an answer that is not deterministic in the seed

Each is checked here, because each has shipped in some codebase as "the maths
was right".

    python -m app.verify_templates            # sweep, print a table
    python -m app.verify_templates --seeds 200
"""

from __future__ import annotations

import argparse
import re
import sys
from fractions import Fraction

import sympy
from math_core.templates import ItemTemplate as McItemTemplate
from math_core.templates import resolve_template

from app.seed_discrete import DISCRETE_TEMPLATES, TemplateSpec

# Every authored tranche registers here. A tranche that is not in this list is
# not swept, which is the one failure mode this file cannot detect itself - so
# the seeder imports the same list rather than keeping its own.
ALL_TEMPLATES: list[TemplateSpec] = [*DISCRETE_TEMPLATES]

PLACEHOLDER = re.compile(r"\{(\w+)\}")


class VerificationError(Exception):
    pass


def _to_exact(value: str) -> Fraction:
    """Parse a resolved answer string into an exact rational.

    The key is compared exactly, not approximately: a template whose answer is
    off by 1e-9 is wrong, not close, because the questions here all have exact
    values.
    """
    expr = sympy.sympify(value)
    rational = sympy.nsimplify(expr, rational=True)
    if not rational.is_rational:
        raise VerificationError(f"answer {value!r} is not rational")
    return Fraction(int(sympy.numer(rational)), int(sympy.denom(rational)))


def _as_mc_template(spec: TemplateSpec) -> McItemTemplate:
    return McItemTemplate(
        id="verify",
        variables=spec.variables,
        constraints=spec.constraints,
        stem=spec.stem,
        answer_expr=spec.answer_expr,
        kind=spec.kind,
        tolerance=spec.tolerance,
        explanation=spec.explanation,
    )


def check_spec(spec: TemplateSpec, seeds: int) -> dict:
    """Sweep one template. Raises VerificationError on any disagreement."""
    declared = {v["name"] for v in spec.variables}
    used = set(PLACEHOLDER.findall(spec.stem))
    if not used <= declared:
        raise VerificationError(
            f"{spec.node}: stem references {sorted(used - declared)} "
            f"which the variable list does not declare"
        )
    if not declared <= used:
        raise VerificationError(
            f"{spec.node}: variables {sorted(declared - used)} are sampled but "
            f"never appear in the stem, so the question is underdetermined"
        )

    mc = _as_mc_template(spec)
    seen: set[str] = set()
    for seed in range(1, seeds + 1):
        variant = resolve_template(mc, seed)

        # Determinism: the same seed must always give the same variant.
        again = resolve_template(mc, seed)
        if again.answer != variant.answer or again.stem != variant.stem:
            raise VerificationError(f"{spec.node}: seed {seed} is not deterministic")

        key = _to_exact(variant.answer)
        expected = Fraction(spec.verifier(variant.values))
        if key != expected:
            raise VerificationError(
                f"{spec.node}: seed {seed} values={variant.values} - "
                f"answer_expr gave {key}, verifier gave {expected}"
            )
        if key.denominator != 1:
            raise VerificationError(
                f"{spec.node}: seed {seed} produced the non-integer answer "
                f"{key}, but the question asks for a count"
            )
        if PLACEHOLDER.search(variant.stem):
            raise VerificationError(
                f"{spec.node}: seed {seed} left an unrendered placeholder in "
                f"the stem: {variant.stem!r}"
            )
        seen.add(variant.stem)

    return {"node": spec.node, "seeds": seeds, "distinct_stems": len(seen)}


def sweep(seeds: int = 100, specs: list[TemplateSpec] | None = None) -> list[dict]:
    rows = []
    for spec in specs if specs is not None else ALL_TEMPLATES:
        rows.append(check_spec(spec, seeds))
    return rows


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seeds", type=int, default=100)
    args = parser.parse_args()

    failures = 0
    print(f"{'node':8s} {'seeds':>6s} {'distinct':>9s}  verdict")
    for spec in ALL_TEMPLATES:
        try:
            row = check_spec(spec, args.seeds)
        except VerificationError as exc:
            failures += 1
            print(f"{spec.node:8s} {args.seeds:6d} {'-':>9s}  FAIL {exc}")
        except Exception as exc:  # pragma: no cover - authoring mistakes
            failures += 1
            print(f"{spec.node:8s} {args.seeds:6d} {'-':>9s}  ERROR {exc!r}")
        else:
            print(
                f"{row['node']:8s} {row['seeds']:6d} {row['distinct_stems']:9d}  ok"
            )

    total = len(ALL_TEMPLATES)
    print(
        f"\n{total - failures}/{total} templates verified against an "
        f"independent second path over {args.seeds} seeds each."
    )
    if failures:
        print("REFUSING TO SEED: fix the failures above first.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())

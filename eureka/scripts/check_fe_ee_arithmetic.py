#!/usr/bin/env python3
"""Check that printed numeric chains in the FE EE course evaluate to their printed results.

The depth checker counts material; this one checks that the arithmetic a reader
can see actually works. It catches a defect class the authoring agents' own
verification cannot: they check their *formulas* against an independent route,
which confirms the final answer, but says nothing about whether the rounded
inputs they printed reproduce it. A chain like

    sqrt(3) * 480 * 24.79 * 0.894 = 18,432

has a correct answer and a correct formula, yet evaluates to 18,425 — a student
who checks the work does not land on the published number.

Only pure-numeric chains are evaluated. Any LaTeX command, variable or unit
inside the left-hand side disqualifies the span, so the checker never guesses at
semantics. Chains off by more than `--max-rel` are ignored as well: those are
almost always a unit-prefix change across the equals sign (volts over kilohms
giving milliamps), which is correct authoring, not an error.

Tolerance is half a unit in the last printed decimal of the right-hand side --
exactly the claim a printed rounding makes.

Usage:
    python3 eureka/scripts/check_fe_ee_arithmetic.py [--max-rel 0.02] [--verbose]

Exit status is 1 if any printed chain fails to reproduce its printed result.
"""
from __future__ import annotations

import argparse
import glob
import os
import re
import sys

SECTIONS = "eureka/apps/web/src/lib/fe-ee-sections/*.ts"

# LaTeX that is pure notation around numbers and can be dropped without
# changing the arithmetic.
_STRIP = [
    ("\\\\times", "*"), ("\\times", "*"), ("×", "*"),
    ("\\\\cdot", "*"), ("\\cdot", "*"),
    ("\\\\,", ""), ("\\,", ""), ("{,}", ""), ("\\!", ""),
    ("\\\\left", ""), ("\\left", ""), ("\\\\right", ""), ("\\right", ""),
]

MATH_SPAN = re.compile(r"\$\$(.+?)\$\$|\$([^$\n]+)\$", re.S)
CHAIN = re.compile(
    r"(?<![\w.])((?:\d+(?:\.\d+)?)(?:\s*[*/+\-]\s*\d+(?:\.\d+)?){1,6})"
    r"\s*=\s*(\d+(?:\.\d+)?)(?![\d.])"
)

# A division written \frac{a}{b} was invisible to this checker for its whole
# working life: the chain regex only ever saw infix operators, so every quotient
# set as a fraction -- which in a maths course is most of them -- went unchecked.
# An authoring agent found the hole by hand-auditing ~60 fractions in one
# chapter and turning up 68182/796.743 printed as 85.578 against a true 85.576.
# Only PURE-NUMERIC numerators and denominators are rewritten; anything with a
# command, variable or operator inside is left alone, so the checker still never
# guesses at semantics. No parentheses are emitted deliberately: a/b binds
# tighter than any neighbouring + or -, and a denominator that would need
# grouping is by construction not pure-numeric and so is never converted.
FRAC = re.compile(
    r"\\{1,2}[dt]?frac\s*\{\s*(\d+(?:\.\d+)?)\s*\}\s*\{\s*(\d+(?:\.\d+)?)\s*\}"
)


def normalise(text: str) -> str:
    for old, new in _STRIP:
        text = text.replace(old, new)
    # thousands separators written as bare commas
    text = re.sub(r"(?<=\d),(?=\d\d\d\b)", "", text)
    # after the comma strip, so \frac{68{,}182}{796.743} is seen as numeric
    return FRAC.sub(r"\1/\2", text)


def tolerance(printed: str) -> float:
    """Half a unit in the last printed decimal place."""
    if "." in printed:
        return 0.5 * (10 ** -len(printed.split(".")[1]))
    return 0.5


def scan(paths, max_rel):
    failures = []
    checked = 0
    for path in paths:
        with open(path, encoding="utf-8") as handle:
            source = handle.read()
        for match in MATH_SPAN.finditer(source):
            span = (match.group(1) or match.group(2) or "").strip()
            line = source[: match.start()].count("\n") + 1
            for chain in CHAIN.finditer(normalise(span)):
                lhs, rhs = chain.group(1), chain.group(2)
                try:
                    value = eval(lhs, {"__builtins__": {}})  # numerals and operators only
                except Exception:
                    continue
                printed = float(rhs)
                if printed == 0 or value == 0:
                    continue
                checked += 1
                gap = abs(value - printed)
                if gap <= tolerance(rhs):
                    continue
                if gap / abs(printed) >= max_rel:
                    continue  # unit-prefix change across the equals sign
                failures.append((os.path.basename(path), line, lhs, rhs, value, span))
    return checked, failures


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--max-rel", type=float, default=0.02,
                        help="ignore mismatches at or above this relative gap (default 0.02)")
    parser.add_argument("--verbose", action="store_true",
                        help="print the full math span for each failure")
    args = parser.parse_args()

    paths = sorted(glob.glob(SECTIONS))
    if not paths:
        print(f"no section files matched {SECTIONS} -- run from the repo root", file=sys.stderr)
        return 2

    checked, failures = scan(paths, args.max_rel)

    for name, line, lhs, rhs, value, span in failures:
        print(f"{name}:{line}  printed  {lhs} = {rhs}   but it computes to {value:.6g}")
        if args.verbose:
            print(f"    {span[:200]}")

    print(f"\n{checked} printed numeric chains checked, {len(failures)} do not reproduce "
          f"their printed result")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())

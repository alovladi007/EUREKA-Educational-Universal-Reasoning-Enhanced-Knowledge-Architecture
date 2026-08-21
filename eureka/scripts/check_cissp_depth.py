#!/usr/bin/env python3
"""CISSP depth gate - enforces the FE-EE-grade standard, per chapter.

Unlike octet/scripts/check_octet_depth.py (whose exit code covers only the
structural checks and merely REPORTS word shortfalls), this gate FAILS the
build on any shortfall of any kind.  That difference is deliberate: reading
"exit 0" as "at standard" is exactly how a node once shipped four words short.

Standard per chapter (mirrors the FE EE raised bar, translated from a maths
subject to a policy/architecture subject):
    words        >= 6000     depth comparable to an FE EE module
    figures      >= 4        theme-paired SVGs actually embedded
    tables       >= 4        markdown reference tables
    subsections  >= 6        '##' headings inside section content
    worked       >= 1        a worked scenario / calculation walkthrough
    self-check   >= 1        a question set WITH answers

Structural checks (all chapters):
    - every referenced figure exists in BOTH light and dark themes
    - no single-backslash LaTeX (TypeScript template literals mangle \\t, \\n...)

Run:  python3 scripts/check_cissp_depth.py [--summary]
Exit: 0 only when every chapter meets every requirement.
"""
from __future__ import annotations

import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
DATA = HERE.parent / "apps" / "web" / "src" / "lib" / "cissp-course-data.ts"
FIGDIR = HERE.parent / "apps" / "web" / "public" / "courses" / "cissp" / "figures"

MIN_WORDS = 6000
MIN_FIGS = 4
MIN_TABLES = 4
MIN_SUBS = 6


def chapters(src: str):
    keys = [(m.group(1), m.start()) for m in re.finditer(r"^(cissp_\w+): \{", src, re.M)]
    for i, (key, start) in enumerate(keys):
        end = keys[i + 1][1] if i + 1 < len(keys) else len(src)
        yield key, src[start:end]


def main() -> int:
    src = DATA.read_text()
    failures: list[str] = []
    rows = []

    bad_latex = sorted(set(re.findall(r"(?<!\\)\\[a-zA-Z]+", src)))
    if bad_latex:
        failures.append(
            f"single-backslash LaTeX would be mangled by the template literal: {bad_latex}")

    for key, seg in chapters(src):
        words = len(re.findall(r"[A-Za-z0-9'-]+", seg))
        figs = re.findall(r"\]\(/courses/cissp/figures/([^)]+)\.svg\)", seg)
        tables = len(re.findall(r"^\|[\s\-|:]+\|\s*$", seg, re.M))
        # A markdown heading may sit immediately after the opening backtick of a
        # template literal, where it still renders but is not at a file line
        # start - so allow a backtick as an alternative anchor.
        AT = r"(?:^|`)"
        subs = len(re.findall(AT + r"## ", seg, re.M))
        worked = len(re.findall(r"(?i)" + AT + r"#+ .*worked", seg, re.M))
        selfcheck = len(re.findall(r"(?i)" + AT + r"#+ *self-check", seg, re.M))
        answers = len(re.findall(r"(?i)" + AT + r"#+ *answers", seg, re.M))

        for stem in figs:
            for suffix in (".svg", ".dark.svg"):
                if not (FIGDIR / f"{stem}{suffix}").exists():
                    failures.append(f"{key}: figure {stem}{suffix} missing from disk")

        short = []
        if words < MIN_WORDS: short.append(f"words {words}/{MIN_WORDS}")
        if len(figs) < MIN_FIGS: short.append(f"figs {len(figs)}/{MIN_FIGS}")
        if tables < MIN_TABLES: short.append(f"tables {tables}/{MIN_TABLES}")
        if subs < MIN_SUBS: short.append(f"subs {subs}/{MIN_SUBS}")
        if worked < 1: short.append("no worked example")
        if selfcheck < 1 or answers < 1: short.append("no self-check+answers")
        if short:
            failures.append(f"{key}: " + ", ".join(short))
        rows.append((key, words, len(figs), tables, subs, worked, selfcheck and answers, not short))

    rows.sort(key=lambda r: r[1])
    print(f"{'chapter':30s} {'words':>7s} {'figs':>5s} {'tbl':>4s} {'subs':>5s} {'wk':>3s} {'sc':>3s}  status")
    for key, w, f, t, s, wk, sc, ok in rows:
        print(f"{key:30s} {w:7d} {f:5d} {t:4d} {s:5d} {wk:3d} {int(bool(sc)):3d}  {'OK' if ok else 'SHORT'}")

    at = sum(1 for r in rows if r[7])
    print(f"\n{at}/{len(rows)} chapters at the FE-EE-grade standard "
          f"({MIN_WORDS}w / {MIN_FIGS} figs / {MIN_TABLES} tables / {MIN_SUBS} subs / worked / self-check)")
    print(f"total words: {sum(r[1] for r in rows):,}   total figure embeds: {sum(r[2] for r in rows)}")

    # A depth gate cannot see a label collision - only a render can.  Fold the
    # figure overlap check in here so a figure that reads as garbage on the page
    # fails the same gate as a chapter that is too short.
    import subprocess
    ov = subprocess.run(
        [sys.executable, str(pathlib.Path(__file__).with_name("check_figure_overlaps.py")),
         "gen_cissp_figures", "cissp-"],
        capture_output=True, text=True)
    print("\n" + ov.stdout.strip())
    if ov.returncode != 0:
        failures.append("figure text overlaps - see the OVERLAP lines above")

    if failures:
        print(f"\nFAIL - {len(failures)} issue(s):")
        for f in failures[:12]:
            print("  -", f)
        if len(failures) > 12:
            print(f"  ... and {len(failures)-12} more")
        return 1
    print("\nOK - every chapter meets every requirement.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

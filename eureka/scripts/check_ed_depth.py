#!/usr/bin/env python3
"""Report the DEPTH of each module, so "expanded" is measured, not claimed.

The course is being taken from narrative depth to a full undergraduate plus
graduate treatment one module at a time. That is a long job, and the honest way
to run it is to have a script say which modules have actually been converted
rather than a person say so. A module counts as EXPANDED when it carries ALL of:

  - words                      (>= 18,000 across the module)
  - display equations          (>= 60)
  - generated figures          (>= 20)
  - worked examples            (>= 15)
  - problem sets with answers  (>= 3 lessons containing both)

These thresholds are the 2026-08-02 standard, raised from the first draft
(8 equations / 2 figures / 2 examples / 1 problem set) after review judged that
level unserious for a graduate-capable course. Anything short is reported as
PARTIAL or NARRATIVE with the missing ingredient named, so the gap is visible
in the same place the progress is.
"""
from __future__ import annotations

import collections
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
LESSONS = ROOT / "docs" / "courses" / "electronic-devices" / "lessons"

MIN_WORDS, MIN_EQ, MIN_FIG, MIN_WEX, MIN_PROB = 18000, 60, 20, 15, 3


def module_of(path: pathlib.Path) -> str:
    stem = path.name.split("-")[0].removeprefix("ch")
    return stem.lstrip("0") or "1"


def main() -> None:
    mods: dict[str, dict] = collections.defaultdict(
        lambda: {"lessons": 0, "eq": 0, "fig": 0, "wex": 0, "prob": 0, "words": 0}
    )
    for md in sorted(LESSONS.glob("*.md")):
        t = md.read_text()
        m = mods[module_of(md)]
        m["lessons"] += 1
        m["words"] += len(t.split())
        m["eq"] += len(re.findall(r"^\$\$$", t, flags=re.M)) // 2
        m["fig"] += len(re.findall(r"!\[[^\]]*\]\(/courses/", t))
        m["wex"] += len(re.findall(r"^#{2,4}\s*Worked example", t, flags=re.M | re.I))
        if re.search(r"^#{2,3}\s*\d*\.?\s*Problems", t, flags=re.M | re.I) and re.search(
            r"^#{2,4}\s*Answers", t, flags=re.M | re.I
        ):
            m["prob"] += 1

    def sort_key(k: str):
        return (0, int(k)) if k.isdigit() else (1, k)

    rows = sorted(mods.items(), key=lambda kv: sort_key(kv[0]))
    print(f"{'mod':>4} {'lessons':>7} {'words':>7} {'eqns':>5} {'figs':>5} "
          f"{'wex':>4} {'probs':>5}  status")
    expanded = 0
    for mid, m in rows:
        missing = []
        if m["words"] < MIN_WORDS:
            missing.append(f"words({m['words']})")
        if m["eq"] < MIN_EQ:
            missing.append("equations")
        if m["fig"] < MIN_FIG:
            missing.append("figures")
        if m["wex"] < MIN_WEX:
            missing.append("worked examples")
        if m["prob"] < MIN_PROB:
            missing.append("problem sets")
        if not missing:
            status = "EXPANDED"
            expanded += 1
        elif len(missing) == 5:
            status = "narrative"
        else:
            status = "partial: needs " + ", ".join(missing)
        print(f"{mid:>4} {m['lessons']:>7} {m['words']:>7} {m['eq']:>5} {m['fig']:>5} "
              f"{m['wex']:>4} {m['prob']:>5}  {status}")

    total_words = sum(m["words"] for _, m in rows)
    print(f"\n  modules at full depth: {expanded}/{len(rows)}")
    print(f"  total course words: {total_words:,}")
    print(f"  total figures referenced: {sum(m['fig'] for _, m in rows)}")
    print(f"  total display equations: {sum(m['eq'] for _, m in rows)}")


if __name__ == "__main__":
    main()

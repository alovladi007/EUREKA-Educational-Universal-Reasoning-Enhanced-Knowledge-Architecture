#!/usr/bin/env python3
"""Coverage report for the Electronic Devices course.

Compares the full topic map (curriculum.json, 548 sections) with the union of
sections the authored lessons declare in their `<!-- covers: ... -->` headers.
A lesson covering an L2 section implicitly covers its L3 children unless a
child is explicitly listed by another lesson.

This is the honesty mechanism: the course ships with its whole syllabus
visible and this report says exactly which parts have authored lessons and
which are pending, so nobody mistakes a topic map for finished content.
Exit code 0 always; it reports, the seeder publishes only covered modules.
"""
from __future__ import annotations

import json
import pathlib
import re

DOCS = pathlib.Path(__file__).resolve().parents[1] / "docs" / "courses" / "electronic-devices"


def main() -> None:
    curriculum = json.loads((DOCS / "curriculum.json").read_text())
    covered: set[str] = set()
    for md in sorted((DOCS / "lessons").glob("*.md")):
        m = re.search(r"<!-- covers: (.*?) -->", md.read_text())
        if m:
            covered |= {c.strip() for c in m.group(1).split(",")}

    total = done = 0
    print(f"{'module':<44} {'sections':>8} {'authored':>9}")
    for ch in curriculum:
        secs = [s["n"] for s in ch["sections"]] or [ch["id"]]
        n_done = sum(
            1 for n in secs
            if n in covered or (n.count(".") == 2 and ".".join(n.split(".")[:2]) in covered)
            or (not ch["sections"] and f"chapter {ch['id']}" in covered)
        )
        if not ch["sections"]:  # chapter with no numbered sections (ch. 1)
            n_done = 1 if any(f"chapter {ch['id']}" in c for c in covered) else 0
            secs = ["-"]
        total += len(secs); done += n_done
        mark = "DONE" if n_done == len(secs) else (f"{n_done}/{len(secs)}" if n_done else "pending")
        print(f"  {ch['id']:>2} {ch['title'][:40]:<40} {len(secs):>8} {mark:>9}")
    print(f"\n  sections covered by authored lessons: {done}/{total}")


if __name__ == "__main__":
    main()

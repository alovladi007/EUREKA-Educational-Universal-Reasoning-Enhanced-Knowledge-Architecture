#!/usr/bin/env python3
"""Prove the organic rechaptering loses nothing before it is applied.

A curriculum reorganisation is the easiest possible place to lose content: a
node that is simply not mentioned in the new structure disappears silently,
taking its lesson, its items and its place in the prerequisite graph with it.
Nothing errors. The course just gets quietly smaller.

So this fails loudly on any of:
  - an existing organic node that appears in no chapter and is not declared
    homeless
  - a node listed in two chapters
  - a chapter referencing a node that neither exists nor is declared new
  - a declared-new node nobody actually placed
  - a non-empty HOMELESS set

Run before and after applying the remap.
"""
from __future__ import annotations

import collections
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HERE))

from app.data.org_rechapter_map import (  # noqa: E402
    ORG1_CHAPTERS, ORG2_CHAPTERS, HOMELESS, NEW_NODES, all_mapped_ids,
)

CURRICULUM = HERE / "app" / "data" / "curriculum.json"


def existing_org_nodes() -> dict[str, str]:
    data = json.loads(CURRICULUM.read_text())
    out: dict[str, str] = {}
    for course in data["courses"]:
        if course["id"] not in ("ORG1", "ORG2"):
            continue
        for unit in course["units"]:
            for node in unit["nodes"]:
                out[node["id"]] = node["title"]
    return out


def main() -> int:
    existing = existing_org_nodes()
    mapped = all_mapped_ids()
    mapped_set = set(mapped)
    problems: list[str] = []

    dupes = [k for k, v in collections.Counter(mapped).items() if v > 1]
    if dupes:
        problems.append(f"node listed in more than one chapter: {sorted(dupes)}")

    orphaned = set(existing) - mapped_set - set(HOMELESS)
    if orphaned:
        problems.append(
            f"{len(orphaned)} authored node(s) would stop being taught: "
            f"{sorted(orphaned)}")

    undeclared = mapped_set - set(existing) - set(NEW_NODES)
    if undeclared:
        problems.append(f"chapter references unknown node: {sorted(undeclared)}")

    unplaced = set(NEW_NODES) - mapped_set
    if unplaced:
        problems.append(f"declared new but never placed: {sorted(unplaced)}")

    if HOMELESS:
        problems.append(
            f"{len(HOMELESS)} node(s) still homeless: {sorted(HOMELESS)}")

    reused = mapped_set & set(existing)
    print(f"existing organic nodes : {len(existing)}")
    print(f"placed into chapters   : {len(mapped_set)} "
          f"({len(reused)} reused, {len(mapped_set - set(existing))} new)")
    print(f"chapters               : ORG1 "
          f"{len({c[0] for c in ORG1_CHAPTERS})}, ORG2 "
          f"{len({c[0] for c in ORG2_CHAPTERS})}")

    if problems:
        print("\nFAIL")
        for p in problems:
            print("  -", p)
        return 1
    print("\nOK: every authored organic node has exactly one chapter")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

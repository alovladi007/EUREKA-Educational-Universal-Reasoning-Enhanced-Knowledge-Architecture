#!/usr/bin/env python3
"""Which video slots are declared, and which of those have a file.

The videos are produced separately and uploaded. Declaring the slug in the
lesson data reserves the slot before the file exists, so the reader's layout
does not change shape on upload day - and so the outstanding work is a number
rather than a feeling.

Run:  python3 scripts/check_octet_videos.py
Drop: apps/web/public/videos/octet/{slug}.mp4

Exits 0 whether or not files are present: a missing video is a normal state,
not a build failure. It exits 1 only on a real inconsistency - two nodes
claiming the same slug, or a file sitting in the directory that no node
references, which means either a typo in the filename or a slot that was
renamed and left an orphan behind.
"""
from __future__ import annotations

import collections
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(ROOT / "apps" / "api"))

from app.data.lesson_extras_registry import EXTRAS  # noqa: E402

VIDEO_DIR = ROOT / "apps" / "web" / "public" / "videos" / "octet"
# Accepted containers, in the order a browser is happiest with them.
SUFFIXES = (".mp4", ".webm", ".mov")


def main() -> int:
    declared: dict[str, list[str]] = collections.defaultdict(list)
    for node, extras in EXTRAS.items():
        if extras.video is not None:
            declared[extras.video.slug].append(node)

    present: dict[str, pathlib.Path] = {}
    if VIDEO_DIR.is_dir():
        for path in sorted(VIDEO_DIR.iterdir()):
            if path.suffix.lower() in SUFFIXES:
                present[path.stem] = path

    problems: list[str] = []
    for slug, nodes in sorted(declared.items()):
        if len(nodes) > 1:
            problems.append(f"slug '{slug}' claimed by {len(nodes)} nodes: {nodes}")

    orphans = sorted(set(present) - set(declared))
    for slug in orphans:
        problems.append(
            f"{present[slug].name} is in the directory and no lesson references "
            f"'{slug}' - check the filename against the declared slug"
        )

    have = sorted(set(declared) & set(present))
    want = sorted(set(declared) - set(present))

    print(f"video slots declared : {len(declared)}")
    print(f"files present        : {len(have)}")
    print(f"still to upload      : {len(want)}\n")

    if have:
        print("uploaded:")
        for slug in have:
            size = present[slug].stat().st_size / 1e6
            print(f"  {present[slug].name:44s} {size:6.1f} MB  "
                  f"{declared[slug][0]}")
        print()

    if want:
        print(f"awaiting a file in {VIDEO_DIR.relative_to(ROOT)}/ :")
        for slug in want:
            node = declared[slug][0]
            title = EXTRAS[node].video.title if EXTRAS[node].video else ""
            print(f"  {slug}.mp4")
            print(f"      {node}  ·  {title}")

    if problems:
        print(f"\nFAIL: {len(problems)} problem(s)")
        for p in problems:
            print("  -", p)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

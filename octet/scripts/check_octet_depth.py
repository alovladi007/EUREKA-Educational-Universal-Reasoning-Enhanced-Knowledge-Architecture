#!/usr/bin/env python3
"""The chapter depth gate.

Counts what is actually authored and fails on the ways a chapter can be broken
without anything erroring at runtime. Written after the FE EE depth numbers
were overstated by counting whole source blocks instead of prose: a progress
number that is easy to inflate will be inflated, so this one measures only the
expensive thing and refuses to be generous.

WHAT IT COUNTS

Prose only: the lead and the section bodies. Not headings, captions, table
cells or takeaways. Those are real content, but they are cheap to produce in
bulk and including them lets a word count go up without a chapter being
written.

WHAT IT FAILS ON

  1. A figure referenced by a section with no SVG on disk, in EITHER theme.
     A missing dark file is invisible to a light-mode author and renders as a
     broken image for half the readers.
  2. A video referencing a scene id that does not exist in the frontend scene
     registry. The player degrades honestly, but the learner still loses the
     animation, and the reference is a typo not a decision.
  3. A table with a row whose length does not match its column count. The
     renderer will happily draw a ragged row.
  4. A table of measured quantities with no source. The house rule is no
     invented data; an unsourced number table is where invented data hides.
  5. Unbalanced $ in a body, which silently swallows the rest of a paragraph
     into a maths run.

Exit 1 on any of those. Exit 0 otherwise, having printed the count.

Run:  python3 scripts/check_octet_depth.py
"""
from __future__ import annotations

import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(ROOT / "apps" / "api"))

from app.data.lesson_extras_registry import EXTRAS  # noqa: E402

FIGURES = ROOT / "apps" / "web" / "public" / "figures" / "octet"
SCENES_TS = ROOT / "apps" / "web" / "components" / "chem-scenes.tsx"

# The standard a chapter is being written to. Not a hard failure: a chapter
# below it is under construction rather than broken, and the gate reports the
# shortfall so the programme has a number to work against.
TARGET_WORDS = 1200


def scene_ids() -> set[str]:
    """The scene ids the frontend actually registers.

    Read out of the SCENES map rather than a duplicated list, so a scene added
    to the registry is known here without a second edit.
    """
    src = SCENES_TS.read_text()
    block = re.search(
        r"export const SCENES[^=]*=\s*\{(.*?)\n\};", src, re.DOTALL
    )
    if not block:
        return set()
    return set(re.findall(r"'([a-z0-9-]+)':", block.group(1)))


def unbalanced_dollars(body: str) -> bool:
    """True when $ delimiters do not pair up.

    Counts $ that are not escaped, treating $$ as one token. An odd count means
    an unclosed run, which the renderer handles by falling back to a literal -
    correct behaviour, but it means the author wrote maths that is not
    rendering as maths.
    """
    stripped = body.replace("\\$", "")
    return (stripped.count("$") - 2 * stripped.count("$$")) % 2 != 0


def main() -> int:
    problems: list[str] = []
    ids = scene_ids()
    total_words = 0
    below: list[tuple[str, int]] = []

    for node in sorted(EXTRAS):
        extras = EXTRAS[node]
        words = extras.word_count()
        total_words += words
        if words < TARGET_WORDS:
            below.append((node, words))

        for section in extras.sections:
            where = f"{node}/{section.id}"

            if unbalanced_dollars(section.body):
                problems.append(f"{where}: unbalanced $ in the body")

            fig = section.figure
            if fig is not None:
                for mode in ("light", "dark"):
                    path = FIGURES / f"{fig.stem}-{mode}.svg"
                    if not path.exists():
                        problems.append(
                            f"{where}: figure {fig.stem} has no {mode} file "
                            f"({path.relative_to(ROOT)})"
                        )

            tab = section.table
            if tab is not None:
                for i, row in enumerate(tab.rows):
                    if len(row) != len(tab.columns):
                        problems.append(
                            f"{where}: table row {i} has {len(row)} cells for "
                            f"{len(tab.columns)} columns"
                        )
                # A table carrying numbers has to say where they came from.
                numeric = any(
                    re.search(r"\d", cell)
                    for row in tab.rows
                    for cell in row[1:]
                )
                if numeric and not tab.source.strip():
                    problems.append(
                        f"{where}: table '{tab.caption}' carries numbers and "
                        f"names no source"
                    )

        vid = extras.video
        if vid is not None and vid.scene not in ids:
            problems.append(
                f"{node}: video names scene '{vid.scene}', which is not in "
                f"the SCENES registry"
            )

    figures = sum(len(e.figures()) for e in EXTRAS.values())
    tables = sum(len(e.tables()) for e in EXTRAS.values())
    videos = sum(1 for e in EXTRAS.values() if e.video is not None)
    sections = sum(len(e.sections) for e in EXTRAS.values())

    print(f"chapters authored   : {len(EXTRAS)}")
    print(f"sections            : {sections}")
    print(f"prose               : {total_words:,} words")
    print(f"figures             : {figures} ({figures * 2} files, two themes)")
    print(f"tables              : {tables}")
    print(f"animated explainers : {videos} of {len(ids)} scenes registered")

    if below:
        print(f"\nbelow the {TARGET_WORDS} word standard, still being written:")
        for node, words in below:
            print(f"  {node:28s} {words:5,d}  needs {TARGET_WORDS - words:+,d}")

    if problems:
        print(f"\nFAIL: {len(problems)} problem(s)")
        for p in problems:
            print("  -", p)
        return 1
    print("\nOK: every figure exists in both themes, every scene resolves, "
          "every table is rectangular and sourced, every $ is paired.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

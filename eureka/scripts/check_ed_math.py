#!/usr/bin/env python3
"""Lint the maths and figure references in the course lessons.

Two failures cost a whole afternoon once, so they are checked mechanically now:

1. DISPLAY MATH DELIMITERS. remark-math treats `$$` as display maths only when
   the delimiters sit alone on their own lines. Written inline as
   `$$expr` ... `expr$$` across several lines, KaTeX parses the opening `$` as
   inline maths, chokes on the second `$`, and emits a katex-error span that
   swallows the REST OF THE LESSON. One bad block silently deletes every
   heading, table and figure after it, which is exactly the kind of failure
   that looks fine in the source and is broken in the app.

2. DANGLING FIGURES. A lesson that references a figure which was never
   generated renders a broken image. Both the light file and its .dark.svg
   sibling have to exist.

Also reports unbalanced inline `$`, which produces the same swallowing failure.

Exit code 1 on any error, so this can gate a commit.
"""
from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
LESSONS = ROOT / "docs" / "courses" / "electronic-devices" / "lessons"
FIGURES = ROOT / "apps" / "web" / "public" / "courses" / "electronic-devices" / "figures"

IMG = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")


def check_file(path: pathlib.Path) -> list[str]:
    errors: list[str] = []
    text = path.read_text()
    lines = text.split("\n")

    # --- 1. display maths ---------------------------------------------------
    # Legal forms are a delimiter alone on its line (a fence), or a fully
    # self-contained `$$expr$$` on one line. What breaks KaTeX, and takes the
    # remainder of the lesson with it, is a `$$` that OPENS on a line and does
    # not close on that line.
    in_code = False
    for i, line in enumerate(lines, start=1):
        if line.lstrip().startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        stripped = line.strip()
        if "$$" not in stripped or stripped == "$$":
            continue
        if stripped.count("$$") % 2:
            errors.append(
                f"{path.name}:{i}: `$$` opens but does not close on this line; "
                f"put the delimiters alone on their own lines "
                f"(found {stripped[:48]!r})"
            )

    # --- 2. balanced inline maths ------------------------------------------
    # Inline maths may legally wrap across a newline inside one paragraph, so
    # balance is counted per paragraph rather than per line.
    body = re.sub(r"```.*?```", "", text, flags=re.S)
    body = re.sub(r"^\$\$$.*?^\$\$$", "", body, flags=re.S | re.M)
    for para in body.split("\n\n"):
        singles = len(re.findall(r"(?<!\\)(?<!\$)\$(?!\$)", para))
        if singles % 2:
            first = next((ln for ln in para.split("\n") if "$" in ln), para)[:60]
            errors.append(
                f"{path.name}: unbalanced inline `$` in paragraph starting {first!r}"
            )

    # --- 3. figure references ----------------------------------------------
    for alt, src in IMG.findall(text):
        if not src.startswith("/courses/electronic-devices/figures/"):
            errors.append(f"{path.name}: image outside the figures dir: {src}")
            continue
        name = src.rsplit("/", 1)[-1]
        light = FIGURES / name
        dark = FIGURES / name.replace(".svg", ".dark.svg")
        if not light.exists():
            errors.append(f"{path.name}: missing figure {name}")
        elif not dark.exists():
            errors.append(f"{path.name}: missing dark variant for {name}")
        if not alt.strip():
            errors.append(f"{path.name}: figure {name} has no caption (alt text)")

    return errors


def main() -> None:
    all_errors: list[str] = []
    files = sorted(LESSONS.glob("*.md"))
    for path in files:
        all_errors.extend(check_file(path))

    used = set()
    for path in files:
        for _, src in IMG.findall(path.read_text()):
            used.add(src.rsplit("/", 1)[-1])
    orphans = sorted(
        f.name for f in FIGURES.glob("*.svg")
        if not f.name.endswith(".dark.svg") and f.name not in used
    ) if FIGURES.exists() else []

    if all_errors:
        print(f"MATH/FIGURE LINT: {len(all_errors)} error(s)\n")
        for e in all_errors:
            print("  " + e)
        print()
    else:
        print(f"MATH/FIGURE LINT: clean across {len(files)} lessons")
    if orphans:
        print(f"  note: {len(orphans)} generated figure(s) not referenced yet: "
              f"{', '.join(orphans[:6])}{' ...' if len(orphans) > 6 else ''}")

    sys.exit(1 if all_errors else 0)


if __name__ == "__main__":
    main()

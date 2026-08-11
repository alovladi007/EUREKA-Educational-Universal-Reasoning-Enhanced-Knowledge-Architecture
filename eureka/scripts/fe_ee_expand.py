#!/usr/bin/env python3
"""Append a depth section to FE EE topics, structurally rather than by regex.

Every expansion in this programme has the same shape: one new LessonSection
appended to a topic's `sections` array. Doing that with a text replace per
topic means 84 hand-written anchors and 84 chances to paste into the wrong
object. This walks braces instead, so the insertion point is found the same
way every time and a mismatch raises rather than corrupting the file.

Used by the per-section authoring scripts; not run on its own.
"""
from __future__ import annotations

import pathlib
import re

DATA = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "src" / "lib" / "fe-ee-course-data.ts"
)


def _topic_span(src: str, topic_id: str) -> tuple[int, int]:
    """Character span of one topic object, from its key to its closing brace."""
    m = re.search(r"^(\s*)%s: \{" % re.escape(topic_id), src, re.M)
    if not m:
        raise KeyError("topic %r not found" % topic_id)
    i = src.index("{", m.start())
    depth, j = 0, i
    in_str: str | None = None
    while j < len(src):
        ch = src[j]
        if in_str:
            if ch == "\\":
                j += 2
                continue
            if ch == in_str:
                in_str = None
        elif ch in "'\"`":
            in_str = ch
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return m.start(), j + 1
        j += 1
    raise ValueError("unbalanced braces in topic %r" % topic_id)


def _sections_close(src: str, start: int, end: int) -> int:
    """Index of the `]` that closes this topic's `sections` array."""
    k = src.index("sections: [", start)
    depth, j = 0, src.index("[", k)
    in_str: str | None = None
    while j < end:
        ch = src[j]
        if in_str:
            if ch == "\\":
                j += 2
                continue
            if ch == in_str:
                in_str = None
        elif ch in "'\"`":
            in_str = ch
        elif ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                return j
        j += 1
    raise ValueError("no closing ] for sections")


def append_section(src: str, topic_id: str, section_ts: str) -> str:
    """Return src with section_ts appended to topic_id's sections array."""
    start, end = _topic_span(src, topic_id)
    close = _sections_close(src, start, end)
    body = section_ts.strip()
    if not body.endswith(","):
        body += ","
    # match the indentation the file already uses for section objects
    line_start = src.rfind("\n", 0, close) + 1
    indent = src[line_start:close]
    return src[:close] + body.replace("\n", "\n" + indent) + "\n" + src[close:]


def apply(expansions: dict[str, str]) -> None:
    src = DATA.read_text(encoding="utf-8")
    for tid, section_ts in expansions.items():
        if "id: '" not in section_ts:
            raise ValueError("section for %s has no id" % tid)
        sid = re.search(r"id: '([a-z0-9\-]+)'", section_ts).group(1)
        if ("id: '%s'" % sid) in src:
            print("  skip %-24s (%s already present)" % (tid, sid))
            continue
        src = append_section(src, tid, section_ts)
        print("  +    %-24s %s" % (tid, sid))
    DATA.write_text(src, encoding="utf-8")

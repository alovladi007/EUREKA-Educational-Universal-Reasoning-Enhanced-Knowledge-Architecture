#!/usr/bin/env python3
"""Depth checker for the FE Electrical and Computer course.

The standard for this course is PROSE, not bytes. An earlier report put six
chapters at "2,009-2,149 words" by measuring the whole TypeScript block -
quiz options, explanations, exam tips, overview text, punctuation. The prose
a learner actually reads was 1,254-1,415. That is the mistake this script
exists to make impossible: it counts ONLY the text inside `content:` template
literals, which is exactly what the lesson reader renders.

A topic is EXPANDED when it has

    - at least 2000 words of lesson prose
    - at least one figure (a markdown image), because every section of this
      exam has something worth drawing
    - at least one table, because reference material belongs in rows

Usage:
    python3 scripts/check_fe_ee_depth.py             # summary + remaining
    python3 scripts/check_fe_ee_depth.py --all       # every topic
    python3 scripts/check_fe_ee_depth.py --section Mathematics
"""
from __future__ import annotations

import argparse
import pathlib
import re
import sys

DATA = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "src" / "lib" / "fe-ee-course-data.ts"
)
# The course record was split byte-identically into per-section files so
# section waves can be authored in parallel; the checker reads the main file
# (types + spreads) plus every section file, in name order for stable output.
SECTION_DIR = DATA.parent / "fe-ee-sections"

def read_course_source() -> str:
    parts = [DATA.read_text(encoding="utf-8")]
    if SECTION_DIR.is_dir():
        parts += [f.read_text(encoding="utf-8") for f in sorted(SECTION_DIR.glob("*.ts"))]
    return "\n".join(parts)
FIGDIR = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

WORD_TARGET = 2000

CONTENT = re.compile(r"content: `(.*?)`,", re.S)
TOPIC = re.compile(r"topicId: '(fee_[a-z0-9_]+)'")
# Titles in this file are quoted three different ways - '...', "...", and
# `...` - depending on whether they contain an apostrophe. Matching only the
# single-quoted form reported four real topics as "?" and quietly filed them
# under a section that does not exist.
TITLE = re.compile(r"""title: (?:'((?:[^'\\]|\\.)*)'|"([^"]*)"|`([^`]*)`)""")
WEIGHT = re.compile(r"domainWeight: '((?:[^'\\]|\\.)*)'")
IMAGE = re.compile(r"!\[[^\]]*\]\((/courses/fe-ee/figures/[^)]+)\)")
TABLEROW = re.compile(r"^\|.*\|$", re.M)


class Topic:
    def __init__(self, tid: str, block: str):
        self.id = tid
        t = TITLE.search(block)
        w = WEIGHT.search(block)
        self.title = next((g for g in t.groups() if g), "?") if t else "?"
        self.weight = w.group(1) if w else "?"
        self.section = self.weight.split("·")[0].strip() if w else "?"
        bodies = CONTENT.findall(block)
        self.words = sum(len(b.split()) for b in bodies)
        self.figures = IMAGE.findall(block)
        self.tables = len(TABLEROW.findall(block))

    @property
    def expanded(self) -> bool:
        return (
            self.words >= WORD_TARGET
            and len(self.figures) >= 1
            and self.tables >= 1
        )

    @property
    def gap(self) -> int:
        return max(0, WORD_TARGET - self.words)


def load() -> list[Topic]:
    src = read_course_source()
    marks = [(m.start(), m.group(1)) for m in TOPIC.finditer(src)]
    out = []
    for k, (pos, tid) in enumerate(marks):
        end = marks[k + 1][0] if k + 1 < len(marks) else len(src)
        # step back to the topic's opening line so title/weight are inside
        start = src.rfind("\n", 0, pos - 60)
        out.append(Topic(tid, src[max(0, start):end]))
    return out


#: A dollar sign followed by a digit is money. remark-math reads it as a maths
#: delimiter, silently swallows everything up to the next $, and sets the prose
#: between them as an equation - so "$10,000 depreciation at 30% tax rate →
#: $3,000 tax savings" renders as one italic formula. It has to be written \$.
#: Balanced maths spans, removed before looking for a stray dollar. Checking
#: for "$ followed by a digit" directly flags every legitimate equation that
#: starts with a number, which is most of them.
MATHSPAN = re.compile(r"(?<!\\)\$\$[^$]*?\$\$|(?<!\\)\$[^$\n]*?\$")
CURRENCY = re.compile(r"(?<!\\)\$")


def bad_dollars(topics_src: str) -> list[str]:
    out = []
    for m in CONTENT.finditer(topics_src):
        for line in m.group(1).split("\n"):
            rest = MATHSPAN.sub("", line)
            if CURRENCY.search(rest):
                out.append("stray or unescaped $: " + line.strip()[:84])
    return out


def missing_figures(topics: list[Topic]) -> list[str]:
    """Every referenced figure must exist on disk in BOTH themes. A missing
    dark sibling is invisible in the light theme and a broken image in the
    dark one, which is exactly the kind of defect that ships unnoticed."""
    bad = []
    for t in topics:
        for ref in t.figures:
            for path in (ref, ref[:-4] + ".dark.svg"):
                if not (FIGDIR.parent.parent.parent / path.lstrip("/")).exists():
                    bad.append(f"{t.id}: {path}")
    return bad


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true", help="list every topic")
    ap.add_argument("--section", help="filter to one section name")
    args = ap.parse_args()

    topics = load()
    if args.section:
        topics = [t for t in topics if args.section.lower() in t.section.lower()]
        if not topics:
            print(f"no section matching {args.section!r}")
            return 1

    done = [t for t in topics if t.expanded]
    todo = [t for t in topics if not t.expanded]

    # per-section roll-up, in the order the sections appear in the course
    order: list[str] = []
    for t in topics:
        if t.section not in order:
            order.append(t.section)

    print(f"EXPANDED {len(done)}/{len(topics)} topics "
          f"(>= {WORD_TARGET} words of prose, >= 1 figure, >= 1 table)")
    print(f"prose on hand {sum(t.words for t in topics):,} words; "
          f"still to write ~{sum(t.gap for t in todo):,}\n")

    for sec in order:
        rows = [t for t in topics if t.section == sec]
        ok = sum(1 for t in rows if t.expanded)
        bar = "#" * ok + "." * (len(rows) - ok)
        print(f"  {ok}/{len(rows):<2}  {bar:<12} {sec}")

    shown = topics if args.all else todo
    if shown:
        print(f"\n{'REMAINING' if not args.all else 'ALL TOPICS'}:")
        for t in sorted(shown, key=lambda x: (x.section, -x.gap)):
            flag = "OK " if t.expanded else "   "
            print(f"  {flag}{t.words:5d}w  fig={len(t.figures)} tbl={t.tables:2d}  "
                  f"{t.id:24s} {t.title[:40]}")

    rc = 0
    bad = missing_figures(topics)
    if bad:
        print(f"\nBROKEN FIGURE REFERENCES ({len(bad)}):")
        for b in bad:
            print("  ", b)
        rc = 1

    dollars = bad_dollars(read_course_source())
    if dollars:
        print(f"\nMATH DELIMITER PROBLEMS ({len(dollars)}):")
        for d in dollars[:20]:
            print("  ", d)
        rc = 1
    return rc


if __name__ == "__main__":
    raise SystemExit(main())

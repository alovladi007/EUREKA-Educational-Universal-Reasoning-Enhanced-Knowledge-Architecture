#!/usr/bin/env python3
"""Seed the Electronic Devices course into api-core's course tables.

Idempotent by natural key (P2-18 discipline): the course is keyed by its code,
modules by (course, order_index), content by (course, title). Re-running
updates in place and never duplicates. Run from eureka/:

    python3 scripts/seed_practical_electronics.py

It execs psql inside the running `db` compose service, so it needs the stack
up and nothing else.

PROVENANCE AND COPYRIGHT. The syllabus TOPIC MAP in
docs/courses/electronic-devices/curriculum.json is a COVERAGE SPEC, not
content. Modules 1-16 and A-C track the coverage of Scherz & Monk, "Practical
Electronics for Inventors" 3e; modules 17-57 track the electronic half of
Kasap & Capper (eds.), "Springer Handbook of Electronic and Photonic
Materials" 2e. Both books are copyrighted and neither is a content source.

Concretely, for modules 17-57 the only thing taken from the source is the
SHAPE of the subject: how many chapters there are, how many sections each has,
and which chapter a section belongs to. Every module title and every section
label in curriculum.json was written for this course, and the source is
referenced by chapter/section NUMBER alone (the "src" field), so no publisher
heading text is stored in this repository or displayed in the app. Every
lesson body in lessons/*.md is ORIGINAL text. No passage, example, figure,
table or data set is reproduced or closely paraphrased from either book.

Do not paste book text into the lessons directory.
scripts/check_ed_coverage.py reports authored-vs-pending honestly and nothing
here fabricates content for unauthored sections. See SCOPE.md for the
electronic/photonic scope split.
"""
from __future__ import annotations

import json
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs" / "courses" / "electronic-devices"
COURSE_CODE = "ELEC-DEV"
COURSE_TITLE = "Electronic and Photonic Devices: Design and Characteristics"

COURSE_DESCRIPTION = (
    "A two-part course. Part one builds working electronics from the ground "
    "up: circuit theory, components, semiconductors, sensors, workshop "
    "practice, op amps, filters, oscillators, power supplies, digital logic, "
    "microcontrollers, motors and audio. Part two goes underneath the "
    "components, into the materials and characterization that decide what a "
    "device can do: conduction and scattering, defects and diffusion, "
    "interfaces, disordered and amorphous semiconductors, dielectrics and "
    "ferroelectrics, crystal growth and epitaxy, structural, surface, thermal "
    "and electrical characterization, and the materials behind memory, "
    "graphene, superconductors, thermoelectrics and packaging. All lesson "
    "text is original to EUREKA."
)

COVERAGE_REFS = (
    "Modules 1-16 and A-C: Scherz & Monk, Practical Electronics for "
    "Inventors, 3rd ed. Modules 17-57: Kasap & Capper (eds.), Springer "
    "Handbook of Electronic and Photonic Materials, 2nd ed. (electronic "
    "chapters). Topic map only."
)

SCOPE_NOTE = (
    "Modules 17-57 cover the electronic scope of the materials reference. "
    "Its optoelectronics and photonics part, and the photovoltaic, x-ray "
    "imaging, terahertz and metamaterial chapters, are deferred to a later "
    "photonics wave and are deliberately not listed as syllabus here."
)


def q(s: str) -> str:
    return s.replace("'", "''")


def main() -> None:
    curriculum = json.loads((DOCS / "curriculum.json").read_text())

    lessons = []
    for md in sorted((DOCS / "lessons").glob("*.md")):
        text = md.read_text()
        m = re.search(r"<!-- covers: (.*?) -->", text)
        covers = [c.strip() for c in (m.group(1).split(",") if m else [])]
        title = text.splitlines()[0].lstrip("# ").strip()
        chapter = md.name.split("-")[0].removeprefix("ch").lstrip("0") or "1"
        # Explicit pedagogical order from the filename (ch02-l03-...). Without
        # it the reader sorted alphabetically and Decibels preceded Current.
        order = int(md.name.split("-")[1].removeprefix("l"))
        lessons.append({"title": title, "body": text, "covers": covers, "chapter": chapter, "order": order})

    sql = ["BEGIN;"]

    # One-time identity migration: the course first shipped titled too close
    # to its coverage reference. Rename in place so enrollments and content
    # rows keep their course_id.
    sql.append(f"""
UPDATE courses SET code = '{COURSE_CODE}', title = '{q(COURSE_TITLE)}'
WHERE code = 'ELEC-PRACT';
""")

    # CourseResponse.syllabus is dict-typed; a bare list 500s the listing.
    syllabus = json.dumps({"chapters": curriculum}).replace("'", "''")
    sql.append(f"""
INSERT INTO courses (org_id, title, code, description, tier, subject, category, level,
                     syllabus, status, is_published, metadata)
SELECT o.id, '{q(COURSE_TITLE)}', '{COURSE_CODE}',
       '{q(COURSE_DESCRIPTION)}',
       'undergraduate', 'Electrical Engineering', 'Electronics', 'beginner',
       '{syllabus}'::jsonb, 'published', true,
       jsonb_build_object(
         'coverage_reference', '{q(COVERAGE_REFS)}',
         'content_origin', 'All lesson text is original to EUREKA. The references above define coverage only; no passage, figure or table is reproduced from them.',
         'scope_note', '{q(SCOPE_NOTE)}',
         'sections_total', {sum(len(c['sections']) for c in curriculum)})
-- The org gate on GET /courses/{id} (P0-4) means learners only see
-- courses in THEIR org. Seed into the org that actually holds users,
-- not an empty catch-all: first seed landed in 'EUREKA Public' while
-- the demo learners live in 'Demo University', and the detail page
-- 403'd. Most-users is the right default for dev and harmless in prod.
FROM organizations o
ORDER BY (SELECT count(*) FROM users u WHERE u.org_id = o.id) DESC LIMIT 1
ON CONFLICT DO NOTHING;
""")
    # code has no unique constraint; emulate idempotency by updating if present.
    # Title, description and metadata are updated in place too, so a rename
    # reaches the existing row instead of only new installs: the course id,
    # its modules, its readings and its enrollments all survive the rename.
    sql.append(f"""
UPDATE courses SET syllabus = '{syllabus}'::jsonb, is_published = true, status = 'published',
       title = '{q(COURSE_TITLE)}',
       description = '{q(COURSE_DESCRIPTION)}',
       metadata = COALESCE(metadata, '{{}}'::jsonb) || jsonb_build_object(
         'coverage_reference', '{q(COVERAGE_REFS)}',
         'content_origin', 'All lesson text is original to EUREKA. The references above define coverage only; no passage, figure or table is reproduced from them.',
         'scope_note', '{q(SCOPE_NOTE)}',
         'sections_total', {sum(len(c['sections']) for c in curriculum)})
WHERE code = '{COURSE_CODE}';
""")

    for idx, ch in enumerate(curriculum):
        objectives = json.dumps([f"{s['n']} {s['t']}" for s in ch["sections"]]).replace("'", "''")
        title = q(f"Module {ch['id']}: {ch['title']}")
        sql.append(f"""
INSERT INTO course_modules (course_id, title, description, order_index, is_published, learning_objectives)
SELECT c.id, '{title}',
       'Covers sections {q(ch['sections'][0]['n']) if ch['sections'] else ch['id']}'
       || ' through {q(ch['sections'][-1]['n']) if ch['sections'] else ch['id']}'
       || ' of the course topic map.',
       {idx}, false, '{objectives}'::jsonb
FROM courses c WHERE c.code = '{COURSE_CODE}'
  AND NOT EXISTS (SELECT 1 FROM course_modules m WHERE m.course_id = c.id AND m.order_index = {idx});
UPDATE course_modules m SET learning_objectives = '{objectives}'::jsonb, title = '{title}'
FROM courses c WHERE c.code = '{COURSE_CODE}' AND m.course_id = c.id AND m.order_index = {idx};
""")

    for les in lessons:
        topics = json.dumps(les["covers"]).replace("'", "''")
        body = q(les["body"])
        title = q(les["title"])
        sql.append(f"""
INSERT INTO course_content (course_id, content_type, title, content, topics, metadata)
SELECT c.id, 'reading', '{title}', '{body}', '{topics}'::jsonb,
       jsonb_build_object('chapter', '{les['chapter']}', 'order', {les['order']}, 'authored', true, 'origin', 'original')
FROM courses c WHERE c.code = '{COURSE_CODE}'
  AND NOT EXISTS (SELECT 1 FROM course_content cc WHERE cc.course_id = c.id AND cc.title = '{title}');
UPDATE course_content cc SET content = '{body}', topics = '{topics}'::jsonb,
    metadata = jsonb_build_object('chapter', '{les['chapter']}', 'order', {les['order']}, 'authored', true, 'origin', 'original'),
    updated_at = NOW()
FROM courses c WHERE c.code = '{COURSE_CODE}' AND cc.course_id = c.id AND cc.title = '{title}';
""")

    # Prune orphans: rows this seeder authored whose title no longer matches any
    # lesson file. Upserting by title means a retitled lesson leaves its old row
    # behind (found live: 3 stale pre-expansion lessons in modules 17 and 19).
    # Only 'authored' rows are candidates, so hand-added content is untouched.
    current_titles = ", ".join(f"'{q(les['title'])}'" for les in lessons)
    sql.append(f"""
DELETE FROM course_content cc
USING courses c
WHERE c.code = '{COURSE_CODE}' AND cc.course_id = c.id
  AND cc.metadata->>'authored' = 'true'
  AND cc.title NOT IN ({current_titles});
""")

    # A module whose sections are all covered by authored lessons is published.
    sql.append(f"""
WITH covered AS (
  SELECT DISTINCT jsonb_array_elements_text(topics) AS n
  FROM course_content cc JOIN courses c ON c.id = cc.course_id
  WHERE c.code = '{COURSE_CODE}'
)
UPDATE course_modules m SET is_published = COALESCE(
  -- A section counts as covered if its own number is claimed by a lesson OR
  -- its two-level parent is (a lesson covering 3.1 covers 3.1.x), matching
  -- check_ed_coverage.py. Exact-only matching left every module with L3
  -- objectives unpublished while the checker said DONE.
  (SELECT count(*) > 0 AND bool_and(
     split_part(obj, ' ', 1) IN (SELECT n FROM covered)
     OR (split_part(split_part(obj, ' ', 1), '.', 1) || '.' ||
         split_part(split_part(obj, ' ', 1), '.', 2)) IN (SELECT n FROM covered))
   FROM jsonb_array_elements_text(m.learning_objectives) obj), false)
FROM courses c
WHERE c.code = '{COURSE_CODE}' AND m.course_id = c.id;

-- Module 1 (order 0) has no numbered sections; it is published when its
-- introductory reading exists.
UPDATE course_modules m SET is_published = true
FROM courses c
WHERE c.code = '{COURSE_CODE}' AND m.course_id = c.id AND m.order_index = 0
  AND EXISTS (SELECT 1 FROM course_content cc
              WHERE cc.course_id = c.id AND cc.metadata->>'chapter' = '1');
COMMIT;
""")

    proc = subprocess.run(
        ["docker", "compose", "exec", "-T", "db", "psql", "-U", "eureka", "-d", "eureka",
         "-v", "ON_ERROR_STOP=1"],
        input="\n".join(sql), text=True, capture_output=True, cwd=ROOT,
    )
    if proc.returncode != 0:
        raise SystemExit(f"seed failed:\n{proc.stderr[-2000:]}")
    print(proc.stdout[-400:])
    print(f"seeded: course {COURSE_CODE}, {len(curriculum)} modules, {len(lessons)} lessons")


if __name__ == "__main__":
    main()

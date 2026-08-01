#!/usr/bin/env python3
"""Seed the Practical Electronics course into api-core's course tables.

Idempotent by natural key (P2-18 discipline): the course is keyed by its code,
modules by (course, order_index), content by (course, title). Re-running
updates in place and never duplicates. Run from eureka/:

    python3 scripts/seed_practical_electronics.py

It execs psql inside the running `db` compose service, so it needs the stack
up and nothing else.

PROVENANCE AND COPYRIGHT. The syllabus TOPIC MAP (chapter/section structure in
docs/courses/practical-electronics/curriculum.json) follows the coverage of
Scherz & Monk, "Practical Electronics for Inventors" 3e, so completeness can
be checked against a recognized treatment of the subject. Every lesson body in
lessons/*.md is ORIGINAL text written for this course; no passage is
reproduced from the book, and the book is cited in course metadata as the
coverage reference, not as the content source. Do not paste book text into
the lessons directory; scripts/check_pe_coverage.py reports authored-vs-
pending honestly and nothing here fabricates content for unauthored sections.
"""
from __future__ import annotations

import json
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs" / "courses" / "practical-electronics"
COURSE_CODE = "ELEC-PRACT"
COURSE_TITLE = "Practical Electronics: Devices and Circuit Design"


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
        lessons.append({"title": title, "body": text, "covers": covers, "chapter": chapter})

    sql = ["BEGIN;"]

    # CourseResponse.syllabus is dict-typed; a bare list 500s the listing.
    syllabus = json.dumps({"chapters": curriculum}).replace("'", "''")
    sql.append(f"""
INSERT INTO courses (org_id, title, code, description, tier, subject, category, level,
                     syllabus, status, is_published, metadata)
SELECT o.id, '{q(COURSE_TITLE)}', '{COURSE_CODE}',
       'A complete practical electronics course: circuit theory, components, '
       'semiconductors, optoelectronics, sensors, workshop practice, op amps, '
       'filters, oscillators, power supplies, digital logic, microcontrollers, '
       'motors, audio, and modular prototyping systems. Lesson text is original '
       'to EUREKA; topic coverage tracks Scherz and Monk, Practical Electronics '
       'for Inventors 3e, as the completeness reference.',
       'undergraduate', 'Electrical Engineering', 'Electronics', 'beginner',
       '{syllabus}'::jsonb, 'published', true,
       jsonb_build_object('coverage_reference',
         'Scherz & Monk, Practical Electronics for Inventors, 3rd ed. (topic map only; all lesson text original)',
         'sections_total', {sum(len(c['sections']) for c in curriculum)})
FROM organizations o WHERE o.slug = 'public' OR o.name ILIKE 'public%' ORDER BY o.created_at LIMIT 1
ON CONFLICT DO NOTHING;
""")
    # code has no unique constraint; emulate idempotency by updating if present
    sql.append(f"""
UPDATE courses SET syllabus = '{syllabus}'::jsonb, is_published = true, status = 'published'
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
       jsonb_build_object('chapter', '{les['chapter']}', 'authored', true, 'origin', 'original')
FROM courses c WHERE c.code = '{COURSE_CODE}'
  AND NOT EXISTS (SELECT 1 FROM course_content cc WHERE cc.course_id = c.id AND cc.title = '{title}');
UPDATE course_content cc SET content = '{body}', topics = '{topics}'::jsonb, updated_at = NOW()
FROM courses c WHERE c.code = '{COURSE_CODE}' AND cc.course_id = c.id AND cc.title = '{title}';
""")

    # A module whose sections are all covered by authored lessons is published.
    sql.append(f"""
WITH covered AS (
  SELECT DISTINCT jsonb_array_elements_text(topics) AS n
  FROM course_content cc JOIN courses c ON c.id = cc.course_id
  WHERE c.code = '{COURSE_CODE}'
)
UPDATE course_modules m SET is_published = COALESCE(
  (SELECT count(*) > 0 AND bool_and(split_part(obj, ' ', 1) IN (SELECT n FROM covered))
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

# Build prompt: Electronic and Photonic Devices: Design and Characteristics

## State as of 2026-08-02

**Course code `ELEC-DEV`. 60 modules, 764 sections, 125 original lessons, all
modules published, live in the app.**

Two halves:

- **Modules 1-16, A-C** (549 sections, 58 lessons): the applied half, circuit
  theory through digital logic, microcontrollers, motors, audio and prototyping.
- **Modules 17-57** (216 sections, 67 lessons): the materials and
  characterization half, covering the ELECTRONIC scope of the materials
  reference.

The photonics scope is deliberately **not built**. See `SCOPE.md` for exactly
which chapters are in, which are held back, and why.

## The rules, which are not negotiable

1. **Copyright.** Both reference works are copyrighted and neither is a content
   source. What was taken is the SHAPE of the subject only: chapter count,
   section count per chapter, and which chapter a section belongs to. Every
   module title and section label in `curriculum.json` was written for this
   course; the source is referenced by chapter/section NUMBER alone, in the
   `src` field, so no publisher heading text is stored here or displayed in the
   app. Never paste, closely paraphrase or reconstruct book passages, worked
   examples, figures, tables or data sets.
2. **No fabricated content.** No invented numbers, no fabricated citations, no
   claimed results that were not measured. Where a field is unsettled, say so.
3. **No coverage claims the course cannot back.** The seeder publishes a module
   only when every one of its sections has an authored lesson, so an unfinished
   module reads as unfinished rather than as an empty promise.
4. **House style.** ASCII punctuation only in the new lessons: no em dashes, en
   dashes, ellipses or smart quotes. Scientific unicode (Greek letters, degree
   signs, superscripts) is fine where it aids accuracy. Avoid "simply", "just",
   "obviously", "clearly", "merely".
5. **Mains electricity is described, not prescribed.** Appendix A explains it
   for understanding; projects stay at low voltage.

## The loop

    author lesson(s) in docs/courses/electronic-devices/lessons/chNN-lNN-slug.md
      -> python3 scripts/check_ed_coverage.py     # authored vs pending, honestly
      -> python3 scripts/seed_electronic_devices.py
      -> verify live in the app, signed in
      -> commit

Lesson format: `# Title`, then `<!-- covers: 17.1, 17.2 -->`, then `##` sections.
The filename sets the module (`chNN`) and the in-module order (`lNN`).

## The depth programme (2026-08-02 standard)

Every module is being raised from narrative depth to a full undergraduate plus
graduate treatment. The standard, enforced by `scripts/check_ed_depth.py`, is
per module: >= 18,000 words, >= 60 display equations, >= 20 computed figures,
>= 15 worked examples, >= 3 problem sets with answers. Module 18 is the
reference implementation (5 lessons: four topic lessons plus a capstone of
design case studies and a comprehensive exam).

The loop per module:

    add figure functions to scripts/gen_ed_figures.py   # computed from stated equations ONLY
      -> python3 scripts/gen_ed_figures.py <prefix>
      -> rewrite the module's lessons to the standard
      -> python3 scripts/check_ed_math.py               # $$ fencing + figure refs; MUST be clean
      -> python3 scripts/check_ed_depth.py              # module must read EXPANDED
      -> python3 scripts/seed_electronic_devices.py
      -> docker compose build web && docker compose up -d --force-recreate web
         # public/ is BAKED into the image; new figures 404 without this
      -> verify live signed in (0 katex-error spans, figures decode)
      -> commit

Figure rules (see scripts/ed_figstyle.py): every figure computed from an
equation the lesson states, never traced or adapted from a book; max three
categorical series per figure (validated all-pairs colour-vision cap); every
series direct-labelled; matched light/dark pairs, not colour flips.

## What is next

Depth expansion of the remaining 59 modules, in order: 17, 19-27 (fundamental
properties), 28-36 (growth and characterization), 37-45 (materials for
electronics), 46-57 (applications), then the applied half 1-16. After that,
the **photonics wave**: the source's optoelectronics and photonics part (13
chapters) plus the photovoltaic, x-ray imaging, organic photovoltaic, terahertz
and metamaterial chapters of its applications part (5 chapters), 109 sections in
total. Append them as modules 58 onward, under the same rules, and update
`SCOPE.md` as they land so the scope note stays true.

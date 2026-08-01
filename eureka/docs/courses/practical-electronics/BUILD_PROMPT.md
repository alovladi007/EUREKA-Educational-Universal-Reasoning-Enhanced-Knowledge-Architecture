# Practical Electronics — Course Build Prompt (continuation sessions)

Course `ELEC-PRACT` ("Practical Electronics: Devices and Circuit Design")
lives in api-core (`courses` / `course_modules` / `course_content`) and is
live in the catalog. This doc is the standing prompt for authoring the
remaining lessons. Paste it (or point the agent at it) to continue.

## State as of 2026-08-01

- Full topic map seeded: 19 modules, 549 sections, parsed from the coverage
  reference and committed as `curriculum.json`. Machine-checked; zero
  untitled sections.
- Authored and live: Module 1 complete; Module 2 sections 2.1-2.20 (4
  lessons). Coverage: 49/549 sections. Run
  `python3 scripts/check_pe_coverage.py` for the current table.
- Modules auto-publish only when every section is covered by an authored
  lesson (`scripts/seed_practical_electronics.py` computes this). Unauthored
  modules stay visible but unpublished. Never publish a topic map as if it
  were content.

## The rules (binding)

1. **Copyright.** The coverage reference is Scherz & Monk, *Practical
   Electronics for Inventors* 3e. Its chapter/section STRUCTURE defines
   completeness; its TEXT is off limits. Every lesson is written original.
   Never paste, closely paraphrase, or reconstruct book passages, examples,
   or figures. The subject matter (Ohm's law, op-amp circuits, 555 timers) is
   standard engineering knowledge; teach it in your own words.
2. **Honesty.** No fabricated specs or invented "typical values" — use real
   physical constants and widely published component characteristics, and say
   "varies by part; check the datasheet" where it does. Unauthored = pending,
   visibly.
3. **Safety.** Mains wiring (Appendix A) is described for understanding, not
   as a how-to; keep project guidance at low voltage. No instructions that
   require opening mains equipment.
4. **Format.** One markdown file per lesson in `lessons/`, named
   `chNN-lNN-slug.md`, first line `# Title`, second line
   `<!-- covers: 2.21, 2.22, ... -->` listing every section number the lesson
   covers (L2 numbers cover their L3 children; list L3 only when a child is
   split across lessons). 600-1000 words, plain markdown, ASCII.
5. **After authoring:** run `python3 scripts/check_pe_coverage.py`, then
   `python3 scripts/seed_practical_electronics.py` (idempotent), then spot-
   check `GET /api/v1/courses/?search=Practical` returns 200. Commit lessons +
   this doc's state line together.

## Authoring order (grouped into sessions of roughly one module)

1. Module 2 remainder: 2.21-2.24 (capacitors, inductors), 2.25-2.33 (AC
   analysis: complex impedance, power, resonance, decibels, filters intro),
   2.34-2.37 (nonlinear elements, waveforms, nonperiodic sources). ~8 lessons.
2. Module 3 (components: wires/connectors, batteries, switches, relays,
   resistors, capacitors, inductors, transformers, fuses). ~7 lessons.
3. Module 4 (semiconductors: junction physics, diodes, BJTs, FETs,
   thyristors, ICs). ~6 lessons.
4. Modules 5-6 (optoelectronics; sensors — the sensors chapter is broad:
   temperature, proximity, light, acoustic, motion, chemical...). ~8 lessons.
5. Module 7 (hands-on: instruments, prototyping, soldering, debugging,
   multimeters, scopes). ~6 lessons.
6. Modules 8-11 (op-amps; filters; oscillators/timers; regulators and
   supplies). ~12 lessons.
7. Module 12 (digital: number systems, gates, combinational, sequential,
   memory, interfaces). ~8 lessons.
8. Modules 13-16 (microcontrollers, motors, audio, modular electronics). ~10
   lessons.
9. Appendices A-C (mains distribution described-not-prescribed, error
   analysis, reference formulas). ~3 lessons.

Estimated total: ~60 further lessons. Each session: author, check coverage,
seed, verify, update the "State as of" line above, commit.

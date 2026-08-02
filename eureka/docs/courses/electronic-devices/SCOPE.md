# Scope and provenance

Course: **Electronic and Photonic Devices: Design and Characteristics** (`ELEC-DEV`)

This file records two things that are easy to get wrong later: what the course
covers right now, and where its structure came from.

## Two halves

**Modules 1-16, A-C (58 lessons, 549 sections)** are the applied half. Circuit
theory through digital logic, microcontrollers, motors, audio and prototyping,
plus appendices on power distribution, error analysis and reference formulas.

**Modules 17-57 (216 sections)** are the materials and characterization half.
They sit underneath the components: why a conductor conducts, what a defect
costs, how a crystal is grown, how a film is measured, and which materials
carry memory, magnetism, superconduction and heat. This is the half that
answers "why does this device have these characteristics", which the applied
half can only assert.

## Electronic scope only, for now

The materials reference is organized into five parts. Its part D is
"Materials for Optoelectronics and Photonics", and several chapters of its
part E are optoelectronic as well. **None of that is in this course yet.**

Included (modules 17-57):

| Source part | Subject | Modules |
| --- | --- | --- |
| framing chapter | how the field arrived at silicon | 17 |
| A, Fundamental Properties | conduction, optical constants, magnetism, defects, diffusion, photoconductivity, interfaces, disorder, dielectrics, ionics | 18-27 |
| B, Growth and Characterization | bulk and epitaxial growth, structural, surface, thermal and electrical characterization | 28-36 |
| C, Materials for Electronics | silicon, SiGe, III-V alloys, amorphous semiconductors, ferroelectrics, dielectrics, thin and thick films | 37-45 |
| E, electronic chapters only | flexible electronics, phase-change memory, nanotubes, graphene, magnetic storage, superconductors, molecular electronics, chemical sensing, packaging, thermoelectrics, transparent conductors, perovskite oxides | 46-57 |

Deferred to a later photonics wave (18 chapters, 109 sections): the whole
optoelectronics and photonics part, plus the photovoltaic, x-ray imaging,
organic photovoltaic, terahertz and metamaterial chapters. They are
deliberately **not** listed in `curriculum.json`, so the syllabus never
advertises coverage the course does not have.

The course title says "and Photonic" because that is where it is going. The
scope note in the course metadata says plainly which half is built, so the
title is a destination and the metadata is the honest current state.

Two chapters that look photonic but are in scope: optical constants and
optical characterization (module 19) and photoconductivity (module 23). Both
are in the source's fundamental-properties part, and both are here as
*measurement techniques for electronic materials* - how you get a band gap, a
mobility, a defect density - not as photonics.

## Provenance and copyright

Both reference works are copyrighted. Neither is a content source.

- Modules 1-16, A-C track the coverage of Scherz & Monk, *Practical
  Electronics for Inventors*, 3rd ed.
- Modules 17-57 track the electronic chapters of Kasap & Capper (eds.),
  *Springer Handbook of Electronic and Photonic Materials*, 2nd ed.

What was taken from the materials reference is only the **shape of the
subject**: how many chapters there are, how many sections each chapter has,
and which chapter a section belongs to. Nothing else.

Every module title and every section label in `curriculum.json` for modules
17-57 was written for this course. The source is referenced by chapter and
section **number** alone, in the `src` field, so no publisher heading text is
stored in this repository or rendered in the app. Every lesson body in
`lessons/` is original text. No passage, worked example, figure, table or data
set is reproduced or closely paraphrased from either book.

If you extend this course: do not paste book text into `lessons/`, do not
copy figures, and do not turn a section label back into the source's wording.
`scripts/check_ed_coverage.py` reports authored-versus-pending honestly, and
the seeder publishes a module only when every one of its sections has an
authored lesson - so an unfinished module shows as unfinished rather than as
an empty promise.

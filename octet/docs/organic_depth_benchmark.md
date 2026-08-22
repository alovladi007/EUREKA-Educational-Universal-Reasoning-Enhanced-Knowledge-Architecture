# Organic depth benchmark — OCTET vs a standard two-semester textbook

Benchmark source: Loudon & Parise, *Organic Chemistry* (28 chapters, ~250
numbered sections). Used the way the FE EE study guide and the Lehninger
benchmark were used: **as a scope checklist only**. Topic names below identify
what a standard full-depth course covers; every sentence OCTET ships is
authored originally for OCTET. No prose, examples, problems, or figures are
taken from the book.

Audit date: 2026-08-20. Measured against the live octet-api container.

## Where OCTET stands

| layer | state |
|---|---|
| Node coverage (six-part arc lessons) | **159/159 ORG nodes authored** — median 610 words, total ~91k words |
| Chapter structure | ORG1 9 chapters + ORG2 17 chapters, already organized on a Loudon-shaped chapter list (org_rechapter_map.py, audited) |
| Lecture-note depth (LessonExtras) | **ORG1 chapters 1–8** — 49 nodes, 42 of them at the raised 4,000-word floor. GEN1 has 20 more. ORG1 ch 9 and all of ORG2 still render the short arc alone |
| Depth-gate totals (2026-08-22) | 69 node-chapters, 873 sections, 204,329 words, 91 figures, 73 tables |
| Depth-gate totals (2026-08-20 audit) | 27 node-chapters, 120 sections, 35,487 words, 6 figures, 30 tables |

The pedagogy layer is complete; the *textbook layer* exists for one organic
chapter out of 26. That is the gap this programme closes.

## Chapter-level scope verdict

OCTET's 26 organic chapters map cleanly onto benchmark chapters 1–24 and
26–27. Two benchmark chapters have **no OCTET home**:

1. **Thioesters, phosphate esters and phosphate anhydrides** (benchmark ch 25)
   — the bridge into biochemistry (why nature acylates with thioesters and
   phosphorylates with anhydrides; ATP as an acyl/phosphoryl donor). OCTET
   teaches thiols (ORG2 ch 1) and carboxylic acid derivatives (ch 11) but
   never the biological acyl-transfer chemistry. **Action: new chapter with
   ~3 new nodes**, slotted after ch 14 (Carbohydrates).
2. **Pericyclic reactions** (benchmark ch 28) — OCTET has Diels–Alder only
   (ch 6). Electrocyclic reactions, sigmatropic shifts, cycloaddition
   selection rules, and the frontier-orbital analysis behind them are absent.
   **Action: new capstone chapter with ~3 new nodes** before or beside ch 17.

Both need: nodes + arc lessons + rechapter-map entries + audit pass + items.
They are the *last* tranches — depth on existing chapters comes first.

## Section-level scope gaps inside existing chapters

Recorded as topics a full-depth chapter covers that OCTET's current nodes
mention thinly or not at all (from comparing the benchmark's section lists
against node lessons):

- **Ch 2 Alkanes**: physical-property trends with data (bp/mp vs chain
  length/branching), combustion thermochemistry, functional-group/R-notation
  survey, isomer counts vs carbon number.
- **Ch 3 Acids & Bases**: electron-pair displacement vs association arrows,
  leaving groups, free energy ↔ equilibrium arithmetic, the
  element/charge/polar-effect decomposition of acidity.
- **Ch 4–5 Alkenes**: heats of formation as the stability evidence, degrees
  of unsaturation, Hammond postulate as its own treatment.
- **Ch 6 Stereochemistry**: conformational vs configurational
  stereoisomerism, optical rotation arithmetic, racemates vs meso in crystals.
- **Ch 9 Alkyl halides**: full solvent treatment (protic/aprotic, dielectric),
  kinetic-order evidence for SN1/SN2/E1/E2.
- **Spectroscopy chapters**: chemical-shift and coupling *data tables*,
  fragmentation patterns, DEPT/2-D survey.
- **Carbonyl chapters**: full addition-equilibrium data (hydrate Keq),
  mechanism of every named step under acid vs base catalysis.

(The list is a working queue, not exhaustive; each tranche re-derives its
chapter's checklist from the outline before authoring.)

## The depth standard (per node-chapter)

Matches and slightly raises the ORG1 ch1 reference: **lead + ≥4 numbered
sections, ≥1,200 words of prose** (gate counts lead + section bodies only),
**tables carry real, sourced values**, figures generated from the stated
numbers in both themes, takeaways + exam tips present. All structural
assertions go through the claims checker; no invented data, ever.

## Tranche order

| tranche | chapters | nodes | state |
|---|---|---|---|
| 1 | ORG1 ch 2 Alkanes + ch 3 Acids & Bases | 7 | **DONE** |
| 2 | ORG1 ch 4 + ch 5 (alkenes) | 18 | **DONE** |
| 3 | ORG1 ch 6 + ch 7 (stereochemistry, rings) | 11 | **DONE** |
| 4a | ORG1 ch 8 Noncovalent Intermolecular Interactions | 6 | **DONE** — 24,111 words, 12 figures |
| 4b | ORG1 ch 9 Alkyl Halides | 12 | next |
| 5–8 | ORG2 ch 1–9 (alcohols → aryl halides) | ~47 | |
| 9–12 | ORG2 ch 10–17 (carbonyls → capstone) | ~52 | |
| 13 | NEW: thioesters & phosphates chapter | ~3 new | |
| 14 | NEW: pericyclic reactions chapter | ~3 new | |

Progress is measured by `scripts/check_octet_depth.py` totals only, and the
gate must stay green at every commit. Reminder from the FE EE programme: the
gate checks integrity, not truth — every tranche also gets a live render
check in the reader before it counts as done.

## Two gates beyond the depth gate

The depth gate counts and checks structure. It cannot see two failure modes
that reached learners on other courses, so each tranche also runs:

1. **Label collisions in figures.** `eureka/scripts/check_figure_overlaps.py`
   is generator-agnostic: it re-renders each figure and measures every text
   artist's bounding box. It can drive an OCTET generator provided that
   generator exposes `REGISTRY` (stem → function returning a `Figure`) and
   `S` (the figstyle module). `gen_org1_ch8_figures.py` is written that way
   and is the model for the rest; the older generators (`gen_org_plots.py`,
   `gen_org1_ch*_figures.py`) expose a plain `ALL` list of save-and-close
   functions and cannot be targeted without that shim. Run:

       PYTHONPATH=octet/scripts python3 \
           eureka/scripts/check_figure_overlaps.py gen_org1_ch8_figures

   It caught three real collisions in the ch8 pass that the depth gate
   passed cleanly.

2. **Maths the reader cannot draw.** The depth gate checks that `$` pairs up;
   it does not check that KaTeX can parse what is between them. `LessonProse`
   is a hand-written scanner rather than remark-math, so the FE EE lesson
   applies directly: never re-implement its delimiter rules in a checker —
   transpile the real component, call its exported `splitMath`, and run the
   real KaTeX (with `katex/dist/contrib/mhchem.js` loaded, or every `\ce{}`
   in GEN1 reports as a false failure). The whole authored corpus currently
   renders 1,720 maths runs clean under `strict: 'error'`.

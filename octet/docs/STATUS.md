# OCTET status

Honest phase by phase register. A line says done only when it is verified, and
what is not built says so plainly.

Last updated: 2026-07-24 (Phase 2 complete).

## Phase 0: foundation. Gate: contract confirmed. Status: DONE with 3 open items

| Item | Status |
|---|---|
| EUREKA integration contract | PARTIAL. Inherited contract confirmed and implemented, 3 additions open. See EUREKA_OCTET_Integration_Contract.md. None block Phases 1 to 3. |
| Repo stood up | DONE. apps/api, packages/chem_core, docs, compose on port band 4200/8500/5442/6393. |
| AXIOM engine modules ported | DONE as of Phase 2. App factory, settings, async DB session and the EUREKA SSO bridge in Phase 0; BKT, SM-2, the adaptive picker with path planning, the diagnostic and the missed questions review layer in Phase 2. |
| RDKit and pint pinned | DONE. requirements.txt pins rdkit 2024.3.5, sympy 1.13.3, pint 0.24.4, periodictable 1.7.1. |
| Grading worker sandboxed | DONE. Two layers: SIGALRM plus input caps in the child, process pool with parent timeout and kill and rebuild in app/domains/grading/sandbox.py. |

## Phase 1: graders. Gate: graders verified. Status: DONE

| Grader | Grading path | Independent verifier | Status |
|---|---|---|---|
| 1 formula | element multiset parse | RDKit CalcMolFormula from SMILES | DONE |
| 2 balance | conservation and minimality check | conservation arithmetic, no SymPy | DONE |
| 3 stoichiometry | exact rational chain, Fraction mole ratio | pint alternate unit route, reassociated | DONE |
| 6 multiple choice | misconception keyed | structural validation of every distractor | DONE |
| 7 equilibrium | SymPy polynomial solve | residual substitution plus physical root check | DONE |

Evidence:

- 12 seed sweep across all 7 templates: 84 of 84 keys independently verified.
- 117 tests pass, including 80 adversarial payload cases across 5 graders.
- p95 latency: formula 0.02 ms, balance 0.59 ms, stoich 0.02 ms, equilibrium
  20.07 ms. Budget is 500 ms for numeric graders.
- Hint ladder coverage: 7 of 7 templates carry 3 rungs. CI gates on this.
- End to end through the running API: serve, hint (rung 3 refused while only
  rung 1 is unlocked), wrong answer, milestone diagnosis, correct answer.

Deliberately NOT built in this phase, and not stubbed:
graders 4 structure, 5 Lewis, 8 mechanism, 9 lab data, 10 spectra elucidation,
11 retro step, 12 prediction. `chem_core.grade` raises KeyError for all of
them rather than silently passing a learner. That is asserted by a test.

## Phase 2: gen chem wave. Gate: compliance checklist green. Status: DONE

| Deliverable | Specified | Delivered |
|---|---|---|
| CF nodes | 12 | 12 |
| G1 nodes | 24 | 24 |
| G2 nodes | 24 | 24 |
| Templates with hint ladders | 20 or more | 21 |
| Lessons in the six part arc | 60 | 60 |
| Molecule library v1 | 200 with real world notes | 200 |
| Diagnostics | yes | placement diagnostic, one item per covered node |
| Review layer | reuse missed_questions | ported, upsert on (user, template, seed), retry re-serves the exact variant |
| Adaptive engine | ported from AXIOM | BKT, SM-2, picker (requested, remediation, frontier, review), path planner |

Evidence:

- Compliance checklist GREEN, zero blocking problems, exposed live at
  GET /api/v1/compliance so the check cannot be quietly skipped.
- 12 seed sweep across all 21 templates: 252 of 252 keys independently
  verified, with the curated 200 molecule library installed as the pool.
- 143 tests pass (117 chem_core, 26 API and content).
- Curriculum graph is acyclic, 60 nodes, 86 edges, no dangling references,
  every misconception routes to a real node.
- Every molecule formula is derived by RDKit from its structure, so no hand
  typed formula exists to disagree with the structure.
- Lessons are 100 percent ASCII, so the house style rule on dashes and quotes
  holds across all 60.
- Live end to end: curriculum, lesson, path, diagnostic, compliance and the
  full serve, hint gate, submit loop on a Phase 2 template.

A new grader arrived in this phase: numeric with units (build prompt Section 4
lists it in the chem-grader service). It ships with the same discipline as the
others, an independent verifier per template that inverts the relationship
rather than repeating the generator arithmetic.

Bugs these gates caught before they could ship:
1. Silver nitrate SMILES gave nitrogen five bonds. RDKit rejected it.
2. Galactose, maltose and xylose were listed with structures identical to
   glucose, lactose and ribose, because stereochemistry is not written yet.
   InChIKey collision detection caught all three.
3. The molecule pool wiring silently produced zero entries (field name
   mismatch). The refuse-empty-pool guard caught it.
4. Keys formatted with %g dropped trailing zeros, so an item asking for 3
   significant figures stored a key showing 2. A test that submits each
   template's own key caught it.
5. A sig fig item generated 100 as an answer to 2 significant figures, which
   has no unambiguous plain form. Its verifier caught it.

## Phase 3 and later: NOT STARTED

Phase 3
visualization (MolViewer, Sketcher, periodic table, simulators, first
triangle views), Phase 4 LTI and exam engine, Phase 5 organic wave 1, Phase 6
organic wave 2 with the retrosynthesis trainer, Phase 7 AN/P1/P2 tiers and the
guardrailed tutor.

## Known gaps and honest caveats

1. The misconception library (19 entries) carries literature citations but
   every entry reads review="pending". No entry may be presented as expert
   verified until a named SME signs it off. `unreviewed()` reports this and the
   API surfaces it as `awaiting_sme_review`.
2. `packages/chem_core/src/chem_core/_fixtures.py` is a grader fixture set, not
   the content library. Phase 2 replaces it with the curated 200 entry molecule
   library. Ka values there are standard textbook values and are also pending
   review.
3. No database migrations yet. The Section 6 chemistry models exist and the
   Phase 2 content is authored as Python data modules, so nothing needs a
   database to run. Persistence (mastery, attempts, missed questions across
   sessions) lands in Phase 3 with Alembic revisions. Today mastery is not
   persisted and the path planner says so in its response.
4. No frontend, and no EUREKA sidebar entry. The web app is Phase 3, and a
   nav entry pointing at a page that does not exist would be a dead link.
5. 18 triangle eligible G1 and G2 nodes need a triangle_view before the
   course can list. The compliance checker reports these as Phase 3 warnings
   rather than Phase 2 failures.
5. The tutor gateway does not exist. It is Phase 7 and gated on a red team
   suite.

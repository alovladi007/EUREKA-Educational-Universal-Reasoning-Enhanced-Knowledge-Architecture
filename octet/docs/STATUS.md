# OCTET status

Honest phase by phase register. A line says done only when it is verified, and
what is not built says so plainly.

Last updated: 2026-07-24.

## Phase 0: foundation. Gate: contract confirmed. Status: DONE with 3 open items

| Item | Status |
|---|---|
| EUREKA integration contract | PARTIAL. Inherited contract confirmed and implemented, 3 additions open. See EUREKA_OCTET_Integration_Contract.md. None block Phases 1 to 3. |
| Repo stood up | DONE. apps/api, packages/chem_core, docs, compose on port band 4200/8500/5442/6393. |
| AXIOM engine modules ported | PARTIAL. App factory, settings, async DB session and the EUREKA SSO bridge are ported and running. BKT, SM-2, the adaptive picker and the missed questions layer are NOT yet ported, they land with Phase 2 when there is content to adapt over. |
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

## Phase 2 and later: NOT STARTED

Phase 2 gen chem content (CF 12 nodes, G1 24, G2 24, 20+ templates, 60
lessons, 200 molecule library, diagnostics, review layer), Phase 3
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
3. No database migrations have been written yet. The Section 6 chemistry models
   exist (molecules, reactions, mechanisms, spectra, sim_states,
   exam_blueprints, triangle_views) but Alembic revisions land with Phase 2,
   when there is data to store.
4. No frontend. The web app is Phase 3.
5. The tutor gateway does not exist. It is Phase 7 and gated on a red team
   suite.

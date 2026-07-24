# OCTET status

Honest phase by phase register. A line says done only when it is verified, and
what is not built says so plainly.

Last updated: 2026-07-24 (Phase 3 complete).

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

## Phase 3: visualization. Gate: visualization live. Status: DONE

| Deliverable | Specified | Delivered |
|---|---|---|
| MolViewer | yes | 3Dmol loaded dynamically, states plainly that the library stores connectivity and not coordinates |
| Sketcher wired to grader 4 | yes | Ketcher with a text SMILES fallback, posting to POST /structure/submit |
| Periodic table explorer | yes | 118 elements, 5 trend layers, per layer coverage reported |
| KaTeX and mhchem | yes | rendered in the triangle views, 16 of 18 carry \ce notation |
| Titration simulator | yes | exact charge balance solve, one code path from initial point to excess base |
| Equilibrium simulator | yes | extent of reaction solved numerically, direction derived not asserted |
| Predict, observe, explain (item type 12) | yes | 4 activities, ordering enforced server side |
| First triangle_views for G1 and G2 | 18 | 18 |

Two graders landed with the surface they feed, rather than ahead of it:

| Grader | Grading path | Independent verifier | Status |
|---|---|---|---|
| 4 structure | RDKit canonical SMILES equality | InChIKey agreement, a separately developed canonicalization | DONE |
| 12 prediction | misconception keyed option match | the simulation engine is run and the derived outcome is compared to the stored key | DONE |

Evidence:

- Compliance checklist GREEN, zero blocking problems, with three new blocking
  checks added this phase: triangle_view completeness, poe_verified, and
  simulation_verified. The triangle check was a Phase 2 warning and is now a
  failure, because the views exist.
- 192 tests pass (118 chem_core, 74 API and content).
- 12 seed sweep across all 22 templates: 264 of 264 keys independently
  verified.
- Titration engine checked against landmarks derived separately from the
  solver: 0.100 M strong acid gives pH 1.00, strong against strong equivalence
  gives 7.00, acetic acid half equivalence gives 4.757 which is its pKa, and
  its equivalence gives 8.73.
- Equilibrium engine: Q returns to K after every stress tested, and the
  direction agrees with the sign of Q minus K computed from different
  quantities than the solver used.
- Live end to end against the running API: the start step returns no
  simulation data, observing before predicting is refused with 409, a wrong
  prediction names EQUIV-IS-NEUTRAL, revising a prediction after seeing the
  result is refused, a forged ticket is rejected on signature, the observe step
  returns graded false, and grader 4 accepts a correct structure, diagnoses a
  wrong formula, and reports an impossible valence as ungradable rather than
  wrong.

Design decisions worth recording:

1. Predict, observe, explain state travels in an HMAC signed ticket rather
   than in process memory. In memory state works on one worker and breaks on
   two, and loses every in flight attempt on restart. The ticket binds the user
   id and carries an issue time, so it cannot be replayed by another learner or
   forged to claim a prediction that was never made.
2. The graded prediction is a selection, and written reasoning is recorded
   without a score. This platform has no reviewed rubric for grading free text
   chemistry explanation, so scoring the prose would mean inventing a
   judgement. The API says so in its own response.
3. Stereochemistry strictness is per item, not global. General chemistry items
   set it loose, because failing a learner on a convention nobody has taught
   them is not assessment. The organic phases set it strict on their own items.
4. Periodic trend gaps are reported rather than filled. Helium has no Pauling
   electronegativity because it forms no bonds to define one, and 25 elements
   are in that position. Coverage is returned with every trend layer so a
   sparse layer cannot render as a complete one.

Bugs these gates caught before they could ship:

1. The equilibrium extent solver returned zero whenever a species started at
   exactly zero concentration, because the out of range sentinel was chosen by
   the sign of x rather than by which species ran out, which made the residual
   non monotone. Every Le Chatelier activity would have reported no shift. The
   verifier that compares an item key against its own simulation caught it on
   the first run.
2. A test asserted the buffer region is flatter than the strong acid curve over
   the same volumes. That is false: over 5 to 20 mL the strong acid moves 0.78
   units and the weak acid moves 1.20, because the strong acid still has plenty
   of unreacted hydronium that far from equivalence. The engine was right and
   the test was wrong. It now compares the buffer region against the same
   curve's equivalence jump, which is what buffering actually claims.
3. MolViewer set its "no 3D coordinates" status inside an effect, which never
   runs during server rendering, so the panel rendered blank on first paint.
   That was the exact silent blank the component exists to prevent.

## Phase 4 and later: NOT STARTED

Phase 4 LTI and exam engine, Phase 5 organic wave 1, Phase 6 organic wave 2
with the retrosynthesis trainer, Phase 7 AN/P1/P2 tiers and the guardrailed
tutor.

## Known gaps and honest caveats

1. The misconception library (26 entries, 7 added in Phase 3) carries
   literature citations but every entry reads review="pending". No entry may be
   presented as expert verified until a named SME signs it off. `unreviewed()`
   reports this and the API surfaces it as `awaiting_sme_review`.
2. The periodic table and the triangle views also read REVIEW = "pending" for
   the same reason. Radii follow Slater (1964) throughout, which is why that
   column is sparse: Slater published no radius for any noble gas, for astatine
   or francium, or past americium. Splicing in Clementi's calculated radii
   would fill the gaps with a different quantity and produce a smooth surface
   no single body of measurement supports.
3. Lawrencium and nobelium ionization energies are recorded as unmeasured even
   though values were published in 2015 and 2018, because those postdate the
   cited CRC 97th edition. Each carries a note so review can add them with a
   proper citation.
4. `packages/chem_core/src/chem_core/_fixtures.py` is a grader fixture set, not
   the content library. The curated 200 entry library is installed over it at
   startup.
5. No database migrations yet. Mastery is still not persisted across sessions
   and the path planner says so in its response. Predict, observe, explain
   attempts are not persisted either: the ticket carries an attempt safely
   through one sitting, and a learner's history of attempts is not stored.
   Persistence is genuinely outstanding rather than partially done.
6. Molecules have no 3D coordinates. The library stores SMILES, which records
   connectivity and not geometry, so `has_3d` is false for all 200 and the
   viewer states that the layout it draws is illustrative rather than measured.
7. Structure items cover drawing a named molecule and nothing more. Isomer,
   functional group and stereochemistry items are the organic phases, and
   building them now would put content ahead of the pedagogy that supports it.
8. The tutor gateway does not exist. It is Phase 7 and gated on a red team
   suite.

# OCTET status

Honest phase by phase register. A line says done only when it is verified, and
what is not built says so plainly.

Last updated: 2026-08-10 (Phase 7: graders 8 and 9, the study planner; register note below on the sessions between).

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
| Sketcher wired to grader 4 | yes | Ketcher rendered live on the practice page for structure items, posting to POST /structure/submit, with a text SMILES fallback if it fails to load |
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
- 194 tests pass (118 chem_core, 76 API and content).
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
4. The Sketcher was built and the structure endpoint was built, but nothing
   rendered the Sketcher, so grader 4 had no drawing surface in the product.
   The status table said otherwise. Found by opening the page and looking for
   it rather than by trusting the entry.
5. ketcher-react and ketcher-standalone both declare ketcher-core as "*", and
   npm resolved that wildcard to 3.12.0 against packages written for the 3.17
   API. The editor failed to load on every page and fell back to a text field.
   Pinning ketcher-core to 3.17.1 took the build from dozens of "not exported
   from ketcher-core" warnings to zero.
6. /structure/submit returned its own dict without milestones while
   /practice/submit returned a GradeOut that had them. One result component
   renders both, so it called .find() on an absent field and white screened the
   page on submit. The TypeScript type declared the field present, which is
   precisely why the compiler could not catch it: the type was a claim about
   the server the server did not honour. Both endpoints now share GradeOut, so
   the divergence is impossible rather than merely tested for.

## Curriculum replacement (after Phase 3)

The three tier CF / G1 / G2 map was wrong and has been replaced. It presented
one year of general chemistry as three courses, which no registrar, syllabus
or textbook does, so an instructor could not map a course onto it and a
learner could not tell where they were. It also covered roughly a third of a
year.

| | Before | After |
|---|---|---|
| Structure | 3 tiers, flat list of 60 | 4 courses, 40 units, 312 nodes |
| Naming | C.G1.MOLE | GEN1.MOLE, shown to learners as "3.1" |
| Edges | 86, hand listed | 385, generated from unit order and declared links |
| Coverage | 60 of 60 nodes authored | 59 of 312 authored, stated on every row |

GEN1 91 nodes, GEN2 75, ORG1 70, ORG2 76. Every unit carries its textbook
chapter mapping, which is what makes syllabus alignment possible during an
adoption conversation.

Several topics moved course because the old placement was wrong rather than
merely different: VSEPR, molecular polarity, intermolecular forces and
colligative properties are first semester material and had been in the second.

What changed in the gates:

- The lesson rule was "every node has a lesson". At 312 nodes and 59 lessons
  that would fail by design for two years, and a checklist that always fails
  is a checklist nobody reads. It now gates on quality (a lesson that exists
  is complete, sits on a real node, names a real misconception) and reports
  extent separately. A lesson attached to a node that does not exist is still
  a failure, because that is content detached from the graph.
- The triangle rule changed the same way and for the same reason.
- New blocking checks: unit integrity (no empty unit, every unit has a chapter
  mapping) and course integrity.
- New tests: every migration target resolves, no two lessons collapse onto one
  node, no retired code survives anywhere, all authored content points at a
  real node, and the vendored curriculum.json still matches its generator.

The map is deliberately larger than the content. Unauthored nodes render with
a "Not yet available" chip and are not enterable, the adaptive picker will not
recommend one, and compliance states the coverage. Presenting 312 nodes as
though they were all ready would have been the dishonest way to ship this.

The Learn page was rebuilt to match. It had rendered 60 nodes as one flat
list with prerequisites as prose naming raw node ids, and authoring metadata
("triangle", "lab adjacent") leaked into the learner view as tags. It is now
course, unit, node with collapsible units, positional numbering, a state chip
carrying text on every row, and no node id visible anywhere. Accessibility is
treated as a requirement rather than polish: h1/h2/h3 structure, every
collapse control a real button with aria-expanded, state never by colour
alone, and node rows as a list.

Verified live: 1 h1, 4 h2, 40 h3, 44 aria-expanded controls, 312 list items,
no raw node code rendered as text, no "Builds on:" prose, no leaked authoring
tags, and no fabricated percentage. 213 tests pass, compliance green with 0
blocking.

Two honest gaps in that page. There is no mastery endpoint, so four of the six
state chips are unreachable and the summary reports counts rather than a
percentage. And the continue button is rendered disabled with the reason
stated, because the adaptive picker is not wired to this surface yet.

Bugs this work caught:

1. The picker recommended the first ready node, which after the map grew could
   be a node with no lesson behind it. It now requires the recommendation to
   be authored, while the plan still lists every node, because the plan is the
   route and the route includes what has not been written.
2. The test that forbids typographic dashes and smart quotes held the seven
   banned characters literally, so the file policing the rule violated it.
3. The combined gas law template (P1V1/T1 = P2V2/T2) landed on the ideal gas
   node. It is a simple gas law, and the finer map has a node for exactly
   that.

## Phase 4: LTI and the exam engine. Gate: LTI + exam engine. Status: DONE

| Deliverable | Status |
|---|---|
| LTI termination decided | DONE. Each vertical terminates its own. Recorded in the contract with the reasoning and the costs, because it went against the recommendation there. |
| Alembic | DONE. OCTET's first migrations. 0001 chemistry, 0002 LTI, 0003 exams. Applies from empty on Postgres and `alembic check` reports no drift. |
| LTI 1.3 tool provider | DONE. OIDC initiation, launch verification, AGS grade passback, mirroring AXIOM rather than inventing a second shape. |
| Exam blueprints and assembly | DONE |
| Exam attempt state machine | DONE |
| Exam API | DONE |
| Exam taking UI | DONE |

The exam engine is the substance of the phase, and what it refuses to do is
the design.

Blueprints are generated from the template registry, so the catalogue cannot
list an exam the bank cannot build: a unit with no generated items produces no
blueprint rather than a broken one. Ten unit exams exist today because ten
units carry items. No blueprint claims alignment with ACS, AP, MCAT or any
other examination, and a test enforces that. Those bodies publish real content
outlines; reproducing one from memory would be inventing a specification and
attaching an authoritative name to it.

Assembly refuses rather than substitutes. An item may only come from a node
the blueprint asked for, and when the bank cannot supply a section, assembly
fails. An exam padded from a neighbouring node measures something the score
does not describe. Every item is an issued variant whose key was independently
verified at assembly time. Forms are deterministic per learner, so a reload is
not a reroll, and two learners get different variants of the same templates.

Scoring reports raw counts per section and per node plus a misconception
tally, and deliberately no scaled score, no predicted grade and no pass mark.
Scaling raw points onto a band is a psychometric claim needing item parameters
estimated from real response data, and nothing in this bank has been
calibrated. A test asserts those fields do not exist on the result, because
this is the kind of number someone adds later thinking it was an oversight.
Ungradable answers are counted separately from wrong ones and excluded from
the percentage, since an unreadable answer is not evidence of a wrong belief.

Four rules separate an exam from practice, and all four are enforced in the
service rather than left to the client: no hints, no feedback until
submission, server authoritative timing, and a paper that does not change. The
form is snapshotted at start, so deploying a template change mid exam cannot
alter the paper under a learner who has already answered half of it. The
result column is null while an attempt is open, which makes withholding
feedback a property of the schema rather than a discipline the API has to
keep.

Verified live against the running API: the catalogue lists ten available
exams, a started attempt serves items with no answer key and states that
hints are unavailable, saving an answer returns no grade, an open attempt
carries no result, submission returns raw counts with none of the forbidden
scaled fields, and a second submission is refused with 409.

Tests: 275 pass, 40 of them new for exams.

Three defects found by verifying live rather than by the tests, which is the
part worth recording:

1. Expiry was handled by hand in three places and two discarded the answers
   already given, so the same situation produced a different outcome depending
   on which path noticed first. Every path now goes through one scoring call.
   With that fixed nothing set the expired status, so the state machine is two
   states: a status the schema declares and nothing sets is a claim it does
   not keep.
2. The service scored an expired attempt and then raised the refusal, and the
   router turned the refusal into a 409 without committing, so the scoring was
   rolled back. The response said the attempt had been submitted while the
   database still showed it open. The service tests could not see it because
   they never cross the router's transaction boundary. Three tests now do, and
   the regression test was checked by reverting the fix and confirming it
   fails.
3. The attempt view returned no saved answers, so a learner who reloaded mid
   exam saw empty fields. The answers were always saved, but the reasonable
   thing to conclude from an empty field during a timed exam is that the work
   was lost, and the reasonable response is to type it all again while the
   clock runs.

Verified live in the browser: the catalogue states that an exam is timed,
gives no hints and marks nothing until submission; a started attempt shows the
clock in an aria-live region, every input has a label, and no correctness
appears anywhere; and a reload rehydrates the fields from the server.

## Phase 5: organic wave 1. Gate: ORG1 authored. Status: LESSONS DONE, ITEMS PARTIAL

All 70 ORG1 nodes carry a lesson, together making 938 machine-checked claims,
every one passing. That is the lesson half of the gate.

The item half is not finished, and the difference matters to a learner. Five
organic templates exist, and they target nodes in three units, so only units 3,
4 and 10 have practice items and only those three assemble a unit exam. The
other seven units teach and cannot yet be practised. Exam assembly refuses
rather than substituting from elsewhere, so this shows up as an exam that is
absent rather than one quietly built from the wrong nodes.

The phase opened by building verification before content, because organic
content fails differently from everything before it. A stoichiometry lesson is
self checking: the arithmetic either works or it does not. A stereochemical
assignment can be confidently inverted and read perfectly fluently, which makes
reviewing organic prose by reading it close to useless.

  chem_core/organic.py   CIP descriptors, enantiomer and diastereomer
                         relationships by actual reflection, degrees of
                         unsaturation, proton environments from symmetry
  chem_core/spectra.py   grader 10, whose verifier checks that an elucidation
                         item's data determines its own key, aiming the check
                         at the author rather than the learner
  app/data/claims.py     Stereo, Formula, Unsaturation, Relationship,
                         Environments and Source, attached to lessons and
                         re-derived when the suite runs
  chem_core/templates_o.py   five ORG1 templates, so organic nodes are
                         practiceable and ORG1 unit exams assemble

Compliance fails on a claim that does not hold and on an organic lesson
carrying no claims at all. The second rule matters because that failure is
silent: a lesson stating a configuration only in prose reads exactly like one
that was verified.

The evidence that this was necessary is in the record. The reference unit had
5 of its first 25 claims rejected, including two inverted CIP descriptors.
Three separate bugs in the checking machinery were found by using it: aromatic
pi bonds scoring zero under banker's rounding, a numeric grader that could
never mark a zero answer correct, and an are_enantiomers that called cis and
trans 1,4-dimethylcyclohexane enantiomers when both are achiral. That last one
rejected the true claim and accepted the false one, which is the worst possible
direction for a verifier to fail, and it was found by an author who reported it
rather than flipping the claim to make the failure go away.

## Phase 5b: the practice product. Gate: recorded, reviewable practice. Status: DONE

An audit against serious prep products (UWorld, the EUREKA test-prep module)
found the deepest flaw was structural: practice was stateless. The sandbox
graded a submission and the result went to the client and nowhere else, so
there was no history, no mastery, no analytics, no review of mistakes, and the
Learn page honestly said mastery was not recorded. Alongside it, 27 of 40
units had no practice items at all, and the misconception library's distractor
explanations were never shown to a learner.

What landed:

  practice sessions   pick units, count (5 to 40), tutor or timed mode; items
                      assembled across the chosen units from verified
                      templates only; answers final; sessions persisted
                      (migration 0004: practice_sessions, practice_responses,
                      node_mastery)
  rationale           every multiple choice option explains itself after the
                      attempt: the keyed misconception's description and
                      counterexample from the reviewed library, plus a link to
                      the lesson. Nothing is generated at request time.
  mastery             per node EWMA accuracy (alpha 0.3), named accuracy and
                      not ability; drives the Learn page state chips
                      (mastered / in progress / needs review) and the honest
                      counters that previously read zero
  analytics           /analytics: totals, per course, per unit worst first,
                      weakest nodes, recent exams and sessions. Own-account
                      figures only; the page states why there are no cohort
                      percentiles.
  item coverage       22 new templates (49 total, every one with an
                      independent verifier and a three rung hint ladder;
                      misconception library at 52). All 10 ORG1 units are
                      practiceable and all 24 catalogued unit exams assemble,
                      up from 13.

Completed in the same wave, closing the gaps the first pass named:

  flashcards      258 cards derived verbatim from the 129 authored lessons
                  (try_it and pitfall per lesson; no card text stored, so a
                  content fix propagates). SM-2 scheduling per learner
                  (migration 0005), /review surface with flip and four grades,
                  the true next interval shown after each grade.
  path planner    /path now plans from recorded mastery: review (weakest
                  first), continue (in progress), next (authored nodes whose
                  prerequisites are attempted, topological order). An empty
                  account is told the plan starts from the beginning. The
                  response says it is recorded practice accuracy, not an IRT
                  ability estimate.

Still absent, deliberately not claimed: a study planner with dates, cohort
statistics, and item difficulty data. The last two need real learners, and
inventing them would be the exact dishonesty this platform is built to
refuse.

## Phase 6: organic wave 2 and the retrosynthesis trainer. Gate: ORG2 + grader 11. Status: DONE

Organic Chemistry II is authored: all 76 nodes across 10 units carry a lesson,
together making 720 machine-checked claims, every one passing. Both organic
courses are now complete (ORG1 70/70, ORG2 76/76); the platform holds 205 of
312 nodes, general chemistry deliberately partial.

Grader 11, retrosynthesis, is built and live. It refuses to grade by judgement:
each disconnection is backed by an RDKit forward reaction, and a proposed
precursor set is correct exactly when running that reaction rebuilds the
target. The item verifier confirms the item's own key builds its own target, so
an unanswerable retro item cannot ship. The retrosynthesis trainer is a live
practice template on ORG2.RETROSYNTHESIS with a proper disconnection-menu and
precursor-input interaction in the practice player, riding the same recorded,
reviewable loop as every other grader.

Six ORG2 practice templates (unsaturation, aromatic NMR symmetry, alcohol
oxidation class, keto-enol tautomer, amine classification, amino-acid
configuration) make units 1, 2, 4, 8, 9 and 10 practiceable; their unit exams
assemble. Units 3, 5, 6 and 7 are readable and not yet practiceable, and the
practice catalogue marks them so.

The record again shows the claims discipline earning its place. The ORG2
authors caught, by deriving rather than asserting: L-cysteine is R not S (its
sulfur side chain outranks the carboxyl), maleic anhydride is 4 degrees of
unsaturation not 5, cyclohexene is 2 not 1, and the Diels-Alder adduct of the
cis dienophile is the meso diester while the trans gives the chiral pair.

## Register note: sessions between Phase 6 and Phase 7

This register fell behind the repository between 2026-07-25 and 2026-08-10,
and the honest fix is to say so rather than backfill invented phase entries.
What the intervening commits delivered, verified against the running system
on 2026-08-10: the full curriculum is authored (312 of 312 nodes, GEN1 91,
GEN2 75, ORG1 70, ORG2 76 - compliance reports it, and the coverage rules
gate on it), every unit is practisable, the exam catalogue assembles 40 unit
exams, practice sessions persist with node-mastery EWMA, an exam key leak
found in a deep review was closed, and the suite stood at 924 tests green
before Phase 7 started. The "Known gaps" list below predates some of this
and is corrected where it was wrong.

## Phase 7: graders 8 and 9, and the study planner. Gate: verifier per grader, suite green. Status: DONE

| Deliverable | Status |
|---|---|
| Grader 8 mechanism | DONE. Stepwise arrow-pushing graded by running each elementary step as an RDKit forward reaction. |
| Grader 9 lab data | DONE. Kinetics runs and titration curves; the extracted quantity grades numerically. |
| Study planner | DONE. Target-date plan over the path planner's route. Schedule arithmetic, stated as such. |
| Grader 10 spectra | Already live since Phase 5 (chem_core/spectra.py, served template on ORG1). Listed here because the build plan asked for it; nothing new was needed. |

Grader 8 refuses judgement the way retro does: every elementary step in an
item's menu is backed by a forward reaction, a claimed intermediate is
correct at a step exactly when running the step produces it, and the first
failing step is localized in the milestones. Regiochemistry is graded by
consequence rather than by fiat: protonating the wrong alkene carbon is a
real step and is accepted at that step, but the coherent path it starts ends
at the minor product, where MARKOVNIKOV-INVERTED (or MECH-NO-SHIFT for a
missed hydride shift) is diagnosed. The verifier walks the item's own key
path twice: once through the grading machinery, once independently through
InChIKey agreement and heavy-atom conservation by direct counting.

The verifier earned its keep before the grader ever served an item: RDKit
carries a reactant atom's charge into the product unless the product
template resets it, so the first draft of the halide-attack step produced
only sanitize-rejected products and never fired. The verifier refused the
item; the step library now writes every changed charge explicitly, and the
hydride shift enumerates its hydrogen counts because reaction SMARTS cannot
say "one less H than before".

Grader 9's verifier is aimed at the author, the way the spectra verifier is.
The generator computes the key from hidden parameters (the chosen k, the
acid's Ka); the verifier never touches them, recovering the quantity FROM
THE SERVED DATA by an independent route - least-squares regression on the
linearized kinetics data, interpolation at half-equivalence on the curve -
and refusing any seed whose data does not determine its own answer. For
kinetics it additionally requires the data to discriminate the stated order
against both wrong orders, so an ambiguous dataset is refused as a coin flip
rather than served. The characteristic slips are precomputed as named wrong
paths: the wrong-order regression slope diagnoses ORDER-FROM-COEFFICIENT or
ORDER-READ-AS-ONE, the pH at equivalence diagnoses PKA-READ-AT-EQUIVALENCE.

The datasets are exact simulation output rounded to instrument-realistic
figures, with the rounding stated in the prompt. No synthetic noise: an
error model nobody measured is a fabricated number wearing a lab coat.

The study planner divides the route the path planner recommends (review
weakest-first, then in progress, then the authored frontier in course
order) evenly across the days to a learner-chosen date. The response states
plainly that this is schedule arithmetic: it counts nodes and not minutes,
because no per-node time has been measured on anyone; it attaches no
completion probability and predicts no score. A test walks the payload and
fails if any of those numbers ever appears. A date in the past is refused
with 422, because a plan for a date that has passed is not a plan.

Serving stays fail-closed: the whitelist serves a mechanism item's step menu
as names and prose only - never the reaction SMARTS, key path, product or
wrong-product table - and a lab-data item's dataset and rounding note, never
its value or wrong paths. Verified against the live serve payload for every
fixture.

Evidence:

- 12 seed sweep across the four new templates: 48 of 48 keys independently
  verified. All-template sweep re-run after registration.
- 47 new chem_core tests (grading, both verifiers refusing broken keys, the
  recovery routes against ground truth, a 10-case adversarial battery per
  grader, p95 latency inside the 500 ms budget) and 4 planner API tests.
- Three new misconceptions, review="pending", instructor observation,
  routed to real nodes.
- The practice player renders both item types: ordered step rows with a
  step selector and SMILES field for mechanism, the dataset as a table for
  lab data. tsc clean.

Still deliberately absent: graders 5 (Lewis structures, needs a drawing
surface with electron placement the current sketcher does not expose) and
the AN/P1/P2 analytical tiers; the guardrailed tutor remains gated on
contract item 2.3 and a red-team suite. Cohort statistics and item
difficulty still wait for real learners.

## Phase 8: MCAT-mode serving through EUREKA. Gate: GATE B end to end. Status: DONE

2026-08-10. OCTET now serves the chemistry inside EUREKA's MCAT product,
with the division of authority the integration contract prescribes:
chemistry (generation, verification, grading, misconception rationale)
stays here; commerce (the entitlement gate, the AAMC category mapping, the
attempt log and weakness analytics) lives in api-core, which forwards the
learner's own token.

What serves: `/mcat/items`, `/mcat/submit`, `/mcat/eligible-nodes`.
Stateless items - (template_id, seed) regenerates the variant and its
option order deterministically, one choice-assembly function shared by
serve and submit. The pool is mc templates with >= 2 misconception-keyed
distractors only: items carry 3 or 4 options and say which; nothing is
padded, numeric and free-response templates are not skinned into MCQs
because their distractors would have to be invented. Serving carries no
correct index. A caller-supplied offset (EUREKA sends the learner's
attempt count) keeps repeat sessions on fresh variants.

The mapping is data under review, not code: 67 nodes placed into AAMC
4B/4E/5A/5B/5D/5E in api-core's octet_mcat_map, every row with a rationale
and review='pending'; 5C is empty because OCTET has no separations
content. Present servability, stated per category in the EUREKA UI before
any click: 5B 12 nodes, 4E 4, 5E 2, 5A 1, 4B and 5D zero. Growing that
number is authoring work (keyed distractors), not a serving-time
transform.

Contract items closed: 2.1 decided and live (EUREKA exposes cross-vertical
mastery; api-core forwards to AXIOM's mastery API with the caller's token,
verified against the running stack) and 2.3 decided (tutor routes through
api-core's reasoning endpoints; implementation stays gated on the red-team
review). 2.2 was already decided.

Verified: 983 tests green on the rebuilt image (8 new MCAT tests: serve
determinism, serve==submit option order, payload leak walk, honest option
counts, offset variation, unservable reporting, out-of-range refusal,
eligible-nodes honesty); 12 EUREKA-side integration tests (402 gate,
either-entitlement, server-derived category on the attempt log,
client-supplied category ignored, offset advance, weakness scoping with no
invented statistics, servability annotation); and GATE B, a Playwright run
against the live stack: entitle (comp path; Stripe checkout deliberately
503s without keys) -> practice -> miss -> rationale -> add to the one SM-2
review queue -> weakness analytics -> OCTET lesson deep link signed in.

One incident worth recording: the first cross-service call failed signature
verification because octet's compose fell back to the placeholder JWT
secret when the env var was absent - the exact silent-secret trap the local
stack notes warned about. Compose now accepts either OCTET_JWT_SECRET or
JWT_SECRET before falling back, matching .env.example.

## Phase 9: MCAT test-prep infrastructure (EUREKA side). Gate: GATE C. Status: DONE

2026-08-11. This phase is recorded here because it was driven from the
OCTET programme, but almost all of it landed in EUREKA (branch
omu/phase-c-mcat). It began with an audit rather than a build:
docs/mcat/AUDIT.md lists twelve gaps with file:line evidence, and the four
P0s were things the product was telling learners that were not true.

What was closed:

- MC-1. The 580-item MCAT bank was compiled into the browser bundle with
  every answer key and explanation, graded by a client-side comparison. The
  bank moved into the server item infrastructure (bank mcat-qbank-v1, all
  580 rows DRAFT + AI_GENERATED, because the source file said "AI-generated.
  Requires SME review." and nothing here launders that), and the client file
  was deleted. Items now serve without keys; grading is server-side.
- MC-2 / MC-9. The full-length simulation graded in the browser and showed
  an "estimated scaled score" of 472 + percent x 0.56 - a linear map with no
  equating data behind it. The simulation is now server-drawn and
  server-graded on the existing MockAttempt models, and reports raw and
  per-section results only. theta, scaled_score and pass_probability stay
  NULL by design.
- MC-4 / MC-5. The server used to record whatever score the client claimed.
  Every graded response now writes an attempt_logs row, and the aggregates
  derive from those rows.
- MC-8. Passages exist, with the same review and provenance standing as
  items, and their attached items are excluded from the discrete draw.
- MC-12. A review centre fed by the response log: accuracy by section and
  weakest subtopics with counts beside every figure, and a self-maintaining
  missed list.
- MC-7. SME review became a gate rather than a comment. Flagged and retired
  content never serves; DRAFT serves only free surfaces with its standing
  disclosed; the paid pool is approved-only and refuses rather than padding
  from unreviewed content.
- MC-3 / MC-10. The test-prep service stopped inventing numbers: a predicted
  score from questions_answered * 0.01 + 50, an np.random.normal
  "distribution", the raw score returned as a percentile, a hardcoded
  percentile of 50.0, and a synthetic peer at 0.5 when no cohort existed.
  All removed or floored behind a stated minimum cohort. The adaptive
  engine's four hand-written theta-to-scale tables went too - they had no
  equating source, and silently scored every unlisted exam on the GRE scale.

Found while working, not in the original register: POST /irt/calibrate was
gated on any authenticated user with a floor of one attempt, so a learner
could have rewritten every item parameter on the platform. Now admin-only.

The calibration threshold is written down before the data exists
(docs/mcat/IRT_CALIBRATION.md): 300 responses from 100 distinct learners,
per item, both. Today the honest report is 588 items, 36 responses, zero
eligible - and GET /mcat/irt/status says exactly that.

GATE C: 9 Playwright tests against the live stack, nothing stubbed, five
consecutive clean runs. The one flake found along the way was a strict-mode
locator matching two elements that legitimately carry the same
no-scaled-score wording, fixed by scoping rather than by loosening the
assertion. 31 api-core integration tests across the four MCAT suites.

Still open and deliberately so: the bank is entirely AI-generated and
awaiting SME review, so the paid simulator pool is currently empty by
design; scaled scoring stays absent until equating data exists, which
calibration alone will never supply.

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
5. CORRECTED 2026-08-10: this entry predated Phase 4 and 5b. Migrations
   0001-0005 exist, mastery persists in node_mastery, and practice sessions
   and SRS state persist. What remains unpersisted is the predict, observe,
   explain attempt history: the HMAC ticket carries one sitting safely, and
   a learner's history of POE attempts is still not stored.
6. Molecules have no 3D coordinates. The library stores SMILES, which records
   connectivity and not geometry, so `has_3d` is false for all 200 and the
   viewer states that the layout it draws is illustrative rather than measured.
7. Structure items covered drawing a named molecule until Phase 5 added five
   organic templates: unsaturation, CIP assignment, isomer relationships,
   proton environment counting and structure elucidation. Mechanism and
   retrosynthesis items remain unbuilt, with graders 5, 8, 9 and 11.
9. 112 authored facts in ORG1 carry a citation but have not been checked against
   the cited work. These are the values the system cannot derive from structure:
   chemical shifts, IR bands, pKa values, bond energies. A citation names who is
   accountable for a number, not that the number was verified, and the
   compliance checklist reports the count as `citation_review_debt` so the
   review queue is visible rather than implied. Nothing in ORG1 should be
   presented as expert reviewed.
10. Four of ORG2's ten units (3, 5, 6, 7) have lessons but no practice items yet, and earlier seven of ORG1's ten units, because the
   five organic templates cover nodes in units 3, 4 and 10 only. Those seven
   units are readable and not practisable, and no unit exam exists for them.
8. The tutor gateway does not exist. It is Phase 7 and gated on a red team
   suite.

# AXIOM grading core and service

Runnable proof-of-model for the AXIOM Engineering Mathematics track: the Unit 1
knowledge graph and verified item seed, a CAS grading core covering linear
algebra through ODEs and Fourier, a step-credit engine with error localization,
and a FastAPI grading service wrapping all of it. Everything executes and is
tested end to end (11/11 API tests passing).

## Files

- axiom_schemas.py       Pydantic v2 schemas (the shape contract for seed data).
- axiom_grading.py       Linear algebra graders and the verified-everything gate
                         (point equivalence, RREF, solution-set equality,
                         parameterized 3x3 template with per-variant verification).
- axiom_steps.py         Step-credit engine: grades a derivation line by line by
                         solution-set preservation, localizes the first error,
                         detects milestones, awards partial credit.
- axiom_advanced.py      Advanced graders: ODE solutions (verified by
                         substitution, arbitrary-constant counting, IVPs),
                         eigenpairs (A v = lambda v), antiderivatives (verified
                         by differentiation), Fourier series coefficients,
                         Laplace transforms.
- axiom_service.py       FastAPI grading service exposing every grader plus
                         verified template-variant generation.
- test_service.py        API test suite (run: python3 test_service.py).
- linalg_unit1_seed.json Linear Algebra Unit 1 seed: 11 nodes, 10 edges,
                         10 misconceptions, 5 items.
- demo_verify.py         Original end-to-end seed and grading demo.

## Run

    pip install sympy pydantic fastapi httpx uvicorn
    python3 demo_verify.py          # seed validation and core grading demo
    python3 test_service.py         # full API test suite
    uvicorn axiom_service:app       # live service (docs at /docs)

## Design principle: grade by verification

Every advanced grader checks the mathematical property rather than comparing to
one stored form. An ODE solution is substituted into the ODE; an antiderivative
is differentiated; an eigenvector is multiplied by the matrix; a parametric
solution set is checked against the null space. Any correct form passes
automatically, and the same machinery verifies answer keys before items ship.

Grading subtleties handled deliberately:
- An ODE general-solution item rejects a particular solution ("missing the
  arbitrary constant") with that exact diagnosis, and an IVP item rejects a
  response that still carries a constant.
- The eigenpair grader distinguishes "right eigenvalue, wrong vector" from
  "not an eigenvalue," which are different misconceptions.
- The step-credit engine validates each line by solution-set preservation, so
  any legal algebraic move is accepted (not just author-anticipated moves) and
  the first line that changes the solution set is reported as where the error
  entered. That error-location signal is the input to misconception tagging.

## Production hardening still to do (deliberate deferrals)

- Sandbox and hard-timeout every grade call (adversarial input can make
  simplify slow). Run graders in isolated workers, as the build prompt requires.
- Auth at the gateway, GradingRecord events into analytics and mastery.
- Trig-identity-heavy equivalence sometimes needs stronger simplification
  strategies than plain simplify; add a fallback chain (trigsimp, radsimp,
  nsimplify, then random numeric sampling as a last resort).
- Step engine currently covers chains of equations; extend to inequality
  chains and expression-rewriting chains (equivalence instead of solution sets).

## Learner loop (new)

- axiom_mastery.py   Bayesian Knowledge Tracing with an append-only evidence
                     log per node, so "why does the system think this" is
                     always answerable.
- practice.html      Practice UI served by the service at "/". Four item types:
                     CAS point solve, misconception-keyed multiple choice, ODE
                     general solution, and show-your-work with error
                     localization. Live mastery bars per knowledge node.
- /v1/attempt        Grades, updates mastery, and returns a diagnosis in one
                     call. /v1/mastery/{learner} returns the snapshot.

Run the whole thing:

    uvicorn axiom_service:app --port 8000
    # open http://localhost:8000  (API docs at /docs)

BKT note, stated honestly: with the default parameters a single wrong answer at
a low prior can still raise mastery slightly, because the learning-transition
term (every attempt is a learning opportunity) outweighs the Bayesian drop.
That is standard BKT behavior, visible in the evidence log, and tunable via
BktParams. Mastery state is in-memory for this slice; the platform version is
the MasteryState table.

## Persistence and adaptivity (new)

- axiom_db.py        SQLAlchemy 2.0 models (nodes, edges, misconceptions,
                     items, attempts, append-only mastery evidence), idempotent
                     seed loader, and a DB-backed BKT store. Reads DATABASE_URL
                     (use postgresql+psycopg://... in production); defaults to
                     a local SQLite file so it runs anywhere.
- axiom_adaptive.py  Next-item picker with three explainable policies:
                     remediation (a wrong answer's misconception routes the
                     next item), frontier (lowest-mastery node whose
                     prerequisites are mastered), and review (retention pass
                     once everything is mastered; placeholder for FSRS).
- /v2/attempt        Database-backed grade + attempt record + mastery update.
- /v2/next-item/{learner}   The picker, returning the item plus a written
                     reason for why it was chosen. Served choices never include
                     correctness flags or misconception keys.

Two properties enforced structurally, worth knowing:
- The verified-everything gate runs at seed-load time and again at selection
  time: an item that fails verification is stored but flagged, and the picker
  and /v2/attempt refuse to serve or grade it.
- Mastery is an append-only evidence table; "current mastery" is just the
  latest row, so the full why-history is always reconstructible.

Test run summary: gated seed load (5/5 items verified), frontier start,
M3-triggered remediation detour to N10, 40 picker-driven steps reaching the
review policy, and 41 evidence rows surviving a process restart.

## Per-learner variants and the adaptive UI (new)

- IssuedVariantRow   Every parameterized item is issued as a per-learner
                     variant: seeded from (learner, item, attempt), verified at
                     issuance, stored with its key server-side, and graded
                     against the exact variant that was served. An unconsumed
                     variant is reused on re-request (no reroll farming), a
                     consumed one triggers a fresh issue, and submitting
                     against another learner's variant is rejected outright.
- /v2/next-item2     The adaptive picker with variant issuance: template items
                     arrive with their seeded numbers rendered into the stem
                     and a variant_id for grading.
- /v3/attempt        Grades variant submissions against the issued key;
                     delegates everything else to the v2 path.
- practice.html      Rewritten as a single adaptive card: the picker chooses
                     the item, the policy badge and written rationale are shown
                     to the learner, inputs render per grader type (point, MC,
                     RREF grid, parametric solution set, seeded 3x3 systems),
                     and mastery updates live. Anonymous learner ids persist in
                     localStorage.
- Item rotation fix  The picker now selects among a node's verified items by
                     fewest attempts from that learner, so nodes with several
                     items (including templates) cycle instead of repeating
                     the first row.

Verified in the test run: alice and bob received different systems with
different keys, alice's correct answers failed on bob's variant (answer
sharing defeated by construction), and cross-learner variant submission was
rejected.

## Course content (full curriculum build)

- axiom_curriculum.py       source of truth for the full curriculum; run to emit JSON and integrity checks
- axiom_full_curriculum.json  3 courses, 26 units, 74 nodes, 86 edges (7 cross-course), 34 misconceptions, 13 diagnostic MC items
- axiom_templates.py        18 parameterized item templates with independent SymPy verifiers; run for the verification sweep (270/270 passing)
- lessons_linear_algebra.md   28 lessons, one per LA node
- lessons_odes.md             22 lessons, one per OD node
- lessons_pdes_fourier.md     24 lessons, one per PF node

Next wiring step: a loader to ingest axiom_full_curriculum.json plus the
template registry into axiom_db (the current seed loader handles the older
linalg_unit1_seed.json format).

## Wave 2 content (Calculus I-III, Probability and Statistics, Discrete Math)

Teaching layer:
- axiom_teaching_model.md: the pedagogy contract. Hint ladders before
  solutions, misconception-named feedback, six-part lesson arc, mastery
  gates, and the compliance checklist every new course must pass.

Curriculum (run: python3 axiom_curriculum_wave2.py, regenerates
axiom_full_curriculum.json with all 8 courses):
- 8 courses, 154 nodes, 176 edges, 76 misconceptions, 23 diagnostic items,
  0 integrity problems. New courses: C1 Calculus I (18 nodes), C2 Calculus
  II (16), C3 Calculus III (16), PS Probability and Statistics (16), DM
  Discrete Mathematics (14). 12 new cross-course edges, including
  C110/C201 -> OD01, C215 -> OD19, C304 -> PF07, DM08 -> PS01, LA24 -> PS16.

Templates (run: python3 axiom_templates_wave2.py):
- 19 new parameterized templates, 228/228 variants verified through
  independent paths (numeric difference quotients, differentiate-the-key,
  opposite-order Fubini, derivative-formula Taylor checks, recurrence
  iteration, brute-force enumeration, sympy.stats).
- HINTS: three-rung hint ladders (orient, method, first step) for all 37
  templates across both waves; hint_coverage() enforces completeness.

Lessons (six-part teaching arc, one lesson per node, coverage-checked):
- lessons_calculus_1.md (18 lessons), lessons_calculus_2.md (16),
  lessons_calculus_3.md (16), lessons_probability_statistics.md (16),
  lessons_discrete_math.md (14). With wave 1: 154 lessons total.

## Review layer: save and redo missed questions

- axiom_review.py: missed_questions table plus the /v1/review API. Every
  wrong attempt is saved automatically (exact stem the learner saw, their
  answer, diagnosed misconception, miss count); a correct re-attempt on the
  same question clears the entry; a later miss reopens it with history
  intact. Template items store the variant_id, so retry serves the very
  numbers the learner missed and grades against the stored key.
- Endpoints: GET /v1/review/{learner}/missed (open, cleared, or all,
  filterable by node), GET /v1/review/{learner}/summary (counts by node for
  a dashboard), POST /v1/review/{learner}/retry/{missed_id} (re-serves the
  question with no answer leakage, submit via /v3/attempt).
- axiom_service.py: review recording hooked into both attempt-grading
  sites; review router mounted. Run: python3 test_review.py (20/20), and
  test_service.py still passes 11/11.

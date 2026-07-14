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

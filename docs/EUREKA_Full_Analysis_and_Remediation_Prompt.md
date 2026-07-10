# EUREKA Full-Platform Analysis and Remediation Prompt

Educational Universal Reasoning Enhanced Knowledge Architecture - a complete,
evidence-based audit of every service, app, and vertical in the EUREKA platform,
followed by a severity-ranked gap register and a phased remediation program that
closes every gap or honestly documents why it stays open.

This document is a master prompt for an autonomous coding agent (for example
Claude Code) or a small engineering team. Execute it top to bottom. Do not skip
the audit and jump to fixes: the audit output IS the work order for the fixes.

---

## 0. How to use this document

- Phase A (audit) produces the Gap Register. Phase B ranks it. Phase C plans
  waves from it. Phase D executes the waves in order. Phase E re-verifies.
- One wave at a time. Each wave ends with: tests green, live smoke passed,
  changes committed and pushed, STATUS updated honestly. Never start wave N+1
  with wave N broken.
- Evidence over recall. Every audit claim carries a file path or a live-request
  result. "It should work" is not a finding; "GET /api/v1/x returns 500, log
  attached, cause at services/foo/app/y.py:120" is.
- Honest calibration. A module that is a stub must be reported as a stub. The
  audit exists to find the difference between what the repo LOOKS like it does
  and what it actually does. Overstating completion is the one unforgivable
  failure mode of this program.
- Scale audit effort by risk: auth, data isolation, grading, payments-like
  flows, and anything touching minors' data get the deepest inspection.

## 1. Platform inventory (audit surface)

This is the real tree as of authoring. The audit covers ALL of it.

Infrastructure (docker-compose at eureka/docker-compose.yml):
  db (Postgres), redis, minio, opensearch, kafka, jaeger, neo4j, qdrant.

Core services (eureka/services/):
  api-core            - identity, courses, enrollments, progress, notes, SRS,
                        tutor_agent, recommender, variant_generator
  file-storage        - object storage facade over minio
  tutor-llm           - LLM tutoring service
  assess, adaptive, content, analytics - learning core
  tier-hs, tier-ug, tier-grad          - academic tier services
  pro-law, pro-mba, pro-eng            - professional verticals
  medical-school                       - medical vertical

Platform services (services/ at repo root):
  ai-research, data-fabric, ethics-security, futures, institutions,
  marketplace, notebook, pedagogy, platform-orchestrator, shared,
  test-prep (+ worker + beat, own compose), xr-labs.

Apps (eureka/apps/):
  web    - Next.js app router: dashboard, auth, learner, high-school,
           undergraduate, graduate, medical, marketplace, institutions, tiers,
           training, transcript, test-prep-landing, community, blog, help,
           admin, settings, system-status, demo, r
  admin  - admin console
  mobile - mobile app (state unknown; audit must classify)

Verticals with their own stacks:
  axiom/        - mathematics vertical (recently completed through its own
                  build prompt + curriculum/proof extension; audit CONFIRMS
                  rather than rebuilds, and verifies its EUREKA integration
                  contract from the EUREKA side)
  services/test-prep - 11-exam test-prep vertical (own compose + prod compose)

Repo-level concerns: Makefile, setup.sh, START_TEST_PREP.sh, database/, docs/,
scripts/, secrets/ (!), duplicate lockfiles (package-lock 2.json), .github/.

## 2. Ground rules and constraints

- ASCII punctuation only in all docs and generated copy (plain hyphens, periods,
  commas, parentheses). No em dashes, ellipses, or smart quotes.
- Never force-push main. Regular push after each verified wave.
- Commit trailer: Co-Authored-By line per the repository's convention.
- Credentials come from env, never committed. If the audit finds committed
  secrets, that is an automatic P0 with immediate rotation guidance.
- Do not mark anything production-ready that is not. STATUS files must contain
  a "Not built yet" section that is actually true.
- Migrations are hand-written or autogenerate-verified; every schema change is
  proven zero-drift (autogenerate on a migrated scratch DB produces an empty
  upgrade).
- Every AI-assisted feature is labeled AI-assisted and human-overridable. No
  high-stakes decision is finalized by AI alone.
- Prefer swappable provider interfaces (identity, reasoning, email, embedding,
  formal verifier) with deterministic offline defaults, matching the pattern
  already established in AXIOM.

## 3. Phase A - Full-platform audit

Fan out parallel audit agents, one per area below. Each agent reads actual code
and, where the stack is running, exercises live endpoints. Each capability is
classified BUILT / PARTIAL / STUB / MISSING / BROKEN with one-line evidence.

### A1. Identity, auth, and tenancy (deepest audit)
- Token issuance and verification across api-core, test-prep, AXIOM, and every
  service that authenticates. One JWT secret and algorithm story, or documented
  bridges. JWKS or shared-secret; prod guards (no dev secrets in prod paths).
- Dev-login and demo credentials: gated behind non-prod everywhere.
- RBAC: role taxonomy consistency across services; least-privilege on every
  router; parent/guardian roles for minors.
- Tenancy: does EVERY service scope queries by tenant/org where the model has
  a tenant column. AXIOM now enforces this; verify the rest of the platform.
- Session/refresh: revocation, rotation, logout blacklist behavior.

### A2. Service-by-service depth classification
For each of the ~30 services: does it have real routes, real models, real
migrations, real tests, and a real consumer (web/admin/mobile calls it)? Or is
it a scaffold? Produce a table: service, depth (real/partial/stub), evidence,
consumers, DB objects, test count. Explicitly flag services that compose starts
but nothing calls.

### A3. Infrastructure actually-used audit
kafka, opensearch, jaeger, neo4j, qdrant, minio: for each, find the producers
and consumers in code. Infra that nothing uses is a finding (either wire it or
remove it from compose). Healthchecks and service_healthy dependencies. Startup
order. Volume persistence. Resource limits.

### A4. Web app (eureka/apps/web)
- Every route in src/app: does it render real data from a real endpoint, or
  mock/hardcoded content? Classify per page.
- Auth flow end to end: sign-in, token storage, 401 recovery, sign-out.
- Error states: offline banners vs silent empty states; error boundaries.
- Build health: tsc, lint, next build clean; no ignoreBuildErrors.
- Accessibility baseline: keyboard nav, aria labels, contrast, reduced motion.
- Cross-vertical navigation: links to test-prep, AXIOM, and back; SSO handoff
  works in both directions (token in URL hash pattern).

### A5. Admin app and mobile app
Same treatment as A4. Mobile especially: classify honestly (buildable? runs?
talks to real API? or aspirational scaffold).

### A6. Verticals integration audit
- test-prep: its own compose vs root compose; JWT bridge to api-core; the 11
  exam banks load; progress/SRS round-trips; CI coverage.
- AXIOM: verify the EUREKA-side integration contract that AXIOM already codes
  against (see Section 7). AXIOM calls EUREKA reasoning at
  POST {base}/api/v1/reasoning/generate and /score-rubric; the audit MUST
  determine whether api-core (or tutor-llm) actually serves these. Initial
  survey says NO reasoning router exists in api-core - expected P1 finding.

### A7. Data layer
- Migration health per service: alembic upgrade head clean from scratch; up and
  down; drift check. Services sharing one DB vs per-service DBs; cross-service
  FK leakage.
- Seed data: idempotent, non-destructive, gated from prod.
- Backups/retention: any story at all (likely a gap; record it).

### A8. Quality infrastructure
- Tests per service (unit/integration/e2e), what CI actually runs and gates,
  flaky/legacy-failing suites (api-core had 167 legacy-failing test bodies at
  last count; verify current number). Load tests. Contract tests against
  OpenAPI. Lint/type gates.

### A9. Security and compliance sweep
- secrets/ directory contents and git history for committed credentials.
- CORS, DEBUG, and default-secret guards per service.
- Input validation on every public endpoint; no eval paths; upload handling.
- FERPA/COPPA posture platform-wide (AXIOM has a posture doc + consent +
  retention + audit log; the rest of the platform likely does not).
- Dependency audit: known-vulnerable pins, duplicate lockfiles.

### A10. Observability and ops
- Structured logs, request IDs, metrics, traces per service (jaeger is in
  compose; is anything exporting to it?). Health/ready endpoints everywhere.
- One-command developer bootstrap: does setup.sh/Makefile actually work on a
  clean machine? Documented ports; no port collisions.

## 4. Phase B - Gap Register and severity rubric

Compile every finding into docs/EUREKA_GAP_REGISTER.md with columns:
id, area, finding, evidence (path or request), severity, effort (S/M/L),
dependency (what must land first), wave assignment.

Severity rubric:
- P0: security or data exposure (committed secrets, missing auth on a data
  route, cross-tenant leakage, dev-login reachable in prod paths), data loss,
  or a broken primary user journey (cannot sign in, cannot take a course).
- P1: a promised capability that does not work end to end (dead module page,
  service nothing consumes, AXIOM reasoning contract unserved, broken CI gate,
  legacy-failing suites masking regressions).
- P2: spec deviations and partials (stub services started by compose, unused
  infra, missing tests on real logic, inconsistent RBAC, a11y gaps).
- P3: polish and hygiene (duplicate lockfiles, dead scripts, doc drift).

Ranking rule: fix order is P0, then P1 by user-journey impact, then P2 grouped
by service to amortize context, then P3 batched.

## 5. Phase C - Remediation planning rules

- Group fixes into waves of one coherent theme each, sized to land in one
  session with full verification. Name them EK-1, EK-2, ...
- Every wave declares: scope, files, acceptance criteria, verification steps
  (tests + live smoke), and rollback note.
- Anything NOT being fixed gets an explicit "accepted gap" entry in STATUS with
  the reason (out of scope, needs external system, needs product decision).
- Do not delete or hollow out a stub service without a decision entry: either
  implement to minimal-real (routes + model + one consumer + tests) or remove
  from compose and mark planned, with the choice recorded.

## 6. Phase D - Implementation waves (pre-seeded plan)

The audit may add, split, or reorder waves, but these are the expected ones
based on current evidence. Each wave ends with the standard cadence: pytest and
web builds green, live smoke proof, zero-drift migrations, commit + push,
STATUS updated.

EK-0 Baseline and safety (P0 sweep)
- Rotate/purge anything found in secrets/ and git history; add gitleaks-style
  CI check. Kill duplicate lockfiles. Prod guards on every dev-login and
  default secret. Verify every public router requires auth where it must.
- Acceptance: a fresh clone + setup boots; no committed secrets; auth required
  on all non-public routes, proven by a scripted probe of every mounted route.

EK-1 Identity and tenancy unification
- One documented auth story: token format, secret/JWKS, claims, role taxonomy;
  bridges (test-prep, AXIOM) verified live in both directions.
- Enforce tenant scoping in every service with tenant-modeled data; add the
  audit-log/consent/retention pattern from AXIOM to api-core (platform-wide
  compliance floor).
- Acceptance: cross-tenant read attempts return 403/404 in every service,
  proven by tests; SSO handoff web -> test-prep -> AXIOM -> back works live.

EK-2 EUREKA reasoning core (serve the contract AXIOM already consumes)
- Implement POST /api/v1/reasoning/generate and /score-rubric (in api-core or
  tutor-llm behind the gateway), request/response schema exactly as AXIOM's
  EurekaReasoningProvider sends: task, question, reveal_answer, passages,
  history -> text; rubric scoring with criteria/awarded/confidence.
- Back it with the swappable provider pattern: deterministic extractive default,
  optional local model (Ollama) and hosted model (Anthropic) backends; safety
  guardrails; never reveal answers when reveal_answer is false.
- Flip AXIOM compose to AXIOM_REASONING_PROVIDER=eureka and prove the live
  round-trip (AXIOM hint -> EUREKA reasoning -> grounded reply).
- Acceptance: AXIOM copilot hint served by EUREKA live; graduated-hint rule
  holds; fallback to mock proven by stopping the service mid-test.

EK-3 Service depth reconciliation, batch 1 (learning core)
- assess, adaptive, content, analytics: bring each to minimal-real or better
  (real routes + models + migrations + at least one web consumer + tests), or
  formally fold their duties into api-core and remove the empty shells.
- Acceptance: the A2 table re-run shows no "stub started by compose" in the
  learning core; web pages consume them live.

EK-4 Service depth reconciliation, batch 2 (tiers and professional verticals)
- tier-hs/ug/grad, pro-law/mba/eng, medical-school: same treatment. Where
  content is the gap (not code), seed honest minimal curricula and label depth.
- Acceptance: every tier/vertical page in web renders real data end to end.

EK-5 Platform services reconciliation
- marketplace, institutions, notebook, xr-labs, ai-research, pedagogy,
  data-fabric, ethics-security, futures, platform-orchestrator: classify from
  the audit, then implement-or-remove per Section 5 rules.
- Acceptance: compose starts only services with real consumers; each surviving
  service has tests and a health endpoint; jaeger/kafka/opensearch/neo4j/qdrant
  each have at least one real producer AND consumer or are removed.

EK-6 Web/admin/mobile truthfulness
- Eliminate mock-data pages: wire to real endpoints or clearly label demo.
  Fix 401 recovery, error boundaries, offline banners everywhere. Admin app to
  parity on auth + RBAC. Mobile: classify, then either build to first real
  screen against api-core or mark planned and exclude from claims.
- Acceptance: Playwright e2e covering sign-in, one full learner journey, one
  teacher/admin journey, cross-vertical navigation; all green in CI.

EK-7 Quality gates
- Retire or rewrite remaining legacy-failing api-core tests to green; gate CI
  on every service's suite; add contract tests (OpenAPI snapshot + drift
  check) for api-core and the reasoning endpoints; load-test the top three
  user journeys.
- Acceptance: CI is red if any service suite fails; snapshots committed.

EK-8 Observability and ops
- Structured logs + request IDs + /health + /metrics on every surviving
  service; traces actually exported (jaeger shows spans for a real request
  crossing web -> api-core -> tutor-llm); Makefile/setup.sh one-command boot
  verified on a clean checkout; port map documented.
- Acceptance: a single trace id follows one request across three services.

EK-9 Compliance floor platform-wide
- Extend the AXIOM compliance pattern (unified audit log, retention config +
  purge job, parental consent, FERPA/COPPA posture doc, data minimization
  notes) to api-core and any service storing learner PII.
- Acceptance: consent-gated flows tested; purge job proven on synthetic data;
  posture doc reviewed against the audit findings.

EK-10 Final re-verify and honest STATUS
- Re-run the full Phase A audit checklists as a closing sweep; update the Gap
  Register with closed/accepted state per item; write/refresh a root
  docs/STATUS.md for the whole platform with a true "works today" and "not
  built yet"; rebuild all stacks and run every suite one final time.
- Acceptance: zero P0/P1 open or each has a signed accepted-gap entry; all
  suites green on freshly built images.

## 7. Cross-cutting integration contracts (verify explicitly)

These are the seams the platform already depends on. The audit tests each; the
waves close what fails.

1. Auth/SSO: EUREKA-issued JWT accepted by test-prep and AXIOM; claims carry
   user id, tenant, roles; handoff via URL hash; logout propagates.
2. Reasoning core: /api/v1/reasoning/generate and /score-rubric per EK-2. This
   is currently UNSERVED (no reasoning router exists in api-core) while AXIOM
   ships a client for it - highest-value single integration fix.
3. Analytics bus: if events flow to a central store, define the schema
   (Caliper-style, as AXIOM emits) and a consumer; otherwise record as accepted
   gap. kafka must not sit unused.
4. Vector store: qdrant is provisioned; AXIOM uses its own pgvector. Decide one
   story (shared vs per-vertical) and document it; remove unused pieces.
5. Design system: shared tokens/components across web, admin, AXIOM web so the
   platform reads as one product; at minimum, document the divergence.

## 8. Verification discipline (every wave, no exceptions)

1. Unit/integration tests for the touched services - green.
2. Web tsc + build (and admin/mobile where touched) - green.
3. Migrations up from scratch + zero-drift autogenerate - clean.
4. Live smoke: the specific user-visible behavior of the wave demonstrated
   against running containers, output captured in the commit message or STATUS.
5. Playwright e2e suite - green.
6. Commit with descriptive message + trailer; push; STATUS updated.

## 9. Definition of done for the whole program

- The Gap Register exists, is complete, and every entry is closed or accepted.
- No P0 anywhere. No P1 without a dated accepted-gap entry.
- Every compose-started service is real, consumed, tested, and observable.
- The three cross-vertical journeys (learner core, test-prep, AXIOM) run end
  to end on a fresh clone with documented bootstrap.
- The reasoning contract is served and consumed live.
- Root STATUS.md tells the truth, including what is not built.

## 10. Reporting

At the end of each phase and each wave, report: what was claimed before, what
the evidence showed, what changed, what remains, in plain prose. Lead with the
delta, not the narrative. If a finding contradicts this document's assumptions,
say so and update the Gap Register rather than bending the finding.

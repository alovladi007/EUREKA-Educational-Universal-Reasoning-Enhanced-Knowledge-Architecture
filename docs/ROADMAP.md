# EUREKA Scaling Roadmap

A phased plan to take EUREKA from "ambitious scaffold" to a platform competitive with **Udemy**, **Khan Academy**, **UWorld**, and **Wysebridge** — across course delivery, K-12 mastery learning, professional test prep, and engineering licensure prep respectively.

Each phase is broken into **sessions**. Each session is sized to ~1–3 days of focused agent work and ends in something demoable. Each session has a self-contained agent prompt at the bottom of this document.

---

## Strategic positioning: where EUREKA wins, where it has to catch up

| Competitor | Their moat | EUREKA's gap | EUREKA's angle |
|---|---|---|---|
| **Udemy** | 200k+ courses, instructor marketplace, certificates, sales engine | Content volume, video infra, instructor onboarding flow | AI co-teaching layer + cross-tier credit (HS → Pro) |
| **Khan Academy** | Curated K-12/early-college content, mastery model, parent/teacher dashboards, free tier, Khanmigo | Decades of expert-authored content, brand trust, mobile UX | LLM-native: dynamic content generation, multilingual on-demand, cheaper to scale |
| **UWorld** | Industry-standard exam-bank quality (USMLE, MCAT, NCLEX, CPA), detailed explanations, exam-realistic UI | Question quality + medical/legal/CPA SME pipeline; performance analytics depth | Bring AI-tutoring + adaptive sequencing on top of question banks → faster pass rates per study hour |
| **Wysebridge / PPI2Pass** | FE/PE engineering test prep with strong analytics | Mature engineering question bank, mock exams aligned to NCEES | Tighter integration across UG engineering tier → FE → PE (single learner journey) |

**Where EUREKA can credibly win in 12–18 months:**
1. **The only AI-native platform that spans HS → Professional**. Cross-tier identity, transcript, and skill graph that no incumbent offers.
2. **Adaptive question generation**: while UWorld licenses static banks, EUREKA can generate (and human-review) variants from the same blueprint — pushing per-blueprint coverage 10–100×.
3. **Institutional resale**: multi-tenant from day one means schools / bootcamps can white-label.
4. **Verifiable AI tutoring**: explanations that cite sources (pgvector RAG over licensed corpora), with a "show your work" trace — addressing the "AI hallucination" trust gap competitors haven't solved.

**Where EUREKA should NOT try to compete head-on early:**
- Building Udemy-scale instructor marketplace (network effects, takes 5+ years).
- Replacing Khan Academy's curated content (their curriculum team is a decade ahead — partner or license instead).
- Authoring proprietary medical/legal/CPA question banks from scratch (license + augment with AI variants is faster and defensible).

---

## Roadmap shape

```
Phase 3  Foundation hardening      (sessions 1–6, ~2–3 weeks)
Phase 4  Cross-tier learner spine   (sessions 7–11, ~2 weeks)
Phase 5  Content & question bank   (sessions 12–18, ~3–4 weeks)
Phase 6  AI tutor depth             (sessions 19–23, ~2–3 weeks)
Phase 7  Exam-realism + analytics  (sessions 24–28, ~2 weeks)
Phase 8  Mobile + offline           (sessions 29–32, ~2 weeks)
Phase 9  Institutional / B2B        (sessions 33–36, ~2 weeks)
Phase 10 Marketplace + creator econ (sessions 37–41, ~3 weeks)
Phase 11 Go-to-market readiness    (sessions 42–46, ~2 weeks)
```

Each phase is independently shippable. You can pause, ship the user-facing changes, gather data, then return to the next phase.

---

# Phase 3 — Foundation hardening

**Goal**: Make what already exists actually rock-solid before piling on features. Pass tests, fix duplication, secure the perimeter, get CI green, get observability in place.

## Progress

| Session | Status | Notes |
|---|---|---|
| 3.1 Reconcile service duplication | ✅ done 2026-05 | 3 overlap pairs + 1 dup api-core dir resolved. -8,152 LOC. See commit `2bfec9ec`. |
| 3.2 Test + CI baseline | ✅ done 2026-05 | Matrix CI for all 20 Python + 4 Node services; gitleaks; schema-drift check; Makefile `test-all`. Found + fixed 2 real bugs (analytics datetime, assess models). See commits `241282c4`, `736c0b45`. |
| 3.3 Auth + tenancy hardening | ✅ done 2026-05 | argon2id (with bcrypt→argon2 transparent rehash on login); TOTP MFA full enrolment + step-up + recovery codes (Fernet-encrypted at rest); 5-test cross-tenant isolation integration test (passing live); security-headers middleware (HSTS prod-only, nosniff, frame DENY, Referrer-Policy, Permissions-Policy, CSP); JWT/MFA-key fail-loud boot check in prod; SECURITY.md runbook. Caught 3 more schema-drift bugs along the way. |
| 3.4 Observability | pending | |
| 3.5 Secrets + config | pending | |
| 3.6 Frontend cleanup + design system | pending | |

## Session 3.1 — Reconcile service duplication

**Problem**: `services/ai-tutor` (TS) and `eureka/services/tutor-llm` (Python) overlap. `eureka/services/medical-school` (NestJS) and `pro-med` (FastAPI) overlap. `web-hs`, `web-ug`, `web-grad` stubs duplicate `web`.

**Deliverables**
- Pick one canonical implementation per overlap. Delete the loser.
- Migrate any unique features from the loser before deletion.
- Update docker-compose, package.json, docs/STATUS.md.

**Success criteria**
- `docker compose --profile full up -d` runs with no duplicate services.
- `make test` passes (or at least stops failing because of duplicate symbols).
- `docs/STATUS.md` accurately reflects the post-merge layout.

**Recommendation (justified in the prompt below):**
- Keep Python `tutor-llm`, drop TS `ai-tutor` (Python already integrates Claude end-to-end and has more code).
- Keep `pro-med` (FastAPI matches the rest of the stack), drop NestJS `medical-school` (port any unique modules).
- Delete `web-hs`, `web-ug`, `web-grad` stubs; use `apps/web` with `/tiers/[tier]/` dynamic routes.

## Session 3.2 — Test + CI baseline

**Deliverables**
- Per-service: minimum pytest/jest scaffolding, `/health` test, one happy-path integration test.
- `.github/workflows/ci.yml` builds every service on PR, runs tests, runs lint, fails on coverage <40%.
- Add a single repo-level `make test-all` that runs everything in parallel.

**Success criteria**: green CI badge on `main`. Coverage report uploaded to a known artifact path.

## Session 3.3 — Auth + tenancy hardening

**Deliverables**
- Replace demo seeded password with `argon2id`-hashed first-login flow.
- Add MFA (TOTP) for admin / instructor roles.
- Tenancy middleware: enforce `org_id` injection on every row write and read; add automated test that proves cross-org reads fail.
- Rotate the JWT secret on every deploy via env; document rotation procedure.

**Success criteria**: cross-tenant data leak test fails when middleware is removed. Passes when middleware is in place.

## Session 3.4 — Observability

**Deliverables**
- OpenTelemetry instrumentation on every Python service (FastAPI middleware) and Node service.
- Single OTLP collector → either local Jaeger (dev) or Honeycomb/Datadog (prod-ready toggle).
- Structured JSON logs with `request_id`, `user_id`, `org_id`, `service`.
- A Grafana / equivalent dashboard JSON committed under `eureka/monitoring/`.

**Success criteria**: from one user click in the UI you can pull the full distributed trace across api-core → tutor-llm → assess.

## Session 3.5 — Secrets + config

**Deliverables**
- Drop in `infisical`/`doppler`/`sops` (pick one) for prod secrets. Dev keeps `.env`.
- Audit all `.env.example` files; remove anything that's actually a real format example masquerading as a key.
- Document the rotation runbook in `docs/SECURITY.md`.

**Success criteria**: no secret in plaintext in any committed file, verified by `gitleaks` in CI.

## Session 3.6 — Frontend cleanup + design system

**Deliverables**
- Adopt one component library consistently (looks like shadcn/ui is mostly there — finish it).
- Build out the design tokens (colors, spacing, typography) once, in `apps/web/src/styles/tokens.css`.
- Storybook for the 30 most-used components.
- Lighthouse score ≥ 90 on the homepage + dashboard.

**Success criteria**: Storybook deployed; Lighthouse passes in CI.

---

# Phase 4 — Cross-tier learner spine

**Goal**: A single learner identity, transcript, and skill graph that follows them from HS → UG → Grad → Professional. This is the structural moat no competitor has.

## Session 4.1 — Unified learner profile

Schema + API. One `user` row, one `learner_profile`, but **N `tier_enrollments`** (a learner can be enrolled in HS while also taking a USMLE prep course). Profile collects: knowledge state, learning preferences, accessibility needs, language.

## Session 4.2 — Skill graph + competency model

A directed graph of skills/competencies (~5k nodes seeded from CCSS, NGSS, ABET, USMLE blueprint, MBE outline, MBA core, FE/PE outline). Each course, question, and content item tags into the graph. Mastery is computed per node.

## Session 4.3 — Universal transcript service

A signed, exportable JSON record (LRMI + Open Badges 3.0 compatible) of everything a learner has completed. Verifiable cryptographically. Issuable to external systems (Credly, LinkedIn).

## Session 4.4 — Cross-tier recommendation

Given the skill graph + transcript + goals: "what should I do next?" Bridges tiers (e.g., a high schooler interested in medicine sees a Pre-Med Bridge unit that pulls from UG + Pro-Med).

## Session 4.5 — Single learner UI shell

`apps/web` reorganises so the home is the learner's personal dashboard, not a tier picker. Tier UI becomes a contextual switcher inside one shell.

---

# Phase 5 — Content & question bank

**Goal**: This is where EUREKA either becomes a real platform or stays a tech demo. Content is the moat.

## Session 5.1 — Question bank schema + import pipeline

Schema that supports: stem, options, correct answer(s), explanation (long-form + sources), tags (skill graph + difficulty + Bloom's level + exam alignment + media), variant family ID, license metadata, review state.

Importers for: CCSS-tagged content, OpenStax, NCEES sample problems, FERPA-cleared institutional banks, LibreTexts, OER Commons.

## Session 5.2 — AI variant generator

For every base question: generate 5–20 variants that swap surface features (numbers, names, contexts) while preserving the underlying skill being tested. Validated by:
- AI cross-grader (two-model consensus)
- Difficulty IRT calibration after first 200 attempts
- Human SME review queue for any variant the cross-grader flags

This is the move that lets EUREKA match UWorld's bank size at 1/100th the SME cost.

## Session 5.3 — Content authoring UI

Notion-style editor with: skill graph autocomplete tagging, Bloom's level dropdown, real-time AI fact-check, attached source citations required, peer-review workflow.

## Session 5.4 — License + provenance tracking

Every content item has a license (CC-BY, proprietary, licensed-from-X). Renderer respects license (e.g., shows attribution).

## Session 5.5 — Seed HS content

Partner with / license content for the HS tier. Targets: Algebra 1/2, Geometry, Biology, Chemistry, Physics, AP US History — to be at "Khan Academy minus the brand" depth.

## Session 5.6 — Seed Med + Engineering test prep

Med: 500 USMLE Step 1 stems with explanations (purchased license + AI variants). Eng: 300 FE/PE practice problems (NCEES sample + commissioned + AI variants).

## Session 5.7 — Search + discoverability

OpenSearch with multilingual analyzers; semantic search via pgvector. Faceted by tier, skill, difficulty, license, language.

---

# Phase 6 — AI tutor depth

**Goal**: The tutor is not a chatbot. It's a Socratic teaching agent that knows the learner, knows the curriculum, and never hallucinates.

## Session 6.1 — RAG infrastructure

pgvector over the entire question bank, content library, and licensed corpora. Reranker. Citation enforcement: model output must cite a retrieved chunk or be rejected.

## Session 6.2 — Tool use for the tutor

Tools: `lookup_skill_state(user, skill_id)`, `get_question(skill_id, difficulty)`, `grade_attempt(question_id, answer)`, `recommend_next(user)`, `show_diagram(concept_id)`, `run_code(snippet)`, `simulate_circuit(...)`.

The tutor decides which tool to call. Outputs become trace logs the learner can inspect ("how did you know that?").

## Session 6.3 — Socratic mode

Default tutor behaviour is to ask leading questions, not give answers. Hint ladder: nudge → partial → full. Track which level the learner needed; feeds back into mastery.

## Session 6.4 — Anti-hallucination guardrails

- Every factual claim must trace to a citation.
- Cross-model consensus check on free-form explanations.
- Learner-facing "report a hallucination" button → SME queue.
- Live metrics: groundedness score, contradiction rate.

## Session 6.5 — Voice + multilingual

OpenAI Realtime / Anthropic voice for spoken tutoring. Real-time translation so a Spanish-speaking learner gets the same lesson as English. This is where EUREKA undercuts Khan Academy globally.

---

# Phase 7 — Exam realism + analytics

**Goal**: For test-prep tiers, learners practice in an environment **indistinguishable** from the real exam, and get analytics that beat UWorld's.

## Session 7.1 — Exam-realistic UI shells

Per-exam: USMLE (Prometric-look NBME shell), MCAT (AAMC-style), LSAT (LSAC-look), GRE, FE/PE (NCEES Pearson VUE shell), bar exam (UBE). Same keyboard shortcuts, same timer behaviour, same flag/strike-through tools.

## Session 7.2 — IRT-based scoring + scaled scores

Item Response Theory model fitted on the bank. Output a scaled score mapped to predicted real-exam score with confidence interval. Calibrate against published pass/fail thresholds.

## Session 7.3 — Granular performance analytics

Per skill: % correct, time-per-question, peer percentile, mastery trajectory. Strength/weakness map. "Most-missed topic for people who pass" — the UWorld killer feature.

## Session 7.4 — Mock exams + diagnostic test

Full-length, time-locked, IRT-balanced mocks. One-click diagnostic generates a 50-question test that estimates skill state across the whole exam.

## Session 7.5 — Spaced repetition scheduler

Anki-style scheduler tuned per learner via the mastery model. Pushes missed-and-decayed questions back at the optimal interval.

---

# Phase 8 — Mobile + offline

## Session 8.1 — React Native shell
## Session 8.2 — Offline content sync (most-recent N questions, downloaded videos)
## Session 8.3 — Native push notifications + streaks
## Session 8.4 — Apple Pencil / stylus support for math + diagram problems

---

# Phase 9 — Institutional / B2B

## Session 9.1 — Institution admin console
## Session 9.2 — LTI 1.3 + SCORM/xAPI export (sell into existing LMSs)
## Session 9.3 — Cohort analytics + at-risk early-warning
## Session 9.4 — SSO (SAML, OIDC, Google Workspace for Education)

---

# Phase 10 — Marketplace + creator economy

## Session 10.1 — Instructor signup, KYC, payout
## Session 10.2 — Course authoring v2 with revenue-share previews
## Session 10.3 — Recommendation + ranking algorithm
## Session 10.4 — Promotional engine (coupons, cohort discounts)
## Session 10.5 — Trust + safety (content moderation, takedown flow)

---

# Phase 11 — Go-to-market readiness

## Session 11.1 — Stripe + billing maturity (subs, refunds, tax, dunning, proration)
## Session 11.2 — Landing pages + SEO (programmatic per skill)
## Session 11.3 — Email lifecycle (welcome, mastery, win-back) via Resend/Customer.io
## Session 11.4 — Onboarding wizard + first-15-minute experience
## Session 11.5 — Customer support (in-app help, knowledge base, ticketing)

---

# Concrete agent prompts (one per session)

Each prompt below is **self-contained** — you can paste it into a fresh agent and it will have what it needs.

## Session 3.1 — Reconcile service duplication

```
You are working in the EUREKA monorepo at ~/Desktop/EUREKA.

Goal: Eliminate three overlapping service pairs. Pick one canonical
implementation in each case, port any unique functionality from the
loser, delete the loser, update docker-compose.yml, package.json,
and docs/STATUS.md.

Overlaps:
1. services/ai-tutor (TypeScript)  vs  eureka/services/tutor-llm (Python)
   → Keep tutor-llm (more code, full Claude integration, matches our
     Python stack). Read services/ai-tutor/src/* and port anything
     that doesn't exist in tutor-llm. Then `git rm -rf services/ai-tutor`.

2. eureka/services/medical-school (NestJS)  vs  eureka/services/pro-med (FastAPI)
   → Keep pro-med (FastAPI matches the rest of the stack). Identify
     any unique modules in medical-school (clinical case data, OSCE,
     anatomy) and port them as FastAPI routers under pro-med/app/api/.
     Then remove medical-school from compose + delete the dir.

3. eureka/apps/web-hs, web-ug, web-grad (stubs)  vs  eureka/apps/web (full)
   → web uses dynamic routes already at /tiers/[tier]/. Confirm the
     three stubs only contain READMEs / minimal package.json (no real
     code), then delete and remove from any workspace globs.

For each merge:
- Run `make test` before and after — must not regress.
- Update eureka/docker-compose.yml.
- Update eureka/package.json workspaces if needed.
- Update docs/STATUS.md to remove the deleted rows.
- Commit each merge separately with a clear chore: message.
- Push directly to main when done.

Verify at the end: `docker compose --profile full up -d` brings up
all services with no duplicate-name errors.
```

## Session 3.2 — Test + CI baseline

```
You are in ~/Desktop/EUREKA.

Goal: Establish a CI baseline that prevents future regressions.

For every service under eureka/services/* and services/* (excluding
shared/), add:
1. A pytest or jest config file if missing.
2. A test_health.py (Python) or health.test.ts (Node) that calls
   /health and asserts 200 + expected JSON shape.
3. One happy-path integration test for the primary domain object
   (e.g. assess → create assessment + grade an MCQ submission).

Then create .github/workflows/ci.yml that:
- Triggers on push and pull_request to any branch.
- Spawns Postgres+Redis services for integration tests.
- For each service: install deps, lint, run tests, produce coverage XML.
- Uploads coverage to a single artifact.
- Fails if any service's line coverage is below 40%.
- Has a "build all containers" job that runs `docker compose build`.

Also add a top-level `Makefile` target `test-all` that runs every
service's tests in parallel via GNU make -j.

Verify: open a draft PR to test the workflow, confirm green, then
push the workflow itself to main.

Coverage target this session: 40% — we'll raise it in later sessions.
```

## Session 3.3 — Auth + tenancy hardening

```
You are in ~/Desktop/EUREKA, working in eureka/api-core.

Goal: Production-grade auth and tenant isolation.

Current state: tenancy middleware exists but isn't enforced everywhere;
demo password `Admin123!` is seeded in plain text-ish; no MFA.

Tasks:
1. Replace bcrypt (if used) or any other hash with argon2id (use
   passlib[argon2]). Rehash on next login for existing users via
   transparent upgrade.
2. Add TOTP MFA: `/api/v1/auth/mfa/setup`, `/verify`, `/disable`.
   Required for admin and instructor roles. Use pyotp. Store
   encrypted secret with a KMS-style envelope (Fernet keyed by env
   MFA_ENVELOPE_KEY).
3. Audit every router under eureka/api-core/app/api/. Verify each
   route either explicitly opts out (public) or runs the tenancy
   middleware. Add a test in tests/test_tenancy_isolation.py that
   creates two orgs with their own records and asserts org A cannot
   read org B's data via any GET/PATCH/DELETE endpoint.
4. Rotate JWT_SECRET on every container start in dev, document
   manual rotation for prod in docs/SECURITY.md.
5. Add a security headers middleware (HSTS, X-Content-Type-Options,
   X-Frame-Options, CSP).

Success: the cross-tenant test must FAIL when tenancy middleware is
temporarily disabled (proves it's actually enforced) and PASS when
re-enabled. Push to main.
```

## Session 3.4 — Observability

```
You are in ~/Desktop/EUREKA.

Goal: Distributed tracing + structured logs + a dev dashboard.

Tasks:
1. Add OpenTelemetry to every Python service:
   - opentelemetry-instrumentation-fastapi
   - opentelemetry-instrumentation-sqlalchemy
   - opentelemetry-instrumentation-redis
   - opentelemetry-instrumentation-httpx
   - opentelemetry-exporter-otlp
   Config via env: OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_SERVICE_NAME.
2. Add OpenTelemetry to Node services (services/notebook, xr-labs):
   @opentelemetry/auto-instrumentations-node.
3. Add a Jaeger service to eureka/docker-compose.yml behind a
   `profile: dev-obs`, listening on :16686 (UI) and :4317 (OTLP gRPC).
4. Replace any print()/console.log() inside request handlers with a
   structured logger that emits JSON with at minimum:
   {timestamp, level, service, request_id, user_id, org_id, message}.
   Use structlog (Python) and pino (Node).
5. Commit a Grafana dashboard JSON to eureka/monitoring/dashboards/
   for: requests/sec by service, p50/p95/p99 latency, error rate,
   AI cost per request.

Verify: click around the web app, then open Jaeger and find the
trace for one user action that spans api-core → tutor-llm → assess.
Screenshot, commit it to docs/observability-demo.png. Push to main.
```

## Session 3.5 — Secrets + config

```
You are in ~/Desktop/EUREKA.

Goal: No plaintext secrets in source. Working secret rotation runbook.

Decision: use Mozilla SOPS with age encryption. Cheap, no vendor
lock-in, works fine for a team of <50.

Tasks:
1. Install sops in CI and document local install (Homebrew).
2. Generate an age keypair, commit the public key, store the private
   key in 1Password / wherever — document this in docs/SECURITY.md.
3. Create secrets/{dev,staging,prod}.enc.yaml encrypted with sops+age.
4. Update every service to read secrets at boot via a thin
   `app/config.py` wrapper that decrypts the sops file.
5. Run gitleaks in CI; fail on any finding.
6. Audit all .env.example files: any value that looks like a real key
   format (sk-ant-..., sk-proj-...) replaced with `<paste-your-key>`.
7. Document rotation procedure in docs/SECURITY.md: how to rotate
   ANTHROPIC_API_KEY, JWT_SECRET, DB password, MinIO keys without
   downtime.

Verify: gitleaks finds nothing. Spin up the stack using only the
decrypted secrets — no .env required. Push to main.
```

## Session 3.6 — Frontend cleanup + design system

```
You are in ~/Desktop/EUREKA/eureka/apps/web.

Goal: One coherent design system. Storybook. Lighthouse ≥ 90.

Audit src/components/ for inconsistent component libraries
(some shadcn, some custom, some headlessui mixes). Pick shadcn/ui
as the canonical library and migrate everything to it. Delete
duplicates.

Tasks:
1. Define design tokens in src/styles/tokens.css: colors (light/dark),
   spacing scale, type scale, radii, shadows. Wire via Tailwind theme.
2. Migrate any non-shadcn buttons, inputs, dropdowns, dialogs, etc.
3. Add Storybook 8 (Next.js + Vite). Stories for the 30 most-used
   components. Deploy via Chromatic or to gh-pages.
4. Add Playwright accessibility tests (@axe-core/playwright) for the
   home, dashboard, and one tier page.
5. Lighthouse CI in GitHub Actions on every PR; fail if any of
   performance, accessibility, best-practices < 90.

Success: Storybook is deployed at a known URL (commit it to README).
Lighthouse passes in CI. Push to main.
```

## Sessions 4.x — Cross-tier learner spine

> Prompts for Sessions 4.1–4.5 are intentionally left as outlines below.
> Each will be expanded into a self-contained prompt at the start of Phase 4,
> when we know the actual schema choices made during Phase 3.

- **4.1** Define `learner_profile`, `tier_enrollment`, `learner_consent`
  schemas in a fresh Alembic migration. Build CRUD in api-core.
- **4.2** Seed skill graph from CCSS + NGSS + ABET + USMLE blueprint
  + MBE outline + MBA core + FE/PE outline. Use Postgres ltree or
  recursive CTE. Build skill-tagging API for content + questions.
- **4.3** Universal Transcript service. Sign with Ed25519. Emit Open
  Badges 3.0 JSON-LD. Provide `/transcript/{user_id}.json` and
  `/transcript/{user_id}.verify`.
- **4.4** Recommender. Hybrid: matrix factorization on completion data
  + graph-aware scoring against the skill graph + LLM rerank for
  "explain why this is next".
- **4.5** Reshape `apps/web` so the root is the unified dashboard;
  tier UI is a contextual switcher.

## Sessions 5.x — Content & question bank

- **5.1** Question bank schema (Postgres + S3 for media) and importers
  for OpenStax, LibreTexts, OER Commons, NCEES sample.
- **5.2** Variant generator: a pipeline with three stages —
  (a) Claude generates N variants from a base question + skill spec;
  (b) Cross-grader pass (Claude + GPT-4) for each variant grades the
  variant against the same skill rubric;
  (c) IRT calibration after first 200 learner attempts; outliers go
  to human SME queue.
- **5.3** Content authoring app at `eureka/apps/web/src/app/author/`
  (admin role only). Notion-style editor (use TipTap), AI fact-check
  inline, source citations enforced.
- **5.4** License + provenance schema + renderer respect.
- **5.5** HS content seed (license vs. partner — recommend
  Saylor + LibreTexts initially for cost).
- **5.6** USMLE seed (license, e.g., AMBOSS-style partner, + AI
  variants) and FE seed (commission + NCEES sample + AI variants).
- **5.7** Search service: OpenSearch index over content + pgvector
  index over the same. Hybrid retrieval.

## Sessions 6.x — AI tutor depth

- **6.1** RAG infra: indexing pipeline + retrieval API + reranker
  (Cohere Rerank or BGE-rerank locally) + citation enforcement.
- **6.2** Tool-use tutor: define the 6+ tools listed in Phase 6.
  Tutor is a Claude tool-use loop with explicit termination conditions.
- **6.3** Socratic mode: hint ladder controlled by a learner-state
  prompt, plus instrumentation on which hint level was needed.
- **6.4** Anti-hallucination: groundedness checker (NLI-style),
  contradiction detector, learner report queue → SME triage.
- **6.5** Voice via OpenAI Realtime (or Anthropic when GA), live
  translation via Claude's multilingual capability or a dedicated
  translation pass.

## Sessions 7.x — Exam realism + analytics

- **7.1** Per-exam shell components in `apps/web/src/app/exam/[exam_type]/`.
  Replicate keyboard shortcuts, timer behaviour, flag/strike tools.
- **7.2** 2-PL IRT fit via `py-irt` or `mirt`; calibrate ability
  estimates against published pass thresholds.
- **7.3** Analytics dashboard: per-skill mastery, time-per-q, percentile,
  "most-missed by passers".
- **7.4** Mock exam generator that balances item difficulty by IRT.
- **7.5** Spaced repetition: FSRS or SM-2 scheduler in a dedicated
  service, called from the dashboard's "due today" widget.

## Sessions 8.x – 11.x

See section headings above. Detailed prompts will be authored at the
start of each phase, when the platform's actual contours are clearer.
A roadmap that prescribes Session 11.2 in detail today is fiction;
the closer we get, the more accurate the prompts will be.

---

# How to use this roadmap

1. **Don't try to do everything in parallel.** Each phase ends in a
   demoable state; resist the urge to skip ahead.
2. **One session ≈ one PR ≈ one demo.** If a session sprawls past 3
   days of agent work, split it.
3. **After each phase, re-read `docs/STATUS.md` and update it.** That
   doc is the source of truth, not these aspirational sections.
4. **Hire SMEs before Phase 5.** Medical, legal, engineering, K-12.
   AI variants are great but the base questions must be expert-authored
   for credibility. Budget for this.
5. **Get one tier shipping real value to real users by end of Phase 7.**
   Recommend MCAT or FE/PE as the beachhead — narrow, high-willingness-
   to-pay, AI advantage is most defensible there.

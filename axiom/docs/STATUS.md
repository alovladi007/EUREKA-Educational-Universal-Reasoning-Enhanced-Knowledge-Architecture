# AXIOM Status

This is the honest, calibrated status of AXIOM. AXIOM has completed Phase 0 (foundation), Phase 1 (the learning-and-assessment core), Phase 2 (adaptive testing, analytics, gamification, richer item types, QTI), and the Copilot core of Phase 3. Later-phase modules are placeholders. Nothing planned is described here as done.

Legend:
- **done**: implemented and tested at the level this phase requires.
- **scaffold**: a placeholder exists (package boundary, health route, stub, or minimal wiring). Not feature-complete.
- **planned**: not built yet. The target phase is noted.

## What works today

A signed-in EUREKA user can be placed, follow a prerequisite-aware path, practice CAS-graded items across a wide range of question types, take an adaptive test, earn XP and badges, and ask an AI-assisted copilot for hints and explanations grounded in their lessons. A teacher can author an assessment, assign it, read per-student results, mine item analytics, and export them. Concretely:

- A signed-in EUREKA user reaches the AXIOM dashboard. The web app reads the EUREKA-issued JWT from the browser and sends it to the AXIOM API; with no valid token it points the user at EUREKA login. A gated dev-login allows direct local access.
- A real algebra skill graph (six nodes with prerequisites), a lesson per node, and an item bank of static items plus parameterized templates are seeded.
- Practice loop: the adaptive engine recommends the next node by prerequisites and mastery, serves a question (resolving a per-student variant for templates), grades it, and updates mastery.
- Grading uses SymPy symbolic equivalence, numeric tolerance, and equation equivalence, not string matching. Question types include selection, numeric, math expression, equation, multi-select, true/false, short text, plot-points, and show-your-work with per-milestone step credit.
- Mastery is Bayesian Knowledge Tracing with an append-only evidence trail, so every change is explainable.
- Computerized adaptive testing on an IRT (3PL) backbone: EAP ability estimation, maximum-information item selection, and a standard-error stopping rule, plus classical-test-theory item calibration into IRT parameters.
- Analytics: per-item classical statistics with IRT parameters, a cohort standards heatmap, per-learner growth, and CSV and PDF exports.
- Gamification: XP, levels, streaks, and badges awarded strictly for genuine progress (correct responses and mastery gains), never idle time.
- Copilot: an AI-assisted tutor that gives hints, explanations, and grounded chat. Reasoning sits behind a swappable provider (EUREKA reasoning client with a deterministic mock fallback per ADR 0001). Every reply is labeled AI-assisted, carries the curriculum sources it was grounded in, and is teacher-overridable. Hints for an active item withhold the answer.
- Free-response AI grading: constructed text answers are graded against a rubric by the same swappable reasoning provider, with per-criterion partial credit and a confidence. Every AI grade is labeled and human-overridable; a teacher can review the queue of AI-graded responses and override any grade of record. This grading runs on the Celery worker off the request path (the client polls for the result), with an inline fallback if the broker is unavailable so an answer is never lost.
- QTI 3.0 import and export of items and item banks.
- Teacher flow: create an assessment from nodes, assign to students, deliver it, and view aggregated results.
- Health and readiness probes, Prometheus metrics, structured JSON logs, and OpenAPI are served.
- Database migrations run under Alembic (`alembic upgrade head`), verified up and down on SQLite and Postgres, with a schema-drift check that comes back clean.

## Not built yet

These are explicitly not implemented:

- Live tutoring with shared whiteboard, video, and recording (Phase 3). This needs a real-time media server (WebRTC/SFU) that is out of scope for the current build; the copilot ships without it.
- AI grading of handwritten and image responses (Phase 3). Free-response text grading against a rubric is built (labeled and teacher-overridable); handwritten and image work needs a vision model and is not built.
- Proctoring, LTI 1.3, OneRoster, LMS grade passback, and district analytics (Phase 4).
- Email and push notification delivery. In-app notifications are built (inbox, unread badge, emitted on assignment, badge, and grade override); sending them over email or push is not built.
- Item and variant generation on the worker, and worker-side analytics rollups, are not built. The Celery worker does now grade AI free-response answers off the request path (see below); other grading runs inline because it is fast.
- Semantic (pgvector) retrieval for the copilot. Grounding today is deterministic lexical retrieval; vector embeddings are a future upgrade behind the same retriever interface.

## Per-module status

| Module | Status | Target phase | Notes |
|---|---|---|---|
| api-gateway | done | Phase 0 | FastAPI app factory, health and readiness, metrics, OpenAPI, tracing hook, versioned routers. |
| identity_eureka | done | Phase 0 | Verifies EUREKA JWTs (HS256 dev, JWKS-ready interface); syncs the user and roles on first touch. |
| math_core (package) | done | Phase 0 | SymPy symbolic equivalence, safe parsing (no eval), wall-clock timeout, deterministic parameterized-item resolver, tests. |
| curriculum | done | Phase 1 | Standards framework, skill graph, objectives. Seeded algebra graph. |
| content | done | Phase 1 | Lessons and content steps per node. |
| assessment | done | Phase 1, richer kinds and QTI in Phase 2 | Item bank, static items, parameterized templates and variants, assessments, forms, assignment, delivery. Phase 2 adds richer item kinds, item.meta, and QTI 3.0 import and export. |
| grading | done | Phase 1, extended in Phase 2 and 3 | Selection, numeric, math expression and equation (SymPy), plus multi-select, true/false, short text, plot-points, and show-your-work step credit. Phase 3 adds rubric-based AI grading of free-response text (via the reasoning provider) with a teacher override queue. Writes grader plus confidence and a reasoning trace. Runs inline. |
| adaptive | done | Phase 1 (BKT), Phase 2 (IRT/CAT) | BKT mastery with evidence and prerequisite-aware path planning; IRT 3PL model, computerized adaptive testing, and item calibration. |
| analytics | done | Phase 2 | Item statistics with IRT, standards heatmap, growth, CSV and PDF exports. |
| gamification | done | Phase 2 | XP, levels, streaks, badges tied to real progress. Live game-show mode is not built. |
| copilot | done (core) | Phase 3 | AI-assisted hints, explanations, and grounded chat behind a swappable reasoning provider with a mock fallback (ADR 0001). Labeled and teacher-overridable. The same provider grades free-response text against a rubric. Handwritten and image grading are not built. |
| tutoring | planned | Phase 3 | Shared whiteboard, video, recording. Needs a media server; not built. |
| proctoring | planned | Phase 4 | Lockdown, integrity signals, review workflow. |
| integrations | planned | Phase 4 | LTI 1.3, OneRoster, gradebook passback. QTI item exchange is done in Phase 2. |
| notifications | done (in-app) | Phase 2 roadmap | In-app inbox and unread badge, emitted on assignment, badge earned, and AI-grade override. Email delivery is not built. |

## Frontend and infra

| Item | Status | Notes |
|---|---|---|
| Web dashboard (Next.js 14) | done | Dashboard plus Learn, Practice, Mastery, Path, Teacher, Adaptive Test, Achievements, Analytics, and Copilot pages against the live API. |
| Docker Compose | done | api (8400), web (4100), Postgres with pgvector (5441), Redis (6392), worker, beat, observability profile. |
| Alembic migrations | done | Six migrations, verified up and down on Postgres with a clean schema-drift check. |
| OpenAPI | done | Generated and served at /docs and /openapi.json. |
| CI | done | ruff, math_core and api pytest, Alembic up and down on Postgres, frontend tsc and build. |

## How to read this file

If a row says planned, treat it as not existing. If a row says scaffold, treat it as a boundary plus a stub, not a feature. Only rows marked done are implemented and tested. This file is updated at the close of every phase.

# AXIOM Status

This is the honest, calibrated status of AXIOM. AXIOM has completed Phase 0 (foundation) and Phase 1 (the learning-and-assessment core, the true MVP). Later-phase modules are placeholders. Nothing planned is described here as done.

Legend:
- **done**: implemented and tested at the level this phase requires.
- **scaffold**: a placeholder exists (package boundary, health route, stub, or minimal wiring). Not feature-complete.
- **planned**: not built yet. The target phase is noted.

## What works today

A signed-in EUREKA user can be placed, follow a prerequisite-aware path, practice CAS-graded items, and watch mastery move with the evidence recorded. A teacher can author an assessment from skill nodes, assign it, and read per-student results. Concretely:

- A signed-in EUREKA user reaches the AXIOM dashboard. The web app reads the EUREKA-issued JWT from the browser and sends it to the AXIOM API; with no valid token it points the user at EUREKA login.
- A real algebra skill graph (six nodes with prerequisites), a lesson per node, and an item bank of static items plus parameterized templates are seeded.
- Practice loop: the adaptive engine recommends the next node by prerequisites and mastery, serves a question (resolving a per-student variant for templates), grades it, and updates mastery.
- Grading uses SymPy symbolic equivalence, numeric tolerance, and equation equivalence, not string matching. Several equivalent correct forms all grade correct.
- Mastery is Bayesian Knowledge Tracing with an append-only evidence trail, so every change is explainable (which response moved it, and the probability before and after).
- Teacher flow: create an assessment from nodes, assign to students, deliver it (per-student variants), and view aggregated results.
- Health and readiness probes, Prometheus metrics, structured JSON logs, and OpenAPI are served.
- Database migrations run under Alembic (`alembic upgrade head`), verified up and down on SQLite and Postgres.

## Not built yet

These are explicitly not implemented after Phase 1:

- Computerized adaptive testing on an IRT backbone and item calibration (Phase 2).
- Analytics: item difficulty and discrimination, standards heatmaps, growth reports, exports (Phase 2).
- The full technology-enhanced question-type set beyond selection and math (graphing, drag-drop, show-your-work step credit) and QTI import and export (Phase 2).
- Gamification, the AI copilot, live tutoring, handwritten and free-response AI grading (Phase 3).
- Proctoring, LTI, OneRoster, LMS grade passback, district analytics (Phase 4).
- The Celery worker still ships only the sample task; grading in Phase 1 runs inline in the request path. Moving heavy grading and generation onto the worker is a later step.

## Per-module status

| Module | Status | Target phase | Notes |
|---|---|---|---|
| api-gateway | done | Phase 0 | FastAPI app factory, health and readiness, metrics, OpenAPI, tracing hook, versioned routers. |
| identity_eureka | done | Phase 0 | Verifies EUREKA JWTs (HS256 dev, JWKS-ready interface); syncs the user and roles on first touch. |
| math_core (package) | done | Phase 0 | SymPy symbolic equivalence, safe parsing (no eval), wall-clock timeout, deterministic parameterized-item resolver, tests. |
| curriculum | done | Phase 1 | Standards framework, skill graph (nodes, prerequisite and related edges), objectives. Seeded algebra graph. |
| content | done | Phase 1 | Lessons and content steps per node. Seeded one lesson per node. |
| assessment | done | Phase 1 | Item bank, static items, parameterized templates and resolved variants, assessments, forms, assignment, delivery. |
| grading | done | Phase 1 | Selection, numeric (tolerance), math expression and equation (SymPy). Writes grader plus confidence and a reasoning trace. Runs inline; worker offload is later. |
| adaptive | done (BKT) | Phase 1, CAT in Phase 2 | BKT mastery with append-only evidence, prerequisite-aware path planning, review-schedule table. IRT and computerized adaptive testing are Phase 2. |
| analytics | planned | Phase 2 | Mastery rollups, item statistics, standards heatmaps, exports. Event schema (packages/events) exists. |
| tutoring | planned | Phase 3 | Shared whiteboard, video, recording. |
| copilot | planned | Phase 3 | Calls EUREKA reasoning first via a swappable interface, mock fallback in dev (see ADR 0001). AI features labeled and human-overridable. |
| gamification | planned | Phase 2 | Streaks, XP, badges, live game-show mode. |
| proctoring | planned | Phase 4 | Lockdown, integrity signals, review workflow. |
| integrations | planned | Phase 4 | LTI 1.3, OneRoster, QTI, gradebook passback. |
| notifications | planned | Phase 2 | Email, in-app messaging, assignment reminders. |

## Frontend and infra

| Item | Status | Notes |
|---|---|---|
| Web dashboard (Next.js 14) | done (Phase 1) | Dashboard plus Learn, Practice, Mastery, Path, and Teacher pages against the live API. |
| Docker Compose | done | api (8400), web (4100), Postgres with pgvector (5440), Redis (6390), worker, beat, observability profile. |
| Alembic migrations | done | Two migrations, verified up and down on SQLite and Postgres. |
| OpenAPI | done | Generated and served at /docs and /openapi.json. |
| CI | done | ruff, math_core and api pytest, Alembic up and down on Postgres, frontend tsc and build. |

## How to read this file

If a row says planned, treat it as not existing. If a row says scaffold, treat it as a boundary plus a stub, not a feature. Only rows marked done are implemented and tested. This file is updated at the close of every phase.

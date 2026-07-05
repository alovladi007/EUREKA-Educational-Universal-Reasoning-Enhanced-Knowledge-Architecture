# AXIOM Status

This is the honest, calibrated status of AXIOM. AXIOM is at Phase 0, the foundation. Most modules are placeholders. Nothing planned is described here as done.

Legend:
- **done**: implemented and tested at the level this phase requires.
- **scaffold**: a placeholder exists (package boundary, health route, stub, or minimal wiring). Not feature-complete.
- **planned**: not built yet. The target phase is noted.

## What works today

A signed-in EUREKA user can reach an empty AXIOM dashboard, and the foundation pieces below are real:

- A signed-in EUREKA user reaches an empty AXIOM dashboard. The web app reads the EUREKA-issued JWT from the browser and sends it to the AXIOM API; with no valid token it points the user at EUREKA login.
- Health checks respond (liveness and version).
- OpenAPI is generated and served by the API gateway.
- Database migrations run under Alembic (`alembic upgrade head`).
- `math_core` performs symbolic grading (SymPy symbolic equivalence with safe, no-`eval` parsing and a wall-clock timeout) and has tests.

## Not built yet

These are explicitly not implemented at Phase 0:

- The math skill graph (curriculum).
- The item bank and parameterized items (content), beyond what `math_core` needs to grade.
- Assignment and mock-exam delivery (assessment).
- The end-to-end grading pipeline in sandboxed Celery workers (the `math_core` logic exists; the worker pipeline around it is not wired).
- The mastery model, spaced repetition, and mastery analytics (adaptive/analytics).
- Computerized adaptive testing (adaptive).
- Proctoring, tutoring, gamification, the copilot, integrations, and notifications.

## Per-module status

| Module | Phase 0 status | Target phase | Notes |
|---|---|---|---|
| api-gateway | scaffold | Phase 0 | FastAPI app factory, health route, OpenAPI, EUREKA JWT verification wiring. |
| identity_eureka | scaffold | Phase 0 | Verifies EUREKA JWTs (HS256 dev, JWKS-ready interface); user/role/enrollment sync is stubbed and expands in Phase 1. |
| math_core (package) | done | Phase 0 | SymPy symbolic equivalence, safe parsing (no `eval`), wall-clock timeout, tests. Backs the grading module. |
| grading | scaffold | Phase 1 | `math_core` provides the logic; the sandboxed Celery worker pipeline, step credit, and item wiring are Phase 1. |
| curriculum | planned | Phase 1 | Math skill graph: skills, prerequisites, standards alignment. |
| content | planned | Phase 1 | Item bank, parameterized items, worked solutions, hints, media. |
| assessment | planned | Phase 1 | Assignments, quizzes, mock exams, blueprints, delivery. |
| adaptive | planned | Phase 2 | IRT backbone (2PL/3PL), calibration, max-information selection, standard-error stopping (see ADR 0004). |
| analytics | planned | Phase 2 | Mastery rollups, item statistics, cohort and standards reporting. |
| (mastery model) | planned | Phase 2 | BKT baseline, DKT option behind the same interface, SM-2/FSRS scheduling, evidence per change (see ADR 0003). Lives across adaptive/analytics. |
| tutoring | planned | Phase 3 | Guided practice, step-by-step help, worked-example scaffolding. |
| copilot | planned | Phase 3 | Calls EUREKA reasoning first via a swappable interface, mock fallback in dev (see ADR 0001). AI features labeled and human-overridable. |
| gamification | planned | Phase 3 | Streaks, XP, badges, goals, spaced-repetition prompts. |
| proctoring | planned | Phase 4 | Lockdown, integrity signals, review workflow for high-stakes delivery. |
| integrations | planned | Phase 4 | LTI, rostering, gradebook passback, export and import. |
| notifications | planned | Phase 4 | Email, push, and in-app messaging. |

## Frontend and infra

| Item | Phase 0 status | Notes |
|---|---|---|
| Web dashboard (Next.js 14) | scaffold | Empty dashboard, reads EUREKA JWT, renders module cards showing available versus planned. |
| Docker Compose | scaffold | api (8400), web (4100), Postgres (5440), Redis (6390). |
| Alembic migrations | done | Migration environment runs; `alembic upgrade head` applies. |
| OpenAPI | done | Generated and served at `/docs`. |
| CI | scaffold | Test and lint wiring expands as modules land. |

## How to read this file

If a row says planned, treat it as not existing. If a row says scaffold, treat it as a boundary plus a stub, not a feature. Only rows marked done are implemented and tested. This file is updated at the close of every phase.

# AXIOM

**Adaptive eXpert Instruction and Outcome Measurement** - the mathematics vertical of the EUREKA platform.

AXIOM is a math teaching, practice, and assessment platform. It brings the best capabilities of Khan Academy, IXL, Edulastic, ExamSoft, Desmos, DeltaMath, myOpenMath, ASSISTments, and Renaissance Star into one skill graph, one item bank, one mastery model, and one analytics layer, built on top of EUREKA's reasoning and knowledge core.

> **Status (Phase 0, foundation).** This repository is at the foundation stage. What exists today is a scaffold: a set of service placeholders, a working symbolic-grading core (math_core) with tests, an empty AXIOM dashboard that verifies an EUREKA-issued token, health checks, OpenAPI, and database migrations. Everything beyond that is planned and sequenced. See [docs/STATUS.md](docs/STATUS.md) for the honest per-module status. Nothing planned is described here as done.

---

## What AXIOM is (and how it relates to EUREKA)

AXIOM extends EUREKA. It does not replace it.

EUREKA owns identity, the reasoning core, and the wider learning platform. AXIOM plugs in as a vertical focused on mathematics. Concretely:

- **AXIOM does not run its own password system.** It verifies EUREKA-issued JWTs and syncs users, roles, and enrollments from EUREKA. See [docs/adr/0001-eureka-integration.md](docs/adr/0001-eureka-integration.md).
- **AXIOM's copilot calls EUREKA's reasoning core first**, through a swappable interface with a mock fallback for local development.
- **AXIOM adds the math-specific layers** EUREKA does not have: a math skill graph, a math item bank with parameterized items, symbolic grading, a mastery model, adaptive testing, and a math analytics layer.

The architecture is a modular monolith today (FastAPI plus Next.js 14 plus Postgres/pgvector plus Redis plus Celery), moving toward microservices-lite as modules mature. Modules are separated by clear boundaries now so they can be split out later without a rewrite.

---

## Service map

Each row is a module within the modular monolith. The Phase 0 status column is honest: `scaffold` means a placeholder exists (package boundary, health route, or stub) and `planned` means it has not been built yet.

| Service | One-line purpose | Phase 0 status |
|---|---|---|
| api-gateway | FastAPI app factory, routing, health, OpenAPI, EUREKA JWT verification | scaffold |
| identity_eureka | Verify EUREKA JWTs, sync users, roles, and enrollments (no local passwords) | scaffold |
| curriculum | Math skill graph: skills, prerequisites, standards alignment | planned |
| content | Item bank: parameterized items, worked solutions, hints, media | planned |
| assessment | Assignments, quizzes, mock exams, blueprints, delivery | planned |
| grading | SymPy symbolic equivalence, numeric tolerance, step credit, sandboxed workers | scaffold |
| adaptive | IRT-backed computerized adaptive testing (item selection, stopping rule) | planned |
| proctoring | Lockdown, integrity signals, review workflow for high-stakes delivery | planned |
| tutoring | Guided practice, step-by-step help, worked-example scaffolding | planned |
| gamification | Streaks, XP, badges, goals, spaced-repetition prompts | planned |
| copilot | Math copilot that calls EUREKA reasoning first, mock fallback in dev | planned |
| analytics | Mastery rollups, item statistics, cohort and standards reporting | planned |
| integrations | LTI, rostering, gradebook passback, export and import | planned |
| notifications | Email, push, and in-app messaging for assignments and reminders | planned |

The one module with real logic today is `grading`, backed by the `math_core` package (symbolic equivalence and safe parsing, with tests). Everything else is a boundary and a stub, ready to be built out in the phases below.

---

## Tech stack

**Backend**
- Python 3.12
- FastAPI (HTTP API, OpenAPI generation)
- Pydantic v2 (schemas and settings, the source of truth for shapes)
- SQLAlchemy 2.0 (ORM)
- Alembic (migrations, one per schema change)
- Postgres 16 with pgvector (relational data plus vector search)
- Redis (cache, queues, rate limiting)
- Celery (sandboxed grading workers and background jobs)
- SymPy (symbolic math for grading and parameterized items)

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- MathLive (math input)
- KaTeX (math rendering)

---

## Repository layout

```
axiom/
  apps/            Frontend and any standalone apps
    web/           Next.js 14 dashboard (App Router, TypeScript, Tailwind)
  services/        Backend modules of the modular monolith
                   (api-gateway, identity_eureka, curriculum, content,
                    assessment, grading, adaptive, proctoring, tutoring,
                    gamification, copilot, analytics, integrations, notifications)
  packages/        Shared, importable Python packages
    math_core/     SymPy-based symbolic grading and parameterized-item core (has tests)
  db/              Alembic environment and versioned migrations
  infra/           Docker Compose, Dockerfiles, local infra config
  tests/           Cross-module and integration tests
  openapi/         Generated OpenAPI documents and API contract artifacts
  docs/            Documentation, ADRs, and the honest STATUS report
    adr/           Architecture Decision Records (numbered)
    STATUS.md      Per-module status, calibrated
    coding-standards.md
```

Not every directory is fully populated at Phase 0. The layout is fixed now so that later phases add code into known places rather than reshuffling.

---

## Quickstart

Requires Docker and Docker Compose. Node and Python toolchains are needed only if you run a service outside its container.

```bash
# From the axiom/ directory
docker compose up
```

**Default ports.**

| Component | Port |
|---|---|
| API (api-gateway) | 8400 |
| Web (Next.js dashboard) | 4100 |
| Postgres | 5440 |
| Redis | 6390 |

These ports are deliberately offset from EUREKA's defaults so AXIOM and EUREKA can run side by side on one machine.

**Health and API docs.**

```bash
curl http://localhost:8400/health         # liveness and version
open  http://localhost:8400/docs           # OpenAPI (Swagger UI)
```

**Run database migrations.**

```bash
# Apply all migrations to the running Postgres
docker compose run --rm api alembic upgrade head

# Create a new migration after a model change
docker compose run --rm api alembic revision --autogenerate -m "describe change"
```

**Run tests.**

```bash
# math_core unit tests (symbolic grading), run from the package
docker compose run --rm api pytest packages/math_core

# Full backend test suite
docker compose run --rm api pytest
```

**Sign in.** AXIOM does not have its own login. Sign in through EUREKA, which stores a JWT in the browser. The AXIOM web app reads that token and sends it to the AXIOM API. Point the web app at your EUREKA login via `NEXT_PUBLIC_EUREKA_LOGIN_URL` and at the AXIOM API via `NEXT_PUBLIC_AXIOM_API_URL`.

---

## Phased delivery plan

The plan below is honest and sequenced. Phase 0 and Phase 1 together are the true first milestone: a signed-in EUREKA user reaching a working, if minimal, math practice loop with real grading. Later phases are planned, not built.

- **Phase 0 - Foundation (current).** Service scaffolds and clear module boundaries, api-gateway with health and OpenAPI, EUREKA JWT verification, user/role/enrollment sync, the empty AXIOM dashboard, database migrations, and the math_core symbolic-grading package with tests. This is what exists.

- **Phase 1 - First learning loop.** The math skill graph (curriculum), a first parameterized item bank (content), assignment delivery (assessment), and end-to-end symbolic grading in sandboxed Celery workers (grading). Goal: a signed-in EUREKA user completes real math items and gets correct, symbolic grading with step credit. Phase 0 plus Phase 1 is the first shippable slice.

- **Phase 2 - Mastery and adaptivity.** The mastery model (Bayesian Knowledge Tracing baseline, spaced repetition), the analytics rollups it feeds, and adaptive testing on an IRT backbone (adaptive). Every mastery change and every adaptive decision records its evidence. See the ADRs in `docs/adr/`.

- **Phase 3 - Teaching and engagement.** Tutoring and guided practice, the math copilot on top of EUREKA reasoning, and gamification. All AI features are labeled and human-overridable.

- **Phase 4 - Institutional and high-stakes.** Proctoring for high-stakes delivery, integrations (LTI, rostering, gradebook passback), and notifications. This is where AXIOM meets institutional workflows.

Each phase closes with updated ADRs where decisions changed, a refreshed [docs/STATUS.md](docs/STATUS.md), and migrations for any schema change.

---

## Documentation

- [docs/STATUS.md](docs/STATUS.md) - honest per-module status and the what-works-today list.
- [docs/coding-standards.md](docs/coding-standards.md) - the standards every change follows.
- [docs/adr/0001-eureka-integration.md](docs/adr/0001-eureka-integration.md) - how AXIOM integrates with EUREKA.
- [docs/adr/0002-grading-cas.md](docs/adr/0002-grading-cas.md) - symbolic math grading.
- [docs/adr/0003-mastery-model.md](docs/adr/0003-mastery-model.md) - the mastery model.
- [docs/adr/0004-cat-irt.md](docs/adr/0004-cat-irt.md) - adaptive testing.

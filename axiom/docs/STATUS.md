# AXIOM Status

This is the honest, calibrated status of AXIOM. AXIOM has completed Phase 0 (foundation), Phase 1 (the learning-and-assessment core), Phase 2 (adaptive testing, analytics, gamification, richer item types, QTI), and most of Phase 3 (copilot hints/explanations/chat, free-response AI grading, item generation with a human-review queue, and a teacher assistant). A base-platform completion pass then closed the biggest gaps against the build prompt: a real math UI (MathLive input, KaTeX rendering), an interactive graphing toolkit, a Content Studio for authoring, SymPy-verified worked solutions, more question types, SM-2 spaced repetition, and semantic/hybrid grounding retrieval. Phase 4 (proctoring, LTI/OneRoster), live tutoring, and handwritten grading remain. Nothing planned is described here as done.

### Base-platform completion waves (delivered)

- **Real math UI.** MathLive equation input and KaTeX rendering across practice, learn, copilot, review, and the adaptive test. Math is no longer plain text; prompts render, and math/equation/numeric answers use a real editor. The grader now reads `^` as exponentiation. Accessible math (MathML alongside the visual render).
- **Interactive graphing.** A Mafs coordinate plane: click-to-plot points, a two-point line drawer, and a live function-graph preview driven by a safe local expression evaluator. New gradable kinds `plot_function` (CAS) and `draw_line` (line-through-points vs a reference line).
- **Content Studio.** Teachers author and edit items from the UI (kind-aware editor, options editor, live KaTeX prompt preview, difficulty, standards node) with a Test-grade panel that runs the production grader on a sample answer. Backed by a role-gated authoring API.
- **Worked solutions.** `math_core.solutions` verifies each line of a worked solution against the CAS and generates verified steps for a linear equation. Shown to students after answering (re-verified), and available in the Studio (generate/verify).
- **More question types.** `ordering` (reorder shuffled steps, with an accessible up/down input) and `matching` (exact pairing), both deterministic.
- **Item generation + review queue.** The copilot generates CAS-verified candidate items (parameterized linear/sum/factoring). They land in a pending review queue; approval creates a real Item, rejection discards. Nothing enters a bank without human sign-off.
- **Teacher assistant.** Draft a quiz, explain a class-wide error pattern, or suggest an intervention, grounded in the node's material and labeled AI-assisted.
- **Spaced repetition.** SM-2 wired to the ReviewSchedule: mastered nodes are scheduled at growing intervals (sooner after a lapse); the learning-path page surfaces due reviews.
- **Semantic retrieval.** Copilot grounding is now configurable lexical / semantic / hybrid (default hybrid) over deterministic local embeddings, so related word forms surface without a hosted model (ADR 0006).

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
- Review: a learner can review their recent incorrect answers with the correct answer and the explanation, closing the loop from practice back into study.
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

- Live tutoring with shared whiteboard, video, and recording (Phase 3). Video/audio needs a real-time media server (WebRTC/SFU) that is out of scope for the current build. A whiteboard shared-state channel is a candidate next step; video is not built.
- AI grading of handwritten and image responses (Phase 3). Free-response text grading against a rubric is built (labeled and teacher-overridable); handwritten and image work needs a vision model and is not built.
- Proctoring (lockdown, integrity events, anomaly scoring), LTI 1.3, OneRoster, LMS grade passback, and district analytics (Phase 4) are not built yet.
- Push notification delivery is not built. In-app notifications are built (inbox, unread badge, emitted on assignment, badge, grade override, and due-date reminders), and email delivery runs on the worker behind a swappable sender (console backend in development, SMTP behind configuration); web and mobile push are not built.
- Worker-side analytics rollups are not built. Item generation is built (copilot-generated, CAS-verified, human-reviewed) but runs inline, not on the worker. The Celery worker grades AI free-response answers off the request path, and the beat scheduler sends assignment due-date reminders; other grading runs inline because it is fast.
- A pgvector-backed vector store with a hosted embedding model. Semantic and hybrid grounding retrieval IS built, over deterministic local embeddings computed in memory (ADR 0006); swapping in pgvector plus a real embedding model behind the same interface is the production scaling path and is not required for correctness at the current corpus size.
- The full 60-plus technology-enhanced question-type set. The gradable core is broad (selection, numeric, math expression, equation, multi-select, true/false, short text, plot-points, plot-function, draw-line, ordering, matching, show-your-work, free-response); the long tail (hotspot, image labeling, categorize/sort, cloze-with-math, table completion, drag-token, transform-a-figure, and more) is not built. `matching` grades and authors but has no dedicated practice input yet.
- A shared `packages/ui`, Playwright `tests/e2e`, and load tests (`tests/load`) are not built; the frontend components live in `apps/web/components`.

## Per-module status

| Module | Status | Target phase | Notes |
|---|---|---|---|
| api-gateway | done | Phase 0 | FastAPI app factory, health and readiness, metrics, OpenAPI, tracing hook, versioned routers. |
| identity_eureka | done | Phase 0 | Verifies EUREKA JWTs (HS256 dev, JWKS-ready interface); syncs the user and roles on first touch. |
| math_core (package) | done | Phase 0 | SymPy symbolic equivalence, safe parsing (no eval), wall-clock timeout, deterministic parameterized-item resolver, tests. |
| curriculum | done | Phase 1 | Standards framework, skill graph, objectives. Seeded algebra graph. |
| content | done | Phase 1 | Lessons and content steps per node. |
| assessment | done | Phase 1, richer kinds and QTI in Phase 2 | Item bank, static items, parameterized templates and variants, assessments, forms, assignment, delivery. Phase 2 adds richer item kinds, item.meta, and QTI 3.0 import and export. Assignments carry a due date, and assessments a server-enforced availability window (open_at/close_at). |
| grading | done | Phase 1, extended in Phase 2 and 3 | Selection, numeric, math expression and equation (SymPy), plus multi-select, true/false, short text, plot-points, and show-your-work step credit. Phase 3 adds rubric-based AI grading of free-response text (via the reasoning provider) with a teacher override queue. Writes grader plus confidence and a reasoning trace. Runs inline. |
| adaptive | done | Phase 1 (BKT), Phase 2 (IRT/CAT) | BKT mastery with evidence and prerequisite-aware path planning; IRT 3PL model, computerized adaptive testing, and item calibration. |
| analytics | done | Phase 2 | Item statistics with IRT, standards heatmap, growth, CSV and PDF exports. |
| gamification | done | Phase 2 | XP, levels, streaks, badges tied to real progress. Live game-show mode is not built. |
| copilot | done (core) | Phase 3 | AI-assisted hints, explanations, and grounded chat behind a swappable reasoning provider with a mock fallback (ADR 0001). Labeled and teacher-overridable. The same provider grades free-response text against a rubric. Handwritten and image grading are not built. |
| tutoring | planned | Phase 3 | Shared whiteboard, video, recording. Needs a media server; not built. |
| proctoring | planned | Phase 4 | Lockdown, integrity signals, review workflow. |
| integrations | planned | Phase 4 | LTI 1.3, OneRoster, gradebook passback. QTI item exchange is done in Phase 2. |
| notifications | done | Phase 2 roadmap | In-app inbox and unread badge, emitted on assignment, badge earned, and AI-grade override, plus beat-scheduled due-date reminders. Email delivery runs on the worker behind a swappable sender (console in dev, SMTP behind config). Push delivery is not built. |

## Frontend and infra

| Item | Status | Notes |
|---|---|---|
| Web dashboard (Next.js 14) | done | Dashboard plus Learn, Practice, Mastery, Path, Teacher, Adaptive Test, Achievements, Analytics, and Copilot pages against the live API. |
| Docker Compose | done | api (8400), web (4100), Postgres with pgvector (5441), Redis (6392), worker, beat, observability profile. |
| Alembic migrations | done | Migrations through 0010 (generated-items review queue), verified up on Postgres with a clean autogenerate schema-drift check. |
| OpenAPI | done | Generated and served at /docs and /openapi.json. |
| CI | done | ruff, math_core and api pytest, Alembic up and down on Postgres, frontend tsc and build. |

## How to read this file

If a row says planned, treat it as not existing. If a row says scaffold, treat it as a boundary plus a stub, not a feature. Only rows marked done are implemented and tested. This file is updated at the close of every phase.

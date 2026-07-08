# AXIOM Status

This is the honest, calibrated status of AXIOM. AXIOM has completed Phase 0 (foundation), Phase 1 (the learning-and-assessment core), Phase 2 (adaptive testing, analytics, gamification, richer item types, QTI), most of Phase 3 (copilot hints/explanations/chat, free-response AI grading, item generation with a human-review queue, a teacher assistant, and a live-tutoring shared whiteboard), and Phase 4 (proctoring and integrity, LTI 1.3, OneRoster). A base-platform completion pass closed the biggest gaps against the build prompt across every phase. What genuinely remains needs external infrastructure or is a deliberate follow-up: real-time video/audio for tutoring (a WebRTC media server), AI grading of handwritten/image responses (a vision model), web/mobile push delivery, a hosted embedding model (the pgvector store itself is built and live), Mathlib for the formal track (the Lean 4 core kernel is bundled and verifying), and the image/geometry-heavy question types (hotspot, image labeling, construct/transform-a-figure). Nothing planned is described here as done.

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
- **Proctoring and integrity (Phase 4).** A proctoring session per exam attempt with a transparent weighted anomaly score, browser-observable integrity events (tab-hidden, blur, copy, paste, right-click), a teacher review queue with the event timeline, and a clear student disclosure. It flags for a human; it never accuses. No webcam or screen capture.
- **Integrations (Phase 4).** LTI 1.3 tool provider: OIDC login, replay-proof launch with RS256 id_token verification (pinned key or JWKS), the tool JWKS endpoint, user provisioning with LTI-role mapping, and AGS grade passback (fail-soft). OneRoster roster/enrollment sync. An admin Integrations page exposes the tool endpoints, platform registration, and a sync box.
- **Live tutoring.** A real-time shared whiteboard, chat, and pushed problems over a WebSocket relay hub, with a join-code session model. Video/audio are out of scope (they need a WebRTC media server) and clearly labeled as such.
- **Shared UI, tests, and accessibility.** `packages/ui` holds the canonical shared math renderer; Playwright e2e covers the dashboard, practice, and the completed-platform navigation; a Locust load test drives the practice hot path; a WCAG pass adds a skip-to-content link and honors reduced-motion.

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

### Curriculum & Proof Extension

The platform now spans the full mathematics ladder and adds proof grading (see the companion `AXIOM_Curriculum_and_Proof_Extension.md` and ADR 0007):

- The full tier 0-6 curriculum graph is seeded: pre-algebra through PDE theory (35 course nodes) plus nine first-class, transferable proof-technique nodes, wired with the Section-2 prerequisite backbone (55 edges). Nodes carry a kind (computational_skill / concept / proof_technique / theorem_with_proof), a tier, and an applied/pure track tag. The path planner enforces the long chains and refuses to route a learner into a Tier 5 proof course until the required Tier 4 techniques show mastery.
- Structured, deterministic proof grading (Section 4.2): proof assembly, justification matching, proof gap-fill, find-the-error, counterexample (checked by evaluating the object against a property predicate in the CAS), and state-definition/theorem with keyword coverage. All auto-gradable, no AI in the loop.
- Formal verification (Section 4.1) behind a swappable verifier interface: a Lean 4 subprocess backend (resource-limited) and an honest "unavailable" default that routes a formal proof to review rather than passing it on a guess. A pass is only ever produced by a real kernel.
- Free-form proof grading (Section 4.3): an AI-assisted first pass against a reference proof and a milestone rubric, with line-level gap feedback, always routed to the instructor review queue and never auto-finalized.
- A copilot proof-tutor mode: graduated Socratic hints that never hand over the proof, plus server-side gap detection that names the first unestablished step.
- Mastery model: proof-technique mastery transfers across courses, evidence is weighted by grader trust (a formally verified proof outweighs an AI provisional pass), and proof nodes track can-apply and can-prove as separate signals.
- Multi-part mixed compute-then-prove items split grading across the CAS and the proof graders, recording both on the attempt.
- A per-course definition and theorem reference library, seeded for the Tier 5 courses.

## Not built yet

These are explicitly not implemented:

- Video and audio for live tutoring. The shared whiteboard, chat, and pushed problems ARE built over a WebSocket relay; real-time video/audio needs a WebRTC media server (LiveKit/mediasoup) and is not built. Session recording is not built. The relay hub is per-process; multi-instance scale needs Redis pub/sub behind the same interface.
- AI grading of handwritten and image responses (Phase 3). Free-response text grading against a rubric is built (labeled and teacher-overridable); handwritten and image work needs a vision model and is not built.
- Live LMS/SIS round-trips. LTI 1.3 launch (with RS256 verification) and OneRoster sync ARE built and tested offline; AGS grade passback to a real LMS and a live OneRoster pull from a real SIS need those external systems to exercise end to end, so they are implemented but not verified against a production platform. District-level analytics is not built.
- Consolidating `apps/web` onto `@axiom/ui`. The shared math renderer lives in `packages/ui`; the web app still vendors the same components because its container build context is `apps/web`. Moving the web image to a repo-root build context to import `@axiom/ui` directly is a follow-up (see packages/ui/README).
- Push notification delivery is not built. In-app notifications are built (inbox, unread badge, emitted on assignment, badge, grade override, and due-date reminders), and email delivery runs on the worker behind a swappable sender (console backend in development, SMTP behind configuration); web and mobile push are not built.
- Worker-side analytics rollups are not built. Item generation is built (copilot-generated, CAS-verified, human-reviewed) but runs inline, not on the worker. The Celery worker grades AI free-response answers off the request path, and the beat scheduler sends assignment due-date reminders; other grading runs inline because it is fast.
- A hosted embedding model. The pgvector-backed store IS built: with `AXIOM_RETRIEVAL_STORE=pgvector` the curriculum corpus is embedded into a Postgres `content_embeddings` table (migration 0015) and semantic/hybrid retrieval ranks by cosine distance with the `<=>` operator in the database (ADR 0006). The embedding provider is swappable behind `embeddings.EmbeddingProvider`: the default is the deterministic hashed embedder (offline, no deps); `AXIOM_EMBEDDING_PROVIDER=sentence_transformers` selects a real neural model, which is an optional dependency not bundled in the default image (it falls back to the hashed embedder if absent, and a model of a different dimension needs a matching vector column).
- The full 60-plus technology-enhanced question-type set. The gradable core is broad and now includes selection, numeric, math expression, equation, multi-select, true/false, short text, plot-points, plot-function, draw-line, ordering, matching, show-your-work, free-response, and the extended kinds inequality, number-line, mixed-number, units-aware numeric, cloze-with-math, categorize/sort, drag-token, and table-completion (each with a grader, a practice renderer, and tests). Still not built: the image- and geometry-heavy kinds (hotspot, image labeling, construct-a-shape, transform-a-figure) that need a figure canvas the current toolkit does not provide. `matching` grades and authors but still has no dedicated practice input.
- A bundled Mathlib. The Lean 4 core kernel IS bundled in the API image (Dockerfile installs a pinned toolchain via elan) and `AXIOM_FORMAL_VERIFIER=lean` is set in compose, so formal-track proofs are machine-verified by a real kernel (core / Natural-Number-Game-style proofs verify; a deliberately broken proof is rejected). Mathlib is NOT bundled (multi-GB), so proofs that `import Mathlib` will not resolve; adding it is a follow-up. The subprocess sandbox (temp dir, wall-clock timeout, CPU rlimit) should be hardened to a jailed worker/container in production, where memory is bounded at the cgroup level.
- Autoformalization (Section 4.4) is not built. Translating an informal proof to Lean and verifying it is research-grade and deliberately omitted; nothing lowers a grade on a formalization attempt.
- Autonomous free-form proof grading. Free-form proof grading is an AI-assisted first pass only (against a reference proof and rubric, over the swappable reasoning provider), always routed to instructor sign-off. Fully autonomous grading of graduate-level proofs is not a goal and not built; expert review in the loop for Tier 5 and 6 is a feature, not a gap. The deterministic mock provider grades by rubric-keyword coverage; a hosted model behind the same interface is the production upgrade.
- Deep Tier 5-6 course content. The tier 0-6 graph, technique nodes, structured/formal/free-form proof kinds, and a seed reference library are built; full lesson-by-lesson content and large item banks for the advanced tiers are seed-level, not a finished curriculum.

## Per-module status

| Module | Status | Target phase | Notes |
|---|---|---|---|
| api-gateway | done | Phase 0 | FastAPI app factory, health and readiness, metrics, OpenAPI, tracing hook, versioned routers. |
| identity_eureka | done | Phase 0 | Verifies EUREKA JWTs (HS256 dev, JWKS-ready interface); syncs the user and roles on first touch. |
| math_core (package) | done | Phase 0 | SymPy symbolic equivalence, safe parsing (no eval), wall-clock timeout, deterministic parameterized-item resolver, tests. |
| curriculum | done | Phase 1, extended by the Proof Extension | Standards framework, skill graph, objectives. Seeded algebra graph, plus the full tier 0-6 mathematics ladder (35 course nodes + 9 proof-technique nodes, 55 prerequisite edges) with node kind/tier/track, and a per-course definition/theorem reference library. |
| content | done | Phase 1 | Lessons and content steps per node. |
| assessment | done | Phase 1, richer kinds and QTI in Phase 2 | Item bank, static items, parameterized templates and variants, assessments, forms, assignment, delivery. Phase 2 adds richer item kinds, item.meta, and QTI 3.0 import and export. Assignments carry a due date, and assessments a server-enforced availability window (open_at/close_at). |
| grading | done | Phase 1, extended in Phase 2/3 and the Proof Extension | Selection, numeric, math expression and equation (SymPy), plus multi-select, true/false, short text, plot-points, and show-your-work step credit. Phase 3 adds rubric-based AI grading of free-response text with a teacher override queue. The Proof Extension adds deterministic structured proof kinds (assembly, justification matching, gap-fill, find-the-error, counterexample, state-definition/theorem), formal verification behind a swappable Lean verifier (ADR 0007), AI-assisted free-form proof grading with mandatory human sign-off, and multi-part mixed compute-then-prove items. Writes grader, confidence, and a reasoning trace. |
| adaptive | done | Phase 1 (BKT), Phase 2 (IRT/CAT) | BKT mastery with evidence and prerequisite-aware path planning; IRT 3PL model, computerized adaptive testing, and item calibration. |
| analytics | done | Phase 2 | Item statistics with IRT, standards heatmap, growth, CSV and PDF exports. |
| gamification | done | Phase 2 | XP, levels, streaks, badges tied to real progress. Live game-show mode is not built. |
| copilot | done (core) | Phase 3, extended by the Proof Extension | AI-assisted hints, explanations, and grounded chat behind a swappable reasoning provider with a mock fallback (ADR 0001). Labeled and teacher-overridable. The same provider grades free-response text and free-form proofs against a rubric. Adds a proof-tutor mode: graduated Socratic hints that never reveal the answer, plus server-side gap detection on a draft. Handwritten and image grading are not built. |
| tutoring | done (whiteboard) | Phase 3 | Real-time shared whiteboard, chat, and pushed problems over a WebSocket relay hub, with a join-code session model. Video/audio and recording need a media server and are not built. |
| proctoring | done | Phase 4 | Session per attempt, weighted anomaly score, browser-observable integrity events, teacher review queue with timeline, student disclosure. No webcam/screen capture; flags for a human, never accuses. |
| integrations | done | Phase 4 | LTI 1.3 tool provider (OIDC login, RS256 launch verification, JWKS, AGS passback) and OneRoster roster sync. QTI item exchange done in Phase 2. AGS/OneRoster live round-trips need a real LMS/SIS. |
| notifications | done | Phase 2 roadmap | In-app inbox and unread badge, emitted on assignment, badge earned, and AI-grade override, plus beat-scheduled due-date reminders. Email delivery runs on the worker behind a swappable sender (console in dev, SMTP behind config). Push delivery is not built. |

## Frontend and infra

| Item | Status | Notes |
|---|---|---|
| Web dashboard (Next.js 14) | done | Dashboard plus Learn, Practice, Mastery, Path, Teacher, Adaptive Test, Achievements, Analytics, and Copilot pages against the live API. |
| Docker Compose | done | api (8400), web (4100), Postgres with pgvector (5441), Redis (6392), worker, beat, observability profile. |
| Alembic migrations | done | Migrations through 0014 (generated-items queue, proctoring, LTI, tutoring, and the Curriculum & Proof Extension foundation: node taxonomy, mastery signals + grader trust, definition/theorem library), each verified up on Postgres with a clean autogenerate schema-drift check. |
| packages/ui | done (unwired) | Shared math renderer extracted to @axiom/ui; apps/web still vendors it pending a repo-root web build (see packages/ui/README). |
| Tests: e2e and load | done | Playwright e2e (dashboard, practice, navigation) under apps/web/tests/e2e; a Locust load test under tests/load drives the practice hot path. |
| Accessibility | pass | KaTeX MathML for screen readers, focus rings and aria labels on interactive controls, a skip-to-content link, and reduced-motion honored. A full WCAG 2.2 AA audit across every surface is ongoing. |
| OpenAPI | done | Generated and served at /docs and /openapi.json. |
| CI | done | ruff, math_core and api pytest, Alembic up and down on Postgres, frontend tsc and build. |

## How to read this file

If a row says planned, treat it as not existing. If a row says scaffold, treat it as a boundary plus a stub, not a feature. Only rows marked done are implemented and tested. This file is updated at the close of every phase.

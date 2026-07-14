# EUREKA Gap Register

Compiled from the Phase A full-platform audit (five parallel tracks: A1/A9
auth+security, A2/A3 service-depth+infra, A4/A5 apps, A6 verticals, A7/A8/A10
data+quality+ops) defined in EUREKA_Full_Analysis_and_Remediation_Prompt.md.
Every entry carries file-path or live-request evidence from the audit.

Severity: P0 = security/data exposure or broken primary journey; P1 = promised
capability that does not work end to end; P2 = spec deviation / partial; P3 =
polish/hygiene. Effort: S (<0.5 day), M (~1 day), L (multi-day).

Status legend: OPEN / IN-WAVE (assigned) / DONE / ACCEPTED (documented gap).

axiom/ is excluded (separately hardened) except its EUREKA-facing seams.

---

## P0 - security, data exposure, or broken primary journey

| id | area | finding | evidence | effort | wave | status |
|----|------|---------|----------|--------|------|--------|
| P0-1 | auth | `POST /auth/register` honors a client-supplied `role`; anyone can self-register as super_admin and receive a valid token that passes all RBAC | api-core app/schemas/auth.py:20 + app/crud/user.py:41 | S | EK-0 | OPEN |
| P0-2 | auth | file-storage has zero auth on every route (upload/download-by-arbitrary-path/list/delete/bulk-delete); user_id is an untrusted form field; download uses raw MinIO key -> IDOR | file-storage/app/api/v1/files.py:37,129,249,291,326 | M | EK-1 | CLOSED (EK-1 part 4): require_user on all routes, user-namespaced object keys, ensure_path_owner closes the IDOR; audit 2026-07-13 confirms |
| P0-3 | auth | ~9 data services enforce no auth on data routes (analytics, assess, tutor-llm, adaptive, content, tier-hs/ug/grad, medical-school); student PII/grades/correct-answers/tutor knowledge all open | analytics/app/api/v1/__init__.py:34-99; assess/app/routes/assessments.py:20; tutor-llm/app/api/v1/__init__.py:41-289 | L | EK-1 | MOSTLY CLOSED: analytics/assess/tutor-llm/adaptive gated in the earlier EK-1 session; 2026-07-14 adds blanket require_user to content, tier-hs/ug/grad (flat main.py routes, / and /health exempt) and the FastAPI medical-school router include. Note: content/tier-* are code-only (no compose containers); the deployed eureka-medical-school container is the Node variant, out of this fix's scope |
| P0-4 | tenancy | Cross-tenant read/write in api-core course-enrollment endpoints: bare role checks with no org match; org B teacher/admin can mutate + read org A enrollments and student emails | api-core app/api/v1/endpoints/courses.py:452-457,502-553; app/crud/course.py:392,496 | M | EK-0 | OPEN |
| P0-5 | tenancy | analytics IDOR: student analytics/at-risk/events filtered by an untrusted path param with no auth -> enumerate any student | analytics/app/api/v1/__init__.py:56,106,197,493 | M | EK-1 | OPEN |
| P0-6 | auth | test-prep mounts a "development only" router with NO env gate; `/dev/adaptive/submit-answer` leaks correct_answer + explanation unauthenticated in all environments | test-prep/app/api/v1/api.py:10-11; endpoints/dev.py:82-85 | S | EK-0 | OPEN |
| P0-7 | apps | Registration is fake: `auth/register` simulates success with a 1s timer, creates no account, issues no token; real apiClient.register() exists but is never called -> new-user journey dead-ends | apps/web/src/app/auth/register/page.tsx:45 | S | EK-0 | OPEN |
| P0-8 | data | Shared `eureka` DB has >=3 uncoordinated DDL owners with real table collisions: notifications defined 3x (ops/db init, api-core ORM, notebook migrate.js:102); users/courses/enrollments/assessments/questions defined 2x; notebook FKs into api-core users | ops/db/00_init_complete.sql:1011,54,101,160; api-core app/models/*; notebook/migrations/migrate.js:19-123 | L | EK-3 | OPEN |
| P0-9 | reasoning | AXIOM->EUREKA reasoning contract is unserved: EurekaReasoningProvider POSTs /api/v1/reasoning/generate + /score-rubric; nothing in eureka/ serves them; AXIOM silently falls back to mock forever | axiom .../copilot/reasoning.py:224-306; grep of eureka/ = 0 routes | M | EK-2 | CLOSED 2026-07-13: api-core serves /api/v1/reasoning/generate + /score-rubric (endpoints/reasoning.py); real model when ANTHROPIC_API_KEY set, honest grounded-deterministic fallback else; verified provider=eureka end-to-end from axiom-api |

## P1 - promised capability that does not work end to end

| id | area | finding | evidence | effort | wave | status |
|----|------|---------|----------|--------|------|--------|
| P1-1 | reasoning | Even if EK-2 serves the contract, AXIOM cannot reach it: provider defaults to mock, base_url defaults to in-container localhost:8000, and the two composes are separate Docker networks; failure is silent by design | axiom/docker-compose.yml (no AXIOM_REASONING_PROVIDER/base_url); axiom config.py:62-63 | S | EK-2 | CLOSED 2026-07-13: axiom api joins the external eureka-network and addresses http://api-core:8000 by service alias (host-gateway had a port collision with an unrelated host service); AXIOM_REASONING_PROVIDER=eureka set in compose |
| P1-2 | apps | medical-school web integration broken by API-surface mismatch: 9 web pages call the dormant NestJS shape (/ai-tutor,/cases,/qbank,/content); deployed Python serves /usmle,/clinical-cases,/osce -> pages 404 against a healthy service | apps/web/src/lib/api-endpoints.ts:85-98 vs medical-school/app/api/v1/__init__.py | M | EK-4 | OPEN |
| P1-3 | apps | Offline/degradation banner wired to almost nothing: ServiceHealthBanner mounts only in the SRS-only layout, not app/dashboard/layout.tsx -> P1.4 signaling invisible; test-prep/medical pages silently render empty | apps/web components/layout/DashboardLayout.tsx vs app/dashboard/layout.tsx | S | EK-6 | OPEN |
| P1-4 | apps | dashboard/test-prep/study-plan fabricates a personalized plan (hardcoded 32% progress, 45 days-to-exam, synthetic scores/recs) whenever :8200 is down, unlabeled | apps/web/src/app/dashboard/test-prep/study-plan (~lines 92-227) | S | EK-6 | OPEN |
| P1-5 | verticals | test-prep vertical has zero functioning CI: absent from ci.yml matrix; its own ci-cd.yml is orphaned (not under .github/workflows) and targets a nonexistent backend/ layout | .github/workflows/ci.yml; services/test-prep/ci-cd.yml | S | EK-7 | OPEN |
| P1-6 | verticals | test-prep's own composes are dead: dev+prod build contexts (./backend, ../docker/) do not exist; prod additionally crashes on missing JWT_SECRET; neither wires the JWT bridge | services/test-prep/docker-compose.yml + .prod.yml; app/core/config.py:116-120 | S | EK-5 | OPEN |
| P1-7 | verticals | 5 of 11 exams have no backend question bank (Patent Bar, Security+, PE EE, FME; GMAT ~4 rows); source of truth is ~3.5MB frontend TS bundles; importers reference nonexistent/hardcoded paths | services/test-prep/qbank/*; apps/web/src/lib/*-qbank-data.ts | M | EK-5 | OPEN |
| P1-8 | security | python-jose 3.3.0 across ~8 services: CVE-2024-33663 (alg confusion) + CVE-2024-33664 (JWT-bomb DoS), unpatched; this is the JWT verify lib for the stack | api-core/requirements.txt:18 (+assess,medical-school,tier-*,tutor-llm,ai-research) | S | EK-0 | OPEN |
| P1-9 | security | platform-orchestrator gateway performs no JWT verification; proxies by path prefix and trusts downstream services that mostly have no auth (also: orphaned, in no compose) | services/platform-orchestrator/src/server.ts:258-270 | M | EK-5 | OPEN |
| P1-10 | compliance | COPPA under-13 consent is a stub: register checks only that a parent_email string is present, issues tokens immediately; parental_consent_given never set; check_coppa_compliance dependency wired to zero endpoints | api-core app/api/v1/endpoints/auth.py:66-73; app/utils/dependencies.py:252 | M | EK-9 | OPEN |
| P1-11 | compliance | Audit log is a stub: audit_logs table + AuditLog.log() modeled but AuditMiddleware writes nothing (TODO); FERPA/HIPAA retention claim unbacked (a real audit path exists only for the integrations surface) | api-core app/middleware/audit.py:98; app/models/audit_log.py | M | EK-9 | OPEN |
| P1-12 | security | Wildcard allow_origins=["*"] with allow_credentials=True on 14 Python services | file-storage/main.py:38-39 (+13 more) | S | EK-0 | OPEN |
| P1-13 | data | api-core runs Base.metadata.create_all at startup despite having Alembic -> migrations can drift undetected because startup papers over gaps | api-core main.py:79; app/core/database.py:72 | S | EK-3 | OPEN |
| P1-14 | quality | ci-gate never checks the migrations job result (needs it but omits it from the result loop); with if:always() the one gating alembic smoke test can fail while CI stays green | .github/workflows/ci.yml ~:497 vs :502 | S | EK-0 | OPEN |
| P1-15 | quality | Zero-CI services: test-prep (largest), medical-school (NestJS), file-storage; tutor-llm in the matrix but runs zero tests (only test file sits outside tests/) | .github/workflows/ci.yml matrix | M | EK-7 | OPEN |
| P1-16 | data | Backups are paper-only: solid scripts/backup-restore.sh but no CronJob manifests, helm chart has no templates/ dir, cd-deploy references nonexistent cronjob/db-backup + db-migrate | scripts/backup-restore.sh; eureka/helm/eureka-platform/ (no templates); cd-deploy.yml:147,193 | M | EK-8 | OPEN |
| P1-17 | quality | ~155 of api-core's 275 test bodies live in the permanently non-gating CI bucket (legacy-fail debt); only ~120 gate | .github/workflows/ci.yml (api-core-tests job list) | L | EK-7 | OPEN |
| P1-18 | observability | Observability exists in exactly one service: structlog+request-ID+OTel + /metrics in api-core only (tutor-llm has the module but no OTLP endpoint set); ~24 services have plain logs, no request IDs, no traces | api-core app/core/observability.py; app/utils/metrics.py | L | EK-8 | OPEN |
| P1-19 | apps | Admin app is a 1-page no-auth shell; mobile app is a README with zero code -- both presented in the apps tree as products | apps/admin/app/page.tsx; apps/mobile/ (README only) | M | EK-6 | OPEN |

## P2 - spec deviation / partial

| id | area | finding | evidence | effort | wave | status |
|----|------|---------|----------|--------|------|--------|
| P2-1 | services | 13 compose-started services have zero consumers (tutor-llm, assess, adaptive, content, analytics, tier-hs/ug/grad, pro-law/mba/eng, + stubs); 5 contain real DB-backed logic duplicating api-core -> integrate-or-delete decision | web rewired to api-core; api-endpoints.ts imports only MEDICAL_SCHOOL/NOTEBOOK/TEST_PREP | L | EK-3/4/5 | OPEN |
| P2-2 | infra | 3 heavy datastores are pure dead weight (opensearch ~1GB, neo4j, qdrant): zero client code anywhere, only compose defs + unused requirement pins | data-fabric/requirements + empty app/graph, app/lakehouse | S | EK-5 | OPEN |
| P2-3 | services | 6 services are facades serving canned/fake data (tier-hs/ug/grad hardcoded GPAs, xr-labs total_users:5432, data-fabric/ethics-security/futures/institutions all-zeros) | tier-hs/main.py:42-52; xr-labs/main.py:146-157; futures/main.py:192-206 | M | EK-5 | OPEN |
| P2-4 | infra | Kafka's only producers/consumers are stubs (event_bus real, all 8 subscribers TODO); analytics could use it but has env only, no client | services/shared/event_bus.py; 8 platform main.py lifespans | M | EK-5 | OPEN |
| P2-5 | data | 5 services have ORM models with NO DDL path (adaptive, analytics, tier-hs, tutor-llm, marketplace); schema depends on hand-maintained ops/db/*.sql and the drift checker never gates | adaptive/analytics/tier-hs/tutor-llm/marketplace | M | EK-3 | OPEN |
| P2-6 | data | Persistence-free "real logic" traps: content (in-memory dicts), pedagogy (torch DKT/IRT with learner_states={}), marketplace (content_id=12345 mock, models unwired) lose state on restart | content/main.py; pedagogy app/api/v1/cognitive.py:22-26; marketplace app/api/v1/content.py:110 | M | EK-5 | OPEN |
| P2-7 | analytics | AXIOM analytics dead-ends: events terminate in axiom Postgres; no Kafka/HTTP bridge; EUREKA never calls axiom's inbound Caliper ingest and its own events endpoint is schema-incompatible | axiom/.../analytics/ingest.py; eureka analytics events schema | M | EK-8 | OPEN |
| P2-8 | tenancy | api-core tenancy is app-layer only (TenancyMiddleware injects org_id, does not filter/reject); assess/content/analytics/institutions have no tenant columns; 16 api-core learner tables key only on user_id | api-core app/middleware/tenancy.py:65-73; assess/app/models.py:40 | L | EK-1 | CLOSED 2026-07-14 (dedicated session). Audit found the register partially stale: api-core endpoint files were already guarded (users/courses/institutional/learner/workforce org-checked; exam/agent/xr/engagement/resumes self-scoped; ops/gtm admin-gated; item_bank global by design) — enforcement is ownership+staff-same-org at the endpoint layer, not blanket column filtering. Real gaps fixed: (1) assess attempts+grading had ZERO access checks + body-spoofable user_id -> org_id column added (startup ALTER, no alembic), identity forced from token, owner/staff-same-org gates on all 8 routes; also repaired pre-existing model<->route drift (attempt_number/max_score/percentage/response_text etc. missing from models; grading_results name-collided with an incompatible legacy table -> attempt_grading_results) — these routes had never worked. (2) analytics: org_id on 5 learner tables, writes stamped from token, staff reads org-scoped (unstamped legacy rows owner-only), 8 previously-unguarded routes (achievements/trends/course-alerts/cohorts/outcome-writes/deletes) gated; generic additive schema converger at startup (56 missing columns, legacy NOT NULL relaxation, event_type enum widened). (3) api-core leaderboard was global -> org-scoped via users join; windowed variant now also honors show_on_leaderboard opt-in. (4) content service: stub, no learner data — honest no-op. Live cross-tenant verification with org-distinct JWTs: spoofed user_id overridden, cross-org GET/submit/delete 403, lists self-/org-scoped (1/0/1/0), leaderboard per-org, full attempt->submit->auto-grade->results pipeline green. Residual (non-tenancy): analytics at-risk/identify + student-analytics calculate paths depend on legacy service internals not exercised here; institutions service remains a facade (P2-3). |
| P2-9 | auth | shared require_role/require_tier broken (inner checker defaults user=get_current_user, not Depends) -> never injects user; latent auth-bypass if adopted | services/shared/auth_middleware.py:168,190 | S | EK-1 | CLOSED: role/tier checkers now inject via Depends(get_current_user); audit 2026-07-13 confirms |
| P2-10 | auth | test-prep qbank/flashcards/notes/patent_bar routers (50+ routes) fully public; only question create/update/delete gated | test-prep endpoints/qbank.py, flashcards.py, notes.py | M | EK-1 | CLOSED 2026-07-14: qbank/cissp-qbank/flashcards/notes/patent-bar gated at the mount site (dependencies=[Depends(get_current_user)]); verified 401 unauthenticated on live routes, /health still 200 |
| P2-11 | quality | No contract tests and no load tests outside axiom; ruff/eslint/tsc configured-but-non-gating; no ruff config anywhere | CI + repo grep | M | EK-7 | OPEN |
| P2-12 | ops | Root bootstrap broken/misleading: setup.sh dies at step 4 on nonexistent files/names/creds/ports; README root .env copy never reaches compose; notebook needs undocumented manual migrate | setup.sh; README; notebook compose command | M | EK-8 | OPEN |
| P2-13 | ops | Port split-brain: stale docs/PORTS.md contradicts compose + eureka/PORT_MAPPING.md; standalone test-prep compose collides on 8000/3000/5432 and duplicates a service the root compose runs at 8200 | docs/PORTS.md; services/test-prep/docker-compose.yml | S | EK-5 | OPEN |
| P2-14 | infra | Missing healthchecks on 20+ services (kafka/neo4j/qdrant + all tier/pro + tutor-llm/assess/adaptive/content); orphaned healthcheck block mis-attaches to analytics; medical-school+test-prep share Redis DB /15 | eureka/docker-compose.yml ~336-341,551,866 | M | EK-5 | OPEN |
| P2-15 | security | file-storage upload validates filename extension only (no magic-byte/content-type), combined with no-auth = open store | file-storage/app/api/v1/files.py:26-34,63 | S | EK-1 | CLOSED 2026-07-13: validate_magic_bytes enforces content-vs-extension signatures (PDF/PNG/JPEG/GIF/OOXML/OLE2/media incl. mp4 ftyp) and rejects executable magic (PE/ELF/Mach-O/shebang) on every upload; verified live with 9 cases |
| P2-16 | security | python-multipart 0.0.6 across ~10 services: CVE-2024-24762 ReDoS on form parsing, fixed 0.0.7+ | api-core/requirements.txt:24 (+~9) | S | EK-0 | OPEN |
| P2-17 | compliance | No data-retention/deletion job (DATA_RETENTION_DAYS is a constant, no purge task); account deletion soft-deletes + pseudonymizes email only (name/DOB/parent_email retained) | api-core app/core/config.py:108; app/services/jobs.py:244-287; app/crud/user.py:301 | M | EK-9 | OPEN |
| P2-18 | data | Seed scripts not idempotent (initdb USMLE/clinical/osce seeds are plain INSERTs, no ON CONFLICT); demo seeds hit live API with hardcoded dev-admin creds | ops/db/06_skill_graph_seed.sql, seed_usmle_only.sql; scripts/seed_*_demo.py | S | EK-3 | OPEN |
| P2-19 | apps | Silent-empty data pages (data-fabric, ethics-security, medical overview, srs, 3/4 analytics, marketplace reviews): service failure indistinguishable from no-data | apps/web dashboard pages | M | EK-6 | OPEN |
| P2-20 | apps | Tokens in localStorage + no server-side route protection (no middleware.ts); all gating client-side; AXIOM handoff puts the JWT in a URL hash | apps/web src (no middleware.ts); sidebar.tsx:80 | M | EK-6 | OPEN |

## P3 - polish / hygiene

| id | area | finding | evidence | effort | wave | status |
|----|------|---------|----------|--------|------|--------|
| P3-1 | apps | Duplicate untracked lockfiles differ from real ones: package-lock 2.json (root + apps/web); stray .tsbuildinfo files | eureka/package-lock 2.json; apps/web | S | EK-0 | OPEN |
| P3-2 | apps | Dead/duplicate code: apps/web src/auth.ts (dead auth store), 7 orphaned (dashboard) redirect stubs; api-core app/auth/auth_system.py; tutor-llm app/ai/ai_integration.py; medical-school NestJS tree; xr-labs pg-backed TS app never run | per audit paths | M | EK-5 | OPEN |
| P3-3 | apps | Hardcoded http://localhost:3010 in test-prep videos pages (no env var) -> dead in any deployment; collides with platform-orchestrator DATA_FABRIC default | apps/web dashboard/test-prep/videos, watch/[contentId] | S | EK-6 | OPEN |
| P3-4 | apps | r/[shareId] share links resolve only from local browser store -> real recipients 404 (TODO admitted in code) | apps/web/src/app/r/[shareId] | S | EK-6 | OPEN |
| P3-5 | apps | Accessibility near-zero: ~0 aria attributes across major pages, no tab semantics on tab UIs (positive: real buttons/Links, tsc-clean) | apps/web page.tsx, dashboard pages | M | EK-6 | OPEN |
| P3-6 | ops | docs/STATUS.md ~6 weeks stale; quick-start references orphaned database/migrations SQL never wired; orphaned eureka/alembic/versions/001, test-prep alembic.ini w/o alembic dir; .sql.backup* clutter in initdb mount | docs/STATUS.md; docs/runbooks/quick-start-guide.md:27 | S | EK-10 | OPEN |
| P3-7 | infra | jaeger has no volume (traces lost on restart); api-core defaults OTLP endpoint to jaeger:4317 which is profile-gated -> silent retry noise on plain up | eureka/docker-compose.yml | S | EK-8 | OPEN |
| P3-8 | services | tier-hs ships 20 tests for endpoints that do not exist (/tutor,/practice_set,/badge_award); orphaned app/core/models.py | tier-hs/main.py:42-52; test_main.py | S | EK-5 | OPEN |
| P3-9 | auth | .env.example JWT placeholders differ per service (7 strings); marketplace + orchestrator define SECRET_KEY/JWT_SECRET never used in code | eureka/.env.example:49 vs service examples | S | EK-0 | OPEN |
| P3-10 | services | platform-orchestrator orphaned: 795 lines real proxy in no compose, no Dockerfile, registry points at nonexistent ports (:3001/:3002/:3005/:3006/:8020) | services/platform-orchestrator/src/server.ts:78-140 | S | EK-5 | OPEN |

---

## Healthy / confirmed-good (do not touch)

- api-core auth: HS256 JWT + jti + iat, argon2id, MFA/TOTP, refresh rotation with old-jti revocation, per-jti Redis blacklist, logout-all via iat cutoff (api-core is the reference).
- notebook: authed on every route with real RBAC.
- No secrets committed anywhere; secrets/dev.enc.yaml.template is placeholders; SOPS/gitleaks present.
- No unsafe eval/exec/pickle/yaml.load/shell=True anywhere in the repo.
- JWT-secret unification + prod guards correct where auth exists (api-core, medical-school, shared, test-prep).
- api-core->test-prep JWT bridge (root compose) and EUREKA->AXIOM SSO hash handoff both correctly and consistently wired.
- api-core progress + SRS: real endpoints, clean migration chain, comprehensive CI-gated tests.
- api-core depth: ~386 endpoints, 118 tables, 275 tests, real 2PL IRT EM fitter, OIDC SSO.
- Ports across the three stacks are individually deconflicted (collisions only when running the redundant standalone test-prep compose).

---

## Wave assignment summary

- EK-0 (P0 safety sweep): P0-1, P0-4(part), P0-6, P0-7, P1-8, P1-12, P1-14, P2-16, P3-1, P3-9
- EK-1 (auth + tenancy): P0-2, P0-3, P0-5, P2-8, P2-9, P2-10, P2-15
- EK-2 (reasoning core): P0-9, P1-1
- EK-3 (data layer + learning core depth): P0-8, P1-13, P2-5, P2-18
- EK-4 (tiers + professional + medical verticals): P1-2, part of P2-1
- EK-5 (platform services reconciliation): P1-6, P1-7, P1-9, P2-2, P2-3, P2-4, P2-6, P2-13, P2-14, P3-2, P3-8, P3-10
- EK-6 (app truthfulness): P1-3, P1-4, P1-19, P2-19, P2-20, P3-3, P3-4, P3-5
- EK-7 (quality gates): P1-5, P1-15, P1-17, P2-11
- EK-8 (observability + ops): P1-16, P1-18, P2-7, P2-12, P3-7
- EK-9 (compliance floor): P1-10, P1-11, P2-17
- EK-10 (final re-verify + honest STATUS): P3-6 + closing sweep

Counts: 9 P0, 19 P1, 20 P2, 10 P3 = 58 findings.

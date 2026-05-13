# Platform Status

Honest, per-service status. Updated as services land or break.

Legend:
- 🟢 **Working** — runs, basic endpoints respond, no known showstopper
- 🟡 **Partial** — runs, but has stubs, missing features, or known issues
- 🔴 **Broken / scaffolding** — does not run or is template-only
- ⚪ **Not started**

| Service | Path | Status | Notes |
|---|---|---|---|
| Postgres + pgvector | infra | 🟢 | Init SQL applies cleanly |
| Redis | infra | 🟢 | |
| MinIO | infra | 🟢 | Console at :9005 |
| OpenSearch | infra | 🟡 | Behind `--profile full` |
| Kafka | infra | 🟡 | Behind `--profile full`, few producers wired |
| api-core | eureka/api-core | 🟡 | Auth, tenancy, audit middleware in place; OpenAPI exists; some routes return stubs |
| web (Next.js) | eureka/apps/web | 🟡 | Builds and runs; many pages call endpoints that may stub |
| admin | eureka/apps/admin | 🟡 | Builds; admin flows partial |
| tutor-llm | eureka/services/tutor-llm | 🟢 | Login flow proven end-to-end (2026-05); Claude integration working; RAG against pgvector partial. Streaming/code-exec/equation-solver port items in BACKLOG.md |
| assess | eureka/services/assess | 🟡 | MCQ + auto-grade works; essay grading via Claude works; rubrics WIP |
| adaptive | eureka/services/adaptive | 🟡 | Mastery model + spaced rep partial |
| content | eureka/services/content | 🟡 | CRUD works; authoring UI partial |
| analytics | eureka/services/analytics | 🟡 | Event ingest works; dashboards thin |
| tier-hs | eureka/services/tier-hs | 🟡 | API skeleton; CCSS/NGSS content not seeded |
| tier-ug | eureka/services/tier-ug | 🟡 | API skeleton |
| tier-grad | eureka/services/tier-grad | 🟡 | API skeleton |
| pro-law | eureka/services/pro-law | 🟡 | Skeleton |
| pro-mba | eureka/services/pro-mba | 🟡 | Skeleton |
| pro-eng | eureka/services/pro-eng | 🟡 | FE/PE prep scaffolding |
| medical-school | eureka/services/medical-school | 🟢 | NestJS, 4.7k LOC, 30+ endpoints. Canonical med tier — `pro-med` (was a 25-LOC stub) deleted 2026-05. Stack-consistency port to FastAPI tracked in BACKLOG.md |
| test-prep | services/test-prep | 🟡 | Most active; resume-builder feature complete |
| ai-research | services/ai-research | 🟡 | Skeleton |
| xr-labs | services/xr-labs | 🟡 | Node + WebXR scaffolding; needs real lab content |
| marketplace | services/marketplace | 🔴 | Skeleton only |
| pedagogy | services/pedagogy | 🟡 | API present |
| ethics-security | services/ethics-security | 🟡 | API present |
| data-fabric | services/data-fabric | 🟡 | API present |
| institutions | services/institutions | 🟡 | API present |
| futures | services/futures | 🟡 | API present |
| notebook | services/notebook | 🟡 | Express/JS service |
| platform-orchestrator | services/platform-orchestrator | 🟡 | TS, lightweight |

## Recently resolved (2026-05)
- **Phase 3 Session 3.1** — three service-duplication pairs resolved: `services/ai-tutor` (TS, orphaned) deleted; `eureka/services/pro-med` (25-LOC stub) deleted; `web-hs`/`web-ug`/`web-grad` Next.js stubs deleted. Also deleted dead `eureka/api-core/` (duplicate). Port items + future work tracked in [BACKLOG.md](BACKLOG.md).
- **Phase 3 Session 3.2** — new CI workflow `.github/workflows/ci.yml` with matrix coverage across all 20 Python services + 4 Node services, gitleaks secret scan, compose validation, docker-build smoke, and a `schema-drift` checker. Top-level Makefile (`make test-all`, `make test-py`, `make schema-drift`, …). Health tests bulk-installed in 18 services that lacked them; the install caught two real bugs in `analytics` (missing `datetime` import) and `assess` (imports models that didn't exist — wrote a minimal SQLAlchemy ORM layer over the seeded tables).
- **Phase 3 Session 3.3** — auth + tenancy hardening: argon2id active scheme with transparent bcrypt → argon2 rehash on first login (verified live); full TOTP MFA flow (setup/verify/disable/status, recovery codes, Fernet envelope encryption); 5-test cross-tenant isolation integration test in `tests/integration/test_tenancy_isolation.py` (passing live); SecurityHeadersMiddleware (HSTS prod-only, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy, CSP); fail-loud boot check in production for unset JWT_SECRET / MFA_ENVELOPE_KEY; comprehensive `docs/SECURITY.md` runbook. **Caught 3 more ORM/SQL schema-drift bugs** along the way (organizations.email, courses.tier, courses.is_published all missing in init SQL) — fixed.
- **Phase 3 Session 3.4** — observability baseline: OpenTelemetry traces flowing from api-core → Jaeger (verified live: a single login request produces 15 spans covering FastAPI receive/send + SQLAlchemy SELECTs); reusable `app/core/observability.py` drop-in (api-core + tutor-llm both use it unchanged); structlog JSON logs with request_id / user_id / org_id / trace_id correlation; `--profile dev-obs` brings up Jaeger UI on :16686; `docs/OBSERVABILITY.md` shows how to add the pattern to any new service.
- **Phase 3 Session 3.5** — secrets management: untracked 3 actual `.env` files (placeholder content only — no real leaks); SOPS+age scaffolding (`.sops.yaml` + `secrets/dev.enc.yaml.template`); `.gitleaks.toml` allowlist for documentation placeholders wired into CI; `docs/SECRETS.md` runbook with first-time setup, dev/CI/prod loading, and per-secret rotation procedures.
- **Phase 3 Session 3.6 (partial)** — frontend cleanup: `web` build is now green and gating in CI. Added missing shadcn components (`scroll-area`, `alert`); added `asChild` prop to `Button` via Radix `Slot`; installed `@radix-ui/react-scroll-area` + `react-syntax-highlighter` + types; patched `ReactMarkdown`'s removed `inline` prop in ai-tutor (react-markdown 10 dropped it); wrapped 4 pages using `useSearchParams()` in `<Suspense>` to fix Next 14's CSR-bailout-during-static-gen. Type-check/lint are still informational pending a typed-Three.js follow-up.

## Known issues
- **CI**: ruff-lint failures are not gating yet (continue-on-error). Phase 3.6 will tighten this.
- **Schema drift job is non-gating**: `schema-drift` reports drift but doesn't fail the build, because the known drift (e.g. `users.email_verified` vs `is_email_verified` history) was just cleaned up and the gate would be a no-op. Next session should flip `continue-on-error: false`.
- **Coverage gate is not enforced**: collection + upload happen but 40% floor isn't set. Once tests beyond /health exist (Phase 4+), gate it.
- **`assess` runtime endpoints**: routes for `assessment_attempts`, `question_responses`, `grading_results`, `response_feedback` import cleanly but the matching DB tables aren't in the seed SQL. Phase 5.1 will add them. /health works regardless.

This file is the source of truth for service health. Update it whenever a service moves up or down a tier.

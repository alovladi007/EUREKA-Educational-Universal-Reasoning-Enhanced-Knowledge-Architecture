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
- **Service duplication** — `services/ai-tutor` (TS, orphaned, not in compose) deleted; `tutor-llm` (Python) is canonical. Port items captured in [BACKLOG.md](BACKLOG.md).
- **Frontend duplication** — `web-hs`, `web-ug`, `web-grad` stubs deleted; real tier UI lives at `eureka/apps/web/src/app/tiers/[tier]/`.
- **NestJS/FastAPI med overlap** — `pro-med` was a 25-LOC stub (deleted). `medical-school` (NestJS, 4.7k LOC, mature) is canonical for the med tier. Stack-consistency port tracked in BACKLOG.

## Known issues
- **CI**: GitHub Actions workflows exist but coverage is uneven across services. Session 3.2 fixes this.
- **Tests**: `make test` runs what's there but coverage is patchy; no integration test that exercises a full learner journey. Session 3.2.
- **Two `api-core` copies**: `eureka/api-core/` and `eureka/services/api-core/` are near-duplicates. Compose builds from the latter. Mini Session 3.1d should verify and delete the former (tracked in BACKLOG).
- **Schema drift**: ORM and init SQL drifted (caught during stack bringup 2026-05). Need automated drift check in CI (Session 3.2).

This file is the source of truth for service health. Update it whenever a service moves up or down a tier.

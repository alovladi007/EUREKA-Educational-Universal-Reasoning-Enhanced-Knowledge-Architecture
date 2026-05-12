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
| tutor-llm | eureka/services/tutor-llm | 🟡 | Claude integration working; RAG against pgvector partial |
| assess | eureka/services/assess | 🟡 | MCQ + auto-grade works; essay grading via Claude works; rubrics WIP |
| adaptive | eureka/services/adaptive | 🟡 | Mastery model + spaced rep partial |
| content | eureka/services/content | 🟡 | CRUD works; authoring UI partial |
| analytics | eureka/services/analytics | 🟡 | Event ingest works; dashboards thin |
| tier-hs | eureka/services/tier-hs | 🟡 | API skeleton; CCSS/NGSS content not seeded |
| tier-ug | eureka/services/tier-ug | 🟡 | API skeleton |
| tier-grad | eureka/services/tier-grad | 🟡 | API skeleton |
| pro-med | eureka/services/pro-med | 🟡 | USMLE question scaffolding; case sims stubbed |
| pro-law | eureka/services/pro-law | 🟡 | Skeleton |
| pro-mba | eureka/services/pro-mba | 🟡 | Skeleton |
| pro-eng | eureka/services/pro-eng | 🟡 | FE/PE prep scaffolding |
| medical-school | eureka/services/medical-school | 🟡 | NestJS variant; partial overlap with pro-med |
| test-prep | services/test-prep | 🟡 | Most active; resume-builder feature complete |
| ai-tutor | services/ai-tutor | 🟡 | TS service; overlaps with `tutor-llm` — needs reconciliation |
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

## Known issues
- **Service duplication**: `services/ai-tutor` (TS) and `eureka/services/tutor-llm` (Python) overlap. Decide which is canonical.
- **Frontend duplication**: `eureka/apps/web` is the real frontend; `web-hs`, `web-ug`, `web-grad` are stubs and can probably be deleted or merged into `web` via routes.
- **NestJS vs FastAPI**: `eureka/services/medical-school` is NestJS while `pro-med` is FastAPI — needs a decision.
- **CI**: GitHub Actions workflows exist but coverage is uneven across services.
- **Tests**: `make test` runs what's there but coverage is patchy; no integration test that exercises a full learner journey.

This file is the source of truth for service health. Update it whenever a service moves up or down a tier.

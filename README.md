# EUREKA

**Educational Universal Reasoning & Enhanced Knowledge Architecture** — an AI-powered learning platform spanning high school through professional schools (Medical, Law, MBA, Engineering), plus AI-driven test prep, resume building, and XR labs.

> **Status (July 2026): Phases 1–19 live, plus 16.1 and the 16.2 research collaboration waves (R-1 → R-4).**
>
> **Recent (July 2026):**
> - **Patent Bar test-prep monetization** — 980-question bank at exact USPTO blueprint proportion (174 official + authored, unverified items labeled), official-only timed mock, entitlement paywall covering QBank (20-question free preview) / mock / lessons / flashcards, public landing page + free diagnostic funnel, email verification + password reset. Stripe checkout is wired and deliberately disabled until test keys are configured; SME review of authored questions pending before marketing claims.
> - **Community depth** — markdown + LaTeX rendering, nested replies, typed reactions (upvote / helpful / insightful), author names, accepted-answer exclusivity, admin pin/lock moderation.
> - **Study groups** — open-join, exam-bound cohorts with group-scoped community threads.
> - **Research tier (16.2 R-1→R-4)** — workspace sharing (viewer/collaborator roles with enforced read/write access), live CrossRef + arXiv reference lookup, BibTeX export, research lab groups, and opt-in public scholar profiles at `/scholar/{id}` with on-platform-only metrics (no fabricated citation counts).
> - **Module hardening** — GDPR self-service export/delete panel, saved theme preference actually applies, webhook delivery health, admin nav/page role-gating, and an honesty pass that removed every fake meter, dead link, and untrue capability claim.
>
> Academic + professional tiers (Phase 1) · horizontal microservices (Phase 2) · auth + observability + secrets (Phase 3) · cross-tier learner spine + skill graph + Ed25519-signed transcripts + recommender (Phase 4) · item bank with AI variant generator + hybrid skill+vector search (Phase 5) · AI tutor with Claude tool-use + RAG + groundedness scoring (Phase 6) · IRT 2-PL calibration + FSRS-lite spaced repetition + mock exams (Phase 7) · institutional / B2B with cohorts + SSO + LTI 1.3 (Phase 9) · marketplace + creator economy with Stripe Connect (Phase 10) · GTM (subscriptions / SEO / email / onboarding / KB / support) (Phase 11) · engagement (streaks / push / study plans / live sessions / offline) (Phase 12) · platform integrations (API keys / webhooks / embed SDK / OAuth / GDPR export+delete) (Phase 13) · production scale (Redis cache / Postgres job queue / Prometheus metrics / autocomplete / health probes) (Phase 14) · workforce training affiliate platform (Phase 15) · graduate school tier (Phase 16.1) · real activity feed + user collections + no-mocks dashboard (Phase 17) · real community + curated resources catalog (Phase 18) · last mocks ripped + 7 public footer pages + dev-auto-login parity (Phase 19).
>
> **Path to production (Phases 20–27) is documented in [docs/ROADMAP.md](docs/ROADMAP.md):** deployment to cloud (20) · security hardening + SOC 2 prep (21) · compliance per region (22) · finish Phase 16 Research Tools — the Wolfram-Alpha competitor (23) · real SME content (24) · mobile + offline (25) · GTM execution (26) · XR microservice reconciliation (27).
>
> See [docs/STATUS.md](docs/STATUS.md) for the honest per-phase status and the production-readiness gap list.

---

## Quick start (local, end-to-end)

Requires Docker, Node 18+, Python 3.11+.

```bash
git clone https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture.git EUREKA
cd EUREKA
cp .env.template .env                  # then add real ANTHROPIC_API_KEY etc.

# Bring up the core stack (db, redis, minio, api-core, web, admin)
cd eureka
docker compose up -d

# Bring up everything (adds Kafka, OpenSearch, tiers, professional schools, etc.)
docker compose --profile full up -d
```

**Default ports.** Web app: <http://localhost:3000>  ·  Admin: <http://localhost:3001>  ·  API: <http://localhost:8000>  ·  MinIO console: <http://localhost:9005>

**If port 3000 is already taken** on your machine (common — many other dev projects squat there), drop a `eureka/.env` with `WEB_HOST_PORT=4040` (and `ADMIN_HOST_PORT=4041`) to remap. The compose file honours both env vars. See [docs/PORTS.md](docs/PORTS.md) for the full port map.

**Dev sign-in.** The first time you run any Phase 9–15 frontend page in dev mode, the API wrapper auto-creates / signs you in as `you@eureka.example.com` (password `EurekaAdmin!2026`, role `org_admin`) so you don't need to manually log in. Disable with `NEXT_PUBLIC_DEV_AUTO_LOGIN=0` in `eureka/apps/web/.env.local` when you want the real flow.

> ℹ️ Older versions of this README referenced `admin@demo.edu` / `Admin123!` — that seed never actually landed in the init SQL. The auto-login account above is the one that works against a fresh `docker compose up -d`.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Frontend (Next.js 14)                                                  │
│  /                — marketing landing                                   │
│  /dashboard       — original learner surface (tier-specific pages)      │
│  /institutions    — Phase 15 workforce admin (L&D console)              │
│  /admin           — Phase 9-14 admin (cohorts, jobs, audit)             │
│  /marketplace     — Phase 10 instructor marketplace + checkout          │
│  /learner /training /transcript /settings — Phase 4-12 learner shell    │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────────────┐
│  api-core   (FastAPI gateway · auth · tenancy · audit · routing)        │
│  eureka/services/api-core — 100+ endpoints across Phases 4-15           │
└─────────────────────────────────────────────────────────────────────────┘
        │                     │                          │
┌─────────────────┐  ┌─────────────────┐  ┌────────────────────────────┐
│  Tier services  │  │  Pro-school     │  │  Horizontal                │
│  hs · ug · grad │  │  med · law      │  │  test-prep · xr            │
│  Phase 1        │  │  mba · eng      │  │  marketplace · ai-research │
│                 │  │  Phase 1        │  │  pedagogy · futures        │
│                 │  │                 │  │  Phase 2                   │
└─────────────────┘  └─────────────────┘  └────────────────────────────┘
        │                     │                          │
┌─────────────────────────────────────────────────────────────────────────┐
│  Core services + cross-cutting modules                                  │
│  tutor-llm · assess · adaptive · content · analytics · ethics           │
│  cohort_analytics · sso · lti · billing · email_lifecycle · onboarding  │
│  engagement · push_notify · study_plan · offline_sync · seo_landing     │
│  integrations · workforce · jobs · metrics · cache · autocomplete       │
└─────────────────────────────────────────────────────────────────────────┘
        │                     │                          │
┌─────────────────────────────────────────────────────────────────────────┐
│  Infra  ·  Postgres 16 (pgvector + pg_trgm + tsvector) · Redis · MinIO  │
│           ·  OpenSearch · Kafka                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Stack
- **Frontend** Next.js 14 (App Router), React 18, TypeScript, Tailwind + shadcn/ui, TanStack Query, Zustand
- **Backend** FastAPI (Python 3.11), Node/Express for some services, async SQLAlchemy
- **Data** Postgres 16 + pgvector, Redis 7, MinIO (S3-compat), OpenSearch, Kafka (events)
- **AI** Anthropic Claude (primary), OpenAI (fallback), local embeddings via pgvector
- **Infra** Docker Compose (dev), Helm + Kubernetes (prod), GitHub Actions CI

---

## Repository layout

```
eureka/                                # Phase 1+: tier services + core API + frontend
  apps/web                             # Learner + institutional + admin frontend (Next.js 14)
    src/app/                           # Route shells (each is a self-contained surface):
      page.tsx                         #   /              marketing landing
      dashboard/                       #   /dashboard     original learner surface
      institutions/                    #   /institutions  Phase 15 L&D admin (own sidebar)
        partnerships/[id]/             #     5-tab partnership detail
        cohorts/  programs/  compliance/  workers/  analytics/  audit/
      admin/                           #   /admin         Phase 9-14 admin (cohorts/jobs/audit)
      marketplace/                     #   /marketplace   Phase 10 storefront + checkout
      learner/  training/  transcript/ #   /learner /training /transcript
      settings/                        #   /settings/{subscription,api-keys,webhooks,devices,support}
    src/components/                    # Shared UI (shadcn/ui style)
    src/lib/eureka-api.ts              # API wrapper with dev auto-login + 401-redirect
  apps/admin                           # Separate admin Next.js app (legacy)
  apps/mobile                          # React Native scaffold
  services/
    api-core/                          # FastAPI gateway — auth/tenancy/audit/routing + 100+ endpoints
      app/models/                      #   ORM (Phases 9-15 add 56 new tables, 46 enums)
      app/services/                    #   Business logic (cohort_analytics, billing, study_plan, ...)
      app/api/v1/endpoints/            #   Route handlers per phase
      tests/integration/test_phase*.py #   Live integration tests, 96+ passing
    tier-{hs,ug,grad}                  # Academic tiers (Phase 1)
    pro-{med,law,mba,eng}              # Professional schools (Phase 1)
    tutor-llm/                         # AI tutor (Claude/OpenAI + RAG)
    assess/  adaptive/  content/  analytics/  ethics-security/  data-fabric/  futures/
  ops/db/                              # Postgres init SQL (alphabetical) — currently 11 → 17:
                                       #   11_institutional · 12_marketplace · 13_gtm
                                       #   14_engagement · 15_integrations · 16_ops · 17_workforce
  helm/  k8s/                          # Production deployment
  docker-compose.yml                   # Local dev (honors WEB_HOST_PORT + ADMIN_HOST_PORT from eureka/.env)

services/                              # Phase 2: horizontal microservices (separate from eureka/services/)
  test-prep/  marketplace/  xr-labs/  ai-research/
  pedagogy/  notebook/  institutions/  data-fabric/  futures/

docs/                                  # Living docs
  STATUS.md                            # Honest per-phase status (Phase 3 → Phase 15)
  ROADMAP.md                           # Phased scaling plan with done/pending markers
  ARCHITECTURE.md  PORTS.md  SECURITY.md  SECRETS.md  OBSERVABILITY.md
  archive/                             # Historical session/phase reports
```

---

## Development

```bash
# Just the infra (no services)
cd eureka
docker compose up -d db redis minio

# Frontend only (will pick up eureka/.env's WEB_HOST_PORT if set)
cd eureka/apps/web && npm install && npm run dev
# Or build a prod-mode bundle (much faster page loads, no per-route compile delay)
npm run build && PORT=4040 npm start

# One backend service
cd eureka/services/api-core && pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Tests — full suite
cd eureka && make test
# Or just one phase's integration tests against a running stack:
docker exec -e PG_DSN=postgresql://eureka:eureka_dev_password@db:5432/eureka \
  -e API_CORE_URL=http://localhost:8000 \
  eureka-api-core python -m pytest /app/tests/integration/test_phase15.py -v
```

### Database
Init SQL in [eureka/ops/db/](eureka/ops/db) runs automatically on first container start (alphabetical order). To re-init:
```bash
docker compose down -v && docker compose up -d db
```

---

## Compliance & security
- FERPA, HIPAA, COPPA, ABA scaffolding lives in `eureka/COMPLIANCE.md` and per-service compliance modules. **Scaffolding ≠ compliant deployment** — production use requires legal review.
- Demo creds are for **local dev only**. Rotate everything in `.env` before any non-dev environment.
- Report vulnerabilities to the maintainers privately, not via public issues.

---

## Documentation
- **[docs/STATUS.md](docs/STATUS.md)** — what works, what's stubbed, what's broken (the honest list). 19 phase entries through Phase 15 (workforce affiliate platform).
- **[docs/ROADMAP.md](docs/ROADMAP.md)** — phased scaling plan toward Udemy/UWorld/Khan Academy parity. Phases 1–7, 9–15 are marked ✅ done; Phase 8 (mobile + offline) is partially covered by 12.2 + 12.4.
- **[docs/PORTS.md](docs/PORTS.md)** — port allocation across services
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — deep architecture
- **[docs/SECURITY.md](docs/SECURITY.md)** — security runbook (argon2, MFA, MFA_ENVELOPE_KEY rotation)
- **[docs/SECRETS.md](docs/SECRETS.md)** — secrets management (SOPS + age, gitleaks allowlist, per-secret rotation)
- **[docs/OBSERVABILITY.md](docs/OBSERVABILITY.md)** — OpenTelemetry + structlog drop-in pattern
- **[docs/archive/](docs/archive)** — historical session/phase reports (kept for context; not current)

### Phase 9–19 surfaces at a glance
| Phase | What it added | Lives at |
|---|---|---|
| 9 — institutional / B2B | cohorts, SSO, LTI 1.3, at-risk early-warning | `/admin/cohorts` |
| 10 — marketplace + creator economy | instructor onboarding, listings, pricing, coupons, reviews, moderation | `/marketplace`, `/marketplace/[slug]` |
| 11 — GTM readiness | subscriptions + proration, programmatic SEO, email lifecycle, onboarding wizard, support tickets + KB | `/settings/subscription`, `/settings/support`, `/help` |
| 12 — engagement + adaptive learning | streaks + XP + achievements, push notifications, study plans, offline sync, live tutoring | `/learner`, `/training`, `/settings/devices` |
| 13 — platform integrations | API keys, webhooks, embed SDK, OAuth apps, audit log, GDPR/FERPA export + deletion | `/settings/api-keys`, `/settings/webhooks`, `/admin/audit` |
| 14 — production scale | Redis cache, background job queue, Prometheus metrics, autocomplete, health probes | `/admin/jobs`, `GET /api/v1/metrics` |
| 15 — workforce training affiliate platform | partnerships, programs, compliance (HIPAA / OSHA / SOC2 / GDPR), workforce analytics | `/institutions/*` (own L&D admin shell) |
| **16.1** — graduate school tier | graduate programs + enrollments + milestones (no advisors/committees per 2026-05 design); learner self-enroll | `/dashboard/graduate` (sub-nav: Overview / Programs / Enrollments / Research), `/institutions/graduate-programs` |
| **17** — no-mocks dashboard | `activity_events` + `user_collections` + `collection_items`; `/me/dashboard` rollup; 24 sidebar pages all wired to real api-core | `/dashboard/*` |
| **18** — real community + resources | `community_threads/posts/reactions` (real forum, real upvotes, accepted answers) + `learning_resources/votes` (curated catalog with tag/tier/skill filters); 15 seeded XR resources | `/dashboard/community`, `/dashboard/resources` |
| **19** — last mocks ripped + footer pages | 6 pages still calling defunct microservices rewritten ground-up; 7 missing public footer routes (`/help` wired to Phase 11.5 KB, `/blog` real changelog, `/api-docs`, `/privacy`, `/terms`, `/contact`); dev-auto-login proactive for both fetch + axios clients; shared login promise | `/help`, `/community`, `/blog`, `/api-docs`, `/privacy`, `/terms`, `/contact` |

### What's next — Phases 20–27 (path to production)
Full detail in [docs/ROADMAP.md](docs/ROADMAP.md). Each is gated and tracked:

| Phase | Block | Effort |
|---|---|---|
| **20** Deployment | Helm/K8s exists but never deployed; pick cloud, wire CD, managed Postgres/Redis/S3, custom domain + TLS, backups | 2–4 weeks |
| **21** Security | External pen test, SAST/DAST gating, rate limiting, Postgres row-level security, MFA enforcement in prod, SOC 2 Type I prep | 3–6 weeks |
| **22** Compliance | FERPA/HIPAA/COPPA/GDPR legal review, cookie consent banner, WCAG 2.1 AA audit, DSAR runbook | 4–12 weeks |
| **23** Finish Phase 16 | Graduate Research Tools (16.2–16.7): research workspace, thesis lifecycle, grants, publications, **math+stats+plotting (Wolfram-Alpha competitor)**, chemistry+biology+citation-aware Q&A | 6–10 weeks |
| **24** Real content | SME-authored items: USMLE / FE / MCAT / AP / NGSS / MBA | $400k–$3M, ongoing |
| **25** Mobile | React Native shell, offline sync UI, APNS+FCM wired, App Store + Play Store | 8–12 weeks |
| **26** GTM | Stripe Connect production onboarding, real email + SMS providers, support staffing, marketing site polish, beta cohort | parallel with 22 |
| **27** XR reconciliation | Three.js frontends point at a Node prototype on `:3005`; real service is Python on `:8070` — reconcile | 2–3 weeks |

---

## License
MIT — see [LICENSE](LICENSE).

---

Built with [Claude Code](https://claude.com/claude-code).

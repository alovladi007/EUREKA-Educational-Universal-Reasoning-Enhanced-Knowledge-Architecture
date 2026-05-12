# EUREKA

**Educational Universal Reasoning & Enhanced Knowledge Architecture** — an AI-powered learning platform spanning high school through professional schools (Medical, Law, MBA, Engineering), plus AI-driven test prep, resume building, and XR labs.

> Status: active development. Phase 1 (academic + professional tiers) and Phase 2 (horizontal services: test prep, marketplace, XR, AI research) are scaffolded. Many services are wired but not all are production-hardened. See [docs/STATUS.md](docs/STATUS.md) for honest per-service status.

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

Web app: <http://localhost:3000>  ·  Admin: <http://localhost:3001>  ·  API: <http://localhost:8000>  ·  MinIO console: <http://localhost:9005>

Demo login (seeded): `admin@demo.edu` / `Admin123!`

See [docs/PORTS.md](docs/PORTS.md) for the full port map.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  Frontend (Next.js 14)                                           │
│  apps/web · apps/admin                                           │
└──────────────────────────────────────────────────────────────────┘
                              │
┌──────────────────────────────────────────────────────────────────┐
│  api-core  (FastAPI gateway · auth · tenancy · audit · routing)  │
└──────────────────────────────────────────────────────────────────┘
        │                     │                     │
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│  Tier services  │  │  Pro-school     │  │  Horizontal         │
│  hs · ug · grad │  │  med · law      │  │  test-prep · xr     │
│  Phase 1        │  │  mba · eng      │  │  marketplace        │
│                 │  │  Phase 1        │  │  ai-research        │
│                 │  │                 │  │  pedagogy · futures │
│                 │  │                 │  │  Phase 2            │
└─────────────────┘  └─────────────────┘  └─────────────────────┘
        │                     │                     │
┌──────────────────────────────────────────────────────────────────┐
│  Core services                                                   │
│  tutor-llm · assess · adaptive · content · analytics · ethics    │
└──────────────────────────────────────────────────────────────────┘
        │                     │                     │
┌──────────────────────────────────────────────────────────────────┐
│  Infra  ·  Postgres (pgvector) · Redis · MinIO · OpenSearch · Kafka │
└──────────────────────────────────────────────────────────────────┘
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
eureka/                  # Phase 1: tier services + core API + frontend
  apps/web               # Main learner-facing Next.js app
  apps/admin             # Admin / institution console
  api-core/              # FastAPI gateway
  services/
    tier-{hs,ug,grad}    # Academic tiers
    pro-{med,law,mba,eng}# Professional schools
    tutor-llm/           # AI tutor (Claude/OpenAI + RAG)
    assess/              # Assessment engine (MCQ, essay, adaptive)
    adaptive/            # Mastery-based learning paths
    content/             # Content authoring + delivery
    analytics/           # Learner analytics + dashboards
  ops/db/                # Postgres init SQL (applied on container start)
  helm/ · k8s/           # Production deployment

services/                # Phase 2: horizontal services
  test-prep/             # MCAT, USMLE, LSAT, GRE, etc.
  marketplace/           # Course / content marketplace
  xr-labs/               # WebXR / immersive labs
  ai-research/           # Research advisor + literature tools
  pedagogy/ ethics-security/ data-fabric/ institutions/ futures/ notebook/

docs/                    # Living docs
  archive/               # Historical session/phase status reports
```

---

## Development

```bash
# Just the infra (no services)
cd eureka
docker compose up -d db redis minio

# Frontend only
cd eureka/apps/web && npm install && npm run dev

# One service
cd eureka/services/assess && pip install -r requirements.txt
uvicorn main:app --reload --port 8002

# Tests
cd eureka && make test
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
- **[docs/STATUS.md](docs/STATUS.md)** — what works, what's stubbed, what's broken (the honest list)
- **[docs/PORTS.md](docs/PORTS.md)** — port allocation across services
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — deep architecture
- **[docs/ROADMAP.md](docs/ROADMAP.md)** — phased scaling plan toward Udemy/UWorld/Khan Academy parity
- **[docs/archive/](docs/archive)** — historical session/phase reports (kept for context; not current)

---

## License
MIT — see [LICENSE](LICENSE).

---

Built with [Claude Code](https://claude.com/claude-code).

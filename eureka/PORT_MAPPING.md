# EUREKA Platform — Port Mapping

Authoritative list of host ports, **reconciled against `docker-compose.yml`**
(P0.3). The previous revision documented an aspirational 8100-series scheme
that never matched the running stack; this version reflects what the compose
file actually binds.

> Source of truth: `eureka/docker-compose.yml`. If you change a port there,
> update this file in the same commit.

## Infrastructure Services

| Service | Internal Port | Host Port | Notes |
|---------|--------------|-----------|-------|
| PostgreSQL (pgvector pg16) | 5432 | **5434** | Primary DB `eureka` + secondary DBs (test_prep, pedagogy, marketplace, institutions) |
| Redis | 6379 | **6381** | Cache, sessions, JWT blacklist (per-service logical DBs /0../15) |
| MinIO (S3) | 9000 | **9004** | Object storage |
| MinIO Console | 9001 | **9005** | Admin console |
| OpenSearch | 9200 | **9200** | Search (profile: `full`) |
| Kafka (Redpanda) | 9092 | **9092** | Message broker (profile: `full`) |
| Neo4j | 7474/7687 | **7474/7687** | Graph (profile: `full`) |
| Qdrant | 6333 | **6333** | Vector DB (profile: `full`) |
| Jaeger | 16686 | **16686** | Tracing UI (profile: `dev-obs`) |

## Core Services (host port → container 8000)

| Service | Host Port | Profile | Description |
|---------|-----------|---------|-------------|
| api-core | **8000** | default | Core API (auth, users, orgs, courses, exam, srs, …) |
| tutor-llm | **8001** | full | AI tutoring with RAG |
| assess | **8002** | full | Assessment & autograding |
| adaptive | **8003** | full | Adaptive learning engine |
| content | **8004** | full | Content management |
| analytics | **8005** | full | Analytics & reporting (FE `NEXT_PUBLIC_ANALYTICS_URL` default) |

## Academic Tier Services (host port → container 8000)

| Service | Host Port | Profile | Description |
|---------|-----------|---------|-------------|
| tier-hs | **8010** | full | High School tier (skeleton) |
| tier-ug | **8011** | full | Undergraduate tier |
| tier-grad | **8012** | full | Graduate tier |

## Professional School Services (host port → container 8000)

| Service | Host Port | Profile | Status |
|---------|-----------|---------|--------|
| pro-law | **8021** | full | Placeholder |
| pro-mba | **8022** | full | Placeholder |
| pro-eng | **8023** | full | Placeholder |

## Domain / Phase-2 Services (host port == container port)

| Service | Host Port | Profile | DB | Status |
|---------|-----------|---------|----|--------|
| medical-school | **8030** | full | eureka | REAL (NestJS) |
| pedagogy | **8040** | full | eureka_pedagogy | REAL |
| marketplace | **8050** | full | eureka_marketplace | REAL |
| ai-research | **8060** | full | — | REAL |
| xr-labs | **8070** | full | — | Skeleton |
| ethics-security | **8080** | full | — | Skeleton |
| data-fabric | **8090** | full | neo4j/qdrant | Skeleton |
| institutions | **8100** | full | eureka_institutions | Skeleton |
| futures | **8110** | full | — | Skeleton |
| notebook | **8120** | full | eureka | REAL (Node/Express) |
| test-prep | **8200** | full | eureka_test_prep | REAL (+ worker, beat) |

## Frontend Applications

| Application | Host Port | Profile | Description |
|------------|-----------|---------|-------------|
| web | **3000** | default | Main web frontend (Next.js) |
| admin | **3001** | default | Admin dashboard |

> Note: some local dev runs the web app on **4040** (see `.env.local.example`
> `NEXTAUTH_URL`). The compose container binds **3000**.

## Frontend → backend URL defaults (`apps/web/src/lib/api-client.ts`)

| Env var | Default | Target service |
|---------|---------|----------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | api-core |
| `NEXT_PUBLIC_ANALYTICS_URL` | `http://localhost:8005` | analytics |
| `NEXT_PUBLIC_MEDICAL_SCHOOL_URL` | `http://localhost:8030` | medical-school |
| `NEXT_PUBLIC_TEST_PREP_URL` | `http://localhost:8200` | test-prep |
| `NEXT_PUBLIC_FILE_STORAGE_URL` | `http://localhost:8300` | file-storage |
| `NEXT_PUBLIC_NOTEBOOK_URL` | `http://localhost:8120` | notebook |

## In-network (container→container) addressing

Services talk to each other over the `eureka-network` bridge using **internal**
names/ports, NOT the host ports above:

- Postgres: `db:5432`
- Redis: `redis:6379`
- MinIO: `http://minio:9000`
- api-core: `http://api-core:8000`

## Starting services

```bash
# Default stack (db, redis, minio, api-core, web, admin)
docker compose up -d

# Full platform (all services + opensearch/kafka/neo4j/qdrant)
docker compose --profile full up -d

# Tracing UI
docker compose --profile dev-obs up -d jaeger
```

## Health checks

```bash
curl http://localhost:8000/health   # api-core
curl http://localhost:8200/health   # test-prep
curl http://localhost:8030/health   # medical-school
```

---

**Last reconciled:** Phase 0 remediation — against `docker-compose.yml`.

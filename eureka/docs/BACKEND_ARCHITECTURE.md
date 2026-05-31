# EUREKA Backend Architecture — What's Real (P2 / Track C)

This document records the **evidence-based** map of which backend services
the platform actually depends on at runtime, versus which are scaffolds /
future work. It exists because the repo contains ~25 service directories,
most of which are NOT wired to the frontend — leading to the mistaken
impression that "the platform is 25 microservices" when in practice it is
**one core API plus five focused services**.

## How this was determined

The Next.js frontend (`apps/web`) only ever calls six base URLs. From
`apps/web/src/lib/api-client.ts`:

| Env var | Default | Service |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `:8000` | **api-core** |
| `NEXT_PUBLIC_TEST_PREP_URL` | `:8200` | **test-prep** |
| `NEXT_PUBLIC_MEDICAL_SCHOOL_URL` | `:8030` | **medical-school** |
| `NEXT_PUBLIC_NOTEBOOK_URL` | `:8120` | **notebook** |
| `NEXT_PUBLIC_FILE_STORAGE_URL` | `:8300` | **file-storage** |
| `NEXT_PUBLIC_ANALYTICS_URL` | `:8005` | **analytics** |

The domain dashboard pages (`/dashboard/marketplace`, `/graduate`,
`/pedagogy`, `/institutions`, `/research`, …) issue **no direct fetch to a
standalone service** — they go through `apiClient` → **api-core**, which
implements those domains as endpoint modules (`marketplace.py`,
`graduate.py`, `institutional.py`, `research.py`, `gtm.py`, `engagement.py`,
…). api-core is the modular monolith that backs the whole product.

## Tier 1 — FE-facing runtime backends (these MUST work)

These are the only services the product actually needs running. Boot status
verified live this session:

| Service | Port | Kind | Status |
|---|---|---|---|
| **api-core** | 8000 | FastAPI (modular monolith — all learning domains) | ✅ healthy; DB `db:5432`, unified JWT |
| **test-prep** | 8200 | FastAPI (QBank, exams, flashcards, SRS, patent-bar) | ✅ healthy; api-core SSO bridge verified |
| **notebook** | 8120 | Node/Express (projects, tasks, files, payments) | ✅ healthy; SSO bridge fixed (P2) |
| **file-storage** | 8300 | FastAPI (uploads via MinIO) | ✅ healthy |
| **analytics** | 8005 | FastAPI (dashboards) | ✅ healthy; async-driver crash fixed (P2) |
| **medical-school** | 8030 | NestJS (med-ed content) | ⏳ builds; in `full` profile |

Infra they depend on: Postgres (`db`), Redis, MinIO. (Neo4j/Qdrant/Kafka/
OpenSearch are declared but only used by Tier-3 services below.)

## Tier 2 — orphaned standalone domain services (NOT wired to the FE)

These have real-ish code but **nothing calls them** — api-core serves their
domain to the frontend. They are best understood as **future
microservice-extraction targets** (decompose api-core later), not shippable
features today.

`assess`, `adaptive`, `content`, `tutor-llm`, `pedagogy`, `marketplace`,
`ai-research`, `institutions`, `data-fabric`, `ethics-security`, `futures`,
`xr-labs`

**Decision: KEEP but DON'T BUILD OUT.** They stay in the compose `full`
profile so they don't slow the default boot and remain available for future
extraction work. Several share the same `create_async_engine`-fed-a-sync-URL
crash analytics had (P2 fixed analytics because it's FE-facing); the rest
would each need that one-line coercion *if and when* they're wired to the FE.
Do not invest in them until there's a concrete product reason to split a
domain out of api-core.

## Tier 3 — placeholder shells (scaffolds only)

Pure `{"implemented": False}` health-only stubs (0 routers): `pro-law`,
`pro-mba`, `pro-eng`, `tier-hs`, `tier-ug`, `tier-grad`.

**Decision: CUT from the product roadmap as separate services.** The
professional/academic *tiers* already exist as content + curriculum inside
api-core and the FE (e.g. the test-prep exams cover the professional tracks).
These per-tier microservices duplicate that intent with empty shells. Keep
the directories for now (harmless, in `full` profile) but they are explicitly
NOT on the path to "fully functioning" — building six empty FastAPI apps that
nothing calls is waste. If a tier genuinely needs its own service later, it
should be created deliberately with a real FE consumer, not resurrected from
these stubs.

## Practical implication for "boot the platform"

- **Default profile** (no `--profile full`): `db`, `redis`, `minio`,
  `api-core`, `web`, `admin`, `file-storage` — the minimum to run the core
  product.
- **`--profile full`**: adds the rest (test-prep, notebook, medical-school,
  analytics, + all Tier-2/Tier-3 services). For a working *product*, only
  the Tier-1 six matter; the Tier-2/3 containers starting (or not) does not
  affect the FE beyond the specific dashboard areas they'd one day own.
- The host may have a **Kafka port conflict** (`:29092`) with unrelated
  projects; Tier-1 services don't need Kafka, so start them with
  `--no-deps` or stop the conflicting container.

_Last updated: P2 Track C. Supersedes the stale page-map in SERVICE_MAP.md
(which still references the old `:4500` web port)._

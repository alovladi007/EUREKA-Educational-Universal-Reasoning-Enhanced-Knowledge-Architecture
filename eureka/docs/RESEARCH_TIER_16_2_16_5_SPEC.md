# Phase 16.2 / 16.5 Build Spec — Research Workspace & Publications

**Status:** design input, ready to execute when Phase 16.2 starts.
**Decision date:** 2026-07-23.
**Source material:** `github.com/alovladi007/Research-Blog` ("ScholarHub") — a
dormant Aug–Nov 2025 Next.js + Prisma prototype of a research-collaboration
platform. Reviewed 2026-07-23; kept as **reference only** (archive it).

---

## 1. Decision record

**Port, don't run.** ScholarHub is a standalone monolith with its own user
table, its own JWT auth (committed in a bypassed state — see its
`AUTH-BYPASS-GUIDE.md`), and its own Prisma/Postgres schema. Running it beside
EUREKA (AXIOM-style) would mean a second identity store, a second compliance
surface, and re-running the entire hardening program we already completed on
EUREKA (auth bypass removal, claim-accuracy passes, build gating). Instead:

- **Schema** → translate the useful Prisma models into api-core SQLAlchemy +
  `ops/db` init SQL (keep the ORM ↔ SQL convergence CI gate happy).
- **Frontend components** → lift into `apps/web` (both sides are
  Next + Tailwind + Radix; components move with minor edits).
- **API routes** → rewrite in FastAPI against the ported models. The Next.js
  route handlers themselves are not worth porting.

**What was pulled forward immediately into Community** (done in the community
depth wave, independent of Phase 16): LaTeX math rendering in the shared
`Markdown` component, nested replies UI, typed reactions UI.

---

## 2. Schema translation table

ScholarHub Prisma model → EUREKA api-core target. "New table" means a new
SQLAlchemy model + `ops/db` init SQL + Alembic migration, org-scoped
(`org_id`) like every other EUREKA table.

| ScholarHub model | Target | Phase | Notes |
|---|---|---|---|
| `User` | **existing `users`** | — | Do NOT port. Add nullable `orcid_id` column when 16.5 starts. |
| `Project` | new `research_projects` | 16.2 | title, abstract, status, visibility; FK `org_id`, owner `user_id`. Links to 16.1 graduate `programs`/`milestones` where applicable. |
| `ProjectMember` | new `research_project_members` | 16.2 | role enum (owner/collaborator/advisor/viewer); unique (project, user). |
| `Group` | new `research_groups` | 16.2 | labs/reading groups. Distinct from study-groups (future community wave). |
| `GroupMember` | new `research_group_members` | 16.2 | role enum (pi/member/alumni). |
| `Bookmark` | new `reading_list_items` | 16.2 | Rename honestly: it's a reading list. FK to `research_papers` or external URL + metadata. |
| `Paper` | new `research_papers` | 16.5 | title, abstract, authors (jsonb), venue, year, doi, arxiv_id, url, uploaded file via existing file-storage service. |
| `Review` | new `paper_reviews` | 16.5 | Port the good logic: no self-review, unique (paper, reviewer), notification fan-out via EUREKA's existing notification system. **Label as "community peer feedback", not "peer review"** — it is not a journal workflow. |
| `Attachment` | **existing file-storage service** | — | Do not port; EUREKA already has one. |
| `Message` / `ChatRoom` | **skip** | — | DM/chat deferred until moderation tooling exists (compliance: minors on platform). |
| `Notification` | **existing notifications** | — | Do not port. |
| `Follow` | new `scholar_follows` | 16.5 | follower → followed user, for scholarly profiles only. Defer if scope tight. |
| `PostView` / `PaperView` | new `paper_views` (only) | 16.5 | For honest on-platform impact stats. |
| `RecommendationFeedback`, `ABTest*`, `ContentEmbedding` | **skip** | — | EUREKA's own analytics + (future) pgvector stack is the right base; ScholarHub's recommender is a hand-rolled points heuristic. |

## 3. Component lift list (`apps/web`)

| ScholarHub component | State in source | Action |
|---|---|---|
| `features/citation-manager.tsx` | Real APA/MLA/Chicago formatters, **never mounted** | Lift for 16.2 lit-review surface; add BibTeX export (missing). |
| TipTap editor setup (`CreatePost.tsx` deps: starter-kit, mentions, code-block-lowlight, placeholder, link) | Working config | Lift as the research writing editor. |
| `features/latex-renderer.tsx` | Correct katex usage, **never mounted**; the live PostCard math path is broken (`dangerouslySetInnerHTML` re-wrapping `$…$`, katex never called) | Do NOT lift. EUREKA's `components/ui/markdown.tsx` now does math correctly via remark-math + rehype-katex. |
| `recommendations/*`, `chat/ChatWindow.tsx` | Heuristic / unmounted | Skip. |

## 4. Net-new work the prototype does NOT cover

**16.2 (the real substance of "lit review"):**
- Server-side paper search: arXiv API + Crossref (+ PubMed for medical tier).
- BibTeX import/export.
- Paper annotations / highlights.
- Citation graph (defer to 16.6/16.7 if heavy).

**16.5:**
- Publication claiming + dedup (match by DOI, then title fuzz).
- Co-author linking to EUREKA accounts.
- Public scholarly profile page (`/scholar/{handle}` — public route, like `/r/{shareId}` resumes).
- Real ORCID OAuth (the prototype's "ORCID integration" is a text field).
- **Metrics honesty rule:** no fabricated citation counts / h-index. Either
  integrate a real source (OpenAlex is free and permissive; Crossref
  citation counts) or show only on-platform stats (views, saves, feedback
  count) with explicit labels. Never seed fake numbers.

## 5. Session plan

- **R-1 — Workspace core:** port schema (projects, members, groups,
  reading lists), migrations + init SQL + drift check, CRUD endpoints,
  workspace UI under `/dashboard/research` (extends the existing research
  module page), TipTap editor mount.
- **R-2 — Papers + feedback + profile:** `research_papers`, `paper_reviews`
  (community-feedback labeling), `paper_views`, profile ORCID field, private
  profile view.
- **R-3 — Lit review integrations:** arXiv/Crossref search endpoints,
  BibTeX import/export, reading-list flows, citation-manager mount.
- **R-4 — Public scholarly profiles + honest metrics:** public profile route,
  publication claiming, OpenAlex integration (or explicit on-platform-only
  stats), verify + docs.

**Timing:** after the Patent Bar monetization tail (Stripe live keys, SME
review) — this spec exists so R-1 starts from a settled design, not to pull
Phase 16 forward.

## 6. Guardrails carried over

- No fabricated content, counts, or metrics — real data or honest empty state.
- Claim accuracy: every marketing/description string must match what renders.
- Auth on every non-public route at the router level; public routes are an
  explicit, documented choice (public scholarly profiles).
- ORM ↔ init-SQL convergence maintained; CI drift gate stays green.
- Browser-verify each surface before claiming done.

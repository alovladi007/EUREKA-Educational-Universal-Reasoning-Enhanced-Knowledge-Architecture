# EUREKA Scaling Roadmap

A phased plan to take EUREKA from "ambitious scaffold" to a platform competitive with **Udemy**, **Khan Academy**, **UWorld**, and **Wysebridge** — across course delivery, K-12 mastery learning, professional test prep, and engineering licensure prep respectively.

Each phase is broken into **sessions**. Each session is sized to ~1–3 days of focused agent work and ends in something demoable. Each session has a self-contained agent prompt at the bottom of this document.

---

## Strategic positioning: where EUREKA wins, where it has to catch up

| Competitor | Their moat | EUREKA's gap | EUREKA's angle |
|---|---|---|---|
| **Udemy** | 200k+ courses, instructor marketplace, certificates, sales engine | Content volume, video infra, instructor onboarding flow | AI co-teaching layer + cross-tier credit (HS → Pro) |
| **Khan Academy** | Curated K-12/early-college content, mastery model, parent/teacher dashboards, free tier, Khanmigo | Decades of expert-authored content, brand trust, mobile UX | LLM-native: dynamic content generation, multilingual on-demand, cheaper to scale |
| **UWorld** | Industry-standard exam-bank quality (USMLE, MCAT, NCLEX, CPA), detailed explanations, exam-realistic UI | Question quality + medical/legal/CPA SME pipeline; performance analytics depth | Bring AI-tutoring + adaptive sequencing on top of question banks → faster pass rates per study hour |
| **Wysebridge / PPI2Pass** | FE/PE engineering test prep with strong analytics | Mature engineering question bank, mock exams aligned to NCEES | Tighter integration across UG engineering tier → FE → PE (single learner journey) |

**Where EUREKA can credibly win in 12–18 months:**
1. **The only AI-native platform that spans HS → Professional**. Cross-tier identity, transcript, and skill graph that no incumbent offers.
2. **Adaptive question generation**: while UWorld licenses static banks, EUREKA can generate (and human-review) variants from the same blueprint — pushing per-blueprint coverage 10–100×.
3. **Institutional resale**: multi-tenant from day one means schools / bootcamps can white-label.
4. **Verifiable AI tutoring**: explanations that cite sources (pgvector RAG over licensed corpora), with a "show your work" trace — addressing the "AI hallucination" trust gap competitors haven't solved.

**Where EUREKA should NOT try to compete head-on early:**
- Building Udemy-scale instructor marketplace (network effects, takes 5+ years).
- Replacing Khan Academy's curated content (their curriculum team is a decade ahead — partner or license instead).
- Authoring proprietary medical/legal/CPA question banks from scratch (license + augment with AI variants is faster and defensible).

---

## Roadmap shape

```
Phase 3  Foundation hardening      (sessions 1–6, ~2–3 weeks)
Phase 4  Cross-tier learner spine   (sessions 7–11, ~2 weeks)
Phase 5  Content & question bank   (sessions 12–18, ~3–4 weeks)
Phase 6  AI tutor depth             (sessions 19–23, ~2–3 weeks)
Phase 7  Exam-realism + analytics  (sessions 24–28, ~2 weeks)
Phase 8  Mobile + offline           (sessions 29–32, ~2 weeks)
Phase 9  Institutional / B2B        (sessions 33–36, ~2 weeks)
Phase 10 Marketplace + creator econ (sessions 37–41, ~3 weeks)
Phase 11 Go-to-market readiness    (sessions 42–46, ~2 weeks)
```

Each phase is independently shippable. You can pause, ship the user-facing changes, gather data, then return to the next phase.

---

# Phase 3 — Foundation hardening

**Goal**: Make what already exists actually rock-solid before piling on features. Pass tests, fix duplication, secure the perimeter, get CI green, get observability in place.

## Progress

| Session | Status | Notes |
|---|---|---|
| 3.1 Reconcile service duplication | ✅ done 2026-05 | 3 overlap pairs + 1 dup api-core dir resolved. -8,152 LOC. See commit `2bfec9ec`. |
| 3.2 Test + CI baseline | ✅ done 2026-05 | Matrix CI for all 20 Python + 4 Node services; gitleaks; schema-drift check; Makefile `test-all`. Found + fixed 2 real bugs (analytics datetime, assess models). See commits `241282c4`, `736c0b45`. |
| 3.3 Auth + tenancy hardening | ✅ done 2026-05 | argon2id (with bcrypt→argon2 transparent rehash on login); TOTP MFA full enrolment + step-up + recovery codes (Fernet-encrypted at rest); 5-test cross-tenant isolation integration test (passing live); security-headers middleware (HSTS prod-only, nosniff, frame DENY, Referrer-Policy, Permissions-Policy, CSP); JWT/MFA-key fail-loud boot check in prod; SECURITY.md runbook. Caught 3 more schema-drift bugs along the way. |
| 3.4 Observability | ✅ done 2026-05 | OpenTelemetry tracing (FastAPI + SQLAlchemy + Redis + httpx + logging instrumentors) wired into api-core and tutor-llm via a reusable `app/core/observability.py` module; Jaeger added to compose under `--profile dev-obs` (UI :16686, OTLP :4317/:4318); structlog producing JSON logs with `service`, `request_id`, `user_id`, `org_id`, `trace_id`, `span_id`; `RequestContextMiddleware` carries the request id end-to-end via the `X-Request-ID` header; `docs/OBSERVABILITY.md` documents the pattern + how to add it to a new service. Traces verified live (one login → 15 spans in Jaeger). |
| 3.5 Secrets + config | ✅ done 2026-05 | Untracked 3 committed `.env` files (placeholder content, no real leaks); SOPS+age scaffolding (`.sops.yaml` + `secrets/dev.enc.yaml.template`); `.gitleaks.toml` with placeholder allowlist wired into CI; comprehensive `docs/SECRETS.md` runbook covering setup, runtime loading (local/CI/prod), and per-secret rotation procedures for JWT_SECRET / MFA_ENVELOPE_KEY / Anthropic / OpenAI / Stripe / SMTP / DB. |
| 3.6 Frontend cleanup + design system | 🟡 partial 2026-05 | `web` build re-tightened to gating in CI. Added missing shadcn components (`scroll-area`, `alert`) + Radix Slot pattern on `Button` (`asChild` prop). Installed missing deps (`@radix-ui/react-scroll-area`, `react-syntax-highlighter`). Patched `ReactMarkdown` v10 `inline`-prop removal in ai-tutor. Wrapped 4 pages using `useSearchParams()` in Suspense to fix Next 14 static-gen bailout. Next.js typescript/eslint build gates set to non-blocking until follow-ups land (real type-check still runs in CI as a separate non-gating step). Storybook + Lighthouse CI deferred — tracked in BACKLOG. |

## Session 3.1 — Reconcile service duplication

**Problem**: `services/ai-tutor` (TS) and `eureka/services/tutor-llm` (Python) overlap. `eureka/services/medical-school` (NestJS) and `pro-med` (FastAPI) overlap. `web-hs`, `web-ug`, `web-grad` stubs duplicate `web`.

**Deliverables**
- Pick one canonical implementation per overlap. Delete the loser.
- Migrate any unique features from the loser before deletion.
- Update docker-compose, package.json, docs/STATUS.md.

**Success criteria**
- `docker compose --profile full up -d` runs with no duplicate services.
- `make test` passes (or at least stops failing because of duplicate symbols).
- `docs/STATUS.md` accurately reflects the post-merge layout.

**Recommendation (justified in the prompt below):**
- Keep Python `tutor-llm`, drop TS `ai-tutor` (Python already integrates Claude end-to-end and has more code).
- Keep `pro-med` (FastAPI matches the rest of the stack), drop NestJS `medical-school` (port any unique modules).
- Delete `web-hs`, `web-ug`, `web-grad` stubs; use `apps/web` with `/tiers/[tier]/` dynamic routes.

## Session 3.2 — Test + CI baseline

**Deliverables**
- Per-service: minimum pytest/jest scaffolding, `/health` test, one happy-path integration test.
- `.github/workflows/ci.yml` builds every service on PR, runs tests, runs lint, fails on coverage <40%.
- Add a single repo-level `make test-all` that runs everything in parallel.

**Success criteria**: green CI badge on `main`. Coverage report uploaded to a known artifact path.

## Session 3.3 — Auth + tenancy hardening

**Deliverables**
- Replace demo seeded password with `argon2id`-hashed first-login flow.
- Add MFA (TOTP) for admin / instructor roles.
- Tenancy middleware: enforce `org_id` injection on every row write and read; add automated test that proves cross-org reads fail.
- Rotate the JWT secret on every deploy via env; document rotation procedure.

**Success criteria**: cross-tenant data leak test fails when middleware is removed. Passes when middleware is in place.

## Session 3.4 — Observability

**Deliverables**
- OpenTelemetry instrumentation on every Python service (FastAPI middleware) and Node service.
- Single OTLP collector → either local Jaeger (dev) or Honeycomb/Datadog (prod-ready toggle).
- Structured JSON logs with `request_id`, `user_id`, `org_id`, `service`.
- A Grafana / equivalent dashboard JSON committed under `eureka/monitoring/`.

**Success criteria**: from one user click in the UI you can pull the full distributed trace across api-core → tutor-llm → assess.

## Session 3.5 — Secrets + config

**Deliverables**
- Drop in `infisical`/`doppler`/`sops` (pick one) for prod secrets. Dev keeps `.env`.
- Audit all `.env.example` files; remove anything that's actually a real format example masquerading as a key.
- Document the rotation runbook in `docs/SECURITY.md`.

**Success criteria**: no secret in plaintext in any committed file, verified by `gitleaks` in CI.

## Session 3.6 — Frontend cleanup + design system

**Deliverables**
- Adopt one component library consistently (looks like shadcn/ui is mostly there — finish it).
- Build out the design tokens (colors, spacing, typography) once, in `apps/web/src/styles/tokens.css`.
- Storybook for the 30 most-used components.
- Lighthouse score ≥ 90 on the homepage + dashboard.

**Success criteria**: Storybook deployed; Lighthouse passes in CI.

---

# Phase 4 — Cross-tier learner spine

**Goal**: A single learner identity, transcript, and skill graph that follows them from HS → UG → Grad → Professional. This is the structural moat no competitor has.

## Session 4.1 — Unified learner profile

Schema + API. One `user` row, one `learner_profile`, but **N `tier_enrollments`** (a learner can be enrolled in HS while also taking a USMLE prep course). Profile collects: knowledge state, learning preferences, accessibility needs, language.

## Session 4.2 — Skill graph + competency model

A directed graph of skills/competencies (~5k nodes seeded from CCSS, NGSS, ABET, USMLE blueprint, MBE outline, MBA core, FE/PE outline). Each course, question, and content item tags into the graph. Mastery is computed per node.

## Session 4.3 — Universal transcript service

A signed, exportable JSON record (LRMI + Open Badges 3.0 compatible) of everything a learner has completed. Verifiable cryptographically. Issuable to external systems (Credly, LinkedIn).

## Session 4.4 — Cross-tier recommendation

Given the skill graph + transcript + goals: "what should I do next?" Bridges tiers (e.g., a high schooler interested in medicine sees a Pre-Med Bridge unit that pulls from UG + Pro-Med).

## Session 4.5 — Single learner UI shell

`apps/web` reorganises so the home is the learner's personal dashboard, not a tier picker. Tier UI becomes a contextual switcher inside one shell.

---

# Phase 5 — Content & question bank

**Goal**: This is where EUREKA either becomes a real platform or stays a tech demo. Content is the moat.

## Session 5.1 — Question bank schema + import pipeline

Schema that supports: stem, options, correct answer(s), explanation (long-form + sources), tags (skill graph + difficulty + Bloom's level + exam alignment + media), variant family ID, license metadata, review state.

Importers for: CCSS-tagged content, OpenStax, NCEES sample problems, FERPA-cleared institutional banks, LibreTexts, OER Commons.

## Session 5.2 — AI variant generator

For every base question: generate 5–20 variants that swap surface features (numbers, names, contexts) while preserving the underlying skill being tested. Validated by:
- AI cross-grader (two-model consensus)
- Difficulty IRT calibration after first 200 attempts
- Human SME review queue for any variant the cross-grader flags

This is the move that lets EUREKA match UWorld's bank size at 1/100th the SME cost.

## Session 5.3 — Content authoring UI

Notion-style editor with: skill graph autocomplete tagging, Bloom's level dropdown, real-time AI fact-check, attached source citations required, peer-review workflow.

## Session 5.4 — License + provenance tracking

Every content item has a license (CC-BY, proprietary, licensed-from-X). Renderer respects license (e.g., shows attribution).

## Session 5.5 — Seed HS content

Partner with / license content for the HS tier. Targets: Algebra 1/2, Geometry, Biology, Chemistry, Physics, AP US History — to be at "Khan Academy minus the brand" depth.

## Session 5.6 — Seed Med + Engineering test prep

Med: 500 USMLE Step 1 stems with explanations (purchased license + AI variants). Eng: 300 FE/PE practice problems (NCEES sample + commissioned + AI variants).

## Session 5.7 — Search + discoverability

OpenSearch with multilingual analyzers; semantic search via pgvector. Faceted by tier, skill, difficulty, license, language.

---

# Phase 6 — AI tutor depth

**Goal**: The tutor is not a chatbot. It's a Socratic teaching agent that knows the learner, knows the curriculum, and never hallucinates.

## Session 6.1 — RAG infrastructure

pgvector over the entire question bank, content library, and licensed corpora. Reranker. Citation enforcement: model output must cite a retrieved chunk or be rejected.

## Session 6.2 — Tool use for the tutor

Tools: `lookup_skill_state(user, skill_id)`, `get_question(skill_id, difficulty)`, `grade_attempt(question_id, answer)`, `recommend_next(user)`, `show_diagram(concept_id)`, `run_code(snippet)`, `simulate_circuit(...)`.

The tutor decides which tool to call. Outputs become trace logs the learner can inspect ("how did you know that?").

## Session 6.3 — Socratic mode

Default tutor behaviour is to ask leading questions, not give answers. Hint ladder: nudge → partial → full. Track which level the learner needed; feeds back into mastery.

## Session 6.4 — Anti-hallucination guardrails

- Every factual claim must trace to a citation.
- Cross-model consensus check on free-form explanations.
- Learner-facing "report a hallucination" button → SME queue.
- Live metrics: groundedness score, contradiction rate.

## Session 6.5 — Voice + multilingual

OpenAI Realtime / Anthropic voice for spoken tutoring. Real-time translation so a Spanish-speaking learner gets the same lesson as English. This is where EUREKA undercuts Khan Academy globally.

---

# Phase 7 — Exam realism + analytics

**Goal**: For test-prep tiers, learners practice in an environment **indistinguishable** from the real exam, and get analytics that beat UWorld's.

## Session 7.1 — Exam-realistic UI shells

Per-exam: USMLE (Prometric-look NBME shell), MCAT (AAMC-style), LSAT (LSAC-look), GRE, FE/PE (NCEES Pearson VUE shell), bar exam (UBE). Same keyboard shortcuts, same timer behaviour, same flag/strike-through tools.

## Session 7.2 — IRT-based scoring + scaled scores

Item Response Theory model fitted on the bank. Output a scaled score mapped to predicted real-exam score with confidence interval. Calibrate against published pass/fail thresholds.

## Session 7.3 — Granular performance analytics

Per skill: % correct, time-per-question, peer percentile, mastery trajectory. Strength/weakness map. "Most-missed topic for people who pass" — the UWorld killer feature.

## Session 7.4 — Mock exams + diagnostic test

Full-length, time-locked, IRT-balanced mocks. One-click diagnostic generates a 50-question test that estimates skill state across the whole exam.

## Session 7.5 — Spaced repetition scheduler

Anki-style scheduler tuned per learner via the mastery model. Pushes missed-and-decayed questions back at the optimal interval.

---

# Phase 8 — Mobile + offline

## Session 8.1 — React Native shell
## Session 8.2 — Offline content sync (most-recent N questions, downloaded videos)
## Session 8.3 — Native push notifications + streaks
## Session 8.4 — Apple Pencil / stylus support for math + diagram problems

---

# Phase 9 — Institutional / B2B  ✅ done (sessions 9.1–9.4)

## Session 9.1 — Institution admin console ✅
Cohorts + memberships + cohort↔blueprint links (6 tables in `11_institutional.sql`);
20 REST endpoints under `/api/v1/cohorts/*`; role-gated to org_admin/super_admin/teacher.

## Session 9.2 — LTI 1.3 + xAPI export ✅
Full LTI 1.3 Tool implementation: 2048-bit RSA keypair (private PEM Fernet-encrypted in `lti_keys`);
public `/api/v1/lti/.well-known/jwks.json`; OIDC initiation; launch JWT verified against platform JWKS
with state+nonce; AGS grade passback via JWT-bearer client_credentials; attempt → xAPI Tin Can statement export.

## Session 9.3 — Cohort analytics + at-risk early-warning ✅
`/cohorts/{id}/analytics` aggregates over Phase 7 attempts + mocks + mastery.
`/cohorts/{id}/at-risk` ranks learners by `combined = 0.35·mastery + 0.20·engagement + 0.20·trajectory + 0.25·mock`;
each row carries explanation notes (e.g. "only 0/3 target skills at threshold (0.85)").

## Session 9.4 — SSO (OIDC) ✅
Per-org OIDC config CRUD (client_secret Fernet-encrypted at rest, never returned in API responses);
`/sso/{id}/authorize` → IdP with state+nonce; `/sso/{id}/callback` validates id_token vs JWKS,
JIT-provisions the user, optional auto-cohort enroll, then issues the same TokenResponse as `/auth/login`.

---

# Phase 10 — Marketplace + creator economy  ✅ done (sessions 10.1–10.5)

## Session 10.1 — Instructor signup, KYC, payout ledger ✅
`instructor_profiles` + `instructor_kyc_events` + `instructor_payouts` in
`12_marketplace.sql`. Stripe Connect Express onboarding wired via
`POST /api/v1/instructors/me/onboard` — falls back to a self-contained stub
when `STRIPE_SECRET_KEY` is unset, so dev/CI/tests run end-to-end without
hitting Stripe. Weekly payout accrual (`accrue_period`) walks paid purchases
and computes gross/platform_fee/payment_fee/net per period.

## Session 10.2 — Course authoring v2 + revenue-share previews ✅
`course_listings` (slug, hero, tags, language, level, status,
denormalised review/enrolment/rank signals) + `course_pricing`
(list / sale / sale window / is_free / bulk_tiers). Authoring lifecycle:
draft → pending_review → published / rejected / unlisted with admin gating.
`GET /courses/{id}/price-quote` returns the full split (list, sale, coupon,
final, platform_fee, instructor_net) — the revenue-share preview the
creator sees before pricing decisions.

## Session 10.3 — Recommendation + ranking algorithm ✅
`marketplace_ranking.recompute_listing()` writes a `rank_score` per published
listing from a 6-signal formula:
`rank = 0.35·log(sales_30d) + 0.25·rating + 0.15·completion + 0.10·freshness + 0.10·log(enrolled) − 0.15·refund_rate`.
`POST /admin/marketplace/recompute-ranks` runs the batch; `GET /marketplace/courses`
serves the ranked feed (with optional `?q=` text + `?tag=` filter).

## Session 10.4 — Promotional engine (coupons, cohort discounts) ✅
`coupons` + `coupon_redemptions` with 5 scopes (global/org/course/cohort/category)
and 2 kinds (percent / amount_off). Validation enforces time window, max
redemptions, per-user limit, and scope match. `GET /coupons/{code}/preview?course_id=`
returns a full `PriceQuote` showing exactly what the learner would pay,
including which constraint blocked an invalid coupon ("expired", "already used",
"cap reached"). Atomic at checkout: a `coupon_redemptions` row is written
inside the same transaction that confirms the purchase.

## Session 10.5 — Trust + safety (moderation queue + takedown flow) ✅
`content_reports` + `moderation_actions` with 11 reasons including
`medical_misinformation` + `safety_critical` for the clinical content surface.
Admins triage via `GET /admin/reports?status=open` (sorted by severity asc, then
created_at). 7 action kinds: `unlist` (drop from marketplace),
`takedown` (also flip `course.is_active=false`), `shadow_ban`
(force `rank_score=-999`), `redact` (flag a review), `restore`, `notify_creator`,
`suspend_instructor`. Every action emits a row in `moderation_actions` for
audit.

---

# Phase 11 — Go-to-market readiness  ✅ done (sessions 11.1–11.5)

## Session 11.1 — Billing maturity ✅
`subscription_plans`, `subscriptions`, `payment_methods`, `invoices`,
`refunds`, `dunning_attempts`, `tax_rates` in `13_gtm.sql`. `services/billing.py`
covers proration math (credit + new charge + net), tax lookup with region
precedence, and an exponential dunning schedule (1d → 3d → 7d → 14d → abandon).
Endpoints: `/plans`, `/me/subscription` lifecycle, `/me/subscription/change`
returns a `ProrationResponse`, `/admin/tax-rates`, `/tax-quote`,
`/me/refunds` + `/admin/refunds/{id}/approve`, `/admin/invoices/{id}/dunning`.

## Session 11.2 — Programmatic SEO ✅
`skill_landing_pages` with one row per (skill_code, framework, locale).
`services/seo_landing.generate_or_refresh(skill)` writes H1, meta title/desc,
FAQ array, schema.org Course + FAQPage JSON-LD, body_md, related published
listings. Admin draft → publish via `POST /admin/seo/skill-pages/generate`;
public `GET /seo/skill-pages/{slug}`.

## Session 11.3 — Email lifecycle ✅
`email_templates` + `email_campaigns` + `email_sends` + `email_unsubscribes`.
`services/email_lifecycle.dispatch(event, user_id, payload)` looks up active
campaigns, renders `{{ user.first_name }}` mustache merges, respects
`all`/`marketing`/per-campaign unsubscribes, queues a send, and (when
`RESEND_API_KEY` is set) delivers via Resend; otherwise stays in `queued`
state for the dev/test harness.

## Session 11.4 — Onboarding wizard + first-15-min experience ✅
`onboarding_states` (one row per user, current_step, step_history, the four
key timestamps: started/first_recommendation/first_attempt/first_session) +
`onboarding_events` (audit trail). Linear state machine: created → tier_selected
→ goal_set → placement_taken → first_recommendation_shown →
first_question_attempted → first_session_complete → fully_onboarded.
`/me/onboarding`, `/goal`, `/advance`, and admin funnel
`/admin/onboarding/funnel` (avg time-to-first-value).

## Session 11.5 — Customer support + knowledge base ✅
`support_tickets` + `support_messages` (with `is_internal_note` flag) +
`kb_articles` with a Postgres tsvector + trigger keeping it refreshed on
title/summary/body change. Tickets: create / list / thread (internal notes
hidden from end-users) / reply (auto-flips status awaiting_user ↔ awaiting_team) /
admin patch. KB: `GET /kb?q=` full-text search, `GET /kb/{slug}` increments
view_count, `POST /kb/{slug}/feedback`.

---

# Phase 12 — Engagement + adaptive learning  ✅ done (sessions 12.1–12.5)

## Session 12.1 — Streaks + XP + achievements ✅
`engagement_states` (per-user current_streak_days / longest / xp / level) +
`xp_events` audit log + `achievements` catalog + `user_achievements`.
`services/engagement.record_activity(source)` is the single entry point:
updates daily streak (continue if last_active = yesterday, reset if older,
no-op if today), awards XP per `XP_RULES`, adds first-of-day streak bonus,
evaluates achievement triggers (`streak_at_least`, `xp_at_least`, `level_at_least`,
`source_count`) and returns `{xp_awarded, new_total_xp, new_level, leveled_up,
streak_days, streak_started_or_continued, streak_broken, new_achievements[]}`.
Public `/leaderboard?period_days=N&limit=` for global or trailing-window XP.

## Session 12.2 — Push notifications ✅
`notification_devices` + `push_notifications`. `services/push_notify.enqueue()`
fans out one row per active device, respecting per-kind opt-out in
`device.preferences`. Delivery wires up to APNs / FCM / WebPush when the
relevant env keys are set; otherwise rows stay `queued` (dev / CI mode).
12 notification kinds covering streaks, study-plan, mastery, live sessions,
support replies. `/me/devices` register / list / revoke; `/me/notifications`
history; `/me/notifications/{id}/mark-opened` to track open rate.

## Session 12.3 — Adaptive study plan ✅
`study_plans` + `study_plan_weeks`. Generator
(`services/study_plan.generate`) scores each framework skill by
`mastery_gap × (0.5 + prereq_readiness)` (uses Phase 4.2 graph), spreads
them round-robin across the weeks between today and `target_date`, marks
week 0 as diagnostic, every 4th and the final as mock, the penultimate
as review. Each week gets pre-picked `recommended_item_ids[]` from the
Phase 5 item bank tagged to that week's skills. Regenerating a plan
archives any prior `active` plan for the same (user, framework).

## Session 12.4 — Offline sync ✅
`offline_bundles` (etag = sha256 of canonical JSON payload) +
`offline_sync_receipts` (replay log when device comes back online).
`GET /me/offline-pack` returns 200 + ETag header on a new pack, 304 when
`If-None-Match` matches the current pack. `POST /me/offline-pack/replay`
accepts a batch of attempts the device captured offline. Pack content
is the learner's weakest-skill items first, falling back to most-recent.

## Session 12.5 — Live tutoring marketplace ✅
`live_sessions` (instructor-led video sessions, capacity + booked_count +
target_skill_codes) + `live_session_bookings` (status, seat_number,
cancel_reason). Free sessions auto-confirm; paid ones stay `pending`
until tied to a marketplace purchase. Instructor `POST /live-sessions/{id}/cancel`
cancels every open booking with a single rationale. `GET /live-sessions?skill_code=&limit=`
serves the public catalog of upcoming sessions.

---

# Phase 13 — Platform integrations + extensibility  ✅ done (sessions 13.1–13.5)

## Session 13.1 — API keys ✅
`api_keys` (key_id + hashed secret, scopes[], per-key rate limit,
expires_at, status) + `api_key_usage_log`. Mint endpoint returns the secret
half exactly once in the form `<key_id>.<secret>`. Either user-owned or
org-owned (admin only). `verify_api_key()` parses presented token, looks up
by key_id, argon2-verifies secret, auto-expires if past `expires_at`,
stamps `last_used_at`. Revocation flips status to `revoked`.

## Session 13.2 — Webhook system ✅
`webhook_endpoints` (subscribed_events[] with `*` wildcard, HMAC-SHA256
signing_secret returned once at create) + `webhook_deliveries` with
exponential retry schedule `[1m, 5m, 30m, 2h, 12h]` then `abandoned`.
`enqueue_webhook(event, payload)` fans out one delivery per matching
endpoint, signing with `HMAC-SHA256(secret, canonical_json(payload))`.
`mark_delivery_outcome()` records success/failure, schedules next retry,
updates endpoint's `consecutive_failures` counter for circuit-breaker logic.

## Session 13.3 — Embed SDK (signed embed tokens) ✅
`embed_tokens` for iframe widgets. Mint endpoint returns a signed JWT
once, persists only `sha256(token)` + the params + allowed_origins for
revocation. Public `POST /embed/verify?token=` decodes + verifies the
JWT, returning claims (widget_kind, params, allowed_origins, sub, org, exp).
Invalid/expired tokens return 401.

## Session 13.4 — OAuth 2.0 third-party app registry ✅
`oauth_apps` (developer-registered apps with hashed_client_secret,
redirect_uris[], allowed_scopes[], status pending→approved→suspended,
grant_count) + `oauth_grants` (user grants of access to apps with
granted_scopes + hashed refresh_token + revoked_at). Admin
`POST /admin/oauth-apps/{id}/review {action: approve|suspend}` gates
public exposure. Only approved apps are visible at
`GET /oauth-apps/{client_id}/public`.

## Session 13.5 — Compliance: audit + GDPR/FERPA export + deletion ✅ (see below for Phase 14)
`audit_events` records every security-relevant action (`api_key.create`,
`api_key.revoke`, `compliance.export.request`, `compliance.delete.request`,
`compliance.delete.cancel`) with actor + subject + org + IP + UA +
severity (info/warn/critical). `compliance_exports` builds a per-user
JSON dump across 11 sections (profile, attempts, engagement, achievements,
study_plans, mock_attempts, tickets, invoices, purchases, reviews,
notifications) using parameterised SQL — each section runs in isolation
so a failure in one doesn't poison the rest. `compliance_deletions` is a
delayed-execution scheduler: `POST /me/compliance/delete` schedules
deletion 30 days out (configurable), `POST /me/compliance/delete/{id}/cancel`
reverses it, only one pending deletion per user.

---

# Phase 14 — Production scale + operability  ✅ done (sessions 14.1–14.5)

## Session 14.1 — Redis cache layer ✅
`services/cache.py` is a tiny facade with `get/set/delete/delete_pattern/health/cached`.
Backs onto async Redis when `REDIS_URL` is set; otherwise falls through to an
in-process dict with TTL eviction and hit/miss counters so dev/CI run with
zero infra. JSON serialisation is implicit; `cached(key, ttl, builder)` is the
preferred call site for memoised reads.

## Session 14.2 — Background job queue ✅
`background_jobs` Postgres table + `services/jobs.py` worker. Pull-based via
`SELECT ... FOR UPDATE SKIP LOCKED` so multiple workers can run side by side
without trampling. Retry ladder identical to webhook deliveries
(`1m → 5m → 30m → 2h → 12h → dead`). Per-job `dedupe_key` enforces "one
queued/running row per key" via a partial unique index. Handler registry
via `@jobs.register("kind")` decorator; built-in handlers for `noop`,
`webhook.deliver`, `email.send`, `rank.recompute`. `POST /admin/jobs/run-once`
supports targeted execution via `?job_id=` for tests.

## Session 14.3 — Prometheus metrics ✅
`services/metrics.py` exposes counters / gauges / histograms in the
Prometheus text-exposition format with no external dependency. The HTTP
middleware in `main.py` records `eureka_http_requests_total` (method +
path-prefix + status) and `eureka_http_request_duration_seconds` histogram
(Prometheus default buckets). Plus `eureka_jobs_executed_total`,
`eureka_jobs_queue_depth`, `eureka_cache_hits_total`, `eureka_cache_misses_total`.
Scraped at `GET /api/v1/metrics`.

## Session 14.4 — Autocomplete (search-as-you-type) ✅
pg_trgm GIN indexes on `skills(name, code)`, `courses(title)`,
`course_listings(headline, slug)`, `instructor_profiles(display_name)`,
`kb_articles(title)`. `GET /search/suggest?q=&kinds=&limit_per_kind=` uses a
combined `ILIKE %q%` + `similarity()` ranking so misspellings and short
prefixes both surface. Returns a flat list with `kind`, `id`, `label`,
`sub_label`, `href`, and `score`.

## Session 14.5 — Health + readiness probes ✅
`GET /healthz` is the cheap liveness check (always 200 if the process can
respond). `GET /readyz` checks db (`SELECT 1`), cache backend, and queue
depth — returns 503 with structured `checks` if any dependency is degraded
or `dead` job count exceeds 100. Mirrors Kubernetes liveness/readiness
semantics so the deployment manifest can target them directly.

---

# Phase 15 — Workforce training affiliate platform  ✅ done (sessions 15.1–15.5)

## Session 15.1 — Institution partnerships + seat licensing ✅
`institution_partnerships` (1:1 with `organizations`, with contracted_seats,
seat_renewal_at, billing_anchor_subscription_id, status) + `seat_assignments`
(partial-unique on `(partnership, user) WHERE released_at IS NULL`). Bulk
seat assignment via CSV-shaped JSON; JIT-creates users when emails are new
to the org; rejects rows past `contracted_seats` (returns `over_capacity` count).
Endpoints: POST/GET `/partnerships`, `/partnerships/{id}/action` (activate/
pause/expire), `/partnerships/{id}/seat-utilisation` (with by_team + by_role
breakdowns), `/partnerships/{id}/seats/bulk-assign`, `/partnerships/{id}/
seats/{user_id}/release`.

## Session 15.2 — Workforce programs (role-based curricula) ✅
`workforce_programs` (slug, target_role, target_skill_codes[], duration_weeks,
target_mastery, is_mandatory, optional cohort link) + `program_assignments`
(unique `(program, user)`) + `program_milestones` (week_index × skill_code →
target_mastery). Bulk-assign endpoint auto-spawns a Phase 12.3 study plan
per worker scoped to the program's skills + due date. Admin manual-complete
endpoint cascades to compliance_due_dates that point at the program.

## Session 15.3 — Compliance + required training cadence ✅
`compliance_requirements` (regulation enum: HIPAA, OSHA, SOC2, GDPR, PCI-DSS,
ISO_27001, SOX, FERPA, sector_specific, internal) + `compliance_due_dates`
(unique per `(requirement, user)`) + `training_attestations` (immutable
audit row with IP + UA + statement + evidence_hash). `evaluate_compliance(user)`
recomputes status as compliant / due_soon / overdue / expired (overdue → expired
after 90 days). Attestation flow records the attestation row and pushes the
due_date forward by `recurrence_months`.

## Session 15.4 — L&D admin workforce analytics ✅
`/partnerships/{id}/analytics` aggregates active_seats, contracted_seats,
programs_active, assignments_total/overdue, compliance_overdue/due_soon,
plus per-team and per-role funnels (seats × in_progress × completed × overdue).
No new tables — pure SQL aggregation over Phase 15.1–15.3 + Phase 9
(`cohorts`) data.

## Session 15.5 — Worker portal + manager handoff ✅
`GET /me/training` returns the worker's assigned programs (with due dates +
progress + linked study_plan_id) and compliance items (with due_at + status).
`GET /me/training/team` is the manager view — assignments for direct reports
(seats where `manager_user_id = me`). Worker can self-attest via
`POST /me/compliance/{id}/attest` when status is due_soon/overdue/expired.

---

# Phase 16 — Graduate school tier  ⬜ in progress (16.1 ✅; 16.2–16.7 pending)

**Design constraint (2026-05, per user request):** this tier deliberately
omits advisors / committees / committee_meetings. Each enrollment has a
single optional `supervisor_user_id` and that's the entire faculty
surface. The competitive moat is the **Research Tools suite** in
Sessions 16.6 + 16.7 — open-access Wolfram-Alpha-class capabilities
(symbolic math, stats, plotting, units, chemistry, biology, citation-aware
Q&A) baked into the platform, integrated with the Phase 4.2 skill graph
and Phase 6 tutor.

## Session 16.1 — Programs + enrollments + milestones (no advisors/committees) ✅
4 tables in `18_graduate.sql`: `graduate_programs`, `program_skill_targets`,
`graduate_enrollments` (with `supervisor_user_id` — no committees),
`degree_milestones` (workflow: not_started → in_progress → submitted →
approved/changes_requested/failed/waived). 5 enums: `degree_kind`
(masters_thesis/coursework/professional, phd, doctoral_professional, postdoc,
certificate), `grad_program_status`, `grad_enrollment_status` (applied →
admitted → enrolled → on_leave/withdrawn/graduated/dismissed), `milestone_kind`
(coursework, qualifying_exam, proposal, irb, data_collection, manuscript,
thesis_draft, thesis_defense, teaching, publication, custom), `milestone_status`.
On `graduate`: optional Open Badges 3.0 credential via Phase 4.3 transcript
service if `completion_cert_code` is set. 11 endpoints under
`/api/v1/graduate/*` + `/api/v1/me/graduate` rollup. Frontend: `/graduate`
(learner) + `/institutions/graduate-programs` (admin list + create) +
`/institutions/graduate-programs/[id]` (program detail + enroll). Sidebar
entry added to institutions shell. 6/6 integration tests pass.
**Tool deps pre-installed**: SymPy, NumPy, SciPy, statsmodels, matplotlib,
Pint, Biopython added to `requirements.txt` ahead of 16.6/16.7.

## Session 16.2 — Research workspace + lit review ⬜
3 tables: `research_workspaces`, `lit_review_entries`, `workspace_drafts`.
CrossRef + arXiv lookup endpoints; BibTeX export; per-workspace notes
+ tags; auto-linking to a learner's `graduate_enrollments` row.

## Session 16.3 — Thesis lifecycle + IRB (no committees) ⬜
3 tables: `thesis_projects`, `thesis_drafts`, `irb_protocols`.
Workflow: proposed → drafting → revising → defending → defended.
**Single approver per protocol — no committee structure.** On `defended`,
auto-mint Ed25519-signed credential via Phase 4.3 transcript_service.

## Session 16.4 — Grants + fellowships ⬜
2 tables: `funding_opportunities`, `funding_applications`.
Eligibility filter (degree_kind + skill_codes + region); deadline
reminders pushed through Phase 11.3 email_lifecycle + Phase 12.2
push_notify.

## Session 16.5 — Publications + scholarly profile + TA/RA + career ⬜
6 tables: `publications`, `publication_authors`, `peer_reviews`,
`citation_metrics`, `assistantships`, `job_market_records`.
Public scholarly profile at `/scholars/[slug]` (publications, h-index,
i10-index, fields of study). TA/RA service hours roll up into the
relevant `degree_milestones` row (kind=`teaching`).

## Session 16.6 — Research Tools I: math + stats + plotting ⬜
3 tables: `research_tools` (registry), `research_workbooks`
(saved notebooks), `tool_invocations` (per-call ledger).
**Backends**: `symbolic_math` (SymPy: solve, simplify, differentiate,
integrate, dsolve, linsolve, taylor, matrices), `numeric_math`
(NumPy/SciPy: integrate.quad, optimize.minimize, linalg, fft),
`statistics` (statsmodels: OLS/GLS/GLM, ANOVA, chi-square, t-tests,
PCA, time-series), `plotting` (matplotlib: line/scatter/hist/heatmap,
PNG + SVG rendered to MinIO with 24h signed URLs).
**The Wolfram Alpha competitor surface.**

## Session 16.7 — Research Tools II: physics + chemistry + biology + citation-aware Q&A ⬜
**Backends**: `units` (Pint: dimensional analysis, unit conversion),
`physics_calc` (kinematics, energy, EM, thermo — all dimensionally
checked through Pint), `chemistry` (RDKit when installed for molecule
parsing + descriptors; PubChem REST fallback when not), `biology`
(Biopython: sequence I/O, GC content, transcription/translation,
BLAST helpers), `literature_search` (CrossRef + arXiv + Semantic
Scholar parallel fan-out + dedup), `citation_qa` (Claude with
ANTHROPIC_API_KEY orchestrates literature_search results into
answers that cite every claim; falls back to raw results without
narrative wrap when no API key). Plots / molecule images / sequence
viewers saved to MinIO and re-renderable from a saved workbook.

---

# Old session prompts (Phase 3 onward, kept for context)

Each prompt below is **self-contained** — you can paste it into a fresh agent and it will have what it needs.

## Session 3.1 — Reconcile service duplication

```
You are working in the EUREKA monorepo at ~/Desktop/EUREKA.

Goal: Eliminate three overlapping service pairs. Pick one canonical
implementation in each case, port any unique functionality from the
loser, delete the loser, update docker-compose.yml, package.json,
and docs/STATUS.md.

Overlaps:
1. services/ai-tutor (TypeScript)  vs  eureka/services/tutor-llm (Python)
   → Keep tutor-llm (more code, full Claude integration, matches our
     Python stack). Read services/ai-tutor/src/* and port anything
     that doesn't exist in tutor-llm. Then `git rm -rf services/ai-tutor`.

2. eureka/services/medical-school (NestJS)  vs  eureka/services/pro-med (FastAPI)
   → Keep pro-med (FastAPI matches the rest of the stack). Identify
     any unique modules in medical-school (clinical case data, OSCE,
     anatomy) and port them as FastAPI routers under pro-med/app/api/.
     Then remove medical-school from compose + delete the dir.

3. eureka/apps/web-hs, web-ug, web-grad (stubs)  vs  eureka/apps/web (full)
   → web uses dynamic routes already at /tiers/[tier]/. Confirm the
     three stubs only contain READMEs / minimal package.json (no real
     code), then delete and remove from any workspace globs.

For each merge:
- Run `make test` before and after — must not regress.
- Update eureka/docker-compose.yml.
- Update eureka/package.json workspaces if needed.
- Update docs/STATUS.md to remove the deleted rows.
- Commit each merge separately with a clear chore: message.
- Push directly to main when done.

Verify at the end: `docker compose --profile full up -d` brings up
all services with no duplicate-name errors.
```

## Session 3.2 — Test + CI baseline

```
You are in ~/Desktop/EUREKA.

Goal: Establish a CI baseline that prevents future regressions.

For every service under eureka/services/* and services/* (excluding
shared/), add:
1. A pytest or jest config file if missing.
2. A test_health.py (Python) or health.test.ts (Node) that calls
   /health and asserts 200 + expected JSON shape.
3. One happy-path integration test for the primary domain object
   (e.g. assess → create assessment + grade an MCQ submission).

Then create .github/workflows/ci.yml that:
- Triggers on push and pull_request to any branch.
- Spawns Postgres+Redis services for integration tests.
- For each service: install deps, lint, run tests, produce coverage XML.
- Uploads coverage to a single artifact.
- Fails if any service's line coverage is below 40%.
- Has a "build all containers" job that runs `docker compose build`.

Also add a top-level `Makefile` target `test-all` that runs every
service's tests in parallel via GNU make -j.

Verify: open a draft PR to test the workflow, confirm green, then
push the workflow itself to main.

Coverage target this session: 40% — we'll raise it in later sessions.
```

## Session 3.3 — Auth + tenancy hardening

```
You are in ~/Desktop/EUREKA, working in eureka/api-core.

Goal: Production-grade auth and tenant isolation.

Current state: tenancy middleware exists but isn't enforced everywhere;
demo password `Admin123!` is seeded in plain text-ish; no MFA.

Tasks:
1. Replace bcrypt (if used) or any other hash with argon2id (use
   passlib[argon2]). Rehash on next login for existing users via
   transparent upgrade.
2. Add TOTP MFA: `/api/v1/auth/mfa/setup`, `/verify`, `/disable`.
   Required for admin and instructor roles. Use pyotp. Store
   encrypted secret with a KMS-style envelope (Fernet keyed by env
   MFA_ENVELOPE_KEY).
3. Audit every router under eureka/api-core/app/api/. Verify each
   route either explicitly opts out (public) or runs the tenancy
   middleware. Add a test in tests/test_tenancy_isolation.py that
   creates two orgs with their own records and asserts org A cannot
   read org B's data via any GET/PATCH/DELETE endpoint.
4. Rotate JWT_SECRET on every container start in dev, document
   manual rotation for prod in docs/SECURITY.md.
5. Add a security headers middleware (HSTS, X-Content-Type-Options,
   X-Frame-Options, CSP).

Success: the cross-tenant test must FAIL when tenancy middleware is
temporarily disabled (proves it's actually enforced) and PASS when
re-enabled. Push to main.
```

## Session 3.4 — Observability

```
You are in ~/Desktop/EUREKA.

Goal: Distributed tracing + structured logs + a dev dashboard.

Tasks:
1. Add OpenTelemetry to every Python service:
   - opentelemetry-instrumentation-fastapi
   - opentelemetry-instrumentation-sqlalchemy
   - opentelemetry-instrumentation-redis
   - opentelemetry-instrumentation-httpx
   - opentelemetry-exporter-otlp
   Config via env: OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_SERVICE_NAME.
2. Add OpenTelemetry to Node services (services/notebook, xr-labs):
   @opentelemetry/auto-instrumentations-node.
3. Add a Jaeger service to eureka/docker-compose.yml behind a
   `profile: dev-obs`, listening on :16686 (UI) and :4317 (OTLP gRPC).
4. Replace any print()/console.log() inside request handlers with a
   structured logger that emits JSON with at minimum:
   {timestamp, level, service, request_id, user_id, org_id, message}.
   Use structlog (Python) and pino (Node).
5. Commit a Grafana dashboard JSON to eureka/monitoring/dashboards/
   for: requests/sec by service, p50/p95/p99 latency, error rate,
   AI cost per request.

Verify: click around the web app, then open Jaeger and find the
trace for one user action that spans api-core → tutor-llm → assess.
Screenshot, commit it to docs/observability-demo.png. Push to main.
```

## Session 3.5 — Secrets + config

```
You are in ~/Desktop/EUREKA.

Goal: No plaintext secrets in source. Working secret rotation runbook.

Decision: use Mozilla SOPS with age encryption. Cheap, no vendor
lock-in, works fine for a team of <50.

Tasks:
1. Install sops in CI and document local install (Homebrew).
2. Generate an age keypair, commit the public key, store the private
   key in 1Password / wherever — document this in docs/SECURITY.md.
3. Create secrets/{dev,staging,prod}.enc.yaml encrypted with sops+age.
4. Update every service to read secrets at boot via a thin
   `app/config.py` wrapper that decrypts the sops file.
5. Run gitleaks in CI; fail on any finding.
6. Audit all .env.example files: any value that looks like a real key
   format (sk-ant-..., sk-proj-...) replaced with `<paste-your-key>`.
7. Document rotation procedure in docs/SECURITY.md: how to rotate
   ANTHROPIC_API_KEY, JWT_SECRET, DB password, MinIO keys without
   downtime.

Verify: gitleaks finds nothing. Spin up the stack using only the
decrypted secrets — no .env required. Push to main.
```

## Session 3.6 — Frontend cleanup + design system

```
You are in ~/Desktop/EUREKA/eureka/apps/web.

Goal: One coherent design system. Storybook. Lighthouse ≥ 90.

Audit src/components/ for inconsistent component libraries
(some shadcn, some custom, some headlessui mixes). Pick shadcn/ui
as the canonical library and migrate everything to it. Delete
duplicates.

Tasks:
1. Define design tokens in src/styles/tokens.css: colors (light/dark),
   spacing scale, type scale, radii, shadows. Wire via Tailwind theme.
2. Migrate any non-shadcn buttons, inputs, dropdowns, dialogs, etc.
3. Add Storybook 8 (Next.js + Vite). Stories for the 30 most-used
   components. Deploy via Chromatic or to gh-pages.
4. Add Playwright accessibility tests (@axe-core/playwright) for the
   home, dashboard, and one tier page.
5. Lighthouse CI in GitHub Actions on every PR; fail if any of
   performance, accessibility, best-practices < 90.

Success: Storybook is deployed at a known URL (commit it to README).
Lighthouse passes in CI. Push to main.
```

## Sessions 4.x — Cross-tier learner spine

> Prompts for Sessions 4.1–4.5 are intentionally left as outlines below.
> Each will be expanded into a self-contained prompt at the start of Phase 4,
> when we know the actual schema choices made during Phase 3.

- **4.1** ✅ done 2026-05. `learner_profiles` (1:1) + `tier_enrollments` (N
  per user) live in `eureka/ops/db/05_learner_spine.sql`. SQLAlchemy ORM
  in `app/models/learner.py`, schemas in `app/schemas/learner.py`, API
  in `app/api/v1/endpoints/learner.py` mounted under `/api/v1`. Endpoints:
  GET/PATCH `/learner-profile/me`, GET `/learner-profile/{user_id}` (admin),
  GET/POST/PATCH/DELETE `/tier-enrollments/me`. 9 integration tests pass.
  Verified live with one user holding 4 concurrent enrollments
  (undergraduate + USMLE Step 1 + USMLE Step 2 + FE Electrical).
- **4.2** ✅ done 2026-05. Schema: `skills` (forest, framework+code unique),
  `skill_prerequisites` (directed DAG, strength 0–1, free-form rationale),
  `content_skills` (M2M tag), `learner_skill_mastery` (denormalized
  projection of `learner_profiles.knowledge_state`). 8 frameworks seeded:
  CCSS, NGSS, AP Calc BC, ABET, USMLE Step 1 (cardiology block), MBE, FE
  Electrical + Civil, MBA core — ~77 skills, ~8 cross-framework prereq
  edges. API: `/skills`, `/skills/{id}`, `/skills/{id}/relations`,
  `/skills/{id}/prereq-tree` (recursive CTE), `/skills/by-code/{fw}/{code}`,
  `/content-skills`, `/skills/me/mastery`. Verified live: STEP1.CARD.HF
  (medical tier) returns 6 transitive prerequisites including AP Calc
  (high-school tier) — the cross-tier moat is now navigable in one query.
  8 integration tests pass.
- **4.3** ✅ done 2026-05. Schema: `learner_achievements`,
  `transcript_issuer_keys` (Ed25519 pubkey registry),
  `transcript_issuances` (signed payloads with supersede pointer).
  Service: `app/services/transcript.py` — Open Badges 3.0 JSON-LD
  builder, canonical serialization, Ed25519 sign + verify. Endpoints:
  `POST /achievements`, `GET /achievements/me`, `POST /transcript/me/issue`,
  `GET /transcript/me`, `GET /transcript/{id}`, `GET /transcript/{id}/verify`.
  Verified live: signature 86 chars (base64url), tamper-detection
  passes (mutating payload JSON in DB causes verify→false). 6
  integration tests pass.
- **4.4** ✅ done 2026-05. Service: `app/services/recommender.py` —
  5-signal scorer (active-tier fit, prereq readiness, mastery gap,
  goal alignment, spaced-repetition). Cross-tier moat: `test_prep`
  enrolment with `exam=USMLE_Step_1` derives `framework=usmle` so
  medical-tier USMLE skills surface even though the enrolment is in
  `tier=test_prep`. Endpoint: `GET /recommendations/me`. Returns
  per-signal breakdown + human-readable notes. 4 integration tests pass.
- **4.5** ✅ done 2026-05. New pages in `apps/web`:
    - `/learner` — single dashboard with profile + tier enrolments +
      cross-tier recommendations + skill mastery, all from the api-core
      endpoints landed in 4.1–4.4.
    - `/transcript` — signed-transcript viewer with verify badge,
      re-issue button, "Download JSON" of the raw Open Badges 3.0
      payload. Re-issues supersede prior current.
  Both ship in the Next 14 build (verified: `npm run build` produces
  /learner 6.53 kB, /transcript 5.02 kB, both static-prerendered).

## Sessions 5.x — Content & question bank

- **5.1** ✅ done 2026-05. Five tables in `eureka/ops/db/08_item_bank.sql`:
  `item_banks`, `items` (with IRT params, variant family_id, JSONB
  content, GIN full-text index, review status), `item_variants`,
  `item_sources` (license + provenance), `item_embeddings` (pgvector
  1024-dim with HNSW cosine index). 7 endpoints under `/api/v1` for
  banks + items CRUD. 3 banks + 78 items seeded:
  `usmle-step-1-cardio` (cardiology block, real-style stems),
  `ap-calc-bc-2027` (mock items across units), `fe-elec-circuits`
  (circuits + math + signals + probability). Every seed item tagged
  into the skill graph (Phase 4.2) via `content_skills` and embedded
  with the stub hash-embedding for the search path.
- **5.2** ✅ done 2026-05. `app/services/variant_generator.py` with
  two stages: Claude-driven `generate_variants(base, count)` returning
  structured JSON drafts; optional `cross_grade(base, variant)` pass
  that flags variants where a second Claude call doesn't agree the
  variant tests the same skill. Falls back to deterministic stubs
  when ANTHROPIC_API_KEY is unset (CI / dev). Endpoint:
  `POST /api/v1/items/{id}/variants` which:
    * creates N new `items` rows in the same `family_id`,
    * inherits the base's skill tags into `content_skills`,
    * records lineage in `item_variants` (with cross-grader fields when run),
    * stamps `item_sources` as `ai_generated` with attribution back to base,
    * routes failed cross-grader variants to `review_status='flagged'`.
  Verified live: 3 stub variants generated from a USMLE base item,
  family linkage correct, tags inherited.
- **5.3** Content authoring app at `eureka/apps/web/src/app/author/`
  (admin role only). Notion-style editor (use TipTap), AI fact-check
  inline, source citations enforced.
- **5.4** License + provenance schema + renderer respect.
- **5.5** HS content seed (license vs. partner — recommend
  Saylor + LibreTexts initially for cost).
- **5.6** USMLE seed (license, e.g., AMBOSS-style partner, + AI
  variants) and FE seed (commission + NCEES sample + AI variants).
- **5.7** ✅ done 2026-05. `app/services/item_search.py` with hybrid
  retrieval: Postgres FTS keyword channel (uses the GIN index on
  stem+vignette+explanation) + pgvector cosine semantic channel
  (HNSW index on `item_embeddings.embedding`) + skill-tag boost when
  a `skill_id` filter is supplied. Fused with parameter-free
  Reciprocal Rank Fusion (RRF, k=60). Embedding function is
  pluggable (`embed_fn` callable); default is a deterministic
  sha256→1024-dim stub so the path runs end-to-end in CI; Phase 6.1
  swaps it for a real embedding backend. Endpoint:
  `GET /api/v1/item-search?q=…&framework=…&skill_id=…&bank_slug=…`.
  Verified live: "resonance" + framework=fe_pe returns the RLC
  resonance items in the top slot.

## Sessions 6.x — AI tutor depth

- **6.1** ✅ done 2026-05. `knowledge_chunks` table (1024-dim pgvector
  HNSW + GIN tsvector). `app/services/rag.py`:
  `ingest_item_bank()`, `ingest_skill_graph()`, `retrieve()` (hybrid
  keyword + semantic + skill-tag boost via RRF), `groundedness()`
  (shingle-overlap stand-in until 6.4b plugs in NLI). 269 chunks
  ingested live (192 item + 77 skill).
- **6.2** ✅ done 2026-05. `app/services/tutor_agent.py`:
  Claude tool-use loop with **6 tools** (`lookup_skill_state`,
  `retrieve_content`, `get_question`, `grade_attempt`,
  `recommend_next`, `update_mastery`). Persists conversation in
  `agent_sessions` + `agent_messages` (append-only, with citations
  and groundedness_score per assistant turn) + `agent_traces`
  (tool-call audit so the UI can render "show your work"). 8
  endpoints under `/agent/*`. Stub mode produces a Socratic-shaped
  reply when no `ANTHROPIC_API_KEY`.
- **6.3** ✅ done 2026-05. Hint-ladder state machine baked into
  `agent_sessions.hint_level` (0=ask leading question, 1=nudge,
  2=partial worked example, 3=full reveal). Bumps automatically on
  learner cues like "I don't know" / "stuck" / "give me a hint".
  System prompt is recomputed each turn so updates take immediate
  effect. Verified live: a 3-turn session ratcheted 0→1→2.
- **6.4** ✅ done 2026-05. Groundedness score (0..1) computed on every
  assistant turn from sentence-level claims vs cited chunks (shingle
  overlap; NLI swap in 6.4b). Stored on `agent_messages.groundedness_score`.
  Learner-facing `POST /agent/messages/{id}/flag` with kind enum
  (hallucination, incorrect_explanation, biased, off_topic, unsafe,
  low_groundedness, other) → `flagged_responses` SME triage queue
  (status: open → triaged → confirmed | rejected | fixed).
- **6.5** Voice / live translation — deferred. Phase 11.x.

## Sessions 7.x — Exam realism + analytics

- **7.1** Per-exam shell components in `apps/web/src/app/exam/[exam_type]/`
  — deferred. Per-tier UI is bounded follow-up frontend work.
- **7.2** ✅ done 2026-05. `app/services/irt.py` — 2-PL EM in pure Python
  (no external IRT package). Fits items.irt_{difficulty, discrimination,
  guessing} from `attempt_logs`. `estimate_theta_and_se()` for mock
  scoring; `scaled_score()` for piecewise-linear theta→exam-score
  mapping; `pass_probability()` from a Gaussian on the scaled scale.
  Endpoint: `POST /api/v1/irt/calibrate`. Verified live: 6 items
  calibrated, params written back.
- **7.3** ✅ done 2026-05. `app/services/analytics.py`. `per_skill()`
  returns per-(user, skill) aggregates (attempts, correct_pct, median
  + p90 time_taken_ms, mastery). `strengths_weaknesses()` buckets and
  returns top-k strongest / weakest. **`most_missed_by_passers()`** —
  the UWorld feature: rank skills by miss rate among learners who
  passed a blueprint, optionally cross-referenced with the current
  learner's own miss rate. Endpoints: `/analytics/me/skills`,
  `/analytics/me/strengths-weaknesses`, `/analytics/missed-by-passers`.
- **7.4** ✅ done 2026-05. `app/services/mock_exam.py`. Skill-weighted
  + IRT-difficulty-windowed item picker. `start_attempt()` creates an
  attempt + populates `mock_attempt_items` with positions. `submit_answer()`
  grades + writes to both `mock_attempt_items` and `attempt_logs` (so
  analytics + IRT pick up mock data). `score_submitted()` fits theta
  + maps to scaled score + computes pass probability + persists summary.
  5 endpoints: blueprints CRUD, mock start/items/answer/submit, list.
  Correct answers hidden until submission. Verified live: 5-item mock
  produces a scaled_score and predicted_pass.
- **7.5** ✅ done 2026-05. FSRS-lite scheduler in `app/services/analytics.py`:
  4-state (again/hard/good/easy) multiplicative interval updates,
  mastery delta per rating. `due_today()` returns the next item per
  due skill. Endpoints: `GET /spaced-repetition/me/due`,
  `POST /spaced-repetition/me/rate`. Verified live: `good` → interval
  ×2.5, mastery +0.05; `again` → interval ×0.5, mastery −0.15.

## Sessions 8.x – 11.x

See section headings above. Detailed prompts will be authored at the
start of each phase, when the platform's actual contours are clearer.
A roadmap that prescribes Session 11.2 in detail today is fiction;
the closer we get, the more accurate the prompts will be.

---

# How to use this roadmap

1. **Don't try to do everything in parallel.** Each phase ends in a
   demoable state; resist the urge to skip ahead.
2. **One session ≈ one PR ≈ one demo.** If a session sprawls past 3
   days of agent work, split it.
3. **After each phase, re-read `docs/STATUS.md` and update it.** That
   doc is the source of truth, not these aspirational sections.
4. **Hire SMEs before Phase 5.** Medical, legal, engineering, K-12.
   AI variants are great but the base questions must be expert-authored
   for credibility. Budget for this.
5. **Get one tier shipping real value to real users by end of Phase 7.**
   Recommend MCAT or FE/PE as the beachhead — narrow, high-willingness-
   to-pay, AI advantage is most defensible there.

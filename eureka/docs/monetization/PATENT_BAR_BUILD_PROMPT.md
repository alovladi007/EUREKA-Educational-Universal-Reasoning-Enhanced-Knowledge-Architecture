# Patent Bar → Sellable Product — Build Prompt (next session)

> **How to use:** paste this whole file as the opening prompt of the next session (or hand it to the
> agent). It is self-contained: context, goal, workstreams, exact files/endpoints, and acceptance
> criteria. **Do Workstream 1 first — it unlocks monetization for every other exam too.**

---

## Context (audit, 2026-07-20)

Patent Bar is the most production-ready vertical in EUREKA. Verified content:
- **537 QBank questions** — real statutes (§101/102/103/112), case law (Alice, Mayo, KSR, Graham,
  Markman), USPTO 2019 guidance, AIA provisions; 4 options + correct index + ~273-char explanations;
  61 topics; 379 MPEP-cited; **zero thin stubs**. File: `apps/web/src/lib/patent-bar-qbank-data.ts`.
- **511 flashcards** — `apps/web/src/lib/patent-bar-flashcard-data.ts`.
- **632 KB course** (~272 topics) — `apps/web/src/lib/patent-bar-course-data.ts`.
- **MPEP map**: 50 chapters + 73 topic anchors + frequency heatmap —
  `mpep-chapters.ts`, `mpep-frequency.ts`, `patent-topic-anchors.ts`.

Learning product already built & wired:
- Exam workspace: `apps/web/src/app/dashboard/test-prep/[exam]/page.tsx` (Read Lessons, Video Lessons,
  Flashcards, My Notes, QBank tabs). Route: `/dashboard/test-prep/patent_bar`.
- Patent-Bar-specific pages: `[exam]/command-center`, `[exam]/mpep-workbench`, `[exam]/patent-program`,
  `[exam]/live` (all wired to backends).
- Backend: `services/api-core/app/api/v1/endpoints/patent_bar.py` → `GET /me/patent-bar/analytics`,
  `GET /me/patent-bar/review-queue`. QBank practice persists via `apiClient.recordProgress()` →
  `/me/progress` (feeds Command Center analytics). Cohorts: `patent_cohorts*` tables.

**The blocker:** none of it is behind a paywall. The exam workspace + QBank + flashcards are fully open to
any logged-in user. **Content is ~A-grade; monetization is F.** You are ~70–80% of the way to a sellable
product; the remaining work is concentrated in payments + a bit more content + GTM.

## Goal

Make Patent Bar a product a stranger can discover, try for free, pay for, and use to pass the USPTO
registration exam — end to end, with **no fabricated data**.

---

## Workstream 1 — Monetization (DO FIRST; shared infra for all exams)

Design an entitlement layer and wire real checkout. **Prefer putting entitlement in `api-core`** (Python,
already the auth authority) over the legacy Node `services/test-prep` (:3010, mock auth) — decide early and
record the decision.

**1a. Entitlement model** (api-core + Postgres `eureka`):
- Tables: `product` (sku, exam_code, name, price_cents, interval: one_time|monthly), `entitlement`
  (user_id, product/exam_code, status: active|expired|refunded, source: stripe|comp|trial, expires_at).
- Endpoint: `GET /me/entitlements` → what the current user can access.
- Helper `has_exam_access(user, exam_code)` reused across exam endpoints.

**1b. Free-preview → paid gate** (frontend `[exam]/page.tsx` + QBank/lesson components):
- Define the free slice: e.g. first ~20 QBank questions + Domain-1 lessons + a diagnostic. Everything else
  shows a paywall/upgrade card (not an error, not fake data).
- Gate reads `GET /me/entitlements`; gating must be **enforced server-side too** (don't trust the client) —
  the QBank/lesson endpoints check `has_exam_access`.

**1c. Stripe checkout + webhooks** (real, test-mode first):
- `POST /billing/checkout` (creates a Stripe Checkout Session for a Patent Bar product) →
  `POST /billing/webhook` (on `checkout.session.completed`, write an `entitlement`).
- Use Stripe **test keys** in dev; document where prod keys go. Verify the webhook signature.
- The existing `services/test-prep` Node app has Stripe scaffolding + `test_prep_content_packages` /
  `test_prep_subscriptions` / `test_prep_plans` tables (migration
  `database/migrations/add-test-prep-subscriptions.sql`). **Reuse or replace deliberately** — do not leave
  two competing subscription systems. Note: an earlier session seeded FAKE packages/subscription there and
  they were deleted — **do not reintroduce fake catalogue data.**

**Acceptance (WS1):** logged-out → can view a Patent Bar marketing page; sign up → get the free preview;
click upgrade → real Stripe test checkout → on success an `entitlement` row is written and the full QBank /
lessons unlock; server rejects gated API calls without entitlement. No fabricated packages or subscriptions.

---

## Workstream 2 — Content to "definitive"

- **Ingest the public-domain USPTO released exams.** Old registration exams are official and free — the
  single biggest credibility asset in this niche. Parse them into `patent-bar-qbank-data.ts` shape
  (`question`, `options[]`, `correct`, `explanation`, `topic`, MPEP citation). Tag source = "USPTO released".
- **Grow the bank toward ~1,000** total, keeping the current quality bar (real citation + ≥150-char
  explanation, no stubs). Fill thin topics — first run the coverage map (see WS below) to find them.
- **Coverage map:** produce a table of the 61 topics × question count × MPEP chapter, to see thin vs strong
  areas. (Cheap; do this before authoring so effort is targeted.)
- **Explanation QA pass:** verify citations resolve to the right MPEP section; fix any that don't.

**Acceptance (WS2):** ≥900 questions, every one with a resolving MPEP citation + real explanation; a
published coverage map; ≥1 full set of official USPTO released-exam questions included and labeled.

---

## Workstream 3 — Real exam simulation

- A **format-accurate timed mock**: 100 questions, AM/PM split (50 + 50), 3 hours each, MPEP-open (link the
  workbench), score + pass prediction against the ~70% cut. Reuse the workspace QBank engine; add a timed
  "Full Exam" mode for Patent Bar (the tab exists for some exams — extend it here).
- Score report maps wrong answers → MPEP chapters → targeted review queue (the review-queue endpoint exists).

**Acceptance (WS3):** a user can take a full timed 100-Q mock, get a scaled score + pass-likelihood + a
per-MPEP-chapter breakdown, and one click into a review set of their misses.

---

## Workstream 4 — GTM + trust

- **Patent Bar landing page** (reuse the landing framework in `apps/web/src/app/page.tsx`): who it's for,
  the free diagnostic CTA, pricing, what's included, FAQ. Honest — no fake testimonials until a real cohort
  exists.
- **Free diagnostic funnel:** short diagnostic (no account) → email capture → account → free preview →
  paywall. Wire real email (there's a notifications/email path in api-core).
- **Accounts production-ready:** signup + email verification + password reset + per-user entitlement.
- Refund policy, support inbox, terms.

**Acceptance (WS4):** a Patent Bar landing page at a clean URL; a working free diagnostic → signup →
preview → checkout funnel; password reset + email verification functional.

---

## Suggested sequence

1. WS1 (monetization) — the unlock. ~1–2 focused builds.
2. WS3 (timed mock) — high perceived value, reuses existing engine.
3. WS2 (content to definitive) — the biggest time sink; mostly authoring/ingestion, run continuously.
4. WS4 (GTM) — once there's something to sell + try.

## Definition of done (Patent Bar is "sellable")

- [ ] Free preview + real Stripe checkout + server-enforced entitlement (WS1)
- [ ] ≥900 quality questions incl. official USPTO released exams + coverage map (WS2)
- [ ] Format-accurate timed 100-Q mock with pass prediction (WS3)
- [ ] Landing page + free-diagnostic funnel + production accounts (WS4)
- [ ] Zero fabricated content anywhere; honest empty states

## Guardrails (the user cares about these — do not violate)
- **No fabricated content / fake numbers / seeded fake subscriptions.** Real data or an honest empty state.
- **Keep everything else as-is** unless the workstream requires it; make surgical changes.
- **Verify in the browser** and show proof before claiming done; **show before committing** significant UI.
- Payments in **test mode** until the user explicitly moves to live keys. Never enter real payment
  credentials on the user's behalf.

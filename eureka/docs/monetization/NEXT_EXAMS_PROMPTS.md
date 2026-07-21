# Next Prep Tests — Per-Exam Productization Prompts

> Run these **after** Patent Bar is sellable (see `PATENT_BAR_BUILD_PROMPT.md`). Each exam **reuses the
> shared paywall/entitlement built in Patent Bar Workstream 1** — so per-exam work is mostly: verify
> content depth → fill gaps → wire the exam to the entitlement gate → per-exam landing page.
>
> Universal per-exam checklist (applies to every section below):
> 1. Gate the exam behind the shared entitlement layer; define a free preview slice.
> 2. Add a `product` row + Stripe price for the exam.
> 3. Verify/parse the real content counts; fill thin topics to the quality bar (real explanation + source).
> 4. Timed, format-accurate mock exam.
> 5. Per-exam landing page (reuse the framework) + free diagnostic funnel.
> 6. **No fabricated content — real data or honest empty state.**

Content counts measured 2026-07-20 (`apps/web/src/lib/*`). Route pattern: `/dashboard/test-prep/<exam_slug>`.

---

## Priority 2 — Security+ (SY0-701)  ·  slug `security_plus`

**Content:** 479 QBank Qs · 246 flashcards · 118 course topics · 377 KB course · **interactive PBQ sims**
(`SecurityPlusPBQ`) · lesson-content module. **Strong, and the market is huge + recurring.**
**Gaps:** paywall; grow QBank toward ~750; more PBQ scenarios; format-accurate 90-Q/90-min mock with PBQs
first; landing page. **Files:** `security-plus-qbank-data.ts`, `security-plus-flashcard-data.ts`,
`security-plus-course-data.ts`, `security-plus-lesson-content.ts`, `components/test-prep/SecurityPlusPBQ.tsx`.
**Prompt:** "Productize Security+ (SY0-701): gate it behind the shared entitlement layer with a free
preview; verify the 479-question bank quality and grow to ~750 with real explanations; add a timed 90-min /
90-question mock that includes PBQ simulations; build a Security+ landing page + free diagnostic. No fake
content."

## Priority 3a — MCAT  ·  slug `mcat`

**Content:** 581 QBank Qs · 502 flashcards · 126 course topics · 314 KB · frequency heatmap + AAMC links.
**Biggest market, but crowded (UWorld/AAMC/Kaplan)** — differentiate on adaptive analytics + price.
**Gaps:** paywall; the bank is broad but MCAT needs *passage-based* questions (CARS + science passages) —
verify how many are passage-linked vs standalone; full-length simulation is a big lift (7.5 hrs, 4 sections).
Consider selling a **focused slice** (e.g. CARS-only or one science section) rather than "beat UWorld."
**Files:** `mcat-qbank-data.ts`, `mcat-flashcard-data.ts`, `mcat-course-data.ts`, `McatFrequencyHeatmap`.
**Prompt:** "Productize MCAT as a focused paid product (start with one section, e.g. CARS or Bio/Biochem):
gate behind entitlement; verify passage-based question coverage; add a timed section mock; landing page +
diagnostic. Don't try to out-scope UWorld — win a niche section. No fake content."

## Priority 3b — CISSP  ·  slug `cissp`

**Content:** **2,250 flashcards** (huge) · 175 course topics · 595 KB course + lesson-content · video lessons
(the only exam with real Video Lessons). QBank is **lazy-loaded via `getCISSPQuestions`** — **verify the
real question count first** (the static heuristic read 0). **Cert market, high WTP.**
**Gaps:** confirm QBank size; paywall; CAT-style adaptive mock (CISSP is adaptive 100–150 Qs); landing page.
**Files:** `cissp-flashcard-data.ts`, `cissp-course-data.ts`, `cissp-lesson-content.ts`,
`cissp-video-lessons.ts`, `getCISSPQuestions` (dynamic import).
**Prompt:** "Verify the real CISSP QBank count, then productize CISSP: gate behind entitlement with a free
preview; leverage the 2,250 flashcards + real video lessons as the hook; add a CAT-style adaptive mock;
landing page + diagnostic. No fake content."

## Priority 4 — FE (EE) `fe_ee` and FE (ME) `fe_me`

**Content:** FE-EE 562 Qs / 367 FC / 228 topics / 530 KB · FE-ME 555 Qs / 432 FC / 188 topics / 316 KB.
**Both strong; engineering licensure = defined audience, decent WTP, NCEES reference-handbook-based.**
**Gaps:** paywall; the FE is a 110-Q, 6-hour, computer-based, **open-(NCEES-handbook)** exam — build a
handbook-style reference panel + timed 110-Q mock; landing page. **Note:** there's an 8,000+-line
`fe-ee-course` specialty page already (`test-prep/fe-ee-course/page.tsx`).
**Prompt:** "Productize the FE exams (EE and ME): gate behind entitlement; verify the ~560-question banks;
add a timed 110-question, handbook-open mock with a reference panel; landing page + diagnostic. No fake
content."

## Priority 5 — LSAT  ·  slug `lsat`

**Content:** 201 QBank Qs · 111 FC · 145 topics · 201 KB · LawHub-style workbench + frequency heatmap +
command center + program pages (well-built UI). **Big market but very crowded (7Sage, LSAT Demon, free
official LSAC prep).** **Thinner QBank — content growth needed to compete.**
**Gaps:** paywall; grow QBank substantially (LR + RC + the removed LG); Logical Reasoning is the wedge (the
`lsat-program` / `lawhub-workbench` pages exist). Hard to win on price vs free LSAC — differentiate on
analytics/drilling. **Files:** `lsat-qbank-data.ts`, `lsat-*`, `[exam]/lawhub-workbench`, `[exam]/lsat-program`.
**Prompt:** "Assess whether LSAT is worth paid focus given free LSAC prep + 7Sage; if yes, grow the LR
question bank first, gate behind entitlement, and sell an LR-drilling product with analytics. No fake content."

## Deprioritized (do not build for paid yet)

- **PE (EE)** `pe_ee` — **QBank is a stub (1 question)** despite 231 FC / 103 topics. Build the QBank
  before any monetization. Currently the weakest.
- **SAT** `sat` (140 Qs) — hyper-competitive and **undercut by free Khan Academy official prep**. Weak paid
  case. Skip unless targeting a specific angle (e.g. a paid tutor layer).
- **GRE** `gre` (88 Qs) / **GMAT** `gmat` (76 Qs) — thin QBanks, crowded markets. Not launch-ready; low
  priority vs the leaders above.

---

## Cross-cutting suggestions

- **Build the paywall once, reuse everywhere.** Do not create a second subscription system per exam. (An
  earlier session created a fake package/subscription system in `services/test-prep` :3010 and it was
  removed — prefer entitlement in `api-core`.)
- **Bundle option:** an "all-access" product across exams is an easy upsell once ≥2 exams are paid.
- **Official/public-domain content is the credibility moat** where it exists: USPTO released exams
  (Patent Bar), NCEES sample questions (FE/PE), released Security+ objectives. Prioritize ingesting these.
- **Sell narrow, then widen.** A focused product ("pass the Patent Bar", "CARS mastery") converts better
  than "everything for every exam."

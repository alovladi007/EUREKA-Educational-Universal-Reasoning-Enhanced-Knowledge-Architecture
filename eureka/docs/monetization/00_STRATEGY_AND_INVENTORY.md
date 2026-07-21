# EUREKA Test-Prep Monetization — Strategy & Content Inventory

_Prepared 2026-07-20. Purpose: turn EUREKA's test-prep modules into a focused, revenue-generating
product line. Target: **$200K/year**. These docs are the working plan for upcoming build sessions._

---

## 1. The thesis (read this first)

EUREKA is **broad but shallow** — ~21 modules, most at demo depth. **$200K does not come from polishing
all 21.** It comes from making **one** vertical genuinely production-grade and *sellable*, then a second.

- **Beachhead = Patent Bar.** It has the deepest content and the most complete learning product in the
  whole platform (see the inventory below), a niche audience with high willingness-to-pay ($400–3,000
  competitor courses), and weak competition. Full build prompt: **`PATENT_BAR_BUILD_PROMPT.md`**.
- **The one universal unlock:** _no exam is behind a paywall today._ Every exam workspace, QBank, and
  flashcard set is fully open to any logged-in user. Building the **entitlement + Stripe checkout + free→paid
  gate ONCE** (as part of the Patent Bar build) makes **every** exam monetizable. This is the single
  highest-leverage piece of work in the plan.
- **Then expand** exam-by-exam using the shared paywall. Order in `NEXT_EXAMS_PROMPTS.md`.

**$200K math (Patent Bar, illustrative):** ~350 students/yr × ~$600, or a blend of self-serve + a few
firm/agency seat deals. In a ~3–4K/yr US market that's meaningful share for a niche leader — aggressive
but real. First real dollars target: ~90 days.

> Caveat: this is product / go-to-market strategy grounded in the codebase, **not** financial advice or a
> revenue guarantee.

---

## 2. Content inventory (real numbers, measured 2026-07-20)

Counts are from `apps/web/src/lib/*` data files. "Course KB" is a depth proxy for `*-course-data.ts`.

| Exam | QBank Qs | Flashcards | Course topics | Course KB | Notes |
|------|---------:|-----------:|--------------:|----------:|-------|
| **Patent Bar** | **537** | 511 | 272 | 632 | 61 topics, 379 MPEP-cited, avg 273-char explanations, 0 thin. **Deepest.** |
| MCAT | 581 | 502 | 126 | 314 | Big market, very crowded (UWorld/AAMC). |
| FE (EE) | 562 | 367 | 228 | 530 | Engineering licensure; strong content. |
| FE (ME) | 555 | 432 | 188 | 316 | Engineering licensure; strong content. |
| Security+ | 479 | 246 | 118 | 377 | Huge cert market; has interactive **PBQ sims**. |
| CISSP | lazy-loaded* | 2,250 | 175 | 595 | Cert market; huge flashcard set; QBank lazy-loaded (verify count). |
| LSAT | 201 | 111 | 145 | 201 | Big but very crowded (7Sage/LSAT Demon). |
| SAT | 140 | 81 | 76 | 97 | Hyper-competitive; **Khan is free** — weak paid case. |
| GRE | 88 | 86 | 90 | 105 | Thin QBank; crowded. |
| GMAT | 76 | 73 | 65 | 90 | Thin QBank; crowded. |
| PE (EE) | **1 (stub)** | 231 | 103 | 115 | QBank essentially empty — not launch-ready. |

\* CISSP QBank is loaded via `getCISSPQuestions` (dynamic import); the `question:` heuristic returned 0 —
**verify the real count** before planning CISSP.

**Benchmark:** established prep banks carry ~1,000–3,000 questions. So 500-ish good questions is a
legitimate *launch* bank, not yet "definitive." Growing to ~1,000 + ingesting public-domain official
released exams is the main content lever per exam.

---

## 3. Readiness ranking → build order

Weighting content depth × market value × competition:

1. **Patent Bar** — build now (flagship). Deepest content, high WTP, weak competition, niche you can lead.
2. **Security+** — strong content + PBQ sims, massive cert market, recurring demand.
3. **MCAT** *or* **CISSP** — MCAT = biggest market (but crowded); CISSP = cert market, huge flashcards.
4. **FE (EE / ME)** — engineering licensure; solid content; defined audience.
5. **LSAT** — big market but crowded and thinner QBank; needs content growth to compete.
6. **Deprioritize:** SAT/GRE/GMAT (thin + hyper-competitive, SAT undercut by free Khan). **PE (EE)** needs a
   QBank built first (currently 1 question).

Full per-exam prompts + gaps: **`NEXT_EXAMS_PROMPTS.md`**.

---

## 4. The universal gaps (apply to every exam)

These are the difference between "impressive demo" and "product people pay for":

1. **Monetization plumbing** — entitlement model + Stripe checkout + free-preview→paid gate. **Shared infra;
   build once.** (Stripe service `services/test-prep` (Node, :3010) is now containerized; wire it or move
   entitlement into api-core.)
2. **Content to "definitive"** — grow each QBank toward ~1,000 and ingest official public-domain released
   exams where they exist (Patent Bar: USPTO released exams are the single biggest credibility asset).
3. **Real exam simulation** — timed, format-accurate mock (e.g. Patent Bar = 100 Q, AM/PM, MPEP-open).
4. **GTM + trust** — a per-exam landing page + free diagnostic funnel; real results/testimonials once a
   first cohort exists. (Landing framework already exists at `apps/web/src/app/page.tsx`.)
5. **Accounts production-ready** — real signup, email verification, password reset, per-user entitlement.

---

## 5. How to use these docs next session

- Start with **`PATENT_BAR_BUILD_PROMPT.md`** — paste it (or hand it to the agent) to kick off the flagship
  build. Do **Workstream 1 (monetization) first** — it unlocks every other exam.
- After Patent Bar is sellable, open **`NEXT_EXAMS_PROMPTS.md`** and run the next exam's prompt in the
  priority order above (reusing the shared paywall).
- Keep everything honest: **no fabricated content, no fake numbers, no seeded fake subscriptions.** Real
  data or an honest empty state — always.

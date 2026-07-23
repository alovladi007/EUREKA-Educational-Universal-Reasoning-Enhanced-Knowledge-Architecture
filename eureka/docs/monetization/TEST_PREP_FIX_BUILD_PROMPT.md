# Test-Prep — Fix, Verify & Complete: Build Prompt

> Paste as the opening prompt of a build session. Goal: take EUREKA's 11 test-prep exams from "unverified
> AI content with a systemic answer-key defect" to **blueprint-complete, verified, pass-confident** products,
> fully wired. Evidence: `TEST_PREP_CONTENT_AUDIT.md`. **Read the honesty statement there** — "90% pass" is
> the engineering target (complete + verified + realistic mocks + readiness prediction), not a guarantee.

Data lives in `apps/web/src/lib/<exam>-qbank-data.ts | -flashcard-data.ts | -course-data.ts`.
QBank shape (most exams): `{ question, options: string[], correct: number, explanation, topic?, difficulty? }`.
CISSP differs: `{ question_text, options: {index,text}[], correct_index, ... }`. Blueprints: `exam-config.ts`.

---

## WS1 — Answer-key de-bias (do FIRST; mostly automatable; safe)

**Problem:** correct answers cluster at one index (FE-ME 99.5% A, PE-EE 98.7% A, FE-EE 73% A, Security+ 80% B,
Patent Bar 76% B, MCAT 66% B, SAT 65% A). Spot-checks show keyed answers are *correct* — only mis-positioned.

**Fix:** a script that, per question, randomly permutes `options` and rewrites `correct` to the new index of
the same (unchanged) correct option. **Guards (do not shuffle blindly):**
- Pin "All of the above" / "None of the above" / "Both A and B"-style options to their original last slots.
- Detect naturally-ordered numeric/sequential option sets (e.g. `2, 4, 6, 8`, ascending Ω/values) and either
  keep order or shuffle then re-sort — never present numeric answers out of order.
- Skip CISSP-shape and re-index `correct_index` analogously.
- Deterministic seed (record it) so runs are reproducible; the harness disallows `Math.random()` — seed from
  a fixed value + question id.
**Acceptance:** every bank's key distribution within ~±5% of uniform (25/25/25/25); a unit test asserts it;
diff shows only option order + `correct` index changed, never option text; render check on 2–3 exams.

## WS2 — Correctness verification (the hard part; SME/authoritative required)

I cannot certify accuracy. Build the *pipeline* and do what's automatable; flag the rest for SME sign-off.
- **Ground-truth ingestion where official items exist** (highest trust): USPTO released exams (Patent Bar),
  NCEES sample questions (FE/PE), officially released SAT/PSAT (College Board), LSAT PrepTests (LSAC),
  released AAMC/USMLE sample items. Parse into the bank shape, `source: "official"`, and treat as the
  verification anchor for each topic.
- **Automated checks:** math/units auto-verify where possible (SymPy for quantitative items — FE/PE/GRE/GMAT
  quant/SAT math); dead/duplicate detection; every explanation must name *why the answer is right* AND *why
  each distractor is wrong* + a citation.
- **SME workflow:** add a `verified: 'official' | 'sme' | 'unverified'` field per question; a review queue UI
  (reuse Content Studio) for an expert to accept/edit/reject; the product only counts `verified` items toward
  "readiness". Unverified items are clearly labeled and excluded from mocks.
**Acceptance:** ≥90% of each live bank is `official` or `sme`-verified; unverified items excluded from scored
mocks; every verified item has a citation.

## WS3 — Coverage to blueprint + pass-confident volume

Per exam, using `exam-config.ts` section weights:
- **Map every question to an official section/topic**; add topic tags to the untagged banks
  (FE-EE/FE-ME/PE-EE/SAT/GRE/GMAT). Produce a coverage matrix (section × verified-count × exam weight).
- **Fill thin sections** to at least the exam's per-section weight × a safety multiple.
- **Grow under-volume banks** (GRE, GMAT, SAT, and thin-for-size MCAT/CISSP/LSAT) toward a pass-confident
  size (rule of thumb ~10× the exam form of *verified* items, or the official pool).
**Acceptance:** no section below its blueprint weight; per-exam coverage matrix published; volume targets met.

## WS4 — Realistic timed mocks + readiness/pass-prediction

- Format-accurate **timed full mock** per exam (Patent Bar 100Q AM/PM/MPEP-open; Security+ 90Q/90min w/ PBQs;
  FE/PE 110Q/80Q handbook-open; MCAT sectioned; CISSP CAT-style; SAT/GRE/GMAT adaptive/sectioned per
  `exam-config`). Draw only from **verified** items, weighted to blueprint.
- **Readiness score → pass probability** vs each exam's cut (Patent Bar 70%, Security+ 750/900, CISSP 700/1000,
  FE/PE ~50–65%). Show "you are at X%, pass threshold Y%". Wrong answers → per-topic **review queue** (endpoint
  exists for Patent Bar; generalize).
**Acceptance:** a subscriber can take a format-accurate mock, get a scaled score + pass-likelihood + per-topic
breakdown, and one-click into a targeted review set.

## WS5 — Wiring, entitlement & the study loop

- **Entitlement/paywall** (shared; see `PATENT_BAR_BUILD_PROMPT.md` WS1): gate full QBank/mocks behind a
  subscription in api-core; free diagnostic + preview.
- **Diagnostic → adaptive study plan → practice → mock → readiness**, all persisting to `/me/progress` and
  surfaced in the exam Command Center/Analytics.
- Confirm every exam's QBank/flashcards/course loader renders, records attempts, and feeds analytics.
**Acceptance:** end-to-end loop works for a subscribed user on ≥2 exams; entitlement enforced server-side.

## Priority order

1. **WS1 de-bias** — all exams (fast, high-integrity win). Fix the two broken banks first: FE-ME, PE-EE, FE-EE.
2. **Patent Bar** end-to-end to the 90% bar (already best + cited) as the reference implementation.
3. **Security+ / MCAT** (topic-tagged, decent) — de-bias, cite, verify, mock.
4. **CISSP / FE / PE** — verify + tag + fill.
5. **LSAT** — fix shape/key, grow LR bank.
6. **GRE / GMAT / SAT** — biggest volume gap; grow last (also weakest paid case — SAT undercut by free Khan).

## Definition of done (per exam = "pass-confident")
- [ ] Answer-key distribution ≈ uniform (WS1), asserted by test
- [ ] ≥90% of live items `official`/`sme`-verified, each cited (WS2)
- [ ] Every section ≥ blueprint weight; coverage matrix published; volume target met (WS3)
- [ ] Format-accurate timed mock + readiness/pass-prediction + review queue (WS4)
- [ ] Behind entitlement; diagnostic→plan→practice→mock loop persists & renders (WS5)
- [ ] tsc + lint-gated build pass; browser-verified; **no unverified item in any scored mock**

## Guardrails (the user cares)
- **No fabricated content, no fake numbers, no answer changes during de-bias.** Real/official or clearly-
  labeled unverified.
- **Never market a pass guarantee** without SME sign-off — it's a claims/legal decision.
- Show significant UI before committing; verify in the browser; report honestly what's verified vs not.

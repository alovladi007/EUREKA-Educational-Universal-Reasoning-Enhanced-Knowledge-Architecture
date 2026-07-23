# EUREKA Test-Prep — Deep Content Audit

_Measured 2026-07-20 from `apps/web/src/lib/*` data files + `exam-config.ts` blueprints; keyed answers
spot-checked for correctness. This is the evidence base for `TEST_PREP_FIX_BUILD_PROMPT.md`._

---

## Honesty statement (read first)

- I can rigorously verify **structure, volume, coverage, wiring, and answer-key statistics**, and I can
  **spot-check** factual correctness. I **cannot certify** that every legal/medical/engineering answer is
  correct without authoritative-source or subject-matter-expert (SME) review.
- **No one can guarantee a literal 90% human pass rate.** I treat "90% pass" as the engineering target it
  implies: **blueprint-complete, structurally sound, SME-verifiable content, at pass-confident volume, with
  realistic timed mocks and readiness prediction.** Marketing a pass *guarantee* requires SME sign-off and
  is a legal/claims decision, not an engineering one.

## Headline findings

1. **🔴 Systemic answer-key bias — the #1 defect.** Correct answers are clustered at one position, so the
   banks are gameable and non-predictive (a student who learns "pick A/B" scores high on the bank but not on
   the real exam). Spot-checks show the keyed answers are *correct*, just mis-distributed → fixable by
   **re-shuffling options + re-keying** (mostly automatable), which does **not** change correctness.
2. **🟠 Content is largely unverified AI generation.** CISSP's own file header states: _"400 questions…
   AI-generated. Requires SME review."_ Most banks lack source citations (only **Patent Bar** cites, 100%).
   Accuracy cannot be assumed.
3. **🟠 Volume/coverage gaps vs the real exam.** GRE/GMAT/SAT have barely more questions than one exam form;
   MCAT/CISSP are thin for their large exams. None reach a pass-confident multiple (~10–20× the form, or an
   official item pool).
4. **🟠 Half the exams have no topic tagging** (FE-EE, FE-ME, PE-EE, SAT, GRE, GMAT) → no per-topic weakness
   targeting, weaker adaptive study, weaker pass support.
5. **🟠 No paywall/entitlement, no format-accurate timed mock, no readiness/pass-prediction** across the
   board (from the prior monetization audit).

## Quality matrix (measured)

| Exam | Bank Qs | Real exam | Bank/exam | **Answer-key dist** | Cited | Topic-tagged | Flashcards | Course KB |
|------|--------:|----------:|----------:|---------------------|:-----:|:------------:|-----------:|----------:|
| **Patent Bar** | 536 | 100 Q | 5.4× | 76% "B" ⚠️ | ✅ 100% | ✅ 61 | 511 | 632 |
| **MCAT** | 580 | 230 Q | 2.5× | 66% "B" ⚠️ | ✗ | ✅ 240 | 502 | 314 |
| **FE Electrical** | 610 | 110 Q | 5.5× | **73% "A"** 🔴 | ✗ | ✗ 0 | 367 | 530 |
| **FE Mechanical** | 554 | 110 Q | 5.0× | **99.5% "A"** 🔴🔴 | ✗ | ✗ 0 | 432 | 316 |
| **Security+** | 472 | 90 Q | 5.2× | 80% "B" ⚠️ | ✗ | ✅ 47 | 246 | 377 |
| **CISSP** | 400 | 150 Q | 2.7× | (n/a — diff shape) | ✗ | ✅ | 2,250 | 595 |
| **LSAT** | 200 | 76 Q | 2.6× | skewed 🔴 (verify¹) | ✗ | ✅ 24 | 111 | 201 |
| **SAT** | 139 | 98 Q | 1.4× | 65% "A" ⚠️ | ✗ | ✗ 0 | 81 | 97 |
| **GRE** | 87 | 80 Q | 1.1× | ~balanced | ✗ | ✗ 0 | 86 | 105 |
| **GMAT** | 75 | 64 Q | 1.2× | ~balanced | ✗ | ✗ 0 | 73 | 90 |
| **PE Electrical** | 399 | 80 Q | 5.0× | **98.7% "A"** 🔴🔴 | ✗ | ✗ 0 | 231 | 115 |

¹ LSAT uses long multi-line option strings; the automated key-distribution parse is unreliable — inspect
directly. First sampled LSAT item is correctly keyed to "B".

A realistic exam is **~25% per option**. Bars marked 🔴/⚠️ deviate badly.

## Defect catalog (by severity)

**P0 — integrity (breaks "pass prediction" credibility)**
- Answer-key positional bias on **FE-ME (99.5% A), PE-EE (98.7% A), FE-EE (73% A)**, plus B-clustering on
  Patent Bar (76%), Security+ (80%), MCAT (66%), and SAT (65% A). Fix: de-bias (shuffle + re-key).
- Content correctness **unverified** (AI-generated, no citations except Patent Bar). Fix: SME/authoritative
  verification + citations.

**P1 — coverage & volume**
- Under-volume vs exam: **GRE (1.1×), GMAT (1.2×), SAT (1.4×)**, and thin-for-size **MCAT (2.5×), CISSP
  (2.7×), LSAT (2.6×)**. Fix: expand to pass-confident volume + full blueprint coverage.
- No topic tags on FE-EE/FE-ME/PE-EE/SAT/GRE/GMAT. Fix: tag every item to an official section/topic.

**P2 — product/pass-support**
- No format-accurate timed mock, no readiness/pass-prediction, no diagnostic→plan→mock loop, no entitlement.
- Explanations: mostly present but short and uncited (avg 120–470 chars; Patent Bar/MCAT best).

## What's actually good
- **Patent Bar** — genuinely strong (verified earlier): real statutes/case law, 100% cited, topic-tagged.
- **MCAT & Security+** — topic-tagged, reasonable explanation depth, decent volume; need de-bias + citation.
- **CISSP** — huge flashcard set (2,250) + real video lessons; honest about needing SME review.
- Wiring exists: per-exam QBank/flashcard/course loaders, progress persists to `/me/progress`, analytics.

## Bottom line
The test-prep engine and UI are real, but the **content is not yet trustworthy enough to promise a pass**:
it's unverified AI generation with a serious, systemic answer-key defect. The path to a legitimate
"90%-confident" product is: **de-bias → verify correctness (SME/authoritative) → fill to blueprint at
pass-confident volume → add mocks + readiness prediction → gate as a subscription.** Details and the
step-by-step build prompt are in `TEST_PREP_FIX_BUILD_PROMPT.md`.

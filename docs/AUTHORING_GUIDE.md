# EUREKA — SME Authoring Guide

> **Phase 24 deliverable.** Item authoring standards for SMEs. Pair
> with [`docs/SME_CONTRACT.md`](SME_CONTRACT.md) (the commercial side).

## What you're authoring

You're writing items for the EUREKA learning platform. Each item is a
single self-contained question with:

- **Stem** — the prompt (clinical vignette, scenario, conceptual prompt)
- **Answer choices** — typically 4 or 5, exactly one correct
- **Explanation** — *why* the correct answer is correct AND why each
  distractor is wrong, with citations
- **Tags** — at least one Phase 4.2 skill code; Bloom level; estimated
  difficulty
- **References** — primary-source citations

## Standards by discipline

### USMLE Step 1 / Step 2

- **Stem**: clinical vignette in the NBME style. Patient demographics,
  presenting complaint, relevant history, exam findings, labs/imaging.
  Avoid "throwaway" details unless they're red herrings.
- **Length**: 100–250 words for Step 1, 150–400 for Step 2.
- **Answer choices**: 5 (A–E). Distractors must be plausible — common
  misconceptions, related-but-wrong diagnoses, dose errors, etc.
- **Explanation**: ~250–400 words. Walk through reasoning. Use Step 1
  high-yield references (First Aid, Pathoma, UpToDate citations).
- **References**: ≥3 (textbook + ≥1 primary source, e.g. NEJM / Lancet
  / JAMA).
- **Skill tag**: `STEP1.<system>.<topic>` e.g. `STEP1.CARD.HF` for
  heart failure.

### FE / PE engineering

- **Stem**: NCEES-style scenario with realistic numerical values + units.
  Avoid "rounding" so the answer is uniquely determined by the method,
  not the precision.
- **Length**: 50–200 words.
- **Answer choices**: 4 (A–D). Numeric answers should be ±10% spaced
  (i.e. one common mistake is "off by a factor of 2", another is "wrong
  unit conversion"). Distractor design tests common error modes.
- **Explanation**: Show all work. Reference the NCEES FE / PE Reference
  Handbook equation numbers.
- **References**: NCEES handbook + ≥1 textbook (Hibbeler, Cengel, etc.).
- **Skill tag**: `FE.EE.<topic>` (e.g. `FE.EE.CIRCUITS.AC_ANALYSIS`).

### MCAT / GRE / LSAT / GMAT

- Follow the test's official style guide. AAMC for MCAT, ETS for GRE,
  LSAC for LSAT, GMAC for GMAT.
- Skill tags: `MCAT.<section>.<topic>`, `GRE.<section>.<topic>`, etc.

### AP courses (College Board)

- Items should mirror released AP exam questions in style + difficulty.
- Multiple choice for objective items, free-response for argumentative
  / show-your-work items (handled as `kind=open_response` items).
- Skill tag: `AP.<subject>.<unit>` (e.g. `AP.CALC.BC.U7` for differential
  equations).

### K-12 (CCSS / NGSS)

- Standard-aligned. Each item maps to exactly one CCSS or NGSS code.
- Reading level appropriate to grade band.
- Skill tag: matches the framework code exactly.

---

## Quality bar (universal)

A high-quality item satisfies ALL of:

| Criterion | Test |
|---|---|
| **Single best answer** | A board-certified peer agrees the correct answer is uniquely correct |
| **Plausible distractors** | Each wrong answer corresponds to a real misconception, not a "throwaway" |
| **No double-barrelled stems** | Stem asks one thing, not two |
| **No "always / never / all of the above"** | These bias answer selection independent of knowledge |
| **No copyright infringement** | Stem + explanations are original or properly licensed |
| **No PHI** | For medical items: zero real patient identifiers. Fictional names, scrambled DOBs, no MRNs |
| **Tagged correctly** | Skill code matches the learning objective, not the surface vocabulary |
| **References reachable** | Every citation has a stable URL or printed-page reference |

---

## Item JSON schema (what gets stored)

When you submit an item via `/dashboard/medical/content-studio` (or the
discipline-equivalent), the backend stores it in `items` (Phase 5.1)
with this shape:

```json
{
  "id": "<uuid>",
  "kind": "mcq_single",
  "stem": "A 62-year-old man with a 30-year smoking history presents...",
  "choices": [
    { "id": "A", "text": "Acute coronary syndrome", "is_correct": false },
    { "id": "B", "text": "Chronic obstructive pulmonary disease exacerbation", "is_correct": true },
    { "id": "C", "text": "Pulmonary embolism", "is_correct": false },
    { "id": "D", "text": "Congestive heart failure", "is_correct": false },
    { "id": "E", "text": "Pneumonia", "is_correct": false }
  ],
  "explanation_md": "## Why B is correct\n\nThe clinical picture...",
  "skill_codes": ["STEP1.RESP.COPD"],
  "bloom_level": "analyze",
  "difficulty_self_rating": 3,
  "references": [
    {"label": "Harrison's Principles of Internal Medicine, 21e Ch. 286", "url": "..."},
    {"label": "Vogelmeier et al., GOLD 2024 Report", "url": "https://goldcopd.org/..."}
  ],
  "extras": {
    "discipline": "usmle_step_1",
    "system": "respiratory",
    "exam_blueprint_alignment": ["NBME Step 1: 12% of Resp content"]
  }
}
```

`difficulty_self_rating` (1–5) is your initial guess. Once the item
has ≥30 real attempts, Phase 7.2's IRT calibrator will overwrite it
with `irt_difficulty` + `irt_discrimination` based on actual learner
performance.

---

## Review workflow

```
SME author → drafts in content studio → submit for review
                                          │
                          ┌───────────────┴────────────────┐
                          │                                │
                  Reviewer 1 (peer)              Reviewer 2 (lead SME if disputed)
                          │                                │
                          └───────────────┬────────────────┘
                                          │
                                  Phase 6.4 groundedness check
                                          │
                              ┌───────────┴───────────┐
                              │                       │
                           ≥ 0.85                   < 0.85
                              │                       │
                              ▼                       ▼
                       Phase 10.5 mod queue     Reject + author revises
                              │
                       (medical_misinformation gate)
                              │
                              ▼
                            PUBLISHED → eligible for /assessments, /tutor, mock exams
```

Reviewers gauge:
1. **Correctness** — is the correct answer actually correct?
2. **Clarity** — does the stem unambiguously ask one question?
3. **Plausibility of distractors** — are wrong answers credible?
4. **Skill tag accuracy** — does the tagged Phase 4.2 skill match?
5. **Citation quality** — are references credible + reachable?
6. **Safety** — for medical items, no advice that could harm a real
   patient if applied; for engineering, no calculations that would
   produce unsafe specs.

If reviewer 1 + reviewer 2 disagree, the **lead SME for the discipline**
arbitrates.

---

## Common rejection reasons (avoid these)

- **Two-correct-answer problem** — multiple defensible interpretations.
  Fix: tighten stem.
- **Unobtainable references** — citing a textbook page that doesn't
  exist or a URL that 404s.
- **Trick wording** — e.g. testing comprehension of double negatives.
  Educational items shouldn't be linguistics tests.
- **Off-blueprint** — item content isn't on the published exam outline.
- **Stale evidence** — citing guidelines that have been superseded
  (especially common in medicine — check publication date).
- **Patient-identifiable** — for medical, even fictional patients should
  have stylized identifiers (e.g. "Pt. X, 62yo M" not "John Doe, MRN 12345").
- **Copyright infringement** — distinctive stem language that mirrors
  another publisher's item too closely.

---

## Tools you'll use

- `/dashboard/medical/content-studio` — primary authoring UI for med items
  (other disciplines have similar studios under `/dashboard/<tier>/content-studio`)
- `/dashboard/pedagogy` — browse the Phase 4.2 skill graph
- `/dashboard/tutor` — verify your item by asking the AI tutor to explain
  the correct answer — if it fails or hallucinates, your explanation is
  underspecified
- `/admin/audit` — see your own activity log
- `/dashboard/community` — post questions to the lead SME or other authors

---

## Payment + invoicing

Per the SOW: invoice via the EUREKA contractor portal (Phase 14.2 job
queue mints invoices automatically when items pass review). Payment is
net-15 via Stripe Connect (Phase 10.1 infrastructure).

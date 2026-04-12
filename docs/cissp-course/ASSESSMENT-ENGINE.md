# CISSP Course — Adaptive Assessment Engine Spec

> **AI-generated design document** for the assessment system that
> underpins the CISSP course built from `PROMPTS.md`. This spec is
> course-wide: built once, reused by all 8 domains.
>
> Scope: diagnostic, per-domain quizzes, per-sub-objective micro-
> quizzes, mock exams, weakness drills, spaced repetition, analytics,
> and the predicted-pass-probability algorithm.

---

## 1. Assessment modes

The engine supports seven distinct assessment modes, each with
different purpose, difficulty selection, feedback behavior, and
scoring. All modes draw from the same item bank (50 questions per
domain × 8 domains = 400 items minimum), tagged with domain,
sub-objective, Bloom level, difficulty (1–5), and adaptive-learning
tags.

### 1.1 Diagnostic test

**Purpose:** Establish the learner's initial ability estimate (θ)
across all eight domains before they begin coursework.

**Structure:** 125 questions, weighted to reflect the 2024 exam
outline proportions:

| Domain | Weight | Questions |
|---|---|---|
| 1. Security & Risk Management | 16% | 20 |
| 2. Asset Security | 10% | 13 |
| 3. Security Architecture & Engineering | 13% | 16 |
| 4. Communication & Network Security | 13% | 16 |
| 5. Identity & Access Management | 13% | 16 |
| 6. Security Assessment & Testing | 12% | 15 |
| 7. Security Operations | 13% | 16 |
| 8. Software Development Security | 10% | 13 |
| **Total** | **100%** | **125** |

**Difficulty selection:** Non-adaptive for the diagnostic. Items are
drawn at the intended exam difficulty distribution (roughly 20% easy,
50% medium, 30% hard) so that the initial θ estimate is not biased
by an adaptive warm-up that never saw hard content.

**Time limit:** None. The diagnostic is low-stakes; we want
correctness, not speed.

**Feedback:** Deferred. No per-question rationales during the test;
full rationale review available after submission.

**Scoring output:** A per-domain θ estimate and a whole-exam θ, each
with a standard error, feeding the initial IRT state. A domain
heatmap is generated and presented alongside the recommended learning
path.

### 1.2 Per-domain quiz

**Purpose:** Check understanding after completing a domain's notes
and worked examples. Gate the transition from one domain to the next.

**Structure:** 25 questions drawn randomly from the domain's 50-
question QBank, stratified by difficulty mix matching the source
bank's 10% recall / 40% application / 50% analysis distribution
(3 recall, 10 application, 12 analysis per 25-question quiz).

**Difficulty selection:** Not adaptive, but stratified. Every
administration samples the same difficulty distribution so that
scores are comparable across attempts and across learners.

**Time limit:** 45 minutes (approximately 1.8 minutes per question,
matching exam pacing).

**Feedback:** Full rationale on submission, per-question.

**Scoring output:** Percentage correct; pass threshold 75% for the
readiness gate defined in each domain's lesson plan. Sub-objective
breakdown included.

### 1.3 Per-sub-objective micro-quiz

**Purpose:** Rapid targeted practice on a single sub-objective when
the learner flags a weak area or the engine identifies one.

**Structure:** 10 questions drawn from a single sub-objective's
tag pool. If fewer than 10 items exist for a sub-objective, the
engine pulls the closest-adjacent sub-objective items to fill.

**Difficulty selection:** Adaptive within the sub-objective. After
each item, the next item is selected to target the learner's current
θ ± 0.3 logits (Rasch/1-PL sweet spot for information gain).

**Time limit:** 15 minutes (1.5 min/item, slightly faster than exam
pacing).

**Feedback:** Immediate after each question.

**Scoring output:** Accuracy, time per item, updated θ for the sub-
objective.

### 1.4 Full-length mock exam (CAT-style)

**Purpose:** Summative practice that mirrors the real CISSP CAT
experience as closely as possible.

**Structure:** 125–175 questions, 4-hour timer, adaptive difficulty.
Two independent forms shipped: Mock A and Mock B, so a learner can
sit both without item repetition.

**Item selection algorithm:** Computerized Adaptive Testing (CAT).
At each step:

1. Select the next item from the pool that maximizes Fisher
   Information at the current θ estimate.
2. Enforce content balancing: ensure the proportion of items from
   each domain stays within ±1 percentage point of the target
   weighting throughout the test, not only at the end.
3. Enforce exposure control: no item appears more often than
   *n* times per *k* test administrations (Sympson-Hetter or
   randomesque method).

**Termination rules:** The exam stops when any of these conditions
is met:

- The standard error of θ drops below a threshold (SE_θ < 0.3).
- The item count reaches 175.
- The 4-hour timer expires.
- Early pass/fail is declared at high confidence (see §3).

**Feedback:** Deferred. No per-question rationales during the mock;
full per-question review, domain-level heatmap, time-per-question
analytics, and a predicted pass probability after submission.

### 1.5 Weakness drill mode

**Purpose:** Targeted remediation for the learner's lowest-
performing tags, not just domains. Tags are more granular than sub-
objectives (e.g., `scrm`, `due-diligence`, `rosi`, `hmac-vs-
signature`) so the drill can focus on the specific micro-topic the
learner is missing.

**Trigger:** Can be launched manually by the learner or triggered
automatically when a per-domain quiz reveals a tag cluster below
60% accuracy.

**Structure:** 20 questions, all drawn from the target tag set. If
the learner has seen all items in the set, the engine prioritizes
items last seen longest ago and items previously missed.

**Difficulty selection:** Adaptive within the tag set, starting one
difficulty level below the learner's current θ for that tag so the
drill begins with a small win before raising difficulty.

**Feedback:** Immediate after each question, plus an AI-tutor
explanation on any miss (§4).

### 1.6 Spaced-repetition queue

**Purpose:** Re-expose the learner to items they missed, at
scientifically-informed intervals, to convert short-term
understanding into long-term retention.

**Algorithm:** A modified SM-2 (SuperMemo 2) cadence, adapted for
CISSP question items rather than vocabulary:

- On first miss: schedule at **1 day**.
- On second correct: schedule at **3 days**.
- On third correct: schedule at **7 days**.
- On fourth correct: schedule at **21 days**.
- Any miss at any stage resets to **1 day**.
- Interval multiplier adjusted by item difficulty (harder items lengthen more slowly) and by learner's rolling accuracy for the item's domain (stronger learners lengthen faster).

**Delivery:** Each morning, the SR queue presents items due for
review as a single short session (≤ 20 items per day by default,
user-configurable).

**Scoring output:** Not scored directly; the engine updates the
item's spaced-repetition state and the learner's tag-level θ.

### 1.7 Knowledge checkpoints (inline)

**Purpose:** Low-stakes ungraded retrieval practice interleaved with
the deep-dive notes. See each domain's lesson plan §5.

**Structure:** 5 questions after every 2 sub-objectives. Ungraded,
advances automatically on ≥80% correct.

---

## 2. Item bank requirements

Every question in the item bank is tagged with:

```json
{
  "id": "D1-Q001",
  "domain": 1,
  "sub_objective": "1.9",
  "blooms": "Remember",
  "difficulty": 1,
  "tags": ["risk-management", "quantitative-risk", "ale", "formulas"],
  "calibration": {
    "a": 1.12,
    "b": -0.87,
    "c": 0.20,
    "exposure_count": 0
  }
}
```

`calibration` holds the 3PL IRT parameters once the item has been
field-tested against a calibration sample. Until calibration, items
use default parameters a=1.0, b=difficulty_rating_to_logits(1..5),
c=0.20 (four-option MC guessing floor) and are flagged
`calibrated: false` in the engine so their contributions to θ
estimation are weighted down.

### 2.1 Minimum item counts per mode

The engine requires minimum item counts to operate reliably:

| Mode | Minimum items available |
|---|---|
| Diagnostic | 250 (allows content balancing without repetition) |
| Per-domain quiz | 50 per domain |
| Per-sub-objective micro-quiz | 10 per sub-objective |
| Weakness drill | 20 per tag |
| Mock exam (125–175 CAT) | 400+ pool across domains |

The Domain 1 deliverable produces 50 items toward these totals.
Total course goal: 50 × 8 = 400 items (minimum), ideally 600–800
for robust CAT operation.

### 2.2 Item calibration

Items begin with provisional 3PL parameters based on SME difficulty
ratings. As the course accumulates response data, the engine
re-calibrates using marginal maximum likelihood estimation (MMLE)
on a rolling basis (e.g., weekly):

1. Pool responses from the last N learners per item (default N=200).
2. Fit 3PL parameters via MMLE.
3. Reject items that fail to fit (chi-square p < 0.01) or that show
   unusual a, b, or c parameters (e.g., negative discrimination).
4. Promote items to `calibrated: true` once N responses have been
   collected and the fit is good.

Calibrated items are preferred by the CAT item-selection step;
uncalibrated items are used for exposure-balance or content-balance
filling but not for pivotal early decisions.

---

## 3. Predicted pass probability — IRT algorithm

The signature feature of the adaptive engine is a learner-facing
predicted pass probability that updates after every answered item.
This section specifies the algorithm.

### 3.1 Model choice

Use the **three-parameter logistic (3PL) Item Response Theory model**
because it handles the realities of a multiple-choice exam:

- **a** (discrimination) — how sharply the item distinguishes
  between learners just below and just above the item's difficulty.
- **b** (difficulty) — the θ at which a learner has a 50% chance of
  answering correctly (above the guessing baseline).
- **c** (pseudo-guessing) — the probability a learner with
  infinitely low θ still gets the item right by chance. For four-
  option MC, c ≈ 0.20–0.25.

The probability that a learner with ability θ gets item *i* correct is:

```
P_i(θ) = c_i + (1 − c_i) · 1 / (1 + exp(−1.7 · a_i · (θ − b_i)))
```

The 1.7 scaling factor converts logit units to roughly match the
normal ogive parameterization; it is conventional and can be omitted
if all parameters are estimated in the same metric.

### 3.2 θ estimation (after each response)

After each response, re-estimate θ using **Expected A Posteriori
(EAP)** estimation with a normal N(0, 1) prior:

```
θ_EAP = ∫ θ · L(θ) · π(θ) dθ  /  ∫ L(θ) · π(θ) dθ
```

where L(θ) is the likelihood of the response pattern observed so
far and π(θ) is the prior. In practice the integrals are evaluated
numerically on a grid of θ from −4 to +4 in 0.1-logit steps (81
quadrature points), which is fast enough to run between item
presentations.

Pseudocode:

```
# After the learner answers item i with response u_i (0 or 1):
theta_grid = arange(-4, 4.1, 0.1)        # 81 points
prior = normal_pdf(theta_grid, 0, 1)
likelihood = ones_like(theta_grid)
for each (i, u_i) in history:
    p = three_pl_probability(theta_grid, a_i, b_i, c_i)
    if u_i == 1:
        likelihood *= p
    else:
        likelihood *= (1 - p)
posterior = likelihood * prior
posterior /= trapezoid(posterior, theta_grid)   # normalize
theta_hat = trapezoid(theta_grid * posterior, theta_grid)
theta_se  = sqrt(trapezoid((theta_grid - theta_hat)**2 * posterior, theta_grid))
```

The engine stores `theta_hat` and `theta_se` per learner, per
domain, and updates them after every response.

### 3.3 Per-domain θ vs whole-exam θ

The CISSP does not report per-domain scores, but the learner's
self-improvement loop benefits enormously from domain-level θ. The
engine maintains:

- **θ_d** for each domain d ∈ {1..8} — fit from that domain's items
  only.
- **θ_global** — fit from all items across all domains, weighted by
  the 2024 exam outline proportions.

When computing θ_global from per-domain θ_d values without re-fitting,
use a weighted average:

```
θ_global ≈ Σ_d (w_d · θ_d)
SE_global ≈ sqrt( Σ_d (w_d² · SE_d²) )
```

where w_d is the domain's 2024 weight (e.g., 0.16 for Domain 1).

This is an approximation and less accurate than a full re-fit, but
it is fast enough to update after every item and close enough for
the pass-probability display.

### 3.4 Pass probability

The CISSP passing threshold is published as 700 out of 1000 on a
scaled score. Because neither the scaling function nor the IRT
parameters of the real exam are public, the engine must choose a
proxy θ that corresponds to "pass" in the learner's head. Two
options:

**Option A (internal cutscore):** Run a calibration study with SME
judgment and a sample of learners with known exam outcomes.
Identify the θ_cut at which 50% of the learners passed the real
CISSP on first attempt. Use that as the internal cutscore.

**Option B (bootstrap from item difficulty):** In the absence of
external data, use a policy cutscore: θ_cut = 0.5 (one-half logit
above the average calibration learner). This is an opinionated
default and should be replaced as soon as real pass/fail data is
available.

Given θ_cut and the learner's current (θ_hat, SE_θ):

```
P(pass) = Φ( (θ_hat - θ_cut) / SE_θ )
```

where Φ is the standard normal CDF. When SE_θ is small (well-
measured learners) the probability is close to 0 or 1; when SE_θ
is large (early in the learning journey) the probability hovers
near 0.5. This is the honest behavior of a Bayesian estimate and
the UI should explain it: "We're still learning your ability; more
items will sharpen the estimate."

**Display rules:**

- Hide pass probability until the learner has answered at least 20
  items across the course. Prior to that, show "estimating".
- Never show a precise percentage; show bands (e.g., "likely pass",
  "possible pass", "not yet", "far to go") to avoid false precision.
- Always show both the estimate and the standard error to a user
  who expands the advanced view.

### 3.5 Pseudocode: end-to-end prediction update

```python
def on_response(learner, item, response):
    # 1. Append response to learner history
    learner.history.append((item.id, response))

    # 2. Re-estimate domain theta for the item's domain
    theta_d, se_d = eap_estimate(
        items=[it for (it, r) in learner.history if it.domain == item.domain],
        responses=[r for (it, r) in learner.history if it.domain == item.domain],
    )
    learner.theta[item.domain] = theta_d
    learner.se[item.domain] = se_d

    # 3. Weighted global theta
    weights = {1:.16, 2:.10, 3:.13, 4:.13, 5:.13, 6:.12, 7:.13, 8:.10}
    theta_global = sum(weights[d] * learner.theta.get(d, 0.0) for d in weights)
    se_global = sqrt(sum((weights[d]**2) * (learner.se.get(d, 1.0)**2)
                         for d in weights))

    # 4. Pass probability
    if len(learner.history) < 20:
        pass_prob = None   # not yet meaningful
    else:
        pass_prob = norm_cdf((theta_global - THETA_CUT) / se_global)

    # 5. Spaced-repetition update
    if not response:
        learner.sr_queue.schedule(item, interval_days=1)
    else:
        learner.sr_queue.advance(item)

    # 6. Tag-level update for weakness detection
    for tag in item.tags:
        learner.tag_accuracy[tag].update(response)

    return (theta_global, se_global, pass_prob)
```

---

## 4. AI Tutor integration

The "manager mindset translator" and "AI tutor" differentiators from
PROMPTS.md are implemented as Anthropic API calls triggered on
specific events.

### 4.1 When the tutor is invoked

1. **On a missed question** in any mode except diagnostic and mock
   exam: generate a personalized explanation using the rationale
   as ground truth plus the learner's prior history for context.
2. **On demand** from a learner clicking "explain this to me
   differently" on any question.
3. **After a mini-mock or mock exam** to summarize strengths and
   weaknesses in conversational language.

### 4.2 Prompt template for "why did I miss this?"

The engine sends the AI tutor a structured prompt, not the raw
question. Template:

```
You are the CISSP AI Tutor. A learner just missed a practice
question. Explain why their chosen answer is wrong and why the
correct answer is best, in a way that is:

- Tailored to the learner's demonstrated vocabulary level
  (see summary below).
- Anchored in the manager mindset described in PROMPTS.md.
- Concrete (reference a real-world example the learner has
  seen before if possible).
- Brief (120–180 words).
- Honest about uncertainty if the rationale is itself uncertain.

LEARNER CONTEXT:
- Domain theta estimates: {per_domain_thetas}
- Weakest tags: {weakest_tags}
- Previously seen breach anchors: {previously_seen_cases}
- Bloom level of the missed question: {blooms}

QUESTION:
{question_stem}

OPTIONS:
{options}

LEARNER CHOSE: {learner_choice}
CORRECT ANSWER: {correct_answer}

AUTHORITATIVE RATIONALE (from qbank):
{rationale}

Now produce the personalized explanation.
```

### 4.3 Safety and fidelity rules

The tutor is NOT allowed to:

- Contradict the QBank rationale.
- Cite NIST SP, ISO, or other standards numbers the model is not
  confident about (the backend runs a regex check and flags
  uncertain citations for human review).
- Diagnose real-world security decisions beyond the educational
  scope.
- Invent breach case studies. It may only reference breach
  anchors listed in PROMPTS.md §Differentiators or those already
  presented in the learner's course history.

The backend logs every tutor response for periodic QA review by an
SME. Responses that diverge from the rationale by more than a
similarity threshold are flagged for audit.

### 4.4 Cost control

The tutor is opt-in at the feature-flag level and gated by per-
learner daily quota (default 25 invocations per day). The prompt
template is designed for Claude Haiku 4.5 to keep costs low; the
summary-after-mock use case upgrades to Claude Sonnet 4.6 for
higher quality, again with a per-learner quota.

---

## 5. Performance analytics

The engine exposes four analytic views to the learner and two
administrative views to course operators.

### 5.1 Learner views

**View A — Domain heatmap.** 8 cells, one per domain, colored by
current θ_d (green for ≥ cutscore, amber for close, red for below).
Each cell shows θ_d and its standard error, plus a sparkline of
θ_d over time.

**View B — Bloom breakdown.** For each domain, the learner's
accuracy split by Bloom level (Remember, Understand, Apply,
Analyze, Evaluate, Create). Reveals whether the learner is strong
on recall but weak on analysis — a classic CISSP risk profile.

**View C — Time-per-question vs accuracy.** A scatter with time on
x, correct/incorrect on y. Reveals two common problems:
(a) the learner is fast and wrong (reading comprehension gaps,
premature answer lock-in), and (b) the learner is slow and wrong
(knowledge gaps, not pacing gaps). Different remediation for each.

**View D — Predicted pass probability.** As defined in §3.4, shown
as a band with explanatory text.

### 5.2 Operator views

**View E — Item statistics.** Per-item a, b, c, exposure count,
mean time, and the misfit chi-square. Used for quarterly item-bank
maintenance.

**View F — Cohort progression.** Anonymous aggregate of learners'
θ trajectories over time, by week, by tenure in the course. Used
to detect structural problems: if every learner hits a θ ceiling
at Domain 5 §1.3, the lesson plan for that section needs work.

---

## 6. Data schema (minimal)

The engine requires the following tables (names illustrative; the
EUREKA implementation will map them to the existing
`eureka_db/qbank_*` schema when integrated).

```sql
-- Items
item(
  id TEXT PK,
  domain INT,
  sub_objective TEXT,
  blooms TEXT,
  difficulty INT,
  tags TEXT[],
  stem TEXT,
  options JSONB,       -- {A: ..., B: ..., C: ..., D: ...}
  correct CHAR(1),
  rationale TEXT,
  calibration_a REAL,
  calibration_b REAL,
  calibration_c REAL,
  calibrated BOOL,
  exposure_count INT
);

-- Responses
response(
  id SERIAL PK,
  learner_id TEXT FK,
  item_id TEXT FK,
  mode TEXT,              -- 'diagnostic','domain','micro','mock','drill','sr'
  correct BOOL,
  time_ms INT,
  answered_at TIMESTAMPTZ
);

-- Learner state per domain
learner_domain_state(
  learner_id TEXT,
  domain INT,
  theta REAL,
  se REAL,
  last_updated TIMESTAMPTZ,
  PK (learner_id, domain)
);

-- Spaced repetition queue
sr_item(
  learner_id TEXT,
  item_id TEXT,
  due_at TIMESTAMPTZ,
  stage INT,              -- 1 (1d), 2 (3d), 3 (7d), 4 (21d)
  last_result BOOL,
  PK (learner_id, item_id)
);

-- Tag-level accuracy
learner_tag_state(
  learner_id TEXT,
  tag TEXT,
  total INT,
  correct INT,
  last_seen TIMESTAMPTZ,
  PK (learner_id, tag)
);
```

---

## 7. Integration into EUREKA

When this spec is implemented, integration with the existing CISSP
dashboard is the following mechanical work:

1. Ingest `docs/cissp-course/domain-N/04-qbank.json` files as
   `item` rows, with `calibrated=false` initially.
2. Map each question's `sub_objective` to the topic IDs in
   `eureka/apps/web/src/lib/exam-curriculum.ts:431-477`
   (e.g., `1.3` → `cissp_governance`).
3. Wire the `QBankTab` in
   `eureka/apps/web/src/app/dashboard/test-prep/[exam]/page.tsx`
   to call the engine via an API client method on `apiClient`
   similar to the existing `getAdaptiveLearningPath`.
4. Add per-mode entry points: Diagnostic, Domain Quiz, Micro Quiz,
   Mock Exam, Weakness Drill, SR Review.
5. Render the four learner analytics views (§5.1) as a new
   "Analytics" tab alongside the existing tabs.
6. Feature-flag the AI Tutor integration and gate on the learner's
   per-day quota.

None of this integration should begin until the Domain 1
deliverables have been reviewed and the quality bar locked in, and
until Domains 2–8 have been produced to the same standard so the
item bank meets the minimum counts in §2.1.

---

## 8. What's out of scope for this spec

Deliberate non-goals:

- **The real CISSP exam.** This engine is a practice system; it
  does not administer the (ISC)² exam and does not award the
  credential.
- **Remote proctoring.** The learner's mock exams are unproctored;
  integrity relies on the honor system and on the assumption that
  practice with oneself is the goal.
- **Question authoring UI.** SMEs author questions in JSON files
  like `04-qbank.json`, not through a web form.
- **Multilingual content.** English only, matching the CISSP exam's
  primary language.
- **Certification mapping beyond CISSP.** This engine can be
  repurposed for SSCP, CCSP, or CISM, but those mappings are not
  in scope here.

---

## 9. Review checkpoint

This spec is the last Domain 1 deliverable. It should be reviewed
alongside:

- `docs/cissp-course/PROMPTS.md`
- `docs/cissp-course/domain-1/01-lesson-plan.md`
- `docs/cissp-course/domain-1/02-detailed-notes.md`
- `docs/cissp-course/domain-1/03-storyboards.md`
- `docs/cissp-course/domain-1/04-qbank.json`

After sign-off on Domain 1, the same five artifacts will be produced
for Domains 2 through 8 in the build sequence specified in
`PROMPTS.md`.

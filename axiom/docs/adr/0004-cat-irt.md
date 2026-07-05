# ADR 0004: Adaptive testing on an IRT backbone

Status: Accepted
Date: Phase 0 (decision recorded; implementation is Phase 2)

## Context

For assessment (mock exams and high-stakes-style measurement), a fixed-form test gives every learner the same items regardless of ability. That wastes the strong learner's time on items that are too easy and the struggling learner's time on items that are too hard, and it measures both imprecisely. Computerized adaptive testing (CAT) chooses each next item to be maximally informative about the specific learner, reaching a reliable ability estimate in fewer items.

CAT needs three things to be trustworthy:

1. A measurement model that places learners and items on the same ability scale, with item parameters estimated from real response data (calibration), not guessed.
2. A principled way to pick the next item and to decide when to stop, rather than ad hoc rules.
3. A record of why each decision was made, because adaptive testing that no one can inspect is not defensible for anything approaching high stakes.

## Decision

Adaptive testing uses an **Item Response Theory (IRT) backbone (2PL or 3PL)** with item calibration, maximum-information item selection, and a standard-error stopping rule, and it writes a rationale to a reasoning trace for every decision.

- **IRT model (2PL or 3PL).** Items are placed on a common ability scale with a discrimination and a difficulty parameter (2PL). For item types where guessing is a real factor (for example multiple choice), a lower asymptote (guessing) parameter is added (3PL). The choice between 2PL and 3PL is per item bank or item type, not global.

- **Item calibration.** Item parameters are estimated from response data before an item is used adaptively. Uncalibrated items are not selected by the information criterion; they can be seeded as field-test items to gather the data needed to calibrate them, but they do not drive the ability estimate until calibrated.

- **Maximum-information item selection.** At each step the next item is the one that maximizes Fisher information at the learner's current ability estimate, subject to content-blueprint and exposure constraints. This is what makes the test short and precise.

- **Standard-error stopping rule.** The test stops when the standard error of the ability estimate drops below a target (a precision target), with minimum and maximum length bounds. Stopping is driven by measurement precision, not a fixed count.

- **Reasoning trace on every decision.** For every item-selection and stopping decision, AXIOM writes a rationale to a reasoning trace: the current ability estimate and its standard error, the candidate considered, the information value that drove the choice, the constraints applied, and the stop-or-continue outcome. Every adaptive decision is inspectable after the fact.

## Consequences

**Positive**
- Shorter, more precise tests: fewer items for a more reliable ability estimate than a fixed form.
- Defensible measurement: item parameters come from calibration on real data, and each decision has a recorded rationale, which is a prerequisite for anything approaching high-stakes use.
- The IRT ability scale is a clean input to the mastery and analytics layers.

**Negative and mitigations**
- Calibration needs response volume before items are useful adaptively. Mitigation: items begin as field-test (seeded) items that gather data without influencing scores, and only calibrated items drive the ability estimate.
- Item exposure and content balance can skew if selection optimizes information alone. Mitigation: selection is constrained by content blueprints and exposure controls, not by information maximization alone.
- 3PL parameters (especially guessing) are harder to estimate stably than 2PL. Mitigation: 2PL is the default, and 3PL is used only where guessing genuinely matters and enough data supports the extra parameter.
- Writing a rationale per decision adds storage and write cost. Mitigation: the reasoning trace is compact and structured; inspectability is a core requirement, not optional overhead.

# ADR 0003: The mastery model

Status: Accepted
Date: Phase 0 (decision recorded; implementation is Phase 2)

## Context

AXIOM needs to answer, per learner and per skill, how well the learner knows the skill, and it needs to update that estimate as evidence arrives (correct and incorrect responses, hints used, time taken). This estimate drives practice recommendations, adaptive item selection, reporting, and when to schedule review.

Two properties matter for a teaching product:

1. **Explainability.** Teachers, learners, and institutions need to trust the number. A mastery estimate that no one can explain is hard to act on and hard to defend. An estimate we can point at ("this went up because of these correct responses on these items") is usable.

2. **Retention over time.** Knowing a skill once is not the same as retaining it. The model has to work with a scheduling mechanism that brings skills back for review before they are forgotten, not only track a single point-in-time estimate.

We also want room to improve accuracy later with a stronger model, without rewriting everything that consumes the estimate.

## Decision

Mastery uses **Bayesian Knowledge Tracing (BKT) as the explainable baseline**, with a **Deep Knowledge Tracing (DKT) option behind the same interface**, plus **spaced repetition (SM-2 or FSRS)** for scheduling review. Every mastery change records the evidence that caused it.

- **BKT baseline.** BKT models each skill with interpretable parameters (prior knowledge, learn rate, slip, guess) and produces a probability that the learner knows the skill. It is the default because its updates are explainable in plain terms, which is what teachers and learners need to trust and act on the number.

- **DKT behind the same interface.** The mastery estimator is defined by an interface (given prior state and new evidence, return the updated estimate). BKT is one implementation. A DKT implementation can be swapped in behind the same interface for skills or cohorts where a sequence model measurably improves prediction, without changing callers (adaptive, analytics, tutoring). The interface is the contract; the model is an implementation detail.

- **Spaced repetition.** Scheduling of review uses SM-2 or FSRS. Retention scheduling is a separate concern from the knowledge estimate: the mastery model says how well a skill is known now, and the spaced-repetition scheduler says when to review it next. The two work together.

- **Evidence on every change.** Every mastery update writes a record of the evidence behind it: which item, the response, the outcome, the prior estimate, the posterior estimate, and which model produced it. Nothing changes a learner's mastery without an auditable reason.

## Consequences

**Positive**
- The default model is explainable, which is what a teaching product needs for trust and for teacher action.
- Accuracy can improve later (DKT) without a rewrite, because consumers depend on the interface, not the model.
- Retention is handled explicitly by a proven scheduling algorithm rather than left implicit.
- Every mastery number is defensible: the evidence trail says why it is what it is. This supports the platform's honesty and human-override commitments.

**Negative and mitigations**
- BKT is a per-skill model and does not natively capture cross-skill transfer the way a sequence model can. Mitigation: that is exactly what the DKT option behind the same interface is for, introduced where it measurably helps.
- DKT is less interpretable than BKT. Mitigation: BKT stays the default and the explainable baseline; DKT is opt-in per skill or cohort, and the evidence record still logs which model produced each change.
- Choosing SM-2 versus FSRS is not yet final. Mitigation: scheduling is its own module with its own interface, so the algorithm can be selected and later swapped without touching the mastery estimator.

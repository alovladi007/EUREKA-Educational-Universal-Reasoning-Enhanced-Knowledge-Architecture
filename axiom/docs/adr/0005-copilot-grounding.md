# ADR 0005: How the AXIOM copilot stays honest and grounded

Status: Accepted
Date: Phase 3

## Context

Phase 3 adds an AI-assisted copilot: hints, explanations, and tutoring chat for math. Three risks come with putting a generative assistant in front of learners:

1. **Hallucination.** A model can state confident, wrong mathematics. In a learning tool that is worse than no help.
2. **Answer leakage.** If a learner asks for a hint on the item they are actively solving, a naive assistant hands over the answer and the practice loses its value.
3. **Over-trust.** Learners and teachers can treat AI output as authoritative. It is an aid, not a grader of record.

ADR 0001 already established that reasoning sits behind a swappable provider with a mock fallback, so AXIOM runs without the live EUREKA reasoning core. This ADR records how the copilot uses that seam responsibly.

## Decision

**Ground every reply in retrieved curriculum.** Before calling the provider, the copilot retrieves passages from the seeded lessons, lesson steps, node descriptions, and item worked-explanations, and passes them as the grounding context. The reply carries those passages back as `sources` so every answer is auditable against real lesson material.

**The development mock is extractive, not generative.** The mock provider composes replies from the retrieved passages rather than inventing text, so it cannot hallucinate and is safe to run in tests and local development. When retrieval finds nothing relevant, the mock says so instead of guessing.

**Hints for an active item withhold the answer.** A hint requested with a live `response_token` is scoped to the item's skill node, the answer-bearing worked-explanation passages are withheld from retrieval, and the request sets `reveal_answer=False`. The copilot gives a next-step nudge, not the solution.

**Label and keep it overridable.** Every response is marked `ai_generated` with its `provider`, and the product surfaces it as AI-assisted and teacher-overridable. Nothing the copilot says grades a student or overrides a teacher.

**Retrieval is deterministic lexical today, semantic later.** Grounding uses a lexical overlap scorer so it needs no external embedding model and runs offline. Semantic (pgvector) retrieval is a future upgrade behind the same `retrieve` signature; callers only ever see `Passage` lists.

## Consequences

**Positive**
- The copilot is useful without a live model, and its dev and test behavior is deterministic.
- Grounding plus visible sources makes replies auditable and keeps them tied to what the course actually teaches.
- The active-item hint rule protects the integrity of practice.

**Negative and mitigations**
- Lexical retrieval misses paraphrases a semantic index would catch. Mitigation: the interface is ready for pgvector; only the ranking changes.
- The extractive mock is less fluent than a real model. Mitigation: it is a development and test fallback; the EUREKA reasoning client is the production path, behind the same interface.

## Alternatives considered

- **Call a model with no grounding.** Rejected: it invites hallucination and cannot cite lesson material.
- **Let hints include the worked solution.** Rejected: it defeats the point of practice. Scaffolded, answer-free hints preserve it.
- **Ship pgvector retrieval now.** Deferred: it requires an embedding model and pipeline; lexical grounding is honest and sufficient for the current content, and the seam is built for the upgrade.

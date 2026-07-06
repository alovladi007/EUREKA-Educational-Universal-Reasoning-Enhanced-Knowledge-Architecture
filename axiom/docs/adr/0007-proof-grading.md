# ADR 0007: Proof grading strategy

## Status

Accepted. Implements the Curriculum & Proof Extension, Section 4.

## Context

Computational math and proof-based math are two different grading problems. The
CAS core (ADR 0002) handles the computational side. Proof needs its own
machinery, and there is no single reliable way to auto-grade a free-form proof.

## Decision

Route each proof item to one of four graders by its declared type, with trust
descending from top to bottom:

1. **Formal verification (4.1) - deterministic, fully trustworthy.** A
   formal-track item is written in a proof-assistant language and a kernel
   verifies it. If it type-checks, it is correct, with no AI and no human
   judgment. AXIOM's `FormalVerifier` seam mirrors the identity and reasoning
   provider patterns: `LeanVerifier` shells out to a Lean 4 toolchain in a
   resource-limited subprocess; `UnavailableFormalVerifier` is the honest
   default that never returns a pass, so a formal proof with no toolchain goes
   to manual review rather than being auto-graded. A pass is only ever produced
   by a real kernel; no heuristic stands in for verification. This is opt-in
   (`AXIOM_FORMAL_VERIFIER=lean`), because the formalization overhead is real.

2. **Structured / scaffolded proof (4.2) - auto-gradable, limited freedom.**
   proof_assembly, justification_matching, proof_gap_fill, find_the_error,
   counterexample, and state_definition / state_theorem are all deterministic.
   They carry most of the load in the proof-transition tier, teaching the shape
   of an argument before a student writes prose. Counterexamples are checked by
   evaluating the constructed object against a property predicate in the CAS.

3. **AI-assisted grading with mandatory human sign-off (4.3) - assist, not
   verdict.** A free-form proof gets an AI first pass against a reference proof
   and a milestone rubric, producing a provisional score and line-level gap
   feedback. It never finalizes a high-stakes grade on its own: every such proof
   lands in the human-override queue, and the output is labeled AI-assisted,
   never verification.

4. **Autoformalization bridge (4.4) - experimental assist only.** Not reliable
   enough to grade on; when it succeeds it is a strong signal, when it fails it
   means nothing. A failed autoformalization never lowers a grade.

Every GradingRecord stores the grader type and a confidence, and mastery
evidence is weighted by grader trust (ADR 0003 extension): a formally verified
proof is stronger evidence than an AI-assisted provisional pass. Proof nodes
track two mastery signals, can-apply and can-prove.

## Consequences

- Formal grades are trustworthy but need a toolchain; the default install runs
  without one and routes formal proofs to review, which is honest, not a bug.
- The sandbox is subprocess-level (temp dir, wall-clock timeout, CPU/memory
  rlimits). Production should additionally isolate it (a dedicated container or
  jailed worker); the `FormalVerifier` interface does not change when it does.
- Free-form AI proof grading will never be fully autonomous at the rigor these
  courses demand. Human graders in the loop for Tier 5 and 6 are a feature
  (expert review), not a failure, and the platform presents them that way.

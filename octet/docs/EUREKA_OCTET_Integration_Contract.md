# EUREKA and OCTET integration contract

Status of the Phase 0 gate: **partially confirmed.** The inherited contract is
confirmed and implemented. Three additions from build prompt Section 17 are
open and require a decision from the platform owner. None of the three blocks
Phase 1 through Phase 3, and each is recorded below with the phase it does
block.

This document is the Phase 0 artefact. It is updated, not replaced, when the
open items are decided.

## 1. Inherited contract (confirmed, implemented)

These carry over from the AXIOM integration and are already true in code.

| Item | Decision | Where it lives |
|---|---|---|
| Identity provider | EUREKA issues tokens, OCTET only verifies them. OCTET owns no accounts, passwords or sessions. | `apps/api/app/core/security.py` |
| Token verification | HS256 shared secret in development behind an `EurekaIdentity` Protocol, so JWKS can replace it without touching call sites. | `HmacJwtEurekaIdentity` |
| Production safety | The mock provider raises if it starts in production. The JWKS provider raises `NotImplementedError` rather than falling back to a weaker check, so a misconfigured deployment fails loudly. | `MockEurekaIdentity`, `JwksEurekaIdentity` |
| Shared secret | `OCTET_JWT_SECRET` must equal EUREKA's `JWT_SECRET`. Compose reads it from the same environment variable. | `docker-compose.yml` |
| Network | OCTET joins the external `eureka-network` and reaches api-core at `http://api-core:8000`, the same way AXIOM does. | `docker-compose.yml` |
| Port band | EUREKA holds 4040, 4041, 8000, 5434, 6381. AXIOM holds 4100, 8400, 5441, 6392. OCTET takes 4200 (web), 8500 (api), 5442 (postgres), 6393 (redis). | `docker-compose.yml` |
| Entitlements | OCTET consumes EUREKA's entitlements API. It does not implement its own billing. | Phase 4 wiring, contract confirmed now |
| Deletion | Deletion cascades within 30 days of the EUREKA request, matching the platform retention policy. | Phase 4 wiring, contract confirmed now |
| Creator payouts | Stripe Connect through EUREKA, not a second payments integration. | Phase 7 |
| Design tokens | Shared tokens so the two verticals read as one product. | Phase 3 |

Verified working today: a EUREKA issued HS256 token is accepted by the OCTET
API, and a request with no token is refused with 403.

## 2. Open items (decision required)

### 2.1 Cross vertical prerequisites
**Blocks: Phase 7. Stubbed before then.**

OCTET needs to ask EUREKA "does this learner have AXIOM node X mastered or
owned", because chemistry depends on mathematics the learner may have studied
in the other vertical (the build prompt names C110, C201, OD01, PS05).

Decision needed: does the entitlements API answer mastery questions about
another vertical, or does OCTET query AXIOM directly, or does EUREKA expose a
cross vertical mastery endpoint that both verticals write to.

Recommendation: EUREKA exposes it. Two verticals querying each other directly
becomes N squared as verticals are added, and the shell already holds identity.

### 2.2 LTI 1.3 termination point
**Blocks: Phase 4.**

Decision needed: does LTI terminate in the EUREKA shell and fan out to
verticals, or does each vertical terminate its own LTI launches.

Recommendation, and the build prompt agrees: terminate in the EUREKA shell.
LTI certification is per platform, gradebook writeback is a shared concern, and
doing it once means the second and third verticals inherit it. Per vertical LTI
means certifying every vertical separately.

### 2.3 Tutor gateway model access and logging
**Blocks: Phase 7.**

Decision needed: which model the guardrailed tutor calls, whose API budget it
draws on, where transcripts are stored, and what the sampling rate is for
guardrail audits.

Constraint that is not negotiable regardless of the answer: the tutor gateway
sits outside the grading path. Graders stay deterministic and independently
verified. The tutor may never state an answer to a live item, exceed the
learner's current hint rung, or contradict a grader.

## 3. What OCTET commits to in return

- No duplicate identity, billing or LMS integration. Those live in EUREKA.
- Deterministic grading with an independent verifier for every grader. Nothing
  ships on a grader's own say so.
- The safety policy in build prompt Section 18 is enforced in OCTET, not
  delegated: no synthesis routes for weapons, explosives, chemical warfare
  agents or controlled substances, a curated only target pool for the
  retrosynthesis trainer, and safety flags that exclude a molecule from every
  generative surface including tutor retrieval.
- Honest status reporting. `docs/STATUS.md` states what is not done.

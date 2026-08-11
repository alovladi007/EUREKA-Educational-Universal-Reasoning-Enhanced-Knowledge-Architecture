# EUREKA and OCTET integration contract

Status of the Phase 0 gate: **partially confirmed.** The inherited contract is
confirmed and implemented. Of the three additions from build prompt Section 17,
one is now decided (2.2, LTI termination) and two remain open. Neither open
item blocks Phase 4.

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
**DECIDED 2026-08-10: EUREKA exposes it, per the recommendation.**

OCTET needs to ask EUREKA "does this learner have AXIOM node X mastered or
owned", because chemistry depends on mathematics the learner may have studied
in the other vertical (the build prompt names C110, C201, OD01, PS05).

What was decided: api-core serves
`GET /me/cross-vertical/mastery?vertical=axiom`
(`app/api/v1/endpoints/cross_vertical.py`), which forwards to the vertical's
own mastery endpoint with the caller's token and returns the answer verbatim,
naming its source. The shell holds identity, so the shell holds the crossing
point; verticals never query each other directly (N squared as verticals are
added), and no vertical holds a copy of another's mastery state. Adding a
vertical is one registry line once it exposes a mastery endpoint that accepts
the shared EUREKA token. Verified live against AXIOM's `/api/v1/mastery/me`
on the shared network.

What OCTET still owes: calling it from the path planner when a chemistry
node's prerequisite is mathematical, and deciding per node what "not mastered
in AXIOM" does (advisory note, not a hard gate, is the working assumption -
OCTET's own prerequisite graph stays the authority inside chemistry).

### 2.2 LTI 1.3 termination point
**DECIDED 2026-07-24: each vertical terminates its own LTI launches.**

The decision went against the recommendation that was recorded here, and
against the build prompt, so the reasoning is worth keeping rather than
quietly overwriting.

What was recommended: terminate in the EUREKA shell. LTI certification is per
tool, gradebook writeback is a shared concern, and doing it once means later
verticals inherit it.

What was decided: OCTET terminates its own, matching what AXIOM already does.

What made the difference: the shell recommendation described an architecture
that does not exist. EUREKA has a full LTI 1.3 tool implementation and so does
AXIOM, both live, both with registered platforms. Choosing the shell for OCTET
would have left the codebase with two implementations plus a third vertical
reaching across a boundary the other vertical does not respect, which is a
worse shape than three consistent ones. It also keeps each vertical
independently deployable, which is the property the port band and the separate
compose stacks were chosen to preserve.

What it costs, stated plainly so nobody rediscovers it later:

- Three LTI certifications rather than one, and a fourth for every vertical
  added afterwards.
- Three sets of tool keys to rotate, and three places a launch bug could leak
  a session.
- Grade passback logic maintained three times.

If those costs bite, the migration is to move termination into the shell and
have verticals receive a launch context over the existing token bridge. That
is a larger change once three implementations exist than it would have been
now, which is the real price of this decision.

OCTET's implementation mirrors AXIOM's rather than inventing a second shape:
the same OIDC initiation, launch verification, nonce and state handling, and
AGS grade passback, with the platform public key pinned for offline and test
use and JWKS in production.

### 2.3 Tutor gateway model access and logging
**DECIDED 2026-08-10: the tutor routes through api-core's reasoning
endpoints. Implementation stays gated on the red-team review.**

What was decided: when the OCTET tutor ships, it calls EUREKA api-core's
reasoning endpoints (`app/api/v1/endpoints/reasoning.py`) rather than holding
its own model credentials - so the model choice, the API budget, and the
transcript store are EUREKA's, configured in one place, and OCTET never
carries a provider key. Transcripts live where api-core's reasoning layer
already logs them. Guardrail audit sampling starts at 100% of tutor
transcripts until the red-team review sets a lower documented rate; it does
not launch with a sample rate chosen by convenience.

What remains gated: the tutor itself. It does not ship until the red-team
review of the guardrails passes, and recording this decision is not that
review.

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

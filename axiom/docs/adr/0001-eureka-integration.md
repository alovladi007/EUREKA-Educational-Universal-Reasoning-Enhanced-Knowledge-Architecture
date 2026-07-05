# ADR 0001: How AXIOM integrates with EUREKA

Status: Accepted
Date: Phase 0

## Context

AXIOM is the mathematics vertical of EUREKA. EUREKA already owns identity (users, roles, credentials), a reasoning core, and the broader learning platform. AXIOM must add math-specific capability without duplicating or forking what EUREKA already provides.

Two integration concerns dominate at the foundation stage:

1. **Authentication and identity.** AXIOM needs to know who the caller is and what they are allowed to do. Building a second password system inside AXIOM would create two sources of truth for credentials, two places to leak them, and two account lifecycles to keep in sync. That is a liability, not a feature.

2. **Reasoning.** AXIOM's copilot and several planned tutoring features need a reasoning engine. EUREKA has one. AXIOM should use it rather than stand up a competing stack, while still being able to run and be tested locally without the full EUREKA reasoning core available.

AXIOM runs as a separate service (its own API on port 8400, its own web app on port 4100, its own Postgres and Redis), so it cannot simply share an in-process session with EUREKA. The link has to be over a well-defined boundary.

## Decision

**Authentication.** AXIOM verifies EUREKA-issued JWTs. It does not run its own password system.

- In development, EUREKA and AXIOM share an HS256 signing secret. AXIOM verifies the token signature, expiry, issuer, and audience on every request.
- Token verification sits behind an interface that is JWKS-ready for production. Moving from a shared HS256 secret to asymmetric keys fetched from EUREKA's JWKS endpoint is an implementation swap behind that interface, not a change to callers.
- The AXIOM web app reads the JWT that EUREKA's web app stores in the browser and sends it as a Bearer token to the AXIOM API. When there is no valid token, the web app sends the user to EUREKA's login.

**Identity sync.** AXIOM syncs users, roles, and enrollments from EUREKA into its own tables so that math-side records (mastery, submissions, assignments) can reference stable local identifiers and AXIOM can answer authorization questions without a round trip on every call. EUREKA remains the source of truth; AXIOM holds a synced projection.

**Reasoning.** AXIOM's copilot calls EUREKA's reasoning core first, through a swappable interface (a client contract, not a hard dependency on one implementation). A mock fallback implements the same interface for local development and tests, so AXIOM runs end to end without the live reasoning core. Swapping the mock for the real client, or for a different provider later, is a configuration and wiring change, not a rewrite of the copilot.

## Consequences

**Positive**
- One source of truth for credentials. AXIOM never stores or checks passwords, which removes an entire class of security and compliance burden from the math vertical.
- Clean local development. The JWKS-ready interface plus the reasoning mock let a developer run AXIOM without provisioning EUREKA's production secrets or reasoning core.
- A stable seam for production hardening. Verification and reasoning are both behind interfaces, so HS256-to-JWKS and mock-to-real are contained changes.

**Negative and mitigations**
- AXIOM depends on EUREKA being able to issue tokens and, eventually, to serve a JWKS endpoint. Mitigation: the verification interface caches keys and fails closed with clear errors.
- The synced projection of users, roles, and enrollments can drift from EUREKA. Mitigation: sync is treated as a projection with a defined refresh path, and EUREKA stays authoritative on conflict.
- A shared HS256 secret in development is a real secret to manage. Mitigation: it is development-only, is never the production posture, and the interface is built for asymmetric keys from day one.

## Alternatives considered

- **AXIOM runs its own accounts and passwords.** Rejected: two credential stores, duplicated account lifecycle, and a second attack surface, for no product benefit.
- **AXIOM calls EUREKA to authorize every single request (no local sync).** Rejected for the hot path: it couples every AXIOM request to EUREKA availability and latency. A synced projection with EUREKA as source of truth gives the same correctness with far better resilience.
- **AXIOM embeds its own reasoning stack instead of calling EUREKA.** Rejected: it duplicates a core EUREKA asset and fragments the reasoning experience. The swappable interface with a mock fallback gives local independence without forking reasoning.

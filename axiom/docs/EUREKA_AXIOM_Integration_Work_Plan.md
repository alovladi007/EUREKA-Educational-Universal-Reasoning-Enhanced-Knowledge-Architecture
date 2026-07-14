# EUREKA-AXIOM Integration Work Plan

What must exist on the EUREKA side for AXIOM (the Engineering Mathematics
vertical built in this series) to plug in and function as one product. This is
the concrete version of Section 17 of the AXIOM build prompt.

Honest scoping note. This plan is written against EUREKA's known architecture
(FastAPI, Next.js 14, PostgreSQL with pgvector, Stripe Connect, creator
marketplace). It has not been written against EUREKA's actual code. Before
executing this plan, run the codebase audit you already commissioned and mark
each item below as exists / partial / missing. Several items may already be
built; do not rebuild what the audit confirms.

The AXIOM slice, as delivered, runs standalone with no auth, an anonymous
learner id, SQLite, and in-process grading. Every gap below exists precisely
because those four shortcuts must be replaced by EUREKA-provided capabilities.

---

## 0. The critical path (do these three first)

Everything else is phased; without these three, the systems cannot function
together at all.

1. Identity: EUREKA issues tokens, AXIOM verifies them (Section 1).
2. Entitlements: EUREKA says who has purchased what, AXIOM enforces it
   (Section 3). This is the monetization link and it does not exist in the
   AXIOM slice at all.
3. User and enrollment sync: AXIOM's learner_id becomes EUREKA's user id
   (Section 2).

## 1. Identity and SSO (EUREKA as the identity provider)

AXIOM must not run its own accounts. EUREKA needs to expose:

- Token issuance. OAuth2 or signed JWT on login, with claims for user id,
  tenant or organization, display name, and roles. Short-lived access token
  plus refresh.
- A JWKS endpoint (or published public key) so AXIOM verifies tokens locally
  without a network call per request.
- A canonical role taxonomy. AXIOM needs at minimum: learner, teacher, tutor,
  parent, admin, author. If EUREKA today only has creator and learner (the
  marketplace pair), extend the role model; map creator to author.
- Logout and token revocation semantics that AXIOM can respect.

AXIOM-side counterpart (small): an auth dependency on every route that
verifies the JWT and replaces the current free-text learner_id with the token's
subject. The current anonymous localStorage id in practice.html goes away.

Acceptance: a user signs into EUREKA, lands on an AXIOM page, and every
/v2 and /v3 call carries a verified identity with roles.

## 2. User, enrollment, and roster sync

- A users API or event stream AXIOM can consume: created, updated, deleted.
  Deletion matters legally (see Section 8): deleting a EUREKA account must
  cascade to AXIOM attempts, mastery evidence, and issued variants.
- An enrollment concept. The marketplace model gives you purchases; a course
  also needs membership (which learners belong to which course or cohort, and
  which teacher owns it). If EUREKA has no enrollment table yet, this is new
  EUREKA schema, not AXIOM schema.
- Decide push versus pull. Recommendation: EUREKA emits webhook events
  (user.updated, enrollment.created, entitlement.granted) and AXIOM subscribes;
  add a nightly reconciliation pull as the safety net.

## 3. Entitlements and payments (the monetization link)

This is the piece with zero representation in the AXIOM slice and the one that
makes AXIOM a sellable EUREKA product.

- Catalog: AXIOM courses (Linear Algebra, ODEs, PDEs and Fourier) registered as
  EUREKA products. Decide first-party products versus creator products under
  Stripe Connect; first-party is simpler and correct here since you are the
  author.
- Entitlement API: given (user, product), is access active. AXIOM checks this
  at next-item and attempt time (cache with a short TTL; do not call Stripe on
  the hot path).
- Free-tier policy: which units are free samples (Unit 1 is the natural free
  demo) versus paid, expressed as entitlement rules, not hardcoded in AXIOM.
- Webhooks from EUREKA on purchase, refund, and expiry so AXIOM access flips
  without polling.

## 4. Copilot and the reasoning core

The AXIOM build prompt says the copilot calls EUREKA first. Make that contract
real:

- Decide the boundary honestly. If EUREKA's reasoning layer is itself a wrapper
  over model APIs plus pgvector retrieval, the pragmatic call is: EUREKA owns
  retrieval and the vector store (one pgvector instance, one embedding
  pipeline, tenant-scoped collections), and exposes a single completion or
  reasoning endpoint AXIOM calls for hint generation, worked solutions, and
  item drafting. AXIOM keeps its SymPy validation gate on everything that comes
  back.
- Define the request and response schema now (task type, course context,
  retrieval scope, max tokens, safety flags) even if the first implementation
  is thin. AXIOM builds against the interface with a mock, per the build
  prompt.
- Ingestion path: AXIOM's lessons, items, and definition library get embedded
  into EUREKA's vector store so retrieval is grounded in the course's own
  content.

## 5. Frontend integration

- Decide the shell model. Two viable options: (a) AXIOM pages live inside the
  EUREKA Next.js app as a route group (one deploy, shared session, simplest),
  or (b) AXIOM stays a separate app behind the same domain with SSO (cleaner
  separation, more plumbing). Recommendation for a solo builder: (a).
- Shared design system: EUREKA's tokens and components replace the standalone
  practice.html styling. The practice page becomes a React page using the same
  component library, with MathLive for input and KaTeX for rendering (the
  current plain-text math entry is the weakest part of the learner experience).
- Navigation and progress surfaces: EUREKA's dashboard shows AXIOM mastery and
  streaks; AXIOM deep-links back into EUREKA catalog and account pages.

## 6. Analytics and events

- One event bus. AXIOM emits Caliper-style learning events (attempt graded,
  mastery changed, misconception diagnosed, item served); EUREKA ingests them
  into its analytics store and renders teacher and learner dashboards.
- Define the event envelope (event type, actor, object, tenant, timestamp,
  payload) once, in EUREKA, and version it. AXIOM already records everything
  needed (attempts, evidence rows, diagnoses); this is a publishing layer, not
  new capture.

## 7. Infrastructure and data topology

- Database: move AXIOM from SQLite to the production PostgreSQL. Recommendation:
  same Postgres cluster, separate schema (axiom.*), separate migration history
  (Alembic), foreign keys to EUREKA users by id only (no cross-schema FK
  constraints). This keeps one operational surface without entangling
  migrations.
- Deployment: AXIOM's FastAPI service joins EUREKA's compose or k8s setup
  behind the same gateway, with CORS, rate limiting, and request tracing
  handled at the gateway once for both.
- Grading isolation: before any external user submits input, AXIOM grading
  calls move into sandboxed workers with hard timeouts (Celery queue on
  EUREKA's existing Redis). SymPy simplify on adversarial input is a real
  denial-of-service vector; this is not optional for a public deployment.
- Secrets and config: one env convention, one secrets store, DATABASE_URL and
  JWKS URL and entitlement endpoint injected, nothing hardcoded.

## 8. Privacy, safety, and compliance glue

- Account deletion cascade: one EUREKA deletion request removes AXIOM attempts,
  mastery evidence, and issued variants. Build the cascade and test it; this is
  a legal requirement, not a feature.
- Minors: if EUREKA serves minors anywhere, the consent flow lives in EUREKA
  and AXIOM inherits the flag (affects analytics retention and any future
  copilot features).
- Data retention policy: decide how long attempt-level data lives, in EUREKA
  policy, enforced in both schemas.

## 9. Suggested sequence

Phase I (integration MVP): Sections 1, 2, 3 critical path, plus the Postgres
move from Section 7. Outcome: a signed-in EUREKA user with an entitlement
practices AXIOM Unit 1, and a purchase in EUREKA unlocks a paid unit.

Phase II (one product feel): Section 5 frontend merge with MathLive input,
Section 6 events into the EUREKA dashboard.

Phase III (intelligence and scale): Section 4 reasoning contract made real,
grading workers from Section 7, deletion cascade and retention from Section 8
hardened.

## 10. Open decisions to make before writing code

1. First-party versus Stripe Connect creator model for AXIOM courses.
2. Route group inside the EUREKA app versus separate app behind SSO.
3. One shared pgvector store (EUREKA-owned) versus AXIOM standing up its own.
4. Push (webhooks) versus pull for user and entitlement sync, or both.
5. Whether EUREKA's current role model can express teacher, parent, and tutor,
   or whether marketplace roles need extending first.

Each of these is cheap to decide now and expensive to reverse later. My
recommendations are inline above (first-party, route group, EUREKA-owned
vector store, webhooks plus nightly reconciliation, extend the role model),
but the audit of EUREKA's real state should confirm before committing.

---

## Appendix: status against the live platform (audited 2026-07-13)

The plan was written against the standalone reference slice. The live AXIOM in
this repo has already replaced the slice's four shortcuts in whole or part:

- Identity (S1): DONE in live AXIOM -- EUREKA SSO bridge, JWT verification on
  routes, token handoff, dev auto-login for direct access.
- User sync (S2): PARTIAL -- shared identity gives one user id; a deletion
  cascade for AXIOM attempts/mastery exists via retention machinery (CT wave),
  enrollment membership lives in EUREKA api-core.
- Entitlements (S3): MISSING -- no entitlement check at next-item/attempt time;
  this remains the monetization link to build (EK backlog).
- Copilot contract (S4): PARTIAL -- AXIOM has its own reasoning provider
  interface + pgvector retrieval; serving the contract from EUREKA api-core is
  EK-2 in the Gap Register.
- Frontend (S5): DONE for shell -- AXIOM is a separate Next.js app behind the
  EUREKA sidebar with SSO handoff; MathLive + KaTeX are in (BP-1).
- Events (S6): DONE -- Caliper events package + analytics ingestion (RW-1).
- Infra (S7): DONE -- Postgres (separate DB), compose behind gateway, Celery
  workers on Redis for async grading; hard per-call sandbox timeouts remain a
  hardening item.
- Privacy (S8): PARTIAL -- FERPA/COPPA consent, audit log, retention (CT wave);
  the cross-system deletion cascade test is an EK item.

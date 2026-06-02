# Third-Party Integrations — Feature Flags (P2 / Track B)

Every external-dependency integration in EUREKA is **environment-gated**:
it activates when its credentials are present and **degrades cleanly**
(no crash, honest behaviour) when they're absent. This means the platform
is fully runnable in dev/demo with **zero external keys**, and goes "live"
the moment you drop the keys in — no code change required.

| Integration | Flag (env var) | With key | Without key |
|---|---|---|---|
| **Payments** (test-prep) | `STRIPE_SECRET_KEY` + `STRIPE_PRICE_<PLAN>` | real Stripe Checkout Session | non-prod: labeled mock; **prod: 503** |
| **AI Tutor** (api-core) | `ANTHROPIC_API_KEY` | real Claude agent w/ tools | deterministic Socratic stub |
| **RAG / embeddings** (api-core) | (`embed_fn` injection; default stub) | swap in a real embed model | sha256→1024-dim stub vectors |

## 1. Payments — Stripe (test-prep)

`services/test-prep/app/api/v1/endpoints/pricing.py :: POST /subscribe`

Scaffolded in Track B. Previously it returned an **unlabeled** fake
`mock_session_123` success unconditionally — which would have silently
"succeeded" payments in production. Now:

- **`STRIPE_SECRET_KEY` set** → creates a real `stripe.checkout.Session`
  (subscription mode). The plan's Stripe Price id is read from
  `STRIPE_PRICE_<PLAN_ID>` (e.g. `STRIPE_PRICE_COMPLETE_BUNDLE`). Missing
  price → `400` with the exact env var to set. `stripe` SDK imported
  lazily, so it's only required when a key is configured.
- **No key, non-production** → `{"success": true, "mock": true, ...}` with
  a message naming the env vars to set. Lets the checkout UI flow be
  exercised without real payments.
- **No key, production** (`ENVIRONMENT=production`) → `503 Payments are
  not configured`. We refuse to fake a checkout in prod.

To go live: set `STRIPE_SECRET_KEY` and one `STRIPE_PRICE_*` per plan id
(`test_prep_only`, `qbank_only`, `complete_bundle`) on the test-prep
service. (Other Stripe touchpoints — `api-core/resume_billing.py`,
`marketplace_pricing.py`, `notebook/routes/payments.js` — follow the same
key-gated pattern and are out of scope for this scaffold.)

## 2. AI Tutor — Anthropic Claude (api-core)

`services/api-core/app/services/tutor_agent.py`

Already feature-flagged (verified). `_client()` reads `ANTHROPIC_API_KEY`;
if it's unset OR a placeholder (`sk-ant-your…`, `<paste…`), the agent
routes to `_stub_turn()` — a deterministic Socratic reply that still
exercises one `retrieve` tool call against the RAG store. So the tutoring
UX works end-to-end with no key (canned-but-coherent), and becomes a real
Claude agent (with tool use + groundedness checks) when the key is set.

To go live: set `ANTHROPIC_API_KEY` on api-core. (medical-school's NestJS
"AI Tutor powered by Claude" uses the same key on its own service.)

## 3. RAG / embeddings (api-core)

`services/api-core/app/services/rag.py`, `item_search.py`

Already stubbed (verified). `upsert_chunk(..., embed_fn=None)` defaults to
`_stub_embedding` — a deterministic sha256→1024-dim vector. Retrieval
works (cosine over pgvector) with reproducible-but-non-semantic vectors,
so the pipeline is exercisable offline. To use real semantic embeddings,
pass an `embed_fn` backed by an embeddings API (the call sites already
accept the injection) and re-run the ingest jobs.

## Not an EUREKA integration: ML inference (ECG / BraTS)

The trained ECG-U-Net / BraTS segmentation models referenced in the git
history belong to the **Synapse / Galileo** medical-imaging platform (the
git remote), not EUREKA's runtime surface. EUREKA's only "AI" surface is
the Claude tutor above (key-gated). No EUREKA FE page calls an ML
inference service, so there is nothing to scaffold here.

_Last updated: P2 Track B._

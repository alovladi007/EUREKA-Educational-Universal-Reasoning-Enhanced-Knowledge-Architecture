# AI Tutor review — what is missing

Reviewed 2026-08-12 against the running stack: axiom-api on :8400, axiom-web on
:4100, eureka-api-core on :8000, with a real bearer token. Everything below was
observed from the live system, not read off the source.

**Scope.** "AI Tutor" is `/copilot` — hint, explain, chat, proof-tutor, item
generation, teacher assist. `/tutor` is a different thing: a human whiteboard
over websockets, with no AI in it, and it is out of scope here.

## The one-line answer

The retrieval half is real and good. The reasoning half does not exist yet, so
the tutor cannot explain anything — it finds the right passages and reads them
back. Asked *"What is the derivative of sin(x)?"* it retrieves the trig
derivative lesson and never says **cos(x)**.

## What is genuinely built

Worth stating first, because the gaps below are all in one layer and the rest is
solid.

| Piece | Evidence |
|---|---|
| pgvector semantic store | live: `{"store":"pgvector","embedding_provider":"sentence_transformers","rows":4579}` |
| Retrieval quality | "why induction needs a base case" returned the induction lesson step on shifted starts, the Induction skill, and the Induction lesson — the right four passages |
| Answer withholding | `/copilot/hint` on "Compute 2 + 8 * 7" did **not** contain 58 |
| Source citation | every reply carries its sources; the UI shows "Show sources (4)" |
| Transcript persistence | `copilot_sessions` 6, `copilot_messages` 14 |
| Provider abstraction | clean Protocol, fails soft to a deterministic fallback so a dead backend never 500s a learner |
| Disclaimer | the page carries an honest AI-assisted banner |

## The gaps, ranked

### 1. There is no model. This is the whole problem.

`AXIOM_REASONING_PROVIDER: eureka` points at `api-core:8000`, which is reachable
(verified, HTTP 200). EUREKA's `/api/v1/reasoning/generate` uses Anthropic **when
`ANTHROPIC_API_KEY` is set** and otherwise falls back to a deterministic
composition. No key is set, so:

    POST /api/v1/reasoning/generate  ->  {"provider": "grounded-deterministic",
                                          "text": "Working on: ...\n\nFrom C104: ..."}

The composition is literally `f"From {label}: {text[:400]}"` over the top three
passages. That is a search result with a chat skin. Everything in section 2
onward is downstream of this.

**Fix:** set `ANTHROPIC_API_KEY` on api-core. The code path already exists and
is already grounded and guarded. This is configuration, not construction — but
nothing else on this list matters until it is done.

### 2. The API and the UI both claim more than is true

With the deterministic backend, AXIOM's chat response still returns:

    {"ai_generated": true, "provider": "eureka", "grounded": true}

and the UI badges the reply **"AI — VIA EUREKA"**. EUREKA itself is honest — it
returns `provider: "grounded-deterministic"` — and AXIOM discards that string and
substitutes its own. A learner is told a model wrote a reply that no model
touched.

This is the house rule about invented data applied to a capability claim rather
than a number. **Fix:** pass EUREKA's `provider` through unchanged, and set
`ai_generated` from it rather than from "which provider object did we
construct".

### 3. Conversation memory is a no-op from end to end

Verified live. Turn 1: *"Let us talk about induction."* Turn 2, same session:
*"why does it need one?"* — the sources came back as uniqueness proofs,
"no elementary antiderivative", and cryptography. Nothing to do with induction.

The chain, every link of which exists and none of which works:

1. messages **are** stored in `copilot_messages`
2. `service.py` **does** load the last N and build `history`
3. it **does** pass `history` to the provider
4. EUREKA's `GenerateRequest` **does** declare a `history` field
5. …and the handler never reads it. Not in the deterministic path, and not in
   the Anthropic path either.

Separately, `retrieve(session, message, ...)` is called with the **current
message only**, so a five-word follow-up is retrieved on those five words with
no context. That is the direct cause of the off-topic sources.

**Fix:** two independent things — send history into the model's `messages` array,
and build the retrieval query from the last turn or two rather than the latest
utterance alone.

### 4. The tutor knows nothing about the learner

A grep across the whole copilot domain for `MasteryState`, `p_known`, `mistake`,
and `Attempt` returns **nothing**. The tutor cannot see that you have p_known
0.2 on ALG.1, that you got three questions wrong on DM04 yesterday, or where the
path planner thinks you are.

This is the biggest *product* gap as opposed to the biggest technical one. A
general chatbot can already explain induction. What an integrated tutor can do
and a general one cannot is say "you missed exactly this in Practice on
Tuesday — look at the base case again". The data is all there in the same
database; the copilot simply never asks for it.

### 5. No rate limiting and no cost control

No throttle, quota, or budget anywhere in the copilot domain or core config. The
moment a real key is configured, any authenticated learner can call the model in
a loop. Per-user and per-tenant caps should land in the same change as the key.

### 6. No streaming

Replies arrive in one block after the full round trip. With the deterministic
backend that is instant; with a real model it is several seconds of dead air on
every turn, which is the difference between a tutor that feels alive and one
that feels broken.

### 7. Built capabilities that no interface reaches

| Endpoint | Called from the UI? |
|---|---|
| `/copilot/chat` | yes — `/copilot` |
| `/copilot/hint` | yes — `/practice` |
| `/copilot/generate-items` | yes — `/studio` |
| `/copilot/explain` | **no caller** |
| `/copilot/proof-tutor` | **no caller** |
| `/copilot/teacher-assist` | **no caller** |
| `/copilot/counterexample-search` | **no caller** |
| `/copilot/proof-practice` | **no caller** |
| `/copilot/embeddings/status`, `/rebuild` | **no caller** |

The Socratic proof tutor is the notable one: it is built, it is the most
distinctive thing here, and there is no way for a learner to reach it. The
`/copilot` page is chat-only (356 lines, one endpoint).

### 8. Passages are cut mid-word

Visible in the UI: *"…the standard step hands P(k+1) only the single pre"*. The
cause is `text[:400]` in EUREKA's composition — a hard slice with no sentence
boundary and no ellipsis. Cosmetic next to the rest, but it is on screen.

## Suggested order

1. **Key + honesty + caps, as one change.** Set `ANTHROPIC_API_KEY`, pass the
   real provider string through, fix `ai_generated`, and add per-user rate
   limits. These belong together: the moment the tutor is real, the claim
   becomes true and the spend becomes possible.
2. **Memory.** History into the model call, and context into the retrieval
   query. Cheap, and it is the difference between a chat and a conversation.
3. **Learner state.** Feed mastery, recent mistakes, and path position into the
   prompt. This is what makes it AXIOM's tutor rather than a general one.
4. **Streaming**, then **surface proof-tutor and explain** in the UI.

Items 1-3 are days, not weeks, because the hard parts — retrieval, grounding,
citation, answer withholding, the provider seam — are already built and working.

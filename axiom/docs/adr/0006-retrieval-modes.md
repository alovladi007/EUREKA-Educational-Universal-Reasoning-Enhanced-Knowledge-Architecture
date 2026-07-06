# ADR 0006: Semantic retrieval behind the grounding interface

Status: Accepted
Date: Phase 3 (retrieval upgrade)

## Context

ADR 0005 established that the copilot grounds every reply in retrieved curriculum
passages, and shipped an exact-token lexical ranker. Lexical overlap misses
related word forms and phrasing a learner is likely to use: a question about
"solving quadratics" does not lexically match a lesson titled "The quadratic
formula" as well as it should. The build prompt calls for semantic (pgvector)
retrieval. Two constraints shape the decision: the platform must run fully
offline (local development, CI, air-gapped deployments), and it must not hard-
depend on a hosted embedding model.

## Decision

**Rank passages by a configurable mode** (`settings.retrieval_mode`), all behind
the existing `retrieve()` signature so callers are unaffected:

- **lexical** - the original exact-token overlap, with a title boost.
- **semantic** - cosine similarity over deterministic local embeddings.
- **hybrid** (default) - lexical plus a scaled semantic score, which keeps exact
  matches strong while letting related forms surface.

**Embeddings are deterministic and local.** `embeddings.embed()` produces a
fixed-dimension, L2-normalized vector from hashed tokens and character trigrams.
Trigrams give sub-word similarity (quadratic ~ quadratics) without any model
download, so semantic ranking runs offline and in tests, and is reproducible.

**The vector store is an interface, not a commitment to in-memory.** For the
seeded corpus, embeddings are computed per query in memory, which is correct and
fast at this scale. A production deployment can swap in a real embedding model
and a pgvector-backed store behind `embed()`/`cosine()` without touching the
retriever's callers or the copilot. That is the scaling path; it is not required
for correctness at the current corpus size.

## Consequences

- Grounding improves for natural-language questions without a hosted model.
- Ranking stays deterministic, so tests assert relative ordering (related forms
  rank above unrelated topics) rather than depending on a network service.
- The honest limit, recorded in STATUS: today the store is in-memory over local
  embeddings, not a pgvector ANN index over model embeddings. The seam is built
  so that upgrade is a provider swap, not a rewrite.

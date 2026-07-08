"""Deterministic local text embeddings for semantic retrieval.

A dependency-free, offline embedding: a fixed-dimension hashed bag of tokens and
character trigrams, L2-normalized. It captures lexical AND sub-word similarity
(so "quadratic" and "quadratics" land near each other), which pure exact-token
overlap misses, without a hosted embedding model.

This is the local fallback behind the retriever's semantic mode. A production
deployment can swap in a real embedding model and a pgvector-backed store behind
the same embed()/cosine() interface; the retriever only consumes vectors, not how
they were produced.
"""

from __future__ import annotations

import hashlib
import math
import re

DIM = 256

_WORD = re.compile(r"[a-z0-9]+")


def _bucket(token: str) -> int:
    digest = hashlib.blake2b(token.encode("utf-8"), digest_size=4).digest()
    return int.from_bytes(digest, "big") % DIM


def _char_trigrams(token: str) -> list[str]:
    padded = f"#{token}#"
    if len(padded) < 3:
        return [padded]
    return [padded[i : i + 3] for i in range(len(padded) - 2)]


def embed(text: str) -> list[float]:
    """Embed text into a DIM-dimensional L2-normalized vector.

    Tokens contribute at full weight and their character trigrams at half weight,
    so related word forms share sub-word mass. An empty or all-stopword text
    returns a zero vector, which cosine treats as maximally dissimilar.
    """
    vec = [0.0] * DIM
    tokens = _WORD.findall((text or "").lower())
    for token in tokens:
        if len(token) <= 1:
            continue
        vec[_bucket(token)] += 1.0
        for trigram in _char_trigrams(token):
            vec[_bucket(trigram)] += 0.5
    norm = math.sqrt(sum(v * v for v in vec))
    if norm == 0.0:
        return vec
    return [v / norm for v in vec]


def cosine(a: list[float], b: list[float]) -> float:
    """Cosine similarity of two vectors (0 for a zero vector)."""
    return sum(x * y for x, y in zip(a, b, strict=True))


# --------------------------------------------------------------------------
# Swappable embedding provider (Build Prompt Section 5: "swap in a real
# embedding model behind the same interface"). The retriever only consumes
# `dimension` and `embed()`, so which backend produced a vector is invisible to
# it. The default is the deterministic hashed embedder above (offline, no deps);
# a real sentence-transformers model can be selected by config when installed.
# --------------------------------------------------------------------------

from functools import lru_cache  # noqa: E402
from typing import Protocol  # noqa: E402


class EmbeddingProvider(Protocol):
    dimension: int

    def embed(self, text: str) -> list[float]: ...


class HashEmbeddingProvider:
    """The deterministic hashed embedder as a provider. Offline, dependency-free."""

    name = "hash"
    dimension = DIM

    def embed(self, text: str) -> list[float]:
        return embed(text)


class SentenceTransformerProvider:
    """A real neural embedding model (sentence-transformers), loaded lazily.

    Selected with AXIOM_EMBEDDING_PROVIDER=sentence_transformers. The model and
    its (torch) dependency are NOT bundled in the default image; if the import or
    load fails, get_embedding_provider falls back to the hashed embedder so the
    copilot still runs. When used, the pgvector column dimension must match
    this model's dimension (see migration 0015 and the store's note).
    """

    name = "sentence_transformers"

    def __init__(self, model_name: str):
        from sentence_transformers import SentenceTransformer  # lazy, optional

        self._model = SentenceTransformer(model_name)
        self.dimension = int(self._model.get_sentence_embedding_dimension())

    def embed(self, text: str) -> list[float]:
        vec = self._model.encode(text or "", normalize_embeddings=True)
        return [float(x) for x in vec]


@lru_cache
def get_embedding_provider() -> EmbeddingProvider:
    """Return the configured embedding provider (cached, argument-free).

    Defaults to the hashed embedder. If sentence-transformers is selected but its
    dependency is not installed, this logs and falls back rather than failing.
    """
    from app.core.config import get_settings

    settings = get_settings()
    if getattr(settings, "embedding_provider", "hash") == "sentence_transformers":
        try:
            return SentenceTransformerProvider(settings.embedding_model)
        except Exception:  # noqa: BLE001 - optional dependency or model missing
            import logging

            logging.getLogger("axiom.copilot").warning(
                "sentence-transformers unavailable; falling back to the hashed embedder"
            )
    return HashEmbeddingProvider()

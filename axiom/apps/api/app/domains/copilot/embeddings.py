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

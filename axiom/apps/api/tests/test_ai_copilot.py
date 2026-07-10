"""Real-AI copilot seam: generation providers and the embedding provider.

These are offline unit tests: they exercise the provider selection, the JSON
extraction from a model reply, and the CAS well-formedness gate that keeps a
model from injecting an unverified answer key -- without any model installed
(CI has neither a model nor a GPU). The live model paths are verified separately
against the running container.
"""

from __future__ import annotations

from app.domains.copilot.generation import _validate_drafted
from app.domains.copilot.generation_provider import (
    DeterministicGenerationProvider,
    DraftedItem,
    _extract_json,
    get_generation_provider,
)


def test_extract_json_clean_and_with_prose():
    assert _extract_json('{"prompt": "p", "answer": "4"}')["answer"] == "4"
    # Models often wrap JSON in prose or code fences; the first object is taken.
    messy = 'Sure! Here is the item:\n```json\n{"prompt":"p","answer":"x+1"}\n```'
    assert _extract_json(messy)["answer"] == "x+1"
    assert _extract_json("not json at all") is None


def test_validate_drafted_accepts_wellformed_math():
    good = DraftedItem(
        kind="math_expression", prompt="Expand (x+1)(x+2).",
        correct="x^2 + 3*x + 2", explanation="", backend="ollama",
    )
    result = _validate_drafted(good)
    assert result is not None
    assert result["source"] == "model:ollama"
    assert result["meta"]["drafted_by"] == "ollama"


def test_validate_drafted_rejects_malformed_answer():
    # A "numeric" item whose answer is not a number is rejected before queueing,
    # so a model can never inject an unparseable answer key.
    bad = DraftedItem(
        kind="numeric", prompt="How many?", correct="a bunch of them",
        explanation="", backend="ollama",
    )
    assert _validate_drafted(bad) is None


async def test_deterministic_provider_drafts_nothing():
    # The default provider declines, so generation uses the CAS-correct templates.
    provider = DeterministicGenerationProvider()
    assert await provider.draft(None) is None  # type: ignore[arg-type]


def test_default_generation_provider_is_deterministic():
    assert get_generation_provider().name == "deterministic"


def test_default_embedding_provider_is_hash_offline():
    # With no model configured (the CI default), the embedder is the offline
    # hashed one at 256 dimensions, so nothing hard-depends on torch.
    from app.domains.copilot.embeddings import get_embedding_provider

    get_embedding_provider.cache_clear()
    provider = get_embedding_provider()
    assert provider.name == "hash"
    assert provider.dimension == 256

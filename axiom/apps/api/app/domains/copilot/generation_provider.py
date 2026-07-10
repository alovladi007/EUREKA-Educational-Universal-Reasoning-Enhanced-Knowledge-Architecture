"""Model-backed item-generation providers (Build prompt Section 12).

A GenerationProvider drafts a candidate item (a prompt and a proposed answer for
a math kind) about a topic. The drafted answer is NEVER trusted on the model's
word: generation.py re-verifies that it is well-formed math with SymPy and queues
it for human review, so a model can never inject an unverified answer key into a
bank (the platform's standing rule).

Backends are selected by config and all fail soft: any error (unreachable model,
timeout, unparseable output) returns None, and the caller falls back to the
deterministic, always-CAS-correct template generator. So generation never
hard-depends on a model being reachable, matching the reasoning-provider pattern.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from functools import lru_cache
from typing import Protocol

from app.core.config import get_settings

# Kinds a model is allowed to draft. All three are CAS-checkable for
# well-formedness, so a malformed answer is rejected before review.
DRAFTABLE_KINDS = ("numeric", "math_expression", "equation")

_PROMPT = (
    "You are a mathematics assessment author. Write ONE {kind} question about "
    '"{topic}" at difficulty {difficulty} on a 0 (easy) to 1 (hard) scale. '
    "Respond with ONLY compact JSON and nothing else, of the form "
    '{{"prompt": "...", "answer": "...", "explanation": "..."}}. '
    "The answer must be a single plain mathematical expression or number with no "
    "prose, no units, and no equals sign unless the kind is equation."
)


@dataclass
class DraftRequest:
    topic: str
    kind: str
    difficulty: float


@dataclass
class DraftedItem:
    kind: str
    prompt: str
    correct: str
    explanation: str
    backend: str


def _extract_json(text: str) -> dict | None:
    """Parse the first JSON object out of a model reply, tolerating stray prose."""
    if not text:
        return None
    try:
        return json.loads(text)
    except (ValueError, TypeError):
        pass
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    try:
        parsed = json.loads(match.group(0))
        return parsed if isinstance(parsed, dict) else None
    except (ValueError, TypeError):
        return None


def _to_drafted(kind: str, data: dict, backend: str) -> DraftedItem | None:
    prompt = str(data.get("prompt", "")).strip()
    answer = str(data.get("answer", "")).strip()
    if not prompt or not answer:
        return None
    return DraftedItem(
        kind=kind,
        prompt=prompt,
        correct=answer,
        explanation=str(data.get("explanation", "")).strip(),
        backend=backend,
    )


class DeterministicGenerationProvider:
    """The default: draft nothing, so generation uses the template generators.

    Returning None from draft() signals the caller to fall back to the
    deterministic, CAS-correct-by-construction template path.
    """

    name = "deterministic"

    async def draft(self, request: DraftRequest) -> DraftedItem | None:
        return None


class OllamaGenerationProvider:
    """Draft with a local model over the Ollama HTTP API."""

    name = "ollama"

    def __init__(self, base_url: str, model: str, timeout: float):
        self._base = base_url.rstrip("/")
        self._model = model
        self._timeout = timeout

    async def draft(self, request: DraftRequest) -> DraftedItem | None:
        import httpx

        prompt = _PROMPT.format(
            kind=request.kind, topic=request.topic, difficulty=request.difficulty
        )
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                resp = await client.post(
                    f"{self._base}/api/generate",
                    json={"model": self._model, "prompt": prompt, "stream": False,
                          "format": "json"},
                )
                resp.raise_for_status()
                data = _extract_json(resp.json().get("response", ""))
        except Exception:  # noqa: BLE001 - fail soft to the deterministic path
            return None
        return _to_drafted(request.kind, data, "ollama") if data else None


class AnthropicGenerationProvider:
    """Draft with a hosted Claude model over the Anthropic Messages API."""

    name = "anthropic"

    def __init__(self, api_key: str, model: str, timeout: float):
        self._key = api_key
        self._model = model
        self._timeout = timeout

    async def draft(self, request: DraftRequest) -> DraftedItem | None:
        import httpx

        if not self._key:
            return None
        prompt = _PROMPT.format(
            kind=request.kind, topic=request.topic, difficulty=request.difficulty
        )
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                resp = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "x-api-key": self._key,
                        "anthropic-version": "2023-06-01",
                        "content-type": "application/json",
                    },
                    json={
                        "model": self._model,
                        "max_tokens": 512,
                        "messages": [{"role": "user", "content": prompt}],
                    },
                )
                resp.raise_for_status()
                blocks = resp.json().get("content", [])
                text = "".join(b.get("text", "") for b in blocks if b.get("type") == "text")
                data = _extract_json(text)
        except Exception:  # noqa: BLE001 - fail soft to the deterministic path
            return None
        return _to_drafted(request.kind, data, "anthropic") if data else None


@lru_cache
def get_generation_provider() -> GenerationProvider:
    """Return the configured generation provider (cached, argument-free)."""
    settings = get_settings()
    choice = getattr(settings, "generation_provider", "deterministic")
    if choice == "ollama":
        return OllamaGenerationProvider(
            settings.ollama_base_url, settings.ollama_model, settings.generation_timeout_seconds
        )
    if choice == "anthropic":
        return AnthropicGenerationProvider(
            settings.anthropic_api_key, settings.anthropic_model,
            settings.generation_timeout_seconds,
        )
    return DeterministicGenerationProvider()


class GenerationProvider(Protocol):
    async def draft(self, request: DraftRequest) -> DraftedItem | None: ...

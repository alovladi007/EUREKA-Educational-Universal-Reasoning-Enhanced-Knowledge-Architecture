"""Reasoning provider for the copilot.

This mirrors the identity-provider seam described in ADR 0001: the copilot calls
EUREKA's reasoning core through a swappable interface, with a deterministic mock
fallback so AXIOM runs end to end in development and tests without the live
reasoning core. Swapping the mock for the real client is a configuration change,
not a rewrite of the copilot.

Two honesty properties are built in:
  - The mock is extractive, not generative: it composes replies from retrieved
    curriculum passages rather than inventing facts, so it never hallucinates.
    When nothing relevant was retrieved it says so instead of guessing.
  - A hint for a question the learner is actively answering sets reveal_answer
    to False; the mock then gives a next-step nudge and never states a final
    answer, because the answer-bearing passages are withheld by the caller.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from functools import lru_cache
from typing import Protocol

from app.core.config import get_settings


@dataclass(frozen=True)
class Passage:
    """A retrieved curriculum snippet the copilot is grounded in.

    source is a human-readable citation (for example "Lesson: Two-Step
    Equations"); kind is one of node, lesson, step, or item.
    """

    source: str
    kind: str
    text: str


@dataclass
class ReasoningRequest:
    task: str  # hint | explain | chat
    question: str
    passages: list[Passage] = field(default_factory=list)
    # A hint for an item the learner is actively solving sets this False so the
    # provider gives process guidance rather than the final answer.
    reveal_answer: bool = True
    # Prior chat turns as {"role": "user"|"assistant", "content": str}.
    history: list[dict] = field(default_factory=list)


@dataclass
class ReasoningResult:
    text: str
    provider: str
    grounded: bool  # True when at least one passage informed the reply


class ReasoningProvider(Protocol):
    async def generate(self, request: ReasoningRequest) -> ReasoningResult: ...


def _trim(text: str, limit: int = 320) -> str:
    text = " ".join((text or "").split())
    if len(text) <= limit:
        return text
    return text[: limit - 3].rstrip() + "..."


class MockReasoningProvider:
    """Deterministic, curriculum-grounded reasoning for local dev and tests.

    It is extractive: replies are built from the retrieved passages, so the
    copilot is useful without a live model and cannot hallucinate. It is clearly
    AI-assisted and every reply is auditable through its sources.
    """

    async def generate(self, request: ReasoningRequest) -> ReasoningResult:
        grounded = bool(request.passages)
        if not grounded:
            return ReasoningResult(
                text=(
                    "I do not have AXIOM lesson material for that yet. Pick a "
                    "specific skill and I can walk you through it using your "
                    "lessons."
                ),
                provider="mock",
                grounded=False,
            )

        concept = _trim(request.passages[0].text)
        extra = [_trim(p.text, 180) for p in request.passages[1:3]]

        if request.task == "hint":
            body = (
                f"Here is a nudge to get you moving. The key idea is: {concept} "
                "Apply that idea to the specific numbers in your problem, one "
                "step at a time. Work out the next line yourself before checking."
            )
        elif request.task == "explain":
            parts = [f"Here is an explanation grounded in your lesson. {concept}"]
            parts.extend(extra)
            body = " ".join(parts)
        else:  # chat
            body = (
                f"Based on your lesson material: {concept} "
                "Ask a follow-up and I can go deeper on any step."
            )

        return ReasoningResult(text=body, provider="mock", grounded=True)


class EurekaReasoningProvider:
    """Calls EUREKA's reasoning core over HTTP, falling back to the mock.

    The contract is a single POST to {base_url}/api/v1/reasoning/generate with
    the task, question, and grounding passages. Any failure (unreachable,
    timeout, non-2xx, malformed body) falls back to the mock so a caller never
    sees an error and local development does not hard-depend on EUREKA.
    """

    def __init__(self, base_url: str, timeout_seconds: float):
        self._base = base_url.rstrip("/")
        self._timeout = timeout_seconds
        self._fallback = MockReasoningProvider()

    async def generate(self, request: ReasoningRequest) -> ReasoningResult:
        import httpx

        payload = {
            "task": request.task,
            "question": request.question,
            "reveal_answer": request.reveal_answer,
            "passages": [
                {"source": p.source, "kind": p.kind, "text": p.text}
                for p in request.passages
            ],
            "history": request.history,
        }
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                resp = await client.post(
                    f"{self._base}/api/v1/reasoning/generate", json=payload
                )
                resp.raise_for_status()
                data = resp.json()
                text = data.get("text")
                if not text:
                    raise ValueError("reasoning response missing text")
                return ReasoningResult(
                    text=str(text), provider="eureka", grounded=bool(request.passages)
                )
        except Exception:
            # Fail soft to the deterministic mock. The reply is still grounded
            # and clearly AI-assisted; only the backend differs.
            return await self._fallback.generate(request)


@lru_cache
def get_reasoning_provider() -> ReasoningProvider:
    """Return the configured reasoning provider.

    Cached and argument-free so the unhashable Settings instance never enters
    the lru_cache, matching the identity-provider pattern.
    """
    settings = get_settings()
    if settings.reasoning_provider == "eureka":
        return EurekaReasoningProvider(
            base_url=settings.eureka_reasoning_base_url,
            timeout_seconds=settings.reasoning_timeout_seconds,
        )
    return MockReasoningProvider()

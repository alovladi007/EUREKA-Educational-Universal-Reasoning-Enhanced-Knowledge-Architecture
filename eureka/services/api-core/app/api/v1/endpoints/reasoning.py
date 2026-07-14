"""EUREKA reasoning core: the contract AXIOM's copilot calls (EK-2).

Serves the two endpoints AXIOM's EurekaReasoningProvider POSTs
(axiom/apps/api/app/domains/copilot/reasoning.py):

  POST /api/v1/reasoning/generate      {task, question, reveal_answer,
                                        passages[{source,kind,text}], history}
                                       -> {text}
  POST /api/v1/reasoning/score-rubric  {response_text, reference,
                                        criteria[{criterion,points,keywords}]}
                                       -> {criteria[...], total_awarded,
                                           total_possible, confidence}

Backend selection, stated honestly: when ANTHROPIC_API_KEY is configured the
generate endpoint calls the real model (grounded on the passages AXIOM sends,
with an instruction not to reveal answers unless reveal_answer is set) and the
response provider is the model id. Without a key it falls back to a
deterministic, passage-grounded composition -- clearly labeled, never a fake
model claim. Rubric scoring is deterministic keyword-coverage scoring in both
modes (auditable partial credit); AXIOM keeps its own SymPy gate on everything.
"""

from __future__ import annotations

import os

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()


# ---------------------------------------------------------------------------
# Contract models (mirror AXIOM's payloads exactly)
# ---------------------------------------------------------------------------

class Passage(BaseModel):
    source: str = ""
    kind: str = ""
    text: str = ""


class GenerateRequest(BaseModel):
    task: str = "hint"
    question: str = ""
    reveal_answer: bool = False
    passages: list[Passage] = Field(default_factory=list)
    history: list[dict] = Field(default_factory=list)


class GenerateResponse(BaseModel):
    text: str
    provider: str


class Criterion(BaseModel):
    criterion: str
    points: float
    keywords: list[str] = Field(default_factory=list)


class RubricRequest(BaseModel):
    response_text: str = ""
    reference: str = ""
    criteria: list[Criterion] = Field(default_factory=list)


class CriterionOut(BaseModel):
    criterion: str
    points: float
    awarded_points: float
    met: bool
    rationale: str


class RubricResponse(BaseModel):
    criteria: list[CriterionOut]
    total_awarded: float
    total_possible: float
    confidence: float


# ---------------------------------------------------------------------------
# Generate: real model when configured, grounded deterministic fallback else
# ---------------------------------------------------------------------------

_MODEL = os.environ.get("REASONING_MODEL", "claude-haiku-4-5-20251001")


def _anthropic():
    key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not key or key.startswith("sk-ant-your") or key.startswith("<paste"):
        return None
    try:
        from anthropic import Anthropic

        return Anthropic(api_key=key)
    except Exception:
        return None


def _grounded_fallback(req: GenerateRequest) -> str:
    """Deterministic, passage-grounded composition. No model, no pretense."""
    lines: list[str] = []
    task = (req.task or "hint").replace("_", " ")
    if req.question:
        lines.append(f"Working on: {req.question.strip()}")
    for p in req.passages[:3]:
        text = (p.text or "").strip()
        if text:
            label = p.source or p.kind or "course material"
            lines.append(f"From {label}: {text[:400]}")
    if not req.passages:
        lines.append(
            "No grounding passages were provided; review the lesson for this "
            "skill and try breaking the problem into smaller steps."
        )
    if req.task == "hint" and not req.reveal_answer:
        lines.append(
            "Hint: identify which definition or method above applies, apply it "
            "to the given values, and check each step before moving on."
        )
    return "\n\n".join(lines) or f"({task}) No content available."


@router.post("/reasoning/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest) -> GenerateResponse:
    client = _anthropic()
    if client is not None:
        try:
            grounding = "\n\n".join(
                f"[{p.source or p.kind or 'passage'}]\n{p.text}" for p in req.passages
            )
            guard = (
                "Do NOT reveal the final answer; guide with one next step."
                if not req.reveal_answer
                else "You may include the full worked solution."
            )
            msg = client.messages.create(
                model=_MODEL,
                max_tokens=600,
                system=(
                    "You are the reasoning core for a mathematics learning "
                    "platform. Ground every reply in the provided course "
                    f"passages; do not invent facts. {guard}"
                ),
                messages=[{
                    "role": "user",
                    "content": (
                        f"Task: {req.task}\nQuestion: {req.question}\n\n"
                        f"Course passages:\n{grounding or '(none provided)'}"
                    ),
                }],
            )
            text = "".join(
                b.text for b in msg.content if getattr(b, "type", "") == "text"
            ).strip()
            if text:
                return GenerateResponse(text=text, provider=_MODEL)
        except Exception:
            pass  # fall through to the deterministic grounded reply
    return GenerateResponse(text=_grounded_fallback(req), provider="grounded-deterministic")


# ---------------------------------------------------------------------------
# Rubric scoring: deterministic keyword coverage (auditable partial credit)
# ---------------------------------------------------------------------------

@router.post("/reasoning/score-rubric", response_model=RubricResponse)
async def score_rubric(req: RubricRequest) -> RubricResponse:
    text = (req.response_text or "").lower()
    out: list[CriterionOut] = []
    total_awarded = 0.0
    total_possible = 0.0
    assessable = 0
    for crit in req.criteria:
        total_possible += crit.points
        keywords = [k.lower() for k in crit.keywords if k.strip()]
        if not keywords:
            out.append(CriterionOut(
                criterion=crit.criterion, points=crit.points, awarded_points=0.0,
                met=False, rationale="No keywords declared; needs human review.",
            ))
            continue
        assessable += 1
        matched = [k for k in keywords if k in text]
        fraction = len(matched) / len(keywords)
        awarded = round(crit.points * fraction, 3)
        total_awarded += awarded
        rationale = (
            f"Covers {len(matched)} of {len(keywords)} expected ideas: "
            f"{', '.join(matched)}."
            if matched else "Does not mention the expected ideas for this criterion."
        )
        out.append(CriterionOut(
            criterion=crit.criterion, points=crit.points, awarded_points=awarded,
            met=fraction >= 0.5, rationale=rationale,
        ))
    confidence = round(assessable / len(req.criteria), 3) if req.criteria else 0.0
    return RubricResponse(
        criteria=out,
        total_awarded=round(total_awarded, 3),
        total_possible=round(total_possible, 3),
        confidence=confidence,
    )

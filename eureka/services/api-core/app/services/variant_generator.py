"""
AI variant generator (Phase 5 Session 5.2, 2026-05).

Takes a base item and asks Claude to generate N variants that:
  - swap surface features (numbers, names, contexts)
  - preserve the underlying skill being tested
  - preserve the difficulty band
  - preserve the answer choice count / kind

Two stages:

  1. GENERATION    one prompt → N variants in a structured JSON list.
                   We send the base stem + options + correct + explanation
                   so Claude can mimic the rubric.

  2. CROSS-GRADING (optional, behind a flag) — for each variant, ask
                   Claude again with the variant's stem + the BASE's
                   rubric and check the variant still hits the same
                   skill. Score 0..1 + freeform notes. Mismatch → flag.

Costs money on every call. The current implementation:
  - falls back to a stub generator if ANTHROPIC_API_KEY is unset
    (CI runs without the key)
  - reuses the same SDK already in api-core's requirements
  - logs every call via the structlog instrumentation

UWorld parity math: a human SME writes ~1 question/day. Claude generates
8 variants/minute from a single SME-authored base. At 80% cross-grader
pass rate, that's still 6 free variants per SME-day. A 500-base USMLE
seed becomes a 3000+ variant bank for the SME cost of the bases alone.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any

from app.core.observability import get_logger

log = get_logger(__name__)


# Prompt templates lifted out so they're easy to A/B test in isolation
# from the calling code.

_SYSTEM_GENERATE = """You are an expert assessment-item author for a medical/engineering/legal
education platform. Your job is to generate disciplined VARIANTS of a base
multiple-choice question that test the SAME underlying skill at the SAME
difficulty band, swapping only surface features (numbers, named entities,
contexts, scenarios). Never paraphrase trivially — change the substance
enough that a learner who memorised the base wouldn't recognise the variant,
but keep the underlying reasoning identical.

CONSTRAINTS:
- Same number of options as the base.
- Exactly one correct option (for mcq_single).
- The correct option must be drawn from the same conceptual family as the
  base's correct answer.
- The explanation must justify the correct answer with reasoning that
  parallels the base's explanation.
- Output STRICT JSON: a single JSON array of variant objects, each with
  keys {"stem", "options", "correct_index", "explanation"}.

Do not add commentary, prose, or markdown fences. Return only the JSON array."""


_SYSTEM_CROSSGRADE = """You are a strict assessment-item reviewer. You will be given a BASE
question (stem + correct answer + explanation) and a candidate VARIANT
(stem + correct answer + explanation). Decide whether the variant tests
the SAME underlying skill at approximately the SAME difficulty as the base.

Output STRICT JSON: {"agrees": true|false, "score": 0.0-1.0, "notes": "..."}.

`agrees` is true only if a learner with mastery of the base's skill would
reliably get the variant right too. `score` is your confidence (0..1).
`notes` is one short paragraph explaining your decision. No prose outside
the JSON."""


@dataclass
class VariantDraft:
    stem: str
    options: list[str]
    correct_index: int
    explanation: str

    def to_content(self) -> dict[str, Any]:
        return {
            "stem": self.stem,
            "options": self.options,
            "correct_index": self.correct_index,
        }


@dataclass
class CrossGradeResult:
    agrees: bool
    score: float
    notes: str


# ---------------------------------------------------------------------------


def _anthropic_client():
    """Return an Anthropic client, or None if the API key isn't configured."""
    key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not key or key.startswith("sk-ant-your") or key.startswith("<paste"):
        return None
    try:
        from anthropic import Anthropic
        return Anthropic(api_key=key)
    except Exception as exc:
        log.warning("anthropic.client.init_failed", error=str(exc))
        return None


def _stub_variants(base_content: dict[str, Any], count: int) -> list[VariantDraft]:
    """
    Deterministic fallback when no API key is configured. Useful for CI
    and for verifying the schema/storage path works without making real
    network calls. Just numbered placeholders.
    """
    stem = base_content.get("stem", "")
    options = list(base_content.get("options", [])) or ["A", "B", "C", "D"]
    correct = int(base_content.get("correct_index", 0))
    return [
        VariantDraft(
            stem=f"[Variant {i + 1} of base] {stem}",
            options=options[:],
            correct_index=correct,
            explanation=f"Variant {i + 1} (stub — no ANTHROPIC_API_KEY).",
        )
        for i in range(count)
    ]


def generate_variants(
    *,
    base_content: dict[str, Any],
    base_explanation: str | None,
    count: int,
    target_difficulty: str | None = None,
) -> list[VariantDraft]:
    """
    Synchronous Claude call returning N VariantDrafts. Falls back to
    deterministic stubs if no API key is configured.
    """
    client = _anthropic_client()
    if client is None:
        log.info("variant_generator.stub", count=count)
        return _stub_variants(base_content, count)

    user_msg = json.dumps(
        {
            "instruction": f"Generate exactly {count} variants of the base question below.",
            "target_difficulty": target_difficulty or "preserve base difficulty",
            "base": {
                "stem": base_content.get("stem"),
                "options": base_content.get("options"),
                "correct_index": base_content.get("correct_index"),
                "explanation": base_explanation,
            },
        },
        indent=2,
    )

    log.info("variant_generator.generate", count=count, target_difficulty=target_difficulty)
    msg = client.messages.create(
        model=os.environ.get("ANTHROPIC_MODEL", "claude-opus-4-7"),
        max_tokens=4096,
        system=_SYSTEM_GENERATE,
        messages=[{"role": "user", "content": user_msg}],
    )
    raw = "".join(block.text for block in msg.content if block.type == "text").strip()
    raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    try:
        items = json.loads(raw)
    except json.JSONDecodeError as exc:
        log.warning("variant_generator.parse_failed", error=str(exc), raw=raw[:200])
        return _stub_variants(base_content, count)

    drafts: list[VariantDraft] = []
    for i, v in enumerate(items[:count]):
        try:
            drafts.append(
                VariantDraft(
                    stem=str(v["stem"]),
                    options=list(v["options"]),
                    correct_index=int(v["correct_index"]),
                    explanation=str(v.get("explanation", "")),
                )
            )
        except (KeyError, TypeError, ValueError) as exc:
            log.warning("variant_generator.skip_invalid", index=i, error=str(exc))
    return drafts


def cross_grade(
    *,
    base_content: dict[str, Any],
    base_explanation: str | None,
    variant_content: dict[str, Any],
    variant_explanation: str | None,
) -> CrossGradeResult:
    """Single cross-grader pass; returns agrees + score + notes."""
    client = _anthropic_client()
    if client is None:
        # No API key — pessimistic default: flag for human review.
        return CrossGradeResult(
            agrees=False,
            score=0.0,
            notes="No ANTHROPIC_API_KEY; cross-grader not run. Defaulting to flag.",
        )

    user_msg = json.dumps(
        {
            "base": {
                "stem": base_content.get("stem"),
                "options": base_content.get("options"),
                "correct_index": base_content.get("correct_index"),
                "explanation": base_explanation,
            },
            "variant": {
                "stem": variant_content.get("stem"),
                "options": variant_content.get("options"),
                "correct_index": variant_content.get("correct_index"),
                "explanation": variant_explanation,
            },
        },
        indent=2,
    )
    msg = client.messages.create(
        model=os.environ.get("ANTHROPIC_MODEL", "claude-opus-4-7"),
        max_tokens=512,
        system=_SYSTEM_CROSSGRADE,
        messages=[{"role": "user", "content": user_msg}],
    )
    raw = "".join(block.text for block in msg.content if block.type == "text").strip()
    raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    try:
        d = json.loads(raw)
        return CrossGradeResult(
            agrees=bool(d.get("agrees")),
            score=float(d.get("score", 0)),
            notes=str(d.get("notes", "")),
        )
    except (json.JSONDecodeError, TypeError, ValueError) as exc:
        return CrossGradeResult(
            agrees=False,
            score=0.0,
            notes=f"crossgrader_parse_failed: {exc}",
        )

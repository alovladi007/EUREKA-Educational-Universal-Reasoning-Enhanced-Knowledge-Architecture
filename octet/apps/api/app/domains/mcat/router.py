"""MCAT-mode chemistry serving (Phase B of the EUREKA integration).

EUREKA's api-core asks this vertical for "N verified chemistry items on
these curriculum nodes" and grades submissions back through it. The split of
responsibilities is deliberate: chemistry - generation, verification,
grading, misconception rationale - stays here where the engine and the
sandbox live; commerce - the entitlement gate, the AAMC category mapping,
the attempt log the weakness analytics read - stays in api-core. Neither
side grows a second copy of the other's authority.

The MCAT skin is single-best-answer. The pool is the mc grader's templates
ONLY, because those are the items whose distractors are misconception-keyed
and structurally validated. Numeric and free-response templates are
deliberately NOT skinned into MCQs: a plausible-but-wrong number that no
named misconception produces would be invented content.

On option count, honesty beats format: the real MCAT shows four options,
but only some templates carry three keyed distractors, and padding the
rest with un-keyed fillers is exactly the fabrication this platform
refuses. So an item serves with the options its misconception analysis
supports - four where four exist, three otherwise - and each item states
its own count. Two-choice templates are excluded (a coin-flip format
assesses little). Four-option coverage grows the honest way: by authoring
additional keyed distractors, which is content work with review, not a
serving-time transform. The response says which requested nodes could not
be served, rather than quietly narrowing.

Statelessness is the security property: an item is (template_id, seed), the
variant regenerates deterministically, and the choice subset and order are
derived from the seed. Serving carries no correct index; submission
regenerates the same item and grades server-side. There is nothing client
side to leak and nothing server side to store between the two calls.
"""

from __future__ import annotations

import hashlib

import chem_core as cc
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.security import Principal, get_current_principal

router = APIRouter()

MCAT_MAX_OPTIONS = 4
MCAT_MIN_OPTIONS = 3
MAX_ITEMS_PER_REQUEST = 40


class McatItemsIn(BaseModel):
    nodes: list[str] = Field(..., min_length=1, max_length=80)
    count: int = Field(10, ge=1, le=MAX_ITEMS_PER_REQUEST)
    # Where in the learner's deterministic variant sequence to start. The
    # caller (api-core) passes the learner's running attempt count so a second
    # session serves fresh variants instead of replaying the first one.
    # Grading is unaffected: (template_id, seed) travels with each item.
    offset: int = Field(0, ge=0, le=1_000_000)


class McatSubmitIn(BaseModel):
    template_id: str
    seed: int
    choice_index: int = Field(..., ge=0, le=MCAT_MAX_OPTIONS - 1)


def _mc_templates_for(nodes: list[str]) -> dict[str, list[str]]:
    """node -> mc template ids, for the requested nodes only."""
    wanted = set(nodes)
    out: dict[str, list[str]] = {}
    for tid, entry in cc.REGISTRY.items():
        if entry["grader"] == "mc" and entry["node"] in wanted:
            out.setdefault(str(entry["node"]), []).append(tid)
    return out


# Which mc templates can actually take the MCAT form (correct choice plus at
# least two keyed distractors). Probed once per process with a fixed seed:
# the choice SET is template-level data (one entry per keyed misconception),
# so it does not vary with the seed - only the drawn subset and order do.
_SERVABLE_CACHE: dict[str, list[str]] | None = None


def _servable_templates() -> dict[str, list[str]]:
    """node -> template ids that can serve an MCAT form right now."""
    global _SERVABLE_CACHE
    if _SERVABLE_CACHE is None:
        cache: dict[str, list[str]] = {}
        for tid, entry in cc.REGISTRY.items():
            if entry["grader"] != "mc":
                continue
            try:
                build_mcat_choices(cc.resolve_generated(tid, 1))
            except (RuntimeError, ValueError):
                continue
            cache.setdefault(str(entry["node"]), []).append(tid)
        _SERVABLE_CACHE = cache
    return _SERVABLE_CACHE


def _choice_rng(seed: int, salt: str) -> "_Lcg":
    digest = hashlib.sha256(f"{seed}:{salt}".encode()).digest()
    return _Lcg(int.from_bytes(digest[:8], "big"))


class _Lcg:
    """Tiny deterministic generator so the choice assembly needs no random
    module state and reproduces exactly on the submit path."""

    def __init__(self, state: int) -> None:
        self.state = state & 0xFFFFFFFFFFFF

    def next(self, bound: int) -> int:
        self.state = (self.state * 6364136223846793005 + 1442695040888963407) & 0xFFFFFFFFFFFFFFFF
        return (self.state >> 16) % bound


def build_mcat_choices(variant) -> tuple[list[dict], int]:
    """The four options an MCAT-mode item shows, and which one is correct.

    One function used by BOTH the serve and the submit path, so the two can
    never disagree about the option order (the divergence bug the practice
    submit endpoints once had, made impossible rather than tested away).

    Deterministic in the variant's seed: the correct choice plus three
    misconception-keyed distractors drawn and ordered by a seeded generator.
    Returns (choices, correct_position) where each choice carries its
    original index for grading.
    """
    meta = variant.meta
    all_choices = list(meta.get("choices", []))
    correct_index = meta.get("correct_index")
    correct = next((c for c in all_choices if c.get("index") == correct_index), None)
    if correct is None:
        raise ValueError("mc item has no keyed correct choice")
    distractors = [c for c in all_choices if c.get("index") != correct_index]
    if len(distractors) < MCAT_MIN_OPTIONS - 1:
        raise ValueError(
            "mc item has too few keyed distractors for a single-best-answer form"
        )

    rng = _choice_rng(variant.seed, variant.template_id)
    # Draw up to three distractors without replacement, seeded. Never pad:
    # an option that keys no misconception is a fabrication, so a
    # three-distractor item serves four options and a two-distractor item
    # serves three.
    picked: list[dict] = []
    pool = list(distractors)
    for _ in range(min(MCAT_MAX_OPTIONS - 1, len(pool))):
        picked.append(pool.pop(rng.next(len(pool))))

    options = [correct, *picked]
    # Seeded shuffle (Fisher-Yates with the same generator).
    for i in range(len(options) - 1, 0, -1):
        j = rng.next(i + 1)
        options[i], options[j] = options[j], options[i]
    correct_position = next(
        i for i, c in enumerate(options) if c.get("index") == correct_index
    )
    return options, correct_position


@router.post("/mcat/items")
async def mcat_items(
    body: McatItemsIn,
    principal: Principal = Depends(get_current_principal),
) -> dict:
    """Serve N verified, MCAT-skinned chemistry items across the given nodes.

    Every item's key was independently verified at resolve time, exactly as
    in the practice product. No correct index and no misconception codes
    travel in this response.
    """
    by_node = _mc_templates_for(body.nodes)
    unservable = sorted(set(body.nodes) - set(by_node))
    if not by_node:
        return {
            "items": [],
            "unservable_nodes": unservable,
            "note": (
                "None of the requested nodes has an MCAT-eligible template. "
                "Eligibility means multiple-choice items with at least two "
                "misconception-keyed distractors; free-response templates are "
                "not converted, because their distractors would have to be "
                "invented."
            ),
        }

    # Round-robin the servable nodes so a session mixes topics. count_offset
    # starts at the caller-supplied offset: within one request it advances a
    # deterministic variant sequence; across requests the caller moves the
    # offset forward (api-core passes the learner's attempt count) so a
    # repeat session serves fresh variants rather than replaying the last.
    node_order = sorted(by_node)
    items = []
    count_offset = body.offset
    while len(items) < body.count:
        progressed = False
        for node in node_order:
            if len(items) >= body.count:
                break
            tids = by_node[node]
            tid = tids[(len(items) + count_offset) % len(tids)]
            seed = cc.variant_seed(principal.user_id, tid, count_offset)
            try:
                variant = cc.resolve_generated(tid, seed)
                options, _ = build_mcat_choices(variant)
            except (RuntimeError, ValueError):
                continue  # this template cannot serve an MCAT form; try others
            items.append(
                {
                    "template_id": variant.template_id,
                    "seed": variant.seed,
                    "node": variant.node,
                    "prompt": variant.prompt,
                    "options": [
                        {"position": i, "text": str(c.get("text", ""))}
                        for i, c in enumerate(options)
                    ],
                    "option_count": len(options),
                    "verified_by": "independent verifier at resolve time",
                }
            )
            progressed = True
        count_offset += 1
        if not progressed:
            break
    return {"items": items, "unservable_nodes": unservable}


@router.post("/mcat/submit")
async def mcat_submit(
    body: McatSubmitIn,
    principal: Principal = Depends(get_current_principal),
) -> dict:
    """Grade an MCAT-mode answer by rebuilding the exact item served.

    The variant and its choice order regenerate deterministically from
    (template_id, seed), so grading needs no stored state and the client
    can influence nothing but its chosen position.
    """
    if body.template_id not in cc.REGISTRY:
        raise HTTPException(404, f"unknown template {body.template_id}")
    entry = cc.REGISTRY[body.template_id]
    if entry["grader"] != "mc":
        raise HTTPException(422, "not an MCAT-eligible template")
    try:
        variant = cc.resolve_generated(body.template_id, body.seed)
        options, correct_position = build_mcat_choices(variant)
    except (RuntimeError, ValueError) as exc:
        raise HTTPException(503, str(exc)) from exc

    if body.choice_index >= len(options):
        raise HTTPException(
            422, f"choice_index out of range: this item has {len(options)} options"
        )
    chosen = options[body.choice_index]
    result = cc.grade("mc", variant, chosen.get("index"))

    rationale = None
    code = chosen.get("misconception")
    if not result.is_correct and code:
        from chem_core.misconceptions import MISCONCEPTIONS

        m = MISCONCEPTIONS.get(str(code))
        if m is not None:
            rationale = {
                "misconception": m.code,
                "name": m.name,
                "description": m.description,
                "counterexample": m.counterexample,
                "review_node": m.routes_to,
                "review": m.review,
            }

    return {
        "is_correct": result.is_correct,
        "correct_position": correct_position,
        "correct_text": str(options[correct_position].get("text", "")),
        "chosen_position": body.choice_index,
        "node": variant.node,
        "misconception": chosen.get("misconception") if not result.is_correct else None,
        "rationale": rationale,
        "detail": result.detail,
    }


@router.get("/mcat/eligible-nodes")
async def mcat_eligible_nodes(
    _p: Principal = Depends(get_current_principal),
) -> dict:
    """Which curriculum nodes can serve MCAT-form items right now, with
    template counts. api-core intersects this with its mapping table.

    Counts only templates that pass the actual serving test (correct choice
    plus at least two keyed distractors) - an mc template with a single
    distractor is a coin flip and is excluded from the MCAT form, so it is
    excluded from this report too. Reporting the raw mc count here would
    overstate what a category can serve.
    """
    servable = _servable_templates()
    counts = {node: len(tids) for node, tids in servable.items()}
    return {
        "nodes": counts,
        "total_templates": sum(counts.values()),
        "note": (
            "A node appears here only if at least one of its templates can "
            "serve a single-best-answer item with 3 or 4 misconception-keyed "
            "options. Nodes whose templates are numeric or free-response are "
            "absent by design: their distractors would have to be invented."
        ),
    }

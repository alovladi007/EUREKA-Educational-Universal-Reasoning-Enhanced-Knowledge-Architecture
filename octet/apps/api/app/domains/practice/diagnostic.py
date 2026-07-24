"""Placement diagnostic.

Serves one item per node that has a template, so a new learner's starting
mastery is measured rather than assumed. Ported from the AXIOM diagnostic
machinery.

Teaching model note: the diagnostic grades but never reveals. A learner
finishing the diagnostic sees where they are starting, not a list of answers.
"""

from __future__ import annotations

from dataclasses import dataclass, field

import chem_core as cc

from app.data.curriculum import NODES_BY_CODE
from app.domains.adaptive.bkt import bkt_update, level_for


@dataclass
class DiagnosticItem:
    node: str
    template_id: str
    seed: int
    prompt: str
    grader: str
    meta: dict = field(default_factory=dict)


def templates_by_node() -> dict[str, list[str]]:
    mapping: dict[str, list[str]] = {}
    for tid, entry in cc.REGISTRY.items():
        mapping.setdefault(str(entry["node"]), []).append(tid)
    return mapping


def build_diagnostic(user_id: str, *, tier: str | None = None, limit: int = 12) -> list[DiagnosticItem]:
    """One item per covered node, ordered by tier then node code."""
    mapping = templates_by_node()
    covered = sorted(
        (code for code in mapping if code in NODES_BY_CODE),
        key=lambda c: (NODES_BY_CODE[c].tier, c),
    )
    if tier:
        covered = [c for c in covered if NODES_BY_CODE[c].tier == tier]

    items: list[DiagnosticItem] = []
    for code in covered[:limit]:
        template_id = sorted(mapping[code])[0]
        seed = cc.variant_seed(user_id, template_id, 0)
        try:
            variant = cc.resolve_generated(template_id, seed)
        except RuntimeError:
            continue
        public = {}
        if variant.grader == "mc":
            public = {"choices": [{"index": c["index"], "text": c["text"]}
                                  for c in variant.meta["choices"]]}
        items.append(
            DiagnosticItem(node=code, template_id=template_id, seed=variant.seed,
                           prompt=variant.prompt, grader=variant.grader, meta=public)
        )
    return items


def score_diagnostic(results: list[dict]) -> dict:
    """Turn diagnostic outcomes into starting mastery.

    results: [{"node": code, "correct": bool}]. Each node starts from the BKT
    prior and takes one update, which is deliberately a weak signal. One item
    is evidence, not proof, and the adaptive picker will refine it.
    """
    mastery: dict[str, float] = {}
    for r in results:
        node = r.get("node")
        if node not in NODES_BY_CODE:
            continue
        mastery[node] = bkt_update(mastery.get(node, 0.25), bool(r.get("correct")))
    return {
        "mastery": {k: round(v, 3) for k, v in mastery.items()},
        "levels": {k: level_for(v) for k, v in mastery.items()},
        "nodes_measured": len(mastery),
        "note": "One item per node is a starting estimate, not a final judgement.",
    }

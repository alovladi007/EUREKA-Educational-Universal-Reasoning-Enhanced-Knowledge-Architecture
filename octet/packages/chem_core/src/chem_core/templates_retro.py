"""The retrosynthesis trainer template (grader 11).

One template, on ORG2.RETROSYNTHESIS. Each variant shows a target molecule and
a menu of named disconnections, and the learner names the disconnection and
supplies the precursors. Grading runs the forward reaction and checks it
rebuilds the target, so there is no judgement in the loop.

The verifier here is verify_retro_item: it confirms the variant's own key
precursors, under the keyed disconnection, actually build the target. That is
the check that matters for a generated item, because an unanswerable retro item
marks a correct learner wrong, and the generator is trusted no further than the
verifier can confirm.
"""

from __future__ import annotations

from .registry import Variant, _pick
from .retro import LIBRARY, RetroItem, verify_retro_item
from .types import VerifierResult

# Each fixture: target, the disconnection that builds it, and the precursors
# that satisfy it. The distractor disconnections are drawn from the rest of the
# library, so every offered option is a real reaction that simply does not
# build this particular target. All were confirmed to build their target before
# being listed.
_RETRO_FIXTURES = [
    ("CCOCC", "williamson", ["CCO", "CCBr"], "diethyl ether"),
    ("CCOC", "williamson", ["CO", "CCBr"], "ethyl methyl ether"),
    ("CCC(C)O", "grignard_carbonyl", ["CC=O", "CC[Mg]"], "butan-2-ol"),
    ("CC(C)(C)O", "grignard_carbonyl", ["CC(C)=O", "C[Mg]"], "2-methylpropan-2-ol"),
    ("CCOC(C)=O", "ester_from_acid_alcohol", ["CC(=O)O", "CCO"], "ethyl acetate"),
    ("CC(=O)OC", "ester_from_acid_alcohol", ["CC(=O)O", "CO"], "methyl acetate"),
    ("CC(=O)NC", "amide_from_acid_amine", ["CC(=O)O", "CN"], "N-methylacetamide"),
]

# The disconnections every item offers: the correct one plus a fixed set of
# plausible alternatives, so the menu is stable and the choice is real.
_MENU = ["williamson", "grignard_carbonyl", "ester_from_acid_alcohol", "amide_from_acid_amine"]


def _gen_retro(seed: int) -> Variant:
    target, disc_key, precursors, name = _pick(_RETRO_FIXTURES, seed)
    disconnections = [LIBRARY[k] for k in _MENU]
    correct = LIBRARY[disc_key]
    return Variant(
        template_id="org.retro.step.v1",
        seed=seed,
        prompt=(
            f"Propose a one-step synthesis of {name} ({target}). Choose the "
            "disconnection that builds it and give the precursor structures as "
            "SMILES. Your precursors are correct when running the chosen "
            "reaction forward reproduces the target."
        ),
        key=target,
        node="ORG2.RETROSYNTHESIS",
        grader="retro",
        meta={
            "node": "ORG2.RETROSYNTHESIS",
            "name": name,
            "disconnections": [
                {
                    "name": d.name,
                    "forward_smarts": d.forward_smarts,
                    "forms": d.forms,
                    "abstracts": d.abstracts,
                }
                for d in disconnections
            ],
            "key_disconnection": correct.name,
            "key_precursors": precursors,
        },
    )


def _ver_retro(v: Variant) -> VerifierResult:
    """The variant's own key must build its own target."""
    disconnections = tuple(
        __import__("chem_core.retro", fromlist=["Disconnection"]).Disconnection(**d)
        for d in v.meta.get("disconnections", [])
    )
    item = RetroItem(
        node=str(v.meta.get("node", "")),
        target=v.key,
        disconnections=disconnections,
        key_disconnection=str(v.meta.get("key_disconnection", "")),
        key_precursors=tuple(v.meta.get("key_precursors", [])),
    )
    return verify_retro_item(item)


RETRO_TEMPLATES: dict[str, dict[str, object]] = {
    "org.retro.step.v1": {
        "gen": _gen_retro,
        "ver": _ver_retro,
        "node": "ORG2.RETROSYNTHESIS",
        "grader": "retro",
    },
}

RETRO_HINTS: dict[str, tuple[str, str, str]] = {
    "org.retro.step.v1": (
        "You are working backward one step: name the reaction that would form "
        "this molecule, and the pieces it would form it from. You are not asked "
        "for a full route, only the last bond made.",
        "Look at the target for the bond a named reaction is good at making: an "
        "ether has a carbon-oxygen bond a Williamson makes, an alcohol next to a "
        "carbon chain suggests an organometallic added to a carbonyl, an ester "
        "or amide comes from an acid and an alcohol or amine. Split the target "
        "at that bond.",
        "Identify the bond in the target that the reaction forms, break it on "
        "paper, and write down the two pieces before deciding which reagent each "
        "piece needs.",
    ),
}

"""Three rung hint ladders, one per template.

Binding requirement from the teaching model: the default response to an
attempt is never the solution. Every template ships three rungs.

  Rung 1 (orient): restate what is being asked and what is known.
  Rung 2 (method): name the technique and why it applies, no execution.
  Rung 3 (first step): perform the first move only, leaving the rest.

The full worked solution is rung four and lives with the item, not here.
Reaching it lowers mastery credit for that attempt.

hint_coverage() gates CI. A template with fewer than three rungs cannot ship.
"""

from __future__ import annotations

HINTS: dict[str, tuple[str, str, str]] = {
    "formula.molecular.v1": (
        "You are asked for the molecular formula: how many atoms of each element "
        "are in one molecule of this substance.",
        "Read the structure one atom at a time. Every vertex in a skeletal "
        "drawing is a carbon unless another symbol is written, and hydrogens on "
        "carbon are usually implied rather than drawn.",
        "Start by counting only the carbons, and write that count down before "
        "you look at anything else.",
    ),
    "formula.empirical.v1": (
        "You are asked for the empirical formula: the simplest whole number "
        "ratio of atoms, which is not always the molecular formula.",
        "Percent composition becomes a ratio of moles. Assume a 100 gram sample "
        "so each percentage reads directly as grams, then convert each mass to "
        "moles with that element's molar mass.",
        "Convert the first element's percentage to moles by dividing its mass by "
        "its molar mass, and leave the others for now.",
    ),
    "balance.combustion.v1": (
        "You are asked to balance a combustion reaction: a hydrocarbon burning "
        "in oxygen to give carbon dioxide and water.",
        "Balance carbon first, then hydrogen, and leave oxygen for last, because "
        "oxygen appears in both products and adjusting it early undoes your "
        "other work. Coefficients change, subscripts never do.",
        "Set the carbon dioxide coefficient equal to the number of carbons in the "
        "hydrocarbon, and stop there.",
    ),
    "balance.precipitation.v1": (
        "You are asked to balance a precipitation reaction, where two solutions "
        "combine and one product leaves the solution as a solid.",
        "Balance the polyatomic ions as whole units rather than element by "
        "element, since they pass through the reaction intact. Charge has to "
        "balance as well as atoms.",
        "Count how many of the polyatomic ion appear on each side, and balance "
        "that group first.",
    ),
    "stoich.mass_to_mass.v1": (
        "You are asked for the mass of a product formed from a measured mass of "
        "a reactant.",
        "Mass does not convert to mass directly. The route is mass to moles with "
        "molar mass, then moles to moles with the coefficients from the balanced "
        "equation, then moles back to mass with the other molar mass.",
        "Compute the molar mass of the starting species and divide the given mass "
        "by it, then stop and look at the balanced equation.",
    ),
    "equilibrium.weak_acid.v1": (
        "You are asked for the equilibrium concentration in a weak acid "
        "solution, where only a small part of the acid ionizes.",
        "Build an ICE table, write the mass action expression in terms of one "
        "unknown, and decide explicitly whether the small x approximation is "
        "allowed by testing it against the five percent rule.",
        "Write the initial row of the ICE table, with the acid at its stated "
        "concentration and both products at zero.",
    ),
    "mc.subscript_coefficient.v1": (
        "You are asked which change correctly balances the equation.",
        "A coefficient multiplies a whole formula unit, a subscript counts atoms "
        "inside one unit. Only one of those may change when balancing, because "
        "the other changes what the substance is.",
        "Look at each option and ask whether it still names the same substances "
        "as the original equation.",
    ),
}


def hint_coverage(template_ids: list[str] | None = None) -> dict[str, list[str]]:
    """Report templates that violate the hint ladder rule.

    Returns a dict with keys "missing" (no ladder at all) and "incomplete"
    (fewer than three non empty rungs). CI fails when either list is non empty.
    """
    ids = template_ids if template_ids is not None else list(HINTS)
    missing = [t for t in ids if t not in HINTS]
    incomplete = [
        t
        for t in ids
        if t in HINTS and (len(HINTS[t]) != 3 or any(not str(r).strip() for r in HINTS[t]))
    ]
    return {"missing": sorted(missing), "incomplete": sorted(incomplete)}


def rung(template_id: str, level: int) -> str | None:
    """Fetch one rung. level is 1, 2 or 3.

    The tutor gateway may never exceed the learner's current rung, which is
    enforced by the caller passing the rung the learner has actually unlocked.
    """
    ladder = HINTS.get(template_id)
    if not ladder or level < 1 or level > 3:
        return None
    return ladder[level - 1]

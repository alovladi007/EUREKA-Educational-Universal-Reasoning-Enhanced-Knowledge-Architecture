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
    "molarmass.compute.v1": (
        "You are asked for the molar mass: the mass of one mole of this substance.",
        "A molar mass is the sum of the atomic masses of every atom in the formula, each counted as many times as its subscript says.",
        "Write out how many atoms of each element the formula contains, and stop before multiplying anything.",
    ),
    "mole.mass_to_moles.v1": (
        "You are asked how many moles are in a measured mass.",
        "Molar mass is the bridge between grams and moles. Divide by it to go from mass to a count, and the units cancel to tell you which way round it goes.",
        "Compute the molar mass of the substance first, and stop there.",
    ),
    "percentcomp.element.v1": (
        "You are asked what fraction of the mass of this compound is one particular element.",
        "Percent by mass is the mass contributed by that element in one mole, divided by the mass of the whole mole, times 100.",
        "Find the total molar mass of the compound first.",
    ),
    "molarity.compute.v1": (
        "You are asked for the concentration of a solution in moles per litre.",
        "Molarity counts moles of solute per litre of solution, so a mass has to become moles before it can become a concentration.",
        "Convert the mass of solute to moles, and stop before dividing by the volume.",
    ),
    "dilution.m1v1.v1": (
        "You are asked for the concentration after solvent is added.",
        "Diluting adds solvent but not solute, so the number of moles is unchanged. That conservation is the whole equation.",
        "Compute how many moles of solute are in the stock sample you started with.",
    ),
    "gaslaw.ideal.v1": (
        "You are asked for the volume of a gas from its pressure, temperature and amount.",
        "The ideal gas law ties all four together. Rearrange it for the one you want, and check that every quantity is in units that match R.",
        "Confirm the temperature is in kelvin, and rearrange the equation for volume without substituting numbers yet.",
    ),
    "gaslaw.combined.v1": (
        "You are asked how a fixed amount of gas responds to a change in pressure and temperature.",
        "With the amount constant, the quantity pressure times volume divided by temperature is the same before and after. Set the two states equal.",
        "Write the before state as P1V1 over T1, and stop.",
    ),
    "thermo.calorimetry.v1": (
        "You are asked how much heat a mass of water absorbed for a measured temperature rise.",
        "The heat is the mass times the specific heat times the temperature change. Specific heat is what makes the units come out as energy.",
        "Identify the three quantities you were given and their units, and stop before multiplying.",
    ),
    "ph.strong_acid.v1": (
        "You are asked for the pH of a strong acid solution.",
        "A strong acid ionizes completely, so the hydronium concentration equals the acid concentration. pH is the negative base ten logarithm of that.",
        "Write down the hydronium ion concentration, which for a strong acid you can read straight off the label.",
    ),
    "limiting.reactant.v1": (
        "You are asked how much product forms when both reactant amounts are given.",
        "When both amounts are given, one runs out first and caps the product. Convert each reactant to moles, then divide by its coefficient to see which is scarcer.",
        "Convert both masses to moles, and stop before comparing them.",
    ),
    "ksp.solubility.v1": (
        "You are asked how many moles of this salt dissolve per litre of pure water.",
        "Let the molar solubility be s, write each ion concentration in terms of s using the formula, and substitute into the Ksp expression.",
        "Write down what one formula unit releases when it dissolves, in terms of s.",
    ),
    "density.compute.v1": (
        "You are asked for the density of a sample from its mass and volume.",
        "Density is mass per unit volume, so the units of the answer tell you which quantity divides which.",
        "Write the units you want in the answer, and see which arrangement of the two numbers produces them.",
    ),
    "sigfig.round.v1": (
        "You are asked to report a number to a stated number of significant figures.",
        "Count significant figures from the first non zero digit. Then look at the digit just past your cut off to decide whether to round up.",
        "Identify the first significant digit in the number and count forward from it.",
    ),
    "mc.particulate.v1": (
        "You are asked which particle level picture matches this substance or change.",
        "Move between what you see, what the particles are doing, and what the symbols say. A formula is a symbol, and it does not always mean a discrete molecule exists.",
        "Ask first whether this substance is made of separate molecules or of ions in a lattice.",
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

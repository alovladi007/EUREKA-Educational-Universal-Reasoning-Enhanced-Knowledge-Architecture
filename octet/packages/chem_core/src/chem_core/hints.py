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
    "structure.draw.v1": (
        "You are asked to draw a structure, so the answer is a picture of which "
        "atom is bonded to which, not a formula and not a name.",
        "Work from the name outward. The parent chain or ring comes first, then "
        "whatever is attached to it, and only then the hydrogens that fill the "
        "remaining valences. Carbon takes four bonds, nitrogen three, oxygen "
        "two, and a halogen one.",
        "Draw only the carbon skeleton first, with no hydrogens and no other "
        "elements, and count that the number of carbons matches the name.",
    ),
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


# ORG1 ladders. Each rung narrows without stating the answer: the first names
# what is being asked, the second gives the method, the third gives a concrete
# first move the learner can make on their own paper.
HINTS.update(
    {
        "org.unsaturation.v1": (
            "Degrees of unsaturation counts rings plus pi bonds. You are being "
            "asked how many of those a molecule with this formula must contain, "
            "without being shown the structure.",
            "Compare the formula against the saturated alkane with the same "
            "number of carbons, which is CnH2n+2. Every two hydrogens missing "
            "from that count is one degree of unsaturation. Halogens count as "
            "hydrogens, oxygen is ignored, and each nitrogen adds one to the "
            "hydrogen count you compare against.",
            "Write down the formula of the saturated alkane with the same "
            "number of carbons before you do anything else, and subtract.",
        ),
        "org.cip.v1": (
            "You are being asked to name which of the two mirror image "
            "arrangements this stereocentre has, using the Cahn-Ingold-Prelog "
            "rules.",
            "Rank the four groups by atomic number at the first point of "
            "difference, working outward one sphere at a time until the tie "
            "breaks. Then orient the lowest priority group away from you and "
            "read whether 1 to 2 to 3 runs clockwise or counterclockwise.",
            "Identify the lowest priority group first, which is almost always "
            "the hydrogen, and write down where it points before you rank "
            "anything else.",
        ),
        "org.relationship.v1": (
            "You are being asked how two structures are related: whether they "
            "are mirror images, stereoisomers that are not mirror images, the "
            "same compound written twice, or different connectivity entirely.",
            "Check connectivity first. Different connectivity means "
            "constitutional isomers and you are done. Same connectivity means "
            "you compare configuration at each stereocentre: all inverted is "
            "enantiomers, some inverted is diastereomers.",
            "Before comparing, check whether the molecule has an internal "
            "mirror plane. If it does, two spellings that look like a pair may "
            "be one compound.",
        ),
        "org.nmr.signals.v1": (
            "You are being asked how many distinct environments the hydrogens "
            "in this molecule occupy. Each environment gives one signal.",
            "Hydrogens are equivalent when the molecule's symmetry can "
            "interchange them. Look for mirror planes and rotation axes, and "
            "group the hydrogens those operations map onto each other.",
            "Count the total number of hydrogens first, then start grouping. "
            "Your groups must add back up to that total.",
        ),
        "org.elucidation.v1": (
            "You are being asked to propose a structure that fits the evidence "
            "given, not to recall a compound. Several structures may share the "
            "formula, and only some fit the spectrum.",
            "Work in order: degrees of unsaturation from the formula tells you "
            "how many rings and pi bonds to place, and the number of signals "
            "with their integration ratio tells you how symmetric the "
            "arrangement has to be.",
            "Compute the degrees of unsaturation and write that number down "
            "before you draw anything.",
        ),
    }
)

"""Lecture-note depth for ORG1 chapter 8, Noncovalent Intermolecular
Interactions — tranche 4, first chapter.

Authored at the raised 4,000-word floor with its twelve figures in the
same change, per the visual-standard directive. Scope checked against the
Loudon benchmark's chapter-8 section list: the introduction to noncovalent
interactions (8.4), homogeneous attractions and their consequences for
boiling and melting points (8.5 A-D, dispersion / permanent dipoles /
hydrogen bonding / melting), heterogeneous interactions and solubility
(8.6 A-F, solution energetics, solvent classification, covalent and ionic
solutes, hydrophobic bonding), the applications section (8.7, membranes
and drug solubility, cation binders, ionophores, ion channels) and the
strength summary (8.8). All prose authored originally for OCTET.

Numbers this system cannot derive are carried with a source. Boiling and
melting points and dipole moments are CRC values; dielectric constants are
the standard tabulated values near 293-298 K; solubilities are the CRC
aqueous values. The figures in scripts/gen_org1_ch8_figures.py are plotted
from these same numbers, so a plot and its paragraph cannot disagree.
"""

from __future__ import annotations

from app.data.lesson_extras import (
    Figure,
    LessonExtras,
    ReadingSection,
    Table,
)

EXTRAS_ORG1_CH8: dict[str, LessonExtras] = {}


def _add(extras: LessonExtras) -> None:
    EXTRAS_ORG1_CH8[extras.node] = extras


CRC = "CRC Handbook of Chemistry and Physics, 97th edition"
DIELECTRIC = (
    "Standard tabulated static dielectric constants near 293-298 K "
    "(CRC Handbook of Chemistry and Physics, 97th edition)"
)


# --------------------------------------------------------------------------
# 8.1 The three noncovalent interactions
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.IMFTYPES",
    lead=(
        "Everything you have drawn for seven chapters holds atoms together "
        "inside a molecule. This chapter is about the far weaker "
        "attractions that hold separate molecules near one another, and "
        "they decide a different class of question: not what a compound "
        "reacts with, but whether it is a gas or a liquid, whether it "
        "dissolves in water or in oil, whether it crosses a membrane, "
        "whether a chromatography column will retain it. This first node "
        "builds the taxonomy, prices each interaction against the covalent "
        "bond and against room-temperature thermal energy, and establishes "
        "the two properties - strength and reach - that the rest of the "
        "chapter spends on real molecules."
    ),
    sections=(
        ReadingSection(
            id="what-noncovalent-means",
            heading="Inside the molecule, and between molecules",
            body=(
                "A covalent bond is a shared pair of electrons occupying a "
                "molecular orbital built from two atoms' atomic orbitals. "
                "It defines what the molecule IS: break it and you have a "
                "different compound. A noncovalent interaction shares "
                "nothing. Two molecules approach, their electron clouds and "
                "nuclei feel each other's charge distributions, and the "
                "arrangement that lowers the total electrostatic energy is "
                "the one they adopt. Nothing is made and nothing is broken; "
                "the molecules simply prefer to be near each other rather "
                "than far apart, and the size of that preference is the "
                "whole subject.\n\n"
                "The distinction matters because it tells you what a "
                "physical change costs. Boiling water separates water "
                "molecules from one another and leaves every O-H bond "
                "intact - the steam above a kettle is still water. "
                "Electrolysis, which does break the O-H bonds, needs a "
                "wholly different order of energy and gives different "
                "substances. Melting, boiling, subliming, dissolving, "
                "adsorbing, and folding are all noncovalent processes; "
                "reacting is a covalent one. When a question asks about "
                "boiling point, solubility or retention time, it is asking "
                "about this chapter, and no amount of mechanism will "
                "answer it. When it asks what forms, mechanism answers and "
                "this chapter is at most a modifier - though as chapter 9 "
                "will show with solvent effects, a large one."
            ),
        ),
        ReadingSection(
            id="all-electrostatic",
            heading="One physics, several disguises",
            body=(
                "It is tempting to learn the noncovalent interactions as a "
                "list of unrelated named forces. They are not unrelated. "
                "Every one of them is Coulomb's law applied to charge "
                "distributions that differ only in how the charge got "
                "there. A full ionic charge is charge that is simply "
                "present. A permanent dipole is charge separated by an "
                "electronegativity difference across a bond, present all "
                "the time. An induced dipole is charge separated "
                "temporarily because a neighbour's field pushed the "
                "electrons over. An instantaneous dipole is charge "
                "separated by nothing but the fact that electrons move, so "
                "at any given femtosecond the cloud is lopsided somewhere.\n\n"
                "Reading them this way turns a memorised list into a "
                "single sliding scale, ordered by how much charge is "
                "separated and how permanently. Full charges beat partial "
                "charges; permanent partial charges beat borrowed ones; "
                "borrowed charges beat accidental ones. Every strength "
                "ordering in this chapter falls out of that sentence, and "
                "the exceptions - and there are real ones, treated in the "
                "boiling-point node - happen when the accidental "
                "separations are numerous enough to outvote a permanent "
                "one. That is a counting argument rather than a "
                "contradiction, which is why it is worth stating the "
                "underlying physics before the taxonomy: the taxonomy is a "
                "convenience, and the counting is the truth."
            ),
        ),
        ReadingSection(
            id="the-five-cases",
            heading="The classification: who is interacting with whom",
            body=(
                "Cross the two kinds of participant - a charge or a dipole "
                "on each side - and you generate the whole family. "
                "Ion-ion is two full charges, the strongest and the one "
                "you met as the ionic bond in general chemistry. "
                "Ion-dipole is a full charge beside a permanent dipole: "
                "this is what solvation of an ion by water is, and it is "
                "why sodium chloride dissolves. Dipole-dipole is two "
                "permanent dipoles aligning head to tail. Dipole-induced "
                "dipole, sometimes called the induction or Debye term, is "
                "a permanent dipole polarising a neighbour that had no "
                "dipole of its own - the reason iodine dissolves better in "
                "acetone than its nonpolarity suggests. Induced "
                "dipole-induced dipole is London dispersion, the "
                "correlated flicker between two clouds that both had no "
                "permanent dipole at all.\n\n"
                "Hydrogen bonding sits deliberately outside this grid. It "
                "is formally an extreme case of dipole-dipole, but the "
                "geometry is so specific, the energy so much larger, and "
                "the consequences so pervasive in biology that treating it "
                "as its own category is the honest simplification. Its own "
                "node makes the case in full. For a first pass, the working "
                "set for organic chemistry is three: dispersion, present in "
                "everything without exception; dipole-dipole, present when "
                "a permanent molecular dipole survives; and hydrogen "
                "bonding, present only under a narrow structural condition. "
                "Ion-ion and ion-dipole enter when a species is charged, "
                "which in this course means salts, carboxylate and "
                "ammonium ions, and the solvation chemistry of chapter 9."
            ),
        ),
        ReadingSection(
            id="the-strength-ladder",
            heading="Pricing the ladder",
            figure=Figure(
                stem="org1-imf-strength-ladder",
                caption=(
                    "Typical interaction energies on a logarithmic axis: the "
                    "covalent bond sits two orders of magnitude above the "
                    "interactions that decide physical behaviour."
                ),
                alt=(
                    "Horizontal range bars for covalent bonds, ion-ion, "
                    "ion-dipole, hydrogen bonding, dipole-dipole and London "
                    "dispersion on a logarithmic energy axis in kilojoules "
                    "per mole."
                ),
            ),
            body=(
                "Numbers make the ordering usable. A carbon-carbon single "
                "bond costs roughly 350 to 420 kJ/mol to break. A hydrogen "
                "bond in a liquid runs about 10 to 40 kJ/mol depending on "
                "the donor and acceptor. Dipole-dipole attraction between "
                "ordinary organic dipoles contributes about 5 to 25 "
                "kJ/mol. A single dispersion contact is worth something "
                "like 1 to 10 kJ/mol. Ion-dipole solvation of a small ion "
                "by water is much larger, tens of kJ/mol per water "
                "molecule, and ion-ion attraction between a contact pair is "
                "larger still.\n\n"
                "Two readings of the ladder matter more than the "
                "individual figures. First, the gap between the covalent "
                "bond and everything below it is not a factor of two, it is "
                "a factor of ten to a hundred; the logarithmic axis in the "
                "figure exists because a linear one flattens the three "
                "interactions this chapter actually needs into an "
                "indistinguishable smear at the bottom. Second, the ranges "
                "OVERLAP. A strong hydrogen bond and a weak ion-dipole "
                "interaction are comparable; a molecule with enough "
                "dispersion contacts can out-attract a small molecule with "
                "a permanent dipole. The ladder is a ranking of typical "
                "single interactions, not a lexicographic rule, and every "
                "trap in the chapter lives in that overlap."
            ),
            table=Table(
                caption="Typical energies, and what each interaction needs",
                columns=("Interaction", "Typical energy (kJ/mol)",
                         "Structural requirement"),
                rows=(
                    ("Covalent C-C bond (for scale)", "350-420",
                     "a shared electron pair"),
                    ("Ion-ion", "100-350",
                     "two full charges in contact"),
                    ("Ion-dipole", "40-120",
                     "a full charge plus a permanent dipole"),
                    ("Hydrogen bond", "10-40",
                     "H on N, O or F, plus a lone pair to receive it"),
                    ("Dipole-dipole", "5-25",
                     "a permanent molecular dipole on both partners"),
                    ("London dispersion", "1-10",
                     "electrons - i.e. always available"),
                ),
                source=(
                    "Standard ranges as compiled in the physical-organic "
                    "and biophysical-chemistry literature; bond-dissociation "
                    "energies from " + CRC
                ),
                note=(
                    "Ranges rather than single values, because every one of "
                    "these depends on geometry, phase and what else is "
                    "nearby. Read the ordering, not the third digit."
                ),
            ),
        ),
        ReadingSection(
            id="thermal-yardstick",
            heading="The yardstick nobody gives you: RT at room temperature",
            body=(
                "A strength in kJ/mol means nothing until you know what "
                "room temperature can undo. The product $RT$ at 298 K is "
                "about 2.5 kJ/mol, and that single number turns the ladder "
                "into predictions. An interaction worth 1 to 2 kJ/mol is "
                "at or below thermal noise: it exists, but molecules "
                "wander out of it constantly, and it only shows up in bulk "
                "because there are so many of them. An interaction worth 20 "
                "kJ/mol is roughly eight times $RT$, so it survives "
                "collisions and orients the liquid around it. That is why a "
                "single hydrogen bond in water has a real lifetime while a "
                "single dispersion contact does not.\n\n"
                "The same yardstick explains the sharpness of phase "
                "behaviour. Raising the temperature raises $RT$ and "
                "therefore raises the fraction of molecules with enough "
                "kinetic energy to escape the attractions holding them; "
                "boiling is the point at which that escape becomes bulk "
                "rather than surface. It also explains why the noncovalent "
                "world is the temperature-sensitive one and the covalent "
                "world is not: at 298 K, $RT$ is about a hundred and fifty "
                "times smaller than a C-C bond, so no ordinary warming "
                "breaks molecules, while quite ordinary warming pulls them "
                "apart from each other. Keep 2.5 kJ/mol in your head for "
                "the rest of this course; it is the exchange rate between "
                "energy on paper and behaviour in a flask."
            ),
            important=(
                "Comparisons in this chapter are per mole of interaction, "
                "not per mole of substance. A molecule that makes four "
                "weak contacts can be held more firmly than one that makes "
                "a single strong one - which is exactly how a long alkane "
                "beats a small polar molecule."
            ),
        ),
        ReadingSection(
            id="distance-dependence",
            heading="Reach: how fast each interaction dies",
            figure=Figure(
                stem="org1-imf-distance-decay",
                caption=(
                    "Normalised to their value at contact, the interactions "
                    "fall off at very different rates: doubling the "
                    "separation costs an ion pair half its attraction and a "
                    "dispersion contact ninety-eight per cent of its."
                ),
                alt=(
                    "Three decay curves against separation: one over r, one "
                    "over r squared, and one over r to the sixth, with the "
                    "value of each marked at double the contact distance."
                ),
            ),
            body=(
                "Strength is only half the story; the other half is reach, "
                "and the two are not correlated. Ion-ion attraction falls "
                "off as $1/r$, which is remarkably slow: an ion still feels "
                "another ion across several molecular diameters, which is "
                "why ionic solutions have long-range structure and why the "
                "dielectric constant of the solvent matters so much. "
                "Ion-dipole falls as $1/r^2$. Dipole-dipole between freely "
                "tumbling molecules averages to $1/r^6$ once thermal "
                "rotation is taken into account, and London dispersion is "
                "$1/r^6$ as well.\n\n"
                "Put numbers on the figure's marked points. Double the "
                "separation and an ion pair keeps half its attraction, an "
                "ion-dipole pair keeps a quarter, and a dispersion contact "
                "keeps $(1/2)^6$, which is about one and a half per cent. "
                "Dispersion is therefore a strictly CONTACT interaction: it "
                "is worth almost nothing unless the two surfaces are "
                "touching, which is precisely why molecular shape decides "
                "its magnitude and why the dispersion node is really a node "
                "about surface area. It also tells you what a liquid is. "
                "Liquids are held together by short-reach attractions, so "
                "their molecules must stay in contact, but the attractions "
                "are not directional enough to fix them in place; that "
                "combination - touching but mobile - is exactly the "
                "definition of a liquid."
            ),
        ),
        ReadingSection(
            id="attraction-and-repulsion",
            heading="Why molecules do not simply collapse together",
            body=(
                "Every interaction described so far is attractive, and if "
                "attraction were the whole story, matter would contract "
                "without limit. It does not, because at short range a "
                "steep repulsion switches on. Its origin is not "
                "electrostatic at all: it is the Pauli exclusion "
                "principle. Push two filled electron clouds into the same "
                "region and electrons of like spin cannot occupy the same "
                "state, so the clouds must promote electrons to higher "
                "orbitals to overlap. The energy cost rises far faster "
                "than the attraction, so there is a separation at which "
                "the net energy is minimum, and that separation is what we "
                "mean by molecules being 'in contact'.\n\n"
                "The distance at which this happens defines the van der "
                "Waals radius of an atom, and the sum of two van der Waals "
                "radii is the contact distance for the pair. Those radii "
                "are the numbers behind every space-filling model you have "
                "seen, and they are the reason a molecular model has a "
                "definite size at all. The practical consequences run "
                "through the rest of the course. Steric hindrance is this "
                "repulsion, met inside a molecule instead of between two: "
                "the gauche interaction of chapter 2, the 1,3-diaxial "
                "strain of chapter 7 and the backside crowding that slows "
                "the SN2 reaction in chapter 9 are all the same Pauli wall "
                "in different clothes. Attraction sets how strongly "
                "molecules hold; repulsion sets how close they may hold."
            ),
        ),
        ReadingSection(
            id="additivity",
            heading="Weak, but there are so many of them",
            body=(
                "The single most common misreading of this chapter is to "
                "conclude that because each interaction is weak, "
                "noncovalent chemistry is unimportant. The opposite is "
                "true, and additivity is why. A hexadecane molecule lying "
                "against its neighbour makes not one dispersion contact but "
                "sixteen; two complementary strands of DNA make two or "
                "three hydrogen bonds per base pair across thousands of "
                "base pairs; a folded protein buries hundreds of nonpolar "
                "contacts at once. Multiply a 2 kJ/mol interaction by a "
                "hundred and you have 200 kJ/mol, which is comparable to a "
                "covalent bond and entirely sufficient to hold a structure "
                "together at body temperature.\n\n"
                "Additivity also explains reversibility, which is the "
                "property that makes noncovalent interactions useful to "
                "living systems. A covalent bond either holds or breaks, "
                "and breaking it needs a catalyst and a mechanism. A "
                "hundred weak contacts can be undone a few at a time, so a "
                "structure held by them can breathe, open locally, "
                "recognise a partner and release it, all at ordinary "
                "temperature and without chemistry. An enzyme binds its "
                "substrate through dozens of these contacts and lets the "
                "product go when the fit is no longer complementary. "
                "Strength through numbers, release through the same "
                "numbers: this is the design principle of every molecular "
                "recognition event you will meet."
            ),
        ),
        ReadingSection(
            id="what-boiling-measures",
            heading="Phase changes as the instrument",
            body=(
                "Because noncovalent attractions cannot be measured "
                "directly on a single pair of molecules, physical "
                "properties stand in as the instrument, and it is worth "
                "being precise about what each one measures. The enthalpy "
                "of vaporisation is the cleanest: it is the energy needed "
                "to take a mole of molecules from a liquid, where each is "
                "surrounded by neighbours, to a gas, where each is alone. "
                "Almost all of it is the noncovalent attractions being "
                "paid off, so it is very nearly a direct readout of them.\n\n"
                "Boiling point is the property usually tabulated, and it "
                "is a slightly noisier proxy: it is the temperature at "
                "which vapour pressure reaches one atmosphere, so it "
                "reflects entropy as well as enthalpy. It is nevertheless "
                "reliable enough that comparing two boiling points is the "
                "standard way of comparing two sets of intermolecular "
                "attractions, and this chapter uses it repeatedly. Melting "
                "point is different in kind, because melting destroys a "
                "crystal lattice rather than separating molecules "
                "outright. It therefore depends on how well the molecules "
                "PACK as well as how strongly they attract, which is why "
                "the melting-point column occasionally reverses the "
                "boiling-point order - a point the boiling-point node "
                "develops with the xylenes. Viscosity, surface tension and "
                "enthalpy of fusion are further readouts of the same "
                "attractions, each with its own bias."
            ),
        ),
        ReadingSection(
            id="induction-term",
            heading="The borrowed dipole",
            body=(
                "Between the permanent dipole and the instantaneous one "
                "sits the induced dipole, and it deserves naming because "
                "it explains several results that otherwise look like "
                "exceptions. Place a nonpolar molecule in the field of a "
                "polar one and its electron cloud shifts: the molecule "
                "acquires a dipole it did not have, aligned so as to "
                "attract. The magnitude depends on the polarising field "
                "and on how easily the cloud deforms, a property called "
                "polarizability, which the next node treats in full.\n\n"
                "Induction is why nonpolar solutes are not quite as "
                "insoluble in polar solvents as a strict like-dissolves-like "
                "reading predicts, why iodine is noticeably more soluble in "
                "acetone or ethanol than in water, and why a nonpolar drug "
                "still has measurable affinity for a polar binding pocket. "
                "It is also the reason the older term 'van der Waals "
                "forces' is ambiguous. In careful usage van der Waals "
                "covers three distinct contributions: the orientation term "
                "between permanent dipoles, the induction term between a "
                "permanent and an induced dipole, and the dispersion term "
                "between two instantaneous dipoles. In ordinary organic "
                "usage the phrase usually means dispersion alone. Both "
                "usages are in circulation, so read 'van der Waals forces' "
                "as a request for context rather than as a precise claim, "
                "and say 'dispersion' when dispersion is what you mean."
            ),
        ),
        ReadingSection(
            id="ion-dipole-preview",
            heading="Charged species, and why solvent stops being scenery",
            body=(
                "Ion-ion and ion-dipole interactions look at first like "
                "general-chemistry material, but they enter organic "
                "chemistry the moment a species carries a charge, and in "
                "this course that happens constantly: carboxylate and "
                "alkoxide anions, ammonium and oxonium cations, "
                "carbocations, halide leaving groups, and every "
                "organometallic reagent. When such a species is in "
                "solution, its energy is dominated not by what it is but by "
                "how well the solvent surrounds it, because ion-dipole "
                "solvation is worth far more than any of the neutral "
                "interactions on the ladder.\n\n"
                "That is the reason solvent choice will shortly stop being "
                "a background detail and become part of the mechanism. A "
                "solvent that solvates an anion tightly lowers that anion's "
                "energy and makes it a poorer nucleophile, which is a "
                "chapter-9 result with a chapter-8 explanation. A solvent "
                "with a high dielectric constant screens charges from one "
                "another and stabilises the separated ions of an "
                "ionisation step, which is why the SN1 reaction needs a "
                "polar medium. The solubility node builds the solvent "
                "classification that makes those predictions; note here "
                "only that the classification exists because charged "
                "species care enormously about their surroundings, while "
                "nonpolar ones barely notice them."
            ),
        ),
        ReadingSection(
            id="directionality",
            heading="Which interactions care about orientation",
            body=(
                "A further axis, easy to overlook, is whether an "
                "interaction depends on how the molecules are turned. "
                "Dispersion does not: an instantaneous dipole appears in a "
                "random direction and induces its partner accordingly, so "
                "the attraction is present at every mutual orientation. "
                "That makes dispersion the most forgiving of the "
                "interactions and the only one available to a molecule "
                "with no permanent asymmetry at all.\n\n"
                "Dipole-dipole is directional but weakly so, because "
                "thermal tumbling averages the good and bad orientations "
                "together - this averaging is exactly why the naive $1/r^3$ "
                "dipole-dipole law becomes an effective $1/r^6$ in a liquid. "
                "Hydrogen bonding is strongly directional: it wants the "
                "donor, the hydrogen and the acceptor lone pair nearly "
                "collinear, and it loses much of its strength when bent. "
                "Directionality is what makes hydrogen bonding a "
                "structure-BUILDING interaction rather than a merely "
                "cohesive one. Dispersion holds a liquid together; hydrogen "
                "bonding builds the tetrahedral network of ice, the double "
                "helix of DNA and the alpha helix of a protein, because "
                "only a directional interaction can specify a shape. When "
                "you meet a molecular structure that is precise rather "
                "than merely compact, look for directional interactions "
                "holding it."
            ),
        ),
        ReadingSection(
            id="naming-traps",
            heading="Three names that mislead",
            body=(
                "The vocabulary of this chapter is older than the physics "
                "and three terms regularly cause trouble. The first is "
                "hydrogen BOND. It is not a bond. At 10 to 40 kJ/mol it is "
                "roughly a twentieth of the strength of the O-H covalent "
                "bond that supplies its hydrogen, and treating it as a bond "
                "leads students to draw hydrogens with five connections or "
                "to imagine that hydrogen bonding is something a molecule "
                "does internally to itself by default.\n\n"
                "The second is INTERmolecular against INTRAmolecular. The "
                "interactions in this chapter are usually between "
                "molecules, but every one of them can occur within a single "
                "molecule when its geometry brings two parts together, and "
                "the consequences differ sharply: an intramolecular "
                "hydrogen bond satisfies a donor without linking two "
                "molecules, so it lowers boiling point where an "
                "intermolecular one raises it. The third is 'polar'. A "
                "polar BOND is an electronegativity difference; a polar "
                "MOLECULE is a surviving vector sum; a polar SOLVENT is a "
                "bulk property usually quantified by dielectric constant. "
                "Tetrachloromethane has four strongly polar bonds, no "
                "molecular dipole, and behaves as a nonpolar solvent, so "
                "the three senses genuinely can disagree about the same "
                "compound. Say which sense you mean and most of the "
                "confusion in this chapter disappears."
            ),
            important=(
                "'Van der Waals forces' is a fourth ambiguous term. In "
                "strict usage it covers orientation, induction and "
                "dispersion together; in ordinary organic usage it means "
                "dispersion alone. Prefer the specific word."
            ),
        ),
        ReadingSection(
            id="worked-audit",
            heading="Worked example: auditing four molecules",
            body=(
                "The skill this node is really teaching is an audit: given "
                "a structure, list which interactions are available. Run it "
                "on four compounds. Ethane, CH3CH3, is nonpolar and has no "
                "hydrogen on N, O or F: dispersion only, and rather little "
                "of it, since the molecule is small. Chloroethane, "
                "CH3CH2Cl, has a polar C-Cl bond that no symmetry cancels, "
                "so it has dispersion plus a permanent dipole - and rather "
                "more dispersion than ethane, because chlorine brings "
                "seventeen electrons.\n\n"
                "Ethanol, CH3CH2OH, has a hydrogen on oxygen and lone "
                "pairs on that same oxygen, so it is both a hydrogen-bond "
                "donor and an acceptor; it has dispersion, a permanent "
                "dipole and hydrogen bonding, the full set. Sodium "
                "ethoxide, Na+ -OCH2CH3, is ionic, so in the solid it is "
                "held by ion-ion attraction and in solution by ion-dipole "
                "solvation, both an order of magnitude above anything the "
                "neutral three can offer. The measured boiling points "
                "follow the audit exactly: ethane 184.6 K, chloroethane "
                "285.4 K, ethanol 351.4 K, and sodium ethoxide does not "
                "boil at all but decomposes on strong heating, as ionic "
                "solids characteristically do. Notice that the audit was "
                "structural throughout - no data was consulted to produce "
                "the ordering, only to check it. That is the working "
                "pattern for the whole chapter."
            ),
            table=Table(
                caption="The audit, checked against measured boiling points",
                columns=("Compound", "Interactions available",
                         "Boiling point (K)"),
                rows=(
                    ("ethane, CH3CH3", "dispersion only", "184.6"),
                    ("chloroethane, CH3CH2Cl",
                     "dispersion + permanent dipole", "285.4"),
                    ("ethanol, CH3CH2OH",
                     "dispersion + dipole + hydrogen bonding", "351.4"),
                    ("sodium ethoxide, NaOCH2CH3",
                     "ion-ion (solid), ion-dipole (solution)",
                     "decomposes, does not boil"),
                ),
                source="Boiling points at 1 atm from " + CRC,
            ),
        ),
        ReadingSection(
            id="summing-the-terms",
            heading="A real substance uses all three at once",
            body=(
                "Textbook questions present molecules as though one "
                "interaction were switched on and the others off, and that "
                "simplification quietly installs a wrong picture. In any "
                "real liquid all the available interactions operate "
                "simultaneously, and the total attraction is their sum. "
                "Ethanol is the standard illustration. It hydrogen bonds, "
                "so students file it under hydrogen bonding and stop. But "
                "ethanol also has a two-carbon nonpolar region making "
                "dispersion contacts and a permanent dipole making "
                "dipole-dipole contacts, and both contribute to holding the "
                "liquid together.\n\n"
                "Now walk up the alcohol series. The hydroxyl group stays "
                "exactly one hydroxyl group, so the hydrogen-bonding "
                "contribution is roughly constant from ethanol to "
                "decan-1-ol, while the dispersion contribution grows with "
                "every added CH2. Somewhere along that series dispersion "
                "overtakes hydrogen bonding as the largest single term, and "
                "the substance stops behaving like a small alcohol and "
                "starts behaving like a slightly sticky hydrocarbon - "
                "insoluble in water, soluble in hexane, waxy rather than "
                "fluid. Nothing was switched off; one term simply grew past "
                "another. The habit worth building is therefore not 'which "
                "interaction does this molecule have' but 'how much of each "
                "does this molecule have', because the second question "
                "predicts the alcohol series correctly and the first one "
                "does not."
            ),
        ),
        ReadingSection(
            id="states-of-matter",
            heading="Reading the three states as one competition",
            body=(
                "The states of matter are the outcome of a single contest "
                "between the attractions this chapter enumerates and the "
                "thermal energy that scrambles them. When attraction "
                "dominates comprehensively, molecules take fixed positions "
                "and orientations and the substance is a solid. When "
                "attraction still holds molecules in contact but no longer "
                "fixes them, they slide past one another and the substance "
                "is a liquid. When thermal energy dominates outright, "
                "molecules separate to distances at which $1/r^6$ "
                "attraction is negligible, and the substance is a gas. "
                "Melting point and boiling point simply mark the two "
                "temperatures at which the contest changes hands.\n\n"
                "That framing makes several everyday facts predictable "
                "rather than memorised. Substances with only weak "
                "dispersion - methane, nitrogen, the noble gases - lose the "
                "contest at very low temperatures and are gases in any "
                "ordinary room. Substances with extensive hydrogen bonding, "
                "such as water and the sugars, hold on far past what their "
                "small size would suggest. Ionic solids, held by the "
                "strongest and longest-reaching interaction on the ladder, "
                "commonly need many hundreds of kelvin to melt at all. And "
                "carbon dioxide sublimes at atmospheric pressure - passing "
                "solid to gas without a liquid - because its molecules "
                "attract each other so weakly, through dispersion alone, "
                "that no pressure-temperature window exists in which they "
                "are held in contact yet free to move."
            ),
        ),
        ReadingSection(
            id="where-this-goes",
            heading="Where this chapter is spent",
            body=(
                "It is worth knowing in advance how much of the rest of "
                "chemistry this one chapter underwrites, because the "
                "material can otherwise read as a physical-property "
                "digression between two blocks of mechanism. Separation "
                "science is noncovalent chemistry throughout: distillation "
                "ranks compounds by the attractions this chapter "
                "enumerates, extraction exploits differences in solubility, "
                "and chromatography is a controlled competition between a "
                "solute's attraction to a stationary phase and to a mobile "
                "one. Every purification you perform in a teaching "
                "laboratory is an application of these ideas.\n\n"
                "Biology is the second consumer. Membranes exist because "
                "hydrophobic tails aggregate; proteins fold because burying "
                "nonpolar side chains is favourable and because hydrogen "
                "bonds specify secondary structure; nucleic acids pair "
                "because hydrogen bonding is directional and stack because "
                "dispersion between aromatic faces is not. Pharmacology is "
                "the third: whether a drug is absorbed, whether it crosses "
                "into the brain, and how tightly it binds its target are "
                "all noncovalent questions, and medicinal chemists quantify "
                "them with the partition coefficients the solubility node "
                "introduces. Mechanism tells you what a molecule can "
                "become; these interactions tell you where it will be, "
                "what it will be dissolved in, and what it will stick to "
                "when it gets there."
            ),
        ),
        ReadingSection(
            id="chapter-map",
            heading="What the next five nodes do",
            body=(
                "The chapter now takes the three working interactions one "
                "at a time and then puts them back together. The "
                "dispersion node establishes polarizability and contact "
                "area as the two variables that set dispersion strength, "
                "and shows why shape can beat mass. The dipole node builds "
                "the vector arithmetic that decides whether a molecule has "
                "a permanent dipole at all, which is a geometry question "
                "rather than an atom-counting one. The hydrogen-bonding "
                "node states the donor-and-acceptor condition precisely, "
                "presents the binary-hydride evidence that forced chemists "
                "to admit the interaction exists, and follows it into "
                "biology.\n\n"
                "The two remaining nodes are synthesis rather than "
                "analysis. The physical-properties node turns the three "
                "into an ordered procedure for ranking boiling points and "
                "explains why melting point needs a fourth consideration "
                "the other three do not. The solubility node moves from a "
                "pure substance interacting with itself to two different "
                "substances interacting with each other, which requires the "
                "free-energy bookkeeping that like-dissolves-like "
                "abbreviates, and ends with the applications that make the "
                "chapter matter: hydrophobic aggregation, membranes and "
                "drug absorption, and the designed cation binders. Read the "
                "chapter with one question in hand throughout - given this "
                "structure, which interactions are available, and how many "
                "of each - because every result in it is an answer to that "
                "question.\n\n"
                "One organisational note before you go on. The chapter is "
                "unusual in this course for containing almost no "
                "mechanism, and students who navigate by curly arrows "
                "sometimes read that as a signal to skim. Do the opposite. "
                "The alkyl-halide chapter that follows this one turns on "
                "solvent effects, leaving-group solvation and nucleophile "
                "polarizability, and each of those is a chapter-8 idea "
                "wearing a chapter-9 label. The investment you make here in "
                "reading a structure for its interactions is repaid "
                "immediately, and then repeated in every carbonyl, "
                "aromatic and biological chapter after it."
            ),
        ),
    ),
    key_takeaways=(
        "All noncovalent interactions are Coulomb's law applied to charge that is full, permanently separated, induced, or merely instantaneous - one physics, ordered by how much charge is separated and how permanently.",
        "The working set for organic chemistry is three: dispersion (always present), dipole-dipole (needs a surviving molecular dipole) and hydrogen bonding (needs H on N, O or F plus an acceptor lone pair).",
        "Typical energies: dispersion 1-10, dipole-dipole 5-25, hydrogen bond 10-40 kJ/mol, against 350-420 for a C-C bond - which is why boiling separates molecules without destroying them.",
        "RT at 298 K is about 2.5 kJ/mol; that is the yardstick that converts a number in kJ/mol into a prediction about behaviour.",
        "Reach differs as much as strength: ion-ion falls as 1/r, dispersion as 1/r^6, so dispersion is a contact interaction and molecular shape sets its size.",
        "Weak interactions are decisive because they are additive and reversible - the design principle behind membranes, folded proteins, base pairing and drug binding.",
    ),
    exam_tips=(
        "Questions that ask about boiling point, melting point, solubility or extraction are asking about this chapter; questions that ask what forms are asking about mechanism. Identify which before reaching for a rule.",
        "The MCAT reliably tests the distinction between a polar bond and a polar molecule. CCl4, CO2 and para-disubstituted benzenes are the standard traps: polar bonds, zero net dipole.",
        "Never answer 'stronger intermolecular forces' without naming which one and why it is available from the structure. The named-and-justified answer is the one that survives a two-step question.",
    ),
))
# --------------------------------------------------------------------------
# 8.2 London dispersion
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.DISPERSION",
    lead=(
        "Dispersion is the interaction that has no structural "
        "requirement at all: a molecule qualifies by having electrons. "
        "That universality makes it easy to dismiss as background, and "
        "dismissing it is the single most expensive mistake in this "
        "chapter, because dispersion is the ONLY attraction available to "
        "the hydrocarbons that make up most of organic chemistry and it "
        "accumulates without limit as molecules grow. This node builds "
        "dispersion from its quantum-mechanical origin, identifies its "
        "two structural variables - polarizability and contact area - "
        "and shows why two compounds with identical formulas can boil "
        "twenty-six kelvin apart."
    ),
    sections=(
        ReadingSection(
            id="the-paradox",
            heading="The problem dispersion had to solve",
            body=(
                "By the early twentieth century chemists could explain why "
                "polar molecules attract one another and why ions do. They "
                "could not explain the noble gases. Helium, argon and "
                "neon have no dipole, no charge, no unpaired electron and "
                "no possibility of a chemical bond, and yet every one of "
                "them condenses to a liquid if you cool it far enough. "
                "Argon boils at 87.3 K, which is not a trivial "
                "temperature; something is holding argon atoms to one "
                "another, and none of the classical electrostatic pictures "
                "permitted it.\n\n"
                "Fritz London supplied the answer in 1930, and the answer "
                "is quantum-mechanical: a symmetric electron cloud is "
                "symmetric only on AVERAGE. At any instant the electrons "
                "in an argon atom occupy definite positions, and those "
                "positions are almost never distributed with perfect "
                "symmetry about the nucleus. The atom therefore has a real, "
                "fluctuating dipole at every instant, whose time average is "
                "zero. That instantaneous dipole produces a field, the "
                "field distorts a neighbouring cloud, and the two "
                "fluctuations become CORRELATED - each atom's cloud moves "
                "in step with its neighbour's in the way that lowers the "
                "energy. The attraction is not between two static charge "
                "distributions but between two synchronised dances, which "
                "is why it took quantum mechanics to find it."
            ),
        ),
        ReadingSection(
            id="what-fluctuates",
            heading="Correlation, not coincidence",
            body=(
                "It is worth being careful about what makes this "
                "attractive rather than neutral, because a common informal "
                "account gets it wrong. If two neighbouring atoms simply "
                "had random independent fluctuations, the attractive and "
                "repulsive arrangements would occur equally often and would "
                "cancel to nothing. The attraction exists because the "
                "fluctuations are not independent. Once atom A has a "
                "momentary dipole, atom B's electrons respond to A's field "
                "essentially instantaneously, and they respond in the "
                "orientation that is attractive rather than repulsive. B's "
                "induced dipole then reinforces A's. The two clouds are "
                "coupled, and coupled systems always find the lower-energy "
                "configuration.\n\n"
                "Two properties of the interaction follow directly from "
                "this picture and are worth keeping. First, dispersion is "
                "always attractive and never repulsive, because the "
                "responding cloud always responds attractively. Second, it "
                "never switches off: there is no molecule, no ion and no "
                "atom without electrons, so dispersion contributes to every "
                "intermolecular interaction in chemistry, including those "
                "between molecules that also hydrogen bond. When a later "
                "section says a compound has 'dispersion only', it means no "
                "other interaction is available, never that dispersion has "
                "been excluded from a molecule that has others."
            ),
        ),
        ReadingSection(
            id="polarizability",
            heading="Polarizability: how loosely the electrons are held",
            body=(
                "If dispersion depends on clouds deforming, then the "
                "controlling molecular property is how easily a cloud "
                "deforms. That property is polarizability, conventionally "
                "written $\\alpha$, and it is the single most useful "
                "quantity in this node. A cloud is polarizable when its "
                "outermost electrons are far from the nucleus, poorly "
                "shielded from deformation, and loosely held: large atoms "
                "with many electrons are highly polarizable, small "
                "electronegative atoms holding their electrons tightly are "
                "not.\n\n"
                "Polarizability therefore increases DOWN a group of the "
                "periodic table and decreases across a period. Iodine is "
                "far more polarizable than fluorine; sulfur far more than "
                "oxygen; a C-I bond far more than a C-F bond. This is not "
                "an incidental fact about physical properties. It is the "
                "reason iodide is a better nucleophile than fluoride in "
                "protic solvents, the reason thiols are better "
                "nucleophiles than alcohols, and the reason heavy halogens "
                "make good leaving groups - a soft, diffuse electron cloud "
                "both attacks and departs more readily than a hard, "
                "compact one. Chapter 9 will spend polarizability "
                "repeatedly under the heading of nucleophilicity, and the "
                "concept it is spending is this one. Learn polarizability "
                "here as a physical property and you will recognise it "
                "there as a reactivity principle."
            ),
            important=(
                "Polarizability tracks the number and looseness of "
                "electrons, not molecular mass. Mass correlates with it "
                "well enough to be a useful shortcut within a series of "
                "similar compounds, and badly enough to be a trap between "
                "series - which is why the ranking arguments in this "
                "chapter count electrons rather than daltons."
            ),
        ),
        ReadingSection(
            id="london-formula",
            heading="What the algebra says, and what to take from it",
            body=(
                "London's own result for two interacting species can be "
                "written, dropping constants, as "
                "$E \\propto -\\dfrac{\\alpha_1 \\alpha_2 I}{r^6}$, where "
                "$\\alpha_1$ and $\\alpha_2$ are the two polarizabilities, "
                "$I$ is a characteristic ionisation energy and $r$ is the "
                "separation. You will not be asked to use this equation "
                "numerically in this course, but three features of it are "
                "worth reading off, because each corresponds to a "
                "prediction that appears in problems.\n\n"
                "The first is that the polarizabilities enter as a "
                "PRODUCT, not a sum. Dispersion between two highly "
                "polarizable partners is disproportionately strong, and "
                "dispersion between a polarizable molecule and a rigid one "
                "is limited by the rigid partner - which is why "
                "like-attracts-like shows up even within a single "
                "interaction type. The second is the negative sign, "
                "standing for the claim made earlier: dispersion is "
                "unconditionally attractive. The third is the sixth power "
                "in the denominator, which is the contact-only behaviour "
                "the previous node quantified. Everything this node says "
                "about size and shape is those three features translated "
                "into structures: polarizability is size and diffuseness, "
                "the product is why both partners matter, and the sixth "
                "power is why surface area rather than volume is the "
                "quantity that gets paid."
            ),
        ),
        ReadingSection(
            id="halogen-evidence",
            heading="The halogens: dispersion measured with everything else removed",
            figure=Figure(
                stem="org1-halogen-bp",
                caption=(
                    "Boiling point of the four halogens against electrons "
                    "per molecule: no dipole, no hydrogen bonding, so the "
                    "372 K spread is dispersion and nothing else."
                ),
                alt=(
                    "Line plot of boiling point in kelvin against electrons "
                    "per molecule for fluorine, chlorine, bromine and "
                    "iodine, rising steeply from 85 K to 457 K."
                ),
            ),
            body=(
                "The halogens make the cleanest possible test case. All "
                "four are homonuclear diatomics, so every one of them has "
                "exactly zero dipole moment by symmetry; none has a "
                "hydrogen at all, so hydrogen bonding is impossible. "
                "Whatever holds F2 together is what holds I2 together, and "
                "it is dispersion alone. The measured boiling points climb "
                "from 85.0 K for fluorine to 239.1 K for chlorine, 332.0 K "
                "for bromine and 457.4 K for iodine - a spread of 372 K "
                "produced by a single interaction.\n\n"
                "The consequence is one you can see on a bench. At room "
                "temperature fluorine and chlorine are gases, bromine is "
                "one of the very few liquid elements, and iodine is a "
                "crystalline solid; the change of state down a single group "
                "is dispersion becoming strong enough to win the contest of "
                "the previous node. The electron counts explain the "
                "ordering directly: 18 electrons in F2, 34 in Cl2, 70 in "
                "Br2, 106 in I2. More electrons, further from their nuclei, "
                "means a more deformable cloud, larger instantaneous "
                "dipoles, stronger correlation and a higher boiling point. "
                "No other variable changes across the series, which is why "
                "this is the figure to reach for when someone claims "
                "dispersion is negligible."
            ),
            table=Table(
                caption="The halogens: one interaction, four data points",
                columns=("Molecule", "Electrons", "Boiling point (K)",
                         "State at 298 K"),
                rows=(
                    ("F2", "18", "85.0", "gas"),
                    ("Cl2", "34", "239.1", "gas"),
                    ("Br2", "70", "332.0", "liquid"),
                    ("I2", "106", "457.4", "solid"),
                ),
                source="Boiling points at 1 atm from " + CRC,
                note=(
                    "Electron counts are arithmetic from the atomic "
                    "numbers, not measured quantities."
                ),
            ),
        ),
        ReadingSection(
            id="noble-gases",
            heading="The limiting case: atoms with nothing else at all",
            body=(
                "The halogens are diatomic, so a sceptic could still "
                "attribute part of their trend to molecular shape or bond "
                "polarisability. The noble gases close that objection. They "
                "are single spherical atoms with closed shells, no bonds, "
                "no shape to argue about and no chemistry to speak of, and "
                "they still condense: helium boils at 4.2 K, neon at 27.1, "
                "argon at 87.3, krypton at 119.9 and xenon at 165.1 K.\n\n"
                "Sixty times the boiling point from helium to xenon, in "
                "species whose only difference is how many electrons they "
                "carry and how far those electrons sit from the nucleus. "
                "Helium's two tightly held electrons are the least "
                "polarizable ensemble in chemistry, which is why liquid "
                "helium exists only within a few degrees of absolute zero "
                "and why it is the last substance to condense. Xenon's "
                "fifty-four electrons, with the outermost in the fifth "
                "shell, are diffuse enough that xenon liquefies at "
                "temperatures a laboratory freezer can approach - and "
                "polarizable enough that xenon, alone among the lighter "
                "noble gases, has a genuine covalent chemistry with "
                "fluorine and oxygen. Polarizability first appeared here as "
                "a physical property; in xenon it becomes a chemical one."
            ),
            table=Table(
                caption="Noble gases: dispersion with every other variable "
                        "removed",
                columns=("Element", "Electrons", "Boiling point (K)"),
                rows=(
                    ("helium", "2", "4.2"),
                    ("neon", "10", "27.1"),
                    ("argon", "18", "87.3"),
                    ("krypton", "36", "119.9"),
                    ("xenon", "54", "165.1"),
                ),
                source="Boiling points at 1 atm from " + CRC,
            ),
        ),
        ReadingSection(
            id="size-in-organic",
            heading="Size, translated into carbons",
            body=(
                "In organic chemistry the electron count usually changes by "
                "adding carbons, and the resulting trend is regular enough "
                "to memorise. Each CH2 group added to an unbranched alkane "
                "raises the boiling point by roughly twenty to thirty "
                "kelvin, with the increment largest for the smallest "
                "members and settling as the chain grows. Methane boils at "
                "111.7 K and octane at 398.8 K; the difference is seven CH2 "
                "groups' worth of dispersion.\n\n"
                "That regularity is what makes the alkane series a "
                "thermometer for dispersion, and it produces the familiar "
                "commercial fractions. Alkanes up to about four carbons are "
                "gases at room temperature and are sold as fuels under "
                "pressure; five to about sixteen carbons are liquids, which "
                "is the petrol and diesel range; beyond roughly eighteen "
                "carbons they are waxy solids, which is what a paraffin "
                "candle is. Nothing changes chemically across that "
                "progression - every member is an unreactive saturated "
                "hydrocarbon - and everything changes physically, because "
                "dispersion accumulates. The same arithmetic runs through "
                "the fatty acids of biochemistry, where chain length "
                "decides whether a lipid is a fluid oil or a solid fat at "
                "body temperature, and through the lipophilicity of drug "
                "molecules, where each added carbon buys membrane "
                "permeability at the cost of aqueous solubility."
            ),
        ),
        ReadingSection(
            id="methyl-halides",
            heading="A series where dispersion overrules the dipole",
            body=(
                "The halogens removed the dipole entirely. The methyl "
                "halides do something more instructive: they keep a dipole "
                "and let it argue with dispersion, and dispersion wins so "
                "decisively that the result is worth memorising as a "
                "counterexample. Fluoromethane boils at 194.8 K, "
                "chloromethane at 249.0 K, bromomethane at 276.7 K and "
                "iodomethane at 315.6 K - a clean rise of 121 K down the "
                "series.\n\n"
                "Now look at the dipole moments over the same four "
                "compounds: 1.85, 1.90, 1.82 and 1.62 D. They barely change "
                "and, if anything, fall slightly at the bottom, because the "
                "electronegativity difference shrinks down the group even "
                "as the bond lengthens. So the boiling point rises by 121 K "
                "while the permanent dipole does not rise at all, and the "
                "only variable left is polarizability: iodine's outer "
                "electrons are far from its nucleus and deform readily "
                "where fluorine's do not. This is the cleanest available "
                "demonstration that a permanent dipole is not automatically "
                "the dominant term, and it prepares the ordered procedure "
                "of the physical-properties node, where the dipole "
                "question is asked before the size question but can be "
                "overturned by it."
            ),
            table=Table(
                caption=(
                    "The methyl halides: boiling point climbs, dipole "
                    "moment does not"
                ),
                columns=("Compound", "Dipole moment (D)",
                         "Boiling point (K)"),
                rows=(
                    ("CH3F", "1.85", "194.8"),
                    ("CH3Cl", "1.90", "249.0"),
                    ("CH3Br", "1.82", "276.7"),
                    ("CH3I", "1.62", "315.6"),
                ),
                source=(
                    "Gas-phase dipole moments and boiling points at 1 atm "
                    "from " + CRC
                ),
                note=(
                    "Four compounds, one structural variable changing "
                    "monotonically (polarizability) and one holding roughly "
                    "constant (dipole moment). The boiling point follows "
                    "the variable that changes."
                ),
            ),
        ),
        ReadingSection(
            id="shape-matters",
            heading="Contact area: the variable size does not capture",
            figure=Figure(
                stem="org1-dispersion-contact",
                caption=(
                    "Pentane and neopentane have the same formula and the "
                    "same electrons; an extended chain touches its "
                    "neighbour along its whole length, a near-sphere at one "
                    "patch, and the boiling points differ by 26.6 K."
                ),
                alt=(
                    "Schematic contrasting two zig-zag chains lying "
                    "alongside with many contact points against two "
                    "circles touching at a single point."
                ),
            ),
            body=(
                "Because dispersion falls off as $1/r^6$, it is worth "
                "almost nothing except where two surfaces are actually "
                "touching. Strength therefore depends not only on how many "
                "electrons a molecule has but on how much of its surface it "
                "can bring into contact with a neighbour - and that is a "
                "question about shape, which molecular formula does not "
                "answer. Two constitutional isomers have identical "
                "formulas, identical masses and identical electron counts, "
                "and can still differ substantially in dispersion.\n\n"
                "The standard demonstration is the C5H12 series. Pentane is "
                "an unbranched chain that can lie alongside another pentane "
                "over its whole length, making contact at every carbon. "
                "2,2-Dimethylpropane, universally called neopentane, is a "
                "central carbon carrying four methyl groups and is nearly "
                "spherical; two neopentane molecules touch at a small patch "
                "and no more, because a sphere is the shape with the least "
                "surface for its volume. The boiling points are 309.2 K and "
                "282.6 K, a gap of 26.6 K with 2-methylbutane, the "
                "singly-branched isomer, sitting between them at 300.9 K. "
                "Same electrons, three shapes, three boiling points, in the "
                "order the contact-area argument predicts."
            ),
            table=Table(
                caption="The pentanes: identical C5H12, three shapes",
                columns=("Isomer", "Branching", "Boiling point (K)"),
                rows=(
                    ("pentane", "unbranched", "309.2"),
                    ("2-methylbutane", "one branch", "300.9"),
                    ("2,2-dimethylpropane (neopentane)",
                     "two branches, near-spherical", "282.6"),
                ),
                source="Boiling points at 1 atm from " + CRC,
            ),
        ),
        ReadingSection(
            id="branching-rule",
            heading="Stating the branching rule so it survives contact with data",
            body=(
                "The rule students carry away - 'branching lowers boiling "
                "point' - is correct, but it is worth stating in the form "
                "that explains itself, because the memorised version is "
                "brittle. Branching lowers boiling point because it lowers "
                "SURFACE AREA at constant volume, and surface area is what "
                "dispersion is paid on. Anything else that lowers "
                "accessible surface area does the same thing, and anything "
                "that raises it raises boiling point.\n\n"
                "Stated that way the rule extends. Cyclic compounds have "
                "less exposed surface than their open-chain isomers for "
                "part of the same reason and generally boil differently "
                "from them. Rigid, flat molecules that can stack face to "
                "face - the aromatic rings of a later chapter - make "
                "excellent dispersion contact over their whole faces, which "
                "is why aromatic hydrocarbons are less volatile than "
                "saturated ones of comparable mass and why the stacked "
                "bases inside a DNA double helix are held partly by "
                "dispersion between their faces. It also sets the boundary "
                "condition of the rule: branching only matters when the "
                "compared molecules have similar electron counts. Between "
                "molecules of different size, size wins first and shape is "
                "the tie-break, which is the ordering the physical-property "
                "node formalises."
            ),
        ),
        ReadingSection(
            id="ranking-practice",
            heading="Worked example: ranking on both variables at once",
            body=(
                "Rank hexane, pentane, 2-methylbutane and neopentane by "
                "boiling point. Start with the first variable, electron "
                "count: hexane is C6H14 and the other three are C5H12, so "
                "hexane has one CH2 more than any of them and should be "
                "highest. That settles first place without any shape "
                "argument at all. The remaining three are isomers, so size "
                "cannot separate them and the tie-break is shape: "
                "unbranched pentane, then singly-branched 2-methylbutane, "
                "then near-spherical neopentane.\n\n"
                "The predicted order is hexane, pentane, 2-methylbutane, "
                "neopentane, and the measured values confirm it: 341.9, "
                "309.2, 300.9 and 282.6 K. Notice how the two variables "
                "were applied - size FIRST, and shape only among molecules "
                "that size cannot distinguish. Reversing that order "
                "produces the classic wrong answer in which a heavily "
                "branched large molecule is ranked below a small "
                "unbranched one. Notice also how far apart the extremes "
                "are: hexane and neopentane differ by 59.3 K, and every "
                "kelvin of it is dispersion, in molecules that have no "
                "functional group, no dipole and no hydrogen bonding to "
                "argue about."
            ),
            table=Table(
                caption="Size first, shape as the tie-break",
                columns=("Compound", "Formula", "Boiling point (K)"),
                rows=(
                    ("hexane", "C6H14", "341.9"),
                    ("pentane", "C5H12", "309.2"),
                    ("2-methylbutane", "C5H12", "300.9"),
                    ("neopentane", "C5H12", "282.6"),
                ),
                source="Boiling points at 1 atm from " + CRC,
            ),
        ),
        ReadingSection(
            id="alkane-increments",
            heading="The per-CH2 increment, and what it is worth",
            body=(
                "The alkane series is regular enough that the boiling-point "
                "increment per added CH2 can be read straight off the "
                "table, and doing so converts a qualitative rule into an "
                "estimate. From methane to ethane the jump is 72.9 K; from "
                "ethane to propane 46.5 K; propane to butane 41.7 K; then "
                "36.6, 32.6, 29.7 and 27.3 K for the successive additions "
                "up to octane. The increment is large at the start and "
                "settles toward roughly twenty-five kelvin per carbon as "
                "the chain lengthens.\n\n"
                "The decline is itself informative. Adding a carbon to "
                "methane increases the molecule's electron count by a large "
                "FRACTION; adding one to heptane increases it by a small "
                "fraction, and the boiling point responds to the "
                "proportional change rather than the absolute one. The "
                "practical use is estimation. Told that decane boils at "
                "447.3 K, you can put undecane near 470 K and be close "
                "enough for a laboratory decision, and you can immediately "
                "reject a claimed value of 350 K as impossible. The same "
                "arithmetic underlies the boiling ranges of refinery "
                "fractions and the retention-time spacing of a homologous "
                "series in gas chromatography, where equal carbon "
                "increments give evenly spaced peaks for the same reason."
            ),
            table=Table(
                caption="Unbranched alkanes: boiling point and increment",
                columns=("Alkane", "Carbons", "Boiling point (K)",
                         "Increment (K)"),
                rows=(
                    ("methane", "1", "111.7", "-"),
                    ("ethane", "2", "184.6", "+72.9"),
                    ("propane", "3", "231.1", "+46.5"),
                    ("butane", "4", "272.7", "+41.7"),
                    ("pentane", "5", "309.2", "+36.6"),
                    ("hexane", "6", "341.9", "+32.6"),
                    ("heptane", "7", "371.6", "+29.7"),
                    ("octane", "8", "398.8", "+27.3"),
                ),
                source="Boiling points at 1 atm from " + CRC,
                note=(
                    "Increments are differences computed from the tabulated "
                    "boiling points, not separately measured quantities."
                ),
            ),
        ),
        ReadingSection(
            id="melting-point-exception",
            heading="Where the branching rule reverses",
            body=(
                "Branching lowers boiling point reliably. It does not "
                "reliably lower melting point, and the exception is worth "
                "meeting now because it is the most-missed result in the "
                "chapter. Neopentane melts at 256.6 K while pentane melts "
                "at 143.4 K: the near-spherical isomer that boils LOWEST "
                "melts more than a hundred kelvin HIGHER than the chain.\n\n"
                "The reason is that melting and boiling ask different "
                "questions. Boiling asks how strongly molecules attract, "
                "and attraction is paid on contact area, which branching "
                "reduces. Melting asks how strongly a CRYSTAL holds, and a "
                "crystal's stability depends on how neatly its molecules "
                "pack into a repeating lattice as well as on how they "
                "attract. A near-spherical molecule packs beautifully - "
                "spheres are the easiest objects to stack regularly - and a "
                "floppy chain packs poorly, because it must also give up "
                "conformational freedom to lie down in a lattice. "
                "Symmetric molecules therefore melt high, and this is not a "
                "small effect: it is the reason the melting-point column of "
                "a data table so often refuses to follow the boiling-point "
                "column. The physical-properties node returns to this with "
                "the three xylenes, which make the point without the "
                "distraction of a shape change."
            ),
            important=(
                "Two different questions, two different answers: contact "
                "area governs boiling point, packing efficiency governs "
                "melting point. Do not carry a boiling-point rule into a "
                "melting-point question."
            ),
        ),
        ReadingSection(
            id="volatility",
            heading="Volatility, vapour pressure and the smell of things",
            body=(
                "Boiling point is a threshold; vapour pressure is the "
                "continuous quantity underneath it, and for a chemist it is "
                "often the more useful one. Vapour pressure is the pressure "
                "of molecules that have escaped a liquid's surface at a "
                "given temperature, so it is inversely related to how "
                "strongly the liquid holds them. A compound with weak "
                "dispersion has a high vapour pressure, evaporates quickly "
                "and boils low; one with strong dispersion has a low vapour "
                "pressure and lingers.\n\n"
                "This is why rotary evaporation removes dichloromethane in "
                "minutes and toluene in considerably longer, why a spilled "
                "hydrocarbon solvent fills a room while a spilled oil does "
                "not, and why 'high-boiling' and 'low-volatility' are used "
                "interchangeably in a procedure. It is also why you can "
                "smell small organic molecules and not large ones. An "
                "odorant must reach the olfactory receptors through the "
                "air, so it must have appreciable vapour pressure at room "
                "temperature, which caps useful odorants at roughly twenty "
                "carbons and in practice usually far fewer. The molecules "
                "of a perfume are chosen partly for what they smell like "
                "and partly for how fast they leave the skin - top, heart "
                "and base notes are, among other things, a dispersion "
                "gradient."
            ),
        ),
        ReadingSection(
            id="dispersion-in-the-lab",
            heading="What dispersion buys you on the bench",
            body=(
                "Dispersion is not only an explanation for tabulated data; "
                "it is the working principle behind separations you will "
                "perform. Fractional distillation of a hydrocarbon mixture "
                "separates on boiling point, which for hydrocarbons is "
                "dispersion and nothing else, so a distillation column is "
                "in effect sorting molecules by electron count and shape. "
                "The petroleum industry is a very large application of the "
                "content of this node.\n\n"
                "Chromatography is the more sensitive version. In a "
                "reversed-phase column the stationary phase is a nonpolar "
                "hydrocarbon layer bonded to silica, and a solute is "
                "retained in proportion to how much dispersion contact it "
                "can make with that layer. Longer and less branched "
                "nonpolar solutes are retained longer; polar solutes elute "
                "early because they prefer the polar mobile phase. Gas "
                "chromatography on a nonpolar stationary phase does the "
                "same job in the vapour phase and separates a homologous "
                "series almost perfectly in order of carbon number. When a "
                "chromatogram of an alkane mixture comes off the "
                "instrument in a neat ascending ladder of peaks, what you "
                "are looking at is a plot of dispersion strength against "
                "chain length, measured one molecule at a time."
            ),
        ),
        ReadingSection(
            id="biology",
            heading="Dispersion where it is doing the most work",
            body=(
                "The largest structures in biology that are held together "
                "without covalent bonds are held substantially by "
                "dispersion. A lipid bilayer is two sheets of fatty acyl "
                "chains packed tail to tail, and the cohesion of that "
                "interior is dispersion between chains sixteen to eighteen "
                "carbons long - the same interaction, and the same "
                "chain-length arithmetic, as the paraffin candle. Membrane "
                "fluidity is tuned by chain length and by the cis double "
                "bonds that kink a chain and spoil its packing, which is a "
                "contact-area argument in exactly the form this node "
                "developed.\n\n"
                "Inside a folded protein, the buried core is a mass of "
                "nonpolar side chains - leucine, isoleucine, valine, "
                "phenylalanine - in van der Waals contact with one another, "
                "and the tight complementarity of that packing is a "
                "substantial part of what makes one fold more stable than "
                "another. Between the stacked base pairs of DNA, the "
                "aromatic faces are separated by about 3.4 angstroms, "
                "roughly the sum of two carbon van der Waals radii, and the "
                "stacking interaction between them contributes as much to "
                "duplex stability as the hydrogen bonds that get the "
                "credit. Dispersion is weak per contact and pervasive by "
                "the million; the structures it stabilises are the "
                "structures that matter most."
            ),
        ),
        ReadingSection(
            id="polymers",
            heading="The same interaction, scaled to a material",
            body=(
                "Push the chain-length argument far enough and it stops "
                "describing a compound and starts describing a material. "
                "Polyethylene is nothing but an alkane whose chain runs to "
                "thousands of carbons; chemically it is as dull as hexane, "
                "and physically it is a plastic bag or a milk bottle. The "
                "difference is entirely the dispersion accumulated along "
                "chains long enough that separating two of them means "
                "breaking thousands of contacts at once.\n\n"
                "The polymer industry then tunes the material with the "
                "shape variable from earlier in this node. High-density "
                "polyethylene has few branches, so its chains lie close and "
                "make contact along their length; it is stiff, dense, "
                "higher-melting and used for bottles and pipes. "
                "Low-density polyethylene carries frequent short branches "
                "that hold neighbouring chains apart, reducing contact and "
                "leaving a softer, floppier, lower-melting material - the "
                "film in a plastic bag. Two products with the same "
                "repeating unit and the same chemistry, whose different "
                "properties come from the contact-area argument that "
                "explained pentane against neopentane. Nothing in this "
                "node's physics changed on the way from a five-carbon "
                "boiling point to an industrial polymer; only the number of "
                "contacts did."
            ),
        ),
        ReadingSection(
            id="common-errors",
            heading="Four ways this node is misapplied",
            body=(
                "First, ranking by molecular mass instead of electron "
                "count and shape. Mass is a serviceable proxy inside a "
                "homologous series and a poor one outside it; any question "
                "that mentions branching or isomers is testing exactly the "
                "case where mass fails. Second, treating dispersion as "
                "absent from polar molecules. Every molecule has it, and in "
                "a large polar molecule it may well be the largest single "
                "term.\n\n"
                "Third, asserting that a hydrogen-bonding compound always "
                "out-boils a nonpolar one. It does at comparable size, and "
                "it stops doing so once the nonpolar molecule is large "
                "enough: ethanol boils at 351.4 K but decane, which cannot "
                "hydrogen bond at all, boils at 447.3 K. Enough dispersion "
                "beats one hydrogen bond, which is the counting argument "
                "the first node promised. Fourth, forgetting that "
                "polarizability is a reactivity variable as well as a "
                "physical one. If you file it under boiling points and "
                "close the drawer, the nucleophilicity ordering of chapter "
                "9 - where iodide outperforms fluoride, and thiolate "
                "outperforms alkoxide - will arrive looking arbitrary, when "
                "in fact you already have its explanation."
            ),
        ),
        ReadingSection(
            id="summary-audit",
            heading="The two questions to ask of any structure",
            body=(
                "Reduced to working form, this node is two questions asked "
                "in order. How many electrons does the molecule have, and "
                "how loosely are they held? That is the polarizability "
                "question, answered by counting atoms and noting whether "
                "any of them are large and diffuse - a bromine or an "
                "iodine or a sulfur raises the answer sharply. Then: how "
                "much of the molecule's surface can touch a neighbour? That "
                "is the contact-area question, answered by looking at the "
                "drawing rather than the formula, and it is where branching, "
                "ring formation and flatness enter.\n\n"
                "The two are applied in that order because they are not "
                "equally powerful. A genuine difference in electron count "
                "usually dominates a difference in shape; shape decides "
                "cases that electron count leaves tied, which in practice "
                "means isomers. Every dispersion ranking in this course, "
                "and every dispersion ranking on an examination, is one of "
                "those two questions or the two of them in sequence. The "
                "next node changes the subject to a different variable "
                "entirely - whether the molecule has a permanent dipole at "
                "all, which turns out to be a question about symmetry that "
                "no amount of counting electrons can answer."
            ),
        ),
        ReadingSection(
            id="closing",
            heading="Why the weakest interaction gets its own node",
            body=(
                "It would be defensible to teach dispersion in a paragraph "
                "and move on to the interactions with larger numbers "
                "attached. This course does not, for a reason worth making "
                "explicit. Organic chemistry is overwhelmingly the "
                "chemistry of carbon and hydrogen frameworks, and those "
                "frameworks have no dipole and cannot hydrogen bond. For "
                "most of the mass of most organic molecules, dispersion is "
                "not one interaction among several; it is the only "
                "interaction there is.\n\n"
                "That is why a chapter on intermolecular forces spends its "
                "second node on the weakest of them. A student who "
                "understands dispersion can predict the physical behaviour "
                "of hydrocarbons, lipids, polymers, waxes and the nonpolar "
                "portions of every drug and every protein, which is to say "
                "most of the material world that organic chemistry "
                "describes. A student who has filed it under 'weak, "
                "therefore ignorable' will find the alkane series, the "
                "chromatography column, the membrane and the protein core "
                "each arriving as separate mysteries. Weak per contact, "
                "decisive in bulk: that sentence is the node, and the "
                "halogen figure is its proof.\n\n"
                "Carry two numbers forward as anchors. Roughly twenty-five "
                "kelvin of boiling point per added CH2 in a chain, and "
                "roughly ten to twenty-five kelvin lost to each branch that "
                "compacts a molecule of fixed formula. Those two "
                "quantities, applied in that order, answer most "
                "dispersion questions you will meet without any recourse "
                "to a data table at all."
            ),
        ),
    ),
    key_takeaways=(
        "Dispersion is the correlated attraction between instantaneous dipoles; it needs only electrons, so every molecule has it and no molecule can be without it.",
        "Its strength is set by polarizability (how many electrons and how loosely held - increases down a group) and by contact area (how much surface can touch).",
        "The halogens isolate it perfectly: no dipole, no hydrogen bonding, and boiling points from 85.0 K for F2 to 457.4 K for I2.",
        "Shape is the tie-break that formula cannot see: pentane 309.2 K, 2-methylbutane 300.9 K, neopentane 282.6 K - same C5H12, same electrons.",
        "Rank on size first, shape second. Branching lowers boiling point (less contact area) but often RAISES melting point (better packing).",
        "Polarizability is a reactivity variable too: it is why iodide beats fluoride as a nucleophile and why heavy halides are good leaving groups.",
    ),
    exam_tips=(
        "Any ranking question that supplies isomers is testing contact area, not mass. Look at the drawings and count branches.",
        "'Enough dispersion beats one hydrogen bond' is a genuine result, not a trick: decane (447.3 K) out-boils ethanol (351.4 K). Expect it as a distractor.",
        "When a stem mentions polarizability, soft nucleophiles or heavy halogens, it is asking a chapter-8 question inside a chapter-9 problem.",
    ),
))
# --------------------------------------------------------------------------
# 8.3 Permanent dipoles
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.DIPOLE",
    lead=(
        "Whether a molecule has a permanent dipole is the one question in "
        "this chapter that cannot be answered by counting anything. It is "
        "a geometry question: polar bonds are vectors, the molecular "
        "dipole is their sum, and a symmetric arrangement of strongly "
        "polar bonds sums to exactly zero. This node builds the vector "
        "arithmetic, shows what the resulting dipole is worth in boiling "
        "point once size is held constant, works through the symmetry "
        "cases that trap students on every examination, and follows the "
        "molecular dipole into the two places it does the most work: "
        "solvent behaviour and spectroscopy."
    ),
    sections=(
        ReadingSection(
            id="bond-to-molecule",
            heading="Two different claims that share a word",
            body=(
                "You already know what makes a bond polar. Two atoms of "
                "different electronegativity share a pair unequally, "
                "electron density shifts toward the more electronegative "
                "atom, and the bond carries a separation of charge - "
                "conventionally drawn as a partial negative on one end and "
                "a partial positive on the other, or as an arrow pointing "
                "toward the electronegative end. That is a BOND dipole, and "
                "it is a property of two atoms.\n\n"
                "A MOLECULAR dipole is a property of the whole structure, "
                "and it is the vector sum of every bond dipole in it, plus "
                "a contribution from lone pairs, which are themselves "
                "regions of displaced electron density. Because the sum is "
                "a vector sum, it depends on the directions the bonds point "
                "as much as on how polar they are, and vectors of equal "
                "size pointing in opposing directions cancel exactly. This "
                "is why 'does the molecule contain polar bonds' and 'is the "
                "molecule polar' are two separate questions with two "
                "separate answers, and why a student who answers the second "
                "by inspecting the first will be wrong about "
                "tetrachloromethane, carbon dioxide and every "
                "para-disubstituted benzene they meet. Draw the shape "
                "first. There is no shortcut past the geometry."
            ),
        ),
        ReadingSection(
            id="electronegativity-basis",
            heading="Which bonds are worth drawing an arrow on",
            body=(
                "Before summing anything you have to know which bonds "
                "carry a dipole large enough to matter, and that is an "
                "electronegativity question you met in chapter 1. The "
                "practical threshold used throughout this course is a "
                "difference of roughly 0.4 on the Pauling scale: below "
                "that, treat the bond as effectively nonpolar; between 0.4 "
                "and about 1.7, treat it as a polar covalent bond with a "
                "real dipole; above 1.7, expect ionic character rather "
                "than a bond dipole.\n\n"
                "Applied to organic chemistry the results are simple and "
                "worth having by heart. Carbon and hydrogen differ by only "
                "0.35, so C-H bonds are treated as nonpolar and are the "
                "reason hydrocarbon frameworks contribute nothing to a "
                "molecular dipole. Carbon-halogen bonds are all polar, and "
                "most polar for fluorine, whose electronegativity of 3.98 "
                "is the highest of any element. Carbon-oxygen and "
                "carbon-nitrogen bonds are polar, and the C=O bond is the "
                "most consequential polar bond in the course. Bonds between "
                "carbon and a metal, as in a Grignard reagent, are "
                "polarised the OTHER way, with carbon negative - which is "
                "the structural reason those reagents behave as carbanion "
                "sources, and a preview of chapter 9."
            ),
            table=Table(
                caption="Pauling electronegativities for the elements this "
                        "course uses most",
                columns=("Element", "Electronegativity",
                         "Difference from carbon"),
                rows=(
                    ("F", "3.98", "1.43"),
                    ("O", "3.44", "0.89"),
                    ("Cl", "3.16", "0.61"),
                    ("N", "3.04", "0.49"),
                    ("Br", "2.96", "0.41"),
                    ("C", "2.55", "0"),
                    ("I", "2.66", "0.11"),
                    ("S", "2.58", "0.03"),
                    ("H", "2.20", "0.35"),
                    ("Mg", "1.31", "1.24 (carbon negative)"),
                ),
                source=(
                    "Pauling-scale electronegativities as tabulated in "
                    + CRC
                ),
                note=(
                    "Differences are arithmetic from the tabulated values. "
                    "Note iodine and sulfur: barely different from carbon, "
                    "so C-I and C-S bonds are weakly polar despite the "
                    "atoms being large."
                ),
            ),
        ),
        ReadingSection(
            id="the-vector-sum",
            heading="Adding the vectors",
            figure=Figure(
                stem="org1-dipole-vectors",
                caption=(
                    "Bond dipoles laid tail to tail at each molecule's real "
                    "geometry, with the computed vector sum in colour: "
                    "linear and tetrahedral symmetry cancel, bent and "
                    "two-substituent geometries do not."
                ),
                alt=(
                    "Four vector-addition panels for carbon dioxide, water, "
                    "dichloromethane and tetrachloromethane, showing zero "
                    "resultants for the first and last and a large upward "
                    "resultant for the middle two."
                ),
            ),
            body=(
                "The procedure has three steps and no discretion in any of "
                "them. Draw the molecule with correct three-dimensional "
                "geometry, from VSEPR or from the hybridisation you learned "
                "in chapter 1. Put an arrow on each polar bond pointing "
                "toward the more electronegative atom, with a length "
                "reflecting how polar that bond is. Add the arrows as "
                "vectors. If the sum is zero, the molecule is nonpolar "
                "however polar its individual bonds; if the sum is nonzero, "
                "the molecule has a dipole in the direction of the sum.\n\n"
                "The figure runs the procedure on four cases. Carbon "
                "dioxide is linear, so its two C=O dipoles are 180 degrees "
                "apart and cancel exactly. Water is bent at 104.5 degrees, "
                "so its two O-H dipoles are 104.5 degrees apart, sum to a "
                "large resultant along the bisector, and give the measured "
                "1.85 D. Dichloromethane's two C-Cl bonds subtend the "
                "tetrahedral 109.5 degrees, again far from opposed, and the "
                "molecule has 1.60 D. Tetrachloromethane has four identical "
                "C-Cl dipoles arranged tetrahedrally, and a tetrahedron's "
                "four vertex vectors sum to zero by symmetry - the figure "
                "draws them from an honest projection of the real "
                "tetrahedron, so the cancellation is arithmetic rather than "
                "artistic licence. Four molecules, all with strongly polar "
                "bonds, two with no dipole at all."
            ),
        ),
        ReadingSection(
            id="the-debye",
            heading="The unit, and a sense of scale",
            body=(
                "Dipole moment is measured in debye, symbol D, a unit "
                "sized for exactly this job: one debye is close to the "
                "moment produced by separating one electronic charge by "
                "about 0.21 angstrom, so ordinary molecular dipoles come "
                "out as small numbers between zero and about four. That "
                "convenience is the whole reason the unit survives outside "
                "the SI system.\n\n"
                "Some anchors worth holding. A perfectly nonpolar molecule "
                "reads 0 D exactly: carbon dioxide, tetrachloromethane, "
                "benzene, and every homonuclear diatomic. Hydrocarbons read "
                "essentially zero, propane at 0.08 D being typical of the "
                "residual asymmetry a chain can have. Ethers and "
                "halogenoalkanes cluster between 1.2 and 2.0 D. Carbonyl "
                "compounds run higher, acetaldehyde at 2.75 D and acetone "
                "at 2.88 D, because the C=O bond is both very polar and "
                "unopposed. Nitriles are higher still, acetonitrile "
                "reaching 3.92 D, since the triple bond concentrates "
                "displaced density along a single axis. A useful rule of "
                "thumb: below about 0.5 D treat a molecule as nonpolar for "
                "predictive purposes, above about 2 D expect the dipole to "
                "matter to solubility and boiling point, and in between "
                "expect it to be a tie-break rather than a decider."
            ),
            table=Table(
                caption="Dipole moments across the common functional groups",
                columns=("Compound", "Dipole moment (D)", "Reading"),
                rows=(
                    ("tetrachloromethane, CCl4", "0",
                     "polar bonds, tetrahedral cancellation"),
                    ("carbon dioxide, CO2", "0",
                     "polar bonds, linear cancellation"),
                    ("propane", "0.08", "hydrocarbon, effectively nonpolar"),
                    ("dimethyl ether", "1.30", "bent at oxygen"),
                    ("chloromethane", "1.90", "one unopposed C-Cl"),
                    ("water", "1.85", "bent, two O-H plus lone pairs"),
                    ("acetaldehyde", "2.75", "unopposed C=O"),
                    ("acetone", "2.88", "C=O reinforced by two alkyls"),
                    ("acetonitrile", "3.92", "C-N triple bond along one axis"),
                ),
                source="Gas-phase dipole moments from " + CRC,
            ),
        ),
        ReadingSection(
            id="measuring-dipoles",
            heading="How anyone knows these numbers",
            body=(
                "A tabulated dipole moment is a measurement, and knowing "
                "roughly how it was made keeps you honest about what it "
                "means. The classical method exploits the fact that polar "
                "molecules align in an electric field: place a substance "
                "between the plates of a capacitor and its molecules "
                "partially orient, increasing the stored charge and hence "
                "the measured capacitance. Measuring that increase over a "
                "range of temperatures separates the permanent-dipole "
                "contribution, which weakens as thermal tumbling "
                "increases, from the induced-polarizability contribution, "
                "which does not.\n\n"
                "The modern and far more precise method is microwave "
                "rotational spectroscopy: an applied electric field splits "
                "a molecule's rotational energy levels by an amount that "
                "depends directly on its dipole moment, and the splitting "
                "can be measured to several significant figures. This is "
                "why careful tables give GAS-PHASE moments. In the gas "
                "phase a molecule is isolated and its dipole is its own; in "
                "a liquid, neighbouring molecules polarise one another and "
                "the effective moment is larger, sometimes by twenty per "
                "cent or more. When a table and a textbook disagree in the "
                "second decimal place, the phase is usually the reason, and "
                "for the comparisons this chapter makes the difference is "
                "immaterial."
            ),
        ),
        ReadingSection(
            id="group-moments",
            heading="Estimating a dipole without a measurement",
            body=(
                "Bond dipoles are approximately transferable between "
                "molecules, which makes rough estimation possible and is a "
                "useful check on an answer. A C-Cl bond contributes about "
                "1.5 D wherever it appears; a C-O single bond about 0.9 D; "
                "a C=O about 2.4 D; a C-N about 0.4 D. Add these as vectors "
                "at the molecule's real bond angles and the result usually "
                "lands within a few tenths of a debye of the measured "
                "value.\n\n"
                "Run it on dichloromethane as a check. Two C-Cl "
                "contributions of about 1.5 D each, separated by the "
                "tetrahedral 109.5 degrees, give a resultant of "
                "$2 \\times 1.5 \\times \\cos(54.75^{\\circ})$, which is "
                "about 1.7 D against a measured 1.60 D - close enough to "
                "confirm the geometry, and the small overestimate is the "
                "two opposing C-H bonds the estimate ignored. The value of "
                "the exercise is not the arithmetic but what it reveals: "
                "additivity works because the electron displacement in one "
                "bond is largely local, which is the same locality "
                "assumption behind the inductive-effect reasoning of "
                "chapter 3. Where additivity fails badly - in conjugated "
                "and aromatic systems, where displacement is delocalised "
                "across several bonds - that failure is itself diagnostic "
                "of delocalisation."
            ),
        ),
        ReadingSection(
            id="dipole-dipole",
            heading="What two dipoles do when they meet",
            body=(
                "Two molecules with permanent dipoles attract when they "
                "align positive end to negative end, and repel when they do "
                "not. In a solid, where molecules are fixed, they adopt the "
                "attractive arrangement and dipole-dipole attraction is at "
                "full strength. In a liquid or a gas, thermal motion is "
                "constantly reorienting them, so the molecules spend some "
                "of their time in unfavourable arrangements and the "
                "attraction is an average over all orientations weighted "
                "by their Boltzmann probabilities.\n\n"
                "That averaging has a consequence students rarely meet and "
                "which explains a discrepancy they often notice. A fixed "
                "pair of dipoles interacts as $1/r^3$, but once you average "
                "properly over thermal orientations the leading term "
                "becomes $1/r^6$ - the same distance dependence as "
                "dispersion. Dipole-dipole attraction in a liquid is "
                "therefore also a contact interaction, and it is weaker "
                "than the naive fixed-dipole calculation suggests. It also "
                "means the effect grows as temperature falls, since colder "
                "molecules tumble less and spend more time aligned. The "
                "practical upshot for this course is modest but worth "
                "stating: a permanent dipole helps, it helps less than its "
                "size on paper implies, and it is routinely outvoted by "
                "enough dispersion."
            ),
            important=(
                "Thermally averaged dipole-dipole attraction goes as "
                "$1/r^6$, not $1/r^3$. That is why a molecular dipole is "
                "worth much less in a warm liquid than the bare "
                "electrostatics predict, and why the boiling-point ladder "
                "puts it only one rung above dispersion."
            ),
        ),
        ReadingSection(
            id="dipole-evidence",
            heading="Isolating the dipole: four molecules of the same size",
            figure=Figure(
                stem="org1-dipole-bp-series",
                caption=(
                    "Four compounds of 41-46 g/mol, none a hydrogen-bond "
                    "donor: with dispersion nearly constant, boiling point "
                    "climbs 124 K with the permanent dipole."
                ),
                alt=(
                    "Boiling point plotted against dipole moment for "
                    "propane, dimethyl ether, acetaldehyde and "
                    "acetonitrile, rising from 231 K to 355 K."
                ),
            ),
            body=(
                "To see what a dipole is worth, hold everything else "
                "still. Propane, dimethyl ether, acetaldehyde and "
                "acetonitrile span 41 to 46 g/mol and have comparable "
                "electron counts, so their dispersion contributions are "
                "similar. None of the four has a hydrogen on nitrogen, "
                "oxygen or fluorine, so none can donate a hydrogen bond to "
                "another molecule of itself. The only variable left that "
                "matters is the permanent dipole, which runs 0.08, 1.30, "
                "2.75 and 3.92 D across the series.\n\n"
                "The boiling points follow: 231.0, 248.3, 293.3 and 354.8 "
                "K. That is 124 K bought by a dipole rising through four "
                "debye, and it is the honest measurement of what "
                "dipole-dipole attraction is worth in this size range. Two "
                "further readings are available from the same numbers. The "
                "spacing is not linear - the step from propane to the ether "
                "is 17 K while the step from acetaldehyde to acetonitrile "
                "is 62 K - because the interaction energy depends on the "
                "square of the dipole, so late increments cost more and buy "
                "more. And the whole 124 K is comfortably less than the "
                "216 K that separates methane from octane, which is "
                "dispersion doing its work over the same kind of range. "
                "Dipoles matter; dispersion, given enough carbons, matters "
                "more."
            ),
        ),
        ReadingSection(
            id="crystal-packing",
            heading="Dipoles in the solid, where nothing is tumbling",
            body=(
                "Everything said about thermal averaging applies to fluids. "
                "In a crystal the molecules are fixed, so they take up the "
                "arrangement that makes dipole-dipole attraction as "
                "favourable as possible - typically antiparallel columns, "
                "each molecule's positive end against its neighbour's "
                "negative end. Dipole-dipole attraction is therefore at "
                "something close to its full, unaveraged strength in the "
                "solid state, and it contributes more to melting point than "
                "the boiling-point ladder would lead you to expect.\n\n"
                "This produces one of the useful asymmetries of the "
                "chapter. A dipole that is worth a modest amount in the "
                "liquid can be worth considerably more in the crystal, "
                "provided the molecular shape allows the favourable "
                "packing to be adopted without other penalties. It is part "
                "of why polar solids are so often higher-melting than "
                "nonpolar solids of similar size, and why an added polar "
                "group is a standard medicinal-chemistry move for raising "
                "the melting point of a compound that will not "
                "crystallise. It also foreshadows the general rule of the "
                "next-but-one node: melting point answers to packing and "
                "orientation, boiling point to raw attraction, and the two "
                "columns of a data table need not agree."
            ),
        ),
        ReadingSection(
            id="symmetry-cases",
            heading="The symmetry cases, catalogued",
            body=(
                "Nearly every dipole question that traps students belongs "
                "to one of a small number of symmetric geometries, and "
                "learning them as a set is more efficient than rediscovering "
                "each. Linear AX2 with identical substituents cancels: "
                "carbon dioxide, carbon disulfide, beryllium chloride in "
                "the gas phase. Trigonal planar AX3 with three identical "
                "substituents cancels: boron trifluoride, and the "
                "sulfur trioxide molecule. Tetrahedral AX4 with four "
                "identical substituents cancels: methane, "
                "tetrachloromethane, tetrafluoromethane.\n\n"
                "Two more belong to the aromatic chapters ahead but are "
                "worth planting now. A benzene ring carrying two identical "
                "substituents in the para positions cancels, because the "
                "two substituent dipoles are exactly opposed across the "
                "ring - para-dichlorobenzene has a zero dipole while its "
                "ortho and meta isomers do not, and that difference is a "
                "standard examination question. And trans-1,2-disubstituted "
                "alkenes with identical substituents cancel while their cis "
                "isomers do not, which is why trans-1,2-dichloroethene has "
                "no dipole and the cis isomer has 1.90 D. In every one of "
                "these the failure mode is the same: the student counts "
                "electronegative atoms, finds several, and answers polar. "
                "The correct move is always to look for a symmetry element "
                "that maps each bond dipole onto an opposing partner."
            ),
        ),
        ReadingSection(
            id="carbonyl-dipole",
            heading="The one dipole that runs the second half of this course",
            body=(
                "Among all the polar bonds in organic chemistry the "
                "carbonyl C=O is the one to know in detail, because the "
                "whole of carbonyl chemistry is a consequence of its "
                "polarity. Oxygen is substantially more electronegative "
                "than carbon and the double bond puts a large amount of "
                "electron density between them, so the displacement is "
                "large: the C=O group contributes about 2.4 D, which is "
                "why acetaldehyde reaches 2.75 D and acetone 2.88 D in "
                "molecules that are otherwise ordinary hydrocarbons.\n\n"
                "Read the arrow's two ends separately, because each does "
                "different work. The oxygen end is electron-rich, carries "
                "lone pairs, and is therefore a hydrogen-bond acceptor and "
                "a site of protonation under acid catalysis. The carbon end "
                "is electron-poor, and that partial positive charge is "
                "precisely what makes carbonyl carbon the standard "
                "electrophile of organic chemistry - the site that "
                "nucleophiles attack in every addition, substitution and "
                "condensation reaction of the later chapters. The physical "
                "consequence (ketones and aldehydes boil well above "
                "hydrocarbons of the same size) and the chemical "
                "consequence (they are attacked at carbon by anything with "
                "a lone pair) are the same molecular fact described twice."
            ),
        ),
        ReadingSection(
            id="dipole-drives-reactivity",
            heading="From physical property to reactive site",
            body=(
                "The carbonyl is not the only case, and generalising it is "
                "the most valuable thing in this node. A bond dipole marks "
                "a molecule's reactive geography: the partial-positive end "
                "of a polar bond is where nucleophiles go, and the "
                "partial-negative end is where electrophiles and acids go. "
                "Every mechanism you will draw for the rest of the course "
                "starts by identifying those two ends.\n\n"
                "Read a few forward. In a haloalkane, C-X polarity leaves "
                "carbon partially positive, so a nucleophile attacks THAT "
                "carbon and the halide departs with the pair - the SN2 "
                "reaction that opens chapter 9, presented there as "
                "mechanism and here as electrostatics. In an alcohol, O-H "
                "polarity leaves the hydrogen exposed enough for a base to "
                "remove, which is what acidity means. In a Grignard "
                "reagent, the polarity is reversed and carbon is the "
                "negative end, so the carbon attacks - the same arrow "
                "logic, run backwards, which is exactly why organometallics "
                "feel strange when first met. The practical instruction is "
                "to annotate partial charges on every new functional group "
                "you meet before you try to learn its reactions. Half of "
                "the reactions will then be predictable rather than "
                "memorable."
            ),
        ),
        ReadingSection(
            id="lone-pairs",
            heading="The contribution the bond arrows miss",
            body=(
                "Adding bond dipoles alone is a good approximation and "
                "occasionally an insufficient one, because a lone pair is "
                "itself a region of displaced electron density and "
                "contributes to the molecular dipole. In water and ammonia "
                "the lone pairs point away from the hydrogens, so their "
                "contribution REINFORCES the bond dipoles and the observed "
                "moments - 1.85 D and 1.47 D - are larger than a "
                "bond-arrows-only estimate would give.\n\n"
                "The instructive case is nitrogen trifluoride against "
                "ammonia. In ammonia the N-H bond dipoles point toward "
                "nitrogen, the same direction as the lone pair, and they "
                "add: 1.47 D. In nitrogen trifluoride the N-F bond dipoles "
                "point AWAY from nitrogen, toward the more electronegative "
                "fluorines, and therefore oppose the lone-pair "
                "contribution; the two largely cancel and NF3 has a "
                "moment of only 0.24 D despite three of the most polar "
                "single bonds available. Same pyramidal geometry, six times "
                "the difference in dipole, and no bond-counting argument "
                "reaches it. The lesson is not that you must quantify lone "
                "pairs, but that when a molecule with obviously polar bonds "
                "turns out to have a surprisingly small measured moment, an "
                "opposing lone pair is the usual explanation."
            ),
            table=Table(
                caption="When lone pairs add and when they subtract",
                columns=("Molecule", "Geometry", "Dipole moment (D)"),
                rows=(
                    ("NH3", "pyramidal, bond dipoles toward N", "1.47"),
                    ("NF3", "pyramidal, bond dipoles away from N", "0.24"),
                    ("H2O", "bent, bond dipoles toward O", "1.85"),
                    ("CH4", "tetrahedral, symmetric", "0"),
                ),
                source="Gas-phase dipole moments from " + CRC,
            ),
        ),
        ReadingSection(
            id="conformation",
            heading="A dipole that depends on which conformation you are in",
            body=(
                "One subtlety separates a careful answer from a merely "
                "correct-looking one. A molecule's dipole is a vector sum "
                "over its current geometry, and molecules with rotatable "
                "bonds have more than one geometry available. "
                "1,2-Dichloroethane is the standard illustration. In the "
                "anti conformation the two C-Cl dipoles are opposed and the "
                "molecule has no net moment; in either gauche conformation "
                "they are 60 degrees apart and it has a substantial one.\n\n"
                "What is measured on a bulk sample is therefore a "
                "population-weighted average over conformations, and it "
                "changes with temperature and with solvent, because those "
                "change the conformational populations. This is not an "
                "exotic complication: it is the same conformational "
                "analysis of chapter 2 showing up in a physical property, "
                "and it is the reason careful tables specify the phase and "
                "temperature at which a dipole moment was measured. For "
                "examination purposes, if a question about a flexible "
                "molecule expects a single answer it is asking about the "
                "dominant conformation, and for most acyclic cases that is "
                "the anti one. But the honest statement is that a flexible "
                "molecule does not have a dipole moment so much as a "
                "distribution of them."
            ),
        ),
        ReadingSection(
            id="solvent-consequences",
            heading="Why a solvent's dipole is not the whole of its polarity",
            body=(
                "The molecular dipole is the first thing people reach for "
                "when classifying a solvent, and it is only part of the "
                "story. The bulk property that governs how well a medium "
                "screens two charges from each other is the dielectric "
                "constant, and while it correlates with molecular dipole it "
                "is not the same quantity: it also reflects how the "
                "molecules order around a charge and how polarizable they "
                "are.\n\n"
                "The mismatches are instructive. Acetonitrile has a larger "
                "molecular dipole than water - 3.92 D against 1.85 - and "
                "yet water's dielectric constant of 78.4 dwarfs "
                "acetonitrile's 37.5, because water's hydrogen-bonded "
                "network lets it organise around an ion in a way "
                "acetonitrile cannot. Conversely, hexane has neither dipole "
                "nor dielectric constant to speak of, and is nonpolar on "
                "every measure. For predicting solubility and reaction rate "
                "in chapter 9, the dielectric constant and the "
                "protic-or-aprotic distinction will do more work than the "
                "molecular dipole. Keep the dipole for what it is good at - "
                "predicting whether an individual molecule has "
                "dipole-dipole attractions available and roughly how strong "
                "they are - and hand bulk questions to the bulk property."
            ),
        ),
        ReadingSection(
            id="dipole-and-miscibility",
            heading="What a dipole is worth for mixing",
            body=(
                "Boiling point measures how strongly a substance holds "
                "ITSELF together; miscibility asks whether it would rather "
                "hold something else, and the molecular dipole enters that "
                "question differently. Two polar liquids generally mix "
                "well, because each can offer the other the dipole-dipole "
                "attractions it is giving up. A polar liquid and a nonpolar "
                "one mix poorly, because separating the polar molecules "
                "from each other costs dipole-dipole attraction that the "
                "nonpolar partner cannot repay - only dispersion is on "
                "offer in return.\n\n"
                "Acetone is the useful demonstration, because it is polar "
                "at 2.88 D, has a substantial hydrocarbon portion, and "
                "accepts hydrogen bonds without donating any. It is fully "
                "miscible with water, whose donors it can accept from, and "
                "also fully miscible with hexane, whose dispersion its "
                "methyls can match. A solvent that dissolves both classes "
                "is enormously useful for washing glassware and for "
                "reactions with mismatched partners, and acetone's "
                "double miscibility is the reason it sits in every "
                "laboratory. It is also the first hint that solubility "
                "needs a richer account than a single dipole number can "
                "give - the account the solubility node develops in terms "
                "of free energy and of matched interaction types."
            ),
        ),
        ReadingSection(
            id="spectroscopy",
            heading="Where the dipole becomes an observable",
            body=(
                "Molecular dipoles are not only an explanation for "
                "boiling points; they are what makes infrared spectroscopy "
                "work, which makes this node quietly foundational for the "
                "spectroscopy chapters. A vibration absorbs infrared "
                "radiation only if it CHANGES the molecule's dipole moment, "
                "because it is that oscillating dipole that couples to the "
                "oscillating electric field of the light.\n\n"
                "The selection rule has visible consequences. The C=O "
                "stretch of a ketone changes a large dipole substantially "
                "and is one of the most intense absorptions in organic "
                "infrared spectroscopy - the peak near 1715 wavenumbers "
                "that identifies a carbonyl at a glance. The symmetric "
                "stretch of carbon dioxide, in which both oxygens move out "
                "together, keeps the dipole at zero throughout and is "
                "infrared-INACTIVE, while the asymmetric stretch and the "
                "bend both create a transient dipole and are active - which "
                "is, incidentally, why carbon dioxide is a greenhouse gas "
                "at all. A carbon-carbon double bond in a symmetrically "
                "substituted alkene gives a weak or absent absorption for "
                "the same reason. When you later read an infrared spectrum "
                "and reason from the ABSENCE of a peak, the reasoning you "
                "are using is this node's."
            ),
        ),
        ReadingSection(
            id="worked-symmetry",
            heading="Worked example: four judgements in sequence",
            body=(
                "Decide whether each of the following is polar: "
                "trichloromethane CHCl3, tetrafluoromethane CF4, "
                "cis-1,2-dichloroethene, and para-xylene. Take them in "
                "turn. Trichloromethane is tetrahedral but not symmetric - "
                "three C-Cl dipoles and one C-H, and the C-H does not "
                "oppose the chlorines with anything like equal magnitude. "
                "The three chlorine dipoles have a resultant pointing away "
                "from the hydrogen, and the molecule is polar at 1.04 D. "
                "Tetrafluoromethane has four identical bonds tetrahedrally "
                "arranged: sum zero, nonpolar, despite C-F being the most "
                "polar single bond in this book.\n\n"
                "cis-1,2-Dichloroethene has both chlorines on the same side "
                "of the double bond, so their dipoles have a common "
                "component perpendicular to the C=C and reinforce; the "
                "molecule is polar at 1.90 D, and its trans isomer, with "
                "the chlorines opposed, is not polar at all - a "
                "measurable, tabulated difference between two compounds of "
                "identical formula. para-Xylene carries two methyls "
                "directly across the ring; methyl is only weakly "
                "electron-releasing, and the two weak dipoles are exactly "
                "opposed, so the molecule is nonpolar. Notice that not one "
                "of these four was decided by counting electronegative "
                "atoms, and two of them would have been answered wrongly if "
                "it had been."
            ),
        ),
        ReadingSection(
            id="common-errors-dipole",
            heading="The three failure modes",
            body=(
                "The first and largest is answering from the atoms. If the "
                "reasoning in your head is 'it has chlorines, so it is "
                "polar', it will fail on tetrachloromethane, on "
                "trans-1,2-dichloroethene and on para-dichlorobenzene, all "
                "of which are standard examination material. The remedy is "
                "mechanical: draw the geometry before answering, every "
                "time, even when the answer seems obvious.\n\n"
                "The second is confusing the three senses of 'polar' that "
                "the first node warned about - polar bond, polar molecule, "
                "polar solvent. A question asking which molecule is more "
                "polar wants the vector sum; a question asking which "
                "solvent is more polar usually wants the dielectric "
                "constant, and the two orderings can differ. The third is "
                "ranking a dipole above dispersion without checking sizes. "
                "The dipole node has just measured what a dipole is worth - "
                "124 K across four debye at constant size - and the "
                "dispersion node measured what carbons are worth, at "
                "roughly twenty-five kelvin each. Four extra carbons "
                "therefore compete with a four-debye dipole, and any "
                "comparison between molecules of substantially different "
                "size has to do that arithmetic rather than apply the "
                "ladder blindly."
            ),
        ),
        ReadingSection(
            id="closing-dipole",
            heading="What the next node adds",
            body=(
                "Two of the three working interactions are now built. "
                "Dispersion is universal, grows with polarizability and "
                "contact area, and accumulates without limit. "
                "Dipole-dipole requires a surviving vector sum, is worth "
                "somewhat more per interaction than dispersion, and is "
                "decided by geometry rather than by composition. Between "
                "them they account for the physical behaviour of "
                "hydrocarbons, halogenoalkanes, ethers, ketones, esters and "
                "nitriles - most of the compound classes in this course.\n\n"
                "What they cannot account for is water. Two dipoles of "
                "1.85 D in a molecule of eighteen daltons should give "
                "something that boils well below room temperature; water "
                "boils at 373.1 K, more than 160 K above the value its size "
                "and dipole predict, and the anomaly is far too large to "
                "absorb into the arguments made so far. The next node takes "
                "that discrepancy as its starting point, shows that it "
                "appears in a precise and narrow set of compounds, extracts "
                "the structural condition those compounds share, and "
                "follows the resulting interaction from the boiling point "
                "of water to the double helix. It is the most consequential "
                "twenty kilojoules per mole in chemistry.\n\n"
                "Before turning the page, make sure the habit from this "
                "node is installed, because the next one assumes it: given "
                "any structure, you should be drawing the geometry and "
                "summing the arrows before you form an opinion about "
                "polarity. Everything that follows in the chapter is built "
                "on that judgement being reliable."
            ),
        ),
    ),
    key_takeaways=(
        "A polar bond is an electronegativity difference; a polar molecule is a nonzero VECTOR SUM of bond dipoles plus lone-pair contributions. Draw the geometry before answering.",
        "Symmetric geometries cancel exactly: linear AX2, trigonal planar AX3, tetrahedral AX4, para-disubstituted benzenes, trans-1,2-disubstituted alkenes.",
        "Dipole moments in debye: hydrocarbons ~0, ethers and haloalkanes 1.2-2.0, carbonyls 2.7-2.9, nitriles ~3.9. Below 0.5 D treat as nonpolar.",
        "At constant size, four debye of dipole buys about 124 K of boiling point (propane 231.0 K to acetonitrile 354.8 K) - real, but less than eight carbons of dispersion.",
        "Thermal tumbling averages dipole-dipole attraction to 1/r^6, the same reach as dispersion, so it is worth less in a warm liquid than the bare electrostatics suggest.",
        "Lone pairs contribute: NH3 reads 1.47 D because they reinforce the bond dipoles, NF3 only 0.24 D because they oppose them.",
    ),
    exam_tips=(
        "CCl4, CO2, BF3, para-dichlorobenzene and trans-1,2-dichloroethene are the five standard 'polar bonds, no molecular dipole' traps. Recognise them on sight.",
        "Infrared activity requires a CHANGING dipole moment. The symmetric stretch of CO2 and the C=C of a symmetric alkene are the classic inactive vibrations.",
        "If asked which solvent is more polar, check whether the question wants molecular dipole or dielectric constant - acetonitrile beats water on the first and loses badly on the second.",
    ),
))
# --------------------------------------------------------------------------
# 8.4 Hydrogen bonding
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.HBONDING",
    lead=(
        "Hydrogen bonding is worth ten to forty kilojoules per mole, "
        "which is a small number, and it is nevertheless the reason "
        "oceans are liquid, proteins fold, DNA replicates and ice "
        "floats. This node earns that claim rather than asserting it: it "
        "starts from a discrepancy in the boiling points of the binary "
        "hydrides that no argument from size or dipole can absorb, "
        "extracts from that anomaly the precise structural condition an "
        "interaction must satisfy to qualify, measures its geometry and "
        "directionality, and then follows the consequences from a "
        "distillation flask to a double helix."
    ),
    sections=(
        ReadingSection(
            id="the-anomaly",
            heading="Four series, three of which break",
            figure=Figure(
                stem="org1-hydride-bp-anomaly",
                caption=(
                    "Boiling points of the binary hydrides by period. The "
                    "carbon series rises smoothly with size; the nitrogen, "
                    "oxygen and fluorine series each begin with a member "
                    "far above where the trend puts it."
                ),
                alt=(
                    "Four line series of boiling point against period, with "
                    "water, hydrogen fluoride and ammonia sitting far above "
                    "the extrapolated trends and methane sitting on its "
                    "trend."
                ),
            ),
            body=(
                "Take the simple hydrides of groups 14 through 17 and plot "
                "boiling point against period. The previous node's "
                "arguments predict a smooth rise in each series, because "
                "the central atom gets larger, its electron count rises and "
                "dispersion strengthens. The carbon series does exactly "
                "that: methane 111.7 K, silane 161.3, germane 184.7, "
                "stannane 221.0 - four points on a line.\n\n"
                "The other three series do not. Ammonia boils at 239.8 K "
                "when phosphine, its larger successor, manages only 185.4. "
                "Hydrogen fluoride boils at 292.7 K against hydrogen "
                "chloride's 188.1. And water, which by extrapolation from "
                "hydrogen sulfide, selenide and telluride should boil "
                "somewhere near 200 K, boils at 373.1 - roughly 170 K above "
                "the prediction. These are not small deviations to be "
                "waved away as measurement scatter; they are the largest "
                "systematic discrepancies in the chapter, they appear only "
                "in the first member of a series, and they appear only in "
                "the series whose central atom is nitrogen, oxygen or "
                "fluorine. Something is available to those three and to "
                "nothing else, and it is worth well over a hundred kelvin."
            ),
            table=Table(
                caption="Binary hydride boiling points (K), by period",
                columns=("Group", "Period 2", "Period 3", "Period 4",
                         "Period 5"),
                rows=(
                    ("14 (CH4 ...)", "111.7", "161.3", "184.7", "221.0"),
                    ("15 (NH3 ...)", "239.8", "185.4", "210.7", "254.8"),
                    ("16 (H2O ...)", "373.1", "212.9", "231.9", "271.0"),
                    ("17 (HF ...)", "292.7", "188.1", "206.4", "237.8"),
                ),
                source="Boiling points at 1 atm from " + CRC,
                note=(
                    "Read across each row: only group 14 rises "
                    "monotonically. In the other three the period-2 member "
                    "is anomalously high and the period-3 member is the "
                    "series minimum."
                ),
            ),
        ),
        ReadingSection(
            id="the-condition",
            heading="Extracting the condition from the evidence",
            body=(
                "What do nitrogen, oxygen and fluorine share that carbon, "
                "phosphorus and sulfur do not? Two things, and both are "
                "required. They are the three most electronegative "
                "practical elements, so a hydrogen bonded to any of them "
                "has most of its electron density pulled away, leaving "
                "something very close to a bare proton - a concentrated "
                "positive charge with no core electrons of its own to "
                "shield it. And they are small, so that charge is "
                "concentrated in a tiny volume rather than smeared over a "
                "large atom.\n\n"
                "The second half of the condition is that a partner must be "
                "able to receive it. A bare proton attracts electron "
                "density, and the density on offer is a lone pair - again "
                "most effectively from a small, electronegative atom, "
                "because its lone pair is compact and localised rather than "
                "diffuse. Putting the two halves together gives the "
                "definition this course uses. A hydrogen bond requires a "
                "DONOR, meaning a hydrogen covalently bonded to nitrogen, "
                "oxygen or fluorine, and an ACCEPTOR, meaning a lone pair "
                "on nitrogen, oxygen or fluorine. Both are needed. A "
                "molecule with a donor and no available acceptor cannot "
                "hydrogen bond, and neither can one with an acceptor and no "
                "donor - which is the single most productive fact in this "
                "node."
            ),
            important=(
                "Sulfur illustrates why size matters as much as "
                "electronegativity. It is nearly as electronegative as "
                "carbon is different from hydrogen, but it is large and its "
                "lone pairs are diffuse, so S-H hydrogen bonding is very "
                "weak. Hydrogen sulfide boils 160 K below water despite "
                "being the heavier molecule."
            ),
        ),
        ReadingSection(
            id="nature-of-the-interaction",
            heading="Is it really just electrostatics?",
            body=(
                "The account given so far treats the hydrogen bond as pure "
                "electrostatics: a concentrated positive charge attracted "
                "to a lone pair. That account predicts the trends "
                "correctly and is the right working model for this course. "
                "It is, however, not quite the whole physics, and the "
                "shortfall is worth knowing because it explains features "
                "that pure electrostatics cannot.\n\n"
                "Detailed analysis finds three contributions. The largest "
                "is indeed electrostatic attraction. A second is "
                "polarisation: the acceptor's field distorts the donor and "
                "vice versa, which is the induction term of the first "
                "node. The third, and the one a purely electrostatic model "
                "misses, is a small amount of genuine CHARGE TRANSFER - a "
                "partial donation of the acceptor's lone pair into the "
                "antibonding orbital of the donor's covalent bond. That "
                "third term explains two observations at once: why the "
                "interaction is so much more directional than a simple "
                "charge attraction would be, since orbital overlap depends "
                "on angle far more sharply than electrostatics does; and "
                "why the covalent donor bond WEAKENS and its infrared "
                "stretch shifts to lower frequency, since populating an "
                "antibonding orbital is exactly what weakening a bond "
                "means. Hydrogen bonding sits, honestly, a little way along "
                "the road from a contact toward a bond."
            ),
        ),
        ReadingSection(
            id="donor-acceptor-audit",
            heading="Auditing a structure for donors and acceptors",
            body=(
                "The audit is quick once the categories are clear. Count "
                "donors: every hydrogen drawn on a nitrogen, an oxygen or a "
                "fluorine, and no others. A hydrogen on carbon is never a "
                "donor, however many there are and however "
                "electron-poor the carbon. Count acceptors: every lone pair "
                "on nitrogen, oxygen or fluorine, which in practice means "
                "counting those atoms and remembering that a carbonyl "
                "oxygen carries two and an ether oxygen two.\n\n"
                "The four possible outcomes each have a characteristic "
                "physical signature. Both donor and acceptor - alcohols, "
                "amines, carboxylic acids, water, amides - gives a "
                "self-associating liquid with an anomalously high boiling "
                "point, because every molecule can bond to several "
                "neighbours and a network forms. Acceptor only - ethers, "
                "ketones, aldehydes, esters, nitriles, tertiary amines - "
                "gives a liquid with NO self-hydrogen-bonding at all, "
                "boiling much lower, but which is still fully able to "
                "hydrogen bond to water and therefore often water-soluble. "
                "Donor only is rare in organic chemistry, since the "
                "elements that donate also carry lone pairs. Neither - "
                "hydrocarbons, haloalkanes - leaves dispersion and dipole "
                "alone. Classify a compound into those four boxes and most "
                "of its physical behaviour follows."
            ),
        ),
        ReadingSection(
            id="the-isomer-pair",
            heading="One hydrogen, moved: ethanol against dimethyl ether",
            body=(
                "The cleanest demonstration compares two compounds with "
                "the same molecular formula, so that dispersion is "
                "necessarily identical. Ethanol and dimethyl ether are both "
                "C2H6O: same mass, same electron count, same "
                "polarizability. Ethanol has its hydrogen on the oxygen, so "
                "it is a donor and an acceptor and hydrogen bonds to its "
                "own kind. Dimethyl ether has both hydrogens' worth of "
                "carbon on either side of the oxygen; it has lone pairs and "
                "is a perfectly good acceptor, but with no donor anywhere "
                "in the sample there is nothing for those lone pairs to "
                "accept.\n\n"
                "Ethanol boils at 351.4 K and dimethyl ether at 248.3 K, a "
                "gap of 103 K attributable to one hydrogen sitting in a "
                "different place. That is the number to remember for what "
                "hydrogen bonding is worth in a small organic molecule, and "
                "it dwarfs the 26.6 K that shape was worth in the pentanes "
                "and the 17 K that a 1.2 D dipole was worth between propane "
                "and dimethyl ether. The comparison also exposes the "
                "most common misreading in the chapter: dimethyl ether "
                "contains oxygen, and students who have learned 'oxygen "
                "means hydrogen bonding' predict it should boil high. "
                "Oxygen means ACCEPTOR. Donation is a separate requirement "
                "and it must be checked separately."
            ),
            table=Table(
                caption="Same formula, one hydrogen relocated",
                columns=("Compound", "Donor?", "Acceptor?",
                         "Boiling point (K)"),
                rows=(
                    ("ethanol, CH3CH2OH", "yes (O-H)", "yes", "351.4"),
                    ("dimethyl ether, CH3OCH3", "no", "yes", "248.3"),
                    ("propane, CH3CH2CH3", "no", "no", "231.1"),
                ),
                source="Boiling points at 1 atm from " + CRC,
                note=(
                    "Propane is included as the baseline: it shows how much "
                    "of the ether's boiling point is its dipole and how "
                    "much of the alcohol's is hydrogen bonding."
                ),
            ),
        ),
        ReadingSection(
            id="geometry",
            heading="The geometry, and why it is directional",
            figure=Figure(
                stem="org1-hbond-geometry",
                caption=(
                    "Left: the geometry of a water-water hydrogen bond, "
                    "with the covalent O-H at 0.97 angstrom and the "
                    "hydrogen bond at 1.80. Right: the angular factor, "
                    "halved by 45 degrees off the linear arrangement."
                ),
                alt=(
                    "Diagram of donor, hydrogen and acceptor in a line with "
                    "marked distances, beside a curve of relative strength "
                    "against deviation from linearity."
                ),
            ),
            body=(
                "A hydrogen bond has a characteristic and measurable "
                "geometry. In water the covalent O-H bond is about 0.97 "
                "angstrom; the hydrogen bond from that hydrogen to a "
                "neighbouring oxygen is about 1.80 angstrom, giving an "
                "oxygen-to-oxygen separation near 2.77 angstrom. Compare "
                "the hydrogen-bond distance with the sum of the hydrogen "
                "and oxygen van der Waals radii, about 2.6 angstrom: the "
                "hydrogen bond is substantially SHORTER than a mere contact "
                "would be, which is direct structural evidence that it is a "
                "genuine attraction and not simply two molecules being "
                "nearby.\n\n"
                "It is also strongly directional. The interaction is "
                "strongest when donor, hydrogen and acceptor lone pair are "
                "collinear, and it weakens as the arrangement bends, "
                "roughly with the square of the cosine of the deviation - "
                "so a bond that is 45 degrees off line retains only about "
                "half its strength and one at 90 degrees essentially none. "
                "That directionality is the property that makes hydrogen "
                "bonding a structure-BUILDING interaction. Dispersion holds "
                "molecules together without caring how they are turned, and "
                "produces liquids and amorphous solids. Only a directional "
                "interaction can specify an arrangement, and every precise "
                "biological structure - the alpha helix, the beta sheet, "
                "the double helix, the tetrahedral lattice of ice - is "
                "specified by hydrogen bonds."
            ),
        ),
        ReadingSection(
            id="water",
            heading="What the network does to water",
            body=(
                "Water is the extreme case because of a coincidence of "
                "counting: it has two donors, the two O-H hydrogens, and "
                "two acceptors, the two lone pairs on oxygen. Donors and "
                "acceptors are perfectly matched, so every water molecule "
                "can participate in four hydrogen bonds at once, and in "
                "liquid water at room temperature each molecule averages "
                "something close to that. No other small molecule achieves "
                "such a ratio: ammonia has three donors and one acceptor, "
                "hydrogen fluoride one donor and three acceptors, and both "
                "are therefore limited by the scarcer partner.\n\n"
                "The consequences run through the chemistry of the planet. "
                "Water's boiling point of 373.1 K is what keeps oceans "
                "liquid across the terrestrial temperature range. Its "
                "specific heat capacity is unusually high, because warming "
                "it means breaking hydrogen bonds as well as speeding "
                "molecules up, and that thermal inertia moderates climate. "
                "Its enthalpy of vaporisation is large, which is what makes "
                "sweating an effective way to shed heat. And its solid form "
                "is LESS dense than its liquid, because the four "
                "directional bonds force an open tetrahedral lattice with "
                "space in it - so ice floats, lakes freeze from the top "
                "down, and aquatic life survives winters. Directionality "
                "produced that last one: a nondirectional attraction would "
                "have packed the solid densely, as almost every other "
                "substance does."
            ),
        ),
        ReadingSection(
            id="polyols",
            heading="Counting the groups: what several hydroxyls do",
            body=(
                "If one hydroxyl is worth about a hundred kelvin of "
                "boiling point, two should be worth appreciably more, and "
                "they are - with a second effect arriving alongside. "
                "Ethane-1,2-diol, universally called ethylene glycol, has "
                "two hydroxyls on two carbons and boils at 470.5 K, some "
                "119 K above ethanol despite being only one carbon "
                "larger. Propane-1,2,3-triol, glycerol, has three hydroxyls "
                "on three carbons and boils at 563 K.\n\n"
                "The second effect is viscosity. Each molecule of glycerol "
                "can hold on to several neighbours at once, so the liquid "
                "is not merely cohesive but tangled: molecules cannot slide "
                "past one another without breaking and remaking bonds, and "
                "glycerol pours like syrup while ethanol pours like water. "
                "The same arithmetic governs the sugars, which carry a "
                "hydroxyl on nearly every carbon and are consequently "
                "high-melting crystalline solids, freely water-soluble, and "
                "form viscous syrups rather than mobile liquids. It also "
                "explains why glycols make good antifreeze and good "
                "humectants: a compound with several donors and acceptors "
                "binds water tightly and disrupts its crystallisation. "
                "Count the hydroxyls, and both the boiling point and the "
                "texture of a substance become predictable."
            ),
            table=Table(
                caption="Adding hydroxyls to a two- or three-carbon chain",
                columns=("Compound", "Hydroxyls", "Boiling point (K)"),
                rows=(
                    ("ethane", "0", "184.6"),
                    ("ethanol", "1", "351.4"),
                    ("ethane-1,2-diol", "2", "470.5"),
                    ("propane-1,2,3-triol (glycerol)", "3", "563"),
                ),
                source="Boiling points at 1 atm from " + CRC,
                note=(
                    "Glycerol's value is the extrapolated atmospheric "
                    "boiling point; it decomposes appreciably before "
                    "reaching it, as heavily hydrogen-bonded liquids "
                    "commonly do."
                ),
            ),
        ),
        ReadingSection(
            id="intramolecular",
            heading="When a molecule bonds to itself instead",
            body=(
                "A hydrogen bond does not have to join two molecules. When "
                "a donor and an acceptor within the same molecule can reach "
                "each other with acceptable geometry - usually forming a "
                "five- or six-membered ring including the hydrogen - an "
                "INTRAmolecular hydrogen bond forms, and its consequences "
                "are the opposite of the intermolecular case.\n\n"
                "The standard pair is the nitrophenols. In "
                "2-nitrophenol the hydroxyl hydrogen sits within reach of "
                "an oxygen of the adjacent nitro group and bonds to it "
                "internally; that hydrogen is then unavailable to bond to a "
                "neighbouring molecule, so the compound behaves as though "
                "it had no donor at all. In 4-nitrophenol the two groups "
                "are across the ring and cannot reach, so every molecule "
                "donates to its neighbours and an extensive intermolecular "
                "network forms. The measured melting points make the point "
                "starkly: 2-nitrophenol melts at 318 K and 4-nitrophenol at "
                "386 K, and the ortho isomer is also the more volatile and "
                "the more soluble in nonpolar solvents. Same formula, same "
                "groups, and a 68 K difference produced entirely by whether "
                "the hydrogen bond points inward or outward. Always ask "
                "which it is; the answer inverts the prediction."
            ),
            table=Table(
                caption="The nitrophenols: inward or outward",
                columns=("Compound", "Hydrogen bonding", "Melting point (K)"),
                rows=(
                    ("2-nitrophenol", "intramolecular, six-membered", "318"),
                    ("4-nitrophenol", "intermolecular network", "386"),
                ),
                source="Melting points from " + CRC,
            ),
        ),
        ReadingSection(
            id="continuum-with-proton-transfer",
            heading="The continuum with acid-base chemistry",
            body=(
                "Chapter 3 taught proton transfer and this node teaches "
                "proton sharing, and the two are the ends of one "
                "continuum rather than separate phenomena. A hydrogen bond "
                "is the first part of the journey a proton makes when it is "
                "transferred: the donor leans its hydrogen toward an "
                "acceptor, the covalent bond lengthens and weakens, and if "
                "the acceptor is basic enough and the donor acidic enough "
                "the proton keeps going and the transfer completes.\n\n"
                "Reading it that way makes two things fall into place. "
                "First, the strength trends of the previous section are the "
                "acidity and basicity trends of chapter 3, because they are "
                "measuring the same tendency at an earlier stage. Second, "
                "every proton-transfer mechanism you draw passes through a "
                "hydrogen-bonded arrangement on the way, which is why "
                "proton transfers between electronegative atoms are among "
                "the fastest reactions in chemistry - the partners are "
                "already correctly oriented and the distance is already "
                "short. It also explains why solvent matters so much to "
                "acidity: an anion in water is surrounded by donors leaning "
                "toward it, and that stabilisation is a large part of why "
                "acids are stronger in water than in the gas phase."
            ),
        ),
        ReadingSection(
            id="strength-varies",
            heading="Not all hydrogen bonds are worth the same",
            body=(
                "The 10 to 40 kJ/mol range quoted in the first node is "
                "wide because hydrogen-bond strength depends systematically "
                "on the partners. Two rules cover most cases. The more "
                "acidic the donor - meaning the more the donor atom "
                "withdraws density from its hydrogen - the stronger the "
                "bond it forms. And the more basic the acceptor - meaning "
                "the more available its lone pair - the stronger the bond "
                "it accepts.\n\n"
                "So a carboxylic acid O-H is a better donor than an "
                "alcohol O-H, which is better than an amine N-H, tracking "
                "the acidity order of chapter 3 exactly. On the acceptor "
                "side, an amine nitrogen is a better acceptor than an "
                "alcohol oxygen, which is better than an ether oxygen, "
                "which is far better than a fluorine - fluorine being an "
                "excellent element to bond a donating hydrogen to and a "
                "surprisingly poor acceptor, because it holds its lone "
                "pairs too tightly to share them. The extreme cases are "
                "charged: the bifluoride ion, in which a proton is shared "
                "between two fluorides, involves a hydrogen bond worth well "
                "over 100 kJ/mol, comparable to a weak covalent bond. "
                "Charge-assisted hydrogen bonds like this are why enzyme "
                "active sites can hold substrates so tightly."
            ),
        ),
        ReadingSection(
            id="spectroscopic-evidence",
            heading="Seeing a hydrogen bond in a spectrum",
            body=(
                "The boiling-point evidence is indirect. Infrared "
                "spectroscopy provides direct evidence, and it is evidence "
                "you will use in the laboratory. A free O-H stretch - an "
                "alcohol in dilute solution in an inert solvent, with no "
                "neighbours to bond to - appears as a sharp, narrow "
                "absorption near 3600 wavenumbers. The same alcohol as a "
                "neat liquid, where every molecule is hydrogen bonded, "
                "gives instead a broad absorption centred lower, around "
                "3300 wavenumbers.\n\n"
                "Both changes are informative. The shift to lower frequency "
                "happens because the hydrogen bond pulls on the hydrogen "
                "from the far side and WEAKENS the covalent O-H bond, and a "
                "weaker bond vibrates more slowly. The broadening happens "
                "because in a liquid there is a distribution of "
                "hydrogen-bond geometries and strengths at any instant, so "
                "there is a distribution of O-H frequencies rather than a "
                "single one. The practical consequence is the most "
                "recognisable feature in introductory infrared "
                "interpretation: a broad hump between about 3200 and 3600 "
                "wavenumbers means an alcohol, and an even broader one "
                "reaching down toward 2500 means a carboxylic acid, whose "
                "hydrogen bonds are stronger still. When you read that hump "
                "off a spectrum, you are reading this node."
            ),
        ),
        ReadingSection(
            id="solubility-consequence",
            heading="Hydrogen bonding across a boundary",
            body=(
                "So far the interaction has been between like molecules. "
                "It matters at least as much between unlike ones, and this "
                "is where the acceptor-only compounds get their revenge. "
                "Acetone cannot hydrogen bond to itself, having no donor, "
                "and boils at only 329.2 K. Mixed with water it is fully "
                "miscible in all proportions, because water donates and "
                "acetone's carbonyl oxygen accepts. The same is true of "
                "diethyl ether to a lesser extent, of tetrahydrofuran, of "
                "esters and of nitriles.\n\n"
                "This asymmetry - unable to bond to itself, entirely able "
                "to bond to water - is what makes the acceptor-only class "
                "so useful. It explains why ethers are excellent solvents "
                "for reactions with polar intermediates yet still low-"
                "boiling and easy to remove, why an acetone rinse dries "
                "glassware (it takes up the water by hydrogen bonding and "
                "then evaporates readily), and why so many drug molecules "
                "carry an ester or an amide: those groups accept hydrogen "
                "bonds from water and from a target protein without adding "
                "the self-association that would make the compound "
                "high-melting and hard to formulate. Ask both questions "
                "separately - can it bond to itself, and can it bond to "
                "water - because a compound can answer no to the first and "
                "yes to the second."
            ),
        ),
        ReadingSection(
            id="biology",
            heading="The interaction biology is built from",
            body=(
                "Hydrogen bonding is the interaction that makes molecular "
                "recognition possible, and its usefulness comes from the "
                "combination of two properties established above: it is "
                "directional, so it can specify geometry, and it is weak "
                "enough to be reversible at body temperature, so a "
                "structure held by it can open and close.\n\n"
                "Nucleic acid base pairing is the clearest case. Adenine "
                "pairs with thymine through two hydrogen bonds and guanine "
                "with cytosine through three, and the pairing is specific "
                "because the donor and acceptor patterns on each base "
                "match only its partner - the information content of the "
                "genome is encoded in donor-acceptor geometry. That "
                "three-bond guanine-cytosine pair is measurably stronger "
                "than the two-bond adenine-thymine pair, which is why "
                "GC-rich DNA takes a higher temperature to melt into single "
                "strands. In proteins, the alpha helix is held by hydrogen "
                "bonds from each backbone N-H to the carbonyl oxygen four "
                "residues along, and the beta sheet by bonds between "
                "adjacent extended strands; both secondary structures are "
                "defined by their hydrogen-bond pattern rather than by any "
                "covalent feature. And an enzyme recognises its substrate "
                "by presenting a complementary array of donors and "
                "acceptors, which is why a small change to a substrate can "
                "abolish binding entirely."
            ),
        ),
        ReadingSection(
            id="carboxylic-dimer",
            heading="The dimer that behaves like one molecule",
            body=(
                "One consequence deserves separate mention because it "
                "produces measurements that look wrong. Carboxylic acids "
                "have both a strong donor, the O-H, and a strong acceptor, "
                "the carbonyl oxygen, arranged so that two molecules can "
                "pair head to head with TWO hydrogen bonds simultaneously, "
                "forming an eight-membered ring. That cyclic dimer is "
                "unusually stable, and in the vapour phase and in nonpolar "
                "solvents carboxylic acids exist largely as dimers rather "
                "than as single molecules.\n\n"
                "The observable consequences are several. Molecular masses "
                "determined by vapour density or by freezing-point "
                "depression come out roughly double the formula mass, which "
                "historically caused genuine confusion. Boiling points are "
                "far higher than the size of the individual molecule "
                "suggests - acetic acid boils at 391.1 K, above the "
                "propan-1-ol of similar mass at 370.3 K. And the infrared "
                "O-H absorption is exceptionally broad and low, running "
                "from about 3300 down toward 2500 wavenumbers, because the "
                "doubled bonding weakens the O-H bonds more than a single "
                "hydrogen bond would. Two hydrogen bonds acting in concert "
                "on the same pair of molecules is the additivity principle "
                "of the first node in its simplest possible form."
            ),
        ),
        ReadingSection(
            id="amides",
            heading="The amide, and why proteins could be built from it",
            body=(
                "Amides deserve their own mention because they are the "
                "strongest hydrogen bonders among neutral organic "
                "functional groups and because the peptide bond of every "
                "protein is one. A primary amide carries an N-H donor and a "
                "carbonyl acceptor on the same small group, arranged so "
                "that molecules chain together readily; the resulting "
                "association is strong enough that acetamide, with only two "
                "carbons, is a SOLID at room temperature, melting at 354 K, "
                "where the corresponding ester, methyl acetate, is a liquid "
                "boiling at 330 K.\n\n"
                "Two features conspire. The carbonyl oxygen of an amide is "
                "an unusually good acceptor, because delocalisation of the "
                "nitrogen lone pair into the carbonyl - the resonance you "
                "met in chapter 1 - puts extra density on that oxygen. And "
                "the N-H is an adequate donor. The combination gives an "
                "amide hydrogen bond near the top of the neutral range, and "
                "it is what makes the alpha helix and the beta sheet stable "
                "enough to persist in water, which is a competitive "
                "hydrogen-bonding environment that dissolves most weaker "
                "associations. Nature's choice of the amide linkage for "
                "proteins is therefore not arbitrary: it supplies a "
                "backbone that is covalently robust and simultaneously "
                "carries the strongest reversible structural interaction "
                "available."
            ),
        ),
        ReadingSection(
            id="what-is-not-a-hbond",
            heading="Four things that are not hydrogen bonds",
            body=(
                "Precision here saves marks and prevents mechanistic "
                "nonsense. First, a hydrogen on carbon is not a donor. "
                "Chloroform's C-H is unusually polarised and does form a "
                "recognised weak interaction, but methane, ethane and the "
                "hydrocarbon portion of any molecule do not hydrogen bond, "
                "and drawing them doing so is an error. Second, the "
                "presence of oxygen or nitrogen does not by itself confer "
                "hydrogen bonding: ethers, ketones, esters and tertiary "
                "amines accept and cannot donate.\n\n"
                "Third, a hydrogen bond is not a covalent bond and must not "
                "be drawn as a solid line; the convention is a dotted or "
                "dashed line, and it matters because a solid line implies "
                "a hydrogen with two bonds, which is impossible. Fourth, "
                "protonation is not hydrogen bonding. When a strong acid "
                "protonates an alcohol the proton is TRANSFERRED and a new "
                "covalent O-H bond forms, giving a cationic species; in a "
                "hydrogen bond the proton stays covalently attached to its "
                "donor and merely leans toward the acceptor. The two are "
                "on a continuum - the bifluoride ion mentioned earlier sits "
                "in the middle - but in ordinary organic chemistry the "
                "distinction is sharp, and mechanisms that blur it produce "
                "wrong products."
            ),
            important=(
                "The four elements that matter are N, O, F for donation "
                "and N, O, F for acceptance. Chlorine is electronegative "
                "enough on paper and is a poor hydrogen-bond partner in "
                "practice, because it is large and its lone pairs are "
                "diffuse - electronegativity alone is not the criterion."
            ),
        ),
        ReadingSection(
            id="worked-ranking",
            heading="Worked example: five compounds, one procedure",
            body=(
                "Rank butane, butan-1-ol, diethyl ether, butanal and "
                "butanoic acid by boiling point. Run the audit before "
                "looking at any data. Butane has neither donor nor "
                "acceptor: dispersion only, lowest. Diethyl ether and "
                "butanal are acceptor-only, so they have dipoles but no "
                "self-association, and they should sit together above "
                "butane - butanal higher than the ether because a carbonyl "
                "dipole exceeds an ether dipole. Butan-1-ol is donor and "
                "acceptor and should be well above both. Butanoic acid is "
                "donor and acceptor AND forms the doubled cyclic dimer, so "
                "it should be highest of all.\n\n"
                "The measured values confirm the whole ranking: butane "
                "272.7 K, diethyl ether 307.6, butanal 348.0, butan-1-ol "
                "390.9, butanoic acid 436.4. Note the gaps as well as the "
                "order. Adding a dipole to butane bought 35 K; upgrading "
                "that dipole to a carbonyl bought 40 K more; adding "
                "hydrogen-bond donation bought a further 43 K; and adding "
                "the second hydrogen bond of the dimer bought 46 K on top "
                "of that. Every step is roughly the same size, which is a "
                "useful calibration - the interactions are not separated by "
                "orders of magnitude in their effect on boiling point, they "
                "are separated by tens of kelvin each, and a compound can "
                "make up a missing hydrogen bond with enough carbons. Run "
                "the audit before the arithmetic and you will rarely need "
                "the arithmetic; run the arithmetic without the audit and "
                "you will confidently rank the acid below the aldehyde, "
                "which is wrong by nearly ninety kelvin."
            ),
            table=Table(
                caption="Four-carbon compounds, ranked by what they can do",
                columns=("Compound", "Donor / acceptor",
                         "Boiling point (K)"),
                rows=(
                    ("butane", "neither", "272.7"),
                    ("diethyl ether", "acceptor only", "307.6"),
                    ("butanal", "acceptor only, larger dipole", "348.0"),
                    ("butan-1-ol", "donor and acceptor", "390.9"),
                    ("butanoic acid", "donor and acceptor, cyclic dimer",
                     "436.4"),
                ),
                source="Boiling points at 1 atm from " + CRC,
                note=(
                    "Diethyl ether is C4H10O rather than a four-carbon "
                    "chain; it is included because it is the standard "
                    "acceptor-only comparison and its mass is close."
                ),
            ),
        ),
        ReadingSection(
            id="closing-hbond",
            heading="Twenty kilojoules, spent everywhere",
            body=(
                "It is worth restating the arithmetic that makes this node "
                "surprising. A hydrogen bond is worth roughly eight times "
                "$RT$ at room temperature and roughly a twentieth of the "
                "covalent bond that supplies its hydrogen. On the ladder of "
                "the first node it sits one rung above dipole-dipole and "
                "two above dispersion - a modest position. And yet it "
                "produces the largest single deviations in the chapter's "
                "data, decides the solubility of most of the compounds a "
                "chemist handles, and specifies the shape of nearly every "
                "large molecule in a living cell.\n\n"
                "The resolution is the combination the node has been "
                "building: strong enough to survive thermal motion, weak "
                "enough to be broken and reformed at ordinary temperature, "
                "and directional enough to specify geometry rather than "
                "merely provide cohesion. No other interaction available to "
                "neutral molecules has all three properties. Dispersion has "
                "the reversibility but not the direction; a covalent bond "
                "has the direction but not the reversibility; ionic "
                "attraction has strength but neither the direction nor the "
                "reversibility in water. Hydrogen bonding occupies the "
                "one position on the ladder from which structures can be "
                "both specified and undone, and that is why biology built "
                "itself out of it.\n\n"
                "The chapter now has its three interactions and needs to "
                "put them back together. The next node does exactly that, "
                "turning dispersion, dipole and hydrogen bonding into a "
                "single ordered procedure for ranking any set of compounds "
                "by boiling point - and, more usefully, for knowing when "
                "the ordering is safe and when the interactions are close "
                "enough that only the measurement decides."
            ),
        ),
    ),
    key_takeaways=(
        "A hydrogen bond needs a DONOR (H covalently bonded to N, O or F) and an ACCEPTOR (a lone pair on N, O or F). Both, separately checked - oxygen alone means acceptor only.",
        "The evidence is the binary-hydride anomaly: NH3, HF and H2O sit far above their series trends while the carbon series rises smoothly, because only they satisfy the condition.",
        "Ethanol 351.4 K against dimethyl ether 248.3 K - same C2H6O, one hydrogen relocated, 103 K.",
        "It is directional (strongest when D-H...A is linear, half-strength 45 degrees off), which is what lets it specify structures: ice, the alpha helix, base pairing.",
        "Intramolecular hydrogen bonds do the OPPOSITE of intermolecular ones: 2-nitrophenol melts at 318 K, 4-nitrophenol at 386 K.",
        "Acceptor-only compounds cannot self-associate but bond freely to water - which is why acetone boils low and is miscible with water in all proportions.",
    ),
    exam_tips=(
        "The commonest MCAT trap is a molecule containing oxygen but no O-H: ethers, esters, ketones and aldehydes accept and cannot donate, so they boil far below alcohols of the same size.",
        "Broad IR absorption at 3200-3600 wavenumbers means a hydrogen-bonded O-H; running down toward 2500 means a carboxylic acid dimer. Sharp near 3600 means free O-H, so a dilute non-associating sample.",
        "Ortho-substituted phenols and similar are testing intramolecular hydrogen bonding, which lowers boiling point and melting point rather than raising them.",
    ),
))
# --------------------------------------------------------------------------
# 8.5 Physical properties from structure
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.IMFPROPERTIES",
    lead=(
        "Three interactions have been built separately; this node puts "
        "them back together into a procedure. Given a set of structures "
        "and nothing else, rank them by boiling point - and, more "
        "valuably, know when the ranking is safe and when the "
        "interactions are close enough that only a measurement decides. "
        "The node then turns to melting point, which answers to a fourth "
        "consideration the other three do not, and closes with the other "
        "physical properties the same interactions govern."
    ),
    sections=(
        ReadingSection(
            id="what-boiling-point-is",
            heading="What you are actually ranking",
            body=(
                "Before ranking anything, be clear what the quantity "
                "means. A liquid's molecules are in constant motion with a "
                "distribution of energies, and at any temperature some have "
                "enough energy to escape the surface; the pressure they "
                "exert once they have escaped is the vapour pressure. "
                "Boiling point is the temperature at which vapour pressure "
                "equals the external pressure, so that escape can happen "
                "throughout the bulk rather than only at the surface - "
                "which is what a bubble forming in the middle of a liquid "
                "IS.\n\n"
                "Two consequences follow. Boiling point is not an "
                "intrinsic property of a substance but of a substance at a "
                "stated pressure, which is why tables specify one "
                "atmosphere and why reduced-pressure distillation lets you "
                "boil a compound far below its atmospheric value without "
                "decomposing it. And boiling point measures escape from a "
                "liquid, which means it measures how strongly the liquid "
                "holds its molecules - the sum of every intermolecular "
                "attraction available. That is why the whole chapter comes "
                "down to this one number, and why the ranking procedure is "
                "just the chapter's three interactions applied in order of "
                "how much each is typically worth."
            ),
        ),
        ReadingSection(
            id="the-ladder",
            heading="The ranking procedure",
            figure=Figure(
                stem="org1-bp-decision-ladder",
                caption=(
                    "Four questions asked in order, each only when the one "
                    "above it ties - and a standing warning that the "
                    "ordering is by typical magnitude rather than by law."
                ),
                alt=(
                    "A ladder of four boxed questions: hydrogen bonding, "
                    "permanent dipole, more electrons, less branched, with "
                    "tie arrows between them."
                ),
            ),
            body=(
                "The procedure is four questions asked strictly in order, "
                "each one only when the previous has failed to separate the "
                "compounds. First: is hydrogen bonding available, meaning "
                "does the compound have both a donor and an acceptor? A "
                "self-associating compound almost always out-boils one that "
                "is not, at comparable size. Second: does the compound have "
                "a permanent dipole, from the vector sum of the previous "
                "node? Third: which compound has more electrons? Fourth: "
                "which has more accessible surface area, meaning less "
                "branching?\n\n"
                "The order reflects typical magnitudes: hydrogen bonding is "
                "worth about a hundred kelvin in a small molecule, a "
                "substantial dipole a few tens, a CH2 about twenty-five, "
                "and a branch ten to twenty-five. Applied in order the "
                "ladder answers the great majority of ranking questions. "
                "But it is a ranking of typical single contributions, and "
                "questions three and four are CUMULATIVE while questions "
                "one and two are not: a compound can only hydrogen bond or "
                "not, but it can have ten more carbons than its rival. That "
                "asymmetry is the source of every genuine exception, and "
                "the next two sections are about recognising them before "
                "they cost you an answer."
            ),
        ),
        ReadingSection(
            id="when-the-ladder-breaks",
            heading="Two exceptions worth expecting",
            body=(
                "The first exception: enough dispersion beats one hydrogen "
                "bond. Ethanol hydrogen bonds and boils at 351.4 K; decane "
                "cannot hydrogen bond at all and boils at 447.3 K, because "
                "ten carbons of dispersion outweigh one hydroxyl group. "
                "Rung three overturned rung one, legitimately, because the "
                "size gap was large. The lesson is not that the ladder is "
                "wrong but that it compares LIKE-SIZED compounds; when the "
                "sizes are very different, do the arithmetic instead.\n\n"
                "The second: enough dispersion beats a dipole, which "
                "happens at much smaller size gaps because dipoles are "
                "worth less. Butane has no dipole and boils at 272.7 K; "
                "dimethyl ether has a 1.30 D dipole and boils at 248.3 K. "
                "The ladder, applied blindly, puts the ether higher and is "
                "wrong by 24 K, because butane's C4H10 carries more "
                "electrons than the ether's C2H6O and the extra dispersion "
                "outweighs a modest dipole. Both exceptions have the same "
                "shape - a cumulative quantity overtaking a one-off one - "
                "and both are standard examination material precisely "
                "because they punish a memorised rule and reward an "
                "understood one. The working habit: apply the ladder, then "
                "check whether the sizes were comparable, and if they were "
                "not, reconsider."
            ),
            important=(
                "The ladder ranks TYPICAL magnitudes. Size and shape are "
                "cumulative and can be added to without limit; hydrogen "
                "bonding and a dipole are present or absent. Any comparison "
                "between compounds of substantially different size must "
                "check the arithmetic rather than trust the order."
            ),
        ),
        ReadingSection(
            id="worked-ranking-set",
            heading="Worked example: six compounds ranked from structure",
            body=(
                "Rank hexane, hexan-1-ol, dipropyl ether, pentanoic acid, "
                "2,2-dimethylbutane and hexanal. Run the ladder. Hydrogen "
                "bonding first: hexan-1-ol and pentanoic acid both qualify, "
                "and the acid forms the cyclic dimer of the previous node, "
                "so it should be highest, then the alcohol. The remaining "
                "four cannot self-associate. Dipoles next: hexanal has a "
                "carbonyl and dipropyl ether an ether oxygen, so both beat "
                "the two hydrocarbons, and the carbonyl dipole exceeds the "
                "ether dipole so hexanal beats the ether. The hydrocarbons "
                "tie on the first two questions, tie again on electron "
                "count (both C6H14), and separate on shape: unbranched "
                "hexane above doubly-branched 2,2-dimethylbutane.\n\n"
                "The predicted order is pentanoic acid, hexan-1-ol, "
                "hexanal, dipropyl ether, hexane, 2,2-dimethylbutane, and "
                "the measured values are 459.3, 430.6, 401.5, 363.2, 341.9 "
                "and 322.9 K. Every rung was used and every rung held, "
                "because the compounds were deliberately chosen at "
                "comparable size - which is exactly the condition under "
                "which the ladder is trustworthy. Notice also that the "
                "spread from top to bottom is 136 K in a set of compounds "
                "all containing six or fewer carbons: functional group is a "
                "large effect at fixed size, and the chapter's ordering is "
                "the reason."
            ),
            table=Table(
                caption="Six compounds of comparable size, ranked and checked",
                columns=("Compound", "Deciding feature",
                         "Boiling point (K)"),
                rows=(
                    ("pentanoic acid", "hydrogen bonding, cyclic dimer",
                     "459.3"),
                    ("hexan-1-ol", "hydrogen bonding", "430.6"),
                    ("hexanal", "carbonyl dipole", "401.5"),
                    ("dipropyl ether", "ether dipole", "363.2"),
                    ("hexane", "dispersion, unbranched", "341.9"),
                    ("2,2-dimethylbutane", "dispersion, branched", "322.9"),
                ),
                source="Boiling points at 1 atm from " + CRC,
            ),
        ),
        ReadingSection(
            id="state-at-room-temperature",
            heading="Predicting the state of a compound at 298 K",
            body=(
                "A coarser question than ranking, and often the one that "
                "actually matters: is this compound a gas, a liquid or a "
                "solid on the bench? The ladder answers it if you attach "
                "approximate thresholds. Compounds boiling below 298 K are "
                "gases; those boiling between 298 K and roughly 570 K are "
                "the liquids that fill a solvent cabinet; above that, or "
                "where melting point exceeds 298 K, you have a solid.\n\n"
                "Translated into structures, the rules of thumb are "
                "serviceable. Hydrocarbons are gases up to about four "
                "carbons, liquids to about sixteen, and waxy solids beyond. "
                "Adding an ether or a carbonyl group buys roughly one to "
                "two carbons' worth of boiling point, so the gas-liquid "
                "boundary moves down: methanal is a gas but ethanal, at two "
                "carbons, is a liquid. Adding a hydroxyl buys roughly four "
                "carbons' worth, which is why methanol is already a liquid "
                "and why even one-carbon methanoic acid is. Adding several "
                "hydroxyls, or a charge, generally produces a solid at any "
                "size - which is why glucose is a crystalline solid while "
                "hexane, its near neighbour in carbon count, is a mobile "
                "liquid. Counting functional groups against carbons "
                "predicts the physical state of most organic compounds "
                "without any data at all."
            ),
        ),
        ReadingSection(
            id="ionic-organics",
            heading="What happens when the compound is a salt",
            body=(
                "The ladder covers neutral molecules. The moment a "
                "compound carries a full charge, ion-ion attraction enters "
                "and dominates everything below it, and the physical "
                "properties change category rather than degree. Acetic acid "
                "is a liquid melting at 289.8 K and boiling at 391.1 K. "
                "Sodium acetate, the same molecule with its acidic proton "
                "removed and a sodium ion supplied, melts at about 597 K "
                "and does not boil at all - it decomposes on further "
                "heating.\n\n"
                "That transformation is a routine tool. Converting a "
                "carboxylic acid to its sodium salt, or an amine to its "
                "hydrochloride, turns an oil into a crystalline solid, "
                "turns a compound that dissolves in ether into one that "
                "dissolves in water, and gives a handle for purification "
                "that the neutral compound did not offer. Most drugs "
                "containing a basic nitrogen are formulated as salts for "
                "exactly these reasons: better crystallinity, better "
                "aqueous solubility, better stability. It is also the basis "
                "of acid-base extraction, in which a mixture is separated "
                "by protonating or deprotonating one component to move it "
                "between an organic and an aqueous layer. When you meet "
                "that technique, remember that its whole mechanism is one "
                "rung being added above the top of this node's ladder."
            ),
        ),
        ReadingSection(
            id="melting-is-different",
            heading="Why melting point needs a fourth idea",
            body=(
                "Every argument so far has been about attraction, and for "
                "boiling point attraction is nearly the whole story. "
                "Melting is a different process. It destroys a crystal "
                "lattice, in which molecules occupy fixed positions in a "
                "repeating arrangement, and turns it into a liquid, in "
                "which they are still in contact but disordered. What has "
                "to be overcome is therefore not simply attraction but the "
                "stability of a specific packed arrangement.\n\n"
                "That introduces a variable boiling point does not have: "
                "how well the molecular shape fits into a regular lattice. "
                "A symmetric, compact molecule packs efficiently, makes "
                "good contact with its neighbours in the crystal, and "
                "requires a high temperature to disorder. A long, flexible "
                "molecule packs badly, because it must also surrender "
                "conformational freedom to lie down in a repeating pattern, "
                "and it melts lower than its attractions alone would "
                "predict. Symmetry, not size, is the melting-point "
                "variable, and it is why the melting-point column of a data "
                "table so often refuses to parallel the boiling-point "
                "column. Any question that gives you both columns is "
                "usually testing precisely this dissociation."
            ),
        ),
        ReadingSection(
            id="xylenes",
            heading="The xylenes: symmetry isolated",
            figure=Figure(
                stem="org1-xylene-mp-bp",
                caption=(
                    "The three xylenes boil within 6 K of one another and "
                    "melt across 61 K: boiling point answers to attraction, "
                    "melting point to how well the shape packs."
                ),
                alt=(
                    "Paired bars of boiling and melting point for benzene, "
                    "toluene and the three xylene isomers."
                ),
            ),
            body=(
                "The xylenes make the point without any confounding "
                "variable at all. All three are C8H10, constitutional "
                "isomers differing only in where two methyl groups sit on a "
                "benzene ring. They have identical masses, identical "
                "electron counts, and very similar dispersion; none can "
                "hydrogen bond. Their boiling points reflect that "
                "similarity: 417.6, 412.3 and 411.5 K for the ortho, meta "
                "and para isomers, a spread of only 6 K.\n\n"
                "Their melting points spread across 61 K. para-Xylene melts "
                "at 286.4 K, well above room temperature; ortho-xylene at "
                "248.0 K; meta-xylene at 225.3 K. The order is the symmetry "
                "order. The para isomer has its two methyls exactly "
                "opposite, giving a molecule with a centre of symmetry that "
                "stacks into a lattice with no wasted space. The meta "
                "isomer, with its methyls at 120 degrees, is the most "
                "awkwardly shaped and packs worst. Same formula, same "
                "attractions, sixty-one kelvin of melting point produced by "
                "geometry alone - and the practical consequence that "
                "para-xylene can be separated from its isomers "
                "industrially by crystallisation, which is a purification "
                "built entirely on this section."
            ),
            table=Table(
                caption="Benzene, toluene and the xylenes",
                columns=("Compound", "Melting point (K)",
                         "Boiling point (K)"),
                rows=(
                    ("benzene", "278.7", "353.2"),
                    ("toluene", "178.2", "383.8"),
                    ("o-xylene", "248.0", "417.6"),
                    ("m-xylene", "225.3", "412.3"),
                    ("p-xylene", "286.4", "411.5"),
                ),
                source="Melting and boiling points at 1 atm from " + CRC,
                note=(
                    "Benzene and toluene are included to show the same "
                    "effect in a simpler pair: adding one methyl RAISES the "
                    "boiling point by 31 K and LOWERS the melting point by "
                    "100 K, because it adds dispersion and destroys "
                    "symmetry at the same time."
                ),
            ),
        ),
        ReadingSection(
            id="symmetry-generalised",
            heading="Symmetry, generalised",
            body=(
                "Once seen in the xylenes the effect is visible everywhere. "
                "Benzene, a flat regular hexagon, melts at 278.7 K; "
                "toluene, the same ring with one methyl spoiling the "
                "symmetry, melts a hundred kelvin lower at 178.2 K, even "
                "though toluene has more electrons and boils 31 K HIGHER. "
                "One methyl group added dispersion, which raised boiling "
                "point, and destroyed symmetry, which collapsed melting "
                "point. The two properties moved in opposite directions "
                "from a single structural change.\n\n"
                "Neopentane against pentane, met in the dispersion node, is "
                "the same story in a saturated system: the near-spherical "
                "isomer melts 113 K higher and boils 26.6 K lower. And it "
                "explains a pattern in the alkane series that surprises "
                "students who notice it - the melting points of the "
                "unbranched alkanes rise with chain length in a saw-tooth "
                "rather than smoothly, because chains with an even number "
                "of carbons pack into the lattice more efficiently than "
                "those with an odd number. The practical laboratory "
                "consequence is worth stating too: a compound that will not "
                "crystallise often has a shape that cannot pack, and the "
                "standard remedies - making a salt, making a symmetric "
                "derivative - are attempts to fix the packing rather than "
                "the attraction."
            ),
        ),
        ReadingSection(
            id="other-properties",
            heading="The other readouts of the same interactions",
            body=(
                "Boiling point and melting point get the attention, but "
                "several other properties measure the same attractions and "
                "each has its own emphasis. Enthalpy of vaporisation is the "
                "purest measure, being the energy needed to separate a mole "
                "of molecules completely; it is what boiling point is a "
                "noisy proxy for. Viscosity measures resistance to flow, "
                "which requires molecules to slide past one another, so it "
                "responds sharply to interactions that must be broken and "
                "remade - which is why glycerol is syrupy and hexane is "
                "not.\n\n"
                "Surface tension measures the energy cost of creating new "
                "surface, where molecules have neighbours on one side only; "
                "water's is famously high because a surface water molecule "
                "gives up hydrogen bonds. Vapour pressure is the inverse "
                "reading of boiling point and is the more useful quantity "
                "when you are removing a solvent. And enthalpy of fusion "
                "measures lattice destruction and therefore tracks the "
                "packing argument rather than the attraction argument. "
                "Knowing which property a question is asking about tells "
                "you which section of this chapter answers it: separation "
                "questions go to attraction, crystallisation and "
                "melting-point questions go to packing, and flow questions "
                "go to how many interactions must break for a molecule to "
                "move."
            ),
        ),
        ReadingSection(
            id="pressure",
            heading="Boiling point is a function of pressure",
            body=(
                "Because boiling point is defined against an external "
                "pressure, lowering the pressure lowers it, and this is one "
                "of the most useful facts in preparative chemistry. A "
                "compound that boils at 520 K at one atmosphere - hot "
                "enough to decompose many organic molecules - may boil "
                "comfortably below 400 K under the vacuum an ordinary "
                "water aspirator provides. Reduced-pressure distillation "
                "exists because of that shift, as does the rotary "
                "evaporator, which is simply a reduced-pressure "
                "distillation optimised for removing solvent.\n\n"
                "A serviceable rule of thumb is that halving the pressure "
                "lowers the boiling point by roughly fifteen kelvin in the "
                "range that matters, though the true relation is "
                "exponential rather than linear and depends on the enthalpy "
                "of vaporisation. The important structural point is that "
                "the RANKING is largely preserved: two compounds compared "
                "at one atmosphere usually keep their order at ten "
                "millibar, because both shift in the same direction. So "
                "everything this node teaches survives the change of "
                "pressure, and the tabulated one-atmosphere values remain "
                "the right thing to reason from even when the actual "
                "distillation will be run under vacuum. The exception is "
                "worth naming: compounds whose enthalpies of vaporisation "
                "differ greatly - one associated, one not - shift by "
                "different amounts, and a close pair can occasionally swap."
            ),
        ),
        ReadingSection(
            id="azeotropes",
            heading="Where boiling-point reasoning stops working",
            body=(
                "One limitation deserves stating plainly, because it "
                "surprises students who have learned the ladder well. "
                "Everything above concerns pure compounds. A MIXTURE does "
                "not necessarily boil at a temperature between its "
                "components' boiling points, because the interactions "
                "between unlike molecules can be stronger or weaker than "
                "those between like ones - which is the solubility node's "
                "subject arriving early.\n\n"
                "When unlike interactions are weaker than like ones, the "
                "mixture is easier to boil than either pure component and "
                "the system forms a minimum-boiling azeotrope: a particular "
                "composition that boils at a fixed temperature below both, "
                "and which distillation therefore cannot separate. Ethanol "
                "and water are the standard case, forming an azeotrope at "
                "about 95.6 per cent ethanol by mass which boils at 351.3 "
                "K, just below pure ethanol's 351.4 K. This is why "
                "ordinary distillation of a fermented mixture cannot "
                "produce dry ethanol however many plates the column has, "
                "and why anhydrous ethanol requires a chemical drying step "
                "instead. Ranking pure compounds is a reliable skill; "
                "predicting mixtures needs more than the ladder, and "
                "knowing where the ladder's authority ends is part of "
                "having the skill."
            ),
        ),
        ReadingSection(
            id="trouton",
            heading="A check that catches associated liquids",
            body=(
                "One quantitative relation is worth carrying because it "
                "flags hydrogen bonding without any structural inspection. "
                "For a wide range of ordinary liquids the entropy of "
                "vaporisation - the enthalpy of vaporisation divided by the "
                "boiling point in kelvin - comes out near 88 joules per "
                "kelvin per mole. The regularity has a clear physical "
                "reading: going from any liquid to a gas at one atmosphere "
                "involves about the same increase in disorder, whatever "
                "the substance.\n\n"
                "Liquids that deviate upward from that value are the "
                "interesting ones, and they deviate for a specific reason. "
                "Water comes out near 109, and ethanol near 110, because in "
                "the LIQUID these substances are unusually ordered - the "
                "hydrogen-bonded network imposes structure that ordinary "
                "liquids do not have - so the disorder gained on "
                "vaporisation is larger than normal. The rule therefore "
                "functions as a detector for association: a substance whose "
                "entropy of vaporisation is well above the norm is "
                "hydrogen-bonded or otherwise structured in the liquid. It "
                "is a small piece of arithmetic that turns two tabulated "
                "numbers into a structural conclusion, and it is a good "
                "example of what physical data is for."
            ),
        ),
        ReadingSection(
            id="homologous-series",
            heading="Reading a homologous series",
            body=(
                "Data on a homologous series - a family differing by "
                "successive CH2 groups - is where the interactions of this "
                "chapter can be separated cleanly, and reading such a table "
                "is a transferable skill. Within any one series the "
                "functional group is constant, so hydrogen bonding and "
                "dipole are constant, and the whole trend is dispersion. "
                "Comparing ACROSS series at the same carbon number holds "
                "dispersion roughly constant and isolates the functional "
                "group.\n\n"
                "Do that for the four-carbon compounds and the numbers line "
                "up as the ladder predicts: butane 272.7 K, butanal 348.0, "
                "butan-1-ol 390.9, butanoic acid 436.4. Now do it again at "
                "one carbon: methane 111.7, methanal 254, methanol 337.8, "
                "methanoic acid 373.7. Same ordering, same reasoning, "
                "different absolute values - and the GAPS between series "
                "narrow as chain length grows, because the constant "
                "functional-group contribution becomes a smaller fraction "
                "of a growing dispersion total. That narrowing is the "
                "quantitative form of a statement made several times in "
                "this chapter: functional group dominates at small size, "
                "dispersion dominates at large size, and the crossover is "
                "somewhere around four to six carbons for most groups."
            ),
        ),
        ReadingSection(
            id="density",
            heading="Density, and which layer is which",
            body=(
                "Density is not an intermolecular-force property in the "
                "way boiling point is - it depends mostly on how heavy the "
                "atoms are and how closely they pack - but it is the "
                "physical property you will use most often in a teaching "
                "laboratory, because it tells you which layer of a "
                "separating funnel holds your compound. Getting it wrong "
                "means discarding the product.\n\n"
                "The rule is simple once the pattern is seen. Ordinary "
                "organic liquids made of carbon, hydrogen and oxygen are "
                "LESS dense than water: hexane 0.66, diethyl ether 0.71, "
                "toluene 0.87, ethyl acetate 0.90 grams per millilitre. "
                "They float, and the organic layer is on top. Liquids "
                "containing heavy halogens are MORE dense than water: "
                "dichloromethane 1.33, trichloromethane 1.49. They sink, "
                "and the organic layer is on the bottom. The dividing line "
                "is essentially whether the molecule carries chlorine, "
                "bromine or iodine, because those atoms are heavy without "
                "adding proportionate volume. The habit worth forming is to "
                "know your solvent's density before you shake the funnel, "
                "and, if you are unsure, to keep both layers until the "
                "product has been located. A further practical note: "
                "densities converge as a layer takes up solute, so a "
                "heavily loaded aqueous phase can occasionally sit where "
                "the table says it should not."
            ),
            table=Table(
                caption="Common extraction solvents against water",
                columns=("Solvent", "Density (g/mL, 293-298 K)",
                         "Layer"),
                rows=(
                    ("hexane", "0.66", "upper"),
                    ("diethyl ether", "0.71", "upper"),
                    ("toluene", "0.87", "upper"),
                    ("ethyl acetate", "0.90", "upper"),
                    ("water", "1.00", "reference"),
                    ("dichloromethane", "1.33", "lower"),
                    ("trichloromethane", "1.49", "lower"),
                ),
                source="Densities at 293-298 K from " + CRC,
            ),
        ),
        ReadingSection(
            id="common-errors-properties",
            heading="The four failure modes of this node",
            body=(
                "First, applying the ladder without checking size. It is "
                "the error the exception section exists to prevent, and it "
                "is the one that costs the most marks, because examiners "
                "know it is common and set questions that reward the check. "
                "Second, carrying a boiling-point rule into a "
                "melting-point question. Branching lowers one and often "
                "raises the other; symmetry does almost nothing to one and "
                "a great deal to the other.\n\n"
                "Third, treating any oxygen-containing compound as a "
                "hydrogen bonder. The donor requirement is separate and "
                "must be checked separately, and ethers, esters, ketones "
                "and aldehydes fail it. Fourth, quoting molecular mass as "
                "the explanation for a dispersion difference. Mass "
                "correlates with electron count within a series and "
                "diverges from it between series, and the correct variable "
                "is electrons and contact area. A useful discipline when "
                "writing an answer: name the interaction, say why the "
                "structure makes it available, and say what it is worth "
                "relative to the alternatives. An answer with those three "
                "parts survives a follow-up question; 'stronger "
                "intermolecular forces' does not."
            ),
        ),
        ReadingSection(
            id="predicting-safely",
            heading="How confident should a prediction be?",
            body=(
                "A ranking is worth more when it comes with a sense of its "
                "own reliability, and this chapter supports that. A "
                "prediction is safe when the compared compounds are within "
                "roughly one or two carbons of each other in size and "
                "differ by a whole rung of the ladder - an alcohol against "
                "an ether at four carbons each, say. Under those conditions "
                "the gap is typically fifty kelvin or more and no plausible "
                "second-order effect will reverse it.\n\n"
                "A prediction is unsafe in three situations. When the "
                "compounds differ substantially in size AND in functional "
                "group, because the cumulative quantity may have overtaken "
                "the one-off one. When both compounds sit on the same rung "
                "and are separated only by a modest difference in dipole "
                "or in branching, because those differences are worth "
                "tens of kelvin and can be overturned by shape effects the "
                "ladder does not model. And whenever the question is about "
                "melting point rather than boiling point, because packing "
                "is genuinely hard to predict from a drawing. Saying which "
                "of those you are in - and saying that a case is close - is "
                "a better answer than a confident ranking that happens to "
                "be wrong."
            ),
        ),
        ReadingSection(
            id="alkane-branching-melting",
            heading="A saw-tooth worth explaining",
            body=(
                "One pattern in the data rewards a closer look because it "
                "shows the packing argument operating at its finest grain. "
                "Plot the melting points of the unbranched alkanes against "
                "carbon number and the line does not rise smoothly: it "
                "zigzags, with even-numbered chains melting relatively "
                "higher than their odd-numbered neighbours, and the "
                "alternation persists well up the series before fading.\n\n"
                "The reason is geometric. An extended zig-zag chain with an "
                "even number of carbons ends with its two terminal methyl "
                "groups pointing in opposite directions, which lets "
                "neighbouring chains interleave into a compact lattice; an "
                "odd-numbered chain has both ends pointing the same way and "
                "packs slightly worse. Nothing about the attractions "
                "differs - every CH2 contributes the same dispersion "
                "whether the count is odd or even - and the entire effect "
                "is lattice fit. Boiling point, which does not involve a "
                "lattice, shows no such alternation and rises smoothly "
                "throughout. Two properties of the same series, one "
                "zigzagging and one smooth, from a single structural "
                "variable that only one of them can see: it is the cleanest "
                "possible demonstration that melting and boiling are asking "
                "different questions."
            ),
        ),
        ReadingSection(
            id="laboratory-use",
            heading="Where the ranking is actually used",
            body=(
                "This node's procedure is not an examination artefact; it "
                "is what a chemist does before running a separation. "
                "Choosing a distillation means predicting whether two "
                "components differ enough in boiling point to be separated "
                "at all, and roughly twenty-five kelvin is the practical "
                "threshold for a simple distillation while a fractionating "
                "column handles smaller gaps. Choosing a recrystallisation "
                "solvent means predicting solubility hot and cold, which is "
                "the next node's material applied to the same structures.\n\n"
                "Choosing a workup means predicting where a compound will "
                "go between two immiscible phases. Removing a solvent on a "
                "rotary evaporator means predicting relative volatility so "
                "that the solvent leaves and the product stays. And "
                "identifying an unknown from its boiling point - still a "
                "standard undergraduate exercise - is this ranking run "
                "backwards, from a measurement to a class of structures. In "
                "every case the input is a drawn structure and the output "
                "is a decision about a physical operation, with no "
                "mechanism involved at any point. That is the distinctive "
                "contribution of this chapter to a chemist's working "
                "competence, and it is why the material sits in the middle "
                "of the course rather than in an appendix."
            ),
        ),
        ReadingSection(
            id="closing-properties",
            heading="What remains",
            body=(
                "The chapter has now taken a substance and asked how "
                "strongly it holds itself together, which is what boiling "
                "point, melting point, viscosity and vapour pressure all "
                "measure in their different ways. Every one of those "
                "questions concerned a single pure compound interacting "
                "with more of itself, and the three interactions built "
                "earlier were sufficient to answer them.\n\n"
                "The last node changes the question. Solubility asks "
                "whether a substance would rather interact with something "
                "ELSE, which requires comparing three sets of interactions "
                "rather than one - solute with solute, solvent with "
                "solvent, and solute with solvent - and requires an "
                "entropy term that none of the preceding arguments needed. "
                "That is why 'like dissolves like', useful as it is, is an "
                "abbreviation rather than an explanation, and why the "
                "hydrophobic effect turns out to be driven by water's "
                "entropy rather than by any attraction between the "
                "nonpolar molecules it excludes. It is the most subtle "
                "argument in the chapter and the one with the longest "
                "reach: membranes, protein folding and drug absorption all "
                "wait at the end of it.\n\n"
                "Carry two things forward into it. The ladder, because "
                "solubility is decided by the same three interactions in "
                "the same order of typical magnitude. And the habit of "
                "asking whether the compared species are of comparable "
                "size, because the solubility node has its own version of "
                "the cumulative-beats-one-off exception, in the alcohol "
                "series where a growing hydrocarbon tail eventually "
                "defeats a fixed hydroxyl and turns a miscible liquid into "
                "an insoluble one."
            ),
        ),
    ),
    key_takeaways=(
        "Rank boiling points by four questions in order: hydrogen bonding available, then permanent dipole, then more electrons, then less branching - each asked only when the previous ties.",
        "The ladder ranks typical magnitudes, not laws. Size and shape are cumulative; hydrogen bonding and a dipole are present or absent, so enough carbons can overturn either.",
        "Two standard exceptions: decane (447.3 K) out-boils ethanol (351.4 K); butane (272.7 K) out-boils dimethyl ether (248.3 K).",
        "Melting point needs a fourth idea - packing efficiency. The three xylenes boil within 6 K and melt across 61 K, ordered by symmetry.",
        "Adding a methyl to benzene raises boiling point by 31 K and lowers melting point by 100 K: more dispersion, less symmetry, opposite directions.",
        "An entropy of vaporisation well above the ~88 J/K/mol norm (water 109, ethanol 110) flags an associated, hydrogen-bonded liquid.",
    ),
    exam_tips=(
        "When a question gives both melting and boiling points, it is almost always testing that they answer to different things - attraction against packing.",
        "Check sizes before trusting the ladder. Any pair with a large carbon-count difference is a candidate for dispersion overturning the functional-group ordering.",
        "Homologous-series questions want you to hold one variable constant: along a series only dispersion changes; across series at fixed carbon count only the functional group changes.",
    ),
))
# --------------------------------------------------------------------------
# 8.6 Solubility and solvation
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.SOLUBILITY",
    lead=(
        "Boiling point asked how strongly a substance holds itself "
        "together. Solubility asks whether it would rather hold something "
        "else, and answering it means comparing three sets of "
        "interactions rather than one, with an entropy term the previous "
        "nodes never needed. This node builds the free-energy bookkeeping "
        "that 'like dissolves like' abbreviates, classifies solvents in "
        "the way chapter 9 will require, shows that the hydrophobic "
        "effect is driven by water's entropy rather than by any "
        "attraction between nonpolar molecules, and ends with the "
        "applications that make the chapter matter: extraction, "
        "membranes, drug absorption and designed ion binders."
    ),
    sections=(
        ReadingSection(
            id="what-dissolving-is",
            heading="Three sets of interactions, not one",
            body=(
                "Dissolving is an exchange. Before mixing, solute "
                "molecules interact with other solute molecules and "
                "solvent molecules with other solvent molecules. After "
                "mixing, solute molecules are surrounded by solvent, so "
                "both original sets of interactions have been partly given "
                "up and a new solute-solvent set has been created. Whether "
                "the exchange happens depends on all three, which is why "
                "solubility cannot be predicted from the solute alone or "
                "the solvent alone.\n\n"
                "Write it as a balance. Two things must be paid for: "
                "separating solute molecules from each other, and opening "
                "a cavity in the solvent by separating solvent molecules "
                "from each other. One thing pays: the new solute-solvent "
                "interactions. When the new interactions are comparable in "
                "kind and strength to the ones surrendered, the exchange is "
                "roughly energy-neutral and the mixing happens because "
                "entropy favours it. When the new interactions are much "
                "weaker than the ones surrendered, the exchange costs "
                "energy and the substances do not mix. That is the entire "
                "content of 'like dissolves like' - a compact and "
                "genuinely useful abbreviation, which this node is going to "
                "unpack because the abbreviation fails in exactly the cases "
                "that matter most."
            ),
        ),
        ReadingSection(
            id="free-energy",
            heading="The bookkeeping: enthalpy and entropy",
            body=(
                "Dissolving is a physical process and is governed by free "
                "energy in the usual way: it occurs spontaneously when "
                "$\\Delta G$ is negative, and $\\Delta G = \\Delta H - "
                "T\\Delta S$. Both terms carry real weight, and neglecting "
                "the second is the reason like-dissolves-like fails where "
                "it does.\n\n"
                "The enthalpy term is the interaction bookkeeping just "
                "described: energy spent separating solute from solute and "
                "solvent from solvent, energy recovered from solute-solvent "
                "contact. It can be positive or negative. Dissolving "
                "ammonium nitrate in water is strongly endothermic, which "
                "is how a cold pack works, and it dissolves anyway - proof "
                "on its own that enthalpy is not the only term. The entropy "
                "term is usually favourable, because a solution is a more "
                "disordered arrangement than two separated pure "
                "substances: mixing spreads each component through a larger "
                "volume, and there are vastly more ways to arrange a "
                "mixture than to arrange two separate phases. That is why a "
                "roughly energy-neutral exchange still produces a solution, "
                "and why two nonpolar liquids of similar type mix in all "
                "proportions almost regardless of detail."
            ),
            important=(
                "'Like dissolves like' is a statement about the ENTHALPY "
                "term only. It works because entropy is usually favourable "
                "and roughly constant across cases, so enthalpy decides. "
                "It fails when entropy is NOT favourable - which is exactly "
                "the hydrophobic effect, later in this node."
            ),
        ),
        ReadingSection(
            id="solvent-classification",
            heading="Classifying solvents",
            figure=Figure(
                stem="org1-solvent-map",
                caption=(
                    "Common solvents by dielectric constant, grouped into "
                    "the three classes chapter 9 needs: protic, polar "
                    "aprotic and nonpolar."
                ),
                alt=(
                    "Horizontal bar chart of dielectric constant for "
                    "thirteen solvents, coloured by protic, polar aprotic "
                    "and nonpolar classes."
                ),
            ),
            body=(
                "Solvents are classified on two axes, and both matter. The "
                "first is polarity, quantified for practical purposes by "
                "dielectric constant, which measures how well the medium "
                "screens two charges from each other. Water leads at 78.4; "
                "dimethyl sulfoxide reaches 46.7, acetonitrile 37.5, "
                "methanol 32.7; at the other end, diethyl ether manages "
                "4.3, toluene 2.4 and hexane 1.9. A solvent must have a "
                "high dielectric constant to dissolve an ionic compound at "
                "all, because separating a cation from an anion is "
                "prohibitively costly in a medium that does not screen "
                "them.\n\n"
                "The second axis is whether the solvent has a "
                "hydrogen-bond donor: PROTIC solvents such as water, the "
                "alcohols and carboxylic acids have an O-H or N-H; POLAR "
                "APROTIC solvents such as acetone, dimethyl sulfoxide, "
                "dimethylformamide and acetonitrile are polar but have no "
                "donor. This distinction has enormous consequences for "
                "reactivity, as chapter 9 will demonstrate. A protic "
                "solvent surrounds an anion with a cage of donated hydrogen "
                "bonds, stabilising it and making it a poorer nucleophile. "
                "A polar aprotic solvent solvates the CATION well - its "
                "electron-rich end points inward at the positive charge - "
                "while leaving the anion comparatively bare and therefore "
                "far more reactive. Same polarity, opposite consequences."
            ),
            table=Table(
                caption="Solvents by class and dielectric constant",
                columns=("Solvent", "Class", "Dielectric constant"),
                rows=(
                    ("water", "protic", "78.4"),
                    ("methanol", "protic", "32.7"),
                    ("ethanol", "protic", "24.5"),
                    ("acetic acid", "protic", "6.2"),
                    ("dimethyl sulfoxide", "polar aprotic", "46.7"),
                    ("acetonitrile", "polar aprotic", "37.5"),
                    ("dimethylformamide", "polar aprotic", "36.7"),
                    ("acetone", "polar aprotic", "20.7"),
                    ("dichloromethane", "weakly polar", "8.9"),
                    ("tetrahydrofuran", "weakly polar", "7.6"),
                    ("diethyl ether", "weakly polar", "4.3"),
                    ("toluene", "nonpolar", "2.4"),
                    ("hexane", "nonpolar", "1.9"),
                ),
                source=DIELECTRIC,
                note=(
                    "Values vary by a few per cent with temperature and "
                    "source; the classification and the ordering, which is "
                    "what predictions rest on, do not."
                ),
            ),
        ),
        ReadingSection(
            id="ionic-solutes",
            heading="Dissolving a salt",
            body=(
                "An ionic solid is held by ion-ion attraction throughout a "
                "lattice, and the total energy of that arrangement - the "
                "lattice energy - is large, several hundred to over a "
                "thousand kilojoules per mole. Dissolving one therefore "
                "requires paying an enormous enthalpy bill, and only one "
                "thing can pay it: ion-dipole interactions between each "
                "freed ion and many surrounding solvent molecules.\n\n"
                "Water is exceptionally good at this. Its molecules are "
                "small, so many can crowd around one ion; its dipole is "
                "large; and it can orient either end inward, presenting "
                "oxygen to a cation and hydrogen to an anion. Six or so "
                "water molecules in a first solvation shell, each worth "
                "tens of kilojoules per mole, can approach or exceed the "
                "lattice energy, and water's high dielectric constant then "
                "keeps the separated ions from finding each other again. "
                "Hexane can do none of this: no dipole to orient, no "
                "screening, and so sodium chloride is completely insoluble "
                "in it. The competition is genuinely close, which is why "
                "solubility varies so widely among salts - silver chloride "
                "and calcium carbonate have lattice energies that water "
                "cannot repay, and they stay solid."
            ),
        ),
        ReadingSection(
            id="solvation-shells",
            heading="What a dissolved species is actually wearing",
            body=(
                "It is worth picturing a dissolved ion concretely, because "
                "the picture explains several results at once. A sodium ion "
                "in water is not a bare sphere moving through a "
                "structureless medium. It is surrounded by a first "
                "solvation shell of roughly six water molecules, each "
                "pointing its oxygen inward at the positive charge and held "
                "there firmly enough to travel with the ion. Beyond that "
                "sits a looser second shell, oriented by the first, and "
                "beyond that the bulk.\n\n"
                "Two consequences follow. The first is size inversion: the "
                "smaller the bare ion, the more concentrated its charge and "
                "the more tightly it holds its shell, so the HYDRATED "
                "lithium ion is larger and moves more slowly through water "
                "than the hydrated caesium ion, even though bare lithium is "
                "much the smaller. Ion mobilities in solution follow the "
                "hydrated size, not the bare one. The second is reactivity: "
                "a nucleophile in a protic solvent must shed part of its "
                "shell before it can attack, and that shedding costs energy "
                "which shows up as a higher activation barrier. Fluoride, "
                "small and hard, holds its shell tightest and is the worst "
                "nucleophile in water despite being the most basic - a "
                "chapter-9 result that is entirely a solvation argument."
            ),
        ),
        ReadingSection(
            id="covalent-solutes",
            heading="Dissolving a molecular compound",
            body=(
                "Molecular solutes are the ordinary case in organic "
                "chemistry, and the bookkeeping is gentler because the "
                "interactions being broken are the modest ones of this "
                "chapter rather than a lattice. The rule that emerges is "
                "the practical form of like-dissolves-like: a solute "
                "dissolves well in a solvent that offers the SAME KIND of "
                "interaction it is giving up.\n\n"
                "Work through the cases. A nonpolar solute in a nonpolar "
                "solvent gives up dispersion and receives dispersion; the "
                "exchange is nearly even, entropy does the rest, and "
                "hydrocarbons mix freely with hydrocarbons. A polar solute "
                "in a polar solvent gives up dipole-dipole and hydrogen "
                "bonding and receives the same; methanol and water are "
                "miscible. A polar solute in a nonpolar solvent gives up "
                "hydrogen bonds and receives only dispersion, so the "
                "exchange loses badly and sugar does not dissolve in "
                "hexane. And a nonpolar solute in a polar solvent - hexane "
                "in water - gives up little and receives little, which "
                "sounds even, and yet they do not mix. That last case is "
                "the one the simple rule cannot explain, and it is the most "
                "important case in biology; it needs its own section."
            ),
        ),
        ReadingSection(
            id="hydrophobic-effect",
            heading="The hydrophobic effect, correctly explained",
            body=(
                "Why does oil not mix with water? The usual answer is that "
                "water molecules attract each other more than they attract "
                "oil, and that is true as far as it goes, but it "
                "understates and slightly misdescribes what happens. The "
                "dominant term is entropic, and it belongs to the water, "
                "not to the oil.\n\n"
                "Put a nonpolar molecule into water and the water "
                "molecules immediately around it face a problem. They "
                "cannot hydrogen bond to the intruder, and they will not "
                "give up hydrogen bonds, so they arrange themselves into an "
                "ordered cage around it - a shell in which each water "
                "molecule points its donors and acceptors at other waters "
                "rather than at the solute. Those caged waters keep their "
                "hydrogen bonds and lose their freedom. The entropy of the "
                "system falls, $-T\\Delta S$ becomes positive, and "
                "$\\Delta G$ for dissolving is unfavourable even though "
                "$\\Delta H$ may be close to zero or slightly negative. "
                "Nonpolar molecules then aggregate - not because they "
                "attract each other especially, but because clustering "
                "reduces the total surface that must be caged and RELEASES "
                "ordered water back into the bulk. The hydrophobic effect "
                "is water regaining its entropy, and the oil droplet is a "
                "by-product."
            ),
            important=(
                "Hydrophobic aggregation is driven by the entropy of the "
                "WATER, not by attraction between the nonpolar molecules. "
                "That is why the effect strengthens with temperature over "
                "the biological range, and why it is the exception that "
                "breaks the enthalpy-only reading of like-dissolves-like."
            ),
        ),
        ReadingSection(
            id="alcohol-series",
            heading="Pricing the tail: the alcohol series",
            figure=Figure(
                stem="org1-alcohol-solubility",
                caption=(
                    "Water solubility of the unbranched 1-alkanols on a "
                    "logarithmic axis: one hydroxyl throughout, and roughly "
                    "a threefold fall for every carbon added to the tail."
                ),
                alt=(
                    "Logarithmic plot of solubility in grams per hundred "
                    "millilitres against carbons, falling from 7.3 at four "
                    "carbons to 0.054 at eight, with the first three "
                    "members marked as fully miscible."
                ),
            ),
            body=(
                "The alcohols let you watch the competition between a polar "
                "head and a nonpolar tail resolve itself one carbon at a "
                "time. Methanol, ethanol and propan-1-ol are miscible with "
                "water in all proportions. Butan-1-ol dissolves to about "
                "7.3 grams per hundred millilitres; pentan-1-ol 2.2; "
                "hexan-1-ol 0.59; heptan-1-ol 0.17; octan-1-ol 0.054. On a "
                "logarithmic axis those points fall on a straight line, "
                "which means each added CH2 multiplies the solubility by "
                "roughly the same factor - about a third.\n\n"
                "That constant factor is the hydrophobic effect priced per "
                "carbon, and it is one of the more elegant numbers in "
                "physical organic chemistry: each additional methylene "
                "adds a fixed area of surface that water must cage, and a "
                "fixed entropic penalty, and a fixed multiplicative cost in "
                "solubility. The crossover from miscible to sparingly "
                "soluble happens between three and four carbons per "
                "hydroxyl, which is the origin of the rule of thumb that "
                "one polar group carries about four or five carbons. Adding "
                "polar groups moves the boundary: ethane-1,2-diol and "
                "glycerol are miscible despite their carbons because each "
                "carries a hydroxyl, and glucose, with five oxygens on six "
                "carbons, is freely water-soluble."
            ),
            table=Table(
                caption="Water solubility of the unbranched 1-alkanols",
                columns=("Alcohol", "Carbons",
                         "Solubility (g per 100 mL water)"),
                rows=(
                    ("methanol", "1", "miscible"),
                    ("ethanol", "2", "miscible"),
                    ("propan-1-ol", "3", "miscible"),
                    ("butan-1-ol", "4", "7.3"),
                    ("pentan-1-ol", "5", "2.2"),
                    ("hexan-1-ol", "6", "0.59"),
                    ("heptan-1-ol", "7", "0.17"),
                    ("octan-1-ol", "8", "0.054"),
                ),
                source="Aqueous solubilities near 293-298 K from " + CRC,
            ),
        ),
        ReadingSection(
            id="solids",
            heading="Why a solid solute has an extra hurdle",
            body=(
                "Dissolving a solid costs more than dissolving a liquid of "
                "the same structure, because the lattice must be destroyed "
                "as well as the molecules separated - the same packing term "
                "that governed melting point in the previous node. A "
                "high-melting solid is one whose lattice is stable, and a "
                "stable lattice resists dissolution as well as melting.\n\n"
                "This is why melting point is a useful predictor of "
                "solubility among structurally similar solids, and it "
                "explains cases that otherwise look anomalous. The "
                "nitrophenols return here: 4-nitrophenol, with its "
                "extensive intermolecular hydrogen-bonded lattice and its "
                "higher melting point, is less soluble in nonpolar solvents "
                "than 2-nitrophenol, whose intramolecular hydrogen bond "
                "leaves it with a weaker lattice. It also explains the "
                "central technique of recrystallisation, in which a "
                "solvent is chosen so that the compound is soluble hot and "
                "insoluble cold. That technique depends on solubility "
                "rising steeply with temperature, which happens because "
                "$T\\Delta S$ grows while the lattice term does not, and "
                "the purification works because the impurities are present "
                "in too small an amount to reach saturation on cooling."
            ),
        ),
        ReadingSection(
            id="gases",
            heading="Dissolving a gas, and why it gets worse when warm",
            body=(
                "Gases dissolve too, and the same bookkeeping applies with "
                "one term removed: there are no solute-solute interactions "
                "to break, since the gas molecules were already apart. Only "
                "the cavity cost and the solute-solvent gain remain, and "
                "the ordering follows the usual rule. At 298 K and one "
                "atmosphere of the pure gas, oxygen dissolves in water to "
                "about 40 milligrams per litre and nitrogen to about 17, "
                "both being nonpolar and offering water almost nothing; "
                "carbon dioxide reaches about 1.45 grams per litre, nearly "
                "forty times more, because its quadrupolar charge "
                "distribution and its partial conversion to carbonic acid "
                "give water something to work with.\n\n"
                "Gas solubility has one property that sets it apart: it "
                "DECREASES as temperature rises, where most solids become "
                "more soluble. The reason is the entropy term changing "
                "sign in effect - dissolving a gas takes a free molecule "
                "and confines it in a solvent cage, which lowers entropy, "
                "so raising the temperature makes $-T\\Delta S$ more "
                "punishing. The consequences are visible and important: "
                "bubbles form in a pan of water long before it boils, warm "
                "rivers hold less dissolved oxygen and support less "
                "aquatic life, and a fizzy drink goes flat faster when "
                "warm. It is also why decompression sickness exists, "
                "nitrogen having dissolved in tissue under pressure and "
                "coming out of solution when the pressure falls."
            ),
        ),
        ReadingSection(
            id="partition",
            heading="Partitioning between two phases",
            body=(
                "Solubility is usually taught as a yes-or-no property and "
                "is more useful as a ratio. Shake a compound with water and "
                "an immiscible organic solvent and it distributes between "
                "them in a fixed proportion at equilibrium; the ratio of "
                "its concentrations is the partition coefficient, and it is "
                "a property of the compound and the solvent pair, not of "
                "the amount used.\n\n"
                "Medicinal chemistry uses a standardised version: the "
                "octanol-water partition coefficient, reported as its "
                "logarithm and written log P. A log P of zero means the "
                "compound divides equally; positive values mean it prefers "
                "the organic phase and is lipophilic; negative values mean "
                "it prefers water. The quantity is a direct measure of the "
                "balance this node has been describing between polar groups "
                "and hydrocarbon surface, and each added CH2 raises log P "
                "by roughly half a unit - which is the alcohol series' "
                "threefold-per-carbon rule expressed on a different scale. "
                "Partitioning is also the basis of liquid-liquid extraction "
                "in the laboratory, where a favourable partition "
                "coefficient and two or three small washes recover far more "
                "compound than one large one."
            ),
        ),
        ReadingSection(
            id="extraction",
            heading="Acid-base extraction: switching solubility on command",
            body=(
                "The most powerful laboratory application of this node "
                "combines it with chapter 3. A carboxylic acid is a neutral "
                "organic molecule and dissolves in ether; its sodium salt "
                "is ionic and dissolves in water. So shaking an ethereal "
                "solution of a carboxylic acid with aqueous sodium "
                "hydroxide converts the acid to its carboxylate and pulls "
                "it into the aqueous layer, leaving neutral organic "
                "compounds behind in the ether.\n\n"
                "Acidifying the aqueous layer then reprotonates the "
                "carboxylate, and the neutral acid precipitates or can be "
                "extracted back into fresh ether. The same trick works in "
                "reverse for amines, which are pulled into water as their "
                "ammonium salts by dilute acid and released by base. A "
                "three-component mixture of an acid, a base and a neutral "
                "compound can be separated completely with two washes and "
                "no chromatography at all. What makes it work is that "
                "ionisation moves a compound a whole category up the "
                "interaction ladder - from dispersion and hydrogen bonding "
                "to ion-dipole - and that this move is reversible on "
                "demand by changing pH. It is chapter 3 and chapter 8 used "
                "together, and it is the most common purification in a "
                "synthetic laboratory."
            ),
        ),
        ReadingSection(
            id="chromatography",
            heading="Chromatography is this node, run as a competition",
            body=(
                "Extraction partitions a compound between two liquids "
                "once. Chromatography partitions it thousands of times "
                "between a moving liquid and a stationary surface, and the "
                "small differences in partition coefficient that a single "
                "extraction cannot exploit accumulate into complete "
                "separation. Every principle it uses is in this node.\n\n"
                "In normal-phase chromatography the stationary phase is "
                "silica, whose surface is covered in Si-OH groups and is "
                "therefore strongly polar and hydrogen-bonding, while the "
                "mobile phase is a nonpolar or weakly polar solvent. Polar "
                "compounds bind the silica and move slowly; nonpolar "
                "compounds stay in the mobile phase and move fast, which is "
                "why a hydrocarbon runs near the solvent front on a "
                "thin-layer plate and a carboxylic acid barely leaves the "
                "baseline. Making the eluent more polar - the standard move "
                "of adding ethyl acetate to hexane - gives the solute "
                "something better to dissolve in and moves everything up "
                "the plate. Reversed-phase chromatography inverts the whole "
                "arrangement, bonding a hydrocarbon layer to the silica and "
                "running an aqueous mobile phase, so that retention now "
                "measures lipophilicity - and, unsurprisingly, correlates "
                "closely with log P."
            ),
        ),
        ReadingSection(
            id="amphiphiles",
            heading="Molecules that refuse to choose",
            body=(
                "A molecule with a large nonpolar tail and a strongly "
                "polar or ionic head cannot satisfy both halves in one "
                "solvent, and its response to that conflict organises much "
                "of biology. In water the heads are comfortable and the "
                "tails are not, so the molecules aggregate with tails "
                "inward and heads outward, hiding the hydrocarbon from "
                "water and minimising the surface that must be caged.\n\n"
                "Which structure forms depends on the shape of the "
                "molecule. A single tail with a bulky head gives a cone, "
                "and cones pack into spheres: a micelle, which is what soap "
                "forms and how it removes grease, by taking nonpolar dirt "
                "into its hydrocarbon interior and carrying it away in "
                "water. Two tails with a modest head give a cylinder, and "
                "cylinders pack into sheets: a bilayer, which is the "
                "structure of every cell membrane. The concentration at "
                "which aggregation begins is sharp enough to have a name, "
                "the critical micelle concentration, and it falls as the "
                "tail lengthens - exactly as the alcohol solubility series "
                "predicts. Membranes are not a special case of chemistry; "
                "they are the hydrophobic effect acting on molecules of a "
                "particular shape."
            ),
        ),
        ReadingSection(
            id="drug-solubility",
            heading="Membranes and drug absorption",
            body=(
                "A drug taken by mouth must dissolve in the aqueous "
                "contents of the gut and then cross a lipid bilayer to "
                "reach the blood, and those two requirements pull in "
                "opposite directions. Too polar and it dissolves but will "
                "not cross; too lipophilic and it crosses readily but never "
                "dissolves well enough to present itself. Oral drugs "
                "therefore occupy a window of log P, in practice roughly "
                "between zero and five, and medicinal chemists spend a "
                "great deal of effort keeping compounds inside it.\n\n"
                "The same balance produces two familiar formulation moves. "
                "Basic drugs are usually supplied as hydrochloride salts, "
                "which dissolve far better in the stomach's aqueous acid "
                "and then, once absorbed into the more neutral blood, "
                "revert partly to the neutral lipophilic form that can "
                "cross membranes - a pH-driven switch identical in "
                "principle to the acid-base extraction two sections ago. "
                "And drugs intended to reach the brain must additionally "
                "cross the blood-brain barrier, which is more lipid and "
                "less permeable than an ordinary capillary wall, so "
                "central-nervous-system drugs are systematically smaller "
                "and less polar than drugs with peripheral targets. The "
                "reason an antihistamine makes you drowsy or does not is "
                "largely a log P decision."
            ),
        ),
        ReadingSection(
            id="temperature",
            heading="Temperature, and the technique that depends on it",
            body=(
                "Most solids become more soluble as temperature rises, and "
                "the reason sits in the free-energy expression: the "
                "favourable entropy of mixing is multiplied by $T$, so "
                "raising the temperature amplifies the term that favours "
                "dissolution while leaving the lattice and interaction "
                "terms largely unchanged. The size of the effect varies "
                "enormously between compounds, and that variation is what "
                "makes purification by recrystallisation possible.\n\n"
                "The technique needs a solvent in which the target is "
                "poorly soluble cold and freely soluble hot. Dissolve the "
                "crude solid in the minimum volume of hot solvent, cool "
                "slowly, and the target - present in large amount - passes "
                "its saturation point and crystallises, while impurities, "
                "present in small amount, remain below saturation and stay "
                "in solution. Slow cooling matters because rapid "
                "crystallisation traps impurities inside the growing "
                "lattice, and the whole selectivity of the method depends "
                "on molecules being able to reject a poorly fitting "
                "neighbour - which is the packing argument of the previous "
                "node deciding a purity, not merely a melting point. When a "
                "recrystallisation fails, the usual diagnosis is a solvent "
                "whose solubility curve is too flat."
            ),
        ),
        ReadingSection(
            id="ion-binders",
            heading="Designed molecules that dissolve the undissolvable",
            body=(
                "The most striking demonstration that solubility is "
                "engineerable came from a class of synthetic molecules "
                "designed to do to a metal ion what water does. A crown "
                "ether is a ring of alternating carbons and oxygens - "
                "18-crown-6 has six oxygens in an eighteen-membered ring - "
                "with all the lone pairs pointing INTO the cavity and the "
                "hydrocarbon backbone facing out. A potassium ion fits that "
                "cavity almost exactly and is held by six ion-dipole "
                "interactions, precisely as it would be by six waters.\n\n"
                "The consequence is that potassium permanganate, an ionic "
                "solid entirely insoluble in benzene, dissolves in benzene "
                "in the presence of 18-crown-6: the cation is wrapped in a "
                "molecule whose exterior is hydrocarbon, the anion follows "
                "for charge balance, and the resulting bare permanganate is "
                "a far more aggressive oxidant than its hydrated form. "
                "Cryptands extend the idea into three dimensions and bind "
                "more tightly still. The selectivity is a size match - "
                "18-crown-6 prefers potassium, the smaller 15-crown-5 "
                "prefers sodium - and nature discovered the same principle "
                "first: the antibiotic valinomycin is a ring that carries "
                "potassium across bacterial membranes and kills the cell by "
                "collapsing its ion gradient, and the potassium channels of "
                "your own neurons select their ion by exactly this kind of "
                "coordination geometry."
            ),
        ),
        ReadingSection(
            id="common-errors-solubility",
            heading="Four ways this node is misapplied",
            body=(
                "First, treating like-dissolves-like as a law rather than "
                "an enthalpy heuristic. It predicts three of the four "
                "combinations correctly and gets the fourth - nonpolar in "
                "polar - right for the wrong reason, which matters because "
                "the right reason is the one biology uses. Second, "
                "explaining hydrophobic aggregation as attraction between "
                "nonpolar molecules. The dispersion between two oil "
                "molecules is real but small; the driving term is the "
                "entropy of the water they displace.\n\n"
                "Third, reading a functional group as a switch. An OH does "
                "not make a compound water-soluble; it competes with "
                "whatever hydrocarbon is attached, and past four or five "
                "carbons the hydrocarbon wins. Count both sides. Fourth, "
                "collapsing polarity and the protic-aprotic distinction "
                "into one axis. Acetone and ethanol have comparable "
                "dielectric constants and behave completely differently "
                "toward an anion, because only one of them can donate a "
                "hydrogen bond to it. That single distinction accounts for "
                "several of the rate comparisons in the next chapter, and a "
                "student who has merged the two axes into 'polarity' will "
                "have no way to explain them."
            ),
        ),
        ReadingSection(
            id="worked-solubility",
            heading="Worked example: four compounds, two solvents",
            body=(
                "Predict the behaviour of sodium chloride, glucose, "
                "octan-1-ol and hexane in water and in hexane. Sodium "
                "chloride is ionic and needs ion-dipole solvation and a "
                "high dielectric constant: soluble in water, completely "
                "insoluble in hexane. Glucose has five hydroxyls and an "
                "aldehyde on six carbons, so it is dominated by hydrogen "
                "bonding: freely soluble in water, insoluble in hexane, "
                "which can offer it nothing for the bonds it must give "
                "up.\n\n"
                "Octan-1-ol is the interesting one. Eight carbons of tail "
                "against one hydroxyl puts it well past the crossover, so "
                "it is only sparingly soluble in water at 0.054 grams per "
                "hundred millilitres - and it is miscible with hexane, "
                "because its dominant region is hydrocarbon. It is "
                "precisely this two-faced character that makes octanol the "
                "reference phase for log P measurements. Hexane is nonpolar "
                "throughout: miscible with hexane, and immiscible with "
                "water for the entropic reason given earlier. Note the "
                "shape of the reasoning: identify the dominant region of "
                "the solute, ask what interaction it needs, and ask whether "
                "the solvent can supply it. Three steps, and no case in "
                "this course requires a fourth."
            ),
        ),
        ReadingSection(
            id="closing-solubility",
            heading="Closing the chapter",
            body=(
                "The chapter set out to explain physical behaviour from "
                "structure, and it is worth measuring what that has bought. "
                "From a drawing alone you can now estimate a boiling point "
                "ordering, predict a melting-point anomaly, choose an "
                "extraction solvent, know which layer of a separating "
                "funnel to keep, decide whether a compound will dissolve in "
                "water, and explain why a drug is absorbed or is not. None "
                "of that involved a single curly arrow.\n\n"
                "The chapter also leaves a debt that the next one collects. "
                "Chapter 9 opens with substitution and elimination at "
                "saturated carbon, and its central results are solvent "
                "effects: why a polar aprotic solvent accelerates "
                "substitution by leaving the nucleophile bare, why a protic "
                "solvent favours ionisation by solvating both ions, why "
                "iodide is a better nucleophile than fluoride in water and "
                "the order reverses in the gas phase, and why a good "
                "leaving group is one whose charge the solvent can "
                "comfortably accommodate. Every one of those is a statement "
                "about noncovalent interactions between a solute and its "
                "surroundings, which is to say every one of them is this "
                "chapter, arriving in mechanistic clothing. Read the "
                "solvent line of a reaction scheme from now on as part of "
                "the mechanism rather than as a note about glassware; the "
                "compounds in the flask are not the only participants, and "
                "the medium they are dissolved in has been selected as "
                "deliberately as any reagent written above the arrow, and "
                "for reasons this chapter has now given you in full."
            ),
        ),
    ),
    key_takeaways=(
        "Dissolving exchanges solute-solute and solvent-solvent interactions for solute-solvent ones; it happens when the new interactions are comparable in kind and strength to those surrendered.",
        "Like dissolves like is a statement about ENTHALPY only. Entropy usually favours mixing, which is why a roughly even exchange still gives a solution.",
        "Two solvent axes: dielectric constant (needed to dissolve ions) and protic against aprotic (decides whether an anion is caged or left bare) - the distinction chapter 9 turns on.",
        "The hydrophobic effect is entropic and belongs to the WATER: caging a nonpolar solute orders water, so nonpolar molecules aggregate to release it.",
        "One polar group carries about four or five carbons. The 1-alkanols fall roughly threefold in water solubility per added CH2: 7.3 g/100 mL at C4 down to 0.054 at C8.",
        "Ionisation moves a compound a whole category up the ladder and is reversible by pH - which is what makes acid-base extraction the workhorse purification.",
    ),
    exam_tips=(
        "The MCAT asks the hydrophobic effect as an ENTROPY question. If an answer choice says nonpolar molecules attract each other strongly, it is the distractor.",
        "Micelles, bilayers and detergent action are all one idea: an amphiphile hiding its tail from water. Expect the shape-to-structure link (one tail gives micelles, two give bilayers).",
        "log P questions are asking about the balance between polar groups and hydrocarbon surface. Roughly +0.5 log units per CH2 is enough arithmetic for any stem you will meet.",
    ),
))
# NODES GO HERE

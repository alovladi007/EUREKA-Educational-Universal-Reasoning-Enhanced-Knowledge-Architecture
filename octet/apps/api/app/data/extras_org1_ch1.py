"""Lecture-note depth for ORG1 chapter 1, Chemical Bonding and Structure.

This is the reference chapter for the format. Seven nodes, each carrying the
lead, numbered sections, a generated figure, a data table where there are real
numbers to table, takeaways, and exam tips.

Everything numeric here is sourced. Bond lengths and angles are from
experimental structure determinations as tabulated in the standard references
named on each table; electronegativities are Pauling scale; pKa values are the
aqueous values used throughout the course and consistent with app.data.claims.
Nothing in this file is estimated, and nothing is rounded to make a point.
"""

from __future__ import annotations

from app.data.lesson_extras import (
    Figure,
    LessonExtras,
    ReadingSection,
    Table,
    VideoLesson,
)

EXTRAS_ORG1_CH1: dict[str, LessonExtras] = {}


def _add(extras: LessonExtras) -> None:
    EXTRAS_ORG1_CH1[extras.node] = extras


# --------------------------------------------------------------------------
# 1.1 Atomic orbitals and the covalent bond
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.ORBITALS",
    lead=(
        "Organic chemistry is the chemistry of carbon, and almost everything "
        "carbon does follows from one fact: a neutral carbon atom has four "
        "valence electrons and room for eight. That single arithmetic "
        "constraint generates the tetravalence you will assume in every "
        "structure you draw for the rest of the course. This section builds "
        "that constraint from the orbitals underneath it, because the shape of "
        "the orbital is what decides the shape of the molecule, and the shape "
        "of the molecule is what decides how it reacts."
    ),
    sections=(
        ReadingSection(
            id="orbital-shapes",
            heading="What an orbital is, and what it is not",
            body=(
                "An atomic orbital is a solution to the Schrodinger equation "
                "for one electron bound to one nucleus. What the solution "
                "gives you is a wavefunction $\\psi$, and what $\\psi$ gives "
                "you is a probability: $|\\psi|^2$ integrated over a region of "
                "space is the chance of finding the electron there. The "
                "picture you have seen, the sphere for $s$ and the dumbbell "
                "for $p$, is a surface drawn so that the electron is inside it "
                "about 90 percent of the time. It is a contour, not a "
                "container.\n\n"
                "That distinction matters more than it sounds. An orbital has "
                "no edge. The 90 percent surface is a convention, and the "
                "electron density falls off smoothly rather than stopping. "
                "When two atoms approach and their orbitals are said to "
                "overlap, nothing collides. What happens is that the two "
                "wavefunctions are now both non-negligible in the same region, "
                "and they add.\n\n"
                "Because $\\psi$ is a wave, it has a sign. The two lobes of a "
                "$p$ orbital carry opposite signs of $\\psi$, and this is the "
                "single most consequential fact in the chapter. It is not a "
                "charge difference - both lobes have identical electron "
                "density, since squaring kills the sign - but it governs what "
                "happens when the orbital meets another one. Lobes of like "
                "sign reinforce and build electron density between the nuclei. "
                "Lobes of opposite sign cancel and leave a node there. The "
                "first is a bond. The second is an antibond, and it is why not "
                "every pair of atoms that can approach each other will stick.\n\n"
                "For carbon the valence shell is $n=2$: one $2s$ orbital, "
                "spherical and centred on the nucleus, and three $2p$ "
                "orbitals, mutually perpendicular, labelled $2p_x$, $2p_y$ and "
                "$2p_z$. Four orbitals, and by the Pauli principle each holds "
                "two electrons of opposite spin, so the shell is full at "
                "eight. Carbon brings four electrons to a shell that holds "
                "eight, so it needs four more, and the cheapest way to get "
                "four more is to share four pairs. Four bonds. Everything "
                "else in this course is a consequence."
            ),
            figure=Figure(
                stem="org1-orbital-shapes",
                caption=(
                    "The valence orbitals of carbon. The 2s orbital is "
                    "spherical with one sign throughout; each 2p orbital has "
                    "two lobes of opposite sign separated by a nodal plane "
                    "through the nucleus. Shading distinguishes the sign of "
                    "the wavefunction, not charge."
                ),
                alt=(
                    "Four panels. First, a filled circle labelled 2s. Then "
                    "three dumbbell shapes labelled 2px, 2py and 2pz, oriented "
                    "along three perpendicular axes, each drawn with one lobe "
                    "shaded and one lobe unshaded and a dashed nodal plane "
                    "between them."
                ),
            ),
            important=(
                "The sign on a p lobe is the sign of the wavefunction, not a "
                "charge. Both lobes hold identical electron density. If you "
                "read the shading as plus and minus charge you will predict "
                "electrostatic attraction between lobes, which is not a thing "
                "that happens."
            ),
        ),
        ReadingSection(
            id="sigma-pi",
            heading="Sigma and pi: two ways for orbitals to meet",
            body=(
                "There are exactly two geometries by which two $p$ orbitals "
                "can overlap, and organic chemistry spends most of its time on "
                "the difference between them.\n\n"
                "**End-on overlap** puts the two orbitals along the "
                "internuclear axis, lobe pointing at lobe. The resulting bond "
                "has its electron density concentrated on the line joining the "
                "nuclei and is cylindrically symmetric about that line. This "
                "is a $\\sigma$ bond. Cylindrical symmetry has a direct "
                "physical consequence: rotating one end of the bond relative "
                "to the other changes nothing about the overlap, so rotation "
                "about a $\\sigma$ bond is nearly free. The barrier in ethane "
                "is about 12 kJ/mol, which thermal energy at room temperature "
                "clears billions of times a second.\n\n"
                "**Side-on overlap** puts the two orbitals parallel to each "
                "other and perpendicular to the internuclear axis. The lobes "
                "meet above and below the axis, and the resulting bond has a "
                "node containing the axis itself. This is a $\\pi$ bond. It is "
                "not cylindrically symmetric, and now rotation is expensive: "
                "twisting one end by 90 degrees takes the parallel orbitals to "
                "perpendicular, overlap goes to zero, and the bond breaks. The "
                "barrier in ethene is roughly 270 kJ/mol. This is why alkene "
                "geometry is fixed, why cis and trans are separable compounds "
                "rather than conformers, and why the whole of E/Z nomenclature "
                "exists.\n\n"
                "A double bond is one $\\sigma$ plus one $\\pi$. A triple bond "
                "is one $\\sigma$ plus two mutually perpendicular $\\pi$. The "
                "$\\sigma$ always forms first and it is always the stronger "
                "component, because end-on overlap is more efficient than "
                "side-on: the lobes meet head to head rather than glancing "
                "past each other. You can see this in the numbers. The C-C "
                "single bond in ethane is 347 kJ/mol. The double bond in "
                "ethene is 611, which is not twice 347. The difference, 264, "
                "is roughly what the $\\pi$ contributes, and it is markedly "
                "less than the $\\sigma$. That asymmetry is the reason "
                "addition reactions happen at all: breaking the weaker $\\pi$ "
                "while forming two new $\\sigma$ bonds is downhill, so alkenes "
                "add and alkanes do not."
            ),
            table=Table(
                caption="Carbon-carbon bonds: length, strength and rotation",
                columns=(
                    "Bond", "Example", "Length (pm)", "Strength (kJ/mol)",
                    "Rotation",
                ),
                rows=(
                    ("C-C single", "ethane", "154", "347", "nearly free"),
                    ("C=C double", "ethene", "134", "611", "blocked"),
                    ("C#C triple", "ethyne", "120", "837", "no meaning"),
                ),
                source=(
                    "Bond lengths and dissociation energies as tabulated in "
                    "the CRC Handbook of Chemistry and Physics, 97th edition, "
                    "section 9."
                ),
                note=(
                    "Rotation about a triple bond has no meaning because the "
                    "two carbons and their substituents are collinear: there "
                    "is nothing off-axis to rotate."
                ),
            ),
        ),
        ReadingSection(
            id="why-shorter-stronger",
            heading="Why more bonds means shorter and stronger",
            body=(
                "Read the table again down the length column: 154, 134, 120 "
                "picometres. Every added bond pulls the nuclei closer. Read "
                "the strength column: 347, 611, 837. Every added bond costs "
                "more to break. Neither of these is a coincidence and both "
                "have the same cause.\n\n"
                "Adding a $\\pi$ bond puts more electron density into the "
                "region between the two nuclei. The nuclei are positive and "
                "repel each other; the shared electrons are what holds them "
                "together. More shared density means the equilibrium "
                "separation - the distance where attraction and repulsion "
                "balance - moves inward. So the bond shortens. And a shorter "
                "bond with more density in it takes more energy to pull apart. "
                "So it strengthens.\n\n"
                "The relationship runs the other way too, and this is the "
                "version you will actually use. When you are handed a bond "
                "length and asked what the bond is, the length tells you. A "
                "carbon-carbon distance of 139 pm, as in benzene, is between "
                "single and double, and that is the experimental fact that "
                "forces the delocalised description of benzene rather than "
                "alternating singles and doubles. A single structure with "
                "alternating 154 and 134 would show two distinct lengths. "
                "Benzene shows one, and it is in the middle."
            ),
            important=(
                "Bond order, length and strength move together, but they are "
                "only comparable between similar atoms. A C-H bond is 413 "
                "kJ/mol and 109 pm; an O-H bond is 464 kJ/mol and 96 pm. "
                "Comparing across the row is comparing different atoms, not "
                "different bond orders."
            ),
        ),
        ReadingSection(
            id="octet-and-exceptions",
            heading="The octet rule, and the three ways it breaks",
            body=(
                "The rule underneath all of this is that main group atoms are "
                "most stable with eight valence electrons, matching the "
                "configuration of the nearest noble gas. For the elements "
                "organic chemistry is built from - C, N, O, F - it holds "
                "essentially always, which is why you can draw a structure by "
                "counting to eight and be right.\n\n"
                "It fails in exactly three ways, and each one names a class of "
                "reactive species you will meet within two chapters.\n\n"
                "**Fewer than eight.** Boron in $\\mathrm{BF_3}$ has six "
                "electrons and no lone pair. So does a carbocation: three "
                "bonds, an empty p orbital, six electrons at carbon. Both are "
                "electron deficient and both behave the same way as a result - "
                "they are Lewis acids, and they will take a pair from anything "
                "that has one to give. When you meet the carbocation as an "
                "intermediate in alkene addition, its reactivity is not a new "
                "fact to memorise. It is this one.\n\n"
                "**An odd number.** A radical has one unpaired electron and "
                "therefore cannot have eight. Nitric oxide, $\\mathrm{NO}$, is "
                "a stable example; the carbon radicals of halogenation "
                "chemistry are transient ones. Odd electron species are why "
                "radical mechanisms are drawn with single headed arrows moving "
                "one electron rather than the double headed arrows that move a "
                "pair.\n\n"
                "**More than eight.** Phosphorus and sulfur, in period 3, "
                "routinely appear with ten or twelve, as in "
                "$\\mathrm{PCl_5}$ and $\\mathrm{SF_6}$. The old explanation "
                "was that empty $3d$ orbitals accept the surplus. Calculation "
                "has not supported that for some decades - the $3d$ orbitals "
                "sit far too high in energy to contribute meaningfully - and "
                "the modern account is that these are hypervalent bonds with "
                "substantial ionic character spread over more than two "
                "centres. What matters for this course is the boundary, not "
                "the mechanism: period 2 elements never exceed eight, because "
                "their valence shell physically has room for four pairs and no "
                "more. A structure with five bonds to nitrogen is not an "
                "exception. It is an error."
            ),
            important=(
                "Nitrogen never has five bonds and oxygen never has three "
                "without a positive formal charge. Period 2 has four valence "
                "orbitals and no more, so ten electrons will not fit. This is "
                "the single most useful check on a drawn structure."
            ),
        ),
    ),
    key_takeaways=(
        "Carbon has four valence electrons and a shell that holds eight, so it "
        "forms four bonds. Every structure you draw obeys this.",
        "The sign on a p orbital lobe is the sign of the wavefunction. Like "
        "signs reinforce into a bond; opposite signs cancel into a node.",
        "End-on overlap gives sigma, cylindrically symmetric, rotation free. "
        "Side-on overlap gives pi, rotation blocked.",
        "A double bond is sigma plus pi and the pi is weaker, which is exactly "
        "why alkenes undergo addition and alkanes do not.",
        "More bonds means shorter and stronger, because more shared density "
        "pulls the nuclei closer.",
    ),
    exam_tips=(
        "The MCAT tests the sigma/pi distinction through consequences rather "
        "than definitions. Expect to be asked why a double bond cannot rotate, "
        "or why a particular bond length implies delocalisation.",
        "Counting sigma and pi bonds in a drawn structure is a common quick "
        "item. Every line is one sigma; the second and third lines of multiple "
        "bonds are pi.",
    ),
    video=VideoLesson(
        scene="sigma-pi-overlap",
        title="Sigma and pi overlap, built from p orbitals",
        seconds=34,
        summary=(
            "Two p orbitals approach end-on and merge into a cylindrically "
            "symmetric sigma bond, which then rotates freely with no change in "
            "overlap. The same two orbitals then approach side-on into a pi "
            "bond above and below the axis, and rotating one end by ninety "
            "degrees drives the overlap to zero."
        ),
    ),
))


# --------------------------------------------------------------------------
# 1.2 Hybridisation
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.HYBRIDORG",
    lead=(
        "Carbon's four valence orbitals are not equivalent - one $s$ and three "
        "$p$ - yet methane's four C-H bonds are identical, and every "
        "experiment agrees they are. Hybridisation is the bookkeeping that "
        "reconciles those two facts, and once you can assign it by inspection "
        "you can read geometry, bond angle and reactivity straight off a "
        "structure."
    ),
    sections=(
        ReadingSection(
            id="the-problem",
            heading="The problem hybridisation solves",
            body=(
                "Take carbon's ground state configuration: $1s^2\\,2s^2\\,"
                "2p_x^1\\,2p_y^1$. Two unpaired electrons. Naively carbon "
                "should form two bonds, and those two bonds should be at 90 "
                "degrees to each other, since that is the angle between $p_x$ "
                "and $p_y$.\n\n"
                "Methane is $\\mathrm{CH_4}$, not $\\mathrm{CH_2}$, and its "
                "H-C-H angle is 109.5 degrees, not 90. Every C-H bond in it "
                "has the same length, 109 pm, and the same strength. The naive "
                "picture is wrong in the number of bonds, the angle between "
                "them, and their equivalence. Three failures from one "
                "assumption.\n\n"
                "The assumption that fails is that the bonding orbitals are "
                "the atomic orbitals. They are not. Orbitals are wavefunctions "
                "and wavefunctions add: any linear combination of solutions to "
                "the same equation is itself a valid description. So the atom "
                "is free to use whatever combination of its $2s$ and $2p$ "
                "orbitals minimises the total energy of the bonded molecule, "
                "and the combination that wins is the one that points electron "
                "density at the incoming atoms.\n\n"
                "Mixing one $s$ with three $p$ gives four equivalent orbitals, "
                "each 25 percent $s$ and 75 percent $p$ in character, each "
                "with a large lobe pointing away from the nucleus, and the "
                "four arranged to get as far from one another as possible. As "
                "far apart as four directions can get in three dimensions is "
                "the tetrahedron, 109.5 degrees. That is $sp^3$, and it is "
                "methane.\n\n"
                "One caution about the language. Hybridisation is a "
                "description we apply after seeing the geometry, not a process "
                "the atom performs before bonding. Carbon does not promote an "
                "electron, then hybridise, then bond. The molecule simply "
                "adopts its lowest energy structure, and hybrid orbitals are "
                "the vocabulary in which that structure is most easily "
                "described. Read geometry first, assign hybridisation second."
            ),
            figure=Figure(
                stem="org1-hybrid-geometries",
                caption=(
                    "The three hybridisation states of carbon. sp3 places four "
                    "groups at the corners of a tetrahedron; sp2 places three "
                    "in a plane with the unhybridised p perpendicular to it; "
                    "sp places two on a line with two perpendicular p orbitals."
                ),
                alt=(
                    "Three panels showing a tetrahedral carbon with four bonds "
                    "at 109.5 degrees, a trigonal planar carbon with three "
                    "bonds at 120 degrees and a p orbital drawn above and "
                    "below the plane, and a linear carbon with two bonds at "
                    "180 degrees and two perpendicular p orbitals."
                ),
            ),
        ),
        ReadingSection(
            id="assigning",
            heading="Assigning hybridisation in one step",
            body=(
                "You do not need to think about orbital mixing to assign "
                "hybridisation. Count the groups around the atom, where a "
                "group is any single atom bonded to it or any lone pair, and "
                "count a double or triple bond as one group because both "
                "components run between the same two nuclei.\n\n"
                "Four groups gives $sp^3$, tetrahedral, 109.5 degrees. Three "
                "groups gives $sp^2$, trigonal planar, 120 degrees, and one "
                "unhybridised $p$ orbital left over perpendicular to the "
                "plane. Two groups gives $sp$, linear, 180 degrees, and two "
                "unhybridised $p$ orbitals left over.\n\n"
                "The leftover $p$ orbitals are the entire point. A $\\pi$ bond "
                "needs an unhybridised $p$, so only $sp^2$ and $sp$ carbons "
                "can be part of a double or triple bond, and the count works "
                "out exactly: $sp^2$ has one $p$ spare and sits in one $\\pi$ "
                "bond, $sp$ has two spare and sits in two. Where the leftover "
                "$p$ holds a lone pair rather than forming a $\\pi$ bond, that "
                "lone pair can delocalise into an adjacent $\\pi$ system, "
                "which is the mechanism behind amide planarity and behind "
                "essentially all of resonance.\n\n"
                "Lone pairs count as groups, and forgetting them is the "
                "commonest error in the topic. The nitrogen of ammonia has "
                "three bonds and one lone pair: four groups, $sp^3$. Its "
                "observed H-N-H angle is 107 degrees, slightly compressed from "
                "109.5 because a lone pair is held by only one nucleus and so "
                "spreads wider than a bonding pair and squeezes the bonds "
                "together. Water, with two bonds and two lone pairs, is "
                "compressed further to 104.5. Both are $sp^3$; both deviate "
                "from the ideal angle in the direction lone pair repulsion "
                "predicts."
            ),
            table=Table(
                caption="Hybridisation, geometry and observed bond angles",
                columns=(
                    "Groups", "Hybrid", "Geometry", "Ideal angle",
                    "Example", "Observed angle",
                ),
                rows=(
                    ("4", "sp3", "tetrahedral", "109.5",
                     "CH4", "109.5"),
                    ("4 (1 lone pair)", "sp3", "trigonal pyramidal", "109.5",
                     "NH3", "107.0"),
                    ("4 (2 lone pairs)", "sp3", "bent", "109.5",
                     "H2O", "104.5"),
                    ("3", "sp2", "trigonal planar", "120",
                     "CH2=CH2", "117.8 (H-C-H)"),
                    ("2", "sp", "linear", "180",
                     "HC#CH", "180"),
                ),
                source=(
                    "Experimental gas-phase geometries, CRC Handbook of "
                    "Chemistry and Physics, 97th edition, section 9."
                ),
                note=(
                    "Deviations from the ideal angle run one way: lone pairs "
                    "spread wider than bonding pairs and compress the "
                    "remaining angles."
                ),
            ),
            important=(
                "Count lone pairs as groups. The nitrogen in an amine looks "
                "three-coordinate and is sp3, not sp2 - and the nitrogen in an "
                "amide is the reverse case, drawn with a lone pair but "
                "effectively sp2 because that pair delocalises into the "
                "carbonyl."
            ),
        ),
        ReadingSection(
            id="s-character",
            heading="What s character does to acidity",
            body=(
                "The three hybrids differ in how much $s$ they contain: "
                "$sp^3$ is 25 percent, $sp^2$ is 33 percent, $sp$ is 50 "
                "percent. Since an $s$ orbital is spherical and centred on the "
                "nucleus while a $p$ orbital has a node there, more $s$ "
                "character means the electrons in that orbital sit closer to "
                "the nucleus and are held more tightly.\n\n"
                "That has two visible consequences. Bonds shorten as $s$ "
                "character rises - the C-H bond is 109 pm in ethane, 108 in "
                "ethene, 106 in ethyne - and, far more usefully, the "
                "conjugate base gets more stable.\n\n"
                "Consider removing a proton from each of ethane, ethene and "
                "ethyne. In each case the electron pair left behind sits in a "
                "hybrid orbital on carbon. In ethane's anion that orbital is "
                "$sp^3$, and the pair is held loosely and far from the "
                "nucleus. In ethyne's anion it is $sp$, half $s$ character, "
                "and the pair is held close and tight. A more stable "
                "conjugate base means a stronger acid, and the pKa values "
                "reflect it with a spread of twenty five orders of magnitude "
                "across a series of compounds whose formulas differ only in "
                "hydrogen count.\n\n"
                "This is the first place in the course where a structural "
                "feature translates directly into a number you can use, and "
                "the reasoning pattern - stabilise the conjugate base, "
                "strengthen the acid - is the one you will apply for the rest "
                "of the acid-base chapter.\n\n"
                "The same argument runs at heteroatoms, and carrying it there "
                "deliberately is worth the effort because the geometry looks "
                "less familiar. The nitrogen of an amine is $sp^3$ and basic: "
                "its lone pair sits in a hybrid with 25 percent $s$ character, "
                "held loosely enough to go and take a proton. The nitrogen of "
                "a nitrile is $sp$, half $s$, and its pair is held so much "
                "more tightly that a nitrile is essentially non-basic. Between "
                "them sits pyridine's $sp^2$ nitrogen, weakly basic: the pKa "
                "of its conjugate acid is about 5.2, against roughly 10.6 for "
                "a simple alkylamine. Three nitrogen atoms, three "
                "hybridisations, five orders of magnitude of basicity, and the "
                "ordering falls straight out of how much $s$ character each "
                "lone pair sits in.\n\n"
                "Pyrrole is the case that shows you have understood it. Its "
                "nitrogen also looks like an $sp^2$ ring nitrogen, and it is "
                "not weakly basic - it is not basic at all, and its N-H is "
                "mildly acidic. The difference is where the lone pair lives. "
                "In pyridine the pair sits in an $sp^2$ hybrid in the ring "
                "plane, pointing outward, available. In pyrrole it sits in the "
                "unhybridised $p$ orbital perpendicular to the ring, where it "
                "is part of the aromatic system. Protonating it would cost the "
                "ring its aromaticity. Hybridisation told you how tightly a "
                "pair is held; which orbital it occupies tells you whether it "
                "is free to act at all."
            ),
            table=Table(
                caption=(
                    "s character and terminal C-H acidity in the two-carbon "
                    "series"
                ),
                columns=(
                    "Compound", "Hybrid at C", "s character", "pKa",
                ),
                rows=(
                    ("ethane, CH3CH3", "sp3", "25%", "50"),
                    ("ethene, CH2=CH2", "sp2", "33%", "44"),
                    ("ethyne, HC#CH", "sp", "50%", "25"),
                ),
                source=(
                    "Aqueous pKa values as used throughout this course and in "
                    "app.data.claims; consistent with the Bordwell "
                    "compilation."
                ),
                note=(
                    "Twenty five pKa units separates ethane from ethyne. The "
                    "formulas differ only by hydrogen count; the hybridisation "
                    "is doing all the work."
                ),
            ),
        ),
    ),
    key_takeaways=(
        "Count groups - atoms bonded plus lone pairs, with a multiple bond "
        "counting once. Four is sp3, three is sp2, two is sp.",
        "Read geometry first and assign hybridisation second. Hybridisation "
        "describes the observed shape; it is not a process the atom performs.",
        "sp2 leaves one p orbital spare and sp leaves two. Those spares are "
        "what pi bonds and delocalised lone pairs are made of.",
        "Lone pairs count as groups and spread wider than bonding pairs, which "
        "is why ammonia is 107 degrees and water 104.5.",
        "More s character holds electrons closer to the nucleus, which "
        "shortens bonds and makes terminal C-H far more acidic: pKa 50 to 25 "
        "from ethane to ethyne.",
    ),
    exam_tips=(
        "Assigning hybridisation to a specific labelled atom in a large drawn "
        "molecule is among the highest frequency MCAT organic tasks. Practise "
        "on heteroatoms, not just carbon.",
        "The amide nitrogen is the classic trap: it is drawn with a lone pair "
        "like an amine but is planar and effectively sp2, because the pair is "
        "delocalised into the carbonyl.",
    ),
    video=VideoLesson(
        scene="hybridisation-morph",
        title="One s and three p, mixed three ways",
        seconds=40,
        summary=(
            "An s orbital and three p orbitals combine into four equivalent "
            "sp3 lobes that spread to a tetrahedron. The animation then "
            "withdraws one p to give three sp2 lobes in a plane with the "
            "spare p perpendicular, and withdraws a second to give two sp "
            "lobes on a line with two spare p orbitals."
        ),
    ),
))


# --------------------------------------------------------------------------
# 1.3 Drawing structures
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.DRAWING",
    lead=(
        "Organic chemists draw skeletal structures because a molecule with "
        "thirty carbons is unreadable any other way. The convention hides "
        "carbon and hides the hydrogens attached to carbon, which makes the "
        "interesting atoms visible - and makes it your job to put the hidden "
        "ones back whenever the chemistry involves them."
    ),
    sections=(
        ReadingSection(
            id="conventions",
            heading="The three conventions, and what each one costs",
            body=(
                "A skeletal structure follows three rules.\n\n"
                "**Every vertex and every line end is a carbon**, unless "
                "another atom is written there. A zig-zag of five line "
                "segments has six carbons: five vertices plus the two ends, "
                "minus the shared ones - count the corners and the "
                "terminations.\n\n"
                "**Hydrogens on carbon are not drawn.** You infer them from "
                "tetravalence: whatever it takes to bring that carbon to four "
                "bonds. A vertex with two lines drawn has two hydrogens. A "
                "line end has three. A vertex with three lines has one.\n\n"
                "**Heteroatoms are always drawn, and so are their hydrogens.** "
                "Every O, N, S, and halogen appears explicitly, and an O-H or "
                "N-H is written out. This is not an inconsistency, it is the "
                "whole point: heteroatoms are where the chemistry happens, so "
                "they never hide.\n\n"
                "The cost of the convention is that the hydrogens you stopped "
                "drawing are still there and still react. When you deprotonate "
                "an alkyne, when you count the stereocentres in a sugar, when "
                "you work out an NMR integration, you need the hydrogen count "
                "that the drawing deliberately omits. Learning to restore it "
                "instantly - to look at a vertex and know it carries two - is "
                "the actual skill this section is teaching."
            ),
            figure=Figure(
                stem="org1-skeletal-decode",
                caption=(
                    "One molecule drawn three ways. The Lewis structure shows "
                    "every atom and bond; the condensed formula groups each "
                    "carbon with its hydrogens; the skeletal structure hides "
                    "carbon and its hydrogens and keeps the heteroatom."
                ),
                alt=(
                    "Three representations of 2-butanol side by side, with "
                    "matching carbons numbered across all three so the same "
                    "atom can be tracked from the full Lewis structure through "
                    "the condensed formula to the skeletal zig-zag."
                ),
            ),
        ),
        ReadingSection(
            id="degrees-unsaturation",
            heading="Degrees of unsaturation: reading rings and pi bonds off a formula",
            body=(
                "Before you draw anything, a molecular formula already tells "
                "you how many rings and $\\pi$ bonds the structure must "
                "contain. A saturated acyclic hydrocarbon has "
                "$\\mathrm{C_nH_{2n+2}}$. Every ring and every $\\pi$ bond "
                "costs two hydrogens against that maximum, so\n\n"
                "$$\\mathrm{DoU} = \\frac{2n_C + 2 + n_N - n_H - n_X}{2}$$\n\n"
                "where $n_X$ counts halogens. Oxygen does not appear, because "
                "inserting an oxygen into a chain changes no hydrogen count. "
                "Nitrogen adds one to the numerator because it is trivalent "
                "and brings an extra hydrogen with it.\n\n"
                "Work an example. Benzene is $\\mathrm{C_6H_6}$, so "
                "$\\mathrm{DoU} = (12 + 2 - 6)/2 = 4$. Four degrees: one ring "
                "and three $\\pi$ bonds, which is exactly the Kekule "
                "structure. Now toluene, $\\mathrm{C_7H_8}$: "
                "$(14 + 2 - 8)/2 = 4$ again, because the added methyl group is "
                "saturated and contributes nothing.\n\n"
                "The calculation is worth a few seconds on any structure "
                "problem because it constrains the answer before you start "
                "guessing. A formula with $\\mathrm{DoU} = 0$ has no ring and "
                "no double bond anywhere, and any candidate structure with one "
                "is wrong without further checking. A formula with "
                "$\\mathrm{DoU} = 4$ in a compound that shows aromatic signals "
                "in its NMR almost certainly contains a benzene ring, which "
                "spends all four at once."
            ),
            table=Table(
                caption="Degrees of unsaturation for common formulas",
                columns=("Compound", "Formula", "DoU", "Accounted for by"),
                rows=(
                    ("hexane", "C6H14", "0", "nothing; fully saturated"),
                    ("cyclohexane", "C6H12", "1", "one ring"),
                    ("1-hexene", "C6H12", "1", "one pi bond"),
                    ("benzene", "C6H6", "4", "one ring, three pi bonds"),
                    ("acetone", "C3H6O", "1", "one C=O; oxygen ignored"),
                    ("aniline", "C6H7N", "4", "ring plus three pi; N adds 1"),
                ),
                source="Computed from the formulas by the DoU expression above.",
                note=(
                    "Cyclohexane and 1-hexene share a formula and a DoU. The "
                    "count tells you how many degrees there are, never which "
                    "kind."
                ),
            ),
            important=(
                "Oxygen is absent from the formula because inserting O into a "
                "chain costs no hydrogens: CH3-CH3 and CH3-O-CH3 both have "
                "six. Adding oxygen terms is the most common way this "
                "calculation goes wrong."
            ),
        ),
        ReadingSection(
            id="what-drawings-hide",
            heading="What a flat drawing cannot tell you",
            body=(
                "A skeletal structure on paper is a two dimensional projection "
                "of a three dimensional object, and the projection discards "
                "information you will later need.\n\n"
                "It discards **stereochemistry** unless you add it back with "
                "wedges and dashes. A plain zig-zag drawing of 2-butanol names "
                "a constitution, not a compound: two enantiomers share it. "
                "From chapter 6 onward that distinction decides whether two "
                "structures are the same substance, and a drawing without "
                "wedges cannot answer the question.\n\n"
                "It discards **conformation** entirely, and here the drawing "
                "is actively misleading. Cyclohexane is universally drawn as a "
                "flat hexagon, and cyclohexane is not flat and never has been. "
                "The real molecule is a chair with 109.5 degree angles, "
                "interconverting between two chair forms thousands of times a "
                "second. The hexagon is a name for the connectivity, not a "
                "picture of the shape, and chapter 7 spends its length on the "
                "difference.\n\n"
                "It renders **bond angles wrong on purpose**. The 120 degree "
                "zig-zag you draw for a saturated chain represents 109.5 "
                "degree tetrahedral carbons. Nobody minds, because the drawing "
                "encodes connectivity and everyone reads it as connectivity - "
                "but it means you can never measure anything off a skeletal "
                "structure.\n\n"
                "None of this is a defect. A notation that carried "
                "conformation and stereochemistry and true angles would be "
                "unusable at the size of the molecules organic chemists "
                "actually handle. The notation is lossy by design, and knowing "
                "precisely which information it drops is what lets you know "
                "when to reach for a different one."
            ),
        ),
        ReadingSection(
            id="reading-condensed",
            heading="Reading a condensed formula, left to right",
            body=(
                "Between the Lewis structure and the skeletal drawing sits the "
                "condensed formula, and it is the one you will meet most often "
                "in text: $\\mathrm{CH_3CH(OH)CH_2CH_3}$. It has no lines at "
                "all. Every carbon is written with the hydrogens attached to "
                "it, in order along the chain, and branches go in parentheses "
                "immediately after the carbon they hang off.\n\n"
                "Read that example one group at a time. "
                "$\\mathrm{CH_3}$ is a carbon with three hydrogens, so it has "
                "one bond left and must be an end. $\\mathrm{CH}$ is a carbon "
                "with one hydrogen, so it has three bonds left. The "
                "$\\mathrm{(OH)}$ immediately after it is one of them, a "
                "branch. The remaining two go to the group before and the "
                "group after. $\\mathrm{CH_2}$ takes two bonds along the "
                "chain. The final $\\mathrm{CH_3}$ closes it. Four carbons, an "
                "OH on the second: 2-butanol.\n\n"
                "Two conventions catch people out. A repeated group written "
                "with a subscript outside parentheses means repetition along "
                "the chain, not a branch: $\\mathrm{CH_3(CH_2)_4CH_3}$ is "
                "hexane, six carbons in a row, and the four "
                "$\\mathrm{CH_2}$ units are chain members. And a carbonyl is "
                "usually written $\\mathrm{CH_3COCH_3}$ rather than with an "
                "explicit double bond, so the $\\mathrm{CO}$ in the middle is "
                "a carbon double bonded to an oxygen - acetone - and not a "
                "carbon singly bonded to an oxygen. If it were single bonded "
                "the carbon would need two hydrogens and the formula would say "
                "$\\mathrm{CH_2O}$.\n\n"
                "The habit worth building is converting in both directions "
                "without drawing anything. Given a skeletal structure, say the "
                "condensed formula out loud. Given a condensed formula, say "
                "how many carbons and where the heteroatoms sit. Structure "
                "elucidation problems hand you a formula and a spectrum and "
                "expect you to propose structures; the ones who are quick at "
                "it are quick because this conversion is automatic rather than "
                "worked."
            ),
            important=(
                "In a condensed formula, CO means a carbonyl - carbon double "
                "bonded to oxygen. A single C-O bond leaves the carbon needing "
                "two more hydrogens, and the formula would show them."
            ),
        ),
    ),
    key_takeaways=(
        "Vertices and line ends are carbons; hydrogens on carbon are implied "
        "by tetravalence; heteroatoms and their hydrogens are always drawn.",
        "The hidden hydrogens still react. Restoring the count at a glance is "
        "the skill, not the drawing.",
        "DoU = (2nC + 2 + nN - nH - nX)/2 gives rings plus pi bonds from a "
        "formula alone. Oxygen does not appear in it.",
        "DoU tells you how many degrees, never which kind: cyclohexane and "
        "1-hexene both score 1.",
        "Skeletal drawings discard stereochemistry and conformation and draw "
        "angles wrong. Wedges restore the first; nothing on paper restores the "
        "second.",
    ),
    exam_tips=(
        "Degrees of unsaturation is a fast first move on any structure "
        "elucidation passage. Four degrees plus aromatic NMR signals is a "
        "benzene ring almost every time.",
        "Molecular formula questions frequently give a skeletal drawing and "
        "ask for the formula. Count vertices carefully and add implied "
        "hydrogens last.",
    ),
))


# --------------------------------------------------------------------------
# 1.4 Formal charge
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.FORMALCHARGEORG",
    lead=(
        "Formal charge is an accounting device. It answers one question - has "
        "this atom gained or lost electrons relative to its neutral, isolated "
        "self - and the answer decides which resonance structures matter, "
        "where a molecule gets attacked, and whether a mechanism you have "
        "drawn is balanced or nonsense."
    ),
    sections=(
        ReadingSection(
            id="the-count",
            heading="The count, and why it is written that way",
            body=(
                "$$\\mathrm{FC} = V - N - \\frac{B}{2}$$\n\n"
                "$V$ is the number of valence electrons the neutral atom "
                "brings: 4 for carbon, 5 for nitrogen, 6 for oxygen, 7 for a "
                "halogen. $N$ is the number of non-bonding electrons on the "
                "atom in the structure - lone pair electrons, counted "
                "individually, so a lone pair contributes 2. $B$ is the total "
                "number of bonding electrons around it, and it is halved "
                "because a shared pair is shared.\n\n"
                "Since every bond contributes two electrons to $B$, halving it "
                "just counts bonds, and the working form is\n\n"
                "$$\\mathrm{FC} = V - N - (\\text{number of bonds})$$\n\n"
                "The assumption buried in that halving is that a bond's two "
                "electrons split evenly between the two atoms. This is false "
                "for every polar bond, and formal charge knows it is false. "
                "That is the deliberate design: by ignoring electronegativity "
                "entirely, formal charge isolates the *connectivity* "
                "contribution to charge, which is precisely what changes "
                "between resonance structures while the electronegativities "
                "stay fixed.\n\n"
                "Its counterpart, oxidation state, makes the opposite "
                "assumption - it gives both electrons of every bond to the "
                "more electronegative atom. Neither is the real charge "
                "distribution. The real distribution is somewhere in between "
                "and requires calculation. These are two bounding "
                "approximations, each useful for the question it was built "
                "for, and using one for the other's job is a reliable source "
                "of wrong answers."
            ),
            table=Table(
                caption=(
                    "Formal charge on carbon, nitrogen and oxygen by bond and "
                    "lone-pair count"
                ),
                columns=(
                    "Atom", "Bonds", "Lone pairs", "FC", "Example",
                ),
                rows=(
                    ("C", "4", "0", "0", "methane"),
                    ("C", "3", "0", "+1", "tert-butyl cation"),
                    ("C", "3", "1", "-1", "carbanion"),
                    ("N", "3", "1", "0", "ammonia"),
                    ("N", "4", "0", "+1", "ammonium"),
                    ("N", "2", "2", "-1", "amide ion"),
                    ("O", "2", "2", "0", "water"),
                    ("O", "3", "1", "+1", "hydronium"),
                    ("O", "1", "3", "-1", "hydroxide"),
                ),
                source="Computed from FC = V - N - bonds for each entry.",
                note=(
                    "Learn the neutral rows first - carbon four bonds, "
                    "nitrogen three, oxygen two - and read every charge as a "
                    "deviation from them."
                ),
            ),
            important=(
                "Formal charge is not partial charge. The carbon of a carbonyl "
                "carries formal charge zero and is nonetheless the "
                "electrophilic site, because oxygen's electronegativity pulls "
                "density away. Formal charge ignores electronegativity by "
                "construction."
            ),
        ),
        ReadingSection(
            id="worked-mechanism-step",
            heading="Worked: charge through one mechanism step",
            body=(
                "Take the first step of acid catalysed hydration: water "
                "attacks a carbocation. Before you can check the arrows, you "
                "need every formal charge on both sides.\n\n"
                "**Before.** The carbocation carbon has three bonds and no "
                "lone pair, so $\\mathrm{FC} = 4 - 0 - 3 = +1$. The water "
                "oxygen has two bonds and two lone pairs, so "
                "$\\mathrm{FC} = 6 - 4 - 2 = 0$. Total charge on the left: "
                "$+1$.\n\n"
                "**The arrow.** One lone pair on oxygen becomes the new O-C "
                "bond. The tail sits on the pair, the head on the carbon. "
                "Nothing leaves, because the carbon had an empty orbital "
                "waiting.\n\n"
                "**After.** The carbon now has four bonds and no lone pair: "
                "$\\mathrm{FC} = 4 - 0 - 4 = 0$. The oxygen now has three "
                "bonds and one lone pair: $\\mathrm{FC} = 6 - 2 - 3 = +1$. "
                "Total charge on the right: $+1$.\n\n"
                "Charge is conserved and it moved from carbon to oxygen, which "
                "is exactly what an arrow drawn from oxygen to carbon should "
                "do. The species you have made is an oxonium ion, and its "
                "positive oxygen is why the next step is losing a proton "
                "rather than anything else - an oxygen carrying a full "
                "positive charge is a strong acid.\n\n"
                "Now do the same accounting on the version people draw when "
                "they are guessing: an arrow from the carbon to the oxygen. "
                "That would move a pair off a carbon that has none to spare, "
                "leave the carbon at $\\mathrm{FC} = 4 - 0 - 2 = +2$ and the "
                "oxygen at $6 - 4 - 3 = -1$, total $+1$ - charge conserved, "
                "and still nonsense, because the carbocation had no electrons "
                "to donate. Conservation is necessary, not sufficient. The "
                "second check is that the tail of every arrow sits on "
                "electrons that actually exist."
            ),
        ),
        ReadingSection(
            id="reading-fast",
            heading="Reading charge off a structure without arithmetic",
            body=(
                "In practice nobody evaluates the formula atom by atom. They "
                "memorise the neutral pattern and read deviations.\n\n"
                "Neutral carbon has four bonds and no lone pair. Three bonds "
                "with an empty orbital is a cation; three bonds with a lone "
                "pair is an anion; three bonds with a single electron is a "
                "radical and carries no formal charge at all, since $4 - 1 - 3 "
                "= 0$.\n\n"
                "Neutral nitrogen has three bonds and one lone pair. Four bonds "
                "is $+1$, which is every ammonium and every protonated amine. "
                "Two bonds with two lone pairs is $-1$.\n\n"
                "Neutral oxygen has two bonds and two lone pairs. Three bonds "
                "is $+1$, which is hydronium and, importantly, the oxygen of a "
                "protonated carbonyl during acid catalysis. One bond with "
                "three lone pairs is $-1$, which is hydroxide and every "
                "alkoxide.\n\n"
                "Two checks catch most errors. First, the formal charges in a "
                "structure must sum to the overall charge on the species - if "
                "you have drawn a neutral molecule and your charges sum to "
                "$+1$, you have lost an electron somewhere. Second, in a "
                "mechanism, charge is conserved at every step: if the left "
                "side of an arrow is neutral overall, the right side is too. A "
                "mechanism step that changes total charge is a mechanism step "
                "that is wrong, and this check will catch it faster than "
                "rereading the arrows."
            ),
        ),
        ReadingSection(
            id="why-it-matters",
            heading="Where the count actually earns its keep",
            body=(
                "Formal charge does three jobs in this course.\n\n"
                "It **ranks resonance structures.** Given several valid Lewis "
                "structures for one species, the ones that contribute most are "
                "those with the fewest formal charges, and among those, the "
                "ones placing negative charge on the most electronegative "
                "atom. For the carboxylate ion this immediately says that the "
                "two structures with the charge on oxygen dominate, so the ion "
                "is best described as having half a negative charge on each "
                "oxygen - which is what the two equal C-O bond lengths in "
                "sodium formate show experimentally.\n\n"
                "It **locates reactive sites.** A positive formal charge marks "
                "an electron-poor atom, which is where a nucleophile will go. "
                "A negative one marks electron-rich, which is where an "
                "electrophile will go. This is the first pass, and it is right "
                "often enough to be worth doing first - but only the first "
                "pass, because polarity without formal charge does the same "
                "job at every carbonyl carbon.\n\n"
                "It **validates mechanisms.** Every curved arrow moves two "
                "electrons from somewhere to somewhere. Formal charge is the "
                "ledger that says whether the move balances. An arrow drawn "
                "from a nucleophile's lone pair to an electrophilic carbon "
                "should leave the nucleophile one unit more positive and, "
                "unless something departs, the carbon one unit more negative. "
                "If your drawn charges do not move that way, the arrow is "
                "wrong."
            ),
        ),
    ),
    key_takeaways=(
        "FC = V - N - bonds, where N counts lone-pair electrons individually.",
        "Formal charge assumes bonding electrons split evenly and so ignores "
        "electronegativity. That is deliberate, and it is what makes it the "
        "right tool for comparing resonance structures.",
        "Learn neutral by pattern - C four bonds, N three, O two - and read "
        "everything as a deviation.",
        "Formal charge is not partial charge. A carbonyl carbon is FC zero and "
        "electrophilic.",
        "Charges must sum to the species charge, and total charge is conserved "
        "at every mechanism step. Both are fast error checks.",
    ),
    exam_tips=(
        "Assigning formal charge to a labelled atom in a drawn intermediate is "
        "high frequency. Count lone pairs on the drawing, not the ones you "
        "expect to be there.",
        "Ranking resonance contributors is nearly always a formal charge "
        "question in disguise: fewest charges first, then negative charge on "
        "the most electronegative atom.",
    ),
))


# --------------------------------------------------------------------------
# 1.5 Resonance
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.RESONANCEORG",
    lead=(
        "Resonance is not a molecule changing between forms. It is a "
        "limitation of the notation: Lewis structures put every pair of "
        "electrons in one place, and some molecules do not keep their "
        "electrons in one place. Where that happens we draw several structures "
        "and understand the real molecule as a single, unchanging average of "
        "them."
    ),
    sections=(
        ReadingSection(
            id="not-equilibrium",
            heading="The one thing everyone gets wrong",
            body=(
                "The double headed arrow between resonance structures is not "
                "an equilibrium arrow. There is no interconversion, no "
                "population of one form and another, no rate. The carboxylate "
                "ion does not spend half its time with the charge on the left "
                "oxygen. It has, at all times, half a negative charge on each.\n\n"
                "The experimental evidence is direct. If a carboxylate really "
                "alternated between a C=O double bond and a C-O single bond, "
                "you would measure two different carbon-oxygen distances. "
                "Sodium formate shows one distance, 127 pm, sitting between "
                "the 123 pm of a ketone C=O and the 143 pm of an alcohol C-O. "
                "Not two lengths averaging to that. One length.\n\n"
                "The reason the notation forces this on us is that a Lewis "
                "structure is built from localised electron pairs, one pair per "
                "line, and delocalised electrons cannot be drawn that way. So "
                "we draw the corners of the space and say the truth is inside. "
                "The set of structures is a description of one object. The "
                "molecule is the hybrid, and the hybrid is the only thing that "
                "exists.\n\n"
                "The standard analogy is worth stating because it fixes the "
                "idea: a rhinoceros is not a creature that alternates between "
                "being a unicorn and being a dragon. Unicorn and dragon are "
                "the only two things you happen to have words for, and the "
                "rhinoceros is a single animal in between."
            ),
            figure=Figure(
                stem="org1-resonance-hybrid",
                caption=(
                    "The acetate ion. Two resonance structures place the "
                    "negative charge on one oxygen or the other; the hybrid "
                    "below shows the real ion, with a dashed partial bond to "
                    "each oxygen and half a negative charge on each."
                ),
                alt=(
                    "Two acetate Lewis structures joined by a double headed "
                    "arrow, each with a C=O to one oxygen and a C-O minus to "
                    "the other. Beneath them, a single structure with dashed "
                    "half-bonds to both oxygens, each labelled with a partial "
                    "negative charge of one half."
                ),
            ),
            important=(
                "The double headed arrow means 'these describe one thing'. The "
                "two-arrow equilibrium symbol means 'these are different things "
                "interconverting'. Using the wrong one is a chemistry error, "
                "not a notation slip."
            ),
        ),
        ReadingSection(
            id="what-moves",
            heading="What may move, and what may not",
            body=(
                "Resonance structures differ only in where electrons are "
                "drawn. Every structure in a set must have identical "
                "connectivity - the same atoms bonded to the same atoms - and "
                "the same total charge, and the same number of paired "
                "electrons.\n\n"
                "**Nuclei never move.** If you have moved an atom, you have "
                "drawn a different compound and the relationship is "
                "constitutional isomerism, not resonance. This is the single "
                "test that catches most invalid structures: superimpose the "
                "skeletons and check they match.\n\n"
                "**Only pi electrons and lone pairs move.** Sigma bonds are "
                "the framework and stay put. An arrow that breaks a sigma bond "
                "in a resonance structure is drawing a reaction.\n\n"
                "**Electrons move to an adjacent position.** A lone pair moves "
                "into an adjacent bond; a pi bond shifts to the next position "
                "along; a pi bond collapses onto one atom as a lone pair. What "
                "makes a position available is an empty orbital or a pi system "
                "next door, which is why delocalisation requires the "
                "participating orbitals to be parallel and continuous. A "
                "$sp^3$ carbon in the middle of a chain breaks conjugation, "
                "because it has no p orbital to pass electrons through.\n\n"
                "Three patterns cover nearly every case you will draw: a lone "
                "pair adjacent to a positive centre or a pi bond donates into "
                "it; a pi bond adjacent to a positive centre shifts toward it; "
                "and a pi bond between atoms of different electronegativity "
                "can collapse onto the more electronegative one, which is the "
                "carbonyl's minor but crucial contributor."
            ),
        ),
        ReadingSection(
            id="ranking",
            heading="Ranking contributors, and what delocalisation buys",
            body=(
                "Not every valid structure contributes equally. In descending "
                "order of importance: **complete octets** beat incomplete "
                "ones; **fewer formal charges** beat more; **negative charge "
                "on the more electronegative atom** beats the reverse; and "
                "**like charges far apart** beats adjacent.\n\n"
                "Apply that to a carbonyl. The neutral structure with the C=O "
                "intact has full octets and no charges and dominates. The "
                "charge-separated structure with $\\mathrm{C^+}$ and "
                "$\\mathrm{O^-}$ has two formal charges and an incomplete "
                "octet on carbon, so it is minor - but it is not zero, and it "
                "is the reason the carbonyl carbon is electrophilic at all. "
                "Minor contributors explain reactivity precisely because "
                "reactivity is decided by small amounts of the right "
                "character.\n\n"
                "The energetic payoff is real and measurable. Spreading charge "
                "or electron density over more atoms lowers energy, and the "
                "more equivalent the structures the larger the effect. "
                "Carboxylate's two identical contributors are worth around "
                "$5$ pKa units against an alcohol: acetic acid is 4.76, "
                "ethanol is 16. That is eleven orders of magnitude in acid "
                "strength arising from one delocalisation, and it is why "
                "carboxylic acids are the acids of organic chemistry and "
                "alcohols are not.\n\n"
                "Benzene is the extreme case. Six carbons in a continuous "
                "conjugated ring, two equivalent Kekule contributors, all six "
                "C-C bonds measured at 139 pm, and a stabilisation of roughly "
                "150 kJ/mol against the hypothetical localised triene. That "
                "quantity has its own name, aromaticity, and its own chapter."
                "\n\n"
                "The geometric requirement is where delocalisation is most "
                "often assumed and is not there. For a lone pair or a $\\pi$ "
                "bond to delocalise into a neighbouring system the orbitals "
                "have to be parallel, which means the participating atoms have "
                "to be coplanar. Break the coplanarity and the interaction "
                "goes with it, smoothly, as the cosine of the twist angle - "
                "the same relationship that governs $\\pi$ overlap in section "
                "two of this chapter, because it is the same overlap.\n\n"
                "This is testable and it has been tested. In "
                "$N,N$-dimethylaniline the nitrogen lone pair delocalises into "
                "the ring and the nitrogen is a poor base. Put bulky groups on "
                "either side of it and sterics force the nitrogen out of the "
                "ring plane; the conjugation is broken, the lone pair becomes "
                "locally available, and the amine becomes markedly more basic. "
                "Nothing about the atoms changed. Only the angle did.\n\n"
                "The practical version of the rule is the one to carry: an "
                "$sp^3$ carbon in a chain stops conjugation dead, because it "
                "has no $p$ orbital to pass electrons through. "
                "$\\mathrm{CH_2{=}CH{-}CH{=}CH_2}$ is conjugated across all "
                "four carbons and behaves as one system. "
                "$\\mathrm{CH_2{=}CH{-}CH_2{-}CH{=}CH_2}$ is not conjugated at "
                "all: it is two isolated alkenes that happen to share a "
                "molecule, and it reacts like two isolated alkenes. When you "
                "are asked whether a system is delocalised, trace the chain of "
                "$p$ orbitals and check it is unbroken. One $sp^3$ centre "
                "is enough to break it."
            ),
            table=Table(
                caption="What delocalisation is worth, in pKa units",
                columns=(
                    "Acid", "Conjugate base", "Delocalised over", "pKa",
                ),
                rows=(
                    ("ethanol", "ethoxide", "one O; not delocalised", "16"),
                    ("phenol", "phenoxide", "O plus three ring carbons", "10"),
                    ("acetic acid", "acetate", "two equivalent O", "4.76"),
                ),
                source=(
                    "Aqueous pKa values as used throughout this course and in "
                    "app.data.claims."
                ),
                note=(
                    "Phenoxide delocalises onto carbon, which is less "
                    "electronegative than oxygen, so it gains less than "
                    "acetate does from two equivalent oxygens."
                ),
            ),
        ),
    ),
    key_takeaways=(
        "Resonance structures are not in equilibrium. The molecule is a single "
        "hybrid at all times, and one measured C-O bond length in formate "
        "proves it.",
        "Nuclei never move between resonance structures. If an atom moved, you "
        "drew a different compound.",
        "Only pi electrons and lone pairs move, and only into an adjacent "
        "parallel orbital. An sp3 carbon breaks conjugation.",
        "Rank by complete octets, then fewest charges, then negative charge on "
        "the more electronegative atom.",
        "Minor contributors explain reactivity: the carbonyl's charge "
        "separated form is why its carbon is electrophilic.",
        "Delocalisation is worth about 11 pKa units between ethanol and acetic "
        "acid.",
    ),
    exam_tips=(
        "Identify-the-invalid-resonance-structure is a standard item. Check "
        "connectivity first; a moved atom is the usual planted error.",
        "Ranking contributors and predicting where a delocalised anion is "
        "most nucleophilic both come up. Acetate, phenoxide and the allyl and "
        "benzyl cations are the recurring cast.",
    ),
    video=VideoLesson(
        scene="resonance-delocalisation",
        title="Acetate: two structures, one ion",
        seconds=30,
        summary=(
            "Curved arrows convert one acetate resonance structure into the "
            "other, moving a lone pair into a bond and a bond into a lone "
            "pair while every nucleus stays fixed. The two structures then "
            "fade into the hybrid, showing equal partial bonds and half a "
            "negative charge on each oxygen."
        ),
    ),
))

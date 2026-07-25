"""Johnstone triangle views: one concept described at all three levels at once.

Johnstone, A. H. (1991). Why is science difficult to learn? Things are seldom
what they seem. Journal of Computer Assisted Learning, 7(2). Johnstone's claim
is that chemical understanding lives at three levels and that novices fail when
a course jumps between them without saying so:

  macroscopic  what you can see, smell, weigh or measure in the lab.
  particulate  what the atoms, ions and molecules are doing, which is modelled
               rather than observed.
  symbolic     the formulas, equations and graphs chemists write down.

A triangle view holds one concept still and states all three corners together,
so the learner can see that they are three descriptions of a single thing
rather than three separate topics. The connector field is the load bearing one:
it names the single quantity or object that is identical across all three.

Review status. REVIEW below reads "pending" until a named subject matter expert
signs these off. Nothing in this file may be presented in product as expert
verified while it reads "pending". The chemistry facts quoted here are standard
general chemistry values and the pitfalls are drawn from the misconception
literature cited in chem_core/misconceptions.py, but neither of those is a
substitute for that review.

This module imports nothing from the rest of the application. It is data.
"""

from __future__ import annotations

from dataclasses import dataclass

REVIEW = "pending"


@dataclass(frozen=True)
class TriangleView:
    """One concept stated at all three of Johnstone's levels.

    node: curriculum node code this view belongs to.
    title: short label for the view.
    macroscopic: what you would observe, with instruments and numbers.
    particulate: what the particles are doing. Where the standard account is a
        simplification, the text says so rather than asserting it as fact.
    symbolic: the written representation, in words.
    connector: one sentence naming what is the SAME thing across all three.
    pitfall: the specific level confusion learners fall into at this node.
    katex: optional KaTeX with mhchem for the symbolic corner. Empty where the
        symbolic corner is not a chemical equation.
    caption: optional one line describing the particulate picture in words.
        There is no artwork anywhere in this system, so the caption is what
        makes the particulate corner complete.
    """

    node: str
    title: str
    macroscopic: str
    particulate: str
    symbolic: str
    connector: str
    pitfall: str
    katex: str = ""
    caption: str = ""


_VIEWS: list[TriangleView] = [
    # ---------------- GEN1: General Chemistry I (13) ----------------
    TriangleView(
        node="GEN1.NOMENIONIC",
        title="A formula that names a ratio, not a particle",
        macroscopic=(
            "A grain of table salt is a hard, brittle, colourless cube that "
            "melts at 801 degrees Celsius. Dry, it does not conduct "
            "electricity. Melt it or dissolve it in water and it conducts well. "
            "Strike the crystal and it cleaves along flat planes instead of "
            "denting."
        ),
        particulate=(
            "There are no NaCl molecules in the grain. There is a repeating "
            "three dimensional grid in which every sodium ion is surrounded by "
            "six chloride ions and every chloride ion by six sodium ions, held "
            "by electrostatic attraction reaching out in every direction. The "
            "ions cannot move while the grid holds, which is why the dry solid "
            "does not conduct. Melting or dissolving frees them, and then it "
            "does."
        ),
        symbolic=(
            "NaCl. Chemists call this a formula unit rather than a molecule, "
            "because it reports the ratio one sodium ion to one chloride ion in "
            "the lattice rather than the contents of any single particle. "
            "Polyatomic ions such as sulfate and nitrate are the exception "
            "inside this system: those really are groups of atoms bonded "
            "together that travel intact."
        ),
        connector=(
            "The one to one ratio is the same ratio at all three levels: it is "
            "what a chemical analysis of the grain on the bench returns, it is "
            "what you would count in any large block of the grid, and it is "
            "exactly what the formula NaCl states."
        ),
        pitfall=(
            "The specific confusion is reading NaCl as the description of one "
            "particle, so the learner pictures a sodium bonded to one "
            "particular chlorine and calls it a molecule of salt. There is no "
            "such pair to point at in the crystal. This is the one place early "
            "in the course where a formula does not name a particle, and the "
            "symbolic level actively encourages the wrong particulate picture "
            "because NaCl and CO2 look like the same kind of statement."
        ),
        katex=r"\ce{NaCl(s) -> Na+(aq) + Cl-(aq)}",
        caption=(
            "Picture a checkerboard extended into three dimensions: larger "
            "chloride ions and smaller sodium ions alternating at every corner "
            "of a stack of cubes, with no line you could draw around any two of "
            "them to make a pair."
        ),
    ),
    TriangleView(
        node="GEN1.MOLE",
        title="Counting by weighing",
        macroscopic=(
            "A balance reads 18.02 grams of water in a weighing boat. That is a "
            "little over a tablespoon, something you could tip into your palm, "
            "and a balance is the only instrument in the room."
        ),
        particulate=(
            "That sample holds about 6.022 x 10^23 individual water molecules. "
            "No instrument counted them. The count follows from the mass, "
            "because the average mass of one water molecule is known, and "
            "dividing the sample mass by it gives the number of particles. This "
            "is the same move a hardware store makes when it weighs 5000 "
            "washers rather than counting them."
        ),
        symbolic=(
            "n = m / M, so n = 18.02 g divided by 18.02 g/mol = 1.000 mol. The "
            "mole is a fixed count, defined since 2019 as exactly 6.02214076 x "
            "10^23 entities, and the molar mass M is the conversion factor "
            "between the balance reading and that count."
        ),
        connector=(
            "The number 6.022 x 10^23 is one single count appearing three "
            "times: it is how many particles are sitting on the balance pan, it "
            "is how many objects a complete particulate drawing would have to "
            "show, and it is exactly what the symbol 1.000 mol stands for."
        ),
        pitfall=(
            "The specific confusion is treating equal masses as equal counts, "
            "which quietly lets the symbol mol mean gram. 1.00 g of hydrogen "
            "gas is 1.00 / 2.016 = 0.496 mol and 1.00 g of oxygen gas is 1.00 / "
            "32.00 = 0.0313 mol, so the same balance reading covers about "
            "sixteen times as many hydrogen molecules. The balance works at the "
            "macroscopic level, the mole counts at the particulate level, and "
            "molar mass is the only thing that connects them."
        ),
        katex=r"\ce{H2O}:\quad n = \frac{m}{M} = \frac{18.02\ \mathrm{g}}{18.02\ \mathrm{g/mol}} = 1.000\ \mathrm{mol}",
        caption=(
            "Picture the puddle magnified until single molecules show: bent "
            "three atom units, one oxygen with two hydrogens, tumbling past "
            "each other. Now imagine that picture repeated until there are six "
            "hundred thousand billion billion of them."
        ),
    ),
    TriangleView(
        node="GEN1.EMPIRICAL",
        title="What a formula counts, and what it leaves out",
        macroscopic=(
            "A bottle of acetic acid on the bench holds a clear liquid with a "
            "sharp smell that boils at 118 degrees Celsius and freezes at 16.6 "
            "degrees Celsius. Combustion analysis of a weighed sample returns "
            "the mass of carbon, hydrogen and oxygen it contained, and nothing "
            "else about it."
        ),
        particulate=(
            "One molecule of that liquid holds exactly 2 carbon atoms, 4 "
            "hydrogen atoms and 2 oxygen atoms, joined in one specific "
            "arrangement: a methyl carbon carrying three hydrogens, bonded to a "
            "second carbon that carries two oxygens, one of which holds the "
            "fourth hydrogen. Every molecule in the bottle has that same count "
            "and that same arrangement."
        ),
        symbolic=(
            "The molecular formula is C2H4O2, and the subscripts are the atom "
            "counts in one molecule. Divide those counts by their common factor "
            "of 2 and you get the empirical formula, CH2O, which reports only "
            "the ratio 1 carbon to 2 hydrogen to 1 oxygen."
        ),
        connector=(
            "The count 2 carbon, 4 hydrogen and 2 oxygen is one count appearing "
            "three times: it is what combustion analysis of the liquid returns "
            "as mass fractions, it is what a single particle in the bottle "
            "actually holds, and it is what the subscripts in C2H4O2 state."
        ),
        pitfall=(
            "The specific confusion is reading the empirical formula as the "
            "identity of a substance, which promotes a symbolic ratio into a "
            "macroscopic thing. CH2O is not a substance you can pour. Glucose, "
            "C6H12O6, reduces to CH2O as well, and it is a sweet white solid "
            "rather than a sharp smelling liquid. The formula does not fix the "
            "arrangement either: C2H6O is ethanol, a liquid boiling at 78 "
            "degrees Celsius, and it is also dimethyl ether, a gas at room "
            "temperature."
        ),
        katex=r"\ce{C2H4O2}\ \text{(molecular)}\quad \ce{CH2O}\ \text{(empirical)}",
        caption=(
            "Picture one molecule as eight balls: a two carbon backbone, three "
            "hydrogens on the left carbon, and on the right carbon two oxygens "
            "with the last hydrogen attached to one of them."
        ),
    ),
    TriangleView(
        node="GEN1.CONSERVATION",
        title="The mass that seems to vanish",
        macroscopic=(
            "Heat 100.0 g of calcium carbonate in an open dish. The white solid "
            "left behind weighs 56.0 g, so the balance says 44.0 g has gone. "
            "Run the identical decomposition in a sealed flask on the same "
            "balance and the reading does not move at all."
        ),
        particulate=(
            "Nothing was created or destroyed in either run. Every calcium, "
            "carbon and oxygen atom that started is still present at the end. "
            "In the open dish the carbon dioxide molecules drifted out of the "
            "dish and into the room, taking their share of the mass off the "
            "pan. In the sealed flask those same molecules are still inside, "
            "bouncing around above the solid, so the pan still carries them."
        ),
        symbolic=(
            "CaCO3(s) -> CaO(s) + CO2(g). One calcium, one carbon and three "
            "oxygens on the left, and the same one, one and three on the right. "
            "The state labels (s) and (g) are the part of the notation that "
            "predicts which product can leave an open dish."
        ),
        connector=(
            "The three oxygen atoms are the same three oxygen atoms in all "
            "three descriptions: they are part of the 100.0 g you weighed out, "
            "they are the particles that end up split between the solid residue "
            "and the escaping gas, and they are what the subscript 3 on the "
            "left and the 1 plus 2 on the right both count."
        ),
        pitfall=(
            "The specific confusion is reading the drop from 100.0 g to 56.0 g "
            "as mass being destroyed. That is a macroscopic observation with no "
            "particulate event behind it. What happened is that a product "
            "crossed the boundary of the system you were weighing. Seal the "
            "system and the observation changes while the chemistry does not, "
            "which is the whole content of the demonstration."
        ),
        katex=r"\ce{CaCO3(s) -> CaO(s) + CO2(g)}",
        caption=(
            "Picture the solid as a repeating grid of calcium ions and "
            "carbonate ions. On heating, each carbonate ion breaks into a "
            "linear CO2 molecule that leaves and an oxide ion that stays, and "
            "what remains is a tighter grid of calcium and oxide ions."
        ),
    ),
    TriangleView(
        node="GEN1.BALANCE",
        title="Coefficients count, subscripts identify",
        macroscopic=(
            "Burn hydrogen in oxygen and you get water, in a fixed ratio every "
            "time: 4.03 g of hydrogen gas consumes 32.00 g of oxygen gas and "
            "produces 36.03 g of water. Supply more hydrogen than that and the "
            "surplus is still hydrogen gas at the end."
        ),
        particulate=(
            "Two hydrogen molecules and one oxygen molecule rearrange into two "
            "water molecules. The four hydrogen atoms and two oxygen atoms "
            "present at the start are the same six atoms present at the end, "
            "redistributed among different partners. No atom is added and none "
            "is removed, which is why the mass ratio cannot be negotiated."
        ),
        symbolic=(
            "2 H2 + O2 -> 2 H2O. The coefficients 2, 1 and 2 count how many of "
            "each substance take part. The subscript 2 inside H2 and inside "
            "H2O is part of what those substances are, and it is not "
            "adjustable."
        ),
        connector=(
            "The four hydrogen atoms are the same four atoms in all three "
            "places: they arrive in the 4.03 g you weighed out, the particulate "
            "picture shows them changing partners, and the coefficient 2 in "
            "front of H2O is what makes the equation report the same four."
        ),
        pitfall=(
            "The specific confusion is fixing a shortage by editing a "
            "subscript. The edit looks purely symbolic, one character on a "
            "page, but it silently swaps the particulate entity for a different "
            "one: writing H2O2 instead of H2O balances the oxygen count and "
            "changes the product from drinking water into hydrogen peroxide, "
            "which would sting a cut rather than quench thirst. A coefficient "
            "changes how many. A subscript changes what."
        ),
        katex=r"\ce{2H2 + O2 -> 2H2O}",
        caption=(
            "Picture six balls in three pairs on the left: two dumbbells of "
            "paired hydrogen and one dumbbell of paired oxygen. On the right "
            "the same six balls are regrouped as two bent three atom units. "
            "Count either picture and you get four hydrogen and two oxygen."
        ),
    ),
    TriangleView(
        node="GEN1.SOLUBILITY",
        title="The solid that appears on mixing",
        macroscopic=(
            "Two clear colourless solutions are poured together and a bright "
            "yellow solid appears at once and settles. Filter it, dry it, and "
            "it weighs something. The liquid through the filter is clear again, "
            "and evaporating it leaves a different white solid behind."
        ),
        particulate=(
            "Before mixing, each beaker holds ions moving independently through "
            "the water: lead(II) and nitrate ions in one, potassium and iodide "
            "ions in the other. On mixing, lead and iodide ions that collide "
            "stay together, because the attraction between them beats what the "
            "water can offer, and further ions dock onto that seed until the "
            "stack is large enough to fall. The potassium and nitrate ions "
            "never join anything and are still moving freely in the filtrate."
        ),
        symbolic=(
            "Pb(NO3)2(aq) + 2 KI(aq) -> PbI2(s) + 2 KNO3(aq). The net ionic "
            "equation strips out the ions that did nothing and leaves only the "
            "event: Pb2+(aq) + 2 I-(aq) -> PbI2(s)."
        ),
        connector=(
            "The yellow solid on the filter paper, the growing lattice of "
            "alternating lead and iodide ions, and the (s) label on PbI2 are "
            "one event described three ways."
        ),
        pitfall=(
            "The specific confusion is attributing the yellow solid to "
            "something the potassium or the nitrate did, because those ions are "
            "visible in the full symbolic equation and so look like "
            "participants. Swap potassium iodide for sodium iodide and the same "
            "yellow solid appears in the same amount, which is the test that "
            "shows they were only along for the ride. A second, purely symbolic "
            "slip is swapping partners and copying the old subscripts across, "
            "which gives PbI when lead's 2+ charge requires two iodides."
        ),
        katex=r"\ce{Pb^2+(aq) + 2I^-(aq) -> PbI2(s)}",
        caption=(
            "Picture the moment of mixing as two clouds of separately drifting "
            "ions running into each other. Most collisions bounce apart. When a "
            "lead ion meets two iodide ions they stay together, and more ions "
            "stack onto that seed until the flake is heavy enough to sink."
        ),
    ),
    TriangleView(
        node="GEN1.QUANTUMNUMBERS",
        title="Sharp spectral lines from allowed states",
        macroscopic=(
            "Run an electric discharge through a tube of low pressure hydrogen "
            "and it glows pink. Send that light through a prism and it does not "
            "spread into a rainbow. It separates into a few sharp coloured "
            "lines at fixed wavelengths, including red at 656.3 nm and blue "
            "green at 486.1 nm, and the pattern is identical in every hydrogen "
            "tube ever built."
        ),
        particulate=(
            "An electron in an atom cannot take any energy it likes. It "
            "occupies one of a discrete set of states, each addressed by four "
            "numbers: n sets the shell and most of the energy, l sets the "
            "shape, m_l sets the orientation of that shape in space, and m_s is "
            "one of two spin values, which is why an orbital holds exactly two "
            "electrons. An orbital is not a track the electron runs along. It "
            "is a region with a stated probability of containing the electron, "
            "and the familiar sphere and lobe drawings are surfaces enclosing "
            "roughly 90 percent of that probability, not pictures of an object."
        ),
        symbolic=(
            "A state is written as the set (n, l, m_l, m_s), for example "
            "(2, 1, 0, +1/2) for one electron in a 2p orbital, with the letters "
            "s, p and d standing in for l = 0, 1 and 2. A line in the spectrum "
            "is the energy difference between two such states, and that "
            "difference fixes its wavelength."
        ),
        connector=(
            "One energy gap is the same quantity in all three: the 656.3 nm red "
            "line you can see through the prism, the drop of an electron from "
            "the n = 3 state to the n = 2 state, and the difference between two "
            "allowed (n, l, m_l, m_s) addresses."
        ),
        pitfall=(
            "The specific confusion is picturing the orbital as an orbit, a "
            "path the electron travels like a planet, which imports a "
            "macroscopic image into the particulate level where it does not "
            "hold. A 2p orbital has a flat plane through the nucleus where the "
            "probability of finding the electron is exactly zero, yet the "
            "electron is found in both lobes, which no continuous path could "
            "manage. The related error is reading the lobe drawing as the "
            "surface of a physical object rather than a probability boundary "
            "drawn at a conventional cutoff."
        ),
        katex="",
        caption=(
            "Picture a fog around the nucleus that is dense where the electron "
            "is likely and thin where it is not. For a 2s state the fog is "
            "spherical. For a 2p state it is two lobes on opposite sides of the "
            "nucleus with a plane of exactly zero density between them."
        ),
    ),
    TriangleView(
        node="GEN1.IONICBOND",
        title="Three solids, three ways of holding together",
        macroscopic=(
            "Three solids on a bench. Table salt is a brittle white crystal "
            "melting at 801 degrees Celsius that does not conduct dry and "
            "conducts once molten. Paraffin wax is soft, melts below 60 degrees "
            "Celsius and never conducts. A copper wire is malleable, melts at "
            "1085 degrees Celsius and conducts cold."
        ),
        particulate=(
            "In salt, the electronegativity gap between sodium (0.93) and "
            "chlorine (3.16) is large enough that the valence electron ends up "
            "essentially on the chlorine, and the resulting ions attract in "
            "every direction through a lattice. Complete transfer is a "
            "simplification: real ionic bonds keep some covalent character and "
            "the charge on each ion falls a little short of a whole unit. In "
            "wax, carbon and hydrogen differ by only 0.35, so electrons are "
            "shared inside discrete molecules and only weak forces hold one "
            "molecule to the next. In copper, the atoms release valence "
            "electrons into states spread over the whole piece of metal, so "
            "charge flows while the positive cores stay put."
        ),
        symbolic=(
            "NaCl, a typical paraffin chain such as C25H52, and Cu. The three "
            "look like the same kind of statement and are not: only the middle "
            "one names a particle, the first names a lattice ratio and the last "
            "names a repeating array of atoms sharing one electron sea."
        ),
        connector=(
            "The valence electron is the same electron in all three "
            "descriptions of the salt: its transfer is why the crystal is "
            "brittle and conducts only when molten, its new home on the "
            "chlorine is what the particulate picture shows, and its departure "
            "is what the plus and minus in Na+ and Cl- record."
        ),
        pitfall=(
            "The specific confusion is reading NaCl as a molecule, because the "
            "symbolic level looks identical for salt and for wax while the "
            "particulate level does not. NaCl states a ratio in a lattice and "
            "C25H52 states the contents of one particle. The second confusion "
            "is treating the octet as the motive for the transfer, as though "
            "the sodium atom wanted a full shell. Sulfur hexafluoride is stable "
            "with twelve electrons around sulfur, so the octet is a pattern "
            "energetics summarise, not a desire particles have."
        ),
        katex=r"\ce{NaCl(s)}\quad \ce{C25H52(s)}\quad \ce{Cu(s)}",
        caption=(
            "Picture three blocks. In the first, alternating charged spheres "
            "locked in a grid. In the second, long tangled chains lying loosely "
            "against each other with clear gaps between them. In the third, "
            "fixed positive cores sitting in a haze of electrons free to drift "
            "through the whole block."
        ),
    ),
    TriangleView(
        node="GEN1.LEWIS",
        title="An electron budget on paper",
        macroscopic=(
            "Water is a liquid at 25 degrees Celsius, boils at 100 degrees "
            "Celsius and dissolves table salt. Spectroscopy measures two "
            "identical O-H bonds 95.8 pm long with 104.5 degrees between them, "
            "and the two bonds are identical no matter how the sample was made."
        ),
        particulate=(
            "Oxygen brings 6 valence electrons and each hydrogen brings 1, so "
            "eight electrons in four pairs have to be accounted for. Two pairs "
            "are shared, one with each hydrogen, and two pairs stay on the "
            "oxygen alone. Sharing is not literal joint ownership: the "
            "electrons are spread over both nuclei and are not evenly spread, "
            "and the Lewis pair is a bookkeeping model that gets the "
            "connectivity and the electron count right while saying nothing "
            "quantitative about where the density actually sits."
        ),
        symbolic=(
            "H-O-H with two pairs of dots drawn on the oxygen. The budget is "
            "2(1) + 6 = 8 valence electrons, spent as 4 in the two bonds and 4 "
            "in the two lone pairs. Exactly 8 in, exactly 8 out."
        ),
        connector=(
            "The two lone pairs are the same two pairs in every description: "
            "they are why the measured H-O-H angle is 104.5 rather than 109.5 "
            "degrees, they are the two unshared pairs on the real particle, and "
            "they are the two pairs of dots you draw on the oxygen."
        ),
        pitfall=(
            "The specific confusion is giving hydrogen an octet, because the "
            "rule was stated symbolically without its scope. Hydrogen has only "
            "a 1s orbital and is complete at two electrons, so lone pairs on "
            "the hydrogens in water would spend 12 electrons when the molecule "
            "has 8 to give. The deeper level error is treating the octet as the "
            "reason atoms bond rather than a pattern that energy accounting "
            "summarises: sulfur hexafluoride is a stable substance with twelve "
            "electrons around sulfur."
        ),
        katex=r"\ce{H2O}:\quad 2(1) + 6 = 8\ \text{valence electrons}",
        caption=(
            "Picture the oxygen at the centre with four clouds of charge around "
            "it pointing toward the corners of a tetrahedron. Two of those "
            "clouds end at a hydrogen nucleus. The other two end in nothing you "
            "could see, and those two take up the most room."
        ),
    ),

    TriangleView(
        node="GEN1.VSEPR",
        title="The domains you cannot see set the shape",
        macroscopic=(
            "Carbon dioxide and water are both a central atom with two atoms "
            "attached, and they behave nothing alike. CO2 is a gas that "
            "sublimes at -78.5 degrees Celsius and shows no dipole moment at "
            "all. Water is a liquid at room temperature that dissolves salt. "
            "Spectroscopy measures the O-C-O angle at 180 degrees and the "
            "H-O-H angle at 104.5 degrees."
        ),
        particulate=(
            "The central atom's electron domains repel each other and settle as "
            "far apart as they can, where a domain is any group of electrons on "
            "that atom: one lone pair, one single bond, one double bond or one "
            "triple bond each count as exactly one. Carbon in CO2 has two "
            "domains and no lone pairs, so they point in opposite directions. "
            "Oxygen in water has four domains, two of them lone pairs, spread "
            "toward the corners of a tetrahedron. A lone pair is held by one "
            "nucleus instead of two, so it takes up more angular room and "
            "squeezes the remaining bond angles."
        ),
        symbolic=(
            "AX2 for CO2, which gives linear at 180 degrees. AX2E2 for water, "
            "which gives bent, with the ideal tetrahedral 109.5 degrees "
            "compressed to the measured 104.5."
        ),
        connector=(
            "The two lone pairs on oxygen are one and the same thing in all "
            "three: they are why water is a bent liquid that dissolves salt "
            "while CO2 is a linear gas, they are the two unshared domains in "
            "the particulate picture, and they are the E2 in the label AX2E2."
        ),
        pitfall=(
            "The specific confusion is counting attached atoms instead of "
            "electron domains, which reads the shape off the symbolic formula "
            "rather than off the electron count. CO2 and H2O both show two "
            "attached atoms, so that count predicts one shape for both, and the "
            "measured angles are 180 and 104.5 degrees. The domains that decide "
            "the answer are the ones no formula shows."
        ),
        katex=r"\ce{CO2}:\ \mathrm{AX_2}\quad \ce{H2O}:\ \mathrm{AX_2E_2}",
        caption=(
            "Picture balloons tied together at their necks. Two balloons point "
            "straight away from each other. Four splay to the corners of a "
            "tripod plus one, and if two of the four are fatter than the rest "
            "the two thin ones get pushed closer together."
        ),
    ),
    TriangleView(
        node="GEN1.POLARITY",
        title="Polar bonds that add to nothing",
        macroscopic=(
            "Water dissolves table salt and mixes with ethanol in any "
            "proportion. Hexane does neither. Water is a liquid boiling at 100 "
            "degrees Celsius, while carbon dioxide, with more than twice the "
            "molar mass, sublimes at -78.5 degrees Celsius. A dipole moment "
            "measurement returns 1.85 debye for water and exactly zero for "
            "carbon dioxide."
        ),
        particulate=(
            "Each bond between different elements pulls electron density toward "
            "the more electronegative atom. In CO2 the gap is 3.44 - 2.55 = "
            "0.89, so each C=O bond is genuinely polar, but the molecule is "
            "linear and the two pulls point in exactly opposite directions with "
            "equal size, so they sum to nothing. In water the gap is 3.44 - "
            "2.20 = 1.24 and the molecule is bent at 104.5 degrees, so both "
            "pulls lie on the same side of the molecule and reinforce, leaving "
            "one net direction across the whole particle."
        ),
        symbolic=(
            "An arrow along each polar bond, pointing at the more "
            "electronegative atom, and then the vector sum of those arrows. The "
            "sum is the dipole moment, written mu and measured in debye: 0 D "
            "for CO2 and 1.85 D for water."
        ),
        connector=(
            "The vector sum is one quantity in all three: it is the 1.85 debye "
            "a measurement returns for water, it is the leftover pull once the "
            "two bond dipoles in the bent particle are added, and it is the "
            "resultant arrow you draw on the page."
        ),
        pitfall=(
            "The specific confusion is deciding polarity from bond polarity "
            "alone, which reads the answer off the symbolic formula and skips "
            "the particulate geometry entirely. Every C=O bond in CO2 is more "
            "polar than a C-H bond, and the molecule still has a dipole moment "
            "of exactly zero, because linear geometry makes the two arrows "
            "cancel. Polar bonds are necessary for a polar molecule and are not "
            "sufficient."
        ),
        katex=r"\ce{CO2}:\ \mu = 0\ \mathrm{D}\quad \ce{H2O}:\ \mu = 1.85\ \mathrm{D}",
        caption=(
            "Picture an arrow drawn along each bond. On the linear molecule "
            "they point away from the centre in exactly opposite directions and "
            "match in length, so the pair goes nowhere. On the bent molecule "
            "both point from a hydrogen up toward the oxygen and add into one "
            "longer arrow along the axis that bisects the angle."
        ),
    ),
    TriangleView(
        node="GEN1.IDEALGAS",
        title="Pressure as the drumming of particles",
        macroscopic=(
            "A sealed rigid steel cylinder of nitrogen sits on a bench with a "
            "gauge reading 1.00 atm at 25 degrees Celsius. Stand it in a "
            "boiling water bath at 100 degrees Celsius and the needle climbs to "
            "1.25 atm. Nothing entered or left and the cylinder did not change "
            "size."
        ),
        particulate=(
            "The gas particles fly in straight lines between collisions, and "
            "pressure is the summed force of their impacts on the wall divided "
            "by the wall area. Heating adds no particles. It makes each one "
            "faster, because average kinetic energy is proportional to absolute "
            "temperature, so impacts land harder and more often. The ideal gas "
            "model treats the particles as having no volume of their own and no "
            "attraction for each other, which is a good approximation at "
            "ordinary pressures and a poor one near condensation."
        ),
        symbolic=(
            "PV = nRT, with R = 0.08206 L*atm/(mol*K). With V and n fixed, P/T "
            "is constant, so P2 = P1 x T2 / T1 = 1.00 atm x 373.15 K / 298.15 K "
            "= 1.25 atm."
        ),
        connector=(
            "The absolute temperature is one quantity in all three: it is what "
            "the bath thermometer reports once converted to kelvin, it is "
            "proportional to the average kinetic energy of the particles "
            "striking the wall, and it is the T the equation multiplies."
        ),
        pitfall=(
            "The specific confusion is putting the Celsius reading into the "
            "equation, which treats a scale with an arbitrary zero as though it "
            "measured the particulate quantity directly. At 0 degrees Celsius "
            "the law would then predict zero volume, meaning a balloon in a "
            "freezer collapses to nothing. Particle motion does not stop at 0 "
            "degrees Celsius. Only the kelvin scale puts its zero where the "
            "particulate picture puts it, 273.15 degrees lower."
        ),
        katex="",
        caption=(
            "Picture a box of tiny hard spheres, far apart compared with their "
            "own size, each moving in a straight line until it hits a wall or "
            "another sphere and bounces. Warming the box adds no spheres and "
            "changes no walls. It speeds every sphere up, so the drumming on "
            "the walls gets harder and more frequent."
        ),
    ),
    TriangleView(
        node="GEN1.IMF",
        title="What boiling actually breaks",
        macroscopic=(
            "Water boils at 100 degrees Celsius. Hydrogen sulfide, a heavier "
            "molecule from the same group of the periodic table, boils at -60 "
            "degrees Celsius. Turning one gram of water at 100 degrees Celsius "
            "into steam takes about seven times the energy it took to heat that "
            "gram from room temperature up to boiling."
        ),
        particulate=(
            "Boiling separates whole molecules from one another and does not "
            "touch the bonds inside them. In water each molecule has a hydrogen "
            "bonded directly to oxygen, and that hydrogen is attracted strongly "
            "to a lone pair on a neighbouring molecule's oxygen, so each "
            "molecule is held by three or four such links at once on average. "
            "Hydrogen sulfide is polar too, but sulfur is much less "
            "electronegative and its lone pairs are more diffuse, so no "
            "comparable link forms and only weaker dipole and dispersion "
            "attractions remain."
        ),
        symbolic=(
            "H2O(l) -> H2O(g), with an enthalpy of vaporisation of +40.7 "
            "kJ/mol. The formula H2O is unchanged across the arrow, and that is "
            "the notation stating that nothing inside the molecule changed."
        ),
        connector=(
            "The intermolecular attraction is one quantity in all three: it is "
            "the 40.7 kJ/mol the kettle has to supply, it is the set of "
            "hydrogen bonds a molecule must be pulled out of, and it is the "
            "entire content of the arrow in H2O(l) -> H2O(g), because both "
            "sides of that arrow read the same."
        ),
        pitfall=(
            "The specific confusion is thinking that boiling breaks the "
            "covalent bonds inside the molecule, which merges the "
            "intramolecular and intermolecular levels into one. Steam is still "
            "made of intact H2O molecules, not loose H and O atoms. Vaporising "
            "water costs about 41 kJ/mol while breaking one O-H bond costs "
            "about 463 kJ/mol, more than ten times as much, and the symbolic "
            "level says so plainly: the formula on both sides of the arrow is "
            "identical."
        ),
        katex=r"\ce{H2O(l) -> H2O(g)}\quad \Delta H_{\mathrm{vap}} = +40.7\ \mathrm{kJ/mol}",
        caption=(
            "Picture the liquid as molecules packed close, each tethered to "
            "three or four neighbours by a short link running from one of its "
            "hydrogens to a lone pair on a neighbouring oxygen. Boiling is one "
            "molecule getting enough speed to snap all its tethers at once and "
            "leave, with the network intact behind it."
        ),
    ),
    # ---------------- GEN2: General Chemistry II (5) ----------------
    TriangleView(
        node="GEN2.EQUILIBRIUM",
        title="Constant reading, running reaction",
        macroscopic=(
            "Seal hydrogen and iodine vapour in a flask at 448 degrees "
            "Celsius. The purple colour fades over some minutes and then stops "
            "changing. Leave the flask a day and it looks the same. A "
            "colorimeter and a pressure gauge both hold steady, and the flask "
            "is neither cooling nor leaking."
        ),
        particulate=(
            "Nothing has stopped. Hydrogen and iodine molecules are still "
            "colliding and forming HI, and HI molecules are still coming apart, "
            "at exactly matched rates, so the number of each species stays "
            "constant while individual molecules keep changing identity. "
            "Replace some of the iodine with a heavier isotope and it turns up "
            "distributed across both I2 and HI, which is the experiment showing "
            "the traffic never stopped."
        ),
        symbolic=(
            "H2(g) + I2(g) <=> 2 HI(g), where the double arrow carries the "
            "whole idea, and K = [HI]^2 / ([H2][I2]) = 50.5 at 448 degrees "
            "Celsius. K is fixed at a given temperature no matter what amounts "
            "you started with."
        ),
        connector=(
            "The constant colour is the same fact as the matched rates and the "
            "same fact as K: the colorimeter reading stops moving because "
            "iodine is consumed exactly as fast as it is produced, and that "
            "equality of rates is what pins the concentration ratio the number "
            "50.5 reports."
        ),
        pitfall=(
            "The specific confusion is reading the constant macroscopic "
            "reading as a stopped reaction, which replaces a dynamic "
            "particulate picture with a static one. Both directions are still "
            "running, at equal rates. A symbolic error follows from the same "
            "root: dropping an exponent when the stoichiometry is not one to "
            "one. That exponent is a particulate count of how many molecules "
            "take part, not a decoration on the formula."
        ),
        katex=r"\ce{H2(g) + I2(g) <=> 2HI(g)}\quad K = \frac{[\ce{HI}]^2}{[\ce{H2}][\ce{I2}]} = 50.5",
        caption=(
            "Picture the flask as a crowd where pairs keep forming and "
            "breaking. At any instant some collisions are making HI and others "
            "are tearing it apart, and the two counts per second are equal, so "
            "a snapshot an hour later holds the same mix of species but not the "
            "same individual molecules in them."
        ),
    ),
    TriangleView(
        node="GEN2.LECHATELIER",
        title="A colour that moves with temperature",
        macroscopic=(
            "Two sealed glass tubes hold the same mixture of nitrogen dioxide "
            "and dinitrogen tetroxide. Stand one in ice water and it fades to "
            "nearly colourless. Stand the other in hot water and it darkens to "
            "deep brown. Return both to room temperature and the colours go "
            "back to where they started."
        ),
        particulate=(
            "Brown NO2 molecules pair up into colourless N2O4, and the pairs "
            "come apart again. Pairing releases about 57 kJ for every mole of "
            "N2O4 formed. Warming supplies the energy the reverse step needs, "
            "so more pairs break than form until the two rates match again at a "
            "mixture holding more single molecules. Cooling does the opposite. "
            "Neither particle changed. Only how many of each there are changed."
        ),
        symbolic=(
            "2 NO2(g) <=> N2O4(g), with a reaction enthalpy of -57.2 kJ/mol, "
            "and K = [N2O4] / [NO2]^2. Temperature is the one stress that "
            "changes the value of K rather than only the position."
        ),
        connector=(
            "The proportion of paired to unpaired molecules is one quantity in "
            "all three: it is the depth of the brown your eye reads, it is the "
            "ratio of N2O4 to NO2 particles in the tube, and it is what the "
            "number K reports at that temperature."
        ),
        pitfall=(
            "The specific confusion is believing that any stress which shifts "
            "the position also changes K. Injecting more NO2 darkens the tube "
            "at first and then drives the pairing forward, and Q settles back "
            "at precisely the same K. The reason is particulate: temperature "
            "changes the energy available to each step, while adding a reactant "
            "only changes how many particles are present. The related error is "
            "expecting a catalyst to shift the mixture. A catalyst lowers the "
            "barrier in both directions equally, so the tube reaches the same "
            "colour sooner rather than a different colour."
        ),
        katex=r"\ce{2NO2(g) <=> N2O4(g)}\quad \Delta H = -57.2\ \mathrm{kJ/mol}",
        caption=(
            "Picture the tube as a mix of single bent three atom molecules that "
            "absorb blue light and so look brown, and paired ones joined "
            "nitrogen to nitrogen that absorb nothing visible. Warming changes "
            "neither particle. It changes the headcount of each."
        ),
    ),
    TriangleView(
        node="GEN2.TITRATIONWEAK",
        title="Where the curve goes vertical",
        macroscopic=(
            "Put 25.00 mL of 0.100 M acetic acid in a flask with a pH meter and "
            "add 0.100 M sodium hydroxide from a burette. For the first 20 mL "
            "the meter climbs slowly. Between about 24.9 and 25.1 mL it jumps "
            "several pH units in two drops. After that it flattens again. At "
            "12.50 mL added the meter reads 4.76, and at 25.00 mL it reads "
            "about 8.7."
        ),
        particulate=(
            "Each added hydroxide ion takes a proton from an acetic acid "
            "molecule and turns it into an acetate ion. Early on the flask "
            "holds plenty of both forms, and any added base is absorbed by "
            "converting one form into the other, which is why the pH barely "
            "moves. Half way, exactly half the acid molecules have been "
            "converted, so acid and conjugate base are present in equal "
            "numbers. Once the last acetic acid molecule is gone there is "
            "nothing left to absorb the next hydroxide, so the next drop moves "
            "the pH a long way."
        ),
        symbolic=(
            "CH3COOH(aq) + OH-(aq) -> CH3COO-(aq) + H2O(l), one to one. At half "
            "equivalence [A-] = [HA], so the log term in pH = pKa + "
            "log([A-]/[HA]) is zero and pH = pKa = 4.76."
        ),
        connector=(
            "The count of acetic acid molecules converted is one quantity in "
            "all three: it is what the burette measures out drop by drop, it is "
            "how many particles have handed over their proton, and it is what "
            "the one to one ratio in the balanced equation fixes."
        ),
        pitfall=(
            "The specific confusion is equating the equivalence point with pH "
            "7, which swaps a stoichiometric condition for a macroscopic "
            "reading. Equivalence means the moles of added base equal the moles "
            "of acid originally present. For acetic acid with sodium hydroxide "
            "that lands near pH 8.7, because what remains in the flask is "
            "acetate, a weak base sitting in water. The related error is "
            "thinking the indicator creates the equivalence point. Run the same "
            "titration with a different indicator and the equivalence volume is "
            "identical, and only the endpoint your eye catches moves."
        ),
        katex=r"\ce{CH3COOH(aq) + OH^-(aq) -> CH3COO^-(aq) + H2O(l)}",
        caption=(
            "Picture the flask at four moments: all acid molecules and almost "
            "no acetate; then a roughly even mixture of the two at half way; "
            "then all acetate and no acid at equivalence; then acetate plus a "
            "growing surplus of free hydroxide. The vertical part of the curve "
            "is the narrow window between the third and fourth pictures."
        ),
    ),
    TriangleView(
        node="GEN2.ENTROPY",
        title="Heat that does not raise the temperature",
        macroscopic=(
            "An ice cube in a room at 20 degrees Celsius melts, and it never "
            "re-forms on its own. Melting one mole of ice absorbs 6.01 kJ from "
            "the surroundings, and a thermometer in the ice water holds at 0 "
            "degrees Celsius the entire time it is melting even though heat is "
            "flowing in."
        ),
        particulate=(
            "In ice, each water molecule sits at a fixed site in an open "
            "hydrogen bonded framework and can only vibrate in place. In liquid "
            "water the molecules keep their hydrogen bonds but constantly break "
            "and remake them, so they translate and rotate as well. The number "
            "of distinguishable arrangements open to the same molecules at the "
            "same energy is vastly larger in the liquid. Entropy measures that "
            "spread of energy and matter over available arrangements. It is not "
            "untidiness in the everyday sense, and it carries units of "
            "J/(mol*K)."
        ),
        symbolic=(
            "H2O(s) -> H2O(l), for which delta S = 6010 J/mol divided by 273.15 "
            "K = +22.0 J/(mol*K). The second law is written for the universe: "
            "delta S(universe) = delta S(system) + delta S(surroundings) is "
            "positive for any spontaneous process."
        ),
        connector=(
            "The 6.01 kJ per mole is one quantity read three ways: it is the "
            "heat the room loses while the thermometer refuses to show a "
            "temperature rise, it is the energy that lets each molecule leave "
            "its fixed site in the framework, and it is the numerator of the "
            "delta S you compute."
        ),
        pitfall=(
            "The specific confusion is treating entropy as untidiness, a "
            "macroscopic visual impression, in place of a measured dispersal of "
            "energy and matter with units. A second confusion follows from the "
            "same root: assuming the system's own entropy must increase for a "
            "process to be spontaneous. Water freezing at -10 degrees Celsius "
            "has a negative delta S for the system and happens anyway, because "
            "the heat it dumps raises the entropy of the surroundings by more. "
            "The second law constrains the universe, not the beaker."
        ),
        katex=r"\ce{H2O(s) -> H2O(l)}\quad \Delta S = \frac{6010\ \mathrm{J/mol}}{273.15\ \mathrm{K}} = +22.0\ \mathrm{J/(mol\cdot K)}",
        caption=(
            "Picture ice as molecules pinned at the corners of an open "
            "hexagonal cage, each jiggling in place and never swapping "
            "neighbours. Picture liquid water as the same molecules at almost "
            "the same spacing, still linked, but constantly trading partners "
            "and sliding past one another."
        ),
    ),
    TriangleView(
        node="GEN2.GALVANIC",
        title="Sending the electrons the long way round",
        macroscopic=(
            "Drop a zinc strip into blue copper sulfate solution and it goes "
            "dark as copper plates onto it, the blue fades, and the beaker "
            "warms. Now split the same reaction into two beakers joined by a "
            "wire and a salt bridge. A voltmeter across the metals reads 1.10 "
            "V, the zinc strip loses mass, the copper strip gains it, and a "
            "small motor in the circuit turns."
        ),
        particulate=(
            "The same electron transfer happens in both setups. In the single "
            "beaker a zinc atom at the surface hands two electrons straight to "
            "a copper ion that has drifted against it, and the transfer is over "
            "within one collision, so the energy leaves as heat. In the cell "
            "the two half reactions sit in different beakers, so those two "
            "electrons cannot reach a copper ion except through the wire. "
            "Electrons never cross the salt bridge. Ions move through it "
            "instead, cancelling the charge that would otherwise build up as "
            "zinc ions enter one beaker and copper ions leave the other."
        ),
        symbolic=(
            "Zn(s) + Cu2+(aq) -> Zn2+(aq) + Cu(s), split into Zn(s) -> Zn2+(aq) "
            "+ 2 e- at the anode and Cu2+(aq) + 2 e- -> Cu(s) at the cathode. "
            "E(cell) = E(cathode) - E(anode) = 0.34 - (-0.76) = 1.10 V, and "
            "delta G = -nFE with n = 2 and F = 96485 C/mol."
        ),
        connector=(
            "The two electrons are the same two electrons in all three "
            "descriptions: they are the current the voltmeter and the motor "
            "respond to, they are what one zinc atom hands to one copper ion, "
            "and they are the 2 e- that appear on opposite sides of the two "
            "half equations and cancel when the halves are added."
        ),
        pitfall=(
            "The specific confusion is thinking electrons travel through the "
            "salt bridge, which puts a particulate flow in the wrong place "
            "while the macroscopic reading still appears to make sense. Remove "
            "the wire and the current stops even though the salt bridge is "
            "still there, so the wire is the electron path. Remove the salt "
            "bridge and the cell stops too, because charge builds up in each "
            "beaker within moments, which is what the bridge is actually for."
        ),
        katex=r"\ce{Zn(s) + Cu^2+(aq) -> Zn^2+(aq) + Cu(s)}\quad E^\circ_{\mathrm{cell}} = +1.10\ \mathrm{V}",
        caption=(
            "Picture the two beakers side by side. On the left, zinc atoms peel "
            "off the strip as ions into solution and leave two electrons behind "
            "in the metal. Those electrons run along the wire to the right, "
            "where copper ions meet them at the copper surface and stick as "
            "neutral atoms. In the tube joining the solutions, negative ions "
            "drift left and positive ions drift right, and no electron enters "
            "that tube."
        ),
    ),
]


TRIANGLE_VIEWS: dict[str, TriangleView] = {v.node: v for v in _VIEWS}

# The organic views live in their own modules so the general chemistry set above
# stays readable. They are merged here rather than kept separate because
# for_node is the single place the rest of the system asks whether a view
# exists, and a second source of truth would let the lesson payload's
# has_triangle_view flag disagree with what the endpoint can actually serve.
try:
    from app.data.triangle_views_org1 import TRIANGLE_VIEWS_ORG1

    TRIANGLE_VIEWS.update(TRIANGLE_VIEWS_ORG1)
except ImportError:  # pragma: no cover - organic views not authored yet
    pass

try:
    from app.data.triangle_views_org2 import TRIANGLE_VIEWS_ORG2

    TRIANGLE_VIEWS.update(TRIANGLE_VIEWS_ORG2)
except ImportError:  # pragma: no cover
    pass


def for_node(node: str) -> TriangleView | None:
    """The triangle view for a curriculum node, or None if there is not one.

    Only nodes marked triangle_eligible in the curriculum carry a view, so a
    None here is an ordinary answer rather than an error.
    """
    return TRIANGLE_VIEWS.get(node)


def covered_nodes() -> list[str]:
    """Node codes that have a triangle view.

    Reads the merged mapping rather than the general chemistry list alone, so
    the organic views are not invisible to callers that ask what is covered.
    """
    return sorted(TRIANGLE_VIEWS)

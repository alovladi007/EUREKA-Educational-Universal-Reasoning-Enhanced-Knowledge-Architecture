"""Lessons for the thirteen nodes the rechaptered organic sequence added.

Eight of them are ORG1 chapter 8, Noncovalent Intermolecular Interactions,
which is new in full. General chemistry teaches intermolecular forces, but the
organic reading of them - why boiling point tracks chain shape, why an alcohol
and an ether of the same formula boil ninety degrees apart, why a drug has to
dissolve in both a membrane and blood - was taught nowhere in ORG1 or ORG2.

Every structure here was passed through RDKit before the claim was written,
not after. Deriving the formula from the structure is the only way the prose
and the claim cannot disagree, and it is why claims exist at all.

Numbers this system cannot derive - boiling points, bond energies, pKa - are
carried as Source claims with a citation. The checker cannot confirm the
number; it confirms that somebody is accountable for it.
"""

from __future__ import annotations

from app.data.claims import Formula, Relationship, Source
from app.data.lesson_types import Lesson

# Named once so a claim and its prose cannot drift apart.
ETHENE = "C=C"
BUT_2_ENE = "CC=CC"
ETHANE = "CC"
WATER = "O"
METHANE = "C"
PENTANE = "CCCCC"
NEOPENTANE = "CC(C)(C)C"
CARBON_DIOXIDE = "O=C=O"
DICHLOROMETHANE = "ClCCl"
ETHANOL = "CCO"
DIMETHYL_ETHER = "COC"
BUTANE = "CCCC"
HEXANE = "CCCCCC"
ETHYLENE_GLYCOL = "OCCO"
GLYCEROL = "OCC(O)CO"
DIMETHYL_SULFIDE = "CSC"
DMSO = "CS(=O)C"
DIMETHYL_SULFONE = "CS(=O)(=O)C"
TOLUENE = "Cc1ccccc1"
BENZYL_BROMIDE = "BrCc1ccccc1"
CHLOROBENZENE = "Clc1ccccc1"
VINYL_CHLORIDE = "C=CCl"
BIPHENYL = "c1ccccc1-c1ccccc1"

CRC = "CRC Handbook of Chemistry and Physics, 97th edition"

LESSONS_ORG_RECHAPTER = {

    # ---------------------------------------------------------------- ch 4A
    "ORG1.ALKENEBONDING": Lesson(
        node="ORG1.ALKENEBONDING",
        objective=(
            "Explain the double bond as one sigma and one pi bond, and predict "
            "what that structure forbids."
        ),
        build_on=(
            "You already know that an sp3 carbon sits at the centre of a "
            "tetrahedron and that its groups can rotate freely. An alkene "
            "carbon is sp2, and the free rotation is what it loses."
        ),
        core_idea=(
            "A carbon carbon double bond is not two of the same thing. One "
            "bond is a sigma bond, formed head on between two sp2 orbitals, "
            "and it is strong and cylindrically symmetric. The other is a pi "
            "bond, formed by two p orbitals overlapping side by side above and "
            "below the plane, and it is weaker and flat. Rotating one carbon "
            "relative to the other would tear the p orbitals out of alignment, "
            "so rotation costs the whole pi bond and does not happen at room "
            "temperature. That single fact produces everything else: the six "
            "atoms around the double bond are coplanar, the bond angles are "
            "near 120 degrees, and two arrangements of the substituents become "
            "different compounds rather than the same one in a different pose."
        ),
        worked_example=(
            "Take but-2-ene, CH3-CH=CH-CH3. Each alkene carbon carries a "
            "methyl and a hydrogen. Because rotation is blocked, the two "
            "methyls are either on the same side of the double bond or on "
            "opposite sides, and these are two separate substances with "
            "different melting points, not two drawings of one substance. Both "
            "have molecular formula C4H8, which is the point: they are "
            "stereoisomers, identical in connectivity, different in shape. "
            "Contrast butane, where rotating about the C2-C3 single bond turns "
            "any conformation into any other and no isomers result."
        ),
        try_it_prompt=(
            "1,1-dichloroethene has both chlorines on the same carbon. Does it "
            "have cis and trans forms?"
        ),
        try_it_answer=(
            "No. Cis and trans require each alkene carbon to carry two "
            "different groups. Here one carbon carries two identical "
            "chlorines, so swapping them changes nothing and only one compound "
            "exists. Blocked rotation is necessary for the isomerism but not "
            "sufficient; you also need something to distinguish the sides."
        ),
        pitfall=(
            "Treating the pi bond as a second, stronger sigma bond. It is the "
            "weaker of the two, which is why alkenes react by breaking the pi "
            "bond and leaving the sigma bond intact. Every addition reaction "
            "in the next two chapters is that trade."
        ),
        claims=(
            Formula(BUT_2_ENE, "C4H8", "but-2-ene, the cis and trans pair"),
            Formula(ETHENE, "C2H4", "the simplest alkene"),
            Source(
                "The rotational barrier about a C=C bond is roughly 65 "
                "kcal/mol, against about 3 kcal/mol for the C-C bond of "
                "ethane.",
                "Anslyn and Dougherty, Modern Physical Organic Chemistry, ch 2",
            ),
        ),
    ),

    # ---------------------------------------------------------------- ch 4F
    "ORG1.CATALYSIS": Lesson(
        node="ORG1.CATALYSIS",
        objective=(
            "State what a catalyst does to a reaction and, more importantly, "
            "what it cannot do."
        ),
        build_on=(
            "You have just read energy diagrams and seen that the barrier "
            "height sets the rate. A catalyst is a way of changing that "
            "barrier without changing the two ends of the diagram."
        ),
        core_idea=(
            "A catalyst provides a different route from reactants to products, "
            "one with a lower activation barrier, and it comes out of the "
            "reaction unchanged. Two consequences follow, and the second is "
            "the one exams test. First, the reaction goes faster, because rate "
            "depends exponentially on the barrier. Second, the equilibrium "
            "position does not move at all, because the reactants and products "
            "sit where they sat; only the path between them changed. A "
            "catalyst speeds the approach to equilibrium in both directions "
            "equally. If it accelerated only the forward reaction it would "
            "shift the equilibrium, and that would let you extract work from "
            "nothing."
        ),
        worked_example=(
            "Hydrogenation of ethene, C2H4 plus H2 giving C2H6, is strongly "
            "exothermic and yet a mixture of ethene and hydrogen is stable in "
            "a flask indefinitely. The thermodynamics are favourable; the "
            "barrier is enormous, because the H-H bond must break. Add finely "
            "divided palladium and the reaction runs at room temperature. The "
            "metal surface binds and weakens the H-H bond, so the hydrogens "
            "are delivered from a surface rather than from a free molecule. "
            "The palladium is filtered off afterwards unchanged, and the "
            "equilibrium constant is exactly what it was without it."
        ),
        try_it_prompt=(
            "A reaction has an equilibrium constant of 0.01 at 25 degrees "
            "Celsius. You add the best catalyst ever made. What is K now?"
        ),
        try_it_answer=(
            "0.01. A catalyst changes the rate, never the equilibrium "
            "constant. You will reach that unfavourable equilibrium much "
            "faster, which is often useless: if you want more product you must "
            "change the thermodynamics, by removing product or changing "
            "temperature, not the kinetics."
        ),
        pitfall=(
            "Believing a catalyst increases yield. It increases rate. The two "
            "coincide only when the reaction was too slow to reach equilibrium "
            "in the time available, which is common enough to make the wrong "
            "idea feel right."
        ),
        claims=(
            Formula(ETHENE, "C2H4", "the alkene hydrogenated"),
            Formula(ETHANE, "C2H6", "the product, two hydrogens added"),
        ),
    ),

    # ------------------------------------------------------- ch 8, six nodes
    "ORG1.IMFTYPES": Lesson(
        node="ORG1.IMFTYPES",
        objective=(
            "Name the three noncovalent interactions and rank them by "
            "strength."
        ),
        build_on=(
            "Every bond you have drawn so far holds atoms inside a molecule. "
            "These are the far weaker forces that hold separate molecules near "
            "each other, and they decide physical behaviour rather than "
            "reactivity."
        ),
        core_idea=(
            "Three interactions matter, and they are all electrostatic. "
            "London dispersion is present in everything: electrons move, so "
            "any molecule has a fleeting dipole at any instant, which induces "
            "a matching dipole in a neighbour. Dipole-dipole acts between "
            "molecules with a permanent dipole, lining positive against "
            "negative. Hydrogen bonding is a strong, directional special case "
            "of dipole-dipole, available only when hydrogen is bonded to N, O "
            "or F and a lone pair is available to receive it. Typical "
            "strengths run roughly 1 to 10 kJ/mol for dispersion, 5 to 25 for "
            "dipole-dipole and 10 to 40 for a hydrogen bond, against 350 or "
            "more for a covalent bond. All three are an order of magnitude "
            "below the bonds inside the molecule, which is why boiling a "
            "liquid separates molecules without destroying them."
        ),
        worked_example=(
            "Compare methane, CH4, and water, H2O. Methane is tetrahedral and "
            "its four C-H bond dipoles cancel, so it has no permanent dipole "
            "and only dispersion is available. Water is bent, so its two O-H "
            "dipoles do not cancel, and its hydrogens are on oxygen with lone "
            "pairs to spare, so it hydrogen bonds. Both are small molecules of "
            "similar mass. Methane boils at 112 K and water at 373 K, a gap of "
            "261 K produced entirely by which interactions are available."
        ),
        try_it_prompt=(
            "Which interactions are available to a molecule of ethane, "
            "CH3CH3?"
        ),
        try_it_answer=(
            "Dispersion only. Ethane is nonpolar, so there is no permanent "
            "dipole for dipole-dipole, and its hydrogens are on carbon, not on "
            "N, O or F, so it cannot donate a hydrogen bond. Dispersion is "
            "never absent, which is why even helium liquefies if you cool it "
            "far enough."
        ),
        pitfall=(
            "Calling hydrogen bonding a bond. It is an interaction between "
            "molecules, roughly a twentieth the strength of the O-H covalent "
            "bond it involves. The name is historical and it misleads."
        ),
        claims=(
            Formula(METHANE, "CH4", "dispersion only"),
            Formula(WATER, "H2O", "hydrogen bonding"),
            Source(
                "Methane boils at 111.7 K and water at 373.1 K at 1 atm.",
                CRC,
            ),
        ),
    ),

    "ORG1.DISPERSION": Lesson(
        node="ORG1.DISPERSION",
        objective=(
            "Predict relative dispersion strength from molecular size and, "
            "critically, from shape."
        ),
        build_on=(
            "You have just met dispersion as the interaction every molecule "
            "has. This node is about what makes it stronger in one molecule "
            "than another."
        ),
        core_idea=(
            "Dispersion arises from instantaneous dipoles, so it grows with "
            "the number of electrons that can slosh about, which tracks "
            "molecular size. But it acts only where two molecules are in "
            "contact, so it also grows with contact area. Shape therefore "
            "matters as much as mass. A long, straight molecule can lie "
            "alongside a neighbour over its whole length; a compact, branched "
            "molecule of exactly the same formula touches only at a small "
            "patch, like stacking spheres instead of pencils. More branching "
            "means less surface, less dispersion, and a lower boiling point."
        ),
        worked_example=(
            "Pentane and neopentane are both C5H12, identical in formula and "
            "in molecular mass. Pentane is an unbranched chain and boils at "
            "309 K. Neopentane is a central carbon carrying four methyls, "
            "almost spherical, and boils at 283 K. Same electrons, 26 K "
            "difference, produced by contact area alone. They are "
            "constitutional isomers, so nothing but the shape differs."
        ),
        try_it_prompt=(
            "Rank by boiling point: pentane, hexane, neopentane."
        ),
        try_it_answer=(
            "Hexane highest, then pentane, then neopentane. Hexane wins on "
            "size, having more electrons than either. Pentane beats neopentane "
            "on shape, the two being the same size. Size first, then shape as "
            "the tie breaker."
        ),
        pitfall=(
            "Ranking by molecular mass alone. It works only when the shapes "
            "are comparable, and every exam question that mentions branching "
            "is testing exactly the case where it fails."
        ),
        claims=(
            Formula(PENTANE, "C5H12", "unbranched"),
            Formula(NEOPENTANE, "C5H12", "branched, same formula"),
            Relationship(PENTANE, NEOPENTANE, "constitutional",
                         "same formula, different connectivity"),
            Source(
                "Pentane boils at 309.2 K and neopentane at 282.6 K at 1 atm.",
                CRC,
            ),
        ),
    ),

    "ORG1.DIPOLE": Lesson(
        node="ORG1.DIPOLE",
        objective=(
            "Decide whether a molecule has a net dipole by adding its bond "
            "dipoles as vectors."
        ),
        build_on=(
            "You know from Unit 1 that an electronegativity difference "
            "polarises a bond. A molecular dipole is what those bond dipoles "
            "add up to, and symmetry decides whether they survive."
        ),
        core_idea=(
            "A bond between unlike atoms carries a dipole pointing toward the "
            "more electronegative one. The molecular dipole is the vector sum "
            "of all of them, so it depends on geometry, not just on which "
            "atoms are present. A symmetric arrangement of identical bond "
            "dipoles cancels to zero however polar the individual bonds are. "
            "This is why polar bonds and a polar molecule are two different "
            "claims, and why you must draw the shape before answering."
        ),
        worked_example=(
            "Carbon dioxide, O=C=O, has two strongly polar C=O bonds. The "
            "molecule is linear, so the two dipoles point in exactly opposite "
            "directions and cancel: CO2 is nonpolar despite polar bonds, and "
            "it does not dissolve well in water. Dichloromethane, CH2Cl2, has "
            "two polar C-Cl bonds on a tetrahedral carbon. Tetrahedral "
            "geometry puts them at about 109 degrees, not 180, so they do not "
            "cancel and the molecule has a substantial dipole, which is why it "
            "is a useful polar solvent."
        ),
        try_it_prompt=(
            "Tetrachloromethane, CCl4, has four very polar C-Cl bonds. Is it "
            "polar?"
        ),
        try_it_answer=(
            "No. Four identical bond dipoles arranged tetrahedrally sum to "
            "zero by symmetry, exactly as the four corners of a tetrahedron "
            "average to its centre. CCl4 is nonpolar and immiscible with "
            "water, which surprises people who count the chlorines."
        ),
        pitfall=(
            "Answering from the atoms rather than the shape. Every molecule "
            "that traps this - CO2, CCl4, BF3, benzene with para substituents "
            "- has polar bonds and no dipole."
        ),
        claims=(
            Formula(CARBON_DIOXIDE, "CO2", "linear, dipoles cancel"),
            Formula(DICHLOROMETHANE, "CH2Cl2", "bent, dipoles do not cancel"),
            Source(
                "The dipole moment of CO2 is 0 D and that of "
                "dichloromethane is 1.60 D.",
                CRC,
            ),
        ),
    ),

    "ORG1.HBONDING": Lesson(
        node="ORG1.HBONDING",
        objective=(
            "Identify hydrogen bond donors and acceptors in a structure and "
            "predict the consequence."
        ),
        build_on=(
            "Hydrogen bonding was named in the previous node as the strongest "
            "of the three interactions. Here you learn precisely when it is "
            "available, because the condition is narrow."
        ),
        core_idea=(
            "A hydrogen bond needs two parts. A donor is a hydrogen already "
            "bonded to N, O or F: those three are electronegative enough to "
            "strip the hydrogen of most of its electron density, leaving a "
            "nearly bare proton. An acceptor is a lone pair on N, O or F. A "
            "molecule can be both, one, or neither. Being both is what makes "
            "water and alcohols exceptional, because every molecule can bond "
            "to several neighbours at once and the network is extensive. "
            "Carbon bonded hydrogens never donate, however many there are."
        ),
        worked_example=(
            "Ethanol, CH3CH2OH, and dimethyl ether, CH3OCH3, are both C2H6O. "
            "They have the same formula, the same mass and the same number of "
            "electrons, so dispersion is the same. Ethanol has an O-H, so it "
            "is a donor and an acceptor and hydrogen bonds to itself. "
            "Dimethyl ether has oxygen with lone pairs, so it is an acceptor "
            "only, and with no donor there is nothing to bond to. Ethanol "
            "boils at 351 K, dimethyl ether at 249 K. A 102 K gap from one "
            "hydrogen in a different place."
        ),
        try_it_prompt=(
            "Can acetone, (CH3)2C=O, hydrogen bond to itself? Can it hydrogen "
            "bond to water?"
        ),
        try_it_answer=(
            "Not to itself, and yes to water. Acetone has oxygen lone pairs so "
            "it accepts, but every one of its hydrogens is on carbon so it "
            "cannot donate. Pure acetone therefore has no hydrogen bonding. "
            "Mixed with water, water donates and acetone accepts, which is why "
            "the two are completely miscible."
        ),
        pitfall=(
            "Treating any molecule containing oxygen as a hydrogen bonder. "
            "Ethers, esters and ketones accept but cannot donate, so they "
            "boil far below alcohols of the same size."
        ),
        claims=(
            Formula(ETHANOL, "C2H6O", "donor and acceptor"),
            Formula(DIMETHYL_ETHER, "C2H6O", "acceptor only, same formula"),
            Relationship(ETHANOL, DIMETHYL_ETHER, "constitutional",
                         "isomers differing only in where the hydrogen sits"),
            Source(
                "Ethanol boils at 351.4 K and dimethyl ether at 248.3 K at "
                "1 atm.",
                CRC,
            ),
        ),
    ),

    "ORG1.IMFPROPERTIES": Lesson(
        node="ORG1.IMFPROPERTIES",
        objective=(
            "Rank a set of compounds by boiling point from their structures "
            "alone."
        ),
        build_on=(
            "You now know all three interactions and what switches each one "
            "on. Ranking boiling points is those three rules applied in "
            "order."
        ),
        core_idea=(
            "Boiling separates molecules, so boiling point measures how "
            "strongly they hold one another. Work down a fixed order. First "
            "ask whether hydrogen bonding is available, since it dominates "
            "when present. If two compounds tie there, compare permanent "
            "dipoles. If they tie again, compare size, then shape. Melting "
            "point follows the same forces but adds packing efficiency, which "
            "is why a symmetric molecule can melt high and boil low: "
            "neopentane melts far above pentane because spheres pack neatly "
            "into a crystal, while boiling still favours the chain."
        ),
        worked_example=(
            "Rank butane, ethanol and dimethyl ether. Ethanol is the only "
            "hydrogen bond donor, so it is highest at 351 K. Butane and "
            "dimethyl ether then compete: dimethyl ether has a permanent "
            "dipole and butane does not, so the ether should win, and it does, "
            "at 249 K against butane at 273 K. That last comparison fails, "
            "which is the useful part: butane is larger, C4H10 against C2H6O, "
            "and its extra dispersion outweighs the ether dipole. The rules "
            "are ordered by typical strength, not by law."
        ),
        try_it_prompt=(
            "Rank by boiling point: hexane, ethanol, pentane."
        ),
        try_it_answer=(
            "Ethanol highest, then hexane, then pentane. Ethanol hydrogen "
            "bonds and wins despite being the smallest. Hexane beats pentane "
            "on size, both being nonpolar alkanes with dispersion only."
        ),
        pitfall=(
            "Applying the order as though it were absolute. A large nonpolar "
            "molecule can out-boil a small polar one, because dispersion "
            "accumulates with size while a dipole does not."
        ),
        claims=(
            Formula(BUTANE, "C4H10", "dispersion only"),
            Formula(ETHANOL, "C2H6O", "hydrogen bonding"),
            Formula(DIMETHYL_ETHER, "C2H6O", "dipole, no donor"),
            Source(
                "Boiling points at 1 atm: butane 272.7 K, dimethyl ether "
                "248.3 K, ethanol 351.4 K, pentane 309.2 K, hexane 341.9 K.",
                CRC,
            ),
        ),
    ),

    "ORG1.SOLUBILITY": Lesson(
        node="ORG1.SOLUBILITY",
        objective=(
            "Predict whether two substances mix by reading the polar and "
            "nonpolar parts of each structure."
        ),
        build_on=(
            "Boiling point asked how strongly a molecule holds its own kind. "
            "Solubility asks whether it would rather hold a different kind, "
            "and the same three interactions answer it."
        ),
        core_idea=(
            "Dissolving replaces solute-solute and solvent-solvent "
            "interactions with solute-solvent ones. That trade is worthwhile "
            "when the new interactions are comparable to the old, which "
            "happens when solute and solvent use the same interactions - like "
            "dissolves like. For organic molecules the useful move is to read "
            "a structure as two competing regions: a polar head that can "
            "hydrogen bond, and a nonpolar hydrocarbon tail that cannot. Which "
            "region dominates decides the behaviour, and the balance tips "
            "somewhere around four or five carbons per hydroxyl group."
        ),
        worked_example=(
            "Ethanol, C2H6O, is fully miscible with water: two carbons of tail "
            "against one hydroxyl, and the hydroxyl wins. Hexane, C6H14, is "
            "immiscible: no polar region at all. Between them, butan-1-ol has "
            "four carbons and dissolves to about 7 g per 100 mL, partly "
            "soluble. Push to glycerol, C3H8O3, with three hydroxyls on three "
            "carbons, and it is miscible with water and insoluble in hexane. "
            "The count of hydroxyls against carbons predicts all four cases."
        ),
        try_it_prompt=(
            "Would you expect decan-1-ol, a ten carbon chain with one OH, to "
            "dissolve in water?"
        ),
        try_it_answer=(
            "No, or only in traces. Ten carbons of nonpolar tail overwhelm the "
            "single hydroxyl, so it behaves far more like a hydrocarbon than "
            "like an alcohol. It dissolves readily in hexane instead."
        ),
        pitfall=(
            "Reading a functional group as a switch rather than a share. "
            "An OH does not make a molecule water soluble; it competes with "
            "whatever hydrocarbon is attached, and long chains win."
        ),
        claims=(
            Formula(ETHANOL, "C2H6O", "miscible with water"),
            Formula(HEXANE, "C6H14", "immiscible with water"),
            Formula(GLYCEROL, "C3H8O3", "three hydroxyls, miscible"),
            Source(
                "Butan-1-ol dissolves in water to about 7.3 g per 100 mL at "
                "293 K; hexane to about 0.001 g per 100 mL.",
                CRC,
            ),
        ),
    ),

    # ------------------------------------------------------------- ORG2 ch 2
    "ORG2.GLYCOLS": Lesson(
        node="ORG2.GLYCOLS",
        objective=(
            "Make a 1,2-diol from an alkene and cleave one back to two "
            "carbonyls."
        ),
        build_on=(
            "You made epoxides from alkenes in ORG1 and opened them with "
            "nucleophiles. A glycol is what you get when the nucleophile is "
            "water, and there is also a route that skips the epoxide."
        ),
        core_idea=(
            "A glycol, or vicinal diol, carries hydroxyls on adjacent carbons. "
            "Two routes make one from an alkene and they differ in "
            "stereochemistry, which is the whole reason to know both. Osmium "
            "tetroxide, or cold dilute permanganate, adds both oxygens to the "
            "same face through a cyclic ester, giving the syn diol. Epoxidation "
            "followed by aqueous acid opens the ring by backside attack, "
            "giving the anti diol. Running the process backwards, periodic "
            "acid cleaves the C-C bond between the two hydroxyls to give two "
            "carbonyl compounds, which makes a glycol a useful waypoint rather "
            "than only a product."
        ),
        worked_example=(
            "Ethylene glycol, HOCH2CH2OH, C2H6O2, comes from ethene by either "
            "route; with only one carbon each side there is no stereochemistry "
            "to distinguish them. Now treat it with periodic acid. The bond "
            "between the two hydroxyl bearing carbons breaks and each carbon "
            "becomes a carbonyl, giving two molecules of formaldehyde. Note "
            "the bookkeeping: a two carbon diol yields two one carbon "
            "fragments, so the carbon count is conserved and the cleavage "
            "point is unambiguous."
        ),
        try_it_prompt=(
            "Cyclohexene is treated with osmium tetroxide, then the product "
            "with periodic acid. What comes out?"
        ),
        try_it_answer=(
            "A single six carbon chain with an aldehyde at each end, "
            "hexanedial. Osmium tetroxide gives the cis diol on the ring, then "
            "periodate cleaves the ring open between the two hydroxyls. "
            "Because the diol was inside a ring, cleaving it does not give two "
            "molecules; it gives one chain."
        ),
        pitfall=(
            "Forgetting that cleaving a diol inside a ring opens the ring "
            "rather than splitting the molecule in two. Count the ring before "
            "counting the fragments."
        ),
        claims=(
            Formula(ETHYLENE_GLYCOL, "C2H6O2", "the simplest vicinal diol"),
            Formula(GLYCEROL, "C3H8O3", "a triol, for contrast"),
            Formula(ETHENE, "C2H4", "the alkene the diol comes from"),
        ),
    ),

    "ORG2.SULFIDES": Lesson(
        node="ORG2.SULFIDES",
        objective=(
            "Compare a sulfide to its oxygen analogue and oxidise it up the "
            "sulfur ladder."
        ),
        build_on=(
            "You have just met ethers, R-O-R. A sulfide is the same connection "
            "with sulfur in place of oxygen, and almost every difference "
            "follows from sulfur being larger and more polarisable."
        ),
        core_idea=(
            "Sulfur sits below oxygen, so it is bigger, holds its electrons "
            "more loosely and is far more polarisable. Three consequences "
            "matter. Sulfides are much better nucleophiles than ethers, "
            "because a soft, diffuse lone pair attacks carbon readily. "
            "Thiolates are better nucleophiles than alkoxides for the same "
            "reason even though they are weaker bases. And unlike oxygen, "
            "sulfur can expand beyond an octet, so it oxidises in two clean "
            "steps: sulfide to sulfoxide to sulfone. Ethers do none of this, "
            "which is why sulfur chemistry is worth a separate node rather "
            "than a footnote."
        ),
        worked_example=(
            "Dimethyl sulfide, CH3SCH3, is C2H6S. Oxidise once, with one "
            "equivalent of hydrogen peroxide, and you get dimethyl sulfoxide, "
            "C2H6OS, the solvent DMSO: one oxygen added, sulfur now bearing a "
            "formal positive charge against an oxygen anion. Oxidise again "
            "with excess and you get dimethyl sulfone, C2H6O2S. The formulas "
            "track the ladder exactly, gaining one oxygen per step, which is "
            "the fastest way to check you have drawn the right stage."
        ),
        try_it_prompt=(
            "Sodium thiolate, CH3S-, and sodium methoxide, CH3O-, both meet "
            "1-bromobutane. Which substitutes faster, and is that the same as "
            "which is more basic?"
        ),
        try_it_answer=(
            "The thiolate substitutes faster, and no, it is the less basic of "
            "the two. Nucleophilicity and basicity are different properties: "
            "basicity is about binding a proton at equilibrium, "
            "nucleophilicity about attacking carbon in a rate determining "
            "step. Sulfur's polarisability helps the second and not the first."
        ),
        pitfall=(
            "Assuming sulfur behaves like oxygen because it sits below it. The "
            "useful reactions of sulfides - their nucleophilicity and the "
            "oxidation ladder - are precisely the ones oxygen cannot do."
        ),
        claims=(
            Formula(DIMETHYL_SULFIDE, "C2H6S", "the sulfide"),
            Formula(DMSO, "C2H6OS", "one oxidation step, DMSO"),
            Formula(DIMETHYL_SULFONE, "C2H6O2S", "two steps, the sulfone"),
        ),
    ),

    # ------------------------------------------------------------- ORG2 ch 8
    "ORG2.BENZYLIC": Lesson(
        node="ORG2.BENZYLIC",
        objective=(
            "Explain why the carbon attached to a benzene ring is unusually "
            "reactive, in three different intermediates."
        ),
        build_on=(
            "You have just seen allylic positions stabilised by a neighbouring "
            "double bond. A benzylic position is the same idea with a whole "
            "aromatic ring next door, so the stabilisation is larger and "
            "available to more intermediate types."
        ),
        core_idea=(
            "The benzylic carbon is the one directly bonded to a benzene ring. "
            "Anything electron deficient or electron rich placed there is "
            "delocalised into the ring, which spreads the charge or the odd "
            "electron over four positions instead of one. What makes benzylic "
            "chemistry distinctive is that this works for all three "
            "intermediates: the cation, the radical and the anion are each "
            "stabilised, because the ring can accept or donate as required. "
            "Practically this means benzylic halides undergo both SN1 and SN2 "
            "unusually well, benzylic C-H bonds brominate selectively under "
            "radical conditions, and the whole side chain oxidises to a "
            "carboxylic acid with hot permanganate."
        ),
        worked_example=(
            "Toluene, C7H8, treated with N-bromosuccinimide and light gives "
            "benzyl bromide, C7H7Br, and essentially nothing else. The radical "
            "abstracts a hydrogen from the methyl, and the resulting benzylic "
            "radical is delocalised into the ring. Ring hydrogens are not "
            "touched, because abstracting one would give an aryl radical with "
            "no such delocalisation. One position out of eight hydrogens, "
            "chosen entirely by the stability of the intermediate."
        ),
        try_it_prompt=(
            "Hot acidic potassium permanganate is applied to tert-butylbenzene "
            "and to ethylbenzene. What happens to each side chain?"
        ),
        try_it_answer=(
            "Ethylbenzene oxidises to benzoic acid; tert-butylbenzene is "
            "untouched. Side chain oxidation needs a benzylic hydrogen to "
            "start from, and the tert-butyl group has none, its benzylic "
            "carbon carrying three methyls instead. Chain length does not "
            "matter, only that one hydrogen."
        ),
        pitfall=(
            "Assuming the ring reacts. In benzylic chemistry the aromatic ring "
            "is the stabiliser and the spectator; the reaction happens on the "
            "carbon beside it."
        ),
        claims=(
            Formula(TOLUENE, "C7H8", "the substrate"),
            Formula(BENZYL_BROMIDE, "C7H7Br", "benzylic bromination product"),
        ),
    ),

    # ------------------------------------------------------------- ORG2 ch 9
    "ORG2.ARYLVINYLIC": Lesson(
        node="ORG2.ARYLVINYLIC",
        objective=(
            "Explain why halides on sp2 carbon resist both SN1 and SN2, and "
            "name what does react."
        ),
        build_on=(
            "You know SN1 and SN2 thoroughly from ORG1, including which "
            "substrates favour each. This node is the case where both fail, "
            "and the reason is the same for both."
        ),
        core_idea=(
            "An aryl halide has the halogen on a ring carbon; a vinylic halide "
            "has it on an alkene carbon. Both carbons are sp2, and that is "
            "fatal to both mechanisms. SN2 requires backside attack directly "
            "opposite the leaving group, and in an aryl halide that trajectory "
            "points into the ring, which is blocked. SN1 requires a "
            "carbocation, and an sp2 cation is far higher in energy than an "
            "sp3 one because the empty orbital cannot delocalise usefully. On "
            "top of that the C-X bond is shorter and stronger than in an alkyl "
            "halide, because sp2 carbon holds its electrons closer. Aryl "
            "halides are therefore unreactive to the substitution chemistry "
            "that dominated ORG1, and need a different mechanism entirely: "
            "nucleophilic aromatic substitution when the ring is strongly "
            "electron poor, benzyne under forcing base, or transition metal "
            "catalysis, which is the next node."
        ),
        worked_example=(
            "Chlorobenzene, C6H5Cl, and vinyl chloride, C2H3Cl, both refuse "
            "hydroxide under conditions that convert 1-chlorobutane cleanly. "
            "Chlorobenzene requires roughly 350 degrees Celsius and high "
            "pressure with sodium hydroxide to give phenol at all, a route "
            "that proceeds through benzyne rather than by substitution at the "
            "original carbon. That last detail matters: the nucleophile does "
            "not necessarily end up where the chlorine was."
        ),
        try_it_prompt=(
            "1-chloro-2,4-dinitrobenzene reacts readily with methoxide at room "
            "temperature. Why, when chlorobenzene does not?"
        ),
        try_it_answer=(
            "The two nitro groups are strongly electron withdrawing and sit "
            "ortho and para to the chlorine, exactly where they can stabilise "
            "the negative charge of the intermediate formed when methoxide "
            "adds. This is nucleophilic aromatic substitution by addition then "
            "elimination, not SN2. The ring must be electron poor for it to "
            "work at all."
        ),
        pitfall=(
            "Treating an aryl halide as a normal leaving group substrate "
            "because it looks like one on paper. Recognising sp2 carbon is the "
            "whole answer, and it is visible before any mechanism is written."
        ),
        claims=(
            Formula(CHLOROBENZENE, "C6H5Cl", "aryl halide"),
            Formula(VINYL_CHLORIDE, "C2H3Cl", "vinylic halide"),
            Source(
                "Conversion of chlorobenzene to phenol with aqueous sodium "
                "hydroxide requires about 350 degrees Celsius and 300 atm, "
                "the historical Dow process.",
                "Carey and Sundberg, Advanced Organic Chemistry Part B, ch 11",
            ),
        ),
    ),

    "ORG2.CROSSCOUPLING": Lesson(
        node="ORG2.CROSSCOUPLING",
        objective=(
            "State the three step catalytic cycle that joins two carbons using "
            "palladium, and what each partner contributes."
        ),
        build_on=(
            "The previous node left aryl halides unreactive to substitution. "
            "This is the chemistry that made them useful anyway, and it is why "
            "modern synthesis looks different from the routes in ORG1."
        ),
        core_idea=(
            "Palladium cross coupling joins an organic halide to an "
            "organometallic partner, forming a carbon carbon bond where "
            "classical substitution could not. The cycle has three steps and "
            "the same three appear in every named variant. Oxidative addition: "
            "palladium(0) inserts into the carbon halogen bond, becoming "
            "palladium(II) and holding both pieces. Transmetalation: the "
            "second carbon group transfers from its metal - boron in Suzuki, "
            "tin in Stille, zinc in Negishi - onto the palladium. Reductive "
            "elimination: the two organic groups, now on the same metal, join "
            "and leave, returning palladium(0) to start again. The Heck "
            "reaction substitutes an alkene for the organometallic partner and "
            "inserts rather than transmetalates, but opens and closes the same "
            "way."
        ),
        worked_example=(
            "Suzuki coupling of chlorobenzene, C6H5Cl, with phenylboronic acid "
            "gives biphenyl, C12H10. Palladium(0) inserts into the C-Cl bond; "
            "base activates the boronic acid so the phenyl transfers to "
            "palladium; the two phenyls reductively eliminate as biphenyl. "
            "Count the carbons: six plus six gives twelve, and the halogen and "
            "the boron both leave. A bond that hot hydroxide could not make at "
            "350 degrees forms here below 100."
        ),
        try_it_prompt=(
            "Which oxidation states does palladium pass through in one turn of "
            "the cycle, and which step regenerates the catalyst?"
        ),
        try_it_answer=(
            "Palladium(0) to palladium(II) on oxidative addition, and back to "
            "palladium(0) on reductive elimination, which is the regenerating "
            "step. Transmetalation happens at palladium(II) and does not "
            "change the oxidation state. That return to Pd(0) is what makes "
            "the metal catalytic rather than stoichiometric."
        ),
        pitfall=(
            "Reading the boron or tin partner as the electrophile. The halide "
            "is the electrophile and the organometallic is the nucleophile; "
            "swapping them makes the retrosynthesis come out backwards."
        ),
        claims=(
            Formula(CHLOROBENZENE, "C6H5Cl", "the electrophilic partner"),
            Formula(BIPHENYL, "C12H10", "the coupled product"),
            Source(
                "The 2010 Nobel Prize in Chemistry was awarded to Heck, "
                "Negishi and Suzuki for palladium catalysed cross couplings.",
                "Nobel Prize in Chemistry 2010, nobelprize.org",
            ),
        ),
    ),
}

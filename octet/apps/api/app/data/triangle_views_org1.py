"""Johnstone triangle views for ORG1: Organic Chemistry I.

Companion to triangle_views.py, which holds the GEN1 and GEN2 views and the
TriangleView dataclass this module imports. The field meanings, the review
status and the honesty conventions are the ones set out there:

  macroscopic  what you would observe, with instruments and numbers where
               honest. Organic mechanism nodes are the hard case, because the
               event itself is never observed. Where that is so, these fields
               say what a chemist actually measures and why the evidence is
               indirect, rather than inventing an observation.
  particulate  what the particles are doing. Where the standard account is a
               teaching simplification, the text says so.
  symbolic     the written representation, in words.
  connector    one sentence naming what is the SAME thing across all three.
  pitfall      the specific level confusion learners fall into at this node.

Numbers. Every measured value quoted here is one already carried by the ORG1
lesson that this view accompanies, with its source attached there: the
cyclohexane ring inversion barrier, the acetic acid pKa, the carbon to carbon
distances across ethane, ethene and ethyne, and the 1H shift ranges from the
correlation chart. Nothing new was introduced. Several corners deliberately
carry a qualitative statement where a number would have had to be invented,
and the SN1, SN2, E2, energy diagram and carbocation views say so in the text
rather than quietly leaving a gap.

Review status. REVIEW below reads "pending" until a named subject matter
expert signs these off. Nothing here may be presented in product as expert
verified while it reads "pending".

This module imports one dataclass and nothing else from the application. It is
data.
"""

from __future__ import annotations

from app.data.triangle_views import TriangleView

REVIEW = "pending"


_VIEWS: list[TriangleView] = [
    # ---------------- ORG1 Unit 1: Structure and Bonding ----------------
    TriangleView(
        node="ORG1.ORBITALS",
        title="One bond that turns, one that cannot",
        macroscopic=(
            "Cis and trans alkenes are separable compounds. You can put them "
            "in two bottles, they have different physical properties, and "
            "warming one gently does not convert it into the other. Alkanes "
            "do not behave that way: nothing separates one rotational form of "
            "ethane from another, however carefully you try. And when an "
            "alkene reacts, the reaction happens at the double bond while the "
            "rest of the carbon and hydrogen framework comes through the "
            "reaction unchanged."
        ),
        particulate=(
            "Two orbitals that overlap combine into two molecular orbitals, "
            "one bonding and lower in energy with density piled between the "
            "nuclei, one antibonding and higher with a node there. Head-on "
            "overlap along the line joining the nuclei gives a sigma bond, "
            "which is cylindrically symmetric about that line, so turning one "
            "end relative to the other leaves the overlap untouched. Sideways "
            "overlap of two parallel p orbitals gives a pi bond, with density "
            "above and below that line and a nodal plane containing it, and "
            "turning about the bond tears that overlap apart. Building "
            "molecular orbitals by adding and subtracting atomic orbitals is "
            "an approximation rather than a claim about the molecule: it is "
            "used because it is tractable and because it gets the count and "
            "the ordering of the levels right, not because the electrons "
            "remember which atom they came from."
        ),
        symbolic=(
            "Every line in a structure is one sigma bond. The second line of "
            "a double bond is a pi bond and the third line of a triple bond "
            "is a second pi bond perpendicular to the first. Degrees of "
            "unsaturation counts rings plus pi bonds, so a formula fixes how "
            "many of those second and third lines the drawing has to carry."
        ),
        connector=(
            "The pi bond is the same object in all three: it is why cis and "
            "trans alkenes sit in separate bottles, it is the sideways "
            "overlap of two parallel p orbitals that rotation would destroy, "
            "and it is the second line in C=C and one unit of the degrees of "
            "unsaturation."
        ),
        pitfall=(
            "The specific confusion is reading the second line of the drawing "
            "as another copy of the first, because notation draws them "
            "identically: two parallel strokes of a pen, so two of the same "
            "thing. The particulate level does not agree. One component is "
            "cylindrically symmetric and the other has a nodal plane, and "
            "they differ in shape, in strength and in what they permit. A "
            "learner holding the two-identical-strokes picture predicts free "
            "rotation about a double bond and so cannot account for separable "
            "cis and trans alkenes, and expects both components to break with "
            "equal difficulty and so cannot account for an alkene reacting at "
            "the double bond while its sigma framework survives."
        ),
        katex=r"\ce{H2C=CH2}:\ 1\,\sigma + 1\,\pi \qquad \ce{HC#CH}:\ 1\,\sigma + 2\,\pi",
        caption=(
            "Picture two carbons joined along the line between them by a "
            "sleeve of electron density that wraps that line all the way "
            "round. Above and below it sits a second, separate cloud in two "
            "lobes, with nothing at all in the plane holding the two nuclei "
            "and the four hydrogens. Turn one carbon against the other and "
            "the sleeve is unaffected while the two lobes pull apart."
        ),
    ),
    TriangleView(
        node="ORG1.HYBRIDORG",
        title="A count on paper that fixes a shape in space",
        macroscopic=(
            "Instruments return lengths and angles. Across ethane, ethene and "
            "ethyne the carbon to carbon distance falls from roughly 154 "
            "picometres to 134 to 120, and the angles at carbon go from near "
            "109.5 degrees to near 120 to 180. Ethane's six hydrogens are all "
            "equivalent and give one 1H NMR signal, and so do ethene's four "
            "and acetone's six methyl hydrogens. No instrument returns a "
            "hybrid orbital."
        ),
        particulate=(
            "A carbon mixes its 2s orbital with as many 2p orbitals as it "
            "needs sigma bonds, and whatever p orbitals are left over stay "
            "unhybridised and are available for pi bonding. Four sigma bonds "
            "gives sp3 and a tetrahedron with nothing left over; three gives "
            "sp2, trigonal planar, with one p orbital standing perpendicular "
            "to the plane; two gives sp, linear, with two. This is "
            "bookkeeping rather than an event. No carbon atom prepares its "
            "orbitals and then bonds. Hybridisation is a way of writing the "
            "same electron distribution in a set of directions that matches "
            "the geometry the molecule has, and it earns its place because "
            "the count of sigma bonds then predicts the shape and the number "
            "of leftover p orbitals at once."
        ),
        symbolic=(
            "sp3, sp2 and sp, where the superscript is how many p orbitals "
            "went into the mix. The count you perform is short: add the atoms "
            "bonded to the carbon and any lone pairs on it, and four means "
            "sp3, three means sp2, two means sp. Bond angle and the number of "
            "available pi bonds follow from the label rather than being "
            "separate facts, and so does s character, one quarter for sp3, "
            "about one third for sp2 and one half for sp."
        ),
        connector=(
            "The number of groups around the carbon is one number in all "
            "three: it is what sets the angle an instrument measures, it is "
            "how many hybrid directions the model has to build, and it is "
            "what you count off a drawing before writing sp3, sp2 or sp."
        ),
        pitfall=(
            "The specific confusion is treating hybridisation as a physical "
            "event at the particulate level that causes the geometry, when it "
            "is symbolic bookkeeping read off the geometry. A learner in that "
            "position asks what makes an atom decide to hybridise and waits "
            "for an answer the model does not owe. The same confusion runs in "
            "the other direction when the label gets read off the appearance "
            "of the page: a ring drawn as a flat polygon is taken for a flat "
            "ring, and a carbon is called sp2 because its neighbours include "
            "an oxygen. Neither the drawing nor the elements decide it. The "
            "count of attached groups decides it."
        ),
        katex=r"\ce{C2H6}:\ \mathrm{sp^3}\quad \ce{C2H4}:\ \mathrm{sp^2}\quad \ce{C2H2}:\ \mathrm{sp}",
        caption=(
            "Picture the same carbon three times over. With four attachments "
            "its bonds point at the corners of a tetrahedron and nothing is "
            "left over. With three they lie flat at about 120 degrees, and "
            "one dumbbell shaped cloud stands above and below that plane. "
            "With two they point in opposite directions along a line, with "
            "two such dumbbells around it at right angles to each other."
        ),
    ),
    TriangleView(
        node="ORG1.RESONANCEORG",
        title="One ion, several drawings",
        macroscopic=(
            "The two carbon to oxygen bonds of the acetate ion measure the "
            "same length, and that length lies between a carbon to oxygen "
            "single bond and a double bond. The six carbon to carbon bonds of "
            "benzene measure the same as each other in the same way, and "
            "benzene's six hydrogens give a single 1H NMR signal. Nobody has "
            "cooled such a sample and caught one contributor on its own, and "
            "the attempt has been made."
        ),
        particulate=(
            "There is one ion with one electron distribution. In acetate the "
            "pi density is spread over the O-C-O unit and half a negative "
            "charge sits on each oxygen at all times. The several drawings "
            "are a repair to Lewis notation rather than a description of "
            "anything happening in time: Lewis notation can put a pair in one "
            "bond or on one atom and has no way to write a pair spread across "
            "three atoms, so chemists write the possibilities down and take "
            "the truth to be a weighted blend of them. The nuclei sit in the "
            "same places in every contributor, and only pi electrons and lone "
            "pairs are redrawn."
        ),
        symbolic=(
            "Two or more Lewis drawings joined by a double headed arrow, "
            "which is a different sign from the double arrow of equilibrium "
            "and makes a different claim. A contributor is legal when the "
            "atoms are the same and in the same positions, the total charge "
            "is unchanged, the number of unpaired electrons is unchanged, and "
            "no second row atom exceeds eight valence electrons. Among the "
            "legal ones, a contributor counts for more when it has more bonds "
            "and more complete octets and separates charge less."
        ),
        connector=(
            "The half negative charge on each oxygen is one thing in all "
            "three: it is why the two carbon to oxygen bonds measure alike, "
            "it is the single electron distribution the ion actually has, and "
            "it is what the pair of equally weighted drawings joined by a "
            "double headed arrow exists to write down."
        ),
        pitfall=(
            "The specific confusion is reading the double headed arrow as "
            "motion in time, so the ion is pictured flickering between its "
            "contributors and spending part of its life as each. That "
            "promotes a symbol into a particulate event. There is one "
            "species, and if the contributors were separate species you could "
            "in principle cool the sample and catch one. The practical cost "
            "is that a flickering picture quietly licenses moving atoms, "
            "because shifting a hydrogen then looks like the same sort of "
            "move as shifting a pi bond. Move a hydrogen and you have drawn a "
            "different compound in a different bottle."
        ),
        katex=r"\ce{CH3CO2^-}:\ \text{bond order } 1.5 \text{ at each carbon to oxygen bond}",
        caption=(
            "Picture the acetate ion as an O-C-O unit over which one cloud of "
            "pi density is spread, heavier at the two ends than in the "
            "middle, with the methyl group hanging off to one side. There is "
            "no instant at which one end holds a double bond and the other "
            "holds a single bond."
        ),
    ),
    TriangleView(
        node="ORG1.FUNCTIONALGROUPS",
        title="Same formula, different bottle",
        macroscopic=(
            "Two bottles both labelled C2H6O. One holds a liquid that mixes "
            "with water in any proportion. The other holds a gas at room "
            "temperature. Two more bottles both labelled C2H4O2: one holds an "
            "acid whose proton a mild base removes, and the other holds a "
            "substance with no acidic hydrogen in it anywhere. The formula "
            "distinguishes none of this and the bench distinguishes all of it."
        ),
        particulate=(
            "Most of a typical organic molecule is unreactive C-C and C-H "
            "sigma bonds, and reactivity concentrates where a heteroatom or a "
            "pi bond breaks that pattern. In ethanol an oxygen at the end of "
            "the chain still carries a hydrogen, and that polarised O-H can "
            "be donated to a hydrogen bond with a neighbour. In dimethyl "
            "ether the same three heavy atoms are rearranged so the oxygen "
            "bridges two carbons, with no O-H to donate. Treating a molecule "
            "as a group bolted onto an inert skeleton is a working "
            "approximation rather than the truth: the skeleton shifts the "
            "group's behaviour, which is why one alcohol is not exactly as "
            "acidic as another. The approximation holds well enough that a "
            "group's chemistry transfers between skeletons, and that is what "
            "makes the subject learnable."
        ),
        symbolic=(
            "A skeletal drawing in which the carbons and their hydrogens go "
            "unwritten while heteroatoms and their hydrogens are always "
            "shown, so the groups are what stands out. OH is an alcohol, an "
            "oxygen bridging two carbons is an ether, C=O with a hydrogen on "
            "the carbonyl carbon is an aldehyde and with carbons on both "
            "sides a ketone, C=O plus OH is a carboxylic acid, and the same "
            "carbonyl with OR or with nitrogen is an ester or an amide. Each "
            "is a connectivity pattern, so it stays the same group whatever "
            "way round it is drawn."
        ),
        connector=(
            "The O-H group is one thing in all three: it is why one C2H6O "
            "isomer pours and mixes with water while the other is a gas, it "
            "is the polarised bond a neighbouring molecule can hydrogen bond "
            "to, and it is the two letters that make CH3CH2OH an alcohol "
            "where CH3OCH3 is an ether."
        ),
        pitfall=(
            "The specific confusion is carrying over from general chemistry "
            "the rule that a formula names a substance. Writing NaCl or H2SO4 "
            "does name one substance, so C2H6O looks like the same kind of "
            "statement and is not: it names a set of isomers that may share "
            "no useful property. The learner still reaching for the formula "
            "first is answering a question the field has stopped asking. The "
            "second half of the same error treats the drawing as a picture "
            "rather than a code, so a carbonyl drawn pointing up goes "
            "unrecognised by someone who first met one pointing down, and an "
            "ester with its carbonyl on the left is missed entirely."
        ),
        katex=r"\ce{C2H6O}:\ \ce{CH3CH2OH}\ \text{(alcohol)}\quad \ce{CH3OCH3}\ \text{(ether)}",
        caption=(
            "Picture the two C2H6O isomers side by side. In one, the oxygen "
            "sits at the end of the chain still holding a hydrogen, which can "
            "reach across and hook onto the oxygen of a neighbouring "
            "molecule. In the other, the same oxygen sits between the two "
            "carbons with no hydrogen of its own, and there is nothing on it "
            "for a neighbour to hook onto."
        ),
    ),
    # ---------------- ORG1 Unit 2: Acids, Bases and Arrows ----------------
    TriangleView(
        node="ORG1.ARROWS",
        title="An arrow that tracks the pair, not the atom",
        macroscopic=(
            "Nothing here is observed. Mix acetic acid with hydroxide and the "
            "acid is consumed: a pH meter moves, and what you can recover is "
            "acetate rather than anything with a broken C-H bond, which "
            "agrees with the O-H being the acidic site at a pKa of 4.76 while "
            "the methyl hydrogens are not. But no instrument has ever "
            "returned a curved arrow. What a chemist can actually measure is "
            "which products form, how fast they form, and where a labelled "
            "atom ends up, and a set of arrows earns its keep by predicting "
            "all three across many reactions rather than by being seen once."
        ),
        particulate=(
            "A pair of electrons leaves a lone pair on the hydroxide oxygen "
            "and becomes a bond to the acidic hydrogen, while the pair that "
            "had been holding that hydrogen collapses back onto the oxygen it "
            "was attached to. The hydrogen itself moves as a bare nucleus "
            "between two electron pairs and carries none of its own. The "
            "arrow is a discrete summary of something continuous: it names a "
            "start point and an end point and says nothing about the path, "
            "the timing, or whether the two pairs move in step. Real steps "
            "are every nucleus and every electron moving at once, and the "
            "notation is chosen because it makes the bookkeeping checkable, "
            "not because it is a film of the event."
        ),
        symbolic=(
            "A full-headed curved arrow moves two electrons and a "
            "single-headed fishhook moves one. The tail sits on an electron "
            "pair that exists in the starting structure, a lone pair or a "
            "bond, and never on an atom, never on a positive charge and never "
            "where the electrons are going. The head lands between two atoms "
            "when a bond forms, or on an atom when the pair becomes a lone "
            "pair. Two checks follow: formal charge balances across the step, "
            "and no second row atom finishes with more than eight electrons."
        ),
        connector=(
            "The lone pair on the hydroxide oxygen is the same pair in all "
            "three: it is why hydroxide is the species in the flask that "
            "takes the proton, it is what ends up as the new O-H bond of "
            "water, and it is where the tail of the first arrow has to be "
            "placed."
        ),
        pitfall=(
            "The specific confusion is drawing the arrow from the hydrogen "
            "toward the base, because the hydrogen is the thing that visibly "
            "changes address and the arrow is read as tracking whatever "
            "moves. That imports an everyday picture of motion into a "
            "notation that tracks electron pairs. The tail then sits where "
            "the electrons are not, and the step becomes uncheckable even "
            "when the products drawn happen to be right. The test takes a "
            "second: look at the tail of each arrow and name the pair it sits "
            "on out loud, as a lone pair on a stated atom or as a stated "
            "bond. If you cannot name it, the arrow is wrong."
        ),
        katex=r"\ce{CH3COOH + OH^- -> CH3COO^- + H2O}",
        caption=(
            "Picture the hydroxide oxygen bringing its lone pairs up to the "
            "acidic hydrogen of acetic acid. One pair reaches out and closes "
            "on that hydrogen. At the same moment the pair that had held the "
            "hydrogen to the acetic acid oxygen falls back onto that oxygen "
            "as a new lone pair. The hydrogen nucleus passes from one pair to "
            "the other with nothing of its own."
        ),
    ),
    # ---------------- ORG1 Unit 3: Conformation ----------------
    TriangleView(
        node="ORG1.CHAIR",
        title="The signal that splits when the sample gets cold",
        macroscopic=(
            "Cyclohexane gives one 1H NMR signal at room temperature, as "
            "though all twelve of its hydrogens were the same. Cool the "
            "sample well below room temperature and that one signal separates "
            "into two. Variable temperature NMR turns that change into a "
            "number: the free energy barrier to ring inversion is on the "
            "order of 45 kJ/mol, near 10.8 kcal/mol, low enough that the flip "
            "is fast at room temperature and high enough that cooling freezes "
            "it out."
        ),
        particulate=(
            "The ring is puckered into a chair, with three carbons slightly "
            "above the mean plane and three slightly below, and each carbon "
            "carries one axial bond parallel to the ring axis and one "
            "equatorial bond around the rim. It inverts to the other chair "
            "through a half-chair transition state and a twist-boat "
            "intermediate, and that inversion exchanges axial and equatorial "
            "at every carbon while moving nothing from one face of the ring "
            "to the other. Saying the molecule sits in one chair and then "
            "jumps to the other is a summary. The ring is in continuous "
            "motion, and a chair names a shallow region it spends most of its "
            "time in rather than a pose it holds."
        ),
        symbolic=(
            "Axial and equatorial are labels for positions in a conformation, "
            "and no formula and no SMILES string distinguishes one chair from "
            "the other, because they are one compound. Cis and trans do "
            "appear in a name, because those are different compounds. The "
            "drawing convention carries the geometry: axial bonds strictly "
            "vertical and alternating up, down, up, down around the ring, "
            "with each equatorial bond tilted the opposite way from its own "
            "carbon's axial bond."
        ),
        connector=(
            "The ring flip is one event in all three: it is what averages "
            "twelve hydrogens into a single signal at room temperature and "
            "stops averaging them when the sample is cold, it is the pucker "
            "inverting so that every axial bond becomes equatorial, and it is "
            "the reason no notation names one chair rather than the other."
        ),
        pitfall=(
            "The specific confusion is that a drawn chair looks like a fixed "
            "object, so a conformation gets treated as a compound and the "
            "learner expects a ring flip to turn a cis compound into a trans "
            "one. It cannot. Axial against equatorial is conformation, "
            "reached by rotation, and the two chairs are one substance that no "
            "separation could resolve. Cis against trans is configuration, "
            "reached only by breaking a bond, and those are two substances "
            "that can be put in two bottles. The single averaged NMR signal "
            "is the macroscopic statement of the same point: at room "
            "temperature the sample does not contain two isolable species."
        ),
        katex="",
        caption=(
            "Picture the six carbons alternating up, down, up, down around "
            "the ring. At each one, a bond runs straight up or straight down "
            "parallel to the ring's axis while the other points outward "
            "around the rim. Now invert the pucker: every carbon that was up "
            "is down, so every straight bond becomes a rim bond and every rim "
            "bond becomes a straight one, and nothing has crossed from the "
            "top face of the ring to the bottom."
        ),
    ),
    # ---------------- ORG1 Unit 4: Stereochemistry ----------------
    TriangleView(
        node="ORG1.CHIRALITY",
        title="Two compounds a balance cannot tell apart",
        macroscopic=(
            "Two enantiomers have the same melting point, the same boiling "
            "point, the same density and the same 1H NMR spectrum in an "
            "ordinary solvent. A balance, a thermometer and a spectrometer "
            "report no difference at all. A polarimeter does: one rotates "
            "plane polarised light in one direction and the other by the same "
            "amount in the opposite direction, and a 50:50 mixture of the two "
            "rotates it not at all. They also behave differently toward "
            "anything else that is itself chiral, which is how they get "
            "separated in the first place."
        ),
        particulate=(
            "A carbon with four single bonds sits at the centre of a "
            "tetrahedron, and when the four things at its corners are all "
            "different, the molecule and its mirror image cannot be laid onto "
            "each other however they are turned. Counting stereocentres is a "
            "shortcut rather than the definition, and it fails on meso "
            "compounds; the definition is whether the mirror image is "
            "superimposable, which is what looking for an internal mirror "
            "plane tests. One further point the drawing hides: the molecule "
            "is vibrating and tumbling the whole time. What is fixed is the "
            "arrangement, and no vibration or rotation changes it without a "
            "bond breaking."
        ),
        symbolic=(
            "Wedges and dashes on a flat page to stand for bonds coming "
            "toward you and going away, and then R or S in front of the name. "
            "Those letters come from ranking the four groups by atomic number "
            "at the first point of difference and reading the rotation with "
            "the lowest priority pointing away, so they are the output of a "
            "procedure applied to the drawing rather than a property read off "
            "an instrument."
        ),
        connector=(
            "The handedness of the arrangement at C2 of butan-2-ol is one "
            "thing in all three: it is what a polarimeter responds to, it is "
            "which of the two non-superimposable arrangements the four groups "
            "occupy in space, and it is the letter R or S that goes in front "
            "of the name."
        ),
        pitfall=(
            "The specific confusion is treating R and S as the physical fact "
            "rather than as labels produced by a ranking rule, which shows up "
            "as the belief that R rotates light one way and S the other. The "
            "letter comes from a priority ordering that can be reshuffled by "
            "changing one substituent, while the direction of rotation comes "
            "from the molecule interacting with light, and the two are not "
            "linked by any rule you can apply on paper. The related error "
            "lives one level down: counting stereocentres on the drawing "
            "instead of testing the molecule for an internal mirror plane, "
            "which gets meso compounds wrong every time."
        ),
        katex="",
        caption=(
            "Picture your two hands held palm to palm. Every finger meets its "
            "partner across the mirror, and no turning of one hand lays it "
            "onto the other. Now replace each hand with a carbon at the "
            "centre of a tetrahedron whose four corners hold an OH, an H, a "
            "methyl and an ethyl, and the same thing is true of them."
        ),
    ),
    # ---------------- ORG1 Unit 5: Reaction Fundamentals ----------------
    TriangleView(
        node="ORG1.ENERGYDIAGRAM",
        title="A curve nobody has plotted directly",
        macroscopic=(
            "No instrument draws this curve. Two ordinary and quite separate "
            "measurements stand behind it. Measure how fast the reaction goes "
            "at several temperatures and you recover the height of the "
            "highest barrier. Measure how far it goes, meaning where it "
            "stops, and you recover the difference in level between "
            "reactants and products. A third kind of evidence supports the "
            "shape in between: whether anything can be detected, trapped or "
            "diverted part way through tells you whether there is a well in "
            "the middle. That the two measurements are independent is "
            "something you can see without any instrument at all, because "
            "diamond turning into graphite is downhill and nobody is watching "
            "it happen."
        ),
        particulate=(
            "A transition state is the arrangement at the instant bonds are "
            "half made and half broken. It is not a substance, it has no "
            "lifetime and it cannot be isolated. An intermediate sits in a "
            "well with all its bonds fully formed and exists for a finite "
            "time, even when that time is very short. Two things about the "
            "picture are simplifications worth naming. The horizontal axis is "
            "neither time nor distance: it is a chosen coordinate summarising "
            "the many bond lengths and angles that change together, so the "
            "curve is a one dimensional slice through a many dimensional "
            "energy surface. And a single line implies a single path, where a "
            "flask full of molecules crosses by a spread of related routes."
        ),
        symbolic=(
            "Energy up the page against reaction progress across it. Every "
            "maximum is a step and every minimum lying between the two ends "
            "is an intermediate, so counting maxima counts steps. A "
            "transition state is written in brackets with a double dagger for "
            "the reason above. The activation energy is measured from the "
            "reactant level up to the highest peak, and the reactant to "
            "product gap is a different number answering a different question."
        ),
        connector=(
            "The height of the highest peak above the reactant level is one "
            "quantity in all three: it is what the change of rate with "
            "temperature reports, it is how much energy a colliding pair has "
            "to muster before the arrangement can get over the top, and it is "
            "the vertical gap the diagram labels as the activation energy."
        ),
        pitfall=(
            "The specific confusion is promoting a point on a drawn curve "
            "into a species in a flask, so a transition state and an "
            "intermediate become the same kind of object at two heights. The "
            "diagnostic is the shape and not the label: a well is a species "
            "and a peak is not, and no amount of care will let you bottle a "
            "peak. The second confusion runs between the two numbers the "
            "diagram shows at once. A large drop from reactants to products "
            "is read as a fast reaction, which merges a thermodynamic "
            "quantity with a kinetic one. A reaction can be strongly downhill "
            "and sit unchanged for years behind a tall barrier."
        ),
        katex=r"k = A\,e^{-E_a/(RT)}",
        caption=(
            "Picture a walker crossing a ridge between two valleys. The "
            "starting valley is the reactants and the far one the products. "
            "The top of the ridge is the transition state: the walker is over "
            "it for no time at all and cannot stand there. If the ridge has a "
            "hollow part way across, the walker can rest in it, and that "
            "hollow is an intermediate. How long the crossing takes is set by "
            "how high the highest point stands above the starting valley, not "
            "by how much lower the far valley lies."
        ),
    ),
    TriangleView(
        node="ORG1.CARBOCATION",
        title="A species you read off what comes out of the flask",
        macroscopic=(
            "An ordinary carbocation is far too short lived to be bottled, so "
            "the evidence is what the flask returns. A tertiary bromide is "
            "converted at a measurable rate in a protic solvent while its "
            "primary isomer of the same formula essentially is not, and "
            "benzyl bromide, primary by every count, reacts readily. The "
            "product can come out with a rearranged carbon skeleton: "
            "2-bromo-3-methylbutane gives mostly 2-methylbutan-2-ol rather "
            "than the 3-methylbutan-2-ol its connectivity would suggest, and "
            "those two alcohols are constitutional isomers you can tell "
            "apart. One direct observation exists: long lived alkyl cations "
            "can be generated and observed in superacid media, where the "
            "tert-butyl cation is planar at the cationic carbon."
        ),
        particulate=(
            "A carbocation is a carbon with three bonds, no lone pair and "
            "therefore six valence electrons. The three bonding pairs push as "
            "far apart as they can, so the carbon is trigonal planar at about "
            "120 degrees with an empty p orbital standing perpendicular to "
            "that plane. Everything about stability is about getting density "
            "into that orbital: alkyl neighbours do it weakly by "
            "hyperconjugation, an adjacent pi system strongly by resonance. "
            "Drawing hyperconjugation as one C-H bond donating into the empty "
            "orbital is a picture that makes the counting work; the fuller "
            "account is that those sigma bonds and the empty orbital form one "
            "set of levels together. And the free, fully separated cation is "
            "an idealisation, since in solution it is wrapped in solvent and "
            "often still close to the group it has lost."
        ),
        symbolic=(
            "A plus sign on a carbon carrying three lines. It states two "
            "things at once: six valence electrons rather than eight, and one "
            "empty p orbital. Methyl, primary, secondary and tertiary count "
            "the carbons attached to the charged centre, which is a proxy for "
            "how much hyperconjugation is available, and the proxy is "
            "overridden whenever an adjacent double bond or ring can "
            "delocalise the charge."
        ),
        connector=(
            "The empty p orbital is one thing in all three: it is why a "
            "tertiary or benzylic substrate is converted while a plain "
            "primary one sits there, it is what neighbouring C-H bonds and "
            "neighbouring pi systems feed density into, and it is what the "
            "plus sign on a three bonded carbon records."
        ),
        pitfall=(
            "The specific confusion is reading the plus sign as a charge "
            "added on top of an otherwise ordinary carbon, rather than as the "
            "record of a missing electron pair. A learner holding the first "
            "reading has no empty orbital anywhere in the particulate "
            "picture, so there is nothing for hyperconjugation or resonance "
            "to fill, and every stability argument at this node turns into a "
            "list to memorise. The related error is counting hydrogens on the "
            "cationic carbon instead of the carbons attached to it, which "
            "does not blur the ordering so much as reverse it."
        ),
        katex=r"\ce{(CH3)3C+}:\ \text{six valence electrons at the cationic carbon}",
        caption=(
            "Picture the cationic carbon lying flat, its three groups splayed "
            "at about 120 degrees in one plane, and an empty dumbbell shaped "
            "orbital standing above and below that plane with nothing in it. "
            "Every neighbouring C-H bond that can line up with the dumbbell "
            "leans its pair toward it, and an adjacent double bond or "
            "aromatic ring spreads its pi density into it outright."
        ),
    ),
    # ---------- ORG1 Unit 9: Substitution and Elimination ----------
    TriangleView(
        node="ORG1.SN2",
        title="A rate that answers when you change the nucleophile",
        macroscopic=(
            "Four observations, none of which shows the mechanism and all of "
            "which constrain it. Change the concentration of the nucleophile "
            "and the rate changes in proportion; change the concentration of "
            "the substrate and it changes in proportion again, so the "
            "reaction is second order overall. Start from a single enantiomer "
            "of substrate and the product sample is optically active on a "
            "polarimeter rather than showing zero rotation. Put a tertiary "
            "bromide and its primary isomer of the same formula under the "
            "same conditions and the primary one is displaced readily while "
            "the tertiary gives no product at any useful rate. Swap a polar "
            "protic solvent for a polar aprotic one and the reaction speeds "
            "up, often by orders of magnitude."
        ),
        particulate=(
            "One step. The nucleophile's lone pair reaches the antibonding "
            "orbital of the carbon to leaving group bond from the face "
            "opposite that bond, which is the only direction of approach that "
            "does not run into the bonding electrons already there, and the "
            "three retained groups fold back past the carbon as the new bond "
            "forms. Nothing is made and then destroyed along the way. The "
            "backside attack cartoon should be read as a cartoon: it draws a "
            "straight line trajectory into the back of the carbon, where in "
            "the flask the two species are tumbling and arrive over a range "
            "of angles. What the cartoon gets right, and what the evidence "
            "supports, is that the geometry which works puts the two groups "
            "on opposite sides and that no intermediate exists between the "
            "two ends. The transition state itself has never been observed."
        ),
        symbolic=(
            "The rate law is first order in substrate and first order in "
            "nucleophile, so both concentrations appear and one rate constant "
            "multiplies them. The transition state is drawn in brackets with "
            "a double dagger, partial bonds as dashed lines to the incoming "
            "and departing groups and the three retained groups flat between "
            "them. Inversion is written by redrawing the wedges and dashes, "
            "and R may or may not become S depending on how the priorities "
            "fall out."
        ),
        connector=(
            "The single step is one fact in all three: it is why the rate "
            "answers to both concentrations at once, it is why there is no "
            "intermediate in which the substrate could lose its arrangement, "
            "and it is why one rate constant with two concentrations beside "
            "it is the whole rate law."
        ),
        pitfall=(
            "The specific confusion is reading inversion of configuration, "
            "which is a statement about where the atoms are, off the CIP "
            "letter, which is a statement about how you chose to rank them. "
            "In the standard examples the letter does flip, so the belief "
            "gets reinforced. Then take (S)-ethyl 2-bromopropanoate and "
            "displace the bromide with cyanide: the geometry inverts as it "
            "always does, and the product is still (S), because the nitrile "
            "carbon reads as three nitrogens while the ester carbon reads as "
            "three oxygens, so the incoming group arrives at rank 2 where the "
            "leaving group held rank 1. One transposition of labels reverses "
            "the reading and the inversion reverses it again."
        ),
        katex=r"\text{rate} = k[\ce{RX}][\ce{Nu^-}]",
        caption=(
            "Picture the carbon with three groups fanned around it and the "
            "leaving group on one side. The nucleophile comes in on the far "
            "side, and as its bond begins to form the three groups swing back "
            "past the carbon like an umbrella turning inside out in wind. "
            "Halfway through they lie flat in one plane with a partial bond "
            "ahead and a partial bond behind, and then the leaving group is "
            "gone and the umbrella has finished turning."
        ),
    ),
    TriangleView(
        node="ORG1.SN1",
        title="A rate that ignores the nucleophile",
        macroscopic=(
            "Change the concentration of the nucleophile and the rate does "
            "not move, while changing the substrate concentration changes it "
            "in proportion: first order in substrate, zero order in "
            "nucleophile. Start from a single enantiomer of substrate and the "
            "product sample reads zero rotation on a polarimeter. Run the "
            "same substrate in solvents of increasing ionizing power and it "
            "goes faster, which is the opposite of the solvent preference "
            "that speeds up the bimolecular route. And the product can arrive "
            "with a carbon skeleton that is not the skeleton you started "
            "with, as a constitutional isomer of the expected alcohol."
        ),
        particulate=(
            "Two steps with an intermediate between them. The carbon to "
            "halogen bond breaks on its own, with the solvent assisting, "
            "giving a carbocation and a halide, and that step is slow and "
            "sets the rate with the nucleophile taking no part in it. Then "
            "the nucleophile bonds to the cation, which is fast. The cation "
            "is trigonal planar with an empty p orbital perpendicular to its "
            "three substituents, so the nucleophile can arrive into either "
            "lobe. The clean picture of a free cation fully surrounded by "
            "solvent is an idealisation: real ionizations pass through ion "
            "pairs in which the halide has not diffused away and partly "
            "shields the face it left, which is why real products often show "
            "a small excess of the inverted one rather than an exact even "
            "split."
        ),
        symbolic=(
            "The rate law contains the substrate concentration and one rate "
            "constant, and the nucleophile does not appear in it at all. That "
            "absence is the content of the notation rather than an omission. "
            "The mechanism is written as two arrow-pushing steps with the "
            "carbocation written out in between as a species in its own "
            "right, because it is one."
        ),
        connector=(
            "The rate determining ionization is one event in all three: it is "
            "why adding more nucleophile leaves the rate alone, it is the "
            "carbon to halogen bond breaking before anything arrives, and it "
            "is why the nucleophile is missing from the rate law."
        ),
        pitfall=(
            "The specific confusion is reading racemization, which is a "
            "statement about the sample the polarimeter measures, as a "
            "statement about the molecule, so the learner concludes the "
            "product is achiral or that the stereocentre has been lost. Every "
            "molecule in that flask is chiral and every one has a "
            "stereocentre. What is true of the sample is that it holds equal "
            "numbers of two enantiomers whose rotations cancel, and a "
            "polarimeter can report only the sum. The second half of the same "
            "confusion expects an exact fifty fifty split every time, which "
            "the ion pair account says is a limit rather than a rule."
        ),
        katex=r"\text{rate} = k[\ce{RX}]",
        caption=(
            "Picture the halide letting go first, with nothing else nearby, "
            "leaving a flat carbon whose three groups splay at about 120 "
            "degrees and an empty orbital standing above and below that "
            "plane. Solvent closes around both ions. Then a water molecule "
            "arrives, and there is nothing to make the top of the plane "
            "different from the bottom, so it arrives above about as often as "
            "it arrives below."
        ),
    ),
    TriangleView(
        node="ORG1.E2",
        title="Two substrates, one base, two different alkenes",
        macroscopic=(
            "Change the base concentration and the rate changes in "
            "proportion, and the same holds for the substrate, so the "
            "reaction is second order overall. The sharper observation is "
            "stereochemical and needs no kinetics at all. Take two "
            "diastereomeric bromides, put them through the same base under "
            "the same conditions, and they give two different alkenes: one "
            "returns the E isomer and the other the Z isomer, and those are "
            "separable substances with different properties. Take instead two "
            "enantiomeric bromides and they give the same alkene, because the "
            "product is achiral and cannot record which one it came from."
        ),
        particulate=(
            "One step. The base takes a hydrogen from the carbon next to the "
            "one bearing the leaving group, the electrons of that C-H bond "
            "swing over to become the pi bond, and the leaving group departs, "
            "all at once. For the electrons to move that way the C-H bond and "
            "the carbon to leaving group bond have to lie in one plane, and "
            "the anti arrangement at 180 degrees is strongly preferred over "
            "syn at 0, because anti is staggered rather than eclipsed and "
            "keeps the base and the leaving group out of each other's way. "
            "Only one conformation reacts, but the molecule is not stuck in "
            "it: rotation about that bond is fast and the reacting "
            "conformation is one the molecule visits often. Drawing it alone "
            "is a summary of a population rather than a claim that the "
            "molecule sits still, and as with any one step reaction the "
            "transition state is not observed."
        ),
        symbolic=(
            "The rate law carries both the substrate and the base. The "
            "geometry is written as a Newman projection sighted along the "
            "bond that is about to become the double bond, with the beta "
            "hydrogen at one end and the leaving group at the other, 180 "
            "degrees apart. The alkene is then labelled E or Z from CIP "
            "priorities rather than from what the drawing looks like, so two "
            "methyl groups ending up on the same side can read out as E."
        ),
        connector=(
            "The one reacting conformation is the same thing in all three: it "
            "is why two diastereomers of substrate give two different, "
            "separable alkenes under identical conditions, it is the "
            "anti-periplanar arrangement of the beta hydrogen and the leaving "
            "group in the particle that reacts, and it is what a Newman "
            "projection along that bond puts on the page."
        ),
        pitfall=(
            "The specific confusion is reading a flat structure as a picture "
            "of the arrangement in space, so the learner picks whichever beta "
            "hydrogen looks convenient on the page and draws whichever alkene "
            "is easier to draw. The belief underneath is that the reaction "
            "chooses its product. What it chooses is a conformation, and the "
            "product follows from that with no further freedom, so the "
            "rotation has to be done on paper before anything is written "
            "down. The related error treats stereospecific and stereoselective "
            "as synonyms: selective means one product is preferred from one "
            "starting material, specific means each stereoisomer of starting "
            "material is channelled to its own product, and E2 is the second."
        ),
        katex=r"\text{rate} = k[\ce{RX}][\ce{B^-}]",
        caption=(
            "Picture sighting straight down the bond between the carbon "
            "carrying the leaving group and the carbon next to it. Turn the "
            "back carbon until its hydrogen sits directly opposite the "
            "leaving group, one pointing up at the front and the other down "
            "at the back. Whatever the remaining four groups are doing at "
            "that moment is what they will still be doing when the two "
            "carbons flatten and the double bond appears between them."
        ),
    ),
    # ---------------- ORG1 Unit 10: Spectroscopy ----------------
    TriangleView(
        node="ORG1.NMRTHEORY",
        title="Position on a chart, electron density around a nucleus",
        macroscopic=(
            "Put a sample in the magnet and the chart comes back with peaks "
            "at particular positions. Toluene gives two clusters: three "
            "hydrogens at the small shift end and five at the large shift "
            "end, in a 3 to 5 relationship, with the five resolving into "
            "2:2:1 on an instrument that can separate them. Correlation "
            "charts put alkyl hydrogens at about 0.8 to 1.8 ppm and aromatic "
            "hydrogens at about 6.5 to 8.5 ppm. The same compound returns the "
            "same ppm values on a stronger or a weaker instrument, which is "
            "the whole reason the scale is defined the way it is."
        ),
        particulate=(
            "A hydrogen nucleus in a magnetic field has two spin states whose "
            "energy separation is proportional to the field the nucleus "
            "actually experiences, which is not the field the instrument "
            "supplies. Electrons near the nucleus respond to the applied "
            "field and set up a small field opposing it, so the nucleus "
            "feels a little less. That is shielding. Pull density away, with "
            "an electronegative atom a bond or two off, and the nucleus feels "
            "more. An aromatic ring does something further: its pi electrons "
            "produce a field that reinforces the applied one at positions "
            "outside the ring. Describing those electrons as circulating and "
            "throwing off a field of their own is a classical stand-in for a "
            "quantum calculation. It gets the direction and roughly the size "
            "right for these cases and is not a picture of electrons running "
            "in loops."
        ),
        symbolic=(
            "The chemical shift is the difference between the resonance "
            "frequency of the nucleus and that of a reference, divided by the "
            "operating frequency, which makes it a ratio and so a number in "
            "parts per million that does not depend on the instrument. "
            "Tetramethylsilane is the conventional reference and is assigned "
            "zero. More shielding means a smaller shift, which is the "
            "upfield end of the chart."
        ),
        connector=(
            "The electron density around one hydrogen is one thing in all "
            "three: it is what fixes where that hydrogen's peak lands on the "
            "chart, it is what shields the nucleus from part of the applied "
            "field, and it is what the ppm value on the shift scale reports."
        ),
        pitfall=(
            "The specific confusion is reading a position on the chart, which "
            "is an instrument reading, as a statement about how the molecule "
            "behaves. A hydrogen far downfield gets called more acidic or "
            "more reactive, and neither follows. Aromatic hydrogens are "
            "strongly deshielded and are not acidic at all. The chart "
            "position reports local electron density and the field of a "
            "nearby pi system, and nothing else. The second confusion is "
            "reversing upfield and downfield, which happens because the words "
            "come from an older experiment in which the field was swept "
            "rather than the frequency. Anchor them on shielding: more "
            "shielded means smaller shift means upfield, and the reference at "
            "zero is the most shielded thing on the chart."
        ),
        katex=r"\delta = \frac{\nu_{\text{sample}} - \nu_{\text{ref}}}{\nu_0} \times 10^6\ \text{ppm}",
        caption=(
            "Picture one hydrogen nucleus inside the instrument's field with "
            "a cloud of electrons around it. The cloud responds to that field "
            "and throws off a small field of its own pointing the other way, "
            "so the nucleus feels a little less than the instrument supplies. "
            "Thin the cloud by putting an electronegative atom a bond or two "
            "away and the nucleus feels more, and the peak shifts along the "
            "chart."
        ),
    ),
]


TRIANGLE_VIEWS_ORG1: dict[str, TriangleView] = {v.node: v for v in _VIEWS}


def covered_nodes() -> list[str]:
    """ORG1 node codes that have a triangle view, in curriculum order."""
    return [v.node for v in _VIEWS]

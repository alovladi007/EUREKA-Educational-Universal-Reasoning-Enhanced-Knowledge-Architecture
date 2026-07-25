"""Johnstone triangle views for the ORG2 nodes marked triangle_eligible.

Same contract as triangle_views.py, whose TriangleView dataclass this module
imports rather than redefining: one concept held still and stated at all three
of Johnstone's levels, with a connector naming the single thing that is
identical across them and a pitfall naming the level confusion learners fall
into at that node.

Two conventions are worth restating because this unit set strains them.

Every measured value below is one the ORG2 lesson files already state and cite.
No ultraviolet lambda max in nm, no specific rotation, no melting point and no
alpha carbon pKa appears here, because those are quantities the lessons
deliberately carry as a Source or omit, and a triangle view is not the place to
smuggle one back in. Where a direction is teachable and a magnitude is not, the
direction is stated and the magnitude is left out.

The particulate corner of an organic node is where teaching simplifications
concentrate: resonance contributors drawn as though they were species, the
Diels-Alder arrow circle, the partial positive on a carbonyl carbon, the flat
Haworth ring, the bracketed repeat unit with its single n. Each of those is
named as a model where it appears rather than asserted as an observation.

Review status. REVIEW in triangle_views.py reads "pending" and covers this file
too. Nothing here may be presented in product as expert verified until a named
subject matter expert signs it off.

This module imports nothing from the rest of the application except the
dataclass. It is data.
"""

from __future__ import annotations

from app.data.triangle_views import TriangleView

_VIEWS: list[TriangleView] = [
    # ---------------- Unit 1: conjugation and the Diels-Alder ----------------
    TriangleView(
        node="ORG2.CONJUGATION",
        title="Two double bonds that share, and two that do not",
        macroscopic=(
            "Penta-1,3-diene and penta-1,4-diene are both C5H8, so combustion "
            "analysis returns the same answer for each and cannot separate "
            "them. Two measurements can. Hydrogenate both double bonds of each "
            "and the conjugated 1,3-isomer gives out less heat than the "
            "isolated 1,4-isomer; for buta-1,3-diene that shortfall is of the "
            "order of 15 kJ/mol. Put each in an ultraviolet spectrometer and "
            "the conjugated isomer absorbs at a longer wavelength than the "
            "isolated one."
        ),
        particulate=(
            "The single bond between two double bonds is not a gap. Each of "
            "the four carbons carries a p orbital standing perpendicular to "
            "the plane of the molecule, and those four overlap end to end into "
            "one continuous system, so the four pi electrons are spread across "
            "all four carbons rather than trapped two by two. Put an sp3 CH2 "
            "in the middle, as penta-1,4-diene does, and that carbon has no p "
            "orbital to continue the overlap, so the two alkenes are separate. "
            "The drawing of double, single, double is a bookkeeping device and "
            "not a picture of the real bonding: the central bond of a "
            "conjugated diene is shorter than an ordinary single bond, and the "
            "real molecule holds one delocalised pi system rather than the two "
            "isolated ones the drawing shows."
        ),
        symbolic=(
            "CH2=CH-CH=CH2 against CH2=CH-CH2-CH=CH2. The pattern to read is "
            "double, single, double, and what sits between the double bonds is "
            "the whole of it. The molecular formula is silent here: both "
            "pentadienes are C5H8 with two degrees of unsaturation, so the "
            "formula distinguishes nothing and the constitution decides "
            "everything. The s-cis and s-trans labels are rotations about that "
            "central single bond, not configurations, so they carry no "
            "descriptor."
        ),
        connector=(
            "The delocalisation of the four pi electrons is one thing seen "
            "three ways: it is the heat missing from the calorimeter and the "
            "shift of the absorption to longer wavelength, it is the "
            "continuous overlap of four p orbitals in the particulate picture, "
            "and it is what the double, single, double pattern on the page "
            "announces."
        ),
        pitfall=(
            "The specific confusion is counting double bonds in the formula "
            "and calling any diene conjugated, which reads a particulate "
            "condition off a symbolic count. Conjugation is not about how many "
            "double bonds there are but about what sits between them, and no "
            "formula shows that: C5H8 covers both pentadienes, and only one of "
            "them has electrons spread over four carbons. The second half of "
            "the same error is treating s-cis and s-trans as two substances "
            "you could put in two bottles. They are rotations about one bond "
            "in one compound, interconverting without anything breaking, and "
            "no separation could ever hand you a bottle of either."
        ),
        katex=r"\ce{CH2=CH-CH=CH2}\ \text{(conjugated)}\qquad \ce{CH2=CH-CH2-CH=CH2}\ \text{(isolated)}",
        caption=(
            "Picture four carbons in a row, each with a dumbbell shaped p "
            "orbital standing above and below the plane, all four parallel and "
            "touching their neighbours, so the electron density runs the whole "
            "length like one long cloud. Now slot an sp3 carbon into the "
            "middle: it has no dumbbell, and the cloud stops dead on each side "
            "of it."
        ),
    ),
    TriangleView(
        node="ORG2.DIELSALDER",
        title="The geometry of the starting alkene, read out of the product",
        macroscopic=(
            "Run the same diene twice, changing one thing: the cis diester in "
            "one flask and the trans diester in the other. Both runs deliver an "
            "adduct of formula C10H14O4, so combustion analysis and the mass "
            "cannot tell the two runs apart. Everything else can. The two "
            "products are different substances with different melting points "
            "and different proton spectra, and they separate from one another. "
            "In both runs the diene's ultraviolet absorption is lost as it is "
            "consumed, because the conjugated system it had does not survive "
            "into the adduct."
        ),
        particulate=(
            "The four pi electrons of the diene and the two of the dienophile "
            "reorganise together, and two new carbon to carbon sigma bonds "
            "form in the same step, so there is no intermediate to trap and no "
            "moment at which one end is bonded and the other is not. That is "
            "why the geometry present in the dienophile is carried into the "
            "ring: neither end gets a chance to rotate. The circle of curly "
            "arrows drawn round the six-membered transition state is a "
            "bookkeeping device for one continuous reorganisation of electron "
            "density. It does not mean the bonds form in the order the circle "
            "is drawn, and drawing the circle the other way round names the "
            "same event."
        ),
        symbolic=(
            "C4H6 + C2H4 gives C6H10, one ring and one retained double bond. "
            "The stereochemistry is written as descriptors on the product: the "
            "adduct from the cis diester reads (R,S) and is a meso compound, "
            "one achiral substance, while the adduct from the trans diester is "
            "the (R,R) and (S,S) pair of enantiomers."
        ),
        connector=(
            "The relative arrangement of the two ester groups is one fact in "
            "all three: it is what makes the two runs give substances with "
            "different melting points, it is the geometry the concerted step "
            "cannot scramble, and it is what the descriptors (R,S) against "
            "(R,R) and (S,S) record."
        ),
        pitfall=(
            "The specific confusion is promoting a symbolic count into a "
            "macroscopic prediction: two stereocentres on the page reads as "
            "two bottles of enantiomers, so the cis adduct gets written as an "
            "enantiomeric pair like the trans one. The bench says otherwise. "
            "The cis adduct has an internal mirror plane, so it is one achiral "
            "compound with one melting point, and there is no second substance "
            "to isolate. Count stereocentres to bound the possibilities on "
            "paper, then look for the mirror plane before you claim anything "
            "about what is in the flask."
        ),
        katex=r"\ce{C4H6 + C2H4 -> C6H10}",
        caption=(
            "Picture the diene lying with both its ends curled toward the same "
            "side, and the dienophile floating parallel beneath it like a rung "
            "under a horseshoe. As they close, both gaps shut at once and the "
            "two groups on the dienophile keep the sides they started on, "
            "because nothing ever swings free."
        ),
    ),
    # ---------------- Unit 2 and 3: benzene and its substitution ----------------
    TriangleView(
        node="ORG2.BENZENE",
        title="Three drawn double bonds that will not behave like double bonds",
        macroscopic=(
            "Shake cyclohexene with bromine water and the colour goes fast. "
            "Shake benzene, which is drawn with three double bonds, with the "
            "same bromine water under the same mild conditions and the colour "
            "stands. The calorimeter says the same thing in numbers: "
            "hydrogenating the one double bond of cyclohexene releases about "
            "120 kJ/mol, so three separate double bonds would predict near 360 "
            "kJ/mol, and the measured value for benzene is about 208 kJ/mol. "
            "Benzene starts roughly 150 kJ/mol lower than the drawing predicts."
        ),
        particulate=(
            "All six carbons are in one plane, each carrying a p orbital, and "
            "the overlap runs the whole way round the ring with no beginning "
            "and no end, so six pi electrons belong to the ring rather than to "
            "three bonds. Every carbon to carbon bond in the ring is the same "
            "length, between a single and a double bond, and all six hydrogens "
            "are one environment. The two Kekule drawings with their "
            "alternating long and short bonds are not two structures the "
            "molecule flips between, and the molecule does not spend half its "
            "time in each. They are two pictures of one delocalised structure, "
            "which is why the measured bond lengths are all equal rather than "
            "averaging out over time."
        ),
        symbolic=(
            "C6H6, four degrees of unsaturation, drawn either as a hexagon "
            "with three double bonds or as a hexagon with a circle inside. The "
            "three drawn double bonds are a bookkeeping device for six "
            "delocalised electrons, and the circle is the notation that "
            "refuses to place them. The gap between the measured heat of "
            "hydrogenation and three times the cyclohexene value is written as "
            "the delocalization or resonance energy."
        ),
        connector=(
            "The delocalization energy is one quantity in all three: it is the "
            "roughly 150 kJ/mol of heat that never appears in the calorimeter "
            "and the reason the bromine water stays coloured, it is what the "
            "ring-wide overlap of six p orbitals buys, and it is what the "
            "circle in the symbol stands for."
        ),
        pitfall=(
            "The specific confusion is reading three double bonds off the "
            "drawing and predicting alkene behaviour at the bench, which lets "
            "a bookkeeping symbol dictate a macroscopic expectation. A learner "
            "holding that picture predicts alternating bond lengths, predicts "
            "that bromine water will decolourise, and is surprised by every "
            "reaction in the chapter. The structural evidence against it is "
            "that all six ring bonds are equal and all six hydrogens are one "
            "environment, which no static triene can show, and the energetic "
            "evidence is the heat of hydrogenation deficit."
        ),
        katex=r"\ce{C6H6 + 3H2 -> C6H12}\quad \Delta H \approx -208\ \mathrm{kJ/mol}",
        caption=(
            "Picture a flat hexagon of carbons with a doughnut of electron "
            "density lying above the ring and a matching one below, both "
            "unbroken all the way round. There is no place on the rim where "
            "the density thickens into a double bond and no place where it "
            "thins into a single one."
        ),
    ),
    TriangleView(
        node="ORG2.EASMECH",
        title="A ring that is broken and handed back",
        macroscopic=(
            "Two observations settle what happened. First the composition of "
            "what you recover: after an electrophilic substitution the "
            "isolated product carries one new group per ring and one hydrogen "
            "fewer, analysing as C6H5E, where an addition across two carbons "
            "would have given C6H6E2 and a heavier mass. Second, an acid is "
            "released, so a damp indicator held over the flask turns. Then "
            "test the recovered product the way you would test an alkene: it "
            "leaves bromine water coloured, exactly as benzene did. Whatever "
            "the ring passed through, it is aromatic again at the end."
        ),
        particulate=(
            "The electrophile bonds to one ring carbon, which goes tetrahedral "
            "and drops out of the pi system, leaving four electrons shared "
            "over the remaining five carbons in an arenium ion. That ion is "
            "not aromatic, so it is high in energy and short-lived, and it "
            "recovers by throwing off the proton from the carbon that was "
            "attacked, whose carbon to hydrogen bonding electrons drop back "
            "into the ring. The three or four resonance structures usually "
            "drawn for the arenium ion, each parking the plus sign on a "
            "different carbon, are not species in equilibrium and the ion does "
            "not take turns being each of them. They are pictures of one ion "
            "whose positive charge sits over five carbons at once."
        ),
        symbolic=(
            "Benzene plus an electrophile gives the arenium ion, which loses a "
            "proton to give the substituted ring: C6H6 plus E+ to [C6H6E]+ to "
            "C6H5E plus H+. Both benzene and the product carry four degrees of "
            "unsaturation, and that unchanged count is the notation stating "
            "that the ring survived. A substituent with a pi bond of its own, "
            "such as nitro, raises the molecular total without touching the "
            "ring's four."
        ),
        connector=(
            "The aromatic sextet is the same six electrons throughout: it is "
            "what the recovered product's refusal to decolourise bromine water "
            "reports, it is the closed loop the arenium ion has lost and gets "
            "back when the proton leaves, and it is what the unchanged four "
            "degrees of unsaturation in C6H5E state."
        ),
        pitfall=(
            "The specific confusion is treating the arenium ion, an "
            "intermediate that exists on the page, as though it were something "
            "you could isolate and weigh. The symbolic level draws a cation "
            "with a plus sign on it, which looks like a finished species, so "
            "the learner either stops the mechanism there or hangs a "
            "nucleophile on it and predicts a saturated addition product. No "
            "such product turns up on the bench, and the composition of what "
            "does turn up, one group per ring and one hydrogen fewer, is the "
            "measurement that rules it out. The reaction is not over until "
            "aromaticity is back."
        ),
        katex=r"\ce{C6H6 + E+ -> [C6H6E]+ -> C6H5E + H+}",
        caption=(
            "Picture the unbroken doughnut of electron density above and below "
            "the ring. The electrophile lands on one carbon, that carbon "
            "pulls up out of the plane, and the doughnut breaks into an arc "
            "spread over the five carbons that remain. The proton then drops "
            "off the raised carbon, it falls back into the plane, and the arc "
            "closes into a doughnut again."
        ),
    ),
    # ---------------- Unit 4: epoxides ----------------
    TriangleView(
        node="ORG2.EPOXIDE",
        title="One epoxide, one nucleophile, two products",
        macroscopic=(
            "Take one epoxide and one nucleophile and run them under acidic "
            "conditions in one flask and basic conditions in the other. "
            "Combustion analysis of both products returns the same formula, "
            "C5H12O2 for the methanol opening of 2,2-dimethyloxirane, and the "
            "mass spectrometer returns the same mass. Chromatography still "
            "shows two different substances, and their proton spectra differ. "
            "The same split shows in the diol from cyclohexene oxide: the "
            "trans and cis 1,2-cyclohexanediols are separate substances with "
            "different melting points, and anti opening delivers one of them "
            "and not the other."
        ),
        particulate=(
            "The three-membered ring is strained, and the nucleophile relieves "
            "that strain by attacking a ring carbon from the face opposite the "
            "carbon to oxygen bond, so that carbon inverts and the two new "
            "groups end up on opposite faces. Which carbon it attacks is a "
            "separate question from how it attacks. Under basic conditions a "
            "strong nucleophile goes to the less hindered carbon. Under acidic "
            "conditions the ring oxygen is protonated first and positive "
            "charge builds on the more substituted carbon, which draws the "
            "nucleophile there instead. Describing that acidic case as a "
            "carbocation at the more substituted carbon is a model: the bond "
            "to oxygen is not fully broken before the nucleophile arrives, and "
            "the transition state sits between a clean backside displacement "
            "and a free cation, which is why the regiochemistry flips while "
            "the inversion does not."
        ),
        symbolic=(
            "C4H8O plus CH4O gives C5H12O2 either way, and the two answers are "
            "constitutional isomers: 1-methoxy-2-methylpropan-2-ol from the "
            "basic opening and 2-methoxy-2-methylpropan-1-ol from the acidic "
            "one. The stereochemical outcome is written as descriptors: the "
            "trans diol from cyclohexene oxide is the (R,R) and (S,S) pair, "
            "and the cis diol is the single (R,S) meso compound."
        ),
        connector=(
            "Which of the two ring carbons the nucleophile bonded to is one "
            "fact in all three: it is what separates the two spots on the "
            "chromatogram, it is where the incoming group sits in the "
            "particulate picture, and it is the difference between the two "
            "names and the two locants on the page."
        ),
        pitfall=(
            "The specific confusion is reading the word trans off a drawing "
            "and treating it as the identity of a substance. Trans names a "
            "relationship between two groups in one picture; whether the "
            "bottle holds one achiral compound or a fifty-fifty pair of "
            "enantiomers is a symmetry question about the whole molecule, and "
            "for cyclohexene oxide the answer runs opposite to the guess. The "
            "trans diol is the chiral pair, formed as a racemate, and the cis "
            "diol is the single meso compound. The related slip fixes "
            "regiochemistry once and applies it to both conditions, when acid "
            "and base attack opposite carbons and the products are two "
            "substances the formula cannot separate."
        ),
        katex=r"\ce{C4H8O + CH4O -> C5H12O2}",
        caption=(
            "Picture a triangle of two carbons and an oxygen, the bond angles "
            "squeezed far below what carbon wants. The nucleophile comes in on "
            "the far side of one carbon, directly opposite the oxygen, and as "
            "the new bond forms the three other groups on that carbon sweep "
            "backward like an umbrella in the wind while the oxygen swings "
            "away on the other carbon."
        ),
    ),
    # ---------------- Unit 5: aldehydes and ketones ----------------
    TriangleView(
        node="ORG2.CARBONYLSTRUCTURE",
        title="A formula that names three substances",
        macroscopic=(
            "Put a carbonyl compound in an infrared spectrometer and a strong "
            "band appears near 1700 cm-1 that a comparable alcohol or alkane "
            "does not show. Now take two bottles that combustion analysis "
            "cannot separate: propanal and propanone are both C3H6O. Their "
            "proton spectra separate them at a glance. Propanone gives one "
            "signal. Propanal gives three, in the ratio 3:2:1, and one of "
            "those three sits far downfield of the rest."
        ),
        particulate=(
            "A carbonyl is a carbon doubly bonded to an oxygen. The carbon is "
            "sp2 and trigonal planar with bond angles near 120 degrees, and "
            "the pi bond is pulled hard toward the oxygen because oxygen is "
            "far more electronegative than carbon. Saying that the carbonyl "
            "carbon is partially positive is a model, not a measurement: there "
            "is no fraction of an electron parked on it that an instrument "
            "counts. The delta plus and delta minus symbols record the "
            "direction in which the electron density is uneven, and the useful "
            "consequence is chemical rather than numerical, that an electron "
            "rich reagent goes to the carbon and a proton or a metal goes to "
            "the oxygen."
        ),
        symbolic=(
            "CH3CH2CHO against CH3COCH3. The suffix -al puts the carbonyl at "
            "the end of a chain with a hydrogen on it, and the suffix -one "
            "puts it between two carbons and needs a locant. Both are C3H6O "
            "with one degree of unsaturation, so the formula fixes the atom "
            "count and the number of rings plus pi bonds and fixes nothing "
            "else."
        ),
        connector=(
            "The polarised carbon to oxygen double bond is one object in all "
            "three: it is what puts the strong band near 1700 cm-1 into the "
            "infrared spectrum, it is the trigonal sp2 carbon with its "
            "electron density pulled toward oxygen, and it is what both the "
            "-al and the -one suffix name."
        ),
        pitfall=(
            "The specific confusion is treating the molecular formula as an "
            "identity, which promotes a symbolic atom count into a macroscopic "
            "substance. C3H6O names propanal, propanone and prop-2-en-1-ol "
            "among others, all with one degree of unsaturation, and those are "
            "three different bottles with three different spectra. The formula "
            "counts atoms; the constitution says which atom is bonded to "
            "which; and only the constitution corresponds one to one with a "
            "substance on the shelf."
        ),
        katex=r"\ce{CH3CH2CHO}\quad \ce{CH3COCH3}\quad \text{both } \ce{C3H6O}",
        caption=(
            "Picture the carbonyl carbon at the centre of a flat three-spoked "
            "wheel, its three bonds splayed at about 120 degrees in one plane, "
            "with the pi cloud above and below the carbon to oxygen axis "
            "bunched toward the oxygen end and thin over the carbon."
        ),
    ),
    TriangleView(
        node="ORG2.NUCADDITION",
        title="Nothing leaves, so nothing is subtracted",
        macroscopic=(
            "Combine a carbonyl compound with water or with hydrogen cyanide "
            "and weigh what you isolate. The product's mass is the sum of the "
            "two starting masses: nothing bubbles out of the flask and no "
            "water collects anywhere. The infrared says the same thing from "
            "the other side, because the strong carbonyl band near 1700 cm-1 "
            "is gone from the product and a broad O-H band has taken its "
            "place. Under matched conditions an aldehyde reaches that state "
            "faster than a comparable ketone, an ordering the lessons carry "
            "from a textbook rather than derive."
        ),
        particulate=(
            "The nucleophile comes at the electron-poor carbon from above or "
            "below the plane of the three bonds, and as the new bond forms the "
            "pi electrons move onto the oxygen. The carbon goes from trigonal "
            "with three bonds to tetrahedral with four, and the oxygen, now an "
            "alkoxide, takes a proton. Describing this as attack first and "
            "protonation second is a teaching order rather than a stopwatch "
            "reading: proton transfers in a protic medium are fast, they can "
            "accompany the addition rather than follow it, and the tetrahedral "
            "alkoxide is usually too short-lived to be caught as a separate "
            "species. What survives the simplification is the geometry change "
            "and the fact that no fragment is expelled."
        ),
        symbolic=(
            "C2H4O plus H2O gives C2H6O2, the hydrate. C2H4O plus CHN gives "
            "C3H5NO, the cyanohydrin. Both product formulas are the exact sum "
            "of the two reactant formulas, and that exactness is the notation "
            "that distinguishes an addition from a condensation."
        ),
        connector=(
            "The carbonyl pi bond is one thing in all three: it is the band "
            "near 1700 cm-1 that vanishes from the spectrum, it is the pair of "
            "electrons that moves onto oxygen as the carbon goes tetrahedral, "
            "and it is the one degree of unsaturation that disappears from the "
            "product formula."
        ),
        pitfall=(
            "The specific confusion is importing the arithmetic of a "
            "condensation into an addition, so a water that never left gets "
            "subtracted on the page. That is a symbolic habit, the sense that "
            "carbonyl reactions lose water, and two other levels contradict "
            "it: the balance says the product weighs the exact sum of the two "
            "reactants, and the particulate event expels no fragment at all, "
            "because one pi bond became two sigma bonds and every atom stayed. "
            "Losing water is the signature of the acetal and imine "
            "condensations, not of a hydrate or a cyanohydrin."
        ),
        katex=r"\ce{C2H4O + H2O -> C2H6O2}\qquad \ce{C2H4O + CHN -> C3H5NO}",
        caption=(
            "Picture the flat three-spoked carbonyl carbon with the "
            "nucleophile approaching from directly above the plane. As it "
            "arrives the three original bonds fold down away from it like the "
            "ribs of a closing umbrella, the carbon becomes a tetrahedron, and "
            "the oxygen, now holding both of the old pi electrons, swings down "
            "to collect a proton."
        ),
    ),
    # ---------------- Unit 7: acid derivatives and polymers ----------------
    TriangleView(
        node="ORG2.DERIVATIVEREACTIVITY",
        title="A ladder you can read off an infrared spectrum",
        macroscopic=(
            "Run the four acetyl compounds through an infrared spectrometer "
            "and the carbonyl band climbs the ladder in step with the "
            "reactivity: the amide lowest, near 1630 to 1690 cm-1, the ester "
            "near 1735 to 1750 cm-1, the anhydride as a pair of bands near "
            "1760 and 1820 cm-1, and the acid chloride highest, near 1790 to "
            "1815 cm-1. The bench reports the same ordering more coarsely. The "
            "compound at the top of the ladder is consumed by traces of "
            "moisture in the air, and the one at the bottom can be kept in a "
            "bottle indefinitely."
        ),
        particulate=(
            "Each of the four is the same acyl group attached to a different "
            "heteroatom, and that atom does two things at once. A lone pair on "
            "it pushes into the carbonyl pi system, which weakens the carbon "
            "to oxygen double bond and leaves the carbon less electron poor; "
            "nitrogen does this hardest, oxygen less, chlorine barely at all. "
            "And it has to leave when a nucleophile completes the "
            "substitution, which it does in the reverse order. The resonance "
            "structure with a formal positive on nitrogen and a negative on "
            "oxygen is not a species the molecule visits some fraction of the "
            "time. It is one picture of a single delocalised distribution, and "
            "how much the nitrogen donates is a statement about that one "
            "distribution."
        ),
        symbolic=(
            "The ladder is written as an ordering and not as a set of rates: "
            "acid chloride, then anhydride, then ester, then amide, most "
            "reactive first. Its predictive content is directional. You can "
            "write any derivative going to one below it, because the incoming "
            "nucleophile brings a worse leaving group than the one being "
            "expelled, and the reverse arrow is the one the notation refuses."
        ),
        connector=(
            "The strength of the carbon to oxygen double bond is one quantity "
            "in all three: it is where the infrared band falls, it is how much "
            "of the neighbouring atom's lone pair has pushed into the pi "
            "system, and it is what the four rungs of the ladder are ordered "
            "by."
        ),
        pitfall=(
            "The specific confusion is reading reactivity off a property you "
            "can look up for a single atom, its electronegativity, when the "
            "particulate cause is a property of the whole group. Nitrogen is "
            "more electronegative than carbon and the amide is the least "
            "reactive of the four, because that nitrogen's lone pair is spent "
            "donating into the carbonyl and its anion is a terrible leaving "
            "group. The infrared makes the point at the macroscopic level: the "
            "amide's band sits lowest precisely because its carbon to oxygen "
            "bond is the most weakened, and that same donation is what leaves "
            "its carbonyl carbon least electrophilic."
        ),
        katex="",
        caption=(
            "Picture the same acyl group four times, with a different atom "
            "sitting to its left each time and a lone pair on that atom "
            "leaning into the carbon to oxygen bond. Under nitrogen the lean "
            "is heavy and the double bond is visibly loosened; under oxygen it "
            "is lighter; under chlorine the lone pair stays home and the "
            "double bond keeps its full strength."
        ),
    ),
    TriangleView(
        node="ORG2.POLYMERS",
        title="The n in the bracket hides a distribution",
        macroscopic=(
            "Where two difunctional monomer solutions meet at the boundary "
            "between two liquid layers, a film forms at that boundary and can "
            "be lifted and drawn out as one continuous thread for as long as "
            "the boundary keeps feeding it. No small-molecule ester or amide "
            "does anything of the kind. The finished material behaves like a "
            "polymer in a second way too: it softens over a range of "
            "temperature rather than melting sharply at one temperature the "
            "way a pure small molecule does. A batch stopped short of complete "
            "conversion draws no thread at all."
        ),
        particulate=(
            "Every link in the chain is the ordinary acyl substitution you "
            "already know, an alcohol or an amine adding to a carbonyl and a "
            "leaving group departing, and it repeats because each monomer "
            "carries two reactive ends, so every new bond still leaves one "
            "free at each end of the growing chain. What a sample holds is not "
            "one length repeated. It holds a distribution of chain lengths, "
            "which is why the material softens over a range instead of melting "
            "at a point. The bracketed repeat unit with its subscript n "
            "suggests otherwise and is a model: n is an average over that "
            "distribution, not the size of a molecule."
        ),
        symbolic=(
            "n of the diamine plus n of the diacid gives one chain plus 2n "
            "water, written with the repeat unit in brackets and n outside "
            "them. Ethylene glycol, C2H6O2, with terephthalic acid, C8H6O4, "
            "gives a polyester; hexane-1,6-diamine, C6H16N2, with adipic acid, "
            "C6H10O4, gives a polyamide. The small molecule lost at each link "
            "is what makes these condensation polymers."
        ),
        connector=(
            "The number of links actually formed per chain is one quantity in "
            "all three: it is whether the material draws into a thread or "
            "crumbles, it is how many monomers are strung together in the "
            "particulate picture, and it is the n written outside the bracket."
        ),
        pitfall=(
            "The specific confusion is reading the bracketed formula with its "
            "n as though it described a single molecule of a fixed size, which "
            "makes 95 percent conversion sound like ninety-five percent of the "
            "way to that molecule. At the macroscopic level 90 or 95 percent "
            "conversion gives chains that are still far too short to be a "
            "material, and the average length climbs steeply only in the last "
            "few percent. An imbalance in the amounts of the two monomers caps "
            "the chains for the same reason. The symbol n hides both the "
            "distribution and the steepness, and near-complete is not close "
            "enough."
        ),
        katex=r"n\,\ce{H2N(CH2)6NH2} + n\,\ce{HO2C(CH2)4CO2H} \longrightarrow \text{chain} + 2n\,\ce{H2O}",
        caption=(
            "Picture a heap of two-handed monomers, each shaking hands with "
            "the next and releasing a small molecule as it does. Some heaps "
            "run to a hundred linked units, some stop at three, and the sample "
            "is all of those lengths at once rather than a hundred copies of "
            "any one of them."
        ),
    ),
    # ---------------- Unit 8: the aldol ----------------
    TriangleView(
        node="ORG2.ALDOL",
        title="Two events, two mass balances",
        macroscopic=(
            "Combine two carbonyl compounds and isolate the first product. Its "
            "mass and its combustion analysis say the exact sum: two molecules "
            "of C2H4O give one of C4H8O2, with nothing lost. Warm the same "
            "flask and a second substance appears whose analysis is C4H6O, "
            "lighter by exactly one water. That second substance also absorbs "
            "ultraviolet light at a longer wavelength than either partner did, "
            "because its new carbon to carbon double bond is conjugated with "
            "the carbonyl."
        ),
        particulate=(
            "Base removes a hydrogen from the carbon next to a carbonyl, "
            "leaving an anion whose extra electron density is shared between "
            "that carbon and the oxygen. That carbon then attacks the carbonyl "
            "carbon of a second molecule, and a new carbon to carbon bond is "
            "made. The two drawings of the enolate, one with the charge on "
            "carbon and one with it on oxygen, are not two species and the "
            "anion does not alternate between them; they are two pictures of "
            "one delocalised anion. That it reacts at carbon here is a fact "
            "about where the new bond forms, not evidence that the "
            "carbon-charged picture is the real one."
        ),
        symbolic=(
            "Addition first: 2 C2H4O gives C4H8O2, the sum. Dehydration "
            "second, and separately: C4H8O2 gives C4H6O plus H2O, one water "
            "and no more. Where the carbon that was attacked ends up carrying "
            "four different groups it is a stereocentre, so the aldol is "
            "written as a racemic pair, and where the alpha carbon becomes one "
            "too the product is a set of diastereomers, each a pair of "
            "enantiomers."
        ),
        connector=(
            "The new carbon to carbon bond is one bond in all three: it is why "
            "the isolated product weighs the sum of the two partners, it is "
            "what the enolate carbon made when it reached the second carbonyl, "
            "and it is the bond the formula C4H8O2 accounts for that neither "
            "C2H4O had."
        ),
        pitfall=(
            "The specific confusion is collapsing two particulate events into "
            "one symbolic step, writing the enone straight from the two "
            "partners and subtracting a water that the addition never lost. "
            "The balance is the check: the addition product weighs the exact "
            "sum, and only the separate dehydration takes one water off. "
            "Skipping the intermediate on paper also hides the stereocentre "
            "that was set at the carbon the enolate attacked, so a step that "
            "looks like tidy bookkeeping quietly deletes a stereochemical "
            "outcome that a real sample would show."
        ),
        katex=r"\ce{2C2H4O -> C4H8O2}\qquad \ce{C4H8O2 -> C4H6O + H2O}",
        caption=(
            "Picture one molecule losing a hydrogen from the carbon beside its "
            "carbonyl and the leftover electron density smearing across that "
            "carbon and the oxygen. That carbon then reaches out and bonds to "
            "the carbonyl carbon of a neighbour, whose oxygen swings down to "
            "pick up a proton, leaving a hydroxyl three atoms from a carbonyl."
        ),
    ),
    # ---------------- Unit 10: biomolecules and strategy ----------------
    TriangleView(
        node="ORG2.CARBOHYDRATES",
        title="A label on a molecule, not on the bottle",
        macroscopic=(
            "Two different solids can be isolated from glucose, and they are "
            "genuinely two substances. Dissolve either one fresh in water and "
            "watch a polarimeter: the reading drifts and then settles at a "
            "steady value and stops moving, and both solids drift to the same "
            "steady value. That drift is mutarotation. Combustion analysis of "
            "each solid returns C6H12O6, and the settled solution is C6H12O6 "
            "as well, so nothing has been added or removed while the reading "
            "moved."
        ),
        particulate=(
            "The C5 hydroxyl of the open-chain sugar adds across the C1 "
            "aldehyde, closing a six-membered hemiacetal ring and turning the "
            "flat carbonyl carbon into a tetrahedral stereocentre. The "
            "carbonyl has two faces, so the ring closes two ways and the "
            "anomers are the two results. In water the ring keeps opening back "
            "to the free aldehyde and reclosing, so a molecule that was alpha "
            "a moment ago may be beta next. The flat hexagon usually drawn, "
            "with hydroxyls sticking straight up and down, is a convention "
            "chosen to make those up and down relationships readable. The real "
            "pyranose ring is puckered, not flat."
        ),
        symbolic=(
            "The alpha form, the open chain and the beta form are written on "
            "one line joined by equilibrium arrows, all three C6H12O6, because "
            "forming a hemiacetal rearranges bonds without adding or removing "
            "an atom. The alpha and beta labels name the configuration at one "
            "carbon, the anomeric one, relative to the reference centre that "
            "fixes the D or L series; every other centre is identical between "
            "them, which is why they are diastereomers."
        ),
        connector=(
            "The configuration at the anomeric carbon is one thing in all "
            "three: it is what the polarimeter reading is tracking as it "
            "drifts, it is the face the C5 oxygen happened to attack from when "
            "the ring closed, and it is what the letters alpha and beta name."
        ),
        pitfall=(
            "The specific confusion is reading alpha and beta as labels on the "
            "bottle rather than on a molecule at an instant. Dissolve the pure "
            "alpha solid and within a while the solution holds both, which is "
            "what the drifting polarimeter reading is reporting, so the label "
            "describes a molecule now and not a sample over time. The second "
            "half of the same mistake is concluding from a ring drawing with "
            "no carbonyl in it that the aldehyde is gone for good. A small "
            "fraction of open chain is always present, and that is why glucose "
            "still gives the reactions of an aldehyde."
        ),
        katex=r"\text{alpha-D-glucopyranose} \rightleftharpoons \text{open chain} \rightleftharpoons \text{beta-D-glucopyranose},\quad \ce{C6H12O6}\ \text{throughout}",
        caption=(
            "Picture a puckered six-membered ring with one oxygen in it and a "
            "new hydroxyl on the carbon beside that oxygen, pointing down. Now "
            "picture the ring springing open into a straight chain with a "
            "carbonyl at one end, and closing again with that hydroxyl "
            "pointing up. Both pictures are in the same glass at the same "
            "time."
        ),
    ),
    TriangleView(
        node="ORG2.AMINOACIDS",
        title="Net zero is two charges, not none",
        macroscopic=(
            "An amino acid is a crystalline solid that dissolves in water and "
            "not in a nonpolar solvent, which is how a salt behaves rather "
            "than how a small molecule carrying an amine and an acid group "
            "would. Titrate a solution and the pH resists change over two "
            "separate stretches, not one. Vary the pH and the solubility "
            "passes through a minimum, and at that same pH the molecule stops "
            "migrating toward either electrode in an electric field. For "
            "glycine and alanine that pH falls near 6, a tabulated value "
            "rather than one derived here."
        ),
        particulate=(
            "A carboxylic acid is a better proton donor than an ammonium ion "
            "is, so the carboxyl hands its proton to the amine on its own "
            "molecule and the particle carries a positive ammonium at one end "
            "and a negative carboxylate at the other. It is one neutral "
            "particle with two full charges on it, an internal salt. Writing "
            "the neutral molecule as H2N-CHR-COOH is a drawing convention "
            "carried over from treating the two functional groups separately; "
            "in the solid and in water near neutral pH essentially every "
            "particle is the zwitterion, and the uncharged form is a minor "
            "contributor rather than the normal state."
        ),
        symbolic=(
            "H2NCH2CO2H and the zwitterion H3N+CH2CO2- are written as one "
            "equilibrium, and both are C2H5NO2, because moving a proton within "
            "a molecule changes no atom count. The isoelectric point is "
            "written as the pH at which the average net charge is zero, "
            "computed for a neutral side chain as the average of the two pKa "
            "values that flank the zwitterion."
        ),
        connector=(
            "The pair of opposite charges on one particle is the same fact in "
            "all three: it is why the solid behaves like a salt and why "
            "solubility bottoms out and migration stops at one particular pH, "
            "it is the proton that moved from the carboxyl to the amine, and "
            "it is what the plus and the minus in the zwitterion formula "
            "record while the net charge reads zero."
        ),
        pitfall=(
            "The specific confusion is reading net charge zero off the symbol "
            "as an absence of charge. The zwitterion carries two full charges; "
            "zero is their sum, not their absence, and that distinction is "
            "exactly what the macroscopic behaviour turns on, because a "
            "particle with no charges would not be a water-soluble crystalline "
            "salt and would not stand still in an electric field at one "
            "specific pH. The related slip treats the isoelectric point as a "
            "property of the solution, a pH it adopts by itself, when it is a "
            "property of the molecule: the pH you would have to impose for its "
            "charges to balance."
        ),
        katex=r"\ce{H2NCH2CO2H <=> H3N^+CH2CO2^-}\quad \text{both } \ce{C2H5NO2}",
        caption=(
            "Picture one small molecule with a nitrogen at one end wearing "
            "three hydrogens and a full positive charge, and an oxygen pair at "
            "the other end sharing a full negative charge, the proton having "
            "walked from one end to the other. Nothing entered and nothing "
            "left, and the particle as a whole is neutral."
        ),
    ),
    TriangleView(
        node="ORG2.RETROSYNTHESIS",
        title="A plan that is scored on the balance",
        macroscopic=(
            "The target is a real substance. 2-phenylpropan-2-ol, C9H12O, is "
            "something you can isolate, weigh and put in a bottle, and at the "
            "end of a route either that material is there and its spectrum "
            "matches or it is not. That is the whole of how a route is judged. "
            "The pieces the analysis names are substances too: acetophenone, "
            "C8H8O, and a methyl organometallic are things you can obtain, "
            "which is what makes the plan runnable rather than decorative."
        ),
        particulate=(
            "The bond being disconnected is one shared pair of electrons "
            "between two carbons, and the analysis asks which of the two "
            "fragments brought that pair. The synthons it produces, a methyl "
            "anion and an oxygen-stabilised cation, are bookkeeping devices "
            "rather than particles: no flask holds a free methyl anion. The "
            "real particulate event in the forward direction is a "
            "nucleophilic carbon, held on a metal, meeting the electron-poor "
            "carbon of a carbonyl, and the synthon notation is a way of "
            "recording which side of that meeting supplied the electrons."
        ),
        symbolic=(
            "A double-lined retrosynthetic arrow, read from the target "
            "backward, with the two synthons on its right: C9H12O gives the "
            "acetophenone-derived cation and a methyl anion. Each synthon is "
            "then paired with its synthetic equivalent, the real compound that "
            "plays that role forward, and the degrees of unsaturation track "
            "the change, four for the ring in the target and five for the ring "
            "plus the carbonyl in acetophenone."
        ),
        connector=(
            "One carbon to carbon bond is the same bond in all three: it is "
            "the bond that has to be made for the material to appear on the "
            "balance, it is the pair of electrons one fragment brings to the "
            "other, and it is the line the retrosynthetic arrow cuts."
        ),
        pitfall=(
            "The specific confusion is treating a synthon as a reagent, which "
            "promotes a piece of notation into a bottle on a shelf. A methyl "
            "anion is a way of recording which fragment brought the electrons; "
            "the thing you can obtain is a methyl organometallic. The "
            "macroscopic test is whether the piece has a supplier. The wider "
            "version of the same error scores a route by how tidy the arrows "
            "look on the page: the paper level is where the plan is built, and "
            "the only place it is settled is the balance at the end, where a "
            "route that names fragments no forward reaction can supply returns "
            "nothing."
        ),
        katex=r"\ce{C9H12O} \Longrightarrow \ce{C8H8O} + \ce{CH3^-}\ \text{(synthon)}",
        caption=(
            "Picture the target molecule with one line through a single carbon "
            "to carbon bond, and the two halves drawn apart with the electrons "
            "of that bond given entirely to one of them. One half is left "
            "electron rich and negative, the other electron poor and positive, "
            "and neither of those halves is a thing you could pour."
        ),
    ),
]


TRIANGLE_VIEWS_ORG2: dict[str, TriangleView] = {v.node: v for v in _VIEWS}


def for_node(node: str) -> TriangleView | None:
    """The ORG2 triangle view for a curriculum node, or None if there is not one."""
    return TRIANGLE_VIEWS_ORG2.get(node)


def covered_nodes() -> list[str]:
    """ORG2 node codes that have a triangle view, in curriculum order."""
    return [v.node for v in _VIEWS]

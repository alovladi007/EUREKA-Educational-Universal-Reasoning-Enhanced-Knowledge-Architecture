"""Lecture-note depth for ORG1 chapter 7, Cyclic Compounds — tranche 3.

First chapter authored AT the raised 4,000-word floor from birth, with
figures in the same commit (visual-standard directive). Scope checked
against the Loudon benchmark's chapter-7 section list (cycloalkane
conformations and strain, mono- and disubstituted cyclohexanes, smaller
rings, bicyclics); all prose authored for OCTET.

Strain energies are the standard values derived from heats of combustion
per CH2 group against the cyclohexane reference, as compiled in the
physical-organic literature; angle values are geometry.
"""

from __future__ import annotations

from app.data.lesson_extras import (
    Figure,
    LessonExtras,
    ReadingSection,
    Table,
)

EXTRAS_ORG1_CH7: dict[str, LessonExtras] = {}


def _add(extras: LessonExtras) -> None:
    EXTRAS_ORG1_CH7[extras.node] = extras


# --------------------------------------------------------------------------
# 7.1 Cycloalkane strain
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.RINGSTRAIN",
    lead=(
        "Rings are chains that gave up their escape routes, and the price "
        "of that surrender is strain: energy a ring stores because its "
        "geometry cannot fully relax. This chapter separates strain into "
        "its three components, prices every ring size with real "
        "combustion-derived numbers, corrects the century-old planar "
        "fallacy that still lives in most students' intuition, and shows "
        "why stored strain is not a defect but a currency - one that "
        "epoxides, penicillin, and an entire polymer industry spend "
        "deliberately."
    ),
    sections=(
        ReadingSection(
            id="three-strains",
            heading="The taxonomy: three ways a ring can hurt",
            body=(
                "A ring's total strain is the sum of three separable "
                "penalties, and every argument in this chapter reduces "
                "to bookkeeping among them. Angle strain is the cost of "
                "bending a carbon's bond angles away from the "
                "tetrahedral 109.5 degrees its sp3 hybridisation "
                "wants: compressing the C-C-C angle to 60 degrees in a "
                "three-membered ring forces the bonding orbitals to "
                "miss each other, weakening every bond in the ring at "
                "once. Torsional strain is the chapter-2 penalty "
                "imported unchanged: eclipsed bonds on adjacent "
                "carbons repel, at roughly 4 kJ/mol per eclipsed "
                "hydrogen pair, and a ring whose geometry locks its "
                "bonds into eclipse pays that toll permanently, with "
                "no rotation available to relieve it. Transannular "
                "strain, the late arrival, is crowding ACROSS the "
                "ring: in medium rings the hydrogens on opposite "
                "sides reach into the same interior space and repel - "
                "a penalty impossible for small rings, which have no "
                "interior, and negligible for large ones, which have "
                "room.\n\n"
                "Keeping the three separate is what makes ring "
                "chemistry predictable rather than memorised. Each "
                "ring size mixes the penalties in its own "
                "proportions, and the questions this chapter answers "
                "- why cyclopropane is reactive, why cyclohexane is "
                "the reference, why eight-membered rings are "
                "awkward, why puckering happens at all - are each "
                "answered by naming WHICH strain dominates and what "
                "geometry could relieve it. The general principle, "
                "worth stating before any example: a ring will "
                "distort away from its idealised flat shape "
                "whenever doing so trades a small angle-strain "
                "increase for a larger torsional or transannular "
                "relief, because the total, not any single term, "
                "is what nature minimises."
            ),
        ),
        ReadingSection(
            id="measuring-strain",
            heading="Pricing the pain: heats of combustion per CH2",
            figure=Figure(
                stem="org1-ring-strain",
                caption=(
                    "Total ring strain by ring size, from heats of combustion against the cyclohexane reference: two strained extremes, one strain-free valley at six."
                ),
                alt="Bar chart of total ring strain in kJ/mol for ring sizes three through eight.",
            ),
            body=(
                "Strain is measured, not asserted, and the instrument "
                "is the same calorimetry that priced alkene "
                "stability. Every CH2 group burned releases a "
                "characteristic heat; an unstrained ring should "
                "release exactly its carbon count times that "
                "per-CH2 value, and any EXCESS heat released is "
                "strain energy the ring was storing - measured, per "
                "compound, to within a few kJ/mol. Run the "
                "arithmetic across the series and the famous "
                "profile appears: cyclopropane stores about 115 "
                "kJ/mol, cyclobutane nearly as much at about 110, "
                "cyclopentane a modest 26, cyclohexane essentially "
                "ZERO - the strain-free reference against which the "
                "others are priced - cycloheptane back up to about "
                "26, and cyclooctane roughly 40. Strain per CH2 "
                "tells the sharper story: cyclopropane's 115 "
                "kJ/mol is spread over only three carbons - nearly "
                "40 kJ/mol per carbon - which is why the smallest "
                "ring is qualitatively different chemistry, not "
                "merely quantitatively worse.\n\n"
                "The profile's shape is the chapter's map. The "
                "left wall (three- and four-membered rings) is "
                "angle strain plus forced eclipsing; the valley at "
                "six is the chair conformation's triumph, taught "
                "in full next chapter; the modest rise through the "
                "medium rings (seven through eleven) is "
                "transannular crowding plus imperfect staggering; "
                "and beyond about twelve carbons the strain fades "
                "toward zero as rings become, conformationally, "
                "chains that happen to bite their own tails. "
                "Every claim that follows in this chapter is an "
                "annotation on this one measured curve."
            ),
            table=Table(
                caption="Total ring strain by ring size",
                columns=("Ring size", "Strain (kJ/mol)", "Dominant contribution"),
                rows=(
                    ("3 (cyclopropane)", "115", "angle + full eclipsing"),
                    ("4 (cyclobutane)", "110", "angle + eclipsing, partly relieved by pucker"),
                    ("5 (cyclopentane)", "26", "residual torsional (envelope pucker)"),
                    ("6 (cyclohexane)", "~0", "none - chair achieves both ideals"),
                    ("7 (cycloheptane)", "26", "torsional + onset of transannular"),
                    ("8 (cyclooctane)", "40", "transannular + torsional"),
                ),
                source="Strain energies derived from heats of combustion per CH2 vs the cyclohexane reference, standard physical-organic compilations",
                note="Values rounded; per-CH2 strain makes cyclopropane's severity clearest.",
            ),
        ),
        ReadingSection(
            id="strain-arithmetic",
            heading="The strain arithmetic, done honestly",
            body=(
                "The numbers in the table are not looked up - they are "
                "computed from two measured quantities, and the "
                "computation is short enough to own. The reference is "
                "cyclohexane, whose combustion releases $658.6$ kJ/mol "
                "per $CH_2$ group - the strainless price of burning one "
                "methylene. For any ring of $n$ carbons, the strain "
                "energy is the excess heat over that baseline: "
                "$E_{strain} = \\Delta H_c^{obs} - n \\times 658.6$ "
                "kJ/mol. Run it for cyclopropane: combustion gives "
                "$697.1$ kJ/mol per $CH_2$, so "
                "$E_{strain} = 3 \\times (697.1 - 658.6) = 115.5$ "
                "kJ/mol - the 115 in the table, derived rather than "
                "asserted. Cyclopentane's $663.8$ per $CH_2$ yields "
                "$5 \\times 5.2 = 26$ kJ/mol, and cyclohexane, being "
                "the reference, prices itself at zero by "
                "construction.\n\n"
                "The geometric half of the argument is one formula. A "
                "planar ring of $n$ sides has internal angles "
                "$\\theta_n = 180^{\\circ}(n-2)/n$: $60^{\\circ}$ "
                "for the triangle, $90^{\\circ}$ for the square, "
                "$108^{\\circ}$ for the pentagon, $120^{\\circ}$ "
                "for the hexagon. Against the tetrahedral "
                "$109.5^{\\circ}$, the triangle is $49.5^{\\circ}$ "
                "short PER ANGLE - an enormous, unfixable deficit - "
                "while the planar pentagon misses by only "
                "$1.5^{\\circ}$ and the planar hexagon OVERSHOOTS by "
                "$10.5^{\\circ}$, which is precisely why both pucker "
                "instead of lying flat. Add the torsional ledger from "
                "chapter 2 - roughly $4$ kJ/mol per pair of eclipsed "
                "$C-H$ bonds, about $12$ kJ/mol per fully eclipsed "
                "bond - and cyclopropane's rigidity becomes "
                "quantitative: three bonds locked permanently eclipsed "
                "contribute torsional pain on top of the angle deficit, "
                "and neither term can relax without breaking the ring. "
                "Every strain claim in this chapter reduces to these "
                "two computations."
            ),
        ),
        ReadingSection(
            id="baeyer-fallacy",
            heading="The planar fallacy: Baeyer's beautiful wrong idea",
            body=(
                "In 1885 Adolf von Baeyer proposed the first strain "
                "theory, and its central assumption - that rings are "
                "planar polygons - is the intuition most students "
                "still arrive carrying, which is why demolishing it "
                "carefully is worth a full section. Baeyer reasoned "
                "from interior angles: a flat regular polygon of n "
                "sides has interior angles of 180(n-2)/n degrees, so "
                "cyclopropane's 60 and cyclobutane's 90 fall short "
                "of tetrahedral while cyclopentane's 108 nearly "
                "matches it - and so far the predictions land. But "
                "the planar assumption then predicts cyclohexane's "
                "120 degrees should OVERSHOOT tetrahedral and strain "
                "the ring, with every larger ring worse, strain "
                "growing forever with size. The measured curve says "
                "the opposite: six is the strain-free minimum and "
                "large rings relax toward zero. Baeyer's geometry "
                "was impeccable; his molecules simply refused to "
                "stay flat.\n\n"
                "The correction is the chapter's central insight: "
                "RINGS PUCKER. A nonplanar ring can hold its "
                "C-C-C angles near tetrahedral while "
                "simultaneously staggering its bonds, paying a "
                "trivial price in geometry for a large refund in "
                "both angle and torsional strain. Only "
                "cyclopropane is genuinely planar - three points "
                "define a plane, so it has no choice - and every "
                "other ring escapes flatness to whatever extent "
                "helps. The habit the correction installs is "
                "permanent: never reason about a ring from its "
                "flat drawing. The hexagon on paper is a "
                "connectivity diagram, not a shape, and the "
                "chapter after this one is entirely about what "
                "the real shape - the chair - does for "
                "chemistry. Baeyer's theory survives as the "
                "small-ring half of the truth, and his name "
                "survives on angle strain itself, still called "
                "Baeyer strain a century and a half on."
            ),
        ),
        ReadingSection(
            id="cyclopropane-depth",
            heading="Cyclopropane: bent bonds and real reactivity",
            figure=Figure(
                stem="org1-ring-gallery",
                caption=(
                    "The first four cycloalkanes with their strain prices: the qualitative break between the strained small rings and the relaxed reference is the chapter's key divide."
                ),
                alt="Structures of cyclopropane, cyclobutane, cyclopentane, and cyclohexane with strain energies.",
            ),
            body=(
                "The smallest ring deserves its close-up, because "
                "its strain is severe enough to change what kind of "
                "bonds it has. Carbon orbitals cannot bend to 60 "
                "degrees, so cyclopropane compromises: its C-C "
                "bonding orbitals overlap OFF the internuclear "
                "axis, forming the famous bent or 'banana' bonds - "
                "part sigma, part pi in character, with electron "
                "density bowed outside the triangle. Bent overlap "
                "is poor overlap, so the bonds are weaker than "
                "normal C-C sigma bonds, and the locked-flat "
                "geometry eclipses all six C-H bonds on top, "
                "stacking full torsional strain onto the angle "
                "penalty. The consequences are chemical, not "
                "cosmetic: cyclopropane's C-C bonds react in ways "
                "alkane bonds never do - hydrogenolysis over "
                "catalysts opens the ring, strong acids can cleave "
                "it, and the partial pi character even lets "
                "cyclopropyl groups stabilise adjacent cations in "
                "a way the carbocation chapter's ladder would not "
                "predict from a 'saturated' substituent.\n\n"
                "Strained as it is, the cyclopropane ring is no "
                "laboratory curiosity: nature and medicine build "
                "with it precisely because its strain is "
                "kinetically trapped - the barrier to opening is "
                "high even though the payout is large, the "
                "diamond-and-graphite lesson at three carbons. "
                "The pyrethrin insecticides of chrysanthemums "
                "and their synthetic pyrethroid descendants "
                "carry cyclopropane cores; so do several drugs, "
                "where the ring serves as a compact, "
                "metabolically sturdy substituent. The exam-"
                "ready summary: cyclopropane is planar, "
                "eclipsed, bent-bonded, and the most reactive "
                "cycloalkane - and any question calling a "
                "cycloalkane 'alkane-inert' has excluded the "
                "three-membered case."
            ),
        ),
        ReadingSection(
            id="four-and-five",
            heading="Cyclobutane and cyclopentane: the art of the partial escape",
            body=(
                "Four- and five-membered rings introduce the "
                "puckering trade in its pure form. A square, planar "
                "cyclobutane would hold 90-degree angles AND eclipse "
                "all eight C-H bonds; the real molecule folds about "
                "25 degrees along a diagonal into a 'wing' or "
                "butterfly shape, WORSENING its angle strain "
                "slightly (the fold pinches the angles below 90) in "
                "exchange for partial relief of the eclipsing. That "
                "trade - accept more of the smaller penalty to "
                "relieve the larger - is exactly the total-energy "
                "logic the taxonomy section promised, and it is why "
                "cyclobutane's total strain sits barely below "
                "cyclopropane's despite the friendlier polygon "
                "angle. Cyclopentane makes the same trade from a "
                "better starting point: planar, its 108-degree "
                "angles would be nearly perfect, but ten eclipsed "
                "hydrogens would cost dearly - so the ring puckers "
                "into the envelope shape, four carbons roughly "
                "planar and one flap carbon lifted, converting "
                "most eclipses into near-staggers at a trivial "
                "angle cost.\n\n"
                "Cyclopentane adds a dynamic wrinkle worth "
                "knowing by name: pseudorotation. The flap is not "
                "fixed - the pucker migrates around the ring, "
                "each carbon taking a turn out of plane, through "
                "envelope and half-chair (twist) forms of nearly "
                "equal energy, so the molecule is a rippling ring "
                "rather than a static tent. The five-membered "
                "ring's combination - low strain, flexible "
                "pucker - is part of why nature uses it "
                "constantly: the ribose and deoxyribose of RNA "
                "and DNA are five-membered rings whose envelope "
                "puckers (the C2'-endo and C3'-endo forms of "
                "biochemistry) are functionally meaningful, "
                "helping set the difference between the A- and "
                "B-form double helices. A ring size this course "
                "prices at 26 kJ/mol carries the genome's "
                "backbone."
            ),
        ),
        ReadingSection(
            id="six-preview",
            heading="Six: the valley, previewed honestly",
            body=(
                "Cyclohexane's essentially zero strain is the "
                "profile's headline, and the full mechanism of "
                "that triumph - the chair conformation, its "
                "axial and equatorial positions, the ring flip - "
                "is the next chapter's entire subject. What THIS "
                "chapter owes is the energetic accounting: the "
                "chair holds every C-C-C angle within a degree or "
                "so of tetrahedral AND staggers every single "
                "bond around the ring perfectly - both ideals at "
                "once, which no other ring size achieves. That "
                "double perfection is why six-membered rings are "
                "chemistry's default: sugars pyranose forms, "
                "steroid frameworks, countless drugs and "
                "materials all settle into six-membered rings "
                "because thermodynamics charges nothing for "
                "them. When the synthesis chapters later note "
                "that six-membered rings form fastest and most "
                "often in cyclisations, the observation will "
                "trace straight back to this zero.\n\n"
                "One honest caveat prevents an overcorrection: "
                "'strain-free' describes the CHAIR, not "
                "everything a cyclohexane does. The flat "
                "hexagon of a drawing would be badly strained; "
                "the boat form the next chapter meets carries "
                "real torsional and flagpole penalties; and "
                "substituted chairs pay the A-value costs that "
                "chapter prices. Zero is the floor the best "
                "conformation reaches, not a property of the "
                "connectivity - the same conformation-versus-"
                "constitution distinction chapter 2 built, now "
                "load-bearing. The ring is only as relaxed as "
                "its best available shape, and the next two "
                "chapters are about who gets to occupy that "
                "shape and at what cost."
            ),
        ),
        ReadingSection(
            id="medium-and-large",
            heading="Medium rings, large rings, and the return to chainhood",
            body=(
                "From seven carbons upward the strain profile "
                "climbs modestly before decaying, and the "
                "culprit changes identity. Medium rings - seven "
                "through about eleven carbons - cannot stagger "
                "every bond AND keep angles ideal AND keep their "
                "interiors empty simultaneously: some hydrogens "
                "inevitably point into the ring's middle, where "
                "they collide with hydrogens from the far side. "
                "That transannular crowding, invisible in small "
                "rings and dilute in large ones, peaks in this "
                "range (cyclooctane's 40 kJ/mol is mostly this) "
                "and gives medium rings their reputation as the "
                "hardest sizes to synthesise: a chain trying to "
                "cyclise to a nine-membered ring must fold "
                "through exactly the crowded geometries the "
                "product will suffer, so both thermodynamics "
                "and kinetics vote against it. Synthetic "
                "chemists' ring-size preference - five and six "
                "easy, three fast but strained, eight to eleven "
                "grim - is this section stated as lab lore.\n\n"
                "Past roughly twelve carbons, rings relax "
                "toward chainhood: enough atoms exist to "
                "stagger every bond, hold every angle "
                "tetrahedral, and line the interior without "
                "collisions, so strain per CH2 approaches zero "
                "and macrocycles behave like tied-off chains. "
                "Nature exploits the regime richly - the "
                "fourteen- to sixteen-membered macrolide "
                "antibiotics (erythromycin's family), muscone's "
                "fifteen-membered ring in musk - and supramolecular "
                "chemistry's crown ethers, met in the "
                "solvent-engineering lesson, are macrocycles "
                "whose comfort is precisely what lets them "
                "wrap cations. The full arc - strained small, "
                "perfect six, crowded middle, relaxed large - "
                "is one curve with three regimes, and placing "
                "any unfamiliar ring on it is the first move "
                "of every ring problem."
            ),
        ),
        ReadingSection(
            id="strain-as-currency",
            heading="Strain as currency: rings that are built to spend it",
            body=(
                "The epoxide lesson taught strain-as-currency for "
                "one three-membered ring; this section "
                "generalises the ledger. Stored strain is "
                "potential energy with a kinetic lock: a "
                "strained ring sits far above its open-chain "
                "products yet persists because opening requires "
                "a path, and chemistry's art is fitting keys to "
                "those locks. Cyclopropanes open under "
                "hydrogenolysis and with electrophiles; "
                "epoxides open with any decent nucleophile, "
                "their oxygen making the carbons electrophilic "
                "as well as strained - the double activation "
                "that made them the featured reagent of chapter "
                "5. Four-membered lactones and lactams open "
                "more reluctantly than three-membered rings but "
                "far faster than their unstrained homologues; "
                "and ring-opening polymerisation, previewed "
                "with PEG, runs the currency at industrial "
                "scale - every strained-ring monomer is a "
                "little battery, and the polymer chain is the "
                "discharge circuit.\n\n"
                "Medicine's most famous strain-spender earns "
                "its paragraph: penicillin. Its four-membered "
                "beta-lactam ring fuses the amide nitrogen "
                "into a geometry that steals the amide's "
                "usual resonance relaxation, leaving the "
                "carbonyl unusually electrophilic AND "
                "spring-loaded. The bacterial enzyme that "
                "crosslinks cell walls attacks that carbonyl "
                "as if it were a normal substrate; the ring "
                "springs open, acylating the enzyme's "
                "active-site serine irreversibly, and the "
                "bacterium builds no more wall. Resistance "
                "via beta-lactamase enzymes is the "
                "counter-move - bacteria evolving their own "
                "key to discharge the battery harmlessly - "
                "and the ongoing arms race of lactam "
                "antibiotics versus lactamases is, at "
                "bottom, ring-strain chemistry with lives "
                "attached. Strain is not a defect; it is "
                "ammunition, and this chapter is where its "
                "calibre is learned."
            ),
        ),
        ReadingSection(
            id="bicyclics",
            heading="Rings sharing atoms: fused, bridged, spiro",
            body=(
                "Real molecules seldom stop at one ring, and "
                "the vocabulary of ring fusion organises "
                "everything from decalin to morphine. Two rings "
                "sharing one atom are SPIRO; sharing two "
                "adjacent atoms (an edge) are FUSED; sharing "
                "two non-adjacent atoms, with a bridge of one "
                "or more carbons arching between, are BRIDGED. "
                "Nomenclature counts bridges: bicyclo[4.4.0]"
                "decane is decalin, two fused six-membered "
                "rings; bicyclo[2.2.1]heptane is norbornane, "
                "the bridged skeleton whose cation vexed a "
                "generation of physical organic chemists. "
                "Strain bookkeeping extends naturally - each "
                "ring wants its own best conformation, and "
                "fusion constrains both: decalin's rings can "
                "both be chairs, in cis or trans fusion whose "
                "difference the stereochemistry chapters "
                "price, while small bridged systems lock "
                "their bridgehead carbons so rigidly that "
                "Bredt's rule - no double bond at the "
                "bridgehead of a small bicyclic, met in the "
                "alkene chapter - follows immediately.\n\n"
                "The showcase fused system is the steroid "
                "nucleus: four fused rings - three "
                "six-membered chairs and one five-membered "
                "envelope - sharing edges down a rigid "
                "spine. That rigidity is the point: "
                "cholesterol, cortisol, estradiol and "
                "testosterone present their functional "
                "groups at fixed three-dimensional "
                "addresses because the fused-chair chassis "
                "cannot flex, which is what lets receptors "
                "read them precisely. When the next "
                "chapters put substituents on single "
                "chairs and price their positions, keep "
                "the steroid in view as the destination: "
                "four annotated chairs, fused, is the "
                "molecular hardware of endocrinology, and "
                "it is read with exactly the tools this "
                "chapter and the next two build."
            ),
        ),
        ReadingSection(
            id="ringstrain-problem-set",
            heading="A ring-strain problem set",
            body=(
                "Four drills. One, pure profile reading: rank "
                "cyclopropane, cyclopentane, and cyclooctane by "
                "strain per CH2, and name each ring's dominant "
                "penalty. Cyclopropane worst (about 38 kJ/mol "
                "per carbon; angle plus eclipsing), cyclooctane "
                "next (about 5; transannular), cyclopentane "
                "least (about 5, torsional residue) - and "
                "noticing the last two nearly tie per carbon "
                "while differing in TOTAL is the drill's point "
                "about which number answers which question. "
                "Two, the trade: explain why cyclobutane "
                "puckers even though puckering makes its bond "
                "angles WORSE. Folding relieves more torsional "
                "strain than it adds angle strain; the total "
                "rules, not any single term. Three, the "
                "prediction: a synthesis must close either a "
                "six-membered or a nine-membered ring from "
                "similar precursors - which forms readily and "
                "why? Six: strain-free product and an easy "
                "folding path; nine fights transannular "
                "crowding in both product and transition "
                "state. Four, the integrator: why does "
                "penicillin's four-membered ring react while "
                "cyclobutane itself is fairly inert, given "
                "similar strain? Strain sets the payout, not "
                "the rate; penicillin's carbonyl gives "
                "nucleophiles a low-barrier door the "
                "hydrocarbon lacks - the kinetic-lock lesson "
                "in one comparison.\n\n"
                "The audits behind the drills: read strain "
                "off the measured curve, name the dominant "
                "term, respect the total-energy trade, and "
                "keep payout separate from path. Four "
                "habits, one chapter, and every ring "
                "question this course or the MCAT will ask "
                "exercises at least one of them."
            ),
        ),
        ReadingSection(
            id="ringstrain-history",
            heading="From Baeyer to Barton: the century the ring took",
            body=(
                "Ring-strain theory is a clean case study in "
                "how chemistry corrects itself. Baeyer's 1885 "
                "planar theory explained the small rings and "
                "earned him lasting naming rights; its "
                "large-ring predictions failed almost "
                "immediately, since chemists could make big "
                "rings that his theory said should barely "
                "exist. Hermann Sachse proposed the answer in "
                "1890 - a nonplanar, strain-free 'chair' "
                "cyclohexane - and was ignored for a "
                "generation; Ernst Mohr revived the idea in "
                "1918, and the Sachse-Mohr chair waited for "
                "experimental proof until Odd Hassel's "
                "electron-diffraction work in wartime Norway "
                "showed gaseous cyclohexane genuinely "
                "chair-shaped. Derek Barton then made "
                "conformation CHEMICAL in 1950, showing that "
                "reactivity in steroids tracks axial versus "
                "equatorial placement - founding "
                "conformational analysis - and Barton and "
                "Hassel shared the 1969 Nobel Prize for it. "
                "The arc from wrong-but-fertile theory to "
                "measured shape to predictive chemistry took "
                "sixty-five years and one more chapter of "
                "this course to teach.\n\n"
                "The history sets this chapter's place "
                "honestly: strain is the energetic half of "
                "ring chemistry, and conformation - the "
                "chair chapter ahead - is the geometric "
                "half that makes it predictive. Baeyer "
                "asked the right question with the wrong "
                "picture; the answer needed shape, and "
                "shape needed instruments. Every 'why' "
                "this chapter has answered rests on that "
                "century of correction, which is one more "
                "reason the course keeps instruments "
                "beside every claim: theories are "
                "provisional, but a measured strain "
                "energy, like a diffraction pattern, is "
                "a fact any future theory must fit."
            ),
        ),
        ReadingSection(
            id="strain-and-heat-of-formation",
            heading="Where strain lives on the energy books",
            body=(
                "Strain deserves its formal place in the "
                "thermochemical bookkeeping this course has built, "
                "because the accounting clarifies claims that "
                "sound vague when spoken loosely. A strained "
                "ring's heat of formation sits HIGHER (less "
                "negative) than the sum of standard group "
                "contributions predicts, and the excess IS the "
                "strain energy - the same additivity-then-"
                "deviation logic that let hydrogenation heats "
                "expose benzene's resonance energy, running in "
                "the opposite direction: aromaticity is a "
                "stability surplus, strain a stability deficit, "
                "and both are measured as departures from "
                "group-additive expectation. The practical "
                "consequences read straight off the books. "
                "Combustion of a strained ring releases extra "
                "heat (the deficit repaid); hydrogenolytic "
                "opening of cyclopropane is more exothermic "
                "than an ordinary C-C cleavage would be; and "
                "any reaction that RELIEVES strain gains its "
                "energy as extra driving force, while any "
                "reaction that CREATES ring strain - a "
                "cyclisation to a small or medium ring - must "
                "pay it as an added cost against whatever else "
                "drives the closure.\n\n"
                "That last line prices synthesis honestly. "
                "Epoxidation succeeds despite creating 100-plus "
                "kJ/mol of ring strain because the O-O bond it "
                "spends is weak enough to cover the bill; "
                "intramolecular substitutions close "
                "three-membered rings quickly (entropy loves "
                "short tethers) even though thermodynamics "
                "grumbles, and the products persist behind "
                "their kinetic locks. Reading every "
                "ring-forming or ring-opening step with the "
                "strain ledger open - who pays, who collects, "
                "and whether a lock holds the balance in "
                "place - is the transferable audit, and it is "
                "the same three-question energy discipline "
                "(payout, path, lock) the whole energetics "
                "chapter trained, now specialised to rings."
            ),
        ),
        ReadingSection(
            id="rings-in-drugs-and-materials",
            heading="The ring census: why medicine is built on rings",
            body=(
                "A closing panorama motivates the two chapters "
                "ahead. Survey the pharmacopoeia and rings "
                "dominate: the majority of small-molecule drugs "
                "contain at least one ring, and the six- and "
                "five-membered sizes - the strain-free and "
                "near-strain-free classes this chapter priced - "
                "account for most of them. The reasons are "
                "this chapter's content wearing a lab coat. "
                "Rings are RIGID relative to chains: they hold "
                "substituents at defined distances and angles, "
                "which is what lets a molecule fit a receptor "
                "pocket reproducibly - the steroid chassis "
                "taken as a design principle. Rings are "
                "METABOLICALLY sturdier than floppy chains at "
                "equal carbon count. And rings are CHEAP, "
                "thermodynamically, only at the sizes the "
                "strain curve blesses - which is why medicinal "
                "chemistry's workhorse fragments (cyclohexyl, "
                "phenyl, piperidine, pyrrolidine and their "
                "heteroatom kin) cluster at five and six, and "
                "why the strained sizes appear only when their "
                "strain is the point (beta-lactams, "
                "cyclopropyl accents).\n\n"
                "Materials science reads the same census from "
                "its side: adamantane's fused-chair cage "
                "fragments harden drug scaffolds and polymer "
                "backbones; cyclic monomers feed ring-opening "
                "polymerisation exactly per their strain "
                "prices; and the crown ethers and "
                "cyclodextrins of host-guest chemistry are "
                "macrocycles whose relaxed geometry is their "
                "function. The student-sized takeaway: when "
                "you meet any ring from here on - in a drug "
                "structure, a natural product, an exam "
                "synthesis - place it on the strain curve "
                "first. Its size tells you its energetic "
                "temperament, its temperament predicts its "
                "chemistry, and the next two chapters add "
                "the conformational address system that "
                "completes the reading. The ring is organic "
                "chemistry's favourite word; this chapter "
                "taught its pronunciation."
            ),
        ),
        ReadingSection(
            id="heteroatom-rings",
            heading="Swap a carbon: heterocycles inherit the curve",
            body=(
                "Replace one ring CH2 with an oxygen, nitrogen, or "
                "sulfur and the strain story transfers almost "
                "unchanged - which is enormous news, because "
                "heterocycles outnumber carbocycles across "
                "biochemistry and pharmacology. The geometry "
                "barely notices the swap: C-O and C-N bonds are "
                "slightly shorter than C-C, heteroatom angles "
                "bend a little more willingly, but the curve's "
                "shape survives - three-membered heterocycles "
                "(epoxides, aziridines, episulfides) carry "
                "cyclopropane-scale strain and its reactivity, "
                "five- and six-membered ones (tetrahydrofuran, "
                "pyrrolidine, piperidine, tetrahydropyran) are "
                "relaxed and everywhere. The course has already "
                "traded on this: the epoxide chapter's entire "
                "spring-loaded chemistry is 'cyclopropane strain "
                "plus an electrophilic handle', and THF's role "
                "as an inert solvent is 'five-membered comfort "
                "with an oxygen lone pair for coordination'. "
                "Sugar chemistry lives here too: glucose "
                "cyclises to the six-membered pyranose because "
                "the six ring is free, with the five-membered "
                "furanose a close, biologically chosen "
                "alternative for fructose and ribose.\n\n"
                "One genuinely new effect arrives with "
                "heteroatoms and is worth a flag now: lone "
                "pairs and polar bonds give heterocyclic "
                "conformations electronic preferences the "
                "hydrocarbon curve cannot see - the anomeric "
                "effect of carbohydrate chemistry being the "
                "famous case, where an electronegative "
                "substituent at a sugar's anomeric carbon "
                "prefers the axial position that pure sterics "
                "would refuse. The stereochemistry and "
                "carbohydrate chapters will price it "
                "properly; this chapter's contribution is the "
                "baseline it deviates FROM. Learn the "
                "hydrocarbon curve cold, and every "
                "heterocycle you ever meet is that curve "
                "plus a named electronic correction - one "
                "durable framework and one small patch at a "
                "time, instead of an entirely new subject to "
                "learn afresh for every ring system that chemistry owns."
            ),
        ),
        ReadingSection(
            id="ring-audit",
            heading="The ring audit: four questions for any cycle",
            body=(
                "The chapter compresses into a four-question "
                "audit to run on any ring, familiar or not. "
                "One: what SIZE, and where does it sit on the "
                "strain curve - wall, valley, crowded middle, "
                "or relaxed macrocycle? That placement is the "
                "energetic temperament. Two: what SHAPE can it "
                "reach - planar-by-force (three), puckered "
                "(four and five), chair (six, next chapter's "
                "machinery), or floppy (large)? Shape decides "
                "which strains are actually paid versus "
                "relieved. Three: any HETEROATOMS or FUSIONS - "
                "an electrophilic handle on the strain "
                "(epoxide, lactam), an electronic preference "
                "(anomeric), or a rigidity constraint "
                "(fused bridgeheads, Bredt)? Four: is stored "
                "strain LOCKED or SPENDABLE here - does the "
                "molecule's context supply a path (a "
                "nucleophile, a catalyst, an enzyme) that can "
                "collect the payout, or does the ring persist "
                "as a battery on the shelf? Four questions, "
                "thirty seconds, and the ring's chemistry is "
                "substantially predicted before any reagent "
                "is read.\n\n"
                "The audit's reach is the reason this "
                "chapter opens the cyclic block rather than "
                "closing it: the chair chapter refines "
                "question two for the one size that matters "
                "most, the A-values chapter prices "
                "substituents on that refined shape, and the "
                "cis/trans chapter adds configurational "
                "bookkeeping - each a deepening of one audit "
                "line, none a replacement. Students who run "
                "the audit habitually will find the "
                "steroid diagrams, sugar conformations, and "
                "beta-lactam mechanisms of later courses "
                "answering themselves; students who skip it "
                "will meet each ring as a stranger. As "
                "everywhere in this programme, the audit IS "
                "the content - the facts above were chosen "
                "to make its four questions answerable at "
                "sight, and the two figures and one table "
                "this chapter carries were built so that "
                "every audit line has a measured picture "
                "behind it: the strain curve for question "
                "one, the ring gallery for question two, and "
                "the sourced table for whenever a number is "
                "contested. Rings quietly run most of the "
                "rest of this entire course; so run the full "
                "four-question audit, every time, on every "
                "single one of them, "
                "beginning immediately with the celebrated "
                "chair conformation that the very next "
                "chapter finally builds in full - the shape "
                "that spends nothing, holds everything, and "
                "carries more of chemistry and biology on its "
                "six quiet, perfectly staggered carbons than "
                "any other single geometry that this course, "
                "or chemistry itself, will ever have occasion "
                "to draw."
            ),
        ),
    ),
    key_takeaways=(
        "Total strain = angle + torsional + transannular; rings pucker whenever a small angle cost buys a larger torsional or transannular refund.",
        "The measured profile (heats of combustion per CH2): C3 ~115, C4 ~110, C5 ~26, C6 ~0, C7 ~26, C8 ~40 kJ/mol - two walls, one valley at six.",
        "Baeyer's planar assumption predicts the small rings and fails from six onward: only cyclopropane is truly flat, and never reason from a flat drawing.",
        "Cyclopropane's bent 'banana' bonds make it genuinely reactive; strain is kinetically locked energy - the epoxide, beta-lactam, and ROMP chemistry all spend it.",
        "Ring-size lab lore follows the curve: 5-6 form easily, 3 fast but strained, 8-11 hard (transannular), 12+ relax toward chains; fused/bridged/spiro vocabulary organises polycyclics up to the steroid chassis.",
    ),
    exam_tips=(
        "Rank-the-strain questions want the measured order, and 'per CH2' versus 'total' answers different stems - read which is asked.",
        "MCAT loves the beta-lactam: penicillin's reactivity is ring strain plus a blocked amide resonance - answer from this chapter, not from memorised pharmacology.",
    ),
))


# --------------------------------------------------------------------------
# 7.2 The chair conformation
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.CHAIR",
    lead=(
        "Cyclohexane's chair is the single most consequential shape in "
        "organic chemistry: a conformation that achieves perfect "
        "tetrahedral angles and perfect staggering simultaneously, "
        "erasing every kJ of strain the smaller rings pay. This chapter "
        "builds the chair from its geometry up - the two bond "
        "environments it creates, the flip that exchanges them, the "
        "energy landscape the flip crosses - and prices each claim with "
        "the measured numbers, because the chair is not a drawing "
        "convention but a thermodynamic fact your hands can learn to "
        "draw and your arithmetic can verify."
    ),
    sections=(
        ReadingSection(
            id="chair-why",
            heading="Why a chair: the shape that solves both problems",
            body=(
                "Chapter 7.1 ended with a puzzle: cyclohexane's strain "
                "is essentially zero, yet a flat hexagon would carry "
                "$120^{\\circ}$ angles - $10.5^{\\circ}$ too wide at "
                "every corner - plus six pairs of perfectly eclipsed "
                "$C-H$ bonds. Flat cyclohexane would hurt roughly as "
                "much as cyclopentane. The molecule's answer is to "
                "abandon planarity entirely: pucker alternate carbons "
                "up and down and the ring settles into the chair, a "
                "shape in which every single $C-C-C$ angle relaxes to "
                "$111^{\\circ}$ - within a degree of the tetrahedral "
                "ideal - and every bond on every carbon is perfectly "
                "staggered with respect to both neighbours. Sight down "
                "ANY $C-C$ bond of a chair and you see a flawless "
                "chapter-2 Newman projection: gauche ring bonds, "
                "anti hydrogens, dihedral angles of $60^{\\circ}$ "
                "everywhere.\n\n"
                "That double perfection is why the chair is not one "
                "conformation among many but THE conformation: at room "
                "temperature more than $99.9$ percent of cyclohexane "
                "molecules are chairs at any instant. The boat, the "
                "twist-boat, and the half-chair - met properly below - "
                "are not alternatives so much as the toll booths the "
                "molecule passes through on its way between the two "
                "equivalent chairs. Learn to draw the chair correctly "
                "and half of stereochemistry becomes visible; draw "
                "hexagons instead and it stays invisible until the "
                "exam finds you."
            ),
        ),
        ReadingSection(
            id="chair-geometry",
            heading="The two bond worlds: axial and equatorial",
            figure=Figure(
                stem="org1-chair-axeq",
                caption=(
                    "The chair creates two bond environments: six axial bonds parallel to the ring axis, alternating up and down, and six equatorial bonds angled outward around the belt."
                ),
                alt="Schematic cyclohexane chair with vertical axial bonds and outward-angled equatorial bonds drawn in contrasting colours.",
            ),
            body=(
                "Puckering the ring splits its twelve $C-H$ bonds into "
                "two families of six. The AXIAL bonds stand parallel "
                "to the ring's threefold axis - straight up on the "
                "three 'up' carbons, straight down on the three "
                "'down' carbons, alternating around the ring. The "
                "EQUATORIAL bonds point outward around the ring's "
                "waist, each angled slightly up or down opposite to "
                "its carbon's axial partner. Every carbon carries "
                "exactly one of each.\n\n"
                "The drawing rules follow from the geometry and are "
                "worth rehearsing until mechanical. Draw the ring as "
                "two parallel lines offset like a shallow zigzag, "
                "close it with a vee at each end; axial bonds are "
                "VERTICAL strokes - up from the upper-vee carbons, "
                "down from the lower - and each equatorial bond is "
                "drawn PARALLEL to the ring bond one position away, "
                "the detail that makes a chair look right and, more "
                "importantly, makes substituent clashes appear where "
                "they physically are. A methyl drawn axial-up on "
                "carbon 1 sits directly above the ring, staring at "
                "the axial hydrogens on carbons 3 and 5 - the "
                "1,3-diaxial interaction that runs the next chapter. "
                "A methyl drawn equatorial leans away into empty "
                "space. Same carbon, same bond count, radically "
                "different neighbourhoods - the chair's whole "
                "chemical significance lives in that difference."
            ),
        ),
        ReadingSection(
            id="chair-flip",
            heading="The ring flip: one motion, two chairs",
            figure=Figure(
                stem="org1-chair-flip",
                caption=(
                    "The ring-flip energy landscape: chair to half-chair transition state (about 45 kJ/mol), down into the twist-boat (about 23), over the boat (about 30), and out the mirror path to the flipped chair."
                ),
                alt="Energy profile of the cyclohexane ring flip with chair minima at zero, twist-boat intermediates near 23 kJ/mol, boat near 30, and half-chair transition states near 45.",
            ),
            body=(
                "The two possible chairs of cyclohexane are related by "
                "the RING FLIP: push one 'up' carbon down and the "
                "opposite 'down' carbon up, and the ring turns itself "
                "inside out. The flip's single most important "
                "consequence is an exchange of identities: every bond "
                "that was axial becomes equatorial, and every "
                "equatorial bond becomes axial. Up-ness and down-ness "
                "are preserved - an axial-up methyl becomes an "
                "equatorial-up methyl - but the environment changes "
                "completely.\n\n"
                "For cyclohexane itself the two chairs are identical, "
                "so the flip is invisible thermodynamics: "
                "$\\Delta G = 0$, populations $50:50$. But the flip "
                "is fast - the barrier, measured by NMR line-shape "
                "analysis at low temperature, is about $45$ kJ/mol, "
                "which at room temperature means roughly $10^5$ flips "
                "per second per molecule. Cool a sample toward "
                "$-90^{\\circ}C$ and the flip freezes on the NMR "
                "timescale: the single time-averaged $H$ signal "
                "splits into separate axial and equatorial "
                "resonances - one of the classic experiments that "
                "made conformational analysis quantitative, and the "
                "reason we can quote these numbers as measurements "
                "rather than beliefs.\n\n"
                "Once the ring carries a substituent the flip stops "
                "being invisible: it becomes the equilibrium between "
                "an axial conformer and an equatorial conformer, "
                "with $K = e^{-\\Delta G^{\\circ}/RT}$ deciding the "
                "populations. That equilibrium - and the A-values "
                "that tabulate it - is the entire subject of the "
                "next chapter; this chapter's job is the machine "
                "that makes it possible."
            ),
        ),
        ReadingSection(
            id="chair-landscape",
            heading="The full landscape: boat, twist-boat, half-chair",
            table=Table(
                caption="Cyclohexane conformer energies (relative to the chair)",
                columns=("Conformer", "Relative energy (kJ/mol)", "Role"),
                rows=(
                    ("chair", "0", "global minimum - both ideals achieved"),
                    ("twist-boat", "~23", "true intermediate on the flip path"),
                    ("boat", "~30", "transition state between twist-boats"),
                    ("half-chair", "~45", "highest barrier - the flip's summit"),
                ),
                source="Standard conformational-analysis values from NMR line-shape and computational studies as compiled in physical-organic references",
                note="The boat is a saddle point, not a minimum: flagpole clash and eclipsed flanks both relax by twisting.",
            ),
            body=(
                "The flip's path visits every conformer the ring "
                "owns, and each teaches a lesson. The HALF-CHAIR - "
                "four carbons forced briefly coplanar - is the "
                "summit at about $45$ kJ/mol: part angle strain, "
                "part eclipsing, all unavoidable if the ring is to "
                "invert. Descending, the ring lands not in the boat "
                "but in the TWIST-BOAT at about $23$ kJ/mol, a "
                "genuine (if shallow) energy minimum.\n\n"
                "The BOAT itself, at about $30$ kJ/mol, is the most "
                "instructive failure in conformational analysis. It "
                "solves the angle problem - all angles near "
                "tetrahedral - but fails torsionally twice over: "
                "the four carbons of its 'hull' sit perfectly "
                "eclipsed along both flanks, and its two 'prow' "
                "carbons point hydrogens at each other across the "
                "ring - the FLAGPOLE interaction, two $H$ atoms "
                "crowded to about $1.8$ angstroms when their "
                "comfortable van der Waals distance is $2.4$. "
                "Twisting the boat relieves both at once, which is "
                "why the twist-boat is the minimum and the boat "
                "merely the pass between two twist-boats.\n\n"
                "Run the populations to see why none of this "
                "usually matters: at $298$ K, "
                "$K = e^{-23000/(8.314 \\times 298)} \\approx 10^{-4}$ "
                "- about one molecule in ten thousand is a "
                "twist-boat at any instant. But 'usually' has "
                "exceptions worth knowing: fused and bridged "
                "systems can LOCK rings in twist-boat geometries, "
                "and some enzyme active sites bind their sugar "
                "substrates in boat-like shapes precisely to "
                "activate them - strain, once again, spent as "
                "currency rather than suffered as defect."
            ),
        ),
        ReadingSection(
            id="chair-drawing-audit",
            heading="The drawing audit: five checks before you trust a chair",
            body=(
                "Every mis-drawn chair eventually becomes a wrong "
                "stereochemical answer, so audit drawings the way "
                "chapter 3 audited acid-base arguments. One: the "
                "ring outline is two PARALLEL pairs of lines - if "
                "your chair's flanks converge, the axial bonds that "
                "follow will lie. Two: axial bonds are strictly "
                "vertical, alternating up-down-up-down around the "
                "ring; two adjacent axial bonds pointing the same "
                "way is the most common student error and instantly "
                "scrambles every 1,3-diaxial argument. Three: each "
                "equatorial bond is parallel to the ring bond one "
                "position away - eyeball each one against its "
                "partner. Four: up-down character survives the "
                "flip - if your flipped chair moved a substituent "
                "from the top face to the bottom face, you have "
                "drawn a bond-breaking impossibility, not a "
                "conformational change; axial-up must become "
                "equatorial-up, full stop. Five: count - six ring "
                "carbons, one axial and one equatorial per carbon, "
                "twelve substituent positions total.\n\n"
                "The flip audit deserves its own sentence because "
                "it is the one examiners weaponise: conformational "
                "change NEVER changes cis-trans relationships or "
                "configuration, because no bond breaks. If two "
                "groups were both on the top face before the flip, "
                "they are both on the top face after it - what "
                "changed is only which of them stands axial and "
                "which reclines equatorial. Chapter 7.4 builds "
                "cis-trans nomenclature on exactly this "
                "invariance, and every ring problem in ORG2 - "
                "eliminations that demand axial leaving groups, "
                "sugars that prefer all-equatorial chairs - "
                "assumes the audit is automatic."
            ),
        ),
        ReadingSection(
            id="chair-newman-proof",
            heading="Sight down the bonds: the chair in Newman projection",
            body=(
                "The claim that the chair is 'perfectly staggered' "
                "deserves a proof your eyes can run. Pick any $C-C$ "
                "bond of a chair model and sight along it, chapter-2 "
                "style. The front carbon shows its three bonds at "
                "twelve, four, and eight o'clock; the back carbon's "
                "three sit exactly between them - a textbook "
                "staggered array with every dihedral angle at "
                "$60^{\\circ}$. The two ring bonds continuing the "
                "cycle sit GAUCHE to each other ($60^{\\circ}$ "
                "apart), and each carbon's hydrogens land anti and "
                "gauche to their neighbours' - not a single eclipsed "
                "pair anywhere on the ring.\n\n"
                "Now run the same sighting on the boat's flank bonds "
                "and the contrast becomes the lesson: there the "
                "front and back bonds align at $0^{\\circ}$ - "
                "perfect eclipse, four bonds' worth - which is most "
                "of the boat's $30$ kJ/mol right there. The chair is "
                "the ONLY cyclohexane conformation for which every "
                "one of the six $C-C$ sightings returns the "
                "staggered picture, and since chapter 2 priced each "
                "eclipsed bond pair at roughly $4$ kJ/mol, the "
                "torsional ledger closes at zero only for the "
                "chair. Angle ledger zero, torsional ledger zero: "
                "the strain-free number in the combustion table is "
                "not a coincidence but a sum of two zeros you have "
                "now verified bond by bond."
            ),
        ),
        ReadingSection(
            id="chair-diaxial",
            heading="1,3-diaxial interactions: the geometry of the crowd",
            body=(
                "The chair's two bond worlds matter because they "
                "crowd differently, and the crowding has a precise "
                "geometry. Stand a substituent AXIAL on carbon 1 "
                "and it points parallel to the ring axis - directly "
                "over the ring's face, where the axial hydrogens of "
                "carbons 3 and 5 point straight back at it. Those "
                "two contacts are the 1,3-DIAXIAL interactions, and "
                "for a methyl group each one is, geometrically, the "
                "same contact as the gauche-butane interaction of "
                "chapter 2: the methyl and the ring carbon three "
                "bonds away held gauche at close range.\n\n"
                "That identification lets you PRICE the crowding "
                "instead of hand-waving it. Chapter 2 valued one "
                "gauche-butane interaction at about $3.8$ kJ/mol; "
                "an axial methyl suffers exactly two of them "
                "(toward $C3$ and toward $C5$), predicting "
                "$2 \\times 3.8 = 7.6$ kJ/mol of axial penalty - "
                "and the measured equatorial preference of "
                "methylcyclohexane is $7.3$ kJ/mol. A prediction "
                "from an acyclic model system landing within "
                "$0.3$ kJ/mol of the ring measurement is "
                "conformational analysis working exactly as "
                "advertised, and it is why the equatorial "
                "preference GROWS with substituent bulk: the next "
                "chapter's A-values are just this arithmetic run "
                "across the periodic table of substituents."
            ),
        ),
        ReadingSection(
            id="chair-populations",
            heading="Boltzmann does the bookkeeping",
            body=(
                "Every population claim in this chapter is one "
                "equation applied three times. The equilibrium "
                "constant between two conformers separated by "
                "$\\Delta G^{\\circ}$ is "
                "$K = e^{-\\Delta G^{\\circ}/RT}$ with "
                "$R = 8.314$ J/(mol K).\n\n"
                "Chair versus twist-boat at $298$ K: "
                "$\\Delta G^{\\circ} \\approx 23{,}000$ J/mol "
                "gives $K \\approx e^{-9.3} \\approx 10^{-4}$ - "
                "one twist-boat per ten thousand chairs, which is "
                "why drawing cyclohexane as anything but a chair "
                "misrepresents $99.99$ percent of the sample. "
                "Methylcyclohexane equatorial versus axial: "
                "$\\Delta G^{\\circ} = 7{,}300$ J/mol gives "
                "$K = e^{2.95} \\approx 19$, or about $95$ "
                "percent equatorial - a preference, not a law, "
                "with the axial conformer genuinely present and "
                "chemically reachable. And the flip barrier: "
                "$\\Delta G^{\\ddagger} \\approx 45$ kJ/mol "
                "corresponds to roughly $10^5$ flips per second at "
                "room temperature - fast enough that NMR sees only "
                "the time-average, slow enough that cooling to "
                "about $-90^{\\circ}C$ freezes the exchange and "
                "splits the spectrum.\n\n"
                "Notice what the three numbers together teach: "
                "$23$ kJ/mol makes a conformer rare, $7.3$ makes "
                "it merely minor, and $45$ is a barrier crossed a "
                "hundred thousand times a second. Room-temperature "
                "thermal energy ($RT \\approx 2.5$ kJ/mol) is the "
                "yardstick against which all conformational "
                "energies are read."
            ),
        ),
        ReadingSection(
            id="chair-nmr-evidence",
            heading="How we know: the low-temperature NMR experiment",
            body=(
                "The chair story is often taught as geometry, but "
                "it was established as MEASUREMENT, and the "
                "flagship experiment is worth owning. At room "
                "temperature the proton NMR spectrum of "
                "cyclohexane shows a SINGLE sharp line - twelve "
                "hydrogens, one signal - despite the chair "
                "clearly containing two hydrogen environments. "
                "The resolution is kinetic: each hydrogen spends "
                "half its time axial and half equatorial as the "
                "ring flips $10^5$ times per second, and NMR, "
                "whose shutter speed for this chemical-shift "
                "difference is far slower, records only the "
                "average.\n\n"
                "Cool the sample and the flip slows "
                "exponentially; near $-90^{\\circ}C$ the "
                "exchange rate drops below the NMR timescale and "
                "the single line SPLITS into two - separate "
                "axial and equatorial resonances, the two bond "
                "worlds finally photographed apart. From the "
                "temperature at which the lines coalesce, the "
                "flip barrier is extracted: about $45$ kJ/mol, "
                "the number this chapter has been quoting. "
                "Deuterium-substituted cyclohexanes sharpened "
                "the experiment further. The deeper lesson "
                "generalises across chemistry: a single "
                "time-averaged signal never proves a single "
                "structure - it proves either one structure or "
                "fast exchange among several, and only changing "
                "the temperature can tell you which."
            ),
        ),
        ReadingSection(
            id="chair-history",
            heading="From Sachse's ridicule to Barton's Nobel",
            body=(
                "The chair's history is a century-long argument "
                "worth knowing because it explains the vocabulary. "
                "Hermann Sachse proposed puckered strain-free "
                "cyclohexane in 1890, mathematics in hand - and "
                "was ignored, partly because Baeyer's planar "
                "theory was institutionally entrenched and partly "
                "because Sachse's geometric argument outran the "
                "century's experimental reach. Ernst Mohr revived "
                "the puckered ring in 1918, pointing to the "
                "then-new diamond structure - an infinite lattice "
                "of chair cyclohexanes - as nature's own vote.\n\n"
                "Odd Hassel's electron-diffraction work in Oslo "
                "through the 1930s and 1940s made the chair "
                "quantitative fact: gas-phase cyclohexane is a "
                "chair with angles near $111^{\\circ}$, axial "
                "and equatorial bonds distinguishable in the "
                "data. Derek Barton's four-page 1950 paper did "
                "something more consequential: it argued that "
                "REACTIVITY follows conformation - that axial "
                "and equatorial groups on steroid chairs react "
                "at different rates and with different "
                "stereochemistry, predictable from the geometry. "
                "Conformational analysis - the phrase is "
                "Barton's - converted a structural curiosity "
                "into a predictive engine, and the 1969 Nobel "
                "Prize to Barton and Hassel ratified the "
                "conversion. Every A-value argument in the next "
                "chapter is that 1950 paper's methodology, "
                "domesticated."
            ),
        ),
        ReadingSection(
            id="chair-biology",
            heading="The chair in biology: sugars, steroids, cellulose",
            body=(
                "Nature standardised on the chair long before "
                "chemists drew it. Glucose in water exists "
                "overwhelmingly as a six-membered pyranose ring - "
                "a chair - and the reason glucose, of all the "
                "possible hexoses, became biology's central fuel "
                "is conformational: in its beta-pyranose chair, "
                "EVERY substituent - all four hydroxyls and the "
                "hydroxymethyl arm - can stand equatorial "
                "simultaneously. No other aldohexose manages the "
                "all-equatorial chair; glucose is, in this precise "
                "sense, the least strained sugar, the one whose "
                "ring pays no 1,3-diaxial rent.\n\n"
                "Polymerise glucose through equatorial linkages "
                "and you get cellulose: flat ribbons of "
                "all-equatorial chairs, hydrogen-bonded into "
                "sheets rigid enough to hold trees upright. The "
                "alternative alpha-linkage bends the chain into "
                "the helices of starch - digestible energy "
                "storage rather than structural material - so the "
                "axial-equatorial distinction literally separates "
                "wood from bread. Steroids run the same logic at "
                "larger scale: four fused rings whose "
                "trans-fusions LOCK every chair, abolishing the "
                "flip entirely, so that each face and each "
                "position has a fixed, addressable geometry - "
                "which is why steroid receptors can read their "
                "ligands with such precision, and why chapter "
                "7.1's strained beta-lactam and this chapter's "
                "locked steroid chassis are the same theme: "
                "biology engineering with conformational energy."
            ),
        ),
        ReadingSection(
            id="chair-errors",
            heading="The error catalogue: five chair myths",
            body=(
                "Myth one: the ring flip can turn a cis "
                "disubstituted ring into trans. Never - the flip "
                "breaks no bonds and preserves every face "
                "relationship; it exchanges axial with equatorial "
                "and nothing else. Myth two: the boat is the "
                "chair's main alternative. The boat is a "
                "TRANSITION STATE between twist-boats, not a "
                "resting conformer; the actual secondary minimum "
                "is the twist-boat, and even it is a "
                "one-in-ten-thousand visitor at room "
                "temperature.\n\n"
                "Myth three: axial bonds point outward. They "
                "point PARALLEL to the ring axis - up or down - "
                "and it is the equatorial bonds that reach "
                "outward around the belt; mislabeling these "
                "reverses every crowding argument built on them. "
                "Myth four: chairs are static. A chair flips a "
                "hundred thousand times a second at room "
                "temperature; what NMR shows you is the average, "
                "and what a drawing shows you is one frame of a "
                "fast film. Myth five: the flip requires the "
                "ring to pass through the flat Baeyer hexagon. "
                "It never does - the path runs half-chair, "
                "twist-boat, boat, twist-boat, half-chair, with "
                "at most four carbons coplanar at any instant. "
                "Each myth, notice, dies against one of the "
                "chapter's measured numbers - which is the "
                "audit habit worth keeping: when a chair claim "
                "arrives, ask which energy it implies and "
                "whether that energy is on the table above."
            ),
        ),
        ReadingSection(
            id="chair-problems",
            heading="Problem set: four chairs to work",
            body=(
                "Work each before reading its answer. Problem "
                "one: at equilibrium, what fraction of "
                "methylcyclohexane molecules carry the methyl "
                "axial at $298$ K, given "
                "$\\Delta G^{\\circ} = 7.3$ kJ/mol? Answer: "
                "$K = e^{7300/(8.314 \\times 298)} \\approx 19$ "
                "favouring equatorial, so the axial fraction is "
                "$1/(1+19) = 5$ percent - a real, populated "
                "minority.\n\n"
                "Problem two: why does the room-temperature NMR "
                "of methylcyclohexane show one methyl signal, "
                "not two? Answer: the flip interconverts the "
                "axial and equatorial conformers about $10^5$ "
                "times per second, so NMR records the "
                "population-weighted average of the two "
                "environments.\n\n"
                "Problem three: a student's flipped chair shows "
                "a substituent moved from the top face to the "
                "bottom. What error occurred? Answer: an "
                "impossible one - flips preserve up/down "
                "character; the student rotated the drawing or "
                "broke a bond on paper. Axial-up must become "
                "equatorial-up.\n\n"
                "Problem four: estimate the axial penalty for a "
                "substituent suffering two gauche-butane-sized "
                "1,3-diaxial contacts of $3.8$ kJ/mol each, and "
                "name the measured quantity it approximates. "
                "Answer: $7.6$ kJ/mol, approximating the "
                "methyl A-value ($7.3$ measured) - the "
                "next chapter's central number, derived before "
                "it is defined."
            ),
        ),
        ReadingSection(
            id="chair-neighbours",
            heading="The neighbours: why five puckers and seven struggles",
            body=(
                "Setting cyclohexane beside its neighbours sharpens "
                "what the chair achieves. Cyclopentane's planar form "
                "would carry near-perfect angles "
                "($108^{\\circ}$ against the tetrahedral "
                "$109.5^{\\circ}$) - Baeyer's favourite - yet the "
                "molecule still puckers into its envelope and "
                "half-chair shapes, because planarity would eclipse "
                "five bond pairs at once. The pucker sacrifices a "
                "little angle comfort to buy torsional relief, and "
                "the flap of the envelope migrates around the ring "
                "in the pseudorotation met in chapter 7.1 - "
                "constant motion, $26$ kJ/mol of residual strain, "
                "no single resting shape.\n\n"
                "Cycloheptane, one carbon past perfection, has the "
                "opposite problem: enough atoms that no "
                "conformation can stagger every bond AND relax "
                "every angle simultaneously. Its twist-chair "
                "conformers interconvert through a soup of "
                "near-degenerate shapes, and the ring pays about "
                "$26$ kJ/mol for the indecision. Six, then, is not "
                "merely 'big enough' - it is the UNIQUE ring size "
                "whose geometry closes both ledgers at once, "
                "which is why six-membered rings dominate sugar "
                "chemistry, steroid frameworks, and synthetic "
                "targets alike: chemists and evolution both build "
                "preferentially with the one ring that costs "
                "nothing to own."
            ),
        ),
        ReadingSection(
            id="chair-two-chair-ritual",
            heading="The two-chair ritual for substituted rings",
            body=(
                "Every substituted-cyclohexane problem in the "
                "coming chapters yields to one mechanical ritual, "
                "rehearsed here on the machine before the "
                "substituent chapters raise the stakes. Step one: "
                "draw the first chair correctly - parallel "
                "flanks, alternating vertical axials, equatorials "
                "parallel to their next-but-one ring bonds. Step "
                "two: number the ring carbons and place each "
                "substituent, recording BOTH its face (up or "
                "down) and its environment (axial or "
                "equatorial). Step three: draw the second chair - "
                "the flip - by swapping every environment while "
                "keeping every face: axial-up becomes "
                "equatorial-up, equatorial-down becomes "
                "axial-down.\n\n"
                "Step four: audit both drawings against the "
                "chapter's checks; the commonest ritual failure "
                "is a face silently changing during the flip. "
                "Step five: price each chair - count the "
                "1,3-diaxial contacts each axial substituent "
                "suffers, weight by bulk. Step six: declare the "
                "equilibrium winner and estimate how decisively, "
                "using $K = e^{-\\Delta G^{\\circ}/RT}$ with "
                "the tabulated preferences. The ritual is "
                "deliberately dull - dullness is its virtue. "
                "Stereochemistry punishes improvisation, and the "
                "students who lose ring problems lose them at "
                "step three, flipping faces that no conformational "
                "change can flip."
            ),
        ),
        ReadingSection(
            id="chair-reactivity",
            heading="Reactions read the chair: a preview of consequences",
            body=(
                "Conformational analysis earns its keep when "
                "reactivity depends on it, and three previews "
                "show where this chapter's machinery is heading. "
                "First, elimination: the E2 reaction of ORG2 "
                "demands that the departing hydrogen and leaving "
                "group stand ANTI-PERIPLANAR - and on a "
                "cyclohexane that alignment exists only when "
                "BOTH occupy axial positions. A leaving group "
                "locked equatorial cannot eliminate until the "
                "ring flips it axial, so elimination rates on "
                "rings are conformational populations wearing "
                "kinetic clothing.\n\n"
                "Second, oxidation and esterification rates "
                "differ measurably between axial and equatorial "
                "alcohols - crowded axial groups react faster in "
                "reactions that RELIEVE crowding at the "
                "transition state and slower in ones that "
                "increase it, which is precisely the observation "
                "Barton generalised in 1950. Third, the "
                "tert-butyl trick: a tert-butyl group's axial "
                "penalty is so severe (about $20$ kJ/mol, the "
                "next chapter's largest common A-value) that it "
                "functions as a CONFORMATIONAL ANCHOR, holding "
                "itself equatorial and thereby locking every "
                "other position's identity. Chemists install it "
                "deliberately to study a single frozen chair - "
                "strain, once more, used as an instrument rather "
                "than endured as a tax."
            ),
        ),
        ReadingSection(
            id="chair-medium-rings",
            heading="Beyond six: the medium rings and the long escape",
            body=(
                "The chair closes this course's account of small "
                "rings, but the sizes beyond deserve their "
                "paragraph because drug chemistry increasingly "
                "lives there. Rings of eight to eleven carbons - "
                "the MEDIUM rings - are the hardest sizes nature "
                "and synthesis alike must handle: too large for "
                "a single clean chair-like solution, too small "
                "to fold freely, they suffer TRANSANNULAR strain "
                "- hydrogens on opposite sides of the ring "
                "colliding across the middle - plus imperfect "
                "staggering, totalling $40$-plus kJ/mol at "
                "cyclooctane and staying elevated through "
                "eleven. Their conformational landscapes are "
                "soups of near-equal minima, which is why "
                "medium-ring natural products were historic "
                "synthesis challenges.\n\n"
                "Past about twelve carbons the ring escapes: "
                "MACROCYCLES fold like open chains, strain "
                "fading toward zero, each segment locally "
                "zigzag-staggered exactly as chapter 2 taught "
                "for butane. Modern macrocyclic drugs exploit "
                "this - a large ring pre-organises a binding "
                "shape while each local segment relaxes - and "
                "reading their conformations requires nothing "
                "beyond this chapter's tools applied patiently: "
                "angle ledger, torsional ledger, transannular "
                "contacts, Boltzmann weights. The chair is the "
                "special case worth memorising; the method is "
                "the general instrument."
            ),
        ),
        ReadingSection(
            id="chair-closing-audit",
            heading="The four-question conformational audit",
            body=(
                "Close the chapter the way the strain chapter "
                "closed, with a portable audit. Question one: "
                "WHICH CONFORMER - is the species under "
                "discussion a chair, and if a chair, which of "
                "the two, and what stands axial? A mechanism "
                "drawn on an unspecified ring conformation is "
                "a mechanism not yet drawn. Question two: WHAT "
                "ENERGY - which of the chapter's numbers backs "
                "the claim: $23$ for twist-boat, $30$ for boat, "
                "$45$ for the flip barrier, $7.3$ for an axial "
                "methyl? Claims without an energy attached are "
                "opinions.\n\n"
                "Question three: WHAT POPULATION - run "
                "$K = e^{-\\Delta G^{\\circ}/RT}$ and ask "
                "whether the minor conformer matters at the "
                "temperature in question; five percent axial "
                "methylcyclohexane is ignorable for "
                "thermodynamics and decisive for an E2 that "
                "only the axial conformer can perform. Question "
                "four: WHAT EVIDENCE - could low-temperature "
                "NMR, diffraction, or a locked model compound "
                "distinguish your claim from its rival? The "
                "audit is short, but it is the whole discipline "
                "in miniature: name the shape, price it, weight "
                "it, and know how you would catch yourself "
                "being wrong. Chapters 7.3 and 7.4 assume it "
                "runs automatically.\n\n"
                "A last calibration, because students routinely "
                "over-trust drawings at exactly this point: a "
                "chair on paper is a claim about a dynamic "
                "ensemble, not a photograph of a static object. "
                "When a later chapter asserts that a reaction "
                "'requires the axial conformer,' translate it "
                "through this chapter's numbers - the molecule "
                "visits that conformer thousands of times per "
                "second, pays $7$ to $20$ kJ/mol of rent while "
                "there, and reacts only during those visits. "
                "Rate, population, and barrier stay separate "
                "ideas; conflating them is the field's oldest "
                "trap, and the audit above exists to keep the "
                "three ledgers distinct."
            ),
        ),
        ReadingSection(
            id="chair-model-hands",
            heading="Build it once: why models beat drawings",
            body=(
                "One practical instruction outperforms every "
                "paragraph above: build a cyclohexane from a model "
                "kit, once, with your own hands. Flip it slowly and "
                "FEEL the half-chair resist - the barrier is "
                "palpable as the frame fights four coplanar "
                "carbons. Watch an axial marker become equatorial "
                "without ever crossing to the other face; the "
                "flip's central invariance stops being a rule to "
                "memorise and becomes something your hands know. "
                "Sight down each bond and confirm the staggered "
                "Newman picture the chapter promised; park the "
                "model in a boat and watch the flagpole hydrogens "
                "touch.\n\n"
                "Students who skip the model reliably make the "
                "face-flipping error under exam pressure, because "
                "a two-dimensional drawing lets impossible moves "
                "look plausible; the model simply refuses them. "
                "Ten minutes of handling buys what re-reading "
                "cannot: the chair as an OBJECT with mechanics, "
                "not a hexagon with decorations. Every ring "
                "argument for the rest of this course - A-values, "
                "cis-trans preferences, locked steroid decks, "
                "axial-only eliminations - assumes the object, "
                "and the assumption is cheap to satisfy. Build "
                "it once; the intuition amortises over hundreds "
                "of problems across this course, the MCAT "
                "organic sections, and every synthesis you will "
                "ever plan on a six-membered ring."
            ),
        ),
    ),
    key_takeaways=(
        "The chair achieves tetrahedral angles and perfect staggering simultaneously - the only cycloalkane conformation with zero strain, and over 99.9 percent of cyclohexane at equilibrium.",
        "Puckering splits the twelve C-H bonds into six vertical axial bonds (alternating up/down) and six outward equatorial bonds - one of each per carbon.",
        "The ring flip (~45 kJ/mol barrier, ~100,000 per second at room temperature) exchanges axial and equatorial identities while preserving up/down face relationships.",
        "The landscape between chairs: twist-boat ~23 kJ/mol (true intermediate), boat ~30 (flagpole clash + eclipsed flanks, a saddle point), half-chair ~45 (the summit).",
        "Audit every chair: parallel flanks, strictly vertical alternating axials, equatorials parallel to the next-but-one ring bond, faces preserved through the flip.",
    ),
))


# --------------------------------------------------------------------------
# 7.3 Substituted cyclohexanes and A-values
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.AVALUES",
    lead=(
        "Put one substituent on a cyclohexane and the two chairs stop "
        "being equal: one parks the group equatorial, the other forces "
        "it axial, and the energy gap between them - the A-VALUE - is "
        "the most useful single number in conformational analysis. This "
        "chapter defines it, shows how it is measured, prices the "
        "common substituents, explains the sizes (including the halogen "
        "surprise and the tert-butyl catastrophe), and runs the "
        "Boltzmann arithmetic that turns each A-value into a "
        "population you can bet reactions on."
    ),
    sections=(
        ReadingSection(
            id="av-definition",
            heading="Defining the A-value: one number per substituent",
            body=(
                "A monosubstituted cyclohexane lives in a two-state "
                "equilibrium: the chair with the substituent "
                "EQUATORIAL and the flipped chair with it AXIAL. The "
                "A-value of a substituent is the free-energy "
                "difference between those two chairs - "
                "$A = \\Delta G^{\\circ}_{ax \\rightarrow eq}$ - "
                "quoted as a positive number when equatorial wins, "
                "which for ordinary substituents it always does. An "
                "A-value of $7.3$ kJ/mol for methyl means the "
                "axial-methyl chair sits $7.3$ kJ/mol above the "
                "equatorial-methyl chair, nothing more and nothing "
                "less.\n\n"
                "Three properties make the number so useful. It is "
                "PER SUBSTITUENT: measured once on the "
                "monosubstituted ring, then reused everywhere. It is "
                "approximately ADDITIVE: a ring carrying several "
                "groups can be priced chair by chair by summing the "
                "A-values of whatever stands axial, a bookkeeping "
                "rule the next chapter's cis-trans arguments run "
                "on. And it is THERMODYNAMIC, not kinetic: an "
                "A-value says which chair is favoured and by how "
                "much at equilibrium - it says nothing directly "
                "about how fast the flip runs (that is the "
                "45-kJ/mol barrier of chapter 7.2, unchanged by "
                "the substituent to first approximation) or about "
                "which conformer reacts faster, a distinction "
                "the Curtin-Hammett section below sharpens."
            ),
        ),
        ReadingSection(
            id="av-table",
            heading="The pricing table, with populations attached",
            figure=Figure(
                stem="org1-a-values",
                caption=(
                    "A-values for common substituents: halogens cheap despite their size, alkyl groups clustered near 7-9 kJ/mol, and tert-butyl in a class of its own near 20."
                ),
                alt="Bar chart of A-values in kJ per mole for F, Br, Cl, OMe, OH, Me, Et, iPr, Ph and tBu.",
            ),
            table=Table(
                caption="A-values and computed equatorial populations at 298 K",
                columns=("Substituent", "A-value (kJ/mol)", "% equatorial (298 K, computed)"),
                rows=(
                    ("F", "1.0", "60"),
                    ("Br", "1.6", "66"),
                    ("Cl", "1.8", "67"),
                    ("OCH3", "2.5", "73"),
                    ("OH", "~3.5 (solvent-dependent)", "80"),
                    ("CH3", "7.3", "95"),
                    ("CH2CH3", "7.5", "95"),
                    ("CH(CH3)2", "9.0", "97"),
                    ("C6H5", "11.7", "99"),
                    ("C(CH3)3", "~20", ">99.9"),
                ),
                source="A-values from standard conformational-analysis compilations (Eliel-type tables); populations computed from K = exp(A/RT) at 298 K",
                note="OH spans roughly 2.2-4.2 kJ/mol across solvents - hydrogen bonding changes its effective size.",
            ),
            body=(
                "Each population column entry is one line of "
                "arithmetic, and the arithmetic is the skill: "
                "$K = e^{A/RT}$, then "
                "$\\%_{eq} = 100 \\, K/(1+K)$. For methyl, "
                "$K = e^{7300/(8.314 \\times 298)} = e^{2.95} "
                "\\approx 19$, giving $95$ percent equatorial - "
                "the number quoted, not memorised, in chapter "
                "7.2. For chlorine the same computation gives "
                "$K \\approx 2.1$ and only $67$ percent: a "
                "chlorocyclohexane sample is one-third "
                "axial at any instant, a fact NMR confirms "
                "directly at low temperature.\n\n"
                "Read the table's SHAPE before its entries: a "
                "cluster of cheap halogens and oxygens below "
                "$4$ kJ/mol, an alkyl shelf at $7$ to $9$, "
                "phenyl at $11.7$, and tert-butyl alone near "
                "$20$. The rest of the chapter explains that "
                "shape feature by feature, because the shape - "
                "not the digits - is what transfers to "
                "substituents you have never met."
            ),
        ),
        ReadingSection(
            id="av-measurement",
            heading="How A-values are measured",
            body=(
                "The numbers come from experiments worth knowing. "
                "The direct route is LOW-TEMPERATURE NMR: cool a "
                "monosubstituted cyclohexane until the ring flip "
                "is slow on the NMR timescale (chapter 7.2's "
                "freezing experiment), and the axial and "
                "equatorial conformers appear as separate signal "
                "sets whose INTEGRALS are the populations; "
                "$\\Delta G^{\\circ} = -RT \\ln K$ converts "
                "the ratio to the A-value at that temperature.\n\n"
                "The classical indirect route uses ANANCOMERIC - "
                "conformationally locked - model compounds. "
                "Install a tert-butyl group elsewhere on the "
                "ring: its enormous equatorial preference holds "
                "the whole chair still, so a second substituent "
                "can be prepared in a purely axial or purely "
                "equatorial version (as cis or trans isomers - "
                "next chapter's vocabulary). Comparing the two "
                "locked compounds - by equilibration with a "
                "catalyst, by heats of combustion, by reaction "
                "rates - yields the axial-equatorial energy "
                "difference without ever needing to freeze a "
                "flip. The two routes agree well, which is why "
                "the table's values are quoted with confidence; "
                "where they drift (OH across solvents) the drift "
                "itself is data, pointing at hydrogen bonding "
                "as part of the effective size of a group."
            ),
        ),
        ReadingSection(
            id="av-origin",
            heading="Where the number comes from: counting gauche contacts",
            body=(
                "Chapter 7.2 derived the methyl A-value before "
                "defining it: an axial substituent on carbon 1 "
                "makes two 1,3-diaxial contacts, one each toward "
                "the axial hydrogens on carbons 3 and 5, and for "
                "methyl each contact is geometrically a "
                "gauche-butane interaction worth about $3.8$ "
                "kJ/mol - predicting $7.6$, measuring $7.3$. "
                "That model now explains the alkyl shelf. "
                "ETHYL's A-value ($7.5$) is barely above "
                "methyl's, because the ethyl group can ROTATE "
                "its terminal methyl away from the ring: the "
                "contact that matters still involves essentially "
                "one $CH_2$, and free rotation lets the group "
                "present its slim profile. ISOPROPYL ($9.0$) "
                "still has one hydrogen to point at the ring, so "
                "it pays only modestly more.\n\n"
                "TERT-BUTYL has no escape: every rotation "
                "presents a methyl to the 1,3-diaxial "
                "hydrogens, and the penalty jumps to roughly "
                "$20$ kJ/mol - not a bigger number in the same "
                "series so much as a different regime, in which "
                "the axial conformer is effectively abolished "
                "(under one molecule in a thousand). This is "
                "the quantitative basis of the anancomeric "
                "anchor above, and the reason 'tert-butyl "
                "locks the ring' is a laboratory tool rather "
                "than a metaphor. The general lesson: A-values "
                "measure the size a group presents TOWARD THE "
                "RING FACE, minimised over its internal "
                "rotations - effective steric bulk, not van "
                "der Waals volume."
            ),
        ),
        ReadingSection(
            id="av-halogens",
            heading="The halogen surprise: big atoms, small A-values",
            body=(
                "Bromine is bigger than fluorine by any measure "
                "of atomic size, yet their A-values are nearly "
                "the same ($1.6$ versus $1.0$ kJ/mol) and both "
                "are far below methyl's - chlorocyclohexane is "
                "a third axial at room temperature while "
                "methylcyclohexane is one-twentieth. The "
                "resolution is bond length. The $C-Br$ bond "
                "($1.94$ angstroms) is much longer than $C-C$ "
                "($1.54$), so an axial bromine is held FARTHER "
                "from the 1,3-diaxial hydrogens; distance "
                "dilutes the contact faster than atomic radius "
                "concentrates it, and the net crowding stays "
                "mild. Down the halogen column, increasing "
                "size and increasing bond length nearly "
                "cancel - which is why F, Cl, and Br cluster "
                "within a kilojoule of each other.\n\n"
                "The teaching point generalises: steric "
                "arguments must be made about DISTANCES, not "
                "atom sizes read off the periodic table. The "
                "same logic explains why OH and OCH3 are "
                "cheap ($2.5$ to $3.5$): the oxygen presents "
                "lone pairs, not hydrogens, toward the ring, "
                "and the group's substituents point away. And "
                "it warns against a common exam reflex - "
                "ranking axial penalties by molecular weight. "
                "The A-value table orders by effective reach "
                "toward the ring face, and only the arithmetic "
                "of geometry, never the mass, predicts it."
            ),
        ),
        ReadingSection(
            id="av-populations",
            heading="From energy to population: the saturation curve",
            figure=Figure(
                stem="org1-axeq-populations",
                caption=(
                    "Equatorial population versus A-value at 298 K, computed from K = exp(A/RT): steep through the first few kJ/mol, saturating past ten - why chlorine is a real mixture and tert-butyl is a lock."
                ),
                alt="Curve of percent equatorial against A-value with Cl, OH, Me, Ph and tBu marked, rising steeply then saturating toward 100 percent.",
            ),
            body=(
                "Plot the population equation across the whole "
                "A-value range and a shape appears that is worth "
                "internalising: STEEP at first, SATURATING "
                "later. Between $0$ and about $5$ kJ/mol, each "
                "kilojoule moves the population dramatically - "
                "from $50$ percent at zero to $80$ percent at "
                "$3.5$ - because $RT$ at room temperature is "
                "$2.5$ kJ/mol and energies of a few $RT$ are "
                "exactly where Boltzmann statistics act "
                "fastest. Past $10$ kJ/mol the curve flattens: "
                "phenyl at $11.7$ is $99$ percent equatorial "
                "and tert-butyl's extra $8$ kJ/mol buys less "
                "than one further percentage point.\n\n"
                "The curve disciplines chemical intuition in "
                "both directions. Small energy differences are "
                "not negligible - $2$ kJ/mol is a $69:31$ "
                "split, easily visible in spectra and product "
                "ratios. And large ones are not infinitely "
                "large - even tert-butyl's lock leaves a "
                "0.03-percent axial population, which matters "
                "whenever the MINOR conformer is the reactive "
                "one, the situation the next section names. "
                "Reading energies through the curve, rather "
                "than as bare numbers, is the habit that "
                "separates conformational analysis from "
                "conformational trivia."
            ),
        ),
        ReadingSection(
            id="av-curtin-hammett",
            heading="Curtin-Hammett: populations are not fates",
            body=(
                "A-values describe equilibrium populations, and "
                "the flip between conformers is fast "
                "($10^5$ per second against barriers of "
                "$45$ kJ/mol). When a REACTION consumes one "
                "conformer, that speed matters enormously: if "
                "flipping is much faster than reacting, the "
                "conformers stay equilibrated throughout, and "
                "the product ratio is set NOT by which "
                "conformer is more populated but by the "
                "difference in transition-state energies - the "
                "CURTIN-HAMMETT principle. A minor conformer "
                "with an accessible transition state can "
                "deliver the major product.\n\n"
                "The classic ring example, developed fully "
                "with the E2 reaction in ORG2, is worth "
                "sketching now: some eliminations require the "
                "leaving group AXIAL, and a substrate that is "
                "$95$ percent equatorial still reacts entirely "
                "through its $5$ percent axial conformer - at "
                "a rate discounted by the cost of getting "
                "there, but with stereochemistry dictated by "
                "the axial geometry. The practical protocol: "
                "use A-values to compute populations; use "
                "populations plus the conformational "
                "requirement of the mechanism to reason about "
                "rates and products; and never read 'mostly "
                "equatorial' as 'reacts equatorial.' Locked "
                "rings - tert-butyl anchors, trans-fused "
                "decalins, steroids - are precisely the "
                "systems where population and fate coincide, "
                "which is why they were the proving grounds "
                "of conformational analysis."
            ),
        ),
        ReadingSection(
            id="av-additivity",
            heading="Additivity and its limits",
            body=(
                "For rings carrying several substituents, the "
                "working rule is ADDITIVITY: price each chair "
                "by summing the A-values of every group that "
                "stands axial in it, then compare chairs. A "
                "chair with an axial methyl and an axial "
                "chlorine costs about $7.3 + 1.8 = 9.1$ "
                "kJ/mol against the all-equatorial "
                "alternative; the equilibrium constant follows "
                "from the same Boltzmann line as always. The "
                "next chapter leans on this rule for every "
                "cis-trans stability verdict, and within a "
                "kilojoule or two it is reliable.\n\n"
                "Its limits are instructive rather than "
                "disqualifying. Substituents on ADJACENT "
                "carbons interact directly - two equatorial "
                "groups on carbons 1 and 2 sit gauche to each "
                "other around the ring bond, so the "
                "all-equatorial chair of trans-1,2-"
                "dimethylcyclohexane carries a residual "
                "gauche interaction the simple sum ignores. "
                "Very large groups distort the ring itself, "
                "flattening it toward twist-boat rather than "
                "paying an impossible diaxial bill - two "
                "syn-diaxial tert-butyls is a geometry the "
                "chair simply refuses. And polar substituents "
                "add electrostatics: adjacent $C-X$ dipoles "
                "and hydrogen bonds can override a kilojoule "
                "of sterics, the effect behind sugar "
                "chemistry's anomeric preferences flagged in "
                "the biology section. Use additivity as the "
                "default, and audit it when groups are "
                "adjacent, enormous, or polar."
            ),
        ),
        ReadingSection(
            id="av-applications",
            heading="A-values at work: menthol, glucose, drug scaffolds",
            body=(
                "Three applications show the table earning its "
                "keep. MENTHOL - the mint terpene - carries "
                "three substituents (methyl, isopropyl, "
                "hydroxyl) on one cyclohexane, and its "
                "natural diastereomer is the one that can "
                "stand ALL THREE equatorial: sum the A-values "
                "and the all-equatorial chair wins by over "
                "$19$ kJ/mol, which is why menthol's ring is "
                "conformationally honest and its reactions "
                "predictable. Its diastereomers, forced to "
                "keep a group axial, differ in odour, melting "
                "point, and reactivity - diastereomers being "
                "next chapter's subject, priced with this "
                "chapter's numbers.\n\n"
                "GLUCOSE repeats the story with oxygens: "
                "chapter 7.2 noted that beta-glucopyranose "
                "alone among the hexoses stands every "
                "substituent equatorial; summing OH-type "
                "A-values makes the preference quantitative, "
                "with one famous exception - at the anomeric "
                "carbon, electronic effects (developed with "
                "carbohydrates in ORG2) partly offset the "
                "steric preference, a named reminder that "
                "additivity has an electronic audit. And in "
                "MEDICINAL CHEMISTRY, cyclohexane and "
                "piperidine chairs are among the commonest "
                "drug scaffolds: designers place substituents "
                "to hold binding groups equatorial or lock "
                "conformations with anchors, spending "
                "A-value logic on molecules the original "
                "conformational analysts never imagined."
            ),
        ),
        ReadingSection(
            id="av-errors",
            heading="The error catalogue: four A-value traps",
            body=(
                "Trap one: ranking by atomic size. Bromine "
                "outweighs methyl fourfold and its A-value is "
                "a quarter of methyl's - bond length dilutes "
                "crowding, and only the geometric arithmetic "
                "predicts the order. Trap two: treating "
                "populations as verdicts. Ninety-five percent "
                "equatorial does not mean reactions go through "
                "the equatorial conformer - Curtin-Hammett "
                "routes fast-flipping systems through "
                "whichever conformer's transition state lies "
                "lower, however rare that conformer is.\n\n"
                "Trap three: forgetting temperature. A-values "
                "are free energies; the POPULATION they imply "
                "depends on $RT$. Cooling sharpens "
                "preferences (the low-temperature NMR "
                "experiment relies on it) and heating "
                "flattens them - a $2$ kJ/mol preference "
                "that reads $69:31$ at room temperature is "
                "nearly $50:50$ at combustion temperatures. "
                "Trap four: summing blindly. Additivity "
                "fails exactly where the previous section "
                "said - adjacent groups, giant groups, polar "
                "groups - and the anomeric effect is the "
                "canonical electronic override. Each trap, "
                "as ever, dies against a number: when an "
                "A-value claim arrives, recompute the "
                "population, check the geometry, and ask "
                "what the mechanism requires before "
                "believing the conclusion."
            ),
        ),
        ReadingSection(
            id="av-problems",
            heading="Problem set: four computations",
            body=(
                "Problem one: from the table, compute the "
                "axial population of chlorocyclohexane at "
                "$298$ K. Answer: $K = e^{1800/2478} = "
                "e^{0.727} \\approx 2.1$, so axial fraction "
                "$= 1/(1+2.1) \\approx 32$ percent - "
                "chlorine rings are genuine mixtures.\n\n"
                "Problem two: why is ethyl's A-value ($7.5$) "
                "barely larger than methyl's ($7.3$) when "
                "ethyl is twice the size? Answer: internal "
                "rotation lets ethyl point its terminal "
                "methyl away from the ring, presenting a "
                "methyl-sized profile to the 1,3-diaxial "
                "contacts; A-values measure presented bulk, "
                "not total bulk.\n\n"
                "Problem three: a ring bears an axial methyl "
                "and an axial chlorine in one chair, both "
                "equatorial in the other. Estimate the "
                "equilibrium at $298$ K. Answer: cost "
                "$\\approx 7.3 + 1.8 = 9.1$ kJ/mol, "
                "$K = e^{9100/2478} \\approx 39$ - about "
                "$97.5$ percent in the diequatorial chair.\n\n"
                "Problem four: an elimination requires its "
                "leaving group axial, and the substrate's "
                "A-value analysis says $95$ percent "
                "equatorial. Does the reaction fail? Answer: "
                "no - the flip repopulates the axial "
                "conformer $10^5$ times per second, and "
                "Curtin-Hammett lets the reaction drain "
                "through it; the population cost appears as "
                "a rate factor, not a roadblock."
            ),
        ),
        ReadingSection(
            id="av-closing",
            heading="The A-value audit",
            body=(
                "Close with the chapter's portable checklist. "
                "When a substituted-ring question arrives: "
                "FIRST, draw both chairs with the ritual of "
                "chapter 7.2, faces preserved, and list what "
                "stands axial in each. SECOND, price both "
                "chairs by summing A-values from the table, "
                "flagging the additivity audits - adjacent, "
                "enormous, or polar groups. THIRD, convert "
                "the difference to a population through "
                "$K = e^{\\Delta G^{\\circ}/RT}$ and say "
                "the ratio out loud - $95:5$ argues "
                "differently than $99.97:0.03$. FOURTH, ask "
                "what the chemistry in question actually "
                "requires: an equilibrium property follows "
                "the population, but a reaction follows "
                "Curtin-Hammett through whichever conformer "
                "its mechanism demands.\n\n"
                "The audit is four lines of arithmetic on "
                "one table of measured numbers, and it "
                "settles questions that hand-waving about "
                "'bulky groups' never can. The next chapter "
                "adds the last layer this unit needs: two "
                "substituents whose FACES are fixed relative "
                "to each other - cis and trans isomers - "
                "where the same four lines decide not just "
                "which chair wins but which COMPOUND is more "
                "stable, and where the distinction between "
                "conformers and isomers becomes the whole "
                "point."
            ),
        ),
        ReadingSection(
            id="av-nmr-worked",
            heading="A worked measurement: integrals to energies",
            body=(
                "Run one measurement end to end so the table's "
                "numbers feel earned. Chlorocyclohexane is cooled "
                "until the ring flip freezes on the NMR timescale; "
                "the carbon bearing chlorine now shows two "
                "distinct signals, one for the "
                "equatorial-chlorine chair and one for the axial. "
                "Suppose the integrals come out $2.1$ to $1$ in "
                "favour of equatorial - the population ratio "
                "directly, no inference required. The free-energy "
                "difference follows from one line: "
                "$\\Delta G^{\\circ} = -RT \\ln K$, and at the "
                "measurement temperature the arithmetic returns "
                "the tabulated $1.8$ kJ/mol within experimental "
                "error.\n\n"
                "The exercise teaches three habits. Integrals "
                "are populations, so the raw data IS the "
                "equilibrium constant - a rare directness in "
                "physical measurement. The temperature of the "
                "measurement matters and is always reported, "
                "because $K$ changes with $T$ even though "
                "$\\Delta G^{\\circ}$ changes only slowly. And "
                "the assignment of which signal is which rests "
                "on chemical-shift arguments - axial and "
                "equatorial protons and carbons differ "
                "systematically - that were themselves "
                "calibrated on anancomerically locked model "
                "compounds. Measurement, model, and arithmetic "
                "interlock; no single leg stands alone, which "
                "is exactly what makes the resulting table "
                "trustworthy enough to build two further "
                "chapters on."
            ),
        ),
        ReadingSection(
            id="av-history",
            heading="From steroid puzzles to a quantitative table",
            body=(
                "The A-value table is young science: it dates "
                "from the 1950s, when Barton's demonstration "
                "that steroid reactivity follows conformation "
                "(chapter 7.2's history) created sudden demand "
                "for NUMBERS. Winstein and Holness supplied the "
                "method in 1955 - the tert-butyl anchor and the "
                "kinetic comparison of locked axial versus "
                "locked equatorial substrates - and the "
                "vocabulary: their paper coined 'anancomeric' "
                "thinking even before the word existed, and the "
                "A-value symbol itself. Eliel's school then "
                "spent two decades refining the table with "
                "equilibration and NMR methods, publishing the "
                "compilations every textbook now quotes.\n\n"
                "The history matters for a practical reason: "
                "different methods probe slightly different "
                "quantities - kinetic comparisons assume the "
                "anchor is innocent, equilibrations assume the "
                "catalyst reaches true equilibrium, NMR "
                "assumes correct signal assignment - and the "
                "small disagreements among published A-values "
                "(the OH range in the table, the tert-butyl "
                "tilde) are the residue of those assumptions, "
                "not sloppiness. Quoting an A-value to three "
                "decimal places would claim more than the "
                "field knows; quoting the shelf structure - "
                "halogens near 2, alkyls near 8, tert-butyl "
                "near 20 - claims exactly what half a century "
                "of cross-checked measurement supports."
            ),
        ),
        ReadingSection(
            id="av-solvent",
            heading="Solvent, dipoles, and the mobile OH entry",
            body=(
                "One table entry refuses to sit still: hydroxyl "
                "spans roughly $2.2$ to $4.2$ kJ/mol depending "
                "on solvent, and the reason illuminates what "
                "A-values actually measure. An axial OH on a "
                "chair points over the ring face, where it can "
                "form a weak intramolecular contact with the "
                "1,3-diaxial hydrogens - but more importantly, "
                "its hydrogen-bonding to SOLVENT differs "
                "between the two sites. In aprotic solvents "
                "the group is compact and the A-value sits "
                "near the low end; in hydrogen-bonding "
                "solvents the effective size grows as the "
                "solvation shell travels with the group, and "
                "the equatorial preference strengthens.\n\n"
                "The generalisation: an A-value is a FREE "
                "energy in a medium, not a property of the "
                "isolated molecule. Sterics dominate for "
                "hydrocarbons, so methyl's $7.3$ transfers "
                "cleanly across solvents; polar groups carry "
                "electrostatics and solvation with them, so "
                "their entries travel with the medium. "
                "Adjacent polar substituents add dipole-dipole "
                "terms the steric sum never sees - the "
                "anomeric effect being the celebrated case - "
                "and careful workers therefore quote solvent "
                "and temperature beside any polar-group "
                "A-value. For this course's purposes: use the "
                "table's central values, and treat polar-group "
                "predictions within a kilojoule as ties to be "
                "settled by experiment, not asserted."
            ),
        ),
        ReadingSection(
            id="av-heterorings",
            heading="Heteroatom rings: piperidine, THP, and shifted contacts",
            body=(
                "Replace a ring $CH_2$ with an oxygen or an "
                "N-H and the chair machinery survives intact - "
                "tetrahydropyran and piperidine both adopt "
                "chairs with axial and equatorial positions - "
                "but the PRICING shifts, because the "
                "1,3-diaxial contacts change. A $C-O$ bond "
                "($1.43$ angstroms) is shorter than $C-C$, "
                "pulling ring atoms closer; an oxygen carries "
                "lone pairs where a $CH_2$ carried hydrogens, "
                "removing two of the contacts an axial "
                "substituent would have suffered. The net "
                "result: A-values measured on cyclohexane "
                "transfer only approximately to heterocycles, "
                "and substituents adjacent to the heteroatom "
                "feel electronic effects (the anomeric effect "
                "chief among them) that can INVERT the "
                "steric preference outright.\n\n"
                "Piperidine adds a subtlety with its N-H: "
                "the hydrogen on nitrogen itself has an "
                "axial-equatorial choice, and decades of "
                "argument - resolved by careful spectroscopy "
                "in favour of a modest equatorial preference - "
                "taught the field how delicate sub-kilojoule "
                "conformational claims are. For this course "
                "the portable rules are two: heteroatom "
                "chairs obey the same geometry and the same "
                "Boltzmann arithmetic, and their numbers "
                "must be measured on the heterocycle itself "
                "rather than borrowed uncritically - a "
                "warning that becomes central when the sugar "
                "chapters price pyranose rings, where both "
                "corrections operate at once."
            ),
        ),
        ReadingSection(
            id="av-temperature",
            heading="Temperature as a dial: the same A-value, different worlds",
            body=(
                "Because populations follow "
                "$K = e^{A/RT}$, temperature is a dial that "
                "re-reads the whole table without changing a "
                "single entry. Take methyl's $7.3$ kJ/mol "
                "across three temperatures. At $200$ K "
                "(dry-ice territory): "
                "$K = e^{7300/(8.314 \\times 200)} = e^{4.39} "
                "\\approx 81$ - the axial conformer falls "
                "near one percent, and low-temperature "
                "spectra look almost anancomeric. At $298$ K: "
                "the familiar $19$ and $95$ percent. At "
                "$400$ K: $K = e^{2.20} \\approx 9$, and the "
                "axial population has doubled to ten "
                "percent - preferences soften as thermal "
                "energy rises toward the gap.\n\n"
                "Two working consequences follow. Reactions "
                "run hot sample MORE of the minor "
                "conformer - relevant whenever an "
                "axial-demanding mechanism competes - so "
                "raising temperature can change "
                "stereochemical outcomes for conformational "
                "reasons alone, before any activation "
                "argument enters. And spectra run cold "
                "SHARPEN populations toward the favoured "
                "chair, which is why variable-temperature "
                "NMR is conformational analysis's native "
                "instrument: sweep the dial and the "
                "equilibrium, the barrier, and the "
                "assignment all reveal themselves in one "
                "experiment. The A-value stays fixed; the "
                "world it describes moves with $RT$."
            ),
        ),
        ReadingSection(
            id="av-vocabulary",
            heading="The vocabulary shelf: five terms that carry the unit",
            body=(
                "This chapter mints vocabulary the rest of the "
                "course spends, so shelve the definitions "
                "cleanly. A-VALUE: the equatorial-minus-axial "
                "free-energy difference for one substituent on "
                "cyclohexane, positive when equatorial wins. "
                "1,3-DIAXIAL INTERACTION: the contact between "
                "an axial substituent and the axial hydrogens "
                "(or groups) two carbons away on the same "
                "face - the physical origin of nearly every "
                "A-value. ANANCOMERIC: conformationally "
                "locked, usually by a tert-butyl anchor, so "
                "that one chair describes the whole "
                "population.\n\n"
                "CURTIN-HAMMETT CONDITIONS: conformers "
                "interconverting much faster than they "
                "react, so product ratios follow "
                "transition-state energies rather than "
                "ground-state populations. ADDITIVITY: the "
                "working rule that a chair's cost is the sum "
                "of its axial substituents' A-values, "
                "audited for adjacent, enormous, and polar "
                "groups. Say each term with its number "
                "attached - methyl $7.3$, the flip's "
                "$45$-kJ/mol barrier, $RT$'s $2.5$ at room "
                "temperature - and the vocabulary stays "
                "quantitative instead of decorative. The "
                "next chapter adds cis, trans, and "
                "diastereomer to the shelf, and prices them "
                "with exactly these tools."
            ),
        ),
        ReadingSection(
            id="av-bridge",
            heading="The bridge to cis and trans",
            body=(
                "Everything so far concerned ONE substituent "
                "choosing between two chairs of the SAME "
                "compound. The final chapter of this unit "
                "adds the twist that turns conformational "
                "analysis into stereochemistry: put TWO "
                "substituents on the ring and their face "
                "relationship - same face or opposite - is "
                "fixed at synthesis, unchangeable by any "
                "flip, because chapter 7.2 proved the flip "
                "preserves faces. Cis and trans are "
                "therefore different COMPOUNDS, separable "
                "and distinct, each of which still owns two "
                "chairs priced by this chapter's table.\n\n"
                "The analysis that results is a two-layer "
                "audit run in a fixed order: FIRST the "
                "configurational layer - which isomer is "
                "this, cis or trans, decided by faces - and "
                "SECOND the conformational layer - which "
                "chair does this isomer prefer, decided by "
                "summed A-values. Confusing the layers is "
                "the unit's most damaging error, and the "
                "next chapter's whole design is to make the "
                "order automatic: faces first, chairs "
                "second, energies last. With the A-value "
                "table in hand you already own every number "
                "the verdicts will need; what remains is "
                "the bookkeeping of which isomer can put "
                "which groups equatorial, and that - the "
                "1,2 / 1,3 / 1,4 alternation - is one "
                "geometric fact away."
            ),
        ),
        ReadingSection(
            id="av-limits-of-model",
            heading="What the gauche model leaves out - and why it still wins",
            body=(
                "The counting model - two gauche-butane contacts "
                "per axial group - is deliberately simple, and "
                "its omissions deserve naming. It ignores the "
                "small distortions a real ring makes to relieve "
                "an axial group: bond angles open a degree or "
                "two, the chair flattens slightly, and the "
                "actual penalty lands a little below the rigid "
                "prediction - one reason methyl measures $7.3$ "
                "against the modelled $7.6$. It treats contacts "
                "pairwise, though three-body crowding matters "
                "for the largest groups. And it says nothing "
                "about electrostatics, which the polar-group "
                "sections above had to add by hand.\n\n"
                "Modern computation can do better in every "
                "respect - density-functional conformer "
                "energies reproduce the table to fractions of "
                "a kilojoule - and yet the counting model "
                "remains the working instrument, for the "
                "reason simple models always win in trained "
                "hands: it is auditable at the speed of "
                "thought. A chemist who can count diaxial "
                "contacts on a drawn chair catches errors "
                "computation would only confirm hours later, "
                "and knows WHICH corrections matter before "
                "asking the computer to evaluate them. Learn "
                "the model as the first draft and the "
                "measured table as the arbiter; that division "
                "of labour is conformational analysis's "
                "actual method, and it generalises to every "
                "structure-energy argument this course will "
                "make."
            ),
        ),
        ReadingSection(
            id="av-exam-patterns",
            heading="How examiners ask it: three recurring patterns",
            body=(
                "A-value questions arrive in three costumes "
                "worth recognising on sight. PATTERN ONE, the "
                "ranking: 'order these substituted "
                "cyclohexanes by axial population' - solved by "
                "reading the table once and remembering the "
                "curve saturates, so differences among big "
                "A-values matter less than among small ones. "
                "PATTERN TWO, the computation: 'what fraction "
                "is axial at such-and-such temperature' - "
                "solved by the two-line Boltzmann arithmetic, "
                "with the examiner's favourite trap being a "
                "temperature other than $298$ K quietly "
                "changing $RT$.\n\n"
                "PATTERN THREE, the mechanism hook: 'this "
                "reaction requires the axial conformer - "
                "explain why the tert-butyl analogue reacts "
                "a thousandfold slower.' That one is the "
                "Winstein-Holness experiment wearing exam "
                "clothes: the anchor abolishes the axial "
                "population, and the rate falls by the "
                "Boltzmann factor of the A-value. All three "
                "patterns reward the same discipline the "
                "chapter has drilled - name the two chairs, "
                "price them, convert to population, then ask "
                "what the question actually requires - and "
                "all three punish the same reflexes: ranking "
                "by atomic size, quoting populations without "
                "temperature, and reading equilibrium "
                "numbers as kinetic verdicts. Recognise the "
                "costume, run the audit, and the marks follow "
                "the arithmetic every single time."
            ),
        ),
    ),
    key_takeaways=(
        "The A-value is the free-energy gap between a substituent's equatorial and axial chairs - per substituent, approximately additive, and thermodynamic rather than kinetic.",
        "The table's shape: halogens and oxygens cheap (1-4 kJ/mol - long bonds dilute crowding), alkyls at 7-9 (rotation lets Et hide), phenyl 11.7, tert-butyl ~20 (a lock, and the anancomeric anchor).",
        "Populations follow K = exp(A/RT): steep below 5 kJ/mol (Cl is a third axial), saturating past 10 - and 2 kJ/mol already means 69:31.",
        "Curtin-Hammett: fast flipping means product ratios follow transition-state energies, not ground-state populations - the minor axial conformer can carry the whole reaction.",
        "Additivity prices multi-substituted chairs but is audited for adjacent, giant, and polar groups - the anomeric effect is the canonical electronic override.",
    ),
))


# --------------------------------------------------------------------------
# 7.4 Cis and trans isomerism in rings
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.CISTRANSRING",
    lead=(
        "Two substituents on a ring have a relationship no chair flip "
        "can touch: they sit on the same face or on opposite faces, and "
        "that choice was made when the bonds were formed. Cis and trans "
        "ring compounds are therefore different SUBSTANCES - "
        "diastereomers with different energies, different properties, "
        "and different chemistry - and this chapter builds the "
        "two-layer analysis that handles them: faces first "
        "(configuration), chairs second (conformation), energies last, "
        "with the A-value table doing the pricing."
    ),
    sections=(
        ReadingSection(
            id="ct-faces",
            heading="Two faces, one unbreakable relationship",
            figure=Figure(
                stem="org1-ring-faces",
                caption=(
                    "A ring seen edge-on has a top face and a bottom face: substituents on the same face are cis, on opposite faces trans - and no rotation or flip can move a group between faces without breaking a bond."
                ),
                alt="Two edge-on ring diagrams: cis with both substituents pointing up from the same face, trans with one up and one down on opposite faces.",
            ),
            body=(
                "View any ring edge-on and it has a top face and a "
                "bottom face. A substituent attached to a ring "
                "carbon points toward one face or the other, and "
                "two substituents therefore stand in one of exactly "
                "two relationships: SAME face - CIS (Latin, 'on "
                "this side') - or OPPOSITE faces - TRANS "
                "('across'). The relationship is set by the bonds "
                "themselves: to move a group from one face to the "
                "other you would have to detach it and re-attach "
                "it, breaking a sigma bond.\n\n"
                "That impossibility is the chapter's foundation, "
                "and chapter 7.2 already proved the half of it "
                "students doubt: the ring flip - the most violent "
                "conformational motion a cyclohexane owns - "
                "exchanges axial with equatorial while PRESERVING "
                "up and down. Axial-up becomes equatorial-up, "
                "never equatorial-down. So the face relationship "
                "survives every rotation, every flip, every "
                "collision at every temperature below "
                "bond-breaking chemistry: cis stays cis, trans "
                "stays trans, from synthesis to combustion. Two "
                "compounds that differ only in this relationship "
                "are different substances with different "
                "measurable properties - the claim the next "
                "section makes precise with the vocabulary of "
                "isomerism."
            ),
        ),
        ReadingSection(
            id="ct-diastereomers",
            heading="Configurational, not conformational: naming the distinction",
            body=(
                "The course's isomer taxonomy now gains its most "
                "important branch point. CONFORMERS - the two "
                "chairs of methylcyclohexane, the rotamers of "
                "butane - interconvert by rotation about bonds, "
                "over barriers of tens of kJ/mol, billions of "
                "times a minute; they are the SAME compound, and "
                "no bottle of one can be prepared. CONFIGURATIONAL "
                "isomers interconvert only by breaking bonds - "
                "barriers of hundreds of kJ/mol - so each can be "
                "put in its own bottle, given its own melting "
                "point, and sold under its own catalogue "
                "number.\n\n"
                "Cis- and trans-disubstituted rings are "
                "configurational isomers of a specific kind: "
                "same molecular formula, same connectivity "
                "(every atom bonded to the same partners), "
                "different fixed spatial arrangement, and NOT "
                "mirror images of each other. Stereoisomers "
                "that are not mirror images are DIASTEREOMERS, "
                "and diastereomers differ in every scalar "
                "property: energy, melting point, boiling "
                "point, solubility, spectra, reaction rates. "
                "Cis- and trans-1,2-dimethylcyclohexane boil "
                "$4$ degrees apart and differ in stability by "
                "about $7$ kJ/mol - separable by distillation, "
                "distinguishable by every instrument in the "
                "building. The operational test is worth "
                "keeping explicit: ask what motion "
                "interconverts the two structures. Rotation "
                "only - conformers, one compound. Bond "
                "breaking required - configurational isomers, "
                "two compounds. Every error this chapter "
                "catalogues at the end traces to skipping "
                "that one question."
            ),
        ),
        ReadingSection(
            id="ct-12-worked",
            heading="The 1,2 case, worked: why trans wins",
            figure=Figure(
                stem="org1-cistrans-chairs",
                caption=(
                    "trans-1,2-dimethylcyclohexane reaches a chair with BOTH methyls equatorial; cis-1,2 keeps one methyl axial in either chair - about one axial methyl (~7 kJ/mol) between the diastereomers."
                ),
                alt="Two chair drawings: trans-1,2 with both methyl groups equatorial, and cis-1,2 with one methyl equatorial and one axial.",
            ),
            body=(
                "Run the two-layer analysis on "
                "1,2-dimethylcyclohexane, adjacent carbons. The "
                "geometric fact that decides everything: axial "
                "directions ALTERNATE around the ring, so on "
                "adjacent carbons the axial bonds point in "
                "OPPOSITE directions - axial-up at carbon 1, "
                "axial-down at carbon 2. Equivalently, at "
                "adjacent carbons one face's positions are "
                "axial-up and equatorial-down at C1 but "
                "equatorial-up and axial-down at C2.\n\n"
                "TRANS (opposite faces): one methyl up, one "
                "down. Place the up-methyl equatorial at C1 "
                "and check C2: the down position there can "
                "also be equatorial - BOTH groups equatorial "
                "in one chair. The flipped chair puts both "
                "axial (cost by additivity roughly "
                "$2 \\times 7.3$ plus a diaxial-interaction "
                "term), so the diequatorial chair dominates "
                "overwhelmingly and trans-1,2 spends its life "
                "essentially strain-free.\n\n"
                "CIS (same face): both methyls up. At C1 'up' "
                "can be equatorial, but at C2 'up' is AXIAL - "
                "one methyl is axial in this chair. Flip, and "
                "the roles trade: the other methyl goes "
                "axial. The two chairs are equal in energy "
                "($\\Delta G = 0$, populations $50:50$) and "
                "NEITHER escapes one axial methyl. Verdict: "
                "trans-1,2 is more stable than cis-1,2 by "
                "about one axial-methyl penalty - "
                "$\\approx 7$ kJ/mol, and the measured "
                "enthalpy difference sits right there. The "
                "figure is this paragraph drawn."
            ),
        ),
        ReadingSection(
            id="ct-alternation",
            heading="The alternation table: 1,2 / 1,3 / 1,4",
            table=Table(
                caption="Which diastereomer reaches the diequatorial chair",
                columns=("Substitution pattern", "Diequatorial isomer", "Stability verdict (equal groups)"),
                rows=(
                    ("1,2 (adjacent)", "trans", "trans more stable by ~1 axial penalty"),
                    ("1,3", "cis", "CIS more stable by ~1 axial penalty"),
                    ("1,4 (opposite)", "trans", "trans more stable by ~1 axial penalty"),
                ),
                source="Derived from the alternation of axial directions around the chair; energy differences from A-value additivity, consistent with measured enthalpies (~7 kJ/mol for dimethyl cases)",
                note="Rederive the pattern from axial alternation each time - memorised as 'trans is better' it fails at 1,3.",
            ),
            body=(
                "Generalise the worked case and the pattern "
                "alternates with distance. On carbons 1 and 3, "
                "the axial directions are the SAME (up at both, "
                "or down at both - alternation twice restores "
                "the direction), so SAME-face substituents can "
                "both stand equatorial: for a 1,3 pair it is "
                "CIS that reaches the diequatorial chair, and "
                "cis-1,3-dimethylcyclohexane is the stable "
                "diastereomer - the reverse of the 1,2 "
                "verdict. On carbons 1 and 4 the directions "
                "oppose again, and TRANS wins as at 1,2.\n\n"
                "The table compresses the chapter, but the "
                "note under it carries the pedagogy: the "
                "pattern is not a rule to memorise, because "
                "memorised as 'trans is more stable' it "
                "silently fails for every 1,3 pair. It is a "
                "two-step derivation to rerun each time - "
                "count the carbons between the substituents, "
                "track the alternation of axial directions, "
                "conclude which face relationship lets both "
                "groups recline equatorial. Ten seconds of "
                "derivation, immune to the exam's favourite "
                "trap. For UNEQUAL substituents the same "
                "machinery runs with A-values: the favoured "
                "chair of any isomer parks the LARGER group "
                "equatorial - cis-1-tert-butyl-4-"
                "methylcyclohexane holds tert-butyl "
                "equatorial and pays the methyl's axial "
                "bill, never the reverse, because $20$ "
                "kJ/mol outranks $7.3$."
            ),
        ),
        ReadingSection(
            id="ct-chirality",
            heading="The chirality layer: meso rings and enantiomer pairs",
            body=(
                "Cis-trans assignment answers 'same face or "
                "opposite?' - it does not answer 'chiral or "
                "not?', and the two questions are "
                "independent. Run the mirror test on the "
                "dimethylcyclohexanes. CIS-1,2: a mirror "
                "plane passes through the midpoints of the "
                "C1-C2 bond and the opposite ring bond, "
                "reflecting one methyl into the other - an "
                "internal mirror plane, so the compound is "
                "ACHIRAL despite carrying two stereocentres: "
                "a MESO compound (the time-averaged "
                "statement is exact, since its two chairs "
                "are mirror images interconverted by the "
                "flip). TRANS-1,2 has no internal mirror: it "
                "exists as a pair of ENANTIOMERS, separable "
                "in principle, identical in energy.\n\n"
                "The 1,3 pair reverses nothing: cis-1,3 is "
                "meso (mirror plane through C2 and C5), "
                "trans-1,3 is chiral. And BOTH "
                "1,4-dimethylcyclohexanes are achiral - the "
                "mirror plane through C1 and C4 contains "
                "both substituents - so the 1,4 pair are "
                "diastereomers with no chirality anywhere. "
                "Three patterns, three different chirality "
                "outcomes, one lesson: cis/trans and "
                "chiral/achiral are separate audits. The "
                "full R/S machinery for ring stereocentres "
                "arrives with chapter 6's tools; what this "
                "chapter fixes is the habit of running the "
                "mirror test AFTER the face assignment, "
                "never substituting one for the other."
            ),
        ),
        ReadingSection(
            id="ct-fused",
            heading="Fused rings: decalin and the steroid deck",
            body=(
                "Fuse two cyclohexanes along an edge and the "
                "shared carbons' hydrogens have a cis-trans "
                "relationship with consequences far beyond "
                "nomenclature. TRANS-DECALIN - ring-junction "
                "hydrogens on opposite faces - locks both "
                "rings: a flip of one ring would force the "
                "other's junction bonds into geometrically "
                "impossible positions, so trans-decalin is "
                "conformationally FROZEN, a rigid chassis "
                "with every position's axial or equatorial "
                "identity fixed forever. CIS-DECALIN, "
                "junction hydrogens on the same face, "
                "remains flexible - its rings flip in "
                "concert - and sits about $11$ kJ/mol above "
                "trans, paying gauche interactions at the "
                "junction.\n\n"
                "The steroid skeleton is this lesson run "
                "four rings deep: natural steroids are "
                "predominantly all-trans-fused, which is "
                "why chapter 7.2 could call the steroid "
                "deck rigid and why every substituent on a "
                "steroid has a permanent, addressable "
                "axial or equatorial identity - the fact "
                "Barton's 1950 reactivity arguments and "
                "half of medicinal chemistry stand on. "
                "Ring fusion also explains why the "
                "anancomeric tert-butyl anchor of chapter "
                "7.3 works: locking is not exotic; it is "
                "what happens whenever flipping would "
                "demand an impossible geometry, whether "
                "the demand comes from a fused ring or an "
                "unpayable A-value."
            ),
        ),
        ReadingSection(
            id="ct-menthyl",
            heading="Reactivity payoff: the menthyl chloride story",
            body=(
                "The classic demonstration that ring "
                "stereochemistry controls reactivity - and "
                "the bridge to ORG2's eliminations - is the "
                "pair menthyl and neomenthyl chloride, "
                "diastereomers from the menthol family. The "
                "E2 elimination they undergo requires the "
                "leaving chlorine AXIAL (anti-periplanar to "
                "the departing hydrogen). NEOMENTHYL "
                "chloride's favoured chair - big groups "
                "equatorial - already has chlorine axial: "
                "it eliminates rapidly. MENTHYL chloride's "
                "favoured chair has chlorine EQUATORIAL; to "
                "react it must flip into a chair where "
                "chlorine is axial but methyl and isopropyl "
                "are too, an ascent of two A-values, and "
                "its elimination runs orders of magnitude "
                "slower - and gives a different alkene "
                "distribution, dictated by which hydrogens "
                "are anti-periplanar in the reactive "
                "chair.\n\n"
                "Every tool of the unit appears in one "
                "story: cis-trans configuration decides "
                "which groups CAN be equatorial together; "
                "A-values price the chairs; Curtin-Hammett "
                "connects the rare reactive conformer to "
                "the observed rate; and the flip's "
                "face-preservation guarantees the "
                "diastereomers never interconvert while "
                "reacting differently. When ORG2 derives "
                "the E2's geometry, this pair is the "
                "evidence waiting; for now it stands as "
                "the answer to 'why does any of this "
                "matter' - because diastereomers are "
                "different compounds, all the way down to "
                "their products."
            ),
        ),
        ReadingSection(
            id="ct-errors",
            heading="The error catalogue: four cis-trans traps",
            body=(
                "Trap one: 'the flip interconverts cis and "
                "trans.' Never - the flip exchanges axial "
                "and equatorial while preserving faces; "
                "interconverting the isomers requires "
                "breaking a bond. If your drawing shows "
                "otherwise, the drawing is wrong, not the "
                "principle. Trap two: 'trans is more "
                "stable' as a rule. It is the ANSWER to "
                "the 1,2 and 1,4 cases and precisely "
                "backwards at 1,3 - rederive from axial "
                "alternation every time.\n\n"
                "Trap three: 'two ring stereoisomers must "
                "be an enantiomer pair.' Cis- and "
                "trans-anything are DIASTEREOMERS of each "
                "other; whether either one is additionally "
                "chiral is a separate mirror-test "
                "question, and the meso cases (cis-1,2, "
                "cis-1,3, both 1,4s among the "
                "dimethylcyclohexanes) show every "
                "combination occurs. Trap four: assigning "
                "cis-trans from a CHAIR drawing by "
                "comparing axial and equatorial. Faces, "
                "not environments, decide the label: a "
                "cis pair on adjacent carbons is "
                "one-axial-one-equatorial, and at 1,3 a "
                "cis pair is either both-equatorial or "
                "both-axial depending on the chair. "
                "Assign faces on the flat wedge-dash "
                "drawing first, then translate to chairs "
                "with the ritual - the order of "
                "operations is the whole protection."
            ),
        ),
        ReadingSection(
            id="ct-problems",
            heading="Problem set: four verdicts to reach",
            body=(
                "Problem one: which is more stable, cis- or "
                "trans-1,3-dimethylcyclohexane, and by "
                "roughly how much? Answer: CIS - at 1,3 the "
                "axial directions match, so same-face "
                "groups can both stand equatorial; trans "
                "keeps one methyl axial, so cis wins by "
                "about $7$ kJ/mol, one axial-methyl "
                "penalty.\n\n"
                "Problem two: for "
                "cis-1-tert-butyl-4-methylcyclohexane, "
                "which chair dominates and what does the "
                "methyl do? Answer: at 1,4, cis means one "
                "group axial in either chair; the "
                "tert-butyl ($A \\approx 20$) claims "
                "equatorial, so the METHYL rides axial, "
                "paying $7.3$ - and the compound is "
                "effectively anancomeric, locked by the "
                "price of the alternative.\n\n"
                "Problem three: is "
                "trans-1,2-dimethylcyclohexane chiral? "
                "Answer: yes - no internal mirror plane; "
                "it exists as an enantiomer pair, while "
                "its cis diastereomer is meso.\n\n"
                "Problem four: two students draw "
                "1,2-dimethylcyclohexane chairs; one shows "
                "methyls equatorial-equatorial, the other "
                "axial-axial, and both claim 'trans.' Can "
                "both be right? Answer: yes - they are "
                "the two flip-related chairs of the SAME "
                "trans isomer (diequatorial dominant, "
                "diaxial minor). Faces, preserved in both "
                "drawings, make them trans; the "
                "environments differ because the chairs "
                "do."
            ),
        ),
        ReadingSection(
            id="ct-closing",
            heading="The unit's closing audit: faces, chairs, energies",
            body=(
                "The Cyclic Compounds unit ends where its "
                "four chapters converge, in one ordered "
                "audit for any ring problem. LAYER ZERO, "
                "strain: what ring size, and what does the "
                "combustion-derived table say it costs? "
                "LAYER ONE, configuration: assign faces on "
                "the flat drawing - cis or trans, then the "
                "mirror test for chirality - remembering "
                "that no conformational motion can touch "
                "these answers. LAYER TWO, conformation: "
                "draw both chairs with the ritual, faces "
                "preserved, and list what stands axial in "
                "each. LAYER THREE, energies: price the "
                "chairs by A-value additivity, convert "
                "differences to populations through "
                "$K = e^{-\\Delta G^{\\circ}/RT}$, and "
                "state the verdict as a ratio.\n\n"
                "Then, and only then, ask the chemical "
                "question - which isomer is more stable, "
                "which conformer reacts, what "
                "Curtin-Hammett does to the rate - and the "
                "answer assembles itself from parts you "
                "have already verified. The unit's deeper "
                "lesson is the method: geometry proposes, "
                "thermodynamics prices, measurement "
                "arbitrates, and every claim travels with "
                "its number. ORG2 will spend these tools "
                "on reactions - eliminations that read "
                "chairs, sugars that read faces - and the "
                "audit above is exactly what it will "
                "assume your hands do automatically."
            ),
        ),
        ReadingSection(
            id="ct-drawing",
            heading="Drawing conventions: wedges first, chairs second",
            body=(
                "Ring stereochemistry has two drawing languages, "
                "and fluency means translating between them "
                "without losing information. The FLAT drawing - a "
                "hexagon with WEDGE bonds (toward you, the top "
                "face) and DASHED bonds (away, the bottom face) - "
                "is the configurational language: it shows faces "
                "directly, so cis and trans can be read at a "
                "glance, and it is the form synthesis papers and "
                "exams use to specify WHICH compound is meant. "
                "The CHAIR drawing is the conformational "
                "language: it shows axial and equatorial, so "
                "energies can be priced, but faces must be "
                "inferred from the geometry.\n\n"
                "The safe workflow always runs flat-to-chair, "
                "never the reverse. Read the faces off the "
                "wedges; assign cis or trans; THEN build the "
                "chair with the ritual of chapter 7.2, checking "
                "at each carbon that an up-substituent lands in "
                "that carbon's up position (axial-up or "
                "equatorial-up as the alternation dictates). "
                "The classic failure is translating a wedge "
                "directly to 'equatorial' because both feel "
                "like 'normal' - but wedge encodes FACE and "
                "equatorial encodes ENVIRONMENT, different "
                "coordinates entirely, related only through "
                "the alternation pattern. Ten seconds of "
                "explicit translation beats every shortcut, "
                "and the habit pays again in ORG2 when sugar "
                "Haworth projections - the same wedge logic "
                "bent into a ring - must become chairs to "
                "explain reactivity."
            ),
        ),
        ReadingSection(
            id="ct-13-14-worked",
            heading="The 1,3 and 1,4 cases, worked in full",
            body=(
                "The table asserted the alternation; work it "
                "twice to own it. 1,3-DIMETHYL: carbons 1 and 3 "
                "sit two positions apart, so the axial "
                "direction alternates twice and RETURNS - "
                "axial-up at C1 means axial-up at C3. CIS "
                "(both up): place both methyls equatorial-up? "
                "Check: at C1 up-equatorial exists, at C3 "
                "up-equatorial exists - YES, the diequatorial "
                "chair is available, and its flip partner is "
                "the doubly-axial chair whose two methyls "
                "share the ring face in the notorious "
                "1,3-DIAXIAL clash - methyl against methyl, "
                "far worse than methyl against hydrogen. Cis "
                "therefore lives diequatorial and is the "
                "stable isomer. TRANS (one up, one down): "
                "whichever chair you draw, one methyl is "
                "axial - the penalty is inescapable, exactly "
                "as cis suffered at 1,2.\n\n"
                "1,4-DIMETHYL: three alternations separate "
                "C1 and C4, so their axial directions "
                "OPPOSE, restoring the 1,2 logic: TRANS "
                "reaches diequatorial, cis keeps one methyl "
                "axial in either chair, trans wins by one "
                "axial penalty. Notice what repeats across "
                "all three patterns: the LOSING isomer "
                "always has two chairs of equal energy "
                "(one group axial in each), while the "
                "winning isomer has one dominant "
                "diequatorial chair. That signature - "
                "balanced chairs versus dominant chair - is "
                "itself diagnostic, and low-temperature NMR "
                "sees it directly."
            ),
        ),
        ReadingSection(
            id="ct-spectroscopy",
            heading="Telling them apart: coupling constants and the NMR window",
            body=(
                "Cis and trans are different compounds, but a "
                "bottle does not announce which it holds; the "
                "assignment is experimental, and NMR carries "
                "most of the load. The workhorse is the "
                "three-bond COUPLING CONSTANT between ring "
                "hydrogens, which depends on their dihedral "
                "angle (the Karplus relationship, met "
                "quantitatively in the spectroscopy unit): "
                "two AXIAL hydrogens on adjacent carbons sit "
                "anti, dihedral near $180^{\\circ}$, and "
                "couple strongly - roughly $10$ to $13$ Hz - "
                "while axial-equatorial and "
                "equatorial-equatorial pairs sit near "
                "$60^{\\circ}$ and couple weakly, $2$ to "
                "$5$ Hz. A ring hydrogen flanked by big "
                "couplings is axial in a dominant chair, and "
                "from its axial identity plus the "
                "alternation pattern the face relationships "
                "follow.\n\n"
                "The method's fine print teaches the unit's "
                "own lessons. Coupling constants report the "
                "POPULATION-WEIGHTED average over chairs, so "
                "an isomer with balanced chairs (the "
                "one-axial-each losers above) shows averaged "
                "mid-size couplings - the balanced-versus-"
                "dominant signature made visible. Nuclear "
                "Overhauser measurements add a distance "
                "check: same-face hydrogens are close in "
                "space and enhance each other. And melting "
                "points, the historical criterion, survive "
                "as a caution - early workers' rules of "
                "thumb relating melting point to "
                "configuration failed often enough that the "
                "field learned to trust only measurements "
                "coupled to geometry through physics, a "
                "standard this course inherits."
            ),
        ),
        ReadingSection(
            id="ct-small-rings",
            heading="Cis and trans without chairs: the small rings",
            body=(
                "Faces are more fundamental than chairs, and "
                "the small rings prove it. Cyclopropane is "
                "PLANAR - no conformational freedom at all - "
                "yet cis- and trans-1,2-dimethylcyclopropane "
                "are perfectly good diastereomers: the ring "
                "has two faces, the methyls stand on the "
                "same face or opposite ones, and no motion "
                "short of bond breaking interconverts them. "
                "Here TRANS is more stable for a reason the "
                "chair never invokes: on the rigid planar "
                "ring, cis methyls on adjacent carbons are "
                "forced toward ECLIPSING each other, while "
                "trans methyls stagger across the two faces. "
                "The measured gap runs several kJ/mol, and "
                "the reasoning is pure chapter-2 torsional "
                "logic applied to a ring too stiff to "
                "relax.\n\n"
                "Cyclobutane and cyclopentane sit between "
                "worlds: puckered enough to have "
                "conformational choices, too floppy for the "
                "clean axial-equatorial dichotomy, so their "
                "cis-trans energetics are argued case by "
                "case with models. The portable conclusions: "
                "FACES and the cis-trans distinction exist "
                "for every ring size, from three-membered "
                "up; the CHAIR analysis is the "
                "six-membered ring's special, powerful "
                "instrument for pricing them; and when the "
                "instrument does not apply, the underlying "
                "tools - torsional strain, sterics, "
                "measurement - still do."
            ),
        ),
        ReadingSection(
            id="ct-unequal",
            heading="Unequal partners: menthol's three-group verdict",
            body=(
                "Real molecules rarely carry matched "
                "substituents, and the unequal cases are "
                "where A-value bookkeeping earns its keep. "
                "The protocol: for each chair of each "
                "isomer, sum the A-values of whatever "
                "stands axial; the favoured chair minimises "
                "the bill, and the more stable ISOMER is "
                "the one whose best chair is cheapest. For "
                "1-tert-butyl-2-methylcyclohexane, the "
                "trans isomer parks both groups equatorial "
                "and wins easily; the cis isomer must "
                "choose which group rides axial, and it "
                "always sacrifices the methyl - $7.3$ "
                "beats $20$ - so cis costs about $7.3$ "
                "kJ/mol at its best.\n\n"
                "MENTHOL runs the full three-group audit: "
                "methyl at C5, isopropyl at C2, hydroxyl "
                "at C1 (ring numbering per the terpene "
                "convention), and of the four possible "
                "diastereomers nature's menthol is the one "
                "whose faces allow ALL THREE equatorial - "
                "the alternation pattern happens to permit "
                "it - making its dominant chair essentially "
                "strain-free. Its diastereomers "
                "(neomenthol, isomenthol, neoisomenthol) "
                "each force at least one group axial, and "
                "their properties differ accordingly: "
                "distinct melting points, distinct odours, "
                "distinct reaction chemistry - the menthyl "
                "chloride story's raw material. One "
                "molecule, every tool of the unit, and a "
                "commercial industry (mint flavouring) "
                "resting on which diastereomer the plant "
                "enzyme builds."
            ),
        ),
        ReadingSection(
            id="ct-counting",
            heading="Counting stereoisomers: why 2-to-the-n fails on rings",
            body=(
                "Chapter 6's counting rule - $2^n$ "
                "stereoisomers for $n$ stereocentres - "
                "needs its ring-specific audit, and the "
                "dimethylcyclohexanes are the perfect "
                "laboratory. 1,2-dimethyl has two "
                "stereocentres, so the naive count is "
                "four; the actual count is THREE - the "
                "trans enantiomer pair plus the single "
                "meso cis - because the internal mirror "
                "plane makes two of the four paper "
                "structures the same compound. 1,3 repeats "
                "the arithmetic: three isomers, cis meso, "
                "trans a chiral pair. 1,4 collapses "
                "furthest: the mirror plane through both "
                "substituted carbons kills chirality "
                "entirely, leaving just TWO stereoisomers, "
                "the achiral cis and achiral trans - and "
                "strictly, C1 and C4 are not even "
                "stereocentres by the swap test, though "
                "the cis-trans distinction survives "
                "regardless.\n\n"
                "The general procedure, which never fails "
                "where formulas do: enumerate the "
                "candidate structures, then merge any "
                "related by an internal mirror or "
                "rotation. Symmetry is the counting "
                "correction, and rings - which hold their "
                "substituents in fixed relative positions "
                "- have far more symmetry opportunities "
                "than chains. The habit of drawing and "
                "merging, rather than computing "
                "$2^n$ and trusting it, is what the "
                "sugar chapters will demand, where "
                "pyranose rings stack five stereocentres "
                "and every symmetry shortcut lies in "
                "wait."
            ),
        ),
        ReadingSection(
            id="ct-history",
            heading="A history in two bottles: the decalin wager",
            body=(
                "The cleanest historical test of everything "
                "this unit claims came from decalin. Mohr's "
                "1918 revival of the puckered ring made a "
                "falsifiable prediction that Baeyer's "
                "planar theory could not tolerate: if "
                "six-membered rings are non-planar chairs, "
                "then fused bicyclic decalin should exist "
                "as TWO stable, separable configurational "
                "isomers - cis and trans at the ring "
                "junction - where planar theory predicted "
                "one compound only. In 1925 Huckel "
                "separated and characterised both "
                "decalins: two boiling points, two "
                "densities, two heats of combustion, "
                "exactly as the chair demanded. Two "
                "bottles on a shelf settled a "
                "thirty-five-year theoretical argument.\n\n"
                "The episode is worth carrying beyond "
                "chemistry trivia for what it models: a "
                "structural theory earned its acceptance "
                "not by elegance but by predicting a "
                "COUNTABLE fact - how many distinct "
                "substances exist - that experiment could "
                "check with distillation glassware. This "
                "unit has run the same pattern in "
                "miniature throughout: the alternation "
                "table predicts which isomer is stable, "
                "coupling constants and combustion "
                "calorimetry check it, and every claim "
                "stands or falls on separable, measurable "
                "differences between real substances. "
                "Stereochemistry's authority is exactly "
                "that concrete."
            ),
        ),
        ReadingSection(
            id="ct-biology",
            heading="Faces in biology: sugars and inositols",
            body=(
                "Biology reads ring faces with an accuracy "
                "chemists envy, and two families show the "
                "stakes. The PYRANOSE SUGARS are "
                "polyhydroxylated oxygen-containing "
                "six-membered rings whose identities - "
                "glucose, galactose, mannose - differ "
                "precisely in the face relationships of "
                "their hydroxyls: galactose is glucose "
                "with ONE hydroxyl moved to the other "
                "face (C4), and that single cis-trans "
                "change is the difference between a "
                "universal fuel and a sugar some humans "
                "cannot metabolise. Enzymes distinguish "
                "the two instantly, because same-face "
                "versus opposite-face hydroxyls present "
                "utterly different hydrogen-bonding "
                "surfaces to a binding pocket.\n\n"
                "The INOSITOLS - cyclohexanes bearing six "
                "hydroxyls, one per carbon - are the "
                "combinatorial extreme: nine "
                "diastereomers distinguished ONLY by "
                "face patterns, of which myo-inositol "
                "(five equatorial hydroxyls in its "
                "favoured chair, one axial) is the "
                "biological signalling workhorse. Cell "
                "membranes hang phosphate messages on "
                "specific inositol faces, and misreading "
                "one axial-equatorial identity would "
                "scramble the signal. Both families make "
                "the unit's closing point in biological "
                "hardware: cis-trans relationships are "
                "information - synthesized once, "
                "conserved absolutely, and read by "
                "machinery that never confuses "
                "conformers with configurations."
            ),
        ),
        ReadingSection(
            id="ct-exam-patterns",
            heading="How examiners ask it: three recurring costumes",
            body=(
                "Cis-trans ring questions arrive in three "
                "recognisable forms. PATTERN ONE, the stability "
                "verdict: 'which diastereomer of "
                "1,x-disubstituted cyclohexane is more stable?' "
                "- solved by the alternation derivation (never "
                "the memorised slogan) plus A-value additivity "
                "when the groups differ, and worth showing as "
                "two priced chairs rather than a bare answer. "
                "PATTERN TWO, the chirality sort: 'which of "
                "these ring compounds are chiral / meso / "
                "achiral?' - solved by assigning faces first, "
                "then running the internal-mirror test on each "
                "isomer separately, remembering that the 1,4 "
                "pattern kills chirality entirely.\n\n"
                "PATTERN THREE, the conformational-"
                "configurational trap: a drawing pair, with "
                "the question 'same compound, conformers, or "
                "diastereomers?' - solved by the one "
                "operational test this unit has drilled: what "
                "motion relates them? If a flip or rotation "
                "suffices, same compound; if a bond must "
                "break, different compounds. The three "
                "costumes share one grading reality: partial "
                "credit follows the AUDIT TRAIL - faces "
                "assigned, chairs drawn with the ritual, "
                "energies summed, verdict stated as a ratio "
                "- and answers without the trail earn "
                "nothing when a single sign error flips "
                "them. The method is the mark scheme."
            ),
        ),
        ReadingSection(
            id="ct-vocabulary",
            heading="The vocabulary shelf, completed",
            body=(
                "The unit's glossary closes with this "
                "chapter's entries, each shelved with its "
                "operational test. CIS / TRANS: same face / "
                "opposite faces, assigned on the flat "
                "wedge-dash drawing, invariant under all "
                "conformational motion. CONFIGURATIONAL "
                "ISOMERS: interconvertible only by bond "
                "breaking - separable substances. "
                "DIASTEREOMERS: stereoisomers that are not "
                "mirror images - different in every scalar "
                "property, cis-trans ring pairs being the "
                "unit's canonical examples. MESO: achiral "
                "despite stereocentres, by internal "
                "mirror - cis-1,2- and "
                "cis-1,3-dimethylcyclohexane on this "
                "unit's shelf.\n\n"
                "RING FUSION, cis and trans: the junction "
                "hydrogens' face relationship, deciding "
                "locked (trans-decalin) versus flexible "
                "(cis-decalin). And the unit's verbs: "
                "ASSIGN faces, TRANSLATE to chairs, PRICE "
                "with A-values, WEIGHT with Boltzmann, "
                "TEST with the mirror. Say each noun with "
                "its test and each verb with its number "
                "and the vocabulary stays load-bearing. "
                "The next unit - chapter 6's full "
                "stereochemistry - generalises faces to "
                "R/S configuration labels and the mirror "
                "test to optical activity, with every "
                "ring example here reappearing as a "
                "worked case; nothing shelved now gets "
                "discarded, only renamed with more "
                "precision."
            ),
        ),
        ReadingSection(
            id="ct-coda",
            heading="Coda: one ring, four chapters, one method",
            body=(
                "Hold the whole unit in one image before "
                "leaving it. A single disubstituted cyclohexane "
                "carries every idea the four chapters built: "
                "its ring size sets a strain budget priced by "
                "combustion; its chair geometry creates the "
                "axial and equatorial worlds and the flip that "
                "trades them; its substituents' A-values price "
                "each chair; and its faces - fixed at "
                "synthesis - decide which chairs are even "
                "available to it. Strain, conformation, "
                "preference, configuration: four layers, one "
                "molecule, and the audit that walks them in "
                "order is the unit's real deliverable, more "
                "durable than any single number it computes."
            ),
        ),
    ),
    key_takeaways=(
        "Same face cis, opposite faces trans - fixed at bond formation, untouchable by any flip, making cis and trans separable diastereomers with different properties and energies.",
        "Rederive the alternation each time: diequatorial goes to trans at 1,2 and 1,4 but to CIS at 1,3 - and with unequal groups the larger A-value claims equatorial.",
        "Chirality is a separate audit after face assignment: cis-1,2 and cis-1,3 are meso, trans-1,2 and trans-1,3 are enantiomer pairs, both 1,4s are achiral.",
        "Trans-fused decalins and steroids are conformationally locked chassis; cis fusion stays flexible and pays ~11 kJ/mol - ring fusion is nature's anancomeric anchor.",
        "The unit's audit runs in order - strain, faces, chairs, energies - and the menthyl/neomenthyl story shows the payoff: diastereomers react at different rates toward different products.",
    ),
))

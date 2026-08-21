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

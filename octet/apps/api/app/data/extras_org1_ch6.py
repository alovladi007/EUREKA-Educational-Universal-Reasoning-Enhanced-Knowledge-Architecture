"""Lecture-note depth for ORG1 chapter 6, Stereochemistry - tranche 4.

Authored AT the raised 4,000-word floor from birth, with figures and
equations in the same commit (visual-standard directive).  Scope checked
against the Loudon benchmark's chapter-6 section list (chirality and
stereocenters, R/S nomenclature, enantiomers and diastereomers, optical
activity, Fischer projections, multiple stereocenters, resolution); all
prose authored for OCTET.

Specific rotations and CIP assignments quoted here are the standard
published values; every structure figure's stereo-descriptor was assigned
by RDKit rather than asserted by the author.
"""

from __future__ import annotations

from app.data.lesson_extras import (
    Figure,
    LessonExtras,
    ReadingSection,
    Table,
)

EXTRAS_ORG1_CH6: dict[str, LessonExtras] = {}


def _add(extras: LessonExtras) -> None:
    EXTRAS_ORG1_CH6[extras.node] = extras


# --------------------------------------------------------------------------
# 6.1 Chirality and stereocenters
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.CHIRALITY",
    lead=(
        "Your two hands are made of the same parts in the same order, and "
        "you still cannot put the left one into a right glove. Molecules do "
        "this too, and when they do, the consequences run from the smell of "
        "spearmint to the difference between a drug and a poison. This "
        "chapter defines chirality precisely, gives you a mechanical test "
        "for finding it, prices what it does and does not change about a "
        "molecule's properties, and explains why biology - built entirely "
        "from chiral parts - can tell the two hands apart when a beaker "
        "cannot."
    ),
    sections=(
        ReadingSection(
            id="chir-definition",
            heading="Handedness, defined without hand-waving",
            body=(
                "An object is CHIRAL if it is not superimposable on its "
                "mirror image. Hands, shoes, screws, and spiral "
                "staircases are chiral; spheres, cubes, plain forks and "
                "ordinary hammers are ACHIRAL, because their mirror "
                "images can be slid and rotated onto the originals. The "
                "test is physical and it is absolute: build the mirror "
                "image, then try every rotation and translation you "
                "like - no reflections, no bond breaking - and ask "
                "whether the two coincide.\n\n"
                "For molecules the same test applies to the "
                "three-dimensional arrangement of atoms. A chiral "
                "molecule and its mirror image are called ENANTIOMERS, "
                "and they are different compounds in the same sense "
                "that a left glove is a different object from a right "
                "glove: same formula, same connectivity, same bond "
                "lengths and angles throughout, and yet not the same "
                "thing. Everything else in this chapter is machinery "
                "for detecting that situation quickly and predicting "
                "what follows from it."
            ),
        ),
        ReadingSection(
            id="chir-stereocenter",
            heading="The usual cause: a carbon with four different groups",
            body=(
                "The most common source of molecular chirality is a "
                "tetrahedral carbon bearing FOUR DIFFERENT groups, "
                "called a STEREOCENTER (or stereogenic center, or "
                "asymmetric carbon). Because the four bonds point at "
                "the corners of a tetrahedron, two distinct "
                "arrangements of four different groups exist, and they "
                "are mirror images of one another. Swap any two groups "
                "and you convert one into the other - a fact worth "
                "holding onto, because it becomes a technique in the "
                "next chapter.\n\n"
                "The test is mechanical: at each $sp^3$ carbon, list "
                "the four attached groups and ask whether all four are "
                "DIFFERENT. In 2-butanol, $CH_3CH_2CH(OH)CH_3$, carbon "
                "2 carries $H$, $OH$, $CH_3$, and $CH_2CH_3$ - four "
                "different groups, one stereocenter, a chiral "
                "molecule. In 2-propanol, $(CH_3)_2CHOH$, the same "
                "carbon carries $H$, $OH$, and TWO methyls - not four "
                "different groups, no stereocenter, achiral. The "
                "difference between those two molecules is one $CH_2$ "
                "and an entire chapter of consequences."
            ),
        ),
        ReadingSection(
            id="chir-pair-figure",
            heading="A pair, drawn",
            figure=Figure(
                stem="org1-enantiomer-pair",
                caption=(
                    "The two enantiomers of butan-2-ol: identical connectivity, mirror-image arrangements at the stereocenter, non-superimposable. The R and S labels were assigned computationally, not by eye."
                ),
                alt="Structures of (R)-butan-2-ol and (S)-butan-2-ol drawn side by side with stereochemistry shown.",
            ),
            body=(
                "The figure shows the pair concretely. Both molecules "
                "are butan-2-ol: same formula $C_4H_{10}O$, same "
                "chain, hydroxyl on the same carbon, every bond the "
                "same length. What differs is the SENSE of the "
                "arrangement at carbon 2 - the order in which the four "
                "groups occur as you look at the tetrahedron - and "
                "that difference is not removable by rotating the "
                "drawing.\n\n"
                "Try to prove it to yourself the crude way: mentally "
                "rotate the right-hand structure so that its hydroxyl "
                "and its ethyl group land where the left-hand "
                "structure's are. The methyl and hydrogen will then be "
                "swapped. Every rotation you try trades one pair of "
                "positions for another and never fixes all four at "
                "once - that is what non-superimposable means, "
                "operationally. Physical models make this obvious in "
                "seconds and drawings make it arguable for hours, "
                "which is the standing argument for owning a model "
                "kit through this chapter."
            ),
        ),
        ReadingSection(
            id="chir-symmetry-test",
            heading="The fast test: hunt for an internal mirror plane",
            body=(
                "Building mirror images is slow. The fast screen is "
                "SYMMETRY: any molecule that possesses an internal "
                "mirror plane (a plane of symmetry, reflecting one "
                "half onto the other) in any accessible conformation "
                "is ACHIRAL. A molecule with no such plane and no "
                "improper axis is chiral. In practice, for the "
                "molecules this course meets, the working rule is "
                "'look for a mirror plane; if you find one, stop - "
                "achiral.'\n\n"
                "Two cautions keep the rule honest. First, the plane "
                "must be looked for across CONFORMATIONS: a molecule "
                "whose extended conformation lacks a plane may find "
                "one when a bond rotates, and free rotation makes it "
                "achiral. Second, having stereocenters does not "
                "guarantee chirality - the meso compounds of the "
                "later chapters carry two stereocenters and an "
                "internal mirror plane, and are achiral despite "
                "them. Symmetry decides; stereocenter counting only "
                "suggests."
            ),
        ),
        ReadingSection(
            id="chir-audit",
            heading="The stereocenter audit, in order",
            body=(
                "Run this procedure on any structure and the answer "
                "falls out reliably. STEP ONE: find every $sp^3$ "
                "carbon. Carbons in double bonds and triple bonds "
                "cannot be stereocenters (they are not tetrahedral), "
                "and $CH_2$ or $CH_3$ groups are disqualified "
                "immediately - two identical hydrogens.\n\n"
                "STEP TWO: for each surviving carbon, trace all four "
                "attached branches outward until they differ or "
                "until they are provably identical. This is where "
                "care is needed: two branches can look different "
                "close in and turn out identical, or look similar "
                "and diverge four bonds out. STEP THREE: mark the "
                "carbons with four genuinely different groups. STEP "
                "FOUR: check the whole molecule for an internal "
                "mirror plane, which can render a stereocenter-"
                "bearing molecule achiral. STEP FIVE: count. With "
                "$n$ stereocenters and no symmetry, a maximum of "
                "$2^n$ stereoisomers exist - the ceiling, lowered "
                "by any symmetry the molecule turns out to have. "
                "The audit is dull, and dullness is exactly why it "
                "works under exam pressure."
            ),
        ),
        ReadingSection(
            id="chir-rings",
            heading="Stereocenters in rings",
            body=(
                "Ring carbons follow the same four-different-groups "
                "rule, with a twist that catches nearly everyone: "
                "the two branches to compare are the two ways AROUND "
                "the ring, and they must be traced in both "
                "directions until they differ. In "
                "methylcyclohexane, the carbon bearing the methyl "
                "carries $H$, $CH_3$, and two ring branches that are "
                "identical by symmetry going each way - no "
                "stereocenter, achiral molecule.\n\n"
                "In 3-methylcyclohexan-1-ol the picture changes: "
                "walking around the ring from the carbinol carbon "
                "one way meets the methyl after two carbons, and the "
                "other way meets it after three - the branches "
                "differ, so both substituted carbons are "
                "stereocenters, and cis and trans forms exist as "
                "the previous unit described. This is exactly the "
                "cis-trans machinery of chapter 7 restated in "
                "stereochemical vocabulary, and it is why the two "
                "units are taught adjacent: faces on a ring and "
                "configurations at a stereocenter are the same "
                "physical fact seen from two angles."
            ),
        ),
        ReadingSection(
            id="chir-properties",
            heading="What enantiomers share - and where they part",
            table=Table(
                caption="Enantiomers: identical properties and the exceptions",
                columns=("Property", "Same for both enantiomers?", "Why"),
                rows=(
                    ("melting point, boiling point", "yes (identical)", "same intermolecular forces in an achiral environment"),
                    ("density, refractive index, solubility in achiral solvents", "yes", "as above"),
                    ("IR and standard NMR spectra", "yes", "achiral probe, achiral solvent - environments equivalent"),
                    ("rotation of plane-polarised light", "NO - equal magnitude, opposite sign", "light's polarisation plane is a chiral probe"),
                    ("reaction with a chiral reagent or enzyme", "NO - can differ enormously", "diastereomeric transition states have different energies"),
                    ("odour, taste, biological activity", "often NO", "receptors are chiral"),
                ),
                source="Standard physical-organic properties of enantiomer pairs; the polarimetric and biological exceptions are the classical distinguishing observations",
                note="The rule in one line: enantiomers differ only in a CHIRAL environment.",
            ),
            body=(
                "The table is the chapter's most useful single fact. "
                "In an achiral world - an ordinary solvent, an "
                "ordinary spectrometer, an ordinary melting-point "
                "apparatus - two enantiomers are indistinguishable, "
                "because every interaction they experience is "
                "mirror-symmetric and treats both hands alike. Put "
                "them in a CHIRAL environment and the symmetry "
                "breaks: now one hand fits and the other does not, "
                "exactly as a right glove distinguishes hands that a "
                "mitten cannot.\n\n"
                "Two chiral environments matter in practice, and "
                "they organise the rest of this unit. Plane-"
                "polarised light is one, which is why optical "
                "activity got its own chapter and its own "
                "instrument. Chiral molecules are the other - "
                "enzymes, receptors, chiral catalysts, and chiral "
                "resolving agents - which is why biology and "
                "pharmacology care so much. Everything that follows "
                "is a consequence of that one asymmetry principle."
            ),
        ),
        ReadingSection(
            id="chir-carvone",
            heading="Same atoms, different smell",
            figure=Figure(
                stem="org1-carvone-pair",
                caption=(
                    "The carvone enantiomers: (R)-carvone smells of spearmint and (S)-carvone of caraway. Identical formula and connectivity, opposite configuration - and two different experiences at the nose."
                ),
                alt="Structures of R-carvone and S-carvone side by side, labelled with their characteristic odours.",
            ),
            body=(
                "Carvone is the demonstration everyone remembers. "
                "Both enantiomers are $C_{10}H_{14}O$ with identical "
                "connectivity; both boil at the same temperature and "
                "give the same infrared spectrum. Yet one smells "
                "unmistakably of SPEARMINT and the other of CARAWAY, "
                "because olfactory receptors are proteins - built "
                "from L-amino acids, folded into chiral pockets - "
                "and a chiral pocket binds one hand better than the "
                "other.\n\n"
                "The lesson generalises past novelty. Every "
                "biological target you will ever design a molecule "
                "for is chiral, so every chiral drug is really two "
                "candidate drugs with potentially unrelated "
                "behaviour. Limonene repeats the trick (orange "
                "versus pine), asparagine repeats it in taste "
                "(sweet versus bitter), and the pharmacology "
                "section below repeats it with stakes attached. "
                "When a chapter asks why stereochemistry deserves "
                "this much apparatus, the honest answer is that "
                "the world's receptors were built handed, and "
                "molecules are judged by them."
            ),
        ),
        ReadingSection(
            id="chir-drugs",
            heading="Chirality in medicine: three cautionary structures",
            body=(
                "IBUPROFEN is sold as a racemate - equal amounts of "
                "both enantiomers - although only the (S) form "
                "inhibits cyclooxygenase appreciably. It survives as "
                "a mixture because the body interconverts a useful "
                "fraction of the (R) form into (S) in vivo, an "
                "unusual piece of luck rather than a design "
                "principle.\n\n"
                "ALBUTEROL (salbutamol) makes the opposite case: the "
                "(R) enantiomer carries essentially all the "
                "bronchodilator activity, and the single-enantiomer "
                "product (levalbuterol) exists precisely to leave "
                "the inactive hand out. THALIDOMIDE is the "
                "historical catastrophe usually cited here, and it "
                "must be cited carefully: one enantiomer is the "
                "sedative and the other is associated with the "
                "teratogenicity, but the enantiomers INTERCONVERT "
                "in the body, so selling the single 'safe' "
                "enantiomer would not have prevented the tragedy. "
                "The correct lesson is not 'separate the "
                "enantiomers and all is well' but 'the two hands "
                "of a drug are two different drugs, and their "
                "interconversion is itself a property that must be "
                "measured.' Regulators now expect exactly that "
                "characterisation for every chiral candidate."
            ),
        ),
        ReadingSection(
            id="chir-enzymes",
            heading="Why biology is one-handed",
            body=(
                "Biology does not merely tolerate chirality; it is "
                "built from a single handedness. Essentially all "
                "amino acids in proteins are the L series, and "
                "essentially all sugars in nucleic acids are the D "
                "series - a global bias called HOMOCHIRALITY. The "
                "consequences compound: proteins built from "
                "one-handed monomers fold into one-handed helices, "
                "which create one-handed binding pockets, which "
                "then discriminate between the hands of everything "
                "they meet.\n\n"
                "How the bias began is genuinely unsettled "
                "science, and this course will not pretend "
                "otherwise. Proposals include circularly polarised "
                "starlight, mineral surfaces with chiral faces, "
                "parity-violating energy differences too small to "
                "measure directly, and amplification of a chance "
                "initial imbalance by autocatalytic chemistry - "
                "the last of which is demonstrable in the "
                "laboratory. What is NOT in doubt is the "
                "consequence: enzymes act on one enantiomer of a "
                "substrate and often ignore the other entirely, "
                "which is why chiral synthesis is a discipline and "
                "why the resolution chapter closing this unit "
                "matters commercially."
            ),
        ),
        ReadingSection(
            id="chir-no-stereocenter",
            heading="Chirality without a stereocenter",
            body=(
                "Stereocenters are the usual cause of chirality, "
                "not the only one, and knowing the exceptions "
                "prevents over-trusting the four-different-groups "
                "test. ALLENES - molecules with two cumulated "
                "double bonds, $C=C=C$ - hold their two end groups "
                "in perpendicular planes; with appropriate "
                "substitution the result is chiral although no "
                "carbon carries four different groups. Certain "
                "BIARYLS (two aromatic rings joined by a single "
                "bond) are chiral when rotation about that bond is "
                "blocked by bulky ortho substituents, freezing the "
                "two rings at an angle - a phenomenon called "
                "atropisomerism, and the basis of several "
                "industrial chiral catalysts.\n\n"
                "Helical molecules (helicenes) and some "
                "substituted spiro compounds join the list. The "
                "unifying idea is the definition, not the "
                "shortcut: chirality is non-superimposability on "
                "the mirror image, full stop. Stereocenters are "
                "the commonest way a molecule achieves it, and "
                "the symmetry test - is there an internal mirror "
                "plane? - remains valid for every case, including "
                "the ones where counting stereocenters would "
                "mislead."
            ),
        ),
        ReadingSection(
            id="chir-drawing",
            heading="Drawing three dimensions on flat paper",
            body=(
                "Stereochemistry is only communicable if the "
                "drawing carries the third dimension, and the "
                "convention is fixed: a plain line lies in the "
                "plane of the paper, a solid WEDGE comes toward "
                "the viewer, and a hashed or dashed bond recedes "
                "behind it. At a stereocenter, two bonds are "
                "normally drawn in-plane, one wedged, one dashed - "
                "the arrangement your eye can read as a "
                "tetrahedron.\n\n"
                "Two habits prevent most errors. First, keep the "
                "wedge and dash ADJACENT rather than opposite in "
                "the drawing; opposite placement is legal but "
                "reads ambiguously and invites mistakes when "
                "assigning configuration. Second, when you need "
                "the mirror image, redraw it deliberately by "
                "reflecting the whole structure rather than by "
                "flipping one bond - flipping a single wedge to a "
                "dash inverts the configuration, which is "
                "sometimes what you want and is a disaster when "
                "it is not. Fischer projections, met later in "
                "this unit, are an alternative convention with "
                "their own strict reading rules, invented for "
                "sugars where a molecule may carry five "
                "stereocenters and wedge drawings become "
                "unreadable."
            ),
        ),
        ReadingSection(
            id="chir-pasteur",
            heading="Pasteur's tweezers, 1848",
            body=(
                "The founding experiment is worth telling because "
                "it required no theory of tetrahedral carbon - "
                "which did not yet exist. Louis Pasteur, working "
                "on tartrate salts left in wine barrels, noticed "
                "that crystals of sodium ammonium tartrate came "
                "in two shapes that were mirror images of each "
                "other. He separated them BY HAND under a "
                "microscope with tweezers, dissolved each pile "
                "separately, and found that one solution rotated "
                "plane-polarised light to the right, the other by "
                "an equal amount to the left, and a mixture of "
                "equal parts not at all.\n\n"
                "The inference - that the molecules themselves "
                "come in mirror-image forms - preceded van 't "
                "Hoff and Le Bel's tetrahedral carbon by a "
                "quarter century, and Pasteur got lucky in three "
                "ways worth naming: that particular salt happens "
                "to form separate crystals of each enantiomer "
                "(most racemates do not), it does so only below "
                "about 26 degrees Celsius, and Paris was cold "
                "enough. The episode is the field's favourite "
                "illustration that careful observation can "
                "outrun theory, and it also gives the resolution "
                "chapter its oldest technique."
            ),
        ),
        ReadingSection(
            id="chir-racemic",
            heading="Racemic mixtures and what they cost",
            body=(
                "A RACEMIC mixture (a racemate) contains equal "
                "amounts of both enantiomers, and its defining "
                "property is that it is optically INACTIVE by "
                "cancellation - each molecule's rotation is "
                "matched by its mirror partner. Racemates arise "
                "whenever an achiral starting material is "
                "converted to a chiral product using achiral "
                "reagents in an achiral environment, which is to "
                "say: by default. There is no way for a "
                "symmetric process to prefer one hand.\n\n"
                "That default has commercial consequences. If "
                "only one enantiomer of a drug is active, "
                "selling the racemate means half the material is "
                "at best ballast and at worst a separate "
                "pharmacological agent requiring its own safety "
                "case. The two escapes are RESOLUTION - "
                "separating a racemate after the fact, the "
                "subject of this unit's final chapter - and "
                "ASYMMETRIC SYNTHESIS, in which a chiral "
                "catalyst or auxiliary biases the reaction "
                "toward one hand from the start. The 2001 Nobel "
                "Prize recognised exactly that second strategy, "
                "and modern process chemistry prefers it: it is "
                "cheaper to build the right hand than to sort "
                "hands later, and a resolution's theoretical "
                "ceiling is fifty percent yield unless the "
                "unwanted enantiomer can be recycled."
            ),
        ),
        ReadingSection(
            id="chir-errors",
            heading="The error catalogue: five chirality traps",
            body=(
                "Trap one: equating 'has a stereocenter' with 'is "
                "chiral.' Meso compounds carry stereocenters and "
                "an internal mirror plane and are achiral; the "
                "symmetry test overrules the counting test every "
                "time. Trap two: equating 'chiral' with 'has a "
                "stereocenter.' Allenes, atropisomeric biaryls, "
                "and helicenes are chiral without one.\n\n"
                "Trap three: expecting enantiomers to differ in "
                "ordinary properties. They do not - same melting "
                "point, same NMR, same solubility in achiral "
                "solvents - and an exam option claiming a "
                "boiling-point difference between enantiomers is "
                "wrong by construction. Trap four: forgetting "
                "conformational freedom when hunting mirror "
                "planes; a molecule needs the plane in only ONE "
                "accessible conformation to be achiral. Trap "
                "five: assuming a racemate behaves like a pure "
                "compound - it is optically inactive, its "
                "melting behaviour can differ from either pure "
                "enantiomer, and its biological profile is the "
                "sum of two agents. Each trap dies against the "
                "definition, which is why the definition is "
                "worth reciting: not superimposable on its "
                "mirror image."
            ),
        ),
        ReadingSection(
            id="chir-problems",
            heading="Problem set: four structures to judge",
            body=(
                "Problem one: is 3-methylhexane chiral? Answer: "
                "yes - carbon 3 bears $H$, $CH_3$, $CH_2CH_3$, "
                "and $CH_2CH_2CH_3$, four different groups, and "
                "the molecule has no internal mirror plane. One "
                "stereocenter, one enantiomeric pair.\n\n"
                "Problem two: is 3-methylpentane chiral? Answer: "
                "no - carbon 3 bears $H$, $CH_3$, and TWO ethyl "
                "groups. Only three different groups, no "
                "stereocenter; the molecule has a mirror plane "
                "through carbon 3.\n\n"
                "Problem three: 2-chlorobutane is treated with a "
                "chiral enzyme that reacts with only one "
                "enantiomer. Before the reaction, could a "
                "polarimeter distinguish the racemate from pure "
                "solvent? Answer: no - a racemate is optically "
                "inactive by cancellation. After partial "
                "enzymatic reaction it would become active, "
                "because the enzyme consumed one hand "
                "preferentially and destroyed the "
                "cancellation.\n\n"
                "Problem four: two bottles hold enantiomers of a "
                "chiral alcohol. Name two instruments that could "
                "NOT tell them apart and one that could. "
                "Answer: infrared and ordinary proton NMR could "
                "not (achiral probes); a polarimeter could - as "
                "would NMR with a chiral shift reagent, or any "
                "assay against a chiral biological target."
            ),
        ),
        ReadingSection(
            id="chir-vocabulary",
            heading="The vocabulary shelf",
            body=(
                "Shelve these with their operational tests, "
                "because the rest of the unit spends them "
                "constantly. CHIRAL: not superimposable on its "
                "mirror image - tested by building the mirror "
                "image or, faster, by hunting an internal mirror "
                "plane. ACHIRAL: superimposable on its mirror "
                "image; possesses an internal mirror plane in "
                "some accessible conformation. ENANTIOMERS: a "
                "pair of molecules related as non-superimposable "
                "mirror images - identical in achiral "
                "environments, distinguishable in chiral "
                "ones.\n\n"
                "STEREOCENTER: an atom whose group-swap "
                "generates a different stereoisomer, most "
                "commonly a carbon with four different "
                "substituents. RACEMATE: an equimolar mixture of "
                "enantiomers, optically inactive by "
                "cancellation. HOMOCHIRALITY: biology's global "
                "one-handed bias - L-amino acids, D-sugars. "
                "Each term carries a test rather than a "
                "definition to recite, and that is the "
                "difference between vocabulary that works under "
                "pressure and vocabulary that decorates an "
                "answer sheet."
            ),
        ),
        ReadingSection(
            id="chir-closing",
            heading="The chirality audit",
            body=(
                "Close with the portable checklist this chapter "
                "exists to install. When a structure arrives: "
                "FIRST, scan every $sp^3$ carbon for four "
                "different groups, tracing branches outward "
                "until they genuinely differ. SECOND, look for "
                "an internal mirror plane in any reachable "
                "conformation - if one exists, the molecule is "
                "achiral no matter how many stereocenters it "
                "carries. THIRD, if no plane exists, the "
                "molecule is chiral and has an enantiomer worth "
                "drawing. FOURTH, count the ceiling: $2^n$ for "
                "$n$ stereocenters, lowered by symmetry.\n\n"
                "FIFTH - the step students skip - ask what "
                "ENVIRONMENT the question puts the molecule in. "
                "In an achiral flask, the hands are "
                "interchangeable and every ordinary measurement "
                "will say so. In a polarimeter, in an enzyme, "
                "in a nose, or against a chiral catalyst, they "
                "are different substances with different fates. "
                "The next chapters build the naming system that "
                "lets you SAY which hand you mean, the "
                "measurement that detects it, and the "
                "separation that isolates it - but each of them "
                "assumes this audit runs first, and runs "
                "automatically."
            ),
        ),
        ReadingSection(
            id="chir-vs-conformers",
            heading="Configuration versus conformation, restated",
            body=(
                "The cyclic-compounds unit drew a line this chapter "
                "must redraw in its own vocabulary, because every "
                "later error traces to blurring it. CONFORMATIONS "
                "interconvert by ROTATION about single bonds: "
                "barriers of tens of kJ/mol, crossed billions of "
                "times a minute at room temperature, so all "
                "conformers of a molecule are the same substance and "
                "cannot be bottled separately. CONFIGURATIONS "
                "interconvert only by BREAKING and remaking bonds: "
                "barriers of hundreds of kJ/mol, effectively never "
                "crossed thermally, so each configuration is its own "
                "substance.\n\n"
                "Enantiomers differ in configuration. No amount of "
                "heating, stirring, or bond rotation converts one "
                "into the other - which is precisely why a bottle of "
                "one enantiomer stays one enantiomer on the shelf, "
                "and why Pasteur's separated crystals kept their "
                "opposite rotations. The operational test is the "
                "same one the ring chapters used: ask what motion "
                "would interconvert the two structures. Rotation "
                "only means one compound drawn twice. Bond breaking "
                "required means two compounds, two bottles, two "
                "entries in the catalogue - and, if the target is "
                "biological, potentially two entirely different "
                "outcomes."
            ),
        ),
        ReadingSection(
            id="chir-detecting",
            heading="Detecting chirality in the laboratory",
            body=(
                "Beyond the polarimeter of the next chapters, "
                "several routine methods distinguish enantiomers, "
                "and all of them work by importing chirality "
                "deliberately. CHIRAL SHIFT REAGENTS are chiral "
                "complexes added to an NMR sample; they associate "
                "with each enantiomer to different extents, "
                "producing diastereomeric associations whose "
                "signals separate - suddenly one peak becomes two, "
                "and their integrals give the enantiomer "
                "ratio.\n\n"
                "CHIRAL CHROMATOGRAPHY does the same with a "
                "stationary phase: a column packed with a chiral "
                "support retains the two enantiomers for different "
                "times, and they emerge as separate peaks whose "
                "areas measure the composition directly. This is "
                "now the standard analytical method for "
                "enantiomeric purity in pharmaceutical work, and "
                "preparative versions separate material at scale. "
                "CIRCULAR DICHROISM measures differential "
                "absorption of left- and right-circularly "
                "polarised light and is the workhorse for protein "
                "folding. Notice the pattern across all three: "
                "each creates a chiral environment, because that "
                "is the only kind of environment in which "
                "enantiomers are distinguishable at all. There is "
                "no achiral trick."
            ),
        ),
        ReadingSection(
            id="chir-industry",
            heading="The economics of one hand",
            body=(
                "Single-enantiomer drugs dominate modern approvals, "
                "and three strategies get chemists there. The "
                "CHIRAL POOL exploits nature's homochirality by "
                "starting from cheap enantiopure natural products - "
                "amino acids, sugars, terpenes, tartaric and lactic "
                "acids - and elaborating them without disturbing "
                "the stereocenters already present. It is the "
                "cheapest route when a suitable starting material "
                "exists.\n\n"
                "ASYMMETRIC CATALYSIS builds the stereocenter "
                "selectively, using a chiral catalyst so that one "
                "transition state is favoured; a small amount of "
                "catalyst can set the configuration of an "
                "unlimited amount of product, which is why the "
                "approach won the 2001 Nobel Prize and why "
                "industrial routes prefer it. RESOLUTION - "
                "separating a racemate - is the fallback and the "
                "subject of this unit's last chapter; its "
                "arithmetic is unforgiving, since the maximum "
                "yield of the desired hand is fifty percent "
                "unless the unwanted enantiomer can be racemised "
                "and recycled. That fifty-percent ceiling is the "
                "single number that explains why so much "
                "twentieth-century methodology development went "
                "into catalysis: the alternative wastes half of "
                "everything, forever."
            ),
        ),
        ReadingSection(
            id="chir-exam-patterns",
            heading="How examiners ask it",
            body=(
                "Chirality questions arrive in four costumes. THE "
                "COUNT: 'how many stereocenters does this structure "
                "contain?' - solved by the audit, with the usual "
                "trap being a carbon whose two branches look "
                "different but prove identical several bonds out. "
                "THE JUDGEMENT: 'which of these molecules is "
                "chiral?' - solved by the mirror-plane test, with "
                "meso compounds planted as the distractor that "
                "punishes counting alone.\n\n"
                "THE PROPERTY: 'which property differs between "
                "enantiomers?' - answered by the table above, "
                "where every achiral-environment property is "
                "identical and only optical rotation and chiral "
                "interactions differ. THE RELATIONSHIP: 'what is "
                "the relationship between these two structures?' - "
                "enantiomers, diastereomers, identical, or "
                "constitutional isomers, resolved by the ordered "
                "test the next chapters formalise (same "
                "connectivity? mirror images? all centers "
                "inverted?). All four reward the same discipline "
                "and punish the same shortcut: reciting rules of "
                "thumb instead of running the definition."
            ),
        ),
        ReadingSection(
            id="chir-models",
            heading="Build the pair once",
            body=(
                "As with the chair, ten minutes with a model kit "
                "outperforms an hour of re-reading. Build a carbon "
                "with four differently coloured groups, then build "
                "its mirror image beside it, and try honestly to "
                "superimpose them. You will find that aligning any "
                "three groups always leaves the fourth pair "
                "swapped - the physical fact that all the "
                "chapter's abstraction is describing.\n\n"
                "Then perform the swap experiment: on one model, "
                "exchange any two groups and watch it become the "
                "mirror image of its former self. That single "
                "observation underwrites the next chapter's most "
                "useful trick - when the lowest-priority group "
                "points the wrong way for an R/S assignment, "
                "assign the configuration anyway and then invert "
                "the answer, because one swap inverts "
                "configuration exactly once. Students who have "
                "done this with their hands never misremember the "
                "rule; students who have only read it invert at "
                "the wrong moments under time pressure. The kit "
                "is the cheapest tutoring available in this "
                "unit."
            ),
        ),
        ReadingSection(
            id="chir-bridge",
            heading="What the rest of the unit adds",
            body=(
                "Three questions remain open, and each gets its own "
                "chapter. NAMING: having established that a molecule "
                "is chiral and that two hands exist, how do we SAY "
                "which one we mean, unambiguously, in a way a "
                "chemist on another continent can reproduce? That is "
                "the Cahn-Ingold-Prelog system and the R/S labels, "
                "next. MEASURING: how do we detect experimentally "
                "which hand - or what mixture of hands - a sample "
                "contains? That is optical activity, the "
                "polarimeter, and the enantiomeric-excess "
                "arithmetic.\n\n"
                "SEPARATING: given the racemate that symmetric "
                "chemistry hands us by default, how do we obtain "
                "one hand in quantity? That is resolution, closing "
                "the unit. Between them sit the chapters on "
                "diastereomers and multiple stereocenters, which "
                "handle the common case of molecules carrying more "
                "than one chiral carbon - where the counting gets "
                "interesting, meso compounds appear, and the "
                "properties stop being identical. Everything in "
                "those chapters assumes this one's audit is "
                "automatic: find the stereocenters, test the "
                "symmetry, name the environment."
            ),
        ),
        ReadingSection(
            id="chir-scale",
            heading="A note on scale: how common is chirality?",
            body=(
                "It is worth calibrating how ordinary this "
                "phenomenon is. Among small organic molecules with "
                "any structural complexity, stereocenters are the "
                "norm rather than the exception: most amino acids, "
                "every common sugar, the majority of terpenes and "
                "alkaloids, and well over half of marketed "
                "small-molecule drugs contain at least one. A "
                "molecule with four stereocenters - unremarkable "
                "for a natural product - has up to sixteen "
                "stereoisomers, of which a synthesis must deliver "
                "one.\n\n"
                "That is the practical reason this unit is long. "
                "Constitutional isomerism, which felt like the "
                "hard part of earlier chapters, is a solved "
                "bookkeeping problem once structures are drawn; "
                "stereochemistry adds a dimension that drawings "
                "hide, that ordinary measurements cannot see, and "
                "that biology reads with total discrimination. "
                "Chemists who skip it produce the right formula "
                "and the wrong compound - and in a pharmaceutical "
                "context, discover the difference late and "
                "expensively."
            ),
        ),
    ),
    key_takeaways=(
        "Chiral means not superimposable on the mirror image; the fast screen is the internal mirror plane, and it overrules stereocenter counting (meso compounds are achiral).",
        "The usual source is a tetrahedral carbon with four different groups; allenes, atropisomeric biaryls and helicenes prove stereocenters are not required.",
        "Enantiomers are identical in every achiral environment - same melting point, same NMR - and differ only against a chiral probe: polarised light, an enzyme, a receptor.",
        "Because receptors are chiral, the two hands of a drug are two different drugs (albuterol, ibuprofen), and thalidomide's interconversion shows separation alone is not safety.",
        "Symmetric reagents in symmetric environments give racemates by default; escaping that costs either a resolution (50 percent ceiling) or an asymmetric synthesis.",
    ),
))


# --------------------------------------------------------------------------
# 6.2 R/S nomenclature (Cahn-Ingold-Prelog)
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.RS",
    lead=(
        "Knowing a molecule is chiral is not enough - chemistry needs to "
        "say WHICH hand, unambiguously, in text that survives translation "
        "and telephone. The Cahn-Ingold-Prelog system does it with four "
        "rules and a rotation: rank the four groups, point the lowest away, "
        "and read the remaining three clockwise or counterclockwise. This "
        "chapter builds the ranking rules in the order they are applied, "
        "drills the wheel procedure, handles the awkward cases honestly, "
        "and separates R/S from the two other labelling systems it is "
        "routinely confused with."
    ),
    sections=(
        ReadingSection(
            id="rs-why",
            heading="Why a naming system was necessary",
            body=(
                "Before 1956, chemists described configuration by "
                "RELATING a compound to a reference - most often "
                "glyceraldehyde, through the D and L system - which "
                "worked until the chain of relations grew long, "
                "ambiguous, or simply wrong. Worse, the sign of "
                "optical rotation, the only directly measurable "
                "handedness marker, does not correlate with "
                "structure in any usable way: two compounds with "
                "identical spatial arrangements can rotate light in "
                "opposite directions, and the same compound can "
                "switch sign with solvent or temperature.\n\n"
                "Cahn, Ingold, and Prelog proposed a system that "
                "depends on nothing but the structure itself: rank "
                "the four groups at a stereocenter by a fixed set "
                "of rules, then read the geometry. The label it "
                "produces - R or S - is an ABSOLUTE configuration "
                "descriptor: it can be assigned from a drawing "
                "alone, needs no reference compound, no "
                "measurement, and no comparison. That "
                "self-sufficiency is the whole point, and it is "
                "why R/S replaced its predecessors everywhere "
                "except the two niches (sugars and amino acids) "
                "where D/L survives by tradition."
            ),
        ),
        ReadingSection(
            id="rs-rule1",
            heading="Rule 1: atomic number at the point of attachment",
            figure=Figure(
                stem="org1-cip-priorities",
                caption=(
                    "CIP rule 1 ranks by atomic number of the atom attached to the stereocenter. The plotted values are the atomic numbers themselves, so the bar heights are the priority order: I > Br > Cl > S > P > F > O > N > C > H."
                ),
                alt="Bar chart of atomic number for H, C, N, O, F, P, S, Cl, Br and I, ordered left to right by increasing atomic number.",
            ),
            body=(
                "The first and most-used rule: rank the four "
                "attached atoms by ATOMIC NUMBER, higher taking "
                "higher priority. The figure is simply the "
                "periodic table's atomic numbers plotted, because "
                "the ranking is nothing more than that - iodine "
                "($Z = 53$) outranks bromine ($35$), which "
                "outranks chlorine ($17$), which outranks sulfur "
                "($16$), then phosphorus ($15$), fluorine ($9$), "
                "oxygen ($8$), nitrogen ($7$), carbon ($6$), and "
                "hydrogen ($1$) last of all.\n\n"
                "Hydrogen's position matters practically: at "
                "nearly every stereocenter you will meet, "
                "hydrogen is the LOWEST priority, which is "
                "convenient because the procedure asks you to "
                "point the lowest priority away from the viewer. "
                "Two consequences worth noting immediately. "
                "Isotopes are ranked by MASS number when the "
                "atomic numbers tie - deuterium outranks "
                "protium - which is rule 2's business but is "
                "usually taught here. And lone pairs, where "
                "they occupy a position (as at a stereogenic "
                "nitrogen or sulfur), count as the lowest "
                "priority of all, ranking below hydrogen."
            ),
        ),
        ReadingSection(
            id="rs-rule2",
            heading="Rule 2: explore outward to the first point of difference",
            body=(
                "When two attached atoms are the SAME element, the "
                "tie is broken by looking at what they are attached "
                "to, moving outward one sphere at a time until the "
                "branches differ. At each step, compare the sets of "
                "atoms attached to each branch, listed in DECREASING "
                "order, and compare them term by term: the first "
                "position where they differ decides the whole "
                "branch, and nothing further out matters.\n\n"
                "Concretely, compare $-CH_2OH$ against $-CH_2CH_3$. "
                "Both begin with carbon, a tie. Look at what each "
                "of those carbons carries: the first has $(O, H, "
                "H)$, the second $(C, H, H)$. Compare highest "
                "against highest - $O$ beats $C$ - and the "
                "hydroxymethyl branch wins outright. Compare "
                "$-CH(CH_3)_2$ against $-CH_2CH_2CH_3$: the "
                "isopropyl carbon carries $(C, C, H)$ while the "
                "propyl carbon carries $(C, H, H)$, and at the "
                "SECOND term $C$ beats $H$, so isopropyl outranks "
                "propyl. The discipline that prevents errors is "
                "strictly first-point-of-difference: do not "
                "average, do not count total atoms, do not weigh "
                "'bigger group' - compare ordered sets, position "
                "by position, and stop at the first difference."
            ),
        ),
        ReadingSection(
            id="rs-rule3",
            heading="Rule 3: duplicate atoms for double and triple bonds",
            body=(
                "Multiple bonds are handled by DUPLICATION: an atom "
                "doubly bonded to another counts as though it were "
                "bonded to two of them, and a triple bond counts as "
                "three. The duplicate atoms are phantoms - they "
                "carry no substituents of their own and terminate "
                "the branch - but they count fully for ranking.\n\n"
                "So an aldehyde carbon, $-CHO$, is treated as "
                "carrying $(O, O, H)$: the real oxygen plus its "
                "duplicate. A carboxyl carbon, $-COOH$, becomes "
                "$(O, O, O)$ - the doubly bonded oxygen, its "
                "duplicate, and the hydroxyl oxygen - which is "
                "why carboxyl outranks aldehyde, which in turn "
                "outranks hydroxymethyl $(O, H, H)$. A vinyl "
                "carbon $-CH=CH_2$ counts as $(C, C, H)$ and so "
                "outranks ethyl $(C, H, H)$. A nitrile carbon "
                "$-C\\equiv N$ counts as $(N, N, N)$.\n\n"
                "The aromatic ring is the case worth rehearsing: "
                "a phenyl carbon attached to the stereocenter "
                "carries two ring carbons plus one duplicate "
                "from the aromatic bonding, giving $(C, C, C)$, "
                "which outranks an ordinary $CH_2$ group and "
                "loses to any branch presenting an oxygen. "
                "Kekule bookkeeping aside, the practical "
                "ranking that follows from duplication is the "
                "familiar one: $COOH > CHO > CH_2OH > C_6H_5 > "
                "CH=CH_2 > C(CH_3)_3 > CH(CH_3)_2 > CH_2CH_3 > "
                "CH_3 > H$."
            ),
        ),
        ReadingSection(
            id="rs-wheel",
            heading="The procedure: lowest away, then read the wheel",
            figure=Figure(
                stem="org1-cip-wheel",
                caption=(
                    "With the lowest-priority group pointing away from the viewer, tracing priority 1 to 2 to 3 clockwise gives R and counterclockwise gives S. The convention, drawn."
                ),
                alt="Two circular diagrams showing three ranked spokes with a curved arrow: clockwise labelled R, counterclockwise labelled S.",
            ),
            body=(
                "Once the four groups are ranked, the assignment is "
                "geometry. Orient the molecule - mentally, or with "
                "a model - so that the LOWEST priority group (rank "
                "4) points directly AWAY from you. Then trace a "
                "path from priority 1 to 2 to 3. Clockwise is R "
                "(from the Latin RECTUS, right); counterclockwise "
                "is S (SINISTER, left).\n\n"
                "The figure shows both senses, and it is worth "
                "internalising as an image rather than a "
                "sentence, because under time pressure the "
                "sentence gets garbled and the image does not. "
                "Two practical notes. In a wedge-dash drawing, "
                "the lowest priority already points away when it "
                "is drawn on a DASHED bond - the most convenient "
                "case, where you simply read the remaining three "
                "as drawn. And a physical model removes all "
                "doubt in about five seconds, which is why the "
                "previous chapter kept insisting on one. The "
                "next section handles the inconvenient case, "
                "which is where nearly every wrong answer "
                "originates."
            ),
        ),
        ReadingSection(
            id="rs-swap-trick",
            heading="When the lowest priority points toward you",
            body=(
                "Frequently the drawing puts the lowest-priority "
                "group on a WEDGE - pointing at you - which is "
                "exactly backwards for the procedure. Two "
                "reliable fixes exist, and both are worth "
                "owning.\n\n"
                "THE INVERSION TRICK: read the wheel anyway, as "
                "drawn, and then REVERSE the answer. If 1 to 2 "
                "to 3 traces clockwise while the lowest priority "
                "points at you, the true configuration is S, not "
                "R. This works because viewing the tetrahedron "
                "from the opposite side reverses the apparent "
                "sense of rotation, exactly once.\n\n"
                "THE SWAP TRICK: exchange the lowest-priority "
                "group with whichever group does point away, "
                "assign the configuration of the resulting "
                "structure normally, then invert the answer - "
                "because one swap of any two groups inverts "
                "configuration exactly once (the fact the "
                "previous chapter had you verify with a model). "
                "Two swaps return the original configuration, "
                "which is a useful check: if you find yourself "
                "swapping twice, you should get back where you "
                "started. Choose one trick and use it "
                "exclusively; the students who mix both under "
                "pressure are the ones who invert an odd number "
                "of times by accident and hand in the mirror "
                "image of the right answer."
            ),
        ),
        ReadingSection(
            id="rs-worked-1",
            heading="Worked example: butan-2-ol",
            body=(
                "Take the stereocenter of butan-2-ol, carbon 2, "
                "bearing $OH$, $CH_3$, $CH_2CH_3$, and $H$. RANK "
                "THEM. Oxygen has the highest atomic number, so "
                "$OH$ is priority 1. Hydrogen is lowest, priority "
                "4. The tie between the two carbons goes to rule "
                "2: the ethyl carbon carries $(C, H, H)$ and the "
                "methyl carbon carries $(H, H, H)$, so ethyl is "
                "priority 2 and methyl priority 3.\n\n"
                "NOW READ THE GEOMETRY. In the figure from the "
                "previous chapter, the structure drawn with the "
                "hydrogen receding shows $OH$ to $CH_2CH_3$ to "
                "$CH_3$ tracing clockwise - that is the R "
                "enantiomer, and RDKit's independent assignment "
                "on the same structure agrees, which is why the "
                "figure could be labelled with confidence. Its "
                "mirror image traces counterclockwise and is S. "
                "Note what the label does NOT tell you: nothing "
                "about which way this compound rotates polarised "
                "light. R and S describe arrangement; $(+)$ and "
                "$(-)$ describe a measurement, and the "
                "relationship between them must be determined "
                "experimentally for each compound, one at a "
                "time."
            ),
        ),
        ReadingSection(
            id="rs-worked-2",
            heading="Worked example: a stereocenter with four heteroatom branches",
            body=(
                "Harder case: the alpha carbon of the amino acid "
                "SERINE, which bears $NH_2$, $COOH$, $CH_2OH$, and "
                "$H$. Rule 1 sorts the first atoms: $N$ ($Z = 7$) "
                "beats both carbons, so the amino group is "
                "priority 1; hydrogen is priority 4. The two "
                "carbons tie and go to rules 2 and 3.\n\n"
                "The carboxyl carbon, with duplication for its "
                "double bond, presents $(O, O, O)$. The "
                "hydroxymethyl carbon presents $(O, H, H)$. "
                "Compare highest to highest: both $O$, tie. "
                "Compare second: $O$ against $H$ - carboxyl wins. "
                "So $COOH$ is priority 2 and $CH_2OH$ is priority "
                "3. Final ranking: $NH_2 > COOH > CH_2OH > H$.\n\n"
                "Natural serine is the L form, which in this case "
                "carries the (S) configuration - as do the other "
                "standard amino acids EXCEPT cysteine, whose "
                "sulfur-bearing side chain outranks its carboxyl "
                "group and thereby flips the label to (R) without "
                "any change in the actual spatial arrangement. "
                "Cysteine is the standing proof that R/S is a "
                "naming convention applied to a fixed geometry, "
                "not a property of the geometry itself: change "
                "the substituent priorities and the letter "
                "changes while the molecule does not."
            ),
        ),
        ReadingSection(
            id="rs-systems",
            heading="Three independent labelling systems",
            table=Table(
                caption="R/S, D/L, and (+)/(-): what each one reports",
                columns=("System", "What it describes", "How it is determined"),
                rows=(
                    ("R / S", "absolute configuration at each stereocenter", "from the structure, by the CIP rules - no measurement"),
                    ("D / L", "configuration relative to glyceraldehyde", "by structural relation or convention; survives in sugars and amino acids"),
                    ("(+) / (-)", "direction of optical rotation (dextro/levo)", "MEASURED on a polarimeter for that sample and conditions"),
                ),
                source="Standard stereochemical nomenclature conventions (IUPAC CIP recommendations; the D/L convention as retained for carbohydrates and amino acids)",
                note="No two of these predict each other: an (S) compound may be (+) or (-), and D-sugars include both.",
            ),
            body=(
                "The single most common conceptual error in this "
                "chapter is assuming the three systems align. They "
                "do not, and the table is worth memorising in "
                "exactly the form given. R/S comes from "
                "STRUCTURE by rules. $(+)/(-)$ comes from "
                "MEASUREMENT on an instrument. D/L comes from a "
                "historical RELATION to glyceraldehyde and "
                "persists mainly in biochemistry.\n\n"
                "Concretely: (S)-alanine is $(+)$, while other "
                "(S) amino acids are $(-)$; L-amino acids are "
                "mostly (S) but cysteine is (R); D-glyceraldehyde "
                "happens to be both (R) and $(+)$, which is a "
                "coincidence of the reference compound and not a "
                "pattern. When a problem gives you a rotation "
                "sign and asks for R/S, the honest answer is "
                "that the sign alone cannot determine it - you "
                "need the structure. When a problem gives you a "
                "structure and asks for the rotation sign, the "
                "honest answer is that you would have to measure "
                "it. Exams test exactly this distinction, and "
                "the trap is a plausible-sounding option "
                "asserting the correlation."
            ),
        ),
        ReadingSection(
            id="rs-multiple",
            heading="Naming molecules with more than one stereocenter",
            body=(
                "When a molecule carries several stereocenters, "
                "each gets its own descriptor, prefixed by the "
                "locant of its carbon: $(2R,3S)$-3-bromobutan-2-ol "
                "names both centers explicitly, and the name is "
                "incomplete without both. The stereodescriptors go "
                "in the name's prefix, in locant order, inside "
                "parentheses.\n\n"
                "Two structural facts follow immediately and are "
                "tested constantly. ENANTIOMERS have EVERY "
                "stereocenter inverted: the mirror image of "
                "$(2R,3S)$ is $(2S,3R)$, with no exceptions and "
                "no partial cases. DIASTEREOMERS have SOME but "
                "not all inverted: $(2R,3S)$ and $(2R,3R)$ are "
                "diastereomers, differing at one center only. "
                "That mechanical test - count the inversions, "
                "all or some - is the fastest way to classify a "
                "pair of structures whose descriptors are "
                "given, and the next chapter builds the "
                "properties that follow from the "
                "classification. A caution to carry forward: "
                "$(2R,3S)$ and $(2S,3R)$ are sometimes the SAME "
                "compound rather than a pair - the meso case - "
                "when the molecule's internal symmetry makes "
                "the mirror image superimposable, which is why "
                "the symmetry test never retires."
            ),
        ),
        ReadingSection(
            id="rs-rings",
            heading="Assigning configuration in rings",
            body=(
                "Ring stereocenters follow identical rules with "
                "one procedural wrinkle: two of the four branches "
                "are the two paths AROUND the ring, and they must "
                "be compared by walking both directions "
                "simultaneously, sphere by sphere, until they "
                "differ. Walk one atom at a time in each "
                "direction, comparing the sets, and stop at the "
                "first point of difference exactly as in an open "
                "chain.\n\n"
                "In 3-methylcyclohexan-1-ol, assigning the "
                "carbinol carbon means comparing the ring path "
                "that meets the methyl-bearing carbon after two "
                "steps against the path that meets it after "
                "three; the shorter route to the branch point "
                "presents the higher-ranked set first and takes "
                "priority. The practical advice for ring "
                "problems is procedural: redraw the ring "
                "flattened with wedge-dash bonds before "
                "assigning, because reading R/S directly off a "
                "chair drawing invites errors that the flat "
                "drawing prevents. Assign on the flat drawing, "
                "then translate to the chair for the "
                "conformational analysis the previous unit "
                "taught - flat for configuration, chair for "
                "energy, in that order."
            ),
        ),
        ReadingSection(
            id="rs-errors",
            heading="The error catalogue: five CIP traps",
            body=(
                "Trap one: ranking by SIZE or mass instead of "
                "atomic number at the point of attachment. A "
                "tert-butyl group is bulkier than a hydroxyl and "
                "ranks below it, because oxygen beats carbon at "
                "the first atom and nothing further out can "
                "rescue the branch. Trap two: summing or "
                "averaging the atoms in a branch instead of "
                "comparing ordered sets at the first point of "
                "difference.\n\n"
                "Trap three: forgetting duplication for multiple "
                "bonds - the single commonest source of wrong "
                "priorities involving carbonyls, alkenes, and "
                "aromatic rings. Trap four: mishandling the "
                "orientation, either by forgetting to invert "
                "when the lowest priority points at you, or by "
                "inverting twice. Trap five: assuming R "
                "correlates with $(+)$, or that L implies (S). "
                "It does not, and cysteine exists specifically "
                "to punish that assumption. Each trap has the "
                "same remedy: write the four groups down, rank "
                "them explicitly with a reason for each "
                "comparison, then handle the geometry as a "
                "separate step. Assignments done in one "
                "impatient mental motion are the ones that come "
                "back inverted."
            ),
        ),
        ReadingSection(
            id="rs-history",
            heading="Cahn, Ingold, Prelog, and the first absolute configuration",
            body=(
                "The system's timing was not accidental. Until "
                "1951, NO absolute configuration was known: "
                "chemists could relate compounds to one another "
                "and to glyceraldehyde, but the reference itself "
                "rested on an arbitrary guess made by Emil "
                "Fischer - who assigned D-glyceraldehyde its "
                "configuration knowing he had a fifty percent "
                "chance of being right. Then Bijvoet, using "
                "anomalous X-ray scattering on a rubidium sodium "
                "tartrate crystal, determined a real absolute "
                "configuration experimentally - and Fischer's "
                "coin flip had landed correctly, sparing the "
                "literature a wholesale renumbering.\n\n"
                "Cahn, Ingold, and Prelog published their "
                "ranking system in 1956, refining it in 1966, "
                "and it became the IUPAC standard because it "
                "made configuration a property you could "
                "determine from a drawing rather than a "
                "genealogy of chemical correlations. Prelog "
                "shared the 1975 Nobel Prize for the broader "
                "stereochemistry programme. The lesson worth "
                "carrying: the field spent sixty years "
                "describing handedness RELATIVELY before it "
                "could describe it absolutely, and the "
                "notation you are learning is the artifact of "
                "that transition."
            ),
        ),
        ReadingSection(
            id="rs-edge-cases",
            heading="Honest edge cases",
            body=(
                "The rules as taught here handle every "
                "stereocenter this course will present, but the "
                "full CIP specification is longer, and pretending "
                "otherwise breeds misplaced confidence. Rule 4 "
                "and beyond handle situations where the branches "
                "are constitutionally identical and differ only "
                "in their own stereochemistry - like-versus-"
                "unlike descriptor pairs, and a preference for R "
                "over S when all else ties. These matter in "
                "polycyclic natural products and in some "
                "carbohydrate assignments.\n\n"
                "Software implementations disagree at the "
                "margins, which is itself informative: "
                "cheminformatics toolkits have historically "
                "diverged on hard cases, and modern "
                "implementations of the full specification were "
                "written specifically to settle them. Two "
                "practical consequences for a student. First, "
                "when an assignment feels genuinely ambiguous "
                "under the four rules given, the honest move is "
                "to state the comparison that ties rather than "
                "to guess confidently. Second, when structures "
                "in this course carry computed descriptors - as "
                "the enantiomer figures do - they were assigned "
                "by a toolkit precisely so that the labels do "
                "not rest on an author's eyeball. Deferring to "
                "a verifier where one exists is not weakness; "
                "it is the same discipline that made the "
                "formula checks in every structure figure "
                "worth trusting."
            ),
        ),
        ReadingSection(
            id="rs-problems",
            heading="Problem set: four assignments",
            body=(
                "Problem one: rank these four groups attached to a "
                "stereocenter - $-CH_3$, $-CH_2Br$, $-OH$, $-H$. "
                "Answer: $OH$ (oxygen) is 1; $CH_2Br$ is 2 (its "
                "carbon carries $(Br, H, H)$, beating methyl's "
                "$(H, H, H)$); $CH_3$ is 3; $H$ is 4.\n\n"
                "Problem two: rank $-COOH$, $-CHO$, $-CH_2OH$, "
                "$-CH_3$. Answer: with duplication, carboxyl "
                "presents $(O, O, O)$, aldehyde $(O, O, H)$, "
                "hydroxymethyl $(O, H, H)$, methyl $(H, H, H)$ - "
                "so the order is exactly as listed, decided at "
                "successive terms of the ordered sets.\n\n"
                "Problem three: a drawing shows priorities 1, 2, "
                "3 tracing clockwise, with the priority-4 group "
                "drawn on a WEDGE. What is the configuration? "
                "Answer: S. The clockwise reading would mean R "
                "if the lowest priority pointed away; because it "
                "points toward the viewer, invert once.\n\n"
                "Problem four: a compound is labelled "
                "$(2R,3R)$. Give the descriptors of its "
                "enantiomer and of one diastereomer. Answer: "
                "the enantiomer is $(2S,3S)$ - every center "
                "inverted; a diastereomer is $(2R,3S)$ or "
                "$(2S,3R)$ - some but not all inverted. If the "
                "molecule has the right internal symmetry, "
                "those two descriptors may name a single meso "
                "compound rather than a pair."
            ),
        ),
        ReadingSection(
            id="rs-closing",
            heading="The assignment audit",
            body=(
                "Close with the checklist. ONE: identify the "
                "stereocenter and list its four groups "
                "explicitly, in writing. TWO: rank them, "
                "recording WHY each comparison went the way it "
                "did - atomic number at the first atom, or the "
                "first point of difference outward, or "
                "duplication at a multiple bond. THREE: "
                "establish the geometry - is the lowest priority "
                "pointing away, or toward you? FOUR: read the "
                "wheel, then apply exactly one inversion if step "
                "three said you were looking from the wrong "
                "side. FIVE: sanity-check with a model or by the "
                "swap trick when the stakes are high.\n\n"
                "And SIX, the step that prevents the "
                "chapter's signature error: state what the "
                "label does and does not claim. It fixes the "
                "spatial arrangement absolutely; it predicts "
                "nothing about optical rotation, and it "
                "correlates with D/L only by accident. The "
                "next chapter takes up the measurement that "
                "R/S deliberately does not encode - what a "
                "polarimeter actually reports, why the "
                "racemate reports nothing, and how "
                "enantiomeric excess turns a rotation into a "
                "composition."
            ),
        ),
        ReadingSection(
            id="rs-practice-drill",
            heading="Building speed: the drill that works",
            body=(
                "Assignment is a motor skill more than a "
                "conceptual one, and it responds to a specific "
                "drill. Take any chiral structure and assign it "
                "FOUR times: as drawn, then after rotating the "
                "drawing ninety degrees, then after swapping any "
                "two groups, then after swapping them back. The "
                "correct results are, respectively: the same "
                "label, the same label, the opposite label, and "
                "the original label again.\n\n"
                "That sequence trains the two facts that carry "
                "everything - that ROTATION never changes "
                "configuration while a SWAP always does - and it "
                "self-checks, because getting the wrong pattern "
                "tells you immediately that an error crept in "
                "without needing an answer key. Ten structures "
                "drilled this way builds more reliable speed "
                "than fifty assigned once each, because the "
                "error mode being trained out is not ignorance "
                "of the rules but inconsistency in applying "
                "them under rotation."
            ),
        ),
        ReadingSection(
            id="rs-fischer-preview",
            heading="Reading R/S from a Fischer projection",
            body=(
                "Fischer projections, developed properly later in "
                "this unit, encode stereochemistry by a strict "
                "convention: horizontal bonds come TOWARD the "
                "viewer and vertical bonds recede. That "
                "convention makes R/S assignment fast once you "
                "respect it, and disastrous once you forget "
                "it.\n\n"
                "The shortcut: if the LOWEST priority group sits "
                "on a VERTICAL bond, it is already pointing away "
                "from you, so read 1 to 2 to 3 directly - "
                "clockwise is R. If the lowest priority sits on "
                "a HORIZONTAL bond, it is pointing at you, so "
                "read the wheel and invert once, exactly as with "
                "wedge-dash drawings. The other rule Fischer "
                "projections impose is that they may be rotated "
                "in the plane by 180 degrees (configuration "
                "preserved) but NEVER by 90 degrees and never "
                "lifted out of the plane, because either "
                "operation exchanges the horizontal and vertical "
                "meanings and silently inverts what the drawing "
                "claims. Sugar chemistry runs entirely on these "
                "projections, which is why the convention is "
                "worth learning as rules rather than intuition."
            ),
        ),
        ReadingSection(
            id="rs-nitrogen",
            heading="Stereocenters that are not carbon",
            body=(
                "Carbon is not the only atom that can be "
                "stereogenic. Quaternary AMMONIUM salts with four "
                "different groups on nitrogen are genuinely "
                "chiral and resolvable, and phosphorus and sulfur "
                "stereocenters are common in pharmaceuticals - "
                "the proton-pump inhibitors, for instance, are "
                "chiral at sulfur, and esomeprazole is a "
                "single-enantiomer version of an older racemic "
                "drug.\n\n"
                "Amines are the instructive exception. A "
                "tertiary amine with three different groups plus "
                "a lone pair is formally stereogenic - the lone "
                "pair counts as the lowest priority - but the "
                "molecule undergoes rapid NITROGEN INVERSION, "
                "flipping through a planar transition state "
                "roughly like an umbrella in wind, with a "
                "barrier low enough that the two forms "
                "interconvert millions of times per second at "
                "room temperature. The consequence is that "
                "simple chiral amines cannot be resolved: the "
                "hands equilibrate faster than you can separate "
                "them. Constrain the nitrogen in a small ring, "
                "or quaternise it so no lone pair remains, and "
                "the inversion stops and the chirality becomes "
                "real. The general principle is the one the "
                "ring unit established: a configuration is only "
                "as permanent as the barrier protecting it."
            ),
        ),
        ReadingSection(
            id="rs-exam-patterns",
            heading="How examiners ask it",
            body=(
                "Four costumes recur. THE DIRECT ASSIGNMENT: a "
                "wedge-dash structure with 'assign R or S' - "
                "solved by the six-step audit, with the "
                "wedge-mounted lowest priority as the standard "
                "trap. THE RANKING: 'place these substituents in "
                "order of CIP priority' - solved by explicit "
                "first-point-of-difference comparison, with "
                "duplication for multiple bonds as the standard "
                "trap.\n\n"
                "THE RELATIONSHIP: two structures or two "
                "descriptor sets, 'enantiomers, diastereomers, "
                "or identical?' - solved by counting inversions "
                "(all, some, none) and then checking for meso "
                "symmetry. THE SYSTEMS CONFUSION: 'the (S) "
                "enantiomer rotates light which way?' - whose "
                "correct answer is that R/S does not determine "
                "the sign, and the question can only be "
                "answered by measurement. Notice that three of "
                "the four are about PROCESS rather than "
                "knowledge; the marks live in doing the steps "
                "in order and writing them down, which is also "
                "the only reliable defence against the "
                "single-inversion errors that turn a correct "
                "analysis into a mirror-image answer."
            ),
        ),
        ReadingSection(
            id="rs-vocabulary",
            heading="The vocabulary shelf",
            body=(
                "Shelve these with their tests. ABSOLUTE "
                "CONFIGURATION: the actual spatial arrangement at "
                "a stereocenter, named R or S, determinable from "
                "a structure alone. CIP RULES: the priority "
                "ranking procedure - atomic number, then first "
                "point of difference outward, with duplication "
                "at multiple bonds. R (RECTUS): priorities 1 to 2 "
                "to 3 clockwise with the lowest priority pointing "
                "away. S (SINISTER): the same trace "
                "counterclockwise.\n\n"
                "DEXTROROTATORY $(+)$ and LEVOROTATORY $(-)$: "
                "measured rotation directions, unrelated to R/S "
                "by any rule. D/L: the glyceraldehyde-relative "
                "convention retained for sugars and amino acids. "
                "STEREODESCRIPTOR: the parenthesised locant-plus-"
                "letter prefix in a name, as in $(2R,3S)$ - and "
                "a name lacking one for every stereocenter is an "
                "incomplete name, not a shorthand. That last "
                "point is worth stating plainly, because it is "
                "the difference between specifying a compound "
                "and specifying a family of up to $2^n$ of "
                "them."
            ),
        ),
        ReadingSection(
            id="rs-bridge",
            heading="What R/S deliberately leaves out",
            body=(
                "The system's power comes from what it refuses to "
                "do. It says nothing about how a compound "
                "BEHAVES: not its rotation, not its reactivity, "
                "not its biological activity. It is a coordinate "
                "label - a way of specifying which of two "
                "arrangements exists at a point in a molecule - "
                "and it achieves universality precisely by "
                "staying silent on everything else.\n\n"
                "The remaining chapters supply what it omits. "
                "Optical activity provides the measurement that "
                "detects handedness in a real sample and "
                "quantifies mixtures through enantiomeric "
                "excess. The diastereomer chapter explains why "
                "some stereoisomer pairs behave identically and "
                "others do not. Multiple stereocenters handles "
                "the counting and the meso surprise. Resolution "
                "closes the loop with the separation problem. "
                "Read together, the unit answers four different "
                "questions - what is the arrangement, what do "
                "we call it, how do we detect it, and how do we "
                "obtain it pure - and this chapter has "
                "answered only the second, deliberately and "
                "completely."
            ),
        ),
        ReadingSection(
            id="rs-why-it-transfers",
            heading="Why this notation outlived its rivals",
            body=(
                "It is worth asking why one convention won so "
                "completely. D/L required a chain of chemical "
                "correlations back to a reference compound, so a "
                "single erroneous link corrupted every assignment "
                "downstream, and compounds with no clean "
                "relationship to glyceraldehyde had no label at "
                "all. Rotation signs were measurable but "
                "structurally uninformative, varying with solvent "
                "and temperature and telling you nothing about "
                "arrangement.\n\n"
                "CIP needs neither a reference nor an "
                "instrument: given a structure, the rules "
                "produce the same answer in any laboratory, in "
                "any language, on any day - and they extend "
                "without modification to phosphorus, sulfur, "
                "metal complexes, and stereogenic axes. That "
                "combination of self-sufficiency and "
                "extensibility is what a good notation buys, "
                "and it is why every database, patent, and "
                "regulatory filing now specifies "
                "stereochemistry this way. Learning it is not "
                "learning a convention among equals; it is "
                "learning the one that made stereochemical "
                "communication reliable across every branch of "
                "the science that has to name a shape and be "
                "understood without argument."
            ),
        ),
    ),
    key_takeaways=(
        "CIP ranks by atomic number at the point of attachment, then by first point of difference exploring outward, with multiple bonds handled by duplicating atoms.",
        "Point the lowest priority AWAY, then read 1 to 2 to 3: clockwise is R, counterclockwise is S - and if the lowest priority points toward you, invert exactly once.",
        "R/S, D/L and (+)/(-) are three independent systems: structure-derived, historical-relative, and measured respectively - cysteine and the amino acids prove they do not track each other.",
        "Enantiomers invert EVERY stereocenter, diastereomers invert some - the fastest classification test when descriptors are given, subject to the meso symmetry check.",
        "Write the four groups down and justify each comparison; the assignments that come back inverted are the ones done in one impatient mental motion.",
    ),
))

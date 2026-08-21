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
        ReadingSection(
            id="rs-one-line",
            heading="The chapter in one line",
            body=(
                "If everything else fades, keep this: rank the four "
                "groups by the CIP rules, put the lowest priority "
                "behind the molecule, and read one-two-three - "
                "clockwise R, counterclockwise S - inverting exactly "
                "once if you were forced to look from the wrong side. "
                "Every worked example, every trap, and every exam "
                "costume in this chapter is that single sentence "
                "applied carefully rather than quickly."
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


# --------------------------------------------------------------------------
# 6.3 Optical activity
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.OPTICALACTIVITY",
    lead=(
        "R and S name a shape from a drawing; they say nothing about what a "
        "sample in a flask will do. Optical activity is the measurement that "
        "closes that gap - the one physical property in which enantiomers "
        "genuinely differ, because polarised light is itself a chiral probe. "
        "This chapter builds the polarimeter and its equation, works the "
        "specific-rotation arithmetic, defines enantiomeric excess and "
        "computes compositions from rotations, and is honest about where "
        "the classical method has been superseded."
    ),
    sections=(
        ReadingSection(
            id="oa-light",
            heading="Why polarised light can see handedness",
            body=(
                "Ordinary light oscillates in every plane perpendicular to "
                "its direction of travel. A POLARISER transmits only the "
                "component oscillating in one plane, producing "
                "PLANE-POLARISED light. That single plane is the key: a "
                "plane-polarised beam can be decomposed into two "
                "circularly polarised components of opposite handedness, "
                "one turning clockwise and one counterclockwise as it "
                "advances.\n\n"
                "In an ACHIRAL medium those two components travel at "
                "identical speeds, recombine unchanged, and the plane "
                "emerges where it entered. In a CHIRAL medium they do "
                "not: a one-handed molecular environment interacts "
                "slightly differently with the two circular components, "
                "so they acquire different refractive indices and fall "
                "out of step. When they recombine, the resultant plane "
                "has been ROTATED. This is why the previous chapters "
                "could keep insisting that enantiomers differ only in a "
                "chiral environment and then quote optical rotation as "
                "the exception - the exception is not an exception at "
                "all. Plane-polarised light IS a chiral probe, and a "
                "polarimeter is the cheapest chiral environment a "
                "laboratory owns."
            ),
        ),
        ReadingSection(
            id="oa-polarimeter",
            heading="The instrument and its equation",
            figure=Figure(
                stem="org1-polarimeter",
                caption=(
                    "A polarimeter: light is plane-polarised, passes through a sample tube of path length l holding concentration c, and emerges with its plane rotated by the observed angle, which the analyser measures. Specific rotation normalises that angle for path length and concentration."
                ),
                alt="Schematic polarimeter showing source, polariser, sample tube, rotated plane of polarisation and analyser, with the specific rotation equation.",
            ),
            body=(
                "The measured quantity, the OBSERVED ROTATION "
                "$\\alpha_{obs}$, depends on how many chiral molecules "
                "the beam met - so it grows with both the concentration "
                "and the length of the tube, and a raw angle is "
                "meaningless without them. Normalising gives a genuine "
                "material property, the SPECIFIC ROTATION:\n\n"
                "$$[\\alpha]_{D}^{20} = \\frac{\\alpha_{obs}}"
                "{l \\times c}$$\n\n"
                "with $l$ the path length in DECIMETRES and $c$ the "
                "concentration in grams per millilitre (for a neat "
                "liquid, density replaces concentration). The subscript "
                "$D$ records the wavelength - conventionally the sodium "
                "D line at $589$ nm - and the superscript records the "
                "temperature in degrees Celsius, because rotation "
                "depends on both. A properly reported value therefore "
                "looks like $[\\alpha]_{D}^{20} = +13.5$ (c 1.0, "
                "ethanol): number, wavelength, temperature, "
                "concentration and solvent, because the same compound "
                "reports differently under different conditions.\n\n"
                "Sign convention: rotation to the RIGHT (clockwise from "
                "the observer's view) is DEXTROROTATORY, written $(+)$ "
                "or the older $d$; rotation to the LEFT is "
                "LEVOROTATORY, $(-)$ or $l$. Note carefully that the "
                "lowercase $d$ and $l$ of rotation are NOT the D and L "
                "of the glyceraldehyde convention - a collision of "
                "notation that has confused students for a century and "
                "is the reason modern writing prefers $(+)$ and $(-)$."
            ),
        ),
        ReadingSection(
            id="oa-worked-specific",
            heading="Worked: from a reading to a material constant",
            body=(
                "A solution is prepared by dissolving $0.40$ g of a "
                "chiral compound in enough ethanol to make $10.0$ mL, "
                "and it is measured in a $1.0$ dm tube at $20$ degrees "
                "Celsius using the sodium D line. The analyser reads "
                "$+0.54$ degrees. Compute the specific rotation.\n\n"
                "First the concentration in the units the formula "
                "wants: $c = 0.40 \\text{ g} / 10.0 \\text{ mL} = "
                "0.040$ g/mL. Then substitute:\n\n"
                "$$[\\alpha]_{D}^{20} = \\frac{+0.54}{1.0 \\times "
                "0.040} = +13.5$$\n\n"
                "The answer is quoted as $[\\alpha]_{D}^{20} = +13.5$ "
                "(c 0.04, ethanol) - a number that now belongs to the "
                "COMPOUND rather than to this particular flask, and "
                "which another laboratory can reproduce. Reverse the "
                "calculation to predict a reading: the same compound at "
                "half the concentration in the same tube would give "
                "$\\alpha_{obs} = 13.5 \\times 1.0 \\times 0.020 = "
                "+0.27$ degrees. Two habits prevent the standard "
                "errors: convert the path length to DECIMETRES (a "
                "10-cm tube is $1$ dm, not $10$), and keep "
                "concentration in g/mL rather than the g/L or molarity "
                "the rest of chemistry uses."
            ),
        ),
        ReadingSection(
            id="oa-racemate",
            heading="Why a racemate reads zero",
            body=(
                "Enantiomers rotate light by EQUAL magnitudes in "
                "OPPOSITE directions: if one hand is $[\\alpha]_D = "
                "+13.5$, its mirror image is exactly $-13.5$ under the "
                "same conditions. In a racemic mixture, every molecule "
                "of one hand is matched by one of the other, the two "
                "contributions cancel exactly, and the polarimeter "
                "reads ZERO. A racemate is described as OPTICALLY "
                "INACTIVE, and the older notation $(\\pm)$ marks "
                "it.\n\n"
                "The consequence for exam reasoning is sharp: a zero "
                "reading does NOT mean the sample is achiral. Three "
                "different situations give zero - a genuinely achiral "
                "compound, a racemic mixture of enantiomers, and a "
                "meso compound (chiral centres present but internally "
                "compensated, the subject of a later chapter). "
                "Distinguishing them requires other evidence: chiral "
                "chromatography separates a racemate into two peaks "
                "while an achiral compound gives one, and structural "
                "analysis identifies the internal mirror plane of a "
                "meso compound. A polarimeter answers 'is this sample "
                "unbalanced?' and nothing more."
            ),
        ),
        ReadingSection(
            id="oa-ee",
            heading="Enantiomeric excess: turning an angle into a composition",
            figure=Figure(
                stem="org1-ee-rotation",
                caption=(
                    "Observed rotation is linear in enantiomeric excess: the racemate sits at zero, the pure enantiomers at the ends, and a sample reading half the pure rotation is 50 percent ee - which is a 75:25 mixture, not 50:50."
                ),
                alt="Straight line of observed rotation against enantiomeric excess from minus 100 to plus 100 percent, with the racemate marked at the origin and pure enantiomers at the extremes.",
            ),
            body=(
                "Real samples are usually neither pure nor perfectly "
                "racemic, and the quantity that describes them is "
                "ENANTIOMERIC EXCESS - the amount by which the major "
                "enantiomer exceeds the minor, expressed as a "
                "percentage of the whole:\n\n"
                "$$\\%\\,ee = \\frac{|[R] - [S]|}{[R] + [S]} "
                "\\times 100$$\n\n"
                "Because each pair of opposite molecules cancels "
                "optically, only the EXCESS rotates light - which "
                "makes the relationship between rotation and "
                "composition perfectly linear, as the figure shows:\n\n"
                "$$\\%\\,ee = \\frac{\\alpha_{obs}}"
                "{\\alpha_{pure}} \\times 100 = "
                "\\frac{[\\alpha]_{observed}}{[\\alpha]_{pure}} "
                "\\times 100$$\n\n"
                "The composition follows from the excess by a single "
                "rearrangement worth memorising, because it is where "
                "most students slip:\n\n"
                "$$\\%\\,\\text{major} = \\frac{100 + ee}{2}, "
                "\\qquad \\%\\,\\text{minor} = "
                "\\frac{100 - ee}{2}$$\n\n"
                "So $50$ percent ee is NOT a 50:50 mixture - it is "
                "$75:25$. The intuition: the $25$ percent minor "
                "enantiomer cancels $25$ percent of the major, leaving "
                "$50$ percent uncancelled to rotate the light."
            ),
        ),
        ReadingSection(
            id="oa-worked-ee",
            heading="Worked: composition from a reading",
            body=(
                "A compound's pure $(+)$ enantiomer has "
                "$[\\alpha]_{D}^{20} = +13.5$. A sample of the same "
                "compound, measured under identical conditions, gives "
                "$[\\alpha]_{D}^{20} = +6.75$. What is in the "
                "flask?\n\n"
                "Enantiomeric excess first:\n\n"
                "$$\\%\\,ee = \\frac{+6.75}{+13.5} \\times 100 "
                "= 50\\%$$\n\n"
                "Then composition:\n\n"
                "$$\\%\\,(+) = \\frac{100 + 50}{2} = 75\\%, "
                "\\qquad \\%\\,(-) = \\frac{100 - 50}{2} = "
                "25\\%$$\n\n"
                "The sample is $75$ percent $(+)$ and $25$ percent "
                "$(-)$ - equivalently, $50$ percent of it behaves as "
                "pure $(+)$ and $50$ percent as racemate. Run the "
                "check backwards to confirm: $75 - 25 = 50$ percent "
                "excess, and $50$ percent of $+13.5$ is $+6.75$, the "
                "reading we started from.\n\n"
                "A second pattern worth rehearsing: if a synthesis "
                "reports $90$ percent ee, the product is "
                "$(100+90)/2 = 95$ percent of the desired enantiomer "
                "and $5$ percent of the unwanted one. For a "
                "pharmaceutical that $5$ percent is a separate "
                "substance present at fifty thousand parts per "
                "million, which is why regulatory specifications are "
                "written in ee and why the difference between $90$ "
                "and $99$ percent ee is a process-chemistry "
                "battleground rather than a rounding argument."
            ),
        ),
        ReadingSection(
            id="oa-optical-purity",
            heading="Optical purity, and where it stops agreeing with ee",
            body=(
                "OPTICAL PURITY is defined as the ratio of a sample's "
                "observed specific rotation to that of the pure "
                "enantiomer, times $100$ - which is exactly the second "
                "equation above. For well-behaved samples optical "
                "purity and enantiomeric excess are numerically the "
                "same, and introductory treatments use the terms "
                "interchangeably.\n\n"
                "They are not the same CONCEPT, and the distinction "
                "matters when precision does. Enantiomeric excess is a "
                "statement about COMPOSITION - how many molecules of "
                "each hand are present. Optical purity is a statement "
                "about a MEASUREMENT - how much the sample rotates "
                "relative to the pure material. The two coincide only "
                "when rotation is strictly linear in composition, and "
                "that linearity can fail: at high concentrations, "
                "molecules of one hand may associate preferentially "
                "with their own kind or with the other, and the "
                "resulting non-ideal behaviour makes the observed "
                "rotation drift from proportionality. Impurities that "
                "are themselves chiral corrupt the reading outright, "
                "as does an incorrect literature value for "
                "$[\\alpha]_{pure}$ - and historical literature "
                "contains plenty of those. The modern practice is to "
                "MEASURE composition directly by chiral "
                "chromatography and reserve polarimetry for "
                "confirmation, which is the subject of the honesty "
                "section below."
            ),
        ),
        ReadingSection(
            id="oa-variables",
            heading="What changes a rotation reading",
            table=Table(
                caption="Variables that a reported specific rotation must specify",
                columns=("Variable", "Effect on the reading", "Convention"),
                rows=(
                    ("path length l", "rotation proportional to it", "reported in DECIMETRES"),
                    ("concentration c", "rotation proportional to it", "g/mL, quoted with the value"),
                    ("wavelength", "rotation varies strongly; larger at shorter wavelengths", "sodium D line, 589 nm (subscript D)"),
                    ("temperature", "changes rotation measurably", "quoted as a superscript, commonly 20 or 25 C"),
                    ("solvent", "can change magnitude and even SIGN", "always named alongside the value"),
                    ("enantiomeric excess", "rotation linear in ee", "the quantity being determined"),
                ),
                source="Standard polarimetry reporting conventions as used in the physical-organic and pharmacopoeial literature",
                note="A specific rotation quoted without wavelength, temperature, concentration and solvent is not reproducible.",
            ),
            body=(
                "The table explains why the notation carries so much "
                "baggage. Each variable genuinely moves the number, "
                "and the SOLVENT entry is the one that surprises "
                "people: a compound can rotate light one way in "
                "chloroform and the other way in ethanol, because "
                "solvation changes the molecular environment the light "
                "actually samples. That single fact should end any "
                "lingering hope that the sign of rotation encodes "
                "structure - a property that flips with the bottle you "
                "dissolve it in cannot be a structural "
                "descriptor.\n\n"
                "Wavelength dependence has its own name and its own "
                "instrument. Measuring rotation ACROSS wavelengths "
                "gives OPTICAL ROTATORY DISPERSION, and the related "
                "technique of CIRCULAR DICHROISM measures the "
                "differential ABSORPTION of the two circularly "
                "polarised components rather than their differential "
                "speed. Both carry far more structural information "
                "than a single-wavelength rotation, and circular "
                "dichroism in particular is the routine method for "
                "monitoring protein secondary structure - a direct "
                "descendant of this chapter's physics, doing work "
                "that a sodium-lamp polarimeter never could."
            ),
        ),
        ReadingSection(
            id="oa-honesty",
            heading="Where polarimetry has been superseded",
            body=(
                "This chapter would mislead if it left the impression "
                "that enantiomeric purity is determined by polarimetry "
                "in a modern laboratory. It usually is not. CHIRAL "
                "CHROMATOGRAPHY - a column whose stationary phase is "
                "itself chiral - separates the two enantiomers into "
                "distinct peaks whose areas give the composition "
                "DIRECTLY, without needing a literature value for the "
                "pure rotation, without linearity assumptions, and "
                "with sensitivity to fractions of a percent. It is the "
                "regulatory standard.\n\n"
                "NMR with a chiral shift reagent or chiral derivatising "
                "agent does the same job by converting the enantiomers "
                "into diastereomeric species whose signals separate and "
                "integrate. Polarimetry survives for three honest "
                "reasons: it is fast, cheap and non-destructive; it is "
                "written into pharmacopoeial monographs as an identity "
                "and purity check; and it remains the clearest "
                "teaching demonstration that chirality has physical "
                "consequences. Knowing WHY it was displaced is part of "
                "understanding it: a method that depends on a "
                "correct literature constant, on strict linearity, "
                "and on the absence of chiral impurities has three "
                "ways to lie, and the chromatographic method has "
                "none of them."
            ),
        ),
        ReadingSection(
            id="oa-history",
            heading="Biot, Pasteur, and a measurement before a theory",
            body=(
                "Jean-Baptiste Biot discovered optical activity in the "
                "early nineteenth century, observing that certain "
                "natural substances - quartz crystals, turpentine, "
                "sugar solutions - rotated the plane of polarised "
                "light, and establishing the proportionalities to path "
                "length and concentration that still bear on the "
                "equation above. Crucially, he found that some "
                "substances rotated light in SOLUTION, not only as "
                "crystals: the property therefore belonged to the "
                "MOLECULES, not to a crystal lattice.\n\n"
                "That was the observation Pasteur inherited in 1848 "
                "when he separated tartrate crystals by hand and "
                "measured their solutions separately - the experiment "
                "the chirality chapter told - and it is why "
                "polarimetry, not structure determination, was the "
                "foundational instrument of stereochemistry. For "
                "roughly a century, optical rotation was the ONLY "
                "practical window onto molecular handedness: van 't "
                "Hoff and Le Bel's tetrahedral carbon was proposed to "
                "EXPLAIN rotation data, and absolute configuration "
                "remained unknown until Bijvoet's X-ray work in 1951. "
                "The order matters pedagogically: measurement came "
                "first, structural interpretation second, and absolute "
                "assignment third - which is roughly the reverse of "
                "how the subject is now taught."
            ),
        ),
        ReadingSection(
            id="oa-errors",
            heading="The error catalogue: five polarimetry traps",
            body=(
                "Trap one: assuming a zero reading means an achiral "
                "compound. Racemates and meso compounds read zero too, "
                "and distinguishing the three requires something other "
                "than a polarimeter. Trap two: treating $50$ percent "
                "ee as a $50:50$ mixture. It is $75:25$; the "
                "$(100 \\pm ee)/2$ conversion exists precisely "
                "because that intuition is wrong.\n\n"
                "Trap three: predicting the sign of rotation from R or "
                "S, or from D or L. No rule connects them - the "
                "systems chapter made this the centrepiece, and "
                "solvent-dependent sign changes prove it "
                "physically. Trap four: unit errors in the specific-"
                "rotation formula - path length in centimetres "
                "instead of decimetres (a factor of ten), or "
                "concentration in g/L instead of g/mL (a factor of a "
                "thousand). Trap five: comparing a measured rotation "
                "against a literature value obtained at a different "
                "wavelength, temperature, concentration or solvent. "
                "The reported conditions are not decoration; two of "
                "the five traps are unit-and-condition errors, which "
                "is why the audit at the end of this chapter starts "
                "by writing the conditions down."
            ),
        ),
        ReadingSection(
            id="oa-problems",
            heading="Problem set: four calculations",
            body=(
                "Problem one: $0.25$ g of a compound is dissolved to "
                "$5.0$ mL and read in a $1.0$ dm tube, giving "
                "$-1.20$ degrees. Find $[\\alpha]$. Answer: "
                "$c = 0.050$ g/mL, so "
                "$[\\alpha] = -1.20/(1.0 \\times 0.050) = -24$ - "
                "levorotatory.\n\n"
                "Problem two: the pure $(-)$ enantiomer of that "
                "compound has $[\\alpha] = -24$. A different sample "
                "reads $-18$ under identical conditions. Give the ee "
                "and the composition. Answer: "
                "$ee = (18/24) \\times 100 = 75$ percent; "
                "composition $(100+75)/2 = 87.5$ percent $(-)$ and "
                "$12.5$ percent $(+)$.\n\n"
                "Problem three: a reaction using achiral reagents on "
                "an achiral substrate produces a chiral product. What "
                "will the polarimeter read, and why? Answer: zero - a "
                "symmetric process cannot prefer one hand, so the "
                "product is racemic and optically inactive by "
                "cancellation.\n\n"
                "Problem four: a sample reads $+0.00$ degrees. List "
                "three structurally different explanations. Answer: "
                "the compound is achiral; the sample is a racemate; "
                "or the compound is meso (stereocentres present, "
                "internally compensated). A fourth practical "
                "possibility worth naming: the compound is chiral and "
                "enantiopure but happens to have a very small "
                "specific rotation at the wavelength used - a real "
                "phenomenon, and another reason chromatography "
                "replaced polarimetry for purity work."
            ),
        ),
        ReadingSection(
            id="oa-closing",
            heading="The measurement audit",
            body=(
                "Close with the checklist this chapter installs. ONE: "
                "write down the CONDITIONS - path length in "
                "decimetres, concentration in g/mL, wavelength, "
                "temperature, solvent - before touching the "
                "arithmetic, because two of the five standard errors "
                "live here. TWO: compute the specific rotation and "
                "recognise it as a material constant, not a property "
                "of your flask. THREE: if a purity question is being "
                "asked, convert to enantiomeric excess by comparing "
                "against the pure value, then convert ee to "
                "composition with $(100 \\pm ee)/2$ - and say the "
                "ratio out loud so that $75:25$ never gets reported "
                "as $50:50$.\n\n"
                "FOUR: state what the reading cannot tell you - it "
                "cannot identify which enantiomer is in excess "
                "without a reference, it cannot distinguish achiral "
                "from racemic from meso at zero, and it cannot be "
                "predicted from an R/S label. The next chapters take "
                "up what happens when a molecule carries SEVERAL "
                "stereocentres, where compensation can occur inside "
                "a single molecule rather than between two of them - "
                "which is exactly how a meso compound comes to read "
                "zero on this instrument while being, atom for atom, "
                "a perfectly ordinary stereoisomer."
            ),
        ),
        ReadingSection(
            id="oa-magnitudes",
            heading="Reading the magnitudes: what counts as a big rotation",
            body=(
                "Specific rotations span an enormous range, and "
                "calibrating expectations prevents both false alarms "
                "and false confidence. Simple chiral molecules with a "
                "single stereocentre often sit in the single or low "
                "double digits - values of a few degrees are entirely "
                "normal, and a compound with $[\\alpha]_D$ near $2$ "
                "is genuinely chiral even though the reading is barely "
                "above instrument noise at modest concentrations. "
                "Sucrose, the historical workhorse, sits near $+66$; "
                "some rigid polycyclic natural products and helicenes "
                "run into the hundreds or thousands.\n\n"
                "Two practical consequences follow. A SMALL rotation "
                "demands a longer tube or higher concentration to "
                "measure reliably, which is exactly why the equation "
                "has $l$ and $c$ in it - the experimenter controls "
                "both to bring $\\alpha_{obs}$ into a readable range. "
                "And a small literature value makes the ee-from-"
                "rotation calculation fragile, because a few tenths of "
                "a degree of error becomes a large percentage error in "
                "the ratio. Compounds with tiny rotations are precisely "
                "the ones whose enantiopurity should be determined "
                "chromatographically rather than optically - the "
                "instrument's limitation, honestly stated, tells you "
                "when to reach for a different instrument."
            ),
        ),
        ReadingSection(
            id="oa-sucrose",
            heading="Inversion of sucrose: the classic kinetic use",
            body=(
                "Polarimetry's other historical role was watching "
                "reactions in real time, and the standard demonstration "
                "is the acid-catalysed hydrolysis of sucrose. Sucrose "
                "itself is dextrorotatory. Hydrolysis cleaves it into "
                "glucose and fructose - and fructose is strongly "
                "levorotatory, strongly enough that the MIXTURE rotates "
                "light to the left. The sign of the solution therefore "
                "flips from positive to negative as the reaction "
                "proceeds, which is why the product mixture has been "
                "called INVERT SUGAR since the nineteenth century and "
                "why the enzyme that performs the cleavage is called "
                "invertase.\n\n"
                "Because rotation is proportional to concentration, "
                "tracking the angle over time tracks the reaction's "
                "progress directly - a continuous, non-destructive "
                "kinetic assay requiring no sampling or quenching. "
                "Generations of physical-chemistry students determined "
                "rate constants this way, and the food industry still "
                "uses polarimetry for sugar analysis. The transferable "
                "idea is worth naming: any reaction in which optical "
                "rotation CHANGES - a chiral substrate consumed, a "
                "chiral product formed, or a stereocentre inverted - "
                "can in principle be followed on a polarimeter, and "
                "racemisation reactions in particular are studied "
                "exactly this way, by watching a rotation decay toward "
                "zero."
            ),
        ),
        ReadingSection(
            id="oa-racemisation",
            heading="Watching configuration die: racemisation",
            body=(
                "A sample of one enantiomer whose rotation decays "
                "toward zero over time is RACEMISING - converting "
                "toward the 50:50 mixture. Since chapter 6.1 "
                "established that configuration is protected by "
                "bond-breaking barriers, racemisation means those "
                "barriers are being crossed: a stereocentre alpha to a "
                "carbonyl can lose and regain its proton through an "
                "achiral enol, a carbocation intermediate can be "
                "attacked from either face, and a stereogenic nitrogen "
                "simply inverts.\n\n"
                "The measurement is diagnostic in two directions. "
                "Watching rotation decay QUANTIFIES the rate at which "
                "a compound loses its stereochemical integrity - "
                "critical information for a drug that must reach its "
                "target as one hand, and precisely the property "
                "thalidomide turned out to possess. And observing NO "
                "decay over long periods is evidence that the "
                "configuration is robust, which is what allows "
                "enantiopure compounds to be bottled, shipped and "
                "sold. The thermodynamics is worth stating plainly: "
                "racemisation is always downhill, because the racemate "
                "has higher entropy than either pure enantiomer and "
                "the two hands are equal in energy. A pure enantiomer "
                "is therefore a kinetically protected state, never a "
                "thermodynamically preferred one - it survives only "
                "because the barrier is high, not because nature "
                "prefers it."
            ),
        ),
        ReadingSection(
            id="oa-biology-scale",
            heading="Where enantiomeric excess is written into law",
            body=(
                "Enantiomeric excess stopped being an academic number "
                "when regulators began treating the two hands of a "
                "chiral drug as two substances. A single-enantiomer "
                "product must specify how much of the other hand it "
                "contains, must characterise that impurity's own "
                "pharmacology and toxicology, and must demonstrate "
                "that the specification is met batch after batch. "
                "Specifications in the high nines are routine, which "
                "is why process chemists care about the difference "
                "between $98$ and $99.5$ percent ee in a way that "
                "looks obsessive from outside.\n\n"
                "Run the composition arithmetic to see why: $98$ "
                "percent ee means $1$ percent of the unwanted "
                "enantiomer, while $99.5$ percent ee means $0.25$ "
                "percent - a fourfold reduction in a substance that "
                "may have its own activity, its own metabolism and "
                "its own safety profile. On a tonne scale that is the "
                "difference between shipping ten kilograms of a "
                "second drug and shipping two and a half. The same "
                "arithmetic governs food and fragrance chemistry, "
                "where the wrong hand is not dangerous but smells or "
                "tastes wrong, and agricultural chemistry, where "
                "single-enantiomer formulations cut the applied mass "
                "of an active substance roughly in half."
            ),
        ),
        ReadingSection(
            id="oa-exam-patterns",
            heading="How examiners ask it",
            body=(
                "Four costumes recur. THE CALCULATION: a reading, a "
                "path length and a concentration, 'find the specific "
                "rotation' - solved by the formula, with decimetres "
                "and g/mL as the planted trap. THE COMPOSITION: an "
                "observed rotation against a pure value, 'what is the "
                "ee and the percentage of each enantiomer' - solved "
                "in two steps, with the $50$-percent-ee-is-$75:25$ "
                "conversion as the discriminator.\n\n"
                "THE ZERO READING: 'a sample shows no optical "
                "activity - what can you conclude?' - whose correct "
                "answer enumerates achiral, racemic and meso rather "
                "than picking one. THE CROSS-SYSTEM TRAP: 'the (R) "
                "enantiomer will rotate light in which direction?' - "
                "whose correct answer is that configuration does not "
                "determine the sign and only measurement can. Notice "
                "that two of the four are answered by refusing to "
                "over-conclude, which is the disposition this chapter "
                "has been arguing for throughout: the polarimeter "
                "reports one number about balance, and every claim "
                "beyond that number needs a different instrument."
            ),
        ),
        ReadingSection(
            id="oa-vocabulary",
            heading="The vocabulary shelf",
            body=(
                "Shelve these with their tests. OPTICALLY ACTIVE: "
                "rotates the plane of polarised light - true of any "
                "sample with an excess of one enantiomer. "
                "DEXTROROTATORY $(+)$ and LEVOROTATORY $(-)$: the "
                "measured directions, right and left, unrelated to "
                "R/S or D/L by any rule. OBSERVED ROTATION: the raw "
                "angle, meaningless without conditions. SPECIFIC "
                "ROTATION $[\\alpha]$: the angle normalised by path "
                "length and concentration - a material constant, "
                "quoted with wavelength, temperature, concentration "
                "and solvent.\n\n"
                "RACEMIC / OPTICALLY INACTIVE: equal hands, "
                "cancelling to zero. ENANTIOMERIC EXCESS: the "
                "composition measure, linear in rotation, converted "
                "to percentages by $(100 \\pm ee)/2$. OPTICAL "
                "PURITY: the measurement ratio that usually equals "
                "ee and can diverge from it under non-ideal "
                "conditions. RACEMISATION: the decay of an excess "
                "toward zero as configuration is lost. Each term "
                "carries either a measurement or a conversion, which "
                "is what makes this chapter's vocabulary usable "
                "rather than decorative."
            ),
        ),
        ReadingSection(
            id="oa-meso-preview",
            heading="Internal compensation: the preview of meso",
            body=(
                "One case deserves flagging before the next chapters "
                "arrive, because it is the most elegant zero reading "
                "in the subject. A racemate reads zero because two "
                "SEPARATE molecules cancel each other. A MESO compound "
                "reads zero because a single molecule cancels ITSELF: "
                "it carries stereocentres, but an internal mirror "
                "plane relates one half to the other, so the rotation "
                "generated by one stereocentre is exactly opposed by "
                "its partner within the same structure.\n\n"
                "The distinction is invisible to the polarimeter and "
                "obvious to a chemist. Separate a racemate on a "
                "chiral column and you get two peaks; put a meso "
                "compound on the same column and you get one, because "
                "there is only one substance present and it is "
                "achiral. Both read zero, and only structural "
                "reasoning tells them apart - which is why the "
                "chirality chapter insisted that the symmetry test "
                "overrules stereocentre counting, and why the "
                "multiple-stereocentre chapter can now be written "
                "without leaving a mystery behind it."
            ),
        ),
        ReadingSection(
            id="oa-instrument-practice",
            heading="Running the measurement well",
            body=(
                "The practical procedure repays knowing, because most "
                "bad polarimetry is procedural rather than "
                "conceptual. ZERO the instrument on the pure solvent "
                "in the same tube first - any residual reading is "
                "instrumental or from the glass, and it subtracts "
                "from every subsequent measurement. FILL the tube "
                "without bubbles: a bubble in the light path scatters "
                "and destabilises the reading, which is why sample "
                "tubes have a bulge to trap one away from the "
                "beam.\n\n"
                "CONTROL the temperature, because rotation drifts "
                "with it and the reported superscript is a promise. "
                "FILTER particulates, since scattering degrades the "
                "extinction the analyser depends on. And take "
                "REPLICATE readings, rotating the analyser toward the "
                "minimum from both directions, because the human eye "
                "judging extinction has a systematic bias that "
                "averaging removes - modern photoelectric instruments "
                "automate exactly this. Finally, mind the "
                "AMBIGUITY of large rotations: an instrument reading "
                "$+20$ degrees cannot distinguish that from $-340$, "
                "or from $+380$, so a sample suspected of a large "
                "rotation is re-measured at a different concentration "
                "or path length, where the true value scales "
                "predictably and the artefacts do not. That check is "
                "the one most often skipped and the one most likely "
                "to embarrass a published number."
            ),
        ),
        ReadingSection(
            id="oa-bridge",
            heading="What the next chapters add",
            body=(
                "This chapter completes the pair the unit opened with. "
                "Chapter 6.1 established that handedness exists and "
                "matters; 6.2 gave it a name that any chemist can "
                "reproduce from a drawing; and 6.3 has given it a "
                "measurement that reports on a real sample in a real "
                "flask, along with the arithmetic that turns an angle "
                "into a composition.\n\n"
                "What remains is multiplicity and separation. When a "
                "molecule carries more than one stereocentre, the "
                "stereoisomers multiply toward $2^n$, the "
                "relationships between them stop being simply "
                "'mirror image or not,' and internal compensation "
                "produces the meso compounds previewed above - that "
                "is the diastereomer and multiple-stereocentre "
                "material. Then Fischer projections give sugars a "
                "workable notation for five stereocentres at once. "
                "And resolution closes the unit by answering the "
                "practical question this chapter's ee arithmetic "
                "keeps raising: given a racemate, how do you actually "
                "get one hand out of the bottle? The answer "
                "involves converting enantiomers into diastereomers "
                "on purpose, exploiting the property difference this "
                "chapter has spent its length establishing - that "
                "hands are distinguishable only in a chiral "
                "environment, so the way to separate them is to build "
                "one."
            ),
        ),
        ReadingSection(
            id="oa-one-line",
            heading="The chapter in one line",
            body=(
                "A polarimeter answers exactly one question - is this "
                "sample optically unbalanced, and by how much - and it "
                "answers it through a single normalised constant, the "
                "specific rotation, measured under conditions that must "
                "always be quoted. Everything useful downstream is "
                "arithmetic on that one number: divide by the pure "
                "value for enantiomeric excess, then convert with "
                "$(100 \\pm ee)/2$ for the actual composition. "
                "Everything the instrument cannot do - naming which "
                "hand, distinguishing achiral from racemic from meso, "
                "predicting a sign from a structure - needs a "
                "different method, and knowing which is which is the "
                "whole professional skill this chapter teaches."
            ),
        ),
    ),
    key_takeaways=(
        "Plane-polarised light is a chiral probe: its two circular components travel at different speeds through a chiral medium, so the plane emerges rotated - the one physical property in which enantiomers differ.",
        "Specific rotation normalises the reading: path length in DECIMETRES, concentration in g/mL, with wavelength, temperature and solvent reported because each changes the number (solvent can even flip the sign).",
        "Racemates read zero by cancellation - but so do achiral and meso samples, so a zero reading identifies nothing on its own.",
        "Enantiomeric excess is linear in rotation, and composition is (100 +/- ee)/2 - which makes 50 percent ee a 75:25 mixture, not 50:50.",
        "Polarimetry founded the field and still serves as a fast identity check, but chiral chromatography measures composition directly and has replaced it wherever the number must be trusted.",
    ),
))


# --------------------------------------------------------------------------
# 6.4 Enantiomers and diastereomers
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.ENANTIODIA",
    lead=(
        "Two structures on a page, and one question that decides everything "
        "downstream: what is their relationship? The answer is one of four - "
        "identical, constitutional isomers, enantiomers, or diastereomers - "
        "and it is reached by asking three yes/no questions in a fixed "
        "order. This chapter builds that decision procedure, then explains "
        "the consequence that makes it worth the trouble: enantiomers are "
        "separable only by chiral means, while diastereomers are separable "
        "by ordinary distillation and crystallisation - which is the entire "
        "basis of resolution."
    ),
    sections=(
        ReadingSection(
            id="ed-tree",
            heading="The decision procedure",
            figure=Figure(
                stem="org1-stereo-relationships",
                caption=(
                    "Three questions in order decide any pair of structures: same formula, same connectivity, and non-superimposable mirror images - yielding constitutional isomers, enantiomers, diastereomers, or the same compound."
                ),
                alt="Decision tree flowchart from same molecular formula through same connectivity to mirror-image test, branching to constitutional isomers, enantiomers and diastereomers.",
            ),
            body=(
                "Run the questions in the order the figure gives them, and "
                "never out of order. QUESTION ONE: same molecular formula? "
                "If not, the structures are unrelated compounds and the "
                "analysis ends. QUESTION TWO: same CONNECTIVITY - is every "
                "atom bonded to the same partners? If not, they are "
                "CONSTITUTIONAL (structural) isomers, differing in their "
                "bonding skeleton, and stereochemistry never enters. "
                "Butan-1-ol and butan-2-ol are constitutional isomers; so "
                "are the pentane isomers of chapter 2.\n\n"
                "QUESTION THREE, reached only when formula and connectivity "
                "both match, is the stereochemical one: are the two "
                "structures non-superimposable MIRROR IMAGES of each other? "
                "If yes, they are ENANTIOMERS. If they are stereoisomers "
                "but NOT mirror images, they are DIASTEREOMERS. And if they "
                "turn out to be superimposable after all, they are the same "
                "compound drawn twice - the answer students most often miss, "
                "because rotating a drawing is not a change of "
                "substance.\n\n"
                "The order matters because the questions are independent "
                "and each narrows the field. Attempting the mirror test on "
                "structures with different connectivity is meaningless "
                "work, and calling a pair 'isomers' without saying which "
                "kind conveys almost nothing about how they will behave."
            ),
        ),
        ReadingSection(
            id="ed-descriptor-test",
            heading="The fast test when descriptors are given",
            body=(
                "When both structures come with R/S labels, the "
                "relationship falls out of arithmetic rather than "
                "visualisation - which is why the R/S chapter insisted on "
                "assigning every centre. Compare the descriptors centre by "
                "centre and count the inversions.\n\n"
                "EVERY centre inverted means ENANTIOMERS: $(2R,3S)$ and "
                "$(2S,3R)$ are mirror images throughout. SOME BUT NOT ALL "
                "inverted means DIASTEREOMERS: $(2R,3R)$ and $(2R,3S)$ "
                "differ at one centre only, so they cannot be mirror "
                "images. NO centres inverted means the SAME compound. The "
                "rule is exact for as many stereocentres as a molecule "
                "carries - with a single caution that the next chapter "
                "develops in full: internal symmetry can make an "
                "all-inverted pair turn out to be one achiral substance "
                "rather than two enantiomers, which is exactly what a meso "
                "compound is.\n\n"
                "That caution is why the mirror test never fully retires. "
                "Descriptor counting is fast and correct in the ordinary "
                "case; the symmetry check catches the exception. Run "
                "counting first, then ask whether the molecule has an "
                "internal mirror plane before declaring a pair of "
                "enantiomers."
            ),
        ),
        ReadingSection(
            id="ed-properties",
            heading="Why the distinction has consequences",
            figure=Figure(
                stem="org1-separability",
                caption=(
                    "The consequence in one picture: on an ordinary achiral system enantiomers are indistinguishable and give a single peak, while diastereomers differ in every property and resolve into two - which is why resolution works by converting the first case into the second."
                ),
                alt="Two schematic chromatograms: enantiomers giving one unresolved peak, diastereomers giving two separated peaks.",
            ),
            table=Table(
                caption="Enantiomers vs diastereomers: properties and separability",
                columns=("Property", "Enantiomers", "Diastereomers"),
                rows=(
                    ("melting point, boiling point", "IDENTICAL", "different"),
                    ("solubility in an achiral solvent", "identical", "different"),
                    ("density, refractive index", "identical", "different"),
                    ("IR and standard NMR spectra", "identical", "DIFFERENT - distinguishable signals"),
                    ("optical rotation", "equal magnitude, OPPOSITE sign", "different, unrelated magnitudes"),
                    ("reaction with achiral reagents", "same rate", "different rates"),
                    ("reaction with chiral reagents/enzymes", "different rates", "different rates"),
                    ("separation by distillation or crystallisation", "IMPOSSIBLE", "POSSIBLE - the basis of resolution"),
                ),
                source="Standard physical-organic comparison of stereoisomer classes; the separability row is the operational basis of classical resolution",
                note="Enantiomers are identical in every achiral environment; diastereomers are simply different compounds.",
            ),
            body=(
                "The table's last row is the one that changes what a "
                "chemist can DO. Enantiomers have identical boiling "
                "points, so no fractional distillation separates them; "
                "identical solubilities, so no recrystallisation does "
                "either. They are, in an achiral world, the same "
                "substance twice over.\n\n"
                "Diastereomers are not. They differ in every scalar "
                "property, which means they behave like any other pair of "
                "different compounds: they can be distilled apart, "
                "crystallised apart, and separated on an ordinary "
                "chromatography column, and their NMR spectra differ so "
                "signals can be integrated to measure their ratio "
                "directly. That single asymmetry - enantiomers "
                "inseparable, diastereomers separable - is the hinge on "
                "which the resolution chapter turns: convert a stubborn "
                "pair of enantiomers into a tractable pair of "
                "diastereomers by attaching a chiral partner, separate "
                "them by ordinary means, then remove the partner. The "
                "trick is to manufacture the very difference the table "
                "says enantiomers lack."
            ),
        ),
        ReadingSection(
            id="ed-epimers",
            heading="Epimers, anomers, and the vocabulary of partial difference",
            body=(
                "Diastereomers that differ at exactly ONE stereocentre have "
                "their own name: EPIMERS. The term is used constantly in "
                "carbohydrate chemistry, where the sugars form a family "
                "related by single-centre changes - glucose and galactose "
                "are epimers at carbon 4, glucose and mannose at carbon 2. "
                "Enzymes called epimerases interconvert them, one centre at "
                "a time, and the metabolic cost of a dietary sugar often "
                "comes down to how many epimerisations the body must "
                "perform to feed it into glycolysis.\n\n"
                "ANOMERS are a special case of epimers that appear when a "
                "sugar cyclises: the carbonyl carbon becomes a new "
                "stereocentre - the ANOMERIC carbon - and the two resulting "
                "diastereomers are called alpha and beta. Because ring "
                "opening and closing happens readily in solution, anomers "
                "interconvert through the open-chain form in a process "
                "called MUTAROTATION, which a polarimeter can watch "
                "directly as the rotation drifts to an equilibrium value - "
                "the optical-activity chapter's instrument doing structural "
                "work. Anomers are also where the chair chapters cash out: "
                "beta-glucopyranose can put every substituent equatorial, "
                "which is why beta is the major anomer at equilibrium and "
                "why glucose is the sugar biology built on. Cis-trans ring "
                "isomers from the previous unit are diastereomers too - the "
                "vocabulary is one system seen from different angles."
            ),
        ),
        ReadingSection(
            id="ed-reactions",
            heading="Making them: what a reaction produces",
            body=(
                "Predicting which relationship a reaction delivers is where "
                "this chapter earns its keep in synthesis. When an ACHIRAL "
                "substrate meets ACHIRAL reagents in an achiral solvent, no "
                "influence in the flask can prefer one face over the other, "
                "so a new stereocentre is formed as a 50:50 mixture - a "
                "RACEMATE. This is not a limitation of technique but a "
                "symmetry argument, and it is why racemates are the "
                "default product of ordinary chemistry.\n\n"
                "When the substrate ALREADY carries a stereocentre, the "
                "situation changes: the existing centre makes the two faces "
                "of the reacting site inequivalent, so the two possible "
                "products are DIASTEREOMERS rather than enantiomers - and "
                "diastereomeric transition states have different energies, "
                "so they form in unequal amounts. That unequal formation is "
                "called diastereoselectivity, and it is the basis of "
                "substrate-controlled synthesis: an existing stereocentre "
                "steering the formation of the next one.\n\n"
                "The third case is asymmetric catalysis, where the CHIRAL "
                "influence is supplied by a catalyst rather than the "
                "substrate. The transition states leading to the two "
                "enantiomers become diastereomeric through their "
                "association with the chiral catalyst, differ in energy, "
                "and one enantiomer forms preferentially - measured as the "
                "enantiomeric excess of the previous chapter. Each of the "
                "three cases is the same principle: enantiomers are "
                "distinguished only when something chiral is present to "
                "distinguish them."
            ),
        ),
        ReadingSection(
            id="ed-errors",
            heading="The error catalogue: four relationship traps",
            body=(
                "Trap one: skipping the connectivity question. Two "
                "structures with the same formula that differ in bonding "
                "are constitutional isomers, and no amount of "
                "stereochemical vocabulary applies to them. Trap two: "
                "calling any two stereoisomers 'enantiomers.' Enantiomers "
                "are the mirror-image case specifically; everything else "
                "stereoisomeric is diastereomeric.\n\n"
                "Trap three: failing to notice that two drawings are the "
                "SAME compound. Rotating a structure, redrawing it from "
                "another angle, or flipping a Fischer projection through "
                "180 degrees changes nothing - and 'identical' is a "
                "legitimate answer that examiners include precisely "
                "because candidates assume a question would not be asked "
                "about one compound. Trap four: expecting enantiomers to "
                "differ in ordinary properties, or diastereomers to be "
                "inseparable. The table above inverts both intuitions, and "
                "the practical stakes are highest here: a chemist who "
                "believes enantiomers can be recrystallised apart will "
                "waste a great deal of solvent finding out otherwise."
            ),
        ),
        ReadingSection(
            id="ed-problems",
            heading="Problem set: four relationships",
            body=(
                "Problem one: $(2R,3S)$-3-bromobutan-2-ol and "
                "$(2S,3R)$-3-bromobutan-2-ol. Answer: every centre "
                "inverted - ENANTIOMERS (subject to the meso check, which "
                "this molecule does not trigger, since its two ends "
                "differ).\n\n"
                "Problem two: $(2R,3R)$ and $(2R,3S)$ of the same "
                "compound. Answer: one centre inverted out of two - "
                "DIASTEREOMERS, and specifically epimers, since exactly "
                "one centre differs.\n\n"
                "Problem three: butan-2-ol and 2-methylpropan-1-ol. "
                "Answer: both $C_4H_{10}O$, but the carbon skeletons and "
                "bonding differ - CONSTITUTIONAL isomers. The mirror test "
                "is never reached.\n\n"
                "Problem four: a chemist has a racemate and needs the "
                "$(+)$ enantiomer. Explain why recrystallisation from an "
                "ordinary solvent cannot work, and what must change. "
                "Answer: enantiomers have identical solubility in achiral "
                "solvents, so no ordinary crystallisation discriminates. "
                "Something CHIRAL must enter - a resolving agent that "
                "converts the pair into diastereomeric salts with "
                "genuinely different solubilities, a chiral stationary "
                "phase, or an enzyme that consumes one hand - which is "
                "the resolution chapter in one sentence."
            ),
        ),
        ReadingSection(
            id="ed-nmr",
            heading="Seeing the difference: spectroscopy of the two classes",
            body=(
                "The spectroscopic consequence deserves its own statement, "
                "because it is how these relationships are diagnosed in "
                "practice. Enantiomers give IDENTICAL NMR spectra in "
                "ordinary solvents: every nucleus in one has an exactly "
                "equivalent nucleus in the other, and an achiral "
                "spectrometer with achiral solvent cannot tell them apart. "
                "A single set of signals therefore proves nothing about "
                "enantiopurity.\n\n"
                "Diastereomers give DIFFERENT spectra, because their "
                "nuclei genuinely occupy different environments - the "
                "chemical shifts differ, and the two sets of signals "
                "integrate against each other to give the ratio directly. "
                "This is the whole mechanism behind chiral derivatising "
                "agents: react a mixture of enantiomers with a single "
                "enantiomer of some reagent, and the products are "
                "diastereomers whose signals separate. The same logic runs "
                "chiral chromatography, where the transient association "
                "with a chiral stationary phase is diastereomeric and "
                "therefore differentiating. Every analytical method for "
                "enantiomeric purity works by manufacturing "
                "diastereomers, permanently or transiently - which is the "
                "same trick resolution uses preparatively."
            ),
        ),
        ReadingSection(
            id="ed-closing",
            heading="The relationship audit",
            body=(
                "Close with the procedure. ONE: compare molecular "
                "formulas; different formulas end the question. TWO: "
                "compare connectivity atom by atom; different connectivity "
                "means constitutional isomers and no stereochemistry. "
                "THREE: with connectivity matched, assign R/S at every "
                "centre and count inversions - all inverted suggests "
                "enantiomers, some inverted means diastereomers, none "
                "means the same compound. FOUR: before declaring "
                "enantiomers, run the internal-mirror check, because "
                "symmetry can collapse an apparent pair into one achiral "
                "meso substance.\n\n"
                "FIVE, the step that turns classification into "
                "prediction: state the CONSEQUENCE. Enantiomers will be "
                "inseparable by ordinary means and indistinguishable by "
                "ordinary spectroscopy; diastereomers will differ in "
                "every property and separate on an ordinary column. The "
                "next chapter takes the counting seriously - what happens "
                "when a molecule carries three, four or five "
                "stereocentres, why $2^n$ is a ceiling rather than a "
                "count, and how internal symmetry produces the meso "
                "compounds this chapter has been deferring."
            ),
        ),
        ReadingSection(
            id="ed-same-compound",
            heading="The answer people miss: same compound",
            body=(
                "Of the four possible answers, IDENTICAL is the one "
                "candidates rule out first and should not. Two drawings "
                "can differ in every visual respect and still depict one "
                "substance, because a molecule is free to rotate and a "
                "drawing is only one projection of it.\n\n"
                "Three operations change a drawing without changing the "
                "compound. Rotating the whole structure in the plane of "
                "the page. Rotating about any single bond, which "
                "reshuffles the apparent positions of groups without "
                "breaking anything - the conformational freedom the ring "
                "unit spent chapters on. And redrawing from a different "
                "viewpoint, which can exchange which bonds appear wedged "
                "and which dashed. None of these is a change of "
                "substance.\n\n"
                "The reliable test is the descriptor count: assign R/S at "
                "every centre in both drawings, and if no centre differs, "
                "the two are the same compound however unalike they look. "
                "Physical models settle the remaining doubt in seconds, "
                "which is the third time this unit has recommended one. "
                "Examiners include the identical case deliberately, "
                "because a candidate who assumes a question must concern "
                "two different substances will invent a relationship "
                "rather than report the absence of one."
            ),
        ),
        ReadingSection(
            id="ed-conformers-again",
            heading="Conformers are not on the list",
            body=(
                "One relationship is deliberately missing from the "
                "decision tree, and its absence is the point. CONFORMERS "
                "- the staggered and eclipsed forms of butane, the two "
                "chairs of a substituted cyclohexane, the rotamers of any "
                "single bond - are not isomers of each other at all. They "
                "are one compound in different momentary shapes, "
                "interconverting billions of times a minute at room "
                "temperature over barriers of tens of kilojoules per "
                "mole.\n\n"
                "The operational test the ring unit installed applies "
                "unchanged: ask what motion relates the two structures. "
                "If bond ROTATION suffices, they are conformers of one "
                "substance and the isomer vocabulary does not apply. If "
                "a bond must BREAK, they are configurational isomers and "
                "the decision tree runs.\n\n"
                "Examiners exploit the confusion constantly by drawing "
                "the same compound in two conformations and asking for "
                "the relationship - where the correct answer is "
                "'identical, drawn in two conformations,' not "
                "'diastereomers.' The confusion is understandable, "
                "because different chairs of the same molecule genuinely "
                "have different energies and different reactivities. But "
                "energy differences do not make substances: what makes "
                "two substances is a barrier high enough to bottle them "
                "separately, and rotation never provides one."
            ),
        ),
        ReadingSection(
            id="ed-worked-pairs",
            heading="Worked: four pairs run through the tree",
            body=(
                "PAIR ONE: $(2R,3R)$-tartaric acid and $(2S,3S)$-tartaric "
                "acid. Same formula, same connectivity, every centre "
                "inverted, no internal mirror plane in either - "
                "ENANTIOMERS, with equal and opposite rotations and "
                "identical melting points.\n\n"
                "PAIR TWO: $(2R,3R)$-tartaric acid and the $(2R,3S)$ "
                "form. Same formula and connectivity, ONE centre "
                "inverted - DIASTEREOMERS, with different melting "
                "points, different solubilities, and separable by "
                "crystallisation. The second member happens also to be "
                "meso, but that does not change the relationship "
                "between them.\n\n"
                "PAIR THREE: cis- and trans-1,2-dimethylcyclohexane. "
                "Same formula, same connectivity, and not mirror images "
                "of one another - DIASTEREOMERS, which is exactly what "
                "the Cyclic Compounds unit concluded through the "
                "face argument. Two vocabularies, one fact.\n\n"
                "PAIR FOUR: two drawings of butan-2-ol, one showing the "
                "hydroxyl wedged and one showing it dashed, with the "
                "other groups also exchanged. Here the answer depends "
                "entirely on the assignment: work the R/S label on each "
                "drawing rather than trusting the wedges, because a "
                "redrawn viewpoint can invert the appearance without "
                "inverting the configuration. If both label R, they are "
                "IDENTICAL."
            ),
        ),
        ReadingSection(
            id="ed-history-terms",
            heading="Where the words came from",
            body=(
                "The vocabulary has a history worth a paragraph, because "
                "the terms are opaque otherwise. ISOMER was coined by "
                "Berzelius in the 1830s from Greek roots meaning 'equal "
                "parts' - a scandalous idea at the time, since it "
                "asserted that composition alone does not determine a "
                "substance. Wohler's urea synthesis and the discovery "
                "that fulminate and cyanate share a formula forced the "
                "concept into existence.\n\n"
                "ENANTIOMER comes from the Greek for 'opposite parts,' "
                "and DIASTEREOMER from 'through' or 'across' - "
                "stereoisomers standing across from each other rather "
                "than opposite. The terms date from the era when "
                "stereochemistry became systematic, and they replaced a "
                "clutter of earlier usages including 'optical isomers,' "
                "a phrase still occasionally seen and worth retiring: it "
                "suggests that the difference is fundamentally optical "
                "rather than spatial, and it does not extend to "
                "diastereomers at all.\n\n"
                "The modern set is precise because each term names a "
                "STRUCTURAL relationship with predictable physical "
                "consequences, rather than naming an observation. That "
                "is the same upgrade the R/S system made over rotation "
                "signs, and this unit has now made it twice."
            ),
        ),
        ReadingSection(
            id="ed-exam-patterns",
            heading="How examiners ask it",
            body=(
                "Three costumes dominate. THE PAIR: two structures with "
                "'what is the relationship?' - solved by the tree, with "
                "'identical' and 'conformers of one compound' as the "
                "planted answers candidates refuse to choose. THE "
                "PROPERTY INFERENCE: 'these two compounds have different "
                "melting points - what does that tell you about their "
                "relationship?' - answered by the table, since "
                "enantiomers cannot differ in melting point, so the pair "
                "must be diastereomers or constitutional "
                "isomers.\n\n"
                "THE SEPARATION PROBLEM: 'how would you separate these "
                "two?' - answered by naming the class first, because the "
                "class dictates the method: ordinary distillation or "
                "crystallisation for diastereomers and constitutional "
                "isomers, and something chiral for enantiomers. Notice "
                "that all three reward the same move - classify first, "
                "then read the consequence off the table - and that the "
                "table is short enough to reconstruct from one "
                "principle: enantiomers are identical except in a chiral "
                "environment, and diastereomers are simply different "
                "compounds."
            ),
        ),
        ReadingSection(
            id="ed-vocabulary",
            heading="The vocabulary shelf",
            body=(
                "ISOMERS: same molecular formula, different substances. "
                "CONSTITUTIONAL (structural) ISOMERS: different "
                "connectivity - the bonding skeleton itself differs. "
                "STEREOISOMERS: same connectivity, different spatial "
                "arrangement. ENANTIOMERS: stereoisomers that are "
                "non-superimposable mirror images - identical in achiral "
                "environments, inseparable by ordinary means.\n\n"
                "DIASTEREOMERS: stereoisomers that are NOT mirror "
                "images - different in every scalar property, separable "
                "by ordinary means. EPIMERS: diastereomers differing at "
                "exactly one stereocentre. ANOMERS: the epimeric pair at "
                "a cyclic sugar's anomeric carbon, interconverting by "
                "mutarotation. CONFORMERS: not isomers at all - one "
                "substance in different rotational shapes.\n\n"
                "Each entry carries its separability consequence, "
                "because that is what makes the classification worth "
                "performing. A chemist who can name the relationship but "
                "not predict whether a column will separate the pair has "
                "learned the vocabulary and missed the point."
            ),
        ),
        ReadingSection(
            id="ed-drug-consequences",
            heading="Why industry cares about the distinction",
            body=(
                "The classification determines what a process chemist can "
                "promise. If a target's impurity is a DIASTEREOMER, "
                "purification is a normal engineering problem: "
                "crystallise, distil, or chromatograph, and the "
                "specification is met by ordinary unit operations. If the "
                "impurity is the ENANTIOMER, none of that works, and the "
                "options narrow to three - build the molecule "
                "enantioselectively in the first place, resolve the "
                "mixture using something chiral, or accept the racemate "
                "and characterise both hands as separate "
                "substances.\n\n"
                "That fork has real economics attached. Diastereomeric "
                "purification is cheap and scalable; enantiomeric "
                "purification is neither, and the fifty-percent "
                "theoretical ceiling on a classical resolution makes it "
                "worse. It is why the discovery that a route produces a "
                "diastereomeric rather than enantiomeric impurity is "
                "genuinely good news in a development meeting, and why "
                "asymmetric catalysis attracted the investment it did. "
                "The chapter's abstract classification, in other words, "
                "is the first question asked about any chiral route, and "
                "the answer sets the budget."
            ),
        ),
        ReadingSection(
            id="ed-biology-consequences",
            heading="How biology reads the difference",
            body=(
                "Living systems classify stereoisomers with an accuracy "
                "no laboratory instrument matched until recently, and the "
                "mechanism is the one this unit has been developing "
                "throughout. An enzyme's active site is chiral, so its "
                "association with each enantiomer of a substrate is "
                "DIASTEREOMERIC - different energies, different binding, "
                "different rates. The enzyme does not need a special "
                "faculty for handedness; it merely has to be handed "
                "itself.\n\n"
                "The same logic governs receptors, transporters and "
                "antibodies, and it explains observations from earlier "
                "chapters that might otherwise look like curiosities. "
                "Carvone's two smells, asparagine's sweet and bitter "
                "forms, the different pharmacology of a drug's two "
                "hands - each is a chiral protein converting an "
                "enantiomeric difference into a diastereomeric one at "
                "the moment of binding. And when a sugar's C4 epimer "
                "cannot be metabolised without a dedicated enzyme, that "
                "is the diastereomeric case: genuinely different "
                "molecules requiring genuinely different machinery. "
                "Biology, in short, does exactly what a chemist does to "
                "resolve a racemate - it supplies the chiral partner - "
                "and it does so at every encounter."
            ),
        ),
        ReadingSection(
            id="ed-bridge",
            heading="What the next chapters need from this one",
            body=(
                "Everything remaining in the unit assumes this "
                "classification runs automatically. The multiple-"
                "stereocentre chapter counts families and asks which "
                "members are enantiomers and which diastereomers - "
                "questions that are meaningless without the tree. "
                "Fischer projections exist to make the classification "
                "readable at four or five centres, where wedge-dash "
                "drawings defeat the eye.\n\n"
                "And resolution is nothing more than this chapter's "
                "table exploited on purpose: because enantiomers cannot "
                "be separated and diastereomers can, the entire "
                "technique consists of converting one into the other, "
                "separating, and converting back. When that chapter "
                "arrives, the only genuinely new content will be the "
                "chemistry of the conversion - the resolving agents, the "
                "chiral columns, the enzymes. The strategy will already "
                "be familiar, because it is written in the last row of "
                "the property table you have already read."
            ),
        ),
        ReadingSection(
            id="ed-constitutional-depth",
            heading="The branch most students skip: constitutional isomers",
            body=(
                "The tree's second question deserves more attention than "
                "it usually gets, because constitutional isomerism is "
                "where the isomer count actually explodes. Chapter 2 "
                "counted the alkane isomers: three for pentane, five for "
                "hexane, nine for heptane, and seventy-five for decane - "
                "all before any stereochemistry enters.\n\n"
                "Constitutional isomers come in recognisable families. "
                "CHAIN isomers differ in skeletal branching (pentane "
                "versus 2-methylbutane). POSITIONAL isomers move a "
                "functional group along the same skeleton (butan-1-ol "
                "versus butan-2-ol). FUNCTIONAL isomers share a formula "
                "across different functional groups entirely - "
                "$C_2H_6O$ is both ethanol and dimethyl ether, "
                "compounds so unalike that one is a liquid at room "
                "temperature and the other a gas.\n\n"
                "That last example is the cleanest argument for asking "
                "the connectivity question first. Ethanol and dimethyl "
                "ether share every atom and differ in nothing but which "
                "atom is bonded to which - and they are as different as "
                "two substances can be. Stereochemistry, by comparison, "
                "produces subtler differences: same connectivity, "
                "different arrangement, and consequences that range from "
                "undetectable (enantiomers in a flask) to decisive "
                "(enantiomers in a body)."
            ),
        ),
        ReadingSection(
            id="ed-one-line",
            heading="The chapter in one line",
            body=(
                "Ask three questions in order - same formula, same "
                "connectivity, non-superimposable mirror images - and "
                "then read the consequence off one row of one table: "
                "enantiomers are inseparable by ordinary means and "
                "diastereomers are not. Everything else in this chapter, "
                "including all of resolution, is that asymmetry being "
                "exploited on purpose."
            ),
        ),
        ReadingSection(
            id="ed-physical-basis",
            heading="The physical reason enantiomers match so exactly",
            body=(
                "It is worth asking WHY enantiomers share melting points "
                "to the decimal place rather than merely coming close, "
                "because the answer is more interesting than 'they just "
                "do.' Every intermolecular interaction - dispersion "
                "forces, dipole attractions, hydrogen bonds - depends on "
                "distances and angles between atoms. Reflection "
                "preserves all of them exactly: a mirror image has "
                "identical bond lengths, identical angles, identical "
                "charge distribution.\n\n"
                "So a molecule interacting with an achiral partner "
                "experiences exactly what its mirror image experiences, "
                "and the energies are equal by symmetry rather than by "
                "coincidence. That is why the identity is exact rather "
                "than approximate, and why no amount of experimental "
                "refinement will ever reveal a boiling-point difference "
                "between enantiomers in an achiral solvent.\n\n"
                "Diastereomers break the symmetry because they are not "
                "reflections of each other: their internal distances "
                "genuinely differ, so their packing, their dipoles, and "
                "their intermolecular energies differ too. The "
                "separability table is therefore not an empirical "
                "observation that might have come out otherwise - it is "
                "a consequence of what reflection does and does not "
                "preserve, which is the deepest reason this chapter's "
                "classification is worth trusting."
            ),
        ),
        ReadingSection(
            id="ed-crystal-exception",
            heading="One honest exception: crystals",
            body=(
                "The rule that enantiomers cannot be separated by "
                "crystallisation has a famous exception, and it is the "
                "one Pasteur stumbled into. A few racemates crystallise "
                "as a CONGLOMERATE - separate crystals of each pure "
                "enantiomer growing side by side - rather than as a "
                "racemic compound in which both hands share a lattice. "
                "When that happens, the crystals themselves are "
                "chiral objects with distinguishable shapes, and "
                "mechanical separation becomes possible.\n\n"
                "Conglomerate behaviour is uncommon, temperature-"
                "dependent, and not predictable in advance - Pasteur's "
                "tartrate salt forms one only below about 26 degrees "
                "Celsius. But it is exploited industrially through "
                "preferential crystallisation, in which seeding a "
                "supersaturated racemate with crystals of one hand "
                "coaxes that hand out of solution.\n\n"
                "The exception does not undermine the rule, and stating "
                "it precisely shows why: the separation works because "
                "the SOLID PHASE is chiral, which is another chiral "
                "environment doing the discriminating. Nothing achiral "
                "ever tells the hands apart. Every apparent exception in "
                "this subject, examined closely, turns out to have "
                "smuggled chirality in somewhere - which is the "
                "strongest possible form of the principle."
            ),
        ),
        ReadingSection(
            id="ed-closing-audit-2",
            heading="Practising the classification",
            body=(
                "The classification is a skill that rewards volume over "
                "study, and the efficient drill is small. Take any chiral "
                "molecule with two stereocentres and draw all four "
                "descriptor combinations. Then, for every one of the six "
                "possible pairings among them, state the relationship "
                "from the inversion count alone and predict two "
                "consequences - whether the pair could be separated on an "
                "ordinary column, and whether their NMR spectra would "
                "differ.\n\n"
                "Six pairings, two predictions each, one molecule: "
                "twelve answers with a self-checking structure, because "
                "the four members must resolve into exactly two "
                "enantiomeric pairs with all remaining links "
                "diastereomeric. If your answers do not form that "
                "pattern, an error is present and you can find it "
                "without an answer key.\n\n"
                "Doing this on three molecules - one with distinct ends, "
                "one with identical ends producing a meso compound, and "
                "one ring case - covers essentially every configuration "
                "an examiner can construct from two stereocentres, and "
                "it takes far less time than reading this chapter again."
            ),
        ),
        ReadingSection(
            id="ed-final-note",
            heading="A closing caution about vocabulary",
            body=(
                "Two phrases still circulate that this chapter should "
                "retire. 'OPTICAL ISOMERS' is sometimes used to mean "
                "enantiomers, and it is doubly unhelpful: it implies the "
                "difference is optical rather than spatial, and it has "
                "no natural extension to diastereomers, which are "
                "stereoisomers too. 'GEOMETRIC ISOMERS' for cis-trans "
                "pairs is similarly dated - those are simply "
                "diastereomers, and calling them by the general term "
                "makes their separability predictable rather than "
                "surprising.\n\n"
                "Using the modern vocabulary is not pedantry. Each "
                "current term names a structural relationship that "
                "predicts physical behaviour, which is exactly what the "
                "older terms failed to do."
            ),
        ),
        ReadingSection(
            id="ed-one-more",
            heading="Reading the table backwards",
            body=(
                "A final habit worth building: the property table works "
                "in reverse, and examiners use it that way. Given an "
                "OBSERVATION about two substances, the table constrains "
                "what their relationship can be. Different melting "
                "points rules out enantiomers entirely. Identical NMR "
                "spectra in an ordinary solvent rules out diastereomers. "
                "Equal and opposite rotations with everything else "
                "matching means enantiomers and nothing else.\n\n"
                "Reasoning from properties to relationships is what "
                "characterisation actually looks like in a laboratory, "
                "where structures are the conclusion rather than the "
                "premise - and it is worth practising in that direction "
                "as well as the forward one."
            ),
        ),
    ),
    key_takeaways=(
        "Three questions in fixed order - same formula, same connectivity, non-superimposable mirror images - sort any pair into identical, constitutional isomers, enantiomers or diastereomers.",
        "With descriptors given: ALL centres inverted means enantiomers, SOME means diastereomers, none means the same compound - subject to the meso symmetry check.",
        "Enantiomers are identical in every achiral property and INSEPARABLE by distillation or crystallisation; diastereomers differ in everything and separate by ordinary means.",
        "Epimers differ at one centre (glucose/galactose at C4); anomers are the cyclic-sugar case and interconvert by mutarotation, watchable on a polarimeter.",
        "Achiral substrate plus achiral reagents gives a racemate by symmetry; an existing stereocentre or a chiral catalyst makes the competing transition states diastereomeric, which is why selectivity becomes possible at all.",
    ),
))


# --------------------------------------------------------------------------
# 6.5 Multiple stereocenters and meso compounds
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.MULTIPLESTEREO",
    lead=(
        "One stereocentre gives two stereoisomers. Two give four - unless "
        "the molecule is symmetric, in which case they give three, and one "
        "of those three is achiral despite carrying two stereocentres. This "
        "chapter works the counting honestly: why $2^n$ is a ceiling rather "
        "than an answer, how internal symmetry collapses it, what a meso "
        "compound is and how to spot one, and how the whole family of "
        "stereoisomers relates - which pairs are enantiomers, which are "
        "diastereomers, and which are the same substance drawn twice."
    ),
    sections=(
        ReadingSection(
            id="ms-counting",
            heading="The 2 to the n ceiling",
            body=(
                "Each stereocentre has two possible configurations, R or S, "
                "and in the absence of symmetry the choices are "
                "independent - so a molecule with $n$ stereocentres has at "
                "most $2^n$ stereoisomers. One centre gives $2$; two give "
                "$4$; three give $8$; four give $16$; and a modest natural "
                "product with six centres has up to $64$ stereoisomers, of "
                "which a synthesis must deliver exactly one.\n\n"
                "Those numbers explain why stereochemistry dominates "
                "synthetic planning. Getting the constitution right - the "
                "connectivity - is one problem; getting one of $64$ "
                "arrangements is a different and harder one, and it is why "
                "asymmetric methodology has absorbed so much of the "
                "field's effort. The word CEILING is doing real work in "
                "that sentence, though: $2^n$ is the maximum, achieved only "
                "when every combination gives a genuinely distinct "
                "substance. When the molecule has internal symmetry, some "
                "of those combinations turn out to describe the same thing, "
                "and the true count falls below the formula. The rest of "
                "this chapter is about when and why that happens."
            ),
        ),
        ReadingSection(
            id="ms-family",
            heading="Mapping a four-member family",
            figure=Figure(
                stem="org1-stereoisomer-map",
                caption=(
                    "Two stereocentres give four combinations: the horizontal pairs are enantiomers, every cross-pair is diastereomeric - and when the two centres are equivalent the lower pair collapses into a single achiral meso compound."
                ),
                alt="Four boxes labelled R,R and S,S and R,S and S,R with enantiomer arrows horizontally and diastereomer arrows across every other pair.",
            ),
            body=(
                "Take a molecule with two DIFFERENT stereocentres - "
                "3-bromobutan-2-ol will do, since its two ends are not "
                "equivalent. The four combinations are $(2R,3R)$, "
                "$(2S,3S)$, $(2R,3S)$ and $(2S,3R)$, and the relationships "
                "among them follow the previous chapter's inversion "
                "count.\n\n"
                "$(2R,3R)$ and $(2S,3S)$ have every centre inverted: "
                "ENANTIOMERS. $(2R,3S)$ and $(2S,3R)$ likewise: a second "
                "enantiomeric pair. But $(2R,3R)$ against $(2R,3S)$ has "
                "only one centre inverted: DIASTEREOMERS - and the same "
                "holds for every cross-pair between the two "
                "enantiomeric pairs.\n\n"
                "So four stereoisomers organise into TWO enantiomeric "
                "pairs, with every member of one pair being a "
                "diastereomer of every member of the other. The practical "
                "consequence follows directly from the property table: "
                "the two PAIRS can be separated from each other by "
                "ordinary distillation or crystallisation, because pairs "
                "are diastereomeric; but within a pair the two members "
                "cannot be, because they are enantiomers. That is the "
                "structure of essentially every multi-centre "
                "stereochemical problem, and drawing the four-box map "
                "before answering makes the relationships visible instead "
                "of memorised."
            ),
        ),
        ReadingSection(
            id="ms-meso",
            heading="Meso compounds: symmetry collapses the count",
            figure=Figure(
                stem="org1-tartaric-stereoisomers",
                caption=(
                    "Tartaric acid's three stereoisomers: the (2R,3R) and (2S,3S) enantiomeric pair, and meso-tartaric acid (2R,3S), which carries two stereocentres yet possesses an internal mirror plane and is achiral. Configurations were assigned computationally."
                ),
                alt="Structures of (2R,3R)-, (2S,3S)- and meso-tartaric acid side by side with their configurations labelled.",
            ),
            body=(
                "Now take a molecule whose two stereocentres are "
                "EQUIVALENT - each bearing the same set of groups. "
                "Tartaric acid is the classic, and the figure shows what "
                "happens. The $(2R,3R)$ and $(2S,3S)$ forms are a normal "
                "enantiomeric pair: both chiral, equal and opposite "
                "rotations, inseparable by ordinary means.\n\n"
                "The $(2R,3S)$ form is different. Because the two halves "
                "of the molecule are constitutionally identical and "
                "oppositely configured, an internal MIRROR PLANE passes "
                "between them: one half is the reflection of the other. "
                "The molecule is therefore superimposable on its own "
                "mirror image - ACHIRAL - despite containing two "
                "stereocentres. It is optically inactive, it cannot be "
                "resolved, and it is a single substance rather than half "
                "of a pair. Compounds like this are called MESO.\n\n"
                "And $(2S,3R)$? Rotate the $(2R,3S)$ structure and it "
                "becomes $(2S,3R)$ - they are the SAME compound, which is "
                "why the count comes to three rather than four. The "
                "collapse is exactly the 'identical' branch of the "
                "relationship tree, appearing where the descriptor "
                "arithmetic alone would have predicted a fourth "
                "substance. Meso-tartaric acid is a diastereomer of both "
                "chiral forms, with its own melting point - separable "
                "from them by crystallisation, as Pasteur's original "
                "material demonstrated."
            ),
        ),
        ReadingSection(
            id="ms-spotting",
            heading="Spotting a meso compound",
            body=(
                "The diagnostic is symmetry, and three checks find nearly "
                "every case. CHECK ONE: does the molecule have an EVEN "
                "number of stereocentres with the two halves "
                "constitutionally identical? Meso compounds require that "
                "kind of pairing - a molecule whose ends genuinely differ "
                "cannot be meso.\n\n"
                "CHECK TWO: are the paired centres OPPOSITELY configured - "
                "one R, one S? Same-configuration pairs give the chiral "
                "members of the family; opposite configuration is what "
                "creates the internal reflection. CHECK THREE, the "
                "decisive one: can you draw a mirror plane through the "
                "molecule such that one side reflects onto the other? If "
                "yes, it is achiral and meso, whatever the stereocentre "
                "count says.\n\n"
                "The cyclic cases from the ring unit fit this frame "
                "exactly: cis-1,2-dimethylcyclohexane and "
                "cis-1,3-dimethylcyclohexane are meso, with the mirror "
                "plane running through the ring, and both are optically "
                "inactive despite carrying two stereocentres apiece. That "
                "convergence is worth noticing - the ring chapters and "
                "this one describe the same phenomenon in different "
                "vocabulary, which is why the symmetry test was declared "
                "there to overrule stereocentre counting and is declared "
                "here to lower the $2^n$ ceiling."
            ),
        ),
        ReadingSection(
            id="ms-counting-honest",
            heading="Counting honestly: enumerate, then merge",
            table=Table(
                caption="Stereoisomer counts when symmetry intervenes",
                columns=("Compound", "Stereocentres", "2^n predicts", "Actual"),
                rows=(
                    ("3-bromobutan-2-ol (ends differ)", "2", "4", "4 - two enantiomeric pairs"),
                    ("tartaric acid (ends identical)", "2", "4", "3 - one pair plus meso"),
                    ("1,2-dimethylcyclohexane", "2", "4", "3 - trans pair plus cis meso"),
                    ("1,3-dimethylcyclohexane", "2", "4", "3 - trans pair plus cis meso"),
                    ("1,4-dimethylcyclohexane", "0 (by the swap test)", "-", "2 - cis and trans, both achiral"),
                ),
                source="Worked by enumeration and symmetry merging; the ring cases are the cis-trans compounds developed in the Cyclic Compounds unit",
                note="2^n is an upper bound; symmetry merges structures that the formula counts twice.",
            ),
            body=(
                "The reliable procedure never trusts the formula alone. "
                "ENUMERATE every combination of R and S across the "
                "stereocentres - $2^n$ of them on paper. Then MERGE any "
                "that are related by an internal mirror or by a rotation "
                "of the whole molecule, because those describe one "
                "substance rather than two. What survives is the true "
                "count.\n\n"
                "The table shows the pattern: whenever the molecule's two "
                "halves are constitutionally identical, one pair of "
                "descriptors collapses into a single meso compound and "
                "the count drops from four to three. The 1,4-dimethyl "
                "case goes further - a mirror plane runs through both "
                "substituted carbons, so by the swap test they are not "
                "stereocentres at all, yet cis and trans remain distinct "
                "diastereomers because the FACE relationship survives. "
                "That last row is the reminder that stereoisomerism is "
                "broader than stereocentre counting, and it is why the "
                "chirality chapter defined everything in terms of "
                "superimposability rather than in terms of asymmetric "
                "carbons."
            ),
        ),
        ReadingSection(
            id="ms-sugars",
            heading="Where the numbers get large: sugars",
            body=(
                "Carbohydrates are where multiple stereocentres stop being "
                "an exercise. An aldohexose - glucose and its relatives - "
                "carries FOUR stereocentres in its open-chain form, giving "
                "$2^4 = 16$ stereoisomers, which organise into eight "
                "enantiomeric pairs. All sixteen exist and have names; "
                "biology uses a handful. Cyclise the sugar and the "
                "anomeric carbon adds a fifth centre, doubling the "
                "possibilities again into the alpha and beta anomers of "
                "the previous chapter.\n\n"
                "None of these sixteen are meso, because a sugar's two "
                "ends differ - an aldehyde at one end, a primary alcohol "
                "at the other - so no internal mirror plane is available. "
                "Reduce both ends to alcohols, though, and symmetry "
                "becomes possible: some sugar alcohols ARE meso, and "
                "galactitol is the standard example. The transferable "
                "lesson is that meso-ness depends on the whole "
                "molecule's symmetry rather than on any local feature, "
                "so it can appear or vanish through a reaction at a "
                "position far from the stereocentres themselves. Fischer "
                "projections, the next chapter, exist precisely because "
                "wedge-dash drawings become unreadable at four or five "
                "centres, and the sugar family is what they were "
                "invented to organise."
            ),
        ),
        ReadingSection(
            id="ms-errors",
            heading="The error catalogue: four counting traps",
            body=(
                "Trap one: reporting $2^n$ as the answer. It is the "
                "ceiling; symmetry lowers it, and the tartaric and "
                "ring cases in the table are the standard examples "
                "examiners reach for. Trap two: believing a molecule "
                "with stereocentres must be chiral. Meso compounds "
                "carry them and are achiral, optically inactive, and "
                "unresolvable.\n\n"
                "Trap three: treating a meso compound as one member of "
                "an enantiomeric pair. It has no enantiomer - its "
                "mirror image is itself - so it is a diastereomer of "
                "the chiral members and a substance in its own right. "
                "Trap four: assuming a zero polarimeter reading "
                "identifies a racemate. Meso compounds read zero as "
                "single pure substances, which is the internal-"
                "compensation case the optical-activity chapter "
                "previewed: a racemate cancels BETWEEN molecules while "
                "a meso compound cancels WITHIN one, and only "
                "structure - or a chiral column, which resolves a "
                "racemate into two peaks and a meso compound into one - "
                "tells them apart."
            ),
        ),
        ReadingSection(
            id="ms-problems",
            heading="Problem set: four counts",
            body=(
                "Problem one: how many stereoisomers does "
                "2,3-dibromobutane have? Answer: two identical "
                "stereocentres, so $2^2 = 4$ on paper but symmetry "
                "merges the $(R,S)$ and $(S,R)$ forms into one meso "
                "compound - THREE stereoisomers: an enantiomeric pair "
                "plus meso.\n\n"
                "Problem two: how many for 2,3-dibromopentane? Answer: "
                "the two ends now differ (methyl versus ethyl), so no "
                "internal mirror is possible and all FOUR exist - two "
                "enantiomeric pairs.\n\n"
                "Problem three: an aldohexose has four stereocentres "
                "and no symmetry. How many stereoisomers, and how many "
                "enantiomeric pairs? Answer: $2^4 = 16$ stereoisomers "
                "forming eight enantiomeric pairs.\n\n"
                "Problem four: a sample of meso-tartaric acid is "
                "placed in a polarimeter. What is the reading, and "
                "could chiral chromatography distinguish this sample "
                "from a racemate of the chiral forms? Answer: zero "
                "rotation, because the molecule compensates "
                "internally. Yes - a chiral column gives ONE peak for "
                "the meso compound (a single achiral substance) and "
                "TWO for the racemate, which is the practical test the "
                "polarimeter cannot perform."
            ),
        ),
        ReadingSection(
            id="ms-closing",
            heading="The counting audit",
            body=(
                "Close with the procedure. ONE: identify and count the "
                "stereocentres, tracing branches until they genuinely "
                "differ. TWO: compute $2^n$ and hold it as a CEILING, "
                "not an answer. THREE: ask whether the molecule's "
                "halves are constitutionally identical - the "
                "precondition for meso. FOUR: enumerate the descriptor "
                "combinations and merge any related by an internal "
                "mirror or a whole-molecule rotation. FIVE: map the "
                "survivors into enantiomeric pairs, and note that "
                "every cross-pair is diastereomeric and therefore "
                "separable.\n\n"
                "SIX: state the physical consequences, because that is "
                "what the count is for - which members can be "
                "separated from which by ordinary means, which will "
                "read zero on a polarimeter, and which can be resolved "
                "at all. The remaining chapters give sugars a notation "
                "that survives five stereocentres, and then close the "
                "unit with the practical question this one keeps "
                "raising: given a racemate that ordinary methods "
                "cannot touch, how do you obtain a single enantiomer "
                "in the bottle?"
            ),
        ),
        ReadingSection(
            id="ms-drawing",
            heading="Drawing a family without losing track",
            body=(
                "Multi-centre problems are lost through bookkeeping far "
                "more often than through concepts, so the drawing "
                "discipline matters. Number the stereocentres first and "
                "keep the numbering fixed across every structure you "
                "draw, so that $(2R,3S)$ always means the same thing on "
                "every sheet.\n\n"
                "Draw the SKELETON identically each time - same "
                "orientation, same chain direction - and vary only the "
                "wedges and dashes. A family drawn in four different "
                "orientations is a family that cannot be compared, and "
                "most wrong answers come from comparing structures that "
                "were never aligned. Label each drawing with its full "
                "descriptor set as you finish it, rather than "
                "reconstructing labels later.\n\n"
                "Then build the map: place the four (or however many) "
                "combinations in a grid like the figure above, draw the "
                "enantiomeric links, and mark every remaining connection "
                "diastereomeric. The map takes a minute and answers "
                "every relationship question the problem can ask, "
                "including the ones about separability. Students who "
                "draw it finish faster than students who reason pair by "
                "pair, because the map is computed once and consulted "
                "repeatedly."
            ),
        ),
        ReadingSection(
            id="ms-pseudoasymmetric",
            heading="When a centre is not a stereocentre",
            body=(
                "A subtlety that catches careful students: in some "
                "symmetric molecules, a carbon bearing four apparently "
                "different groups turns out not to generate new "
                "stereoisomers, because two of its branches are "
                "constitutionally identical and differ only in their own "
                "configuration. The middle carbon of a "
                "2,3,4-trisubstituted chain with matching ends is the "
                "standard case.\n\n"
                "The rigorous test is the SWAP TEST rather than the "
                "four-different-groups shortcut: exchange two groups at "
                "the atom and ask whether the result is a DIFFERENT "
                "stereoisomer. If it is, the atom is stereogenic; if the "
                "swap merely redraws the same substance, it is not. The "
                "swap test is the definition, and the four-different-"
                "groups rule is a convenient consequence that holds in "
                "the ordinary case.\n\n"
                "Formal treatments give these centres their own name - "
                "pseudoasymmetric - and the CIP system extends with "
                "lowercase descriptors to handle them. This course does "
                "not require that machinery, but it does require the "
                "habit behind it: when a count comes out wrong, return "
                "to the definition rather than defending the shortcut. "
                "That is the same instruction the chirality chapter gave "
                "about superimposability, and it resolves this "
                "case too."
            ),
        ),
        ReadingSection(
            id="ms-separation-consequences",
            heading="What a family means in the laboratory",
            body=(
                "Translate a four-member family into practice and the "
                "consequences separate cleanly. The two enantiomeric "
                "PAIRS are diastereomeric with respect to each other, so "
                "a synthesis producing all four gives a mixture that can "
                "be split into two fractions by ordinary "
                "chromatography - each fraction being a racemate of one "
                "pair.\n\n"
                "Within each fraction, nothing further happens without "
                "chiral intervention. So the practical outcome of an "
                "unselective synthesis with two new stereocentres is "
                "typically two racemates, separable from one another and "
                "each requiring resolution or asymmetric synthesis to go "
                "further. When a route is described as "
                "DIASTEREOSELECTIVE, it means the two pairs are formed "
                "in unequal amounts - useful, and independent of whether "
                "either pair is enantiomerically enriched. When it is "
                "described as ENANTIOSELECTIVE, one member within a pair "
                "predominates.\n\n"
                "The two selectivities are reported separately - "
                "diastereomeric ratio and enantiomeric excess - "
                "precisely because they are independent achievements "
                "with independent methods, and a route can succeed at "
                "one while failing at the other."
            ),
        ),
        ReadingSection(
            id="ms-meso-history",
            heading="Meso, Pasteur, and the third crystal",
            body=(
                "Tartaric acid is not a textbook invention - it is where "
                "the whole subject started, and meso-tartaric acid is "
                "part of that history. Nineteenth-century chemists knew "
                "two tartaric acids from winemaking: an optically active "
                "one and an inactive 'racemic acid' whose name gave us "
                "the word racemate. Pasteur's 1848 separation showed the "
                "inactive material to be an equal mixture of two "
                "mirror-image forms.\n\n"
                "But a third, permanently inactive form was also known - "
                "one that could not be separated into active components "
                "no matter what was tried. That was meso-tartaric acid, "
                "and its existence was a genuine puzzle: how can a "
                "substance contain asymmetric carbons and yet be "
                "incapable of optical activity? The tetrahedral carbon "
                "of van 't Hoff and Le Bel supplied the answer - "
                "internal compensation - and meso compounds became the "
                "test case that a structural theory had to explain to be "
                "taken seriously.\n\n"
                "The episode repeats this unit's pattern: an anomalous "
                "MEASUREMENT (inactive despite stereocentres) preceded "
                "and then constrained the structural theory. Learning "
                "meso as a rule to memorise misses what it originally "
                "was - the evidence that molecules have three-dimensional "
                "shapes with symmetry properties of their own."
            ),
        ),
        ReadingSection(
            id="ms-exam-patterns",
            heading="How examiners ask it",
            body=(
                "Three costumes recur. THE COUNT: 'how many stereoisomers "
                "does this compound have?' - where the trap is answering "
                "$2^n$ without checking symmetry, and the tartaric and "
                "dimethylcyclohexane cases are the planted examples. THE "
                "IDENTIFICATION: 'which of these is a meso compound?' - "
                "solved by hunting the internal mirror plane rather than "
                "counting centres, since every option will have "
                "stereocentres.\n\n"
                "THE ZERO READING: 'this sample shows no optical "
                "rotation - what could it be?' - answered by enumerating "
                "achiral, racemic and meso rather than choosing one, and "
                "by naming the chiral-column experiment that "
                "distinguishes them. A fourth variant maps the family: "
                "given four descriptor sets, identify which pairs are "
                "enantiomers and which diastereomers - solved instantly "
                "by the inversion count, and slowly by anything else. "
                "All four reward drawing the map before answering, which "
                "is why this chapter recommends it twice."
            ),
        ),
        ReadingSection(
            id="ms-three-centres",
            heading="Three centres and beyond: the same procedure, more boxes",
            body=(
                "Extending to three stereocentres shows that nothing new "
                "is needed. The eight combinations are $(R,R,R)$, "
                "$(R,R,S)$, $(R,S,R)$, $(S,R,R)$, and their four "
                "mirror-image partners obtained by inverting all three "
                "descriptors - so the family organises into FOUR "
                "enantiomeric pairs, with every cross-pair "
                "diastereomeric.\n\n"
                "The inversion count still decides every relationship: "
                "three inversions means enantiomers, one or two means "
                "diastereomers, none means identical. And symmetry can "
                "still collapse the count, though the conditions grow "
                "more particular - a molecule needs matching halves for "
                "internal compensation, which is easier to arrange with "
                "an even number of centres.\n\n"
                "The practical scaling is what matters. Each new "
                "stereocentre doubles the family, so a synthesis that "
                "sets four centres is choosing one outcome from sixteen. "
                "This is why modern synthesis prizes reactions that set "
                "two or more centres in a single step with defined "
                "relative configuration - each such step collapses a "
                "branching problem rather than compounding it - and why "
                "the diastereomeric ratio of a key step is reported as "
                "prominently as its yield."
            ),
        ),
        ReadingSection(
            id="ms-relative-absolute",
            heading="Relative versus absolute configuration",
            body=(
                "Multi-centre work introduces a distinction worth naming "
                "explicitly. RELATIVE configuration describes how the "
                "centres stand with respect to EACH OTHER - whether two "
                "substituents are on the same side or opposite sides, "
                "which is the cis-trans language of the ring unit and the "
                "syn-anti language of chains. ABSOLUTE configuration "
                "specifies the actual handedness at each centre, which is "
                "what R and S report.\n\n"
                "The distinction has teeth because the two are "
                "independently determined and independently achieved. "
                "A diastereoselective reaction controls RELATIVE "
                "configuration - it decides whether the new centre "
                "matches or opposes the existing one - while leaving the "
                "absolute handedness of the pair undetermined if the "
                "substrate was racemic. An enantioselective reaction "
                "controls the ABSOLUTE configuration.\n\n"
                "So a route can deliver a single diastereomer as a "
                "racemate: perfect relative control, zero absolute "
                "control. Reading a synthesis paper requires holding "
                "both axes at once, and reporting conventions reflect "
                "it - diastereomeric ratio for the relative achievement, "
                "enantiomeric excess for the absolute one. The two "
                "numbers answer different questions and neither implies "
                "the other."
            ),
        ),
        ReadingSection(
            id="ms-meso-reactions",
            heading="Meso compounds in reactions: symmetry that can break",
            body=(
                "A meso compound's achirality is a property of the whole "
                "molecule, which means a reaction that destroys the "
                "internal symmetry can create chirality where none "
                "existed. Modify one half of a meso compound and the "
                "mirror plane vanishes - the product is chiral, and if "
                "the reagent was achiral it forms as a racemate.\n\n"
                "The reverse also happens: a reaction on a chiral "
                "substrate can produce a meso product by making the two "
                "halves equivalent, and the optical activity simply "
                "disappears. Watching rotation vanish during a reaction "
                "is therefore ambiguous evidence - it may mean "
                "racemisation, or it may mean the formation of a meso "
                "product, and telling them apart requires structure "
                "rather than the polarimeter.\n\n"
                "Enzymes exploit this in a way worth knowing: because "
                "the two halves of a meso compound are related by "
                "reflection, a chiral enzyme can distinguish them and "
                "modify one selectively - a strategy called "
                "desymmetrisation, which converts a cheap achiral "
                "starting material into an enantiopure product in a "
                "single step and escapes the fifty-percent ceiling that "
                "limits classical resolution. It is one of the more "
                "elegant answers to the problem the next chapters pose, "
                "and it exists only because meso compounds have "
                "distinguishable halves that ordinary reagents cannot "
                "see."
            ),
        ),
        ReadingSection(
            id="ms-vocabulary",
            heading="The vocabulary shelf",
            body=(
                "STEREOCENTRE: an atom whose group-swap produces a "
                "different stereoisomer - tested by the swap, not by "
                "counting substituents. $2^n$: the CEILING on "
                "stereoisomer count for $n$ centres, lowered by "
                "symmetry. MESO: a molecule containing stereocentres but "
                "possessing an internal mirror plane, hence achiral, "
                "optically inactive, and without an enantiomer.\n\n"
                "ENANTIOMERIC PAIR: two members of a family related by "
                "inversion at every centre. DIASTEREOMERIC: every other "
                "relationship within a family - and therefore separable "
                "by ordinary means. RELATIVE configuration: how centres "
                "stand to each other. ABSOLUTE configuration: the actual "
                "handedness, reported as R or S. DESYMMETRISATION: "
                "chiral modification of one half of a symmetric "
                "substrate, escaping the resolution yield ceiling.\n\n"
                "The through-line for the whole shelf is that "
                "stereochemistry is decided by the symmetry of the WHOLE "
                "molecule, never by a local feature counted in "
                "isolation - which is the single idea this chapter has "
                "been arguing from its first paragraph."
            ),
        ),
        ReadingSection(
            id="ms-worked-family",
            heading="Worked: mapping tartaric acid completely",
            body=(
                "Run the full procedure on tartaric acid to see every "
                "step operate. STEP ONE: count stereocentres - carbons 2 "
                "and 3, each bearing $H$, $OH$, $COOH$ and the rest of "
                "the chain. Two centres.\n\n"
                "STEP TWO: the ceiling is $2^2 = 4$. STEP THREE: are the "
                "halves constitutionally identical? Yes - carbon 2 and "
                "carbon 3 each carry a hydroxyl and a carboxyl, so "
                "internal compensation is possible. STEP FOUR: enumerate "
                "and merge. $(2R,3R)$ and $(2S,3S)$ are distinct and "
                "chiral. $(2R,3S)$ has the internal mirror plane; "
                "$(2S,3R)$ is the same molecule rotated. Merge them. "
                "THREE stereoisomers survive.\n\n"
                "STEP FIVE: map the relationships. $(2R,3R)$ and "
                "$(2S,3S)$ are enantiomers of each other; meso is a "
                "DIASTEREOMER of both. STEP SIX: state the consequences. "
                "The two chiral forms have identical melting points and "
                "equal-and-opposite rotations, and cannot be separated "
                "from each other by ordinary means. Meso has its own "
                "distinct melting point, reads zero on a polarimeter as "
                "a pure substance, and separates from the chiral forms "
                "by crystallisation - which is precisely the separation "
                "nineteenth-century chemists achieved before anyone "
                "could explain it."
            ),
        ),
        ReadingSection(
            id="ms-one-line",
            heading="The chapter in one line",
            body=(
                "Treat $2^n$ as a ceiling, enumerate the combinations, "
                "merge whatever internal symmetry makes identical, and "
                "map what survives into enantiomeric pairs with "
                "diastereomeric cross-links - and remember that a meso "
                "compound is what appears when a molecule contains its "
                "own mirror image, cancelling within itself what a "
                "racemate cancels between two molecules."
            ),
        ),
        ReadingSection(
            id="ms-checking-your-count",
            heading="Checking a count you are unsure of",
            body=(
                "When a count feels wrong, three independent checks "
                "usually locate the error. CHECK ONE - the pairing test: "
                "every chiral stereoisomer must have exactly one "
                "enantiomer in the family, so the chiral members must "
                "come in an EVEN number. An odd count of chiral "
                "structures means either a merge was missed or a meso "
                "compound was wrongly classified as chiral.\n\n"
                "CHECK TWO - the meso test applied to every candidate, "
                "not just the obvious one: any structure with an "
                "internal mirror plane is achiral, must have no partner, "
                "and must be counted once. CHECK THREE - the descriptor "
                "test: write out the descriptor set for every surviving "
                "structure and confirm no two are identical, since two "
                "identical descriptor sets always mean one substance "
                "counted twice.\n\n"
                "Applied to tartaric acid: two chiral members - an even "
                "number, correct; one meso member with no partner, "
                "correct; three distinct descriptor sets after merging "
                "$(2R,3S)$ with $(2S,3R)$, correct. Three consistent "
                "checks make a count trustworthy in a way that "
                "recomputing $2^n$ never can, and they take seconds "
                "once the family is drawn."
            ),
        ),
        ReadingSection(
            id="ms-why-it-scales",
            heading="Why this chapter's method scales",
            body=(
                "The procedure built here - enumerate, merge by "
                "symmetry, map into pairs, read consequences - does not "
                "get harder as molecules get more complex. It gets "
                "longer, but every step stays the same, which is the "
                "hallmark of a method worth learning rather than a trick "
                "worth memorising.\n\n"
                "Contrast it with the alternative students often "
                "attempt: reasoning about each structure holistically, "
                "trying to see whether two drawings 'look like' mirror "
                "images. That approach works at two stereocentres, "
                "becomes unreliable at three, and fails completely at "
                "the four or five that natural products routinely "
                "carry. The descriptor arithmetic does not degrade, "
                "because it never depended on visualisation in the "
                "first place.\n\n"
                "This is also why the R/S chapter insisted on writing "
                "assignments down with their justifications. Those "
                "labels are not decoration on a finished analysis - "
                "they are the data structure the rest of "
                "stereochemistry computes on, and a family map is only "
                "as reliable as the assignments feeding it. The next "
                "chapter gives sugars a notation that keeps five "
                "centres legible on paper, and the resolution chapter "
                "finally spends everything this unit has built."
            ),
        ),
        ReadingSection(
            id="ms-final-caution",
            heading="Two cautions to carry forward",
            body=(
                "First, symmetry is a property of the WHOLE molecule and "
                "must be re-checked whenever the molecule changes. A "
                "reaction at a position far from the stereocentres can "
                "create or destroy the internal mirror plane, converting "
                "a meso compound into a chiral one or the reverse, "
                "without touching a stereocentre at all. Counting done "
                "on the starting material does not transfer to the "
                "product.\n\n"
                "Second, the descriptor labels are not the "
                "stereochemistry - they are a naming convention laid "
                "over it. The cysteine case from the R/S chapter showed "
                "a label changing while the geometry stayed fixed, and "
                "the same caution applies here: when a family map and a "
                "physical observation disagree, re-examine the "
                "assignments before doubting the observation. The "
                "molecule is always right; the labels are only as good "
                "as the priorities that produced them, and the whole "
                "point of this unit's insistence on written-out "
                "assignments is to make that step checkable rather than "
                "remembered."
            ),
        ),
        ReadingSection(
            id="ms-what-comes-next",
            heading="What the notation chapters solve",
            body=(
                "Everything this chapter asks for - enumerate, merge, "
                "map - becomes harder to DRAW long before it becomes "
                "harder to think about. Four stereocentres in wedge-dash "
                "notation produce a picture the eye cannot parse "
                "reliably, and comparing sixteen such pictures is not a "
                "reasonable task.\n\n"
                "That practical failure is what the next chapter fixes. "
                "Fischer projections impose a rigid convention - "
                "horizontal bonds toward the viewer, vertical bonds "
                "away - which trades three-dimensional realism for "
                "instant comparability, and they were invented "
                "specifically for the sugar families whose sixteen "
                "members this chapter just counted. The rules are strict "
                "and the penalties for breaking them are silent "
                "inversions, so they are learned as rules rather than "
                "intuition. With that notation in hand, the unit can "
                "close on resolution."
            ),
        ),
    ),
    key_takeaways=(
        "2^n is a CEILING on stereoisomer count, not an answer - enumerate the combinations, then merge any related by internal mirror or whole-molecule rotation.",
        "Four stereoisomers organise as two enantiomeric pairs, with every cross-pair diastereomeric - so the pairs separate from each other by ordinary means while members within a pair do not.",
        "A meso compound carries stereocentres, has an internal mirror plane, is achiral and optically inactive, and has no enantiomer - tartaric acid's (2R,3S) form is the archetype.",
        "Spot meso by symmetry: constitutionally identical halves, oppositely configured centres, and a drawable internal mirror plane - the same test that makes cis-1,2- and cis-1,3-dimethylcyclohexane meso.",
        "A racemate cancels BETWEEN molecules and a meso compound cancels WITHIN one; both read zero, and a chiral column tells them apart by giving two peaks versus one.",
    ),
))

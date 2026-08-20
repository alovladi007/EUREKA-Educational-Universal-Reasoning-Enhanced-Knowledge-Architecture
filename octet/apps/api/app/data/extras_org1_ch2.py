"""Lecture-note depth for ORG1 chapter 2, Alkanes.

Tranche 1 of the organic depth programme (docs/organic_depth_benchmark.md).
Scope was checked against the benchmark's chapter-2 section list; every
sentence here is authored for OCTET.

All numeric values are experimental and sourced on the table that carries
them: boiling and melting points are the CRC Handbook liquid-range values,
isomer counts are exact enumerations, torsional energies are the gas-phase
values used across the physical organic literature. Nothing is estimated.
"""

from __future__ import annotations

from app.data.lesson_extras import (
    Figure,
    LessonExtras,
    ReadingSection,
    Table,
)

EXTRAS_ORG1_CH2: dict[str, LessonExtras] = {}


def _add(extras: LessonExtras) -> None:
    EXTRAS_ORG1_CH2[extras.node] = extras


# --------------------------------------------------------------------------
# 2.1 Alkane nomenclature — and the survey that makes it worth learning
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.ALKANENOMEN",
    lead=(
        "Alkanes are the hydrocarbons with nothing going on: every carbon "
        "sp3, every bond a sigma bond, no functional group anywhere. That "
        "is exactly why the course starts with them. Because nothing else "
        "is happening, alkanes isolate the three skills every later chapter "
        "assumes without comment - naming a carbon skeleton, drawing it "
        "quickly, and predicting its physical behaviour from structure "
        "alone. This chapter also carries the course's first real data: "
        "boiling points, melting points and heats of combustion, all "
        "measured, all explainable from structure."
    ),
    sections=(
        ReadingSection(
            id="hydrocarbon-families",
            heading="The hydrocarbon families and where alkanes sit",
            body=(
                "A hydrocarbon contains carbon and hydrogen and nothing "
                "else. Four families cover all of them, sorted by what kind "
                "of carbon-carbon bonds they hold. Alkanes have only single "
                "bonds; alkenes carry at least one double bond; alkynes at "
                "least one triple bond; and aromatic hydrocarbons hold the "
                "special cyclic pi system that gets four chapters of its "
                "own in Organic II. An alkane with no ring has the formula "
                "$C_nH_{2n+2}$, and that formula is worth internalising "
                "because every deviation from it is information: each ring "
                "or each double bond removes exactly two hydrogens. Count "
                "the shortfall and you know how many rings plus pi bonds a "
                "molecule must contain before you have drawn a single "
                "structure - the degree of unsaturation, "
                "$\\text{DoU} = \\tfrac{2n + 2 - H}{2}$ for $C_nH_x$. An "
                "alkane scores zero, which is a definition and a check: if "
                "your alkane structure does not fit $C_nH_{2n+2}$, you have "
                "drawn a ring, a pi bond, or a mistake.\n\n"
                "The unbranched alkanes form a series - methane, ethane, "
                "propane, butane, then pentane through decane on the Greek "
                "roots. Each member differs from the last by one $CH_2$ "
                "unit, and a family built that way is called homologous. "
                "The names through decane are not optional vocabulary; "
                "substitutive nomenclature builds every other name out of "
                "them, and the physical-property trends in this chapter are "
                "read along this series."
            ),
        ),
        ReadingSection(
            id="substitutive-naming",
            figure=Figure(
                stem="org1-hexane-isomers",
                caption=(
                    "The five hexanes, drawn from their molecular graphs. Naming all five - and finding no sixth - is the algorithm at work."
                ),
                alt="Skeletal structures of hexane, 2-methylpentane, 3-methylpentane, 2,2-dimethylbutane and 2,3-dimethylbutane in a grid.",
            ),
            heading="Substitutive nomenclature, as an algorithm",
            body=(
                "IUPAC substitutive nomenclature is a deterministic "
                "algorithm, and treating it as one removes every argument "
                "with the answer key. Step one: find the longest continuous "
                "carbon chain. Continuous means you may turn corners as "
                "drawn on paper - the zig-zag is an artefact of drawing, "
                "not of bonding. If two chains tie for longest, take the "
                "one carrying more substituents. Step two: number the chain "
                "from the end that gives the first substituent the lowest "
                "number; if the first point of difference ties, compare at "
                "the second, and only if the whole locant sets tie does "
                "alphabetical order break it. Step three: name each "
                "substituent as an -yl group, alphabetise ignoring the "
                "multiplying prefixes di-, tri-, tetra- (but not ignoring "
                "iso-, which alphabetises under i), and assemble: locants, "
                "prefixes, parent, suffix.\n\n"
                "Two conventions do real work later. First, the carbon "
                "classification: a carbon bonded to one other carbon is "
                "primary, to two secondary, to three tertiary, to four "
                "quaternary - and the same labels transfer to hydrogens "
                "and, in chapter 9, to carbocations and radicals, where "
                "the classification decides reactivity. Second, the R "
                "notation: R- stands for any alkyl group, so $R\\!-\\!OH$ "
                "names every alcohol at once. A compound class is defined "
                "by its functional group plus R for the part that does not "
                "matter, and reading structures that way - group first, "
                "skeleton second - is the habit that makes the rest of the "
                "course legible."
            ),
        ),
        ReadingSection(
            id="drawing-conventions",
            heading="Condensed and skeletal structures",
            body=(
                "Nobody draws every C and H for long. A condensed structure "
                "collapses each carbon and its hydrogens into a formula "
                "fragment written in bonding order: "
                "$CH_3CH_2CH_2CH_3$ for butane, "
                "$(CH_3)_3CH$ for isobutane, where the parenthesis means "
                "three methyls on the carbon that follows. A skeletal "
                "structure goes further: carbons are vertices and line "
                "ends, hydrogens on carbon are not drawn at all, and every "
                "heteroatom keeps its hydrogens explicit. Reading one is a "
                "two-step reflex - place a carbon at every vertex and "
                "terminus, then add hydrogens until each carbon has four "
                "bonds. The reflex must run without conscious effort, "
                "because from chapter 4 onward every mechanism in the "
                "course is drawn skeletally and the hydrogens you do not "
                "see are frequently the atoms that move.\n\n"
                "Cycloalkanes are drawn as bare polygons and named with the "
                "cyclo- prefix. A ring costs two hydrogens - cyclohexane "
                "is $C_6H_{12}$, formula $C_nH_{2n}$ - which is the first "
                "worked case of the unsaturation count above. When a ring "
                "carries substituents, number around the ring to give the "
                "lowest locant set, starting at the substituent that comes "
                "first alphabetically when there is a choice. Common "
                "substituent abbreviations - Me, Et, Pr, iPr, Bu, tBu, Ph "
                "- appear in the literature and in this course's later "
                "chapters; learn them as vocabulary now, while the "
                "structures they stand for are still simple."
            ),
        ),
        ReadingSection(
            id="physical-properties",
            figure=Figure(
                stem="org1-alkane-bp-trend",
                caption=(
                    "Boiling and melting points of the unbranched alkanes, plotted from the table's CRC values: the smooth bp climb against the uneven mp series."
                ),
                alt="Line chart of boiling and melting points versus carbon count for C1 through C8 alkanes.",
            ),
            heading="Boiling points, melting points, and what they measure",
            body=(
                "An alkane's boiling point measures how much thermal energy "
                "it takes to pull molecules out of the liquid against their "
                "mutual attractions. Alkanes are nonpolar, so the only "
                "attraction available is London dispersion - transient "
                "dipoles induced across touching surfaces - and dispersion "
                "scales with contact area. The data behave exactly as that "
                "predicts. Along the unbranched series the boiling point "
                "climbs smoothly, roughly 20-30 degrees per added $CH_2$ "
                "at the light end and less later: more chain, more "
                "touchable surface. Branching cuts the boiling point at "
                "constant formula: pentane boils at 36.1 C, 2-methylbutane "
                "at 27.8 C, and 2,2-dimethylpropane - the most compact of "
                "the three - at 9.5 C. Same molecular weight, one answer: "
                "a branched molecule is closer to a sphere, a sphere has "
                "the least surface for its volume, and less surface means "
                "less dispersion to overcome.\n\n"
                "Melting points follow a different logic, because melting "
                "destroys a lattice rather than a surface contact, and "
                "lattice stability depends on how neatly molecules pack. "
                "That is why the melting-point series zig-zags where the "
                "boiling-point series is smooth - even-numbered chains "
                "pack better than odd - and why the ultra-symmetric "
                "2,2-dimethylpropane melts at -16.6 C while boiling at "
                "9.5 C: a molecule shaped like a ball packs into a crystal "
                "beautifully and leaves it easily. The rule of thumb the "
                "data support: boiling tracks surface area, melting tracks "
                "symmetry, and the two can rank the same compounds in "
                "opposite orders. Alkanes are also less dense than water "
                "and insoluble in it - the practical consequences, from "
                "oil slicks floating to why water does not put out a "
                "gasoline fire, follow directly."
            ),
            table=Table(
                caption="Boiling and melting points of unbranched alkanes",
                columns=("Alkane", "Formula", "bp (C)", "mp (C)"),
                rows=(
                    ("methane", "CH4", "-161.5", "-182.5"),
                    ("ethane", "C2H6", "-88.6", "-183.3"),
                    ("propane", "C3H8", "-42.1", "-187.7"),
                    ("butane", "C4H10", "-0.5", "-138.3"),
                    ("pentane", "C5H12", "36.1", "-129.7"),
                    ("hexane", "C6H14", "68.7", "-95.3"),
                    ("heptane", "C7H16", "98.4", "-90.6"),
                    ("octane", "C8H18", "125.7", "-56.8"),
                ),
                source="CRC Handbook of Chemistry and Physics, physical constants of organic compounds",
                note="bp at 1 atm. Note the smooth bp climb against the uneven mp column.",
            ),
        ),
        ReadingSection(
            id="combustion",
            heading="Combustion: the one reaction alkanes always give",
            body=(
                "Alkanes are inert to acids, bases, and most reagents in "
                "this course - chapter 9's radical halogenation is the "
                "exception - but they all burn. Complete combustion turns "
                "$C_nH_{2n+2}$ plus oxygen into n $CO_2$ and (n+1) "
                "$H_2O$, releasing heat: methane's standard enthalpy of "
                "combustion is -890 kJ/mol, and each additional $CH_2$ "
                "unit adds close to -650 kJ/mol across the series. Two "
                "readings of that number matter. Practically, it is why "
                "alkanes are fuels - natural gas is mostly methane, LPG "
                "is propane and butane, gasoline is centred on branched "
                "C6-C9 alkanes - and why balancing a combustion equation "
                "is a skill worth thirty seconds of practice. "
                "Thermochemically, heats of combustion are measured to "
                "high precision, which makes them a clean ruler for "
                "comparing isomer stabilities: two isomers burn to the "
                "identical products, so the one that releases *less* heat "
                "started lower - more stable - and the difference is the "
                "stability gap in kJ/mol. Chapter 4 uses exactly this "
                "ruler on alkenes to establish that more-substituted "
                "double bonds are more stable, so meet it here where the "
                "logic is uncluttered.\n\n"
                "Incomplete combustion, with oxygen limited, diverts "
                "carbon into CO or soot; that is a safety fact (CO binds "
                "hemoglobin) and a preview of why reaction conditions, "
                "not just reagents, decide outcomes."
            ),
            important=(
                "Isomer stability from combustion works only because both "
                "isomers burn to the same products. The comparison breaks "
                "the moment the formulas differ - never compare heats of "
                "combustion across different molecular formulas."
            ),
        ),
    ),
    key_takeaways=(
        "Acyclic alkanes fit CnH2n+2; each ring or pi bond removes two H. The unsaturation count is structure information you get before drawing anything.",
        "Nomenclature is an algorithm: longest chain, lowest locants at first difference, alphabetise ignoring multiplying prefixes.",
        "Boiling points track dispersion surface: longer chains boil higher, branched isomers boil lower. Melting points track packing symmetry instead.",
        "Heats of combustion are a measured stability ruler for isomers, because identical products cancel everything except the starting compounds' energies.",
        "1/2/3/4-degree carbon classification transfers unchanged to carbocations and radicals, where it decides reactivity.",
    ),
    exam_tips=(
        "MCAT ranking questions on boiling points are surface-area questions in disguise: rank by chain length first, then penalise branching.",
        "Given CxHy, compute degrees of unsaturation before anything else - it eliminates answer choices that carry the wrong ring/pi count.",
    ),
))


# --------------------------------------------------------------------------
# 2.2 Constitutional isomers
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.ISOMERS",
    lead=(
        "Butane and 2-methylpropane share the formula C4H10 and almost "
        "nothing else: different boiling points, different melting points, "
        "different chemistry at the branch point. Molecules with the same "
        "formula but different atom-to-atom connectivity are constitutional "
        "isomers, and they are the first of several kinds of 'same formula, "
        "different compound' this course distinguishes. Getting the "
        "definition exact now - connectivity, not shape - pays off in "
        "chapter 6, where isomers that share even their connectivity "
        "appear."
    ),
    sections=(
        ReadingSection(
            id="what-counts-as-different",
            figure=Figure(
                stem="org1-c5-isomers",
                caption=(
                    "The three C5H12 constitutional isomers with their boiling points: one formula, three compounds, three sets of constants."
                ),
                alt="Skeletal structures of pentane, 2-methylbutane and 2,2-dimethylpropane with boiling points.",
            ),
            heading="Connectivity is the test, not appearance",
            body=(
                "Two structures are the same compound if every atom has "
                "the same bonding partners in both - no matter how "
                "differently the drawings bend. A pentane drawn straight "
                "and a pentane drawn as a U are one compound, because "
                "rotation about single bonds interconverts the drawings "
                "without breaking anything. Two structures are "
                "constitutional isomers when the formulas match but the "
                "bonding maps do not: somewhere, an atom's list of "
                "neighbours differs. The reliable procedure is to name "
                "both structures - the nomenclature algorithm returns the "
                "same name for the same connectivity, so identical names "
                "mean identical compounds, and different names on the "
                "same formula mean constitutional isomers. This turns a "
                "visual judgement, where curved drawings deceive, into a "
                "mechanical one, where they cannot.\n\n"
                "Connectivity differences come in flavours worth naming "
                "informally. Skeletal isomers differ in the carbon "
                "framework itself, like butane against 2-methylpropane. "
                "Positional isomers hold the same group at different "
                "places on the same skeleton - 1-chloropropane against "
                "2-chloropropane. Functional isomers, which appear once "
                "heteroatoms arrive, hold different groups altogether: an "
                "ether and an alcohol can share a formula. The exam skill "
                "in all three cases is the same: draw systematically "
                "(longest chain first, then shorten it one carbon at a "
                "time while adding branches), name each candidate, and "
                "discard duplicates by name."
            ),
        ),
        ReadingSection(
            id="counting-isomers",
            heading="How fast the isomer count grows",
            body=(
                "Butane has 2 constitutional isomers. Pentane has 3, "
                "hexane 5, heptane 9, octane 18, nonane 35, decane 75 - "
                "and by C20 the count exceeds three hundred thousand. The "
                "growth is combinatorial: every added carbon multiplies "
                "the ways a skeleton can branch. Two consequences follow. "
                "First, organic chemistry is not memorisable compound by "
                "compound; there are too many. The subject is learnable "
                "only because functional groups behave the same way on "
                "any skeleton - which is precisely the R-notation idea, "
                "and the real reason the course organises by group rather "
                "than by compound. Second, the isomer explosion is why "
                "systematic nomenclature exists at all: trivial names "
                "cannot scale to 75 decanes, but the algorithm names "
                "every one uniquely.\n\n"
                "Isomer counting by hand stays honest only with a "
                "system. For C6H14: start with hexane; shorten to a "
                "pentane chain and place one methyl (2-methylpentane, "
                "3-methylpentane - the 4-position duplicates the "
                "2-position by numbering from the other end); shorten to "
                "butane and place two methyls (2,2- and 2,3-"
                "dimethylbutane); a propane chain with three methyls "
                "re-creates 2,2-dimethylbutane, so the count closes at "
                "five. Every 'new' isomer beyond the true count is a "
                "renumbering of an old one, and the name catches "
                "it.\n\n"
                "The discipline earns interest later. Structure-"
                "determination problems in Organic II hand you a "
                "molecular formula and a spectrum, and the winning "
                "first move is always enumeration: list what the "
                "formula permits, then let the spectrum vote "
                "candidates off the list. A student who can write "
                "all five hexanes in ninety seconds - and knows the "
                "list is complete rather than hopes it is - starts "
                "every such problem with the answer space already "
                "fenced. One warning closes the lesson: rotated "
                "drawings, flipped drawings and zig-zags bent into "
                "horseshoes are the standard traps in isomer-"
                "counting questions, and the name test defeats all "
                "of them, because a rotation changes the picture "
                "but never the name."
            ),
            table=Table(
                caption="Constitutional isomer counts for acyclic alkanes",
                columns=("Formula", "Isomers"),
                rows=(
                    ("C4H10", "2"),
                    ("C5H12", "3"),
                    ("C6H14", "5"),
                    ("C7H16", "9"),
                    ("C8H18", "18"),
                    ("C9H20", "35"),
                    ("C10H22", "75"),
                ),
                source="Exact enumeration of acyclic alkane structural isomers (OEIS A000602)",
                note="Counts exclude stereoisomers, which chapter 6 adds on top.",
            ),
        ),
        ReadingSection(
            id="isomers-properties",
            figure=Figure(
                stem="org1-c5-bpmp",
                caption=(
                    "Boiling and melting points of the C5H12 trio, from the lesson's data: branching lowers the boiling point while the symmetric isomer melts highest."
                ),
                alt="Grouped bar chart of boiling and melting points for the three C5H12 isomers.",
            ),
            heading="Isomers are different compounds, with the data to prove it",
            body=(
                "Constitutional isomers are not variants of one substance; "
                "they are separate compounds with separate constants. The "
                "C5H12 trio makes the point with three boiling points - "
                "pentane 36.1 C, 2-methylbutane 27.8 C, "
                "2,2-dimethylpropane 9.5 C - a 26-degree spread on one "
                "formula, entirely explained by the surface-area argument "
                "of the previous lesson. Their melting points invert the "
                "order: the most spherical isomer, 2,2-dimethylpropane, "
                "melts highest (-16.6 C against pentane's -129.7 C) "
                "because the sphere packs a lattice best. One formula, "
                "opposite rankings on two properties, both predicted by "
                "structure - that is the chapter's whole thesis in one "
                "example.\n\n"
                "Chemical behaviour diverges too. 2-Methylpropane carries "
                "a tertiary C-H that butane lacks, and chapter 9's "
                "radical halogenation will select it sharply; the "
                "branched gasoline components resist engine knock "
                "(octane rating is literally scaled on 2,2,4-"
                "trimethylpentane at 100 against heptane at 0). When a "
                "question says 'same formula', the trained response is "
                "not 'so they are similar' but 'so check the "
                "connectivity' - everything measurable is allowed to "
                "differ.\n\n"
                "Separate constants also mean isomers are physically "
                "separable, and the boiling-point column is the "
                "laboratory's handle for doing it. Fractional "
                "distillation divides crude oil into cuts precisely "
                "because chain length moves the boiling point in "
                "reliable steps, and a 26-degree spread like the "
                "C5H12 trio's is an easy afternoon's separation. Gas "
                "chromatography runs on the same physics "
                "miniaturised: each isomer's retention time is a "
                "reproducible constant of the compound, so a "
                "two-component chromatogram is proof of a "
                "two-isomer mixture even when the mass spectrometer "
                "sees a single formula. That is the working "
                "definition of 'different compound' worth keeping - "
                "different measurable constants, separable in "
                "principle by an instrument that exploits any one of "
                "them - and it is the standard the stereoisomers of "
                "chapter 6 will complicate in an instructive way, "
                "when two compounds share every achiral constant and "
                "differ only toward polarised light and chiral "
                "environments."
            ),
        ),
        ReadingSection(
            id="rings-and-unsaturation",
            heading="Isomers across families: rings, and the unsaturation count at work",
            body=(
                "Constitutional isomerism does not stop at branching, "
                "because connectivity changes can cross family lines. "
                "The formula C4H8 fits two hydrogens short of the alkane "
                "rule, so its isomers each carry exactly one ring or one "
                "pi bond: cyclobutane and methylcyclopropane on the ring "
                "side; 1-butene, cis- and trans-2-butene and "
                "2-methylpropene on the alkene side. A ring and a double "
                "bond are interchangeable as far as the formula is "
                "concerned, and only the unsaturation count - not the "
                "formula alone - tells you how many of either to expect. "
                "That is why the count runs first in any isomer problem: "
                "$\\text{DoU} = \\tfrac{2n + 2 - H}{2}$ partitions the "
                "candidates before a single structure is drawn, and each "
                "unit of the answer must be spent on one ring or one pi "
                "bond, no more, no fewer.\n\n"
                "The workflow scales to the formulas later chapters "
                "throw. Oxygen changes nothing in the arithmetic; each "
                "nitrogen adds one to the hydrogen budget; each halogen "
                "counts as a hydrogen. A formula like C4H8O therefore "
                "still carries one unsaturation, and its isomer space "
                "spans an unsaturated alcohol, a cyclic ether, an "
                "aldehyde and a ketone - four different functional "
                "families on one formula, all flagged before drawing. "
                "Trained this way, a molecular formula stops being an "
                "inert label and becomes the first analytical "
                "instrument of the course: mass spectrometry in Organic "
                "II hands you exactly such formulas, and the "
                "unsaturation count is the first thing a spectroscopist "
                "computes from one. The habit also runs the isomer "
                "drill in reverse: given a proposed structure and a "
                "formula, count rather than stare - if the structure's "
                "rings plus pi bonds disagree with the formula's count, "
                "the structure is wrong, and no amount of redrawing "
                "will fix it."
            ),
        ),
    ),
    key_takeaways=(
        "Same formula + same connectivity = same compound, however differently drawn. Same formula + different connectivity = constitutional isomers.",
        "Name both structures to decide: the algorithm returns one name per connectivity.",
        "Isomer counts explode combinatorially (C10 already has 75) - the reason the course organises by functional group, not by compound.",
        "Isomers own separate physical constants; the C5H12 trio spreads 26 degrees in bp on one formula.",
    ),
    exam_tips=(
        "'How many isomers of CnH2n+2' questions: work longest-chain-down and name each candidate; duplicates expose themselves by renumbering to an existing name.",
    ),
))


# --------------------------------------------------------------------------
# 2.3 Conformations: Newman projections and torsional energy
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.NEWMAN",
    lead=(
        "A sigma bond permits rotation, so a molecule of butane at room "
        "temperature is not one shape but a rapidly interconverting "
        "population of shapes. Those shapes - conformations - differ in "
        "energy by amounts small enough that rotation never stops, yet "
        "large enough that the population is far from uniform. This lesson "
        "builds the tool for seeing conformations (the Newman projection), "
        "the energy vocabulary for ranking them (torsional and steric "
        "strain), and the two profiles - ethane's and butane's - that "
        "every later conformational argument, chair cyclohexane included, "
        "is built from."
    ),
    sections=(
        ReadingSection(
            id="newman-howto",
            figure=Figure(
                stem="org1-newman-projections",
                caption=(
                    "Staggered and eclipsed Newman projections, constructed from the 60-degree geometry the text describes."
                ),
                alt="Two Newman projections: staggered with back bonds between front bonds, eclipsed with back bonds nearly hidden.",
            ),
            heading="The Newman projection, constructed",
            body=(
                "Sight straight down the bond you care about. The front "
                "carbon becomes a dot with its three remaining bonds at "
                "120-degree spacing; the back carbon becomes a circle "
                "with its three bonds emerging from behind the rim. The "
                "dihedral angle between a front substituent and a back "
                "substituent is then read directly off the drawing, which "
                "is the projection's entire purpose: it turns a "
                "three-dimensional rotation into a two-dimensional angle "
                "you can measure with your eyes.\n\n"
                "Two limiting arrangements matter. Staggered, at 60-degree "
                "dihedrals, places every back bond exactly between two "
                "front bonds. Eclipsed, at 0 degrees, hides each back "
                "bond directly behind a front one - by convention drawn "
                "with a slight offset so the back bonds stay visible. "
                "Rotating the back carbon by 60 degrees converts one into "
                "the other, and a full 360-degree turn passes through "
                "three staggered and three eclipsed arrangements. The "
                "sawhorse drawing - the same bond viewed from 45 degrees "
                "off-axis - carries identical information and is worth "
                "recognising, but the Newman is the working tool because "
                "the dihedral is explicit."
            ),
        ),
        ReadingSection(
            id="ethane-barrier",
            heading="Ethane: torsional strain and a 12 kJ/mol barrier",
            body=(
                "Ethane's rotation profile is the simplest possible: "
                "staggered is the minimum, eclipsed the maximum, and the "
                "barrier between them is 12 kJ/mol (about 2.9 kcal/mol). "
                "The destabilisation of the eclipsed form is called "
                "torsional strain, and its physical origin is electronic "
                "rather than a hydrogen-hydrogen collision: the eclipsed "
                "geometry aligns filled C-H bonding orbitals on the two "
                "carbons, forcing filled-filled repulsion, while the "
                "staggered geometry aligns each filled C-H sigma orbital "
                "with an empty sigma-star across the bond, a small "
                "stabilising donation. Each eclipsed H/H pair costs about "
                "4 kJ/mol, three pairs at once giving the 12.\n\n"
                "What does a 12 kJ/mol barrier mean at room temperature? "
                "Available thermal energy crosses it around $10^{10}$ "
                "times per second, so ethane's rotation is free for every "
                "practical purpose - there is no bottling a single "
                "conformer. But the population still tilts: the Boltzmann "
                "weighting $e^{-\\Delta E / RT}$ keeps the molecule "
                "staggered nearly all of the time. Both halves of that "
                "sentence recur throughout the course: barriers of this "
                "size never stop chemistry, and populations still follow "
                "energies."
            ),
        ),
        ReadingSection(
            id="butane-profile",
            heading="Butane: gauche, anti, and steric strain",
            body=(
                "Butane, viewed down its C2-C3 bond, adds one new "
                "ingredient: the two methyl groups are large enough to "
                "collide. The staggered arrangements are no longer "
                "equivalent. Anti, with the methyls at 180 degrees, is "
                "the global minimum. Gauche, with the methyls at 60 "
                "degrees, sits 3.8 kJ/mol higher: the methyls' electron "
                "clouds crowd each other in space. That crowding cost is "
                "steric strain, and it is a different animal from "
                "torsional strain - steric strain is atoms forced too "
                "close, torsional strain is bonds forced into "
                "alignment, and butane's profile displays both "
                "separately.\n\n"
                "The eclipsed arrangements split the same way. At 120 "
                "degrees each methyl eclipses a hydrogen: roughly 16 "
                "kJ/mol above anti, torsional strain plus modest "
                "methyl/H contact. At 0 degrees the methyls eclipse each "
                "other - the syn conformation, the profile's summit at "
                "roughly 19-25 kJ/mol (values in that range are quoted "
                "across the literature; the strain is real however "
                "quoted), where torsional and steric strain add. The "
                "resulting double-well profile with unequal maxima is "
                "the template for every conformational analysis to "
                "come.\n\n"
                "At equilibrium, the anti/gauche energy gap and the "
                "gauche form's two-fold degeneracy (plus 60 and minus "
                "60) put roughly two thirds of butane molecules anti and "
                "one third gauche at room temperature. The gauche "
                "arrangement is not exotic - a third of the population "
                "lives there - and 'gauche interaction' becomes a "
                "counting unit in chapter 7, where each axial "
                "substituent on a cyclohexane chair is charged exactly "
                "in gauche-butane currency. Learn the 3.8 kJ/mol here; "
                "chapter 7 spends it."
            ),
            figure=Figure(
                stem="org1-butane-torsion",
                caption=(
                    "Torsional energy of butane about the C2-C3 bond, "
                    "drawn from the values in the text: anti 0, gauche "
                    "3.8, methyl/H eclipsed 16, syn approximately 19 "
                    "kJ/mol."
                ),
                alt=(
                    "Energy versus dihedral angle from 0 to 360 degrees "
                    "for butane, showing minima at 60, 180 and 300 "
                    "degrees with the deepest at 180, and maxima at 0, "
                    "120, 240 and 360 with the highest at 0 and 360."
                ),
            ),
            table=Table(
                caption="Butane conformational energies relative to anti",
                columns=("Dihedral (CH3-C-C-CH3)", "Conformation", "Relative energy (kJ/mol)"),
                rows=(
                    ("180", "anti (staggered)", "0"),
                    ("60 / 300", "gauche (staggered)", "3.8"),
                    ("120 / 240", "eclipsed (CH3/H)", "~16"),
                    ("0 / 360", "syn (CH3 eclipsing CH3)", "~19-25"),
                ),
                source="Gas-phase butane torsional profile as tabulated in standard physical organic references",
                note="The syn maximum is quoted across a range in the literature; its ordering above the CH3/H eclipsed forms is not in dispute.",
            ),
        ),
        ReadingSection(
            id="conformational-thinking",
            heading="Why conformational analysis earns its keep",
            body=(
                "Conformations feel like bookkeeping until a reaction "
                "cares about them, and several will. E2 elimination "
                "(chapter 9) requires the leaving group and the departing "
                "hydrogen anti to one another - a purely conformational "
                "demand that decides which alkene forms, and on rings "
                "decides whether the reaction runs at all. Chair "
                "cyclohexane (chapter 7) is conformational analysis "
                "promoted to the main event, with the A-values quantifying "
                "what each substituent pays to sit axial. Even "
                "spectroscopy feels it: NMR at low temperature can freeze "
                "populations the room-temperature spectrum averages.\n\n"
                "The habits to carry forward are mechanical. Draw the "
                "Newman for the bond in question; place the two largest "
                "groups anti for the best conformer; count gauche "
                "interactions to rank the rest; remember that eclipsed "
                "forms are transition states of rotation, not compounds "
                "you can isolate. And keep the energy scale calibrated: "
                "4 kJ/mol per eclipsed H/H, 3.8 per methyl-methyl "
                "gauche, 12 for ethane's whole barrier - small numbers, "
                "crossed constantly at room temperature, and still "
                "running the show whenever geometry gates a reaction."
            ),
            important=(
                "Conformations interconvert by rotation and are not "
                "isomers you can separate. The stereoisomers of chapter "
                "6 differ by configuration - interconverting those "
                "requires breaking bonds. Keeping conformation and "
                "configuration distinct is the single most valuable "
                "habit this chapter installs."
            ),
        ),
        ReadingSection(
            id="populations-arithmetic",
            heading="From energies to populations: the Boltzmann arithmetic",
            body=(
                "The energy differences in this lesson become predictive "
                "the moment they pass through the Boltzmann factor. At "
                "298 K, RT is 2.48 kJ/mol, so the anti/gauche gap gives "
                "$e^{-3.8/2.48} \\approx 0.22$ per gauche well. Two "
                "gauche wells (plus and minus 60 degrees) against one "
                "anti well makes the odds roughly 0.44 to 1, which is "
                "about 30 percent gauche and 70 percent anti - the "
                "two-thirds figure quoted earlier, now derived rather "
                "than asserted. The same three-line calculation answers "
                "every population question the course asks: divide the "
                "energy gap by 2.48, exponentiate, weight by how many "
                "equivalent wells each conformer owns.\n\n"
                "Longer chains repeat the same local story bond by bond. "
                "Pentane viewed down C2-C3 and down C3-C4 shows the "
                "butane profile twice, and the all-anti arrangement - "
                "the extended zig-zag every skeletal drawing implies - "
                "is simply the conformation that wins the Boltzmann "
                "vote at every bond simultaneously. It is a plurality, "
                "not a monopoly: at room temperature a hexane sample is "
                "a writhing ensemble in which most molecules hold a "
                "gauche kink somewhere. The zig-zag convention is "
                "honest about energies, not a claim about frozen "
                "geometry. Where the stakes rise is the solid state "
                "and the macromolecule: polyethylene chains crystallise "
                "in the all-anti conformation because packing amplifies "
                "small preferences, and the fatty-acid chains of "
                "chapter 17's lipids do the same, which is why "
                "saturated fats - free to reach all-anti - stack and "
                "solidify while cis-kinked unsaturated chains cannot. "
                "A 3.8 kJ/mol preference, iterated down a long chain "
                "and reinforced by neighbours, becomes the difference "
                "between butter and oil.\n\n"
                "One caution closes the loop with the free-energy "
                "language of the next chapter: Boltzmann weighting "
                "ranks conformers by energy, but an observed "
                "population is an average over a fast equilibrium, "
                "not a count of frozen molecules. NMR at room "
                "temperature reports one averaged signal set for "
                "butane because interconversion outruns the "
                "measurement; cool the sample enough and the "
                "populations freeze into separable signals. Fast "
                "exchange hiding real populations is a motif that "
                "returns with ring flips and amide rotation."
            ),
        ),
    ),
    key_takeaways=(
        "Newman projections make dihedral angles visible: front dot, back circle, read the angle.",
        "Torsional strain (eclipsed bonds, ethane: 12 kJ/mol barrier) and steric strain (crowded atoms, gauche butane: 3.8 kJ/mol) are distinct costs that butane's profile shows separately.",
        "Anti > gauche > eclipsed CH3/H > syn is butane's energy order; about two thirds anti at room temperature.",
        "Rotation is fast at these barriers - conformers are populations, never separable compounds.",
        "The gauche-butane interaction is the currency chair cyclohexane spends in chapter 7.",
    ),
    exam_tips=(
        "Most-stable-conformer questions: put the two biggest groups anti in a Newman, then count gauche interactions to rank remaining choices.",
        "If a question shows an eclipsed structure among answer choices for 'most stable', it is never the answer - eclipsed forms are rotation's transition states.",
    ),
))

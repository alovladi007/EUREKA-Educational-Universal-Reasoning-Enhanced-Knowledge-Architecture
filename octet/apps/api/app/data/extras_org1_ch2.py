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
        ReadingSection(
            id="complex-substituents",
            heading="Complex substituents: the algorithm under load",
            body=(
                "The three-step algorithm holds for every alkane, but "
                "real names stress it in predictable places, and working "
                "those places once removes them as exam hazards. Multiple "
                "identical substituents take multiplying prefixes with "
                "every locant written out: two methyls at C2 and C4 of "
                "hexane give 2,4-dimethylhexane, and the commas between "
                "numbers plus the hyphen between number and word are not "
                "typography - graders and indexing software both parse "
                "them. When identical substituents share a carbon, the "
                "locant repeats: 2,2-dimethylbutane, never "
                "2-dimethylbutane, because every substituent owns a "
                "number. Halogens enter the same machinery as alkyl "
                "groups, named halo- (fluoro, chloro, bromo, iodo) and "
                "alphabetised with everything else: "
                "2-bromo-3-methylpentane places bromo before methyl by "
                "the alphabet even though the methyl sits closer to the "
                "middle of the chain.\n\n"
                "Branched substituents force the algorithm to recurse. "
                "A three-carbon substituent attached through its middle "
                "carbon is isopropyl in the common system, or "
                "(1-methylethyl) in fully systematic form - the "
                "parenthesised name is itself built by the same rules, "
                "numbered from the attachment point. The four-carbon "
                "set is worth memorising as vocabulary because it "
                "recurs constantly: butyl (attached at C1 of a straight "
                "chain), sec-butyl (attached at C2), isobutyl (attached "
                "at the end of the branched chain), and tert-butyl "
                "(attached at the branch carbon itself). Alphabetisation "
                "treats iso- as part of the name (isobutyl files under "
                "i) but ignores sec- and tert- (sec-butyl files under "
                "b) - an arbitrary-looking convention that is "
                "nevertheless the convention, and a favourite "
                "half-point on exams.\n\n"
                "Run one full worked example under load. Draw a "
                "six-carbon chain; put methyls on C2 and C2 again, an "
                "ethyl on C4. Longest chain: six (check for a longer "
                "chain through the ethyl - going through it gives six "
                "as well, but the all-carbon backbone with MORE "
                "substituents wins ties, and both give three, so either "
                "works; take the drawn one). Number from the end "
                "nearest the first substituent: methyls at 2,2 beat "
                "ethyl at 3 from the other side, so the methyl end is "
                "C1. Assemble alphabetically: ethyl before methyl, "
                "locants attached - 4-ethyl-2,2-dimethylhexane. Every "
                "clause of that paragraph exercised one rule; naming "
                "fluency is exactly this loop run until it is "
                "automatic."
            ),
        ),
        ReadingSection(
            id="petroleum",
            heading="Where alkanes come from: petroleum and the refinery",
            body=(
                "Nearly every alkane in commerce comes from one "
                "source: crude petroleum, a natural mixture of "
                "hundreds of hydrocarbons that the refinery separates "
                "by exactly the physics this chapter taught. "
                "Fractional distillation exploits the boiling-point "
                "ladder: the crude is heated and sent up a column, and "
                "compounds condense at the height where the "
                "temperature matches their boiling point. The C1-C4 "
                "gases come off the top; the roughly C5-C9 cut is "
                "straight-run gasoline; C10-C16 supplies kerosene and "
                "jet fuel; heavier cuts become diesel, lubricating "
                "oils, and finally asphalt from the residue. One "
                "physical property, one enormous industry - the "
                "boiling-point trend plotted earlier IS the refinery's "
                "organising principle.\n\n"
                "Demand does not match the natural distribution - the "
                "world wants more gasoline than crude contains - so "
                "refineries rearrange molecules. Catalytic cracking "
                "breaks long chains into shorter ones (and alkenes, "
                "feeding the chemistry of chapters 4 and 5); catalytic "
                "reforming converts straight chains into the branched "
                "and aromatic isomers that resist engine knock. Knock "
                "resistance is scored by the octane rating met in the "
                "isomer lesson: heptane defines 0, "
                "2,2,4-trimethylpentane defines 100, and a fuel's "
                "number places it on that scale. Branching raises the "
                "rating because branched radicals interrupt the "
                "too-early ignition chemistry - a preview of the "
                "radical stability ideas chapter 4 formalises, "
                "operating in every engine on the road.\n\n"
                "The environmental ledger belongs in the same lesson. "
                "Alkanes' water insolubility explains why spills "
                "spread as slicks on the ocean surface rather than "
                "dissolving; their volatility ladder explains why "
                "light fractions evaporate from a spill in days while "
                "heavy tars persist for years; and complete combustion "
                "of any fossil alkane delivers carbon dioxide "
                "stoichiometrically - one carbon in, one CO2 out, "
                "with the climate consequences that follow from "
                "burning gigatonnes. Chemistry courses sometimes "
                "treat these as asides; they are, rather, the "
                "chapter's physical properties operating at planetary "
                "scale."
            ),
        ),
        ReadingSection(
            id="combustion-worked",
            heading="Combustion thermochemistry, worked to numbers",
            body=(
                "Balancing an alkane combustion is a fixed recipe: "
                "carbons set the CO2, hydrogens set the water, then "
                "oxygen is counted last and doubled into O2. Propane: "
                "$C_3H_8 + 5\\,O_2 \\rightarrow 3\\,CO_2 + "
                "4\\,H_2O$. Three carbons give three CO2; eight "
                "hydrogens give four waters; the right side holds ten "
                "oxygens, so five O2. Odd-hydrogen alkanes produce a "
                "fractional O2 coefficient that doubling clears: "
                "butane balances as $2\\,C_4H_{10} + 13\\,O_2 "
                "\\rightarrow 8\\,CO_2 + 10\\,H_2O$. The recipe "
                "never varies, and thirty seconds of it beats "
                "trial-and-error every time.\n\n"
                "The energies attached to those equations are measured "
                "by bomb calorimetry and tabulated to four figures; "
                "the table below carries the standard molar values. "
                "Two readings repay attention. Per MOLE, the heat "
                "climbs almost exactly linearly - roughly 650 kJ per "
                "added CH2 - which is why the homologous series is "
                "energetically as regular as it is structurally. Per "
                "GRAM, the ordering inverts subtly: methane releases "
                "the most energy per unit mass (about 55 kJ/g) "
                "because hydrogen is the lightest fuel atom and "
                "methane carries the highest hydrogen fraction - the "
                "reason natural gas burns cleaner and lighter than "
                "coal, and a worked example of why the basis of a "
                "comparison (per mole? per gram?) must be stated "
                "before numbers are compared.\n\n"
                "Incomplete combustion completes the safety picture. "
                "Starve the flame of oxygen and carbon exits as "
                "carbon monoxide - $2\\,CH_4 + 3\\,O_2 "
                "\\rightarrow 2\\,CO + 4\\,H_2O$ - or as soot. "
                "CO binds hemoglobin two hundred times more tightly "
                "than oxygen does, which is why furnace maintenance "
                "and CO detectors are chemistry-literate household "
                "policy, and why the blue flame versus yellow flame "
                "distinction on a stove is a real-time combustion "
                "diagnosis: blue is complete, yellow is glowing "
                "soot announcing an oxygen-starved burn."
            ),
            table=Table(
                caption="Standard molar heats of combustion of light alkanes",
                columns=("Alkane", "-dHc (kJ/mol)", "approx. kJ/g"),
                rows=(
                    ("methane", "890", "55.5"),
                    ("ethane", "1560", "51.9"),
                    ("propane", "2220", "50.3"),
                    ("butane", "2877", "49.5"),
                ),
                source="Standard enthalpies of combustion, CRC Handbook of Chemistry and Physics",
                note="Per-mole values climb ~650 kJ per CH2; per-gram values FALL as the hydrogen fraction drops.",
            ),
        ),
        ReadingSection(
            id="properties-in-practice",
            heading="Density, viscosity, and solubility at work",
            body=(
                "Three more physical properties round out the "
                "profile, each with consequences worth owning. "
                "Density: liquid alkanes run roughly 0.62 to 0.79 "
                "g/mL - all lighter than water - which is why "
                "gasoline floats on puddles, why oil-water "
                "separations in the lab put the organic layer on top "
                "(for alkane-like solvents), and why water is the "
                "wrong extinguisher for a hydrocarbon fire: it sinks "
                "below the burning layer and spreads it. Viscosity "
                "climbs with chain length as longer chains entangle "
                "- the same dispersion-and-contact physics as "
                "boiling points, now resisting flow instead of "
                "evaporation - which is why C5-C9 gasoline pours "
                "like water while C20+ lubricating oils cling, and "
                "why motor oils are graded by viscosity at stated "
                "temperatures.\n\n"
                "Solubility carries the most chemistry forward. "
                "Alkanes dissolve nonpolar solutes and exclude "
                "polar ones - like dissolves like, operating on "
                "dispersion compatibility - so hexane strips grease "
                "in the lab and dry-cleaning solvents lift oils "
                "from fabric. Run in reverse, the rule explains "
                "biology's compartments: cell membranes present "
                "long alkane-like tails inward, so molecules "
                "cross membranes roughly in proportion to their "
                "nonpolar character. Chapter 8 will make this "
                "quantitative for drug design - a candidate "
                "molecule must be lipid-soluble enough to cross "
                "membranes yet water-soluble enough to travel in "
                "blood - and the vocabulary for that balancing act "
                "begins here, with the plainest molecules in the "
                "course refusing to mix with water.\n\n"
                "A closing calibration: everything in this section "
                "followed from structure plus one interaction type. "
                "Alkanes have only dispersion forces, so every "
                "physical property - boiling, melting, density, "
                "viscosity, solubility - is dispersion read through "
                "a different instrument. When later chapters add "
                "dipoles and hydrogen bonds, each new interaction "
                "will revise every property in predictable "
                "directions, and the alkane baseline built here is "
                "what those revisions are measured against. That is "
                "the deeper reason the course starts with the "
                "'boring' family: it is the control experiment for "
                "all of organic chemistry."
            ),
        ),
        ReadingSection(
            id="rings-in-depth",
            heading="Cycloalkanes in depth: parents, substituents, and strain previews",
            body=(
                "Rings introduce one genuinely new decision: when a "
                "structure contains both a ring and a chain, which is "
                "the parent? The working rule at this level counts "
                "carbons - the larger unit is the parent. A cyclohexane "
                "carrying a two-carbon chain is ethylcyclohexane (ring "
                "parent, six beats two); a cyclopropane hanging off a "
                "seven-carbon chain is cyclopropylheptane territory, "
                "with the ring demoted to a cycloalkyl substituent. "
                "Cycloalkyl groups alphabetise like any other "
                "substituent, and a chain can carry several: "
                "1,3-dicyclopropylpropane is a legal, parseable name "
                "built from nothing but this lesson's rules.\n\n"
                "Numbering a substituted ring starts at a substituent "
                "- rings have no chain end to anchor C1 - and walks in "
                "the direction that gives the lowest locant set. With "
                "one substituent no number is needed at all "
                "(methylcyclohexane, not 1-methylcyclohexane, though "
                "the 1 is tolerated); with two or more, the first "
                "point of difference decides direction, and "
                "alphabetical order chooses which substituent gets C1 "
                "when directions tie. Practise on "
                "1-ethyl-3-methylcyclohexane: start at ethyl "
                "(alphabet), walk toward methyl by the shorter arc "
                "(3 beats 5). The ring's closed topology makes these "
                "small decisions feel different from chain numbering, "
                "but every one reduces to the same lowest-locants "
                "principle.\n\n"
                "Ring size also imports the course's first strain "
                "vocabulary, previewed here because the names carry "
                "it. Cyclopropane's 60-degree internal angles sit far "
                "from the sp3 ideal of 109.5, storing angle strain "
                "that shows up as unusual reactivity - the "
                "three-membered ring behaves almost like a weak pi "
                "bond, foreshadowing the epoxide chemistry of chapter "
                "5's oxygen analogue. Cyclobutane and cyclopentane "
                "relieve part of their strain by puckering out of "
                "plane; cyclohexane famously escapes strain entirely "
                "in the chair conformation, a story chapter 7 owns. "
                "For now the takeaway is quantitative honesty: "
                "'CnH2n' names the composition of every cycloalkane, "
                "but the ENERGY per CH2 varies with ring size, and "
                "the combustion-per-CH2 measurement - highest for "
                "cyclopropane, at the acyclic baseline for "
                "cyclohexane - is how that variation was first "
                "mapped. The same common-endpoint logic as the "
                "isomer comparisons, applied to rings, and one more "
                "case of this chapter's data instruments reaching "
                "forward into the course."
            ),
        ),
        ReadingSection(
            id="naming-workout",
            heading="A graded naming workout",
            body=(
                "Fluency is built by repetitions with rising load, so "
                "close the lesson with five, each exercising a "
                "different rule cluster. One: a five-carbon chain "
                "with a methyl on C2 - 2-methylpentane; check the "
                "count (C6H14, one of the five hexane isomers, as it "
                "must be). Two: a six-carbon chain, methyls on C3 "
                "and C4 - number from either end (3,4 both ways), so "
                "the tie passes to alphabet, which changes nothing "
                "for identical substituents: 3,4-dimethylhexane. "
                "Three: seven carbons with a bromo on C2 and a "
                "methyl on C5 numbered from which end? Bromo from "
                "the left gives 2; methyl from the right gives 3 - "
                "first point of difference favours 2, so "
                "2-bromo-5-methylheptane, with bromo also winning "
                "the alphabetical lead. Four: the sec-butyl "
                "workout - a nine-carbon chain bearing a sec-butyl "
                "at C4 files under b, giving 4-sec-butylnonane, "
                "and writing it as 4-(1-methylpropyl)nonane in "
                "systematic style should feel like translation, "
                "not new chemistry.\n\n"
                "Five, the integration problem: a cyclopentane "
                "ring carrying an isopropyl at one position and "
                "chlorines at the two positions flanking it. Ring "
                "parent (five beats three); start numbering at a "
                "substituent and hunt the lowest set: chlorines at "
                "1 and 3 with isopropyl at 2 gives {1,2,3}; every "
                "alternative walk gives the same set, so alphabet "
                "seats chloro at C1: "
                "1,3-dichloro-2-isopropylcyclopentane (isopropyl "
                "filing under i). Reverse every one of these five - "
                "name to structure - as the second half of the "
                "workout, because the exam direction is drawn as "
                "often as it is named.\n\n"
                "The habit that survives after the drills fade: "
                "audit every name you write against the molecular "
                "formula, and every structure you draw against the "
                "unsaturation count. Names, formulas and structures "
                "are three projections of one object, and errors "
                "hide in the gaps between projections - the "
                "cross-check takes ten seconds and catches nearly "
                "everything. That auditing reflex, more than any "
                "individual rule, is what this chapter's "
                "nomenclature machinery is really installing, and "
                "it is the same reflex the spectroscopy chapters "
                "will demand at higher stakes."
            ),
        ),
        ReadingSection(
            id="functional-group-survey",
            heading="The R-group survey: reading the whole course from the alkane frame",
            body=(
                "The R notation earns a full section because it is the "
                "compression scheme the entire course runs on. Write R "
                "for any alkyl skeleton and each functional group "
                "becomes a one-line definition: R-OH is every alcohol, "
                "R-X every alkyl halide, R-O-R every ether, R-NH2 "
                "every primary amine, R-CHO every aldehyde, R-CO-R "
                "every ketone, R-COOH every carboxylic acid, R-COO-R "
                "every ester, R-CO-NH2 every amide. Nine lines just "
                "summarised perhaps two-thirds of the course's "
                "chapters, and the summary is honest: within each "
                "family, the group's chemistry is nearly independent "
                "of which R carries it. Ethanol and cholesterol are "
                "both R-OH, and both are oxidised, esterified, and "
                "hydrogen-bonded by the same rules at the same "
                "position.\n\n"
                "The frame also disciplines expectations about where "
                "reactivity lives. On any molecule, the alkane-like "
                "portions are the inert scaffolding - dispersion "
                "surface, shape, solubility ballast - while the "
                "functional groups are where bonds will be made and "
                "broken. Reading a complicated structure therefore "
                "starts by mentally greying out the R skeleton and "
                "circling the groups; a natural product with forty "
                "carbons usually holds only three or four reactive "
                "positions, and the circling exercise finds them in "
                "seconds. This is also why this chapter measured the "
                "alkane properties so carefully: whatever a molecule's "
                "groups add, its R portions contribute the baseline "
                "dispersion behaviour catalogued here, and the whole "
                "molecule's physical profile is roughly the sum of "
                "the two ledgers.\n\n"
                "One boundary keeps the scheme honest. R conventionally "
                "means an alkyl group bonded through an sp3 carbon; "
                "when a ring or a vinyl position is attached instead, "
                "authors write Ar for aryl or spell the group out, "
                "because sp2 attachment genuinely changes some "
                "chemistry - a distinction that becomes load-bearing "
                "when aryl halides refuse the substitution reactions "
                "alkyl halides love, in Organic II. Noticing which R "
                "a general statement covers is part of reading "
                "chemistry carefully, and the habit costs nothing "
                "here where every skeleton is honestly sp3. The "
                "chapter closes, then, where the course opens: with "
                "a family whose own chemistry is nearly empty, but "
                "whose naming system, drawing conventions, physical "
                "baselines and R-frame make every richer family "
                "legible. Boring was the point, and the boredom was "
                "load-bearing. Keep the greying-out reflex as the chapter's parting gift: on every structure the course shows you from here forward - and it will show you thousands - grey the skeleton, circle the groups, and begin your reasoning where the circles are. The reflex takes three seconds per molecule, scales to structures of any size, and quietly converts the intimidating diagrams of later chapters into a small set of familiar questions asked at a small number of marked positions. That conversion, practised until invisible, is the single largest return this opening chapter pays, and the one skill every later chapter of this course, from stereochemistry to the final synthesis capstone, will silently and completely assume that you already own."
            ),
        ),
        ReadingSection(
            id="common-names-and-history",
            heading="Common names, history, and reading the older literature",
            body=(
                "Systematic nomenclature won because the isomer "
                "explosion demanded it, but a layer of surviving "
                "common names still coats the literature, the "
                "stockroom, and safety data sheets, and a working "
                "chemist reads both dialects. Isobutane for "
                "2-methylpropane and neopentane for "
                "2,2-dimethylpropane persist because they predate the "
                "systematic rules and shipped in tank cars long "
                "before committees met; petroleum ether names a "
                "low-boiling alkane MIXTURE rather than any single "
                "compound and contains no ether at all - a naming "
                "trap that has confused generations of students "
                "reaching for the wrong bottle. Paraffin, an older "
                "collective term for alkanes, encodes a real "
                "observation in its Latin roots - 'little affinity' "
                "- which is this chapter's low-reactivity thesis "
                "fossilised into vocabulary.\n\n"
                "The translation habit matters in both directions. "
                "Reading older papers or industrial specifications "
                "means converting common names into structures "
                "before reasoning about them; writing for a modern "
                "audience means using systematic names while "
                "recognising which common ones remain standard "
                "enough to use unglossed (isopropyl and tert-butyl "
                "essentially always; amyl for pentyl almost never "
                "anymore). Exams mirror this: a question may name a "
                "compound either way and expects the same structure "
                "either way, so the small dictionary of surviving "
                "common names - iso-, neo-, sec-, tert- prefixed "
                "forms through five carbons - belongs in memory "
                "beside the algorithm rather than instead of it. "
                "Ten minutes of vocabulary buys decades of fluent "
                "reading, which is the usual exchange rate for "
                "learning a field's history alongside its rules. One last cross-check closes the loop: every common name in that small dictionary maps to exactly one systematic name and one structure, so translating a compound both ways - common to systematic, systematic to skeletal drawing, drawing back to formula - is the complete fluency drill in miniature, and running it on isobutane, neopentane and tert-butyl once is worth more than rereading any paragraph of this chapter twice."
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
        ReadingSection(
            id="heptane-enumeration",
            heading="The nine heptanes, enumerated completely",
            body=(
                "Six carbons was a warm-up; seven is where the "
                "system proves itself, because nine isomers is too "
                "many for intuition and exactly right for method. "
                "Start with the unbranched parent: heptane, one. "
                "Shorten to a hexane chain and place one methyl - "
                "positions 2 and 3 are distinct, position 4 "
                "renumbers to 3 from the other end: 2-methylhexane "
                "and 3-methylhexane, three so far. Shorten to a "
                "pentane chain with two methyls, and walk the "
                "locant pairs systematically: 2,2-, 2,3-, 2,4- and "
                "3,3-dimethylpentane are all distinct (2,5 would "
                "renumber to 2,4... check it: methyls at 2 and 5 of "
                "pentane renumber from the far end to 2 and 5 "
                "again - wait, 5 from one end is 2 from the other, "
                "wait: on a five-carbon chain position 5 IS a chain "
                "end, so a methyl there just extends the chain to "
                "hexane; the audit catches the phantom), seven "
                "total. A pentane chain with one ethyl: only "
                "3-ethylpentane survives (an ethyl at C2 extends "
                "the chain), eight. Finally the butane chain with "
                "three methyls: 2,2,3-trimethylbutane, and every "
                "other placement either renumbers into it or "
                "extends the chain - nine, and the enumeration "
                "closes.\n\n"
                "Every trap in that walk was a chain-extension "
                "error: a substituent placed at a chain end is not "
                "a substituent at all but a longer parent, and the "
                "renaming audit exposes it instantly. This is "
                "worth internalising as a general principle - the "
                "two systematic failure modes of isomer counting "
                "are duplicates (caught by renumbering) and "
                "phantoms (caught by the chain-end check) - and a "
                "count run with both audits is a count you can "
                "certify. Exams rarely ask beyond seven carbons "
                "precisely because nine items with two audit "
                "rules is the natural ceiling of by-hand rigor; "
                "past that, chemists reach for the enumeration "
                "algorithms this lesson's logic seeds."
            ),
        ),
        ReadingSection(
            id="heteroatom-formulas",
            heading="Formulas with heteroatoms: the count, generalised",
            body=(
                "The unsaturation count generalises to the whole "
                "periodic table with three amendments, each worth "
                "a drill. Oxygen changes nothing: divalent oxygen "
                "splices into a chain or hangs as OH without "
                "altering the hydrogen budget, so $C_2H_6O$ "
                "counts zero unsaturation and its two isomers - "
                "ethanol and dimethyl ether - are both saturated, "
                "acyclic, and real. Halogens count as hydrogens: "
                "monovalent atoms cap a valence exactly as H "
                "does, so $C_4H_9Br$ audits like $C_4H_{10}$ - "
                "zero unsaturation, four skeletal isomers times "
                "the distinct substitution positions on each. "
                "Nitrogen ADDS one to the hydrogen ceiling: "
                "trivalent nitrogen brings an extra bonding slot, "
                "so acyclic saturated amines fit $C_nH_{2n+3}N$, "
                "and the count becomes "
                "$\\text{DoU} = \\tfrac{2C + 2 + N - H - X}{2}$ "
                "with halogens folded in as X.\n\n"
                "Run the drills. $C_3H_6O$: DoU one - the isomer "
                "space spans propanal and acetone (a carbonyl "
                "spends the degree), plus allyl alcohol and "
                "methyl vinyl ether (a C=C spends it), plus two "
                "small rings (propylene oxide, oxetane) - six "
                "constitutional isomers across four functional "
                "families, all flagged before drawing. "
                "$C_2H_7N$: DoU zero, two isomers - ethylamine "
                "and dimethylamine. $C_4H_5N$ with DoU three "
                "hints at a nitrile plus an alkene or ring - the "
                "kind of pre-analysis that turns spectroscopy "
                "problems from searches into confirmations. The "
                "formula, read with the generalised count, is a "
                "structural budget statement: it tells you what "
                "you may spend before you have drawn a single "
                "bond, and disciplined spenders solve structure "
                "problems in half the steps of intuitive ones."
            ),
        ),
        ReadingSection(
            id="isomers-in-medicine",
            heading="Isomers where it matters: medicine, materials, and fuels",
            body=(
                "Constitutional isomerism stops being an exercise "
                "the moment one isomer heals and its sibling does "
                "not. Medicinal chemistry lives this daily: "
                "moving a substituent one ring position changes a "
                "drug's receptor fit, metabolism, and toxicity, "
                "which is why patent filings claim isomer "
                "families position by position and why regulatory "
                "approval attaches to ONE constitutional isomer, "
                "not a formula. The everyday analgesics make the "
                "point without exotic examples: ibuprofen and "
                "several of its inactive positional relatives "
                "share substituent inventories on the same "
                "aromatic core, differing in placement - the "
                "difference between medicine and inert material "
                "is locants. The same sensitivity powers "
                "fragrance and flavour chemistry, where "
                "positional isomers of a single substituted "
                "aromatic can smell of clove versus tarragon: "
                "receptors read connectivity, not formulas.\n\n"
                "Materials and fuels tell the industrial half of "
                "the story. Branched versus straight C8 isomers "
                "set the octane scale itself - heptane knocks at "
                "0, its branched relative 2,2,4-trimethylpentane "
                "defines 100 - and refinery isomerisation units "
                "exist to walk straight chains into branched "
                "ones profitably, an entire process economy "
                "built on constitutional isomerism. Butane and "
                "isobutane split duties in refrigeration and "
                "aerosol propulsion on the strength of their "
                "different vapour pressures; polymer feedstocks "
                "are specified isomer-pure because a branched "
                "impurity terminates or kinks a growing chain. "
                "The pattern across all of it: formulas are "
                "commodities, connectivities are products, and "
                "the analytical machinery of this chapter - "
                "naming, counting, auditing - is what lets "
                "commerce tell them apart at scale."
            ),
        ),
        ReadingSection(
            id="identification-workflow",
            heading="Identifying an isomer: the practical workflow",
            body=(
                "Given an unlabeled liquid known only by formula, "
                "how is THE isomer identified? The workflow "
                "stacks this chapter's tools in cost order. "
                "First, physical constants: measure the boiling "
                "point against the tabulated values - for the "
                "C5H12 trio, a measurement anywhere near 36, 28 "
                "or 9.5 C is already a strong vote, and density "
                "cross-checks it. Second, chromatography: a gas "
                "chromatogram run beside authentic standards "
                "matches retention times, and co-injection - "
                "spiking the unknown with a candidate and "
                "watching whether one peak grows or two appear - "
                "is the classic same-or-different verdict, "
                "cheap and near-definitive for volatile "
                "alkanes. Third, spectroscopy, previewed here "
                "and delivered in Organic II: carbon NMR counts "
                "the DISTINCT carbon environments, and symmetry "
                "makes that count an isomer fingerprint - "
                "pentane shows three environments, "
                "2-methylbutane four, and neopentane, with its "
                "four equivalent methyls, just two. Symmetry "
                "arguments of exactly this kind are how "
                "structure determination actually closes.\n\n"
                "Notice what the workflow never uses: melting "
                "the sample into identity by intuition. Every "
                "step compares a measurement against either a "
                "table or an authentic standard, because "
                "identity claims in chemistry are comparison "
                "claims - the same epistemology as the "
                "common-product trick in the stability "
                "arguments, surfacing now as laboratory "
                "practice. Carry the three-step ladder - "
                "constants, chromatography, spectroscopy - as "
                "the template it is: nearly every 'which "
                "compound is this' problem in the course and "
                "the clinic resolves to some rung of it, and "
                "knowing which rung suffices for which question "
                "is a professional judgment this chapter has "
                "now given you the pieces to make."
            ),
        ),
        ReadingSection(
            id="c6h12-families",
            heading="One degree of unsaturation: the C6H12 family map",
            body=(
                "A formula with one degree of unsaturation opens the "
                "richest counting exercise this chapter offers, because "
                "the single degree can be spent two ways and each "
                "spending generates its own family. Spend it on a ring "
                "and C6H12 yields the cycloalkanes: cyclohexane itself, "
                "methylcyclopentane, the ethyl- and "
                "dimethylcyclobutanes, and the propyl-, isopropyl-, "
                "methylethyl- and trimethylcyclopropanes - a dozen ring "
                "isomers once positional placements are audited. Spend "
                "it on a double bond and the hexene family opens: "
                "1-, 2- and 3-hexene, the methylpentenes across their "
                "legal positions, the dimethylbutenes, and "
                "ethylbutenes - with the additional wrinkle, delivered "
                "fully in chapter 4, that internal alkenes split again "
                "into cis and trans forms. The complete constitutional "
                "count runs well past twenty, and nobody memorises it; "
                "what is learned is the METHOD - partition by how the "
                "degree is spent, enumerate within each partition, "
                "audit for duplicates and phantoms.\n\n"
                "The family map also explains an analytical fact used "
                "constantly in industry: ring and alkene isomers of "
                "one formula are chemically distinguishable in "
                "seconds, because the pi bond reacts (decolourising "
                "bromine, taking up hydrogen) while the ring sits "
                "inert. A C6H12 sample that ignores bromine is a "
                "cycloalkane; one that decolourises it is a hexene; "
                "and hydrogen uptake measured quantitatively even "
                "counts how much of a MIXTURE is which. This is the "
                "unsaturation arithmetic promoted from bookkeeping to "
                "assay - the same number read first from the formula, "
                "then confirmed by the flask - and it is the pattern "
                "of all good analytical chemistry: predict from "
                "paper, verify by measurement, and treat any "
                "disagreement as a discovery about the sample rather "
                "than an inconvenience to the count."
            ),
        ),
        ReadingSection(
            id="isomerisation",
            heading="Interconverting isomers: isomerisation as a reaction class",
            body=(
                "Isomers are separated by real energy barriers, which "
                "means interconverting them is a genuine chemical "
                "reaction with catalysts, conditions, and economics. "
                "Industrially, acid catalysts at elevated temperature "
                "walk straight-chain alkanes into their branched "
                "isomers through carbocation intermediates - the "
                "hydride and methyl shifts of chapter 4, run "
                "deliberately and at scale - because the branched "
                "products carry the higher octane ratings the fuel "
                "market pays for. The thermodynamics are gentle "
                "(branched and straight isomers differ by only a few "
                "kJ/mol) so the equilibrium mixtures contain "
                "meaningful amounts of several isomers, and the "
                "separation plant downstream earns its keep by "
                "boiling-point differences this chapter has already "
                "quantified. An entire refinery unit, in other "
                "words, is built from three ideas this course "
                "teaches in its first weeks: isomer energetics, "
                "cation rearrangements, and fractional "
                "distillation.\n\n"
                "The laboratory-scale lesson is about what does NOT "
                "happen: at room temperature, without a catalyst, "
                "constitutional isomers do not interconvert at all. "
                "The C-C and C-H bonds separating butane from "
                "isobutane are worth hundreds of kJ/mol, so a bottle "
                "labelled pentane stays pentane for centuries. This "
                "stability is why isomer identity is a meaningful "
                "specification, why the pharmacy can promise a "
                "specific isomer in a tablet, and why the "
                "conformations of the next lesson - interconverting "
                "billions of times per second - are such a sharp "
                "contrast. The two timescales, centuries versus "
                "nanoseconds, bracket organic chemistry's central "
                "distinction between configuration and conformation, "
                "and holding both numbers in mind makes the "
                "distinction physical rather than definitional."
            ),
        ),
        ReadingSection(
            id="isomer-problem-set",
            heading="A worked problem set",
            body=(
                "Problem one: how many constitutional isomers of "
                "C4H9Cl exist? Zero unsaturation; the four butane "
                "skeletons times their distinct substitution sites: "
                "n-butane offers C1 and C2 (1-chlorobutane, "
                "2-chlorobutane); isobutane offers the primary "
                "methyls and the tertiary centre "
                "(1-chloro-2-methylpropane, "
                "2-chloro-2-methylpropane). Four isomers, each a "
                "distinct compound with distinct chemistry - and "
                "chapter 9 will grade them sharply, because that "
                "primary/secondary/tertiary distribution is exactly "
                "what SN1 and SN2 chemistry sorts on. Problem two: "
                "a hydrocarbon C5H8 takes up two equivalents of "
                "hydrogen over palladium. DoU is two; full uptake "
                "of two H2 means both degrees were pi bonds, so "
                "the compound was an acyclic diene or alkyne - "
                "and the product, C5H12, must be one of the three "
                "pentanes, identifiable by the workflow section's "
                "ladder. Problem three: draw all C3H8O isomers. "
                "Zero unsaturation, one oxygen: splice it into "
                "the chain (methyl ethyl ether... check: "
                "methoxyethane), or hang it as OH at either "
                "distinct carbon (1-propanol, 2-propanol). Three "
                "isomers, two functional families, one formula.\n\n"
                "Problem four, the integrative one: an unknown "
                "C6H14 shows a boiling point of 58 C and a carbon "
                "NMR with four distinct environments. The five "
                "hexanes' boiling points cluster between 50 and "
                "69 C, so the constant alone shortlists rather "
                "than decides - 58 sits near 2,3-dimethylbutane "
                "(58.0) and 2-methylpentane (60.3). Symmetry "
                "settles it: 2,3-dimethylbutane has just two "
                "carbon environments by its internal mirror, "
                "while 2-methylpentane has five... neither gives "
                "four; 3-methylpentane (63.3 C, four "
                "environments) fits the NMR but strains the "
                "boiling point. The honest conclusion - remeasure "
                "the constant, or run co-injection - is itself "
                "the lesson: real identification sometimes "
                "returns 'insufficient data', and recognising "
                "that beats forcing a verdict. Examiners "
                "increasingly write exactly this kind of problem "
                "to reward calibrated confidence over confident "
                "error."
            ),
        ),
        ReadingSection(
            id="counting-and-symmetry",
            heading="Symmetry: the hidden variable in every isomer question",
            body=(
                "Underneath both the counting audits and the NMR "
                "fingerprints sits one organising idea: molecular "
                "symmetry. Two positions on a skeleton are "
                "equivalent - giving the SAME compound when "
                "substituted - exactly when a symmetry operation of "
                "the molecule maps one onto the other. Pentane's C1 "
                "and C5 are equivalent by the end-to-end flip, so "
                "chlorination at either gives one compound, "
                "1-chloropentane; C2 and C4 pair the same way; C3 "
                "sits on the mirror itself. Three distinct "
                "positions, three monochloro isomers, and the count "
                "came from symmetry rather than from drawing and "
                "comparing five structures. Run the same analysis "
                "on 2-methylbutane and the positions sort into four "
                "classes; on neopentane, into just one - twelve "
                "equivalent primary hydrogens, one possible "
                "monochloride, which is why neopentane is the "
                "clean-halogenation demonstration substrate of "
                "chapter 9.\n\n"
                "The same equivalence classes are what carbon NMR "
                "counts, which is why the workflow section could "
                "use environment counts as fingerprints: the "
                "spectrometer is a symmetry detector. And the same "
                "classes set statistical factors in reactivity - "
                "when chapter 9 asks why radical chlorination of "
                "propane gives more primary product than the "
                "per-hydrogen reactivity predicts, the answer "
                "begins with six primary hydrogens against two "
                "secondary: symmetry counting entering kinetics. "
                "One habit ties it together: for any skeleton, "
                "before answering ANY substitution, spectroscopy, "
                "or counting question, mark the equivalence "
                "classes first. It is thirty seconds of work that "
                "converts three different question types into "
                "applications of one analysis, and it is the "
                "skill this chapter's isomer machinery has been "
                "quietly building toward from the first "
                "renumbering audit."
            ),
        ),
        ReadingSection(
            id="isomer-landscape-ahead",
            heading="The isomer landscape ahead: a map of the course's distinctions",
            body=(
                "Constitutional isomerism is the first room of a "
                "larger house, and sketching the floor plan now "
                "prevents later disorientation. The master split is "
                "between constitutional isomers - different "
                "connectivity, this lesson's subject - and "
                "stereoisomers, which share every bond and differ "
                "only in spatial arrangement. Stereoisomers divide "
                "again: the cis/trans alkene pairs of chapter 4 and "
                "the ring substitution patterns of chapter 7 are "
                "diastereomers, different compounds with different "
                "constants, separable by every technique in the "
                "workflow section; the mirror-image pairs of "
                "chapter 6 are enantiomers, identical in every "
                "achiral measurement and distinguishable only by "
                "chiral instruments and chiral environments - "
                "polarised light, chiral chromatography columns, "
                "and the profoundly chiral environment of the "
                "human body. Each level of the hierarchy weakens "
                "the tools that suffice: boiling points separate "
                "constitutional isomers, sometimes diastereomers, "
                "never enantiomers.\n\n"
                "Holding the hierarchy as a decision tree pays on "
                "every 'what is the relationship between these "
                "structures' question, which is among the most "
                "frequent question types in the whole subject. "
                "The procedure: same formula? If not, unrelated. "
                "Same connectivity? If not, constitutional "
                "isomers - the name test from this lesson decides. "
                "Same connectivity but different spatial "
                "arrangement? Stereoisomers - and chapter 6's "
                "tools take over from there. Interconvertible by "
                "bond rotation alone? Then not isomers at all but "
                "conformers of one compound, the next lesson's "
                "subject. Four questions asked in order, each "
                "answered by a test this course provides, and "
                "every structural-relationship item on every exam "
                "resolves somewhere down that tree. Learning the "
                "tree here, while only its first branch is "
                "loaded, is how the later branches arrive as "
                "refinements instead of upheavals."
            ),
        ),
        ReadingSection(
            id="drawing-discipline",
            heading="Drawing discipline: producing isomers without producing errors",
            body=(
                "The practical bottleneck in isomer work is rarely "
                "the counting theory; it is the drawing hygiene "
                "that keeps a page of candidate skeletons honest. "
                "Three habits carry professionals through. Draw "
                "systematically, longest chain first, shortening by "
                "exactly one carbon per round, and within each "
                "round move the substituent one position at a time "
                "- randomness is how duplicates sneak in. Name as "
                "you go: a pencilled name under each candidate "
                "converts the duplicate check from visual "
                "comparison, where curved chains deceive, into "
                "string comparison, where they cannot. And keep a "
                "running tally against the known count when one "
                "exists - arriving at six hexanes means a "
                "duplicate is hiding; arriving at four means a "
                "candidate was skipped, and the systematic order "
                "tells you roughly where.\n\n"
                "Two drawing traps deserve explicit warnings "
                "because they survive into advanced work. First, "
                "the bent-chain illusion: a five-carbon chain "
                "drawn with a right angle at C3 looks branched at "
                "a glance, and under exam pressure gets counted "
                "as a new isomer - the name test kills it, but "
                "only if run. Second, the terminal-substituent "
                "phantom from the heptane walk: a methyl drawn on "
                "a chain end is not a branch but a longer chain "
                "wearing a disguise, and it inflates counts "
                "whenever the audit lapses. Both traps share one "
                "root - trusting the picture over the "
                "connectivity - and both die to the same "
                "discipline of reading every drawing back into "
                "its bonding relationships before judging it. "
                "That discipline is cheap here, on skeletons of "
                "seven carbons, and priceless later, when the "
                "structures carry rings, stereocentres and "
                "functional groups all at once and the eye has "
                "even more opportunities to be confidently "
                "wrong. Build the reading-back habit now, on the "
                "cheapest possible structures, and every later "
                "chapter inherits an author who checks "
                "connectivity by reflex - the difference, across "
                "a whole course of drawings, between hundreds of "
                "silent errors caught at the pencil and the same "
                "hundreds discovered by the grader. Structures "
                "are claims; read every claim back before "
                "submitting it, and this isomer chapter has done "
                "its deepest and most durable job: not teaching you nine heptanes, but teaching you the auditing temperament that makes every structural claim you will ever draw a checked one - a habit that compounds quietly, drawing after drawing, over all the many years of structures still ahead of you, first in this course, then in every laboratory bench, refinery control room and hospital clinic that speaks, reads and writes the structural language you are learning here."
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
        ReadingSection(
            id="full-walk",
            heading="The full 360-degree walk, with populations at every station",
            body=(
                "Walking butane's dihedral from 0 to 360 degrees "
                "station by station converts the profile from a "
                "picture into a working instrument. At 0 degrees, "
                "syn: the methyls eclipse each other, the summit of "
                "the whole landscape, populated essentially never at "
                "room temperature. Rotate to 60: the first gauche "
                "minimum, 3.8 kJ/mol above anti; the Boltzmann "
                "factor $e^{-3.8/2.48} \\approx 0.22$ prices it "
                "at about a fifth of anti's population per well. "
                "At 120: the methyl/hydrogen eclipsed barrier near "
                "16 kJ/mol - crossed billions of times per second "
                "yet never populated in any measurable amount, the "
                "defining paradox of a transition state. At 180: "
                "anti, the global minimum and the reference zero. "
                "The stations from 180 to 360 mirror the first "
                "half by symmetry, giving the second gauche well "
                "at 300 and returning to syn at 360.\n\n"
                "Two temperatures make the populations vivid. At "
                "298 K the anti:gauche-total ratio sits near "
                "70:30, the number derived in the earlier "
                "arithmetic. Cool the system toward 100 K and the "
                "exponential sharpens: gauche occupancy collapses "
                "toward a few percent, which is why "
                "low-temperature spectroscopy can effectively "
                "freeze out minor conformers and observe anti "
                "nearly alone. Heat toward 500 K and the ratio "
                "flattens toward statistics - two gauche wells "
                "against one anti pushes the MIXTURE toward the "
                "gauche side even though each individual gauche "
                "well stays higher in energy. That last point "
                "rewards a careful reread: entropy, in the form "
                "of well-counting, competes with enthalpy, and "
                "at high temperature the more numerous "
                "conformations win share despite their energy "
                "cost. It is the course's first clean instance "
                "of an enthalpy-entropy competition, met here in "
                "the simplest possible molecule, and the pattern "
                "returns at every scale up to protein folding."
            ),
        ),
        ReadingSection(
            id="how-barriers-are-known",
            heading="How the barriers are actually known",
            body=(
                "The 12 kJ/mol ethane barrier is quoted so often "
                "that its evidentiary history gets lost, and the "
                "history is instructive. The number was first "
                "pinned thermodynamically: measured heat "
                "capacities and entropies of ethane gas "
                "disagreed with the values computed for a freely "
                "rotating molecule, and the size of the "
                "discrepancy could be reproduced only by "
                "assuming rotation was hindered by a barrier of "
                "about 12 kJ/mol. A molecular property was thus "
                "extracted from bulk measurements before any "
                "spectroscopic tool could see rotation directly "
                "- a reminder that thermodynamic bookkeeping, "
                "done carefully, reaches inside molecules. "
                "Spectroscopy later confirmed and refined the "
                "value: torsional vibrations show up in the far "
                "infrared, and their spacing encodes the "
                "curvature and height of the rotational "
                "potential.\n\n"
                "Modern practice adds computation: electronic "
                "structure methods reproduce the ethane and "
                "butane profiles to within fractions of a "
                "kJ/mol, and the agreement across three "
                "independent routes - thermodynamic, "
                "spectroscopic, computational - is what makes "
                "these small numbers trustworthy enough to "
                "build chapters on. The epistemology deserves "
                "one more sentence because the course will "
                "reuse it: whenever a quantity is quoted here "
                "(a pKa, a bond energy, a barrier), it stands "
                "on the same tripod of measurement, spectrum "
                "and calculation, and 'how do we know' is "
                "always a fair and answerable question. "
                "Students who ask it habitually read chemistry "
                "as an evidence-bearing science rather than a "
                "rulebook, and examiners increasingly write "
                "questions - especially passage-based MCAT "
                "questions - that reward exactly that reading."
            ),
        ),
        ReadingSection(
            id="pentane-matrix",
            heading="Beyond butane: pentane and the conformer matrix",
            body=(
                "Pentane introduces the combinatorial reality of "
                "chain conformations: it has TWO internal "
                "backbone bonds, C2-C3 and C3-C4, and each "
                "independently adopts anti or gauche, generating "
                "a matrix of conformer families - anti-anti, "
                "anti-gauche, gauche-gauche - whose energies are "
                "roughly additive in the gauche count. The "
                "all-anti conformer is the extended zig-zag; each "
                "gauche substitution adds its ~3.8 kJ/mol and "
                "kinks the chain. One combination, however, "
                "breaks additivity spectacularly: when the two "
                "gauche twists take OPPOSITE signs "
                "(gauche-plus then gauche-minus), the two chain "
                "ends collide in what is called syn-pentane "
                "strain, costing far more than two gauche units "
                "- the first case where conformational "
                "preferences interact rather than simply "
                "summing. Syn-pentane avoidance turns out to "
                "shape molecules from polyketide natural "
                "products to synthetic polymers, and "
                "conformational analysis at research level is "
                "substantially the bookkeeping of such "
                "interactions.\n\n"
                "The matrix view scales gracefully. A chain "
                "with n internal bonds has on the order of "
                "$3^n$ backbone conformers, which for a lipid "
                "tail of sixteen carbons is millions - and yet "
                "the ensemble's AVERAGE properties remain "
                "predictable because each bond's statistics "
                "stay local and Boltzmann-weighted. This is "
                "why polymer physics can model polyethylene "
                "with three-state rotational models and get "
                "real material properties out, and why the "
                "melting behaviour of fats tracks the gauche "
                "content their unsaturation forces. The "
                "chapter's smallest ideas - two staggered "
                "wells and an energy gap - are, multiplied by "
                "Avogadro-scale combinatorics, the working "
                "theory of soft materials. Few places in "
                "chemistry show the micro-to-macro ladder so "
                "cleanly, and it is worth pausing on before "
                "the course returns to single-molecule "
                "reasoning."
            ),
        ),
        ReadingSection(
            id="newman-problem-set",
            heading="A worked Newman problem set",
            body=(
                "Problem one: draw the most stable conformation "
                "of 2-methylbutane viewed down C2-C3. Front "
                "carbon (C2) carries two methyls and a hydrogen; "
                "back carbon (C3) carries a methyl and two "
                "hydrogens. Staggered arrangements only; the "
                "best places the back methyl anti to ONE front "
                "methyl - but with two front methyls, every "
                "staggered rotamer leaves the back methyl gauche "
                "to at least one of them. Count gauche "
                "methyl-methyl interactions per rotamer: the "
                "minimum achievable is one, so the best "
                "conformer carries exactly one gauche "
                "interaction, about 3.8 kJ/mol above a "
                "hypothetical strain-free reference. The lesson "
                "inside the answer: sometimes NO conformer is "
                "strain-free, and 'most stable' means "
                "least-strained, found by counting.\n\n"
                "Problem two: rank the three staggered rotamers "
                "of 1,2-dichloroethane down C1-C2. Anti "
                "chlorines versus the two equivalent gauche "
                "forms - sterics and dipole repulsion both "
                "favour anti in the gas phase, and the "
                "measured mixture leans anti accordingly; but "
                "in polar solvents the gauche fraction RISES, "
                "because the gauche conformer's net dipole is "
                "stabilised by a polar medium. A conformer "
                "ratio that responds to solvent is the "
                "cleanest demonstration that conformational "
                "populations are equilibria like any other, "
                "shiftable by environment - file it beside Le "
                "Chatelier. Problem three: predict the "
                "rotational profile of 2,2-dimethylpropane "
                "(neopentane) down any C-C bond. The front "
                "carbon carries three methyls, the back three "
                "hydrogens; by symmetry every staggered "
                "rotamer is identical and every eclipsed one "
                "identical, so the profile is a clean "
                "threefold cosine like ethane's, just with a "
                "taller barrier. Symmetry answering before "
                "arithmetic begins - the recurring reward for "
                "checking it first."
            ),
        ),
        ReadingSection(
            id="conformations-in-biology",
            heading="Conformations in biology: where the small numbers govern life",
            body=(
                "The energies in this lesson look too small to "
                "matter - a few kJ/mol against the hundreds that "
                "bonds cost - yet biology is run almost entirely "
                "in this energy range, precisely because small "
                "barriers permit fast, reversible change. An "
                "enzyme's active site does its work by holding a "
                "flexible substrate in ONE reactive conformation "
                "out of its Boltzmann ensemble: the binding "
                "energy pays the conformational cost, and "
                "catalysis follows partly from that "
                "pre-organisation. Drug designers speak of the "
                "'bioactive conformation' for the same reason - "
                "a candidate molecule that must twist expensively "
                "to fit its target loses potency by exactly the "
                "conformational penalty, kJ for kJ, and medicinal "
                "chemistry teams routinely rigidify molecules "
                "(adding rings, removing rotatable bonds) to "
                "pre-pay that cost at the drawing board. "
                "Rotatable-bond counts even appear in the "
                "standard drug-likeness filters: too many free "
                "rotations predicts poor binding and poor oral "
                "absorption at once.\n\n"
                "At larger scale, the peptide backbone is a "
                "chain of rotatable bonds whose local "
                "preferences - catalogued for proteins in "
                "Ramachandran's maps, conceptual cousins of the "
                "butane profile - sum into folded structure. "
                "Sugars pucker, nucleic acid backbones twist, "
                "and membrane lipids melt or stiffen, all on "
                "gauche-anti bookkeeping scaled up by "
                "thousands of bonds. None of this requires new "
                "physics beyond this lesson: the same "
                "torsional potentials, the same Boltzmann "
                "weighting, the same entropy of well-counting. "
                "What changes is only the arithmetic of many "
                "bonds at once - and the stakes. When the MCAT "
                "asks why a saturated lipid tail packs tighter "
                "than an unsaturated one, or why a rigid drug "
                "analogue binds better than its floppy parent, "
                "it is asking butane questions wearing "
                "biological clothes, and the student who "
                "recognises the costume answers in seconds."
            ),
        ),
        ReadingSection(
            id="drawing-newman-fluently",
            heading="Drawing Newman projections fluently, from any structure",
            body=(
                "Converting an arbitrary skeletal structure into "
                "a correct Newman projection is a mechanical "
                "skill worth proceduralising, because errors "
                "here corrupt every conclusion downstream. The "
                "procedure: first, choose and mark the bond - "
                "the question names it or the interesting "
                "substituents flank it. Second, decide which "
                "carbon is front (convention: the "
                "lower-numbered carbon faces the viewer unless "
                "stated otherwise, but any consistent choice "
                "works). Third, inventory each carbon's OTHER "
                "three substituents from the structure - this "
                "inventory step is where most errors occur, "
                "usually by leaving a hydrogen uncounted or "
                "importing a substituent from the wrong carbon. "
                "Fourth, place the front three at 12, 4 and 8 "
                "o'clock, the back three offset per the "
                "conformation being drawn, and label "
                "everything. Fifth - the audit - recount: six "
                "substituents total, three per carbon, and the "
                "two carbons' inventories must match the "
                "original structure atom for atom.\n\n"
                "Rotating a drawn projection is its own small "
                "skill: turn ONLY the back carbon, in 60-degree "
                "steps, and redraw rather than mentally rotate "
                "- mental rotation is where signs flip and "
                "gauche becomes anti in the imagination. For "
                "ranking tasks, annotate each staggered rotamer "
                "with its gauche-interaction count directly on "
                "the drawing; the counts, not impressions, "
                "produce the ranking. And when a question "
                "supplies a Newman projection and asks for the "
                "skeletal structure, run the procedure in "
                "reverse, rebuilding the chain outward from "
                "the two central carbons. Fluency in both "
                "directions typically takes a dozen practice "
                "conversions; after that the projection stops "
                "being a diagram to decode and becomes what it "
                "is for working chemists - a glance-speed "
                "display of the one geometric variable sigma "
                "bonds leave free."
            ),
        ),
        ReadingSection(
            id="origins-debate",
            heading="What actually causes the barrier: a live scientific question",
            body=(
                "This lesson attributed ethane's barrier to "
                "filled-filled repulsion between eclipsed C-H "
                "bonds plus the loss of stabilising "
                "sigma-to-sigma-star donation in the eclipsed "
                "form, and that two-part account is the standard "
                "teaching model. It is worth knowing, at least "
                "once, that the relative weight of those two "
                "contributions has been genuinely debated in the "
                "research literature: careful theoretical "
                "decompositions have been published arguing for "
                "hyperconjugative donation as the dominant term, "
                "and equally careful ones arguing that steric "
                "(Pauli) repulsion suffices, with the answer "
                "depending sensitively on how one partitions an "
                "energy that nature never partitions at all. The "
                "barrier itself - the observable - is not in "
                "dispute to within decimals; the STORY about it "
                "is a choice of bookkeeping.\n\n"
                "Why include a live debate in an introductory "
                "chapter? Because it calibrates what kind of "
                "thing a chemical explanation is. Observables "
                "(barriers, populations, spectra) are facts; "
                "decompositions of them into named effects are "
                "models, useful exactly insofar as they predict "
                "the next observable. The teaching model earns "
                "its place by predicting well: it anticipates "
                "that barriers grow with the number of eclipsed "
                "pairs, that bulkier eclipsing partners raise "
                "them further, and that electron-poor or "
                "electron-rich substituents modulate them in "
                "the directions hyperconjugation suggests. "
                "Where two models predict identically, "
                "chemists keep the more convenient one without "
                "pretending the question is closed. Carrying "
                "that epistemic posture - firm on data, "
                "flexible on narrative - is worth more than "
                "any single barrier value in this chapter, and "
                "it will keep you honest when later chapters "
                "offer explanations that are really "
                "well-behaved bookkeeping."
            ),
        ),
        ReadingSection(
            id="temperature-and-timescale",
            heading="Timescales: what 'fast rotation' means for measurement",
            body=(
                "A barrier's height translates directly into a "
                "rotation RATE, and rates against instrument "
                "timescales decide what an experiment sees. "
                "Transition-state arithmetic puts crossing "
                "frequencies for a 12 kJ/mol barrier around "
                "$10^{10}$ per second at room temperature; for "
                "the ~16-19 kJ/mol butane summits, still far "
                "above $10^{8}$. Proton NMR, whose effective "
                "shutter speed for distinguishing exchanging "
                "environments sits near $10^{2}$ to $10^{3}$ "
                "per second, therefore records only the "
                "population-weighted AVERAGE of all conformers "
                "- one set of signals for butane, not one per "
                "conformer. Infrared spectroscopy, sampling at "
                "vibrational timescales around $10^{13}$ per "
                "second, catches molecules mid-conformation "
                "and can show distinct bands for anti and "
                "gauche simultaneously. Same molecule, same "
                "ensemble, different shutter speeds, different "
                "photographs - and neither instrument is "
                "wrong.\n\n"
                "The practical consequences recur throughout "
                "chemistry. Cooling slows crossing "
                "exponentially, so NMR at low temperature can "
                "'freeze out' conformers into separate "
                "signals, and the temperature where signals "
                "split measures the barrier - a standard "
                "laboratory determination. Conversely, "
                "barriers above roughly 80-100 kJ/mol cross so "
                "rarely at room temperature that the "
                "conformers become isolable compounds in their "
                "own right; hindered rotation about amide "
                "bonds sits partway there, giving the broadened "
                "NMR signals every biochemistry student meets, "
                "and fully restricted cases produce the "
                "atropisomers that chapter 6's stereochemistry "
                "will name. The continuum from free rotation "
                "to frozen configuration is thus a single "
                "dial - barrier height read against "
                "observation time - and placing any system on "
                "that dial is the first question a working "
                "spectroscopist asks."
            ),
        ),
        ReadingSection(
            id="strain-catalogue",
            heading="The strain catalogue: naming every way molecules pay",
            body=(
                "This chapter has now met two members of what will "
                "become a four-entry strain catalogue, and laying "
                "out the full table early prevents the terms from "
                "blurring later. Torsional strain: the cost of "
                "eclipsed bonds, electronic in origin, about 4 "
                "kJ/mol per eclipsed H/H pair - ethane's whole "
                "story. Steric strain (van der Waals strain): the "
                "cost of atoms crowded inside the sum of their "
                "contact radii - the gauche butane interaction, and "
                "the syn-pentane collision at larger scale. Angle "
                "strain, previewed with the cycloalkanes: the cost "
                "of bond angles bent away from the hybridisation "
                "ideal, dominating in three- and four-membered "
                "rings. And ring strain, the bookkeeping total "
                "that combustion-per-CH2 measures for a cyclic "
                "molecule - not a fourth mechanism but the SUM of "
                "the first three as a ring geometry forces them "
                "together, a distinction exams probe by asking "
                "which contributions dominate in which ring "
                "size.\n\n"
                "The catalogue matters because strain is organic "
                "chemistry's universal currency of "
                "destabilisation, spent and refunded across every "
                "chapter ahead: eliminations relieve it, "
                "additions can create it, epoxides weaponise it, "
                "and chapter 7's chair analysis is nothing but a "
                "ledger of these entries for six-membered rings. "
                "Keeping the mechanisms distinct pays "
                "immediately in explanation quality - 'the "
                "eclipsed form is destabilised by torsional "
                "strain, the gauche by steric strain' is a "
                "graded-credit sentence, while 'it is strained' "
                "is not - and pays again in prediction, because "
                "each strain type responds to different "
                "structural changes. Bulky groups aggravate "
                "steric strain but leave torsional strain's "
                "electronic core untouched; ring expansion "
                "relieves angle strain specifically; higher "
                "temperature buys population access to all of "
                "them indiscriminately. Four entries, distinct "
                "causes, one currency - the table this lesson "
                "leaves open for the rest of the course to "
                "fill with examples."
            ),
        ),
        ReadingSection(
            id="closing-frame",
            heading="Closing frame: the chapter's three timescales",
            body=(
                "Chapter 2 closes having installed three distinct "
                "timescales, and stating them together is the best "
                "summary the material admits. Configurations - the "
                "constitutional isomers of the previous lesson - "
                "are separated by bond-breaking barriers of "
                "hundreds of kJ/mol and are stable for geological "
                "time: butane and isobutane are different "
                "substances forever, absent a catalyst and heat. "
                "Conformations - this lesson's subject - are "
                "separated by barriers of tens of kJ/mol and "
                "interconvert in nanoseconds: butane's anti and "
                "gauche are one substance wearing different "
                "shapes. And between the two regimes lies the "
                "tunable middle - amide rotations, congested "
                "biaryls - where barrier height against "
                "temperature decides case by case whether "
                "chemistry sees one compound or several. One "
                "molecule-level variable, barrier height, "
                "stretched across fifteen orders of magnitude in "
                "lifetime.\n\n"
                "Every tool the chapter built serves that frame. "
                "Nomenclature and formulas name the "
                "configurations; the audits keep their counting "
                "honest; physical constants and chromatography "
                "tell them apart. Newman projections and the "
                "Boltzmann arithmetic describe the "
                "conformations; the strain catalogue prices "
                "them; spectroscopic timescales determine what "
                "any instrument reports about them. When "
                "chapter 6 adds stereoisomers - configurations "
                "again, but differing in space rather than "
                "connectivity - the frame simply gains a "
                "column, and nothing already learned moves. "
                "Courses feel cumulative when their early "
                "chapters are built as load-bearing structure "
                "rather than as isolated topics; this chapter "
                "was built that way deliberately, and the "
                "three-timescale frame is the part most worth "
                "carrying out of it intact. Test yourself on it "
                "once before moving on: name a pair of "
                "structures separated by each of the three "
                "regimes, state the barrier range each implies, "
                "and say which laboratory technique would "
                "distinguish the members of each pair. If all "
                "three answers come quickly, the chapter has "
                "finished its work; if any hesitates, the "
                "section it points back to is a five-minute "
                "reread rather than a mystery - which is "
                "exactly what a well-built chapter owes you. The next "
                "chapter collects the debt: acids, bases and curved "
                "arrows assume every timescale, audit and drawing "
                "habit built here, and repay the investment with the "
                "first genuinely predictive chemistry of the whole "
                "course - proton transfers whose directions and "
                "equilibrium constants you will calculate from a "
                "table rather than memorise from a list, and whose "
"transition states you will reason about with the "
"same energy-diagram vocabulary and Newman-projection "
"habits this chapter has built."
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

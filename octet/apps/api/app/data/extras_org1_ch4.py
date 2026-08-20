"""Lecture-note depth for ORG1 chapter 4, Alkenes: Structure — part 1 (4A-4D).

Tranche 2 of the organic depth programme (docs/organic_depth_benchmark.md).
Scope checked against the benchmark's chapter-4 section list (bonding,
nomenclature, stability, hydrogen-halide addition); all prose authored for
OCTET. Bond lengths are experimental structural values; heats of
hydrogenation are the standard gas-phase enthalpies as compiled in the
NIST WebBook and standard physical organic references.
"""

from __future__ import annotations

from app.data.lesson_extras import (
    Figure,
    LessonExtras,
    ReadingSection,
    Table,
)

EXTRAS_ORG1_CH4: dict[str, LessonExtras] = {}


def _add(extras: LessonExtras) -> None:
    EXTRAS_ORG1_CH4[extras.node] = extras


# --------------------------------------------------------------------------
# 4.1 Alkene bonding
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.ALKENEBONDING",
    lead=(
        "The carbon-carbon double bond is the first functional group this "
        "course treats in full, and almost everything alkenes do follows "
        "from its anatomy: one strong sigma bond lying along the "
        "internuclear axis, and one weaker pi bond built from parallel p "
        "orbitals above and below it. The pi bond is the part that reacts, "
        "the part that blocks rotation, and the part whose electrons reach "
        "out to electrophiles. Understand its geometry and energetics here "
        "and the next two chapters of reactions become applications rather "
        "than new material."
    ),
    sections=(
        ReadingSection(
            id="sigma-pi-anatomy",
            figure=Figure(
                stem="org1-orbital-shapes",
                caption=(
                    "The ingredients of the pi bond: the p orbitals whose side-on overlap above and below the sigma framework forms it."
                ),
                alt="Orbital shape diagrams showing s and p orbitals, the p lobes being the pi bond's components.",
            ),
            heading="One sigma, one pi: what a double bond is made of",
            body=(
                "Each alkene carbon is sp2 hybridised: three hybrid "
                "orbitals at roughly 120 degrees in a plane, one "
                "unhybridised p orbital perpendicular to it. The sigma "
                "framework - two C-H or C-C bonds plus the C-C sigma "
                "bond - lives in the plane; the two parallel p orbitals "
                "overlap side-on above and below it to form the pi "
                "bond. Side-on overlap is intrinsically poorer than "
                "head-on overlap, which is the structural reason the pi "
                "bond is the weaker partner: the carbon-carbon double "
                "bond is worth about 611 kJ/mol in total while a single "
                "bond is about 347, leaving roughly 264 kJ/mol as the "
                "pi contribution - strong enough to hold, weak enough "
                "to be the bond every addition reaction spends.\n\n"
                "Geometry records the hybridisation. The double bond "
                "pulls the carbons to 1.33 angstroms apart against 1.54 "
                "for an alkane single bond, and the six atoms attached "
                "to the two sp2 carbons all lie in one plane. That "
                "planarity is not a drawing convention; it is a "
                "measured fact, and it makes the two faces of the "
                "double bond real, distinguishable places. Reagents in "
                "chapter 5 will add to one face or both, and "
                "stereochemistry will hang on which."
            ),
        ),
        ReadingSection(
            id="restricted-rotation",
            figure=Figure(
                stem="org1-cis-trans-butene",
                caption=(
                    "cis- and trans-2-butene, drawn from their configurations: no rotation interconverts them, and the constants differ."
                ),
                alt="Structures of cis-2-butene and trans-2-butene with boiling points.",
            ),
            heading="Restricted rotation and cis/trans isomerism",
            body=(
                "Rotating one end of a double bond by 90 degrees would "
                "turn the parallel p orbitals perpendicular and cut "
                "their overlap to zero - it would break the pi bond. "
                "The barrier to rotation is therefore approximately the "
                "pi-bond strength, around 260 kJ/mol, and thermal "
                "energy at ordinary temperatures crosses a barrier that "
                "size essentially never. Compare butane's 19-25 kJ/mol "
                "rotation summit from chapter 2: single bonds spin "
                "constantly, double bonds are locked.\n\n"
                "Locked rotation creates a new kind of isomerism. "
                "2-Butene with both methyls on the same side (cis) and "
                "with them on opposite sides (trans) are different "
                "compounds - separable, with different boiling points "
                "(3.7 and 0.9 C) and different stabilities - because no "
                "accessible motion interconverts them. This is the "
                "distinction chapter 2 promised: conformations "
                "interconvert by rotation, configurations do not, and "
                "the double bond is the first structural feature that "
                "manufactures configurations. The biological world "
                "runs on the difference - vision begins with light "
                "doing the one thing heat cannot, flipping a cis "
                "double bond in retinal to trans - and so does the "
                "kitchen, where cis fatty-acid kinks keep oils liquid "
                "while trans and saturated chains stack into solids."
            ),
            important=(
                "Cis/trans alkene isomers are configurational: "
                "interconverting them requires breaking the pi bond "
                "(about 260 kJ/mol), not rotating a drawing. Never "
                "'fix' a cis alkene into trans while checking answer "
                "choices."
            ),
        ),
        ReadingSection(
            id="physical-properties",
            heading="Physical properties, briefly",
            body=(
                "Alkenes track alkanes physically: nonpolar, insoluble "
                "in water, less dense than it, boiling points climbing "
                "with chain length on the same dispersion logic as "
                "chapter 2. Ethylene boils at -103.7 C, propene at "
                "-47.6, 1-butene at -6.3 - each within a few degrees "
                "of the matching alkane. The one wrinkle worth "
                "noticing is the small dipole a double bond can "
                "carry: alkyl groups donate electron density toward "
                "the sp2 carbons, so cis-2-butene, whose two methyl "
                "donations add vectorially, has a small net dipole "
                "while trans-2-butene's cancel. The consequence shows "
                "up as the cis isomer's slightly higher boiling point "
                "(3.7 versus 0.9 C) - a two-line preview of how much "
                "mileage this course gets from vector thinking about "
                "polarity.\n\n"
                "Economically, alkenes are anything but a footnote: "
                "ethylene is the highest-volume organic chemical made "
                "on earth, the feedstock for polyethylene, ethylene "
                "glycol and vinyl chloride, and propene stands just "
                "behind it. The cracking processes that make them and "
                "the polymerisations that consume them bracket this "
                "chapter's chemistry on the industrial scale."
            ),
        ),
        ReadingSection(
            id="unsaturation-in-use",
            heading="The unsaturation count, now with a functional group",
            body=(
                "Chapter 2 introduced the degree of unsaturation as "
                "arithmetic; alkenes make it an instrument. Each pi "
                "bond, like each ring, costs two hydrogens against the "
                "$C_nH_{2n+2}$ ceiling, so an acyclic monoalkene has "
                "the formula $C_nH_{2n}$ - the same count as a "
                "cycloalkane, and the formula alone cannot tell the "
                "two apart. What resolves the ambiguity is chemistry: "
                "a pi bond reacts (it decolourises bromine, it takes "
                "up hydrogen over a catalyst) while a plain ring does "
                "not, and hydrogen uptake can literally count the "
                "double bonds in a molecule, one $H_2$ per pi bond, "
                "with any unsaturation left over after exhaustive "
                "hydrogenation attributable to rings.\n\n"
                "That counting logic is worth rehearsing because it "
                "recurs wherever formulas meet structures: a compound "
                "$C_6H_{10}$ carries two units of unsaturation, which "
                "may be two double bonds, one triple bond, two rings, "
                "or one of each kind - and every structure you propose "
                "for it must spend exactly two units, no more, no "
                "fewer. Run the count before drawing, spend the units "
                "deliberately, and let hydrogenation data settle what "
                "the formula leaves open. It is a small discipline "
                "that converts guessing into accounting, and it is "
                "precisely how the structure problems of the "
                "spectroscopy chapters begin."
            ),
        ),
        ReadingSection(
            id="pi-in-the-data",
            heading="Seeing the pi bond in measurements",
            body=(
                "The sigma-plus-pi picture is not a cartoon; every "
                "part of it has a measurement attached, and knowing "
                "which instrument sees which feature makes the model "
                "concrete. The shortened bond length (1.33 versus "
                "1.54 angstroms) comes from diffraction and "
                "spectroscopy of real molecules. The pi electrons' "
                "looser hold shows up in ionisation energies - it "
                "costs less to remove an electron from ethylene's pi "
                "system than from ethane's sigma framework - which "
                "is the quantitative face of the claim that pi "
                "electrons are the exposed, reactive ones. "
                "Ultraviolet spectroscopy reads the pi system "
                "directly: promoting a pi electron to the pi* level "
                "absorbs in the far UV for an isolated double bond, "
                "and the absorption walks toward the visible as "
                "conjugation extends - the reason carrots and "
                "tomatoes are coloured is a chain of interacting "
                "double bonds, and the reason sunscreen works is a "
                "pi system tuned to soak up UV.\n\n"
                "Even the rotation barrier is a measured number: "
                "heat cis-2-butene hard enough and it slowly "
                "isomerises to trans, with an activation energy "
                "near the pi-bond strength - the experiment that "
                "pins the barrier the lesson has been quoting. "
                "Infrared spectroscopy adds the finishing touch: "
                "the C=C stretch appears near 1650 reciprocal "
                "centimetres, distinct from single-bond "
                "vibrations, so the double bond announces itself "
                "in an IR spectrum before any chemistry is run. "
                "One structural model, five independent "
                "instruments agreeing with it - that convergence "
                "is what earns the model the right to carry the "
                "next two chapters of predictions."
                "\n\n"
                "When an exam asks which experiment supports the "
                "pi-bond picture, any of the five answers - bond "
                "length, ionisation energy, UV absorption, "
                "isomerisation barrier, IR stretch - is "
                "defensible; knowing all five is what makes the "
                "question easy instead of memorised."
                " The habit generalises: every structural model in "
                "this course should be attachable to at least one "
                "measurement, and asking 'what experiment would show "
                "this' of each new model is the fastest route from "
                "recall to understanding - the pi bond simply "
                "happens to be the model with the richest "
                "instrument trail so far. Models that survive five independent instruments deserve trust; models resting on one deserve suspicion, and the course will say so whenever the distinction matters."
            ),
        ),
        ReadingSection(
            id="mo-picture",
            heading="Pi and pi*: the molecular-orbital upgrade",
            body=(
                "The parallel-p-orbital picture has a sharper "
                "version that later chapters will quietly rely on. "
                "When two p orbitals interact they form not one "
                "orbital but two: a bonding combination, pi, with "
                "electron density concentrated between the nuclei "
                "above and below the plane, and an antibonding "
                "combination, pi-star, with a node between the "
                "carbons. The two pi electrons occupy the bonding "
                "orbital; pi-star stands empty just above it. That "
                "pair of levels is the alkene's entire frontier: "
                "the filled pi orbital is the molecule's "
                "highest-occupied level (its HOMO), the natural "
                "thing to donate - which is the orbital-language "
                "restatement of chapter 3's claim that the pi bond "
                "is a nucleophile - and the empty pi-star is the "
                "lowest-unoccupied level (LUMO), the place an "
                "incoming electron pair or a promoted electron "
                "must go.\n\n"
                "Three facts the course uses later fall out "
                "immediately. Ultraviolet absorption is the "
                "pi-to-pi-star jump, so the pi/pi-star gap is a "
                "measurable number, and anything that narrows it "
                "- conjugation, as the next section shows - "
                "shifts absorption toward the visible. "
                "Hydrogenation's catalyst and the electrophiles "
                "of chapter 5 all do business with the HOMO: the "
                "reactivity of an alkene tracks how high its "
                "filled pi level sits, which alkyl substitution "
                "raises. And breaking the pi bond thermally - the "
                "rotation barrier - is, in this language, "
                "uncoupling the two p orbitals until bonding and "
                "antibonding cease to differ, which is why the "
                "barrier and the pi-bond strength are the same "
                "number. None of this replaces the simple "
                "picture; it is the same picture with energy "
                "labels, and the labels are what conjugation, "
                "colour and pericyclic chemistry will be priced "
                "in."
            ),
        ),
        ReadingSection(
            id="conjugation-preview",
            heading="Neighbouring double bonds: isolated, conjugated, cumulated",
            body=(
                "Put two double bonds in one molecule and their "
                "relative placement becomes a structural variable "
                "with consequences. Separated by two or more "
                "single bonds they are isolated - each behaves as "
                "if alone. Alternating with exactly one single "
                "bond between them they are conjugated, as in "
                "1,3-butadiene, and the four p orbitals overlap "
                "into one continuous pi system: the electrons "
                "delocalise across all four carbons, the system "
                "sits measurably lower in energy than two "
                "isolated bonds, and the UV absorption moves "
                "from ethylene's 171 nanometres to butadiene's "
                "217 - the pi/pi-star gap narrowing exactly as "
                "the MO section promised. Extend the alternation "
                "and the trend continues, until molecules like "
                "beta-carotene, with eleven conjugated double "
                "bonds, absorb blue light and look orange: the "
                "colour of carrots is a particle-in-a-box "
                "argument wearing organic clothes.\n\n"
                "Sharing one carbon with no single bond between "
                "- C=C=C, an allene - makes the bonds cumulated: "
                "the central carbon is sp hybridised, its two pi "
                "bonds perpendicular, and the arrangement is "
                "higher in energy and stereochemically strange "
                "(the two ends' substituents lie in "
                "perpendicular planes). The stability order - "
                "conjugated below isolated below cumulated - is "
                "measurable by heats of hydrogenation and will "
                "be assumed constantly: conjugation explains "
                "the preferred products of eliminations, the "
                "reactivity of dienes, aromatic chemistry's "
                "entire existence, and the colour chemistry of "
                "vision. The vocabulary installed here - and "
                "the habit of scanning any polyene for its "
                "alternation pattern - is the price of "
                "admission to all of it."
            ),
        ),
        ReadingSection(
            id="rings-and-bredt",
            heading="Double bonds in rings: strain and Bredt's rule",
            body=(
                "Confining a double bond in a ring adds geometry "
                "constraints the open chain never feels. A cis "
                "double bond tucks into small rings comfortably - "
                "cyclopropene is strained but isolable, "
                "cyclopentene and cyclohexene are ordinary - "
                "because the cis arrangement's substituents point "
                "the way a small ring needs. A trans double bond "
                "is another matter: its substituents point to "
                "opposite sides, forcing the ring to reach around "
                "the back of the planar unit, and rings below "
                "eight carbons simply cannot. trans-Cyclooctene "
                "is the smallest isolable trans-cycloalkene, "
                "strained, chiral by its twist, and famous for "
                "both; trans-cycloheptene and below exist only "
                "as fleeting intermediates. The exam-ready "
                "residue: in rings smaller than eight, 'cis' "
                "needs no label because trans is impossible, and "
                "a drawn trans double bond in a small ring is an "
                "error to flag, not a stereoisomer to rank.\n\n"
                "A related geometric veto carries a name. At a "
                "bridgehead carbon of a small fused bicyclic "
                "system - the carbon shared by two bridges - a "
                "double bond cannot form, because the bridgehead "
                "cannot flatten to sp2 planarity while pinned by "
                "rings on both sides; the p orbitals that would "
                "make the pi bond point in unbridgeable "
                "directions. This is Bredt's rule, and its "
                "practical face appears in the elimination "
                "chapters: a synthesis or an exam option whose "
                "product is a small bridgehead alkene is wrong "
                "regardless of how plausible the arrow-pushing "
                "looked. Large bicyclics relax the rule - with "
                "enough ring atoms the bridgehead can twist into "
                "planarity - but at the ring sizes this course "
                "draws, Bredt's rule is effectively absolute, "
                "one more example of geometry legislating what "
                "electronics may propose."
            ),
        ),
        ReadingSection(
            id="polar-pi-cousins",
            heading="The polarised cousins: C=O and C=N",
            body=(
                "The C=C bond has heteroatom cousins built from "
                "the same parts - a sigma bond plus a side-on pi "
                "overlap - and comparing them now inoculates "
                "against a common confusion later. In a carbonyl "
                "(C=O) the pi bond stretches between atoms of "
                "very different electronegativity: oxygen holds "
                "the pi electrons closer, the bond is strongly "
                "polarised, and the carbon end wears a partial "
                "positive charge. The consequence inverts the "
                "alkene's chemistry wholesale. An alkene's pi "
                "bond, symmetric and electron-rich, behaves as a "
                "nucleophile and seeks electrophiles; a "
                "carbonyl's pi bond, drained toward oxygen, "
                "makes its carbon an electrophile that "
                "nucleophiles attack. Same orbital anatomy, "
                "opposite job, and the difference is nothing but "
                "electronegativity applied to the pi cloud. The "
                "imine (C=N) sits between the two, polarised "
                "less than a carbonyl, and behaves accordingly.\n\n"
                "Keeping the cousins straight pays off "
                "repeatedly. Additions across C=C and across "
                "C=O are both 'additions to a double bond', but "
                "the roles reverse: HBr adds to an alkene with "
                "the proton arriving first at the pi bond, "
                "while a Grignard adds to a ketone with the "
                "carbanion arriving first at carbon. Reagents "
                "that touch one cousin often ignore the other - "
                "catalytic hydrogenation reduces C=C readily "
                "and C=O only under forcing conditions, while "
                "borohydride does the reverse - and synthesis "
                "problems exploit that selectivity constantly. "
                "When later chapters seem to teach "
                "contradictory rules for 'double bonds', check "
                "which cousin is on stage: the rules never "
                "conflict once the polarity of the pi bond in "
                "question is named."
            ),
        ),
        ReadingSection(
            id="hyperconjugation-bridge",
            heading="Substitution patterns and a first look at hyperconjugation",
            body=(
                "Alkenes are classified by how many carbon "
                "substituents the two sp2 carbons carry: "
                "monosubstituted (one, as in 1-butene), "
                "disubstituted in three geometric flavours "
                "(geminal, with both groups on one carbon; cis "
                "and trans vicinal), trisubstituted, and "
                "tetrasubstituted. The census matters because "
                "nearly every alkene property scales with it: "
                "stability rises with substitution, as the next "
                "lesson's hydrogenation data will show "
                "quantitatively; reactivity toward acids rises "
                "in parallel, because the same electron "
                "donation that stabilises the alkene stabilises "
                "the carbocation formed from it even more; and "
                "the substitution pattern is the first thing to "
                "read off any alkene an exam draws.\n\n"
                "The mechanism behind the trend deserves its "
                "name early: hyperconjugation. The sigma bonds "
                "of alkyl groups adjacent to the pi system - "
                "C-H bonds especially - overlap slightly with "
                "the pi framework, donating a little electron "
                "density into it and spreading the bonding over "
                "more atoms. Each alkyl substituent adds more "
                "such interactions, which is why stability "
                "climbs stepwise from mono- to tetrasubstituted "
                "rather than jumping. The same interaction, "
                "aimed at an empty p orbital instead of a full "
                "pi bond, will explain carbocation stability "
                "two lessons from now, and treating the two "
                "cases as one phenomenon - sigma electrons "
                "leaking into an adjacent pi or empty orbital - "
                "halves the memorisation. For now the working "
                "rule is simple: count the carbons attached to "
                "the double bond, and expect everything - "
                "stability, acid reactivity, Zaitsev "
                "preferences - to follow that count."
            ),
        ),
        ReadingSection(
            id="industrial-and-biological",
            heading="Ethylene at scale: crackers, polymers, and ripening fruit",
            body=(
                "The physical-properties section called ethylene "
                "the largest-volume organic chemical on earth; "
                "the supply chain behind that sentence is worth "
                "a paragraph. Industrial ethylene comes from "
                "steam cracking: ethane or naphtha diluted with "
                "steam is shot through furnace tubes near 850 C "
                "for fractions of a second, C-C and C-H bonds "
                "homolyse, and the radical soup resolves into "
                "small alkenes on quenching. The process is "
                "brutally energy-intensive and utterly "
                "foundational - polyethylene from ethylene, "
                "polypropylene from propene, and from ethylene "
                "onward the glycols, vinyl chlorides and "
                "styrenes of the plastics economy. The "
                "polymerisations that consume most of that "
                "output splice thousands of pi bonds into "
                "sigma-bonded chains, trading each weak pi bond "
                "for a strong new sigma bond - the "
                "thermodynamic driving force of the entire "
                "polymer industry is the 264 kJ/mol arithmetic "
                "of this chapter's first section.\n\n"
                "Biology, meanwhile, uses ethylene as a word "
                "rather than a material: it is a gaseous plant "
                "hormone, and fruit ripening is one of its "
                "sentences. Bananas are shipped green and "
                "hard, then exposed to ethylene in ripening "
                "rooms at the destination; one ripening apple "
                "in a fruit bowl visibly hastens its "
                "neighbours by the same signalling. That the "
                "simplest alkene doubles as an industrial "
                "feedstock measured in hundreds of millions "
                "of tonnes and a hormone active at parts per "
                "million is a usefully humbling fact: "
                "molecular function depends on context, and "
                "the same two-carbon pi bond can be a "
                "commodity or a message."
            ),
        ),
        ReadingSection(
            id="alkene-spectroscopy",
            heading="The alkene's spectroscopic signature, gathered",
            body=(
                "The measurements section scattered the pi "
                "bond's instrument trail; this one gathers it "
                "into the checklist a structure problem "
                "actually uses. Infrared: the C=C stretch "
                "appears near 1650 reciprocal centimetres, "
                "medium-to-weak (vanishing entirely for "
                "symmetric alkenes, whose stretch changes no "
                "dipole), while the vinyl =C-H stretches sit "
                "just above 3000 - the single most useful "
                "quick test, since saturated C-H stays below "
                "that line. Proton NMR, previewed loosely: "
                "hydrogens on sp2 carbons resonate far "
                "downfield of alkane protons, in the 4.5-to-"
                "6.5 ppm window, deshielded partly by the "
                "pi system's induced field - so a glance at "
                "that region counts vinyl hydrogens before "
                "any analysis begins. Ultraviolet: isolated "
                "double bonds absorb too far into the UV to "
                "be diagnostic on routine instruments, but "
                "conjugation brings the absorption into "
                "range, so a UV signal above about 200 "
                "nanometres is itself evidence of conjugated "
                "unsaturation.\n\n"
                "Add the chemical tests that predate the "
                "instruments - bromine decolourisation, "
                "hydrogen uptake with a catalyst, each "
                "consuming one pi bond per equivalent - and "
                "the alkene is among the easiest functional "
                "groups to detect and count. The structure-"
                "determination chapters will formalise the "
                "workflow: formula gives the unsaturation "
                "count, IR and NMR say which units are pi "
                "bonds and where they sit, hydrogenation "
                "confirms by arithmetic. Rehearsing the "
                "checklist now, on a functional group this "
                "cooperative, builds the routine the harder "
                "groups will demand."
            ),
        ),
        ReadingSection(
            id="double-bond-history",
            heading="How chemists learned to draw a double bond",
            body=(
                "Ethylene was known long before anyone could "
                "draw it: eighteenth-century Dutch chemists "
                "made 'olefiant gas' - oil-making gas, for the "
                "oily liquid it gave with chlorine - and the "
                "name survives in 'olefin', the industry's "
                "word for alkenes to this day. The double bond "
                "as a drawn object had to wait for structural "
                "theory: Kekule's and Couper's bonded-atom "
                "formulas in the 1850s, then the tetravalent "
                "carbon applied systematically, with the "
                "two-bond link between ethylene's carbons "
                "emerging as the way to spend four valences "
                "on two carbons and four hydrogens. The "
                "geometry came from van 't Hoff and Le Bel in "
                "1874: placing carbon's bonds in three "
                "dimensions predicted that a double bond "
                "locks rotation and that suitably substituted "
                "alkenes should exist as two separable "
                "isomers - cis and trans - a prediction "
                "confirmed in the laboratory and among the "
                "earliest triumphs of three-dimensional "
                "chemical thinking.\n\n"
                "The electronic interpretation is a "
                "twentieth-century layer: Lewis's shared "
                "pairs in 1916 made the double bond two "
                "shared pairs, and Huckel's 1930 quantum "
                "treatment separated them into sigma and pi, "
                "explaining in one stroke why the two bonds "
                "of a 'double bond' are inequivalent, why "
                "rotation is blocked, and why one bond "
                "reacts while the other holds. Every layer "
                "of that history is still in active use in "
                "this chapter - the name in industry, the "
                "isomer prediction in stereochemistry, the "
                "sigma/pi split in every mechanism - which "
                "makes the double bond a compact case study "
                "in how chemical models accrete: names "
                "first, connectivity second, geometry "
                "third, electrons last, nothing discarded."
            ),
        ),
        ReadingSection(
            id="faces-and-additions",
            heading="Two faces, two ends: the geometry additions will use",
            body=(
                "Planarity gives the double bond two distinguishable "
                "faces, and the additions of chapter 5 are best "
                "previewed as geometry problems built on that fact. "
                "A reagent adding two groups across the pi bond has "
                "two independent choices to make: which END of the "
                "double bond each group takes - the regiochemistry "
                "question, answered by Markovnikov analysis and "
                "carbocation stability - and which FACE or faces "
                "the two groups arrive on, the stereochemistry "
                "question. When both new groups arrive on the same "
                "face the addition is called syn; when they arrive "
                "on opposite faces, anti. The distinction is "
                "invisible for simple substrates but becomes "
                "product-determining the moment the alkene carbons "
                "carry different substituents: syn and anti "
                "addition to the same alkene can give different, "
                "separable stereoisomers, and several chapter-5 "
                "reactions are prized precisely because their "
                "mechanisms enforce one choice - hydroboration "
                "delivers syn, bromination via its cyclic "
                "intermediate delivers anti, and catalytic "
                "hydrogenation delivers both hydrogens syn from "
                "the metal surface.\n\n"
                "The vocabulary to internalise now is small: face, "
                "syn, anti, and the idea that a mechanism can "
                "commit a reaction to one face-choice. What makes "
                "the preview worth its space is the reasoning "
                "habit it installs - every addition product should "
                "be checked twice, once for which carbon got "
                "which group and once for the faces - because "
                "exam questions routinely draw four candidate "
                "products that differ only in those two choices. "
                "Students arriving at chapter 5 already asking "
                "'which end, which face' experience the "
                "reactions as a table to fill in; those arriving "
                "without the frame experience them as eight "
                "unrelated facts. The geometry of this lesson - "
                "one plane, two faces, locked rotation - is the "
                "entire foundation of the difference."
            ),
        ),
        ReadingSection(
            id="alkenebonding-workout",
            heading="A structure workout on the double bond",
            body=(
                "Four graded exercises consolidate the chapter. "
                "One: how many degrees of unsaturation does "
                "$C_7H_{10}$ carry, and name three structural "
                "recipes that spend them. The count is "
                "$(2 \\cdot 7 + 2 - 10)/2 = 3$; legal recipes "
                "include three double bonds, one triple bond plus "
                "one double bond, two rings plus one double bond, "
                "or one ring plus two double bonds - and any "
                "proposed structure spending more or fewer than "
                "three units is wrong before any other check. "
                "Two: which of 1-butene, 2-methylpropene and "
                "2-butene can exist as cis/trans isomers? Only "
                "2-butene - each of its sp2 carbons carries two "
                "different groups (methyl and hydrogen), while "
                "1-butene has two hydrogens on one end and "
                "2-methylpropene two methyls, and identical "
                "twins on either end erase the cis/trans "
                "distinction. Three: classify the substitution "
                "of 2-methyl-2-butene - the double-bond carbons "
                "carry methyl, methyl and methyl plus one "
                "hydrogen: trisubstituted, and therefore near "
                "the stable end of the next lesson's ladder. "
                "Four: in 1,4-pentadiene versus 1,3-pentadiene, "
                "which is conjugated, and what measurable "
                "differences follow? The 1,3-isomer's alternating "
                "pattern delocalises its pi system: it is the "
                "lower-energy isomer, and its UV absorption sits "
                "at longer wavelength than the isolated "
                "1,4-diene's.\n\n"
                "Each exercise is a template, not a one-off: "
                "unsaturation audit, cis/trans eligibility check, "
                "substitution census, conjugation scan. Run the "
                "four on every unfamiliar alkene an exam "
                "presents - the habit takes under a minute and "
                "pre-answers most of what the question can ask."
            ),
        ),
        ReadingSection(
            id="strength-numbers",
            heading="Why the pi bond is the currency of alkene chemistry",
            body=(
                "One arithmetic pattern is worth pinning before "
                "the reaction chapters spend it a dozen times. "
                "Nearly every addition across a double bond trades "
                "the pi bond (roughly 264 kJ/mol) plus one bond in "
                "the reagent for two new sigma bonds, and because "
                "sigma bonds are individually stronger than the pi "
                "bond they replace, the ledger usually comes out "
                "exothermic: hydrogenation releases heat, "
                "hydration releases heat, halogenation releases a "
                "great deal of heat. The pi bond is, in effect, "
                "stored energy with a handle on it - weak enough "
                "to open under mild conditions, strong enough to "
                "persist on the shelf - and that combination is "
                "why the alkene is the workhorse functional group "
                "of synthesis rather than the inert alkane or the "
                "over-reactive extremes.\n\n"
                "The same ledger read in reverse explains "
                "elimination: forcing the trade backwards - two "
                "sigma bonds giving back a pi bond - costs "
                "enthalpy, so eliminations lean on entropy (one "
                "molecule becoming two) and on heat, which is why "
                "chapter 9's eliminations run hot while additions "
                "run cold. Keep the ledger in view and the "
                "conditions attached to every reaction stop "
                "looking arbitrary: they are the thermodynamic "
                "price list of the pi bond, quoted per reaction. "
                "Addition pays out the stored 264 kJ/mol and "
                "runs willingly; elimination buys the pi bond "
                "back and must be paid in heat, concentration "
                "tricks, or a leaving group so good the "
                "molecule cannot refuse. Every reagent table "
                "in the next five chapters is this one "
                "sentence with prices filled in, which is why "
                "the number is worth memorising once and "
                "consulting forever."
            ),
        ),
    ),
    key_takeaways=(
        "A double bond is one sigma plus one pi; the pi part (~264 kJ/mol) is the weaker, reactive partner built from side-on p overlap.",
        "sp2 carbons are planar, 120-degree, with a shorter C=C (1.33 A vs 1.54 A) - the two faces of the plane are chemically real.",
        "Rotation about C=C requires breaking the pi bond, so cis and trans alkenes are separable configurational isomers.",
        "Acyclic monoalkenes fit CnH2n - the same count as a ring; hydrogenation uptake distinguishes and counts pi bonds.",
        "Alkene physical properties track alkanes, with small cis-isomer dipoles as the polarity wrinkle.",
    ),
    exam_tips=(
        "MCAT loves the retinal example: photoisomerisation works because light supplies what thermal energy cannot - the pi-bond-breaking rotation.",
        "Formula questions offering CnH2n structures: remember one ring OR one pi bond fits; only reactivity data distinguishes them.",
    ),
))


# --------------------------------------------------------------------------
# 4.2 Alkene nomenclature and E/Z
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.ALKENENOMEN",
    lead=(
        "Alkene names carry two loads the alkane rules never met: the "
        "position of the double bond, and its geometry. Position rides on "
        "the familiar numbering algorithm with one new priority; geometry "
        "needs a new system entirely, because cis and trans stop working "
        "the moment a double-bond carbon holds two different substituents "
        "that are both 'something'. The E/Z system and its "
        "Cahn-Ingold-Prelog priority rules are the fix, and they are worth "
        "learning cold here because chapter 6 reuses the identical rules "
        "for R and S."
    ),
    sections=(
        ReadingSection(
            id="ene-naming",
            heading="Position: the -ene rules",
            body=(
                "Alkene nomenclature modifies the alkane algorithm in "
                "three places. The parent chain must CONTAIN the double "
                "bond - a longer chain that misses it loses to a "
                "shorter one that includes it. Numbering starts from "
                "the end nearer the double bond, and the bond's locant "
                "is the number of its first carbon: CH2=CHCH2CH3 is "
                "1-butene (or but-1-ene in the newer style, with the "
                "locant against the suffix), never 4-butene. Only when "
                "the double bond is equidistant from both ends do "
                "substituent locants break the tie. Everything else - "
                "alphabetisation, multiplying prefixes, substituent "
                "naming - carries over unchanged.\n\n"
                "Two vocabulary items ride along because the "
                "literature and later chapters assume them: the vinyl "
                "group (a substituent attached directly to a "
                "double-bond carbon) and the allyl group (attached to "
                "the carbon NEXT to a double bond). The distinction is "
                "worth a moment now, because allylic positions - one "
                "bond away from the pi system - develop special "
                "reactivity that gets its own chapter in Organic II, "
                "and confusing vinylic with allylic scrambles that "
                "entire discussion. Dienes take the suffix -adiene "
                "with two locants and keep both in the chain; cyclic "
                "alkenes number so the double bond takes carbons 1 "
                "and 2, choosing direction to give substituents low "
                "numbers."
            ),
        ),
        ReadingSection(
            id="cip-priorities",
            figure=Figure(
                stem="org1-ez-bromopropene",
                caption=(
                    "The priority trap drawn out: with bromine on the double bond, E and Z follow CIP ranking, not visual same-sidedness."
                ),
                alt="Structures of E- and Z-1-bromo-1-propene labeled with the priority reasoning.",
            ),
            heading="The CIP priority rules",
            body=(
                "The Cahn-Ingold-Prelog rules rank the two groups on "
                "each double-bond carbon. Rule one: higher atomic "
                "number wins at the first atom - Br beats Cl beats O "
                "beats N beats C beats H. Rule two: on a tie at the "
                "first atom, list each substituent's OWN attached "
                "atoms in decreasing order and compare list against "
                "list at the first point of difference - so ethyl "
                "(C: C,H,H) beats methyl (C: H,H,H), and isopropyl "
                "(C: C,C,H) beats ethyl. Rule three: multiple bonds "
                "are counted as duplicated atoms - a C=O oxygen "
                "counts as oxygen twice at the carbonyl carbon - "
                "which is how carbonyl-bearing groups outrank "
                "alcohols in later chapters.\n\n"
                "Discipline points that prevent the standard errors: "
                "compare atom by atom at the FIRST point of "
                "difference, never by adding atomic numbers or by "
                "judging overall size (a tert-butyl group loses to a "
                "CH2Br, because bromine appears at the first "
                "comparison atom); and explore the branches in "
                "decreasing order, not along the chain you happen to "
                "have drawn. The rules are a lexicographic sort, and "
                "treating them as one - lists, first difference, "
                "done - makes every priority question mechanical."
            ),
        ),
        ReadingSection(
            id="e-z-assignment",
            figure=Figure(
                stem="org1-cis-trans-butene",
                caption=(
                    "Where cis/trans still works: one hydrogen on each sp2 carbon makes the informal labels unambiguous."
                ),
                alt="cis- and trans-2-butene, the easy case the informal vocabulary covers.",
            ),
            heading="E and Z, and where cis/trans still lives",
            body=(
                "With priorities assigned on each carbon separately, "
                "geometry becomes one comparison: if the two "
                "higher-priority groups lie on the same side of the "
                "double bond the alkene is Z (zusammen, together); on "
                "opposite sides it is E (entgegen, opposite). The "
                "descriptor goes in parentheses at the front of the "
                "name: (Z)-2-butene, (E)-3-methyl-2-pentene. Every "
                "tetrasubstituted, trisubstituted or awkwardly "
                "disubstituted alkene that cis/trans cannot describe, "
                "E/Z describes without ambiguity.\n\n"
                "Cis and trans survive as informal labels for the "
                "easy case - a disubstituted alkene with one hydrogen "
                "on each carbon - and as the standard vocabulary for "
                "ring substitution. But the mapping is not automatic: "
                "cis does not always mean Z. In "
                "1-bromo-1-propene, the bromine and the methyl "
                "on opposite... rather than memorise treacherous "
                "examples, adopt the safe habit: assign priorities "
                "and name E or Z explicitly whenever any double-bond "
                "carbon carries two non-hydrogen groups, and reserve "
                "cis/trans for conversation about the simple cases. "
                "Exams that place a halogen on a double bond are "
                "usually testing exactly this trap - the halogen "
                "outranks the alkyl group the eye pairs it with, and "
                "the correct letter contradicts the visual cis/trans "
                "impression."
            ),
            important=(
                "Cis/trans and Z/E do NOT always coincide. Priorities "
                "decide Z and E; visual same-sideness decides "
                "cis/trans; when a high-priority atom like a halogen "
                "sits on the double bond, the two systems can "
                "disagree. When in doubt, rank and use E/Z."
            ),
        ),
        ReadingSection(
            id="why-geometry-matters",
            heading="Why the letter in the name is chemistry, not clerical work",
            body=(
                "The E/Z label predicts real differences. Stability: "
                "the next lesson shows trans (usually E) alkenes "
                "sitting lower in energy than cis by measurable "
                "kilojoules. Reactivity: eliminations in chapter 9 "
                "produce E and Z products in ratios the mechanism "
                "controls, and asking 'which alkene forms' is asking "
                "for a letter. Spectroscopy: coupling constants in "
                "proton NMR read the geometry directly, with trans "
                "couplings characteristically larger than cis - the "
                "letter in the name becomes a number in the "
                "spectrum. And biology mostly builds Z: the common "
                "unsaturated fatty acids are cis, which is why their "
                "chains kink and their fats stay liquid, and why "
                "partially hydrogenated 'trans fats' - straightened "
                "chains from industrial processing - behave like "
                "saturated ones.\n\n"
                "The practical takeaway for the working student: "
                "treat the geometry descriptor as part of the "
                "compound's identity, as non-negotiable as the "
                "locants. An answer of '2-pentene' to a synthesis "
                "question that produces one geometry is incomplete, "
                "and the CIP ranking skill practised here is the "
                "same muscle chapter 6 uses on chirality centres - "
                "learn it once, use it twice. And keep the formula audit running beneath every name: an acyclic monoalkene must fit $C_nH_{2n}$, a monocyclic one $C_nH_{2n-2}$ - a name whose implied formula misses the unsaturation count is wrong before any locant is judged."
            ),
        ),
        ReadingSection(
            id="worked-names",
            heading="Worked names, and the trivial names worth knowing",
            body=(
                "Run the algorithm on three structures of rising "
                "difficulty. CH3CH=CHCH2CH3: five carbons "
                "containing the double bond, numbered from the end "
                "nearer it, bond between C2 and C3 - 2-pentene, "
                "geometry to be specified, and with a methyl on "
                "each sp2 carbon it is E if the methyl and ethyl "
                "sit opposite. Next, "
                "CH2=C(CH3)CH2CH3: the longest chain through the "
                "double bond is four carbons, the bond starts at "
                "C1, a methyl rides at C2 - 2-methyl-1-butene, no "
                "geometry descriptor because C1 carries two "
                "hydrogens. Third, a cyclohexene with a methyl at "
                "the double bond: number the ring so the sp2 "
                "carbons are 1 and 2 and turn in the direction "
                "giving the methyl the lower locant - "
                "1-methylcyclohexene, again no E/Z because ring "
                "geometry fixes it.\n\n"
                "A handful of trivial names survive in constant "
                "use and must be recognised on sight even where "
                "systematic names exist: ethylene and propylene "
                "for the two industrial giants, isobutylene for "
                "2-methylpropene, styrene for vinylbenzene, "
                "isoprene for the five-carbon diene that nature "
                "polymerises into rubber and stitches into "
                "terpenes. Exams and papers use them "
                "interchangeably with systematic names, and the "
                "translation should be automatic. The reverse "
                "skill - drawing a structure from any name in "
                "either register - is the real test of this "
                "lesson, and it is worth drilling until a name "
                "like (Z)-3-methyl-2-hexene converts to a "
                "correct skeleton in under thirty seconds."
                "\n\n"
                "Reverse drills expose the two errors worth "
                "pre-empting: forgetting that each double bond "
                "in a diene carries its own geometry letter, and "
                "dropping the locant when the double bond could "
                "sit in more than one place - butene without a "
                "number is not a name, and graders read the "
                "omission as not knowing why the number "
                "matters."
                " A last convention: substituents on the double "
                "bond itself take their locants from the sp2 "
                "carbons they occupy, so 2-methyl-2-butene needs "
                "no geometry letter (one sp2 carbon carries two "
                "methyls) while 3-methyl-2-pentene does - checking "
                "whether each sp2 carbon holds two DIFFERENT "
                "groups is the fast test for whether a geometry "
                "descriptor is required at all. Ten seconds spent on that check saves the commonest half-point deduction in naming questions, term after term."
            ),
        ),
        ReadingSection(
            id="cip-edge-cases",
            heading="CIP at the edges: duplicates, isotopes, and phantom atoms",
            body=(
                "The priority rules earn their keep in the cases "
                "the simple statement leaves open, and three edge "
                "rules settle nearly all of them. First, multiple "
                "bonds are expanded into duplicated atoms: a "
                "double bond A=B is treated, for ranking purposes, "
                "as A bonded to B plus a phantom duplicate of B, "
                "and B bonded to A plus a phantom duplicate of A, "
                "each phantom carrying atomic number but no "
                "further substituents. The consequence: a vinyl "
                "group (-CH=CH2) ranks as a carbon bearing "
                "(C, C, H) - the real carbon plus its duplicate - "
                "which beats an ethyl group's (C, H, H) and loses "
                "to an ethynyl group's (C, C, C). Run that "
                "comparison once by hand and the machinery stops "
                "feeling arbitrary: every unsaturation is just "
                "pre-counted branching. Second, when first atoms "
                "tie, the comparison proceeds outward sphere by "
                "sphere, comparing each substituent's atom SET in "
                "decreasing order - the highest against the "
                "highest, then the next - and the first "
                "difference decides; isopropyl (C, C, H) thus "
                "beats propyl (C, H, H) at the first sphere "
                "despite identical formulas. Third, isotopes: "
                "where atomic numbers tie completely, higher mass "
                "number wins, so deuterium outranks ordinary "
                "hydrogen - a rule invented for exactly the "
                "labelled compounds mechanistic chemistry uses.\n\n"
                "The habit that keeps the rules honest is "
                "writing the comparison down as triples rather "
                "than doing it by feel: at each contested atom, "
                "list the three attached atomic numbers in "
                "descending order, compare lexicographically, "
                "and recurse only on ties. Feel says isopropyl "
                "and vinyl are 'about the same'; the triples "
                "say (C,C,H) against (C,C,H) - a genuine tie at "
                "sphere one, broken at sphere two where vinyl's "
                "duplicated carbon (counting C,H,H... against "
                "isopropyl's methyls' H,H,H) wins. Exams place "
                "their traps precisely at these ties, and the "
                "written-triple discipline is what walks "
                "through them."
            ),
        ),
        ReadingSection(
            id="dienes-and-polyenes",
            heading="Naming molecules with several double bonds",
            body=(
                "Multiple double bonds compound the rules "
                "without changing them. The suffix grows a "
                "counting prefix - -adiene, -atriene - and the "
                "parent chain must contain as many of the double "
                "bonds as possible, each with its own locant: "
                "1,3-butadiene, 1,4-pentadiene, "
                "2-methyl-1,3-butadiene (isoprene, the repeating "
                "unit of rubber and of half of natural-product "
                "chemistry). Numbering still minimises the "
                "double-bond locant set at the first point of "
                "difference, and the 'a' slipped in before the "
                "suffix (buta-diene rather than but-diene) is "
                "pure pronunciation. Geometry descriptors "
                "multiply with the bonds: each stereogenic "
                "double bond gets its own E or Z tagged with its "
                "locant, all gathered at the front - "
                "(2E,4Z)-hexa-2,4-diene names one specific "
                "geometric isomer of four possible, and dropping "
                "either descriptor leaves the name ambiguous "
                "among two.\n\n"
                "Polyene naming is also where the conjugation "
                "vocabulary of the bonding lesson becomes "
                "legible in names alone: locants 1,3 (or any "
                "n, n+2 pair) announce conjugation, 1,4 and "
                "wider announce isolated bonds, and 1,2 - "
                "consecutive locants - announce a cumulated "
                "allene. A reader fluent in the convention "
                "extracts the electronic situation from the "
                "name without drawing: (2E,4E,6E)-octa-2,4,6-"
                "triene is a fully conjugated, all-trans "
                "chain, and the retinal of the vision "
                "chemistry ahead is an (11Z) polyene whose "
                "single labelled Z is the entire photochemical "
                "story. Practise reading names for their "
                "locant patterns as well as their structures; "
                "the pattern is often the chemistry."
            ),
        ),
        ReadingSection(
            id="cycloalkene-naming",
            heading="Rings: where the locants go and when geometry is named",
            body=(
                "Cycloalkenes carry their own small rulebook. "
                "The double bond is assumed to sit between "
                "carbons 1 and 2, and the ring is numbered in "
                "the direction that hands the lowest locants to "
                "substituents at the first difference: "
                "3-methylcyclohexene, not 6-methylcyclohexene, "
                "because walking the ring the short way from the "
                "double bond reaches the methyl at 3. No locant "
                "for the double bond itself is written in simple "
                "cases - 'cyclohexene' says it all - but "
                "polysubstituted or polyunsaturated rings write "
                "them out: cyclohexa-1,3-diene and "
                "cyclohexa-1,4-diene are different compounds, "
                "conjugated and not, and the locants are the "
                "only difference between their names.\n\n"
                "Geometry descriptors, by contrast, mostly "
                "vanish inside rings, for the reason the "
                "bonding lesson proved: below eight ring "
                "carbons only the cis arrangement is possible, "
                "so writing cis- or Z- on cyclohexene is "
                "redundant and the convention omits it. The "
                "descriptor reappears exactly where the "
                "geometry becomes a real choice - "
                "(E)-cyclooctene and (Z)-cyclooctene are "
                "separable compounds with the E isomer "
                "strained and chiral - and an exam name "
                "carrying an unexpected E on a small ring is "
                "either an error to flag or a trick to catch. "
                "The same locant discipline extends to fused "
                "and substituted systems the later chapters "
                "draw: number from the unsaturation, walk "
                "toward the substituents, write only the "
                "descriptors the geometry genuinely leaves "
                "open. Rings reward the checklist run in that "
                "order, and the order never changes."
            ),
        ),
        ReadingSection(
            id="alkenyl-substituents",
            heading="Vinyl, allyl, and friends: alkenes as substituents",
            body=(
                "When the double bond sits in a substituent "
                "rather than the parent chain, a small set of "
                "names carries it, and two of them are so "
                "load-bearing that confusing them costs marks "
                "for semesters. Vinyl (systematically ethenyl) "
                "is the -CH=CH2 group attached directly through "
                "an sp2 carbon: vinyl chloride, the monomer of "
                "PVC, has chlorine bonded straight to the "
                "double bond. Allyl (prop-2-en-1-yl) is "
                "-CH2-CH=CH2, attached through an sp3 carbon "
                "that is ADJACENT to the double bond: allyl "
                "chloride's chlorine sits one carbon away from "
                "the unsaturation. The one-carbon difference is "
                "electronic night and day - a substituent on a "
                "vinyl position is attached to the pi system, "
                "while a substituent on an allyl position "
                "neighbours it - and the reactivity "
                "consequences diverge just as sharply: allylic "
                "positions ionise and radicalise easily because "
                "the resulting intermediate is resonance-"
                "stabilised, while vinylic positions resist "
                "both. Chapter 5's radical chemistry and the "
                "substitution chapters lean on that contrast "
                "repeatedly, always in this vocabulary.\n\n"
                "Two more members complete the working set: "
                "methylene as the =CH2 group when a double bond "
                "leaves a ring or chain (methylenecyclohexane, "
                "an exocyclic double bond, distinct from "
                "1-methylcyclohexene's endocyclic one), and "
                "propenyl, the -CH=CH-CH3 group attached "
                "through the sp2 carbon, distinct from allyl "
                "by attachment point alone. The "
                "exocyclic/endocyclic distinction and the "
                "allyl/vinyl distinction are both attachment-"
                "point distinctions, which is the general "
                "lesson: for unsaturated substituents, WHERE "
                "the bond to the parent lands determines the "
                "name and, later, the chemistry."
            ),
        ),
        ReadingSection(
            id="cis-trans-vs-ez",
            heading="When cis/trans and E/Z disagree",
            body=(
                "The older cis/trans labels and the CIP-based "
                "E/Z system usually agree, and the cases where "
                "they part company are deliberately hunted by "
                "exam writers. Cis and trans describe the "
                "relationship of the two 'main' substituents - "
                "in practice the chain continuations - while E "
                "and Z describe the two CIP-highest priorities, "
                "and the two pairings differ whenever a high-"
                "priority atom is not part of the main chain. "
                "2-Chloro-2-butene is the standard demonstration: "
                "call the isomer with both methyls on the same "
                "side 'cis' (it is the cis chain), but rank "
                "priorities and chlorine beats methyl on C2 "
                "while methyl beats hydrogen on C3 - the two "
                "winners sit on OPPOSITE sides, so the cis-"
                "chain compound is E. The letters flip from "
                "the intuition, and only the CIP audit "
                "catches it.\n\n"
                "The resolution the course adopts is the "
                "field's: cis/trans survives as informal "
                "vocabulary for disubstituted alkenes where "
                "each sp2 carbon carries one substituent and "
                "one hydrogen - there the two systems cannot "
                "disagree, cis is Z and trans is E - and E/Z "
                "is mandatory the moment any double-bond "
                "carbon carries two non-hydrogen groups. The "
                "operational rule: seeing three or four real "
                "substituents on a double bond is the signal "
                "to stop trusting geometric intuition and run "
                "the priority triples, and any exam option "
                "using cis/trans language on such an alkene "
                "is testing whether you know the vocabulary "
                "has expired. One audit, two letters, no "
                "exceptions - the same discipline R/S will "
                "demand at tetrahedral centres one chapter "
                "later."
            ),
        ),
        ReadingSection(
            id="naming-workflow",
            heading="The full algorithm, run once, with the standard errors",
            body=(
                "Assembled, alkene naming is a five-step "
                "checklist, and running it once on a hairy "
                "example fixes the order. Name "
                "CH3-CH=C(CH3)-CH(CH3)-CH2-CH3 with the methyls "
                "arranged so the CIP winners sit on opposite "
                "sides. Step one, parent: the longest chain "
                "CONTAINING the double bond is six carbons - "
                "hexene. Step two, number from the end nearest "
                "the double bond: locant 2, hex-2-ene. Step "
                "three, substituents: methyls at 3 and 4 - "
                "3,4-dimethylhex-2-ene. Step four, geometry: C2 "
                "carries methyl versus hydrogen (methyl wins); "
                "C3 carries methyl versus the C4 branch "
                "(sec-butyl-like, first sphere (C,C,H) beats "
                "methyl's (H,H,H)) - winners on opposite sides "
                "means E. Step five, assemble with locants and "
                "descriptors: (E)-3,4-dimethylhex-2-ene.\n\n"
                "The recurring errors are worth naming because "
                "each attaches to one step. Choosing the "
                "longest chain outright, ignoring whether it "
                "contains the double bond, breaks step one - "
                "the unsaturated chain outranks a longer "
                "saturated one. Numbering to favour "
                "substituents over the double bond breaks step "
                "two - the -ene locant wins that contest. "
                "Forgetting that the geometry descriptor is "
                "PART of the name breaks step four: "
                "3,4-dimethylhex-2-ene without its (E) names "
                "two compounds, and stereochemistry-blind "
                "answers are graded wrong wherever geometry "
                "is determinable. And assigning E/Z by chain "
                "shape rather than priorities re-imports the "
                "cis/trans confusion the previous section "
                "buried. Five steps, four traps, one worked "
                "template - the entire skill fits on an "
                "index card, and writing that card is a "
                "better hour of study than rereading any "
                "chapter."
            ),
        ),
        ReadingSection(
            id="names-in-the-wild",
            heading="Names in the wild: industry, history, and the literature",
            body=(
                "Systematic names share the world with older "
                "ones, and reading chemistry fluently means "
                "handling both. Industry speaks the trivial "
                "dialect almost exclusively: ethylene and "
                "propylene (not ethene and propene) anchor "
                "the polymer economy's vocabulary - "
                "polyethylene, polypropylene - and isobutylene, "
                "butadiene and isoprene head the C4-C5 "
                "commodity lists; regulatory and safety "
                "documents follow suit. The older literature "
                "adds its own layer, with 'olefin' for the "
                "whole class and geometric labels predating "
                "CIP. Even IUPAC's own recommendations have "
                "layers: older style placed the locant before "
                "the parent (2-butene), the current "
                "recommendation embeds it before the suffix "
                "(but-2-ene), and both forms are legible in "
                "print today. None of this is an argument "
                "against systematic naming - it is the reason "
                "FOR it: the systematic name is the one form "
                "every reader can decode without a glossary, "
                "and the one this course grades.\n\n"
                "The practical skill is bidirectional "
                "translation. Seeing 'isoprene' in a "
                "biochemistry text and writing "
                "2-methylbuta-1,3-diene; seeing "
                "(Z)-octadec-9-enoic acid on a label and "
                "recognising oleic acid, the cis fat of olive "
                "oil, whose E isomer - elaidic acid - is the "
                "archetypal trans fat of partial "
                "hydrogenation. That last pair is also the "
                "section's medical payload: cis versus trans "
                "in a fatty acid's name predicts its shape "
                "(kinked versus straight), its packing "
                "(liquid versus solid), and its cardiovascular "
                "reputation, so the single letter in a lipid's "
                "name carries clinical content. Nomenclature "
                "is never just clerical in this course; the "
                "letters are compressed structure, and "
                "structure is destiny."
            ),
        ),
        ReadingSection(
            id="nomen-problem-set",
            heading="A naming problem set, both directions",
            body=(
                "Five drills, worked. One, structure to name: "
                "CH2=CH-CH2-CH2-CH3 - double bond at the end of "
                "a five-carbon chain: pent-1-ene, no geometry "
                "descriptor possible (C1 carries two "
                "hydrogens). Two: a cyclopentene with a methyl "
                "on the carbon adjacent to the double bond - "
                "number the sp2 carbons 1 and 2, walk toward "
                "the methyl: 3-methylcyclopentene, geometry "
                "unnamed because a five-membered ring permits "
                "only cis. Three, name to structure: "
                "(Z)-3-methylpent-2-ene - five-carbon chain, "
                "double bond 2-3, methyl on 3; on C2 methyl "
                "beats hydrogen, on C3 ethyl beats methyl, and "
                "Z puts methyl (C2) and ethyl (C3) on the same "
                "side. Four, the eligibility check: why does "
                "2-methylbut-2-ene carry no E/Z label? Its C2 "
                "carries two methyls - identical groups on one "
                "sp2 carbon erase the distinction, however "
                "substituted the other end is. Five, the "
                "integrator: name the isoprene unit - "
                "2-methylbuta-1,3-diene - and say which of its "
                "double bonds could in principle bear a "
                "descriptor. Only the 1,2-bond's far carbon... "
                "carries two hydrogens, and C3-C4 likewise "
                "ends in =CH2: neither bond is stereogenic, so "
                "the name needs no letters at all.\n\n"
                "The five templates - terminal alkene, "
                "substituted ring, descriptor decoding, "
                "eligibility audit, polyene integration - "
                "cover the naming questions this course and "
                "the MCAT actually ask. Speed comes from "
                "running the same checklist every time, not "
                "from shortcuts: the checklist IS the "
                "shortcut, once it runs without thought."
            ),
        ),
        ReadingSection(
            id="geometry-descriptors-in-medicine",
            heading="One letter, different molecule: E/Z in medicine and materials",
            body=(
                "The why-geometry-matters section argued the "
                "letter is chemistry; three canonical cases show "
                "how much rides on it in practice. Tamoxifen, a "
                "mainstay of estrogen-receptor-positive breast "
                "cancer therapy, is dosed as the Z isomer of a "
                "tetrasubstituted alkene: the drug's fit in the "
                "estrogen receptor depends on which side of the "
                "rigid double bond its aminoether arm occupies, "
                "and the E isomer's arm points the other way, "
                "with markedly different receptor behaviour. The "
                "letter in the name is, functionally, the "
                "pharmacology. Materials tell the same story at "
                "polymer scale: natural rubber is "
                "cis-1,4-polyisoprene, its all-Z backbone kinked "
                "into the coils that make it elastic, while "
                "gutta-percha - the same atoms, the same "
                "connectivity, the trans backbone - packs "
                "straight and hard, historically the material "
                "of golf-ball covers and root-canal fillings. "
                "One descriptor, elastomer versus thermoplastic.\n\n"
                "And the lipid case from the previous section "
                "completes the trio: the cis kink of oleic acid "
                "versus the straight trans chain of elaidic "
                "acid is why partially hydrogenated oils, whose "
                "processing isomerises some cis bonds to trans, "
                "acquired both their shelf stability and their "
                "cardiovascular notoriety. For the MCAT, the "
                "transferable claim is that geometric "
                "isomerism is not a naming subtlety but a "
                "shape declaration, and shape is what "
                "receptors, membranes and crystal lattices "
                "read. Any question pairing an E/Z pair with "
                "a biological difference is answered by "
                "drawing both shapes and asking what changed "
                "geometrically - the letters merely index the "
                "drawings."
            ),
        ),
        ReadingSection(
            id="numbering-contests",
            heading="When priorities collide: the full numbering hierarchy",
            body=(
                "Real molecules stack several numbering claims "
                "at once, and the tie-breaking order is worth "
                "stating as a hierarchy because exams "
                "manufacture collisions deliberately. First "
                "claim: the principal characteristic group - "
                "for now, none, but alcohols and acids will "
                "outrank everything when they arrive. Second: "
                "unsaturation - the parent chain must include "
                "the maximum number of double bonds, and "
                "numbering gives the double-bond locant set its "
                "lowest values, BEFORE any substituent is "
                "consulted. Third: substituent locants, lowest "
                "set at first difference. Fourth, only as a "
                "final tie-break: alphabetical order of "
                "substituent names decides which gets the "
                "lower number. So in a chain where numbering "
                "from the left gives the double bond locant 2 "
                "with a methyl at 5, and from the right gives "
                "the double bond 4 with the methyl at 2, the "
                "left wins - the ene locant outranks the "
                "substituent - even though the substituent "
                "number worsens.\n\n"
                "Ring-versus-chain contests follow their own "
                "convention at this course's level: when a "
                "ring and a chain compete to be the parent, "
                "prefer the unit carrying the double bond, "
                "and where both could, the greater number of "
                "skeletal atoms decides. "
                "Methylenecyclohexane against "
                "1-methylcyclohexene is the classic pairing: "
                "the first has an exocyclic double bond (the "
                "ring is the parent, the =CH2 a substituent), "
                "the second endocyclic, and they are "
                "different compounds with different names, "
                "different stabilities, and different "
                "hydrogenation products. Keeping the "
                "hierarchy explicit - group, ene, "
                "substituents, alphabet - turns every "
                "numbering dispute into a lookup rather than "
                "a judgement call, which is exactly what a "
                "convention is for."
            ),
        ),
        ReadingSection(
            id="reading-properties-from-names",
            heading="Reading chemistry straight off a name",
            body=(
                "The chapter closes where nomenclature earns "
                "its rent: a well-formed alkene name is a "
                "compressed property sheet, and practised "
                "readers decompress it without drawing. Take "
                "(2E,4E)-3-methylhexa-2,4-diene. The locants "
                "2,4 announce conjugation - expect the "
                "stability bonus and the red-shifted UV of the "
                "bonding lesson. The substitution census reads "
                "off the name: C2 bears methyl and H... C3 "
                "bears the extra methyl, making the 2,3-bond "
                "trisubstituted - expect it to dominate "
                "electrophile reactivity. The double E "
                "declares an all-extended zigzag shape - "
                "expect the higher-melting, better-packing "
                "isomer of the four geometric possibilities. "
                "Three predictions, zero drawings, perhaps "
                "fifteen seconds - and each prediction is "
                "checkable against the data tables the "
                "surrounding lessons carry.\n\n"
                "That decompression skill is the real "
                "deliverable of nomenclature study, and it "
                "reverses too: given target properties, a "
                "chemist can specify the name of the molecule "
                "that should show them, which is how "
                "structure-activity conversations in "
                "medicinal chemistry actually run. The exam "
                "form of the skill is humbler but identical - "
                "questions that seem to require drawing four "
                "isomers often yield to reading the four "
                "names' locants and letters directly. Train "
                "on every name this course presents: "
                "decompress it, predict something, verify. "
                "Names learned that way stop being labels "
                "and become the fastest analytical "
                "instrument you own - no spectrometer "
                "required, and always available in the exam "
                "room. The stability lesson that follows "
                "supplies the numbers behind the predictions "
                "this section made by eye: heats of "
                "hydrogenation that price each substitution "
                "level and each geometry, converting the "
                "name-reading habit from qualitative instinct "
                "into quantitative, table-checked forecasting - "
                "the standard this course holds every instinct "
                "to, sooner or later, because an instinct that "
                "has survived a table of measurements is the "
                "only kind an exam or a laboratory can safely "
                "run on, and building that kind is what these "
                "chapters are for."
            ),
        ),
    ),
    key_takeaways=(
        "Parent chain must contain the C=C; number from the end nearer the double bond; the locant is the bond's first carbon.",
        "CIP priority: higher atomic number at the first point of difference, branch lists compared lexicographically, multiple bonds counted as duplicated atoms.",
        "Z = higher priorities together, E = opposite. Assign per carbon, then compare sides.",
        "Cis/trans is informal and can disagree with Z/E when halogens or heteroatoms sit on the double bond - rank, don't eyeball.",
        "The same CIP rules return in chapter 6 for R/S; mastering them here is prepaid work.",
    ),
    exam_tips=(
        "When an exam alkene carries a halogen on the double bond, expect the cis-looking drawing to be E (or vice versa) - the question is testing priorities against appearance.",
        "Vinylic vs allylic position questions are one-bond-away questions: on the sp2 carbon = vinylic, adjacent to it = allylic.",
    ),
))


# --------------------------------------------------------------------------
# 4.3 Alkene stability
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.ALKENESTABILITY",
    lead=(
        "Isomeric alkenes are not equally stable, and the differences are "
        "measured, not asserted: burn them or hydrogenate them and the "
        "heat released ranks them directly. The ranking follows one rule "
        "- more alkyl substituents on the double bond, more stable - with "
        "trans beating cis as the second-order correction. This lesson "
        "builds the evidence, the electronic explanation, and the habit "
        "of using stability rankings to predict products, which is what "
        "chapter 9's eliminations and half of Organic II quietly assume."
    ),
    sections=(
        ReadingSection(
            id="hydrogenation-evidence",
            figure=Figure(
                stem="org1-alkene-stability",
                caption=(
                    "Heats of hydrogenation from the lesson's table: the less heat released to the common alkane, the more stable the alkene started."
                ),
                alt="Bar chart of hydrogenation enthalpies from ethylene down to 2,3-dimethyl-2-butene.",
            ),
            heading="Heats of hydrogenation: the measurement",
            body=(
                "Add H2 across a double bond and heat comes out; the "
                "amount is the heat of hydrogenation. Isomeric butenes "
                "all hydrogenate to the same butane, so - exactly as "
                "with the combustion ruler of chapter 2 - the isomer "
                "releasing the LEAST heat started lowest and is most "
                "stable. The numbers arrange themselves cleanly: "
                "1-butene releases about 127 kJ/mol, cis-2-butene "
                "about 120, trans-2-butene about 116. Reading "
                "differences: the disubstituted internal alkenes beat "
                "the monosubstituted terminal one by 7-11 kJ/mol, and "
                "trans beats cis by roughly 4. Extend the series with "
                "more substituted examples - 2-methyl-2-butene "
                "(trisubstituted) near 113, 2,3-dimethyl-2-butene "
                "(tetrasubstituted) near 111 - and the monotonic rule "
                "emerges: stability climbs with substitution, "
                "tetra > tri > di > mono > ethylene itself "
                "(137 kJ/mol).\n\n"
                "The same ordering appears in equilibrium data: "
                "expose 1-butene to a catalyst that permits "
                "isomerisation and the mixture drifts toward the "
                "internal, mostly trans, alkenes. Two independent "
                "measurements, one ranking - which is what earns the "
                "rule its load-bearing role. Quantitatively, a stability gap of $\\Delta E$ kJ/mol sets an equilibrium ratio near $K \\approx 10^{\\Delta E / 5.7}$ at 298 K - the 4 kJ/mol trans/cis gap becomes the measured 76:24 butene mixture through exactly this arithmetic."
            ),
            table=Table(
                caption="Heats of hydrogenation of representative alkenes (gas phase, to the corresponding alkane)",
                columns=("Alkene", "Substitution", "-delta-H_hyd (kJ/mol)"),
                rows=(
                    ("ethylene", "unsubstituted", "137"),
                    ("1-butene", "mono", "127"),
                    ("cis-2-butene", "di (cis)", "120"),
                    ("trans-2-butene", "di (trans)", "116"),
                    ("2-methyl-2-butene", "tri", "113"),
                    ("2,3-dimethyl-2-butene", "tetra", "111"),
                ),
                source="Standard gas-phase hydrogenation enthalpies as compiled in the NIST WebBook and standard physical organic references (values rounded to whole kJ/mol)",
                note="Smaller heat released = more stable alkene, because all C4 isomers converge on the same butane.",
            ),
        ),
        ReadingSection(
            id="why-substitution-stabilises",
            figure=Figure(
                stem="org1-substitution-ladder",
                caption=(
                    "The substitution ladder in structures, mono through tetra: each added alkyl group is another hyperconjugative donor."
                ),
                alt="Grid of alkenes from ethylene to 2,3-dimethyl-2-butene labeled by substitution class.",
            ),
            heading="Why alkyl groups stabilise a double bond",
            body=(
                "Two electronic accounts, both pointing the same way. "
                "Hyperconjugation: filled C-H sigma orbitals on the "
                "alkyl carbons adjacent to the double bond overlap "
                "with the pi system's antibonding orbital, a small "
                "stabilising donation available once per adjacent "
                "alkyl group - more substituents, more such "
                "interactions. Bond-strength bookkeeping: an sp2-sp3 "
                "carbon-carbon bond is a little stronger than an "
                "sp3-sp3 bond because the sp2 orbital's greater s "
                "character holds electrons closer to the nucleus, and "
                "more substituted alkenes contain more of the "
                "stronger kind. Neither effect is large alone; "
                "together they reproduce the 5-10 kJ/mol steps the "
                "hydrogenation table records.\n\n"
                "The cis/trans gap has a simpler, mechanical origin: "
                "cis places its two alkyl groups on the same side of "
                "a rigid planar frame, close enough to crowd - the "
                "same steric strain butane's gauche conformation "
                "displayed, now locked in place with no rotation to "
                "relieve it. Roughly 4 kJ/mol for methyl against "
                "methyl, growing sharply with bulkier groups: "
                "cis-di-tert-butylethylene is strained enough that "
                "its trans isomer is favoured by more than 40 "
                "kJ/mol. Same physics as chapter 2, new venue."
            ),
        ),
        ReadingSection(
            id="stability-predicts-products",
            heading="From ranking to prediction: Zaitsev's rule ahead",
            body=(
                "Stability rankings earn their keep by predicting "
                "outcomes. When a reaction can form several isomeric "
                "alkenes and is either reversible or product-like at "
                "its transition state, the more substituted alkene "
                "dominates - that is Zaitsev's rule, stated here a "
                "chapter early because this is where its logic lives. "
                "Eliminations in chapter 9 will offer a choice of "
                "which hydrogen to remove; removing the one that "
                "yields the more substituted double bond gives the "
                "major product in the standard cases, and the "
                "exceptions (bulky bases, certain leaving groups) "
                "are flagged precisely as departures from this "
                "baseline.\n\n"
                "The reasoning template generalises beyond alkenes "
                "and is worth naming: measure or recall the "
                "stability order, ask whether the mechanism lets "
                "products equilibrate or lets stability shape the "
                "transition state, and only then predict. The first "
                "step without the second overpredicts - kinetically "
                "controlled reactions can and do trap less stable "
                "products, which is the entire subject of the "
                "kinetic-versus-thermodynamic lesson two sections "
                "ahead. Stability is a map of where the valleys "
                "are; the mechanism decides whether the reaction "
                "reads the map."
            ),
        ),
        ReadingSection(
            id="rings-and-arithmetic",
            heading="Rings, Bredt's rule, and turning kilojoules into ratios",
            body=(
                "Rings put geometry constraints on the stability "
                "story. Small and common rings accommodate only "
                "the cis double bond: cyclohexene's alkene is "
                "necessarily cis, and a trans-cyclohexene is too "
                "strained to isolate. The crossover arrives at "
                "eight carbons - trans-cyclooctene is isolable "
                "though still about 40 kJ/mol above its cis "
                "isomer, the inversion of the usual trans-beats-"
                "cis order being pure ring strain - and by large "
                "rings the acyclic preference reasserts itself. "
                "At ring fusions the constraint sharpens into "
                "Bredt's rule: a double bond cannot sit at the "
                "bridgehead of a small bicyclic system, because "
                "the geometry would force the pi system's p "
                "orbitals out of parallel - the same "
                "no-twist logic as the rotation barrier, applied "
                "by a rigid skeleton. These facts matter "
                "practically because eliminations in rings can "
                "only form alkenes geometry permits, and answer "
                "choices offering bridgehead or small-ring trans "
                "alkenes are eliminable on sight.\n\n"
                "The second extension converts energy differences "
                "into populations, closing the loop with chapter "
                "2's Boltzmann arithmetic and chapter 3's "
                "5.7-kJ/mol-per-factor-of-ten rule. The "
                "trans/cis-2-butene gap of about 4 kJ/mol "
                "corresponds to a factor of roughly five at room "
                "temperature: equilibrate the pair over an "
                "isomerisation catalyst and the mixture settles "
                "near 76 percent trans within the 2-butenes - a "
                "measured number the energy gap predicts almost "
                "exactly. The mono-to-disubstituted gap of 7-11 "
                "kJ/mol predicts internal alkenes outnumbering "
                "terminal ones by one to two orders of magnitude "
                "at equilibrium, which is why isomerising "
                "catalysts in industry walk terminal double "
                "bonds down the chain. The skill to retain: any "
                "stability difference in kJ/mol converts to an "
                "equilibrium ratio by dividing by 5.7 and "
                "raising ten to the result - stability tables "
                "and product ratios are the same information in "
                "two currencies."
                "\n\n"
                "Close with the reasoning order that makes "
                "ranking questions fast. First count substituents "
                "on the two sp2 carbons - that places a candidate "
                "on the mono/di/tri/tetra ladder and settles most "
                "comparisons outright. Second, within a "
                "substitution class, prefer trans over cis, and "
                "charge any cis pair of bulky groups extra. "
                "Third, for ring alkenes, check the geometry is "
                "even possible - no trans double bonds in rings "
                "smaller than eight, no bridgehead alkenes in "
                "small bicyclics - and strike impossible "
                "candidates rather than ranking them. Fourth, if "
                "the question supplies hydrogenation or "
                "combustion data, let the numbers override "
                "intuition: the compound releasing less heat to "
                "a COMMON product is more stable, full stop. "
                "Run the checklist in order and a five-way "
                "ranking becomes four quick eliminations - and "
                "it transfers unchanged to elimination-product "
                "predictions in chapter 9, where the same "
                "ladder decides which alkene the reaction "
                "prefers to make."
                " Two further calibration points anchor the "
                "scale's ends. Conjugation adds a stabilisation "
                "the substituent count misses: 1,3-butadiene sits "
                "notably below an isolated-diene estimate, a "
                "preview of the delocalisation bookkeeping Organic "
                "II makes quantitative, and a reminder to scan "
                "for adjacent pi systems before trusting a bare "
                "substituent count. And exocyclic double bonds - "
                "pi bonds from a ring carbon out to a chain - are "
                "generally less stable than their endocyclic "
                "isomers, which is why acid-catalysed "
                "isomerisations walk methylenecyclohexane to "
                "1-methylcyclohexene. Neither refinement "
                "overturns the ladder; both extend it, and "
                "advanced ranking questions are built exactly on "
                "these two extensions. Where an exam mixes them - a conjugated candidate against a tetrasubstituted one - conjugation generally wins, and saying why (delocalisation beats one more hyperconjugative donor) earns the reasoning credit. The safest expression of the whole lesson remains the data: quote the hydrogenation ladder, place the candidates on it, and let the measured numbers carry the argument wherever intuition feels contested. Numbers first, rationale second: that ordering is the lesson, and it is portable to every stability argument the course will ask you to make."
            ),
        ),
        ReadingSection(
            id="combustion-crosscheck",
            heading="A second instrument: heats of combustion agree",
            body=(
                "Good measurements come in pairs, and the "
                "stability ranking has an independent second "
                "witness. Burn isomeric alkenes completely and "
                "the heats of combustion rank them exactly as "
                "hydrogenation does: the more substituted "
                "isomer releases slightly less heat, because it "
                "started from a lower energy; the difference "
                "between isomers' combustion heats equals the "
                "difference between their hydrogenation heats "
                "within experimental error, as it must if both "
                "experiments measure the same energy gaps from "
                "different directions. Combustion is the older, "
                "cruder instrument - the numbers are two "
                "orders of magnitude larger, so the isomer "
                "differences ride on the tail of a huge total - "
                "which is precisely why hydrogenation became "
                "the field's preferred stability meter: "
                "comparing 115-127 kJ/mol releases resolves "
                "differences that comparing 2,700 kJ/mol "
                "releases blurs.\n\n"
                "The methodological lesson outlasts the "
                "alkenes. Whenever this course asserts a "
                "stability order, the assertion rests on some "
                "thermochemical cycle - two paths to the same "
                "product whose heat difference isolates the "
                "quantity claimed - and knowing the trick lets "
                "you audit claims instead of trusting them. "
                "It also flags the limits: hydrogenation "
                "compares isomers that hydrogenate to the SAME "
                "alkane, and comparing heats across different "
                "product alkanes without correction is the "
                "standard student misuse of the table. "
                "2-Methyl-2-butene and cis-2-butene cannot be "
                "ranked by raw hydrogenation heats - their "
                "products differ - and exam questions "
                "occasionally bait exactly that comparison. "
                "Same product, fair race; different products, "
                "different races, and only the checklist "
                "habit of asking 'hydrogenates to what?' "
                "catches the difference under time pressure."
            ),
        ),
        ReadingSection(
            id="hyperconjugation-mechanics",
            heading="Hyperconjugation, drawn properly",
            body=(
                "The bonding chapter previewed hyperconjugation "
                "as sigma electrons leaking into the pi system; "
                "this lesson's data deserves the sharper "
                "drawing. Take propene and focus on one methyl "
                "C-H bond lying parallel to the p orbitals of "
                "the double bond. That filled sigma orbital and "
                "the alkene's empty pi-star orbital are close "
                "in space and aligned; quantum mechanics mixes "
                "them, transferring a little sigma density into "
                "the pi framework and lowering the total "
                "energy. Rotate the methyl and successive C-H "
                "bonds take turns in the aligned position, so "
                "the stabilisation is continuous. Each "
                "additional alkyl substituent brings two or "
                "three more such aligned bonds - more donors "
                "into the same acceptor - and stability climbs "
                "roughly stepwise, matching the measured "
                "ladder from monosubstituted up through "
                "tetrasubstituted. The same drawing with the "
                "arrows reversed explains why alkyl "
                "substitution barely helps electron-RICH "
                "positions: hyperconjugative donation needs an "
                "acceptor orbital, which is why its grand "
                "payoff arrives at carbocations, whose empty p "
                "orbital is the best acceptor in the course.\n\n"
                "Two competing explanations circulate in "
                "textbooks - hyperconjugation and the "
                "stronger-bond argument, in which sp3-sp2 C-C "
                "bonds are stronger than sp3-sp3 - and the "
                "honest statement is that both contribute and "
                "the community has argued their proportions "
                "for decades. The course's working position: "
                "use hyperconjugation as the primary picture, "
                "because it generalises - to carbocations, to "
                "the anomeric effects of carbohydrate "
                "chemistry, to conformational preferences - "
                "while the bond-strength account stays local. "
                "A model chosen for reach, with its rival "
                "acknowledged: that is how the course intends "
                "every 'why' answer to be held."
            ),
        ),
        ReadingSection(
            id="strain-numbers",
            heading="Cis strain, quantified and generalised",
            body=(
                "The trans-beats-cis correction has a "
                "mechanical cause visible in a drawing: the "
                "cis isomer's two alkyl groups crowd the same "
                "side of the rigid double bond, close enough "
                "for their electron clouds to repel - the same "
                "A-1,3-type crowding chapter 2 met in gauche "
                "butane, now locked in place with no rotation "
                "to relieve it. The energy price is measured "
                "by the hydrogenation gap between cis- and "
                "trans-2-butene: about 4 kJ/mol, "
                "coincidentally near butane's gauche penalty, "
                "which makes the two numbers mutually "
                "reinforcing calibrations of one interaction "
                "type. Grow the substituents and the penalty "
                "grows faster than linearly: "
                "cis-di-tert-butylethylene pays a strain "
                "price several times larger, and the trans "
                "isomer's advantage widens accordingly. The "
                "generalisation to carry: steric strain "
                "scales with the cube-ish bulk of what "
                "collides, and rigid frameworks pay it in "
                "full because nothing can rotate away.\n\n"
                "The strain ledger also predicts reactivity, "
                "not just stability: a strained alkene "
                "hydrogenates faster and binds catalysts more "
                "eagerly, because reaction relieves the "
                "strain - the energy stored in crowding is "
                "returned as extra driving force. That "
                "inversion - the LESS stable isomer being "
                "MORE reactive - is general across the "
                "course, from strained rings springing open "
                "to crowded esters hydrolysing fast, and it "
                "is the first clean example of a rule worth "
                "framing: stability and reactivity are the "
                "same energy axis read in opposite "
                "directions. High ground flows downhill "
                "eagerly; the valley has nowhere to go. "
                "Exams test the inversion constantly by "
                "asking which isomer reacts fastest and "
                "rewarding the least stable one."
            ),
        ),
        ReadingSection(
            id="stability-problem-set",
            heading="Ranking drills: the stability checklist at work",
            body=(
                "Three drills make the ranking mechanical. "
                "First: order 1-pentene, cis-2-pentene, "
                "trans-2-pentene, 2-methyl-2-butene. Count "
                "substituents on each double bond - one, two, "
                "two, three - then break the tie with "
                "geometry: 2-methyl-2-butene (trisubstituted) "
                "most stable, then trans-2-pentene over "
                "cis-2-pentene, then 1-pentene. All four "
                "hydrogenate to pentane... except the last - "
                "2-methyl-2-butene gives 2-methylbutane - so "
                "a strict thermochemical comparison holds "
                "only among the first three, and the "
                "trisubstituted isomer's rank rests on the "
                "general substitution ladder instead: the "
                "drill embeds the same-product caveat where "
                "it belongs, in the reflexes. Second: which "
                "is more stable, methylenecyclohexane or "
                "1-methylcyclohexene? The exocyclic double "
                "bond is disubstituted, the endocyclic one "
                "trisubstituted: the endocyclic isomer wins, "
                "and acid-catalysed equilibration in fact "
                "converts the first into the second - a "
                "reaction chapter 9 will draw, predicted "
                "here by counting. Third: why is "
                "2,3-dimethyl-2-butene, tetrasubstituted and "
                "top of the ladder, nonetheless slower than "
                "expected in some additions? Because the "
                "same four methyls that stabilise the alkene "
                "crowd the approach path - stability logic "
                "and steric-access logic are separate "
                "audits, and mature answers run both.\n\n"
                "The drills' shared skeleton: count "
                "substituents, check geometry, verify the "
                "products match before quoting numbers, and "
                "keep sterics as a separate ledger. Four "
                "steps, every alkene-stability question this "
                "course or the MCAT owns."
            ),
        ),
        ReadingSection(
            id="thermo-vs-kinetic-products",
            heading="Stability rankings and the products that ignore them",
            body=(
                "A ranking of products is a prediction only "
                "when the reaction is allowed to consult it, "
                "and the distinction deserves installing "
                "before the elimination chapters weaponise "
                "it. Reactions under thermodynamic control - "
                "reversible conditions, long times, "
                "equilibration possible - deliver the most "
                "stable product in proportion to its "
                "stability: acid-catalysed alkene "
                "isomerisations drift toward the most "
                "substituted isomer exactly as the "
                "hydrogenation table predicts. Reactions "
                "under kinetic control - irreversible steps, "
                "low temperatures - deliver whichever product "
                "forms FASTEST, and the fastest path need "
                "not lead to the most stable product. The "
                "elimination chapters will meet both: "
                "Zaitsev products where the transition state "
                "resembles the alkene enough for stability "
                "to steer, and Hofmann products where a "
                "bulky base makes the road to the stable "
                "product too crowded to travel.\n\n"
                "The concept transfers far past alkenes - "
                "kinetic versus thermodynamic enolates, "
                "1,2- versus 1,4-addition to dienes, and "
                "half the selectivity stories of Organic II "
                "are this one distinction re-costumed - so "
                "the working questions to internalise now "
                "are two. Is this step reversible under the "
                "conditions given? If yes, rank stabilities "
                "and bet on the winner; if no, rank "
                "transition-state energies - barriers, not "
                "basins - and bet on the lowest. Every "
                "'predict the major product' question in "
                "the course is one of those two bets, and "
                "identifying WHICH bet the conditions "
                "demand is usually worth more marks than "
                "executing it."
            ),
        ),
        ReadingSection(
            id="stability-in-biology",
            heading="The stability ladder in fats, fuels, and cells",
            body=(
                "The substitution ladder is not laboratory "
                "trivia; biology and industry both climb it. "
                "The fatty acids of membranes and dietary "
                "fats are long-chain alkenes whose double "
                "bonds are almost uniformly cis and almost "
                "uniformly disubstituted - biology pays the "
                "cis strain premium deliberately, because "
                "the kink it buys keeps membranes fluid and "
                "oils liquid; the straighter, lower-energy "
                "trans isomers pack too well, which is the "
                "molecular reason partially hydrogenated "
                "fats are solid and the physiological "
                "reason they are unwelcome. Meanwhile the "
                "petrochemical industry runs the ladder in "
                "the opposite direction: catalytic "
                "processes deliberately isomerise terminal "
                "alkenes to internal ones or back depending "
                "on which the downstream chemistry wants, "
                "and the equilibrium compositions those "
                "processes reach are calculable directly "
                "from this lesson's energy gaps via the "
                "Boltzmann arithmetic the rings-and-"
                "arithmetic section introduced.\n\n"
                "Enzymes, finally, are the master players "
                "of kinetic-versus-thermodynamic control: a "
                "desaturase installs a cis double bond at "
                "one specific position because its active "
                "site permits only that transition state, "
                "stability rankings be damned - kinetic "
                "control embodied in protein. The general "
                "point for the MCAT and beyond: "
                "thermodynamic ladders say where systems "
                "would rest; catalysts and enzymes decide "
                "whether they are allowed to. Both "
                "vocabularies come from this chapter, and "
                "questions that look biochemical are often "
                "just this lesson wearing a membrane."
            ),
        ),
        ReadingSection(
            id="stability-history",
            heading="How the ladder was built: Kistiakowsky's calorimetry",
            body=(
                "The hydrogenation numbers this lesson leans "
                "on were measured in the 1930s by George "
                "Kistiakowsky and his Harvard group, whose "
                "precision calorimetry on gas-phase "
                "hydrogenations produced the data set every "
                "textbook since has reprinted: ethylene near "
                "137 kJ/mol, the butene isomers resolving "
                "cleanly by substitution and geometry, "
                "conjugated dienes releasing less than twice "
                "a lone double bond's worth. The apparatus "
                "mattered - reactions run over catalyst in a "
                "calorimeter sensitive enough that isomer "
                "differences of a few kJ/mol stood clear of "
                "the noise - and so did the design insight "
                "that hydrogenation, with its single clean "
                "product, isolates stability differences "
                "that combustion buries. The same campaign's "
                "benzene measurement, releasing far less "
                "heat than three isolated double bonds "
                "predicted, handed aromaticity its first "
                "hard number and set up the resonance-energy "
                "concept the aromatic chapters inherit.\n\n"
                "The history earns its paragraph for what "
                "it models. A qualitative intuition - 'more "
                "substituted alkenes seem more stable' - "
                "became chemistry only when an instrument "
                "made it a number with an error bar, and "
                "the number then predicted things the "
                "intuition never could: equilibrium ratios, "
                "isomerisation directions, resonance "
                "energies. That arc, intuition to "
                "instrument to prediction, is the entire "
                "epistemology of this course in miniature, "
                "and it is why every stability claim in "
                "these lessons arrives with a measurement "
                "attached. Claims without instruments are "
                "opinions; the ladder is not one."
            ),
        ),
        ReadingSection(
            id="hammond-preview",
            heading="Why product stability can steer a reaction: the Hammond idea",
            body=(
                "The stability-predicts-products claim hides a "
                "logical gap worth closing now: reactions are "
                "decided at transition states, not at products, "
                "so why should a product ranking predict "
                "anything? The bridge is the Hammond postulate, "
                "stated fully in the energy-diagram lesson but "
                "needed here in preview: a transition state "
                "resembles whichever species it is closest to "
                "in energy. For an endothermic step - climbing "
                "toward a high-energy intermediate or product - "
                "the transition state is late, product-like, "
                "and inherits the product's stability order: "
                "whatever stabilises the product stabilises "
                "the barrier's summit almost as much, and the "
                "stability ladder becomes a rate ladder. For "
                "a strongly exothermic step the transition "
                "state is early, reactant-like, and product "
                "stability barely registers in the rate.\n\n"
                "That single distinction schedules the whole "
                "course's selectivity stories. Eliminations "
                "form the alkene in the rate-determining "
                "region with product-like character - so "
                "Zaitsev's most-substituted-alkene rule works. "
                "Carbocation formation is endothermic - so "
                "the cation stability ladder of two lessons "
                "ahead controls Markovnikov regiochemistry. "
                "And radical halogenation's selectivity "
                "differences between chlorine and bromine, "
                "in chapter 5's territory, are the postulate "
                "run twice with different exothermicities. "
                "None of these need memorising separately "
                "once the bridge is in place: find the "
                "hard step, ask whether its summit is early "
                "or late, and consult the corresponding "
                "ladder. The postulate converts "
                "thermodynamic tables into kinetic "
                "predictions, which is precisely the "
                "promotion this lesson's data needed."
            ),
        ),
        ReadingSection(
            id="isomerisation-machinery",
            heading="How alkenes actually walk the ladder",
            body=(
                "Equilibrium orders mean nothing without a "
                "path, and alkene isomerisation has three "
                "standard ones, each a preview of later "
                "machinery. Acid catalysis: a proton adds to "
                "the double bond making a carbocation, "
                "rotation and re-deprotonation from a "
                "different carbon reposition the double bond, "
                "and repeated cycles let the population drift "
                "downhill to the most substituted isomer - "
                "the mechanism behind the "
                "methylenecyclohexane equilibration the "
                "problem set cited. Metal catalysis: the "
                "same hydrogenation catalysts that measure "
                "stability also scramble it, because alkene "
                "insertion into a metal-hydride and its "
                "reverse relocate the double bond; industrial "
                "isomerisations run on exactly this cycle. "
                "Radical pathways: a hydrogen abstraction "
                "alpha to the double bond makes an allylic "
                "radical delocalised over two positions, and "
                "re-abstraction can deposit the hydrogen at "
                "either end - the route by which frying oil "
                "slowly cis/trans isomerises at high "
                "temperature.\n\n"
                "Notice what all three routes share: none "
                "rotates the intact double bond. Each "
                "temporarily DEMOTES it - to a single bond "
                "in a cation, a metal complex, or a radical "
                "- rotates or repositions while demoted, and "
                "re-forms the pi bond elsewhere. That is the "
                "bonding lesson's 264 kJ/mol barrier "
                "respected in practice: chemistry never pays "
                "the rotation toll directly; it finds "
                "intermediates that abolish the toll booth. "
                "The pattern - intermediates as detours "
                "around forbidden motions - recurs from "
                "enolisation to enzyme catalysis, and "
                "recognising it here makes every later "
                "instance familiar."
            ),
        ),
        ReadingSection(
            id="measuring-equilibria",
            heading="Reading the ladder from equilibrium mixtures",
            body=(
                "Calorimetry is not the only way to weigh "
                "isomers; letting them equilibrate and "
                "counting the mixture does the same job with "
                "different instruments. Expose a butene feed "
                "to an isomerisation catalyst until the "
                "composition stops changing, analyse by gas "
                "chromatography or NMR, and the ratios ARE "
                "the free-energy differences: "
                "$\\Delta G^\\circ = -RT \\ln K$ converts "
                "each measured ratio into kJ/mol, and the "
                "answers agree with the hydrogenation gaps "
                "to within the small entropy corrections. "
                "Repeat the experiment at several "
                "temperatures and the van't Hoff analysis "
                "separates the enthalpy and entropy "
                "contributions - resolving, for instance, "
                "how much of trans-2-butene's advantage is "
                "energetic and how much is the statistics "
                "of its rotational states. Three independent "
                "instruments - calorimeter, equilibrium "
                "composition, temperature dependence - "
                "triangulating one ladder is the evidentiary "
                "standard this course keeps returning to.\n\n"
                "The equilibrium method also defines the "
                "ladder's practical reach: it works wherever "
                "a clean interconversion path exists and "
                "fails where none does, which is why some "
                "stability claims in chemistry rest on "
                "computation instead - no catalyst walks "
                "the path at reasonable temperature. When "
                "this course later quotes a stability "
                "difference, the silent question 'measured "
                "how?' has one of three answers - burned, "
                "hydrogenated, or equilibrated - and "
                "knowing which is being invoked tells you "
                "the error bars and the caveats without "
                "looking them up. Instruments first, "
                "rankings second: the order never "
                "reverses."
            ),
        ),
        ReadingSection(
            id="ladder-integration",
            heading="One ladder, four chapters: the integration",
            body=(
                "Close the lesson by placing its ladder in "
                "the course's architecture, because the next "
                "three lessons each borrow it. The HX "
                "addition lesson turns it around: adding "
                "H-X across an unsymmetrical alkene "
                "DESTROYS a double bond and creates a "
                "cation, and the question of which carbon "
                "takes the halogen is answered by a "
                "stability ladder again - the carbocation "
                "ladder, built by the same "
                "hyperconjugation arguments this lesson "
                "rehearsed, consulted through the Hammond "
                "bridge. The rearrangement lesson is the "
                "cation ladder expressing itself within a "
                "single molecule: hydride and methyl "
                "shifts run uphill-to-downhill on it. And "
                "chapter 9's eliminations read this "
                "lesson's alkene ladder directly, through "
                "Zaitsev's rule, to choose among possible "
                "products. One energetic idea - "
                "substituted carbons stabilise adjacent "
                "electron deficiency - prices all three "
                "ladders, which is why mastering it once "
                "here is cheaper than memorising it three "
                "times later.\n\n"
                "The checklist to carry forward has four "
                "lines. Count substituents on any double "
                "bond or cationic carbon in sight. Prefer "
                "trans to cis, and same-product "
                "comparisons to cross-product ones. Ask "
                "whether the deciding step consults "
                "products (late, endothermic) or "
                "reactants (early, exothermic). And keep "
                "the steric ledger separate from the "
                "stability ledger, because crowding "
                "changes access without changing energy "
                "rankings. Four lines, most of alkene "
                "chemistry - the rest of the chapter is "
                "applications.\n\n"
                "A final calibration on scale keeps the "
                "ladder honest. The rungs are small - a few "
                "kJ/mol between adjacent substitution levels, "
                "about 4 kJ/mol for trans over cis - which "
                "means room-temperature equilibria favour the "
                "winner by factors of two to five, not by "
                "thousands. Stability rankings predict "
                "MAJORITIES, not exclusivities: an equilibrated "
                "butene mixture still contains every isomer in "
                "measurable amounts, and product mixtures from "
                "Zaitsev-controlled eliminations still carry "
                "the minor alkene. Exam answers that say "
                "'major product' are calibrated to exactly "
                "this arithmetic, and answers that treat the "
                "minor isomer as impossible have overspent the "
                "ladder. Small numbers, real preferences, "
                "honest mixtures - that is what a few kJ/mol "
                "buys, and knowing the exchange rate is as "
                "important as knowing the direction. A ladder "
                "quoted with its exchange rate is a tool; "
                "quoted without one, it is a slogan, and this "
                "course does not deal in slogans - every "
                "preference it teaches comes with a size, a "
                "solvent or phase, and an instrument that "
                "measured it, and the stability ladder built "
                "in this lesson - counted, cross-checked, and "
                "priced - is the template for how every later "
                "ranking in the whole course must first earn its keep."
            ),
        ),
    ),
    key_takeaways=(
        "Heats of hydrogenation rank isomeric alkenes on a common product: less heat = more stable.",
        "Stability order: tetra > tri > di > mono-substituted, with trans above cis at each level.",
        "Causes: hyperconjugative sigma-to-pi* donation and stronger sp2-sp3 bonds; the cis penalty is locked steric strain.",
        "Zaitsev's rule is this ranking applied to elimination products - the more substituted alkene is the default major product.",
        "Stability predicts outcomes only when the mechanism lets it: thermodynamic maps need kinetic permission.",
    ),
    exam_tips=(
        "Rank-the-alkenes questions: count substituents on the double-bond carbons first, break ties with trans > cis - two steps, no exceptions at this level.",
        "If a hydrogenation-enthalpy comparison spans different product alkanes, the comparison is invalid - the shared-product requirement is the tested concept.",
    ),
))


# --------------------------------------------------------------------------
# 4.4 HX addition and Markovnikov's rule
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.HXADDITION",
    lead=(
        "Hydrogen halide addition is the course's first full mechanism: "
        "two steps, one intermediate, and a regiochemical rule with an "
        "electronic explanation. Everything the arrow notation practised "
        "in chapter 3 gets used - the pi bond as nucleophile, a "
        "carbocation as intermediate, a halide capture - and the "
        "Markovnikov outcome falls out of carbocation stability rather "
        "than memorisation. Learn this mechanism thoroughly; chapter 5 "
        "runs variations on it four times."
    ),
    sections=(
        ReadingSection(
            id="the-mechanism",
            heading="The two-step electrophilic addition mechanism",
            body=(
                "Step one is a proton transfer with an unusual base: "
                "the pi bond. The alkene's pi electrons - the highest, "
                "most exposed filled orbitals in the molecule - attack "
                "the proton of H-X, one arrow from the middle of the "
                "double bond to H, a second arrow from the H-X bond "
                "onto the halogen. The products are a halide ion and "
                "a carbocation: one of the former double-bond carbons "
                "now bears three groups and a positive charge, the "
                "other collected the new hydrogen. This step breaks a "
                "pi bond and forms a sigma bond to hydrogen, is "
                "strongly uphill, and is the slow, rate-determining "
                "step.\n\n"
                "Step two is chapter 3's association sentence: the "
                "halide's lone pair attacks the empty p orbital of "
                "the carbocation, one arrow, fast, downhill. Sum the "
                "steps and H and X have added across the double bond "
                "- an addition reaction, in the chapter's "
                "classification - with the alkene's two new sigma "
                "bonds paid for by the pi bond and the H-X bond. The "
                "experimental rate law backs the picture: rate "
                "depends on alkene and HX concentrations, and "
                "more-substituted alkenes react faster because they "
                "make more stable cations, exactly as a "
                "cation-forming slow step predicts. The measured rate law is $\\text{rate} = k[\\text{alkene}][\\text{HX}]$, first order in each partner, and the overall transformation is $C_3H_6 + \\text{HBr} \\rightarrow C_3H_7\\text{Br}$ - one molecule of each, nothing catalytic."
            ),
        ),
        ReadingSection(
            id="markovnikov",
            figure=Figure(
                stem="org1-markovnikov",
                caption=(
                    "Propene plus HBr, both regimes: the ionic path caps the secondary cation's carbon; peroxides flip the outcome through the radical chain."
                ),
                alt="Reaction scheme showing propene giving 2-bromopropane with HBr and 1-bromopropane with HBr and peroxides.",
            ),
            heading="Markovnikov's rule, said correctly",
            body=(
                "On an unsymmetrical alkene the proton has a choice "
                "of carbons, and the choice decides the product. "
                "Markovnikov's original phrasing - the hydrogen adds "
                "to the carbon that already has more hydrogens - is "
                "a correct summary and a useless explanation. The "
                "modern statement is mechanistic: the proton adds so "
                "as to form the MORE STABLE CARBOCATION. Protonate "
                "propene at the terminal CH2 and the charge lands on "
                "the secondary middle carbon; protonate the middle "
                "carbon instead and the charge would sit on a "
                "primary carbon, roughly 60-70 kJ/mol worse. The "
                "reaction funnels through the lower barrier to the "
                "secondary cation, chloride captures it, and "
                "2-chloropropane is the product - hydrogen on the "
                "hydrogen-rich carbon, exactly as the old rule "
                "says, for a reason the old rule never gave.\n\n"
                "Stating the rule through the cation pays off "
                "immediately: it predicts the regiochemistry of "
                "every cation-mediated addition in chapter 5 "
                "(hydration, halohydrins, oxymercuration), it "
                "predicts when the rule INVERTS (the radical HBr "
                "chapter, where the intermediate changes and the "
                "logic follows it), and it warns of rearrangements "
                "(next lessons) that the hydrogen-counting slogan "
                "cannot see coming. One sentence to memorise: "
                "protonation goes where the positive charge is best "
                "accommodated."
            ),
            important=(
                "State Markovnikov's rule as 'form the more stable "
                "carbocation', not as hydrogen-counting. The "
                "hydrogen-counting version fails silently on "
                "rearranging substrates and cannot explain the "
                "peroxide-HBr inversion."
            ),
        ),
        ReadingSection(
            id="regiochemistry-practice",
            figure=Figure(
                stem="org1-cation-ladder",
                caption=(
                    "The working procedure's ruler: draw both cations, place them on this ladder, commit the proton to the better one."
                ),
                alt="Carbocation stability bar chart used as the regiochemistry decision ruler.",
            ),
            heading="Reading regiochemistry from structure",
            body=(
                "The working procedure for any HX addition: draw both "
                "possible cations, rank them (tertiary > secondary > "
                "primary, resonance-stabilised beating all three - "
                "next lesson's business), commit the proton to the "
                "path making the better one, and only then attach "
                "the halide. On 2-methyl-2-butene, protonation at "
                "C3 gives a tertiary cation at C2; on styrene-like "
                "substrates, protonation at the terminal carbon "
                "gives a benzylic, resonance-stabilised cation - in "
                "both cases the halide lands on the more substituted "
                "or stabilised carbon. Symmetric alkenes remove the "
                "choice, and 2-butene gives a single product from "
                "either protonation.\n\n"
                "Two boundary notes complete the picture. "
                "Stereochemistry: the cation is flat, its faces "
                "equivalent, so capture occurs from both sides and "
                "any new stereocentre forms as a racemic mixture - "
                "a fact chapter 6 will make precise. And scope: HCl, "
                "HBr and HI all add this way; HBr alone can be "
                "diverted onto a radical path by peroxides, a "
                "reactivity fork flagged here and resolved in "
                "chapter 5. Filing the fork now prevents the "
                "commonest cross-contamination error - applying "
                "peroxide logic to HCl, which stays Markovnikov "
                "regardless."
            ),
        ),
        ReadingSection(
            id="worked-substrates",
            heading="Three worked substrates, and the evidence file",
            body=(
                "Propene plus HBr: protonation at C1 puts the "
                "charge on secondary C2; protonation at C2 would "
                "strand it on primary C1. The secondary cation "
                "wins, bromide caps C2, product 2-bromopropane - "
                "the baseline case. 2-Methyl-2-butene plus HCl: "
                "protonating C3 gives a TERTIARY cation at C2 "
                "while the alternative is secondary at C3; the "
                "tertiary path dominates overwhelmingly and "
                "2-chloro-2-methylbutane results - larger "
                "stability gap, cleaner selectivity, which is the "
                "general pattern: selectivity tracks the SIZE of "
                "the cation-stability difference. Styrene plus "
                "HBr: protonation at the terminal carbon parks "
                "the charge on the benzylic carbon, where the "
                "ring delocalises it; the product is "
                "(1-bromoethyl)benzene, and the example widens "
                "Markovnikov beyond substitution counting - "
                "resonance outranks alkyl substitution on the "
                "cation ladder, so the rule tracks TOTAL "
                "stabilisation, not hydrogen counts.\n\n"
                "The evidence file for the mechanism is worth "
                "one paragraph because exams increasingly ask "
                "'how do we know'. The rate law is first order "
                "in alkene and in HX, consistent with both "
                "meeting in or before the slow step. Rates "
                "climb steeply with alkene substitution - "
                "ethylene reacts sluggishly, trisubstituted "
                "alkenes rapidly - tracking cation stability "
                "exactly as a cation-forming rate-determining "
                "step demands. Rearranged products (next "
                "lesson) betray a genuinely free cation "
                "intermediate, and adding an external "
                "nucleophile diverts some product to its "
                "capture, proving something interceptable "
                "exists between the steps. Four independent "
                "observations, one mechanism accommodating "
                "all of them - the template for every "
                "mechanism-evidence argument the course will "
                "make."
                "\n\n"
                "A final calibration on selectivity and its "
                "limits. The regiochemical choice is a "
                "competition between two transition states, so "
                "the product ratio reflects their energy GAP, "
                "not the absolute class labels - and temperature "
                "flattens selectivity modestly through the "
                "Boltzmann exponent. On exams, treat 'sole "
                "product' language with suspicion and 'major "
                "product' as the honest claim; in mechanisms, be "
                "ready to draw the minor pathway when asked why "
                "a trace byproduct exists. The mature statement "
                "of Markovnikov's rule carries its own error "
                "bars, and questions at the top of the "
                "difficulty range test exactly that maturity."
                " One practical corollary closes the lesson: "
                "because protonation is reversible in principle, "
                "traces of acid can isomerise alkenes even when "
                "no net addition survives - protonate, rotate or "
                "shift, deprotonate the other way - and "
                "long-stored or acid-exposed alkene samples "
                "drift toward their thermodynamic isomer "
                "mixture. The same three-step logic that "
                "explains the addition product thus also "
                "explains why a bottle labelled 1-butene can "
                "quietly become 2-butene, and reading both "
                "phenomena from one mechanism is exactly the "
                "economy mechanisms exist to provide. It also supplies the practical rule for storeroom and exam alike: alkene identity is only trustworthy under acid-free conditions, and any stem mentioning trace acid plus time has quietly granted permission to equilibrate - read such questions as thermodynamic control in disguise, and answer with the most stable accessible alkene rather than the drawn starting isomer. Selectivity, reversibility, and the size of the stability gap: keep the three dials separate when reading any addition question, because each is tested on its own and difficult items deliberately turn two at once - naming which dials a stem has turned is most of the answer. Practise saying the dial settings aloud before choosing an option and the habit becomes automatic within a problem set or two, at which point these questions become the reliable points they were always meant to be."
            ),
        ),
    ),
    key_takeaways=(
        "Mechanism: slow protonation of the pi bond to the better carbocation, fast halide capture - two steps, one intermediate.",
        "Markovnikov's rule = protonate to form the more stable cation; the hydrogen-counting slogan is a consequence, not the reason.",
        "More substituted alkenes react faster (better cations), and the halide lands on the more substituted carbon.",
        "Planar cations are captured from both faces: new stereocentres arrive racemic.",
        "Only HBr with peroxides deviates (radical path, chapter 5); HCl and HI have no such fork.",
    ),
    exam_tips=(
        "Regiochemistry questions are cation-ranking questions: draw both cations explicitly rather than counting hydrogens - it also catches the rearrangement traps.",
        "A product with the halogen on the less substituted carbon signals radical HBr conditions - scan the question for the word peroxide.",
    ),
))


# --------------------------------------------------------------------------
# 4.5 Carbocations
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.CARBOCATION",
    lead=(
        "The carbocation is the most important reactive intermediate in "
        "the first year of organic chemistry: it stands at the centre of "
        "HX addition, acid-catalysed hydration, SN1 substitution, E1 "
        "elimination and half the rearrangement chemistry in between. One "
        "structural picture - a flat, sp2, six-electron carbon with an "
        "empty p orbital - plus one stability ladder explains all of it. "
        "This lesson builds both and shows the three things every "
        "carbocation can do next."
    ),
    sections=(
        ReadingSection(
            id="structure",
            heading="Structure: flat, sp2, six electrons",
            body=(
                "A carbocation's central carbon bonds to three groups "
                "and holds six valence electrons - two short of an "
                "octet. It hybridises sp2: three sigma bonds at 120 "
                "degrees in a plane, and the unhybridised p orbital "
                "empty, perpendicular to the plane, lobed above and "
                "below. That empty orbital is the whole personality "
                "of the species. It is the Lewis-acid vacancy that "
                "nucleophiles attack (chapter 3's one-arrow "
                "association), it is the acceptor that neighbouring "
                "bonds donate into (the stabilisation story below), "
                "and its two equal lobes are why capture happens "
                "from either face with equal ease - the structural "
                "root of racemisation at cation centres.\n\n"
                "Flatness is worth dwelling on because it carries "
                "predictions. A cation forced to be nonplanar is "
                "destabilised: bridgehead carbons of small bicyclic "
                "systems, pinned pyramidal by the ring frame, "
                "essentially refuse to form cations, and reactions "
                "that need one simply do not go there. Where "
                "geometry permits planarity, the cation forms, "
                "flattens, and forgets which face its leaving group "
                "departed from - a memory loss that chapter 9's SN1 "
                "stereochemistry measures directly."
            ),
        ),
        ReadingSection(
            id="stability-ladder",
            figure=Figure(
                stem="org1-cation-ladder",
                caption=(
                    "The carbocation ladder with the lesson's approximate gas-phase spacing: each rung is worth roughly 60-70 kJ/mol."
                ),
                alt="Bar chart of relative carbocation energies from methyl to tertiary.",
            ),
            heading="The stability ladder and its two rungs of reasons",
            body=(
                "The operational order: tertiary > secondary > "
                "primary > methyl, each step worth very roughly "
                "60-70 kJ/mol in the gas phase - enormous gaps by "
                "the standards of this course, which is why cation "
                "stability so often single-handedly decides a "
                "reaction's outcome. Through the Hammond relation the ladder converts to rates: competing paths differ by $\\text{ratio} = e^{-\\Delta\\Delta G^{\\ddagger}/RT}$, so a 10 kJ/mol gap between cation-like transition states buys better than 50:1 selectivity at room temperature. Two effects build the ladder. "
                "Hyperconjugation: each adjacent C-H or C-C sigma "
                "bond can lean its electron pair toward the empty p "
                "orbital, a partial donation that spreads the "
                "positive charge; more alkyl neighbours, more "
                "donating bonds. Induction: alkyl groups are "
                "polarisable electron donors relative to hydrogen, "
                "pushing density toward the electron-poor centre "
                "through the sigma framework. Both scale with "
                "substitution and they add.\n\n"
                "Above the whole alkyl ladder sit the "
                "resonance-stabilised cations: allylic (positive "
                "charge shared across two carbons by the adjacent "
                "pi bond) and benzylic (shared into a ring). "
                "Delocalisation beats hyperconjugation - a primary "
                "allylic cation competes with an ordinary secondary "
                "one - and heteroatom lone pairs are stronger "
                "still: an oxygen next to the empty orbital makes "
                "an oxocarbenium ion, the stabilised species that "
                "runs carbohydrate and acetal chemistry in Organic "
                "II. The full ranking to carry: resonance-stabilised "
                "> tertiary > secondary > primary > methyl, with "
                "vinyl and aryl cations off the bottom of the "
                "ladder entirely."
            ),
        ),
        ReadingSection(
            id="three-fates",
            figure=Figure(
                stem="org1-hydride-shift",
                caption=(
                    "The third fate drawn: rearrangement firing before capture whenever the ladder permits a climb."
                ),
                alt="Hydride-shift scheme illustrating the rearrangement fate of a carbocation.",
            ),
            heading="The three fates of a carbocation",
            body=(
                "Every carbocation, however formed, chooses among "
                "the same three continuations. Capture: a "
                "nucleophile - halide, water, alcohol, anything "
                "with a pair - attacks the empty orbital; this "
                "finishes HX addition and hydration, and it is the "
                "product-forming step of SN1. Deprotonation: a base "
                "removes a proton from a carbon ADJACENT to the "
                "charge, the departing bonding pair folds in to "
                "become a pi bond, and an alkene results; this is "
                "E1 elimination, and it is why cation-mediated "
                "reactions so often ship alkene side products. "
                "Rearrangement: a hydrogen or alkyl group on the "
                "adjacent carbon migrates with its bonding pair "
                "onto the empty orbital, relocating the charge - "
                "the subject of the next lesson.\n\n"
                "Which fate wins is bookkeeping you can reason "
                "through: strong nucleophile present in quantity "
                "favours capture; heat and weak nucleophiles tilt "
                "toward elimination; a rearrangement fires first "
                "whenever it upgrades the cation's stability class. "
                "Competitions among the three are not noise - they "
                "are the actual content of 'predict the products' "
                "questions from here through chapter 9, and "
                "students who list the three fates explicitly for "
                "every cation they draw stop being surprised by "
                "the answer keys."
            ),
            important=(
                "Vinylic and aryl cations - positive charge on an "
                "sp2 carbon of a double bond or ring - are "
                "prohibitively unstable at this level. A mechanism "
                "step that creates one is almost certainly the "
                "wrong answer choice."
            ),
        ),
        ReadingSection(
            id="cations-observed",
            heading="Cations observed, and cations at work in nature",
            body=(
                "Carbocations are not hypothetical bookkeeping "
                "devices; under the right conditions they are "
                "observable species. In superacid media - acids "
                "vastly stronger than sulfuric, paired with "
                "non-nucleophilic counterions and low "
                "temperatures - simple alkyl cations persist "
                "long enough to record their NMR spectra, work "
                "recognised with a Nobel Prize. The spectra "
                "confirm the model in detail: the cationic "
                "carbon's signal appears far downfield "
                "(electron-poor, as drawn), the tert-butyl "
                "cation shows its three equivalent methyls, and "
                "rearrangements can be watched in real time as "
                "signals interconvert. The species this course "
                "draws as fleeting intermediates are the same "
                "species chemists have bottled and measured - "
                "the difference between a mechanism and a "
                "fantasy is exactly this kind of independent "
                "observation.\n\n"
                "Biology runs cation chemistry on production "
                "scale. Terpene biosynthesis - the pathway to "
                "menthol, camphor, steroids and thousands of "
                "natural products - proceeds through enzyme-"
                "guided carbocation cascades: an allylic "
                "pyrophosphate ionises to an allylic cation, "
                "which cyclises onto nearby double bonds, "
                "hydride-shifts, and is finally quenched, with "
                "the enzyme's folded pocket steering "
                "intermediates that would rearrange chaotically "
                "in a flask toward single products. The "
                "epic case is squalene folding to the steroid "
                "skeleton: a polyene chain zipped into four "
                "rings through successive cation cyclisations "
                "and 1,2-shifts, each step obeying exactly the "
                "stability ladder and migration rules of these "
                "lessons. The MCAT connection is direct - "
                "biochemistry questions about terpene or "
                "steroid formation are carbocation questions "
                "wearing a pathway diagram - and the deeper "
                "point stands for the whole course: the rules "
                "learned on two-carbon examples are the rules "
                "nature scales up."
                "\n\n"
                "The observation story also disciplines how "
                "cations are drawn in ordinary mechanisms. In "
                "normal solvents the intermediates live for "
                "nanoseconds - long enough to choose among their "
                "three fates, far too short to accumulate - so "
                "concentration intuitions do not apply: a species "
                "can be present at vanishing concentration and "
                "still carry the entire product flux, because "
                "flux depends on formation rate, not standing "
                "population. That distinction defuses a common "
                "confusion when rate laws arrive in chapter 9: "
                "the cation is absent from the rate law not "
                "because it is unimportant but because it is "
                "consumed as fast as it forms - the steady-state "
                "idea, met here informally before kinetics "
                "formalises it. Draw cations confidently, expect "
                "them to be invisible in the flask, and let the "
                "products and the rate law testify to their "
                "passage."
                " The ladder also explains reagent design "
                "choices that otherwise look arbitrary: silver "
                "salts accelerate halide ionisation by pulling "
                "the halide into insoluble silver halide, "
                "non-nucleophilic counterions exist so cations "
                "can form without being instantly captured, and "
                "low temperatures extend cation lifetimes for "
                "study. Each trick manipulates one side of the "
                "formation-consumption balance, and recognising "
                "the trick in a question's conditions line is "
                "recognising which side the examiner wants "
                "manipulated. The same balance-sheet reading explains why polar protic solvents accelerate cation formation - they stabilise the forming charges - while polar aprotic solvents starve it, a solvent story chapter 9 expands into a full decision axis between the substitution mechanisms. File the solvent lever now: it costs one sentence here and repays a full lesson later, because every cation-forming reaction in the course responds to it identically - stabilise the charges being born and ionisation quickens; starve them and it stalls. One lever, learned once, read everywhere - the definition of a concept worth the space it takes."
            ),
        ),
    ),
    key_takeaways=(
        "Carbocations are flat sp2 centres with six electrons and an empty p orbital - attackable from both faces.",
        "Stability: resonance-stabilised > 3 > 2 > 1 > methyl, built from hyperconjugation plus induction; steps are huge (~60-70 kJ/mol).",
        "Allylic/benzylic delocalisation and adjacent heteroatom lone pairs outrank simple alkyl substitution.",
        "Every cation has three fates: nucleophilic capture, deprotonation to an alkene, or 1,2-rearrangement to a better cation.",
        "No vinylic or aryl cations in this course's mechanisms - geometry and orbital orientation forbid them.",
    ),
    exam_tips=(
        "Cation-ranking questions hide resonance: scan for an adjacent double bond, ring, or oxygen before applying the 3>2>1 ladder.",
        "For any mechanism with a cation intermediate, pre-list the three fates - MCAT distractors are usually the two fates the question didn't ask for.",
    ),
))


# --------------------------------------------------------------------------
# 4.6 Carbocation rearrangements
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.REARRANGEMENT",
    lead=(
        "Carbocations cheat. Given one bond's worth of opportunity, a "
        "cation will relocate its positive charge to a more comfortable "
        "carbon, and products appear with their skeletons quietly "
        "rewritten. Rearrangement is not an exotic side reaction - it is "
        "the predictable consequence of the stability ladder, it happens "
        "faster than capture when an upgrade is available, and every "
        "cation-forming reaction from HX addition to SN1 inherits it. "
        "This lesson teaches when shifts fire, which group moves, and "
        "how to spot a rearranged product on an exam."
    ),
    sections=(
        ReadingSection(
            id="the-shift",
            heading="The 1,2-shift: what actually moves",
            body=(
                "A rearrangement is a single elementary step: a group "
                "on the carbon ADJACENT to the cation - a hydride "
                "(H with its bonding pair) or an alkyl group (carbon "
                "with its bonding pair) - slides one position over "
                "into the empty p orbital. One arrow, drawn from the "
                "migrating bond to the electron-poor carbon. The "
                "charge and the group trade places: the old cation "
                "carbon gains a bond, the neighbour that donated "
                "loses one and becomes the new cation. The migration "
                "is strictly 1,2 - between directly bonded carbons - "
                "because the migrating pair never stops bonding; it "
                "slips along a three-centre transition state rather "
                "than dissociating. There are no 1,3-shifts in this "
                "course, and any answer choice showing a group "
                "leaping past a carbon is wrong on mechanism.\n\n"
                "Because the step is fast - often faster than "
                "diffusion brings a nucleophile - the rearranged "
                "cation is effectively the ONLY cation the "
                "nucleophile ever meets when an upgrade is "
                "available. That timing is why rearrangement cannot "
                "be ignored as a minor pathway: where the ladder "
                "permits a climb, the climb happens first and the "
                "products report only the final cation. Energetically the step is downhill bookkeeping: $\\Delta G_{\\text{shift}} \\approx G_{\\text{new}} - G_{\\text{old}}$, roughly $-65$ kJ/mol for a secondary-to-tertiary climb - far more than enough to outrun capture."
            ),
        ),
        ReadingSection(
            id="when-and-which",
            figure=Figure(
                stem="org1-cation-ladder",
                caption=(
                    "The ladder is the driving force: shifts fire only when they climb it."
                ),
                alt="Carbocation stability bar chart reused to show the upgrade rule.",
            ),
            heading="When shifts fire, and which group migrates",
            body=(
                "The driving question is always the ladder: a shift "
                "fires when it converts the cation to a MORE stable "
                "class - secondary to tertiary is the everyday case, "
                "primary to secondary or tertiary likewise wherever "
                "a primary cation would notionally appear. Shifts "
                "that would demote (tertiary to secondary) do not "
                "occur, and shifts between equals are invisible "
                "except to isotopic labels. The complete audit for "
                "any cation you draw: examine EACH adjacent carbon, "
                "ask what cation would result if one of its groups "
                "migrated, and compare classes. No upgrade "
                "available, no rearrangement - cations flanked only "
                "by CH2 and CH3 groups that cannot improve the "
                "charge simply proceed to capture.\n\n"
                "When both a hydride and an alkyl group could "
                "migrate, hydride generally wins - it is smaller "
                "and its bond aligns with the empty orbital more "
                "easily - unless only an alkyl shift achieves the "
                "upgrade. The special case worth knowing by name is "
                "ring expansion: a strained ring carbon migrates to "
                "relieve ring strain AND upgrade the cation at "
                "once, so a cyclobutyl-substituted cation balloons "
                "to a cyclopentyl cation with startling "
                "enthusiasm. Ring expansions are exam favourites "
                "precisely because the product skeleton looks "
                "unrelated to the starting material until the "
                "shift is drawn."
            ),
        ),
        ReadingSection(
            id="spotting-rearranged-products",
            figure=Figure(
                stem="org1-hydride-shift",
                caption=(
                    "The canonical rearrangement, drawn: 3-methyl-1-butene delivers the shifted tertiary chloride as major product."
                ),
                alt="Scheme of 3-methyl-1-butene with HCl giving rearranged 2-chloro-2-methylbutane and minor unrearranged product.",
            ),
            heading="Reading rearrangement in products, and its fingerprints",
            body=(
                "The classic demonstration: add HCl to "
                "3-methyl-1-butene. Markovnikov protonation gives a "
                "secondary cation at C2 - adjacent to a tertiary "
                "centre carrying a hydrogen. The hydride shifts, "
                "the charge upgrades to tertiary at C3, chloride "
                "captures there, and the major product is "
                "2-chloro-2-methylbutane: chlorine on a carbon "
                "that was never part of the double bond. The "
                "unrearranged secondary chloride appears only as a "
                "minor companion. The fingerprint generalises: "
                "whenever a product's functional group sits on a "
                "carbon the naive mechanism cannot reach, or a "
                "methyl group has apparently walked down the "
                "chain, or a ring has changed size, a cation "
                "rearrangement is the explanation the examiner "
                "wants named.\n\n"
                "Strategically, rearrangement is also a design "
                "constraint. Reactions that traverse free cations "
                "(HX addition, acid-catalysed hydration, SN1, E1) "
                "are unreliable on rearrangement-prone substrates, "
                "and the synthetic chapters respond by offering "
                "cation-free alternatives - chapter 5's "
                "oxymercuration and hydroboration exist "
                "substantially BECAUSE they deliver Markovnikov or "
                "anti-Markovnikov hydration without a free cation "
                "and therefore without skeletal surprises. Knowing "
                "which reagents rearrange is knowing which "
                "reagents to distrust, and that judgment is what "
                "the reagent-choice questions in the next chapter "
                "are actually testing."
            ),
            important=(
                "Audit every cation you ever draw: check each "
                "adjacent carbon for an available upgrade before "
                "letting the nucleophile in. The rearrangement "
                "step is faster than capture whenever the ladder "
                "permits a climb."
            ),
        ),
        ReadingSection(
            id="second-worked-case",
            heading="Ring expansion worked, and the no-upgrade audit",
            body=(
                "Walk the ring-expansion case slowly once. Take "
                "cyclobutylmethanol under hot acid, or any "
                "process placing a cation on the CH2 carbon "
                "attached to a cyclobutane. The primary-like "
                "cation is adjacent to the ring; one of the "
                "ring's C-C bonds migrates - the ring carbon "
                "slides over with its bonding pair - and two "
                "things improve at once: the charge relocates "
                "onto a ring carbon as a secondary cation, and "
                "the four-membered ring becomes five-membered, "
                "shedding most of its angle strain. The product "
                "cation is cyclopentyl; capture or elimination "
                "finishes from there, and the isolated product "
                "carries a ring one size larger than the "
                "starting material. On paper the transformation "
                "looks like sorcery; drawn as one migrating "
                "bond, it is a single legal step with a doubled "
                "payoff, which is why expansions from strained "
                "rings are so fast and so common in exam "
                "problems.\n\n"
                "Equally important is the disciplined negative "
                "case. Protonate 1-butene: the secondary cation "
                "at C2 has neighbours C1 (a methyl-less CH3 "
                "carbon) and C3 (a CH2). Shifting any hydride "
                "from either neighbour yields another secondary "
                "or a primary cation - no upgrade exists - so "
                "NO rearrangement occurs and the products are "
                "the plain Markovnikov set. Running this audit "
                "explicitly, and being willing to conclude "
                "'nothing shifts', is as much the skill as "
                "spotting the shifts that do fire: "
                "over-predicting rearrangement is the mirror "
                "error to missing it, and examiners plant both "
                "kinds of substrate. Isotope studies close the "
                "evidence file - deuterium-labelled substrates "
                "show the label relocated exactly as the "
                "hydride-shift arrows predict, and scrambling "
                "beyond that prediction is absent - so the "
                "1,2-shift is not a rationalisation after the "
                "fact but a mechanism with tracked atoms."
                "\n\n"
                "Keep one map of where rearrangements will matter "
                "ahead. In this chapter and the next: HX addition "
                "and acid-catalysed hydration on branched "
                "substrates. In chapter 9: SN1 and E1, which share "
                "the cation and therefore the shifts, against SN2 "
                "and E2, which have no intermediate and never "
                "rearrange - so shifted products become diagnostic "
                "evidence for which mechanism operated, a role "
                "rearrangement plays in lab problems as often as "
                "in synthesis. In Organic II the same 1,2-shift "
                "becomes a deliberate tool, with leaving group "
                "and migrating group choreographed on purpose. "
                "One elementary step, three roles - nuisance, "
                "diagnostic, tool - depending on whether the "
                "chemist fights it, reads it, or drives it."
                " A closing habit for products as well as "
                "mechanisms: when your predicted product "
                "disagrees with an answer key, redraw the "
                "cation and run the audit before assuming the "
                "key errs - in practice the missed shift "
                "accounts for most such disagreements, and "
                "finding it yourself is worth more than any "
                "number of memorised special cases. Treat every disagreement with a key as a rearrangement drill first and a dispute second; the habit converts errors into exactly the practice that prevents their recurrence. Rearrangement mastery is ultimately audit discipline - a fixed habit of inspection applied to every cation, every time, with no exceptions granted for seemingly simple substrates - and disciplined auditors simply stop losing points here. That is the entire secret: not more memory, just an inspection that never skips. Build it now, while the substrates are small, and it will hold at full synthetic scale."
            ),
        ),
    ),
    key_takeaways=(
        "Rearrangements are single-arrow 1,2-shifts of H or alkyl WITH the bonding pair into the adjacent empty orbital.",
        "They fire only uphill on the stability ladder (2 -> 3 the standard case) and are faster than nucleophilic capture.",
        "Hydride shifts beat alkyl shifts when both upgrade; ring expansion relieves strain and upgrades at once.",
        "Fingerprints in products: functional group on an unexpected carbon, wandering methyls, changed ring sizes.",
        "Cation-free alternatives (oxymercuration, hydroboration) exist to avoid rearrangement - reagent choice is rearrangement management.",
    ),
    exam_tips=(
        "3-methyl-1-butene + HX is THE canonical rearrangement question - if a substrate has a branch adjacent to the double bond, expect the shifted product as the answer.",
        "A 'why this unexpected product' question is answered in one phrase: hydride (or alkyl) shift to the more stable carbocation.",
    ),
))

"""Lecture-note depth for ORG1 chapter 4, Alkenes: Structure — part 2 (4D-4F).

Continuation of extras_org1_ch4.py: reaction classification, bond
cleavage modes, energy diagrams, kinetic versus thermodynamic control,
hydrogenation and catalysis. All prose authored for OCTET; energies
quoted are the standard values the arc lessons already use.
"""

from __future__ import annotations

from app.data.lesson_extras import (
    Figure,
    LessonExtras,
    ReadingSection,
)

EXTRAS_ORG1_CH4B: dict[str, LessonExtras] = {}


def _add(extras: LessonExtras) -> None:
    EXTRAS_ORG1_CH4B[extras.node] = extras


# --------------------------------------------------------------------------
# 4.7 Reaction classification
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.REACTIONTYPES",
    lead=(
        "Organic chemistry looks like ten thousand reactions until you "
        "sort them, at which point it becomes four: addition, "
        "elimination, substitution and rearrangement. The sort is not "
        "cosmetic - each class has a characteristic bookkeeping "
        "signature, a characteristic set of mechanisms, and a "
        "characteristic place in synthesis - and classifying a "
        "transformation correctly is usually the first step of "
        "predicting or explaining it. This lesson builds the "
        "recognition reflexes."
    ),
    sections=(
        ReadingSection(
            id="four-classes",
            figure=Figure(
                stem="org1-markovnikov",
                caption=(
                    "An addition, worked in structures: atoms gained, unsaturation down - the class read straight off the drawing."
                ),
                alt="Propene plus HBr addition scheme as a worked classification example.",
            ),
            heading="The four classes and their signatures",
            body=(
                "Addition: two molecules become one, a pi bond is "
                "consumed, and two new sigma bonds form - the alkene "
                "chemistry of these chapters. Its bookkeeping "
                "signature is a LOSS of unsaturation: the product "
                "has fewer rings-plus-pi-bonds than the reactants. "
                "Elimination is addition run backwards: one molecule "
                "sheds two groups from adjacent carbons, a pi bond "
                "appears, and unsaturation INCREASES - chapter 9's "
                "E2 and E1, and the dehydrations that close this "
                "chapter's synthesis lesson. Substitution swaps one "
                "group on carbon for another with no change in "
                "unsaturation - halide chemistry's SN1 and SN2. "
                "Rearrangement reshuffles the skeleton itself, "
                "formula unchanged - the 1,2-shifts just studied, "
                "and later the big named migrations.\n\n"
                "The practical sorting procedure: write both sides, "
                "count the degrees of unsaturation, and compare "
                "atom inventories. Unsaturation down and atoms "
                "gained = addition; unsaturation up and atoms lost "
                "= elimination; same unsaturation with a group "
                "exchanged = substitution; identical formula with a "
                "different connectivity = rearrangement. The count "
                "does the classifying, which means the skill from "
                "chapter 2 keeps paying rent. The count itself is one formula: $\\text{DoU} = \\tfrac{2n + 2 - H}{2}$ for $C_nH_x$, computed for both sides before any classification is claimed."
            ),
        ),
        ReadingSection(
            id="classes-and-mechanisms",
            heading="Classes are not mechanisms",
            body=(
                "One classification can hide several mechanisms, and "
                "keeping the levels separate prevents a category of "
                "confusion the course otherwise breeds. Addition of "
                "HBr proceeds through a cation in the dark and "
                "through radicals with peroxides - one class, two "
                "mechanisms, opposite regiochemistry. Substitution "
                "at saturated carbon splits into SN1 and SN2, "
                "elimination into E1 and E2, and each member of a "
                "pair responds oppositely to the same experimental "
                "handles. The class answers WHAT changed; the "
                "mechanism answers HOW, step by step, and only the "
                "mechanism carries predictions about rate laws, "
                "stereochemistry and rearrangements.\n\n"
                "The two levels do talk to each other. Because "
                "addition and elimination are formal inverses, many "
                "addition mechanisms read backwards as elimination "
                "mechanisms - acid-catalysed hydration and E1 "
                "dehydration are literally the same steps traversed "
                "in opposite directions, sharing the same cation - "
                "and equilibrium position (excess water or removal "
                "of water) decides which direction runs. Recognising "
                "an inverse pair halves the memory load and is the "
                "beginning of thinking in mechanisms rather than in "
                "flashcards."
            ),
        ),
        ReadingSection(
            id="classification-in-synthesis",
            heading="Why the sort matters: synthesis and analysis",
            body=(
                "In synthesis the classes are verbs: additions "
                "install two groups across a double bond, "
                "eliminations create double bonds to work with, "
                "substitutions exchange handles, rearrangements are "
                "mostly hazards to design around. A retrosynthetic "
                "question - what could this product have come from? "
                "- is answered class-first: an alcohol next to a "
                "new C-H suggests a hydration (addition); an alkene "
                "in the product suggests an elimination from a "
                "halide or alcohol one step back. Chapter 5's "
                "closing synthesis lesson and every multi-step "
                "problem afterwards run on exactly this "
                "class-level pattern matching before any reagent "
                "is named.\n\n"
                "In analysis the classes organise observation: a "
                "reaction that decolourises bromine consumed a pi "
                "bond (addition happened); gas evolution with acid "
                "suggests elimination or decomposition; an isomeric "
                "product with a moved group announces "
                "rearrangement. The habit to build is annotating "
                "every reaction you meet with its class as "
                "automatically as you note its reagents - four "
                "labels, applied thousands of times, are the "
                "skeleton on which the course's apparent bulk "
                "hangs. Students who classify first report that "
                "Organic II feels like variations on known themes; "
                "students who never sort meet every reaction as a "
                "stranger."
            ),
        ),
        ReadingSection(
            id="classification-drills",
            figure=Figure(
                stem="org1-zaitsev-hofmann",
                caption=(
                    "One drill drawn in full: 2-bromobutane loses HBr - unsaturation up, atoms lost - an elimination, with the base choosing the alkene."
                ),
                alt="Scheme of 2-bromobutane giving 2-butene with sodium ethoxide and 1-butene with potassium tert-butoxide.",
            ),
            heading="Six drills, and the oxidation-level ledger",
            body=(
                "Classification becomes reflex through drills, so run "
                "six quickly. Ethylene plus bromine to "
                "1,2-dibromoethane: atoms gained, unsaturation zero "
                "from one - addition. 2-Bromopropane with ethoxide "
                "giving propene: HBr's atoms lost, a pi bond gained - "
                "elimination. Methyl bromide with cyanide giving "
                "acetonitrile plus bromide: bromine swapped for a "
                "carbon nucleophile at constant unsaturation... "
                "except the nitrile carries a triple bond the "
                "STARTING cyanide already owned, which is the drill's "
                "lesson: count unsaturation across the WHOLE "
                "inventory, both organic fragments included, and the "
                "swap stands revealed as substitution. "
                "3-Methyl-1-butene warming with acid to "
                "2-methyl-2-butene: formula identical, double bond "
                "relocated - rearrangement (an isomerisation, the "
                "rearrangement class's gentlest member). "
                "Cyclohexanol dehydrating to cyclohexene: "
                "elimination, the ring surviving untouched. And "
                "hydrogenation of that cyclohexene: addition, "
                "closing the loop. Six answers in under two "
                "minutes once the counting habit exists, and every "
                "one earned by arithmetic rather than recall.\n\n"
                "A second ledger rides alongside the four classes "
                "and is worth opening now: oxidation level. "
                "Organic chemists track it by counting bonds from "
                "carbon to oxygen-class atoms against bonds to "
                "hydrogen: additions of H2 reduce, losses of H2 "
                "oxidise, additions of water or HX leave the "
                "MOLECULE'S total unchanged (one carbon gains, its "
                "partner loses). The ledger explains vocabulary "
                "that otherwise floats free - why hydrogenation is "
                "'a reduction', why converting an alcohol to a "
                "ketone 'oxidises' - and it becomes a full "
                "analytical tool in the alcohol chapter, where "
                "reagents are classified precisely by how many "
                "rungs they move a carbon up the ladder. Filing "
                "both ledgers together - class by unsaturation, "
                "level by H/O bookkeeping - equips you to describe "
                "any transformation in two words before touching "
                "its mechanism, which is exactly the summary exam "
                "graders reward.\n\n"
                "The two-word description also sharpens error "
                "detection. A proposed mechanism whose steps sum to "
                "the wrong class cannot be right no matter how "
                "elegant each arrow looks: if the question's "
                "transformation is a substitution and your steps "
                "net an elimination, some step is missing or extra, "
                "and the audit catches it before a grader does. "
                "The same check polices synthesis answers - a "
                "route whose class sequence cannot reach the "
                "target's unsaturation count is arithmetic-dead "
                "before any reagent is judged - and it polices "
                "reading, too: papers and problem sets sometimes "
                "name reactions loosely, and the counting "
                "definition is the arbiter when labels and "
                "structures disagree. Arithmetic first, names "
                "second, mechanisms third: that ordering makes "
                "the four-class scheme not a vocabulary lesson "
                "but the course's first quality-control system, "
                "cheap to run and surprisingly hard to fool. The "
                "counting habit, once automatic, also reads papers "
                "and reagent catalogues fluently: a transformation "
                "advertised by name resolves to its class in a "
                "glance, and unfamiliar chemistry stops being "
                "intimidating the moment its bookkeeping is "
                "familiar. Four labels and two ledgers - class and "
                "oxidation level - are a small toolkit, but they "
                "are the toolkit everything else in this course "
                "is shelved on, and time invested here is repaid "
                "on literally every page that follows. Sort "
                "first, always: the class before the mechanism, "
                "the mechanism before the reagents, the "
                "reagents before the exceptions - a hierarchy "
                "of attention that keeps ten thousand facts "
                "filed under four headings, which is the only "
                "way ten thousand facts stay usable under exam "
                "pressure. File first, recall later: the filing "
                "IS the studying. Every hour spent classifying "
                "reactions returns as minutes saved on every "
                "subsequent problem - compounding interest the "
                "course pays to anyone who opens the account "
                "early, and the account is open from this "
                "page on. Deposit daily; the exam is the "
                "withdrawal."
            ),
        ),
        ReadingSection(
            id="closing-note-reactiontypes",
            heading="A closing note",
            body=(
                "Four classes, two ledgers, one habit: sort "
                "before solving, on every reaction, without "
                "exception."
            ),
        ),
        ReadingSection(
            id="addition-in-depth",
            heading="Addition, examined: thermodynamic shape and variety",
            body=(
                "Each of the four classes deserves one close "
                "look, and addition goes first because chapter "
                "5 is made of it. Its structural signature - "
                "two molecules become one, a pi bond spent, "
                "two sigma bonds bought - fixes its "
                "thermodynamic profile: enthalpy usually "
                "favourable (sigma bonds beat the pi bond "
                "they replace), entropy always unfavourable "
                "(two particles become one), so additions are "
                "helped by cold and by concentration, and "
                "every addition equilibrium tips back toward "
                "elimination as temperature climbs. That one "
                "profile explains laboratory practice across "
                "dozens of reactions before any mechanism is "
                "drawn: hydrations run cold and wet, "
                "dehydrations hot and concentrated, and the "
                "temperature line of an exam problem is a "
                "thermodynamic vote before it is anything "
                "else. The class also spans a mechanistic "
                "range worth previewing: stepwise polar "
                "additions through cations (the HX story), "
                "concerted one-step additions that deliver "
                "both new bonds simultaneously "
                "(hydrogenation on a metal, and later the "
                "cycloadditions), and radical-chain "
                "additions - three mechanisms, one class, "
                "and the class-level thermodynamics "
                "identical across all three.\n\n"
                "The class signature also drives its "
                "analytical use: because addition consumes "
                "unsaturation, it is COUNTABLE. Titrating a "
                "fat's double bonds with halogen (the "
                "iodine number of food chemistry) and "
                "counting hydrogen uptake per mole are both "
                "the addition class used as a measuring "
                "instrument, and both appear in applied "
                "exams. When a question asks how many "
                "equivalents of a reagent a polyene "
                "consumes, it is asking you to run the "
                "class definition as arithmetic: one pi "
                "bond, one equivalent, rings untouched - "
                "the unsaturation audit from the alkene "
                "chapter, monetised."
            ),
        ),
        ReadingSection(
            id="elimination-substitution-depth",
            heading="Elimination and substitution, examined",
            body=(
                "Elimination mirrors addition atom for atom, "
                "and its profile is addition's negative: "
                "enthalpy usually uphill, entropy favourable "
                "(one particle becomes two), so heat is its "
                "friend and the hot/cold rule of thumb "
                "follows from the class alone. What the "
                "class-level view adds beyond the mirror is "
                "the selectivity question that will organise "
                "chapter 9: an unsymmetrical substrate can "
                "usually eliminate in more than one "
                "direction, so elimination questions are "
                "always TWO questions - does it eliminate, "
                "and toward which alkene - with the second "
                "answered by the stability ladder through "
                "Zaitsev's rule. Substitution, the third "
                "class, is the quiet workhorse: one sigma "
                "bond traded for another at the same carbon, "
                "particle count unchanged, so neither "
                "enthalpy nor entropy takes a strong "
                "class-level position and the chemistry is "
                "decided almost entirely by mechanism - "
                "which is exactly why chapter 9 spends its "
                "length on substitution's two mechanisms "
                "rather than its thermodynamics.\n\n"
                "The practical dividend of examining the "
                "two together is the recognition that they "
                "COMPETE: the same substrate, the same "
                "reagent acting as base or nucleophile, "
                "the same cationic or concerted machinery, "
                "and the product split between alkene and "
                "substituted product is decided by "
                "conditions - heat and bulk toward "
                "elimination, cold and unhindered "
                "nucleophilicity toward substitution. "
                "Chapter 9's decision tree is that "
                "sentence expanded to four mechanisms; "
                "meeting the competition here, as a "
                "class-level fact, means the tree will be "
                "grown on ground already cleared. No "
                "other single insight de-mystifies the "
                "substitution chapter as much as knowing, "
                "in advance, that its four mechanisms are "
                "two competitions run under two regimes."
            ),
        ),
        ReadingSection(
            id="rearrangement-class-depth",
            heading="Rearrangement as a class, and the composite reactions",
            body=(
                "Rearrangement, the fourth class, differs "
                "from the other three in conserving the "
                "molecular formula outright: nothing is "
                "gained or lost, connectivity alone "
                "changes. Its class-level thermodynamics "
                "is therefore pure relative stability - a "
                "rearrangement runs exactly when the new "
                "skeleton is more stable, with no "
                "particle-count entropy term to lean on - "
                "which is why isomerisations equilibrate "
                "where additions and eliminations drive. "
                "The 1,2-shifts inside cationic mechanisms "
                "are this class at elementary-step scale; "
                "whole-molecule isomerisations like the "
                "alkene walk of the stability chapter are "
                "the same class at net-reaction scale, and "
                "both obey one audit: sum the stability "
                "ledger, run downhill.\n\n"
                "The classes' real power appears when "
                "reactions compose, because most name-"
                "brand transformations are sentences "
                "built from these four words. "
                "Acid-catalysed dehydration reads as "
                "substitution's first half (leaving-group "
                "creation) plus elimination, sometimes "
                "with a rearrangement spliced between. "
                "The hydration of an alkene is addition; "
                "run backwards it is elimination; the "
                "pair through one intermediate. Organic "
                "II's ester hydrolysis will read as "
                "addition then elimination at a "
                "carbonyl - the add-collapse sentence "
                "from the arrows chapter, now nameable "
                "as class composition. Training the eye "
                "to parse any unfamiliar transformation "
                "into its class sequence - what added, "
                "what left, what moved - converts "
                "'learn two hundred reactions' into "
                "'recognise four words in different "
                "orders', which is the honest size of "
                "the organic curriculum and the "
                "best-kept secret of students who find "
                "it manageable."
            ),
        ),
        ReadingSection(
            id="oxidation-ledger-depth",
            heading="The oxidation-level ledger, formalised",
            body=(
                "The drills introduced oxidation levels by "
                "example; the ledger deserves its formal "
                "statement because it silently organises "
                "half of Organic II. Assign each carbon an "
                "oxidation level by counting its bonds to "
                "more electronegative atoms (O, N, halogen "
                "- each counts +1) minus its bonds to "
                "hydrogen (each -1), bonds to carbon "
                "counting zero. An alkane carbon sits at "
                "the reduced end; alcohols and halides one "
                "level up; aldehydes and ketones the next; "
                "carboxylic acids and their derivatives "
                "above that; carbon dioxide fully "
                "oxidised. The ledger's use: any reaction "
                "that moves a carbon UP the scale needs an "
                "oxidant, any move DOWN needs a reductant, "
                "and any transformation holding the level "
                "constant - alcohol to halide, halide to "
                "alkene plus HX - needs neither, however "
                "dramatic the structural change looks. "
                "One counting rule, and reagent lists "
                "stop being arbitrary: the question 'why "
                "does this step need chromium or "
                "borohydride' always has the answer "
                "'because the ledger moved'.\n\n"
                "Applied to this chapter's chemistry the "
                "ledger yields a non-obvious dividend: "
                "additions across C=C are usually "
                "redox-neutral OVERALL while moving the "
                "two carbons in opposite directions - "
                "hydration pushes one carbon up (gains "
                "O) and the other down (gains H), net "
                "zero. Hydrogenation moves both carbons "
                "down: it is a net reduction and duly "
                "consumes a reductant, molecular "
                "hydrogen. Exam questions that ask "
                "'is this an oxidation?' are asking for "
                "thirty seconds of this arithmetic, and "
                "the arithmetic never lies where "
                "intuition about 'adding oxygen' "
                "frequently does."
            ),
        ),
        ReadingSection(
            id="classification-workflow",
            heading="A classification workflow for unseen reactions",
            body=(
                "Assembled, the chapter's skills form a "
                "fixed workflow for any unfamiliar "
                "transformation, and running it "
                "deliberately a dozen times makes it "
                "automatic. Step one: compare molecular "
                "formulas of substrate and product - "
                "atoms gained mean addition or "
                "substitution, atoms lost mean "
                "elimination or substitution, formula "
                "conserved means rearrangement. Step "
                "two: locate every changed bond by "
                "overlaying the structures - the changed "
                "set names the class precisely where "
                "step one left two candidates. Step "
                "three: run the oxidation ledger on "
                "each changed carbon - the redox verdict "
                "constrains what reagent class must have "
                "acted. Step four, only now: propose "
                "mechanism, using the intermediate "
                "logic of the previous lessons. The "
                "order matters because each step "
                "narrows the next's search space; "
                "students who jump straight to "
                "mechanism guess among dozens of "
                "options, while the workflow's first "
                "three steps typically leave one or "
                "two.\n\n"
                "The workflow is also precisely how "
                "the MCAT's experimental passages are "
                "built to be read: a passage shows an "
                "unfamiliar biotransformation, and the "
                "questions reward classifying it - "
                "what added, what oxidised - far more "
                "often than naming it. Biochemistry "
                "will re-label the same skills "
                "(dehydrogenases run the ledger, "
                "lyases run elimination, isomerases "
                "run rearrangement - the enzyme "
                "commission classes ARE this "
                "chapter's classes wearing systematic "
                "names), so the workflow transfers "
                "intact to the courses this course "
                "feeds. Four steps, learned once, "
                "used for a decade: the definition "
                "of curriculum worth front-loading."
            ),
        ),
        ReadingSection(
            id="classes-history",
            heading="Where the taxonomy came from, and its limits",
            body=(
                "Classification is old chemistry - older "
                "than mechanism - and knowing its lineage "
                "clarifies its authority. Nineteenth-"
                "century chemists sorted reactions by "
                "what they could weigh and collect: "
                "things combined, things split, things "
                "exchanged partners, things transformed "
                "without change of composition - "
                "categories legible in a balance-pan "
                "world with no electrons in it. The "
                "electronic revolution kept the "
                "taxonomy but re-founded it on bonds: "
                "the modern classes are statements "
                "about the sigma/pi inventory, which "
                "is why they survived a century of "
                "mechanistic upheaval unchanged - "
                "mechanisms multiplied, but the four "
                "ways a bond inventory can change did "
                "not. That stability is the "
                "taxonomy's authority: it rests on "
                "arithmetic, not fashion.\n\n"
                "Its limits are equally instructive. "
                "The classes say nothing about HOW - "
                "the same net addition can run polar, "
                "radical or concerted, with different "
                "rates, selectivities and "
                "stereochemistry - so classification "
                "is the beginning of analysis, never "
                "its end, and 'what class' followed by "
                "'what mechanism' is the full question "
                "pair. And a few transformations "
                "genuinely straddle classes - "
                "pericyclic reactions the later "
                "courses meet resist the polar "
                "vocabulary entirely - reminders that "
                "taxonomies serve thought rather than "
                "govern it. Use the four classes the "
                "way this chapter has: as the fastest "
                "first sort available, holding "
                "everything the sort cannot decide "
                "for the mechanistic tools the rest "
                "of the course supplies. Sorting "
                "first, mechanism second, judgement "
                "always: the working order of "
                "organic analysis."
            ),
        ),
        ReadingSection(
            id="condensations-and-polymer-classes",
            heading="Two composite families: condensations and polymerisations",
            body=(
                "Two reaction families the wider world "
                "names constantly are worth placing on the "
                "four-class map now, because both are "
                "compositions rather than new classes. A "
                "condensation joins two molecules while "
                "expelling a small one - water most often - "
                "and parses as addition followed by "
                "elimination: the joining step adds, the "
                "expulsion eliminates, and the net "
                "bookkeeping (two molecules in, one large "
                "plus one small out) is what the name "
                "records. Ester formation from acid and "
                "alcohol, amide formation, and the aldol "
                "condensations of Organic II all carry "
                "the pattern, and biology runs on it: "
                "proteins, nucleic acids and complex "
                "carbohydrates are all built by "
                "condensation, one water expelled per "
                "link, which is why hydrolysis - the "
                "reverse, water re-inserted - is how "
                "digestion dismantles all three. One "
                "compositional pattern, the entire "
                "macromolecular world.\n\n"
                "Polymerisation sorts into the same "
                "vocabulary from the other side. "
                "Addition polymers - polyethylene, PVC, "
                "polystyrene - are the addition class "
                "iterated: each monomer's pi bond opens "
                "to splice into the chain, no atoms "
                "lost, polymer formula a strict "
                "multiple of the monomer's. "
                "Condensation polymers - nylon, "
                "polyester, and biology's three above - "
                "iterate the condensation pattern and "
                "shed a small molecule per link, so "
                "their formulas are NOT multiples of "
                "their monomers, a distinction "
                "analytical questions exploit. "
                "Recognising which family a polymer "
                "belongs to from its repeat unit - "
                "does the backbone carry the whole "
                "monomer or the monomer minus water - "
                "is a standard exam exercise, and it "
                "is nothing but the class arithmetic "
                "of this chapter run on repeating "
                "structures."
            ),
        ),
        ReadingSection(
            id="reactiontypes-problem-set",
            heading="A classification problem set, worked through the workflow",
            body=(
                "Five drills through the four-step "
                "workflow. One: 2-butanol heated with "
                "concentrated sulfuric acid gives "
                "2-butene and water. Formula loses "
                "H2O - elimination - and the ledger "
                "holds level (the carbinol carbon "
                "loses O, gains nothing; its "
                "neighbour loses H): elimination, no "
                "redox, acid catalyst only. Two: "
                "2-butene plus hydrogen over "
                "palladium gives butane. One molecule "
                "gained, pi bond spent: addition; "
                "both carbons gain H, ledger moves "
                "down twice: a net reduction, and "
                "the H2/metal reagent pair is thereby "
                "explained. Three: 2-bromobutane plus "
                "sodium iodide in acetone gives "
                "2-iodobutane. Formula swaps Br for "
                "I at one carbon: substitution; "
                "ledger unmoved (halogen for "
                "halogen): no redox, no oxidant "
                "needed, mechanism deferred to "
                "chapter 9. Four: cyclohexanol to "
                "cyclohexanone with chromium "
                "reagent. Two hydrogens lost from "
                "the same carbon-oxygen pair; the "
                "carbinol carbon rises one full "
                "ledger step: an oxidation, and the "
                "chromium's presence is the ledger's "
                "receipt. Five, the integrator: "
                "glucose cyclising to its ring form. "
                "Formula conserved exactly: "
                "rearrangement (an intramolecular "
                "addition in mechanism, isomerisation "
                "in net class), no redox, no "
                "reagent - the workflow classifying "
                "a biochemical transformation it has "
                "never seen, which is the entire "
                "point.\n\n"
                "Note what the five shared: not one "
                "required knowing a named mechanism, "
                "and every reagent's presence or "
                "absence was PREDICTED by class plus "
                "ledger before mechanism was even "
                "invited. That predictive audit - "
                "cheap, fast, mechanism-free - is "
                "what this lesson adds to your "
                "toolkit, and it runs on every "
                "reaction you will ever meet, "
                "including the ones no course "
                "teaches."
            ),
        ),
        ReadingSection(
            id="classes-and-green-chemistry",
            heading="Atom economy: the classes priced industrially",
            body=(
                "Industrial and green chemistry read the "
                "four classes through one more lens worth "
                "installing: atom economy, the fraction of "
                "the reactants' mass that ends up in the "
                "desired product. The classes rank "
                "themselves. Additions are the champions - "
                "every atom of both reactants lands in the "
                "product, one hundred percent economical "
                "by construction - which is part of why "
                "industry loves hydrogenations, "
                "hydrations and addition polymerisations "
                "at scale. Rearrangements match them "
                "(nothing leaves), and industrial "
                "isomerisations are correspondingly "
                "clean. Substitutions ship the leaving "
                "group as waste by definition, so their "
                "economy depends on how heavy the "
                "leaving group is - a tosylate discarded "
                "is most of the molecule's mass thrown "
                "away - and eliminations discard the "
                "eliminated fragment likewise. The "
                "greenest synthesis, at class level, is "
                "additions and rearrangements wherever "
                "possible, substitutions with light "
                "leaving groups when not; and modern "
                "process chemistry audits routes in "
                "exactly these terms before a flask is "
                "ever raised.\n\n"
                "For this course the lens does double "
                "duty. It previews a set of exam "
                "questions - 'which route wastes "
                "fewer atoms' is a straight class "
                "audit - and it reframes the "
                "curriculum's values: the reactions "
                "the later chapters celebrate as "
                "elegant are usually the ones whose "
                "class arithmetic is clean, and "
                "'elegant' in synthesis has always "
                "quietly meant economical. Chemistry "
                "is bookkeeping at every scale, from "
                "the arrow to the refinery, and the "
                "four classes are the books."
            ),
        ),
        ReadingSection(
            id="enzyme-commission-bridge",
            heading="The same taxonomy in biochemistry: EC classes",
            body=(
                "The claim that this chapter's taxonomy "
                "transfers to biochemistry is checkable "
                "against biochemistry's own filing system, "
                "and the match is nearly one to one. The "
                "Enzyme Commission sorts every known "
                "enzyme into numbered classes, and the "
                "big ones are this lesson's vocabulary "
                "wearing systematic names: "
                "oxidoreductases run the oxidation "
                "ledger up and down (every "
                "dehydrogenase is a ledger move with a "
                "cofactor holding the electrons); "
                "transferases and hydrolases are "
                "substitution chemistry, a group swapped "
                "between carriers or exchanged for "
                "water; lyases run additions and "
                "eliminations, adding groups across "
                "double bonds or removing them to make "
                "double bonds - fumarase hydrating "
                "fumarate in the citric acid cycle is "
                "an acid-base-mediated addition of "
                "water across C=C, this chapter's "
                "chemistry verbatim; and isomerases "
                "are the rearrangement class, formula "
                "conserved, connectivity shuffled. A "
                "student fluent in the four classes "
                "reads a metabolic chart's enzyme "
                "names as reaction-class labels and "
                "predicts each step's shape before "
                "memorising it.\n\n"
                "The bridge pays in both directions "
                "on the MCAT: biochemistry passages "
                "reward classifying an unfamiliar "
                "enzymatic step, and organic passages "
                "reward recognising that a 'biological' "
                "transformation is an old friend. "
                "Hydration of fumarate, dehydration in "
                "glycolysis, the isomerisation of "
                "glucose-6-phosphate - every one is a "
                "four-class citizen, and the exam's "
                "cross-disciplinary questions are "
                "engineered precisely at this bridge. "
                "Cross it now, in this direction, and "
                "the biochemistry semester arrives "
                "pre-sorted; the alternative is "
                "meeting the same chemistry twice "
                "under two vocabularies and paying "
                "for it twice in study hours."
            ),
        ),
        ReadingSection(
            id="reactiontypes-close",
            heading="The sort as a habit of mind",
            body=(
                "End where the lesson's value actually "
                "lives: not in the four definitions, "
                "which fit on a card, but in the habit "
                "of running the sort FIRST, before "
                "mechanism, before memory, before "
                "panic. An unfamiliar reaction on an "
                "exam triggers a predictable failure "
                "mode - searching memory for a match "
                "and finding none - and the sort is "
                "the antidote: formulas compared, "
                "bonds inventoried, ledger run, and "
                "suddenly the unfamiliar reaction is "
                "'an addition with a net reduction, "
                "so the reagent is a reductant and "
                "the product's stereochemistry is "
                "worth checking' - three true "
                "sentences produced from nothing but "
                "arithmetic, each narrowing what the "
                "question can be asking. The habit "
                "is the difference between students "
                "who freeze on novelty and students "
                "who process it, and it is built the "
                "only way habits are: by running the "
                "workflow on every reaction met from "
                "here forward, familiar ones "
                "included, until the sort completes "
                "itself before the question is "
                "finished being read.\n\n"
                "The chapter that follows supplies "
                "the energy vocabulary - diagrams, "
                "barriers, control regimes - that "
                "turns these sorted classes into "
                "predicted outcomes, and the "
                "reaction chapters after that supply "
                "the mechanisms. But the sort comes "
                "first in every analysis this course "
                "will ever run, which is why it "
                "comes first in the curriculum: "
                "four words, one ledger, one "
                "workflow, and the entire subject "
                "becomes navigable. Navigable is not the "
                "same as easy - the mechanisms ahead have "
                "real depth and real traps - but a "
                "navigable subject can be studied in order, "
                "audited step by step, and passed by "
                "method rather than memory heroics, and "
                "that conversion is precisely what a "
                "taxonomy well-learned buys. Buy it here, "
                "at four definitions and a counting rule, "
                "the cheapest price the course will ever "
                "quote for anything this valuable, and one "
                "that keeps paying every week of every "
                "chemistry course you take from now to the "
                "boards, in exactly the coin exams and "
                "laboratories both spend: correct, fast, "
                "auditable first moves made without hesitation."
            ),
        ),
    ),
    key_takeaways=(
        "Four classes: addition (unsaturation down), elimination (up), substitution (unchanged, group swapped), rearrangement (formula kept, skeleton changed).",
        "Classify by counting degrees of unsaturation and comparing atom inventories - mechanical, not intuitive.",
        "A class can contain several mechanisms with opposite behaviour (ionic vs radical HBr; SN1/SN2; E1/E2).",
        "Addition and elimination are inverse pairs that often share literal steps and intermediates - learn them together.",
        "Classification is the first move of both synthesis planning and product explanation.",
    ),
    exam_tips=(
        "When a question asks 'what type of reaction', count unsaturation on both sides before reading the choices - the count answers it without judgment calls.",
        "Inverse-pair awareness answers equilibrium questions: excess water pushes hydration, removing water pushes dehydration - same mechanism, chosen direction.",
    ),
))


# --------------------------------------------------------------------------
# 4.8 Homolysis and heterolysis
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.HOMOHETERO",
    lead=(
        "Every reaction begins with bonds breaking, and a bond can break "
        "in exactly two ways: evenly, one electron to each fragment, or "
        "unevenly, both electrons to one side. That single fork - "
        "homolysis versus heterolysis - decides whether the chemistry "
        "ahead is radical or polar, which arrows describe it, which "
        "intermediates appear, and which experimental conditions favour "
        "it. This lesson fixes the vocabulary, the notation and the "
        "energetics of the fork."
    ),
    sections=(
        ReadingSection(
            id="two-cleavages",
            heading="Two ways to break a bond",
            body=(
                "Heterolysis sends the bonding pair entirely to one "
                "partner: fragments are ions - a cation that lost the "
                "electrons and an anion that took them - and the "
                "notation is the full-headed curved arrow of chapter "
                "3, tail on the bond, head on the winner. Ionisation "
                "of an alkyl halide to a carbocation and halide is "
                "the course's standard example, and heterolysis "
                "underlies all the polar chemistry: acid-base steps, "
                "nucleophile-electrophile bond formation, the "
                "cation-mediated additions of this chapter.\n\n"
                "Homolysis splits the pair evenly: each fragment "
                "keeps one electron and becomes a radical - a "
                "species with an unpaired electron, electrically "
                "neutral but electron-hungry. The notation changes "
                "with the physics: single-electron movements are "
                "drawn with half-headed 'fishhook' arrows, always in "
                "matched pairs when a bond breaks (one fishhook to "
                "each fragment). Chlorine gas splitting to two "
                "chlorine atoms under UV light is the standard "
                "example, and homolysis opens the radical chemistry: "
                "chapter 9's radical halogenation, chapter 5's "
                "peroxide-promoted HBr, and the polymerisations of "
                "industry. Which cleavage a given bond prefers "
                "depends on surroundings: polar solvents stabilise "
                "ions and invite heterolysis; heat, light and "
                "nonpolar media favour homolysis."
            ),
        ),
        ReadingSection(
            id="bde",
            figure=Figure(
                stem="org1-bde-chart",
                caption=(
                    "The lesson's bond dissociation energies as a chart: the weak O-O and Br-Br bonds are where chains are ignited."
                ),
                alt="Bar chart of bond dissociation energies for H-H, C-H, tertiary C-H, H-Br, Br-Br and peroxide O-O.",
            ),
            heading="Bond dissociation energy: the homolytic ruler",
            body=(
                "The energy to break a bond homolytically in the gas "
                "phase is its bond dissociation energy (BDE), and "
                "BDEs are the quantitative backbone of radical "
                "chemistry. Representative values worth carrying: "
                "H-H 436 kJ/mol, C-H in methane 439, a tertiary C-H "
                "about 400, H-Br 366, Br-Br 193, the O-O bond of "
                "peroxides near 150. Two readings matter. First, "
                "weak bonds (O-O, halogen-halogen) are where "
                "radical chemistry STARTS - initiators are chosen "
                "precisely for their frangible bonds, which is why "
                "peroxides and Br2-plus-light appear wherever "
                "radicals are wanted. Second, BDE differences rank "
                "radical stability exactly as hydrogenation heats "
                "ranked alkenes: it costs less to break a tertiary "
                "C-H than a primary one BECAUSE the tertiary "
                "radical left behind is more stable, and the "
                "stability order - tertiary > secondary > primary > "
                "methyl - mirrors the carbocation ladder for the "
                "same hyperconjugative reasons, with smaller "
                "gaps. Every propagation step's feasibility is one subtraction: $\\Delta H_{\\text{step}} = D_{\\text{broken}} - D_{\\text{formed}}$, and a chain runs only when both steps come out near zero or negative.\n\n"
                "The parallel between the two ladders is worth "
                "making explicit: both electron-deficient "
                "intermediates are stabilised by alkyl "
                "substitution, both are flattish sp2-like centres, "
                "and allylic/benzylic delocalisation tops both "
                "rankings. Learn one ladder well and the other "
                "comes at a discount - a structural economy the "
                "radical HBr lesson in chapter 5 will immediately "
                "spend."
            ),
        ),
        ReadingSection(
            id="choosing-the-fork",
            heading="Reading conditions: which fork is the question on?",
            body=(
                "Exam questions signal the fork through conditions, "
                "and reading the signals is a learnable reflex. "
                "Radical flags: the words light (hv), heat with a "
                "halogen, peroxides, AIBN, or NBS - any of these "
                "means fishhook arrows, radical intermediates, and "
                "radical selectivity rules. Polar flags: acids, "
                "bases, ionic reagents, polar solvents - full "
                "arrows, ions, and the nucleophile/electrophile "
                "logic of chapter 3. The same substrate can walk "
                "both paths to different products: HBr on propene "
                "gives 2-bromopropane through the cation in the "
                "dark and 1-bromopropane through radicals with "
                "peroxides, so the conditions line of a question "
                "is not decoration - it selects the mechanism and "
                "with it the answer.\n\n"
                "The fork also organises safety and everyday "
                "chemistry. Radical chains explain why traces of "
                "initiator transform bulk material (a little "
                "peroxide polymerises a tank of monomer), why "
                "antioxidants work (they intercept chain-carrying "
                "radicals), and why ethers form dangerous "
                "peroxides on storage. Polar chemistry, needing "
                "stabilised charges, explains why so much "
                "laboratory work happens in polar solvents. One "
                "fork, drawn at the first bond cleavage, and the "
                "rest of the mechanism follows its branch."
            ),
            important=(
                "Fishhook arrows and full arrows never mix within "
                "one elementary step: a step is either "
                "single-electron chemistry or pair chemistry. "
                "Mixed-arrow drawings are automatically wrong."
            ),
        ),
        ReadingSection(
            id="radicals-in-the-world",
            figure=Figure(
                stem="org1-radical-chain",
                caption=(
                    "The chain as a loop: bromine atom in, product out, carrier regenerated - the geometry of every radical chain in the course."
                ),
                alt="Circular diagram of the radical HBr propagation cycle with initiation shown above.",
            ),
            heading="Radical structure, and radicals outside the flask",
            body=(
                "A carbon radical's structure sits between the "
                "cation's and the alkane's: seven valence electrons, "
                "a shallow pyramid rapidly inverting or effectively "
                "planar, with the odd electron in an orbital of "
                "largely p character. Practical consequences track "
                "the cation analogy closely - attack from either "
                "face (radical reactions at stereocentres racemise), "
                "stabilisation by hyperconjugation and by "
                "delocalisation - with one welcome exception: "
                "radicals, being neutral, DO NOT rearrange under "
                "ordinary conditions. No 1,2-hydride shifts, no "
                "skeleton surprises; a radical mechanism's product "
                "keeps the substrate's framework, and that contrast "
                "with cations is itself diagnostic evidence when "
                "products are being attributed to a mechanism.\n\n"
                "Radicals also run large parts of the everyday "
                "world, and the examples repay knowing. Molecular "
                "oxygen is a ground-state diradical - two unpaired "
                "electrons - which is why O2 reacts readily with "
                "other radicals and why combustion, once ignited, "
                "propagates by radical chains. The slow version, "
                "autoxidation, turns ethers into hazardous "
                "peroxides on the shelf and turns fats rancid: "
                "oxygen abstracts the weakest C-H (allylic ones in "
                "unsaturated fats - the BDE logic verbatim), and "
                "hydroperoxides accumulate. Antioxidants - BHT in "
                "food, vitamin E in membranes - work by donating "
                "an H atom to the chain-carrying radical and "
                "leaving behind a radical too stabilised to "
                "continue the chain: chain BREAKING as deliberate "
                "design, the inverse of initiation. Even "
                "laboratory practice reflects the chemistry: "
                "stabilised radicals like TEMPO are bottled "
                "reagents precisely because delocalisation and "
                "steric shielding can make the 'reactive "
                "intermediate' indefinitely stable, the same "
                "lesson superacids taught about cations. "
                "Intermediates are ordinary molecules under the "
                "right conditions; mechanisms are chemistry, not "
                "mythology.\n\n"
                "The biological coda makes the stakes concrete. "
                "Reactive oxygen species - superoxide, hydroxyl "
                "radicals - arise as inevitable leakage from "
                "aerobic metabolism, attack lipids by exactly the "
                "allylic-abstraction chemistry above, and are "
                "policed by an enzymatic antioxidant system "
                "(superoxide dismutase, catalase) plus the "
                "small-molecule chain breakers in the diet. "
                "Oxidative stress, in this vocabulary, is chain "
                "initiation outrunning chain termination - a "
                "sentence that converts an entire physiology "
                "lecture into this lesson's terms. For the exam "
                "register: any question pairing unsaturated "
                "lipids, radicals and vitamin E is asking for "
                "the allylic C-H's low BDE, the chain that "
                "starts there, and the stabilised radical that "
                "ends it - three facts, one story, told entirely "
                "in fishhook arrows. One habit ties the lesson "
                "off: whenever a question involves oxygen, light, "
                "heat with halogens, peroxides, or long storage "
                "of ethers and fats, ask first whether radical "
                "chemistry has been invited - because once "
                "invited, it obeys chain logic and BDE "
                "arithmetic, never the polar rules, and the "
                "answer choices split cleanly along that fork. And keep the "
                "arrow discipline absolute from the first day: "
                "full heads for pairs, fishhooks for singles, "
                "never mixed within a step. Notation sounds like "
                "pedantry until the mechanisms grow long, at "
                "which point it is the difference between a "
                "derivation you can audit and a drawing you can "
                "only hope about - and graders, like referees, "
                "audit. The cleavage fork is the first fact of "
                "every mechanism; drawing it correctly is the "
                "first habit. Habits compound: the student who "
                "drills both arrow dialects now reads chapter "
                "9's radical halogenation as review rather "
                "than as new notation under time pressure - "
                "notation drilled early is attention freed "
                "later, and attention is the scarcest exam "
                "resource there is, and no topic refunds it "
                "more generously than notation learned cold."
            ),
        ),
        ReadingSection(
            id="closing-note-homohetero",
            heading="A closing note",
            body=(
                "Pairs or singles: ask it of every bond that "
                "breaks, and the right chemistry follows."
            ),
        ),
    ),
    key_takeaways=(
        "Heterolysis -> ions, full arrows, polar chemistry; homolysis -> radicals, paired fishhook arrows, radical chemistry.",
        "BDE measures homolytic cost; weak O-O and X-X bonds are where radical chemistry is ignited.",
        "Radical stability: 3 > 2 > 1 > methyl with allylic/benzylic on top - the carbocation ladder's gentler twin.",
        "Conditions choose the fork: light/heat/peroxides = radical; acids/bases/polar solvents = polar.",
        "Same substrate, different fork, different product - HBr on propene is the canonical demonstration.",
    ),
    exam_tips=(
        "Scan the conditions line first: hv, peroxides or NBS instantly reclassify the whole question as radical chemistry.",
        "BDE-comparison questions are radical-stability questions in disguise: the weaker C-H sits on the carbon that makes the better radical.",
    ),
))


# --------------------------------------------------------------------------
# 4.9 Energy diagrams
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.ENERGYDIAGRAM",
    lead=(
        "The reaction coordinate diagram is the course's second great "
        "notation, after the curved arrow. One curve encodes how many "
        "steps a mechanism has, where its intermediates rest, which step "
        "controls the rate, and whether the overall reaction is uphill "
        "or down. Learning to read - and sketch - these diagrams "
        "converts thermodynamics and kinetics from separate vocabulary "
        "lists into one picture, and the two-step HX addition just "
        "studied provides the perfect worked example."
    ),
    sections=(
        ReadingSection(
            id="anatomy",
            heading="Anatomy of the curve",
            body=(
                "The horizontal axis is the reaction coordinate - "
                "progress from reactants to products, not time - and "
                "the vertical axis is free energy. Every MAXIMUM on "
                "the curve is a transition state: a fleeting, "
                "partially bonded arrangement at the top of a pass, "
                "with no lifetime and no possibility of isolation. "
                "Every local MINIMUM between reactants and products "
                "is an intermediate: a real species - our "
                "carbocation - resting in a valley, isolable in "
                "principle if the valley is deep enough. Count the "
                "maxima and you have counted the elementary steps; "
                "count the valleys between the ends and you have "
                "counted the intermediates. A one-step (concerted) "
                "mechanism is one hump with nothing between; the "
                "HX addition is two humps with the cation valley "
                "between them.\n\n"
                "Two energy differences carry the chemistry. The "
                "activation energy of a step runs from its "
                "starting valley UP to its transition state and "
                "sets that step's rate - the higher the barrier, "
                "the slower the step. The overall free-energy "
                "change runs from reactants to products, ignoring "
                "everything between, and sets the equilibrium via "
                "chapter 3's $\\Delta G = -RT \\ln K$. Rate reads "
                "barriers; equilibrium reads endpoints; the diagram "
                "displays both without letting you confuse them."
            ),
            figure=Figure(
                stem="org1-hx-energy-diagram",
                caption=(
                    "Reaction coordinate diagram for two-step HX "
                    "addition: protonation over the high first "
                    "barrier to the carbocation valley, then fast "
                    "capture over the low second barrier to the "
                    "downhill product."
                ),
                alt=(
                    "Free energy versus reaction coordinate showing "
                    "reactants, a high first transition state, a "
                    "carbocation intermediate valley, a lower second "
                    "transition state, and products below the "
                    "starting energy."
                ),
            ),
        ),
        ReadingSection(
            id="rds",
            heading="The rate-determining step",
            body=(
                "In a multistep mechanism, one step's transition "
                "state stands highest above the ORIGINAL reactants, "
                "and that step is rate-determining: the whole "
                "reaction proceeds only as fast as traffic clears "
                "that summit. For HX addition it is the first step "
                "- protonation to the cation - which is why the "
                "measured rate responds to anything that stabilises "
                "the cation-like transition state (more substituted "
                "alkene, faster reaction) and why the second step's "
                "speed is irrelevant to the observed kinetics. "
                "Identifying the RDS is therefore not curve-reading "
                "trivia; it tells you which structural changes will "
                "accelerate the reaction and which will do "
                "nothing.\n\n"
                "A corollary the course uses repeatedly: species "
                "that appear AFTER the rate-determining step do not "
                "appear in the rate law. The halide captures the "
                "cation after the summit, so HX addition's rate "
                "does not depend on which halide finishes the job; "
                "SN1's rate in chapter 9 will ignore the "
                "nucleophile entirely for the same reason, and "
                "that omission is the experimental fingerprint "
                "distinguishing it from SN2. Rate laws are "
                "mechanism evidence precisely because the diagram "
                "links what is measurable (rate dependence) to "
                "what is structural (which step owns the highest "
                "summit)."
            ),
        ),
        ReadingSection(
            id="hammond",
            heading="The Hammond postulate: what transition states look like",
            body=(
                "Transition states cannot be observed, yet chemists "
                "reason about their structures constantly. The "
                "licence is the Hammond postulate: a transition "
                "state resembles the species NEAREST it in energy. "
                "An endothermic (uphill) step has a late transition "
                "state that looks like its product - so the summit "
                "of the cation-forming step looks like the cation, "
                "and whatever stabilises the cation stabilises the "
                "summit and lowers the barrier. That single "
                "inference underwrites half this chapter: it is WHY "
                "cation stability controls HX addition's rate and "
                "regiochemistry, why more substituted alkenes react "
                "faster, and why Markovnikov's rule works at the "
                "rate level and not merely at the product level. An "
                "exothermic (downhill) step has an early, "
                "reactant-like transition state, comparatively "
                "indifferent to product stability - the fact that "
                "will explain radical halogenation's selectivity "
                "patterns in chapter 9.\n\n"
                "Sketching discipline completes the skill. When "
                "asked to draw a diagram: place the endpoints "
                "first from the reaction's thermochemistry, add "
                "one valley per intermediate at a height "
                "reflecting its stability (better cation, deeper "
                "valley), give the rate-determining step the "
                "tallest summit, and let Hammond position each "
                "summit early or late along its step. A "
                "hand-sketched diagram that honours those four "
                "rules answers most 'which diagram matches this "
                "mechanism' questions before the answer choices "
                "are read."
            ),
            important=(
                "Transition states are never intermediates: maxima "
                "cannot be isolated, minima can. An answer choice "
                "calling the carbocation a transition state - or "
                "drawing a lifetime for a summit - is wrong by "
                "definition."
            ),
        ),
        ReadingSection(
            id="reading-practice",
            figure=Figure(
                stem="org1-catalysed-curve",
                caption=(
                    "Catalysed and uncatalysed pathways between the same endpoints, drawn from the lesson's description: summits move, endpoints never."
                ),
                alt="Two reaction-coordinate curves sharing endpoints, the catalysed one with more, lower humps.",
            ),
            heading="Catalysed curves, reversibility, and reading practice",
            body=(
                "Two more curve-reading skills complete the "
                "toolkit. First, catalysis on the diagram: the "
                "catalysed pathway is a different curve between "
                "the SAME endpoints, usually with more humps, "
                "every one lower than the uncatalysed summit. "
                "Drawn together, the two curves make the "
                "catalysis lesson's claims visual - endpoints "
                "shared (equilibrium untouched), passes lowered "
                "(rate raised), and both directions accelerated, "
                "since a lower pass is lower from either side. "
                "The exam version asks which of four curves "
                "represents adding a catalyst, and the answer is "
                "always the one that moves no endpoint.\n\n"
                "Second, microscopic reversibility: the reverse "
                "reaction traverses the SAME curve backwards, "
                "through the same intermediates and the same "
                "transition states. Alkene hydration and alcohol "
                "dehydration are one diagram read in opposite "
                "directions - the cation valley serves both - "
                "and the principle guarantees that whatever is "
                "rate-determining uphill is rate-determining "
                "downhill from the other side. This is why "
                "learning one mechanism of an inverse pair "
                "genuinely IS learning both, and why catalysts "
                "for a forward reaction are automatically "
                "catalysts for its reverse.\n\n"
                "Now read one composite diagram end to end, as "
                "an exam would present it: three maxima of "
                "heights medium, high, low, two valleys between "
                "them, products below reactants. The mechanism "
                "has three steps and two intermediates; the "
                "second step is rate-determining (highest "
                "summit); the first intermediate is consumed "
                "faster than formed once past step two, so it "
                "never accumulates; the overall reaction is "
                "exothermic and, if equilibration is permitted, "
                "will strongly favour products. Every clause of "
                "that paragraph came off the curve without a "
                "single named compound - which is the point: "
                "the diagram is a language, and fluency in it "
                "is transferable to any mechanism the course or "
                "the MCAT chooses to draw.\n\n"
                "A last discipline: keep the diagram's axes "
                "honest. The vertical axis is free energy, so "
                "entropy is already inside it - a reaction can "
                "climb in enthalpy yet fall in free energy on "
                "entropy's credit, which is how ring-openings "
                "and dissociations pay their way - and the "
                "horizontal axis is progress, not time, so a "
                "wide hump is not a slow step and a narrow one "
                "is not fast; only HEIGHT speaks to rate. Both "
                "confusions appear as engineered distractors, "
                "and both die the moment the axes are read as "
                "labelled rather than as assumed. Precision "
                "about two axes is a small tax for a notation "
                "that will carry every mechanism from here to "
                "the end of Organic II. Sketch daily, label "
                "sparingly, and let the curve do the talking: a "
                "correct diagram answers rate, equilibrium, "
                "intermediate and catalysis questions all at "
                "once, which makes it the highest-yield sketch "
                "in the course. Treat it as vocabulary rather "
                "than decoration: chemists communicate entire "
                "mechanistic arguments by sliding a summit up or "
                "a valley down, and joining that conversation "
                "requires nothing more than the reading "
                "discipline this lesson has now installed."
            ),
        ),
        ReadingSection(
            id="closing-note-energydiagram",
            heading="A closing note",
            body=(
                "And keep the diagram's one-sentence core "
                "alongside it: heights set rates, endpoints set "
                "equilibria, valleys are real and summits are "
                "not. Recited before any diagram question, that "
                "sentence pre-answers most of the answer "
                "choices."
            ),
        ),
        ReadingSection(
            id="last-word-energydiagram",
            heading="The last word",
            body=(
                "Draw first, argue second: the curve settles "
                "disputes that prose only prolongs, and it does so "
                "in one glance."
            ),
        ),
    ),
    key_takeaways=(
        "Maxima = transition states (never isolable); valleys between the ends = intermediates (real species). Count maxima to count steps.",
        "Activation energy (valley to summit) sets rate; overall delta-G (ends only) sets equilibrium - the diagram keeps them distinct.",
        "The step with the highest summit above reactants is rate-determining; species entering after it are absent from the rate law.",
        "Hammond: uphill steps have product-like (late) transition states - the licence for using cation stability to reason about rates.",
        "Sketch order: endpoints, valleys by stability, tallest summit at the RDS, Hammond for summit position.",
    ),
    exam_tips=(
        "Diagram-matching questions: first count humps against the mechanism's steps, then check the intermediate valley's depth against cation stability - two eliminations before reading further.",
        "MCAT catalysis questions live on this diagram: a catalyst lowers summits and never moves the endpoints.",
    ),
))


# --------------------------------------------------------------------------
# 4.10 Kinetic vs thermodynamic control
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.KINETICTHERMO",
    lead=(
        "When one starting material can give two products, which one "
        "wins? The honest answer is a question back: under what "
        "conditions? The faster-formed product dominates when the "
        "reaction cannot revisit its choices; the more stable product "
        "dominates when it can. Kinetic versus thermodynamic control is "
        "the framework for every 'why did the major product change with "
        "temperature' question in the course, and it is built entirely "
        "from the energy-diagram anatomy of the previous lesson."
    ),
    sections=(
        ReadingSection(
            id="two-regimes",
            figure=Figure(
                stem="org1-kinetic-thermo",
                caption=(
                    "The two-exit landscape drawn from the text: a low pass to a shallow well against a high pass to a deep one."
                ),
                alt="Energy diagram with one starting point, a lower barrier to a shallow product well and a higher barrier to a deeper well.",
            ),
            heading="The two regimes, on one diagram",
            body=(
                "Draw one starting valley with two exit passes: a "
                "lower pass leading to a shallower product valley, "
                "and a higher pass leading to a deeper one. The "
                "kinetic product owns the lower barrier - it forms "
                "faster - while the thermodynamic product owns the "
                "deeper valley - it is more stable. When the two "
                "roles land on the same product there is nothing to "
                "discuss; the interesting chemistry is when they "
                "split, and the split is common because the factors "
                "that lower a barrier (less crowding at the "
                "transition state, a more accessible site) are not "
                "the factors that deepen a valley (more "
                "substitution, better delocalisation).\n\n"
                "Which product accumulates depends on "
                "reversibility. Run the reaction cold, briefly, or "
                "with an irreversible bond-forming step, and "
                "molecules take the low pass and STAY - the "
                "product ratio mirrors the barrier heights, and "
                "the kinetic product wins. Run it hot, long, or "
                "under conditions where the products can revert, "
                "and molecules eventually sample both valleys; "
                "population drains into the deeper one regardless "
                "of which pass was crossed first, and the "
                "thermodynamic product wins. Same substrate, same "
                "products, opposite majors - the conditions line "
                "of the question is doing all the work."
            ),
        ),
        ReadingSection(
            id="requirements",
            heading="What each regime requires, precisely",
            body=(
                "Thermodynamic control has a strict prerequisite "
                "that students routinely forget: EQUILIBRATION must "
                "be possible on the reaction's timescale. That "
                "means either the product-forming step is "
                "reversible under the conditions, or some pathway "
                "(an added catalyst, excess acid, heat) "
                "interconverts the products. No reversibility, no "
                "thermodynamic control - however stable the "
                "alternative product may be, a reaction that "
                "cannot revisit its first commitment ships the "
                "kinetic ratio forever. Conversely, kinetic "
                "control is the default of irreversible chemistry "
                "and of any reaction quenched before equilibration "
                "- which is why 'low temperature, short time' is "
                "the recurring exam shorthand for it.\n\n"
                "Temperature deserves its own sentence because it "
                "acts twice. Raising temperature speeds crossing "
                "of ALL barriers - including the reverse barriers "
                "- which is what unlocks equilibration; and it "
                "also flattens selectivity between competing "
                "passes, since $e^{-\\Delta\\Delta G^\\ddagger/RT}$ "
                "shrinks as T grows. Both actions push hot "
                "reactions toward thermodynamic outcomes, cold "
                "reactions toward kinetic ones, and the exam's "
                "cold/hot dichotomy is compressed physics rather "
                "than arbitrary convention."
            ),
        ),
        ReadingSection(
            id="applications",
            figure=Figure(
                stem="org1-alkene-stability",
                caption=(
                    "Product-stability data reaching into product-like transition states: the ladder Zaitsev ratios follow."
                ),
                alt="Hydrogenation enthalpy bar chart reused for elimination product prediction.",
            ),
            heading="Where the framework bites in this course",
            body=(
                "The framework's showcase arrives with conjugated "
                "dienes in Organic II: HBr adds to 1,3-butadiene "
                "giving the 1,2-product fastest (the nucleophile "
                "captures the allylic cation at the carbon nearest "
                "the charge) but the 1,4-product is the more "
                "substituted, more stable alkene - cold conditions "
                "deliver 1,2, warm conditions deliver 1,4, and the "
                "measured crossover is the textbook demonstration "
                "that both regimes are real. Before then, the idea "
                "already organises several facts: Zaitsev "
                "elimination ratios reflect product stability "
                "reaching back into product-like transition states "
                "(Hammond's bridge between the regimes); "
                "acid-catalysed hydration's reversibility is "
                "exactly what lets equilibrium - and Le Chatelier "
                "- decide direction; and enolate chemistry will "
                "hand over kinetic and thermodynamic enolates as "
                "deliberately selectable species, chosen by base "
                "and temperature.\n\n"
                "The working checklist for any two-product "
                "question: identify both products; decide which "
                "is more stable (substitution, delocalisation); "
                "decide which forms faster (usually the one from "
                "the better intermediate or less hindered attack); "
                "then read the conditions for reversibility and "
                "temperature and let them pick the winner. Four "
                "boxes, filled in order, and the 'surprising' "
                "temperature-dependence questions stop being "
                "surprising."
            ),
            important=(
                "'More stable product' NEVER suffices as a "
                "prediction by itself. Always pair it with the "
                "reversibility check: stability only wins when "
                "equilibration is possible."
            ),
        ),
        ReadingSection(
            id="selectivity-arithmetic",
            heading="Putting numbers on selectivity",
            body=(
                "The framework becomes quantitative with one "
                "equation: for two pathways out of a common "
                "starting material, the kinetic product ratio is "
                "set by the DIFFERENCE in barrier heights, "
                "$\\text{ratio} = e^{-\\Delta\\Delta "
                "G^\\ddagger / RT}$. At room temperature the "
                "5.7 kJ/mol currency from chapter 3 applies "
                "directly: a 5.7 kJ/mol gap between transition "
                "states buys a 10:1 preference, 11.4 buys "
                "100:1, and a mere 2.8 buys about 3:1. Read "
                "backwards, measured product ratios REPORT "
                "transition-state energy gaps - a 95:5 mixture "
                "announces a gap near 7 kJ/mol - and this "
                "inversion is how physical organic chemists "
                "map energy surfaces from bottles of product. "
                "The same arithmetic under thermodynamic "
                "control uses the PRODUCT energy difference "
                "instead: equilibrated 2-butenes sit near 76:24 "
                "trans:cis because the isomers differ by about "
                "4 kJ/mol. One exponential, two applications, "
                "and the regime decides which energy difference "
                "gets plugged in.\n\n"
                "Temperature's role also becomes calculable. "
                "Raising T shrinks every exponent, so a 10:1 "
                "kinetic preference at room temperature erodes "
                "toward 4:1 near 100 C even before "
                "equilibration unlocks - selectivity decays "
                "with heat REGARDLESS of control regime, which "
                "is why low temperature is the universal "
                "friend of selective synthesis and why "
                "'reflux overnight' in a procedure signals "
                "that thermodynamics has been invited to "
                "preside. The habits to take forward: convert "
                "every qualitative 'major/minor' claim you "
                "meet into an implied energy gap, sanity-check "
                "it against the 5.7 rule, and treat any "
                "reported ratio that implies an implausible "
                "gap as a flag that some assumption - common "
                "intermediate, single mechanism, true "
                "equilibration - has failed. Numbers keep the "
                "framework honest, and the framework returns "
                "the favour by making the numbers memorable.\n\n"
                "Close by locating the framework's boundaries, "
                "because knowing where a tool stops is part of "
                "owning it. The analysis assumes the two "
                "products come from a COMMON species - different "
                "starting materials racing is a different "
                "problem - and it assumes the barrier and "
                "stability differences are fixed as conditions "
                "vary, which fails when solvent or catalyst "
                "changes re-rank the transition states "
                "themselves. It also says nothing about "
                "MECHANISM: kinetic versus thermodynamic control "
                "is about outcomes of competing pathways, not "
                "about whether those pathways are concerted or "
                "stepwise. Exam items that seem to break the "
                "framework are usually violating one of these "
                "three assumptions in plain sight, and naming "
                "the violated assumption is the sophisticated "
                "answer. Used inside its boundaries, the "
                "framework is among the most reliable predictive "
                "instruments the course provides - two energies "
                "and a reversibility check, in exchange for the "
                "product distribution of any branching reaction "
                "you will meet. Commit the 5.7 rule and the "
                "common-intermediate check to memory as a pair, "
                "and the framework travels with you into enolate "
                "chemistry, diene additions, and every "
                "temperature-dependence question the MCAT can "
                "field - the same two tools, reapplied without "
                "modification. Few frameworks in the course "
                "offer that ratio of coverage to machinery - "
                "two energies and one check explaining product "
                "switches across a dozen reaction families - "
                "and fewer still are tested as reliably: some "
                "version of cold-versus-hot appears on "
                "essentially every organic exam written, which "
                "makes this lesson's arithmetic among the "
                "safest points on the syllabus to bank in "
                "advance. Bank them: read the temperature, name "
                "the regime, plug the right energy difference "
                "into one exponential, and move on. Speed here "
                "is earned understanding, not shortcut: the "
                "fast answer and the deep answer are the same "
                "answer, which is the mark of a framework worth "
                "owning outright rather than renting from a "
                "formula sheet. Owned frameworks answer "
                "rephrased questions; rented ones only answer "
                "the phrasing they came with."
            ),
        ),
    ),
    key_takeaways=(
        "Kinetic product = lower barrier, forms faster; thermodynamic product = deeper valley, more stable - often different products.",
        "Cold/short/irreversible -> kinetic ratio locked in; hot/long/reversible -> population drains to the stable product.",
        "Thermodynamic control REQUIRES accessible reversibility; without it, stability arguments are void.",
        "Temperature both unlocks equilibration and flattens selectivity - two reasons heat favours the thermodynamic outcome.",
        "Checklist: name both products, rank stability, rank formation speed, read conditions - then predict.",
    ),
    exam_tips=(
        "Any question pairing the same reactants at two temperatures is this lesson: cold answer = kinetic product, hot answer = thermodynamic product.",
        "The diene 1,2-vs-1,4 addition is the canonical MCAT instance - recognise it on sight and map the temperatures to the regimes.",
    ),
))


# --------------------------------------------------------------------------
# 4.11 Catalytic hydrogenation
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.HYDROGENATION",
    lead=(
        "Catalytic hydrogenation adds H2 across a double bond and turns "
        "an alkene into an alkane - the cleanest, most reliable "
        "reduction in the course, run industrially on millions of "
        "tonnes and in laboratories on milligrams. Its interest for us "
        "is threefold: the surface mechanism that explains its "
        "stereochemistry, the syn-addition outcome itself, and the "
        "thermochemical data it generates - the heats of hydrogenation "
        "that ranked alkene stability two lessons ago."
    ),
    sections=(
        ReadingSection(
            id="surface-mechanism",
            heading="The surface mechanism and why a catalyst is needed",
            body=(
                "Mixing an alkene with hydrogen gas alone "
                "accomplishes nothing: the overall reaction is "
                "exothermic by 110-140 kJ/mol, but the uncatalysed "
                "path would require breaking the strong H-H bond "
                "(436 kJ/mol) without help, a barrier no reasonable "
                "temperature crosses. The metal catalyst - finely "
                "divided palladium on carbon, platinum, or nickel - "
                "solves the problem at its surface: H2 adsorbs and "
                "dissociates into two metal-bound hydrogen atoms "
                "(the H-H bond is broken in exchange for M-H "
                "bonds), the alkene adsorbs flat through its pi "
                "system, and the two hydrogens transfer stepwise to "
                "the SAME face of the coordinated double bond, "
                "after which the saturated product, holding the "
                "metal with nothing, drifts away. The catalyst "
                "emerges unchanged, having replaced one impossible "
                "step with several feasible ones - the catalysis "
                "lesson's definition made concrete. The transformation is $C_nH_{2n} + H_2 \\rightarrow C_nH_{2n+2}$ with $\\Delta H \\approx -110$ to $-137$ kJ/mol per double bond - exothermic overall, blocked only by the uncatalysed barrier.\n\n"
                "These are heterogeneous catalysts - a solid "
                "working on dissolved reactants - which brings "
                "practical virtues (filter the metal off when "
                "done) and the characteristic sensitivity: surface "
                "area is everything, hence 'finely divided', and "
                "surface poisons like sulfur compounds kill "
                "activity by occupying the very sites the "
                "mechanism needs."
            ),
        ),
        ReadingSection(
            id="syn-addition",
            heading="Syn addition: the stereochemical signature",
            body=(
                "Because both hydrogens arrive from the metal "
                "surface, they add to the same face of the double "
                "bond: hydrogenation is a syn (same-face) "
                "addition. The consequence becomes visible the "
                "moment the product carries stereocentres. "
                "Hydrogenate 1,2-dimethylcyclohexene and the two "
                "methyls, pinned on the ring while the hydrogens "
                "add to one face, emerge CIS to each other - the "
                "syn delivery is stamped into the product's "
                "stereochemistry and separable from the anti "
                "alternative. Chapter 6 will build the vocabulary "
                "to name these outcomes precisely; the fact to "
                "carry from here is that the MECHANISM (surface "
                "delivery) dictates the STEREOCHEMISTRY (syn), a "
                "pattern - mechanism implies stereochemistry - "
                "that chapter 5 repeats with anti-adding bromine "
                "and syn-adding borane.\n\n"
                "Selectivity completes the practical picture: "
                "under ordinary conditions the reaction reduces "
                "alkenes and alkynes but leaves aromatic rings, "
                "carbonyls, esters and nitriles untouched - pi "
                "bonds are not all equal, and the aromatic ring's "
                "special stability (Organic II's opening subject) "
                "protects it. That chemoselectivity is why "
                "hydrogenation can count double bonds in an "
                "unknown (each consumes one equivalent of H2) "
                "without dismantling the rest of the molecule, "
                "and why partial hydrogenation of vegetable oils "
                "can target some double bonds - with the trans-fat "
                "isomerisation side effect that made the process "
                "notorious."
            ),
        ),
        ReadingSection(
            id="thermochemistry-and-uses",
            figure=Figure(
                stem="org1-aromatic-shortfall",
                caption=(
                    "Benzene against three hypothetical cyclohexene reductions: the ~150 kJ/mol shortfall is aromatic stabilisation, measured."
                ),
                alt="Bar chart comparing one cyclohexene, three times cyclohexene, and benzene's measured hydrogenation heat.",
            ),
            heading="Thermochemistry and the reaction's two jobs",
            body=(
                "Hydrogenation's heat output is data. Because the "
                "reaction converts isomeric alkenes to a common "
                "alkane, measured heats of hydrogenation rank "
                "alkene stabilities - the table two lessons back "
                "was built exactly this way, and the logic "
                "(common product, so released heat reads starting "
                "energy) is the same common-endpoint trick as "
                "combustion comparisons. The measurement even "
                "quantifies aromatic stabilisation: benzene's "
                "actual heat of hydrogenation falls far short of "
                "three times cyclohexene's, and the shortfall - "
                "about 150 kJ/mol - is the empirical size of "
                "aromaticity, a number Organic II will lean on "
                "heavily.\n\n"
                "The reaction's two jobs in synthesis follow from "
                "everything above. As a transformation: the "
                "dependable way to delete a double bond after it "
                "has served its purpose - alkenes are versatile "
                "handles, and hydrogenation is how the handle is "
                "removed cleanly at the end. As an analytical "
                "tool: hydrogen uptake counts pi bonds, "
                "distinguishing rings from double bonds within an "
                "unsaturation number, exactly as the alkene-"
                "bonding lesson promised. Reagent shorthand for "
                "exams: H2 with Pd/C (or Pt, or Ni) means full "
                "syn reduction of alkenes and alkynes; the "
                "special partial-reduction catalysts for stopping "
                "at an alkene arrive with the alkyne chapter."
            ),
        ),
        ReadingSection(
            id="beyond-simple-reduction",
            figure=Figure(
                stem="org1-alkene-stability",
                caption=(
                    "The ranking data hydrogenation itself generates - the reaction as measurement."
                ),
                alt="Hydrogenation enthalpy chart reused in the reduction-family context.",
            ),
            heading="Partial, transfer, and asymmetric hydrogenation",
            body=(
                "Three refinements turn the blunt tool precise, "
                "and each previews chemistry ahead. Partial "
                "reduction: alkynes hydrogenate through the "
                "alkene, and stopping there is a solved problem "
                "- Lindlar's catalyst, palladium deliberately "
                "poisoned with lead salts and quinoline, "
                "reduces an alkyne to the CIS alkene and stops, "
                "the poison tuning surface activity down to "
                "where the less reactive alkene survives. The "
                "complementary dissolving-metal reduction "
                "(sodium in ammonia) delivers the TRANS alkene "
                "by a radical-anion mechanism with no surface "
                "at all. The pair - same alkyne, either alkene "
                "geometry to order - is the alkyne chapter's "
                "headline and makes poisoning a design "
                "instrument rather than a failure mode.\n\n"
                "Transfer hydrogenation replaces hydrogen gas "
                "with an organic donor - ammonium formate, "
                "isopropanol - that unloads H2 equivalents at "
                "the same metal, a practical convenience "
                "(no pressurised gas) with identical logic. "
                "And asymmetric hydrogenation crowns the "
                "family: soluble rhodium and ruthenium "
                "complexes carrying chiral phosphine ligands "
                "reduce prochiral alkenes to a SINGLE "
                "enantiomer of product, the innovation behind "
                "the industrial synthesis of L-DOPA and a "
                "Nobel Prize. The conceptual content is "
                "chapter 6's in preview: a chiral catalyst "
                "makes the two faces of a planar alkene "
                "diastereotopic in the transition state, so "
                "syn delivery to one face outraces the other. "
                "Food chemistry supplies the cautionary coda: "
                "industrial partial hydrogenation of vegetable "
                "oils allowed adsorbed alkenes to desorb "
                "half-reacted, isomerised to trans fats - "
                "surface mechanism, incomplete turnover, "
                "public-health consequence - a chain of "
                "reasoning that runs directly from this "
                "lesson's mechanism to a food label.\n\n"
                "For working problems, consolidate the reagent "
                "grammar. H2 with Pd/C, Pt or Ni: full syn "
                "reduction of every alkene and alkyne present, "
                "arenes and carbonyls untouched. H2 with "
                "Lindlar: alkynes to cis alkenes, existing "
                "alkenes largely spared relative to alkynes, "
                "stop there. Na/NH3: alkynes to trans alkenes, "
                "no surface involved. Counting questions: "
                "moles of H2 consumed equals pi bonds reduced, "
                "and any unsaturation surviving exhaustive "
                "H2/Pd is rings or aromatic. Stereochemistry "
                "questions: the two added hydrogens are cis to "
                "each other, so ring substituents retained "
                "through the reduction keep the relationship "
                "syn delivery dictates. Five lines of grammar, "
                "and essentially every hydrogenation item in "
                "the first year resolves to one of them - the "
                "measure of a reaction the field has fully "
                "domesticated. Domesticated does not mean "
                "trivial: the surface mechanism still explains "
                "every entry in the grammar, and reciting the "
                "grammar WITH its mechanistic reasons - syn "
                "because surface delivery, chemoselective "
                "because pi-bond binding strength, counting "
                "because stoichiometric uptake - is what "
                "separates understanding from flashcards when "
                "the question is phrased one degree off the "
                "standard form. The reduction family will keep "
                "growing - hydrides for carbonyls, dissolving "
                "metals for alkynes, enzymes for everything in "
                "biochemistry - and catalytic hydrogenation is "
                "the template each new member gets compared "
                "against: what is delivered, from what surface "
                "or reagent, to which face, sparing which "
                "groups. Learn the template once, ask the four "
                "questions forever. That questioning frame is "
                "cheap insurance against the reduction "
                "chapter's growing cast of reagents. Templates "
                "scale where lists do not: the fourth reducing "
                "agent you meet costs a minute to file, the "
                "fourteenth costs the same minute, and the "
                "unfiled alternative costs points forever. "
                "Four questions, asked of every reducing "
                "agent, for the rest of the course. Template thinking "
                "is how a finite student keeps pace with an "
                "expanding syllabus without ever feeling it "
                "expand."
            ),
        ),
    ),
    key_takeaways=(
        "The metal surface dissociates H2 and delivers both hydrogens to one face: syn addition is the mechanism's stereochemical signature.",
        "The catalyst replaces one impossible step (unassisted H-H cleavage) with feasible surface steps and is regenerated - textbook catalysis.",
        "Chemoselective under standard conditions: alkenes and alkynes reduce; aromatic rings, carbonyls and nitriles survive.",
        "Heats of hydrogenation rank alkene stability and measure aromatic stabilisation (~150 kJ/mol for benzene).",
        "Two jobs: delete double bonds in synthesis, count them in analysis (one H2 per pi bond).",
    ),
    exam_tips=(
        "Ring-substrate hydrogenation questions are testing syn addition: the two new hydrogens (and therefore the retained groups) end up cis.",
        "If a question's molecule contains both an alkene and an arene, H2/Pd reduces only the alkene - the ring's survival is the tested fact.",
    ),
))


# --------------------------------------------------------------------------
# 4.12 Catalysis
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.CATALYSIS",
    lead=(
        "A catalyst accelerates a reaction without being consumed - a "
        "definition every student can recite and many quietly "
        "misapply. The load-bearing content is in the two clauses that "
        "follow: a catalyst works by providing a lower-barrier PATHWAY, "
        "and it therefore changes how FAST equilibrium is reached while "
        "leaving WHERE equilibrium lies untouched. This lesson nails "
        "the energetics, tours the three catalyst families, and "
        "collects the course's examples under one roof."
    ),
    sections=(
        ReadingSection(
            id="what-catalysts-do",
            figure=Figure(
                stem="org1-catalysed-curve",
                caption=(
                    "The whole lesson in one picture: a cheaper route between unmoved endpoints."
                ),
                alt="Catalysed versus uncatalysed reaction-coordinate comparison.",
            ),
            heading="What a catalyst does: new path, same endpoints",
            body=(
                "On the energy diagram a catalyst redraws the "
                "middle of the curve and leaves the ends alone. It "
                "opens an alternative route - usually with more "
                "steps, each over a lower summit - whose highest "
                "barrier sits below the uncatalysed one; rate "
                "rises accordingly, often by many orders of "
                "magnitude. The reactant and product valleys, "
                "though, are properties of the molecules "
                "themselves, and no catalyst moves them: "
                "$\\Delta G$, and with it the equilibrium constant, "
                "is untouchable by catalysis. The immediate "
                "corollary is symmetry: lowering the pass lowers "
                "it from BOTH sides, so every catalyst of a "
                "forward reaction catalyses the reverse identically "
                "- which is why the same acid that catalyses "
                "hydration catalyses dehydration, with the "
                "position of the resulting equilibrium set by "
                "concentrations and Le Chatelier, never by the "
                "catalyst.\n\n"
                "Mechanistic bookkeeping identifies a catalyst on "
                "sight: it is consumed in an early step and "
                "REGENERATED in a later one, appearing in the "
                "mechanism but cancelling from the overall "
                "equation. The proton in acid-catalysed hydration "
                "is spent protonating the alkene and refunded at "
                "the final deprotonation; the metal surface binds "
                "and releases. Anything consumed stoichiometrically "
                "- however enabling - is a reagent, not a "
                "catalyst, and exam questions probe exactly this "
                "boundary."
            ),
        ),
        ReadingSection(
            id="three-families",
            heading="Three families: heterogeneous, homogeneous, enzymatic",
            body=(
                "Heterogeneous catalysts occupy a different phase "
                "from the reactants - the hydrogenation metals are "
                "the course's example - and work by adsorbing "
                "reactants at surface sites, weakening their bonds "
                "and holding them adjacent. Virtues: trivially "
                "separable, robust, industrially dominant. Costs: "
                "only the surface works, and poisons that occupy "
                "sites (sulfur, lead) disable them - the reason "
                "catalytic converters require unleaded fuel. "
                "Homogeneous catalysts share the reactants' phase: "
                "the acid in hydration, the Lewis acids activating "
                "electrophiles in Organic II's aromatic chemistry, "
                "and the designed transition-metal complexes of "
                "cross-coupling. Virtues: every molecule is an "
                "active site, and selectivity is tunable by "
                "design. Cost: separation from product, a genuine "
                "industrial burden.\n\n"
                "Enzymes are biology's homogeneous catalysts and "
                "the extreme of the craft: rate accelerations of "
                "a millionfold and beyond, achieved by binding the "
                "TRANSITION STATE more tightly than the substrate "
                "- the purest possible illustration that catalysis "
                "is transition-state stabilisation - with "
                "selectivity sharp enough to pick one substrate, "
                "one site and one stereochemical face. The "
                "MCAT-relevant vocabulary maps directly onto this "
                "lesson: enzymes lower activation energy, do not "
                "shift equilibria, are regenerated, and are "
                "poisoned by inhibitors exactly as surfaces are."
            ),
        ),
        ReadingSection(
            id="course-inventory",
            heading="The course's catalytic inventory, and what it cannot do",
            body=(
                "Collecting the course's catalysts in one list "
                "makes the pattern visible. Seen already: the "
                "hydrogenation metals (heterogeneous, new surface "
                "pathway). Arriving in chapter 5: the acid of "
                "hydration (homogeneous, converts a non-"
                "electrophile into a cation via protonation) and "
                "mercury in oxymercuration (opens a cation-free "
                "route). Ahead: Lewis acids in electrophilic "
                "aromatic substitution, palladium complexes in "
                "cross-coupling, and the enzyme examples the "
                "biochemistry-facing chapters use. In every case "
                "the catalyst's job description is identical - "
                "provide a cheaper transition state - while the "
                "chemical trick differs: donate a proton, accept "
                "electron density, offer a surface, preorganise "
                "the reactants.\n\n"
                "Equally important is the negative space: what no "
                "catalyst can do. It cannot make an endergonic "
                "reaction spontaneous - coupling to a favourable "
                "reaction does that, which is ATP's job in "
                "biochemistry, not catalysis. It cannot change "
                "product ratios AT equilibrium - though it can "
                "change which product a kinetically controlled "
                "reaction traps, by opening a selective pathway, "
                "which is precisely how selective catalysts earn "
                "their keep and why the previous lesson's "
                "kinetic/thermodynamic distinction matters here. "
                "And it cannot survive stoichiometric consumption "
                "- if it is used up, rename it a reagent. Hold "
                "the job description and the three impossibilities "
                "together and every catalysis question in the "
                "course reduces to bookkeeping."
            ),
            important=(
                "A catalyst changes the rate of approach to "
                "equilibrium, never the position of equilibrium. "
                "Any answer choice with a catalyst 'shifting' K "
                "is wrong by thermodynamics, not by detail."
            ),
        ),
        ReadingSection(
            id="cycles-and-numbers",
            figure=Figure(
                stem="org1-radical-chain",
                caption=(
                    "A loop with a regenerated carrier: the chain diagram shares the cycle grammar every catalytic drawing uses."
                ),
                alt="Radical chain loop diagram illustrating cycle-style bookkeeping.",
            ),
            heading="Catalytic cycles, turnover, and quantified failure",
            body=(
                "Working chemists draw catalysis as a CYCLE "
                "rather than a line: the catalyst's resting "
                "state binds a reactant, transforms it through "
                "one or more catalyst-bound intermediates, "
                "releases product, and returns to the resting "
                "state, ready again. The cycle drawing makes "
                "regeneration structural - the loop closes or "
                "the species is not a catalyst - and it "
                "localises understanding: rate is set by the "
                "cycle's slowest arc, poisons act by parking "
                "the catalyst in a dead-end state off the "
                "loop, and improving a catalyst means "
                "re-engineering one arc rather than the whole "
                "chemistry. Organic II's palladium cycles "
                "(oxidative addition, transmetalation, "
                "reductive elimination) will be presented "
                "exactly this way, and reading them will feel "
                "routine because the grammar arrived here.\n\n"
                "Two numbers quantify catalytic performance. "
                "Turnover number (TON): how many product "
                "molecules one catalyst molecule delivers "
                "before dying - thousands for workhorse "
                "industrial systems, millions for the best "
                "enzymes. Turnover frequency (TOF): turnovers "
                "per unit time, the catalyst's speed rating. "
                "Together they justify economics that "
                "otherwise look absurd - rhodium costs more "
                "than gold, yet a TON of a hundred thousand "
                "amortises the metal into irrelevance - and "
                "they price failure precisely: a poison that "
                "kills a catalyst after ten turnovers has "
                "destroyed a hundred thousand products' worth "
                "of value. Inhibition arrives in matching "
                "flavours - reversible (competitor binds the "
                "resting state; wash it out and activity "
                "returns) versus irreversible (sulfur on "
                "platinum; the site is gone) - vocabulary "
                "that transfers verbatim to enzyme kinetics "
                "on the MCAT. And autocatalysis closes the "
                "conceptual set: when a PRODUCT catalyses its "
                "own formation, rate accelerates as reaction "
                "proceeds - the S-shaped progress curves of "
                "some acid-releasing hydrolyses - a reminder "
                "that 'catalyst' names a role in a mechanism, "
                "and roles can be filled from inside the "
                "reaction as well as from the reagent shelf.\n\n"
                "The lesson's compact final form: when any "
                "question mentions a catalyst, run four checks "
                "in order. Endpoints unmoved? (If an answer "
                "shifts K, it is wrong.) Regenerated in the "
                "mechanism? (If consumed, rename it a "
                "reagent.) Both directions accelerated? (If a "
                "choice claims one-way catalysis, it is "
                "wrong.) And which arc of the cycle is the "
                "question actually probing - binding, "
                "transformation, release, or poisoning? Four "
                "checks, ten seconds, and every catalysis "
                "item from freshman chemistry through the "
                "MCAT's enzyme kinetics reduces to bookkeeping "
                "on a loop. That is what this lesson was for - "
                "and the loop image is the part to keep: every "
                "catalyst in this course, metal or proton or "
                "enzyme, is a species that travels in a circle "
                "while substrates travel through, and every "
                "question about one is a question about where "
                "on the circle the story sits. Bind, transform, "
                "release, return: four arcs, one grammar, every "
                "catalyst this course or the MCAT will ever show "
                "you - and a question located on its arc is a "
                "question already half answered."
            ),
        ),
        ReadingSection(
            id="closing-note-catalysis",
            heading="A closing note",
            body=(
                "Keep the lesson's one-sentence core where you can "
                "recite it: a catalyst is a regenerated participant "
                "that lowers barriers without moving endpoints. "
                "Twelve words, four testable claims, and every "
                "catalysis question in the course is an "
                "application of one of them."
            ),
        ),
        ReadingSection(
            id="last-word-catalysis",
            heading="The last word",
            body=(
                "Loops, levers, limits: remember the catalyst by "
                "what it circles, what it lowers, and what it can "
                "never touch."
            ),
        ),
    ),
    key_takeaways=(
        "Catalysts open lower-barrier pathways; endpoints, delta-G and K are untouched - and both directions accelerate equally.",
        "Identify a catalyst mechanistically: consumed early, regenerated late, absent from the overall equation.",
        "Heterogeneous = surface (separable, poisonable); homogeneous = same phase (tunable, hard to separate); enzymes = transition-state binding perfected.",
        "Catalysts cannot make endergonic reactions favourable or move equilibrium ratios - only coupling or conditions can.",
        "One job description across the course - cheaper transition state - implemented by protons, Lewis acids, surfaces and enzymes.",
    ),
    exam_tips=(
        "Energy-diagram catalysis questions: the correct curve lowers summits only - any choice moving reactant or product levels is eliminated instantly.",
        "MCAT enzyme stems are this lesson in biological dress: lower Ea, unchanged Keq, regenerated catalyst, inhibitors as poisons.",
    ),
))

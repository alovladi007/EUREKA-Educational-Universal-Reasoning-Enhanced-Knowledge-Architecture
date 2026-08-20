"""Lecture-note depth for ORG1 chapter 3, Acids and Bases.

Tranche 1 of the organic depth programme (docs/organic_depth_benchmark.md).
Scope checked against the benchmark's chapter-3 section list (Lewis and
Bronsted acid-base chemistry, the curved-arrow notation, equilibrium and
free energy, and the structural analysis of acidity); all prose authored
for OCTET.

pKa values are aqueous, from the standard compilations, and consistent with
the values the arc lessons and app.data.claims already use (acetic acid
4.76, ethanol 15.9). Free-energy arithmetic uses R = 8.314 J/(mol K).
"""

from __future__ import annotations

from app.data.lesson_extras import (
    Figure,
    LessonExtras,
    ReadingSection,
    Table,
)

EXTRAS_ORG1_CH3: dict[str, LessonExtras] = {}


def _add(extras: LessonExtras) -> None:
    EXTRAS_ORG1_CH3[extras.node] = extras


# --------------------------------------------------------------------------
# 3.1 Curved arrows
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.ARROWS",
    lead=(
        "The curved arrow is the grammar of this entire subject. Every "
        "mechanism in the next twenty-plus chapters is written in it, and "
        "students who lose points on mechanisms overwhelmingly lose them "
        "here, on grammar, not on chemistry. The rule set is tiny: an "
        "arrow shows where an electron pair goes, tail on the pair, head "
        "on the destination. This chapter teaches the two sentence types "
        "the grammar can form - association and displacement - and then "
        "puts the notation to work on the one task where it proves itself "
        "immediately: generating resonance structures instead of "
        "memorising them."
    ),
    sections=(
        ReadingSection(
            id="arrow-grammar",
            figure=Figure(
                stem="org1-arrow-grammar",
                caption=(
                    "The two legal sentences: one arrow into an empty orbital (association), paired arrows when a full octet must be defended (displacement)."
                ),
                alt="Schematic of association with one curved arrow and displacement with two curved arrows including a leaving group.",
            ),
            heading="Tail, head, and the two legal sentences",
            body=(
                "A curved arrow starts at an electron pair - a lone pair "
                "or a bond, never at an atom label and never at a positive "
                "charge - and ends where that pair will be after the step: "
                "on an atom, forming a new lone pair, or between two "
                "atoms, forming a new bond. Charges are consequences, not "
                "actors; electrons move, and the formal charges update "
                "themselves in the product because you recount them "
                "there. The bookkeeping check is unforgiving and takes "
                "five seconds: every atom in the product obeys the octet "
                "rule (no carbon with five bonds, ever), and the total "
                "charge on the left of the step equals the total charge "
                "on the right.\n\n"
                "With that grammar, only two sentence shapes exist for "
                "polar chemistry. The first is association: a species "
                "with an available pair donates it to a species with an "
                "empty orbital, one arrow, new bond. The reverse - one "
                "arrow from a bond onto one of its own atoms - is "
                "dissociation. The second shape is displacement, needed "
                "whenever the atom under attack already has a full "
                "octet: the incoming pair's arrow must be accompanied by "
                "a second arrow taking some pair away from that atom. "
                "Count the arrows and you know the sentence: one arrow "
                "means an empty orbital was available; two or more mean "
                "an octet was defended. Almost every mechanistic error "
                "in a first course is a violation of exactly this "
                "pairing."
            ),
        ),
        ReadingSection(
            id="association-steps",
            heading="Association: Lewis acids meet Lewis bases",
            body=(
                "A Lewis base is an electron-pair donor; a Lewis acid is "
                "an electron-pair acceptor. The cleanest acceptors are "
                "genuinely electron-deficient: boron in $BF_3$ holds six "
                "valence electrons and an empty 2p orbital, aluminium in "
                "$AlCl_3$ likewise, and a carbocation's central carbon "
                "is the organic chemist's own example. When ammonia "
                "donates its lone pair to boron trifluoride, one arrow "
                "runs from the nitrogen lone pair to the space between N "
                "and B; the product holds a new N-B bond, nitrogen now "
                "formally +1, boron formally -1, net charge unchanged. "
                "No arrow left boron, because boron had an empty orbital "
                "and defended nothing.\n\n"
                "This single step already explains reagents that will "
                "matter for semesters: the Lewis-acid catalysts of "
                "chapter 7 in Organic II ($AlCl_3$ activating an acyl "
                "chloride, $FeBr_3$ activating bromine) work by exactly "
                "this association, and every carbocation capture in "
                "chapters 4, 5 and 9 - water attacking a cation, halide "
                "attacking a cation - is the same one-arrow sentence "
                "with carbon as the acid. Recognising 'empty orbital, "
                "therefore association, therefore one arrow' converts a "
                "memorised step into a predicted one."
            ),
        ),
        ReadingSection(
            id="displacement-steps",
            figure=Figure(
                stem="org1-nucleophile-gallery",
                caption=(
                    "Six recurring nucleophiles, drawn from their structures: every one attacks through the atom its lone pair sits on."
                ),
                alt="Grid of hydroxide, water, ammonia, cyanide, iodide and methanethiolate structures.",
            ),
            heading="Displacement: attacking a full octet",
            body=(
                "Most atoms organic chemistry attacks are not electron-"
                "deficient. The carbon of methyl bromide has four bonds "
                "and eight electrons; a proton on acetic acid is bonded "
                "to oxygen already. Donating a pair to such an atom "
                "requires simultaneous eviction: the arrow in and an "
                "arrow out, with the evicted pair leaving on what is "
                "called the leaving group. Hydroxide attacking methyl "
                "bromide is the canonical two-arrow sentence - one arrow "
                "from the oxygen lone pair to carbon, one from the C-Br "
                "bond onto bromine - and it is the skeleton of the SN2 "
                "reaction three chapters early. A proton transfer is the "
                "same sentence with hydrogen as the contested atom: "
                "arrow from base lone pair to H, arrow from the H-A bond "
                "back onto A.\n\n"
                "The displacement sentence introduces the course's three "
                "recurring role names. The electron-pair donor is the "
                "nucleophile ('nucleus-seeking'); the species accepting "
                "the attack is the electrophile; the fragment that "
                "departs with the evicted pair is the leaving group. "
                "The roles are per-step job titles, not identities - "
                "water is a nucleophile in one step and a leaving group "
                "two steps later - and tracking who holds which job in "
                "each step is what reading a mechanism means."
            ),
            important=(
                "Never draw an arrow toward an atom that keeps its full "
                "octet without drawing the partner arrow that clears "
                "room. One-arrow attacks on tetravalent carbon are the "
                "single most common mechanism error."
            ),
        ),
        ReadingSection(
            id="arrows-resonance",
            heading="Deriving resonance structures with arrows",
            body=(
                "Chapter 1 presented resonance structures as things to "
                "recognise. The arrow notation upgrades them to things "
                "you generate. Within one resonance family the atoms "
                "never move - only pi bonds and lone pairs do - so the "
                "legal moves reduce to three: lone pair becomes an "
                "adjacent pi bond, pi bond becomes a lone pair, pi bond "
                "shifts over one position. Apply a legal move, recount "
                "formal charges, and the new structure is derived, not "
                "remembered. Acetate is the standard drill: an arrow "
                "from a lone pair on the O-minus into the C-O bond and "
                "an arrow from the C=O pi bond onto the far oxygen "
                "exchange the two oxygens' roles, proving they are "
                "equivalent - which is why both carboxylate C-O bonds "
                "measure the same length and why chapter 3's acidity "
                "story leans on this anion.\n\n"
                "The same three moves generate the allyl cation's two "
                "structures, an enolate's two, and every EAS "
                "intermediate's three in Organic II. Two disciplines "
                "keep the tool honest. First, arrows within a resonance "
                "family describe no physical event - the molecule is "
                "always the weighted hybrid, and the arrows are "
                "bookkeeping between drawings of it. Second, structures "
                "that require breaking a sigma bond or moving an atom "
                "are not resonance structures; they are different "
                "compounds, and confusing the two collapses the "
                "distinction between resonance and reaction that the "
                "whole notation exists to keep clear."
            ),
        ),
        ReadingSection(
            id="arrow-debugging",
            heading="Debugging arrows: the five-check routine",
            body=(
                "Fluency comes from checking drawings the way a compiler "
                "checks code, so end the lesson with the routine itself. "
                "One: every tail sits on a drawn electron pair - a lone "
                "pair or a bond - never on an atom label, never on a "
                "charge symbol. Two: every head lands on an atom or "
                "between two atoms; an arrow into empty space moves "
                "electrons to nowhere. Three: recount the octets in the "
                "product - any carbon with five bonds means an eviction "
                "arrow was owed and not paid. Four: sum the formal "
                "charges on each side of the step; the totals must "
                "match, because arrows move electrons and electrons are "
                "conserved. Five: read the step backwards - reversing "
                "every arrow should describe the reverse reaction "
                "sensibly, and a step that cannot be read backwards is "
                "usually hiding two steps in one drawing.\n\n"
                "The routine also names the habits worth refusing early. "
                "Do not draw arrows that split an electron pair between "
                "two destinations; polar chemistry moves pairs whole, "
                "and the half-headed arrows that move single electrons "
                "belong to the radical chapters, where they are "
                "introduced deliberately. Do not chain more arrows into "
                "one step than the step needs - a proton transfer is "
                "two arrows, a displacement is two, an association is "
                "one, and a drawing with five simultaneous arrows is "
                "almost always three steps flattened into false "
                "concert. Mechanism questions grade the grammar as "
                "much as the chemistry, and the five checks catch "
                "essentially every grammar fault before a grader "
                "does. Run them until they are boring; boring is what "
                "mastered grammar feels like."
            ),
        ),
        ReadingSection(
            id="formal-charge-bookkeeping",
            heading="Arrows and formal charge: the conservation drill",
            body=(
                "The grammar says charges are recomputed, never "
                "pushed - but the recomputation follows a rule so "
                "regular it is worth drilling as arithmetic. When "
                "an arrow makes a new bond, the atom that donated "
                "the pair grows one unit more positive, and when "
                "an arrow takes a pair away entirely, the atom "
                "left behind grows one unit more positive while "
                "the atom receiving the pair as a lone pair grows "
                "one unit more negative. Run it on ammonia "
                "attacking a proton: nitrogen donates, so it "
                "moves from 0 to +1; the H-Cl bond's pair "
                "retreats onto chlorine, which moves from 0 to "
                "-1; hydrogen, which neither donated nor "
                "received a lone pair, stays at 0. Total before, "
                "0; total after, 0. The conservation holds for "
                "every legal step because arrows relocate "
                "electrons without creating or destroying them, "
                "and a step whose charges do not balance is not "
                "a debatable stylistic choice - it is a "
                "conservation-law violation, as wrong as a "
                "bookkeeping ledger that fails to sum.\n\n"
                "Practising the per-atom rule pays off twice. "
                "First, it makes product charges predictable "
                "before drawing them, which catches errors at "
                "the moment they are made rather than at the "
                "final check. Second, it runs in reverse as a "
                "diagnostic: handed a mechanism with charges "
                "already printed - the exam's favourite format - "
                "you can reconstruct which arrows MUST have been "
                "drawn to produce exactly those charges, and "
                "distractor mechanisms betray themselves by "
                "charge patterns no legal arrow set could "
                "generate. Students who internalise 'donor goes "
                "up one, abandoned atom goes up one, receiver "
                "goes down one' stop treating formal charges as "
                "decorations to memorise and start treating "
                "them as the audit trail of the electron flow, "
                "which is precisely what they are."
            ),
        ),
        ReadingSection(
            id="multi-arrow-steps",
            heading="Longer sentences: chaining arrows in one step",
            body=(
                "Association takes one arrow and displacement "
                "two, but the grammar scales: some legitimate "
                "elementary steps run three or more arrows in "
                "genuine concert, and knowing which chains are "
                "legal keeps the extra arrows honest. The "
                "workhorse three-arrow sentence is the E2 "
                "elimination waiting in chapter 9: a base's "
                "pair takes a proton, the freed C-H pair slides "
                "in to become a pi bond, and the C-X pair "
                "departs on the leaving group - three arrows, "
                "one transition state, no intermediate. "
                "Proton-transfer relays do the same in acid "
                "catalysis, where a solvent molecule accepts "
                "one proton while delivering another. The "
                "discipline in every case: each arrow's head "
                "must feed the next arrow's tail atom "
                "coherently, the whole chain must share one "
                "transition state in fact and not merely on "
                "paper, and the charge audit must still "
                "balance across the entire sentence.\n\n"
                "The equal and opposite discipline is refusing "
                "concert where the chemistry is stepwise. "
                "Keto-enol tautomerisation is the standard "
                "trap: the keto and enol forms differ by one "
                "hydrogen's position, and the tempting "
                "single-step drawing - one arrow walking the "
                "H from carbon to oxygen while a second "
                "shuffles the pi bond - describes a "
                "four-centre transition state that the "
                "measured chemistry does not use. The real "
                "mechanism is two steps with a catalyst: "
                "protonate, then deprotonate (in acid), or "
                "deprotonate, then protonate (in base), the "
                "enolate or oxocarbenium living briefly in "
                "between. The general rule the course will "
                "reuse: hydrogens do not migrate directly "
                "between atoms in polar mechanisms without a "
                "carrier, and any drawing that teleports an H "
                "across a molecule in one arrow should be "
                "split into transfer steps. When in doubt, "
                "fewer arrows per step and more steps is the "
                "safer grammar - and more often the true one."
            ),
        ),
        ReadingSection(
            id="fishhook-preview",
            heading="Half-arrows: the radical dialect",
            body=(
                "Polar chemistry moves electron pairs, and the "
                "double-barbed arrow says so. The radical "
                "chapters speak a dialect: single-electron "
                "movements, written with single-barbed "
                "'fishhook' arrows, and the dialect has its own "
                "small grammar worth previewing so the two are "
                "never confused. Homolysis - a bond breaking "
                "evenly, one electron to each partner - takes "
                "two fishhooks peeling in opposite directions "
                "from one bond, and produces two radicals, "
                "each with an unpaired electron and no charge: "
                "where heterolysis manufactures an ion pair, "
                "homolysis manufactures neutrality with "
                "reactivity. Radical steps then chain: an "
                "abstraction step takes one fishhook from the "
                "radical's lone electron, one from the bond "
                "under attack, and one delivering the bond's "
                "other electron onto the abstracted atom's "
                "partner - three half-arrows describing what a "
                "polar step would do with one and a half "
                "full ones.\n\n"
                "The bookkeeping differences are the point of "
                "the preview. Radical steps conserve charge "
                "trivially - everything is usually neutral - "
                "but they conserve the COUNT of unpaired "
                "electrons in a way that becomes the "
                "diagnostic: initiation creates radicals, "
                "propagation passes the unpaired electron "
                "along like a baton, termination destroys two "
                "at once, and the chapter-4 chlorination "
                "mechanism is exactly that three-act "
                "structure. For now the actionable rule is "
                "purely notational: never mix dialects in one "
                "step. A full arrow in a radical mechanism "
                "silently claims a pair moved where only one "
                "electron did; a fishhook in a polar "
                "mechanism claims the reverse. Graders read "
                "the barbs, and so should you - they are the "
                "difference between describing an ion pair "
                "and describing two radicals, which is to "
                "say, between two entirely different "
                "chemistries that happen to share a skeleton."
            ),
        ),
        ReadingSection(
            id="carbonyl-preview",
            heading="The sentence you will write most: addition to C=O",
            body=(
                "One application deserves its preview section, "
                "because it is the single most-reused arrow "
                "sentence in organic chemistry: nucleophilic "
                "addition to the carbonyl. The carbonyl carbon "
                "is electrophilic - oxygen's electronegativity "
                "and the polarised pi bond see to that - but it "
                "holds a full octet, so a nucleophile's arrow "
                "cannot arrive alone. The pi bond supplies the "
                "eviction: as the nucleophile's pair bonds to "
                "carbon, the C=O pi pair retreats onto oxygen "
                "as a third lone pair, and the product is the "
                "tetrahedral alkoxide - carbon now sp3, oxygen "
                "now anionic, ready to be protonated or to "
                "push back. Two arrows, no leaving group "
                "required, the displacement grammar satisfied "
                "by a pi bond's flexibility rather than a "
                "departing fragment. Cyanohydrin formation, "
                "Grignard additions, hydride reductions, "
                "hydration, hemiacetal formation - the first "
                "half of Organic II's carbonyl chemistry is "
                "this identical sentence with different "
                "nucleophiles substituted into the subject "
                "position.\n\n"
                "The reverse sentence matters equally: an "
                "alkoxide's lone pair can push back down to "
                "re-form the pi bond, ejecting whichever "
                "group on that carbon is the best leaver - "
                "the collapse of the tetrahedral "
                "intermediate. Addition forward, collapse "
                "backward, and the pairing composes: "
                "nucleophile adds, intermediate collapses "
                "expelling a different group, and the net "
                "result is substitution AT a carbonyl - the "
                "acyl substitution that carries esters to "
                "amides and acid chlorides to everything. "
                "Students who can write add-then-collapse "
                "fluently have pre-learned perhaps a third "
                "of the second semester in two arrows; the "
                "chapters ahead add selectivity and "
                "catalysis, but never a new sentence shape."
            ),
        ),
        ReadingSection(
            id="resonance-workout",
            heading="A resonance workout, with contributor rankings",
            body=(
                "The three legal moves generate structures; "
                "judgement ranks them, and ranking has its own "
                "short rulebook. Full octets beat empty ones: "
                "a structure where every second-row atom holds "
                "eight electrons outweighs one flaunting a "
                "sextet. Negative charge belongs on the more "
                "electronegative atom, positive on the less. "
                "Fewer charges beat more - charge separation "
                "costs energy - and structures that break "
                "these rules still count, just less, in "
                "proportion to their stability. Run the "
                "rulebook across four workhorses. The enolate: "
                "two structures, charge on carbon or on "
                "oxygen; oxygen's wins the weighting, yet the "
                "carbon structure explains why alkylation "
                "happens there - a hybrid can react through "
                "its minor face. The amide: the lone-pair-"
                "into-carbonyl structure carries separated "
                "charges and still matters enough to make the "
                "C-N bond rigid and planar, the fact protein "
                "structure is built on. Benzyl cation: the "
                "charge delocalises to three ring positions - "
                "ortho, ortho, para - a map the aromatic "
                "chemistry chapters will consult constantly. "
                "Nitrate: three equivalent structures, "
                "perfectly symmetric, every N-O bond order "
                "four-thirds.\n\n"
                "The workout's meta-lesson is that resonance "
                "arguments are quantitative in disguise. "
                "'More resonance structures' is a first "
                "approximation; 'better-weighted structures' "
                "is the real currency, and the rulebook "
                "prices every drawing. When two exam options "
                "both invoke resonance, the winner is almost "
                "always decided by weighting - which "
                "structure keeps octets, which parks charge "
                "on the right atom - and students who rank "
                "contributors rather than count them stop "
                "losing points to plausible-but-minor "
                "structures. Generate with the three moves, "
                "audit with the charge drill, rank with the "
                "rulebook: that pipeline is the whole "
                "resonance skill, and it is now complete."
            ),
        ),
        ReadingSection(
            id="arrow-problem-set",
            heading="Complete the mechanism: a worked set",
            body=(
                "Four problems, graded, each demanding only "
                "the grammar. One: draw ionisation of tert-"
                "butyl chloride. A single arrow from the C-Cl "
                "bond onto chlorine - dissociation, the "
                "association sentence reversed - leaving a "
                "carbocation and chloride; charge audit, 0 "
                "becomes +1 plus -1. This is the first step "
                "of SN1, met here as pure notation. Two: "
                "protonate ethanol with hydronium, then let "
                "water leave. Step one is the standard "
                "two-arrow proton transfer onto ethanol's "
                "oxygen; step two is one arrow from the C-O "
                "bond onto the now-neutral oxygen, ejecting "
                "water and leaving a cation - the two-step "
                "engine of acid-catalysed dehydration, and a "
                "preview of why 'protonate to upgrade the "
                "leaving group' recurs everywhere. Three: "
                "hydride from borohydride to a ketone's "
                "carbon. Arrow from the B-H bond to carbon, "
                "pi pair retreats to oxygen - the carbonyl "
                "addition sentence with a bond, not a lone "
                "pair, as the donating tail, proving the "
                "tail-on-a-bond option earns its keep. "
                "Four: one full propagation cycle of "
                "methane chlorination in fishhooks - "
                "abstraction, then the carbon radical "
                "attacking Cl2 - checking that the unpaired-"
                "electron count survives each step.\n\n"
                "Work them on paper, then run the five-check "
                "routine on your own drawings; the point of "
                "a problem set at this stage is not the "
                "answers, which are all previews of named "
                "reactions, but the experience of the "
                "grammar producing correct chemistry you "
                "have not been taught yet. That experience - "
                "notation outrunning coverage - is the "
                "entire pedagogical bet of teaching arrows "
                "this early, and these four problems are "
                "where the bet first visibly pays."
            ),
        ),
        ReadingSection(
            id="microscopic-reversibility",
            heading="Reading backwards: microscopic reversibility",
            body=(
                "The fifth debugging check - read the step "
                "backwards - is a special case of a principle "
                "with a name and a career. Microscopic "
                "reversibility says a reversible reaction "
                "runs its reverse through exactly the same "
                "transition states and intermediates in "
                "reverse order: the forward and backward "
                "movies are the same film, played in opposite "
                "directions. For arrow-writers this is a "
                "two-for-one sale on every mechanism. Learn "
                "acid-catalysed hydration of an alkene and "
                "you have learned acid-catalysed dehydration "
                "of an alcohol by reading the same three "
                "steps bottom to top; learn ester formation "
                "and ester hydrolysis arrives free. The "
                "course's apparent mechanism count roughly "
                "halves for students who internalise the "
                "principle, which makes it among the "
                "highest-yield abstractions on offer this "
                "semester.\n\n"
                "It also polices claims. If a proposed "
                "forward mechanism would demand, in reverse, "
                "a step nobody would accept - a hydride "
                "flying off spontaneously, three molecules "
                "colliding at once - then the forward "
                "proposal was wrong too, and the reversal "
                "test catches it without any new "
                "experiment. And it sharpens equilibrium "
                "thinking: a catalyst that accelerates the "
                "forward reaction must accelerate the "
                "reverse by exactly the same factor, since "
                "both use the same lowered barrier - which "
                "is why catalysts shift rates and never "
                "equilibria, a fact the thermodynamics "
                "lesson asserted and this principle "
                "explains. One sentence of physics, three "
                "distinct services: halve the memorisation, "
                "audit the proposals, and keep catalysis "
                "honest. Few principles in the course work "
                "harder per word."
            ),
        ),
        ReadingSection(
            id="arrow-history",
            heading="A century of the curly arrow",
            body=(
                "The notation this chapter drills has a "
                "birthday. Robert Robinson, working with "
                "William Kermack, published the first curly "
                "arrows in 1922, pushing electron pairs "
                "around a decomposition mechanism within a "
                "few years of Lewis's electron-pair bond "
                "itself; the arrow is thus almost exactly as "
                "old as the modern chemical bond, and was "
                "invented as its bookkeeping. The 1920s and "
                "30s saw the notation fought over as much as "
                "used - Robinson and Ingold's schools "
                "disputed priority and terminology with real "
                "bitterness while jointly building the "
                "electronic theory of organic chemistry - "
                "and by mid-century the arrow had won "
                "completely: mechanisms became the field's "
                "shared language, journals demanded them, "
                "and the notation stabilised into the "
                "grammar taught here, essentially unchanged "
                "since. A student's arrows today are "
                "mutually intelligible with a 1950s paper's, "
                "which is a longevity almost no other "
                "scientific notation of that era can claim.\n\n"
                "The history carries a usable moral. The "
                "arrow succeeded because it compresses a "
                "quantum-mechanical story - electron density "
                "flowing between orbitals - into marks a "
                "hand can draw in seconds, and the "
                "compression is honest enough that the "
                "marks predict real outcomes. But it is a "
                "compression: arrows do not claim electrons "
                "are little balls sliding along dotted "
                "paths, and when the course later meets "
                "cases where the cartoon strains - "
                "concerted pericyclic reactions with their "
                "circular arrow-dances, delocalised "
                "transition states - the right response is "
                "not to distrust arrows but to remember "
                "they are notation for a deeper "
                "calculation. Fluency first, philosophy "
                "afterwards: exactly the order this "
                "chapter teaches them."
            ),
        ),
        ReadingSection(
            id="enzyme-arrows",
            heading="Arrows in the cell: reading enzyme mechanisms",
            body=(
                "The grammar's reach extends past the flask: "
                "modern biochemistry writes enzyme catalysis "
                "in precisely these arrows, and a student "
                "fluent in them can read mechanism figures "
                "in any biochemistry textbook or paper on "
                "sight. The cast translates directly. "
                "General-base catalysis is a side chain - "
                "histidine, aspartate - taking a proton "
                "through the standard two-arrow transfer to "
                "activate a nucleophile; general-acid "
                "catalysis is the mirror image, a side "
                "chain donating a proton to soften an "
                "electrophile or steady a leaving group. "
                "The chymotrypsin figure that anchors every "
                "biochemistry course is a chain of this "
                "chapter's sentences: histidine deprotonates "
                "serine (proton transfer), serine's oxygen "
                "attacks the substrate's amide carbonyl "
                "(carbonyl addition), the tetrahedral "
                "intermediate collapses expelling the new "
                "amine (the reverse sentence), and the "
                "cycle repeats with water as the second "
                "nucleophile. Nothing in the figure is new "
                "grammar - only new stationery.\n\n"
                "Two features of enzymatic arrow-pushing "
                "reward attention. Proton shuttles: enzymes "
                "rarely let a proton travel far, instead "
                "relaying it through chains of side chains "
                "and ordered waters, each hop an ordinary "
                "transfer - the no-teleporting rule of the "
                "multi-arrow section, enforced by "
                "architecture. And preorganisation: the "
                "enzyme holds nucleophile, electrophile and "
                "acid-base partners in position so each "
                "arrow's tail and head are already adjacent, "
                "which is a large part of how enzymes buy "
                "their rate accelerations. For the MCAT, "
                "enzyme-mechanism passages are arrow-"
                "literacy tests wearing biology's clothes; "
                "the student who learned this chapter "
                "properly answers them from the figure "
                "alone, which is precisely the transfer "
                "this course's chemistry-to-medicine "
                "design intends."
            ),
        ),
        ReadingSection(
            id="arrows-as-language",
            heading="Practising the language: from translation to fluency",
            body=(
                "Because arrows are a language, the stages of "
                "learning them mirror language acquisition, and "
                "naming the stages helps you locate yourself. "
                "Stage one is translation: given a mechanism, "
                "you can check each arrow against the rules, "
                "slowly, consciously - reading with a "
                "dictionary. Stage two is transcription: shown "
                "reactants and products, you can reconstruct "
                "the arrows that connect them, because the "
                "changed bonds tell you what must have moved; "
                "compare the two structures, list bonds broken "
                "and bonds made, and each entry demands its "
                "arrow. Stage three is composition: given only "
                "reactants and conditions, you propose the "
                "mechanism yourself, roles first, arrows "
                "second, audit third. Exams live at stages two "
                "and three, and the reliable route there is "
                "deliberately unglamorous - copy out worked "
                "mechanisms by hand, cover the page, reproduce "
                "them, then perturb them: swap the nucleophile, "
                "change the solvent, ask what breaks.\n\n"
                "Handwriting matters more than it seems. The "
                "physical habit of drawing the tail on the "
                "pair, the head at the destination, the charge "
                "recount after each step, is what makes the "
                "grammar automatic under time pressure; "
                "students who only read mechanisms recognise "
                "them but cannot produce them, exactly as "
                "reading a phrasebook does not produce "
                "spoken sentences. Twenty minutes of daily "
                "production - four or five mechanisms redrawn "
                "and perturbed - outperforms hours of "
                "rereading, and the investment is capped: the "
                "grammar is finite, the sentence shapes "
                "number a handful, and fluency, once "
                "reached, persists for the rest of the "
                "course because every later chapter exercises "
                "it continuously. No other skill taught this "
                "semester compounds at that rate.\n\n"
                "A last calibration for self-testing: when you "
                "check your own mechanism against a printed "
                "answer, grade the arrows, not the product. "
                "Arriving at the right molecule through an "
                "illegal step is the failure mode that survives "
                "into exams unnoticed, because the final "
                "structure looks right while the chemistry "
                "underneath it is wrong. The five-check routine "
                "applied to your own work - tails on pairs, "
                "heads on destinations, octets intact, charge "
                "conserved, reversible in principle - is the "
                "only self-test that measures what mechanism "
                "questions actually grade, and running it on "
                "every practice drawing is what converts "
                "practice volume into practice value. Fluency "
                "is not drawing quickly; it is drawing legally "
                "without needing to think about the law - the "
                "same effortless correctness a native speaker "
                "has in grammar, earned the same way: by "
                "producing sentences daily until the rules "
                "disappear into the hand."
            ),
        ),
    ),
    key_takeaways=(
        "Arrows run from an electron pair to its destination; charges are recomputed afterwards, never pushed.",
        "One arrow = association with an empty orbital. Attacking a full octet demands a paired arrow evicting a leaving group.",
        "Nucleophile, electrophile and leaving group are per-step roles, not fixed identities.",
        "Resonance structures are generated by three legal moves (lone pair to pi, pi to lone pair, pi shift) with atoms frozen in place.",
        "Octet and charge bookkeeping catch nearly every arrow error: no pentavalent carbon, charge conserved across each step.",
    ),
    exam_tips=(
        "When a mechanism answer choice shows an arrow starting at a positive charge or at an atom label, eliminate it - arrows start at electron pairs.",
        "MCAT resonance questions reward the atoms-never-move test: any choice that relocated a hydrogen is a different compound, not a resonance form.",
    ),
))


# --------------------------------------------------------------------------
# 3.2 pKa and proton-transfer equilibria
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.PKA",
    lead=(
        "Proton transfer is the fastest and most common elementary step "
        "in organic chemistry, and it is also the most quantitative: one "
        "lookup table - the pKa table - predicts the direction and the "
        "equilibrium constant of every acid-base reaction in the course. "
        "This chapter builds the table's logic from the Bronsted "
        "definitions, connects the equilibrium constant to free energy so "
        "the numbers mean something physical, and drills the one "
        "calculation the table supports: which side of a proton transfer "
        "is favoured, and by how much."
    ),
    sections=(
        ReadingSection(
            id="bronsted-frame",
            figure=Figure(
                stem="org1-conjugate-bases",
                caption=(
                    "Three conjugate bases and their parents' pKa values: the anion's comfort with the charge is what the acid's pKa measures."
                ),
                alt="Structures of ethoxide, phenoxide and acetate with the parent acids' pKa values.",
            ),
            heading="Conjugate pairs and what pKa measures",
            body=(
                "A Bronsted acid donates a proton; a Bronsted base "
                "accepts one. Strip a proton from an acid HA and what "
                "remains, $A^-$, is its conjugate base; every proton "
                "transfer therefore involves two conjugate pairs, with "
                "the proton moving between them. The acid dissociation "
                "constant collects the equilibrium for "
                "$HA \\rightleftharpoons H^+ + A^-$ in water, and "
                "$pK_a = -\\log_{10} K_a$ compresses its enormous range "
                "into a two-digit scale. The sign convention must become "
                "reflexive: lower pKa, stronger acid. Each unit is a "
                "factor of ten, so the gap between acetic acid (4.76) "
                "and ethanol (15.9) is not 'eleven points' but eleven "
                "orders of magnitude in dissociation.\n\n"
                "Strength inverts across a conjugate pair: the stronger "
                "an acid, the weaker its conjugate base, because a "
                "conjugate base's reluctance to re-accept the proton is "
                "exactly what its parent's willingness to give it up "
                "measures. The practical reading of the table is "
                "therefore double-ended - read acids down the pKa "
                "column directly, and read base strength off the "
                "conjugate acid's row: to compare hydroxide with "
                "ethoxide as bases, compare water (15.7) with ethanol "
                "(15.9) as acids. One table, both directions."
            ),
            table=Table(
                caption="Aqueous pKa values used throughout the course",
                columns=("Acid", "pKa", "Conjugate base"),
                rows=(
                    ("HCl", "-7", "Cl-"),
                    ("H3O+", "-1.7", "H2O"),
                    ("HF", "3.2", "F-"),
                    ("CH3COOH (acetic)", "4.76", "CH3COO-"),
                    ("H2CO3", "6.35", "HCO3-"),
                    ("NH4+", "9.25", "NH3"),
                    ("HCN", "9.2", "CN-"),
                    ("phenol", "10.0", "phenoxide"),
                    ("H2O", "15.7", "HO-"),
                    ("CH3CH2OH (ethanol)", "15.9", "ethoxide"),
                    ("HC#CH (ethyne)", "~25", "acetylide"),
                    ("H2", "~36", "H-"),
                    ("NH3 (as acid)", "~38", "NH2-"),
                    ("CH2=CH2", "~44", "vinyl anion"),
                    ("CH3CH3", "~50", "ethyl anion"),
                ),
                source="Standard aqueous pKa compilations (CRC Handbook; Bordwell tables for the weakest acids), consistent with app.data.claims",
                note="Values above ~25 are extrapolated from nonaqueous measurements; their ordering, not their precision, is what the course uses.",
            ),
        ),
        ReadingSection(
            id="equilibrium-calc",
            figure=Figure(
                stem="org1-pka-ladder",
                caption=(
                    "The course pKa ladder, drawn from the table's aqueous values: proton transfer always runs toward the weaker (higher) acid."
                ),
                alt="Vertical ladder chart of aqueous pKa values from HCl at -7 to ethane near 50.",
            ),
            heading="The proton-transfer calculation",
            body=(
                "Every acid-base equilibrium question reduces to one "
                "procedure. Identify the acid on the left (the species "
                "giving up the proton) and the acid on the right (the "
                "conjugate acid the base becomes). Then "
                "$K_{eq} = 10^{\\,pK_a(\\text{right acid}) - "
                "pK_a(\\text{left acid})}$, and the equilibrium sits on "
                "the side of the weaker acid - the higher pKa - because "
                "that is where the proton is held most tightly. Ethoxide "
                "plus acetic acid: left acid 4.76, right acid (ethanol) "
                "15.9, $K_{eq} = 10^{11.1}$, quantitatively to the "
                "right. Hydroxide deprotonating ethyne: left acid ~25, "
                "right acid (water) 15.7, $K_{eq} = 10^{-9.3}$ - "
                "hydroxide cannot make an acetylide in any useful "
                "amount, which is why chapter 5 of Organic II reaches "
                "for the amide ion (conjugate acid ~38) instead.\n\n"
                "That second example carries the design rule for every "
                "synthesis in the course: to deprotonate a substrate "
                "usefully, choose a base whose conjugate acid sits "
                "well above the substrate on the table - about ten "
                "units buys $10^{10}$ and counts as quantitative. The "
                "rule runs the other way too: a reagent basic enough "
                "to rip any proton it meets is incompatible with "
                "substrates carrying acidic O-H or N-H groups, a "
                "compatibility check that becomes second nature by the "
                "Grignard chapter, where the reagent (conjugate acid "
                "~50) is destroyed by water (15.7) on contact."
            ),
        ),
        ReadingSection(
            id="free-energy",
            heading="Free energy: what the exponent is made of",
            body=(
                "The equilibrium constant is thermodynamics in "
                "disguise: $\\Delta G^\\circ = -RT \\ln K_{eq}$, so at "
                "298 K each factor of ten in $K_{eq}$ corresponds to "
                "5.7 kJ/mol of standard free energy. That conversion "
                "factor is worth memorising, because it translates the "
                "pKa table into the energy units every other chapter "
                "uses: the acetic acid/ethanol gap of 11.1 units is 63 "
                "kJ/mol; butane's anti/gauche gap of 3.8 kJ/mol is 0.67 "
                "pKa-units' worth of equilibrium. One scale, two "
                "vocabularies.\n\n"
                "Free energy also separates two ideas the words 'strong' "
                "and 'fast' blur. $\\Delta G^\\circ$ - the gap between "
                "reactants and products - sets where the equilibrium "
                "rests. The activation barrier - the gap up to the "
                "transition state - sets how quickly it gets there. "
                "Proton transfers between electronegative atoms are "
                "almost always fast regardless of their equilibrium "
                "position, which is why the course treats acid-base "
                "steps as pre-equilibria inside larger mechanisms: "
                "whichever side the pKa table favours is reached "
                "essentially instantly. When kinetics and "
                "thermodynamics disagree about a product - and in "
                "chapter 6 of Organic II they will - the vocabulary "
                "built here is what states the disagreement "
                "precisely.\n\n"
                "Two limits keep the arithmetic honest. First, the "
                "table's values are aqueous and 25 C; move to DMSO "
                "and some gaps stretch by many units, because the "
                "solvent's hydrogen bonding was doing real "
                "stabilising work that the pKa silently included. "
                "Comparisons within one solvent are trustworthy; "
                "mixing tables across solvents is how impossible "
                "predictions get made. Second, an equilibrium "
                "constant says nothing about amounts until "
                "concentrations are chosen: a reaction with K near "
                "one is pushed to completion in practice by using "
                "excess base or removing a product as it forms, "
                "which is Le Chatelier wearing lab clothes. The "
                "working chemist's version of this lesson is a pair "
                "of habits - quote the solvent with the number, and "
                "treat K as the start of a design rather than the "
                "end of one. Both habits transfer unchanged to every "
                "equilibrium the course meets, from hydrate "
                "formation at a carbonyl to the acetal exchanges "
                "that protect one."
            ),
        ),
        ReadingSection(
            id="amphoterism-levelling",
            heading="Amphoteric species, and what a solvent can level",
            body=(
                "Water appears in the table twice - as an acid at 15.7 "
                "and, through hydronium at -1.7, as a base - because it "
                "is amphoteric: it can donate or accept a proton "
                "depending on the partner. So can alcohols, amines and "
                "carboxylic acids, and reading a molecule for both "
                "roles at once is a skill mechanisms demand constantly. "
                "In an acid-catalysed mechanism an alcohol accepts a "
                "proton in the first step; in a base-mediated one the "
                "same alcohol donates its O-H. Which role runs is "
                "decided by the strongest acid and strongest base "
                "actually present, and the pKa table adjudicates: the "
                "proton always ends up parked on the weakest available "
                "acid.\n\n"
                "Amphoterism has a solvent-sized consequence called "
                "levelling. In water, any acid stronger than hydronium "
                "protonates water quantitatively, so HCl (-7) and HBr "
                "(-9) both operate as hydronium and their intrinsic "
                "difference is invisible - water levels every acid "
                "below -1.7 to the same effective strength, and every "
                "base stronger than hydroxide to hydroxide. That is "
                "why the very negative and very positive table entries "
                "come from nonaqueous measurements, and why the course "
                "reaches for special conditions when it needs "
                "stronger reagents than water tolerates: amide bases "
                "in ammonia for acetylides, LDA in THF for enolates "
                "later. The practical instinct to install: check the "
                "reagent against the solvent's own pKa pair before "
                "trusting a step, because a base the solvent destroys "
                "never reaches the substrate. It is the same "
                "compatibility check as the Grignard rule, generalised "
                "from one reagent to the whole table.\n\n"
                "Levelling is also why 'strong acid' means something "
                "different in organic and general chemistry. General "
                "chemistry's short list of strong acids is simply "
                "the set water levels; organic chemistry, working "
                "across fifty pKa units and many solvents, needs the "
                "whole graded scale, and it needs the habit of "
                "asking 'strong compared to what, in what medium' "
                "before trusting any adjective. The table answers "
                "both questions at once, which is why the table - "
                "and not any memorised list of named acids - is the "
                "object this chapter asks you to internalise. Ten "
                "well-chosen rows, held confidently with their "
                "conjugates, will quietly answer far more exam "
                "questions than any other single memorised object "
                "anywhere in the course."
            ),
        ),
        ReadingSection(
            id="pka-anchors",
            heading="Carrying the table in your head: anchors and interpolation",
            body=(
                "Nobody memorises the whole pKa table, and nobody "
                "should: the working skill is a dozen anchors held "
                "confidently plus the habit of interpolating everything "
                "else by functional-group family. The anchors worth the "
                "flashcard time are the ones the course leans on "
                "repeatedly: strong mineral acids below zero, hydronium "
                "at -1.7, carboxylic acids clustered near 4-5, carbonic "
                "acid at 6.35, ammonium near 9, phenol at 10, water at "
                "15.7, alcohols at 16-18, terminal alkynes near 25, "
                "hydrogen and ammonia in the mid-to-high 30s, and plain "
                "C-H bonds effectively never, at 44-50. Notice the "
                "structure of that list: it is not fifteen arbitrary "
                "numbers but five or six functional-group families, "
                "each parked in a band a few units wide. A new "
                "carboxylic acid lands near 4-5 unless something on the "
                "checklist of the next lesson moves it; a new alcohol "
                "lands near 16-18; a new ammonium salt lands near "
                "9-11. Interpolation by family plus correction by "
                "structure reproduces most of the table on demand.\n\n"
                "The anchors also give you a fast sanity check on any "
                "value a problem hands you. A question claiming an "
                "amide N-H at pKa 5 is describing something odd and "
                "probably protonated; an 'alcohol' at 10 is probably a "
                "phenol in disguise; a C-H quoted at 20 is flagging an "
                "adjacent carbonyl before the problem says so. Reading "
                "a stated pKa against the family bands is exactly the "
                "skill exam writers probe when they attach numbers to "
                "unfamiliar structures, and it costs seconds once the "
                "bands are automatic. The habit to build now: every "
                "time this course names a pKa, place it in its family "
                "band before using it, and let surprises - values far "
                "from their band - trigger a search for the structural "
                "reason. The surprises are never accidents; they are "
                "the next lesson's checklist at work."
            ),
        ),
        ReadingSection(
            id="choosing-a-base",
            heading="The laboratory base shelf, read off the table",
            body=(
                "The pKa table is also the index of the base shelf, "
                "and matching base to task is a calculation, not a "
                "tradition. The rule from the equilibrium lesson - a "
                "base deprotonates a substrate quantitatively when its "
                "conjugate acid sits roughly ten units higher - sorts "
                "the shelf into tiers. For carboxylic acids (4-5), "
                "bicarbonate (conjugate acid 6.35) is enough to pull "
                "the proton partially and carbonate or hydroxide "
                "finishes the job; this is why an aqueous bicarbonate "
                "wash extracts a carboxylic acid from an organic layer "
                "while leaving a phenol (10) behind, a separation the "
                "workup lesson will run in glassware. For phenols, "
                "hydroxide (15.7) sits five-plus units above and "
                "converts them fully to phenoxides. For alcohols "
                "(16-18), hydroxide is uselessly close and the shelf "
                "steps up to sodium hydride, whose conjugate acid - "
                "molecular hydrogen near 36 - clears the bar by twenty "
                "units and has the added virtue that the byproduct "
                "bubbles away irreversibly. For terminal alkynes (25), "
                "sodium amide in ammonia (conjugate acid 38) is the "
                "classical choice. For the truly reluctant protons the "
                "later course meets - ketone alpha C-H near 20 wanted "
                "quickly and completely - the shelf reaches "
                "diisopropylamide (LDA), conjugate acid near 36.\n\n"
                "Two practical notes complete the shelf. Amine bases "
                "like triethylamine (conjugate acid 10.75) and "
                "pyridine (5.2) are deliberately weak: they mop up "
                "protons released during a reaction without attacking "
                "electrophiles or touching alcohol O-H groups, which "
                "is their entire job description in acylation "
                "reactions. And bases are chosen against the solvent "
                "as much as the substrate - the levelling lesson's "
                "point - so amide is used in ammonia, not water, and "
                "LDA in THF, where nothing cheaper than the substrate "
                "is available to protonate. Reading reagent lists "
                "this way converts them from arbitrary recipes into "
                "audited pKa arithmetic."
            ),
        ),
        ReadingSection(
            id="pka-worked",
            heading="Three worked proton-transfer problems",
            body=(
                "Worked arithmetic makes the procedure automatic, so "
                "run three problems at increasing distance from the "
                "table. First: does acetate deprotonate phenol? Left "
                "acid phenol (10.0), right acid acetic (4.76); "
                "$K_{eq} = 10^{4.76-10.0} = 10^{-5.2}$. The "
                "equilibrium lies far to the left - acetate is too "
                "weak a base - and the answer generalises: a base "
                "cannot usefully remove a proton from anything whose "
                "pKa sits meaningfully above its own conjugate acid. "
                "Second: methoxide in methanol deprotonating a "
                "terminal alkyne (25). Right acid methanol (15.5); "
                "$K_{eq} = 10^{15.5-25} \\approx 10^{-9.5}$. Only one "
                "molecule in three billion is deprotonated at "
                "equilibrium - numerically why alkoxide bases never "
                "make acetylides, and why the course reaches for "
                "amide. Third, the direction most students miss: "
                "which protons does a given base destroy? Drop "
                "ethylmagnesium bromide - effectively an ethyl "
                "carbanion, conjugate acid near 50 - into a flask "
                "containing an alcohol, and the transfer to the "
                "carbanion has $K_{eq} \\approx 10^{50-17} = 10^{33}$: "
                "instant, quantitative, irreversible destruction of "
                "the reagent, one equivalent of alkane gas, and a "
                "ruined preparation. The compatibility audit - run "
                "the calculation against every acidic proton in the "
                "flask, solvent included - is the single most "
                "practical use of the table.\n\n"
                "Notice what all three problems share: no new "
                "chemistry, only the discipline of naming the acid "
                "on each side before subtracting. The errors that "
                "occur in practice are bookkeeping errors - "
                "subtracting in the wrong order, comparing a base "
                "directly instead of its conjugate acid, or quoting "
                "a DMSO value into an aqueous argument. The "
                "procedure done slowly is immune to all three, and "
                "after perhaps twenty repetitions it runs in "
                "seconds. That fluency is the chapter's real "
                "deliverable: not the table, which can be printed, "
                "but the reflex of using it correctly under time "
                "pressure, which cannot."
            ),
        ),
        ReadingSection(
            id="henderson",
            heading="Henderson-Hasselbalch: pKa meets pH",
            body=(
                "Rearranging the $K_a$ expression gives the equation "
                "that connects the table to any buffered environment: "
                "$pH = pK_a + \\log_{10}([A^-]/[HA])$, the "
                "Henderson-Hasselbalch equation. Its content is one "
                "sentence: the pKa is the pH at which an acid is "
                "exactly half dissociated, and every unit of pH above "
                "that point shifts the population tenfold toward the "
                "conjugate base, every unit below tenfold toward the "
                "neutral acid. Two units either side and the minority "
                "form is down to one percent, which licenses the "
                "working shorthand the course will use constantly: "
                "below its pKa an acid is 'protonated', above it "
                "'deprotonated', with the fuzzy 50/50 crossover "
                "confined to the pKa itself.\n\n"
                "The equation is why the pKa table predicts speciation "
                "in any medium with a known pH. Acetic acid (4.76) in "
                "blood at pH 7.4 sits 2.6 units above its pKa: the "
                "ratio $[A^-]/[HA]$ is $10^{2.6}$, about 440 to 1, so "
                "physiological 'acetic acid' is acetate. An ammonium "
                "group (9.25) at the same pH sits 1.85 units below "
                "its pKa and is overwhelmingly protonated - which is "
                "why the amino groups of biochemistry are drawn as "
                "$NH_3^+$ at physiological pH and why 'amine' and "
                "'ammonium' name the same functional group in two "
                "environments. The MCAT leans on exactly this "
                "calculation: given a pKa and a pH, state the "
                "dominant form and estimate the ratio. The arithmetic "
                "is always the same subtraction followed by a power "
                "of ten, and the only trap is sign direction - "
                "above the pKa means deprotonated, and writing that "
                "sentence at the top of scratch work eliminates the "
                "error. The equation also runs backwards usefully: "
                "measure the ratio of forms spectroscopically at a "
                "known pH and the pKa falls out, which is one of the "
                "standard ways the table's entries were measured in "
                "the first place."
            ),
        ),
        ReadingSection(
            id="pka-in-medicine",
            heading="Ionisation in the body: absorption and ion trapping",
            body=(
                "Pharmacology runs on this chapter, because membranes "
                "pass neutral molecules far more readily than ions: a "
                "drug's ionisation state at each body compartment's pH "
                "- stomach near 1.5-2, blood at 7.4, urine typically "
                "5-8 - decides where it is absorbed and how it is "
                "cleared. Aspirin is the teaching example: a "
                "carboxylic acid with pKa about 3.5 is mostly neutral "
                "in gastric acid (pH below its pKa), so a fraction "
                "absorbs across the stomach lining directly; once in "
                "blood at 7.4 it is essentially fully ionised, four "
                "orders of magnitude toward the carboxylate. The "
                "asymmetry runs one way only, and that is the concept "
                "of ion trapping: a neutral species that crosses a "
                "membrane into a compartment whose pH ionises it "
                "cannot easily diffuse back, so it accumulates there. "
                "Weak bases concentrate in acidic compartments; weak "
                "acids concentrate in basic ones.\n\n"
                "Clinical practice uses the trap deliberately. In "
                "aspirin overdose, the treatment includes alkalinising "
                "the urine with bicarbonate: raising urine pH pushes "
                "the salicylate equilibrium toward the anion inside "
                "the renal tubule, the anion cannot re-cross into "
                "blood, and excretion accelerates - "
                "Henderson-Hasselbalch administered intravenously. "
                "The same logic explains why basic drugs such as "
                "morphine (conjugate acid near 8) partition into "
                "acidic compartments, and why changing a patient's "
                "urine pH changes drug clearance rates in either "
                "direction. For the MCAT, the transferable skeleton "
                "is compact: identify the drug as weak acid or weak "
                "base, place its pKa against each compartment's pH, "
                "write the neutral fraction on the low-pH side for "
                "acids and the high-pH side for bases, and remember "
                "that only the neutral form crosses. Every "
                "absorption, distribution and clearance question of "
                "this type is the same three-line calculation wearing "
                "different anatomy."
            ),
        ),
        ReadingSection(
            id="amino-acids",
            heading="Polyprotic acids and the zwitterion",
            body=(
                "Molecules with several acidic protons release them "
                "in strict pKa order, and each release has its own "
                "table entry. Carbonic acid runs 6.35 then 10.33; "
                "phosphoric acid descends its three steps; and the "
                "case that matters most downstream is the amino acid. "
                "Glycine carries a carboxylic acid (pKa 2.34) and an "
                "ammonium (9.60), and the two-unit surprise is that "
                "between those values - including at physiological "
                "pH - the molecule is a zwitterion: carboxylate "
                "negative, ammonium positive, net charge zero, both "
                "groups ionised at once. The neutral un-ionised form "
                "drawn in introductory biology barely exists in "
                "water. Reading the titration from low pH: below "
                "2.34 the molecule is a cation (COOH and NH3+); "
                "between the pKas it is the zwitterion; above 9.60 "
                "it is an anion (COO- and NH2). The pH at which the "
                "average charge crosses zero - for glycine the "
                "midpoint of the two pKas, near 6.0 - is the "
                "isoelectric point, the pH of minimum solubility and "
                "zero electrophoretic drift.\n\n"
                "The organic-chemistry content here is that nothing "
                "new happened: each group ionises exactly where its "
                "own pKa says, indifferent to the other's presence "
                "except through modest inductive shifts - glycine's "
                "carboxyl at 2.34 is two units stronger than acetic "
                "acid precisely because the adjacent ammonium is an "
                "electron-withdrawing group, an effect the next "
                "lesson's checklist predicts. Side chains add a "
                "third pKa where present - the biochemistry course "
                "will tabulate them - but the method never changes: "
                "order the pKas, walk the pH upward, deprotonate one "
                "group per crossing. Any charge-state question about "
                "any polyprotic molecule at any pH reduces to that "
                "walk, which is why this half-page is quietly one of "
                "the highest-yield fragments of the chapter for the "
                "MCAT's biochemistry sections."
            ),
        ),
        ReadingSection(
            id="carbon-acids-kinetics",
            heading="Carbon acids: when equilibrium and speed part company",
            body=(
                "The free-energy lesson promised that proton "
                "transfers are fast, and for O-H and N-H acids that "
                "promise holds: transfer between electronegative "
                "atoms through a hydrogen bond is among the fastest "
                "reactions known, often diffusion-limited. Carbon "
                "acids break the promise, and the reason is "
                "structural. An O-H acid's proton sits on an atom "
                "already carrying lone pairs, and the transfer "
                "rearranges almost nothing; a carbon acid like a "
                "ketone or nitromethane owes its acidity to resonance "
                "in the conjugate base, which means deprotonation "
                "must be accompanied by rehybridisation and "
                "electronic reorganisation - the carbon flattens, the "
                "charge migrates onto oxygen - and that "
                "reorganisation carries a real activation barrier. "
                "Nitromethane is the classic demonstration: pKa 10.2, "
                "nominally a stronger acid than phenol, yet its "
                "deprotonation by hydroxide is measurably slow - "
                "orders of magnitude slower than any O-H transfer - "
                "because the transition state must already carry "
                "much of the anion's reorganisation.\n\n"
                "The distinction earns its own vocabulary: "
                "thermodynamic acidity is the equilibrium constant, "
                "the table's business; kinetic acidity is the rate "
                "of proton removal. For O-H and N-H acids the two "
                "rank together and the distinction is pedantic; for "
                "carbon acids they can diverge sharply, and the "
                "divergence has consequences the later course "
                "cashes. Deprotonating a ketone with LDA at low "
                "temperature removes the most accessible proton "
                "fastest - the kinetic choice - which is not always "
                "the proton whose enolate is most stable - the "
                "thermodynamic choice - and an entire strategy of "
                "enolate chemistry rests on choosing conditions that "
                "select one over the other. File the principle now "
                "in this chapter's language: the pKa table predicts "
                "where a proton-transfer equilibrium rests, never "
                "how fast it gets there, and for C-H acids the "
                "difference is real chemistry rather than a "
                "footnote."
            ),
        ),
        ReadingSection(
            id="measuring-pka",
            heading="Where the numbers come from",
            body=(
                "A table used this heavily deserves a paragraph on "
                "its own provenance. For acids of ordinary strength "
                "in water - roughly pKa 2 to 12 - the measurement is "
                "a titration: add base incrementally, record pH, and "
                "read the pKa off the half-equivalence point, where "
                "Henderson-Hasselbalch says pH equals pKa exactly. "
                "Where titration curves overlap or the compound is "
                "too dilute, spectroscopy takes over: if the acid "
                "and conjugate base absorb differently - phenol and "
                "phenoxide conveniently do - the concentration ratio "
                "can be read optically at a series of known pH "
                "values, and NMR chemical shifts serve the same role "
                "for transparent compounds. Outside the water "
                "window the methods get indirect. Very strong acids "
                "are compared in concentrated or nonaqueous media "
                "using acidity functions - Hammett's $H_0$ scale - "
                "and very weak acids by equilibrating two candidate "
                "acids against one base and measuring who holds the "
                "proton, chaining such competitions upward from "
                "anchored values. The Bordwell school did this "
                "systematically in DMSO, which is why the weakest "
                "entries quote that solvent.\n\n"
                "Knowing the provenance calibrates trust. Values in "
                "the water window carry two-decimal precision and "
                "deserve it; values near 40 or 50 are chained "
                "estimates whose ordering is secure but whose "
                "decimals are decoration, which is why this course "
                "writes them with a tilde. It also explains the "
                "occasional disagreement between printed tables - "
                "different chains, different anchor choices - and "
                "why quoting a solvent with a pKa is not pedantry "
                "but part of the number. The habit transfers beyond "
                "this chapter: every constant the course uses was "
                "measured by somebody, with a method whose reach "
                "and error bars are knowable, and asking 'how would "
                "anyone know that' is a cheap, permanent upgrade to "
                "how confidently you can use what you are taught."
            ),
        ),
        ReadingSection(
            id="pka-history",
            heading="A short history of the scale",
            body=(
                "The apparatus of this chapter was assembled within "
                "about twenty years. Sorensen introduced the pH "
                "scale at the Carlsberg Laboratory in 1909, "
                "compressing hydrogen-ion concentrations spanning "
                "many powers of ten into a usable logarithmic "
                "number; the pKa is the same compression applied to "
                "acid strength. In 1923 Bronsted in Copenhagen and "
                "Lowry in Cambridge independently published the "
                "proton-transfer definition of acids and bases that "
                "this chapter runs on - acid as donor, base as "
                "acceptor, conjugate pairs linked by one proton - "
                "displacing the older water-bound Arrhenius picture "
                "and making acid-base chemistry portable into any "
                "solvent. The same year, Lewis generalised further "
                "to electron-pair donation and acceptance, the "
                "framing the arrow lesson uses; the two definitions "
                "coexist because they answer different questions, "
                "Bronsted's quantitatively for protons, Lewis's "
                "structurally for everything. Hammett's acidity "
                "functions in the 1930s extended measurement into "
                "media too acidic for the pH electrode, the line of "
                "work that ultimately let Olah characterise "
                "superacids strong enough to protonate alkanes - "
                "chemistry that won the 1994 Nobel Prize and sits "
                "at the far, exotic end of the same scale this "
                "chapter teaches.\n\n"
                "The history is worth two minutes because it "
                "explains the vocabulary's redundancy. 'Bronsted "
                "acid' and 'Lewis acid' are not synonyms: every "
                "Bronsted acid is a Lewis acid story about the "
                "proton, but boron trifluoride is a Lewis acid "
                "with no proton to give, and exam questions "
                "exploit students who blur the two. The course's "
                "convention, inherited from the field: 'acid' "
                "unqualified means Bronsted; Lewis acids are named "
                "as such. Keep the two ledgers separate and every "
                "definition question in the chapter becomes free "
                "marks."
            ),
        ),
        ReadingSection(
            id="buffers-bridge",
            heading="Buffers: the equation put to work",
            body=(
                "One more consequence of Henderson-Hasselbalch closes "
                "the loop to general chemistry and biology. A solution "
                "holding comparable amounts of an acid and its "
                "conjugate base resists pH change, because added "
                "hydroxide is absorbed by the acid reservoir and added "
                "acid by the base reservoir, with the pH moving only "
                "as the logarithm of the shifting ratio: that is a "
                "buffer, and it works best within about one unit of "
                "the acid's pKa, where both reservoirs are "
                "substantial. Blood holds its 7.4 largely on the "
                "carbonic acid/bicarbonate pair - pKa 6.35, close "
                "enough, with respiration adjusting the acid side "
                "continuously - and every enzyme assay in the "
                "biochemistry course is run in a buffer chosen by "
                "matching pKa to target pH. The design rule is a "
                "one-line lookup on this chapter's table: buffering "
                "at pH 5 wants a pKa-5-ish acid such as acetic; at "
                "pH 9, an ammonium-type pair.\n\n"
                "For this course the buffer is mostly an exam "
                "object, but the underlying move - park a system at "
                "a chosen point on an equilibrium by loading both "
                "sides - returns in synthesis whenever a reaction "
                "is run under 'buffered' mildly acidic conditions "
                "to protonate one group while sparing another. The "
                "table says which groups switch state at which pH; "
                "the buffer is how a chemist holds the pH there."
            ),
        ),
    ),
    key_takeaways=(
        "Lower pKa = stronger acid; each unit is a factor of ten; strength inverts across a conjugate pair.",
        "Keq = 10^(pKa_right - pKa_left); equilibrium favours the side of the weaker (higher-pKa) acid.",
        "Choose bases ~10 pKa units above the substrate for quantitative deprotonation; the same table flags reagent/substrate incompatibilities.",
        "At 298 K, one pKa unit = 5.7 kJ/mol: the table and the course's energy diagrams are the same currency.",
        "Equilibrium position (delta-G) and speed (activation barrier) are independent; proton transfers are typically fast either way.",
    ),
    exam_tips=(
        "MCAT questions give you the pKas - the skill graded is naming the acid on EACH side and subtracting in the right order.",
        "A 'which base can deprotonate X' question is a table lookup: the base works if its conjugate acid's pKa exceeds X's.",
    ),
))


# --------------------------------------------------------------------------
# 3.3 Structure and acidity
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.ACIDITYFACTORS",
    lead=(
        "The pKa table is measured, but it is not arbitrary: nearly every "
        "entry can be rationalised from the structure of the conjugate "
        "base, because whatever stabilises $A^-$ pulls the equilibrium "
        "toward dissociation and strengthens HA. This lesson organises "
        "that reasoning into an ordered checklist - which atom holds the "
        "charge, whether resonance spreads it, what the neighbours do to "
        "it, and what orbital it sits in - and calibrates each effect "
        "with real values, so that ranking acids becomes derivation "
        "rather than recall."
    ),
    sections=(
        ReadingSection(
            id="element-effect",
            heading="The atom holding the charge: rows versus columns",
            body=(
                "The first and largest question is which atom carries "
                "the negative charge in the conjugate base. Across a row "
                "of the periodic table, electronegativity rules: "
                "carbon, nitrogen, oxygen anions are increasingly "
                "comfortable, so acidity runs C-H < N-H < O-H - ethane "
                "~50, ammonia ~38, water 15.7, a thirty-plus-unit sweep "
                "on electronegativity alone. Down a column the trend "
                "*inverts*: H-F (3.2) is a weaker acid than H-Cl (-7) "
                "even though fluorine is more electronegative, because "
                "descending a column the anion's charge spreads over a "
                "much larger atom, and that size stabilisation beats "
                "electronegativity. Polarisability and the weaker H-X "
                "bond point the same direction. The exam-ready summary: "
                "across a row follow electronegativity, down a column "
                "follow size, and when the two rules seem to collide, "
                "identify which comparison - row or column - is "
                "actually being made.\n\n"
                "The same element effect explains why thiols (~10) are "
                "markedly more acidic than alcohols (~16): sulfur sits "
                "below oxygen. It also sets the baseline the remaining "
                "effects modify - no substituent effect on an O-H acid "
                "will make it as weak as a plain C-H, because the "
                "element effect operates first and largest."
            ),
        ),
        ReadingSection(
            id="charge-resonance",
            figure=Figure(
                stem="org1-conjugate-bases",
                caption=(
                    "The three-compound calibration in structures: ethoxide's stranded charge, phenoxide's ring-shared charge, acetate's oxygen-to-oxygen sharing."
                ),
                alt="Ethoxide, phenoxide and acetate structures ordered by increasing charge delocalisation.",
            ),
            heading="Charge type and resonance delocalisation",
            body=(
                "Second on the checklist: what kind of charge change "
                "the deprotonation makes. Removing a proton from a "
                "cation ($H_3O^+$, -1.7; $NH_4^+$, 9.25) merely "
                "neutralises it, while removing one from a neutral "
                "molecule (water 15.7, ammonia ~38) creates fresh "
                "negative charge - which is why each cationic acid is "
                "enormously stronger than its neutral cousin on the "
                "same element. Positively charged acids are strong "
                "because their conjugate bases are comfortable neutral "
                "molecules.\n\n"
                "Third, and the most examined single idea in the "
                "chapter: resonance in the conjugate base. Ethanol and "
                "acetic acid both lose a proton from oxygen, yet differ "
                "by eleven pKa units, because ethoxide's charge is "
                "stranded on one oxygen while acetate's is shared "
                "equally between two - the arrow-derived equivalence "
                "from the previous lesson, now with a price tag. Phenol "
                "(10.0) sits between them: its charge delocalises into "
                "the ring, but onto carbon, which holds negative charge "
                "grudgingly, so the stabilisation is real yet smaller "
                "than acetate's oxygen-to-oxygen sharing. The "
                "three-compound ladder ethanol/phenol/acetic acid "
                "(15.9 / 10.0 / 4.76) is worth carrying in memory as "
                "the calibration of what resonance is worth: several "
                "units when the charge reaches carbon, roughly eleven "
                "when it is shared between oxygens."
            ),
        ),
        ReadingSection(
            id="polar-effect",
            figure=Figure(
                stem="org1-polar-effect",
                caption=(
                    "The polar effect calibrated on the lesson's carboxylic acid data: chlorines stack (left) and the effect decays with distance (right)."
                ),
                alt="Bar chart of pKa values for the chloroacetic series and the chlorobutanoic distance series.",
            ),
            heading="The polar effect, with distance and count",
            body=(
                "Fourth: electron-withdrawing neighbours stabilise a "
                "nearby anion through the sigma framework and space - "
                "the inductive or polar effect. Chloroacetic acid "
                "(2.87) is nearly two units stronger than acetic "
                "(4.76); add chlorines and the effect stacks, "
                "dichloroacetic 1.35, trichloroacetic 0.66 - about "
                "twenty-five thousand times more dissociated than the "
                "parent. The effect decays sharply with distance: "
                "2-chlorobutanoic acid is over a unit stronger than "
                "butanoic, while the 4-chloro isomer barely moves. "
                "Three dials - strength of the withdrawing group, how "
                "many, how far - and all three are read straight off a "
                "structure.\n\n"
                "Last on the checklist, the orbital: a lone pair in an "
                "orbital with more s character sits closer to the "
                "nucleus and is better stabilised, which orders the "
                "hydrocarbons ethyne (~25, sp) far below ethene (~44, "
                "sp2) and ethane (~50, sp3) in pKa. The full checklist "
                "runs in order of typical size - element, charge type, "
                "resonance, polar effect, hybridisation - and ranking "
                "any set of acids means walking it top to bottom, "
                "stopping at the first factor that separates the "
                "candidates. It is the same checklist that will rank "
                "bases, nucleophiles and leaving groups later, each "
                "time read through the conjugate relationship.\n\n"
                "Halogens are the cleanest polar-effect probes, but "
                "the groups that matter most later pull harder. A "
                "nitro group withdraws through both the sigma "
                "framework and resonance, which is why picric acid - "
                "phenol carrying three nitro groups - dives from "
                "10.0 to 0.4, an acidity swing larger than the whole "
                "chloroacetic series. A carbonyl adjacent to a C-H "
                "does the same double duty, and that single fact is "
                "the seed of an entire future chapter: the alpha "
                "hydrogens of a ketone sit near pKa 20, some thirty "
                "units more acidic than an ordinary alkane C-H, "
                "because the enolate they leave behind delocalises "
                "its charge onto oxygen. Put two carbonyls on one "
                "carbon and the pKa falls to about 11, within reach "
                "of alkoxide bases. None of that requires new theory "
                "- it is the resonance and polar entries of this "
                "lesson's checklist applied to C-H acids - and "
                "recognising it now converts the enolate chemistry "
                "of Organic II from a fresh subject into a familiar "
                "calculation."
            ),
            table=Table(
                caption="The polar effect calibrated on carboxylic acids",
                columns=("Acid", "pKa"),
                rows=(
                    ("acetic acid", "4.76"),
                    ("chloroacetic acid", "2.87"),
                    ("dichloroacetic acid", "1.35"),
                    ("trichloroacetic acid", "0.66"),
                    ("butanoic acid", "4.82"),
                    ("2-chlorobutanoic acid", "2.86"),
                    ("4-chlorobutanoic acid", "4.52"),
                ),
                source="Aqueous pKa values, CRC Handbook of Chemistry and Physics",
                note="Read down the first four rows for stacking; compare the last three for distance decay.",
            ),
            important=(
                "All four effects are arguments about the CONJUGATE "
                "BASE. Reasoning about the acid itself ('the O-H bond "
                "is weaker') answers a different, kinetic question. "
                "Stabilise the anion, strengthen the acid - that is "
                "the whole logic."
            ),
        ),
        ReadingSection(
            id="checklist-at-work",
            heading="The checklist at work: three graded rankings",
            body=(
                "Ranking drills make the checklist mechanical, so run "
                "three of increasing subtlety. First: water, ammonia, "
                "methane. One factor - the element effect across a row "
                "- decides everything: O-H beats N-H beats C-H, "
                "15.7 against roughly 38 against roughly 50, and no "
                "later factor needs consulting. Second: ethanol, "
                "2,2,2-trifluoroethanol, acetic acid. All three are "
                "O-H acids, so the element effect is silent and the "
                "checklist moves down. Acetic acid holds the resonance "
                "card - charge shared between two oxygens - and wins "
                "at 4.76. Between the alcohols only the polar effect "
                "differs: three fluorines beta to the alkoxide drop "
                "trifluoroethanol to 12.5, about three and a half "
                "units below ethanol, a pure inductive gap with no "
                "resonance anywhere. The order 4.76 < 12.5 < 15.9 "
                "falls out of the checklist's own priority: resonance "
                "outranks induction here because sharing charge "
                "between oxygens beats pulling on it through bonds.\n\n"
                "Third, the flip side: base strength through conjugate "
                "acids. Why is cyclohexylamine a far stronger base "
                "than aniline? Ask about the conjugate acids: "
                "cyclohexylammonium sits near 10.7, anilinium at 4.6, "
                "so aniline is the weaker base by six units. The "
                "structural reason lives on the neutral amine - "
                "aniline's nitrogen lone pair is partly delegated into "
                "the ring, and protonation costs that delocalisation - "
                "but the bookkeeping runs entirely through the "
                "conjugate-acid pKas, exactly as the leaving-group "
                "and base comparisons before it. One table, one "
                "checklist, read forwards for acids and backwards for "
                "bases: that economy is the reason this chapter sits "
                "at the front of the course rather than in a "
                "review appendix.\n\n"
                "When a ranking resists the checklist, the usual "
                "culprit is two factors pulling in opposite "
                "directions, and the honest answer is to say which "
                "one wins and why - element beats resonance, "
                "resonance usually beats induction, induction beats "
                "hybridisation at close range - rather than to reach "
                "for intuition. Where the factors genuinely balance, "
                "chemists stop arguing and measure; the table's "
                "decimals exist because structure narrows the answer "
                "and experiment settles it. Treat every ranking you "
                "produce as a prediction against those decimals, and "
                "the checklist stays an instrument instead of "
                "becoming a superstition - calibrated, corrected, "
                "and trusted exactly as far as the measurements "
                "allow, which is what a scientific tool is."
            ),
        ),
        ReadingSection(
            id="hybridisation-in-depth",
            heading="The orbital factor, run through acids and bases alike",
            body=(
                "Hybridisation deserves more than its one-line entry "
                "at the checklist's bottom, because it is the factor "
                "students can compute from a drawing fastest. The "
                "physical claim: an sp orbital is half s character, an "
                "sp3 orbital a quarter, and s density sits closer to "
                "the nucleus, so a lone pair in an sp orbital lives at "
                "lower energy than the same pair in sp3. For acids "
                "that means the hydrocarbon ladder already quoted - "
                "ethyne near 25, ethene near 44, ethane near 50 - a "
                "twenty-five-unit sweep with no electronegativity, "
                "resonance or substituent anywhere in sight. Hydrogen "
                "cyanide makes the same point with reinforcement: at "
                "9.2 it is astonishingly acidic for a C-H bond, "
                "because the carbanion's lone pair sits in an sp "
                "orbital and the adjacent nitrogen withdraws through "
                "the sigma framework at once.\n\n"
                "Run the factor backwards and it ranks bases, which "
                "is where exams like to hide it. Piperidine's "
                "nitrogen lone pair is sp3 and its conjugate acid "
                "sits at 11.1; pyridine's lone pair is sp2 - held in "
                "the ring plane, never part of the aromatic system - "
                "and its conjugate acid sits at 5.2. Six units of "
                "basicity vanish purely because pyridine's pair "
                "lives in a lower-energy orbital that holds its "
                "electrons more tightly. The nitrile takes the trend "
                "to its end: an sp lone pair on nitrogen makes "
                "nitriles nearly non-basic (conjugate acid around "
                "-10), which is why cyanide alkylations and nitrile "
                "hydrolyses run without the nitrogen constantly "
                "stealing protons. One geometric fact - count the "
                "attached groups, name the hybridisation - thus "
                "prices both directions of the proton ledger, and "
                "it is the only checklist factor that requires no "
                "knowledge beyond the drawing itself."
            ),
        ),
        ReadingSection(
            id="double-duty-groups",
            heading="Groups that pull twice: through-resonance and position",
            body=(
                "The polar-effect lesson treated substituents as "
                "sigma-framework tugs, but the strongest acidifiers "
                "pull through resonance as well, and the difference "
                "between the two channels is readable from position "
                "on the skeleton. A nitro group para to a phenol "
                "O-H can accept the phenoxide's negative charge "
                "directly by conjugation - draw the arrows and the "
                "charge lands on the nitro oxygens - while a nitro "
                "group meta to the same O-H has no conjugation path "
                "and works only inductively. The measured gap makes "
                "the argument quantitative: para-nitrophenol at 7.14 "
                "against meta-nitrophenol at 8.36, both far below "
                "phenol's 10.0, but the para isomer more than a "
                "unit stronger on the resonance channel alone. "
                "Stack the effect and it compounds: picric acid, "
                "with nitro groups at both ortho positions and "
                "para, reaches 0.4 - a phenol competing with "
                "mineral acids.\n\n"
                "The same double duty is what makes the carbonyl "
                "the most consequential acidifier in the course. "
                "An alpha C-H's conjugate base delocalises its "
                "charge onto the carbonyl oxygen - the enolate - "
                "collapsing a 50-ish alkane pKa to about 20, and a "
                "second flanking carbonyl collapses it again to "
                "about 11. Position is everything: only hydrogens "
                "on the carbon directly bonded to the carbonyl "
                "enjoy the conjugation path, which is why 'alpha' "
                "is the most load-bearing Greek letter in Organic "
                "II. The transferable diagnostic, worth running on "
                "any acid an exam invents: trace whether the "
                "conjugate base's charge can reach the "
                "electron-withdrawing group through an unbroken "
                "alternation of bonds. If it can, expect resonance-"
                "sized numbers; if it cannot, expect the gentler "
                "inductive discount, fading with every intervening "
                "sigma bond."
            ),
            table=Table(
                caption="Position and the two channels: nitrophenols",
                columns=("Compound", "pKa"),
                rows=(
                    ("phenol", "10.0"),
                    ("meta-nitrophenol", "8.36"),
                    ("para-nitrophenol", "7.14"),
                    ("picric acid (2,4,6-trinitrophenol)", "0.4"),
                ),
                source="Aqueous pKa values, CRC Handbook of Chemistry and Physics",
                note="meta = inductive channel only; para adds the through-resonance channel.",
            ),
        ),
        ReadingSection(
            id="aromatic-anions",
            heading="Aromatic conjugate bases: resonance at full strength",
            body=(
                "One family of carbon acids embarrasses the C-H "
                "band entirely, and it is the family whose conjugate "
                "base becomes aromatic. Cyclopentadiene's sp3 CH2 "
                "carbon holds two hydrogens that look utterly "
                "ordinary, yet the molecule is around thirty units "
                "more acidic than an alkane, because removing one "
                "proton creates the cyclopentadienyl anion: five "
                "carbons, six pi electrons, fully delocalised, "
                "aromatic by Huckel's count. Aromaticity is "
                "resonance stabilisation at its physical maximum, "
                "and the pKa pays it out accordingly. The effect "
                "grades smoothly as the aromatic gain is diluted "
                "across fused rings: in Bordwell's DMSO "
                "measurements cyclopentadiene sits at 18.0, indene "
                "- one ring already aromatic, so deprotonation "
                "aromatises only the second - at 20.1, and fluorene "
                "- two rings already aromatic - at 22.6. The more "
                "aromatic character the neutral already owns, the "
                "less the anion gains, and the ladder of three "
                "values records exactly that dilution.\n\n"
                "The same logic run in reverse flags traps. "
                "Deprotonating cycloheptatriene at its sp3 carbon "
                "would create an eight-pi-electron anion - "
                "antiaromatic by the same electron count that "
                "blessed cyclopentadienyl - so no aromatic reward "
                "exists and the acidity stays unremarkable; the "
                "seven-membered ring instead stabilises a cation, "
                "the tropylium ion the carbocation chapter will "
                "meet. The exam-ready skill is one electron count "
                "away: when a ring hydrocarbon shows a surprising "
                "pKa in either direction, count the pi electrons "
                "of the ion that deprotonation or ionisation would "
                "create, and Huckel's 4n+2 will usually be the "
                "entire explanation. It is the checklist's "
                "resonance entry pushed to its limit, and it "
                "previews how much mileage the aromaticity chapter "
                "will get from one small integer rule."
            ),
            table=Table(
                caption="Aromatic stabilisation graded across fused rings (DMSO)",
                columns=("Hydrocarbon", "pKa (DMSO)"),
                rows=(
                    ("cyclopentadiene", "18.0"),
                    ("indene", "20.1"),
                    ("fluorene", "22.6"),
                ),
                source="Bordwell DMSO acidity compilation",
                note="DMSO scale throughout - compare within the column, not against the aqueous table.",
            ),
        ),
        ReadingSection(
            id="basicity-mirror",
            heading="The mirror image: what makes a strong base",
            body=(
                "Every factor in the checklist prices bases as soon "
                "as it is read through the conjugate relationship, "
                "and a short tour of the amine world shows the "
                "machinery running in reverse. Guanidine is among "
                "the strongest neutral organic bases known - its "
                "conjugate acid, guanidinium, holds on to its "
                "proton up to pKa 13.6 - because protonation "
                "creates a cation whose positive charge delocalises "
                "symmetrically across three nitrogens: resonance "
                "stabilising the conjugate ACID this time, pulling "
                "the equilibrium toward protonation. Amidines play "
                "the same trick across two nitrogens and land a "
                "little lower; this is why the biochemistry course "
                "will find arginine's guanidinium side chain "
                "protonated at every physiological pH it visits.\n\n"
                "Aniline sits at the opposite pole, and the "
                "contrast is the classic exam pairing. Its nitrogen "
                "lone pair is partly donated into the aromatic "
                "ring in the neutral amine; protonation must "
                "withdraw the pair from the ring and forfeit that "
                "delocalisation, so anilinium gives up its proton "
                "at 4.6 where cyclohexylammonium holds to 10.7 - "
                "six units of basicity spent on resonance the "
                "neutral enjoyed. Amides push the same effect to "
                "its conclusion: the nitrogen lone pair is so "
                "committed to the carbonyl that amides are not "
                "usefully basic at nitrogen at all, and when "
                "strong acid does protonate an amide it does so on "
                "the carbonyl OXYGEN, where the resulting cation "
                "keeps its resonance. That last fact - protonation "
                "site follows cation stability, not naive charge "
                "logic - resolves a whole family of 'where does "
                "the proton go' questions: draw each candidate "
                "cation, keep the one with the better resonance "
                "story, and the checklist has answered a question "
                "it was never explicitly asked."
            ),
        ),
        ReadingSection(
            id="solvation-and-gas-phase",
            heading="The solvent as silent partner",
            body=(
                "Everything so far reads acidity off the solute's "
                "structure, but the solvent is a full participant, "
                "and two comparisons expose how much of a measured "
                "pKa it owns. First, move a familiar acid from "
                "water to DMSO: acetic acid's 4.76 becomes 12.3, "
                "phenol's 10.0 becomes 18.0. The molecules did not "
                "change - the anions lost their hydrogen-bond "
                "donors. Water stabilises small localised anions "
                "with a tight solvation shell, quietly subsidising "
                "every aqueous acidity; DMSO, unable to donate "
                "hydrogen bonds, withdraws the subsidy, and "
                "acidities built on localised charge collapse by "
                "seven or eight units while delocalised anions "
                "lose less. Second, remove the solvent entirely. "
                "In the gas phase, tert-butanol is a STRONGER acid "
                "than methanol - the exact inversion of the "
                "solution order every teaching table shows - "
                "because the larger alkoxide spreads charge over "
                "more polarisable volume, and in solution that "
                "intrinsic advantage was buried by the fact that "
                "water solvates the small, accessible methoxide "
                "far better than the shrouded tert-butoxide.\n\n"
                "The lesson is calibration, not despair. Within "
                "one solvent, the checklist's rankings hold and "
                "the table is trustworthy; across solvents, only "
                "comparisons that survive the change - resonance "
                "versus none, element versus element - carry over "
                "safely, and any argument resting on a unit or "
                "two must name its solvent to mean anything. The "
                "practical habits: quote the medium with the "
                "number, expect protic-to-aprotic moves to punish "
                "localised anions hardest, and treat gas-phase "
                "orderings as the molecule's intrinsic preference "
                "- the quantity computations deliver - rather "
                "than a contradiction of the flask. The solvent "
                "chapter of physical organic chemistry is built "
                "on this paragraph, and chapter 9's solvent rules "
                "for substitution are its direct descendants."
            ),
        ),
        ReadingSection(
            id="intramolecular-h-bond",
            heading="Ortho effects and the internal hydrogen bond",
            body=(
                "Benzoic acid's ring positions stage one more "
                "effect the checklist must learn to see. Salicylic "
                "acid - benzoic acid with an ortho hydroxyl - "
                "measures 2.98, more than a full unit stronger "
                "than benzoic's 4.20, while the para isomer, "
                "4-hydroxybenzoic acid, is WEAKER than benzoic at "
                "4.54. Same substituent, opposite verdicts, and "
                "position explains both. Para, the hydroxyl acts "
                "through resonance as a pi DONOR, pushing electron "
                "density toward the carboxylate and destabilising "
                "it slightly. Ortho, geometry unlocks something "
                "the para isomer cannot do: the phenolic O-H "
                "reaches across to form an internal hydrogen bond "
                "directly to the carboxylate oxygen, cradling the "
                "negative charge and stabilising the conjugate "
                "base by more than the donor effect costs. The "
                "anion is chelated by its own molecule.\n\n"
                "Intramolecular stabilisation of this kind is "
                "worth a permanent slot in the checklist's small "
                "print, because it overrides the printed trends "
                "whenever geometry allows a five- or six-membered "
                "hydrogen-bonded ring, and exams prize exactly "
                "such override cases. It also cuts the other way: "
                "an ortho substituent can twist a carboxyl or "
                "nitro group out of the ring plane, switching OFF "
                "the through-resonance channel the para isomer "
                "enjoys - steric inhibition of resonance - so "
                "ortho values sit off-trend in both directions "
                "and resist one-line explanations. The honest "
                "procedure when an ortho isomer appears: check "
                "for an internal hydrogen bond first, check for "
                "twisted conjugation second, and only then apply "
                "the ordinary polar arithmetic. Aspirin, the "
                "acetylated salicylic acid the pKa lesson dosed, "
                "is this section's chemistry in a pill bottle: "
                "its 3.5 still carries part of the ortho story, "
                "with the acetyl group having capped the phenol."
            ),
            table=Table(
                caption="One substituent, two positions, opposite verdicts",
                columns=("Acid", "pKa"),
                rows=(
                    ("benzoic acid", "4.20"),
                    ("salicylic acid (2-hydroxybenzoic)", "2.98"),
                    ("4-hydroxybenzoic acid", "4.54"),
                ),
                source="Aqueous pKa values, CRC Handbook of Chemistry and Physics",
                note="Ortho: internal H-bond stabilises the anion. Para: pi donation destabilises it.",
            ),
        ),
        ReadingSection(
            id="checklist-problem-set",
            heading="A graded problem set for the full checklist",
            body=(
                "Four rankings, each engaging a different rung, "
                "worked in checklist order. One: rank HF, HCl, "
                "H2S. HCl beats HF down the halogen column (size "
                "wins, -7 against 3.2); H2S against HF crosses "
                "both row and column, and the measured order - "
                "H2S near 7, between the two - shows why the "
                "checklist demands naming the comparison before "
                "arguing it. Two: rank ethanol, ethanethiol, "
                "phenol. Thiol beats alcohol on the element "
                "column (sulfur below oxygen, ~10 against 15.9); "
                "phenol matches the thiol's ballpark at 10.0 via "
                "resonance instead - two different rungs "
                "delivering the same number, a coincidence worth "
                "noticing because exams build 'explain the tie' "
                "questions from it. Three: rank acetic acid, "
                "trifluoroacetic acid, trichloroacetic acid. All "
                "carboxylic; resonance identical; the polar rung "
                "decides, fluorine out-pulling chlorine per atom, "
                "and trifluoroacetic (0.23) edges trichloroacetic "
                "(0.66), both far below acetic. Four, the "
                "integrator: why is protonated methanol (-2.2) "
                "about thirteen units more acidic than protonated "
                "methylamine (10.7)? Charge type is identical - "
                "both cationic acids - so the ELEMENT rung "
                "decides through the conjugate: deprotonation "
                "hands the lone pair to oxygen in one case and "
                "nitrogen in the other, and oxygen holds it far "
                "more comfortably.\n\n"
                "The pattern across all four: name the rung "
                "before naming the winner. Every wrong answer in "
                "this genre comes from applying a true rule to "
                "the wrong comparison - electronegativity down a "
                "column, resonance where no conjugation path "
                "exists, induction across ten bonds. The "
                "checklist run in order, stopping at the first "
                "deciding factor, is not a mnemonic but an "
                "algorithm, and like any algorithm it is exactly "
                "as reliable as the discipline of its execution."
            ),
        ),
        ReadingSection(
            id="extraction-workflow",
            heading="Acidity in the fume hood: the extraction workflow",
            body=(
                "The classic laboratory payoff of this lesson is "
                "acid-base extraction, the technique that "
                "separates a mixture by charging its components "
                "one at a time. The physics is one sentence: ions "
                "prefer water, neutrals prefer ether, and the pKa "
                "table decides who is ionised at each pH. Suppose "
                "an ether solution holds a carboxylic acid (pKa "
                "~4), a phenol (~10), an amine (conjugate acid "
                "~10), and naphthalene, and the assignment is "
                "four clean flasks. Wash with aqueous "
                "bicarbonate: carbonic acid at 6.35 sits above "
                "the carboxylic acid and below the phenol, so "
                "bicarbonate deprotonates ONLY the carboxylic "
                "acid - the selectivity is pure pKa arithmetic - "
                "and carries its carboxylate into the water "
                "layer. Wash next with sodium hydroxide: 15.7 "
                "clears the phenol's 10, and the phenoxide "
                "leaves. Wash with dilute HCl: the amine "
                "protonates and departs as its ammonium salt. "
                "Naphthalene, with no proton to give or take in "
                "this range, never leaves the ether. Acidify the "
                "bicarbonate and hydroxide layers, basify the "
                "HCl layer, and each compound returns to its "
                "neutral, extractable form.\n\n"
                "Every step of that flowchart is a proton-"
                "transfer equilibrium run at 10-to-1000-fold "
                "completion by choosing a reagent whose conjugate "
                "acid sits comfortably across the target's pKa - "
                "the same ten-unit design rule as synthesis, "
                "administered with a separatory funnel. The "
                "technique appears in every organic teaching lab "
                "and on the MCAT's laboratory questions, and it "
                "rewards exactly one skill: placing four pKas on "
                "one ladder and reading off which base plucks "
                "which compound. Students who can run this "
                "flowchart from the table alone have "
                "demonstrated, with glassware, everything this "
                "chapter's checklist claims to teach."
            ),
        ),
        ReadingSection(
            id="planning-and-protecting",
            heading="Reading forward: acidity as a planning constraint",
            body=(
                "The checklist's last service is prospective: "
                "before any reagent touches any substrate, the "
                "acid-base audit runs first, because "
                "proton transfer is faster than almost everything "
                "else on the menu. The Grignard rule from the "
                "pKa lesson - carbanion reagents die instantly on "
                "any O-H or N-H - generalises into a planning "
                "discipline: list every proton in the flask "
                "below the reagent's conjugate-acid pKa, and if "
                "any belongs to a group the synthesis needs "
                "intact, that group must be masked first. This "
                "is the origin story of protecting groups, a "
                "topic Organic II formalises: converting an "
                "alcohol to a silyl ether or an acetal removes "
                "the acidic proton from the audit, the "
                "carbon-forming step proceeds, and a mild "
                "deprotection restores the original group. The "
                "entire elaborate apparatus exists because of "
                "this chapter's arithmetic, and students who "
                "understand the audit understand why protecting-"
                "group questions are acid-base questions in "
                "costume.\n\n"
                "The audit also selects among bases when speed "
                "and selectivity conflict. Hydroxide is cheap "
                "but attacks carbonyls; LDA is expensive but "
                "removes only protons, quickly, at -78 C, "
                "because its bulk makes it a terrible "
                "nucleophile - the basicity-without-"
                "nucleophilicity trade the next lesson prices "
                "explicitly. Choosing it is a checklist "
                "decision: when the substrate offers both an "
                "acidic proton and an electrophilic carbon, the "
                "chemist wants the reagent that reads only the "
                "proton. Every 'why this base and not that one' "
                "annotation in a later synthesis resolves into "
                "this lesson's vocabulary, which is the final "
                "argument for over-learning it now: acidity is "
                "the one factor consulted in essentially every "
                "reaction the course will ever draw, on both "
                "sides of the arrow, before anything else is "
                "allowed to happen."
            ),
        ),
        ReadingSection(
            id="sulfonic-and-inorganic",
            heading="Completing the map: sulfonic acids and the inorganic anchors",
            body=(
                "Two families round out the acid map the course "
                "draws from. Sulfonic acids - the tosic acid of the "
                "leaving-group lesson, methanesulfonic acid, and "
                "their sulfonate esters - sit near the bottom of "
                "the organic scale at roughly -2 to -3, because "
                "their conjugate bases spread the negative charge "
                "across three equivalent oxygens: acetate's "
                "two-oxygen resonance argument with a third "
                "partner added, worth several further units. That "
                "delocalisation is the entire reason sulfonates "
                "are the laboratory's premium leaving groups, and "
                "it was purchased with nothing but this lesson's "
                "resonance rung. The inorganic oxyacid series "
                "makes the same point systematically: with each "
                "additional bare oxygen on a central atom the "
                "conjugate base gains another resonance partner "
                "and another withdrawing group, which is why the "
                "chlorine oxyacids march from hypochlorous acid "
                "at 7.5 down through chlorous and chloric to "
                "perchloric among the strongest simple acids "
                "known - one structural dial, four compounds, "
                "ten-plus units of range.\n\n"
                "Reading mixed rankings that include such "
                "species is now mechanical: count the oxygens "
                "sharing the charge, then apply the ordinary "
                "checklist for whatever the count leaves "
                "undecided. A student who can rank a sulfonic "
                "acid against a carboxylic acid against a phenol "
                "without consulting any table - three oxygens "
                "sharing beats two beats a ring's worth of "
                "carbon - has internalised the single most "
                "reusable idea in this chapter: acidity is a "
                "census of where the conjugate base's charge "
                "can live, and every structural feature is "
                "either housing for that charge or it is "
                "irrelevant. Ask where the electrons of the anion "
                "would rather be, price each candidate home with "
                "the checklist, and the measured table will agree "
                "with you far more often than any memorised list "
                "of named strong and weak acids ever could. That "
                "habit - structure first, lookup second, "
                "memorisation last - is the working definition of "
                "thinking like an organic chemist, and this "
                "chapter is where the course first demands it in "
                "full, on every ranking, every base choice, and "
                "every leaving group from here to the final exam "
                "and well beyond it."
            ),
        ),
    ),
    key_takeaways=(
        "Checklist order: element (row vs column), charge type, resonance, polar effect, hybridisation - stop at the first factor that separates the candidates.",
        "Across a row electronegativity decides; down a column size wins, which is why HF is the weakest hydrohalic acid.",
        "Ethanol/phenol/acetic acid (15.9 / 10.0 / 4.76) calibrates resonance; acetate's oxygen-shared charge is worth ~11 units over ethoxide.",
        "The polar effect stacks with count and decays with distance: the chloroacetic series 4.76 -> 2.87 -> 1.35 -> 0.66.",
        "Every argument is about conjugate-base stability, and the same checklist will rank bases, nucleophiles and leaving groups later.",
    ),
    exam_tips=(
        "Rank-the-acidity questions: find the single structural difference, name which checklist factor it engages, and rank on that factor alone.",
        "Watch for the row/column trap - electronegativity arguments applied down a column give the inverted (wrong) order.",
    ),
))


# --------------------------------------------------------------------------
# 3.4 Nucleophiles and electrophiles
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.NUCELEC",
    lead=(
        "Once proton transfers are under control, one generalisation "
        "unlocks the rest of the course: acid-base chemistry at atoms "
        "other than hydrogen. A nucleophile is a Lewis base attacking "
        "any electrophilic atom - usually carbon - and nearly every "
        "polar organic reaction is one nucleophile-electrophile bond "
        "formation after another. This lesson maps the two populations, "
        "separates basicity from nucleophilicity (an equilibrium "
        "property against a rate property), and installs the "
        "find-the-partial-charges reflex that turns unfamiliar "
        "reactions into familiar patterns."
    ),
    sections=(
        ReadingSection(
            id="spotting-roles",
            figure=Figure(
                stem="org1-nucleophile-gallery",
                caption=(
                    "The nucleophile side of the cast, by structure: mark the best pair first, then find the most positive carbon."
                ),
                alt="Grid of six common nucleophile structures.",
            ),
            heading="Reading a molecule for its reactive sites",
            body=(
                "Nucleophiles announce themselves by available electron "
                "pairs: lone pairs on anions (hydroxide, halides, "
                "acetylides), lone pairs on neutral heteroatoms (water, "
                "alcohols, amines, sulfides), and pi bonds - the alkene "
                "chemistry of chapters 4 and 5 is the pi bond acting as "
                "a nucleophile. Electrophiles announce themselves by "
                "electron shortage: full positive charges (carbocations, "
                "protonated carbonyls), empty orbitals (the Lewis acids "
                "of the arrow lesson), and - the workhorse case - "
                "partial positive charges created by polar bonds. The "
                "carbon of a C-Br or C-O bond and the carbonyl carbon "
                "of C=O are the course's recurring electrophilic "
                "carbons, each flagged by nothing more than an "
                "electronegativity difference.\n\n"
                "The analysis reflex is mechanical and worth "
                "ritualising: for any pair of reagents, mark the best "
                "electron pair on one and the most positive atom on "
                "the other, and the first arrow of the mechanism "
                "usually draws itself. Run it on hydroxide plus methyl "
                "bromide and SN2 appears; run it on an alkene plus HBr "
                "and chapter 4's addition appears; run it on a "
                "Grignard reagent plus a ketone and the carbonyl "
                "chemistry of Organic II appears. Three chapters' "
                "headline reactions, one reflex."
            ),
        ),
        ReadingSection(
            id="base-vs-nucleophile",
            heading="Basicity versus nucleophilicity",
            body=(
                "Basicity and nucleophilicity both describe electron-"
                "pair donation, and conflating them is the classic "
                "chapter-9 disaster, so the distinction goes in early. "
                "Basicity is thermodynamic: the position of an "
                "equilibrium with a proton, read off the pKa table. "
                "Nucleophilicity is kinetic: how fast the species "
                "attacks an electrophilic atom, usually carbon, "
                "measured by rate constants. The two usually travel "
                "together - within one row, more basic means more "
                "nucleophilic - but they part company in two "
                "reproducible places. Steric bulk crushes "
                "nucleophilicity while barely touching basicity: "
                "tert-butoxide is a stronger base than ethoxide yet a "
                "far worse nucleophile, which is exactly why chapter 9 "
                "reaches for it when elimination is wanted and "
                "substitution is not. And down a column in protic "
                "solvents the two invert outright: iodide is the "
                "weakest halide base but the best halide nucleophile, "
                "because the large, polarisable iodide sheds its "
                "hydrogen-bonded solvent shell cheaply while the "
                "small, tightly solvated fluoride pays full price to "
                "reach the electrophile.\n\n"
                "That solvent dependence is a preview, not a footnote: "
                "switch to a polar aprotic solvent (DMSO, DMF, "
                "acetone), where anions are poorly solvated, and the "
                "halide order reverts to basicity order. File the "
                "pattern now - nucleophilicity is a property of the "
                "nucleophile *in its medium* - and chapter 9 will "
                "spend a full lesson cashing it."
            ),
        ),
        ReadingSection(
            id="leaving-groups",
            figure=Figure(
                stem="org1-pka-ladder",
                caption=(
                    "The same ladder read as a leaving-group ranking: the lower the conjugate acid sits, the better its base leaves."
                ),
                alt="Vertical pKa ladder reused to rank leaving-group quality by conjugate acid.",
            ),
            heading="Leaving groups close the triangle",
            body=(
                "Displacement at carbon needs a third player: the "
                "group that departs with the evicted pair. Leaving-"
                "group quality is conjugate-base quality read once "
                "more off the pKa table - a good leaving group is the "
                "conjugate base of a strong acid, because a species "
                "comfortable carrying the electrons in solution "
                "leaves without protest. Iodide, bromide, chloride "
                "(conjugate acids with negative pKas) leave well; "
                "water leaves well once an alcohol is protonated "
                "(conjugate acid $H_3O^+$, -1.7); hydroxide (water, "
                "15.7) is poor, and $H^-$ or carbanions "
                "(pKa ~36-50) essentially never leave. This single "
                "correlation - look up the conjugate acid, judge the "
                "leaving group - converts a memorised list into a "
                "table lookup, and it explains a rule students "
                "otherwise absorb as dogma: alcohols do not undergo "
                "substitution until acid, tosylation or a phosphorus "
                "reagent upgrades the oxygen's exit.\n\n"
                "With all three roles defined, polar organic "
                "chemistry has its complete cast: a nucleophile "
                "donates, an electrophile accepts, a leaving group "
                "departs, and mechanisms differ mainly in the order "
                "and timing of those three events. Chapter 9 makes "
                "timing the entire subject - concerted attack and "
                "departure (SN2) against departure first (SN1) - so "
                "the vocabulary built here is load-bearing within "
                "two chapters.\n\n"
                "The table also explains the laboratory's favourite "
                "trick: when a molecule's best candidate leaving "
                "group is still poor, chemists install a better one. "
                "Converting an alcohol's O-H into a tosylate ester "
                "swaps hydroxide (conjugate acid pKa 15.7) for the "
                "tosylate anion, conjugate base of a sulfonic acid "
                "with a pKa near -3 - a nineteen-unit upgrade "
                "purchased in one step, without touching the carbon "
                "skeleton. Protonation buys a smaller version of the "
                "same upgrade for free in acidic media, converting "
                "hydroxide into water (-1.7). Both moves will be "
                "routine equipment by chapter 10 of Organic II, and "
                "both are nothing but the conjugate-acid correlation "
                "run deliberately: read the pKa, judge the exit, and "
                "if the exit is bad, re-dress the leaving group "
                "until the table approves. Reagents differ; the "
                "table never does."
            ),
            important=(
                "Judge leaving groups by the pKa of the CONJUGATE "
                "ACID, not by electronegativity. Fluoride's conjugate "
                "acid (HF, 3.2) is the weakest hydrohalic acid, and "
                "fluoride is accordingly the worst halide leaving "
                "group despite being the most electronegative."
            ),
        ),
        ReadingSection(
            id="pattern-transfer",
            heading="Reading unfamiliar reactions with the three roles",
            body=(
                "The payoff for this vocabulary is transfer: a "
                "reaction you have never seen becomes three questions "
                "asked in order. Who has the best available electron "
                "pair? Which atom is most electron-poor? What can "
                "leave with a pair and be stable doing it? Run the "
                "questions on cyanide plus a ketone - a reaction from "
                "eight chapters ahead. Cyanide's carbon lone pair is "
                "the standout nucleophile; the carbonyl carbon, "
                "flagged delta-plus by its oxygen, is the "
                "electrophile; nothing on that carbon can leave, so "
                "the pi bond's pair retreats onto oxygen instead of "
                "an eviction - association logic on a full octet, "
                "resolved by the pi bond's flexibility. The drawn "
                "prediction is the cyanohydrin mechanism, produced "
                "from role analysis alone.\n\n"
                "The same three questions expose what acid catalysis "
                "is actually for. Protonate a carbonyl oxygen and the "
                "carbon's partial positive grows sharply; protonate "
                "an alcohol's oxygen and a non-leaving hydroxide "
                "becomes a serviceable water. Acid does not change "
                "the cast of roles - it upgrades an electrophile or "
                "a leaving group that was too weak to act. Base "
                "catalysis mirrors it on the nucleophile side, "
                "converting a mediocre neutral donor into its anion. "
                "Nearly every 'conditions' choice the course presents "
                "reduces to which role needed the upgrade, and "
                "students who ask the three questions first stop "
                "experiencing new chapters as new material: the "
                "chapters differ in which electrophile is on stage, "
                "while the analysis never changes.\n\n"
                "Two boundary cases complete the toolkit. Some "
                "nucleophiles carry two usable sites - cyanide can "
                "bond through carbon or nitrogen, an enolate through "
                "carbon or oxygen - and which site reacts depends on "
                "the electrophile and the conditions; file the word "
                "ambident now, and the full treatment arrives with "
                "enolate chemistry. And some molecules hold a "
                "nucleophilic and an electrophilic site in one "
                "skeleton, which is what makes ring closures and "
                "polymerisation possible: the three questions still "
                "apply, asked of one molecule twice. Neither case "
                "adds a new principle - they add the discipline of "
                "asking the questions about every reactive site "
                "present, not just the loudest one. That discipline "
                "is the difference between pattern-matching a "
                "reaction you recognise and analysing one you do "
                "not, and the second skill is the one both the "
                "course and the MCAT actually test: exams "
                "deliberately dress familiar role-analysis in "
                "unfamiliar molecules to see whether the method or "
                "the memory was doing the work."
            ),
        ),
        ReadingSection(
            id="nucleophilicity-scales",
            heading="Measuring nucleophilicity, and the alpha-effect surprise",
            body=(
                "Nucleophilicity being kinetic, it is measured the "
                "only way rates can be: race the candidates against "
                "a common electrophile and compare rate constants. "
                "The classic series race nucleophiles against methyl "
                "halides in a fixed solvent, and the results, "
                "compiled into scales like Swain and Scott's n "
                "parameter, quantify what the qualitative lesson "
                "already claimed - thiolate outruns alkoxide, iodide "
                "outruns fluoride in protic media, azide and cyanide "
                "punch far above their modest basicity. Three "
                "ingredients explain nearly every entry. "
                "Polarisability: a large, squashable electron cloud "
                "starts binding the electrophile at long range, "
                "which is sulfur's and iodine's whole advantage. "
                "Solvation: whatever the solvent grips hardest "
                "arrives slowest, the protic-solvent story already "
                "told. And charge: an anion outruns its neutral "
                "parent - hydroxide beats water by orders of "
                "magnitude toward the same carbon.\n\n"
                "One reproducible anomaly earns its own name. "
                "Nucleophiles bearing a lone-pair-carrying atom "
                "directly adjacent to the attacking atom - "
                "hydroperoxide, hydrazine, hydroxylamine - react "
                "faster than their pKa predicts, sometimes by a "
                "hundredfold: the alpha effect. The adjacent lone "
                "pair raises the attacking pair's energy and "
                "stabilises the forming transition state, and "
                "biology exploits the effect wherever fast "
                "nucleophilic chemistry is needed at modest "
                "basicity. The practical residue for this course "
                "is a calibration point: basicity predicts "
                "nucleophilicity only as a first draft, and the "
                "corrections - bulk, solvent, polarisability, "
                "alpha lone pairs - are not noise but chemistry, "
                "each with a mechanism a later chapter will cash. "
                "When an exam offers rate data that contradicts "
                "the pKa ordering, the data is not wrong; one of "
                "these four corrections is the intended answer."
            ),
        ),
        ReadingSection(
            id="hsab",
            heading="Hard and soft: a second axis for matching partners",
            body=(
                "Ranking nucleophiles on one axis misses a pattern "
                "chemists kept rediscovering: some pairings are "
                "simply happier than either partner's rank "
                "predicts. The organising idea, due to Pearson, "
                "sorts both nucleophiles and electrophiles by "
                "charge concentration. Hard species are small, "
                "charge-dense, weakly polarisable - fluoride, "
                "hydroxide, alkoxides among nucleophiles; protons "
                "and the carbonyl carbon among electrophiles. "
                "Soft species are large, diffuse, polarisable - "
                "thiolate, iodide, cyanide's carbon; heavy-metal "
                "cations and polarisable carbon electrophiles like "
                "alkyl halides. The rule of thumb: hard prefers "
                "hard, soft prefers soft. Hard-hard bonding is "
                "electrostatic, driven by concentrated charges "
                "attracting; soft-soft bonding is covalent, driven "
                "by orbital overlap between diffuse clouds.\n\n"
                "The rule pays immediately and repeatedly. "
                "Mercury, lead and cadmium poison enzymes by "
                "seeking out soft sulfur - cysteine thiolates - "
                "while calcium and magnesium, hard, partner with "
                "hard oxygen ligands; the toxicology of half the "
                "periodic table is one sorting rule. Thiolate "
                "attacking an alkyl halide in preference to the "
                "harder alkoxide is a soft-soft match the "
                "substitution chapter will use for thioether "
                "synthesis. And ambident nucleophiles - species "
                "with two candidate attacking atoms - become "
                "predictable: cyanide's soft carbon end attacks "
                "soft alkyl halides to give nitriles, while "
                "harder electrophiles court the nitrogen end; an "
                "enolate's soft carbon alkylates while its hard "
                "oxygen end acylates and protonates. None of "
                "this replaces the pKa table or the rate scales "
                "- hardness is a second axis, consulted when the "
                "first axis leaves a choice, and its verdicts "
                "are qualitative. But as a tiebreaker it is "
                "remarkably reliable, and it converts the "
                "ambident cases from memorised exceptions into "
                "one rule applied twice."
            ),
        ),
        ReadingSection(
            id="solvent-engineering",
            heading="Solvent engineering: making nucleophiles fast on purpose",
            body=(
                "The protic-solvent penalty on small anions is not "
                "just an explanation - it is a dial synthetic "
                "chemists turn deliberately, and the polar aprotic "
                "solvents are the tool. DMSO, DMF, acetonitrile "
                "and acetone dissolve salts well - their dipoles "
                "solvate the CATION beautifully - but, lacking "
                "O-H or N-H bonds, they cannot hydrogen-bond to "
                "the anion, which is left exposed, energetic, and "
                "fast. Moving an SN2 reaction from methanol to "
                "DMSO can accelerate it by factors of a thousand "
                "or more, and it re-sorts the halide order: "
                "freed from solvation costs, fluoride through "
                "iodide revert to basicity order, with fluoride "
                "the strongest nucleophile of the four. The "
                "substitution chapter's solvent rules are this "
                "paragraph restated, and choosing 'DMF, room "
                "temperature' off a reagent list is applied "
                "acid-base kinetics, not fashion.\n\n"
                "Two further tools push the same logic to its "
                "limit. Crown ethers - cyclic polyethers sized "
                "to swallow a specific cation - sequester the "
                "potassium of KF or KCN inside their ring, "
                "leaving behind a 'naked' anion in even nonpolar "
                "media; 18-crown-6 turning potassium fluoride "
                "into a usable fluorinating nucleophile is the "
                "textbook demonstration. Phase-transfer "
                "catalysts do the industrial version, ferrying "
                "anions from an aqueous layer into an organic "
                "one as lipophilic ion pairs, so a cheap aqueous "
                "base can serve an organic-phase alkylation. "
                "File all three - aprotic solvents, crowns, "
                "phase transfer - under one principle: a "
                "nucleophile's observed strength is its "
                "intrinsic strength minus its solvation bill, "
                "and chemistry has invented an entire toolkit "
                "for refusing to pay that bill."
            ),
        ),
        ReadingSection(
            id="electrophile-gallery",
            heading="Ranking the electrophiles",
            body=(
                "The nucleophile side of the ledger got the "
                "scales; the electrophile side deserves its own "
                "gallery, ranked by how badly each species needs "
                "electrons. At the top sit full positive charges "
                "with empty orbitals: carbocations, the strongest "
                "common electrophiles in the course, and the "
                "protonated carbonyls acid catalysis "
                "manufactures. Below them, the neutral but "
                "genuinely empty: borane and the aluminium and "
                "iron halides, electron-deficient by "
                "construction. Then the broad working class - "
                "carbons wearing partial positive charges from "
                "polar bonds - internally ranked by how much "
                "positive character the attached groups produce "
                "and how easily the carbon is reached. Within "
                "the carbonyl family that internal ranking "
                "becomes the spine of Organic II: an acyl "
                "chloride's carbon, flanked by two withdrawing "
                "groups, is ferociously electrophilic; aldehydes "
                "beat ketones on both sterics and electronics; "
                "esters and amides bring up the rear because "
                "their heteroatom lone pairs donate INTO the "
                "carbonyl by resonance, quenching the very "
                "positive charge a nucleophile would seek. That "
                "one sentence is the reactivity order of an "
                "entire semester of carbonyl chemistry, "
                "purchasable now for the price of reading a "
                "resonance structure.\n\n"
                "The gallery's oddest member is the halogen "
                "molecule. Br2 carries no dipole at all, yet "
                "chapter 5 will show it attacking alkenes as an "
                "electrophile, because its sigma-antibonding "
                "orbital is low-lying and its electron cloud so "
                "polarisable that an approaching pi bond induces "
                "the dipole it needs - electrophilicity created "
                "on demand. The general lesson: electrophilic "
                "character is about an accessible empty or "
                "low-lying orbital, of which partial positive "
                "charge is only the most visible advertisement. "
                "Judge candidates by asking where a donated "
                "pair could land, and the gallery orders "
                "itself."
            ),
        ),
        ReadingSection(
            id="ambident-depth",
            heading="Two-faced nucleophiles: the ambident cases worked",
            body=(
                "The pattern-transfer lesson filed the word "
                "'ambident'; this section pays the file off with "
                "the three classic cases. Cyanide first: the "
                "anion's carbon end is softer and more "
                "nucleophilic, so alkylation with an alkyl "
                "halide bonds through carbon and delivers a "
                "nitrile - the chain-extension move the course "
                "will use repeatedly. The nitrogen end reacts "
                "only when the carbon end is blocked or the "
                "electrophile's character changes, the classic "
                "demonstration being silver cyanide, where "
                "silver's soft affinity ties up the carbon and "
                "alkylation delivers the isonitrile instead - a "
                "result nineteenth-century chemists found "
                "baffling and hard-soft logic renders "
                "inevitable. Nitrite second: attack through "
                "nitrogen gives a nitroalkane, through either "
                "oxygen an alkyl nitrite ester, and conditions "
                "steer the split the same way. Enolate third, "
                "and most consequential: carbon attack builds "
                "C-C bonds (alkylation, aldol - the money "
                "chemistry of Organic II), oxygen attack gives "
                "enol ethers and enol esters, and the choice "
                "between them is steered by electrophile "
                "hardness, counterion, and solvent.\n\n"
                "The transferable method is to treat an "
                "ambident nucleophile as two nucleophiles "
                "sharing one molecule and run the ordinary "
                "analysis on each: which end is softer, which "
                "is more hindered, which does the solvent or "
                "the counterion currently occupy. Lithium "
                "cations chelating an enolate's oxygen bias "
                "reactions toward carbon; polar aprotic "
                "solvents that free the oxygen bias toward it. "
                "Exams love ambident species precisely because "
                "memorisation fails on them - the same anion "
                "gives different products under different "
                "flags - while the two-nucleophiles-one-ion "
                "analysis answers every variant from "
                "principles this chapter already owns."
            ),
        ),
        ReadingSection(
            id="bio-nucleophiles",
            heading="Nucleophiles and electrophiles in the cell",
            body=(
                "Biochemistry runs on this lesson's vocabulary, "
                "and naming the cell's cast makes both courses "
                "easier. The workhorse biological nucleophiles "
                "are exactly the ones this chapter would "
                "predict: serine's alkoxide-like oxygen once a "
                "catalytic partner deprotonates it, cysteine's "
                "thiolate - soft, polarisable, the single most "
                "nucleophilic side chain - lysine's amine, and "
                "histidine's imidazole nitrogen. The serine "
                "proteases that digest your lunch work by "
                "role-analysis: an activated serine oxygen "
                "attacks the amide carbonyl carbon of a "
                "substrate protein - nucleophile, electrophile, "
                "tetrahedral intermediate, leaving group - in "
                "precisely the grammar of the arrow lesson. "
                "Aspirin's mechanism of action is the same "
                "sentence with the roles recast: its reactive "
                "acetyl group acylates a serine oxygen in "
                "cyclooxygenase, permanently switching the "
                "enzyme off. And the cell's standing defence "
                "against unwanted electrophiles is glutathione, "
                "a cysteine-bearing tripeptide maintained at "
                "high concentration precisely to soak up "
                "electrophilic intruders through its soft "
                "thiol before they reach anything important.\n\n"
                "The dark side of the ledger teaches the same "
                "chemistry. DNA's most nucleophilic site is a "
                "guanine ring nitrogen, and alkylating agents "
                "- the nitrogen mustards descended from "
                "wartime chemistry - are simply aggressive "
                "electrophiles that find it; their "
                "descendants, dosed carefully, remain cancer "
                "chemotherapy today, killing the fastest-"
                "dividing cells by alkylating the DNA they "
                "must copy. Acetaminophen overdose is an "
                "electrophile story too: a reactive quinone "
                "imine metabolite exhausts the liver's "
                "glutathione and then attacks liver-protein "
                "thiols, which is why the antidote is a "
                "cysteine derivative - replacement nucleophile "
                "administered by IV. Every one of these "
                "medical facts is the find-the-pair, "
                "find-the-positive-atom reflex wearing a "
                "white coat."
            ),
        ),
        ReadingSection(
            id="nucelec-problem-set",
            heading="Spot the roles: a worked problem set",
            body=(
                "Five drills, run with the three questions. One: "
                "sodium azide plus 1-bromobutane in DMF. Azide is "
                "the standout pair-carrier, the C-Br carbon wears "
                "the partial positive, bromide is a table-"
                "approved leaving group; predict substitution at "
                "carbon, accelerated by the aprotic solvent - and "
                "this is in fact a standard way to install "
                "nitrogen. Two: acetic acid plus ammonia. Both "
                "reagents carry pairs and both carry acidic "
                "protons, so check proton transfer FIRST - the "
                "audit rule - and the pKa gap (4.76 against "
                "ammonium's 9.25) settles it: salt formation, "
                "quantitative, no carbon chemistry at room "
                "temperature. Three: borane plus an alkene. No "
                "acidic proton anywhere; borane's empty orbital "
                "is the electrophilic site and the pi bond the "
                "nucleophile - association logic that chapter 5 "
                "will name hydroboration. Four: methanol plus "
                "tosyl chloride with pyridine. Methanol's oxygen "
                "is the nucleophile, sulfur the electrophile, "
                "chloride leaves, pyridine mops the released "
                "proton - the leaving-group upgrade from the "
                "previous section, now legible as one sentence. "
                "Five: tert-butoxide plus 2-bromopropane. The "
                "pair-carrier is also severely bulky, so attack "
                "at carbon is throttled and the reagent acts as "
                "a base instead - elimination, previewed "
                "honestly two chapters early.\n\n"
                "Notice the meta-pattern across the five: the "
                "questions never changed, and every 'exception' "
                "was one of the calibrations this chapter "
                "installed - proton transfer outrunning "
                "everything, bulk suppressing nucleophilicity, "
                "solvent choosing the winner. That is the "
                "claim this lesson opened with, now "
                "demonstrated: polar organic chemistry is one "
                "analysis, repeated, with corrections you can "
                "name."
            ),
        ),
        ReadingSection(
            id="mayr-and-rates",
            heading="How far the numbers go: modern reactivity scales",
            body=(
                "The Swain-Scott ranking raced nucleophiles "
                "against one electrophile; modern physical "
                "organic chemistry, principally Mayr's group in "
                "Munich, built the full grid - benchmark "
                "electrophiles of graded strength raced against "
                "hundreds of nucleophiles - and found that a "
                "simple relation, log k = s(N + E), with one "
                "nucleophilicity parameter N, one "
                "electrophilicity parameter E and a slope near "
                "one, predicts rate constants across more than "
                "thirty orders of magnitude. The details belong "
                "to a later course; the two consequences worth "
                "importing now are conceptual. First, "
                "nucleophilicity and electrophilicity are "
                "genuinely quantitative, additive properties - "
                "the qualitative rankings this chapter teaches "
                "are the visible edge of a measured, published "
                "grid, not folklore. Second, the grid has a "
                "speed limit: when N + E is large enough, the "
                "predicted rate crosses the diffusion ceiling - "
                "partners react at every encounter - and beyond "
                "it, stronger reagents buy no more speed, only "
                "less selectivity. That last trade, speed "
                "against selectivity, is one of chemistry's "
                "recurring bargains, and it will resurface from "
                "radical halogenation's selectivity story to "
                "the choice of mild reagents in late-stage "
                "synthesis.\n\n"
                "For this course the payoff is a disposition "
                "rather than a formula: treat 'good "
                "nucleophile' and 'strong electrophile' as "
                "measurable claims about rate constants, "
                "expect them to combine roughly additively, "
                "and expect ceilings. A student who carries "
                "that disposition reads reagent tables the "
                "way the field actually built them - as "
                "compressed kinetics - and is proof against "
                "the superstition that reactivity rules are "
                "arbitrary."
            ),
        ),
        ReadingSection(
            id="nucelec-history",
            heading="Where the vocabulary came from",
            body=(
                "The words this chapter leans on are younger "
                "than the reactions they describe. Arthur "
                "Lapworth, working in Manchester around 1903, "
                "produced what is usually counted the first "
                "true reaction mechanism - the cyanohydrin "
                "formation this chapter's pattern-transfer "
                "section derived - by showing that cyanide "
                "attacks the carbonyl carbon first, with the "
                "proton arriving afterwards. Two decades of "
                "electronic theory later, Christopher Ingold's "
                "school in London systematised the field and, "
                "in 1933, coined the working titles: "
                "nucleophile for the electron-rich seeker of "
                "positive centres, electrophile for its "
                "electron-poor counterpart, folding Lewis's "
                "1923 electron-pair acids and bases into "
                "reaction chemistry. The same school gave the "
                "course the labels SN1, SN2, E1 and E2 that "
                "chapter 9 will spend weeks inside, and the "
                "kinetic experiments behind those labels - "
                "rate laws distinguishing one-step from "
                "two-step displacements - remain models of "
                "how mechanism is actually argued.\n\n"
                "The history earns its space because it "
                "locates the chapter's claims in evidence "
                "rather than convention. Roles were "
                "controversial once; they won because they "
                "predicted rate laws, product distributions "
                "and solvent effects that the older "
                "name-and-memorise chemistry could not. When "
                "this course insists that an unfamiliar "
                "reaction yield to three questions about "
                "pairs, positive atoms and exits, it is "
                "repeating a wager Lapworth and Ingold made "
                "against the descriptive chemistry of their "
                "day - and the century of mechanisms drawn "
                "since is the record of that wager paying "
                "out."
            ),
        ),
        ReadingSection(
            id="pi-nucleophiles",
            heading="The pi bond as nucleophile: a graded family",
            body=(
                "Anions and lone pairs are the obvious "
                "nucleophiles; the course's most productive ones "
                "are neither. A pi bond holds its two electrons "
                "above and below the internuclear axis, "
                "unshielded by any sigma framework, and those "
                "electrons are donatable - weakly for an "
                "isolated alkene, better with every "
                "electron-donating substituent, dramatically "
                "when a heteroatom lone pair conjugates into "
                "the system. The family is worth grading now "
                "because three later chapters each pick one "
                "member. Simple alkenes attack only strong "
                "electrophiles - protons from strong acids, "
                "polarised halogens, carbocations - which is "
                "chapter 5's addition chemistry. Aromatic "
                "rings, their pi density stabilised by "
                "aromaticity, are lazier nucleophiles still, "
                "needing the activated electrophiles and "
                "Lewis-acid help of the substitution chemistry "
                "in Organic II. And enols and enolates - a pi "
                "bond wearing an oxygen donor - are the "
                "family's athletes, nucleophilic enough at "
                "carbon to build the C-C bonds most of "
                "synthesis depends on.\n\n"
                "Reading pi nucleophilicity is the same "
                "census as reading anion stability, run in "
                "reverse: every donor raising the pi system's "
                "electron density raises its reactivity, every "
                "withdrawer lowers it. That single gradient, "
                "applied to one functional family at a time, "
                "IS the reactivity half of the entire second "
                "semester, and meeting it here - as one more "
                "instance of the find-the-pair reflex rather "
                "than as three unrelated chapters - is the "
                "difference between learning the course once "
                "and learning it three times."
            ),
        ),
        ReadingSection(
            id="role-reversal",
            heading="Role reversal: the idea of umpolung",
            body=(
                "One closing idea shows how seriously chemists "
                "take the role vocabulary: they invented "
                "machinery for breaking it. Normal polarity is "
                "set by electronegativity - a carbonyl carbon "
                "is electrophilic, the alpha carbon "
                "nucleophilic once deprotonated - and whole "
                "classes of target molecules are awkward to "
                "assemble because every natural disconnection "
                "asks two electrophiles or two nucleophiles to "
                "bond. The German school named the remedy "
                "umpolung, polarity reversal: dress a carbon "
                "in temporary groups that invert its natural "
                "role, form the once-impossible bond, then "
                "undress it. The acyl anion equivalents of "
                "advanced synthesis - and, biochemistry's own "
                "example, the thiamine cofactor that lets a "
                "pyruvate-derived carbon attack as a "
                "nucleophile - are exactly this trick, and "
                "they only make sense to a student who first "
                "believes the normal role assignments this "
                "chapter installed.\n\n"
                "No exam in this course will require an "
                "umpolung synthesis. The concept is here "
                "because it certifies the framework: roles "
                "are real enough that reversing them is a "
                "named achievement, taught, celebrated and "
                "occasionally Nobel-adjacent. When the "
                "carbonyl chapters later show sulfur ylides "
                "and cyanide doing double duty, the right "
                "reaction is recognition - polarity "
                "engineering, the advanced wing of the same "
                "building this chapter entered by the front "
                "door. The three questions still decide "
                "every step; umpolung just changes which "
                "atom holds which answer. Master the normal "
                "assignments now - best pair, most positive "
                "atom, stable exit - and every reversal, "
                "exception and special reagent the rest of the "
                "course produces will register as a variation "
                "on machinery you already own rather than as "
                "another list to memorise."
            ),
        ),
    ),
    key_takeaways=(
        "Nucleophiles = available pairs (anions, heteroatom lone pairs, pi bonds); electrophiles = electron shortage (cations, empty orbitals, delta-plus carbons).",
        "Basicity is equilibrium (pKa table); nucleophilicity is rate - bulk and protic-solvent effects split them apart.",
        "Iodide: weakest halide base, best halide nucleophile in protic solvent; the order reverts in polar aprotic solvent.",
        "Leaving-group quality = conjugate base of a strong acid; one more read of the same pKa table.",
        "Mark the best pair and the most positive atom and the first arrow draws itself - the reflex behind chapters 4, 5, 9 and the carbonyl chapters.",
    ),
    exam_tips=(
        "When a question pairs a bulky strong base (tert-butoxide) with a substitution/elimination choice, the bulk is the clue: elimination.",
        "Leaving-group ranking questions are pKa questions in costume - rank the conjugate acids and you have ranked the leaving groups.",
    ),
))

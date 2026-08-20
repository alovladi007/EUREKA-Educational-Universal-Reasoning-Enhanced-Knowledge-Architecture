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

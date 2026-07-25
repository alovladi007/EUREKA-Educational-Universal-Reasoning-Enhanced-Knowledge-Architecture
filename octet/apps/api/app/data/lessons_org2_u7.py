"""ORG2 Unit 7: Carboxylic Acid Derivatives.

The chemistry of this unit is one reaction seen eight times. A nucleophile adds
to a carbonyl carbon, a tetrahedral intermediate forms, and a leaving group
departs, which turns one acid derivative into another. That single mechanism,
nucleophilic acyl substitution, is what makes an acid chloride into an ester and
an ester into an amide, and it is what strings monomers into a polyamide.

The line between a checkable fact and an uncheckable one runs straight through
the unit, so it is worth stating before any lesson leans on it.

Checkable, and therefore claimed, re-derived from structure by RDKit when the
test suite runs:

  molecular formula of every substrate and every product   Formula
  degrees of unsaturation, which track the loss and return
  of the carbonyl pi bond through a transformation          Unsaturation
  proton environments, which track molecular symmetry       Environments
  the configuration of a stereocentre carried through a
  reaction that does not touch it                           Stereo

Not checkable by anything here, and therefore carried as a Source with a real
citation or omitted:

  the reactivity ordering acid chloride > anhydride > ester > amide, which is
  taught as a consequence of leaving-group ability and of resonance donation
  from the atom next to the carbonyl, and which is stated qualitatively rather
  than with invented rate constants
  the position of the carbonyl stretch in the infrared, which shifts with the
  derivative type and is given as a range from a correlation chart
  the pKa values that rank the leaving groups
  whether a transformation proceeds under stated conditions

Two facts about charged species are worth flagging because the claim system
treats them exactly as the authoring guidance says it should. The anionic
tetrahedral intermediate and the carboxylate product each carry a Formula, and
the Unsaturation verifier refuses them, because degrees of unsaturation are not
defined for an ion. Where a formula string below ends in a minus sign, that is a
claim about a charged structure and it was derived, not written from memory.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Source, Stereo, Unsaturation
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once so a claim and its prose cannot drift apart. Every
# SMILES here was passed through RDKit during authoring; the stereo strings in
# particular were read back from the descriptor rather than reasoned out by
# hand, because a hand-written (S)-alanine came out (R) on the first attempt.
# ---------------------------------------------------------------------------

ACETYL_CHLORIDE = "CC(=O)Cl"
ACETIC_ANHYDRIDE = "CC(=O)OC(C)=O"
METHYL_ACETATE = "COC(C)=O"
ETHYL_ACETATE = "CCOC(C)=O"
ACETAMIDE = "CC(=O)N"
ACETIC_ACID = "CC(=O)O"

METHANOL = "CO"
ETHANOL = "CCO"
# Anionic tetrahedral intermediate from methoxide adding to acetyl chloride,
# before chloride leaves. Charged, so it carries a Formula and no Unsaturation.
TETRAHEDRAL_INTERMEDIATE = "CC([O-])(Cl)OC"
# The carboxylate that makes saponification irreversible. Also charged.
ACETATE = "CC(=O)[O-]"

BENZOYL_CHLORIDE = "ClC(=O)c1ccccc1"
BENZOIC_ACID = "OC(=O)c1ccccc1"
BENZAMIDE = "NC(=O)c1ccccc1"

N_METHYLACETAMIDE = "CC(=O)NC"
GLYCINE = "NCC(=O)O"
GLYCYLGLYCINE = "NCC(=O)NCC(=O)O"
# (S)-alanine is the L amino acid. RDKit reads this string as S; the mirror
# arrangement reads as R.
L_ALANINE = "N[C@@H](C)C(=O)O"
# Alanylglycine built from (S)-alanine. Acylation happens at alanine's carboxyl
# carbon, not at its alpha carbon, so the alpha stereocentre stays S.
ALA_GLY = "N[C@@H](C)C(=O)NCC(=O)O"

METHYL_BENZOATE = "COC(=O)c1ccccc1"
BENZYL_ALCOHOL = "OCc1ccccc1"
BENZALDEHYDE = "O=Cc1ccccc1"
ETHYLAMINE = "CCN"
ACETALDEHYDE = "CC=O"

ACETONE = "CC(C)=O"
TERT_BUTANOL = "CC(C)(C)O"

ETHYLENE_GLYCOL = "OCCO"
TEREPHTHALIC_ACID = "OC(=O)c1ccc(C(=O)O)cc1"
HEXANEDIAMINE = "NCCCCCCN"
ADIPIC_ACID = "OC(=O)CCCCC(=O)O"

# ---------------------------------------------------------------------------
# Citations. Every number or ordering this unit states that the repository
# cannot derive points at one of these.
# ---------------------------------------------------------------------------

CLAYDEN = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, Oxford "
    "University Press 2012, chapters on nucleophilic substitution at the "
    "carbonyl group and on organometallic addition to carbonyls."
)
CLAYDEN_POLYMERS = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, Oxford "
    "University Press 2012, chapter on polymerization."
)
SILVERSTEIN = (
    "Silverstein, Webster, Kiemle and Bryce, Spectrometric Identification of "
    "Organic Compounds, 8th edition, Wiley 2014, infrared correlation charts "
    "in the carbonyl-compound section."
)
CRC_PKA = (
    "CRC Handbook of Chemistry and Physics, table of dissociation constants of "
    "organic acids and bases; values quoted as approximate ranks, not "
    "analytical figures."
)

LESSONS_ORG2_U7 = {
    "ORG2.DERIVATIVEREACTIVITY": Lesson(
        node="ORG2.DERIVATIVEREACTIVITY",
        objective=(
            "Place the four common carboxylic acid derivatives on one "
            "reactivity ladder, and explain the order from the two structural "
            "causes that set it: the ability of the leaving group to leave and "
            "the resonance donation of the atom attached to the carbonyl."
        ),
        build_on=(
            "You know from ORG1 that a carbonyl carbon is electrophilic because "
            "oxygen pulls electron density out of the pi bond. Every compound in "
            "this unit has that same carbonyl. What changes from one to the next "
            "is the single atom sitting on the other side of it, and this lesson "
            "is about how much that one atom changes."
        ),
        core_idea=(
            "A carboxylic acid derivative is an acyl group, R-C(=O)-, joined to "
            "one heteroatom that can leave. The four you meet here are the acid "
            "chloride, where that atom is chlorine, the anhydride, where it is "
            "an acyloxy group, the ester, where it is an alkoxy group, and the "
            "amide, where it is nitrogen. They fall in one fixed order of "
            "reactivity toward nucleophiles: acid chloride, then anhydride, then "
            "ester, then amide, most reactive first. Two causes act in the same "
            "direction and set that order. The first is leaving-group ability: "
            "chloride is the conjugate base of a strong acid and leaves easily, "
            "an alkoxide is the conjugate base of a weak alcohol and leaves "
            "reluctantly, and an amide nitrogen leaves worst of all. The second "
            "is resonance donation into the carbonyl. A lone pair on the atom "
            "next to the carbonyl can push into the pi system and lower the "
            "carbon's electrophilicity, and nitrogen does this strongly, oxygen "
            "less, chlorine barely at all. Nitrogen both donates the most and "
            "leaves the worst, which is why the amide sits at the unreactive end "
            "of the ladder and the acid chloride sits at the reactive end."
        ),
        worked_example=(
            "Line the acetyl series up and read the structures. Acetyl chloride, "
            "C2H3ClO, is the acetyl group on chlorine. Acetic anhydride, "
            "C4H6O3, is two acetyl groups sharing one oxygen, so it is one "
            "reactive acyl group with a carboxylate-like leaving group. Ethyl "
            "acetate, C4H8O2, is the acetyl group on an ethoxy oxygen whose lone "
            "pair donates into the carbonyl. Acetamide, C2H5NO, is the acetyl "
            "group on nitrogen, whose lone pair donates hardest. Notice a "
            "symmetry fact that reports the anhydride's structure directly: its "
            "two acetyl groups are equivalent, so all six of its hydrogens are "
            "one environment. Now use the ladder in the only way it is meant to "
            "be used, which is downhill. You can convert any derivative into one "
            "below it on the ladder because the incoming nucleophile brings a "
            "worse leaving group than the one being expelled, so an acid "
            "chloride makes an ester and an ester makes an amide. The reverse "
            "steps do not happen by simple substitution, because they would have "
            "to expel a better leaving group than the one arriving, and that is "
            "the whole predictive content of the ladder."
        ),
        try_it_prompt=(
            "You want an amide and you have the choice of starting from an acid "
            "chloride or from another amide by swapping its nitrogen group. "
            "Which direction on the reactivity ladder works, and why does the "
            "other one fail?"
        ),
        try_it_answer=(
            "Start from the acid chloride. Going acid chloride to amide is a "
            "downhill step: the amine nucleophile arrives and chloride, a good "
            "leaving group, departs, so the reaction runs. Trying to make one "
            "amide from another by substitution is an uphill step in disguise, "
            "because it would require an amide nitrogen, a poor leaving group, "
            "to be expelled in favour of the incoming one. The ladder only lets "
            "you move toward the less reactive end, and the amide is already at "
            "that end."
        ),
        pitfall=(
            "The belief that trips people is that reactivity tracks the size or "
            "the polarity of the leaving atom on its own, so chlorine wins "
            "because it is big and electronegative. Electronegativity is part of "
            "it, but the deciding quantity is how stable the group is once it has "
            "left as an anion, which is what leaving-group ability means, "
            "reinforced by how much the group donates back into the carbonyl "
            "while it is still attached. Nitrogen is more electronegative than "
            "carbon yet the amide is the least reactive derivative, because "
            "nitrogen's lone pair is tied up donating into the carbonyl and its "
            "anion is a terrible leaving group. Rank by leaving-group stability "
            "and resonance donation, not by a single atom's electronegativity."
        ),
        claims=(
            Formula(ACETYL_CHLORIDE, "C2H3ClO", "acetyl chloride"),
            Unsaturation(ACETYL_CHLORIDE, 1, "the carbonyl pi bond"),
            Formula(ACETIC_ANHYDRIDE, "C4H6O3", "acetic anhydride"),
            Unsaturation(ACETIC_ANHYDRIDE, 2, "two carbonyl pi bonds"),
            Environments(
                ACETIC_ANHYDRIDE, (6,),
                "the two acetyl groups are equivalent, so all six hydrogens are "
                "one environment",
            ),
            Formula(ETHYL_ACETATE, "C4H8O2", "ethyl acetate"),
            Unsaturation(ETHYL_ACETATE, 1, "the ester carbonyl"),
            Formula(ACETAMIDE, "C2H5NO", "acetamide"),
            Unsaturation(ACETAMIDE, 1, "the amide carbonyl"),
            Source(
                "The reactivity of carboxylic acid derivatives toward "
                "nucleophilic acyl substitution decreases in the order acid "
                "chloride, anhydride, ester, amide. The ordering is explained by "
                "leaving-group ability and by resonance donation from the atom "
                "bonded to the carbonyl, and is stated qualitatively; no rate "
                "constants are attached.",
                CLAYDEN,
            ),
            Source(
                "The order tracks the acidity of the conjugate acid of the "
                "leaving group: HCl is a strong acid so chloride leaves readily, "
                "a carboxylic acid is moderately acidic, an alcohol has a pKa "
                "near 16, and an amine near 35, so an amide nitrogen is the "
                "worst leaving group of the set. These pKa ranks are quoted, not "
                "derived.",
                CRC_PKA,
            ),
            Source(
                "The carbonyl stretch in the infrared rises as resonance "
                "donation falls: amides absorb lowest, near 1630 to 1690 cm-1, "
                "esters near 1735 to 1750 cm-1, anhydrides as a pair of bands "
                "near 1760 and 1820 cm-1, and acid chlorides highest, near 1790 "
                "to 1815 cm-1. These are ranges from a correlation chart.",
                SILVERSTEIN,
            ),
        ),
    ),
    "ORG2.ACYLSUB": Lesson(
        node="ORG2.ACYLSUB",
        objective=(
            "Draw nucleophilic acyl substitution as two steps, addition of the "
            "nucleophile to give a tetrahedral intermediate and elimination of "
            "the leaving group to restore the carbonyl, and say why this is not "
            "the one-step substitution you saw at saturated carbon."
        ),
        build_on=(
            "You have a reactivity ladder that says which derivative turns into "
            "which. This lesson is the mechanism underneath that ladder, the "
            "actual sequence of bond making and breaking that every "
            "interconversion in the unit follows."
        ),
        core_idea=(
            "At a saturated carbon a nucleophile displaces a leaving group in "
            "one concerted step, because carbon has no room to hold five bonds "
            "even briefly. A carbonyl carbon has a way out that saturated carbon "
            "does not: it can park the incoming electrons in the pi bond. So the "
            "nucleophile adds first, the pi electrons move onto oxygen, and the "
            "carbon becomes tetrahedral with the negative charge on oxygen. That "
            "tetrahedral intermediate is the heart of the mechanism. It then "
            "collapses: the oxygen lone pair pushes back down to reform the "
            "carbonyl pi bond, and this time it expels the leaving group rather "
            "than the nucleophile that arrived. Two separate steps, addition "
            "then elimination, with a real intermediate between them, which is "
            "why the whole family of reactions is called nucleophilic acyl "
            "substitution and behaves nothing like substitution at saturated "
            "carbon. Whether the intermediate goes forward or falls back to "
            "starting material is decided by which of the two groups on it is "
            "the better leaving group."
        ),
        worked_example=(
            "Follow methoxide converting acetyl chloride into methyl acetate. "
            "Acetyl chloride is C2H3ClO and has one degree of unsaturation, the "
            "carbonyl pi bond. Methoxide adds to the carbonyl carbon, the pi "
            "electrons move onto oxygen, and the tetrahedral intermediate that "
            "results is an alkoxide, C3H6ClO2 carrying a negative charge. That "
            "intermediate has no carbonyl at all: the carbon is now sp3 with a "
            "chlorine, an alkoxide oxygen, a methoxy oxygen and a methyl on it. "
            "It is a charged species, so degrees of unsaturation are not defined "
            "for it, which is why only its formula is claimed. The intermediate "
            "then expels chloride, the oxygen lone pair reforms the pi bond, and "
            "the product is methyl acetate, C3H6O2, one degree of unsaturation "
            "again. The carbonyl was there at the start, gone in the "
            "intermediate, and back in the product, and that appearance and "
            "reappearance is the signature of the addition-elimination route."
        ),
        try_it_prompt=(
            "In the tetrahedral intermediate from methoxide and acetyl chloride, "
            "the central carbon carries both a chloride and a methoxide as "
            "potential leaving groups. Which one leaves, and what would it mean "
            "for the reaction if the other left instead?"
        ),
        try_it_answer=(
            "Chloride leaves, because it is a far better leaving group than "
            "methoxide, and its departure gives the ester product. If methoxide "
            "left instead, the intermediate would fall back to acetyl "
            "chloride, undoing the addition. The intermediate is a fork: expel "
            "the group that arrived and nothing has happened, expel the original "
            "leaving group and the substitution is complete. Reactions run "
            "forward precisely when the original leaving group is the weaker "
            "base of the two."
        ),
        pitfall=(
            "The misconception carried in from earlier chemistry is that this is "
            "an SN2 reaction, a backside attack that displaces the leaving group "
            "in a single motion. Drawing it that way hides the intermediate, and "
            "the intermediate is what makes carbonyl substitution predictable. "
            "The reason a carbonyl can host a two-step mechanism while a "
            "saturated carbon cannot is the pi bond, which accepts the incoming "
            "electron pair and hands it back on cue. If you find yourself "
            "drawing one arrow from nucleophile to carbon and a second from "
            "carbon to leaving group at the same time, you have collapsed two "
            "steps into one and lost the tetrahedral intermediate that the rest "
            "of this unit depends on."
        ),
        claims=(
            Formula(ACETYL_CHLORIDE, "C2H3ClO", "acetyl chloride"),
            Unsaturation(ACETYL_CHLORIDE, 1, "the carbonyl before addition"),
            Formula(METHANOL, "CH4O", "the alcohol whose conjugate base is the nucleophile"),
            Formula(
                TETRAHEDRAL_INTERMEDIATE, "C3H6ClO2-",
                "anionic tetrahedral intermediate; charged, so its degrees of "
                "unsaturation are undefined and only the formula is claimed",
            ),
            Formula(METHYL_ACETATE, "C3H6O2", "methyl acetate"),
            Unsaturation(
                METHYL_ACETATE, 1,
                "the carbonyl is gone in the intermediate and back in the "
                "product",
            ),
            Source(
                "Substitution at a carbonyl carbon proceeds by addition to a "
                "tetrahedral intermediate followed by elimination of a leaving "
                "group, not by a concerted one-step displacement; the direction "
                "the intermediate collapses is governed by relative "
                "leaving-group ability.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.ACIDCHLORIDE": Lesson(
        node="ORG2.ACIDCHLORIDE",
        objective=(
            "Predict the product of an acid chloride or an anhydride with water, "
            "an alcohol, or an amine, and explain why these two derivatives sit "
            "at the reactive end of the ladder and are the usual starting points "
            "for making the others."
        ),
        build_on=(
            "The ladder told you the acid chloride is the most reactive "
            "derivative and the mechanism told you how any of them react. Put "
            "the two together and the acid chloride becomes a general acylating "
            "agent: it will hand its acyl group to almost any nucleophile."
        ),
        core_idea=(
            "An acid chloride reacts with a nucleophile by the addition-"
            "elimination route, and because chloride is an excellent leaving "
            "group the reaction is fast and goes to completion in one direction. "
            "Water gives the carboxylic acid, an alcohol gives the ester, and "
            "ammonia or an amine gives the amide. Each of these products is "
            "lower on the reactivity ladder than the acid chloride, which is the "
            "general rule restated: you make a derivative from anything above it. "
            "The anhydride sits one rung below the acid chloride and does the same "
            "chemistry a little more gently, expelling a carboxylate instead of "
            "a chloride; with water it gives two equivalents of the acid, and "
            "with an alcohol it gives one ester and one carboxylic acid. Because "
            "both reagents release a strong acid or an acid as they react, these "
            "acylations are usually run with a base present to mop it up, but the "
            "acyl-transfer step itself is the same nucleophilic acyl "
            "substitution throughout."
        ),
        worked_example=(
            "Take acetyl chloride, C2H3ClO, one degree of unsaturation, and run "
            "it against three nucleophiles. With water the product is acetic "
            "acid, C2H4O2: hydroxide-like oxygen adds, chloride leaves, and the "
            "carbonyl returns. With ethanol the product is ethyl acetate, "
            "C4H8O2, the ester. With ammonia the product is acetamide, C2H5NO, "
            "the amide, and note that the acid chloride reaches the amide in one "
            "step even though the amide is the least reactive derivative, "
            "because you are moving down the ladder from the top. Every product "
            "keeps the one degree of unsaturation of its carbonyl. The same "
            "pattern holds on an aromatic acyl group: benzoyl chloride, "
            "C7H5ClO, five degrees of unsaturation for the ring and the "
            "carbonyl, gives benzoic acid, C7H6O2, with water and benzamide, "
            "C7H7NO, with ammonia, each still at five degrees. Acetic anhydride, "
            "C4H6O3, two degrees of unsaturation for its two carbonyls, would "
            "give the same acetylated products, releasing acetic acid rather "
            "than hydrogen chloride as it goes."
        ),
        try_it_prompt=(
            "Benzoyl chloride is treated with methanol. Name the product, give "
            "its molecular formula, and say how many degrees of unsaturation it "
            "has compared with the benzoyl chloride you started from."
        ),
        try_it_answer=(
            "The product is methyl benzoate, C8H8O2. Methanol's oxygen adds to "
            "the carbonyl carbon, chloride is expelled, and the carbonyl "
            "reforms as an ester. Both benzoyl chloride and methyl benzoate have "
            "five degrees of unsaturation, four for the benzene ring and one for "
            "the carbonyl, because the substitution swaps chlorine for an "
            "alkoxy group and leaves every pi bond and the ring untouched."
        ),
        pitfall=(
            "The trap is thinking the acid chloride is too reactive to bother "
            "controlling, so any nucleophile around will attack it identically. "
            "It is reactive, but selectivity still matters: an amine is a better "
            "nucleophile than the alcohol or water it may be dissolved alongside, "
            "so it wins even when it is the minor component, which is why amides "
            "form cleanly from acid chlorides and amines despite moisture in the "
            "flask. The deeper belief to correct is that reactivity and "
            "selectivity are the same thing. The acid chloride reacts with "
            "everything, and which product you isolate is decided by which "
            "nucleophile is fastest, not by which derivative is most stable."
        ),
        claims=(
            Formula(ACETYL_CHLORIDE, "C2H3ClO", "acetyl chloride"),
            Unsaturation(ACETYL_CHLORIDE, 1),
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid, from water"),
            Unsaturation(ACETIC_ACID, 1),
            Formula(ETHYL_ACETATE, "C4H8O2", "ethyl acetate, from ethanol"),
            Formula(ACETAMIDE, "C2H5NO", "acetamide, from ammonia"),
            Formula(ACETIC_ANHYDRIDE, "C4H6O3", "acetic anhydride"),
            Unsaturation(ACETIC_ANHYDRIDE, 2, "two carbonyls"),
            Formula(BENZOYL_CHLORIDE, "C7H5ClO", "benzoyl chloride"),
            Unsaturation(BENZOYL_CHLORIDE, 5, "ring accounts for four, carbonyl for one"),
            Formula(BENZOIC_ACID, "C7H6O2", "benzoic acid"),
            Unsaturation(BENZOIC_ACID, 5),
            Formula(BENZAMIDE, "C7H7NO", "benzamide"),
            Unsaturation(BENZAMIDE, 5),
            Source(
                "Acid chlorides absorb in the infrared near 1790 to 1815 cm-1 "
                "and anhydrides show two carbonyl bands near 1760 and 1820 cm-1; "
                "these positions are ranges from a correlation chart, not values "
                "this repository can derive.",
                SILVERSTEIN,
            ),
        ),
    ),
    "ORG2.ESTERS": Lesson(
        node="ORG2.ESTERS",
        objective=(
            "Explain why Fischer esterification is an equilibrium you have to "
            "drive, and why saponification is not, by identifying what makes the "
            "final step of each reaction reversible or irreversible."
        ),
        build_on=(
            "You can make an ester from an acid chloride in one committed step. "
            "Making an ester directly from a carboxylic acid is different, "
            "because now both the forward and the reverse reaction are the same "
            "easy acyl substitution, and you have to think about equilibrium."
        ),
        core_idea=(
            "Fischer esterification joins a carboxylic acid and an alcohol into "
            "an ester and water, under acid catalysis. Every step is reversible: "
            "the acid protonates the carbonyl, the alcohol adds, a tetrahedral "
            "intermediate forms, water leaves, and each of those arrows runs "
            "both ways, so the reaction settles at an equilibrium rather than "
            "going to completion. To get a good yield you push the equilibrium "
            "with Le Chatelier, using excess alcohol or removing water as it "
            "forms. Ester hydrolysis under acid is the exact reverse, driven the "
            "other way with excess water. Saponification is the alternative that "
            "escapes the equilibrium entirely. Hydroxide adds to the ester "
            "carbonyl, the tetrahedral intermediate expels alkoxide, and the "
            "carboxylic acid that forms is immediately deprotonated by the base "
            "to a carboxylate. That last proton transfer is effectively "
            "irreversible: the carboxylate is stabilised and unreactive, and no "
            "alcohol will attack it, so the reaction cannot run backward. You "
            "consume one full equivalent of hydroxide to do it, which is why the "
            "base is a reagent here and not a catalyst."
        ),
        worked_example=(
            "Build ethyl acetate by Fischer esterification and then take it "
            "apart by saponification. Acetic acid, C2H4O2, and ethanol, C2H6O "
            "and no degrees of unsaturation, react under acid catalysis to give "
            "ethyl acetate, C4H8O2, and water. The ester shows three proton "
            "environments in the ratio 3:3:2, the two inequivalent methyls and "
            "the methylene, which is the fingerprint of an isolated ethyl group "
            "on the oxygen. Left alone this mixture is an equilibrium, so you "
            "would run it with an excess of ethanol to favour the ester. Now "
            "saponify the same ester. Add aqueous hydroxide: it adds to the "
            "carbonyl, ethoxide is expelled, and the acetic acid produced is "
            "deprotonated to acetate, formula C2H3O2 carrying a negative charge, "
            "with ethanol, C2H6O, released as the other product. The acetate is "
            "a charged species, so its degrees of unsaturation are not defined "
            "and only its formula is claimed. Because the acetate cannot be "
            "attacked by ethanol, this reaction does not come back to the ester, "
            "which is the practical difference from the Fischer route."
        ),
        try_it_prompt=(
            "You esterify a carboxylic acid with an alcohol under acid catalysis "
            "and stop at a disappointing yield. Give one change to the "
            "conditions that raises it, and explain why saponification would not "
            "have needed that trick."
        ),
        try_it_answer=(
            "Use a large excess of the alcohol, or remove the water as it forms; "
            "either shifts the Fischer equilibrium toward the ester by Le "
            "Chatelier. Saponification needs no such push because its final step "
            "deprotonates the acid to a carboxylate, which is stable and "
            "unreactive toward the alcohol, so the reaction is drawn to "
            "completion by that irreversible proton transfer rather than "
            "balanced at an equilibrium. The cost is that hydroxide is consumed "
            "in full, one equivalent per ester, so it is a reagent and not a "
            "catalyst."
        ),
        pitfall=(
            "The misconception is that saponification is faster than Fischer "
            "hydrolysis, and that speed is why it goes to completion. The reason "
            "is thermodynamic, not kinetic. Fischer esterification and its "
            "reverse are a genuine equilibrium because acid, alcohol, ester and "
            "water can all interconvert. Saponification removes one of the "
            "players from the game by turning the acid into a carboxylate that "
            "will not react, so there is no reverse reaction left to balance "
            "against. Reach for the deprotonation step when you explain why it "
            "cannot go backward, not for a claim about which reaction is "
            "quicker."
        ),
        claims=(
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid"),
            Unsaturation(ACETIC_ACID, 1, "the acid carbonyl"),
            Formula(ETHANOL, "C2H6O", "ethanol"),
            Unsaturation(ETHANOL, 0, "no pi bonds or rings"),
            Formula(ETHYL_ACETATE, "C4H8O2", "ethyl acetate"),
            Unsaturation(ETHYL_ACETATE, 1, "the ester carbonyl"),
            Environments(ETHYL_ACETATE, (3, 3, 2), "two inequivalent methyls and a methylene"),
            Formula(
                ACETATE, "C2H3O2-",
                "the carboxylate that makes saponification irreversible; "
                "charged, so degrees of unsaturation are undefined",
            ),
            Source(
                "Fischer esterification is acid-catalysed and reversible and is "
                "driven with excess reagent or water removal; base-promoted "
                "hydrolysis, saponification, is made irreversible by "
                "deprotonation of the carboxylic acid product to a carboxylate "
                "and consumes a full equivalent of hydroxide.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.AMIDES": Lesson(
        node="ORG2.AMIDES",
        objective=(
            "Explain why the amide is the least reactive derivative, describe "
            "how it is made and how it is hydrolysed, and show that forming the "
            "peptide bond leaves an amino acid's alpha stereocentre unchanged."
        ),
        build_on=(
            "The reactivity ladder put the amide at the bottom. This lesson is "
            "why it sits there, and why that stability is exactly what makes the "
            "amide the linkage that holds proteins together."
        ),
        core_idea=(
            "The amide is the least reactive derivative because nitrogen donates "
            "its lone pair into the carbonyl more strongly than oxygen does, "
            "which lowers the electrophilicity of the carbon and gives the C-N "
            "bond partial double-bond character. That donation is also why the "
            "amide nitrogen is a poor leaving group. So amides are made from "
            "something higher on the ladder, an acid chloride or an anhydride "
            "with an amine, rather than easily from the acid itself, and "
            "hydrolysing an amide back to the acid takes forcing conditions, "
            "strong acid or strong base and heat. The same stability makes the "
            "amide the backbone bond of peptides. A peptide bond is the amide "
            "that forms when the carboxyl of one amino acid joins the amino "
            "group of the next, losing water. Because the acyl substitution "
            "happens at the carboxyl carbon and never touches the alpha carbon, "
            "any stereocentre at that alpha position is carried through "
            "unchanged, which is why a protein made from L amino acids stays all "
            "L."
        ),
        worked_example=(
            "Start with the simplest amides and end at a stereocentre. Acetamide "
            "is C2H5NO with one degree of unsaturation and two proton "
            "environments in the ratio 3:2, the methyl and the two N-H "
            "hydrogens; putting a methyl on the nitrogen gives "
            "N-methylacetamide, C3H7NO. Now make a peptide bond. Glycine is the "
            "simplest amino acid, C2H5NO2; couple two glycines, joining the "
            "carboxyl of one to the amino group of the other with loss of water, "
            "and you get glycylglycine, C4H8N2O3, whose two degrees of "
            "unsaturation are its two carbonyls. Glycine has no stereocentre, so "
            "switch to alanine to see configuration survive. (S)-alanine, "
            "C3H7NO2, is the L amino acid, with its alpha carbon bearing an "
            "amino group, a methyl, a carboxyl and a hydrogen. Couple its "
            "carboxyl to glycine and you get alanylglycine, C5H10N2O3. The new "
            "bond formed at the carboxyl carbon, one bond away from the "
            "stereocentre, so the alpha carbon is still bonded to the same four "
            "kinds of group and its configuration is still S. The reaction built "
            "an amide and left the stereocentre exactly as it found it."
        ),
        try_it_prompt=(
            "You couple (S)-alanine through its carboxyl group to another amino "
            "acid, forming a peptide bond. Without working out the priorities "
            "again, state what happens to the configuration at alanine's alpha "
            "carbon and justify it from where the bonds change."
        ),
        try_it_answer=(
            "It stays S. Nucleophilic acyl substitution makes and breaks bonds "
            "at the carboxyl carbon, which is a separate carbon from the alpha "
            "stereocentre. None of alanine's four alpha-carbon bonds is broken, "
            "so the spatial arrangement there is preserved and the descriptor "
            "does not change. This is the structural reason peptide synthesis "
            "does not scramble configuration: the chemistry happens one carbon "
            "away from the centre that carries the stereochemistry."
        ),
        pitfall=(
            "A common worry is that any reaction at a molecule with a "
            "stereocentre risks racemising it, so a coupling step must be "
            "handled as though the configuration is fragile. The stereocentre is "
            "only at risk if a bond to it is broken, and ordinary peptide "
            "coupling breaks bonds at the carboxyl carbon, not at the alpha "
            "carbon. The belief to correct is that reactions act on molecules as "
            "wholes; they act at specific atoms, and a centre whose bonds are "
            "untouched keeps its configuration. Racemisation at the alpha carbon "
            "is a real side reaction in some coupling methods, but it happens "
            "through a separate pathway that does remove the alpha hydrogen, not "
            "through the acyl substitution itself."
        ),
        claims=(
            Formula(ACETAMIDE, "C2H5NO", "acetamide"),
            Unsaturation(ACETAMIDE, 1, "the amide carbonyl"),
            Environments(ACETAMIDE, (3, 2), "the methyl and the two N-H hydrogens"),
            Formula(N_METHYLACETAMIDE, "C3H7NO", "N-methylacetamide"),
            Unsaturation(N_METHYLACETAMIDE, 1),
            Formula(GLYCINE, "C2H5NO2", "glycine, the simplest amino acid"),
            Unsaturation(GLYCINE, 1),
            Formula(GLYCYLGLYCINE, "C4H8N2O3", "glycylglycine, one peptide bond"),
            Unsaturation(GLYCYLGLYCINE, 2, "two carbonyls"),
            Stereo(L_ALANINE, ("S",), "(S)-alanine, the L amino acid"),
            Formula(L_ALANINE, "C3H7NO2", "alanine"),
            Stereo(
                ALA_GLY, ("S",),
                "alanylglycine; the acyl substitution at the carboxyl leaves "
                "the alpha stereocentre S",
            ),
            Formula(ALA_GLY, "C5H10N2O3", "alanylglycine"),
            Source(
                "The amide is the least reactive acid derivative because of "
                "resonance donation from nitrogen into the carbonyl, which also "
                "gives the C-N bond partial double-bond character and hinders "
                "rotation; amide hydrolysis requires forcing acidic or basic "
                "conditions.",
                CLAYDEN,
            ),
            Source(
                "Amides absorb in the infrared near 1630 to 1690 cm-1 for the "
                "carbonyl stretch, lower than esters, with N-H stretches near "
                "3100 to 3500 cm-1; these are correlation-chart ranges.",
                SILVERSTEIN,
            ),
        ),
    ),
    "ORG2.DERIVATIVEREDUCTION": Lesson(
        node="ORG2.DERIVATIVEREDUCTION",
        objective=(
            "Choose a hydride reagent that takes an acid derivative to the "
            "alcohol or amine, or stops it at the aldehyde, and explain the stop "
            "at the aldehyde in terms of the tetrahedral intermediate."
        ),
        build_on=(
            "Every reaction so far replaced the leaving group with another "
            "heteroatom nucleophile. A hydride reagent delivers hydrogen as the "
            "nucleophile instead, and the same addition-elimination framework "
            "now tells you whether the reaction stops halfway or goes all the "
            "way down."
        ),
        core_idea=(
            "A hydride adds to the carbonyl and a tetrahedral intermediate "
            "forms, exactly as before. What happens next depends on the reagent "
            "and on the derivative. Lithium aluminium hydride is strong and "
            "reduces an ester all the way to a primary alcohol, because the "
            "aldehyde produced when the first leaving group departs is itself "
            "reduced faster than it can be isolated. An amide reduced by lithium "
            "aluminium hydride goes to the amine: the nitrogen stays and the "
            "carbonyl oxygen is removed entirely, rather than a leaving group "
            "departing. To stop an ester at the aldehyde you use "
            "diisobutylaluminium hydride at low temperature, which delivers one "
            "hydride and then leaves the tetrahedral intermediate standing until "
            "workup, so the aldehyde is only released at the end and is never "
            "exposed to more reducing agent. Sodium borohydride is milder and "
            "generally leaves esters and amides alone, which is what lets you "
            "reduce a ketone or aldehyde in a molecule that also contains an "
            "ester. The choice of reagent is therefore a choice of where on the "
            "path from derivative to alcohol you want the reaction to stop."
        ),
        worked_example=(
            "Reduce methyl benzoate two ways and watch the degrees of "
            "unsaturation. Methyl benzoate is C8H8O2 with five degrees of "
            "unsaturation, four for the ring and one for the ester carbonyl. "
            "Lithium aluminium hydride takes it to benzyl alcohol, C7H8O, and "
            "methanol, CH4O; benzyl alcohol has four degrees of unsaturation, "
            "the ring alone, because the carbonyl pi bond is gone. "
            "Diisobutylaluminium hydride at low temperature stops instead at "
            "benzaldehyde, C7H6O, which keeps five degrees of unsaturation "
            "because it still has a carbonyl, now an aldehyde rather than an "
            "ester. The count reports the outcome directly: full reduction to "
            "the alcohol spends the carbonyl and drops from five to four, while "
            "stopping at the aldehyde holds at five. Amide reduction looks "
            "different again: acetamide, C2H5NO, goes to ethylamine, C2H7N, "
            "which has zero degrees of unsaturation, because reducing an amide "
            "removes the carbonyl oxygen and keeps the nitrogen. And an acid "
            "chloride can be brought to the aldehyde with a hindered hydride, "
            "acetyl chloride, C2H3ClO, giving acetaldehyde, C2H4O."
        ),
        try_it_prompt=(
            "A molecule contains both an ester and a separate ketone, and you "
            "want to reduce only the ketone to an alcohol. Which of lithium "
            "aluminium hydride and sodium borohydride do you choose, and what "
            "would the other one do wrong?"
        ),
        try_it_answer=(
            "Choose sodium borohydride. It reduces the ketone to an alcohol and "
            "generally leaves the ester untouched, so the ester survives. "
            "Lithium aluminium hydride is strong enough to reduce the ester as "
            "well, taking it to a primary alcohol, so you would lose the ester "
            "you meant to keep. The point is that selectivity comes from "
            "matching the strength of the hydride to the least reactive group "
            "you are willing to touch."
        ),
        pitfall=(
            "The tempting shortcut is to think an aldehyde is easy to isolate "
            "from ester reduction because it is an obvious halfway point. With "
            "lithium aluminium hydride it is not isolable, because the aldehyde "
            "is more reactive toward hydride than the ester was, so the moment "
            "any aldehyde appears it is reduced again. Stopping at the aldehyde "
            "is not a matter of adding one equivalent and hoping; it requires a "
            "reagent, diisobutylaluminium hydride at low temperature, that holds "
            "the tetrahedral intermediate together until workup so the aldehyde "
            "is only unmasked when no reductant is left. The belief to fix is "
            "that intermediates on a reaction path are automatically "
            "collectable; they are collectable only when they are less reactive "
            "than the starting material, and here the aldehyde is more reactive."
        ),
        claims=(
            Formula(METHYL_BENZOATE, "C8H8O2", "methyl benzoate"),
            Unsaturation(METHYL_BENZOATE, 5, "ring accounts for four, ester carbonyl for one"),
            Formula(BENZYL_ALCOHOL, "C7H8O", "benzyl alcohol, full reduction"),
            Unsaturation(BENZYL_ALCOHOL, 4, "ring only; the carbonyl pi bond is gone"),
            Formula(BENZALDEHYDE, "C7H6O", "benzaldehyde, stopped by DIBAL-H"),
            Unsaturation(BENZALDEHYDE, 5, "ring plus the aldehyde carbonyl"),
            Formula(METHANOL, "CH4O", "the alcohol released from the ester oxygen"),
            Formula(ACETAMIDE, "C2H5NO", "acetamide"),
            Unsaturation(ACETAMIDE, 1),
            Formula(ETHYLAMINE, "C2H7N", "ethylamine, from amide reduction"),
            Unsaturation(ETHYLAMINE, 0, "the carbonyl oxygen is removed, nitrogen kept"),
            Formula(ACETYL_CHLORIDE, "C2H3ClO", "acetyl chloride"),
            Formula(ACETALDEHYDE, "C2H4O", "acetaldehyde, from a hindered-hydride reduction"),
            Unsaturation(ACETALDEHYDE, 1),
            Source(
                "Lithium aluminium hydride reduces esters to primary alcohols "
                "and amides to amines; diisobutylaluminium hydride at low "
                "temperature stops ester reduction at the aldehyde by leaving "
                "the tetrahedral intermediate intact until workup; sodium "
                "borohydride is too mild to reduce esters and amides under "
                "ordinary conditions.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.DERIVATIVEORGANOMETALLIC": Lesson(
        node="ORG2.DERIVATIVEORGANOMETALLIC",
        objective=(
            "Explain why a Grignard reagent adds twice to an ester to give a "
            "tertiary alcohol with two identical new groups, and why an acid "
            "chloride can be stopped after one addition to give a ketone."
        ),
        build_on=(
            "Hydride reduction let a nucleophile that cannot leave, hydrogen, "
            "add at a carbonyl. A carbon nucleophile from an organometallic "
            "reagent does the same thing and builds carbon-carbon bonds, and the "
            "same question decides the outcome: does the first product get "
            "attacked again?"
        ),
        core_idea=(
            "A Grignard reagent is a carbon nucleophile. Add it to an ester and "
            "it goes through the addition-elimination sequence: the carbanion "
            "adds, the tetrahedral intermediate expels the alkoxy leaving group, "
            "and a ketone is produced. But the ketone is more electrophilic than "
            "the ester it came from, so a second equivalent of the Grignard adds "
            "to it at once, and this time there is no leaving group to expel, so "
            "the reaction stops at the tetrahedral alkoxide, which becomes a "
            "tertiary alcohol on workup. Two of the three groups on that "
            "alcohol's carbon came from the Grignard, so they are identical: an "
            "ester plus two equivalents of the same Grignard always gives a "
            "tertiary alcohol bearing two copies of the organometallic's group. "
            "An acid chloride can instead be stopped cleanly at the ketone if "
            "you use a milder carbon nucleophile, a lithium dialkylcuprate, "
            "which adds once and does not go on to attack the ketone. The whole "
            "difference between one addition and two is whether the first "
            "product is more reactive than the starting material, which for an "
            "ester it is."
        ),
        worked_example=(
            "Treat methyl acetate, C3H6O2 with one degree of unsaturation, with "
            "two equivalents of methylmagnesium bromide. The first methyl adds "
            "to the carbonyl carbon, methoxide is expelled, and the intermediate "
            "ketone is acetone, C3H6O, still one degree of unsaturation and all "
            "six of its hydrogens equivalent. Acetone is more electrophilic than "
            "methyl acetate, so the second methyl adds to it, and with no "
            "leaving group available the reaction halts at the alkoxide. Workup "
            "gives 2-methylpropan-2-ol, tert-butanol, C4H10O, zero degrees of "
            "unsaturation because no carbonyl remains. Look at its symmetry: all "
            "three methyl groups are equivalent, so it shows two proton "
            "environments in the ratio 9:1, nine methyl hydrogens and one "
            "hydroxyl hydrogen. Two of those three methyls are the ones the "
            "Grignard delivered, which is the visible consequence of adding "
            "twice. To stop at the ketone instead, start from acetyl chloride, "
            "C2H3ClO, and use a dimethylcuprate, which adds a single methyl and "
            "gives acetone, C3H6O, without a second addition."
        ),
        try_it_prompt=(
            "You react an ester with two equivalents of ethylmagnesium bromide. "
            "Before drawing anything, state what class of alcohol you will get "
            "and what must be true about two of the groups on the new "
            "carbinol carbon."
        ),
        try_it_answer=(
            "You will get a tertiary alcohol, and two of the three carbon groups "
            "on the carbinol carbon must be identical ethyl groups. The Grignard "
            "adds once to give a ketone, then a second time because the ketone "
            "is more electrophilic than the ester, and both additions deliver "
            "the same ethyl group. The alkoxy part of the ester leaves as an "
            "alkoxide in the first step and is not part of the product, so the "
            "product's structure depends on the acyl group and the Grignard, not "
            "on which alcohol the ester was made from."
        ),
        pitfall=(
            "The misconception is that a Grignard adds once to an ester the way "
            "a hydride can be made to, giving a ketone or an aldehyde you can "
            "keep. It cannot be stopped there, because the ketone formed is more "
            "electrophilic than the ester, so it is consumed by the second "
            "equivalent before you can isolate it. The belief underneath is that "
            "you control the number of additions by counting equivalents; what "
            "actually controls it is the relative reactivity of the first "
            "product. When that product is more reactive than the starting "
            "material, as the ketone from an ester is, the reaction runs on to "
            "the tertiary alcohol regardless. Stopping at the ketone requires a "
            "different starting material, the acid chloride, and a gentler "
            "reagent, the cuprate."
        ),
        claims=(
            Formula(METHYL_ACETATE, "C3H6O2", "methyl acetate"),
            Unsaturation(METHYL_ACETATE, 1, "the ester carbonyl"),
            Formula(ACETONE, "C3H6O", "acetone, the ketone intermediate"),
            Unsaturation(ACETONE, 1, "still one carbonyl"),
            Environments(ACETONE, (6,), "two equivalent methyls, all six hydrogens one environment"),
            Formula(TERT_BUTANOL, "C4H10O", "2-methylpropan-2-ol, the tertiary alcohol"),
            Unsaturation(TERT_BUTANOL, 0, "no carbonyl remains"),
            Environments(
                TERT_BUTANOL, (9, 1),
                "three equivalent methyls and the hydroxyl hydrogen; two of the "
                "methyls came from the Grignard",
            ),
            Formula(ACETYL_CHLORIDE, "C2H3ClO", "acetyl chloride"),
            Source(
                "A Grignard reagent adds twice to an ester, giving a tertiary "
                "alcohol, because the ketone intermediate is more electrophilic "
                "than the ester; a lithium dialkylcuprate adds once to an acid "
                "chloride and can be stopped at the ketone.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.POLYMERS": Lesson(
        node="ORG2.POLYMERS",
        objective=(
            "Show that polyesters and polyamides are made by the same "
            "nucleophilic acyl substitution repeated many times, and explain why "
            "step-growth polymerisation needs monomers with two reactive ends "
            "and high conversion to give long chains."
        ),
        build_on=(
            "You now know esterification and amide formation as single "
            "reactions. A polymer is those single reactions run over and over "
            "on monomers built so that each new bond leaves another reactive end "
            "free to react again."
        ),
        core_idea=(
            "A step-growth polymer forms when each monomer carries two "
            "functional groups, so that every acyl substitution that links two "
            "monomers still leaves a reactive group at each end for the next "
            "link. A diacid, or a diacid chloride, reacting with a diol gives a "
            "polyester joined by ester bonds; the same diacid reacting with a "
            "diamine gives a polyamide joined by amide bonds. Each individual "
            "bond is the ordinary reaction you already know, an alcohol or an "
            "amine adding to a carbonyl and a leaving group departing, and the "
            "small molecule lost at each step, water in a direct condensation, "
            "is why these are called condensation polymers. The mechanism sets a "
            "practical demand that is worth stating: because the chain grows one "
            "bond at a time from both ends, the average chain length depends "
            "steeply on how completely the reaction runs. A conversion of 90 "
            "percent leaves chains that are still short on average, and only "
            "conversions very close to complete give the long chains a useful "
            "material needs, which is why stoichiometry and purity matter more "
            "in step-growth polymerisation than in most single reactions."
        ),
        worked_example=(
            "Compare a polyester and a polyamide built from the same kind of "
            "chemistry. For the polyester take ethylene glycol, C2H6O2 with two "
            "hydroxyl ends and no degrees of unsaturation, and terephthalic "
            "acid, C8H6O4, whose six degrees of unsaturation are the benzene "
            "ring and its two carbonyls. Each hydroxyl of the diol attacks a "
            "carbonyl of the diacid and water leaves, building an ester bond, "
            "and because both monomers are difunctional the growing chain always "
            "has an alcohol at one end and an acid at the other to continue. "
            "That is poly(ethylene terephthalate). For the polyamide take "
            "hexane-1,6-diamine, C6H16N2, and adipic acid, C6H10O4 with two "
            "degrees of unsaturation for its two carbonyls; each amine attacks a "
            "carbonyl and water leaves, building an amide bond, and the chain is "
            "nylon-6,6. The proton environments echo the symmetry of the "
            "monomers: terephthalic acid gives two environments in the ratio "
            "4:2, its four equivalent ring hydrogens and its two acid hydrogens, "
            "and adipic acid gives three in the ratio 4:4:2. Nothing in either "
            "polymerisation is new chemistry; it is acyl substitution made to "
            "repeat by giving every monomer two hands."
        ),
        try_it_prompt=(
            "You mix a diacid with a compound that has only one alcohol group "
            "instead of two. Explain why you get no polymer, using what the "
            "step-growth mechanism requires of a monomer."
        ),
        try_it_answer=(
            "A monomer with only one reactive end can form a single ester bond "
            "and then has nothing left to continue the chain, so it caps the "
            "growing end rather than extending it. Step-growth polymerisation "
            "needs every monomer to be at least difunctional, so that each new "
            "acyl substitution consumes one reactive group but leaves another "
            "free at the new end. A one-ended alcohol acts as a chain "
            "terminator, and adding enough of it is in fact how chain length is "
            "deliberately limited."
        ),
        pitfall=(
            "The error is assuming that mixing the monomers and reaching a high "
            "conversion, say 95 percent, is enough to get a strong polymer, "
            "because 95 percent sounds like most of the reaction. In step-growth "
            "polymerisation the average chain length rises steeply only as "
            "conversion approaches 100 percent, so 95 percent gives chains that "
            "are still far too short to be useful, and an imbalance in the "
            "amounts of the two monomers caps chains early for the same reason a "
            "one-ended monomer does. The belief to correct is that near-complete "
            "is close enough. Here the last few percent of conversion, and exact "
            "stoichiometry between the two difunctional monomers, are what turn "
            "short chains into a material."
        ),
        claims=(
            Formula(ETHYLENE_GLYCOL, "C2H6O2", "ethylene glycol, the diol"),
            Unsaturation(ETHYLENE_GLYCOL, 0, "two hydroxyls, no pi bonds or rings"),
            Environments(ETHYLENE_GLYCOL, (4, 2), "four methylene hydrogens and two hydroxyls"),
            Formula(TEREPHTHALIC_ACID, "C8H6O4", "terephthalic acid, the diacid"),
            Unsaturation(TEREPHTHALIC_ACID, 6, "the ring accounts for four, the two carbonyls for two"),
            Environments(
                TEREPHTHALIC_ACID, (4, 2),
                "four equivalent ring hydrogens and two acid hydrogens",
            ),
            Formula(HEXANEDIAMINE, "C6H16N2", "hexane-1,6-diamine, the diamine"),
            Unsaturation(HEXANEDIAMINE, 0),
            Formula(ADIPIC_ACID, "C6H10O4", "adipic acid, the diacid for nylon-6,6"),
            Unsaturation(ADIPIC_ACID, 2, "two carbonyls"),
            Environments(ADIPIC_ACID, (4, 4, 2), "two pairs of equivalent methylenes and the two acid hydrogens"),
            Source(
                "Polyesters and polyamides form by step-growth polymerisation, "
                "in which difunctional monomers link by the same nucleophilic "
                "acyl substitution as their small-molecule analogues; the "
                "number-average degree of polymerisation depends steeply on "
                "fractional conversion and on stoichiometric balance, following "
                "the Carothers treatment.",
                CLAYDEN_POLYMERS,
            ),
        ),
    ),
}

"""ORG2 Unit 8: Enols, Enolates and Condensations (chapters 22 to 23).

This is the reactivity of the carbon next to a carbonyl. Every reaction in the
unit runs through an enol or an enolate, and the facts that can be re-derived
from structure are checked by RDKit when the test suite runs, so a wrong
formula, a wrong stereo descriptor, or a mislabelled tautomer relationship
fails the build rather than reaching a learner.

Three lines are worth stating before the lessons rely on them, because they are
where this unit is most likely to go wrong.

  Keto and enol are constitutional isomers, not resonance forms. A proton moves
  from carbon to oxygen and a double bond moves with it, which changes
  connectivity, so every keto/enol pair here carries a Relationship claim that
  the checker confirms is constitutional before the prose says so.

  Enolates are charged. A degree-of-unsaturation count is defined for neutral
  species, and the verifier refuses it for an ion, so every enolate here is
  pinned by a Formula, for example C3H5O- for the propan-2-one enolate, and
  never by an Unsaturation.

  The reactions conserve or lose atoms in fixed ways. An aldol addition and a
  Michael addition combine two partners and lose nothing, so the product
  formula is their sum. An aldol or Claisen condensation loses one molecule of
  water. A Claisen expels an alkoxide, recovered as an alcohol on workup. Each
  of those is enforced by a Formula claim and was checked by formula arithmetic
  during authoring.

Numbers this repository cannot derive, chiefly alpha-carbon pKa values and
whether a transformation proceeds under stated conditions, are carried as a
Source with a real citation and a stated medium, or are taught as an ordering
rather than a value. They are never invented.
"""

from __future__ import annotations

from app.data.claims import (
    Environments,
    Formula,
    Relationship,
    Source,
    Stereo,
    Unsaturation,
)
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once so a claim and its prose cannot drift apart. Every
# SMILES below was passed through chem_core during authoring: formulas from
# formula_of, descriptors read back from RDKit rather than reasoned by hand,
# and each keto/enol pair confirmed constitutional by the Relationship checker.
# ---------------------------------------------------------------------------

# Tautomerism
ACETONE = "CC(C)=O"
PROPEN_2_OL = "CC(=C)O"            # the enol of propan-2-one, prop-1-en-2-ol
PENTANEDIONE = "CC(=O)CC(C)=O"     # pentane-2,4-dione, keto form
PENTANEDIONE_ENOL = "CC(=O)C=C(C)O"

# Enolates and stabilised acids
ACETONE_ENOLATE = "C=C(C)[O-]"     # charged, so Formula not Unsaturation
BUTAN_2_ONE = "CCC(C)=O"           # two different alpha sites
DIETHYL_MALONATE = "CCOC(=O)CC(=O)OCC"
ETHYL_ACETOACETATE = "CCOC(=O)CC(C)=O"

# Alpha halogenation
ACETOPHENONE = "CC(=O)c1ccccc1"
PHENACYL_BROMIDE = "O=C(CBr)c1ccccc1"
IODOFORM = "C(I)(I)I"
BENZOATE = "[O-]C(=O)c1ccccc1"     # the carboxylate, charged

# Malonic ester synthesis
DIETHYL_ETHYLMALONATE = "CCC(C(=O)OCC)C(=O)OCC"
ETHYLMALONIC_ACID = "CCC(C(=O)O)C(=O)O"
BUTANOIC_ACID = "CCCC(=O)O"

# Acetoacetic ester synthesis
ETHYL_2_ETHYLACETOACETATE = "CCC(C(C)=O)C(=O)OCC"
PENTAN_2_ONE = "CCCC(C)=O"

# Aldol
ACETALDEHYDE = "CC=O"
HYDROXYBUTANAL_R = "C[C@@H](O)CC=O"  # 3-hydroxybutanal, one stereocentre
HYDROXYBUTANAL_S = "C[C@H](O)CC=O"
CROTONALDEHYDE = "CC=CC=O"           # but-2-enal, the condensation product
PROPANAL = "CCC=O"
# 3-hydroxy-2-methylpentanal: two adjacent stereocentres, four stereoisomers.
# Descriptors are in RDKit atom-index order (hydroxyl carbon first).
HMPA_SS = "CC[C@H](O)[C@H](C)C=O"
HMPA_RR = "CC[C@@H](O)[C@@H](C)C=O"
HMPA_SR = "CC[C@H](O)[C@@H](C)C=O"

# Crossed and intramolecular aldol
BENZALDEHYDE = "O=Cc1ccccc1"
HYDROXYPHENYLBUTANONE = "CC(=O)CC(O)c1ccccc1"  # 4-hydroxy-4-phenylbutan-2-one
BENZALACETONE = "CC(=O)/C=C/c1ccccc1"          # 4-phenylbut-3-en-2-one
ADIPALDEHYDE = "O=CCCCCC=O"                     # hexanedial
CYCLOPENTENECARBALDEHYDE = "O=CC1=CCCC1"        # cyclopent-1-ene-1-carbaldehyde

# Claisen and Dieckmann
ETHYL_ACETATE = "CCOC(C)=O"
ETHANOL = "CCO"
DIETHYL_ADIPATE = "CCOC(=O)CCCCC(=O)OCC"        # diethyl hexanedioate
ETHYL_OXOCYCLOPENTANECARBOXYLATE = "CCOC(=O)C1CCCC1=O"

# Michael and Robinson
MVK = "C=CC(C)=O"                               # but-3-en-2-one, methyl vinyl ketone
MICHAEL_ADDUCT = "CCOC(=O)C(CCC(C)=O)C(=O)OCC"  # diethyl 2-(3-oxobutyl)malonate
CYCLOHEXANONE = "O=C1CCCCC1"
CYCLOHEXANONE_ADDUCT = "O=C1CCCCC1CCC(C)=O"     # 2-(3-oxobutyl)cyclohexanone
OCTALONE = "O=C1C=C2CCCCC2CC1"                  # the conjugated Robinson enone

# ---------------------------------------------------------------------------
# Citations. Numbers this repository cannot derive point at one of these.
# ---------------------------------------------------------------------------

CLAYDEN = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, Oxford "
    "University Press 2012, chapters on enols and enolates and on carbonyl "
    "condensation reactions."
)
CAREY = (
    "Carey and Sundberg, Advanced Organic Chemistry, 5th edition, Part A, "
    "Springer 2007, chapter on enols and enolate ions."
)
BORDWELL = (
    "Bordwell equilibrium acidity tables in dimethyl sulfoxide; F. G. "
    "Bordwell, Accounts of Chemical Research 1988, volume 21, pages 456 to 463."
)

LESSONS_ORG2_U8 = {
    "ORG2.TAUTOMERISM": Lesson(
        node="ORG2.TAUTOMERISM",
        objective=(
            "Identify the alpha hydrogens of a carbonyl compound, draw its enol "
            "tautomer, and decide whether the keto or the enol form dominates "
            "the equilibrium."
        ),
        build_on=(
            "You know a carbonyl carbon is electrophilic. This unit turns to the "
            "carbon next to it, the alpha carbon, whose hydrogens are weakly "
            "acidic and whose reactivity drives every reaction in the chapter."
        ),
        core_idea=(
            "A carbonyl compound with a hydrogen on its alpha carbon sits in "
            "equilibrium with a constitutional isomer called the enol, in which "
            "that hydrogen has moved to the oxygen and the carbon to oxygen "
            "double bond has become a carbon to oxygen single bond with a new "
            "carbon to carbon double bond alongside it. Keto and enol are not "
            "resonance structures of one molecule. They are two different "
            "molecules with the same formula and different connectivity, "
            "interconverting by moving a whole hydrogen atom along with a pair "
            "of electrons, and either an acid or a base can catalyse the "
            "interconversion. For an ordinary aldehyde or ketone the "
            "equilibrium sits far toward the keto form, because a carbon to "
            "oxygen double bond is stronger than the carbon to carbon double "
            "bond plus oxygen to hydrogen bond that replace it. A 1,3-dicarbonyl "
            "is the loud exception: its enol is held down by conjugation with "
            "the second carbonyl and by an internal hydrogen bond, so a "
            "compound like pentane-2,4-dione carries a large enol population at "
            "equilibrium."
        ),
        worked_example=(
            "Take pentane-2,4-dione, CH3COCH2COCH3, formula C5H8O2. The central "
            "CH2 lies between two carbonyls, so each of its hydrogens is an "
            "alpha hydrogen to both of them. Move one to the oxygen of the left "
            "carbonyl and shift the electrons: that carbonyl becomes a carbon "
            "bearing a hydroxyl, and a new carbon to carbon double bond appears "
            "beside it, giving CH3C(OH)=CHCOCH3, still C5H8O2 but with the "
            "hydrogen now on oxygen and a double bond between two carbons. The "
            "two are constitutional isomers rather than one compound: they share "
            "a formula but connect their atoms differently, and the checker "
            "agrees. This enol is unusually favourable, because the remaining "
            "carbonyl conjugates with the new carbon to carbon double bond and "
            "the enol hydroxyl hydrogen bonds across a six-membered ring to that "
            "carbonyl oxygen, which is why pentane-2,4-dione sits with a large "
            "enol fraction where propan-2-one shows almost none."
        ),
        try_it_prompt=(
            "Propan-2-one is CH3COCH3. Draw its enol, give the molecular formula "
            "of each tautomer, and state the relationship between them."
        ),
        try_it_answer=(
            "The enol is CH2=C(OH)CH3, prop-1-en-2-ol. Both tautomers are C3H6O. "
            "They are constitutional isomers: same formula, different "
            "connectivity, since the keto form holds all six hydrogens on carbon "
            "with the double bond to oxygen, while the enol has a carbon to "
            "carbon double bond, a hydroxyl, and one hydrogen on oxygen. "
            "Propan-2-one sits almost entirely as the keto form, because it has "
            "no second carbonyl to stabilise the enol."
        ),
        pitfall=(
            "The error that costs the most later is treating keto and enol as "
            "resonance forms of one species. Resonance moves only electrons and "
            "gives one molecule drawn several ways; tautomerism moves a whole "
            "hydrogen atom and gives two different molecules a spectrometer can "
            "count apart. Draw the curved arrows and notice that a sigma bond to "
            "hydrogen breaks and another forms, which no resonance arrow is "
            "permitted to do."
        ),
        claims=(
            Formula(ACETONE, "C3H6O", "propan-2-one, keto form"),
            Formula(PROPEN_2_OL, "C3H6O", "prop-1-en-2-ol, its enol"),
            Relationship(
                ACETONE, PROPEN_2_OL, "constitutional",
                "keto and enol share a formula but differ in connectivity",
            ),
            Formula(PENTANEDIONE, "C5H8O2", "pentane-2,4-dione, keto form"),
            Formula(PENTANEDIONE_ENOL, "C5H8O2", "its enol"),
            Relationship(
                PENTANEDIONE, PENTANEDIONE_ENOL, "constitutional",
                "verified constitutional isomers, not resonance forms",
            ),
            Environments(
                PENTANEDIONE, (6, 2),
                "two equivalent methyls and the central methylene, the alpha "
                "hydrogens that enolise",
            ),
            Source(
                "In nonpolar media pentane-2,4-dione contains a large fraction "
                "of its enol tautomer, of the order of 80 percent, while "
                "propan-2-one contains a negligible fraction; the exact figure "
                "depends on solvent and temperature and is not derivable here.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.ENOLATE": Lesson(
        node="ORG2.ENOLATE",
        objective=(
            "Explain why an alpha hydrogen is removable by base, write the "
            "enolate anion that results, rank the acidity of a simple ketone "
            "against a 1,3-dicarbonyl, and say what decides which enolate forms "
            "when two alpha positions compete."
        ),
        build_on=(
            "The enol was a neutral tautomer. Its conjugate base, made by "
            "removing an alpha hydrogen with base rather than shuffling it to "
            "oxygen, is the enolate, and it is the nucleophile behind the rest "
            "of this unit."
        ),
        core_idea=(
            "Removing an alpha hydrogen with base gives an anion, the enolate, "
            "whose negative charge is delocalised across the alpha carbon and "
            "the carbonyl oxygen. That delocalisation is the whole account of "
            "alpha acidity: the electrons left behind are stabilised by the "
            "adjacent carbonyl, so an alpha carbon to hydrogen bond is far more "
            "acidic than an ordinary one even though both are bonds to carbon. "
            "Because the enolate carries a charge, a degree of unsaturation "
            "count does not apply, and its identity is pinned by its formula "
            "instead, which the verifier accepts where it refuses an "
            "unsaturation count for any ion. A simple aldehyde or ketone has an "
            "alpha pKa near 17 to 20 in water, so hydroxide sets up only a small "
            "equilibrium concentration of enolate and a stronger, "
            "non-nucleophilic base is used when the enolate is needed in full. A "
            "1,3-dicarbonyl changes the arithmetic: with two carbonyls flanking "
            "one carbon, the enolate spreads its charge over two oxygens, and "
            "the alpha pKa falls to roughly 9 to 13, low enough that an alkoxide "
            "deprotonates it completely. A last question arises when a ketone "
            "has two different alpha positions: which one loses its hydrogen. A "
            "bulky, strong base that acts fast and does not reverse tends to "
            "take the less hindered alpha hydrogen and give the less "
            "substituted, kinetic enolate, while conditions that let the two "
            "enolates equilibrate favour the more substituted, more stable "
            "thermodynamic enolate."
        ),
        worked_example=(
            "Take propan-2-one and remove one hydrogen from a methyl with base. "
            "The pair of electrons from the broken bond does not stay on the "
            "alpha carbon: it delocalises into the carbonyl, so the honest "
            "picture is a hybrid with charge shared between the alpha carbon and "
            "the oxygen. The species is CH2=C(CH3)O-, formula C3H5O-, an ion, so "
            "we record its formula and not a degree of unsaturation, which the "
            "checker declines for a charged species. Now compare "
            "pentane-2,4-dione: its central hydrogen sits between two carbonyls, "
            "and the enolate from removing it spreads its charge over both, "
            "which is the structural reason the 1,3-dicarbonyl is several pKa "
            "units more acidic and the reason its enolate is the easy one to "
            "make in quantity. Regioselectivity comes alive in butan-2-one, "
            "C4H8O: its hydrogens fall into three environments in a 3 to 3 to 2 "
            "ratio, and two of those sets are alpha, the methyl on the carbonyl "
            "and the central methylene, so it can form two different enolates "
            "and the base chosen decides which."
        ),
        try_it_prompt=(
            "Diethyl malonate and propan-2-one both have alpha hydrogens. Which "
            "is more acidic at the alpha position, and what structural feature "
            "decides it?"
        ),
        try_it_answer=(
            "Diethyl malonate is more acidic. Its acidic hydrogens sit on the "
            "carbon between two ester carbonyls, so its enolate spreads the "
            "negative charge over both, while propan-2-one's enolate has one "
            "carbonyl to lean on. Approximate aqueous pKa values put the malonic "
            "ester near 13 and propan-2-one near 19 to 20, a difference of many "
            "powers of ten that comes from the second carbonyl rather than from "
            "the kind of atom that carries the hydrogen."
        ),
        pitfall=(
            "The trap is reading a large acidity as though the alpha carbon were "
            "an acidic site on oxygen. The alpha bond is still a carbon to "
            "hydrogen bond and a feeble acid by the standard of a carboxylic "
            "acid; what makes it removable at all is the carbonyl next door "
            "catching the electrons. Miss that and you expect hydroxide to make "
            "an acetone enolate quantitatively, when it establishes only a small "
            "equilibrium amount and a stronger base is needed for full "
            "conversion."
        ),
        claims=(
            Formula(
                ACETONE_ENOLATE, "C3H5O-",
                "the propan-2-one enolate, charged, so a formula and not an "
                "unsaturation count",
            ),
            Formula(ACETONE, "C3H6O", "the neutral ketone it comes from"),
            Formula(BUTAN_2_ONE, "C4H8O", "a ketone with two competing alpha sites"),
            Environments(
                BUTAN_2_ONE, (3, 3, 2),
                "three environments; the acyl methyl and the methylene are the "
                "two alpha sites, the far methyl is beta",
            ),
            Formula(DIETHYL_MALONATE, "C7H12O4", "diethyl malonate"),
            Formula(PENTANEDIONE, "C5H8O2", "pentane-2,4-dione"),
            Source(
                "Approximate aqueous pKa values for alpha carbon to hydrogen "
                "acidity: a simple aldehyde or ketone near 17 to 20; an ester "
                "near 25; a 1,3-diketone such as pentane-2,4-dione near 9; a "
                "beta-ketoester such as ethyl acetoacetate near 11; a malonic "
                "ester near 13. These are approximate values quoted for "
                "ordering, not analytical figures.",
                CLAYDEN,
            ),
            Source(
                "The dimethyl sulfoxide referenced Bordwell scale gives larger "
                "absolute pKa values than the aqueous figures above, for "
                "example about 26 for propan-2-one, but preserves the same "
                "ordering of ketone above beta-ketoester above 1,3-diketone.",
                BORDWELL,
            ),
            Source(
                "A hindered, strong, non-nucleophilic base such as lithium "
                "diisopropylamide removes the less hindered alpha proton "
                "essentially irreversibly to give the less substituted kinetic "
                "enolate, whereas conditions that allow equilibration favour the "
                "more substituted thermodynamic enolate. Which forms is a matter "
                "of base and conditions, not derivable from structure alone.",
                CAREY,
            ),
        ),
    ),
    "ORG2.ALPHAHALOGEN": Lesson(
        node="ORG2.ALPHAHALOGEN",
        objective=(
            "Predict the alpha-halogenation product of a ketone under acidic "
            "versus basic conditions, and explain why a methyl ketone undergoes "
            "the haloform reaction and cleaves a carbon to carbon bond."
        ),
        build_on=(
            "The enol and enolate from the last two lessons are nucleophilic at "
            "the alpha "
            "carbon. A halogen is the electrophile that carbon attacks, and the "
            "conditions decide whether one halogen goes in or three."
        ),
        core_idea=(
            "Under acid catalysis a ketone forms a small amount of enol, the "
            "nucleophilic alpha carbon of that enol attacks the halogen, and the "
            "product is the mono-halogenated ketone. The reaction tends to stop "
            "after one substitution, because the electron-withdrawing halogen "
            "already installed makes the next enolisation slower. Under basic "
            "conditions the story inverts. Base makes the enolate in a real "
            "concentration, the alpha carbon is halogenated, and now the halogen "
            "makes the remaining alpha hydrogens more acidic, so the second and "
            "third substitutions run faster than the first. A methyl ketone "
            "therefore has all three hydrogens of its methyl replaced to give a "
            "trihalomethyl group; hydroxide then adds to the carbonyl and expels "
            "the trihalomethyl carbanion, which is stabilised by its three "
            "halogens. What results is a carboxylate and a haloform, CHX3, and a "
            "carbon to carbon bond has been cleaved."
        ),
        worked_example=(
            "Take acetophenone, C8H8O, a phenyl ring joined to a methyl ketone. "
            "In acid with one equivalent of bromine the enol forms at the only "
            "alpha position available, the methyl, one bromine is installed to "
            "give phenacyl bromide, C8H7BrO, and the reaction rests there. Now "
            "change to basic conditions with excess iodine. The methyl is "
            "deprotonated and iodinated, and because each added iodine acidifies "
            "what remains, the process runs on to the triiodomethyl ketone "
            "without stopping. Hydroxide then attacks the carbonyl carbon, and "
            "the triiodomethyl group leaves as the CI3 anion, which picks up a "
            "proton to become iodoform, CHI3. Left behind is benzoate, C7H5O2-, "
            "the carboxylate, whose charge is why we record its formula and not "
            "an unsaturation count. The bookkeeping confirms the split: the "
            "eight carbons of acetophenone leave as seven in benzoate and one in "
            "iodoform."
        ),
        try_it_prompt=(
            "Propan-2-one is treated with excess iodine and hydroxide. Name the "
            "two organic products, and identify which carbon of propan-2-one "
            "ends up in each."
        ),
        try_it_answer=(
            "The products are acetate and iodoform. One methyl of propan-2-one "
            "is triiodinated and leaves as the CI3 anion, which becomes iodoform "
            "CHI3, carrying one carbon. The carbonyl carbon and the other methyl "
            "stay as acetate, CH3COO-, carrying the other two carbons. The three "
            "carbons of propan-2-one divide as two in acetate and one in "
            "iodoform, which is the carbon to carbon cleavage the haloform "
            "reaction is known for."
        ),
        pitfall=(
            "The misconception is that halogenation always installs a single "
            "halogen, so a methyl ketone in base gives a mono-halo product. Acid "
            "and base run in opposite directions here: acid slows each "
            "successive substitution and stops at one, while base speeds them up "
            "and drives a methyl ketone all the way to cleavage. Read the "
            "conditions before predicting a count, because the same substrate "
            "gives very different products."
        ),
        claims=(
            Formula(ACETOPHENONE, "C8H8O", "acetophenone, a methyl ketone"),
            Unsaturation(ACETOPHENONE, 5, "aromatic ring is four, carbonyl is one"),
            Formula(PHENACYL_BROMIDE, "C8H7BrO", "the mono-bromo product in acid"),
            Unsaturation(PHENACYL_BROMIDE, 5, "unchanged skeleton"),
            Formula(IODOFORM, "CHI3", "the haloform"),
            Formula(
                BENZOATE, "C7H5O2-",
                "the carboxylate, charged, so a formula not an unsaturation count",
            ),
            Source(
                "Under acid catalysis alpha-halogenation of a ketone stops "
                "predominantly at monohalogenation, whereas under basic "
                "conditions a methyl ketone is exhaustively halogenated and "
                "cleaved to a carboxylate and a haloform. Which pathway a given "
                "substrate follows is an empirical matter this repository does "
                "not derive.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.ALKYLATION": Lesson(
        node="ORG2.ALKYLATION",
        objective=(
            "Use the malonic ester synthesis to build a chosen substituted "
            "acetic acid, letting the target carbon count decide which alkyl "
            "halide to use."
        ),
        build_on=(
            "A 1,3-dicarbonyl enolate is easy to make and is a carbon "
            "nucleophile. Diethyl malonate is the workhorse: its doubly "
            "stabilised enolate alkylates cleanly, and the two ester groups can "
            "later be removed to leave a carboxylic acid."
        ),
        core_idea=(
            "Diethyl malonate has an alpha carbon flanked by two esters, so an "
            "alkoxide deprotonates it fully, and the resulting enolate performs "
            "an SN2 substitution on a primary alkyl halide, installing the alkyl "
            "group on that central carbon. Hydrolysing the two esters gives a "
            "malonic acid, a 1,3-diacid, and heating it drives decarboxylation: "
            "a 1,3-diacid loses one carbon dioxide through a six-membered cyclic "
            "transition state to leave a mono-acid. The net effect is a "
            "substituted acetic acid, R attached to CH2COOH, whose R group is "
            "whatever the alkyl halide supplied. Because you choose the halide, "
            "you choose the carbon count of the product, and the malonate "
            "contributes a fixed two-carbon acetic acid core. Deprotonate again "
            "and add a second halide before hydrolysis, and the central carbon "
            "carries two groups, giving a disubstituted acetic acid."
        ),
        worked_example=(
            "Suppose the target is butanoic acid, CH3CH2CH2COOH. Read it as a "
            "substituted acetic acid: the COOH and the carbon next to it are the "
            "acetic acid core, and the remaining CH3CH2 is the R group, an ethyl. "
            "So alkylate diethyl malonate with bromoethane. The malonate enolate "
            "displaces bromide to give diethyl 2-ethylmalonate, C9H16O4. "
            "Hydrolyse both esters to reach 2-ethylmalonic acid, C5H8O4, a "
            "1,3-diacid. Heat it, and one carboxyl leaves as carbon dioxide "
            "through the cyclic transition state, giving butanoic acid, C4H8O2. "
            "Check the carbon bookkeeping: the malonate delivered the CH2COOH "
            "after one carboxyl departed, the ethyl came from bromoethane, and "
            "two plus two makes the four carbons of butanoic acid."
        ),
        try_it_prompt=(
            "You want pentanoic acid, CH3CH2CH2CH2COOH, by the malonic ester "
            "synthesis. Which alkyl halide do you alkylate diethyl malonate "
            "with, and what is the formula of the diacid you decarboxylate?"
        ),
        try_it_answer=(
            "Read pentanoic acid as R attached to CH2COOH: the R group is "
            "propyl, CH3CH2CH2, so alkylate with 1-bromopropane. The malonate "
            "enolate gives diethyl 2-propylmalonate; hydrolysis gives "
            "2-propylmalonic acid, C6H10O4, which on heating loses one carbon "
            "dioxide to give pentanoic acid, C5H10O2. The malonate supplies the "
            "two-carbon core and the propyl halide supplies the other three."
        ),
        pitfall=(
            "The common slip is forgetting that decarboxylation removes a "
            "carbon, and counting the product as though both ester carbons "
            "survived. Only a 1,3-diacid decarboxylates on gentle heating, and "
            "it loses exactly one carboxyl, so the malonate contributes a "
            "CH2COOH and not a CH bearing two acids to the final product. A "
            "second slip is reaching for a tertiary or aromatic halide, where "
            "the SN2 alkylation fails."
        ),
        claims=(
            Formula(DIETHYL_MALONATE, "C7H12O4", "the starting diester"),
            Formula(DIETHYL_ETHYLMALONATE, "C9H16O4", "after C-alkylation with ethyl"),
            Formula(ETHYLMALONIC_ACID, "C5H8O4", "the 1,3-diacid after hydrolysis"),
            Formula(BUTANOIC_ACID, "C4H8O2", "after loss of one carbon dioxide"),
            Environments(
                DIETHYL_MALONATE, (6, 4, 2),
                "two equivalent ester methyls, two ester methylenes, and the "
                "acidic central methylene",
            ),
            Source(
                "A 1,3-diacid and a beta-ketoacid lose carbon dioxide on gentle "
                "heating through a six-membered cyclic transition state, in "
                "which a carbonyl positioned three atoms away accepts the "
                "departing carboxyl; an isolated carboxylic acid does not "
                "decarboxylate under the same mild conditions.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.ACETOACETIC": Lesson(
        node="ORG2.ACETOACETIC",
        objective=(
            "Use the acetoacetic ester synthesis to build a chosen substituted "
            "methyl ketone, and see it as the ketone counterpart of the malonic "
            "ester route."
        ),
        build_on=(
            "The malonic ester route made a substituted acetic acid. Replace one "
            "ester of the malonate with a methyl ketone, and the same three "
            "steps, alkylate then hydrolyse then decarboxylate, deliver a "
            "substituted acetone instead of an acid."
        ),
        core_idea=(
            "Ethyl acetoacetate is a beta-ketoester, CH3COCH2CO2Et, with an "
            "acidic central carbon between a ketone and an ester. An alkoxide "
            "makes its enolate, an alkyl halide alkylates the central carbon by "
            "SN2, hydrolysis of the ester gives a beta-ketoacid, and that acid "
            "decarboxylates on warming through the same six-membered cyclic "
            "transition state a malonic acid uses, because it too has a carbonyl "
            "positioned to accept the departing carboxyl. What remains is a "
            "methyl ketone, CH3CO attached to CH2 attached to R, with R supplied "
            "by the halide. The parallel with the malonic ester route is exact: "
            "malonate leaves behind an acetic acid, acetoacetate leaves behind "
            "an acetone, and in both the decarboxylation removes the temporary "
            "carboxyl that made the central carbon acidic in the first place."
        ),
        worked_example=(
            "Target pentan-2-one, CH3COCH2CH2CH3. Read it as a substituted "
            "acetone: the CH3CO and the carbon beside it are the acetone-derived "
            "core, and the remaining CH2CH3 is the R group, an ethyl. Alkylate "
            "ethyl acetoacetate with bromoethane to give ethyl "
            "2-ethylacetoacetate, C8H14O3. Hydrolyse the ester to the "
            "beta-ketoacid and warm it; one carboxyl leaves as carbon dioxide, "
            "and pentan-2-one, C5H10O, remains. The acetoacetate delivered the "
            "CH3COCH2 fragment and bromoethane delivered the ethyl, giving the "
            "five-carbon methyl ketone. Notice the ketone survived the whole "
            "sequence: only the ester carboxyl was removed."
        ),
        try_it_prompt=(
            "How would you make hexan-2-one, CH3CO(CH2)3CH3, by the acetoacetic "
            "ester synthesis, and what is the formula of the beta-ketoester you "
            "alkylate?"
        ),
        try_it_answer=(
            "Read hexan-2-one as CH3CO attached to CH2 attached to R: the R "
            "group is propyl, CH3CH2CH2. Alkylate ethyl acetoacetate with "
            "1-bromopropane to give ethyl 2-propylacetoacetate, C9H16O3. "
            "Hydrolysis and decarboxylation then give hexan-2-one, C6H12O. The "
            "acetoacetate supplies the CH3COCH2 core and the propyl halide "
            "supplies the rest."
        ),
        pitfall=(
            "The error is expecting a carboxylic acid at the end, as the malonic "
            "ester route gives. Acetoacetic ester keeps its ketone through the "
            "sequence and only its ester carboxyl is removed by decarboxylation, "
            "so the product is a ketone and not an acid. The two routes share a "
            "mechanism but finish on different functional groups, and the "
            "starting ester you chose decides which."
        ),
        claims=(
            Formula(ETHYL_ACETOACETATE, "C6H10O3", "ethyl acetoacetate"),
            Formula(ETHYL_2_ETHYLACETOACETATE, "C8H14O3", "after C-alkylation"),
            Formula(PENTAN_2_ONE, "C5H10O", "after decarboxylation"),
            Unsaturation(PENTAN_2_ONE, 1, "one carbonyl, no ring"),
            Environments(
                ETHYL_ACETOACETATE, (3, 3, 2, 2),
                "the acetyl methyl, the ester methyl, and two methylenes; the "
                "central one carries the acidic hydrogens",
            ),
            Source(
                "The beta-ketoacid intermediate decarboxylates on warming "
                "through a six-membered cyclic transition state, as a malonic "
                "acid does; the ketone carbonyl is retained through hydrolysis "
                "and decarboxylation.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.ALDOL": Lesson(
        node="ORG2.ALDOL",
        objective=(
            "Predict the beta-hydroxy carbonyl product of an aldol addition, "
            "give its formula, follow the dehydration to the enone, and account "
            "for the stereocentres the reaction creates."
        ),
        build_on=(
            "The enolate is a carbon nucleophile and a carbonyl is a carbon "
            "electrophile. The aldol reaction is what happens when one molecule "
            "provides each role, and it is the main carbon to carbon bond "
            "forming reaction of the unit."
        ),
        core_idea=(
            "In the aldol reaction the enolate of one carbonyl compound adds to "
            "the carbonyl carbon of a second, forming a new carbon to carbon "
            "bond and giving a beta-hydroxy aldehyde or ketone, the aldol. The "
            "addition combines two molecules and loses no atoms, so the product "
            "formula is the sum of the two partners. Warming with acid or base "
            "then often removes water across the alpha and beta carbons to give "
            "an alpha,beta-unsaturated carbonyl compound, the condensation "
            "product; that dehydration removes exactly one molecule of water, so "
            "the enone formula is the aldol formula less H2O. The new bond can "
            "create stereocentres. When the former carbonyl carbon ends up "
            "bearing four different groups, the aldol is formed as a pair of "
            "enantiomers, and when both the alpha carbon and the former carbonyl "
            "carbon become stereocentres, the product is a set of diastereomers, "
            "each itself a pair of enantiomers."
        ),
        worked_example=(
            "Take two molecules of acetaldehyde, CH3CHO, C2H4O each. Base "
            "removes an alpha hydrogen from one to make its enolate, and that "
            "carbon adds to the carbonyl of the second acetaldehyde. The product "
            "is 3-hydroxybutanal, CH3CH(OH)CH2CHO, C4H8O2, which is two C2H4O "
            "combined with nothing lost. Its C3 carries a hydroxyl, a hydrogen, "
            "a methyl, and a CH2CHO chain, four different groups, so C3 is a "
            "stereocentre and the aldol forms as a racemic pair of enantiomers, "
            "the R and the S. Warm the mixture and it dehydrates: water leaves "
            "from C3 and an alpha hydrogen from C2, installing a double bond "
            "conjugated with the carbonyl to give but-2-enal, CH3CH=CHCHO, "
            "C4H6O. Confirm the accounting: C4H8O2 less H2O is C4H6O, one water "
            "removed and no more."
        ),
        try_it_prompt=(
            "Propanal, CH3CH2CHO, undergoes a base-catalysed aldol addition with "
            "itself. Give the formula of the aldol product, say how many "
            "stereocentres it has, and state how many stereoisomers result."
        ),
        try_it_answer=(
            "The aldol is 3-hydroxy-2-methylpentanal, CH3CH2CH(OH)CH(CH3)CHO, "
            "C6H12O2, the sum of two propanal molecules with nothing lost. It "
            "has two stereocentres, the carbon bearing the hydroxyl and the "
            "alpha carbon bearing the methyl, so it has four stereoisomers: two "
            "diastereomers, each formed as a pair of enantiomers. The two "
            "diastereomers are the pieces you would separate on a column, and "
            "they are commonly labelled syn and anti by the relative arrangement "
            "of the hydroxyl and the methyl."
        ),
        pitfall=(
            "The frequent mistake is writing the condensation product at once "
            "and losing water the addition step never lost. The aldol addition "
            "combines two molecules and removes nothing; dehydration is a "
            "separate step that needs warming or a driving conjugation, and it "
            "removes one water and only one. Track the formula through each "
            "step: addition gives the sum, condensation gives the sum less a "
            "single H2O, and skipping the intermediate hides where a stereocentre "
            "was set or a double bond was formed."
        ),
        claims=(
            Formula(ACETALDEHYDE, "C2H4O", "the partner, used twice"),
            Formula(
                HYDROXYBUTANAL_R, "C4H8O2",
                "the aldol; addition is two C2H4O with nothing lost",
            ),
            Stereo(HYDROXYBUTANAL_R, ("R",), "one stereocentre at C3"),
            Stereo(HYDROXYBUTANAL_S, ("S",), "its mirror image"),
            Relationship(
                HYDROXYBUTANAL_R, HYDROXYBUTANAL_S, "enantiomers",
                "the single new stereocentre is set both ways, giving a racemate",
            ),
            Formula(
                CROTONALDEHYDE, "C4H6O",
                "but-2-enal; condensation is the aldol less one water",
            ),
            Unsaturation(CROTONALDEHYDE, 2, "the carbon to carbon and carbon to oxygen double bonds"),
            Formula(PROPANAL, "C3H6O", "the partner for the two-stereocentre case"),
            Formula(HMPA_SS, "C6H12O2", "3-hydroxy-2-methylpentanal, two propanals combined"),
            Stereo(HMPA_SS, ("S", "S"), "descriptors in atom-index order, hydroxyl carbon first"),
            Stereo(HMPA_RR, ("R", "R"), "its enantiomer"),
            Stereo(HMPA_SR, ("S", "R"), "the other diastereomer"),
            Relationship(HMPA_SS, HMPA_RR, "enantiomers", "one diastereomer and its mirror image"),
            Relationship(
                HMPA_SS, HMPA_SR, "diastereomers",
                "one stereocentre inverted, not both, so not mirror images",
            ),
        ),
    ),
    "ORG2.CROSSEDALDOL": Lesson(
        node="ORG2.CROSSEDALDOL",
        objective=(
            "Control a crossed aldol by choosing partners so that only one "
            "enolate forms, and predict the ring formed when an aldol closes "
            "within a single molecule."
        ),
        build_on=(
            "A self-aldol used one compound as both nucleophile and "
            "electrophile. Mixing two different carbonyl compounds risks four "
            "products, so the crossed aldol is about arranging the partners so "
            "that one product dominates."
        ),
        core_idea=(
            "If two different carbonyl compounds that both have alpha hydrogens "
            "are mixed with base, each can enolise and each can be attacked, "
            "giving up to four aldol products, which is rarely useful. The "
            "crossed aldol becomes practical when one partner cannot enolise, "
            "having no alpha hydrogen, so it can serve only as the electrophile. "
            "Aromatic aldehydes and formaldehyde are the classic non-enolisable "
            "partners: pair one with a compound that does have alpha hydrogens, "
            "and the enolate forms in only one place and adds to the aldehyde "
            "that cannot enolise, so a single crossed product results. The same "
            "enolate-plus-carbonyl bond can also form within one molecule. A "
            "dicarbonyl compound whose enolate can reach its own second carbonyl "
            "closes a ring, and five- and six-membered rings form fastest "
            "because the chain reaches those without strain."
        ),
        worked_example=(
            "Pair benzaldehyde, C6H5CHO, formula C7H6O, with propan-2-one, "
            "C3H6O. Benzaldehyde has no alpha hydrogen, its carbonyl flanked by "
            "the ring on one side and the aldehyde hydrogen on the other, so it "
            "cannot form an enolate and acts only as the electrophile. Base "
            "makes the propan-2-one enolate, which adds to the benzaldehyde "
            "carbonyl to give 4-hydroxy-4-phenylbutan-2-one, C10H12O2, the sum of "
            "the two partners. This aldol dehydrates readily, because the new "
            "double bond conjugates with both the carbonyl and the ring, giving "
            "4-phenylbut-3-en-2-one, C10H10O, the aldol formula less one water. "
            "For the intramolecular case take hexanedial, OHC(CH2)4CHO, C6H10O2. "
            "One aldehyde enolises at its alpha carbon and reaches across to the "
            "other aldehyde carbonyl, closing a five-membered carbocycle; "
            "dehydration then gives cyclopent-1-ene-1-carbaldehyde, C6H8O, again "
            "the starting formula less a single water."
        ),
        try_it_prompt=(
            "Benzaldehyde is mixed with acetaldehyde and base. Explain why the "
            "main product is a single crossed aldol rather than a mixture, and "
            "give the formula of the condensation product after water is lost."
        ),
        try_it_answer=(
            "Benzaldehyde has no alpha hydrogen, so it cannot enolise and can "
            "only be the electrophile; acetaldehyde provides the only enolate. "
            "That removes three of the four possible products and leaves the "
            "crossed one, benzaldehyde's carbonyl attacked by the acetaldehyde "
            "enolate. The addition gives 3-hydroxy-3-phenylpropanal, C9H10O2, and "
            "losing one water gives the conjugated cinnamaldehyde, "
            "C6H5CH=CHCHO, C9H8O."
        ),
        pitfall=(
            "The misconception is that any two aldehydes can be mixed to make "
            "one crossed aldol. Without a non-enolisable partner both compounds "
            "enolise and both are attacked, and the flask fills with self-aldols "
            "and crossed aldols together. The control comes from a partner that "
            "cannot make an enolate, or from making one enolate completely "
            "before the other carbonyl is added; absent one of those, expect the "
            "mixture."
        ),
        claims=(
            Formula(BENZALDEHYDE, "C7H6O", "the non-enolisable partner"),
            Formula(ACETONE, "C3H6O", "the enolisable partner"),
            Formula(
                HYDROXYPHENYLBUTANONE, "C10H12O2",
                "the crossed aldol, the sum of the two partners",
            ),
            Formula(
                BENZALACETONE, "C10H10O",
                "the condensation product, the aldol less one water",
            ),
            Unsaturation(BENZALACETONE, 6, "aromatic ring four, alkene one, carbonyl one"),
            Formula(ADIPALDEHYDE, "C6H10O2", "hexanedial, the intramolecular substrate"),
            Formula(
                CYCLOPENTENECARBALDEHYDE, "C6H8O",
                "the ring condensation product, the substrate less one water",
            ),
            Unsaturation(CYCLOPENTENECARBALDEHYDE, 3, "ring one, alkene one, carbonyl one"),
        ),
    ),
    "ORG2.CLAISEN": Lesson(
        node="ORG2.CLAISEN",
        objective=(
            "Predict the beta-ketoester from a Claisen condensation of two "
            "esters, explain why the reaction needs a full equivalent of base, "
            "and give the cyclic product of an intramolecular Dieckmann."
        ),
        build_on=(
            "The aldol joined two carbonyls at a carbon and kept both oxygens. "
            "The Claisen does the same first step with esters, but the "
            "tetrahedral intermediate collapses and ejects an alkoxide, so the "
            "product is a beta-ketoester rather than a beta-hydroxy compound."
        ),
        core_idea=(
            "An ester has alpha hydrogens, and its enolate adds to the carbonyl "
            "of a second ester. Where an aldol would stop at an alcohol, the "
            "ester's tetrahedral intermediate expels an alkoxide leaving group "
            "and reforms a carbonyl, so the product is a beta-ketoester and one "
            "molecule of alcohol is released. The equilibrium for that step is "
            "unfavourable on its own; what pulls it through is the acidity of "
            "the beta-ketoester product. Its central hydrogen, between a ketone "
            "and an ester, has a pKa near 11, well below the alpha hydrogen of "
            "the starting ester near 25, so the alkoxide base deprotonates the "
            "product to its stabilised enolate, and that deprotonation is "
            "downhill enough to drag the whole sequence forward. Because one "
            "equivalent of base is consumed holding the product as its enolate, "
            "the reaction needs a full equivalent and not a catalytic amount; a "
            "final acid workup returns the neutral beta-ketoester. Run the two "
            "ester groups into one molecule and the same reaction closes a ring, "
            "the Dieckmann condensation, favoured for five- and six-membered "
            "rings."
        ),
        worked_example=(
            "Take two molecules of ethyl acetate, CH3CO2Et, C4H8O2 each. "
            "Ethoxide removes an alpha hydrogen from one to give its enolate, "
            "which adds to the carbonyl of the second; the tetrahedral "
            "intermediate then ejects ethoxide, giving ethyl 3-oxobutanoate, "
            "known as ethyl acetoacetate, CH3COCH2CO2Et, C6H10O3, plus ethanol, "
            "C2H6O. Account for the atoms: two C4H8O2 supply C8H16O4, and the "
            "products C6H10O3 and C2H6O add back to C8H16O4, with the alkoxide "
            "leaving as ethanol after workup. The need for a full equivalent of "
            "ethoxide shows up at the end: the ethyl acetoacetate produced is "
            "more acidic than ethyl acetate, so it is held as its enolate by the "
            "base, and only the acid workup frees it. For the ring version take "
            "diethyl hexanedioate, C10H18O4; its enolate reaches the far ester "
            "within the same chain and closes a five-membered ring, giving ethyl "
            "2-oxocyclopentanecarboxylate, C8H12O3, and one ethanol."
        ),
        try_it_prompt=(
            "A Claisen condensation is run with only a catalytic amount of base. "
            "Explain why it fails to give a good yield, and what quantity of "
            "base is required instead."
        ),
        try_it_answer=(
            "The product beta-ketoester is more acidic than the starting ester, "
            "so the base deprotonates it, and that deprotonation is what makes "
            "the otherwise unfavourable condensation proceed. A catalytic amount "
            "of base cannot deprotonate a full equivalent of product, so the "
            "equilibrium is never pulled forward and the yield stays low. A full "
            "equivalent is required, because one equivalent is consumed keeping "
            "the product as its enolate until an acid workup regenerates the "
            "neutral beta-ketoester."
        ),
        pitfall=(
            "The trap is treating the Claisen like an aldol and stopping at a "
            "beta-hydroxy diester, or forgetting that the alkoxide is a leaving "
            "group here. An aldol's tetrahedral intermediate has no leaving "
            "group and collapses to an alcohol; an ester's intermediate has an "
            "alkoxide that leaves, restoring a carbonyl and giving a "
            "beta-ketoester. The second trap is thinking the base is catalytic, "
            "when a full equivalent is consumed by the acidic product."
        ),
        claims=(
            Formula(ETHYL_ACETATE, "C4H8O2", "the ester, used twice"),
            Formula(
                ETHYL_ACETOACETATE, "C6H10O3",
                "the beta-ketoester, formed with loss of an alkoxide",
            ),
            Formula(ETHANOL, "C2H6O", "the alcohol released, recovered on workup"),
            Formula(DIETHYL_ADIPATE, "C10H18O4", "the diester for the Dieckmann"),
            Formula(
                ETHYL_OXOCYCLOPENTANECARBOXYLATE, "C8H12O3",
                "the cyclic beta-ketoester, released alkoxide as ethanol",
            ),
            Unsaturation(
                ETHYL_OXOCYCLOPENTANECARBOXYLATE, 3,
                "the ring, the ketone carbonyl, and the ester carbonyl",
            ),
            Source(
                "The Claisen and Dieckmann condensations require a full "
                "equivalent of base because the beta-ketoester product, pKa near "
                "11 in water, is deprotonated to its enolate by the alkoxide, "
                "which consumes the base and drives the otherwise unfavourable "
                "equilibrium; the starting ester alpha hydrogen is near pKa 25. "
                "These are approximate aqueous values quoted for the ordering.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.MICHAEL": Lesson(
        node="ORG2.MICHAEL",
        objective=(
            "Predict the product of a Michael addition of a stabilised enolate "
            "to an alpha,beta-unsaturated carbonyl, and follow a Robinson "
            "annulation through its Michael and aldol steps to the ring it "
            "builds."
        ),
        build_on=(
            "Aldol and Claisen added an enolate to a carbonyl carbon. An "
            "alpha,beta-unsaturated carbonyl offers a second electrophilic site, "
            "the beta carbon, and an enolate that adds there instead is doing a "
            "Michael addition."
        ),
        core_idea=(
            "An alpha,beta-unsaturated carbonyl compound is electrophilic at the "
            "carbonyl carbon and also at the beta carbon, because the carbonyl "
            "withdraws electron density through the conjugated double bond. A "
            "stabilised enolate, such as one from a 1,3-dicarbonyl, tends to add "
            "to the beta carbon, a conjugate or 1,4-addition called the Michael "
            "addition, forming a carbon to carbon bond and, once the enol "
            "tautomerises back, leaving both carbonyls intact. The addition "
            "combines the two partners and loses nothing, so the product formula "
            "is their sum. The Robinson annulation strings two reactions "
            "together to build a ring: a Michael addition installs a "
            "1,5-dicarbonyl relationship, and then an intramolecular aldol "
            "condensation closes a six-membered ring and dehydrates to a "
            "cyclohexenone. The Michael donor supplies the nucleophile, the "
            "acceptor is usually a methyl vinyl ketone, and the product is a "
            "fused ring system carrying a new alpha,beta-unsaturated ketone."
        ),
        worked_example=(
            "Take diethyl malonate as the donor and but-3-en-2-one, methyl vinyl "
            "ketone, C4H6O, as the acceptor. Base makes the doubly stabilised "
            "malonate enolate, which adds to the beta carbon of the enone, its "
            "terminal CH2, rather than to the carbonyl. After the enol reverts, "
            "the product is diethyl 2-(3-oxobutyl)malonate, C11H18O5, exactly the "
            "malonate C7H12O4 and the enone C4H6O combined with nothing lost. Now "
            "the Robinson case with cyclohexanone, C6H10O, and the same enone. "
            "The cyclohexanone enolate first adds in Michael fashion to the "
            "methyl vinyl ketone to give 2-(3-oxobutyl)cyclohexanone, C10H16O2. "
            "Then an intramolecular aldol condensation closes the second ring: "
            "an enolate of the side-chain methyl ketone reaches the ring "
            "carbonyl, and dehydration installs a conjugated double bond, giving "
            "the fused bicyclic enone C10H14O, the Michael adduct less one water. "
            "The two steps together turn a single ring and a small enone into a "
            "fused two-ring enone."
        ),
        try_it_prompt=(
            "A Michael addition combines the enolate of pentane-2,4-dione with "
            "methyl vinyl ketone. Using formulas, give the formula of the "
            "conjugate addition product, and say which carbon of the enone forms "
            "the new bond."
        ),
        try_it_answer=(
            "Pentane-2,4-dione is C5H8O2 and methyl vinyl ketone is C4H6O, and a "
            "Michael addition loses nothing, so the product is C9H14O3. The new "
            "carbon to carbon bond forms at the beta carbon of the enone, the "
            "terminal CH2 of the vinyl group, not at its carbonyl carbon; that "
            "beta selectivity is what separates a conjugate 1,4-addition from a "
            "direct 1,2-addition to the carbonyl."
        ),
        pitfall=(
            "The misconception is that an enolate always adds to the carbonyl "
            "carbon, giving a 1,2-alcohol. A stabilised enolate meeting an "
            "alpha,beta-unsaturated carbonyl favours the beta carbon and a "
            "1,4-addition, keeping the carbonyl intact as a ketone rather than "
            "turning it into an alcohol. Reading a conjugate addition as a "
            "direct one puts the new bond in the wrong place and invents a "
            "hydroxyl the product does not have."
        ),
        claims=(
            Formula(MVK, "C4H6O", "but-3-en-2-one, the Michael acceptor"),
            Unsaturation(MVK, 2, "the alkene and the carbonyl"),
            Formula(DIETHYL_MALONATE, "C7H12O4", "the stabilised Michael donor"),
            Formula(
                MICHAEL_ADDUCT, "C11H18O5",
                "the conjugate addition product, the sum of the two partners",
            ),
            Formula(CYCLOHEXANONE, "C6H10O", "the Robinson donor"),
            Formula(
                CYCLOHEXANONE_ADDUCT, "C10H16O2",
                "the Michael adduct before ring closure",
            ),
            Formula(
                OCTALONE, "C10H14O",
                "the Robinson product, the adduct less one water from the aldol "
                "condensation",
            ),
            Unsaturation(OCTALONE, 4, "two rings, the alkene, and the carbonyl"),
            Source(
                "A stabilised enolate adds preferentially to the beta carbon of "
                "an alpha,beta-unsaturated carbonyl, a 1,4-conjugate addition; "
                "the balance between 1,2- and 1,4-addition depends on the "
                "nucleophile and conditions and is not derivable here.",
                CLAYDEN,
            ),
        ),
    ),
}

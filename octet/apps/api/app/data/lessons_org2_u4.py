"""ORG2 Unit 4: Alcohols, Ethers and Epoxides.

This unit lives on two kinds of fact, and the split matters for how every
lesson below is checked.

Derivable, and therefore claimed and re-derived from structure by RDKit when the
test suite runs:

  molecular formula, at each oxidation level of a carbon         Formula
  degrees of unsaturation                                        Unsaturation
  the CIP descriptors an epoxide ring opening produces           Stereo
  whether two diols are enantiomers, diastereomers or one meso   Relationship

The epoxide lesson is where that machinery earns its place. Acid and base open
an epoxide at opposite carbons, and anti opening sets two stereocentres whose
relationship a confident sentence gets backwards as often as right. Every
descriptor and every isomer relationship in ORG2.EPOXIDE was read back from
RDKit during authoring rather than reasoned onto the page: cyclohexene oxide
opens to the trans diol, and the trans diol is chiral, formed as a racemate,
while the cis diol is a single meso compound. That is the fact the checker is
guarding.

Not derivable, and therefore carried as a Source with a real citation and a
stated medium, or left as an ordering taught in prose:

  every pKa value                    acidity is measured, not computed here
  reagent selectivity and outcome    which oxidant stops at the aldehyde
  relative rates and conditions      Zaitsev preference, SN2 substrate limits

Phenol is more acidic than an alcohol and a thiol is more acidic than the
matching alcohol; those orderings are taught as orderings, and any number put
beside them names its source and its solvent, which is water throughout this
file. No pKa here was recalled into prose as if it were derived.

Section 18 safety: substrates are ordinary teaching molecules, reagents are
named at the conceptual level, and no procedure, quantity or condition for
preparing a weapon or a controlled substance appears anywhere in the unit.
"""

from __future__ import annotations

from app.data.claims import Formula, Relationship, Source, Stereo, Unsaturation
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once so a claim and its prose cannot drift apart.
# ---------------------------------------------------------------------------

ETHANOL = "CCO"
METHANOL = "CO"
TERT_BUTANOL = "CC(C)(C)O"
TRIFLUOROETHANOL = "OCC(F)(F)F"

PROPANAL = "CCC=O"
PROPAN_1_OL = "CCCO"
PROPANONE = "CC(C)=O"
PROPAN_2_OL = "CC(C)O"
PROPANOIC_ACID = "CCC(=O)O"

BUTAN_2_OL = "CCC(C)O"
BUTAN_2_OL_S = "CC[C@H](C)O"
BROMOBUTANE_2_R = "CC[C@@H](C)Br"
BUT_2_ENE = "CC=CC"
BUT_1_ENE = "C=CCC"

TMS_ETHYL_ETHER = "CCO[Si](C)(C)C"

PHENOL = "Oc1ccccc1"
HYDROQUINONE = "Oc1ccc(O)cc1"
BENZOQUINONE = "O=C1C=CC(=O)C=C1"
P_NITROPHENOL = "Oc1ccc([N+](=O)[O-])cc1"

DIETHYL_ETHER = "CCOCC"
ETHYL_METHYL_ETHER = "COCC"
ETHOXIDE = "CC[O-]"
MTBE = "COC(C)(C)C"
BROMOETHANE = "CCBr"

# Epoxide ring opening, the stereochemical heart of the unit. Every descriptor
# below was read back from RDKit, not written from memory.
CYCLOHEXENE_OXIDE = "C1CCC2OC2C1"
TRANS_CHD_SS = "O[C@H]1CCCC[C@@H]1O"    # (S,S)
TRANS_CHD_RR = "O[C@@H]1CCCC[C@H]1O"    # (R,R)
CIS_CHD = "O[C@H]1CCCC[C@H]1O"           # meso
CIS_CHD_MIRROR = "O[C@@H]1CCCC[C@@H]1O"  # the same meso compound, drawn reflected
DIMETHYLOXIRANE = "CC1(C)CO1"            # 2,2-dimethyloxirane
OPEN_BASE = "COCC(C)(C)O"                # base attacks the less substituted carbon
OPEN_ACID = "OCC(C)(C)OC"                # acid attacks the more substituted carbon
# Stereospecific synthesis: alkene geometry maps onto epoxide configuration.
TRANS_BUTENE_OXIDE_RR = "C[C@H]1O[C@@H]1C"    # (R,R)
TRANS_BUTENE_OXIDE_SS = "C[C@@H]1O[C@H]1C"    # (S,S)
CIS_BUTENE_OXIDE = "C[C@H]1O[C@H]1C"           # meso
CIS_BUTENE_OXIDE_MIRROR = "C[C@@H]1O[C@@H]1C"

ETHANETHIOL = "CCS"
DIMETHYL_SULFIDE = "CSC"
DIETHYL_DISULFIDE = "CCSSCC"
ETHANETHIOLATE = "CC[S-]"

# ---------------------------------------------------------------------------
# Citations. Every number this unit states that the repository cannot derive
# points at one of these, with its solvent named.
# ---------------------------------------------------------------------------

CLAYDEN = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, Oxford "
    "University Press 2012; chapters on acidity and organic bases, on "
    "oxidation and reduction of carbonyl compounds, and on nucleophilic "
    "substitution."
)
CRC_PKA = (
    "CRC Handbook of Chemistry and Physics, table of dissociation constants "
    "(pKa) of organic acids and bases, values in aqueous solution at about 25 "
    "degrees Celsius."
)
GREENE = (
    "Wuts, Greene's Protective Groups in Organic Synthesis, 5th edition, Wiley "
    "2014, chapter on protection for the hydroxyl group, section on silyl "
    "ethers."
)

LESSONS_ORG2_U4 = {
    "ORG2.ALCOHOLPROPS": Lesson(
        node="ORG2.ALCOHOLPROPS",
        objective=(
            "Explain why alcohols boil far above hydrocarbons of similar mass, "
            "and rank a set of hydroxyl compounds by acidity from the electronic "
            "effect of what sits next to the oxygen."
        ),
        build_on=(
            "You spent ORG1 naming carbon skeletons and reading their spectra. "
            "An alcohol is that skeleton with an O-H group bolted on, and almost "
            "everything distinctive about it, its boiling point and its acidity "
            "both, comes from that one polar bond to hydrogen."
        ),
        core_idea=(
            "The oxygen of an alcohol carries two lone pairs and an O-H bond, "
            "and that combination lets one molecule donate a hydrogen bond and "
            "accept one at the same time. A liquid held together by a network of "
            "hydrogen bonds costs more energy to boil than a liquid held only by "
            "dispersion forces, which is why ethanol boils well above propane "
            "even though the two are close in mass. The same O-H bond sets the "
            "acidity. An alcohol gives up its hydroxyl proton to leave an "
            "alkoxide, and how willingly it does so depends on how stable that "
            "alkoxide is. Anything that spreads the negative charge out "
            "stabilises the alkoxide and strengthens the acid. Electron "
            "withdrawing atoms near the oxygen pull charge toward themselves "
            "through the sigma bonds, an inductive effect that falls off with "
            "distance, so fluorines on the neighbouring carbon make an alcohol "
            "several pKa units stronger. Resonance does more than induction "
            "when it is available, which is why phenol, whose conjugate base "
            "delocalises the charge into an aromatic ring, is far more acidic "
            "than any simple alcohol."
        ),
        worked_example=(
            "Compare ethanol, CH3CH2OH, with 2,2,2-trifluoroethanol, "
            "CF3CH2OH. The two differ by three fluorine atoms on the carbon "
            "next to the oxygen, and nothing else. Remove the hydroxyl proton "
            "from each and look at the alkoxide left behind. Ethoxide has to "
            "hold its negative charge on the one oxygen, with only electron "
            "donating alkyl carbon nearby, so the charge stays concentrated. "
            "The trifluoro alkoxide sits next to a carbon bearing three "
            "electronegative fluorines, which withdraw density through the "
            "bonds and pull some of the charge off the oxygen, spreading it and "
            "lowering its energy. A more stable conjugate base means a stronger "
            "acid, so 2,2,2-trifluoroethanol is the more acidic of the two, by "
            "roughly three and a half pKa units in water. The structural change "
            "is nowhere near the oxygen in the drawing, and it still moves the "
            "acidity, because induction reaches through the bonds."
        ),
        try_it_prompt=(
            "Put ethanol, 2,2,2-trifluoroethanol and phenol in order of "
            "increasing acidity in water, and name the effect responsible for "
            "each step up the order."
        ),
        try_it_answer=(
            "Ethanol is the weakest acid, then 2,2,2-trifluoroethanol, then "
            "phenol the strongest. Ethanol has nothing to stabilise its "
            "alkoxide beyond the oxygen itself. Trifluoroethanol gains stability "
            "from the inductive pull of three fluorines through the sigma "
            "framework, which is a through-bond effect that weakens with "
            "distance. Phenol wins because its conjugate base, the phenoxide "
            "ion, delocalises the negative charge into the aromatic ring by "
            "resonance, spreading it over several carbons rather than leaving it "
            "on one oxygen, and resonance stabilisation outweighs the inductive "
            "effect here. The approximate aqueous pKa values run near 16 for "
            "ethanol, near 12.5 for trifluoroethanol and near 10 for phenol."
        ),
        pitfall=(
            "The trap is reading a large downfield shift or a familiar O-H bond "
            "as a sign of strong acidity, or ranking acids by counting hydrogen "
            "atoms. Acidity is a statement about the conjugate base, not about "
            "the proton you started with. The reliable question is always "
            "whether the anion left behind is stabilised, by induction, by "
            "resonance, or by nothing, and the alcohol whose alkoxide is most "
            "stabilised is the strongest acid regardless of how the neutral "
            "molecule looks."
        ),
        claims=(
            Formula(ETHANOL, "C2H6O", "ethanol"),
            Formula(METHANOL, "CH4O", "methanol"),
            Formula(TRIFLUOROETHANOL, "C2H3F3O", "2,2,2-trifluoroethanol"),
            Formula(PHENOL, "C6H6O", "phenol"),
            Source(
                "Approximate aqueous pKa values: methanol about 15.5, ethanol "
                "about 16, 2-methylpropan-2-ol about 18, 2,2,2-trifluoroethanol "
                "about 12.5, phenol about 10. These are measured acidities in "
                "water, quoted for ordering rather than as analytical figures, "
                "and this repository cannot derive them from structure.",
                CRC_PKA,
            ),
            Source(
                "The ordering that electron withdrawing substituents raise "
                "alcohol acidity by inductive stabilisation of the alkoxide, "
                "and that resonance delocalisation makes phenol far more acidic "
                "than a simple alcohol, is standard treatment.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.ALCOHOLREDUCTION": Lesson(
        node="ORG2.ALCOHOLREDUCTION",
        objective=(
            "Predict the alcohol produced when a hydride reagent reduces a given "
            "carbonyl, and state which reagent to reach for when a molecule "
            "carries a group that must survive."
        ),
        build_on=(
            "In ORG1 you read carbonyl compounds off their spectra. Reduction "
            "is the reverse direction from the one you will study next: instead "
            "of taking hydrogens off an alcohol, you add them to a carbonyl and "
            "get the alcohol back."
        ),
        core_idea=(
            "A hydride reagent delivers a hydrogen with its bonding pair, a "
            "hydride ion, to the electrophilic carbon of a carbonyl. The pi "
            "electrons shift onto oxygen to give an alkoxide, and a workup step "
            "protonates that oxygen to finish the alcohol. The carbon skeleton "
            "does not change; one hydrogen adds to carbon and one adds to oxygen, "
            "so the transformation removes the carbonyl pi bond and lowers the "
            "oxidation level of that carbon. An aldehyde, whose carbonyl carbon "
            "carries one hydrogen already, becomes a primary alcohol. A ketone, "
            "whose carbonyl carbon carries none, becomes a secondary alcohol. "
            "The two common reagents differ in strength. Sodium borohydride is "
            "mild and reduces aldehydes and ketones while leaving esters and "
            "carboxylic acids largely untouched, so it can be used in protic "
            "solvents and selects the more reactive carbonyl. Lithium aluminium "
            "hydride is far more powerful and reduces esters, acids and amides "
            "as well, which makes it the choice when everything must go down and "
            "the wrong choice when something must be spared."
        ),
        worked_example=(
            "Reduce propanal, CH3CH2CHO, with sodium borohydride. Propanal is "
            "C3H6O with one degree of unsaturation, the carbonyl pi bond. The "
            "hydride adds to the carbonyl carbon and, after protonation of the "
            "resulting alkoxide, that carbon ends up bonded to two hydrogens, an "
            "ethyl group and a hydroxyl. The product is propan-1-ol, "
            "CH3CH2CH2OH, which is C3H8O with no degrees of unsaturation left. "
            "Count the change: the formula gained two hydrogens, one on carbon "
            "and one on oxygen, and the pi bond is gone. Because propanal is an "
            "aldehyde its carbonyl carbon began with one hydrogen, so the "
            "alcohol carbon finishes with two and the product is a primary "
            "alcohol, an OH on a carbon attached to only one other carbon."
        ),
        try_it_prompt=(
            "Sodium borohydride reduces propanone, CH3COCH3. Give the product, "
            "its molecular formula, and say whether it is a primary, secondary "
            "or tertiary alcohol."
        ),
        try_it_answer=(
            "The product is propan-2-ol, CH3CH(OH)CH3, molecular formula C3H8O. "
            "Propanone is a ketone, so its carbonyl carbon carried no hydrogen "
            "and is bonded to two methyl groups. Adding a hydride and then "
            "protonating gives that carbon one hydrogen and a hydroxyl, leaving "
            "it attached to two other carbons, which is the definition of a "
            "secondary alcohol. The formula went from C3H6O to C3H8O, a gain of "
            "the two hydrogens that reduction always adds across the carbonyl."
        ),
        pitfall=(
            "The misconception worth naming is that a stronger reducing agent is "
            "always the safer default. Lithium aluminium hydride reduces almost "
            "every carbonyl, which is exactly why it is dangerous when a "
            "molecule contains an ester or an acid you meant to keep. Reagent "
            "choice is about selectivity, not raw power: reach for sodium "
            "borohydride when you want a ketone or aldehyde reduced and its more "
            "resistant neighbours left alone, and reach for lithium aluminium "
            "hydride when you intend to take everything down."
        ),
        claims=(
            Formula(PROPANAL, "C3H6O", "propanal"),
            Unsaturation(PROPANAL, 1, "the carbonyl pi bond"),
            Formula(PROPAN_1_OL, "C3H8O", "propan-1-ol"),
            Unsaturation(PROPAN_1_OL, 0, "saturated after reduction"),
            Formula(PROPANONE, "C3H6O", "propanone"),
            Unsaturation(PROPANONE, 1),
            Formula(PROPAN_2_OL, "C3H8O", "propan-2-ol"),
            Source(
                "Sodium borohydride reduces aldehydes and ketones but is slow "
                "toward esters and carboxylic acids, while lithium aluminium "
                "hydride reduces esters, acids and amides as well. Which "
                "functional groups a given hydride reagent reduces is empirical "
                "and is not derivable from structure in this repository.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.ALCOHOLGRIGNARD": Lesson(
        node="ORG2.ALCOHOLGRIGNARD",
        objective=(
            "Build the alcohol formed when a Grignard reagent adds to a "
            "carbonyl, count the new carbon-carbon bond, and predict whether "
            "the product is primary, secondary or tertiary from the carbonyl "
            "chosen."
        ),
        build_on=(
            "Reduction added a hydrogen to a carbonyl carbon and changed no bond "
            "between carbons. A Grignard addition looks similar on paper but "
            "does the thing reduction cannot: it forms a new carbon-carbon bond "
            "and makes the skeleton bigger."
        ),
        core_idea=(
            "In a Grignard reagent, written R-MgX, the carbon bonded to "
            "magnesium carries a large share of the negative charge and behaves "
            "as a carbon nucleophile. It attacks the electrophilic carbon of a "
            "carbonyl, the pi electrons move onto oxygen to give an alkoxide, "
            "and a workup protonates that oxygen to the alcohol. The event that "
            "matters is the new bond from the Grignard carbon to the former "
            "carbonyl carbon, because it joins two pieces of carbon skeleton in "
            "one step, which is why this reaction builds molecules rather than "
            "only interconverting them. The class of alcohol follows from the "
            "carbonyl. Methanal, with two hydrogens on the carbonyl carbon, "
            "gives a primary alcohol. Any other aldehyde, with one hydrogen, "
            "gives a secondary alcohol. A ketone, with no hydrogen and two "
            "carbon groups already, gives a tertiary alcohol. Grignard reagents "
            "are made from an alkyl or aryl halide and magnesium metal, and "
            "because the reagent is a strong base as well as a nucleophile it is "
            "destroyed by any acidic proton, so a substrate bearing a free "
            "hydroxyl, amine or carboxylic acid quenches it before it can add."
        ),
        worked_example=(
            "Add methylmagnesium bromide, CH3MgBr, to propanal, CH3CH2CHO. The "
            "methyl carbon attacks the carbonyl carbon of propanal and forms a "
            "bond to it. That carbon started as part of a three carbon aldehyde; "
            "after the addition and workup it carries a hydroxyl, the hydrogen "
            "it already had, the ethyl group from propanal and the new methyl "
            "from the Grignard. Counting the chain, three carbons from the "
            "aldehyde plus one from the reagent gives four, so the product is "
            "butan-2-ol, CH3CH2CH(OH)CH3, molecular formula C4H10O. The hydroxyl "
            "sits on a carbon bonded to two other carbons, an ethyl and a "
            "methyl, so it is a secondary alcohol, which is what an aldehyde "
            "other than methanal always gives. The single new carbon-carbon "
            "bond is the whole point: a four carbon alcohol was assembled from a "
            "three carbon and a one carbon piece."
        ),
        try_it_prompt=(
            "Methylmagnesium bromide adds to propanone, CH3COCH3. Give the "
            "alcohol, its molecular formula, and say which class of alcohol it "
            "is and why."
        ),
        try_it_answer=(
            "The product is 2-methylpropan-2-ol, (CH3)3COH, molecular formula "
            "C4H10O. Propanone is a ketone, so its carbonyl carbon carried no "
            "hydrogen and was already bonded to two methyl groups; the incoming "
            "methyl makes three, and the oxygen becomes the hydroxyl. A carbon "
            "bonded to three other carbons and one hydroxyl is a tertiary "
            "alcohol, which is the class every ketone gives with a Grignard "
            "reagent. Note that the same formula C4H10O also belongs to "
            "butan-2-ol from the worked example: the two are constitutional "
            "isomers, one built from an aldehyde and one from a ketone."
        ),
        pitfall=(
            "The error that wastes a real experiment is trying to run a Grignard "
            "addition on a substrate that carries its own acidic hydrogen, a "
            "free hydroxyl or amine or acid. The reagent is a powerful base "
            "before it is a nucleophile, so it deprotonates that group and is "
            "consumed as an alkane, and the intended carbon-carbon bond never "
            "forms. The belief underneath is that a nucleophile picks the "
            "carbonyl because that is what the arrow shows; in practice it takes "
            "the fastest proton first, so the acidic site has to be protected or "
            "absent."
        ),
        claims=(
            Formula(PROPANAL, "C3H6O", "propanal, the carbonyl substrate"),
            Formula(BUTAN_2_OL, "C4H10O", "butan-2-ol, the secondary alcohol product"),
            Formula(PROPANONE, "C3H6O", "propanone"),
            Formula(TERT_BUTANOL, "C4H10O", "2-methylpropan-2-ol, the tertiary alcohol product"),
            Relationship(
                BUTAN_2_OL, TERT_BUTANOL, "constitutional",
                "same formula C4H10O, one from an aldehyde and one from a ketone",
            ),
            Source(
                "A Grignard reagent is prepared from an organohalide and "
                "magnesium and is destroyed by acidic protons faster than it "
                "adds to a carbonyl; the requirement to exclude such protons is "
                "an experimental fact this repository does not derive.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.ALCOHOLSUB": Lesson(
        node="ORG2.ALCOHOLSUB",
        objective=(
            "Explain why a hydroxyl will not leave on its own, and describe the "
            "two routes, protonation and conversion to a sulfonate ester, that "
            "turn it into a group a nucleophile or a base can displace."
        ),
        build_on=(
            "You now know several ways to make an alcohol. Using one as a "
            "starting material runs into a problem the carbonyl chemistry did "
            "not have: hydroxide is a poor leaving group, so the alcohol has to "
            "be activated before anything will replace it."
        ),
        core_idea=(
            "A leaving group departs carrying the bonding electrons, and it does "
            "so willingly only when it is stable as the anion, which is another "
            "way of saying it is the conjugate base of a strong acid. Hydroxide "
            "is the conjugate base of water, a weak acid, so it is a bad leaving "
            "group and an alcohol resists substitution and elimination as drawn. "
            "Two moves fix this. The first is protonation: strong acid converts "
            "the hydroxyl to an oxonium, and now the group that leaves is neutral "
            "water, the conjugate base of the strong acid hydronium, which "
            "departs readily. Under acid a tertiary alcohol ionises to a "
            "carbocation and reacts by the unimolecular routes, substitution to "
            "an alkyl halide or elimination to an alkene, and elimination "
            "follows Zaitsev, favouring the more substituted alkene. The second "
            "move keeps the carbon centre intact: a sulfonyl chloride converts "
            "the hydroxyl oxygen to a sulfonate ester such as a tosylate, "
            "forming the new bond at sulfur and leaving the carbon-oxygen bond "
            "untouched, so configuration at carbon is retained through the "
            "activation. The sulfonate is an excellent leaving group, and a "
            "nucleophile then displaces it by a clean bimolecular substitution "
            "with inversion at carbon."
        ),
        worked_example=(
            "Take (S)-butan-2-ol and replace its hydroxyl with bromine while "
            "watching the stereochemistry. Convert the alcohol to its tosylate "
            "first. Tosylation builds the bond at sulfur and never breaks the "
            "carbon-oxygen bond, so the stereocentre is carried through "
            "unchanged. Now bromide attacks the tosylate carbon by a bimolecular "
            "substitution, coming in on the face opposite the leaving group, so "
            "the spatial arrangement at that carbon inverts. Read the descriptor "
            "on the product: bromine and the departed oxygen both rank first "
            "among the four groups, and the other three keep their order, so the "
            "inversion of spatial arrangement shows up as an inverted label. The "
            "(S)-alcohol gives (R)-2-bromobutane. The label flip here is a "
            "consequence of the priorities lining up, not a rule that "
            "configuration always changes name on substitution; the fact you can "
            "rely on is that the spatial arrangement inverts."
        ),
        try_it_prompt=(
            "Butan-2-ol is heated with concentrated sulfuric acid and loses "
            "water. Two alkenes are possible, but-1-ene and but-2-ene. Which is "
            "the major product, and what governs the choice?"
        ),
        try_it_answer=(
            "But-2-ene is the major product. Acid protonates the hydroxyl so "
            "that water, not hydroxide, is the leaving group, and elimination "
            "then removes a hydrogen from a carbon next to the one that lost "
            "water. Taking the hydrogen from the internal methylene gives "
            "but-2-ene, whose double bond carries a carbon substituent on each "
            "end, while taking it from the terminal methyl gives the less "
            "substituted but-1-ene. The more substituted alkene is the more "
            "stable and is favoured, which is Zaitsev's preference. Both alkenes "
            "share the formula C4H8; they are constitutional isomers separated "
            "by which hydrogen the elimination removes."
        ),
        pitfall=(
            "The habit to break is drawing hydroxide leaving directly from a "
            "neutral alcohol under basic or neutral conditions. Nothing "
            "activates it there, and the reaction does not run. An alcohol needs "
            "either protonation to make water the leaving group or conversion to "
            "a halide or sulfonate ester to make a good one, and forgetting that "
            "step produces mechanisms that look reasonable and never happen. "
            "Note also that the sulfonate route preserves the carbon centre "
            "during activation and inverts it only when the nucleophile "
            "displaces, whereas the acid route, going through a carbocation for "
            "a tertiary substrate, scrambles configuration."
        ),
        claims=(
            Formula(BUTAN_2_OL, "C4H10O", "butan-2-ol"),
            Stereo(BUTAN_2_OL_S, ("S",), "(S)-butan-2-ol, the starting alcohol"),
            Stereo(BROMOBUTANE_2_R, ("R",), "(R)-2-bromobutane, after inversion at carbon"),
            Formula(BROMOBUTANE_2_R, "C4H9Br", "2-bromobutane"),
            Formula(BUT_2_ENE, "C4H8", "but-2-ene, the Zaitsev product"),
            Formula(BUT_1_ENE, "C4H8", "but-1-ene, the less substituted alkene"),
            Relationship(
                BUT_2_ENE, BUT_1_ENE, "constitutional",
                "same formula, differing in which hydrogen elimination removes",
            ),
            Source(
                "Acid catalysed dehydration of an alcohol favours the more "
                "substituted alkene, Zaitsev's rule, and tertiary alcohols "
                "ionise and react by unimolecular routes while primary alcohols "
                "do not. Which route dominates and the product ratio are "
                "empirical and are not derived here.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.OXIDATION": Lesson(
        node="ORG2.OXIDATION",
        objective=(
            "Track the oxidation level of a carbinol carbon through the "
            "aldehyde, ketone and carboxylic acid it can reach, and choose a "
            "reagent that stops at the level you want."
        ),
        build_on=(
            "Reduction added hydrogens across a carbonyl to make an alcohol. "
            "Oxidation is the return trip, and reading it as a change in a "
            "carbon's oxidation level is what makes the whole family of products "
            "fall into order."
        ),
        core_idea=(
            "Oxidation of an alcohol removes hydrogen from the carbinol carbon "
            "and its oxygen, raising that carbon's oxidation level one step at a "
            "time. Whether the ladder has one rung or two depends on how many "
            "hydrogens the carbinol carbon started with. A primary alcohol has "
            "two: the first oxidation removes two hydrogens to give an aldehyde, "
            "and a second oxidation, which formally adds an oxygen, takes it on "
            "to a carboxylic acid. A secondary alcohol has one hydrogen on its "
            "carbinol carbon, so it oxidises once to a ketone and can go no "
            "further, because the next step would need a carbon-carbon bond to "
            "break. A tertiary alcohol has no hydrogen on that carbon and "
            "resists ordinary oxidation entirely. Reagent choice controls where "
            "a primary alcohol stops. A reagent used under anhydrous conditions, "
            "of which pyridinium chlorochromate is the standard example, stops "
            "at the aldehyde. A reagent used with water present, such as chromic "
            "acid, carries the primary alcohol all the way to the carboxylic "
            "acid, because the aldehyde hydrates and the hydrate is oxidised "
            "again."
        ),
        worked_example=(
            "Follow propan-1-ol, CH3CH2CH2OH, up the ladder. It is C3H8O, a "
            "primary alcohol with two hydrogens on the carbinol carbon. One "
            "oxidation removes two hydrogens to reach propanal, CH3CH2CHO, which "
            "is C3H6O with the carbonyl pi bond restored. Stop here with an "
            "anhydrous chromium reagent and the aldehyde is the product. Allow "
            "water and a stronger oxidant, and the aldehyde does not survive: it "
            "is carried on to propanoic acid, CH3CH2COOH, which is C3H6O2. Read "
            "the formulas as an oxidation-level record. The alcohol at C3H8O "
            "lost two hydrogens to give the aldehyde at C3H6O, and the aldehyde "
            "gained an oxygen to give the acid at C3H6O2. Each arrow is one step "
            "up in oxidation level at the same carbon, and the reagent decides "
            "whether you take one step or both."
        ),
        try_it_prompt=(
            "You have propan-2-ol and 2-methylpropan-2-ol. Say what each gives "
            "on treatment with chromic acid, and give the molecular formula of "
            "any product."
        ),
        try_it_answer=(
            "Propan-2-ol, a secondary alcohol, oxidises to the ketone propanone, "
            "CH3COCH3, molecular formula C3H6O; it stops there because its "
            "carbinol carbon had a single hydrogen and reaching an acid would "
            "require breaking a carbon-carbon bond. 2-methylpropan-2-ol, a "
            "tertiary alcohol at C4H10O, has no hydrogen on the carbinol carbon "
            "and so does not oxidise under these conditions; it is recovered "
            "unchanged. The presence or absence of a hydrogen on the carbon "
            "bearing the hydroxyl is what decides whether oxidation is possible "
            "and how far it can go."
        ),
        pitfall=(
            "The common error is to expect every alcohol to march all the way to "
            "a carboxylic acid, or to forget that a tertiary alcohol has nowhere "
            "to go. The oxidation level of the carbinol carbon is set by how "
            "many hydrogens it carries, and the reaction cannot invent a step "
            "that would break a carbon-carbon bond. Match the alcohol class to "
            "its ceiling first, then let the reagent choose the stopping point "
            "below that ceiling for a primary alcohol, which is the only class "
            "with a genuine choice between aldehyde and acid."
        ),
        claims=(
            Formula(PROPAN_1_OL, "C3H8O", "propan-1-ol, a primary alcohol"),
            Unsaturation(PROPAN_1_OL, 0),
            Formula(PROPANAL, "C3H6O", "propanal, the aldehyde"),
            Unsaturation(PROPANAL, 1, "the carbonyl gained on oxidation"),
            Formula(PROPANOIC_ACID, "C3H6O2", "propanoic acid, the carboxylic acid"),
            Unsaturation(PROPANOIC_ACID, 1),
            Formula(PROPAN_2_OL, "C3H8O", "propan-2-ol, a secondary alcohol"),
            Formula(PROPANONE, "C3H6O", "propanone, the ketone it gives"),
            Formula(TERT_BUTANOL, "C4H10O", "2-methylpropan-2-ol, a tertiary alcohol that resists oxidation"),
            Source(
                "Anhydrous chromium(VI) reagents such as pyridinium "
                "chlorochromate oxidise a primary alcohol to the aldehyde and "
                "stop, while aqueous chromic acid carries it on to the "
                "carboxylic acid; secondary alcohols give ketones and tertiary "
                "alcohols resist. Which reagent stops where is an empirical "
                "outcome not derived from structure here.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.PROTECTING": Lesson(
        node="ORG2.PROTECTING",
        objective=(
            "Explain what a protecting group is for, and describe how a silyl "
            "ether masks an alcohol so an incompatible reaction can run and is "
            "then removed to give the alcohol back."
        ),
        build_on=(
            "The Grignard lesson ended on a problem: a free hydroxyl destroys a "
            "reagent you needed. A protecting group is the standard answer, a "
            "way to switch the hydroxyl off for one step and switch it back on "
            "afterward."
        ),
        core_idea=(
            "Some reactions cannot tolerate a free hydroxyl, either because its "
            "acidic proton quenches a strong base or nucleophile or because the "
            "oxygen itself would react. A protecting group converts the hydroxyl "
            "into an unreactive derivative before the sensitive step, then comes "
            "off under conditions that leave the rest of the molecule alone. "
            "Silyl ethers are the workhorse for alcohols. Treating an alcohol "
            "with a silyl chloride, usually with a mild base to take up the "
            "acid, replaces the hydroxyl hydrogen with a silicon group and gives "
            "an ether from oxygen to silicon. That ether has no acidic proton "
            "left on oxygen, so it survives a Grignard reagent or a strong base "
            "that the free alcohol would have destroyed. Removal uses a reagent "
            "specific to the strong silicon-fluorine bond: a source of fluoride "
            "cleaves the silicon-oxygen bond and returns the alcohol. The value "
            "of a good protecting group is exactly this orthogonality, that it "
            "goes on and comes off under conditions unrelated to the chemistry "
            "you are trying to protect."
        ),
        worked_example=(
            "Protect ethanol as its trimethylsilyl ether. Ethanol, C2H6O, "
            "reacts with trimethylsilyl chloride and a mild base; the hydroxyl "
            "hydrogen is replaced by the trimethylsilyl group, giving "
            "CH3CH2-O-Si(CH3)3, molecular formula C5H14OSi. The oxygen now bears "
            "no hydrogen, so this ether will sit quietly through a step that "
            "needed the acidic proton gone, a Grignard addition elsewhere in a "
            "larger molecule for instance. When that step is finished, treat the "
            "silyl ether with a fluoride source. Fluoride attacks silicon, the "
            "silicon-oxygen bond breaks, and ethanol is regenerated as C2H6O. "
            "The alcohol was hidden for exactly as long as it needed to be and "
            "recovered unchanged, which is the entire job of a protecting group."
        ),
        try_it_prompt=(
            "A molecule has both a free hydroxyl and, elsewhere, a carbonyl you "
            "want to attack with a Grignard reagent. Why does the synthesis need "
            "a protecting group, and what two operations does using a silyl "
            "ether add to the route?"
        ),
        try_it_answer=(
            "The free hydroxyl carries an acidic proton, and a Grignard reagent "
            "is a strong enough base to take that proton and be destroyed before "
            "it can add to the carbonyl, so the intended reaction fails. "
            "Protecting the hydroxyl as a silyl ether removes the acidic proton "
            "for the duration. Using it adds two operations to the route: a "
            "protection step, capping the alcohol with a silyl chloride and a "
            "mild base before the Grignard addition, and a deprotection step, "
            "cleaving the silyl ether with a fluoride source afterward to "
            "recover the alcohol. The carbonyl chemistry runs in between, with "
            "the hydroxyl switched off."
        ),
        pitfall=(
            "The misconception is that a protecting group changes the target "
            "molecule, so that its atoms end up in the product. A protecting "
            "group is scaffolding: it is added and later removed, and a route "
            "that installs one has to account for taking it off again, or the "
            "final structure is wrong. The related trap is choosing a protecting "
            "group whose removal conditions would also damage the rest of the "
            "molecule; the point of the silyl ether and fluoride pairing is that "
            "fluoride does something specific to silicon and leaves ordinary "
            "functional groups untouched."
        ),
        claims=(
            Formula(ETHANOL, "C2H6O", "ethanol, the alcohol to be protected"),
            Formula(TMS_ETHYL_ETHER, "C5H14OSi", "its trimethylsilyl ether"),
            Source(
                "Silyl ethers protect alcohols and are cleaved by fluoride; "
                "their relative robustness increases with the bulk of the "
                "silicon substituents, in the order trimethylsilyl less than "
                "triethylsilyl less than tert-butyldimethylsilyl less than "
                "triisopropylsilyl. The stability ordering and the cleavage "
                "conditions are tabulated experimental facts, not derived here.",
                GREENE,
            ),
        ),
    ),
    "ORG2.PHENOLS": Lesson(
        node="ORG2.PHENOLS",
        objective=(
            "Account for why phenol is far more acidic than an alcohol using the "
            "resonance of its conjugate base, and describe the two electron "
            "oxidation that connects a hydroquinone to a quinone."
        ),
        build_on=(
            "You ranked acidity by how well the conjugate base is stabilised. "
            "Phenol is the case where that principle pays off most dramatically, "
            "because the phenoxide ion has a stabilisation an alkoxide cannot "
            "reach."
        ),
        core_idea=(
            "A phenol is a hydroxyl attached directly to an aromatic ring, and "
            "that connection changes both its acidity and what it can be "
            "oxidised to. Remove the proton and the phenoxide charge does not "
            "stay on oxygen: it delocalises into the ring, with resonance "
            "structures placing negative charge at the ortho and para carbons. "
            "That spreading of charge stabilises the anion in a way no simple "
            "alkoxide enjoys, and it is why phenol is roughly a million times "
            "more acidic than a comparable alcohol in water, near pKa 10 against "
            "near 16. Electron withdrawing groups on the ring, above all at the "
            "para position where resonance can carry charge onto them, stabilise "
            "the phenoxide further and raise the acidity again. The ring also "
            "makes a distinctive oxidation available. A benzene ring carrying two "
            "hydroxyls para to each other, a hydroquinone, gives up two "
            "hydrogens and two electrons to become a para-quinone, a "
            "cyclohexadiene ring with two carbonyls. The change is a two "
            "electron oxidation that is chemically reversible, and it is the "
            "basis for the role such pairs play as biological electron carriers."
        ),
        worked_example=(
            "Oxidise benzene-1,4-diol, the hydroquinone, to 1,4-benzoquinone and "
            "read the structures. Hydroquinone is C6H6O2, an aromatic ring with "
            "four degrees of unsaturation, three ring pi bonds and the ring "
            "itself, carrying two hydroxyls. Oxidation removes the two hydroxyl "
            "hydrogens and two electrons and converts the two carbon-oxygen "
            "single bonds to carbonyls, giving 1,4-benzoquinone, C6H4O2. Count "
            "its unsaturation: the ring, two carbon-carbon double bonds and two "
            "carbonyls come to five degrees, one more than the aromatic diol "
            "had, which is the structural signature of the oxidation. The "
            "product is no longer aromatic; it is a conjugated dienedione. The "
            "reverse reduction restores the aromatic hydroquinone, and the pair "
            "shuttles between the two forms without either ring falling apart."
        ),
        try_it_prompt=(
            "Which is the stronger acid in water, phenol or 4-nitrophenol, and "
            "what feature of the conjugate base decides it?"
        ),
        try_it_answer=(
            "4-nitrophenol is the stronger acid, with an aqueous pKa near 7 "
            "against phenol's near 10. Its conjugate base places negative charge "
            "at the para carbon through resonance, and a nitro group sitting at "
            "that para position is strongly electron withdrawing and accepts "
            "that charge into its own pi system, so the anion is delocalised "
            "onto the nitro oxygens as well as the ring. The extra stabilisation "
            "of the phenoxide is what raises the acidity; the nitro group helps "
            "most from the para position precisely because that is where the "
            "resonance of the phenoxide puts the charge."
        ),
        pitfall=(
            "The trap is filing phenol next to the alcohols and expecting it to "
            "behave like one, feebly acidic and inert to mild oxidation. The "
            "aromatic ring changes both: it delocalises the phenoxide so the "
            "acidity climbs by about six pKa units, and it opens the "
            "hydroquinone to quinone oxidation that an isolated alcohol has no "
            "analogue for. Reading a phenol as a slightly unusual alcohol misses "
            "the chemistry the ring is responsible for."
        ),
        claims=(
            Formula(PHENOL, "C6H6O", "phenol"),
            Unsaturation(PHENOL, 4, "the aromatic ring: one ring plus three pi bonds"),
            Formula(HYDROQUINONE, "C6H6O2", "benzene-1,4-diol, the hydroquinone"),
            Unsaturation(HYDROQUINONE, 4, "still aromatic"),
            Formula(BENZOQUINONE, "C6H4O2", "1,4-benzoquinone"),
            Unsaturation(BENZOQUINONE, 5, "ring, two C=C and two C=O; no longer aromatic"),
            Formula(P_NITROPHENOL, "C6H5NO3", "4-nitrophenol"),
            Source(
                "Approximate aqueous pKa values: phenol about 10, 4-nitrophenol "
                "about 7.1, a simple alcohol about 16. Phenol is roughly six "
                "pKa units more acidic than an alcohol because of resonance "
                "delocalisation of the phenoxide into the ring. These are "
                "measured acidities in water, not derived here.",
                CRC_PKA,
            ),
        ),
    ),
    "ORG2.WILLIAMSON": Lesson(
        node="ORG2.WILLIAMSON",
        objective=(
            "Assemble an ether by the Williamson synthesis, choose which partner "
            "supplies the alkoxide and which the alkyl halide, and explain why a "
            "hindered halide fails."
        ),
        build_on=(
            "You have seen the bimolecular substitution before, a nucleophile "
            "displacing a leaving group with inversion. The Williamson ether "
            "synthesis is that same reaction with an alkoxide as the "
            "nucleophile, so its scope is the scope of a good substitution."
        ),
        core_idea=(
            "The Williamson synthesis makes an ether by reacting an alkoxide "
            "with an alkyl halide. The alkoxide, made by deprotonating an "
            "alcohol with a strong base, is the nucleophile; it attacks the "
            "carbon bearing the halide from the side opposite the leaving group, "
            "displaces the halide, and forms the new carbon-oxygen bond that "
            "joins the two pieces into an ether. Because the bond forms by a "
            "bimolecular substitution at the halide carbon, everything you know "
            "about that reaction applies. A methyl or primary halide reacts "
            "cleanly. A secondary halide reacts sluggishly and gives elimination "
            "as a side reaction. A tertiary halide does not give the ether at "
            "all: the alkoxide is a strong base as well as a nucleophile, and "
            "against a hindered tertiary halide it removes a beta hydrogen and "
            "eliminates to an alkene instead of substituting. This dictates how "
            "to plan an unsymmetrical ether. Split it at one of the two "
            "carbon-oxygen bonds and put the alkoxide on the more hindered side "
            "and the halide on the less hindered side, so the substitution "
            "happens at the carbon that can accept it."
        ),
        worked_example=(
            "Plan tert-butyl methyl ether, (CH3)3C-O-CH3, molecular formula "
            "C5H12O. There are two ways to cut it into an alkoxide and a halide. "
            "One pairs the tert-butyl alkoxide with a methyl halide: the "
            "alkoxide attacks the methyl carbon, which has no beta hydrogens and "
            "no steric bulk, and the substitution is clean. The other pairs "
            "methoxide with a tert-butyl halide: here the alkoxide meets a "
            "hindered tertiary carbon, acts as a base, removes a beta hydrogen "
            "and gives 2-methylpropene by elimination rather than the ether. "
            "Only the first plan works. The alkoxide involved is a charged "
            "species; the tert-butoxide from the alcohol carries the formula of "
            "its neutral alcohol minus a proton, and its role is to attack the "
            "methyl halide. The lesson of the split is general: send the "
            "substitution to the methyl or primary carbon and let the more "
            "hindered partner be the alkoxide."
        ),
        try_it_prompt=(
            "You want diethyl ether, CH3CH2-O-CH2CH3. Name the alkoxide and the "
            "alkyl halide you would combine, give the ether's molecular formula, "
            "and say why the choice of partners is straightforward here."
        ),
        try_it_answer=(
            "Combine ethoxide, CH3CH2O minus, with bromoethane, CH3CH2Br; the "
            "ethoxide displaces bromide from the primary carbon of bromoethane "
            "to give diethyl ether, C4H10O. The choice is straightforward "
            "because the ether is symmetrical: both carbon-oxygen bonds are to "
            "ethyl groups, so whichever way you split it you get an ethoxide and "
            "a primary ethyl halide, and a primary halide is a good substrate "
            "for the substitution. The difficulty only arises for unsymmetrical "
            "ethers, where one split sends the reaction to a hindered carbon and "
            "the other does not."
        ),
        pitfall=(
            "The mistake is treating the two carbon-oxygen bonds of an "
            "unsymmetrical ether as interchangeable and reaching for whichever "
            "alkoxide and halide come to mind. One split can put the halide on a "
            "tertiary carbon, where the alkoxide eliminates instead of "
            "substituting and no ether forms. The reaction is a bimolecular "
            "substitution, so its substrate preference is methyl and primary "
            "over secondary, and tertiary not at all. Choose the split that "
            "hands the substitution the carbon it can use."
        ),
        claims=(
            Formula(MTBE, "C5H12O", "tert-butyl methyl ether"),
            Formula(DIETHYL_ETHER, "C4H10O", "diethyl ether"),
            Formula(ETHYL_METHYL_ETHER, "C3H8O", "ethyl methyl ether"),
            Formula(BROMOETHANE, "C2H5Br", "bromoethane, a primary halide partner"),
            Formula(ETHOXIDE, "C2H5O-", "ethoxide, the charged nucleophile"),
            Source(
                "The Williamson synthesis is a bimolecular substitution, so it "
                "runs well on methyl and primary halides, poorly on secondary "
                "halides with elimination competing, and not at all on tertiary "
                "halides, where the alkoxide eliminates. This substrate ordering "
                "is the empirical behaviour of the substitution and is not "
                "derived from structure here.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.EPOXIDE": Lesson(
        node="ORG2.EPOXIDE",
        objective=(
            "Predict which carbon of an epoxide a nucleophile attacks under "
            "acidic versus basic conditions, and work out the stereochemistry of "
            "the diol an anti ring opening produces, including whether it is "
            "chiral or meso."
        ),
        build_on=(
            "You know a strained ring stores energy and that a bimolecular "
            "substitution goes with inversion at the carbon attacked. An epoxide "
            "is a three membered ring holding both features at once, which is "
            "why its opening is the most information rich reaction in this unit."
        ),
        core_idea=(
            "An epoxide is a three membered ring of two carbons and an oxygen, "
            "made by delivering an oxygen to an alkene, most often with a "
            "peroxyacid. That delivery is a syn addition to one face of the "
            "double bond, and it is stereospecific: a cis alkene gives a cis "
            "epoxide and a trans alkene gives a trans one, so the geometry of "
            "the starting alkene is written into the product. The ring is "
            "strained, and a nucleophile opens it by attacking a carbon from the "
            "face opposite the oxygen, an anti opening that inverts the carbon "
            "attacked. Two things then have to be predicted separately, and "
            "students conflate them. The first is regiochemistry, which carbon "
            "is attacked. Under basic conditions a strong nucleophile attacks the "
            "less hindered, less substituted carbon, the ordinary preference of "
            "a bimolecular substitution. Under acidic conditions the ring oxygen "
            "is protonated first, positive charge builds on the more substituted "
            "carbon because it stabilises charge better, and the nucleophile is "
            "drawn there instead, to the more substituted carbon. Acid and base "
            "attack opposite carbons. The second is stereochemistry: the anti "
            "opening sets the relationship of the two new substituents to trans "
            "across the former ring, and whether that trans product is one chiral "
            "compound as a racemate or a single meso compound depends on the "
            "molecule's symmetry, which has to be worked out and not guessed."
        ),
        worked_example=(
            "Open cyclohexene oxide, C1CCC2OC2C1, with water and count the "
            "stereochemistry. Cyclohexene oxide is C6H10O with two rings, the "
            "six membered carbon ring and the epoxide, and it is achiral: a "
            "mirror plane runs through it. Water attacks one ring carbon from "
            "the face opposite the oxygen, and the oxygen leaves on the other "
            "carbon as a hydroxyl, so the two hydroxyls of the product end up on "
            "opposite faces of the ring, trans to each other. That trans "
            "1,2-cyclohexanediol has two stereocentres, and reading its "
            "descriptors back from the structure gives (R,R) for one and (S,S) "
            "for the reflected drawing; the two are enantiomers, so the trans "
            "diol is chiral and is formed as a racemate. Contrast this with the "
            "cis 1,2-cyclohexanediol, whose two hydroxyls sit on the same face: "
            "that one has an internal mirror plane and is a single meso "
            "compound, achiral, its (R,S) and (S,R) drawings naming one "
            "molecule. Anti opening of the achiral epoxide gives the chiral "
            "trans diol, not the meso cis diol, and getting that backwards is "
            "the error this reaction is famous for."
        ),
        try_it_prompt=(
            "2,2-dimethyloxirane has one ring carbon bearing two methyls and the "
            "other bearing two hydrogens. Methanol opens it. Under basic "
            "conditions the methoxide attacks one carbon; under acidic "
            "conditions the protonated epoxide is attacked at the other. Which "
            "carbon is attacked in each case, and where does the new methoxy "
            "group end up?"
        ),
        try_it_answer=(
            "Under basic conditions methoxide attacks the less hindered carbon, "
            "the CH2, in the ordinary preference of a bimolecular substitution "
            "for the less substituted centre; the methoxy group ends up on that "
            "CH2 and the hydroxyl on the more substituted carbon, giving "
            "1-methoxy-2-methylpropan-2-ol. Under acidic conditions the oxygen "
            "is protonated first and positive charge builds on the more "
            "substituted carbon, the one bearing two methyls, so the nucleophile "
            "is drawn there; the methoxy group ends up on the more substituted "
            "carbon and the hydroxyl on the CH2, giving "
            "2-methoxy-2-methylpropan-1-ol. Acid and base put the incoming group "
            "on opposite carbons, and the two products are constitutional "
            "isomers of the same formula, C5H12O2."
        ),
        pitfall=(
            "Two errors sit here. The first is deciding regiochemistry once and "
            "for all: base attacks the less substituted carbon, but acid attacks "
            "the more substituted one, and treating the epoxide like a plain "
            "substitution under both conditions gets the acidic case wrong. The "
            "second is naming the diol stereochemistry from intuition. Anti "
            "opening gives the trans diol, and whether the trans diol is chiral "
            "or meso is a fact about the specific molecule's symmetry: for "
            "cyclohexene oxide the trans diol is the chiral one and the cis diol "
            "is the meso one, which is the reverse of the guess many make. Work "
            "the descriptors and the mirror plane out rather than trusting that "
            "trans means one thing and cis another across all molecules."
        ),
        claims=(
            Formula(CYCLOHEXENE_OXIDE, "C6H10O", "cyclohexene oxide"),
            Unsaturation(CYCLOHEXENE_OXIDE, 2, "the carbon ring and the epoxide ring"),
            Stereo(TRANS_CHD_RR, ("R", "R"), "trans-1,2-cyclohexanediol, one enantiomer"),
            Stereo(TRANS_CHD_SS, ("S", "S"), "its mirror image"),
            Relationship(
                TRANS_CHD_RR, TRANS_CHD_SS, "enantiomers",
                "the trans diol from anti opening is chiral, formed as a racemate",
            ),
            Relationship(
                CIS_CHD, CIS_CHD_MIRROR, "identical",
                "the cis diol is meso: its two drawings name one achiral compound",
            ),
            Relationship(
                TRANS_CHD_RR, CIS_CHD, "diastereomers",
                "trans and cis diols share a constitution and differ in configuration",
            ),
            Formula(TRANS_CHD_RR, "C6H12O2", "1,2-cyclohexanediol"),
            Formula(DIMETHYLOXIRANE, "C4H8O", "2,2-dimethyloxirane"),
            Formula(OPEN_BASE, "C5H12O2", "1-methoxy-2-methylpropan-2-ol, from basic opening"),
            Formula(OPEN_ACID, "C5H12O2", "2-methoxy-2-methylpropan-1-ol, from acidic opening"),
            Relationship(
                OPEN_BASE, OPEN_ACID, "constitutional",
                "acid and base open at opposite carbons, giving isomeric products",
            ),
            Relationship(
                TRANS_BUTENE_OXIDE_RR, TRANS_BUTENE_OXIDE_SS, "enantiomers",
                "trans-2-butene gives the chiral trans epoxide, a racemate",
            ),
            Relationship(
                CIS_BUTENE_OXIDE, CIS_BUTENE_OXIDE_MIRROR, "identical",
                "cis-2-butene gives the meso epoxide, one achiral compound",
            ),
            Source(
                "Epoxidation of an alkene by a peroxyacid is a syn, "
                "stereospecific addition, and acid catalysed opening directs the "
                "nucleophile to the more substituted carbon while basic opening "
                "directs it to the less substituted carbon. The regiochemical "
                "and stereospecific outcomes are established experimental "
                "behaviour; the stereochemical relationships of the products, by "
                "contrast, are derived from structure in the claims above.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.THIOLS": Lesson(
        node="ORG2.THIOLS",
        objective=(
            "Contrast a thiol with the matching alcohol on acidity, "
            "nucleophilicity and hydrogen bonding, and describe how thiols and "
            "sulfides form and how thiols oxidise to disulfides."
        ),
        build_on=(
            "A thiol is an alcohol with sulfur in place of oxygen, and a sulfide "
            "is an ether with the same swap. Sulfur sits below oxygen in the "
            "same group, so the comparison is a clean test of what moving one "
            "row down the periodic table does."
        ),
        core_idea=(
            "Sulfur is larger and more polarisable than oxygen and holds its "
            "bonding electrons more loosely, and three properties of thiols and "
            "sulfides follow from that. First, acidity: the sulfur-hydrogen bond "
            "is weaker than the oxygen-hydrogen bond and the resulting thiolate "
            "spreads its charge over a larger, more polarisable atom, so a thiol "
            "is a stronger acid than the matching alcohol, by several pKa units. "
            "Second, nucleophilicity: the loosely held, polarisable electrons of "
            "sulfur make thiols and thiolates strong nucleophiles, ahead of "
            "their oxygen counterparts in the reactions substitution governs, so "
            "a thiolate displaces a halide readily to give a sulfide in a sulfur "
            "version of the Williamson synthesis. Third, hydrogen bonding: the "
            "sulfur-hydrogen bond is far less polar than oxygen-hydrogen, so "
            "thiols are weak hydrogen bond donors and boil below the "
            "corresponding alcohols and carry their notorious smell. One "
            "reaction has no ordinary alcohol analogue. A mild oxidation couples "
            "two thiols into a disulfide, joining them through a new "
            "sulfur-sulfur bond, and a reduction reverses it, a redox pair that "
            "underlies how disulfide bridges form and break in proteins."
        ),
        worked_example=(
            "Compare ethanethiol, CH3CH2SH, with ethanol, CH3CH2OH. Ethanethiol "
            "is C2H6S and ethanol is C2H6O, the same skeleton with sulfur for "
            "oxygen. On acidity, ethanethiol is the stronger acid: its aqueous "
            "pKa is near 10.6 against roughly 16 for ethanol, a difference of "
            "more than five units, because the larger sulfur stabilises the "
            "thiolate charge better than oxygen stabilises the alkoxide. On "
            "nucleophilicity, deprotonating ethanethiol gives ethanethiolate, "
            "CH3CH2S minus, a soft polarisable nucleophile that attacks a "
            "primary alkyl halide fast; treat it with bromoethane and you get "
            "diethyl sulfide, CH3CH2-S-CH2CH3, the sulfur analogue of an ether "
            "built by the Williamson logic. On hydrogen bonding, ethanethiol is "
            "a poor donor and boils below ethanol despite its greater mass, "
            "because the weakly polar sulfur-hydrogen bond forms little hydrogen "
            "bonding in the liquid."
        ),
        try_it_prompt=(
            "Put ethanol and ethanethiol in order of acidity in water and say "
            "why, then name the sulfur-containing product when ethanethiol is "
            "subjected to a mild oxidation."
        ),
        try_it_answer=(
            "Ethanethiol is the more acidic, with an aqueous pKa near 10.6 "
            "against near 16 for ethanol. The reason is the conjugate base: the "
            "thiolate holds its negative charge on a large, polarisable sulfur "
            "that stabilises it better than the smaller oxygen of the alkoxide, "
            "and the sulfur-hydrogen bond is weaker to begin with. A mild "
            "oxidation of ethanethiol couples two molecules through a new "
            "sulfur-sulfur bond to give the disulfide, diethyl disulfide, "
            "CH3CH2-S-S-CH2CH3; the reaction is reversible, and reduction cleaves "
            "the disulfide back to two thiols."
        ),
        pitfall=(
            "The trap is carrying the intuition that oxygen compounds are the "
            "more reactive and assuming an alcohol must be the stronger acid and "
            "the better nucleophile too. It is the other way around on both "
            "counts. The thiol is the stronger acid, because the larger sulfur "
            "stabilises the anion, and the thiolate is the better nucleophile in "
            "substitution, because its electrons are polarisable and loosely "
            "held. The one place oxygen wins is hydrogen bonding, where its "
            "polar bond to hydrogen gives alcohols the higher boiling points and "
            "leaves thiols as weak donors."
        ),
        claims=(
            Formula(ETHANETHIOL, "C2H6S", "ethanethiol"),
            Formula(ETHANOL, "C2H6O", "ethanol, the oxygen analogue"),
            Formula(ETHANETHIOLATE, "C2H5S-", "ethanethiolate, the charged nucleophile"),
            Formula(DIMETHYL_SULFIDE, "C2H6S", "dimethyl sulfide, a representative sulfide"),
            Formula(DIETHYL_DISULFIDE, "C4H10S2", "diethyl disulfide, the oxidation product"),
            Source(
                "Approximate aqueous pKa values: ethanethiol about 10.6, ethanol "
                "about 16, so a thiol is more acidic than the matching alcohol "
                "by more than five units. These are measured acidities in water "
                "and are not derived from structure here.",
                CRC_PKA,
            ),
            Source(
                "Thiols and thiolates are stronger nucleophiles than their "
                "oxygen counterparts and weaker hydrogen bond donors, and thiols "
                "couple to disulfides under mild oxidation; these comparative "
                "trends follow the greater size and polarisability of sulfur and "
                "are treated as established rather than derived here.",
                CLAYDEN,
            ),
        ),
    ),
}

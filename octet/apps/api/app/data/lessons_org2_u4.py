"""ORG2 Unit 4: Alcohols, Ethers and Epoxides.

Ten nodes covering the alcohol as a functional group and its acidity, the three
main ways to make one (reduction, organometallic addition, substitution), its
oxidation levels, protecting-group strategy, the enhanced chemistry of phenols,
and the ether family including the epoxide, whose strained ring makes it the one
ether that opens readily.

Every structural fact below was derived with RDKit before it was written into a
claim. The oxidation and reduction lessons lean on formula arithmetic: moving
between an alcohol and a carbonyl is a gain or loss of two hydrogens, and the
degree of unsaturation is what makes that visible and checkable. The one place
this file is genuinely dangerous is the epoxide-opening lesson, where the cis
and trans 1,2-diols are easy to invert. Their stereochemistry was not written
from intuition: the stereoisomers of 1,2-cyclohexanediol were enumerated with
RDKit and their descriptors read back, which is how the file states, correctly,
that the cis diol is a meso compound and the trans diol is a chiral pair, and
that anti opening of the epoxide gives the trans one.

Reaction outcomes that cannot be derived from structure, reagent selectivity,
regiochemistry, pKa values, carry a citation rather than a verification.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Stereo, Unsaturation
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once. Every formula, degree of unsaturation, environment
# ratio and stereo descriptor below was read back out of RDKit for the exact
# SMILES written here; the diol stereochemistry in particular was enumerated
# rather than reasoned about by hand, because the ring cis/trans assignment is
# the classic place this content is wrong.
# ---------------------------------------------------------------------------

METHANOL = "CO"
ETHANOL = "CCO"
TRIFLUOROETHANOL = "OCC(F)(F)F"  # 2,2,2-trifluoroethanol
ACETALDEHYDE = "CC=O"
ACETONE = "CC(C)=O"
ISOPROPANOL = "CC(C)O"  # propan-2-ol
TERT_BUTANOL = "CC(C)(C)O"  # 2-methylpropan-2-ol
ACETIC_ACID = "CC(=O)O"
BUTAN_2_OL = "CCC(C)O"
BUT_1_ENE = "C=CCC"
BUT_2_ENE = "CC=CC"
TERT_BUTYL_CHLORIDE = "CC(C)(C)Cl"
TMS_ETHER = "CCO[Si](C)(C)C"  # trimethylsilyl ether of ethanol
PHENOL = "Oc1ccccc1"
HYDROQUINONE = "Oc1ccc(O)cc1"  # benzene-1,4-diol
BENZOQUINONE = "O=C1C=CC(=O)C=C1"  # 1,4-benzoquinone
DIETHYL_ETHER = "CCOCC"
METHYL_PROPYL_ETHER = "CCCOC"
BUTAN_1_OL = "CCCCO"
ETHANETHIOL = "CCS"
DIMETHYL_SULFIDE = "CSC"
CYCLOHEXENE_OXIDE = "C1CCC2OC2C1"  # 1,2-epoxycyclohexane
# The 1,2-cyclohexanediols, enumerated with RDKit and read back. The trans diol
# is a chiral pair (R,R and S,S); the cis diol is meso (R,S), identical to its
# own mirror image. Anti opening of the epoxide gives the trans pair.
TRANS_DIOL_RR = "O[C@@H]1CCCC[C@H]1O"
TRANS_DIOL_SS = "O[C@H]1CCCC[C@@H]1O"
CIS_DIOL_MESO = "O[C@@H]1CCCC[C@@H]1O"
CIS_DIOL_MESO_MIRROR = "O[C@H]1CCCC[C@H]1O"

LESSONS_ORG2_U4 = {
    "ORG2.ALCOHOLPROPS": Lesson(
        node="ORG2.ALCOHOLPROPS",
        objective=(
            "Name simple alcohols, explain why they hydrogen bond, and predict "
            "how a substituent shifts an alcohol's acidity."
        ),
        build_on=(
            "You have met the hydroxyl group in passing. This lesson makes it "
            "the centre of attention: how the O-H bond governs boiling point "
            "through hydrogen bonding, and how the rest of the molecule tunes "
            "how readily that O-H gives up its proton."
        ),
        core_idea=(
            "An alcohol is named by the -ol suffix on the parent chain, "
            "numbered to give the hydroxyl the lowest locant. The O-H group "
            "both donates and accepts hydrogen bonds, which raises boiling "
            "points well above those of comparable hydrocarbons. Acidity is "
            "modest, near that of water, and it is set by how stable the "
            "resulting alkoxide is. Anything that spreads out or pulls in the "
            "alkoxide's negative charge makes the alcohol more acidic. "
            "Electron-withdrawing groups near the oxygen do exactly that by "
            "induction, so they lower the pKa."
        ),
        worked_example=(
            "Compare methanol, CH4O, ethanol, C2H6O, and 2,2,2-trifluoroethanol, "
            "C2H3F3O. All three hydrogen bond and all boil far above the "
            "alkanes of similar mass. On acidity, ethanol sits near a pKa of "
            "16, close to water. Replace the three hydrogens of its methyl with "
            "fluorines to get trifluoroethanol, and the electron-withdrawing "
            "fluorines stabilise the alkoxide by pulling charge away from the "
            "oxygen through the framework, so it is markedly more acidic than "
            "ethanol. The proton count also organises ethanol's structure: its "
            "hydrogens fall into three environments, 3:2:1, for the methyl, the "
            "methylene and the hydroxyl."
        ),
        try_it_prompt=(
            "Trifluoroethanol and ethanol differ only in three hydrogens versus "
            "three fluorines on the far carbon. Why is the fluorinated one the "
            "stronger acid?"
        ),
        try_it_answer=(
            "Because acidity tracks the stability of the alkoxide left after "
            "the proton leaves. The three fluorines are strongly electron-"
            "withdrawing and pull negative charge off the oxygen through the "
            "sigma framework, so the trifluoroethoxide is more stable than "
            "ethoxide. A more stable conjugate base means a stronger acid and a "
            "lower pKa."
        ),
        pitfall=(
            "Ranking alcohol acidity by counting carbons or by molecular size. "
            "Size is not the driver; charge stabilisation of the alkoxide is. A "
            "small alcohol with electron-withdrawing groups can easily be more "
            "acidic than a larger, purely hydrocarbon one."
        ),
        claims=(
            Formula(METHANOL, "CH4O", "methanol"),
            Formula(ETHANOL, "C2H6O", "ethanol"),
            Environments(ETHANOL, (3, 2, 1), "methyl, methylene, hydroxyl"),
            Formula(TRIFLUOROETHANOL, "C2H3F3O", "2,2,2-trifluoroethanol"),
            Source(
                "Ethanol has a pKa near 16, close to water; electron-"
                "withdrawing substituents such as the fluorines of "
                "trifluoroethanol stabilise the alkoxide and lower the pKa, "
                "making the alcohol more acidic.",
                "Clayden, Organic Chemistry, chapter on acidity, basicity and "
                "pKa (alcohols).",
            ),
        ),
    ),
    "ORG2.ALCOHOLREDUCTION": Lesson(
        node="ORG2.ALCOHOLREDUCTION",
        objective=(
            "Choose between sodium borohydride and lithium aluminium hydride to "
            "reduce a carbonyl to an alcohol, and account for the change in "
            "unsaturation."
        ),
        build_on=(
            "You know what an alcohol is. One of the commonest ways to make one "
            "is to add hydride to a carbonyl, and this lesson is about which "
            "hydride reagent to reach for and what it can and cannot touch."
        ),
        core_idea=(
            "A hydride reagent delivers a hydride to the carbonyl carbon, and a "
            "proton source completes the alcohol. An aldehyde becomes a primary "
            "alcohol and a ketone becomes a secondary alcohol. The two common "
            "reagents differ in strength. Sodium borohydride is mild and "
            "chemoselective: it reduces aldehydes and ketones but leaves esters "
            "and carboxylic acids alone. Lithium aluminium hydride is far more "
            "powerful and reduces esters, acids and more, but it is harsh and "
            "reacts violently with water. The transformation is a two-hydrogen "
            "gain, which shows up as a drop of one in the degree of "
            "unsaturation as the carbonyl pi bond disappears."
        ),
        worked_example=(
            "Reduce acetaldehyde, C2H4O, one degree of unsaturation for its "
            "carbonyl. Hydride adds to the carbonyl carbon and workup gives "
            "ethanol, C2H6O, zero degrees of unsaturation: the pi bond is gone "
            "and two hydrogens have been added overall. A ketone behaves the "
            "same way one rung up in substitution. Acetone, C3H6O, is reduced "
            "to propan-2-ol, C3H8O, a secondary alcohol, again a loss of the "
            "one degree of unsaturation. Because both substrates are simple "
            "ketone and aldehyde carbonyls, the mild sodium borohydride is "
            "enough for either."
        ),
        try_it_prompt=(
            "You need to reduce the ketone of a molecule that also contains an "
            "ester, leaving the ester intact. Which hydride reagent, and why?"
        ),
        try_it_answer=(
            "Sodium borohydride. It is mild and chemoselective, reducing the "
            "ketone to a secondary alcohol while leaving the ester untouched. "
            "Lithium aluminium hydride would reduce the ester as well, so it is "
            "the wrong choice when one carbonyl must survive."
        ),
        pitfall=(
            "Treating the two hydride reagents as interchangeable. They are "
            "not: sodium borohydride will not reduce an ester or a carboxylic "
            "acid, and lithium aluminium hydride will, and will also tear apart "
            "any protic solvent. Matching reagent strength to the carbonyl you "
            "want reduced, and to the ones you do not, is the whole decision."
        ),
        claims=(
            Formula(ACETALDEHYDE, "C2H4O", "acetaldehyde"),
            Unsaturation(ACETALDEHYDE, 1, "the carbonyl pi bond"),
            Formula(ETHANOL, "C2H6O", "ethanol, the primary alcohol"),
            Unsaturation(ETHANOL, 0, "carbonyl reduced away; two H gained"),
            Formula(ACETONE, "C3H6O", "acetone"),
            Formula(ISOPROPANOL, "C3H8O", "propan-2-ol, the secondary alcohol"),
            Source(
                "Sodium borohydride reduces aldehydes and ketones but not "
                "esters or carboxylic acids; lithium aluminium hydride reduces "
                "these and more but is far more reactive.",
                "Clayden, Organic Chemistry, chapter on nucleophilic addition "
                "to carbonyls (hydride reduction).",
            ),
        ),
    ),
    "ORG2.ALCOHOLGRIGNARD": Lesson(
        node="ORG2.ALCOHOLGRIGNARD",
        objective=(
            "Predict the alcohol formed when an organometallic adds to a "
            "carbonyl, and explain why the reagent cannot survive an acidic or "
            "protic group in the substrate."
        ),
        build_on=(
            "Hydride reduction adds a hydrogen to a carbonyl. An organometallic "
            "adds a carbon instead, so it builds the carbon skeleton at the "
            "same time as it makes the alcohol, which is why it is so useful in "
            "synthesis."
        ),
        core_idea=(
            "A Grignard reagent carries a carbon that behaves as a "
            "nucleophile, effectively carbanion-like, and it adds to a carbonyl "
            "carbon to form a new carbon-carbon bond. What you get depends on "
            "the carbonyl: formaldehyde gives a primary alcohol, another "
            "aldehyde gives a secondary alcohol, and a ketone gives a tertiary "
            "alcohol. The same property that makes the reagent a strong "
            "nucleophile also makes it a strong base, so it cannot coexist with "
            "an O-H, N-H or any acidic proton; those would simply protonate and "
            "destroy it before it reached the carbonyl."
        ),
        worked_example=(
            "Add a methyl Grignard to acetone, C3H6O. The methyl carbon bonds "
            "to the carbonyl carbon, making a new carbon-carbon bond, and "
            "workup gives 2-methylpropan-2-ol, C4H10O, a tertiary alcohol. The "
            "carbon count went from three to four: the reagent supplied a "
            "carbon, which hydride reduction never does. That product is "
            "unusually symmetric, its ten hydrogens falling into two "
            "environments, 9:1, for the three equivalent methyls and the "
            "hydroxyl. Had the carbonyl been an aldehyde instead, the same "
            "reagent would have delivered a secondary alcohol such as "
            "propan-2-ol, C3H8O."
        ),
        try_it_prompt=(
            "Why does adding a Grignard reagent to a molecule that already "
            "contains a free hydroxyl group fail before it even reaches the "
            "carbonyl?"
        ),
        try_it_answer=(
            "Because the Grignard reagent is a very strong base as well as a "
            "nucleophile. The free hydroxyl's O-H proton is acidic enough to "
            "protonate the reagent on contact, quenching it to an alkane and "
            "consuming it before any addition to the carbonyl can happen. The "
            "hydroxyl has to be protected or absent first."
        ),
        pitfall=(
            "Forgetting that the reagent is destroyed by acidic protons in the "
            "substrate itself, not just in the solvent. A hydroxyl, a "
            "carboxylic acid or a terminal alkyne C-H anywhere in the molecule "
            "will quench the Grignard, so those groups must be masked before "
            "the addition."
        ),
        claims=(
            Formula(ACETONE, "C3H6O", "acetone, a ketone"),
            Formula(TERT_BUTANOL, "C4H10O", "2-methylpropan-2-ol, a 3rd alcohol"),
            Environments(
                TERT_BUTANOL, (9, 1),
                "three equivalent methyls and the hydroxyl",
            ),
            Formula(ISOPROPANOL, "C3H8O", "propan-2-ol, from an aldehyde"),
            Source(
                "Organometallic addition gives a primary alcohol from "
                "formaldehyde, a secondary alcohol from other aldehydes and a "
                "tertiary alcohol from ketones; the reagent is a strong base "
                "and is destroyed by acidic O-H, N-H or terminal alkyne "
                "protons.",
                "Clayden, Organic Chemistry, chapter on organometallic "
                "reagents (Grignard addition to carbonyls).",
            ),
        ),
    ),
    "ORG2.ALCOHOLSUB": Lesson(
        node="ORG2.ALCOHOLSUB",
        objective=(
            "Convert an alcohol into an alkyl halide or an alkene, explaining "
            "why the hydroxyl must first be turned into a good leaving group "
            "and which alkene predominates on dehydration."
        ),
        build_on=(
            "You can make alcohols several ways. Now you use them: an alcohol "
            "is a handle for substitution and elimination, but only after you "
            "deal with the fact that hydroxide is a poor leaving group."
        ),
        core_idea=(
            "The hydroxyl oxygen holds its electrons too tightly to leave as "
            "hydroxide, so the alcohol must be activated. Protonation by a "
            "strong acid, or conversion with reagents such as thionyl chloride "
            "or phosphorus tribromide, turns the hydroxyl into a leaving group "
            "that will depart. Substitution then gives an alkyl halide, by an "
            "SN1 path for tertiary substrates and an SN2 path for primary ones. "
            "Under acid and heat, elimination competes and dehydrates the "
            "alcohol to an alkene; when more than one alkene is possible, the "
            "more substituted one usually predominates, which is Zaitsev's "
            "rule."
        ),
        worked_example=(
            "Dehydrate butan-2-ol, C4H10O. Losing water can give the double "
            "bond toward the methyl end, but-1-ene, C4H8, or toward the middle, "
            "but-2-ene, C4H8. These two products are constitutional isomers: "
            "same formula, double bond in a different place, and each has one "
            "degree of unsaturation for its single pi bond. But-2-ene is the "
            "more substituted alkene, so by Zaitsev it predominates. For "
            "substitution instead of elimination, take a tertiary alcohol like "
            "2-methylpropan-2-ol and treat it with hydrogen chloride: the "
            "hydroxyl is protonated and leaves, and chloride captures the "
            "tertiary cation to give 2-chloro-2-methylpropane, C4H9Cl."
        ),
        try_it_prompt=(
            "Acid-catalysed dehydration of butan-2-ol can give but-1-ene or "
            "but-2-ene. Which is the major product, and what rule names the "
            "reason?"
        ),
        try_it_answer=(
            "But-2-ene is the major product. It is the more substituted alkene, "
            "with alkyl groups on both double-bond carbons, so it is more "
            "stable than the terminal but-1-ene. Zaitsev's rule states that the "
            "more substituted alkene predominates in this kind of elimination."
        ),
        pitfall=(
            "Trying to displace or eliminate hydroxide directly from a neutral "
            "alcohol. Hydroxide is too poor a leaving group for that; nothing "
            "happens until the hydroxyl is protonated or converted into a "
            "halide or sulfonate. Activate the leaving group first, then do the "
            "substitution or elimination."
        ),
        claims=(
            Formula(BUTAN_2_OL, "C4H10O", "butan-2-ol, the substrate"),
            Formula(BUT_1_ENE, "C4H8", "but-1-ene, the less substituted alkene"),
            Unsaturation(BUT_1_ENE, 1, "one double bond"),
            Formula(BUT_2_ENE, "C4H8", "but-2-ene, the Zaitsev product"),
            Unsaturation(BUT_2_ENE, 1, "one double bond"),
            Relationship(
                BUT_1_ENE, BUT_2_ENE, "constitutional",
                "same formula, double bond in a different position",
            ),
            Formula(TERT_BUTYL_CHLORIDE, "C4H9Cl", "2-chloro-2-methylpropane"),
            Source(
                "Dehydration follows Zaitsev, giving mainly the more "
                "substituted alkene; substitution goes SN1 for tertiary and SN2 "
                "for primary substrates, and reagents such as thionyl chloride "
                "or phosphorus tribromide convert the hydroxyl to a good "
                "leaving group.",
                "Clayden, Organic Chemistry, chapters on substitution and on "
                "elimination reactions.",
            ),
        ),
    ),
    "ORG2.OXIDATION": Lesson(
        node="ORG2.OXIDATION",
        objective=(
            "Predict the oxidation product of a primary, secondary or tertiary "
            "alcohol, and choose a reagent that stops at the aldehyde rather "
            "than running on to the acid."
        ),
        build_on=(
            "Reduction and organometallic addition moved down the oxidation "
            "ladder to alcohols. Oxidation moves back up it, and the substrate's "
            "class decides how far up it can go."
        ),
        core_idea=(
            "Oxidation removes hydrogens from the carbon bearing the hydroxyl. "
            "A primary alcohol is oxidised first to an aldehyde and then, under "
            "stronger conditions, to a carboxylic acid. A secondary alcohol is "
            "oxidised to a ketone and stops there, having no further hydrogen "
            "on that carbon to lose. A tertiary alcohol has no hydrogen on the "
            "carbinol carbon at all, so it is not oxidised under these "
            "conditions. Reagent choice controls the primary case: a mild "
            "oxidant such as pyridinium chlorochromate stops at the aldehyde, "
            "while a strong aqueous oxidant carries on to the acid."
        ),
        worked_example=(
            "Climb the ladder from ethanol, C2H6O, zero degrees of "
            "unsaturation. A mild oxidant removes two hydrogens to give "
            "acetaldehyde, C2H4O, now one degree of unsaturation for the new "
            "carbonyl. A stronger oxidant carries on to acetic acid, C2H4O2, "
            "still one degree of unsaturation because the carbon simply gains "
            "an oxygen rather than another pi bond. A secondary alcohol goes "
            "one step and stops: propan-2-ol, C3H8O, oxidises to acetone, "
            "C3H6O, one degree of unsaturation, with no aldehyde-to-acid "
            "continuation available."
        ),
        try_it_prompt=(
            "You need the aldehyde from a primary alcohol, not the carboxylic "
            "acid. What determines whether you get one or the other?"
        ),
        try_it_answer=(
            "The oxidant. A mild reagent such as pyridinium chlorochromate "
            "stops cleanly at the aldehyde, whereas a strong aqueous oxidant "
            "oxidises the aldehyde on through to the carboxylic acid. The "
            "substrate is the same; the reagent decides where the oxidation "
            "stops."
        ),
        pitfall=(
            "Expecting a tertiary alcohol to oxidise to something, by analogy "
            "with primary and secondary ones. It does not, under normal "
            "oxidation: the carbinol carbon has no hydrogen to remove, so there "
            "is no carbonyl to form. Only alcohols with a hydrogen on the "
            "hydroxyl-bearing carbon are oxidised this way."
        ),
        claims=(
            Formula(ETHANOL, "C2H6O", "ethanol, a primary alcohol"),
            Unsaturation(ETHANOL, 0, "no pi bonds"),
            Formula(ACETALDEHYDE, "C2H4O", "acetaldehyde, the aldehyde"),
            Unsaturation(ACETALDEHYDE, 1, "one carbonyl; two H removed"),
            Formula(ACETIC_ACID, "C2H4O2", "acetic acid, the carboxylic acid"),
            Unsaturation(ACETIC_ACID, 1, "still one carbonyl; an O was added"),
            Formula(ISOPROPANOL, "C3H8O", "propan-2-ol, a secondary alcohol"),
            Formula(ACETONE, "C3H6O", "acetone, the ketone"),
            Unsaturation(ACETONE, 1, "one carbonyl, and it stops here"),
            Source(
                "Pyridinium chlorochromate stops a primary alcohol at the "
                "aldehyde while strong aqueous oxidants give the carboxylic "
                "acid; secondary alcohols give ketones and tertiary alcohols "
                "are not oxidised.",
                "Carey and Sundberg, Advanced Organic Chemistry, Part B, "
                "chapter on oxidation of alcohols.",
            ),
        ),
    ),
    "ORG2.PROTECTING": Lesson(
        node="ORG2.PROTECTING",
        objective=(
            "Explain why a synthesis sometimes masks an alcohol as a silyl "
            "ether, and describe how the group is installed and removed without "
            "disturbing the rest of the molecule."
        ),
        build_on=(
            "You saw in the Grignard lesson that a free hydroxyl destroys an "
            "organometallic reagent. A protecting group is the general answer "
            "to a reactive group getting in the way of a step elsewhere in the "
            "molecule."
        ),
        core_idea=(
            "A protecting group temporarily converts a reactive functional "
            "group into an inert one, so a reaction can be run elsewhere, and "
            "is then removed to give the original group back. For alcohols the "
            "workhorse is the silyl ether: the hydroxyl is capped with a "
            "trialkylsilyl group using a silyl chloride and a base. The capped "
            "oxygen has no acidic proton and no nucleophilic lone pair to spare, "
            "so it stays out of the way, and a Grignard or other base-sensitive "
            "step can proceed. Removal is orthogonal to most other chemistry: "
            "fluoride cleaves the silicon-oxygen bond selectively, because the "
            "silicon-fluorine bond is very strong, unmasking the alcohol."
        ),
        worked_example=(
            "Take ethanol, C2H6O, standing in for the alcohol you need to "
            "protect. Capping its hydroxyl with a trimethylsilyl group gives "
            "the silyl ether, C5H14OSi. That masked oxygen no longer has an "
            "O-H proton to quench a Grignard reagent, so you can now run the "
            "organometallic step that the free alcohol would have ruined. When "
            "the step is done, treatment with a fluoride source cleaves the "
            "silicon-oxygen bond and returns the alcohol, with the rest of the "
            "molecule untouched."
        ),
        try_it_prompt=(
            "Why can a silyl-protected alcohol survive a Grignard reaction that "
            "the free alcohol could not?"
        ),
        try_it_answer=(
            "Because protection replaces the acidic O-H with a silicon-oxygen "
            "bond, so there is no acidic proton left to protonate and destroy "
            "the Grignard reagent. The oxygen is masked for the duration of the "
            "step and unmasked afterward with fluoride."
        ),
        pitfall=(
            "Thinking of a protecting group as free. Every protection is two "
            "extra steps, installation and removal, and each has to be "
            "selective for the group you mean to mask. It is worth it only when "
            "a reactive group would otherwise wreck a step you cannot run "
            "another way."
        ),
        claims=(
            Formula(ETHANOL, "C2H6O", "the alcohol to be protected"),
            Formula(TMS_ETHER, "C5H14OSi", "its trimethylsilyl ether"),
            Source(
                "Silyl ethers are installed from a silyl chloride and a base "
                "and removed selectively by fluoride, which exploits the "
                "strength of the silicon-fluorine bond; their orthogonal "
                "stability lets base-sensitive steps run on the masked alcohol.",
                "Greene and Wuts, Protective Groups in Organic Synthesis, "
                "chapter on protection for the hydroxyl group (silyl ethers).",
            ),
        ),
    ),
    "ORG2.PHENOLS": Lesson(
        node="ORG2.PHENOLS",
        objective=(
            "Explain why a phenol is much more acidic than an ordinary alcohol, "
            "and describe the oxidation of a hydroquinone to a quinone."
        ),
        build_on=(
            "You know an alcohol's acidity is set by how stable its conjugate "
            "base is. A phenol is an alcohol whose oxygen is attached to a "
            "benzene ring, and that ring changes the answer dramatically."
        ),
        core_idea=(
            "When a phenol loses its proton, the resulting phenoxide is "
            "stabilised because the negative charge is delocalised into the "
            "aromatic ring, spread onto the ortho and para carbons rather than "
            "sitting on oxygen alone. That resonance makes a phenol far more "
            "acidic than an aliphatic alcohol, with a pKa near 10 instead of "
            "near 16. Phenols are also easily oxidised. A benzene ring bearing "
            "two hydroxyl groups para to each other, a hydroquinone, is "
            "oxidised to a quinone, in which two ring carbons become carbonyls "
            "and the ring picks up the character of a conjugated cyclohexadiene-"
            "dione."
        ),
        worked_example=(
            "Phenol itself, C6H6O, has four degrees of unsaturation, all in the "
            "aromatic ring, and its protons fall into four environments, "
            "2:2:1:1, for the two ortho, two meta, one para and the hydroxyl. "
            "Now oxidise the para diol. Hydroquinone, C6H6O2, four degrees of "
            "unsaturation, loses two hydrogens to give 1,4-benzoquinone, "
            "C6H4O2, which reads five degrees of unsaturation: the extra degree "
            "appears because two hydroxyls have become two carbonyls and the "
            "ring is now a conjugated dienedione. The quinone is strikingly "
            "symmetric, its four remaining hydrogens all equivalent in a single "
            "environment."
        ),
        try_it_prompt=(
            "Phenol and cyclohexanol both bear a hydroxyl on a six-membered "
            "ring, yet phenol is far more acidic. What accounts for the "
            "difference?"
        ),
        try_it_answer=(
            "Resonance delocalisation of the conjugate base. Phenoxide's "
            "negative charge is spread into the aromatic ring, onto the ortho "
            "and para carbons, which stabilises it strongly. Cyclohexanol's "
            "alkoxide has no such delocalisation; its charge stays on oxygen. "
            "The better-stabilised phenoxide makes phenol the stronger acid."
        ),
        pitfall=(
            "Grouping phenols with ordinary alcohols and expecting a pKa near "
            "16. The aromatic ring makes a phenol several orders of magnitude "
            "more acidic, near pKa 10, acidic enough to be deprotonated by "
            "aqueous base where an aliphatic alcohol would not be. Treat "
            "phenols as their own, more acidic class."
        ),
        claims=(
            Formula(PHENOL, "C6H6O", "phenol"),
            Unsaturation(PHENOL, 4, "the aromatic ring"),
            Environments(
                PHENOL, (2, 2, 1, 1), "two ortho, two meta, para, hydroxyl",
            ),
            Formula(HYDROQUINONE, "C6H6O2", "hydroquinone, benzene-1,4-diol"),
            Unsaturation(HYDROQUINONE, 4, "still an aromatic ring"),
            Formula(BENZOQUINONE, "C6H4O2", "1,4-benzoquinone"),
            Unsaturation(
                BENZOQUINONE, 5,
                "two carbonyls and two C=C in the conjugated dienedione",
            ),
            Environments(BENZOQUINONE, (4,), "four equivalent vinyl protons"),
            Source(
                "Phenol has a pKa near 10, far more acidic than an aliphatic "
                "alcohol near 16, because the phenoxide charge is delocalised "
                "into the aromatic ring; hydroquinones are oxidised to "
                "quinones.",
                "Clayden, Organic Chemistry, chapter on aromatic chemistry "
                "(phenols).",
            ),
        ),
    ),
    "ORG2.WILLIAMSON": Lesson(
        node="ORG2.WILLIAMSON",
        objective=(
            "Design a Williamson ether synthesis as an SN2 reaction, choosing "
            "which partner is the alkoxide and which the halide, and recognise "
            "the substrate limits."
        ),
        build_on=(
            "You can deprotonate an alcohol to an alkoxide and you know SN2 "
            "prefers unhindered carbons. The Williamson synthesis is those two "
            "facts put together to make an ether."
        ),
        core_idea=(
            "An alkoxide is a good nucleophile, and in the Williamson synthesis "
            "it displaces a halide from an alkyl halide by SN2 to form an "
            "ether. Because the step is SN2, the halide partner must be "
            "unhindered, ideally primary; a hindered halide gives elimination "
            "instead of the ether. For an unsymmetrical ether there are often "
            "two conceivable pairings of alkoxide and halide, and the right "
            "choice is the one that puts the SN2 attack on the less hindered "
            "carbon. Ethers are otherwise unreactive, but strong acids such as "
            "hydrogen iodide can cleave them."
        ),
        worked_example=(
            "Build methyl propyl ether, C4H10O. Two routes reach it: methoxide "
            "plus 1-bromopropane, or propoxide plus iodomethane. Both are "
            "SN2 on a primary carbon, so both work, and they give the same "
            "ether. Note how ethers relate by constitution. Methyl propyl "
            "ether and diethyl ether, C4H10O, are constitutional isomers, same "
            "formula, oxygen flanked by different groups; diethyl ether is the "
            "symmetric one, its ten hydrogens in two environments, 6:4. And "
            "butan-1-ol, C4H10O, shares that formula too, a constitutional "
            "isomer of both ethers in which the oxygen is an alcohol rather "
            "than an ether."
        ),
        try_it_prompt=(
            "You want tert-butyl methyl ether. Should you combine tert-butoxide "
            "with iodomethane, or methoxide with 2-chloro-2-methylpropane? Why?"
        ),
        try_it_answer=(
            "Tert-butoxide with iodomethane. The SN2 step must attack the less "
            "hindered carbon, and iodomethane is primary, in fact "
            "unhindered. The other pairing would need SN2 on the tertiary "
            "carbon of the tert-butyl halide, which does not undergo SN2 and "
            "instead eliminates, giving an alkene rather than the ether."
        ),
        pitfall=(
            "Choosing the more hindered partner as the halide because it looks "
            "symmetric on paper. The Williamson step is SN2, so a tertiary or "
            "otherwise crowded halide gives elimination, not the ether. Always "
            "let the alkoxide attack the least hindered carbon."
        ),
        claims=(
            Formula(DIETHYL_ETHER, "C4H10O", "diethyl ether, the symmetric one"),
            Environments(DIETHYL_ETHER, (6, 4), "two methyls and two methylenes"),
            Formula(METHYL_PROPYL_ETHER, "C4H10O", "methyl propyl ether"),
            Relationship(
                DIETHYL_ETHER, METHYL_PROPYL_ETHER, "constitutional",
                "same formula, oxygen between different groups",
            ),
            Formula(BUTAN_1_OL, "C4H10O", "butan-1-ol"),
            Relationship(
                DIETHYL_ETHER, BUTAN_1_OL, "constitutional",
                "an alcohol isomeric with the ethers",
            ),
            Source(
                "The Williamson synthesis is an SN2 reaction of an alkoxide "
                "with an alkyl halide, so the halide must be unhindered; "
                "hindered halides eliminate, and ethers are cleaved by strong "
                "acids such as hydrogen iodide.",
                "Clayden, Organic Chemistry, chapter on substitution reactions "
                "(ether synthesis).",
            ),
        ),
    ),
    "ORG2.EPOXIDE": Lesson(
        node="ORG2.EPOXIDE",
        objective=(
            "Predict where an epoxide opens under acidic versus basic "
            "conditions, and derive the stereochemistry of the product from "
            "backside attack on the ring."
        ),
        build_on=(
            "An epoxide is a three-membered cyclic ether. Its strained ring "
            "makes it the one ether that opens readily, so the substitution "
            "logic you know for leaving groups applies to it, with a twist in "
            "both regiochemistry and stereochemistry."
        ),
        core_idea=(
            "An epoxide is usually made by oxidising an alkene with a peroxy "
            "acid, which delivers the oxygen to one face. Opening it is a "
            "nucleophilic substitution on a strained ring, and two things must "
            "be predicted. Regiochemistry: under basic conditions the "
            "nucleophile attacks the less hindered carbon, by SN2; under acidic "
            "conditions the ring is protonated first and the nucleophile "
            "attacks the more substituted carbon, which better supports "
            "positive charge. Stereochemistry: the attack comes from the side "
            "opposite the breaking carbon-oxygen bond, backside, so the two "
            "oxygen-bearing groups end up anti to each other, that is trans on "
            "a ring."
        ),
        worked_example=(
            "Open cyclohexene oxide, C6H10O, with water or hydroxide. Backside "
            "attack on one ring carbon puts the incoming oxygen anti to the one "
            "that was in the epoxide, so the product is the trans-1,2-diol. "
            "That trans diol, C6H12O2, is a chiral pair: reading the "
            "descriptors back from the structures gives the R,R and the S,S "
            "forms, and they are enantiomers of each other. Contrast the cis "
            "diol, the R,S form, which you would not get this way: it has an "
            "internal mirror plane, so it is a meso compound, identical to its "
            "own mirror image, and it is a diastereomer of the trans pair. Anti "
            "opening is what selects trans over cis."
        ),
        try_it_prompt=(
            "Opening cyclohexene oxide gives a 1,2-cyclohexanediol. Is the "
            "product cis or trans, and is it chiral or meso?"
        ),
        try_it_answer=(
            "Trans, and chiral. The nucleophile attacks the carbon from the "
            "face opposite the carbon-oxygen bond that breaks, so the two "
            "hydroxyls end up anti, giving the trans diol. The trans "
            "1,2-cyclohexanediol is the R,R and S,S enantiomeric pair; the meso "
            "compound is the cis diol, which anti opening does not produce."
        ),
        pitfall=(
            "Inverting the ring assignment and calling the trans diol meso. It "
            "is the cis 1,2-cyclohexanediol that is meso, with an internal "
            "mirror plane; the trans diol is the chiral R,R/S,S pair. The "
            "reliable way to settle it is to enumerate the stereoisomers and "
            "read the descriptors, not to eyeball which one looks symmetric."
        ),
        claims=(
            Formula(CYCLOHEXENE_OXIDE, "C6H10O", "cyclohexene oxide"),
            Unsaturation(CYCLOHEXENE_OXIDE, 2, "the six-ring plus the epoxide ring"),
            Formula(TRANS_DIOL_RR, "C6H12O2", "trans-1,2-cyclohexanediol"),
            Stereo(TRANS_DIOL_RR, ("R", "R"), "one enantiomer of the trans diol"),
            Stereo(TRANS_DIOL_SS, ("S", "S"), "its mirror image"),
            Relationship(
                TRANS_DIOL_RR, TRANS_DIOL_SS, "enantiomers",
                "the trans diol is a chiral pair; anti opening gives it",
            ),
            Stereo(CIS_DIOL_MESO, ("R", "S"), "the cis diol, a meso compound"),
            Relationship(
                CIS_DIOL_MESO, CIS_DIOL_MESO_MIRROR, "identical",
                "meso: R,S and S,R name one achiral molecule",
            ),
            Relationship(
                TRANS_DIOL_RR, CIS_DIOL_MESO, "diastereomers",
                "trans versus cis, not mirror images",
            ),
            Source(
                "Basic conditions open the epoxide at the less hindered carbon "
                "by SN2; acidic conditions protonate first and open at the more "
                "substituted carbon. The stereochemistry of anti (trans) "
                "opening is derived here from backside attack.",
                "Clayden, Organic Chemistry, chapter on epoxide ring opening.",
            ),
        ),
    ),
    "ORG2.THIOLS": Lesson(
        node="ORG2.THIOLS",
        objective=(
            "Relate thiols and sulfides to alcohols and ethers, and account for "
            "their stronger acidity, weaker hydrogen bonding and greater "
            "nucleophilicity."
        ),
        build_on=(
            "Thiols and sulfides are the sulfur analogues of alcohols and "
            "ethers: swap oxygen for the larger, more polarisable sulfur, and "
            "the family resemblance holds while several properties shift in a "
            "predictable direction."
        ),
        core_idea=(
            "Sulfur sits below oxygen, so it is larger, more polarisable and "
            "less electronegative. A thiol, R-SH, is more acidic than the "
            "corresponding alcohol, with a pKa near 10 rather than 16, because "
            "the larger sulfur spreads the negative charge of the thiolate more "
            "effectively. Thiols hydrogen bond weakly, so they boil lower than "
            "alcohols of similar size. And the polarisable sulfur makes "
            "thiolates and sulfides excellent, soft nucleophiles, better than "
            "their oxygen counterparts. Thiols also oxidise easily, joining in "
            "pairs to form disulfides, and sulfides, R-S-R, are the ether "
            "analogues made the same SN2 way with a thiolate."
        ),
        worked_example=(
            "Line up the two smallest sulfur compounds. Ethanethiol, C2H6S, is "
            "the thiol; its protons fall into three environments, 3:2:1, for "
            "the methyl, methylene and the S-H, just like ethanol's pattern. "
            "Dimethyl sulfide, C2H6S, is the sulfide; it is symmetric, all six "
            "hydrogens equivalent in a single environment. The two share a "
            "formula but join their atoms differently, so they are "
            "constitutional isomers, exactly as ethanol and dimethyl ether are "
            "in the oxygen series. Both sulfur compounds are better nucleophiles "
            "than the oxygen analogues, and the thiol is the more acidic of the "
            "two toward loss of its S-H proton."
        ),
        try_it_prompt=(
            "Ethanethiol and ethanol differ only in sulfur versus oxygen. Which "
            "is the stronger acid, and which has the higher boiling point?"
        ),
        try_it_answer=(
            "Ethanethiol is the stronger acid, near pKa 10 against ethanol's "
            "16, because the larger sulfur stabilises the thiolate charge "
            "better. Ethanol has the higher boiling point, because oxygen "
            "hydrogen bonds far more strongly than sulfur, and it is that "
            "hydrogen bonding, not molecular mass, that dominates the boiling "
            "point here."
        ),
        pitfall=(
            "Carrying oxygen's strong hydrogen bonding over to sulfur and "
            "expecting thiols to boil high and to be weak acids like alcohols. "
            "Sulfur reverses both: weaker hydrogen bonding means lower boiling "
            "points, and better charge stabilisation means the thiol is the "
            "stronger acid."
        ),
        claims=(
            Formula(ETHANETHIOL, "C2H6S", "ethanethiol, the thiol"),
            Environments(ETHANETHIOL, (3, 2, 1), "methyl, methylene, S-H"),
            Formula(DIMETHYL_SULFIDE, "C2H6S", "dimethyl sulfide, the sulfide"),
            Environments(DIMETHYL_SULFIDE, (6,), "all six protons equivalent"),
            Relationship(
                ETHANETHIOL, DIMETHYL_SULFIDE, "constitutional",
                "same formula, atoms joined differently",
            ),
            Source(
                "Thiols have a pKa near 10, more acidic than alcohols near 16, "
                "hydrogen bond more weakly so boil lower, and are better "
                "nucleophiles; thiols oxidise to disulfides.",
                "Clayden, Organic Chemistry, chapter on sulfur chemistry "
                "(thiols and sulfides).",
            ),
        ),
    ),
}

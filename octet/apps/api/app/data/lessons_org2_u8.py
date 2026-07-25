"""ORG2 Unit 8: Enols, Enolates and Condensations.

The whole unit turns on one idea: the hydrogen on the carbon next to a
carbonyl, the alpha hydrogen, is unusually acidic, because removing it gives an
enolate whose negative charge is shared onto oxygen. That single fact makes the
alpha carbon nucleophilic, and every reaction here, halogenation, alkylation,
the aldol, the Claisen, the Michael, is a way of putting that nucleophilic
carbon to work.

Every structural fact carries a claim that RDKit re-derives when the suite
runs. Keto and enol tautomers are checkable as constitutional isomers; an aldol
that doubles the aldehyde and a condensation that loses water are checkable as
mass balances backed by the molecular formulas of every species; and which
hydrogens are alpha shows up in the proton environments of a carbonyl compound.
Where the equilibrium sits, and the conditions and bases that select one
enolate over another, cannot be derived from a structure and carry a citation
instead. No temperatures, quantities, or preparative procedures appear.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source
from app.data.lesson_types import Lesson

# Named once so a claim and its prose cannot drift apart.
ACETONE = "CC(C)=O"  # C3H6O, the keto form
PROP_1_EN_2_OL = "CC(O)=C"  # C3H6O, its enol tautomer
ACETALDEHYDE = "CC=O"  # C2H4O
ETHENOL = "C=CO"  # C2H4O, vinyl alcohol, the enol of acetaldehyde
BUTAN_2_ONE = "CCC(C)=O"  # C4H8O, two different alpha carbons
CHLOROACETONE = "ClCC(C)=O"  # C3H5ClO, monohalogenation product
DIETHYL_MALONATE = "CCOC(=O)CC(=O)OCC"  # C7H12O4, the malonic ester
MALONIC_ACID = "OC(=O)CC(=O)O"  # C3H4O4, the diacid before decarboxylation
BUTANOIC_ACID = "CCCC(=O)O"  # C4H8O2, a substituted acetic acid product
ETHYL_ACETOACETATE = "CC(=O)CC(=O)OCC"  # C6H10O3, the acetoacetic ester
HYDROXYBUTANAL = "CC(O)CC=O"  # C4H8O2, the aldol from two acetaldehydes
BUT_2_ENAL = "CC=CC=O"  # C4H6O, the enal after dehydration
ETHYL_ACETATE = "CC(=O)OCC"  # C4H8O2, the ester for the Claisen
ETHANOL = "CCO"  # C2H6O, the alkoxide expelled in the Claisen
PENTANE_2_4_DIONE = "CC(=O)CC(=O)C"  # C5H8O2, a Michael donor
MVK = "CC(=O)C=C"  # C4H6O, but-3-en-2-one, a Michael acceptor
MICHAEL_ADDUCT = "CC(=O)C(C(C)=O)CCC(C)=O"  # C9H14O3, the 1,4-addition product
WATER = "O"  # H2O

LESSONS_ORG2_U8 = {
    "ORG2.TAUTOMERISM": Lesson(
        node="ORG2.TAUTOMERISM",
        objective=(
            "Distinguish the keto and enol forms of a carbonyl compound as "
            "constitutional isomers in equilibrium, and state on which side the "
            "equilibrium usually lies."
        ),
        build_on=(
            "You met the enol once already, as the fleeting intermediate when "
            "an alkyne is hydrated to a carbonyl compound. This unit treats the "
            "keto and enol forms as a pair that a carbonyl compound is always "
            "quietly interconverting between."
        ),
        core_idea=(
            "A carbonyl compound with an alpha hydrogen exists in two forms. "
            "The keto form has the carbon oxygen double bond and the alpha "
            "hydrogen on carbon. The enol form has that hydrogen moved to "
            "oxygen and the double bond moved between the two carbons, so it is "
            "an alkene bearing a hydroxyl. These are not resonance structures: "
            "an atom, a hydrogen, has actually changed its position, so the two "
            "forms are different molecules with the same molecular formula, that "
            "is, constitutional isomers, and they interconvert by moving that "
            "proton. Both acid and base catalyse the interconversion. For "
            "simple aldehydes and ketones the equilibrium lies far toward the "
            "keto form, because the carbon oxygen double bond is stronger than "
            "the carbon carbon double bond plus oxygen hydrogen bond of the "
            "enol."
        ),
        worked_example=(
            "Write both tautomers of acetone, C3H6O. The keto form is the "
            "familiar ketone with its carbonyl. Move one alpha hydrogen from "
            "carbon to oxygen and shift the double bond to lie between the two "
            "carbons, and you get prop-1-en-2-ol, C3H6O, the enol. Same "
            "formula, different connectivity: the hydrogen and the double bond "
            "have both relocated, so these are constitutional isomers, not two "
            "drawings of one resonance hybrid. The equilibrium sits far to the "
            "keto side, so at any instant almost all of the sample is acetone "
            "and only a trace is the enol."
        ),
        try_it_prompt=(
            "Acetaldehyde, C2H4O, has an enol tautomer. Write its formula, name "
            "the relationship between the two forms, and say which one "
            "dominates at equilibrium."
        ),
        try_it_answer=(
            "The enol is ethenol, C2H4O, the same formula as acetaldehyde. The "
            "two are constitutional isomers, because a hydrogen has moved from "
            "carbon to oxygen. The keto form, acetaldehyde, dominates the "
            "equilibrium overwhelmingly for a simple aldehyde like this."
        ),
        pitfall=(
            "The single most common error is to draw the keto and enol forms "
            "connected by a double headed resonance arrow. They are not "
            "resonance forms. Resonance moves only electrons and keeps every "
            "atom fixed; tautomerism moves a whole hydrogen atom, so the keto "
            "and enol forms are genuinely different compounds in equilibrium, "
            "joined by the equilibrium arrows."
        ),
        claims=(
            Formula(ACETONE, "C3H6O", "the keto form"),
            Formula(PROP_1_EN_2_OL, "C3H6O", "prop-1-en-2-ol, the enol"),
            Relationship(
                ACETONE, PROP_1_EN_2_OL, "constitutional",
                "keto and enol tautomers move a hydrogen, so they are "
                "constitutional isomers, not resonance forms",
            ),
            Formula(ACETALDEHYDE, "C2H4O", "the keto form"),
            Formula(ETHENOL, "C2H4O", "ethenol, its enol"),
            Relationship(ACETALDEHYDE, ETHENOL, "constitutional"),
            Source(
                "For simple aldehydes and ketones the keto-enol equilibrium "
                "lies far on the side of the keto tautomer, with the enol "
                "typically present well below one part in a thousand.",
                "Clayden, Greeves and Warren, Organic Chemistry, chapter on "
                "enols and enolates.",
            ),
        ),
    ),
    "ORG2.ENOLATE": Lesson(
        node="ORG2.ENOLATE",
        objective=(
            "Identify the alpha hydrogens of a carbonyl compound, explain why "
            "they are acidic, and describe how the choice of base controls "
            "which enolate forms when two alpha positions compete."
        ),
        build_on=(
            "You know the alpha carbon is the one next to the carbonyl, and "
            "that its hydrogen migrates in tautomerism. Removing that hydrogen "
            "with a base, rather than just moving it, gives the reactive "
            "species this whole unit uses."
        ),
        core_idea=(
            "Remove an alpha hydrogen with a base and the electron pair left "
            "behind is not stranded on carbon; it is shared with the carbonyl "
            "oxygen, giving the enolate, an anion delocalised over carbon and "
            "oxygen. That delocalisation is why the alpha hydrogen is far more "
            "acidic than an ordinary carbon hydrogen bond. Only alpha hydrogens "
            "qualify, because only they are positioned for the resulting charge "
            "to reach oxygen. When a molecule has two different alpha positions, "
            "two different enolates are possible, and which one forms depends on "
            "the base and conditions. A large, strong base that removes a proton "
            "quickly and irreversibly tends to take the more accessible alpha "
            "hydrogen and give the less substituted enolate; conditions that let "
            "the enolates equilibrate favour the more substituted, more stable "
            "one. These selectivities are matters of condition, so they are "
            "stated with a citation rather than derived."
        ),
        worked_example=(
            "Look at butan-2-one, C4H8O, CH3CH2COCH3. Its hydrogens fall into "
            "three environments in the ratio 3 to 3 to 2: a methyl on the "
            "carbonyl, a methyl at the far end, and the central methylene. Two "
            "of those environments are alpha, next to the carbonyl: the methyl "
            "directly on the carbonyl, three hydrogens, and the methylene, two "
            "hydrogens. The far methyl is beta and its hydrogens are not "
            "acidic. Because there are two distinct alpha sites, butan-2-one can "
            "form two enolates, and a base is chosen to favour one. Removing a "
            "hydrogen from the methyl side gives the less substituted enolate; "
            "removing one from the methylene side gives the more substituted, "
            "more stable one."
        ),
        try_it_prompt=(
            "In butan-2-one, which hydrogens can a base remove to make an "
            "enolate, and which cannot? Explain using the position of each set "
            "relative to the carbonyl."
        ),
        try_it_answer=(
            "The base can remove hydrogens from the two alpha sites, the methyl "
            "directly on the carbonyl and the central methylene, because the "
            "charge left behind reaches the carbonyl oxygen. It cannot remove "
            "the far methyl's hydrogens; that carbon is beta, one bond too far, "
            "so its anion would not be stabilised by the oxygen."
        ),
        pitfall=(
            "The mistake is to call every hydrogen on the molecule acidic once "
            "you hear the word enolate. Only the alpha hydrogens are; the "
            "acidity comes entirely from delocalising the charge onto the "
            "carbonyl oxygen, which a beta or more distant hydrogen cannot "
            "reach. Count bonds to the carbonyl before deciding a hydrogen is "
            "removable."
        ),
        claims=(
            Formula(BUTAN_2_ONE, "C4H8O", "the ketone with two alpha sites"),
            Environments(
                BUTAN_2_ONE, (3, 3, 2),
                "three environments; the acyl methyl and the methylene are the "
                "two alpha sites, the far methyl is beta",
            ),
            Formula(ACETONE, "C3H6O", "one alpha environment, six equivalent hydrogens"),
            Environments(ACETONE, (6,), "all six alpha hydrogens are equivalent"),
            Source(
                "A strong, hindered, non-nucleophilic base such as lithium "
                "diisopropylamide removes the less hindered alpha proton "
                "essentially irreversibly to give the less substituted, kinetic "
                "enolate, whereas conditions that allow equilibration favour "
                "the more substituted, thermodynamic enolate.",
                "Carey and Sundberg, Advanced Organic Chemistry, Part A, "
                "chapter on enols and enolate ions.",
            ),
        ),
    ),
    "ORG2.ALPHAHALOGEN": Lesson(
        node="ORG2.ALPHAHALOGEN",
        objective=(
            "Explain how a carbonyl compound is halogenated at the alpha carbon "
            "through its enol or enolate, and contrast the single substitution "
            "of acidic conditions with the exhaustive haloform reaction under "
            "base."
        ),
        build_on=(
            "The alpha carbon is nucleophilic, as an enol under acid or as an "
            "enolate under base. A halogen is an electrophile, so the alpha "
            "carbon and a halogen find each other; the conditions decide how "
            "many times."
        ),
        core_idea=(
            "Under acidic conditions the small equilibrium concentration of the "
            "enol reacts with the halogen at the alpha carbon, and the reaction "
            "tends to stop after one substitution, because the electron "
            "withdrawing halogen just installed makes the next enolisation "
            "slower. Under basic conditions the story reverses. Each halogen "
            "added makes the remaining alpha hydrogens more acidic, so the next "
            "enolate forms even faster, and a methyl ketone is halogenated "
            "three times on the same carbon. That trihalomethyl group is then a "
            "good enough leaving group that hydroxide cleaves the molecule, "
            "giving a carboxylate and a haloform such as chloroform or "
            "iodoform. So acid gives controlled single halogenation, and base "
            "on a methyl ketone runs all the way to the haloform."
        ),
        worked_example=(
            "Halogenate acetone, C3H6O, at the alpha carbon under acidic "
            "conditions with chlorine, and the product is chloroacetone, "
            "C3H5ClO: one alpha hydrogen has been replaced by chlorine. The "
            "reaction resists going further because the chlorine already there "
            "withdraws electrons and slows the next enolisation. Put the same "
            "methyl ketone under basic conditions with iodine instead, and all "
            "three hydrogens of one methyl are replaced, then hydroxide cleaves "
            "off the triiodomethyl group as iodoform, CHI3, leaving a "
            "carboxylate. Same alpha reactivity, opposite stopping points."
        ),
        try_it_prompt=(
            "Why does alpha halogenation under acid usually stop after one "
            "halogen, while under base a methyl ketone takes three on the same "
            "carbon?"
        ),
        try_it_answer=(
            "Under acid, the first halogen withdraws electron density and slows "
            "formation of the next enol, so the reaction stalls after one. "
            "Under base, each halogen makes the remaining alpha hydrogens more "
            "acidic, so the next enolate forms faster, and the substitutions "
            "accelerate until the carbon carries three."
        ),
        pitfall=(
            "The trap is to expect acidic and basic halogenation to differ only "
            "in speed. They differ in outcome: acid stops at one substitution "
            "because halogenation is self limiting, while base runs to "
            "exhaustive substitution because halogenation is self accelerating. "
            "The direction of the effect flips with the conditions."
        ),
        claims=(
            Formula(ACETONE, "C3H6O", "the methyl ketone"),
            Formula(CHLOROACETONE, "C3H5ClO", "single alpha substitution under acid"),
            Formula("C(I)(I)I", "CHI3", "iodoform, the haloform product"),
            Source(
                "Under basic conditions each successive alpha halogenation is "
                "accelerated by the electron withdrawal of the halogens already "
                "present, so a methyl ketone is trihalogenated and then cleaved "
                "by hydroxide to a carboxylate and a haloform.",
                "Clayden, Greeves and Warren, Organic Chemistry, chapter on the "
                "reactions of enols and enolates, the haloform reaction.",
            ),
        ),
    ),
    "ORG2.ALKYLATION": Lesson(
        node="ORG2.ALKYLATION",
        objective=(
            "Explain how the malonic ester synthesis converts an alkyl halide "
            "into a substituted acetic acid, and account for the carbon count "
            "of the product."
        ),
        build_on=(
            "An enolate is a carbon nucleophile, and a carbon nucleophile "
            "attacks an alkyl halide in substitution. The malonic ester "
            "synthesis is that alkylation, arranged so the carbon count of the "
            "product is under control."
        ),
        core_idea=(
            "Diethyl malonate has a central carbon flanked by two ester "
            "carbonyls, so its two central hydrogens are especially acidic; the "
            "enolate they form is stabilised by both carbonyls at once. That "
            "enolate is alkylated cleanly by an alkyl halide, installing a new "
            "group on the central carbon. Hydrolysing both esters then gives a "
            "malonic acid, a carbon bearing two carboxylic acids, and a carbon "
            "carrying two carboxyls next to each other loses one as carbon "
            "dioxide on heating. What remains is a carboxylic acid with the "
            "alkyl group you chose sitting where a hydrogen of acetic acid used "
            "to be, a substituted acetic acid. The scaffold delivers exactly "
            "the carbons of the alkyl halide onto an acetic acid framework, so "
            "you count the product's carbons from the halide you picked."
        ),
        worked_example=(
            "Start from diethyl malonate, C7H12O4, and alkylate it once with an "
            "ethyl group. Hydrolyse both esters to reach a substituted malonic "
            "acid, whose parent is malonic acid, C3H4O4. Heating removes one "
            "carboxyl as carbon dioxide, and the product is a carboxylic acid "
            "that is acetic acid with an ethyl group in place of one alpha "
            "hydrogen, namely butanoic acid, C4H8O2. The four carbons of "
            "butanoic acid are the two of the acetic acid framework plus the "
            "two of the ethyl group you introduced, which is how the synthesis "
            "lets you count carbons in advance."
        ),
        try_it_prompt=(
            "The malonic ester synthesis makes a substituted acetic acid. If "
            "you alkylate with a group carrying two carbons, how many carbons "
            "does the final acid have, and where do they come from?"
        ),
        try_it_answer=(
            "Four. Two carbons come from the acetic acid framework that "
            "survives decarboxylation, the carboxyl carbon and the alpha "
            "carbon, and two come from the alkyl group you added. One original "
            "carboxyl carbon is lost as carbon dioxide and does not count."
        ),
        pitfall=(
            "The common error is to forget the decarboxylation and count both "
            "of malonic acid's carboxyls in the product. One is lost as carbon "
            "dioxide, so the acetic acid framework contributes two carbons, not "
            "three, and miscounting here throws off the whole carbon budget of "
            "the target."
        ),
        claims=(
            Formula(DIETHYL_MALONATE, "C7H12O4", "the malonic ester"),
            Formula(MALONIC_ACID, "C3H4O4", "the diacid before decarboxylation"),
            Formula(BUTANOIC_ACID, "C4H8O2", "the substituted acetic acid product"),
            Source(
                "A carbon bearing two carboxylic acid groups undergoes "
                "decarboxylation on heating, losing one carboxyl as carbon "
                "dioxide through a cyclic six membered transition state.",
                "Carey and Sundberg, Advanced Organic Chemistry, Part B, "
                "chapter on reactions of carbon nucleophiles, the malonic ester "
                "synthesis.",
            ),
        ),
    ),
    "ORG2.ACETOACETIC": Lesson(
        node="ORG2.ACETOACETIC",
        objective=(
            "Explain how the acetoacetic ester synthesis delivers a substituted "
            "methyl ketone, and see why it is the ketone counterpart of the "
            "malonic ester route."
        ),
        build_on=(
            "You have the malonic ester synthesis, where a doubly activated "
            "carbon is alkylated, hydrolysed, and decarboxylated to a "
            "substituted acetic acid. Swap one ester of that scaffold for a "
            "ketone and the same three steps give a ketone instead of an acid."
        ),
        core_idea=(
            "Ethyl acetoacetate has a central carbon flanked by a ketone on one "
            "side and an ester on the other, so like the malonic ester it forms "
            "a doubly stabilised enolate that alkylates cleanly. Hydrolysing "
            "the ester gives a carbon bearing a carboxylic acid next to the "
            "ketone, a beta keto acid, and a beta keto acid decarboxylates on "
            "heating just as a malonic acid does. What remains is the methyl "
            "ketone carrying the alkyl group you installed, a substituted "
            "acetone. The scaffold is the ketone counterpart of the malonic "
            "ester route: malonic ester loses a carboxyl to leave an acid, "
            "acetoacetic ester loses a carboxyl to leave a methyl ketone."
        ),
        worked_example=(
            "Begin from ethyl acetoacetate, C6H10O3, with its ketone and ester "
            "flanking one carbon. Form the stabilised enolate at that central "
            "carbon and alkylate it with the group you want. Hydrolyse the "
            "ester to expose a carboxylic acid sitting beta to the ketone, then "
            "heat: the beta keto acid loses carbon dioxide. The product is "
            "acetone with your alkyl group in place of one alpha hydrogen, a "
            "substituted methyl ketone. Only the ester carbon leaves as carbon "
            "dioxide; the ketone is retained, which is the whole point of "
            "choosing this scaffold over the malonic one."
        ),
        try_it_prompt=(
            "Both the malonic ester and the acetoacetic ester syntheses end in "
            "decarboxylation. What functional group survives in each product, "
            "and what makes the difference?"
        ),
        try_it_answer=(
            "The malonic ester synthesis leaves a carboxylic acid, because its "
            "scaffold had two ester groups and one carboxyl survives. The "
            "acetoacetic ester synthesis leaves a ketone, because its scaffold "
            "had a ketone on one side that is not lost; only the ester derived "
            "carboxyl departs as carbon dioxide."
        ),
        pitfall=(
            "The misconception is that decarboxylation removes the ketone along "
            "with a carboxyl. It does not: only the carboxyl beta to the ketone "
            "leaves as carbon dioxide, and the ketone is exactly what you keep. "
            "Losing track of which carbonyl survives turns a methyl ketone "
            "target into a mistakenly predicted acid."
        ),
        claims=(
            Formula(ETHYL_ACETOACETATE, "C6H10O3", "the acetoacetic ester"),
            Formula(ACETONE, "C3H6O", "the methyl ketone framework retained"),
            Source(
                "A beta keto acid decarboxylates readily on warming, expelling "
                "carbon dioxide through a six membered transition state to give "
                "an enol that tautomerises to the ketone.",
                "Clayden, Greeves and Warren, Organic Chemistry, chapter on "
                "the acetoacetic ester synthesis and decarboxylation.",
            ),
        ),
    ),
    "ORG2.ALDOL": Lesson(
        node="ORG2.ALDOL",
        objective=(
            "Describe the aldol reaction as an enolate adding to a second "
            "carbonyl, account for the doubled formula of the aldol product, "
            "and explain the dehydration that turns it into an enal."
        ),
        build_on=(
            "You can make an enolate from an aldehyde or ketone, and you know "
            "an enolate is a carbon nucleophile. The aldol is what happens when "
            "that nucleophile meets another molecule of the same carbonyl "
            "compound."
        ),
        core_idea=(
            "In the aldol reaction the enolate of one carbonyl compound adds to "
            "the carbonyl carbon of another molecule of that same compound. "
            "Nothing is lost in that step: two molecules simply join, so the "
            "aldol product has exactly twice the formula of the starting "
            "aldehyde. The product is a beta hydroxy carbonyl, an aldol, with "
            "the new hydroxyl on the carbon beta to the carbonyl. Warming the "
            "aldol, or running the reaction harder, then eliminates water "
            "across the alpha and beta carbons to give an alpha, beta "
            "unsaturated carbonyl, an enal or enone. That elimination is the "
            "condensation: the reaction goes from two carbonyl molecules to one "
            "larger molecule, losing a single water at the dehydration step and "
            "no atoms at all in the addition step."
        ),
        worked_example=(
            "Dimerise acetaldehyde, C2H4O, by the aldol reaction. One molecule "
            "becomes the enolate and adds to the carbonyl of a second, joining "
            "the two into 3-hydroxybutanal, C4H8O2, which is exactly twice "
            "C2H4O with nothing lost: two times C2H4O is C4H8O2. That is the "
            "aldol addition. Now dehydrate it: water is eliminated across the "
            "alpha and beta carbons, and 3-hydroxybutanal, C4H8O2, becomes "
            "but-2-enal, C4H6O, plus water, H2O. The balance reads C4H8O2 on "
            "the left and C4H6O plus H2O, again C4H8O2, on the right. The two "
            "steps together are the aldol condensation."
        ),
        try_it_prompt=(
            "The aldol addition of acetaldehyde gives a product of formula "
            "C4H8O2. Without the dehydration, why is the product's formula "
            "exactly twice that of acetaldehyde?"
        ),
        try_it_answer=(
            "Because the addition simply joins two molecules of acetaldehyde "
            "with nothing expelled. The enolate's alpha carbon bonds to the "
            "other molecule's carbonyl carbon, and the only change is a proton "
            "shuffling to oxygen, so all the atoms of both aldehydes are "
            "retained: two times C2H4O gives C4H8O2."
        ),
        pitfall=(
            "The common slip is to assume the aldol reaction always loses "
            "water. The addition step does not; it doubles the formula exactly. "
            "Water leaves only at the separate dehydration step that converts "
            "the aldol into the unsaturated carbonyl, and whether you stop at "
            "the aldol or go on to the condensation depends on the conditions."
        ),
        claims=(
            Formula(ACETALDEHYDE, "C2H4O", "the starting aldehyde"),
            Formula(HYDROXYBUTANAL, "C4H8O2", "3-hydroxybutanal, exactly twice the aldehyde"),
            Formula(BUT_2_ENAL, "C4H6O", "but-2-enal, the condensation product"),
            Formula(WATER, "H2O", "lost only at the dehydration step"),
        ),
    ),
    "ORG2.CROSSEDALDOL": Lesson(
        node="ORG2.CROSSEDALDOL",
        objective=(
            "Explain how a crossed aldol is made selective by controlling which "
            "partner can enolise, and how tethering the two carbonyls in one "
            "molecule gives a ring."
        ),
        build_on=(
            "A plain aldol between two molecules of one aldehyde has only one "
            "possible enolate and one product. Mix two different carbonyl "
            "compounds and the problem becomes choosing which of them supplies "
            "the enolate and which supplies the electrophile."
        ),
        core_idea=(
            "A crossed aldol between two different carbonyl compounds could give "
            "four products if both can enolise and both can be attacked. The "
            "cure is to remove choices. If one partner has no alpha hydrogen it "
            "cannot enolise, so it can only be the electrophile, and if the "
            "other is the sole source of enolate, only one crossed product "
            "forms. A carbonyl with no alpha hydrogen, such as an aromatic "
            "aldehyde or formaldehyde, is the classic non enolisable partner. "
            "The intramolecular version applies the same addition when both "
            "carbonyls sit in one molecule: an enolate at one end reaches the "
            "carbonyl at the other and closes a ring, with five and six "
            "membered rings forming most readily because the chain can reach "
            "those sizes comfortably."
        ),
        worked_example=(
            "Suppose you want a single crossed aldol between acetaldehyde, "
            "C2H4O, and a partner that must not enolise. Choose a partner with "
            "no alpha hydrogen so it can only accept the enolate, never provide "
            "one. Then acetaldehyde is the only enolate source and adds to that "
            "partner's carbonyl, giving one crossed aldol rather than a mixture. "
            "For the intramolecular case, picture a molecule holding two "
            "carbonyls a few carbons apart: deprotonate an alpha carbon at one "
            "end, let that enolate reach across to the carbonyl at the other "
            "end, and the new carbon carbon bond closes a ring, most easily a "
            "five or six membered one."
        ),
        try_it_prompt=(
            "You mix two aldehydes for a crossed aldol and get a mixture of "
            "four products. What single structural feature in one partner would "
            "have made the reaction selective, and why?"
        ),
        try_it_answer=(
            "One partner having no alpha hydrogen. Without an alpha hydrogen it "
            "cannot form an enolate, so it can only be the electrophile, and the "
            "other aldehyde becomes the sole enolate source. That removes three "
            "of the four combinations and leaves a single crossed product."
        ),
        pitfall=(
            "The mistake is to run a crossed aldol between two enolisable "
            "carbonyls and expect one product. With both able to enolise and "
            "both able to be attacked, you get a statistical mixture. "
            "Selectivity comes from denying one partner the ability to enolise, "
            "not from hoping one reaction outpaces the others."
        ),
        claims=(
            Formula(ACETALDEHYDE, "C2H4O", "the enolisable partner"),
            Formula(HYDROXYBUTANAL, "C4H8O2", "the self aldol product to be avoided"),
            Source(
                "A crossed aldol is rendered selective by using one partner "
                "that lacks an alpha hydrogen, such as benzaldehyde or "
                "formaldehyde, so that only the other component can form the "
                "enolate; intramolecular aldol cyclisations favour five and six "
                "membered rings.",
                "Carey and Sundberg, Advanced Organic Chemistry, Part B, "
                "chapter on aldol and related condensation reactions.",
            ),
        ),
    ),
    "ORG2.CLAISEN": Lesson(
        node="ORG2.CLAISEN",
        objective=(
            "Describe the Claisen condensation as an ester enolate displacing "
            "an alkoxide from a second ester, explain why a full equivalent of "
            "base is needed, and recognise its intramolecular Dieckmann form."
        ),
        build_on=(
            "The aldol added an enolate to an aldehyde or ketone, which cannot "
            "expel a leaving group, so the product kept the new hydroxyl. An "
            "ester can expel an alkoxide, so the ester version of this "
            "chemistry ends in substitution, not addition."
        ),
        core_idea=(
            "In the Claisen condensation the enolate of one ester attacks the "
            "carbonyl of a second ester. Because an ester carbon carries a "
            "leaving group, the tetrahedral intermediate collapses and expels "
            "an alkoxide, so the product is a beta keto ester rather than a "
            "beta hydroxy compound. The reason a full equivalent of base is "
            "needed, not a catalytic amount, is that the beta keto ester "
            "product is more acidic than the starting ester: its central "
            "hydrogen sits between two carbonyls, so the base is consumed "
            "deprotonating the product, and that final deprotonation is what "
            "pulls the equilibrium toward product. The intramolecular version, "
            "the Dieckmann condensation, does the same to a molecule bearing "
            "two ester groups, closing a ring to give a cyclic beta keto ester."
        ),
        worked_example=(
            "Condense two molecules of ethyl acetate, C4H8O2. One becomes an "
            "ester enolate and attacks the carbonyl of the other; the "
            "tetrahedral intermediate expels ethoxide, and the product is ethyl "
            "acetoacetate, C6H10O3, plus ethanol, C2H6O. Check the atoms: two "
            "ethyl acetates supply C8H16O4, and ethyl acetoacetate plus ethanol "
            "is C6H10O3 plus C2H6O, which is also C8H16O4. The balance holds. "
            "The beta keto ester product is acidic enough that the base "
            "deprotonates it, so a full equivalent of base is used up and the "
            "equilibrium is driven forward."
        ),
        try_it_prompt=(
            "Why does the Claisen condensation require a full equivalent of "
            "base, when many enolate reactions run with only a catalytic "
            "amount?"
        ),
        try_it_answer=(
            "Because the beta keto ester product is more acidic than the "
            "starting ester, so the base deprotonates the product and is "
            "consumed rather than regenerated. That deprotonation is also what "
            "drives the otherwise unfavourable equilibrium toward product, so a "
            "full equivalent is both needed and useful."
        ),
        pitfall=(
            "The trap is expecting a beta hydroxy ester by analogy with the "
            "aldol. The aldol partner, an aldehyde or ketone, has no leaving "
            "group, so it keeps the hydroxyl; an ester does have one, so the "
            "Claisen expels an alkoxide and gives a beta keto ester. The leaving "
            "group is the whole difference between the two reactions."
        ),
        claims=(
            Formula(ETHYL_ACETATE, "C4H8O2", "the ester, used twice"),
            Formula(ETHYL_ACETOACETATE, "C6H10O3", "the beta keto ester product"),
            Formula(ETHANOL, "C2H6O", "the alcohol from the expelled alkoxide"),
            Source(
                "The Claisen condensation consumes a full equivalent of base "
                "because the beta keto ester product is more acidic than the "
                "ester starting material and is deprotonated as it forms, which "
                "also drives the equilibrium toward product.",
                "Clayden, Greeves and Warren, Organic Chemistry, chapter on the "
                "Claisen ester condensation.",
            ),
        ),
    ),
    "ORG2.MICHAEL": Lesson(
        node="ORG2.MICHAEL",
        objective=(
            "Describe the Michael addition as conjugate addition of an enolate "
            "to an alpha, beta unsaturated carbonyl, and see how pairing it "
            "with an aldol closes a ring in the Robinson annulation."
        ),
        build_on=(
            "You have seen an enolate add directly to a carbonyl carbon in the "
            "aldol. When the electrophile is an alpha, beta unsaturated "
            "carbonyl, the enolate has a second place to add, and choosing that "
            "place is what the Michael addition is about."
        ),
        core_idea=(
            "An alpha, beta unsaturated carbonyl is electrophilic at two "
            "positions: the carbonyl carbon itself, and the beta carbon of the "
            "double bond, because conjugation carries the electron demand out to "
            "the beta carbon. A stabilised enolate, a soft nucleophile, prefers "
            "to add at the beta carbon, and that is the Michael addition, also "
            "called conjugate or 1,4 addition. Nothing is lost: the donor and "
            "the acceptor simply combine, so the adduct's formula is the sum of "
            "the two. The Robinson annulation strings two of these steps "
            "together. A Michael addition builds a 1,5 dicarbonyl, and then an "
            "intramolecular aldol condensation of that product closes a six "
            "membered ring, so a conjugate addition and an aldol together "
            "assemble a new ring."
        ),
        worked_example=(
            "Add the stabilised enolate of pentane-2,4-dione, C5H8O2, to the "
            "acceptor but-3-en-2-one, C4H6O, a methyl vinyl ketone. The "
            "nucleophilic central carbon of the diketone adds to the beta "
            "carbon of the enone, and because this is a simple combination with "
            "nothing expelled, the adduct is C9H14O3, the sum of C5H8O2 and "
            "C4H6O. That adduct is a 1,5 dicarbonyl, exactly the arrangement an "
            "intramolecular aldol needs; condensing it would close a six "
            "membered ring, which is the Robinson annulation completing what the "
            "Michael addition began."
        ),
        try_it_prompt=(
            "A Michael addition combines a donor of formula C5H8O2 with an "
            "acceptor of formula C4H6O. What is the formula of the adduct, and "
            "why is it simply the sum?"
        ),
        try_it_answer=(
            "C9H14O3. The Michael addition is a conjugate addition in which the "
            "enolate bonds to the beta carbon of the acceptor and nothing is "
            "expelled, so every atom of both partners is retained and the "
            "adduct's formula is just C5H8O2 plus C4H6O."
        ),
        pitfall=(
            "The common error is to have the enolate add to the carbonyl carbon "
            "of the enone, a 1,2 addition, when the point of the Michael "
            "reaction is conjugate addition at the beta carbon. A stabilised "
            "enolate favours the beta carbon; adding at the carbonyl instead "
            "gives the wrong connectivity and no path into the Robinson "
            "annulation's ring."
        ),
        claims=(
            Formula(PENTANE_2_4_DIONE, "C5H8O2", "the stabilised Michael donor"),
            Formula(MVK, "C4H6O", "but-3-en-2-one, the Michael acceptor"),
            Formula(MICHAEL_ADDUCT, "C9H14O3", "the 1,4-adduct, the sum of the partners"),
            Source(
                "Soft, stabilised enolates add preferentially in a 1,4 "
                "(conjugate) sense to alpha, beta unsaturated carbonyl "
                "compounds; the Robinson annulation couples such a Michael "
                "addition with a subsequent intramolecular aldol condensation "
                "to build a six membered ring.",
                "Carey and Sundberg, Advanced Organic Chemistry, Part B, "
                "chapter on conjugate addition and the Robinson annulation.",
            ),
        ),
    ),
}

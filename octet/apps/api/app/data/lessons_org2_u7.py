"""ORG2 Unit 7: Carboxylic Acid Derivatives.

One reactivity ladder runs through this whole unit. Acid chlorides, anhydrides,
esters and amides are the same carbonyl carbon carrying different leaving
groups, and every interconversion in the unit is nucleophilic acyl
substitution: a nucleophile adds to the carbonyl, then a leaving group departs.
Where a derivative sits on the ladder is decided by how good its leaving group
is and how much the group stabilises the carbonyl, and that single ordering
predicts which derivative can be made from which.

Every structural fact here carries a claim that RDKit re-derives from the
structure when the suite runs. Molecular formulas, the mass balance of a
hydrolysis or esterification, and the isomer relationship between an ester and
its acid are all checkable, and are checked. Facts that cannot be derived from a
structure, the reactivity order itself and the geometry of the amide bond,
carry a citation instead. No reagent quantities, temperatures, or preparative
procedures appear; these are teaching structures, not recipes.
"""

from __future__ import annotations

from app.data.claims import Formula, Relationship, Source
from app.data.lesson_types import Lesson

# Named once so a claim and its prose cannot drift apart. The four derivatives
# are all built on the acetyl group, CH3C(=O)-, so that the only thing changing
# down the ladder is the leaving group.
ACETYL_CHLORIDE = "CC(=O)Cl"  # C2H3ClO
ACETIC_ANHYDRIDE = "CC(=O)OC(C)=O"  # C4H6O3
METHYL_ACETATE = "CC(=O)OC"  # C3H6O2
ACETAMIDE = "CC(=O)N"  # C2H5NO
ACETIC_ACID = "CC(=O)O"  # C2H4O2
PROPANOIC_ACID = "CCC(=O)O"  # C3H6O2, an isomer of methyl acetate
ETHYL_FORMATE = "CCOC=O"  # C3H6O2, a third isomer of the same formula
METHANOL = "CO"  # CH4O
WATER = "O"  # H2O
GLYCINE = "NCC(=O)O"  # C2H5NO2
GLYCYLGLYCINE = "NCC(=O)NCC(=O)O"  # C4H8N2O3, the dipeptide
TERT_BUTANOL = "CC(C)(C)O"  # C4H10O, 2-methylpropan-2-ol

LESSONS_ORG2_U7 = {
    "ORG2.DERIVATIVEREACTIVITY": Lesson(
        node="ORG2.DERIVATIVEREACTIVITY",
        objective=(
            "Rank the four common acid derivatives by reactivity toward "
            "nucleophilic acyl substitution, and use that ranking to predict "
            "which derivative can be converted into which."
        ),
        build_on=(
            "You know an aldehyde or ketone reacts with a nucleophile by "
            "addition to the carbonyl. An acid derivative starts the same way, "
            "but the carbon also carries a group that can leave, so addition is "
            "followed by elimination and the carbonyl is restored."
        ),
        core_idea=(
            "Take the acetyl group and hang a different leaving group on it "
            "four times: chlorine gives the acid chloride, an acyloxy group "
            "gives the anhydride, an alkoxy group gives the ester, and an amino "
            "group gives the amide. The reactivity of each toward a nucleophile "
            "follows one order, acid chloride greater than anhydride greater "
            "than ester greater than amide. Two effects run the same way and "
            "reinforce each other. The better the leaving group, the more "
            "reactive the derivative, so chloride departs easily and amide's "
            "nitrogen does not. And the more the attached group donates into "
            "the carbonyl, the less electrophilic the carbon; nitrogen donates "
            "strongly, which is why the amide sits at the bottom. The ladder is "
            "one directional: a nucleophile can always convert a derivative "
            "into one lower on the ladder, never one higher."
        ),
        worked_example=(
            "Ask whether an amide can be made from an ester by adding an amine, "
            "and whether an ester can be made from an amide by adding an "
            "alcohol. The ester is higher on the ladder than the amide, so the "
            "first conversion runs downhill and is feasible: the amine "
            "displaces the alkoxy group. The second asks to climb the ladder, "
            "ester above amide, and it does not go, because you would be "
            "expelling the poor amide leaving group in favour of a better one, "
            "which is the wrong direction. Acetic anhydride, C4H6O3, sits above "
            "both the ester methyl acetate, C3H6O2, and acetamide, C2H5NO, so "
            "it can acylate an alcohol to give an ester or an amine to give an "
            "amide, and that is exactly why anhydrides are common acylating "
            "agents."
        ),
        try_it_prompt=(
            "You want to make acetamide from acetic acid's derivatives. Which "
            "is the more sensible starting derivative, methyl acetate or acetyl "
            "chloride, and why?"
        ),
        try_it_answer=(
            "Acetyl chloride. It sits at the top of the ladder, well above the "
            "amide, so ammonia displaces chloride readily and runs strongly "
            "downhill. Methyl acetate is above the amide too and can be "
            "converted, but the ester is much closer to the amide in reactivity "
            "and the conversion is correspondingly harder to drive."
        ),
        pitfall=(
            "The trap is thinking a nucleophile can push any interconversion if "
            "you supply enough of it. The ladder is set by leaving group "
            "ability and carbonyl donation, not by concentration alone, and "
            "climbing it, making an acid chloride from an amide by adding "
            "chloride, is not a substitution you can force this way."
        ),
        claims=(
            Formula(ACETYL_CHLORIDE, "C2H3ClO", "acetyl chloride, top of the ladder"),
            Formula(ACETIC_ANHYDRIDE, "C4H6O3", "acetic anhydride"),
            Formula(METHYL_ACETATE, "C3H6O2", "methyl acetate, the ester"),
            Formula(ACETAMIDE, "C2H5NO", "acetamide, bottom of the ladder"),
            Source(
                "The reactivity of carboxylic acid derivatives toward "
                "nucleophilic acyl substitution decreases in the order acid "
                "chloride, anhydride, ester, amide, tracking both leaving group "
                "ability and the extent of electron donation into the "
                "carbonyl.",
                "Clayden, Greeves and Warren, Organic Chemistry, chapter on "
                "nucleophilic substitution at the carbonyl group.",
            ),
        ),
    ),
    "ORG2.ACYLSUB": Lesson(
        node="ORG2.ACYLSUB",
        objective=(
            "Describe nucleophilic acyl substitution as addition followed by "
            "elimination through a tetrahedral intermediate, and explain why "
            "the overall result is substitution rather than addition."
        ),
        build_on=(
            "Addition of a nucleophile to a carbonyl you have already seen with "
            "aldehydes and ketones. The new feature is that the carbon here "
            "carries a leaving group, so the tetrahedral species formed by "
            "addition does not stay; it collapses."
        ),
        core_idea=(
            "The mechanism has two steps around one intermediate. First the "
            "nucleophile adds to the planar carbonyl carbon, pushing the pi "
            "electrons onto oxygen and giving a tetrahedral alkoxide with four "
            "single bonds at carbon. That intermediate is where the fate of the "
            "reaction is decided. It can expel the nucleophile again, undoing "
            "the step, or it can expel the original leaving group; the carbonyl "
            "reforms either way. When the leaving group leaves, the net change "
            "is that one group at the carbonyl has been swapped for another, "
            "which is a substitution even though every step was an addition or "
            "an elimination. An aldehyde or ketone has no group worth expelling, "
            "which is why they stop at the addition product."
        ),
        worked_example=(
            "Convert acetyl chloride, C2H3ClO, to methyl acetate, C3H6O2, with "
            "methanol, CH4O. Methanol's oxygen adds to the carbonyl carbon to "
            "give the tetrahedral intermediate bearing chlorine, the incoming "
            "methoxy, and the alkoxide oxygen. Now compare the two groups that "
            "could leave: chloride is a far better leaving group than methoxide, "
            "so chloride departs, the carbonyl reforms, and loss of a proton "
            "gives the ester. The atoms account exactly: acetyl chloride plus "
            "methanol supplies the same atoms as methyl acetate plus hydrogen "
            "chloride, C3H7ClO2 on each side."
        ),
        try_it_prompt=(
            "In the tetrahedral intermediate from acetyl chloride and methanol, "
            "two groups could be expelled to reform a carbonyl. Which leaves, "
            "and what does that choice decide?"
        ),
        try_it_answer=(
            "Chloride leaves, because it is the better leaving group of the "
            "two. That choice decides the product: expelling chloride gives the "
            "ester, whereas expelling the newly added methoxide would simply "
            "regenerate the acid chloride and undo the addition."
        ),
        pitfall=(
            "The common error is to imagine the leaving group departs at the "
            "same instant the nucleophile arrives, as in an SN2 backside "
            "displacement. It does not. The nucleophile adds first to a real "
            "tetrahedral intermediate, and the leaving group goes in a separate "
            "step. Treating it as concerted hides why the reactivity ladder "
            "exists at all."
        ),
        claims=(
            Formula(ACETYL_CHLORIDE, "C2H3ClO", "the acid chloride"),
            Formula(METHYL_ACETATE, "C3H6O2", "the ester product"),
            Formula(METHANOL, "CH4O", "the nucleophile"),
            Formula(ACETIC_ACID, "C2H4O2", "the parent acid"),
            Source(
                "Nucleophilic acyl substitution proceeds through a discrete "
                "tetrahedral intermediate; the partitioning of that "
                "intermediate between reactant and product is governed by the "
                "relative leaving ability of the two candidate groups.",
                "Carey and Sundberg, Advanced Organic Chemistry, Part A, "
                "chapter on carbonyl addition and acyl substitution.",
            ),
        ),
    ),
    "ORG2.ACIDCHLORIDE": Lesson(
        node="ORG2.ACIDCHLORIDE",
        objective=(
            "Explain why acid chlorides and anhydrides are the most reactive "
            "derivatives, and identify what each converts into on reaction with "
            "an alcohol, an amine, or water."
        ),
        build_on=(
            "You have the reactivity ladder and the addition then elimination "
            "mechanism. This lesson looks closely at the two derivatives at the "
            "top of that ladder and what makes them so useful."
        ),
        core_idea=(
            "Acid chlorides carry chloride, an excellent leaving group, and no "
            "strong electron donation into the carbonyl, so they are the most "
            "reactive derivative and acylate almost any nucleophile. An "
            "anhydride is two acyl groups sharing one oxygen; expelling a "
            "carboxylate is nearly as easy as expelling chloride, so it sits "
            "just below the acid chloride. Both react with an alcohol to give "
            "an ester, with an amine to give an amide, and with water to give "
            "the carboxylic acid. The difference between them is mostly what "
            "the leaving group becomes: an acid chloride releases hydrogen "
            "chloride, while an anhydride releases a molecule of the carboxylic "
            "acid, and so half of an anhydride's mass is spent as that leaving "
            "carboxylic acid."
        ),
        worked_example=(
            "Hydrolyse acetic anhydride, C4H6O3, and count the atoms. Water "
            "adds to one carbonyl, the tetrahedral intermediate expels acetate, "
            "and the result is two molecules of acetic acid. Written as a "
            "balance, acetic anhydride plus water, C4H6O3 plus H2O, gives two "
            "acetic acid molecules, two times C2H4O2, and the atoms match: "
            "C4H8O4 on each side. The same anhydride reacting with an alcohol "
            "instead of water would give one ester and one molecule of acetic "
            "acid, because only one of the two acyl groups is transferred to "
            "the nucleophile."
        ),
        try_it_prompt=(
            "Acetic anhydride reacts with methanol to give an ester. What "
            "carbon containing products form, and why is only one ester made "
            "per anhydride?"
        ),
        try_it_answer=(
            "One molecule of methyl acetate and one molecule of acetic acid. "
            "The anhydride transfers a single acetyl group to methanol; the "
            "other acyl group leaves as acetate and picks up a proton to become "
            "acetic acid, so only one of the two acyl groups becomes the ester."
        ),
        pitfall=(
            "A frequent slip is expecting an anhydride to deliver both acyl "
            "groups to the nucleophile. Only one is transferred per attack; the "
            "second departs as the carboxylate leaving group. Budgeting an "
            "anhydride as two acylations of the substrate double counts it."
        ),
        claims=(
            Formula(ACETYL_CHLORIDE, "C2H3ClO", "the most reactive derivative"),
            Formula(ACETIC_ANHYDRIDE, "C4H6O3", "the anhydride"),
            Formula(ACETIC_ACID, "C2H4O2", "the acid formed on hydrolysis"),
            Formula(METHYL_ACETATE, "C3H6O2", "the ester from an alcohol"),
        ),
    ),
    "ORG2.ESTERS": Lesson(
        node="ORG2.ESTERS",
        objective=(
            "Account for Fischer esterification as an equilibrium, explain how "
            "that equilibrium is driven, and contrast reversible hydrolysis "
            "with the irreversible saponification route."
        ),
        build_on=(
            "Esters sit in the middle of the reactivity ladder, close enough to "
            "the carboxylic acid that the two interconvert. That closeness is "
            "why making an ester from an acid is an equilibrium rather than a "
            "one way reaction."
        ),
        core_idea=(
            "Fischer esterification joins a carboxylic acid and an alcohol into "
            "an ester and water, under acid catalysis, and every step is "
            "reversible. Because the acid and the ester are so near each other "
            "on the ladder, the reaction reaches an equilibrium rather than "
            "running to completion, and you shift it by removing water or by "
            "using an excess of one reactant. Hydrolysis is the same "
            "equilibrium read backwards: water and acid catalyst convert the "
            "ester back to the carboxylic acid and the alcohol. Saponification "
            "escapes the equilibrium entirely. Hydroxide, not water, does the "
            "hydrolysis, and the final proton transfer converts the carboxylic "
            "acid to its carboxylate, which is so stable that the reaction "
            "cannot run backward. That is why saponification is the "
            "irreversible route to cleaving an ester."
        ),
        worked_example=(
            "Track the atoms of Fischer esterification with acetic acid and "
            "methanol. Acetic acid, C2H4O2, and methanol, CH4O, combine to give "
            "methyl acetate, C3H6O2, and water, H2O. The balance reads C3H8O3 "
            "on the left and C3H8O3 on the right, so the equation is complete "
            "and the only question is where the equilibrium sits. Notice that "
            "the ester methyl acetate, C3H6O2, has the same molecular formula "
            "as the carboxylic acid propanoic acid and as ethyl formate: three "
            "different compounds, one formula, distinguished only by how the "
            "atoms are connected. Run the reaction backward with water and you "
            "recover the acid and the alcohol; that is hydrolysis. Replace "
            "water with hydroxide and the acetic acid is converted to acetate "
            "at the end, removing the reverse reaction and making the cleavage "
            "go to completion."
        ),
        try_it_prompt=(
            "Fischer esterification of acetic acid and methanol has reached "
            "equilibrium with a modest yield of ester. Name two ways to push "
            "more ester out without changing which reaction is occurring."
        ),
        try_it_answer=(
            "Remove the water as it forms, or add a large excess of one "
            "reactant, most simply the alcohol. Both move the equilibrium "
            "toward the ester by Le Chatelier's principle without altering the "
            "underlying reversible chemistry."
        ),
        pitfall=(
            "Students often treat saponification as just base catalysed "
            "hydrolysis, expecting it to be reversible like the acid catalysed "
            "version. It is not. The hydroxide is consumed and the product is "
            "the carboxylate, not the neutral acid, and that deprotonation is "
            "what makes the step irreversible rather than merely faster."
        ),
        claims=(
            Formula(ACETIC_ACID, "C2H4O2", "the carboxylic acid"),
            Formula(METHANOL, "CH4O", "the alcohol"),
            Formula(METHYL_ACETATE, "C3H6O2", "the ester"),
            Formula(WATER, "H2O", "the byproduct that drives the equilibrium"),
            Relationship(
                METHYL_ACETATE, PROPANOIC_ACID, "constitutional",
                "an ester and a carboxylic acid of the same formula, C3H6O2",
            ),
            Relationship(
                METHYL_ACETATE, ETHYL_FORMATE, "constitutional",
                "a third isomer of C3H6O2, a different ester",
            ),
        ),
    ),
    "ORG2.AMIDES": Lesson(
        node="ORG2.AMIDES",
        objective=(
            "Explain why the amide is the least reactive derivative, relate "
            "that stability to the planar amide bond, and describe amide "
            "hydrolysis and the peptide bond it forms."
        ),
        build_on=(
            "The amide sits at the bottom of the reactivity ladder. This lesson "
            "asks why nitrogen's donation into the carbonyl puts it there, and "
            "what that same donation does to the shape of the bond."
        ),
        core_idea=(
            "Nitrogen's lone pair is donated strongly into the carbonyl, so the "
            "carbon nitrogen bond has partial double bond character and the "
            "carbonyl carbon is the least electrophilic of the four "
            "derivatives. Two consequences follow. First, the amide is the "
            "least reactive derivative and the hardest to hydrolyse, which is "
            "exactly why nature uses it for the bonds of proteins. Second, "
            "because the lone pair is delocalised into the pi system, the six "
            "atoms of the amide group lie in a plane and rotation about the "
            "carbon nitrogen bond is hindered. Amide hydrolysis still follows "
            "addition then elimination, cleaving the amide to a carboxylic acid "
            "and an amine, and joining two amino acids by an amide bond, with "
            "loss of water, makes the peptide bond."
        ),
        worked_example=(
            "Form the simplest peptide bond from two molecules of glycine, "
            "C2H5NO2. The acid group of one glycine and the amine of the other "
            "join into an amide, releasing water, to give glycylglycine, "
            "C4H8N2O3. Check the mass balance: two glycines supply C4H10N2O4, "
            "and glycylglycine plus water is C4H8N2O3 plus H2O, which is also "
            "C4H10N2O4. The atoms account exactly, and the new bond between the "
            "two residues is a planar amide, the peptide bond that the same "
            "chemistry builds along an entire protein chain."
        ),
        try_it_prompt=(
            "Hydrolysing glycylglycine, C4H8N2O3, in water reverses its "
            "formation. What products form, and how do the atoms balance?"
        ),
        try_it_answer=(
            "Two molecules of glycine, C2H5NO2 each. Glycylglycine plus water, "
            "C4H8N2O3 plus H2O, is C4H10N2O4, which is exactly two glycine "
            "molecules, two times C2H5NO2. Hydrolysis adds back the water that "
            "peptide bond formation removed."
        ),
        pitfall=(
            "The misconception is that the amide's low reactivity comes only "
            "from nitrogen being a poor leaving group. Donation of the lone "
            "pair into the carbonyl is the deeper reason: it lowers the "
            "electrophilicity of the carbon and flattens the group into a "
            "plane, so the amide resists attack for a structural reason and not "
            "just a leaving group one."
        ),
        claims=(
            Formula(ACETAMIDE, "C2H5NO", "the amide, least reactive derivative"),
            Formula(GLYCINE, "C2H5NO2", "the amino acid"),
            Formula(GLYCYLGLYCINE, "C4H8N2O3", "the dipeptide"),
            Formula(WATER, "H2O", "lost when the peptide bond forms"),
            Source(
                "Delocalisation of the nitrogen lone pair into the carbonyl "
                "gives the amide bond partial double bond character, making the "
                "O-C-N unit planar and creating a substantial barrier to "
                "rotation about the C-N bond.",
                "Clayden, Greeves and Warren, Organic Chemistry, chapter on "
                "conjugation and the structure of the amide group.",
            ),
        ),
    ),
    "ORG2.DERIVATIVEREDUCTION": Lesson(
        node="ORG2.DERIVATIVEREDUCTION",
        objective=(
            "Choose a hydride reagent that reduces an acid derivative either "
            "all the way to a primary alcohol or only as far as the aldehyde, "
            "and explain what determines where the reduction stops."
        ),
        build_on=(
            "Reduction delivers hydride to the carbonyl carbon rather than "
            "another nucleophile, but it starts the same way: addition to the "
            "carbonyl, then a tetrahedral intermediate that may or may not "
            "collapse."
        ),
        core_idea=(
            "A strong, indiscriminate hydride source reduces an ester or acid "
            "all the way to a primary alcohol, because the aldehyde formed "
            "along the way is more reactive than the starting derivative and is "
            "reduced again before it can be isolated. Stopping at the aldehyde "
            "therefore needs a milder, bulkier hydride delivered so that the "
            "first tetrahedral intermediate survives until workup and gives the "
            "aldehyde on hydrolysis rather than adding a second hydride. Which "
            "outcome you get is a property of the reagent, not of the "
            "substrate: the choice of hydride source decides whether the "
            "reduction runs to the alcohol or halts at the aldehyde. This is a "
            "reagent selectivity, so it is stated with a citation rather than "
            "derived from the structures."
        ),
        worked_example=(
            "Consider reducing methyl acetate, C3H6O2. A strong hydride source "
            "reduces the ester past the aldehyde stage to the primary alcohol "
            "ethanol, and the alkoxy group leaves as methanol; the aldehyde is "
            "never isolated because it is reduced faster than the ester was. To "
            "stop instead at acetaldehyde you switch to a bulkier, less "
            "reactive hydride that adds once and no more, so that hydrolysis of "
            "the tetrahedral intermediate liberates the aldehyde. Same "
            "substrate, two products, and the reagent is what chooses between "
            "them."
        ),
        try_it_prompt=(
            "Why does a strong hydride reagent take an ester all the way to the "
            "primary alcohol instead of stopping at the aldehyde, even though "
            "the aldehyde forms first?"
        ),
        try_it_answer=(
            "Because the aldehyde is more reactive toward hydride than the "
            "ester it came from, so as soon as any aldehyde appears the strong "
            "reagent reduces it again. There is no chance to isolate it; "
            "stopping at the aldehyde requires a milder reagent that will not "
            "add a second time."
        ),
        pitfall=(
            "The error is to think the aldehyde is a stable resting point that "
            "you could catch by timing. It is not, with a strong hydride: it is "
            "consumed faster than it forms. Controlling the stopping point is a "
            "matter of choosing a reagent that cannot over reduce, not of "
            "watching the clock."
        ),
        claims=(
            Formula(METHYL_ACETATE, "C3H6O2", "the ester being reduced"),
            Formula(ACETIC_ACID, "C2H4O2", "the parent acid, also reducible"),
            Source(
                "Lithium aluminium hydride reduces esters and carboxylic acids "
                "to primary alcohols, whereas a bulkier, milder hydride such as "
                "diisobutylaluminium hydride can deliver a single hydride and "
                "halt the reduction at the aldehyde.",
                "Clayden, Greeves and Warren, Organic Chemistry, chapter on the "
                "reduction of carbonyl compounds.",
            ),
        ),
    ),
    "ORG2.DERIVATIVEORGANOMETALLIC": Lesson(
        node="ORG2.DERIVATIVEORGANOMETALLIC",
        objective=(
            "Explain why an organometallic reagent takes an ester to a tertiary "
            "alcohol, and why the same addition to an acid chloride can be "
            "stopped at the ketone."
        ),
        build_on=(
            "An organometallic reagent is a carbon nucleophile, so it adds to "
            "the carbonyl just as hydride or an alcohol does. What is new is "
            "that its addition builds a new carbon carbon bond, and it can add "
            "more than once."
        ),
        core_idea=(
            "Add an organometallic reagent to an ester and the first product is "
            "a ketone, but the ketone is more reactive than the ester was, so a "
            "second equivalent adds at once and the result is a tertiary "
            "alcohol carrying two identical groups from the reagent. You cannot "
            "stop at the ketone with an ordinary organometallic because the "
            "ketone outruns its precursor. An acid chloride is different: with a "
            "suitably attenuated organometallic reagent the first addition can "
            "be halted at the ketone, because the reagent is tuned to react "
            "with the very reactive acid chloride but not with the less "
            "reactive ketone it produces. The same reactivity ladder that "
            "orders substitution decides whether a second addition happens."
        ),
        worked_example=(
            "React methyl acetate, C3H6O2, with a methyl organometallic. The "
            "first equivalent gives a ketone, which is more electrophilic than "
            "the ester, so a second methyl adds before anything can be "
            "isolated. The nucleophile has delivered two methyl groups to the "
            "original acetyl carbon, and after workup the product is "
            "2-methylpropan-2-ol, C4H10O, a tertiary alcohol whose central "
            "carbon bears the original methyl plus the two added ones and an OH. "
            "To keep a single addition you would begin from the acid chloride "
            "and choose a reagent mild enough to stop at the ketone."
        ),
        try_it_prompt=(
            "An ester and a methyl organometallic give a tertiary alcohol with "
            "two identical groups on the carbinol carbon. Where do those two "
            "identical groups come from, and why are there exactly two?"
        ),
        try_it_answer=(
            "Both come from the organometallic reagent. The first equivalent "
            "converts the ester to a ketone by displacing the alkoxy group; the "
            "second adds to that ketone. Two equivalents add because the ketone "
            "intermediate is more reactive than the ester, so the addition "
            "cannot stop after one."
        ),
        pitfall=(
            "The misconception is that you can isolate the ketone from an ester "
            "and an organometallic by using just one equivalent. You cannot: "
            "the ketone is consumed faster than it forms. Single addition to a "
            "ketone stage is the province of the acid chloride with a mild "
            "reagent, not of the ester."
        ),
        claims=(
            Formula(METHYL_ACETATE, "C3H6O2", "the ester"),
            Formula(TERT_BUTANOL, "C4H10O", "2-methylpropan-2-ol, the tertiary alcohol"),
            Formula(ACETYL_CHLORIDE, "C2H3ClO", "the acid chloride that can stop at a ketone"),
            Source(
                "Grignard and organolithium reagents add twice to esters, "
                "giving tertiary alcohols, because the ketone intermediate is "
                "more electrophilic than the ester; a single addition to give a "
                "ketone is achievable from an acid chloride using an attenuated "
                "organometallic such as a Gilman cuprate.",
                "Carey and Sundberg, Advanced Organic Chemistry, Part B, "
                "chapter on organometallic reagents in synthesis.",
            ),
        ),
    ),
    "ORG2.POLYMERS": Lesson(
        node="ORG2.POLYMERS",
        objective=(
            "Explain how the same acyl substitution chemistry builds polyesters "
            "and polyamides by step growth, and identify the small molecule "
            "lost as each linkage forms."
        ),
        build_on=(
            "You can form a single ester from an acid and an alcohol, and a "
            "single amide from an acid derivative and an amine. A polymer is "
            "that same bond formed over and over between molecules that each "
            "carry two reactive ends."
        ),
        core_idea=(
            "Give a monomer two functional ends and let the ester or amide "
            "forming reaction repeat, and the chain grows by step growth "
            "polymerisation. A diol and a diacid, or a molecule bearing both an "
            "alcohol and an acid, link through ester bonds into a polyester; a "
            "diamine and a diacid link through amide bonds into a polyamide, a "
            "nylon. Each new linkage is one nucleophilic acyl substitution and "
            "expels one small molecule, water for the direct condensation. "
            "Because any two ends can react, short pieces join to short pieces "
            "and the average chain length climbs steadily, which is what "
            "distinguishes step growth from a chain reaction that adds one "
            "monomer at a time."
        ),
        worked_example=(
            "Take a single ester linkage as the model reaction and account for "
            "the atoms. An acid end and an alcohol end condense the way acetic "
            "acid, C2H4O2, and methanol, CH4O, give methyl acetate, C3H6O2, and "
            "water, H2O, balancing as C3H8O3 on both sides. Now imagine the "
            "acid carried a second acid group at its far end and the alcohol a "
            "second alcohol group at its own: the ester just formed still has a "
            "free acid and a free alcohol available, and the same condensation "
            "repeats at those ends, losing another water each time. Repeated "
            "indefinitely, this is a polyester, and one water molecule leaves "
            "for every bond made."
        ),
        try_it_prompt=(
            "Nylon is a polyamide made from a diamine and a diacid. Which acyl "
            "substitution forms each linkage, and what small molecule leaves "
            "when an acid and an amine condense directly?"
        ),
        try_it_answer=(
            "Each linkage is an amide formed by nucleophilic acyl substitution, "
            "the amine displacing the acid's leaving group. When a carboxylic "
            "acid and an amine condense directly, the small molecule lost is "
            "water, one per amide bond formed."
        ),
        pitfall=(
            "The common confusion is treating these condensation polymers like "
            "addition polymers, where monomers add without losing anything. "
            "Step growth polyesters and polyamides expel a small molecule at "
            "every bond, so the repeat unit is lighter than the monomers that "
            "made it, and the mechanism is substitution, not addition to a "
            "double bond."
        ),
        claims=(
            Formula(ACETIC_ACID, "C2H4O2", "acid end, model for a diacid"),
            Formula(METHANOL, "CH4O", "alcohol end, model for a diol"),
            Formula(METHYL_ACETATE, "C3H6O2", "the model ester linkage"),
            Formula(WATER, "H2O", "lost per ester or amide bond formed"),
        ),
    ),
}

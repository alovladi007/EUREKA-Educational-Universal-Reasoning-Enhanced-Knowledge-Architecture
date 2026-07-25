"""ORG2 Unit 3: Reactions of Aromatic Compounds.

Nine nodes covering electrophilic aromatic substitution and its electrophiles,
Friedel-Crafts chemistry, how substituents change a ring's reactivity and steer
the next group, the two nucleophilic routes onto a ring, side-chain and ring
reduction chemistry, and the order-of-operations logic that makes a
poly-substituted target reachable at all.

Every structural fact below was derived with RDKit before it was written into a
claim, not written from memory and checked afterwards. Two facts in this unit
are the kind that read fluently while being wrong. The first is that
substitution keeps the ring aromatic: benzene and bromobenzene both carry four
degrees of unsaturation, so the ring survives, and that is a derivation, not an
assertion. The second is symmetry: para products give fewer distinct proton
environments than ortho or meta, and exactly how many is a symmetry count that
was read out of the structure rather than guessed.

Two things this file deliberately does not do. It states no nitration
procedure, quantity, temperature or condition, and it never draws a
poly-nitrated ring; nitration appears only as the conceptual installation of a
single nitro group onto an ordinary teaching substrate. And it does not use the
claim system to assert that a reaction proceeds: every mechanistic outcome here
is the standard textbook account and carries a citation rather than a
verification.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Unsaturation
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once so a claim and its prose cannot drift apart. Every
# formula, degree of unsaturation and proton-environment ratio written into a
# claim below was read back out of RDKit for the exact SMILES string here.
# ---------------------------------------------------------------------------

BENZENE = "c1ccccc1"
BROMOBENZENE = "Brc1ccccc1"
NITROBENZENE = "[O-][N+](=O)c1ccccc1"
BENZENESULFONIC = "OS(=O)(=O)c1ccccc1"
ETHYLBENZENE = "CCc1ccccc1"
ACETOPHENONE = "CC(=O)c1ccccc1"
TOLUENE = "Cc1ccccc1"
ANISOLE = "COc1ccccc1"
# The three mono-nitrotoluenes, one nitro group each, used to make the
# ortho/meta/para relationship and its symmetry consequences checkable.
O_NITROTOLUENE = "Cc1ccccc1[N+](=O)[O-]"
M_NITROTOLUENE = "Cc1cccc([N+](=O)[O-])c1"
P_NITROTOLUENE = "Cc1ccc([N+](=O)[O-])cc1"
MESITYLENE = "Cc1cc(C)cc(C)c1"  # 1,3,5-trimethylbenzene
CHLORONITROBENZENE = "[O-][N+](=O)c1ccc(Cl)cc1"  # 1-chloro-4-nitrobenzene
NITROANISOLE = "COc1ccc([N+](=O)[O-])cc1"  # 4-nitroanisole, an SNAr product
BENZYNE = "C1=CC=CC#C1"  # 1,2-didehydrobenzene
BENZOIC_ACID = "OC(=O)c1ccccc1"
CYCLOHEXA_1_4_DIENE = "C1=CCC=CC1"  # the Birch product from benzene
ANILINE = "Nc1ccccc1"

LESSONS_ORG2_U3 = {
    "ORG2.EASMECH": Lesson(
        node="ORG2.EASMECH",
        objective=(
            "Explain electrophilic aromatic substitution as addition of an "
            "electrophile followed by loss of a proton, and say why the net "
            "result is substitution rather than addition."
        ),
        build_on=(
            "You know from the aromaticity you met earlier that a benzene ring "
            "holds six electrons in a closed, unusually stable loop. This "
            "lesson is about what an electrophile does to that loop and why the "
            "ring insists on getting it back."
        ),
        core_idea=(
            "An electrophile does not add across the ring the way it would "
            "across an isolated alkene. It attacks in one step to give an "
            "arenium ion, a cation in which one ring carbon has gone "
            "tetrahedral and the positive charge is spread over the remaining "
            "five carbons. That intermediate has lost aromaticity, so it is "
            "high in energy and short-lived. Rather than trap a nucleophile and "
            "stay saturated, it throws off the proton on the carbon that was "
            "attacked, and the electrons of that carbon-hydrogen bond drop back "
            "into the ring. Aromaticity is restored, and the overall change is "
            "that one ring hydrogen has been replaced by the electrophile."
        ),
        worked_example=(
            "Follow benzene to bromobenzene. Benzene, C6H6, carries four "
            "degrees of unsaturation: three formal pi bonds and the ring. A "
            "bromine electrophile bonds to one carbon, giving the arenium ion, "
            "which is not aromatic. Now count the alternative endings. If a "
            "nucleophile added to the adjacent carbon, the product would be a "
            "non-aromatic dibromocyclohexadiene and the ring would stay broken. "
            "Instead the arenium ion loses the proton from the carbon bromine "
            "attacked. The product is bromobenzene, C6H5Br, and it still shows "
            "four degrees of unsaturation. The ring came back; that recovered "
            "aromatic stabilisation is why elimination wins over addition."
        ),
        try_it_prompt=(
            "In the arenium ion, which is more stable: trapping a nucleophile "
            "to give a saturated ring, or losing a proton? Say why in terms of "
            "aromaticity."
        ),
        try_it_answer=(
            "Losing the proton is far more favourable. Trapping a nucleophile "
            "would leave the ring saturated and non-aromatic, forfeiting the "
            "aromatic stabilisation permanently. Losing the proton restores the "
            "closed six-electron loop, and recovering that stabilisation is the "
            "driving force that makes substitution, not addition, the outcome."
        ),
        pitfall=(
            "Treating the ring like an ordinary alkene and expecting the "
            "electrophile and a nucleophile to add across two carbons. That is "
            "what happens to an isolated double bond, but an aromatic ring pays "
            "too much to stay saturated. The arenium ion is a real "
            "intermediate, not a product; the reaction is not finished until "
            "aromaticity is restored."
        ),
        claims=(
            Formula(BENZENE, "C6H6", "benzene"),
            Unsaturation(BENZENE, 4, "three pi bonds plus the ring"),
            Formula(BROMOBENZENE, "C6H5Br", "bromobenzene"),
            Unsaturation(
                BROMOBENZENE, 4,
                "same four degrees as benzene: the ring stayed aromatic",
            ),
            Source(
                "The mechanism is addition of the electrophile to give a "
                "resonance-stabilised arenium (Wheland) intermediate, followed "
                "by loss of a proton to restore aromaticity; the recovered "
                "aromatic stabilisation is why substitution is preferred over "
                "addition.",
                "Clayden, Organic Chemistry, chapter on electrophilic aromatic "
                "substitution.",
            ),
        ),
    ),
    "ORG2.EASREACTIONS": Lesson(
        node="ORG2.EASREACTIONS",
        objective=(
            "Describe how the electrophile is generated for halogenation, "
            "nitration and sulfonation, and track what each one does to the "
            "ring's formula and unsaturation."
        ),
        build_on=(
            "You have the arenium-ion mechanism. The mechanism is the same for "
            "each of these reactions; what changes is the electrophile, and "
            "each electrophile has to be made electrophilic enough to attack an "
            "aromatic ring in the first place."
        ),
        core_idea=(
            "Benzene is a weak nucleophile, so a reagent that would attack a "
            "plain alkene often needs activating before it will touch a ring. "
            "Halogenation uses a Lewis acid to polarise the halogen and deliver "
            "a halogen cation equivalent. Nitration proceeds through the "
            "nitronium ion, a linear cation supplied by a nitronium source; the "
            "ring then substitutes a single nitro group for a hydrogen. "
            "Sulfonation uses sulfur "
            "trioxide, whose sulfur is electron-poor, and it is notably "
            "reversible. In each case the arenium intermediate forms and then "
            "loses a proton, exactly as before."
        ),
        worked_example=(
            "Compare what each electrophile leaves behind. Bromination gives "
            "bromobenzene, C6H5Br, and the ring keeps its four degrees of "
            "unsaturation, so the aromatic system is intact. Nitration gives "
            "nitrobenzene, C6H5NO2, and here the count reads five, not four: "
            "the ring still contributes four, and the nitro group brings one "
            "more of its own because it contains a nitrogen-oxygen double bond. "
            "Sulfonation gives benzenesulfonic acid, C6H6O3S. The lesson is to "
            "separate the ring's unsaturation, which substitution preserves, "
            "from unsaturation carried in by the incoming group itself."
        ),
        try_it_prompt=(
            "Nitrobenzene has five degrees of unsaturation but the ring is "
            "still fully aromatic. Where does the fifth degree come from?"
        ),
        try_it_answer=(
            "From the nitro group, not the ring. The aromatic ring accounts for "
            "four degrees, exactly as in benzene and bromobenzene. The nitro "
            "group carries a nitrogen-oxygen double bond, and that pi bond is "
            "the fifth degree. Substitution left the ring's four untouched and "
            "appended a group that had unsaturation of its own."
        ),
        pitfall=(
            "Assuming every substitution leaves the total degree of "
            "unsaturation unchanged. It leaves the ring's contribution "
            "unchanged, which is the real point, but a group like nitro or a "
            "carbonyl brings its own pi bond and raises the molecular total. "
            "Count the ring and the substituent separately."
        ),
        claims=(
            Formula(BROMOBENZENE, "C6H5Br", "bromobenzene"),
            Unsaturation(BROMOBENZENE, 4, "aromatic ring only"),
            Formula(NITROBENZENE, "C6H5NO2", "nitrobenzene"),
            Unsaturation(
                NITROBENZENE, 5,
                "four for the ring plus one for the nitro N=O",
            ),
            Formula(BENZENESULFONIC, "C6H6O3S", "benzenesulfonic acid"),
            Source(
                "Halogenation delivers a halogen cation equivalent via a Lewis "
                "acid; nitration proceeds through the nitronium ion; "
                "sulfonation uses sulfur trioxide and is reversible.",
                "Carey and Sundberg, Advanced Organic Chemistry, Part A, "
                "chapter on aromatic substitution.",
            ),
        ),
    ),
    "ORG2.FRIEDELCRAFTS": Lesson(
        node="ORG2.FRIEDELCRAFTS",
        objective=(
            "Contrast Friedel-Crafts alkylation with acylation, and explain the "
            "two limits, carbocation rearrangement and over-reaction, that make "
            "acylation the more controllable of the two."
        ),
        build_on=(
            "Halogenation and nitration put a heteroatom on the ring. "
            "Friedel-Crafts is how you form a carbon-carbon bond to it instead, "
            "building a side chain rather than attaching a substituent group."
        ),
        core_idea=(
            "Alkylation generates a carbocation from an alkyl halide and a Lewis "
            "acid, and the ring attacks it. Two problems follow. The cation can "
            "rearrange before the ring reaches it, so a straight-chain reagent "
            "can deliver a branched group. And the product is an alkylbenzene, "
            "which is more reactive than the starting ring, so the reaction "
            "does not stop cleanly at one substitution. Acylation avoids both. "
            "Its electrophile is an acylium ion, stabilised by the neighbouring "
            "oxygen so it does not rearrange, and the product is a ketone whose "
            "carbonyl deactivates the ring, so a second acylation is slow. That "
            "is why acylation followed by reduction of the carbonyl is the "
            "clean way to install an unbranched chain."
        ),
        worked_example=(
            "Put an ethyl group and an acetyl group on benzene and compare. "
            "Alkylation with an ethyl source gives ethylbenzene, C8H10, with "
            "four degrees of unsaturation, all in the ring; but the ethyl "
            "cation is prone to problems and the product invites further "
            "alkylation. Acylation with an acetyl source gives acetophenone, "
            "C8H8O, five degrees of unsaturation, four in the ring and one in "
            "the carbonyl. The acylium ion does not rearrange, and the "
            "electron-poor carbonyl leaves the ring deactivated, so the "
            "reaction stops at one group. Reduce that carbonyl afterwards and "
            "you have the ethylbenzene you could not make cleanly by direct "
            "alkylation."
        ),
        try_it_prompt=(
            "Why does acylation reliably stop after one substitution while "
            "alkylation tends to keep going?"
        ),
        try_it_answer=(
            "Because the two products differ in reactivity. An acyl group is "
            "electron-withdrawing, so the ketone product is less reactive than "
            "the starting ring, and a second acylation is slow. An alkyl group "
            "is electron-donating, so the alkylbenzene product is more reactive "
            "than the starting ring, and it undergoes further alkylation "
            "readily."
        ),
        pitfall=(
            "Expecting a primary alkyl halide to deliver an unrearranged "
            "primary group. The carbocation intermediate can shift a hydride or "
            "an alkyl group to become more stable before the ring attacks, so "
            "a propyl reagent can give an isopropyl-substituted ring. If the "
            "target needs an unrearranged chain, acylate and then reduce."
        ),
        claims=(
            Formula(ETHYLBENZENE, "C8H10", "ethylbenzene"),
            Unsaturation(ETHYLBENZENE, 4, "aromatic ring only"),
            Formula(ACETOPHENONE, "C8H8O", "acetophenone"),
            Unsaturation(
                ACETOPHENONE, 5, "four for the ring plus one for the carbonyl",
            ),
            Source(
                "Alkylation carbocations can rearrange and the alkylated "
                "product is activated toward further substitution; acylium ions "
                "do not rearrange and the ketone product is deactivated, so "
                "acylation stops cleanly at one group.",
                "Clayden, Organic Chemistry, chapter on electrophilic aromatic "
                "substitution (Friedel-Crafts reactions).",
            ),
        ),
    ),
    "ORG2.ACTIVATING": Lesson(
        node="ORG2.ACTIVATING",
        objective=(
            "Classify a substituent as activating or deactivating from whether "
            "it donates or withdraws electron density, and rank rings by how "
            "readily they undergo substitution."
        ),
        build_on=(
            "You know a bare benzene ring reacts, if sluggishly. A substituent "
            "already on the ring changes how eagerly the ring reacts again, and "
            "the direction of that change follows from one property of the "
            "group."
        ),
        core_idea=(
            "A substituent that pushes electron density into the ring, by "
            "resonance donation from a lone pair or by the mild induction of an "
            "alkyl group, makes the ring more nucleophilic and speeds up "
            "substitution: it activates. A substituent that pulls electron "
            "density out, by resonance into a carbonyl or nitro group or by the "
            "induction of an electronegative atom, makes the ring less "
            "nucleophilic and slows substitution: it deactivates. The effect is "
            "large. A ring bearing a lone-pair donor reacts far faster than "
            "benzene, and a ring bearing a nitro group reacts far slower."
        ),
        worked_example=(
            "Rank toluene, anisole and nitrobenzene. Toluene, C7H8, carries a "
            "methyl group, a weak inductive donor, so it is somewhat more "
            "reactive than benzene. Anisole, C7H8O, carries a methoxy group "
            "whose oxygen lone pair donates strongly by resonance, so it is far "
            "more reactive still. Nitrobenzene, C6H5NO2, carries a nitro group "
            "that withdraws density powerfully by both resonance and induction, "
            "so it is strongly deactivated and reacts much more slowly than "
            "benzene. The order of reactivity is anisole above toluene above "
            "benzene above nitrobenzene."
        ),
        try_it_prompt=(
            "Methoxy has an electronegative oxygen bonded to the ring, yet "
            "anisole is strongly activated. How does an electron-withdrawing "
            "atom end up activating the ring?"
        ),
        try_it_answer=(
            "Because two effects run in opposite directions and resonance wins. "
            "Oxygen withdraws density by induction, which would deactivate, but "
            "it also donates a lone pair into the ring by resonance, which "
            "activates. For methoxy the resonance donation dominates, so the "
            "net effect is strong activation."
        ),
        pitfall=(
            "Reading the electronegativity of the attached atom and stopping "
            "there. Induction and resonance can pull in opposite directions, "
            "and for lone-pair donors like methoxy, amino and hydroxy the "
            "resonance donation is decisive. Judge the net effect, not the "
            "inductive one alone."
        ),
        claims=(
            Formula(TOLUENE, "C7H8", "toluene, a weakly activated ring"),
            Environments(
                TOLUENE, (3, 2, 2, 1),
                "methyl, plus ortho, meta and para ring protons",
            ),
            Formula(ANISOLE, "C7H8O", "anisole, a strongly activated ring"),
            Formula(NITROBENZENE, "C6H5NO2", "nitrobenzene, a deactivated ring"),
            Unsaturation(NITROBENZENE, 5, "ring plus the nitro N=O"),
            Source(
                "Reactivity order for these substrates is anisole greater than "
                "toluene greater than benzene greater than nitrobenzene; "
                "lone-pair donors and alkyl groups activate, nitro and carbonyl "
                "groups deactivate.",
                "Carey and Sundberg, Advanced Organic Chemistry, Part A, "
                "chapter on aromatic substitution (substituent effects).",
            ),
        ),
    ),
    "ORG2.DIRECTING": Lesson(
        node="ORG2.DIRECTING",
        objective=(
            "Predict whether a substituent sends the next group ortho and para "
            "or meta, and connect the product isomers by their constitution and "
            "their proton symmetry."
        ),
        build_on=(
            "You can say whether a substituent activates or deactivates. The "
            "same electronic reasoning also decides where the next group lands, "
            "because it decides which arenium ion is most stabilised."
        ),
        core_idea=(
            "Whichever position gives the most stabilised arenium ion is the "
            "position that reacts fastest. A donor stabilises the cation best "
            "when it sits ortho or para to the point of attack, because in "
            "those arrangements the positive charge lands on the carbon bearing "
            "the donor, where the donor can help. So donors, and also the "
            "halogens, are ortho/para directors. A withdrawing group does the "
            "opposite: it most destabilises the ortho and para cations, so "
            "attack goes to the least-bad position, meta. Ortho, meta and para "
            "products are constitutional isomers of one another, and they are "
            "distinguishable by symmetry: the para isomer is the most "
            "symmetric and shows the fewest distinct proton signals."
        ),
        worked_example=(
            "A methyl group is an ortho/para director, so putting a single "
            "nitro group onto toluene gives mainly the ortho and para products, "
            "with para usually predominating. All three possible products, "
            "ortho-, meta- and para-nitrotoluene, share the formula C7H7NO2 and "
            "differ only in where the nitro group sits, so they are "
            "constitutional isomers. Their symmetry sets them apart. "
            "Para-nitrotoluene has a mirror plane through the two substituents, "
            "so its protons fall into three environments, in the ratio "
            "3:2:2. Ortho- and meta-nitrotoluene have no such plane, and each "
            "shows five environments, 3:1:1:1:1. The para product is the one "
            "whose spectrum is simplest."
        ),
        try_it_prompt=(
            "Without drawing spectra, which of ortho-, meta- and "
            "para-nitrotoluene should give the fewest distinct proton signals, "
            "and why?"
        ),
        try_it_answer=(
            "Para-nitrotoluene. Its two substituents sit across the ring from "
            "each other, giving a mirror plane that makes the two protons on "
            "each side equivalent, so the ring protons collapse to two "
            "environments and the whole molecule to three. Ortho and meta lack "
            "that symmetry, so their four ring protons stay distinct and each "
            "shows five environments."
        ),
        pitfall=(
            "Calling the halogens deactivating, which they are, and concluding "
            "they must be meta directors. They are the exception: halogens "
            "withdraw density inductively so they slow the reaction, but their "
            "lone pairs still stabilise the ortho and para arenium ions, so "
            "they direct ortho and para. Reactivity and orientation are decided "
            "separately."
        ),
        claims=(
            Formula(O_NITROTOLUENE, "C7H7NO2", "ortho-nitrotoluene"),
            Formula(M_NITROTOLUENE, "C7H7NO2", "meta-nitrotoluene"),
            Formula(P_NITROTOLUENE, "C7H7NO2", "para-nitrotoluene"),
            Relationship(
                O_NITROTOLUENE, P_NITROTOLUENE, "constitutional",
                "same formula, nitro in a different ring position",
            ),
            Relationship(O_NITROTOLUENE, M_NITROTOLUENE, "constitutional"),
            Relationship(M_NITROTOLUENE, P_NITROTOLUENE, "constitutional"),
            Environments(
                P_NITROTOLUENE, (3, 2, 2),
                "para is the most symmetric: three environments",
            ),
            Environments(
                O_NITROTOLUENE, (3, 1, 1, 1, 1), "ortho: five environments",
            ),
            Environments(
                M_NITROTOLUENE, (3, 1, 1, 1, 1), "meta: five environments",
            ),
            Source(
                "Alkyl groups and lone-pair donors are ortho/para directors and "
                "the para product commonly predominates; strongly withdrawing "
                "groups such as nitro are meta directors; halogens deactivate "
                "yet direct ortho/para.",
                "Clayden, Organic Chemistry, chapter on electrophilic aromatic "
                "substitution (directing effects).",
            ),
        ),
    ),
    "ORG2.MULTIPLESUB": Lesson(
        node="ORG2.MULTIPLESUB",
        objective=(
            "Predict where the next group goes when a ring already bears two "
            "substituents, resolving directing conflicts and allowing for "
            "steric blocking of the ortho position."
        ),
        build_on=(
            "You can read the directing effect of one substituent. A "
            "disubstituted ring has two of them voting at once, and sometimes "
            "they disagree, so you need a rule for who wins."
        ),
        core_idea=(
            "When two substituents direct to the same place, they reinforce and "
            "the outcome is clear. When they disagree, the stronger activator "
            "wins, because it controls the electron density that the "
            "electrophile responds to; a powerful donor overrides a weaker one "
            "and certainly overrides a deactivator. Sterics then act as a tie-"
            "breaker and a filter: the position between two groups already on "
            "adjacent carbons is crowded, so substitution there is disfavoured "
            "even when the electronics would allow it, and reaction moves to a "
            "less hindered site."
        ),
        worked_example=(
            "Mesitylene, 1,3,5-trimethylbenzene, C9H12, is what reinforcement "
            "looks like taken to its limit. Each methyl is an ortho/para "
            "director, and in the 1,3,5 pattern every methyl points the "
            "electrophile at the same three positions, the 2, 4 and 6 carbons, "
            "which is why that substitution pattern is so common. The molecule "
            "is highly symmetric: its nine methyl protons are all equivalent "
            "and its three ring protons are all equivalent, giving two "
            "environments in the ratio 9:3. Contrast a ring where a strong "
            "donor and a weak one disagree; there the donor's preferred "
            "positions win, and any site wedged between two adjacent groups is "
            "avoided on steric grounds."
        ),
        try_it_prompt=(
            "A ring carries a strongly activating group and, meta to it, a "
            "weakly activating alkyl group whose preferences point elsewhere. "
            "Which substituent decides where the next group goes?"
        ),
        try_it_answer=(
            "The strongly activating group. It dominates the ring's electron "
            "density, so the electrophile reacts at the positions that group "
            "favours. The weaker alkyl director yields; its influence shows up "
            "only in fine selectivity, not in the overall outcome."
        ),
        pitfall=(
            "Adding up directing effects as if each substituent gets an equal "
            "vote. They are not equal. A strong donor overrides a weak one "
            "rather than averaging with it, and a crowded position between two "
            "adjacent groups can be shut out entirely by sterics regardless of "
            "what the electronics say."
        ),
        claims=(
            Formula(MESITYLENE, "C9H12", "mesitylene, 1,3,5-trimethylbenzene"),
            Environments(
                MESITYLENE, (9, 3),
                "three equivalent methyls and three equivalent ring protons",
            ),
            Formula(TOLUENE, "C7H8", "a mono-substituted reference ring"),
            Source(
                "Where two substituents direct to different positions the more "
                "strongly activating group controls orientation, and "
                "substitution between two groups on adjacent carbons is "
                "suppressed by steric crowding.",
                "Carey and Sundberg, Advanced Organic Chemistry, Part A, "
                "chapter on aromatic substitution (polysubstituted benzenes).",
            ),
        ),
    ),
    "ORG2.NAS": Lesson(
        node="ORG2.NAS",
        objective=(
            "Distinguish the two ways a nucleophile can substitute onto a ring, "
            "the addition-elimination route needing an electron-poor ring and "
            "the benzyne route forced by a strong base."
        ),
        build_on=(
            "Every substitution so far has had the ring act as the nucleophile "
            "toward an electrophile. This lesson turns that around: the ring "
            "becomes the electrophile and a nucleophile displaces a leaving "
            "group. That only works under special circumstances, which is the "
            "point."
        ),
        core_idea=(
            "In the addition-elimination route the nucleophile adds to the "
            "carbon bearing the leaving group, giving a Meisenheimer complex in "
            "which the negative charge is delocalised onto the ring, and then "
            "the leaving group departs. That delocalised anion needs an "
            "electron-withdrawing group ortho or para to the leaving group to "
            "be stable enough to form, so an unactivated ring does not react "
            "this way. The benzyne route is different: a very strong base "
            "removes a ring proton next to the leaving group, the leaving group "
            "departs, and a strained triple-bond-like benzyne forms. The "
            "nucleophile then adds across it, and because it can add to either "
            "of the two benzyne carbons the incoming group can end up on a "
            "carbon adjacent to where the leaving group was."
        ),
        worked_example=(
            "Take 1-chloro-4-nitrobenzene, C6H4ClNO2, which has a nitro group "
            "para to the chlorine. A nucleophile such as methoxide adds to the "
            "chlorine-bearing carbon; the resulting negative charge is carried "
            "in part onto the oxygen atoms of the para nitro group, which is "
            "exactly why that group has to be there. Chloride then leaves, "
            "giving 4-nitroanisole, C7H7NO3. Now remove the nitro group's help: "
            "chlorobenzene has no such stabilisation, so it will not go by this "
            "route. Push it with a strong enough base and it substitutes "
            "instead through benzyne, C6H4, the strained didehydrobenzene, and "
            "the nucleophile can add to either benzyne carbon."
        ),
        try_it_prompt=(
            "Why does an electron-withdrawing group ortho or para to the "
            "leaving group make addition-elimination possible, while a group "
            "meta to it does not?"
        ),
        try_it_answer=(
            "Because the intermediate is an anion delocalised onto the ring, "
            "and only from the ortho and para positions can that negative "
            "charge be delocalised directly onto an electron-withdrawing group "
            "and stabilised. A meta group is in the wrong position to accept "
            "the charge through the pi system, so it cannot stabilise the "
            "Meisenheimer complex."
        ),
        pitfall=(
            "Assuming the nucleophile always ends up exactly where the leaving "
            "group was. That holds for addition-elimination, but the benzyne "
            "route breaks it: the symmetric intermediate lets the nucleophile "
            "add to either carbon, so the product can have the new group on the "
            "neighbouring carbon instead."
        ),
        claims=(
            Formula(CHLORONITROBENZENE, "C6H4ClNO2", "1-chloro-4-nitrobenzene"),
            Unsaturation(CHLORONITROBENZENE, 5, "ring plus the nitro N=O"),
            Formula(NITROANISOLE, "C7H7NO3", "4-nitroanisole, the SNAr product"),
            Formula(BENZYNE, "C6H4", "benzyne, 1,2-didehydrobenzene"),
            Source(
                "Addition-elimination requires an electron-withdrawing group "
                "ortho or para to the leaving group to stabilise the "
                "Meisenheimer complex; a strong base instead generates benzyne, "
                "and addition across it can give substitution on the adjacent "
                "carbon.",
                "Clayden, Organic Chemistry, chapter on nucleophilic aromatic "
                "substitution.",
            ),
        ),
    ),
    "ORG2.SIDECHAIN": Lesson(
        node="ORG2.SIDECHAIN",
        objective=(
            "Predict the products of benzylic oxidation and of Birch reduction, "
            "and say why the aromatic ring resists ordinary reduction while a "
            "benzylic position is unusually reactive."
        ),
        build_on=(
            "You have treated the ring as the reacting part. Now look at the "
            "carbon attached to the ring, the benzylic carbon, and at what it "
            "takes to disturb the aromatic ring itself."
        ),
        core_idea=(
            "The benzylic position is activated because any radical or cation "
            "there is stabilised by the ring, so a benzylic carbon-hydrogen "
            "bond is easier to break than an ordinary one. Strong oxidation "
            "exploits this: an alkyl group with at least one benzylic hydrogen "
            "is degraded all the way to a carboxylic acid attached to the ring, "
            "no matter how long the chain was. The ring, meanwhile, is stable "
            "enough to survive conditions that would reduce an alkene, so it "
            "does not hydrogenate easily. The Birch reduction is the way in: "
            "dissolving-metal conditions reduce the ring to a non-conjugated "
            "1,4-cyclohexadiene, stopping at two double bonds rather than going "
            "all the way to the cyclohexane."
        ),
        worked_example=(
            "Oxidise toluene, C7H8, and ethylbenzene, C8H10. Both have benzylic "
            "hydrogens, and strong oxidation cleaves the side chain down to the "
            "ring-bound carboxyl, so both give the same product, benzoic acid, "
            "C7H6O2, five degrees of unsaturation from the ring plus the "
            "carbonyl. The chain length did not matter; what mattered was a "
            "benzylic hydrogen to start the oxidation. Now reduce benzene by "
            "the Birch route: it does not saturate fully but stops at "
            "1,4-cyclohexadiene, C6H8, three degrees of unsaturation, which is "
            "the ring plus its two remaining, non-conjugated double bonds."
        ),
        try_it_prompt=(
            "Both toluene and tert-butylbenzene are oxidised under forcing "
            "conditions. Which gives benzoic acid, and which resists, and why?"
        ),
        try_it_answer=(
            "Toluene gives benzoic acid; tert-butylbenzene resists. Benzylic "
            "oxidation needs a hydrogen on the benzylic carbon to get started. "
            "Toluene's benzylic carbon has three; the tert-butyl group's "
            "benzylic carbon has none, so there is no benzylic C-H to abstract "
            "and the side chain is not degraded to the acid."
        ),
        pitfall=(
            "Expecting benzylic oxidation to trim a long chain down by one "
            "carbon, as if it nicked the end. It does not: it cleaves the whole "
            "side chain back to a single carboxyl carbon on the ring, so a "
            "propyl and an ethyl group both end up as the same benzoic acid. "
            "And a benzylic carbon with no hydrogen is not oxidised at all."
        ),
        claims=(
            Formula(TOLUENE, "C7H8", "toluene"),
            Formula(ETHYLBENZENE, "C8H10", "ethylbenzene"),
            Formula(BENZOIC_ACID, "C7H6O2", "benzoic acid, the shared product"),
            Unsaturation(BENZOIC_ACID, 5, "ring plus the carboxyl carbonyl"),
            Formula(CYCLOHEXA_1_4_DIENE, "C6H8", "1,4-cyclohexadiene"),
            Unsaturation(
                CYCLOHEXA_1_4_DIENE, 3,
                "the ring plus two non-conjugated double bonds",
            ),
            Source(
                "Strong oxidation degrades an alkyl side chain bearing a "
                "benzylic hydrogen to a ring carboxylic acid regardless of "
                "chain length; the Birch reduction gives the non-conjugated "
                "1,4-cyclohexadiene.",
                "Carey and Sundberg, Advanced Organic Chemistry, Part B, "
                "chapters on oxidation and on dissolving-metal reduction.",
            ),
        ),
    ),
    "ORG2.AROMATICSYNTH": Lesson(
        node="ORG2.AROMATICSYNTH",
        objective=(
            "Choose the order in which to install groups on a ring so that "
            "directing effects deliver the target substitution pattern, using "
            "the interconversion of nitro and amino groups as a control."
        ),
        build_on=(
            "You know each group's directing effect and how conflicts resolve. "
            "Synthesis is the reverse problem: given the pattern you want, "
            "decide the sequence of steps whose directing effects will produce "
            "it, because the same two groups installed in the other order can "
            "give the wrong isomer."
        ),
        core_idea=(
            "On a benzene ring the order of operations is not free, because each "
            "group installed changes where the next one can go. To reach a "
            "1,3-pattern you generally install a meta director first, then the "
            "second group follows it to the meta position; to reach a 1,2- or "
            "1,4-pattern you install an ortho/para director first. A powerful "
            "lever is that a nitro group, a meta director, can be reduced to an "
            "amino group, a strong ortho/para director, so installing nitrogen "
            "as nitro and later unmasking it as amino lets you switch the "
            "directing effect midway through a synthesis."
        ),
        worked_example=(
            "Suppose you need two groups meta to each other and one of them is "
            "the nitrogen substituent. Install it first as nitro, C6H5NO2, "
            "since a nitro group is a meta director and will steer the second "
            "group to the meta position. If instead you needed the nitrogen "
            "group to direct ortho and para, you would reduce the nitro group "
            "to the amino group of aniline, C6H7N, whose four degrees of "
            "unsaturation are all still in the intact ring, and let that strong "
            "donor direct the next step. The two possible target isomers, such "
            "as ortho- versus meta-nitrotoluene, C7H7NO2, are constitutional "
            "isomers, and which one you can reach is decided by the sequence."
        ),
        try_it_prompt=(
            "You want a ring with an amino group and a second group meta to it. "
            "Why is it hard to do this by aminating first, and how does "
            "starting from nitro fix it?"
        ),
        try_it_answer=(
            "An amino group is a strong ortho/para director, so if it is "
            "already present it sends the second group ortho and para, not "
            "meta. Starting from nitro fixes it: nitro is a meta director, so "
            "it places the second group meta, and only then do you reduce the "
            "nitro group to amino, arriving at the meta relationship you could "
            "not have directed to otherwise."
        ),
        pitfall=(
            "Installing groups in whatever order is convenient and assuming the "
            "target pattern will follow. It will not, because each group "
            "directs the next; the same pair of groups added in the reverse "
            "order can give a different constitutional isomer. Plan the "
            "sequence backward from the pattern you need."
        ),
        claims=(
            Formula(NITROBENZENE, "C6H5NO2", "nitro: a meta director to install first"),
            Formula(ANILINE, "C6H7N", "aniline, from reducing the nitro group"),
            Unsaturation(ANILINE, 4, "the ring is intact; nitrogen adds no pi bond"),
            Relationship(
                O_NITROTOLUENE, M_NITROTOLUENE, "constitutional",
                "the sequence decides which isomer is reachable",
            ),
            Formula(O_NITROTOLUENE, "C7H7NO2", "one possible target isomer"),
            Formula(M_NITROTOLUENE, "C7H7NO2", "the other"),
            Source(
                "Install a meta director before the group meant to sit meta to "
                "it, and an ortho/para director before groups meant to sit "
                "ortho or para; reducing a nitro group to an amino group "
                "switches a meta director into a strong ortho/para director.",
                "Clayden, Organic Chemistry, chapter on aromatic synthesis "
                "strategy (order of reactions).",
            ),
        ),
    ),
}

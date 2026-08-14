"""Lecture-note depth for ORG1 chapter 1, sections 6 and 7.

Split from extras_org1_ch1.py only for file size. Same rules apply: every
number sourced, every structural assertion also present in the lesson's claims
tuple where RDKit re-derives it.
"""

from __future__ import annotations

from app.data.lesson_extras import (
    Figure,
    LessonExtras,
    ReadingSection,
    Table,
    VideoLesson,
)

EXTRAS_ORG1_CH1B: dict[str, LessonExtras] = {}


def _add(extras: LessonExtras) -> None:
    EXTRAS_ORG1_CH1B[extras.node] = extras


# --------------------------------------------------------------------------
# 1.6 Inductive effects and bond polarity
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.INDUCTIVE",
    lead=(
        "Resonance moves electrons through $\\pi$ systems. Induction moves "
        "them through $\\sigma$ bonds, weakly, and with a reach of only two or "
        "three bonds - but it operates everywhere, it needs no special "
        "geometry, and it explains a large fraction of the acidity trends you "
        "will be asked to rank."
    ),
    sections=(
        ReadingSection(
            id="polarity",
            heading="Electronegativity, and the dipole it creates",
            body=(
                "Two atoms sharing a bonding pair rarely share it evenly. "
                "Electronegativity measures the pull an atom exerts on the "
                "electrons in a bond it participates in, and on the Pauling "
                "scale the values that matter to organic chemistry are: F 3.98, "
                "O 3.44, N 3.04, Cl 3.16, Br 2.96, I 2.66, C 2.55, H 2.20.\n\n"
                "Two facts in that list do most of the work. First, carbon and "
                "hydrogen differ by only 0.35, so a C-H bond is very nearly "
                "nonpolar, which is why hydrocarbons are unreactive and "
                "insoluble in water. Second, oxygen and nitrogen sit far above "
                "carbon, so every C-O and C-N bond is polarised toward the "
                "heteroatom - and those are precisely the bonds at which "
                "organic reactions happen.\n\n"
                "The polarity is written with partial charges: "
                "$\\mathrm{C^{\\delta+}-O^{\\delta-}}$. The symbol $\\delta$ "
                "means less than a full electron of charge, and unlike formal "
                "charge this is real charge, measurable as a dipole moment. "
                "Note that the two systems can disagree completely and both be "
                "right about their own question: a carbonyl carbon has formal "
                "charge zero and partial charge $\\delta+$. Formal charge asks "
                "about connectivity, partial charge about electronegativity.\n\n"
                "One caution on the halogens. Fluorine is the most "
                "electronegative element and gives the most polar C-X bond, "
                "yet C-F is also the strongest and least reactive carbon-"
                "halogen bond, and fluoroalkanes are poor substrates for "
                "substitution. Polarity says where the electrons sit; it does "
                "not say what breaks."
            ),
            table=Table(
                caption="Pauling electronegativities of the elements of organic chemistry",
                columns=("Element", "Electronegativity", "Bond to C", "Polarity of that bond"),
                rows=(
                    ("F", "3.98", "C-F", "strongly C to F"),
                    ("O", "3.44", "C-O", "strongly C to O"),
                    ("Cl", "3.16", "C-Cl", "moderately C to Cl"),
                    ("N", "3.04", "C-N", "moderately C to N"),
                    ("Br", "2.96", "C-Br", "weakly C to Br"),
                    ("I", "2.66", "C-I", "very weakly C to I"),
                    ("C", "2.55", "C-C", "none"),
                    ("H", "2.20", "C-H", "very weakly H to C"),
                ),
                source=(
                    "Pauling scale values, CRC Handbook of Chemistry and "
                    "Physics, 97th edition, section 9."
                ),
                note=(
                    "C and H differ by 0.35, which is why hydrocarbons behave "
                    "as though nonpolar."
                ),
            ),
            important=(
                "Partial charge and formal charge answer different questions "
                "and routinely disagree. The carbonyl carbon is formal charge "
                "zero and partial charge delta plus, and it is the partial "
                "charge that predicts where the nucleophile attacks."
            ),
        ),
        ReadingSection(
            id="through-sigma",
            heading="How the effect propagates, and how fast it dies",
            body=(
                "An electronegative atom pulls density out of the bond it is "
                "in. That leaves the adjacent carbon slightly electron poor, "
                "so it pulls a little harder on the next bond along, which "
                "leaves the carbon after that slightly poorer again. The "
                "effect relays down the $\\sigma$ framework, and it attenuates "
                "sharply - roughly a factor of three per bond.\n\n"
                "The attenuation is measurable in the butanoic acid series. "
                "Butanoic acid is pKa 4.82. Put a chlorine on C2, next to the "
                "carboxyl, and it falls to 2.86 - two full units, a hundredfold "
                "increase in acidity. Move the same chlorine to C3 and you "
                "recover most of that, pKa 4.05. Move it to C4 and it is 4.52, "
                "almost back to the parent. One atom, three positions, and its "
                "influence essentially gone by the third bond.\n\n"
                "Effects also add. Acetic acid is 4.76; chloroacetic acid "
                "2.86; dichloroacetic acid 1.29; trichloroacetic acid 0.65. "
                "Each chlorine buys roughly another order of magnitude and a "
                "half, and by three of them a carboxylic acid is as strong as "
                "a mineral acid.\n\n"
                "The mechanism of the acidity change is worth stating "
                "explicitly, because it is the reasoning pattern the whole "
                "acid-base chapter runs on. The electron-withdrawing group "
                "does not make the O-H bond weaker in any direct sense. It "
                "stabilises the *conjugate base* - the carboxylate anion - by "
                "pulling some of that negative charge away from the oxygens "
                "and spreading it over the chain. A more stable conjugate base "
                "means the deprotonation equilibrium sits further right, which "
                "means a stronger acid. Always reason about the anion.\n\n"
                "Look once more at how the two series in the table scale, "
                "because each carries a moral. Down the butanoic acid rows, "
                "divide each change by the one before it: 1.96, then 0.77, "
                "then 0.30, each step passing on roughly the same fraction "
                "of the effect it received. That is what attenuation by a "
                "roughly constant factor per bond means, and it is why the "
                "honest summary is a ratio - roughly a third survives each "
                "bond - rather than a fixed number of pKa units per bond. "
                "Across the chloroacetic rows the additivity is real but "
                "imperfect: the first chlorine is worth 1.90 units, the "
                "second only 1.57, the third 0.64. Each successive chlorine "
                "acts on an anion the previous ones have already stabilised, "
                "so there is less charge left to spread and less to gain by "
                "spreading it. Treat additivity as a first estimate, expect "
                "diminishing returns, and trust the estimate most for the "
                "first substituent. For ranking problems that is comfortably "
                "enough: distance first, then count, and never let a "
                "substituent three or more bonds from the site outweigh one "
                "adjacent to it."
            ),
            table=Table(
                caption=(
                    "Inductive withdrawal by distance and by number, in the "
                    "carboxylic acids"
                ),
                columns=("Acid", "Substituent position", "pKa", "Change vs parent"),
                rows=(
                    ("butanoic acid", "none", "4.82", "-"),
                    ("2-chlorobutanoic acid", "C2, one bond away", "2.86", "-1.96"),
                    ("3-chlorobutanoic acid", "C3, two bonds away", "4.05", "-0.77"),
                    ("4-chlorobutanoic acid", "C4, three bonds away", "4.52", "-0.30"),
                    ("acetic acid", "none", "4.76", "-"),
                    ("chloroacetic acid", "one Cl", "2.86", "-1.90"),
                    ("dichloroacetic acid", "two Cl", "1.29", "-3.47"),
                    ("trichloroacetic acid", "three Cl", "0.65", "-4.11"),
                ),
                source=(
                    "Aqueous pKa values as used throughout this course and in "
                    "app.data.claims."
                ),
                note=(
                    "Distance kills the effect: by three bonds the chlorine "
                    "has lost 85 percent of its influence."
                ),
            ),
            figure=Figure(
                stem="org1-inductive-decay",
                caption=(
                    "Inductive withdrawal falls off with distance. The change "
                    "in pKa relative to butanoic acid is plotted against the "
                    "number of bonds between the chlorine and the carboxyl "
                    "carbon."
                ),
                alt=(
                    "A bar chart with three bars falling steeply from left to "
                    "right: 1.96 pKa units at one bond, 0.77 at two bonds, "
                    "0.30 at three bonds, each bar labelled with the "
                    "corresponding chlorobutanoic acid."
                ),
            ),
        ),
        ReadingSection(
            id="vs-resonance",
            heading="Induction against resonance",
            body=(
                "Both effects redistribute electron density and you will "
                "constantly have to say which is operating. Four differences "
                "separate them.\n\n"
                "**Path.** Induction travels through $\\sigma$ bonds; "
                "resonance requires a continuous $\\pi$ system or an adjacent "
                "p orbital.\n\n"
                "**Range.** Induction is dead by three or four bonds; "
                "resonance carries undiminished across an entire conjugated "
                "system, however long.\n\n"
                "**Magnitude.** Resonance is usually the larger effect where "
                "both are available. Phenol at pKa 10 against cyclohexanol at "
                "16 is six units bought almost entirely by delocalisation into "
                "the ring.\n\n"
                "**Geometry.** Induction has no geometric requirement. "
                "Resonance requires the orbitals to be parallel, so a "
                "substituent twisted out of the plane of a ring loses its "
                "resonance interaction while keeping its inductive one - a "
                "fact that has been used deliberately to separate the two "
                "experimentally.\n\n"
                "The two can also oppose each other, and the halogens on a "
                "benzene ring are the standard case. Chlorine withdraws "
                "inductively, which deactivates the ring toward electrophilic "
                "substitution. Chlorine also donates a lone pair by resonance, "
                "which directs incoming electrophiles ortho and para. Both are "
                "true at once, and the observed behaviour - deactivating but "
                "ortho/para directing - is exactly the sum. When a substituent "
                "seems to behave inconsistently, check whether it is doing one "
                "thing inductively and the opposite by resonance."
            ),
        ),
        ReadingSection(
            id="hyperconjugation",
            heading="Hyperconjugation, the third donor",
            body=(
                "There is a third way electron density moves, weaker than "
                "either of the other two, and it is responsible for a set of "
                "stability orderings that otherwise have to be memorised.\n\n"
                "**Hyperconjugation** is donation from a filled $\\sigma$ bond "
                "- almost always a C-H bond - into an adjacent empty or "
                "partially empty $p$ orbital. It needs the same parallel "
                "geometry resonance does, because it is the same kind of "
                "orbital overlap, and it is weak because a $\\sigma$ bond is a "
                "reluctant donor: its electrons are already holding two atoms "
                "together.\n\n"
                "Its payoff is carbocation stability. A tertiary carbocation "
                "has nine C-H bonds on the three attached carbons positioned "
                "to donate into the empty $p$ orbital. A secondary one has "
                "six, a primary three, and methyl none. The observed order - "
                "tertiary above secondary above primary above methyl - tracks "
                "that count exactly, and the gaps are large: roughly 60 kJ/mol "
                "from primary to secondary and another 60 from secondary to "
                "tertiary. That ordering decides which product forms in every "
                "reaction that passes through a carbocation, which makes it "
                "one of the most load bearing facts in the course.\n\n"
                "The same effect sets alkene stability. A more substituted "
                "alkene has more C-H bonds adjacent to the $\\pi$ system to "
                "donate into it, so tetrasubstituted beats trisubstituted "
                "beats disubstituted beats monosubstituted. Hydrogenation "
                "measures it directly: 1-butene releases 127 kJ/mol, "
                "cis-2-butene 120, trans-2-butene 115. All three give the same "
                "product, butane, so the differences in heat released are "
                "differences between the starting alkenes, and the more "
                "substituted and less strained one starts lower.\n\n"
                "Alkyl groups are often described as *inductively* electron "
                "donating, and that description does hyperconjugation a "
                "disservice. Carbon and hydrogen differ in electronegativity "
                "by 0.35, so there is very little inductive donation "
                "available; the stabilisation is overwhelmingly orbital "
                "overlap. It is worth getting right because the two make "
                "different predictions - an inductive effect would not care "
                "about geometry, and hyperconjugation does."
            ),
            table=Table(
                caption=(
                    "Heat of hydrogenation across the butene isomers, all "
                    "giving butane"
                ),
                columns=("Alkene", "Substitution", "Heat released (kJ/mol)"),
                rows=(
                    ("1-butene", "monosubstituted", "127"),
                    ("cis-2-butene", "disubstituted, cis", "120"),
                    ("trans-2-butene", "disubstituted, trans", "115"),
                ),
                source=(
                    "Standard heats of hydrogenation, CRC Handbook of "
                    "Chemistry and Physics, 97th edition, section 5."
                ),
                note=(
                    "One product means the differences are differences in the "
                    "starting materials. Less heat released means the alkene "
                    "started lower, so trans-2-butene is the most stable of "
                    "the three."
                ),
            ),
            important=(
                "Hyperconjugation needs the C-H bond aligned with the p "
                "orbital it donates into. The same alignment requirement turns "
                "up again as the anti-periplanar geometry of E2 elimination - "
                "the same overlap, in a reaction rather than a resting state."
            ),
        ),
    ),
    key_takeaways=(
        "Electronegativity differences polarise bonds and create real, "
        "measurable partial charges, unlike formal charge.",
        "Induction travels through sigma bonds and attenuates by roughly a "
        "factor of three per bond; it is effectively gone by the third.",
        "Electron-withdrawing groups increase acidity by stabilising the "
        "conjugate base, not by weakening the O-H bond. Always reason about "
        "the anion.",
        "Effects add: acetic 4.76, chloroacetic 2.86, dichloro 1.29, trichloro "
        "0.65.",
        "Resonance is stronger, longer ranged, and needs parallel orbitals. "
        "Induction is weaker, short ranged, and needs no geometry.",
        "A halogen on benzene withdraws inductively and donates by resonance, "
        "which is why it deactivates yet directs ortho and para.",
    ),
    exam_tips=(
        "Rank-these-acids is one of the most common MCAT organic items, and "
        "induction plus resonance answers nearly all of them. Look at the "
        "conjugate base every time.",
        "Watch for distance. A substituent four carbons from the acidic proton "
        "is usually a distractor rather than the answer.",
    ),
))


# --------------------------------------------------------------------------
# 1.7 Functional groups
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="ORG1.FUNCTIONALGROUPS",
    lead=(
        "A functional group is a specific arrangement of atoms that reacts "
        "the same way wherever it appears. That transferability is what makes "
        "organic chemistry finite: there are millions of compounds and about "
        "twenty groups, and a molecule's chemistry is very largely the sum of "
        "the groups it carries."
    ),
    sections=(
        ReadingSection(
            id="why-transferable",
            heading="Why a group behaves the same in every molecule",
            body=(
                "The reason a ketone in a ten-carbon molecule reacts like a "
                "ketone in a three-carbon molecule is that the reactivity "
                "lives in the local electronic structure, and induction - the "
                "only thing that could transmit the rest of the molecule's "
                "influence through the $\\sigma$ framework - dies within a few "
                "bonds. Beyond three or four bonds from the group, the "
                "molecule is essentially invisible to it.\n\n"
                "The consequence is enormous practically. It means you learn "
                "the reactions of the carbonyl group once, and you can apply "
                "them to a steroid, a sugar and a solvent. It means "
                "retrosynthesis is possible at all, because a target can be "
                "read as a set of groups to be installed rather than an "
                "irreducible whole. And it means that when a group does *not* "
                "behave normally, that anomaly is information - it says "
                "something else in the molecule is close enough to interfere, "
                "which is usually a neighbouring group or a strained ring.\n\n"
                "The transferability is not perfect and the exceptions are "
                "instructive. An amide's nitrogen is not basic like an amine's, "
                "because its lone pair is delocalised into the adjacent "
                "carbonyl. A phenol is not weakly acidic like an alcohol, "
                "because its conjugate base delocalises into the ring. In both "
                "cases the anomaly comes from resonance, not induction - and "
                "resonance, unlike induction, does not attenuate with "
                "distance. When two groups are conjugated, treat them as one "
                "unit."
            ),
        ),
        ReadingSection(
            id="the-catalogue",
            heading="The groups, ordered by oxidation state at carbon",
            body=(
                "The usual way to present functional groups is as an "
                "unordered list to be memorised. There is a better "
                "organisation: sort them by how many bonds the key carbon has "
                "to heteroatoms. That number is essentially the carbon's "
                "oxidation state, and it turns the catalogue into a ladder "
                "that predicts what oxidises to what.\n\n"
                "**Zero bonds to heteroatom** is the hydrocarbons: alkane, "
                "alkene, alkyne, arene. Their chemistry is the C=C and C#C "
                "$\\pi$ systems and, for alkanes, almost nothing.\n\n"
                "**One bond to heteroatom.** Alcohol, ether, amine, alkyl "
                "halide, thiol. These are the substitution and elimination "
                "substrates, and the site of reaction is the polarised "
                "$\\mathrm{C^{\\delta+}}$.\n\n"
                "**Two bonds to heteroatom.** Aldehyde and ketone, both C=O; "
                "also the geminal diols and acetals that are their hydrates "
                "and protected forms. This is the carbonyl chemistry that "
                "occupies most of ORG2.\n\n"
                "**Three bonds to heteroatom.** Carboxylic acid, ester, "
                "amide, acyl chloride, anhydride, nitrile. These are the "
                "carboxylic acid derivatives, and they interconvert by "
                "nucleophilic acyl substitution in a reactivity order set by "
                "how good a leaving group each one has.\n\n"
                "Read as a ladder this immediately gives you the oxidation "
                "sequence: a primary alcohol has one bond to oxygen, an "
                "aldehyde two, a carboxylic acid three, and oxidation walks "
                "you up that ladder one rung at a time while reduction walks "
                "you down. A secondary alcohol can only reach a ketone, "
                "because its carbon has no second hydrogen to lose. A tertiary "
                "alcohol cannot be oxidised at all without breaking a C-C "
                "bond. Those three facts, which are usually memorised "
                "separately, are one fact about counting."
            ),
            table=Table(
                caption=(
                    "Functional groups by number of carbon-heteroatom bonds at "
                    "the functional carbon"
                ),
                columns=(
                    "C-heteroatom bonds", "Groups", "Characteristic chemistry",
                ),
                rows=(
                    ("0", "alkane, alkene, alkyne, arene",
                     "addition at pi bonds; alkanes largely inert"),
                    ("1", "alcohol, ether, amine, alkyl halide, thiol",
                     "substitution and elimination"),
                    ("2", "aldehyde, ketone, acetal, hydrate",
                     "nucleophilic addition to C=O"),
                    ("3", "carboxylic acid, ester, amide, acyl chloride, "
                     "anhydride, nitrile",
                     "nucleophilic acyl substitution"),
                    ("4", "carbon dioxide, carbonate",
                     "outside the scope of the course"),
                ),
                source=(
                    "Classification by bond count; the oxidation-state "
                    "reading follows directly from it."
                ),
                note=(
                    "Oxidation moves a carbon up this table, reduction moves "
                    "it down, and each step changes the count by one."
                ),
            ),
            figure=Figure(
                stem="org1-functional-groups",
                caption=(
                    "The functional groups of the course, arranged by the "
                    "number of bonds from the functional carbon to a "
                    "heteroatom. Reading left to right is oxidation; right to "
                    "left is reduction."
                ),
                alt=(
                    "Four labelled columns of skeletal structures. Column zero "
                    "shows alkane, alkene, alkyne and benzene; column one "
                    "alcohol, ether, amine and alkyl halide; column two "
                    "aldehyde and ketone; column three carboxylic acid, ester, "
                    "amide, acyl chloride and nitrile. Arrows across the top "
                    "read oxidation left to right and reduction right to left."
                ),
            ),
            important=(
                "A secondary alcohol oxidises to a ketone and stops, and a "
                "tertiary alcohol does not oxidise at all. Both follow from "
                "the bond count: oxidation replaces a C-H with a C-O, and a "
                "tertiary carbinol carbon has no C-H to replace."
            ),
        ),
        ReadingSection(
            id="priority",
            heading="Priority, and what it is for",
            body=(
                "When a molecule carries several groups, nomenclature needs a "
                "rule for which one names it. The IUPAC priority order runs, "
                "highest first: carboxylic acid, ester, amide, nitrile, "
                "aldehyde, ketone, alcohol, amine, alkene and alkyne, then "
                "halide and alkoxy, which are only ever prefixes.\n\n"
                "The highest priority group present becomes the suffix and "
                "gets the lowest possible locant; everything else becomes a "
                "prefix. So a molecule with both an alcohol and a ketone is "
                "named as a hydroxy-ketone, not a keto-alcohol, and the "
                "numbering starts from whichever end gives the ketone the "
                "lower number.\n\n"
                "The ordering is not arbitrary, and noticing why makes it much "
                "easier to remember: it very nearly tracks the oxidation "
                "ladder from the previous section. The three-bond groups come "
                "first, then the two-bond carbonyls, then the one-bond "
                "alcohols and amines, then the $\\pi$ bonds, then the "
                "substituents that are never suffixes. The list you have to "
                "memorise is mostly a list you already derived.\n\n"
                "A worked case makes the rule concrete. Take a four carbon "
                "chain carrying both of the groups above: "
                "$\\mathrm{CH_3COCH_2CH_2OH}$. The ketone outranks the "
                "alcohol, so the ketone is the suffix and the compound is "
                "named as a -one with a hydroxy- prefix. Then the numbering. "
                "Counting from the methyl end puts the carbonyl carbon at "
                "C2 and the alcohol carbon at C4; counting from the other "
                "end puts the alcohol at C1 but the carbonyl at C3. The "
                "suffix group takes the lower locant, so the first numbering "
                "wins: 4-hydroxybutan-2-one, not 1-hydroxybutan-3-one, and "
                "not any name ending in -ol.\n\n"
                "One misreading to keep out. Priority is a naming "
                "convention, not a reactivity ranking. The suffix group is "
                "not the most reactive group in the molecule, and the list "
                "predicts nothing about which site reacts first. The "
                "carboxylic acid derivatives make the point sharply: toward "
                "nucleophilic acyl substitution the acyl chloride is the "
                "most reactive of them and the amide the least, an order set "
                "by leaving group ability that the naming priority does not "
                "even attempt to track. Use the list at exactly one moment - "
                "choosing the suffix and the locants - and put it away when "
                "the question turns to what the molecule will do."
            ),
        ),
        ReadingSection(
            id="recognising-in-the-wild",
            heading="Recognising groups in a molecule you have not seen",
            body=(
                "Every organic passage you will meet hands you an unfamiliar "
                "structure and expects you to read it in a few seconds. The "
                "skill is not memorising more structures; it is a scan you "
                "run in a fixed order.\n\n"
                "**First, find every heteroatom.** Skeletal notation hides "
                "carbon and hydrogen and draws everything else explicitly, so "
                "the atoms that are written are exactly the atoms that matter. "
                "Circle each O, N, S and halogen in your head. On a molecule "
                "with forty carbons this reduces the problem to four or five "
                "sites.\n\n"
                "**Second, at each heteroatom ask what carbon it is attached "
                "to.** An oxygen singly bonded to a carbon that carries a "
                "hydrogen is an alcohol; to two carbons, an ether. An oxygen "
                "double bonded to carbon is a carbonyl, and then the question "
                "becomes what else that carbonyl carbon carries: an H makes it "
                "an aldehyde, another carbon a ketone, an OH a carboxylic "
                "acid, an OR an ester, an N an amide. That single follow up "
                "question separates five of the most commonly confused groups, "
                "and it is the same question every time.\n\n"
                "**Third, count degrees of unsaturation against the formula if "
                "you have one.** If the drawing accounts for fewer rings and "
                "$\\pi$ bonds than the formula demands, you have misread "
                "something.\n\n"
                "Two pairs cause most misreadings and both are settled by "
                "looking for a carbonyl. Ester against ether: both show C-O-C, "
                "and the ester has a C=O on one of those carbons. Amide "
                "against amine: both show nitrogen bonded to carbon, and the "
                "amide has a C=O on it. The consequences are not cosmetic. An "
                "amine is basic and an amide is not, because the amide "
                "nitrogen's lone pair is delocalised into the carbonyl; an "
                "ether is inert and an ester hydrolyses. Reading the group "
                "wrongly means predicting the wrong chemistry, not just using "
                "the wrong name.\n\n"
                "A useful discipline while the scan is still slow: name the "
                "groups out loud in the order you find them, rather than "
                "trying to identify the whole molecule at once. A steroid is "
                "not a thing to recognise. It is four fused rings, a ketone, "
                "and an alcohol, and those three you already know."
            ),
        ),
    ),
    key_takeaways=(
        "A functional group reacts the same wherever it appears because "
        "induction dies within a few bonds, so the rest of the molecule is "
        "invisible to it.",
        "The exceptions - amide nitrogen, phenol - come from resonance, which "
        "does not attenuate. Conjugated groups behave as one unit.",
        "Sorting groups by the number of carbon-heteroatom bonds turns the "
        "catalogue into an oxidation ladder.",
        "Primary alcohol to aldehyde to carboxylic acid is walking up that "
        "ladder; secondary stops at ketone; tertiary cannot climb at all.",
        "IUPAC priority mostly follows the same ladder, so the naming order is "
        "largely derivable rather than memorised.",
    ),
    exam_tips=(
        "Recognising every group in an unfamiliar drawn structure is assumed "
        "background on the MCAT rather than tested directly. Speed here pays "
        "off on every organic passage.",
        "Ester versus ether and amide versus amine are the two most confused "
        "pairs. Check whether a carbonyl is present.",
    ),
    video=VideoLesson(
        slug="org1-oxidation-ladder",
        title="The oxidation ladder, one bond at a time",
        seconds=36,
        summary=(
            "A primary alcohol is drawn and its carbon highlighted with one "
            "bond to oxygen. Each step of the animation replaces one C-H with "
            "a C-O bond, climbing to aldehyde with two and carboxylic acid "
            "with three, then the sequence runs backward as reduction. A "
            "tertiary alcohol is shown failing to climb because its carbon "
            "carries no hydrogen."
        ),
    ),
))

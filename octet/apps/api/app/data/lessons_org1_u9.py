"""ORG1 Unit 9: Substitution and Elimination.

The keystone unit of the first semester. Four mechanisms compete for the same
substrate, and the thing that tells them apart is almost always stereochemical:
SN2 inverts, SN1 racemizes, E2 is stereospecific, E1 is not. Every one of those
statements is a claim about structure, so every one of them is carried below as
a claim the checker re-derives from SMILES rather than as a sentence the author
remembered.

Two derivations in this file were done by machine rather than by hand, because
by hand they are exactly the kind of thing that reads correctly and is wrong.

  The anti-periplanar mapping in ORG1.E2. Which diastereomer of
  2-bromo-3-methylpentane gives which alkene was settled by embedding each
  substrate in three dimensions, setting the Br-C2-C3-H dihedral to 180
  degrees, and measuring where the two methyl groups landed. The answer is
  counterintuitive on the page: the diastereomer whose methyls end up cis gives
  the E alkene, because on C3 the ethyl outranks the methyl.

  The cis and trans assignment in ORG1.E2RINGS, settled the same way, by
  fitting a plane through the six ring carbons and comparing which side each
  substituent sat on.

One result is worth flagging to anyone editing this file. The SN2 lesson makes
the point that inversion of configuration and a change of CIP letter are
different things, and it does so with a verified example where the letter does
not change. Do not "fix" that example.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Stereo, Unsaturation
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once so a claim and its prose cannot drift apart. Every
# descriptor in the comments was read back from RDKit, not reasoned out.
# ---------------------------------------------------------------------------

# SN2 with a change of letter. Inversion is encoded by keeping the atom order
# of the SMILES and flipping the chiral tag, which puts the incoming group
# where the leaving group was not.
BROMOBUTANE_S = "CC[C@H](C)Br"          # (S)-2-bromobutane
BROMOBUTANE_R = "CC[C@@H](C)Br"         # (R)-2-bromobutane
BUTANOL_R = "CC[C@@H](C)O"              # (R)-butan-2-ol, the inversion product of the S bromide
BUTANOL_S = "CC[C@H](C)O"               # (S)-butan-2-ol, the product SN2 does not give
NITRILE_S = "CC[C@H](C)C#N"             # (S)-2-methylbutanenitrile
NITRILE_R = "CC[C@@H](C)C#N"            # (R)-2-methylbutanenitrile, inversion product of the S bromide

# SN2 without a change of letter. Bromine outranks the ester carbon; the
# nitrile carbon does not, because O beats N at the first point of difference.
# So the incoming group falls from rank 1 to rank 2, and that transposition
# cancels the inversion in the label while changing nothing about the geometry.
BROMOESTER_S = "C[C@H](Br)C(=O)OCC"     # (S)-ethyl 2-bromopropanoate
CYANOESTER_S = "C[C@@H](C#N)C(=O)OCC"   # (S)-ethyl 2-cyanopropanoate, its inversion product

# SN1 and E1 share this substrate and this cation.
BROMOMETHYLHEXANE_S = "CC[C@](C)(Br)CCC"    # (S)-3-bromo-3-methylhexane
METHYLHEXANOL_S = "CC[C@](C)(O)CCC"         # (S)-3-methylhexan-3-ol
METHYLHEXANOL_R = "CC[C@@](C)(O)CCC"        # (R)-3-methylhexan-3-ol
METHYLHEX_2_ENE = "CC=C(C)CCC"              # 3-methylhex-2-ene
METHYLHEX_3_ENE = "CCC(C)=CCC"              # 3-methylhex-3-ene
ETHYLPENT_1_ENE = "C=C(CC)CCC"              # 2-ethylpent-1-ene

# SN2 substrate ladder.
BROMOMETHANE = "CBr"
BROMOBUTANE_1 = "CCCCBr"
BROMOPROPANE_2 = "CC(C)Br"
TBUTYL_BROMIDE = "CC(C)(C)Br"
NEOPENTYL_BROMIDE = "CC(C)(C)CBr"

# SN1 substrate ladder.
BENZYL_BROMIDE = "BrCc1ccccc1"
ALLYL_BROMIDE = "C=CCBr"
BROMOMETHYLBUTANE = "CC(C)C(C)Br"       # 2-bromo-3-methylbutane
METHYLBUTAN_2_OL_3 = "CC(C)C(C)O"       # 3-methylbutan-2-ol, unrearranged
METHYLBUTAN_2_OL_2 = "CCC(C)(C)O"       # 2-methylbutan-2-ol, after a hydride shift

# E2 stereospecificity. Descriptors are in atom index order, which for these
# SMILES is the bromine-bearing carbon first (named C2) then the methyl-bearing
# carbon (named C3).
BROMOMETHYLPENTANE_2R3R = "C[C@@H](Br)[C@H](C)CC"   # (2R,3R)-2-bromo-3-methylpentane
BROMOMETHYLPENTANE_2R3S = "C[C@@H](Br)[C@@H](C)CC"  # (2R,3S)-2-bromo-3-methylpentane
BROMOMETHYLPENTANE_2S3S = "C[C@H](Br)[C@@H](C)CC"   # (2S,3S), the mirror image of the 2R,3R
METHYLPENT_2_ENE_E = "C/C=C(\\C)CC"     # (E)-3-methylpent-2-ene, the two methyls cis
METHYLPENT_2_ENE_Z = "C/C=C(/C)CC"      # (Z)-3-methylpent-2-ene, the two methyls trans

# Zaitsev and Hofmann.
BROMOMETHYLBUTANE_2 = "CCC(C)(C)Br"     # 2-bromo-2-methylbutane
METHYLBUT_2_ENE = "CC=C(C)C"            # 2-methylbut-2-ene, trisubstituted
METHYLBUT_1_ENE = "C=C(C)CC"            # 2-methylbut-1-ene, disubstituted

# E2 in a ring. Descriptors are in atom index order, which for these SMILES is
# the methyl-bearing carbon first (named C2) then the bromine-bearing carbon
# (named C1).
BROMOMETHYLCYCLOHEXANE_CIS = "C[C@H]1CCCC[C@H]1Br"    # cis, (1R,2S)
BROMOMETHYLCYCLOHEXANE_TRANS = "C[C@H]1CCCC[C@@H]1Br"  # trans, (1S,2S)
METHYLCYCLOHEXENE_1 = "CC1=CCCCC1"      # 1-methylcyclohexene, trisubstituted
METHYLCYCLOHEXENE_3 = "CC1CCCC=C1"      # 3-methylcyclohexene, disubstituted

# Competition capstone.
BUT_2_ENE_E = "C/C=C/C"
BUT_1_ENE = "C=CCC"
METHYLPROPENE = "CC(=C)C"               # 2-methylpropene
MTBE = "COC(C)(C)C"                     # 2-methoxy-2-methylpropane

# Citations for the facts this system cannot derive from a structure.
HUGHES_INGOLD = (
    "Hughes, E. D.; Ingold, C. K. J. Chem. Soc. 1935, 244, the study that "
    "introduced the SN1 and SN2 labels; developed at length in Ingold, "
    "Structure and Mechanism in Organic Chemistry, 2nd ed., Cornell "
    "University Press, 1969."
)
PARKER_SOLVENTS = (
    "Parker, A. J. Protic-Dipolar Aprotic Solvent Effects on Rates of "
    "Bimolecular Reactions. Chem. Rev. 1969, 69, 1."
)
GRUNWALD_WINSTEIN = (
    "Grunwald, E.; Winstein, S. The Correlation of Solvolysis Rates. "
    "J. Am. Chem. Soc. 1948, 70, 846."
)
ELIEL_WILEN = (
    "Eliel, E. L.; Wilen, S. H. Stereochemistry of Organic Compounds, Wiley, "
    "1994, chapter on conformational analysis and its consequences for "
    "elimination."
)


LESSONS_ORG1_U9 = {
    "ORG1.SN2": Lesson(
        node="ORG1.SN2",
        objective=(
            "Draw the SN2 transition state for a given alkyl halide and "
            "nucleophile, predict the configuration of the product, and say "
            "what the second order rate law reveals about the mechanism."
        ),
        build_on=(
            "Unit 4 taught you that a stereocentre's arrangement in space is a "
            "physical fact and that R and S are labels for it. SN2 is the "
            "first reaction that changes that arrangement in a way you can "
            "predict, which turns the labels you learned to assign into "
            "evidence about how a reaction happens."
        ),
        core_idea=(
            "The nucleophile attacks the carbon on the face directly opposite "
            "the leaving group, because that is the only direction from which "
            "its lone pair can reach the antibonding orbital of the carbon to "
            "leaving group bond without running into the bonding electrons "
            "already there. Nothing is formed and then destroyed along the "
            "way: bond making and bond breaking happen in one step, through a "
            "single transition state in which the carbon carries a partial "
            "bond to the incoming group, a partial bond to the departing one, "
            "and three fully bonded groups arranged in a plane between them. "
            "Two consequences follow directly from that picture, and they are "
            "the whole content of the mechanism. Because both the substrate "
            "and the nucleophile are present in the only step there is, the "
            "rate depends on both concentrations, which is what second order "
            "means. And because the three retained groups have to fold away "
            "from the incoming nucleophile like an umbrella turning inside out "
            "in wind, the carbon ends up with its substituents in the mirrored "
            "arrangement. That is inversion of configuration, and it happens "
            "in every SN2 reaction without exception."
        ),
        worked_example=(
            "Treat (S)-2-bromobutane with hydroxide in a polar aprotic "
            "solvent. Find the electrophilic carbon first: C2, which carries "
            "bromine, a methyl, an ethyl and a hydrogen. Hydroxide approaches "
            "opposite the C-Br bond, bromide leaves as the oxygen bond forms, "
            "and the methyl, ethyl and hydrogen invert through the plane. The "
            "product is butan-2-ol with its spatial arrangement mirrored. Now "
            "put a letter on it, which is a separate step and needs its own "
            "ranking. In the substrate the priorities run bromine, ethyl, "
            "methyl, hydrogen. In the product they run hydroxyl, ethyl, "
            "methyl, hydrogen, so oxygen has taken the top rank that bromine "
            "held and the three retained groups keep the ranks they had. "
            "Nothing about the ranking was rearranged, so the inversion shows "
            "up in the label as well as in the geometry: (S)-2-bromobutane "
            "gives (R)-butan-2-ol. The enantiomeric alcohol, (S)-butan-2-ol, "
            "is not formed at all, which is why an SN2 product from a single "
            "enantiomer is optically active."
        ),
        try_it_prompt=(
            "(R)-2-bromobutane is treated with sodium cyanide in DMSO, giving "
            "2-methylbutanenitrile. Rank the four groups at the stereocentre "
            "of the product, then state its configuration. Do the ranking "
            "before you commit to a letter."
        ),
        try_it_answer=(
            "The product is (S)-2-methylbutanenitrile. At that carbon the "
            "nitrile carbon reads as (N, N, N) because the triple bond "
            "duplicates the nitrogen twice, which beats ethyl at (C, H, H) and "
            "methyl at (H, H, H), so the ranking is nitrile, ethyl, methyl, "
            "hydrogen. That is the same pattern the bromide had, with the "
            "incoming group taking rank 1 exactly as the leaving group held "
            "it, so the geometric inversion reads out as a change of letter "
            "and R gives S."
        ),
        pitfall=(
            "The belief to name here is that inversion of configuration means "
            "the CIP letter flips. It is an understandable belief, because in "
            "the two examples above it does flip, and most textbook cases "
            "behave that way. But the letter is bookkeeping over a priority "
            "ranking, and the ranking can be reordered by the substitution "
            "itself. Take (S)-ethyl 2-bromopropanoate and displace the bromide "
            "with cyanide. The geometry inverts, as it always does. The "
            "product is still (S). Bromine outranked the ester carbon in the "
            "substrate, but the nitrile carbon reads as (N, N, N) while the "
            "ester carbon reads as (O, O, O), and oxygen beats nitrogen at the "
            "first point of difference, so the incoming group arrives at rank "
            "2 rather than rank 1. One transposition of priority labels "
            "reverses the reading, the inversion reverses it again, and the "
            "two cancel. Inversion is a statement about where the atoms are. "
            "The letter is a statement about how you chose to number them."
        ),
        claims=(
            Formula(BROMOBUTANE_S, "C4H9Br", "2-bromobutane"),
            Stereo(BROMOBUTANE_S, ("S",), "(S)-2-bromobutane, the substrate"),
            Stereo(BUTANOL_R, ("R",), "(R)-butan-2-ol, the inversion product"),
            Formula(BUTANOL_R, "C4H10O", "butan-2-ol"),
            Relationship(
                BUTANOL_R, BUTANOL_S, "enantiomers",
                "SN2 gives one of these two and not the other, which is what "
                "makes the product optically active",
            ),
            Stereo(BROMOBUTANE_R, ("R",), "the try-it substrate"),
            Stereo(NITRILE_R, ("R",), "(R)-2-methylbutanenitrile, from the S bromide"),
            Stereo(NITRILE_S, ("S",), "(S)-2-methylbutanenitrile, from the R bromide"),
            Formula(NITRILE_S, "C5H9N", "2-methylbutanenitrile"),
            Stereo(BROMOESTER_S, ("S",), "(S)-ethyl 2-bromopropanoate"),
            Stereo(
                CYANOESTER_S, ("S",),
                "its inversion product is still (S); the geometry inverted and "
                "the priority ranking transposed, and the two cancel in the label",
            ),
            Formula(BROMOESTER_S, "C5H9BrO2", "ethyl 2-bromopropanoate"),
            Formula(CYANOESTER_S, "C6H9NO2", "ethyl 2-cyanopropanoate"),
            Source(
                "The SN2 rate law is first order in substrate and first order "
                "in nucleophile, so the reaction is second order overall.",
                HUGHES_INGOLD,
            ),
        ),
    ),
    "ORG1.SN2FACTORS": Lesson(
        node="ORG1.SN2FACTORS",
        objective=(
            "Rank substrates, nucleophiles, leaving groups and solvents for "
            "SN2, and decide which of two candidate reactions is faster."
        ),
        build_on=(
            "You have one picture of the SN2 transition state: a nucleophile "
            "and a leaving group on opposite sides of a carbon that briefly "
            "has five groups around it. All four variables in this lesson are "
            "consequences of that single picture, so none of them has to be "
            "memorised separately."
        ),
        core_idea=(
            "The substrate matters most, and it matters for a steric reason "
            "rather than an electronic one. Every alkyl group on the carbon "
            "under attack sits in the plane the incoming nucleophile has to "
            "pass through, so the order is methyl faster than primary, primary "
            "faster than secondary, and tertiary effectively not at all. The "
            "nucleophile matters because it appears in the rate law, and a "
            "more reactive nucleophile means a faster reaction; within a row "
            "of the periodic table a negative charge helps, and down a column "
            "polarizability helps because a large soft anion can begin bonding "
            "from further away. The leaving group has to be able to leave as a "
            "weak base, which puts iodide above bromide above chloride, with "
            "sulfonate esters in the same useful range and fluoride, hydroxide "
            "and alkoxide out of the running. The solvent matters because of "
            "what it does to the nucleophile: a polar aprotic solvent such as "
            "DMSO or acetone solvates the counter cation well and has no O-H "
            "or N-H to donate to the anion, leaving the anion comparatively "
            "unencumbered and reactive, while a polar protic solvent wraps "
            "each anion in a hydrogen bonded shell that has to be paid for "
            "before attack can begin."
        ),
        worked_example=(
            "Put 1-bromobutane in one flask and 2-bromo-2-methylpropane in "
            "another, add sodium iodide in acetone to both, and watch. The two "
            "substrates have the same molecular formula, C4H9Br, and the same "
            "leaving group on the same kind of carbon-halogen bond. The "
            "primary one is displaced readily. The tertiary one gives no SN2 "
            "product at any useful rate. Nothing electronic distinguishes "
            "them: what differs is that in the tertiary case three methyl "
            "groups occupy the equatorial region the iodide would have to pass "
            "through, so the trajectory opposite the C-Br bond is closed. That "
            "the two are constitutional isomers is the useful part of the "
            "comparison, because it removes every explanation except geometry. "
            "The point is not about counting carbons either. Neopentyl "
            "bromide, C5H11Br, is primary by every definition, and its nine "
            "equivalent methyl hydrogens give a single proton signal alongside "
            "the two on the CH2Br carbon. It is still slow at SN2, because the "
            "quaternary carbon one bond away blocks the same approach."
        ),
        try_it_prompt=(
            "The same substrate and the same sodium salt are run in two "
            "solvents, methanol and DMSO. Which reaction is faster, and what "
            "is being done to the nucleophile in the slower one?"
        ),
        try_it_answer=(
            "DMSO is faster, often by orders of magnitude. DMSO is polar "
            "aprotic: its oxygen coordinates the sodium cation, but it has no "
            "O-H to donate, so the anion is left relatively bare and its "
            "electrons are available. In methanol every anion sits at the "
            "centre of a shell of hydrogen bonds from the O-H groups. That "
            "shell stabilises the anion in the ground state, and stabilising a "
            "reactant without stabilising the transition state raises the "
            "barrier."
        ),
        pitfall=(
            "The error that shows up most is ranking leaving groups by "
            "electronegativity, which puts fluoride at the top and makes "
            "fluoroalkanes look like excellent substrates. The belief "
            "underneath is that the leaving group departs because it is "
            "electron hungry. It departs because it has to carry the electron "
            "pair away afterwards and live with it, so the property that "
            "matters is how weak a base it is, not how electronegative the "
            "atom is. Fluoride is a strong base and a poor leaving group. The "
            "same reasoning is what rules hydroxide out, which is why alcohols "
            "have to be converted to something else before they will undergo "
            "substitution."
        ),
        claims=(
            Formula(BROMOMETHANE, "CH3Br", "bromomethane, the fastest substrate"),
            Formula(BROMOBUTANE_1, "C4H9Br", "1-bromobutane, primary"),
            Formula(BROMOPROPANE_2, "C3H7Br", "2-bromopropane, secondary"),
            Formula(TBUTYL_BROMIDE, "C4H9Br", "2-bromo-2-methylpropane, tertiary"),
            Relationship(
                TBUTYL_BROMIDE, BROMOBUTANE_1, "constitutional",
                "same formula, same leaving group, opposite SN2 behaviour, so "
                "the difference cannot be electronic",
            ),
            Environments(
                TBUTYL_BROMIDE, (9,),
                "all nine hydrogens are equivalent by symmetry, a single signal",
            ),
            Formula(NEOPENTYL_BROMIDE, "C5H11Br", "neopentyl bromide, primary but hindered"),
            Environments(
                NEOPENTYL_BROMIDE, (9, 2),
                "nine equivalent methyl hydrogens and the two on the CH2Br carbon",
            ),
            Source(
                "SN2 rates fall steeply with substitution at the reacting "
                "carbon, in the order methyl, primary, secondary, tertiary, "
                "with tertiary substrates giving no bimolecular substitution "
                "at a useful rate.",
                HUGHES_INGOLD,
            ),
            Source(
                "Polar aprotic solvents accelerate bimolecular substitution by "
                "anionic nucleophiles relative to polar protic solvents, "
                "because hydrogen bonding to the anion stabilises the reactant "
                "more than the transition state.",
                PARKER_SOLVENTS,
            ),
            Source(
                "Leaving group ability in nucleophilic substitution tracks the "
                "weakness of the leaving group as a base, so iodide leaves more "
                "readily than bromide, bromide more readily than chloride, and "
                "fluoride and hydroxide are poor leaving groups.",
                "Standard treatment; see any introductory organic text's "
                "chapter on nucleophilic substitution at saturated carbon, for "
                "example Clayden, Organic Chemistry, 2nd ed.",
            ),
        ),
    ),
    "ORG1.SN1": Lesson(
        node="ORG1.SN1",
        objective=(
            "Describe the two steps of SN1, predict the stereochemical outcome "
            "from a single enantiomer of substrate, and explain why the rate "
            "law contains no nucleophile term."
        ),
        build_on=(
            "SN2 required an open trajectory to the back of the carbon, which "
            "is why tertiary substrates were dead ends. This lesson is what a "
            "substrate does instead when that trajectory is closed but the "
            "cation it would have to form is one it can afford."
        ),
        core_idea=(
            "SN1 has two steps and an intermediate between them. In the first "
            "step the carbon-halogen bond breaks on its own, with the solvent "
            "assisting, giving a carbocation and a halide ion. This step is "
            "slow and rate determining, and the nucleophile takes no part in "
            "it. In the second step the nucleophile bonds to the cation, which "
            "is fast, followed by loss of a proton if the nucleophile was "
            "neutral. Two consequences follow. First, because only the "
            "substrate appears in the rate determining step, the rate law is "
            "first order in substrate and zero order in nucleophile: adding "
            "more nucleophile does not make the reaction go faster, which is "
            "the observation the mechanism was invented to explain. Second, "
            "the carbocation is sp2 and flat, with an empty p orbital "
            "perpendicular to the plane of its three substituents. The "
            "nucleophile can bond into either lobe of that orbital, and the "
            "two approaches are close to equally likely, so a substrate that "
            "was a single enantiomer gives a product that is a roughly equal "
            "mixture of both. The stereochemical information the substrate "
            "carried is destroyed the moment the cation forms."
        ),
        worked_example=(
            "Warm (S)-3-bromo-3-methylhexane in aqueous acetone with nothing "
            "else added. C3 is the reacting carbon: it carries a methyl, an "
            "ethyl, a propyl and the bromine, four different groups, so it is "
            "a stereocentre and the substrate is optically active. The bromide "
            "ionizes to give the 3-methylhexan-3-yl cation, which is planar at "
            "C3 with the methyl, ethyl and propyl groups splayed at 120 "
            "degrees. Water now attacks, and there is no reason for it to "
            "prefer one face of that plane to the other. Attack from one face "
            "and loss of a proton gives (S)-3-methylhexan-3-ol; attack from "
            "the other gives (R)-3-methylhexan-3-ol. Those two are "
            "enantiomers, they are produced in nearly equal amounts, and the "
            "resulting sample rotates plane polarized light not at all. "
            "Compare that with the SN2 outcome from unit-standard conditions, "
            "where a single enantiomer of substrate would have given a single "
            "enantiomer of product. Racemization is the stereochemical "
            "signature of a planar intermediate."
        ),
        try_it_prompt=(
            "A single enantiomer of a tertiary bromide is solvolysed and the "
            "product alcohol shows zero optical rotation. Does that prove the "
            "mechanism was SN1? What would an SN2 reaction have given, and "
            "what other measurement would you want?"
        ),
        try_it_answer=(
            "It is strong evidence and not a proof. SN2 would have given a "
            "single enantiomer with inverted configuration, so an optically "
            "active sample; zero rotation rules that out and is what a planar "
            "intermediate captured from both faces predicts. To make the case "
            "you would also measure the kinetics. SN1 is first order in "
            "substrate and independent of nucleophile concentration, so "
            "doubling the water concentration should leave the rate alone. A "
            "stereochemical result and a kinetic result together identify a "
            "mechanism far more securely than either does by itself."
        ),
        pitfall=(
            "The word racemization gets read as a property of the molecule "
            "rather than of the sample, and learners conclude that the product "
            "is achiral or that the stereocentre has somehow been lost. Every "
            "molecule in that flask is chiral and every one of them has a "
            "stereocentre. What is true of the sample is that it contains "
            "equal numbers of two enantiomers whose rotations cancel. The "
            "second half of the same misconception is expecting exactly fifty "
            "fifty every time. Real SN1 reactions often show a small excess of "
            "the inverted product, because the departing halide has not "
            "diffused away and partly shields the face it left from, so the "
            "nucleophile arrives slightly more often on the other side."
        ),
        claims=(
            Stereo(BROMOMETHYLHEXANE_S, ("S",), "(S)-3-bromo-3-methylhexane"),
            Formula(BROMOMETHYLHEXANE_S, "C7H15Br", "3-bromo-3-methylhexane"),
            Stereo(METHYLHEXANOL_S, ("S",), "one face of the cation"),
            Stereo(METHYLHEXANOL_R, ("R",), "the other face"),
            Relationship(
                METHYLHEXANOL_S, METHYLHEXANOL_R, "enantiomers",
                "equal amounts of these two is what racemization means, and it "
                "is why the product sample has no net rotation",
            ),
            Formula(METHYLHEXANOL_R, "C7H16O", "3-methylhexan-3-ol"),
            Source(
                "The SN1 rate law is first order in substrate and zero order "
                "in nucleophile, because the nucleophile enters after the rate "
                "determining ionization.",
                HUGHES_INGOLD,
            ),
        ),
    ),
    "ORG1.SN1FACTORS": Lesson(
        node="ORG1.SN1FACTORS",
        objective=(
            "Rank substrates by the stability of the cation they would have to "
            "form, including resonance stabilised cases, explain what the "
            "solvent contributes, and predict when the carbon skeleton of the "
            "product will differ from that of the substrate."
        ),
        build_on=(
            "The SN1 rate is set entirely by the ionization step, so anything "
            "that lowers the energy of the cation or helps the two ions "
            "separate speeds the whole reaction up. This lesson is that one "
            "sentence worked out in detail."
        ),
        core_idea=(
            "Carbocation stability runs tertiary above secondary above primary "
            "above methyl, because each alkyl group donates electron density "
            "into the empty orbital through hyperconjugation and through its "
            "polarisable sigma bonds. Delocalisation does more than "
            "hyperconjugation does, so an allylic or benzylic cation, where "
            "the positive charge is shared over a pi system, competes with or "
            "beats a tertiary cation even when the carbon carrying the leaving "
            "group is primary. The solvent contributes in two ways at once: a "
            "high dielectric constant lets the ion pair come apart, and the "
            "O-H groups of a protic solvent hydrogen bond to the departing "
            "halide, which is exactly the stabilisation that slowed SN2 down "
            "and is exactly what SN1 needs. That is why the solvent preference "
            "of the two mechanisms is opposite. One further consequence "
            "belongs to the intermediate rather than to either step: a free "
            "carbocation can rearrange. A hydrogen or an alkyl group on an "
            "adjacent carbon can migrate with its bonding pair to the cationic "
            "carbon whenever doing so produces a more stable cation, and the "
            "product then has a different carbon skeleton from the substrate."
        ),
        worked_example=(
            "Warm 2-bromo-3-methylbutane, C5H11Br, in aqueous ethanol. "
            "Ionization at C2 gives a secondary cation, which is marginal. The "
            "neighbouring C3 carries a hydrogen and two methyl groups, so a "
            "1,2-hydride shift moves that hydrogen together with its bonding "
            "pair from C3 to C2, leaving the positive charge on C3, which now "
            "has three alkyl groups. The barrier to that shift is small and "
            "the cation it produces is far more stable, so it happens faster "
            "than water can capture the secondary cation. Water then bonds to "
            "C3, and the major product is 2-methylbutan-2-ol rather than the "
            "3-methylbutan-2-ol the substrate's connectivity would suggest. "
            "Those two alcohols are constitutional isomers, both C5H12O, and "
            "the skeleton changed because there was an intermediate with a "
            "lifetime. This is the sharpest experimental distinction between "
            "the two substitution mechanisms: SN2 has no intermediate, so an "
            "SN2 product never has a rearranged skeleton."
        ),
        try_it_prompt=(
            "Benzyl bromide and 1-bromobutane are both primary bromides. Put "
            "each in aqueous ethanol with no added nucleophile. Which "
            "solvolyses at a measurable rate, and what does the answer say "
            "about classifying substrates by degree alone?"
        ),
        try_it_answer=(
            "Benzyl bromide reacts and 1-bromobutane essentially does not. "
            "Ionizing 1-bromobutane would require a primary cation with "
            "nothing to stabilise it, which is prohibitive. Ionizing benzyl "
            "bromide gives a cation whose charge is delocalised into the ring, "
            "shared with the ortho and para positions, which costs far less. "
            "So primary and tertiary are useful shorthand for cation stability "
            "and nothing more; when resonance is available the shorthand "
            "breaks, and the underlying variable is what you should be reading."
        ),
        pitfall=(
            "The belief worth naming is that the substrate's classification is "
            "the mechanism, so that primary always means SN2 and tertiary "
            "always means SN1. Substitution degree is a proxy for cation "
            "stability, and proxies fail at the edges. Allylic and benzylic "
            "primary halides ionize readily, and a neopentyl halide is primary "
            "and does neither mechanism well. Ask what cation the substrate "
            "would have to form and how bad it would be, rather than counting "
            "attached carbons. The mirror image of the same error is expecting "
            "a rearrangement every time an SN1 reaction is run: rearrangement "
            "happens when a shift produces a more stable cation, and a "
            "tertiary cation with no better neighbour available has nowhere to "
            "go."
        ),
        claims=(
            Formula(BENZYL_BROMIDE, "C7H7Br", "benzyl bromide"),
            Unsaturation(
                BENZYL_BROMIDE, 4,
                "three pi bonds and a ring, which is the delocalisation the "
                "benzylic cation draws on",
            ),
            Formula(ALLYL_BROMIDE, "C3H5Br", "allyl bromide"),
            Unsaturation(ALLYL_BROMIDE, 1, "the C=C that stabilises the allylic cation"),
            Formula(BROMOBUTANE_1, "C4H9Br", "1-bromobutane, primary with no pi system"),
            Formula(BROMOMETHYLBUTANE, "C5H11Br", "2-bromo-3-methylbutane"),
            Formula(METHYLBUTAN_2_OL_3, "C5H12O", "3-methylbutan-2-ol, unrearranged"),
            Formula(METHYLBUTAN_2_OL_2, "C5H12O", "2-methylbutan-2-ol, after the hydride shift"),
            Relationship(
                METHYLBUTAN_2_OL_3, METHYLBUTAN_2_OL_2, "constitutional",
                "the rearranged product is a constitutional isomer of the "
                "unrearranged one, so the skeleton itself changed",
            ),
            Source(
                "Carbocation stability increases along the series methyl, "
                "primary, secondary, tertiary, and allylic and benzylic "
                "cations are stabilised further by delocalisation of the "
                "charge into the adjacent pi system.",
                "Standard treatment; see March's Advanced Organic Chemistry "
                "(Smith, 7th ed.), chapter on carbocations, for the "
                "thermochemical and spectroscopic evidence behind the order.",
            ),
            Source(
                "Solvolysis rates increase with the ionizing power of the "
                "solvent, which is what the Y scale measures and which is why "
                "SN1 prefers polar protic media while SN2 prefers polar "
                "aprotic ones.",
                GRUNWALD_WINSTEIN,
            ),
        ),
    ),
    "ORG1.E2": Lesson(
        node="ORG1.E2",
        objective=(
            "Draw the E2 transition state, identify which beta hydrogen can be "
            "removed, and predict the geometry of the alkene from the "
            "configuration of the substrate."
        ),
        build_on=(
            "SN2 needed one specific geometry, the nucleophile opposite the "
            "leaving group. E2 needs one too, and this one you can read "
            "straight off a Newman projection along the bond that is about to "
            "become the double bond."
        ),
        core_idea=(
            "E2 is one step. A base removes a hydrogen from the carbon next to "
            "the one bearing the leaving group, the electrons of that C-H bond "
            "swing over to become the pi bond, and the leaving group departs, "
            "all at once. For the electrons to move that way the C-H bond and "
            "the C-leaving group bond have to lie in the same plane, so that "
            "the orbitals which will become the two halves of the pi bond are "
            "already aligned. Both periplanar arrangements satisfy that, but "
            "anti, with a dihedral angle of 180 degrees, is strongly preferred "
            "over syn at 0 degrees, because anti is staggered rather than "
            "eclipsed and because the base and the leaving group stay out of "
            "each other's way. The rate is first order in substrate and first "
            "order in base, so E2 is second order like SN2. The stereochemical "
            "payoff comes from the fact that only one conformation reacts. "
            "Whatever the four remaining groups are doing in that conformation "
            "is what they will still be doing when the two carbons flatten, so "
            "the geometry of the alkene is fixed by the configuration of the "
            "substrate. That is what stereospecific means: different "
            "stereoisomers of starting material give different stereoisomers "
            "of product, as a consequence of the mechanism rather than of a "
            "preference."
        ),
        worked_example=(
            "Take (2R,3R)-2-bromo-3-methylpentane and a small strong base such "
            "as ethoxide, and eliminate across C2 and C3. C3 carries exactly "
            "one hydrogen, so there is only one conformation about the C2-C3 "
            "bond that puts it anti to the bromine, and the molecule has to "
            "rotate into it before anything happens. Look along C2 to C3 in "
            "that conformation, with bromine at the top of the front carbon "
            "and the C3 hydrogen at the bottom of the back one. The methyl on "
            "C2 and the methyl on C3 are then 60 degrees apart, which means "
            "that when the two carbons flatten those two methyls swing onto "
            "the same side of the new double bond. So the product is "
            "3-methylpent-2-ene with its methyls cis. Now name it, which needs "
            "priorities and not appearances: on C2 the methyl outranks the "
            "hydrogen, but on C3 the ethyl outranks the methyl, so methyls cis "
            "puts the two higher priority groups on opposite sides, and the "
            "product is the E isomer. Repeat with (2R,3S), which differs only "
            "at C3 and is therefore a diastereomer. Its anti-periplanar "
            "conformation puts the two methyls 180 degrees apart, they end up "
            "trans, and the product is the Z isomer. Same skeleton, same base, "
            "same conditions, different alkene, decided by stereochemistry "
            "alone."
        ),
        try_it_prompt=(
            "(2S,3S)-2-bromo-3-methylpentane is eliminated under the same "
            "conditions. Which alkene does it give, and what does your answer "
            "say about whether E2 distinguishes enantiomers or diastereomers?"
        ),
        try_it_answer=(
            "It gives the same (E)-3-methylpent-2-ene the (2R,3R) substrate "
            "gave. (2S,3S) is the mirror image of (2R,3R), so its "
            "anti-periplanar conformation is the mirror image too, and the two "
            "methyls again land on the same side. The alkene has no "
            "stereocentre and is achiral, so it cannot record which enantiomer "
            "it came from. Stereospecificity is a distinction between "
            "diastereomers: enantiomeric substrates give the same achiral "
            "product, and diastereomeric substrates give different products."
        ),
        pitfall=(
            "Two errors travel together here. The first is picking any beta "
            "hydrogen that looks convenient and then drawing whichever alkene "
            "is easier to draw. The belief underneath is that the reaction "
            "chooses its product, when what it chooses is a conformation, and "
            "the product follows from that with no further freedom. Rotate to "
            "the anti-periplanar arrangement on paper before you write "
            "anything down. The second is treating stereospecific and "
            "stereoselective as synonyms. Stereoselective means a reaction "
            "prefers one of several possible stereoisomeric products from one "
            "starting material. Stereospecific means each stereoisomer of "
            "starting material is channelled to its own product. E2 is "
            "stereospecific, which is a stronger and more useful statement."
        ),
        claims=(
            Formula(BROMOMETHYLPENTANE_2R3R, "C6H13Br", "2-bromo-3-methylpentane"),
            Stereo(
                BROMOMETHYLPENTANE_2R3R, ("R", "R"),
                "descriptors in atom index order, C2 then C3",
            ),
            Stereo(
                BROMOMETHYLPENTANE_2R3S, ("R", "S"),
                "the diastereomer, differing only at C3",
            ),
            Stereo(BROMOMETHYLPENTANE_2S3S, ("S", "S"), "the mirror image of the 2R,3R"),
            Relationship(
                BROMOMETHYLPENTANE_2R3R, BROMOMETHYLPENTANE_2R3S, "diastereomers",
                "one centre inverted, not both",
            ),
            Relationship(
                BROMOMETHYLPENTANE_2R3R, BROMOMETHYLPENTANE_2S3S, "enantiomers",
                "both centres inverted, and they give the same alkene",
            ),
            Formula(METHYLPENT_2_ENE_E, "C6H12", "3-methylpent-2-ene"),
            Unsaturation(METHYLPENT_2_ENE_E, 1, "one C=C, no ring"),
            Relationship(
                METHYLPENT_2_ENE_E, METHYLPENT_2_ENE_Z, "diastereomers",
                "the E and Z alkenes are diastereomers, and which one forms is "
                "decided by which diastereomer of substrate you started from",
            ),
            Source(
                "The E2 rate law is first order in substrate and first order "
                "in base, so the reaction is second order overall.",
                HUGHES_INGOLD,
            ),
            Source(
                "E2 elimination is stereospecific and proceeds through an "
                "anti-periplanar arrangement of the beta hydrogen and the "
                "leaving group, with syn elimination reserved for systems in "
                "which anti is geometrically impossible.",
                ELIEL_WILEN,
            ),
        ),
    ),
    "ORG1.ZAITSEV": Lesson(
        node="ORG1.ZAITSEV",
        objective=(
            "Predict which alkene predominates when a substrate has beta "
            "hydrogens on more than one carbon, and say when the choice of "
            "base reverses the answer."
        ),
        build_on=(
            "E2 fixes the geometry of the alkene once you know which hydrogen "
            "leaves. When more than one carbon carries a beta hydrogen, "
            "geometry is not enough, and you need a second rule for which "
            "carbon is deprotonated."
        ),
        core_idea=(
            "Where several alkenes are possible the more substituted one is "
            "usually the major product, an observation known as Zaitsev's "
            "rule. The reason is that alkene stability rises with the number "
            "of alkyl groups on the double bond, through hyperconjugation into "
            "the pi system, and the E2 transition state already has "
            "substantial double bond character, so the transition state "
            "leading to the more stable alkene sits lower. The rule describes "
            "a competition rather than a law, and the competition can be "
            "reversed by the base. A bulky base such as potassium "
            "tert-butoxide has trouble reaching a hydrogen on an interior "
            "carbon, which is surrounded by the substituents that would have "
            "made the alkene more substituted in the first place, and finds "
            "the hydrogens on a terminal methyl group much more accessible. "
            "With such a base the less substituted alkene predominates, the "
            "Hofmann product. The regiochemical answer is therefore a property "
            "of the base as much as of the substrate, and the two possible "
            "products are constitutional isomers: same molecular formula, "
            "double bond in a different place."
        ),
        worked_example=(
            "Take 2-bromo-2-methylbutane, C5H11Br, and run it with two "
            "different bases. Find the beta carbons first. The bromine is on "
            "C2, and the carbons next to it are C1, C3, and the methyl branch. "
            "Removing a hydrogen from the CH2 group at C3 gives "
            "2-methylbut-2-ene, in which the double bond carries three alkyl "
            "groups. Removing a hydrogen from either terminal methyl gives "
            "2-methylbut-1-ene, in which it carries two. Both products are "
            "C5H10 and both have one degree of unsaturation, so no formula "
            "measurement will tell them apart. With sodium ethoxide, a strong "
            "base that is small, the trisubstituted alkene is the major "
            "product, as Zaitsev's rule predicts. Switch to potassium "
            "tert-butoxide and the ratio inverts, with the terminal alkene "
            "becoming major. The substrate did not change and neither did the "
            "mechanism; the base changed which hydrogen it could reach."
        ),
        try_it_prompt=(
            "State the isomeric relationship between 2-methylbut-2-ene and "
            "2-methylbut-1-ene, give the degrees of unsaturation of each, and "
            "say what that tells you about identifying an elimination product "
            "from combustion analysis alone."
        ),
        try_it_answer=(
            "They are constitutional isomers: both are C5H10, both have one "
            "degree of unsaturation, and they differ in where the double bond "
            "sits rather than in how groups are arranged in space, so they are "
            "not stereoisomers. Because their formulas are identical, "
            "combustion analysis cannot distinguish them, and neither can a "
            "degree of unsaturation count. Regiochemistry is a question about "
            "connectivity, and it needs a method that reports on connectivity, "
            "such as NMR."
        ),
        pitfall=(
            "Zaitsev's rule gets memorised as a law of nature, so that the "
            "more substituted alkene is written down without reading the "
            "reagents. The belief underneath is that the product is a property "
            "of the substrate. It is the outcome of a competition between "
            "pathways, and a bulky base, a bulky substrate, or a leaving group "
            "that carries its own positive charge can all reverse it. It is "
            "also worth saying what does not change when the answer flips: "
            "Hofmann orientation is not a different mechanism. It is the same "
            "single step E2, with the same anti-periplanar requirement, "
            "removing a different hydrogen."
        ),
        claims=(
            Formula(BROMOMETHYLBUTANE_2, "C5H11Br", "2-bromo-2-methylbutane"),
            Formula(METHYLBUT_2_ENE, "C5H10", "2-methylbut-2-ene, the Zaitsev product"),
            Formula(METHYLBUT_1_ENE, "C5H10", "2-methylbut-1-ene, the Hofmann product"),
            Unsaturation(METHYLBUT_2_ENE, 1, "one C=C"),
            Unsaturation(METHYLBUT_1_ENE, 1, "one C=C, so the formula cannot tell them apart"),
            Relationship(
                METHYLBUT_2_ENE, METHYLBUT_1_ENE, "constitutional",
                "the Zaitsev and Hofmann products are constitutional isomers, "
                "not stereoisomers",
            ),
            Source(
                "Alkene stability increases with the number of alkyl groups on "
                "the double bond, as measured by heats of hydrogenation, which "
                "is the thermodynamic basis of Zaitsev's rule.",
                "Standard treatment; see any introductory organic text's "
                "chapter on alkene stability, for example Clayden, Organic "
                "Chemistry, 2nd ed.",
            ),
            Source(
                "Orientation in E2 elimination depends on the base as well as "
                "the substrate: small bases such as ethoxide give mainly the "
                "more substituted alkene, while the hindered base potassium "
                "tert-butoxide gives mainly the less substituted one.",
                "Standard treatment, following H. C. Brown's studies of steric "
                "effects in elimination; see March's Advanced Organic "
                "Chemistry (Smith, 7th ed.), chapter on elimination reactions.",
            ),
        ),
    ),
    "ORG1.E2RINGS": Lesson(
        node="ORG1.E2RINGS",
        objective=(
            "Decide from a chair drawing whether a substituted cyclohexyl "
            "halide can undergo E2 at all, and predict which alkene it gives "
            "when it can."
        ),
        build_on=(
            "You know that E2 needs the beta hydrogen and the leaving group "
            "anti-periplanar. In an open chain you rotate a single bond until "
            "you have that arrangement and the cost is small. A ring cannot "
            "rotate, so the same requirement becomes a hard constraint that "
            "can override everything else."
        ),
        core_idea=(
            "In a cyclohexane chair, the dihedral angle between a substituent "
            "on one carbon and a substituent on the next is either about 60 "
            "degrees or about 180 degrees, and the 180 degree case arises only "
            "when both are axial and therefore trans to each other. That is "
            "the entire content of E2 in rings: the leaving group must be "
            "axial, and there must be an axial hydrogen on an adjacent carbon "
            "for it to be anti to. Two things follow. A substrate whose "
            "leaving group prefers the equatorial position has to ring flip "
            "before it can react, and pays the conformational cost of doing "
            "so, which shows up as a slower reaction. And the choice of "
            "product is no longer settled by which alkene is more stable, "
            "because Zaitsev only operates among hydrogens the mechanism can "
            "actually remove. Which adjacent carbon carries an axial hydrogen "
            "in the reactive conformation decides the regiochemistry, and the "
            "answer can be the less substituted alkene."
        ),
        worked_example=(
            "Compare cis- and trans-1-bromo-2-methylcyclohexane, both "
            "C7H13Br, which differ only in which face of the ring the methyl "
            "sits on. In the cis isomer, (1R,2S), the two substituents cannot "
            "both be equatorial, so one chair has the bromine axial with the "
            "methyl equatorial. That is the reactive conformation, and because "
            "the methyl on C2 is equatorial, the hydrogen on C2 is axial and "
            "sits anti-periplanar to the bromine. Elimination across C1 and C2 "
            "gives 1-methylcyclohexene, which is trisubstituted, the Zaitsev "
            "product, and everything looks ordinary. Now the trans isomer, "
            "(1S,2S). Trans-1,2 substituents are either both equatorial or "
            "both axial, and the comfortable diequatorial chair has the "
            "bromine equatorial, where it cannot react at all. Forcing the "
            "bromine axial forces the methyl axial too, and now the hydrogen "
            "on C2 is equatorial and about 60 degrees from the C-Br bond, "
            "which is no use. The only axial hydrogen anti to the bromine is "
            "on C6, so elimination goes the other way and gives "
            "3-methylcyclohexene, which is disubstituted. Two diastereomers, "
            "the same base, and constitutionally different products, decided "
            "by which hydrogen the chair makes available."
        ),
        try_it_prompt=(
            "1-methylcyclohexene is the more stable of the two products. Why "
            "can trans-1-bromo-2-methylcyclohexane not give it, and what does "
            "that tell you about the standing of Zaitsev's rule relative to "
            "the anti-periplanar requirement?"
        ),
        try_it_answer=(
            "Because forming it would require removing the hydrogen on C2, and "
            "in the only conformation with the bromine axial that hydrogen is "
            "equatorial, roughly 60 degrees from the C-Br bond rather than "
            "180. E2 has no route to it. Zaitsev's rule ranks the products "
            "that a mechanism can reach; it does not create a pathway. The "
            "geometric requirement is a precondition and product stability is "
            "a preference, so when they disagree the precondition wins."
        ),
        pitfall=(
            "The trap is applying Zaitsev to a ring from the flat drawing, "
            "without ever putting the molecule in a chair. The belief "
            "underneath is that a rule predicts products directly, rather than "
            "describing which of several accessible outcomes is favoured. In a "
            "ring one of those outcomes is frequently not accessible at all. "
            "There is a second habit worth breaking alongside it: assuming the "
            "reaction runs through the most stable conformation. The reactive "
            "conformation is whichever one satisfies the geometry, even when "
            "it is the minor one at equilibrium, and a substrate that has to "
            "pay for an unfavourable chair reacts slowly rather than not at "
            "all."
        ),
        claims=(
            Formula(BROMOMETHYLCYCLOHEXANE_CIS, "C7H13Br", "1-bromo-2-methylcyclohexane"),
            Unsaturation(BROMOMETHYLCYCLOHEXANE_CIS, 1, "the ring, with no pi bond"),
            Stereo(
                BROMOMETHYLCYCLOHEXANE_CIS, ("S", "R"),
                "the cis isomer; descriptors are in atom index order, which is "
                "the methyl-bearing carbon (named C2) then the bromine-bearing "
                "carbon (named C1), so this is (1R,2S)",
            ),
            Stereo(
                BROMOMETHYLCYCLOHEXANE_TRANS, ("S", "S"),
                "the trans isomer in the same index order, so this is (1S,2S)",
            ),
            Relationship(
                BROMOMETHYLCYCLOHEXANE_CIS, BROMOMETHYLCYCLOHEXANE_TRANS,
                "diastereomers",
                "one centre inverted, not both, and they give different alkenes",
            ),
            Formula(METHYLCYCLOHEXENE_1, "C7H12", "1-methylcyclohexene, from the cis bromide"),
            Formula(METHYLCYCLOHEXENE_3, "C7H12", "3-methylcyclohexene, from the trans bromide"),
            Unsaturation(METHYLCYCLOHEXENE_1, 2, "a ring and a C=C"),
            Relationship(
                METHYLCYCLOHEXENE_1, METHYLCYCLOHEXENE_3, "constitutional",
                "the two products differ in connectivity, so the substrate's "
                "stereochemistry decided a constitutional outcome",
            ),
            Source(
                "cis-1-bromo-2-methylcyclohexane eliminates toward the "
                "methyl-bearing carbon to give 1-methylcyclohexene, while the "
                "trans isomer, whose only anti-periplanar hydrogen is on the "
                "far side, gives 3-methylcyclohexene.",
                "Standard treatment; see any introductory organic text's "
                "chapter on elimination reactions, where these two substrates "
                "are the worked case, and Eliel and Wilen, Stereochemistry of "
                "Organic Compounds, for the conformational analysis.",
            ),
        ),
    ),
    "ORG1.E1": Lesson(
        node="ORG1.E1",
        objective=(
            "Describe the E1 mechanism, explain why its rate law contains no "
            "base term, and predict when a substrate will give a mixture of "
            "E1 and SN1 products."
        ),
        build_on=(
            "SN1 made a carbocation and let a nucleophile capture it. E1 makes "
            "the same carbocation from the same substrate in the same rate "
            "determining step, and then does something different with it, so "
            "everything you know about what makes an SN1 substrate good "
            "transfers unchanged."
        ),
        core_idea=(
            "E1 has two steps. The first is ionization of the carbon-leaving "
            "group bond to give a carbocation, slow and rate determining, and "
            "identical to the first step of SN1. In the second a weak base, "
            "very often the solvent, removes a hydrogen from a carbon adjacent "
            "to the cationic one, and that C-H bonding pair becomes the pi "
            "bond. Because the base does not appear until after the rate "
            "determining step, the rate is first order in substrate and "
            "independent of base concentration, which is the cleanest "
            "experimental distinction from E2. The stereochemistry is the "
            "second distinction. The cation is planar and rotation about the "
            "adjacent single bond is free, so there is no anti-periplanar "
            "requirement and no stereospecificity: E1 is free to form whatever "
            "alkene is most stable, which means it follows Zaitsev and "
            "generally favours the E isomer over the Z. And because E1 and SN1 "
            "reach the same intermediate by the same step, they are not "
            "alternatives you choose between. A tertiary halide warmed in a "
            "protic solvent with no strong base gives both at once, with "
            "higher temperature shifting the balance toward elimination."
        ),
        worked_example=(
            "Return to 3-bromo-3-methylhexane, the SN1 substrate, and warm it "
            "in aqueous ethanol with no base added. The ionization step is the "
            "one you have already seen, and it produces the same planar "
            "3-methylhexan-3-yl cation. Capture by solvent gives the racemic "
            "3-methylhexan-3-ol from the SN1 lesson, one enantiomer from each "
            "face. Loss of a proton instead gives alkenes, and this cation has "
            "three constitutionally distinct hydrogens to lose. Taking one "
            "from C2 gives 3-methylhex-2-ene; taking one from C4 gives "
            "3-methylhex-3-ene; taking one from the methyl branch gives "
            "2-ethylpent-1-ene. All three are C7H14 with one degree of "
            "unsaturation and all three are constitutional isomers of one "
            "another. The first two are trisubstituted and dominate, and the "
            "terminal alkene, being disubstituted, is minor, which is Zaitsev "
            "operating without any base to interfere. Adding more solvent "
            "changes none of this, because by the time any base is involved "
            "the slow step is over."
        ),
        try_it_prompt=(
            "A tertiary bromide is heated in ethanol and gives an alkene. You "
            "then double the concentration of added sodium ethoxide and the "
            "rate of alkene formation doubles. Was the elimination E1? Give "
            "your reasoning from the rate law."
        ),
        try_it_answer=(
            "No. A rate that responds to base concentration means the base is "
            "present in the rate determining step, and E1's rate determining "
            "step is the ionization, which the base takes no part in. What you "
            "have measured is E2. Adding a strong base to a tertiary halide "
            "does not accelerate E1, it opens a faster bimolecular route "
            "alongside it, and that route takes over. E1 is what a tertiary "
            "halide does when nothing better is available."
        ),
        pitfall=(
            "The misconception to name is that the substrate picks the "
            "mechanism, so that E1 means elimination of tertiary halides and "
            "E2 means elimination of everything else. The same tertiary halide "
            "runs E2 with sodium ethoxide and E1 in warm ethanol alone, and "
            "the variable that changed was the base, not the substrate. A "
            "second error follows from studying E2 first: expecting E1 to be "
            "stereospecific because E2 is. It cannot be. The intermediate is "
            "planar and freely rotating, so it has forgotten the "
            "configuration of the substrate before the second step begins, "
            "which is the elimination counterpart of the racemization you saw "
            "in SN1."
        ),
        claims=(
            Formula(BROMOMETHYLHEXANE_S, "C7H15Br", "3-bromo-3-methylhexane, the same substrate"),
            Relationship(
                METHYLHEXANOL_S, METHYLHEXANOL_R, "enantiomers",
                "the substitution branch of the same cation still racemizes",
            ),
            Formula(METHYLHEX_2_ENE, "C7H14", "3-methylhex-2-ene, from a C2 hydrogen"),
            Formula(METHYLHEX_3_ENE, "C7H14", "3-methylhex-3-ene, from a C4 hydrogen"),
            Formula(ETHYLPENT_1_ENE, "C7H14", "2-ethylpent-1-ene, from the methyl branch"),
            Unsaturation(METHYLHEX_2_ENE, 1, "one C=C"),
            Unsaturation(ETHYLPENT_1_ENE, 1, "one C=C"),
            Relationship(
                METHYLHEX_2_ENE, METHYLHEX_3_ENE, "constitutional",
                "one cation, two constitutionally different trisubstituted alkenes",
            ),
            Relationship(
                METHYLHEX_2_ENE, ETHYLPENT_1_ENE, "constitutional",
                "and a third, disubstituted and minor",
            ),
            Source(
                "The E1 rate law is first order in substrate and independent "
                "of base concentration, because E1 shares its rate determining "
                "ionization step with SN1.",
                HUGHES_INGOLD,
            ),
        ),
    ),
    "ORG1.COMPETITION": Lesson(
        node="ORG1.COMPETITION",
        objective=(
            "Given a substrate, a reagent, a solvent and a temperature, decide "
            "among SN1, SN2, E1 and E2, and predict the product including its "
            "stereochemistry."
        ),
        build_on=(
            "You now have four mechanisms and, for each of them, a "
            "stereochemical signature and a rate law that identifies it. This "
            "lesson turns those four separate pieces of knowledge into one "
            "ordered procedure, because in practice you are never told which "
            "mechanism to apply."
        ),
        core_idea=(
            "Ask the questions in order, because the earlier ones narrow the "
            "field and the later ones choose within it. First the substrate. "
            "Methyl and primary carbons cannot support a cation, so they do "
            "not ionize and the only routes open are SN2, or E2 when the base "
            "is strong and hindered. Tertiary carbons cannot be attacked from "
            "behind, so SN2 is closed and the choices are SN1 and E1 with weak "
            "reagents or E2 with a strong base. Secondary carbons can do all "
            "four and are where the reagent decides everything. Second the "
            "reagent, judged on two axes rather than one: how good a "
            "nucleophile it is, and how strong a base. Iodide, thiolates, "
            "azide and cyanide are strong nucleophiles and weak bases, so they "
            "substitute. Hydroxide and alkoxides are strong on both axes, so "
            "with primary substrates they substitute and with secondary and "
            "tertiary ones they eliminate. Potassium tert-butoxide is a strong "
            "base that is too hindered to be a useful nucleophile, so it "
            "eliminates and does so toward the less substituted alkene. A "
            "neutral solvent such as water or an alcohol is weak on both axes, "
            "so only substrates that ionize react at all, and those give SN1 "
            "and E1 products together. Third the temperature, which shifts "
            "every substitution and elimination pair toward elimination as it "
            "rises. Then, once the mechanism is settled, read off the "
            "stereochemistry, because that is the part learners drop: SN2 "
            "inverts, SN1 racemizes, E2 is anti-periplanar and stereospecific, "
            "E1 is neither."
        ),
        worked_example=(
            "Take one substrate, 2-bromobutane, which is secondary and "
            "therefore has no mechanism of its own, and run it three ways. "
            "With sodium cyanide in DMSO: cyanide is an excellent nucleophile "
            "and a weak base, and DMSO is polar aprotic, so this is SN2. "
            "(S)-2-bromobutane gives (R)-2-methylbutanenitrile, inverted at "
            "the stereocentre, and the letter changes because cyanide arrives "
            "at the same priority rank bromine held. With sodium ethoxide in "
            "ethanol, heated: ethoxide is a good nucleophile but also a strong "
            "base, and a strong base on a secondary substrate eliminates, so "
            "this is E2. The Zaitsev product but-2-ene predominates over "
            "but-1-ene, and those two are constitutional isomers, both C4H8. "
            "With warm ethanol alone: nothing present is nucleophilic or basic "
            "enough for a bimolecular route, so the substrate has to ionize, "
            "which a secondary carbon does slowly and reluctantly. What comes "
            "out is a slow mixture of SN1 and E1 products, and the "
            "substitution product is racemic rather than inverted. One "
            "substrate, three answers, and the substrate was never the thing "
            "that decided."
        ),
        try_it_prompt=(
            "2-bromo-2-methylpropane is treated with sodium methoxide in "
            "methanol, and separately warmed in methanol alone. Name the "
            "mechanism and the major product in each case before reading on."
        ),
        try_it_answer=(
            "With methoxide the substrate is tertiary, so SN2 is impossible, "
            "and methoxide is a strong base, so E2 dominates and the product "
            "is 2-methylpropene, C4H8. In methanol alone there is no strong "
            "base and methanol is a weak nucleophile, so the substrate "
            "ionizes: SN1 and E1 run together off the same cation, giving "
            "2-methoxy-2-methylpropane, C5H12O, alongside the same alkene, "
            "with heat favouring the alkene. The substrate is identical in "
            "both flasks. Only the reagent changed, and it changed the "
            "mechanism, the product and the kinetics."
        ),
        pitfall=(
            "Almost every wrong answer on this material comes from running the "
            "decision as a single lookup on the substrate: secondary means "
            "SN1, or tertiary means SN1. The belief is that the substrate "
            "carries the mechanism. It does not. The substrate rules options "
            "out, and the reagent chooses among what is left, which is why the "
            "worked example above gives three different answers for one "
            "bromide. The second failure is quieter and costs as much: "
            "getting the mechanism right and then writing a product with no "
            "stereochemistry on it. If the mechanism was SN2 the answer is a "
            "specific enantiomer, if it was SN1 the answer is a racemate, and "
            "if it was E2 the answer is a specific alkene geometry. A product "
            "drawn without that information has not answered the question."
        ),
        claims=(
            Stereo(BROMOBUTANE_S, ("S",), "(S)-2-bromobutane, the one substrate"),
            Stereo(NITRILE_R, ("R",), "the SN2 product, inverted"),
            Formula(NITRILE_R, "C5H9N", "2-methylbutanenitrile"),
            Formula(BUT_2_ENE_E, "C4H8", "but-2-ene, the Zaitsev product of E2"),
            Formula(BUT_1_ENE, "C4H8", "but-1-ene, the minor regiochemical outcome"),
            Relationship(
                BUT_2_ENE_E, BUT_1_ENE, "constitutional",
                "the E2 regiochemical alternatives are constitutional isomers",
            ),
            Relationship(
                METHYLHEXANOL_S, METHYLHEXANOL_R, "enantiomers",
                "the SN1 signature: equal amounts of an enantiomeric pair",
            ),
            Relationship(
                METHYLPENT_2_ENE_E, METHYLPENT_2_ENE_Z, "diastereomers",
                "the E2 signature: which diastereomer of alkene forms is fixed "
                "by the substrate's configuration",
            ),
            Relationship(
                METHYLBUT_2_ENE, METHYLBUT_1_ENE, "constitutional",
                "the base-dependent signature: Zaitsev against Hofmann",
            ),
            Formula(TBUTYL_BROMIDE, "C4H9Br", "2-bromo-2-methylpropane, the try-it substrate"),
            Formula(METHYLPROPENE, "C4H8", "2-methylpropene, its elimination product"),
            Unsaturation(METHYLPROPENE, 1, "one C=C"),
            Formula(MTBE, "C5H12O", "2-methoxy-2-methylpropane, its solvolysis product"),
            Source(
                "Raising the temperature increases the proportion of "
                "elimination relative to substitution for a given substrate "
                "and reagent, because elimination has the larger entropy of "
                "activation.",
                "Standard treatment; see March's Advanced Organic Chemistry "
                "(Smith, 7th ed.), chapter on elimination reactions, on the "
                "competition between substitution and elimination.",
            ),
        ),
    ),
}

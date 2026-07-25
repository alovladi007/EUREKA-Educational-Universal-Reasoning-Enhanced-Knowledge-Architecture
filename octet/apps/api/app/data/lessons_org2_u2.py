"""ORG2 Unit 2: Aromaticity.

This unit is about a stability that structure alone announces and that a
learner is tempted to explain with the wrong picture. Benzene is drawn with
three double bonds, so the reflex is to treat it as a triene, and almost every
error in the chapter follows from that one reflex: predicting that benzene adds
bromine like an alkene, that its bonds alternate long and short, that its
delocalization energy can be reasoned away. The lessons below keep the
checkable facts checkable and quarantine the rest.

What is claimed here, because RDKit can re-derive it from the structure:

  molecular formula of every ring system            Formula
  degrees of unsaturation of every neutral ring      Unsaturation
  number of distinct 1H environments and their ratio Environments
  whether two benzene derivatives are isomers        Relationship

The electron count that Huckel's rule turns on is a structural property, and it
is stated in prose because a machine here has no aromaticity claim to check it
against. Aromatic ions carry a charge, so Unsaturation refuses them by design
and they are carried as Formula instead.

What is not claimed, because nothing in this repository can settle it, and so
is either taught as an ordering or carried as a Source with a real citation:

  resonance and delocalization stabilization energies
  benzene's heat of hydrogenation
  every chemical shift in ppm, including the aromatic region
  the pKa of cyclopentadiene
  the non-planar tub geometry of cyclooctatetraene

Every formula, degree count and integration ratio below was produced by
chem_core before it was written into prose. The 1H environment counts of the
fully delocalized aromatic ions are a special case noted where they arise: the
real ion is more symmetric than the charge-localized SMILES a checker reads,
so those counts are discussed in prose and not asserted as a claim that would
quietly derive the wrong number.
"""

from __future__ import annotations

from app.data.claims import Environments, Formula, Relationship, Source, Unsaturation
from app.data.lesson_types import Lesson

# ---------------------------------------------------------------------------
# Structures, named once so a claim and its prose cannot drift apart. Every
# SMILES here was passed through chem_core.structure and chem_core.organic
# during authoring; the formulas, degree counts and environment ratios in the
# claims below are what those functions returned, not what was remembered.
# ---------------------------------------------------------------------------

BENZENE = "c1ccccc1"
TOLUENE = "Cc1ccccc1"
CYCLOHEXANE = "C1CCCCC1"
CYCLOHEXENE = "C1=CCCCC1"
CYCLOHEXADIENE_13 = "C1=CC=CCC1"
NAPHTHALENE = "c1ccc2ccccc2c1"

CYCLOPENTADIENE = "C1C=CC=C1"
CYCLOPENTADIENYL_ANION = "[cH-]1cccc1"
TROPYLIUM = "[cH+]1cccccc1"
PYRIDINE = "c1ccncc1"
PYRROLE = "c1cc[nH]c1"

CYCLOBUTADIENE = "C1=CC=C1"
CYCLOOCTATETRAENE = "C1=CC=CC=CC=C1"

O_XYLENE = "Cc1ccccc1C"
M_XYLENE = "Cc1cccc(C)c1"
P_XYLENE = "Cc1ccc(C)cc1"
O_DICHLOROBENZENE = "Clc1ccccc1Cl"
M_DICHLOROBENZENE = "Clc1cccc(Cl)c1"
P_DICHLOROBENZENE = "Clc1ccc(Cl)cc1"

ANILINE = "Nc1ccccc1"
PHENOL = "Oc1ccccc1"
BENZALDEHYDE = "O=Cc1ccccc1"
BENZOIC_ACID = "OC(=O)c1ccccc1"
STYRENE = "C=Cc1ccccc1"

# ---------------------------------------------------------------------------
# Citations. Every number this unit states that the repository cannot derive
# points at one of these.
# ---------------------------------------------------------------------------

CLAYDEN = (
    "Clayden, Greeves and Warren, Organic Chemistry, 2nd edition, Oxford "
    "University Press 2012, chapter on aromaticity."
)
SILVERSTEIN = (
    "Silverstein, Webster, Kiemle and Bryce, Spectrometric Identification of "
    "Organic Compounds, 8th edition, Wiley 2014, proton NMR correlation charts."
)
PAVIA = (
    "Pavia, Lampman, Kriz and Vyvyan, Introduction to Spectroscopy, 5th "
    "edition, Cengage 2015, NMR correlation tables."
)
IUPAC_NOMEN = (
    "IUPAC Nomenclature of Organic Chemistry: Recommendations and Preferred "
    "Names 2013, section on retained names for benzene and its derivatives."
)

LESSONS_ORG2_U2 = {
    "ORG2.BENZENE": Lesson(
        node="ORG2.BENZENE",
        objective=(
            "Explain why benzene is far more stable than a molecule of three "
            "isolated double bonds would be, and use that stability to predict "
            "that benzene substitutes rather than adds."
        ),
        build_on=(
            "You can already turn a molecular formula into degrees of "
            "unsaturation, and benzene, C6H6, has four of them: one ring and "
            "three units that look like double bonds. This lesson is about why "
            "those three units do not behave like the double bonds you have "
            "already met."
        ),
        core_idea=(
            "Benzene is a flat regular hexagon in which all six carbon to "
            "carbon bonds are the same length, intermediate between a single "
            "and a double bond, and all six hydrogens are equivalent. That "
            "single fact rules out the alternating long and short bonds a "
            "static triene would have. The six p orbitals, one on each carbon, "
            "overlap all the way around the ring, so the six pi electrons are "
            "spread over the whole ring rather than trapped in three separate "
            "bonds. Delocalization lowers the energy, and the amount by which "
            "the real molecule sits below the energy of the imagined triene is "
            "called the delocalization or resonance energy. The consequence a "
            "learner should carry away is chemical, not only structural: an "
            "ordinary alkene adds bromine because the addition trades a pi bond "
            "for two stronger sigma bonds, but adding to benzene would destroy "
            "the delocalized system and pay away the stabilization, so benzene "
            "resists addition and instead undergoes substitution, which hands "
            "the ring back intact."
        ),
        worked_example=(
            "Measure stability by heat of hydrogenation, the energy released "
            "when double bonds are saturated with hydrogen. Cyclohexene, "
            "C6H10, has one ring and one double bond, two degrees of "
            "unsaturation, and hydrogenating its single double bond releases "
            "about 120 kJ/mol. If benzene were cyclohexatriene, three separate "
            "double bonds in a ring, you would predict about three times that, "
            "near 360 kJ/mol, on hydrogenating all three. The measured value "
            "for benzene is far smaller, about 208 kJ/mol, so benzene starts "
            "roughly 150 kJ/mol lower in energy than the triene picture "
            "predicts. That gap is the delocalization energy, and it is the "
            "energetic reason benzene will not add bromine across a ring bond "
            "the way cyclohexene does. Walk the series to see the trend build: "
            "cyclohexane C6H12 has one degree of unsaturation, cyclohexene "
            "C6H10 has two, 1,3-cyclohexadiene C6H8 has three, and benzene "
            "C6H6 has four, and only at the last step does the extra "
            "stabilization appear."
        ),
        try_it_prompt=(
            "Cyclohexene decolourises bromine water fast by adding across its "
            "double bond. Benzene, which is drawn with three double bonds, does "
            "not add bromine under the same mild conditions. Explain the "
            "difference in terms of what addition would cost benzene."
        ),
        try_it_answer=(
            "Adding bromine across one of benzene's ring bonds would break the "
            "continuous overlap of the six p orbitals and localise the "
            "remaining electrons, discarding the delocalization energy that "
            "makes benzene stable, roughly 150 kJ/mol worth. Cyclohexene has "
            "no such stabilization to lose, so addition is downhill for it and "
            "uphill for benzene. Benzene reacts instead by substitution, in "
            "which a ring hydrogen is replaced and the delocalized system is "
            "restored at the end, so the stabilization is kept."
        ),
        pitfall=(
            "The misconception to name is that benzene is a cyclohexatriene "
            "with three ordinary double bonds that happen to sit in a ring. A "
            "learner holding that picture predicts alternating bond lengths, "
            "predicts rapid addition of bromine and hydrogen halides, and is "
            "surprised by every reaction in the chapter. The structural "
            "evidence against it is that all six carbon to carbon bonds are "
            "equal and all six hydrogens are one environment, which no static "
            "triene can show, and the energetic evidence is the heat of "
            "hydrogenation deficit. Treat the three drawn double bonds as a "
            "bookkeeping device for six delocalized electrons, not as three "
            "isolated pi bonds."
        ),
        claims=(
            Formula(BENZENE, "C6H6", "benzene"),
            Unsaturation(BENZENE, 4, "one ring plus three units of pi bonding"),
            Environments(BENZENE, (6,), "all six hydrogens equivalent by symmetry"),
            Formula(CYCLOHEXANE, "C6H12", "cyclohexane"),
            Unsaturation(CYCLOHEXANE, 1, "the ring, no pi bonds"),
            Formula(CYCLOHEXENE, "C6H10", "cyclohexene"),
            Unsaturation(CYCLOHEXENE, 2, "the ring plus one double bond"),
            Formula(CYCLOHEXADIENE_13, "C6H8", "1,3-cyclohexadiene"),
            Unsaturation(CYCLOHEXADIENE_13, 3, "the ring plus two double bonds"),
            Source(
                "The heat of hydrogenation of cyclohexene is approximately 120 "
                "kJ/mol; that of benzene is approximately 208 kJ/mol, far less "
                "than three times the cyclohexene value, and the difference of "
                "roughly 150 kJ/mol is the empirical delocalization or "
                "resonance energy of benzene. These are approximate textbook "
                "values quoted to establish the ordering, not figures this "
                "repository can derive.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.HUCKEL": Lesson(
        node="ORG2.HUCKEL",
        objective=(
            "State the four conditions a ring must meet to be aromatic, and "
            "count pi electrons to test a ring against Huckel's 4n plus 2 rule."
        ),
        build_on=(
            "Benzene showed you one aromatic ring and the stability that comes "
            "with it. Huckel's rule is the general test that says which other "
            "rings share that stability and which do not, so you no longer have "
            "to argue each case from a heat of hydrogenation."
        ),
        core_idea=(
            "A ring is aromatic when four conditions all hold. It must be "
            "cyclic. It must be planar, so the p orbitals can line up. It must "
            "be fully conjugated, meaning every atom in the ring carries a p "
            "orbital in the pi system with no interrupting sp3 carbon. And the "
            "number of pi electrons in that system must equal 4n plus 2 for "
            "some whole number n, that is 2, 6, 10, 14 and so on. The 4n plus "
            "2 count comes from how the ring's molecular orbitals fill: the pi "
            "orbitals of a conjugated ring come in a single lowest orbital and "
            "then degenerate pairs above it, and a closed, stable shell is "
            "reached only at those counts. Benzene has six pi electrons, which "
            "is 4n plus 2 with n equal to 1, so it passes. Counting electrons "
            "is the derivable part of the test and you should always do it "
            "explicitly: each double bond in the ring contributes two pi "
            "electrons, and a lone pair or charge can contribute as well when "
            "it occupies a p orbital in the ring."
        ),
        worked_example=(
            "Test three rings. Benzene, C6H6, is cyclic, planar and fully "
            "conjugated, with three ring double bonds giving six pi electrons; "
            "six is 4n plus 2 with n equal to 1, so benzene is aromatic. "
            "Naphthalene, C10H8, is two benzene rings fused along a shared "
            "edge; the simplest form of Huckel's rule is stated for a single "
            "ring, but the fused system extends the idea, and its ten pi "
            "electrons are 4n plus 2 with n equal to 2, consistent with its "
            "aromatic behaviour. Now the instructive failure: cyclopentadiene, "
            "C5H6, is a five membered ring with two double bonds and one sp3 "
            "carbon, the CH2. That CH2 has no p orbital in the pi system, so "
            "the conjugation does not run all the way around the ring. It fails "
            "the fully conjugated condition, and no electron count can rescue "
            "it, so cyclopentadiene is not aromatic even though it is cyclic "
            "and close to the right size."
        ),
        try_it_prompt=(
            "A student says a flat, fully conjugated ring with eight pi "
            "electrons must be aromatic because eight electrons is plenty. "
            "Apply the 4n plus 2 test to eight and say what the student has got "
            "wrong."
        ),
        try_it_answer=(
            "Eight is not of the form 4n plus 2 for any whole number n: 4n plus "
            "2 gives 2, 6, 10, 14, while eight is 4n with n equal to 2. A ring "
            "with eight delocalized pi electrons fails the count, so it is not "
            "aromatic no matter how well conjugated it is. The student has "
            "confused having many electrons with having the right number; "
            "aromaticity is set by a specific series of counts, not by "
            "abundance, and eight sits between the aromatic counts of six and "
            "ten."
        ),
        pitfall=(
            "The common error is checking only the electron count and ignoring "
            "the other three conditions, especially full conjugation. A ring "
            "can have a 4n plus 2 number of pi electrons on paper and still "
            "not be aromatic because an sp3 centre breaks the loop, as in "
            "cyclopentadiene, or because the ring cannot go planar. Run all "
            "four conditions every time: cyclic, planar, fully conjugated, and "
            "then 4n plus 2. The count is the last gate, not the only one."
        ),
        claims=(
            Formula(BENZENE, "C6H6", "benzene, six pi electrons, n equals 1"),
            Unsaturation(BENZENE, 4),
            Formula(NAPHTHALENE, "C10H8", "naphthalene, ten pi electrons, n equals 2"),
            Unsaturation(NAPHTHALENE, 7, "two fused rings plus five pi bonds"),
            Environments(NAPHTHALENE, (4, 4), "two sets of four equivalent ring hydrogens"),
            Formula(
                CYCLOPENTADIENE, "C5H6",
                "cyclopentadiene: cyclic but with an sp3 CH2 that breaks full "
                "conjugation, so not aromatic",
            ),
            Unsaturation(CYCLOPENTADIENE, 3, "the ring plus two double bonds"),
            Source(
                "The 4n plus 2 requirement follows from the pattern of pi "
                "molecular orbital energies of a conjugated monocyclic ring, "
                "in which a single lowest orbital lies below successive "
                "degenerate pairs and a closed shell is reached at those "
                "counts. The molecular orbital argument is theory this "
                "repository does not derive.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.AROMATICIONS": Lesson(
        node="ORG2.AROMATICIONS",
        objective=(
            "Predict when gaining or losing electrons makes a ring aromatic, "
            "and distinguish a ring nitrogen that donates its lone pair to the "
            "pi system from one that does not."
        ),
        build_on=(
            "Huckel's rule counts pi electrons, and nothing in the count says "
            "the electrons have to come from double bonds. A charge or a lone "
            "pair can supply them, which is what turns some non-aromatic rings "
            "into aromatic ions and some nitrogen heterocycles aromatic."
        ),
        core_idea=(
            "If a flat, fully conjugated ring is two electrons short of or two "
            "electrons past a 4n plus 2 count, gaining or losing a pair can "
            "make it aromatic, and the driving force for that gain or loss is "
            "the aromatic stabilization waiting on the other side. Two classic "
            "ions show both directions. Cyclopentadiene has an sp3 CH2; remove "
            "one of its hydrogens as a proton and the carbon becomes part of "
            "the ring with a lone pair in a p orbital, giving the "
            "cyclopentadienyl anion with six pi electrons, aromatic and "
            "unusually stable, which is why cyclopentadiene is far more acidic "
            "than an ordinary hydrocarbon. In the other direction, remove a "
            "hydride from cycloheptatriene to give the tropylium cation, a "
            "seven membered ring with six pi electrons, also aromatic. "
            "Heterocycles turn on the same electron bookkeeping. In pyridine "
            "the nitrogen sits in the ring like a carbon of benzene, its lone "
            "pair pointing out in the plane and not part of the pi system, so "
            "the six pi electrons come from the three ring double bonds. In "
            "pyrrole the nitrogen instead donates its lone pair into the ring "
            "to reach six pi electrons, which is why that nitrogen is a poor "
            "base and pyrrole behaves so differently from an ordinary amine."
        ),
        worked_example=(
            "Count electrons for the cyclopentadienyl anion, formula C5H5 with "
            "a single negative charge. The five ring carbons each carry a p "
            "orbital: two ring double bonds supply four pi electrons, and the "
            "carbon that was the sp3 CH2 now carries the extra pair from "
            "deprotonation, supplying two more, for six pi electrons total. Six "
            "is 4n plus 2 with n equal to 1, the ring is planar and fully "
            "conjugated, so the anion is aromatic. Because the charge is spread "
            "evenly over all five carbons, the real ion is more symmetric than "
            "any single drawn structure suggests and its five hydrogens are "
            "equivalent, giving one sharp signal in the 1H NMR spectrum. "
            "Contrast pyridine, C5H5N, and pyrrole, C4H5N. Pyridine keeps its "
            "nitrogen lone pair in the plane and out of the pi system, so it is "
            "a base and its six pi electrons come from three double bonds; "
            "pyrrole spends its nitrogen lone pair inside the ring to make six "
            "pi electrons, so that nitrogen is not basic in the ordinary way. "
            "The formulas are fixed and checkable; which electrons enter the "
            "ring is the structural argument you build on top of them."
        ),
        try_it_prompt=(
            "Cyclopentadiene has a pKa near 16, extraordinarily acidic for a "
            "hydrocarbon whose acidic hydrogen sits on an sp3 carbon. What "
            "about the conjugate base explains an acidity that far outstrips an "
            "ordinary alkane?"
        ),
        try_it_answer=(
            "Removing the proton produces the cyclopentadienyl anion, which is "
            "aromatic: the carbanion lone pair completes a six pi electron, "
            "fully conjugated, planar ring, a 4n plus 2 system. That "
            "aromatic stabilization of the conjugate base is what makes the "
            "proton so much easier to remove than a proton from an alkane, "
            "whose conjugate base gains nothing. The acidity is a report on the "
            "stability of the base, and here the base is aromatic while the "
            "neutral cyclopentadiene is not."
        ),
        pitfall=(
            "The trap is assuming every ring nitrogen with a lone pair behaves "
            "the same way, so that pyridine and pyrrole should be equally "
            "basic. They are not, because the lone pair is doing different "
            "jobs. Pyridine's lone pair sits in an sp2 orbital in the plane of "
            "the ring, available to accept a proton, so pyridine is a base. "
            "Pyrrole's lone pair is committed to the pi system to make the ring "
            "aromatic, so donating it to a proton would cost the aromaticity, "
            "and pyrrole is a very weak base as a result. Ask where the lone "
            "pair points before you call a nitrogen basic."
        ),
        claims=(
            Formula(
                CYCLOPENTADIENYL_ANION, "C5H5-",
                "cyclopentadienyl anion, charged so Unsaturation does not "
                "apply; six pi electrons, aromatic",
            ),
            Formula(CYCLOPENTADIENE, "C5H6", "the neutral parent, not aromatic"),
            Formula(
                TROPYLIUM, "C7H7+",
                "tropylium cation, charged; a seven membered ring with six pi "
                "electrons, aromatic",
            ),
            Formula(PYRIDINE, "C5H5N", "pyridine, nitrogen lone pair in the plane"),
            Unsaturation(PYRIDINE, 4, "the ring plus three double bonds"),
            Environments(PYRIDINE, (2, 2, 1), "positions relative to the nitrogen"),
            Formula(PYRROLE, "C4H5N", "pyrrole, nitrogen lone pair in the ring"),
            Unsaturation(PYRROLE, 3, "the ring plus two double bonds"),
            Environments(PYRROLE, (2, 2, 1), "two ring pairs and the N-H"),
            Source(
                "Cyclopentadiene has a pKa of approximately 16, far more "
                "acidic than a typical sp3 carbon to hydrogen bond, because "
                "its conjugate base is the aromatic cyclopentadienyl anion. The "
                "pKa is an experimental value this repository does not derive.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.ANTIAROMATIC": Lesson(
        node="ORG2.ANTIAROMATIC",
        objective=(
            "Distinguish an antiaromatic ring, destabilized by a 4n pi "
            "electron count, from a nonaromatic ring that escapes the penalty "
            "by giving up planarity."
        ),
        build_on=(
            "Huckel's rule told you which counts are aromatic. The counts in "
            "between are not benign. A flat, fully conjugated ring with "
            "the wrong number of electrons is actively worse off than an open "
            "chain, and this lesson is about that penalty and how molecules "
            "avoid it."
        ),
        core_idea=(
            "A ring that is cyclic, planar and fully conjugated but holds 4n pi "
            "electrons, that is 4, 8, 12 and so on, is antiaromatic: the same "
            "molecular orbital pattern that stabilizes a 4n plus 2 system "
            "leaves a 4n system with electrons in nonbonding or partly filled "
            "levels, and the ring ends up higher in energy than a comparable "
            "open chain rather than lower. Nature avoids the penalty in two "
            "ways. A small ring that cannot bend, like cyclobutadiene with four "
            "pi electrons, is forced close to planar and pays the price by "
            "being extraordinarily reactive and hard to isolate. A larger ring "
            "sidesteps the problem: cyclooctatetraene has eight pi electrons, "
            "which would be antiaromatic if the ring were flat, so it instead "
            "puckers into a tub shape that is not planar, breaks the "
            "continuous overlap, and behaves as a nonaromatic polyene of four "
            "ordinary, localised double bonds. Antiaromatic and nonaromatic "
            "are not synonyms: the first is a ring paying the 4n penalty, the "
            "second is a ring that has arranged its geometry so that no pi "
            "system runs all the way around."
        ),
        worked_example=(
            "Compare cyclobutadiene, C4H4, and cyclooctatetraene, C8H8. "
            "Cyclobutadiene is a four membered ring with two double bonds, "
            "three degrees of unsaturation, and four pi electrons. Four is 4n "
            "with n equal to 1, and the four membered ring is too small to "
            "pucker away from planarity, so it is pushed toward the "
            "antiaromatic geometry and is one of the most reactive "
            "hydrocarbons known, surviving only when held apart at very low "
            "temperature. Cyclooctatetraene is an eight membered ring with four "
            "double bonds, five degrees of unsaturation, and eight pi "
            "electrons. Eight is also 4n, with n equal to 2, but the ring is "
            "large and flexible, so rather than stay flat and antiaromatic it "
            "folds into a non-planar tub. In that geometry its double bonds are "
            "localised and it adds bromine like an ordinary alkene, the "
            "opposite of benzene's behaviour, which tells you at once that it "
            "is not aromatic. The formulas and degree counts are checkable; the "
            "tub geometry is the structural response that the numbers alone do "
            "not force you to see."
        ),
        try_it_prompt=(
            "Benzene, cyclobutadiene and cyclooctatetraene are all cyclic and "
            "all drawn with alternating double bonds. Sort them into aromatic, "
            "antiaromatic and nonaromatic, and give the pi electron count that "
            "decides each."
        ),
        try_it_answer=(
            "Benzene has six pi electrons, a 4n plus 2 count, and stays "
            "planar, so it is aromatic. Cyclobutadiene has four pi electrons, a "
            "4n count, and is small enough that it cannot avoid near planarity, "
            "so it is antiaromatic and extremely reactive. Cyclooctatetraene "
            "has eight pi electrons, also a 4n count, but escapes the penalty "
            "by folding into a non-planar tub, which breaks the conjugation "
            "around the ring, so it is nonaromatic and behaves as a set of "
            "isolated double bonds. The count flags the danger; the geometry "
            "decides whether a molecule pays it or dodges it."
        ),
        pitfall=(
            "The misconception is that anything failing the aromatic count is "
            "energetically neutral, so nonaromatic and antiaromatic mean the same "
            "thing. They do not. An antiaromatic ring is destabilized relative "
            "to an open chain, an active penalty, and molecules go to real "
            "structural lengths to avoid it, including twisting out of "
            "planarity. Cyclooctatetraene is the case worth remembering: its "
            "eight pi electrons would be antiaromatic in a flat ring, and its "
            "tub shape is exactly the escape that makes it nonaromatic "
            "instead. Reading its non-planarity as an incidental detail misses "
            "that it is the whole point."
        ),
        claims=(
            Formula(CYCLOBUTADIENE, "C4H4", "cyclobutadiene, four pi electrons, 4n"),
            Unsaturation(CYCLOBUTADIENE, 3, "the ring plus two double bonds"),
            Environments(CYCLOBUTADIENE, (4,), "the four ring hydrogens as drawn"),
            Formula(CYCLOOCTATETRAENE, "C8H8", "cyclooctatetraene, eight pi electrons, 4n"),
            Unsaturation(CYCLOOCTATETRAENE, 5, "the ring plus four double bonds"),
            Environments(CYCLOOCTATETRAENE, (8,), "all eight hydrogens equivalent"),
            Formula(BENZENE, "C6H6", "benzene, six pi electrons, 4n plus 2, for contrast"),
            Source(
                "A planar, fully conjugated ring with 4n pi electrons is "
                "destabilized relative to an open chain analogue, the "
                "antiaromatic case, and cyclooctatetraene adopts a non-planar "
                "tub conformation that makes it a nonaromatic polyene rather "
                "than an antiaromatic one. The energetic ordering and the tub "
                "geometry are established experimentally and are not derived "
                "here.",
                CLAYDEN,
            ),
        ),
    ),
    "ORG2.BENZENENOMEN": Lesson(
        node="ORG2.BENZENENOMEN",
        objective=(
            "Name a disubstituted benzene using the ortho, meta and para "
            "prefixes, and recognise the retained common names the "
            "nomenclature keeps."
        ),
        build_on=(
            "You can count the distinct hydrogen environments of a molecule "
            "from its symmetry. Naming a disubstituted benzene rests on the "
            "same symmetry, because where two groups sit on the ring is exactly "
            "what fixes how many environments the ring hydrogens fall into."
        ),
        core_idea=(
            "On a benzene ring, two substituents can sit in three distinct "
            "relationships, and each has a prefix. Adjacent, on carbons 1 and "
            "2, is ortho. One carbon apart, on 1 and 3, is meta. Directly "
            "across, on 1 and 4, is para. These prefixes are interchangeable "
            "with the locants: ortho-dichlorobenzene is 1,2-dichlorobenzene. "
            "The three arrangements are constitutional isomers, the same "
            "formula with the substituents connected in different places, and "
            "their differing symmetry makes them genuinely different compounds "
            "with different properties. Layered on top of the systematic names "
            "is a set of retained common names that the nomenclature keeps "
            "because they are entrenched: methylbenzene is toluene, "
            "hydroxybenzene is phenol, aminobenzene is aniline, the aldehyde is "
            "benzaldehyde, the carboxylic acid is benzoic acid, and "
            "vinylbenzene is styrene. When one of these named compounds carries "
            "a further substituent, the retained name often becomes the parent, "
            "so a methyl phenol is named as a cresol and the ring is numbered "
            "from the carbon bearing the name-defining group."
        ),
        worked_example=(
            "Take the three dichlorobenzenes, all C6H4Cl2, and let symmetry name "
            "them. The para isomer, 1,4-dichlorobenzene, has the two chlorines "
            "across the ring; its symmetry makes all four remaining ring "
            "hydrogens equivalent, so it shows one hydrogen environment. The "
            "ortho isomer, 1,2-dichlorobenzene, has the chlorines adjacent; its "
            "four ring hydrogens fall into two equivalent pairs, giving two "
            "environments. The meta isomer, 1,3-dichlorobenzene, is the least "
            "symmetric: the hydrogen between the two chlorines is unique, the "
            "one opposite is unique, and the remaining two form a pair, giving "
            "three environments. So the environment counts alone, one, two and "
            "three, sort para, ortho and meta apart, and the same logic names "
            "the xylenes, where the two methyl groups play the role the two "
            "chlorines played here. The naming and the symmetry are one "
            "question asked twice."
        ),
        try_it_prompt=(
            "You are handed a bottle labelled only dichlorobenzene, C6H4Cl2, "
            "and told its ring hydrogens give exactly two environments. Which "
            "isomer is it, ortho, meta or para, and what would the other two "
            "isomers have shown instead?"
        ),
        try_it_answer=(
            "Two environments is the ortho isomer, 1,2-dichlorobenzene, whose "
            "four ring hydrogens form two equivalent pairs. The para isomer, "
            "1,4-dichlorobenzene, would have shown a single environment because "
            "its higher symmetry makes all four ring hydrogens equivalent, and "
            "the meta isomer, 1,3-dichlorobenzene, would have shown three "
            "environments because two of its ring hydrogens are unique and the "
            "other two form a pair. The count of environments is a direct read "
            "on which of the three substitution patterns you have."
        ),
        pitfall=(
            "The habit to break is assuming para, the most symmetric "
            "arrangement, must give the most signals because it feels like the "
            "tidiest structure. Symmetry runs the other way: the more "
            "symmetric the substitution pattern, the fewer distinct "
            "environments, because symmetry is precisely what collapses "
            "positions onto one another. Para-dichlorobenzene gives one "
            "environment and meta gives three, so a spectrum with more aromatic "
            "signals points toward less symmetry, not more. Count environments "
            "from the symmetry of the pattern rather than from how orderly the "
            "drawing looks."
        ),
        claims=(
            Formula(O_DICHLOROBENZENE, "C6H4Cl2", "ortho, 1,2-dichlorobenzene"),
            Environments(O_DICHLOROBENZENE, (2, 2), "two equivalent pairs of ring hydrogens"),
            Formula(M_DICHLOROBENZENE, "C6H4Cl2", "meta, 1,3-dichlorobenzene"),
            Environments(M_DICHLOROBENZENE, (2, 1, 1), "a pair and two unique hydrogens"),
            Formula(P_DICHLOROBENZENE, "C6H4Cl2", "para, 1,4-dichlorobenzene"),
            Environments(P_DICHLOROBENZENE, (4,), "all four ring hydrogens equivalent"),
            Relationship(
                O_DICHLOROBENZENE, P_DICHLOROBENZENE, "constitutional",
                "same formula, substituents in different positions",
            ),
            Relationship(M_DICHLOROBENZENE, P_DICHLOROBENZENE, "constitutional"),
            Formula(TOLUENE, "C7H8", "toluene, retained name for methylbenzene"),
            Formula(PHENOL, "C6H6O", "phenol, retained name for hydroxybenzene"),
            Formula(ANILINE, "C6H7N", "aniline, retained name for aminobenzene"),
            Formula(BENZALDEHYDE, "C7H6O", "benzaldehyde"),
            Formula(BENZOIC_ACID, "C7H6O2", "benzoic acid"),
            Formula(STYRENE, "C8H8", "styrene, retained name for vinylbenzene"),
            Source(
                "Ortho, meta and para as prefixes for 1,2-, 1,3- and 1,4- "
                "disubstitution, and the retained names toluene, phenol, "
                "aniline, benzaldehyde, benzoic acid and styrene, are fixed by "
                "the nomenclature rules rather than derived.",
                IUPAC_NOMEN,
            ),
        ),
    ),
    "ORG2.AROMATICSPECTRA": Lesson(
        node="ORG2.AROMATICSPECTRA",
        objective=(
            "Read the number and ratio of aromatic 1H signals as a statement "
            "about substitution pattern, and place aromatic hydrogens in the "
            "spectrum relative to alkyl hydrogens."
        ),
        build_on=(
            "You learned that aromatic hydrogens are strongly deshielded by the "
            "ring current, so they resonate well downfield of alkyl hydrogens. "
            "This lesson turns that region into a diagnosis, using the same "
            "environment counting that named the disubstituted benzenes."
        ),
        core_idea=(
            "An aromatic ring reports two things in a 1H NMR spectrum. The "
            "first is position: the circulating pi electrons of the ring set up "
            "a local field that reinforces the applied field at the ring "
            "hydrogens, deshielding them so they appear far downfield of alkyl "
            "hydrogens, in a region around 6.5 to 8.5 ppm rather than the 0.8 "
            "to 2 ppm of a methyl group. That separation lets you split a "
            "spectrum into an aromatic block and an aliphatic block at a "
            "glance. The second is pattern: the number of distinct aromatic "
            "signals and the ratio of their integrals is fixed by the symmetry "
            "of the substitution, exactly as it was when you named the "
            "isomers, so counting aromatic environments narrows down where the "
            "substituents sit. The specific shift values are not derivable "
            "here and are carried as ranges from a correlation chart; the count "
            "and ratio of environments are derivable and are the checkable "
            "backbone of the reading."
        ),
        worked_example=(
            "Read three compounds by their aromatic pattern. Benzene, C6H6, has "
            "all six hydrogens in one environment, so it gives a single "
            "aromatic signal, a clean report of full symmetry. Toluene, C7H8, "
            "adds a methyl group and drops to lower symmetry: it shows four "
            "environments in the ratio 3:2:2:1, a 3H methyl far upfield near "
            "the aliphatic region and three ring environments downfield for the "
            "ortho, meta and para positions, though on many instruments the "
            "three ring signals crowd together near one shift. Para-xylene, "
            "C8H10, restores symmetry with two methyls across the ring and "
            "collapses to two environments in the ratio 6:4, a 6H methyl signal "
            "and a single 4H aromatic signal because all four ring hydrogens "
            "are equivalent. Line the three up and the trend is clear: benzene "
            "one signal, para-xylene one aromatic signal, toluene three, and "
            "the aromatic count tracks the symmetry of the substitution rather "
            "than the number of hydrogens."
        ),
        try_it_prompt=(
            "Two bottles each hold a compound of formula C6H4Cl2. The first "
            "shows a single aromatic 1H signal; the second shows three aromatic "
            "signals. Name the isomer in each bottle, and say what the para "
            "isomer's single signal tells you that the meta isomer's three "
            "cannot."
        ),
        try_it_answer=(
            "The first bottle is para-dichlorobenzene, 1,4-dichlorobenzene, "
            "whose four ring hydrogens are all one environment and give one "
            "aromatic signal. The second is meta-dichlorobenzene, "
            "1,3-dichlorobenzene, whose ring hydrogens split into three "
            "environments in the ratio 2:1:1. The single signal of the para "
            "isomer reports directly that the two chlorines sit in the most "
            "symmetric arrangement, across the ring, information the meta "
            "isomer's three signals report as the opposite, the least "
            "symmetric of the three patterns."
        ),
        pitfall=(
            "The error to guard against is reading a downfield aromatic shift "
            "as a sign of acidity or reactivity, by analogy with the acidic "
            "hydrogens that also appear downfield. An aromatic hydrogen sits "
            "far downfield because it is caught in the ring current, not "
            "because it is easily removed; it is not acidic. The other half of "
            "the same mistake is expecting the number of aromatic signals to "
            "equal the number of aromatic hydrogens. It equals the number of "
            "environments, which symmetry can make far smaller: "
            "para-dichlorobenzene has four aromatic hydrogens and one signal. "
            "Read the count as a symmetry statement, and read the shift as a "
            "position, and keep the two separate."
        ),
        claims=(
            Formula(BENZENE, "C6H6", "benzene"),
            Environments(BENZENE, (6,), "one aromatic environment, a single signal"),
            Formula(TOLUENE, "C7H8", "toluene"),
            Environments(TOLUENE, (3, 2, 2, 1), "methyl plus ortho, meta and para ring positions"),
            Formula(P_XYLENE, "C8H10", "para-xylene"),
            Environments(P_XYLENE, (6, 4), "two equivalent methyls and four equivalent ring hydrogens"),
            Formula(M_DICHLOROBENZENE, "C6H4Cl2", "meta-dichlorobenzene"),
            Environments(M_DICHLOROBENZENE, (2, 1, 1)),
            Formula(P_DICHLOROBENZENE, "C6H4Cl2", "para-dichlorobenzene"),
            Environments(P_DICHLOROBENZENE, (4,)),
            Relationship(M_DICHLOROBENZENE, P_DICHLOROBENZENE, "constitutional"),
            Source(
                "Aromatic ring hydrogens resonate approximately 6.5 to 8.5 ppm "
                "in 1H NMR, downfield of alkyl hydrogens at approximately 0.8 "
                "to 2 ppm; these are correlation chart ranges, not values this "
                "repository derives.",
                SILVERSTEIN,
            ),
            Source(
                "The downfield position of aromatic hydrogens is attributed to "
                "the ring current, an induced field from the circulating pi "
                "electrons that reinforces the applied field at positions "
                "outside the ring. The mechanism is standard and the effect is "
                "measured, not derived here.",
                CLAYDEN,
            ),
        ),
    ),
}

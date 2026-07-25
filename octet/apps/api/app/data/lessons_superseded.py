"""Retained lesson with no node of its own in the course based map.

The old map had two formula nodes, C.G1.FORMULA and C.G1.EMPIRICAL, and both
carry a real authored lesson. The course based map draws one node there,
GEN1.EMPIRICAL, and node_migration.py gives it to C.G1.FORMULA because that
lesson's title and scope match the node exactly. This is the other lesson.

It is not wrong and it is not deleted. It is parked here so that a human folds
it into the GEN1.EMPIRICAL lesson when that node is next authored, rather than
losing it in the re-key. It keeps its original C.G1.EMPIRICAL key and node
field, which no longer resolve against the curriculum, precisely so that it
cannot be mistaken for live content.

Nothing in the product reads this file. It is deliberately absent from LESSONS
in app/data/lessons.py, and it must stay absent until the merge is done by
hand: wiring it up as is would put two lessons on one node.
"""

from __future__ import annotations

from app.data.lesson_types import Lesson

SUPERSEDED_LESSONS: dict[str, Lesson] = {
    "C.G1.EMPIRICAL": Lesson(
        node="C.G1.EMPIRICAL",
        objective=(
            "Determine a compound's empirical formula from percent composition "
            "data, and upgrade it to a molecular formula given the molar mass."
        ),
        build_on=(
            "Percent composition runs a formula forward into mass fractions, "
            "and this lesson runs the same road backwards, from measured "
            "masses to the formula."
        ),
        core_idea=(
            "A combustion analyser in a lab hands you percentages, not a "
            "formula, so you have to reconstruct the formula from them. The "
            "move that makes it work is to assume you have exactly 100 g of "
            "the compound, because then every percentage becomes a mass in "
            "grams with no extra arithmetic. Convert each mass to moles with "
            "that element's molar mass, since formulas are ratios of counts "
            "and never ratios of masses. Then divide every mole value by the "
            "smallest one, which forces the smallest element to 1 and reveals "
            "the whole number ratio. That ratio is the empirical formula, and "
            "only a separately measured molar mass can tell you the molecular "
            "formula."
        ),
        worked_example=(
            "A sample analyses as 40.00 percent carbon, 6.71 percent hydrogen "
            "and 53.29 percent oxygen, with a measured molar mass of "
            "180.2 g/mol. Assume 100 g, so you have 40.00 g C, 6.71 g H and "
            "53.29 g O. Convert to moles: 40.00 / 12.01 = 3.331 mol C, "
            "6.71 / 1.008 = 6.66 mol H, 53.29 / 16.00 = 3.331 mol O. Divide "
            "each by the smallest value, 3.331: carbon gives 1.000, hydrogen "
            "gives 6.66 / 3.331 = 2.00, oxygen gives 1.000. The empirical "
            "formula is therefore CH2O, whose empirical mass is "
            "12.01 + 2 x 1.008 + 16.00 = 30.03 g/mol. Now divide the measured "
            "molar mass by that: 180.2 / 30.03 = 6.00, so every subscript is "
            "multiplied by 6. The molecular formula is C6H12O6, which is "
            "glucose."
        ),
        try_it_prompt=(
            "A hydrocarbon is 92.3 percent carbon and 7.7 percent hydrogen by "
            "mass, and its molar mass is 78.11 g/mol. What is its molecular "
            "formula?"
        ),
        try_it_answer=(
            "C6H6, benzene. In 100 g you have 92.3 / 12.01 = 7.69 mol C and "
            "7.7 / 1.008 = 7.64 mol H, a 1 to 1 ratio giving CH with an "
            "empirical mass of 13.02, and 78.11 / 13.02 = 6.00, so multiply "
            "both subscripts by 6."
        ),
        pitfall=(
            "The trap is reporting the empirical formula as the answer when "
            "the question asked for the molecular formula. CH2O and C6H12O6 "
            "have identical percent compositions, so the data alone cannot "
            "separate formaldehyde from glucose. Only the molar mass can."
        ),
        misconception="EMP-MOL",
    ),
}

"""GEN1 fill C: the eleven unauthored nodes of units GEN1-U6 and GEN1-U7.

Electronic Structure and Periodic Properties (U6) and Chemical Bonding and
Molecular Geometry (U7) each shipped with several nodes missing a lesson. This
file authors exactly those gaps, in curriculum order, and touches nothing that
already has a lesson in app/data/lessons_gen1.py.

Every numeric physical constant or measured value that appears in the prose
carries a Source claim naming a real reference, because a lesson cannot verify a
number it only asserts. Where a molecule appears it carries a Formula claim
that RDKit re-derives from the structure when the checker runs, so a formula
typed into prose and a formula read off a structure cannot drift apart.
"""

from __future__ import annotations

from app.data.claims import Formula, Source
from app.data.lesson_types import Lesson

# Structures named once so a claim and its prose stay tied together.
DIHYDROGEN = "[H][H]"
HYDROGEN_CHLORIDE = "[H]Cl"
DIFLUORINE = "FF"
CARBON_DIOXIDE = "O=C=O"
CYANIDE = "[C-]#N"
OZONE = "[O-][O+]=O"
NITRATE = "[O-][N+](=O)[O-]"
BORON_TRIFLUORIDE = "FB(F)F"
SULFUR_HEXAFLUORIDE = "FS(F)(F)(F)(F)F"
NITRIC_OXIDE = "[N]=O"
PHOSPHORUS_PENTACHLORIDE = "ClP(Cl)(Cl)(Cl)Cl"
ETHANE = "CC"
ETHENE = "C=C"
ETHYNE = "C#C"

# Citations reused across several lessons, spelled out once.
CRC_CONSTANTS = (
    "CRC Handbook of Chemistry and Physics, 97th edition, table of "
    "Fundamental Physical Constants."
)
OPENSTAX_BOHR = "OpenStax Chemistry 2e, Section 6.2, The Bohr Model."
OPENSTAX_TRENDS = (
    "OpenStax Chemistry 2e, Section 6.5, Periodic Variations in Element "
    "Properties."
)
OPENSTAX_EN = "OpenStax Chemistry 2e, Section 7.2, Covalent Bonding."
OPENSTAX_RESONANCE = "OpenStax Chemistry 2e, Section 7.4, Formal Charges and Resonance."
OPENSTAX_BONDS = (
    "OpenStax Chemistry 2e, Section 7.5, Strengths of Ionic and Covalent Bonds."
)

LESSONS_GEN1_FILL_C: dict[str, Lesson] = {
    "GEN1.LIGHT": Lesson(
        node="GEN1.LIGHT",
        objective=(
            "Relate the wavelength, frequency and photon energy of "
            "electromagnetic radiation, and calculate any one of them from "
            "another using the speed of light and the Planck relation."
        ),
        build_on=(
            "You spent the last unit measuring the energy a reaction releases "
            "or absorbs in joules, and this unit opens with energy that arrives "
            "from outside the flask entirely, carried by light."
        ),
        core_idea=(
            "Light is an electromagnetic wave, an oscillating electric and "
            "magnetic disturbance that travels through vacuum at a single fixed "
            "speed written c. Because the speed is fixed, the wavelength (the "
            "distance between crests, written with the Greek letter lambda) and "
            "the frequency (the number of crests passing a point each second, "
            "written with the Greek letter nu) are locked together by "
            "c = lambda times nu, so a shorter wavelength must mean a higher "
            "frequency. The second fact is the one that reorganised physics: the "
            "energy a beam of light can deliver does not come in a smooth "
            "stream but in indivisible packets called photons, and the energy of "
            "one photon is E = h times nu, where h is Planck's constant. Combine "
            "the two relations into E = h times c divided by lambda and you can "
            "read energy straight off a wavelength. Red light has a longer "
            "wavelength, a lower frequency and lower energy photons than blue "
            "light, and this ranking is what later lets a specific colour of "
            "light correspond to a specific energy jump inside an atom."
        ),
        worked_example=(
            "Find the frequency and photon energy of green light with a "
            "wavelength of 500 nm. First put the wavelength in metres: 500 nm is "
            "500 x 10^-9 m, which is 5.00 x 10^-7 m. Use the speed of light, "
            "c = 2.998 x 10^8 m/s, to get the frequency from c = lambda times "
            "nu, rearranged to nu = c divided by lambda: nu = "
            "(2.998 x 10^8) divided by (5.00 x 10^-7) = 5.996 x 10^14 per "
            "second, which is 6.00 x 10^14 Hz. Now the photon energy, using "
            "Planck's constant h = 6.626 x 10^-34 J s in E = h times nu: E = "
            "(6.626 x 10^-34) times (5.996 x 10^14) = 3.97 x 10^-19 J. That is "
            "the energy of a single green photon, and it is a tiny number "
            "because one photon is a tiny packet; a dim green laser pointer "
            "still sends out something like 10^15 of them every second. Notice "
            "the units settle the arithmetic: metres over (metres per second) "
            "would have given seconds, the wrong way up, which is the signal you "
            "divided the wrong pair."
        ),
        try_it_prompt=(
            "Red light has a wavelength of 700 nm. Using c = 2.998 x 10^8 m/s, "
            "find its frequency, and say whether one red photon carries more or "
            "less energy than one green photon at 500 nm."
        ),
        try_it_answer=(
            "The frequency is nu = (2.998 x 10^8) divided by (7.00 x 10^-7) = "
            "4.28 x 10^14 Hz. A red photon carries less energy than a green one, "
            "because its longer wavelength means a lower frequency, and photon "
            "energy E = h times nu rises and falls with frequency."
        ),
        pitfall=(
            "The trap is thinking a brighter beam has more energetic photons. "
            "Turning up the brightness sends out more photons per second, but "
            "each photon's energy is fixed by its frequency alone, so a blinding "
            "red flashlight still delivers lower energy photons than a faint "
            "blue glow. Intensity counts photons; frequency sets each one's "
            "energy."
        ),
        claims=(
            Source(
                "The speed of light in vacuum is c = 2.998 x 10^8 m/s, a value "
                "fixed by definition in the SI system.",
                CRC_CONSTANTS,
            ),
            Source(
                "Planck's constant is h = 6.626 x 10^-34 J s, and the energy of "
                "a photon is its frequency multiplied by this constant.",
                CRC_CONSTANTS,
            ),
        ),
    ),
    "GEN1.SPECTRA": Lesson(
        node="GEN1.SPECTRA",
        objective=(
            "Explain why an atom emits light at discrete wavelengths, and use "
            "the hydrogen energy levels to find the wavelength of the photon "
            "released in a given electron transition."
        ),
        build_on=(
            "You now know a photon's energy is set by its wavelength through "
            "E = h times c divided by lambda, so each separate line an atom "
            "emits must correspond to one exact amount of energy."
        ),
        core_idea=(
            "Heat a gas or run a current through it and it glows, but a prism "
            "splits that glow not into a continuous rainbow but into a handful "
            "of sharp coloured lines separated by darkness. Bohr read this "
            "pattern correctly: the electron in an atom is allowed only certain "
            "energies, not any energy, so its energy levels are like rungs on a "
            "ladder with no footing in between. For hydrogen the energy of the "
            "level numbered n is E_n = minus R_H divided by n squared, where "
            "R_H is a fixed positive quantity, and the minus sign says a bound "
            "electron sits below the zero of a free electron. When an electron "
            "drops from a higher rung to a lower one it sheds exactly the "
            "difference in energy, and it sheds it as a single photon whose "
            "energy equals that difference. Because only certain rungs exist, "
            "only certain differences exist, so only certain photon energies and "
            "therefore only certain wavelengths appear. The discrete lines are "
            "direct evidence that energy inside the atom is discrete."
        ),
        worked_example=(
            "Find the wavelength emitted when a hydrogen electron falls from the "
            "n = 3 level to the n = 2 level, using R_H = 2.18 x 10^-18 J. First "
            "the two energies: E_3 = minus (2.18 x 10^-18) divided by 3 squared "
            "= minus 2.42 x 10^-19 J, and E_2 = minus (2.18 x 10^-18) divided "
            "by 2 squared = minus 5.45 x 10^-19 J. The photon carries away the "
            "drop in energy, E_3 minus E_2 = (minus 2.42 x 10^-19) minus (minus "
            "5.45 x 10^-19) = 3.03 x 10^-19 J. Now turn that energy into a "
            "wavelength with E = h times c divided by lambda, rearranged to "
            "lambda = h times c divided by E, using h = 6.626 x 10^-34 J s and "
            "c = 2.998 x 10^8 m/s: lambda = (6.626 x 10^-34 times 2.998 x 10^8) "
            "divided by (3.03 x 10^-19) = 6.56 x 10^-7 m, which is 656 nm. That "
            "is a red line, and it is the brightest line in the visible spectrum "
            "of hydrogen, the one that gives glowing hydrogen its pink cast."
        ),
        try_it_prompt=(
            "A hydrogen electron instead falls from n = 4 to n = 2. Without "
            "finishing the arithmetic, is the emitted photon higher or lower in "
            "energy than the n = 3 to n = 2 photon, and is its wavelength "
            "shorter or longer?"
        ),
        try_it_answer=(
            "Higher energy and shorter wavelength. The n = 4 rung sits above the "
            "n = 3 rung, so the fall to n = 2 covers a larger energy gap and "
            "releases a more energetic photon, and since E = h times c divided "
            "by lambda, more energy means a shorter wavelength (it comes out "
            "near 486 nm, a blue-green line)."
        ),
        pitfall=(
            "The trap is expecting a smooth glow of every colour. A hot solid "
            "does give a continuous rainbow, but a thin gas of single atoms does "
            "not, because its electrons can only make the fixed jumps its energy "
            "ladder allows. Seeing bright separated lines rather than a full "
            "spectrum is the whole clue that atomic energy is quantized."
        ),
        claims=(
            Source(
                "For a hydrogen atom the allowed electron energies are "
                "E_n = minus R_H divided by n squared, with R_H = 2.18 x 10^-18 "
                "J and n a positive whole number.",
                OPENSTAX_BOHR,
            ),
            Source(
                "The speed of light is c = 2.998 x 10^8 m/s and Planck's "
                "constant is h = 6.626 x 10^-34 J s.",
                CRC_CONSTANTS,
            ),
        ),
    ),
    "GEN1.QUANTUMMODEL": Lesson(
        node="GEN1.QUANTUMMODEL",
        objective=(
            "Describe an atomic orbital as a probability distribution rather "
            "than a path, and state what the Bohr model got right and what the "
            "quantum mechanical model replaced."
        ),
        build_on=(
            "Bohr's ladder of fixed energies matched the hydrogen lines exactly, "
            "but he pictured the electron circling the nucleus on a set track, "
            "and that picture is the part the quantum model had to abandon."
        ),
        core_idea=(
            "A moving electron behaves as much like a wave as like a particle, "
            "and a wave cannot be pinned to a point and a speed at the same "
            "instant. That limit is not a failure of measurement but a property "
            "of nature, and it means the sharp circular orbit Bohr drew cannot "
            "exist, because it would fix the electron's position and motion "
            "together. The quantum mechanical model keeps Bohr's best result, "
            "that the energies are quantized, and throws away the trajectory. In "
            "its place is a mathematical wave function whose square gives a "
            "probability density: the chance of finding the electron in a small "
            "volume of space. An orbital is the region that probability maps "
            "out, usually drawn as the surface enclosing a 90 percent chance of "
            "finding the electron. So a 1s orbital is a fuzzy sphere densest "
            "near the nucleus and fading outward, and a 2p orbital is two lobes "
            "on either side of a flat plane through the nucleus where the "
            "probability is exactly zero. The electron is somewhere in that "
            "cloud, but the model refuses to say it follows any particular line "
            "to get there."
        ),
        worked_example=(
            "Compare how the two models place the single electron of a hydrogen "
            "atom in its lowest state. Bohr fixes it on a circle of one exact "
            "radius, the value now called the Bohr radius, 52.9 pm, always that "
            "far from the nucleus and never nearer or farther. The quantum "
            "model instead gives the 1s orbital, and reading its probability "
            "cloud tells a different story: the probability density per unit "
            "volume is actually highest right at the nucleus and falls off "
            "smoothly with distance, so the electron has no single fixed "
            "distance at all. The one thing the two pictures share is that the "
            "most probable distance from the nucleus, once you account for the "
            "growing amount of space in each thin shell outward, works out to "
            "the same 52.9 pm Bohr used. The quantum cloud is not the orbit with "
            "fuzz added; it is a completely different claim, a spread of "
            "likelihoods rather than a location."
        ),
        try_it_prompt=(
            "A 2p orbital has a flat plane running through the nucleus on which "
            "the probability of finding the electron is zero, yet the electron "
            "turns up in the lobes on both sides of that plane. Why does this "
            "rule out picturing the orbital as a path the electron travels?"
        ),
        try_it_answer=(
            "Because a path is continuous, so anything moving from one lobe to "
            "the other along a line would have to cross the plane, but the "
            "probability of being on that plane is zero. An electron that "
            "appears on both sides while never being found on the dividing "
            "plane cannot be following a continuous track, which is exactly why "
            "an orbital is a probability map and not an orbit."
        ),
        pitfall=(
            "The trap is upgrading the orbit into a smeared cloud of electron "
            "substance, as if one electron spread itself thinly through the "
            "whole shape. The cloud is not stuff; it is where a single "
            "point-like electron is likely to be caught if you look. The density "
            "is a probability, not a fraction of the electron parked at each "
            "spot."
        ),
        claims=(
            Source(
                "The Bohr radius, the fixed orbit radius of Bohr's ground-state "
                "hydrogen atom and the most probable electron-nucleus distance "
                "in the quantum 1s orbital, is 52.9 pm.",
                CRC_CONSTANTS,
            ),
        ),
    ),
    "GEN1.CONFIGEXCEPTIONS": Lesson(
        node="GEN1.CONFIGEXCEPTIONS",
        objective=(
            "Write the ground-state configurations of chromium and copper, and "
            "write the configuration of a transition-metal cation by removing "
            "the outer-shell electrons first."
        ),
        build_on=(
            "You fill subshells in the order 4s before 3d to write a neutral "
            "atom's configuration, and this lesson handles the two elements that "
            "break that order and the reverse rule that governs ions."
        ),
        core_idea=(
            "The filling order is an excellent rule with a few exceptions, and "
            "the two you must know sit in the first transition row. A half "
            "filled d subshell (five electrons, one in each d orbital) and a "
            "completely filled d subshell (ten electrons) are slightly more "
            "stable than the plain filling order predicts, stable enough that "
            "one 4s electron will move into 3d to reach them. So chromium is "
            "[Ar] 4s1 3d5 rather than the expected 4s2 3d4, and copper is [Ar] "
            "4s1 3d10 rather than 4s2 3d9. The second rule concerns ions and is "
            "the one most often gotten backwards. Even though 4s fills before 3d "
            "in a neutral atom, when a transition metal loses electrons to "
            "become a cation, the electrons leave from the shell with the "
            "highest principal quantum number first, and that is the 4s shell, "
            "not the 3d. The rule for building a cation is therefore blunt: "
            "write the neutral atom, then strip electrons from 4s before 3d."
        ),
        worked_example=(
            "Write the configurations of the iron atom and its two common ions. "
            "Neutral iron has 26 electrons and follows the ordinary order, "
            "giving [Ar] 4s2 3d6. To make Fe2+ you remove two electrons, and the "
            "rule says take them from the highest shell first, which is 4s, so "
            "Fe2+ is [Ar] 3d6 with the 4s emptied and the 3d untouched. To make "
            "Fe3+ you remove one more, and now the only outer electrons left are "
            "in 3d, so one of those goes, giving [Ar] 3d5. That 3d5 is a half "
            "filled d subshell, the same arrangement chromium rearranges to "
            "reach, which is a large part of why Fe3+ is such a common and "
            "stable ion. Notice the order of operations that kept this correct: "
            "fill by the normal order to build the neutral atom, but empty from "
            "the outside in to build the ion."
        ),
        try_it_prompt=(
            "Zinc as a neutral atom is [Ar] 4s2 3d10. Write the configuration "
            "of the zinc ion Zn2+, and write the ground-state configuration of "
            "the chromium atom."
        ),
        try_it_answer=(
            "Zn2+ is [Ar] 3d10: the two lost electrons come from the outer 4s "
            "shell, leaving the filled 3d in place. Chromium is [Ar] 4s1 3d5, "
            "because one 4s electron shifts into 3d to give a half filled d "
            "subshell."
        ),
        pitfall=(
            "The trap is removing 3d electrons before 4s when forming a cation, "
            "on the reasoning that 4s filled first so it should empty last. It "
            "is the reverse: 4s fills first but empties first, because once the "
            "3d orbitals are occupied the 4s electrons are the outermost and "
            "highest in energy. Writing Fe2+ as [Ar] 4s2 3d4 is the classic "
            "version of this error."
        ),
        claims=(
            Source(
                "The chromium and copper electron configuration exceptions described here.",
                "OpenStax Chemistry 2e chapter 6",
            ),
        ),
    ),
    "GEN1.IONIZATION": Lesson(
        node="GEN1.IONIZATION",
        objective=(
            "Predict relative first ionization energies from position, account "
            "for the two dips within a period, and distinguish ionization "
            "energy from electron affinity."
        ),
        build_on=(
            "You explained atomic radius with two competing effects, a stronger "
            "net nuclear pull across a period and a new shell down a group, and "
            "the same two effects set how hard an electron is to remove."
        ),
        core_idea=(
            "First ionization energy is the energy needed to pull the "
            "outermost electron off a gaseous atom, and it is always positive "
            "because you are fighting the nucleus. Its broad trend is the "
            "mirror of radius: it rises across a period as the outer electrons "
            "are held more tightly and falls down a group as they move to "
            "shells farther out. Two dips interrupt the rise, and both come from "
            "subshell structure. Going from group 2 to group 13 the next "
            "electron starts a p subshell, which is higher in energy and easier "
            "to remove than the filled s beneath it, so boron sits below "
            "beryllium. Going from group 15 to group 16 the next electron must "
            "pair up in a p orbital that already holds one, and the repulsion of "
            "that pairing makes it easier to remove, so oxygen sits below "
            "nitrogen. Electron affinity is the partner idea, the energy change "
            "when a gaseous atom gains an electron instead of losing one; it is "
            "usually a release of energy and is largest for the halogens, which "
            "are one electron short of a filled shell. Ionization energy is "
            "about taking an electron; electron affinity is about giving one."
        ),
        worked_example=(
            "Explain why oxygen has a lower first ionization energy than "
            "nitrogen even though oxygen has one more proton. Nitrogen is "
            "[He] 2s2 2p3, and by the filling rule each of its three 2p "
            "electrons sits alone in its own p orbital, a half filled subshell "
            "with no forced pairing. Oxygen is [He] 2s2 2p4, so its fourth 2p "
            "electron has to share an orbital with another, and two electrons "
            "crowded into one orbital repel each other. Removing that crowded "
            "electron relieves the repulsion, so it comes off more easily than "
            "the trend from the added proton alone would suggest. The measured "
            "first ionization energies bear this out: nitrogen is 1402 kJ/mol "
            "and oxygen is 1314 kJ/mol, a genuine step down in the middle of an "
            "otherwise rising period. The added proton still pulls harder, but "
            "the pairing penalty in oxygen more than cancels it here."
        ),
        try_it_prompt=(
            "Magnesium is [Ne] 3s2 and aluminium is [Ne] 3s2 3p1. Which has the "
            "higher first ionization energy, and which subshell effect decides "
            "it?"
        ),
        try_it_answer=(
            "Magnesium has the higher first ionization energy. Aluminium's "
            "outermost electron is the lone 3p, which is higher in energy and "
            "better shielded than the filled 3s below it, so it comes off more "
            "easily than one of magnesium's paired 3s electrons, and aluminium's "
            "value (578 kJ/mol) sits below magnesium's (738 kJ/mol). This is the "
            "group 2 to group 13 dip, one period down from beryllium and boron."
        ),
        pitfall=(
            "The trap is expecting the rise across a period to be perfectly "
            "smooth, so that more protons always means a higher ionization "
            "energy. The half filled and filled subshell structure breaks the "
            "smoothness twice in each short period, at the group 13 and group 16 "
            "elements, and treating the trend as a straight line predicts the "
            "wrong order for boron and for oxygen."
        ),
        claims=(
            Source(
                "First ionization energies in period 2 include nitrogen at "
                "1402 kJ/mol and oxygen at 1314 kJ/mol, and in period 3 "
                "magnesium at 738 kJ/mol and aluminium at 578 kJ/mol.",
                OPENSTAX_TRENDS,
            ),
        ),
    ),
    "GEN1.ELECTRONEG": Lesson(
        node="GEN1.ELECTRONEG",
        objective=(
            "Use the difference in electronegativity between two atoms to "
            "classify their bond as nonpolar covalent, polar covalent or "
            "ionic, and connect electronegativity to metallic character."
        ),
        build_on=(
            "Ionization energy measured how hard an atom holds its own outer "
            "electron, and electronegativity measures the same grip turned "
            "outward, onto the electrons an atom shares in a bond."
        ),
        core_idea=(
            "Electronegativity is the tendency of a bonded atom to pull shared "
            "electrons toward itself, reported on the Pauling scale that runs "
            "from a little under 1 for the most metallic elements up to about 4 "
            "for fluorine, the strongest puller. Its trend follows ionization "
            "energy: it rises across a period and falls down a group, so the "
            "top right of the table (short of the noble gases) holds the "
            "hungriest atoms and the bottom left the most generous. Metallic "
            "character is the opposite quantity: metals have low electronegativity "
            "and give electrons up, and the elements grow more metallic to the "
            "left and down. The gap in electronegativity between two bonded "
            "atoms predicts the bond. A gap near zero means the pair shares "
            "evenly, a nonpolar covalent bond; a moderate gap means unequal "
            "sharing with partial charges, a polar covalent bond; a large gap "
            "means one atom takes the electrons outright, an ionic bond. Rough "
            "guideposts put the polar covalent band from about 0.4 to about 1.7 "
            "and call larger gaps ionic, but these are chosen cutoffs on a "
            "continuous scale, not sharp natural boundaries."
        ),
        worked_example=(
            "Classify three bonds by their electronegativity gap, using Pauling "
            "values H 2.20, Cl 3.16 and Na 0.93. In the hydrogen molecule the "
            "two atoms are identical, so the gap is exactly 0 and the pair is "
            "shared evenly: a nonpolar covalent bond. In hydrogen chloride the "
            "gap is 3.16 minus 2.20 = 0.96, in the middle band, so the electrons "
            "spend more time on chlorine and the bond is polar covalent, with a "
            "partial negative charge (delta minus) on chlorine and a partial "
            "positive (delta plus) on hydrogen. In sodium chloride the gap is "
            "3.16 minus 0.93 = 2.23, above the rough 1.7 mark, so chlorine takes "
            "the electron and the bond is ionic, a lattice of Na+ and Cl-. Read "
            "the three side by side and you see one continuous story, from equal "
            "sharing through lopsided sharing to outright transfer, tracked by a "
            "single rising number."
        ),
        try_it_prompt=(
            "An oxygen-hydrogen bond joins atoms with electronegativities O "
            "3.44 and H 2.20. Is the bond polar covalent or ionic, and which "
            "atom carries the partial negative charge?"
        ),
        try_it_answer=(
            "The gap is 3.44 minus 2.20 = 1.24, which falls in the polar "
            "covalent band, so the bond is polar covalent, not ionic. Oxygen is "
            "the more electronegative atom, so it carries the partial negative "
            "charge (delta minus) and hydrogen carries the partial positive "
            "(delta plus)."
        ),
        pitfall=(
            "The trap is reading the 1.7 cutoff as a law that flips a bond from "
            "covalent to ionic at a hard line. The scale is continuous, and "
            "hydrogen fluoride, with a gap of about 1.78, is a molecular gas of "
            "polar covalent molecules rather than an ionic solid. The cutoffs "
            "are handy labels for a smooth trend, not switches."
        ),
        claims=(
            Source(
                "Pauling electronegativities used here are H 2.20, Cl 3.16, "
                "Na 0.93 and O 3.44, on a scale where fluorine is the highest "
                "at about 3.98.",
                OPENSTAX_EN,
            ),
        ),
    ),
    "GEN1.COVALENTBOND": Lesson(
        node="GEN1.COVALENTBOND",
        objective=(
            "Explain a covalent bond as a shared pair of electrons that lowers "
            "the system's energy, and use electronegativity to decide whether "
            "the bond is polar or nonpolar."
        ),
        build_on=(
            "When two atoms differ enough in electronegativity one takes the "
            "electrons and you get an ionic bond; this lesson is the other "
            "case, where the gap is small and neither atom wins them outright."
        ),
        core_idea=(
            "A covalent bond is two nuclei sharing a pair of electrons because "
            "sharing lowers their total energy. Bring two hydrogen atoms toward "
            "each other and, at first, each nucleus starts to feel the other's "
            "electron as well as its own, so the potential energy drops. It "
            "keeps dropping until the two nuclei reach a separation where the "
            "attraction to the shared pair is best balanced against the nuclei "
            "pushing on each other; that separation is the bond length and the "
            "depth of the energy well is the bond energy, the same energy you "
            "would have to pay back to break the bond. Push the nuclei closer "
            "than the bond length and the energy shoots up as they repel. When "
            "the two bonded atoms are identical the pair sits centred between "
            "them and the bond is nonpolar. When they differ in electronegativity "
            "the pair shifts toward the greedier atom, leaving it slightly "
            "negative and its partner slightly positive; the bond is polar and "
            "carries a small separation of charge called a dipole."
        ),
        worked_example=(
            "Follow two atoms into a bond and then compare a nonpolar bond with "
            "a polar one. As two hydrogen atoms approach, their shared electrons "
            "let each nucleus feel extra attraction, and the potential energy "
            "falls to a minimum at a separation of 74 pm, which is the H-H bond "
            "length; the well is 436 kJ/mol deep, so that is the energy needed "
            "to pull one mole of H2 back into atoms. Because the two atoms are "
            "the same, the pair is shared equally and H2 is nonpolar. Now take "
            "hydrogen chloride, H-Cl. Chlorine is more electronegative than "
            "hydrogen, so the shared pair spends more of its time near chlorine, "
            "giving chlorine a partial negative charge and hydrogen a partial "
            "positive one. The bond still holds the two atoms together by a "
            "shared pair, but the charge is now lopsided, so HCl is a polar "
            "molecule while H2 is not."
        ),
        try_it_prompt=(
            "The fluorine molecule F2 is two fluorine atoms joined by a shared "
            "pair. Is the bond polar or nonpolar, and where does the shared pair "
            "sit relative to the two nuclei?"
        ),
        try_it_answer=(
            "The bond is nonpolar. The two atoms are identical, so they have "
            "equal electronegativity and pull on the shared pair equally, "
            "leaving it centred between the two nuclei with no partial charges "
            "on either atom."
        ),
        pitfall=(
            "The trap is believing that covalent means the electrons sit exactly "
            "halfway, or that covalent bonds are never polar. Equal sharing "
            "happens only when the two atoms are the same or nearly so; most "
            "bonds between different elements are covalent and polar at once, "
            "with the pair shifted toward the more electronegative atom."
        ),
        claims=(
            Formula(DIHYDROGEN, "H2", "the hydrogen molecule"),
            Formula(HYDROGEN_CHLORIDE, "HCl", "hydrogen chloride, a polar molecule"),
            Formula(DIFLUORINE, "F2", "the fluorine molecule"),
            Source(
                "The H-H bond in dihydrogen has a length of 74 pm and a bond "
                "energy of 436 kJ/mol.",
                OPENSTAX_BONDS,
            ),
        ),
    ),
    "GEN1.FORMALCHARGE": Lesson(
        node="GEN1.FORMALCHARGE",
        objective=(
            "Calculate the formal charge on each atom in a Lewis structure and "
            "use the set of formal charges to choose the better of two "
            "structures that both satisfy the octet."
        ),
        build_on=(
            "You can draw a Lewis structure that spends the right number of "
            "valence electrons, and formal charge is the bookkeeping tool that "
            "decides between two drawings when more than one obeys the octet."
        ),
        core_idea=(
            "Formal charge is a bookkeeping charge you assign to each atom in a "
            "Lewis structure by pretending every bond is shared perfectly "
            "evenly. The recipe is: formal charge equals the atom's valence "
            "electrons, minus its lone-pair electrons, minus half of its bonding "
            "electrons. In words, you give each atom all of its lone-pair "
            "electrons and exactly half of every bond, then see whether it ended "
            "up with more or fewer electrons than a free atom of that element "
            "brings. The formal charges on all the atoms must add up to the "
            "overall charge of the molecule or ion, which is a running check. "
            "The point of computing them is comparison: when two structures both "
            "satisfy the octet, the better one is the structure whose formal "
            "charges are closest to zero, and among structures that tie, the one "
            "that puts any negative formal charge on the more electronegative "
            "atom."
        ),
        worked_example=(
            "Use formal charge to confirm that carbon dioxide is best drawn as "
            "O=C=O. In that structure carbon has four bonds and no lone pairs, "
            "so its formal charge is 4 minus 0 minus half of 8 = 4 minus 4 = 0. "
            "Each oxygen has a double bond and two lone pairs, so its formal "
            "charge is 6 minus 4 minus half of 4 = 6 minus 4 minus 2 = 0. Every "
            "atom is zero and the sum is zero, matching a neutral molecule. Now "
            "test the rival structure with one triple bond and one single bond, "
            "O(triple bond)C-O. Carbon still has four bonds, formal charge 0, "
            "but the triple-bonded oxygen has one lone pair and three bonds, "
            "giving 6 minus 2 minus 3 = +1, and the single-bonded oxygen has "
            "three lone pairs and one bond, giving 6 minus 6 minus 1 = minus 1. "
            "This rival forces a +1 and a minus 1 onto atoms that did not need "
            "them, so the all-zero O=C=O structure is the better description."
        ),
        try_it_prompt=(
            "The cyanide ion is drawn as a carbon and a nitrogen joined by a "
            "triple bond, with one lone pair on each, and an overall charge of "
            "1 minus. Find the formal charge on the carbon and on the nitrogen."
        ),
        try_it_answer=(
            "Carbon: 4 valence minus 2 lone-pair minus half of 6 bonding = 4 "
            "minus 2 minus 3 = minus 1. Nitrogen: 5 minus 2 minus 3 = 0. The two "
            "add to minus 1, matching the ion's charge, and the negative formal "
            "charge sits on carbon."
        ),
        pitfall=(
            "The trap is reading formal charge as the real charge on the atom. "
            "Formal charge deliberately splits every bond down the middle, which "
            "ignores that a more electronegative atom actually holds the shared "
            "electrons more tightly. It is a tool for ranking structures on "
            "paper, not a measurement of where the charge really is."
        ),
        claims=(
            Formula(CARBON_DIOXIDE, "CO2", "carbon dioxide, drawn O=C=O"),
            Formula(CYANIDE, "CN-", "the cyanide ion"),
        ),
    ),
    "GEN1.RESONANCE": Lesson(
        node="GEN1.RESONANCE",
        objective=(
            "Recognise when a species needs more than one Lewis structure, draw "
            "the resonance contributors, and describe the real molecule as their "
            "average rather than a switch between them."
        ),
        build_on=(
            "Formal charge lets you rank competing structures, and resonance is "
            "what happens when several equally good structures tie: none of them "
            "alone is right, and the real species is their blend."
        ),
        core_idea=(
            "Sometimes the electrons of a molecule can be drawn in two or more "
            "equivalent arrangements that differ only in where the double bonds "
            "and lone pairs sit, not in where the atoms sit. When that happens "
            "the true molecule is not any one of those drawings and does not "
            "flicker between them; it is a single unchanging structure that is "
            "the average of them, with the shared electrons spread out, or "
            "delocalized, over all the positions the drawings disagree about. "
            "Chemists write the contributors separated by a double-headed arrow "
            "to signal that the arrow means average, not conversion. This "
            "spreading of electrons lowers the energy, so a molecule with "
            "resonance is more stable than any single contributor suggests. The "
            "sharpest evidence is bond length: where the drawings put a double "
            "bond in one place and a single bond in another, the real molecule "
            "shows every one of those bonds the same length, intermediate "
            "between a pure single and a pure double bond."
        ),
        worked_example=(
            "Work through the nitrate ion, NO3-. Count its valence electrons: "
            "nitrogen brings 5, three oxygens bring 6 each for 18, and the "
            "1 minus charge adds 1, giving 24. One good Lewis structure puts a "
            "double bond from nitrogen to one oxygen and single bonds to the "
            "other two, which satisfies every octet; checking formal charges "
            "gives the double-bonded oxygen 0, each single-bonded oxygen minus "
            "1, and nitrogen +1, summing to minus 1 as required. But the double "
            "bond could equally be drawn to any of the three oxygens, so there "
            "are three equivalent contributors. The real ion is their average: "
            "all three nitrogen-oxygen bonds are identical, each with a bond "
            "order of 4 divided by 3, about 1.33, and the negative charge is "
            "spread evenly so each oxygen carries about two-thirds of a minus "
            "charge. Measurements agree, showing three equal bonds intermediate "
            "in length between a nitrogen-oxygen single and double bond."
        ),
        try_it_prompt=(
            "Ozone, O3, is drawn with a double bond to one end oxygen and a "
            "single bond to the other, and a second contributor swaps which end "
            "gets the double bond. What does resonance predict about the two "
            "oxygen-oxygen bond lengths in the real molecule?"
        ),
        try_it_answer=(
            "The two bonds are equal to each other and intermediate in length "
            "between a true single and a true double bond. The real ozone "
            "molecule is the average of the two contributors, so neither bond is "
            "purely single or purely double; both come out the same, with a bond "
            "order of about 1.5."
        ),
        pitfall=(
            "The trap is imagining the molecule rapidly flipping back and forth "
            "between its contributors, spending some time as each. Resonance is "
            "not an equilibrium and nothing is moving; the double-headed arrow "
            "is an admission that a single Lewis structure cannot capture "
            "delocalized electrons, so we draw several and mean their average, "
            "one steady structure."
        ),
        claims=(
            Formula(NITRATE, "NO3-", "the nitrate ion, three equivalent contributors"),
            Formula(OZONE, "O3", "ozone, two equivalent contributors"),
            Source(
                "In the nitrate ion the three nitrogen-oxygen bonds are "
                "measured to be identical in length and intermediate between a "
                "nitrogen-oxygen single and double bond.",
                OPENSTAX_RESONANCE,
            ),
        ),
    ),
    "GEN1.OCTETEXCEPTIONS": Lesson(
        node="GEN1.OCTETEXCEPTIONS",
        objective=(
            "Identify and draw the three classes of octet exception: "
            "electron-deficient atoms, odd-electron species, and atoms with an "
            "expanded octet."
        ),
        build_on=(
            "The octet target guided every Lewis structure you have drawn, and "
            "this lesson names the three situations where a correct structure "
            "leaves an atom with something other than eight electrons."
        ),
        core_idea=(
            "The octet rule holds for most structures but breaks in three named "
            "ways. First, some atoms are stable with fewer than eight: boron and "
            "beryllium form compounds in which the central atom has only six or "
            "even four electrons around it, which leaves them hungry for a lone "
            "pair and makes them strong electron acceptors. Second, a molecule "
            "with an odd total number of valence electrons cannot pair every "
            "electron, so at least one atom is left with an unpaired electron "
            "and cannot reach eight; these odd-electron species are called "
            "radicals, and nitric oxide and nitrogen dioxide are examples. "
            "Third, atoms in period 3 and below can hold more than eight, an "
            "expanded octet, because they are larger and have more room to "
            "accommodate the extra pairs; phosphorus in PCl5 has ten electrons "
            "around it and sulfur in SF6 has twelve. The hard boundary to "
            "remember is that the second-period atoms carbon, nitrogen, oxygen "
            "and fluorine never exceed eight; only period 3 and beyond expand."
        ),
        worked_example=(
            "Build the Lewis structure of sulfur hexafluoride, SF6, and see the "
            "expanded octet directly. Count valence electrons: sulfur brings 6 "
            "and each of six fluorines brings 7, for 6 plus 42 = 48. Draw the "
            "six sulfur-fluorine single bonds, which uses 6 times 2 = 12 "
            "electrons, and hand the remaining 48 minus 12 = 36 out as lone "
            "pairs, three on each fluorine (six fluorines times six electrons = "
            "36). Every fluorine now has its octet, and sulfur sits at the "
            "centre of six bonds, so it has 12 electrons around it, half again "
            "the octet. This is allowed because sulfur is in period 3 and large "
            "enough to carry the extra pairs. Contrast nitrogen, one row up: no "
            "structure gives nitrogen more than eight electrons, which is why "
            "there is no NF5 or NF6 to match phosphorus."
        ),
        try_it_prompt=(
            "Boron trifluoride, BF3, is drawn with three boron-fluorine single "
            "bonds and no lone pairs on boron. How many electrons surround "
            "boron, and does that leave the molecule electron-rich or "
            "electron-deficient?"
        ),
        try_it_answer=(
            "Boron has three single bonds and nothing else, so it is surrounded "
            "by only six electrons, short of an octet. That makes BF3 "
            "electron-deficient, an incomplete octet, which is why boron readily "
            "accepts a lone pair from another molecule to reach eight."
        ),
        pitfall=(
            "The trap is forcing an octet where the exception applies: adding a "
            "boron-fluorine double bond to give boron eight electrons, or "
            "drawing five bonds to nitrogen to match phosphorus. Second-period "
            "atoms are capped at eight and cannot expand, while boron is content "
            "with six, so the honest structure sometimes breaks the octet on "
            "purpose."
        ),
        claims=(
            Formula(BORON_TRIFLUORIDE, "BF3", "boron trifluoride, incomplete octet"),
            Formula(SULFUR_HEXAFLUORIDE, "F6S", "sulfur hexafluoride, expanded octet"),
            Formula(NITRIC_OXIDE, "NO", "nitric oxide, an odd-electron radical"),
            Formula(
                PHOSPHORUS_PENTACHLORIDE, "Cl5P",
                "phosphorus pentachloride, expanded octet",
            ),
        ),
    ),
    "GEN1.BONDPROPERTIES": Lesson(
        node="GEN1.BONDPROPERTIES",
        objective=(
            "Read the bond order from a Lewis structure and predict how bond "
            "length and bond strength change with it."
        ),
        build_on=(
            "You can count the bonds between two atoms from a Lewis or resonance "
            "structure, and bond order is that count, which turns out to move "
            "together with how long and how strong the bond is."
        ),
        core_idea=(
            "Bond order is the number of shared electron pairs holding two atoms "
            "together: one for a single bond, two for a double, three for a "
            "triple, and a fraction when resonance spreads the bonding out. "
            "Three properties of a bond move together as its order rises. Bond "
            "length, the distance between the two nuclei, gets shorter, because "
            "more shared pairs pull the nuclei more tightly toward the space "
            "between them. Bond strength, measured as the bond energy or bond "
            "enthalpy needed to break the bond, gets larger for the same reason. "
            "So a higher bond order means a shorter and stronger bond, and the "
            "three quantities are three views of one thing, the amount of shared "
            "electron glue. This also connects back to the bond enthalpies you "
            "used in thermochemistry: a triple bond stores more energy to break "
            "than a double, and a double more than a single, between the same "
            "pair of atoms."
        ),
        worked_example=(
            "Compare the carbon-carbon bond across ethane, ethene and ethyne. "
            "Ethane, C2H6, has a carbon-carbon single bond, bond order 1. "
            "Ethene, C2H4, has a carbon-carbon double bond, bond order 2. "
            "Ethyne, C2H2, has a carbon-carbon triple bond, bond order 3. As the "
            "order climbs from 1 to 2 to 3, the measured bond length falls from "
            "154 pm to 134 pm to 120 pm, the nuclei drawn steadily closer, and "
            "the measured bond energy rises from 346 kJ/mol to 602 kJ/mol to "
            "835 kJ/mol, the bond growing steadily harder to break. Notice the "
            "two trends run in opposite directions, shorter and stronger "
            "together, which is exactly what more shared pairs between the same "
            "two atoms should do."
        ),
        try_it_prompt=(
            "Each nitrogen-oxygen bond in the nitrate ion has a bond order of "
            "about 1.33 because of resonance. Predict how its length compares "
            "with a true nitrogen-oxygen single bond and a true nitrogen-oxygen "
            "double bond."
        ),
        try_it_answer=(
            "The nitrate bond is intermediate in length, shorter than a true "
            "single bond but longer than a true double bond, and all three of "
            "its bonds are equal. A bond order of 1.33 sits between 1 and 2, so "
            "the length sits between the single-bond and double-bond lengths."
        ),
        pitfall=(
            "The trap is thinking a longer bond must be the stronger one, as if "
            "reaching farther meant holding harder. It is the reverse: the "
            "shorter, higher-order bond is the stronger one. It also helps to "
            "remember that bond order need not be a whole number, since "
            "resonance can leave it at values like 1.33 or 1.5."
        ),
        claims=(
            Formula(ETHANE, "C2H6", "ethane, carbon-carbon single bond"),
            Formula(ETHENE, "C2H4", "ethene, carbon-carbon double bond"),
            Formula(ETHYNE, "C2H2", "ethyne, carbon-carbon triple bond"),
            Source(
                "Carbon-carbon bond lengths are about 154 pm (single), 134 pm "
                "(double) and 120 pm (triple), with bond energies of about "
                "346, 602 and 835 kJ/mol respectively.",
                OPENSTAX_BONDS,
            ),
        ),
    ),
}

"""Element property data for the OCTET periodic table explorer.

Every chemistry fact in OCTET lives in a reviewed data file with a cited
source rather than inline in application code. This file is that data file for
the 118 named elements.

REVIEW is "pending". While it reads "pending", no value in this file may be
presented anywhere in the product as expert verified. The explorer may render
the numbers, but it may not attach a claim that a subject matter expert has
checked them.

Honesty rule that governs the whole table. A property that is estimated,
extrapolated, calculated but not measured, or simply unknown is None. It is
never a plausible looking number. The UI renders None as "not measured", and
that reading is only true if nothing here was invented. A guessed value would
be indistinguishable from a measured one once it sits in the column, so no
value was guessed.

Sources.
  Atomic masses. IUPAC 2021 standard atomic weights (Prohaska et al., Pure and
    Applied Chemistry 94(5), 573-600, 2022), cross checked against the CRC
    Handbook of Chemistry and Physics, 97th edition. Where IUPAC gives an
    interval, the conventional value is used.
  First ionization energies and electron affinities. CRC Handbook of Chemistry
    and Physics, 97th edition.
  Pauling electronegativities. As tabulated in the CRC Handbook of Chemistry
    and Physics, 97th edition.
  Atomic radii. Slater, J. C., "Atomic Radii in Crystals", Journal of Chemical
    Physics 41, 3199-3204 (1964).

Radius convention, stated explicitly because a mixed column makes a trend map
lie. atomic_radius_pm is the Slater (1964) empirical radius throughout and
nothing else is ever substituted into it. Slater derived these from observed
bond lengths in crystals and molecules and quoted them to 0.05 angstrom, so
every value in the column is a multiple of 5 pm. Slater published no radius
for any noble gas, for astatine, for francium, or for anything beyond
americium, and those elements therefore read None. Calculated radii from
Clementi (1963) exist and would fill several of those gaps, but they are a
different quantity on a different basis, and mixing them in would produce a
smooth trend surface that no single body of measurement supports.

Atomic mass of synthetic elements. An element with no stable or primordial
isotope has no standard atomic weight. For those, atomic_mass is the mass
number of the longest lived known isotope, an integer, rather than a weighted
average over a natural abundance that does not exist. This applies to
technetium, promethium, and everything from polonium (Z=84) upward except
thorium, protactinium, and uranium, which do have standard atomic weights.

Electron configurations. Ground state configurations are the experimentally
observed ones, including the irregularities that a naive Aufbau filling gets
wrong. Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag, La, Ce, Gd, Pt, Au, Ac, Th, Pa, U, Np
and Cm all deviate, and each carries a note. From rutherfordium (Z=104) upward
no configuration has been measured; those entries are relativistic predictions
and say so. Lawrencium's [Rn] 5f14 7s2 7p1 is a prediction supported by its
measured first ionization energy, not a direct spectroscopic determination.

Where values are deliberately absent.
  Helium, neon and argon have no Pauling electronegativity. The scale is
    defined from bond energies, and these elements form no bond from which one
    could be derived. Krypton and xenon do have values, because krypton and
    xenon fluorides exist. Radon reads None because the numbers quoted for it
    are estimates.
  No noble gas has a bound anion, so electron affinity is None across group
    18. The same holds for Be, N, Mg, Mn, Zn, Cd and Hg.
  Lanthanide electron affinities are not reliably established and are None
    across the series.
  Francium and astatine are known almost entirely from short lived isotopes.
    Their first ionization energies were measured by laser spectroscopy and are
    given. Everything else about them here is None, including bulk state, since
    neither has been produced in a weighable quantity.
  From fermium (Z=100) upward the measured properties run out, so
    electronegativity, radius, ionization energy, electron affinity and bulk
    state are all None. Later ionization energy measurements for lawrencium and
    nobelium exist in the primary literature but are not in the sources cited
    above, so they stay None until review adds them with a citation.

Category vocabulary is fixed, because the explorer colours cells from it:
alkali metal, alkaline earth metal, transition metal, post-transition metal,
metalloid, reactive nonmetal, noble gas, lanthanide, actinide, unknown. The
value "unknown" marks elements whose chemistry is uncharacterised or contested
rather than elements whose numbers happen to be missing. Following IUPAC that
is Z=109 onward, plus Cn, Nh, Fl, Mc, Lv, Ts and Og.

Group assignment for the f block. Elements 57-71 and 89-103 carry group None,
so group 3 holds scandium and yttrium only. This is a layout choice, and it is
the one the explorer's grid is built on.

Helium is block "s" because its configuration is 1s2, even though it sits in
group 18 with the p block noble gases.
"""

from __future__ import annotations

from dataclasses import dataclass

REVIEW = "pending"


@dataclass(frozen=True)
class Element:
    symbol: str
    name: str
    number: int
    period: int
    # None for the lanthanides and the actinides. See the module docstring.
    group: int | None
    block: str
    category: str
    # Standard atomic weight in u, or the mass number of the longest lived
    # isotope where no standard atomic weight exists.
    atomic_mass: float
    # ASCII only. Superscripts do not survive every consumer of this data.
    electron_configuration: str
    # Pauling scale.
    electronegativity: float | None
    # Slater (1964) empirical radius in picometres. One convention, no mixing.
    atomic_radius_pm: float | None
    # First ionization energy only.
    ionization_energy_kJmol: float | None
    # Positive means energy is released when the electron is attached.
    electron_affinity_kJmol: float | None
    state_at_stp: str
    note: str = ""


# Rows are positional and follow the field order declared above. An insertion
# that shifts a column silently corrupts a trend layer, so keep the order.
ELEMENTS: list[Element] = [
    Element("H", "Hydrogen", 1, 1, 1, "s", "reactive nonmetal", 1.008, "1s1", 2.20, 25.0, 1312.0, 72.8, "gas", ""),
    Element("He", "Helium", 2, 1, 18, "s", "noble gas", 4.002602, "1s2", None, None, 2372.3, None, "gas", "Block is s by configuration despite the group 18 placement."),
    Element("Li", "Lithium", 3, 2, 1, "s", "alkali metal", 6.94, "[He] 2s1", 0.98, 145.0, 520.2, 59.6, "solid", ""),
    Element("Be", "Beryllium", 4, 2, 2, "s", "alkaline earth metal", 9.0121831, "[He] 2s2", 1.57, 105.0, 899.5, None, "solid", "The beryllium anion is unbound, so there is no electron affinity to report."),
    Element("B", "Boron", 5, 2, 13, "p", "metalloid", 10.81, "[He] 2s2 2p1", 2.04, 85.0, 800.6, 26.7, "solid", "Ionization energy falls below beryllium's because the 2p electron is less tightly held than the filled 2s pair."),
    Element("C", "Carbon", 6, 2, 14, "p", "reactive nonmetal", 12.011, "[He] 2s2 2p2", 2.55, 70.0, 1086.5, 121.8, "solid", ""),
    Element("N", "Nitrogen", 7, 2, 15, "p", "reactive nonmetal", 14.007, "[He] 2s2 2p3", 3.04, 65.0, 1402.3, None, "gas", "The nitrogen anion is unbound, so there is no electron affinity to report."),
    Element("O", "Oxygen", 8, 2, 16, "p", "reactive nonmetal", 15.999, "[He] 2s2 2p4", 3.44, 60.0, 1313.9, 141.0, "gas", "Ionization energy falls below nitrogen's because the paired 2p electrons repel each other."),
    Element("F", "Fluorine", 9, 2, 17, "p", "reactive nonmetal", 18.998403162, "[He] 2s2 2p5", 3.98, 50.0, 1681.0, 328.0, "gas", ""),
    Element("Ne", "Neon", 10, 2, 18, "p", "noble gas", 20.1797, "[He] 2s2 2p6", None, None, 2080.7, None, "gas", ""),
    Element("Na", "Sodium", 11, 3, 1, "s", "alkali metal", 22.98976928, "[Ne] 3s1", 0.93, 180.0, 495.8, 52.9, "solid", ""),
    Element("Mg", "Magnesium", 12, 3, 2, "s", "alkaline earth metal", 24.305, "[Ne] 3s2", 1.31, 150.0, 737.7, None, "solid", "The magnesium anion is unbound."),
    Element("Al", "Aluminium", 13, 3, 13, "p", "post-transition metal", 26.9815384, "[Ne] 3s2 3p1", 1.61, 125.0, 577.5, 42.5, "solid", ""),
    Element("Si", "Silicon", 14, 3, 14, "p", "metalloid", 28.085, "[Ne] 3s2 3p2", 1.90, 110.0, 786.5, 134.1, "solid", ""),
    Element("P", "Phosphorus", 15, 3, 15, "p", "reactive nonmetal", 30.973761998, "[Ne] 3s2 3p3", 2.19, 100.0, 1011.8, 72.0, "solid", ""),
    Element("S", "Sulfur", 16, 3, 16, "p", "reactive nonmetal", 32.06, "[Ne] 3s2 3p4", 2.58, 100.0, 999.6, 200.4, "solid", ""),
    Element("Cl", "Chlorine", 17, 3, 17, "p", "reactive nonmetal", 35.45, "[Ne] 3s2 3p5", 3.16, 100.0, 1251.2, 349.0, "gas", ""),
    Element("Ar", "Argon", 18, 3, 18, "p", "noble gas", 39.95, "[Ne] 3s2 3p6", None, None, 1520.6, None, "gas", "No Pauling value by convention; argon forms no bond from which one could be derived."),
    Element("K", "Potassium", 19, 4, 1, "s", "alkali metal", 39.0983, "[Ar] 4s1", 0.82, 220.0, 418.8, 48.4, "solid", ""),
    Element("Ca", "Calcium", 20, 4, 2, "s", "alkaline earth metal", 40.078, "[Ar] 4s2", 1.00, 180.0, 589.8, 2.37, "solid", ""),
    Element("Sc", "Scandium", 21, 4, 3, "d", "transition metal", 44.955907, "[Ar] 3d1 4s2", 1.36, 160.0, 633.1, 18.1, "solid", ""),
    Element("Ti", "Titanium", 22, 4, 4, "d", "transition metal", 47.867, "[Ar] 3d2 4s2", 1.54, 140.0, 658.8, 7.6, "solid", ""),
    Element("V", "Vanadium", 23, 4, 5, "d", "transition metal", 50.9415, "[Ar] 3d3 4s2", 1.63, 135.0, 650.9, 50.6, "solid", ""),
    Element("Cr", "Chromium", 24, 4, 6, "d", "transition metal", 51.9961, "[Ar] 3d5 4s1", 1.66, 140.0, 652.9, 64.3, "solid", "Configuration is 3d5 4s1, not the Aufbau 3d4 4s2."),
    Element("Mn", "Manganese", 25, 4, 7, "d", "transition metal", 54.938043, "[Ar] 3d5 4s2", 1.55, 140.0, 717.3, None, "solid", "The manganese anion is unbound."),
    Element("Fe", "Iron", 26, 4, 8, "d", "transition metal", 55.845, "[Ar] 3d6 4s2", 1.83, 140.0, 762.5, 15.7, "solid", ""),
    Element("Co", "Cobalt", 27, 4, 9, "d", "transition metal", 58.933194, "[Ar] 3d7 4s2", 1.88, 135.0, 760.4, 63.7, "solid", ""),
    Element("Ni", "Nickel", 28, 4, 10, "d", "transition metal", 58.6934, "[Ar] 3d8 4s2", 1.91, 135.0, 737.1, 112.0, "solid", "Atomic mass is lower than cobalt's although the atomic number is higher."),
    Element("Cu", "Copper", 29, 4, 11, "d", "transition metal", 63.546, "[Ar] 3d10 4s1", 1.90, 135.0, 745.5, 118.4, "solid", "Configuration is 3d10 4s1, not the Aufbau 3d9 4s2."),
    Element("Zn", "Zinc", 30, 4, 12, "d", "transition metal", 65.38, "[Ar] 3d10 4s2", 1.65, 135.0, 906.4, None, "solid", "The zinc anion is unbound."),
    Element("Ga", "Gallium", 31, 4, 13, "p", "post-transition metal", 69.723, "[Ar] 3d10 4s2 4p1", 1.81, 130.0, 578.8, 28.9, "solid", ""),
    Element("Ge", "Germanium", 32, 4, 14, "p", "metalloid", 72.630, "[Ar] 3d10 4s2 4p2", 2.01, 125.0, 762.2, 119.0, "solid", ""),
    Element("As", "Arsenic", 33, 4, 15, "p", "metalloid", 74.921595, "[Ar] 3d10 4s2 4p3", 2.18, 115.0, 944.5, 78.0, "solid", ""),
    Element("Se", "Selenium", 34, 4, 16, "p", "reactive nonmetal", 78.971, "[Ar] 3d10 4s2 4p4", 2.55, 115.0, 941.0, 195.0, "solid", ""),
    Element("Br", "Bromine", 35, 4, 17, "p", "reactive nonmetal", 79.904, "[Ar] 3d10 4s2 4p5", 2.96, 115.0, 1139.9, 324.6, "liquid", ""),
    Element("Kr", "Krypton", 36, 4, 18, "p", "noble gas", 83.798, "[Ar] 3d10 4s2 4p6", 3.00, None, 1350.8, None, "gas", "A Pauling value exists because krypton difluoride does."),
    Element("Rb", "Rubidium", 37, 5, 1, "s", "alkali metal", 85.4678, "[Kr] 5s1", 0.82, 235.0, 403.0, 46.9, "solid", ""),
    Element("Sr", "Strontium", 38, 5, 2, "s", "alkaline earth metal", 87.62, "[Kr] 5s2", 0.95, 200.0, 549.5, 5.03, "solid", ""),
    Element("Y", "Yttrium", 39, 5, 3, "d", "transition metal", 88.905838, "[Kr] 4d1 5s2", 1.22, 180.0, 600.0, 29.6, "solid", ""),
    Element("Zr", "Zirconium", 40, 5, 4, "d", "transition metal", 91.224, "[Kr] 4d2 5s2", 1.33, 155.0, 640.1, 41.1, "solid", ""),
    Element("Nb", "Niobium", 41, 5, 5, "d", "transition metal", 92.90637, "[Kr] 4d4 5s1", 1.6, 145.0, 652.1, 86.1, "solid", "Configuration is 4d4 5s1, not the Aufbau 4d3 5s2."),
    Element("Mo", "Molybdenum", 42, 5, 6, "d", "transition metal", 95.95, "[Kr] 4d5 5s1", 2.16, 145.0, 684.3, 71.9, "solid", "Configuration is 4d5 5s1, not the Aufbau 4d4 5s2."),
    Element("Tc", "Technetium", 43, 5, 7, "d", "transition metal", 98.0, "[Kr] 4d5 5s2", 1.9, 135.0, 702.0, 53.0, "solid", "Mass number of technetium-98, the longest lived isotope; there is no standard atomic weight."),
    Element("Ru", "Ruthenium", 44, 5, 8, "d", "transition metal", 101.07, "[Kr] 4d7 5s1", 2.2, 130.0, 710.2, 101.3, "solid", "Configuration is 4d7 5s1, not the Aufbau 4d6 5s2."),
    Element("Rh", "Rhodium", 45, 5, 9, "d", "transition metal", 102.90549, "[Kr] 4d8 5s1", 2.28, 135.0, 719.7, 109.7, "solid", "Configuration is 4d8 5s1, not the Aufbau 4d7 5s2."),
    Element("Pd", "Palladium", 46, 5, 10, "d", "transition metal", 106.42, "[Kr] 4d10", 2.20, 140.0, 804.4, 53.7, "solid", "The only element whose ground state leaves the outermost s subshell empty."),
    Element("Ag", "Silver", 47, 5, 11, "d", "transition metal", 107.8682, "[Kr] 4d10 5s1", 1.93, 160.0, 731.0, 125.6, "solid", "Configuration is 4d10 5s1, not the Aufbau 4d9 5s2."),
    Element("Cd", "Cadmium", 48, 5, 12, "d", "transition metal", 112.414, "[Kr] 4d10 5s2", 1.69, 155.0, 867.8, None, "solid", "The cadmium anion is unbound."),
    Element("In", "Indium", 49, 5, 13, "p", "post-transition metal", 114.818, "[Kr] 4d10 5s2 5p1", 1.78, 155.0, 558.3, 28.9, "solid", ""),
    Element("Sn", "Tin", 50, 5, 14, "p", "post-transition metal", 118.710, "[Kr] 4d10 5s2 5p2", 1.96, 145.0, 708.6, 107.3, "solid", ""),
    Element("Sb", "Antimony", 51, 5, 15, "p", "metalloid", 121.760, "[Kr] 4d10 5s2 5p3", 2.05, 145.0, 830.6, 101.1, "solid", ""),
    Element("Te", "Tellurium", 52, 5, 16, "p", "metalloid", 127.60, "[Kr] 4d10 5s2 5p4", 2.1, 140.0, 869.3, 190.2, "solid", "Atomic mass exceeds iodine's although the atomic number is lower."),
    Element("I", "Iodine", 53, 5, 17, "p", "reactive nonmetal", 126.90447, "[Kr] 4d10 5s2 5p5", 2.66, 140.0, 1008.4, 295.2, "solid", ""),
    Element("Xe", "Xenon", 54, 5, 18, "p", "noble gas", 131.293, "[Kr] 4d10 5s2 5p6", 2.60, None, 1170.4, None, "gas", "A Pauling value exists because xenon fluorides do."),
    Element("Cs", "Caesium", 55, 6, 1, "s", "alkali metal", 132.90545196, "[Xe] 6s1", 0.79, 260.0, 375.7, 45.5, "solid", ""),
    Element("Ba", "Barium", 56, 6, 2, "s", "alkaline earth metal", 137.327, "[Xe] 6s2", 0.89, 215.0, 502.9, 13.95, "solid", ""),
    Element("La", "Lanthanum", 57, 6, None, "f", "lanthanide", 138.90547, "[Xe] 5d1 6s2", 1.10, 195.0, 538.1, None, "solid", "The ground state has no 4f electron despite the f block placement."),
    Element("Ce", "Cerium", 58, 6, None, "f", "lanthanide", 140.116, "[Xe] 4f1 5d1 6s2", 1.12, 185.0, 534.4, None, "solid", "The ground state retains one 5d electron alongside the first 4f electron."),
    Element("Pr", "Praseodymium", 59, 6, None, "f", "lanthanide", 140.90766, "[Xe] 4f3 6s2", 1.13, 185.0, 527.0, None, "solid", ""),
    Element("Nd", "Neodymium", 60, 6, None, "f", "lanthanide", 144.242, "[Xe] 4f4 6s2", 1.14, 185.0, 533.1, None, "solid", ""),
    Element("Pm", "Promethium", 61, 6, None, "f", "lanthanide", 145.0, "[Xe] 4f5 6s2", 1.13, 185.0, 540.0, None, "solid", "Mass number of promethium-145, the longest lived isotope."),
    Element("Sm", "Samarium", 62, 6, None, "f", "lanthanide", 150.36, "[Xe] 4f6 6s2", 1.17, 185.0, 544.5, None, "solid", ""),
    Element("Eu", "Europium", 63, 6, None, "f", "lanthanide", 151.964, "[Xe] 4f7 6s2", 1.2, 185.0, 547.1, None, "solid", ""),
    Element("Gd", "Gadolinium", 64, 6, None, "f", "lanthanide", 157.25, "[Xe] 4f7 5d1 6s2", 1.20, 180.0, 593.4, None, "solid", "The half filled 4f shell is kept, so the next electron goes to 5d."),
    Element("Tb", "Terbium", 65, 6, None, "f", "lanthanide", 158.925354, "[Xe] 4f9 6s2", 1.2, 175.0, 565.8, None, "solid", ""),
    Element("Dy", "Dysprosium", 66, 6, None, "f", "lanthanide", 162.500, "[Xe] 4f10 6s2", 1.22, 175.0, 573.0, None, "solid", ""),
    Element("Ho", "Holmium", 67, 6, None, "f", "lanthanide", 164.930329, "[Xe] 4f11 6s2", 1.23, 175.0, 581.0, None, "solid", ""),
    Element("Er", "Erbium", 68, 6, None, "f", "lanthanide", 167.259, "[Xe] 4f12 6s2", 1.24, 175.0, 589.3, None, "solid", ""),
    Element("Tm", "Thulium", 69, 6, None, "f", "lanthanide", 168.934219, "[Xe] 4f13 6s2", 1.25, 175.0, 596.7, None, "solid", ""),
    Element("Yb", "Ytterbium", 70, 6, None, "f", "lanthanide", 173.045, "[Xe] 4f14 6s2", 1.1, 175.0, 603.4, None, "solid", ""),
    Element("Lu", "Lutetium", 71, 6, None, "f", "lanthanide", 174.9668, "[Xe] 4f14 5d1 6s2", 1.27, 175.0, 523.5, None, "solid", ""),
    Element("Hf", "Hafnium", 72, 6, 4, "d", "transition metal", 178.486, "[Xe] 4f14 5d2 6s2", 1.3, 155.0, 658.5, 17.2, "solid", ""),
    Element("Ta", "Tantalum", 73, 6, 5, "d", "transition metal", 180.94788, "[Xe] 4f14 5d3 6s2", 1.5, 145.0, 761.0, 31.0, "solid", ""),
    Element("W", "Tungsten", 74, 6, 6, "d", "transition metal", 183.84, "[Xe] 4f14 5d4 6s2", 2.36, 135.0, 770.0, 78.6, "solid", ""),
    Element("Re", "Rhenium", 75, 6, 7, "d", "transition metal", 186.207, "[Xe] 4f14 5d5 6s2", 1.9, 135.0, 760.0, 14.5, "solid", ""),
    Element("Os", "Osmium", 76, 6, 8, "d", "transition metal", 190.23, "[Xe] 4f14 5d6 6s2", 2.2, 130.0, 840.0, 106.1, "solid", ""),
    Element("Ir", "Iridium", 77, 6, 9, "d", "transition metal", 192.217, "[Xe] 4f14 5d7 6s2", 2.20, 135.0, 880.0, 151.0, "solid", ""),
    Element("Pt", "Platinum", 78, 6, 10, "d", "transition metal", 195.084, "[Xe] 4f14 5d9 6s1", 2.28, 135.0, 864.4, 205.3, "solid", "Configuration is 5d9 6s1, not the Aufbau 5d8 6s2."),
    Element("Au", "Gold", 79, 6, 11, "d", "transition metal", 196.966570, "[Xe] 4f14 5d10 6s1", 2.54, 135.0, 890.1, 222.8, "solid", "Configuration is 5d10 6s1, not the Aufbau 5d9 6s2."),
    Element("Hg", "Mercury", 80, 6, 12, "d", "transition metal", 200.592, "[Xe] 4f14 5d10 6s2", 2.00, 150.0, 1007.1, None, "liquid", "The mercury anion is unbound."),
    Element("Tl", "Thallium", 81, 6, 13, "p", "post-transition metal", 204.38, "[Xe] 4f14 5d10 6s2 6p1", 1.62, 190.0, 589.4, 19.2, "solid", ""),
    Element("Pb", "Lead", 82, 6, 14, "p", "post-transition metal", 207.2, "[Xe] 4f14 5d10 6s2 6p2", 2.33, 180.0, 715.6, 35.1, "solid", "IUPAC 2021 made lead an interval; the conventional value is used."),
    Element("Bi", "Bismuth", 83, 6, 15, "p", "post-transition metal", 208.98040, "[Xe] 4f14 5d10 6s2 6p3", 2.02, 160.0, 703.0, 91.2, "solid", ""),
    Element("Po", "Polonium", 84, 6, 16, "p", "metalloid", 209.0, "[Xe] 4f14 5d10 6s2 6p4", 2.0, 190.0, 812.1, None, "solid", "Mass number of polonium-209, the longest lived isotope."),
    Element("At", "Astatine", 85, 6, 17, "p", "metalloid", 210.0, "[Xe] 4f14 5d10 6s2 6p5", None, None, 899.0, None, "unknown", "Only the first ionization energy is measured; astatine has never been isolated in a weighable amount."),
    Element("Rn", "Radon", 86, 6, 18, "p", "noble gas", 222.0, "[Xe] 4f14 5d10 6s2 6p6", None, None, 1037.1, None, "gas", "Mass number of radon-222, the longest lived isotope; quoted electronegativities for radon are estimates."),
    Element("Fr", "Francium", 87, 7, 1, "s", "alkali metal", 223.0, "[Rn] 7s1", None, None, 393.0, None, "unknown", "Only the first ionization energy is measured; francium has never been isolated in a weighable amount."),
    Element("Ra", "Radium", 88, 7, 2, "s", "alkaline earth metal", 226.0, "[Rn] 7s2", 0.9, 215.0, 509.3, None, "solid", "Mass number of radium-226, the longest lived isotope."),
    Element("Ac", "Actinium", 89, 7, None, "f", "actinide", 227.0, "[Rn] 6d1 7s2", 1.1, 195.0, 499.0, None, "solid", "The ground state has no 5f electron despite the f block placement."),
    Element("Th", "Thorium", 90, 7, None, "f", "actinide", 232.0377, "[Rn] 6d2 7s2", 1.3, 180.0, 608.5, None, "solid", "The ground state has no 5f electron."),
    Element("Pa", "Protactinium", 91, 7, None, "f", "actinide", 231.03588, "[Rn] 5f2 6d1 7s2", 1.5, 180.0, 568.0, None, "solid", "The ground state retains one 6d electron."),
    Element("U", "Uranium", 92, 7, None, "f", "actinide", 238.02891, "[Rn] 5f3 6d1 7s2", 1.38, 175.0, 597.6, None, "solid", "The ground state retains one 6d electron."),
    Element("Np", "Neptunium", 93, 7, None, "f", "actinide", 237.0, "[Rn] 5f4 6d1 7s2", 1.36, 175.0, 604.5, None, "solid", "The last actinide to retain a 6d electron before plutonium."),
    Element("Pu", "Plutonium", 94, 7, None, "f", "actinide", 244.0, "[Rn] 5f6 7s2", 1.28, 175.0, 584.7, None, "solid", "Mass number of plutonium-244, the longest lived isotope."),
    Element("Am", "Americium", 95, 7, None, "f", "actinide", 243.0, "[Rn] 5f7 7s2", 1.3, 175.0, 578.0, None, "solid", ""),
    Element("Cm", "Curium", 96, 7, None, "f", "actinide", 247.0, "[Rn] 5f7 6d1 7s2", 1.3, None, 581.0, None, "solid", "The half filled 5f shell is kept, so the next electron goes to 6d."),
    Element("Bk", "Berkelium", 97, 7, None, "f", "actinide", 247.0, "[Rn] 5f9 7s2", 1.3, None, 601.0, None, "solid", "Slater published no radius beyond americium."),
    Element("Cf", "Californium", 98, 7, None, "f", "actinide", 251.0, "[Rn] 5f10 7s2", 1.3, None, 608.0, None, "solid", ""),
    Element("Es", "Einsteinium", 99, 7, None, "f", "actinide", 252.0, "[Rn] 5f11 7s2", 1.3, None, 619.0, None, "solid", "The heaviest element so far produced in a quantity large enough to see."),
    Element("Fm", "Fermium", 100, 7, None, "f", "actinide", 257.0, "[Rn] 5f12 7s2", None, None, None, None, "unknown", "Studied only at the tracer scale, so no bulk property here is measured."),
    Element("Md", "Mendelevium", 101, 7, None, "f", "actinide", 258.0, "[Rn] 5f13 7s2", None, None, None, None, "unknown", ""),
    Element("No", "Nobelium", 102, 7, None, "f", "actinide", 259.0, "[Rn] 5f14 7s2", None, None, None, None, "unknown", "A first ionization energy has since been measured but is not in the sources cited here."),
    Element("Lr", "Lawrencium", 103, 7, None, "f", "actinide", 266.0, "[Rn] 5f14 7s2 7p1", None, None, None, None, "unknown", "The 7p1 ground state is predicted rather than observed; a measured ionization energy supports it."),
    Element("Rf", "Rutherfordium", 104, 7, 4, "d", "transition metal", 267.0, "[Rn] 5f14 6d2 7s2", None, None, None, None, "unknown", "Configuration is a relativistic prediction; group 4 chemistry has been confirmed at the atom at a time scale."),
    Element("Db", "Dubnium", 105, 7, 5, "d", "transition metal", 268.0, "[Rn] 5f14 6d3 7s2", None, None, None, None, "unknown", "Configuration is a relativistic prediction; group 5 chemistry has been confirmed."),
    Element("Sg", "Seaborgium", 106, 7, 6, "d", "transition metal", 269.0, "[Rn] 5f14 6d4 7s2", None, None, None, None, "unknown", "Configuration is a relativistic prediction; group 6 chemistry has been confirmed."),
    Element("Bh", "Bohrium", 107, 7, 7, "d", "transition metal", 270.0, "[Rn] 5f14 6d5 7s2", None, None, None, None, "unknown", "Configuration is a relativistic prediction; group 7 chemistry has been confirmed."),
    Element("Hs", "Hassium", 108, 7, 8, "d", "transition metal", 269.0, "[Rn] 5f14 6d6 7s2", None, None, None, None, "unknown", "Configuration is a relativistic prediction; group 8 chemistry has been confirmed."),
    Element("Mt", "Meitnerium", 109, 7, 9, "d", "unknown", 278.0, "[Rn] 5f14 6d7 7s2", None, None, None, None, "unknown", "No chemistry has been studied, and the configuration is a prediction."),
    Element("Ds", "Darmstadtium", 110, 7, 10, "d", "unknown", 281.0, "[Rn] 5f14 6d8 7s2", None, None, None, None, "unknown", "No chemistry has been studied; the predicted configuration is itself contested."),
    Element("Rg", "Roentgenium", 111, 7, 11, "d", "unknown", 282.0, "[Rn] 5f14 6d9 7s2", None, None, None, None, "unknown", "No chemistry has been studied; the predicted configuration is itself contested."),
    Element("Cn", "Copernicium", 112, 7, 12, "d", "unknown", 285.0, "[Rn] 5f14 6d10 7s2", None, None, None, None, "unknown", "Whether copernicium behaves as a metal or as a volatile closed shell species is unresolved."),
    Element("Nh", "Nihonium", 113, 7, 13, "p", "unknown", 286.0, "[Rn] 5f14 6d10 7s2 7p1", None, None, None, None, "unknown", "Configuration is a prediction and no chemistry has been established."),
    Element("Fl", "Flerovium", 114, 7, 14, "p", "unknown", 289.0, "[Rn] 5f14 6d10 7s2 7p2", None, None, None, None, "unknown", "Adsorption experiments disagree on whether flerovium is metallic or noble gas like."),
    Element("Mc", "Moscovium", 115, 7, 15, "p", "unknown", 290.0, "[Rn] 5f14 6d10 7s2 7p3", None, None, None, None, "unknown", "Configuration is a prediction and no chemistry has been established."),
    Element("Lv", "Livermorium", 116, 7, 16, "p", "unknown", 293.0, "[Rn] 5f14 6d10 7s2 7p4", None, None, None, None, "unknown", "Configuration is a prediction and no chemistry has been established."),
    Element("Ts", "Tennessine", 117, 7, 17, "p", "unknown", 294.0, "[Rn] 5f14 6d10 7s2 7p5", None, None, None, None, "unknown", "Configuration is a prediction and no chemistry has been established."),
    Element("Og", "Oganesson", 118, 7, 18, "p", "unknown", 294.0, "[Rn] 5f14 6d10 7s2 7p6", None, None, None, None, "unknown", "Predicted to be neither a gas nor chemically inert, but nothing about it is measured."),
]

BY_SYMBOL: dict[str, Element] = {element.symbol: element for element in ELEMENTS}
BY_NUMBER: dict[int, Element] = {element.number: element for element in ELEMENTS}

# The trend layers may only be drawn from properties that carry a real number
# on a real scale. Anything outside this tuple is a caller mistake, not an
# empty data set, and the helpers below say so rather than returning nothing.
NUMERIC_FIELDS: tuple[str, ...] = (
    "atomic_mass",
    "electronegativity",
    "atomic_radius_pm",
    "ionization_energy_kJmol",
    "electron_affinity_kJmol",
)

CATEGORIES: tuple[str, ...] = (
    "alkali metal",
    "alkaline earth metal",
    "transition metal",
    "post-transition metal",
    "metalloid",
    "reactive nonmetal",
    "noble gas",
    "lanthanide",
    "actinide",
    "unknown",
)


def _require_numeric_field(field: str) -> None:
    if field not in NUMERIC_FIELDS:
        known = ", ".join(NUMERIC_FIELDS)
        raise ValueError(
            f"{field!r} is not a numeric element property. Expected one of: {known}."
        )


def trend_values(field: str) -> dict[int, float]:
    """Atomic number to value for one property, skipping elements where it is None."""
    _require_numeric_field(field)
    return {
        element.number: getattr(element, field)
        for element in ELEMENTS
        if getattr(element, field) is not None
    }


def trend_range(field: str) -> tuple[float, float] | None:
    """Observed min and max of a property, for a legend. None when nothing is measured."""
    values = list(trend_values(field).values())
    if not values:
        return None
    return (min(values), max(values))


def coverage(field: str) -> dict:
    """How many elements actually carry this property. The UI shows this so a
    sparse trend layer cannot masquerade as a complete one."""
    measured = trend_values(field)
    missing = tuple(e.number for e in ELEMENTS if e.number not in measured)
    total = len(ELEMENTS)
    return {
        "field": field,
        "measured": len(measured),
        "missing": len(missing),
        "total": total,
        "fraction": len(measured) / total,
        "missing_numbers": missing,
        "review": REVIEW,
    }


__all__ = [
    "REVIEW",
    "Element",
    "ELEMENTS",
    "BY_SYMBOL",
    "BY_NUMBER",
    "NUMERIC_FIELDS",
    "CATEGORIES",
    "trend_values",
    "trend_range",
    "coverage",
]

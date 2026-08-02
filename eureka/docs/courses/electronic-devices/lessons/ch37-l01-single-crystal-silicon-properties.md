# Single-Crystal Silicon: Electrical and Optical Properties

<!-- covers: 37.1, 37.2, 37.3 -->

Module 29 grew the crystal. This module is about what that crystal does, and it
is worth treating carefully because silicon's numbers are the reference against
which every other semiconductor in this course is judged.

## Silicon fundamentals: bands, carriers and doping

**Structure.** Silicon crystallizes in the diamond cubic structure, with each
atom covalently bonded to four neighbours at the tetrahedral angle. The lattice
constant is 0.5431 nm at room temperature. The three low-index planes behave
differently in ways that matter: (100) has the lowest interface trap density
after oxidation and is the standard orientation for MOS logic; (111) has the
highest atom density and was the early standard; (110) has the highest hole
mobility and appears in some advanced device geometries.

**Band structure.** The bandgap is 1.12 eV at 300 K and it *narrows* as
temperature rises, by roughly 0.27 meV per kelvin near room temperature, because
lattice expansion and electron-phonon interaction both push the bands together.
That temperature dependence propagates into every device parameter: the built-in
potential of a junction falls with temperature, which is why a forward-biased
diode drop decreases by about 2 mV per degree, which is in turn the basis of
every bandgap voltage reference and every on-chip temperature sensor.

The gap is **indirect**, with the conduction band minimum along the <100>
directions rather than at the zone centre. The consequences were introduced in
module 17: weak optical absorption near the gap edge, and negligible radiative
recombination, so silicon detects light adequately and emits it hardly at all.

**Effective masses** are anisotropic. The conduction band minima are ellipsoidal
with a longitudinal mass of about 0.92 and a transverse mass of about 0.19 free
electron masses, and there are six equivalent valleys. The valence band has
heavy and light hole branches plus a split-off band. The anisotropy is why
silicon's mobility depends on crystallographic direction and why strain, which
breaks the equivalence of the valleys, changes mobility so effectively (module
38).

**Intrinsic carrier concentration** is about 10^10 per cubic centimetre at 300
K, and it roughly doubles for every 8 to 10 degrees of warming, because it
depends exponentially on the gap over kT. This single number sets the leakage
floor of every silicon device and explains why silicon stops working usefully
somewhere above 200 degrees C: the intrinsic carriers eventually swamp the
doping, junctions stop rectifying, and the device loses its identity. Wide-gap
materials operate hotter for exactly this reason.

**Doping.** Group V elements (phosphorus, arsenic, antimony) substitute for
silicon and donate an electron; group III elements (boron, indium, gallium)
accept one. Their ionization energies are 45 meV for phosphorus, 54 for arsenic,
45 for boron, comfortably below room-temperature thermal energy, so they are
essentially fully ionized at operating temperature. Practical doping spans
10^13 to 10^21 per cubic centimetre, eight orders of magnitude, which is the
range that makes device design possible.

At the high end two things break the simple picture. **Solid solubility** limits
how much dopant can be held in the lattice, and the excess forms inactive
clusters (module 22). And **bandgap narrowing** sets in above roughly 10^18 per
cubic centimetre, as the dopant states merge into a band and the gap effectively
shrinks by tens of millivolts. That narrowing raises the minority carrier
population in a heavily doped emitter and is a first-order effect in bipolar
transistor design, not a correction.

## Electrical properties of silicon

**Mobility.** At 300 K in lightly doped material, electron mobility is about
1400 cm^2/(V s) and hole mobility about 450. The three-to-one ratio propagates
directly into circuit design: an n-channel transistor carries more current than
a p-channel one of the same size, so CMOS logic gates are drawn with wider
p-channel devices to balance rise and fall times.

Mobility falls with doping, because ionized impurity scattering takes over
(module 18), reaching a few hundred at 10^18 and around 100 at 10^20. It also
falls with temperature above about 100 K, as phonon scattering dominates,
approximately as T^-2.4 for electrons. And in a MOS inversion layer it falls
again, to roughly half the bulk value, because carriers are pressed against the
interface and suffer surface roughness and remote Coulomb scattering. That
inversion-layer mobility, not the bulk value, is what a transistor actually
delivers.

**Resistivity** follows from mobility and carrier concentration, and the
resistivity-versus-doping relationship for silicon is standardized well enough
that a four-point probe measurement is routinely converted to a doping level.
Typical values: 10 ohm-cm for lightly doped substrate material, milliohm-cm for
heavily doped contact layers, and kiloohm-cm for high-resistivity float-zone
material used in detectors.

**Velocity saturation** at about 10^5 m/s (module 18), reached at fields around
10^4 V/cm, which every modern short-channel device operates well beyond.

**Breakdown field** of about 3 x 10^5 V/cm, which sets the voltage a given
doping and thickness can block and is the number that wide-bandgap materials beat
by an order of magnitude.

**Minority carrier lifetime** is the property with the widest spread, from
nanoseconds in heavily contaminated or heavily doped material to milliseconds in
the best float-zone silicon. It is set by recombination through deep levels, so
it is exquisitely sensitive to transition metal contamination at concentrations
far below anything that affects doping (module 22). Lifetime determines
diffusion length, which determines solar cell collection and bipolar gain, and
it is the property most easily destroyed by careless processing. Devices are
therefore divided into those that need long lifetime, such as solar cells,
detectors and bipolar power devices, and those that do not, such as MOS logic,
and the process flows differ accordingly.

**Thermal conductivity** of about 150 W/(m K) at 300 K, high for a
semiconductor, which is a significant part of why silicon power devices can
dissipate what they do. It falls with temperature and with doping and, as module
35 noted, falls substantially in thin films.

**Piezoresistance.** Silicon's resistivity changes markedly under strain,
because strain shifts the conduction band valleys and redistributes carriers
among them. The effect is large and orientation-dependent, and it is the basis
of the silicon pressure sensors and accelerometers covered in the earlier
sensors module. The same physics, applied deliberately, is strain engineering
in transistors.

## Optical properties of silicon

**Absorption.** The indirect gap makes absorption weak near the edge and strong
in the ultraviolet where direct transitions become available. The practical
numbers: absorption depth is about 1 mm at 1100 nm near the band edge, roughly
10 micrometres at 800 nm, about 1 micrometre at 600 nm, and tens of nanometres
in the ultraviolet.

Those numbers explain a great deal. A silicon solar cell needs to be at least
tens of micrometres thick, with light trapping by surface texturing and a rear
reflector, to absorb the red end of the spectrum. A silicon image sensor
collects blue light in its first hundred nanometres and red light micrometres
down, which is why deep-pixel crosstalk is a red-light problem. And silicon is
transparent beyond about 1100 nm, which makes it a usable infrared window
material and allows inspection of a finished wafer through its back side.

**Refractive index** is about 3.5 in the near infrared, rising sharply in the
visible and peaking above 6 near the direct transitions in the ultraviolet. The
high index means over 30 percent reflection from a bare polished surface at
normal incidence, which is why antireflection coatings are mandatory on cells
and sensors, and it also means strong optical confinement in silicon
waveguides.

**Free carrier absorption** grows with doping and with wavelength (module 19), so
heavily doped silicon is not transparent in the infrared and its refractive index
is reduced. This is exploited for modulation: injecting carriers into a silicon
waveguide changes its index enough to build an interferometric modulator, which
is the basis of silicon photonic modulators.

**Photoluminescence** is very weak because of the indirect gap, which makes PL a
difficult characterization route for silicon (module 19) and pushes silicon
lifetime measurement toward the microwave photoconductance and surface
photovoltage methods of module 23. Efforts to make silicon emit, through porous
silicon, nanocrystals, erbium doping and strained germanium on silicon, have
produced interesting physics and no product that displaced compound
semiconductor emitters.

The summary worth carrying: silicon is a mediocre semiconductor by almost every
individual metric and an outstanding one as a system, because its properties are
adequate, extremely well characterized, and paired with an oxide and a
manufacturing base that nothing else has. Every subsequent module in this course
that introduces a better material should be read with the question of what it
gives up to get there.

# Conductive Organic Compounds, Materials and Plastic Electronics

<!-- covers: 52.1, 52.2, 52.3 -->

## Electrically conductive organic compounds

Organic materials are the archetypal insulators, and the discovery that some of
them conduct, and can be made to conduct nearly as well as a metal, opened a
field. The physics is worth getting right because it explains both the promise
and the limits.

**Conjugation is the requirement.** In a chain of carbon atoms with alternating
single and double bonds, each carbon uses three of its four valence electrons for
in-plane sigma bonds and contributes the fourth to a p orbital perpendicular to
the chain. Those p orbitals overlap along the chain, forming delocalized **pi
orbitals** through which charge can move. A saturated polymer such as
polyethylene has no such system and is a good insulator; a conjugated polymer
such as polyacetylene or polythiophene has one and is a semiconductor.

**The gap comes from bond alternation.** A chain with perfectly equal bond
lengths would be a one-dimensional metal, and such a system is unstable: it
lowers its energy by dimerizing into alternating short and long bonds, which
opens a gap at the Fermi level. This Peierls distortion is why conjugated
polymers are semiconductors rather than metals, with gaps typically 1.5 to 3 eV,
which conveniently places their absorption and emission in the visible.

**Doping is chemical, not substitutional.** Doping an inorganic semiconductor
replaces a lattice atom. Doping an organic semiconductor **oxidizes or reduces**
the chain: an oxidant removes an electron from the pi system, leaving a positive
charge that distorts the local geometry around it. The charge plus its
accompanying lattice distortion is a **polaron**, and at higher doping levels
pairs form **bipolarons**. Doping levels are enormous by inorganic standards,
tens of percent rather than parts per million, and conductivity can rise by more
than ten orders of magnitude, reaching metallic values in the best cases.

**Transport is hopping.** Charge moves easily along a conjugated chain and with
difficulty between chains, and real films are disordered arrangements of finite
chain segments. Transport is therefore dominated by hopping between localized
states (module 25), with all the consequences established there: mobility rises
with temperature rather than falling, rises with carrier density as deeper states
fill, and depends on electric field. Mobilities span an enormous range, from
10^-6 cm^2/(V s) in poorly ordered polymers to above 10 cm^2/(V s) in the best
ordered small-molecule crystals, and are typically 0.1 to 1 in materials used in
practical devices.

**The excitonic character** distinguishes organics sharply from inorganic
semiconductors and has to be understood to make sense of organic devices.
Because organic materials have low dielectric constants, around 3 to 4 against
silicon's 11.7, the Coulomb attraction between an electron and a hole is poorly
screened. Absorbing a photon therefore produces a **tightly bound exciton**, with
binding energy of 0.3 to 1 eV, rather than a free electron-hole pair. That
exciton will not dissociate thermally; it must reach an interface with a material
of suitable energy offset to be split. This single fact dictates the entire
architecture of organic photovoltaics: an exciton diffuses only about 10 nm
before recombining, so donor and acceptor phases must interpenetrate on that
length scale, which is why the bulk heterojunction exists.

## Material families

**Conjugated polymers.** Polyacetylene was the original demonstration and is
unstable in air. The practical families are polythiophenes, of which
poly(3-hexylthiophene) is the long-standing reference material for organic
transistors and solar cells; polyfluorenes and poly(phenylene vinylene)s, used as
emitters; and a large number of designed **donor-acceptor copolymers** in which
electron-rich and electron-poor units alternate along the chain, allowing the
gap and the energy levels to be tuned by molecular design. That tunability is the
field's central advantage over inorganics: energy levels are set by chemistry
rather than by a fixed material.

**PEDOT:PSS** deserves individual mention because it is the most widely used
conductive polymer in practice. It is a dispersion of a doped polythiophene with
a polyanion, water-processable, transparent, reasonably conductive, and stable
enough for production. It is the hole injection layer in most organic
light-emitting devices, an antistatic coating, and a flexible transparent
electrode.

**Small molecules.** Pentacene and its derivatives, rubrene, oligothiophenes,
phthalocyanines and fullerenes (module 48). Small molecules are thermally
evaporable rather than solution-processed, which gives cleaner films and better
order, and single crystals of rubrene show the highest organic mobilities
measured. The trade is that evaporation does not scale to large area as cheaply
as printing.

**Charge-transfer salts.** Crystals in which a donor molecule and an acceptor
molecule stack alternately with partial charge transfer between them. Some are
genuine organic metals, and a number are organic superconductors at low
temperature. Their interest is scientific rather than applied.

**Organometallic emitters**, particularly iridium and platinum complexes, which
matter enormously for displays: heavy-metal spin-orbit coupling allows the
normally forbidden triplet states to emit, and since electrical excitation
produces triplets three times as often as singlets, harvesting them raises the
internal quantum efficiency ceiling from 25 percent to 100 percent. Every
efficient OLED display depends on this.

## Plastic electronics

The proposition of plastic electronics is not that organic semiconductors
outperform silicon. They do not, by three or more orders of magnitude in
mobility. The proposition is that they are **processable in ways silicon is not**:
from solution, at room temperature, by printing, over large flexible areas, on
cheap substrates.

**Organic light-emitting diodes** are the commercial success, and they are worth
separating from the rest of the field because their economics are different. An
OLED is a stack of thin organic layers between electrodes: injection layers,
transport layers, and an emissive layer where electrons and holes recombine.
Their advantages over liquid crystal displays are direct emission with no
backlight, true black, wide viewing angle, fast response, thinness and the
ability to be made flexible. They now dominate phone displays and are
established in televisions.

Their materials problems are specific and mostly solved except one: **blue
emitter lifetime**. Blue photons carry the most energy, so the excited states
that produce them are the most likely to break bonds, and blue emitters degrade
faster than red and green. The engineering responses are to use a longer-lived
fluorescent blue at lower efficiency, to over-drive the blue subpixel area, and
to develop thermally activated delayed fluorescence and hyperfluorescence
emitters that harvest triplets without a heavy metal. Blue lifetime remains the
binding constraint, and it should be described as an unsolved problem rather than
a solved one.

**Organic thin-film transistors.** Mobility of 0.1 to 10 cm^2/(V s), which is
adequate for switching but not for high-speed logic. Realistic applications are
displays on flexible substrates, electronic paper backplanes, RFID tags,
disposable sensors and large-area sensor arrays. The persistent problems are
contact resistance, which dominates short-channel devices and inflates or
deflates reported mobilities depending on how it is handled; bias stress
instability similar to that in amorphous silicon (module 46); and encapsulation,
since most organic semiconductors degrade on exposure to oxygen and water.

A methodological point worth stating because it has been a real problem in this
literature: **reported organic transistor mobilities have often been
overestimated**, by extracting mobility from non-ideal transfer characteristics
where the standard equations do not apply. The community response has been to
require reporting of the full characteristics and of a reliability factor that
compares the claimed mobility against what the device actually delivers. When
reading a mobility claim, look for the transfer curve and the channel-length
dependence.

**Organic photovoltaics.** Efficiencies have risen substantially with
non-fullerene acceptors, into the high teens for single junctions in the
laboratory. The attractions are light weight, flexibility, semitransparency,
tunable colour, and potentially very low cost by roll-to-roll printing. The
obstacles are stability, since organic materials photo-degrade and blend
morphology coarsens over time, and the fact that silicon photovoltaics got very
cheap while this was being developed. The credible niches are applications
silicon cannot serve: building-integrated semitransparent panels, indoor
light harvesting for sensors, and lightweight portable power.

**Printed and disposable electronics.** Antennas, sensors, simple logic and
displays printed at low cost on packaging and labels. This is where the
processing advantage is decisive and the performance requirement is genuinely low.

The framing to carry into the next lesson: organic electronics succeeds where
processability, area, flexibility or chemical tunability is the requirement, and
fails wherever raw device performance is. That is a coherent and defensible
position, and it is a very different claim from the one made for these materials
when the field began.

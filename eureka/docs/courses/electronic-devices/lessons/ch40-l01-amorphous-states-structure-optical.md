# Amorphous Semiconductors: Electronic States, Structure and Optical Properties

<!-- covers: 40.1, 40.2, 40.3 -->

## Electronic states in an amorphous network

Module 25 established the general transport picture for disordered materials.
This module is about the amorphous semiconductors themselves: what they are,
how their structure is described, and what their properties actually are.

The first surprise about an amorphous semiconductor is that it has a bandgap at
all. Periodicity was the ingredient that produced bands in the standard
treatment, and an amorphous solid has none. The resolution is that **bands come
from short-range order, not long-range order**. An electron's energy is set
mainly by the number and type of its immediate neighbours and the bond lengths
and angles to them. In amorphous silicon, essentially every atom still has four
neighbours at close to the tetrahedral angle, so the bonding-antibonding
splitting that produces the gap survives. What is lost is the sharpness.

The resulting electronic structure has four regions, and the vocabulary is worth
being precise about:

**Extended states** deep in the valence and conduction bands, where the density
of states is high and wavefunctions spread through the material.

**Band tails**, exponentially decaying densities of states reaching into the gap
from each band edge, arising from bond-length and bond-angle deviations.
Wavefunctions here are localized. The characteristic decay energy, the **Urbach
energy**, measures the disorder: about 45 to 55 meV for the valence tail of
device-grade hydrogenated amorphous silicon, and steeper for the conduction
tail, which is why holes are so much less mobile than electrons in this
material.

**Deep defect states** near midgap, arising from **coordination defects** rather
than from distortion. In amorphous silicon these are dangling bonds: silicon
atoms with only three neighbours. They are amphoteric, capable of holding zero,
one or two electrons, so they act as both donors and acceptors and they pin the
Fermi level near midgap. Their density in unhydrogenated amorphous silicon is
around 10^19 to 10^20 per cubic centimetre, and hydrogenation reduces it to
about 10^15 to 10^16, which is the difference between an unusable material and a
usable one.

**The mobility edges**, at the energies separating localized tail states from
extended states. The energy interval between the two mobility edges is the
**mobility gap**, and it is not the same as the optical gap, typically exceeding
it by 0.1 to 0.2 eV. Conflating the two is a common source of confusion in this
literature.

The reason unhydrogenated amorphous silicon cannot be doped follows directly:
add a donor and its electron falls into the enormous dangling-bond population
rather than into the conduction band. The Fermi level does not move. Doping only
works once the defect density is far below the dopant density.

A second, subtler point about doping in an amorphous network is the **8-N rule**:
an atom in a network with no rigid lattice will adopt the coordination that
satisfies its bonding, so a phosphorus atom prefers three neighbours, which is
electrically inactive, rather than the four that would make it a donor. Only a
small fraction of phosphorus atoms end up fourfold coordinated and therefore
active, and each one that does creates a compensating dangling bond elsewhere.
Doping efficiency in amorphous silicon is therefore poor, of order a percent,
and doping simultaneously increases the defect density. That is why amorphous
silicon devices use doped layers only for contacts and keep the active region
intrinsic.

## Structure of the amorphous network

Describing an amorphous structure requires different language from
crystallography, because there is no unit cell.

The standard model is the **continuous random network**: every atom satisfies
its bonding requirements with the correct number of neighbours at close to the
ideal bond length, while bond angles are distorted by a few degrees and the
dihedral angles are random. The result has well-defined short-range order,
partial medium-range order, and no long-range order.

The experimental description is the **radial distribution function**, obtained
by Fourier transforming a diffraction pattern. It gives the average number of
atoms at each distance from a reference atom. In amorphous silicon the first
peak is sharp and centred at the crystalline bond length with a coordination
number close to 4, confirming that short-range order is intact. The second peak,
set by the bond angle, is broadened, quantifying the angular disorder. The third
peak, which depends on dihedral angles, is largely washed out. Beyond that the
function is featureless. That sequence, sharp, broadened, absent, is the
structural signature of an amorphous solid.

Structural characterization uses:

- **X-ray or neutron diffraction** for the radial distribution function.
- **Raman spectroscopy** (module 19), where the crystalline silicon peak at
  about 520 wavenumbers is replaced by a broad band near 480, and the width of
  that band measures the bond angle spread. Mixed-phase films show both, and the
  ratio gives the crystalline fraction, which is the standard measurement for
  the microcrystalline materials of module 41.
- **Infrared spectroscopy** for hydrogen bonding configuration, distinguishing
  isolated Si-H bonds from clustered SiH2 groups. That distinction matters
  because clustered hydrogen correlates with poor stability.
- **Electron spin resonance**, which counts unpaired electrons and therefore
  directly measures the dangling bond density. This is the reference method
  against which the optical defect measurements of module 23 are calibrated.
- **Small-angle scattering and positron annihilation** for voids and open
  volume, which are present in most deposited amorphous films and correlate with
  poor material.

The chalcogenide glasses, based on selenium, tellurium, arsenic and germanium,
form a second major family with different structural rules. Their atoms are
two-fold or three-fold coordinated, so the network is chain-like or layered
rather than fully three-dimensional. That lower connectivity makes the network
flexible, which is why chalcogenides form glasses readily, and it is why they can
switch structure so easily, which is the basis of phase-change memory (module
47). Their defects are also different: rather than neutral dangling bonds, they
form **valence alternation pairs**, charged over- and under-coordinated sites
that occur in pairs and pin the Fermi level. That is why chalcogenides are
essentially undopable, and it is a structural difference with direct device
consequences.

## Optical properties and the Tauc gap

Amorphous semiconductors absorb light very differently from crystals, and in
ways that turn out to be practically valuable.

**Momentum conservation is relaxed.** With no crystal momentum to conserve,
every optical transition is allowed, so the distinction between direct and
indirect gaps disappears. Amorphous silicon absorbs like a direct-gap material
even though crystalline silicon does not: its absorption coefficient above the
gap is roughly an order of magnitude higher than crystalline silicon's in the
visible. This is the single reason thin-film silicon photovoltaics is possible.
A crystalline silicon cell needs a hundred or more micrometres of material; an
amorphous silicon cell absorbs the useful spectrum in about 300 nanometres.

**The optical gap must be defined by convention.** With exponential tails there
is no sharp edge, so the gap is extracted by extrapolation. The standard is the
**Tauc gap**: plot (alpha * h * nu)^(1/2) against photon energy and extrapolate
the linear region to zero. For hydrogenated amorphous silicon this gives about
1.7 to 1.8 eV, notably wider than crystalline silicon's 1.12 eV, and the width
increases with hydrogen content because Si-H bonds are stronger than Si-Si
bonds. That tunability is used deliberately: alloying with carbon widens the gap
further for the window layer of a solar cell, alloying with germanium narrows it
for the bottom cell of a tandem stack.

An alternative convention, the **E04 gap**, simply reports the energy at which
the absorption coefficient reaches 10^4 per centimetre. It requires no
extrapolation and no model, so it is more reproducible, and it gives a
different number. Comparing a Tauc gap from one paper with an E04 gap from
another is not a valid comparison, and this happens often.

**The Urbach tail** just below the gap, exponential in energy, whose slope is the
disorder measure introduced above. It is measured by the sensitive sub-gap
techniques of module 23, since it is far too weak for ordinary transmission.

**Deep sub-gap absorption** from the dangling bond states, weaker still, and
proportional to the defect density. Measuring it with the constant photocurrent
method and converting via a calibration constant is the routine defect-density
determination for thin films.

Reading an amorphous semiconductor's optical spectrum from high energy to low
therefore gives, in sequence: the interband absorption and the Tauc gap; the
Urbach tail and the structural disorder; and the deep sub-gap shoulder and the
defect density. Three different pieces of material quality information from one
measurement, which is why optical characterization is the first thing done to
any new amorphous film.

# Temperature-Insensitive Bandgap III-V Alloys

<!-- covers: 39.1, 39.2, 39.3 -->

Almost every semiconductor's bandgap shrinks as it warms, and the shrinkage is
substantial: roughly 0.3 to 0.5 meV per kelvin in the common III-V compounds.
For a laser diode that means the emission wavelength drifts by about 0.3 to 0.5
nanometres per degree, which is enough to walk a transmitter off its assigned
channel in a wavelength-division-multiplexed link over a normal temperature
range. The usual fix is a thermoelectric cooler holding the device at constant
temperature, which costs power, volume and reliability. A material whose gap
did not move would remove that requirement entirely, and this module covers two
alloy families designed to do exactly that.

**Why gaps shrink.** Two effects add. Thermal expansion increases the
interatomic spacing, which reduces the bonding-antibonding splitting and hence
the gap. Electron-phonon interaction renormalizes the band energies, and it is
usually the larger contributor. Both grow with temperature, and the empirical
Varshni expression fits the resulting curve across most semiconductors.

**The idea behind fixing it.** If a small amount of a chemically very different
element is added to a host, and that element introduces a localized level whose
energy is nearly temperature-independent, then interaction between the localized
level and the host's extended band states can pin the band edge. The composite
band edge moves much less with temperature than the host's would. This is the
band anticrossing picture, and it is the common thread through both families
below.

## Thallium-containing III-V alloys

Thallium is the group III element below indium. Adding it to indium phosphide or
gallium arsenide was predicted to produce alloys with unusual band behaviour,
including a bandgap whose temperature dependence is greatly reduced or, at
particular compositions, close to zero.

The mechanism proposed is that thallium's 6s level sits low relative to the host
conduction band and interacts strongly with it, and because that atomic level
barely moves with temperature while the host band does, the resulting hybrid
edge is pinned. A second attraction is that thallium's large size and heavy mass
should give strong spin-orbit coupling and a very rapid narrowing of the gap
with composition, which would let a small thallium fraction reach long infrared
wavelengths on a common substrate.

The practical status is best stated honestly. Thallium-containing III-V alloys
have been grown, mostly by molecular beam epitaxy, and reported. The recurring
problems are:

- **Very low equilibrium solubility of thallium** in the host lattices, so
  incorporation requires strongly non-equilibrium growth at low temperature, and
  the resulting films are metastable.
- **Phase separation and surface segregation**, with thallium tending to
  accumulate at the surface or form metallic inclusions rather than substituting
  cleanly.
- **Material quality** well below what device applications need, so the
  predicted properties have been difficult to verify convincingly.
- **Toxicity.** Thallium compounds are acutely toxic and readily absorbed, which
  raises real handling and disposal constraints for any manufacturing route.

The honest summary is that the physics is interesting and reasonably
well-motivated, and the material system has not produced a device-quality alloy.
Reported results should be read with the growth conditions and the structural
characterization in view, because a film that has phase-separated will show
optical behaviour that does not represent a homogeneous alloy.

## Bismuth-containing III-V alloys

Bismuth is the group V element below antimony, and the dilute bismide alloys,
principally gallium arsenide bismide, have progressed considerably further than
the thallium systems.

The mechanism here acts on the **valence** band. Bismuth is large and
electropositive relative to arsenic, and it introduces a localized state that
sits above the host valence band maximum and interacts with it. The result is a
valence band edge pushed upward, so the gap narrows very rapidly with bismuth
fraction, by roughly 60 to 90 meV per percent of bismuth, far more than
conventional alloying achieves. Because the effect is dominated by the localized
bismuth level rather than by the host band, the temperature dependence of the
gap is reduced.

Two further consequences follow from the same physics and are arguably more
valuable than the gap tuning:

**Large spin-orbit splitting.** Bismuth's heavy nucleus produces a very large
spin-orbit splitting in the valence band. Once that splitting exceeds the
bandgap, a particular Auger recombination process, in which the energy released
by an electron-hole recombination promotes a hole into the split-off band, becomes
energetically forbidden. Auger recombination is the dominant loss mechanism in
long-wavelength lasers and is a large part of why telecom lasers need cooling and
have poor temperature stability. Suppressing it is potentially a bigger prize
than pinning the gap.

**Reduced temperature sensitivity of threshold current.** Following from the
above, a bismide laser should have a higher characteristic temperature,
meaning its threshold current rises more slowly as it warms, which is precisely
the uncooled-operation property that motivates this whole line of work.

The growth challenges are real and specific:

- Bismuth has very low solubility in gallium arsenide and strongly tends to
  **surfactant-segregate** to the growth surface rather than incorporate.
- Incorporation requires **low growth temperature and precise group V flux
  control**, in a narrow window. Too hot and bismuth does not incorporate; too
  cold and point defect density rises.
- **Droplet formation** of metallic bismuth on the surface is a persistent
  failure mode.
- The resulting material has **high defect density and short carrier lifetime**
  compared with mature III-V alloys, which is the main barrier to device
  performance.

Progress has been substantial: bismuth fractions above 10 percent have been
achieved, room-temperature electrically pumped lasing has been demonstrated, and
the predicted large spin-orbit splitting has been measured. The material remains
below the quality needed for commercial devices, and the honest position is that
this is promising and unproven rather than ready.

## What a temperature-insensitive gap buys

It is worth being concrete about the value, because the effort only makes sense
against a real cost.

**Uncooled telecom and datacom lasers.** A directly modulated laser in a
datacentre link currently needs either a thermoelectric cooler or a wavelength
control loop. Removing that would cut power, cost, size and a failure mode from
every transceiver, and transceivers ship in enormous volumes. This is the
application that justifies the research.

**Stable references and sensors.** Any device whose output depends on the gap,
including photodetector cut-off wavelength and some voltage references, drifts
with temperature. A pinned gap would give stability without compensation.

**Wider operating range.** Automotive, aerospace and industrial environments
span temperature ranges that force derating of optical components. A
temperature-insensitive gap widens the usable envelope directly.

**Longer wavelengths on convenient substrates.** The rapid gap narrowing per
percent of bismuth or thallium means mid-infrared operation might be reachable
on gallium arsenide substrates, which are large, cheap and mature, instead of on
the small, expensive indium phosphide or antimonide substrates currently
required. Substrate economics, as module 28 argued, often decides which
technology is viable.

Two cautions to carry from this module. First, **the interesting property and
the manufacturable material are different achievements**, and a course or a paper
that reports the first without qualifying the second is misleading. Second, the
band anticrossing mechanism that makes these alloys interesting is the same
mechanism that makes them hard to grow: a constituent chemically different
enough to introduce a strongly interacting localized level is also different
enough to have low solubility and to want to segregate. That tension is
structural, not incidental, and it recurs across dilute alloy systems including
the dilute nitrides, which face the same trade for the same reason.

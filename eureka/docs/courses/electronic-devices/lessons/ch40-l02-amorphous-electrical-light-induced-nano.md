# Amorphous Semiconductors: Electrical Behaviour, Metastability and Nanostructure

<!-- covers: 40.4, 40.5, 40.6 -->

## Electrical properties and conduction paths

An amorphous semiconductor conducts by the mechanisms of module 25, and which
mechanism dominates depends on where the Fermi level sits and on the
temperature.

**Extended state conduction** when the Fermi level is close enough to a mobility
edge, giving activated conductivity whose activation energy is the distance from
the Fermi level to that edge. In device-grade intrinsic hydrogenated amorphous
silicon the Fermi level sits near midgap, so that distance is around 0.7 to 0.8
eV and the dark conductivity is around 10^-10 siemens per centimetre. Doping or
a gate field moves the Fermi level toward an edge and the conductivity rises
exponentially.

**Hopping conduction** through localized states when the Fermi level is deep in
the gap and the temperature is low, following the variable-range hopping laws of
module 25.

**Mobility values** worth carrying: extended-state electron mobility around 10
cm^2/(V s), extended-state hole mobility around 1, drift mobilities an order of
magnitude or more below those because of multiple trapping, and field-effect
mobility in a thin-film transistor typically 0.5 to 1 cm^2/(V s) for electrons.
Hole transport is roughly two orders of magnitude worse than electron transport,
because the valence band tail is much broader than the conduction band tail. That
asymmetry is why amorphous silicon thin-film transistors are n-channel only and
why complementary logic in this material is impractical, which in turn is why
display backplanes use a different circuit style from CMOS.

**Photoconductivity** is large, because the dark conductivity is so small. The
ratio of illuminated to dark conductivity under one sun exceeds 10^5 in good
material, and that ratio is the standard quick quality metric: it is easy to
measure and it collapses when the defect density rises. The
mobility-lifetime products that matter for solar cells are around 10^-7 cm^2/V
for electrons and roughly 10^-9 for holes, and the hole value is what limits
collection and therefore limits how thick the cell can be.

**Contacts** need care. Because the Fermi level is near midgap and the material
is highly resistive, ohmic contacts require heavily doped interlayers, usually
n-plus microcrystalline silicon for the electron contact. A measurement made
with unqualified contacts reports the contacts (module 24).

**Doping** works, poorly, for the reasons in the previous lesson: efficiency of
order a percent and defect generation as a side effect. Devices are therefore
built as p-i-n structures with an intrinsic absorber and thin doped contact
layers, rather than as p-n junctions. In an intrinsic layer with a field across
it, carriers are collected by drift rather than by diffusion, which suits a
material with short diffusion lengths.

## Light-induced metastability

The defining reliability problem of hydrogenated amorphous silicon is that
**light degrades it**. Illuminate a film and its defect density rises by roughly
an order of magnitude over hundreds of hours, its photoconductivity falls, and
solar cell efficiency drops by 10 to 30 percent before stabilizing. Annealing
above about 150 degrees C restores the original state completely. This is the
**Staebler-Wronski effect**, and it is reversible, which is what makes it a
metastability rather than damage.

The mechanism is not fully settled, which is worth saying plainly given how long
it has been studied. The main elements of the accepted picture:

- Recombination of photogenerated carriers releases energy locally, of order the
  bandgap.
- That energy breaks a weak, strained Si-Si bond, creating two dangling bonds.
- Hydrogen mobility is involved in stabilizing the broken configuration, since
  the effect correlates with hydrogen content and bonding, and the annealing
  kinetics look like a hydrogen-mediated process.
- Material with more clustered hydrogen, more voids and more strained bonds
  degrades more, which links the effect to the structural quality measures of
  the previous lesson.

The engineering responses are instructive, because none of them eliminate the
effect:

- **Make the cell thin.** A thinner intrinsic layer has a higher internal field,
  so carriers are collected before the increased defect density can trap them.
  This costs absorption.
- **Stack cells in a tandem.** Two or three thin junctions in series each stay
  thin while together absorbing the spectrum, and alloying with germanium
  narrows the lower cell's gap to catch the red end.
- **Use microcrystalline silicon** for the bottom cell, since it does not show
  the effect appreciably (module 41).
- **Report stabilized efficiency, not initial efficiency.** This is a standards
  point rather than a technical one, and it matters: quoting the initial
  efficiency of an amorphous silicon device is misleading, and the accepted
  practice is to light-soak to a stabilized state first. Any comparison that
  uses initial values for one technology and stabilized values for another is
  not a comparison.

Related metastabilities appear across this material family and are worth
recognizing as a class: bias-induced threshold voltage shift in amorphous
silicon thin-film transistors, which is charge trapping plus defect creation
under gate stress and is why display pixel circuits use compensation schemes;
and the analogous instabilities in amorphous oxide semiconductors under
illumination and bias, which is why negative-bias illumination stress testing is
a standard qualification for display backplanes.

The general principle to take away: an amorphous network is a **frozen
metastable configuration**, not an equilibrium structure. Any energy input,
light, current, field or heat, can move it toward a different metastable
configuration. Stability is therefore something to be measured under operating
stress, not assumed from an as-deposited measurement.

## Nanostructured amorphous materials

Introducing structure on a nanometre scale into an amorphous matrix gives a
family of materials with properties neither phase has alone.

**Mixed-phase and microcrystalline silicon**, where nanocrystals are embedded in
an amorphous matrix. The transport is percolative through the crystalline
regions with the amorphous tissue passivating the grain boundaries, and the
result has higher mobility than the amorphous phase and far better light
stability. Because the properties depend so sharply on crystalline fraction, and
because that fraction varies through the film thickness, characterization by
Raman and by transmission electron microscopy is mandatory rather than optional.
Module 41 covers this material in full.

**Silicon nanocrystals in a dielectric matrix**, formed by depositing a
silicon-rich oxide or nitride and annealing so that the excess silicon
precipitates into nanocrystals. Two properties follow. Quantum confinement
widens the effective gap as the crystals shrink, giving size-tunable
luminescence in the visible from a material whose bulk form barely emits at all.
And discrete nanocrystals embedded in a dielectric make excellent charge storage
nodes, because a single leakage path through the dielectric discharges only the
nanocrystal above it rather than the whole floating gate. Nanocrystal memory was
developed on that argument.

**Quantum dots in amorphous or glassy hosts**, including the chalcogenide and
oxide glasses, giving size-tuned optical absorption and emission.

**Nanostructured chalcogenides** in phase-change memory, where the switching
volume is deliberately confined to nanometre dimensions to reduce the energy per
bit. Confinement changes the crystallization kinetics as well as the energy,
because nucleation in a small volume is statistically different from nucleation
in bulk, and that statistical variation is one source of the device-to-device
variability that limits multi-level storage (module 47).

**Nanoporous and nanocomposite amorphous films** for sensing and for
thermoelectrics, where the interfaces scatter phonons far more than they scatter
electrons, decoupling thermal from electrical conductivity in a way bulk
materials cannot (module 55).

The unifying idea is that adding a length scale to an amorphous material gives
a design variable it otherwise lacks. A crystal is tuned by composition and
strain; an amorphous solid is tuned by composition, hydrogen content and
deposition conditions; a nanostructured amorphous solid adds size and volume
fraction, and those often move properties further than chemistry alone can.

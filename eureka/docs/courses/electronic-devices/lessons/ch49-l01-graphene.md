# Graphene

<!-- covers: 49.1, 49.2, 49.3, 49.4 -->

Graphene is a single layer of carbon atoms in a honeycomb lattice. It has the
highest room-temperature mobility of any known material, it is the strongest
material ever measured, and it is nearly transparent. It also has no bandgap,
which is why it has not become a transistor channel, and understanding both
halves of that sentence is the point of this module.

## Synthesis routes

**Mechanical exfoliation.** Peeling layers from graphite with adhesive tape. It
produces the highest-quality graphene available, in flakes tens of micrometres
across, and it does not scale at all. Every fundamental measurement of graphene's
intrinsic properties was made on exfoliated material, and no product is made
this way.

**Chemical vapour deposition on copper.** The production method. A hydrocarbon
decomposes on a hot copper foil at around 1000 degrees C. Copper is used because
carbon barely dissolves in it, so growth is **surface-limited and self-limiting**:
once the surface is covered by a monolayer, growth stops. That self-limitation is
what makes monolayer coverage over large areas achievable, and it is a nice
parallel to the self-limiting chemistry of atomic layer deposition (module 44).
Growth on nickel, where carbon does dissolve, gives multilayer material by
precipitation on cooling and is harder to control.

The difficulty with CVD graphene is not growth but **transfer**. The film has to
be moved off the metal onto the target substrate, usually by coating it with a
polymer, etching the copper away, and laying the stack down. That process
introduces tears, wrinkles, polymer residue and trapped contamination, and the
resulting mobility is typically an order of magnitude below exfoliated material.
Transfer, not synthesis, is the practical quality bottleneck, and it is why
direct growth on insulating substrates is pursued despite giving poorer films.

**Epitaxial growth on silicon carbide.** Heating silicon carbide above about
1300 degrees C in vacuum or argon sublimes silicon preferentially, leaving a
carbon-rich surface that reconstructs into graphene. The great advantage is that
no transfer is needed and the substrate is already an insulator. The
disadvantages are the cost of silicon carbide wafers and the interaction between
the graphene and the substrate, which perturbs its properties. This route is used
for quantum resistance standards, where the material quality requirement is very
specific and the cost is irrelevant.

**Liquid-phase exfoliation and graphene oxide routes.** Graphite is oxidized,
which forces the layers apart, dispersed in solution, and then chemically or
thermally reduced. This produces tonnes of material cheaply, in the form of small
flakes with substantial residual defects and oxygen. It is not electronic-grade
and it is what nearly all commercial graphene actually is. Every application in
the composites, coatings, ink and battery-additive space uses this material, and
conflating it with the exfoliated monolayer whose properties are quoted in
reviews is the single most common error in reading this field.

## Band structure and electronic applications

**The band structure.** Carbon's in-plane sp2 bonds form the honeycomb framework;
the remaining p orbital perpendicular to the plane forms the pi bands. Those
bands touch at exactly two inequivalent points in the Brillouin zone, the **Dirac
points**, and near them the energy varies **linearly** with momentum rather than
quadratically.

That linear dispersion is the source of everything unusual:

- Carriers behave as **massless Dirac fermions**, with an energy-independent
  velocity of about 10^6 m/s, roughly one three-hundredth of the speed of light.
  The usual effective-mass description does not apply.
- **Mobility** exceeds 200 000 cm^2/(V s) in suspended, clean samples and
  reaches around 100 000 on hexagonal boron nitride substrates, far above any
  semiconductor. On silicon dioxide it drops to a few thousand because of
  substrate phonons and charged impurities, which is a substrate limitation
  rather than a material one.
- **Ambipolar conduction**: a gate voltage moves the Fermi level continuously
  from the valence band through the Dirac point into the conduction band, so the
  same device conducts by holes or electrons depending on bias.
- **Minimum conductivity**: even at the Dirac point, where the carrier density
  should vanish, the conductivity does not go to zero.
- **The half-integer quantum Hall effect**, observable at room temperature in
  high fields because the Landau level spacing is so large. This is a direct
  consequence of the Dirac spectrum and it was the observation that made the
  field's significance obvious.

**The bandgap problem.** There is no gap. A transistor whose channel has no gap
cannot be switched off: on-off current ratios in graphene field-effect
transistors are of order 10, against the 10^6 or more that digital logic
requires. That means graphene cannot replace silicon in logic, and no amount of
material improvement changes it, because the absence of a gap is the same
property that gives the high mobility.

Attempts to open a gap all trade away the advantage:

- **Nanoribbons** confine carriers laterally, opening a gap inversely
  proportional to width. A useful gap needs a width below about 5 nm, at which
  point edge roughness scattering destroys the mobility and the fabrication
  tolerance is beyond lithography.
- **Bilayer graphene** with a perpendicular field opens a tunable gap up to
  roughly 250 meV, which is still small, and mobility falls.
- **Chemical functionalization** opens a gap and disrupts the lattice that
  provided the mobility.

**Where graphene therefore succeeds electronically**, which is in applications
that do not need a gap:

- **Analogue and radio-frequency amplifiers**, where the device needs
  transconductance rather than an off state. Cut-off frequencies in the hundreds
  of gigahertz have been demonstrated.
- **Interconnects and transparent electrodes**, where conduction and transparency
  together are the requirement (module 56).
- **Sensors.** Every atom is a surface atom, so adsorbed molecules change the
  conductance measurably, and single-molecule detection has been demonstrated.
  Hall sensors and magnetic field sensors exploit the high mobility directly.
- **Quantum resistance metrology**, where the room-temperature-accessible
  quantum Hall plateaux allow resistance standards at far more practical
  temperatures and fields than gallium arsenide devices require (module 18).
- **Tunable-barrier contacts to semiconductors** (module 24).
- **Electrochemistry and energy storage**, where surface area and conductivity
  matter and where flake material is adequate.

## Characterizing graphene

Because graphene's properties depend so sharply on layer count, defects and
strain, characterization is unusually central, and one technique dominates.

**Raman spectroscopy** is the standard, and it is remarkably informative for a
single measurement:

- The **G peak**, near 1580 wavenumbers, from in-plane bond stretching, present
  in all sp2 carbon.
- The **2D peak**, near 2700 wavenumbers, whose shape and intensity relative to
  the G peak identify the **number of layers**. Monolayer graphene has a single
  sharp, symmetric 2D peak more intense than the G peak; bilayer and multilayer
  have broader, asymmetric 2D peaks of lower relative intensity. Counting layers
  from a Raman spectrum is routine and reliable.
- The **D peak**, near 1350 wavenumbers, which is forbidden in a perfect lattice
  and appears only when defects break the symmetry. The ratio of D to G intensity
  is the standard **defect density metric**, and it is how the quality of CVD and
  reduced-graphene-oxide material is quantified.
- **Peak shifts** report strain and doping, which can be separated by tracking
  the G and 2D peaks together since they respond differently to each.

**Optical contrast.** A monolayer on silicon with the right oxide thickness is
visible in an ordinary optical microscope because of interference, absorbing
about 2.3 percent of incident light. That absorption figure is itself notable: it
equals pi times the fine structure constant, a universal constant, independent of
any material parameter, which follows directly from the Dirac spectrum.

**Atomic force microscopy** for thickness and wrinkles, with the caveat that
adsorbed water and residue make an apparent monolayer thickness larger than the
true interlayer spacing.

**Transmission electron microscopy and electron diffraction** for lattice
structure, grain boundaries and layer stacking order.

**Transport measurements** (module 36) for mobility and carrier density, with the
standard caution that contact resistance and substrate effects dominate poor
measurements.

## Optical behaviour and its device uses

Graphene's optical properties follow from the same linear bands.

**Broadband absorption.** Because there is no gap, graphene absorbs from the
ultraviolet through the visible and infrared into the terahertz, uniformly at
2.3 percent per layer in the visible and near infrared. A photodetector built
from it therefore has no cut-off wavelength, which is unusual and useful for
broadband and infrared sensing. The obvious drawback is that absorbing 2.3
percent of the light gives poor responsivity, so practical detectors couple
graphene to a waveguide, a plasmonic structure or a quantum dot sensitizing
layer to increase absorption.

**Very fast carrier dynamics.** Photoexcited carriers thermalize in tens of
femtoseconds, so graphene photodetectors and modulators can be extremely fast.

**Tunable absorption.** Gating shifts the Fermi level, and once it moves far
enough from the Dirac point, interband transitions at a given photon energy
become Pauli-blocked and absorption switches off. That gives an electrically
tunable optical absorber, which is the basis of graphene optical modulators and
of saturable absorbers used to mode-lock fibre lasers, a modest but genuine
commercial application.

**Transparent conduction**, competing with indium tin oxide (module 56), where
graphene's advantages are flexibility and the absence of indium and its
disadvantage is a sheet resistance that remains higher than ITO at the same
transparency for large-area transferred films.

Deeper photonic uses of graphene, including plasmonics and integrated photonic
devices, belong to the photonics scope this course defers; see SCOPE.md.

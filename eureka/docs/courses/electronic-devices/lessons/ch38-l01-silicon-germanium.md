# Silicon-Germanium

<!-- covers: 38.1, 38.2, 38.3, 38.4 -->

Silicon-germanium is the most commercially successful semiconductor alloy after
silicon itself, and it earned that position by being compatible with silicon
manufacturing rather than by being better in isolation. It is the clearest case
study in this course of bandgap engineering inside an existing process.

## Physical properties of SiGe alloys

Silicon and germanium are completely miscible, so Si(1-x)Ge(x) exists at every
composition, and its properties interpolate between the two endpoints. The
interpolation is not linear, and the departures are where the engineering lives.

**Lattice constant.** Germanium's lattice is about 4.2 percent larger than
silicon's, and the alloy's follows Vegard's law closely, varying nearly linearly
with composition. That 4.2 percent is the central fact of the whole system. It
is small enough that thin SiGe layers can be grown on silicon strained rather
than relaxed, and large enough that the strain substantially changes the band
structure. Everything useful about SiGe comes from that combination.

**Bandgap.** Pure silicon is 1.12 eV, pure germanium 0.66 eV, and the relaxed
alloy interpolates with a bowing that makes it fall below the linear
interpolation. More importantly, the conduction band changes character across
the range: at low germanium fraction the alloy is silicon-like, with minima
along the <100> directions, and above roughly 85 percent germanium it becomes
germanium-like, with minima along <111>. Both are indirect.

**Strain changes everything.** A SiGe layer grown pseudomorphically on silicon
is compressed in plane and stretched out of plane. That biaxial strain splits
the degenerate valence bands, lowering the gap substantially more than
composition alone would, and it lifts the heavy-hole and light-hole degeneracy
so that hole effective mass falls. For a 20 percent germanium layer on silicon,
the strained gap is roughly 150 meV below silicon's, most of it appearing as a
**valence band offset**. That offset is what makes the heterojunction bipolar
transistor work: holes are blocked from the base while electrons pass, so the
base can be doped far more heavily without losing current gain.

The inverse arrangement is equally important. Grow **silicon on a relaxed SiGe
buffer** and the silicon is under biaxial *tension*. Tensile strain splits the
six conduction band valleys, putting the two with lower transverse mass in the
transport direction at lower energy, so electrons populate them preferentially
and their scattering between valleys is suppressed. Electron mobility rises by
tens of percent. This is strained silicon, and it was introduced into mainstream
CMOS manufacturing as one of the first materials-based performance boosts after
geometric scaling slowed.

**Critical thickness.** A strained layer relieves its strain by nucleating
misfit dislocations beyond a thickness that falls steeply as germanium fraction
rises: hundreds of nanometres at a few percent germanium, tens of nanometres at
20 percent, a few nanometres at 40 percent. Device design lives inside that
constraint, and x-ray reciprocal space mapping (module 33) is how compliance is
verified.

**Other properties.** Thermal conductivity of the alloy is far below either
endpoint, because mass disorder scatters phonons hard (module 35). That is a
problem for heat removal in SiGe devices and, as module 55 shows, a virtue in
thermoelectrics. Dopant diffusivities shift with composition and with strain,
with boron diffusion suppressed in compressively strained SiGe, which is
convenient because that is exactly where a bipolar base needs boron to stay put
(module 22).

## Optical properties of SiGe

SiGe remains **indirect** across the composition range that is practically
useful, so it is not a light emitter. What it does offer optically is a shifted
absorption edge.

Adding germanium narrows the gap, so the absorption edge moves to longer
wavelength. At around 20 to 30 percent germanium the alloy absorbs usefully out
past 1.3 micrometres, and pure or nearly pure germanium reaches beyond 1.55
micrometres. Those are the fibre-optic communication wavelengths, where silicon
is transparent and therefore useless as a detector.

This is the basis of **germanium-on-silicon photodetectors**, which are the
standard detector in silicon photonics: a germanium layer grown on a silicon
waveguide absorbs the telecom wavelengths that the silicon guides. Growing it
requires accommodating the full 4.2 percent mismatch, done by a low-temperature
seed layer followed by higher-temperature growth and thermal cycling to force
dislocations to annihilate, leaving a defect density low enough for a detector
even though it would be unacceptable for a laser.

Two further optical directions are worth naming because they are frequently
overstated. **Quantum wells and superlattices** of SiGe were pursued in the hope
of zone-folding the indirect gap into a direct one; the resulting emission
efficiency remained far below direct-gap materials. **Germanium under tensile
strain and heavy n-type doping** can be pushed toward direct-gap behaviour,
since germanium's direct valley sits only about 140 meV above its indirect one,
and lasing has been demonstrated at high thresholds. **Germanium-tin alloys**
become genuinely direct-gap above roughly 8 to 10 percent tin, and are the most
credible route to a group IV laser. None of this has displaced III-V lasers,
which are bonded or grown onto silicon photonic chips instead, and an honest
summary is that group IV light emission remains a research topic rather than a
product.

## Growing strained SiGe layers

SiGe is grown epitaxially on silicon substrates, almost always by chemical
vapour deposition, because CVD scales to production and integrates with existing
silicon epitaxy tooling.

The key process facts:

- **Low temperature is required.** Growth typically runs 500 to 700 degrees C,
  low by silicon epitaxy standards, because a strained layer will relax if it is
  given thermal energy and time. Every subsequent process step also has to
  respect that budget, which constrains the whole flow.
- **Ultra-high vacuum CVD and reduced-pressure CVD** are the standard methods,
  with germane as the germanium source alongside a silicon precursor. Germanium
  fraction is set by the gas ratio.
- **In-situ doping** with boron for bipolar bases and with carbon added to
  suppress boron diffusion further.
- **Selective epitaxy**, where growth happens on exposed silicon and not on
  oxide, is heavily used: the embedded SiGe source and drain stressors in
  p-channel transistors are grown selectively into etched recesses, where their
  larger lattice constant compresses the channel between them and raises hole
  mobility.
- **Graded buffers** are used when a relaxed SiGe layer is needed as a virtual
  substrate for strained silicon. Grading the germanium fraction slowly over a
  micrometre or more keeps the misfit dislocations confined near the bottom
  rather than threading to the surface. The trade is a thick, expensive layer
  with a rough cross-hatched surface that usually needs polishing.

Verification is a module 33 exercise: high-resolution x-ray diffraction for
composition and thickness, reciprocal space mapping for relaxation, Raman for
local strain, and TEM for dislocations.

**Where SiGe is actually used**, which is worth stating because the technology
succeeded quietly:

- **Heterojunction bipolar transistors** in SiGe BiCMOS, which give cut-off
  frequencies in the hundreds of gigahertz with silicon-compatible processing
  and cost. These dominate radio-frequency front ends, automotive radar and
  high-speed wireline circuits. This is SiGe's biggest commercial success.
- **Channel stressors** in CMOS, both the embedded SiGe compressive stressors
  for p-channel devices and strained silicon on relaxed buffers.
- **SiGe channels themselves** in advanced p-channel devices, where the higher
  hole mobility helps balance n and p performance.
- **Germanium photodetectors** in silicon photonics.
- **Thermoelectric legs** in high-temperature radioisotope generators, where
  the alloy's low thermal conductivity is the point (module 55).

## Polycrystalline SiGe

Polycrystalline silicon-germanium deserves its own section because it solves a
specific, unglamorous problem: it does the jobs polysilicon does, at lower
temperature.

Polysilicon deposition and dopant activation require temperatures around 600 to
900 degrees C. Adding germanium lowers the deposition temperature by a hundred
degrees or more and lowers the required activation temperature as well, because
germanium lowers the melting point and increases dopant activation efficiency.
It also gives lower resistivity at the same doping and lower film stress.

That temperature reduction matters in three places:

- **MEMS built above finished CMOS.** A micromechanical structure deposited on
  top of completed transistors and interconnect cannot exceed the thermal budget
  the aluminium or copper wiring underneath will tolerate, which is roughly 450
  degrees C. Poly-SiGe can be deposited and annealed within that budget, and
  polysilicon cannot. This enabled monolithic integration of MEMS sensors with
  their readout electronics on one die instead of two.
- **Gate electrodes**, where poly-SiGe allows the gate work function to be
  tuned with germanium fraction, which was useful for threshold adjustment in
  the era before metal gates.
- **Thin-film transistors on temperature-limited substrates**, including glass
  and, with further reduction, flexible plastics (module 46).

The general lesson SiGe teaches is worth extracting: the alloy is nowhere near
the best semiconductor available on any single axis. It is indirect, its thermal
conductivity is poor, and its strained layers are metastable. It won its
applications by being **compatible**, meaning it could be grown in existing
tools, on existing substrates, within existing thermal budgets, and integrated
into existing process flows. In a mature industry, compatibility beats
performance far more often than performance beats compatibility.

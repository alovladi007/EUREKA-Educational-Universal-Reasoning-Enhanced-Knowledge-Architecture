# Flexible Large-Area Electronics

<!-- covers: 46.1, 46.2, 46.3 -->

Large-area electronics inverts the usual objective. Instead of packing more
devices into less area, the goal is to spread adequate devices over more area, on
substrates that bend, at a cost per square metre rather than per square
millimetre. The materials of module 40 and 41 are what make it possible, and the
mechanics are what limit it.

## Amorphous silicon thin-film transistors on flexible substrates

**Why amorphous silicon.** The requirements of a large-area backplane are
different from those of a logic chip: mobility of order 1 cm^2/(V s) is enough to
switch a pixel, off-current must be very low so the pixel holds its charge, and
the process must run over square metres uniformly and cheaply. Plasma deposition
of a-Si:H (module 41) meets all three, and it does so below 300 degrees C.

**Why flexible substrates are hard.** Moving from glass to plastic drops the
usable process temperature from about 350 degrees C to roughly 150 to 200 for
polyethylene naphthalate and up to about 300 to 350 for polyimide. Four problems
follow, and each has a partial solution:

- **Film quality falls with temperature.** Below about 150 degrees C the
  precursor surface diffusion described in module 41 is too limited and defect
  density rises steeply. Very-high-frequency excitation and hydrogen dilution
  recover some of the loss.
- **Dimensional instability.** Polymers shrink irreversibly on first heating,
  absorb moisture and swell, and have expansion coefficients ten times the
  deposited films. Layer-to-layer alignment over a large panel therefore drifts.
  The standard answers are to pre-anneal the substrate, to compensate the mask
  set, and to use non-contact alignment that measures each panel.
- **Permeability.** Plastics pass water vapour and oxygen far too readily for
  either a-Si:H or an OLED above it. Multilayer inorganic-organic barrier stacks
  are required, and the specification for OLED encapsulation, around 10^-6 grams
  per square metre per day, is one of the more demanding thin-film requirements
  in manufacturing.
- **Handling.** Thin plastic is floppy. Most manufacturing laminates the plastic
  onto a rigid glass carrier, processes it as though it were glass, and releases
  it at the end, usually with a laser. That approach preserves existing tooling
  and is how flexible displays are actually made.

**Alternative flexible substrates** trade differently: stainless steel foil takes
much higher temperatures and is opaque and conductive, so it needs an insulating
planarization layer and only suits top-emitting or reflective devices; thin glass
below about 100 micrometres bends to a modest radius, is an excellent barrier,
and is fragile.

**The competing channel materials** should be named honestly, because a-Si:H is
no longer the automatic choice. **Amorphous oxide semiconductors**, principally
indium gallium zinc oxide, give around ten times the mobility with lower
off-current and deposit at low temperature by sputtering. **Low-temperature
polysilicon** gives much higher mobility with worse uniformity and a more complex
process. **Organic semiconductors** are the most mechanically compliant and the
lowest in mobility and stability. The current split is roughly: oxides for
high-resolution and OLED backplanes, polysilicon for small high-performance
panels, amorphous silicon for cost-driven large panels and for x-ray imagers,
organics for genuinely conformable and disposable applications.

## Field-effect transport in amorphous films

The transistor physics differs from crystalline MOSFET physics in ways that
matter for design, and they all trace to the band tails of module 25.

**Mobility depends on gate voltage.** Charge induced by the gate first fills
localized tail states, where it does not conduct. Only as the Fermi level rises
toward the mobility edge does a growing fraction of the induced charge become
mobile. Field-effect mobility therefore rises with gate overdrive rather than
being constant. Quoting a single mobility for such a device is incomplete without
the bias point, and comparing published values measured at different overdrives
is not a valid comparison.

**Subthreshold slope is set by the tail state density.** In a crystalline MOSFET
the subthreshold swing is limited by 60 mV per decade at room temperature; in a
thin-film transistor it is degraded above that by the density of states in the
gap, which must be charged as the surface potential moves. Measuring the swing is
therefore a direct measure of gap state density, and it is the standard quick
quality metric for a new channel material.

**Contacts often dominate.** With a channel mobility of order 1 and a contact
that may be Schottky-like, the contact resistance can exceed the channel
resistance in short devices. Extracting an intrinsic mobility requires measuring
a series of channel lengths and extrapolating, the transfer length method. A
mobility reported from a single short device is usually an underestimate of the
material and an overestimate of nothing useful.

**Bias stress instability.** Holding a gate bias shifts the threshold voltage
over time, through charge trapping in the dielectric and at the interface and
through defect creation in the channel (module 40). The shift is roughly
logarithmic or stretched-exponential in time and recovers partially when the bias
is removed. For a display this is a real design constraint: a pixel driven
continuously drifts relative to one that is not, producing image sticking, which
is why OLED pixel circuits include compensation transistors rather than the
single switch an LCD needs.

**Photosensitivity.** These channels absorb visible light and generate carriers,
so a transistor exposed to the backlight leaks. Light shields are standard, and
in oxide semiconductors the combination of illumination and negative bias
produces a particularly severe instability that has its own qualification test.

## Electronic transport under mechanical strain

Bending a circuit changes it electrically, and the mechanics are simple enough to
be designed with.

**The strain from bending.** For a film at distance z from the neutral plane of a
substrate bent to radius R, the strain is approximately z/R. Two design
consequences follow immediately. First, thin substrates bend to tight radii at
low strain, so substrate thickness is the primary lever. Second, placing the
active layers **at the neutral plane**, by adding a matched encapsulation layer
above them so the device sits at the mid-thickness, reduces their strain toward
zero. This neutral-plane engineering is the single most effective technique in
flexible electronics and it is essentially free.

**What strain does electrically.** Modest tensile strain typically increases
mobility slightly in amorphous silicon, by widening bond angles and increasing
overlap, and compressive strain decreases it. The changes are of order a few
percent per 0.1 percent strain, small enough to be a second-order effect for
switching applications and large enough to matter if the device is a sensor.

**What strain does mechanically**, which matters more. Brittle inorganic films
crack in tension at strains of roughly 0.5 to 1 percent. Once a channel or a
conductor cracks, the device fails abruptly rather than degrading. The
engineering responses:

- **Neutral plane placement**, as above.
- **Thin films**, since crack initiation energy scales with thickness, so a
  thinner film tolerates more strain.
- **Island architectures**, where rigid device islands are connected by
  serpentine or buckled interconnects that absorb the deformation. This decouples
  the strain in the wiring from the strain in the devices and allows stretchable
  rather than merely bendable systems.
- **Intrinsically compliant materials**, meaning organic semiconductors and
  conductors, elastomer substrates, and composite conductors, which deform rather
  than crack. They pay for it in mobility and stability.
- **Fatigue rather than single-event failure.** Repeated bending, as in a folding
  phone, drives crack nucleation over many cycles even below the single-bend
  failure strain, so the specification is a bend radius **and** a cycle count.

**Where this is used.** Flexible OLED displays in folding and curved phones,
which are the highest-volume application. Flexible and conformable x-ray
detectors. Electronic skin and wearable sensors. Printed sensors and RFID on
packaging. Roll-to-roll manufactured photovoltaics.

The honest framing of the field: the physics of flexible electronics is largely
solved, in that we know how to make transistors on plastic that work well
enough. What limits it is **manufacturing and reliability**: barrier films good
enough to keep an OLED alive for years, dimensional stability across a large
panel, and cyclic fatigue lifetimes that match product expectations. Those are
materials engineering problems of the kind modules 44 and 54 describe, not
device physics problems.

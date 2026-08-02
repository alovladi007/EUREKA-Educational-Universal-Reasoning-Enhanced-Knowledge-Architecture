# Ferroelectric Materials

<!-- covers: 42.1, 42.2, 42.3, 42.4 -->

## Polarization, hysteresis and definitions

Module 26 treated dielectrics whose polarization is proportional to the applied
field. Ferroelectrics break that proportionality: they carry a **spontaneous
polarization** with no field applied, and that polarization can be **switched**
between stable states by a field. The parallel with ferromagnetism is exact in
structure and unrelated in mechanism, which is why the name is borrowed and
slightly misleading.

**The structural origin.** In the canonical perovskite ferroelectric, the unit
cell distorts below a critical temperature so that the central cation shifts
slightly off centre relative to the surrounding oxygen cage. That displacement,
often only a few picometres, separates the centres of positive and negative
charge and produces a dipole. Because neighbouring cells couple, the
displacements order over long range and the crystal acquires a macroscopic
polarization. Crucially there are several equivalent directions the cation could
have shifted, so there are several stable polarization states, and a field can
push it from one to another.

The necessary symmetry condition is that the crystal must be **non-centrosymmetric**
and, more specifically, polar. Of the 32 crystal classes, 20 are piezoelectric,
10 of those are pyroelectric, and ferroelectrics are the subset of pyroelectrics
whose polarization is switchable. That nesting is worth remembering, because it
says every ferroelectric is automatically piezoelectric and pyroelectric, which
is why one material family serves so many device types.

**The hysteresis loop** of polarization against field is the defining
measurement, and its parameters are the working vocabulary:

- **Spontaneous polarization** Ps, the value inside a single domain.
- **Remanent polarization** Pr, what remains at zero field. This is the stored
  state in a memory.
- **Coercive field** Ec, the reverse field needed to switch. Too low and the
  memory is disturbed by noise; too high and it cannot be written at the supply
  voltage.
- **Loop area**, the energy dissipated per switching cycle.

**Domains** form for the same reason as in magnetism: uniform polarization
creates a depolarizing field that costs energy, so the crystal breaks into
regions of different polarization direction separated by domain walls. In
ferroelectrics the walls are much thinner than magnetic domain walls, often only
a few unit cells, because the anisotropy is strong relative to the coupling.
Switching proceeds by nucleation of reversed domains, usually at defects and
electrodes, followed by wall motion.

**The Curie temperature** is where the distortion disappears and the material
becomes paraelectric. The permittivity peaks sharply there, following a
Curie-Weiss law, which is exploited directly: capacitor dielectrics are
formulated so that the operating temperature range sits near the peak, giving
very high permittivity, and the peak is broadened deliberately by compositional
grading so that capacitance does not vary wildly across the range.

**Fatigue, imprint and retention** are the practical failure modes. Fatigue is
the loss of switchable polarization after many cycles, caused by charge trapping
and by oxygen vacancy accumulation at electrodes. Imprint is a shift of the loop
along the voltage axis after prolonged storage in one state, so the device
prefers the state it has been in. Retention is the gradual loss of polarization
over time. All three are electrode- and defect-dependent rather than intrinsic,
which is why the choice of electrode material turned out to be as important as
the ferroelectric.

## The main ferroelectric material families

**Barium titanate**, the original and still the dominant capacitor dielectric.
It has a high permittivity, several thousand near its transitions, and it is
cheap. Multilayer ceramic capacitors are made of it in enormous volumes, with
hundreds of electrode layers a micrometre or two thick interleaved with the
ceramic. Its temperature and voltage dependence are strong, which is why class
II ceramic capacitors lose much of their nominal capacitance under DC bias, a
fact that catches circuit designers out regularly and traces directly to
ferroelectric nonlinearity.

**Lead zirconate titanate (PZT)**, the workhorse piezoelectric. Its
outstanding property arises at the **morphotropic phase boundary**, a
composition where two different distorted phases have nearly equal energy. There
the polarization can rotate easily between many nearly-equivalent directions, so
the piezoelectric response is very large. PZT at that composition dominates
ultrasonic transducers, actuators, inkjet print heads, and piezoelectric MEMS.
Its drawback is lead content, and regulatory pressure has driven a long search
for lead-free alternatives based on sodium bismuth titanate, potassium sodium
niobate and barium titanate derivatives. Those have improved considerably and
still do not match PZT at the morphotropic boundary, which is an honest summary
rather than a pessimistic one.

**Strontium bismuth tantalate and lanthanum-substituted PZT**, developed
specifically for ferroelectric memory because they resist fatigue far better
than plain PZT with metal electrodes.

**Lithium niobate and lithium tantalate**, single crystals used for their
electro-optic and acoustic properties: optical modulators, surface acoustic wave
filters, and periodically poled structures for nonlinear optics. These are grown
by Czochralski (module 28).

**Polyvinylidene fluoride and its copolymers**, ferroelectric polymers. Their
polarization is small compared with ceramics and they are flexible, low in
acoustic impedance and easy to process into large thin sheets, which suits
hydrophones, contact microphones and flexible sensors.

**Hafnium oxide**, the most consequential recent development in this field.
Doped hafnia films were found to be ferroelectric in a metastable orthorhombic
phase stabilized by strain, dopants and film thickness. Why this matters is
entirely about integration: hafnium oxide is already the standard high-k gate
dielectric in CMOS (module 43), it is deposited by atomic layer deposition, it
is compatible with existing processes and materials, and unlike the perovskites
it stays ferroelectric down to a few nanometres. The perovskites lose their
ferroelectricity in very thin films because the depolarizing field wins, which
had capped how far ferroelectric memory could scale. Hafnia removed that cap and
reopened ferroelectric memory and ferroelectric transistors as scalable
technologies.

## Fabricating ferroelectric films

**Bulk ceramics** are made by conventional powder processing: mix and calcine
oxides or carbonates, mill to fine powder, form by pressing or tape casting, and
sinter. For multilayer capacitors, tape-cast layers are screen printed with
electrode paste, stacked, pressed and co-fired, which requires the electrode and
the ceramic to be compatible at sintering temperature. That compatibility
constraint drove the shift from precious metal electrodes to base metal nickel,
which then required firing in a reducing atmosphere, which then required
reformulating the ceramic to resist reduction. A materials chain reaction started
by a cost decision, and a good example of how coupled these choices are.

**Thin films** are made by:

- **Sol-gel and chemical solution deposition**, spinning on a precursor solution
  and pyrolysing then crystallizing it. Cheap, good stoichiometry control,
  limited conformality.
- **Sputtering**, from a ceramic target or by reactive sputtering from metal
  targets. Standard for production, with the usual difficulty that the volatile
  constituent, lead in PZT, is lost preferentially and must be compensated in
  the target.
- **Metal-organic CVD**, giving conformal coverage over topography, which
  matters for three-dimensional capacitor structures.
- **Pulsed laser deposition**, excellent stoichiometry transfer for research,
  poor area scaling.
- **Atomic layer deposition**, the method that makes ferroelectric hafnia
  practical, giving angstrom-level thickness control and conformality on
  high-aspect-ratio structures.

Two process issues dominate thin-film work. **Crystallization** requires an
anneal, typically 600 to 700 degrees C for perovskites, which is above the
thermal budget of finished CMOS interconnect and therefore constrains where in
the flow the ferroelectric can be integrated. Hafnia crystallizes lower, which
is another of its integration advantages. And **electrode choice** decides
fatigue: oxide electrodes such as strontium ruthenate or iridium oxide supply
and absorb oxygen at the interface rather than accumulating vacancies there, and
they largely eliminate the fatigue that platinum electrodes suffer.

## Ferroelectric devices

**Capacitors.** The volume application. Multilayer ceramic capacitors are among
the highest-unit-volume components manufactured, and their nonlinearity is a
design constraint rather than a defect.

**Piezoelectric transducers and actuators.** Ultrasound imaging arrays, sonar,
ultrasonic cleaning and welding, inkjet print heads, precision positioners for
scanning probe microscopes and lithography stages, and piezoelectric MEMS
resonators and energy harvesters. The bidirectionality is the point: the same
element generates a voltage from a force and a displacement from a voltage.

**Pyroelectric detectors.** Because polarization varies with temperature, a
change in incident infrared radiation produces a current. These detectors need
no cooling and respond to *changes* rather than absolute levels, which suits
motion detection, and they are the sensor in essentially every passive infrared
occupancy sensor.

**Ferroelectric memory.** A capacitor whose remanent polarization stores a bit.
It is non-volatile, writes fast and at low energy, and tolerates very many
cycles. Conventional ferroelectric RAM reads destructively, since determining the
state requires switching it, so a write-back is needed. Its historical
limitations were cell size and the difficulty of scaling perovskite films thin,
both of which hafnia addresses. **Ferroelectric field-effect transistors** put
the ferroelectric in the gate stack so the polarization sets the threshold
voltage, giving non-destructive read and a single-transistor cell, at the cost of
a difficult retention problem caused by the depolarizing field across the
semiconductor.

**Negative capacitance transistors**, a proposal to use a ferroelectric gate
layer to amplify the surface potential and beat the 60 mV per decade
subthreshold swing limit that sets a floor on supply voltage. The physics is
contested, with genuine disagreement about whether steady-state negative
capacitance is achievable or whether observations reflect transient switching
effects, and the honest position is that this is unresolved.

**Electro-optic and acoustic devices** in lithium niobate, covered where they
belong in the deferred photonics scope.

The connecting theme: ferroelectrics are the materials where a small structural
distortion produces a large, switchable, multi-functional response. That is why
one material family shows up as a capacitor, an actuator, a sensor and a memory,
and why the field's progress has come more often from integration advances than
from finding better bulk properties.

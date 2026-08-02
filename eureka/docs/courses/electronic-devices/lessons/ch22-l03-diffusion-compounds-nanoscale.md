# Diffusion in Compound Semiconductors and at the Nanoscale

<!-- covers: 22.8, 22.9, 22.10 -->

## Diffusion in III-V compounds

A compound semiconductor has two sublattices, and that single fact makes
diffusion qualitatively harder than in silicon.

In gallium arsenide there are gallium sites and arsenic sites, each with its
own vacancies and interstitials, and their concentrations are coupled to the
**arsenic overpressure** the crystal sees. Heat gallium arsenide in vacuum and
arsenic evaporates preferentially, generating arsenic vacancies; heat it under
arsenic overpressure and you generate gallium vacancies instead. Since dopant
diffusion is mediated by these defects, the same anneal at the same
temperature gives different diffusion depending on the ambient. Reproducibility
therefore requires controlling the group V partial pressure, which is why
III-V anneals are done capped with a dielectric layer, or proximity-capped
against a sacrificial wafer, or under a controlled arsenic or phosphorus
ambient.

The dopants themselves split by sublattice:

- **Silicon** is amphoteric in gallium arsenide: on a gallium site it is a
  donor, on an arsenic site an acceptor. Which one it becomes depends on
  growth stoichiometry and doping level, so heavy silicon doping
  self-compensates and the free carrier concentration saturates well below the
  atomic concentration. This is a fundamental limit rather than a purity
  problem.
- **Zinc**, the standard p-type dopant, diffuses by the dissociative mechanism
  through a fast interstitial state, and its diffusivity rises steeply with
  its own concentration. The profiles are strongly non-Fickian, with a
  characteristic abrupt front, and small changes in surface concentration
  produce large changes in depth. Zinc diffusion is used deliberately to form
  p-type regions and to intermix quantum wells, and it is a persistent
  contamination worry because it moves so easily.
- **Beryllium and carbon** are the alternatives for p-type. Carbon is prized
  in heterojunction bipolar transistors precisely because it barely diffuses,
  so a heavily doped base stays thin through subsequent processing. Choosing a
  dopant for its immobility rather than its solubility is a recurring theme.

Two further III-V-specific phenomena matter:

**Impurity-induced layer disordering.** Diffusing certain impurities through a
quantum well superlattice makes the constituent atoms interdiffuse across the
interfaces, smearing the wells and shifting the bandgap upward locally. This is
a deliberate technique for defining transparent windows and lateral confinement
in laser structures without etching.

**Interdiffusion at heterointerfaces.** Any heterostructure is
thermodynamically driven to mix. An abrupt interface grown at 600 degrees C is
metastable, and every subsequent thermal step degrades it. The abruptness that
makes a 2DEG or a quantum well work is a kinetic achievement, not an
equilibrium state, which sets a hard ceiling on the thermal budget of III-V
device processing and is a large part of why III-V processing runs cooler than
silicon processing.

## Diffusion in II-VI compounds

The II-VI compounds are more ionic, more weakly bonded and far more mobile
than the III-Vs, and everything about their diffusion follows from that.

**Self-diffusion is fast.** In mercury cadmium telluride, the workhorse
infrared detector material of module 31, mercury is so mobile that mercury
vacancies are the dominant native defect and the material's electrical type is
controlled by them. Annealing under mercury overpressure fills the vacancies
and makes the material n-type; annealing under tellurium overpressure creates
them and makes it p-type. The doping is set by stoichiometry rather than by
impurities, which is unlike anything in silicon and requires a completely
different processing mindset: the anneal ambient is not a background condition,
it is the doping step.

**Compositional interdiffusion is fast too.** Growing a CdTe/HgTe superlattice
and then heating it modestly causes the layers to intermix, because mercury
moves so readily. This limits both device processing temperature and the
long-term stability of the structure.

**Self-compensation is chronic.** Attempts to dope a wide-gap II-VI heavily
p-type are frustrated by the crystal generating compensating native donors in
response. This is a thermodynamic effect: the energy released by the dopant
is partly repaid by the energy cost of the compensating defect, and for wide
gaps the balance tips the wrong way. Zinc selenide light emitters foundered on
exactly this, and the fact that gallium nitride could eventually be doped
p-type, once magnesium acceptors were shown to be passivated by hydrogen and
activatable by annealing rather than intrinsically compensated, is why nitride
emitters and not selenide emitters became the blue light technology. Module 32
returns to this.

The general point across compounds: in a binary or ternary crystal, **the
native defect population is a variable you control through the ambient**, not
a constant you inherit. Diffusion, doping, compensation and interdiffusion are
all downstream of it.

## Diffusion in nanoscale volumes

When the diffusion length becomes comparable to the size of the object, the
bulk description fails in several ways at once, and modern devices are firmly
in that regime.

**Surfaces and interfaces dominate.** A nanoscale volume has a large fraction
of its atoms at a boundary, where formation energies and migration barriers
differ from the bulk. Surface diffusion is typically orders of magnitude
faster than bulk diffusion. In a nanowire or a fin, most transport of
contaminants happens along the surface rather than through the interior.

**Boundaries are both sources and sinks.** A free surface or an interface can
absorb point defects, so the supersaturation that drives transient enhanced
diffusion decays much faster in a small structure than in a bulk wafer. This
can suppress the effect, which is helpful, and it also means a diffusion recipe
calibrated on planar wafers does not transfer to a finned or nanosheet
geometry.

**Dopant statistics become discrete.** A transistor channel of 20 by 20 by 20
nanometres at 10^18 dopants per cubic centimetre contains fewer than ten dopant
atoms. Their exact number and position vary from device to device, producing
**random dopant fluctuation** in threshold voltage. The response has been to
move to structures whose electrostatics do not depend on channel doping at all:
fully depleted silicon on insulator, fin field-effect transistors and
gate-all-around nanosheets all use an undoped or lightly doped body, and this
is one of the main reasons for that architectural shift.

**Segregation dominates over solubility.** In a small volume, the energetically
preferred place for a dopant is often an interface, and there is an interface
nearby. Dopants pile up at or deplete from boundaries, producing profiles that
have little to do with the implanted distribution. Boron pile-up at a
silicon-oxide interface and dopant segregation to grain boundaries in
polysilicon are the standard cases.

**Grain boundaries are highways.** In polycrystalline films, diffusion along
grain boundaries can be many orders of magnitude faster than through the grain
interiors, giving the characteristic two-part profile of a shallow bulk
component plus a deep boundary component. This is the mechanism behind copper
penetration through barrier layers in interconnect, and it is why a barrier
must be amorphous or have a deliberately engineered boundary chemistry rather
than being merely thick.

Two further nanoscale effects worth naming: **stress-modified diffusion**, since
strain changes both formation and migration energies, so a strained channel
diffuses differently from a relaxed one (module 38); and **size-dependent
melting and mixing**, since small particles have depressed melting points and
mix at temperatures where the bulk materials would be stable, which matters for
nanoparticle-based conductive pastes and for solder at fine pitch (module 54).

The practical summary is uncomfortable and important: a diffusivity measured
on a bulk wafer is an upper-level estimate for a nanoscale structure, not a
prediction. Process models for advanced nodes are calibrated on the actual
geometry, and the calibration is a significant part of the development cost of
a technology node.

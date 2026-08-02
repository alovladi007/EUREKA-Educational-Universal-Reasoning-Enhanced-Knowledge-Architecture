# Underfills, Conductive Adhesives, Thermal Management and Package Selection

<!-- covers: 54.7, 54.8, 54.9, 54.10 -->

## Underfills and encapsulants

**Underfill** is the epoxy dispensed into the gap between a flip-chip die and its
substrate, and its effect on reliability is larger than almost any other single
packaging choice.

**What it does.** Without underfill, thermal expansion mismatch is accommodated
entirely by shear in individual solder joints, and the outer joints, furthest
from the neutral point, carry the most and fail first. Underfill mechanically
couples the die to the substrate so the assembly deforms as a unit, and the shear
is carried by the underfill layer across the whole die area rather than
concentrated in the joints. Thermal cycling lifetime typically improves by an
order of magnitude. It also seals the joints against moisture and provides
mechanical support against shock.

**Its formulation** is a case study in property balancing. The base is epoxy, and
it is heavily loaded with silica filler for three reasons at once: to lower the
expansion coefficient toward the solder's, to raise the modulus so it constrains
the assembly effectively, and to raise the thermal conductivity. Filler loading
can reach 60 to 70 percent by weight. The constraints on the formulation:

- **Expansion coefficient** should sit near the solder's, around 20 to 30 ppm/K,
  so the underfill does not itself become a stress source.
- **Glass transition temperature** must be above the operating range, because the
  expansion coefficient jumps sharply above it and the mechanical properties
  change.
- **Modulus** high enough to couple the assembly and low enough not to crack the
  die or the low-k stack.
- **Flow behaviour**, since capillary underfill has to wick into a gap tens of
  micrometres high across a die a centimetre across, without voids. Filler
  particles must be far smaller than the gap and than the joint spacing, which
  caps particle size as pitch shrinks.
- **Ionic purity**, since mobile ions in contact with biased conductors drive
  corrosion and electrochemical migration.
- **Adhesion** to the die passivation, the substrate solder mask and the solder,
  because a delaminated underfill is worse than none.

**Process variants.** Capillary underfill flows in after reflow. **No-flow**
underfill is dispensed before the die is placed, and the solder joints form
through it during reflow, saving a step and demanding that the underfill not
interfere with wetting. **Moulded underfill** combines the underfill and the
encapsulation step. **Wafer-level underfill** applies the material at wafer scale
before dicing.

**Encapsulants and moulding compounds** protect the whole assembly. Epoxy
moulding compound is again a heavily silica-filled epoxy, transfer-moulded around
the die and leadframe. Its requirements largely mirror the underfill's, with
additional emphasis on:

- **Moisture absorption**, because absorbed water flashes to steam during solder
  reflow and can delaminate or crack the package. This is why packages carry a
  **moisture sensitivity level** rating specifying how long they may be exposed
  to ambient humidity before they must be baked and reflowed.
- **Flame retardancy**, historically achieved with brominated compounds and
  antimony trioxide, both now restricted, driving reformulation toward
  phosphorus and mineral systems.
- **Alpha particle emission**, since trace uranium and thorium in the filler emit
  alpha particles that cause soft errors in memory. Low-alpha materials are
  specified for memory packages, and this is a genuine and specific materials
  purity requirement that has nothing to do with mechanical performance.
- **Stress on the die**, since moulding compound shrinkage during cure and
  cooling applies stress that shifts transistor parameters through
  piezoresistance (module 37).

## Electrically conductive adhesives

Conductive adhesives are polymers filled with conductive particles, used where
solder cannot or should not be used.

**How they conduct.** Silver flakes or particles are dispersed in an epoxy at a
loading above the **percolation threshold** (module 18), so a connected network
spans the joint. As the epoxy cures it shrinks, pressing the particles into
better contact, which is why cure shrinkage is a functional property rather than
a defect. Conductivity is typically an order of magnitude below solder, since
conduction is through many particle-to-particle contacts rather than through
continuous metal.

**Isotropic** conductive adhesives conduct in all directions and are used as
direct solder replacements for die attach and component attach. **Anisotropic**
conductive adhesives are loaded *below* percolation, so the material does not
conduct in bulk; when it is compressed between two opposing pads, the particles
trapped in that gap are forced into contact and conduct vertically, while
adjacent regions remain insulating. That one property makes it possible to bond a
whole array of connections in a single step without patterning the adhesive at
all, which is why anisotropic film is the standard method for attaching driver
chips and flexible circuits to display panels. It is a technology enabled
entirely by sitting on the correct side of a percolation threshold.

**Where conductive adhesives are chosen:**

- Low-temperature assembly, curing at 120 to 150 degrees C rather than reflowing
  at 250, for temperature-sensitive components and substrates.
- Fine-pitch flex-to-glass connections in displays.
- Lead-free assembly where regulation or application prohibits solder.
- Repairability and flexible assemblies where a rigid solder joint would crack.

**Their limitations**, which are why they have not replaced solder generally:
higher electrical resistance; contact resistance that increases over time,
particularly against non-noble metal finishes where an oxide grows at the
particle-pad interface; poorer mechanical strength; silver electromigration under
bias in humid conditions (module 45); and sensitivity to the surface finish they
are applied to.

**Sintered silver** is the high-performance relative and is worth distinguishing.
Silver nanoparticle paste applied with heat and often pressure sinters into a
joint of essentially bulk silver, which then has silver's melting point of about
960 degrees C. That means the joint can operate far above any solder's limit,
with excellent thermal and electrical conductivity, which is exactly what
wide-bandgap power devices need since their whole advantage is high-temperature
operation. It is a leading die-attach material for silicon carbide and gallium
nitride power modules.

## Thermal management

Heat removal is increasingly the binding constraint on system performance, and it
is a materials problem all the way through.

**The thermal path** from a junction to the ambient is a series of resistances,
and improving any one alone gains little because the total is a sum:

junction to die, die to attach, attach to substrate or spreader, spreader to
thermal interface material, interface to heatsink, heatsink to air.

**The interfaces usually dominate.** Two nominally flat surfaces touch only at
asperities, so the real contact area is a small fraction of the apparent area and
the rest is air, whose conductivity is about 0.02 W/(m K). **Thermal interface
materials** fill those gaps: filled greases and pastes, phase-change materials
that soften at operating temperature and flow into the gaps, gap pads for larger
tolerances, and liquid metals for the highest performance. Their bulk
conductivity is typically 1 to 10 W/(m K), which sounds poor against a metal and
is enormously better than the air it replaces. Their persistent problems are
**pump-out**, where thermal cycling gradually squeezes the material out of the
joint, and **dry-out**, where the carrier fluid evaporates, both of which cause
thermal performance to degrade over years.

**Heat spreaders and heatsinks.** Copper for conductivity, aluminium for weight
and cost, and specialized materials where expansion matching matters as well:
aluminium silicon carbide composites, copper-molybdenum, and, for the most
demanding applications, diamond composites or chemical-vapour-deposited diamond,
which has the highest thermal conductivity of any material at over 2000 W/(m K)
and an expansion coefficient close to silicon's.

**Vapour chambers and heat pipes**, which use evaporation and condensation to move
heat with an effective conductivity far above any solid.

**Liquid and two-phase cooling**, including cold plates, direct-to-chip
microchannel cooling and immersion, which are now standard in data centres where
rack power densities exceeded what air can remove.

**The specific problems of advanced packaging.** Stacking dies puts a heat source
under a thermal insulator, since the die above impedes the path. Through-silicon
vias help slightly by conducting through the stack. The die most sensitive to
temperature, usually memory, ends up furthest from the heatsink in some stacking
orders, which constrains the architecture. And silicon-on-insulator devices
(module 43) self-heat because the buried oxide is a thermal barrier.

## Selecting a package

A decision framework, ordered by what usually binds first.

**1. Power and thermal.** Compute the junction temperature for the candidate
thermal path. If it exceeds the limit, no other virtue matters. This decides
between organic and ceramic, air and liquid, and whether an exotic spreader is
needed.

**2. Connection count and pitch.** A few tens of pins allows a leadframe package.
Hundreds to a couple of thousand allows an organic substrate ball grid array.
Thousands to tens of thousands, particularly for die-to-die bandwidth, requires
an interposer or hybrid bonding.

**3. Electrical performance.** At multi-gigahertz signalling, package parasitics
matter: inductance in the power path, loss in the substrate dielectric, and
crosstalk. This can force a lower-loss substrate material or a shorter path.

**4. Reliability environment.** Consumer, automotive under-hood, industrial,
aerospace and medical implant impose different thermal cycling ranges, humidity
exposures and qualification durations. Automotive grade is substantially harder
than consumer, and it drives material selection toward higher glass transition
temperatures, expansion matching and hermetic or near-hermetic protection.

**5. Cost and volume.** Wire bonding on a leadframe is the cheapest thing that
works and covers most units shipped. Each step up the list above multiplies cost,
so the discipline is to use the cheapest option that meets requirements one
through four rather than the most capable one available.

**6. Testability and repair.** Can the assembly be tested before it is committed
into a more expensive assembly? In a multi-die package, one bad die scraps the
whole module, which is why known-good-die testing is central to chiplet
economics.

The overall lesson of module 54 is that the package is where every material
property in this course meets every other one, under a thermal cycle. Expansion,
modulus, thermal conductivity, diffusion, corrosion, percolation, adhesion and
moisture transport all appear at once, and a package fails at whichever of them
was considered last.

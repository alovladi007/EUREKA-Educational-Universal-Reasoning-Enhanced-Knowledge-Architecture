# Electronic Packaging: What a Package Does, and the Expansion Problem

<!-- covers: 54.1, 54.2, 54.3 -->

## What a package has to do

A package is not a box. It is a materials system that performs five functions at
once, and the reason packaging deserves a module is that it is where most field
failures occur and where a growing share of system performance is decided.

**The five functions:**

1. **Electrical connection.** Route signals and power between the die's
   micrometre-scale pads and the board's millimetre-scale features, without
   excessive resistance, inductance or capacitance. Signal integrity at
   multi-gigahertz rates is now a package design problem, not just a board one.
2. **Power delivery.** Supply amperes at under a volt with millivolt-scale
   tolerance. Package inductance and resistance in the power path directly limit
   how fast a processor can change its current draw.
3. **Heat removal.** Move the dissipated power from a die a centimetre across to
   a heatsink or the ambient, through a stack of interfaces that each add thermal
   resistance.
4. **Mechanical support and protection** against handling, vibration, shock and
   the stresses of assembly.
5. **Environmental protection** against moisture, ions, corrosive species and,
   for some applications, radiation and light.

**Why packaging became strategically important.** For decades the package was a
cost item and transistor scaling delivered the performance. As scaling slowed,
attention moved to what surrounds the die, and **advanced packaging** became a
performance lever in its own right:

- **2.5D integration**, placing multiple dies side by side on a silicon interposer
  with very fine wiring between them. This lets a logic die and a stack of memory
  sit close together with enormous bandwidth between them.
- **3D stacking** with through-silicon vias, putting dies directly on top of one
  another. High-bandwidth memory is stacked this way, and logic-on-logic stacking
  is in production.
- **Chiplets**, splitting a large design into several smaller dies made on
  different processes and joined in a package. Yield improves because small dies
  yield better, cost improves because only the parts that benefit need the most
  advanced node, and the package becomes the integration substrate.
- **Fan-out wafer-level packaging**, where dies are embedded in a moulded
  reconstituted wafer and redistribution wiring is built directly on them,
  eliminating the organic substrate entirely.

In each of these the package is doing what the chip used to do, and the materials
constraints below are what limit them.

## The materials challenge in packaging

Packaging is difficult because it must join materials that have almost nothing in
common. A single package contains, in contact:

- **Silicon** die, expansion coefficient 2.6 ppm/K, brittle, stiff.
- **Copper** interconnect and leadframe, 17 ppm/K, ductile.
- **Solder**, 20 to 25 ppm/K, soft, creeping continuously at room temperature
  because room temperature is a high fraction of its melting point.
- **Organic substrate**, 15 to 18 ppm/K in plane and much higher through
  thickness, absorbing moisture, with a glass transition in the operating range.
- **Moulding compound**, 10 to 20 ppm/K below its glass transition and two to
  three times that above.
- **Ceramic**, 4 to 7 ppm/K, stiff and brittle.
- **Underfill**, 25 to 40 ppm/K, chosen for compliance.

Every interface between two of these is a site where thermal cycling drives
strain, and the resulting fatigue is the primary wear-out mechanism of packaged
electronics.

**The requirements that pull against each other:**

- **Thermal conductivity** wants metals and ceramics; **compliance** wants
  polymers; **expansion match to silicon** wants ceramics and specialty alloys;
  **cost** wants organics.
- **Electrical insulation** in the substrate against **thermal conduction**
  through it. These normally travel together in the wrong direction, since good
  electrical insulators are usually poor thermal conductors, with aluminium
  nitride and diamond being the valuable exceptions.
- **Low permittivity** in the substrate for signal speed against **high
  permittivity** for embedded decoupling capacitance.
- **Hermeticity** against **cost and weight**.

**The environmental constraint set** that must be satisfied simultaneously:
moisture ingress, which causes corrosion and, dramatically, the "popcorn"
cracking that occurs when absorbed water flashes to steam during reflow; ionic
contamination, since chloride and sodium drive corrosion and electrochemical
migration; and mechanical shock and vibration.

**Regulatory constraints are materials constraints.** The elimination of lead
from solder forced a change to tin-silver-copper alloys with melting points
roughly 30 degrees C higher, which raised reflow temperatures, which stressed
every polymer in the package, which required reformulating substrates and moulding
compounds, and which made tin whisker growth a live reliability concern again
because lead had been suppressing it. That single regulatory change propagated
through the entire materials set, which is a good illustration of how coupled
this system is.

## Thermal expansion mismatch

This is the central failure mechanism, so it is worth working through
quantitatively.

**The mechanism.** Two bonded materials with different expansion coefficients,
subjected to a temperature change, must strain differently. Since they are
bonded, the difference is accommodated as stress in the joint between them. The
strain in a solder joint scales roughly as

    strain = (difference in expansion coefficient) x (temperature change)
             x (distance from neutral point) / (joint height)

Three design levers fall out of that expression immediately, and they are the
three things package designers actually adjust.

**Reduce the mismatch.** Choose materials with closer expansion coefficients.
This is why aluminium nitride, with 4.5 ppm/K, is used for power modules despite
costing several times alumina, and why a family of specialty materials exists
purely to hit a target coefficient: controlled-expansion nickel-iron alloys,
copper-molybdenum and copper-tungsten composites, aluminium-silicon carbide
composites, and metal-matrix composites whose coefficient is tuned by the
reinforcement fraction. Note that these materials have no other purpose. They
exist because expansion matching is that important.

**Reduce the distance from the neutral point.** Stress grows with distance from
the centre of the die, so the corner joints of a large package see the most
strain and fail first. This is why large dies are harder to package than small
ones, why the corner solder balls are the ones that crack, and why an area array
package is qualified with attention to its outermost joints.

**Increase the compliance.** A taller solder joint distributes the same
displacement over more height and so strains less, which is why solder ball
standoff height is a specified parameter. **Underfill**, an epoxy dispensed into
the gap under a flip-chip die, works differently and more powerfully: it couples
the die and substrate together so that the assembly deforms as a unit and the
shear is carried by the underfill layer as a whole rather than concentrated in
individual joints. Underfill routinely improves thermal cycling life by an order
of magnitude, and it is essentially mandatory for flip-chip on organic
substrates.

**Why solder specifically.** Solder is the weak point because at room temperature
it is already at a high fraction of its absolute melting point, so it **creeps**
continuously under load rather than deforming elastically. Each thermal cycle
therefore produces some inelastic strain that does not recover, damage
accumulates, cracks initiate at the joint corners where stress concentrates, and
propagate until the joint opens. Lifetime models are based on the inelastic strain
energy accumulated per cycle, and accelerated testing uses a wider temperature
range than the application with an acceleration factor derived from those models.

**Other consequences of mismatch** beyond solder fatigue:

- **Die cracking**, since silicon is brittle and thinned dies for stacking are
  thinner and more fragile.
- **Delamination** at any interface where adhesion is marginal, particularly
  between the moulding compound and the leadframe or die surface. Delamination
  then admits moisture and becomes a corrosion path.
- **Warpage** of the whole package, which prevents it from sitting flat on the
  board during reflow and causes open or bridged joints. Warpage control is a
  major concern for large thin packages, and it is managed by balancing the layer
  structure so that the assembly is symmetric about its mid-plane.
- **Stress transmitted into the die**, which shifts transistor characteristics
  through piezoresistance (module 37) and can crack the low-k interconnect stack
  (module 43). This is the direct coupling between packaging and on-chip
  materials, and it is why low-k integration is partly a packaging problem.

The design discipline that follows: **treat the package as a thermomechanical
system from the start**. The material selections, the geometry, the underfill and
the die size are coupled, and optimizing any one of them alone reliably produces
a package that fails in thermal cycling.

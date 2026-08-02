# Perovskite Oxides in Fuel Cells, Membranes and Devices

<!-- covers: 57.3, 57.4, 57.5 -->

## Solid oxide fuel cells

Module 27 introduced the solid oxide fuel cell and its central constraint: the
electrolyte's ionic conductivity forces a high operating temperature, and that
temperature makes every other material problem harder. The perovskite oxides are
where the field looks for a way down.

**Why lower temperature is the goal.** At 800 to 1000 degrees C, interconnects
must be ceramic or exotic alloys, seals are difficult, start-up takes hours,
thermal cycling cracks the stack, and component interdiffusion degrades
performance over time. Dropping to 500 to 700 degrees C would allow stainless
steel interconnects, faster start-up, cheaper seals and longer life, all at once.
That is why intermediate-temperature operation is the organizing objective.

**Electrolytes.** Yttria-stabilized zirconia is the incumbent, robust and not
conductive enough below about 700 degrees C. The perovskite alternative is
**lanthanum gallate** doped with strontium and magnesium, which has substantially
higher oxide ion conductivity at intermediate temperature. Its difficulties are
gallium volatility under reducing conditions, reactivity with the nickel in
conventional anodes, and cost. Doped ceria conducts better still and becomes
partly electronically conducting under reducing conditions, which internally
short-circuits the cell (module 27).

**Proton-conducting perovskites**, based on barium cerate and barium zirconate
doped with yttrium, conduct protons rather than oxide ions. Because proton
migration has a lower activation energy, these work at lower temperature, and
they have a second advantage: water is produced on the air side rather than the
fuel side, so the fuel is not diluted as it is consumed. The barium cerates react
with carbon dioxide and steam; the zirconates are chemically stable and harder to
sinter, and solid solutions between them are the usual compromise.

**Cathodes** are where perovskites are unambiguously the standard. Oxygen
reduction is the slowest step in a fuel cell, and the reaction ordinarily happens
only at the three-phase boundary where gas, electrolyte and electron conductor
meet, which is a line rather than an area. A **mixed ionic-electronic conducting**
perovskite, typically a lanthanum strontium cobalt ferrite, conducts both oxide
ions and electrons, so oxygen can be reduced anywhere on its surface and the ions
travel through the bulk to the electrolyte. That converts the reaction site from
a line to an area and increases the active region enormously, which is the single
biggest lever on intermediate-temperature performance.

The cathode's requirements illustrate the coupling that runs through this whole
course: high mixed conductivity, catalytic activity for oxygen reduction, thermal
expansion matched to the electrolyte, chemical compatibility so that it does not
react with the electrolyte to form an insulating interphase, and stability against
chromium poisoning from the metallic interconnect. Cobalt-rich compositions are
the most active and have the worst expansion mismatch, so the composition is
usually a compromise rather than an optimum.

**Anodes.** The conventional anode is a nickel-zirconia composite, which is
effective and has three well-known weaknesses: it is poisoned by sulphur in the
fuel, it cokes up when running hydrocarbons directly, and the nickel re-oxidizes if
the fuel supply is interrupted, expanding and cracking the anode. Perovskite
anodes, such as doped strontium titanates and chromites, address all three by
being oxidation-tolerant, sulphur-tolerant and coking-resistant. Their catalytic
activity and electronic conductivity are lower, which is the trade, and they are
attractive precisely for systems that must run on real hydrocarbon fuels rather
than clean hydrogen.

**Interconnects.** At intermediate temperature, coated ferritic stainless steel
can be used instead of ceramic, and the coating is often a perovskite or spinel
oxide whose job is to conduct electrons while blocking chromium from evaporating
out of the steel and poisoning the cathode.

**Running the stack backwards.** The same cell operated in reverse is a
**solid oxide electrolyser**, splitting steam into hydrogen and oxygen at high
efficiency because part of the energy is supplied as heat rather than
electricity. This has made the technology part of the hydrogen and energy storage
conversation rather than only a power generation one, and it is currently the
larger commercial driver.

## Oxygen-separating membranes

The same mixed conduction that makes a good fuel cell cathode makes a membrane
that separates oxygen from air with perfect selectivity.

**The mechanism.** A dense, gas-tight membrane of a mixed ionic-electronic
conducting perovskite is exposed to air on one side and a low oxygen partial
pressure on the other. Oxygen molecules adsorb and are reduced to oxide ions on
the high-pressure side, the ions migrate through the lattice via vacancies, and
they recombine and desorb as oxygen molecules on the low-pressure side. The
electrons travel back through the same membrane, which is why mixed conduction is
essential: no external circuit is needed, so the membrane operates passively.

**Why this is remarkable.** The selectivity is infinite in principle, because only
oxygen can traverse the lattice as an ion. Nothing else has a transport path. A
polymer or porous membrane separates by size or solubility and always leaks; this
separates by chemistry and does not.

**The applications:**

- **Oxygen production** for industrial use and for oxy-fuel combustion, in which
  burning fuel in pure oxygen rather than air produces a flue gas that is mostly
  carbon dioxide and water, so the carbon dioxide can be captured by condensing
  out the water. Cryogenic air separation is the incumbent and is energy-intensive,
  so a membrane that operates on waste heat is attractive.
- **Membrane reactors**, in which the oxygen is delivered directly into a
  chemical reaction, for example the partial oxidation of methane to synthesis
  gas. Combining separation and reaction in one unit removes a whole process
  step.

**The materials problem** is a clean example of an unavoidable trade. The best
oxygen fluxes come from cobalt-rich barium strontium cobalt ferrites, and those
same compositions are the least stable: they decompose under the low oxygen
partial pressures they are meant to operate against, they react with carbon
dioxide to form carbonates, and their large chemical expansion, meaning the
lattice expands as it loses oxygen, cracks the membrane when the two faces are at
different oxygen activities. More stable compositions have lower flux.
Thirty years of work has not resolved this, and the honest description is a
performance-stability trade with no known way around it rather than a problem
awaiting the right composition.

## Perovskite oxides in devices

Pulling together where this structural family actually appears in electronics.

**In production, in volume:**

- **Multilayer ceramic capacitors** based on barium titanate, among the
  highest-unit-volume components made (module 42).
- **Piezoelectric actuators, transducers and sensors** based on PZT: ultrasound
  probes, inkjet heads, precision positioners, sonar.
- **Pyroelectric infrared detectors** in motion sensors.
- **Thermistors**, including the positive-temperature-coefficient barium titanate
  devices used as self-regulating heaters and as resettable overcurrent
  protection. Their behaviour comes from grain boundary barriers that rise
  sharply at the ferroelectric transition, which is a grain boundary effect used
  as the function.
- **Varistors and gas sensors**, again grain-boundary-dominated devices.
- **Solid oxide fuel cell and electrolyser cathodes**, now commercially deployed.
- **Superconducting tape**, the cuprates of module 51, which are perovskite
  derivatives.

**In development with real prospects:**

- **Ferroelectric memory**, where the perovskites' inability to stay ferroelectric
  in very thin films handed the field to hafnium oxide (module 42), though
  perovskites remain in use where thickness is not constrained.
- **Oxide electronics**, exploiting interface two-dimensional electron gases,
  metal-insulator transitions and strain-tuned properties. Transparent oxide
  transistors are already commercial (module 56); correlated-oxide devices are not.
- **Intermediate-temperature fuel cells and electrolysers**, as above.
- **Neuromorphic devices** using the metal-insulator transitions and the ionic
  motion these materials support so readily.

**A note on the other perovskites.** The halide perovskites, such as methylammonium
lead iodide, share the ABX3 structure with a halide anion instead of oxygen, and
they have produced remarkable photovoltaic efficiencies in a decade. They are a
different materials problem from the oxides: their attraction is defect tolerance
and easy solution processing, and their obstacles are operational stability under
heat, moisture and light, and the lead content. Because photovoltaics sits in the
optoelectronic scope this course defers, they are noted here and not developed;
see SCOPE.md.

## Closing the materials half

Module 57 ends the electronic scope of this course, and the perovskites are a
fitting place to finish because they demonstrate the argument the whole second
half has been making.

One structure, tuned by substitution, distortion and strain, gives a capacitor, an
actuator, a sensor, a superconductor, an ionic conductor, a catalyst and a
membrane. The property that any given composition exhibits is not an inherent
fact about "the perovskites" but a consequence of specific bond angles, specific
defect populations and a specific microstructure, all of which are set by
processing. That is the thesis of modules 17 through 57: **a device's
characteristics are a materials outcome, and the materials outcome is a
processing outcome**.

What remains unbuilt in this course is the photonics half: the optoelectronic
and photonic materials part of the reference, the photovoltaic and imaging
chapters, and the terahertz and metamaterial work. SCOPE.md lists exactly what is
held back and why, so the syllabus never claims coverage it does not have.

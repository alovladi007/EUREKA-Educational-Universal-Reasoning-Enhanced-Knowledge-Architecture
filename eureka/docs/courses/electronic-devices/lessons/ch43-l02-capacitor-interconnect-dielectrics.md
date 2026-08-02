# Capacitor and Interconnect Dielectrics, and Selecting Across a Process

<!-- covers: 43.4, 43.5, 43.6 -->

## Capacitor dielectrics

The dynamic random-access memory cell is the most demanding capacitor in
electronics, and following its evolution shows how a single specification drove
a chain of materials changes.

**The requirement.** A DRAM cell stores a bit as charge on a capacitor. That
charge must be large enough to be sensed reliably against noise, which fixes a
minimum capacitance of roughly 20 to 30 femtofarads per cell, and that number has
barely changed across generations because it is set by sense amplifier physics
rather than by lithography. Meanwhile the cell area has shrunk by orders of
magnitude. Holding capacitance constant while area falls means the ratio of
permittivity to thickness must rise by the same factor.

Leakage is equally constrained: the cell must hold its charge long enough for the
refresh interval, tens of milliseconds, which means leakage currents in the
femtoampere range. Refresh power is a large fraction of DRAM power, so any
leakage increase costs energy across the whole part.

**The responses, in sequence:**

1. **Thin the dielectric.** Silicon dioxide, then oxide-nitride-oxide stacks with
   a somewhat higher effective permittivity, until tunnelling stopped it.
2. **Increase the area without increasing the footprint** by going
   three-dimensional. Trench capacitors are etched deep into the substrate; stack
   capacitors are built as tall cylinders above it. Modern DRAM cells have aspect
   ratios in the tens, so a capacitor is a narrow, very deep hole. This is why
   deposition **conformality** became the deciding property of the process, and
   why atomic layer deposition is not optional here.
3. **Raise the permittivity.** Aluminium oxide, then hafnium and zirconium
   oxides, then zirconia-alumina-zirconia laminates that combine the high
   permittivity of zirconia with the better barrier properties of alumina.
   Higher-permittivity perovskites such as strontium titanate and barium
   strontium titanate offer permittivity in the hundreds and have persistent
   integration problems: leakage, difficulty of conformal deposition, and
   thermal budget.
4. **Change the electrodes.** Titanium nitride electrodes rather than
   polysilicon, both to avoid a low-permittivity interfacial layer and because
   the electrode work function affects the leakage barrier.

The same considerations, relaxed, apply to on-chip **decoupling capacitors** and
to **metal-insulator-metal capacitors** in analogue and radio-frequency circuits,
where the additional requirements are linearity with voltage, which pushes back
toward lower-permittivity materials since high-k films are more nonlinear, and
matching between nominally identical devices.

## Interconnect and low-k dielectrics

Here the requirement inverts: the dielectric between wires should have the
**lowest possible** permittivity.

**Why.** Signal delay in a wire is proportional to its resistance times its
capacitance. As dimensions shrink, wires get thinner and more resistive (module
18) and closer together and therefore more capacitive, so RC delay grows even as
transistors get faster. By the late 1990s interconnect delay exceeded gate delay
and became the limiting factor. Dynamic power also scales with capacitance, and
crosstalk between adjacent lines scales with their mutual capacitance.

The industry attacked both terms at once: **copper** replaced aluminium to cut R,
and **low-k dielectrics** replaced silicon dioxide to cut C. Both changes
arrived together around the same node, and both required new process
architectures.

**The low-k progression**, and what each step cost:

- **Fluorinated silicate glass**, permittivity about 3.5 against silicon
  dioxide's 4.0 to 4.2. Adding fluorine reduces polarizability. Modest gain,
  easy adoption, and a tendency for fluorine to migrate and attack adjacent
  materials.
- **Carbon-doped oxide (organosilicate glass)**, permittivity 2.7 to 3.0.
  Methyl groups replace some oxygen bridges, lowering both density and
  polarizability. This is the mainstream low-k material.
- **Porous low-k**, permittivity 2.2 to 2.5, made by including a sacrificial
  porogen that is removed after deposition, leaving nanoscale voids. Since air
  has permittivity 1, adding porosity is the most direct way to lower the
  average.
- **Air gaps**, permittivity approaching 1, formed deliberately between critical
  lines. Used selectively, where the mechanical and thermal penalties are
  tolerable.

**The problem with all of them** is that permittivity, mechanical strength and
thermal conductivity fall together, because all three depend on having material
present. A porous low-k film is mechanically weak and thermally insulating.
That produces a cascade of integration difficulties:

- **Chemical-mechanical polishing** applies shear stress that can crush or
  delaminate a weak film.
- **Packaging stress**, particularly from flip-chip bumping and from thermal
  cycling, propagates into the interconnect stack and can crack it. This is why
  low-k integration is a packaging problem as much as a fab problem (module 54).
- **Pore sealing.** Open pores absorb moisture, which raises permittivity
  catastrophically since water's permittivity is about 80, and they let barrier
  precursors and copper penetrate. Sealing layers are required, and they add
  back capacitance.
- **Plasma damage.** Etch and ash processes strip carbon from the film surface,
  raising local permittivity and making the film hydrophilic. Restoration
  treatments exist and are imperfect.
- **Thermal conductivity** falls, so heat generated in the wires has a harder
  path out, which worsens electromigration.

The result is that low-k adoption has run behind the roadmap for two decades: the
industry has consistently taken longer to integrate each generation than planned,
and the practical permittivity in production is higher than the research values.
That is a good example of a materials property that is easy to achieve in a film
and hard to achieve in a working stack.

## Selecting dielectrics across a process

Bringing module 43 together as a decision framework.

**Identify the role first, then the property that dominates it.**

| Role | Dominant property | Typical material |
| --- | --- | --- |
| Gate | high permittivity, interface quality, band offsets | hafnium oxide with an interfacial layer, metal gate |
| Isolation | fill capability, planarity, stress control | deposited oxide in shallow trenches |
| Memory capacitor | very high permittivity, conformality, low leakage | zirconia and alumina laminates by ALD |
| Interconnect | low permittivity, adequate mechanical strength | carbon-doped and porous oxide |
| Passivation | moisture and ion barrier, mechanical protection | silicon nitride |
| Package encapsulation | matched expansion, adhesion, low ionic content | filled epoxy (module 54) |

**Then check the constraints that kill candidates:**

1. **Thermal budget.** Where in the flow does this layer go? After metallization
   nothing can exceed roughly 400 to 450 degrees C. This constraint alone
   eliminates most perovskites from back-end integration.
2. **Chemical compatibility.** Does it react with what it touches, at process
   temperature and over ten years at operating temperature? Does it need a
   barrier, and does that barrier eat the benefit?
3. **Conformality.** Is the surface flat or is it a hole with an aspect ratio of
   50? This determines the deposition method before anything else does.
4. **Mechanical.** Will it survive polishing, dicing, bumping and thermal
   cycling?
5. **Interface.** For any layer adjacent to a channel or a junction, the
   interface trap density matters more than the bulk property.
6. **Metrology.** Can you measure it in production? An equivalent oxide thickness
   from capacitance-voltage, a physical thickness from ellipsometry or x-ray
   reflectivity, a permittivity from a test capacitor, a leakage from a stress
   test. A material you cannot measure in line cannot be controlled.

**The recurring lesson of this module** is that the winning dielectric is rarely
the one with the best headline number. Silicon dioxide held the gate for forty
years on interface quality, not permittivity. Hafnia won on the combination of
adequate permittivity, correct band offsets, thermodynamic stability against
silicon, and ALD compatibility, and it still required a simultaneous switch to
metal gates. Low-k materials with excellent permittivity have repeatedly failed
to reach production because they could not survive polishing. In dielectrics more
than anywhere else in this course, integration determines the winner.

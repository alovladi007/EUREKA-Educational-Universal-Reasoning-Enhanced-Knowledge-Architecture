# Ionic Conduction: Mechanism, Fast Ion Conductors, Mixed Conduction

<!-- covers: 27.1, 27.2, 27.3 -->

## How ions move through a solid

In every material so far, the mobile species has been an electron or a hole.
In this module the lattice itself conducts: whole ions migrate through the
solid. That single change gives batteries, fuel cells, gas sensors and
resistive memory, and it also gives one of the more persistent failure
mechanisms in microelectronics.

Ionic conduction requires the same two ingredients as any transport: mobile
carriers, and a path. Both come from **point defects**, and the connection back
to module 21 is direct.

**Defect chemistry sets the carrier concentration.** In an ionic crystal,
defects come in charge-balanced pairs. A **Schottky defect** is a cation
vacancy plus an anion vacancy, preserving stoichiometry. A **Frenkel defect**
is an ion displaced from its site into an interstitial position, leaving a
vacancy behind. Their equilibrium concentrations are thermally activated, so
carrier density rises exponentially with temperature. This is **intrinsic**
defect formation.

Far more useful in practice is **extrinsic** defect formation by aliovalent
doping. Replace some of a host cation with one of lower valence and charge
neutrality forces the crystal to create compensating vacancies. The standard
example is zirconia: substituting yttrium (valence 3) for zirconium (valence 4)
requires one oxygen vacancy for every two yttrium ions. Those vacancies are the
oxygen conduction path, and their number is fixed by the dopant level rather
than by temperature. Yttria-stabilized zirconia is therefore an oxygen
conductor by design, and its conductivity is controlled by composition.

**Migration is hopping over a barrier.** An ion moves by jumping into an
adjacent vacancy, or from one interstitial site to the next, and it must pass
through a saddle point where the surrounding lattice squeezes it. The
conductivity is therefore Arrhenius:

    sigma * T = A * exp(-Ea / kT)

Note the temperature prefactor, which comes from the Nernst-Einstein relation
between diffusivity and mobility and is the conventional form for ionic
conductors. Activation energies are typically 0.5 to 1.5 eV, which is why most
ionic conductors need heat: an oxide fuel cell electrolyte that is excellent at
800 degrees C may be useless at 200.

The design levers follow directly from the mechanism:

- **Make the mobile ion small and low in charge.** Lithium and hydrogen move
  easily; multivalent ions are held much harder by the lattice they pass
  through, which is a large part of why magnesium and aluminium batteries have
  been so much harder than lithium ones.
- **Open the structure.** Channels, layers or a large free volume lower the
  saddle-point energy.
- **Provide plenty of vacant sites.** A structure where the mobile ion has more
  available sites than ions to fill them conducts far better than a fully
  occupied one.
- **Flatten the energy landscape.** The best conductors have many
  nearly-equivalent sites with low barriers between them, so no site is a deep
  trap.

## Fast ion conductors

A **fast ion conductor**, or solid electrolyte, is a material in which one ionic
species moves so freely that its conductivity approaches that of a liquid
electrolyte, typically 10^-3 to 10^0 siemens per centimetre, while the material
remains a rigid solid and an electronic insulator. The usual description is that
one sublattice is effectively molten while the other stays crystalline.

The important families, organized by what moves:

**Oxygen ion conductors.** Yttria-stabilized zirconia is the workhorse, used in
solid oxide fuel cells and in the exhaust-gas oxygen sensor fitted to virtually
every petrol engine. Doped ceria conducts better at lower temperature but
becomes partly electronically conducting under reducing conditions, which is a
problem discussed in the next section. Lanthanum gallate perovskites are a
lower-temperature alternative (module 57).

**Lithium ion conductors.** The target for solid-state batteries. Sulphide
glasses and argyrodites reach conductivities comparable to liquid electrolytes
at room temperature but are chemically fragile and react with moisture to
release hydrogen sulphide. Oxide garnets are chemically robust and stable
against lithium metal but harder to densify and to interface. Polymer
electrolytes are easy to process and too resistive at room temperature. No
single material yet has conductivity, stability, mechanical compliance and
manufacturability together, which is the honest state of solid-state batteries.

**Silver and copper ion conductors**, which include some of the highest room-
temperature ionic conductivities known and are the basis of conductive-bridge
resistive memory, where a metallic filament is grown and dissolved across a
solid electrolyte to switch resistance.

**Proton conductors**, in hydrated polymers for low-temperature fuel cells and
in doped perovskite oxides for intermediate-temperature devices.

**Sodium ion conductors**, notably beta-alumina, whose layered structure gives
two-dimensional sodium conduction and which made the sodium-sulphur battery
possible.

The measurement problem is worth flagging. A polycrystalline ionic conductor
usually has a grain boundary resistance that dominates the total, sometimes by
orders of magnitude, because the boundary has a different composition and a
space charge that depletes the mobile carrier. Quoting a bulk conductivity from
a two-point DC measurement on a pellet therefore reports the boundaries, not the
material. Impedance spectroscopy (module 26) separates the two arcs and is
mandatory rather than optional here.

## Mixed ionic and electronic conduction

Many materials conduct both ions and electrons, and whether that is a feature or
a fault depends entirely on the application.

**Where it is a fault.** An electrolyte must conduct ions and block electrons.
Any electronic conductivity is an internal short: it lets current bypass the
external circuit, lowering the open-circuit voltage and wasting fuel. The
figure of merit is the **transference number**, the fraction of total
conductivity carried by the intended ion, and an electrolyte wants it above
about 0.99. Doped ceria illustrates the problem: under the reducing conditions
at a fuel cell anode, cerium is partially reduced from the 4+ to the 3+ state,
the released electrons make the material electronically conducting, and the
efficiency falls. This is exactly why yttria-stabilized zirconia, with worse
conductivity but a stable cation, has held its position.

**Where it is essential.** A battery or fuel cell **electrode** must do the
opposite: conduct ions in from the electrolyte and electrons out to the current
collector, at the same place, at the same time. A material that does both is a
mixed ionic-electronic conductor, and using one removes the need for a
composite of separate ion and electron paths. Perovskite oxides such as the
lanthanum strontium cobalt ferrites are used as fuel cell cathodes for exactly
this reason: oxygen can be reduced anywhere on the surface rather than only at
the three-phase boundary where electrolyte, electrode and gas meet, which
increases the active area enormously.

Lithium battery cathode materials are also mixed conductors by necessity,
since lithium must intercalate into the structure while electrons arrive
through it. Their limitation is usually electronic rather than ionic, which is
why carbon coatings and conductive additives are standard.

**Where it is the whole device.** In resistive switching memory (module 47's
neighbours in the memory landscape), ionic motion under bias creates or
dissolves a conducting filament, deliberately converting an insulator into a
conductor and back. The material is designed to switch between mixed and
insulating behaviour, and the endurance limit is set by how many times the
lattice tolerates the ionic rearrangement.

Measuring the split between ionic and electronic conduction is done by
**blocking-electrode methods**: an electrode that blocks ions but passes
electrons, held under DC bias, will pass an initial total current that decays to
the purely electronic value as ions pile up and stop moving. The ratio of the
final to the initial current gives the electronic transference number directly.
This experiment, sometimes called the Hebb-Wagner method, is the standard way to
qualify an electrolyte, and it is a good illustration of a general principle
from module 26: to separate two parallel conduction mechanisms, find a boundary
condition that stops one of them.

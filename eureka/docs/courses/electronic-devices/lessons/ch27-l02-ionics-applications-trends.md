# Applications of Solid-State Ionics, and Where the Field Is Heading

<!-- covers: 27.4, 27.5 -->

## Batteries, sensors and fuel cells

Solid-state ionics is unusual among the topics in this course in that its
applications are mostly outside the chip. They are worth knowing anyway,
because electronics increasingly ships with them attached.

**Lithium-ion batteries.** The working principle is intercalation: lithium ions
shuttle between two host structures that accept them without being destroyed.
On discharge, lithium leaves the graphite anode, travels through the
electrolyte, and inserts into the metal oxide cathode, while the electron takes
the external circuit. Charging reverses it. The reason this chemistry won is
that both electrodes are reversible hosts, so the cell survives thousands of
cycles rather than being consumed.

The materials problem set is instructive because each component has a different
binding constraint:

- The **cathode** trades energy density against stability and cost. Layered
  nickel-manganese-cobalt oxides give high capacity and release oxygen when
  overheated; iron phosphate gives lower voltage and capacity with far better
  thermal stability and no cobalt. That is a safety-versus-energy choice, not a
  ranking.
- The **anode** is usually graphite, which is stable but limited in capacity.
  Silicon holds roughly ten times more lithium per gram and swells by around
  300 percent doing it, which pulverizes the particle and tears the electrode
  apart. Silicon is therefore used as a small additive or as engineered
  nanostructures with room to expand, and getting past a modest fraction is an
  unsolved manufacturing problem rather than a chemistry one.
- The **electrolyte** in commercial cells is a liquid, and it is flammable.
  Replacing it with a solid is the main thrust of current work, for safety and
  because a solid electrolyte might enable a lithium metal anode. The obstacles
  are the ones from the previous lesson: no single solid has conductivity,
  chemical stability, mechanical compliance and manufacturability together, and
  the interface between a rigid electrolyte and an electrode that changes
  volume every cycle is a mechanical problem as much as an electrochemical one.
- The **interphase**, a thin passivating layer that forms on the anode during
  the first cycles, is what makes the whole system work: it conducts lithium
  and blocks electrons, so the electrolyte stops decomposing. Its composition
  and stability largely determine calendar life. It is also the least
  controllable part of the cell.

**Gas sensors.** The oxygen sensor in an engine exhaust is a zirconia tube with
porous platinum electrodes. Different oxygen partial pressures on the two sides
produce a voltage given by the Nernst equation, and because that voltage depends
on the *logarithm* of the ratio, it swings sharply as the mixture crosses
stoichiometric. That sharp transition is what makes closed-loop fuel control
possible, and it is a rare case of a material property translating directly
into a control signal. Related devices measure carbon dioxide, hydrogen and
nitrogen oxides using other mobile ions.

A different sensing family uses **conductivity change** rather than
electrochemical potential: a semiconducting metal oxide such as tin dioxide
changes its resistance when a reducing gas adsorbs and reacts with surface
oxygen. These are cheap and sensitive and notoriously unselective, which is why
they are deployed as arrays with pattern recognition rather than as single
elements. Module 53 covers the organic counterparts.

**Fuel cells.** A solid oxide fuel cell oxidizes fuel electrochemically rather
than by combustion, so it is not limited by the Carnot efficiency of a heat
engine. Oxygen is reduced at the cathode, oxygen ions migrate through the
electrolyte, and they oxidize fuel at the anode. Efficiencies above 60 percent
electrical are achievable, and higher in combined heat and power.

The materials constraints are severe and they are all thermomechanical. The
electrolyte needs adequate conductivity, which forces temperatures of 700 to
1000 degrees C for zirconia. At that temperature every component must be
chemically stable in both oxidizing and reducing atmospheres, must not react
with its neighbours, and must have a matched thermal expansion coefficient, or
thermal cycling delaminates the stack. The interconnect that joins cells in
series must conduct electronically, resist oxidation, and match expansion too.
Lowering the operating temperature is the central goal of the field precisely
because it relaxes all of these at once, and module 57 covers the perovskite
oxides being developed for it.

**Electrochromic devices**, where ion insertion changes optical absorption, are
the same physics applied to windows and displays: apply a voltage, drive
lithium into tungsten oxide, and it darkens. The switching speed is set by
ionic conductivity and diffusion length, which is why large windows switch in
minutes rather than milliseconds.

## Where solid-state ionics is heading

Four directions are worth tracking, stated with what would actually count as
progress rather than as aspirations.

**Solid-state batteries.** The prize is a lithium metal anode, which would raise
energy density substantially, with a non-flammable electrolyte. The obstacles
are concrete: lithium dendrites can grow through grain boundaries and cracks in
a ceramic electrolyte and short the cell, so mechanical strength alone does not
stop them; the electrode-electrolyte interface must stay in contact through
volume changes every cycle; and sulphide electrolytes need dry-room processing
because they hydrolyse. Progress will look like cells that survive hundreds of
cycles at practical current density and areal capacity, not like conductivity
records on pellets.

**Lower-temperature fuel cells and electrolysers.** Proton-conducting oxides
and thin-film electrolytes both aim to cut the operating temperature into the
400 to 600 degrees C range, which would allow cheaper interconnects and faster
start-up. The same stacks run in reverse as electrolysers to make hydrogen,
which has made this an energy-storage topic as well as a power-generation one.

**Ionic devices for computing.** Resistive and conductive-bridge memories move
ions to switch resistance, and the same mechanism, run in an analogue rather
than binary fashion, gives a device whose conductance can be tuned in small
increments. That is an attractive primitive for in-memory computing and neural
network accelerators, because a crossbar of such devices performs a
matrix-vector multiplication in one step, in the analogue domain, where the
data already are. The honest status is that endurance, variability from device
to device and cycle to cycle, and the difficulty of programming an exact
conductance are all unresolved, and they are the reasons this has not displaced
digital accelerators. Related **electrochemical transistors** use ion insertion
to modulate a channel, which is slower than a field effect but gives
non-volatile analogue states.

**Iono-electronics and bioelectronics.** Devices that translate between ionic
signals, which is what biology uses, and electronic ones. Mixed conducting
polymers are the natural interface material here, and the application space is
sensors and neural interfaces rather than computing.

The connecting theme with the rest of this course: ionic conduction is
diffusion (module 22) driven by a field, in a material whose defect chemistry
(module 21) sets the carrier concentration, measured by impedance spectroscopy
(module 26), and limited in practice by grain boundaries and interfaces (module
24). It is the same physics wearing different clothes, and recognizing that is
worth more than memorizing the material families.

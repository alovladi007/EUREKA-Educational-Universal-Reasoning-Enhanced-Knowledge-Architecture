# Wide-Bandgap II-VI Semiconductors

<!-- covers: 32.1, 32.2, 32.3, 32.4 -->

## Crystal structure and properties

The wide-gap II-VI compounds are zinc and cadmium combined with sulphur,
selenium or tellurium, plus zinc oxide, and they occupy a peculiar place in the
history of this field: they were expected to be the blue light emitters and
they lost that role to the nitrides, while finding several other jobs they do
better than anything else.

**Structure.** Most crystallize in either the cubic zinc blende structure or
the hexagonal wurtzite structure, and many can adopt either, with a small
energy difference between them. That near-degeneracy is a problem in itself: it
makes **stacking faults** cheap to form, since a stacking fault is locally a
slab of the other structure. Growth conditions therefore have to be controlled
tightly enough to select a single polytype, and residual stacking faults are a
persistent defect in these materials.

**Bonding.** The bond is substantially more ionic than in the III-V compounds
and much more so than in silicon. The consequences run through everything:

- Wider bandgaps, from about 2.25 eV for zinc telluride through 2.7 eV for zinc
  selenide to 3.4 eV for zinc oxide and 3.7 eV for zinc sulphide, all direct,
  which is why they were attractive for visible emission.
- Softer mechanical properties and lower thermal conductivity than the
  covalent semiconductors, so they are easier to damage and harder to cool.
- Strong ionic and piezoelectric response, which zinc oxide exploits in
  acoustic devices.
- Strong exciton binding, particularly in zinc oxide at about 60 meV, well
  above room-temperature thermal energy. That means excitons survive at room
  temperature, which is an attractive property for efficient emission and one
  reason interest in zinc oxide persisted for so long.

**The doping problem.** This is the defining difficulty and it is worth
understanding as a general principle rather than a quirk. Wide-gap ionic
semiconductors resist being doped in one polarity, usually p-type, because the
crystal responds to the introduction of acceptors by spontaneously generating
compensating native donors. Thermodynamically, when the Fermi level moves
toward the valence band the formation energy of a donor-like native defect,
typically an anion vacancy, drops, so the crystal creates them until the Fermi
level is pinned. This is **self-compensation**, and it scales with gap width,
which is exactly why it bites hardest in the materials whose wide gap made them
interesting.

Zinc selenide could be doped n-type easily and p-type only with difficulty and
instability. Zinc oxide has the same asymmetry and, despite decades of effort
and many claimed results, reproducible, stable, useful p-type zinc oxide is
still not established. This is a case where honest reporting matters: the
literature contains many p-type zinc oxide claims and few that have been
independently reproduced and shown to be stable.

The contrast with gallium nitride is the instructive part. Nitride p-type
doping was also thought impossible, and it turned out that magnesium acceptors
were being passivated by hydrogen (module 22) rather than compensated by native
defects, and that a post-growth anneal or electron irradiation removed the
hydrogen and activated them. The difference between a passivation problem, which
has a process fix, and a genuine self-compensation problem, which does not, is
what decided which material family got the blue LED.

## Epitaxial growth routes

**MBE** dominates research work. Low growth temperature limits interdiffusion,
elemental sources give clean chemistry, and in-situ diffraction monitoring
allows the polytype and surface reconstruction to be controlled during growth.
For zinc selenide on gallium arsenide, the lattice mismatch is small, about 0.3
percent, which is a rare and convenient match and was one reason that system
received so much attention.

**MOVPE** is used where throughput matters, particularly for zinc oxide films.
The chemistry is complicated by the tendency of the metal-organic precursors to
react with the oxygen or chalcogen source before reaching the substrate, so
reactor design is dominated by suppressing that.

**Sputtering and pulsed laser deposition** are widely used for zinc oxide films
in applications that need a good film rather than a device-grade epitaxial
layer: transparent electrodes, piezoelectric layers for acoustic resonators, and
thin-film transistor channels. These are covered as thin-film processes in
module 44.

**Chemical bath and spray methods** deposit cadmium sulphide cheaply over large
areas. This is how the window layer of a cadmium telluride thin-film solar cell
is made, and the fact that a cheap, low-temperature solution process gives an
adequate layer is exactly why that cell type is economic.

The recurring growth issue across all routes is **defect generation at the
interface with a foreign substrate**, since native substrates for these
materials are scarce and expensive. Zinc oxide bulk crystals can be grown
hydrothermally, and zinc selenide by vapour transport, but neither is available
at the size and price that would make homoepitaxy routine.

## Bulk crystal growth

Bulk wide-gap II-VI crystals are grown by three main routes, all limited by the
same physics: these materials sublime rather than melt conveniently, and their
constituents are volatile.

**Physical vapour transport**, where the compound sublimes at one end of a
sealed ampoule and condenses on a seed at the other. This is the standard route
for zinc selenide and zinc sulphide, giving crystals of moderate size over long
growth runs.

**Hydrothermal growth** for zinc oxide, in an alkaline solution under pressure
in an autoclave, over weeks. It gives the highest structural quality zinc oxide
available, with the drawback of incorporating alkali metals from the solvent
and being slow.

**Melt growth under high pressure**, which suppresses decomposition. It is
possible for some of these materials and requires equipment capable of holding
tens of atmospheres at over 1500 degrees C.

The practical outcome is that bulk wide-gap II-VI substrates are small,
expensive, and available only in limited orientations. This is a self-reinforcing
problem: without cheap substrates there is no volume market, and without a
volume market nobody invests in scaling substrate production.

Two applications keep bulk growth of related materials alive. **Cadmium zinc
telluride** is grown in bulk both as an MCT substrate (module 31) and as a
room-temperature gamma-ray and x-ray detector in its own right, where its high
atomic number and wide gap allow spectroscopy without cooling. Its persistent
problem is tellurium inclusions and non-uniform charge collection, which limits
detector size and yield. **Scintillator and phosphor materials** in this family
are grown for radiation detection and display applications.

## Where wide-gap II-VI materials stand

An honest assessment, since this is a family whose promise and delivery
diverged sharply.

**Lost.** The visible light emitter market. Zinc selenide laser diodes were
demonstrated and had short lifetimes because dislocations multiplied under
operation, a degradation mechanism the softer, more ionic lattice made
unavoidable. Gallium nitride took the market and kept it.

**Not settled.** p-type zinc oxide, and therefore the zinc oxide homojunction
LED. Effort continues; the honest position is that no reproducible, stable
result has been established, and claims should be read with the reproducibility
question in mind.

**Won, and often invisibly.** Several roles where these materials are the
standard choice and nobody talks about it:

- **Zinc oxide as a piezoelectric film** in bulk and surface acoustic wave
  devices, which are in every phone as radio-frequency filters.
- **Zinc oxide and related oxides as transparent conductors and as thin-film
  transistor channels.** The amorphous indium gallium zinc oxide channel now
  used in high-resolution and OLED displays is a member of this family, and its
  combination of good mobility, low leakage and low-temperature deposition is
  what made large high-refresh displays practical. Module 56 covers the
  transparent conductor side.
- **Cadmium sulphide and cadmium telluride in thin-film photovoltaics**, which
  is one of the few thin-film cell technologies to reach large-scale
  manufacture, on cost rather than efficiency grounds.
- **Cadmium zinc telluride in room-temperature radiation detectors**, for
  handheld isotope identification and medical imaging.
- **Zinc sulphide as an infrared window material**, and as the host for
  electroluminescent phosphors.
- **Zinc oxide varistors**, where the grain boundaries provide a strongly
  nonlinear current-voltage characteristic that clamps surge voltages. Almost
  every mains surge protector contains one, and the device works because of
  grain boundary barriers rather than in spite of them, which is an
  unusual and satisfying inversion of the usual attitude to boundaries.

The lesson to carry forward is that a material family that fails at its headline
application can still be indispensable. Judging these materials by whether they
became the blue LED misses most of what they actually do.

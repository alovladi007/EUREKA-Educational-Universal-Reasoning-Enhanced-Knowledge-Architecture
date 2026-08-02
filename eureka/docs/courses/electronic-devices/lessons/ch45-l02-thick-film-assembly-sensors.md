# Thick-Film Components, Assembly and Sensors

<!-- covers: 45.4, 45.5 -->

## Components and assembly

A fired thick-film substrate is a circuit board with printed passives on it.
Turning it into a working module requires attaching components and connecting to
the outside world, and the choices there are dictated by the same thermal and
mechanical constraints as everywhere else in this course.

**Printed components.** Resistors and their trimming were covered in the previous
lesson. Capacitors can be printed as conductor-dielectric-conductor sandwiches,
with values limited to the picofarad range by achievable permittivity and area,
so they suit radio-frequency tuning rather than bulk decoupling. Printed
inductors are spirals or transmission-line structures, again suiting
high-frequency use. The advantage of printing a passive rather than mounting one
is elimination of a solder joint, and solder joints are the dominant failure
mode of assemblies, so this is a reliability argument as much as a cost one.

**Attaching discrete components.**

*Soldering*, using conventional surface-mount reflow onto the printed conductor
pads. The conductor paste must be **solderable** and must resist **leaching**,
which is the dissolution of the printed conductor into molten solder. Silver
dissolves readily in tin-based solders, which is another reason for
palladium-silver: the palladium slows the dissolution.

*Conductive adhesive*, a filled epoxy that cures rather than melts. It is used
where the thermal budget cannot tolerate reflow, where the substrate or component
is temperature-sensitive, and where lead-free solder's higher reflow temperature
would be a problem. Module 54 covers the material.

*Wire bonding* directly from a bare die to a printed gold pad, which is standard
in hybrid modules. This requires a gold conductor and a surface finish that
bonds reliably.

*Die attach* by solder, silver-filled epoxy, or sintered silver. Sintered silver
is worth naming: silver nanoparticle paste applied under modest pressure and
temperature sinters into a joint that then has the melting point of bulk silver,
around 960 degrees C. That gives a die attach that can operate far hotter than
any solder, which is what wide-bandgap power modules need.

**Hybrid circuits.** The combination of a thick-film substrate carrying printed
passives, bare semiconductor dies wire-bonded to it, and discrete components
soldered on, all encapsulated, is a hybrid microcircuit. Hybrids dominate where
the requirement is a small number of parts operating reliably in a hard
environment rather than a large number of transistors: automotive engine and
transmission controllers, aerospace and defence modules, medical implants,
industrial sensor conditioning, and high-power radio-frequency amplifiers.

**Interconnection to the outside.** Pins brazed or soldered into the substrate,
flexible circuit tails bonded on, or edge connectors. Each is a mechanical joint
between materials with different expansion coefficients, which is where thermal
cycling failures concentrate.

**Reliability considerations**, which are the reason thick film persists in harsh
environments:

- **Thermal cycling** drives fatigue in every joint. Matching expansion
  coefficients across the substrate, the attach material and the component is the
  primary design discipline, and it is why aluminium nitride, with expansion close
  to silicon, is used for power modules despite its cost.
- **Humidity** drives silver migration and corrosion, addressed by overglaze and
  encapsulation.
- **Vibration and shock** favour printed passives and adhesive attach over tall
  soldered components with long lever arms.
- **Temperature range.** A fired ceramic thick-film circuit operates from
  cryogenic temperatures to above 300 degrees C, far beyond what an organic
  circuit board tolerates. This is the single property that keeps the technology
  alive in automotive under-hood and downhole drilling applications.

## Thick-film sensors

Thick-film technology turns out to be an excellent sensor platform, and the
reason is worth understanding: sensing usually requires exposing a functional
material to the environment, and a fired ceramic film is chemically stable,
mechanically robust, thermally tolerant, and cheap to print in patterns. Those
are exactly the properties a sensor needs and a thin film often lacks.

**Strain gauges and pressure sensors.** A printed resistor's resistance changes
when the substrate beneath it flexes, partly through geometry and partly through
the piezoresistive response of the conductive network. Printing four resistors in
a Wheatstone bridge on a ceramic diaphragm gives a pressure sensor that is
robust, works over a wide temperature range, and survives media that would
destroy a silicon sensor. Gauge factors are lower than single-crystal silicon's,
typically around 10 against silicon's 100 or more, and the robustness usually
wins in industrial and automotive applications.

**Temperature sensors.** Printed platinum resistance thermometers, exploiting
platinum's stable and nearly linear temperature coefficient. Thick-film platinum
RTDs are the standard industrial temperature sensor, made in enormous volumes,
because printing and trimming gives the required tolerance at a fraction of the
cost of wire-wound elements.

**Gas sensors.** A printed semiconducting metal oxide, usually tin dioxide, on a
substrate with a printed heater on the reverse. Adsorbed oxygen on the oxide
surface traps electrons and raises resistance; a reducing gas reacts with that
oxygen, releases the electrons and lowers resistance. The printed heater holds
the element at its operating temperature of 200 to 400 degrees C, which is
necessary for the surface chemistry and which the ceramic tolerates without
difficulty.

These sensors are cheap and sensitive and notoriously **unselective**: almost any
reducing gas produces a response. The practical answers are to operate an array
of elements with different oxide compositions, dopants and temperatures and to
classify the pattern, and to modulate the heater temperature and use the
time-resolved response as a fingerprint. Module 53 covers the organic sensing
materials that address selectivity differently.

**Humidity sensors** using a printed porous ceramic or polymer whose impedance
changes with adsorbed water.

**Electrochemical sensors**, including the printed reference and working
electrodes of disposable biosensors. The single largest example is the blood
glucose test strip, which is a screen-printed electrode system on a plastic or
ceramic backing with an enzyme layer, manufactured in billions of units annually.
That is a thick-film product, and it is a good corrective to any impression that
this is an obsolete technology.

**Heaters and thermal management elements**, printed resistive heaters used both
as functional heaters and as part of thermal flow sensors, where a heater and two
temperature sensors measure flow by how the heat is carried downstream.

**Piezoelectric transducers**, printing PZT thick films (module 42) for
ultrasonic and actuator applications where the thickness suits the acoustic
frequency better than a thin film would.

## Where thick film fits

A summary judgement, since this technology sits oddly against the rest of the
course.

Thick film wins where the requirement is **robustness, temperature range,
integrated passives, and low tooling cost at moderate volume**, and where feature
sizes of about 100 micrometres are acceptable. That covers automotive,
industrial, aerospace, medical, power modules, sensors and radio-frequency
modules. It loses wherever density or transistor count matters, which is why it
is invisible in consumer computing.

The intellectual point worth taking from it is about **percolation as a design
tool**. A thick-film resistor works because a conductive phase is dispersed just
above its percolation threshold in an insulating matrix, and its resistance,
temperature coefficient, noise and voltage coefficient all follow from where it
sits relative to that threshold. The same physics appears in conductive
adhesives (module 54), in conductive polymers (module 52) and in the
effective-medium treatment of module 18. Thick film is where that physics is
used most deliberately and at the largest scale.

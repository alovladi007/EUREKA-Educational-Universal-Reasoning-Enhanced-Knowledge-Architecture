# Thick Films: Processing, Substrates and Materials

<!-- covers: 45.1, 45.2, 45.3 -->

Thick-film technology is the branch of electronics manufacturing that most
engineers never study and most products contain. It is screen printing plus
firing, it produces resistors, conductors, dielectrics and sensors on ceramic,
and it dominates applications where robustness, temperature tolerance and cost
matter more than density.

The name is misleading in the useful way: thick films are around 10 to 25
micrometres after firing, against the tens of nanometres of module 44. The
important distinction is not thickness but process. Thin films are deposited
atom by atom under vacuum; thick films are printed as a paste and fired.

## Thick-film processing

The sequence is short and each step matters.

**The paste.** A thick-film paste, or ink, has three components:

1. **The functional phase**, which provides the electrical property: metal
   powder for a conductor, a conductive oxide such as ruthenium dioxide for a
   resistor, a ceramic for a dielectric.
2. **The glass frit**, a low-melting glass powder that melts during firing, wets
   both the functional particles and the substrate, and binds everything
   together on cooling. The frit is what makes the film adhere, and its
   composition controls the firing temperature and the thermal expansion match.
3. **The organic vehicle**, a resin and solvent system that gives the paste the
   rheology needed for printing. It is entirely removed during firing.

The paste must be **thixotropic**: viscous at rest so it does not slump, and
shear-thinning under the squeegee so it flows through the screen. That
requirement alone is a significant formulation problem, and paste rheology is
the main determinant of print quality.

**Screen printing.** A stainless steel mesh screen carries an emulsion pattern
that blocks the areas not to be printed. The paste is forced through the open
areas by a squeegee onto the substrate below. Resolution is set by the mesh and
the emulsion, giving practical line widths of about 100 micrometres, with
finer possible using stencils rather than screens. This is a genuinely coarse
technology compared with lithography, and that is the point: it is fast, cheap,
requires no vacuum, and works on materials lithography cannot handle.

**Levelling and drying.** The printed pattern is left briefly so surface tension
smooths the mesh marks, then dried at around 150 degrees C to drive off solvent.

**Firing.** The piece passes through a belt furnace with a controlled profile,
typically peaking at 850 degrees C for about 10 minutes in air for standard
compositions. Three things happen: the organic vehicle burns out completely, the
glass frit melts and wets, and the functional phase sinters into a connected
network. The firing profile is as much a part of the material specification as
the paste, because the resulting microstructure, and therefore the resistance,
depends on peak temperature and time.

**Multiple layers.** Conductors, dielectrics and resistors are printed and fired
in sequence, so a multilayer circuit is built by repeated print-dry-fire cycles.
Each subsequent firing partly re-fires the layers beneath, which must therefore
be formulated to survive it.

**Trimming.** Fired resistors have a tolerance of perhaps 20 to 30 percent,
which is far too loose for most circuits. They are trimmed to value by cutting a
slot into the resistor with a laser while measuring resistance in real time,
stopping when the target is reached. Trimming can only increase resistance, so
pastes are chosen to fire low and are trimmed up. Achieving 0.1 percent tolerance
this way is routine, and this combination of a coarse deposition process with a
precise trimming step is characteristic of the technology.

**Low-temperature co-fired ceramic (LTCC)** is the sophisticated relative.
Instead of printing onto a fired substrate, conductors are printed onto unfired
ceramic tape, the tapes are stacked, laminated and co-fired once. The result is a
true three-dimensional ceramic module with buried conductors, vias, embedded
resistors and cavities. Because the firing temperature is around 850 degrees C
rather than the 1600 needed for alumina, silver and gold conductors can be
co-fired with it, which is why the low-temperature version exists. LTCC carries a
large amount of radio-frequency and microwave packaging, automotive electronics
and sensor modules.

## Substrates

The substrate is a structural, thermal and electrical component, not a passive
carrier.

**Alumina (96 percent)** is the default. It is cheap, mechanically strong,
thermally reasonable at about 25 W/(m K), an excellent insulator, chemically
stable, and its thermal expansion coefficient of about 7 ppm/K sits between
silicon's 2.6 and copper's 17. Higher-purity 99.6 percent alumina has a smoother
surface and better high-frequency loss and costs more.

**Aluminium nitride** has thermal conductivity of 150 to 180 W/(m K), an order of
magnitude above alumina, with an expansion coefficient of about 4.5 ppm/K, close
to silicon's. That combination makes it the substrate of choice for power
modules, where heat removal decides the rating. It costs several times more than
alumina and is harder to metallize.

**Beryllia** has even better thermal conductivity, and its dust is acutely toxic,
so it survives only in legacy and specialized applications with strict handling
requirements. This course does not treat its processing.

**Silicon carbide and boron nitride** for specific high-temperature and
high-thermal applications.

**Low-temperature co-fired ceramic tape** as both substrate and dielectric in
LTCC modules.

**Insulated metal substrates**, an aluminium or copper baseplate with a thin
dielectric layer and a copper circuit layer on top. Cheap, excellent heat
spreading, and limited to single-layer circuits. These carry most LED lighting
modules.

**Direct bonded copper**, thick copper bonded directly to a ceramic, used for
high-current power modules where the copper must carry hundreds of amps.

**Steel and glass** for enamelled substrates and for large-area printed
electronics.

The substrate selection criteria are, in order of how often they bind: thermal
conductivity against the power to be dissipated; expansion match to the
components attached, since mismatch drives thermal cycling failure (module 35);
dielectric loss at the operating frequency; mechanical strength and thickness;
and cost, which for high-volume products is usually decisive.

## Thick-film pastes and materials

**Conductors.** The choice is a compromise between conductivity, cost,
solderability and reliability.

- **Silver** is the cheapest good conductor and it **electromigrates** under bias
  in the presence of moisture, growing dendrites across insulating gaps and
  shorting them. This is a real field failure mode, and it is why pure silver is
  restricted to applications that stay dry or are well encapsulated.
- **Palladium-silver** alloys suppress the migration and cost more, and are the
  common general-purpose conductor.
- **Gold** for wire bonding pads and for high reliability, at high cost.
- **Copper**, with the best conductivity per unit cost, requiring firing in
  nitrogen because it oxidizes, which means the organic vehicle cannot burn out
  in air and the paste chemistry must be reformulated accordingly. Copper
  thick-film systems are therefore a distinct and less convenient process family.
- **Platinum-gold** and other combinations for specific solder and wire bond
  compatibility.

**Resistors** are the technology's most distinctive product. The functional phase
is usually ruthenium dioxide or a related ruthenate, dispersed in a glass matrix.
Conduction is by **percolation** through the connected network of conductive
particles (module 18), so sheet resistance is set primarily by the volume
fraction of the conductive phase. Standard paste series span roughly 10 ohms to
1 megohm per square in decade steps, and intermediate values are obtained by
blending adjacent pastes.

The properties that matter:

- **Temperature coefficient of resistance**, typically achievable within about
  100 parts per million per degree, and adjustable by formulation. Getting it
  near zero requires balancing the positive coefficient of the metallic
  conduction against negative contributions from the glass and the tunnelling
  barriers between particles.
- **Voltage coefficient and noise**, both of which arise from the tunnelling
  barriers and are worse at high sheet resistance, since higher resistance means
  a sparser network and more barriers.
- **Stability** against thermal cycling, humidity and time, which is why
  resistors are usually overglazed with a protective dielectric.

**Dielectrics** for crossovers, multilayer insulation and capacitors, formulated
to match the substrate's expansion coefficient and to be dense enough after
firing to be pinhole-free, which usually requires printing and firing two layers
rather than one.

**Overglaze** to protect the fired circuit from handling and humidity.

**Polymer thick films** are a lower-cost variant that cures at 150 degrees C
rather than firing at 850, using a polymer binder instead of glass frit. That
allows printing on plastic and on standard circuit board material. Conductivity
and stability are much lower, so they serve membrane switches, keypads,
flexible circuit jumpers and low-cost sensors rather than precision circuits.

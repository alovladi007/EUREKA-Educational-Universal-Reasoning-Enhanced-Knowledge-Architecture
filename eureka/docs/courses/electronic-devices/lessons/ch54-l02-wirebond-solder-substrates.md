# Wirebonds, Solder Interconnects and Package Substrates

<!-- covers: 54.4, 54.5, 54.6 -->

## Wirebond materials

Wire bonding connects the die's aluminium pads to the package leads with a fine
wire, 15 to 50 micrometres in diameter, welded at each end by a combination of
heat, pressure and ultrasonic energy. It is the oldest first-level interconnect
and it is still the highest-volume one by a wide margin, because it is cheap,
flexible and extremely well understood.

**Gold** was the standard for decades. It does not oxidize, so the bonding
surface is always clean; it is soft and ductile, so it deforms into a good weld;
and it forms a reliable ball when melted by an electrical flame-off. Its problem
is price, and when gold prices rose sharply the industry moved.

**The gold-aluminium intermetallic problem** deserves specific attention because
it is the classic packaging failure mechanism. A gold wire bonded to an aluminium
pad forms intermetallic compounds at the interface. Several phases can form, they
grow by diffusion at operating temperature, and they have different volumes from
the metals they consume. Two failures follow. **Kirkendall voiding** occurs
because gold and aluminium diffuse at different rates, so vacancies accumulate on
one side and coalesce into voids that weaken the joint. And the intermetallic
phases are brittle. The visible result was historically called "purple plague"
after the colour of one of the phases, and the practical consequence is that
gold-aluminium bonds degrade with time at temperature, which is why bond
reliability is qualified by high-temperature storage testing.

**Copper** replaced gold for most high-volume work. It is far cheaper, it has
better electrical and thermal conductivity, and its intermetallics with aluminium
grow much more slowly, so joints are more stable at temperature. Its costs are
real: copper is harder than gold, so the bonding force required is higher and
**pad cratering**, meaning cracking of the dielectric under the pad, becomes a
risk, which is serious over low-k dielectric stacks (module 43). Copper also
oxidizes, so ball formation must be done under a forming gas cover. Palladium-
coated copper wire addresses the oxidation and improves corrosion resistance at
some cost.

**Silver** alloy wire is an intermediate option, softer than copper and cheaper
than gold.

**Aluminium** wire, usually as thicker wedge-bonded wire, is standard for power
devices, where cross-section matters more than fine pitch and where bonding
aluminium to aluminium avoids intermetallics entirely. In power modules the
dominant wirebond failure is **lift-off** driven by thermal cycling, since the
aluminium wire and the silicon die expand differently, and this is one of the two
main wear-out mechanisms of power modules.

**The pad side.** Bond pads are aluminium alloy, and the underlying structure
matters: pads over low-k dielectric need mechanical reinforcement, and the "bond
over active circuitry" arrangement, where the pad sits above functional circuits
rather than over blank silicon, requires careful stress analysis.

## Solder interconnects

Solder joins at both levels: flip-chip bumps between die and substrate, and
solder balls or leads between package and board.

**The lead-free transition and its consequences.** Tin-lead eutectic solder melts
at 183 degrees C, is metallurgically well behaved, and was displaced by
regulation. The replacement family is tin-silver-copper, melting around 217 to
221 degrees C. Everything downstream changed:

- **Reflow temperatures rose** by roughly 30 degrees C, stressing every polymer
  in the package and forcing reformulation of substrates and moulding compounds.
- **Wetting is poorer**, requiring more aggressive fluxes and tighter surface
  finish control.
- **Mechanical behaviour differs.** Lead-free joints are stiffer and stronger and
  transmit more stress into the die and its dielectric stack rather than
  absorbing it, which shifted some failures from the solder into the chip.
- **Tin whiskers** returned as a concern. Pure tin finishes spontaneously grow
  single-crystal filaments that can be millimetres long and can short adjacent
  conductors. Lead had suppressed the growth; its removal brought the phenomenon
  back, and mitigation now relies on nickel underlayers, matte rather than bright
  tin, annealing, and conformal coating. For high-reliability applications this
  is taken seriously enough that some sectors obtained exemptions from lead-free
  requirements.

**Intermetallics at the solder joint.** Solder wets a copper pad by reacting with
it, forming copper-tin intermetallic. A thin layer is necessary, since it is the
bond. A thick layer is a problem, since it is brittle and it consumes the copper.
The layer grows by diffusion during service, so joint reliability degrades over
time at temperature. **Nickel barriers** between the copper and the solder slow
the growth substantially and are standard in demanding applications.

**Electromigration in solder** becomes significant as bumps shrink and current
per bump rises. Current densities in fine-pitch flip-chip bumps now approach the
level where atoms are transported along the joint, thinning it on one side and
piling up on the other until it opens. Because it is a diffusion process driven by
current and accelerated by temperature (module 22), the lifetime models are
Black-equation-like and the design response is to limit current per bump, which
constrains how far bump pitch can shrink.

**Surface finishes** on the board and substrate pads determine solderability and
joint metallurgy: organic solderability preservative, immersion tin, immersion
silver, and electroless nickel with immersion gold, each with characteristic
advantages and characteristic defect modes. The nickel-gold finish's "black pad"
defect, a corrosion of the nickel that produces brittle joints, is a well-known
example of a finish process that fails invisibly and shows up as field failures.

**Alternatives to solder** at fine pitch: **copper pillar** bumps, where a
plated copper post with a small solder cap replaces the solder ball, giving
finer pitch, better electromigration resistance and better thermal conduction;
and **direct copper-to-copper hybrid bonding**, in which copper pads embedded in
dielectric are bonded directly to matching pads on another die with no solder at
all. Hybrid bonding reaches pitches of a few micrometres, an order of magnitude
finer than solder microbumps, and it is what makes the densest 3D stacking
possible. Its requirements are extreme surface flatness and cleanliness, since
the surfaces must be planarized to nanometre-scale roughness and joined without
particles.

## Package substrates

The substrate carries wiring from the die's fine pitch out to the board's coarse
pitch, and it is where most of the cost and much of the electrical performance of
a package sits.

**Organic laminate** is the mainstream. Glass-fibre-reinforced epoxy in a
build-up structure, with a rigid core and finer-pitch layers laminated on either
side, connected by laser-drilled microvias. It is cheap and it has three
weaknesses that increasingly bind: expansion mismatch to silicon, dimensional
instability as it absorbs moisture and as it warps, and a wiring pitch floor of
roughly 5 to 10 micrometres that limits how many connections a die can make.

**Silicon interposers** are the high-performance answer. A thin silicon wafer
with through-silicon vias and multiple layers of fine damascene copper wiring
made with normal semiconductor processes. Wiring pitch reaches sub-micrometre,
which is what allows the thousands of connections that high-bandwidth memory
needs, and the expansion coefficient matches the dies exactly since it is the
same material. The costs are the wafer, the through-via process and the assembly
yield, so interposers appear where bandwidth justifies them: graphics processors,
accelerators and network chips.

**Glass substrates** are the emerging middle option. Glass has an adjustable
expansion coefficient that can be formulated close to silicon's, excellent
dimensional stability and flatness, low electrical loss at high frequency, and it
can be made in large thin panels rather than round wafers, which is cheaper per
unit area. Through-glass vias and handling of thin brittle panels are the
engineering problems, and this has moved from research into early production.

**Ceramic substrates**, alumina and aluminium nitride, for hermetic, high-power
and high-reliability applications. Multilayer ceramic packages with co-fired
wiring (module 45) serve aerospace, defence and some high-power radio-frequency
products, at high cost.

**Leadframes**, stamped or etched copper alloy, for the large volume of
low-pin-count packages where a full substrate is unnecessary. Copper alloys are
chosen to balance conductivity, strength and expansion coefficient, and they are
plated for solderability and bondability.

**Moulded fan-out**, which dispenses with a substrate entirely: dies are placed
on a carrier, encapsulated in moulding compound to form a reconstituted wafer or
panel, and the redistribution wiring is built directly onto the die faces. This
removes the substrate cost and the substrate's electrical parasitics, and it
introduces die shift during moulding as a yield problem, since a die that moves
during encapsulation no longer aligns with the lithography that follows.

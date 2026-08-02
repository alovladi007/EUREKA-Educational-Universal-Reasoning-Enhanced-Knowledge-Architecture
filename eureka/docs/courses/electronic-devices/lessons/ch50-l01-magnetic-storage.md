# Magnetic Information Storage

<!-- covers: 50.1, 50.2, 50.3, 50.4 -->

Magnetic storage is the largest commercial application of the magnetism in module
20, and its history is an unusually clear sequence of materials problems each
solved just in time to expose the next.

## Magnetic recording technology

**The principle.** Data is stored as the magnetization direction of small regions
of a thin magnetic film on a spinning disc. A write head produces a localized
field that sets the direction; a read head senses the stray field at transitions
between oppositely magnetized regions.

**The recording trilemma** is the organizing constraint of the whole field, and
it is worth stating precisely because it drives every materials decision.

To store more data you must make the bits smaller. Three requirements then
conflict:

1. **Thermal stability.** A bit's magnetization must not flip spontaneously. The
   energy barrier is the anisotropy energy density times the volume, and it must
   exceed roughly 40 to 60 times kT for ten-year retention. Shrinking the volume
   therefore demands raising the anisotropy.
2. **Writability.** The write field must exceed the coercivity, which rises with
   anisotropy. But the maximum field a write head can produce is limited by the
   saturation magnetization of the best available soft magnetic pole material,
   and that has a hard physical ceiling of around 2.4 tesla for iron-cobalt
   alloys.
3. **Signal-to-noise ratio.** The read signal comes from many grains per bit, and
   the noise falls as the square root of the grain count, so each bit needs
   enough grains, which pushes grains smaller for a given bit size.

The three cannot be satisfied simultaneously beyond a point: smaller grains
demand higher anisotropy for stability, higher anisotropy demands a bigger write
field, and the write field is capped. This is the trilemma, and the history of
the field is a sequence of ways around it.

**Longitudinal to perpendicular recording.** Originally the magnetization lay in
the plane of the disc. Adjacent oppositely magnetized regions then face each
other with like poles, and their demagnetizing fields destabilize the bits, worse
as bits shrink. Switching to **perpendicular** magnetization, with the easy axis
normal to the film, inverts this: neighbouring bits are magnetically stabilizing
rather than destabilizing. Combined with a soft magnetic underlayer that acts as
a flux return path and effectively doubles the write field, perpendicular
recording extended areal density by roughly an order of magnitude. It required
new media with strong perpendicular anisotropy, based on cobalt-chromium-platinum
alloys with segregated oxide grain boundaries, and a redesigned single-pole write
head.

**Granular media engineering.** The recording layer is a film of magnetic grains
around 6 to 8 nm across, deliberately **decoupled** from one another by
non-magnetic oxide segregated at the grain boundaries. Decoupling matters because
if the grains were exchange-coupled, reversing one would drag its neighbours and
the transition between bits would be jagged, adding noise. Getting the
segregation right, meaning uniform grain size, uniform orientation and complete
magnetic isolation, is the central media materials problem.

**Read heads.** This is where spintronics (module 20) entered production.
Inductive read gave way to anisotropic magnetoresistance, then to giant
magnetoresistive spin valves, then to tunnelling magnetoresistance sensors with
magnesium oxide barriers. Each step increased the signal from a smaller bit, and
the transition from discovery to product was remarkably fast. Read head
sensitivity has repeatedly been the enabler that allowed the next density
increase.

**Energy-assisted recording**, the current answer to the trilemma. If the medium
is momentarily made easier to write, then very high anisotropy material can be
used for stability and still be written with an achievable field:

- **Heat-assisted magnetic recording** uses a laser delivered through a
  near-field optical transducer to heat a spot to near its Curie temperature,
  where coercivity collapses, writes it, and lets it cool. The medium is
  iron-platinum in its ordered tetragonal phase, which has anisotropy about an
  order of magnitude above the current alloys and is therefore stable at grain
  sizes of a few nanometres. The engineering difficulty is the near-field
  transducer, which must confine light to tens of nanometres while surviving the
  resulting temperature for years, and transducer reliability was the long pole.
- **Microwave-assisted magnetic recording** uses a microwave field at the
  ferromagnetic resonance frequency to drive the magnetization into large-angle
  precession, lowering the effective switching field.

**Shingled and two-dimensional recording** are geometric rather than materials
answers: overlapping tracks like roof shingles to increase track density at the
cost of requiring whole-band rewrites, and reading several tracks at once to
separate the signals computationally.

## Magnetic random-access memory

MRAM applies the same physics to a solid-state memory, and the device is the
magnetic tunnel junction of module 20: two ferromagnetic layers separated by a
thin magnesium oxide barrier, one layer pinned and the other free. Parallel
alignment gives low resistance, antiparallel high, and the ratio with crystalline
MgO barriers is several hundred percent, which is ample read margin.

**The writing problem and its solution.** Early MRAM wrote by passing current
through orthogonal conductor lines to generate a field at the selected cell. That
does not scale: the field from a wire falls with distance while the required
field rises as cells shrink, and half-selected neighbouring cells get disturbed.
**Spin transfer torque** removed the problem by writing through the junction
itself, with a spin-polarized current transferring angular momentum directly to
the free layer. Write current scales down with cell area, so the mechanism gets
better as cells shrink rather than worse. STT-MRAM is what made the technology
manufacturable.

**Perpendicular magnetic anisotropy** in the free layer, obtained from the
interface between the ferromagnet and the MgO barrier, further reduced switching
current and improved scalability.

**Spin-orbit torque** MRAM is the next step, generating the spin current in an
adjacent heavy-metal layer so that the write current does not pass through the
tunnel barrier. That separates the read and write paths, which improves both
speed and barrier endurance, at the cost of a three-terminal cell that is larger.

**Where MRAM actually fits.** It is non-volatile, writes in nanoseconds, endures
effectively unlimited cycles, and tolerates radiation and high temperature. It
is larger per bit than SRAM and DRAM and uses more write energy than SRAM. The
result is not the universal memory once predicted but a set of solid niches:
embedded non-volatile memory replacing flash in microcontrollers, particularly
automotive and industrial where flash is hard to scale in advanced logic
processes; radiation-tolerant memory for space; and evaluation as a last-level
cache where non-volatility saves standby power.

## Extraordinary magnetoresistance

A different route to field sensing, notable because it uses no magnetic material
at all.

Take a high-mobility semiconductor and embed a metallic conductor in it, for
instance a metal disc at the centre of a semiconductor ring. With no magnetic
field, current flows preferentially through the low-resistance metal, so the
composite is a good conductor. Apply a magnetic field and the Lorentz force
deflects the current path in the semiconductor, at an angle set by the product of
mobility and field. At sufficient field the current is deflected around the metal
inclusion rather than through it, and the composite resistance rises enormously.

Because the effect depends on carrier mobility rather than on magnetic order, it
scales with the semiconductor's quality, and room-temperature resistance changes
of many thousands of percent have been reported in indium antimonide structures,
far exceeding what magnetoresistive materials achieve.

Its properties as a sensor: very large response, geometry-determined rather than
material-determined, no magnetic hysteresis since nothing is magnetized, and
excellent high-frequency response. Its limitations: it requires a
high-mobility narrow-gap semiconductor, which brings temperature sensitivity and
process incompatibility with silicon; the response is nonlinear and even in
field; and it needs a relatively large field to reach the interesting regime. It
has been explored for read heads and for magnetic sensing and has not displaced
the magnetoresistive devices, which is the honest status.

## Where magnetic storage is going

**Hard disc drives are not finished.** Their cost per bit remains several times
below flash and the gap has proved persistent. Energy-assisted recording has
reached production, and the roadmap continues. The market has shifted decisively
toward bulk and archival storage in data centres, with client devices moving to
flash, which is a change in role rather than a decline in relevance.

**Tape** persists and is growing for archives, because its cost per bit is lower
still and its areal density is far behind discs, which paradoxically means it has
a long runway of known improvements ahead.

**MRAM has found its place** as embedded non-volatile memory rather than as a
universal replacement.

**The interesting frontier** is using magnetic materials for computation rather
than storage: domain wall and skyrmion racetrack devices that move data along a
wire rather than moving a head over a disc, magnetic logic, and probabilistic
computing using deliberately unstable magnetic elements as tunable random bit
generators. These are research directions with real physics behind them and no
products, and they should be described that way.

The through-line worth carrying: magnetic storage has survived repeated
predictions of obsolescence by solving a sequence of materials problems, and each
solution came from a different area of this course. Perpendicular media is
anisotropy engineering, decoupled grains is microstructure control (module 44),
the read heads are interface spintronics (module 20), and heat-assisted recording
is a near-field optical and thermal engineering problem layered on top of an
ordered alloy phase transformation.

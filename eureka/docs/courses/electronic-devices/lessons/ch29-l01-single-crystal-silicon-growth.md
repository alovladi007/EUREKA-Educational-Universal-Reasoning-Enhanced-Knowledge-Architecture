# Growing Single-Crystal Silicon

<!-- covers: 29.1, 29.2, 29.3, 29.4 -->

## The silicon supply chain, end to end

Silicon wafer manufacture is the most refined materials process in existence,
and it is worth seeing whole before looking at any step, because each stage
exists to fix a problem created by the previous one.

The chain runs: quartz, to metallurgical-grade silicon, to a volatile silicon
compound, to purified polysilicon, to a single crystal, to a wafer, to an
epitaxial layer if required.

Purity improves by roughly nine orders of magnitude along that chain. Sand is
perhaps 99 percent silicon; metallurgical grade is 98 to 99 percent, meaning
about one percent impurities; electronic-grade polysilicon is better than
99.9999999 percent, one foreign atom per billion. Reaching that is the point of
the middle of the chain, and it is achieved chemically rather than physically,
because no physical purification is that effective.

The economics are equally worth noting: the substrate is a small fraction of
the cost of a finished chip, but a substrate defect can cost the entire chip,
so wafer specifications are tight out of proportion to their share of the bill
of materials.

## From quartz to polysilicon

**Reduction.** Quartz is reduced with carbon in an electric arc furnace to give
metallurgical-grade silicon at 98 to 99 percent purity. Most of this output goes
to aluminium alloying and to silicones, not to electronics, which means the
electronics industry is a minor customer of a large commodity process at this
stage.

**Chemical purification.** This is where the nine orders of magnitude are won.
The silicon is converted to a volatile compound, distilled repeatedly, and then
decomposed back to solid silicon. Distillation of a liquid or gas separates
species by boiling point far more effectively than any solid-state method, and
repeating it multiplies the separation. The decomposition step deposits silicon
onto heated seed rods inside a reactor, growing them over days into large rods
of high-purity polycrystalline silicon. Because the deposition is slow and
energy-intensive, this step dominates the cost and the energy budget of
polysilicon production, which is why alternative reactor designs, notably
fluidized beds that grow granules rather than rods, have been pursued for
decades.

The residual impurities that matter after this stage are boron and phosphorus,
because they are dopants and are not fully removed by the chemistry, and carbon,
because it comes from the reactor components. Their levels are what separates
electronics-grade from solar-grade material, and solar-grade specifications are
looser precisely because a solar cell tolerates more than a transistor does.

**Charging and doping.** The polysilicon is loaded into a fused quartz crucible
with a measured quantity of dopant, and melted at about 1420 degrees C under an
argon atmosphere.

## Czochralski and float-zone growth

**The Czochralski sequence.** A seed crystal of known orientation, usually
(100) for logic and (111) for some other applications, is lowered to touch the
melt surface, then withdrawn while rotating. Silicon freezes onto the seed and
the crystal grows at the meniscus.

The four stages of a run each solve something specific:

1. **Seeding.** Contact with the melt thermally shocks the seed and generates
   dislocations.
2. **Necking.** The crystal is pulled rapidly to a diameter of a few
   millimetres. Dislocations in silicon glide on inclined planes, so in a thin
   neck they run to the surface within a short distance and are eliminated.
   This is what makes the rest of the crystal dislocation-free, and it is a
   remarkable piece of engineering leverage: a few centimetres of thin neck
   supports a boule weighing hundreds of kilograms and containing no
   dislocations at all.
3. **Shouldering and body growth.** The pull rate is reduced to widen the
   crystal to its target diameter, then held under closed-loop control that
   watches the bright meniscus ring optically and adjusts pull rate and heater
   power.
4. **Tailing.** The crystal is narrowed gradually before separation, because
   an abrupt separation thermally shocks the crystal and sends dislocations
   back up into it.

Three control problems dominate the run, and all three were introduced earlier
in this course:

- **Oxygen.** The quartz crucible dissolves into the melt, delivering oxygen at
  around 10^18 per cubic centimetre. Some oxygen is beneficial, since it
  strengthens the wafer against thermal slip and provides internal gettering
  sites (module 21), and too much precipitates where it is not wanted. Oxygen
  content is controlled through crucible rotation, argon flow and pressure, and
  most powerfully through applied magnetic fields that damp the melt convection
  carrying oxygen from the crucible wall.
- **Dopant uniformity.** Segregation concentrates dopant in the melt as growth
  proceeds, so resistivity varies along the boule (module 22). Boron's
  segregation coefficient near 0.8 makes p-type boules relatively uniform;
  phosphorus, antimony and arsenic are worse. Continuous-feed and recharge
  Czochralski systems exist to hold the melt composition constant.
- **Point defects.** The ratio of pull rate to temperature gradient decides
  whether the crystal comes out vacancy-rich with voids, interstitial-rich with
  dislocation loops, or inside the defect-free window (module 21). Holding that
  ratio across a 300 mm radius for a run lasting a day or more is what hot-zone
  thermal design is for.

**Float zone.** A polysilicon feed rod is held above a growing crystal, with a
molten zone between them, heated by a radio-frequency coil and supported by
surface tension. The zone is passed along the rod. Because no crucible is
involved, oxygen is roughly three orders of magnitude lower than in Czochralski
material and metallic contamination is minimal, and because the zone segregates
impurities as it moves, the process purifies as it grows.

The consequences of low oxygen cut both ways: the material can reach very high
resistivity, thousands of ohm-centimetres, and it has excellent minority carrier
lifetime, but it is also mechanically weaker at temperature because it lacks
oxygen's pinning of dislocations, and it has no internal gettering. FZ silicon
therefore goes into power devices, radiation detectors and some radio-frequency
substrates, while CZ dominates everywhere else. Diameter is limited by what
surface tension can hold, so FZ wafers lag CZ in size.

Doping in float zone is done differently and rather elegantly for the highest
uniformity: **neutron transmutation doping** irradiates the crystal so that a
fraction of silicon-30 nuclei capture neutrons and transmute to phosphorus. The
dopant is therefore distributed as uniformly as the isotope was, which is
perfectly, with no segregation at all. It is used for high-power thyristors and
rectifiers where resistivity uniformity across a large-area device determines
whether the device shares current evenly.

## Newer approaches to silicon growth

Several developments are worth knowing, each aimed at a specific limitation.

**Magnetic field applied Czochralski**, in cusp, horizontal or vertical
configurations, damps convection in the conducting melt. This suppresses the
temperature oscillations that produce striations, and it reduces oxygen
transport from the crucible wall. It is now standard for large-diameter,
low-oxygen material.

**Continuous Czochralski**, where polysilicon is fed into the melt during
growth, holds the melt volume and composition constant. This flattens the axial
resistivity profile and improves crucible utilization, and it is used
particularly in solar-grade production where cost per kilogram dominates.

**Defect-engineered or perfect silicon**, meaning crystals grown entirely inside
the v/G window so that neither voids nor interstitial loops form anywhere across
the wafer. Achieving this at economic pull rates required detailed thermal
modelling of the hot zone and precise pull-rate profiling, and it is now a
standard product category rather than a research result.

**Large-diameter development.** The step from 200 to 300 mm delivered a
substantial cost reduction per device. The step to 450 mm was demonstrated
technically, and stalled, because retooling an entire fab is enormously
expensive and the remaining per-device saving did not justify it. This is a
useful reminder that materials progress is bounded by system economics, not
only by feasibility.

**Casting for photovoltaics.** Directional solidification in a large crucible
produces multicrystalline silicon ingots far more cheaply than Czochralski,
accepting grain boundaries in exchange. The resulting cells are a few
percentage points less efficient. Whether that trade is worth it has swung back
and forth with polysilicon prices, and the industry has more recently moved back
toward monocrystalline material as Czochralski costs fell, which is a good
example of a materials choice being decided by economics rather than by physics.

**Kerf-free wafering and thin substrates.** Sawing a boule into wafers destroys
roughly half the silicon as kerf. Techniques that cleave thin layers instead,
by implanting hydrogen to define a cleavage plane or by stress-induced
spalling, aim to eliminate that loss. The same implant-and-cleave technique is
what produces silicon-on-insulator wafers, where a thin silicon layer is
transferred onto an oxidized handle wafer, and that is now a mainstream
substrate rather than a specialty.

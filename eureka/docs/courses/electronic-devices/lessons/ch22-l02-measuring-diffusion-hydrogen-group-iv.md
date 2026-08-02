# Measuring Diffusion, Hydrogen, and Diffusion in Silicon and Germanium

<!-- covers: 22.5, 22.6, 22.7 -->

## Measuring a diffusion coefficient

A diffusion coefficient is extracted by making a profile and fitting it. The
methods divide into those that measure where the atoms are and those that
measure what the atoms are doing electrically, and the difference between the
two answers is itself informative.

**Secondary ion mass spectrometry** is the reference method for chemical
profiles. Sputter the sample with an ion beam, mass-analyse what comes off,
and plot concentration against depth. It reaches detection limits around 10^14
to 10^16 atoms per cubic centimetre depending on species, with depth
resolution of a few nanometres. It sees every atom of the element regardless
of whether it is electrically active, which is exactly what you want for a
diffusion measurement. Module 34 covers its artefacts, of which the important
ones here are the surface transient at the start of a profile and matrix
effects that shift the calibration between different host materials.

**Spreading resistance profiling** measures resistivity against depth on a
bevelled sample using a fine two-point probe. It gives the *electrically
active* carrier profile with wide dynamic range. Comparing it against SIMS on
the same sample separates active dopant from total dopant, which is how
clustering and incomplete activation are quantified.

**Capacitance-voltage profiling** gives the free carrier profile
non-destructively by sweeping a junction or Schottky depletion region through
the material. It is limited in depth by breakdown and in resolution by the
Debye length, which sets a floor of a few nanometres on how sharp a profile it
can resolve, so a genuinely abrupt junction always looks smeared.

**Radiotracer methods** use a radioactive isotope of the diffusing species and
serial sectioning. This is the classical high-accuracy technique, still the
reference for self-diffusion measurements where there is no chemical contrast
between the tracer and the host.

**Indirect and integral methods** infer D from something proportional to it:
sheet resistance against anneal time, junction depth against time, the shift
of a capacitance-voltage curve. These are fast and are what a production line
actually uses for monitoring, but they measure one number rather than a
profile and therefore cannot distinguish between the regimes of the previous
lesson.

Three cautions apply to all of them. First, a measured profile is the result
of the entire thermal history, including the ramp up and cool down, not only
the nominal soak. With modern short anneals the ramps often dominate. Second,
fitting a non-Fickian profile with a constant-D model returns an effective D
that is a meaningless average. Third, the surface is a special place:
segregation, oxidation and out-diffusion all act there, so the near-surface
part of a profile usually needs its own boundary condition rather than being
treated as data about the bulk.

## Hydrogen, the universal passivator

Hydrogen deserves its own section because it is everywhere, it moves fast, and
it changes electrical properties dramatically.

Hydrogen is the smallest atom, diffuses interstitially with a low barrier, and
is introduced by almost every process step: plasma deposition, wet chemistry,
annealing in forming gas, ion implantation, even ambient moisture. You do not
have to add it deliberately for it to be present.

What it does is **passivate dangling bonds**. A silicon atom missing a
neighbour has an unsatisfied bond that acts as an electrically active state in
the gap, capturing carriers and killing lifetime. A hydrogen atom bonds to it,
removes the state from the gap, and the defect stops being electrically
harmful. Three consequences follow, and they span very different technologies:

- **The silicon-dielectric interface.** A forming gas anneal, typically a few
  percent hydrogen in nitrogen at around 400 degrees C, reduces interface trap
  density by more than an order of magnitude. This step is universal in MOS
  processing and it is pure hydrogen passivation.
- **Amorphous silicon exists because of it.** Pure amorphous silicon has so
  many dangling bonds that it cannot be doped usefully. Hydrogenated amorphous
  silicon, a-Si:H, with 5 to 15 atomic percent hydrogen, has its defect density
  reduced by several orders of magnitude and becomes a usable semiconductor.
  Every thin-film transistor in a large display rests on this. Module 41
  covers it.
- **Dopant passivation, which is usually unwanted.** Hydrogen also binds to
  ionized dopants and neutralizes them. Hydrogen-boron pairs deactivate
  acceptors in silicon, so a plasma process can silently raise the resistivity
  of a p-type layer. The pairs dissociate on annealing above roughly 200
  degrees C, which is both the cure and the reason the effect is often missed:
  the wafer recovers before anyone measures it.

Hydrogen also has a dark side beyond deactivation. Hydrogen-passivated bonds
can be broken by hot carriers or by prolonged bias, releasing hydrogen and
regenerating interface traps. This is a leading model for negative bias
temperature instability, one of the main wear-out mechanisms of modern
transistors. The same bond that fixes the interface at manufacture is the bond
that breaks during the product's life. In amorphous silicon the analogous
process is the Staebler-Wronski effect of module 40.

Because hydrogen is mobile at low temperature, it can also redistribute during
storage and operation, meaning a hydrogen-related measurement made immediately
after processing may not describe the device a month later. Anyone
troubleshooting a drifting parameter should ask about hydrogen early.

## Diffusion in silicon and germanium

Group IV semiconductors are the best-characterized diffusion systems in
existence, because a fifty-year industry depended on getting them right.

**Silicon.** The dopants divide by mechanism and by speed:

- **Boron** (p-type) diffuses largely by the interstitialcy mechanism and is
  therefore strongly enhanced by implantation damage and by oxidation. It is
  the fastest of the common dopants, which makes shallow p-type junctions the
  hardest to form. The engineering answers have been low-energy implants,
  molecular implant species such as decaborane that decelerate the effective
  energy per atom, co-implantation of carbon or fluorine to trap
  interstitials, and millisecond anneals.
- **Phosphorus** (n-type) also has substantial interstitialcy character and
  shows the kink-and-tail profile of the previous lesson at high concentration.
  Its ability to inject interstitials while diffusing is used deliberately in
  phosphorus gettering, where a heavy surface phosphorus diffusion pulls
  metallic contamination out of the bulk. This is standard practice in solar
  cell manufacture.
- **Arsenic** (n-type) is slower and largely vacancy-mediated, with a large
  atom that produces abrupt profiles. That is exactly what a shallow source
  and drain wants, which is why arsenic rather than phosphorus is the usual
  n-type choice there. Its limitation is a solid solubility ceiling above
  which it forms inactive clusters.
- **Antimony** is slower still and used where minimal movement is required,
  such as buried layers that must survive a long subsequent epitaxial growth.
- **Transition metals** (iron, copper, nickel, gold) diffuse interstitially and
  are catastrophic. Copper can cross a 700 micrometre wafer in minutes at
  moderate temperature. They create deep levels that destroy minority carrier
  lifetime at concentrations of 10^11 per cubic centimetre, far below anything
  that affects doping. This asymmetry, harmless as a dopant but fatal as a
  lifetime killer, is why cleanroom metal contamination limits are quoted in
  atoms per square centimetre and why gettering strategies exist.

**Germanium** behaves differently in a way that mattered when germanium
returned to mainstream processing as a channel material. Dopant diffusion in
germanium is dominated by vacancies rather than interstitials, essentially the
mirror image of silicon. n-type dopants diffuse fast and have low solid
solubility, while p-type dopants are slower and better behaved. The practical
result is that forming shallow, heavily doped, low-resistance n-type contacts
in germanium is genuinely hard, and it is one of the main reasons germanium
p-channel devices arrived long before germanium n-channel ones.

In **silicon-germanium alloys** (module 38), diffusivities shift continuously
with composition, and the strain in a pseudomorphic layer changes them again,
since strain alters both point defect formation energies and migration
barriers. Boron diffusion is suppressed in compressively strained SiGe, which
is convenient because it is exactly where a heterojunction bipolar transistor
puts its base and where keeping boron in place is the whole design.

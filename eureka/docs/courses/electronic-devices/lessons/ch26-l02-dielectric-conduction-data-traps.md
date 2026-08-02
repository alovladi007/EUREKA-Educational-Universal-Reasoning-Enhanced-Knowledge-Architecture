# Conduction Inside a Dielectric, Data Presentation, and Measurement Traps

<!-- covers: 26.4, 26.5, 26.6 -->

## Charge transport inside a dielectric

An ideal insulator passes no current. Real ones do, and the mechanism matters
because each one has a different dependence on field, temperature and thickness,
and therefore a different implication for reliability.

**Ohmic conduction** from the small population of thermally generated free
carriers. Current is proportional to field, and the conductivity is thermally
activated. This dominates at low field in reasonably good insulators.

**Ionic conduction.** Mobile ions drift through the material. Distinguished
from electronic conduction by two signatures: it is much more strongly
temperature dependent, and it produces **polarization** at the electrodes,
because the ions accumulate there and cannot cross into the metal. That
accumulation shows up as a large low-frequency capacitance and as a current
that decays with time under constant bias. Sodium in gate oxides (module 22) is
the classic destructive case; in solid electrolytes (module 27) it is the
desired function.

**Schottky (thermionic) emission** over the barrier at the injecting contact.
The barrier is lowered by the applied field through the image force, so the
current depends on the square root of field in the exponent. Plotting
log(J) against sqrt(E) linearly, with a slope that gives a sensible dielectric
constant, is the identifying test. It is contact-limited, so it depends on
which metal is used.

**Poole-Frenkel emission**, the bulk analogue: carriers are thermally emitted
from traps within the material, with the trap barrier lowered by the field. It
has the same sqrt(E) form in the exponent but with twice the coefficient,
because the trap is a Coulomb centre with charge remaining behind rather than
an image charge. It is bulk-limited, so it is independent of the electrode
material, which is the practical way to tell the two apart: change the metal
and see whether the current changes.

**Fowler-Nordheim tunnelling** through a triangular barrier at high field. The
current depends exponentially on the reciprocal of the field, so a plot of
log(J/E^2) against 1/E is linear. This is the dominant leakage in thin gate
oxides above a few volts and is the mechanism used to program and erase flash
memory. The same electrons that write the cell also gradually damage the oxide,
which is why flash has a finite endurance.

**Direct tunnelling** through a barrier thinner than the depletion of the
triangular shape, roughly below 3 nm of silicon dioxide. It depends
exponentially on thickness and is essentially temperature-independent, which
is the giveaway. Direct tunnelling is why silicon dioxide gate dielectrics
could not be thinned further and why high-permittivity replacements were
adopted (module 43): a thicker physical layer with a higher permittivity gives
the same capacitance with exponentially less tunnelling.

**Space-charge-limited conduction** when injection is so efficient that the
injected charge itself limits the current. Current then follows a square law in
voltage and an inverse cube in thickness in the trap-free case. Because the
thickness dependence is so distinctive, this is a standard method for measuring
trap densities in organic semiconductors and other high-resistivity films.

**Breakdown** is the endpoint. In thin films the dominant model is
percolation: each stress event creates traps in the dielectric at random, and
when enough traps line up to form a conducting path from one electrode to the
other, the dielectric fails. This model predicts the observed statistics
correctly, in particular that thinner films have tighter distributions and that
the time to breakdown follows a Weibull distribution. It is the basis of gate
oxide reliability qualification, where a small sample is stressed at high field
and extrapolated to use conditions. That extrapolation depends on a
voltage-acceleration model, and choosing the wrong model is a well-known way to
be badly wrong about product lifetime.

Recognizing which mechanism you have is a matter of a few diagnostic plots:
J against V on log-log for power laws, log(J) against sqrt(E) for the barrier
mechanisms, log(J/E^2) against 1/E for Fowler-Nordheim, and the temperature and
electrode dependence to separate bulk from contact.

## Presenting dielectric data honestly

Dielectric data can be plotted in at least four equivalent representations, and
the choice determines what a reader sees. Being deliberate about this is a
matter of integrity as much as of clarity.

The four common representations are:

- **Permittivity**, epsilon_1 and epsilon_2 against frequency. Emphasizes
  polarization and relaxation. DC conduction appears as a divergence in
  epsilon_2 at low frequency that can swamp everything else.
- **Modulus**, the reciprocal of permittivity. Suppresses the electrode
  polarization and the DC conduction contribution, so it emphasizes the bulk.
  Useful when interfacial effects are drowning the signal you want.
- **Impedance**, plotted as imaginary against real in the complex plane. Each
  parallel resistor-capacitor element appears as a semicircular arc, so grain
  interior, grain boundary and electrode processes separate visually. This is
  the natural representation for ceramics and ionic conductors.
- **Conductivity**, sigma against frequency. Shows a DC plateau at low
  frequency and a power-law rise above a crossover frequency, which is the
  standard presentation for hopping conduction.

The honesty issue is that **the same data set looks like a different result in
each representation**, and it is possible to choose the one that makes a
material look best. A modulus plot can make an electrode-polarization artefact
disappear; a permittivity plot can turn a leaky sample into an apparent
colossal-permittivity material. Good practice is to show at least two
representations, to state the frequency and temperature with every quoted
permittivity, and to report the loss alongside it. A permittivity without a
loss figure is not a useful number.

Two further presentation rules worth holding to:

**Quote conditions with every number.** Permittivity depends on frequency,
temperature, bias, and sometimes on the amplitude of the measuring signal and
on the sample's history. A datasheet value at 1 kHz and 25 degrees C says
nothing about behaviour at 1 GHz and 125 degrees C.

**Show the raw frequency range.** Extrapolating a fitted relaxation outside the
measured range, and then quoting the extrapolated relaxation time, is a common
overreach. If the loss peak was not observed, its frequency was not measured.

## Common traps in dielectric measurement

A checklist of the mistakes that most often produce wrong dielectric data,
roughly in order of how frequently they occur.

**Electrode polarization mistaken for material response.** Blocking electrodes
accumulate charge and produce an enormous apparent permittivity at low
frequency, sometimes many thousands. It is a contact effect. The tests are to
vary the sample thickness, since a true bulk permittivity is
thickness-independent while an electrode effect scales, and to change electrode
material.

**Grain boundary capacitance mistaken for intrinsic high permittivity.** Several
reports of "colossal" dielectric constants in ceramics have turned out to be
insulating grain boundaries in parallel with semiconducting grains, which is an
internal-barrier-layer capacitor rather than a polarizable material. Impedance
plane analysis separates them.

**DC conduction inflating the loss.** A conducting path adds a 1/frequency term
to epsilon_2. Failing to subtract it produces a spurious low-frequency
relaxation. The check is whether the low-frequency loss follows a slope of
exactly -1 on a log-log plot.

**Fringing and stray capacitance.** For thin films and small electrodes, the
fringe field and the fixture capacitance can be comparable to the sample. A
guard ring, and a measurement of the empty fixture, are basic hygiene.

**Series resistance of the electrodes** producing an apparent high-frequency
loss peak that is entirely instrumental. Suspect this whenever a loss peak
appears at the top of the measurement range and moves when the electrode
material or thickness changes.

**Sample history.** Moisture absorption changes polymer dielectrics
substantially; poled ferroelectrics behave differently from unpoled ones;
a sample that has seen high field may have injected space charge that persists
for hours. Recording and controlling history is part of the measurement.

**Nonlinearity assumed away.** Ferroelectrics and many high-k materials have
permittivity that depends on bias and on measuring amplitude. A small-signal
measurement at zero bias does not describe a capacitor operating at rated
voltage, which is why the effective capacitance of a class II ceramic capacitor
in a real circuit can be a fraction of its nameplate value.

The through-line of this module is that dielectric response is a
frequency-resolved, temperature-resolved, geometry-sensitive quantity that
contains information about polarization, conduction, interfaces and structure
all at once. That richness is what makes it a powerful characterization tool
and what makes it so easy to misreport. The discipline is to separate the
contributions before naming a number.

# Charge Pumping, Low-Frequency Noise and Deep-Level Transient Spectroscopy

<!-- covers: 36.5, 36.6, 36.7 -->

The three techniques in this lesson all measure defects, which is to say they
measure the things that decide whether a device degrades. Each one is sensitive
to a different population.

## Charge pumping

Charge pumping measures **interface trap density** in a MOS transistor, and it
does so with a sensitivity that C-V stretch-out cannot approach.

The method is elegant. Apply a train of pulses to the gate that drives the
surface between accumulation and inversion, with source and drain tied together
and slightly reverse biased. On the inversion half of each cycle, electrons
flood the channel and some are captured by interface traps. On the accumulation
half, holes flood in, and the trapped electrons recombine with them rather than
returning to the channel. Each cycle therefore transfers a packet of charge into
the substrate, and the resulting **substrate current** is proportional to the
pulse frequency and to the number of traps:

    I_cp = q * f * A * N_it

Measuring a DC current instead of a small capacitance change is what gives the
sensitivity, and interface trap densities down to 10^9 per square centimetre per
electron-volt are measurable.

Refinements extract more:

- **Varying the pulse base level or amplitude** scans the energy range over
  which traps are sampled, giving the trap density as a function of energy in
  the gap rather than a single integrated number.
- **Varying the pulse rise and fall times** changes the emission time available
  and therefore the energy window, another route to the same spectrum.
- **Varying temperature** shifts the accessible window.

The primary application is **reliability**. Interface trap generation is the
measurable signature of hot-carrier degradation and of bias-temperature
instability, both of which are hydrogen-related bond-breaking processes (module
22). Charge pumping before and after stress quantifies the damage directly, and
it is the standard technique in device reliability laboratories.

Its limitation is that it requires a working transistor with a substrate
contact, so it is a device measurement rather than a materials measurement, and
it reports only traps at the interface, not those in the bulk of the dielectric
or the semiconductor.

## Low-frequency noise

Every device produces fluctuations in its current beyond the unavoidable thermal
and shot noise, and the excess at low frequency carries information about
defects that no static measurement reveals.

**Flicker or 1/f noise** has a power spectral density that varies roughly
inversely with frequency, over many decades. Two mechanisms are proposed and
both occur:

- **Carrier number fluctuation**, where individual traps near the interface
  capture and emit carriers, modulating the channel charge. A superposition of
  traps with a broad distribution of time constants produces a 1/f spectrum
  naturally.
- **Mobility fluctuation**, where scattering rates fluctuate.

Distinguishing them experimentally is done by looking at how the normalized
noise scales with drain current: number fluctuation and mobility fluctuation
predict different power laws, and the observed scaling identifies which
dominates. In modern MOS devices number fluctuation, meaning oxide and interface
traps, usually dominates.

**Generation-recombination noise** appears as a Lorentzian bump on the spectrum,
produced by a single trap level with a well-defined time constant. Fitting the
corner frequency gives that time constant, and its temperature dependence gives
the trap's activation energy. This is a spectroscopy of individual defect
species.

**Random telegraph noise** is what generation-recombination noise becomes when
the device is small enough that only one or a few traps are active. The current
then hops discretely between two or more levels as a single trap captures and
emits a single carrier. Watching one defect in real time is remarkable, and it
is also a serious engineering problem: in a nanoscale transistor or a memory
cell, a single trap can shift the threshold voltage enough to cause a read
error, and random telegraph noise is now a recognized limit on SRAM and flash
margin.

Why noise measurement is worth the trouble:

- It is **non-destructive and sensitive**, detecting trap densities well below
  what C-V or charge pumping resolve.
- It is a **quality and reliability screen**. Noise correlates with defect
  density, so it predicts which devices will degrade, and it is used as an early
  indicator in process development.
- In analogue and radio-frequency circuits, 1/f noise up-converts around a
  carrier into **phase noise**, so it directly limits oscillator purity. In that
  context the material's noise is a system specification.

## Deep-level transient spectroscopy

DLTS is the definitive technique for **deep levels**, meaning defect states well
inside the bandgap, and it identifies them by their thermal emission behaviour.

The principle: a reverse-biased junction has a depletion region whose width, and
therefore whose capacitance, depends on the charge in it. Apply a brief forward
bias pulse, which floods the region with carriers and fills the traps. Return to
reverse bias. The traps now emit their captured carriers thermally, at a rate
that depends exponentially on their depth below the band edge, and as they empty
the depletion capacitance relaxes back to its steady value. The capacitance
transient is therefore an exponential whose time constant is the emission time
of the trap.

The measurement turns this into a spectrum by scanning temperature. A **rate
window** is defined, typically by sampling the transient at two delays and
taking the difference. As temperature rises, a given trap's emission rate sweeps
through the rate window, and the difference signal peaks. Plotting the difference
against temperature gives a peak for each distinct trap species, and the whole
spectrum is read like a fingerprint.

What comes out of it:

- **Activation energy** of each level, from an Arrhenius plot of emission rate
  against inverse temperature built up by repeating the scan with different rate
  windows.
- **Capture cross-section**, from the intercept of that plot, and independently
  from how the peak height varies with filling pulse width.
- **Trap concentration**, from the peak amplitude relative to the doping.
- **Trap type**, since majority and minority carrier traps produce capacitance
  transients of opposite sign, so the polarity of the peak identifies which.
- **Spatial profile**, by varying the bias conditions so that the filling pulse
  reaches different depths.

Sensitivity is extraordinary: trap concentrations down to about 10^-5 of the
doping concentration are detectable, which for a lightly doped sample means
around 10^10 traps per cubic centimetre. Combined with the identification of
specific defect species by their signatures, DLTS is how the transition metal
contamination limits of module 22 were established, and it is how a new material
or process is screened for lifetime-killing centres.

Its requirements and limits: it needs a junction or Schottky diode, so it is a
device-level measurement on material that can be contacted; it needs a
reasonably well-defined doping; and it works poorly on highly resistive or
strongly compensated material, where the depletion capacitance is not
well-behaved. Variants exist for those cases, including current-mode DLTS and
optical DLTS that uses light rather than a forward pulse to fill the traps,
which extends the technique to minority carrier traps and to insulating
material.

## Choosing among the electrical methods

Bringing module 36 together as a decision guide.

- **Is the film conducting, and how much?** Four-point probe or van der Pauw.
- **Are those carriers electrons or holes, how many, and how mobile?** Hall,
  with both field polarities, over a temperature range.
- **What is the doping profile, and what is at the dielectric interface?**
  Capacitance-voltage, on a junction for doping and on a MOS capacitor for
  oxide charge and interface traps.
- **Does the junction behave ideally, and what is the barrier?**
  Current-voltage, fitted over its straight region only.
- **How many interface traps, and did stress make more?** Charge pumping.
- **Are there a few individual defects dominating a small device, and how noisy
  is this process?** Low-frequency noise, including random telegraph
  measurement.
- **What deep levels are present, at what concentration, with what identity?**
  DLTS.

The order matters. The first four are cheap and fast and rule out gross
problems; the last three are slower, need better samples, and answer questions
about defects that the first four cannot even see. Reaching for DLTS before
confirming that the contacts are ohmic is a common way to waste a week.

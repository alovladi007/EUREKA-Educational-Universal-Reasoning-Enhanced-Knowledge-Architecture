# Electrical Characterization: Resistivity, Hall, C-V and I-V

<!-- covers: 36.1, 36.2, 36.3, 36.4 -->

These are the measurements that decide whether a material or a device is what
it was meant to be. Each one is simple in principle and full of traps in
practice, and knowing the traps is what separates a number from a result.

## Measuring resistivity

**Two-point measurement** is almost always wrong for a semiconductor. Forcing
current and measuring voltage through the same two probes includes the contact
resistance and the probe resistance in the answer, and contact resistance to a
semiconductor can exceed the sample resistance by orders of magnitude (module
24). A two-point measurement of a semiconductor usually measures the contacts.

**Four-point probe** is the standard. Four collinear, equally spaced probes:
current is forced through the outer pair and voltage measured across the inner
pair with a high-impedance voltmeter, so essentially no current flows through
the voltage probes and their contact resistance drops out. For a thin layer on
an insulating substrate, the sheet resistance is

    R_s = 4.532 * V / I

with a geometrical correction factor when the sample is not large compared with
the probe spacing. Sheet resistance in ohms per square, multiplied by thickness,
gives resistivity. Four-point probe is the routine in-line measurement for
implant dose monitoring and metal film thickness in semiconductor manufacturing.

**Van der Pauw** generalizes this to an arbitrarily shaped flat sample of
uniform thickness with four contacts on its perimeter. Two resistance
measurements with different contact permutations, combined through the van der
Pauw equation, give sheet resistance without needing to know the sample geometry
at all. This is why it is the default for laboratory samples of new materials:
you do not need to fabricate a defined bar.

The traps, in order of how often they bite:

- **Non-ohmic contacts.** Always check that current is linear in voltage over
  the measurement range. If not, the extracted resistivity is fiction.
- **Probe penetration and damage** on soft or thin films.
- **Photoconductivity.** Measure in the dark, or at least in constant light,
  since ambient illumination changes the conductivity of high-resistivity
  material substantially (module 23).
- **Self-heating** at high current, which changes the very quantity you are
  measuring.
- **Sample geometry.** The correction factors assume the sample is large
  compared with probe spacing and uniform in thickness. Neither is automatic.
- **A conducting substrate underneath the film**, which shorts the measurement.
  Films on doped silicon need an insulating layer or a junction-isolated
  structure.

## Hall measurement in practice

Module 18 gave the physics. Here is what it takes to get a trustworthy number.

The standard implementation is **van der Pauw geometry with a magnetic field**,
using the same four contacts as the resistivity measurement, which is convenient
because you need both to get mobility.

The measurement protocol matters more than the equation. Best practice requires
measuring at both **magnetic field polarities** and with **current in both
directions**, then combining the results. This cancels a family of spurious
voltages that would otherwise contaminate the result: misalignment of the
voltage contacts, which produces an offset independent of field; thermoelectric
voltages from temperature gradients; and the thermomagnetic effects
(Ettingshausen, Nernst, Righi-Leduc) that produce field-dependent voltages of
thermal origin. A Hall measurement reported from a single field direction should
be treated as provisional.

Interpretation cautions:

- **Two-carrier conduction.** When electrons and holes both contribute, the Hall
  coefficient is a weighted combination and can change sign with temperature or
  field. A single-carrier interpretation of such data is meaningless. The test
  is to measure at several field strengths: single-carrier Hall coefficient is
  field-independent, two-carrier is not.
- **The Hall scattering factor.** The Hall mobility exceeds the drift mobility
  by a factor typically between 1 and 2, depending on the scattering mechanism.
  Reporting Hall mobility as drift mobility is a systematic error of that size.
- **Inhomogeneous samples.** A layered or non-uniform sample gives a weighted
  average dominated by the most conductive layer, which may not be the layer of
  interest.
- **Low mobility materials** give very small Hall voltages, and in disordered or
  organic materials the Hall signal may be unmeasurable or uninterpretable.

**Temperature-dependent Hall** is where the technique really earns its place.
Measuring carrier density against temperature gives the dopant ionization energy
from the freeze-out region, and measuring mobility against temperature separates
the scattering mechanisms of module 18 by their opposite temperature exponents.
That combination is the standard full characterization of a new semiconductor
layer.

## Capacitance-voltage profiling

C-V measurement extracts the doping profile and, on a MOS structure, almost
everything about the dielectric and its interface.

**On a junction or Schottky diode.** Reverse bias widens the depletion region.
The depletion region behaves as a capacitor whose plate separation is the
depletion width, so capacitance falls as bias increases. Differentiating gives
the doping concentration at the edge of the depletion region:

    N(x) proportional to -1 / (d(1/C^2)/dV)

with the depth x obtained from the capacitance itself. Sweeping the bias
therefore sweeps the measurement depth, giving a doping profile. A plot of
1/C^2 against voltage is linear for uniform doping, and its intercept gives the
built-in potential, so the same measurement yields the barrier height for a
Schottky diode (module 24).

The depth range is bounded at the shallow end by the zero-bias depletion width
and at the deep end by breakdown, and the resolution is limited by the **Debye
length**, since free carriers cannot follow an abrupt doping change more sharply
than that. A truly abrupt junction always measures as smeared over a few Debye
lengths, which is a physical limit and not an instrument limit.

**On a MOS capacitor.** This is one of the most information-dense measurements
in the field. Sweeping gate bias takes the semiconductor surface through
accumulation, depletion and inversion, and the resulting C-V curve gives:

- **Oxide capacitance** and therefore, with a known permittivity, the dielectric
  thickness, from the accumulation capacitance.
- **Substrate doping**, from the minimum capacitance in depletion.
- **Flatband voltage**, and from its shift relative to the ideal value, the
  **fixed oxide charge**.
- **Interface trap density**, from the stretch-out of the curve along the
  voltage axis, since traps charge and discharge as the surface potential moves.
  Comparing high-frequency and quasi-static curves quantifies it, and the
  conductance method does so with more sensitivity.
- **Mobile ionic charge**, from the flatband shift after a bias-temperature
  stress, which is the standard test for sodium contamination (module 22).

For very thin dielectrics the measurement gets harder, because gate leakage
(module 26) shorts out the capacitance and because quantum-mechanical carrier
distribution and polysilicon gate depletion make the simple thickness extraction
optimistic. Corrections exist and are standard, and the resulting quantity is
usually reported as an equivalent oxide thickness rather than a physical one.

## Current-voltage measurement

The most basic measurement, and the interpretation is where the content is.

**On a diode**, the forward characteristic follows the diode equation with an
**ideality factor** n:

    I = I_0 * (exp(qV / (n kT)) - 1)

An ideality factor near 1 indicates diffusion-limited current, the ideal case.
Near 2 indicates recombination in the depletion region, which points at defects.
Above 2 usually indicates tunnelling, leakage paths, or a series-resistance
artefact. Plotting log(I) against V gives a straight region whose slope is the
ideality factor and whose intercept is the saturation current, from which the
barrier height follows for a Schottky diode. Departures at high current are
series resistance and at low current are shunt leakage, so the useful fitting
region is the straight middle.

**On a transistor**, the output and transfer characteristics give threshold
voltage, transconductance, field-effect mobility, subthreshold swing and
on-off ratio. Two cautions specific to materials work: the extracted field-effect
mobility is contaminated by contact resistance, badly so in short devices and in
high-resistance material, and in disordered materials the mobility depends on
gate voltage (module 25), so a single number requires a stated bias point.
Comparing published mobilities across papers without checking extraction method
and bias conditions is unreliable, and this is a persistent problem in the
organic and two-dimensional materials literature.

**On a dielectric**, the leakage characteristic identifies the conduction
mechanism through the diagnostic plots of module 26, and stressing to breakdown
gives the reliability statistics.

The general discipline for all of these: measure over a wide enough range to see
where the model stops applying, check for hysteresis by sweeping in both
directions, control temperature and light, and confirm that contacts are ohmic
before believing anything.

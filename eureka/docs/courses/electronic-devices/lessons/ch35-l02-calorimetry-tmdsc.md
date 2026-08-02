# Enthalpy, Transitions and Calorimetry

<!-- covers: 35.4, 35.5 -->

## Enthalpy, transitions and calorimetry

Heating a material and watching how much energy it absorbs is one of the oldest
analytical techniques and one of the most informative, because every structural
change costs or releases energy.

**Differential scanning calorimetry (DSC)** is the standard implementation. A
sample and an inert reference are heated at a controlled rate, and the
instrument measures the difference in heat flow required to keep them at the same
temperature. Any process in the sample that absorbs or releases energy shows up
as a deviation from the baseline.

What the resulting trace reveals:

**Melting and crystallization.** A first-order transition, appearing as a sharp
peak whose area is the latent heat and whose position is the transition
temperature. On cooling, crystallization appears as an exotherm, usually at a
lower temperature than melting because nucleation requires undercooling. The
size of that hysteresis is itself informative about nucleation behaviour.

**Glass transition.** Not a first-order transition but a kinetic freezing of
molecular motion, appearing as a step in heat capacity rather than a peak.
Because it is kinetic, the measured glass transition temperature depends on the
heating rate, typically shifting several degrees per decade of rate. Quoting a
glass transition temperature without the rate is incomplete, and comparing
values measured at different rates is a common error.

The glass transition matters enormously in electronic packaging. An epoxy
moulding compound has a very different expansion coefficient above and below its
glass transition, so a package that operates across that temperature accumulates
strain differently in the two regimes and its reliability model has to account
for both (module 54).

**Crystallization of an amorphous phase.** An exotherm on heating, since the
crystal is lower in energy. This is the primary characterization for
phase-change memory alloys (module 47), where the crystallization temperature
sets the data retention limit and the crystallization kinetics set the write
speed. It is also how the thermal stability of an amorphous metal or an
amorphous oxide semiconductor is quantified.

**Curing reactions.** An exotherm as a thermoset polymer cross-links. The peak
position and area give the cure kinetics, which is how underfill and
encapsulant process windows are set.

**Decomposition and oxidation**, usually studied alongside
**thermogravimetric analysis**, which measures mass against temperature. Running
DSC and TGA together distinguishes a thermal event that involves mass loss, such
as solvent evaporation or decomposition, from one that does not, such as melting
or a solid-state transition. That distinction is the first question to ask about
any unexplained peak.

**Purity.** The shape of a melting endotherm depends on impurity content,
because impurities depress and broaden the melting point in a calculable way.
This gives an absolute purity determination for crystalline organics without a
reference standard.

Practical cautions: sample mass and heating rate both affect peak shape and
apparent temperature, the atmosphere matters greatly for anything that can
oxidize, and thermal lag between the sample and the sensor shifts everything if
the sample is poorly coupled to the pan. Calibration against standards with
known melting points is routine and necessary.

## Temperature-modulated calorimetry

Conventional DSC has a structural limitation: it measures one signal, the total
heat flow, and that signal mixes two physically different contributions. Some of
the heat flow is **reversing**, meaning it tracks temperature immediately and is
essentially the heat capacity. Some is **non-reversing**, meaning it comes from a
kinetic process that proceeds in one direction at its own rate: crystallization,
curing, relaxation, decomposition. When two such events overlap in temperature,
a single trace cannot separate them.

**Temperature-modulated DSC** solves this by superimposing a small sinusoidal
oscillation on the linear heating ramp. The sample then experiences a
temperature that rises steadily while also oscillating, and the resulting heat
flow contains both a slowly varying component and an oscillating one.

Deconvolving the signal gives two separate outputs:

- The **reversing heat flow**, obtained from the amplitude of the oscillating
  response, which is proportional to heat capacity. Glass transitions, being
  heat capacity steps, appear here cleanly.
- The **non-reversing heat flow**, obtained as the difference between total and
  reversing, which contains the kinetic events. Enthalpy relaxation,
  crystallization, cure and decomposition appear here.

The classic case this resolves is a polymer or amorphous material where enthalpy
relaxation, an ageing effect that produces an endothermic peak, sits right on
top of the glass transition step. In conventional DSC they overlap and the glass
transition temperature is ambiguous. Modulated DSC puts the step in one channel
and the relaxation peak in the other, so both can be measured. This matters for
electronic materials because enthalpy relaxation is a direct measure of physical
ageing, meaning how far a glassy encapsulant has drifted toward equilibrium
since it was made, and that ageing changes its mechanical properties.

A second capability follows from the modulation: because the response is
measured at a known frequency, the technique gives a **complex heat capacity**
with real and imaginary parts, exactly analogous to the complex permittivity of
module 26. The imaginary part peaks where a relaxation process has a
characteristic time matching the modulation period, so varying the modulation
frequency probes relaxation dynamics. The frequency dependence of the glass
transition measured this way follows the same non-Arrhenius form seen in
dielectric spectroscopy, and the two techniques cross-check each other on the
same material.

The costs of modulation are real: the underlying heating rate must be slow so
that several modulation cycles fit within any transition, which makes runs long;
the modulation amplitude must be small enough that the response stays linear;
and calibration is more involved than for conventional DSC.

## What thermal analysis contributes

Pulling module 35 together, the thermal properties do three jobs in this course.

**They set the thermal design.** Conductivity, heat capacity and interface
resistance determine junction temperature, and junction temperature determines
lifetime through every activated failure mechanism in modules 22 and 54.
Getting a factor of two wrong in a thin-film conductivity, by using a bulk
value, propagates straight into a wrong reliability prediction.

**They set the mechanical design.** Expansion mismatch is the main driver of
thermomechanical fatigue in packages, and the glass transition of polymer
components divides the operating range into two regimes with different
behaviour.

**They are an analytical technique.** Calorimetry identifies phases and
transitions, measures crystallization kinetics, quantifies cure, detects ageing
and determines purity, in most cases on milligrams of material with minimal
preparation. In the materials families of this course it is the standard
characterization for phase-change alloys, for amorphous materials generally, and
for every polymer in a package.

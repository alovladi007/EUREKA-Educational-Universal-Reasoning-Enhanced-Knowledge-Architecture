# Useful Facts and Formulas: The Mathematical Toolkit

<!-- covers: C.1, C.2, C.3, C.4, C.5, C.6, C.7, C.8, C.9 -->

A reference primer for the mathematics this course leans on, gathered
for lookup rather than sequence.

## Symbols and scale

The **Greek alphabet** works throughout: omega for angular frequency and
ohms, rho for resistivity, tau for time constants, phi for phase, delta
for change, mu for micro and permeability, lambda for wavelength. The
**SI prefixes** run in thousands - pico, nano, micro, milli, kilo,
mega, giga - and engineering notation keeps exponents in multiples of
three; fluency in sliding a decimal three places per prefix prevents
more errors than any formula.

## Algebra you actually use

**Linear functions** y = mx + b model every calibration and small-signal
slope; two points determine the line (the sensors module's two-point
calibration in algebraic clothes). **Quadratics** solve by the formula
with the discriminant flagging real solutions - resonance and
power-transfer optimizations reduce here. **Exponents and logarithms**
carry the RC/RL exponentials and every decibel: log of a product is a
sum, which is the entire reason gain chains add in dB; natural log's
constant e = 2.718... appears wherever rate is proportional to amount.

## Trigonometry and complex numbers

Sine, cosine, and tangent link angles to ratios; the identities that
recur are sin-squared plus cos-squared equals one, and the sum formulas
behind interference and modulation. Degrees and radians convert by pi
over 180 - angular frequency omega = 2 pi f is radians per second.
**Complex numbers** in rectangular (a + jb) and polar (magnitude at
angle) forms are Module 2's phasor machinery: add in rectangular,
multiply in polar (magnitudes multiply, angles add), conjugates cancel
imaginary parts - the conjugate-match rule's algebra.

## Calculus, minimally

The **derivative** is instantaneous slope: current as dq/dt, the
capacitor's i = C dv/dt, the inductor's v = L di/dt - the component
laws are derivatives wearing packages. The **integral** is accumulated
area: charge as the integral of current, the integrator op-amp doing it
in hardware. The pair invert each other, exponentials differentiate
into themselves (why RC circuits decay exponentially), and sinusoids
shift phase by 90 degrees under either operation - which is, at the
end, the entire analytic content of AC circuit theory, and a fitting
last page: the calculus is not decoration on electronics; it is what
the components compute.

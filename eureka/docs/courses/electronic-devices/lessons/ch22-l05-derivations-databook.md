# Module 22 Supplement: Derivations, the Data Book and the Audit Rules

<!-- covers: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.7, 22.8, 22.9, 22.10, 22.11, 22.12, 22.13, 22.14 -->

The working lessons borrowed results; this supplement proves them, then
compiles the numbers a practitioner reaches for, states the audit rules for
consuming diffusion data, and closes with the veto list. Every derivation
runs from stated premise to stated result with no steps withheld.

**Level.** Graduate supplement throughout; the data book and audit rules are
for everyone.

## 1. Derivation: from coin flips to Fick

Premise: an atom hops distance $a$ left or right with equal probability,
$\Gamma$ hops per second, hops independent. After $N = \Gamma t$ hops the
displacement is $x = a\sum_{i=1}^{N}s_i$ with $s_i = \pm1$ independent and
zero-mean. Then $\langle x\rangle = 0$ and, because cross terms vanish,

$$
\langle x^2\rangle = a^2\sum_{i,j}\langle s_is_j\rangle
= a^2 N = a^2\,\Gamma\,t.
$$

The binomial distribution of $x$ tends, by the central limit theorem, to a
Gaussian of exactly this variance:

![Binomial site-occupation envelopes computed from the stated coin-flip model after 16, 64 and 256 steps: the shape settles into a Gaussian whose width grows as the square root of the step count, which is the whole content of sqrt(Dt).](/courses/electronic-devices/figures/m22-random-walk.svg)

Comparing $\langle x^2\rangle = a^2\Gamma t$ with the Gaussian solution of
Fick's second law, whose variance is $\langle x^2\rangle = 2Dt$, identifies

$$
D = \frac{a^2\,\Gamma}{2}
\quad\text{(1D)},
\qquad
D = \frac{a^2\,\Gamma}{6}
\quad\text{(3D, isotropic)},
$$

the 6 arising because in three dimensions each hop distributes its square
displacement over three axes and two directions. Two refinements complete
the bridge used in lesson 1. The hop rate is thermally activated,
$\Gamma = \nu_0\,e^{-E_m/k_BT}$, which supplies the migration part of the
Arrhenius energy. And successive hops of a vacancy-mediated tracer are not
independent: having swapped with a vacancy, the tracer's most likely next
hop is straight back. The **correlation factor** $f \le 1$ multiplies $D$
to account for the wasted round trips; for vacancy diffusion in the diamond
lattice the tabulated value is $f = 0.5$, exactly one wasted hop in two.
For a mechanism needing a defect, the defect's availability multiplies in
as its site fraction, so the measured activation energy is
$E_a = E_m + E_f$: migration plus formation, which is why substitutional
dopants carry 3.5 to 4 eV while interstitial diffusers carry only their
sub-eV $E_m$. That one line is the whole explanation of lesson 2's
twelve-orders gap between dopants and copper.

## 2. Derivation: Fick's second law and the erfc solution

Fick's second law follows from conservation (lesson 1, section 1). The
constant-surface solution follows from a similarity argument worth owning.
Premise: half-space $x > 0$, $C(x,0) = 0$, $C(0,t) = C_s$ held, $D$
constant. Since the problem has no intrinsic length, the solution can
depend on $x$ and $t$ only through the dimensionless combination

$$
\eta = \frac{x}{2\sqrt{Dt}},
$$

so try $C = C_s\,g(\eta)$. Substituting into
$\partial C/\partial t = D\,\partial^2C/\partial x^2$: the left side is
$C_s g'(\eta)\,(-\eta/t)/1$ times $\tfrac12$, the right side
$C_s g''(\eta)/(4t)$, and the $t$ cancels, confirming the guess and leaving
the ordinary equation

$$
g'' + 2\eta\,g' = 0,
$$

whose first integral is $g' = A\,e^{-\eta^2}$ and whose solution with
$g(0) = 1$, $g(\infty) = 0$ is

$$
g(\eta) = 1 - \frac{2}{\sqrt{\pi}}\int_0^{\eta}e^{-s^2}ds
= \mathrm{erfc}(\eta),
$$

the advertised profile. The dose follows by integrating it, using
$\int_0^\infty \mathrm{erfc}(\eta)\,d\eta = 1/\sqrt{\pi}$:

$$
Q(t) = \int_0^\infty C\,dx
= 2C_s\sqrt{Dt}\int_0^\infty\mathrm{erfc}(\eta)\,d\eta
= \frac{2}{\sqrt{\pi}}\,C_s\sqrt{Dt}.
$$

![Dose and half-depth of the constant-source solution, both computed from the stated results, against time: every payoff of predeposition grows as the square root, so the second hour buys less than the first.](/courses/electronic-devices/figures/m22-dose-and-depth.svg)

## 3. Derivation: the Gaussian and its conservation

Premise: dose $Q$ deposited at $x = 0$ at $t = 0$ on an infinite line.
Claim: $C = (Q/\sqrt{4\pi Dt})\,e^{-x^2/4Dt}$ solves Fick's second law and
conserves dose. Verification by differentiation: with
$u = x^2/4Dt$,

$$
\frac{\partial C}{\partial t}
= C\left(-\frac{1}{2t} + \frac{u}{t}\right),
\qquad
D\frac{\partial^2 C}{\partial x^2}
= C\left(-\frac{1}{2t} + \frac{u}{t}\right),
$$

equal term by term. Conservation: $\int_{-\infty}^{\infty}C\,dx = Q$
because the Gaussian integrates to 1. For the half-space drive-in with a
reflecting surface (no flux out), the mirror image doubles the amplitude,
giving lesson 1's $C = (Q/\sqrt{\pi Dt})e^{-x^2/4Dt}$ with the dose $Q$ now
counted in $x > 0$ alone. The reflecting boundary is an assumption with a
name attached: if the surface instead evaporates dopant or feeds a growing
oxide, the image argument fails and the profile develops the near-surface
distortions lesson 2 warned about.

## 4. Derivation: the Boltzmann-Matano analysis

Premise: one measured profile $C(x)$ at one time $t$, diffusion obeying
$\partial C/\partial t = \partial(D(C)\,\partial C/\partial x)/\partial x$
with unknown $D(C)$, from a step initial condition. Boltzmann's
observation: the similarity variable $\eta = x/2\sqrt{t}$ (no $D$ inside,
since $D$ is no longer constant) still reduces the PDE to an ordinary
equation,

$$
-2\eta\,\frac{dC}{d\eta} = \frac{d}{d\eta}\!\left(D(C)\frac{dC}{d\eta}\right).
$$

Integrate both sides from $C = 0$ (deep material) up to a chosen
concentration $C^*$, noting the flux term vanishes in the deep limit:

$$
-2\int_0^{C^*}\eta\,dC = D(C^*)\,\frac{dC}{d\eta}\bigg|_{C^*},
$$

and converting back to $x$ at fixed $t$ gives the working formula quoted in
lesson 2:

$$
D(C^*) = -\frac{1}{2t}\left(\frac{dx}{dC}\right)_{C^*}\int_0^{C^*}x\,dC,
$$

with $x$ measured from the **Matano plane**, the origin choice that makes
$\int x\,dC$ over the full profile vanish, which is what entitles the
integration by parts behind the second line. The formula's self-check: fed
a pure erfc profile, it returns a constant, the $D$ that generated it.

### Worked example 4.1 - auditing the formula on a known profile

Take $C = C_s\,\mathrm{erfc}(x/2\sqrt{Dt})$ and evaluate at the half
concentration $C^* = 0.5\,C_s$, where $x^* = 0.954\sqrt{Dt}$ (from
$\mathrm{erfc}(0.477) = 0.5$). Numerically, using the erfc derivative
$dC/dx = -C_s e^{-\eta^2}/\sqrt{\pi Dt}$: at $\eta = 0.477$,
$(dx/dC) = -\sqrt{\pi Dt}\,e^{0.228}/C_s = -2.23\sqrt{Dt}/C_s$; the
integral $\int_0^{C^*}x\,dC$ over the tail evaluates numerically to
$0.224\,C_s\sqrt{Dt}$. The product:

$$
D_{\mathrm{out}} = -\frac{1}{2t}\times\left(-\frac{2.23\sqrt{Dt}}{C_s}\right)
\times 0.224\,C_s\sqrt{Dt} = 0.25\times2.23\times0.224\times\frac{4Dt}{2t}\cdot\frac{1}{1}
\approx 1.0\,D,
$$

recovering the input $D$ to the accuracy of the two-digit numerics shown.
Running this audit on synthetic data before trusting the pipeline on real
data is the recommended habit; a Matano implementation that cannot return a
constant from an erfc has a sign or origin bug, and several published ones
did.

## 5. Derivation: the built-in field factor h

Premise: singly ionized donors at concentration $C(x)$, electrons in local
equilibrium, quasi-neutrality with the intrinsic carriers included:
$n - p = C$, $np = n_i^2$, so

$$
n = \frac{C}{2} + \sqrt{\left(\frac{C}{2}\right)^2 + n_i^2}.
$$

The mobile electrons arrange a field that, in equilibrium with their own
gradient, satisfies $qE = -k_BT\,(dn/dx)/n$ (Einstein relation, module 18).
The ion flux with drift is

$$
J = -D\frac{\partial C}{\partial x} + \mu C E
= -D\frac{\partial C}{\partial x} - D\,C\,\frac{1}{n}\frac{dn}{dx},
$$

using $\mu = qD/k_BT$ for the ions. Since $n$ is a function of $C$ alone,
$dn/dx = (dn/dC)(dC/dx)$, and the flux collapses to pure diffusion with an
enhanced coefficient $J = -hD\,\partial C/\partial x$ where
$h = 1 + (C/n)(dn/dC)$. Differentiating the quasi-neutral $n(C)$:

$$
h = 1 + \frac{C/2n_i}{\sqrt{1 + (C/2n_i)^2}},
$$

lesson 1's stated result, with the limits read off directly: $h \to 1$ when
$C \ll n_i$ (the dopant is a spectator) and $h \to 2$ when $C \gg n_i$
(every ion drags exactly one electron's worth of field assistance).

### Worked example 5.1 - the enhancement at the kink

At the extrinsic-intrinsic crossover $C = n_i$: $u = C/2n_i = 0.5$, so
$h = 1 + 0.5/\sqrt{1.25} = 1.45$. At $C = 2n_i$: $h = 1.71$; at
$C = 10n_i$: $h = 1.98$. The enhancement completes most of its run within
one decade of concentration around $n_i$, which is why profile shoulders
near $n_i(T)$ are where constant-$D$ fits break first.

## 6. Derivation: the charged-vehicle sum

Premise: diffusion is carried by defect charge states (say $V^0$, $V^-$,
$V^{2-}$, $V^+$), each contributing flux proportional to its own
population; defect ionization is in local equilibrium with the Fermi level.
Mass action for an acceptor-like state gives
$[V^-]/[V^0] \propto e^{(E_F - E_A)/k_BT}$, and since
$n = n_i e^{(E_F-E_i)/k_BT}$, each charge state's population scales as a
power of $n/n_i$:

$$
[V^-] \propto \frac{n}{n_i},
\qquad
[V^{2-}] \propto \left(\frac{n}{n_i}\right)^2,
\qquad
[V^+] \propto \frac{n_i}{n} .
$$

Summing the per-vehicle contributions weighted by these populations yields
lesson 1's working expression,

$$
D(n) = D^{0} + D^{-}\frac{n}{n_i} + D^{2-}\left(\frac{n}{n_i}\right)^{2}
+ D^{+}\frac{n_i}{n},
$$

where each $D^{q}$ bundles that vehicle's intrinsic population, hop rate
and correlation factor. The doping dependence of the measured diffusivity
is therefore a census of which vehicles carry which dopant: arsenic's near
linear rise flags $V^-$, phosphorus's quadratic plateau flags a doubly
charged vehicle, boron's behaviour in p-type flags a positive one.

![The three stated power laws for charged diffusion vehicles against normalized electron concentration: the exponent of the doping dependence names the vehicle's charge state.](/courses/electronic-devices/figures/m22-charged-defects.svg)

## 6b. Derivation: the kick-out effective diffusivity

Lesson 1 asserted that a kick-out dopant's effective diffusivity is
proportional to the self-interstitial population; the proof is short and
its assumptions are worth seeing. Premise: the dopant exists as immobile
substitutional $A_s$ and mobile interstitial $A_i$, interconverting by the
kick-out reaction $A_s + I \rightleftharpoons A_i$, with the reaction fast
enough to stay in local equilibrium. Mass action then ties the mobile
fraction to the interstitial population:

$$
\frac{[A_i]}{[A_s]} = K(T)\,C_I
= \underbrace{K(T)\,C_I^{eq}}_{K'(T)}\cdot\frac{C_I}{C_I^{eq}}
\;=\;
K'(T)\,\frac{C_I}{C_I^{eq}},
$$

with $K'$ the mobile fraction the crystal would hold at defect
equilibrium. Total dopant
$C_A = [A_s] + [A_i] \approx [A_s]$ when the mobile fraction is small, and
only the mobile form carries flux, so

$$
J = -D_i\,\frac{\partial [A_i]}{\partial x}
\approx -\left(D_i\,K'\,\frac{C_I}{C_I^{eq}}\right)
\frac{\partial C_A}{\partial x},
\qquad
D_{\mathrm{eff}} = D_i\,K'\,\frac{C_I}{C_I^{eq}}.
$$

Every anomaly of boron and phosphorus in lesson 1 is this one equation
read in different conditions. Equilibrium: $C_I = C_I^{eq}$, ordinary
Arrhenius behaviour, with the measured $E_a$ a composite of $D_i$'s
migration term and $K'$'s reaction enthalpy. Oxidation:
$C_I/C_I^{eq} > 1$, boron and phosphorus accelerate together (OED).
Nitridation: interstitial undersaturation, both decelerate while
vacancy-riding antimony accelerates, the cleanest mechanism fingerprint in
the module. Post-implant: $C_I/C_I^{eq} \sim 10^3$ and decaying, which is
TED, and the enhancement factor in lesson 6's capstone integral is
literally this ratio. The assumption that can fail is the local
equilibrium of the kick-out reaction itself: under millisecond anneals the
interconversion cannot keep up, the two dopant forms decouple, and process
simulators carry them as separate species with an explicit reaction term,
which is why "one dopant, one equation" quietly became "five coupled
continuity equations" inside every modern TCAD deck.

## 7. The data book

The constants this module computes with, restated in one place. House rule:
these are teaching values, representative and rounded; a real recipe uses
its simulator's calibration.

**Universal:** $k_B = 8.617\times10^{-5}$ eV/K. Useful ladder of $k_BT$:
0.0259 eV at 300 K, 0.0794 eV at 650 °C, 0.0975 eV at 858 °C, 0.1097 eV at
1000 °C, 0.1183 eV at 1100 °C, 0.1452 eV at 1412 °C (silicon melt).

**Representative dopant parameters in silicon (intrinsic regime):** boron
0.8 cm²/s and 3.5 eV; phosphorus 4 cm²/s and 3.7 eV; arsenic 10 cm²/s and
4.0 eV. Computed landmarks at 1000 °C: $1.1\times10^{-14}$,
$9\times10^{-15}$, $1.5\times10^{-15}$ cm²/s respectively; each rises
roughly tenfold per 100 °C.

**Fast diffusers:** copper in silicon, tabulated fit $3\times10^{-4}$
cm²/s with 0.18 eV: $2.8\times10^{-7}$ cm²/s at room temperature. Hydrogen:
sub-eV barrier, mobile at room temperature; H-B pair barrier representative
1.4 eV (lesson 2's step).

**Melt and segregation (tabulated):** liquid-silicon viscosity
$7\times10^{-4}$ Pa·s; melt diffusivities near $1.5\times10^{-4}$ cm²/s;
segregation coefficients boron 0.8, phosphorus 0.35, antimony 0.023.

**Structural:** silicon bond length 2.35 Å; diamond-lattice vacancy
correlation factor $f = 0.5$; attempt frequencies near $10^{13}$ Hz.

### Worked example 7.1 - using the ladder without a calculator

Estimate boron's diffusivity at 1050 °C by interpolation on the ladder:
each 100 °C is a decade, so 50 °C is half a decade, $\sqrt{10} = 3.2$:
$D \approx 3.5\times10^{-14}$ cm²/s. The exact arithmetic in lesson 1's
worked example 2.1 gave $3.7\times10^{-14}$: the ladder lands within ten
percent, which is closer than the parameters themselves are honest. This
kind of decade arithmetic is how process integration meetings actually
reason, and it is worth being fluent in it.

## 8. The audit rules for consuming diffusion data

1. **Every diffusivity silently assumes a defect background.** Fermi
   level, oxidation or nitridation state, implant damage age, ambient
   overpressure, strain: a quoted $D$ is conditional on all five, and
   moving any one moves $D$. Ask which were controlled before comparing
   numbers.
2. **Every anneal includes its ramps.** Quote and compare $\int D\,dt$,
   not soak times. For spike anneals the soak is zero and the ramps are
   the process.
3. **A single number is not a mechanism.** Only a profile, or better a
   family of profiles at several times and doping levels, distinguishes
   the regimes of lesson 1. Integral monitors are for control charts, not
   physics.
4. **Chemical is not electrical.** SIMS bounds SRP from above; the gap is
   the inactive fraction and it is process-dependent. Never quote one as
   the other.
5. **Fitted Arrhenius pairs are correlated.** A prefactor quoted without
   its covariance against $E_a$ cannot be compared across labs, and
   compensation plots built from such pairs must survive the section 4
   cautions of lesson 4 before being believed.

## 9. Problems

**P22.25** Repeat the section 1 derivation for a walk with unequal step
probabilities $p \ne \tfrac12$, and show the profile acquires a drift term:
identify which lesson 1 equation this recovers.

**P22.26** Show by direct substitution that
$C = C_s\,\mathrm{erfc}(x/2\sqrt{Dt})$ satisfies the boundary conditions of
section 2, and compute the depth of the $10^{-3}C_s$ contour in units of
$\sqrt{Dt}$ given $\mathrm{erfc}(2.33) \approx 10^{-3}$.

**P22.27** The drive-in Gaussian assumed a reflecting surface. State the
image construction for a perfectly absorbing surface instead, write the
resulting profile, and name a physical situation from lesson 2 it models.

**P22.28** Using section 6, predict the doping-dependence exponent of
antimony diffusion in heavily n-type silicon if its vehicle is $V^-$, and
describe the experiment that would distinguish this from a $V^{2-}$
vehicle.

**P22.29** Build worked example 7.1's ladder for arsenic (4.0 eV): how many
decades per 100 °C at 1000 °C, and why is the number larger than boron's?

**P22.30** Audit rule 2, quantified: a spike anneal ramps at 250 °C/s from
650 °C to 1050 °C and straight back. Approximate the effective time at peak
temperature for boron by treating each 14 °C below peak as a factor $e$
reduction in $D$ (from P22.4's relation), and compare with a 1 s soak.

### Answers

**A22.25** With $\langle s_i\rangle = 2p-1 \ne 0$,
$\langle x\rangle = a(2p-1)\Gamma t$: the mean drifts linearly in time
while the variance about the mean still grows as $a^2\Gamma t$ (with a
$4p(1-p)$ factor). The continuum limit is diffusion plus advection,
$J = -D\,\partial C/\partial x + vC$: lesson 1's drift-diffusion flux, with
the microscopic bias playing the role of the field term.

**A22.26** At $x = 0$: $\mathrm{erfc}(0) = 1$, so $C = C_s$ for all
$t > 0$. As $x \to \infty$: $\mathrm{erfc} \to 0$, matching the empty
initial bulk; and at $t \to 0^+$ the argument diverges for any fixed
$x > 0$, recovering $C = 0$. The $10^{-3}$ contour sits at
$x = 2\times2.33\sqrt{Dt} = 4.7\sqrt{Dt}$.

**A22.27** An absorbing surface holds $C(0) = 0$: subtract the image
instead of adding, $C = (Q/\sqrt{4\pi Dt})[e^{-(x-x_0)^2/4Dt} -
e^{-(x+x_0)^2/4Dt}]$ for dose buried at $x_0$. It models out-diffusion into
an ambient that sweeps the surface clean, or segregation into a growing
oxide that consumes dopant, lesson 2's boron-loss boundary condition.

**A22.28** A $V^-$ vehicle gives $D \propto n/n_i$: doubling $n$ doubles
$D$, exponent 1 on a log-log plot of $D$ against $n/n_i$. A $V^{2-}$
vehicle gives exponent 2. Distinguish by measuring $D$ across a ladder of
background dopings at fixed temperature (isoconcentration experiments with
a tracer): the slope on log-log axes reads the charge state directly.

**A22.29** $E_a/k_BT$ at 1273 K is $4.0/0.1097 = 36.5$; per 100 °C the
exponent changes by roughly $36.5\times(100/1273) = 2.9$ natural logs
$= 1.25$ decades, against boron's $31.9\times(100/1273) = 2.5$ logs $=
1.09$ decades. Higher barrier, steeper ladder: arsenic gains on boron as
temperature rises, which is also visible as the converging lines of lesson
1's Arrhenius figure.

**A22.30** With $D$ down a factor $e$ per 14 °C, the ramp contributes
$\int e^{-|T_{peak}-T|/14\,°C}\,dt$ on each side; at 250 °C/s, 14 °C takes
56 ms, so each side integrates to about 56 ms of peak-equivalent time,
0.11 s for both ramps. Against a 1 s soak the ramps add ten percent; for a
true spike, where the soak is zero, the ramps ARE the anneal, 0.11 s of
peak-equivalent $Dt$. Audit rule 2 in one number: quoting this process as
"zero seconds at temperature" mis-states its $Dt$ by infinity percent.

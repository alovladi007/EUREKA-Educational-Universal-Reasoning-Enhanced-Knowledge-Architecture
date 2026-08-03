# Module 20 Supplement: Derivations, the Data Book and the Veto List

<!-- covers: 20.1, 20.2, 20.3 -->

The working lessons quoted results where deriving them would have broken
stride. This supplement pays those debts in full, then compiles the data
book — the numbers a designer reaches for — and closes with the module's
veto list and revision map. As throughout the course, every derivation here
is from the stated starting point to the stated result; if a step is
skipped, the skip is named.

**Level.** Graduate throughout; sections 6 to 8 serve all levels as
reference.

## 1. The Langevin function, honestly

A classical moment $\mu$ at angle $\theta$ to field $B$ has energy
$-\mu B\cos\theta$. The Boltzmann-weighted average over the sphere:

$$
\langle\cos\theta\rangle =
\frac{\int_0^\pi \cos\theta\, e^{x\cos\theta}\sin\theta\,d\theta}
{\int_0^\pi e^{x\cos\theta}\sin\theta\,d\theta},
\qquad x = \frac{\mu B}{k_BT}.
$$

Substitute $u = \cos\theta$: the denominator is
$\int_{-1}^{1}e^{xu}du = 2\sinh x/x$, and the numerator is its derivative
with respect to $x$. Therefore

$$
\langle\cos\theta\rangle = \frac{d}{dx}\ln\!\left(\frac{2\sinh x}{x}\right)
= \coth x - \frac{1}{x} = L(x),
$$

lesson 1's result. The small-$x$ expansion $L \approx x/3$ feeds directly
into the Curie law: $M = n\mu L \approx n\mu^2\mu_0H/3k_BT$, giving
$\chi = n\mu_0\mu^2/3k_BT$ — the $1/3$ is the sphere average, nothing
more mysterious.

## 2. Mean-field $T_C$ and the Curie-Weiss shift

Weiss closure: $H_{\rm eff} = H + \lambda M$. In the paramagnetic regime
use the Curie response against the *effective* field:

$$
M = \frac{C}{T}\,(H + \lambda M)
\;\Rightarrow\;
M\left(1 - \frac{C\lambda}{T}\right) = \frac{C}{T}H
\;\Rightarrow\;
\chi = \frac{C}{T - C\lambda}.
$$

One line of algebra converts Curie into Curie-Weiss with
$\theta = C\lambda$: the intercept measures the molecular-field constant.
Spontaneous order onsets where the zero-field equation
$M = (C/T)\lambda M$ admits $M \ne 0$: $T_C = C\lambda = \theta$ — mean
field predicts the Curie point and the Curie-Weiss intercept coincide.
(Measured $\theta$ typically exceeds measured $T_C$ by a few percent;
the discrepancy is short-range order surviving above $T_C$, the first
of many fluctuation corrections mean field ignores — see the veto list.)

## 3. Wall width and energy: the variational trade

Let magnetization rotate by angle $\theta(x)$ across a 180° wall.
Exchange charges for gradients, anisotropy for excursions off-axis:

$$
\sigma_w = \int_{-\infty}^{\infty}
\left[A\left(\frac{d\theta}{dx}\right)^2 + K\sin^2\theta\right]dx.
$$

The Euler-Lagrange equation $2A\,\theta'' = K\sin 2\theta$ integrates once
(multiply by $\theta'$) to $A\theta'^2 = K\sin^2\theta$, the equal-split
of the two energy densities at every point — the standard first integral.
Then $d\theta/\sin\theta = \sqrt{K/A}\,dx$, whose solution is the kink

$$
\theta(x) = 2\arctan\left(e^{x\sqrt{K/A}}\right),
$$

with characteristic width $\delta = \pi\sqrt{A/K}$ (the $\pi$ from the
conventional definition via the maximum-slope tangent). The energy,
using the equal split:

$$
\sigma_w = 2\int K\sin^2\theta\,dx
= 2\sqrt{AK}\int_0^\pi \sin\theta\,d\theta = 4\sqrt{AK}.
$$

Both lesson-2 formulas emerge from one functional and one first integral —
worth internalizing, because the same variational structure returns for
lesson 4's skyrmion profile with DMI added as a linear-in-gradient term.

## 4. The single-domain estimate

Compare the wall's cost against the magnetostatic saving for a sphere of
diameter $d$. Wall cost $\approx \sigma_w \pi d^2/4$ (one equatorial
wall). Magnetostatic energy of the single-domain sphere:
$u = \mu_0M_s^2/6$ per volume ($N = 1/3$), of which subdivision saves
roughly half. Setting savings equal to cost:

$$
\frac{1}{2}\cdot\frac{\mu_0M_s^2}{6}\cdot\frac{\pi d^3}{6}
\approx \sigma_w\,\frac{\pi d^2}{4}
\;\Rightarrow\;
d_c \approx \frac{18\,\sigma_w}{\mu_0 M_s^2} = \frac{72\sqrt{AK}}{\mu_0M_s^2}.
$$

The prefactor is honest to within its own crudeness — rigorous
micromagnetic treatments shift it by factors of order one — but the
scaling $\sqrt{AK}/M_s^2$ is robust and is the figure lesson 3 plotted.

## 5. Julliere from state counting

Tunneling rate per spin channel $\propto g_1(E_F)\,g_2(E_F)$ of the two
electrodes, spin conserved. With polarizations $P_i$ and normalized
densities $g^{\uparrow,\downarrow}_i = (1\pm P_i)/2$:

$$
G_P \propto (1+P_1)(1+P_2) + (1-P_1)(1-P_2) = 2(1+P_1P_2),
$$

$$
G_{AP} \propto (1+P_1)(1-P_2) + (1-P_1)(1+P_2) = 2(1-P_1P_2).
$$

$$
{\rm TMR} = \frac{G_P - G_{AP}}{G_{AP}}
= \frac{2P_1P_2}{1 - P_1P_2}.
$$

The derivation makes the model's blind spots visible: it assumes tunneling
probability independent of orbital character and barrier detail — exactly
the assumption MgO's symmetry filtering violates, which is why lesson 5
demoted Julliere's $P$ to a stack bookkeeping parameter for crystalline
barriers.

## 6. The data book

Magnetic parameters of the module's recurring materials. Values are
representative room-temperature figures for orientation, compiled to one
or two significant figures as calculation inputs; any design commitment
re-derives from a supplier datasheet at the operating temperature — the
course's standing rule.

**Table 1 — order and moments**

| material | $T_C$ or $T_N$ (K) | $M_s$ (MA/m) | moment ($\mu_B$/atom) |
|---|---|---|---|
| Fe (bcc) | 1043 | 1.71 | 2.2 |
| Co (hcp) | 1394 | 1.44 | 1.7 |
| Ni (fcc) | 631 | 0.49 | 0.6 |
| Gd | 293 | 2.0 (at 0 K) | 7.6 |
| Ni₈₀Fe₂₀ (permalloy) | ~850 | 0.80 | — |
| Fe₃O₄ (magnetite) | 858 | 0.48 | ferrimagnetic |
| MnZn ferrite | ~570 | 0.4 | ferrimagnetic |
| IrMn (AF) | $T_N$ ~690 | 0 (net) | pinning layer |

**Table 2 — anisotropy, exchange and walls**

| material | $K$ (J/m³) | $A$ (pJ/m) | $\delta$ (nm) | character |
|---|---|---|---|---|
| permalloy | ~1×10² | 10 | ~990 | ultra-soft |
| Fe | 4.8×10⁴ | 20 | 64 | soft |
| Co | 4.5×10⁵ | 30 | 26 | intermediate |
| CoPtCr media | ~2×10⁵ | 10 | 22 | recording |
| Nd₂Fe₁₄B | 4.9×10⁶ | 8 | 4 | hard |
| SmCo₅ | 1.7×10⁷ | 12 | 2.6 | hardest |

**Table 3 — device numbers**

| quantity | typical value | source lesson |
|---|---|---|
| GMR ratio (device, RT) | 5–15% | 5 |
| TMR, AlOx barrier | 30–70% | 5 |
| TMR, MgO barrier | 100–300% | 5 |
| MTJ RA product | 1–10 Ω·µm² | 5 |
| STT $I_{c0}$ (30 nm cell) | 10–50 µA | 6 |
| retention target $\Delta$ | 60–80 | 3, 6 |
| exchange bias $H_{eb}$ (5 nm film) | 10–50 kA/m | 4 |
| PMA $K_s$ (CoFeB/MgO) | ~1.3 mJ/m² | 4 |
| damping $\alpha_G$ (CoFeB) | 0.005–0.02 | 6 |

Reading the tables together reproduces the module's architecture: Table 2's
$\sqrt{AK}$ column spans walls from a micrometre to atomic scale — the
soft/hard axis; Table 1's Curie points set every thermal budget; Table 3
prices what the physics lets devices extract.

## 7. Critical reading: how magnetic data goes wrong

Four audit rules for consuming magnetic datasheets, each tied to a lesson.
First: *no permeability without conditions* — amplitude, frequency, bias
and temperature all move the loop (lesson 2 section 4); a µᵢ quoted bare
is an advertisement, not a datum. Second: *distinguish intrinsic from
extrinsic* — $M_s$, $K$, $T_C$ are material properties; $H_c$, $M_r$,
$H_{eb}$ belong to the microstructure and the stack, so a "material"
coercivity copied between geometries is a category error (lessons 2, 4).
Third: *check the measurement time* — any quantity involving activation
(superparamagnetic moments, retention, exchange-bias training) depends on
how long the instrument watched (lesson 3's blocking definition). Fourth:
*polarizations are stack properties* once a crystalline barrier is
involved (lesson 5) — a $P$ from an MgO junction does not transfer to an
ohmic contact calculation. The general form of all four: a magnetic number
is a point on a surface of conditions, and honest data travels with its
coordinates.

## 8. Revision map

The module in one paragraph per lesson. (1) Moments exist where shells are
partial; exchange — electrostatics in disguise — orders them, mean field
predicts the collapse at $T_C$, and Curie-Weiss reads the exchange sign
from a straight line. (2) Domains cancel stray fields; walls cost
$4\sqrt{AK}$ over width $\pi\sqrt{A/K}$; hysteresis is wall kinetics
through a defect landscape, splitting magnetism into the soft and hard
industries with the loop area as the price of each. (3) Below $d_c$ a
particle is one switch (Stoner-Wohlfarth astroid); below the blocking
size it forgets by Néel's exponential; recording lives between, governed
by the trilemma. (4) Interfaces supply what bulk denies: PMA by $K_s/t$,
sign-switchable RKKY coupling, exchange bias on loan from
antiferromagnets, DMI chirality and skyrmions. (5) Two spin channels make
GMR from scattering asymmetry and TMR from polarized tunneling; MgO
filters symmetry into near-unity effective polarization. (6) Spin torque
writes with angular momentum; retention, write and read chain to the same
barrier $\Delta$; MRAM's ledger row wins combinational niches, and
damping couples speed to current. The through-line: magnetism is the
course's cleanest case of *energy-scale engineering* — every device is a
deliberate arrangement of exchange, anisotropy, magnetostatics and
thermal energy on one budget sheet.

## 9. Veto list: what this module deliberately does not cover

Named exclusions, so silence is not mistaken for coverage: domain-wall
dynamics and the Walker breakdown; magnonics and spin-wave logic;
spin-flop and metamagnetic transitions; frustrated and quantum magnetism
(spin ice, spin liquids); the microscopic derivation of DMI and of the
spin Hall angle; magnetostriction and magnetoelastic devices;
electromagnet and magnetization-process design at the machine scale; and
biological magnetoreception. Each names a mature field; this module's
boundary is drawn at what its devices required.

## 10. Problems

**P20.37** Complete the small-$x$ expansion of $L(x)$ to third order and
show the leading correction to the Curie law is a $B^3$ term — then
explain why susceptibility measurements are specified at low field.

**P20.38** Repeat section 2's closure for an antiferromagnet: two
sublattices with intra-sublattice constant zero and inter-sublattice
constant $-\lambda$. Show $\chi = C/(T + C\lambda)$ above $T_N$ — the
negative intercept of lesson 1's figure.

**P20.39** Verify by substitution that the kink
$\theta = 2\arctan(e^{x\sqrt{K/A}})$ satisfies
$A\theta'^2 = K\sin^2\theta$.

**P20.40** From Table 2, compute $\delta$ and $\sigma_w$ for SmCo₅ and
for permalloy, and use lesson 3's $d_c$ formula with Table 1's $M_s$
values to explain why one is a permanent-magnet material and the other a
shield material.

### Answers

**A20.37** $\coth x = 1/x + x/3 - x^3/45 + ...$, so
$L(x) = x/3 - x^3/45$. The magnetization picks up a term
$\propto -B^3/T^3$: at high field the response bends below linear, so a
susceptibility extracted at large drive underestimates $\chi$ — hence
"initial susceptibility" is defined in the linear window and datasheets
state the measuring field.

**A20.38** Each sublattice: $M_1 = (C'/T)(H - \lambda M_2)$ and
symmetrically. Adding: $M(1 + C'\lambda/T) = (2C'/T)H$ with $M = M_1+M_2$,
giving $\chi = 2C'/(T + C'\lambda) \equiv C/(T+\theta)$ — Curie-Weiss with
a negative extrapolated intercept, as drawn.

**A20.39** $\theta' = \sqrt{K/A}\cdot 2e^{u}/(1+e^{2u})$ with
$u = x\sqrt{K/A}$; and $\sin\theta = 2\sin(\theta/2)\cos(\theta/2) =
2e^{u}/(1+e^{2u})$ using $\tan(\theta/2) = e^{u}$. Thus
$A\theta'^2 = K\sin^2\theta$ identically.

**A20.40** SmCo₅: $\delta = \pi\sqrt{1.2\times10^{-11}/1.7\times10^{7}}
\approx 2.6$ nm, $\sigma_w \approx 5.7\times10^{-2}$ J/m²; with
$M_s \approx 0.86$ MA/m, $d_c = 72\sqrt{AK}/\mu_0M_s^2 \approx 1.1$ µm.
Permalloy: $\delta \approx 990$ nm, $\sigma_w \approx 1.3\times10^{-4}$
J/m², $d_c \approx 11$ nm. SmCo₅ grains stay single-domain at powder
sizes and resist wall nucleation — a permanent magnet; permalloy can
never sustain hard behaviour (walls glide at 100 A/m fields) but its
enormous permeability swallows flux — a shield. Same two formulas,
opposite ends, both industries.

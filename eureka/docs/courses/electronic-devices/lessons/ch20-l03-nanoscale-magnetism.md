# Nanoscale Magnetism: Single Domains, Superparamagnetism and the Recording Ledger

<!-- covers: 20.2 -->

Shrink a magnet and its physics reorganizes twice. At the first threshold —
around the wall width of lesson 2 — the particle can no longer afford a
domain wall and becomes a **single domain**, reversing all at once. At the
second — set by an exponential in volume — thermal energy flips the whole
moment spontaneously and the particle forgets: **superparamagnetism**. Forty
years of magnetic recording were played out between those two thresholds,
and every nanoparticle technology from MRI contrast to cancer hyperthermia
lives on one side or the other by design. This lesson computes both
boundaries and prices what they permit.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate; section 6
problems.

## 1. The single-domain threshold

A large particle splits into domains to cancel its external field (lesson
2). But subdivision only pays while the wall it requires costs less than the
magnetostatic energy it saves. Wall cost scales with cross-section
($\sigma_w d^2$); magnetostatic saving scales with volume
($\mu_0 M_s^2 d^3$). Below a critical size the wall loses:

$$
d_c \approx \frac{72\sqrt{AK}}{\mu_0 M_s^2},
$$

the standard spherical-particle estimate combining lesson 2's wall energy
with the magnetostatic term. The formula's structure teaches the design
space: *hard* materials (large $K$) and *weak* magnetizations (small $M_s$)
stay single-domain at large sizes, because their walls are expensive and
their stray fields cheap.

![Critical single-domain diameter against saturation magnetization for a hard and a soft anisotropy, from the standard estimate: hard, weakly magnetized particles stay single-domain at sizes where soft strong magnets have long since split.](/courses/electronic-devices/figures/m20-single-domain.svg)

Numbers: iron's $d_c$ is a mere ~15 nm, permalloy's similar, while
Nd₂Fe₁₄B and SmCo₅ stay single-domain to hundreds of nanometres and hard
ferrites to a micrometre. This is why hard-magnet powders behave as
assemblies of elementary switches — the granular medium every recording
technology exploited.

## 2. Stoner-Wohlfarth: the elementary switch

A single-domain particle has one collective degree of freedom: the angle of
its moment. With uniaxial anisotropy $K$ and a field applied at angle
$\psi$ to the easy axis, the energy per unit volume is

$$
u(\theta) = K\sin^2\theta - \mu_0 M_s H\cos(\theta-\psi),
$$

and minimizing it gives the complete switching behaviour of the ideal
particle. Along the easy axis the loop is perfectly square with switching
field equal to the **anisotropy field**,

$$
H_K = \frac{2K}{\mu_0 M_s};
$$

at other angles the switching field falls, tracing the **astroid**:

![The Stoner-Wohlfarth astroid, computed from its parametric form: field vectors ending inside leave both states stable, outside force a switch. A transverse field component lowers the easy-axis field needed.](/courses/electronic-devices/figures/m20-stoner-wohlfarth.svg)

The astroid is a working engineering chart, not an ornament. Early magnetic
RAM addressed bits with two orthogonal field pulses, each too small to
switch alone ($h = 0.5$), together landing outside the astroid at 45° —
selectivity by geometry. Its minimum at 45°, where switching costs only
half of $H_K$, is likewise why recording heads write at an angle and why
lesson 6's spin-torque designs add a transverse kick to cut write current.

### Worked example 2.1 — a recording grain's switching field

A CoPtCr recording grain has $K = 2\times10^{5}$ J/m³ and
$M_s = 5\times10^{5}$ A/m. Easy-axis switching field:

$$
H_K = \frac{2K}{\mu_0 M_s}
= \frac{2\times2\times10^{5}}{(4\pi\times10^{-7})(5\times10^{5})}
\approx 6.4\times10^{5}\ {\rm A/m} \approx 0.8\ {\rm T}.
$$

A write head must deliver of order a tesla within a bit-length of the
medium — which is exactly what head design (soft yokes concentrating flux,
lesson 2's permalloy franchise) exists to do, and the number that rises
intolerably if $K$ is raised for stability, setting up section 4's
trilemma.

## 3. Superparamagnetism: when the magnet forgets

A single-domain particle's two easy states are separated by the barrier
$\Delta E = KV$. Thermal fluctuations attempt the crossing at gigahertz
rates, succeeding with Arrhenius probability — the **Néel relaxation
time**:

$$
\tau = \tau_0\,\exp\!\left(\frac{KV}{k_BT}\right),
\qquad \tau_0 \sim 10^{-9}\ {\rm s}.
$$

The exponential makes the transition from "magnet" to "no magnet"
astonishingly sharp in size:

![Neel relaxation time against the barrier ratio, with the one-second and ten-year landmarks: the entire technological range from sensor to archive spans barely a factor of three in particle diameter.](/courses/electronic-devices/figures/m20-neel-relaxation.svg)

At $KV/k_BT = 25$ the moment holds for about a second; at 41, ten years; at
60, geological time — and since $V\propto d^3$, those thresholds differ by
only ~35% in diameter. A particle above its **blocking temperature**
(equivalently, below its blocking size) behaves as a paramagnet with a
*giant* moment — thousands of Bohr magnetons flipping as one — hence
*super*-paramagnetism: Langevin response, zero hysteresis, and saturation
in modest fields because the moment in the exponent is enormous:

![Computed room-temperature Langevin curves for six and twelve nanometre magnetite particles: no hysteresis, and the larger particle saturates far more steeply because its collective moment grows with the cube of diameter.](/courses/electronic-devices/figures/m20-langevin-nanoparticle.svg)

Both sides of the threshold are products. Below it: ferrofluids (sealing,
loudspeaker cooling), MRI contrast agents (the giant moment dephases
protons), magnetic hyperthermia (AC-field losses heat tumours), magnetic
separation in diagnostics — all needing *zero* remanence so particles do
not aggregate. Above it: every recording medium and every MRAM cell, where
the same exponential is the retention guarantee.

### Worked example 3.1 — the blocking diameter

Magnetite nanoparticles, $K = 1.4\times10^{4}$ J/m³, measured by an
instrument averaging over 100 s. Blocking condition
$\tau = 100$ s $\Rightarrow KV/k_BT = \ln(100/10^{-9}) \approx 25.3$:

$$
V = \frac{25.3\,k_BT}{K}
= \frac{25.3\times(1.38\times10^{-23})(300)}{1.4\times10^{4}}
\approx 7.5\times10^{-24}\ {\rm m^3}
\;\Rightarrow\; d \approx 24\ {\rm nm}.
$$

Below 24 nm the assay sees superparamagnetism, above it hysteresis — *for
that instrument*. A faster probe (Mössbauer, $10^{-8}$ s) blocks the same
particle at a smaller size: blocking is a property of the pair
(particle, measurement time), a definitional care this course has met
before in module 19's ellipsometry models.

### Worked example 3.2 — a hyperthermia dose

A therapy fluid uses 15 nm magnetite ($V = 1.8\times10^{-24}$ m³,
$KV/k_BT \approx 6$) in a 100 kHz field. Optimal heating occurs when the
Néel time matches the field period, $\omega\tau \approx 1$:
$\tau = 1.6\times10^{-6}$ s needs $KV/k_BT = \ln(1.6\times10^{-6}/10^{-9})
\approx 7.4$ — close to the design's 6. The dissipated power per particle
scales with the hysteresis-like loop the lagging moment traces; particles
much smaller relax too fast (no lag, no heat), much larger cannot respond
(blocked). The therapy is a resonance in disguise, and its dosimetry is
this lesson's arithmetic.

## 4. The recording trilemma and its escapes

Storage density asks for smaller grains. Three requirements then collide —
the **magnetic recording trilemma**:

1. **Signal-to-noise** wants many grains per bit (noise falls as
   $1/\sqrt{N}$), pushing grain volume $V$ down.
2. **Retention** wants $KV/k_BT \gtrsim 60$, pushing $V$ up — or $K$ up.
3. **Writability** wants the head to deliver $\sim H_K = 2K/\mu_0M_s$,
   capping $K$ at what a saturated write pole (~2.4 T of usable field) can
   switch.

Every escape in the industry's history is an attack on one vertex.
Perpendicular recording (2005) improved the geometry, letting the same head
field switch higher-$K$ grains. Exchange-coupled composite media split each
grain into a soft "handle" and a hard "anchor" — the handle lowers the
switching field, the anchor keeps the barrier. Heat-assisted recording
(HAMR) breaks the writability constraint outright: a laser momentarily
heats the bit near its Curie point (lesson 1), where $H_K$ collapses, and
the data is written cold-stable at $K$ values no head could touch. The
trilemma is this module's version of a recurring course pattern: a
three-way constraint that technology does not solve but *circulates*,
buying one vertex with ingenuity at another.

## 5. Graduate extension: thermal switching statistics

The Néel exponential governs not just retention but *error rates*, and
turning it into a specification is a statistics problem. A bit held for
time $t$ flips with probability

$$
P_{\rm flip} = 1 - \exp\!\left(-\frac{t}{\tau}\right)
\approx \frac{t}{\tau_0}e^{-\Delta}, \qquad \Delta = \frac{KV}{k_BT},
$$

and a drive with $N$ bits demands $NP_{\rm flip}$ small over a decade. For
$N = 10^{13}$ grains and $t = 10$ years, requiring fewer than one thermal
error in the fleet needs $e^{-\Delta} \lesssim 10^{-31}$: $\Delta \gtrsim
71$, not the naive 41 that holds one *average* bit. The population moved
the requirement by thirty units — the same mean-versus-tail displacement as
lesson 2's coercivity and module 21's yield curves. Distributions sharpen
the point: grain volumes are log-normal, and the error rate is dominated by
the small-volume tail, so medium engineering is as much about *tightening
the grain-size distribution* as about raising its mean. When lesson 6
carries $\Delta \approx 60$-plus-margin into MRAM retention budgets, this
is the calculation being invoked.

## 6. Problems

**P20.13** Estimate $d_c$ for magnetite ($A = 1.3\times10^{-11}$ J/m,
$K = 1.4\times10^{4}$ J/m³, $M_s = 4.8\times10^{5}$ A/m) and compare with
the blocking diameter of worked example 3.1. What does the ordering of the
two numbers imply about magnetite particles between them?

**P20.14** A Stoner-Wohlfarth particle sees a field at 45°, where the
astroid gives switching at $0.5H_K$. Its easy-axis neighbours in a
crosspoint array see only the single-axis half-select field $0.5H_K$ along
the easy axis. Explain, from the astroid figure, why the addressed bit
switches and the half-selected bits do not, and name the failure mode when
anisotropy varies from bit to bit.

**P20.15** For $\tau_0 = 10^{-9}$ s, compute the barrier $\Delta$ needed
for $\tau =$ 1 ms, 1 s, 1 year, and 100 years. What diameter change spans
that whole range for a fixed-$K$ spherical particle?

**P20.16** An MRI contrast particle must stay superparamagnetic
($\tau < 10^{-3}$ s) at body temperature. For magnetite's $K$, what is the
maximum diameter? Why is aggregation into dimers a clinical failure by this
same arithmetic?

**P20.17** A medium's grains have $\Delta$ log-normally distributed with
median 75 and $\sigma = 0.1$ (of $\ln\Delta$). Using section 5's fleet
requirement $\Delta \ge 71$, estimate what fraction of grains is
noncompliant. (A one-line normal-tail estimate suffices.)

**P20.18** HAMR writes at 700 K where $K$ has collapsed, then stores at
300 K where $K$ is large. Explain, with the Néel formula, why the *write
temperature's* $\Delta$ can be of order one while the *storage* $\Delta$
exceeds 70 — and why the medium must cool through the intermediate
temperatures quickly.

### Answers

**A20.13** $d_c = 72\sqrt{AK}/(\mu_0M_s^2) =
72\sqrt{1.82\times10^{-7}}/[(4\pi\times10^{-7})(2.3\times10^{11})]
\approx 106$ nm. Blocking (100 s) was 24 nm: between 24 and 106 nm a
magnetite particle is single-domain *and* thermally stable — the useful
recording window. Below 24 nm it forgets; above 106 nm it splits into
domains and stops behaving as one switch.

**A20.14** The 45° field vector of magnitude $0.5H_K\sqrt{2}\cdot
(\cos,\sin)$ components $(0.5, 0.5)$ ends outside the astroid (its 45°
minimum is at $h = 0.5$, i.e. total field $0.5H_K$); the half-selected
bits' vectors $(0.5, 0)$ end inside. Bit-to-bit $H_K$ spread blurs the
astroid into a band; when the bands of "must switch" and "must not"
overlap, write errors appear — the disturb problem that killed
field-written MRAM and motivated spin torque (lesson 6).

**A20.15** $\Delta = \ln(\tau/\tau_0)$: 13.8, 20.7, 38.9 ($1$ yr
$=3.15\times10^{7}$ s), 43.5. Since $\Delta \propto d^3$, the diameter
ratio is $(43.5/13.8)^{1/3} \approx 1.47$: the whole span from millisecond
sensor to century archive is 47% in diameter.

**A20.16** $\Delta \le \ln(10^{-3}/10^{-9}) = 13.8$:
$V \le 13.8k_BT/K = 4.2\times10^{-24}$ m³ at 310 K, $d \le 20$ nm. A dimer
doubles $V$, pushing $\Delta$ to ~28 and $\tau$ to seconds: the particle
develops remanence, aggregates further in its own field, and the cascade
embolizes — superparamagnetism is the safety property.

**A20.17** Noncompliant fraction $= P(\ln\Delta < \ln 71)$ with mean
$\ln 75$: $z = \ln(71/75)/0.1 = -0.55$, giving $\approx 29\%$. A median
comfortably above spec still leaves a third of grains below it at this
spread — the tail, not the mean, is the product.

**A20.18** $\Delta(T) = K(T)V/k_BT$: at 700 K, $K$ has collapsed near the
Curie point so $\Delta \sim 1$ and the head's modest field writes freely;
at 300 K the restored $K$ gives $\Delta > 70$. The danger window is
mid-cooling, where $\Delta \sim 20$–40: stable enough to hold an error,
unstable enough to acquire one from a neighbour's stray field — hence the
medium's thermal design targets nanosecond cooling through that band.

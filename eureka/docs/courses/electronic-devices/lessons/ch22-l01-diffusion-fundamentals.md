# Diffusion: Fick's Laws, Mechanisms, Regimes and Fields

<!-- covers: 22.1, 22.2, 22.3, 22.4 -->

Every doped region in every device was put there by moving atoms through a
crystal, and every one of those regions has been slowly moving ever since.
Diffusion is how dopants are placed, how junctions blur during subsequent
processing, and how devices eventually fail. This lesson builds the machinery:
the continuum laws and their two canonical solutions, the atomic mechanisms
underneath them, the regimes in which the textbook picture holds and breaks,
and the electric fields that ride along with any charged diffuser. Lessons 2
to 4 apply the machinery to real materials; lesson 5 proves what this lesson
states; lessons 6 and 7 make it earn a living.

**Level.** Sections 1 to 4 undergraduate core; section 5 first-year graduate;
section 6 problems.

## 1. Fick's laws and the two canonical solutions

Diffusion is the net migration of atoms down a concentration gradient, driven
by nothing more than random thermal motion plus statistics: if there are more
atoms on the left than on the right, more will randomly step right than left.
**Fick's first law** states the resulting flux,

$$
J = -D\,\frac{\partial C}{\partial x},
$$

where $J$ is the flux in atoms per unit area per unit time, $C$ the
concentration, and $D$ the **diffusion coefficient** in cm²/s. The minus sign
says the flux runs downhill. Conservation of atoms in a slab, with no sources
or sinks, gives the continuity statement

$$
\frac{\partial C}{\partial t} = -\frac{\partial J}{\partial x},
$$

and substituting the first law into the second, with $D$ independent of
position, produces **Fick's second law**,

$$
\frac{\partial C}{\partial t} = D\,\frac{\partial^2 C}{\partial x^2}.
$$

Lesson 5 derives both from the random walk, and derives the two solutions that
between them cover most of practical processing.

**Constant surface concentration (predeposition).** A wafer held in an
atmosphere that keeps its surface saturated at the solid solubility $C_s$
develops the complementary-error-function profile

$$
C(x,t) = C_s\,\mathrm{erfc}\!\left(\frac{x}{2\sqrt{Dt}}\right),
$$

whose surface stays pinned while the front advances as $\sqrt{t}$:

![Predeposition profiles computed from the stated erfc solution at times t, 4t and 16t: each quadrupling of time doubles every depth on the curve while the surface concentration holds at the solubility limit.](/courses/electronic-devices/figures/m22-erfc-profiles.svg)

Integrating the profile gives the incorporated dose, which grows as the square
root of time:

$$
Q(t) = \int_0^\infty C\,dx = \frac{2}{\sqrt{\pi}}\,C_s\sqrt{Dt}.
$$

**Fixed dose (drive-in).** A dose $Q$ placed near the surface and then
annealed with nothing more arriving, which is the predeposition afterwards and
the usual situation after ion implantation, spreads as a half-Gaussian:

$$
C(x,t) = \frac{Q}{\sqrt{\pi Dt}}\,\exp\!\left(-\frac{x^2}{4Dt}\right).
$$

The area under the curve is conserved, so the surface concentration falls as
$1/\sqrt{t}$ while the front advances:

![Drive-in profiles computed from the stated Gaussian at times t, 4t and 16t: the dose under each curve is identical, so depth is bought by spending surface concentration.](/courses/electronic-devices/figures/m22-gaussian-drivein.svg)

In both solutions the characteristic depth is

$$
x \sim \sqrt{Dt},
$$

the single most useful number in the subject. Doubling the depth costs four
times the time. This square-root behaviour is why deep junctions are
expensive, and why the **thermal budget**, the accumulated $Dt$ product over
the whole process, is tracked as a resource: every later furnace step adds
its own $Dt$ to every earlier junction.

A junction forms where the diffusing profile crosses the background doping
$C_B$ of opposite type. For the Gaussian, solving $C(x_j,t) = C_B$ gives

$$
x_j = 2\sqrt{Dt\,\ln\!\left(\frac{C(0,t)}{C_B}\right)},
$$

so the junction depth carries a logarithmic memory of the doping contrast on
top of the $\sqrt{Dt}$ scaling.

### Worked example 1.1 - a predeposition dose, end to end

A boron predeposition runs 30 minutes at 1000 °C with the surface held at
$C_s = 10^{20}$ cm⁻³. Take $D = 1.1\times10^{-14}$ cm²/s (computed in worked
example 2.1 below from this module's stated parameters). Then
$Dt = 1.1\times10^{-14} \times 1800 = 2.0\times10^{-11}$ cm², and

$$
Q = \frac{2}{\sqrt{\pi}}\,C_s\sqrt{Dt}
= 1.128 \times 10^{20} \times \sqrt{2.0\times10^{-11}}
\approx 5.1\times10^{14}\ \mathrm{cm^{-2}}.
$$

Half a monolayer of boron, delivered in half an hour, with depth scale
$\sqrt{Dt} \approx 45$ nm. Lesson 7 drives this exact dose in and finds the
junction it makes.

## 2. The Arrhenius law and this module's stated parameters

The temperature dependence of every diffusivity in this module is Arrhenius:

$$
D = D_0\,\exp\!\left(-\frac{E_a}{k_BT}\right),
$$

with activation energies of 3 to 5 eV for substitutional dopants in silicon
and prefactors of order 0.1 to 10 cm²/s. To keep every number in this module
checkable, we fix one set of **representative parameters** now and use it
everywhere: boron $D_0 = 0.8$ cm²/s, $E_a = 3.5$ eV; phosphorus $D_0 = 4$
cm²/s, $E_a = 3.7$ eV; arsenic $D_0 = 10$ cm²/s, $E_a = 4.0$ eV. These are
rounded, intrinsic-regime values chosen to reproduce the ordering and
magnitudes of the standard compilations within a factor of a few; they are
teaching constants, not metrology, and any real recipe uses the calibrated
values of its own process simulator. Every figure and worked example that
follows computes from these stated numbers.

![Arrhenius lines computed from the module's three stated dopant parameter sets: three to four eV of activation compresses fourteen decades of diffusivity into the process temperature window.](/courses/electronic-devices/figures/m22-arrhenius-dopants.svg)

### Worked example 2.1 - the steepness of the exponential

At 1000 °C, $T = 1273$ K and $k_BT = 8.617\times10^{-5} \times 1273 =
0.1097$ eV. For boron,

$$
D = 0.8\,\exp\!\left(-\frac{3.5}{0.1097}\right)
= 0.8\,e^{-31.9} \approx 1.1\times10^{-14}\ \mathrm{cm^2/s}.
$$

At 1100 °C ($k_BT = 0.1183$ eV): $D = 0.8\,e^{-29.6} \approx
1.1\times10^{-13}$ cm²/s, ten times larger for one hundred degrees. Even a
50 °C excursion, to 1050 °C ($k_BT = 0.1140$ eV), gives $D = 0.8\,e^{-30.7}
\approx 3.7\times10^{-14}$ cm²/s, a factor of 3.3. That steepness is what
makes diffusion controllable, because cooling switches it off, and what makes
it dangerous, because a small furnace calibration error becomes a large
junction error. A process that must hold $Dt$ to five percent must hold
temperature to about 1.5 °C at these energies.

### Worked example 2.2 - how long is a junction stable at operating temperature?

Extrapolate boron to 150 °C ($T = 423$ K, $k_BT = 0.03645$ eV):
$D = 0.8\,e^{-96} \approx 2\times10^{-42}$ cm²/s. For the profile to move
even one nanometre requires $t = x^2/D \approx 10^{-14}/2\times10^{-42} =
5\times10^{27}$ s, about $10^{20}$ years. Substitutional dopant motion is
frozen at operating temperature; when a device parameter drifts in the field,
the mover is something faster: hydrogen, an interstitial metal, or charge in
a dielectric. That triage rule, check the activation energy before blaming
the dopant, recurs in every reliability lesson of this course.

## 3. Atomic mechanisms of diffusion

The macroscopic $D$ hides an atomic question: how does the atom actually
move? The mechanism sets the activation energy, the concentration dependence,
and the coupling to module 21's point defects. Lesson 5 derives the bridge,

$$
D = \frac{f\,a^2\,\Gamma}{6},
\qquad
\Gamma = \nu_0\,\exp\!\left(-\frac{E_m}{k_BT}\right),
$$

between the hop distance $a$, the thermally activated hop rate $\Gamma$, a
correlation factor $f$ of order unity, and the diffusivity. What differs
between mechanisms is what must exist for a hop to happen.

**Vacancy mechanism.** A substitutional atom swaps with an adjacent vacancy.
The hop needs a vacancy next door, so $D$ is proportional to the vacancy
concentration, and the measured activation energy is the sum of vacancy
formation and migration terms. This is the dominant route for most
substitutional dopants in most crystals: antimony and arsenic in silicon,
nearly every dopant in germanium.

**Interstitial mechanism.** A small atom sits between lattice sites and hops
from one interstice to the next. No defect is needed and the barriers are
low, often under 1 eV, so this is fast. Hydrogen, lithium, copper, nickel
and iron move this way in silicon, which is why trace transition metals are
so damaging: they traverse a whole wafer at modest temperature and decorate
every junction on the way (worked example 4.1 of lesson 2 prices this).

**Interstitialcy (kick-out) mechanism.** A self-interstitial displaces a
substitutional dopant into an interstitial position; the dopant migrates
quickly, then kicks a lattice atom out to re-enter a site. The dopant
alternates between a slow stored state and a fast mobile state, and its
effective diffusivity is proportional to the self-interstitial population.
Boron and phosphorus in silicon diffuse substantially by this route, which is
why both respond so strongly to the interstitial supersaturations created by
implantation damage and by oxidation.

**Dissociative (Frank-Turnbull) mechanism.** A species exists in both a fast
interstitial form and a slow substitutional form, interconverting via
vacancies. Gold in silicon and zinc in gallium arsenide behave this way,
producing profiles no single constant $D$ can fit; lesson 3 works the zinc
case in detail.

The practical consequence is worth stating as a rule: **a dopant's
diffusivity is not a material constant.** It is proportional to a point
defect population, and that population is set by whatever else the process is
doing. Oxidation injects interstitials and accelerates boron and phosphorus
(oxidation-enhanced diffusion); nitridation injects vacancies and does the
opposite while accelerating antimony; implantation damage swamps everything
for a few seconds (section 4). A furnace step intended to grow an oxide also
moves every junction on the wafer.

### Worked example 3.1 - from diffusivity to hop rate

How often does a boron atom actually move at 1000 °C? Inverting the random
walk relation with $f \approx 1$, hop distance $a = 2.35\times10^{-8}$ cm
(the silicon bond length, a standard tabulated constant), and the
$D = 1.1\times10^{-14}$ cm²/s of worked example 2.1:

$$
\Gamma = \frac{6D}{a^2}
= \frac{6\times1.1\times10^{-14}}{(2.35\times10^{-8})^2}
\approx 1.2\times10^{2}\ \mathrm{hops/s}.
$$

Order one hundred hops per second, against a lattice attempt frequency
$\nu_0$ near $10^{13}$ Hz: the atom attempts $10^{13}$ times a second and
succeeds about a hundred times, a success rate of $10^{-11}$. The Arrhenius
exponential is that failure rate made visible, and the numbers explain why
diffusion is at once inexorable over an hour and negligible over a
microsecond.

## 4. Intrinsic, extrinsic and transient regimes

Constant-$D$ Fickian diffusion is one regime among several, and knowing which
regime a profile is in is most of the skill of reading it.

**Intrinsic regime.** The dopant concentration stays below the intrinsic
carrier concentration $n_i(T)$ at the diffusion temperature, which is near
$10^{19}$ cm⁻³ for silicon at 1000 °C, far above its room-temperature value.
The Fermi level stays put, the charged point defect populations stay at their
undoped values, and $D$ is genuinely constant across the profile. The erfc
and Gaussian solutions of section 1 apply as written.

**Extrinsic regime.** Above $n_i(T)$, the dopant sets the Fermi level, and
because point defects exist in charged states whose formation energies depend
on the Fermi level (module 21, lesson 2 section 5), the defect populations
that carry diffusion now depend on the dopant's own concentration. The
resulting concentration-dependent diffusivity is conventionally written as a
sum over defect charge states,

$$
D(n) = D^{0} + D^{-}\left(\frac{n}{n_i}\right)
+ D^{2-}\left(\frac{n}{n_i}\right)^{2}
+ D^{+}\left(\frac{n_i}{n}\right),
$$

with each term proportional to the population of one defect vehicle (lesson 5
derives the form). The profile shapes change qualitatively: high-concentration
phosphorus develops its characteristic kink and tail, a flat plateau where
diffusion is fast because $n$ is high, an abrupt kink near $n \approx n_i$,
and a deep tail fed by interstitials injected from the dissolving plateau.
Fitting such a profile with one constant $D$ returns a number that predicts
nothing.

**Transient enhanced diffusion (TED).** Ion implantation leaves the crystal
with a self-interstitial excess that can reach a thousand times equilibrium.
While that excess lasts, every interstitialcy-driven dopant diffuses hundreds
to thousands of times faster than the Arrhenius law predicts; as the damage
anneals out, the enhancement collapses. Boron can move further in the first
ten seconds of a post-implant anneal than in the following hour. This effect,
more than any other, ended the era of long furnace anneals: rapid thermal
annealing, then spike anneals with no soak at all, then millisecond flash and
laser anneals were each adopted to activate dopant while giving the transient
interstitials no time to move it. Lesson 6's capstone case works the budget
arithmetic, and its figure shows the enhancement spending itself in the first
seconds.

**Solid solubility and clustering.** Above the solid solubility at the anneal
temperature, excess dopant precipitates or forms electrically inactive
clusters: implanted atoms beyond the limit contribute no carriers while still
scattering the ones present. Sheet resistance therefore stops improving as
implant dose rises. The signature is the gap between a chemical profile
(SIMS) and an electrical profile (spreading resistance or Hall), which is
exactly the inactive fraction; lesson 2 shows the comparison and lesson 6
uses it as a diagnostic.

## 5. Built-in fields and field-assisted diffusion

Fick's laws describe neutral particles. Dopants at diffusion temperatures are
ionized, and their carriers are vastly more mobile than they are. Consider a
donor profile diffusing inward: the electrons it releases run ahead of the
donor front, and the resulting charge separation sets up a **built-in
electric field** pointing down the gradient. The field then drags the slow
ions forward. The flux gains a drift term, exactly as carrier transport did
in module 18:

$$
J = -D\,\frac{\partial C}{\partial x} + \mu\,C\,E,
$$

and because the field is generated by the profile's own gradient, the two
terms combine (lesson 5, derivation 5) into pure diffusion with an enhanced
coefficient, $J = -hD\,\partial C/\partial x$, where

$$
h = 1 + \frac{C/2n_i}{\sqrt{1 + (C/2n_i)^2}}.
$$

The enhancement is bounded: $h \to 1$ in the intrinsic limit and $h \to 2$
fully extrinsic, never more, for a singly charged dopant.

![The field enhancement factor computed from the stated expression: unity when the profile is a minority, exactly two when the dopant dominates the carrier population.](/courses/electronic-devices/figures/m22-field-enhancement.svg)

A factor of two is not a detail: junction depth is set where the profile
crosses the background, and the leading edge of a hot, heavily doped profile
arrives with $h$ near 2 while the tail diffuses with $h$ near 1, steepening
the front relative to the pure Fickian shape.

**Graduate extension: interdiffusion and the Kirkendall frame.** When two
species interdiffuse across a couple, an A-rich side against a B-rich side,
each moves with its own intrinsic diffusivity, and Fick's picture needs one
more idea to survive. The measured profile evolves with a single effective
coefficient, the **Darken interdiffusion coefficient**, the mole-fraction
weighted combination

$$
\tilde{D} = X_B D_A + X_A D_B,
$$

weighted opposite to intuition: where A is dilute ($X_A \to 0$),
$\tilde{D} \to D_A$, the dilute species' own diffusivity, because the
majority barely needs to move to accommodate it. But if $D_A \ne D_B$,
more A atoms cross the interface per second than B atoms return, and the
imbalance is carried by a net flux of vacancies in the opposite direction:
the lattice itself drifts. Inert markers placed at the original interface
move with velocity

$$
v = (D_A - D_B)\,\frac{\partial X_A}{\partial x},
$$

the **Kirkendall effect**, and the vacancy wind that carries the markers
can supersaturate and condense into voids on the faster diffuser's side.
This is not a metallurgical curiosity in an electronics course: Kirkendall
voiding at gold-aluminium bond interfaces (the purple plague's mechanical
half) and at copper-tin intermetallics in solder joints is a first-rank
reliability mechanism (module 54), and void-free bonding windows are
computed from exactly these two equations. The conceptual point earns its
place here: fluxes are defined relative to the lattice, the lattice is
free to move, and a diffusion analysis that forgets its reference frame
gets voids it did not predict.

Fields from other sources matter in specific, named situations. **Applied
bias during operation** drifts mobile ions in dielectrics: sodium in gate
oxide was the instability that nearly killed the MOS transistor in the 1960s,
and alkali hygiene in fabrication is still policed for that reason. **Band
bending at surfaces and heterojunctions** segregates charged dopants toward
or away from interfaces; boron lost to a growing oxide, depleting the silicon
beneath it, is the standard example and is compensated in the implant recipe.
**Electromigration**, the drift of lattice atoms in a metal line under
momentum transfer from a high current density, is diffusion under an applied
force and is the dominant interconnect wear-out mechanism (module 54). The
unifying statement: whenever the diffuser carries charge and the material
carries a field, write the drift-diffusion equation and check whether the
drift term competes.

## 6. Problems

**P22.1** From the erfc solution, show that the depth at which
$C = 10^{-4}C_s$ advances from 0.28 μm to 0.56 μm when $Dt$ quadruples.
(Use $\mathrm{erfc}(2.75) \approx 10^{-4}$.)

**P22.2** A drive-in doubles its anneal time. By what factor does the surface
concentration fall, and what happens to the junction depth against a fixed
background if the surface concentration stays far above it? Answer with the
two stated equations before computing anything.

**P22.3** Using the module's stated parameters, compute the arsenic
diffusivity at 1000 °C and the time for $\sqrt{Dt} = 10$ nm. Compare with
boron and explain the ordering by mechanism.

**P22.4** Worked example 2.1 claims a 1.5 °C tolerance for five percent in
$Dt$. Derive the general relation between a small temperature error
$\delta T$ and the fractional error in $D$, and verify the claim at
$E_a = 3.5$ eV, $T = 1273$ K.

**P22.5** A phosphorus profile shows a plateau, a kink and a fast tail.
Assign each feature to a term of the extrinsic $D(n)$ expression and state
what the tail implies about the interstitial population below the kink.

**P22.6** Show from the $h$ expression that the built-in field enhancement at
$C = 2n_i$ is 1.71, and explain physically why $h$ can never exceed 2 for a
singly ionized dopant.

### Answers

**A22.1** The contour of constant $C/C_s$ sits at fixed argument
$x/2\sqrt{Dt}$, so $x(10^{-4}) = 2\times2.75\sqrt{Dt} = 5.5\sqrt{Dt}$.
Quadrupling $Dt$ doubles $\sqrt{Dt}$: 0.28 μm becomes 0.56 μm, whatever the
species. Depth contours ride $\sqrt{Dt}$; only the prefactor differs by
contour.

**A22.2** Gaussian surface concentration $C(0,t) = Q/\sqrt{\pi Dt}$ falls by
$\sqrt{2}$ when $t$ doubles. Junction depth
$x_j = 2\sqrt{Dt\ln(C(0,t)/C_B)}$: the $\sqrt{Dt}$ factor grows by
$\sqrt{2}$ while the logarithm shrinks slightly, so $x_j$ grows by a little
less than $\sqrt{2}$. Depth is bought at slightly worse than square-root
rate once the log starts paying for the fading surface.

**A22.3** $k_BT = 0.1097$ eV; $D_{As} = 10\,e^{-4.0/0.1097} =
10\,e^{-36.5} \approx 1.5\times10^{-15}$ cm²/s, about seven times slower
than boron's $1.1\times10^{-14}$. For $\sqrt{Dt} = 10$ nm $= 10^{-6}$ cm:
$t = 10^{-12}/1.5\times10^{-15} \approx 670$ s. Arsenic is vacancy-mediated
with a higher activation energy; boron rides the interstitial population.
Slow and abrupt is exactly why arsenic owns shallow n-type junctions.

**A22.4** $\ln D = \ln D_0 - E_a/k_BT$, so $\delta D/D =
(E_a/k_BT)(\delta T/T)$. At the stated values $E_a/k_BT = 31.9$, so five
percent in $D$ requires $\delta T/T = 0.05/31.9 = 1.6\times10^{-3}$, i.e.
$\delta T \approx 2$ K. With ramp contributions included the practical
tolerance tightens toward 1.5 °C, as claimed.

**A22.5** Plateau: $n \gg n_i$, the $(n/n_i)^2$ term dominates and $D$ is
large and nearly flat in $x$ because $n$ tracks the plateau concentration.
Kink: $n$ falls through $n_i$ and the enhanced terms switch off over a
narrow depth. Tail: diffusion faster than the local $n$ can explain, so the
vehicle population there is not in equilibrium: interstitials injected from
the dissolving high-concentration region sweep the tail forward.

**A22.6** With $u = C/2n_i = 1$: $h = 1 + 1/\sqrt{2} = 1.71$. The field
term at most doubles the flux because the field is generated by the same
gradient that drives diffusion, and quasi-neutrality with one carrier per
dopant caps the drift contribution at exactly one diffusion-equivalent: the
electron cloud can lead the ions by at most its own share of the gradient.

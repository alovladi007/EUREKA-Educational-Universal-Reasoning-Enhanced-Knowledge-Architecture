# Diffusion in the Melt, the Meyer-Neldel Rule, and What Diffusion Explains

<!-- covers: 22.11, 22.12, 22.13, 22.14 -->

The module closes where the crystal begins, in the liquid, then steps back
twice: once for an empirical regularity that spans every activated process in
this course, and once for the synthesis of what the diffusion picture buys.

**Level.** Sections 1 to 3 undergraduate core; section 4 graduate-flavoured
but essential lore; sections 5 and 6 synthesis; section 7 problems.

## 1. Diffusion in the melt

Crystal growth (modules 28 to 32) is a transport problem before it is a
crystallography problem, and the transport happens in liquid. A melt has no
lattice, so motion needs no defect and crosses no 3-eV barrier: the
appropriate model is a particle dragged through a viscous fluid, the
**Stokes-Einstein relation**,

$$
D = \frac{k_BT}{6\pi\,\eta\,r},
$$

with $\eta$ the melt viscosity and $r$ the effective radius of the moving
species.

### Worked example 1.1 - the melt diffusivity of a dopant in liquid silicon

Liquid silicon near its melting point has a tabulated viscosity of about
$\eta = 7\times10^{-4}$ Pa·s, comparable to water. Take an atomic radius
$r = 1.2\times10^{-10}$ m and $T = 1685$ K:

$$
D = \frac{1.381\times10^{-23}\times1685}
{6\pi\times7\times10^{-4}\times1.2\times10^{-10}}
= \frac{2.33\times10^{-20}}{1.58\times10^{-12}}
\approx 1.5\times10^{-8}\ \mathrm{m^2/s},
$$

that is $1.5\times10^{-4}$ cm²/s: about ten orders of magnitude above
solid-state dopant diffusivities at the same temperature. Liquid transport
is effectively free; every uniformity problem in growth comes from
somewhere else.

That somewhere else is **segregation**. Most solutes prefer the liquid: the
**segregation coefficient** $k$, the ratio of solid to liquid concentration
at the interface, is below 1 for nearly every dopant in silicon. The standard
tabulated values used throughout this lesson: boron $k = 0.8$, phosphorus
$k = 0.35$, antimony $k = 0.023$. Boron's near-unity value is one practical
reason it is the default p-dopant of bulk silicon: the crystal comes out
nearly as doped as the melt, end to end.

## 2. Axial segregation: the Scheil equation

Rejected solute accumulates in the shrinking melt, so incorporation rises as
growth proceeds. The accounting takes four lines (and is the module's
simplest real derivation). Let $g$ be the fraction of the initial charge
solidified, $C_L$ the melt concentration, and assume the melt is well mixed
and the solid does not back-diffuse. Solute conservation for an increment
$dg$ of solidification says the solute leaving the liquid equals the solute
entering the solid:

$$
d\big[(1-g)\,C_L\big] = -\,k\,C_L\,dg,
$$

which separates and integrates from $C_L = C_0$ at $g = 0$ to give
$C_L = C_0(1-g)^{k-1}$, and hence the solid composition laid down at
fraction $g$:

$$
C_s(g) = k\,C_0\,(1-g)^{\,k-1}.
$$

![Axial doping computed from the stated Scheil equation for the three tabulated segregation coefficients: boron lays down an almost flat crystal while antimony hoards itself in the last liquid.](/courses/electronic-devices/figures/m22-scheil.svg)

### Worked example 2.1 - how flat is a phosphorus crystal?

For $k = 0.35$: at $g = 0.5$,
$C_s/C_0 = 0.35\times(0.5)^{-0.65} = 0.35\times1.57 = 0.55$; at $g = 0.9$,
$C_s/C_0 = 0.35\times(0.1)^{-0.65} = 0.35\times4.47 = 1.56$. The crystal
runs from $0.35\,C_0$ at the seed to $1.56\,C_0$ at ninety percent grown, a
factor of 4.5, before the tail runs away entirely. Resistivity
specifications on phosphorus-doped crystals are wide, or met by cropping,
or met by continuous recharging of the melt, and all three appear on real
price lists. Boron under the same arithmetic spans only
$0.8\,C_0$ to $0.8\times(0.1)^{-0.2} = 1.27\,C_0$: the Scheil exponent is
the entire commercial difference.

## 3. The boundary layer: BPS, striations and stirring

The well-mixed assumption fails in the last tenth of a millimetre. Rejected
solute must diffuse away from the interface through a liquid film that
convection cannot fully sweep, so solute enriches there and the crystal,
sampling the interface liquid, incorporates more than equilibrium predicts.
The Burton-Prim-Slichter (BPS) analysis models the film as a stagnant layer
of thickness $\delta$ and yields the **effective** segregation coefficient

$$
k_{\mathrm{eff}} = \frac{k}{k + (1-k)\,e^{-v\delta/D}},
$$

which runs from $k$ (slow growth, thin layer) to 1 (fast growth: the
crystal swallows the interface liquid before diffusion can edit it).

![Effective segregation computed from the stated BPS relation at k = 0.35 for three boundary-layer thicknesses: grow fast or stir weakly and the interface does its own dosing.](/courses/electronic-devices/figures/m22-bps.svg)

### Worked example 3.1 - a real Czochralski operating point

Pull rate $v = 1$ mm/min $= 16.7$ μm/s, boundary layer $\delta = 100$ μm
under typical rotation, melt diffusivity $D = 1.5\times10^{-4}$ cm²/s
$= 1.5\times10^{4}$ μm²/s (worked example 1.1). The exponent is

$$
\frac{v\,\delta}{D} = \frac{16.7\times100}{1.5\times10^{4}} = 0.11,
\qquad
k_{\mathrm{eff}} = \frac{0.35}{0.35 + 0.65\,e^{-0.11}} = 0.376.
$$

Growth lifts phosphorus incorporation seven percent above equilibrium at
this operating point. Modest, but $\delta$ is set by convection, and melt
convection is turbulent and oscillatory: as $\delta$ flutters, so does
$k_{\mathrm{eff}}$, and the rotating crystal records each flutter as a
concentric **striation**, dopant bands that etch and image directly. A
striation pattern is a strip-chart recording of the melt's hydrodynamics.
Damping the convection is the motivation for magnetically confined
Czochralski growth: a static field stiffens the conducting melt, thins the
fluctuations, and quiets the bands.

**Graduate note: constitutional supercooling, the melt's stability limit.**
The enriched boundary layer does one more thing: it destabilizes the
interface itself. Solute enrichment depresses the local liquidus (the
temperature at which liquid of that composition would freeze) by
$m\,\Delta C$, with $m$ the liquidus slope. Immediately ahead of the interface the
actual temperature rises with the imposed gradient $G$, but the liquidus
rises faster wherever the solute pile-up decays steeply, and if the actual
gradient cannot keep the liquid above its local liquidus, a band of
**constitutionally supercooled** liquid forms in which any bump on the
interface finds itself in supercooled melt and grows. The flat interface
then breaks into cells, and with them the uniform incorporation this
section has been engineering. Working the two gradients against each other
at the interface yields the classical stability criterion

$$
\frac{G}{v} \;\ge\; \frac{m\,C_0\,(1-k)}{k\,D},
$$

steep gradient and slow growth on the safe side, heavy doping and small
$k$ on the dangerous side. The criterion is why heavily doped crystals
grow slower than lightly doped ones from the same hot zone, why antimony
($k = 0.023$) is the hardest common dopant to grow heavily, and why the
$v$ and $G$ that module 21's Voronkov ratio wants to set for defect
reasons must simultaneously satisfy this inequality for interface
reasons: the two criteria share knobs, and the growth engineer serves
both masters at once.

## 4. Zone refining, and the rule that spans the course

**Zone refining** turns segregation from a nuisance into the purest
purification method known. Pass a molten zone of length $l$ along an ingot:
with $k < 1$ the zone's leading edge eats solute and its trailing edge lays
down purer solid, sweeping impurities toward the tail. A single pass leaves

$$
C(x) = C_0\left[1 - (1-k)\,e^{-kx/l}\right],
$$

and repeated passes compound geometrically toward an ultimate distribution
set by back-diffusion. Float-zone silicon is refined this way, touches no
crucible, and reaches the lowest impurity levels of any manufactured bulk
material (module 29).

![Single-pass zone refining computed from the stated relation for three segregation coefficients: the smaller k, the longer the cleaned length before the swept impurities pile into the tail.](/courses/electronic-devices/figures/m22-zone-pass.svg)

**The Meyer-Neldel compensation rule (graduate core).** Across this course,
thermally activated processes have appeared with fitted prefactors and
barriers. An empirical regularity connects them: within a **family** of
related processes, the same dopant across an alloy series, conduction across
a set of amorphous films, defect reactions across preparation conditions,
the log-prefactor rises linearly with the barrier,

$$
\ln D_0 = \ln D_{00} + \frac{E_a}{E_{MN}},
$$

with $E_{MN}$ a characteristic energy of the family (commonly 25 to 150
meV). Higher barriers arrive with higher prefactors, partly cancelling: the
"compensation". Substituting into the Arrhenius law shows every family
member runs at the same rate at one temperature, the **isokinetic
temperature**,

$$
T_{iso} = \frac{E_{MN}}{k_B},
$$

where the lines cross:

![A Meyer-Neldel family computed from the stated compensation law with a characteristic energy of 0.11 eV: three Arrhenius lines with different barriers converge at the isokinetic temperature near 1280 K.](/courses/electronic-devices/figures/m22-meyer-neldel.svg)

### Worked example 4.1 - reading a family's characteristic energy

A set of amorphous-silicon conductivity fits shows prefactors climbing one
decade for every 0.25 eV of activation energy. Then
$\ln(10) = 0.25/E_{MN}$, so $E_{MN} = 0.25/2.303 = 0.109$ eV and
$T_{iso} = 0.109/8.617\times10^{-5} = 1260$ K. Below $T_{iso}$ the
high-barrier members are slower, above it faster; since 1260 K is far above
any a-Si:H operating condition, in practice the barrier ordering rules, and
the rule's use is bookkeeping: one parameter, $E_{MN}$, summarizes a whole
family's prefactors.

The usual physical reading is **entropy compensation**: a taller barrier
must be assembled from more small excitations of the surroundings, and the
number of ways to assemble it grows exponentially with its height, an
activation entropy that lands in the prefactor. Two honest cautions,
non-negotiable. First, a fake Meyer-Neldel line is generated by fitting
Arrhenius parameters over a narrow temperature window, because the fitted
$\ln D_0$ and $E_a$ are strongly correlated and their error ellipse lies
along exactly the compensation direction; any claimed rule must be checked
against the fit covariance before belief. Second, the rule is empirical: it
organizes a family and hints at shared mechanism, and it identifies nothing
by itself.

## 5. What the diffusion picture explains

Pulling module 22 together, one mechanism family accounts for a striking
number of this course's facts:

- **Junction depth scales as $\sqrt{Dt}$**, so scaling drove anneals from
  furnace hours to milliseconds, and activation physics (lesson 1, section
  4) rode along.
- **Diffusivity is not a material constant.** It is a defect population in
  disguise: Fermi level, oxidation, nitridation, implant damage, ambient
  overpressure and strain all move it, and every one of those levers appears
  somewhere in a real process flow.
- **Chemical and electrical profiles differ**, and their difference, the
  inactive fraction, is measurable only by using two instruments (lesson 2).
- **Trace metals matter at $10^{11}$ cm⁻³** because interstitial diffusers
  cross wafers in hours at room temperature; gettering is the designed
  countermeasure (lesson 2, worked example 4.1; module 21 lesson 6).
- **Hydrogen fixes interfaces, hides acceptors, and does not stay put**:
  forming-gas anneals, a-Si:H, and bias-temperature drift are one chemistry
  in three costumes (lesson 2, section 3).
- **Compounds need ambient control** because sublattice defect populations,
  and with them doping and interdiffusion, obey vapour mass action (lesson
  3).
- **Heterostructure abruptness is metastable**: every interface in this
  course is a kinetic achievement with a thermal-budget price on its head.
- **Growth uniformity is hydrodynamics**: Scheil sets the axial trend, BPS
  and the fluctuating boundary layer write the striations (this lesson).
- **Interconnect lifetime is diffusion under load**: electromigration and
  stress migration close the loop in module 54.

The unifying idea deserves its one-sentence form: a device is a
configuration of atoms that is useful only because, at operating
temperature, the atoms move too slowly to matter, and every reliability
specification is a diffusion coefficient wearing a suit.

## 6. Where to read further on diffusion

Directions that repay effort, listed by what they add: a standard
semiconductor **process text** for the classical solutions run against real
recipes; a **TCAD process simulator** for the coupled dopant-defect
equations, where one simulated implant-plus-anneal compared against a
measured SIMS profile teaches more about TED than any derivation; the
**silicon point-defect literature** for the bridge to module 21, since the
same vacancy and interstitial populations decide both void formation and
dopant motion; **compound processing references** for ambient-controlled
annealing and disordering; and the **reliability literature** on NBTI,
hot carriers and electromigration, where this module's physics becomes
product lifetime. Within the course: module 34 measures the profiles,
module 36 their electrical consequences, modules 28 to 32 grow the crystals
this lesson's melts feed, and module 41 lives entirely inside section 3 of
lesson 2.

## 7. Problems

**P22.19** Derive the Scheil equation from the stated conservation
statement, showing the separation of variables, and state the two
assumptions that fail first in a real puller.

**P22.20** An antimony-doped crystal must hold resistivity within a factor
of 2. Using $k = 0.023$, find the largest usable fraction $g$ and comment
on the economics.

**P22.21** Show from the BPS relation that
$k_{\mathrm{eff}} \to 1$ as $v\delta/D \to \infty$ and $\to k$ as
$v\delta/D \to 0$, and compute the pull rate at which phosphorus's
$k_{\mathrm{eff}}$ reaches 0.5 for the worked example's $\delta$ and $D$.

**P22.22** A grower doubles crystal rotation, halving $\delta$. Using
worked example 3.1's numbers, compute the new $k_{\mathrm{eff}}$ and state
what happens to striation amplitude and why.

**P22.23** After one zone pass with $k = 0.1$, what fraction of the
original impurity remains at the ingot's start ($x = 0$), and how far in
zone lengths before the material is back to half its original impurity?

**P22.24** A colleague reports a beautiful Meyer-Neldel plot from
conductivity data fitted between 300 and 350 K. List the two checks from
section 4 you would demand, with the reason each defeats an artefact.

### Answers

**A22.19** From $d[(1-g)C_L] = -kC_L\,dg$: expand the left side,
$(1-g)\,dC_L - C_L\,dg = -kC_L\,dg$, so
$dC_L/C_L = (1-k)\,dg/(1-g)$. Integrate: $\ln(C_L/C_0) =
-(1-k)\ln(1-g)$, giving $C_L = C_0(1-g)^{k-1}$ and
$C_s = kC_L$. Assumptions that fail first: perfect melt mixing (the
boundary layer of section 3 exists precisely because it fails) and no
evaporation from the melt, which for volatile dopants (antimony,
phosphorus at high temperature) adds a loss term the derivation lacks.

**A22.20** $C_s(g)/C_s(0) = (1-g)^{k-1} = (1-g)^{-0.977} \le 2$ requires
$(1-g) \ge 2^{-1/0.977} = 0.492$, so $g \le 0.51$: barely half the crystal
is usable. Resistivity range is why heavily antimony-doped substrates
carry their price: nearly half of every ingot is remelt.

**A22.21** As $v\delta/D \to \infty$ the exponential dies:
$k_{\mathrm{eff}} \to k/k = 1$. As $v\delta/D \to 0$ the exponential is 1:
$k_{\mathrm{eff}} \to k/(k+1-k) = k$. For $k_{\mathrm{eff}} = 0.5$:
$0.5 = 0.35/(0.35+0.65e^{-u})$ gives $e^{-u} = 0.538$, $u = 0.62$, so
$v = uD/\delta = 0.62\times1.5\times10^{4}/100 = 93$ μm/s $= 5.6$ mm/min,
several times a practical pull rate: growth alone cannot push phosphorus
halfway to unity, which is why $k_{\mathrm{eff}}$ excursions in practice
come from $\delta$, not $v$.

**A22.22** $u = v\delta/D$ halves from 0.11 to 0.056:
$k_{\mathrm{eff}} = 0.35/(0.35+0.65\times0.946) = 0.363$, down from 0.376.
Striation amplitude falls twice over: the mean enhancement is smaller, and
a thinner layer responds less to a given convective fluctuation, since
$dk_{\mathrm{eff}}/d\delta \propto$ the same exponential sensitivity.
Faster rotation is the cheap knob; the magnetic field is the expensive one.

**A22.23** At $x = 0$: $C/C_0 = 1-(1-k) = k = 0.1$, a ten-fold cleanup at
the very start. Half recovery: $1-(0.9)e^{-0.1x/l} = 0.5$ gives
$e^{-0.1x/l} = 0.556$, $x/l = 5.9$: about six zone lengths of usefully
cleaned ingot per pass, which is why practical refining runs many passes
and crops the tail.

**A22.24** First, the covariance check: refit and plot the
$(\ln D_0, E_a)$ error ellipse; over a 50 K window the ellipse's long axis
lies along the compensation line, so points scattered along it prove
nothing. Equivalent operational test: does the inferred $T_{iso}$ sit
suspiciously inside or near the fitted temperature window's reciprocal
centre? An artefact's does. Second, the family check: a genuine rule
requires physically related members (one mechanism, one family); a grab-bag
of unrelated processes lined up on a compensation plot is numerology, and
identifying the shared mechanism is separate work the plot cannot do.

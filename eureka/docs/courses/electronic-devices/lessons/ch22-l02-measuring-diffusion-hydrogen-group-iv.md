# Measuring Diffusion, Hydrogen, and Diffusion in Silicon and Germanium

<!-- covers: 22.5, 22.6, 22.7 -->

Lesson 1 supplied the equations; this lesson supplies the evidence and the
two systems where the evidence is deepest. First the craft of measuring a
diffusion coefficient, which is the craft of making a depth profile and
refusing to over-interpret it. Then hydrogen, the one diffuser present in
every process whether invited or not. Then the group IV hosts, silicon and
germanium, whose dopant behaviour a working engineer is expected to know cold.

**Level.** Sections 1 and 2 undergraduate core; sections 3 and 4 mixed, with
the graduate content flagged; section 5 problems.

## 1. Making the profile

A diffusion coefficient is extracted by making a concentration-versus-depth
profile and fitting it with the right model. The methods divide into those
that count atoms and those that count carriers, and the difference between
their answers is itself a measurement.

**Secondary ion mass spectrometry (SIMS)** is the reference chemical method:
sputter the surface with an ion beam, mass-analyse the ejecta, convert sputter
time to depth. It reaches detection limits of $10^{14}$ to $10^{16}$ cm⁻³
depending on species and matrix, with depth resolution of a few nanometres,
and it counts every atom of the element whether electrically active or not,
which is exactly what a diffusion measurement wants. Module 34 covers its
artefacts; the two that matter here are the surface transient over the first
nanometres and knock-on mixing that smears steep falling edges.

**Spreading resistance profiling (SRP)** measures resistivity versus depth
with a two-point probe stepped along a shallow bevel, giving the electrically
active profile over a wide dynamic range. **Capacitance-voltage profiling**
gives the free-carrier profile non-destructively by sweeping a depletion
region, resolution-limited to the Debye length, so genuinely abrupt junctions
always look smeared. **Hall measurement** (module 36) gives one number, the
active sheet dose, rather than a profile.

The chemical and the electrical profile of the same sample bracket the truth
between them:

![Constructed comparison, computed from the stated forms rather than measured: a Gaussian chemical profile against the active profile clipped at solid solubility. The shaded region is dopant that scatters carriers without donating any.](/courses/electronic-devices/figures/m22-active-vs-chemical.svg)

**Radiotracer sectioning**, diffusing a radioactive isotope and counting
activity in serially removed layers, remains the classical standard for
self-diffusion, where tracer and host are chemically identical and SIMS has
nothing to grip.

**Integral methods** infer $Dt$ from one number: sheet resistance versus
anneal time, junction depth versus time, the shift of a C-V curve. A
production line monitors with these because they are fast, but one number
cannot distinguish lesson 1's regimes, and an integral method silently
assumes the profile shape it was calibrated with.

**The modern self-diffusion measurement** deserves its own paragraph
because it is a clean idea. Grow an isotope heterostructure, a stack of
layers chemically identical but isotopically distinct, natural silicon
against isotopically purified ²⁸Si, and anneal it. SIMS can follow the
²⁹Si and ³⁰Si profiles across the interfaces even though a chemical method
sees no contrast at all, and the smearing of the isotope steps is
self-diffusion with no tracer chemistry, no surface source, and no
radioactivity. The same trick measures host interdiffusion in GaAs/AlGaAs
and in Si/SiGe stacks, and it is how the silicon self-diffusion entangled
with module 21's native defect populations was finally pinned down: the
measured activation energy near 4.8 eV decomposes into formation plus
migration of the mediating defects, and its doping dependence identifies
which charge states do the carrying, the same census logic lesson 5
formalizes for dopants.

### Worked example 1.1 - a junction depth from first principles

The predeposition of lesson 1's worked example 1.1 ($Q = 5.1\times10^{14}$
cm⁻², boron) is driven in for 1 hour at 1100 °C, where lesson 1 computed
$D = 1.1\times10^{-13}$ cm²/s. Then $Dt = 4.1\times10^{-10}$ cm², and the
Gaussian surface concentration is

$$
C(0) = \frac{Q}{\sqrt{\pi Dt}}
= \frac{5.1\times10^{14}}{\sqrt{\pi\times4.1\times10^{-10}}}
\approx 1.4\times10^{19}\ \mathrm{cm^{-3}}.
$$

Against a background of $C_B = 10^{16}$ cm⁻³,

$$
x_j = 2\sqrt{Dt\,\ln(C(0)/C_B)}
= 2\sqrt{4.1\times10^{-10}\times\ln(1400)}
\approx 1.1\ \mathrm{\mu m}.
$$

A micrometre-deep junction from an hour at 1100 °C: the classic well
diffusion. Note what checking this against a real profile requires: the SIMS
profile gives $C(0)$ and shape, the SRP profile confirms activity, and the
measured $x_j$ tests the assumed $D$. One number from one method would test
nothing.

![Junction depth computed from the stated Gaussian crossing relation for three background dopings: the depth rides sqrt(Dt) with a logarithmic bonus that fades as the surface concentration falls toward the background.](/courses/electronic-devices/figures/m22-junction-depth.svg)

## 2. Extracting D honestly

Given a good profile, extraction is fitting, and the fit is only as honest as
its assumptions.

**If the regime is intrinsic**, fit the erfc or Gaussian directly; better,
profile at two or more times and confirm that depth contours advance as
$\sqrt{t}$, which tests Fickian behaviour rather than assuming it.

**If D depends on concentration**, no single-parameter fit is valid. The
**Boltzmann-Matano analysis** (derived in lesson 5, section 4) extracts
$D(C)$ point by point from one profile without assuming a functional form,
by combining the similarity variable with dose bookkeeping:

$$
D(C^*) = -\frac{1}{2t}\left(\frac{dx}{dC}\right)_{C^*}
\int_{0}^{C^*} x\,dC,
$$

with $x$ measured from the Matano plane, the depth that balances the dose on
either side. Its practical weakness is the derivative of noisy data; its
practical strength is that a $D(C)$ curve rising steeply with $C$ is the
fingerprint that separates genuine concentration dependence from mere
mis-fitting.

Three cautions apply to every extraction. First, a profile records the
entire thermal history including ramps; with modern short anneals the ramps
often dominate the $Dt$ integral, so quote the effective $Dt$, not the soak
time. Second, an effective $D$ fitted to a non-Fickian profile is a
meaningless average; the kink-and-tail phosphorus profile of lesson 1 is the
standard trap. Third, the near-surface region obeys its own physics,
segregation, oxidation and out-diffusion, and should be treated as a boundary
condition to be modelled, not data about the bulk.

## 3. Hydrogen, the universal passivator

Hydrogen earns its own section because it is everywhere, it moves fast, and
it rewrites electrical properties at trace concentrations. It is introduced
by plasma steps, wet chemistry, forming-gas anneals, implantation and ambient
moisture; it diffuses interstitially with a sub-eV barrier, so it is mobile
at temperatures where every other impurity is parked.

What hydrogen does is **passivate dangling bonds**. An unsatisfied silicon
bond is a gap state that captures carriers; a hydrogen atom terminates it and
removes the state. Three technologies rest on this one reaction:

- **The MOS interface.** A forming-gas anneal near 400 °C drops interface
  trap density by more than an order of magnitude. This step is universal in
  MOS processing and is pure hydrogen chemistry.
- **Amorphous silicon.** Unhydrogenated a-Si has a dangling-bond density so
  high it cannot be doped; a-Si:H with 5 to 15 atomic percent hydrogen has
  its defect density reduced by orders of magnitude and becomes the
  semiconductor behind every large-panel display (module 41).
- **Grain boundary passivation** in polycrystalline silicon and in
  multicrystalline solar material, where hydrogenation from a nitride layer
  during firing is a deliberate lifetime-recovery step.

**Dopant passivation is the unwanted twin.** Hydrogen binds to ionized
acceptors: a hydrogen-boron pair is neutral, so a plasma-exposed p-type layer
silently loses carriers. The pair is weakly bound and dissociates on modest
annealing. A first-order model with attempt frequency $\nu$ and binding
barrier $E_a$ gives the surviving pair fraction after time $t$ at
temperature $T$:

$$
f = \exp\!\left[-\nu\,t\,\exp\!\left(-\frac{E_a}{k_BT}\right)\right],
$$

a sharp step in temperature because the inner exponential moves so fast.

![Surviving hydrogen-boron pair fraction after a 30 minute anneal, computed from the stated first-order model with representative parameters (attempt frequency 1e13 per second, barrier 1.4 eV) and retrapping neglected: recovery is an all-or-nothing step near 150 degrees C.](/courses/electronic-devices/figures/m22-hb-dissociation.svg)

### Worked example 3.1 - where the recovery step sits

Set $f = \tfrac12$ in the model: $\nu t\,e^{-E_a/k_BT_{1/2}} = \ln 2$, so

$$
k_BT_{1/2} = \frac{E_a}{\ln(\nu t/\ln 2)}
= \frac{1.4}{\ln(1\times10^{13}\times1800/0.693)}
= \frac{1.4}{37.8} = 0.0370\ \mathrm{eV},
$$

giving $T_{1/2} = 0.0370/8.617\times10^{-5} = 430$ K $= 157$ °C for a 30
minute anneal with the stated representative parameters. Because the
half-recovery temperature depends only logarithmically on $\nu t$, doubling
the anneal time moves it by only a few degrees: the step is a property of the
barrier, which is why the effect is often missed. A wafer measured after any
warm handling step has already recovered; the same wafer measured cold out of
the plasma tool reads as under-doped. The model neglects retrapping, which
in hydrogen-rich material pushes the practical recovery temperature higher.

**Hydrogen's dark side** completes the story. Passivated bonds can be broken
again by hot carriers or sustained bias, releasing hydrogen and regenerating
interface traps; this reaction is a leading model for negative bias
temperature instability, a first-rank wear-out mechanism of modern
transistors. In amorphous silicon the same chemistry appears as the
Staebler-Wronski effect (module 40). And because hydrogen is mobile at room
temperature on month timescales, a hydrogen-sensitive parameter measured at
time zero does not describe the device a season later. When a parameter
drifts and the activation energy of the drift is under an electron-volt,
suspect hydrogen early.

## 4. Diffusion in silicon and germanium

Group IV semiconductors are the best-characterized diffusion systems in
existence, because a fifty-year industry depended on getting them right.

**Silicon's dopants, ordered by mechanism.** Boron diffuses mainly by the
interstitialcy route: fastest of the common dopants, strongly enhanced by
implant damage and oxidation, and therefore the hardest to keep shallow. The
countermeasures form a short history of the industry: low-energy and
molecular implants, carbon or fluorine co-implants that trap interstitials,
and millisecond anneals. Phosphorus shares the interstitialcy character,
shows the kink-and-tail extrinsic profile, and injects interstitials while
diffusing at high concentration, an effect used deliberately in **phosphorus
gettering** of metals in solar processing. Arsenic is slower,
vacancy-dominated, and abrupt, which is exactly what a shallow source/drain
wants; its ceiling is solid solubility, above which it clusters inactively.
Antimony, slower still and purely vacancy-mediated, is the buried-layer
dopant chosen to sit under a long epitaxial growth without moving.

**Transition metals are the anti-dopants.** Iron, copper, nickel and gold
diffuse interstitially with sub-eV barriers. Using the standard tabulated
fit for interstitial copper, $D_0 = 3\times10^{-4}$ cm²/s and $E_a = 0.18$
eV, worked example 4.1 shows copper crossing an entire wafer while dinner is
served. Metals create deep levels that kill minority-carrier lifetime at
$10^{11}$ cm⁻³, four orders below any doping level of interest, which is why
contamination is specified in atoms per square centimetre and why gettering
(module 21, lesson 6) exists.

### Worked example 4.1 - copper crosses the wafer

At room temperature ($k_BT = 0.02585$ eV):

$$
D = 3\times10^{-4}\,e^{-0.18/0.02585}
= 3\times10^{-4}\,e^{-6.96}
\approx 2.8\times10^{-7}\ \mathrm{cm^2/s}.
$$

Time to diffuse across a 700 μm wafer, using $t \approx x^2/4D$ with
$x = 0.07$ cm:

$$
t = \frac{(0.07)^2}{4\times2.8\times10^{-7}}
\approx 4.4\times10^{3}\ \mathrm{s} \approx 1.2\ \mathrm{hours},
$$

at room temperature. At 400 °C the same arithmetic gives seconds. A
substitutional dopant would need $10^{20}$ years (lesson 1, worked example
2.2). This twelve-orders gap between interstitial and substitutional
timescales is the single most consequential number in contamination control.

**Gettering, the designed countermeasure, comes in two mechanisms** and
naming which one a recipe uses is a fair interview question. **Relaxation
gettering** provides nucleation sites where the supersaturated metal can
precipitate: the oxygen precipitates and their strain fields in module
21's denuded-zone engineering work this way, and they work only while the
metal is supersaturated, that is, during cooling. **Segregation
gettering** provides a region where the metal is more soluble or more
stable than in the device layer, a heavily phosphorus-doped surface, a
silicide, the damaged backside, and it keeps working at equilibrium
because the metal is thermodynamically happier there. The engineering
difference: relaxation gettering fails if the cool-down is too fast for
the metal to reach the sink, segregation gettering fails if a later hot
step re-dissolves the captive; both budgets are diffusion calculations of
exactly worked example 4.1's kind, run in reverse to guarantee the metal
CAN reach the sink in the time provided. A gettering spec that names a
sink but not a cool rate has done half the physics.

**Germanium is silicon's mirror.** Dopant diffusion in germanium is
vacancy-dominated across the board. The consequences invert silicon's
instincts: n-type dopants (P, As, Sb) diffuse fast, riding a plentiful
negatively charged vacancy population that couples to their own doping, and
they combine this speed with low solid solubility; acceptors are slower and
better behaved. Forming a shallow, heavily doped, low-resistance n-plus
contact in germanium is therefore genuinely hard, and this, alongside the
unstable native oxide, is a main reason germanium p-channel devices returned
to production years before any germanium n-channel contender.

![Representative donor Arrhenius lines computed from the stated parameters for phosphorus in silicon and a vacancy-mediated donor in germanium: the smaller barrier keeps germanium's donors mobile at every temperature its processing can use.](/courses/electronic-devices/figures/m22-si-ge-arrhenius.svg)

**Graduate note: strain and alloying.** In Si₁₋ₓGeₓ, diffusivities shift
continuously with composition, and coherent strain shifts them again by
changing both formation and migration energies of the defect vehicles. The
sign matters and is exploitable: boron diffusion is suppressed in
compressively strained SiGe, which is precisely where a heterojunction
bipolar transistor puts its boron-doped base, so the material that needs an
immobile profile is the material that provides one (module 38).

## 5. Problems

**P22.7** A SIMS profile and an SRP profile of the same arsenic implant agree
below $2\times10^{20}$ cm⁻³ and diverge above it, SIMS reading higher. State
what is being measured by each, what the divergence measures, and what
happens to sheet resistance if the implant dose is doubled.

**P22.8** Worked example 1.1's junction is re-annealed, adding a second hour
at 1100 °C. Compute the new $x_j$ and explain why it grew by less than
$\sqrt{2}$.

**P22.9** Show from the Boltzmann-Matano formula that for a profile measured
with 5 nm depth noise, the extracted $D(C)$ is least reliable exactly where
the profile is steepest, and propose the two-time protocol that mitigates
this.

**P22.10** Using the H-B model with the stated parameters, compute the
half-recovery temperature for a 10 hour bake and compare with the 30 minute
value of worked example 3.1. What property of the model makes the answer so
insensitive?

**P22.11** A p-type wafer reads 20 percent under-doped by C-V immediately
after a plasma nitride deposition, and correct one week later after storage
at 60 °C. Reconstruct the history quantitatively using the pair model.

**P22.12** Germanium n-plus contacts: given the two stated Arrhenius lines,
find the temperature at which the germanium donor moves as fast as
phosphorus in silicon does at 1000 °C, and comment on what that leaves for
contact annealing headroom.

### Answers

**A22.7** SIMS counts all arsenic atoms; SRP counts ionized, active donors
via resistivity. The divergence is the inactive clustered fraction above
solid solubility. Doubling the dose adds atoms mostly to the inactive
fraction: sheet resistance barely falls, and may rise slightly as clusters
add scattering.

**A22.8** $Dt$ doubles: $Dt = 8.2\times10^{-10}$ cm²,
$C(0) = 5.1\times10^{14}/\sqrt{\pi\times8.2\times10^{-10}} =
1.0\times10^{19}$ cm⁻³, $\ln(C(0)/C_B) = \ln(1000) = 6.9$,
$x_j = 2\sqrt{8.2\times10^{-10}\times6.9} = 1.5$ μm. Growth factor
1.5/1.1 = 1.36 < $\sqrt{2}$ = 1.41 because the surface concentration fell,
shaving the logarithm from 7.2 to 6.9.

**A22.9** The formula contains $(dx/dC)$, the reciprocal slope: where the
profile is steep, $dC/dx$ is large but its measured value is dominated by
depth noise, since a 5 nm error moves the assigned concentration by the full
local swing. Protocol: profile at two anneal times and extract $D(C)$ from
the motion of each concentration contour, $D(C) = (x_2^2 - x_1^2)/(4t_2 -
4t_1)$ at fixed $C$ in the similarity regime, which differentiates between
profiles rather than within one.

**A22.10** $k_BT_{1/2} = 1.4/\ln(10^{13}\times3.6\times10^4/0.693) =
1.4/\ln(5.2\times10^{17}) = 1.4/40.8 = 0.0343$ eV, so $T_{1/2} = 398$ K
$= 125$ °C, against 157 °C for 30 minutes. A 20-fold time change moved the
step 32 °C: the logarithm compresses all duration dependence, so the step
temperature is effectively a barrier-height readout.

**A22.11** The plasma supplied atomic hydrogen; 20 percent of acceptors
paired, so $f = 0.2$ of the affected depth's boron was neutral at first
measurement. At 60 °C (333 K, $k_BT = 0.0287$ eV): rate $= \nu e^{-1.4/0.0287}
= 10^{13}e^{-48.8} = 6\times10^{-9}$ s⁻¹, giving a dissociation time constant
near $1.7\times10^{8}$ s. That is too slow for one week; recovery in a week
at 60 °C implies either a lower effective barrier (retrapping-free pairs at
the surface, or a barrier nearer 1.2 eV: $10^{13}e^{-1.2/0.0287} =
7\times10^{-6}$ s⁻¹, time constant 1.6 days) or hydrogen out-diffusion. The
point of the reconstruction: the observed recovery time bounds the barrier
between about 1.15 and 1.25 eV, and a measurement protocol that waits a week
sees nothing at all.

**A22.12** Phosphorus in Si at 1273 K: $D = 9\times10^{-15}$ cm²/s (lesson
1's parameters). Set $2\,e^{-2.9/k_BT} = 9\times10^{-15}$:
$e^{-2.9/k_BT} = 4.5\times10^{-15}$, $2.9/k_BT = 33.0$, $k_BT = 0.0879$ eV,
$T = 1020$ K $= 747$ °C. Germanium's donors move at 747 °C as fast as
silicon's phosphorus at 1000 °C, while germanium processing tops out near
its 938 °C melting point and in practice far lower: there is no
high-temperature regime in which germanium contacts can be annealed without
the profile moving, which is why laser and flash activation matter there.

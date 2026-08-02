# Module 18 Capstone: Design Case Studies and Comprehensive Exam

<!-- covers: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8, 18.9, 18.10, 18.11, 18.12, 18.13, 18.14 -->

The four lessons of this module each taught one layer of transport physics.
Real problems arrive with the layers tangled together: a sensor spec couples
Hall physics to doping statistics to thermal drift; an interconnect budget
couples size effects to percolation-limited barriers to RC delay. This
capstone works four such problems end to end, at the level of detail a design
review would demand, then closes with a comprehensive exam.

**How to use it.** Attempt each case before reading its resolution; the value
is in noticing *which* lesson each sub-question calls, because that routing
skill is the module's real deliverable.

## Case study 1: a current sensor that must not drift

**Specification.** A battery-management system needs a contactless current
sensor: a Hall element reading the field of a busbar, 100 A full scale
producing 10 mT at the element, output at least 50 mV full scale from a 3 mA
bias, operating from -40 to +125 C with gain drift below 3 percent across the
range, on a cost budget that rules out III-V epitaxy.

**Step 1: material and doping from the sensitivity requirement.**
The Hall voltage is $V_H=IB/nqt$. Cost dictates silicon; an implanted n-well
of $t=1\ {\rm \mu m}$ is the cheap available structure. Required density:

$$
n=\frac{IB}{qV_Ht}
=\frac{3\times10^{-3}\times10^{-2}}
{1.602\times10^{-19}\times5\times10^{-2}\times10^{-6}}
=3.7\times10^{21}\ {\rm m^{-3}}
=3.7\times10^{15}\ {\rm cm^{-3}}
$$

Comfortably manufacturable: a light n-well.

**Step 2: temperature stability picks the doping floor, not the ceiling.**
Lesson 1's plateau argument now bites in reverse. At $3.7\times10^{15}$ the
sample stays extrinsic to about 200 C: fine. But the *freeze-out* end matters
at -40 C ($233$ K): phosphorus at 45 meV is still essentially fully ionised
there (the freeze-out knee for shallow donors sits below 100 K), so carrier
density is flat across the automotive range. Silicon's shallow dopants are
exactly what makes silicon Hall sensors calibratable; a deep-donor material
would fail this spec at once.

**Step 3: what actually drifts.** With $n$ flat, the residual drift is the
Hall scattering factor $r_H(T)$ (lesson 1, section 8.3): silicon moves a few
percent across this range as the mix of phonon and impurity scattering
shifts. At $3.7\times10^{15}$, phonon scattering dominates throughout
(lesson 2's Caughey-Thomas curve puts $\mu$ within 2 percent of its
lattice-limited value), so $r_H$ stays near its acoustic value $3\pi/8$ and
drifts by roughly 1 to 2 percent: inside budget, and the reason the doping
was *not* pushed higher into the mixed-scattering region where $r_H(T)$
swings hardest.

**Step 4: offset, the practical killer.** A 0.1 percent lithographic
asymmetry in a 1 k$\Omega$ bridge is a 3 mV offset: sixty times the
50 µV earth-field scale and 6 percent of full scale. The remedy is the
**spinning-current technique**: commutate the bias through the four contacts
and average; misalignment offsets reverse with the rotation while the Hall
signal does not, cancelling them to first order together with the
thermoelectric offsets of lesson 3's measurement protocol. Every monolithic
Hall IC does this, which is why a physics-limited sensor became a
consumer-priced part.

**What the case teaches.** The headline equation fixed one parameter in five
minutes; the *plateau*, the *scattering mix behind* $r_H$, and the
*measurement protocol* consumed the design. That weighting is typical.

## Case study 2: the resistivity ladder of a metallization stack

**Specification.** A 1 mm signal line in an advanced interconnect stack:
copper, 18 nm wide, 32 nm tall, fully diffuse surfaces, mean grain size
18 nm with $R=0.30$, and the line must include a 2 nm TaN liner on three
sides. Deliver the line resistance, identify the dominant contributor, and
evaluate the ruthenium alternative ($\rho_0=71\ {\rm n\Omega\,m}$,
$\lambda=6.6$ nm, linerless at 1 nm adhesion layer).

**Step 1: geometry after the liner.** The conducting copper core is
$(18-2\times2)\times(32-2)=14\times30$ nm: the liner consumed 27 percent of
the cross-section before any transport physics started. (The liner itself, at
about $2\ {\rm \mu\Omega\,m}$, carries under 2 percent of the current:
dead weight electrically, indispensable as a diffusion barrier per module 22.)

**Step 2: size effects on the core.** Effective thickness for the surface
term: use the narrow dimension, 14 nm.
Fuchs-Sondheimer: $1+\tfrac{3}{8}(39/14)=2.04$.
Mayadas-Shatzkes with $\alpha=(39/18)(0.3/0.7)=0.929$: bracket
$=0.333-0.464+0.863-0.801\ln(2.076)=0.147$, so the grain factor is
$1/(3\times0.147)=2.27$. Combined excesses:
$\rho/\rho_0\approx1+1.04+1.27=3.31$, so
$\rho\approx55.6\ {\rm n\Omega\,m}$.

**Step 3: the line resistance.**

$$
R=\rho\frac{L}{A}
=55.6\times10^{-9}\times\frac{10^{-3}}{14\times30\times10^{-18}}
=132\ {\rm k\Omega\ per\ mm}
$$

Against the naive bulk-copper, full-cross-section estimate
($16.8\times10^{-9}\times10^{-3}/(18\times32\times10^{-18})=29$ k$\Omega$):
a factor of 4.5 lost, roughly half to size effects and half to the liner.

**Step 4: the ruthenium comparison.** Ru core at full
$18\times31$ nm (1 nm adhesion only):
surface term $1+\tfrac{3}{8}(6.6/17)=1.15$; grains at $d=18$ nm,
$\alpha=(6.6/18)(0.3/0.7)=0.157$, bracket $=0.230$, factor 1.45. Total
$\rho\approx71\times(1+0.15+0.45)=114\ {\rm n\Omega\,m}$, and

$$
R=114\times10^{-9}\times\frac{10^{-3}}{18\times31\times10^{-18}}
=204\ {\rm k\Omega\ per\ mm}
$$

Still worse than copper at this node: the crossover needs another shrink or
two, arriving when the copper core's conducting area collapses further. The
decision variable is the product $\rho_0\lambda$ *plus* the liner tax, and
running the arithmetic at each node is precisely how the industry decides the
switchover, which is why this case is a real meeting agenda and not an
exercise.

## Case study 3: diagnosing a failed epitaxial run

**The data.** A vendor's GaAs epi-wafer, intended
$n=1\times10^{16}\ {\rm cm^{-3}}$, arrives with these van der Pauw results:
$R_H$ at 0.2 T gives $n=8.6\times10^{15}$, mobility 6100 at 300 K; cooling to
77 K, mobility *falls* to 3900, and $R_H$ grows field-dependent, changing
12 percent between 0.1 and 0.5 T.

**Expected behaviour.** Clean GaAs at $10^{16}$ should show mobility
*rising* toward 77 K (polar-optical scattering freezing out faster than
ionised-impurity grows: the peak sits near 50 to 80 K at this doping), and a
field-flat $R_H$.

**Reading the anomalies.** Falling low-temperature mobility is the
$T^{+3/2}$ signature of lesson 2: **ionised impurity scattering far above the
nominal doping**, meaning heavy compensation: donors plus acceptors both
present, $N_I=N_D+N_A$ large while $n=N_D-N_A$ stays small. The
field-dependent $R_H$ corroborates: a compensated sample nearing mixed
conduction at the measurement temperature (or with a parallel conducting
path: substrate or interface layer) violates the one-carrier constancy of
lesson 3's section 1.4.

**The quantitative check.** Fit the two-temperature decomposition of
lesson 2's worked example 1.2: with $\mu(300)=6100$ and $\mu(77)=3900$ and
the pure power laws for polar-optical-dominated GaAs versus impurity
scattering, the extracted $N_I$ comes out near $6\times10^{16}$: **seven
times** the net doping. Compensation ratio
$(N_D+N_A)/(N_D-N_A)\approx7$, so $N_A\approx2.6\times10^{16}$ of
unintended acceptors: carbon contamination is the usual suspect in MOCVD
(module 30 takes up why).

**The verdict and the general lesson.** Reject the wafer, and specify future
acceptance as *mobility at 77 K*, not room-temperature mobility: low
temperature is where impurity scattering is exposed, so a cold mobility floor
is the cheapest compensation detector there is. Certificates quoting only
300 K numbers hide exactly this failure, which is why serious epi contracts
always include a 77 K clause.

## Case study 4: a 650 V power switch, silicon against SiC

**Specification.** A 650 V rated unipolar switch (30 percent derating on a
480 V bus with transients), 25 A, target conduction loss under 15 W at
125 C junction.

**Silicon attempt.** With $\mathcal{E}_c=3\times10^{5}$ V/cm:
$N=\varepsilon\mathcal{E}_c^{2}/2qV_{\rm BR}
=(11.7\times8.854\times10^{-12}\times9\times10^{14})
/(2\times1.602\times10^{-19}\times650\times10^{6}\ {\rm cm^{-3}\ conversion})$
: run in cm units directly with the lesson 3 formula:
$N=4.5\times10^{14}\ {\rm cm^{-3}}$, $W=2V/\mathcal{E}_c=43\ {\rm \mu m}$.
Specific resistance
$R=W/(q\mu N)=43\times10^{-4}/(1.602\times10^{-19}\times1350\times4.5\times10^{14})
=44\ {\rm m\Omega\,cm^{2}}$ at 300 K, and mobility falls roughly as
$T^{-2.4}$ (lesson 1), so at 125 C (398 K):
$44\times(398/300)^{2.4}=87\ {\rm m\Omega\,cm^{2}}$. For 15 W at 25 A the
budget is $R_{\rm on}=15/625=24\ {\rm m\Omega}$, needing
$A=87/24\approx3.6\ {\rm cm^{2}}$ of active silicon: an absurd die. (This is
why real 650 V silicon switches are super-junction or IGBT structures, which
escape the unipolar limit by charge-compensation and conductivity modulation
respectively: design routes this course meets in the applied half.)

**SiC attempt.** $\mathcal{E}_c=3\times10^{6}$ V/cm:
$N=3.7\times10^{16}\ {\rm cm^{-3}}$, $W=4.3\ {\rm \mu m}$,
$R=4.3\times10^{-4}/(1.602\times10^{-19}\times900\times3.7\times10^{16})
=0.081\ {\rm m\Omega\,cm^{2}}$; even tripled for temperature and parasitics,
a $0.1\ {\rm cm^{2}}$ die meets the budget thirty times over: the drift
region has ceased to be the resistance at all, and packaging resistance,
channel resistance and substrate take over (module 54's territory).

**The economic close.** The SiC die is 30 times smaller for the same loss,
but SiC wafer cost per area runs an order of magnitude above silicon and
yields lower (module 28's defect economics). The crossover argument is
therefore system-level: the smaller die switches faster (less charge), the
faster switching shrinks the magnetics, and the magnetics dominate converter
cost and volume. Transport physics starts the argument; the bill of
materials finishes it. Both halves belong in the same review.

## Case study 5: auditing a transparent-electrode datasheet

**The document.** A vendor sheet for a sputtered transparent conductive oxide
film offers: thickness 150 nm, sheet resistance $12\ \Omega/\square$,
transmittance 91 percent, "mobility 58 ${\rm cm^{2}/Vs}$", Hall carrier
density $6\times10^{20}\ {\rm cm^{-3}}$, TCR "negligible". The film is a
candidate front electrode, and the task is to decide whether the numbers are
mutually consistent before committing a pilot run: a transport audit, using
nothing beyond this module.

**Check 1: the resistivity triangle.** The three headline numbers must close
on $\sigma=ne\mu$:

$$
\sigma=ne\mu
=6\times10^{26}\times1.602\times10^{-19}\times58\times10^{-4}
=5.6\times10^{5}\ {\rm S/m}
$$

Predicted sheet resistance:
$R_s=1/(\sigma t)=1/(5.6\times10^{5}\times1.5\times10^{-7})
=11.9\ \Omega/\square$: matches the quoted 12 to within a percent. The three
numbers were measured consistently (or derived from one another, which the
audit cannot distinguish: flag for the qualification plan).

**Check 2: is the Hall number trustworthy at this density?** At
$6\times10^{20}\ {\rm cm^{-3}}$ the film is degenerate by a wide margin
(lesson 1, section 2.2: the criterion density was $10^{18}$ to $10^{19}$).
Degeneracy is good news for the audit: the Hall factor collapses to
$r_H=1$ (lesson 1, section 8.3), so the quoted mobility *is* the drift
mobility, with no scattering-mix ambiguity. One systematic eliminated by the
physics itself.

**Check 3: the "negligible TCR" claim.** Degenerate carrier density is
temperature-flat, so all drift sits in the mobility. A disorder-dominated
degenerate oxide behaves like lesson 1's resistance alloys: a large
temperature-independent scattering term diluting a small phonon slope. The
claim is plausible *because* the film is heavily disorder-scattered: quick
estimate, if the phonon share of the resistivity is 10 percent, the film TCR
is a tenth of a metal's, order $4\times10^{-4}\ {\rm K^{-1}}$: small, not
zero, and worth a measured number in qualification rather than an adjective.

**Check 4: the mobility ceiling sanity test.** Is 58 ${\rm cm^{2}/Vs}$
believable at $6\times10^{20}$? Lesson 2's ionised-impurity physics with
every dopant ionised would predict single digits: the film beats the naive
Brooks-Herring estimate by nearly an order of magnitude. This is not fraud;
it is a warning that the *mechanism assumption* is wrong: in degenerate
oxides, screening at these densities is so strong (Debye length below the
interatomic spacing, lesson 2's worked check 16 run to its limit) that
ionised scattering saturates, and grain boundaries or neutral defects set the
mobility instead. The audit conclusion: the number is plausible, the
mechanism matters for what improves it, and module 56 (which owns this
material class) begins exactly at this question: why oxide mobilities sit
where they do and which knob moves them.

**Check 5: what the sheet does not say.** Transmittance at one wavelength
hides the free-carrier absorption edge: at $6\times10^{20}$ the plasma
wavelength (lesson 1's AC Drude, run to $\omega\tau\gg1$) sits near
1.3 µm, so the film is already reflective across the near infrared. For a
display electrode that is irrelevant; for a solar cell front contact it
forfeits the infrared harvest, and the single 91 percent number conceals the
difference. The right requisition adds a spectral transmittance curve and a
77 K mobility (case study 3's lesson applied to a new material family).

**Verdict.** Internally consistent, physically plausible, two claims
upgraded from adjectives to measurements, one hidden trade exposed. Forty
minutes of module 18 arithmetic, and the pilot run proceeds with a
qualification plan that measures what the datasheet implied. That is what
transport literacy is for.

## Comprehensive exam

Closed book apart from the constants sheet of Module C. Problems marked (G)
are graduate tier.

**E18.1** A germanium sample ($m^{*}=0.12\,m_0$, $\mu=3900\ {\rm cm^{2}/Vs}$)
carries $10^{15}$ electrons per cm3. Find $\tau$, $\ell$ (take
$v_{\rm th}=2.4\times10^{5}$ m/s), $\sigma$, and the drift velocity at
50 V/cm.

**E18.2** A metal film's resistance rises 12 percent between 250 and 350 K. A
second, dirtier film of the same metal rises 6 percent over the same range.
Explain quantitatively, and extract the ratio of their residual
resistivities given the phonon slope is common.

**E18.3** Constantan's Nordheim coefficient region gives it
$490\ {\rm n\Omega\,m}$ at $x=0.45$. What would Nordheim predict at
$x=0.30$, and why is a shunt built at 0.45 rather than 0.30 even though both
compositions are buyable?

**E18.4** A silicon resistor at $N_D=5\times10^{16}\ {\rm cm^{-3}}$ (use
$\mu_n=900\ {\rm cm^{2}/Vs}$) must be $10\ {\rm k\Omega}$ from a
$0.8\ {\rm \mu m}$ deep diffusion. How many squares?

**E18.5** At what temperature does a $2\times10^{14}\ {\rm cm^{-3}}$ n-type
drift region lose its extrinsic character ($n_i=0.1N_D$ criterion,
$n_i(300)=1.0\times10^{10}$, $E_g=1.12$ eV)?

**E18.6** A Hall bar: $t=25\ {\rm \mu m}$, $I=5$ mA, $B=0.4$ T,
$V_H=-0.83$ mV, $\rho=0.11\ \Omega$ cm. Extract type, $n$, $\mu_H$, and the
drift mobility bounds from the two limiting Hall factors.

**E18.7** A 30 nm copper line ($\lambda=39$ nm, $p=0$, $d=30$ nm, $R=0.3$)
carries a 0.8 mm route. Find its resistance per micrometre of width, and the
percentage improvement if annealing doubles the grain size.

**E18.8** An APD with silicon's $k=0.05$ needs $F\le4$. What is the maximum
usable gain? (G)

**E18.9** Estimate the 300 K intrinsic carrier density of a semiconductor
with $E_g=0.66$ eV (germanium), given silicon's $1.0\times10^{10}$ at
$E_g=1.12$ eV and assuming equal prefactors. What does the answer imply for
germanium power devices? (G)

**E18.10** A 2DEG at $n_s=4\times10^{11}\ {\rm cm^{-2}}$ shows SdH minima
whose $1/B$ spacing is $0.0517\ {\rm T^{-1}}$. Confirm the density, find the
$\nu=2$ plateau field and resistance, and the temperature at which the 6.2 T
cyclotron gap equals $4k_BT$. (G)

**E18.11** Two materials for a ballistic interconnect experiment: a
semiconductor wire carrying 4 modes and a metallic nanowire carrying 400.
Give both resistances and explain why the metal, despite its enormous mode
count, still cannot beat $32\ \Omega$ however short it is. (G)

**E18.12** Synthesis question. A junior engineer proposes raising an IC's
operating temperature grade from 125 to 175 C, arguing "metal resistance only
rises 20 percent." List the four transport-physics consequences from this
module that the argument misses, with the governing equation for each. (G)

### Exam answers

**E18.1** $\tau=\mu m^{*}/e=3900\times10^{-4}\times0.12\times9.109\times10^{-31}
/1.602\times10^{-19}=2.7\times10^{-13}$ s. $\ell=v_{\rm th}\tau=64$ nm.
$\sigma=ne\mu=10^{21}\times1.602\times10^{-19}\times0.39=62.5$ S/m
($\rho=1.6\ \Omega$ cm). $v_d=\mu\mathcal{E}=3900\times50=1.95\times10^{5}$
cm/s: still two orders below saturation, comfortably linear.

**E18.2** Both films share $d\rho_{\rm ph}/dT$; percentage rise
$=\Delta\rho_{\rm ph}/(\rho_{\rm res}+\rho_{\rm ph})$. Halving the percentage
at fixed numerator means the denominator doubled:
$(\rho_{\rm res,2}+\rho_{\rm ph})=2(\rho_{\rm res,1}+\rho_{\rm ph})$. With
the clean film taken near $\rho_{\rm res,1}\approx0$:
$\rho_{\rm res,2}\approx\rho_{\rm ph}(300)$: the dirty film's defect term
equals its phonon term, and the ratio of residuals is formally large (clean
film's residual near zero). TCR dilution *is* a purity meter: lesson 1
section 5.3 run backwards.

**E18.3** $\rho(x)\propto x(1-x)$ on top of the host:
$\rho(0.30)\approx16.8+C\times0.21$ with $C$ from
$490=16.8+C\times0.2475$: $C=1912$ (the real alloy exceeds the simple rule's
copper-side coefficient: interband effects, which is itself worth a comment
in an answer). Prediction: $418\ {\rm n\Omega\,m}$: only 15 percent below the
0.45 value, but the *TCR* at 0.30 is roughly double, because the
temperature-independent term is smaller relative to the phonon slope and the
compensation tuning (lesson 1, worked example 7.2) is optimised at the
composition of maximum flatness, not maximum resistivity. Shunts are TCR
products, not resistivity products.

**E18.4** $\sigma=5\times10^{16}\times1.602\times10^{-19}\times900=7.2$ S/cm,
$\rho=0.139\ \Omega$ cm; $R_s=\rho/t=0.139/(0.8\times10^{-4})
=1.74\ {\rm k\Omega}/\square$; $N_\square=10/1.74=5.8$ squares.

**E18.5** Need $n_i=2\times10^{13}$: ratio $2\times10^{3}$ over 300 K value.
$\ln(2\times10^{3})=7.6=(E_g/2k_B)(1/300-1/T)$:
$(1/300-1/T)=7.6\times2\times8.617\times10^{-5}/1.12=1.17\times10^{-3}$,
$1/T=2.163\times10^{-3}$, $T=462$ K $=189$ C. The lightly doped drift
region is the thermal weak point, two full grades below the metal's
comfort zone: the E18.12 argument, pre-refuted.

**E18.6** Negative: electrons.
$n=IB/(q|V_H|t)=5\times10^{-3}\times0.4/(1.602\times10^{-19}
\times8.3\times10^{-4}\times2.5\times10^{-5})=6.0\times10^{20}\ {\rm m^{-3}}
=6.0\times10^{14}\ {\rm cm^{-3}}$.
$\mu_H=|R_H|/\rho$ with $R_H=1/nq=1.04\times10^{-2}\ {\rm m^{3}/C}$:
$\mu_H=1.04\times10^{-2}/1.1\times10^{-3}=9.5\ {\rm m^{2}/Vs}$: absurd for
silicon, so re-examine: $\rho=0.11\ \Omega$ cm $=1.1\times10^{-3}\ \Omega$ m
gives $\mu_H=9500\ {\rm cm^{2}/Vs}$... still triple silicon's lattice limit.
The *intended* lesson: an extraction wildly outside the material's known
range signals a measurement artefact (thickness error, parallel conduction,
geometry factor), and the correct engineering answer is "reject and
re-measure", not "report 9500". Bounds requested: with $r_H\in[1.0,1.93]$,
drift mobility lies in $[4900,9500]$: the spread itself screams
mixed-scattering uncertainty on top of the artefact. Numbers that pass
arithmetic can still fail physics; catching that is the skill.

**E18.7** Factors: FS $1+\tfrac{3}{8}(39/30)=1.49$; MS
$\alpha=(39/30)(3/7)=0.557$, bracket $\approx0.196$, factor 1.70. Total
$\rho\approx16.8\times(1+0.49+0.70)=36.8\ {\rm n\Omega\,m}$. Per micrometre
of width, $A=30\ {\rm nm}\times1\ {\rm \mu m}$:
$R=36.8\times10^{-9}\times8\times10^{-4}/(3\times10^{-14})=981\ \Omega$.
Doubling $d$: $\alpha=0.279$, bracket 0.294, factor 1.13: total ratio 2.62
against 3.19, a **17.7 percent** improvement from the anneal alone: why
grain-growth anneals are free money in interconnect flows.

**E18.8** $F=kM+(2-1/M)(1-k)\le4$: $0.05M+1.9-0.95/M\le4$ (approximating
$2-1/M\approx2$ first): $M\le42$; exact solve of
$0.05M^{2}-2.1M-0.95=0$ ... keeping the full form:
$0.05M+(2-1/M)(0.95)=4$ gives $0.05M^{2}+1.9M-0.95=4M$, so
$0.05M^{2}-2.1M-0.95=0$, $M=(2.1+\sqrt{4.41+0.19})/0.1=42.4$. Gain 42:
silicon APDs indeed run gains of tens; the III-V $k=0.5$ answer to the same
question is $M\approx4$, and that gap is the detector market's structure in
one inequality.

**E18.9** $n_i\propto e^{-E_g/2kT}$: ratio
$=e^{(1.12-0.66)/(2\times0.02585)}=e^{8.9}=7.3\times10^{3}$, so
$n_i^{\rm Ge}\approx7\times10^{13}\ {\rm cm^{-3}}$ (measured:
$2.4\times10^{13}$: the equal-prefactor assumption is the error, and stating
that is part of a full answer). Consequence: E18.5's criterion puts a
$10^{14}$-doped germanium drift region intrinsic barely above room
temperature: germanium power devices died of leakage, and the industry's
silicon migration in the 1960s was this arithmetic playing out.

**E18.10** $n_s=2e/(h\Delta(1/B))=2\times1.602\times10^{-19}
/(6.626\times10^{-34}\times0.0517)=9.35\times10^{15}$... that returns
$9.4\times10^{15}\ {\rm m^{-2}}$: the spacing given corresponds to
$n_s=9.4\times10^{11}\ {\rm cm^{-2}}$, not the stated $4\times10^{11}$: the
two data are **inconsistent**, and the exam point is to catch it: either the
density or the oscillation data is wrong (a gate leak between measurements is
the classic culprit). For the stated $n_s=4\times10^{11}$: $\nu=2$ at
$B=n_sh/2e=8.3$ T, $R_{xy}=12.906\ {\rm k\Omega}$; gap condition
$\hbar\omega_c=4k_BT$ at $B=6.2$ T: $T=1.73\times6.2/(4\times0.0862)
=31$ K.

**E18.11** Semiconductor: $12.906/4=3.23\ {\rm k\Omega}$. Metal:
$12.906\ {\rm k\Omega}/400=32\ \Omega$. The floor is the contact
resistance of the Landauer picture: with only 400 conducting channels
meeting the reservoirs, $h/2e^{2}$ per channel is charged at the interface
regardless of length: no scattering to remove, so no improvement available.
Mode count, set by cross-section over Fermi wavelength squared, is the only
lever, which is the deep reason metallic interconnect (Fermi wavelength
0.5 nm, millions of modes) survives scaling while semiconductor wires
(tens of nm wavelength) hit the quantum limit first.

**E18.12** The four misses:
(1) **Carrier statistics**: lightly doped regions approach intrinsic
($n_i\propto e^{-E_g/2kT}$): leakage and latch-up margins collapse (E18.5).
(2) **Mobility collapse**: $\mu\propto T^{-2.4}$ in silicon: drive current
falls about 30 percent over the step, far more than the metal's 20 percent
($\rho\propto T$).
(3) **Hot-carrier and avalanche margins**: avalanche $V_{\rm BR}$ shifts and
the $T_e$ tail (energy balance $e\mathcal{E}v_d=\tfrac{3}{2}k\Delta T/\tau_E$)
rides on a hotter baseline: reliability derating is exponential, not linear.
(4) **Interconnect beyond the mean value**: electromigration (module 22's
diffusion under force) accelerates with an activation law
$\propto e^{-E_a/kT}$: a 50 C step can cost 10x in lifetime, dwarfing the
resistance argument entirely. The junior engineer priced the one linear
effect in a system of exponentials.

## A one-page revision map of module 18

For the exam above and for everything downstream, the module compresses to
twelve results. Being able to reconstruct each from memory, with its regime
of validity, is the mastery criterion.

1. $\mu=e\tau/m^{*}$ and $\sigma=ne\mu$: the factorization, valid whenever
   transport is diffusive and the band picture holds ($k_F\ell\gg1$).
2. $v_d(t)=\mu\mathcal{E}(1-e^{-t/\tau})$ and
   $\sigma(\omega)=\sigma_0/(1+i\omega\tau)$: the same relaxation time in the
   time and frequency domains.
3. Degeneracy criterion $n$ against $N_c$: which statistics, which
   formulas, whether $r_H=1$.
4. $\rho=\sum_i\rho_i$ (Matthiessen): additive resistivities, worst mechanism
   rules, deviations diagnose coupling.
5. $\rho_{\rm ph}\propto T$ warm, $T^{5}$ cold (Bloch-Gruneisen), with
   $\rho_{\rm res}$ as the purity floor and RRR as its metric.
6. $n_i\propto e^{-E_g/2k_BT}$: the plateau and its two ends; slopes measure
   $E_g/2$ and $E_d/2$.
7. Nordheim $\rho=Cx(1-x)$ and its mobility twin: disorder from occupancy
   variance, ceiling at $C/4$, broken by ordering.
8. Power laws $\mu_{\rm ac}\propto T^{-3/2}$, $\mu_{\rm ii}\propto T^{+3/2}$:
   the peak, the two-temperature decomposition, the 77 K acceptance test.
9. Size effects: $\rho_f/\rho_0=1+\tfrac{3}{8}(1-p)\lambda/t$ plus
   Mayadas grains: the $\rho_0\lambda$ figure of merit for narrow conductors.
10. Percolation: bounds, Bruggeman $\phi_c$, the $(\phi-\phi_c)^{2}$ law and
    its process-tolerance consequences.
11. $V_H=IB/nqt$, the two-carrier correction, and the measurement protocol;
    $v_{\rm sat}$, $T_e$ from the energy balance, Chynoweth $\alpha$, the
    ionisation integral, and $R_{\rm on}\propto V^{2}/\mathcal{E}_c^{3}$.
12. $G=(2e^{2}/h)\sum T_n$, Landau levels $n_L=eB/h$, and
    $R_{xy}=h/\nu e^{2}$: transport when counting replaces scattering.

A study suggestion that earns its space: rebuild the twelve entries as a
single hand-drawn concept map, with arrows for "derives from" and
"limits the validity of". The exercise exposes the module's skeleton: entries
1 to 5 are one relaxation-time idea elaborated, 6 to 8 are carrier statistics
meeting scattering, 9 and 10 are geometry taking over from material, and 11
and 12 are the two exits from the diffusive picture, upward in field and
downward in size. Four ideas, not twelve formulas, is what should survive in
long-term memory.

## Where to go next

Module 19 applies these transport ideas to light (free-carrier absorption is
the AC Drude tail of lesson 1); module 36 turns lesson 3's measurements into
laboratory protocol; modules 39 and 55 run the high-field and thermoelectric
threads to their device conclusions; and lesson 4's Landauer accounting
returns wherever this course touches the nanoscale: modules 48, 49 and 52.

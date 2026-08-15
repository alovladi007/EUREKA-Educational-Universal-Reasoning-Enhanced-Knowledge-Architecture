# Module 22 Workshop: Three Problems Worked the Long Way

<!-- covers: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.7, 22.8, 22.9, 22.10, 22.11, 22.12, 22.13, 22.14 -->

The course's workshop format: real tasks worked at full length, dead ends
included, every step's arithmetic shown as a checkable line. Three sessions:
commissioning a two-step diffusion with its error budget, diagnosing a
resistivity drift that turns out to be chemistry, and setting the cut plan
for a doped crystal before it is grown. All numbers come from the module's
stated parameters and the lesson 5 data book; nothing is imported.

**Level.** Application throughout. If any line cannot be reproduced on
paper, the corresponding lesson section is the remedy, and finding that out
is the point of the format.

## Session 1 - commissioning the two-step boron recipe

**The task.** Bring the Case 1 well recipe (lesson 6) to a new furnace and
prove it before product runs. Target restated: $x_j = 1.0$ to 1.2 μm over
$10^{16}$ cm⁻³, surface between $10^{18}$ and $2\times10^{19}$ cm⁻³.

**Step 1: restate what the recipe believes.** Predep 30 min at 1000 °C:
$D_1 = 1.1\times10^{-14}$ cm²/s, $D_1t_1 = 2.0\times10^{-11}$ cm²,
$Q = 1.128\,C_s\sqrt{D_1t_1} = 5.1\times10^{14}$ cm⁻² at
$C_s = 10^{20}$ cm⁻³. Drive 60 min at 1100 °C:
$D_2t_2 = 4.1\times10^{-10}$ cm². Since $D_2t_2 \gg D_1t_1$ (ratio 20), the
predep is well approximated as a surface dose and the drive-in Gaussian
applies:

$$
C(0) = \frac{Q}{\sqrt{\pi D_2t_2}} = 1.4\times10^{19}\ \mathrm{cm^{-3}},
\qquad
x_j = 2\sqrt{D_2t_2\,\ln\!\frac{C(0)}{C_B}} = 1.1\ \mathrm{\mu m}.
$$

![The full two-step recipe computed from the stated solutions: the shallow solubility-pinned erfc after predeposition, and the drive-in Gaussian carrying the same dose deeper at a surface concentration the device can tolerate.](/courses/electronic-devices/figures/m22-predep-drivein.svg)

**Step 2: the dead end, worked honestly.** First instinct: verify with a
four-point-probe sheet resistance only, because it is fast. Run the
estimate: $R_s = 1/(q\,\bar\mu\,Q_{\mathrm{active}})$; with an effective
hole mobility near 100 cm²/Vs at these dopings,

$$
R_s \approx \frac{1}{1.6\times10^{-19}\times100\times5.1\times10^{14}}
\approx 120\ \Omega/\square.
$$

The dead end: $R_s$ tests the product $\bar\mu\,Q_{\mathrm{active}}$, one
number. A furnace 15 °C hot moves $x_j$ 20 percent while moving $R_s$ a few
percent, inside probe repeatability; a predep 15 °C cold drops $Q$ by 20
percent and $R_s$ catches it. Sheet resistance guards the dose, not the
depth. The commissioning plan therefore needs groove-and-stain or SIMS for
depth on the monitor, and $R_s$ as the per-lot control chart afterwards.
Knowing which instrument guards which failure is the recipe.

### Worked example W.1 - the temperature error budget in one line

From lesson 1's P22.4 relation, $\delta D/D = (E_a/k_BT)(\delta T/T)$. At
the drive step, $E_a/k_BT = 3.5/0.1183 = 29.6$, and
$x_j \propto \sqrt{D}$ softens the transfer by half:

$$
\frac{\delta x_j}{x_j} \approx \frac{1}{2}\times29.6\times\frac{\delta T}{1373}
= 0.011\ \text{per °C}.
$$

The 0.1 μm of window margin around 1.1 μm is 9 percent, so the furnace may
err by $0.09/0.011 \approx 8$ °C before product escapes. A modern furnace
holds 1 to 2 °C: the recipe is safe, and now provably so, which is what
commissioning means.

## Session 2 - the resistivity that drifted and the wafer that healed itself

**The symptom.** After a new plasma nitride step, p-type test structures
read 25 percent high in resistivity. A week later, the same wafers,
re-measured after storage in a 60 °C cabinet, read correct. The line asks
whether the tester is broken.

**Step 1: eliminate the boring explanations.** The tester repeats on a
control wafer; the profile shape by C-V is undistorted, uniformly weaker.
A uniform fractional loss of active acceptors, appearing after a
hydrogen-rich plasma step and healing at 60 °C, is lesson 2's H-B pair
signature; commit to it and make it quantitative before acting.

**Step 2: does the magnitude fit?** 25 percent high resistivity means the
hole concentration fell to $1/1.25 = 0.80$ of nominal: pair fraction
$f = 0.20$. Plausible for a direct-plasma nitride at 300 °C with abundant
atomic hydrogen; a remote plasma would have given less.

**Step 3: does the recovery time fit?** From lesson 2's model at 333 K
with the stated 1.4 eV: dissociation rate
$\nu e^{-E_a/k_BT} = 10^{13}e^{-48.8} = 6\times10^{-9}$ s⁻¹, time constant
5 years. A week at 60 °C should have healed nothing, yet it healed. The
model, not the diagnosis, is what bends: the stated barrier is the
retrapping-free teaching value, and A22.11 already bounded the effective
barrier near 1.2 eV when out-diffusion assists. Check 1.2 eV:

$$
\nu\,e^{-1.2/0.0287} = 10^{13}\,e^{-41.8} = 7\times10^{-6}\ \mathrm{s^{-1}},
$$

time constant 1.7 days: a week heals it. The magnitude and both timescales
now cohere.

### Worked example W.2 - designing the recovery anneal instead of waiting

Production cannot store wafers for a week. Required: 99 percent pair
dissociation, so $\nu t\,e^{-E_a/k_BT} = \ln(100) = 4.6$, in at most 10
minutes. Solve for temperature at $t = 600$ s with the effective 1.2 eV:

$$
k_BT = \frac{1.2}{\ln(10^{13}\times600/4.6)} = \frac{1.2}{\ln(1.3\times10^{15})}
= \frac{1.2}{34.8} = 0.0345\ \mathrm{eV},
$$

$T = 400$ K $= 127$ °C. Prescribe 150 °C for margin, 10 minutes, after the
last hydrogen-rich step and before electrical test. One line in the flow,
and the "broken tester" ticket closes with a chemistry citation. The
general lesson: a drifting parameter with a sub-eV-to-1-eV effective
barrier is chemistry, not electronics, and the anneal that proves it costs
nothing.

## Session 3 - the cut plan for a phosphorus crystal, decided before growth

**The task.** A customer orders wafers at resistivity corresponding to
melt-normalized concentration between 0.9 and 1.4 (in units of $kC_0$,
i.e. the seed-end value; spec width a factor 1.56). Decide the charge
doping and the cut points before the crystal is grown, $k = 0.35$.

**Step 1: place the spec window on the Scheil curve.** Concentration along
the crystal is $C_s(g)/C_s(0) = (1-g)^{-0.65}$. The window
$[0.9, 1.4]\times$ seed-normalized target requires choosing which part of
the curve to sell. Set the charge so the window is entered a little after
the seed: solve for $g$ at the window edges with the seed at 0.9 of
nominal, i.e. dope the melt to make $C_s(0) = 0.9\,C_{\mathrm{nom}}$:

$$
(1-g)^{-0.65} = \frac{1.4}{0.9} = 1.556
\;\Rightarrow\;
\ln(1-g) = -\frac{\ln 1.556}{0.65} = -0.680
\;\Rightarrow\;
g = 0.49.
$$

Sellable crystal: the first 49 percent. Cutting the window differently,
seed at exactly 1.0, sells from $g$ where the curve hits 0.9... which it
never does, since the curve only rises: placing the seed at the window
bottom is optimal, and the 49 percent yield is the physics ceiling for
this dopant and spec, before BPS corrections.

**Step 2: the BPS correction that moves the doping, not the yield.** At
the operating point of lesson 4 ($v\delta/D = 0.11$),
$k_{\mathrm{eff}} = 0.376$, not 0.35: incorporation runs 7 percent above
the Scheil-with-$k$ arithmetic everywhere. Since the correction multiplies
the whole curve, the yield fraction stands and the melt charge is trimmed
down 7 percent instead. Striations (the fluctuating part of
$k_{\mathrm{eff}}$) ride on top at the percent level, inside the spec
width, and are the customer's radial-uniformity problem to negotiate
separately.

### Worked example W.3 - what continuous recharge would buy

If melt concentration were held at $C_0$ by continuous recharge, the
crystal would lay down $k_{\mathrm{eff}}C_0$ indefinitely: the whole ingot
inside any window wider than the striation band, yield limited by
mechanics rather than segregation. The buy decision compares the recharge
hardware against the 51 percent of every conventional crystal this order
remelts: at this spec the hardware wins on the second furnace, which is
why continuous and recharged CZ exist as products and not as papers.

## Close-out: what the three sessions leave behind

Each session ends with an artefact, and the artefacts are the point.
Session 1 leaves a commissioning report: the stated model, the two
guarded failure axes with their instruments, and the measured furnace
margin in degrees. Session 2 leaves a flow change, one bake step with a
chemistry citation, plus a standing rule for the failure-analysis team:
fit the drift's activation energy before opening the tester. Session 3
leaves a quote: yield fraction as a function of spec width, computed
before the crystal exists, which is the only time the computation has
negotiating power. None of the three artefacts contains a new equation;
all three contain this module's equations pointed at a decision someone
was going to make anyway, with or without the physics. The workshop's
closing claim is that this is the normal ratio: in practice the module's
mathematics is rarely asked to predict a number from nothing, and
constantly asked to referee which of two explanations is possible, which
error source dominates, and what a specification costs. Fluency at that
refereeing, more than recall of any solution, is what the module is for.

## Problems

**P22.31** Session 1 chose SIMS for depth and $R_s$ for dose. A colleague
proposes C-V profiling as a single instrument for both. Give the two
reasons from lesson 2 it cannot serve as the depth referee at this
junction's contrast and depth.

**P22.32** Recompute worked example W.1's tolerance if the drive step were
run at 1000 °C for 10 hours instead (same $Dt$). Which recipe is more
robust to furnace error, and what does the answer say about why drives are
run hot and short within the budget?

**P22.33** In session 2, propose the control experiment that would have
confirmed hydrogen within a day rather than a week, and state the expected
quantitative signature.

**P22.34** Session 3's customer tightens the spec to a factor 1.25 width.
Compute the new yield fraction and the price multiplier if cost scales
inversely with sellable fraction.

**P22.35** Apply session 3's method to boron ($k = 0.8$): show the same
1.556-wide window sells 89 percent of the crystal, and explain in one
sentence why boron crystals are cheap.

**P22.36** Write the one-page commissioning plan (session 1 format) for
the zinc diffusion of lesson 3, identifying the parameter that replaces
furnace temperature as the dominant error source and the measurement that
guards it.

### Answers

**A22.31** Depth limit: C-V sweeps a depletion region, and at
$10^{16}$ cm⁻³ background reaching 1.1 μm requires bias near breakdown, so
the profile stops short of the junction it is supposed to referee. And
resolution: the Debye length at the surface concentration smears the
near-surface decade, so neither end of the profile is trustworthy: right
instrument for moderate depths and contrasts, wrong referee here.

**A22.32** At 1000 °C, $E_a/k_BT = 31.9$, and per-°C sensitivity
$= 0.5\times31.9/1273 = 0.0125$ per °C, against 0.011 at 1100 °C: the
colder recipe is slightly less robust per degree, and its 10 hour length
adds ramp share and drift exposure. Hot-and-short wins twice: marginally
smaller fractional sensitivity, and less wall-clock for the furnace to
wander in. The budget ceiling, not robustness, is what caps the
temperature.

**A22.33** Bake one afflicted wafer at 150 °C for 10 minutes (worked
example W.2's anneal) alongside an unbaked control and re-measure both.
Signature: the baked wafer recovers its full 25 percent within the
afternoon, the control does not move at 25 °C, and the recovery magnitude
equals the original loss to within measurement error, since pairing is
reversible and stoichiometric: one hidden acceptor per pair.

**A22.34** $(1-g)^{-0.65} = 1.25$: $\ln(1-g) = -\ln(1.25)/0.65 = -0.343$,
$g = 0.29$. Yield falls from 49 to 29 percent; price multiplier
$0.49/0.29 = 1.7$. Spec width is money, and this arithmetic is how the
quote is built.

**A22.35** $(1-g)^{-0.2} = 1.556$: $\ln(1-g) = -\ln(1.556)/0.2 = -2.21$,
$1-g = e^{-2.21} = 0.11$, so $g = 0.89$: with the seed placed at the
window bottom, the first 89 percent of the crystal sells, against
phosphorus's 49, because the exponent $k-1 = -0.2$ is more than three
times gentler. One sentence: with $k$ near 1 the melt barely enriches, so
nearly the whole crystal sits inside any commercial window, and boron's
flat Scheil curve is priced into every p-type substrate.

**A22.36** Believe: $D \propto (C/C_s)^2$, front depth
$\propto C_s\sqrt{t}$ (lesson 3, worked example 1.1). Dominant error
source: the surface concentration, set by zinc vapour pressure in the
ampoule, transferring percent-for-percent to depth, where temperature
transfers only through the ordinary Arrhenius factor common to all
recipes. Guard: a front-depth measurement on every ampoule load
(groove-and-stain is enough, the front is a wall), charted against ampoule
temperature, with SIMS reserved for excursions. Dead end to name in the
plan: sheet resistance, which the plateau-shaped profile makes almost
blind to front position.

# Integration and Its Economics: the Laws That Built the Industry

<!-- covers: 17.1 -->

The materials half of this course opens with a framing module, and the framing
is quantitative. The defining fact of electronics is that the number of
devices on one chip grew by eight orders of magnitude while the cost per
device fell by roughly as much, and none of that was luck: it follows from a
small set of scaling laws whose derivations fit on a page each. This lesson
derives them, prices them, and shows where each one has now run out.

**Level.** Sections 1 to 5 are the undergraduate core; section 6 is the
graduate extension on yield statistics and the economics of the end of
scaling. Section 7 is the problem set.

## 1. The compounding rule

### 1.1 The observation, stated as arithmetic

Component count per chip doubling on a fixed cadence is an exponential:

$$
N(t)=N_0\,2^{(t-t_0)/T_d}
$$

with a doubling time $T_d$ of roughly two years across five decades. From
$2.3\times10^{3}$ devices in 1971, fifty-two years at that cadence predicts

$$
N(2023)=2.3\times10^{3}\times2^{52/2}=2.3\times10^{3}\times6.7\times10^{7}
\approx1.5\times10^{11}
$$

within a factor of two of shipped chiplet-era processors: the rule held for
half a century to within round-off.

![The single compounding rule, drawn as the exponential it is, with three marked generations. Nothing else in engineering history has held one slope for fifty years.](/courses/electronic-devices/figures/m17-transistor-count.svg)

### 1.2 Why an economic law and not a physical one

Nothing in physics mandates a doubling every two years. The rule is a
**self-fulfilling schedule**: the industry road-mapped the cadence, sized its
R and D to hit it, and priced products assuming rivals would too. What physics
supplies is *permission*: each generation had to clear real barriers (gate
leakage, lithography wavelength, interconnect delay), and modules 43, 22 and
18 of this course are the stories of specific permissions being engineered.
The correct reading of the exponential is therefore: **materials advances were
consumed at a fixed rate**, and when a needed advance was late, the industry
felt it as a "law" faltering.

### Worked example 1.1 — the cadence as a sensitivity

If the doubling time slips from 2.0 to 2.5 years, how much density is lost
over a decade? Ratio $=2^{10/2}/2^{10/2.5}=2^{5-4}=2$: **half the density**,
from a six-month slip per generation. The compounding is merciless in both
directions, which is why single-generation delays (a late lithography tool, a
missed material) echo for a decade of product roadmaps.

## 2. Why more devices per chip meant cheaper devices

### 2.1 The planar argument

A wafer is processed as a whole: lithography, implant, etch and deposition
touch every device on it simultaneously. To first order the cost of a
processed wafer is independent of how many transistors are printed on it, so

$$
\text{cost per transistor}=\frac{C_{\rm wafer}}{N_{\rm per\,wafer}}
$$

and density improvements divide the numerator across more devices. This is
the **batch-processing dividend**, and it is why electronics scaled in cost
while mechanical assembly, which touches parts one at a time, never did.

### 2.2 Wright's law: volume itself cuts cost

Independently of shrinking, manufacturing learns. Wright's law states unit
cost falls as a power of cumulative volume $V$:

$$
C=C_0V^{-b}
$$

![Two learning exponents on the same axes. The transistor's b near 0.4 is the steepest sustained learning curve ever measured, because shrink and learning compound in one product.](/courses/electronic-devices/figures/m17-wright-learning.svg)

For most manufactured goods $b\approx0.2$; for transistors the measured slope
is nearer 0.4 because geometric shrink rides on top of ordinary learning. The
same law reappears at module scale in this course: photovoltaic modules and
LED lumens (lesson 3) each follow their own Wright curve, and knowing the
exponent is knowing the future price to a first approximation.

### Worked example 2.1 — pricing a future device

A power device costs 2.00 currency units at cumulative industry volume
$10^{8}$ units, with $b=0.25$. Estimate cost at $10^{10}$ units:

$$
C=2.00\times\left(\frac{10^{10}}{10^{8}}\right)^{-0.25}
=2.00\times100^{-0.25}=2.00\times0.316=0.63
$$

A hundredfold volume buys a threefold cost cut with **no invention at all**:
the argument behind every "scale it and the price will come" technology plan,
and also the trap: the law prices the winner, and only one technology gets
the volume (module 31's infrared detectors and module 47's memory both lost
markets on exactly this arithmetic).

## 3. Dennard scaling: the free lunch, itemised

### 3.1 The constant-field rules

Scale every linear dimension of a MOSFET by $1/\kappa$, the supply voltage by
$1/\kappa$, and doping up by $\kappa$. Then internal electric fields are
unchanged, and per device:

| quantity | scaling |
|---|---|
| dimensions $L, W, t_{ox}$ | $1/\kappa$ |
| voltage $V$ | $1/\kappa$ |
| capacitance $C\propto WL/t_{ox}$ | $1/\kappa$ |
| current $I\propto (W/L)V^{2}/t_{ox}$ | $1/\kappa$ |
| delay $\tau=CV/I$ | $1/\kappa$ |
| power $P=IV$ | $1/\kappa^{2}$ |
| power density $P/(WL)$ | $1$ |

$$
\boxed{\;\text{devices/area}\times\kappa^{2},\quad
\text{speed}\times\kappa,\quad
\text{power/area}\times1\;}
$$

![The three dividends of constant-field scaling. For thirty years each shrink delivered more, faster, in the same thermal envelope, all three at once.](/courses/electronic-devices/figures/m17-dennard.svg)

Every shrink delivered denser, faster **and** no hotter, simultaneously. That
triple dividend, not the transistor count alone, is what made the exponential
an economic engine.

### 3.2 Where it broke

Two floors ended it, both material facts from module 18:

- **The subthreshold floor.** A MOSFET turns off no faster than
  $k_BT\ln 10/e=60$ mV per decade of current at 300 K, so the threshold
  voltage cannot keep shrinking without exponential leakage. That pins
  $V_{th}$, and with it $V_{dd}$, near 1 V.
- **Gate tunnelling.** Oxide thinning hit direct tunnelling at about 1.2 nm
  (module 43), decoupling $t_{ox}$ from the ladder.

With $V$ stuck, power density scales as $\kappa$ rather than 1: every shrink
now *heats* the chip. The observable consequences arrived within a few years
of each other:

![Computed history: clock frequency rides its exponential until the supply voltage hits the one-volt floor, then pins at a few gigahertz while the industry pivots to cores. Two panels, one cause.](/courses/electronic-devices/figures/m17-frequency-vdd.svg)

### 3.3 Dark silicon

Post-Dennard, per-device switching energy falls more slowly than area, so at
fixed package power the fraction of the chip that can switch simultaneously
falls every generation:

$$
f_{\rm active}\propto\left(\frac{\text{energy scaling}}{\text{area scaling}}\right)^{n}
$$

![The switchable fraction computed for a representative post-Dennard energy-versus-area ratio: within a handful of generations most of the chip is area you own but cannot power at once.](/courses/electronic-devices/figures/m17-dark-silicon.svg)

The design responses are visible in every modern processor: many cores run
below peak, specialised accelerators light up only for their workload, and
whole blocks power-gate. **Architecture became the continuation of scaling by
other means**, and the pressure moved to materials that cut energy per
operation: high-k gates (module 43), strained channels (module 38), and the
steep-slope device candidates that motivate ferroelectric gate stacks
(module 42).

### Worked example 3.1 — the heat cost of ignoring the floor

A chip dissipates 100 W at $V_{dd}=1.0$ V. Marketing wants 20 percent more
clock via 10 percent more voltage ($f$ roughly tracks $V$ here). Dynamic power
scales as $fV^{2}\propto V^{3}$:

$$
P=100\times1.1^{3}=133\ {\rm W}
$$

One-third more heat for one-fifth more speed, and leakage (exponential in
$V$ through drain-induced barrier lowering) worsens on top. This cube is why
"turbo" is a transient mode rationed by thermal mass, not a setting: the
package borrows against the heat sink's time constant (module 35).

## 4. Yield: the statistics that gate everything

### 4.1 The Poisson model

Scatter defects randomly at density $D_0$ per unit area; a die of area $A$
survives only if it contains zero killers. Poisson statistics give

$$
\boxed{\;Y=e^{-AD_0}\;}
$$

![Yield against defect density for three die sizes, computed from the Poisson law. The exponential is the entire economics of large dies: at fixed cleanliness, doubling area squares the survival odds.](/courses/electronic-devices/figures/m17-yield-poisson.svg)

The exponential composes viciously: at $Y=e^{-AD_0}$, a die of $2A$ yields
$Y^{2}$. Real fabs fit the more forgiving **negative binomial**,

$$
Y=\left(1+\frac{AD_0}{\alpha}\right)^{-\alpha}
$$

where $\alpha$ measures defect clustering (clustered defects waste fewer dies
than scattered ones; $\alpha\to\infty$ recovers Poisson). Typical fitted
$\alpha$ is 2 to 5.

### 4.2 Dies per wafer

Geometry adds an edge tax. A useful approximation for gross dies on a wafer
of diameter $d$:

$$
N_{\rm gross}\approx\frac{\pi(d/2)^{2}}{A}-\frac{\pi d}{\sqrt{2A}}
$$

![Gross and yielded dies per 300 mm wafer against die area: the edge-loss term bends the geometric curve, and the yield exponential bends it much harder.](/courses/electronic-devices/figures/m17-dies-per-wafer.svg)

### Worked example 4.1 — why chiplets exist, in four lines

Compare one 8 cm2 die against four 2 cm2 chiplets at $D_0=0.1\ {\rm cm^{-2}}$
(Poisson). Monolith: $Y=e^{-0.8}=0.449$. Chiplet: each
$Y=e^{-0.2}=0.819$; four good ones needed, but they are drawn independently
from the wafer population, so the silicon efficiency is the per-die yield,
0.819. Good silicon per wafer improves by $0.819/0.449=1.82$: **82 percent
more sellable area**, bought at the price of packaging four parts (module 54's
2.5D story). At $D_0=0.2$ the ratio is $e^{1.2}/e^{0.4}$ per unit area
$\approx2.2$: the dirtier the process or the bigger the product, the stronger
the chiplet argument, which is why the biggest dies fragmented first.

### Worked example 4.2 — reading a yield report

A fab reports 71 percent yield on a 1.2 cm2 die. Extract $D_0$ (Poisson) and
predict a 3.5 cm2 product: $D_0=-\ln(0.71)/1.2=0.285\ {\rm cm^{-2}}$;
$Y_{3.5}=e^{-3.5\times0.285}=e^{-0.998}=0.37$. If the fab's clustering
$\alpha=3$: $Y=(1+0.998/3)^{-3}=(1.333)^{-3}=0.42$: clustering is worth five
yield points on the big die, which is why the fitted $\alpha$ is negotiated
as hard as $D_0$ in any foundry contract.

## 5. The engine, assembled

Put the pieces together per node: density doubles ($\times2$ transistors per
wafer at equal yield), processed-wafer cost rises roughly 20 to 30 percent
(more steps, costlier tools), and yield matures along its learning curve.
Cost per transistor then falls as long as

$$
\frac{C_{n+1}/N_{n+1}}{C_n/N_n}=\frac{1.28}{2}<1
$$

![The engine and its sputter, computed: wafer cost compounds upward at about 28 percent per node while density doubles, so cost per transistor falls, but the margin between the two curves is the whole profit of scaling and it has thinned.](/courses/electronic-devices/figures/m17-cost-per-transistor-node.svg)

The margin was comfortable for forty years and is now a sliver: at the most
advanced nodes, wafer-cost growth (EUV lithography, multi-patterning, more
layers) has at times matched the density gain, making new nodes **faster but
not cheaper**. That single ratio explains the industry's present shape: only
products that monetise speed or power (not cost) migrate first, older nodes
stay in production for decades, and the action spreads to packaging
(module 54) and materials substitutions that improve energy rather than
density.

## 6. Graduate extension: three refinements that matter in practice

**Systematic versus random yield.** The Poisson/negative-binomial machinery
prices *random* defects; process-window failures (lithography hotspots, etch
loading) are *systematic* and multiply in as a separate factor
$Y=Y_{\rm sys}Y_{\rm rand}$. Early in a node $Y_{\rm sys}$ dominates and
improves by redesign rules, not cleanliness: the distinction decides where an
engineering team spends its quarter, and misattributing one to the other is
the classic ramp mistake.

**Cost of capital in $C_{\rm wafer}$.** A leading-edge fab is tens of billions
of currency units amortised over roughly five years; at high utilisation the
amortisation is the largest single line in wafer cost. Hence the brutal
volume logic: the same fab at 60 percent utilisation produces wafers roughly
40 percent dearer, which cascades through Wright's law into the product's
market position. Capacity discipline is a materials-economics variable as
real as $D_0$.

**Why 450 mm did not happen.** Lesson 2's wafer figure shows the diameter
ladder stopping. Each step roughly doubled area at similar per-wafer process
cost, a straight 2x on the engine above. At 450 mm the tool set (every
chamber, every handler, lithography optics) needed reinvention while the
industry's growth had shifted from unit volume to value; the projected saving
no longer cleared the capital hurdle. It is the cleanest recorded case of a
physically demonstrated scaling step dying on finance alone, and a template
for evaluating any proposed platform change in this course: the physics
gates, the economics decides.

## 6b. After the engine: the three successor scalings

Because this module frames the whole materials half, it should say plainly
what "scaling" means now that the classical engine sputters. Three successor
programmes, each with its own materials bill, organise the industry's
present decade.

**Density by geometry rather than pitch.** When the 2D pitch stalls, build
upward: finFETs to nanosheets (module 43's electrostatics motivated both),
3D NAND's hundreds of stacked layers, and the chiplet/3D-package stack of
module 54. The materials bill: conformal deposition (module 44's ALD as the
enabling tool), high-aspect etch, and the bonding interfaces whose
copper-to-copper metallurgy module 54 details. The yield mathematics of this
lesson transfers intact: a stack of $k$ layers multiplies exposure to defects
exactly as die area did, and 3D memory's tolerance comes from redundancy and
repair, the architectural cousin of clustering.

**Energy rather than frequency.** The identities of lesson 5 make energy per
operation the scarce resource. The materials levers, in this course's order:
carrier velocity and electrostatics in the channel (modules 38, 43), lower
$\varepsilon$ around the wires (module 43), resistivity floors in the wires
themselves (module 18's size effects), and, speculatively, steeper-than-60mV
switches (module 42's ferroelectric gambit). Each promises tens of percent,
not doublings: the successor scalings are additive, not exponential, which
is the deepest sense in which the classical era ended.

**Specialisation rather than generality.** When general logic stops getting
cheaper per function, functions migrate to matched silicon: accelerators for
arithmetic-dense workloads, analogue-in-memory proposals (module 47's
resistive arrays), photonic interconnect for the longest wires (this
module's lesson 6, the deferred photonics wave for the rest). The economic
form of lesson 1 survives: each specialised platform rides its own smaller
Wright curve: but the single shared exponential that disciplined the whole
industry has fractured into many, and roadmapping now means portfolio
judgement rather than slope-reading. The skill this module teaches: pricing
a claim against its physics: is what replaces the roadmap's certainty.

## 7. Problems

**P17.1** From $N(t)=2300\times2^{(t-1971)/2}$, in what year does the model
cross $10^{9}$ devices, and what doubling time would have been needed to reach
$10^{11}$ by 2010?

**P17.2** A product line has $b=0.3$ and current cost 5.00 at cumulative
volume $10^{7}$. What volume halves the cost, and what does the answer become
for $b=0.15$?

**P17.3** Under constant-field scaling with $\kappa=1.4$ per node, how many
nodes turn a 3 GHz, 100 W/cm2-envelope design into a 12 GHz one, and what
would the power density have been if voltage had NOT scaled (constant-voltage
scaling: power density $\propto\kappa^{3}$)?

**P17.4** A 600 mm2 GPU is built at $D_0=0.08\ {\rm cm^{-2}}$. Find Poisson
yield, negative-binomial yield at $\alpha=2$, and gross dies on 300 mm.

**P17.5** Using the engine ratio, what per-node wafer-cost growth exactly
cancels a density doubling? If density gain per node has slipped to 1.6x,
what growth is tolerable?

**P17.6** A fab's die cost is 40 percent amortisation at full load. Estimate
the die-cost increase at 70 percent utilisation (amortisation is fixed;
other costs scale with output).

**P17.7** *(graduate)* Show that for the negative binomial,
$Y\to e^{-AD_0}$ as $\alpha\to\infty$, and compute the die area at which the
two models differ by 10 points for $D_0=0.1$, $\alpha=3$.

**P17.8** *(graduate)* A monolithic 4 cm2 design is split into $k$ equal
chiplets. Ignoring packaging cost, show silicon efficiency scales as
$e^{-AD_0/k}$ and find the $k$ beyond which the next split buys less than 5
points at $D_0=0.15$.

### Answers

**P17.1** $10^{9}/2300=4.35\times10^{5}=2^{18.73}$: $t=1971+2\times18.73
=2008$. For $10^{11}$ by 2010: $2^{(39)/T_d}=4.35\times10^{7}$ gives
$T_d=39/25.4=1.54$ years: the cadence never ran that fast for long, which
correctly dates $10^{11}$-class chips to the 2020s and to chiplet assembly
rather than monoliths.

**P17.2** Halving needs $V^{-0.3}$ down 2x: $V\times2^{1/0.3}=10^{7}\times
10.1=1.0\times10^{8}$. For $b=0.15$: $2^{1/0.15}=101$: $10^{9}$. Halving the
learning exponent squares the required volume: the whole difference between a
scaling business and a commodity one.

**P17.3** Speed $\times\kappa$ per node: need 4x $=1.4^{n}$, $n=\ln4/\ln1.4
=4.1$: about four nodes (and the figure's plateau is the reminder that this
arithmetic stopped being available: 12 GHz never shipped). Constant-voltage:
power density $\times1.4^{3}=2.74$ per node, $\times56$ over four nodes:
5.6 kW/cm2, an arc-lamp: precisely why constant-voltage scaling was
abandoned in the early 1990s.

**P17.4** $A=6$ cm2. Poisson $Y=e^{-0.48}=0.62$. NB:
$(1+0.24)^{-2}=0.65$. Gross: $\pi\times225/6-\pi\times30/\sqrt{12}
=117.8-27.2=90$ dies; good $\approx56$ to 58.

**P17.5** Break-even growth $=2.0$ (100 percent). At 1.6x density: 60
percent. Real growth of 25 to 30 percent is far under both, so scaling still
pays *at the wafer*: the sliver in the figure is about total node cost
including design and masks, which the problem's ratio deliberately excludes:
worth saying in any answer.

**P17.6** Output falls to 0.7; amortisation per die $\times1/0.7=1.43$.
Die cost $=0.4\times1.43+0.6\times1.0=1.171$: **17 percent dearer** from a 30
percent demand dip, before any pricing response: the operating-leverage cliff
that makes semiconductor downturns so violent.

**P17.7** $(1+x/\alpha)^{-\alpha}=e^{-\alpha\ln(1+x/\alpha)}\to e^{-x}$ since
$\alpha\ln(1+x/\alpha)\to x$. Difference of 10 points: solve
$(1+0.1A/3)^{-3}-e^{-0.1A}=0.10$: at $A=20$ cm2: NB $=(1.667)^{-3}=0.216$,
Poisson $=0.135$: 8 points; at $A=25$: $0.171$ vs $0.082$: 9 points; at
$A=28$: $0.152$ vs $0.061$: 9.1... the gap peaks near 9 points around
$A\approx26$ cm2 and never quite reaches 10 at these parameters: the honest
answer is "no such area; maximum gap about 9 points near 26 cm2", and
noticing that a posed threshold is unreachable is part of the exercise.

**P17.8** Each chiplet has area $A/k$, yields $e^{-AD_0/k}$, and good silicon
fraction equals per-chiplet yield. Gain from $k\to k+1$:
$e^{-AD_0/(k+1)}-e^{-AD_0/k}$. With $AD_0=0.6$: $k=1\to2$: $e^{-0.3}-e^{-0.6}
=0.192$; $2\to3$: $e^{-0.2}-e^{-0.3}=0.078$; $3\to4$: $e^{-0.15}-e^{-0.2}
=0.042$: below 5 points beyond $k=3$. Three-way splits capture most of the
statistical benefit, and beyond that the packaging tax (module 54) owns the
decision.

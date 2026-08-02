# Module 17 Comprehensive Exam

<!-- covers: 17.1, 17.2, 17.3 -->

Closed book apart from the lesson 7 data book and Module C constants.
Problems marked (G) are graduate tier. The exam is deliberately cumulative:
several items require module 18's transport results, exactly as a qualifying
exam would.

## Section A: scaling and economics

**X17.1** A fab's flagship die is 3.2 cm2 at $D_0=0.11\ {\rm cm^{-2}}$,
$\alpha=3$. The next node offers $\kappa=1.35$ area shrink of the same
design with $D_0=0.25$ at ramp and 0.09 mature. Compute yields for all
three cases and the ramp-versus-mature good-die swing on the new node.

**X17.2** Cost per transistor fell $10^{8}$-fold over 52 years. Show this is
consistent with density $2^{26}$ and a net 2.6x total real wafer-cost
growth, and state the implied annualised cost decline.

**X17.3** Using the energy identity $E=\tfrac{1}{2}CV^{2}$, how much
switching energy per logic event does a 0.9 V, 80 aF node spend, and how
many events per second does 1 W of dynamic power support at activity 0.1?

**X17.4** Dennard delivered $P/A$ constant; the post-Dennard reality is
$P/A\propto\kappa$. Across four generations at $\kappa=1.4$, what cooling
improvement (in W/cm2 capability) must the package roadmap deliver to hold
junction temperature, and which module of this course owns that problem?

**X17.5** A 300 mm wafer costs 2.4 units processed; dies are 1.1 cm2;
$D_0=0.12$, Poisson. Compute cost per good die. A competitor runs the same
design on a trailing node: dies 1.9 cm2, wafer cost 1.0, $D_0=0.05$. Who
wins on silicon cost, and what non-cost factor could still decide sourcing?

## Section B: silicon's system

**X17.6** From the leakage scaling $J\propto n_i^{2}$, compute the
temperature at which silicon's diffusion leakage equals germanium's at
300 K, and the margin this gives an automotive part rated to 150 C.

**X17.7** A candidate channel material offers $2\times$ silicon's mobility
with $D_{\rm it}=3\times10^{12}\ {\rm cm^{-2}eV^{-1}}$ on its best
dielectric (1 nm EOT). Compute its subthreshold swing and decide whether
the mobility survives the system test at $V_{dd}=0.7$ V, 5 decades on/off.

**X17.8** The purity ladder wins 9 orders of magnitude. Using module 18's
Nordheim slope argument ($d\rho/dx\to C$ at small $x$, $C\approx1200\
{\rm n\Omega\,m}$ scale), estimate the resistivity penalty of stopping the
ladder two decades early ($x\approx10^{-7}$) and say why the *real* reason
for the last two decades is not resistivity. 

**X17.9** Silicon's fracture strength allows 775 µm thickness at 300 mm.
If wafer self-weight stress scales as $d^{2}/t$, what thickness would a
hypothetical 450 mm wafer need at equal stress, and what does that do to
the per-wafer silicon mass and cost?

## Section C: the compound estate

**X17.10** Find the In$_x$Ga$_{1-x}$As composition with a 0.95 eV gap
($b=0.477$) and the misfit it would carry on InP; from lesson 3's critical
thickness curve, is a coherent 200 nm absorber plausible?

**X17.11** A 405 nm laser diode: which nitride composition (use lesson 3's
InGaN bowing) and what facet reflectivity does the bare crystal supply
($n=2.5$)?

**X17.12** An 850 nm VCSEL-class emitter needs $\eta_{\rm IQE}\ge95$
percent with $\tau_r=1.2$ ns. Compute the allowed nonradiative rate and
defect density ($\sigma v_{th}=10^{-8}\ {\rm cm^{3}/s}$), and compare with
GaN LED tolerances to explain why lasers, not LEDs, demanded low-defect
substrates.

**X17.13** (G) Combine the Johnson product and lesson 5's $f_T=v/2\pi L$:
for GaN with $\mathcal{E}_c=3.3$ MV/cm and $v_{\rm sat}=2.5\times10^{7}$
cm/s, what maximum voltage can a device sustain at $f_T=100$ GHz, and what
gate length does that imply?

**X17.14** (G) Synthesis. A national programme proposes replacing all
silicon power electronics below 200 V with GaAs "to reuse LED fab
capacity". Deliver the four-line audit: leakage class, $R_{\rm on}$ figure
of merit vs silicon (use the data book), thermal path, and the economics
test: with a verdict.

## Answers

**X17.1** Current: $(1+0.11\times3.2/3)^{-3}=(1.117)^{-3}=0.717$.
New die area $3.2/1.35^{2}=1.756$ cm2. Ramp:
$(1+0.25\times1.756/3)^{-3}=(1.146)^{-3}=0.664$. Mature:
$(1+0.09\times1.756/3)^{-3}=(1.0527)^{-3}=0.857$. Good-die swing
ramp-to-mature: $0.857/0.664=1.29$: 29 percent more sellable dies with no
design change: the yield-learning dividend that funds every ramp, and why
early-adopter pricing exists.

**X17.2** Cost per transistor ratio
$=\dfrac{C_{\rm wafer}\ \text{growth}}{\text{density growth}}
=\dfrac{2.6}{2^{26}}=\dfrac{2.6}{6.7\times10^{7}}=3.9\times10^{-8}$:
the $10^{8}$ claim to within a factor of 2.6 (the wafer growth itself).
Annualised: $10^{-8}$ over 52 years is

$$
r=1-10^{-8/52}=1-10^{-0.1538}=1-0.702=29.8\ \text{percent per year}
$$

a thirty-percent annual deflation sustained for half a century: the number
that re-priced civilisation's information handling, and the benchmark
every "next platform" pitch is silently measured against.

**X17.3** $E=\tfrac{1}{2}\times8\times10^{-17}\times0.81=3.24\times10^{-17}$
J $=32$ aJ. Events: $1/(3.24\times10^{-17})\times$... with activity folded
in, supported event rate $=P/E=3.1\times10^{16}$ switched-node events per
second; at $a=0.1$ that clocks $3.1\times10^{17}$ node-cycles: consistent
with $10^{8}$-node blocks at a few GHz: the identity that turns a power
budget into an architecture budget.

**X17.4** Four generations: $1.4^{4}=3.8$x the areal power at constant
architecture: the package must move from, say, 50 to about 190 W/cm2
capability to stand still. Module 54 (with module 35's interface physics)
owns it: and the roadmap answer in practice was partly thermal (vapour
chambers, TIM engineering) and mostly architectural surrender: the dark
silicon of lesson 1: the exam's reminder that when materials cannot, the
system design must.

**X17.5** Leader: gross $=\pi\times225/1.1-\pi\times30/\sqrt{2.2}
=642.5-63.5=579$; yield $e^{-0.132}=0.876$: 507 good: cost
$2.4/507=4.73\times10^{-3}$. Trailing: gross
$=\pi\times225/1.9-\pi\times30/\sqrt{3.8}=372.0-48.3=324$; yield
$e^{-0.095}=0.909$: 295 good: cost $3.39\times10^{-3}$: **the trailing node
wins by 28 percent** on silicon. Deciders beyond cost: power per function
(the newer node's energy identity) and supply security: which is why both
sourcing answers coexist and why "old" nodes never die: lesson 1's
economics, examined.

**X17.6** Need $n_i^{\rm Si}(T)=2.4\times10^{13}$: ratio 2400 over 300 K:

$$
\ln 2400=7.78=\frac{E_g}{2k_B}\left(\frac{1}{300}-\frac{1}{T}\right)
\Rightarrow\frac{1}{300}-\frac{1}{T}=1.197\times10^{-3}
$$

$T=468$ K $=195$ C. Silicon at its 150 C automotive limit still leaks
*less than room-temperature germanium*: a 45-degree engineering margin
purchased entirely by 0.46 eV of gap: the cleanest single number in the
silicon-versus-germanium verdict.

**X17.7** $C_{\rm it}$ at $3\times10^{12}$: scaling lesson 2's example,
$C_{\rm it}=7.7\times10^{-3}$ F/m2 against $C_{\rm ox}=3.45\times10^{-2}$:
$S=60(1+0.223)=73$ mV/dec. Five decades: 0.37 V of the 0.7 V supply:
leaving 0.33 V of overdrive against silicon's 0.40 V ($S=60.4$): drive
current scales roughly with overdrive (velocity-saturated): the 2x mobility
must first repay an 18 percent overdrive deficit: net advantage survives
but nearly halves: and at $5\times10^{12}$ it would not. The system test is
a spreadsheet, and this row of it decides channel-material programmes.

**X17.8** At $x=10^{-7}$: $\Delta\rho\approx Cx=1200\times10^{-7}
=1.2\times10^{-4}\ {\rm n\Omega\,m}$: utterly negligible against copper's
16.8. The last two decades of the ladder are not about resistivity but
about module 22's deep-level lifetime killers (transition metals at
$10^{11}\ {\rm cm^{-3}}$ destroying carrier lifetime) and doping control:
the ladder's summit is electronic, not ohmic: a favourite qualifier trap,
here defused.

**X17.9** Equal stress: $t\propto d^{2}$:
$t=775\times(450/300)^{2}=1744\ \mu$m: 2.25x thickness on 2.25x area:
5.06x the silicon mass per wafer against 2.25x the dies: per-die silicon
*rises* 2.25x: one more entry on 450 mm's cost ledger (with lesson 1's
tooling economics the larger one): scaling laws can run backwards.

**X17.10** $0.95=0.35x+1.42(1-x)-0.477x(1-x)$:
$0.477x^{2}-1.547x+0.47=0$: $x=(1.547-\sqrt{2.393-0.897})/0.954
=(1.547-1.223)/0.954=0.340$. Lattice: $a=0.34(6.058)+0.66(5.653)=5.791$:
misfit to InP $(5.869-5.791)/5.869=1.3$ percent: lesson 3's curve gives
$h_c\sim5$ nm: a coherent 200 nm absorber is **not** plausible:
the real 0.95 eV detector uses the lattice-matched quaternary (InGaAsP) or
metamorphic buffers: the estate map's discipline, enforced by an exam.

**X17.11** $1240/405=3.06$ eV: $3.06=3.4-2.7x+1.4x^{2}$ (from the bowing
form): $1.4x^{2}-2.7x+0.34=0$: $x=(2.7-\sqrt{7.29-1.904})/2.8
=(2.7-2.321)/2.8=0.135$: about 13 percent indium: the violet laser's
recipe. Facets: $R=((2.5-1)/(2.5+1))^{2}=(1.5/3.5)^{2}=0.184$: workable,
and lower than GaAs's 0.32: nitride lasers lean harder on coatings: two
lessons' equations, one device.

**X17.12** $\tau_{nr}\ge\tau_r\times0.95/0.05=22.8$ ns:
$N_t\le1/(10^{-8}\times2.28\times10^{-8})=4.4\times10^{15}\ {\rm cm^{-3}}$
... via $1/\tau_{nr}=\sigma v_{th}N_t$: $N_t=1/(10^{-8}\times2.28\times
10^{-8}$ s$)$: $N_t=4.4\times10^{15}\ {\rm cm^{-3}}$: an order tighter than
the LED tolerance of lesson 3, and lasers additionally *multiply* defect
damage by photon recycling through the cavity and by facet-degradation
feedback: hence native GaAs/InP substrates for every laser while LEDs
shipped on sapphire: one branching ratio, two industries' substrate bills.

**X17.13** Johnson: $V_{\max}f_T=\mathcal{E}_cv_{\rm sat}/2\pi
=3.3\times10^{6}\times2.5\times10^{7}\ /2\pi\ {\rm V\,Hz\,(cm\ units)}
=1.31\times10^{13}$ V·Hz. At $f_T=10^{11}$:
$V_{\max}=131$ V. Gate length: $L=v/2\pi f_T=2.5\times10^{5}/(6.28\times
10^{11})=0.40\ \mu$m... in metres: $L=4.0\times10^{-7}$ m $=400$ nm:
a manufacturable geometry sustaining 131 V at 100 GHz: numbers silicon
cannot approach at any $L$: the lollipop's 90x, spent as a design point.

**X17.14** (1) Leakage: GaAs $n_i=2.1\times10^{6}$: superb: passes. (2)
FoM $\mu\varepsilon\mathcal{E}_c^{3}$: GaAs $8500\times12.9\times0.064
=7.0\times10^{3}$ vs Si $1350\times11.7\times0.027=4.3\times10^{2}$: 16x
better *in the drift region*: passes on paper. (3) Thermal: 55 vs 150
W/mK, and no SiC-substrate trick at LED-fab economics: a 3x worse heat
path erases much of (2) at power density: marginal. (4) Economics: 200 V
silicon is super-junction and trench product on 300 mm at commodity cost:
lesson 2's system test: GaAs on 150 mm cannot reach the multiple, and LED
fabs lack the power-device process vocabulary (thick epi, backside
process). Verdict: fails: and the audit names the *right* successor
already shipping in that voltage class: GaN-on-silicon (lesson 3's
treaty), which passes (2) at 900x, (3) via thin buffers on a silicon heat
path, and (4) by riding 200-300 mm silicon fabs. The exam's last word is
the module's first: materials win as systems.

## Oral examination prompts

Six viva-style prompts with model answers in brief, for self-testing the
module's judgement content rather than its arithmetic.

**O1. "Why did the transistor get cheap when the aircraft did not?"**
Model: batch processing makes wafer cost independent of device count, so
density gains divide a fixed cost; aircraft are assembled serially, so
learning ($b\approx0.2$) is their only engine while electronics compounds
learning with shrink ($b\approx0.4$ observed). One structural property of
the manufacturing, not superior cleverness.

**O2. "Defend the claim that a wafer's oxygen is a feature."**
Model: interstitial oxygen hardens against slip and supplies internal
gettering; the specification is a window, not a maximum; float zone's purer
material trades those away and serves different products. Purity is a
budget against failure modes, not a virtue.

**O3. "What exactly ended Dennard scaling: cite the two floors."**
Model: the 60 mV/decade subthreshold slope (Boltzmann statistics, so
$V_T$, hence $V_{dd}$, stopped scaling) and gate-oxide direct tunnelling
near 1.2 nm. Both are materials-physics limits, and both have named escape
programmes (steep-slope devices; high-k) with their own modules.

**O4. "Why do LEDs tolerate a million times more dislocations than
lasers?"**
Model: efficiency is a clock race; a nanosecond radiative lifetime forgives
defect densities that a device recycling photons through a cavity, with
facet feedback and threshold sensitivity, cannot. Same material physics,
different device exposure: substrate bills follow the exposure.

**O5. "A colleague says 'GaN will replace silicon'. Correct them
precisely."**
Model: GaN replaces silicon *where the Johnson and critical-field limits
bind*: RF power and fast power conversion: and cannot contest logic, memory
or analogue volume, where the system test (oxide interface, substrate
ladder, cadence) still rules. Partition, not succession, is the stable
outcome, and GaN-on-silicon is the treaty's text.

**O6. "Which single number from this module would you carry into a
due-diligence meeting?"**
Model answers vary; strong choices: 60 mV/decade (the wall every switch
claim must address), $e^{-AD_0}$ (the yield exponential behind every die
size claim), or 30 percent per year (the deflation any rival platform must
outrun). Full credit for any, provided the candidate states what claim the
number audits: numbers are carried for their veto power.

## Result interpretation

Scoring 10 of 14 with full arithmetic marks a pass at undergraduate level;
the (G) items and the audit questions X17.5, X17.8, X17.14 test the
graduate skill this module actually exists to teach: pricing a physical
claim before believing it. Wrong-but-audited beats right-but-recited
throughout this course.

A study note on how this exam was built, which is itself course content:
each item was written by taking one boxed result and asking what decision
it vetoes. That construction is reversible, and reversing it is the best
revision technique this course knows: for every boxed equation in a module,
write the one-sentence business or design claim it can kill. A boxed result
with no veto attached has not been learned yet; an exam question is what a
veto looks like when dressed formally. Applied to this module: the yield
exponential vetoes die-size promises, the leakage exponential vetoes
temperature-range promises, the subthreshold bound vetoes switch-energy
promises, the estate map vetoes wavelength promises, and the system test
vetoes every "drop-in replacement" promise on one page. The remaining
fifty-nine modules of the depth programme each close with the same
challenge, and by module 57 the habit, not any table, is the qualification
this course confers.

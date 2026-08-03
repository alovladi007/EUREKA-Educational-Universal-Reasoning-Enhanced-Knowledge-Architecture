# Module 21 Supplement: Derivations, the Data Book and the Veto List

<!-- covers: 21.1, 21.2, 21.3, 21.4 -->

The working lessons borrowed results; this supplement proves them, then
compiles the numbers a practitioner actually reaches for, states the
audit rules for consuming defect data, and closes with the veto list and
revision map. Every derivation runs from stated premise to stated
result; named skips are the only skips.

**Level.** Graduate throughout; sections 5 to 7 serve all levels as
reference.

## 1. Equilibrium defect concentration from free energy

Premise: $n$ indistinguishable vacancies distributed over $N$ sites,
each costing formation free energy $g_f = E_f - TS_f^{vib}$ (vibrational
entropy in $g_f$; configurational entropy counted explicitly). The
mixing entropy is

$$
S_{mix} = k_B\ln\binom{N}{n}
\approx k_B\left[N\ln\frac{N}{N-n} + n\ln\frac{N-n}{n}\right]
$$

by Stirling. Minimize $G = ng_f - TS_{mix}$:

$$
\frac{\partial G}{\partial n} = g_f + k_BT\ln\frac{n}{N-n} = 0
\;\Longrightarrow\;
\frac{n}{N} \approx e^{S_f^{vib}/k_B}\,e^{-E_f/k_BT},
$$

lesson 1's law, with the prefactor now identified as vibrational: the
lattice around a vacancy softens, $S_f^{vib} \sim (3{-}6)k_B$, supplying
the order-of-magnitude headroom between naive and measured
concentrations. The same minimization run for two coexisting species
plus the recombination reaction yields lesson 2's mass action,
$C_VC_I = C_V^{eq}C_I^{eq}$, as the condition that the combined free
energy is stationary against converting a V-I pair into perfect lattice.

## 2. The critical nucleus, twice

**Route one (lesson 4's calculus):** maximize
$\Delta G(r) = -\frac{4}{3}\pi r^3\,\Delta g_v + 4\pi r^2\sigma$ with
$\Delta g_v = k_BT\ln S/\Omega$:

$$
r^* = \frac{2\sigma\Omega}{k_BT\ln S},
\qquad
\Delta G^* = \frac{16\pi\sigma^3\Omega^2}{3(k_BT\ln S)^2}
= \frac{4}{3}\pi r^{*2}\sigma.
$$

**Route two (Gibbs-Thomson, the physical reading):** a curved cavity
wall of radius $r$ raises the adjacent equilibrium concentration to

$$
C^{eq}(r) = C^{eq}_\infty\exp\!\left(\frac{2\sigma\Omega}{r\,k_BT}\right);
$$

a cluster neither grows nor shrinks when the matrix concentration
equals its wall value, $S = e^{2\sigma\Omega/r^*k_BT}$ — solving for
$r^*$ reproduces route one. The identity of the two routes is the
useful lesson: the critical radius *is* the size whose curvature-raised
solubility matches the actual supersaturation, which is also why
ripening (lesson 4 section 4) follows immediately — any distribution of
sizes straddling $r^*$ has its small members below-critical and
dissolving.

## 3. The Zeldovich sketch and the rate's anatomy

The nucleation rate quoted in lesson 4,

$$
J = Z\,\beta^*\,C_1\exp\!\left(-\frac{\Delta G^*}{k_BT}\right),
$$

carries three prefactors the working lesson compressed into $J_0$: the
monomer concentration $C_1$, the attachment rate $\beta^*$ at the
critical size (diffusion-limited: $4\pi r^{*}DC$), and the **Zeldovich
factor** $Z \sim 10^{-2}$–$10^{-1}$ accounting for clusters at the
barrier top random-walking back down. Skip named: deriving $Z$ from the
curvature of $\Delta G$ at its maximum (standard but bulky). What
survives compression is the sensitivity ordering — errors in $\sigma$
enter the exponent *cubed*, errors in any prefactor enter linearly —
which is why lesson 4's advice was to trust the logarithms and
calibrate the absolute rates.

### Worked example 3.1 — how wrong can sigma afford to be?

A model fits void nucleation with $\sigma = 0.95$ J/m². How much would
a 10% error in $\sigma$ shift the predicted nucleation temperature?
The burst fires where $\Delta G^*/k_BT \approx 40$; since
$\Delta G^* \propto \sigma^3/(\ln S)^2$, holding the threshold constant
requires $(\ln S)^2$ to absorb a 33% change: $\ln S$ shifts by ~15%.
With $S(T)$ rising roughly one decade per 100 K in the relevant window
(lesson 2's figure), a 15% change in $\ln S$ ($\sim1.6$ natural-log
units at $S\sim10^{4}$... i.e. ~0.7 decades) moves the burst
temperature by roughly 50–70 K. A 10% material-parameter error is a
50 K process error — the quantitative reason hot-zone design codes are
calibrated against grown crystals rather than trusted ab initio, and a
worked instance of the course's error-propagation habit.

## 4. Growth law and the conservation chain

Diffusion-limited growth of a sphere in a supersaturated matrix
(quasi-static approximation, skip named: the full moving-boundary
problem) gives the flux $4\pi rDC$ onto the cluster and hence

$$
\frac{dr}{dt} = \frac{D\,\Omega\,(C - C^{eq})}{r}
\;\Longrightarrow\;
r(t) = \sqrt{2D\Omega(C-C^{eq})\,t},
$$

lesson 4's and lesson 6's square root. Chain with conservation
$N\cdot(4\pi r_f^3/3\Omega) = C_{excess}$ to get the
size-density trade $r_f \propto N^{-1/3}$, and with the burst's
self-termination (nucleation stops when growth's consumption rate
overtakes supersaturation build-up) to get the cooling-rate scaling:
faster cooling → deeper overshoot → more nuclei — the qualitative chain
behind the void-trade figure, quantitative only via rate-equation
simulation (veto list).

### Worked example 4.1 — a complete mini-chain

Predict the void diameter for a crystal cooling at 1.5 K/min with a
measured density of $8\times10^{6}$ cm⁻³ and excess
$C_V = 5\times10^{13}$ cm⁻³. Vacancies per void:
$6.25\times10^{6}$; volume $= 6.25\times10^{6}\times2\times10^{-23} =
1.25\times10^{-16}$ cm³;

$$
d = \left(\frac{6V}{\pi}\right)^{1/3}
= \left(\frac{7.5\times10^{-16}}{3.14}\right)^{1/3}
\approx 6.2\times10^{-6}\ {\rm cm} = 62\ {\rm nm}.
$$

One conservation law converts two measurables into a third — and if the
tomograph then reports 100 nm voids, the discrepancy is itself data:
either the density instrument undercounts small voids (size floor —
data-book row) or part of the vacancy budget escaped to another sink.
The chain is short enough to audit, which is its entire virtue.

## 5. The data book

Working numbers for this module. Representative values for orientation
and problem-setting; design commitments re-derive from calibrated
sources at operating conditions — the standing rule.

**Table 1 — native defects and key species**

| quantity | value | note |
|---|---|---|
| $E_f$ vacancy / interstitial | ~3.6–4.1 / ~4.0–4.7 eV | fitted ranges, model-dependent |
| $E_m$ vacancy / interstitial | ~0.4–1.0 / ~0.5–0.9 eV | ditto |
| $C^{eq}$ at melt (either) | $10^{13}$–$10^{15}$ cm⁻³ | ppb-level |
| $(v/G)_{crit}$ | $\approx1.3\times10^{-3}$ cm² min⁻¹ K⁻¹ | hot-zone-calibrated |
| void nucleation window | ~1050–1150 °C | vacancy-rich CZ |
| O-precipitate nucleation | ~650–750 °C | the recipe's low step |
| $D_O$ | $0.13\,e^{-2.53{\rm eV}/k_BT}$ cm²/s | interstitial oxygen |
| $[{\rm O}_i]$ spec window | (5.5–7.5)$\times10^{17}$ cm⁻³ | product-dependent |
| thermal-donor window | 350–500 °C | kill at ~650 °C |

**Table 2 — aggregates and assays**

| object | typical size | typical density | standard assay |
|---|---|---|---|
| void / COP | 50–200 nm | $10^{5}$–$10^{7}$ cm⁻³ | scanner (surface), IR tomography (bulk) |
| A-swirl loop | 1–10 µm | $10^{3}$–$10^{5}$ cm⁻³ | preferential etch |
| B-swirl cluster | <1 µm | higher | etch |
| OSF | 1–10 µm | test-dependent | oxidation + Wright etch |
| O precipitate (grown) | 30–100 nm | $10^{8}$–$10^{10}$ cm⁻³ | IR scattering, etch, cleave |
| denuded zone | 5–20 µm | — | cleave + etch cross-section |

**Table 3 — the assay caveats (lesson 1's rule, tabulated)**

| trap | mechanism |
|---|---|
| scanner vs tomograph 50× gaps | areal-vs-volume, size floors (A21.24) |
| COP counts fall as true density rises | size trade drops voids below threshold (A21.21) |
| "defect-free" claims | technique's floor, depth probed, area sampled |
| $[{\rm O}_i]$ conversion factors | IR calibration standards differ (historical ASTM shifts) |
| density without thermal history | census self-edits by ripening (lesson 4) |

## 6. Critical reading: consuming defect data

Four rules, restated for this module's material. (1) *Name the assay*:
every density travels with instrument, size floor, and sampled volume,
or it is a rumour with units. (2) *Name the thermal history*: the
population is a trajectory snapshot (lessons 1, 4); "as-grown" versus
"post-simulation" numbers differ legitimately. (3) *Distinguish
species-level from aggregate-level claims*: $v/G$ statements concern
excesses; device harm concerns aggregates; the mapping between them
runs through cooling history and is where most vendor-customer
misunderstandings live. (4) *Respect fitted constants*: formation
energies, surface energies and the criterion's critical value are
model-calibrated to factors that matter; propagate their uncertainty
(worked example 3.1) before promising a nucleation temperature to a
review board.

## 7. Revision map

(1) Point defects are thermodynamically compulsory; their room-
temperature census is frozen history; aggregates, not points, kill
devices, at Poisson-priced yield. (2) Two species with Arrhenius
mobilities annihilate by mass action; cooling opens supersaturation —
stored free energy that must be spent somewhere. (3) The $v/G$
criterion picks the surviving species; its radial profile draws rings;
holding it critical grows perfect silicon; two stacked nonlinearities
make the flip sharp. (4) Classical nucleation: barrier
$\propto\sigma^3/(\ln S)^2$, threshold burst, conservation trades size
against density, ripening edits the census forever after.
(5) Voids are self-limiting cavities; loops are ever-cheaper
2-D landfills, hence micrometre killers; the OSF ring is the critical
contour developed by oxidation. (6) Oxygen — supersaturated by birth —
precipitates on schedule; located right, its precipitates getter
metals: high-low-high or RTA vacancy engineering writes the geometry.
The through-line: *defect engineering is the scheduling of where
supersaturation gets spent* — and every lesson was one venue of that
spending.

## 8. Veto list

Deliberately outside this module: dislocation *mechanics* (slip,
thermal-stress modeling — module 22's mechanical territory); dopant
diffusion mechanisms and their defect coupling in device processing
(module 24, which builds directly on lesson 2's charge-state section);
metallic-impurity device physics and lifetime spectroscopy (module 23);
crystal-growth hydrodynamics and hot-zone design (module 28); epitaxy
as a defect countermeasure (module 29); irradiation-produced defects
and their annealing spectra; full rate-equation simulation of
nucleation bursts (industrial codes; only their inputs and logic are
taught here); and ab initio defect energetics beyond quoting fitted
ranges. Each is a named neighbour, not an omission.

## 9. Problems

**P21.37** Carry the Stirling minimization through for the case where
each vacancy has $g$ internal configurations (e.g. Jahn-Teller
distortions), and show the result multiplies the prefactor by $g$.

**P21.38** Derive the Gibbs-Thomson expression from equating the work
of transferring one atom from a flat reservoir to a sphere of radius
$r$ with the surface-area change it causes.

**P21.39** Using Table 1's $D_O$, tabulate the oxygen diffusion length
$\sqrt{4Dt}$ for 1 h at 700, 1000 and 1250 °C, and annotate each with
the recipe step it explains.

**P21.40** A review claims a competitor's "defect-free" wafer. Using
section 6's four rules, draft the four questions that would make the
claim auditable.

### Answers

**A21.37** The number of microstates gains a factor $g^n$:
$S_{mix} \to S_{mix} + nk_B\ln g$, so the minimization's logarithm
acquires $-k_BT\ln g$, i.e. $n/N = g\,e^{S_f/k_B}e^{-E_f/k_BT}$ —
internal degeneracy is bookkept as prefactor, indistinguishable from
vibrational entropy in any Arrhenius fit (one more reason fitted
prefactors resist interpretation).

**A21.38** Moving one atom (volume $\Omega$) onto the sphere changes
area by $dA = d(4\pi r^2) = (2\Omega/r)\cdot(4\pi r^2)/(4\pi r^2)$...
cleanly: $dV = \Omega = 4\pi r^2dr$ → $dr = \Omega/4\pi r^2$;
$dA = 8\pi r\,dr = 2\Omega/r$. Work $= \sigma\,dA = 2\sigma\Omega/r$.
Equating to the chemical-potential difference $k_BT\ln(C^{eq}(r)/
C^{eq}_\infty)$ gives $C^{eq}(r) = C^{eq}_\infty e^{2\sigma\Omega/rk_BT}$.

**A21.39** $D_O$: at 973 K, $1.0\times10^{-14}$ cm²/s → 0.12 µm — the
nucleation step barely moves oxygen: it only clusters locally. At
1273 K, $1.3\times10^{-11}$ → 4.3 µm — the growth step feeds
precipitates over micrometre catchments. At 1523 K,
$5.5\times10^{-10}$ → 28 µm — the high step denudes a device-depth
skin. The recipe *is* this table.

**A21.40** (1) Which assays, with size floors and sampled volume/area,
support "defect-free" — scanner, tomograph, etch, all three? (2) After
which thermal history — as-grown, or post the customer's simulated
flow? (3) Is the claim species-level (near-critical growth) or
aggregate-level (nothing detectable), and over what wafer fraction?
(4) What are the stated uncertainties of the underlying calibrations
(oxygen assay, defect counting), and does the claim survive them? A
"defect-free" that answers all four is a specification; one that
answers none is marketing.

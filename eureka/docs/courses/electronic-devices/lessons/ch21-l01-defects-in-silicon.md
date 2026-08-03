# Imperfect by Law: Point Defects and Why Yield Cares

<!-- covers: 21.1 -->

A silicon wafer is the most nearly perfect large object humanity
manufactures — and thermodynamics *requires* it to be defective. This
module is about the defects that are intrinsic, involving only silicon
atoms and empty sites: they cannot be purified away, only managed by
controlling how the crystal freezes and cools. This first lesson
establishes the two protagonists, proves their existence is compulsory,
and connects their aggregates to the only number the business ultimately
reads: die yield.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate; section 6
problems.

## 1. The compulsory defects

Two native point defects populate every silicon crystal: the **vacancy**
(a missing atom) and the **self-interstitial** (an extra silicon squeezed
between lattice sites). Their existence at finite temperature is not an
accident of processing but a theorem of free energy. Creating a defect
costs formation enthalpy $E_f$, but the many ways of placing it buy
configurational entropy, and minimizing $G = E - TS$ over the defect count
(derived in the supplement) gives an equilibrium fraction

$$
\frac{n}{N} = \exp\!\left(\frac{S_f}{k_B}\right)
\exp\!\left(-\frac{E_f}{k_BT}\right),
$$

with $E_f \approx 3.5$–4.5 eV for both species in silicon. The exponential
does its usual violence to intuition:

![Equilibrium vacancy and self-interstitial concentrations against inverse temperature: parts-per-billion fractions near the melting point, essentially zero at device temperatures.](/courses/electronic-devices/figures/m21-point-defect-equilibrium.svg)

Near the 1685 K melting point the crystal holds of order $10^{13}$–$10^{15}$
defects per cm³ — a part per billion, yet $10^{6}$ per future die. At
room temperature the equilibrium value is one defect per *universe* of
silicon; every defect a finished wafer contains is therefore a
**relic of its thermal history**, not a property of its present state.
That single sentence reorganizes the whole module: crystal-defect
engineering is the control of a cooling trajectory, and lessons 3 to 6
are the management of that trajectory's consequences.

## 2. Why anyone pays for this physics

A vacancy is a nanometre-scale nothing. It earns a module because of what
happens when $10^{13}$ of them, frozen into supersaturation, condense
during cooldown into **aggregates** — octahedral voids of ~100 nm
(vacancies) or extended dislocation loops (interstitials). Both are
device killers with specific charge sheets:

- A **void** intersecting the polished surface becomes a
  **crystal-originated particle (COP)** — a pit that particle counters
  flag and, far worse, a local thinning that breaks down the gate oxide
  grown over it. Gate-oxide integrity testing, module 12's reliability
  discipline, was historically the assay that *discovered* COPs: a
  failure population that tracked crystal pull rate, not fab
  cleanliness.
- A **dislocation loop** in the active region is a leakage path and a
  precipitation site for metals (lesson 6): junctions built over loops
  leak, retention times collapse, and image-sensor pixels blink.

The economics compound through die area, module 17's Poisson yield
arithmetic returning with crystal-grown defects as the density $D_0$:

$$
Y = e^{-D_0 A}.
$$

![Poisson die yield against killer-defect density for three die areas: the same crystal quality that is invisible on a small die is a tax on a large one.](/courses/electronic-devices/figures/m21-cop-yield.svg)

### Worked example 2.1 — the crystal's share of the yield budget

A logic die of 1.2 cm² tolerates a total killer density of
0.25 cm⁻² for its 74% yield target. Metrology attributes 0.05 cm⁻²
to crystal-originated defects. What yield does the crystal alone cost,
and what does halving it buy?

$$
Y_{\rm crystal} = e^{-0.05\times1.2} = 0.942
\quad\rightarrow\quad
e^{-0.025\times1.2} = 0.970.
$$

The crystal costs 5.8 points of yield; halving its defect density buys
back 2.8 points. On a fab running 50,000 wafer-starts a month at ~200
good-die-per-wafer economics, that fraction of a percent is the entire
price difference between standard and premium substrate material — the
arithmetic that funds every technique in this module.

## 3. The cast, formally

The module's working vocabulary, fixed here once. **V** — the vacancy;
**I** — the self-interstitial; both exist in several charge states, which
couples their populations to doping (a graduate wrinkle flagged in the
supplement's veto list). **Frenkel event** — creation of a V-I pair in
the bulk; **recombination** ($V + I \to 0$) — mutual annihilation,
strongly favoured but rate-limited at low temperature. **COP / void** —
the vacancy aggregate; **A-swirl / B-swirl** — historical names for
interstitial-loop patterns, swirl-shaped because growth striations
modulate them. **OSF** — oxidation-induced stacking fault, lesson 5's
marker defect. **Denuded zone** — the defect-free skin engineered above
a deliberately defective bulk, lesson 6's product. The names carry an
audit warning inherited from module 20: each is *defined by the
measurement that reveals it* (COPs by particle scanners, swirl by
etching, OSFs by oxidation-plus-etch), so densities from different assays
are not directly comparable — a definitional trap this module's data
book returns to.

## 4. The one-line preview of the mechanism

Everything downstream follows a three-act structure worth fixing now.
**Act one (lesson 3):** at the growth interface, the melt hands the
crystal both species; convection with the moving crystal and
back-diffusion against the thermal gradient compete, and the ratio of
pull rate to gradient, $v/G$, decides which species survives the first
centimetre. **Act two (lesson 4):** the survivor, cooling, becomes
supersaturated by orders of magnitude; classical nucleation converts the
supersaturation into a burst of aggregates in a narrow temperature
window. **Act three (lessons 5-6):** the aggregates — voids, loops,
oxygen precipitates — intersect device processing, where they are
detected, avoided, or deliberately weaponized as gettering sinks. One
ratio, one burst, one harvest: the module in nine words.

## 4b. Where this module's physics reappears

A forward routing, so the machinery is recognized when it returns in
other modules' clothes. **Module 22** (mechanical properties) inherits
the dislocation: this module makes loops as defect condensates; that
one moves them under stress, and the slip windows of large-wafer
thermal processing are where the two conversations meet. **Module 23**
(carrier lifetime and deep levels) is this module's electrical
sequel: the metals our gettering captures, the recombination centres
our aggregates decorate — its DLTS and lifetime maps are the
instruments that price this module's failures in nanoseconds of
minority-carrier lifetime. **Module 24** (diffusion) runs on lesson
2's charge-state physics at full throttle: every dopant profile in a
device flow is transported by the very vacancies and interstitials
counted here, and oxidation-enhanced diffusion is lesson 5's
interstitial injection seen from the dopant's point of view.
**Module 28** (crystal growth) owns the hot zone whose $T(z)$ and
melt flow this module treated as given — the supplier side of the
$v/G$ contract. **Module 29** (epitaxy) is the countermeasure
industry: its buried-defect strategy assumes exactly the substrate
populations quantified here. And the *statistical* spine — Poisson
yield, mean-versus-tail, populations amplified through exponentials —
is the same one module 17 built for economics, module 20 used for
magnetic retention, and module 21 has now used for aggregation: by
the third encounter it should read as the course's native dialect.
The routing table's practical use is diagnostic direction-finding: a
defect signature met in any later module can be walked back along
these edges to the lesson that owns its physics, which is how the
capstone's post-mortems will actually be solved.

## 5. Graduate extension: how you measure what you cannot see

No microscope images a vacancy in silicon; the native defects are
inferred, and the inference chain is worth respecting because its error
bars propagate into every model this module uses. Four probes carry the
field. **Metal diffusion:** fast diffusers (Au, Pt, Zn) move by swapping
with native defects (kick-out via I, Frank-Turnbull via V); fitting their
measured profiles yields the product $C_{eq}D$ for each native species —
the classic source of the transport coefficients in lesson 3's models.
**Crystal-growth experiments themselves:** the position of the
void/loop boundary against controlled $v/G$ *is* a measurement of the
ratio of the two species' transport products — the industry's own
production data doubling as its best physics experiment.
**Positron annihilation:** positrons trap in open volume, and their
lifetime counts vacancy-type defects — the only reasonably direct
vacancy census, sensitive from ~$10^{15}$ cm⁻³. **Quenching plus
electrical/optical spectroscopy:** rapid cooling freezes elevated defect
populations whose deep levels DLTS (module 23's tool) then counts —
with the permanent caveat that the quench itself perturbs what it
preserves. The methodological lesson mirrors module 19's ellipsometry
rule: the native-defect parameters in any simulator are *fitted
constructs*, model-dependent to factors of a few, and a defect
engineer's confidence should follow the quantity (robust: $v/G$
criticality, void densities; soft: individual $E_f$, $D_V$ below
1000 °C).

## 6. Problems

**P21.1** Evaluate the equilibrium vacancy fraction at 1685 K, 1300 K
and 300 K for $E_f = 4.0$ eV, $S_f = 5k_B$. Express the 300 K result as
"one vacancy per N cm³ of silicon" and comment.

**P21.2** A wafer's COP count doubles while the fab's particle adders
stay flat. Using section 2's charge sheets, name the measurement that
distinguishes crystal COPs from fab particles, and the crystal-growth
parameter most likely to have drifted (anticipating lesson 3).

**P21.3** For the Poisson model, show that the yield cost of a defect
density is $\ln(1/Y) = D_0A$, additive across independent defect
sources — and explain why this additivity is exactly what lets a fab
maintain a "defect budget" with line items.

**P21.4** A memory product moves from a 0.6 cm² die to a 1.8 cm² die on
the same substrate quality ($D_0 = 0.1$ cm⁻² crystal-attributed).
Compute the crystal-attributed yield on both, and the substrate-quality
improvement factor needed to keep the old yield on the new die.

**P21.5** Why can gettering (preview: lesson 6) remove metallic
contamination but not voids? Answer in terms of what is mobile at
process temperatures.

**P21.6** The equilibrium argument gives defects at *every* finite
temperature. Reconcile: why is a 300 K wafer's defect content set by
history rather than by the 300 K equilibrium — what kinetic quantity
freezes, and at roughly what temperature scale for $E_m \approx 1$ eV?

### Answers

**A21.1** $n/N = e^{5}e^{-E_f/k_BT}$: at 1685 K,
$e^{5}e^{-27.5} \approx 1.7\times10^{-10}$ ($\sim10^{13}$ cm⁻³); at
1300 K, $e^{5}e^{-35.7} \approx 4.6\times10^{-14}$; at 300 K,
$e^{5}e^{-154.7} \approx 10^{-65}$ — one vacancy per $10^{42}$ cm³, a
volume of silicon far exceeding the planet. Every observed
room-temperature defect is inherited, never equilibrium.

**A21.2** Re-measure the same wafers after an SC1-type clean-and-rescan:
particles wash or move; COPs are pits and persist at fixed coordinates
(spatial correlation across scans is the standard discriminator, plus
COP spatial patterns are radially organized). Drifted parameter: pull
rate (or hot-zone gradient) shifting $v/G$ deeper into the vacancy
regime.

**A21.3** $Y = \prod_i e^{-D_iA} = e^{-A\sum_iD_i}$, so
$\ln(1/Y) = A\sum_iD_i$: each source contributes linearly to the log.
A budget with line items (litho, etch, substrate...) is precisely an
allocation of $\sum D_i$, auditable because independent causes add in
the exponent.

**A21.4** $Y_{0.6} = e^{-0.06} = 94.2\%$; $Y_{1.8} = e^{-0.18} =
83.5\%$. Restoring 94.2% on the big die needs $D_0A = 0.06$:
$D_0 = 0.033$ — a 3× substrate improvement, i.e. die growth taxes the
crystal supplier as heavily as the fab.

**A21.5** Gettering relocates species that diffuse at process
temperatures — interstitial metals cross a wafer in minutes at 1000 °C.
A void is a cavity whose removal requires transporting *silicon* to fill
it against negligible driving force; the vacancy supersaturation that
built it is long gone. Immobile aggregates must be prevented (or kept
from the device layer), never cured.

**A21.6** Equilibration requires defect motion; the diffusion time over
any relevant distance scales as $e^{+E_m/k_BT}$. For $E_m \sim 1$ eV,
below roughly 600–700 K the time to move even nanometres exceeds years:
populations freeze. The wafer is a snapshot of the last temperature at
which its defects could still move — history, kinetically locked.

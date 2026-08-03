# Oxygen in Silicon: the Contaminant That Became the Workforce

<!-- covers: 21.3, 21.4 -->

Every Czochralski crystal carries a passenger: oxygen, dissolved from the
quartz crucible at $10^{17}$–$10^{18}$ cm⁻³ — a thousand times any
intentional dopant. This lesson tracks its career from contaminant to
employee: how it enters, why it precipitates during any device thermal
cycle, and how the industry turned that unavoidable precipitation into
**internal gettering** — a self-cleaning wafer whose defective bulk
protects a defect-free skin. It is the module's redemption arc, and the
place where every previous lesson's machinery gets hired for production
work.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate;
section 6 problems.

## 1. The passenger and its budget

The silica crucible dissolves continuously into the melt
(${\rm SiO_2 + Si \to 2\,SiO}$); most oxygen evaporates as SiO, but the
fraction swept to the interface incorporates as **interstitial oxygen**,
O$_i$ — a single atom bridging two silicon neighbours, electrically
inactive, infrared-active (its 1107 cm⁻¹ absorption is the standard
concentration assay, module 19's spectroscopy earning its keep).
Concentration control is melt hydrodynamics: crucible rotation, argon
flow, and module 28's magnetic fields set $[{\rm O}_i]$ to a *specified*
window — because both too much and too little turn out to be defects.

The reason is solubility:

$$
C_{sol}(T) \approx 9\times10^{22}
\exp\!\left(-\frac{1.52\ {\rm eV}}{k_BT}\right)\ {\rm cm^{-3}},
$$

![Interstitial oxygen solubility against inverse temperature: typical grown-in contents sit at the melting-point solubility, which is supersaturated at every device-processing temperature below it.](/courses/electronic-devices/figures/m21-oxygen-solubility.svg)

Grown-in contents sit near the *melting point's* solubility; at every
processing temperature below it the wafer is supersaturated — lesson 2's
reservoir again, now in an impurity. Every furnace step is therefore
also, whether intended or not, an oxygen-precipitation step.

## 2. Precipitation: nucleation theory hired again

Supersaturated O$_i$ condenses into SiO₂ precipitates, and the entire
lesson-4 apparatus transfers: critical radius and barrier from
$k_BT\ln S$, a nucleation-rate threshold, diffusion-limited growth

$$
r(t) \propto \sqrt{D_{O}\,t},
\qquad D_O = 0.13\,e^{-2.53\ {\rm eV}/k_BT}\ {\rm cm^2/s},
$$

![Precipitate radius against anneal time at two temperatures: the square-root growth law, with temperature entering through the oxygen diffusivity's 2.5 eV activation.](/courses/electronic-devices/figures/m21-precipitate-growth.svg)

with two silicon-specific twists. First, the phase change *ejects
interstitials*: SiO₂ occupies about twice the volume of the silicon it
replaces, and the strain is relieved by emitting Si atoms — coupling
oxygen precipitation into lesson 2's native-defect seesaw (precipitating
wafers are interstitial *sources*, vacancy *sinks*; vacancy-rich
material therefore precipitates oxygen more readily, the linchpin of
section 4's engineering). Second, the supersaturation's threshold
behaviour makes the precipitate density hair-trigger sensitive to the
starting content:

![Precipitate density against initial interstitial-oxygen content: exponential sensitivity, which is why oxygen is specified to a few percent when its absolute accuracy is far coarser.](/courses/electronic-devices/figures/m21-precip-density-vs-oi.svg)

A factor 1.5 in $[{\rm O}_i]$ moves precipitate densities by orders of
magnitude — the numerical reason oxygen specifications are written to
±2–3% and why interlaboratory calibration of the infrared assay (ASTM
conversion-factor history, flagged in the data book) once destabilized
an entire supply chain's paperwork.

### Worked example 2.1 — will it precipitate in my process?

A wafer with $[{\rm O}_i] = 7\times10^{17}$ cm⁻³ sees a device flow
whose longest hot step is 4 h at 1000 °C. Supersaturation there:
$C_{sol}(1273\ {\rm K}) = 9\times10^{22}e^{-1.52/0.1097} =
9\times10^{22}\times9.5\times10^{-7} \approx 8.6\times10^{16}$ cm⁻³, so

$$
S = \frac{7\times10^{17}}{8.6\times10^{16}} \approx 8.
$$

Modest — homogeneous nucleation at $S\sim8$ is negligible (lesson 4's
threshold sits far higher for oxide's interface energy), so *new*
precipitates will not form; but any *pre-existing* nuclei will grow at
$\sqrt{D_Ot}$ with $D_O(1273) \approx 1.3\times10^{-11}$ cm²/s →
$\sqrt{4D_Ot} \approx 0.9$ µm collection radius. Conclusion: this flow
does not create a precipitate population, it *develops* whatever
population the wafer brought — which is exactly why wafer suppliers sell
pre-programmed nucleation (section 4) and why "oxygen behaviour" is
negotiated between fab and vendor as a joint thermal-budget document.

## 3. The verdict on precipitates: location, location

An oxygen precipitate in the device layer is a defect: its interface
states and ejected-interstitial halo (stacking faults, punched-out
dislocations) leak junctions exactly as lesson 5's loops do. The same
precipitate five micrometres down is a *resource*: its strained,
disordered interface binds transition metals with electron-volt-scale
energies, out-competing any site the device layer offers. Iron, nickel,
copper — the fast interstitial diffusers that module 23 will convict of
lifetime murder — diffuse micrometres per minute at process heat
(lesson 1's mobility hierarchy) and thermodynamically prefer the
precipitate's traps. Provide traps below, keep the surface clean, and
contamination drains away from the devices on every hot step:
**internal gettering**, first-order kinetics with the precipitate
population as the sink:

$$
\frac{dC_M}{dt} = -4\pi r N D_M\,C_M
\;\Rightarrow\;
C_M(t) = C_M(0)\,e^{-t/\tau_g},
\quad \tau_g = \frac{1}{4\pi r N D_M}.
$$

![Dissolved metal remaining near the device layer against anneal time for three precipitate densities: first-order capture whose rate constant is the sink strength the wafer vendor engineered.](/courses/electronic-devices/figures/m21-gettering.svg)

### Worked example 3.1 — sizing the pump

Precipitates: $N = 5\times10^{9}$ cm⁻³, $r = 50$ nm. Iron at 1000 °C:
$D_{Fe} \approx 3\times10^{-6}$ cm²/s. Then

$$
\tau_g = \frac{1}{4\pi(5\times10^{-6}\ {\rm cm})(5\times10^{9})(3\times10^{-6})}
\approx 1.1\ {\rm s}.
$$

Seconds. Any iron the process introduces is swept into the bulk sinks
essentially instantly at temperature — the pump is absurdly
oversized, deliberately: it must still work at the *end* of the flow,
when lower temperatures slow $D_M$, and after ripening (lesson 4) has
traded $N$ down for $r$ up. The engineering margin lives in the product
$rN$, and tracking that product through the customer's thermal budget
is the vendor's simulation deliverable.

## 4. The denuded zone: geometry of the truce

The two verdicts of section 3 dictate a geometry: precipitate-free skin
(the **denuded zone**, 5–20 µm — deeper than any junction), heavily
precipitated bulk below. The classical recipe writes it thermally,
**high-low-high**:

1. **High** (~1100 °C, hours): out-diffuse oxygen from the surface —
   the near-surface $[{\rm O}_i]$ falls below future precipitation
   thresholds; simultaneously dissolve grown-in near-surface nuclei.

![Oxygen profile after surface out-diffusion, computed from the complementary error function: the depleted skin cannot precipitate and becomes the denuded zone; the untouched bulk retains its full budget.](/courses/electronic-devices/figures/m21-denuded-zone.svg)

2. **Low** (~650–750 °C, hours): nucleate — deep in the bulk where
   oxygen remains supersaturated, a dense nucleus population forms
   (the threshold physics of lesson 4, operated on purpose).
3. **High** (~1000 °C): grow the nuclei into working sinks.

The modern shortcut replaces step 1's hours with seconds: **rapid
thermal processing** at ~1250 °C installs a *vacancy* profile —
surfaces absorb vacancies during the flash cool, leaving a
vacancy-poor skin over a vacancy-rich bulk — and since vacancies
catalyse oxygen nucleation (section 2's seesaw), the subsequent
standard anneal precipitates only where the vacancies are:

![Frozen-in vacancy profiles for three rapid-thermal-anneal cooling rates: the near-surface dip becomes the denuded zone, and the plateau depth programs where oxygen will precipitate.](/courses/electronic-devices/figures/m21-vacancy-profile-rta.svg)

The RTA recipe (magic denuded zone in the trade) decouples the zone
from oxygen out-diffusion entirely — zone depth set by a *vacancy*
diffusion length, programmable in seconds, robust against the
customer's thermal budget. Conceptually it is this module eating its
own cooking: a deliberately engineered native-defect profile (lessons
1-2) steering an impurity's nucleation (lesson 4) to place aggregates
(lesson 5) where they serve. No cleaner integration test of the
module's physics exists — nor a better illustration of its arc from
defect-as-enemy to defect-as-tool.

## 4b. Auditing a denuded zone: which mechanism built it?

Two recipes, one geometry — and an auditor can tell them apart from the
wafer alone, because each mechanism signs its work. The out-diffusion
zone's depth is chained to the oxygen diffusion length,

$$
z_{DZ} \approx \sqrt{4D_O\,t_{high}},
$$

so its depth, the high step's conditions and the near-surface
$[{\rm O}_i]$ dip (measurable by SIMS or micro-FTIR) must be mutually
consistent — a zone *deeper* than the step's $\sqrt{4D_Ot}$ is
physically impossible by this route. The RTA vacancy zone carries the
opposite signature: near-surface oxygen is *unchanged* (seconds move
oxygen nanometres), and the zone boundary instead tracks the vacancy
profile's plateau edge, set by vacancy transport during the flash —
sharper than any erfc, and tunable by the RTA's cooling rate without
touching zone oxygen at all. The audit consequences are practical.
First, a vendor claiming a 25 µm zone from a 2 h/1100 °C step is
claiming $\sqrt{4D_Ot} \ge 25$ µm — checkable in one line (it fails;
A21.32's arithmetic gives ~15 µm at 4 h). Second, the two zones age
differently under the customer's thermal budget: the out-diffusion
zone is protected by *absence of oxygen* — robust to any subsequent
step; the RTA zone is protected by *absence of catalyst* — robust
unless a subsequent step re-injects vacancies (high-temperature
nitridation famously does) or supplies enough time for uncatalysed
nucleation. A substrate contract that names the mechanism therefore
names the process-compatibility envelope, and one that only names a
depth has not finished specifying the product — the module's
conditions-attached rule, applied to the module's own flagship
product.

## 5. Graduate extension: thermal donors and the oxygen ledger's fine print

Oxygen's ledger holds two more entries that surface as device
anomalies. **Thermal donors**: annealing 350–500 °C (hours) assembles
small O$_i$ clusters that act as *double donors* — resistivity of
lightly doped p-type material drifts, even type-converts, during
back-end steps as innocuous as sinter anneals; a 650 °C "donor-kill"
step dissolving them is a standard tail-end of crystal manufacture, and
their reappearance in a fab flags an unnoticed low-temperature soak.
(**New donors**, a distinct 600–800 °C family tied to early
precipitation, add fine print of their own.) Second entry,
**precipitate strengthening and its inverse**: dissolved O$_i$ pins
dislocations, hardening wafers against thermal-stress slip in fast
ramps — one historical reason CZ displaced float-zone for large
diameters — while heavy precipitation *consumes* that dissolved oxygen
and softens the wafer late in the flow, so slip windows must be
re-checked against end-of-line, not start-of-line, oxygen. Both
entries teach the same graduate posture: $[{\rm O}_i]$ is not a
constant of the wafer but a *state variable* that every thermal step
moves — donors form from it, precipitates drain it, strength rides on
it — and a process transfer between fabs whose thermal budgets differ
is, among everything else, an oxygen-ledger reconciliation exercise.

## 6. Problems

**P21.31** Compute the oxygen supersaturation at 900 °C and 1200 °C
for $[{\rm O}_i] = 8\times10^{17}$ cm⁻³, and explain from lesson 4's
threshold logic why the *nucleation* anneal sits at the low end of
this range and the *growth* anneal at the high end.

**P21.32** Using $D_O$, estimate the out-diffusion depth
$\sqrt{4D_Ot}$ for 4 h at 1100 °C, and compare with the 10 µm denuded
zone the process claims. What does the comparison tell you?

**P21.33** A precipitate population ripens from
($N = 10^{10}$ cm⁻³, $r = 30$ nm) to ($10^{9}$, $r' = ?$) conserving
precipitated volume. Find $r'$ and the change in gettering sink
strength $rN$. Verdict for end-of-line gettering?

**P21.34** A p⁻ wafer (10 Ω·cm) reads 25 Ω·cm after a 450 °C, 8 h
back-end step, then recovers after 650 °C/30 min. Diagnose, name the
species, and state why n-type wafers show the *opposite* resistivity
shift from the same mechanism.

**P21.35** Vacancy-rich (fast-pull) and near-perfect crystals from the
same puller receive identical high-low-high processing. Predict the
qualitative difference in bulk precipitate density and denuded-zone
robustness, using the section-2 seesaw.

**P21.36** Internal gettering fails for aluminum contamination even
though Al diffuses adequately. Propose the mechanism class (one
sentence) and the alternative gettering family used instead.

### Answers

**A21.31** $C_{sol}(1173) = 9\times10^{22}e^{-1.52/0.1011} =
9\times10^{22}\times2.9\times10^{-7}\approx 2.6\times10^{16}$:
$S \approx 31$. $C_{sol}(1473) = 9\times10^{22}\times6.3\times10^{-6}
\approx 5.7\times10^{17}$: $S \approx 1.4$. Nucleation needs the deep
supersaturation of low temperature (barrier $\propto1/\ln^2S$);
growth wants high diffusivity, affordable once nuclei exist because
$S>1$ still supplies material. High-low-high is the threshold diagram
read as a recipe.

**A21.32** $D_O(1373) = 0.13e^{-2.53/0.1183} \approx 6.6\times10^{-11}$
cm²/s... $\sqrt{4Dt} = \sqrt{4(6.6\times10^{-11})(1.44\times10^{4})}
\approx 2.0\times10^{-3}$ cm = 20 µm. Comfortably ≥ the 10 µm claim:
out-diffusion can build the zone. (A claimed zone *deeper* than
$\sqrt{4Dt}$ would flag a vacancy-engineered recipe instead — the
depth-versus-mechanism check is a quick authenticity test on any
denuded-zone story.)

**A21.33** Volume conservation: $Nr^3$ fixed →
$r' = 30\times(10)^{1/3} \approx 65$ nm. Sink strength:
$rN$ falls from $3\times10^{4}$ to $6.5\times10^{3}$ (cm⁻² units) —
a 4.6× weaker pump despite bigger precipitates. Ripening trades
gettering capacity away; end-of-line margins must be computed on the
ripened, not as-built, population (worked example 3.1's warning).

**A21.34** Thermal donors formed at 450 °C: each donates two
electrons, compensating the p-type doping → resistivity rises (toward
type conversion); 650 °C dissolves them → recovery. In n-type
material the added donors *increase* majority carriers → resistivity
falls. One species, opposite signs — a classic identification tell.

**A21.35** Vacancy-rich: abundant vacancy catalysis → dense bulk
nucleation, strong gettering; but its grown-in near-surface nuclei
are also robust, so the zone depends on properly dissolving them —
adequate with the full high step. Near-perfect: sparse vacancies →
weak, erratic precipitation (sometimes below gettering spec — a
known commercial complication of perfect silicon, remedied by
nitrogen doping or tailored RTA), with an easily clean zone.
Gettering strength and zone cleanliness *trade against each other*
through the vacancy census.

**A21.36** Aluminum is a substitutional acceptor whose stability in
silicon and affinity for oxide interfaces make precipitate traps
ineffective (relegation without strong segregation: the sink offers
no deep well for it). Alternative family: *external/proximity
gettering* — backside damage layers, polysilicon backseal, or
phosphorus-diffusion gettering, which capture via segregation into a
heavily doped or damaged external layer.

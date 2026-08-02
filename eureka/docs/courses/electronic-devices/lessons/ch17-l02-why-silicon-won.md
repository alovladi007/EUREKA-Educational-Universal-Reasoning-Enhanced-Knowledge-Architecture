# Why Silicon Won, and Keeps Winning

<!-- covers: 17.2 -->

Silicon is not the best semiconductor by most single measures: germanium
carries electrons faster, gallium arsenide is faster still and emits light,
silicon carbide survives more volts and more heat. Silicon won anyway, and
the reasons are quantitative. This lesson prices each advantage, because the
judgement "a material is chosen on a system of properties, not its best
number" is the most transferable skill in the materials half of this course.

**Level.** Sections 1 to 5 undergraduate core; section 6 graduate extension;
section 7 problems.

## 1. The bandgap sits in the right place

### 1.1 Leakage is exponential in the gap

Every junction leaks in proportion to the minority carriers available, and
the two classical components scale as

$$
J_{\rm diff}\propto n_i^{2},
\qquad
J_{\rm gen}\propto n_i,
\qquad
n_i=\sqrt{N_cN_v}\,e^{-E_g/2k_BT}
$$

so the gap enters the exponent. Compare the workhorse candidates at 300 K:

| material | $E_g$ (eV) | $n_i$ (cm$^{-3}$) | consequence |
|---|---|---|---|
| Ge | 0.66 | $2.4\times10^{13}$ | leaky junctions, 70 C ceiling |
| Si | 1.12 | $1.0\times10^{10}$ | µA-class leakage, 150-200 C ceiling |
| GaAs | 1.42 | $2.1\times10^{6}$ | excellent isolation |
| 4H-SiC | 3.26 | $\sim10^{-8}$ | effectively zero to 500 C+ |

![Intrinsic density against temperature for the three eras of power electronics. Every curve is one exponential; the horizontal line is a typical drift doping, and where a curve crosses it, that material's junctions stop being junctions.](/courses/electronic-devices/figures/m17-ni-comparison.svg)

### Worked example 1.1 — why germanium lost, in one calculation

A germanium diode and a silicon diode, identical geometry, at 300 K. The
diffusion-leakage ratio:

$$
\frac{J_{\rm Ge}}{J_{\rm Si}}=\left(\frac{n_i^{\rm Ge}}{n_i^{\rm Si}}\right)^{2}
=\left(\frac{2.4\times10^{13}}{1.0\times10^{10}}\right)^{2}=5.8\times10^{6}
$$

Six orders of magnitude. And it doubles roughly every 9 K: at 55 C the
germanium part leaks another 16x. Dynamic memory, charge-storage sensors and
low-power logic are impossible on that floor, and the industry's 1960s
migration was this arithmetic, not fashion. The same arithmetic run *forward*
is module 39's case for wide-gap devices: silicon's own ceiling
(lesson 1 of module 18, worked example 5.3) is Ge's story replayed one rung up.

### 1.2 But not too wide

A wide gap costs too: dopant ionisation energies deepen roughly with gap (a
donor is a hydrogen-like state whose depth scales as $m^{*}/\varepsilon_r^{2}$),
so very wide gaps freeze out their dopants at room temperature, and
intrinsic-point-defect compensation strengthens (module 32's self-compensation).
Silicon's 45 meV donors are fully ionised at 300 K; diamond's 370 meV
phosphorus donor is about 1 percent ionised. The gap "sweet spot" for doped,
room-temperature, voltage-scaled logic sits near 1 eV, and silicon happened
to own it.

## 2. The oxide: the accident that decided everything

### 2.1 What thermal SiO2 delivers

Heat silicon in oxygen and its own surface becomes a dielectric with, all at
once: a 9 eV gap; barriers of about 3.1 eV against electrons and 4.8 eV
against holes; breakdown near $10^{7}$ V/cm; resistivity above
$10^{15}\ \Omega$ cm; chemical and thermal stability through every subsequent
process step; and an interface that, after a hydrogen anneal (module 22),
carries only $\sim10^{10}$ traps cm$^{-2}$eV$^{-1}$: about one electrically
active flaw per hundred thousand interface atoms.

![The band alignment that built the industry: multi-electron-volt walls for both carriers, from an insulator the crystal grows out of itself. Germanium's oxide dissolves in water; gallium arsenide's pins the Fermi level; silicon drew the lucky card.](/courses/electronic-devices/figures/m17-oxide-bands.svg)

### 2.2 Why this one property was decisive

The MOSFET *is* an interface: its channel forms in the top nanometres of
silicon against the oxide. Interface traps at $10^{12}$ cm$^{-2}$eV$^{-1}$
(the GaAs situation, module 24's pinning made worse by its oxide) smear the
subthreshold slope from the ideal

$$
S=\frac{k_BT}{e}\ln 10\left(1+\frac{C_{\rm dep}+C_{\rm it}}{C_{\rm ox}}\right)
$$

through the $C_{\rm it}=e^{2}D_{\rm it}$ term until the device barely turns
off. Silicon's $10^{10}$ keeps $C_{\rm it}$ negligible and $S$ near 60-70
mV/decade. **The transistor that scaled was the one whose gate dielectric
came free and whose interface came clean.** Every attempted "better"
semiconductor has had to import a deposited dielectric and fight this
interface war by hand: high-k on III-V channels remains a research field,
while silicon got it by oxidising.

The oxide also enabled the *process*: patterned SiO2 as a diffusion mask is
what made the planar process possible, and the planar process is what made
lesson 1's batch economics possible. One material property, compounded
through the whole stack.

### Worked example 2.1 — the subthreshold price of a dirty interface

Take $C_{\rm ox}$ for 2 nm oxide: $\varepsilon_{\rm ox}/t=3.9\times8.854
\times10^{-12}/2\times10^{-9}=1.73\times10^{-2}\ {\rm F/m^{2}}$. A
$D_{\rm it}=10^{12}\ {\rm cm^{-2}eV^{-1}}=10^{16}\ {\rm m^{-2}eV^{-1}}$
contributes $C_{\rm it}=e^{2}D_{\rm it}=(1.602\times10^{-19})^{2}\times
10^{16}/1.602\times10^{-19}$ per eV... cleanly: $C_{\rm it}=eD_{\rm it}
\times e=1.602\times10^{-19}\times10^{16}\ {\rm eV^{-1}m^{-2}}\times e$:
$C_{\rm it}=2.57\times10^{-3}\ {\rm F/m^{2}}$. Ignoring $C_{\rm dep}$:

$$
S=60\times\left(1+\frac{2.57\times10^{-3}}{1.73\times10^{-2}}\right)
=60\times1.149=69\ {\rm mV/decade}
$$

Tolerable. Now the $10^{13}$ interface of a bad III-V oxide: $C_{\rm it}$
tenfold, $S=60\times2.49=149$ mV/decade: the device needs 2.5x the gate
swing for the same on/off ratio, which at a 1 V supply is fatal. Interface
trap density is not a quality metric; it is an existence condition.

## 3. Purity, strength, and the substrate ladder

### 3.1 Nine nines by distillation

Silicon's purification route runs through a **volatile liquid**: crude silicon
is converted to a chlorosilane, distilled (where separation factors compound
per plate, something no solid-state process offers), and re-deposited as
electronic-grade polysilicon at about one foreign atom in $10^{9}$, then
segregation-refined further during crystal growth (modules 28-29).

![The purification ladder: the decisive drop happens in the distillation column, not the crystal puller. Chemistry, not crystallography, is where nine nines are won.](/courses/electronic-devices/figures/m17-purity-ladder.svg)

Abundance closes the loop: silicon is the second most common element in the
crust, so feedstock price is set by processing energy, not scarcity: contrast
gallium (a by-product of aluminium refining) and indium (module 56's
constraint), whose supplies are hostage to other industries' volumes.

### 3.2 Mechanical strength and the wafer ladder

Silicon's Young's modulus (about 130-170 GPa by orientation) and fracture
toughness let 300 mm wafers, 775 µm thick, survive robotic handling at
thousands of wafers per day. GaAs cleaves at roughly a third the fracture
energy; InP is worse; both cap at 150 mm production diameters.

![The substrate ladder: each diameter step roughly doubled the area processed per wafer pass at similar cost, and the compound semiconductors never climbed past 150 mm. The 450 mm rung was demonstrated and abandoned on economics.](/courses/electronic-devices/figures/m17-wafer-diameter.svg)

Fold the diameters into lesson 1's economics: a 300 mm silicon wafer offers
$(300/150)^{2}=4$x the dies of the largest III-V wafer per pass; the
per-area processed cost lands near an order of magnitude apart. **Any III-V
product must therefore be 10x better or reach markets silicon cannot enter
at all**: lesson 3 is precisely the list of such markets.

### Worked example 3.1 — thermal budget as a materials filter

A CMOS flow includes anneals near 1000 C (module 22's activation). Which
candidates survive? Silicon melts at 1414 C: comfortable. GaAs loses arsenic
above about 600 C without a cap (module 22's overpressure problem); InP is
worse near 360 C uncapped. Germanium melts at 938 C: workable but soft.
The filter explains an asymmetry visible all through this course: silicon
flows *include* high-temperature steps freely and reap their benefits
(diffusion doping, thermal oxide, gettering), while compound flows are built
around avoiding heat, paying in process options every step. A material's
melting point is secretly a process-vocabulary size.

### 3.3 Oxygen: the impurity silicon keeps on purpose

One entry on the purity ladder is deliberately not minimised. Czochralski
growth dissolves the quartz crucible into the melt, loading the crystal
with oxygen at $5\times10^{17}$ to $10^{18}\ {\rm cm^{-3}}$: eight orders
of magnitude above the ladder's summit for everything else: and the
industry *specifies a window* for it rather than driving it out.

The reasons are a preview of module 21 and a lesson in materials judgement.
Interstitial oxygen pins dislocations, hardening the wafer against the
thermal stresses of processing: a low-oxygen wafer slips and warps in the
very furnaces that build the devices. And oxygen that precipitates in the
wafer's bulk during the device thermal cycle forms internal gettering
sites: deliberate defects that capture the transition-metal killers of
module 22 far from the active surface. The engineered product is a
**denuded zone**: clean silicon for the first tens of micrometres, sacrificial
precipitate underneath: a vertical division of labour inside one crystal.

The judgement content: purity is not a virtue in itself but a budget
allocated against failure modes. Oxygen at the right concentration prevents
two failures (slip, metallic contamination) at the price of managing a
third (precipitates in the wrong place). Float-zone silicon, the ladder's
true summit, gives up both benefits with the crucible: which is why FZ
material serves detectors and power devices (which need its lifetime and
resistivity and accept its fragility) while CZ serves everything else. Even
inside one element, "which silicon" is a systems question: the module's
thesis, fractally repeated. Modules 21 and 29 carry the quantitative
story: precipitate nucleation kinetics and the v/G growth window
respectively: and both are already priced into every wafer specification a
foundry publishes.

## 4. What silicon gives up: the honest ledger

The mobilities and heat paths, side by side:

![Room-temperature electron mobility across the working materials: five decades. Silicon sits in the low middle, and everything faster comes with a reason it did not win logic.](/courses/electronic-devices/figures/m17-mobility-lollipop.svg)

![Thermal conductivity, the axis power designers read first. Gallium arsenide carries a third of silicon's heat; diamond embarrasses everything and cannot yet be doped both ways.](/courses/electronic-devices/figures/m17-thermal-lollipop.svg)

The two lollipops summarise the trade: to silicon's left in mobility sit the
disordered films (cheap area, module 41's story); to its right sit the
III-Vs (speed, lesson 3) paying in substrates, oxides and heat. And the
indirect gap: silicon essentially cannot emit light (lesson 3, section 3
quantifies it at the $10^{-4}$ level), the one deficiency no process
ingenuity has repaired.

**The system-versus-scalar lesson.** Rank materials by any single column and
silicon loses. Rank by the *product* of survivable temperature, interface
quality, substrate size, purity, cost and yield, and nothing else is within
orders of magnitude. Keep this framing: modules 31, 32, 47 and 48 are each a
story of a superior scalar losing to an adequate system, and module 39 is the
rare case (SiC) where a scalar advantage (the critical field, cubed in the
figure of merit) was large enough to beat the system handicap.

## 5. Silicon defended by absorption too

One more quiet advantage: silicon's optical absorption profile (module 19)
suits its biggest sensing markets. It absorbs the visible within micrometres
(image sensors) yet transmits beyond 1.1 µm (through-wafer inspection,
backside imaging). The absorption edge lands, by luck, exactly astride the
human-relevant spectrum. Materials rarely get to be lucky twice; silicon,
with the oxide and the edge, was.

## 6. Graduate extension: the near-misses, quantified

**Germanium's return.** Ge is back inside silicon technology as SiGe
stressors and Ge-rich p-channels (module 38): its hole mobility (1900,
double silicon's) is wanted, and its fatal leakage is contained by using it
in *thin films on silicon*, letting silicon keep the substrate duties. The
winning platform absorbs its rivals' best scalars as add-on layers: strained
Si, SiGe, silicide contacts, high-k oxides: "silicon" in 2026 is a composite
that keeps only the substrate, the economics and the interface from 1966.

**The SOI fork.** Silicon-on-insulator (module 43) shows the platform
competing with itself: a buried oxide buys junction isolation and lower
capacitance at 2 to 3x substrate cost, and for twenty years it captured only
niches (RF switches, rad-hard, FD-SOI low power) because bulk silicon kept
answering with cheaper fixes. Even within one material, the system test
rules.

**The compound that did beat silicon at logic scale: none.** GaAs logic
(1980s supercomputer efforts) delivered 2 to 3x clock at 10x cost and watts,
then lost to silicon's next two nodes: lesson 1's cadence *is* a weapon; any
challenger must beat not today's silicon but silicon two nodes hence. The
survivors attacked where the cadence does not reach: light emission,
microwave power, and, in module 39's SiC case, the $\mathcal{E}_c^{3}$
figure of merit that no amount of silicon scaling touches.

## 7. Problems

**P17.9** Compute the diffusion-leakage ratio Si:GaAs at 300 K, and the
temperature at which silicon's $n_i$ equals GaAs's at 300 K.

**P17.10** Using $S=60(1+C_{\rm it}/C_{\rm ox})$ mV/dec with 1 nm equivalent
oxide, what $D_{\rm it}$ doubles the subthreshold swing?

**P17.11** A 150 mm GaAs wafer costs 8x a 300 mm silicon wafer per unit
area after processing. For equal die areas and yields, how much better per
transistor must the GaAs product be to break even, and name two markets from
this course where that bar is met.

**P17.12** Estimate the donor ionised fraction for a 370 meV donor at 300 K
(Boltzmann estimate, degeneracy 2), and the temperature for 50 percent
ionisation.

**P17.13** Silicon's fracture toughness is roughly 0.9 MPa m$^{1/2}$ and
GaAs's 0.44. For the same flaw population, by what factor must handling
stress be reduced, and what does that do to maximum practical wafer size
(stress from self-weight scales with diameter squared over thickness)?

**P17.14** *(graduate)* From the hydrogenic-donor scaling
$E_d\propto m^{*}/\varepsilon_r^{2}$, predict GaN's donor depth from
silicon's 45 meV ($m^{*}$: 0.26 vs 0.20; $\varepsilon_r$: 11.7 vs 8.9), and
compare with the measured ~25-30 meV for Si in GaN: what does the agreement
or disagreement tell you?

**P17.15** *(graduate)* The 60 mV/decade limit follows from carrier
statistics: derive it from $I\propto e^{eV/k_BT}$ and state why a
ferroelectric gate (module 42's negative capacitance) or a tunnel FET could
evade it while no mobility improvement can.

### Answers

**P17.9** $(n_i^{\rm Si}/n_i^{\rm GaAs})^{2}=(10^{10}/2.1\times10^{6})^{2}
=2.3\times10^{7}$: silicon leaks 20-million-fold more than GaAs: isolation is
GaAs's quiet virtue (semi-insulating substrates, module 28). Equal-$n_i$
temperature: need silicon's exponential down 4700x:
$\ln(4.76\times10^{3})=8.47=(E_g/2k_B)(1/T-1/300)$ with negative sign:
$T$ such that $1/300-1/T=8.47\times2\times8.617\times10^{-5}/1.12=1.30\times
10^{-3}$... that gives $1/T=2.03\times10^{-3}$, $T=492$ K on the *hot* side
inverted: silicon at about **220 K** matches GaAs at 300 K (cool silicon by
80 degrees to borrow GaAs's isolation: exactly what cooled silicon
instruments do).

**P17.10** Doubling means $C_{\rm it}=C_{\rm ox}$. 1 nm EOT:
$C_{\rm ox}=3.45\times10^{-2}$ F/m2. $D_{\rm it}=C_{\rm ox}/e^{2}$ per
J-state... using $C_{\rm it}=e\,D_{\rm it}[{\rm eV^{-1}}]\times e$:
$D_{\rm it}=C_{\rm ox}/(1.602\times10^{-19})^{2}\times1.602\times10^{-19}
=C_{\rm ox}/e\ [{\rm eV^{-1}m^{-2}}]=2.15\times10^{17}\ {\rm m^{-2}eV^{-1}}
=2.2\times10^{13}\ {\rm cm^{-2}eV^{-1}}$: precisely the ballpark of unpinned
III-V interfaces: those devices genuinely lived at doubled swing, which is
why III-V MOS took forty years.

**P17.11** Break-even needs value per area 8x: at equal function density the
GaAs part must earn 8x per transistor. Met where silicon scores zero or
near-zero: light emission (lesson 3: LEDs, lasers) and high-frequency power
(HEMT front ends, module 18's 2DEG): both markets price a function silicon
cannot deliver at any discount.

**P17.12** Fraction $\approx\frac{1}{1+2e^{E_d/k_BT}}$:
$e^{370/25.85}=e^{14.3}=1.6\times10^{6}$: fraction $3\times10^{-7}$... with
the standard donor statistics including the band DOS the practical number is
of order $10^{-2}$: the pure two-level estimate overshoots because ionisation
competes into a continuum of band states ($N_c$ large), and stating that
correction is the point. 50 percent (two-level): $T=E_d/(k_B\ln 2)\times$...
$T=370\ {\rm meV}/(0.0862\ {\rm meV/K}\times\ln2... )$: using
$k_B=0.0862$ meV/K: $T=370/(0.0862\times0.69)=6200$ K nominal: i.e. never:
deep dopants do not ionise thermally; diamond electronics runs on hopping or
field ionisation instead: the real content of the answer.

**P17.13** Stress at fracture scales with toughness: allowable stress ratio
$0.44/0.9=0.49$: half. Self-weight stress $\propto d^{2}/t$: at equal
thickness, $d$ shrinks by $\sqrt{2}$: a 300 mm GaAs wafer would need to be
handled like a 210 mm silicon wafer's stress budget while being twice as
break-prone in practice (cleavage planes): the physical half of why III-V
diameters stalled at 150 mm; the economic half is lesson 1.

**P17.14** Scaling: $E_d^{\rm GaN}=45\times(0.20/0.26)\times(11.7/8.9)^{2}
=45\times0.769\times1.728=60$ meV. Measured 25-30 meV: the hydrogenic model
*overestimates* because GaN's donor wavefunction samples the polar lattice's
larger static screening and central-cell corrections cut the depth. The
factor-2 agreement is exactly what the model promises (it is a scaling law,
not a calculator), and the direction of its error is itself informative
about screening: how such models should always be graded.

**P17.15** Subthreshold current is thermionic over a gate-controlled
barrier: $I\propto e^{e\psi_s/k_BT}$ and at best $d\psi_s=dV_G$: hence
$dV_G$ per decade $\ge k_BT\ln10/e=59.5$ mV at 300 K. Mobility multiplies
the prefactor only: the slope is pure statistics. Evasion requires either a
non-thermal injection distribution (tunnel FET filters the Boltzmann tail)
or $d\psi_s/dV_G>1$ (negative capacitance: module 42's contested
proposition): the two research programmes in one derivation, and the reason
neither is a materials tweak.

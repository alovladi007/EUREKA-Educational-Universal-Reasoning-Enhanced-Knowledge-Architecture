# Compound Platforms by the Numbers: Photons and Microwaves

<!-- covers: 17.3 -->

Lesson 3 mapped the compound estate qualitatively. This lesson equips the
map with its working equations: photometry for emitters, threshold for
lasers, responsivity and noise for detectors, sheet charge and gain for the
HEMT: the calculations a designer actually runs before choosing an address
on the chart.

**Level.** Sections 1 to 4 undergraduate; section 5 graduate; section 6
problems.

## 1. Emitters: from watts to lumens

### 1.1 The chain of efficiencies

A power LED converts as a product of stages:

$$
\eta_{\rm wall}=\eta_{\rm inj}\times\eta_{\rm IQE}\times\eta_{\rm extr}
\times\eta_{\rm elec}
$$

injection (carriers reaching the wells), internal quantum efficiency
(lesson 3's clock race), extraction (photons escaping the high-index die),
and electrical (drive voltage above the photon voltage). Extraction is the
sleeper: by Snell, light inside index $n$ escapes a planar surface only
within the critical cone

$$
\theta_c=\arcsin\frac{1}{n},
\qquad
\eta_{\rm extr}^{\rm planar}\approx\frac{1}{4n^{2}}
\ \text{(per face, small-angle form)}
$$

For GaN's $n=2.4$: about 4 percent per face: the raw die traps 24 out of 25
photons, and the patterning, roughening and flip-chip industry exists to
free them: geometry, not physics, and the reason package engineering shows
up in an emitter's efficiency budget at all.

### 1.2 Lumens are weighted watts

The eye weights power by the photopic curve $V(\lambda)$, peaking at 555 nm:

$$
\Phi_{\rm lm}=683\ \frac{\rm lm}{\rm W}\int V(\lambda)\,P(\lambda)\,d\lambda
$$

so 683 lm/W is the ceiling *at 555 nm only*; white spectra top out near 300
to 350 lm/W: the hard ceiling lesson 3's Haitz projection must respect.

### Worked example 1.1 — a lighting LED, audited end to end

A blue-pumped white LED: 3.0 V drive, 350 mA, photon energy 2.7 eV,
$\eta_{\rm inj}=0.95$, $\eta_{\rm IQE}=0.85$, $\eta_{\rm extr}=0.80$
(modern packaged), phosphor conversion 0.75 (Stokes plus quantum), spectrum
efficacy 320 lm/W-optical.

Electrical in: $1.05$ W. Electrical stage:
$\eta_{\rm elec}=2.7/3.0=0.90$. Optical out:
$1.05\times0.90\times0.95\times0.85\times0.80\times0.75=0.458$ W.
Flux: $0.458\times320=147$ lm: efficacy $140$ lm/W: exactly the class of a
premium 2020s lamp, and the audit shows where the remaining watts hide: the
phosphor's 25 percent and the drive overhead: which is why "violet-pump plus
three phosphors" and "direct green" (the green gap, lesson 3) are the two
research fronts.

## 2. Lasers: the threshold inequality

A diode laser oscillates when round-trip gain equals round-trip loss:

$$
\boxed{\;\Gamma g_{\rm th}=\alpha_i+\frac{1}{2L}\ln\frac{1}{R_1R_2}\;}
$$

confinement factor $\Gamma$, internal loss $\alpha_i$, cavity length $L$,
facet reflectivities $R$. Above threshold, output rises linearly with the
slope efficiency, and the threshold current density follows the gain-current
characteristic of the well material.

### Worked example 2.1 — why facets alone suffice

GaAs-air facets: $R=\left(\frac{n-1}{n+1}\right)^{2}
=\left(\frac{2.6}{4.6}\right)^{2}=0.32$. Mirror loss for $L=500\ \mu$m:

$$
\alpha_m=\frac{1}{2\times0.05}\ln\frac{1}{0.32^{2}}
=10\times2.28=22.8\ {\rm cm^{-1}}
$$

With $\alpha_i=5\ {\rm cm^{-1}}$ and $\Gamma=0.03$:
$g_{\rm th}=(22.8+5)/0.03=927\ {\rm cm^{-1}}$: achievable in a quantum well
at a few kA/cm2. The cleaved crystal *is* the mirror: one reason diode
lasers cost dollars: the resonator is free: and the estate map's high
indices, a nuisance for LED extraction, are the laser's gift.

## 3. Detectors: responsivity and the noise floor

### 3.1 Responsivity

Each photon above the gap yields at most one electron:

$$
\boxed{\;R_\lambda=\frac{\eta\,e}{h\nu}=\eta\,\frac{\lambda[\mu m]}{1.24}
\ \frac{\rm A}{\rm W}\;}
$$

Silicon at 850 nm, $\eta=0.8$: $R=0.55$ A/W; Ge or InGaAs at 1.55 µm,
$\eta=0.9$: $R=1.12$ A/W: the linear-in-wavelength reward for narrow gaps,
purchased with lesson 2's leakage exponential ($J_{\rm dark}\propto n_i$ or
$n_i^{2}$): responsivity and dark current climb the same wavelength ladder,
and detector design is the management of that pair.

### 3.2 Shot noise and NEP

Dark current $I_d$ sets the white-noise floor:

$$
i_n=\sqrt{2eI_dB},
\qquad
{\rm NEP}=\frac{i_n}{R_\lambda}
$$

### Worked example 3.1 — a receiver floor, computed

InGaAs pin at 1.55 µm: $I_d=2$ nA, $R=1.0$ A/W, $B=10$ GHz:

$$
i_n=\sqrt{2\times1.602\times10^{-19}\times2\times10^{-9}\times10^{10}}
=\sqrt{6.4\times10^{-18}}=2.5\ {\rm nA}
$$

NEP $=2.5$ nW; for SNR of 12 dB (BER-grade), need about 40 nW: $-44$ dBm
sensitivity before amplifier noise: matching real 10G receivers within a few
dB. Every term is a materials line: $\eta$ from absorption depth (module 19),
$I_d$ from $n_i(E_g)$ and defects (module 22's lifetime killers), $B$ from
transit and RC (lesson 5's identities): a datasheet is this module in a
different font.

## 4. Microwaves: the HEMT's arithmetic

Module 18 built the 2DEG; the device numbers follow in three lines. Sheet
charge under a barrier of thickness $d$:

$$
n_s=\frac{\varepsilon}{ed}(V_G-V_T),
\qquad
g_m=\frac{\varepsilon}{d}\,v_{\rm eff}\ \text{per unit width},
\qquad
f_T=\frac{v_{\rm eff}}{2\pi L_g}
$$

### Worked example 4.1 — a GaN power bar

AlGaN barrier $d=20$ nm ($\varepsilon_r=9$), polarization-set
$n_s=1.0\times10^{13}$ cm$^{-2}$, $v_{\rm eff}=1.5\times10^{7}$ cm/s,
$L_g=150$ nm, 30 V drain at 40 percent drain efficiency.

$g_m=\varepsilon v/d=9\times8.854\times10^{-12}\times1.5\times10^{5}
/2\times10^{-8}=0.60$ S/mm. $f_T=1.5\times10^{5}/(2\pi\times1.5\times10^{-7})
=159$ GHz. Current capacity: $en_sv=1.602\times10^{-19}\times10^{17}
\times1.5\times10^{5}$ per m: $2.4$ A/mm: at 30 V and class-AB dissipation,
watts per millimetre of gate: the thermal lollipop's SiC substrate stops
being optional: and the Johnson audit of lesson 3 (worked example 3.1)
said this device class should exist before any layout was drawn. Physics
first, foundry second: the module's method in one device.

## 4b. The link budget: where all four sections meet

The transceiver case of the capstone assigned materials; here is the
arithmetic that sizes one direction of such a link, because a link budget
is the natural exam of sections 1 to 4 together.

$$
P_{\rm rx}[{\rm dBm}]=P_{\rm tx}+ \eta_{\rm couple} - \alpha_{\rm fib}\,L
- M_{\rm sys}
$$

### Worked example 4b.1 — a 10 km, 10 Gb/s budget

Transmitter: a 1310 nm DFB launching $+2$ dBm into fibre (already net of
coupling). Fibre: 0.35 dB/km at 1310 nm: 3.5 dB over 10 km. Connectors and
splices: 1.5 dB. System margin demanded: 3 dB (ageing: the laser's
threshold creep of P17.37: plus repairs). Receiver power:

$$
P_{\rm rx}=+2-3.5-1.5-3=-6\ {\rm dBm}=0.25\ {\rm mW}
$$

Receiver requirement from worked example 3.1's class: $-19$ dBm class
sensitivity for a pin at 10 Gb/s with a good amplifier... the budget
closes with 13 dB to spare: which is precisely why 10 km access links use
cheap pin receivers and no APD (module 18's excess-noise tax never earns
its keep at this length), while 80 km long-haul at the same rate exhausts
the margin and buys APDs, then coherent detection. **Reach classes in
optical networking are materials decisions filtered through this
subtraction**: emitter power (a facet and threshold problem), fibre loss
(module 19's absorption physics at its historic minimum), and receiver
floor (the $n_i$ exponential wearing a detector's clothes).

The budget also explains a fork the industry actually took: at 850 nm
(multimode, VCSEL, silicon-detector-compatible) loss is 2 to 3 dB/km:
thirty times worse: so that wavelength owns only the sub-kilometre
datacentre estate where its GaAs VCSELs' pennies-per-gigabit dominate:
lesson 3's estate map, projected onto a distance axis. One equation, three
supply chains, and the whole optical-interconnect market's structure.

## 5. Graduate extension: the detailed-balance discipline

Emission and absorption are one process read in two directions: the van
Roosbroeck-Shockley relation ties the radiative rate to the absorption
spectrum,

$$
R_{\rm rad}=\int\alpha(E)\,\rho_{\rm ph}(E)\,c/n\ dE
\quad\Rightarrow\quad
\tau_r\ \text{computable from}\ \alpha(E)
$$

which is *why* lesson 3 could quote nanosecond direct and millisecond
indirect radiative clocks: they are the absorption edges of the
direct/indirect figure, integrated. The same detailed-balance logic bounds
every emitter (an LED in reverse is a photodiode; a good absorber is
necessarily a good emitter at the same wavelength), and its most famous
corollary: the efficiency bound of a single-junction solar absorber: lives
in the deferred photovoltaic scope (SCOPE.md), where this equation will
already be an old friend.

The discipline generalises into the course's method: **any claimed emitter,
detector or absorber number must be consistent with its reciprocal
process**, and auditing datasheets against reciprocity catches errors that
no single-direction measurement reveals: module 19's Kramers-Kronig was the
optical-constants version of the same law.

## 6. Problems

**P17.31** Compute planar extraction for GaAs ($n=3.5$) and the improvement
factor of an ideally roughened surface (extraction $\to\eta\approx1/n
(1+\cos\theta_c)/2$ class estimates aside, take 0.30).

**P17.32** A red 640 nm LED emits 0.30 W optical with $V(\lambda)=0.175$.
Flux and efficacy at 2.2 V, 200 mA?

**P17.33** For the laser of section 2, what cavity length halves the mirror
loss, and what does that trade against? (Two consequences.)

**P17.34** A silicon photodiode at 940 nm: absorption depth 50 µm but the
junction collects only 30 µm. Estimate $\eta$ (Beer-Lambert, ignore
reflection) and $R_\lambda$.

**P17.35** Recompute worked example 3.1's sensitivity with an avalanche gain
of 10 and silicon-like $F(M)=3$ (module 18's McIntyre), assuming
amplifier-limited before, shot-limited after.

**P17.36** An InP HEMT: $d=12$ nm, $\varepsilon_r=12.5$, $v_{\rm eff}
=2.5\times10^{7}$ cm/s, $L_g=70$ nm. Find $g_m$/mm and $f_T$; compare with
the GaN bar and reconcile via lesson 3's estate logic.

**P17.37** *(graduate)* From the threshold condition, derive the
characteristic-temperature phenomenology: if $J_{\rm th}\propto
e^{T/T_0}$, what does a measured $T_0=60$ K (InP) versus 150 K (GaAs)
imply for uncooled operation, and which module 39 physics attacks it?

**P17.38** *(graduate)* Use reciprocity qualitatively: a vendor claims a
detector with $\eta=0.95$ at 1.55 µm built from a material whose emission
at 1.55 µm is "negligible by design". State the audit question and the
physics that makes the claim suspect.

### Answers

**P17.31** $1/4n^{2}=1/49=2.0$ percent per face: roughening to 30 percent
is a **15x** package-level win: why every high-power die is textured,
shaped or flip-chipped: photon plumbing outranks semiconductor physics in
an LED's budget.

**P17.32** $\Phi=683\times0.175\times0.30=35.9$ lm. Input
$=0.44$ W: efficacy 81 lm/W: respectable-looking, yet the *optical*
conversion was 68 percent: red's low $V(\lambda)$ taxes what physics
earned: lumens are a human unit, and lesson 3's efficacy ceiling is a
retina, not a diode.

**P17.33** $\alpha_m\propto1/L$: double $L$ to 1 mm: $\alpha_m=11.4$
cm$^{-1}$. Trades: (1) threshold *current* rises with area even as
threshold gain falls: optimum length is a minimisation, not a maximisation;
(2) longitudinal mode spacing $\Delta\nu=c/2nL$ halves: mode selection
(gratings: DFB) becomes necessary sooner: the telecom laser's architecture
in one trade.

**P17.34** $\eta=1-e^{-30/50}=0.451$. $R=0.451\times0.94/1.24=0.34$ A/W:
and the 940 nm remote-control/LiDAR band lives with exactly this compromised
silicon $\eta$: or pays for thicker, higher-resistivity depletion (module
28's FZ material): a substrate choice surfacing in a responsivity.

**P17.35** Signal current $\times10$; shot noise
$\times\sqrt{10\times... }$: $i_n=\sqrt{2eI_dB\,M^{2}F}=M\sqrt{F}\times$
before $=10\times1.73\times2.5$ nA $=43$ nA but signal also $\times10$:
SNR improves by $10/(10\times1.73/1)$ against the *shot* floor: net
$1/\sqrt{F}$: yet versus a 30 nA *amplifier* floor the gain lifts signal
clear: sensitivity improves nearly 10x until shot noise re-dominates:
avalanche gain buys exactly one thing: escape from the amplifier: module
18's $F(M)$ then bills for it.

**P17.36** $g_m=12.5\times8.854\times10^{-12}\times2.5\times10^{5}
/1.2\times10^{-8}=2.3$ S/mm; $f_T=2.5\times10^{5}/(2\pi\times7\times10^{-8})
=568$ GHz: thrice the GaN bar's speed at a fraction of its voltage: InP
owns low-noise speed, GaN owns volts: the estate partition of lesson 3,
re-derived from four numbers: receivers InP, transmitters GaN, and both on
the same 5G mast.

**P17.37** $dJ_{\rm th}/dT=J/T_0$: a 60 K $T_0$ doubles threshold every 42
K: uncooled 25-to-85 C operation quadruples drive: hence coolers on InP
telecom lasers. The attack: suppress the dominant thermal culprit: Auger
recombination and carrier leakage: which is precisely module 39's
bismide/spin-orbit programme ($\Delta_{SO}>E_g$ forbidding the CHSH Auger
channel): a $T_0$ problem assigned to a band-structure lever.

**P17.38** Audit question: "at what rate does your detector *emit* at 1.55
µm under forward injection?": by van Roosbroeck-Shockley, absorption
$\eta=0.95$ at a wavelength *requires* a proportionate radiative rate
there: "negligible emission by design" contradicts reciprocity unless the
design suppresses *extraction* (geometry) rather than the rate. Either the
emission claim, the absorption claim, or the wording is wrong: detailed
balance is the auditor that never sleeps.

# The Hall Effect, High-Field Transport, and Impact Ionization

<!-- covers: 18.9, 18.10, 18.11 -->

Conductivity delivers the product $n\mu$; design needs the factors separately,
and section 1 is how they are separated. Sections 2 and 3 then push the field
up until first the mobility concept and then the material itself give way.

**Level.** Sections 1.1 to 1.4, 2.1 to 2.2 and 3.1 to 3.4 are the
undergraduate core; sections 1.5, 2.3 to 2.4 and 3.5 are graduate extensions.
Section 4 is the problem set.

## 1. The Hall effect

### 1.1 The force balance

Send current $I$ along a bar of width $w$ and thickness $t$, field
$\mathbf{B}$ perpendicular. Each carrier feels
$q\,\mathbf{v}\times\mathbf{B}$ and deflects sideways; charge piles on one
face until its transverse field cancels the push:

$$
q\mathcal{E}_y=q\,v_dB
\quad\Longrightarrow\quad
\mathcal{E}_y=v_dB
$$

![The transverse field grows until it balances the magnetic force. Electrons and holes deflect toward the same face but deposit opposite charge there, which is what makes the polarity of the voltage diagnostic.](/courses/electronic-devices/figures/m18-hall-bar.svg)

With $V_H=\mathcal{E}_yw$ and $I=nqv_d\,wt$:

$$
\boxed{\;V_H=\frac{IB}{nqt},\qquad
R_H\equiv\frac{\mathcal{E}_y}{J_xB}=\frac{1}{nq}\;}
$$

Combined with a resistivity measurement on the same sample,
$\mu_H=|R_H|\sigma$: one bar yields carrier **type, density and mobility**.
The inverse dependence on $n$ explains the practical hierarchy: metals with
$n\sim10^{29}\ {\rm m^{-3}}$ give nanovolt Hall signals and make poor sensors,
while a semiconductor at $10^{22}$ gives millivolts, which is why every
commercial Hall sensor is a semiconductor and the best are the low-mass, high
mobility III-V compounds.

### 1.2 Why the sign is the payload

Flip the carrier sign and both $q$ and the drift direction $\mathbf{v}$ flip;
the product $q\mathbf{v}\times\mathbf{B}$ does not. Both carrier types crowd
the **same** face, but they deposit **opposite** charge there, so $V_H$
reverses polarity with carrier type. Historically this proved that positive
mobile charge is real in solids; routinely, it is the two-minute check that a
layer came out n-type or p-type, and it needs no calibration at all, only a
polarity.

### 1.3 Sheet form and van der Pauw

For films the natural quantity is the sheet density $n_s=nt$:

$$
n_s=\frac{IB}{q|V_H|}
$$

with no thickness needed. The van der Pauw theorem extends both resistivity
and Hall measurement to an arbitrarily shaped lamella with four perimeter
contacts, which is why new materials get characterised before anyone patterns
a bar. The protocol that makes the numbers trustworthy: measure at both field
polarities and both current directions and combine, cancelling contact
misalignment (a $B$-independent offset), thermoelectric voltages, and the
thermomagnetic (Nernst-type) artefacts. A Hall number quoted from a single
polarity is provisional by definition; module 36 turns this into a checklist.

### Worked example 1.1 — full extraction from one film

A 1 µm film: $I=1$ mA, $B=0.5$ T, $V_H=-1.2$ mV, $R_s=180\ \Omega/\square$.

Negative polarity with this geometry: electrons. Sheet density
$n_s=IB/(q|V_H|)=(10^{-3}\times0.5)/(1.602\times10^{-19}\times1.2\times10^{-3})
=2.6\times10^{18}\ {\rm m^{-2}}$, volume density
$n=n_s/t=2.6\times10^{24}\ {\rm m^{-3}}=2.6\times10^{18}\ {\rm cm^{-3}}$.
Mobility:

$$
\mu_H=\frac{|R_H|}{\rho}=\frac{1}{n\,q\,R_st}
=\frac{1}{2.6\times10^{24}\times1.602\times10^{-19}\times1.8\times10^{-4}}
=133\ {\rm cm^{2}/Vs}
$$

Report it *as a Hall mobility*: the drift value is $\mu_H/r_H$, and with
ionised-impurity scattering plausible at this doping, $r_H$ may be as large as
1.9 (lesson 1, section 8.3). A 30 to 90 percent systematic sits inside that
one honest subscript.

### Worked example 1.2 — a Hall sensor budget

A GaAs sensor: $t=2\ {\rm \mu m}$, $n=10^{16}\ {\rm cm^{-3}}$, bias
$I=1$ mA. Sensitivity per tesla:

$$
\frac{V_H}{B}=\frac{I}{nqt}
=\frac{10^{-3}}{10^{22}\times1.602\times10^{-19}\times2\times10^{-6}}
=0.31\ {\rm V/T}
$$

Earth's field ($50\ {\rm \mu T}$) gives $16\ {\rm \mu V}$: comfortably
measurable, which is why a chip costing cents replaced mechanical compasses.
The design rules fall straight out of the formula: thin layer, light doping,
and a material that tolerates the resulting resistance, meaning high mobility.
InSb and InAs, with the highest mobilities of any bulk semiconductors, own the
high-sensitivity end.

### 1.4 Two-carrier conduction: when the Hall effect misleads

With electrons and holes both present, superpose the two current responses.
Keeping terms to first order in $B$:

$$
R_H=\frac{1}{q}\,\frac{p\mu_p^{2}-n\mu_n^{2}}{(p\mu_p+n\mu_n)^{2}}
=\frac{1}{q}\,\frac{p-nb^{2}}{(p+nb)^{2}},
\qquad b\equiv\frac{\mu_n}{\mu_p}
$$

The mobilities enter **squared**, so the faster carrier is over-represented: a
p-type sample with $b\approx3$ reads as n-type once
$n>p/b^{2}$, that is when electrons are only a ninth of the hole population.

![A p-type sample heated toward intrinsic: the Hall coefficient collapses and changes sign near 500 kelvin although the doping never changed, because the thermally generated electrons, three times more mobile, outvote the holes at nine-to-one odds.](/courses/electronic-devices/figures/m18-hall-two-carrier.svg)

The tests for two-carrier contamination: a field-dependent $R_H$ (one-carrier
$R_H$ is flat in $B$), and a temperature sweep like the figure. Interpreting a
near-intrinsic or compensated sample with the one-carrier formula is among the
commonest published Hall errors, and narrow-gap materials (module 31's
detectors) live permanently in this regime.

### 1.5 Graduate note: magnetoresistance

At first order in $B$ a single-carrier Hall bar develops **no** extra
longitudinal resistance: the Hall field exactly cancels the Lorentz force for
the mean carrier. Two loopholes give real magnetoresistance. **Physical:**
carriers are spread over energies, so no single Hall field cancels the force
for all of them; the residue is of order $(\mu B)^{2}$ and measures the spread
of $\tau(E)$. **Geometric:** shape the sample so the Hall field cannot build
up (the Corbino disc, with concentric contacts and no edges to charge) and the
full $\left[1+(\mu B)^{2}\right]$ factor appears in the resistance. The
geometric effect scales with $\mu^{2}$, which is why the
extraordinary-magnetoresistance sensors of module 50 are built on the
highest-mobility semiconductor available, InSb, and why magnetoresistive
readout in general prizes mobility over everything.

## 2. High-field transport

### 2.1 The energy balance and the hot electron

Linear response assumed the field feeds momentum, and collisions drain it, at
matched small rates. Raise the field and the *energy* books stop balancing at
the lattice temperature. In steady state the input power per carrier equals
the loss rate to phonons:

$$
e\mathcal{E}v_d=\frac{\langle E\rangle-\tfrac{3}{2}k_BT_L}{\tau_E}
\quad\Longrightarrow\quad
T_e=T_L+\frac{2}{3}\,\frac{e\mathcal{E}v_d\,\tau_E}{k_B}
$$

with $\tau_E$ the energy relaxation time (about 0.1 to 1 ps: energy relaxes
more slowly than momentum, which is the whole phenomenon). Carriers run at an
effective temperature $T_e$ above the lattice:

![The electron temperature computed from the energy balance climbs into the thousands of kelvin at fields a modern transistor reaches routinely, crossing the optical-phonon emission threshold on the way.](/courses/electronic-devices/figures/m18-hot-carrier-temperature.svg)

The threshold marked on the figure is the pivot of the whole high-field story:
once $k_BT_e$ reaches $\hbar\omega_{\rm op}$ (63 meV in silicon), carriers can
emit optical phonons, and that channel is voracious.

### 2.2 Velocity saturation

Past the threshold, additional field power goes into phonon emission rather
than into faster drift, and the velocity pins at

$$
v_{\rm sat}\approx\sqrt{\frac{8\hbar\omega_{\rm op}}{3\pi m^{*}}}
\approx10^{7}\ {\rm cm/s}\ \text{in silicon}
$$

The empirical interpolation used by every compact device model:

$$
v_d=\frac{\mu_0\mathcal{E}}
{\left[1+\left(\mu_0\mathcal{E}/v_{\rm sat}\right)^{\beta}\right]^{1/\beta}}
$$

with $\beta\approx2$ for electrons in silicon, $\approx1$ for holes.

![Silicon saturates monotonically while gallium arsenide overshoots and falls back: its carriers transfer into a heavier satellite valley once they gain a third of an electron-volt, so more field can mean less speed.](/courses/electronic-devices/figures/m18-velocity-field.svg)

### Worked example 2.1 — where the linear model dies

At what field is silicon's $v_d$ 10 percent below the linear extrapolation
($\mu_0=1350$, $v_{\rm sat}=10^{7}$ cm/s, $\beta=2$)? Require
$[1+(\mu_0\mathcal{E}/v_{\rm sat})^{2}]^{-1/2}=0.9$:
$(\mu_0\mathcal{E}/v_{\rm sat})^{2}=0.235$, so
$\mathcal{E}=0.484\,v_{\rm sat}/\mu_0=3.6\times10^{3}$ V/cm: **0.36 V across a
micrometre**. Every modern transistor operates far beyond linear response,
which is why hand analysis with a constant mobility overestimates drive
current, and why $v_{\rm sat}$, not $\mu$, is the headline transport number
for short devices.

### Worked example 2.2 — Gunn oscillator frequency

The GaAs negative-differential-mobility instability grows travelling dipole
domains that transit the device at roughly $10^{7}$ cm/s. For a 10 µm transit
region:

$$
f=\frac{v}{L}=\frac{10^{5}\ {\rm m/s}}{10^{-5}\ {\rm m}}=10\ {\rm GHz}
$$

A microwave oscillator with no junctions and no resonator: the frequency is
set by an epitaxial layer thickness. Shorter devices push toward 100 GHz,
where transit-time devices seeded the millimetre-wave field before transistors
caught up.

### 2.3 Graduate: velocity overshoot

The saturation curve is a *steady-state* statement. Momentum relaxes in
$\tau_m\sim0.1$ ps but energy in $\tau_E\sim0.3$ ps, so for a moment after a
field steps on, carriers are cold (little scattering) yet strongly driven,
and they exceed their own steady-state velocity:

![After a field step the carrier gas outruns its steady-state curve for a fraction of a picosecond, most dramatically in gallium arsenide where cold light-valley electrons have not yet transferred to the heavy valley.](/courses/electronic-devices/figures/m18-velocity-overshoot.svg)

A carrier crossing a 50 nm channel at $4\times10^{7}$ cm/s spends 0.125 ps in
transit: comparable to $\tau_E$, so a short device lives partly in the
overshoot window and beats its own $v$-$\mathcal{E}$ curve. This is a real
contributor to modern device current, it is invisible to any local mobility
model, and it is why serious short-channel simulation is Monte Carlo or
hydrodynamic rather than drift-diffusion.

### 2.4 Graduate: hot carriers as a wear mechanism

The tail of a $T_e\sim2000$ K distribution reaches several eV. Carriers above
about 3.1 eV can surmount the Si/SiO2 barrier, inject into the gate oxide and
stick, shifting threshold voltage; carriers above $\tfrac{3}{2}E_g$ ionise
(section 3) and the generated holes drive the substrate current that
reliability engineers monitor as a live hot-carrier gauge. Supply-voltage
scaling was driven as much by this wear-out as by power: at 5 V a drain field
could deliver the full barrier energy, at 1 V it cannot, and the residual
degradation rides the exponential tail of $T_e$. Module 36 measures the
damage by charge pumping; module 43's interface chemistry sets how fast it
accumulates.

## 3. Impact ionization and avalanche breakdown

### 3.1 The threshold

A carrier with kinetic energy above the gap can promote a valence electron,
creating a pair. Conserving both energy and momentum in a parabolic-band
collision raises the requirement above the bare gap:

$$
E_{\rm th}=\frac{3}{2}E_g
$$

(equal masses; real band structures scatter the coefficient between about 1
and 2). Silicon: threshold near 1.7 eV, reached only by the far tail of even a
very hot distribution, which is why ionisation turns on so abruptly with
field.

### 3.2 The ionisation coefficient

The working quantity is $\alpha(\mathcal{E})$, pairs generated per carrier per
unit length. The Chynoweth form captures measurement across the practical
range:

$$
\alpha=\alpha_{\infty}\,e^{-\mathcal{E}_c/\mathcal{E}}
$$

The exponential in $1/\mathcal{E}$ follows from a lucky-drift argument: a
carrier ionises only if it survives ballistically long enough to gain
$E_{\rm th}$, and survival odds decay exponentially with the required
distance $E_{\rm th}/e\mathcal{E}$.

![Plotted against inverse field the Chynoweth law is a straight line; silicon's electron and hole coefficients run far apart, and that gap, not either value alone, is what makes silicon the low-noise avalanche material.](/courses/electronic-devices/figures/m18-chynoweth.svg)

### 3.3 Multiplication and breakdown

In a depletion region of width $W$, generated carriers generate further. For
equal coefficients the multiplication factor obeys

$$
1-\frac{1}{M}=\int_{0}^{W}\alpha\,dx
$$

so $M\to\infty$ exactly when the **ionisation integral reaches one**: the
definition of breakdown, not a separate postulate. Circuit-level work uses
Miller's interpolation

$$
M=\frac{1}{1-(V/V_{\rm BR})^{n}},\qquad n\approx2\ \text{to}\ 6
$$

![Multiplication is a runaway with a vertical asymptote, not an adjustable gain; usable avalanche devices sit on the knee, where small bias changes are already large gain changes.](/courses/electronic-devices/figures/m18-avalanche.svg)

### 3.4 Breakdown voltage, doping, and the wide-gap argument

For a one-sided abrupt junction, Poisson's equation gives the peak field at
the junction; setting it to the critical field $\mathcal{E}_c$:

$$
V_{\rm BR}=\frac{\varepsilon\,\mathcal{E}_c^{2}}{2qN},
\qquad
W_{\rm BR}=\frac{2V_{\rm BR}}{\mathcal{E}_c}
$$

![Blocking voltage against drift doping for silicon and silicon carbide: the same 1200 volts is reached with nearly two decades more doping in the wide-gap material, which is the whole power-electronics argument in one chart.](/courses/electronic-devices/figures/m18-breakdown-doping.svg)

Fold in the drift resistance $R_{\rm on}=W/(q\mu N)$ per unit area and
eliminate $N$ and $W$:

$$
\boxed{\;R_{\rm on,sp}=\frac{4V_{\rm BR}^{2}}{\varepsilon\mu\,\mathcal{E}_c^{3}}\;}
$$

The **cube** on $\mathcal{E}_c$ is the entire wide-bandgap industry. Because a
wider gap raises the ionisation threshold, $\mathcal{E}_c$ roughly tracks
$E_g^{2}$, and the figure of merit explodes:

| material | $E_g$ (eV) | $\mathcal{E}_c$ (MV/cm) | $\mu_n$ | $\varepsilon_r$ | FOM vs Si |
|---|---|---|---|---|---|
| Si | 1.12 | 0.3 | 1350 | 11.7 | 1 |
| 4H-SiC | 3.26 | 3.0 | 900 | 9.7 | about 550 |
| GaN | 3.4 | 3.3 | 1200 (2DEG) | 9.0 | about 900 |
| Ga2O3 | 4.8 | 8 (proj.) | 200 | 10 | about 3000 (proj.) |
| diamond | 5.5 | 10 (proj.) | 2000 (holes) | 5.7 | very large (proj.) |

The projected rows are honest: gallium oxide's doping asymmetry (no p-type)
and diamond's substrate problem (module 28) are why the table's bottom is a
research program rather than a catalogue.

### Worked example 3.1 — Si against SiC at 1200 V, end to end

Design the drift region for 1200 V in each material, taking
$\mathcal{E}_c=3\times10^{5}$ and $3\times10^{6}$ V/cm.

Widths: $W=2V/\mathcal{E}_c$ gives **80 µm (Si)** and **8 µm (SiC)**.
Dopings: $N=\varepsilon\mathcal{E}_c^{2}/2qV$ gives
$1.6\times10^{14}\ {\rm cm^{-3}}$ (Si) and $1.2\times10^{16}$ (SiC).
Specific resistances $R=W/(q\mu N)$:

$$
R_{\rm Si}=\frac{80\times10^{-4}}
{1.602\times10^{-19}\times1350\times1.6\times10^{14}}
=231\ {\rm m\Omega\,cm^{2}}
$$

$$
R_{\rm SiC}=\frac{8\times10^{-4}}
{1.602\times10^{-19}\times900\times1.2\times10^{16}}
=0.46\ {\rm m\Omega\,cm^{2}}
$$

A factor of about 500, delivered by one decade of critical field cubed. This
is why a SiC die a tenth the area switches the same bus, and why module 21's
defect economics and module 28's boule growth were worth two decades of pain.

### Worked example 3.2 — avalanche photodiode noise

An APD runs at $M=20$. Excess noise factor (McIntyre):

$$
F=kM+\left(2-\frac{1}{M}\right)(1-k)
$$

Silicon, $k=0.05$: $F=1.0+1.95\times0.95=2.85$. A III-V with $k=0.5$:
$F=10+0.975=10.98$. Same gain, four times the noise power: the coefficient
*ratio* of section 3.2's figure, not the gain, is the material figure of
merit, and it is why silicon owns low-noise avalanche detection at the
wavelengths it can absorb (module 19 set those limits).

### 3.5 Graduate: the three faces of ionisation

One mechanism, three engineering roles, and recognising all three as the same
physics is the point of the section. As a **limit**, avalanche caps every
junction's blocking voltage, with the field-crowding at curved junction edges
(mitigated by guard rings and field plates) usually deciding the real number
10 to 20 percent below the planar ideal. As a **function**, it is the Zener
clamp above about 6 V (true Zener tunnelling below 5 V, avalanche above, the
crossover visible in the sign of the temperature coefficient: avalanche
$V_{\rm BR}$ rises with $T$ as phonons steal ballistic energy, tunnelling
falls); it is the APD's internal gain; and driven past breakdown in Geiger
mode it detects single photons, with the quench circuit, not the diode,
setting the dead time. As a **parasite in ordinary operation**, weak
multiplication at the drain end of a MOSFET generates the substrate current
$I_{\rm sub}\propto I_D\,e^{-B/\mathcal{E}_{\rm max}}$ that serves as the
canonical hot-carrier stress monitor: reliability qualification reads the
device's own avalanche as a thermometer for its distribution tail.

## 4. Problems

**P18.25** A bar 0.5 mm thick carries 10 mA in 0.3 T and shows
$V_H=+2.5$ mV. Type, density, and Hall mobility given
$\rho=0.05\ \Omega\,$cm.

**P18.26** Design an InSb Hall sensor ($\mu=7\times10^{4}\ {\rm cm^{2}/Vs}$,
$n=2\times10^{16}\ {\rm cm^{-3}}$) for 1 V/T at 1 mA: find the required
thickness and comment on its manufacturability.

**P18.27** For the two-carrier formula, show that $R_H=0$ when $p=nb^{2}$ and
find the hole fraction at the null for $b=3$.

**P18.28** A compensated sample has $n=p=10^{15}\ {\rm cm^{-3}}$, $b=3$.
Compare its Hall coefficient with that of an uncompensated p-type sample of
the same $p$, and state the lesson for interpreting "low" Hall signals.

**P18.29** Using the saturation model with $\beta=1$ (holes,
$\mu_0=480$, $v_{\rm sat}=8\times10^{6}$ cm/s), find the field where hole
velocity reaches 90 percent of saturation and compare with the electron case
of worked example 2.1.

**P18.30** From the energy balance with $\tau_E=0.3$ ps, at what field does
silicon's electron temperature reach 600 K ($v_d$ from the $\beta=2$ model)?

**P18.31** A silicon diode has drift doping $10^{15}\ {\rm cm^{-3}}$. Find
$V_{\rm BR}$ and $W_{\rm BR}$, and the doping SiC needs for the same voltage.

**P18.32** An APD's Miller exponent is $n=4$ and $V_{\rm BR}=42$ V. At what
bias is $M=15$, and what gain change follows a 0.1 V supply ripple there?

**P18.33** Using $R_{\rm on,sp}=4V^{2}/\varepsilon\mu\mathcal{E}_c^{3}$,
find the voltage at which SiC's specific on-resistance equals silicon's at
600 V, and interpret.

**P18.34** *(graduate)* Derive $1-1/M=\int\alpha\,dx$ from the two coupled
continuity equations with $\alpha_e=\alpha_h=\alpha$.

**P18.35** *(graduate)* A Corbino disc of GaAs ($\mu=8000\ {\rm cm^{2}/Vs}$)
sits in 1 T. Find the geometric magnetoresistance factor, and the reading for
silicon at the same field.

**P18.36** *(graduate)* Estimate the overshoot advantage: a 40 nm GaAs channel
with carriers at $3\times10^{7}$ cm/s for the first 0.1 ps and $10^{7}$
afterward. What effective velocity does the channel see, and what fraction of
ballistic transport does that represent?

### Answers

**P18.25** Positive $V_H$: holes.
$p=IB/(q|V_H|t)=(10^{-2}\times0.3)/(1.602\times10^{-19}\times2.5\times10^{-3}
\times5\times10^{-4})=1.5\times10^{22}\ {\rm m^{-3}}
=1.5\times10^{16}\ {\rm cm^{-3}}$.
$\mu_H=|R_H|/\rho=1/(pq\rho)=833\ {\rm cm^{2}/Vs}$: high for holes at this
doping, flagging an undivided Hall factor of roughly 1.7 to 1.9 — the
diagnosis, not just the number, is the answer.

**P18.26** $t=I/(nqS)$ with $S=1$ V/T:
$t=10^{-3}/(2\times10^{22}\times1.602\times10^{-19}\times1)
=0.31\ {\rm \mu m}$. A submicron InSb epilayer: exactly how high-sensitivity
sensors are built (thin epitaxial InSb on GaAs), and unreachable with bulk
material, tying sensor performance directly to module 30's epitaxy.

**P18.27** Numerator $p-nb^{2}=0$ at $p=nb^{2}$. With $n+p$ fixed the null
sits at hole fraction $p/(n+p)=b^{2}/(1+b^{2})=0.9$: a sample **90 percent
holes by count reads zero** because each electron carries nine times the Hall
weight. Carrier counting by Hall is mobility-weighted democracy.

**P18.28** Compensated: $R_H\propto(p-nb^{2})/(p+nb)^{2}
=(1-9)/(4)^{2}\times1/p=-0.5/p$: *negative* despite equal populations, and
half the one-carrier magnitude. The uncompensated p-type sample reads $+1/p$.
Lesson: a small or sign-surprising Hall coefficient may mean compensation, not
low doping; the resistivity, which adds rather than subtracts the two
channels, breaks the degeneracy between the readings.

**P18.29** $\beta=1$: $v=\mu\mathcal{E}/(1+\mu\mathcal{E}/v_{\rm sat})$;
$v/v_{\rm sat}=0.9$ requires $\mu\mathcal{E}/v_{\rm sat}=9$, so
$\mathcal{E}=9\times8\times10^{6}/480=1.5\times10^{5}$ V/cm: forty times the
electron figure from worked example 2.1 by this 90 percent criterion. The
$\beta=1$ curve approaches saturation with a long lazy tail, so holes spend a
huge field range in the intermediate regime: one reason p-channel devices gain
less from velocity effects and PMOS sizing stays generous.

**P18.30** Need $T_e-T_L=300$ K:
$e\mathcal{E}v_d=\tfrac{3}{2}k_B\times300/\tau_E
=\tfrac{3}{2}\times1.381\times10^{-23}\times300/3\times10^{-13}
=2.07\times10^{-8}$ W. Try $\mathcal{E}=10^{4}$ V/cm $=10^{6}$ V/m:
$v_d=8.04\times10^{4}$ m/s (from worked example 2.1's arithmetic), product
$=1.602\times10^{-19}\times10^{6}\times8.04\times10^{4}=1.29\times10^{-8}$:
slightly low. $\mathcal{E}=1.3\times10^{4}$ V/cm gives
$v_d\approx9.0\times10^{4}$ m/s and product $2.2\times10^{-8}$: crossing near
$\mathcal{E}\approx1.25\times10^{4}$ V/cm. Doubling the carrier temperature
takes only about 1.3 V across a micrometre: "hot" arrives early.

**P18.31** $V_{\rm BR}=\varepsilon\mathcal{E}_c^{2}/2qN
=(11.7\times8.854\times10^{-12}\times(3\times10^{7})^{2})
/(2\times1.602\times10^{-19}\times10^{21})=291$ V;
$W=2V/\mathcal{E}_c=19.4\ {\rm \mu m}$. SiC for 291 V:
$N=\varepsilon\mathcal{E}_c^{2}/2qV
=(9.7\times8.854\times10^{-12}\times9\times10^{16})
/(2\times1.602\times10^{-19}\times291)=8.3\times10^{16}\ {\rm cm^{-3}}$:
eighty-three times silicon's, the figure's two-decade gap read at one voltage.

**P18.32** $M=15$: $1-(V/V_{\rm BR})^{4}=1/15$, so
$(V/V_{\rm BR})=(14/15)^{1/4}=0.9829$, $V=41.28$ V. Sensitivity:
$dM/dV=nM^{2}(V/V_{\rm BR})^{n-1}/V_{\rm BR}
=4\times225\times0.949/42=20.3$ per volt, so 0.1 V of ripple swings the gain
by about 2 out of 15: **13 percent**. Avalanche gain rides the knee, and APD
bias supplies are precision, temperature-compensated circuits for exactly
this reason.

**P18.33** Equate $4V_{\rm SiC}^{2}/(\varepsilon\mu\mathcal{E}_c^{3})_{\rm SiC}
=4\times600^{2}/(\varepsilon\mu\mathcal{E}_c^{3})_{\rm Si}$:
$V_{\rm SiC}=600\sqrt{550}\approx14\ {\rm kV}$. A silicon-cost drift region in
SiC serves fourteen kilovolts: the number behind SiC's march into grid-scale
and traction converters, and the honest caveat is that substrate and
periphery, not drift resistance, dominate cost at those ratings.

**P18.34** With equal $\alpha$: $dJ_n/dx=\alpha(J_n+J_p)$ and
$-dJ_p/dx=\alpha(J_n+J_p)$; adding gives $d(J_n+J_p)/dx=0$, total $J$
constant. Then $dJ_n/dx=\alpha J$ integrates to
$J_n(W)-J_n(0)=J\int\alpha\,dx$. Injecting electrons only,
$J_n(0)=J/M$ and $J_n(W)=J$: divide by $J$ and rearrange into
$1-1/M=\int_0^W\alpha\,dx$. Breakdown as a boundary-value statement: the
integral reaching unity, no infinities handled anywhere.

**P18.35** Corbino factor $1+(\mu B)^{2}$: GaAs, $\mu B=0.8$, factor
**1.64**; silicon, $\mu B=0.135$, factor 1.018. The $\mu^{2}$ scaling in one
comparison: 64 percent versus 2 percent from the same field, and why
geometric-magnetoresistance devices are a III-V monopoly (module 50 pushes
this to InSb, $\mu B=7$ at the same tesla, factor 50).

**P18.36** Transit: first 0.1 ps covers
$3\times10^{5}\ {\rm m/s}\times10^{-13}=30$ nm; the remaining 10 nm at
$10^{5}$ m/s takes a further 0.1 ps. Total 0.2 ps for 40 nm: effective
velocity $2\times10^{7}$ cm/s, double the steady-state saturation. Against
the ballistic bound (thermal injection velocity roughly
$4\times10^{7}$ cm/s), the channel is running at about half ballistic:
overshoot has bought back half the gap between diffusive and ballistic, which
is roughly where the best short III-V devices actually sit and why lesson 4's
Landauer accounting, not mobility, is the right frame at this scale.

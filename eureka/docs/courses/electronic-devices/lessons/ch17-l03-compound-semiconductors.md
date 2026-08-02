# Compound Semiconductors: the Jobs Silicon Cannot Do

<!-- covers: 17.3 -->

Combine a group III element with a group V (or II with VI) and the resulting
semiconductor trades silicon's system advantages for properties silicon
cannot reach at any price: direct gaps that emit light, gaps tunable by
composition, electrons several times faster, and critical fields ten times
higher. This lesson maps the estate, derives the tuning rules, and prices the
tickets.

**Level.** Sections 1 to 4 undergraduate core; section 5 graduate extension;
section 6 problems.

## 1. The estate map

### 1.1 Reading the bandgap-lattice chart

Two coordinates organise the entire III-V world: the lattice constant, which
decides *what you can grow on* (module 30's epitaxy), and the bandgap, which
decides *what the electrons can do*.

![The estate map, plotted from published lattice constants and gaps. Substrates pin you to a vertical line; alloys walk the dashed ties; filled symbols emit, open ones do not. Every optoelectronic product is an address on this chart.](/courses/electronic-devices/figures/m17-bandgap-lattice.svg)

The commercial substrates are few: GaAs, InP, GaSb, and (for the nitrides,
which lattice-match nothing common) sapphire, SiC or silicon carried as
foreign hosts. A device design is therefore a *column* on this map: pick the
substrate line, then choose alloys along it. In$_{0.53}$Ga$_{0.47}$As exists
as a named composition for exactly one reason: it is where the InGaAs tie
crosses the InP vertical.

### 1.2 Alloy tuning: Vegard plus bowing

Within an alloy $A_xB_{1-x}C$, the lattice constant interpolates linearly
(Vegard's law), while the gap bows:

$$
a(x)=xa_A+(1-x)a_B,
\qquad
E_g(x)=xE_A+(1-x)E_B-b\,x(1-x)
$$

with the bowing parameter $b$ again riding on the $x(1-x)$ disorder variance
that ran through module 18.

![Two working alloys computed from the rule: InGaN spans the entire visible from one material system, while AlGaAs runs into the indirect X valley at 45 percent aluminium, a ceiling every red-emitter designer knows by heart.](/courses/electronic-devices/figures/m17-vegard-bowing.svg)

### Worked example 1.1 — designing a green emitter's composition

Target 530 nm: $E_g=1240/530=2.34$ eV. Solve the InGaN curve
$2.34=0.7x+3.4(1-x)-1.4x(1-x)$: $1.4x^{2}-4.1x+1.06=0$,
$x=(4.1-\sqrt{16.81-5.94})/2.8=(4.1-3.30)/2.8=0.286$. About 29 percent
indium: and module 32 explains why exactly this range (indium segregation,
strain from the 11 percent InN-GaN mismatch) makes green the hardest LED:
the "green gap" is this worked example colliding with materials reality.

### Worked example 1.2 — lattice matching as simultaneous equations

Which In$_x$Ga$_{1-x}$As matches InP? Vegard:
$x\,a_{\rm InAs}+(1-x)a_{\rm GaAs}=a_{\rm InP}$:
$x(6.058)+(1-x)(5.653)=5.869$: $x=0.216/0.405=0.533$. The gap there, with
$b=0.477$: $E=0.533(0.35)+0.467(1.42)-0.477(0.533)(0.467)=0.187+0.663-0.119
=0.73$ eV: cutting off near 1.7 µm: the standard of long-haul photodetection,
derived in four lines from two linear rules.

## 2. Direct gaps: emission and absorption

### 2.1 The momentum rule

In a direct-gap material, the conduction minimum and valence maximum share
crystal momentum: a photon (momentum ≈ 0 on the zone scale) can connect them
alone. In silicon and germanium the minima sit at different $k$: a phonon
must join, making both absorption near the edge and emission second-order
processes.

$$
\alpha_{\rm direct}\propto\sqrt{E-E_g},
\qquad
\alpha_{\rm indirect}\propto(E-E_g)^{2}
$$

![Computed edges: at one hundred millielectronvolts above the gap the direct absorber is two orders stronger. The dotted line marks where a one-micrometre film absorbs well, which direct materials reach almost immediately.](/courses/electronic-devices/figures/m17-absorption-direct-indirect.svg)

### 2.2 Emission is a race between clocks

Internal quantum efficiency is the branching ratio between radiative and
nonradiative decay:

$$
\boxed{\;\eta_{\rm IQE}=\frac{1/\tau_r}{1/\tau_r+1/\tau_{nr}}
=\frac{\tau_{nr}}{\tau_r+\tau_{nr}}\;}
$$

![The efficiency curve with the two champions placed on it: a direct-gap quantum well's nanosecond radiative clock forgives ordinary material, while silicon's millisecond clock loses the race to any defect in the crystal.](/courses/electronic-devices/figures/m17-radiative-efficiency.svg)

Direct materials: $\tau_r\sim1$ to 10 ns, so even $\tau_{nr}$ of 100 ns
(defect-rich material) yields $\eta>90$ percent. Silicon:
$\tau_r\sim$ milliseconds, so with the best-ever $\tau_{nr}$ of a few
milliseconds, $\eta$ struggles past a few percent, and in device-grade
material sits near $10^{-4}$. **The indirect gap is not a small handicap; it
is four orders of magnitude**, and it is why "silicon photonics" means
silicon waveguides with III-V light sources bonded on (module 38's Ge
detectors handle the receiving side).

### Worked example 2.1 — how bad material can a direct gap carry?

An LED requires $\eta_{\rm IQE}\ge70$ percent with $\tau_r=2$ ns. Required
$\tau_{nr}\ge\tau_r\,\eta/(1-\eta)=2\times0.7/0.3=4.7$ ns. Via
$\tau_{nr}=(\sigma v_{th}N_t)^{-1}$ with $\sigma=10^{-15}$ cm2,
$v_{th}=10^{7}$ cm/s: $N_t\le1/(10^{-15}\times10^{7}\times4.7\times10^{-9})
=2.1\times10^{16}\ {\rm cm^{-3}}$: a *huge* tolerable defect density
(compare module 22's lifetime-killer thresholds of $10^{11}$ for silicon
solar cells). This forgiving arithmetic is how GaN LEDs shipped with
$10^{8}$ dislocations per cm2 (module 32): the direct gap's fast clock
covers a multitude of sins: the deep reason optoelectronics tolerated
heteroepitaxy that logic never could.

### 2.3 Haitz's law: the LED's own Moore curve

Optoelectronic scaling had its own compounding rule: flux per package up
20x per decade, cost per lumen down 10x per decade:

$$
\Phi(t)=\Phi_0\,20^{(t-t_0)/10},\qquad C_\ell(t)=C_0\,10^{-(t-t_0)/10}
$$

![Haitz's law computed as its two stated exponentials: fifty years of compounding took the LED from indicator lamp to the dominant light source on earth, the clearest Wright curve outside logic.](/courses/electronic-devices/figures/m17-haitz.svg)

The mechanism differs from Moore's (efficiency gains, extraction optics,
current density, and lesson 1's Wright learning rather than lithographic
shrink), but the lesson transfers: **a compounding technology annihilates a
static incumbent on a schedule you can read off the slope**: incandescent
lighting's fate was computable a decade early.

## 3. Speed and power: the transport dividends

Module 18 built the physics; here is where it cashes out by material.

- **Mobility and heterostructures.** GaAs electrons at 8500 and the
  modulation-doped 2DEG (module 18 lesson 4) built the HEMT that owns
  low-noise microwave reception.
- **Velocity and the Johnson limit.** A transistor's power-frequency product
  is bounded by material constants alone:

$$
\boxed{\;P f^{2}\ \text{bounded by}\ \left(\frac{\mathcal{E}_cv_{\rm sat}}{2\pi}\right)^{2}\;}
$$

![The Johnson limit relative to silicon: the nitrides and carbides sit two to three hundred times higher, which is the single-number explanation of the GaN RF power amplifier and the SiC traction inverter.](/courses/electronic-devices/figures/m17-johnson.svg)

- **The critical-field cube.** Module 18 lesson 3 derived
  $R_{\rm on,sp}=4V^{2}/\varepsilon\mu\mathcal{E}_c^{3}$: SiC's 550x and
  GaN's 900x over silicon are the power-electronics estate deeds.

### Worked example 3.1 — choosing a PA material by the limit

A base-station amplifier: 100 W at 3.5 GHz. Johnson says $\sqrt{P}f$ is the
bounded combination: demand $\sqrt{100}\times3.5=35$ (GHz W$^{1/2}$
units). Silicon LDMOS delivers of order 5 to 10 on this scale (why it
dominated *below* 3 GHz); GaAs manages 3x silicon: marginal; GaN's 90x
headroom makes the part routine, running hot on a SiC substrate for the
thermal lollipop's reasons (lesson 2). One inequality, one procurement
decision: and the reason every 5G mast contains gallium nitride.

## 4. The tickets: what compounds pay

The systematic costs, each expanded elsewhere in the course:

1. **No native oxide worth having**: interface war, module 24; the MOS
   deficit of lesson 2's worked example 2.1.
2. **Substrates small, dear, fragile**: lesson 2's ladder; semi-insulating
   GaAs is the one substrate *bonus* (module 28).
3. **Stoichiometry as a second composition axis**: the group V overpressure
   problem, native defects as dopants: module 22 and module 32.
4. **Heat**: the thermal lollipop: GaAs at a third of silicon; the standard
   fix (GaN-on-SiC) is itself a heterostructure story.
5. **Heteroepitaxy's rent**: mismatch strain relaxes by dislocations beyond
   a critical thickness given by the Matthews-Blakeslee balance:

$$
h_c\approx\frac{b}{8\pi f}\left[\ln\frac{h_c}{b}+1\right]
$$

![The critical-thickness curve, solved from the force balance: at two percent misfit you may grow tens of nanometres coherently; at the nitride-on-silicon four percent you may grow almost nothing, and every micrometre beyond is bought with dislocation engineering.](/courses/electronic-devices/figures/m17-hetero-lever.svg)

The division of labour that fell out is stable: **silicon does logic, memory
and analogue volume; compounds do photons, microwaves and megawatts**; and
the frontier product is the *hybrid*: III-V lasers bonded to silicon
waveguides, GaN grown on silicon substrates, SiGe inside CMOS: each one a
treaty between the estate map and lesson 1's economics.

## 5. Graduate extension: three deeper reads of the map

**Band offsets, not just gaps.** Heterostructure design needs where the bands
*align*, not only their separations: the conduction and valence offsets at
each junction (module 24's branch-point framework predicts them) decide
carrier confinement. GaAs/AlGaAs splits its offset roughly 65:35
conduction:valence: fortunate for electron confinement, and part of why that
system became the drosophila of quantum heterostructures (module 18's 2DEG).

**The nitride anomaly.** Wurtzite nitrides carry spontaneous and
piezoelectric polarization along the growth axis: fields of MV/cm inside
unbiased wells. Consequences both ways: polarization-induced 2DEGs with no
doping (the GaN HEMT's channel), and the quantum-confined Stark effect that
tilts LED wells, separating electrons from holes and cutting $\eta$ exactly
where worked example 1.1's indium fractions operate: the green gap's second
cause. No cubic-semiconductor intuition survives contact with the nitrides
unmodified.

**Metastable estates.** The map drawn is the *equilibrium* estate.
Non-equilibrium growth (module 30's MBE at low temperature) annexes
territory: strained films below $h_c$, dilute nitrides and bismides
(module 39) where a few percent of a mismatched atom bends bands by hundreds
of meV, digital alloys and superlattices whose effective gaps sit off every
tie line (module 31's type-II detectors). Reading module 39 and 31 as
"colonising the forbidden parts of this chart" is the right frame for both.

## 5b. The estate's frontier provinces

Three territories on the map deserve a forward pointer, because later
modules annex them, and the framing here is what makes those later
modules legible.

**The ultra-wide-gap frontier.** Beyond GaN sit Ga2O3 (4.8 eV) and AlN
(6.2 eV) and diamond (5.5 eV): critical fields projected at 8 to 12 MV/cm,
hence figure-of-merit multiples in the thousands. Each carries a
disqualifying asymmetry so far: Ga2O3 has no usable p-type (its flat valence
band localises holes: module 56 meets the same oxide-valence physics),
diamond's dopants are too deep (lesson 2's problem P17.12), and AlN barely
dopes at all. The estate lesson: **a transistor needs both carriers
manageable, or a design that needs only one**: which is why Ga2O3's first
commercial beachhead is unipolar (Schottky rectifiers), a device choice
made by a band structure.

**The two-dimensional annex.** The transition-metal dichalcogenides put a
direct gap in a three-atom-thick sheet: an estate not on this map because
its "lattice constant" constraint dissolves (van der Waals stacking needs
no matching). Modules 48 and 49 price the annex: extraordinary
electrostatics, contact and growth problems that lesson 2's system test
flags on sight.

**The metastable colonies.** Lesson 5's graduate note already framed dilute
nitrides, bismides (module 39) and strained films as territory held against
equilibrium. The general permit: growth far from equilibrium (module 30's
low-temperature MBE) can occupy compositions the phase diagram forbids, for
as long as the thermal budget respects the occupation. Every such colony
trades stability margin for a property the equilibrium map cannot supply:
and module 22's diffusion clocks are the rent collector. Reading a novel
materials paper begins with locating it on this map and asking which of the
three provinces it claims, and what rent it has agreed to pay.

## 6. Problems

**P17.16** From the map's endpoints, find the Al$_x$Ga$_{1-x}$As composition
with $E_g=1.80$ eV (b ≈ 0 for the direct branch) and verify it is below the
crossover of the figure.

**P17.17** Which In$_x$Al$_{1-x}$As matches InP
($a_{\rm AlAs}=5.661$ A)? Compare with worked example 1.2's InGaAs and note
what the pair enables.

**P17.18** A quantum well's radiative lifetime is 1.5 ns. What nonradiative
lifetime keeps droop-free $\eta$ above 90 percent, and what defect density
does that allow ($\sigma=10^{-15}$ cm2, $v_{th}=10^{7}$ cm/s)?

**P17.19** Using Haitz exponentials, from 100 lm/package and 1.00 per klm in
2010, project 2030 flux and cost, and state one physical ceiling the
projection must eventually hit.

**P17.20** From the Johnson lollipop, estimate the frequency at which a
25 W GaN device runs out of headroom if silicon's limit corresponds to 5 W
at 4 GHz.

**P17.21** Evaluate $h_c$ for 1 percent misfit ($b=0.4$ nm) by iterating the
Matthews-Blakeslee relation twice from $h=10$ nm, and state what a device
designer does with a layer that must exceed it.

**P17.22** *(graduate)* GaAs/Al$_{0.3}$Ga$_{0.7}$As: gap difference
$\approx0.374$ eV split 65:35. A 10 nm GaAs well: estimate the electron
ground-state energy (infinite-well first pass, $m^{*}=0.067m_0$) and check
the finite barrier renders it bound.

**P17.23** *(graduate)* The nitride well of worked example 1.1 sees a 2
MV/cm polarization field. Estimate the electron-hole separation it induces
in a 3 nm well and the fractional overlap cost, and connect to the "grow on
nonpolar planes" research direction.

### Answers

**P17.16** $1.80=1.42+1.25x$: $x=0.304<0.45$: direct, as the figure
requires: the composition of the classic 690 nm laser family.

**P17.17** $x(6.058)+(1-x)(5.661)=5.869$: $x=0.208/0.397=0.524$:
In$_{0.52}$Al$_{0.48}$As. Same substrate as In$_{0.53}$Ga$_{0.47}$As: a
lattice-matched *pair* with a large conduction offset: the InP HEMT's
barrier/channel, the fastest low-noise transistors made: two compositions,
one vertical line, one product.

**P17.18** $\tau_{nr}\ge1.5\times0.9/0.1=13.5$ ns;
$N_t\le1/(10^{-15}\times10^{7}\times1.35\times10^{-8})=7.4\times10^{15}
\ {\rm cm^{-3}}$: still enormous by silicon-lifetime standards: the direct
gap's grace, quantified again.

**P17.19** Flux: $100\times20^{2}=4\times10^{4}$ lm; cost:
$1.00\times10^{-2}$ per klm. Ceilings: source efficacy is bounded near
300-350 lm/W by the lumen definition itself (photopic curve), so the flux
exponential must hand over from efficiency gains to sheer package power:
compounding laws end at conservation laws, the module's closing moral.

**P17.20** Johnson: $\sqrt{P}f=$ const per material. Silicon:
$\sqrt5\times4=8.9$. GaN at 90x silicon's limit: 805. At 25 W:
$f=805/\sqrt{25}=161$ GHz: milimetre-wave power amplification is inside
GaN's estate, which is exactly where 6G component research is digging.

**P17.21** $f=0.01$: first pass
$h=(0.4/(8\pi\times0.01))(\ln(10/0.4)+1)=1.59\times(3.22+1)=6.7$ nm;
second pass with $h=6.7$: $1.59\times(2.82+1)=6.1$ nm: converged near 6 nm.
A thicker requirement forces one of: reduce misfit (change composition),
accept and manage dislocations (module 32's LED bargain), or
strain-partition with a graded/buffer scheme (module 38's virtual
substrates): the three standard escapes, each a later module.

**P17.22** Offset: $0.65\times0.374=0.243$ eV barrier. Infinite well:
$E_1=\hbar^{2}\pi^{2}/2m^{*}L^{2}=(1.055\times10^{-34})^{2}\pi^{2}
/(2\times6.1\times10^{-32}\times10^{-16})=56$ meV: well below the 243 meV
barrier, so bound with margin; the finite-well correction lowers it toward
~40 meV: consistent with module 18's triangular-well arithmetic in spirit,
and the number behind every "quantum well at 850 nm" datasheet.

**P17.23** Potential drop $=2\times10^{6}\times3\times10^{-7}$ V/cm x cm
$=0.6$ V across 3 nm: far exceeding the confinement energies: carriers slam
to opposite interfaces, separated by nearly the full 3 nm. Overlap of
ground states falls roughly as the exponential of the tilt: order-of-
magnitude reductions in $1/\tau_r$: emission slows exactly as section 2.2's
race is being run: hence droop-prone green LEDs, and hence the nonpolar/
semipolar growth programme, which rotates the crystal so the polarization
axis leaves the growth direction: module 32 carries the story.

# Absorption Processes: Reading a Spectrum Mechanism by Mechanism

<!-- covers: 19.3 -->

An absorption spectrum is a list of every way a material can take energy from
light, each mechanism owning its spectral region and each carrying different
information. This lesson walks the list from the band edge outward, because
reading a spectrum is the fastest materials diagnosis this course teaches.

**Level.** Sections 1 to 5 undergraduate; section 6 graduate; section 7
problems.

## 1. Interband absorption: the edge and its two shapes

Above the gap, a photon promotes a valence electron. Momentum conservation
splits the world in two (module 17 introduced it; here is the working form):

$$
\alpha_{\rm dir}=A\sqrt{E-E_g},
\qquad
\alpha_{\rm ind}=B\,(E-E_g\pm\hbar\Omega)^{2}
$$

the indirect form summing phonon-absorption and phonon-emission branches.
The measurement practice linearises each:

![Extraction as actually performed: the direct material plotted as alpha squared, the indirect as root alpha, each extrapolated to its intercept. Using the wrong plot on the wrong material yields a confidently wrong gap.](/courses/electronic-devices/figures/m19-tauc-plots.svg)

### Worked example 1.1 — a gap from four transmission points

A 1 µm direct-gap film on glass transmits (corrected for reflection) 78, 45,
18 and 6 percent at 1.44, 1.48, 1.52 and 1.56 eV. Extract $E_g$.

$\alpha=-\ln T/d$: 2.48, 8.0, 17.1, $28.1\times10^{3}\ {\rm cm^{-1}}$.
$\alpha^{2}$ ($10^{8}$ units): 0.062, 0.64, 2.93, 7.90. Fit the last three
(the first sits in the tail): slope
$(7.90-0.64)/0.08=90.8$ per eV; intercept from the 1.56 point:
$E_g=1.56-7.90/90.8=1.473$ eV. Four transmission readings, a gap to
$\pm10$ meV: the cheapest band-structure measurement in existence, and the
tail-point exclusion is the skill (the Urbach region below must not enter a
Tauc fit).

### Worked example 1.2 — thickness follows from the same physics

How thick must an absorber be for 95 percent absorption 60 meV above its
edge, direct ($A=8\times10^{3}$ in cm-eV units) versus indirect
($B=3.5\times10^{3}$)? Direct:
$\alpha=8\times10^{3}\sqrt{0.06}=1.96\times10^{3}$; $d=\ln20/\alpha=15.3$
µm... recheck: $\ln20=3.0$: $d=1.53\times10^{-3}$ cm $=15\ {\rm \mu m}$.
Indirect: $\alpha=3.5\times10^{3}\times0.0036=12.6\ {\rm cm^{-1}}$:
$d=2.4$ mm. **Micrometres against millimetres**: module 17's thin-film-
versus-wafer solar divide, recomputed from the edge exponents.

## 2. Excitons: the electron-hole atom at the edge

The photoexcited electron and hole attract; hydrogen-like bound states form
just below the gap with binding energy

$$
E_X=\frac{\mu^{*}e^{4}}{2(4\pi\varepsilon)^{2}\hbar^{2}}
=13.6\ {\rm eV}\times\frac{\mu^{*}/m_0}{\varepsilon_r^{2}}
$$

![The edge with its exciton line, cold and warm. At ten kelvin the line is a spectroscopic ruler; at room temperature in a bulk semiconductor it survives only as a shoulder, unless confinement or low screening raises the binding.](/courses/electronic-devices/figures/m19-exciton-edge.svg)

GaAs: $\mu^{*}\approx0.058$, $\varepsilon_r=12.9$: $E_X\approx4.7$ meV:
melted by room-temperature $k_BT$. GaN: 26 meV: marginal. Organic
semiconductors and 2D materials, with low screening: hundreds of meV:
excitons *are* their optics, the fact module 52 built its whole device
architecture on. One formula sorts three material families' photophysics.

## 3. Below the edge: the tail that measures disorder

Real edges decay exponentially into the gap:

$$
\alpha=\alpha_0\,e^{(E-E_g)/E_U}
$$

![Two networks, two Urbach slopes on the semilog axis. The tail energy is read straight off the plot, and it is the standard single-number disorder metric for every amorphous film in this course.](/courses/electronic-devices/figures/m19-urbach-tail.svg)

The **Urbach energy** $E_U$ collects static disorder and thermal disorder in
one slope: 8 to 10 meV in crystalline GaAs, about 50 meV in device-grade
a-Si:H, 100+ in poor networks: module 40 uses it as its quality axis, and a
photovoltaic rule of thumb prices every meV of tail energy in open-circuit
voltage. Below the tail, deep-state absorption flattens the spectrum at
levels only lesson 4's sub-gap methods can reach.

## 4. Free carriers: the Drude tail read optically

Module 18's AC conductivity, inserted into the dielectric function, gives
absorption growing toward long wavelength:

$$
\alpha_{fc}\approx\frac{ne^{2}\lambda^{2}}{4\pi^{2}\varepsilon_0nc^{3}m^{*2}\mu}
\ \propto\ \frac{n\,\lambda^{2}}{\mu}
$$

![The n-lambda-squared law at three dopings: contact layers and substrates that are perfectly transparent in the visible are stone opaque in the mid-infrared.](/courses/electronic-devices/figures/m19-free-carrier.svg)

and at the **plasma frequency** the free-carrier response crosses from
transmitting to reflecting:

$$
\omega_p^{2}=\frac{ne^{2}}{\varepsilon_0\varepsilon_\infty m^{*}}
$$

![The reflectance edge marching with carrier density. Parking this edge just beyond the red is the entire design brief of a transparent conductor, and reading the edge position is a contactless carrier-density measurement.](/courses/electronic-devices/figures/m19-plasma-edge.svg)

### Worked example 4.1 — carrier density without contacts

A doped oxide film's reflectance minimum sits at 1.35 µm
($\varepsilon_\infty=3.8$, $m^{*}=0.3m_0$). Density?

$$
\omega_p=\frac{2\pi c}{\lambda_p}=1.40\times10^{15}\ {\rm rad/s}
$$

$$
n=\frac{\varepsilon_0\varepsilon_\infty m^{*}\omega_p^{2}}{e^{2}}
=\frac{8.85\times10^{-12}\times3.8\times2.73\times10^{-31}
\times1.95\times10^{30}}{2.57\times10^{-38}}
=7.0\times10^{26}\ {\rm m^{-3}}=7\times10^{20}\ {\rm cm^{-3}}
$$

Module 18's Hall measurement, replaced by a reflectance dip: the standard
production monitor for transparent-conductor lines (module 56), and the
cross-check that catches a Hall-geometry error from across the room.

## 5. The lattice: reststrahlen and the multiphonon wall

In polar crystals the light couples directly to optical phonons. The
factorised dielectric function

$$
\varepsilon(\omega)=\varepsilon_\infty
\frac{\omega_{LO}^{2}-\omega^{2}-i\gamma\omega}
{\omega_{TO}^{2}-\omega^{2}-i\gamma\omega}
$$

is negative between $\omega_{TO}$ and $\omega_{LO}$: no propagating wave:
near-total reflection:

![The reststrahlen band computed from the factorised form: between its two phonon frequencies a polar crystal is a mirror. The band edges hand you both phonon energies and, through the LST relation, the dielectric-constant ratio.](/courses/electronic-devices/figures/m19-reststrahlen.svg)

with the Lyddane-Sachs-Teller relation tying the ends to the statics:

$$
\frac{\omega_{LO}^{2}}{\omega_{TO}^{2}}
=\frac{\varepsilon(0)}{\varepsilon_\infty}
$$

Beyond the one-phonon band, combinations of phonons absorb: the
**multiphonon edge** whose exponential wall closes every transparency window
from the red side:

![Two windows walled by the same physics: the electronic edge on the left, the multiphonon edge on the right. Heavier atoms lower the phonon frequencies and push the right wall outward, dragging the left wall inward with the smaller gap: the window slides, never widens for free.](/courses/electronic-devices/figures/m19-transparency-window.svg)

This one figure is lesson 5's material-selection chart in embryo: silica for
the visible and near-IR, heavier chalcogenides and salts for the thermal
infrared, nothing for everywhere.

## 5b. Absorption budgets: the ledger a device runs on

Every optical device is an allocation of incident photons among the
mechanisms of this lesson, and writing the ledger explicitly is how
designs are audited. For a photodetector at its working wavelength:

$$
1=R+A_{\rm useful}+A_{\rm fc}+A_{\rm defect}+T_{\rm through}
$$

: reflection (lesson 1's tax, refundable by coating), interband absorption
in the collection region (the only revenue line), free-carrier absorption
in doped access layers (pure loss, growing as $n\lambda^{2}$), sub-gap
defect absorption (loss now, reliability signal always), and transmission
out the back (refundable by lesson 6's mirrors and trapping).

The audit discipline: **each line item has its own wavelength dependence,
so a spectral response curve decomposes the ledger.** A responsivity that
falls at long wavelength faster than the edge predicts indicts back-surface
loss or thin collection; a short-wavelength deficit indicts surface
recombination (the penetration-depth figure of lesson 1: blue photons die
where the surface is); a mid-band dip matching a doped layer's
$n\lambda^{2}$ curve prices that layer's thickness. Reading a quantum-
efficiency spectrum line by line against this ledger is the optical
equivalent of module 18's mobility decomposition, and it converts "the
detector is 12 percent below plan" into "the p-plus contact layer is
80 nanometres too thick": a sentence a fab can act on.

The same ledger, reversed by reciprocity, prices emitters: every parasitic
absorber in an LED's photon path appears twice, once absorbing the light
on its way out and once (lesson 7) as a thermal emitter degrading
contrast: which is why extraction engineering and absorption budgeting are
one exercise, and why the modules ahead (31's detectors, 41's cells,
56's transparent contacts) each carry a version of this equation as their
opening line.

## 6. Graduate extension: what the edge does under bias and doping

**Burstein-Moss shift.** Degenerate doping fills the band edge; absorption
must promote to empty states above $E_F$, so the *optical* gap blueshifts
by roughly $E_F(n)$: doped transparent oxides transmit further into the
blue than their chemistry suggests, and an absorption edge in a doped film
is not the material's gap until the filling is subtracted (module 56 trades
on this daily).

**Franz-Keldysh effect.** A strong field tilts the bands; wavefunctions
tunnel into the gap and the edge grows a field-dependent exponential tail
plus oscillations above: electro-absorption, the mechanism of one modulator
family and a below-edge photocurrent route in high-field regions of devices
(module 18's hot-carrier territory, read optically).

**Bandgap narrowing and temperature.** The edge redshifts with temperature
(Varshni behaviour, module 17's laser problem) and with heavy doping
(module 37's silicon numbers): three separate effects: filling, field,
many-body narrowing: all move "the edge", and a measured shift is
uninterpretable until the operative one is identified. The audit habit
applies to spectra too.

## 7. Problems

**P19.13** A film's Tauc plot in $\sqrt{\alpha}$ is linear from 1.2 to 1.5
eV intercepting 1.05 eV, and a plot in $\alpha^{2}$ over the same data is
convincingly linear too, intercepting 1.24 eV. Which gap is right, and what
single further measurement settles it?

**P19.14** Compute the exciton binding and Bohr radius
($a_X=0.053\ {\rm nm}\times\varepsilon_r/(\mu^{*}/m_0)$) for GaN
($\mu^{*}=0.15$, $\varepsilon_r=8.9$) and for a monolayer semiconductor
with $\mu^{*}=0.25$, effective $\varepsilon_r\approx4$; comment.

**P19.15** An a-Si:H cell's Urbach energy degrades from 48 to 60 meV under
light soaking. Using the rule that sub-gap tail states cost open-circuit
voltage roughly in proportion, estimate the fractional loss if tail-state
density scales as $e^{-E/E_U}$ integrated over the lower half-gap.

**P19.16** A silicon wafer doped $5\times10^{19}\ {\rm cm^{-3}}$ must pass a
through-wafer optical inspection at 1.3 µm (675 µm thick). Using the
free-carrier scaling with the figure's $10^{19}$ curve reading
$\alpha\approx40\ {\rm cm^{-1}}$ at 1.3 µm... estimate transmission and
verdict.

**P19.17** From LST with $\varepsilon(0)=12.1$, $\varepsilon_\infty=9.6$ and
$\omega_{TO}$ at 269 cm$^{-1}$, find $\omega_{LO}$ and the reststrahlen
band edges of this GaAs-like crystal.

**P19.18** *(graduate)* Derive the Burstein-Moss shift for a parabolic band:
show the optical edge sits at
$E_g+ (1+m_e^{*}/m_h^{*})E_F$ and evaluate for the worked example 4.1
oxide ($E_F$ from module 18's degenerate formula, $m_h\gg m_e$).

### Answers

**P19.13** Over a narrow range both linearisations can fool the eye: the
discriminator is the magnitude and reach of $\alpha$: direct edges reach
$10^{4}\ {\rm cm^{-1}}$ within tens of meV, indirect take hundreds. One
absolute-$\alpha$ point 0.1 eV above each candidate gap settles it; better,
lesson 4's photoluminescence: a strong edge PL says direct. Fitting
protocols do not replace mechanisms.

**P19.14** GaN: $E_X=13.6\times0.15/79.2=25.8$ meV; $a_X=0.053\times8.9/
0.15=3.1$ nm. Monolayer: $E_X=13.6\times0.25/16=212$ meV, $a_X=0.85$ nm:
room temperature is irrelevant to it: 2D optics is exciton optics, and the
$1/\varepsilon^{2}$ leverage (weak screening out of plane) is the whole
cause: one formula, the qualitative gulf between modules 32 and 49.

**P19.15** Tail density $\propto\int e^{-E/E_U}dE\propto E_U$: a
60/48 = 1.25x tail population: recombination through tails up ~25 percent:
$V_{oc}$ down by roughly $k_BT\ln(1.25)\approx6$ mV per diode ideality
unit: percent-scale efficiency loss from 12 meV of slope: why module 40
treats $E_U$ as a headline metric and light-soak stability reports quote
it.

**P19.16** Scaling $\propto n$: $\alpha\approx200\ {\rm cm^{-1}}$ at
$5\times10^{19}$: $\alpha d=200\times0.0675=13.5$: $T\sim e^{-13.5}
=1.4\times10^{-6}$: opaque; inspection fails. Backside imaging of heavily
doped wafers needs longer wavelengths than their free carriers permit:
substrate doping is an optics specification, a sentence purchasing groups
learn expensively.

**P19.17** $\omega_{LO}=269\times\sqrt{12.1/9.6}=302\ {\rm cm^{-1}}$: band
from 269 to 302 cm$^{-1}$ (33 to 37 µm): the crystal is a mirror across
that band and LST delivered it from four numbers: infrared reflectance as
phonon spectroscopy, no neutrons required.

**P19.18** Vertical transitions from filled conduction states start at
$E_F$ above the band minimum, and the hole state sits $\,(m_e/m_h)E_F$
below its maximum: edge $=E_g+(1+m_e^{*}/m_h^{*})E_F$. For the oxide:
$E_F=(\hbar^{2}/2m_e^{*})(3\pi^{2}n)^{2/3}$ with
$n=7\times10^{26}$, $m^{*}=0.3$: $(3\pi^{2}n)^{2/3}=7.6\times10^{18}$:
$E_F=(1.11\times10^{-68}/5.46\times10^{-31})\times7.6\times10^{18}
=1.55\times10^{-19}$ J $=0.97$ eV: with $m_h\gg m_e$, a ~1 eV blueshift:
precisely how a 3.5 eV-gap oxide stays transparent while metallically
doped: the Burstein-Moss dividend module 56 spends.

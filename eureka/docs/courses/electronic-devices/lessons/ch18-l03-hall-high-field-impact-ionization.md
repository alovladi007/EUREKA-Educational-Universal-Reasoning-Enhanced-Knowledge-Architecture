# The Hall Effect, High-Field Transport, and Impact Ionization

<!-- covers: 18.9, 18.10, 18.11 -->

## 1. The Hall effect

Conductivity gives the product $n\mu$. Device design needs the factors
separately, and the Hall effect is how they are separated.

### 1.1 The force balance

Send a current $I$ along $x$ through a bar of width $w$ and thickness $t$, with
$\mathbf{B}$ along $z$. Each carrier drifts at $v_d$ and feels the Lorentz
force $q\,\mathbf{v}\times\mathbf{B}$, which pushes it along $y$. Charge
accumulates on one face until the transverse field it creates cancels the
magnetic force:

$$
q\mathcal{E}_y=q\,v_d B
\quad\Longrightarrow\quad
\mathcal{E}_y=v_dB
$$

![The transverse field grows until it balances the magnetic force. Because electrons and holes drift in opposite directions and carry opposite charge, they deflect the same way but pile up with opposite sign, which is what makes the polarity diagnostic.](/courses/electronic-devices/figures/m18-hall-bar.svg)

The measured Hall voltage is $V_H=\mathcal{E}_yw$, and with $I=nqv_d(wt)$,

$$
\boxed{\;V_H=\frac{IB}{nqt}\;}
\qquad
R_H\equiv\frac{\mathcal{E}_y}{J_xB}=\frac{1}{nq}
$$

Combining with a four-point resistivity measurement on the same sample,

$$
\mu_H=|R_H|\,\sigma
$$

so one sample yields carrier **type**, **density** and **mobility**.

### 1.2 Why the sign is the useful part

Reverse the carrier sign and two things flip: the charge $q$, and the drift
direction $\mathbf{v}$. The Lorentz force $q\mathbf{v}\times\mathbf{B}$ is
therefore unchanged in direction, so both carrier types deflect to the *same*
face, but they deposit opposite charge there. The Hall voltage therefore
reverses polarity with carrier type. Historically this was the decisive
evidence that positive carriers conduct in some materials; practically, it is
the routine confirmation that a doped layer came out n-type or p-type.

### 1.3 Sheet form, and why van der Pauw wins

For a thin film the useful quantity is the **sheet density**
$n_s=nt$ in ${\rm cm^{-2}}$:

$$
n_s=\frac{IB}{q|V_H|}
$$

which needs no thickness measurement at all. Van der Pauw geometry extends this
to an arbitrarily shaped flat sample with four perimeter contacts, so a new
film can be characterised without patterning a bar. Module 36 covers the
protocol, including the field-reversal and current-reversal averaging that
cancels misalignment and thermomagnetic offsets.

### Worked example 1.1 — reading a Hall measurement

A film 1 µm thick carries $I=1\ {\rm mA}$ in $B=0.5\ {\rm T}$ and shows
$V_H=-1.2\ {\rm mV}$. Its sheet resistance is $180\ \Omega/\square$. Find the
carrier type, density and mobility.

Negative $V_H$ with this geometry indicates **electrons**. Then

$$
n=\frac{IB}{q|V_H|t}
=\frac{10^{-3}\times0.5}{1.602\times10^{-19}\times1.2\times10^{-3}\times10^{-6}}
=2.6\times10^{24}\ {\rm m^{-3}}=2.6\times10^{18}\ {\rm cm^{-3}}
$$

$$
\rho=R_s t=180\times10^{-6}=1.8\times10^{-4}\ \Omega\,{\rm m}
\quad\Rightarrow\quad
\mu=\frac{1}{nq\rho}=\frac{1}{2.6\times10^{24}\times1.602\times10^{-19}\times1.8\times10^{-4}}
$$

$$
\mu=1.33\times10^{-2}\ {\rm m^{2}/Vs}=133\ {\rm cm^{2}/Vs}
$$

**Report it as a Hall mobility.** The drift mobility is lower by the Hall
factor $r_H$ of lesson 1, between about 1.2 and 1.9 depending on which
mechanism dominates.

### 1.4 Two honest caveats

**Two-carrier conduction.** When electrons and holes both conduct,

$$
R_H=\frac{1}{q}\,\frac{p\mu_p^{2}-n\mu_n^{2}}{(p\mu_p+n\mu_n)^{2}}
$$

which can pass through zero and change sign with temperature even though
nothing about the sample changed. A single-carrier reading of such data is
meaningless. The test is field dependence: single-carrier $R_H$ is independent
of $B$, two-carrier is not.

**Inhomogeneity.** A layered sample returns a weighted average dominated by the
most conductive layer, which may not be the layer of interest.

## 2. High-field transport

Everything so far assumed $v_d\propto\mathcal{E}$. That holds only while the
energy gained between collisions stays small compared with $k_BT$. A 1 V supply
across a 20 nm channel is $5\times10^{7}\ {\rm V/m}$, so it does not hold.

### 2.1 The energy balance and saturation

In steady state the power taken from the field equals the power lost to the
lattice:

$$
e\mathcal{E}v_d=\frac{\langle E\rangle-\tfrac{3}{2}k_BT_L}{\tau_E}
$$

with $\tau_E$ the energy relaxation time. As the field rises, carriers become
**hot**, with an effective temperature $T_e>T_L$. Once
$\langle E\rangle$ reaches the optical phonon energy $\hbar\omega_{\rm op}$,
emission of optical phonons switches on and becomes the dominant loss channel.
Beyond that, extra field energy goes into phonon emission rather than into
drift, and the velocity saturates. Equating the power input to the maximum
phonon emission rate gives the scale

$$
v_{\rm sat}\approx\sqrt{\frac{8\hbar\omega_{\rm op}}{3\pi m^{*}}}
$$

which for silicon returns about $10^{5}\ {\rm m/s}$, matching measurement.

A convenient empirical interpolation used throughout device modelling:

$$
v_d=\frac{\mu_0\mathcal{E}}{\left[1+\left(\mu_0\mathcal{E}/v_{\rm sat}\right)^{\beta}\right]^{1/\beta}}
$$

with $\beta\approx2$ for electrons in silicon and 1 for holes.

![Silicon saturates monotonically. Gallium arsenide overshoots and then falls, because carriers transfer into a heavier, slower conduction band valley.](/courses/electronic-devices/figures/m18-velocity-field.svg)

### 2.2 Negative differential mobility and the Gunn effect

In GaAs the conduction band has a light central valley
($m^{*}=0.067\,m_0$) and heavier satellite valleys about 0.3 eV above it
($m^{*}\approx0.35\,m_0$). At low field carriers sit in the light valley. Once
they gain 0.3 eV they transfer, and the average velocity **falls** as the field
rises:

$$
\langle v\rangle=\frac{n_1\mu_1+n_2\mu_2}{n_1+n_2}\,\mathcal{E},
\qquad \mu_2\ll\mu_1
$$

A region of $dv/d\mathcal{E}<0$ makes uniform field distribution unstable: any
small high-field region grows, forming a travelling dipole domain that transits
the device and produces current oscillations at the transit frequency. This is
the **Gunn effect**, and it makes a microwave oscillator out of a slab of
material with no resonant circuit.

### 2.3 Hot carriers as a reliability problem

A carrier with several electron-volts can surmount the ~3.1 eV barrier into
silicon dioxide, be injected into the gate dielectric and trapped there,
shifting threshold voltage permanently. Hot-carrier degradation scales
steeply with supply voltage, which is one of the main reasons supply voltages
were scaled down alongside dimensions. Module 36 measures the resulting
interface damage by charge pumping.

### Worked example 2.1 — when does the linear model fail?

At what field does silicon's drift velocity fall 10 percent below the linear
extrapolation? Take $\mu_0=1350\ {\rm cm^{2}/Vs}$, $v_{\rm sat}=10^{7}\
{\rm cm/s}$, $\beta=2$.

Require $v_d/(\mu_0\mathcal{E})=0.9$, so
$\left[1+(\mu_0\mathcal{E}/v_{\rm sat})^{2}\right]^{-1/2}=0.9$, giving
$(\mu_0\mathcal{E}/v_{\rm sat})^{2}=0.2346$ and

$$
\mathcal{E}=\frac{0.484\times10^{7}}{1350}=3.6\times10^{3}\ {\rm V/cm}
$$

In a 1 µm channel that is only 0.36 V. **Linear mobility is already a poor
model at ordinary supply voltages**, which is why long-channel hand analysis
overestimates drive current.

## 3. Impact ionization and avalanche multiplication

### 3.1 Threshold and rate

Raise the field further and a carrier can accumulate more than the bandgap
before scattering. Colliding with the lattice, it promotes a valence electron
across the gap, creating a new pair. Momentum and energy conservation set a
threshold above $E_g$; for parabolic bands with equal masses,

$$
E_{\rm th}=\frac{3}{2}E_g
$$

The **ionization coefficient** $\alpha$ is the number of pairs generated per
unit length, and it follows a Chynoweth form

$$
\alpha(\mathcal{E})=\alpha_\infty\exp\!\left(-\frac{\mathcal{E}_{c}}{\mathcal{E}}\right)
$$

The exponential in $1/\mathcal{E}$ is why breakdown is so sharp: a small
increase in field produces a large increase in generation.

### 3.2 Multiplication

For a depletion region of width $W$ with equal electron and hole coefficients,
the multiplication factor solves

$$
1-\frac{1}{M}=\int_0^{W}\alpha\,dx
$$

so $M\to\infty$ when the ionization integral reaches unity, which **defines**
the breakdown voltage. Empirically Miller's expression is used:

$$
M=\frac{1}{1-\left(V/V_{\rm BR}\right)^{n}}
$$

![Multiplication is a runaway, not an adjustable gain. Useful operation sits on the knee, where a small bias change is already a large gain change.](/courses/electronic-devices/figures/m18-avalanche.svg)

### 3.3 The electron-to-hole ratio, and why it decides noise

Electrons and holes generally have different coefficients. Define
$k=\alpha_h/\alpha_e$. When $k\ll1$ only one carrier ionizes, the avalanche is
a clean one-way cascade, and the excess noise factor is low. When $k\to1$ each
carrier type feeds the other, the feedback lengthens and randomises the
multiplication chain, and noise rises. McIntyre's result,

$$
F(M)=kM+\left(2-\frac{1}{M}\right)(1-k)
$$

is why silicon ($k\approx0.02$ to 0.1) makes far quieter avalanche photodiodes
than germanium ($k\approx0.9$), and it is a primary material selection
criterion for detectors.

### 3.4 Breakdown voltage and the wide-bandgap argument

For a one-sided abrupt junction of doping $N$, the depletion width at breakdown
follows from Poisson's equation with a critical field $\mathcal{E}_c$:

$$
V_{\rm BR}=\frac{\varepsilon\,\mathcal{E}_c^{2}}{2qN},
\qquad
W_{\rm BR}=\frac{2V_{\rm BR}}{\mathcal{E}_c}
$$

The on-resistance of the drift region is $R_{\rm on}=W/(q\mu N)$, and
eliminating $N$ and $W$ gives the **unipolar figure of merit**:

$$
\boxed{\;R_{\rm on,sp}=\frac{4V_{\rm BR}^{2}}{\varepsilon\mu\,\mathcal{E}_c^{3}}\;}
$$

The cube on the critical field is the whole wide-bandgap argument. Silicon
carbide's $\mathcal{E}_c$ is about ten times silicon's, so at equal blocking
voltage its specific on-resistance is roughly a thousand times lower before
mobility differences are folded in, and a few hundred times lower after. That
single exponent is why SiC and GaN power devices exist.

### Worked example 3.1 — Si against SiC at 1200 V

Silicon: $\mathcal{E}_c=3\times10^{5}\ {\rm V/cm}$, $\mu=1350$,
$\varepsilon=11.7\varepsilon_0$. SiC: $\mathcal{E}_c=3\times10^{6}$,
$\mu=900$, $\varepsilon=9.7\varepsilon_0$.

Taking the ratio directly:

$$
\frac{R_{\rm Si}}{R_{\rm SiC}}
=\frac{\varepsilon_{\rm SiC}\mu_{\rm SiC}\mathcal{E}_{c,\rm SiC}^{3}}
{\varepsilon_{\rm Si}\mu_{\rm Si}\mathcal{E}_{c,\rm Si}^{3}}
=\frac{9.7\times900\times(3\times10^{6})^{3}}{11.7\times1350\times(3\times10^{5})^{3}}
$$

$$
=\frac{9.7\times900}{11.7\times1350}\times10^{3}=0.553\times10^{3}\approx550
$$

The drift region is about **550 times** less resistive per unit area. Also,
since $W_{\rm BR}=2V/\mathcal{E}_c$, the SiC drift layer is 8 µm against
silicon's 80 µm, which is why SiC dies are thin and fast as well as efficient.

## 4. Problems

**P18.10** A Hall bar 0.5 mm thick carries 10 mA in 0.3 T and shows
$V_H=+2.5\ {\rm mV}$. Find the carrier type and density. If $\rho=0.05\ \Omega\,$cm,
find the Hall mobility.

**P18.11** Silicon at $\mathcal{E}=10^{4}\ {\rm V/cm}$: use the empirical
saturation form with $\beta=2$ to find $v_d$ and the effective mobility
$v_d/\mathcal{E}$. Compare with the low-field 1350.

**P18.12** An avalanche photodiode operates at $M=20$ with $k=0.05$. Find the
excess noise factor. Repeat for $k=0.5$ and comment.

**P18.13** A silicon diode has $V_{\rm BR}=60$ V. Using
$V_{\rm BR}=\varepsilon\mathcal{E}_c^{2}/2qN$ with
$\mathcal{E}_c=3\times10^{5}\ {\rm V/cm}$, find the required doping and the
depletion width at breakdown.

**P18.14** *(graduate)* Show that for equal ionization coefficients the
condition $\int_0^{W}\alpha\,dx=1$ follows from the coupled continuity
equations for electron and hole currents in the depletion region.

### Answers

**P18.10** Positive $V_H$ indicates **holes**.
$p=IB/(q|V_H|t)=(10^{-2}\times0.3)/(1.602\times10^{-19}\times2.5\times10^{-3}
\times5\times10^{-4})=1.5\times10^{22}\ {\rm m^{-3}}=1.5\times10^{16}\ {\rm cm^{-3}}$.
With $\rho=5\times10^{-4}\ \Omega\,$m, $\mu_H=1/(pq\rho)=833\ {\rm cm^{2}/Vs}$.
That is above the usual hole mobility at this doping, which is a hint that the
Hall factor has not been divided out.

**P18.11** $\mu_0\mathcal{E}=1350\times10^{4}=1.35\times10^{7}\ {\rm cm/s}$.
Then $v_d=1.35\times10^{7}/\sqrt{1+1.8225}=1.35\times10^{7}/1.680
=8.04\times10^{6}\ {\rm cm/s}$, and effective mobility
$=8.04\times10^{6}/10^{4}=804\ {\rm cm^{2}/Vs}$, about 60 percent of the
low-field value.

**P18.12** $F=kM+(2-1/M)(1-k)$. For $k=0.05$:
$F=1.0+1.95\times0.95=2.85$. For $k=0.5$: $F=10+1.95\times0.5=10.98$. Nearly
four times the noise power for the same gain, which is why the coefficient
ratio, not the gain, is the material figure of merit for detectors.

**P18.13** $N=\varepsilon\mathcal{E}_c^{2}/(2qV_{\rm BR})
=(11.7\times8.854\times10^{-12})(3\times10^{7})^{2}/(2\times1.602\times10^{-19}\times60)
=4.85\times10^{21}\ {\rm m^{-3}}=4.9\times10^{15}\ {\rm cm^{-3}}$.
$W=2V/\mathcal{E}_c=120/(3\times10^{7})=4.0\ {\rm \mu m}$.

**P18.14** With $\alpha_e=\alpha_h=\alpha$, the continuity equations give
$dJ_n/dx=\alpha(J_n+J_p)$ and $-dJ_p/dx=\alpha(J_n+J_p)$, so the total
$J=J_n+J_p$ is constant. Writing $J_n(W)=MJ_n(0)$ and integrating
$dJ_n/dx=\alpha J$ across the region yields
$J_n(W)-J_n(0)=J\int_0^{W}\alpha\,dx$. Dividing by $J=J_n(W)$ at the boundary
where the current is all electrons gives $1-1/M=\int_0^{W}\alpha\,dx$, so $M$
diverges when the integral reaches one.

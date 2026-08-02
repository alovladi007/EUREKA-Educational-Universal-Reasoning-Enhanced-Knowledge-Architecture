# Low-Dimensional Conduction: 2DEG, Quantized Channels, Quantum Hall

<!-- covers: 18.12, 18.13, 18.14 -->

Confine carriers to a region comparable to their quantum wavelength and
transport stops being a story about drift and scattering and becomes a story
about allowed states. Each of the three cases below underpins real technology
or real metrology.

## 1. The two-dimensional electron gas

### 1.1 Modulation doping

Lesson 2 ended with a conflict: doping supplies carriers, and the ionized
dopants left behind then scatter them. **Modulation doping** resolves it by
putting the dopants where the carriers are not.

Grow a wide-gap layer (AlGaAs) on a narrow-gap layer (GaAs) and dope only the
wide-gap side, leaving an undoped **spacer** between the doping and the
interface. Electrons fall into the lower conduction band of the GaAs and are
held against the interface by the electrostatic attraction of the donors they
left. The result is a sheet of electrons living in undoped material.

![The band edge bends at the heterojunction into a roughly triangular well. Electrons occupy bound subbands in that well while the ionised donors that supplied them sit tens of nanometres away, behind an undoped spacer.](/courses/electronic-devices/figures/m18-2deg-band.svg)

### 1.2 Quantization in the triangular well

Near the interface the potential is approximately triangular,
$V(z)=e\mathcal{E}_s z$ for $z>0$. Solving Schrodinger's equation in a
triangular well gives Airy-function states with energies

$$
E_i\simeq\left(\frac{\hbar^{2}}{2m^{*}}\right)^{1/3}
\left(\frac{3\pi e\mathcal{E}_s}{2}\left(i+\tfrac{3}{4}\right)\right)^{2/3},
\qquad i=0,1,2,\dots
$$

Motion along $z$ is quantized into these subbands; motion in the plane stays
free. Typical spacings are 10 to 50 meV, so at low temperature and low density
only the lowest subband is occupied and the system is genuinely
**two-dimensional**.

### 1.3 The 2D density of states, and why it matters

For a parabolic band in two dimensions the density of states per unit area is
**constant** within each subband:

$$
\boxed{\;g_{2D}=\frac{m^{*}}{\pi\hbar^{2}}\;}
$$

independent of energy, giving the characteristic staircase as each subband
switches on. Contrast the bulk $g_{3D}\propto\sqrt{E}$. The consequences run
through everything: the Fermi energy is linear in sheet density,

$$
E_F=\frac{\pi\hbar^{2}n_s}{m^{*}}
$$

and thermal broadening effects differ qualitatively from the bulk.

### 1.4 Why the mobility is enormous

With ionized impurity scattering removed from the channel, and the remaining
remote donors screened and set back by the spacer, low-temperature mobilities
exceed $10^{7}\ {\rm cm^{2}/Vs}$, with mean free paths reaching hundreds of
micrometres. Two subtleties from lesson 1 section 5.3 explain why the gain is
so large:

- Remote donors scatter through **small angles**, and the transport lifetime
  weights scattering by $(1-\cos\theta)$, so small-angle events barely degrade
  the current. This is why the transport lifetime can exceed the quantum
  lifetime by an order of magnitude in these structures.
- Increasing the spacer thickness raises mobility but lowers $n_s$, so there is
  a design trade rather than a free improvement.

### Worked example 1.1 — sheet density and Fermi energy

A GaAs 2DEG has $n_s=3\times10^{11}\ {\rm cm^{-2}}$, $m^{*}=0.067\,m_0$. Find
$E_F$ and check whether only one subband is filled.

$$
E_F=\frac{\pi\hbar^{2}n_s}{m^{*}}
=\frac{\pi(1.055\times10^{-34})^{2}(3\times10^{15}\ {\rm m^{-2}})}
{0.067\times9.109\times10^{-31}}
$$

$$
=1.71\times10^{-21}\ {\rm J}=10.7\ {\rm meV}
$$

Since typical subband spacing $E_1-E_0$ is 20 to 40 meV, only the lowest
subband is occupied: the system is properly 2D. Note also that
$E_F\gg k_BT=0.36$ meV at 4.2 K, so the gas is degenerate.

### 1.5 The device: HEMT

Put a gate over the 2DEG and you have a high electron mobility transistor. The
gate modulates $n_s$ directly, and the channel is both fast and free of dopant
scattering. In AlGaN/GaN the 2DEG forms with **no intentional doping at all**,
because spontaneous and piezoelectric polarization supply the confining field,
which is a large part of why GaN power and RF devices are practical.

## 2. One-dimensional channels and quantized conductance

### 2.1 Modes in a constriction

Squeeze the 2DEG laterally to a width $W$ comparable to the Fermi wavelength.
Transverse motion quantizes into modes exactly as in a waveguide:

$$
E_n=\frac{\hbar^{2}\pi^{2}n^{2}}{2m^{*}W^{2}}+\frac{\hbar^{2}k_x^{2}}{2m^{*}}
$$

The number of propagating modes at the Fermi level is
$N=\lfloor k_FW/\pi\rfloor$.

### 2.2 The Landauer result

Consider one mode connecting two reservoirs at chemical potentials differing by
$eV$. The current carried is the charge times the density of states times the
velocity, and in one dimension these cancel exactly:

$$
I=e\int g_{1D}(E)\,v(E)\,dE,
\qquad
g_{1D}=\frac{2}{\pi\hbar v}
\;\Longrightarrow\;
g_{1D}v=\frac{2}{\pi\hbar}\ \text{(energy-independent)}
$$

so $I=(2e^{2}/h)V$ per mode, and for $N$ modes with transmission $T_n$:

$$
\boxed{\;G=\frac{2e^{2}}{h}\sum_{n=1}^{N}T_n\;}
$$

The **conductance quantum** is

$$
G_0=\frac{2e^{2}}{h}=7.748\times10^{-5}\ {\rm S}
=\frac{1}{12.906\ {\rm k\Omega}}
$$

![Widening the channel admits one mode at a time, and each adds exactly one conductance quantum. The step height is a combination of fundamental constants, not a property of the material.](/courses/electronic-devices/figures/m18-quantized-conductance.svg)

### 2.3 The contact-resistance paradox

A ballistic channel carries no scattering, yet its conductance is finite. Where
is the dissipation?

The answer is that the resistance lives at the **contacts**: a finite number of
modes in the channel must connect to a continuum in the reservoirs, and the
mismatch is where carriers thermalize. Energy is dissipated in the reservoirs,
not in the channel. This is a genuinely different picture of resistance from
Drude's, and it says something practical: **there is a floor to interconnect
resistance**. As wires approach a few modes, no material improvement gets below
roughly $h/2e^{2}$ per mode.

### Worked example 2.1 — how narrow before quantization shows?

For the 2DEG above, $k_F=\sqrt{2\pi n_s}=\sqrt{2\pi\times3\times10^{15}}
=1.37\times10^{8}\ {\rm m^{-1}}$, so
$\lambda_F=2\pi/k_F=46\ {\rm nm}$. The first mode appears when
$W>\pi/k_F=\lambda_F/2=23\ {\rm nm}$, and steps are resolved only while
$k_BT$ is small compared with the subband spacing, which for $W=100$ nm is a
few meV, meaning temperatures of a few kelvin. This is why quantized
conductance is a cryogenic measurement in semiconductors but is visible at room
temperature in atomic-scale metal contacts, where $\lambda_F$ is 0.5 nm and the
spacings are electron-volts.

## 3. The quantum Hall effect

### 3.1 Landau quantization

In a perpendicular field the free in-plane motion becomes cyclotron orbits,
quantized into **Landau levels**:

$$
E_n=\hbar\omega_c\left(n+\tfrac{1}{2}\right),
\qquad
\omega_c=\frac{eB}{m^{*}}
$$

Each level is massively degenerate, with one state per flux quantum
$\Phi_0=h/e$ threading the sample, so the degeneracy per unit area is

$$
n_L=\frac{eB}{h}
$$

The **filling factor** is the number of filled levels:

$$
\nu=\frac{n_s}{n_L}=\frac{n_s h}{eB}
$$

### 3.2 Why the plateaux are flat, and exact

When $\nu$ is an integer, the Fermi level sits in the gap between Landau
levels. In the sample interior there are no states to scatter into, so
$\rho_{xx}\to0$. Conduction proceeds only along one-dimensional **edge
channels** where the levels bend up through $E_F$ at the boundary; these are
chiral, travelling one way on each edge, so backscattering would require
crossing the sample and is exponentially suppressed.

Applying the Landauer result of section 2 to $\nu$ edge channels gives

$$
\boxed{\;R_{xy}=\frac{h}{\nu e^{2}},
\qquad \frac{h}{e^{2}}=25\,812.807\ \Omega\;}
$$

![Two panels sharing the field axis: the Hall resistance sits on plateaux while the longitudinal resistance collapses, and both features occur at the same fields. Plotting them together on one y-axis would misrepresent both, so they are stacked.](/courses/electronic-devices/figures/m18-quantum-hall.svg)

The plateaux have **finite width** because disorder localizes states between
Landau levels. Those localized states absorb the changing carrier density as
$B$ varies without contributing to transport, so the Hall resistance stays
pinned across a range of field. Disorder, usually the enemy, is what makes the
effect observable.

### 3.3 Why metrology adopted it

The plateau values depend only on $h$ and $e$, not on the material, the
geometry, the mobility or the sample dimensions, and they reproduce to parts in
$10^{9}$ between laboratories. Since the 2019 SI revision fixed $e$ and $h$ to
defined values, the quantum Hall resistance together with the Josephson voltage
standard makes electrical metrology directly traceable to those constants. A
materials effect became the definition of the ohm.

### 3.4 The fractional effect

At very high field and very high mobility, plateaux appear at fractional
$\nu=1/3,\,2/5,\,3/7,\dots$. These cannot arise from non-interacting electrons.
They come from strong electron-electron correlation, and the excitations of the
resulting state carry a **fraction of an electron charge**. It is among the
clearest demonstrations that collective behaviour in a solid can produce
properties no constituent has.

### Worked example 3.1 — locating the plateaux

For $n_s=3\times10^{11}\ {\rm cm^{-2}}=3\times10^{15}\ {\rm m^{-2}}$, at what
field does the $\nu=2$ plateau sit, and what is its resistance?

$$
B=\frac{n_sh}{\nu e}
=\frac{3\times10^{15}\times6.626\times10^{-34}}{2\times1.602\times10^{-19}}
=6.2\ {\rm T}
$$

$$
R_{xy}=\frac{25\,812.807}{2}=12\,906.4\ \Omega
$$

To resolve the plateau, the Landau gap $\hbar\omega_c$ must exceed $k_BT$:
$\hbar eB/m^{*}=1.055\times10^{-34}\times1.602\times10^{-19}\times6.2/
(0.067\times9.109\times10^{-31})=1.72\times10^{-21}\ {\rm J}=10.7\ {\rm meV}$,
which exceeds $k_BT$ up to about 120 K in principle, though disorder broadening
means real integer plateaux need a few kelvin. In graphene the gaps are large
enough to see the effect at room temperature (module 49).

## 4. What to take from module 18

Three ideas carry through the rest of the course.

1. **$\sigma=ne\mu$, and always ask which factor a change acts on.** Doping
   moves $n$ up and $\mu$ down; cooling moves them in opposite directions in a
   metal and a semiconductor.
2. **The worst scatterer sets the mobility.** Improving a material means
   identifying the limiter, not improving everything.
3. **When a dimension reaches the carrier wavelength or the mean free path, the
   bulk description is not approximate but wrong.** Thin films get more
   resistive than bulk, channels get quantized conductance, and confined sheets
   reach mobilities the bulk material cannot.

## 5. Problems

**P18.15** A 2DEG has $n_s=5\times10^{11}\ {\rm cm^{-2}}$ in GaAs. Find
$E_F$, $k_F$, $\lambda_F$, and the field at which $\nu=4$.

**P18.16** A quantum point contact shows steps at 77.5, 155 and 232 µS. Confirm
these are conductance quanta and state the number of modes at each.

**P18.17** A 2DEG has mobility $10^{6}\ {\rm cm^{2}/Vs}$ at 4 K with
$n_s=3\times10^{11}\ {\rm cm^{-2}}$. Find the mean free path and comment on
whether a 2 µm channel is ballistic.

**P18.18** *(graduate)* Show that the 2D density of states
$g_{2D}=m^{*}/\pi\hbar^{2}$ follows from counting states in $k$-space, and
explain why it is energy-independent while $g_{3D}\propto\sqrt{E}$.

### Answers

**P18.15** $E_F=\pi\hbar^{2}n_s/m^{*}$ with $n_s=5\times10^{15}\ {\rm m^{-2}}$
gives $E_F=2.85\times10^{-21}\ {\rm J}=17.8\ {\rm meV}$.
$k_F=\sqrt{2\pi n_s}=1.77\times10^{8}\ {\rm m^{-1}}$,
$\lambda_F=35.5\ {\rm nm}$.
$B=n_sh/(\nu e)=(5\times10^{15}\times6.626\times10^{-34})/(4\times1.602\times10^{-19})
=5.2\ {\rm T}$.

**P18.16** $G_0=77.48\ {\rm \mu S}$. The three values are $1.00\,G_0$,
$2.00\,G_0$ and $2.99\,G_0$, so one, two and three modes. The agreement to
better than one percent without any material parameter is the signature that
this is a fundamental-constant effect.

**P18.17** $\mu=10^{6}\ {\rm cm^{2}/Vs}=100\ {\rm m^{2}/Vs}$, so
$\tau=\mu m^{*}/e=100\times0.067\times9.109\times10^{-31}/1.602\times10^{-19}
=3.8\times10^{-11}\ {\rm s}$. With
$v_F=\hbar k_F/m^{*}=1.055\times10^{-34}\times1.37\times10^{8}/
(0.067\times9.109\times10^{-31})=2.4\times10^{5}\ {\rm m/s}$,
$\ell=v_F\tau=9.1\ {\rm \mu m}$. A 2 µm channel is comfortably shorter than
$\ell$, so transport is **ballistic** and the Landauer picture, not
drift-diffusion, is the correct description.

**P18.18** In 2D, states occupy area $(2\pi)^{2}/A$ each in $k$-space, so the
number with wavevector below $k$ is $N=2\cdot\pi k^{2}A/(2\pi)^{2}
=Ak^{2}/2\pi$ including spin. With $E=\hbar^{2}k^{2}/2m^{*}$,
$k^{2}=2m^{*}E/\hbar^{2}$, so $N/A=m^{*}E/\pi\hbar^{2}$ and
$g_{2D}=d(N/A)/dE=m^{*}/\pi\hbar^{2}$, a constant. The reason is dimensional:
in $d$ dimensions the $k$-space volume element goes as $k^{d-1}dk$, and with
$k\propto\sqrt{E}$ this gives $g\propto E^{(d-2)/2}$. So $g$ rises as
$\sqrt{E}$ in 3D, is constant in 2D, and **diverges** as $1/\sqrt{E}$ at each
subband edge in 1D, which is why one-dimensional systems show sharp van Hove
peaks in their optical and transport spectra.

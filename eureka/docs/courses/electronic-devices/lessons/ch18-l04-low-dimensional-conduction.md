# Low-Dimensional Conduction: 2DEG, Quantized Channels, Quantum Hall

<!-- covers: 18.12, 18.13, 18.14 -->

Confine carriers to a region comparable to their quantum wavelength and
transport stops being a story about drift and scattering and becomes a story
about allowed states. This lesson covers the three canonical cases, in order
of decreasing dimensionality, and each one underpins real technology or real
metrology.

## The two-dimensional electron gas

Section 18.5 ended with a problem: doping supplies carriers and the ionized
dopants left behind then scatter them. **Modulation doping** solves it by
putting the dopants somewhere the carriers are not.

Grow a heterostructure in which a wide-gap layer (say aluminium gallium
arsenide) sits on a narrow-gap layer (gallium arsenide), and dope only the
wide-gap side. Electrons released by those donors fall into the lower
conduction band of the narrow-gap material and are trapped there by the band
offset, held against the interface by the electrostatic attraction of the
donors they left behind. The result is a sheet of electrons a few nanometres
thick, living in undoped material, physically separated from every ionized
donor that supplied them.

Two things follow.

**Quantum confinement.** Because the sheet is thinner than the electron
wavelength, motion perpendicular to the interface is quantized into discrete
subbands. Motion parallel to the interface remains free. The carriers form a
genuinely two-dimensional system: a **two-dimensional electron gas**. Its
density of states is a staircase of constant steps rather than the smooth
square-root curve of a bulk semiconductor, which changes the temperature
dependence of essentially every property.

**Enormous mobility.** With ionized impurity scattering largely removed, the
low-temperature mobility of a good 2DEG can exceed 10^7 cm^2/(V s), several
orders of magnitude above bulk doped material, with mean free paths reaching
hundreds of micrometres. At those lengths a carrier crosses a whole device
without scattering.

The practical payoff is the high electron mobility transistor. A HEMT puts a
gate over a 2DEG, so the channel is both very fast and free of dopant
scattering. HEMTs based on gallium arsenide and on gallium nitride dominate
low-noise microwave receivers, satellite front ends, radar and modern
radio-frequency power amplification. In the gallium nitride case a 2DEG forms
even without intentional doping, because the strong spontaneous and
piezoelectric polarization of the nitride heterostructure supplies the
confining field by itself, which is a large part of why GaN power devices are
practical. Module 30 covers the epitaxy that makes interfaces this abrupt
possible, and module 36 the measurements that confirm the sheet density.

## One-dimensional channels and quantized conductance

Squeeze the 2DEG laterally as well, with electrostatic gates or by etching,
until only a narrow constriction remains. Now motion is free in only one
direction, and the transverse motion is quantized into a set of one-
dimensional subbands, or **modes**, exactly as in a microwave waveguide.

If the constriction is shorter than the mean free path, transport through it
is ballistic: a carrier passes without scattering. The remarkable result is
that such a channel still has finite resistance, and its conductance is
quantized:

    G = N * (2 e^2 / h)

where N is the number of occupied modes and 2e^2/h is the **conductance
quantum**, about 7.75 x 10^-5 siemens, corresponding to a resistance of about
12.9 kilohms per mode. The factor of 2 is spin degeneracy.

Sweeping the gate voltage on a quantum point contact widens the channel, and
the conductance climbs in a clean staircase of these steps rather than
smoothly. This has two implications worth carrying.

First, **resistance without dissipation in the channel**. The resistance is
not caused by scattering inside the constriction; it arises at the contacts,
where a finite number of modes in the narrow channel must connect to a
continuum of states in the wide reservoirs. Energy is dissipated in the
reservoirs, not in the channel. This is the Landauer picture of conduction: a
conductor is a scatterer between two reservoirs, and conductance is
transmission.

Second, **there is a floor to interconnect resistance**. As real wires
approach a small number of modes, no amount of material improvement will get
below roughly h/2e^2 per mode. Quantized conductance is also observed in
atomic-scale metal contacts and single-molecule junctions, which is why it
appears again in module 52 on molecular electronics.

## The quantum Hall effect

Apply a strong perpendicular magnetic field to a high-mobility 2DEG at low
temperature and something extraordinary happens to the Hall measurement of
section 18.9.

In a magnetic field, the free in-plane motion of a two-dimensional electron
becomes circular, and those orbits are quantized. The continuous density of
states collapses into a set of massively degenerate discrete levels, the
**Landau levels**, separated in energy by hbar times the cyclotron frequency.
The number of states in each level is proportional to the field.

Sweep the field and the Landau levels sweep past the Fermi energy. Whenever
the Fermi level sits in the gap between two filled levels, there are no
available states for carriers to scatter into in the interior of the sample.
Conduction happens only along one-dimensional **edge channels** that run
around the perimeter, in which carriers travel in one direction only and
therefore cannot backscatter. Over that whole range of field:

- the longitudinal resistance drops essentially to zero, and
- the Hall resistance sits on an exact plateau at

      R_H = h / (nu * e^2)

with nu an integer. That value is about 25 812.807 ohms divided by nu.

The plateaux are the point. Their values depend only on fundamental constants,
not on the sample material, its geometry, its mobility or its dimensions. They
reproduce to parts in 10^9 across different samples in different laboratories.
This is why the quantum Hall effect became the practical realization of the
ohm: from the 2019 redefinition of the SI, the ampere and the kilogram are
fixed through defined values of e and h, and the quantum Hall resistance
together with the Josephson voltage standard makes electrical metrology
directly traceable to those constants. A materials effect became a
measurement standard.

At very high field and very high mobility, further plateaux appear at
*fractional* values of nu. The **fractional quantum Hall effect** cannot be
explained by non-interacting electrons at all; it arises from strong
electron-electron correlation, and its excitations carry a fraction of an
electron charge. It is one of the clearest demonstrations available that
collective behaviour in a solid can produce properties no individual
constituent has.

## What to take from this module

Three ideas from module 18 carry forward through the rest of the course.

The first is the factorization sigma = n e mu, and the discipline of always
asking which factor a change is acting on. The second is that scattering
dominates by whichever mechanism is worst, so improving a material means
identifying the limiter rather than improving everything. The third is that
when a dimension of the material drops to the scale of the carrier wavelength
or the mean free path, the bulk description stops being an approximation and
starts being wrong: thin films get more resistive than their bulk value,
channels get quantized conductance, and confined sheets get mobilities the
bulk material could never reach.

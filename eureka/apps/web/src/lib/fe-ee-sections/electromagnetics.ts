// FE EE course content — Electromagnetics (5 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_ELECTROMAGNETICS: Record<string, TopicLesson> = {
  fee_electrostatics: {
  topicId: 'fee_electrostatics',
  title: "Electrostatics: Coulomb's Law & Gauss's Law",
  domainWeight: 'Electromagnetics · 4–6%',
  overview: "Electrostatics governs stationary charge distributions and the electric fields they produce. Coulomb's law gives the force between point charges; Gauss's law provides a powerful shortcut for symmetric geometries. Capacitance, potential, and stored energy complete the picture.",
  sections: [
    {
      id: 'es-coulomb-field',
      title: "1. Coulomb's Law, Electric Field, and Potential",
      content: `## 1.1 Coulomb's Law

Force between two point charges:

**$F = k\\cdot Q_{1}\\cdot Q_{2} / r^{2}$**

where **$k = 1/(4\\pi \\varepsilon _{0}) = 8.99 \\times 10^{9} N\\cdot m^{2}/C^{2}$** and **$\\varepsilon _{0} = 8.854 \\times 10^{-12}\\ \\mathrm{F}/m$**.

- Like charges repel; unlike charges attract
- Force is along the line connecting charges (radial)
- In a medium with relative permittivity ε_r: replace ε₀ with ε = ε₀·ε_r

## 1.2 Electric Field

**$E = F/q$** (force per unit positive test charge, units: N/C = V/m)

- Field lines point **away** from positive charges, **toward** negative charges
- **Superposition**: E_total = ΣE_i (vector sum of fields from all charges)

### Point charge field: **$E = kQ/r^{2}$** (radial, directed away from +Q)

## 1.3 Electric Potential

**$V(r) = kQ/r$** (potential from a point charge, with V(∞) = 0 reference)

- **Potential difference**: ΔV = −∫E·dr (path-independent in electrostatics)
- **$E = -\\nabla V$** (field points from high to low potential)
- **Equipotential surfaces** are perpendicular to field lines`,
      examTip: "Coulomb's law uses 1/r² for force, but potential uses 1/r (no square). A common FE exam mistake is mixing up the exponents. Force falls off as r² but potential falls off as r.",
    },
    {
      id: 'es-gauss-capacitance',
      title: "2. Gauss's Law, Capacitance, and Stored Energy",
      content: `## 2.1 Gauss's Law

**$\\oint E\\cdot dA = Q_{enc} / \\varepsilon _{0}$**

Total electric flux through a closed surface equals enclosed charge divided by permittivity.

### Standard Geometries (memorize these)

| Geometry | Gaussian Surface | Electric Field |
|---|---|---|
| Infinite plane (surface charge σ) | Pill box | **$E = \\sigma / (2\\varepsilon _{0})$** |
| Infinite line (charge λ per length) | Cylinder | **$E = \\lambda / (2\\pi \\varepsilon _{0}r)$** |
| Conducting sphere (charge Q) | Concentric sphere | **E = kQ/r²** (outside); **E = 0** (inside) |
| Uniformly charged sphere | Concentric sphere | **E = kQr/R³** (inside); **kQ/r²** (outside) |

## 2.2 Capacitance

**$C = Q/V$** (charge stored per volt, Farads)

### Common Geometries

| Type | Formula |
|---|---|
| Parallel plate | **$C = \\varepsilon _{0}\\cdot \\varepsilon _r\\cdot A / d$** |
| Cylindrical | **$C = 2\\pi \\varepsilon _{0}\\cdot \\varepsilon _r\\cdot L / \\ln (b/a)$** |
| Spherical | **$C = 4\\pi \\varepsilon _{0}\\cdot \\varepsilon _r\\cdot a\\cdot b / (b - a)$** |

- Series capacitors: **$1/C_{eq} = 1/C_{1} + 1/C_{2}$** (opposite of resistors)
- Parallel capacitors: **$C_{eq} = C_{1} + C_{2}$**

## 2.3 Stored Energy

**$U = \\tfrac{1}{2} CV^{2} = \\tfrac{1}{2} QV = Q^{2}/(2C)$**

Energy density in an electric field: **$u = \\tfrac{1}{2} \\varepsilon _{0}E^{2}$** (J/m³)`,
      examTip: "Gauss's law is the fastest path to E-field on the FE exam when symmetry exists. Choose the Gaussian surface so E is constant on it: sphere for point/spherical charges, cylinder for line charges, pillbox for plane charges. If there is no symmetry, fall back to Coulomb's law with superposition.",
      importantNote: "Capacitors in series combine like resistors in parallel (1/C_eq = 1/C₁ + 1/C₂), and capacitors in parallel combine like resistors in series (C_eq = C₁ + C₂). This is the OPPOSITE of resistor rules and is a frequent source of FE exam errors.",
    },
    {
      id: 'es-field-worked',
      title: '3. Superposition, Spheres, and Conductors — Worked',
      content: `## 3.1 Superposition carried through to a number

The two formulas above are worth little until they are run on a distribution
containing more than one charge. Superposition is the entire technique, and
it splits into two rules that are easy to confuse: **fields add as vectors,
potentials add as signed scalars**. No direction ever enters a potential sum;
no sign is ever dropped from one.

**Given**: $Q_{1} = +2\\ \\mu \\mathrm{C}$ at the origin and
$Q_{2} = -3\\ \\mu \\mathrm{C}$ at $x = 0.40\\ \\mathrm{m}$, in air. Find the
field and the potential at the midpoint, $x = 0.20\\ \\mathrm{m}$.

**Fields.** Each charge is 0.20 m from the target point, so each magnitude is
$kQ/r^{2}$ with $k = 8.99 \\times 10^{9}$:

- From the positive charge: $(8.99 \\times 10^{9})(2 \\times 10^{-6})/(0.20)^{2} = 4.494 \\times 10^{5}$ V/m, directed **away** from it, i.e. toward +x.
- From the negative charge: $(8.99 \\times 10^{9})(3 \\times 10^{-6})/(0.20)^{2} = 6.741 \\times 10^{5}$ V/m, directed **toward** it, which is also +x.

The two contributions point the same way, so the magnitudes add:
**E = 1.123 × 10⁶ V/m, in the +x direction.** Notice that "one charge is
positive and one is negative" did not produce cancellation — between an
attracting pair the fields reinforce, and it is only outside the pair that
they can cancel.

**Potential.** Same two distances, no directions, signs kept:

$$V = kQ_{1}/r + kQ_{2}/r = 8.990 \\times 10^{4} - 1.348 \\times 10^{5} = -4.494 \\times 10^{4}\\ \\mathrm{V}$$

So the midpoint has the largest field anywhere near the pair and a potential
of **−44.9 kV**. Those two facts are not in conflict: the field measures how
hard a test charge is pushed, the potential measures the work already banked
in bringing it there, and the larger negative charge dominates the second sum
while reinforcing the first.

**Where does the field vanish?** Only outside the pair, beyond the weaker
charge. Measuring a distance x to the left of the +2 µC charge and setting
the magnitudes equal, $2/x^{2} = 3/(x + 0.4)^{2}$, which rearranges to
$x^{2} - 1.6x - 0.32 = 0$ and gives **x = 1.78 m**. Checking: both
contributions there are 5.67 × 10³ V/m, and they oppose. The FE-exam habit
worth taking from this is to decide *first*, from the signs and the geometry,
which side the null can be on — then solve one quadratic instead of three.

## 3.2 The charged sphere, region by region

Spherical symmetry is the case Gauss's law was made for, and the exam asks
about it in two flavours that differ only on the inside.

![Field and potential inside and outside a 5 cm sphere carrying 1 nC, drawn for a uniformly charged insulator and for a conductor: outside the surface the two are identical.](/courses/fe-ee/figures/em-sphere-field-potential.svg)

| Region | Uniformly charged insulator | Conductor (charge on the surface) |
|---|---|---|
| Inside, $r < R$ | $E = kQr/R^{3}$, rising linearly | **E = 0**, everywhere inside |
| At the surface | $E = kQ/R^{2}$ from both sides | $E = kQ/R^{2}$, jumping from zero |
| Outside, $r > R$ | $E = kQ/r^{2}$ | $E = kQ/r^{2}$ — identical |
| Potential inside | $V = kQ(3R^{2} - r^{2})/(2R^{3})$ | $V = kQ/R$, constant |
| Potential at centre | $1.5\\cdot kQ/R$ | $kQ/R$ |

**Worked**: Q = 1 nC spread through a sphere of radius R = 5 cm. At the
surface, $E = (8.99 \\times 10^{9})(10^{-9})/(0.05)^{2} = 3595$ V/m. At
r = 2 cm the insulating case gives $3595 \\times (2/5) = 1438$ V/m, while the
conductor gives exactly zero. At r = 10 cm both give
$3595 \\times (5/10)^{2} = 899$ V/m. The potential at the centre of the
insulator is $1.5 \\times 179.75 = 269.6$ V against 179.75 V for the
conductor.

The line worth memorising is the last row of the table: **from outside, any
spherically symmetric charge looks exactly like a point charge at its
centre**, whatever it is made of. Every exam problem that mentions a shell, a
solid ball or a charged conductor collapses to $kQ/r^{2}$ the moment the
field point is outside.

## 3.3 A recipe for Gauss's law, and its failure mode

Gauss's law is always true; it is only *useful* when symmetry lets you pull E
out of the integral. The procedure is mechanical:

1. Identify the symmetry — spherical, cylindrical or planar. If the answer
   would depend on where you sit at a fixed distance, there is no symmetry to
   exploit.
2. Draw the surface on which E has one constant magnitude and points straight
   through: a concentric sphere, a coaxial cylinder, or a pillbox straddling
   a sheet.
3. Replace the integral by $E \\times A$ for that surface.
4. Count only the charge **enclosed**. Charge outside the surface contributes
   flux in and the same flux out; it cancels exactly.
5. Solve for E, then check the limits — far away, a finite distribution must
   fall off as $1/r^{2}$.

Step 4 is the one that gets tested. A hollow conducting shell with a charge
suspended inside it, a coaxial cable, a wire inside a grounded conduit: in
each case the field beyond the outer conductor depends only on the algebraic
sum of everything inside, which is why a screened cable radiates nothing when
its return current is equal and opposite.

## 3.4 Conductors in electrostatics, and why the surface field doubles

In equilibrium there is no current, so there is no field inside conducting
material — any interior field would push the free charges until it was
cancelled. Three consequences follow and all three are examinable:

- **Excess charge lives on the surface.** A Gaussian surface drawn just
  inside the metal encloses zero net charge because E = 0 on it.
- **The body is an equipotential.** With E = 0 inside, no work is needed to
  move between two interior points, so the whole conductor sits at one
  potential and its surface is an equipotential surface — which is why field
  lines always meet a conductor at right angles.
- **The surface field is $E = \\sigma /\\varepsilon _{0}$**, not
  $\\sigma /(2\\varepsilon _{0})$. The isolated-sheet result has field
  emerging on both sides; a conductor surface has zero field on the metal
  side, so the entire flux exits on one side and the value doubles. Mixing
  these two is a classic distractor.

**Worked**: a conductor carrying a surface charge density of 2 µC/m² sits in
air. Its surface field is
$\\sigma /\\varepsilon _{0} = (2 \\times 10^{-6})/(8.854 \\times 10^{-12}) = 2.26 \\times 10^{5}$ V/m,
i.e. 226 kV/m — comfortably below the ~3 MV/m at which dry air ionises. Run
that backwards and air sets a hard ceiling on static charge density:
$\\sigma _{\\max} = \\varepsilon _{0} \\times 3 \\times 10^{6} = 26.6\\ \\mu \\mathrm{C/m^{2}}$.
That single number explains why high-voltage hardware is built from large
smooth radii: charge crowds onto sharp features, the local σ climbs past the
limit, and the air lets go.`,
      examTip: 'Two habits pay for themselves on symmetric electrostatics problems. First, decide whether the field point is inside or outside the charge before choosing a formula — the same sphere has three different answers depending on where you stand. Second, remember that potential adds as a scalar with signs, so a point can have a huge field and a negative potential at the same time; the exam likes that combination because it catches anyone treating V as a vector magnitude.',
      importantNote: 'The infinite-sheet field σ/(2ε₀) and the conductor-surface field σ/ε₀ differ by a factor of two, and the difference is physical, not a typo: a free sheet radiates flux from both faces while a conductor surface pushes all of it into the space on one side.',
    },
    {
      id: 'es-caps-energy',
      title: '4. Capacitance, Dielectrics, and Stored Energy in Practice',
      content: `## 4.1 One capacitor, six quantities

Almost every capacitor question is the same chain of substitutions, so it is
worth running the chain once with real numbers and keeping the arithmetic
visible.

**Given**: parallel plates of area A = 100 cm² = 0.0100 m², separated by
d = 0.50 mm of a dielectric with $\\varepsilon _r = 4.5$, charged to 100 V.

| Quantity | Relation | Value |
|---|---|---|
| Capacitance | $C = \\varepsilon _{0}\\varepsilon _r A/d$ | 797 pF |
| Stored charge | $Q = CV$ | 79.7 nC |
| Stored energy | $U = \\tfrac{1}{2} CV^{2}$ | 3.98 µJ |
| Internal field | $E = V/d$ | 200 kV/m |
| Energy density | $u = \\tfrac{1}{2} \\varepsilon _{0}\\varepsilon _r E^{2}$ | 0.797 J/m³ |
| Plate attraction | $F = \\tfrac{1}{2} \\varepsilon _{0}\\varepsilon _r E^{2}A$ | 7.97 mN |

Two of those rows are a consistency check rather than new information. The
volume between the plates is $0.0100 \\times 0.00050 = 5.0 \\times 10^{-6}$ m³,
and multiplying it by the energy density gives 3.98 µJ — the same answer as
$\\tfrac{1}{2} CV^{2}$. Energy density is not a separate fact about
capacitors; it is the same energy, redistributed over the field volume, and
the FE exam uses whichever form the question hands you.

The force row is the one people find surprising. The plates pull on each
other with about 8 mN here, roughly the weight of a paperclip, and the pull
is always attractive regardless of polarity — which is exactly how a
condenser microphone and a MEMS accelerometer work.

## 4.2 Layered dielectrics: the weakest layer is the low-ε one

Series layers between the same pair of plates share one flux density, because
the normal component of D is continuous across the boundary between them.
Since $E = D/(\\varepsilon _{0}\\varepsilon _r)$, the layer with the **smaller**
permittivity carries the **larger** field, which is the opposite of most
students' first guess.

![Field and flux density through a two-layer stack under 3 kV: D runs straight through while E steps up on entering the low-permittivity air gap.](/courses/fe-ee/figures/em-series-dielectric-fields.svg)

**Given**: 1.0 mm of plastic film ($\\varepsilon _r = 2.2$) in series with a
0.50 mm air gap ($\\varepsilon _r = 1$), 3.0 kV applied across the pair.

**Solution**: the common flux density is
$D = V/[d_{1}/(\\varepsilon _{0}\\varepsilon _{r1}) + d_{2}/(\\varepsilon _{0}\\varepsilon _{r2})] = 27.83\\ \\mu \\mathrm{C/m^{2}}$.
Dividing by each permittivity,

| Layer | Thickness | $\\varepsilon _r$ | Field | Voltage across it |
|---|---|---|---|---|
| Plastic film | 1.0 mm | 2.2 | 1.43 MV/m | 1429 V |
| Air gap | 0.50 mm | 1.0 | 3.14 MV/m | 1571 V |

The 0.5 mm of air takes more volts than the 1.0 mm of plastic, and its field
already exceeds the ~3 MV/m strength of air. Solving for the applied voltage
that first reaches 3 MV/m in the gap gives **2864 V** — the assembly fails
just under 2.9 kV even though the plastic alone would have held tens of
kilovolts. Trapped voids in cable insulation fail for precisely this reason,
and it is why high-voltage assemblies are impregnated or potted to drive the
air out.

## 4.3 Networks: which capacitor takes the voltage

| Connection | Combination | Shared quantity | Consequence |
|---|---|---|---|
| Series | $1/C_{eq} = \\sum (1/C_i)$ | same charge Q | smaller C takes the larger voltage |
| Parallel | $C_{eq} = \\sum C_i$ | same voltage V | larger C takes the larger charge |

**Worked**: 100 pF in series with 300 pF across 12 V.
$C_{eq} = (100)(300)/400 = 75$ pF, so $Q = 75 \\times 12 = 900$ pC flows onto
both. Then $V_{1} = 900/100 = 9$ V and $V_{2} = 900/300 = 3$ V, summing back
to 12 V. Three quarters of the applied voltage lands on the smaller
capacitor — the reason a series string of unmatched capacitors across a
high-voltage rail needs balancing resistors before the smallest one fails.

## 4.4 Where the other half of the energy goes

Charging a capacitor through a resistor from a fixed source is the tidiest
energy accounting problem in the syllabus. The source pushes charge Q = CV
through a constant potential difference V, so it delivers $QV = CV^{2}$
joules. The capacitor ends up holding $\\tfrac{1}{2} CV^{2}$. The missing
half is dissipated in the resistance — **and the amount does not depend on
the resistance at all**. Halving R doubles the current and halves the time,
leaving the integral unchanged.

For the 797 pF capacitor above at 100 V: the supply delivers 7.97 µJ, the
capacitor keeps 3.98 µJ and the circuit resistance burns 3.98 µJ, however
small that resistance is. The same accounting explains switched-capacitor
converter losses and the energy cost of driving CMOS gate capacitance at a
clock rate — one of the few places where an electrostatics result sets a
limit on digital design.`,
      examTip: 'When a capacitor problem gives you a dielectric, check immediately whether the applied voltage or the stored charge is being held constant, because they lead to opposite answers. Insert a slab at constant voltage and the charge, energy and stored field all rise; insert it at constant charge (source disconnected) and the voltage and internal field fall by ε_r while the energy drops. Series layers share D, parallel regions share E.',
      importantNote: 'Air breaks down near 3 MV/m, so a series air gap — a void, a poorly seated washer, an unfilled corner — usually decides the breakdown voltage of an assembly regardless of how strong the solid insulation is. The low-permittivity layer always carries the highest field.',
    },
    {
      id: 'es-gauss-symmetries',
      title: "5. Gauss's Law Derived in All Three Symmetries",
      content: `## 5.1 What the flux integral is actually claiming

Coulomb's law tells you the field of one charge. Gauss's law tells you
something different and, for exam purposes, more useful: it relates the
outward electric flux through *any* closed surface to the charge sitting
inside it, and it says nothing whatever about the charge outside.

$$\\oint_{S} \\varepsilon _{0}\\boldsymbol{E}\\cdot d\\boldsymbol{A} = Q_{\\mathrm{enc}}$$

Written with the flux density $\\boldsymbol{D} = \\varepsilon _{0}\\varepsilon _r\\boldsymbol{E}$ it is even blunter, and this is the form to carry into a dielectric problem:

$$\\oint_{S} \\boldsymbol{D}\\cdot d\\boldsymbol{A} = Q_{\\mathrm{free,\\,enc}}$$

The law is always true and hardly ever useful, because the dot product and
the integral only collapse when the geometry hands you a surface on which
$\\lvert \\boldsymbol{E} \\rvert$ is constant and $\\boldsymbol{E}$ is
everywhere perpendicular to the surface. Exactly three arrangements do that,
and the FE exam draws from all three.

| Symmetry | Surface that works | Area used | Field falls off as |
|---|---|---|---|
| Spherical (point, ball, shell) | concentric sphere | $4\\pi r^{2}$ | $1/r^{2}$ |
| Cylindrical (line, wire, coax) | coaxial cylinder | $2\\pi r L$ | $1/r$ |
| Planar (sheet, plate, slab) | pillbox across the sheet | $2A$ or $A$ | not at all |

![Field against distance for the three Gaussian symmetries, each normalised to its own value at 1 cm: over one decade the spherical case falls by a factor of 100, the cylindrical by 10, and the planar case not at all.](/courses/fe-ee/figures/em2-three-symmetries.svg)

The last column is the fastest sanity check in the whole topic. If a problem
describes a long charged rod and your answer contains $r^{2}$, the wrong
surface was used. Three geometries, three exponents, and the exponent is
fixed by the shape of the source rather than by anything about the charge.

## 5.2 Spherical symmetry, region by region

Put the total charge $Q$ inside a ball of radius $R$, spread uniformly
through the volume, and draw a sphere of radius $r$ around the centre. For
$r > R$ the sphere encloses everything:

$$\\varepsilon _{0}E(r)\\,4\\pi r^{2} = Q \\quad \\Rightarrow \\quad E(r) = \\frac{Q}{4\\pi \\varepsilon _{0}r^{2}}$$

For $r < R$ it encloses only the fraction of the volume it contains,
$Q r^{3}/R^{3}$, and the $r^{3}$ beats the $r^{2}$ in the area:

$$E(r) = \\frac{Q r^{3}/R^{3}}{4\\pi \\varepsilon _{0}r^{2}} = \\frac{Q r}{4\\pi \\varepsilon _{0}R^{3}}$$

so the interior field grows linearly from zero at the centre, peaks at the
surface, and only then begins to fall. A conductor holding the same charge
has it all on the outer skin instead, so the enclosed charge is zero
everywhere inside and $E = 0$ throughout the metal, while the exterior field
is identical. Outside a spherically symmetric distribution, nothing about
the interior arrangement survives.

### Worked Example 1 — a uniformly charged ball, checked against Coulomb

**Given**: $Q = 8.0\\ \\mathrm{nC}$ spread uniformly through a sphere of radius $R = 4.0\\ \\mathrm{cm}$, in air.

**Find**: the field at 2.0 cm, at the surface, and at 10 cm.

At the surface the enclosed charge is the whole 8.0 nC, so

$$E(R) = \\frac{Q}{4\\pi \\varepsilon _{0}R^{2}} = \\frac{(8.98755 \\times 10^{9})(8.0 \\times 10^{-9})}{(0.040)^{2}} = 4.494 \\times 10^{4}\\ \\mathrm{V/m}$$

Inside, scale that surface value linearly: at $r = 2.0$ cm the ratio is
$r/R = 0.50$, so $E = 0.50 \\times 44\\,938 = 22\\,469$ V/m. Outside, scale it
by the inverse square: at $r = 10$ cm the ratio is $R/r = 0.40$, and
$0.40 \\times 0.40 \\times 44\\,938 = 7190$ V/m.

**The independent check.** Every number above came out of Gauss's law, so
verifying it with Gauss's law again would prove nothing. The figure below
carries a second route: the raw Coulomb kernel integrated by adaptive
quadrature over the whole ball, with no appeal to symmetry, the shell
theorem or flux at any point. The two agree to better than one part in
$10^{9}$ at every probe radius, inside and out — which is the evidence that
the $4\\pi$ and the $\\varepsilon _{0}$ landed in the right places.

![Field magnitude against radius for 8 nC spread through a 4 cm ball: the Gauss's-law profile rises linearly to 44.94 kV/m at the surface then falls as one over r squared, with markers from direct numerical integration of Coulomb's law lying on the same curve.](/courses/fe-ee/figures/em2-ball-gauss-vs-coulomb.svg)

The self-energy of that ball is also a two-route quantity. Assembling it
shell by shell gives $U = 3Q^{2}/(20\\pi \\varepsilon _{0}R)$, which evaluates
to **8.628 µJ**; integrating $\\tfrac{1}{2}\\varepsilon _{0}E^{2}$ over all
space, inside and outside, returns the same 8.628 µJ. Note that most of that
energy — 7.19 of the 8.63 µJ — sits *outside* the ball, in the region where
there is no charge at all.

## 5.3 Cylindrical symmetry: the line, the wire and the cable

For a long line carrying $\\lambda$ coulombs per metre, the coaxial cylinder
of radius $r$ and length $L$ has area $2\\pi r L$ on its curved face and no
flux at all through its ends:

$$\\varepsilon _{0}E(r)\\,2\\pi r L = \\lambda L \\quad \\Rightarrow \\quad E(r) = \\frac{\\lambda}{2\\pi \\varepsilon _{0}r}$$

The $L$ cancels, which is why "per unit length" is the natural currency of
every cylindrical problem. Inside a solid charged rod the enclosed fraction
goes as $r^{2}/a^{2}$, one power of $r$ cancels against the area, and

$$E(r) = \\frac{\\lambda r}{2\\pi \\varepsilon _{0}a^{2}} \\quad (r < a)$$

again rising linearly to a peak at the surface.

### Worked Example 2 — how long is long enough

**Given**: a 2.0 m rod carrying a uniform 50 nC/m. **Find**: the field 5.0 cm out from its midpoint, and how badly the infinite-line formula misleads.

The infinite-line answer is

$$E_{\\infty} = \\frac{\\lambda}{2\\pi \\varepsilon _{0}r} = \\frac{50 \\times 10^{-9}}{(6.2831853)(8.8541878 \\times 10^{-12})(0.050)} = 17\\,975\\ \\mathrm{V/m}$$

The honest answer integrates Coulomb's law along the finite rod. For a
segment of half-length $a$ at perpendicular distance $d$ from the midpoint,
the perpendicular components add and the axial ones cancel in pairs:

$$E = \\frac{\\lambda}{4\\pi \\varepsilon _{0}}\\int_{-a}^{a}\\frac{d\\,dz}{(d^{2}+z^{2})^{3/2}} = \\frac{\\lambda a}{2\\pi \\varepsilon _{0}d\\sqrt{d^{2}+a^{2}}}$$

With $a = 1.0$ m and $d = 0.050$ m that gives **17 953 V/m**, a ratio of
0.99875 to the infinite result. Being 40 rod-half-lengths away makes the
approximation good to 0.125%, and the generalisation worth carrying is that
the infinite-line formula is safe whenever the observation distance is under
about a tenth of the length. The same integral was evaluated numerically and
in closed form in the figure pipeline; the two agree to $10^{-12}$ relative.

## 5.4 Planar symmetry, and the factor of two that decides exam questions

A single infinite sheet of surface charge $\\sigma$ throws flux out of both
faces. A pillbox of face area $A$ straddling it encloses $\\sigma A$ and
presents $2A$ of area to the field:

$$\\varepsilon _{0}E\\,(2A) = \\sigma A \\quad \\Rightarrow \\quad E = \\frac{\\sigma}{2\\varepsilon _{0}}$$

A charged conductor surface is a different situation with the same picture.
The field inside the metal is zero, so the pillbox has only *one* live face,
and the whole flux exits on the outside:

$$\\varepsilon _{0}E\\,A = \\sigma A \\quad \\Rightarrow \\quad E = \\frac{\\sigma}{\\varepsilon _{0}}$$

Both results are correct; they answer different questions. The distractor
that trades one for the other appears on almost every FE electrostatics
paper, and the tell is whether the charge sits on an isolated film with
vacuum on both sides, or on the face of a conductor with metal behind it.

### Worked Example 3 — sheets, plates and the field between them

**Given**: two large parallel plates 4.0 mm apart, one carrying $+\\sigma$ and the other $-\\sigma$ with $\\sigma = 20\\ \\mathrm{nC/m^{2}}$, in air.

Treat each plate as an isolated sheet and superpose. Between the plates the
two contributions point the same way and add:

$$E_{\\mathrm{between}} = \\frac{\\sigma}{2\\varepsilon _{0}} + \\frac{\\sigma}{2\\varepsilon _{0}} = \\frac{\\sigma}{\\varepsilon _{0}} = \\frac{20 \\times 10^{-9}}{8.8541878 \\times 10^{-12}} = 2259\\ \\mathrm{V/m}$$

Outside, they point oppositely and cancel exactly, so the field beyond a
charged parallel-plate pair is zero. The potential difference follows from a
uniform field over a fixed gap: $V = E d = 2259 \\times 0.0040 = 9.04$ V. The
factor-of-two story now reads coherently — each sheet alone gives
$\\sigma /2\\varepsilon _{0}$, the pair gives $\\sigma /\\varepsilon _{0}$, and
so does one conductor face, because in both of those cases all the flux is
forced into a single half-space.

## 5.5 The five-step Gauss recipe, and its failure mode

1. Name the symmetry. If moving around a surface of constant distance would
   change the answer, there is no symmetry and Gauss's law will not give a
   number.
2. Draw the surface that makes $\\boldsymbol{E}$ constant and normal.
3. Replace the integral with $E$ times the area of the live faces.
4. Count only the **enclosed** charge. Everything outside contributes exactly
   as much inward flux as outward.
5. Solve, then check the far-field exponent against the table in 5.1.

Step 4 is the examinable one. A charge suspended inside a hollow conducting
shell, a wire inside a grounded conduit, a signal conductor inside a braid:
in each case the exterior field depends only on the algebraic sum of
everything inside the surface. Equal and opposite enclosed charge means no
exterior field, which is the entire argument for shielded cable.`,
      examTip: "Before writing anything, decide which of the three symmetries you are in and whether the field point is inside or outside the source. Those two decisions pick the formula; the arithmetic afterwards is trivial. The single most common wrong answer on planar problems comes from using sigma over two epsilon-nought at a conductor face, where the correct value is twice that because the metal side carries no flux.",
      importantNote: "Gauss's law in the form with D on the left, equal to the enclosed FREE charge, is the version to use whenever a dielectric is present: it lets you find D from the free charge alone and only then divide by the local permittivity to get E. Using the epsilon-nought form inside a dielectric silently drops the factor of epsilon-r.",
    },
    {
      id: 'es-potential-conductors',
      title: '6. Potential, Gradient, Conductors and Images',
      content: `## 6.1 Potential is the line integral of the field

Potential difference is defined as work per unit charge against the field,
which makes it a line integral:

$$V_{A} - V_{B} = -\\int_{B}^{A}\\boldsymbol{E}\\cdot d\\boldsymbol{l}$$

In electrostatics that integral is path-independent, because
$\\nabla \\times \\boldsymbol{E} = 0$ when nothing is changing with time. That
single fact is what makes potential a usable idea: a number can be attached
to each point in space, and a closed loop must return

$$\\oint \\boldsymbol{E}\\cdot d\\boldsymbol{l} = 0$$

which is Kirchhoff's voltage law before there is a circuit to apply it to.

For the three standard symmetries the integral is elementary, and the shapes
are worth recognising on sight:

| Source | Field | Potential (reference) |
|---|---|---|
| Point charge | $Q/(4\\pi \\varepsilon _{0}r^{2})$ | $Q/(4\\pi \\varepsilon _{0}r)$, zero at infinity |
| Long line | $\\lambda /(2\\pi \\varepsilon _{0}r)$ | $-[\\lambda /(2\\pi \\varepsilon _{0})]\\ln r$, zero at a chosen $r_{0}$ |
| Uniform field | $E$ constant | $-E x$, zero at a chosen plane |

The middle row carries a warning: a genuinely infinite line has infinite
charge, so its potential cannot be referenced to infinity. Only differences
are meaningful, and every coaxial answer is a ratio of radii inside a
logarithm for that reason.

Field and potential also disagree about where the interesting places are,
and the exam exploits that. Take the pair worked in section 3 — a
$+2\\ \\mu \\mathrm{C}$ charge at the origin and a $-3\\ \\mu \\mathrm{C}$ charge
0.40 m along the axis — and plot both quantities along the line joining them.

![Field component and potential along the axis of a plus 2 and minus 3 microcoulomb pair: the field reaches 1.123 megavolts per metre at the midpoint and has its only null outside the pair at minus 1.78 metres, while the potential passes through zero at plus 0.16 and minus 0.80 metres, where the field is nowhere near zero.](/courses/fe-ee/figures/em2-superposition-axis.svg)

The field has a single null, and it lies **outside** the pair, 1.78 m beyond
the weaker charge — between two opposite charges the contributions reinforce
and can never cancel. The potential, by contrast, passes through zero twice,
at $x = 0.16$ m and at $x = -0.80$ m, and at neither of those points is the
field remotely zero. A point of zero potential is not a point of zero field,
and a point of zero field is not a point of zero potential; they are
different questions about the same distribution, and a stem that asks for one
while offering the other's answer is a standard construction.

### Worked Example 4 — potential from the field in a coaxial line

**Given**: a coaxial cable with $a = 0.50\\ \\mathrm{mm}$, $b = 3.50\\ \\mathrm{mm}$, polyethylene of $\\varepsilon _r = 2.25$, with the shield grounded and the centre at 1000 V.

The charge per metre follows from Gauss's law in a cylinder, and the field
between the conductors is $E(r) = \\lambda /(2\\pi \\varepsilon _{0}\\varepsilon _r r)$. Integrating that inward from the shield gives the potential directly:

$$V(r) = \\int_{r}^{b}\\frac{\\lambda \\,dr'}{2\\pi \\varepsilon _{0}\\varepsilon _r r'} = \\frac{\\lambda}{2\\pi \\varepsilon _{0}\\varepsilon _r}\\ln \\frac{b}{r}$$

Setting $r = a$ recovers the applied 1000 V and pins $\\lambda$, after which
the field is most conveniently written without $\\lambda$ at all:

$$E(r) = \\frac{V_{0}}{r\\,\\ln (b/a)}, \\qquad \\ln \\frac{b}{a} = \\ln 7 = 1.9459$$

At the inner conductor, $1.9459 \\times 0.50 = 0.9730$ mm of effective
denominator gives $1000 / 0.97296 = 1027.8$ volts per millimetre, i.e.
**1.028 MV/m**. At the shield the same expression gives 0.147 MV/m. The
field ratio is exactly $b/a = 7$: everything the cable has to survive
electrically happens at the inner conductor.

![Radial field and potential in a coaxial line with a 0.5 mm centre and a 3.5 mm shield at 1000 V: the field runs from 1.028 MV/m at the inner conductor down to 0.147 MV/m at the shield, and the potential recovered by numerically integrating that field lands on the closed-form logarithm at every radius.](/courses/fe-ee/figures/em2-coax-field.svg)

The lower panel of that figure is the check: the potential curve was
produced by numerically integrating the field inward from the shield, and
the circles are the closed-form logarithm. They agree to under a microvolt
across the whole gap.

## 6.2 The field is the negative gradient

Run the relation the other way and the field is recovered by
differentiating:

$$\\boldsymbol{E} = -\\nabla V = -\\left(\\frac{\\partial V}{\\partial x}\\hat{x} + \\frac{\\partial V}{\\partial y}\\hat{y} + \\frac{\\partial V}{\\partial z}\\hat{z}\\right)$$

Three consequences are examinable. The field points **downhill** in
potential, which is why the minus sign is not optional. Its magnitude is the
steepest slope, so tightly packed equipotentials mean a strong field. And
because the gradient of a constant is zero, an equipotential region has no
field in it — the statement that a conductor's interior is field-free is the
same statement as its being an equipotential.

### Worked Example 5 — gradient in one variable and in two

**Part (a).** In the coaxial line above, $V(r) = V_{0}\\ln (b/r)/\\ln (b/a)$. Differentiating,

$$E_{r} = -\\frac{dV}{dr} = \\frac{V_{0}}{r \\ln (b/a)}$$

which is the field already found from Gauss's law, and the agreement of the
two routes is the point of doing it twice.

**Part (b).** Suppose a region has $V(x,y) = 400xy$ volts with $x, y$ in
metres. Then $E_{x} = -400y$ and $E_{y} = -400x$, so at the point
$(0.30, 0.20)$ m the components are $-400 \\times 0.20 = -80$ V/m and
$-400 \\times 0.30 = -120$ V/m, giving

$$\\lvert \\boldsymbol{E} \\rvert = \\sqrt{80^{2} + 120^{2}} = 144.2\\ \\mathrm{V/m}$$

directed into the third quadrant. Confirm that this $V$ can exist in a
charge-free region by taking the Laplacian:
$\\partial ^{2}V/\\partial x^{2} + \\partial ^{2}V/\\partial y^{2} = 0 + 0 = 0$, so it satisfies Laplace's equation and no charge density is implied.

## 6.3 Laplace, uniqueness, and solving by grid

Where there is no charge, Gauss's law in differential form collapses to

$$\\nabla ^{2}V = 0$$

and where there is a charge density it becomes Poisson's equation
$\\nabla ^{2}V = -\\rho /\\varepsilon$. The uniqueness theorem is the working
tool: a solution that satisfies Laplace's equation inside a region **and**
matches the potential on its whole boundary is *the* solution. There is no
second one to worry about, so any method that produces such a function —
guessing, separating variables, or relaxing a grid — is legitimate.

Discretising the Laplacian on a square grid turns the equation into a
statement anyone can verify by hand: the potential at a node is the average
of its four neighbours.

$$V_{i,j} = \\tfrac{1}{4}\\left(V_{i+1,j} + V_{i-1,j} + V_{i,j+1} + V_{i,j-1}\\right)$$

### Worked Example 6 — a square box, three sides grounded

**Given**: a square cross-section duct with three walls grounded and the fourth held at 100 V. **Find**: the potential at the centre.

Symmetry answers this with no arithmetic at all. Four copies of the problem,
each with a different wall energised, superpose to a box at 100 V all round;
inside such a box the potential is 100 V everywhere, and by symmetry each of
the four contributes equally. Therefore the centre sits at
$100 / 4 = 25$ V exactly.

That exact value is the yardstick for the numerical routes. A
$201 \\times 201$ grid relaxed by red-black successive over-relaxation
converges in 939 sweeps and lands on **25.000000 V**; the
separation-of-variables series

$$V(x,y) = \\frac{4V_{0}}{\\pi}\\sum_{n\\ \\mathrm{odd}}\\frac{1}{n}\\sin \\frac{n\\pi x}{a}\\,\\frac{\\sinh (n\\pi y/a)}{\\sinh (n\\pi b/a)}$$

gives 25.000000 V as well, and the two agree to within 6 mV everywhere along
the centre line. At a quarter of the way up the box the potential is only
9.54 V, and at three quarters it is 54.05 V — the field crowds toward the
energised wall, exactly as the equipotential spacing in the figure shows.

![Potential up the centre line of a square box with three walls grounded and the fourth at 100 V: the finite-difference grid and the separation-of-variables series lie on the same curve, passing through 9.54 V at quarter height, 25.000 V at the centre and 54.05 V at three-quarter height.](/courses/fe-ee/figures/em2-laplace-square.svg)

## 6.4 Conductors in equilibrium: five statements, one cause

In equilibrium no charge is moving, so no field can survive inside
conducting material — any residual field would drive current until it was
cancelled. Everything else follows.

| Statement | Why | What it is used for |
|---|---|---|
| $\\boldsymbol{E} = 0$ inside the metal | otherwise charge would keep moving | the starting point |
| Net charge lives on the surface | a Gaussian surface just inside encloses nothing | shells, cages |
| The body is one equipotential | $-\\int \\boldsymbol{E}\\cdot d\\boldsymbol{l} = 0$ along any interior path | grounding, screening |
| Field meets the surface at 90 degrees | any tangential component would push surface charge | sketching flux plots |
| $E_{\\mathrm{surface}} = \\sigma /\\varepsilon _{0}$ | all the flux exits on one side | breakdown limits |

The last row sets a hard physical ceiling. Dry air breaks down near
3 MV/m, so no conductor in air can hold more than
$\\sigma _{\\max} = \\varepsilon _{0} \\times 3 \\times 10^{6} = 26.6\\ \\mathrm{\\mu C/m^{2}}$
before the air lets go. Charge crowds onto small radii, so sharp corners
reach that density first — which is why high-voltage hardware is built from
generous smooth curves and corona rings.

## 6.5 The method of images

A grounded conducting plane forces $V = 0$ on itself. A point charge $q$ at
height $h$ above it plus a fictitious $-q$ at depth $h$ below it also forces
$V = 0$ on that plane, by symmetry, and satisfies Laplace's equation
everywhere above it. By uniqueness, the two-charge field **is** the answer
in the upper half-space — while saying nothing at all about the region below
the plane, where the real field is zero and the image does not exist.

$$F = \\frac{q^{2}}{4\\pi \\varepsilon _{0}(2h)^{2}}, \\qquad W = -\\frac{q^{2}}{4\\pi \\varepsilon _{0}(4h)}, \\qquad \\sigma (\\rho ) = \\frac{-q h}{2\\pi (\\rho ^{2}+h^{2})^{3/2}}$$

The energy is *half* the value a real charge pair would have, because the
image is not an independent charge that had to be brought in from infinity —
it is a bookkeeping device for charge the plane rearranged for free.

### Worked Example 7 — 5 nC above a ground plane

**Given**: $q = 5.0\\ \\mathrm{nC}$ held 3.0 cm above a large grounded plane in air.

**Force.** The image sits 6.0 cm away, so

$$F = \\frac{(8.98755 \\times 10^{9})(5.0 \\times 10^{-9})^{2}}{(0.060)^{2}} = 62.41\\ \\mathrm{\\mu N}\\ \\text{, attractive}$$

**Energy.** $W = -62.41\\ \\mathrm{\\mu N} \\times 0.030\\ \\mathrm{m} = -1.872\\ \\mathrm{\\mu J}$, using the fact that the force varies as the inverse square of the separation so the work integral contributes one factor of $h$.

**Induced charge.** Directly beneath the charge the surface density peaks at
$\\sigma (0) = -q/(2\\pi h^{2}) = -0.884\\ \\mathrm{\\mu C/m^{2}}$, and the field
just above the plane there is
$\\lvert \\sigma \\rvert /\\varepsilon _{0} = 99.86$ kV/m. That same 99.86 kV/m
comes out of adding the two point-charge fields, $2kq/h^{2}$, which is the
independent confirmation that the conductor boundary condition and the image
construction describe one situation and not two.

![Induced surface charge density under a 5 nC point charge 3 cm above a grounded plane: it peaks at -0.884 microcoulombs per square metre directly beneath the charge and falls to half that at a radius of 23.0 mm, integrating over the whole plane to exactly -5.000 nC.](/courses/fe-ee/figures/em2-image-charge.svg)

Integrating $\\sigma$ over the entire plane returns **-5.000 nC**: the plane
supplies precisely the image charge, no more and no less. The density has
fallen to half its peak by $\\rho = 23.0$ mm, about three quarters of the
height — so a ground plane only has to extend a few times the standoff
distance to behave like an infinite one, which is the practical rule behind
PCB ground-plane sizing.`,
      examTip: "Potential problems reward laziness in the right place. If a question asks only for a potential DIFFERENCE, never build the field first: integrate along the easiest path, because path independence guarantees the answer is the same. If it asks for a field and gives you a potential function, differentiate rather than reconstructing the charge distribution. And on any grounded-plane problem, write the image charge down immediately - the separation that matters is 2h, not h, and forgetting that inflates the force by a factor of four.",
      importantNote: "The method of images gives the field only on the side of the plane where the real charge sits. Below a grounded plane the field is exactly zero, and a candidate who evaluates the two-charge expression there has answered a question about a different physical system. The same caution applies to the energy: it is half the naive point-pair value, because the induced charge was free.",
    },
    {
      id: 'es-capacitance-dielectrics',
      title: '7. Capacitance from Geometry, and What Dielectrics Really Do',
      content: `## 7.1 One recipe, three geometries

Every capacitance in the syllabus comes from the same four steps, and doing
them once in the abstract makes all three standard results fall out.

1. Put $+Q$ on one conductor and $-Q$ on the other.
2. Find $\\boldsymbol{E}$ between them with Gauss's law.
3. Integrate to get $V = -\\int \\boldsymbol{E}\\cdot d\\boldsymbol{l}$ between the plates.
4. Divide: $C = Q/V$, and watch $Q$ cancel.

That the charge always cancels is the content of the statement that
capacitance is a property of geometry and material, not of how hard you
drive it.

### Worked Example 8 — parallel plates, from scratch

**Given**: area $A$, separation $d$, filled with $\\varepsilon _r$, with $d$ small enough that fringing is negligible.

With $\\sigma = Q/A$ on the inner faces of the plates, step 2 gives
$E = \\sigma /(\\varepsilon _{0}\\varepsilon _r)$, uniform. Step 3 gives
$V = Ed$, and step 4:

$$C = \\frac{Q}{V} = \\frac{\\sigma A}{\\sigma d/(\\varepsilon _{0}\\varepsilon _r)} = \\frac{\\varepsilon _{0}\\varepsilon _r A}{d}$$

Numerically, for $A = 100\\ \\mathrm{cm^{2}}$, $d = 0.50$ mm and
$\\varepsilon _r = 4.5$: the permittivity product is
$8.8541878 \\times 4.5 = 39.844$ (in pF/m), and multiplying by
$A/d = 0.0100/0.00050 = 20.0$ m gives **796.9 pF**. With the dielectric
removed the same plates hold $8.8541878 \\times 20.0 = 177.1$ pF — the ratio
is $\\varepsilon _r$ exactly, as it must be.

### Worked Example 9 — a coaxial capacitor, from scratch

**Given**: inner radius $a$, outer radius $b$, dielectric $\\varepsilon _r$, length $L$ with $L \\gg b$.

Step 2 is the cylindrical Gauss result
$E = \\lambda /(2\\pi \\varepsilon _{0}\\varepsilon _r r)$ with
$\\lambda = Q/L$. Step 3 integrates it across the gap and produces the
logarithm. Step 4:

$$C = \\frac{2\\pi \\varepsilon _{0}\\varepsilon _r L}{\\ln (b/a)}$$

For the cable of Worked Example 4, per metre:
$6.2831853 \\times 8.8541878 \\times 2.25 / 1.9459101 = 64.33$ pF/m. Because
the answer depends on $b/a$ only through a logarithm, cable capacitance is
remarkably insensitive to dimensions: doubling the radius ratio from 7 to 14
lowers it by only a quarter.

The same logarithm hides a design optimum that catches people out. Holding
the shield radius and the working voltage fixed and shrinking the centre
conductor does **not** reduce the stress on it — past a point it raises it,
because $E(a) = V_{0}/[a\\ln (b/a)]$ has a minimum at $b/a = e = 2.718$.

![Field at the inner conductor of a coaxial line against radius ratio, at fixed shield radius and voltage: it falls to a minimum of 776.7 kV/m at a ratio of e and rises on either side, so the worked cable at a ratio of 7 runs 32% above the best achievable.](/courses/fe-ee/figures/em2-coax-optimum.svg)

At $b = 3.5$ mm and 1000 V the best achievable inner-conductor field is
776.7 kV/m; the worked cable's ratio of 7 puts it at 1.028 MV/m, a penalty
of 32%. Real cable is a compromise between that electrical optimum and the
impedance the circuit wants.

### Worked Example 10 — concentric spheres, and the Earth

**Given**: an inner sphere of radius $a = 20\\ \\mathrm{mm}$ inside a shell of radius $b = 25\\ \\mathrm{mm}$, air between.

Steps 2 and 3 give $V = (Q/4\\pi \\varepsilon _{0})(1/a - 1/b)$, so

$$C = \\frac{4\\pi \\varepsilon _{0}ab}{b-a} = \\frac{(1.11265 \\times 10^{-10})(0.020)(0.025)}{0.005} = 11.13\\ \\mathrm{pF}$$

Let $b \\to \\infty$ and this collapses to the capacitance of an isolated
sphere, $C = 4\\pi \\varepsilon _{0}a$, which for the same 20 mm ball is only
**2.225 pF**. That formula is worth keeping because it makes "capacitance to
what?" concrete: an isolated conductor has capacitance to infinity, and the
Earth itself, as a 6371 km sphere, comes out at 709 µF. Let the gap $b-a$
become small compared with $a$ and the spherical formula tends to
$\\varepsilon _{0}(4\\pi a^{2})/(b-a)$, which is the parallel-plate result
with $4\\pi a^{2}$ as the area — a useful reassurance that the three
geometries are one calculation wearing different coordinates.

## 7.2 What the dielectric is doing

A dielectric contains no free charge, but its molecules polarise: bound
positive and negative centres separate slightly, and the material acquires a
polarisation $\\boldsymbol{P}$. Everywhere the polarisation is uniform the
bound charges cancel internally, but at the surfaces they do not, and the
leftover bound sheets oppose the applied field. The bookkeeping that keeps
this manageable is to define

$$\\boldsymbol{D} = \\varepsilon _{0}\\boldsymbol{E} + \\boldsymbol{P} = \\varepsilon _{0}\\varepsilon _r\\boldsymbol{E}, \\qquad \\boldsymbol{P} = \\varepsilon _{0}(\\varepsilon _r - 1)\\boldsymbol{E}$$

so that $\\boldsymbol{D}$ answers only to free charge and can be found before
the material is even considered. The susceptibility
$\\chi _e = \\varepsilon _r - 1$ measures how hard the material polarises: it
is 0 in vacuum, about 1.25 in polyethylene, and around 79 in water at low
frequency.

Inserting a slab therefore does two different things depending on what is
held fixed, and the FE exam relies on candidates conflating them:

| Held fixed | $C$ | $V$ | $Q$ | Field in the gap | Stored energy |
|---|---|---|---|---|---|
| Voltage (source connected) | $\\times \\varepsilon _r$ | unchanged | $\\times \\varepsilon _r$ | unchanged | $\\times \\varepsilon _r$ |
| Charge (source removed) | $\\times \\varepsilon _r$ | $\\div \\varepsilon _r$ | unchanged | $\\div \\varepsilon _r$ | $\\div \\varepsilon _r$ |

For the 100 cm² plates at 0.50 mm: with 100 V applied throughout, filling
with $\\varepsilon _r = 4.5$ raises the stored energy from 0.8854 µJ to
3.9844 µJ, and the source supplies the difference plus the same again. Charge
the air gap to 100 V, **disconnect**, then insert the same slab and the
voltage falls to $100/4.5 = 22.22$ V while the energy drops to 0.1968 µJ —
the slab is pulled in, and the mechanical work it does accounts for the loss.

## 7.3 Boundary conditions, and refraction of the field

At an interface between two dielectrics with no free surface charge, two
conditions apply and both are needed:

$$E_{t1} = E_{t2} \\quad \\text{(tangential E is continuous)}, \\qquad D_{n1} = D_{n2} \\quad \\text{(normal D is continuous)}$$

The first comes from $\\oint \\boldsymbol{E}\\cdot d\\boldsymbol{l} = 0$ around
a flat loop straddling the surface; the second from a pillbox with no free
charge inside. Their consequence is that a field line bends:

$$\\frac{\\tan \\theta _{2}}{\\tan \\theta _{1}} = \\frac{\\varepsilon _{r2}}{\\varepsilon _{r1}}$$

with the angles measured from the normal. Lines lean *toward the interface*
in the higher-permittivity material.

### Worked Example 11 — a field crossing into a dielectric

**Given**: $\\lvert \\boldsymbol{E}_{1} \\rvert = 5000\\ \\mathrm{V/m}$ in air at 60° to the normal, meeting a flat slab of $\\varepsilon _{r2} = 4$.

Split it: the tangential part is $5000 \\sin 60° = 4330.1$ V/m and the normal
part is $5000 \\cos 60° = 2500$ V/m. Tangential $E$ carries straight through
unchanged. Normal $D$ carries through unchanged, so the normal $E$ divides
by 4: $2500 / 4 = 625$ V/m. Reassembling,

$$\\lvert \\boldsymbol{E}_{2} \\rvert = \\sqrt{4330.1^{2} + 625^{2}} = 4375\\ \\mathrm{V/m}, \\qquad \\theta _{2} = \\arctan \\frac{4330.1}{625} = 81.79°$$

and the identity check holds: $\\tan 81.79° / \\tan 60° = 4.00$, the
permittivity ratio.

![Transmitted angle against incident angle at a boundary where the relative permittivity rises by a factor of four: a field at 60 degrees from the normal in air emerges at 81.79 degrees in the dielectric.](/courses/fe-ee/figures/em2-dielectric-refraction.svg)

Note which quantity jumps. The magnitude of $E$ **fell** here, from 5000 to
4375 V/m, even though the tangential component was untouched — the normal
component collapsed by the full factor of four. Getting this backwards, and
increasing $E$ on entering the dielectric, is the standard wrong answer.

## 7.4 Energy: two expressions, one quantity

$$U = \\tfrac{1}{2}CV^{2} = \\tfrac{1}{2}QV = \\frac{Q^{2}}{2C}, \\qquad u = \\tfrac{1}{2}\\varepsilon _{0}\\varepsilon _r E^{2} = \\tfrac{1}{2}\\boldsymbol{D}\\cdot \\boldsymbol{E}$$

The first is circuit bookkeeping, the second is field bookkeeping, and they
must agree because they are the same joules counted differently. Where the
field is uniform, agreement is an easy multiplication. Where it is not, the
energy density does something the lumped formula cannot show: it tells you
*where* the energy is.

### Worked Example 12 — where a coaxial cable keeps its energy

**Given**: the same 0.5 / 3.5 mm polyethylene cable at 1000 V.

Circuit route: $U' = \\tfrac{1}{2}C'V^{2}$ with $C' = 64.33$ pF/m gives
**32.16 µJ/m**. Field route: integrate
$\\tfrac{1}{2}\\varepsilon _{0}\\varepsilon _r E(r)^{2}$ over the annulus,
$dV = 2\\pi r\\,dr$ per metre, and the same 32.16 µJ/m comes back.

The field route then answers a question the circuit route cannot. Because
$u \\propto 1/r^{2}$ while the shell volume grows as $r$, the energy per
decade of radius is constant, and **half the stored energy lies inside
$r = \\sqrt{ab} = 1.323\\ \\mathrm{mm}$** — the geometric mean, not the
arithmetic mean of 2.0 mm. Energy and stress both concentrate near the
centre conductor, which is why cable insulation is graded from the inside
out and why a void near the inner conductor is far more dangerous than the
same void near the shield.`,
      examTip: "Derive rather than memorise when the geometry is unfamiliar: put Q on, use Gauss, integrate to V, divide. It takes ninety seconds and it never gives you the coaxial answer to a spherical question. When a dielectric appears, the first question is always whether the source stayed connected - constant V and constant Q lead to opposite changes in voltage, field and energy, and the problem statement always says which, usually in one word like disconnected or removed.",
      importantNote: "Capacitance depends on geometry and permittivity only. If your expression for C still contains Q or V after the algebra, a cancellation was missed. And in series layers the shared quantity is D, not E, so the layer with the LOWEST permittivity carries the HIGHEST field - which is why a trapped air void, not the solid insulation around it, sets the breakdown voltage of the assembly.",
    },
    {
      id: 'es-problem-sets',
      title: '8. Practice Problems with Full Solutions',
      content: `## 8.1 How to use these

Each problem below states its givens, drives them to a number, and then
names the distractor that the FE exam actually offers alongside the right
answer — together with the wrong number that trap produces. Work the problem
first; the value of the trap line is only realised if you have already
committed to an answer.

## Problem Set A — Coulomb, Gauss and potential

**A1.** Two point charges of 1.0 µC each sit 0.50 m apart in air. Find the force between them.

$$F = \\frac{(8.98755 \\times 10^{9})(1.0 \\times 10^{-6})(1.0 \\times 10^{-6})}{(0.50)^{2}} = 0.03595\\ \\mathrm{N}$$

**Answer: 35.95 mN, repulsive.** *Trap*: using $r$ rather than $r^{2}$ in the
denominator gives 17.98 mN, exactly half. The exam offers both. Force goes as
the inverse square; only potential goes as the inverse first power.

**A2.** An infinitely long line carries 2.0 nC/m. Find $\\lvert \\boldsymbol{E} \\rvert$ at 15 cm.

$$E = \\frac{\\lambda}{2\\pi \\varepsilon _{0}r} = \\frac{2.0 \\times 10^{-9}}{(6.2831853)(8.8541878 \\times 10^{-12})(0.15)} = 239.7\\ \\mathrm{V/m}$$

**Answer: 239.7 V/m.** *Trap*: reaching for the point-charge form
$kQ/r^{2}$ with $Q$ read as 2.0 nC gives 798.9 V/m, more than three times
too large. A line source falls off as $1/r$, and its Gaussian surface is a
cylinder of area $2\\pi rL$, not a sphere.

**A3.** A large flat sheet carries a uniform surface charge of 30 nC/m². Find the field just off its face, in air.

$$E = \\frac{\\sigma}{2\\varepsilon _{0}} = \\frac{30 \\times 10^{-9}}{(2)(8.8541878 \\times 10^{-12})} = 1694\\ \\mathrm{V/m}$$

**Answer: 1694 V/m, pointing away from the sheet on both faces.** *Trap*:
using $\\sigma /\\varepsilon _{0}$ gives 3388 V/m. That is the correct answer
for a CONDUCTOR face, where the metal behind carries no flux, but an
isolated sheet radiates from both sides and each side gets half.

**A4.** A solid conducting sphere of radius 10 cm carries 20 nC. Find $E$ and $V$ at $r = 5$ cm and at $r = 20$ cm.

Inside a conductor the field is zero and the potential is the surface value:

$$E(0.05) = 0, \\qquad V(0.05) = \\frac{(8.98755 \\times 10^{9})(20 \\times 10^{-9})}{0.10} = 1798\\ \\mathrm{V}$$

Outside it behaves as a point charge at the centre:

$$E(0.20) = \\frac{(8.98755 \\times 10^{9})(20 \\times 10^{-9})}{(0.20)^{2}} = 4494\\ \\mathrm{V/m}, \\qquad V(0.20) = 898.8\\ \\mathrm{V}$$

**Answers: 0 and 1798 V inside; 4494 V/m and 898.8 V outside.** *Trap*:
applying the uniformly-charged-insulator formula $kQr/R^{3}$ at $r = 5$ cm
gives 8988 V/m. That formula belongs to charge spread through a volume; a
conductor keeps all of it on the skin, so the interior encloses nothing.

## Problem Set B — Capacitance, dielectrics and energy

**B1.** Parallel plates of area 20 cm² are 0.10 mm apart with $\\varepsilon _r = 3.0$ between them. Find $C$.

$$C = \\frac{\\varepsilon _{0}\\varepsilon _r A}{d}, \\qquad 8.8541878 \\times 3.0 \\times 20.0 = 531.3\\ \\mathrm{pF}$$

using $A/d = 0.0020/0.00010 = 20.0$ m. **Answer: 531.3 pF.** *Trap*: dropping
$\\varepsilon _r$ gives 177.1 pF. Any capacitance answer that ignores a
stated relative permittivity is wrong by exactly that factor.

**B2.** A 50 m coaxial cable has $a = 1.0$ mm, $b = 4.0$ mm and $\\varepsilon _r = 2.3$. Find its total capacitance.

$$C = \\frac{2\\pi \\varepsilon _{0}\\varepsilon _r L}{\\ln (b/a)}, \\qquad \\ln 4 = 1.3863$$

Working per metre first, $6.2831853 \\times 8.8541878 \\times 2.3 = 127.95$ pF/m
before the logarithm, and $127.95 / 1.3863 = 92.30$ pF/m; over 50 m that is
**4.615 nF**. *Trap*: using $\\log _{10}4 = 0.6021$ instead of the natural
logarithm gives 10.63 nF, too large by the factor $\\ln 10 = 2.303$.

**B3.** A 10 µF and a 20 µF capacitor in series form a branch that is placed in parallel with a 5 µF capacitor, across 24 V. Find the total energy stored and the voltage across the 10 µF unit.

Series pair: $10 \\times 20 / 30 = 6.667$ µF. In parallel with 5 µF:
$6.667 + 5 = 11.667$ µF.

$$U = \\tfrac{1}{2}CV^{2} = \\tfrac{1}{2}(11.667 \\times 10^{-6})(24)^{2} = 3.360\\ \\mathrm{mJ}$$

The series branch carries $Q = 6.667 \\times 24 = 160$ µC, so the 10 µF unit
holds $160/10 = 16$ V and the 20 µF unit holds 8 V. **Answers: 3.360 mJ and
16 V.** *Trap*: combining the series pair by addition, as one would for
resistors, gives 30 µF, a total of 35 µF and 10.08 mJ — three times the
right answer. Capacitors follow the reciprocal rule in series.

**B4.** A dielectric with $\\varepsilon _r = 4$ sustains a field of 2.0 MV/m. Find the energy density.

$$u = \\tfrac{1}{2}\\varepsilon _{0}\\varepsilon _r E^{2} = \\tfrac{1}{2}(8.8541878 \\times 10^{-12})(4)(2.0 \\times 10^{6})^{2} = 70.83\\ \\mathrm{J/m^{3}}$$

**Answer: 70.83 J/m³.** *Trap*: omitting $\\varepsilon _r$ gives 17.71 J/m³.
The energy density inside a dielectric uses the local permittivity, not the
vacuum value.

## Problem Set C — Conductors, boundaries and images

**C1.** A conductor in air carries a surface charge density of 5.0 µC/m². Find the field at its surface, and say whether the air survives.

$$E = \\frac{\\sigma}{\\varepsilon _{0}} = \\frac{5.0 \\times 10^{-6}}{8.8541878 \\times 10^{-12}} = 5.647 \\times 10^{5}\\ \\mathrm{V/m}$$

**Answer: 565 kV/m, comfortably below the 3 MV/m strength of dry air.**
*Trap*: the isolated-sheet formula $\\sigma /(2\\varepsilon _{0})$ gives
282 kV/m, half the correct value — the mirror image of the mistake in A3,
and just as popular.

**C2.** A field of 800 V/m in a medium of $\\varepsilon _{r1} = 2.5$ meets a boundary with $\\varepsilon _{r2} = 6.0$ at 30° from the normal. Find the transmitted angle and magnitude.

$$\\tan \\theta _{2} = \\frac{\\varepsilon _{r2}}{\\varepsilon _{r1}}\\tan \\theta _{1} = 2.4 \\tan 30° = 1.3856 \\quad \\Rightarrow \\quad \\theta _{2} = 54.19°$$

The tangential component $800\\sin 30° = 400$ V/m survives; the normal
component $800\\cos 30° = 692.8$ V/m is scaled by
$\\varepsilon _{r1}/\\varepsilon _{r2}$ to 288.7 V/m, so

$$\\lvert \\boldsymbol{E}_{2} \\rvert = \\sqrt{400^{2} + 288.7^{2}} = 493.3\\ \\mathrm{V/m}$$

**Answers: 54.19° and 493.3 V/m.** *Trap*: inverting the permittivity ratio
gives $\\tan \\theta _{2} = 0.2406$ and $\\theta _{2} = 13.5°$, bending the
line the wrong way. The line always leans toward the interface in the
higher-permittivity medium.

**C3.** A 2.0 nC charge sits 5.0 mm above a large grounded plane in air. Find the attractive force.

$$F = \\frac{q^{2}}{4\\pi \\varepsilon _{0}(2h)^{2}} = \\frac{(8.98755 \\times 10^{9})(2.0 \\times 10^{-9})^{2}}{(0.010)^{2}} = 3.595 \\times 10^{-4}\\ \\mathrm{N}$$

**Answer: 359.5 µN.** *Trap*: using the height $h$ rather than the
charge-to-image separation $2h$ gives 1.438 mN, four times too large. The
image sits as far below the plane as the charge sits above it.

**C4.** A square duct has three walls grounded and the fourth at 60 V. Find the potential at the centre. Then find it if two ADJACENT walls are at 60 V and the other two are grounded.

By the four-fold superposition argument, one energised wall contributes a
quarter of its own potential at the centre: $60 / 4 = 15$ V. Two adjacent
walls contribute independently, so the centre sits at
$15 + 15 = 30$ V. **Answers: 15 V and 30 V.** *Trap*: averaging the four wall
potentials without noticing that the centre is equidistant from all four —
which happens to give the same answer here, but fails immediately on a
rectangular duct, where the symmetry argument no longer applies and the
series must be summed.`,
      examTip: "In a timed exam the fastest error check is dimensional. Capacitance answers should come out in the picofarad-to-microfarad range for anything the size of laboratory hardware; a field in air above about 3 MV/m means either an arc or an arithmetic slip; and any answer containing epsilon-nought in a numerator rather than a denominator is almost certainly upside down.",
      importantNote: "Every trap named in these solutions is a factor error, not a conceptual gulf: a factor of two between sheet and conductor, a factor of four between h and 2h, a factor of 2.303 between log and ln, a factor of epsilon-r from a forgotten dielectric. Getting the physics right and the factor wrong scores zero, so the last thing to check before moving on is always the constant in front.",
    },
  ],
  keyTakeaways: [
    "Coulomb's law: F = kQ₁Q₂/r²; electric field E = F/q = kQ/r².",
    "Gauss's law ∮E·dA = Q_enc/ε₀ is the fastest method for symmetric geometries.",
    'Potential V = kQ/r (1/r, not 1/r²); E = −∇V.',
    'Parallel plate capacitance: C = ε₀ε_r·A/d; energy: U = ½CV².',
    'Series caps: 1/C_eq = Σ(1/C_i); parallel caps: C_eq = ΣC_i (opposite of resistors).',
  ],
},

  fee_magnetostatics: {
  topicId: 'fee_magnetostatics',
  title: "Magnetostatics: Biot-Savart & Ampere's Law",
  domainWeight: 'Electromagnetics · 4–6%',
  overview: "Magnetostatics describes magnetic fields produced by steady (DC) currents. Ampere's law provides efficient field computation for symmetric geometries, while the Biot-Savart law handles arbitrary current distributions. Inductance, magnetic energy, and force on conductors follow directly from these fields.",
  sections: [
    {
      id: 'ms-ampere-biot',
      title: "1. Ampere's Law and Biot-Savart Law",
      content: `## 1.1 Ampere's Law

**$\\oint B\\cdot dl = \\mu _{0}\\cdot I_{enc}$**

The line integral of B around any closed path equals μ₀ times the enclosed current.

### Standard Results (memorize)

| Geometry | Amperian Path | Magnetic Field |
|---|---|---|
| Long straight wire | Circle of radius r | **$B = \\mu _{0}I / (2\\pi r)$** |
| Inside long wire (radius a) | Circle inside wire | **$B = \\mu _{0}Ir / (2\\pi a^{2})$** |
| Solenoid (n turns/m) | Rectangle through coil | **B = μ₀nI** (inside); **B ≈ 0** (outside) |
| Toroid (N total turns) | Circle at radius r | **B = μ₀NI / (2πr)** (inside) |

where **$\\mu _{0} = 4\\pi \\times 10^{-7} T\\cdot m/A$** (permeability of free space).

## 1.2 Biot-Savart Law

**$dB = (\\mu _{0}/4\\pi) \\cdot (I\\cdot dl \\times r) / r^{2}$**

- Used when Ampere's law symmetry is absent (e.g., finite wire, circular loop)
- Circular loop center: **$B = \\mu _{0}I / (2R)$**
- **Right-hand rule**: thumb in current direction, fingers curl in B-field direction

## 1.3 Permeability in Materials

**$\\mu = \\mu _{0}\\cdot \\mu _r$** where μ_r is relative permeability:

| Material Type | $\\mu _r$ | Examples |
|---|---|---|
| Diamagnetic | ≈ 1 (slightly < 1) | Copper, silver |
| Paramagnetic | ≈ 1 (slightly > 1) | Aluminum, platinum |
| Ferromagnetic | **$100 - 100,000$** | Iron, nickel, cobalt |`,
      examTip: "The long-wire formula B = μ₀I/(2πr) is the most-tested magnetostatics result on the FE exam. It decreases as 1/r (not 1/r²). Do not confuse this with Coulomb's law, which has 1/r². Magnetic field from a long wire is 1/r; electric field from a point charge is 1/r².",
    },
    {
      id: 'ms-flux-inductance-force',
      title: '2. Magnetic Flux, Inductance, and Force',
      content: `## 2.1 Magnetic Flux and Inductance

**Magnetic flux**: **$\\Phi = \\int B\\cdot dA$** (units: Weber = T·m²)

**Inductance**: **$L = N\\Phi /I$** (for N-turn coil linking flux Φ)

| Inductor Type | Inductance Formula |
|---|---|
| Solenoid (N turns, length ℓ, area A) | **$L = \\mu _{0}\\cdot \\mu _r\\cdot N^{2}\\cdot A / \\ell$** |
| Toroid (N turns, area A, mean radius r) | **$L = \\mu _{0}\\cdot \\mu _r\\cdot N^{2}\\cdot A / (2\\pi r)$** |
| Coaxial cable (per unit length) | **$L = (\\mu _{0}/2\\pi)\\cdot \\ln (b/a)$** |

**Energy stored**: **$U = \\tfrac{1}{2} LI^{2}$**

Energy density: **$u = B^{2}/(2\\mu _{0})$** (J/m³)

## 2.2 Magnetic Circuits

Analogous to electric circuits:

| Electric | Magnetic |
|---|---|
| EMF (V) | MMF = N·I (ampere-turns) |
| Current I | Flux Φ |
| Resistance R | Reluctance ℜ = ℓ/(μA) |
| Ohm's law: V = IR | **$\\Phi = MMF/\\mathcal{R} = NI\\cdot \\mu A/\\ell$** |

## 2.3 Force on Current-Carrying Conductors

- **Force on wire**: **$F = I\\cdot L \\times B$** (magnitude F = BIL·sin(θ))
- **Force between parallel wires**: **$F/\\ell = \\mu _{0}I_{1}I_{2} / (2\\pi d)$** — attractive for same-direction currents, repulsive for opposite
- **Torque on loop**: **$\\tau = N\\cdot I\\cdot A\\cdot B\\cdot \\sin (\\alpha) = m \\times B$** where m = NIA is magnetic moment`,
      examTip: 'Inductors in series ADD (like resistors): L_eq = L₁ + L₂. Inductors in parallel combine like resistors in parallel: 1/L_eq = 1/L₁ + 1/L₂. This is the SAME rule as resistors (unlike capacitors which are opposite). Think of inductance as "magnetic resistance" — it follows resistor rules.',
      importantNote: 'Two parallel wires carrying current in the SAME direction attract each other. This is counterintuitive but follows from the Lorentz force. This force DEFINED the SI ampere until the 2019 revision of the SI: one ampere was the current producing 2×10⁻⁷ N per metre between two wires one metre apart. Since 2019 the ampere is fixed instead by the elementary charge, and μ₀ = 4π×10⁻⁷ H/m became a measured value rather than an exact one — but it is still exact to within about one part in 10⁹, so every FE calculation is unaffected.',
    },
    {
      id: 'ms-field-profiles',
      title: '3. Field Profiles, Forces, and Worked Magnetostatics',
      content: `## 3.1 Inside the conductor as well as outside

Ampère's law does not stop at the surface of a wire. Take a solid round
conductor of radius a carrying a uniformly distributed current I, and put an
Amperian circle of radius r around its axis. Outside the metal the circle
encloses the whole current; inside, it encloses only the fraction of the
cross-section it contains, $I r^{2}/a^{2}$. Dividing by the circumference in
each case:

$$B = \\mu _{0}Ir/(2\\pi a^{2})\\ \\ (r < a), \\qquad B = \\mu _{0}I/(2\\pi r)\\ \\ (r > a)$$

so the field climbs linearly from zero on the axis, **peaks at the conductor
surface**, and only then falls off as 1/r.

![Flux density against radius for 20 A in a 2 mm wire, with the same current in a coaxial cable shown dashed: identical between the conductors, exactly zero beyond the shield.](/courses/fe-ee/figures/em-wire-b-profile.svg)

**Worked**: I = 20 A in a wire of radius a = 2.0 mm.

| Radius | Which formula | B |
|---|---|---|
| 1.0 mm (inside) | $\\mu _{0}Ir/2\\pi a^{2}$ | 1.00 mT |
| 2.0 mm (surface) | either — they agree | 2.00 mT |
| 5.0 cm (outside) | $\\mu _{0}I/2\\pi r$ | 80.0 µT |

The surface value is worth doing in your head: $\\mu _{0}/2\\pi = 2 \\times 10^{-7}$
exactly, so $B = 2 \\times 10^{-7} \\times 20/0.002 = 2.0$ mT. Carrying that
factor rather than $\\mu _{0}$ itself removes most of the arithmetic from
long-wire problems.

The dashed curve on the figure is the same current returning through a
coaxial shield. Between the conductors nothing changes — the return current
is not yet enclosed. Inside the shield the enclosed current falls to zero,
and beyond it the field is **identically zero**. That is the whole argument
for coaxial construction: equal and opposite enclosed currents leave no
external field to radiate or to couple into a neighbouring circuit.

## 3.2 Coils: field, inductance and energy from one geometry

**Given**: a solenoid of N = 500 turns wound over ℓ = 0.25 m, cross-section
A = 4.0 cm² = 4.0 × 10⁻⁴ m², air core, carrying I = 2.0 A.

- Turn density: $n = N/\\ell = 2000$ turns/m
- Interior field: $B = \\mu _{0}nI = (4\\pi \\times 10^{-7})(2000)(2.0) = 5.03$ mT
- Flux per turn: $\\Phi = BA = 2.01\\ \\mu \\mathrm{Wb}$
- Inductance: $L = N\\Phi /I = \\mu _{0}N^{2}A/\\ell = 503\\ \\mu \\mathrm{H}$
- Stored energy: $U = \\tfrac{1}{2} LI^{2} = 1005\\ \\mu \\mathrm{J}$

Check that last figure a second way, from the field: the energy density is
$B^{2}/(2\\mu _{0}) = 10.05$ J/m³ and the interior volume is
$A\\ell = 1.0 \\times 10^{-4}$ m³, giving 1005 µJ again. Both routes are on
the exam, and agreeing to three digits is a good sign that no factor of two
went missing.

Two structural facts fall out of the inductance formula and get tested
directly. Inductance goes as **N²**, not N — doubling the turns doubles both
the flux and the linkage. And a magnetic core multiplies everything by
$\\mu _r$: the same solenoid wound on a ferrite of $\\mu _r = 2000$ would show
about 1.0 H, until the core saturates.

## 3.3 Forces, torques, and the wire-pair result

| Situation | Relation | Notes |
|---|---|---|
| Straight wire in a uniform field | $F = BIL\\sin \\theta$ | θ between the wire and B |
| Charge in flight | $F = qvB\\sin \\theta$ | always perpendicular to v, so speed never changes |
| Current loop | $\\tau = NIAB\\sin \\alpha$ | α between the loop normal and B |
| Two parallel wires | $F/\\ell = \\mu _{0}I_{1}I_{2}/(2\\pi d)$ | attract if the currents run the same way |

**Worked forces**: a 0.20 m length of wire carrying 6.0 A sits in a 0.35 T
field. Perpendicular, $F = (0.35)(6.0)(0.20) = 0.42$ N; at 30° to the field
that drops to $0.42 \\sin 30° = 0.21$ N; aligned with the field it is zero.

**Worked torque**: a 50-turn coil of 20 mm × 30 mm (A = 6.0 × 10⁻⁴ m²)
carrying the same 6.0 A in the same 0.35 T field, with its plane parallel to
B, feels $\\tau = NIAB = (50)(6.0)(6.0 \\times 10^{-4})(0.35) = 63$ mN·m. That
expression, with the $\\sin \\alpha$ falling to zero as the coil swings into
alignment, is the DC motor in one line — and the reason a practical machine
needs commutation to keep the torque from reversing.

**Worked wire pair**: two long parallel conductors 10 cm apart, each carrying
10 A in the same direction, attract with
$F/\\ell = (2 \\times 10^{-7})(10)(10)/0.10 = 2.0 \\times 10^{-4}$ N/m, i.e.
0.20 mN per metre. It is a tiny force at 10 A and a violent one during a
fault: the dependence on $I_{1}I_{2}$ means a 20 kA short between busbars at
the same spacing produces about 800 N per metre, which is why switchgear
bracing is a mechanical design problem, not just a thermal one.

## 3.4 Getting the direction right

Nearly all lost marks in magnetostatics are sign and direction errors, not
algebra. Three rules cover every case on the exam:

- **Field around a current**: right thumb along conventional current, fingers
  curl the way B circulates.
- **Force on a current**: point the fingers along I, curl them into B, and
  the thumb gives $I\\boldsymbol{L} \\times \\boldsymbol{B}$. Reverse either I
  or B and the force reverses; reverse both and it does not.
- **Induced effects (Lenz)**: the induced current opposes the *change* in
  flux, not the flux. An approaching magnet is repelled, a receding one is
  attracted.

A useful sanity check for the wire pair: two same-direction currents each sit
in the other's field, and applying the force rule to either one gives a force
pointing at the other. Antiparallel currents push apart — which is why the
two legs of a shorted loop try to open it out into a circle.`,
      examTip: 'Carry μ₀/2π = 2 × 10⁻⁷ as a single constant. Long-wire field becomes B = 2 × 10⁻⁷ I/r and the force between two wires becomes F/ℓ = 2 × 10⁻⁷ I₁I₂/d, both of which can be done without a calculator. If a problem gives a wire radius, check whether the field point is inside the metal before reaching for the 1/r formula — inside, B grows with r instead.',
      importantNote: 'The magnetic force on a moving charge is always perpendicular to its velocity, so a static magnetic field can bend a trajectory but can never change the particle\'s speed or kinetic energy. Any problem claiming a magnetic field did work on a free charge has an electric field hiding in it somewhere.',
    },
    {
      id: 'ms-circuits-energy',
      title: '4. Magnetic Circuits, Air Gaps, and Inductance from Energy',
      content: `## 4.1 The analogy, used quantitatively

The magnetic-circuit analogy is not a mnemonic; it is an exact consequence of
Ampère's law applied to a closed flux path in which almost all the flux stays
inside high-permeability material. Around such a loop, NI (the
magnetomotive force) drives a flux Φ against a reluctance
$\\mathfrak{R} = \\ell /(\\mu A)$, and reluctances in a series path add exactly
as resistances do.

**Given**: a laminated core of mean magnetic path length 0.30 m, relative
permeability 2000, uniform cross-section 4.0 cm², cut by a 1.0 mm air gap,
wound with 400 turns carrying 1.5 A.

**Reluctances**, each from $\\ell /(\\mu A)$:

- Core: $0.30/[(4\\pi \\times 10^{-7})(2000)(4 \\times 10^{-4})] = 2.98 \\times 10^{5}$ A·t/Wb
- Gap: $0.0010/[(4\\pi \\times 10^{-7})(4 \\times 10^{-4})] = 1.99 \\times 10^{6}$ A·t/Wb

**One millimetre of air has 6.7 times the reluctance of 300 millimetres of
iron.** Everything else follows from that ratio:

$$\\Phi = NI/(\\mathfrak{R}_{core} + \\mathfrak{R}_{gap}) = 600/(2.288 \\times 10^{6}) = 262\\ \\mu \\mathrm{Wb}$$

giving a core flux density of $B = \\Phi /A = 0.656$ T and an inductance of
$L = N^{2}/\\mathfrak{R}_{total} = 69.9$ mH. Close the gap and the same
winding would give 2011 µWb, 5.03 T and 536 mH — except that no core reaches
5 T, so it would saturate long before, which is exactly the point of the next
section.

![Core flux against air-gap length for two core permeabilities: they differ only near zero gap, because a millimetre of air dominates the reluctance.](/courses/fe-ee/figures/em-magnetic-circuit-gap.svg)

## 4.2 Why the gap is deliberate

The figure answers a question the formula only implies: what does the core
material buy you once a gap is present? At g = 1 mm, raising $\\mu _r$ from
2000 to 5000 — a different, more expensive material — moves the flux from 262
to 285 µWb, an improvement of 8.5%. With no gap the same change would have
been a factor of 2.5. Gapped inductors are therefore **defined by their
geometry rather than by their material**, which is why they hold their value
over temperature and from unit to unit.

The gap also decides where the energy lives. Total stored energy here is
$\\tfrac{1}{2} LI^{2} = 78.7$ mJ. Splitting it with $u = B^{2}/(2\\mu)$ over
each volume, with B continuous across the boundary:

| Region | Volume | Energy density | Energy |
|---|---|---|---|
| Air gap | $4 \\times 10^{-7}$ m³ | 171 kJ/m³ | 68.4 mJ |
| Iron core | $1.2 \\times 10^{-4}$ m³ | 85.5 J/m³ | 10.3 mJ |

**87% of the energy is stored in a millimetre of air**, in a volume 300 times
smaller than the core. High permeability means low energy density at a given
B, so a magnetically soft core is a good flux conductor and a poor energy
store. Any inductor whose job is to hold energy between switching cycles — a
buck converter choke, a flyback transformer — has a gap for that reason, and
a transformer, whose job is to couple rather than to store, does not.

## 4.3 Three ways to get inductance, and when to use each

| Route | Expression | Use it when |
|---|---|---|
| Flux linkage | $L = N\\Phi /I$ | the flux is easy to find (solenoid, toroid) |
| Reluctance | $L = N^{2}/\\mathfrak{R}$ | the path is a core, possibly gapped |
| Energy | $L = 2U/I^{2}$ | the field is known but the flux is awkward |

The energy route is the one that rescues geometries where "how many turns
link this flux" has no clean answer — the internal inductance of a round
wire, or the inductance per unit length of a coaxial line, where integrating
$B^{2}/2\\mu _{0}$ over the space between the conductors reproduces
$(\\mu _{0}/2\\pi)\\ln (b/a)$ directly. For a cable with b/a = 3.49 that is
0.250 µH/m, and the same geometry in polyethylene gives 100.1 pF/m, so the
pair returns in the transmission-line topic as
$Z_{0} = \\sqrt{L'/C'} = 50.0\\ \\Omega$ — the standard coaxial impedance. (An
inductance per metre and an impedance are different quantities in different
units; only the ratio of L' to C' has ohms in it.)

## 4.4 Coupling between two coils

When part of one coil's flux threads another, the pair has a mutual
inductance $M = k\\sqrt{L_{1}L_{2}}$, where the coupling coefficient k runs
from 0 (no shared flux) to 1 (every line shared). Air-cored coils side by
side might reach 0.3; windings on a common closed core reach 0.98 or better.

**Worked**: $L_{1} = 10$ mH and $L_{2} = 40$ mH with k = 0.85 give
$M = 0.85\\sqrt{(10)(40)} = 17$ mH. Wired in series so their fields aid,
the pair measures $L_{1} + L_{2} + 2M = 84$ mH; reverse one winding and it
measures $L_{1} + L_{2} - 2M = 16$ mH. Measuring both ways and taking the
difference is the standard bench method for M, since
$M = (L_{aiding} - L_{opposing})/4 = (84 - 16)/4 = 17$ mH.

The same M is what makes a transformer work and what makes crosstalk a
problem; the only difference is whether the coupling was intended. Induced
voltage in the second coil is $v_{2} = M\\,di_{1}/dt$, so a fast-switching
current in one loop couples into a neighbour in proportion to how quickly it
changes — the reason di/dt, not current, is the quantity that keeps power
electronics layouts honest.`,
      examTip: 'For a gapped core, compute the two reluctances separately before doing anything else. The gap almost always dominates, so a good first estimate of flux is simply NI divided by the gap reluctance μ₀A/g — and if that estimate is within 10% of your full answer, the core material is irrelevant to the problem and you can stop worrying about μ_r.',
      importantNote: 'Reluctance is not resistance: no energy is dissipated in driving flux around a magnetic circuit, and the analogy breaks down entirely once the core saturates, because ℜ = ℓ/(μA) assumes a constant μ. Above the knee of the B–H curve the effective μ collapses and the flux stops rising with current.',
    },
    {
      id: 'ms-biot-savart-detail',
      title: '5. Biot-Savart, Element by Element',
      content: `## 5.1 The law, and why it is the last resort

Biot-Savart is the magnetostatic counterpart of Coulomb's law: it gives the
contribution of one short piece of current-carrying wire and asks you to add
up the rest.

$$d\\boldsymbol{B} = \\frac{\\mu _{0}}{4\\pi}\\,\\frac{I\\,d\\boldsymbol{l} \\times \\hat{\\boldsymbol{r}}}{r^{2}}$$

Three features of that expression decide every problem built on it. The
cross product means an element contributes **nothing** along its own
direction, so the wire in front of you and the wire behind you both push
their field sideways. The $1/r^{2}$ is the same inverse square Coulomb has,
even though the finished long-wire answer goes as $1/r$ — the extra power is
spent adding up an infinite line of elements. And $\\mu _{0}/4\\pi = 10^{-7}$
exactly in the definition used here, which makes the arithmetic of every
magnetostatics problem a matter of shifting a decimal point.

Use Ampère's law whenever the symmetry allows it. Reach for Biot-Savart only
when it does not: finite wires, loops, arcs, and anything on an axis.

## 5.2 The straight segment

For a straight filament, take $d$ as the perpendicular distance from the
field point to the line of the wire, and let the ends subtend angles
$\\alpha _{1}$ and $\\alpha _{2}$ measured from that perpendicular. The
integral is elementary:

$$B = \\frac{\\mu _{0}I}{4\\pi d}\\left(\\sin \\alpha _{2} - \\sin \\alpha _{1}\\right)$$

For a segment of half-length $a$ with the field point opposite its midpoint,
the angles are symmetric and this reduces to

$$B = \\frac{\\mu _{0}I a}{2\\pi d\\sqrt{a^{2}+d^{2}}}$$

Let $a \\to \\infty$ and the square root tends to $a$, recovering the familiar
$\\mu _{0}I/2\\pi d$. The finite result is always **smaller** than the infinite
one, because a finite wire has less of itself to contribute.

### Worked Example 13 — when may a bench wire be called infinite

**Given**: a straight conductor 0.50 m long carrying 10 A. **Find**: the flux density 20 mm out from its midpoint, and the error made by the infinite-wire formula.

$$B = \\frac{(2 \\times 10^{-7})(10)(0.25)}{(0.020)\\sqrt{(0.25)^{2}+(0.020)^{2}}} = 99.68\\ \\mathrm{\\mu T}$$

The infinite-wire value at the same distance is $2 \\times 10^{-7} \\times 10/0.020 = 100.0$ µT, so the ratio is $99.68 / 100.0 = 0.9968$ — an error of
0.32%. The rule that generalises: the infinite formula is good to better
than 1% while the observation distance is under about a tenth of the wire
length, and it has degraded to 29% by the time you stand off one half-length.

![Flux density against perpendicular distance for a 0.5 m segment carrying 10 A, compared with the infinite-wire result, with the ratio of the two plotted beneath: 99.68 against 100.0 microtesla at 20 mm, falling to 71% of the infinite value at a distance equal to the half-length.](/courses/fe-ee/figures/em2-biot-segment.svg)

The circles on that figure are not the closed form redrawn. They are the
Biot-Savart integral evaluated numerically, element by element, along the
same filament — the independent route that confirms the closed form carries
its $4\\pi$ in the right place. The two agree to one part in $10^{12}$.

## 5.3 The circular loop on its axis

Every element of a circular loop is the same distance
$\\sqrt{R^{2}+z^{2}}$ from a point on the axis, and the components
perpendicular to the axis cancel by symmetry. What survives is

$$B_{z} = \\frac{\\mu _{0}I R^{2}}{2(R^{2}+z^{2})^{3/2}}$$

At the centre, $z = 0$ and this collapses to the result worth memorising:

$$B_{\\mathrm{centre}} = \\frac{\\mu _{0}I}{2R}$$

Notice there is no $\\pi$ in the denominator. The commonest wrong answer on
loop questions is $\\mu _{0}I/2\\pi R$, borrowed from the straight wire, and it
is low by a factor of $\\pi$.

### Worked Example 14 — one loop, then two

**Given**: a single circular turn of radius 10.0 cm carrying 5.0 A in air.

At the centre, with $\\mu _{0} = 1.2566371\\ \\mathrm{\\mu H/m}$,

$$1.2566371 \\times 5 / 0.20 = 31.42\\ \\mathrm{\\mu T}$$

One radius up the axis, $z = R$ makes the bracket $(2R^{2})^{3/2}$, so the
field falls by $2^{3/2} = 2.8284$: $31.4159 / 2.8284 = 11.11$ µT. The
half-field point is closer than most people guess — the axial field of a
loop is a sharply peaked thing.

**Now add a second identical loop one radius away.** At the midpoint each
contributes $\\mu _{0}IR^{2}/[2(R^{2}+R^{2}/4)^{3/2}]$, and the pair total is

$$B = \\left(\\tfrac{4}{5}\\right)^{3/2}\\frac{\\mu _{0}I}{R} = 31.4159 \\times 1.4311 = 44.96\\ \\mathrm{\\mu T}$$

That spacing is chosen because it makes the second derivative of the field
vanish at the midpoint, leaving a genuinely flat region: the pair holds
44.96 µT to within 0.1% across a span of 0.346 R. That is the Helmholtz
arrangement, and it is how a uniform reference field is made in a laboratory.

![On-axis flux density for a single 10 cm loop at 5 A and for a Helmholtz pair of the same loops: the single loop peaks at 31.42 microtesla and falls to 11.11 at one radius, while the pair reaches 44.96 microtesla with a flat top.](/courses/fe-ee/figures/em2-loop-axis.svg)

## 5.4 Stacking loops into a solenoid

A solenoid is a stack of loops, so its on-axis field is the loop expression
integrated along the winding. With $n$ turns per metre over a length
$\\ell$ and radius $R$, measuring $z$ from the centre,

$$B(z) = \\frac{\\mu _{0}nI}{2}\\left[\\frac{z+\\ell /2}{\\sqrt{(z+\\ell /2)^{2}+R^{2}}} - \\frac{z-\\ell /2}{\\sqrt{(z-\\ell /2)^{2}+R^{2}}}\\right]$$

Two limits fall straight out and both are examinable. Deep inside a long
coil both fractions saturate at $\\pm 1$ and $B \\to \\mu _{0}nI$, the ideal
value. Exactly at the mouth one fraction goes to zero, so the field there is
**half** the interior value — a fact that explains why coil ends leak and
why an air-cored inductor's calculated value is always optimistic.

### Worked Example 15 — how ideal is a real solenoid

**Given**: 500 turns wound over 0.25 m on a former of cross-section 4.0 cm², carrying 2.0 A in air.

The turn density is $n = 500/0.25 = 2000$ per metre and the ideal field is
$\\mu _{0}nI = 5.0265$ mT. The former's radius follows from its area:
$R = \\sqrt{A/\\pi} = 11.28$ mm, which is small compared with the half-length
of 125 mm, so the coil should be close to ideal. Evaluating the expression
above at $z = 0$ gives **5.0062 mT**, low by 0.40%; at the mouth it gives
**2.5107 mT**, which is $0.4995$ of the ideal value.

![On-axis field along a 500-turn solenoid 25 cm long at 2 A: it holds 5.006 millitesla across the interior against an ideal 5.027, and falls to 2.511 millitesla at the mouth, exactly half.](/courses/fe-ee/figures/em2-solenoid-profile.svg)

The centre value was also produced by numerically stacking discrete loops
rather than by evaluating the closed form, and the two agree to eleven
digits — the independent confirmation that the bracketed expression is the
loop formula summed, and not something adjacent to it.`,
      examTip: "Two constants save time on every magnetostatics problem: mu-nought over four pi is exactly ten to the minus seven, and mu-nought over two pi is exactly two times ten to the minus seven. Almost every answer is one of those times a current over a length. And keep the loop and wire results apart - the loop centre is mu-nought I over 2R with no pi, the wire is mu-nought I over 2 pi r with one.",
      importantNote: "The half-field-at-the-mouth result for a solenoid is not an approximation, it is exact for the ideal winding, and it is the reason a short coil never reaches mu-nought n I anywhere. If a problem gives a coil whose length is comparable with its diameter, the ideal formula can be 20 percent or more optimistic and the full expression is required.",
    },
    {
      id: 'ms-ampere-flux-detail',
      title: "6. Ampere's Law, Flux, and the Divergence-Free Field",
      content: `## 6.1 The law and the choice of loop

$$\\oint_{C}\\boldsymbol{B}\\cdot d\\boldsymbol{l} = \\mu _{0}I_{\\mathrm{enc}}$$

Ampère's law is the magnetic twin of Gauss's law and it fails and succeeds
for the same reasons. It is always true; it yields a number only when a loop
can be drawn on which $\\lvert \\boldsymbol{B} \\rvert$ is constant and
$\\boldsymbol{B}$ runs along the path. In a magnetic material the useful form
uses the field intensity $\\boldsymbol{H} = \\boldsymbol{B}/\\mu$, because $H$
answers only to the conduction current:

$$\\oint_{C}\\boldsymbol{H}\\cdot d\\boldsymbol{l} = I_{\\mathrm{enc}} = NI \\quad \\text{for an N-turn winding}$$

The right-hand side is signed. Current threading the loop one way counts
positive, the other way negative, and the sense is set by the right-hand
rule applied to the direction the loop is traversed.

## 6.2 The wire, and then the whole cable

Inside a solid conductor of radius $a$ carrying $I$ uniformly, a circle of
radius $r$ encloses $I r^{2}/a^{2}$, so the field rises linearly; outside it
encloses everything and the field falls as $1/r$. Add a coaxial return
conductor and two more regions appear. With inner radius $a$, shield inner
radius $b$ and shield outer radius $c$:

| Region | Enclosed current | Flux density |
|---|---|---|
| $r < a$ | $I r^{2}/a^{2}$ | $\\mu _{0}Ir/(2\\pi a^{2})$, rising |
| $a < r < b$ | $I$ | $\\mu _{0}I/(2\\pi r)$, falling |
| $b < r < c$ | $I\\left[1 - (r^{2}-b^{2})/(c^{2}-b^{2})\\right]$ | falling faster |
| $r > c$ | $0$ | exactly zero |

### Worked Example 16 — the whole radial profile of a shielded cable

**Given**: 20 A out along a 1.0 mm centre conductor and back through a shield running from 3.0 mm to 3.5 mm.

At the surface of the centre conductor,
$B = 2 \\times 10^{-7} \\times 20/0.0010 = 4.00$ mT, and that is the peak
anywhere in the cable. Halfway across the dielectric at $r = 2.0$ mm the
same expression gives 2.00 mT. Inside the shield at $r = 3.2$ mm the
enclosed current has already dropped to

$$I_{\\mathrm{enc}} = 20\\left[1 - \\frac{(3.2)^{2}-(3.0)^{2}}{(3.5)^{2}-(3.0)^{2}}\\right] = 12.37\\ \\mathrm{A}$$

giving 0.773 mT. Beyond $r = 3.5$ mm the enclosed current is zero and so is
the field — **exactly** zero, not approximately. That single row is the
entire engineering case for coaxial construction: a cable whose go and
return currents are concentric radiates nothing and couples into nothing,
however large the current.

## 6.3 Solenoid and toroid

For a long solenoid, run the Amperian rectangle with one long side inside
the coil parallel to the axis, one long side outside where the field is
negligible, and two short sides perpendicular to $\\boldsymbol{B}$ that
contribute nothing:

$$B\\ell = \\mu _{0}(n\\ell)I \\quad \\Rightarrow \\quad B = \\mu _{0}nI$$

For a toroid, run a circle at radius $r$ through the window. It encloses all
$N$ turns once each:

$$B(2\\pi r) = \\mu _{0}NI \\quad \\Rightarrow \\quad B(r) = \\frac{\\mu _{0}NI}{2\\pi r}$$

which is not uniform across the window. The mean-radius value is a
convenience, not the answer, and how good a convenience it is depends on how
fat the toroid is.

### Worked Example 17 — how non-uniform is a toroid

**Given**: 800 turns on an air core with inner radius 40 mm, outer radius 60 mm and a square window 15 mm high, carrying 1.2 A.

$$B(r) = \\frac{(2 \\times 10^{-7})(800)(1.2)}{r} = \\frac{1.92 \\times 10^{-4}}{r}$$

so $B = 4.80$ mT at the inner wall, 3.84 mT at the mean radius of 50 mm and
3.20 mT at the outer wall. The inner wall runs $4.80 / 3.84 = 1.25$ times
the mean and the outer wall $3.20 / 3.84 = 0.833$ of it — a spread of 50%
across the window. Saturation always begins at the inner wall for this
reason.

![Flux density across the window of an 800-turn air toroid at 1.2 A: it falls from 4.80 millitesla at the 40 mm inner wall through 3.84 at the mean radius to 3.20 at the 60 mm outer wall.](/courses/fe-ee/figures/em2-toroid-radial.svg)

Integrating that $1/r$ profile over the window gives the flux and hence the
exact inductance,

$$L = \\frac{\\mu _{0}N^{2}h}{2\\pi}\\ln \\frac{b}{a} = 778.5\\ \\mathrm{\\mu H}$$

while the mean-radius shortcut $L = \\mu _{0}N^{2}A/(2\\pi r_{\\mathrm{mean}})$
with $A = h(b-a)$ gives 768.0 µH. The ratio is
$768.0 / 778.5 = 0.9865$, so the shortcut is 1.35% low here and gets worse
as the toroid gets fatter. The flux integral and the closed-form logarithm
were also computed independently of one another and agree to eleven digits.

## 6.4 Flux, and the field with no sources

Magnetic flux is the surface integral of $\\boldsymbol{B}$, measured in
webers:

$$\\Phi = \\int_{S}\\boldsymbol{B}\\cdot d\\boldsymbol{A}$$

and over a **closed** surface it is always zero:

$$\\oint_{S}\\boldsymbol{B}\\cdot d\\boldsymbol{A} = 0 \\quad \\Leftrightarrow \\quad \\nabla \\cdot \\boldsymbol{B} = 0$$

There is no magnetic charge, so every line that enters a closed surface
leaves it. Three practical consequences follow. Field lines have no ends;
they close on themselves. Flux is conserved along a magnetic circuit exactly
as current is conserved along an electric one, which is what makes the
reluctance analogy work at all. And the normal component of
$\\boldsymbol{B}$ is continuous across any interface — including the face of
an air gap, which is why the gap in a core carries the same $B$ as the iron
and a very much larger $H$.

### Worked Example 18 — flux through a loop beside a wire

**Given**: a long straight wire carrying 100 A, with a rectangular loop 0.50 m long lying in the same plane, its near side 20 mm from the wire and its far side 60 mm away.

The field varies across the loop, so the flux needs an integral:

$$\\Phi = \\int_{d_{1}}^{d_{2}}\\frac{\\mu _{0}I}{2\\pi x}\\,\\ell \\,dx = \\frac{\\mu _{0}I\\ell}{2\\pi}\\ln \\frac{d_{2}}{d_{1}} = (2 \\times 10^{-7})(100)(0.50)\\ln 3$$

which is $10^{-5} \\times 1.0986 = 10.99$ µWb. Dividing by the source current
gives the mutual inductance of the pair, $M = 109.9$ nH, and that number was
also obtained by numerically integrating $B$ over the loop area; the two
agree to eleven digits. Using the mid-loop field times the area instead —
$B$ at 40 mm is 0.50 mT, times $0.50 \\times 0.040 = 0.020$ m² — would give
10.0 µWb, 9% low, because $1/x$ is convex and its average exceeds its
mid-point value.`,
      examTip: "Ampere's law questions are decided before any arithmetic by the answer to one question: what current does my loop actually enclose? Inside a conductor it is a fraction; between a conductor and its return it is all of it; outside a coaxial return it is zero. Draw the loop, shade what it encircles, and only then write the formula.",
      importantNote: "The divergence of B being zero is why flux, not field, is the conserved quantity in a magnetic circuit. When a core narrows, the flux stays the same and B rises in proportion to the area reduction - so the smallest cross-section in a core is where saturation starts, exactly as the smallest conductor in a series circuit is where the heating starts.",
    },
    {
      id: 'ms-inductance-circuits',
      title: '7. Inductance, Coupling, and Magnetic Circuits',
      content: `## 7.1 Three definitions of one quantity

$$L = \\frac{N\\Phi}{I} = \\frac{N^{2}}{\\mathfrak{R}} = \\frac{2U}{I^{2}}, \\qquad v = L\\frac{di}{dt}$$

They are the same number reached from flux linkage, from reluctance and from
stored energy. Which one to use is a question about what the geometry makes
easy, and having all three is what rescues the awkward cases.

| Route | Use it when | Typical case |
|---|---|---|
| $N\\Phi /I$ | the flux is easy and the turns obvious | solenoid, toroid |
| $N^{2}/\\mathfrak{R}$ | the path is a core, possibly gapped | transformer, choke |
| $2U/I^{2}$ | the field is known but "how many turns link it" is not | coaxial line, wire interior |

### Worked Example 19 — the internal inductance of a round conductor

**Given**: a solid round wire of radius $a$ carrying a uniformly distributed current $I$.

The flux inside the metal links only part of the current, so flux linkage is
awkward. The energy route is not. Inside, $B = \\mu _{0}Ir/(2\\pi a^{2})$, and
integrating the energy density over the conductor volume, per metre of
length:

$$U' = \\int_{0}^{a}\\frac{B^{2}}{2\\mu _{0}}\\,2\\pi r\\,dr = \\frac{\\mu _{0}I^{2}}{16\\pi}$$

$$L'_{\\mathrm{int}} = \\frac{2U'}{I^{2}} = \\frac{\\mu _{0}}{8\\pi} = 50\\ \\mathrm{nH/m}$$

That result is startling the first time: **the internal inductance of a
round wire does not depend on its radius at all**. Fatten the wire and the
field weakens but the volume grows, and the two effects cancel exactly.

Outside, the energy between the conductors of a coaxial pair gives the
familiar logarithm. For $a = 1.0$ mm and $b = 3.0$ mm,

$$L'_{\\mathrm{ext}} = \\frac{\\mu _{0}}{2\\pi}\\ln \\frac{b}{a} = (2 \\times 10^{-7})\\ln 3 = 219.7\\ \\mathrm{nH/m}$$

and the total is $0.2197 + 0.0500 = 0.2697$ µH/m, of which the internal part
is $0.0500 / 0.2697 = 0.1854$, about 18.5%. That share is not permanent: at
high frequency the skin effect confines the current to the surface, the
internal flux disappears, and the inductance falls to the external value
alone. An inductance measured at 100 Hz and one measured at 100 MHz are
genuinely different numbers for the same piece of cable.

![Field and accumulated inductance across a coaxial line with a 1 mm inner conductor inside a 3 mm shield: 50 nH per metre builds up inside the wire itself and a further 219.7 nH per metre between the conductors, for 269.7 nH per metre in total.](/courses/fe-ee/figures/em2-coax-inductance.svg)

## 7.2 Mutual inductance and the coupling coefficient

When part of one winding's flux threads a second winding, the pair has a
mutual inductance, and reciprocity makes it a single number:

$$M = \\frac{N_{2}\\Phi _{21}}{I_{1}} = \\frac{N_{1}\\Phi _{12}}{I_{2}}, \\qquad M = k\\sqrt{L_{1}L_{2}}, \\qquad v_{2} = M\\frac{di_{1}}{dt}$$

The coupling coefficient $k$ runs from 0 to 1 and is a statement about
geometry: 1 would mean every line of flux from one winding threads the
other, which no real pair achieves.

### Worked Example 20 — a short secondary on a long primary

**Given**: a primary of 800 turns over 0.30 m on a 6.0 cm² former; a secondary of 150 turns wound tightly over the middle 0.05 m of it.

Every line the primary makes inside the former passes through the secondary,
so $M$ is set by the primary's field and the secondary's turns:

$$M = \\frac{\\mu _{0}N_{1}N_{2}A}{\\ell _{1}} = 301.6\\ \\mathrm{\\mu H}$$

The self-inductances use each winding's own length:
$L_{1} = \\mu _{0}N_{1}^{2}A/\\ell _{1} = 1608.5$ µH and
$L_{2} = \\mu _{0}N_{2}^{2}A/\\ell _{2} = 339.3$ µH. Therefore

$$k = \\frac{M}{\\sqrt{L_{1}L_{2}}} = 0.408$$

and the algebra shows why: the ratio collapses to
$\\sqrt{\\ell _{2}/\\ell _{1}} = \\sqrt{0.05/0.30} = 0.408$. Coupling is poor
here not because flux escapes but because the primary is six times longer
than the secondary, so five sixths of the primary's own flux never sees it.
Ramping the primary at 500 A/s induces $301.6\\ \\mathrm{\\mu H} \\times 500\\ \\mathrm{A/s} = 150.8$ mV in the secondary.

## 7.3 The magnetic circuit, used as a design tool

The analogy is exact whenever nearly all the flux stays inside
high-permeability material:

| Electric | Magnetic | Units |
|---|---|---|
| EMF $\\mathcal{E}$ | magnetomotive force $NI$ | ampere-turns |
| current $I$ | flux $\\Phi$ | webers |
| resistance $R = \\rho \\ell /A$ | reluctance $\\mathfrak{R} = \\ell /(\\mu A)$ | A-t/Wb |
| $I = \\mathcal{E}/R$ | $\\Phi = NI/\\mathfrak{R}$ | — |
| resistances in series add | reluctances in series add | — |

The analogy has two hard limits and both are examinable. No power is
dissipated in driving flux around a magnetic circuit, so reluctance is not
resistance in any energetic sense. And $\\mathfrak{R} = \\ell /(\\mu A)$
assumes a constant $\\mu$, which stops being true above the knee of the B-H
curve.

### Worked Example 21 — designing the winding for a target flux density

**Given**: a core of cross-section 6.0 cm² and mean magnetic path 0.40 m, relative permeability 3000, cut by a 2.0 mm air gap. **Find**: the ampere-turns needed for 1.0 T in the core, and the inductance at 500 turns.

Work in field intensities rather than reluctances; it is faster and it shows
where the effort goes. Since $B$ is continuous across the gap, both regions
sit at 1.0 T, but their $H$ values differ by the permeability ratio:

$$H_{\\mathrm{core}} = \\frac{B}{\\mu _{0}\\mu _r} = 265.3\\ \\mathrm{A/m}, \\qquad H_{\\mathrm{gap}} = \\frac{B}{\\mu _{0}} = 795\\,775\\ \\mathrm{A/m}$$

Multiplying each by its own path length gives the magnetomotive force it
consumes: the core takes $265.3 \\times 0.40 = 106.1$ ampere-turns and the
2 mm gap takes $795775 \\times 0.0020 = 1591.55$ ampere-turns. Adding,

$$NI = 106.10 + 1591.55 = 1697.65\\ \\mathrm{A\\text{-}t}$$

so 500 turns need $1697.65 / 500 = 3.3953$ A. **Two millimetres of air
consumes fifteen times the drive that 400 millimetres of iron does**, and
that ratio is the whole content of gap design. The inductance follows from
$L = N^{2}/\\mathfrak{R}_{\\mathrm{total}} = 88.36$ mH, and the stored energy
at the design current is $\\tfrac{1}{2}LI^{2} = 509.3$ mJ — which the
independent route of integrating $\\tfrac{1}{2}BH$ over the two volumes
reproduces exactly, with 477.5 mJ of it in the gap.

Gapping therefore buys three things at once: an inductance set by geometry
rather than by an uncertain $\\mu _r$, a much larger current before
saturation, and somewhere to actually store energy. It costs drive current,
which is why a transformer — whose job is to couple, not to store — has no
gap at all.`,
      examTip: "For a gapped core, compute the gap magnetomotive force first and treat the iron as a correction. If B over mu-nought times the gap length already accounts for most of the answer, the core material is nearly irrelevant to the problem and any reasonable mu-r will do. That shortcut turns a two-minute calculation into a twenty-second one and it is right far more often than it is wrong.",
      importantNote: "Inductance goes as the SQUARE of the turns, and a core multiplies it by mu-r until saturation. Both facts are routinely tested by changing one number in a stem: doubling the turns quadruples L, and a ferrite of mu-r 2000 turns 500 microhenries into about one henry - right up to the point where the core saturates and the effective mu-r collapses.",
    },
    {
      id: 'ms-forces-hysteresis',
      title: '8. Forces, Hysteresis, and Core Loss',
      content: `## 8.1 The force laws, and getting the angle right

$$\\boldsymbol{F} = I\\boldsymbol{L} \\times \\boldsymbol{B}, \\qquad \\boldsymbol{F} = q\\boldsymbol{v} \\times \\boldsymbol{B}, \\qquad \\boldsymbol{\\tau} = \\boldsymbol{m} \\times \\boldsymbol{B} \\ \\ (\\boldsymbol{m} = NI\\boldsymbol{A})$$

| Situation | Magnitude | Angle is measured between |
|---|---|---|
| Wire in a uniform field | $BIL\\sin \\theta$ | the wire and $\\boldsymbol{B}$ |
| Moving charge | $qvB\\sin \\theta$ | the velocity and $\\boldsymbol{B}$ |
| Current loop | $NIAB\\sin \\alpha$ | the loop **normal** and $\\boldsymbol{B}$ |
| Two parallel wires | $\\mu _{0}I_{1}I_{2}/(2\\pi d)$ per metre | not applicable |

The third row is where marks are lost: the angle is taken from the normal to
the loop, not from its plane, so a coil whose plane contains
$\\boldsymbol{B}$ feels **maximum** torque, and a coil whose plane is
perpendicular to $\\boldsymbol{B}$ feels none.

### Worked Example 22 — force, torque and a charge in flight

**Given**: a 0.20 m length of wire carrying 6.0 A in a uniform 0.35 T field.

Perpendicular to the field, $0.35 \\times 6.0 \\times 0.20 = 0.42$ N. At 30° to
the field, that becomes $0.42 \\times 0.5 = 0.21$ N, and along the field it is
zero.

**Torque.** Wind the same wire into a 50-turn coil of 20 mm by 30 mm, so
$A = 6.0 \\times 10^{-4}$ m², and hold its plane parallel to the field:

$$\\tau = NIAB\\sin \\alpha = 50 \\times 6.0 \\times 0.00060 \\times 0.35 = 0.063\\ \\mathrm{N\\,m}$$

That expression, with $\\sin \\alpha$ collapsing as the coil swings into
alignment, is a DC motor written in one line — and it is why a practical
machine needs commutation to reverse the current before the torque reverses.

**A charge in flight.** An electron moving at $2.0 \\times 10^{6}$ m/s across
a 50 mT field, with $e = 1.602176634 \\times 10^{-19}$ C and
$m_e = 9.1093837 \\times 10^{-31}$ kg, feels

$$F = qvB = 1.602 \\times 10^{-14}\\ \\mathrm{N}, \\qquad r = \\frac{m_e v}{qB} = 0.227\\ \\mathrm{mm}$$

The force is always perpendicular to the velocity, so the speed never
changes and the path is a circle. A static magnetic field can bend a
trajectory but can never do work on a free charge; any problem claiming
otherwise has an electric field hiding in it.

## 8.2 Conductors pushing on each other

Each of two parallel conductors sits in the other's field, and the result is
the cleanest inverse-distance law in the syllabus:

$$\\frac{F}{\\ell} = \\frac{\\mu _{0}I_{1}I_{2}}{2\\pi d} = (2 \\times 10^{-7})\\frac{I_{1}I_{2}}{d}$$

Same-direction currents attract; opposed currents repel. The square
dependence on current is what makes this a structural problem rather than a
curiosity.

![Force per metre between parallel conductors against current, for separations of 50, 100 and 300 mm on log axes: 10 A at 100 mm gives 0.20 millinewtons per metre while a 20 kA fault at the same spacing gives 800 newtons per metre.](/courses/fe-ee/figures/em2-wire-force.svg)

### Worked Example 23 — the same busbars at load and at fault

**Given**: a pair of busbars 50 mm apart.

At a working current of 600 A,
$F/\\ell = (2 \\times 10^{-7})(600)(600)/0.050 = 1.44$ N/m — the weight of a
small apple per metre, entirely ignorable. During a fault whose first peak
reaches 12 kA the same expression gives **576 N/m**, four hundred times as
much, because the force scales as the square of the current while the
geometry is unchanged. Switchgear bracing is therefore a mechanical design
problem driven by the prospective fault current, not by the rating.

### Worked Example 24 — the net force on a loop beside a wire

**Given**: the loop of Worked Example 18 — 0.50 m long, near side 20 mm and far side 60 mm from a wire carrying 100 A — now itself carrying 10 A, with its near side parallel to the wire current.

The two sides parallel to the wire feel opposite forces because they carry
current in opposite directions, and the two perpendicular sides cancel by
symmetry. The near side is attracted:

$$F_{\\mathrm{near}} = \\frac{(2 \\times 10^{-7})(100)(10)(0.50)}{0.020} = 5.00\\ \\mathrm{mN}$$

and the far side, three times further away, is repelled with one third of
that, 1.667 mN. The net is $5.0 - 1.667 = 3.333$ mN, toward the wire. That
net attraction is the mechanism behind every magnetically operated relay and
contactor: a current loop in a non-uniform field is always pulled toward the
stronger region when the flux it makes aids the applied flux.

## 8.3 B-H, hysteresis and where the watts go

Ferromagnetic materials do not have a permeability so much as a history.
Sweeping $H$ up and back down traces a loop rather than a line, and the loop
carries three quantities the exam asks about: the saturation flux density,
the remanence $B_r$ left when $H$ returns to zero, and the coercivity $H_c$
needed to force $B$ back to zero.

To keep every number here computed rather than quoted, the loop below is a
**stated model**, not a datasheet curve: two shifted hyperbolic tangents,

$$B_{\\uparrow}(H) = B_{s}\\tanh \\frac{H - H_{c}}{H_{a}}, \\qquad B_{\\downarrow}(H) = B_{s}\\tanh \\frac{H + H_{c}}{H_{a}}$$

with $B_{s} = 1.8$ T, $H_{c} = 40$ A/m and $H_{a} = 90$ A/m, swept to
$\\pm 500$ A/m. Everything below is an integral of that model.

![A model hysteresis loop swept to plus and minus 500 amperes per metre, with a saturation of 1.8 tesla, a remanence of 0.7512 tesla and a coercivity of 40 amperes per metre, enclosing an area of 288.0 joules per cubic metre per cycle.](/courses/fe-ee/figures/em2-hysteresis-loop.svg)

The remanence follows by setting $H = 0$:
$B_r = 1.8\\tanh (40/90) = 0.7512$ T. The initial slope gives an effective
$\\mu _r = B_{s}/(H_{a}\\mu _{0}) = 15\\,916$ near the origin, falling steadily
as the material saturates.

### Worked Example 25 — hysteresis loss from the loop area

The energy delivered to the material per unit volume in one cycle is the
area the loop encloses:

$$w = \\oint H\\,dB \\quad \\mathrm{[J/m^{3}\\ per\\ cycle]}, \\qquad P_{h} = w\\,f\\,\\mathrm{Vol}$$

For the model above that area is **288.0 J/m³**, computed two ways — by
integrating the separation of the two branches over $H$, and by the shoelace
formula on the closed polygon — which agree to eleven digits.

**Given**: a core of volume 120 cm³ made of this material, driven to the same excursion.

$$288.0 \\times 60 = 17\\,280\\ \\mathrm{W/m^{3}}, \\qquad 17280 \\times 0.00012 = 2.074\\ \\mathrm{W}$$

At 400 Hz the same core dissipates
$288.0 \\times 400 = 115\\,200$ W/m³, i.e.
$115200 \\times 0.00012 = 13.82$ W. Hysteresis loss is proportional to
frequency for a fixed excursion, which is why aircraft power systems at
400 Hz demand a lower-loss core than 60 Hz systems do.

### Worked Example 26 — why cores are laminated

The second loss mechanism is eddy currents circulating in the core itself.
For thin laminations of thickness $t$ and conductivity $\\sigma$, driven
sinusoidally to a peak $B_m$,

$$\\frac{P_{e}}{\\mathrm{Vol}} = \\frac{\\pi ^{2}t^{2}f^{2}B_{m}^{2}\\sigma}{6}$$

**Given**: 0.50 mm laminations of conductivity 2.0 MS/m at 60 Hz and 1.0 T peak. The expression gives 2961 W/m³. Switch to 0.35 mm laminations of the same steel and it gives 1451 W/m³.

The ratio is what matters: $0.50 / 0.35 = 1.4286$, and squaring,
$1.4286 \\times 1.4286 = 2.041$, which matches
$2960.9 / 1450.8 = 2.041$ exactly. **Halving the lamination thickness
quarters the eddy loss.** The two mechanisms also scale differently with
frequency — hysteresis as $f$, eddy currents as $f^{2}$ — so a core that is
hysteresis-dominated at 50 Hz can be eddy-dominated at 5 kHz, which is why
high-frequency magnetics use ferrite, with a conductivity millions of times
lower than steel, instead of thinner and thinner laminations.`,
      examTip: "Sort force questions by what the angle is measured from before touching a calculator. Wire and moving charge take the angle to the field; a loop takes the angle to its normal. A coil lying in the plane of the field is at maximum torque and a coil facing the field is at zero, which is the reverse of most people's first instinct.",
      importantNote: "Loop area is energy per unit volume per CYCLE, so it must be multiplied by both frequency and volume before it becomes watts. Reporting the loop area itself, or the product with frequency, as a power is the classic slip: for the 120 cubic centimetre core here the three numbers are 288 joules per cubic metre, 17.3 kilowatts per cubic metre, and 2.07 watts, and only the last is a power.",
    },
    {
      id: 'ms-problem-sets',
      title: '9. Practice Problems with Full Solutions',
      content: `## 9.1 How to use these

As in the electrostatics chapter, every problem is followed by its full
solution and by the distractor the exam actually offers, named together with
the wrong number it produces. Commit to an answer before reading on.

## Problem Set D — Fields from currents

**D1.** A long straight wire carries 15 A. Find the flux density 8.0 cm away.

$$B = \\frac{\\mu _{0}I}{2\\pi r} = (2 \\times 10^{-7})\\frac{15}{0.080} = 37.5\\ \\mathrm{\\mu T}$$

**Answer: 37.5 µT.** *Trap*: using $\\mu _{0}I/(4\\pi r)$, which is the
Biot-Savart prefactor rather than the finished Ampère result, gives 18.75 µT
— exactly half. The $4\\pi$ belongs to the differential element, not the
integrated wire.

**D2.** A single circular turn of radius 5.0 cm carries 3.0 A. Find the flux density at its centre.

$$B = \\frac{\\mu _{0}I}{2R} = \\frac{1.2566371 \\times 3.0}{0.10} = 37.70\\ \\mathrm{\\mu T}$$

**Answer: 37.70 µT.** *Trap*: importing the straight-wire denominator and
computing $\\mu _{0}I/(2\\pi R)$ gives 12.0 µT, low by a factor of $\\pi$. The
loop result has no $\\pi$ in it.

**D3.** A solenoid of 1200 turns is wound over 40 cm and carries 2.5 A. Find the interior field.

The turn density is $n = 1200/0.40 = 3000$ per metre, so
$B = \\mu _{0}nI = 1.2566371 \\times 3000 \\times 2.5 = 9425$ µT.
**Answer: 9.42 mT.** *Trap*: using the total turns $N$ instead of the turns
per metre $n$ gives 3.77 mT, low by the factor 0.40 m. The solenoid formula
is the only standard result that takes a turn *density*.

**D4.** A toroid of 600 turns on an iron core of relative permeability 800 carries 0.80 A at a mean radius of 8.0 cm. Find the flux density.

$$B = \\frac{\\mu _{0}\\mu _{r}NI}{2\\pi r} = (2 \\times 10^{-7})(800)\\frac{600 \\times 0.80}{0.080} = 0.96\\ \\mathrm{T}$$

**Answer: 0.96 T, close to the knee for many steels.** *Trap*: omitting
$\\mu _r$ gives 1.20 mT, a factor of 800 too small — and an answer in
millitesla for an iron-cored toroid should look wrong immediately.

**D5.** A wire of radius 3.0 mm carries 30 A uniformly. Find the flux density at 1.0 mm, at the surface, and at 1.0 cm from the axis.

Inside, $B = \\mu _{0}Ir/(2\\pi a^{2})$; at the surface and beyond,
$B = \\mu _{0}I/(2\\pi r)$.

$$B(1\\ \\mathrm{mm}) = 0.667\\ \\mathrm{mT}, \\qquad B(3\\ \\mathrm{mm}) = 2.00\\ \\mathrm{mT}, \\qquad B(10\\ \\mathrm{mm}) = 0.600\\ \\mathrm{mT}$$

**Answers as above; the peak is at the surface.** *Trap*: using the outside
formula at 1.0 mm gives 6.00 mT, nine times too large. Inside the metal the
enclosed current is only a fraction of the total, and the field rises with
radius rather than falling.

## Problem Set E — Inductance and magnetic circuits

**E1.** A 250-turn solenoid is 0.20 m long with a cross-section of 3.0 cm² and an air core. Find its inductance.

$$L = \\frac{\\mu _{0}N^{2}A}{\\ell} = \\frac{(1.2566371 \\times 10^{-6})(62500)(3.0 \\times 10^{-4})}{0.20} = 117.8\\ \\mathrm{\\mu H}$$

**Answer: 117.8 µH.** *Trap*: writing $N$ instead of $N^{2}$ gives 0.471 µH,
a factor of 250 too small. Inductance is quadratic in turns because the
turns both create the flux and link it.

**E2.** The same coil carries 4.0 A. Find the stored energy two ways.

Circuit route: $\\tfrac{1}{2}LI^{2} = 0.9425$ mJ. Field route:
$B = \\mu _{0}nI = 6.283$ mT, so $u = B^{2}/(2\\mu _{0}) = 15.71$ J/m³ over a
volume of $3.0 \\times 10^{-4} \\times 0.20 = 6.0 \\times 10^{-5}$ m³, giving
0.9425 mJ again. **Answer: 0.942 mJ by both routes.** *Trap*: using
$u = B^{2}/(2\\mu _{0}\\mu _r)$ with $\\mu _r$ set to something other than 1 for
an air core — the two routes then disagree, which is the signal that
something is wrong.

**E3.** A core of relative permeability 2500 has a mean path of 0.25 m, a cross-section of 5.0 cm² and a 1.5 mm air gap. Find the current in a 300-turn winding needed for 0.80 T in the core.

$$H_{\\mathrm{core}} = \\frac{0.80}{\\mu _{0}(2500)} = 254.65\\ \\mathrm{A/m}, \\qquad H_{\\mathrm{gap}} = \\frac{0.80}{\\mu _{0}} = 636\\,620\\ \\mathrm{A/m}$$

The core consumes $254.65 \\times 0.25 = 63.66$ ampere-turns and the gap
$636620 \\times 0.0015 = 954.93$, so the winding must supply
$63.66 + 954.93 = 1018.6$ ampere-turns and
$I = 1018.6/300 = 3.395$ A. **Answer: 3.40 A.** *Trap*: ignoring the gap
gives 0.212 A, sixteen times too small. A 1.5 mm gap in a 250 mm path is
0.6% of the length and 94% of the drive.

**E4.** Two coils have $L_{1} = 25$ mH, $L_{2} = 100$ mH and $M = 40$ mH. Find $k$, and the series-connected inductance both ways round.

$$k = \\frac{M}{\\sqrt{L_{1}L_{2}}} = \\frac{40}{50} = 0.80$$

Series aiding: $25 + 100 + 80 = 205$ mH. Series opposing:
$25 + 100 - 80 = 45$ mH. **Answers: 0.80, 205 mH and 45 mH.** *Trap*:
computing $k = M/(L_{1}+L_{2}) = 0.32$. The coupling coefficient normalises
by the geometric mean, not the sum, which is why it can never exceed 1.

**E5.** A coaxial line has $a = 0.80$ mm and $b = 2.6$ mm. Find its inductance per metre at DC.

$$L' = \\frac{\\mu _{0}}{2\\pi}\\ln \\frac{b}{a} + \\frac{\\mu _{0}}{8\\pi} = 0.2357 + 0.0500 = 0.2857\\ \\mathrm{\\mu H/m}$$

**Answer: 0.286 µH/m at DC, falling to 0.236 µH/m once skin effect is
established.** *Trap*: quoting only the external term, 0.2357 µH/m, which is
17.5% low at DC. The internal term is a fixed 50 nH/m for any solid round
conductor.

## Problem Set F — Forces and losses

**F1.** A 0.80 m wire carrying 12 A lies at 25° to a uniform 0.60 T field. Find the force.

$$F = BIL\\sin \\theta = 0.60 \\times 12 \\times 0.80 = 5.76\\ \\mathrm{N}\\ \\text{at 90 degrees}$$

and at 25°, $5.76 \\times 0.42262 = 2.434$ N. **Answer: 2.43 N.** *Trap*:
using the cosine gives 5.22 N. For a straight wire the angle is measured
between the wire and the field, and the force vanishes when they are
parallel — so the sine is the only function that can be right.

**F2.** Two busbars 40 mm apart carry an 8.0 kA fault peak. Find the force per metre.

$$\\frac{F}{\\ell} = (2 \\times 10^{-7})\\frac{(8000)(8000)}{0.040} = 320\\ \\mathrm{N/m}$$

**Answer: 320 N/m, about 33 kg per metre.** *Trap*: leaving the separation in
millimetres gives 0.32 N/m, a thousand times too small — and a number that
looks reassuring enough to be accepted without a second glance.

**F3.** A 200-turn coil of area 25 cm² carries 0.50 A in a 0.15 T field, with the plane of the coil parallel to the field. Find the torque.

The plane being parallel to $\\boldsymbol{B}$ puts the normal at 90° to it,
so $\\sin \\alpha = 1$:

$$\\tau = NIAB = 200 \\times 0.50 \\times 0.0025 \\times 0.15 = 0.0375\\ \\mathrm{N\\,m}$$

**Answer: 37.5 mN·m, the maximum for this coil.** *Trap*: taking the angle
from the plane rather than the normal gives $\\sin 0° = 0$ and a torque of
zero — the exact opposite of the truth.

**F4.** A core of volume 8.0 × 10⁻⁴ m³ has a measured loop area of 400 J/m³ per cycle. Find the hysteresis loss at 50 Hz.

$$P_{h} = w f\\,\\mathrm{Vol} = 400 \\times 50 \\times 0.0008 = 16\\ \\mathrm{W}$$

**Answer: 16 W.** *Trap*: stopping at $400 \\times 50 = 20\\,000$ and calling it
20 kW. That figure is watts per cubic metre; the core is not a cubic metre,
it is 0.8 litres.

**F5.** An electron enters a 50 mT field at 2.0 × 10⁶ m/s perpendicular to it. Find the force and the radius of its path, given $e = 1.602176634 \\times 10^{-19}$ C and $m_e = 9.1093837 \\times 10^{-31}$ kg.

$$F = qvB = 1.602 \\times 10^{-14}\\ \\mathrm{N}, \\qquad r = \\frac{m_e v}{qB} = 0.227\\ \\mathrm{mm}$$

**Answers: 16.0 fN and 0.227 mm.** *Trap*: substituting $H = B/\\mu _{0}$ for
$B$ in the force law, which inflates the answer by a factor of about
800 000 and produces a force larger than the electron's weight by twenty
orders of magnitude. The Lorentz force takes $B$ in tesla, never $H$.`,
      examTip: "Every trap in these six problem sets is a factor error rather than a misunderstanding: a factor of two between the Biot-Savart prefactor and the Ampere result, a factor of pi between wire and loop, a factor of the coil length between N and n, a factor of mu-r from a forgotten core, and a factor of a thousand from a length left in millimetres. Before committing an answer, check the units of every length and the presence of every material constant the stem supplied.",
      importantNote: "A sanity range is worth carrying for each quantity. Air-cored coil fields are microtesla to millitesla; iron-cored fields run 0.3 to 1.8 tesla and never higher, because the core saturates. Laboratory inductances are microhenries to henries. Fault forces on busbars are hundreds of newtons per metre. An answer far outside its band is almost always a factor error, and finding it costs seconds where redoing the problem costs minutes.",
    },
  ],
  keyTakeaways: [
    "Ampere's law: ∮B·dl = μ₀I_enc; use for symmetric current distributions.",
    'Long wire: B = μ₀I/(2πr); solenoid: B = μ₀nI inside.',
    'Inductance L = NΦ/I; energy U = ½LI²; energy density u = B²/(2μ₀).',
    'Magnetic circuit: Φ = NI/ℜ where reluctance ℜ = ℓ/(μA).',
    'Force on wire: F = ILB·sin(θ); parallel same-direction wires attract.',
  ],
},

  fee_maxwell: {
  topicId: 'fee_maxwell',
  title: "Maxwell's Equations",
  domainWeight: 'Electromagnetics · 4–6%',
  overview: "Maxwell's four equations unify electricity, magnetism, and optics into a single framework. They predict electromagnetic wave propagation, govern every antenna and waveguide, and underpin all of modern communications. The FE exam tests both integral and differential forms.",
  sections: [
    {
      id: 'mx-four-equations',
      title: "1. The Four Maxwell's Equations",
      content: `## 1.1 Complete Table — Both Forms

| Name | Differential Form | Integral Form | Physical Meaning |
|---|---|---|---|
| **Gauss's law (E)** | $\\nabla \\cdot E = \\rho /\\varepsilon _{0}$ | $\\oint E\\cdot dA = Q_{enc}/\\varepsilon _{0}$ | Charges create electric flux |
| **Gauss's law (B)** | $\\nabla \\cdot B = 0$ | $\\oint B\\cdot dA = 0$ | No magnetic monopoles |
| **Faraday's law** | $\\nabla \\times E = -\\partial B/\\partial t$ | $\\oint E\\cdot dl = -d\\Phi _B/dt$ | Changing B induces E |
| **Ampere-Maxwell** | $\\nabla \\times B = \\mu _{0}J + \\mu _{0}\\varepsilon _{0}\\partial E/\\partial t$ | $\\oint B\\cdot dl = \\mu _{0}I_{enc} + \\mu _{0}\\varepsilon _{0}d\\Phi _E/dt$ | Currents and changing E create B |

## 1.2 Key Physical Insights

- **Gauss (E)**: Electric field lines originate on positive charges, terminate on negative
- **Gauss (B)**: Magnetic field lines always form closed loops (no isolated poles)
- **Faraday**: A time-varying magnetic field induces an electric field (basis for transformers, generators)
- **Ampere-Maxwell**: Steady currents AND time-varying electric fields produce magnetic fields

### Displacement Current

Maxwell's crucial addition: **$J_d = \\varepsilon _{0}\\cdot \\partial E/\\partial t$** (displacement current density)

Without it, Ampere's law fails for capacitors (current flows in but charge builds on plates, creating a changing E between them). Displacement current completes the circuit and enables electromagnetic wave propagation.`,
      examTip: "On the FE exam, you are most likely to be tested on recognizing which equation applies to a scenario. Faraday's law = anything involving induced voltage from changing magnetic flux. Ampere's law = anything involving magnetic field from current. Gauss = relating charge to electric field flux.",
    },
    {
      id: 'mx-wave-equation',
      title: '2. Electromagnetic Wave Equation',
      content: `## 2.1 Deriving the Wave Equation

In **free space** (no charges, no currents: ρ = 0, J = 0), combining Faraday and Ampere-Maxwell gives:

**$\\nabla ^{2}E = \\mu _{0}\\varepsilon _{0} \\cdot \\partial ^{2}E/\\partial t^{2}$**

**$\\nabla ^{2}B = \\mu _{0}\\varepsilon _{0} \\cdot \\partial ^{2}B/\\partial t^{2}$**

These are **wave equations** with propagation velocity:

**$v = 1/\\sqrt{\\mu _{0}\\varepsilon _{0}} = c \\approx 3 \\times 10^{8}\\ \\mathrm{m/s}$**

Maxwell's prediction: light is an electromagnetic wave.

## 2.2 Wave Speed in Materials

In a medium with μ_r and ε_r:

**$v = c / \\sqrt{\\mu _r \\cdot \\varepsilon _r} = 1 / \\sqrt{\\mu \\cdot \\varepsilon}$**

**Index of refraction**: **$n = c/v = \\sqrt{\\mu _r \\cdot \\varepsilon _r}$** (for non-magnetic materials, n ≈ √ε_r)

## 2.3 Intrinsic Impedance

**η = √(μ/ε)**

- Free space: **$\\eta _{0} = \\sqrt{\\mu _{0}/\\varepsilon _{0}} \\approx 377\\ \\Omega$** (≈ 120π Ω)
- In a medium: η = η₀ · √(μ_r/ε_r)
- Relates E and H in a plane wave: **$E = \\eta \\cdot H$**

## 2.4 Boundary Conditions

At interface between two media:
- **Tangential E is continuous**: E_t1 = E_t2
- **Tangential H is continuous** (no surface current): H_t1 = H_t2
- **Normal D jumps by surface charge**: D_n1 − D_n2 = σ_s
- **Normal B is continuous**: B_n1 = B_n2`,
      examTip: 'The intrinsic impedance of free space η₀ ≈ 377 Ω ≈ 120π Ω is a constant worth memorizing. It relates E and H in any plane wave in free space: |E|/|H| = 377 Ω. This appears in power flow (Poynting vector) calculations.',
      importantNote: "Maxwell's displacement current ε₀·∂E/∂t is NOT a real current of moving charges. It is a changing electric field that produces a magnetic field just as real current does. Without it, electromagnetic waves could not exist.",
    },
    {
      id: 'mx-displacement-worked',
      title: '3. Displacement Current and Faraday, With Numbers',
      content: `## 3.1 The capacitor that breaks Ampère's law

Ampère's law in its original form says the circulation of B around a closed
loop equals $\\mu _{0}$ times the current threading **any** surface bounded by
that loop. Wrap the loop around the wire feeding a capacitor and then choose
two different surfaces to hang from it. A flat disc cutting the wire is
pierced by the full charging current. A bag-shaped surface that dodges
between the plates is pierced by nothing at all — no charge crosses the gap.
Same loop, same instant, two contradictory answers. The law as written is
simply inconsistent whenever charge is accumulating somewhere.

Maxwell's repair was to notice that although no charge crosses the gap, the
electric field there is growing, and to add a term proportional to its rate
of change:

$$J_{d} = \\varepsilon _{0}\\,\\partial E/\\partial t, \\qquad I_{d} = \\varepsilon _{0}A\\,dE/dt$$

**Given**: an air-spaced capacitor with plates of A = 100 cm² separated by
d = 0.10 mm, charged from a 10 V source through R = 1.00 kΩ.

- Capacitance: $C = \\varepsilon _{0}A/d = (8.854 \\times 10^{-12})(0.0100)/(1.0 \\times 10^{-4}) = 885$ pF
- Time constant: $\\tau = RC = 0.885\\ \\mu \\mathrm{s}$
- Wire current at t = 0: $V/R = 10.0$ mA, decaying as $e^{-t/\\tau}$
- Current density in the gap at t = 0: $10.0\\ \\mathrm{mA}/0.0100\\ \\mathrm{m^{2}} = 1.00$ A/m²
- Required rate of field growth: $dE/dt = J_{d}/\\varepsilon _{0} = 1.13 \\times 10^{11}$ V/(m·s)

![Wire current and gap displacement current while an 885 pF capacitor charges through 1 kΩ: the two are equal at every instant, and the gap field settles at V/d.](/courses/fe-ee/figures/em-displacement-current.svg)

The two curves in the figure are not merely similar, they are the same
function. Substituting $E = v_{C}/d$ into $I_{d} = \\varepsilon _{0}A\\,dE/dt$
and using $C = \\varepsilon _{0}A/d$ turns the displacement current into
$C\\,dv_{C}/dt$ — which is the capacitor's terminal relation from circuit
theory. **The i = C dv/dt you have used since your first circuits course is
Maxwell's displacement current in disguise.** With the correction in place,
either surface gives the same answer and Ampère's law is consistent again.

The field ends at $V/d = 10/10^{-4} = 100$ kV/m and the plates end up holding
$Q = CV = 8.85$ nC. Once the field stops changing the displacement current
stops too, which is the formal statement of "a capacitor blocks DC".

## 3.2 Faraday's law: two ways to change the flux

$\\Phi _B = \\int B\\cdot dA$ can change because B changes, because the area
changes, or because the orientation changes. Faraday's law does not care
which; the induced emf is $-d\\Phi _B/dt$ in every case, and for an N-turn
coil the linkage multiplies it by N.

**Transformer emf** (B changing): a 20-turn coil of area 0.040 m² lies
perpendicular to a field ramping at 0.25 T/s.
$|\\mathrm{emf}| = NA\\,dB/dt = (20)(0.040)(0.25) = 0.20$ V.

**Motional emf** (area changing): a conducting bar 0.50 m long slides at
12 m/s along rails in a perpendicular 0.40 T field.
$|\\mathrm{emf}| = B\\ell v = (0.40)(0.50)(12) = 2.4$ V. This is the generator
in one line, and the force needed to keep the bar moving against the induced
current is where the mechanical power comes in.

The minus sign is Lenz's law and it is worth stating in the form that
survives the exam: **the induced current flows in whatever direction opposes
the change that created it**. Not the flux, the change in the flux. Push a
magnet toward a loop and the loop's field pushes back; pull it away and the
loop tries to hold on. Anything else would let you extract unlimited energy
from a magnet and a coil.

## 3.3 The equations in matter

The free-space forms in section 1 hide all material response inside
$\\rho$ and J. In a material it is more useful to fold the bound charge into
$D = \\varepsilon E$ and the bound current into $H = B/\\mu$, which leaves the
equations in the form used for guided waves and interfaces:

| Law | In matter | What changed |
|---|---|---|
| Gauss (E) | $\\nabla \\cdot D = \\rho _{free}$ | only free charge appears as a source |
| Gauss (B) | $\\nabla \\cdot B = 0$ | unchanged — there is no magnetic charge to bind |
| Faraday | $\\nabla \\times E = -\\partial B/\\partial t$ | unchanged in form |
| Ampère–Maxwell | $\\nabla \\times H = J_{free} + \\partial D/\\partial t$ | bound currents absorbed into H |

Two constitutive relations complete the set, $D = \\varepsilon _{0}\\varepsilon _r E$
and $B = \\mu _{0}\\mu _r H$, plus Ohm's law in point form, $J = \\sigma E$. The
practical consequence for the exam is that boundary conditions are always
stated in terms of the pair that survives: **tangential E and H are
continuous, normal D and B are continuous** (the first up to a surface
current, the second up to a surface charge).

## 3.4 What each equation forbids

Reading the set as a list of prohibitions is often faster than reading it as
a list of permissions, and it is how scenario questions are best attacked:

- $\\nabla \\cdot B = 0$ forbids a field line that begins or ends. Any answer
  showing magnetic flux emerging from a pole and stopping is wrong; the lines
  close through the magnet.
- $\\nabla \\cdot D = \\rho$ forbids electric flux without charge. Field lines
  in electrostatics terminate only on charge.
- Faraday's law forbids a changing magnetic flux without an accompanying
  electric field — which is why a shorted turn anywhere near a transformer
  core carries current, and why a loop of scope ground lead picks up mains
  hum.
- Ampère–Maxwell forbids a discontinuous total current. Conduction current
  can stop, but only where displacement current takes over.

The last two together are the engine of wave propagation: a changing E makes
B, that changing B makes E, and the pair walks off into space at a speed set
entirely by $\\varepsilon _{0}$ and $\\mu _{0}$ — the subject of the next
section.`,
      examTip: 'Recognise the scenario before reaching for an equation. Anything with a moving conductor, a changing field, or a rotating coil is Faraday. Anything asking for B near a current-carrying structure is Ampère. Anything relating charge to flux is Gauss. And any question involving a capacitor in a magnetic-field argument is really testing displacement current: the current is continuous through the gap even though the charge is not.',
      importantNote: 'Displacement current has the units and the magnetic effect of a current, but no charge moves. In the worked example above, 10 mA of "current" crosses a vacuum gap; what is actually crossing is a field changing at 1.13 × 10¹¹ V/(m·s).',
    },
    {
      id: 'mx-wave-from-equations',
      title: '4. From the Four Equations to a Wave',
      content: `## 4.1 The derivation, in the order it is usually asked

In a source-free region ($\\rho = 0$, J = 0), take the curl of Faraday's law:

$$\\nabla \\times (\\nabla \\times E) = -\\partial (\\nabla \\times B)/\\partial t$$

Substitute Ampère–Maxwell on the right, which in this region is
$\\nabla \\times B = \\mu _{0}\\varepsilon _{0}\\,\\partial E/\\partial t$, and use
the identity $\\nabla \\times (\\nabla \\times E) = \\nabla (\\nabla \\cdot E) - \\nabla ^{2}E$
on the left. Gauss's law kills the first term because $\\nabla \\cdot E = 0$
without charge, and what remains is the wave equation quoted in section 2:

$$\\nabla ^{2}E = \\mu _{0}\\varepsilon _{0}\\,\\partial ^{2}E/\\partial t^{2}$$

Everything about electromagnetic radiation follows from the shape of that
equation. Any function of the combination $(t - z/v)$ satisfies it, which is
what "a disturbance that keeps its shape and travels" means mathematically,
and the speed is forced to be $v = 1/\\sqrt{\\mu _{0}\\varepsilon _{0}}$.

## 4.2 Two constants that fall out of the algebra

Both headline numbers of electromagnetics come from substituting tabulated
constants, and both are worth doing once by hand.

$$c = 1/\\sqrt{(4\\pi \\times 10^{-7})(8.854 \\times 10^{-12})} = 2.998 \\times 10^{8}\\ \\mathrm{m/s}$$

$$\\eta _{0} = \\sqrt{\\mu _{0}/\\varepsilon _{0}} = \\sqrt{(1.2566 \\times 10^{-6})/(8.854 \\times 10^{-12})} = 376.7\\ \\Omega$$

That the first came out equal to the measured speed of light — from two
constants obtained in laboratory experiments on capacitors and coils, with no
optics involved — is the reason Maxwell's unification is considered one of
the great results in physics.

The impedance is usually quoted as $120\\pi = 376.99\\ \\Omega$, which is 0.07%
above the value computed from the modern $\\varepsilon _{0}$. Both are correct
to exam precision; the small difference exists because $120\\pi$ is exact only
if c is exactly $3 \\times 10^{8}$ m/s. Use 377 Ω and you will never be more
than a rounding error out.

## 4.3 Fields in a medium, and the phasor form

For time-harmonic problems the derivatives collapse: $\\partial /\\partial t$
becomes $j\\omega$, and the wave equation becomes the Helmholtz equation
$\\nabla ^{2}E = -\\omega ^{2}\\mu \\varepsilon E$. In a lossless medium the
propagation constant is $\\beta = \\omega \\sqrt{\\mu \\varepsilon}$, and the whole
description scales from free space by two numbers:

| Medium | $\\varepsilon _r$ | Index $n = \\sqrt{\\varepsilon _r \\mu _r}$ | Speed | Impedance η |
|---|---|---|---|---|
| Vacuum | 1.0 | 1.000 | 3.00 × 10⁸ m/s | 377 Ω |
| Polyethylene | 2.25 | 1.500 | 2.00 × 10⁸ m/s | 251 Ω |
| Alumina-like ceramic | 4.0 | 2.000 | 1.50 × 10⁸ m/s | 188 Ω |
| Fresh water (low f) | 81 | 9.000 | 3.33 × 10⁷ m/s | 41.9 Ω |

Read the pattern rather than the rows: with $\\mu _r = 1$, both the speed and
the impedance fall by $\\sqrt{\\varepsilon _r}$, and the wavelength at a given
frequency shrinks by the same factor. A 2.45 GHz oven runs a 12.2 cm
free-space wavelength down to about 1.4 cm inside water, which is why the
heating pattern inside food is on a centimetre scale and needs a turntable.

## 4.4 Boundary conditions, applied

At an interface with no free surface charge or current, tangential E and H
are continuous while normal D and B are continuous. Applying the first pair
to a static field crossing a dielectric boundary bends the field lines by a
definite amount:

$$\\tan \\theta _{2} = (\\varepsilon _{2}/\\varepsilon _{1})\\tan \\theta _{1}$$

with both angles measured from the normal.

**Worked**: a field inside a plastic ($\\varepsilon _r = 2.2$) meets an air
boundary at 30° from the normal. Then
$\\tan \\theta _{2} = (1/2.2)\\tan 30° = 0.262$, so $\\theta _{2} = 14.7°$ — the
line bends **toward** the normal on entering the lower-permittivity medium.
The tangential component is unchanged; the normal component of E jumps up by
the permittivity ratio, exactly as in the layered-capacitor calculation.

At the surface of a **perfect conductor** the conditions become far stronger,
and they are the ones every waveguide and antenna result rests on:

| Quantity | Condition at a perfect conductor | Consequence |
|---|---|---|
| Tangential E | $E_t = 0$ | E must meet the surface perpendicularly |
| Normal B | $B_n = 0$ | B must run parallel to the surface |
| Normal D | $D_n = \\sigma _s$ | the field terminates on induced surface charge |
| Tangential H | $H_t = J_s$ | the field is supported by a surface current |

The first row is why a wave cannot propagate inside a hollow metal pipe with
just any field pattern — only the patterns that can meet $E_t = 0$ on every
wall survive, which quantises the modes and produces the cutoff frequency of
a waveguide. The same row explains why a metal enclosure shields: an incident
tangential field drives surface currents that cancel it inside.`,
      examTip: 'Almost every plane-wave number can be reconstructed from η₀ = 377 Ω and c = 3 × 10⁸ m/s plus one square root. In a non-magnetic medium the speed is c/√ε_r, the wavelength is λ₀/√ε_r, and the impedance is 377/√ε_r. If a question gives a velocity factor instead of a permittivity, square its reciprocal to recover ε_r.',
      importantNote: 'The wave equation derivation only removes the ∇(∇·E) term because the region is source free. Inside a conductor, where ρ and J are not zero, the same algebra gives a diffusion-like equation instead — the mathematical origin of skin depth, covered in the wave propagation topic.',
    },
    {
      id: 'mx-forms-and-theorems',
      title: '5. Integral Form, Differential Form, and the Theorems Between Them',
      content: `## 5.1 Why every equation is quoted twice

Every reference prints Maxwell's set in two columns, and the reason is that
the two columns answer different questions. The integral column speaks about a
region: how much flux crosses this closed surface, how much circulation runs
around this loop. That is the column to reach for when a problem hands you a
symmetry, because the integral can then be done by inspection instead of by
calculus. The differential column speaks about a single point: what the field
is doing right here, expressed as a divergence and a curl. That is the column a
numerical solver marches forward in time, and it is the column from which the
wave equation falls out.

Neither column holds information the other lacks. Two theorems of vector
calculus carry each statement across, and knowing which theorem serves which
equation is worth more under exam pressure than memorising eight expressions
separately.

The **divergence theorem** converts a closed-surface integral into a volume
integral of the divergence over the interior:

$$\\oint _{S} \\boldsymbol{A}\\cdot d\\boldsymbol{S} = \\int _{V} (\\nabla \\cdot \\boldsymbol{A})\\, dV$$

The **curl theorem**, normally called Stokes' theorem, converts a closed-loop
integral into a surface integral of the curl over any surface that the loop
bounds:

$$\\oint _{C} \\boldsymbol{A}\\cdot d\\boldsymbol{\\ell} = \\int _{S} (\\nabla \\times \\boldsymbol{A})\\cdot d\\boldsymbol{S}$$

Read together, they say something simple. A divergence is flux per unit volume
in the limit of a shrinking volume; a curl is circulation per unit area in the
limit of a shrinking loop. The integral form is the differential form added up
over a finite piece of space.

## 5.2 The four equations, converted

| Law | Integral statement | Theorem applied | Differential statement |
|---|---|---|---|
| Gauss, electric | $\\oint \\boldsymbol{D}\\cdot d\\boldsymbol{S} = Q_{enc}$ | divergence | $\\nabla \\cdot \\boldsymbol{D} = \\rho _{v}$ |
| Gauss, magnetic | $\\oint \\boldsymbol{B}\\cdot d\\boldsymbol{S} = 0$ | divergence | $\\nabla \\cdot \\boldsymbol{B} = 0$ |
| Faraday | $\\oint \\boldsymbol{E}\\cdot d\\boldsymbol{\\ell} = -d\\Phi _{B}/dt$ | curl | $\\nabla \\times \\boldsymbol{E} = -\\partial \\boldsymbol{B}/\\partial t$ |
| Ampere-Maxwell | $\\oint \\boldsymbol{H}\\cdot d\\boldsymbol{\\ell} = I_{enc} + d\\Psi _{D}/dt$ | curl | $\\nabla \\times \\boldsymbol{H} = \\boldsymbol{J} + \\partial \\boldsymbol{D}/\\partial t$ |

The pattern is exact: the two flux laws are divergence laws, and the two
circulation laws are curl laws. A scenario question that mentions a **closed
surface** is a divergence question; one that mentions a **closed path** is a
curl question. Nothing else has to be recalled to pick the right starting
line.

One detail earns its own sentence. In the Ampere-Maxwell integral,
$\\Psi _{D} = \\int \\boldsymbol{D}\\cdot d\\boldsymbol{S}$ is the electric flux
through the same surface the loop bounds, and the surface may be any surface at
all. Section 6 shows that this freedom is exactly what the displacement term
was invented to protect.

## 5.3 Flux by quadrature, so the theorem is checked and not merely quoted

![Closed-surface flux computed by numerical quadrature for a 2.0 nC charge placed at the centre, 3.0 cm off centre and 6.0 cm off centre: the integral is exactly q over epsilon-nought whenever the charge is inside and exactly zero whenever it is outside, at every radius.](/courses/fe-ee/figures/em3-gauss-flux-numeric.svg)

The figure was made by evaluating $\\boldsymbol{E}\\cdot \\hat{n}$ at 160000
points spread over each sphere and summing, with Gauss-Legendre weights in
$\\cos \\theta$ and equal weights in $\\phi$. No symmetry was used and Gauss's
law was never invoked. The Coulomb field of a charge sitting off the centre is
strongly non-uniform over the surface — near the closest point it is many times
its value at the far point — and yet the sum comes out at the same number
whatever the radius, and at the same number whatever the offset, provided only
that the charge is inside.

That is the divergence theorem doing its work. Everywhere except at the charge
itself, $\\nabla \\cdot \\boldsymbol{E} = 0$, so the volume integral picks up a
contribution from one point only, and the surface integral cannot depend on
anything but whether that point is enclosed.

### Worked Example 1 — the flux integral, by hand and by machine

**Given**: $q = 2.0$ nC in air, inside a closed surface of any shape.

By Gauss's law the flux of $\\boldsymbol{E}$ is

$$\\oint \\boldsymbol{E}\\cdot d\\boldsymbol{S} = \\frac{q}{\\varepsilon _{0}} = \\frac{2.0 \\times 10^{-9}}{8.8541878128 \\times 10^{-12}} = 225.88\\ \\mathrm{V}\\cdot \\mathrm{m}$$

The same quadrature returns 225.8819 for a sphere of radius 5.0 cm with the
charge at the centre, 225.8819 with the charge 3.0 cm off centre, and 225.8819
for a 10 cm sphere with the charge 6.0 cm off centre. The three agree with the
closed form to nine significant figures, and the same integral over a sphere
that excludes the charge returns a number smaller than $10^{-9}$ of that,
which is the numerical rendering of zero.

**Units check**: coulombs divided by farads per metre gives
$\\mathrm{C}\\cdot \\mathrm{m}/\\mathrm{F}$, and since a volt is a coulomb per
farad this is volt-metres — which is also what $\\mathrm{V/m}$ times
$\\mathrm{m^{2}}$ gives. The two routes to the unit agree, which is the check
worth running before any number is trusted.

### Worked Example 2 — Stokes' theorem on a current-carrying wire

**Given**: a long straight wire carrying $I = 10.0$ A, and a circular path of
radius $a = 2.0$ cm centred on it and lying in a plane perpendicular to it.

The **left** side of Stokes' theorem is the circulation. The field of a long
wire is $B = \\mu _{0}I/(2\\pi a)$, constant in magnitude along the path and
everywhere parallel to it, so

$$B = \\frac{(4\\pi \\times 10^{-7})(10.0)}{2\\pi (0.020)} = 1.000 \\times 10^{-4}\\ \\mathrm{T}, \\qquad \\oint \\boldsymbol{B}\\cdot d\\boldsymbol{\\ell} = B\\,(2\\pi a) = 1.2566 \\times 10^{-5}\\ \\mathrm{T}\\cdot \\mathrm{m}$$

The **right** side is the flux of $\\nabla \\times \\boldsymbol{B}$, which in
this static case is $\\mu _{0}\\boldsymbol{J}$, so the surface integral is
$\\mu _{0}$ times the current threading the loop:

$$\\mu _{0}I = (4\\pi \\times 10^{-7})(10.0) = 1.2566 \\times 10^{-5}\\ \\mathrm{T}\\cdot \\mathrm{m}$$

**Answer: 100 microtesla at the path, and both sides of Stokes' theorem equal
1.2566e-5 T.m.** The radius cancelled: $B$ fell as $1/a$ while the path length
grew as $a$. That cancellation is the whole reason Ampere's law is useful, and
it is also the reason the answer is insensitive to where the loop is drawn as
long as it still encircles the wire.

## 5.4 Which form to reach for

| Situation | Form to use | Reason |
|---|---|---|
| Symmetric charge or current distribution | integral | the integral collapses to a product |
| Field asked for at one specific point | differential | divergence and curl are local |
| Deriving a wave equation or a boundary condition | differential | the operators can be combined |
| Total charge, total current, total flux wanted | integral | the answer is the integral itself |
| Numerical solution on a grid | differential | each cell updates from its neighbours |

A last caution about the surface in a curl law. Stokes' theorem allows **any**
surface bounded by the loop, but the integral form of Ampere's law was written
before displacement current existed and does not survive that freedom without
it. That failure, and its repair, are the subject of the next section.`,
      examTip: 'Read the geometry named in the question before choosing an equation. A closed surface always means a divergence law: Gauss for electric, and the zero-divergence statement for magnetic. A closed path always means a curl law: Faraday if a flux is changing, Ampere-Maxwell if a current is threading. Getting that first choice right converts most FE electromagnetics questions into one line of algebra.',
      importantNote: 'The divergence theorem and Stokes theorem are statements about any vector field, not about electromagnetism. They carry no physics. All the physics sits in the four right-hand sides: charge, zero, the rate of change of magnetic flux, and current plus the rate of change of electric flux.',
    },
    {
      id: 'mx-displacement-continuity',
      title: '6. Displacement Current, Forced by Charge Conservation',
      content: `## 6.1 The continuity equation

Charge is conserved. Written as a statement about a fixed closed surface, the
current flowing out equals the rate at which the charge inside is falling:

$$\\oint \\boldsymbol{J}\\cdot d\\boldsymbol{S} = -\\frac{dQ_{enc}}{dt}$$

Applying the divergence theorem to the left side and writing
$Q_{enc} = \\int \\rho _{v}\\, dV$ on the right gives the point form:

$$\\nabla \\cdot \\boldsymbol{J} = -\\frac{\\partial \\rho _{v}}{\\partial t}$$

This is not an extra law of electromagnetism. It is bookkeeping, and Maxwell's
set has to respect it or it is wrong.

## 6.2 Ampere's original law fails the test

Take the divergence of the pre-Maxwell curl law
$\\nabla \\times \\boldsymbol{H} = \\boldsymbol{J}$. The divergence of any curl
vanishes identically — that is a theorem about vector fields, with no physics
in it:

$$\\nabla \\cdot (\\nabla \\times \\boldsymbol{H}) = 0 \\quad \\Longrightarrow \\quad \\nabla \\cdot \\boldsymbol{J} = 0$$

Compare that with continuity. It says the charge density can never change
anywhere, which is false the moment a capacitor begins to charge. The old law
is not merely incomplete; it is inconsistent with charge conservation.

Now add an unknown term $\\boldsymbol{X}$ and demand consistency:

$$\\nabla \\times \\boldsymbol{H} = \\boldsymbol{J} + \\boldsymbol{X} \\quad \\Longrightarrow \\quad \\nabla \\cdot \\boldsymbol{J} + \\nabla \\cdot \\boldsymbol{X} = 0$$

Continuity says $\\nabla \\cdot \\boldsymbol{J} = -\\partial \\rho _{v}/\\partial t$,
and Gauss's law says $\\rho _{v} = \\nabla \\cdot \\boldsymbol{D}$. Substituting
both gives

$$\\nabla \\cdot \\boldsymbol{X} = \\frac{\\partial}{\\partial t}(\\nabla \\cdot \\boldsymbol{D}) = \\nabla \\cdot \\frac{\\partial \\boldsymbol{D}}{\\partial t}$$

so the missing term is $\\partial \\boldsymbol{D}/\\partial t$, up to something
with zero divergence that experiment finds to be absent. **The displacement
current is not an extra assumption. It is the only term that lets Ampere's law
and charge conservation coexist**, and once written down it also lets waves
exist.

## 6.3 The size of the term, in a real capacitor

### Worked Example 3 — displacement current in a driven capacitor

**Given**: parallel plates of area $A = 25$ cm² separated by $d = 0.50$ mm in
air, driven by $v(t) = 5.00\\sin (2\\pi f t)$ volts at $f = 1.00$ MHz.

Capacitance first:

$$C = \\frac{\\varepsilon _{0}A}{d} = \\frac{(8.8541878128 \\times 10^{-12})(2.50 \\times 10^{-3})}{5.00 \\times 10^{-4}} = 4.427 \\times 10^{-11}\\ \\mathrm{F} = 44.27\\ \\mathrm{pF}$$

The terminal current is $i = C\\, dv/dt$, whose peak is $\\omega CV$ with
$\\omega = 2\\pi (1.00 \\times 10^{6}) = 6.2832 \\times 10^{6}$ rad/s:

$$I_{pk} = \\omega C V = (6.2832 \\times 10^{6})(4.427 \\times 10^{-11})(5.00) = 1.391 \\times 10^{-3}\\ \\mathrm{A}$$

Now the same answer from the field side, with no circuit theory used. The peak
field in the gap is $E_{pk} = V/d = 5.00/(5.00 \\times 10^{-4}) = 1.00 \\times 10^{4}$
V/m, so the peak rate of change is $\\omega E_{pk} = 6.2832 \\times 10^{10}$
V/(m.s), and the displacement current density is

$$J_{d} = \\varepsilon _{0}\\frac{\\partial E}{\\partial t} = (8.8541878128 \\times 10^{-12})(6.2832 \\times 10^{10}) = 0.5563\\ \\mathrm{A/m^{2}}$$

Multiplying by the plate area, $0.5563 \\times 2.50 \\times 10^{-3} = 1.391$ mA,
which is the terminal current to four figures.

**Answer: 44.27 pF, 1.391 mA peak, and a gap displacement current density of
0.5563 A/m².** *Trap*: reading 5.00 V as an RMS value and then reporting a peak
current gives 1.967 mA, high by $\\sqrt{2}$. The wave was written with a
$\\sin$, so 5.00 V is an amplitude.

**Units check**: farads per metre times volts per metre per second is
$\\mathrm{F}\\cdot \\mathrm{V}/(\\mathrm{m^{2}}\\cdot \\mathrm{s})$; a farad-volt
is a coulomb, and a coulomb per second is an ampere, so the result is amperes
per square metre. Displacement current density carries exactly the units of
conduction current density, which is why it can be added to it.

### Worked Example 4 — which current dominates, and at what frequency

**Given**: seawater, $\\sigma = 4.0$ S/m and $\\varepsilon _r = 81$.

The two current densities in a sinusoidal field are $J_{c} = \\sigma E$ and
$J_{d} = \\omega \\varepsilon E$, so their ratio is the loss tangent:

$$\\frac{J_{c}}{J_{d}} = \\frac{\\sigma}{\\omega \\varepsilon} = \\frac{\\sigma}{2\\pi f \\varepsilon _{0}\\varepsilon _r}$$

They are equal when

$$f = \\frac{\\sigma}{2\\pi \\varepsilon _{0}\\varepsilon _r} = \\frac{4.0}{(6.2831853)(8.8541878128 \\times 10^{-12})(81)} = 8.877 \\times 10^{8}\\ \\mathrm{Hz}$$

| Frequency | $\\sigma /(\\omega \\varepsilon)$ | Which current wins | Behaviour |
|---|---|---|---|
| 1.0 kHz | 8.877e5 | conduction, overwhelmingly | a conductor |
| 1.0 MHz | 887.7 | conduction | a conductor |
| 887.7 MHz | 1.000 | neither | the crossover |
| 10 GHz | 0.0888 | displacement | a lossy dielectric |

**Answer: the crossover is at 888 MHz, and seawater is a conductor below it and
a dielectric above it.** *Trap*: using $\\varepsilon _{0}$ alone and forgetting
$\\varepsilon _r$ puts the crossover at $7.19 \\times 10^{10}$ Hz, eighty-one
times too high, and would tell you that seawater behaves as a metal at 10 GHz.
It does not.

## 6.4 What the term is and is not

- It is **not** moving charge. Nothing crosses the vacuum gap of a capacitor.
- It **is** a source of magnetic field, exactly as real current is, which is
  why the magnetic field around the gap matches the field around the wire.
- Its magnitude is fixed by $\\partial \\boldsymbol{D}/\\partial t$, so it
  vanishes in the steady state. A capacitor blocking DC is the same statement
  as a displacement current falling to zero once the field stops changing.
- Inside a dielectric it has two parts: the vacuum part
  $\\varepsilon _{0}\\partial E/\\partial t$ and the polarisation part
  $\\partial P/\\partial t$, which really is moving charge — bound charge
  shifting within molecules.

The last point matters for the exam only in one way. When a problem supplies
$\\varepsilon _r$, use $\\varepsilon = \\varepsilon _{0}\\varepsilon _r$ in the
displacement term. Dropping $\\varepsilon _r$ is the single most common numeric
error in this material, and it is always wrong by exactly that factor.`,
      examTip: 'Whenever a question mixes a capacitor with a magnetic-field argument, the answer is displacement current, and the current in the gap equals the current in the leads at every instant. If the question instead asks whether a material behaves as a conductor or a dielectric at some frequency, compute the ratio sigma over omega-epsilon first and let the number choose the model. The ratio is dimensionless, so any answer with units attached signals a slip.',
      importantNote: 'The derivation in 6.2 shows that displacement current was not fitted to data. It is forced by two things already believed: that charge is conserved and that the divergence of a curl is zero. Maxwell then discovered that the repaired set predicts waves travelling at a speed built only from the electrostatic and magnetostatic constants.',
    },
    {
      id: 'mx-faraday-forms',
      title: '7. Faraday\'s Law in Every Form the Exam Asks For',
      content: `## 7.1 One law, three appearances

$\\Phi _{B} = \\int \\boldsymbol{B}\\cdot d\\boldsymbol{S}$ can change because the
field changes, because the area changes, or because the orientation changes.
Faraday's law does not distinguish between them:

$$\\mathrm{emf} = -\\frac{d\\Phi _{B}}{dt}, \\qquad \\mathrm{emf} = -N\\frac{d\\Phi _{B}}{dt}\\ \\text{for an N-turn coil}$$

Expanding the derivative of $BA\\cos \\theta$ shows all three routes at once:

$$\\frac{d}{dt}(BA\\cos \\theta ) = A\\cos \\theta \\frac{dB}{dt} + B\\cos \\theta \\frac{dA}{dt} - BA\\sin \\theta \\frac{d\\theta}{dt}$$

The first term is transformer action, the second is a conductor sweeping out
area, the third is a rotating machine. Most exam problems switch off two of the
three.

| Route | What varies | Working expression | Typical hardware |
|---|---|---|---|
| Transformer | $B$ | $\\mathrm{emf} = NA\\,dB/dt$ | transformers, inductive sensors |
| Motional | area | $\\mathrm{emf} = B\\ell v$ | rail generators, flow meters |
| Rotational | angle | $\\mathrm{emf} = NBA\\omega \\sin \\omega t$ | alternators, tachometers |

## 7.2 The rotating coil, the standard alternator question

![Flux linkage and induced emf for a 200-turn coil of area 0.015 square metres spun at 1800 revolutions per minute in a 0.35 tesla field: the emf is a quarter cycle behind the linkage and peaks at 197.92 volts.](/courses/fe-ee/figures/em3-rotating-coil-emf.svg)

The two curves in the figure are drawn as fractions of their own peaks so that
one axis can carry both. The emf curve was also recomputed by differencing the
linkage curve numerically rather than by differentiating the cosine, and the
two agree to better than one part in ten million, which is the check that the
quarter-cycle offset is real and not a plotting artefact.

### Worked Example 5 — an alternator from first principles

**Given**: $N = 200$ turns, coil area $A = 0.015$ m², field $B = 0.35$ T,
rotating at 1800 rev/min.

Angular speed first, because the units trap lives here:

$$\\omega = \\frac{2\\pi (1800)}{60} = 188.496\\ \\mathrm{rad/s}, \\qquad f = \\frac{\\omega}{2\\pi} = 30.0\\ \\mathrm{Hz}$$

Peak flux linkage and peak emf:

$$\\lambda _{pk} = NBA = (200)(0.35)(0.015) = 1.050\\ \\mathrm{Wb}, \\qquad \\mathrm{emf}_{pk} = \\lambda _{pk}\\omega = (1.050)(188.496) = 197.92\\ \\mathrm{V}$$

$$\\mathrm{emf}_{rms} = \\frac{197.92}{1.41421} = 139.95\\ \\mathrm{V}$$

**Answers: 30.0 Hz, 197.92 V peak, 139.95 V rms.** *Trap*: using 1800 directly as
$\\omega$ gives 1890 V, high by the factor $60/2\\pi = 9.55$. Revolutions per
minute is not radians per second, and the exam always offers the unconverted
answer.

**Units check**: turns are dimensionless, tesla times square metres is webers,
and webers per second is volts. So $NBA\\omega$ is
$\\mathrm{Wb}\\cdot \\mathrm{rad/s}$, and since the radian is dimensionless that
is volts.

### Worked Example 6 — volts per turn in a transformer core

**Given**: a core of cross-section $A = 12$ cm² operating at $f = 60$ Hz with a
peak flux density $B_{max} = 1.5$ T.

With sinusoidal flux $\\Phi = B_{max}A\\sin \\omega t$, the peak emf per turn is
$\\omega B_{max}A$ and the rms value divides that by $\\sqrt{2}$:

$$\\frac{E_{rms}}{N} = \\frac{2\\pi f B_{max}A}{\\sqrt{2}} = 4.443\\, f B_{max} A$$

$$\\frac{E_{rms}}{N} = (4.443)(60)(1.5)(12.0 \\times 10^{-4}) = 0.4798\\ \\mathrm{V/turn}$$

A 240 V winding therefore needs $240/0.4798 = 500$ turns.

**Answers: 0.480 V per turn, and 500 turns for 240 V.** *Trap*: using the peak
emf rather than the rms value gives 0.6786 V per turn and 354 turns, a winding
that would drive the core deep into saturation. The 4.44 in the classic
transformer formula **is** the $2\\pi /\\sqrt{2}$ that converts peak flux to rms
volts, and it is the whole content of that formula.

## 7.3 The minus sign, stated so it survives

Lenz's law is the minus sign, and the phrasing that holds up under pressure is:
**the induced current flows so as to oppose the change that produced it** — not
the flux itself, the change in the flux. Push a magnet toward a loop and the
loop pushes back; withdraw it and the loop pulls. Any other sign would let a
magnet and a coil deliver energy without limit, so the minus sign is
conservation of energy wearing electromagnetic clothes.

Two consequences appear constantly in practice. A shorted turn anywhere near a
transformer core carries a large current, because a small emf drives it through
a very low resistance. And a loop of oscilloscope ground lead near a mains
transformer picks up hum in exact proportion to the area it encloses, which is
why the fix is to shrink the loop rather than to add shielding.`,
      examTip: 'Convert rotational speed to radians per second before anything else: omega equals two pi times rev/min divided by 60. Then check whether the question wants peak or rms, because the two differ by 1.414 and both appear among the offered answers. For transformers the 4.44 factor already contains the rms conversion, so dividing by root two a second time is a double correction.',
      importantNote: 'Motional emf and transformer emf are the same law seen from two frames. A bar sliding on rails in a static field sees no changing B, yet an emf appears; an observer riding the bar sees a changing field instead. Faraday\'s law in the flux form covers both without needing the distinction, which is why it is written about the flux and not about the field.',
    },
    {
      id: 'mx-boundary-derivations',
      title: '8. Boundary Conditions Derived from a Pillbox and a Loop',
      content: `## 8.1 The pillbox argument gives the normal components

Straddle an interface with a flat cylinder — a pillbox — of face area $\\Delta S$
and vanishing height, so that the curved side contributes nothing. Gauss's law
applied to it reads

$$\\oint \\boldsymbol{D}\\cdot d\\boldsymbol{S} = (D_{n1} - D_{n2})\\Delta S = \\rho _{s}\\Delta S \\quad \\Longrightarrow \\quad D_{n1} - D_{n2} = \\rho _{s}$$

with both normals taken pointing from medium 2 into medium 1. With no free
surface charge the normal component of $\\boldsymbol{D}$ simply crosses
unchanged. The same argument on $\\nabla \\cdot \\boldsymbol{B} = 0$ has zero on
the right, because there is no magnetic surface charge to put there:

$$B_{n1} = B_{n2}$$

## 8.2 The loop argument gives the tangential components

Now lay a thin rectangular loop across the interface, of length $\\Delta \\ell$
along it and vanishing height across it. Faraday's law gives

$$\\oint \\boldsymbol{E}\\cdot d\\boldsymbol{\\ell} = (E_{t1} - E_{t2})\\Delta \\ell = -\\frac{d\\Phi _{B}}{dt} \\to 0 \\quad \\Longrightarrow \\quad E_{t1} = E_{t2}$$

The flux term dies because the loop encloses no area once the height goes to
zero, and this holds however fast the field is changing. The same loop applied
to Ampere-Maxwell gives

$$H_{t1} - H_{t2} = J_{s}$$

where $J_{s}$ is a genuine surface current in amperes per metre, which only a
perfect conductor can support. Between ordinary materials, tangential
$\\boldsymbol{H}$ is continuous.

| Quantity | Condition | Source of the jump | Holds at any frequency |
|---|---|---|---|
| Tangential $\\boldsymbol{E}$ | $E_{t1} = E_{t2}$ | never jumps | yes |
| Tangential $\\boldsymbol{H}$ | $H_{t1} - H_{t2} = J_{s}$ | surface current | yes |
| Normal $\\boldsymbol{D}$ | $D_{n1} - D_{n2} = \\rho _{s}$ | surface charge | yes |
| Normal $\\boldsymbol{B}$ | $B_{n1} = B_{n2}$ | never jumps | yes |

The mnemonic that survives an exam: **the tangential pair that is continuous is
E and H, and the normal pair that is continuous is D and B**, with each pair
broken only by a surface source that ordinary dielectrics cannot supply.

## 8.3 What that does to a field crossing a boundary

![Field components across an air to relative-permittivity-four interface: normal D and tangential E hold their values across the boundary while normal E drops by a factor of four.](/courses/fe-ee/figures/em3-boundary-fields.svg)

### Worked Example 7 — a field entering a dielectric

**Given**: in air, a field with normal component $E_{n1} = 100$ V/m and
tangential component $E_{t1} = 60$ V/m meets a slab with
$\\varepsilon _{r2} = 4.0$ and no surface charge.

Tangential $\\boldsymbol{E}$ crosses unchanged, so $E_{t2} = 60$ V/m. Normal
$\\boldsymbol{D}$ crosses unchanged, so
$\\varepsilon _{0}E_{n1} = \\varepsilon _{0}\\varepsilon _{r2}E_{n2}$ and

$$E_{n2} = \\frac{E_{n1}}{\\varepsilon _{r2}} = \\frac{100}{4.0} = 25.0\\ \\mathrm{V/m}$$

Magnitudes and angles from the normal follow:

$$\\lvert \\boldsymbol{E}_{1} \\rvert = \\sqrt{100^{2} + 60^{2}} = 116.6\\ \\mathrm{V/m}, \\qquad \\lvert \\boldsymbol{E}_{2} \\rvert = \\sqrt{25^{2} + 60^{2}} = 65.00\\ \\mathrm{V/m}$$

$$\\theta _{1} = \\arctan (60/100) = 30.96°, \\qquad \\theta _{2} = \\arctan (60/25) = 67.38°$$

Dividing the two tangents recovers the refraction law without assuming it:
$\\tan \\theta _{2}/\\tan \\theta _{1} = 2.400/0.6000 = 4.000 = \\varepsilon _{r2}/\\varepsilon _{r1}$.

**Answers: 25.0 V/m normal, 60 V/m tangential, 65.00 V/m total, at 67.38° from
the normal.** *Trap*: assuming that $\\boldsymbol{E}$ is what crosses unchanged
leaves $E_{n2}$ at 100 V/m and gives 116.6 V/m at 30.96°, unchanged from
medium 1 — an answer that says a dielectric does nothing at all.

### Worked Example 8 — the surface of a perfect conductor

**Given**: a plane wave of amplitude $E_{0} = 100$ V/m in air strikes a perfect
conductor at normal incidence. Separately, a static field of 300 kV/m in air
meets a conductor face perpendicularly.

Inside a perfect conductor the fields are zero, so the four conditions collapse
to $E_{t} = 0$, $B_{n} = 0$, $D_{n} = \\rho _{s}$ and $H_{t} = J_{s}$. At
normal incidence the wave reflects completely with $\\Gamma = -1$, so the
tangential magnetic fields of incident and reflected waves add:

$$J_{s} = H_{t} = \\frac{2E_{0}}{\\eta _{0}} = \\frac{200}{376.730313} = 0.5309\\ \\mathrm{A/m}$$

For the static case the field terminates on induced surface charge:

$$\\rho _{s} = \\varepsilon _{0}E_{n} = (8.8541878128 \\times 10^{-12})(3.00 \\times 10^{5}) = 2.656 \\times 10^{-6}\\ \\mathrm{C/m^{2}}$$

**Answers: 0.5309 A/m of surface current, and 2.656 microcoulombs per square
metre of surface charge.** *Trap*: using $E_{0}$ rather than $2E_{0}$ for the
surface field gives 0.2654 A/m, half the right answer. The reflected wave
reverses $\\boldsymbol{E}$ so that the tangential total is zero, which forces
$\\boldsymbol{H}$ to double instead.

## 8.4 Why the conductor conditions carry so much weight

The condition $E_{t} = 0$ on a metal surface is doing more work in engineering
than any other line in this chapter. It is why a hollow metal pipe supports only
a discrete set of field patterns, each of which can meet that condition on every
wall — the origin of waveguide modes and of cutoff frequency. It is why a
metal box shields: an incident tangential field drives surface currents whose
own field cancels it inside. And it is why a slot in that box is far worse than
a hole of the same area, because a slot interrupts the surface current path
while a round hole mostly does not.`,
      examTip: 'Write down which pair the question is about before substituting anything. If the field is drawn parallel to the interface it is a tangential question and E carries across untouched. If it is drawn perpendicular it is a normal question and D carries across untouched, so E jumps by the permittivity ratio. Mixing the two produces an answer that is wrong by exactly epsilon-r, which is always among the offered choices.',
      importantNote: 'Every one of these conditions was derived by shrinking a region to zero, so none of them depends on frequency. The same four statements govern a static field, a 60 Hz field and an optical wave. What changes with frequency is only whether a real material can be treated as a perfect conductor.',
    },
    {
      id: 'mx-wave-numeric',
      title: '9. The Wave Equation, Checked by Time-Stepping',
      content: `## 9.1 The derivation, and the same result for H

In a source-free region take the curl of Faraday's law and substitute
Ampere-Maxwell:

$$\\nabla \\times (\\nabla \\times \\boldsymbol{E}) = -\\frac{\\partial}{\\partial t}(\\nabla \\times \\boldsymbol{B}) = -\\mu _{0}\\varepsilon _{0}\\frac{\\partial ^{2}\\boldsymbol{E}}{\\partial t^{2}}$$

The vector identity
$\\nabla \\times (\\nabla \\times \\boldsymbol{E}) = \\nabla (\\nabla \\cdot \\boldsymbol{E}) - \\nabla ^{2}\\boldsymbol{E}$
turns the left side into $-\\nabla ^{2}\\boldsymbol{E}$, because
$\\nabla \\cdot \\boldsymbol{E} = 0$ where there is no charge. What is left is

$$\\nabla ^{2}\\boldsymbol{E} = \\mu _{0}\\varepsilon _{0}\\frac{\\partial ^{2}\\boldsymbol{E}}{\\partial t^{2}}$$

Starting from the curl of Ampere-Maxwell instead produces the identical
equation in $\\boldsymbol{B}$. Both fields obey the same wave equation, which
is why a single number, the speed, describes the pair.

## 9.2 A check that never substitutes the answer

Substituting $\\cos (\\omega t - kz)$ into the wave equation and finding that it
fits is a weak test: the solution was chosen because it fits. A stronger test is
to step the two curl equations forward in time on a grid and see what emerges.

Stagger $E_{x}$ and $H_{y}$ half a cell apart in space and half a step apart in
time, and the curl equations become two update rules:

$$H_{y}^{\\,n+1/2} = H_{y}^{\\,n-1/2} - \\frac{\\Delta t}{\\mu _{0}\\Delta z}\\left(E_{x}^{\\,n}\\big|_{k+1} - E_{x}^{\\,n}\\big|_{k}\\right)$$

$$E_{x}^{\\,n+1} = E_{x}^{\\,n} - \\frac{\\Delta t}{\\varepsilon _{0}\\Delta z}\\left(H_{y}^{\\,n+1/2}\\big|_{k+1/2} - H_{y}^{\\,n+1/2}\\big|_{k-1/2}\\right)$$

Nothing in those two lines mentions waves, speed or impedance. They contain
only $\\varepsilon _{0}$, $\\mu _{0}$ and two difference quotients. Stability
requires the Courant condition $c\\,\\Delta t/\\Delta z \\le 1$ in one dimension;
the runs below use 0.5.

![A Gaussian pulse laid on a vacuum grid and advanced by the two curl equations alone, shown at zero, five and ten nanoseconds: it keeps its shape and moves 2.9975 metres in 9.9986 nanoseconds.](/courses/fe-ee/figures/em3-fdtd-pulse.svg)

### Worked Example 9 — measuring the speed of light off a grid

**Given**: 2400 cells over 6.00 m, so $\\Delta z = 2.50$ mm; Courant number 0.5,
so $\\Delta t = 0.5\\,\\Delta z/c = 4.170$ ps. A Gaussian bump of width 0.30 m is
laid at $z = 1.000$ m and the pair of update rules is applied 2398 times, which
is $t = 9.99858$ ns.

The peak of the resulting field, located to sub-cell precision by fitting a
parabola through three samples, sits at $z = 3.99746$ m. So

$$v = \\frac{3.99746 - 1.00000}{9.99858 \\times 10^{-9}} = \\frac{2.99746}{9.99858 \\times 10^{-9}} = 2.99789 \\times 10^{8}\\ \\mathrm{m/s}$$

against the defined value $c = 2.99792458 \\times 10^{8}$ m/s. The gap is
13 parts per million.

Taking the ratio of the two fields at the same peak gives
$E_{x}/H_{y} = 376.75$ ohm, against $\\eta _{0} = 376.730$ ohm — a gap of
41 parts per million.

**Answers: 2.99789e8 m/s and 376.75 ohm, both recovered from difference
equations that were never told either number.** The remaining discrepancy is
numerical dispersion, which the next example shows to be a property of the grid
rather than of the physics.

![Relative error of the stepped solution against the analytic pulse, plotted against cell size: halving the cell quarters the error, the signature of a second-order scheme.](/courses/fe-ee/figures/em3-fdtd-convergence.svg)

### Worked Example 10 — proving the residual is the grid, not the physics

**Given**: the same run repeated at five cell sizes, comparing the stepped field
against the analytic Gaussian displaced by $ct$.

| Cells | $\\Delta z$ | Relative error | Error ratio |
|---|---|---|---|
| 150 | 40.0 mm | 2.157e-2 | — |
| 300 | 20.0 mm | 5.386e-3 | 4.005 |
| 600 | 10.0 mm | 1.346e-3 | 4.003 |
| 1200 | 5.00 mm | 3.360e-4 | 4.004 |
| 2400 | 2.50 mm | 8.406e-5 | 3.997 |

Each halving of the cell divides the error by four, so the observed order is
$\\log _{2}(4.00) = 2.00$ to three figures.

**Answer: second order, with no error floor.** This is the diagnostic that
matters. If the code had used a wrong constant — $\\varepsilon _{0}$ where
$\\varepsilon _{0}\\varepsilon _r$ belonged, say, or a stray factor of two — the
error would stop falling and settle on a plateau, because refining a grid cannot
fix a wrong equation. A clean slope of two says the discretisation is the only
thing left.

## 9.3 The two constants, by independent routes

### Worked Example 11 — c and the free-space impedance, three ways each

$$c = \\frac{1}{\\sqrt{\\mu _{0}\\varepsilon _{0}}} = \\frac{1}{\\sqrt{(1.25663706 \\times 10^{-6})(8.8541878128 \\times 10^{-12})}} = 2.997925 \\times 10^{8}\\ \\mathrm{m/s}$$

For the impedance, three expressions that must agree:

$$\\eta _{0} = \\sqrt{\\frac{\\mu _{0}}{\\varepsilon _{0}}} = 376.7303, \\qquad \\eta _{0} = \\mu _{0}c = 376.7303, \\qquad \\eta _{0} = \\frac{1}{\\varepsilon _{0}c} = 376.7303$$

All three land on 376.7303 ohm, agreeing to seven figures. The familiar
$120\\pi = 376.9911$ ohm is 0.069 % above that, and the difference exists only
because $120\\pi$ is exact when $c$ is taken as exactly
$3.000 \\times 10^{8}$ m/s.

**Answer: 2.9979e8 m/s and 376.73 ohm.** *Trap*: writing $\\eta _{0} = \\mu _{0}/c$
instead of $\\mu _{0}c$ gives $4.192 \\times 10^{-15}$ ohm, an answer whose sheer
absurdity is the reason a dimensional check should precede every substitution.
Henries per metre times metres per second is henries per second, which is ohms;
henries per metre divided by metres per second is not.`,
      examTip: 'Any plane-wave number can be rebuilt from c and eta-nought with one square root. In a non-magnetic medium the speed is c over root epsilon-r, the wavelength shrinks by the same factor, and the impedance is 377 over root epsilon-r. Memorise those three scalings rather than a table of media, and check the direction each time: a denser dielectric slows the wave and lowers the impedance, never the reverse.',
      importantNote: 'The convergence test in Worked Example 10 is the check that a formula-substitution cannot perform. Verifying an answer by re-deriving it confirms the algebra; watching the numerical error fall at the predicted rate confirms that the constants themselves are right, because a wrong constant produces an error that no amount of grid refinement removes.',
    },
    {
      id: 'mx-static-limits',
      title: '10. Static, Quasi-Static and Full-Wave: Which Chapter Applies',
      content: `## 10.1 Setting the time derivatives to zero

Delete every $\\partial /\\partial t$ from Maxwell's set and it falls into two
halves that no longer speak to one another:

$$\\nabla \\cdot \\boldsymbol{D} = \\rho _{v}, \\qquad \\nabla \\times \\boldsymbol{E} = 0$$

$$\\nabla \\cdot \\boldsymbol{B} = 0, \\qquad \\nabla \\times \\boldsymbol{H} = \\boldsymbol{J}$$

The first pair is electrostatics: a curl-free field, so a potential exists and
$\\boldsymbol{E} = -\\nabla V$. The second pair is magnetostatics. Nothing
couples them, which is why those two chapters can be studied separately and why
neither predicts a wave.

## 10.2 The two quasi-static approximations

Between full statics and full electrodynamics sit two useful halfway houses,
each obtained by keeping one time derivative and dropping the other.

**Electroquasistatics** keeps $\\partial \\boldsymbol{D}/\\partial t$ and drops
$\\partial \\boldsymbol{B}/\\partial t$. The electric field stays curl-free, so
voltage remains a well-defined function of position, but currents may charge
capacitances. This is circuit theory with capacitors.

**Magnetoquasistatics** keeps $\\partial \\boldsymbol{B}/\\partial t$ and drops
$\\partial \\boldsymbol{D}/\\partial t$. Now induced emfs exist, so transformers
and eddy currents are described, but displacement current is neglected. This is
circuit theory with inductors, and it is the setting for skin effect.

| Regime | Kept | Dropped | Describes |
|---|---|---|---|
| Statics | neither derivative | both | fixed charges, steady currents |
| Electroquasistatic | $\\partial D/\\partial t$ | $\\partial B/\\partial t$ | capacitance, dielectric loss |
| Magnetoquasistatic | $\\partial B/\\partial t$ | $\\partial D/\\partial t$ | inductance, eddy currents, skin depth |
| Full wave | both | nothing | radiation, propagation, waveguides |

## 10.3 The test that decides: electrical size

The honest criterion is not the frequency but the size of the object measured
in wavelengths. If a signal takes a time $L/c$ to cross the object and that time
is short compared with a period, every part of the object sees essentially the
same instantaneous field and a lumped description holds. Writing that as a
phase:

$$\\Delta \\phi = \\beta L = \\frac{2\\pi L}{\\lambda}, \\qquad \\text{lumped when} \\quad \\frac{L}{\\lambda} \\lesssim \\frac{1}{20}$$

One twentieth of a wavelength is 18 degrees of phase across the object, which
most engineers accept as negligible. Some use a tenth and some a fiftieth; what
matters is that the criterion is a ratio and not a frequency.

![Electrical size against frequency for objects one metre, ten centimetres and one centimetre across, with the one-twentieth-wavelength lumped limit marked: a ten centimetre board leaves the lumped regime at 149.9 megahertz.](/courses/fe-ee/figures/em3-quasistatic-map.svg)

### Worked Example 12 — is this board a lumped circuit?

**Given**: a circuit board 10.0 cm across, considered at 60 Hz, at 100 MHz and
at 2.45 GHz.

$$\\lambda = \\frac{c}{f}: \\qquad \\lambda _{60} = 4.997 \\times 10^{6}\\ \\mathrm{m}, \\quad \\lambda _{100M} = 2.998\\ \\mathrm{m}, \\quad \\lambda _{2.45G} = 0.1224\\ \\mathrm{m}$$

$$\\frac{L}{\\lambda}: \\qquad 2.00 \\times 10^{-8}, \\qquad 0.03336, \\qquad 0.8172$$

At 60 Hz the board is twenty billionths of a wavelength across and static
reasoning is beyond reproach. At 100 MHz it is 0.0334 wavelengths, just inside
the one-twentieth limit, so lumped analysis is defensible but transmission-line
effects are beginning. At 2.45 GHz it is 0.817 wavelengths across, the phase
varies by 294 degrees from edge to edge, and lumped analysis is meaningless.

The frequency at which this particular board reaches the limit is

$$f_{lim} = \\frac{c}{20L} = \\frac{2.99792458 \\times 10^{8}}{(20)(0.100)} = 1.499 \\times 10^{8}\\ \\mathrm{Hz}$$

**Answers: lumped at 60 Hz and marginally at 100 MHz, full-wave at 2.45 GHz,
with the crossover at 149.9 MHz.** *Trap*: judging by frequency alone. A 60 Hz
transmission line 3000 km long is 0.6 wavelengths and is emphatically not a
lumped circuit, while a 1 mm package at 10 GHz is one thirtieth of a wavelength
and is. Size in wavelengths decides, never frequency by itself.

### Worked Example 13 — how fast charge disappears from a conductor

**Given**: place a charge density inside a material of conductivity $\\sigma$
and permittivity $\\varepsilon$. Continuity, Ohm's law in point form and Gauss's
law combine into

$$\\frac{\\partial \\rho _{v}}{\\partial t} + \\frac{\\sigma}{\\varepsilon}\\rho _{v} = 0 \\quad \\Longrightarrow \\quad \\rho _{v}(t) = \\rho _{v}(0)e^{-t/\\tau}, \\quad \\tau = \\frac{\\varepsilon}{\\sigma}$$

| Material | $\\sigma$ (S/m) | $\\varepsilon _r$ | Relaxation time $\\tau$ |
|---|---|---|---|
| Copper | 5.8e7 | 1 | 1.53e-19 s |
| Seawater | 4.0 | 81 | 1.79e-10 s |
| Glass | 1.0e-12 | 5.0 | 44.3 s |

Copper: $\\tau = (8.8541878128 \\times 10^{-12})/(5.8 \\times 10^{7}) = 1.527 \\times 10^{-19}$ s.
Glass: $\\tau = (5.0)(8.8541878128 \\times 10^{-12})/(1.0 \\times 10^{-12}) = 44.27$ s.

**Answers: 0.153 attoseconds in copper, 179 picoseconds in seawater, 44.3
seconds in glass.** *Trap*: quoting the copper figure as physically meaningful.
It is far shorter than the mean time between electron collisions, so the simple
model has already broken down; the honest statement is that charge reaches the
surface of a metal effectively instantly on any timescale an engineer meets.
The useful entries are the other two: seawater relaxes fast enough to behave as
a conductor through the whole radio spectrum, and glass holds a static charge
for the best part of a minute.`,
      examTip: 'Compute L over lambda before deciding how to analyse anything. Under one twentieth, use lumped circuits and the static chapters. Over about a quarter, use transmission lines or full-wave methods. In between, expect the answer to depend on how much error is tolerable. The same rule explains why a power system is analysed with phasors and a phone antenna is not.',
      importantNote: 'The static chapters are not approximations that were superseded. They are the exact zero-frequency limit of the full set, and they remain exact whenever the object is small compared with a wavelength. What the full equations add is what happens when it is not, which is radiation.',
    },
    {
      id: 'mx-problem-sets',
      title: '11. Practice Problems with Full Solutions',
      content: `## 11.1 How to use these

Each problem states its givens, drives them to a number, and then names the
distractor the exam offers beside the right answer, together with the wrong
number that trap produces. Commit to an answer before reading the solution; the
trap line is only useful once you have something to compare it against.

## Problem Set D — The four equations, both forms, and the theorems

**D1.** A closed surface encloses a $+8.0$ nC charge and a $-3.0$ nC charge, and a $+5.0$ nC charge sits just outside it. Find the electric flux through the surface.

$$\\oint \\boldsymbol{E}\\cdot d\\boldsymbol{S} = \\frac{Q_{enc}}{\\varepsilon _{0}} = \\frac{(8.0 - 3.0) \\times 10^{-9}}{8.8541878128 \\times 10^{-12}} = 564.7\\ \\mathrm{V}\\cdot \\mathrm{m}$$

**Answer: 564.7 V.m.** *Trap*: including the external charge gives
$10.0 \\times 10^{-9}/\\varepsilon _{0} = 1129$ V.m, exactly double. An outside
charge sends as much flux in through one part of the surface as it sends out
through another, so its net contribution is zero however close it sits.

**D2.** Find the circulation of $\\boldsymbol{H}$ around a circular path of radius 5.0 cm that encircles a bundle carrying 12 A up and 4.0 A down.

By Ampere's law the circulation is the net enclosed current, and in terms of
$\\boldsymbol{H}$ there is no $\\mu _{0}$:

$$\\oint \\boldsymbol{H}\\cdot d\\boldsymbol{\\ell} = I_{enc} = 12 - 4.0 = 8.0\\ \\mathrm{A}$$

**Answer: 8.0 A.** *Trap*: multiplying by $\\mu _{0}$ gives
$1.005 \\times 10^{-5}$, which is the circulation of $\\boldsymbol{B}$, not of
$\\boldsymbol{H}$. The $\\boldsymbol{H}$ form is the one with no material
constant in it, which is exactly why it is the form used at boundaries. A second
trap is to use the radius: it does not appear, because the circulation depends
only on what is threaded.

**D3.** A magnetic field of 0.80 T threads a 150-turn coil of area 40 cm². The field collapses linearly to zero in 25 ms. Find the induced emf.

$$\\lvert \\mathrm{emf} \\rvert = N A \\frac{\\Delta B}{\\Delta t} = (150)(40.0 \\times 10^{-4})\\frac{0.80}{0.025} = 19.2\\ \\mathrm{V}$$

**Answer: 19.2 V.** *Trap*: leaving the area in square centimetres gives
$150 \\times 40 \\times 32 = 192000$ V. Every FE electromagnetics problem that
quotes an area in square centimetres is testing the conversion
$1\\ \\mathrm{cm^{2}} = 10^{-4}\\ \\mathrm{m^{2}}$, and the wrong answer differs
by a clean factor of ten thousand.

**D4.** A conducting bar 40 cm long slides at 6.0 m/s along rails in a field of 0.25 T perpendicular to the plane of the rails. Find the emf, and state which end is positive.

$$\\mathrm{emf} = B\\ell v = (0.25)(0.40)(6.0) = 0.60\\ \\mathrm{V}$$

**Answer: 0.60 V, with the positive end the one toward which the force
$q\\boldsymbol{v}\\times \\boldsymbol{B}$ pushes positive carriers.** *Trap*:
using the area swept per second and then multiplying by a turn count that was
never given. There is one conductor, not a coil, so no $N$ appears. A second
trap is including the rail separation twice, once as $\\ell$ and again inside a
computed area.

**D5.** State which Maxwell equation forbids each of the following, and why. (a) A magnetic field line that starts on a north pole and simply stops. (b) A region of empty space in which the electric flux out of a closed surface is not zero. (c) A capacitor in which the magnetic field around the gap differs from the field around the lead.

(a) $\\nabla \\cdot \\boldsymbol{B} = 0$ forbids it. Magnetic field lines have no
sources, so they close on themselves, returning through the magnet.

(b) $\\nabla \\cdot \\boldsymbol{D} = \\rho _{v}$ forbids it. With no charge
inside, the net flux out is zero, though the field itself need not be.

(c) The Ampere-Maxwell law forbids it. The displacement current in the gap
equals the conduction current in the lead at every instant, so both surfaces
give the same circulation.

**Answer: Gauss for magnetism, Gauss for electricity, Ampere-Maxwell.** *Trap*:
answering (b) with Faraday's law. Faraday concerns circulation around a loop,
not flux through a closed surface; the words "closed surface" always select a
divergence law.

## Problem Set E — Displacement current, boundaries and limits

**E1.** An air-gap capacitor of area 50 cm² and separation 1.0 mm has a field rising at 4.0e9 V/(m.s). Find the displacement current.

$$I_{d} = \\varepsilon _{0}A\\frac{dE}{dt} = (8.8541878128 \\times 10^{-12})(50.0 \\times 10^{-4})(4.0 \\times 10^{9}) = 1.771 \\times 10^{-4}\\ \\mathrm{A}$$

**Answer: 177.1 microamperes.** *Trap*: dividing by the separation as well,
as though the formula contained a capacitance. It does not: the separation
enters only if the problem gives a voltage rate instead of a field rate. Doing
so here gives 0.1771 A, a thousand times too large.

**E2.** A material has $\\sigma = 0.010$ S/m and $\\varepsilon _r = 15$. Classify it at 1.0 kHz and at 1.0 GHz.

$$\\frac{\\sigma}{\\omega \\varepsilon} = \\frac{\\sigma}{2\\pi f\\varepsilon _{0}\\varepsilon _r}: \\qquad \\frac{0.010}{(6.2831853)(1.0 \\times 10^{3})(8.8541878128 \\times 10^{-12})(15)} = 1.198 \\times 10^{4}$$

At 1.0 GHz the same expression with $f$ a million times larger gives
$1.198 \\times 10^{-2}$.

**Answer: a good conductor at 1 kHz (ratio 12000) and a low-loss dielectric at
1 GHz (ratio 0.012), crossing over at 12.0 MHz.** *Trap*: classifying by
conductivity alone. Conductivity does not move with frequency; the comparison
quantity $\\omega \\varepsilon$ does, by nine decades between these two cases.

**E3.** A field of 500 V/m in a dielectric with $\\varepsilon _{r1} = 2.5$ strikes a boundary with $\\varepsilon _{r2} = 8.0$ at 40° from the normal. Find the transmitted angle and magnitude.

$$\\tan \\theta _{2} = \\frac{\\varepsilon _{r2}}{\\varepsilon _{r1}}\\tan \\theta _{1} = 3.200\\tan 40° = 2.685 \\quad \\Rightarrow \\quad \\theta _{2} = 69.58°$$

The tangential part survives: $500\\sin 40° = 321.4$ V/m. The normal part
$500\\cos 40° = 383.0$ V/m is scaled by
$\\varepsilon _{r1}/\\varepsilon _{r2} = 0.3125$ to 119.7 V/m, so

$$\\lvert \\boldsymbol{E}_{2} \\rvert = \\sqrt{321.4^{2} + 119.7^{2}} = 342.9\\ \\mathrm{V/m}$$

**Answers: 69.58° and 342.9 V/m.** *Trap*: inverting the ratio gives
$\\tan \\theta _{2} = 0.2622$ and $\\theta _{2} = 14.68°$, bending the field the
wrong way. The field always leans further from the normal on the
higher-permittivity side.

**E4.** A 20 cm module is to be analysed at 500 MHz. Is a lumped model acceptable?

$$\\lambda = \\frac{2.99792458 \\times 10^{8}}{5.00 \\times 10^{8}} = 0.5996\\ \\mathrm{m}, \\qquad \\frac{L}{\\lambda} = \\frac{0.200}{0.5996} = 0.3336$$

**Answer: no. At a third of a wavelength the phase varies by 120 degrees across
the module, so transmission-line or full-wave analysis is required.** *Trap*:
reasoning that 500 MHz is "not that high". The threshold for this module is
$c/(20L) = 74.9$ MHz, and 500 MHz is nearly seven times past it.

**E5.** A plane wave in air of amplitude 60 V/m reflects from a perfect conductor. Find the surface current density, and the total tangential E just outside the conductor.

Total tangential $\\boldsymbol{E}$ at the surface must be zero, which is what
$\\Gamma = -1$ enforces. The magnetic fields then add:

$$J_{s} = \\frac{2E_{0}}{\\eta _{0}} = \\frac{120}{376.730313} = 0.3185\\ \\mathrm{A/m}, \\qquad E_{t} = 0$$

**Answers: 0.3185 A/m and zero.** *Trap*: reporting $E_{t} = 60$ V/m because
that is the incident amplitude. The reflected wave is present too, and its
tangential electric field exactly cancels the incident one at the surface —
which is the boundary condition that forced $\\Gamma = -1$ in the first place.`,
      examTip: 'Two conversions account for most lost marks in this chapter: square centimetres to square metres, which is a factor of ten thousand, and revolutions per minute to radians per second, which is a factor of 9.55. Do both before touching a formula. After that, the most common remaining slip is a forgotten relative permittivity, so check whether the problem named a material before using epsilon-nought on its own.',
      importantNote: 'Every trap named in these solutions is a factor error rather than a conceptual gulf: a factor of two from an external charge, of ten thousand from an area unit, of epsilon-r from a forgotten dielectric, of mu-nought from confusing B with H. The physics being right and the constant being wrong scores the same as knowing nothing, so the last check before moving on is always the number in front.',
    },
  ],
  keyTakeaways: [
    "Gauss (E): ∇·E = ρ/ε₀ — charges produce electric field.",
    "Gauss (B): ∇·B = 0 — no magnetic monopoles exist.",
    "Faraday: ∇×E = −∂B/∂t — changing B induces E (transformers, generators).",
    "Ampere-Maxwell: ∇×B = μ₀(J + ε₀∂E/∂t) — displacement current enables EM waves.",
    "Wave speed: v = 1/√(με); in free space v = c ≈ 3 × 10⁸ m/s.",
    "Intrinsic impedance of free space: η₀ = √(μ₀/ε₀) ≈ 377 Ω.",
  ],
},

  fee_wave_prop: {
  topicId: 'fee_wave_prop',
  title: 'Wave Propagation and Plane Waves',
  domainWeight: 'Electromagnetics · 4–6%',
  overview: 'Electromagnetic waves carry energy through space at the speed of light. Understanding plane wave properties, skin depth in conductors, and the Poynting vector for power flow is essential for FE exam problems in EM and communications.',
  sections: [
    {
      id: 'wp-plane-waves',
      title: '1. Plane Wave Properties',
      content: `## 1.1 Uniform Plane Wave

A plane wave propagating in the +z direction:

- **$E(z,t) = E_{0}\\cdot \\cos (\\omega t - kz)\\,\\hat{x}$** (electric field in x-direction)
- **$H(z,t) = (E_{0}/\\eta)\\cdot \\cos (\\omega t - kz) \\hat{y}$** (magnetic field in y-direction)

Key relationships:

| Quantity | Formula | Unit |
|---|---|---|
| Wave number | **$k = 2\\pi /\\lambda = \\omega /v$** | rad/m |
| Wavelength | **$\\lambda = v/f$** | m |
| Frequency | **$f = v/\\lambda$** | Hz |
| Angular frequency | **$\\omega = 2\\pi f$** | rad/s |
| Phase velocity | **$v = \\omega /k = f\\lambda$** | m/s |

In vacuum: **$\\lambda _{0} = c/f$** where c ≈ 3 × $10^{8}$ m/s.

## 1.2 Properties of Plane Waves

- **E, H, and propagation direction** are mutually perpendicular (TEM wave)
- **$|E|/|H| = \\eta$** (intrinsic impedance of the medium)
- **E and H are in phase** in lossless media
- **Polarization**: direction of E-field oscillation (linear, circular, or elliptical)

### Wavelength Examples

| Signal | Frequency | Wavelength |
|---|---|---|
| AM radio | 1 MHz | 300 m |
| FM radio | 100 MHz | 3 m |
| Wi-Fi | 2.4 GHz | 12.5 cm |
| Visible light | 600 THz | 500 nm |`,
      examTip: 'The relationship λ = c/f (in vacuum) or λ = v/f (in medium) is the most fundamental. If an FE exam question gives frequency, convert to wavelength immediately — many subsequent formulas use λ or k = 2π/λ.',
    },
    {
      id: 'wp-skin-poynting',
      title: '2. Skin Depth and Poynting Vector (Power Flow)',
      content: `## 2.1 Skin Depth

In a **good conductor** (σ >> ωε), electromagnetic fields decay exponentially:

**$\\delta = 1 / \\sqrt{\\pi f\\mu \\sigma}$**

At depth z = δ, amplitude drops to **$e^{-1} \\approx 37\\%$** of surface value.

| Material | $\\sigma$ (S/m) | $\\delta$ at 60 Hz | $\\delta$ at 1 GHz |
|---|---|---|---|
| Copper | $5.8 \\times 10^{7}$ | 8.5 mm | $2.1\\ \\mu \\mathrm{m}$ |
| Aluminum | $3.5 \\times 10^{7}$ | 11 mm | $2.7\\ \\mu \\mathrm{m}$ |
| Seawater ($\\varepsilon _r = 81$) | 4 | 32 m | 1.3 cm |

Seawater is only a "good conductor" at low frequency, so its 1 GHz entry
above comes from the exact attenuation constant of section 3.1 rather than
from $1/\\sqrt{\\pi f\\mu \\sigma}$, which would understate the depth by 1.6×
there. Both seawater figures are recomputed in section 3.2.

### Practical Implications

- At high frequencies, current flows only in a thin skin on conductor surface
- Effective resistance increases with frequency: **$R_{ac} = R_{dc} \\cdot (a/(2\\delta))$** for wire radius a >> δ
- Electromagnetic shielding: a few skin depths of conductor blocks most of the field

## 2.2 Poynting Vector

**$S = E \\times H$** (instantaneous power flow per unit area, W/m²)

**Direction**: S points in the propagation direction

### Time-Average Power

**S_avg = ½·Re(E × H*) = |$E_{0}$|² / (2η)** (for plane wave in lossless medium)

Equivalently: **$S_{avg} = \\tfrac{1}{2} |E_{0}||H_{0}|\\cdot \\cos (\\phi)$** where φ is phase angle between E and H.

### Loss Tangent

**$\\tan (\\delta _{loss}) = \\sigma /(\\omega \\varepsilon)$**

| $\\tan (\\delta _{loss})$ | Classification |
|---|---|
| $<< 1$ | Low-loss dielectric (wave propagates) |
| >> 1 | Good conductor (wave attenuates rapidly) |
| $\\approx 1$ | Lossy dielectric (moderate attenuation) |`,
      examTip: 'Skin depth δ = 1/√(πfμσ) decreases with increasing frequency. This means higher-frequency signals penetrate LESS into conductors. At microwave frequencies, skin depth is just a few micrometers — this is why thin copper plating on PCB traces is sufficient for RF.',
      importantNote: 'Do not confuse the loss tangent angle δ_loss with skin depth δ — they use the same Greek letter but are completely different quantities. Skin depth has units of meters; loss tangent is dimensionless.',
    },
    {
      id: 'wp-lossy-media',
      title: '3. Lossy Media: Exact Constants and Where Shortcuts Break',
      content: `## 3.1 The propagation constant without approximations

In a medium with conductivity, the phasor field varies as
$e^{-\\gamma z}$ with a complex propagation constant
$\\gamma = \\alpha + j\\beta$. Splitting Maxwell's equations into real and
imaginary parts gives the two exact expressions the handbook lists:

$$\\alpha = \\omega \\sqrt{\\tfrac{\\mu \\varepsilon}{2}\\left[\\sqrt{1 + (\\sigma /\\omega \\varepsilon)^{2}} - 1\\right]}, \\qquad \\beta = \\omega \\sqrt{\\tfrac{\\mu \\varepsilon}{2}\\left[\\sqrt{1 + (\\sigma /\\omega \\varepsilon)^{2}} + 1\\right]}$$

α sets how fast the amplitude decays (nepers per metre), β sets the phase
advance (radians per metre), and the penetration depth is always
$\\delta = 1/\\alpha$. Everything else in this topic is one of two limits of
those two formulas, chosen by the single dimensionless ratio
$\\tan \\delta _{loss} = \\sigma /(\\omega \\varepsilon)$:

| Regime | Condition | α reduces to | Behaviour |
|---|---|---|---|
| Good conductor | $\\sigma /\\omega \\varepsilon \\gg 1$ | $\\sqrt{\\pi f\\mu \\sigma}$ | fields die within a skin depth |
| Low-loss dielectric | $\\sigma /\\omega \\varepsilon \\ll 1$ | $(\\sigma /2)\\sqrt{\\mu /\\varepsilon}$ | wave propagates, slowly attenuating |
| In between | ratio near 1 | neither — use the exact form | both effects matter |

The classification is a statement about **frequency**, not about the
material. The same seawater that behaves as a metal to a 60 Hz field behaves
as a lossy dielectric to a microwave, because $\\omega \\varepsilon$ has grown
by seven decades while σ has not moved.

![Loss tangent against frequency for copper, seawater and moist soil, with the tan = 1 divide marked: each material crosses from conductor to dielectric behaviour at its own frequency.](/courses/fe-ee/figures/em-loss-tangent-crossover.svg)

Each material crosses at $f = \\sigma /(2\\pi \\varepsilon _{0}\\varepsilon _r)$:
moist soil (σ ≈ 0.01 S/m, $\\varepsilon _r$ ≈ 15) at about 12 MHz, seawater
(σ = 4 S/m, $\\varepsilon _r$ = 81) at about 888 MHz, and copper not until
roughly 10¹⁸ Hz — which is why a metal may be treated as a good conductor at
any frequency an engineer will meet.

## 3.2 Skin depth, computed rather than quoted

![Penetration depth against frequency for copper, aluminium and seawater, with the good-conductor shortcut shown dashed where it fails.](/courses/fe-ee/figures/em-skin-depth-materials.svg)

Inside a good conductor, $\\delta = 1/\\sqrt{\\pi f\\mu \\sigma}$, so the depth
falls as $1/\\sqrt{f}$: a hundredfold rise in frequency gives a tenfold
shrink. For copper, $\\sigma = 5.8 \\times 10^{7}$ S/m and $\\mu = \\mu _{0}$:

| Frequency | Copper δ | Field left at 3δ |
|---|---|---|
| 60 Hz | 8.53 mm | 5.0% |
| 1 kHz | 2.09 mm | 5.0% |
| 1 MHz | 66.1 µm | 5.0% |
| 1 GHz | 2.09 µm | 5.0% |

Two consequences follow. Above a few megahertz the current occupies a shell
thinner than a sheet of paper, so **the interior of a conductor is dead
weight**; hollow tubing and thin plating perform as well as solid bar. And
because 3δ always leaves 5% of the field regardless of frequency, shielding
requirements are stated in skin depths rather than in millimetres.

Seawater shows the failure mode of the shortcut. At 60 Hz the exact formula
gives 32.5 m, and the good-conductor approximation agrees to four figures. At
1 GHz the exact result is 1.29 cm while the approximation returns 0.80 cm —
low by a factor of 1.62, because $\\sigma /\\omega \\varepsilon$ has fallen to
0.89 and the material is no longer a good conductor at all. Submarine
communication lives on the left-hand end of that curve: at 76 Hz the depth is
about 29 m, which is why ELF is the only band that reaches a submerged boat.

## 3.3 Skin effect on a real conductor

At high frequency the current in a round wire is confined to an annulus of
thickness δ, so the effective cross-section shrinks and the resistance
climbs. For $a \\gg \\delta$ the resistance approaches that of a hollow shell:

$$R_{ac} \\approx \\frac{\\rho}{2\\pi a\\delta} = R_{dc}\\cdot \\frac{a}{2\\delta}$$

**Worked**: AWG 12 copper wire, radius a = 1.024 mm,
$\\rho = 1.72 \\times 10^{-8}\\ \\Omega \\cdot \\mathrm{m}$.

| Frequency | δ | a/2δ | Resistance per metre |
|---|---|---|---|
| DC | — | — | 5.22 mΩ |
| 100 kHz | 209 µm | 2.45 | 12.8 mΩ |
| 1 MHz | 66.1 µm | 7.75 | 40.5 mΩ |

The same wire is nearly eight times more resistive at 1 MHz than at DC, and
nothing about the copper has changed. This is why RF and switching-supply
windings use Litz wire (many insulated strands, each thinner than a skin
depth), why transformer designers watch AC winding loss as switching
frequencies rise, and why a fat conductor is not automatically a low-loss
one. Below about 10 kHz for this gauge the ratio a/2δ is under 1 and the DC
value is close enough.

## 3.4 Shielding, in decibels

Absorption in a conducting shield follows the same exponential: after n skin
depths the field is $e^{-n}$ of its value at the surface.

| Thickness | Field ratio | Attenuation |
|---|---|---|
| 1δ | 0.368 | 8.7 dB |
| 3δ | 0.050 | 26.1 dB |
| 5δ | 0.0067 | 43.4 dB |

At 1 GHz, copper's 2.09 µm skin depth means even a thin plating gives 5δ of
absorption — 43 dB — which is why enclosures are specified by their seams and
apertures rather than by their wall thickness. At 60 Hz the same 5δ needs
43 mm of copper, which is why nobody shields power-frequency magnetic fields
by absorption; they use high-permeability alloy to divert the flux instead.`,
      examTip: 'Compute σ/(ωε) before choosing a formula. If it is above roughly 100 the good-conductor shortcut δ = 1/√(πfμσ) is safe to three digits; if it is below about 0.01 the material is a low-loss dielectric and α = (σ/2)√(μ/ε); anywhere between, only the exact expression will do. Exam problems involving soil, seawater or biological tissue are usually placed deliberately near the crossover.',
      importantNote: 'Skin depth uses the permeability of the material, not of free space. A steel conductor with μ_r = 100 has a skin depth ten times smaller than a non-magnetic conductor of the same conductivity, which is why steel is a surprisingly effective low-frequency shield and a surprisingly poor high-frequency conductor.',
    },
    {
      id: 'wp-power-poynting',
      title: '4. Power Flow: Poynting, Exposure Limits, and Link Numbers',
      content: `## 4.1 From field strength to watts per square metre

For a uniform plane wave in a lossless medium, E and H are in phase and
related by η, so the time-averaged Poynting magnitude collapses to a single
term:

$$S_{avg} = \\tfrac{1}{2} E_{0}H_{0} = \\frac{E_{0}^{2}}{2\\eta} = \\tfrac{1}{2} \\eta H_{0}^{2}$$

using peak amplitudes. (With RMS amplitudes the factor of one half
disappears — a favourite source of 3 dB errors.)

**Worked**: a plane wave in air with a peak field of 1.00 V/m carries
$S_{avg} = 1^{2}/(2 \\times 376.7) = 1.33$ mW/m². A field of 1 V/m sounds
small and is: it is roughly the level a mobile phone produces at arm's
length.

## 4.2 Spreading: the inverse-square law with real numbers

An isotropic source radiating $P_{t}$ spreads its power over a sphere, so at
range r the density is $S = P_{t}/(4\\pi r^{2})$. Setting that equal to
$E_{0}^{2}/2\\eta$ converts between the two languages the exam uses.

**Given**: 100 W radiated isotropically; find the field at 10 m.

- Power density: $S = 100/(4\\pi \\times 100) = 79.6$ mW/m²
- Peak electric field: $E_{0} = \\sqrt{2\\eta _{0}S} = \\sqrt{2(376.7)(0.0796)} = 7.74$ V/m
- Peak magnetic field: $H_{0} = E_{0}/\\eta _{0} = 20.6$ mA/m

Doubling the distance quarters S but only halves E, because the field goes as
1/r while the power density goes as 1/r². Confusing the two is the most
common error in exposure and link-budget questions.

| Quantity | Distance dependence | Doubling r gives |
|---|---|---|
| Power density S | $1/r^{2}$ | one quarter |
| Field strengths E and H | $1/r$ | one half |
| Received power (fixed antenna) | $1/r^{2}$ | one quarter (−6 dB) |

## 4.3 The three plane-wave relations worth memorising

Every quantitative plane-wave question in the FE syllabus reduces to one of
these, and they chain together:

| Known | Wanted | Relation |
|---|---|---|
| $E_{0}$ | $H_{0}$ | $H_{0} = E_{0}/\\eta$, with η = 377 Ω in air |
| $E_{0}$ | $S_{avg}$ | $S_{avg} = E_{0}^{2}/2\\eta$ |
| f and medium | λ | $\\lambda = v/f = c/(f\\sqrt{\\varepsilon _r \\mu _r})$ |

**Worked chain**: a 2.45 GHz wave in air with a measured RMS field of 61 V/m
(a common exposure reference level) carries
$S = E_{rms}^{2}/\\eta = 61^{2}/376.7 = 9.9$ W/m², and has a free-space
wavelength of 12.2 cm. Inside food, with $\\varepsilon _r$ near 78, that
wavelength collapses to about 1.4 cm and the intrinsic impedance to about
43 Ω — the impedance mismatch at the surface is what makes the outside heat
faster than the inside.

## 4.4 Polarization, and what stays true in a lossy medium

**Polarization** names the direction in which E oscillates. Linear
polarization keeps E in one plane; circular polarization is two equal linear
components a quarter cycle apart, so the tip of E rotates once per period.
Two consequences show up in exam scenarios: a linearly polarized receiver
cross-oriented to the transmitter picks up nothing (in principle), while a
circularly polarized link is insensitive to the relative rotation of the two
antennas — the reason satellite and GPS links use it.

In a lossy medium three things change at once, and they change together:

- The amplitude decays as $e^{-\\alpha z}$, so the Poynting flux decays as
  $e^{-2\\alpha z}$ — **power falls at twice the field's rate in nepers**.
- E and H stop being in phase. The intrinsic impedance becomes complex,
  $\\eta = \\sqrt{j\\omega \\mu /(\\sigma + j\\omega \\varepsilon)}$, with a phase
  angle that approaches 45° in a good conductor.
- The average power is then $S_{avg} = \\tfrac{1}{2} \\mathrm{Re}(E \\times H^{*})$,
  and the $\\cos \\phi$ factor from that phase angle behaves exactly like the
  power factor in AC circuits.

That last parallel is worth holding on to. A good conductor presents a
45° impedance angle to an incoming wave, so field and current are far out of
phase, most of the incident energy is reflected rather than absorbed, and
what does enter is dissipated within a skin depth. It is the same
statement — in field language — as "a badly mismatched load reflects most of
the power", which is where the transmission-line topic picks up.`,
      examTip: 'Watch whether a field amplitude is peak or RMS. S_avg = E₀²/(2η) with peak values and E_rms²/η with RMS values; using the wrong pair is a factor-of-two error, which becomes 3 dB and usually matches one of the distractors exactly. Exposure limits are almost always quoted in RMS; wave equations written with cos(ωt − kz) are almost always peak.',
      importantNote: 'Field strength falls as 1/r but power density falls as 1/r². Halving a field means quartering the power density, so a "6 dB" change in received power is a factor of two in volts per metre and a factor of four in watts per square metre.',
    },
    {
      id: 'wp-plane-wave-derived',
      title: '5. The Uniform Plane Wave as the Solution, and Where the Impedance Comes From',
      content: `## 5.1 What the wave equation admits

The source-free wave equation says only that the second space derivative and
the second time derivative are proportional. Look for a solution in which
nothing varies across the direction of travel — a **uniform plane wave** — and
take the field along $\\hat{x}$ while the wave moves along $\\hat{z}$:

$$\\frac{\\partial ^{2}E_{x}}{\\partial z^{2}} = \\mu \\varepsilon \\frac{\\partial ^{2}E_{x}}{\\partial t^{2}}$$

Any twice-differentiable function of the single combination $t - z/v$ satisfies
this if $v = 1/\\sqrt{\\mu \\varepsilon}$, which is the mathematical way of saying
"a disturbance that keeps its shape and moves". Substituting the sinusoidal
case gives the form the exam uses:

$$E_{x}(z,t) = E_{0}\\cos (\\omega t - \\beta z), \\qquad \\beta = \\omega \\sqrt{\\mu \\varepsilon} = \\frac{2\\pi}{\\lambda}$$

The wave equation alone does **not** fix the magnetic field. For that, go back
one step to Faraday's law.

## 5.2 The impedance is not assumed, it is forced

Write the field as a phasor, $\\boldsymbol{E} = \\hat{x}E_{0}e^{-j\\beta z}$, and
apply $\\nabla \\times \\boldsymbol{E} = -j\\omega \\mu \\boldsymbol{H}$. For a field
with only an $x$ component varying only with $z$, the curl has only a $y$
component:

$$(\\nabla \\times \\boldsymbol{E})_{y} = \\frac{\\partial E_{x}}{\\partial z} = -j\\beta E_{0}e^{-j\\beta z} = -j\\omega \\mu H_{y}$$

$$H_{y} = \\frac{\\beta}{\\omega \\mu}E_{0}e^{-j\\beta z} = \\frac{\\omega \\sqrt{\\mu \\varepsilon}}{\\omega \\mu}E_{0}e^{-j\\beta z} = \\sqrt{\\frac{\\varepsilon}{\\mu}}\\,E_{0}e^{-j\\beta z}$$

So the ratio of the two field magnitudes is a property of the medium alone:

$$\\eta = \\frac{E_{x}}{H_{y}} = \\sqrt{\\frac{\\mu}{\\varepsilon}}$$

Three facts fall out of that one line and none of them was put in by hand.
$\\boldsymbol{H}$ points along $\\hat{y}$, perpendicular to both
$\\boldsymbol{E}$ and the direction of travel. The ratio is real in a lossless
medium, so the two fields are exactly in phase. And
$\\boldsymbol{E}\\times \\boldsymbol{H}$ points along $\\hat{z}$, which is the
direction the wave is going.

![One instant of a 300 megahertz plane wave in polyethylene: the electric field as a line, eta times the magnetic field as markers that land on it, and the Poynting product as a squared cosine that never goes negative and averages half its peak.](/courses/fe-ee/figures/em3-plane-wave-snapshot.svg)

### Worked Example 1 — a complete parameter set for one wave

**Given**: 300 MHz in polyethylene, $\\varepsilon _r = 2.25$, $\\mu _r = 1$, with
a peak electric field of 50.0 V/m.

$$n = \\sqrt{\\varepsilon _r \\mu _r} = 1.500, \\qquad v = \\frac{c}{n} = \\frac{2.99792458 \\times 10^{8}}{1.500} = 1.99862 \\times 10^{8}\\ \\mathrm{m/s}$$

$$\\lambda = \\frac{v}{f} = \\frac{1.99862 \\times 10^{8}}{3.00 \\times 10^{8}} = 0.66621\\ \\mathrm{m}, \\qquad \\beta = \\frac{2\\pi}{\\lambda} = 9.4313\\ \\mathrm{rad/m}$$

$$\\eta = \\frac{\\eta _{0}}{n} = \\frac{376.730313}{1.500} = 251.15\\ \\Omega, \\qquad H_{0} = \\frac{E_{0}}{\\eta} = \\frac{50.0}{251.15} = 0.19908\\ \\mathrm{A/m}$$

$$S_{avg} = \\frac{E_{0}^{2}}{2\\eta} = \\frac{2500}{502.31} = 4.9770\\ \\mathrm{W/m^{2}}$$

As a check by a different route, $\\beta$ can be built from the constants
instead of from $\\lambda$:
$\\beta = \\omega \\sqrt{\\mu _{0}\\varepsilon _{0}\\varepsilon _r} = 9.4313$ rad/m,
and $S_{avg} = \\tfrac{1}{2}E_{0}H_{0} = \\tfrac{1}{2}(50.0)(0.19908) = 4.9770$
W/m². Both agree to five figures.

**Answers: v = 1.9986e8 m/s, lambda = 66.62 cm, eta = 251.15 ohm, H0 = 199.08
mA/m, S = 4.977 W/m².** *Trap*: dividing the free-space wavelength by
$\\varepsilon _r$ rather than by $\\sqrt{\\varepsilon _r}$ gives 44.4 cm. The
wavelength scales with the speed, and the speed carries a square root.

### Worked Example 2 — the free-space impedance, three ways

$$\\eta _{0} = \\sqrt{\\frac{\\mu _{0}}{\\varepsilon _{0}}} = 376.7303\\ \\Omega, \\qquad \\eta _{0} = \\mu _{0}c = 376.7303\\ \\Omega, \\qquad \\eta _{0} = \\frac{1}{\\varepsilon _{0}c} = 376.7303\\ \\Omega$$

The three expressions are algebraically identical once $c = 1/\\sqrt{\\mu _{0}\\varepsilon _{0}}$
is substituted, but they use different pairs of tabulated numbers, so agreement
to seven figures is a real check on the arithmetic rather than a tautology.

**Units check**: henries per metre divided by farads per metre leaves henries
per farad, and the square root of a henry over a farad is an ohm — the same
combination that gives $\\sqrt{L/C}$ for a transmission line, which is not a
coincidence.

**Answer: 376.73 ohm, usually rounded to 377 or written as 120 pi.**

| Quantity | Free space | Medium with $\\varepsilon _r$, $\\mu _r = 1$ | Direction of change |
|---|---|---|---|
| Speed | $c$ | $c/\\sqrt{\\varepsilon _r}$ | slower |
| Wavelength at fixed $f$ | $\\lambda _{0}$ | $\\lambda _{0}/\\sqrt{\\varepsilon _r}$ | shorter |
| Phase constant | $\\beta _{0}$ | $\\beta _{0}\\sqrt{\\varepsilon _r}$ | larger |
| Impedance | 376.73 ohm | $376.73/\\sqrt{\\varepsilon _r}$ | lower |
| Frequency | $f$ | $f$ | unchanged |

The last row is the one candidates forget. Frequency is set by the source and
cannot change at a boundary; everything else adjusts around it.`,
      examTip: 'Build every plane-wave answer from three numbers: c, eta-nought and the square root of the relative permittivity. Speed and wavelength divide by that root, impedance divides by it, phase constant multiplies by it, and frequency does not move. If an answer has the wavelength growing inside a dielectric, the root has been applied upside down.',
      importantNote: 'The wave equation fixes the speed but says nothing about the magnetic field. The impedance comes from Faraday law alone, which is why it is a property of the medium and not of the wave. A stronger field simply carries a proportionally stronger H, and the ratio never changes.',
    },
    {
      id: 'wp-velocities',
      title: '6. Wavelength, Phase Velocity and Group Velocity Kept Apart',
      content: `## 6.1 Three quantities that coincide only in free space

**Phase velocity** is the speed of a point of constant phase,
$v_{p} = \\omega /\\beta$. **Group velocity** is the speed of a modulation
envelope, $v_{g} = d\\omega /d\\beta$. **Wavelength** is the spatial period of the
phase, $\\lambda = 2\\pi /\\beta$. In a uniform lossless medium
$\\beta = \\omega \\sqrt{\\mu \\varepsilon}$ is proportional to $\\omega$, so the two
velocities are equal and the distinction never arises.

The moment $\\beta$ stops being proportional to $\\omega$ — inside a waveguide,
in a plasma, in glass at optical frequencies — the two part company:

$$v_{p} = \\frac{\\omega}{\\beta}, \\qquad v_{g} = \\frac{d\\omega}{d\\beta} = \\left(\\frac{d\\beta}{d\\omega}\\right)^{-1}$$

A medium in which they differ is called **dispersive**, and the consequence is
that a pulse spreads as it travels, because its frequency components move at
different speeds.

## 6.2 The cutoff dispersion, and a phase velocity above c

A guided mode with a cutoff obeys $\\omega ^{2} = \\omega _{c}^{2} + (c\\beta)^{2}$.
Rearranging and differentiating gives the pair

$$v_{p} = \\frac{c}{\\sqrt{1 - (f_{c}/f)^{2}}}, \\qquad v_{g} = c\\sqrt{1 - (f_{c}/f)^{2}}, \\qquad v_{p}v_{g} = c^{2}$$

The product is $c^{2}$ at every frequency, which is the resolution of the
apparent paradox. The phase velocity exceeds $c$ and always has; but a point of
constant phase on an infinite sinusoid carries no information, and the envelope
that does carry it moves at $v_{g}$, which is always below $c$ by exactly the
compensating factor.

![Phase and group velocity for a mode with a cutoff, in units of c: the phase velocity rises above c near cutoff, the group velocity falls below it, and their product is exactly c squared at every frequency.](/courses/fe-ee/figures/em3-phase-group-velocity.svg)

### Worked Example 3 — a guide operated well above cutoff

**Given**: a rectangular guide of broad-wall width $a = 22.86$ mm, operated at
10.0 GHz in the mode whose cutoff is $f_{c} = c/(2a)$.

$$f_{c} = \\frac{2.99792458 \\times 10^{8}}{2(0.02286)} = 6.5571 \\times 10^{9}\\ \\mathrm{Hz}$$

$$\\sqrt{1 - (f_{c}/f)^{2}} = \\sqrt{1 - (0.65571)^{2}} = \\sqrt{0.57004} = 0.75501$$

$$v_{p} = \\frac{c}{0.75501} = 3.9707 \\times 10^{8}\\ \\mathrm{m/s}, \\qquad v_{g} = (0.75501)c = 2.2635 \\times 10^{8}\\ \\mathrm{m/s}$$

$$\\lambda _{g} = \\frac{v_{p}}{f} = \\frac{3.9707 \\times 10^{8}}{1.00 \\times 10^{10}} = 0.039707\\ \\mathrm{m} = 3.9707\\ \\mathrm{cm}$$

The free-space wavelength at 10 GHz is 2.9979 cm, so the guide wavelength is
32 % longer. The signal delay is $1/v_{g} = 4.418$ ns per metre, against
3.336 ns per metre in free space.

**Answers: cutoff 6.5571 GHz, v_p = 1.324c, v_g = 0.755c, guide wavelength
3.9707 cm, delay 4.418 ns/m.** *Trap*: quoting $v_{p}$ as the signal speed and
concluding that the guide transmits faster than light. It does not; the
envelope arrives at $v_{g}$, and the product check $v_{p}v_{g} = c^{2}$ catches
the error instantly.

### Worked Example 4 — velocity factor back to permittivity

**Given**: a coaxial cable specified with a velocity factor of 0.660, and
another with 0.850.

Velocity factor is $v/c$, and in a non-magnetic dielectric
$v/c = 1/\\sqrt{\\varepsilon _r}$, so

$$\\varepsilon _r = \\frac{1}{(v/c)^{2}}: \\qquad \\frac{1}{0.4356} = 2.296, \\qquad \\frac{1}{0.7225} = 1.384$$

**Answers: 2.296 for the first cable, consistent with solid polyethylene, and
1.384 for the second, which can only be a foamed dielectric that is mostly
air.** *Trap*: taking $\\varepsilon _r = 1/0.660 = 1.515$, forgetting the square.
That would put the cable's dielectric between air and Teflon, which no
manufacturer offers.

| Quantity | Symbol | Free space | Non-magnetic medium | Dispersive guide |
|---|---|---|---|---|
| Phase velocity | $v_{p}$ | $c$ | $c/\\sqrt{\\varepsilon _r}$ | above the medium value |
| Group velocity | $v_{g}$ | $c$ | $c/\\sqrt{\\varepsilon _r}$ | below the medium value |
| Their product | $v_{p}v_{g}$ | $c^{2}$ | $c^{2}/\\varepsilon _r$ | $c^{2}/\\varepsilon _r$ |
| Wavelength | $\\lambda$ | $c/f$ | $\\lambda _{0}/\\sqrt{\\varepsilon _r}$ | longer than either |

A second example makes the same point outside guided optics. A radio wave at
15.0 MHz entering an ionospheric layer whose plasma frequency is 9.00 MHz sees
$\\sqrt{1 - (9/15)^{2}} = 0.800$, so $v_{p} = 1.25c$ and $v_{g} = 0.800c$. Below
9 MHz the root turns imaginary, the wave does not propagate at all, and the
layer reflects — which is how short-wave broadcasting reaches over the
horizon.`,
      examTip: 'Compute the group velocity whenever a question asks how long a signal takes to arrive, and the phase velocity whenever it asks about wavelength or phase shift along a path. Mixing them is the classic error in guided-wave questions and it always produces an answer on the wrong side of c. If a question quotes a velocity factor, remember it is a speed ratio, so squaring its reciprocal is what returns the permittivity.',
      importantNote: 'A phase velocity greater than c violates nothing. An infinite sinusoid has been present forever and carries no information; the crest you are tracking was never launched. Information rides on a change in the wave, and every change travels at the group velocity or slower.',
    },
    {
      id: 'wp-poynting-integrated',
      title: '7. Power Flow, by Integrating the Poynting Vector',
      content: `## 7.1 The instantaneous vector and its average

The Poynting vector is the instantaneous power crossing unit area:

$$\\boldsymbol{S}(t) = \\boldsymbol{E}(t)\\times \\boldsymbol{H}(t) \\quad [\\mathrm{W/m^{2}}]$$

For a plane wave in a lossless medium both fields are cosines of the same
argument, so their product is a squared cosine:

$$S(t) = \\frac{E_{0}^{2}}{\\eta}\\cos ^{2}(\\omega t - \\beta z)$$

Two features of that expression carry all the physics. It is **never
negative**, so power flows steadily in one direction rather than sloshing back
and forth. And it oscillates at $2\\omega$, twice the field frequency, about a
mean that a period-long integral fixes:

$$S_{avg} = \\frac{1}{T}\\int _{0}^{T} \\frac{E_{0}^{2}}{\\eta}\\cos ^{2}(\\omega t)\\, dt = \\frac{E_{0}^{2}}{\\eta}\\cdot \\frac{1}{2} = \\frac{E_{0}^{2}}{2\\eta}$$

The one half is the average of a squared cosine and nothing more. In phasor
form the same result is written

$$\\boldsymbol{S}_{avg} = \\tfrac{1}{2}\\mathrm{Re}\\left(\\boldsymbol{E}\\times \\boldsymbol{H}^{*}\\right)$$

which reduces to $E_{0}^{2}/2\\eta$ when $\\eta$ is real and generalises correctly
when it is not.

![Instantaneous Poynting flux for a ten volt per metre wave in air and the running mean of its integral, which settles onto 132.72 milliwatts per square metre after exactly one period.](/courses/fe-ee/figures/em3-poynting-average.svg)

### Worked Example 5 — the average found by integration, not by formula

**Given**: $E_{0} = 10.0$ V/m peak, in air, at 100 MHz.

The peak flux is

$$S_{pk} = \\frac{E_{0}^{2}}{\\eta _{0}} = \\frac{100}{376.730313} = 0.265442\\ \\mathrm{W/m^{2}}$$

Integrating $S(t)$ numerically over exactly one period of 10.0 ns and dividing
by that period returns 0.1327209 W/m². The closed form gives
$E_{0}^{2}/2\\eta _{0} = 100/753.4606 = 0.1327209$ W/m². The two agree to eleven
significant figures, which is the arithmetic saying that the factor of one half
really is the average of $\\cos ^{2}$ and not a fudge.

**Answer: 132.72 mW/m².** *Trap*: reading 10.0 V/m as an rms value, which
drops the factor of one half and gives 265.44 mW/m² — exactly twice the true
answer. The cosine in the field expression is what makes 10.0 a peak.

### Worked Example 6 — peak, rms, and the three decibel error

**Given**: an exposure reference level of 61.0 V/m, which like all such limits
is quoted as an rms value, at 2.45 GHz in air.

With **rms** amplitude the one half is already inside the square, so

$$S_{avg} = \\frac{E_{rms}^{2}}{\\eta _{0}} = \\frac{3721}{376.730313} = 9.8771\\ \\mathrm{W/m^{2}}$$

Had the same 61.0 been treated as a peak value, the answer would have been
4.9385 W/m², a factor of two low, which is 3.01 dB.

$$E_{pk} = \\sqrt{2}\\,E_{rms} = 86.267\\ \\mathrm{V/m}, \\qquad S_{avg} = \\frac{86.267^{2}}{2(376.730313)} = 9.8771\\ \\mathrm{W/m^{2}}$$

The two routes agree, as they must, because $\\sqrt{2}$ squared and divided by
two is one.

**Answer: 9.877 W/m², whichever amplitude convention is used, provided the
matching formula is used with it.** *Trap*: mixing an rms field with the peak
formula. The wrong answer is always a clean factor of two in power, and both
values are offered.

| Given amplitude | Correct expression | Wrong pairing gives |
|---|---|---|
| Peak $E_{0}$ | $S_{avg} = E_{0}^{2}/2\\eta$ | twice the true power |
| RMS $E_{rms}$ | $S_{avg} = E_{rms}^{2}/\\eta$ | half the true power |
| Peak $H_{0}$ | $S_{avg} = \\tfrac{1}{2}\\eta H_{0}^{2}$ | twice the true power |
| Both peaks | $S_{avg} = \\tfrac{1}{2}E_{0}H_{0}$ | twice the true power |

## 7.2 Spreading, and the two different exponents

An isotropic source of radiated power $P_{t}$ spreads it over a sphere, so

$$S = \\frac{P_{t}}{4\\pi r^{2}}, \\qquad E_{0} = \\sqrt{2\\eta _{0}S} = \\frac{1}{r}\\sqrt{\\frac{\\eta _{0}P_{t}}{2\\pi}}$$

Power density falls as $1/r^{2}$ while field strength falls as $1/r$, because
one is the square of the other. Doubling the range quarters the power density
and halves the field. Any answer in which both fall by the same factor has
confused the two.`,
      examTip: 'Decide first whether the amplitude you were handed is peak or rms, then pick the matching expression. Wave equations written with a cosine give peaks; exposure limits, meter readings and power ratings give rms. The penalty for mismatching them is a factor of two in watts, which is exactly 3 dB, and the distractor list always contains it.',
      importantNote: 'The Poynting vector is a power density, in watts per square metre, not a power. To get watts you must multiply by an area, and for a spreading wave that area grows as r squared. This is why a receiver of fixed aperture collects power falling as one over r squared while the field it sees falls only as one over r.',
    },
    {
      id: 'wp-polarization-detail',
      title: '8. Polarization from the Phase Between Components',
      content: `## 8.1 Two components and one phase angle

Any transverse field can be written as two orthogonal linear components. Give
them amplitudes $E_{x0}$ and $E_{y0}$ and a relative phase $\\delta$:

$$\\boldsymbol{E}(t) = \\hat{x}E_{x0}\\cos (\\omega t) + \\hat{y}E_{y0}\\cos (\\omega t + \\delta)$$

The tip of the vector traces a closed figure once per period, and the shape of
that figure is the polarization. Everything follows from $\\delta$ and the
amplitude ratio:

- $\\delta = 0$ or $180°$ gives **linear** polarization, tilted at
  $\\arctan (E_{y0}/E_{x0})$ from the x axis.
- $\\delta = \\pm 90°$ with $E_{x0} = E_{y0}$ gives **circular** polarization,
  right-handed or left-handed with the sign.
- Everything else gives **elliptical** polarization, of which the other two are
  the limiting cases.

![Locus of the electric-field tip for equal-amplitude components at phase differences of zero, forty-five and ninety degrees: a line, an ellipse tilted at forty-five degrees, and a circle.](/courses/fe-ee/figures/em3-polarization-ellipse.svg)

## 8.2 The ellipse, solved

For the equal-amplitude case the algebra closes in two lines. Rotate into the
frame at $45°$ by forming $u = (E_{x}+E_{y})/\\sqrt{2}$ and
$w = (E_{x}-E_{y})/\\sqrt{2}$, and use the sum-to-product identities:

$$u = \\sqrt{2}\\cos (\\delta /2)\\cos (\\omega t + \\delta /2), \\qquad w = \\sqrt{2}\\sin (\\delta /2)\\sin (\\omega t + \\delta /2)$$

Those are the parametric equations of an ellipse with semi-axes
$\\sqrt{2}\\cos (\\delta /2)$ and $\\sqrt{2}\\sin (\\delta /2)$, tilted at $45°$.
The **axial ratio**, major over minor, is therefore

$$AR = \\cot (\\delta /2)$$

which is infinite at $\\delta = 0$ (a line), unity at $\\delta = 90°$ (a circle),
and finite in between.

### Worked Example 7 — the axial ratio of a 45 degree pair

**Given**: equal amplitudes with $\\delta = 45.0°$.

$$AR = \\cot (22.5°) = 2.41421, \\qquad AR_{dB} = 20\\log _{10}(2.41421) = 7.6555\\ \\mathrm{dB}$$

The semi-axes are $\\sqrt{2}\\cos 22.5° = 1.306563$ and
$\\sqrt{2}\\sin 22.5° = 0.541196$ in units of the component amplitude, and their
ratio is $1.306563/0.541196 = 2.414214$, confirming the closed form. Tracing the
locus numerically and measuring its extent in the rotated frame returns the
same two numbers to six decimals.

**Answers: axial ratio 2.414, or 7.66 dB.** *Trap*: reporting the ratio of the
two component amplitudes, which here is 1.000, and concluding the wave is
circular. Equal amplitudes are necessary for circularity but not sufficient;
the phase must also be a quarter cycle.

### Worked Example 8 — what misalignment costs

**Given**: a linearly polarized transmitter and a linearly polarized receiver
whose axis is rotated by $\\psi$.

Only the projection is received, so the voltage goes as $\\cos \\psi$ and the
power as $\\cos ^{2}\\psi$:

$$L_{dB} = -10\\log _{10}(\\cos ^{2}\\psi ) = -20\\log _{10}(\\cos \\psi )$$

| Misalignment $\\psi$ | Power fraction | Loss |
|---|---|---|
| 0° | 1.000 | 0 dB |
| 30° | 0.750 | 1.25 dB |
| 45° | 0.500 | 3.01 dB |
| 60° | 0.250 | 6.02 dB |
| 90° | 0.000 | total, in principle |

A circularly polarized wave received on a linear antenna loses 3.01 dB
whatever the rotation, because only one of the two equal components is
collected.

**Answers: 1.25 dB at 30 degrees, 3.01 dB at 45, 6.02 dB at 60, and a null at
90.** *Trap*: using $\\cos \\psi$ for the power rather than for the voltage. At
60° that gives 0.500 instead of 0.250, understating the loss by 3 dB.

## 8.3 Why any of this is engineered deliberately

Terrestrial point-to-point links use linear polarization and take care to
align, because the 3 dB penalty of circular is not worth paying when the
geometry is fixed. Satellite and navigation links use circular precisely
because the geometry is not fixed: a tumbling spacecraft or a hand-held
receiver has no defined rotation, and circular polarization makes the link
indifferent to it. Reflection off a surface reverses the handedness of a
circular wave, which is also why a right-hand-circular receiver rejects the
single-bounce multipath that would otherwise interfere with the direct path.`,
      examTip: 'Read the phase difference before the amplitudes. Zero or 180 degrees is linear no matter what the amplitudes are; 90 degrees with equal amplitudes is circular; anything else is elliptical. Then for a link-budget question remember that misalignment loss goes as cosine squared in power, and that circular into linear is always 3 dB.',
      importantNote: 'Handedness is defined by which way the field tip rotates as seen by an observer, and the two common conventions look at the wave from opposite ends. An exam question will not turn on the convention, but a specification sheet might, so check which end the standard is looking from before matching two antennas.',
    },
    {
      id: 'wp-lossy-limits',
      title: '9. The Two Limits of a Lossy Medium, Derived',
      content: `## 9.1 Where the limits come from

The exact propagation constant follows from substituting a total current
density $\\boldsymbol{J} + \\partial \\boldsymbol{D}/\\partial t = (\\sigma + j\\omega \\varepsilon)\\boldsymbol{E}$
into the curl equations, which gives

$$\\gamma ^{2} = j\\omega \\mu (\\sigma + j\\omega \\varepsilon), \\qquad \\gamma = \\alpha + j\\beta$$

Both limits come from expanding that square root, and both are worth doing once
rather than memorising.

**Good conductor**, $\\sigma \\gg \\omega \\varepsilon$. Drop the displacement term
entirely and use $\\sqrt{j} = (1+j)/\\sqrt{2}$:

$$\\gamma \\approx \\sqrt{j\\omega \\mu \\sigma} = (1+j)\\sqrt{\\frac{\\omega \\mu \\sigma}{2}} = (1+j)\\sqrt{\\pi f\\mu \\sigma}$$

so $\\alpha = \\beta = \\sqrt{\\pi f\\mu \\sigma}$ and the penetration depth is
$\\delta = 1/\\alpha = 1/\\sqrt{\\pi f\\mu \\sigma}$. That $\\alpha$ and $\\beta$ come
out equal is the signature of a conductor: the field loses one neper in the
same distance it turns through one radian.

The intrinsic impedance follows from the same substitution:

$$\\eta = \\sqrt{\\frac{j\\omega \\mu}{\\sigma}} = (1+j)\\sqrt{\\frac{\\omega \\mu}{2\\sigma}} = \\frac{1+j}{\\sigma \\delta}$$

so $\\lvert \\eta \\rvert = \\sqrt{\\omega \\mu /\\sigma}$ at an angle of exactly 45°.

**Good dielectric**, $\\sigma \\ll \\omega \\varepsilon$. Factor out the
displacement term and expand the root binomially:

$$\\gamma = j\\omega \\sqrt{\\mu \\varepsilon}\\sqrt{1 + \\frac{\\sigma}{j\\omega \\varepsilon}} \\approx j\\omega \\sqrt{\\mu \\varepsilon}\\left(1 + \\frac{\\sigma}{2j\\omega \\varepsilon}\\right) = \\frac{\\sigma}{2}\\sqrt{\\frac{\\mu}{\\varepsilon}} + j\\omega \\sqrt{\\mu \\varepsilon}$$

so $\\alpha = (\\sigma /2)\\sqrt{\\mu /\\varepsilon} = \\sigma \\eta /2$ while
$\\beta$ keeps its lossless value. The wave propagates essentially unchanged and
merely fades.

### Worked Example 9 — dielectric loss on a circuit board, two ways

**Given**: a substrate with $\\varepsilon _r = 4.40$ and a loss tangent of 0.0200
at 1.00 GHz.

Loss tangent is defined as $\\sigma /(\\omega \\varepsilon)$, so the effective
conductivity is

$$\\sigma = \\omega \\varepsilon _{0}\\varepsilon _r \\tan \\delta = (6.28319 \\times 10^{9})(8.8541878128 \\times 10^{-12})(4.40)(0.0200) = 4.8957 \\times 10^{-3}\\ \\mathrm{S/m}$$

Route one, through the impedance:
$\\eta = 376.730313/\\sqrt{4.40} = 179.60$ ohm, so

$$\\alpha = \\frac{\\sigma \\eta}{2} = \\frac{(4.8957 \\times 10^{-3})(179.60)}{2} = 0.43963\\ \\mathrm{Np/m}$$

Route two, eliminating $\\sigma$ and $\\eta$ entirely in favour of the loss
tangent:

$$\\alpha = \\frac{\\pi f \\sqrt{\\varepsilon _r}\\tan \\delta}{c} = \\frac{(3.14159 \\times 10^{9})(2.09762)(0.0200)}{2.99792458 \\times 10^{8}} = 0.43963\\ \\mathrm{Np/m}$$

The two agree to five figures, and the exact expression of section 3.1 gives
0.43961, confirming that the low-loss approximation is good to five parts in
one hundred thousand at this loss tangent.

In decibels, $\\alpha _{dB} = 8.6859\\alpha = 3.819$ dB/m.

**Answer: 0.4396 Np/m, or 3.82 dB per metre.** *Trap*: converting nepers to
decibels with a factor of 20 rather than 8.686. A neper is a factor of $e$ in
amplitude, so one neper is $20\\log _{10}e = 8.686$ dB, not 20.

### Worked Example 10 — how far a signal reaches into seawater

**Given**: seawater, $\\sigma = 4.00$ S/m, at 1.00 kHz. Find the depth at which
the field and the power have fallen to a given fraction.

At 1 kHz the loss tangent is enormous, so the good-conductor limit applies:

$$\\delta = \\frac{1}{\\sqrt{\\pi f\\mu _{0}\\sigma}} = \\frac{1}{\\sqrt{(3.14159 \\times 10^{3})(1.25664 \\times 10^{-6})(4.00)}} = 7.958\\ \\mathrm{m}$$

so $\\alpha = 0.12566$ Np/m. At a depth of 10.0 m,

$$\\frac{E}{E_{0}} = e^{-\\alpha z} = e^{-1.2566} = 0.2846, \\qquad \\frac{S}{S_{0}} = e^{-2\\alpha z} = e^{-2.5133} = 0.08100$$

so the field is at 28.5 % and the power at 8.10 % — a loss of
$8.6859 \\times 1.25664 = 10.915$ dB. The exact expression returns
$\\delta = 7.9578$ m, agreeing with the approximation to five figures because
$\\sigma /(\\omega \\varepsilon)$ here is about $8.9 \\times 10^{5}$.

**Answers: 7.96 m of skin depth, 10.9 dB of loss in 10 m.** *Trap*: applying
$e^{-\\alpha z}$ to the power as well as to the field. Power carries twice the
exponent, so the power loss in dB is $8.686\\alpha z$ using the amplitude
convention of 20 log, or equivalently $10\\log _{10}$ of $e^{-2\\alpha z}$; both
give 10.915 dB, and quoting 5.457 dB means the factor of two was dropped.

| Quantity | Decays as | In decibels |
|---|---|---|
| Field amplitude $E$ | $e^{-\\alpha z}$ | $8.686\\,\\alpha z$ |
| Power density $S$ | $e^{-2\\alpha z}$ | $8.686\\,\\alpha z$ |
| Field after one $\\delta$ | 0.3679 | 8.686 dB |
| Power after one $\\delta$ | 0.1353 | 8.686 dB |

The two decibel columns are identical, which surprises people the first time.
A decibel is defined so that the same number of decibels describes an amplitude
ratio and its corresponding power ratio; that is the entire purpose of the 20
against 10 in the two definitions.`,
      examTip: 'Compute sigma over omega-epsilon before choosing a formula, and use the exact expression whenever the ratio lies between about 0.01 and 100. When converting an attenuation constant to decibels, use 8.686 per neper, and remember that a distance quoted in skin depths already tells you the answer: n skin depths is 8.686n decibels, for both field and power.',
      importantNote: 'The good-conductor result alpha equals beta has a physical reading worth keeping. Inside a metal the wave turns through one radian of phase in the same distance it loses 63 per cent of its amplitude, so barely a sixth of a wavelength exists inside the material before the field is gone. This is why a conductor reflects rather than absorbs.',
    },
    {
      id: 'wp-normal-incidence',
      title: '10. Normal Incidence: Reflection, Transmission and Standing Waves',
      content: `## 10.1 Two boundary conditions, two coefficients

At a plane boundary between two lossless media, tangential $\\boldsymbol{E}$ and
tangential $\\boldsymbol{H}$ must both be continuous. Writing the incident,
reflected and transmitted amplitudes as $E_{i}$, $E_{r}$ and $E_{t}$, those two
statements are

$$E_{i} + E_{r} = E_{t}, \\qquad \\frac{E_{i}}{\\eta _{1}} - \\frac{E_{r}}{\\eta _{1}} = \\frac{E_{t}}{\\eta _{2}}$$

The minus sign on the second line is the whole content of the problem: the
reflected wave travels backwards, so its Poynting vector must reverse, and
since $\\boldsymbol{E}$ is taken unreversed it is $\\boldsymbol{H}$ that flips.
Solving the pair gives

$$\\Gamma = \\frac{E_{r}}{E_{i}} = \\frac{\\eta _{2} - \\eta _{1}}{\\eta _{2} + \\eta _{1}}, \\qquad \\tau = \\frac{E_{t}}{E_{i}} = \\frac{2\\eta _{2}}{\\eta _{2} + \\eta _{1}} = 1 + \\Gamma$$

Only the **ratio** of the impedances appears, which is why the same two formulas
serve a dielectric interface and a transmission-line joint.

![Reflection at normal incidence from air onto a non-magnetic dielectric, as amplitude and as power: the reflected and transmitted power fractions add to one at every permittivity.](/courses/fe-ee/figures/em3-reflection-normal.svg)

## 10.2 The standing wave that results

In medium 1 the incident and reflected waves superpose. With the boundary at
$z = 0$ and the incident wave arriving from negative $z$,

$$\\lvert E_{1}(z) \\rvert = \\lvert E_{i} \\rvert \\left\\lvert 1 + \\Gamma e^{j2\\beta z} \\right\\rvert$$

which swings between $\\lvert E_{i} \\rvert (1 + \\lvert \\Gamma \\rvert )$ and
$\\lvert E_{i} \\rvert (1 - \\lvert \\Gamma \\rvert )$. The ratio of those two is
the **standing wave ratio**:

$$SWR = \\frac{1 + \\lvert \\Gamma \\rvert}{1 - \\lvert \\Gamma \\rvert}, \\qquad \\lvert \\Gamma \\rvert = \\frac{SWR - 1}{SWR + 1}$$

Adjacent maxima are half a wavelength apart, and a maximum is a quarter
wavelength from a minimum, because the exponent carries $2\\beta z$ rather than
$\\beta z$.

### Worked Example 11 — air onto polyethylene, in full

**Given**: a 300 MHz wave of peak amplitude 50.0 V/m in air, striking
polyethylene ($\\varepsilon _r = 2.25$) at normal incidence.

$$\\eta _{2} = \\frac{376.730313}{1.500} = 251.154\\ \\Omega, \\qquad \\Gamma = \\frac{251.154 - 376.730}{251.154 + 376.730} = \\frac{-125.576}{627.884} = -0.2000$$

$$\\tau = 1 + \\Gamma = 0.8000, \\qquad SWR = \\frac{1.200}{0.800} = 1.500$$

Power: the reflected fraction is $\\lvert \\Gamma \\rvert ^{2} = 0.0400$. The
transmitted fraction, computed the honest way from the transmitted intensity
rather than by subtraction, is

$$\\frac{\\lvert \\tau \\rvert ^{2}/\\eta _{2}}{1/\\eta _{1}} = \\lvert \\tau \\rvert ^{2}\\frac{\\eta _{1}}{\\eta _{2}} = (0.6400)(1.500) = 0.9600$$

and $0.0400 + 0.9600 = 1.0000$, so energy balances without having been assumed.
In absolute terms, $S_{inc} = 2500/753.461 = 3.3180$ W/m², of which 0.13272
W/m² returns and 3.1853 W/m² enters. Checking the transmitted figure directly:
$E_{t} = 40.0$ V/m and $40^{2}/(2 \\times 251.154) = 3.1853$ W/m².

The standing wave in air has $\\lvert E \\rvert _{max} = 60.0$ V/m and
$\\lvert E \\rvert _{min} = 40.0$ V/m. Since $\\Gamma$ is negative and real, the
minimum sits at the boundary and the first maximum is a quarter wavelength
back, at $0.99931/4 = 0.2498$ m.

**Answers: Gamma = -0.200, tau = 0.800, SWR 1.50, 4.00 % of the power
reflected, 60.0 and 40.0 V/m in the standing wave, first maximum 25.0 cm from
the surface.** *Trap*: reporting the transmitted power fraction as
$\\lvert \\tau \\rvert ^{2} = 0.64$. Amplitude transmission and power
transmission differ by the impedance ratio, and 0.64 plus 0.04 does not make
one, which is the check that catches it.

### Worked Example 12 — a hard mismatch, and what return loss means

**Given**: the same wave striking fresh water, $\\varepsilon _r = 81.0$.

$$\\eta _{2} = \\frac{376.730313}{9.000} = 41.859\\ \\Omega, \\qquad \\Gamma = \\frac{41.859 - 376.730}{418.589} = -0.8000$$

$$SWR = \\frac{1.800}{0.200} = 9.000, \\qquad \\lvert \\Gamma \\rvert ^{2} = 0.6400$$

Sixty-four per cent of the power comes straight back and only 36 % enters. The
power check again: $\\tau = 0.200$, so
$\\lvert \\tau \\rvert ^{2}\\eta _{1}/\\eta _{2} = (0.0400)(9.000) = 0.3600$, and
$0.6400 + 0.3600 = 1.0000$.

In the language of radio engineering,

$$RL = -20\\log _{10}\\lvert \\Gamma \\rvert = -20\\log _{10}(0.800) = 1.938\\ \\mathrm{dB}$$

**Answers: Gamma = -0.800, SWR 9.00, 64 % reflected, return loss 1.94 dB.**
*Trap*: assuming a large return loss means a large reflection. It is the
reverse: return loss is how far **down** the reflected signal is, so 1.94 dB is
a terrible match and 20 dB is a good one. A well-matched interface has
$\\lvert \\Gamma \\rvert = 0.1$ and a return loss of 20 dB.

| $\\lvert \\Gamma \\rvert$ | SWR | Power reflected | Return loss |
|---|---|---|---|
| 0.000 | 1.00 | 0 % | infinite |
| 0.100 | 1.22 | 1.00 % | 20.0 dB |
| 0.200 | 1.50 | 4.00 % | 13.98 dB |
| 0.500 | 3.00 | 25.0 % | 6.02 dB |
| 0.800 | 9.00 | 64.0 % | 1.94 dB |
| 1.000 | infinite | 100 % | 0 dB |`,
      examTip: 'Compute the impedance ratio first, because Gamma depends on nothing else. Then decide whether the question wants amplitude or power: Gamma and tau are amplitude ratios, and only Gamma squares directly into a power fraction. The transmitted power fraction is tau squared times the impedance ratio, never tau squared on its own, and the two power fractions must add to one.',
      importantNote: 'A negative Gamma is not an error, it is a 180 degree phase reversal, and it happens whenever the wave enters a medium of lower impedance, which for non-magnetic materials means a higher permittivity. That phase reversal is what puts a standing-wave minimum at the boundary rather than a maximum.',
    },
    {
      id: 'wp-oblique-brewster',
      title: '11. Oblique Incidence, Brewster\'s Angle and Total Reflection',
      content: `## 11.1 Snell's law, and why the polarizations split

At oblique incidence the phase along the boundary must match on both sides,
which is the whole content of the reflection and refraction laws:

$$\\theta _{i} = \\theta _{r}, \\qquad n_{1}\\sin \\theta _{i} = n_{2}\\sin \\theta _{t}$$

The two boundary conditions now involve the components of the fields along the
interface, so the amount of each field that lies along it depends on the
orientation. That splits the problem into two independent cases:

- **Perpendicular** (also called s, or transverse electric): $\\boldsymbol{E}$
  lies in the plane of the interface, perpendicular to the plane of incidence.
- **Parallel** (also called p, or transverse magnetic): $\\boldsymbol{E}$ lies
  in the plane of incidence.

$$\\Gamma _{\\perp} = \\frac{\\eta _{2}\\cos \\theta _{i} - \\eta _{1}\\cos \\theta _{t}}{\\eta _{2}\\cos \\theta _{i} + \\eta _{1}\\cos \\theta _{t}}, \\qquad \\Gamma _{\\parallel} = \\frac{\\eta _{2}\\cos \\theta _{t} - \\eta _{1}\\cos \\theta _{i}}{\\eta _{2}\\cos \\theta _{t} + \\eta _{1}\\cos \\theta _{i}}$$

At $\\theta _{i} = 0$ both reduce to the normal-incidence result, as they must.

![Reflection magnitude against angle of incidence for light passing from air onto glass: the perpendicular curve rises monotonically while the parallel curve dips to a true zero at the Brewster angle of 56.31 degrees.](/courses/fe-ee/figures/em3-brewster-fresnel.svg)

## 11.2 Brewster's angle: one polarization vanishes

$\\Gamma _{\\parallel}$ passes through zero when
$\\eta _{2}\\cos \\theta _{t} = \\eta _{1}\\cos \\theta _{i}$. For non-magnetic media
$\\eta = \\eta _{0}/n$, and combining that condition with Snell's law gives the
compact result

$$\\theta _{B} = \\arctan \\left(\\frac{n_{2}}{n_{1}}\\right) = \\arctan \\sqrt{\\frac{\\varepsilon _{r2}}{\\varepsilon _{r1}}}$$

$\\Gamma _{\\perp}$ has no such zero, so at $\\theta _{B}$ the reflected beam is
purely perpendicular whatever the incident polarization. That is how polarizing
sunglasses work: light reflected from a horizontal surface near Brewster's
angle is almost entirely horizontally polarized, so a vertically oriented
filter removes it.

### Worked Example 13 — Brewster and a general oblique case

**Given**: air onto glass, $n_{1} = 1.000$ and $n_{2} = 1.500$.

$$\\theta _{B} = \\arctan (1.500) = 56.310°, \\qquad \\theta _{t} = \\arcsin \\left(\\frac{\\sin 56.310°}{1.500}\\right) = 33.690°$$

The two add to exactly $90.000°$: at Brewster's angle the reflected and
transmitted rays are perpendicular to one another, which is the geometric
statement of the same condition.

Now take a general angle, $\\theta _{i} = 60.000°$. Snell gives
$\\sin \\theta _{t} = \\sin 60°/1.500 = 0.57735$, so $\\theta _{t} = 35.264°$, and
with $\\eta _{1} = 376.730$ ohm and $\\eta _{2} = 251.154$ ohm,

$$\\Gamma _{\\perp} = \\frac{(251.154)(0.50000) - (376.730)(0.81650)}{(251.154)(0.50000) + (376.730)(0.81650)} = \\frac{125.577 - 307.600}{125.577 + 307.600} = -0.42020$$

$$\\Gamma _{\\parallel} = \\frac{(251.154)(0.81650) - (376.730)(0.50000)}{(251.154)(0.81650) + (376.730)(0.50000)} = \\frac{205.066 - 188.365}{393.431} = 0.04245$$

**Answers: Brewster at 56.31°, and at 60° the perpendicular reflection is 0.4202
in amplitude (17.66 % of the power) against 0.04245 for the parallel (0.18 %).**
*Trap*: using the same formula for both polarizations. At 60° the two differ by
a factor of ten in amplitude and a factor of a hundred in power, so the wrong
formula is not a small error.

## 11.3 Total internal reflection

Going the other way, from dense to rare, Snell's law demands
$\\sin \\theta _{t} = (n_{1}/n_{2})\\sin \\theta _{i}$, and once
$\\sin \\theta _{i}$ exceeds $n_{2}/n_{1}$ there is no real transmitted angle.
The critical angle is

$$\\theta _{c} = \\arcsin \\left(\\frac{n_{2}}{n_{1}}\\right)$$

and beyond it $\\lvert \\Gamma \\rvert = 1$ for both polarizations: all the power
returns. The field does not stop dead at the boundary — an evanescent field
decays exponentially into the rarer medium — but it carries no time-averaged
power across.

### Worked Example 14 — critical angle and a fibre's acceptance cone

**Given**: glass to air, $n_{1} = 1.500$ and $n_{2} = 1.000$. Separately, a
step-index fibre with a core index of 1.480 and a cladding index of 1.460.

$$\\theta _{c} = \\arcsin \\left(\\frac{1.000}{1.500}\\right) = \\arcsin (0.66667) = 41.810°$$

For the fibre, guiding requires total reflection at the core-cladding wall, and
translating that back through the end face gives the numerical aperture:

$$NA = \\sqrt{n_{core}^{2} - n_{clad}^{2}} = \\sqrt{1.480^{2} - 1.460^{2}} = \\sqrt{0.058800} = 0.24249$$

$$\\theta _{max} = \\arcsin (0.24249) = 14.033°$$

**Answers: 41.81° critical angle for glass to air, and a fibre acceptance half
angle of 14.03°.** *Trap*: computing the numerical aperture as the difference
of the indices, $1.480 - 1.460 = 0.020$, which is more than ten times too
small. The definition is a difference of **squares** under a root, and the
factorisation $\\sqrt{(n_{1}+n_{2})(n_{1}-n_{2})}$ shows why the sum of the two
indices enters as well.

| Case | Condition | What happens |
|---|---|---|
| Normal incidence | $\\theta _{i} = 0$ | both polarizations identical |
| Brewster | $\\theta _{i} = \\arctan (n_{2}/n_{1})$ | parallel reflection is zero |
| Below critical, dense to rare | $\\theta _{i} < \\theta _{c}$ | partial transmission |
| At or beyond critical | $\\theta _{i} \\ge \\theta _{c}$ | total reflection, evanescent field only |
| Grazing | $\\theta _{i} \\to 90°$ | both magnitudes tend to 1 |`,
      examTip: 'Brewster is an arctangent of the index ratio and the critical angle is an arcsine of it, so the two are never interchangeable and only the critical angle requires going from dense to rare. Check the direction of travel before choosing. A useful memory hook: at Brewster the reflected and refracted rays are at right angles, and beyond critical there is no refracted ray at all.',
      importantNote: 'Total internal reflection is total only in the time-averaged sense. An evanescent field penetrates the rarer medium and decays over roughly a wavelength, which is why placing a second dense medium within that distance lets power tunnel across. That effect is used deliberately in fibre couplers and in the sensors that read a fingerprint through a prism.',
    },
    {
      id: 'wp-guided-waves',
      title: '12. The Guided Case: A Transmission Line Is a Plane Wave in a Box',
      content: `## 12.1 The same algebra, different symbols

A two-conductor line carrying a TEM wave has $\\boldsymbol{E}$ and
$\\boldsymbol{H}$ transverse to the direction of travel, exactly as a plane wave
does. The only change is bookkeeping: instead of field amplitudes the line is
described by a voltage between the conductors and a current along them, and
instead of $\\eta$ it has a characteristic impedance.

| Plane wave | Transmission line | Relationship |
|---|---|---|
| $E$ | $V$ | integrate E across the gap |
| $H$ | $I$ | integrate H around a conductor |
| $\\eta = \\sqrt{\\mu /\\varepsilon}$ | $Z_{0} = \\sqrt{L/C}$ | same square root, per-unit-length quantities |
| $v = 1/\\sqrt{\\mu \\varepsilon}$ | $v = 1/\\sqrt{LC}$ | identical in form |
| $\\Gamma = (\\eta _{2}-\\eta _{1})/(\\eta _{2}+\\eta _{1})$ | $\\Gamma = (Z_{L}-Z_{0})/(Z_{L}+Z_{0})$ | identical in form |
| $SWR$ from $\\lvert \\Gamma \\rvert$ | $SWR$ from $\\lvert \\Gamma \\rvert$ | identical |

Because the forms are identical, everything already derived transfers without
new work. A load resistance is an impedance mismatch, a standing wave forms on
the line exactly as it does in front of a dielectric slab, and the quarter-wave
transformer is the same trick as an anti-reflection coating.

### Worked Example 15 — a 50 ohm line, from the ground up

**Given**: a coaxial line filled with polyethylene, $\\varepsilon _r = 2.25$,
designed for $Z_{0} = 50.0$ ohm.

Speed and velocity factor first:

$$v = \\frac{c}{\\sqrt{2.25}} = 1.99862 \\times 10^{8}\\ \\mathrm{m/s}, \\qquad \\frac{v}{c} = 0.66667$$

Per-unit-length inductance and capacitance follow from
$Z_{0} = \\sqrt{L/C}$ and $v = 1/\\sqrt{LC}$, which invert to $L = Z_{0}/v$ and
$C = 1/(Z_{0}v)$:

$$L = \\frac{50.0}{1.99862 \\times 10^{8}} = 250.17\\ \\mathrm{nH/m}, \\qquad C = \\frac{1}{(50.0)(1.99862 \\times 10^{8})} = 100.07\\ \\mathrm{pF/m}$$

Checking backwards, $\\sqrt{L/C} = \\sqrt{2500} = 50.00$ ohm and
$1/\\sqrt{LC} = 1.99862 \\times 10^{8}$ m/s, so the pair is self-consistent. The
propagation delay is $1/v = 5.003$ ns per metre, the number a board designer
uses directly.

Now terminate the line in 75.0 ohm:

$$\\Gamma _{L} = \\frac{75.0 - 50.0}{75.0 + 50.0} = \\frac{25.0}{125.0} = 0.2000, \\qquad SWR = \\frac{1.200}{0.800} = 1.500$$

That is the same 0.200 and the same 1.500 as the air-to-polyethylene interface
in section 10, because the impedance ratio is the same 1.5 either way. The
return loss is 13.98 dB and the mismatch loss is
$-10\\log _{10}(1 - 0.0400) = 0.1773$ dB — a reflection of four per cent costs
less than two tenths of a decibel in through power, which is why moderate
mismatches are tolerated far more often than the SWR figure suggests.

To remove the reflection entirely, insert a quarter-wave section of

$$Z_{qw} = \\sqrt{Z_{0}Z_{L}} = \\sqrt{(50.0)(75.0)} = \\sqrt{3750} = 61.237\\ \\Omega$$

whose input impedance is $Z_{qw}^{2}/Z_{L} = 3750/75.0 = 50.00$ ohm. At 1.00
GHz its physical length is
$\\lambda /4 = (1.99862 \\times 10^{8})/(4.00 \\times 10^{9}) = 0.049965$ m, close
to 5.00 cm.

**Answers: 250.17 nH/m, 100.07 pF/m, 5.003 ns/m, Gamma 0.200, SWR 1.50, return
loss 13.98 dB, mismatch loss 0.177 dB, and a 61.24 ohm quarter-wave section
4.997 cm long.** *Trap*: computing the quarter-wave length from the free-space
wavelength, giving 7.495 cm. The transformer sits inside the dielectric, so its
length must use the wavelength there.

## 12.2 When a line must be treated as a line

The same electrical-size test from the Maxwell chapter decides it. A connection
shorter than about a twentieth of a wavelength behaves as a lumped wire; longer
than that, its impedance and delay start to matter. On this cable at 1 GHz a
twentieth of a wavelength is almost exactly 1.0 cm, so essentially every trace on a
gigahertz board is a transmission line and must be given a controlled
impedance.

The physical picture behind all of it is worth holding on to. A wave launched
into a mismatched load cannot deposit all its energy there, because the ratio
of voltage to current the load demands is not the ratio the line supplies. The
surplus has nowhere to go but back up the line, and the interference between
the outgoing and returning waves is the standing wave. Matching, in every one
of its forms, is the art of arranging that the load asks for the same ratio the
line offers.`,
      examTip: 'Treat a transmission-line question and a normal-incidence question as the same problem with different letters. Compute the impedance ratio, form Gamma, and read off SWR, reflected power and return loss from it. When a physical length is wanted, use the wavelength inside the line, which is the free-space wavelength divided by the square root of the relative permittivity.',
      importantNote: 'Characteristic impedance is not a resistance and dissipates nothing. It is the ratio of voltage to current that the line geometry enforces on a travelling wave, in exactly the way eta is the ratio the medium enforces on a plane wave. A 50 ohm line terminated in 50 ohm delivers all its power to the load, and none of it to the line.',
    },
    {
      id: 'wp-problem-sets',
      title: '13. Practice Problems with Full Solutions',
      content: `## 13.1 How to use these

Each problem states its givens, drives them to a number, and then names the
distractor the exam offers beside the correct answer, together with the wrong
number that trap produces. Work each problem to a number before reading on; the
trap line only helps once you have something to compare it against.

## Problem Set D — Plane waves, velocities and power

**D1.** A 2.00 GHz wave travels in a medium with $\\varepsilon _r = 6.25$ and $\\mu _r = 1$. Find the wavelength, the phase constant and the intrinsic impedance.

$$n = \\sqrt{6.25} = 2.500, \\qquad \\lambda = \\frac{c}{nf} = \\frac{2.99792458 \\times 10^{8}}{(2.500)(2.00 \\times 10^{9})} = 0.059959\\ \\mathrm{m}$$

$$\\beta = \\frac{2\\pi}{\\lambda} = 104.79\\ \\mathrm{rad/m}, \\qquad \\eta = \\frac{376.730313}{2.500} = 150.69\\ \\Omega$$

**Answers: 5.996 cm, 104.8 rad/m, 150.7 ohm.** *Trap*: dividing the free-space
wavelength by 6.25 rather than by 2.5, giving 2.398 cm. Both the speed and the
wavelength carry the square root of the permittivity, never the permittivity
itself.

**D2.** A plane wave in air has a peak magnetic field of 2.00 mA/m. Find the peak electric field and the average power density.

$$E_{0} = \\eta _{0}H_{0} = (376.730313)(2.00 \\times 10^{-3}) = 0.75346\\ \\mathrm{V/m}$$

$$S_{avg} = \\tfrac{1}{2}\\eta _{0}H_{0}^{2} = \\tfrac{1}{2}(376.730313)(4.00 \\times 10^{-6}) = 7.5346 \\times 10^{-4}\\ \\mathrm{W/m^{2}}$$

**Answers: 0.7535 V/m and 0.7535 mW/m².** *Trap*: dividing by the impedance
instead of multiplying, giving $5.31 \\times 10^{-6}$ V/m. The impedance is
volts per amp-per-metre, so it multiplies H to give E and divides E to give H;
a dimensional glance settles which.

**D3.** The same 100 W isotropic source is observed at 10.0 m and at 40.0 m. By what factor do the power density and the field strength fall?

$$S \\propto \\frac{1}{r^{2}}: \\quad \\left(\\frac{10.0}{40.0}\\right)^{2} = 0.0625, \\qquad E \\propto \\frac{1}{r}: \\quad \\frac{10.0}{40.0} = 0.250$$

**Answers: power density falls to one sixteenth, field to one quarter — a 12.0
dB change in both.** *Trap*: reporting a 24 dB change for the field because the
ratio is 0.25 and $20\\log _{10}(0.25) = -12.0$ dB. It is 12 dB, because
decibels already reconcile the two: $10\\log _{10}(0.0625)$ is also $-12.0$ dB.

**D4.** A guide has a cutoff of 4.00 GHz and is used at 5.00 GHz. Find the phase and group velocities and the guide wavelength.

$$\\sqrt{1 - (4.00/5.00)^{2}} = \\sqrt{0.360} = 0.600$$

$$v_{p} = \\frac{c}{0.600} = 4.9965 \\times 10^{8}\\ \\mathrm{m/s}, \\qquad v_{g} = (0.600)c = 1.7988 \\times 10^{8}\\ \\mathrm{m/s}$$

$$\\lambda _{g} = \\frac{v_{p}}{f} = \\frac{4.9965 \\times 10^{8}}{5.00 \\times 10^{9}} = 0.099930\\ \\mathrm{m}$$

**Answers: 1.667c, 0.600c and 9.993 cm, against a free-space wavelength of
5.996 cm.** *Trap*: using the free-space wavelength to space slots or probes in
the guide. The guide wavelength here is 67 % longer, and the product check
$v_{p}v_{g} = c^{2}$ confirms the pair.

**D5.** An antenna delivers 12.0 W into a 1.50 m² aperture at some distance. Find the power density and the rms field.

$$S = \\frac{12.0}{1.50} = 8.00\\ \\mathrm{W/m^{2}}, \\qquad E_{rms} = \\sqrt{\\eta _{0}S} = \\sqrt{(376.730313)(8.00)} = 54.90\\ \\mathrm{V/m}$$

**Answers: 8.00 W/m² and 54.90 V/m rms, equivalently 77.64 V/m peak.** *Trap*:
using $\\sqrt{2\\eta _{0}S}$ and calling the result rms. That expression returns
the peak value, 77.64 V/m; the factor of two belongs with the peak convention
only.

## Problem Set E — Lossy media, boundaries and polarization

**E1.** Find the skin depth of aluminium ($\\sigma = 3.50 \\times 10^{7}$ S/m) at 10.0 MHz, and the attenuation in decibels through 50.0 micrometres of it.

$$\\delta = \\frac{1}{\\sqrt{\\pi f\\mu _{0}\\sigma}} = \\frac{1}{\\sqrt{(3.14159 \\times 10^{7})(1.25664 \\times 10^{-6})(3.50 \\times 10^{7})}} = 2.6902 \\times 10^{-5}\\ \\mathrm{m}$$

Fifty micrometres is $50.0/26.902 = 1.8586$ skin depths, so the attenuation is
$8.686 \\times 1.8586 = 16.14$ dB.

**Answers: 26.9 micrometres, and 16.1 dB through a 50 micrometre foil.**
*Trap*: forgetting that the skin depth falls only as the square root of
frequency. Assuming it scales inversely with frequency would give a foil
thickness of hundreds of skin depths and a wildly optimistic shielding figure.

**E2.** A wave in air of peak amplitude 30.0 V/m strikes a large slab with $\\varepsilon _r = 4.00$ at normal incidence. Find the reflected and transmitted amplitudes and the SWR.

$$\\eta _{2} = \\frac{376.730313}{2.000} = 188.37\\ \\Omega, \\qquad \\Gamma = \\frac{188.37 - 376.73}{188.37 + 376.73} = -0.33333$$

$$E_{r} = \\Gamma E_{i} = -10.00\\ \\mathrm{V/m}, \\qquad E_{t} = (1 + \\Gamma )E_{i} = 20.00\\ \\mathrm{V/m}, \\qquad SWR = \\frac{1.3333}{0.66667} = 2.000$$

**Answers: 10.0 V/m reflected with a phase reversal, 20.0 V/m transmitted, SWR
2.00, and 11.1 % of the power reflected.** *Trap*: writing
$E_{t} = E_{i} - E_{r}$ and getting 40 V/m. The boundary condition is
$E_{i} + E_{r} = E_{t}$, and the sign of the reflection is already carried by
$\\Gamma$.

**E3.** A material has $\\varepsilon _r = 3.00$ and a loss tangent of 0.0100 at 5.00 GHz. Find the attenuation in dB per metre.

$$\\alpha = \\frac{\\pi f\\sqrt{\\varepsilon _r}\\tan \\delta}{c} = \\frac{(1.57080 \\times 10^{10})(1.73205)(0.0100)}{2.99792458 \\times 10^{8}} = 0.90753\\ \\mathrm{Np/m}$$

$$\\alpha _{dB} = 8.6859 \\times 0.90753 = 7.8827\\ \\mathrm{dB/m}$$

**Answers: 0.9075 Np/m, 7.88 dB/m.** *Trap*: converting nepers to decibels with
a factor of 20, giving 18.15 dB/m. One neper is 8.686 dB, and the 20 belongs to
the definition of the decibel from an amplitude ratio, not to the neper.

**E4.** Light in air meets water, $n = 1.333$. Find the Brewster angle, and the refracted angle at that incidence.

$$\\theta _{B} = \\arctan (1.333) = 53.123°, \\qquad \\theta _{t} = 90.000 - 53.123 = 36.877°$$

Checking with Snell: $\\sin 53.123° = 0.799928$, and
$0.799928/1.333 = 0.600096$, whose arcsine is $36.877°$ — the same angle to
three decimals.

**Answers: 53.12° and 36.88°.** *Trap*: using an arcsine and reporting
$\\arcsin (1/1.333) = 48.61°$, which is the critical-angle formula applied where
no critical angle exists. Brewster is an
arctangent; only the critical angle uses an arcsine, and there is no critical
angle going from air into water.

**E5.** A transmitter is linearly polarized and the receiving antenna is rotated 25.0° from it. A second link uses circular polarization at the transmitter and a linear receiver. Compare the polarization losses.

$$L_{1} = -20\\log _{10}(\\cos 25.0°) = -20\\log _{10}(0.906308) = 0.8545\\ \\mathrm{dB}$$

For the circular-to-linear case only one of the two equal components is
collected, so the loss is $-10\\log _{10}(0.500) = 3.010$ dB regardless of
rotation.

**Answers: 0.855 dB for the misaligned linear pair, 3.01 dB for the circular
into linear.** *Trap*: assuming that circular polarization always helps. It
costs a fixed 3 dB against a linear transmitter, and it only wins when the
alignment is unknown, since a linear pair misaligned by more than 45° is
already worse than 3 dB.`,
      examTip: 'Three conversions cover most of the lost marks in this chapter: nepers to decibels at 8.686 per neper, peak to rms at 1.414, and permittivity to speed through a square root. Do all three before substituting, and sanity-check the direction each time. A wave should slow down in a denser medium, a field should fall as one over r, and power should fall as one over r squared.',
      importantNote: 'Every trap named in these solutions is a factor error rather than a conceptual gulf: a square root left off a permittivity, a factor of two between peak and rms, a factor of 2.3 between 20 and 8.686, a factor of ten between an index difference and a numerical aperture. Getting the physics right and the constant wrong scores the same as knowing nothing, so the last thing to check is always the number in front.',
    },
  ],
  keyTakeaways: [
    'Plane wave: E ⊥ H ⊥ propagation; |E|/|H| = η (intrinsic impedance).',
    'Wave number k = 2π/λ = ω/v; wavelength λ = v/f; in vacuum λ₀ = c/f.',
    'Skin depth: δ = 1/√(πfμσ); field decays as e^(−z/δ) in conductors.',
    'Poynting vector S = E × H gives power flow; S_avg = |E₀|²/(2η).',
    'Loss tangent tan(δ) = σ/(ωε) classifies material as conductor or dielectric.',
  ],
},

  fee_em_tx_lines: {
  topicId: 'fee_em_tx_lines',
  title: 'EM Transmission Lines: Impedance & Reflections',
  domainWeight: 'Electromagnetics · 4–6%',
  overview: 'Transmission lines guide electromagnetic waves between source and load. Characteristic impedance, reflection coefficient, and VSWR determine signal integrity and power transfer efficiency. These concepts apply to coaxial cables, microstrip, and any guided-wave structure.',
  sections: [
    {
      id: 'emtx-z0-gamma',
      title: '1. Characteristic Impedance and Reflection Coefficient',
      content: `## 1.1 Characteristic Impedance

**$Z_{0} = \\sqrt{L/C}$** (for lossless line)

where L and C are inductance and capacitance **per unit length**.

For a lossy line: **$Z_{0} = \\sqrt{(R + j\\omega L)/(G + j\\omega C)}$**

| Line Type | Typical Z₀ | Where it is used |
|---|---|---|
| Coaxial cable | $50\\ \\Omega$ | RF measurement, instruments, radio |
| Coaxial cable | $75\\ \\Omega$ | TV, video, cable distribution |
| Microstrip (PCB) | 30–120 Ω (set by geometry) | on-board RF and digital routing |
| Twin-lead (open wire) | $300\\ \\Omega$ | antenna feeders, folded dipoles |

### Propagation Velocity

**$v_p = 1/\\sqrt{LC} = c/\\sqrt{\\varepsilon _r \\cdot \\mu _r}$**

In most practical cables with dielectric filling: **$v_p \\approx 0.66c$ to $0.85c$**

## 1.2 Reflection Coefficient

At load impedance Z_L:

**$\\Gamma = (Z_L - Z_{0}) / (Z_L + Z_{0})$**

| Load Condition | Z_L | Γ | Physical Meaning |
|---|---|---|---|
| **Matched** | $Z_{0}$ | **0** | No reflection, maximum power transfer |
| **Open circuit** | ∞ | **+1** | Total reflection, voltage doubles |
| **Short circuit** | 0 | **$-1$** | Total reflection, voltage cancels |
| Purely reactive | jX | **$\\lvert \\Gamma \\rvert = 1$** | Total reflection with phase shift |

### Reflected and Transmitted Power

- **Reflected power**: P_r = |Γ|² · P_inc
- **Transmitted power**: P_t = (1 − |Γ|²) · P_inc`,
      examTip: 'Γ = (Z_L − Z₀)/(Z_L + Z₀) is the most tested transmission line formula. For a matched load (Z_L = Z₀), Γ = 0 and all power is delivered. For open or short, |Γ| = 1 and all power reflects. Partial mismatch gives 0 < |Γ| < 1.',
      importantNote: 'The reflection coefficient Γ can be complex. Its magnitude |Γ| determines how much power reflects, and its phase determines where voltage maxima and minima occur on the line. For purely resistive loads, Γ is real.',
    },
    {
      id: 'emtx-vswr-matching',
      title: '2. VSWR, Standing Waves, and Impedance Matching',
      content: `## 2.1 Standing Waves

When Γ ≠ 0, incident and reflected waves superpose to create **standing waves**:

- **Voltage maximum**: V_max = V_inc·(1 + |Γ|)
- **Voltage minimum**: V_min = V_inc·(1 − |Γ|)

## 2.2 Voltage Standing Wave Ratio (VSWR)

**$VSWR = V_{\\max} / V_{\\min} = (1 + |\\Gamma |) / (1 - |\\Gamma |)$**

| VSWR | $\\lvert \\Gamma \\rvert$ | Reflected Power | Match Quality |
|---|---|---|---|
| **1.0** | 0 | 0% | Perfect match |
| 1.5 | 0.2 | 4% | Good |
| 2.0 | 0.33 | 11% | Acceptable |
| 3.0 | 0.5 | 25% | Poor |
| **∞** | 1.0 | 100% | Open or short |

Inverse: **$|\\Gamma | = (VSWR - 1) / (VSWR + 1)$**

## 2.3 Input Impedance

At distance d from the load:

**$Z_{in} = Z_{0} \\cdot (Z_L + jZ_{0}\\cdot \\tan (\\beta d)) / (Z_{0} + jZ_L\\cdot \\tan (\\beta d))$**

where β = 2π/λ.

### Special Cases

| Distance | Z_in |
|---|---|
| **d = λ/4** (quarter-wave) | **Z_in = Z₀²/Z_L** (impedance inverter) |
| **d = λ/2** (half-wave) | **Z_in = Z_L** (repeats load impedance) |

## 2.4 Quarter-Wave Matching

To match Z_L to a source Z_S, insert a **quarter-wave transformer** with:

**$Z_{0}$(match) = √(Z_S · Z_L)**`,
      examTip: 'The quarter-wave transformer formula Z₀ = √(Z_S·Z_L) is a classic FE exam question. A quarter-wave section transforms impedance by Z_in = Z₀²/Z_L. At half-wave, the impedance repeats (Z_in = Z_L). These two special cases cover most FE exam transmission line problems.',
    },
    {
      id: 'emtx-distributed',
      title: '3. Where Z₀ Comes From: Distributed L and C',
      content: `## 3.1 The line as a ladder

A transmission line has no lumped components in it, yet it has an impedance.
The resolution is that every millimetre of line has series inductance from
the magnetic field around its conductors and shunt capacitance from the
electric field between them. Model the line as an infinite ladder of small
$L\\,\\Delta z$ and $C\\,\\Delta z$ elements and ask what impedance a wave sees as
it advances: because the ladder is infinite, the answer must be unchanged by
adding one more section, and that self-consistency gives

$$Z_{0} = \\sqrt{L/C}, \\qquad v_{p} = 1/\\sqrt{LC}$$

with L and C **per unit length**. Two features of these expressions matter
more than the derivation:

- $Z_{0}$ is a **ratio**, so it does not depend on how long the line is. A
  10 cm and a 10 km 50 Ω cable present the same 50 Ω to a wave that has just
  been launched.
- $Z_{0}$ is not a resistance in the dissipative sense. A matched line
  absorbs power the way a resistor does, but it stores that power in the
  fields and delivers it to the far end.

## 3.2 A coaxial cable, from geometry to every parameter

The coaxial line is the one geometry for which the FE handbook supplies both
per-unit-length quantities, and the two are the same integral done twice:

$$L = \\frac{\\mu _{0}}{2\\pi}\\ln (b/a), \\qquad C = \\frac{2\\pi \\varepsilon _{0}\\varepsilon _r}{\\ln (b/a)}$$

**Given**: a polyethylene-filled cable, $\\varepsilon _r = 2.25$, with an outer
to inner conductor radius ratio b/a = 3.49.

| Quantity | Computation | Value |
|---|---|---|
| Series inductance | $(2 \\times 10^{-7})\\ln 3.49$ | 250 nH/m |
| Shunt capacitance | $2\\pi (8.854 \\times 10^{-12})(2.25)/\\ln 3.49$ | 100 pF/m |
| Characteristic impedance | $\\sqrt{L/C}$ | 50.0 Ω |
| Phase velocity | $1/\\sqrt{LC}$ | 2.00 × 10⁸ m/s |
| Velocity factor | $v_{p}/c$ | 0.667 |
| Propagation delay | $1/v_{p}$ | 5.00 ns/m |

Notice what cancelled. Multiplying L by C removes $\\ln (b/a)$ entirely and
leaves $\\mu _{0}\\varepsilon _{0}\\varepsilon _r$, so **the velocity depends only
on the dielectric, never on the dimensions**, and $v_{p} = c/\\sqrt{\\varepsilon _r}$.
The geometry survives only in the ratio, which is why every 50 Ω cable of a
given dielectric has the same b/a whatever its physical size. Working
backwards, exactly 50 Ω in polyethylene needs b/a = 3.493 — and a thicker,
lower-loss cable is simply a scaled copy of a thin one.

The 5 ns per metre is the single most useful number here. It is where the
rule of thumb "about 150 mm per nanosecond in cable" comes from, and it sets
the electrical length of everything downstream.

## 3.3 When does a wire become a transmission line?

Every interconnect is a transmission line; the question is whether the delay
matters. The usual criterion compares the round-trip delay with the signal's
rise time. If a reflection returns while the edge is still rising, it merges
into the edge and nothing is visible; if it returns afterwards, it appears as
a step, a ring or a plateau.

$$\\text{critical length} \\approx t_{r}v_{p}/2$$

**Worked**: on the cable above ($v_{p} = 2.0 \\times 10^{8}$ m/s), a 1.0 ns
edge gives a critical length of 10 cm. A 1.5 m run of the same cable has a
one-way delay of 7.5 ns and a round trip of 15 ns — fifteen times the rise
time, so reflections are fully resolved and termination is mandatory.

The same length can be described in wavelengths, which is the RF way of
saying it:

| Description | At 900 MHz on this cable | In free space |
|---|---|---|
| Wavelength | 22.2 cm | 33.3 cm |
| Quarter wave | 5.55 cm | 8.33 cm |
| 1.5 m run | 6.8 wavelengths | 4.5 wavelengths |

A line short compared with a wavelength (under about λ/20) behaves as a lump
and can be analysed with ordinary circuit theory; a line comparable with or
longer than a wavelength must be treated as distributed. The same 1.5 m cable
is a lump at 1 MHz and a 6.8-wavelength distributed structure at 900 MHz —
the physical hardware has not changed, only the frequency.

## 3.4 Other geometries, same story

| Structure | What sets Z₀ | Typical range |
|---|---|---|
| Coax | ratio b/a and $\\varepsilon _r$ | 50–75 Ω |
| Parallel two-wire | spacing ÷ wire diameter | 100–600 Ω |
| Microstrip | trace width ÷ substrate height, and $\\varepsilon _r$ | 30–120 Ω |
| Stripline | trace width ÷ ground spacing | 30–100 Ω |

Every entry in the middle column is a **ratio of dimensions**, never an
absolute size, and every one falls as the conductors are brought closer
(capacitance up, inductance down). That is why a PCB trace over a nearby
ground plane has a low impedance, why widening a trace lowers its impedance,
and why the 50 Ω convention survives: it is close to the geometry that
minimises loss in an air coax and remains buildable in a cable of practical
dimensions.`,
      examTip: 'If a problem gives a velocity factor or a dielectric constant, get v_p first — everything else (delay per metre, wavelength on the line, electrical length in degrees) follows from it. And remember that Z₀ = √(L/C) uses per-unit-length values: multiplying both L and C by the same length leaves Z₀ unchanged, which is the algebraic statement that impedance does not depend on how long the cable is.',
      importantNote: 'A matched line looks like a resistor of Z₀ ohms to the source, but it does not dissipate the power locally — it carries it to the load. Measuring a 50 Ω cable with an ohmmeter reads either an open or a short, depending on the far end, because a DC meter cannot see a wave.',
    },
    {
      id: 'emtx-reflections-worked',
      title: '4. Reflections in Time and Frequency',
      content: `## 4.1 One mismatch, five ways to describe it

The industry quotes mismatch in whichever unit suits the instrument, and the
exam expects fluent conversion. All five columns below are the same
information, computed from $\\Gamma = (Z_L - Z_{0})/(Z_L + Z_{0})$ on a 50 Ω
system:

| Load | Γ | VSWR | Return loss | Reflected power | Mismatch loss |
|---|---|---|---|---|---|
| 50 Ω | 0 | 1.00 | ∞ | 0% | 0 dB |
| 75 Ω | +0.200 | 1.50 | 14.0 dB | 4.0% | 0.18 dB |
| 100 Ω | +0.333 | 2.00 | 9.5 dB | 11.1% | 0.51 dB |
| 25 Ω | −0.333 | 2.00 | 9.5 dB | 11.1% | 0.51 dB |
| 150 Ω | +0.500 | 3.00 | 6.0 dB | 25.0% | 1.25 dB |
| 300 Ω | +0.714 | 6.00 | 2.9 dB | 51.0% | 3.10 dB |

The definitions behind the columns: return loss is
$-20\\log_{10}\\lvert \\Gamma \\rvert$, reflected power is $\\lvert \\Gamma \\rvert^{2}$, and mismatch
loss is $-10\\log_{10}(1 - \\lvert \\Gamma \\rvert^{2})$, the power actually lost from the
forward path.

Two rows are worth staring at. **25 Ω and 100 Ω give identical VSWR** — the
sign of Γ is lost in the magnitude, so VSWR alone cannot tell you whether a
load is too high or too low. And even a 2:1 VSWR costs only 0.5 dB of
delivered power; the reason engineers still chase a good match is rarely the
lost half-decibel, it is the reflected energy going back into an amplifier,
and the voltage peaks the standing wave produces.

## 4.2 Standing waves and what a slotted line measures

![Voltage magnitude along a 50 ohm line for matched, 100 ohm and 150 ohm loads: the peak-to-trough ratio is the VSWR and the minima repeat every half wavelength.](/courses/fe-ee/figures/em-standing-wave-envelope.svg)

The incident and reflected waves add in phase at some points and subtract at
others, producing a stationary envelope, $\\lvert V\\rvert = \\lvert V^{+}\\rvert \\,\\lvert 1 + \\Gamma e^{-2j\\beta d}\\rvert$.
Three measurable facts follow, and together they identify an unknown load:

- The ratio of maximum to minimum is the VSWR, giving $\\lvert \\Gamma \\rvert$.
- Adjacent minima are **λ/2 apart**, giving the wavelength on the line.
- The position of the first minimum relative to the load gives the phase of Γ.

For the 150 Ω load in the figure, the envelope runs between 1.5 and 0.5 of
the incident amplitude, so VSWR = 3.0 and $\\lvert \\Gamma \\rvert = 0.5$, agreeing with
$(150 - 50)/(150 + 50)$. A purely resistive load above $Z_{0}$ puts a
**maximum** at the load; below $Z_{0}$ it puts a minimum there — a useful
sign check.

The voltage peak is the practical hazard. At VSWR 3 the line carries 1.5× the
matched voltage at the peaks, so a cable and connector rated for a given
power at a perfect match may flash over well below that rating into a bad
antenna.

## 4.3 Quarter-wave matching, and its bandwidth

A quarter-wave section inverts impedance: $Z_{in} = Z_{0}^{2}/Z_L$. Choosing
$Z_{0} = \\sqrt{Z_{S}Z_{L}}$ makes that inversion land exactly on the source
impedance.

**Worked**: matching a 100 Ω load to a 50 Ω system needs
$Z_{0} = \\sqrt{(50)(100)} = 70.7\\ \\Omega$ of line, one quarter wavelength
long **at the design frequency in that line's dielectric**.

![Input reflection against frequency with and without a quarter-wave transformer: the match is perfect at f0 and degrades either side of it.](/courses/fe-ee/figures/em-quarter-wave-bandwidth.svg)

The match is exact only where the section really is 90° long. Off frequency
the electrical length drifts and the reflection returns: at 0.8 f₀ the
magnitude is back up to 0.109, and at 2 f₀ the section is a half wave, which
simply repeats the load and restores the original 1/3 mismatch. Between
0.795 f₀ and 1.205 f₀ the VSWR stays under 1.25 — a **41% bandwidth**, which
is generous for a single section and is why broadband matches use two or
three cascaded sections with intermediate impedances.

| Line length | Input impedance | Behaviour |
|---|---|---|
| λ/8 with $Z_L = 25\\ \\Omega$ | 40 + j30 Ω | reactive, no useful symmetry |
| λ/4 with $Z_L = 25\\ \\Omega$ | 100 Ω | inverted: $Z_{0}^{2}/Z_L$ |
| λ/2 with $Z_L = 25\\ \\Omega$ | 25 Ω | repeats the load exactly |

The half-wave row is worth remembering separately: impedance repeats every
half wavelength on a lossless line, so a measurement made anywhere at a
multiple of λ/2 from the load reads the load itself.

## 4.4 The same mismatch in the time domain

Digital work meets reflections as waveform artefacts rather than as VSWR, and
the tool is a bounce diagram. Reflections at each end are governed by
$\\Gamma _{L}$ and $\\Gamma _{S}$, and the observed voltage is the running sum.

**Given**: a 5.0 V step from a source of 25 Ω into a 1.5 m, 50 Ω line
(delay 7.5 ns each way) with an **open** far end.

- Initial launched step: the source and the line form a divider,
  $5.0 \\times 50/(25 + 50) = 3.33$ V
- $\\Gamma _{L} = +1$ (open), $\\Gamma _{S} = (25 - 50)/(25 + 50) = -0.333$

| Time | Event | Voltage at the open end |
|---|---|---|
| 7.5 ns | first step arrives and doubles | 6.67 V |
| 22.5 ns | after one source reflection | 4.44 V |
| 37.5 ns | after two | 5.19 V |
| 52.5 ns | after three | 4.94 V |
| steady state | — | 5.00 V |

The receiver sees 6.67 V — **33% overshoot above the supply rail** — followed
by a decaying ring that settles at 5 V only after several round trips. No
component in the circuit is faulty; the ring is the mismatch at both ends. A
series resistor at the source raised to 50 Ω makes $\\Gamma _{S} = 0$, so the
one reflection from the open end returns, is absorbed, and the waveform
settles in a single round trip. That is source-series termination, and it is
the same matching idea as the quarter-wave transformer, applied in the time
domain rather than at a single frequency.`,
      examTip: 'Convert between Γ and VSWR without hesitating: VSWR = (1 + |Γ|)/(1 − |Γ|) and |Γ| = (VSWR − 1)/(VSWR + 1). Then reflected power is |Γ|², transmitted is 1 − |Γ|². A load of 2Z₀ and a load of Z₀/2 give the same VSWR and the same reflected power — only the sign of Γ, and hence the position of the standing-wave minimum, distinguishes them.',
      importantNote: 'A quarter-wave transformer is quarter-wave only at one frequency, and the wavelength that matters is the one inside that section — shortened by √ε_r relative to free space. Sizing the section with the free-space wavelength is a standard trap and puts the match at the wrong frequency by that factor.',
    },
    {
      id: 'emtx-electrical-length',
      title: '5. Lumped or Distributed: the Criterion, Computed',
      content: `## 5.1 The only question that matters

Nothing about a piece of cable tells you whether to reach for Ohm's law or for
a wave equation. The hardware is identical either way. What decides is the
**electrical length**: how far the signal advances in phase, or in time,
between one end of the piece and the other. Write it as an angle,

$$\\theta = \\beta \\ell = \\frac{2\\pi \\ell}{\\lambda} = \\frac{2\\pi f \\ell}{v_{p}}$$

and check the units before going further: $\\beta$ carries rad/m, $\\ell$
carries m, so $\\theta$ is in radians and is dimensionless, as an angle must
be. The second form says the same thing in wavelengths, and the third makes
the frequency dependence explicit — the *same* hardware moves along this scale
as you change the frequency, which is why one cable can be two different
components in two different circuits.

Lumped circuit theory is the statement that $\\theta$ is small enough to
ignore, so every node in the piece has the same voltage at the same instant.
That is never exactly true and often true enough. The useful engineering
question is not "is it a transmission line" (everything is) but **how much
error does pretending otherwise cost**, and that can be computed exactly.

## 5.2 The cost of pretending, in closed form

Take the cleanest possible test case: a length $\\ell$ of lossless line with a
short circuit on the end. The exact input reactance is the transformation
formula with $Z_L = 0$, and the lumped model is simply the inductance of the
piece, $L'\\ell$:

$$X_{sc} = Z_{0}\\tan (\\beta \\ell), \\qquad X_{lump} = \\omega L' \\ell = Z_{0}\\,\\beta \\ell$$

The second identity is worth checking, because it is the one that carries the
units: $\\omega L' \\ell$ has $(\\mathrm{rad/s})(\\mathrm{H/m})(\\mathrm{m}) = \\mathrm{H/s} = \\Omega$.
And $Z_{0}\\beta \\ell = \\sqrt{L'/C'} \\cdot \\omega \\sqrt{L'C'} \\cdot \\ell$, which is
$\\omega L' \\ell$ identically. So the
lumped inductor is exactly the **first term** of the exact answer, since

$$\\tan \\theta = \\theta + \\frac{\\theta^{3}}{3} + \\frac{2\\theta^{5}}{15} + \\cdots$$

and the fractional error of the lumped model follows immediately:

$$\\varepsilon_{sc} = \\left\\lvert 1 - \\frac{\\theta}{\\tan \\theta}\\right\\rvert \\approx \\frac{\\theta^{2}}{3}$$

Everything about the line has cancelled. $Z_{0}$ is gone, the dielectric is
gone, the frequency is gone except through $\\theta$. **The error of a lumped
model is a function of electrical length and nothing else**, which is why the
criterion can be stated once and used everywhere.

![Error of the single-lump model against electrical length, for a shorted stub replaced by one inductor and an open stub replaced by one capacitor: both errors are pure functions of the electrical angle and pass 3 per cent near one twentieth of a wavelength.](/courses/fe-ee/figures/em4-electrical-length.svg)

Repeating the exercise for an **open** stub replaced by one capacitor gives
$\\varepsilon_{oc} = \\lvert \\tan \\theta / \\theta - 1\\rvert$, which is also
$\\theta^{2}/3$ to leading order and slightly worse beyond it. The
numbers that come out are the reason for the folklore:

| Electrical length | $\\theta$ | Error, shorted stub | Error, open stub |
|---|---|---|---|
| $\\lambda/50$ | 7.2° | 0.53% | 0.53% |
| $\\lambda/20$ | 18.0° | 3.31% | 3.43% |
| $\\lambda/10$ | 36.0° | 13.52% | 15.63% |
| $\\lambda/8$ | 45.0° | 21.46% | 27.32% |

The often-quoted $\\lambda/20$ rule is therefore a **3 per cent rule**, and the
$\\lambda/10$ rule is a 14 per cent rule. Neither is a law; both are a choice
about how much error is tolerable. Below about $\\lambda/50$ the lumped model
is inside typical component tolerances and arguing further is wasted effort.

### Worked example 1 — one cable, two entirely different components

**Given**: the 1.5 m polyethylene coax of section 3, with
$v_{p} = 1.9986 \\times 10^{8}$ m/s. Classify it at 1.0 MHz and at 900 MHz.

At 1.0 MHz the wavelength on the line is

$$\\lambda = \\frac{v_{p}}{f} = \\frac{1.9986 \\times 10^{8}}{1.0 \\times 10^{6}} = 199.86\\ \\mathrm{m}$$

so $\\ell/\\lambda = 1.5/199.86 = 0.0075$, or $\\theta = 2.70^\\circ$. By the table
above the lumped error is under 0.1 per cent: the cable is a 150 pF capacitor
in parallel with nothing worth naming, and no wave analysis is warranted.

At 900 MHz, $\\lambda = 22.21$ cm, so $\\ell/\\lambda = 6.755$ and
$\\theta = 2432^\\circ$. The cable is nearly seven wavelengths long. There is no
lumped equivalent at all — an inductor and a capacitor cannot reproduce an
impedance that cycles through the whole complex plane thirteen times as you
walk the length. **The hardware did not change; the frequency did.**

### Worked example 2 — the digital criterion, and why it looks different

Digital designers rarely know the frequency, so the same criterion is written
against the **edge rate**. A reflection that leaves the driver, reaches the far
end and comes back within the rise time merges into the edge and is invisible;
one that returns later shows as a separate step. The break-even length is

$$\\ell_{crit} \\approx \\frac{t_{r}v_{p}}{2}$$

**Given**: $t_{r} = 1.0$ ns on the same cable.

$$\\ell_{crit} = \\frac{(1.0 \\times 10^{-9})(1.9986 \\times 10^{8})}{2} = 0.0999\\ \\mathrm{m}$$

so about 10 cm. Units check: $(\\mathrm{s})(\\mathrm{m/s}) = \\mathrm{m}$. The
1.5 m run is fifteen times that, with a one-way delay of 7.51 ns and a round
trip of 15.0 ns, so termination is not optional.

The two criteria are the same criterion. A 1.0 ns edge carries significant
energy up to roughly $0.35/t_{r} = 350$ MHz; at 350 MHz the wavelength on this
cable is 57 cm, and $\\ell_{crit} = 10$ cm is $0.175\\lambda$ — the same order
as the $\\lambda/10$ line, arrived at from the time domain instead of the
frequency domain.`,
      examTip: 'Compute the electrical length before anything else, and state it in wavelengths. Under about one twentieth of a wavelength you may use lumped circuit theory with roughly 3 per cent error; beyond about one tenth you must not. The same physical cable crosses that boundary as the frequency changes, so the classification belongs to the problem, not to the hardware.',
      importantNote: 'The error of a lumped model depends only on electrical length, not on the impedance, the dielectric or the frequency separately. That is why one number — length in wavelengths, or delay against rise time — settles the question for coax, twisted pair, PCB trace and busbar alike.',
    },
    {
      id: 'emtx-telegrapher',
      title: "6. The Telegrapher's Equations, from One Slice of Line",
      content: `## 6.1 A differential section

Cut a slice of line of length $\\Delta z$, short enough that it *is* a lumped
element by the criterion just established. It has four per-unit-length
parameters: series resistance $R'$ from conductor loss, series inductance $L'$
from the magnetic field around the conductors, shunt conductance $G'$ from
dielectric loss, and shunt capacitance $C'$ from the electric field between
them. The slice is a series arm $(R' + j\\omega L')\\Delta z$ and a shunt arm
$(G' + j\\omega C')\\Delta z$.

Kirchhoff's voltage law across the series arm, and current law at the shunt
node, give

$$v(z + \\Delta z, t) - v(z,t) = -\\left(R'\\,\\Delta z\\; i + L'\\,\\Delta z\\,\\frac{\\partial i}{\\partial t}\\right)$$

$$i(z + \\Delta z, t) - i(z,t) = -\\left(G'\\,\\Delta z\\; v + C'\\,\\Delta z\\,\\frac{\\partial v}{\\partial t}\\right)$$

Divide by $\\Delta z$ and let it go to zero. The result is the pair that this
whole topic rests on, the **telegrapher's equations**:

$$\\frac{\\partial v}{\\partial z} = -R'i - L'\\frac{\\partial i}{\\partial t}, \\qquad \\frac{\\partial i}{\\partial z} = -G'v - C'\\frac{\\partial v}{\\partial t}$$

Check the dimensions of the first: $\\partial v/\\partial z$ is V/m;
$R'i$ is $(\\Omega/\\mathrm{m})(\\mathrm{A}) = \\mathrm{V/m}$; and
$L'\\,\\partial i/\\partial t$ is $(\\mathrm{H/m})(\\mathrm{A/s}) = \\mathrm{V/m}$.
All three agree, which they must.

## 6.2 From two first-order equations to one wave equation

Differentiate the first with respect to $z$, substitute the second, and in
the sinusoidal steady state (replace $\\partial/\\partial t$ by $j\\omega$)
the pair collapses to a single ordinary differential equation:

$$\\frac{d^{2}V}{dz^{2}} = \\gamma^{2}V, \\qquad \\gamma^{2} = (R' + j\\omega L')(G' + j\\omega C')$$

whose general solution is two waves running in opposite directions,

$$V(z) = V^{+}e^{-\\gamma z} + V^{-}e^{+\\gamma z}, \\qquad I(z) = \\frac{V^{+}e^{-\\gamma z} - V^{-}e^{+\\gamma z}}{Z_{0}}$$

with

$$\\gamma = \\alpha + j\\beta = \\sqrt{(R' + j\\omega L')(G' + j\\omega C')}, \\qquad Z_{0} = \\sqrt{\\frac{R' + j\\omega L'}{G' + j\\omega C'}}$$

Three things deserve emphasis. First, the **minus sign** in the current: the
backward wave carries current the other way, and forgetting it is the single
most common algebra slip in this topic. Second, $Z_{0}$ appears as a *ratio of
a voltage wave to a current wave*, not as a component. Third, the units:
$\\sqrt{(\\Omega/\\mathrm{m})/(\\mathrm{S/m})} = \\sqrt{\\Omega/\\mathrm{S}} = \\Omega$,
and $\\sqrt{(\\Omega/\\mathrm{m})(\\mathrm{S/m})} = \\sqrt{1/\\mathrm{m}^{2}} = 1/\\mathrm{m}$.
**A per-unit-length quantity is
never an impedance on its own** — only the ratio of a series quantity to a
shunt quantity has ohms in it. An inductance of 0.250 microhenry per metre is
not "half of 50 ohms"; it is 0.250 microhenry per metre, and it produces
50 ohms only when divided by 100 picofarad per metre and square-rooted.

![Snapshots of a five volt step integrated numerically from the telegrapher equations on a 1.5 metre line driven through 25 ohms into an open circuit, showing the launched 3.33 volt plateau and the doubling at the open end.](/courses/fe-ee/figures/em4-telegrapher-fdtd.svg)

The figure is not a sketch of the solution: it is the solution. The curves come
from integrating the two coupled equations above on a staggered grid, with the
source and the open end written as node equations. Nothing in that computation
knows what $Z_{0}$, $\\Gamma$ or VSWR are, and every plateau it produces will
be checked against the algebra later in this chapter.

## 6.3 Lossless and low-loss

Setting $R' = G' = 0$ collapses everything:

$$\\gamma = j\\omega \\sqrt{L'C'}, \\qquad \\beta = \\omega\\sqrt{L'C'}, \\qquad Z_{0} = \\sqrt{\\frac{L'}{C'}}, \\qquad v_{p} = \\frac{\\omega}{\\beta} = \\frac{1}{\\sqrt{L'C'}}$$

$Z_{0}$ becomes purely real and frequency-independent, and every frequency
travels at the same speed, so a pulse keeps its shape. That is the ideal a
good cable is built to approach.

Real cable is *low-loss*, meaning $R' \\ll \\omega L'$ and $G' \\ll \\omega C'$.
Expanding the square root to first order in the small quantities gives

$$\\alpha \\approx \\frac{R'}{2Z_{0}} + \\frac{G'Z_{0}}{2}, \\qquad \\beta \\approx \\omega \\sqrt{L'C'}$$

The two terms of $\\alpha$ are the **conductor loss** and the **dielectric
loss**, and they behave differently with frequency: $R'$ grows as $\\sqrt{f}$
through the skin effect, while $G' = \\omega C' \\tan \\delta$ grows linearly
with $f$. Dielectric loss therefore wins eventually in every cable, which is
why the top decade of a cable's usable range is set by the plastic, not by the
copper.

### Worked example 3 — how good is "low-loss"?

**Given**: the polyethylene coax with $L' = 249.98$ nH/m and
$C' = 100.15$ pF/m, at 100 MHz, with a measured conductor resistance
$R' = 0.35\\ \\Omega/\\mathrm{m}$ and a dielectric loss tangent
$\\tan \\delta = 4.0 \\times 10^{-4}$.

First the shunt conductance, from its definition
$G' = \\omega C' \\tan \\delta$:

$$G' = 2\\pi (1.00 \\times 10^{8})(100.15 \\times 10^{-12})(4.0 \\times 10^{-4}) = 25.17\\ \\mu\\mathrm{S/m}$$

Now compare the two routes. The **approximation**, with
$Z_{0} = 49.96\\ \\Omega$:

$$\\alpha \\approx \\frac{0.35}{2(49.96)} + \\frac{(25.17 \\times 10^{-6})(49.96)}{2} = 3.503 \\times 10^{-3} + 0.629 \\times 10^{-3}$$

giving $\\alpha = 4.1315 \\times 10^{-3}$ Np/m. The **exact** complex square
root of $(R' + j\\omega L')(G' + j\\omega C')$ gives
$\\gamma = 4.13145 \\times 10^{-3} + j3.143769$ per metre. The approximation is
in error by four parts in ten million — for a line this good the low-loss form
is not an approximation in any practical sense.

Converting to the unit cable is sold in, with 1 Np = 8.6859 dB:

$$\\alpha = (4.1315 \\times 10^{-3})(8.6859)(100) = 3.589\\ \\mathrm{dB\\ per\\ 100\\ m}$$

and conductor loss is 85 per cent of it at this frequency. The exact $Z_{0}$
is $49.9615 - j0.0457\\ \\Omega$: a phase angle of $-0.052^\\circ$, so treating it as
a real 49.96 Ω costs nothing. Over a 30 m run the loss is 1.077 dB, and the
fraction of power surviving is $10^{-0.1077} = 0.780$.`,
      examTip: 'Know the four per-unit-length parameters and what each represents, and be able to write the two telegrapher equations from a slice. Then the lossless results Z0 = sqrt(L/C) and v_p = 1/sqrt(LC) are not memorised, they are what those equations give when R and G vanish. Watch the units: L in henry per metre over C in farad per metre gives ohms squared, and the square root gives ohms.',
      importantNote: 'A per-unit-length inductance or capacitance is not an impedance, and no rearrangement of one alone can produce ohms. Only the ratio of a series parameter to a shunt parameter has the dimensions of impedance. Any statement of the form "L prime is half the characteristic impedance" is dimensionally impossible and should be read as a warning that the units were never checked.',
    },
    {
      id: 'emtx-geometry',
      title: '7. Characteristic Impedance from Geometry',
      content: `## 7.1 One integral, three structures

For every two-conductor line, $L'$ and $C'$ come from the same field problem
solved twice — once for the magnetic energy and once for the electric — so
their product is fixed by the dielectric alone and their ratio by the shape
alone. That single fact organises the whole subject:

$$L'C' = \\mu_{0}\\varepsilon_{0}\\varepsilon_{r} = \\frac{\\varepsilon_{r}}{c^{2}}, \\qquad \\frac{L'}{C'} = Z_{0}^{2}$$

The consequences are worth stating baldly. **The speed on a line is set only by
what fills it**, never by how big it is; and **the impedance is set only by a
ratio of dimensions**, never by an absolute size. Scaling a cable up by a
factor of ten changes nothing electrical except its power handling.

### Coaxial line

$$L' = \\frac{\\mu_{0}}{2\\pi}\\ln \\frac{b}{a}, \\qquad C' = \\frac{2\\pi \\varepsilon_{0}\\varepsilon_{r}}{\\ln (b/a)}, \\qquad Z_{0} = \\frac{\\eta_{0}}{2\\pi \\sqrt{\\varepsilon_{r}}}\\ln \\frac{b}{a}$$

The third form is the first two combined, and it is worth carrying separately
because the numerical prefactor $\\eta_{0}/2\\pi = 59.96\\ \\Omega$ makes coax
arithmetic a single logarithm.

### Parallel two-wire (twin lead)

$$Z_{0} = \\frac{\\eta_{0}}{\\pi \\sqrt{\\varepsilon_{r}}}\\operatorname{arccosh}\\frac{D}{d}$$

with $D$ the centre-to-centre spacing and $d$ the wire diameter. The inverse
hyperbolic cosine is exact for round conductors at any spacing; the familiar
$\\ln (2D/d)$ form is its wide-spacing limit and is several per cent optimistic
once the wires are close.

### Microstrip

A microstrip is the awkward one, because its field lives partly in the
substrate and partly in the air above, so it has no single dielectric
constant. The standard treatment defines an **effective** permittivity that
the mixed field behaves as though it saw:

$$\\varepsilon_{eff} = \\frac{\\varepsilon_{r}+1}{2} + \\frac{\\varepsilon_{r}-1}{2}\\left(1 + \\frac{12h}{W}\\right)^{-1/2}$$

$$Z_{0} = \\frac{\\eta_{0}}{\\sqrt{\\varepsilon_{eff}}\\left[\\dfrac{W}{h} + 1.393 + 0.667\\ln\\left(\\dfrac{W}{h} + 1.444\\right)\\right]}, \\qquad \\frac{W}{h} \\ge 1$$

$$Z_{0} = \\frac{\\eta_{0}}{2\\pi\\sqrt{\\varepsilon_{eff}}}\\ln\\left(\\frac{8h}{W} + \\frac{W}{4h}\\right), \\qquad \\frac{W}{h} \\le 1$$

$$v_{p} = \\frac{c}{\\sqrt{\\varepsilon_{eff}}}, \\qquad t_{d} = \\frac{\\sqrt{\\varepsilon_{eff}}}{c}$$

Note that $\\varepsilon_{eff}$ always lies between 1 and $\\varepsilon_{r}$,
and that it depends on $W/h$: **a wide trace is more buried in the substrate
and therefore slower than a narrow one on the same board.** Two traces of
different width on one PCB do not have the same delay per millimetre, which is
why length-matching a bus means matching electrical length, not physical
length.

### Worked example 4 — designing a 75 ohm coax backwards

**Given**: a cable to be built with foamed polyethylene,
$\\varepsilon_{r} = 1.50$, inner conductor radius $a = 0.500$ mm.

Solve the coax expression for the ratio:

$$\\frac{b}{a} = \\exp\\left(\\frac{2\\pi Z_{0}\\sqrt{\\varepsilon_{r}}}{\\eta_{0}}\\right) = \\exp\\left(\\frac{2\\pi (75)(1.2247)}{376.730}\\right) = \\exp (1.53199) = 4.6274$$

so $b = 2.314$ mm and the dielectric is 4.63 mm across. Checking forwards with
the prefactor: $\\eta_{0}/(2\\pi\\sqrt{1.50}) = 48.956\\ \\Omega$, and
$48.956 \\times 1.53199 = 75.00\\ \\Omega$. The per-unit-length values follow:

| Quantity | Computation | Value |
|---|---|---|
| $L'$ | $(2 \\times 10^{-7})(1.53199)$ | 306.40 nH/m |
| $C'$ | $2\\pi (8.8542 \\times 10^{-12})(1.50)/1.53199$ | 54.471 pF/m |
| $Z_{0}$ | $\\sqrt{L'/C'}$ | 75.000 Ω |
| $v_{p}$ | $c/\\sqrt{1.50}$ | 2.4478 × 10⁸ m/s |
| Velocity factor | $v_{p}/c$ | 0.8165 |
| Delay | $1/v_{p}$ | 4.0853 ns/m |

The foam has bought speed: 0.8165 c against 0.6667 c for solid polyethylene,
so the same physical run has a delay 18 per cent shorter. It has also made the
cable fatter for the same impedance, since a lower $\\varepsilon_{r}$ needs a
larger $b/a$.

### Worked example 5 — 300 ohm twin lead, and why it is so wide

**Given**: 300 Ω in air, wire diameter $d = 1.00$ mm.

$$\\operatorname{arccosh}\\frac{D}{d} = \\frac{\\pi Z_{0}\\sqrt{\\varepsilon_{r}}}{\\eta_{0}} = \\frac{\\pi (300)}{376.730} = 2.50173$$

$$\\frac{D}{d} = \\cosh (2.50173) = 6.1428 \\quad\\Longrightarrow\\quad D = 6.14\\ \\mathrm{mm}$$

Check the per-unit-length values: $L' = (\\mu_{0}/\\pi)(2.50173) = 1000.7$ nH/m
and $C' = \\pi \\varepsilon_{0}/2.50173 = 11.119$ pF/m, giving
$\\sqrt{L'/C'} = 300.00\\ \\Omega$ and
$1/\\sqrt{L'C'} = 2.9979 \\times 10^{8}$ m/s — the speed of light exactly, as it
must be for an air line.

Compare with the coax: a 50 Ω coax needs $b/a = 3.49$, a 300 Ω open line needs
$D/d = 6.14$. High impedance means conductors far apart relative to their size,
because impedance rises with inductance and falls with capacitance, and
separating the conductors does both.

| $D/d$ | $Z_{0}$ in air |
|---|---|
| 2.0 | 157.9 Ω |
| 4.0 | 247.4 Ω |
| 6.0 | 297.1 Ω |
| 10.0 | 358.9 Ω |

The logarithmic dependence is the practical point: doubling the spacing adds
only about 80 Ω. Getting much above 600 Ω needs impractically thin wire, and
getting below about 100 Ω needs the conductors nearly touching — which is why
low impedances are built as coax or stripline and high impedances as open
wire.

### Worked example 6 — a 50 ohm trace on FR-4

**Given**: FR-4 with $\\varepsilon_{r} = 4.4$ and substrate height
$h = 1.60$ mm. Find the width for 50 Ω, and the delay.

The impedance expressions cannot be inverted in closed form, so solve
numerically. Bisection on $W/h$ converges to $W/h = 1.9246$, that is
$W = 3.079$ mm. Substituting back:

$$\\varepsilon_{eff} = \\frac{5.4}{2} + \\frac{3.4}{2}\\left(1 + \\frac{12}{1.9246}\\right)^{-1/2} = 2.70 + 1.70(0.37177) = 3.3320$$

$$Z_{0} = \\frac{376.730}{\\sqrt{3.3320}\\left[1.9246 + 1.393 + 0.667\\ln (3.3686)\\right]} = 50.00\\ \\Omega$$

The effective permittivity sits 68.6 per cent of the way from air to bulk
FR-4, which is a fair description of where the field is. The delay follows:

$$t_{d} = \\frac{\\sqrt{3.3320}}{2.9979 \\times 10^{8}} = 6.089\\ \\mathrm{ps/mm}$$

against 3.336 ps/mm in free space. At 2.0 GHz the wavelength on this trace is
82.12 mm, so a quarter-wave section is 20.53 mm — while the free-space quarter
wave is 37.47 mm. **Cutting the trace to the free-space length would make it
1.83 times a quarter wave**, and the circuit would not do what the schematic
says.

| $W/h$ | $\\varepsilon_{eff}$ | $Z_{0}$ |
|---|---|---|
| 0.5 | 3.040 | 95.6 Ω |
| 1.0 | 3.171 | 71.0 Ω |
| 1.9246 | 3.332 | 50.0 Ω |
| 3.0 | 3.460 | 37.6 Ω |
| 5.0 | 3.622 | 25.9 Ω |

The whole practical range of microstrip on this board is about 26 Ω to 96 Ω,
and it takes a ten-to-one change in width to cover it — the same logarithmic
insensitivity seen in coax and twin lead.`,
      examTip: 'Every geometry expression here is a ratio of dimensions inside a logarithm or an inverse cosh, divided by the square root of the dielectric constant. If a problem changes only the physical size and keeps the ratio, the impedance is unchanged. If it changes only the dielectric, the impedance scales as one over the square root of it and the velocity does too.',
      importantNote: 'Microstrip has no single dielectric constant: part of its field is in air. Use the effective permittivity for both the impedance and the delay, and remember that it depends on trace width, so wide and narrow traces on the same board do not have the same propagation delay per millimetre.',
    },
    {
      id: 'emtx-boundary',
      title: '8. The Reflection Coefficient, Derived from the Boundary',
      content: `## 8.1 Where the formula comes from

Nothing about a load imposes a reflection. What a load imposes is a
**relation between the total voltage and the total current at its terminals**,
and a single travelling wave generally cannot satisfy it. Put the load at
$z = 0$ and write the two waves the telegrapher's equations allow:

$$V(0) = V^{+} + V^{-}, \\qquad I(0) = \\frac{V^{+} - V^{-}}{Z_{0}}$$

The load says $V(0) = Z_{L}I(0)$. Substituting,

$$V^{+} + V^{-} = \\frac{Z_{L}}{Z_{0}}\\left(V^{+} - V^{-}\\right)$$

and collecting terms gives the reflection coefficient as a *ratio of the two
wave amplitudes the boundary forces*:

$$\\Gamma = \\frac{V^{-}}{V^{+}} = \\frac{Z_{L} - Z_{0}}{Z_{L} + Z_{0}}, \\qquad Z_{L} = Z_{0}\\,\\frac{1 + \\Gamma}{1 - \\Gamma}$$

Read that derivation once and the three memorised special cases stop being
memorised. $Z_{L} = Z_{0}$ makes the numerator vanish: one wave already
satisfies the boundary condition, so no second wave is needed. $Z_{L} = 0$
forces $V(0) = 0$, so $V^{-} = -V^{+}$ and $\\Gamma = -1$. $Z_{L} \\to \\infty$
forces $I(0) = 0$, so $V^{-} = +V^{+}$ and $\\Gamma = +1$. A purely reactive
load can absorb nothing, so $\\lvert \\Gamma \\rvert = 1$ with the phase set by
the reactance.

**Two solvers, one answer.** The two-equation system above can be solved
numerically for $V^{+}$ and $V^{-}$ without ever writing the ratio down, and
that was done for five different loads while preparing this chapter; the
magnitudes and phases agree with the formula to the last digit a computer
carries. That is the check worth doing on any derivation of this kind.

## 8.2 One mismatch, five units

Reflected power is $\\lvert \\Gamma \\rvert^{2}$ of incident, so the rest of the
vocabulary is bookkeeping:

$$\\mathrm{VSWR} = \\frac{1 + \\lvert \\Gamma \\rvert}{1 - \\lvert \\Gamma \\rvert}, \\qquad \\lvert \\Gamma \\rvert = \\frac{\\mathrm{VSWR} - 1}{\\mathrm{VSWR} + 1}$$

$$RL = -20\\log_{10}\\lvert \\Gamma \\rvert, \\qquad \\lvert \\Gamma \\rvert = 10^{-RL/20}$$

$$ML = -10\\log_{10}\\left(1 - \\lvert \\Gamma \\rvert^{2}\\right), \\qquad \\lvert \\Gamma \\rvert^{2} = 1 - 10^{-ML/10}$$

![Two panels: VSWR against the resistive load ratio, showing that a load of twice and half the line impedance give the same VSWR, and return loss and mismatch loss in decibels against the magnitude of the reflection coefficient.](/courses/fe-ee/figures/em4-mismatch-ladder.svg)

Note which conversions use 20 and which use 10. Return loss compares two
**voltages**, so it carries 20; mismatch loss compares two **powers**, so it
carries 10. Mixing them is the most common decibel error in this topic and it
doubles or halves the answer.

### Worked example 7 — a complex load, worked twice

**Given**: $Z_{L} = 30 + j40\\ \\Omega$ on a 50 Ω line.

$$\\Gamma = \\frac{(30 + j40) - 50}{(30 + j40) + 50} = \\frac{-20 + j40}{80 + j40}$$

Multiply above and below by the conjugate of the denominator:

$$\\Gamma = \\frac{(-20 + j40)(80 - j40)}{80^{2} + 40^{2}} = \\frac{-1600 + j800 + j3200 + 1600}{8000} = \\frac{j4000}{8000} = j0.500$$

The real part cancels exactly, so $\\Gamma = 0.500\\angle 90^\\circ$. The
magnitude route confirms it: $\\lvert -20 + j40\\rvert = 44.7214$ and
$\\lvert 80 + j40\\rvert = 89.4427$, whose ratio is $0.500000$; the angles
are $116.57^\\circ$ and $26.57^\\circ$, differing by exactly $90^\\circ$.

Everything else follows:

| Quantity | Expression | Value |
|---|---|---|
| VSWR | $(1 + 0.5)/(1 - 0.5)$ | 3.000 |
| Return loss | $-20\\log_{10}(0.5)$ | 6.021 dB |
| Reflected power | $\\lvert \\Gamma \\rvert^{2}$ | 25.00% |
| Mismatch loss | $-10\\log_{10}(0.75)$ | 1.249 dB |
| Load impedance back | $50(1 + j0.5)/(1 - j0.5)$ | 30 + j40 Ω |

The last row is the round trip: recovering the load from $\\Gamma$ confirms
that no information was lost, which is exactly what makes the standing-wave
measurement of the next section possible.

### Worked example 8 — reading the instrument backwards

Instruments report VSWR or return loss; problems ask for impedance. Both
conversions must run in reverse without hesitation.

**Given (a)**: an antenna analyser reads VSWR = 2.50 on a 50 Ω system.

$$\\lvert \\Gamma \\rvert = \\frac{2.50 - 1}{2.50 + 1} = \\frac{1.50}{3.50} = 0.42857$$

$$RL = -20\\log_{10}(0.42857) = 7.360\\ \\mathrm{dB}, \\qquad \\lvert \\Gamma \\rvert^{2} = 18.37\\%$$

$$ML = -10\\log_{10}(1 - 0.18367) = 0.881\\ \\mathrm{dB}$$

If — and only if — the load is known to be purely resistive, it is
$Z_{L} = 50 \\times 2.50 = 125\\ \\Omega$ **or**
$Z_{L} = 50/2.50 = 20\\ \\Omega$. VSWR alone cannot choose between them, because
it discards the sign of $\\Gamma$ along with its phase.

**Given (b)**: a network analyser reports 12.0 dB return loss.

$$\\lvert \\Gamma \\rvert = 10^{-12.0/20} = 0.25119, \\qquad \\mathrm{VSWR} = \\frac{1.25119}{0.74881} = 1.671$$

$$\\lvert \\Gamma \\rvert^{2} = 6.310\\%, \\qquad ML = -10\\log_{10}(0.93690) = 0.283\\ \\mathrm{dB}$$

Six per cent of the power comes back and less than three tenths of a decibel
is lost from the forward path. That asymmetry is the reason matching is
usually chased for the sake of the *source* rather than the *signal*: 0.28 dB
of insertion loss is invisible, but six per cent of a kilowatt returning into
a power amplifier is not.`,
      examTip: 'Derive the reflection coefficient rather than recalling it: two waves, one load relation, solve. Then the open, short and matched cases fall out and cannot be mixed up. Keep the two decibel conversions straight — return loss uses 20 log because it compares voltages, mismatch loss uses 10 log because it compares powers.',
      importantNote: 'VSWR and return loss both discard the phase of the reflection coefficient, so neither can distinguish a load of 2 Z0 from one of Z0 over 2, and neither can identify a complex load at all. Recovering the impedance needs one more measurement: the position of a standing-wave minimum, or a vector instrument.',
    },
    {
      id: 'emtx-standing',
      title: '9. Standing Waves, and Solving for an Unknown Load',
      content: `## 9.1 The envelope

Measure back from the load a distance $d$, so that $z = -d$. The forward wave
has advanced in phase and the reflected wave has retreated:

$$V(d) = V^{+}\\left(e^{+j\\beta d} + \\Gamma e^{-j\\beta d}\\right)$$

Factor out the forward wave, whose magnitude is constant on a lossless line:

$$\\lvert V(d)\\rvert = \\lvert V^{+}\\rvert \\left\\lvert 1 + \\lvert \\Gamma \\rvert e^{j(\\theta_{\\Gamma} - 2\\beta d)}\\right\\rvert$$

Everything about the standing wave is in that one bracket. The two terms add
when the angle is zero and subtract when it is $180^\\circ$, so

$$V_{max} = \\lvert V^{+}\\rvert \\left(1 + \\lvert \\Gamma \\rvert\\right), \\qquad V_{min} = \\lvert V^{+}\\rvert \\left(1 - \\lvert \\Gamma \\rvert\\right)$$

$$d_{max} = \\frac{\\theta_{\\Gamma}\\lambda}{4\\pi} + \\frac{n\\lambda}{2}, \\qquad d_{min} = d_{max} + \\frac{\\lambda}{4}$$

The factor of 2 in $2\\beta d$ is the whole reason the pattern repeats every
**half** wavelength rather than every wavelength: the reflected wave travels
the distance twice. It is also why maxima and minima are a **quarter**
wavelength apart, not a half.

![Voltage envelope along a lossless 50 ohm line terminated in 150 ohms and in 25 ohms, with the closed-form envelope drawn as a line and a numerical solution of the telegrapher equations drawn as circles on top of it.](/courses/fe-ee/figures/em4-standing-wave-fdtd.svg)

The circles in the figure are not decoration. They are the envelope extracted
from a time-domain integration of the telegrapher's equations, driven
sinusoidally to steady state and Fourier-projected at the drive frequency. The
solver was given only $L'$, $C'$, a source and a load; it produced a VSWR of
3.001 against the algebraic 3.000, and put its minima where the formula says.

Note the sign check the figure makes visible. The 150 Ω load, being **above**
$Z_{0}$, has $\\Gamma$ real and positive, so $\\theta_{\\Gamma} = 0$ and there
is a **maximum at the load**. The 25 Ω load, being below $Z_{0}$, has
$\\theta_{\\Gamma} = 180^\\circ$ and a **minimum at the load**. Both give
VSWR values of 3.0 and 2.0 respectively, and no amount of VSWR measurement
distinguishes high from low; the position of the pattern does.

### Worked example 9 — where the peaks are, and why they matter

**Given**: the load of worked example 7, $Z_{L} = 30 + j40\\ \\Omega$ on a 50 Ω
line at 300 MHz in a cable of velocity factor 0.6667, so
$\\lambda = 66.62$ cm.

From worked example 7, $\\Gamma = 0.500\\angle 90^\\circ$, so
$\\theta_{\\Gamma} = \\pi/2$ rad.

$$d_{max} = \\frac{(\\pi/2)\\lambda}{4\\pi} = \\frac{\\lambda}{8} = 0.1250\\lambda = 8.33\\ \\mathrm{cm}$$

$$d_{min} = \\frac{\\lambda}{8} + \\frac{\\lambda}{4} = 0.3750\\lambda = 24.98\\ \\mathrm{cm}$$

with both repeating every $\\lambda/2 = 33.31$ cm thereafter.

Now the engineering consequence. With $\\lvert \\Gamma \\rvert = 0.5$ the
envelope runs from $0.5\\lvert V^{+}\\rvert$ to $1.5\\lvert V^{+}\\rvert$, so
**the peak voltage on the line is 1.5 times what a matched line would carry**
for the same forward power. Voltage breakdown scales with the square of that:
a connector that flashes over at some power into a matched load will do so at
$1/1.5^{2} = 0.444$ of that power into this one. Meanwhile only 25 per cent of
the power is reflected and the delivered power falls by 1.25 dB. **The voltage
stress is the severe consequence of a mismatch, not the lost power** — which
is the opposite of most students' intuition.

### Worked example 10 — identifying an unknown load from a slotted line

This is the classical measurement, and it is a good test of whether the
standing-wave algebra has been understood rather than memorised.

**Given**: on a 50 Ω slotted line the ratio of maximum to minimum voltage is
3.00, adjacent minima are 33.31 cm apart, and the first minimum lies
24.98 cm from the load. Find $Z_{L}$.

**Step 1 — wavelength.** Minima repeat every half wavelength, so
$\\lambda$ is twice 33.31 cm, that is 66.62 cm.

**Step 2 — magnitude.** VSWR is 3.00, so

$$\\lvert \\Gamma \\rvert = \\frac{3.00 - 1}{3.00 + 1} = 0.500$$

**Step 3 — phase.** At a minimum the bracket angle is $180^\\circ$, so
$\\theta_{\\Gamma} - 2\\beta d_{min} = -\\pi$. The measured 24.98 cm is
$0.3750\\lambda$, so

$$\\theta_{\\Gamma} = 2\\beta d_{min} - \\pi = 4\\pi (0.3750) - \\pi = 1.5\\pi - \\pi = 0.5\\pi$$

that is $90^\\circ$, so $\\Gamma = 0.500\\angle 90^\\circ = j0.500$.

**Step 4 — impedance.**

$$Z_{L} = Z_{0}\\frac{1 + \\Gamma}{1 - \\Gamma} = 50\\,\\frac{1 + j0.5}{1 - j0.5} = 50\\,\\frac{(1 + j0.5)^{2}}{1.25} = 50(0.600 + j0.800)$$

$$Z_{L} = 30 + j40\\ \\Omega$$

which is exactly the load worked example 9 started from. Two scalar
measurements — a ratio and a position — recover a complex impedance, because
the ratio carries the magnitude and the position carries the phase. That is
the whole idea behind every reflectometer since.`,
      examTip: 'Remember that the standing-wave pattern repeats every half wavelength and that maxima and minima are a quarter wavelength apart, because the reflected wave covers each distance twice. A resistive load above the line impedance puts a maximum at the load; below it, a minimum. That sign check catches wrong answers faster than recomputing.',
      importantNote: 'The peak voltage on a mismatched line is (1 + |Gamma|) times the matched value, so a 3:1 VSWR raises it by half again and cuts the safe power to about 44 per cent. Cable and connector ratings are quoted into a matched load; a bad antenna can destroy hardware at well under its nameplate power while losing only about a decibel of delivered signal.',
    },
    {
      id: 'emtx-transformation',
      title: '10. The Impedance Transformation, Derived',
      content: `## 10.1 What a length of line does

Divide the total voltage by the total current at a distance $d$ back from the
load. Both are known from section 9:

$$Z_{in}(d) = \\frac{V(d)}{I(d)} = Z_{0}\\,\\frac{e^{+j\\beta d} + \\Gamma e^{-j\\beta d}}{e^{+j\\beta d} - \\Gamma e^{-j\\beta d}}$$

Divide top and bottom by $e^{+j\\beta d}$ and the whole transformation reduces
to a single rotating phasor:

$$Z_{in}(d) = Z_{0}\\,\\frac{1 + \\Gamma e^{-2j\\beta d}}{1 - \\Gamma e^{-2j\\beta d}}, \\qquad \\Gamma (d) = \\Gamma_{L}e^{-2j\\beta d}$$

That second statement is the one to remember: **moving along a lossless line
does not change $\\lvert \\Gamma \\rvert$, it only rotates its phase**, at
$2\\beta$ radians per metre. Every impedance a length of line can present lies
on a circle of fixed radius. Substituting
$\\Gamma = (Z_{L}-Z_{0})/(Z_{L}+Z_{0})$ and clearing the exponentials returns
the familiar form:

$$Z_{in}(d) = Z_{0}\\,\\frac{Z_{L} + jZ_{0}\\tan \\beta d}{Z_{0} + jZ_{L}\\tan \\beta d}$$

and on a lossy line the tangent becomes a hyperbolic tangent of $\\gamma d$:

$$Z_{in}(d) = Z_{0}\\,\\frac{Z_{L} + Z_{0}\\tanh \\gamma d}{Z_{0} + Z_{L}\\tanh \\gamma d}$$

which is the general result; the lossless form is the case $\\gamma = j\\beta$,
since $\\tanh (j\\theta) = j\\tan \\theta$.

## 10.2 The two special cases, derived rather than quoted

**Half wave.** At $d = \\lambda/2$, $\\beta d = \\pi$ and $\\tan \\pi = 0$, so
every tangent term vanishes:

$$Z_{in}(\\lambda/2) = Z_{0}\\,\\frac{Z_{L} + 0}{Z_{0} + 0} = Z_{L}$$

Equivalently, $2\\beta d = 2\\pi$, a full rotation of $\\Gamma$, so nothing has
changed. Impedance repeats every half wavelength on a lossless line — which is
why an impedance measured through any multiple of $\\lambda/2$ of cable is the
load itself, and why a half-wave section is the standard way to move a
measurement plane without disturbing it.

**Quarter wave.** At $d = \\lambda/4$, $\\beta d = \\pi/2$ and the tangent
diverges, so divide numerator and denominator by it before taking the limit:

$$Z_{in} = Z_{0}\\,\\frac{Z_{L}/\\tan \\beta d + jZ_{0}}{Z_{0}/\\tan \\beta d + jZ_{L}} \\;\\longrightarrow\\; Z_{0}\\,\\frac{jZ_{0}}{jZ_{L}} = \\frac{Z_{0}^{2}}{Z_{L}}$$

$$Z_{in}(\\lambda/4) = \\frac{Z_{0}^{2}}{Z_{L}}$$

The rotation picture says the same thing: $2\\beta d = \\pi$, so
$\\Gamma \\to -\\Gamma$, and negating $\\Gamma$ in
$Z = Z_{0}(1+\\Gamma)/(1-\\Gamma)$ inverts the normalised impedance. **A
quarter wave is an impedance inverter**: it turns a short into an open, an
open into a short, a low resistance into a high one, and an inductance into a
capacitance.

![Resistance and reactance looking into a 50 ohm line terminated in 25 ohms, against length in wavelengths, with squares marking values obtained by numerically integrating the telegrapher equations at three lengths.](/courses/fe-ee/figures/em4-zin-locus.svg)

The squares in the figure come from the time-domain solver, not from the
formula above. At an eighth, a quarter and three eighths of a wavelength the
numerical input impedance agrees with the closed form to better than one part
in a thousand, which is as much as a discretised wave equation can be asked
for.

## 10.3 Stubs, and a bench measurement worth knowing

Two terminations make the transformation especially simple:

$$Z_{sc}(d) = jZ_{0}\\tan \\beta d, \\qquad Z_{oc}(d) = -jZ_{0}\\cot \\beta d$$

Both are **purely reactive**, which is the basis of stub matching: a length of
shorted or open line is an adjustable inductor or capacitor with no component
in it. A shorted stub shorter than $\\lambda/4$ looks inductive; an open stub
shorter than $\\lambda/4$ looks capacitive; each flips character every quarter
wavelength thereafter.

Multiplying the two removes the length entirely:

$$Z_{sc}Z_{oc} = \\left(jZ_{0}\\tan \\beta d\\right)\\left(-jZ_{0}\\cot \\beta d\\right) = Z_{0}^{2} \\quad\\Longrightarrow\\quad Z_{0} = \\sqrt{Z_{sc}Z_{oc}}$$

which is how the characteristic impedance of an unknown cable is measured:
short one end and read the input impedance, open it and read again, take the
geometric mean. It works at any length and needs no knowledge of the
dielectric.

### Worked example 11 — one load, six lengths of line

**Given**: $Z_{L} = 25\\ \\Omega$ on a 50 Ω lossless line. Tabulate
$Z_{in}$ against length.

At $d = 0.05\\lambda$, $\\beta d = 18.0^\\circ$ and $\\tan \\beta d = 0.32492$:

$$Z_{in} = 50\\,\\frac{25 + j50(0.32492)}{50 + j25(0.32492)} = 50\\,\\frac{25 + j16.246}{50 + j8.123} = 26.93 + j11.87\\ \\Omega$$

Repeating at the other lengths:

| $d$ | $\\tan \\beta d$ | $Z_{in}$ | $\\lvert Z_{in}\\rvert$ |
|---|---|---|---|
| 0 | 0 | 25.00 + j0 Ω | 25.00 Ω |
| $0.050\\lambda$ | 0.3249 | 26.93 + j11.87 Ω | 29.43 Ω |
| $0.125\\lambda$ | 1.0000 | 40.00 + j30.00 Ω | 50.00 Ω |
| $0.250\\lambda$ | ∞ | 100.00 + j0 Ω | 100.00 Ω |
| $0.375\\lambda$ | −1.0000 | 40.00 − j30.00 Ω | 50.00 Ω |
| $0.500\\lambda$ | 0 | 25.00 + j0 Ω | 25.00 Ω |

Three structural facts are visible in that table and none of them are
accidents. The quarter-wave row is $50^{2}/25 = 100\\ \\Omega$, purely real.
The half-wave row is the load again. And the $\\lambda/8$ and $3\\lambda/8$
rows are complex conjugates with $\\lvert Z_{in}\\rvert = 50\\ \\Omega$
exactly — they sit where the rotating $\\Gamma$ crosses the imaginary axis, so
their magnitude is $Z_{0}$ whatever the load is.

### Worked example 12 — a complex load through a length of line

**Given**: $Z_{L} = 30 + j40\\ \\Omega$ on a 50 Ω line, $d = 0.100\\lambda$.

Here $\\beta d = 36.0^\\circ$ and $\\tan \\beta d = 0.72654$. The rotation
route is quicker than the tangent form and less error-prone. From worked
example 7, $\\Gamma_{L} = 0.500\\angle 90^\\circ$. The rotation is
$2\\beta d = 72.0^\\circ$, so

$$\\Gamma (d) = 0.500\\angle (90^\\circ - 72.0^\\circ) = 0.500\\angle 18.0^\\circ$$

$$Z_{in} = 50\\,\\frac{1 + 0.500\\angle 18.0^\\circ}{1 - 0.500\\angle 18.0^\\circ} = 125.44 + j51.68\\ \\Omega$$

Two sanity checks. First, $\\lvert \\Gamma \\rvert$ is unchanged, so the VSWR
is still 3.00 wherever the meter is placed — **VSWR is a property of the
mismatch, not of where you stand**. Second, the input impedance has moved a
long way (from $\\lvert Z_{L}\\rvert = 50\\ \\Omega$ to
$\\lvert Z_{in}\\rvert = 135.7\\ \\Omega$) for a tenth of a wavelength of
cable. That sensitivity is why an impedance measured at the end of an
unspecified length of coax tells you almost nothing about the load.

### Worked example 13 — the characteristic impedance of an unknown cable

**Given**: a length of unknown cable measures $Z_{sc} = j40.0\\ \\Omega$ with
its far end shorted and $Z_{oc} = -j62.5\\ \\Omega$ with it open, at the same
frequency.

$$Z_{0} = \\sqrt{Z_{sc}Z_{oc}} = \\sqrt{(j40.0)(-j62.5)} = \\sqrt{2500} = 50.0\\ \\Omega$$

The electrical length falls out of the ratio:

$$\\tan^{2}\\beta d = \\frac{Z_{sc}}{Z_{oc}} \\cdot (-1) = \\frac{40.0}{62.5} = 0.640 \\quad\\Longrightarrow\\quad \\tan \\beta d = 0.800$$

so $\\beta d = 38.66^\\circ$, that is $d = 0.1074\\lambda$. Two reactance
readings have produced both the impedance and the length, with no knowledge of
the cable's construction — and the same pair of measurements on a lossy line,
using $\\tanh$ instead of $\\tan$, yields the complex $Z_{0}$ and $\\gamma$
together.`,
      examTip: 'Work impedance transformations through the rotating reflection coefficient rather than the tangent formula wherever you can: the magnitude never changes, only the angle, at 720 degrees per wavelength travelled. Then the quarter-wave inversion is a 180 degree rotation and the half-wave repeat is a full turn, and neither needs to be memorised as a separate rule.',
      importantNote: 'The quarter-wave and half-wave results hold only for a lossless line. With loss, tan becomes tanh of a complex argument, the reflection coefficient spirals inward instead of rotating on a circle, and a long enough line looks like Z0 no matter what is on the far end — which is why a badly matched but very long cable can measure as a good match.',
    },
    {
      id: 'emtx-qwt',
      title: '11. The Quarter-Wave Transformer, Designed and Swept',
      content: `## 11.1 The design equation, in one line

Put a section of line of impedance $Z_{1}$, one quarter wavelength long,
between a source system of $Z_{S}$ and a load $Z_{L}$. The section inverts, so

$$Z_{in} = \\frac{Z_{1}^{2}}{Z_{L}} \\stackrel{!}{=} Z_{S} \\quad\\Longrightarrow\\quad Z_{1} = \\sqrt{Z_{S}Z_{L}}$$

The geometric mean, not the arithmetic mean. Units check trivially:
$\\sqrt{\\Omega \\cdot \\Omega} = \\Omega$. Two restrictions come with it, and
both are examined: $Z_{L}$ must be **real** for a single section to work at
all (a complex load must first be rotated onto the real axis by a length of
line, or cancelled by a reactance), and the match is exact at **one
frequency**.

The physical length is where designs go wrong. It is a quarter of the
wavelength **inside the section**, not in free space:

$$\\ell = \\frac{\\lambda_{1}}{4} = \\frac{c}{4f_{0}\\sqrt{\\varepsilon_{r}}}$$

## 11.2 Bandwidth, by sweeping rather than asserting

Off the design frequency the section is no longer $90^\\circ$ long. Its
electrical length is proportional to frequency,

$$\\theta (f) = \\frac{\\pi}{2}\\cdot \\frac{f}{f_{0}}$$

so the input impedance and hence the reflection can be computed at any
frequency by putting $\\theta (f)$ back into the transformation:

$$\\Gamma_{in}(f) = \\frac{Z_{in}(f) - Z_{S}}{Z_{in}(f) + Z_{S}}, \\qquad Z_{in}(f) = Z_{1}\\,\\frac{Z_{L} + jZ_{1}\\tan \\theta (f)}{Z_{1} + jZ_{L}\\tan \\theta (f)}$$

![Input reflection magnitude against frequency for a single quarter-wave transformer matching 100 ohms to 50 ohms, showing the shaded band where the standing wave ratio stays below 1.25, the unmatched level for comparison, and the curve that results from cutting the section to a free-space quarter wavelength.](/courses/fe-ee/figures/em4-qwt-sweep.svg)

The band edges are found by solving
$\\lvert \\Gamma_{in}(f)\\rvert = 0.1111$ numerically, not by quoting a
bandwidth formula. For a 2:1 impedance ratio they come out at
$0.7952f_{0}$ and $1.2048f_{0}$, symmetric about $f_{0}$, a fractional
bandwidth of **40.97 per cent** at the 1.25 VSWR level. The symmetry is not a
coincidence: $\\tan \\theta$ at $\\pi/2 + x$ is the negative reciprocal of
$\\tan$ at $\\pi/2 - x$, which leaves $\\lvert \\Gamma \\rvert$ unchanged.

At $2f_{0}$ the section is a **half** wave, so it repeats the load and the
reflection returns to the unmatched value of $1/3$ — visible in the figure as
the point where the transformer curve touches the no-transformer line.

### Worked example 14 — a 1.000 GHz transformer, cut and swept

**Given**: match a 100 Ω antenna to a 50 Ω system at $f_{0} = 1.000$ GHz,
using line with a PTFE dielectric, $\\varepsilon_{r} = 2.10$.

**Step 1 — impedance.**

$$Z_{1} = \\sqrt{(50)(100)} = \\sqrt{5000} = 70.711\\ \\Omega$$

**Step 2 — wavelength in the section.**

$$\\lambda_{1} = \\frac{c}{f_{0}\\sqrt{\\varepsilon_{r}}} = \\frac{2.99792 \\times 10^{8}}{(1.000 \\times 10^{9})(1.44914)} = 0.206876\\ \\mathrm{m}$$

**Step 3 — physical length.**

$$\\ell = \\frac{\\lambda_{1}}{4} = 51.72\\ \\mathrm{mm}$$

**Step 4 — check the match.** At $f_{0}$, $\\tan \\theta$ diverges and
$Z_{in} = Z_{1}^{2}/Z_{L} = 5000/100 = 50.0\\ \\Omega$ exactly, so
$\\Gamma_{in} = 0$.

**Step 5 — sweep.** Recomputing across frequency:

| $f/f_{0}$ | $\\lvert \\Gamma_{in}\\rvert$ | VSWR |
|---|---|---|
| 0.500 | 0.2425 | 1.640 |
| 0.7952 | 0.1111 | 1.250 |
| 0.800 | 0.1086 | 1.244 |
| 1.000 | 0.0000 | 1.000 |
| 1.200 | 0.1086 | 1.244 |
| 1.2048 | 0.1111 | 1.250 |
| 2.000 | 0.3333 | 2.000 |

**Step 6 — the trap.** Suppose the section had been cut to a free-space
quarter wave instead:

$$\\ell_{wrong} = \\frac{c}{4f_{0}} = 74.95\\ \\mathrm{mm}$$

That is $\\sqrt{2.10} = 1.4491$ times too long, so at 1.000 GHz the section is
$0.3623\\lambda_{1}$, or $130.4^\\circ$, instead of $90^\\circ$. The
reflection is then $\\lvert \\Gamma_{in}\\rvert = 0.2235$, a VSWR of 1.576 —
**worse than half of the improvement thrown away**, and the actual match has
moved down to $f_{0}/\\sqrt{\\varepsilon_{r}} = 690$ MHz. A network that
measures beautifully at the wrong frequency is the signature of this error.

**Independent confirmation.** The whole structure — a 50 Ω feed, a 70.711 Ω
section 51.72 mm long, a 100 Ω load — was also built inside a time-domain
solver and driven at 0.80, 1.00 and 1.20 $f_{0}$, with the forward and
backward waves on the feed separated by a least-squares fit exactly as a
slotted line separates them. It returned $\\lvert \\Gamma \\rvert$ of 0.10855,
0.00013 and 0.10856 against the algebraic 0.10861, 0 and 0.10861. The match at
$f_{0}$ is not an artefact of the algebra.

## 11.3 When one section is not enough

A single section is a two-to-one impedance ratio's worth of bandwidth. Wider
matches cascade sections with intermediate impedances, each a quarter wave, so
that the small reflections from the several steps partly cancel. The design
rules for those (binomial for maximum flatness, Chebyshev for equal ripple)
are beyond the FE syllabus, but the reason they exist is not: **bandwidth is
bought with sections**, and the exam-level statement is that one quarter-wave
section gives a narrowband match whose bandwidth shrinks as the impedance
ratio grows.`,
      examTip: 'Three steps, in order: geometric mean for the impedance, wavelength inside the section for the length, and a check that the load is real. If the load is complex, either move along the line to a point where the impedance is real (a standing-wave maximum or minimum) and transform from there, or cancel the reactance first. Quoting the geometric mean for a complex load is a guaranteed wrong answer.',
      importantNote: 'The quarter wavelength is the one inside the matching section, shortened by the square root of its dielectric constant. Using the free-space wavelength makes the section too long by that factor and moves the match down in frequency by it — for PTFE that is a factor of 1.449, so a 1.000 GHz design ends up matching at 690 MHz.',
    },
    {
      id: 'emtx-smith',
      title: '12. The Smith Chart Is a Bilinear Map',
      content: `## 12.1 What the chart actually is

The Smith chart looks like a graphical trick and is nothing of the kind. It is
the image of the right half of the impedance plane under one complex function:

$$\\Gamma = \\frac{z - 1}{z + 1}, \\qquad z = \\frac{1 + \\Gamma}{1 - \\Gamma}, \\qquad z = \\frac{Z}{Z_{0}}$$

This is a **bilinear** (Möbius) map, and bilinear maps have one property that
makes the whole chart work: **they send circles and straight lines to circles
and straight lines**. The vertical lines of constant resistance and the
horizontal lines of constant reactance in the $z$ plane are therefore circles
in the $\\Gamma$ plane, and their equations can be written down:

$$\\left(\\Gamma_{r} - \\frac{r}{1+r}\\right)^{2} + \\Gamma_{i}^{2} = \\left(\\frac{1}{1+r}\\right)^{2}$$

$$\\left(\\Gamma_{r} - 1\\right)^{2} + \\left(\\Gamma_{i} - \\frac{1}{x}\\right)^{2} = \\left(\\frac{1}{x}\\right)^{2}$$

The constant-resistance circles all pass through $\\Gamma = +1$ and shrink
towards it as $r$ grows; the constant-reactance circles are all centred on the
vertical line through $\\Gamma = +1$ and are cut off by the unit circle. Every
passive load has $\\lvert \\Gamma \\rvert \\le 1$, so the entire infinite right
half plane of impedance is packed into a disc of radius one. That compression
is the chart's whole reason for existing.

Four landmarks fix the orientation and are worth deriving once each:

| Point | $z$ | $\\Gamma$ | Where |
|---|---|---|---|
| Matched | 1 | 0 | centre |
| Short | 0 | −1 | far left |
| Open | ∞ | +1 | far right |
| Pure reactance | $jx$ | $\\lvert \\Gamma \\rvert = 1$ | on the rim |

## 12.2 Why a line length is a rotation

Section 10 gave $\\Gamma (d) = \\Gamma_{L}e^{-2j\\beta d}$. On the chart that
is a rotation about the centre, clockwise as you move **towards the
generator**, through

$$\\Delta \\phi = -2\\beta d = -\\frac{4\\pi d}{\\lambda} \\qquad \\text{that is} \\qquad -720^\\circ \\frac{d}{\\lambda}$$

A half wavelength is one full turn, which is why the printed "wavelengths
toward generator" scale runs from 0 to 0.5 around the rim. The radius never
changes on a lossless line, so **the whole traverse is a rotation and nothing
else** — which is also why the chart carries VSWR on a radial scale: a circle
of constant radius is a circle of constant VSWR.

![A Smith chart drawn as the image of the impedance plane under the bilinear map, with constant-resistance and constant-reactance circles, and a worked traverse of 0.15 wavelengths towards the generator shown as an arc of constant radius.](/courses/fe-ee/figures/em4-smith-map.svg)

One more property earns the chart its place in matching work: because
$y = 1/z$ corresponds to $\\Gamma \\to -\\Gamma$, **converting impedance to
admittance is a 180° rotation** — a quarter-wave move. The same printed chart
therefore serves as an admittance chart, which is what makes shunt-stub design
graphical.

### Worked example 15 — one traverse, read and checked

**Given**: $Z_{L} = 20 + j40\\ \\Omega$ on a 50 Ω line. Find the impedance
$0.150\\lambda$ towards the generator.

**Step 1 — normalise.** $z_{L} = (20 + j40)/50 = 0.400 + j0.800$.

**Step 2 — map to $\\Gamma$.**

$$\\Gamma_{L} = \\frac{z_{L}-1}{z_{L}+1} = \\frac{-0.600 + j0.800}{1.400 + j0.800}$$

The numerator has magnitude $\\sqrt{0.36 + 0.64} = 1.0000$ and angle
$126.870^\\circ$; the denominator has magnitude
$\\sqrt{1.96 + 0.64} = 1.61245$ and angle $29.745^\\circ$. So

$$\\lvert \\Gamma_{L}\\rvert = 1.0000/1.61245 = 0.62017, \\qquad \\angle \\Gamma_{L} = 126.870^\\circ - 29.745^\\circ = 97.125^\\circ$$

**Step 3 — read the rim.** The wavelengths-toward-generator scale reads
$(180^\\circ - 97.125^\\circ)/720^\\circ$, which is $0.1151\\lambda$. Adding
the traverse gives $0.1151 + 0.150 = 0.2651\\lambda$.

**Step 4 — rotate.** The new angle is
$180^\\circ - 720^\\circ (0.2651) = -10.875^\\circ$, consistent with rotating
the original angle clockwise by $720 \\times 0.150 = 108.0$ degrees.

$$\\Gamma_{in} = 0.62017\\angle -10.875^\\circ = 0.60904 - j0.11701$$

**Step 5 — map back.**

$$z_{in} = \\frac{1 + \\Gamma_{in}}{1 - \\Gamma_{in}} = \\frac{1.60904 - j0.11701}{0.39096 + j0.11701} = 3.6950 - j1.4051$$

$$Z_{in} = 50\\,z_{in} = 184.75 - j70.26\\ \\Omega$$

**Checks.** The magnitude of $\\Gamma$ is unchanged, so the VSWR is 4.2656 at
both ends, and $\\lvert z_{in}\\rvert = 3.9532$ is comfortably inside the VSWR
circle radius of 4.2656 — a point can never leave it. Feeding
$Z_{L} = 20 + j40$ and $d = 0.150\\lambda$ into the tangent transformation of
section 10 returns $3.695045 - j1.405114$ normalised, agreeing with the
rotation route to twelve significant figures. **The chart is not an
approximation to the algebra; it is a picture of it.**

## 12.3 What the chart is still for

Vector network analysers compute all of this instantly, and the chart survives
anyway, for three reasons an exam will test. It shows at a glance whether a
load is inductive (upper half) or capacitive (lower half); it makes the effect
of *adding* a series reactance or a shunt susceptance a slide along a printed
circle rather than a calculation; and it turns matching from algebra into the
geometric question of how to get from one point to the centre. Those are
reasoning tools, and they do not become obsolete because the arithmetic did.`,
      examTip: 'Three facts carry most Smith chart questions: the centre is a perfect match, the radius is fixed on a lossless line so a length of line is a pure rotation, and a full turn is half a wavelength. Convert between impedance and admittance by rotating 180 degrees. The upper half is inductive and the lower half capacitive.',
      importantNote: 'Rotating toward the generator is clockwise, and 720 degrees per wavelength, not 360. The factor of two is the same one that puts standing-wave minima half a wavelength apart, and getting it wrong sends every stub design to a point a quarter wavelength away from the right answer.',
    },
    {
      id: 'emtx-stub',
      title: '13. Stub Matching',
      content: `## 13.1 The idea

A quarter-wave transformer needs a real load and a section of a special
impedance. Stub matching needs neither: it uses only lengths of the **same**
line already in use, which is why it dominates in printed circuits, where a
stub is a piece of copper and an extra impedance is an extra process step.

The method uses shunt elements, so work in **admittance**. Two steps:

1. Move a distance $d$ from the load until the normalised admittance has
   **unit conductance**, $y(d) = 1 + jb$. Such a point always exists, because
   the rotating $\\Gamma$ must cross the $g = 1$ circle.
2. Put a shunt stub there whose susceptance is $-jb$. Total: $y = 1$, that is
   $Z_{in} = Z_{0}$, a perfect match.

The stub is a length of shorted or open line, so it supplies pure susceptance:

$$y_{sc} = -j\\cot \\beta \\ell_{s}, \\qquad y_{oc} = +j\\tan \\beta \\ell_{s}$$

and the length needed for a required susceptance $-b$ follows by inversion:

$$\\ell_{s} = \\frac{\\lambda}{2\\pi}\\operatorname{arccot}(b) \\quad \\text{(shorted)}, \\qquad \\ell_{s} = \\frac{\\lambda}{2\\pi}\\arctan (-b) \\quad \\text{(open)}$$

Shorted stubs are preferred in coax and waveguide, where a short is a reliable
cap and an open radiates; open stubs are preferred on PCBs, where etching a
stub is free and a via to ground is not.

## 13.2 Finding the distance

Writing $y(d) = 1/z(d)$ with the transformation of section 10 and setting the
real part to one gives a transcendental equation in $\\tan \\beta d$. It is
solvable in closed form but the algebra is unpleasant and error-prone; on the
chart it is simply "rotate until you hit the $g = 1$ circle", and numerically
it is a two-line root find. **There are always two solutions per half
wavelength**, because the rotating point crosses the unit-conductance circle
twice, and they give equal and opposite susceptances.

![Two panels: normalised conductance and susceptance against distance from a load of 100 plus j50 ohms, showing the two crossings of unit conductance, and the resulting matched network reflection against frequency.](/courses/fe-ee/figures/em4-stub-match.svg)

### Worked example 16 — a single shunt stub, both solutions

**Given**: $Z_{L} = 100 + j50\\ \\Omega$ on a 50 Ω line; design a
short-circuited shunt stub match.

**Step 1 — normalise and invert.** $z_{L} = 2.00 + j1.00$, so

$$y_{L} = \\frac{1}{2.00 + j1.00} = \\frac{2.00 - j1.00}{5.00} = 0.400 - j0.200$$

**Step 2 — walk to unit conductance.** Sweeping $d$ and solving
$\\mathrm{Re}\\left[y(d)\\right] = 1$ gives two roots in the first half
wavelength:

| Solution | $d$ | $y(d)$ | Stub must add | Shorted stub $\\ell_{s}$ |
|---|---|---|---|---|
| A | $0.19879\\lambda$ | $1 + j1$ | $-j1$ | $0.12500\\lambda$ |
| B | $0.37500\\lambda$ | $1 - j1$ | $+j1$ | $0.37500\\lambda$ |

**Step 3 — the stub.** For solution A the stub must present $-j1.000$. A
shorted stub has $y_{sc} = -j\\cot \\beta \\ell_{s}$, so
$\\cot \\beta \\ell_{s} = 1$, giving $\\beta \\ell_{s} = 45^\\circ$ and

$$\\ell_{s} = \\frac{45^\\circ}{360^\\circ}\\lambda = 0.12500\\lambda$$

**Step 4 — verify.** At the stub plane,

$$y_{total} = (1 + j1) + (-j1) = 1 + j0 \\quad\\Longrightarrow\\quad Z_{in} = \\frac{50}{1} = 50.0\\ \\Omega$$

The residual reflection computes to $1.6 \\times 10^{-16}$, which is machine
zero: the match is exact, not approximate. Solution B works equally well and
needs $0.37500\\lambda$ of stub — three times as much copper for the same
result, so A is the one to build. If an **open** stub is wanted instead,
solution A needs $\\tan \\beta \\ell_{s} = -1$, that is
$\\ell_{s} = 0.37500\\lambda$; the shorted and open stubs differ by exactly a
quarter wavelength, as they must.

**Step 5 — bandwidth.** Both $d$ and $\\ell_{s}$ are electrical lengths, so
both drift with frequency, and the match degrades on either side. Sweeping the
finished network (holding the load impedance fixed) gives VSWR below 1.25 over
**11.9 per cent** of bandwidth, against the unmatched
$\\lvert \\Gamma \\rvert = 0.4472$, a VSWR of 2.618. A stub match is narrower
than the quarter-wave transformer of section 11 because two lengths are
drifting instead of one.

## 13.3 Practical notes the exam likes

- The stub is in **shunt**, so susceptances add. A series stub would need
  reactances to add and is far harder to build in most media.
- A stub is a length of line, not a lumped element: its susceptance is
  $\\cot$ or $\\tan$, not $1/\\omega L$ or $\\omega C$, and it repeats every
  half wavelength.
- **Double-stub tuners** use two fixed-position stubs and adjust only their
  lengths, which is what makes a bench tuner practical; the price is a
  forbidden region of loads that cannot be matched at all.
- Everything here assumed a lossless line and a frequency-independent load.
  Real antennas move with frequency, and the measured bandwidth of a stub
  match is usually narrower than this calculation suggests.`,
      examTip: 'Stub problems are admittance problems. Normalise, invert to admittance, rotate until the conductance is 1, then cancel whatever susceptance is left with a stub. Remember that a shorted stub gives minus j cot and an open stub plus j tan, and that the two differ by a quarter wavelength for the same job.',
      importantNote: 'There are always two stub positions within half a wavelength, giving equal and opposite susceptances and therefore two different stub lengths. Both match exactly at the design frequency; the shorter total length is usually the better build, and neither is more correct than the other.',
    },
    {
      id: 'emtx-tdr',
      title: '14. Time-Domain Reflectometry and Bounce Diagrams',
      content: `## 14.1 Radar down a cable

A time-domain reflectometer launches a fast step into a line and watches the
same point. Anything that is not $Z_{0}$ sends part of the step back, and the
**round-trip time** locates it while the **step size** identifies it:

$$d = \\frac{v_{p}t_{rt}}{2} = \\frac{k_{v}\\,c\\,t_{rt}}{2}, \\qquad \\Gamma = \\frac{\\Delta V}{V_{inc}}, \\qquad Z = Z_{0}\\,\\frac{1 + \\Gamma}{1 - \\Gamma}$$

The factor of two is the round trip, and it is the single most common source
of a doubled or halved answer. The velocity factor $k_{v}$ must be the
cable's own; using 1.0 by mistake overstates every distance by about half
again for common polyethylene cable.

| What the trace does | $\\Gamma$ | Diagnosis |
|---|---|---|
| Rises to the full open-circuit source voltage | $+1$ | open circuit, broken conductor |
| Falls to zero | $-1$ | short circuit |
| Steps part way up | $0 < \\Gamma < 1$ | series resistance, or a higher-impedance section |
| Steps part way down | $-1 < \\Gamma < 0$ | shunt loading, water, a crushed or pinched cable |
| Stays flat | $0$ | correctly terminated, or no discontinuity yet |

## 14.2 The bounce diagram

For a line between a resistive source and a resistive load, everything follows
from three numbers and a ledger:

$$\\Gamma_{S} = \\frac{R_{S}-Z_{0}}{R_{S}+Z_{0}}, \\qquad \\Gamma_{L} = \\frac{R_{L}-Z_{0}}{R_{L}+Z_{0}}, \\qquad V_{1} = V_{S}\\,\\frac{Z_{0}}{R_{S}+Z_{0}}$$

$V_{1}$ is the **launched step**: at the instant the source is applied, the
line looks like a resistor of $Z_{0}$ ohms, so the source and the line form an
ordinary divider. It is the only place lumped circuit thinking is allowed, and
it works because the line has not yet had time to know what is on the far end.
Thereafter each wave that arrives at an end is reflected by that end's
coefficient, and at any observation point the visible voltage is the running
sum of everything that has passed.

For a mismatch **inside** the line, the same ledger runs with a transmission
coefficient as well:

$$\\tau = 1 + \\Gamma$$

which is not a typo and not a violation of energy conservation: the
transmitted *voltage* can exceed the incident voltage when the impedance rises,
because the transmitted *current* falls by more.

![A time-domain reflectometry trace at the instrument, computed both from a bounce-diagram ledger and by integrating the telegrapher equations, showing a step down at 148 nanoseconds where the cable impedance falls, and the staircase up to the full source voltage from the open far end.](/courses/fe-ee/figures/em4-tdr-trace.svg)

### Worked example 17 — locating and identifying a fault

**Given**: a TDR with a 50 Ω head launches a 1.000 V open-circuit step into a
50 Ω cable of velocity factor 0.66. The trace shows 0.500 V immediately, a
**drop to 0.400 V at 148 ns**, then a rise to 0.880 V at 198 ns, 0.976 V at
248 ns, and so on towards 1.000 V.

**Step 1 — the launched step.** With $R_{S} = Z_{0} = 50\\ \\Omega$,

$$V_{1} = 1.000 \\times \\frac{50}{50 + 50} = 0.500\\ \\mathrm{V}$$

so the instrument's own 0.500 V plateau is the incident wave, and a matched
source means nothing re-reflects at the head — every step in the trace is one
more round trip further into the cable.

**Step 2 — locate.** The first discontinuity returns at 148 ns:

$$v_{p} = 0.66\\,c = 1.9786 \\times 10^{8}\\ \\mathrm{m/s}, \\qquad d = \\frac{(1.9786 \\times 10^{8})(148 \\times 10^{-9})}{2} = 14.64\\ \\mathrm{m}$$

**Step 3 — identify.** The step is $0.400 - 0.500 = -0.100$ V against an
incident 0.500 V, so

$$\\Gamma_{1} = \\frac{-0.100}{0.500} = -0.200 \\quad\\Longrightarrow\\quad Z = 50\\,\\frac{1 - 0.200}{1 + 0.200} = 33.3\\ \\Omega$$

A **negative** step of that size means the impedance has fallen to a third of
the way down, which is the signature of a crushed cable or water ingress, not
of a break.

**Step 4 — what lies beyond.** The transmission coefficient into the damaged
section is $\\tau_{1} = 1 + \\Gamma_{1} = 0.800$, so a 0.400 V wave continues.
It returns at 198 ns, 50 ns later, so the far end is
$(1.9786 \\times 10^{8})(50 \\times 10^{-9})/2 = 4.95$ m beyond the fault, at
19.59 m of cable in total. It comes back with the full $+1$ of an open circuit
and crosses the junction outward with
$\\tau_{2} = 1 + \\Gamma_{2} = 1.200$, giving $0.400 \\times 1.200 = 0.480$ V
and a trace level of $0.500 - 0.100 + 0.480 = 0.880$ V. Each further round
trip inside the damaged section contributes $\\Gamma_{2} = +0.200$ times the
last, so the levels are 0.976, 0.9952, 0.99904 V.

**Step 5 — the self-check.** The trapped wave is a geometric series, and it
must sum to the DC answer, because the far end is open and no current can
flow in the steady state:

$$V_{\\infty} = V_{1}(1 + \\Gamma_{1})\\left[1 + \\frac{1 + \\Gamma_{2}}{1 - \\Gamma_{2}}\\right] = 0.500 \\times 0.800 \\times 2.500 = 1.000\\ \\mathrm{V}$$

which is the full open-circuit source voltage, as it must be. **If the ledger
does not converge to the DC answer, the ledger is wrong** — and that check
costs nothing.

**Independent confirmation.** The identical two-segment cable was integrated in
the time domain from the telegrapher's equations, with no reflection or
transmission coefficient anywhere in the solver. Its trace reads 0.50000,
0.40006, 0.88029, 0.97617, 0.99522 and 0.99899 V at the six plateaux, against
the ledger's 0.500, 0.400, 0.880, 0.976, 0.9952 and 0.99904.

### Worked example 18 — three ways to terminate the same line

**Given**: the 1.5 m, 50 Ω line of section 4, one-way delay 7.51 ns, driven
from a 5.0 V source, with a high-impedance CMOS receiver at the far end.
Compare three treatments.

**(a) Unterminated, 25 Ω source.** From section 4:
$V_{1} = 5.0 \\times 50/75 = 3.33$ V, $\\Gamma_{L} = +1$,
$\\Gamma_{S} = -0.333$. The receiver sees 6.67 V — **33 per cent above the
rail** — then 4.44, 5.19, 4.94 V, settling only after four round trips, about
60 ns.

**(b) Series-terminated: raise the source resistance to $Z_{0}$.** Now
$\\Gamma_{S} = 0$:

$$V_{1} = 5.0 \\times \\frac{50}{50 + 50} = 2.50\\ \\mathrm{V}$$

Half the supply travels down the line; the open end doubles it to 5.00 V; the
returning wave reaches the source and is absorbed. **Settled in one round
trip, 15.0 ns, with no overshoot and no DC current at all.** The catch is
visible in the arithmetic: for 7.51 ns the line carries only 2.50 V, so a
second receiver tapped part way along would see a half-amplitude plateau and
could latch a wrong level. Series termination serves point-to-point links, not
multi-drop buses.

**(c) Parallel-terminated: put $Z_{0}$ across the far end.** Now
$\\Gamma_{L} = 0$, so the launched step arrives and stays; the waveform is
clean everywhere along the line, at every moment, which is what a multi-drop
bus needs. The price is DC:

$$V_{\\infty} = 5.0 \\times \\frac{50}{25 + 50} = 3.33\\ \\mathrm{V}, \\qquad I = \\frac{3.33}{50} = 66.7\\ \\mathrm{mA}$$

$$P_{term} = \\frac{(3.33)^{2}}{50} = 0.222\\ \\mathrm{W}, \\qquad P_{supply} = 5.0 \\times 0.0667 = 0.333\\ \\mathrm{W}$$

so the logic high has fallen to 3.33 V and a third of a watt burns
continuously in one net. That trade — clean everywhere and expensive, against
clean only at the end and free — is the whole of practical termination
choice.

| Scheme | Overshoot | Settling | Static power | Good for |
|---|---|---|---|---|
| None | +33% | 4 round trips | 0 | short runs only |
| Series at source | 0% | 1 round trip | 0 | point to point |
| Parallel at load | 0% | 1 one-way delay | 0.222 W | multi-drop |

## 14.3 The same physics in two domains

Nothing in section 14 is new physics. A TDR step is a superposition of
frequencies; the ringing of an unterminated line is the time-domain face of
the standing wave of section 9; a bounce diagram is the geometric series that
the frequency-domain input impedance sums in closed form. Which domain to use
is a question of which one makes the answer visible: a fault at 14.64 m is
obvious in time and nearly unreadable in frequency, while a 41 per cent
matching bandwidth is obvious in frequency and nearly unreadable in time.`,
      examTip: 'TDR questions almost always reduce to two steps: divide the round-trip time by two before multiplying by the velocity, and turn the step ratio into an impedance with Z0(1+Gamma)/(1-Gamma). A step that rises means the impedance went up; a step that falls means it went down; full rise means open and full fall means short.',
      importantNote: 'The launched step is set by the source resistance against Z0, never against the load, because the line cannot know what terminates it until a round trip has elapsed. Every bounce ledger must converge to the ordinary DC divider answer once the reflections die out; if it does not, a reflection coefficient has the wrong sign.',
    },
    {
      id: 'emtx-problems-a',
      title: '15. Problem Set A: Lines, Impedance and Mismatch',
      content: `Work each one before reading the answer. Values are given to the
precision they should be worked at, and every answer below was computed from
the equations of sections 5 to 9.

## Problem Set A

**A1.** A 75 Ω coaxial cable has a velocity factor of 0.820 and carries a
200 MHz signal. Find the wavelength on the line and the delay per metre, then
decide whether a 4.00 cm pigtail may be treated as a lumped element, and
estimate the error if it is.

**A2.** A line is measured to have $L' = 320$ nH/m and $C' = 128$ pF/m. Find
$Z_{0}$, $v_{p}$, the delay per metre, and the effective dielectric constant.

**A3.** On a 50 Ω system the load is $Z_{L} = 20 - j35\\ \\Omega$. Find
$\\Gamma$ in polar form, the VSWR, the return loss, the fraction of power
reflected, and the mismatch loss.

**A4.** An antenna analyser reads VSWR = 1.80 on a 50 Ω system. Find
$\\lvert \\Gamma \\rvert$, the return loss, the reflected power fraction, the
mismatch loss, and the two purely resistive loads consistent with the reading.

**A5.** On a 50 Ω slotted line the VSWR is 2.00, adjacent minima are 20.0 cm
apart, and the first minimum is 4.00 cm from the load. Find the wavelength,
$\\Gamma$ and $Z_{L}$.

**A6.** A 25 m cable with an attenuation of 0.0500 dB/m at 500 MHz feeds a
load whose true reflection magnitude is 0.400. What return loss does an
instrument at the input end measure, and what apparent
$\\lvert \\Gamma \\rvert$ does that correspond to?

### Answers, Problem Set A

**A1.** $v_{p} = 0.820c = 2.4583 \\times 10^{8}$ m/s;
$\\lambda = v_{p}/f = 1.2291$ m; delay $= 1/v_{p} = 4.068$ ns/m. The pigtail is
$0.04/1.2292 = 0.03254$ wavelengths, that is $11.72^\\circ$ — below the
$\\lambda/20$ line, so lumped treatment is acceptable. The error estimate
$\\theta^{2}/3$ with $\\theta = 0.20447$ rad gives 1.39 per cent, and the exact
value is 1.40 per cent.

**A2.** The ratio of the two per-unit-length values is
$320 \\times 10^{-9}/128 \\times 10^{-12} = 2500$, so $Z_{0} = 50.0\\ \\Omega$;
$v_{p} = 1/\\sqrt{L'C'} = 1.5625 \\times 10^{8}$ m/s; delay
$= \\sqrt{L'C'} = 6.40$ ns/m; and
$\\varepsilon_{eff} = (c/v_{p})^{2} = 3.681$. Note the delay is the reciprocal
of the velocity and comes out in seconds per metre, not the other way round.

**A3.** $\\Gamma = (-30 - j35)/(70 - j35) = -0.1429 - j0.5714$, which is
$0.5890\\angle -104.04^\\circ$. VSWR $= 1.5890/0.4110 = 3.866$;
$RL = -20\\log_{10}(0.5890) = 4.597$ dB; reflected power
$= \\lvert \\Gamma \\rvert^{2} = 34.69$ per cent; mismatch loss
$= -10\\log_{10}(0.65306) = 1.850$ dB.

**A4.** $\\lvert \\Gamma \\rvert = 0.80/2.80 = 0.28571$;
$RL = 10.881$ dB; reflected power 8.163 per cent; mismatch loss 0.370 dB. The
resistive candidates are $50 \\times 1.80 = 90.0\\ \\Omega$ and
$50/1.80 = 27.8\\ \\Omega$, and the VSWR reading cannot distinguish them.

**A5.** Minima are half a wavelength apart, so $\\lambda = 40.0$ cm.
$\\lvert \\Gamma \\rvert = (2.00-1)/(2.00+1) = 0.3333$. The first minimum at
$0.100\\lambda$ gives
$\\theta_{\\Gamma} = 4\\pi (0.100) - \\pi = -0.600\\pi$, that is
$-108.0^\\circ$, so $\\Gamma = -0.1030 - j0.3170$ and

$$Z_{L} = 50\\,\\frac{1 + \\Gamma}{1 - \\Gamma} = 33.74 - j24.07\\ \\Omega$$

Substituting that load back into $\\Gamma = (Z_{L}-Z_{0})/(Z_{L}+Z_{0})$
returns $0.3333\\angle -108.0^\\circ$, closing the loop.

**A6.** The wave is attenuated once outbound and once returning, so the
measured magnitude is the true one reduced by the **round-trip** loss of
$2 \\times 1.25 = 2.50$ dB:

$$\\lvert \\Gamma \\rvert_{meas} = 0.400 \\times 10^{-2.50/20} = 0.3000$$

$$RL_{meas} = -20\\log_{10}(0.3000) = 10.46\\ \\mathrm{dB}$$

against a true 7.96 dB. **Cable loss always flatters a match**, and a
sufficiently long cable measures as a perfect load whatever is on the end of
it. This is the practical reason return-loss measurements are made at the
device, not at the far end of a long feed.`,
      examTip: 'Two habits catch most errors in this material. Convert a mismatch into every unit as soon as you have it, so a later part of the question is a lookup rather than a rework. And always substitute a recovered impedance back into the reflection formula: it costs a line of algebra and catches sign errors in the phase, which are the errors that survive undetected.',
      importantNote: 'A return-loss or VSWR measurement made through a lossy cable reports a better match than the load has, by twice the one-way cable loss in decibels. Any measured return loss must state the plane it refers to.',
    },
    {
      id: 'emtx-problems-b',
      title: '16. Problem Set B: Transformation, Matching and Time Domain',
      content: `## Problem Set B

**B1.** A 50 Ω lossless line is terminated in 200 Ω. Find $Z_{in}$ at
$0.125\\lambda$, $0.250\\lambda$ and $0.375\\lambda$ from the load, and say
what relates the first and third answers.

**B2.** Design a quarter-wave transformer to match a 300 Ω folded dipole to a
75 Ω feed at 600 MHz, in a medium with $\\varepsilon_{r} = 2.30$. Give the
section impedance and its physical length, and state what length would result
from the free-space wavelength error.

**B3.** For the transformer of B2, find $\\lvert \\Gamma_{in}\\rvert$ and the
VSWR at $0.80f_{0}$, and compare its fractional bandwidth at VSWR 1.25 with
the 40.97 per cent of the two-to-one transformer in section 11.

**B4.** A normalised load $z = 2.00 - j1.00$ sits on a 50 Ω line. Find
$\\Gamma$, the VSWR, and the impedance $0.200\\lambda$ towards the generator,
using the rotation method.

**B5.** Design a short-circuited shunt stub match for
$Z_{L} = 25 - j50\\ \\Omega$ on a 50 Ω line: give the stub distance from the
load and the stub length, both in wavelengths.

**B6.** A TDR with a 75 Ω head examines a 75 Ω cable of velocity factor 0.850.
A reflection arrives at 260 ns with an amplitude one third of the incident
step and the **same** polarity. Locate the discontinuity and identify it.

### Answers, Problem Set B

**B1.** With $\\tan \\beta d = 1$ at $0.125\\lambda$:

$$Z_{in} = 50\\,\\frac{200 + j50}{50 + j200} = 23.53 - j44.12\\ \\Omega$$

At $0.250\\lambda$ the inverter gives $Z_{0}^{2}/Z_{L} = 2500/200 = 12.50$ ohms,
purely real. At $0.375\\lambda$, $\\tan \\beta d = -1$ and the answer
is $23.53 + j44.12\\ \\Omega$ — the **complex conjugate** of the first, because
those two points are mirror images about the real axis on the constant-VSWR
circle. Both have magnitude 50.0 Ω, which is $Z_{0}$, for the same reason as
in worked example 11.

**B2.** $Z_{1} = \\sqrt{(300)(75)} = \\sqrt{22500} = 150.0\\ \\Omega$. The
wavelength in the section is
$\\lambda_{1} = c/(f_{0}\\sqrt{\\varepsilon_{r}}) = 0.32946$ m, so
$\\ell = 82.37$ mm. Using the free-space wavelength would give 124.91 mm,
longer by $\\sqrt{2.30} = 1.5166$, and would move the match down to
$600/1.5166 = 396$ MHz.

**B3.** At $0.80f_{0}$, $\\theta = 72.0^\\circ$ and $\\tan \\theta = 3.0777$:

$$Z_{in} = 150\\,\\frac{300 + j150(3.0777)}{150 + j300(3.0777)} = 80.79 - j35.61\\ \\Omega$$

$$\\Gamma_{in} = \\frac{Z_{in}-75}{Z_{in}+75} \\quad\\Longrightarrow\\quad \\lvert \\Gamma_{in}\\rvert = 0.2258, \\quad \\mathrm{VSWR} = 1.583$$

The VSWR 1.25 band runs from $0.9047f_{0}$ to $1.0953f_{0}$, a fractional
bandwidth of **19.05 per cent** — less than half the 40.97 per cent of the
two-to-one case. **Bandwidth falls as the impedance ratio rises**, which is the
argument for multi-section transformers.

**B4.** $\\Gamma = (z-1)/(z+1) = (1.00 - j1.00)/(3.00 - j1.00)$, which is
$0.400 - j0.200$, so $\\lvert \\Gamma \\rvert = 0.4472$ at
$-26.565^\\circ$ and VSWR $= 2.618$. Moving $0.200\\lambda$ towards the
generator rotates by $720 \\times 0.200 = 144.0$ degrees clockwise, to
$-170.565^\\circ$:

$$\\Gamma_{in} = 0.4472\\angle -170.565^\\circ = -0.4412 - j0.0733$$

$$z_{in} = \\frac{1+\\Gamma_{in}}{1-\\Gamma_{in}} = 0.3842 - j0.0704 \\quad\\Longrightarrow\\quad Z_{in} = 19.21 - j3.52\\ \\Omega$$

An inductive load has become slightly capacitive and much lower in resistance;
only the angle changed.

**B5.** Normalising, $z_{L} = 0.500 - j1.000$ and
$y_{L} = 0.400 + j0.800$. Sweeping for unit conductance, the first solution is
$d = 0.06313\\lambda$, where $y = 1 + j1.5811$. The stub must supply
$-j1.5811$, so a shorted stub needs $\\cot \\beta \\ell_{s} = 1.5811$, giving
$\\beta \\ell_{s} = 32.31^\\circ$ and $\\ell_{s} = 0.08975\\lambda$.
Substituting back gives a total normalised admittance of $1.000 + j0.000$ and
an input impedance of exactly 50.0 Ω. The unmatched load had
$\\lvert \\Gamma \\rvert = 0.6202$ and a VSWR of 4.266.

**B6.** $v_{p} = 0.850c = 2.5482 \\times 10^{8}$ m/s, so

$$d = \\frac{(2.5482 \\times 10^{8})(260 \\times 10^{-9})}{2} = 33.13\\ \\mathrm{m}$$

A positive reflection of one third means

$$Z = 75\\,\\frac{1 + 0.3333}{1 - 0.3333} = 150\\ \\Omega$$

so the cable has been spliced to a section of twice its impedance — or, in a
harness, a connector has an open shield and the effective impedance has
doubled. **The polarity carries the diagnosis**: the same magnitude with the
opposite sign would have meant 37.5 Ω and a crushed or shunt-loaded cable
instead.`,
      examTip: 'Every problem in this set is one of four moves: rotate the reflection coefficient, invert with a quarter wave, cancel a susceptance with a stub, or divide a round-trip time by two. Identify which move the question wants before touching a calculator, and the arithmetic is short in every case.',
      importantNote: 'Both matching networks in this set are exact at one frequency and degrade either side of it, and the wider the impedance ratio the narrower the band. Any claim that a network is matched must state the frequency, and any measured bandwidth must state the criterion — 1.25 VSWR here, but 1.5 and 2.0 are equally common and give very different numbers.',
    },
  ],
  keyTakeaways: [
    'Characteristic impedance: Z₀ = √(L/C); typical values 50 Ω (RF), 75 Ω (video).',
    'Reflection coefficient: Γ = (Z_L − Z₀)/(Z_L + Z₀); matched load gives Γ = 0.',
    'VSWR = (1 + |Γ|)/(1 − |Γ|); VSWR = 1 is perfect match.',
    'Quarter-wave transformer: Z₀(match) = √(Z_S·Z_L); inverts impedance.',
    'Standing waves: V_max = V_inc(1 + |Γ|), V_min = V_inc(1 − |Γ|).',
    'Reflected power fraction = |Γ|²; transmitted = 1 − |Γ|².',
    'Electrical length decides everything: under ~λ/20 a lumped model is ~3% wrong; the error is θ²/3 and depends on nothing else.',
    'The telegrapher equations come from one slice: ∂v/∂z = −R′i − L′ ∂i/∂t and ∂i/∂z = −G′v − C′ ∂v/∂t.',
    'A per-unit-length L or C is not an impedance — only the ratio √(L′/C′) has ohms.',
    'Moving along a lossless line rotates Γ at 720° per wavelength and never changes |Γ|; the Smith chart is that rotation drawn.',
    'Low loss: α ≈ R′/2Z₀ + G′Z₀/2 (conductor + dielectric), β ≈ ω√(L′C′).',
    'Z₀ = √(Z_sc · Z_oc): shorting and opening the far end measures an unknown cable.',
    'Stub matching: rotate to y = 1 + jb, then cancel jb with a shorted (−j cot βℓ) or open (+j tan βℓ) stub.',
    'TDR: distance = v_p·t/2 (halve the round trip), and Z = Z₀(1 + Γ)/(1 − Γ) from the step height.',
  ],
},

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 12 — CONTROL SYSTEMS  (6 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

};

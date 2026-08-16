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
| Series | $1/C_{eq} = \\Sigma (1/C_i)$ | same charge Q | smaller C takes the larger voltage |
| Parallel | $C_{eq} = \\Sigma C_i$ | same voltage V | larger C takes the larger charge |

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

**$v = 1/\\sqrt{\\mu _{0}\\varepsilon _{0}} = c \\approx 3 \\times 10^{8} m/s$**

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

| Material | $\\sigma (S/m)$ | $\\delta at 60\\ \\mathrm{Hz}$ | $\\delta at 1\\ \\mathrm{GHz}$ |
|---|---|---|---|
| Copper | $5.8 \\times 10^{7}$ | 8.5 mm | $2.1 \\mu m$ |
| Aluminum | $3.5 \\times 10^{7}$ | 11 mm | $2.7 \\mu m$ |
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
| Microstrip (PCB) | 50–100 Ω (set by geometry) | on-board RF and digital routing |
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
  ],
  keyTakeaways: [
    'Characteristic impedance: Z₀ = √(L/C); typical values 50 Ω (RF), 75 Ω (video).',
    'Reflection coefficient: Γ = (Z_L − Z₀)/(Z_L + Z₀); matched load gives Γ = 0.',
    'VSWR = (1 + |Γ|)/(1 − |Γ|); VSWR = 1 is perfect match.',
    'Quarter-wave transformer: Z₀(match) = √(Z_S·Z_L); inverts impedance.',
    'Standing waves: V_max = V_inc(1 + |Γ|), V_min = V_inc(1 − |Γ|).',
    'Reflected power fraction = |Γ|²; transmitted = 1 − |Γ|².',
  ],
},

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 12 — CONTROL SYSTEMS  (6 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

};

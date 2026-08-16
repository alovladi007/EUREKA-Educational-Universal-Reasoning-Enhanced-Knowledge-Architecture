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
insulator is $1.5 \\times 179.8 = 269.6$ V against 179.8 V for the conductor.

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
| Ohm's law: V = IR | **$\\Phi = MMF/ℜ = NI\\cdot \\mu A/\\ell$** |

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

$$\\Phi = NI/(\\mathfrak{R}_{core} + \\mathfrak{R}_{gap}) = 600/(2.28 \\times 10^{6}) = 262\\ \\mu \\mathrm{Wb}$$

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
0.250 µH/m, a number that returns in the transmission-line topic as one half
of the characteristic impedance.

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

In most practical cables with dielectric filling: **$v_p \\approx 0.66c to 0.85c$**

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

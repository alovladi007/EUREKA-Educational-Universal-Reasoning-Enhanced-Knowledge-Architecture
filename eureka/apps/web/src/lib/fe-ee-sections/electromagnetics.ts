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
      importantNote: 'Two parallel wires carrying current in the SAME direction attract each other. This is counterintuitive but follows from the Lorentz force. This fact defines the SI ampere: 1 A is the current that produces 2×10⁻⁷ N/m of force per meter between two wires 1 m apart.',
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

- **$E(z,t) = E_{0}\\cdot \\cos (\\omega t - kz) x$** (electric field in x-direction)
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
| Seawater | 4 | 26 m | 0.25 m |

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

| Line Type | Typical Z₀ |
|---|---|
| Coaxial cable (50 Ω) | RF measurement, instruments |
| Coaxial cable (75 Ω) | TV, video |
| Microstrip (PCB) | 50–100 Ω (depends on geometry) |
| Twin-lead (open wire) | $300\\ \\Omega$ |

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
| Purely reactive | jX | **|Γ| $= 1$ | Total reflection with phase shift |

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

| VSWR | |Γ| | Reflected Power | Match Quality |
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

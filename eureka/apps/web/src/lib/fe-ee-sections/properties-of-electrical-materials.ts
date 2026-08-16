// FE EE course content — Properties of Electrical Materials (4 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_PROPERTIES_OF_ELECTRICAL_MATERIALS: Record<string, TopicLesson> = {
fee_conductors: {
  topicId: 'fee_conductors',
  title: 'Conductors and Resistivity',
  domainWeight: 'Properties of Electrical Materials · 3–5%',
  overview: 'Conductivity and resistivity are fundamental material properties determining how easily charge flows. Understanding resistance as a function of geometry, material, and temperature is essential for wire selection and circuit design.',
  sections: [
    {
      id: 'cond-resistivity',
      title: '1. Resistivity, Conductivity, and Resistance',
      content: `## 1.1 Fundamental Relationships

**Resistivity** ρ (ohm·meters) is an intrinsic material property:

**$R = \\rho L/A$**

Where:
- R = resistance (Ω)
- ρ = resistivity (Ω·m)
- L = conductor length (m)
- A = cross-sectional area (m²)

**Conductivity** σ = 1/ρ (siemens/meter)

### Material Classification

| Material Type | Resistivity Range | Examples |
|---|---|---|
| Conductors | $10^{-8}\\ \\Omega \\cdot m$ | Copper (1.7×10⁻⁸), Aluminum (2.8×10⁻⁸) |
| Semiconductors | $10^{-4} to 10^{4}\\ \\Omega \\cdot m$ | Silicon, Germanium |
| Insulators | $10^{8} to 10^{20}\\ \\Omega \\cdot m$ | Glass, Rubber, Teflon |

## 1.2 Temperature Dependence

**$\\rho (T) = \\rho _{0}[1 + \\alpha (T - T_{0})]$**

Where α is the **temperature coefficient of resistance**:
- **Metals** (positive α): resistance increases with temperature
- **Semiconductors** (negative α): resistance decreases with temperature
- **Superconductors**: ρ → 0 below critical temperature Tc`,
      examTip: 'R = ρL/A is one of the most commonly tested formulas. Doubling length doubles resistance; doubling cross-sectional area halves resistance. Temperature coefficient α is positive for metals (resistance goes UP when hot) and negative for thermistors (resistance goes DOWN when hot).',
    },
    {
      id: 'cond-current',
      title: '2. Current Density and Wire Selection',
      content: `## 2.1 Current Density and Drift Velocity

**Current density**: J = I/A (A/m²)

**Drift velocity**: vd = J/(n·e) where n is carrier concentration, e is electron charge

Despite fast signal propagation (near light speed), electrons drift slowly (mm/s). The electric field propagates at near-light speed, pushing electrons throughout the wire almost simultaneously.

## 2.2 Wire Gauge and Selection

AWG (American Wire Gauge) is the standard wire sizing system:
- **Smaller gauge number = thicker wire = lower resistance**
- Each 3-gauge decrease roughly doubles the cross-sectional area
- Each 10-gauge decrease multiplies area by ~10

| AWG | Diameter (mm) | Resistance (mΩ/m) | Typical Use |
|---|---|---|---|
| 10 | 2.59 | 3.3 | 30A circuits |
| 12 | 2.05 | 5.2 | 20A household |
| 14 | 1.63 | 8.3 | 15A household |
| 18 | 1.02 | 21 | Low-power electronics |

### Wire Selection Criteria
- **Current capacity** (ampacity): wire must handle the current without overheating
- **Voltage drop**: V = IR limits distance; thicker wire for longer runs
- **Cost**: larger wire costs more; balance against performance`,
      examTip: 'For the FE exam, know that voltage drop V = I×R limits how far current can travel at a given wire gauge. For long cable runs, use thicker wire (lower gauge number) to keep voltage drop acceptable. The formula R = ρL/A directly determines this tradeoff.',
    },
  ],
  keyTakeaways: [
    'Resistivity ρ is intrinsic; resistance R = ρL/A depends on geometry.',
    'Temperature coefficient α: positive for metals (R increases), negative for semiconductors.',
    'Conductivity σ = 1/ρ; copper is the standard conductor (ρ ≈ 1.7×10⁻⁸ Ω·m).',
    'AWG: smaller number = thicker wire = lower resistance.',
    'Wire selection balances ampacity, voltage drop, and cost.',
  ],
},

fee_semiconductors: {
  topicId: 'fee_semiconductors',
  title: 'Semiconductors and Band Gap',
  domainWeight: 'Properties of Electrical Materials · 3–5%',
  overview: 'Semiconductors have properties between conductors and insulators, controlled by doping. Band gap energy, carrier concentration, and the p-n junction are fundamental to all electronic devices.',
  sections: [
    {
      id: 'semi-band',
      title: '1. Band Structure and Intrinsic Semiconductors',
      content: `## 1.1 Energy Bands

In a semiconductor crystal:
- **Valence band**: electrons are bound to atoms (cannot conduct)
- **Conduction band**: electrons are free to move (can conduct)
- **Band gap** Eg: energy required to promote an electron from valence to conduction band

| Material | Band Gap Eg | Type |
|---|---|---|
| Silicon (Si) | 1.12 eV | Semiconductor |
| Germanium (Ge) | 0.66 eV | Semiconductor |
| Gallium Arsenide (GaAs) | 1.42 eV | Semiconductor |
| Diamond | 5.47 eV | Insulator |

## 1.2 Intrinsic Carrier Concentration

**$ni \\propto \\exp (-Eg/(2kT))$**

Where k = 8.617×$10^{-5}$ eV/K (Boltzmann constant) and T is temperature in Kelvin.

For silicon at 300K: **$ni \\approx 1.5 \\times 10^{10} cm^{-3}$**

### Temperature Effects
- Higher T → more thermal energy → more electrons promoted → higher conductivity
- Carrier concentration roughly **doubles every 5-10°C**
- This is why semiconductor devices are temperature-sensitive`,
      examTip: 'Smaller band gap = higher intrinsic conductivity at room temperature. Germanium (Eg = 0.66 eV) has more carriers than silicon (Eg = 1.12 eV) at room temperature, which means more leakage current. This is why silicon dominates — it has lower leakage.',
    },
    {
      id: 'semi-doping',
      title: '2. Doping and the p-n Junction',
      content: `## 2.1 Doping

Adding impurities dramatically changes conductivity:

### N-type Doping (Donor)
- Add atoms with 5 valence electrons (P, As, Sb)
- Extra electron is loosely bound → easily becomes free carrier
- **Majority carriers**: electrons; **Minority carriers**: holes
- n ≈ ND (donor concentration), p = ni²/ND

### P-type Doping (Acceptor)
- Add atoms with 3 valence electrons (B, Al, Ga)
- Missing electron creates a "hole" that acts as positive charge
- **Majority carriers**: holes; **Minority carriers**: electrons
- p ≈ NA (acceptor concentration), n = ni²/NA

### Mass Action Law

**$n \\times p = ni^{2}$** (constant at fixed temperature, regardless of doping)

## 2.2 The p-n Junction (Diode)

When p-type meets n-type:
- A **depletion region** forms at the junction (no free carriers)
- Built-in potential ≈ 0.7 V for silicon
- **Forward bias** (+ to p, - to n): narrows depletion region → current flows
- **Reverse bias**: widens depletion region → minimal current (leakage only)

### Shockley Diode Equation

**$I = Is(e^{qV/kT} - 1)$**

Where Is is saturation current (≈ 10⁻¹² A), q = 1.602×10⁻¹⁹ C, kT/q ≈ 26 mV at 300K.`,
      examTip: 'The mass action law n×p = ni² is critical. If you dope silicon with ND = 10¹⁶ donors/cm³, then n ≈ 10¹⁶ and p = (1.5×10¹⁰)²/10¹⁶ = 2.25×10⁴ cm⁻³. The minority carrier concentration drops dramatically with doping.',
      importantNote: 'Thermal runaway in power devices: as temperature rises, more carriers are generated, increasing current, which generates more heat, further increasing temperature. Without proper thermal management (heat sinks, thermal shutdown), this positive feedback loop destroys the device.',
    },
  ],
  keyTakeaways: [
    'Band gap Eg determines carrier excitation; silicon Eg = 1.12 eV, ni ≈ 1.5×10¹⁰ cm⁻³ at 300K.',
    'N-type (donor): extra electrons; P-type (acceptor): extra holes.',
    'Mass action law: n×p = ni² always holds at fixed temperature.',
    'Shockley equation I = Is(e^(qV/kT)-1) describes diode exponential I-V curve.',
    'Forward bias: current flows (V > 0.7V for Si); reverse bias: only leakage current.',
  ],
},

fee_dielectrics: {
  topicId: 'fee_dielectrics',
  title: 'Dielectrics and Insulators',
  domainWeight: 'Properties of Electrical Materials · 3–5%',
  overview: 'Dielectric materials store energy in electric fields and enable capacitors. Dielectric constant, breakdown strength, and loss tangent determine capacitor performance and insulation reliability.',
  sections: [
    {
      id: 'diel-cap',
      title: '1. Dielectric Constant and Capacitance',
      content: `## 1.1 Dielectric Properties

The **dielectric constant** (relative permittivity) εr measures how much a material increases capacitance compared to vacuum:

**$C = \\varepsilon r\\cdot \\varepsilon _{0}\\cdot A/d$**

Where ε₀ = 8.854×10⁻¹² F/m is permittivity of free space.

| Material | $\\varepsilon r$ | Typical Application |
|---|---|---|
| Vacuum | 1 | Reference |
| Air | 1.0006 | Variable capacitors |
| Mica | 3-7 | Precision capacitors |
| Glass | 4-10 | Substrates |
| Ceramic (X7R) | 100-10000 | High-density capacitors |
| Water | 80 | (Not used in capacitors) |

## 1.2 Energy Storage

**$U = \\tfrac{1}{2} CV^{2} = \\tfrac{1}{2} \\varepsilon r\\cdot \\varepsilon _{0}\\cdot (A/d)\\cdot V^{2}$**

Higher εr → more energy stored per volume → smaller capacitors for same capacitance.

## 1.3 Breakdown Voltage

**Dielectric strength** is the maximum electric field before breakdown (permanent damage):
- Air: ~3 MV/m
- Mica: ~150 MV/m
- Ceramic: 100-300 MV/m

Design with **safety margin**: operating field should be 30-50% of breakdown strength.`,
      examTip: 'C = εr·ε₀·A/d is a high-frequency FE exam formula. To increase capacitance: increase εr (better dielectric material), increase A (larger plates), or decrease d (thinner dielectric). But decreasing d also brings you closer to breakdown — there is always a tradeoff.',
    },
    {
      id: 'diel-loss',
      title: '2. Dielectric Loss and Insulation',
      content: `## 2.1 Dielectric Loss

Real dielectrics dissipate some energy as heat, characterized by the **loss tangent** tan(δ):

- **Low-loss materials** (tan δ < 0.001): mica, PTFE — used in high-frequency applications
- **High-loss materials** (tan δ > 0.01): some ceramics — cause heating at high frequency

Dielectric power loss: **$P_{loss} \\propto V^{2}\\cdot f\\cdot \\tan (\\delta)$**

Higher frequency and higher voltage increase dielectric heating.

## 2.2 Polarization Mechanisms

Different polarization mechanisms contribute at different frequencies:

| Mechanism | Frequency Range | Description |
|---|---|---|
| Electronic | Optical (10¹⁵ Hz) | Electron cloud shifts |
| Ionic | Infrared (10¹² Hz) | Ions shift positions |
| Dipolar | Microwave (10⁹ Hz) | Polar molecules rotate |
| Interfacial | Low freq (10³ Hz) | Charges accumulate at interfaces |

At higher frequencies, slower mechanisms cannot follow the field, reducing εr. This frequency-dependent permittivity must be considered in AC circuit design.

## 2.3 Insulation Properties

- **Insulation resistance**: should be > 10¹² Ω for good insulators
- **Moisture absorption** degrades insulation — environmental protection required
- **Temperature** affects all properties — insulation must work at maximum operating temperature`,
      examTip: 'For high-frequency applications, use low-loss dielectrics (mica, PTFE). For high-capacitance applications, use high-εr materials (ceramic). The FE exam may ask you to select a dielectric based on application requirements.',
    },
  ],
  keyTakeaways: [
    'Dielectric constant εr increases capacitance: C = εr·ε₀·A/d.',
    'Higher εr enables smaller capacitors but may increase loss.',
    'Breakdown voltage limits operating field; design with 30-50% safety margin.',
    'Loss tangent tan(δ) characterizes dielectric heating; critical at high frequencies.',
    'Moisture and temperature degrade insulation properties.',
  ],
},

fee_magnetic_mat: {
  topicId: 'fee_magnetic_mat',
  title: 'Magnetic Materials',
  domainWeight: 'Properties of Electrical Materials · 3–5%',
  overview: 'Magnetic materials determine inductance, transformer efficiency, and motor performance. Permeability, the B-H curve, hysteresis loss, and the Curie temperature are essential for understanding magnetic devices.',
  sections: [
    {
      id: 'mag-types',
      title: '1. Magnetic Material Classification',
      content: `## 1.1 Permeability

**$B = \\mu _{0}\\cdot \\mu r\\cdot H$** where μ₀ = 4π×$10^{-7}$ H/m

**Permeability** μ = μ₀·μr determines field amplification.

| Material Type | $\\mu r$ | Example | Behavior |
|---|---|---|---|
| Diamagnetic | < 1 (slightly) | Copper, Bismuth | Weakly repels field |
| Paramagnetic | > 1 (slightly) | Aluminum | Weakly attracts field |
| Ferromagnetic | >> 1 (100-5000) | Iron, Nickel, Cobalt | Strongly attracts, retains |

## 1.2 Ferromagnetic Materials

Ferromagnetic materials have **unpaired electrons** with exchange interactions causing spontaneous alignment. Key properties:
- **High permeability**: greatly amplifies magnetic fields
- **Saturation**: B levels off at high H (all domains aligned)
- **Remanence**: retains magnetization after field removed
- **Coercivity**: reverse field needed to demagnetize

### Curie Temperature

Above the **Curie temperature** Tc, ferromagnetic materials become paramagnetic:
- Iron: Tc ≈ 770°C
- Nickel: Tc ≈ 358°C
- Cobalt: Tc ≈ 1115°C`,
      examTip: 'Ferromagnetic cores dramatically increase inductance: L = μr·μ₀·n²·A/l. An iron core with μr = 1000 increases inductance by 1000× compared to air. This is why transformers and inductors use ferromagnetic cores.',
    },
    {
      id: 'mag-hysteresis',
      title: '2. Hysteresis and Core Losses',
      content: `## 2.1 The B-H Curve and Hysteresis Loop

As applied field H increases from zero:
1. **Initial magnetization**: B rises steeply then levels off (saturation)
2. **H decreases to zero**: B does not return to zero — **remanence** Br remains
3. **H reversed**: coercive field **Hc** needed to bring B to zero
4. **Full reversal**: creates the **hysteresis loop**

### Hysteresis Loss

The **area inside the hysteresis loop** represents energy dissipated as heat per cycle:

**W_hysteresis = (loop area) × frequency**

## 2.2 Soft vs Hard Magnetic Materials

| Property | Soft Magnetic | Hard Magnetic |
|---|---|---|
| Loop shape | Narrow (small area) | Wide (large area) |
| Coercivity | Low | High |
| Remanence | Low-moderate | High |
| Application | **Transformers, motors** | **Permanent magnets** |
| Examples | Silicon steel, ferrites | NdFeB, SmCo, Alnico |

## 2.3 Eddy Current Losses

Changing magnetic flux induces circulating currents (**eddy currents**) in conductive cores:

**$P_{eddy} \\propto B^{2}\\cdot f^{2}\\cdot t^{2}/\\rho$**

Where t = lamination thickness, f = frequency, ρ = resistivity.

### Reducing Core Losses
- **Lamination**: thin stacked sheets limit eddy current paths
- **Ferrites**: high-resistivity ceramic magnets for high-frequency applications
- **Thinner laminations**: reduce eddy currents further but increase manufacturing cost`,
      examTip: 'Transformer core losses = hysteresis loss + eddy current loss. Hysteresis loss is proportional to frequency (area × f). Eddy current loss is proportional to f² and to lamination thickness squared. This is why high-frequency transformers use ferrite cores (high ρ) instead of iron laminations.',
      importantNote: 'Core losses are present whenever the magnetic field is changing — even at no load. Copper losses (I²R in windings) depend on load current. Total transformer loss = core loss + copper loss. Maximum efficiency occurs when core loss equals copper loss.',
    },
  ],
  keyTakeaways: [
    'Permeability μ = μ₀·μr; ferromagnetic materials have μr >> 1.',
    'Hysteresis loop area = energy loss per cycle; soft materials minimize this loss.',
    'Eddy current loss ∝ B²·f²·t²; lamination reduces eddy currents.',
    'Curie temperature: ferromagnetic → paramagnetic transition.',
    'Soft magnets for transformers/motors; hard magnets for permanent magnets.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 5 — ENGINEERING SCIENCES  (3 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

};

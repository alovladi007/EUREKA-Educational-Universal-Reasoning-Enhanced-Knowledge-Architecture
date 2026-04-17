/**
 * MCAT course content — 19 topics with deep lesson content.
 * AI-generated. Requires SME review.
 */

import type { QuizQuestion } from '@/components/test-prep/cissp/LessonQuiz';

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  examTip?: string;
  importantNote?: string;
  quiz?: QuizQuestion[];
}

export interface TopicLesson {
  topicId: string;
  title: string;
  domainWeight: string;
  overview: string;
  sections: LessonSection[];
  keyTakeaways?: string[];
}

export const MCAT_COURSE: Record<string, TopicLesson> = {
  /* =========================================================================
   * CHEMICAL & PHYSICAL FOUNDATIONS (25%)
   * ========================================================================= */

  // ── Topic 1: General Chemistry ──────────────────────────────────────────
  cp_gen_chem: {
    topicId: 'cp_gen_chem',
    title: 'General Chemistry',
    domainWeight: '25%',
    overview:
      'General Chemistry on the MCAT covers atomic structure, chemical bonding, stoichiometry, solution chemistry, acid-base equilibria, and thermodynamics. These topics form the quantitative backbone of the Chem/Phys section. You must be comfortable applying the Henderson-Hasselbalch equation, Le Chatelier\'s principle, and Gibbs free energy calculations under time pressure. Mastery here also supports Biochemistry topics that rely on equilibrium and energetics.',
    sections: [
      {
        id: 'cp_gc_atomic',
        title: 'Atomic Structure & Periodic Trends',
        content: `## Atomic Structure

Atoms consist of protons, neutrons, and electrons. The **atomic number (Z)** equals the number of protons and defines the element. The **mass number (A)** = protons + neutrons.

### Electron Configuration

Fill orbitals using the **Aufbau principle** (lowest energy first), **Hund's rule** (maximize unpaired electrons in degenerate orbitals), and the **Pauli exclusion principle** (max 2 electrons per orbital, opposite spins).

| Block | Orbitals | Max e⁻ |
|-------|----------|--------|
| s | 1 | 2 |
| p | 3 | 6 |
| d | 5 | 10 |
| f | 7 | 14 |

**Exceptions to know:** Chromium (Cr) is [Ar] 3d⁵ 4s¹ and Copper (Cu) is [Ar] 3d¹⁰ 4s¹ — half-filled and fully filled d subshells are extra stable.

### Periodic Trends

- **Ionization energy:** Increases left → right, bottom → top
- **Electronegativity:** Increases left → right, bottom → top (Fluorine is highest)
- **Atomic radius:** Increases right → left, top → bottom
- **Electron affinity:** Generally increases left → right (halogens are most negative)

> **Mnemonic — "IEAR":** Ionization Energy And electronegativity Rise going up and right; Atomic Radius does the Reverse.`,
        examTip:
          'The MCAT often tests periodic trends indirectly — e.g., predicting which atom in a bond is more electronegative to determine dipole direction or acidity.',
      },
      {
        id: 'cp_gc_bonding',
        title: 'Chemical Bonding & Molecular Geometry',
        content: `## Bonding Types

- **Ionic bonds:** Transfer of electrons between atoms with large electronegativity differences (>1.7). Formed between metals and nonmetals.
- **Covalent bonds:** Sharing of electrons. Can be polar (unequal sharing) or nonpolar (equal sharing).
- **Metallic bonds:** "Sea of electrons" model; delocalized electrons shared among metal cations.

## VSEPR Theory

**Valence Shell Electron Pair Repulsion** predicts molecular geometry by minimizing electron-pair repulsion around the central atom.

| Electron Domains | Bonding Pairs | Lone Pairs | Geometry | Example |
|-----------------|---------------|------------|----------|---------|
| 2 | 2 | 0 | Linear (180°) | CO₂ |
| 3 | 3 | 0 | Trigonal planar (120°) | BF₃ |
| 3 | 2 | 1 | Bent (~117°) | SO₂ |
| 4 | 4 | 0 | Tetrahedral (109.5°) | CH₄ |
| 4 | 3 | 1 | Trigonal pyramidal (~107°) | NH₃ |
| 4 | 2 | 2 | Bent (~104.5°) | H₂O |

## Hybridization

- **sp** → linear (2 domains) — e.g., acetylene C₂H₂
- **sp²** → trigonal planar (3 domains) — e.g., ethylene C₂H₄
- **sp³** → tetrahedral (4 domains) — e.g., methane CH₄

**Sigma (σ) bonds** form from head-on overlap; **pi (π) bonds** form from lateral p-orbital overlap. A double bond = 1σ + 1π; a triple bond = 1σ + 2π.`,
        importantNote:
          'Lone pairs occupy more space than bonding pairs, which is why NH₃ (107°) and H₂O (104.5°) have bond angles less than the ideal tetrahedral 109.5°.',
      },
      {
        id: 'cp_gc_stoich_solutions',
        title: 'Stoichiometry & Solutions',
        content: `## Stoichiometry

Stoichiometry uses balanced equations to relate moles of reactants and products.

### Key Relationships

- **Moles = mass (g) / molar mass (g/mol)**
- **Molarity (M) = moles solute / liters solution**
- **Dilution:** M₁V₁ = M₂V₂
- **Limiting reagent:** The reactant that runs out first determines the theoretical yield.
- **Percent yield = (actual yield / theoretical yield) × 100%**

### Solution Concentration Units

| Unit | Formula | When Used |
|------|---------|-----------|
| Molarity (M) | mol solute / L solution | Most MCAT problems |
| Molality (m) | mol solute / kg solvent | Colligative properties |
| Mole fraction (χ) | mol component / total mol | Vapor pressure (Raoult's law) |
| Weight percent | (mass solute / mass solution) × 100 | Lab contexts |

## Colligative Properties

These depend on the **number** of solute particles, not their identity:

- **Boiling point elevation:** ΔT_b = iK_bm
- **Freezing point depression:** ΔT_f = iK_fm
- **Osmotic pressure:** π = iMRT

Where **i** = van 't Hoff factor (number of particles the solute dissociates into). For NaCl, i ≈ 2; for glucose, i = 1.

> **Mnemonic:** "Boiling goes UP, Freezing goes DOWN" — solutes raise the boiling point and lower the freezing point.`,
        examTip:
          'When calculating the van \'t Hoff factor, remember that strong electrolytes fully dissociate (NaCl → i = 2, CaCl₂ → i = 3) while weak electrolytes partially dissociate (acetic acid → i ≈ 1).',
      },
      {
        id: 'cp_gc_acidbase',
        title: 'Acids, Bases & Buffers',
        content: `## Acid-Base Definitions

| Theory | Acid | Base |
|--------|------|------|
| Arrhenius | Produces H⁺ in water | Produces OH⁻ in water |
| Brønsted-Lowry | Proton (H⁺) donor | Proton (H⁺) acceptor |
| Lewis | Electron-pair acceptor | Electron-pair donor |

## pH and pOH

- **pH = −log[H⁺]** and **pOH = −log[OH⁻]**
- **pH + pOH = 14** (at 25°C)
- **Ka × Kb = Kw = 1.0 × 10⁻¹⁴**

## Henderson-Hasselbalch Equation

$$pH = pKa + \\log\\frac{[A⁻]}{[HA]}$$

This is the single most important equation for MCAT acid-base problems. It tells you:
- When [A⁻] = [HA], pH = pKa (the half-equivalence point of a titration)
- When [A⁻] > [HA], pH > pKa (more conjugate base)
- When [HA] > [A⁻], pH < pKa (more acid)

## Buffers

A buffer resists pH change and consists of a **weak acid + its conjugate base** (or weak base + conjugate acid). Buffers work best when pH is within ±1 of the pKa.

**Buffer capacity** increases with higher concentrations of the buffering species.

## Titrations — Key Points on the Curve

| Point | What Happens |
|-------|-------------|
| Initial | pH determined by weak acid alone |
| Half-equivalence | pH = pKa; maximum buffer capacity |
| Equivalence | Moles acid = moles base; pH determined by conjugate |
| Beyond equivalence | Excess strong acid or base dominates pH |

- Strong acid + strong base → equivalence pH = 7
- Weak acid + strong base → equivalence pH > 7
- Weak base + strong acid → equivalence pH < 7`,
        importantNote:
          'The Henderson-Hasselbalch equation only applies to weak acid/base systems. Never use it for strong acid or strong base calculations — those fully dissociate, so just use [H⁺] directly.',
        quiz: [
          {
            question:
              'A buffer solution contains 0.10 M acetic acid (pKa = 4.76) and 0.10 M sodium acetate. What is the pH?',
            options: ['3.76', '4.76', '5.76', '7.00'],
            correctIndex: 1,
            explanation:
              'Using Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]) = 4.76 + log(0.10/0.10) = 4.76 + log(1) = 4.76 + 0 = 4.76.',
          },
          {
            question:
              'At the equivalence point of a titration of a weak acid with a strong base, the pH is:',
            options: [
              'Equal to 7.0',
              'Less than 7.0',
              'Greater than 7.0',
              'Equal to the pKa of the weak acid',
            ],
            correctIndex: 2,
            explanation:
              'At the equivalence point, all the weak acid has been converted to its conjugate base, which hydrolyzes water to produce OH⁻, making the solution basic (pH > 7).',
          },
          {
            question:
              'Which of the following is a Lewis acid?',
            options: ['NH₃', 'BF₃', 'OH⁻', 'H₂O acting as a base'],
            correctIndex: 1,
            explanation:
              'BF₃ has an empty p orbital on boron and accepts an electron pair, making it a Lewis acid. NH₃ and OH⁻ are Lewis bases (electron-pair donors).',
          },
        ],
      },
      {
        id: 'cp_gc_equil_thermo',
        title: 'Equilibrium & Thermodynamics',
        content: `## Chemical Equilibrium

At equilibrium, the rates of the forward and reverse reactions are equal. The **equilibrium constant** K describes the ratio of products to reactants at equilibrium.

For aA + bB ⇌ cC + dD:

**K = [C]^c [D]^d / [A]^a [B]^b**

- K > 1 → products favored
- K < 1 → reactants favored
- K = 1 → roughly equal

### Le Chatelier's Principle

When a system at equilibrium is disturbed, it shifts to partially counteract the disturbance:

| Stress | Shift Direction |
|--------|----------------|
| Add reactant | → Products |
| Remove product | → Products |
| Add product | → Reactants |
| Increase pressure (fewer moles side) | → Side with fewer gas moles |
| Increase temperature (exothermic rxn) | → Reactants (K decreases) |
| Increase temperature (endothermic rxn) | → Products (K increases) |
| Add catalyst | No shift (reaches equilibrium faster) |

### Solubility Product (Ksp)

For a sparingly soluble salt: AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq), Ksp = [Ag⁺][Cl⁻]

- If Q < Ksp → unsaturated, more dissolves
- If Q = Ksp → saturated, equilibrium
- If Q > Ksp → supersaturated, precipitate forms

## Thermodynamics

### Gibbs Free Energy

**ΔG = ΔH − TΔS**

| ΔH | ΔS | Spontaneous? |
|----|-----|-------------|
| − | + | Always (ΔG < 0 at all T) |
| + | − | Never (ΔG > 0 at all T) |
| − | − | At low T |
| + | + | At high T |

- **ΔG < 0** → spontaneous (exergonic)
- **ΔG > 0** → nonspontaneous (endergonic)
- **ΔG = 0** → at equilibrium

**Relationship to K:** ΔG° = −RT ln K

> **Mnemonic for signs:** "Nature loves low enthalpy and high entropy" — exothermic reactions (−ΔH) and increased disorder (+ΔS) favor spontaneity.`,
        examTip:
          'Temperature is the ONLY stress that changes the value of K. Adding/removing reactants or products changes Q, causing a shift, but K stays the same.',
        quiz: [
          {
            question:
              'A reaction has ΔH = +30 kJ/mol and ΔS = +100 J/(mol·K). At what temperature does it become spontaneous?',
            options: ['Above 300 K', 'Below 300 K', 'At all temperatures', 'Never spontaneous'],
            correctIndex: 0,
            explanation:
              'Set ΔG = 0: 0 = ΔH − TΔS → T = ΔH/ΔS = 30,000 J / 100 J/K = 300 K. Above 300 K, TΔS > ΔH so ΔG < 0 (spontaneous).',
          },
          {
            question:
              'Adding a catalyst to a reaction at equilibrium will:',
            options: [
              'Shift equilibrium toward products',
              'Increase the equilibrium constant',
              'Decrease the activation energy without changing K',
              'Increase both forward and reverse rates unequally',
            ],
            correctIndex: 2,
            explanation:
              'A catalyst lowers the activation energy for both forward and reverse reactions equally. It speeds up attainment of equilibrium but does not change K or shift the equilibrium position.',
          },
          {
            question:
              'If Q > Ksp for a solution containing Ag⁺ and Cl⁻, what occurs?',
            options: [
              'More AgCl dissolves',
              'A precipitate of AgCl forms',
              'The solution remains unsaturated',
              'The Ksp value increases',
            ],
            correctIndex: 1,
            explanation:
              'When Q > Ksp, the ion product exceeds the solubility product, meaning the solution is supersaturated. The system shifts toward the solid (reactant side), forming a precipitate until Q = Ksp.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Master periodic trends — they predict bonding, acidity, and reactivity patterns tested throughout Chem/Phys.',
      'VSEPR and hybridization let you predict geometry; count electron domains to determine hybridization (2 = sp, 3 = sp², 4 = sp³).',
      'The Henderson-Hasselbalch equation (pH = pKa + log[A⁻]/[HA]) is essential for buffer and titration problems.',
      'Le Chatelier\'s principle: the system shifts to oppose the applied stress. Only temperature changes K.',
      'ΔG = ΔH − TΔS determines spontaneity; ΔG° = −RT ln K links thermodynamics to equilibrium.',
      'Colligative properties depend on particle count (van \'t Hoff factor i), not solute identity.',
    ],
  },

  // ── Topic 2: Organic Chemistry ──────────────────────────────────────────
  cp_organic: {
    topicId: 'cp_organic',
    title: 'Organic Chemistry',
    domainWeight: '25%',
    overview:
      'Organic Chemistry on the MCAT focuses on reaction mechanisms, functional group transformations, stereochemistry, and spectroscopy. Unlike a standalone orgo course, the MCAT emphasizes conceptual understanding of WHY reactions occur (nucleophilicity, electrophilicity, stability) over memorizing hundreds of reagents. Key areas include SN1/SN2/E1/E2 mechanisms, stereoisomer analysis, and interpreting IR and NMR spectra.',
    sections: [
      {
        id: 'cp_oc_functional',
        title: 'Functional Groups & Their Reactivity',
        content: `## Functional Groups to Know

| Group | Structure | Key Property |
|-------|-----------|-------------|
| Hydroxyl (−OH) | Alcohol | H-bonding, can be oxidized |
| Carbonyl (C=O) | Aldehyde/Ketone | Electrophilic carbon, nucleophilic addition |
| Carboxyl (−COOH) | Carboxylic acid | Acidic (pKa ~4-5), H-bonding |
| Amino (−NH₂) | Amine | Basic, nucleophilic |
| Thiol (−SH) | Thiol | Forms disulfide bonds (important in proteins) |
| Ester (−COOR) | Ester | Less reactive than acid chlorides |
| Amide (−CONHR) | Amide | Peptide bond, very stable |
| Phosphate (−OPO₃²⁻) | Phosphoester | Found in DNA, ATP |

### Carbonyl Reactivity Hierarchy

Acid chlorides > Anhydrides > Esters > Amides

This order reflects **leaving group ability** — better leaving groups make the carbonyl more reactive toward nucleophilic acyl substitution.

### Oxidation Levels of Carbon

Primary alcohol → Aldehyde → Carboxylic acid (progressive oxidation)

Secondary alcohol → Ketone (cannot be further oxidized without breaking C−C bonds)

Tertiary alcohols **cannot** be oxidized under normal conditions.

> **Mnemonic for oxidation state:** Count bonds to oxygen (or other electronegative atoms) vs. bonds to hydrogen. More bonds to O = more oxidized.`,
        examTip:
          'The MCAT loves to test functional group recognition in biological molecules — amino acids contain amino and carboxyl groups; nucleotides contain phosphoesters and amines.',
      },
      {
        id: 'cp_oc_mechanisms',
        title: 'SN1, SN2, E1, E2 Mechanisms',
        content: `## Substitution vs. Elimination Decision Tree

The four major mechanisms differ in kinetics, substrate preference, and stereochemistry:

| Feature | SN2 | SN1 | E2 | E1 |
|---------|-----|-----|-----|-----|
| Rate law | Rate = k[Sub][Nuc] | Rate = k[Sub] | Rate = k[Sub][Base] | Rate = k[Sub] |
| Substrate | Methyl > 1° > 2° | 3° > 2° | 3° > 2° > 1° | 3° > 2° |
| Nucleophile | Strong, unhindered | Weak (solvent) | Strong base | Weak base |
| Solvent | Polar aprotic | Polar protic | — | Polar protic |
| Stereochem | Inversion (Walden) | Racemization | Anti-periplanar | — |
| Carbocation? | No | Yes | No | Yes |

### How to Choose the Mechanism

1. **Look at the substrate:**
   - Methyl or 1° → SN2 (or E2 with strong base)
   - 3° → SN1 or E1 (with weak nucleophile) or E2 (with strong base)
   - 2° → All four possible; depends on nucleophile/base strength

2. **Look at the nucleophile/base:**
   - Strong nucleophile + weak base → SN2
   - Strong base + bulky → E2
   - Weak nucleophile, weak base → SN1/E1 (heat favors E1)

3. **Look at the solvent:**
   - Polar aprotic (DMSO, DMF, acetone) → favors SN2
   - Polar protic (water, alcohols) → favors SN1/E1

> **Mnemonic — "1 is lonely, 2 needs a friend":** SN1/E1 are unimolecular (rate depends on 1 species); SN2/E2 are bimolecular (rate depends on 2 species).`,
        importantNote:
          'SN2 proceeds with backside attack causing Walden inversion of stereochemistry. SN1 goes through a planar carbocation intermediate, leading to racemization (mixture of R and S products).',
        quiz: [
          {
            question:
              'A primary alkyl bromide is treated with NaCN in DMSO. The most likely mechanism is:',
            options: ['SN1', 'SN2', 'E1', 'E2'],
            correctIndex: 1,
            explanation:
              'Primary substrate + strong nucleophile (CN⁻) + polar aprotic solvent (DMSO) → classic SN2 conditions. Primary substrates are unhindered for backside attack.',
          },
          {
            question:
              'An SN1 reaction at a chiral center produces:',
            options: [
              'Complete inversion of configuration',
              'Complete retention of configuration',
              'A racemic mixture',
              'Only the R enantiomer',
            ],
            correctIndex: 2,
            explanation:
              'SN1 proceeds through a planar carbocation intermediate that can be attacked from either face, producing roughly equal amounts of R and S products (racemization).',
          },
          {
            question:
              'Which set of conditions most favors E2 elimination?',
            options: [
              'Tertiary substrate, weak base, polar protic solvent',
              'Primary substrate, strong nucleophile, polar aprotic solvent',
              'Tertiary substrate, strong bulky base, high temperature',
              'Methyl substrate, strong nucleophile, polar aprotic solvent',
            ],
            correctIndex: 2,
            explanation:
              'E2 is favored by a strong, bulky base (like tert-butoxide) with a substrate that can achieve anti-periplanar geometry. Tertiary substrates with bulky bases preferentially undergo E2 over SN2.',
          },
        ],
      },
      {
        id: 'cp_oc_stereo',
        title: 'Stereochemistry',
        content: `## Chirality & Stereocenters

A **chiral center** (stereocenter) is a carbon bonded to four different substituents. A molecule with one chiral center exists as two **enantiomers** (non-superimposable mirror images).

### R/S Assignment (Cahn-Ingold-Prelog Rules)

1. Assign priority to the four substituents by atomic number (highest atomic number = highest priority: 1 > 2 > 3 > 4)
2. Orient the molecule so the lowest priority group (4) points away from you
3. Trace a path from 1 → 2 → 3:
   - **Clockwise = R** (rectus, Latin for "right")
   - **Counterclockwise = S** (sinister, Latin for "left")

### Types of Stereoisomers

| Type | Mirror Images? | Superimposable? | Relationship |
|------|---------------|-----------------|-------------|
| Enantiomers | Yes | No | Same physical properties except optical rotation |
| Diastereomers | No | No | Different physical properties |
| Meso compounds | — | Yes (internal mirror plane) | Achiral despite stereocenters |

### Optical Activity

- **Enantiomers** rotate plane-polarized light equally but in opposite directions (+/−)
- A **racemic mixture** (50:50 enantiomers) shows zero net rotation
- **Specific rotation** [α] = observed rotation / (concentration × path length)

### E/Z Isomerism (Geometric Isomers)

For alkenes with restricted rotation:
- **Z** (zusammen) = higher-priority groups on the **same** side
- **E** (entgegen) = higher-priority groups on **opposite** sides

> **Mnemonic:** Z = "Zee Same Side" — the higher-priority groups are together.`,
        examTip:
          'A molecule with n chiral centers has a maximum of 2ⁿ stereoisomers. Meso compounds reduce this number because they have an internal plane of symmetry.',
      },
      {
        id: 'cp_oc_spectroscopy',
        title: 'Spectroscopy (IR, NMR, Mass Spec)',
        content: `## Infrared (IR) Spectroscopy

IR measures bond vibrations. Key absorptions to memorize:

| Absorption (cm⁻¹) | Bond | Notes |
|-------------------|------|-------|
| 3200–3600 (broad) | O−H | Alcohol or carboxylic acid |
| 3300 (sharp) | N−H | Amine (1° shows 2 peaks, 2° shows 1) |
| 2850–3000 | C−H | Almost always present |
| ~2200 | C≡N or C≡C | Triple bond region |
| 1700–1750 | C=O | Carbonyl — strongest, most reliable peak |
| 1600–1680 | C=C | Alkene |

> **Mnemonic for carbonyl:** "1700 is the **king** of IR" — always look for the strong C=O stretch near 1700.

## ¹H NMR Spectroscopy

NMR tells you about the **hydrogen environment** in a molecule.

- **Chemical shift (δ):** Position on the spectrum (ppm). Deshielded protons appear downfield (higher δ).
- **Integration:** Area under each peak ∝ number of equivalent hydrogens
- **Splitting (n + 1 rule):** A proton with n non-equivalent neighbors splits into n + 1 peaks

| δ Range (ppm) | Proton Type |
|---------------|-------------|
| 0–1 | Alkyl (R−CH₃) |
| 1–2 | Allylic, −CH₂− |
| 2–2.5 | Adjacent to C=O |
| 3.5–4 | Adjacent to O or N |
| 6.5–8 | Aromatic |
| 9–10 | Aldehyde |
| 10–12 | Carboxylic acid |

## Mass Spectrometry

- **Molecular ion peak (M⁺):** Gives the molecular weight
- **Base peak:** Most abundant fragment (tallest peak, set to 100%)
- **Common losses:** −15 (CH₃), −18 (H₂O), −28 (CO), −45 (OEt)
- **Nitrogen rule:** Odd molecular weight → odd number of nitrogen atoms`,
        importantNote:
          'On the MCAT, you will likely need to identify functional groups from IR spectra and determine the number of chemically distinct hydrogens from NMR. Full structure elucidation is rare — focus on pattern recognition.',
        quiz: [
          {
            question:
              'A compound shows a broad absorption at 2500–3300 cm⁻¹ and a strong peak at 1710 cm⁻¹ in its IR spectrum. The compound is most likely:',
            options: ['An alcohol', 'An aldehyde', 'A carboxylic acid', 'A ketone'],
            correctIndex: 2,
            explanation:
              'The broad O−H stretch (2500–3300 cm⁻¹) combined with a strong C=O stretch (~1710 cm⁻¹) is characteristic of a carboxylic acid. Alcohols show O−H at 3200–3600 without a carbonyl.',
          },
          {
            question:
              'In ¹H NMR, a proton adjacent to two non-equivalent hydrogens would appear as:',
            options: ['A singlet', 'A doublet', 'A triplet', 'A quartet'],
            correctIndex: 2,
            explanation:
              'Using the n + 1 rule: with 2 non-equivalent neighboring hydrogens, the signal splits into 2 + 1 = 3 peaks (a triplet).',
          },
          {
            question:
              'A mass spectrum shows M⁺ at m/z = 121. What can be inferred?',
            options: [
              'The compound has an even number of nitrogens',
              'The compound has an odd number of nitrogens',
              'The compound contains no nitrogen',
              'The molecular weight cannot be determined from M⁺',
            ],
            correctIndex: 1,
            explanation:
              'The nitrogen rule states that a compound with an odd molecular weight contains an odd number of nitrogen atoms. M⁺ = 121 (odd), so the compound has 1, 3, or another odd number of N atoms.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Know the SN1/SN2/E1/E2 decision tree cold — substrate, nucleophile/base strength, and solvent determine the mechanism.',
      'SN2 gives inversion; SN1 gives racemization. This is a very common MCAT question.',
      'Assign R/S configuration using CIP priority rules — lowest priority group points away, then trace 1→2→3.',
      'IR spectroscopy: the C=O stretch near 1700 cm⁻¹ is the most diagnostic peak. Broad O−H distinguishes acids from ketones.',
      'NMR: chemical shift tells you the environment, integration tells you how many H\'s, and splitting (n+1) tells you the neighbors.',
    ],
  },

  // ── Topic 3: Physics ────────────────────────────────────────────────────
  cp_physics: {
    topicId: 'cp_physics',
    title: 'Physics',
    domainWeight: '25%',
    overview:
      'Physics on the MCAT is algebra-based and emphasizes conceptual understanding with quantitative problem-solving. Core areas include kinematics, forces, energy, fluids, electrostatics, circuits, and waves/optics. The MCAT often presents physics in biological contexts — blood flow (fluids), nerve impulses (circuits), and vision (optics). You must be comfortable manipulating equations and performing quick mental math.',
    sections: [
      {
        id: 'cp_ph_kinematics',
        title: 'Kinematics & Newton\'s Laws',
        content: `## Kinematics Equations (Constant Acceleration)

| Equation | Variables |
|----------|-----------|
| v = v₀ + at | No displacement |
| x = x₀ + v₀t + ½at² | No final velocity |
| v² = v₀² + 2a(x − x₀) | No time |
| x = x₀ + ½(v₀ + v)t | No acceleration |

**Free fall:** a = g = 9.8 m/s² ≈ 10 m/s² (MCAT approximation)

### Projectile Motion

- Horizontal: constant velocity (aₓ = 0), x = v₀ₓt
- Vertical: constant acceleration (aᵧ = −g)
- The two components are **independent** of each other
- Range is maximized at 45° launch angle (no air resistance)

## Newton's Laws

1. **First Law (Inertia):** An object at rest stays at rest; an object in motion stays in motion unless acted on by a net force.
2. **Second Law:** F_net = ma
3. **Third Law:** For every action, there is an equal and opposite reaction.

### Common Forces

- **Weight:** W = mg (always downward)
- **Normal force:** Perpendicular to surface, adjusts to prevent penetration
- **Friction:** f = μN (static: f_s ≤ μ_sN; kinetic: f_k = μ_kN)
- **Tension:** Force transmitted through a string/rope/cable
- **Spring force:** F = −kx (Hooke's law)

### Inclined Planes

For an object on an incline of angle θ:
- Component of gravity along the plane: mg sin θ
- Component perpendicular to plane (= normal force on flat surface): mg cos θ

> **Mnemonic:** "Sin slides" — the component that makes things slide down the incline uses sine.`,
        examTip:
          'On the MCAT, approximate g ≈ 10 m/s² to simplify calculations. Also, always draw a free-body diagram — it is the single most effective strategy for force problems.',
      },
      {
        id: 'cp_ph_energy',
        title: 'Energy, Work & Momentum',
        content: `## Work and Energy

- **Work:** W = Fd cos θ (only the force component parallel to displacement does work)
- **Kinetic energy:** KE = ½mv²
- **Potential energy (gravitational):** PE = mgh
- **Elastic PE:** PE = ½kx²
- **Work-energy theorem:** W_net = ΔKE

### Conservation of Energy

In the absence of non-conservative forces (friction, air resistance):

**KE₁ + PE₁ = KE₂ + PE₂**

When friction is present: KE₁ + PE₁ = KE₂ + PE₂ + W_friction

### Power

**P = W/t = Fv** (force × velocity gives instantaneous power)

Units: Watts (W) = J/s

## Momentum

- **Momentum:** p = mv (vector quantity)
- **Impulse:** J = FΔt = Δp
- **Conservation of momentum:** In a closed system with no external forces, total momentum is conserved.

### Collisions

| Type | Momentum Conserved? | KE Conserved? |
|------|---------------------|---------------|
| Elastic | Yes | Yes |
| Inelastic | Yes | No |
| Perfectly inelastic | Yes | No (objects stick together) |

For perfectly inelastic: m₁v₁ + m₂v₂ = (m₁ + m₂)v_f

> **Mnemonic:** "Momentum is always conserved in collisions; kinetic energy is only conserved in elastic ones."`,
        importantNote:
          'Work done by gravity is path-independent (conservative force). Work done by friction is path-dependent (non-conservative). This distinction matters for energy conservation problems.',
      },
      {
        id: 'cp_ph_fluids',
        title: 'Fluids',
        content: `## Fluid Statics

- **Density:** ρ = m/V (water: 1000 kg/m³ = 1 g/cm³)
- **Pressure:** P = F/A (units: Pa = N/m²)
- **Hydrostatic pressure:** P = P₀ + ρgh (pressure increases with depth)
- **Gauge pressure:** P_gauge = ρgh (pressure relative to atmospheric)

### Pascal's Principle

Pressure applied to an enclosed fluid is transmitted undiminished throughout the fluid:

**F₁/A₁ = F₂/A₂** (hydraulic lift principle)

### Archimedes' Principle

**Buoyant force = weight of displaced fluid = ρ_fluid × V_displaced × g**

- Object floats when ρ_object < ρ_fluid
- Object sinks when ρ_object > ρ_fluid
- Fraction submerged = ρ_object / ρ_fluid

## Fluid Dynamics

### Continuity Equation (Conservation of Mass)

**A₁v₁ = A₂v₂**

Where A = cross-sectional area, v = flow velocity. When a pipe narrows, fluid speeds up.

### Bernoulli's Equation (Conservation of Energy for Fluids)

**P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂**

Key insight: **Where velocity is high, pressure is low** (and vice versa). This explains:
- Airplane lift (faster air over curved wing top → lower pressure above)
- Venturi effect (narrowing pipe → faster flow → lower pressure)
- Aneurysms (wider vessel → slower flow → higher pressure on walls)

### Viscosity and Poiseuille's Law

**Q = πΔPr⁴ / (8ηL)**

Flow rate Q is proportional to r⁴ — doubling the radius increases flow by 16×. This is critical for understanding blood flow regulation.

> **Mnemonic:** "Poiseuille's r⁴" — a small change in vessel radius causes a HUGE change in blood flow.`,
        examTip:
          'Bernoulli\'s equation is the MCAT\'s favorite fluid dynamics equation. Remember: it only applies to ideal (non-viscous, incompressible, laminar) flow. Poiseuille\'s law handles viscous flow.',
        quiz: [
          {
            question:
              'A pipe narrows from a cross-sectional area of 4 cm² to 1 cm². If the fluid velocity in the wider section is 2 m/s, what is the velocity in the narrow section?',
            options: ['0.5 m/s', '2 m/s', '4 m/s', '8 m/s'],
            correctIndex: 3,
            explanation:
              'By the continuity equation: A₁v₁ = A₂v₂ → (4)(2) = (1)(v₂) → v₂ = 8 m/s. When the area decreases by a factor of 4, velocity increases by a factor of 4.',
          },
          {
            question:
              'If the radius of a blood vessel doubles, by what factor does the flow rate change according to Poiseuille\'s law?',
            options: ['2×', '4×', '8×', '16×'],
            correctIndex: 3,
            explanation:
              'Poiseuille\'s law states Q ∝ r⁴. If r doubles: (2r)⁴ = 16r⁴. Flow rate increases by a factor of 16.',
          },
          {
            question:
              'An object with density 800 kg/m³ is placed in water (1000 kg/m³). What fraction of the object is submerged?',
            options: ['0.2', '0.5', '0.8', '1.0'],
            correctIndex: 2,
            explanation:
              'Fraction submerged = ρ_object / ρ_fluid = 800/1000 = 0.8. So 80% of the object is below the waterline.',
          },
        ],
      },
      {
        id: 'cp_ph_electro_circuits',
        title: 'Electrostatics, Circuits & Waves',
        content: `## Electrostatics

- **Coulomb's Law:** F = kq₁q₂/r² (k = 8.99 × 10⁹ N·m²/C²)
- **Electric field:** E = F/q = kQ/r² (points away from + charges, toward − charges)
- **Electric potential:** V = kQ/r (scalar, not vector)
- **Potential energy:** U = kq₁q₂/r

## Circuits

### Ohm's Law: V = IR

| Component | Series | Parallel |
|-----------|--------|----------|
| Resistors | R_total = R₁ + R₂ + ... | 1/R_total = 1/R₁ + 1/R₂ + ... |
| Current | Same through all | Splits (I_total = I₁ + I₂ + ...) |
| Voltage | Splits (V_total = V₁ + V₂ + ...) | Same across all |
| Capacitors | 1/C_total = 1/C₁ + 1/C₂ + ... | C_total = C₁ + C₂ + ... |

**Power:** P = IV = I²R = V²/R

> **Mnemonic:** Resistors in series ADD directly; capacitors in parallel ADD directly. They're "opposites" of each other.

### Kirchhoff's Laws
- **Junction rule:** Current in = current out (conservation of charge)
- **Loop rule:** Sum of voltage changes around any closed loop = 0 (conservation of energy)

## Waves & Optics

- **Wave equation:** v = fλ
- **Speed of sound in air:** ~340 m/s; **speed of light:** c = 3 × 10⁸ m/s
- **Snell's Law:** n₁ sin θ₁ = n₂ sin θ₂

### Thin Lens Equation

**1/f = 1/d₀ + 1/dᵢ**

- Converging (convex) lens: f > 0
- Diverging (concave) lens: f < 0
- **Magnification:** m = −dᵢ/d₀ (negative m = inverted image)

### Electromagnetic Spectrum (low → high frequency)

Radio → Microwave → Infrared → Visible → Ultraviolet → X-ray → Gamma

> **Mnemonic:** "**R**abbits **M**unch **I**n **V**ery **U**nusual e**X**pensive **G**ardens"`,
        importantNote:
          'For circuits on the MCAT: in series, current is constant and voltage drops across each resistor; in parallel, voltage is constant and current splits. This is the most commonly tested concept.',
        quiz: [
          {
            question:
              'Two resistors of 6 Ω and 3 Ω are connected in parallel. What is the equivalent resistance?',
            options: ['1 Ω', '2 Ω', '4.5 Ω', '9 Ω'],
            correctIndex: 1,
            explanation:
              '1/R_total = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2, so R_total = 2 Ω. For two resistors in parallel, you can also use R = (R₁ × R₂)/(R₁ + R₂) = 18/9 = 2 Ω.',
          },
          {
            question:
              'Light passes from air (n = 1.0) into glass (n = 1.5). Compared to the incident ray, the refracted ray:',
            options: [
              'Bends away from the normal and speeds up',
              'Bends toward the normal and slows down',
              'Continues straight without bending',
              'Bends away from the normal and slows down',
            ],
            correctIndex: 1,
            explanation:
              'When light enters a denser medium (higher n), it slows down (v = c/n) and bends toward the normal. By Snell\'s law: sin θ₂ = (n₁/n₂) sin θ₁ < sin θ₁, so θ₂ < θ₁.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'For kinematics, choose the equation that uses the three known variables and the one unknown. Approximate g ≈ 10 m/s².',
      'Conservation of energy: KE + PE = constant when no friction. Always account for non-conservative forces.',
      'Fluids: Continuity (A₁v₁ = A₂v₂) and Bernoulli (P + ½ρv² + ρgh = constant) are tested frequently.',
      'Poiseuille\'s law: Q ∝ r⁴ — vessel radius has an enormous effect on blood flow rate.',
      'Ohm\'s law (V = IR) and the series/parallel rules are the foundation for all circuit problems.',
      'Snell\'s law (n₁sinθ₁ = n₂sinθ₂): light bends toward normal when entering a denser medium.',
    ],
  },

  // ── Topic 4: Biochemistry I ─────────────────────────────────────────────
  cp_biochem_1: {
    topicId: 'cp_biochem_1',
    title: 'Biochemistry I — Amino Acids, Proteins & Enzymes',
    domainWeight: '25%',
    overview:
      'Biochemistry I covers the molecular building blocks of life: amino acids, protein structure, and enzyme kinetics. The MCAT requires you to recognize all 20 standard amino acids by structure and properties, understand the four levels of protein structure, and apply Michaelis-Menten kinetics to analyze enzyme behavior. These concepts connect directly to Bio/Biochem topics on metabolism and molecular biology.',
    sections: [
      {
        id: 'cp_bc1_amino',
        title: 'Amino Acids — The 20 Standard Residues',
        content: `## Amino Acid Structure

All amino acids share a common backbone: an **α-carbon** bonded to an **amino group (−NH₃⁺)**, a **carboxyl group (−COO⁻)**, a **hydrogen**, and a variable **R group** (side chain). At physiological pH (~7.4), the amino group is protonated and the carboxyl group is deprotonated (zwitterion form).

## Classification by R Group

### Nonpolar (Hydrophobic) — 8 amino acids
**G**lycine, **A**lanine, **V**aline, **L**eucine, **I**soleucine, **P**roline, **M**ethionine, **W** (Tryptophan), **F** (Phenylalanine)

> **Mnemonic:** "**GAV LIP MW F**lat" — Gly, Ala, Val, Leu, Ile, Pro, Met, Trp, Phe

### Polar Uncharged — 5 amino acids
**S**erine, **T**hreonine, **C**ysteine, **A**sparagine (N), **G**lutamine (Q)

- Serine and Threonine have hydroxyl (−OH) groups → sites of phosphorylation
- Cysteine has a thiol (−SH) → forms disulfide bonds (S−S)

### Positively Charged (Basic) — 3 amino acids (at pH 7.4)
- **Lysine (K):** pKa ~10.5 (ε-amino group)
- **Arginine (R):** pKa ~12.5 (guanidinium group) — almost always protonated
- **Histidine (H):** pKa ~6.0 (imidazole) — only amino acid with pKa near physiological pH; important in enzyme active sites

### Negatively Charged (Acidic) — 2 amino acids (at pH 7.4)
- **Aspartate (D):** pKa ~3.65
- **Glutamate (E):** pKa ~4.25

> **Mnemonic for charged amino acids:** "**Positive** charges need a **LicKeR** at the **H**otel" (Lys, Arg, His); "**Negative** people are **DE**sperate" (Asp, Glu).

### Special Amino Acids
- **Glycine:** Smallest R group (H); most conformational flexibility
- **Proline:** Cyclic, rigid; introduces kinks in α-helices
- **Cysteine:** Forms disulfide bonds (covalent cross-links)
- **Tryptophan:** Largest R group; absorbs UV at 280 nm`,
        examTip:
          'The MCAT expects you to know every amino acid\'s one-letter code, charge at pH 7.4, and general polarity. Histidine\'s near-neutral pKa (~6) makes it a favorite MCAT topic — it can act as both a proton donor and acceptor in enzyme catalysis.',
      },
      {
        id: 'cp_bc1_protein',
        title: 'Protein Structure',
        content: `## Four Levels of Protein Structure

### Primary Structure
The **linear sequence** of amino acids linked by **peptide bonds** (amide bonds between the α-carboxyl of one amino acid and the α-amino of the next). The peptide bond has partial double-bond character (resonance), making it **planar** and restricting rotation.

### Secondary Structure
Local folding patterns stabilized by **backbone hydrogen bonds** (C=O···H−N):

- **α-Helix:** Right-handed coil; H-bonds between residue i and i+4. Stabilized by alanine, leucine. Disrupted by proline (helix breaker) and glycine (too flexible).
- **β-Sheet:** Extended strands connected by H-bonds. Can be parallel or antiparallel. Antiparallel β-sheets have stronger, more linear H-bonds.

### Tertiary Structure
The overall **3D shape** of a single polypeptide chain, stabilized by:

| Interaction | Type | Example |
|------------|------|---------|
| Hydrophobic interactions | Nonpolar | Leu, Val buried in core |
| Hydrogen bonds | Polar | Ser−OH···O=C−Asp |
| Ionic bonds (salt bridges) | Charged | Lys⁺···⁻Glu |
| Disulfide bonds | Covalent | Cys−S−S−Cys |
| Van der Waals forces | Weak/universal | Close-packed atoms |

The **hydrophobic effect** is the primary driving force for protein folding — nonpolar residues are buried in the interior, away from water.

### Quaternary Structure
The arrangement of **multiple polypeptide subunits** (e.g., hemoglobin has 4 subunits: 2α + 2β). Not all proteins have quaternary structure — only multimeric ones.

## Denaturation

Loss of secondary, tertiary, and quaternary structure (primary structure remains intact). Caused by heat, extreme pH, urea, or detergents. Denaturation may be reversible (if conditions are restored) or irreversible (e.g., cooking an egg).`,
        importantNote:
          'The peptide bond is planar due to resonance, but rotation occurs around the N−Cα (φ) and Cα−C (ψ) bonds. This is why Ramachandran plots exist — they map allowed φ/ψ angles.',
      },
      {
        id: 'cp_bc1_enzymes',
        title: 'Enzymes & Michaelis-Menten Kinetics',
        content: `## Enzyme Basics

Enzymes are biological catalysts that **lower the activation energy (Ea)** of reactions without changing ΔG. They increase the rate of reaction but do NOT change the equilibrium position.

### Key Terms
- **Active site:** Region where substrate binds; complementary in shape and charge
- **Induced fit model:** Enzyme changes shape slightly upon substrate binding (more accurate than rigid lock-and-key model)
- **Cofactors:** Inorganic ions (Mg²⁺, Zn²⁺) or organic molecules (coenzymes like NAD⁺, FAD, coenzyme A)

## Michaelis-Menten Kinetics

**v = Vmax[S] / (Km + [S])**

- **Vmax:** Maximum reaction velocity (all enzyme molecules are saturated)
- **Km:** Substrate concentration at which v = Vmax/2. A **low Km** indicates high substrate affinity.
- **kcat:** Turnover number (molecules of substrate converted per enzyme per second)
- **Catalytic efficiency:** kcat/Km (measure of how efficiently an enzyme converts substrate)

### Lineweaver-Burk Plot (Double Reciprocal)

**1/v = (Km/Vmax)(1/[S]) + 1/Vmax**

- y-intercept = 1/Vmax
- x-intercept = −1/Km
- slope = Km/Vmax

## Types of Inhibition

| Type | Binds To | Effect on Vmax | Effect on Km | Lineweaver-Burk Change |
|------|----------|---------------|-------------|----------------------|
| Competitive | Active site | Unchanged | Increased (apparent) | Same y-intercept, different x-intercept |
| Uncompetitive | ES complex only | Decreased | Decreased | Parallel lines (same slope) |
| Noncompetitive | Enzyme or ES (not active site) | Decreased | Unchanged | Same x-intercept, different y-intercept |

> **Mnemonic for competitive inhibition:** "Competitive inhibitors **compete** for the active site — can be overcome by adding more substrate (Vmax unchanged)."

## Allosteric Regulation

- **Positive effectors:** Stabilize the active (R) form → increase activity
- **Negative effectors:** Stabilize the inactive (T) form → decrease activity
- Allosteric enzymes show **sigmoidal** kinetics (not hyperbolic like Michaelis-Menten)
- **Cooperative binding** (e.g., hemoglobin with O₂) produces a sigmoidal curve`,
        examTip:
          'The MCAT distinguishes competitive, uncompetitive, and noncompetitive inhibition by their effects on Km and Vmax. Memorize the table — it shows up almost every exam.',
        quiz: [
          {
            question:
              'An enzyme has a Km of 2 mM for substrate A and 0.2 mM for substrate B. Which statement is correct?',
            options: [
              'The enzyme has higher affinity for substrate A',
              'The enzyme has higher affinity for substrate B',
              'Both substrates bind equally well',
              'Km does not indicate affinity',
            ],
            correctIndex: 1,
            explanation:
              'Km is inversely related to substrate affinity — a lower Km means the enzyme reaches half-maximal velocity at a lower substrate concentration, indicating tighter binding. 0.2 mM < 2 mM, so the enzyme has higher affinity for substrate B.',
          },
          {
            question:
              'A competitive inhibitor is added to an enzyme reaction. What effect is observed?',
            options: [
              'Vmax decreases, Km unchanged',
              'Vmax unchanged, Km increases',
              'Both Vmax and Km decrease',
              'Vmax unchanged, Km unchanged',
            ],
            correctIndex: 1,
            explanation:
              'Competitive inhibitors compete with substrate for the active site. They can be overcome by adding excess substrate (so Vmax is unchanged), but they increase the apparent Km because more substrate is needed to reach half-maximal velocity.',
          },
          {
            question:
              'Which level of protein structure is maintained after denaturation?',
            options: ['Secondary', 'Tertiary', 'Quaternary', 'Primary'],
            correctIndex: 3,
            explanation:
              'Denaturation disrupts secondary (α-helices, β-sheets), tertiary (3D folding), and quaternary (subunit association) structure. The primary structure (amino acid sequence held by covalent peptide bonds) remains intact because peptide bonds require hydrolysis to break.',
          },
          {
            question:
              'At physiological pH (7.4), the side chain of histidine (pKa ~6.0) is:',
            options: [
              'Fully protonated and positively charged',
              'Mostly deprotonated and uncharged',
              'Negatively charged',
              'In a zwitterionic form',
            ],
            correctIndex: 1,
            explanation:
              'When pH > pKa, the amino acid side chain is predominantly deprotonated. Since 7.4 > 6.0, the imidazole group of histidine is mostly deprotonated and neutral at physiological pH. However, it is close enough to be partially protonated, which is why it plays key roles in acid-base catalysis.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Know all 20 amino acids by name, one-letter code, side chain polarity, and charge at pH 7.4.',
      'Histidine (pKa ~6) is uniquely important — its imidazole side chain can donate or accept protons near physiological pH.',
      'The four levels of protein structure: primary (sequence), secondary (α-helix, β-sheet), tertiary (3D fold), quaternary (subunit assembly).',
      'Hydrophobic interactions are the primary driving force for tertiary structure (protein folding).',
      'Michaelis-Menten: v = Vmax[S]/(Km + [S]). Low Km = high affinity. Competitive inhibitors increase apparent Km but do not change Vmax.',
      'Allosteric enzymes show sigmoidal kinetics, not hyperbolic — they are regulated by effectors binding at sites other than the active site.',
    ],
  },

  /* =========================================================================
   * CRITICAL ANALYSIS AND REASONING SKILLS (CARS) — 25%
   * ========================================================================= */

  // ── Topic 5: CARS Strategy & Timing ─────────────────────────────────────
  cars_strategy: {
    topicId: 'cars_strategy',
    title: 'CARS Strategy & Timing',
    domainWeight: '25%',
    overview:
      'The Critical Analysis and Reasoning Skills (CARS) section tests your ability to comprehend, analyze, and evaluate complex passages from the humanities and social sciences. Unlike the science sections, CARS cannot be studied by memorizing facts. Success depends on developing a consistent reading strategy, effective time management, and strong analytical reasoning skills. This section has 53 questions based on 9 passages in 90 minutes.',
    sections: [
      {
        id: 'cars_str_timing',
        title: 'Time Management & Pacing',
        content: `## The Numbers

- **90 minutes** for 9 passages (53 questions total)
- That's **10 minutes per passage** (reading + answering questions)
- Each passage is ~500–600 words with 5–7 questions

### Recommended Time Allocation

| Activity | Time |
|----------|------|
| Reading & annotating the passage | 3.5–4 minutes |
| Answering questions (5–7 per passage) | 5.5–6 minutes |
| Per question | ~1 minute each |

### Pacing Strategy

1. **Do NOT spend more than 10 minutes per passage.** If you are stuck, flag the question and move on.
2. **Triage passages:** Quickly scan the topic of each passage. If you have strong subjects, consider doing those first to bank confidence and time.
3. **Flag and return:** If a question is taking >90 seconds, select your best guess, flag it, and come back if time permits.
4. **Never leave a question blank** — there is no penalty for guessing on the MCAT.

### Common Time Traps

- Re-reading the entire passage for every question (solution: annotate during the first read)
- Deliberating between two answer choices for 3+ minutes (solution: eliminate, pick, move on)
- Spending too long on the first passage and rushing the last three

> **Key insight:** Consistent pacing beats perfect accuracy on any single passage. A student who scores 80% on 9 passages will outperform one who scores 100% on 6 passages but guesses on 3.`,
        examTip:
          'Practice under timed conditions from day one. Use a stopwatch to track your per-passage time during practice. Aim for 10 minutes flat — if you consistently finish in 8, you have a buffer for harder passages.',
      },
      {
        id: 'cars_str_passage',
        title: 'Passage Mapping & Annotation',
        content: `## How to Read CARS Passages Effectively

### The Passage Map Technique

As you read each paragraph, jot down a **brief note** (3–5 words) capturing the main point. This creates a "map" you can reference when answering questions instead of re-reading the whole passage.

**Example paragraph notes:**
- P1: "Author introduces debate on free will"
- P2: "Libertarian position — uncaused choices"
- P3: "Author critiques libertarians — determinism argument"
- P4: "Compatibilist compromise"
- P5: "Author supports compatibilism"

### What to Annotate

1. **The main idea** of each paragraph (in the margin or on scratch paper)
2. **The author's tone and opinion** — is the author arguing for or against something? Neutral? Sarcastic?
3. **Transitions and contrasts** — words like "however," "although," "in contrast" signal a shift
4. **Strong language** — "clearly," "undoubtedly," "fundamentally" indicate the author's conviction
5. **Examples vs. arguments** — note whether a paragraph provides evidence/examples or advances a claim

### What NOT to Do

- **Don't memorize details.** You can always look them up. Focus on structure and argument.
- **Don't highlight everything.** If everything is highlighted, nothing is highlighted.
- **Don't read passively.** Ask yourself: "What is the author trying to convince me of?"

### The Author's Thesis

Every CARS passage has a **central thesis** — the author's main claim or argument. Identifying it is the single most valuable skill. The thesis is often stated in:
- The **first** paragraph (as a thesis statement)
- The **last** paragraph (as a conclusion)
- Or built **gradually** across the passage

> **Active reading question to ask yourself after each paragraph:** "How does this connect to the author's overall argument?"`,
        importantNote:
          'CARS rewards understanding the author\'s perspective, not your own opinion. Even if you disagree with the passage, answer based on what the author would say. Your personal views are irrelevant on this section.',
      },
      {
        id: 'cars_str_elimination',
        title: 'Answer Elimination & Common Traps',
        content: `## Process of Elimination (POE)

On CARS, it is often easier to eliminate wrong answers than to find the right one. There are predictable patterns in wrong answer choices:

### Types of Wrong Answers

| Trap Type | Description | How to Spot It |
|-----------|-------------|----------------|
| **Too extreme** | Uses absolute language ("always," "never," "all") | The passage uses moderate language |
| **Out of scope** | Introduces ideas not discussed in the passage | Ask: "Did the author actually discuss this?" |
| **Opposite** | Reverses the author's position | Re-check the author's tone/thesis |
| **True but irrelevant** | Factually correct but doesn't answer the question | Re-read what the question is actually asking |
| **Distortion** | Twists the passage's meaning slightly | Compare carefully with the original text |
| **Too narrow** | Only addresses part of the question | Especially common with "main idea" questions |

### The "Two Survivors" Strategy

After eliminating 2 clearly wrong answers, you often have 2 remaining choices. To pick between them:

1. **Re-read the question stem** — what is it specifically asking?
2. **Return to the passage** and find the specific lines that support one answer over the other
3. **Pick the answer with the most direct textual support**
4. If still stuck: the **less extreme, more moderate** answer is usually correct

### Beware of "Looks Right" Answers

The MCAT writers craft answer choices that feel correct at first glance. Slow down and verify against the passage. The correct answer must be **supported by the passage text**, not by your background knowledge or assumptions.

> **Golden rule of CARS:** The answer is always in the passage or directly inferable from it. If you cannot point to specific text that supports your answer choice, it is likely wrong.`,
        examTip:
          'When you are torn between two answers, the one that is more moderate and more directly supported by the passage text is almost always correct. Extreme answer choices are rarely right on CARS.',
        quiz: [
          {
            question:
              'A CARS passage discusses the merits and limitations of abstract art. The author states that abstract art "challenges conventional aesthetics but sometimes sacrifices communicative clarity." Which answer best represents the author\'s view?',
            options: [
              'Abstract art is always superior to representational art',
              'Abstract art is entirely devoid of meaning',
              'Abstract art has both strengths and weaknesses',
              'Abstract art is the most important movement in art history',
            ],
            correctIndex: 2,
            explanation:
              'The author\'s language ("merits and limitations," "challenges...but sometimes sacrifices") indicates a balanced view acknowledging both positives and negatives. Options A, B, and D are too extreme.',
          },
          {
            question:
              'Which of the following is NOT a recommended CARS annotation strategy?',
            options: [
              'Writing a brief main idea for each paragraph',
              'Noting the author\'s tone and opinion',
              'Highlighting every important-sounding sentence',
              'Identifying transitions and contrasts between paragraphs',
            ],
            correctIndex: 2,
            explanation:
              'Highlighting everything is counterproductive — it fails to distinguish between key arguments and supporting details. Effective annotation is selective and focused on structure, not memorizing details.',
          },
          {
            question:
              'You have spent 12 minutes on a CARS passage and still have 2 questions remaining. The best strategy is:',
            options: [
              'Continue working until you are certain of the answers',
              'Select your best guesses, flag them, and move to the next passage',
              'Skip the remaining questions and come back at the very end',
              'Re-read the entire passage one more time',
            ],
            correctIndex: 1,
            explanation:
              'Spending too long on one passage compromises your ability to complete the section. Select the best answer you can, flag the questions for review if time permits, and move on to maintain your pacing.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Allocate ~10 minutes per passage: 4 minutes reading + 6 minutes for questions. Never exceed this.',
      'Use passage mapping — write 3-5 word summaries per paragraph to create a reference guide.',
      'Always identify the author\'s central thesis and tone before answering questions.',
      'Process of Elimination is your best tool — eliminate extreme, out-of-scope, and opposite answer choices first.',
      'Answer based on the passage, never based on your personal opinion or outside knowledge.',
    ],
  },

  // ── Topic 6: Humanities Passages ────────────────────────────────────────
  cars_humanities: {
    topicId: 'cars_humanities',
    title: 'Humanities Passages',
    domainWeight: '25%',
    overview:
      'Humanities passages on CARS are drawn from philosophy, ethics, literature, art criticism, history, religion, and cultural studies. These passages tend to be more abstract and argumentative than social science passages. They often require you to track nuanced positions, identify underlying assumptions, and understand how the author builds a philosophical or aesthetic argument. Developing comfort with this writing style is crucial for CARS success.',
    sections: [
      {
        id: 'cars_hum_philosophy',
        title: 'Philosophy & Ethics Passages',
        content: `## Common Philosophy Topics on CARS

CARS frequently draws from these philosophical traditions:

- **Epistemology:** The study of knowledge — What can we know? How do we know it?
- **Ethics/Moral philosophy:** What is right or good? Utilitarian vs. deontological vs. virtue ethics
- **Aesthetics:** What is art? What makes something beautiful?
- **Political philosophy:** Justice, rights, freedom, government authority
- **Philosophy of mind:** Consciousness, free will, personal identity

### Reading Philosophy Passages Effectively

1. **Identify the thesis immediately.** Philosophers typically state their position clearly (even if the argument is complex).
2. **Track the argument structure:** Premise 1 → Premise 2 → Conclusion. Ask: "What evidence does the author use to support the conclusion?"
3. **Watch for counterarguments.** Academic writing often presents an opposing view, then refutes it. Distinguish the author's view from the view being criticized.
4. **Abstract language is normal.** Don't panic if the passage discusses "ontological commitments" or "epistemic justification" — read for the argument, not the jargon.

### Ethics Frameworks to Recognize

| Framework | Key Thinker | Central Idea |
|-----------|-------------|-------------|
| Utilitarianism | Bentham, Mill | Maximize overall happiness/utility |
| Deontology | Kant | Act according to universal moral rules (duty) |
| Virtue ethics | Aristotle | Cultivate good character traits |
| Social contract | Hobbes, Locke, Rousseau | Morality arises from agreements among people |
| Care ethics | Gilligan, Noddings | Morality centered on relationships and care |

> **Reading tip:** When an ethics passage presents a dilemma, identify which framework the author uses. The questions will often ask you to apply or critique that framework.`,
        examTip:
          'Philosophy passages test whether you can follow the logical structure of an argument, not whether you know philosophy. Focus on premises, conclusions, and assumptions — the MCAT never tests factual knowledge of philosophers.',
      },
      {
        id: 'cars_hum_arts',
        title: 'Arts & Literary Criticism Passages',
        content: `## Art Criticism & Literary Analysis

These passages discuss painting, sculpture, music, literature, theater, film, or architecture. They may analyze specific works, debate artistic movements, or argue about the purpose and value of art.

### Common Themes

- **Art and society:** Does art reflect culture, or does it shape it?
- **Intention vs. interpretation:** Should we judge a work by the artist's intent or the audience's interpretation?
- **Formalism vs. contextualism:** Should art be judged on its formal qualities (color, composition, structure) or its historical and social context?
- **High art vs. popular culture:** Is the distinction between "high" and "low" art valid or elitist?

### How to Approach Arts Passages

1. **Identify the author's critical lens.** Are they a formalist analyzing technique? A Marxist analyzing class dynamics? A feminist critiquing gender representation?
2. **Note value judgments.** Art criticism is inherently evaluative — the author will praise or critique works. Track what they value and why.
3. **Distinguish description from argument.** Passages may describe a painting at length, but the question will ask about the author's interpretive claim, not the visual details.

### Literary Criticism Approaches

| Approach | Focus |
|----------|-------|
| Formalism/New Criticism | Text itself — structure, language, irony |
| Historical/Biographical | Author's life and historical context |
| Reader-Response | How the reader creates meaning |
| Postcolonial | Power, empire, cultural representation |
| Feminist | Gender roles, power dynamics, representation |
| Psychoanalytic | Unconscious desires, symbolism (Freud, Lacan) |

> **Strategy:** You do NOT need to know these frameworks in advance. The passage will explain the approach it uses. Your job is to understand and apply what is presented.`,
        importantNote:
          'Arts and literary criticism passages often use metaphorical or evocative language. Read through the style to find the substance — the underlying argument or evaluation the author is making.',
      },
      {
        id: 'cars_hum_practice',
        title: 'Practice Strategies for Humanities',
        content: `## Building Humanities Reading Skills

### Daily Practice Routine

1. **Read challenging non-fiction daily** (20–30 minutes):
   - Philosophy journals or essays (Stanford Encyclopedia of Philosophy — free online)
   - Art criticism (reviews in The New Yorker, The Atlantic, Art Forum)
   - Literary criticism (book reviews, literary journals)
   - Ethics discussions (bioethics, political philosophy)

2. **Practice active reading:**
   - After each paragraph, mentally summarize the main point in one sentence
   - After the entire article, identify: thesis, main supporting arguments, counterarguments addressed

3. **Expand your vocabulary organically.** Humanities passages use sophisticated vocabulary. Don't memorize word lists — instead, look up unfamiliar words as you encounter them in practice passages.

### Common Question Patterns for Humanities

| Question Type | What It Asks | Strategy |
|---------------|-------------|----------|
| Main idea | What is the author's central argument? | Use your passage map; usually thesis is in intro or conclusion |
| Author's attitude | What is the author's tone? | Look for evaluative language (praise, criticism, skepticism) |
| Inference | What would the author most likely agree with? | Must be supported by passage; avoid extremes |
| Function | Why does the author include [specific detail]? | Think about how it supports the broader argument |
| Strengthen/Weaken | Which new information would strengthen or weaken the argument? | Identify the key premises and find what supports/undermines them |

### Common Mistakes with Humanities Passages

- **Assuming prior knowledge is needed.** CARS never requires outside knowledge — everything you need is in the passage.
- **Getting lost in abstract language.** Translate jargon into plain English as you read.
- **Confusing the author's view with a view the author is critiquing.** Pay attention to attribution — "Smith argues..." does not mean the author agrees with Smith.`,
        examTip:
          'When the passage discusses multiple viewpoints, always track WHO holds each view. CARS questions frequently test whether you can distinguish the author\'s position from positions the author is merely reporting or criticizing.',
        quiz: [
          {
            question:
              'A CARS passage presents a philosopher\'s argument that morality should be based solely on consequences, then offers a critique that this approach ignores individual rights. The passage most likely contrasts:',
            options: [
              'Utilitarianism and virtue ethics',
              'Utilitarianism and deontology',
              'Social contract theory and care ethics',
              'Virtue ethics and deontology',
            ],
            correctIndex: 1,
            explanation:
              'Utilitarianism judges morality by consequences (outcomes/utility), while deontology emphasizes duties and rights regardless of consequences. The critique that a consequence-based approach "ignores individual rights" is a classic deontological objection.',
          },
          {
            question:
              'In a CARS passage about literary criticism, the author writes: "Formalists would insist that the poem\'s meaning resides entirely within its linguistic structure, but this view neglects the inescapable influence of historical context." The author\'s position is best described as:',
            options: [
              'Fully supportive of formalism',
              'Critical of formalism for ignoring historical context',
              'Neutral between formalism and historicism',
              'Dismissive of all literary criticism approaches',
            ],
            correctIndex: 1,
            explanation:
              'The word "but" signals the author\'s critique, and "neglects the inescapable influence" shows the author believes formalism is incomplete because it ignores historical context.',
          },
          {
            question:
              'Which strategy is LEAST effective when reading a philosophy passage on CARS?',
            options: [
              'Identifying the author\'s central thesis',
              'Tracking the logical structure of the argument',
              'Relying on your own philosophical knowledge to answer questions',
              'Distinguishing the author\'s view from views being critiqued',
            ],
            correctIndex: 2,
            explanation:
              'CARS answers must be supported by the passage, not outside knowledge. Relying on personal philosophical knowledge can lead you to choose answers that are "true" in general but not supported by the specific passage.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Philosophy passages test argument analysis — track premises, conclusions, and assumptions.',
      'Ethics frameworks (utilitarianism, deontology, virtue ethics) appear frequently; identify which one the author uses.',
      'Arts/literary criticism passages require you to separate description from evaluation — focus on the author\'s interpretive claims.',
      'Always distinguish the author\'s position from positions the author reports or critiques.',
      'Build humanities reading stamina by regularly reading philosophy, art criticism, and literary essays outside of practice tests.',
    ],
  },

  // ── Topic 7: Social Science Passages ────────────────────────────────────
  cars_social: {
    topicId: 'cars_social',
    title: 'Social Science Passages',
    domainWeight: '25%',
    overview:
      'Social science CARS passages draw from psychology, sociology, anthropology, economics, political science, and education. These passages tend to be more empirical and research-oriented than humanities passages — they may reference studies, data, or theoretical models. The key challenge is distinguishing evidence-based claims from the author\'s interpretation and recognizing when conclusions are supported vs. overgeneralized.',
    sections: [
      {
        id: 'cars_ss_psych_soc',
        title: 'Psychology & Sociology Passages',
        content: `## What to Expect

Social science passages on CARS often:
- Describe a research study and its implications
- Present a theoretical framework for understanding human behavior
- Compare competing explanations for a social phenomenon
- Argue for or against a particular policy based on social science evidence

### Common Psychology Topics

- Cognitive biases and decision-making (Kahneman, Tversky)
- Identity development and self-concept
- Group dynamics and conformity
- Mental health stigma and treatment approaches
- Child development theories

### Common Sociology Topics

- Social stratification and inequality
- Cultural norms and deviance
- Institutional power structures
- Globalization and its effects
- Education and social mobility

### Reading Strategy for Research-Based Passages

1. **Identify the research question:** What phenomenon is being studied?
2. **Note the methodology:** Is the passage describing experiments, surveys, ethnographies, or theoretical analysis?
3. **Track the evidence-claim chain:** What evidence is presented, and what conclusions does the author draw from it?
4. **Watch for hedging language:** "Suggests," "may indicate," "correlates with" — these signal that the author is being cautious about causation.

### Correlation vs. Causation

CARS questions frequently test whether you can distinguish between:
- **Correlation:** Two variables are associated (X and Y tend to occur together)
- **Causation:** One variable directly causes the other (X causes Y)

> **Rule of thumb:** If the passage says "is associated with" or "correlates with," the correct answer will not claim a causal relationship (unless the passage explicitly establishes one).`,
        examTip:
          'Social science CARS passages love to test the correlation vs. causation distinction. If the passage describes an observational study, be skeptical of answer choices that imply direct causation.',
      },
      {
        id: 'cars_ss_economics',
        title: 'Economics & Political Science Passages',
        content: `## Economics on CARS

You do NOT need economics knowledge for CARS. However, passages may use economic concepts like:

- **Supply and demand** — basic market forces
- **Incentives** — how rewards and punishments shape behavior
- **Externalities** — costs or benefits imposed on third parties
- **Public goods** — goods that are non-rivalrous and non-excludable
- **Opportunity cost** — the next-best alternative foregone

### Political Science on CARS

Common themes include:
- **Democracy and representation** — who has a voice? Who is excluded?
- **Power and authority** — how is power gained, maintained, and challenged?
- **Justice and rights** — how should societies allocate resources and opportunities?
- **International relations** — cooperation, conflict, treaties, sovereignty

### How to Approach These Passages

1. **Don't be intimidated by technical terms.** The passage will define or contextualize any term you need to understand.
2. **Focus on the argument, not the data.** If the passage mentions statistics, the question will usually ask about what the author concludes from the data, not about the numbers themselves.
3. **Identify the author's policy stance.** Social science passages often argue that a particular approach is better or worse. Find the author's recommendation.
4. **Consider multiple perspectives.** These passages may present opposing viewpoints from different stakeholders.

### Question Approaches

- When asked about "implications" of a study, think about what logically follows from the findings
- When asked about "assumptions," identify what the author takes for granted without proving
- When asked about "analogous situations," find an answer that shares the same underlying structure or logic`,
        importantNote:
          'CARS economics and political science passages test critical reading, not content knowledge. If an answer choice requires specialized knowledge not in the passage, it is likely wrong.',
      },
      {
        id: 'cars_ss_evidence',
        title: 'Evaluating Evidence & Arguments',
        content: `## Critical Evaluation Skills for Social Science

### Types of Evidence

| Evidence Type | Strength | Limitation |
|--------------|----------|-----------|
| Randomized controlled trial | Establishes causation | May not generalize to real world |
| Observational study | Real-world relevance | Cannot establish causation |
| Case study | Rich detail | Not generalizable |
| Survey data | Large sample possible | Self-report bias |
| Expert opinion | Authoritative | May be biased |
| Anecdotal evidence | Relatable | Least reliable |

### Evaluating Arguments

When the MCAT asks you to **strengthen** or **weaken** an argument, you need to:

1. **Identify the claim** the author is making
2. **Identify the evidence** supporting that claim
3. **Find the gap** between evidence and claim
4. **Strengthening:** Choose the answer that fills the gap or provides additional support
5. **Weakening:** Choose the answer that exposes the gap or provides contradictory evidence

### Logical Fallacies to Recognize

- **Ad hominem:** Attacking the person rather than the argument
- **Straw man:** Misrepresenting someone's position to make it easier to attack
- **Appeal to authority:** Claiming something is true because an authority says so
- **False dichotomy:** Presenting only two options when more exist
- **Hasty generalization:** Drawing broad conclusions from limited evidence
- **Post hoc ergo propter hoc:** Assuming that because B followed A, A caused B

> **Strategy for "weaken" questions:** Look for alternative explanations, confounding variables, or flaws in the study design that the author has overlooked.`,
        examTip:
          'When evaluating evidence in a social science passage, always ask: "Is this evidence sufficient to support the author\'s conclusion?" CARS questions often test your ability to identify when the author overgeneralizes.',
        quiz: [
          {
            question:
              'A passage describes a study showing that students who eat breakfast score higher on exams. The author concludes that eating breakfast improves academic performance. Which finding would most weaken this conclusion?',
            options: [
              'Students who eat breakfast also tend to get more sleep and have more stable home environments',
              'The study was conducted in multiple schools across different states',
              'Breakfast is considered the most important meal of the day by most nutritionists',
              'Some students who ate breakfast still scored below average',
            ],
            correctIndex: 0,
            explanation:
              'This answer introduces confounding variables (sleep, home environment) that could explain the correlation without breakfast being the cause. It weakens the causal claim by suggesting alternative explanations.',
          },
          {
            question:
              'A CARS passage argues that increasing the minimum wage reduces poverty based on a study of one city. Which criticism most effectively challenges the author\'s generalization?',
            options: [
              'The author is not an economist',
              'The study only examined one city, which may not be representative of all economic contexts',
              'Poverty is a complex issue',
              'Some workers may lose their jobs when wages increase',
            ],
            correctIndex: 1,
            explanation:
              'The most targeted criticism challenges the generalizability of a single-city study. This directly addresses the weakness in moving from limited evidence to a broad conclusion.',
          },
          {
            question:
              'In a social science CARS passage, the phrase "is associated with" most likely indicates:',
            options: [
              'A proven causal relationship',
              'A correlational relationship that does not establish causation',
              'A theoretical model without empirical support',
              'An opinion rather than a research finding',
            ],
            correctIndex: 1,
            explanation:
              '"Is associated with" is standard academic hedging language indicating correlation. It deliberately avoids claiming causation, which would require stronger language like "causes" or "leads to."',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Social science passages are more empirical than humanities — look for research studies, data, and evidence-based claims.',
      'Always distinguish correlation from causation. "Associated with" ≠ "causes."',
      'Evaluate the strength of evidence: RCTs > observational studies > case studies > anecdotes.',
      'For strengthen/weaken questions, identify the gap between evidence and the author\'s conclusion.',
      'You need zero outside knowledge of economics, political science, or sociology — every answer is derivable from the passage.',
    ],
  },

  // ── Topic 8: Question Type Mastery ──────────────────────────────────────
  cars_question_types: {
    topicId: 'cars_question_types',
    title: 'Question Type Mastery',
    domainWeight: '25%',
    overview:
      'CARS questions fall into distinct categories, each requiring a different approach. By learning to recognize question types, you can develop targeted strategies that improve both speed and accuracy. The major categories are: main idea, detail/retrieval, inference, function/purpose, strengthen/weaken, and application/reasoning beyond the text. Mastering these types is the fastest way to improve your CARS score.',
    sections: [
      {
        id: 'cars_qt_main',
        title: 'Main Idea & Author Attitude Questions',
        content: `## Main Idea Questions

These ask for the **central thesis** or **primary purpose** of the passage.

### How to Recognize

- "The main idea of the passage is..."
- "The author's central argument is..."
- "The primary purpose of the passage is to..."
- "Which of the following best summarizes the passage?"

### Strategy

1. Refer to your passage map — the main idea should be clear from your paragraph summaries
2. The correct answer must account for the **entire** passage, not just one paragraph
3. Eliminate answers that are:
   - **Too narrow** (covers only one section)
   - **Too broad** (makes claims beyond the passage scope)
   - **Opposite** to the author's position

### Common Trap: Picking a Detail Instead of the Main Idea

A passage about immigration policy might discuss economic impacts, cultural integration, and legal frameworks. An answer focusing only on "economic impacts of immigration" would be too narrow if the passage addresses all three topics equally.

## Author Attitude/Tone Questions

### How to Recognize

- "The author's attitude toward X is best described as..."
- "The author would most likely view Y with..."
- "The tone of the passage is primarily..."

### Strategy

1. Track evaluative language throughout the passage:
   - **Positive:** "important," "groundbreaking," "effectively," "admirably"
   - **Negative:** "flawed," "overlooks," "fails to," "problematic"
   - **Neutral/Balanced:** "arguably," "one perspective," "some scholars contend"
2. The correct answer should match the **overall** tone, not the tone of a single paragraph
3. Most CARS authors have nuanced views — "cautiously optimistic" or "largely supportive but with reservations" is more likely than "overwhelmingly enthusiastic"`,
        examTip:
          'For main idea questions, test each answer by asking: "Does this capture the ENTIRE passage, or just one part?" The correct answer is always comprehensive enough to encompass the passage as a whole.',
      },
      {
        id: 'cars_qt_inference',
        title: 'Inference & Reasoning Beyond the Text',
        content: `## Inference Questions

These ask you to go **one step beyond** what is explicitly stated in the passage.

### How to Recognize

- "It can be inferred from the passage that..."
- "The passage implies that..."
- "The author would most likely agree that..."
- "Based on the passage, it is most reasonable to conclude that..."

### Strategy

1. The correct answer is **directly supported** by passage content — it just requires a small logical step
2. **It must be supported, not assumed.** An inference that requires two or three logical leaps is too far.
3. Return to the relevant section of the passage and confirm the inference

### Inference vs. Assumption

- **Inference:** A conclusion drawn FROM the text (passage → inference)
- **Assumption:** Something the author takes for granted WITHOUT stating (gap in the argument)

## Reasoning Beyond the Text

These questions ask you to apply the author's reasoning to **new situations** not discussed in the passage.

### How to Recognize

- "If the author's argument is correct, which of the following would also be true?"
- "Which of the following situations is most analogous to the one described in the passage?"
- "If new evidence showed X, the author would most likely respond by..."
- "The author's reasoning would be most applicable to which of the following?"

### Strategy

1. **Abstract the principle.** What general rule or pattern underlies the author's specific argument?
2. **Apply the principle to each answer choice.** Which new situation follows the same logic?
3. **Avoid surface similarity.** The correct answer shares the same **underlying logic**, not just similar topic words.

### Example

If the passage argues that censorship is counterproductive because it increases interest in banned content (the "Streisand effect"), an analogous situation would be a case where prohibition increases demand — even if the specific topic is completely different (e.g., banning a toy makes children want it more).`,
        importantNote:
          'CARS inferences must be conservative — they are one small step beyond the text. If an answer choice requires significant speculation or multiple unsupported assumptions, it is too far.',
      },
      {
        id: 'cars_qt_function',
        title: 'Function, Detail & Strengthen/Weaken Questions',
        content: `## Function/Purpose Questions

These ask **why** the author includes a specific detail, example, or paragraph — not what it says, but what role it plays.

### How to Recognize

- "The author mentions X primarily in order to..."
- "The function of paragraph 3 is to..."
- "The author includes the example of Y in order to..."

### Strategy

1. Return to the specific location and read the **surrounding context**
2. Ask: "What argument is this detail supporting?"
3. Common functions:
   - **Support a claim** (evidence for an argument)
   - **Illustrate a concept** (make an abstract idea concrete)
   - **Provide a counterexample** (challenge a previously stated position)
   - **Transition** to a new topic or shift in argument

## Detail/Retrieval Questions

These ask you to locate **specific information** stated in the passage.

### How to Recognize

- "According to the passage..."
- "The author states that..."
- "Which of the following is mentioned in the passage?"

### Strategy

These are the most straightforward CARS questions. Use your passage map to locate the relevant paragraph, then confirm the answer by re-reading the specific lines.

## Strengthen/Weaken Questions

### How to Recognize

- "Which of the following would most strengthen the author's argument?"
- "Which of the following, if true, would most weaken the author's conclusion?"

### Strategy

1. **Identify the specific claim** being strengthened or weakened
2. **Identify the evidence** supporting that claim
3. **Find the gap** — what is the assumption connecting evidence to conclusion?
4. **Strengthen:** Choose the answer that supports the assumption or provides additional evidence
5. **Weaken:** Choose the answer that undermines the assumption or provides counter-evidence`,
        examTip:
          'Function questions are about the ROLE a detail plays, not what it says. "The author mentions X in order to..." requires you to think about the author\'s argumentative strategy, not the content of X itself.',
        quiz: [
          {
            question:
              'A passage argues that standardized testing fails to measure true intelligence and then provides the example of Albert Einstein, who performed poorly on rote memorization tasks but excelled in creative problem-solving. The function of the Einstein example is most likely to:',
            options: [
              'Prove that standardized testing is always invalid',
              'Illustrate the author\'s claim that standardized tests miss certain types of intelligence',
              'Argue that Einstein was the greatest scientist of all time',
              'Suggest that all standardized tests should be eliminated',
            ],
            correctIndex: 1,
            explanation:
              'The example serves to ILLUSTRATE the author\'s claim by providing a concrete case where standardized testing would have underestimated genuine intellectual ability. It supports rather than proves the argument.',
          },
          {
            question:
              'If a passage argues that government regulation of social media is necessary to protect children, which of the following would most weaken this argument?',
            options: [
              'A study showing government regulation of social media has historically been ineffective and led to increased censorship without measurable child safety improvements',
              'An expert opinion that social media companies should self-regulate',
              'A statistic showing children spend 3 hours daily on social media',
              'A report that parents support government regulation',
            ],
            correctIndex: 0,
            explanation:
              'This answer directly challenges the claim\'s core assumption — that regulation would actually protect children. Showing that regulation is ineffective undermines the argument\'s conclusion. The other options either support the argument or are tangential.',
          },
          {
            question:
              'A CARS question asks: "The author would most likely agree with which of the following?" This is an example of which question type?',
            options: [
              'Main idea question',
              'Detail/retrieval question',
              'Inference question',
              'Function/purpose question',
            ],
            correctIndex: 2,
            explanation:
              'This is an inference question because it asks you to go beyond what is explicitly stated to determine what the author would agree with, based on the views expressed in the passage.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Recognize the six major CARS question types: main idea, tone/attitude, inference, function/purpose, detail, and strengthen/weaken.',
      'Main idea answers must cover the WHOLE passage — eliminate choices that are too narrow or too broad.',
      'Inferences require one small step beyond the text, supported by evidence. Multiple logical leaps = wrong answer.',
      'Function questions ask WHY the author includes something, not WHAT it says.',
      'Strengthen/weaken questions require identifying the assumption between evidence and conclusion.',
      'For "reasoning beyond text" questions, abstract the principle and apply it to new situations.',
    ],
  },

  /* =========================================================================
   * BIOLOGICAL & BIOCHEMICAL FOUNDATIONS (25%)
   * ========================================================================= */

  // ── Topic 9: Cell Biology ───────────────────────────────────────────────
  bb_cell_bio: {
    topicId: 'bb_cell_bio',
    title: 'Cell Biology',
    domainWeight: '25%',
    overview:
      'Cell Biology on the MCAT covers organelle structure and function, membrane transport, cellular signaling pathways, and the cell cycle. You need to understand how cellular components work together to maintain homeostasis, communicate with other cells, and reproduce. This topic heavily overlaps with molecular biology and organ systems, making it one of the highest-yield areas for the Bio/Biochem section.',
    sections: [
      {
        id: 'bb_cb_organelles',
        title: 'Organelles & Cellular Compartments',
        content: `## Eukaryotic Organelles

| Organelle | Function | Key Details |
|-----------|----------|-------------|
| **Nucleus** | Houses DNA, transcription | Double membrane, nuclear pores, nucleolus (rRNA synthesis) |
| **Rough ER** | Protein synthesis & folding | Ribosomes on surface; secretory/membrane proteins |
| **Smooth ER** | Lipid synthesis, detox | No ribosomes; also stores Ca²⁺ (in muscle = sarcoplasmic reticulum) |
| **Golgi apparatus** | Modification, sorting, packaging | cis (receiving) → trans (shipping); glycosylation |
| **Mitochondria** | ATP production (oxidative phosphorylation) | Double membrane; own DNA (maternal inheritance); matrix + cristae |
| **Lysosomes** | Intracellular digestion | Acidic interior (pH ~5); contain hydrolytic enzymes |
| **Peroxisomes** | Fatty acid oxidation, detox | Contain catalase (breaks down H₂O₂) |
| **Ribosomes** | Translation (mRNA → protein) | Free (cytoplasmic proteins) or bound (secretory proteins) |
| **Cytoskeleton** | Structure, movement, division | Microfilaments (actin), intermediate filaments, microtubules (tubulin) |

### Endosymbiotic Theory

Mitochondria (and chloroplasts in plants) were likely once free-living prokaryotes engulfed by ancestral eukaryotic cells. Evidence:
- Double membrane
- Own circular DNA
- 70S ribosomes (like bacteria)
- Replicate by binary fission

### Secretory Pathway

Rough ER → Golgi (cis → trans) → Plasma membrane or lysosomes

Proteins are tagged with **signal sequences** to direct them to the appropriate destination. Mannose-6-phosphate tags proteins for lysosomes.

> **Mnemonic:** "**R**ough ER makes **P**roteins; **S**mooth ER makes **L**ipids" — R for Ribosomes/Proteins, S for Steroids/Lipids.`,
        examTip:
          'Mitochondria are tested in multiple contexts: as the site of aerobic metabolism, as a source of apoptotic signals (cytochrome c release), and as a classic example of endosymbiosis. Know all three.',
      },
      {
        id: 'bb_cb_membrane',
        title: 'Membrane Structure & Transport',
        content: `## The Fluid Mosaic Model

The plasma membrane is a **phospholipid bilayer** with embedded proteins, cholesterol, and carbohydrates.

- **Phospholipids:** Hydrophilic heads face outward; hydrophobic tails face inward
- **Cholesterol:** Maintains fluidity — prevents extremes (too fluid at high T, too rigid at low T)
- **Integral proteins:** Span the membrane (channels, carriers, receptors)
- **Peripheral proteins:** Attached to the surface (signaling, cytoskeletal anchoring)
- **Glycoproteins/glycolipids:** Carbohydrate chains on the extracellular surface (cell recognition)

## Types of Membrane Transport

### Passive Transport (No ATP Required)

| Type | Description | Example |
|------|-------------|---------|
| Simple diffusion | Small nonpolar molecules cross directly | O₂, CO₂, steroid hormones |
| Osmosis | Water moves through aquaporins or membrane | Water across semipermeable membrane |
| Facilitated diffusion | Requires channel or carrier protein | Glucose via GLUT transporters; ions via channels |

**Direction:** Always DOWN the concentration gradient (high → low)

### Active Transport (Requires ATP)

| Type | Description | Example |
|------|-------------|---------|
| Primary active | ATP directly powers the pump | Na⁺/K⁺-ATPase (3 Na⁺ out, 2 K⁺ in per ATP) |
| Secondary active | Uses gradient established by primary active transport | Na⁺/glucose symporter (SGLT) |

### Bulk Transport

- **Endocytosis:** Cell takes in large molecules (phagocytosis = solids; pinocytosis = fluids; receptor-mediated)
- **Exocytosis:** Cell secretes vesicle contents (neurotransmitter release, hormone secretion)

## Tonicity

| Solution | Effect on Cell | Water Movement |
|----------|---------------|----------------|
| Hypertonic | Cell shrinks (crenation) | Water leaves cell |
| Hypotonic | Cell swells (may lyse) | Water enters cell |
| Isotonic | No net change | Equal water in and out |

> **Mnemonic:** "Water follows salt" — water moves toward higher solute concentration via osmosis.`,
        importantNote:
          'The Na⁺/K⁺-ATPase is the single most important pump to know. It establishes the electrochemical gradient used for nerve impulses, secondary active transport, and maintaining cell volume. It pumps 3 Na⁺ out and 2 K⁺ in per ATP hydrolyzed.',
      },
      {
        id: 'bb_cb_signaling',
        title: 'Cell Signaling',
        content: `## Signal Transduction Overview

Cell signaling follows a general pathway: **Signal → Receptor → Transduction → Response**

### Types of Signaling

| Type | Range | Speed | Example |
|------|-------|-------|---------|
| Endocrine | Long-range (bloodstream) | Slow (minutes-hours) | Insulin from pancreas |
| Paracrine | Local (nearby cells) | Moderate | Growth factors, histamine |
| Autocrine | Self (same cell) | Varies | Interleukin signaling |
| Juxtacrine | Direct contact | Fast | Notch signaling |
| Synaptic | Synaptic cleft | Very fast (ms) | Neurotransmitters |

### Major Signaling Pathways

**G-Protein Coupled Receptors (GPCRs):**
1. Ligand binds → receptor activates G protein (Gα exchanges GDP for GTP)
2. Gα activates effector enzymes:
   - **Gαs → activates adenylyl cyclase → ↑ cAMP → activates PKA**
   - **Gαq → activates phospholipase C → IP₃ + DAG → Ca²⁺ release + PKC activation**
   - **Gαi → inhibits adenylyl cyclase → ↓ cAMP**

**Receptor Tyrosine Kinases (RTKs):**
1. Ligand binding causes receptor dimerization
2. Autophosphorylation of tyrosine residues
3. Activates Ras → Raf → MEK → ERK (MAP kinase cascade)
4. ERK enters nucleus → activates transcription factors → cell growth/division

**Intracellular Receptors:**
- **Steroid hormones** (cortisol, estrogen, testosterone) cross the membrane directly (they are lipophilic)
- Bind intracellular receptors → hormone-receptor complex acts as a transcription factor
- Slower but longer-lasting effects

### Second Messengers

| Second Messenger | Produced By | Effect |
|-----------------|-------------|--------|
| cAMP | Adenylyl cyclase | Activates PKA |
| IP₃ | Phospholipase C | Releases Ca²⁺ from ER |
| DAG | Phospholipase C | Activates PKC |
| Ca²⁺ | Released from ER | Activates calmodulin, muscle contraction |
| cGMP | Guanylyl cyclase | Smooth muscle relaxation (vasodilation) |

> **Mnemonic for GPCRs:** "**S**timulatory → **S**timulates cAMP" (Gαs); "**I**nhibitory → **I**nhibits cAMP" (Gαi).`,
        examTip:
          'The MCAT loves to test signal amplification — one hormone molecule activates one GPCR, which activates many G proteins, each activating many adenylyl cyclase molecules, producing many cAMP molecules. Understand this cascade concept.',
        quiz: [
          {
            question:
              'A drug blocks adenylyl cyclase. Which second messenger pathway is directly inhibited?',
            options: [
              'IP₃/DAG pathway',
              'cAMP/PKA pathway',
              'Ca²⁺/calmodulin pathway',
              'Ras/MAPK pathway',
            ],
            correctIndex: 1,
            explanation:
              'Adenylyl cyclase converts ATP to cAMP. Blocking it directly inhibits the cAMP/PKA signaling pathway. The IP₃/DAG pathway uses phospholipase C, and the MAPK pathway uses receptor tyrosine kinases.',
          },
          {
            question:
              'Steroid hormones bind to intracellular receptors rather than surface receptors because:',
            options: [
              'They are too large to bind surface receptors',
              'They are hydrophobic and can pass through the lipid bilayer',
              'Surface receptors are only for peptide hormones',
              'They require ATP to enter the cell',
            ],
            correctIndex: 1,
            explanation:
              'Steroid hormones are derived from cholesterol and are hydrophobic (lipophilic), allowing them to diffuse directly through the phospholipid bilayer to reach intracellular receptors. No ATP or transport protein is required.',
          },
          {
            question:
              'A cell is placed in a hypertonic solution. What happens?',
            options: [
              'Water enters the cell and it swells',
              'Water leaves the cell and it shrinks',
              'No net water movement occurs',
              'Solute enters the cell by active transport',
            ],
            correctIndex: 1,
            explanation:
              'In a hypertonic solution, the solute concentration is higher outside the cell. Water moves out of the cell by osmosis (toward higher solute concentration), causing the cell to shrink (crenation in red blood cells).',
          },
        ],
      },
      {
        id: 'bb_cb_cellcycle',
        title: 'Cell Cycle & Division',
        content: `## The Cell Cycle

### Interphase (90% of cell cycle)

| Phase | Events |
|-------|--------|
| **G₁** | Cell growth, organelle duplication, preparation for DNA synthesis |
| **S** | DNA replication (each chromosome → 2 sister chromatids joined at centromere) |
| **G₂** | Continued growth, preparation for mitosis; centriole duplication |
| **G₀** | Quiescent state — non-dividing (e.g., neurons, muscle cells) |

### Mitosis (M phase) — "PMAT"

| Stage | Events |
|-------|--------|
| **Prophase** | Chromosomes condense; spindle forms; nuclear envelope begins to break down |
| **Metaphase** | Chromosomes align at metaphase plate; spindle fibers attach at kinetochores |
| **Anaphase** | Sister chromatids separate and move to opposite poles |
| **Telophase** | Nuclear envelopes re-form; chromosomes decondense; cytokinesis begins |

**Result:** 2 genetically identical diploid (2n) daughter cells

### Meiosis — "Two Divisions"

- **Meiosis I** (reductional): Homologous chromosomes separate → 2 haploid cells
  - Prophase I: Crossing over (recombination) between homologs
  - Metaphase I: Homologous pairs (tetrads) align at plate → independent assortment
  - Anaphase I: Homologs separate (not sister chromatids)
- **Meiosis II** (equational): Like mitosis — sister chromatids separate
  - Result: 4 genetically unique haploid (n) cells (gametes)

### Cell Cycle Regulation

- **Cyclins** and **CDKs** (cyclin-dependent kinases) drive the cell cycle forward
- **Checkpoints:** G₁/S (DNA damage?), G₂/M (DNA fully replicated?), Spindle checkpoint (all chromosomes attached?)
- **p53** (tumor suppressor): "Guardian of the genome" — arrests cell cycle or triggers apoptosis if DNA damage is detected
- **Rb** (retinoblastoma protein): Inhibits E2F transcription factor; prevents progression from G₁ to S

> **Mnemonic for mitosis stages:** "**P**lease **M**ake **A**nother **T**aco" — Prophase, Metaphase, Anaphase, Telophase.`,
        importantNote:
          'Meiosis I is the reductional division (2n → n) where genetic diversity is generated via crossing over and independent assortment. Meiosis II is essentially mitosis of haploid cells. Non-disjunction at either stage causes aneuploidy (e.g., trisomy 21).',
        quiz: [
          {
            question:
              'At which cell cycle checkpoint is p53 most active in responding to DNA damage?',
            options: ['G₁/S checkpoint', 'Metaphase checkpoint', 'Cytokinesis', 'G₀ entry'],
            correctIndex: 0,
            explanation:
              'p53 is most critical at the G₁/S checkpoint, where it halts the cell cycle in response to DNA damage, allowing repair or triggering apoptosis. This prevents damaged DNA from being replicated in S phase.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Know every organelle\'s function — the MCAT often asks about organelle dysfunction in disease contexts.',
      'The Na⁺/K⁺-ATPase (3 Na⁺ out, 2 K⁺ in) is the most tested pump; it establishes gradients for secondary active transport and nerve impulses.',
      'GPCR signaling: Gαs → ↑cAMP → PKA; Gαq → IP₃ + DAG → Ca²⁺ + PKC; Gαi → ↓cAMP.',
      'Mitosis produces 2 identical diploid cells; meiosis produces 4 unique haploid cells.',
      'Crossing over (prophase I) and independent assortment (metaphase I) generate genetic diversity in meiosis.',
      'Cell cycle regulation: cyclin-CDK complexes drive progression; p53 and Rb are critical tumor suppressors.',
    ],
  },

  // ── Topic 10: Molecular Biology ─────────────────────────────────────────
  bb_molecular: {
    topicId: 'bb_molecular',
    title: 'Molecular Biology',
    domainWeight: '25%',
    overview:
      'Molecular Biology on the MCAT covers the central dogma — DNA replication, transcription, and translation — as well as gene regulation and biotechnology techniques. You must understand how genetic information flows from DNA to RNA to protein, how gene expression is controlled at multiple levels, and how modern laboratory techniques (PCR, gel electrophoresis, CRISPR) are applied in research and medicine.',
    sections: [
      {
        id: 'bb_mb_replication',
        title: 'DNA Replication',
        content: `## The Basics

DNA replication is **semiconservative** — each new double helix contains one parental strand and one newly synthesized strand (demonstrated by Meselson-Stahl experiment).

### Key Enzymes

| Enzyme | Function |
|--------|----------|
| **Helicase** | Unwinds the double helix at the replication fork |
| **Topoisomerase** | Relieves tension/supercoiling ahead of helicase |
| **Primase** | Synthesizes RNA primer (needed to start DNA synthesis) |
| **DNA Polymerase III** | Main replication enzyme; synthesizes DNA 5' → 3'; has 3'→5' proofreading |
| **DNA Polymerase I** | Removes RNA primers and replaces with DNA |
| **Ligase** | Seals nicks (joins Okazaki fragments on lagging strand) |
| **SSB proteins** | Stabilize single-stranded DNA |

### Leading vs. Lagging Strand

- **Leading strand:** Synthesized **continuously** in the 5'→3' direction toward the fork
- **Lagging strand:** Synthesized **discontinuously** in short Okazaki fragments (also 5'→3', but away from the fork); fragments joined by ligase

### Telomeres

- Repetitive sequences (TTAGGG in humans) at chromosome ends
- **Telomerase** (a reverse transcriptase) extends telomeres in stem cells and germ cells
- Somatic cells lack telomerase → telomeres shorten with each division → cellular aging (Hayflick limit)
- Cancer cells often reactivate telomerase → unlimited replication

> **Mnemonic for replication enzymes:** "**H**elicase **U**nzips, **P**rimase **P**rimes, **Pol III P**olymerizes, **Pol I** replaces **P**rimers, **L**igase **L**inks"`,
        examTip:
          'DNA polymerase can ONLY synthesize in the 5\'→3\' direction and REQUIRES a primer. These two constraints explain why the lagging strand needs Okazaki fragments and why RNA primase is essential.',
      },
      {
        id: 'bb_mb_transcription',
        title: 'Transcription & RNA Processing',
        content: `## Transcription (DNA → mRNA)

### Stages

1. **Initiation:** RNA polymerase binds to the **promoter** (TATA box in eukaryotes, with the help of transcription factors). The **template strand** (3'→5') is read.
2. **Elongation:** RNA polymerase synthesizes mRNA in the **5'→3' direction**, using ribonucleoside triphosphates. No primer needed (unlike DNA replication).
3. **Termination:** RNA polymerase reaches a termination signal and releases the mRNA.

### Prokaryotic vs. Eukaryotic Transcription

| Feature | Prokaryotes | Eukaryotes |
|---------|------------|------------|
| RNA polymerase | One type | Three (I, II, III); RNA Pol II makes mRNA |
| Location | Cytoplasm | Nucleus |
| Coupling | Transcription and translation are coupled | Transcription in nucleus, translation in cytoplasm |
| Processing | Minimal | Extensive (capping, splicing, polyadenylation) |

### Eukaryotic mRNA Processing

1. **5' cap:** 7-methylguanosine cap added → protects from degradation, aids ribosome recognition
2. **3' poly-A tail:** ~200 adenines added → protects from degradation, aids nuclear export
3. **Splicing:** Introns removed, exons joined by the **spliceosome** (snRNPs)

**Alternative splicing** allows one gene to produce multiple protein variants by including or excluding different exons. This is why humans have ~20,000 genes but ~100,000+ proteins.

> **Mnemonic:** "**Ex**ons are **Ex**pressed; **In**trons are **In** the trash" — exons stay in the final mRNA; introns are removed.`,
        importantNote:
          'The template strand is read 3\'→5\', and the mRNA is synthesized 5\'→3\'. The coding strand (sense strand) has the same sequence as the mRNA (except T instead of U).',
      },
      {
        id: 'bb_mb_translation',
        title: 'Translation & Post-Translational Modification',
        content: `## Translation (mRNA → Protein)

### The Genetic Code

- **Codons:** 3-nucleotide sequences on mRNA; 64 total codons
- **Start codon:** AUG (methionine) — also signals the beginning of translation
- **Stop codons:** UAA, UAG, UGA — no amino acid; release factors bind instead
- The code is **degenerate** (redundant) — multiple codons can encode the same amino acid
- The code is **universal** — nearly all organisms use the same code (with minor exceptions)

### Components

| Component | Role |
|-----------|------|
| mRNA | Template carrying the genetic message |
| tRNA | Adaptor molecule; carries amino acid + has anticodon |
| Ribosomes | 40S + 60S = 80S (eukaryotic); catalyzes peptide bond formation |
| Aminoacyl-tRNA synthetase | Charges tRNA with correct amino acid (20 types, one per amino acid) |

### Stages of Translation

1. **Initiation:** Small ribosomal subunit binds mRNA at 5' cap; scans for AUG start codon; initiator tRNA (Met-tRNA) binds; large subunit joins
2. **Elongation:** Amino acids are added one at a time
   - **A site:** Aminoacyl (incoming charged tRNA)
   - **P site:** Peptidyl (growing polypeptide chain)
   - **E site:** Exit (empty tRNA leaves)
   - Peptide bond formation catalyzed by **peptidyl transferase** (a ribozyme — the rRNA itself is the catalyst)
3. **Termination:** Stop codon reached → release factor binds A site → polypeptide released → ribosome dissociates

### Post-Translational Modifications

- **Phosphorylation:** Addition of phosphate group (by kinases) — activates/deactivates proteins
- **Glycosylation:** Addition of sugar chains — important for cell surface proteins
- **Ubiquitination:** Tags proteins for degradation by the **proteasome**
- **Proteolytic cleavage:** Removes portions of the polypeptide (e.g., signal peptide, proinsulin → insulin)

> **Mnemonic for stop codons:** "**U** **A**re **A**wful" (UAA), "**U** **A**re **G**one" (UAG), "**U** **G**o **A**way" (UGA).`,
        examTip:
          'Wobble base pairing at the 3rd codon position explains why the genetic code is degenerate — the 3rd position is less strictly paired, allowing one tRNA to recognize multiple codons.',
        quiz: [
          {
            question:
              'During translation, peptide bond formation is catalyzed by:',
            options: [
              'A protein enzyme in the ribosome',
              'The rRNA of the large ribosomal subunit (peptidyl transferase)',
              'Aminoacyl-tRNA synthetase',
              'DNA polymerase',
            ],
            correctIndex: 1,
            explanation:
              'Peptidyl transferase activity resides in the 23S rRNA (prokaryotes) or 28S rRNA (eukaryotes) of the large ribosomal subunit. This makes the ribosome a ribozyme — an RNA molecule with catalytic activity.',
          },
          {
            question:
              'Alternative splicing allows:',
            options: [
              'DNA to be replicated faster',
              'One gene to produce multiple different proteins',
              'Introns to be translated into proteins',
              'Mutations to be corrected before translation',
            ],
            correctIndex: 1,
            explanation:
              'Alternative splicing combines different sets of exons from the same pre-mRNA, producing different mature mRNA variants that encode different protein isoforms. This greatly increases proteome diversity.',
          },
          {
            question:
              'A mutation changes a codon from UAC to UAG. What is the consequence?',
            options: [
              'A different amino acid is incorporated',
              'No change because the genetic code is degenerate',
              'Translation terminates prematurely (nonsense mutation)',
              'The reading frame shifts',
            ],
            correctIndex: 2,
            explanation:
              'UAC codes for tyrosine, but UAG is a stop codon. This change is a nonsense mutation, which introduces a premature stop codon and results in a truncated (shortened) protein.',
          },
        ],
      },
      {
        id: 'bb_mb_genereg_biotech',
        title: 'Gene Regulation & Biotechnology',
        content: `## Gene Regulation

### Prokaryotic Gene Regulation — The Operon Model

**Lac operon** (inducible — normally OFF):
- In the absence of lactose: repressor binds operator → blocks transcription
- When lactose is present: allolactose binds repressor → repressor falls off → transcription occurs
- When glucose is also absent: CAP-cAMP complex binds promoter → enhances transcription (positive regulation)

**Trp operon** (repressible — normally ON):
- When tryptophan is abundant: trp binds repressor → repressor binds operator → blocks transcription
- When tryptophan is scarce: repressor is inactive → transcription proceeds

### Eukaryotic Gene Regulation — Multiple Levels

| Level | Mechanism |
|-------|-----------|
| Epigenetic | DNA methylation (silences genes); histone acetylation (activates genes) |
| Transcriptional | Transcription factors, enhancers, silencers, promoter accessibility |
| Post-transcriptional | Alternative splicing, mRNA stability, miRNA silencing |
| Translational | Initiation factor regulation, mRNA secondary structure |
| Post-translational | Phosphorylation, ubiquitination, proteolytic cleavage |

> **Key concept:** Histone acetylation → loosens chromatin (euchromatin) → gene activation. DNA methylation → tightens chromatin (heterochromatin) → gene silencing.

## Biotechnology

### PCR (Polymerase Chain Reaction)

Amplifies specific DNA sequences exponentially:
1. **Denature** (95°C): Separate DNA strands
2. **Anneal** (55°C): Primers bind to complementary sequences
3. **Extend** (72°C): Taq polymerase synthesizes new DNA

After n cycles: 2ⁿ copies of target sequence

### Gel Electrophoresis

Separates DNA (or proteins) by size:
- DNA migrates toward the **positive electrode** (anode) because DNA is negatively charged
- **Smaller fragments travel farther** through the gel matrix
- Used after restriction enzyme digestion or PCR

### CRISPR-Cas9

A gene-editing tool:
- **Guide RNA (gRNA)** directs Cas9 nuclease to a specific DNA sequence
- Cas9 creates a double-strand break
- The cell repairs the break via NHEJ (error-prone, disrupts gene) or HDR (precise, can insert new sequence)

### Other Techniques

- **Southern blot:** Detects specific DNA sequences (DNA → gel → membrane → probe)
- **Northern blot:** Detects specific RNA
- **Western blot:** Detects specific proteins (using antibodies)

> **Mnemonic:** "**S**NO**W** **D**R**O**P" — **S**outhern = **D**NA, **N**orthern = **R**NA, **W**estern = **P**rotein (alphabetical: D, R, P → S, N, W).`,
        importantNote:
          'DNA methylation and histone modification are forms of epigenetic regulation — they alter gene expression without changing the DNA sequence. These modifications can be inherited across cell divisions.',
        quiz: [
          {
            question:
              'In the lac operon, when both glucose and lactose are present, transcription is:',
            options: [
              'Maximally activated',
              'Low — lactose removes repressor but glucose keeps CAP inactive',
              'Completely silenced',
              'Regulated by the trp repressor',
            ],
            correctIndex: 1,
            explanation:
              'When lactose is present, the repressor is removed (allowing some transcription). However, when glucose is also present, cAMP levels are low, so the CAP-cAMP activator does not bind. The result is low-level transcription. Maximum transcription requires lactose present AND glucose absent.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'DNA replication is semiconservative and proceeds 5\'→3\'. The lagging strand uses Okazaki fragments joined by ligase.',
      'mRNA processing in eukaryotes: 5\' cap + 3\' poly-A tail + splicing (introns out, exons joined). Alternative splicing increases protein diversity.',
      'Translation: AUG starts, UAA/UAG/UGA stop. Peptidyl transferase (rRNA) catalyzes peptide bond formation — the ribosome is a ribozyme.',
      'Lac operon is inducible (OFF → ON by lactose); Trp operon is repressible (ON → OFF by tryptophan).',
      'Epigenetic regulation: acetylation = activation; methylation = silencing.',
      'PCR amplifies DNA exponentially (2ⁿ copies after n cycles). CRISPR-Cas9 enables targeted gene editing.',
    ],
  },

  // ── Topic 11: Organ Systems ─────────────────────────────────────────────
  bb_organ_systems: {
    topicId: 'bb_organ_systems',
    title: 'Organ Systems',
    domainWeight: '25%',
    overview:
      'Organ Systems on the MCAT covers the major physiological systems of the human body: cardiovascular, respiratory, renal, digestive, nervous, endocrine, immune, and musculoskeletal. The MCAT emphasizes how these systems maintain homeostasis and interact with each other. Rather than memorizing every detail, focus on understanding regulatory mechanisms, feedback loops, and how disruption leads to disease.',
    sections: [
      {
        id: 'bb_os_cardio_resp',
        title: 'Cardiovascular & Respiratory Systems',
        content: `## Cardiovascular System

### Heart Anatomy & Circulation

Right atrium → Right ventricle → Pulmonary arteries (to lungs) → Pulmonary veins → Left atrium → Left ventricle → Aorta (to body)

> **Key insight:** Arteries carry blood AWAY from the heart; veins carry blood TO the heart. Pulmonary arteries carry deoxygenated blood; pulmonary veins carry oxygenated blood.

### Cardiac Cycle

- **Systole:** Ventricles contract → blood ejected
- **Diastole:** Ventricles relax → filling occurs
- **Cardiac output (CO) = Heart rate × Stroke volume**
- The SA node (pacemaker) sets the heart rate; AV node delays signal before ventricular contraction

### Blood Pressure

- **Systolic:** Pressure during ventricular contraction
- **Diastolic:** Pressure during ventricular relaxation
- Regulated by baroreceptors (aortic arch, carotid sinus), sympathetic/parasympathetic nervous system, and RAAS

## Respiratory System

### Gas Exchange

Occurs at the **alveoli** — thin-walled air sacs surrounded by capillaries.

- O₂ diffuses from alveoli → blood (binds hemoglobin)
- CO₂ diffuses from blood → alveoli (exhaled)

### Oxygen Transport

- **Hemoglobin (Hb)** carries ~98% of O₂ (4 O₂ per Hb molecule)
- **Oxygen-hemoglobin dissociation curve:** Sigmoidal (cooperative binding)

### Bohr Effect

Factors that SHIFT the curve RIGHT (decrease Hb affinity → release more O₂ to tissues):
- ↑ CO₂, ↑ H⁺ (↓ pH), ↑ temperature, ↑ 2,3-BPG

> **Mnemonic:** "Right shift = **R**elease" — conditions in actively metabolizing tissue (high CO₂, low pH, high temp) cause Hb to release O₂ where it is needed most.

### Breathing Mechanics

- **Inspiration:** Diaphragm contracts (flattens) → thoracic volume increases → intrapulmonary pressure drops → air flows in
- **Expiration (quiet):** Passive — diaphragm relaxes, elastic recoil of lungs
- Regulated by the medulla oblongata (responds to CO₂/pH via central chemoreceptors)`,
        examTip:
          'The Bohr effect is one of the most tested concepts in MCAT physiology. Remember: right shift = release O₂ (helps tissues); left shift = holds O₂ (like fetal hemoglobin, which must grab O₂ from maternal blood).',
      },
      {
        id: 'bb_os_renal_digest',
        title: 'Renal & Digestive Systems',
        content: `## Renal System

### Nephron Structure & Function

| Segment | Function |
|---------|----------|
| **Glomerulus** | Filtration — small molecules pass into Bowman's capsule (GFR ~125 mL/min) |
| **Proximal tubule (PCT)** | Reabsorbs ~65% of filtrate: glucose, amino acids, Na⁺, water, HCO₃⁻ |
| **Loop of Henle (descending)** | Permeable to water (reabsorbs water) → concentrates filtrate |
| **Loop of Henle (ascending)** | Impermeable to water; actively transports Na⁺/K⁺/Cl⁻ out → dilutes filtrate |
| **Distal tubule (DCT)** | Fine-tuning: responds to aldosterone (Na⁺ reabsorption) and PTH (Ca²⁺ reabsorption) |
| **Collecting duct** | Final concentration: ADH increases water permeability → concentrated urine |

### Key Hormones in Renal Function

| Hormone | Source | Action |
|---------|--------|--------|
| **ADH (vasopressin)** | Posterior pituitary | Inserts aquaporins in collecting duct → water reabsorption |
| **Aldosterone** | Adrenal cortex | Increases Na⁺ reabsorption (and K⁺ secretion) in DCT/collecting duct |
| **ANP** | Heart (atria) | Decreases Na⁺ reabsorption → promotes Na⁺ and water excretion |
| **Renin** | Juxtaglomerular cells (kidney) | Activates RAAS → angiotensin II → aldosterone |

### RAAS (Renin-Angiotensin-Aldosterone System)

Low blood pressure → Renin → Angiotensinogen → Angiotensin I → (ACE in lungs) → Angiotensin II → vasoconstriction + aldosterone release → ↑ blood pressure

## Digestive System

| Organ | Key Secretions | Function |
|-------|---------------|----------|
| **Mouth** | Salivary amylase, lingual lipase | Starch and lipid digestion begins |
| **Stomach** | HCl, pepsin (from pepsinogen) | Protein digestion; acidic environment (pH 1.5–3.5) |
| **Pancreas** | Trypsin, chymotrypsin, lipase, amylase, HCO₃⁻ | Digests proteins, fats, carbs; neutralizes chyme |
| **Liver** | Bile (stored in gallbladder) | Emulsifies fats (increases surface area for lipase) |
| **Small intestine** | Brush border enzymes | Final digestion and absorption (duodenum, jejunum, ileum) |
| **Large intestine** | — | Water and electrolyte absorption; houses gut microbiome |

> **Mnemonic for pancreatic enzyme activation:** Enterokinase activates trypsinogen → trypsin, which then activates all other pancreatic zymogens (chymotrypsinogen, proelastase, procarboxypeptidase).`,
        importantNote:
          'The countercurrent multiplier system in the Loop of Henle creates a concentration gradient in the renal medulla, enabling the collecting duct to produce concentrated urine when ADH is present.',
      },
      {
        id: 'bb_os_nervous_endocrine',
        title: 'Nervous & Endocrine Systems',
        content: `## Nervous System

### Divisions

- **Central Nervous System (CNS):** Brain + spinal cord
- **Peripheral Nervous System (PNS):**
  - Somatic (voluntary motor control)
  - Autonomic (involuntary):
    - **Sympathetic** — "fight or flight" (↑HR, ↑BP, dilate pupils, bronchodilation)
    - **Parasympathetic** — "rest and digest" (↓HR, ↑digestion, constrict pupils)

### The Action Potential

1. **Resting potential:** −70 mV (maintained by Na⁺/K⁺-ATPase; K⁺ leak channels)
2. **Depolarization:** Na⁺ channels open → Na⁺ rushes in → membrane becomes positive
3. **Repolarization:** Na⁺ channels inactivate; K⁺ channels open → K⁺ flows out
4. **Hyperpolarization:** Briefly overshoots below −70 mV (absolute refractory period)
5. **Return to resting:** Na⁺/K⁺-ATPase restores gradients

**Saltatory conduction:** In myelinated neurons, the action potential "jumps" between nodes of Ranvier → faster conduction.

### Synapse

Presynaptic neuron releases **neurotransmitters** into synaptic cleft → bind postsynaptic receptors → excitatory (EPSP) or inhibitory (IPSP) response.

## Endocrine System

### Major Hormones

| Gland | Hormone | Function |
|-------|---------|----------|
| **Hypothalamus** | Releasing/inhibiting hormones | Controls anterior pituitary |
| **Anterior pituitary** | GH, TSH, ACTH, FSH, LH, Prolactin | "Master gland" |
| **Posterior pituitary** | ADH, Oxytocin | Water balance, labor/bonding |
| **Thyroid** | T3/T4 | Increases metabolic rate |
| **Parathyroid** | PTH | Increases blood Ca²⁺ |
| **Adrenal cortex** | Cortisol, aldosterone | Stress response, Na⁺ balance |
| **Adrenal medulla** | Epinephrine, norepinephrine | Fight-or-flight |
| **Pancreas** | Insulin (β-cells), Glucagon (α-cells) | Blood glucose regulation |

### Feedback Loops

- **Negative feedback** (most common): Hormone output inhibits further release (e.g., high T3/T4 → inhibits TRH and TSH)
- **Positive feedback** (rare): Output amplifies the signal (e.g., oxytocin during labor, LH surge during ovulation)

> **Mnemonic for anterior pituitary hormones:** "**FLAT PiG**" — FSH, LH, ACTH, TSH, Prolactin, GH`,
        examTip:
          'The action potential and synaptic transmission are extremely high-yield. Know the ion movements at each phase (Na⁺ in during depolarization, K⁺ out during repolarization) and how myelination increases conduction speed.',
        quiz: [
          {
            question:
              'Which hormone would you expect to increase in response to low blood calcium?',
            options: ['Calcitonin', 'PTH (parathyroid hormone)', 'Insulin', 'ADH'],
            correctIndex: 1,
            explanation:
              'PTH is released by the parathyroid glands in response to low blood Ca²⁺. It increases Ca²⁺ by stimulating osteoclast activity (bone resorption), increasing renal Ca²⁺ reabsorption, and activating vitamin D. Calcitonin does the opposite — it lowers blood Ca²⁺.',
          },
          {
            question:
              'During an action potential, depolarization occurs because:',
            options: [
              'K⁺ channels open and K⁺ flows out',
              'Na⁺ channels open and Na⁺ flows in',
              'Cl⁻ channels open and Cl⁻ flows in',
              'The Na⁺/K⁺-ATPase increases its activity',
            ],
            correctIndex: 1,
            explanation:
              'Depolarization is caused by the opening of voltage-gated Na⁺ channels, allowing Na⁺ to rush into the cell down its electrochemical gradient. This makes the membrane potential more positive (from −70 mV toward +30 mV).',
          },
          {
            question:
              'The parasympathetic nervous system is responsible for:',
            options: [
              'Increasing heart rate and dilating bronchioles',
              'Decreasing heart rate and stimulating digestion',
              'Releasing epinephrine from the adrenal medulla',
              'Activating the fight-or-flight response',
            ],
            correctIndex: 1,
            explanation:
              'The parasympathetic nervous system mediates "rest and digest" functions: it slows heart rate (via the vagus nerve), stimulates digestive secretions, and promotes energy storage. The sympathetic nervous system handles fight-or-flight.',
          },
        ],
      },
      {
        id: 'bb_os_immune_musculo',
        title: 'Immune & Musculoskeletal Systems',
        content: `## Immune System

### Innate Immunity (Nonspecific, Fast)

- **Physical barriers:** Skin, mucous membranes, stomach acid
- **Cellular:** Neutrophils, macrophages, NK cells, dendritic cells
- **Chemical:** Complement system, interferons, lysozyme
- **Inflammation:** Redness, heat, swelling, pain (mediated by histamine, prostaglandins)

### Adaptive Immunity (Specific, Slow to Develop, Has Memory)

| Component | Type | Function |
|-----------|------|----------|
| **B cells** | Humoral | Produce antibodies (immunoglobulins); activated by T-helper cells |
| **T-helper cells (CD4⁺)** | Cell-mediated | Activate B cells and cytotoxic T cells; secrete cytokines |
| **Cytotoxic T cells (CD8⁺)** | Cell-mediated | Kill virus-infected and cancer cells (via perforin/granzymes) |
| **Memory cells** | Both B and T | Enable rapid secondary immune response upon re-exposure |

### Antibodies (Immunoglobulins)

| Class | Location | Function |
|-------|----------|----------|
| **IgG** | Blood, tissues | Most abundant; crosses placenta; secondary response |
| **IgM** | Blood | First antibody produced (primary response); pentamer |
| **IgA** | Secretions (saliva, breast milk, mucus) | Mucosal immunity |
| **IgE** | Bound to mast cells/basophils | Allergic reactions, parasitic defense |
| **IgD** | B cell surface | B cell activation |

> **Mnemonic:** "**G**enerally **M**akes **A**cute **E**ffects **D**irectly" — IgG (general/most common), IgM (first/acute), IgA (secretory), IgE (allergy), IgD (B cell surface).

## Musculoskeletal System

### Sliding Filament Model of Muscle Contraction

1. Action potential reaches neuromuscular junction → ACh released
2. Depolarization travels along sarcolemma and down T-tubules
3. Ca²⁺ released from sarcoplasmic reticulum
4. Ca²⁺ binds troponin → tropomyosin moves → exposes myosin-binding sites on actin
5. Myosin heads bind actin (cross-bridge) → power stroke (ATP hydrolysis)
6. Cycle repeats as long as Ca²⁺ and ATP are available

**Sarcomere bands:**
- **A band:** Length of myosin (does NOT change during contraction)
- **I band:** Actin only (SHORTENS during contraction)
- **H zone:** Myosin only (SHORTENS during contraction)
- **Z lines:** Boundaries of sarcomere (move closer together)

> **Mnemonic:** "**H** and **I** **S**horten" — H zone and I band shorten during contraction; A band stays the same.`,
        importantNote:
          'MHC I is present on ALL nucleated cells and presents intracellular antigens to CD8⁺ cytotoxic T cells. MHC II is present only on antigen-presenting cells (APCs: macrophages, dendritic cells, B cells) and presents extracellular antigens to CD4⁺ helper T cells.',
        quiz: [
          {
            question:
              'Which immunoglobulin is the first to be produced during a primary immune response?',
            options: ['IgG', 'IgM', 'IgA', 'IgE'],
            correctIndex: 1,
            explanation:
              'IgM is the first antibody produced during a primary immune response. It is a pentamer (5 Y-shaped units), which makes it effective at agglutination despite lower individual binding affinity. IgG dominates later and in secondary responses.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Cardiovascular: CO = HR × SV; Bohr effect shifts O₂-Hb curve right in active tissues (↑CO₂, ↓pH, ↑temp).',
      'Renal: The nephron filters, reabsorbs, and secretes. ADH controls water reabsorption; aldosterone controls Na⁺; RAAS raises blood pressure.',
      'Nervous system: Action potential = Na⁺ in (depolarization) → K⁺ out (repolarization). Myelin enables saltatory conduction.',
      'Endocrine: Most regulation is via negative feedback. Know the hypothalamic-pituitary axes.',
      'Immune: Innate is fast/nonspecific; adaptive is slow/specific with memory. B cells make antibodies; CD8⁺ T cells kill infected cells.',
      'Muscle contraction: Ca²⁺ binds troponin → tropomyosin moves → actin-myosin cross-bridge cycling. H and I bands shorten; A band stays constant.',
    ],
  },

  // ── Topic 12: Genetics & Evolution ──────────────────────────────────────
  bb_genetics: {
    topicId: 'bb_genetics',
    title: 'Genetics & Evolution',
    domainWeight: '25%',
    overview:
      'Genetics and Evolution on the MCAT covers Mendelian and non-Mendelian inheritance, population genetics (Hardy-Weinberg equilibrium), and evolutionary mechanisms. You must be comfortable with Punnett squares, pedigree analysis, calculating allele frequencies, and understanding natural selection. This topic bridges molecular biology (genotype) with organism-level biology (phenotype) and population-level patterns.',
    sections: [
      {
        id: 'bb_ge_mendelian',
        title: 'Mendelian Genetics',
        content: `## Mendel's Laws

### Law of Segregation
Each individual has two alleles for each gene; during gamete formation, alleles **segregate** so each gamete receives only one allele.

### Law of Independent Assortment
Genes on **different chromosomes** assort independently during meiosis. (Does not apply to linked genes on the same chromosome.)

## Key Crosses

| Cross | Offspring Ratio (Phenotype) |
|-------|---------------------------|
| Aa × Aa (monohybrid) | 3:1 (dominant : recessive) |
| Aa × aa (testcross) | 1:1 |
| AaBb × AaBb (dihybrid) | 9:3:3:1 |

### Pedigree Analysis

| Pattern | Key Clues |
|---------|-----------|
| **Autosomal recessive** | Appears in both sexes equally; affected individuals often have unaffected parents (carriers); skip generations |
| **Autosomal dominant** | Appears in every generation; affected individual has at least one affected parent |
| **X-linked recessive** | More common in males; affected sons have carrier mothers; no male-to-male transmission |
| **X-linked dominant** | Affected father → all daughters affected, no sons affected |
| **Mitochondrial** | Maternal inheritance only; affected mother → all children affected |

### Probability Rules

- **AND (both):** Multiply probabilities (P(A and B) = P(A) × P(B))
- **OR (either):** Add probabilities (P(A or B) = P(A) + P(B)) for mutually exclusive events

> **Mnemonic for X-linked recessive:** "Grandfather → carrier daughter → affected grandson" — the trait appears to skip a generation, passing through carrier females.`,
        examTip:
          'The testcross (cross with homozygous recessive) is the fastest way to determine an unknown genotype. If ALL offspring show the dominant phenotype, the parent is homozygous dominant. If any offspring are recessive, the parent is heterozygous.',
      },
      {
        id: 'bb_ge_nonmendelian',
        title: 'Non-Mendelian Genetics',
        content: `## Exceptions to Simple Mendelian Inheritance

### Incomplete Dominance
Heterozygote shows a **blended** phenotype (e.g., red × white → pink flowers).
- Phenotype ratio: 1 red : 2 pink : 1 white

### Codominance
Both alleles are **fully expressed** simultaneously (e.g., AB blood type — both A and B antigens present).

### Multiple Alleles
More than two alleles exist in the population (e.g., ABO blood type: Iᴬ, Iᴮ, i).

| Genotype | Blood Type | Antigens | Antibodies |
|----------|-----------|----------|------------|
| IᴬIᴬ or Iᴬi | A | A | Anti-B |
| IᴮIᴮ or Iᴮi | B | B | Anti-A |
| IᴬIᴮ | AB | A and B | Neither |
| ii | O | Neither | Anti-A and Anti-B |

### Epistasis
One gene masks the expression of another (e.g., coat color in Labrador retrievers: the E gene determines whether B/b pigment is deposited at all).

### Polygenic Inheritance
Multiple genes contribute to a single trait (e.g., skin color, height). Produces a **continuous, bell-shaped distribution**.

### Pleiotropy
One gene affects **multiple traits** (e.g., sickle cell allele affects blood cells, spleen, joints, brain).

### Linked Genes
Genes on the same chromosome tend to be inherited together. **Recombination frequency** between linked genes is proportional to their physical distance apart (used to create genetic maps; 1% recombination = 1 centiMorgan).

### Sex-Linked Traits
Genes on the X chromosome follow X-linked inheritance. Females can be carriers (heterozygous); males express the trait if they carry one copy (hemizygous).

> **Mnemonic:** "**I**ncomplete = **I**ntermediate blend; **C**odominance = **C**oexistence of both phenotypes fully."`,
        importantNote:
          'The MCAT frequently tests ABO blood typing. Remember: Type O is the universal donor (no antigens → no immune reaction in recipient); Type AB is the universal recipient (no antibodies → won\'t attack any donor blood).',
      },
      {
        id: 'bb_ge_evolution',
        title: 'Population Genetics & Evolution',
        content: `## Hardy-Weinberg Equilibrium

For a population in equilibrium (no evolution occurring):

**p + q = 1** (allele frequencies)
**p² + 2pq + q² = 1** (genotype frequencies)

Where:
- p = frequency of dominant allele
- q = frequency of recessive allele
- p² = frequency of homozygous dominant
- 2pq = frequency of heterozygous
- q² = frequency of homozygous recessive

### Conditions for Hardy-Weinberg Equilibrium

1. No mutation
2. No natural selection
3. No gene flow (migration)
4. No genetic drift (large population)
5. Random mating

If ANY condition is violated, the population is **evolving**.

## Evolutionary Mechanisms

| Mechanism | Description |
|-----------|-------------|
| **Natural selection** | Differential reproductive success based on phenotype |
| **Genetic drift** | Random changes in allele frequency (stronger in small populations) |
| **Gene flow** | Migration of alleles between populations |
| **Mutation** | Source of all new alleles |
| **Sexual selection** | Mate choice based on traits (e.g., peacock tails) |

### Types of Natural Selection

- **Stabilizing:** Favors intermediate phenotype (reduces variation) — e.g., human birth weight
- **Directional:** Favors one extreme phenotype — e.g., antibiotic resistance
- **Disruptive:** Favors both extremes (against intermediate) — e.g., beak size in finches with two seed sizes

### Genetic Drift Effects

- **Founder effect:** Small group colonizes new area → limited genetic diversity
- **Bottleneck effect:** Population crash → surviving individuals have reduced genetic diversity

### Types of Speciation

- **Allopatric:** Geographic isolation leads to divergence
- **Sympatric:** Speciation without geographic isolation (e.g., polyploidy in plants, habitat differentiation)

> **Mnemonic for H-W conditions:** "**M**utant **S**elective **F**lying **D**rifting **M**aters" — the five conditions that, when present, violate Hardy-Weinberg equilibrium.`,
        examTip:
          'To solve Hardy-Weinberg problems, usually start with q². If told 1 in 10,000 people have a recessive condition: q² = 1/10,000 → q = 1/100 → p = 99/100 → carrier frequency (2pq) ≈ 2/100 = 2%.',
        quiz: [
          {
            question:
              'In a population, 16% of individuals show the recessive phenotype. What is the frequency of heterozygous carriers?',
            options: ['0.24', '0.32', '0.48', '0.64'],
            correctIndex: 2,
            explanation:
              'q² = 0.16, so q = 0.4. Then p = 1 − 0.4 = 0.6. Carrier frequency (2pq) = 2(0.6)(0.4) = 0.48, or 48%.',
          },
          {
            question:
              'A small island population of birds experiences a hurricane that kills 90% of the population. The surviving birds have different allele frequencies than the original population. This is an example of:',
            options: [
              'Natural selection',
              'Gene flow',
              'Bottleneck effect',
              'Founder effect',
            ],
            correctIndex: 2,
            explanation:
              'The bottleneck effect is a form of genetic drift that occurs when a large portion of the population is killed by a random event (not related to genotype), leaving survivors with allele frequencies that differ from the original population by chance.',
          },
          {
            question:
              'A couple has a child with cystic fibrosis (autosomal recessive). What is the probability that their next child will be a carrier?',
            options: ['1/4', '1/2', '2/3', '3/4'],
            correctIndex: 1,
            explanation:
              'If both parents are carriers (Aa × Aa) — which they must be, since they have an affected child (aa) — the expected offspring ratio is 1/4 AA : 2/4 Aa : 1/4 aa. The probability of being a carrier (Aa) is 1/2 (or 2/4).',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Mendel\'s laws: segregation (alleles separate in gametes) and independent assortment (different genes sort independently unless linked).',
      'Non-Mendelian patterns: incomplete dominance (blend), codominance (both expressed), epistasis, polygenic, pleiotropy.',
      'ABO blood types: codominance (A and B) and multiple alleles (Iᴬ, Iᴮ, i). Know antigens and antibodies for each type.',
      'Hardy-Weinberg: p² + 2pq + q² = 1. Start with q² (recessive phenotype frequency) and work backward.',
      'Five conditions for H-W equilibrium: no mutation, no selection, no migration, no drift, random mating. Violating any = evolution.',
      'Know the three modes of natural selection: stabilizing, directional, and disruptive.',
    ],
  },

  // ── Topic 13: Biochemistry II ───────────────────────────────────────────
  bb_biochem_2: {
    topicId: 'bb_biochem_2',
    title: 'Biochemistry II — Metabolism',
    domainWeight: '25%',
    overview:
      'Biochemistry II focuses on metabolic pathways: glycolysis, the citric acid (Krebs) cycle, the electron transport chain and oxidative phosphorylation, beta-oxidation of fatty acids, and gluconeogenesis. The MCAT tests your understanding of how these pathways are regulated, interconnected, and integrated with hormonal signals (insulin vs. glucagon). Knowing the net ATP yield and key regulatory enzymes is essential.',
    sections: [
      {
        id: 'bb_bc2_glycolysis',
        title: 'Glycolysis',
        content: `## Overview

**Location:** Cytoplasm
**Input:** 1 glucose (6C)
**Output:** 2 pyruvate (3C) + 2 NADH + 2 ATP (net)

### The 10 Steps (Key Points)

Glycolysis has an **investment phase** (steps 1–5, uses 2 ATP) and a **payoff phase** (steps 6–10, produces 4 ATP + 2 NADH).

### Key Regulatory Enzymes

| Enzyme | Step | Regulation |
|--------|------|-----------|
| **Hexokinase** (or Glucokinase in liver) | 1 | Inhibited by glucose-6-phosphate (product inhibition) |
| **Phosphofructokinase-1 (PFK-1)** | 3 | **Rate-limiting step**; activated by AMP, fructose-2,6-bisphosphate; inhibited by ATP, citrate |
| **Pyruvate kinase** | 10 | Activated by fructose-1,6-bisphosphate; inhibited by ATP, alanine |

### Fates of Pyruvate

| Condition | Pathway | Product |
|-----------|---------|---------|
| Aerobic | Pyruvate dehydrogenase → Acetyl-CoA | Enters Krebs cycle |
| Anaerobic | Lactate dehydrogenase | Lactate (regenerates NAD⁺ for continued glycolysis) |
| Fermentation (yeast) | Pyruvate decarboxylase → alcohol dehydrogenase | Ethanol + CO₂ |

### Pyruvate Dehydrogenase Complex (PDC)

**Pyruvate + NAD⁺ + CoA → Acetyl-CoA + NADH + CO₂**

- Location: Mitochondrial matrix
- Irreversible (commits carbon to Krebs cycle)
- Requires 5 cofactors: TPP, lipoic acid, FAD, NAD⁺, CoA
- Activated by: pyruvate, NAD⁺, CoA
- Inhibited by: acetyl-CoA, NADH, ATP

> **Mnemonic for PDC cofactors:** "**T**he **L**ions **F**ear **N**o **C**ats" — TPP, Lipoic acid, FAD, NAD⁺, CoA.

> **Mnemonic for PFK-1 regulation:** PFK-1 is the "gatekeeper" of glycolysis. Low energy (high AMP) opens the gate; high energy (high ATP, citrate) closes it.`,
        examTip:
          'PFK-1 is the most important regulatory enzyme in all of metabolism. It is the rate-limiting step of glycolysis and integrates signals from the cell\'s energy status (ATP/AMP ratio).',
      },
      {
        id: 'bb_bc2_krebs',
        title: 'Citric Acid (Krebs) Cycle',
        content: `## Overview

**Location:** Mitochondrial matrix
**Input (per acetyl-CoA):** Acetyl-CoA + 3 NAD⁺ + FAD + GDP + Pi + 2 H₂O
**Output (per acetyl-CoA):** 2 CO₂ + 3 NADH + 1 FADH₂ + 1 GTP

Since 1 glucose yields 2 acetyl-CoA, **per glucose through Krebs:**
- 6 NADH, 2 FADH₂, 2 GTP, 4 CO₂

### Key Steps & Regulatory Enzymes

| Enzyme | Reaction | Regulation |
|--------|----------|-----------|
| **Citrate synthase** | Acetyl-CoA + OAA → Citrate | Inhibited by ATP, citrate, NADH |
| **Isocitrate dehydrogenase** | Isocitrate → α-ketoglutarate + CO₂ + NADH | **Rate-limiting**; activated by ADP; inhibited by ATP, NADH |
| **α-Ketoglutarate dehydrogenase** | α-KG → Succinyl-CoA + CO₂ + NADH | Inhibited by succinyl-CoA, NADH, ATP |

### Cycle Steps (Simplified)

Acetyl-CoA + OAA → **Citrate** → Isocitrate → **α-Ketoglutarate** → Succinyl-CoA → **Succinate** → Fumarate → **Malate** → **OAA**

> **Mnemonic:** "**C**itrate **I**s **K**rebs' **S**tarting **S**ubstrate **F**or **M**aking **O**xaloacetate" — Citrate, Isocitrate, α-Ketoglutarate, Succinyl-CoA, Succinate, Fumarate, Malate, Oxaloacetate.

### Anaplerotic Reactions

These **replenish** Krebs cycle intermediates:
- Pyruvate carboxylase: Pyruvate → OAA (activated by acetyl-CoA)
- Amino acid degradation can feed into various cycle intermediates
- These are important because intermediates are constantly being siphoned off for biosynthesis (amino acids, heme, glucose)`,
        importantNote:
          'The Krebs cycle does NOT directly produce much ATP (only 1 GTP per turn). Its main role is to generate NADH and FADH₂, which carry electrons to the ETC for massive ATP production.',
      },
      {
        id: 'bb_bc2_etc',
        title: 'Electron Transport Chain & Oxidative Phosphorylation',
        content: `## Overview

**Location:** Inner mitochondrial membrane
**Purpose:** Use NADH and FADH₂ to generate a proton gradient → drive ATP synthesis

### The Complexes

| Complex | Substrates | Function |
|---------|-----------|----------|
| **Complex I (NADH dehydrogenase)** | NADH → NAD⁺ | Transfers electrons to CoQ; pumps 4 H⁺ |
| **Complex II (Succinate dehydrogenase)** | FADH₂ → FAD | Transfers electrons to CoQ; does NOT pump H⁺ |
| **Complex III (Cytochrome bc₁)** | CoQH₂ → CoQ | Transfers electrons to cytochrome c; pumps 4 H⁺ |
| **Complex IV (Cytochrome c oxidase)** | Cytochrome c → O₂ | Final electron acceptor (O₂ → H₂O); pumps 2 H⁺ |
| **ATP Synthase (Complex V)** | H⁺ gradient | Protons flow back through → drives ATP synthesis (chemiosmosis) |

### Chemiosmotic Theory (Peter Mitchell)

1. Electrons flow through complexes I → III → IV (via CoQ and cytochrome c)
2. Energy released pumps H⁺ from matrix to intermembrane space
3. H⁺ gradient (proton motive force) drives H⁺ back through ATP synthase
4. ATP synthase converts ADP + Pi → ATP

**O₂ is the final electron acceptor** — without O₂, the ETC backs up and ALL aerobic metabolism stops.

### ATP Yield per Glucose (Updated Estimate)

| Source | NADH | FADH₂ | ATP Equivalents |
|--------|------|-------|----------------|
| Glycolysis | 2 NADH | — | ~5 ATP (via malate-aspartate shuttle) or ~3 ATP (via glycerol-3-phosphate shuttle) |
| PDC | 2 NADH | — | ~5 ATP |
| Krebs cycle | 6 NADH | 2 FADH₂ | ~15 + ~3 = ~18 ATP |
| Substrate-level | — | — | 2 ATP (glycolysis) + 2 GTP (Krebs) = 4 ATP |

**Total: ~30–32 ATP per glucose** (depending on the shuttle used for cytoplasmic NADH)

### Uncoupling

**Uncouplers** (e.g., thermogenin/UCP1 in brown fat, dinitrophenol/DNP) create a leak in the inner membrane, allowing H⁺ to bypass ATP synthase. Energy is dissipated as **heat** instead of ATP.

> **Mnemonic for ETC complexes:** "**N**ight **S**hifts **B**ring **C**onstant **A**ches" — NADH dehydrogenase, Succinate dehydrogenase, bc₁, Cytochrome c oxidase, ATP synthase.`,
        examTip:
          'The MCAT often tests ETC inhibitors: Rotenone blocks Complex I, Antimycin A blocks Complex III, Cyanide/CO block Complex IV, and Oligomycin blocks ATP synthase. Know what happens downstream when each is inhibited.',
        quiz: [
          {
            question:
              'Cyanide poisoning inhibits Complex IV of the ETC. The immediate consequence is:',
            options: [
              'Increased NADH oxidation',
              'Continued ATP production by ATP synthase',
              'Backup of electrons → NADH accumulates → aerobic metabolism stops',
              'Increased uncoupling of the proton gradient',
            ],
            correctIndex: 2,
            explanation:
              'If Complex IV is blocked, electrons cannot be passed to O₂. The entire chain backs up, NADH and FADH₂ cannot be reoxidized, NAD⁺ and FAD are depleted, and the Krebs cycle and glycolysis (which require NAD⁺) halt. The cell switches to anaerobic metabolism.',
          },
          {
            question:
              'Which enzyme is the rate-limiting step of the Krebs cycle?',
            options: [
              'Citrate synthase',
              'Isocitrate dehydrogenase',
              'α-ketoglutarate dehydrogenase',
              'Succinate dehydrogenase',
            ],
            correctIndex: 1,
            explanation:
              'Isocitrate dehydrogenase is the rate-limiting enzyme of the Krebs cycle. It is activated by ADP (low energy signal) and inhibited by ATP and NADH (high energy signals).',
          },
          {
            question:
              'The approximate net ATP yield from complete oxidation of one glucose molecule is:',
            options: ['2 ATP', '4 ATP', '30-32 ATP', '38 ATP'],
            correctIndex: 2,
            explanation:
              'The current accepted estimate is ~30-32 ATP per glucose (the older estimate of 36-38 has been revised). This accounts for the energy cost of transporting cytoplasmic NADH into the mitochondria and the actual H⁺/ATP ratio of ATP synthase.',
          },
        ],
      },
      {
        id: 'bb_bc2_fatox_gluconeo',
        title: 'Beta-Oxidation & Gluconeogenesis',
        content: `## Beta-Oxidation of Fatty Acids

**Location:** Mitochondrial matrix (after transport via carnitine shuttle)
**Purpose:** Break down fatty acid chains into acetyl-CoA units

### Steps (Repeated Cycle)

Each round of β-oxidation removes **2 carbons** as acetyl-CoA and produces:
- 1 FADH₂ + 1 NADH + 1 acetyl-CoA

For a 16-carbon fatty acid (palmitate):
- 7 rounds of β-oxidation → 8 acetyl-CoA + 7 FADH₂ + 7 NADH
- Each acetyl-CoA enters Krebs cycle → 3 NADH + 1 FADH₂ + 1 GTP
- **Total ATP from palmitate: ~106 ATP** (after subtracting 2 ATP for initial activation)

### Why Fats Yield More ATP Than Carbohydrates

Fatty acids are more **reduced** (more C−H bonds) than glucose, so they yield more electrons (NADH/FADH₂) per carbon when oxidized.

### Carnitine Shuttle

Long-chain fatty acids cannot cross the inner mitochondrial membrane directly. They must be conjugated to **carnitine** by carnitine palmitoyltransferase I (CPT-I) on the outer membrane, transported across, then released by CPT-II.

- **Malonyl-CoA** (the first committed intermediate of fatty acid synthesis) inhibits CPT-I → prevents β-oxidation when synthesis is active.

## Gluconeogenesis

**Location:** Mainly liver (and some kidney)
**Purpose:** Synthesize glucose from non-carbohydrate precursors during fasting

### Substrates
- Lactate → pyruvate → glucose (Cori cycle)
- Amino acids (especially alanine) → pyruvate or Krebs intermediates
- Glycerol (from fat breakdown) → DHAP → glucose

**Note:** Fatty acids CANNOT be converted to glucose in humans (acetyl-CoA cannot be converted back to pyruvate because PDC is irreversible).

### Key Bypass Enzymes (Gluconeogenesis Replaces 3 Irreversible Glycolysis Steps)

| Glycolysis Enzyme | Gluconeogenesis Bypass |
|-------------------|----------------------|
| Hexokinase/Glucokinase | **Glucose-6-phosphatase** |
| PFK-1 | **Fructose-1,6-bisphosphatase** |
| Pyruvate kinase | **Pyruvate carboxylase + PEP carboxykinase** |

### Hormonal Regulation

| Hormone | Glycolysis | Gluconeogenesis | Glycogen |
|---------|-----------|----------------|----------|
| **Insulin** (fed state) | ↑ Stimulates | ↓ Inhibits | ↑ Synthesis (glycogenesis) |
| **Glucagon** (fasting) | ↓ Inhibits | ↑ Stimulates | ↑ Breakdown (glycogenolysis) |
| **Epinephrine** (stress) | ↑ (in muscle) | ↑ (in liver) | ↑ Breakdown |

> **Key concept:** Glycolysis and gluconeogenesis are reciprocally regulated — when one is active, the other is inhibited. This prevents a "futile cycle."`,
        importantNote:
          'Fatty acids cannot be converted to glucose because acetyl-CoA cannot regenerate pyruvate (the PDC reaction is irreversible, and mammals lack the glyoxylate cycle). This is why prolonged fasting leads to ketogenesis — excess acetyl-CoA from fat breakdown is converted to ketone bodies.',
        quiz: [
          {
            question:
              'During fasting, glucagon stimulates gluconeogenesis in the liver. Which of the following is a substrate for gluconeogenesis?',
            options: ['Acetyl-CoA', 'Fatty acids', 'Lactate', 'Ketone bodies'],
            correctIndex: 2,
            explanation:
              'Lactate (produced by anaerobic metabolism in muscle) is converted to pyruvate by lactate dehydrogenase, then to glucose via gluconeogenesis in the liver (this is the Cori cycle). Acetyl-CoA and fatty acids cannot be converted to glucose in mammals.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Glycolysis: Glucose → 2 pyruvate + 2 ATP + 2 NADH. PFK-1 is the rate-limiting enzyme (activated by AMP, inhibited by ATP).',
      'Krebs cycle: Acetyl-CoA → 2 CO₂ + 3 NADH + 1 FADH₂ + 1 GTP per turn. Isocitrate dehydrogenase is rate-limiting.',
      'ETC: NADH and FADH₂ → proton gradient → ATP synthase → ~30-32 ATP/glucose. O₂ is the final electron acceptor.',
      'Beta-oxidation yields far more ATP per carbon than glucose oxidation because fats are more reduced.',
      'Gluconeogenesis bypasses 3 irreversible glycolytic steps. Fatty acids CANNOT be converted to glucose.',
      'Fed state (insulin) → glycolysis/glycogenesis. Fasting (glucagon) → gluconeogenesis/glycogenolysis.',
    ],
  },

  /* =========================================================================
   * PSYCHOLOGICAL, SOCIAL & BIOLOGICAL FOUNDATIONS (25%)
   * ========================================================================= */

  // ── Topic 14: Behavioral Sciences ───────────────────────────────────────
  ps_behavior: {
    topicId: 'ps_behavior',
    title: 'Behavioral Sciences',
    domainWeight: '25%',
    overview:
      'Behavioral Sciences on the MCAT covers learning, memory, cognition, language, emotion, stress, and personality. This is a content-heavy section requiring familiarity with key psychological theories, researchers, and terminology. The MCAT tests your ability to apply these concepts to novel experimental scenarios, not just recall definitions. Understanding the biological basis of behavior is also critical.',
    sections: [
      {
        id: 'ps_bh_learning',
        title: 'Learning — Classical & Operant Conditioning',
        content: `## Classical Conditioning (Pavlov)

An organism learns to **associate** two stimuli so that one comes to elicit a response originally caused by the other.

### Key Terms

| Term | Definition | Example |
|------|-----------|---------|
| **Unconditioned Stimulus (UCS)** | Naturally triggers a response | Food |
| **Unconditioned Response (UCR)** | Natural, unlearned response to UCS | Salivation to food |
| **Conditioned Stimulus (CS)** | Previously neutral stimulus paired with UCS | Bell |
| **Conditioned Response (CR)** | Learned response to CS | Salivation to bell |

### Key Phenomena

- **Acquisition:** CS + UCS pairing → CR develops
- **Extinction:** CS presented without UCS → CR diminishes
- **Spontaneous recovery:** After extinction, CR temporarily reappears
- **Generalization:** Responding to stimuli similar to CS
- **Discrimination:** Responding only to the specific CS, not similar stimuli

## Operant Conditioning (Skinner)

Learning through **consequences** — behavior is strengthened or weakened by what follows it.

| Type | Effect on Behavior | Example |
|------|-------------------|---------|
| **Positive reinforcement** | ↑ Behavior (add pleasant) | Give treat for sitting |
| **Negative reinforcement** | ↑ Behavior (remove unpleasant) | Seatbelt alarm stops when buckled |
| **Positive punishment** | ↓ Behavior (add unpleasant) | Spanking for misbehavior |
| **Negative punishment** | ↓ Behavior (remove pleasant) | Take away phone for bad grades |

### Schedules of Reinforcement

| Schedule | Description | Response Rate | Resistance to Extinction |
|----------|------------|---------------|------------------------|
| Fixed ratio (FR) | After set number of responses | High, with pauses | Moderate |
| Variable ratio (VR) | After unpredictable number | **Highest, steady** | **Highest** |
| Fixed interval (FI) | After set time period | Scalloped pattern | Low |
| Variable interval (VI) | After unpredictable time | Steady, moderate | High |

> **Mnemonic:** "**R**einforcement **R**aises behavior; **P**unishment **P**ulls it down." Also: Positive = add something; Negative = remove something.

## Other Learning Types

- **Observational learning** (Bandura): Learning by watching others (Bobo doll experiment)
- **Latent learning** (Tolman): Learning without reinforcement that becomes apparent when motivation is provided
- **Insight learning** (Kohler): Sudden realization of a solution`,
        examTip:
          'The MCAT loves to present scenarios and ask you to identify the type of conditioning. Focus on whether behavior INCREASES (reinforcement) or DECREASES (punishment), and whether something is ADDED (positive) or REMOVED (negative).',
      },
      {
        id: 'ps_bh_memory',
        title: 'Memory & Cognition',
        content: `## Memory Models

### Atkinson-Shiffrin Model (Multi-Store)

**Sensory memory → Short-term memory (STM) → Long-term memory (LTM)**

| Store | Capacity | Duration | Transfer Mechanism |
|-------|----------|----------|--------------------|
| Sensory | Large | <1 sec (iconic) to ~3 sec (echoic) | Attention |
| Short-term (working) | 7 ± 2 items | ~20-30 sec without rehearsal | Encoding (rehearsal, elaboration) |
| Long-term | Unlimited | Potentially permanent | Retrieval |

### Types of Long-Term Memory

- **Explicit (Declarative)** — conscious recall
  - **Episodic:** Personal experiences ("I had pizza last Tuesday")
  - **Semantic:** Facts and knowledge ("Paris is the capital of France")
- **Implicit (Non-declarative)** — unconscious
  - **Procedural:** Skills and habits (riding a bike)
  - **Priming:** Prior exposure influences subsequent processing
  - **Conditioning:** Classically conditioned responses

### Memory Processes

- **Encoding:** Converting information into a storable form
  - **Elaborative rehearsal** (deep processing) > maintenance rehearsal (rote repetition)
  - **Self-referential encoding:** Relating information to yourself enhances memory
- **Storage:** Maintaining encoded information
  - **Hippocampus:** Critical for forming new explicit memories (damage → anterograde amnesia)
  - **Amygdala:** Emotional memories
  - **Cerebellum/basal ganglia:** Procedural memories
- **Retrieval:** Accessing stored memories
  - **Recall** (free recall, cued recall) vs. **Recognition** (multiple choice is easier)

### Forgetting

- **Encoding failure:** Never properly stored
- **Decay:** Memory trace fades over time
- **Interference:** Proactive (old interferes with new) vs. Retroactive (new interferes with old)
- **Retrieval failure:** Information is stored but cannot be accessed (tip-of-the-tongue)

> **Mnemonic for interference:** "**Pro**active = **Pro**blem is **old** memories blocking new ones; **Retro**active = **Retro** (new) memories erase old ones."`,
        importantNote:
          'The hippocampus is essential for consolidating short-term memories into long-term memories. Patient H.M. (Henry Molaison) had bilateral hippocampal removal and developed severe anterograde amnesia — he could not form new explicit memories but retained old ones and could learn new procedural skills.',
      },
      {
        id: 'ps_bh_emotion_stress',
        title: 'Emotion, Stress & Personality',
        content: `## Theories of Emotion

| Theory | Sequence | Key Idea |
|--------|----------|----------|
| **James-Lange** | Event → Physiological arousal → Emotion | "I'm afraid because I'm running" |
| **Cannon-Bard** | Event → Simultaneous arousal + emotion | "I run and feel afraid at the same time" |
| **Schachter-Singer (Two-Factor)** | Event → Arousal → Cognitive label → Emotion | "I'm aroused + I see a bear → I must be afraid" |
| **Lazarus (Cognitive Appraisal)** | Event → Appraisal → Emotion + arousal | Cognitive evaluation must come first |

### Stress

**General Adaptation Syndrome (Selye):**
1. **Alarm:** Fight-or-flight response (sympathetic activation, cortisol release)
2. **Resistance:** Body adapts; sustained cortisol elevation
3. **Exhaustion:** Resources depleted; vulnerability to illness

**Types of stressors:** Acute (short-term) vs. chronic (long-term). Chronic stress → immunosuppression, cardiovascular disease, mental health issues.

**Coping strategies:**
- **Problem-focused coping:** Directly address the stressor (study harder for an exam)
- **Emotion-focused coping:** Manage emotional response (meditation, seeking social support)

### Personality

**Big Five (OCEAN):**

| Trait | High | Low |
|-------|------|-----|
| **O**penness | Creative, curious | Conventional, practical |
| **C**onscientiousness | Organized, disciplined | Careless, impulsive |
| **E**xtraversion | Outgoing, energetic | Reserved, solitary |
| **A**greeableness | Cooperative, trusting | Competitive, suspicious |
| **N**euroticism | Anxious, moody | Calm, emotionally stable |

> **Mnemonic:** "**OCEAN**" — the most tested personality model on the MCAT.

### Other Personality Approaches

- **Freud's psychodynamic:** Id (pleasure), ego (reality), superego (morality); defense mechanisms
- **Humanistic (Rogers, Maslow):** Self-actualization, unconditional positive regard
- **Behaviorist (Skinner):** Personality = accumulated learned behaviors
- **Social-cognitive (Bandura):** Reciprocal determinism — behavior, cognition, and environment interact`,
        examTip:
          'The MCAT distinguishes emotion theories by their proposed SEQUENCE. James-Lange: body first, then emotion. Cannon-Bard: both simultaneously. Schachter-Singer: arousal + cognitive label. Know these cold.',
        quiz: [
          {
            question:
              'A student studies for an exam by relating the material to personal experiences. This encoding strategy is called:',
            options: [
              'Maintenance rehearsal',
              'Self-referential encoding',
              'Priming',
              'Chunking',
            ],
            correctIndex: 1,
            explanation:
              'Self-referential encoding involves relating information to oneself, which creates deeper, more meaningful connections and enhances long-term memory formation. It is a form of deep (elaborative) processing.',
          },
          {
            question:
              'In operant conditioning, a variable ratio schedule of reinforcement produces:',
            options: [
              'The slowest response rate',
              'A scalloped response pattern',
              'The highest and most consistent response rate',
              'Rapid extinction when reinforcement stops',
            ],
            correctIndex: 2,
            explanation:
              'Variable ratio (VR) schedules produce the highest, most consistent response rates and are most resistant to extinction because the organism cannot predict which response will be reinforced. Slot machines use this schedule.',
          },
          {
            question:
              'According to the Schachter-Singer two-factor theory of emotion, an emotion is experienced when:',
            options: [
              'Physiological arousal occurs independently of cognition',
              'A cognitive appraisal precedes all physiological responses',
              'Physiological arousal is combined with a cognitive label for that arousal',
              'The thalamus simultaneously sends signals to the cortex and body',
            ],
            correctIndex: 2,
            explanation:
              'The Schachter-Singer two-factor theory proposes that emotion requires BOTH physiological arousal AND a cognitive interpretation (label) of that arousal. Without the cognitive label, one experiences undifferentiated arousal.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Classical conditioning: UCS/UCR are natural; CS/CR are learned through association. Know acquisition, extinction, generalization, discrimination.',
      'Operant conditioning: Positive/negative refer to adding/removing; reinforcement increases behavior, punishment decreases it.',
      'Variable ratio reinforcement produces the highest, most persistent response rates.',
      'Memory: Sensory → STM → LTM. Hippocampus consolidates explicit memories; amygdala handles emotional memory.',
      'Emotion theories: James-Lange (body first), Cannon-Bard (simultaneous), Schachter-Singer (arousal + label), Lazarus (appraisal first).',
      'Big Five personality traits: OCEAN — Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism.',
    ],
  },

  // ── Topic 15: Sensation & Perception ────────────────────────────────────
  ps_perception: {
    topicId: 'ps_perception',
    title: 'Sensation & Perception',
    domainWeight: '25%',
    overview:
      'Sensation and Perception covers how organisms detect stimuli (sensation) and interpret them (perception). The MCAT emphasizes the physiology of vision and hearing, sensory processing pathways, and perceptual phenomena like attention and Gestalt principles. Understanding signal detection theory and Weber\'s law helps explain how we make decisions under sensory uncertainty.',
    sections: [
      {
        id: 'ps_per_vision',
        title: 'Vision',
        content: `## Anatomy of the Eye

| Structure | Function |
|-----------|----------|
| **Cornea** | Refracts (bends) light — primary focusing |
| **Iris/Pupil** | Controls light entry (pupil = opening) |
| **Lens** | Fine-tunes focus (accommodation — changes shape) |
| **Retina** | Contains photoreceptors; converts light to neural signals |
| **Fovea** | Center of retina; highest visual acuity (densely packed cones) |
| **Optic nerve** | Transmits signals to brain; exits at blind spot |

### Photoreceptors

| Type | Function | Location | Light Sensitivity |
|------|----------|----------|------------------|
| **Rods** | Night vision, peripheral vision | Periphery of retina | High (detect dim light) |
| **Cones** | Color vision, fine detail | Concentrated in fovea | Low (need bright light) |

**Trichromatic theory:** Three types of cones (S = blue, M = green, L = red). Color is determined by the relative activation of these three cone types.

**Opponent-process theory:** Cells respond to color pairs: red-green, blue-yellow, black-white. Explains afterimages and why we cannot see "reddish-green."

> Both theories are correct — trichromatic processing occurs at the retinal level; opponent processing occurs at the ganglion cell and LGN level.

### Visual Pathway

Retina → Optic nerve → Optic chiasm (partial crossover) → Lateral Geniculate Nucleus (LGN, thalamus) → Primary visual cortex (V1, occipital lobe)

### Feature Detection

- **Simple cells** (V1): Respond to edges/bars at specific orientations
- **Complex cells:** Respond to moving edges
- **Hypercomplex cells:** Respond to specific shapes/corners

> **Mnemonic:** "**R**ods = **R**oughly see in the dark; **C**ones = **C**olor and **C**larity."`,
        examTip:
          'The MCAT frequently tests the visual pathway. Remember: information from the LEFT visual field goes to the RIGHT occipital cortex (and vice versa) because of the partial crossover at the optic chiasm.',
      },
      {
        id: 'ps_per_hearing',
        title: 'Hearing & Somatosensory',
        content: `## Hearing (Audition)

### Anatomy of the Ear

| Section | Structures | Function |
|---------|-----------|----------|
| **Outer ear** | Pinna, ear canal | Collects and funnels sound waves |
| **Middle ear** | Tympanic membrane + ossicles (malleus, incus, stapes) | Amplifies vibrations; transmits to oval window |
| **Inner ear** | Cochlea (organ of Corti) | Converts vibrations to neural signals (hair cells) |

### How We Hear

Sound waves → Tympanic membrane vibrates → Ossicles amplify → Stapes pushes on oval window → Fluid waves in cochlea → Hair cells on basilar membrane bend → Neural impulse via auditory nerve → Auditory cortex (temporal lobe)

### Pitch Perception

| Theory | Mechanism | Best For |
|--------|-----------|----------|
| **Place theory** | Different locations on basilar membrane respond to different frequencies | High-pitched sounds |
| **Frequency theory** | Rate of neural firing matches sound frequency | Low-pitched sounds (< ~500 Hz) |
| **Volley theory** | Groups of neurons fire in alternating volleys | Mid-range frequencies |

### Sound Localization

- **Interaural time difference:** Sound reaches the closer ear first → localize horizontal position
- **Interaural level difference:** Sound is louder at the closer ear (especially high frequencies)

## Somatosensory System

| Receptor | Detects | Location |
|----------|---------|----------|
| **Meissner's corpuscles** | Light touch, texture | Superficial skin (fingertips) |
| **Pacinian corpuscles** | Deep pressure, vibration | Deep skin, joints |
| **Merkel cells** | Sustained pressure, texture | Superficial skin |
| **Ruffini endings** | Skin stretch | Deep skin |
| **Free nerve endings** | Pain (nociception), temperature | Throughout skin |

### Pain Pathways

- **Fast pain (Aδ fibers):** Sharp, localized, myelinated
- **Slow pain (C fibers):** Dull, diffuse, unmyelinated
- **Gate control theory:** Non-painful input (rubbing an injury) can "close the gate" and reduce pain perception`,
        importantNote:
          'The basilar membrane is tonotopically organized: the BASE (near the oval window) is narrow and stiff → responds to HIGH-frequency sounds; the APEX (far end) is wide and flexible → responds to LOW-frequency sounds. This is counterintuitive — base = high, apex = low.',
      },
      {
        id: 'ps_per_attention',
        title: 'Attention & Perceptual Organization',
        content: `## Signal Detection Theory

Detecting a stimulus depends on BOTH the stimulus intensity AND the observer's decision criteria (bias).

| | Stimulus Present | Stimulus Absent |
|--|-----------------|-----------------|
| **"Yes"** | Hit | False alarm |
| **"No"** | Miss | Correct rejection |

- **Sensitivity (d')** measures the ability to distinguish signal from noise
- **Response bias (β)** reflects the threshold for saying "yes" (conservative vs. liberal criterion)

## Weber's Law

**ΔI/I = k** (constant)

The **just noticeable difference (JND)** between two stimuli is proportional to the magnitude of the original stimulus.

Example: If k = 0.02 for weight, and you are holding 100 g, the JND = 2 g. If holding 500 g, JND = 10 g.

### Absolute Threshold

The minimum stimulus intensity needed to detect a stimulus 50% of the time.

### Difference Threshold

The minimum change in stimulus intensity needed to detect a difference (= JND).

## Gestalt Principles of Perception

| Principle | Description |
|-----------|-------------|
| **Proximity** | Objects near each other are grouped together |
| **Similarity** | Similar objects are grouped together |
| **Continuity** | We perceive smooth, continuous patterns |
| **Closure** | We fill in gaps to perceive complete forms |
| **Figure-ground** | We organize visual field into figure (foreground) and ground (background) |

## Attention

- **Selective attention:** Focusing on one stimulus while ignoring others (cocktail party effect)
- **Divided attention:** Attending to multiple stimuli simultaneously (decreases performance)
- **Inattentional blindness:** Failing to notice a visible stimulus because attention is directed elsewhere (invisible gorilla experiment)
- **Change blindness:** Failing to detect changes in a visual scene

> **Signal detection tip:** The MCAT may present scenarios where a radiologist must detect tumors on X-rays. A conservative criterion (fewer false alarms but more misses) may be dangerous in medical settings.`,
        examTip:
          'Weber\'s law appears frequently on the MCAT. Remember: the JND is a constant RATIO, not a constant amount. Heavier objects require larger absolute changes to notice a difference.',
        quiz: [
          {
            question:
              'A researcher presents a faint tone to participants and asks them to report whether they heard it. A participant says "yes" when no tone was played. This is a:',
            options: ['Hit', 'Miss', 'False alarm', 'Correct rejection'],
            correctIndex: 2,
            explanation:
              'A false alarm occurs when the stimulus is absent but the participant reports detecting it ("yes" + no stimulus). In signal detection theory, this reflects a liberal response bias.',
          },
          {
            question:
              'According to Weber\'s law, if a person can just notice a 1 lb difference when holding 50 lbs, how much weight must be added to 100 lbs for the difference to be noticed?',
            options: ['1 lb', '2 lbs', '5 lbs', '10 lbs'],
            correctIndex: 1,
            explanation:
              'Weber\'s fraction: k = ΔI/I = 1/50 = 0.02. For 100 lbs: ΔI = k × I = 0.02 × 100 = 2 lbs. The JND is proportional to the original stimulus magnitude.',
          },
          {
            question:
              'Which area of the basilar membrane vibrates most in response to a high-frequency sound?',
            options: [
              'The apex (far from oval window)',
              'The base (near the oval window)',
              'The entire membrane vibrates equally',
              'The middle of the membrane',
            ],
            correctIndex: 1,
            explanation:
              'The base of the basilar membrane (near the oval window) is narrow and stiff, making it resonate at high frequencies. The apex is wide and flexible, responding to low frequencies. This tonotopic organization supports place theory.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Vision: Rods = dim light/peripheral; Cones = color/acuity/fovea. Trichromatic theory at the retina, opponent-process at higher levels.',
      'Hearing: Sound → tympanic membrane → ossicles → cochlea → hair cells → auditory nerve. Basilar membrane base = high pitch, apex = low pitch.',
      'Signal detection theory: performance depends on sensitivity (d\') and response bias (β). Know the 2×2 matrix (hit, miss, false alarm, correct rejection).',
      'Weber\'s law: JND = constant ratio (ΔI/I = k). Larger stimuli need larger absolute changes to be noticed.',
      'Gestalt principles (proximity, similarity, continuity, closure, figure-ground) explain how we organize visual information.',
      'Gate control theory: non-painful stimuli can reduce pain perception by "closing the gate" in the spinal cord.',
    ],
  },

  // ── Topic 16: Social Psychology ─────────────────────────────────────────
  ps_social: {
    topicId: 'ps_social',
    title: 'Social Psychology',
    domainWeight: '25%',
    overview:
      'Social Psychology on the MCAT examines how individuals think about, influence, and relate to one another. Key topics include attitudes, conformity, obedience, attribution, group dynamics, and prosocial/antisocial behavior. The MCAT emphasizes classic experiments (Asch, Milgram, Zimbardo) and the cognitive biases that shape social judgment. Understanding these concepts helps explain both everyday social behavior and systemic social phenomena.',
    sections: [
      {
        id: 'ps_sp_attitudes',
        title: 'Attitudes & Persuasion',
        content: `## Attitudes

An attitude is an evaluation (positive, negative, or neutral) of a person, object, or idea. Attitudes have three components:

- **Affective:** Emotional response ("I feel anxious about public speaking")
- **Behavioral:** Actions toward the object ("I avoid speaking in front of groups")
- **Cognitive:** Beliefs about the object ("Public speaking is difficult and embarrassing")

> **Mnemonic:** "**ABC**" — Affective, Behavioral, Cognitive.

### Cognitive Dissonance (Festinger)

When behavior contradicts attitudes, the resulting psychological discomfort (dissonance) motivates attitude change to restore consistency.

**Classic study:** Participants paid $1 (vs. $20) to tell others a boring task was fun. The $1 group reported actually enjoying the task more — insufficient external justification forced them to change their attitude to reduce dissonance.

### Persuasion

**Elaboration Likelihood Model (ELM):**

| Route | When Used | Characteristics |
|-------|-----------|----------------|
| **Central** | High motivation + ability to process | Focus on argument quality; lasting attitude change |
| **Peripheral** | Low motivation or ability | Focus on superficial cues (attractiveness, celebrity endorsement); temporary change |

### Attitude-Behavior Consistency

Attitudes predict behavior better when:
- They are **strong** (formed through direct experience)
- They are **specific** to the behavior in question
- **Social pressures** are minimal
- The attitude is **accessible** (easily recalled)

### Self-Perception Theory (Bem)

When attitudes are weak or ambiguous, we infer them from observing our own behavior — "I must enjoy running because I do it every morning."`,
        examTip:
          'Cognitive dissonance is one of the most tested concepts in Psych/Soc. The key insight: LESS external justification for behavior that contradicts attitudes produces MORE attitude change (because the person must internally justify the behavior).',
      },
      {
        id: 'ps_sp_conformity',
        title: 'Conformity, Obedience & Group Behavior',
        content: `## Conformity

Adjusting behavior or thinking to match a group standard.

### Asch Conformity Experiment

Participants judged line lengths in a group where confederates gave obviously wrong answers. **About 75%** of participants conformed at least once, even though the correct answer was clear.

### Types of Conformity

| Type | Motivation | Belief Change? |
|------|-----------|---------------|
| **Compliance** | Normative influence (desire to fit in) | No (public conformity only) |
| **Identification** | Desire to maintain a relationship | Temporary |
| **Internalization** | Informational influence (belief that group is correct) | Yes (genuine attitude change) |

### Factors Increasing Conformity

- Larger group size (up to ~5 people), unanimous group, high group cohesion, public response, ambiguous task, collectivist culture

## Obedience (Milgram)

Participants administered increasingly severe "electric shocks" to a learner (confederate) when instructed by an authority figure. **65%** delivered the maximum 450V shock.

### Factors Increasing Obedience
- Physical proximity of authority figure
- Perceived legitimacy of authority
- Physical distance from the "victim"
- Gradual escalation ("foot-in-the-door")
- Diffusion of responsibility (others also obeying)

## Group Behavior

| Phenomenon | Description |
|-----------|-------------|
| **Social facilitation** | Performance improves on simple/well-learned tasks in the presence of others; worsens on complex/novel tasks |
| **Social loafing** | Individuals exert less effort in a group than alone |
| **Groupthink** | Desire for group harmony → irrational, poor decision-making (suppress dissent) |
| **Group polarization** | Group discussion strengthens initial attitudes → more extreme positions |
| **Deindividuation** | Loss of self-awareness in groups → reduced self-regulation (Zimbardo's Stanford Prison Experiment) |

> **Key distinction:** Social facilitation = individual performance in front of others. Social loafing = individual effort within a group task. They are different phenomena.`,
        importantNote:
          'The Milgram experiment demonstrated that ordinary people will obey harmful orders from an authority figure. This has profound implications for understanding atrocities — obedience to authority is a powerful social force that can override personal moral judgment.',
      },
      {
        id: 'ps_sp_attribution',
        title: 'Attribution & Interpersonal Phenomena',
        content: `## Attribution Theory

Attribution is the process of explaining the causes of behavior.

### Internal vs. External Attribution

- **Internal (dispositional):** Behavior caused by the person's traits/personality ("She failed because she's lazy")
- **External (situational):** Behavior caused by the situation/environment ("She failed because the exam was unfair")

### Attribution Biases

| Bias | Description |
|------|-------------|
| **Fundamental Attribution Error (FAE)** | Overestimate internal causes for OTHERS' behavior, underestimate situational factors |
| **Self-serving bias** | Attribute own success to internal factors, own failure to external factors |
| **Actor-observer bias** | Attribute own behavior to situations; others' behavior to dispositions |
| **Just-world hypothesis** | Belief that people get what they deserve (can lead to victim-blaming) |

## The Bystander Effect

As the number of bystanders increases, the probability that any individual will help **decreases**. Explained by:

- **Diffusion of responsibility:** Each bystander assumes someone else will help
- **Pluralistic ignorance:** Everyone looks to others for cues; if no one acts, each assumes the situation isn't an emergency

**Kitty Genovese case** (1964) — widely cited example, though the original reporting was somewhat exaggerated.

### Factors Increasing Helping Behavior
- Fewer bystanders
- Clear emergency (unambiguous)
- Perceived similarity between helper and victim
- Personal relationship or empathy
- Prior modeling of helping behavior

## Prejudice, Discrimination & Stereotypes

| Term | Definition |
|------|-----------|
| **Stereotype** | Generalized belief about a group (cognitive) |
| **Prejudice** | Negative attitude toward a group (affective) |
| **Discrimination** | Negative behavior toward a group (behavioral) |

### Reducing Prejudice

- **Contact hypothesis (Allport):** Prejudice decreases when groups interact under conditions of equal status, common goals, intergroup cooperation, and authority support
- **Superordinate goals:** Shared goals that require cooperation between groups (Sherif's Robbers Cave experiment)`,
        examTip:
          'The Fundamental Attribution Error is the most commonly tested attribution bias. Remember: we tend to explain OTHER people\'s behavior with internal/personality explanations while explaining our OWN behavior with situational factors.',
        quiz: [
          {
            question:
              'In Asch\'s conformity experiment, the most important factor that reduced conformity was:',
            options: [
              'Increasing the number of confederates',
              'Having at least one dissenter in the group',
              'Making the task more difficult',
              'Using written instead of verbal responses',
            ],
            correctIndex: 1,
            explanation:
              'Having even one dissenter (ally) dramatically reduced conformity. When unanimity was broken, participants felt more comfortable giving the correct answer. This shows that perceived social support is critical for resisting conformity pressure.',
          },
          {
            question:
              'A student performs poorly on an exam and blames the confusing questions (external attribution). When a classmate performs poorly, the student thinks the classmate didn\'t study enough (internal attribution). This pattern illustrates:',
            options: [
              'Self-serving bias only',
              'Fundamental attribution error only',
              'Both self-serving bias and actor-observer bias',
              'Just-world hypothesis',
            ],
            correctIndex: 2,
            explanation:
              'The student shows self-serving bias (attributing own failure externally) and actor-observer bias (attributing own failure to situation but the classmate\'s failure to disposition). These biases overlap here.',
          },
          {
            question:
              'According to the bystander effect, which situation would most likely result in helping behavior?',
            options: [
              'A crowded subway platform where someone collapses',
              'A person crying in a busy shopping mall',
              'A lone bystander witnessing a car accident on a quiet road',
              'A group of strangers watching someone struggle with heavy bags',
            ],
            correctIndex: 2,
            explanation:
              'With only one bystander, there is no diffusion of responsibility — the sole witness feels full personal responsibility to help. The bystander effect predicts less helping as the number of bystanders increases.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Cognitive dissonance: when behavior contradicts attitudes, less external justification produces more attitude change.',
      'Asch: ~75% conformed at least once. A single dissenter dramatically reduces conformity.',
      'Milgram: ~65% obeyed to max shock. Proximity to authority increases obedience; proximity to victim decreases it.',
      'Fundamental Attribution Error: we over-attribute others\' behavior to personality and under-attribute to situation.',
      'Bystander effect: more bystanders = less individual helping, due to diffusion of responsibility and pluralistic ignorance.',
      'Social facilitation improves performance on simple tasks; social loafing decreases effort in group tasks.',
    ],
  },

  // ── Topic 17: Sociology ─────────────────────────────────────────────────
  ps_sociology: {
    topicId: 'ps_sociology',
    title: 'Sociology',
    domainWeight: '25%',
    overview:
      'Sociology on the MCAT examines how social structures, institutions, and interactions shape behavior and health outcomes. Key frameworks include functionalism, conflict theory, and symbolic interactionism. You need to understand social stratification, the role of culture and institutions, and how sociological concepts apply to healthcare and health disparities. This topic overlaps significantly with the Health Disparities & Ethics topic.',
    sections: [
      {
        id: 'ps_soc_theories',
        title: 'Sociological Theories',
        content: `## The Three Major Perspectives

### Functionalism (Durkheim, Parsons)

Society is a **system of interconnected parts** that work together to maintain stability and social order.

- Each social institution (education, family, religion, government) serves a **function** for society
- **Manifest functions:** Intended, recognized consequences (e.g., education teaches skills)
- **Latent functions:** Unintended, often unrecognized consequences (e.g., education provides socialization and childcare)
- **Social dysfunction:** When an element disrupts social stability

### Conflict Theory (Marx, Weber)

Society is characterized by **inequality and competition** for scarce resources. Power differences between groups (class, race, gender) create conflict that drives social change.

- **Bourgeoisie:** Owning class; controls means of production
- **Proletariat:** Working class; sells labor
- Social institutions serve the interests of **dominant groups**, not society as a whole
- Social change occurs through struggle and revolution

### Symbolic Interactionism (Mead, Goffman)

Society is constructed through **everyday interactions** and the meanings people attach to symbols, gestures, and language.

- **Symbols:** Objects, words, or gestures that carry meaning (e.g., a wedding ring symbolizes commitment)
- **Social construction of reality:** People actively create and negotiate shared meanings through interaction
- **Dramaturgy (Goffman):** Life is like a stage — we manage impressions through front stage (public) and backstage (private) behavior
- **Labeling theory:** Being labeled (e.g., "deviant," "mentally ill") can shape identity and behavior

| Perspective | Focus | Level of Analysis | Key Question |
|------------|-------|-------------------|-------------|
| Functionalism | Social order, stability | Macro | "How does this institution contribute to social stability?" |
| Conflict theory | Power, inequality | Macro | "Who benefits and who is disadvantaged?" |
| Symbolic interactionism | Meaning, interaction | Micro | "How do people create meaning through interaction?" |

> **Mnemonic:** "**F**unction = how it **F**its together; **C**onflict = who has **C**ontrol; **S**ymbolic = what's the **S**ignificance."`,
        examTip:
          'The MCAT may describe a social phenomenon and ask you to identify which sociological perspective is being applied. Focus on the key question each theory asks — functionalism asks about stability, conflict theory asks about power, and symbolic interactionism asks about meaning.',
      },
      {
        id: 'ps_soc_stratification',
        title: 'Social Stratification & Inequality',
        content: `## Social Stratification

The hierarchical arrangement of individuals into categories of power, wealth, and prestige.

### Types of Stratification Systems

| System | Mobility | Example |
|--------|----------|---------|
| **Caste** | None (ascribed status at birth) | Traditional India |
| **Estate/Feudal** | Very limited | Medieval Europe |
| **Class** | Possible (achieved status through education, occupation) | Modern industrialized societies |
| **Meritocracy** | Based on ability and effort | Idealized; rarely exists purely |

### Social Class Components (Weber)

- **Wealth/Property:** Economic assets and income
- **Power:** Ability to influence others (even against resistance)
- **Prestige:** Social respect and status associated with occupation, education, lifestyle

### Social Mobility

- **Intergenerational:** Change in social class between generations (child vs. parent)
- **Intragenerational:** Change within a person's lifetime
- **Upward:** Moving to a higher social class
- **Downward:** Moving to a lower social class

### Poverty

- **Absolute poverty:** Below a fixed minimum standard of living (e.g., unable to meet basic needs)
- **Relative poverty:** Having significantly less than others in the same society

### Intersectionality

Social identities (race, class, gender, sexuality, disability) do not exist independently — they **interact** and create unique experiences of privilege and oppression. A Black woman's experience of discrimination differs from that of a white woman or a Black man.

### Spatial Inequality

- **Residential segregation:** Separation of groups into different neighborhoods
- **Environmental justice:** Disadvantaged communities disproportionately exposed to environmental hazards
- **Food deserts:** Areas with limited access to affordable, nutritious food`,
        importantNote:
          'Social stratification directly affects health outcomes. Lower socioeconomic status (SES) is associated with higher rates of chronic disease, lower life expectancy, reduced healthcare access, and greater exposure to environmental stressors. This is a major MCAT theme.',
      },
      {
        id: 'ps_soc_culture',
        title: 'Culture, Institutions & Socialization',
        content: `## Culture

### Components of Culture

- **Material culture:** Physical objects (technology, art, architecture)
- **Non-material culture:** Ideas, beliefs, values, norms
- **Values:** Shared beliefs about what is good, right, or desirable
- **Norms:** Expected behaviors
  - **Folkways:** Informal norms (table manners, dress code)
  - **Mores:** Strongly held norms with moral significance (honesty, fidelity)
  - **Taboos:** Behaviors considered so extreme they are universally forbidden (incest, cannibalism)
  - **Laws:** Formally codified norms enforced by the state

### Cultural Concepts

| Concept | Definition |
|---------|-----------|
| **Ethnocentrism** | Judging other cultures by the standards of one's own culture |
| **Cultural relativism** | Understanding a culture on its own terms without judgment |
| **Culture shock** | Disorientation when encountering an unfamiliar culture |
| **Subculture** | A group within a larger culture with distinct values/norms |
| **Counterculture** | A subculture that actively opposes dominant culture values |

## Social Institutions

Major institutions and their functions:

| Institution | Function |
|------------|----------|
| **Family** | Socialization, emotional support, reproduction |
| **Education** | Knowledge transmission, social placement, socialization |
| **Religion** | Meaning/purpose, social cohesion, moral framework |
| **Government** | Order, law, resource distribution |
| **Economy** | Production and distribution of goods/services |
| **Healthcare** | Maintenance of health, treatment of illness |

## Socialization

The lifelong process of learning social norms, values, and roles.

### Agents of Socialization

- **Family:** Primary agent (early childhood)
- **Peers:** Increasingly important in adolescence
- **Education:** Formal transmission of knowledge and hidden curriculum (social norms)
- **Media:** Shapes perceptions, values, and consumer behavior
- **Religion:** Provides moral framework and community

> **Key concept:** **Anticipatory socialization** — preparing for future roles (e.g., medical students learning to "think like a doctor" before becoming one).`,
        examTip:
          'The MCAT tests cultural concepts in healthcare contexts. Ethnocentrism in medicine can lead to misunderstanding patients from different cultural backgrounds. Cultural competence — understanding and respecting cultural differences — is a key theme.',
        quiz: [
          {
            question:
              'A functionalist sociologist would most likely argue that education serves society by:',
            options: [
              'Reproducing social inequality by favoring the wealthy',
              'Teaching skills and socializing citizens to maintain social stability',
              'Giving individuals a platform to challenge existing power structures',
              'Creating symbolic meaning through classroom interactions',
            ],
            correctIndex: 1,
            explanation:
              'Functionalism views education as serving a function for social stability — transmitting knowledge, socializing citizens, and sorting individuals into social roles. Option A reflects conflict theory, C is also conflict theory, and D reflects symbolic interactionism.',
          },
          {
            question:
              'According to conflict theory, the healthcare system primarily:',
            options: [
              'Functions to maintain population health and social stability',
              'Creates shared meaning through doctor-patient interactions',
              'Reflects and reinforces existing social inequalities in access and quality of care',
              'Exists as a result of cultural evolution and shared values',
            ],
            correctIndex: 2,
            explanation:
              'Conflict theory focuses on power and inequality. It would argue that the healthcare system reflects broader social inequalities — those with more resources receive better care, while disadvantaged groups face barriers to access.',
          },
          {
            question:
              'A medical student who begins dressing more professionally and using clinical language before starting clinical rotations is demonstrating:',
            options: [
              'Cultural relativism',
              'Anticipatory socialization',
              'Deindividuation',
              'Role strain',
            ],
            correctIndex: 1,
            explanation:
              'Anticipatory socialization is the process of adopting the behaviors, norms, and values of a role one expects to occupy in the future. The student is preparing for the physician role before formally assuming it.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Three sociological perspectives: Functionalism (stability/order), Conflict theory (power/inequality), Symbolic interactionism (meaning/interaction).',
      'Social stratification: class (wealth, power, prestige) determines life chances. Weber\'s three components are key.',
      'Intersectionality: overlapping social identities create unique experiences of privilege and oppression.',
      'Culture includes values, norms (folkways, mores, taboos, laws), and material artifacts. Know ethnocentrism vs. cultural relativism.',
      'Social institutions (family, education, religion, government, economy, healthcare) serve functions that maintain society.',
      'Socialization is lifelong — agents include family, peers, education, media, and religion.',
    ],
  },

  // ── Topic 18: Self & Identity ───────────────────────────────────────────
  ps_identity: {
    topicId: 'ps_identity',
    title: 'Self & Identity',
    domainWeight: '25%',
    overview:
      'Self and Identity on the MCAT covers how individuals develop and maintain a sense of self, the role of social identity, and developmental theories of identity formation. Key concepts include self-concept, self-esteem, self-efficacy, social identity theory, and Erikson\'s stages of psychosocial development. Understanding stigma and its effects on identity and health is also crucial for this section.',
    sections: [
      {
        id: 'ps_id_selfconcept',
        title: 'Self-Concept & Self-Esteem',
        content: `## Self-Concept

**Self-concept** is the collection of beliefs and perceptions one has about oneself. It includes:

- **Self-schema:** Cognitive frameworks about the self that organize and guide processing of self-relevant information
- **Possible selves:** Representations of what we could become (ideal self, feared self)
- **Self-complexity:** The number of distinct self-aspects a person has (higher complexity → more resilient to stress)

### Components of Self-Concept

| Component | Description |
|-----------|-------------|
| **Self-image** | How we describe ourselves (roles, traits, physical characteristics) |
| **Self-esteem** | How we evaluate ourselves (positive or negative self-worth) |
| **Ideal self** | Who we want to be |

### Discrepancy Theory (Higgins)

- **Actual self vs. ideal self** discrepancy → feelings of sadness, disappointment, depression
- **Actual self vs. ought self** discrepancy → feelings of anxiety, guilt, shame

## Self-Esteem

**Self-esteem** is the evaluative component of self-concept — one's overall sense of self-worth.

### Factors Affecting Self-Esteem

- **Social comparison:** Comparing ourselves to others (upward comparison → lower self-esteem; downward comparison → higher self-esteem)
- **Reflected appraisal:** Incorporating how we believe others see us (Cooley's "looking-glass self")
- **Self-serving bias:** Attributing success internally, failure externally → protects self-esteem

## Self-Efficacy (Bandura)

**Self-efficacy** is the belief in one's ability to succeed in specific situations. It differs from self-esteem:
- Self-esteem = "Am I a good person?"
- Self-efficacy = "Can I do this specific task?"

High self-efficacy → more likely to attempt challenging tasks, persist through difficulty, and recover from setbacks.

### Sources of Self-Efficacy

1. **Mastery experiences:** Past successes (strongest source)
2. **Vicarious experiences:** Observing similar others succeed
3. **Verbal persuasion:** Encouragement from others
4. **Physiological states:** Calm arousal → higher efficacy; anxiety → lower efficacy

> **Mnemonic:** "Looking-glass self" (Cooley) = we see ourselves as reflected in others' reactions to us. Like looking in a social mirror.`,
        examTip:
          'The MCAT distinguishes self-concept (description), self-esteem (evaluation), and self-efficacy (task-specific confidence). Know the difference — they appear in different question contexts.',
      },
      {
        id: 'ps_id_social',
        title: 'Social Identity & Erikson\'s Stages',
        content: `## Social Identity Theory (Tajfel & Turner)

Part of our self-concept derives from our membership in social groups (race, gender, religion, profession, nationality).

### Key Processes

1. **Social categorization:** Classifying people into groups (in-group vs. out-group)
2. **Social identification:** Adopting the identity and norms of groups we belong to
3. **Social comparison:** Comparing our in-group favorably against out-groups → enhances self-esteem

### In-Group / Out-Group Dynamics

- **In-group bias (favoritism):** Preference for members of one's own group
- **Out-group homogeneity:** Perceiving out-group members as more similar to each other than they actually are ("They're all the same")
- **Ethnocentrism:** Judging out-groups by in-group standards

## Erikson's Stages of Psychosocial Development

| Stage | Age | Crisis | Key Theme |
|-------|-----|--------|-----------|
| 1 | 0–1 | Trust vs. Mistrust | Caregiver reliability → trust |
| 2 | 1–3 | Autonomy vs. Shame/Doubt | Independence in activities |
| 3 | 3–6 | Initiative vs. Guilt | Asserting control, leadership |
| 4 | 6–12 | Industry vs. Inferiority | Competence through school/peers |
| 5 | 12–18 | **Identity vs. Role Confusion** | "Who am I?" → core identity |
| 6 | 18–40 | Intimacy vs. Isolation | Forming close relationships |
| 7 | 40–65 | Generativity vs. Stagnation | Contributing to next generation |
| 8 | 65+ | Integrity vs. Despair | Reflecting on life with satisfaction or regret |

### Stage 5 (Identity vs. Role Confusion) — Most Tested

During adolescence, individuals explore different roles, values, and beliefs to form a coherent identity. Failure → role confusion (uncertainty about one's place in society).

**Marcia's Identity Statuses** (extension of Erikson):

| Status | Exploration? | Commitment? | Description |
|--------|-------------|------------|-------------|
| **Identity diffusion** | No | No | No direction, no commitment |
| **Foreclosure** | No | Yes | Commitment without exploration (adopted parents' values) |
| **Moratorium** | Yes | No | Actively exploring, no commitment yet |
| **Identity achievement** | Yes | Yes | Explored and committed to an identity |

> **Mnemonic for Erikson:** "**T**rusting **A**utonomous kids take **I**nitiative in **I**ndustry to find their **I**dentity, build **I**ntimacy, show **G**enerativity, and achieve **I**ntegrity."`,
        importantNote:
          'Erikson\'s stages are the most tested developmental model on the MCAT Psych/Soc section. The Stage 5 identity crisis (adolescence) and Stage 6 intimacy crisis (young adulthood) are especially high-yield.',
      },
      {
        id: 'ps_id_stigma',
        title: 'Stigma & Its Effects',
        content: `## Stigma

**Stigma** is a socially constructed label that marks an individual as different, deviant, or less desirable. It leads to stereotyping, discrimination, and social exclusion.

### Goffman's Types of Stigma

| Type | Description | Example |
|------|-----------|---------|
| **Physical/bodily** | Visible physical differences | Disability, disfigurement |
| **Character** | Perceived character flaws | Mental illness, addiction, criminal record |
| **Tribal/group** | Membership in a devalued social group | Race, religion, nationality |

### Stigma Mechanisms

- **Labeling:** Applying a category to someone ("schizophrenic" vs. "person with schizophrenia")
- **Stereotyping:** Associating negative attributes with the label
- **Separation:** Creating an "us vs. them" distinction
- **Status loss:** Devaluation in social hierarchy
- **Discrimination:** Unfair treatment based on stigmatized identity

### Effects of Stigma on Health

1. **Reduced help-seeking:** Stigma around mental illness → people avoid treatment
2. **Stress:** Chronic stigma exposure → allostatic load → physical health consequences
3. **Internalized stigma (self-stigma):** Accepting negative stereotypes about one's own group → lower self-esteem, hopelessness
4. **Stereotype threat (Steele):** Awareness of a negative stereotype about one's group → anxiety → decreased performance on stereotype-relevant tasks

### Stereotype Threat

When individuals are made aware of a negative stereotype about their group, they experience anxiety that can **impair performance** on tasks related to that stereotype — even without actual discrimination occurring.

**Classic study (Steele & Aronson):** When African American students were told a test measured intellectual ability, they performed worse than when the same test was described as non-diagnostic. The mere awareness of the stereotype was sufficient to impair performance.

### Managing Stigma

- **Concealment:** Hiding the stigmatized identity (e.g., not disclosing mental health diagnosis)
- **Disclosure:** Selectively sharing with trusted others
- **Activism/advocacy:** Challenging the stigma publicly (e.g., mental health awareness campaigns)
- **In-group support:** Finding community among others with similar experiences

> **Key healthcare implication:** Medical students and physicians must be aware of how stigma affects patient behavior — patients may avoid seeking care, withhold information, or not adhere to treatment due to fear of judgment.`,
        examTip:
          'Stereotype threat is highly tested on the MCAT. Remember: it does not require any actual discrimination — merely being aware of a relevant negative stereotype can impair performance through anxiety and cognitive load.',
        quiz: [
          {
            question:
              'According to Erikson, the primary psychosocial crisis during adolescence is:',
            options: [
              'Autonomy vs. Shame and Doubt',
              'Industry vs. Inferiority',
              'Identity vs. Role Confusion',
              'Intimacy vs. Isolation',
            ],
            correctIndex: 2,
            explanation:
              'Erikson\'s Stage 5 (adolescence, ages 12-18) centers on Identity vs. Role Confusion. Adolescents explore different roles, beliefs, and values to develop a coherent sense of self. Failure leads to role confusion and uncertainty about one\'s identity.',
          },
          {
            question:
              'A student who has never explored career options but has committed to becoming a doctor because their parents are doctors is in Marcia\'s identity status of:',
            options: [
              'Identity achievement',
              'Moratorium',
              'Foreclosure',
              'Identity diffusion',
            ],
            correctIndex: 2,
            explanation:
              'Foreclosure occurs when an individual has committed to an identity without actively exploring alternatives. They have adopted the identity prescribed by others (typically parents) without questioning or considering other possibilities.',
          },
          {
            question:
              'Stereotype threat most directly impairs performance through which mechanism?',
            options: [
              'Actual discrimination by evaluators',
              'Lower intelligence due to group membership',
              'Anxiety and cognitive load from awareness of the negative stereotype',
              'Reduced access to educational resources',
            ],
            correctIndex: 2,
            explanation:
              'Stereotype threat impairs performance through increased anxiety and cognitive load — mental resources that could be used for the task are instead consumed by worrying about confirming the stereotype. No actual discrimination or difference in ability is involved.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Self-concept = description of self; self-esteem = evaluation of self-worth; self-efficacy = belief in task-specific ability.',
      'Social identity theory: self-concept partly derives from group memberships. In-group bias and out-group homogeneity are key dynamics.',
      'Erikson\'s 8 stages of psychosocial development: Stage 5 (Identity vs. Role Confusion) is the most tested.',
      'Marcia\'s identity statuses: diffusion, foreclosure, moratorium, achievement — based on exploration and commitment.',
      'Stigma reduces help-seeking, increases chronic stress, and can lead to internalized negative stereotypes.',
      'Stereotype threat: awareness of a negative group stereotype → anxiety → impaired performance, even without discrimination.',
    ],
  },

  // ── Topic 19: Health Disparities & Ethics ───────────────────────────────
  ps_health: {
    topicId: 'ps_health',
    title: 'Health Disparities & Ethics',
    domainWeight: '25%',
    overview:
      'Health Disparities and Ethics covers the social determinants of health, healthcare access inequality, and the ethical principles that guide medical practice and research. The MCAT emphasizes how socioeconomic status, race, geography, and other social factors create systematic differences in health outcomes. Understanding bioethics principles (autonomy, beneficence, justice, non-maleficence) and research ethics is essential for the Psych/Soc section.',
    sections: [
      {
        id: 'ps_he_disparities',
        title: 'Social Determinants of Health',
        content: `## Health Disparities

Health disparities are **systematic, avoidable differences** in health outcomes between social groups. They are driven by social, economic, and environmental conditions rather than individual choices alone.

### Key Social Determinants of Health

| Determinant | Effect on Health |
|-------------|-----------------|
| **Socioeconomic status (SES)** | Lower SES → higher rates of chronic disease, lower life expectancy, worse mental health |
| **Education** | More education → better health literacy, more preventive care, higher income |
| **Race/ethnicity** | Structural racism → unequal access, implicit bias in care, environmental exposure |
| **Geography** | Rural areas → fewer healthcare facilities, longer travel, fewer specialists |
| **Gender** | Different disease patterns; gender-based violence; disparities in research |
| **Immigration status** | Barriers to insurance, fear of deportation, language barriers |

### The SES-Health Gradient

The relationship between SES and health is a **gradient**, not a threshold — health improves at EVERY step up the socioeconomic ladder, not just above a poverty line. This suggests that relative position in the social hierarchy matters, not just absolute deprivation.

### Mechanisms Linking SES to Poor Health

1. **Material factors:** Inability to afford healthy food, safe housing, healthcare
2. **Behavioral factors:** Higher smoking rates, less exercise (constrained by environment, not just choice)
3. **Psychosocial stress:** Chronic stress from financial insecurity, discrimination → allostatic load
4. **Healthcare access:** Uninsured/underinsured → delayed care, less preventive care
5. **Environmental exposure:** Lower SES communities exposed to more pollution, lead, unsafe conditions

### Health Literacy

The ability to understand and use health information to make informed decisions. Low health literacy is associated with:
- Poorer health outcomes
- Higher hospitalization rates
- Lower medication adherence
- Less use of preventive services

> **Key concept:** Health disparities are driven by **social structures**, not just individual behavior. Addressing them requires systemic change, not just telling people to make better choices.`,
        examTip:
          'The MCAT frames health disparities as a social justice issue. When a question describes worse health outcomes in a specific population, look for social/structural explanations (access, SES, discrimination) rather than individual blame.',
      },
      {
        id: 'ps_he_access',
        title: 'Healthcare Access & Inequality',
        content: `## Barriers to Healthcare Access

### Types of Barriers

| Barrier Type | Examples |
|-------------|---------|
| **Financial** | Lack of insurance, high copays/deductibles, inability to take time off work |
| **Geographic** | Rural health deserts, long distances to facilities, lack of public transportation |
| **Cultural/linguistic** | Language barriers, cultural misunderstandings, distrust of medical system |
| **Structural/systemic** | Implicit bias among providers, institutional racism, lack of diverse workforce |
| **Knowledge** | Low health literacy, unawareness of available services, medical jargon |

### Healthcare Utilization Models

**Andersen's Behavioral Model:**
Three factors predict healthcare use:
1. **Predisposing factors:** Demographics, beliefs, social structure
2. **Enabling factors:** Insurance, income, community resources
3. **Need factors:** Perceived and evaluated health status

### The Inverse Care Law

Those who most need medical care are **least likely** to receive it — populations with the highest burden of disease tend to have the worst healthcare access.

### Implicit Bias in Healthcare

- Healthcare providers may harbor **unconscious biases** based on race, gender, weight, age, or SES
- Studies show implicit bias leads to:
  - Differential pain management (Black patients receive less pain medication)
  - Communication differences (less time, less shared decision-making)
  - Lower referral rates for advanced treatments
- **Reducing implicit bias:** Awareness training, standardized protocols, diverse workforce, counter-stereotyping exercises

### Cultural Competence in Healthcare

The ability to understand, respect, and effectively interact with patients from diverse cultural backgrounds. Includes:
- Awareness of one's own cultural biases
- Knowledge of patients' cultural health beliefs
- Cross-cultural communication skills
- Use of professional interpreters when needed
- Institutional policies supporting diversity

> **Key concept:** Access to healthcare is necessary but not sufficient — the QUALITY of care received also varies by social group, contributing to disparities.`,
        importantNote:
          'Historical medical abuses (Tuskegee syphilis study, forced sterilizations, Henrietta Lacks) have created legitimate distrust of the medical system in minority communities. Understanding this history is essential for addressing current disparities.',
      },
      {
        id: 'ps_he_bioethics',
        title: 'Bioethics & Research Ethics',
        content: `## Principles of Bioethics (Beauchamp & Childress)

| Principle | Definition | Clinical Example |
|-----------|-----------|-----------------|
| **Autonomy** | Respecting the patient's right to make their own informed decisions | Informed consent; right to refuse treatment |
| **Beneficence** | Acting in the patient's best interest | Prescribing effective treatment |
| **Non-maleficence** | "Do no harm" — avoiding unnecessary harm | Weighing risks vs. benefits of a procedure |
| **Justice** | Fair distribution of healthcare resources; treating similar cases equally | Organ allocation policies; triage |

### Ethical Concepts in Clinical Practice

- **Informed consent:** Patient must understand the treatment, alternatives, risks, and benefits before agreeing. Requires capacity (understanding + appreciation + reasoning + choice).
- **Confidentiality:** Patient information is private. Exceptions: danger to self or others, mandated reporting (child/elder abuse), public health threats.
- **Paternalism:** Overriding patient autonomy "for their own good" — generally considered ethically problematic.
- **Advance directives:** Written instructions for future care if the patient becomes incapacitated (living will, healthcare proxy).
- **End-of-life issues:** DNR orders, hospice care, physician-assisted death (legal in some states).

## Research Ethics

### Historical Context

- **Tuskegee Syphilis Study (1932–1972):** U.S. Public Health Service studied untreated syphilis in Black men without informed consent and withheld treatment even after penicillin became available. Led to the Belmont Report.
- **Nuremberg Code (1947):** Established informed consent as essential in research, after Nazi human experiments.

### The Belmont Report (1979)

| Principle | Definition | Application |
|-----------|-----------|-------------|
| **Respect for persons** | Individuals are autonomous; protect vulnerable populations | Informed consent |
| **Beneficence** | Maximize benefits, minimize risks | Risk-benefit analysis |
| **Justice** | Fair selection of research subjects; equitable distribution of burdens and benefits | Don't exploit vulnerable groups |

### Institutional Review Board (IRB)

- Reviews and approves all research involving human subjects
- Ensures informed consent, confidentiality, minimized risk, and equitable subject selection
- Provides ongoing oversight during the study

### Key Research Ethics Concepts

- **Voluntary participation:** No coercion; participants can withdraw at any time
- **Informed consent:** Full disclosure of procedures, risks, benefits, and right to withdraw
- **Deception:** May be used only when necessary and when debrief is provided afterward
- **Confidentiality:** Protecting participant data and identity
- **Vulnerable populations:** Extra protections for children, prisoners, pregnant women, cognitively impaired individuals

> **Key takeaway:** Modern research ethics exist because of historical abuses. The Belmont Report's three principles (respect for persons, beneficence, justice) guide all human subjects research today.`,
        examTip:
          'When the MCAT presents an ethical dilemma, identify which bioethical principle is in conflict. Most questions involve autonomy (patient wants X) vs. beneficence/non-maleficence (physician thinks Y is better). Generally, autonomy is prioritized for competent adult patients.',
        quiz: [
          {
            question:
              'A patient with stage IV cancer refuses chemotherapy after being fully informed of the diagnosis, prognosis, treatment options, and risks. The physician should:',
            options: [
              'Override the patient\'s decision to protect their health (beneficence)',
              'Respect the patient\'s decision because they have the right to refuse treatment (autonomy)',
              'Discharge the patient from their practice',
              'Consult the hospital ethics committee to override the patient\'s wishes',
            ],
            correctIndex: 1,
            explanation:
              'A competent adult who has been fully informed has the right to refuse treatment, even life-saving treatment. Respecting autonomy is the ethical obligation here. Overriding the decision would be paternalistic.',
          },
          {
            question:
              'The Tuskegee syphilis study violated which principle of the Belmont Report most egregiously?',
            options: [
              'Only respect for persons',
              'Only justice',
              'All three principles: respect for persons, beneficence, and justice',
              'Only beneficence',
            ],
            correctIndex: 2,
            explanation:
              'The Tuskegee study violated all three Belmont principles: respect for persons (no informed consent, deception about treatment), beneficence (withheld known effective treatment), and justice (exploitation of a vulnerable, disadvantaged racial group).',
          },
          {
            question:
              'Which social determinant has the strongest gradient-like relationship with health outcomes?',
            options: [
              'Blood type',
              'Genetic predisposition',
              'Socioeconomic status (SES)',
              'Eye color',
            ],
            correctIndex: 2,
            explanation:
              'SES has a well-documented gradient relationship with health — health improves incrementally with each step up the socioeconomic ladder. This relationship persists even after controlling for healthcare access and individual behaviors.',
          },
          {
            question:
              'An IRB reviewing a research protocol is primarily concerned with ensuring:',
            options: [
              'The research will produce statistically significant results',
              'The research is funded by a reputable institution',
              'The rights and welfare of human subjects are protected',
              'The research uses the most advanced methodology available',
            ],
            correctIndex: 2,
            explanation:
              'The IRB\'s primary mandate is protecting the rights and welfare of human research participants. This includes reviewing informed consent procedures, risk-benefit ratios, confidentiality protections, and equitable subject selection.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Health disparities are systematic, avoidable differences in health outcomes driven by social determinants (SES, race, geography, education).',
      'The SES-health gradient: health improves at EVERY step up the socioeconomic ladder, not just above poverty.',
      'Healthcare access barriers include financial, geographic, cultural/linguistic, and structural factors. Implicit bias affects quality of care.',
      'Four bioethics principles: Autonomy, Beneficence, Non-maleficence, Justice. Autonomy generally takes priority for competent adults.',
      'Belmont Report principles (respect for persons, beneficence, justice) guide all human subjects research. IRBs enforce these standards.',
      'Historical abuses (Tuskegee, Nuremberg) created modern research ethics frameworks. Understanding this history is essential.',
    ],
  },
};

export function getMCATCourseContent(topicId: string): TopicLesson | null {
  return MCAT_COURSE[topicId] || null;
}

export function hasMCATCourseContent(topicId: string): boolean {
  return topicId in MCAT_COURSE;
}

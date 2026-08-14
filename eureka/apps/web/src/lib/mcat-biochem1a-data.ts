/**
 * MCAT Biochemistry I chapters — water, amino acids, protein structure, protein binding.
 * Split verbatim out of mcat-course-data.ts; chapter plan in docs/mcat/BIOCHEM_CHAPTERS.md.
 * Depth pass benchmarked against a standard biochemistry textbook (concept coverage only;
 * all prose original). AI-generated. Requires SME review.
 */

import type { TopicLesson } from './mcat-course-data';

export const MCAT_BIOCHEM1A_LESSONS: Record<string, TopicLesson> = {
  // ── Biochemistry I.1: Water, pH, and the chemistry of life ──────────────
  cpb1_water: {
    topicId: 'cpb1_water',
    title: 'Water, pH, and the Chemistry of Life',
    domainWeight: '25%',
    overview:
      'Every biochemistry passage takes place in water, and the MCAT assumes you can reason about pH, pKa, and buffering without being prompted. This chapter builds that base: why water\'s polarity organizes biomolecules, what a pKa actually tells you, and how the bicarbonate and phosphate systems hold physiological pH. One relationship — Henderson-Hasselbalch — does most of the work, and you should be able to run it in one variable in your head.',
    sections: [
      {
        id: 'cpb1_w_solvent',
        title: 'Water\'s Structure and the Noncovalent Toolkit',
        content: `## Geometry Explains Everything

Water is bent, not linear. Oxygen's two bonding pairs and two lone pairs adopt a roughly tetrahedral arrangement, and lone-pair repulsion squeezes the H–O–H angle to 104.5° (the tabulated value; a perfect tetrahedron would give 109.5°). Because oxygen is far more electronegative than hydrogen, each O–H bond is polarized, and the bent shape prevents the two bond dipoles from canceling. The result is a strongly polar molecule with a partially negative oxygen and two partially positive hydrogens.

That charge separation makes water a superb **hydrogen bond** partner: each molecule can donate two hydrogen bonds (through its H atoms) and accept two (through oxygen's lone pairs) — up to four per molecule. A single hydrogen bond is weak, roughly 23 kJ/mol against about 470 kJ/mol for the covalent O–H bond (standard tabulated values), and each one breaks and reforms in picoseconds. Individually trivial, collectively decisive: the sheer number of hydrogen bonds gives water its anomalously high boiling point, heat capacity, and heat of vaporization — which is why sweating cools you.

In ice, every molecule holds all four hydrogen bonds in a rigid open lattice; that openness makes ice less dense than the liquid, so ice floats. Liquid water keeps an average of about 3.4 hydrogen-bonded neighbors in a constantly rearranging network. Melting and evaporation both absorb heat because they break hydrogen bonds — favorable in entropy, costly in enthalpy.

## Water as Solvent

Charged and polar solutes dissolve because water rewards them twice. First, oriented water molecules form **hydration shells** around ions, and water's high dielectric ability screens opposite charges from each other, letting a salt lattice fall apart. Second, ions released from a crystal gain enormous freedom of motion, so dissolution is entropy-favored. Alcohols, aldehydes, ketones, and N–H-containing compounds dissolve by hydrogen bonding directly with the solvent. In contrast, nonpolar gases such as N₂ and O₂ have nothing to offer water and dissolve poorly — the underlying reason blood needs a dedicated O₂-carrying protein at all.

## The Noncovalent Toolkit

| Interaction | Basis | Where it matters |
|-------------|-------|------------------|
| Hydrogen bond | Shared H between donor and acceptor | Base pairing, protein secondary structure |
| Ionic (salt bridge) | Attraction of full + and − charges | Lys⁺···⁻Glu contacts in proteins |
| Van der Waals | Transient induced dipoles at contact distance | Close packing in protein cores |
| Hydrophobic effect | Entropy of released water | Membranes, protein folding |

The **hydrophobic effect** deserves special care because it is not an attraction at all. Water at a nonpolar surface cannot hydrogen-bond to it, so the surface water arranges into a more ordered, cage-like layer — an entropy penalty. When nonpolar groups cluster, exposed surface area shrinks, ordered water escapes to the bulk, and entropy rises. That entropy gain — not any bond between the greasy groups — assembles micelles and lipid bilayers from **amphipathic** molecules and drives protein cores together.

Van der Waals interactions are transient induced-dipole attractions that appear whenever atoms approach their contact distance; any single one is feeble, but a well-packed protein interior stacks up thousands. The general rule for macromolecules: the most stable conformation is the one that buries nonpolar groups away from water while keeping polar groups hydrogen-bonded — internally or to solvent.`,
        examTip:
          'When a question asks what drives nonpolar molecules together in water, the credited answer is the entropy gain of released water — not an attraction between the nonpolar groups themselves.',
      },
      {
        id: 'cpb1_w_osmosis',
        title: 'Osmolarity and Tonicity',
        content: `## Water Follows Solute

When a semipermeable membrane separates two solutions, water crosses toward the side with the higher total solute concentration, generating **osmotic pressure**. The van 't Hoff relation puts a number on it: Π = icRT, where c is molar concentration and i is the number of particles each formula unit releases. The product ic is the **osmolarity**. Dissociation matters: 0.1 M NaCl contributes nearly twice the osmolarity of 0.1 M glucose because it splits into two ions. Osmotic pressure is a colligative property — it counts particles, not identities.

## Tonicity and Cells

- **Isotonic** surroundings match the cytosol's osmolarity: no net water movement. Intravenous fluids are formulated isotonic for exactly this reason.
- **Hypertonic** surroundings (higher outside osmolarity) pull water out; the cell shrinks.
- **Hypotonic** surroundings push water in; an animal cell swells and can burst, since it has no wall to push back.

Cells manage a chronic osmotic problem: the cytosol is packed with proteins and metabolites. One elegant solution is macromolecular fuel storage. A cell that kept its glucose as free monomer would face a crushing osmotic load; polymerized into a few molecules of glycogen, the same mass of sugar contributes almost nothing to osmolarity. Storing fuel as polymer is osmotic engineering, and the MCAT likes the logic.

The same particle-counting rule runs the vasculature: albumin and the other plasma proteins contribute the oncotic pull that keeps water in capillaries, and multicellular animals hold blood plasma and interstitial fluid at an osmolarity matched to their cells' cytosol — which is why IV replacement fluids are engineered isotonic rather than pure water.`,
        quiz: [
          {
            question:
              'A red blood cell is placed in a large volume of pure water. What happens, and why?',
            options: [
              'It shrinks, because water leaves the cell down its concentration gradient',
              'It swells and may lyse, because water enters the cell toward the higher cytosolic osmolarity',
              'Nothing, because the plasma membrane is impermeable to water',
              'It shrinks, because ions rush into the cell',
            ],
            correctIndex: 1,
            explanation:
              'Pure water is maximally hypotonic relative to the cytosol. Water moves across the membrane toward the compartment of higher osmolarity — into the cell — and an animal cell, lacking a wall, swells and can burst. Crenation (shrinking) happens in hypertonic, not hypotonic, surroundings.',
          },
        ],
      },
      {
        id: 'cpb1_w_ph',
        title: 'Ionization of Water, pH, and pKa',
        content: `## Kw and the pH Scale

Water ionizes slightly: H₂O ⇌ H⁺ + OH⁻. Folding the essentially constant concentration of water itself (55.5 M) into the equilibrium constant gives the **ion product of water**, Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 25 °C (the standard tabulated value). The product is fixed, so [H⁺] and [OH⁻] are locked in a seesaw: raise one and the other must fall. In pure water each is 10⁻⁷ M — the definition of neutrality.

**pH = −log[H⁺]**, so each pH unit is a tenfold change in [H⁺], and lower pH means more acid. Worked example, run twice: arterial blood is held at pH 7.4, so [H⁺] = 10⁻⁷·⁴ = 10⁰·⁶ × 10⁻⁸ ≈ 4.0 × 10⁻⁸ M. Check by inverting: log(4.0 × 10⁻⁸) = 0.60 − 8 = −7.40. ✓ For scale, gastric juice sits near pH 1.5–2 and cola near pH 3 — the stomach holds a hydrogen ion concentration roughly 10,000 times that of blood.

One structural aside explains an oddity you may meet in passages: H⁺ and OH⁻ move through water far faster than any ion should by ordinary diffusion. A proton does not swim — it hops. Charge relays along chains of hydrogen-bonded water molecules, each water passing a proton to its neighbor, so the charge arrives long before any individual atom does. This **proton hopping** underlies water's exceptional ionic conductivity and the proton-conducting channels of membrane proteins.

## Weak Acids and pKa

A strong acid dissociates completely; a **weak acid** HA ⇌ H⁺ + A⁻ only partially, to an extent set by its acid dissociation constant Ka. Since **pKa = −log Ka**, two readings follow:

- **Lower pKa = stronger acid** — more willing to surrender its proton.
- **pKa is the pH at which the acid is exactly half dissociated**: [HA] = [A⁻].

Every weak acid drags a **conjugate base** with it (acetic acid/acetate; NH₄⁺/NH₃), and the pair — not either member alone — is what buffers. Three tabulated benchmarks are worth memorizing because they reappear all over physiology: acetic acid pKa 4.76, dihydrogen phosphate (H₂PO₄⁻ ⇌ HPO₄²⁻) pKa 6.86, and ammonium (NH₄⁺ ⇌ NH₃) pKa 9.25.

## Reading a Titration Curve

Titrate a weak acid with strong base and the pH climbs in a characteristic S-shape. At the midpoint — half an equivalent of base added — half the acid has been converted to conjugate base, so **pH = pKa** there, and the curve is at its flattest: this plateau is the buffering region, extending usefully about one pH unit to either side of the pKa. A diprotic or triprotic acid simply shows one plateau per ionizable proton.

The master rule that answers most ionization questions with zero arithmetic: **above the pKa, the deprotonated form dominates; below it, the protonated form dominates.** At pH 4.76 acetic acid is a 1:1 mixture; by pH 6.76 it is about 99% acetate.`,
        importantNote:
          'This same pH-versus-pKa comparison decides the charge on every ionizable amino acid side chain in the next chapter — learn it here once and reuse it everywhere.',
      },
      {
        id: 'cpb1_w_buffers',
        title: 'Buffers and Henderson-Hasselbalch',
        content: `## What a Buffer Is

A buffer is a weak acid paired with its conjugate base in comparable amounts. Added H⁺ is soaked up by the base; added OH⁻ is neutralized by the acid; either way, only the ratio of the two forms shifts, and the pH barely moves. A buffer is most powerful when pH = pKa (equal reserves against acid and base) and remains useful within roughly ±1 pH unit. Capacity also scales with absolute concentration — a 1 M buffer absorbs ten times the insult of a 0.1 M buffer at the same ratio.

![Titration of a weak acid with pKa 4.76 (acetic acid's tabulated constant), computed from the Henderson-Hasselbalch equation. pH equals pKa at the half-equivalence point, the middle of the flat buffering region.](/courses/mcat/biochem/bc1-titration-curve.svg)

## The Equation in One Variable

**pH = pKa + log([A⁻]/[HA])**

Anchor on three cases and you rarely need the log button:

- Ratio 1:1 → pH = pKa
- Ratio 10:1 (base:acid) → pH = pKa + 1
- Ratio 1:10 → pH = pKa − 1

**Worked example 1 (find pH).** A buffer contains 0.15 M acetic acid and 0.30 M acetate (pKa 4.76). The ratio is 0.30/0.15 = 2, and log 2 = 0.30, so pH = 4.76 + 0.30 = 5.06. Check: 10⁰·³⁰ = 2.0, consistent with the 2:1 ratio. ✓

**Worked example 2 (find the ratio).** What acetate:acetic acid ratio buffers at pH 5.76? Here pH − pKa = 1.00, so log([A⁻]/[HA]) = 1.00 and the ratio is 10:1 in favor of acetate. Check: 4.76 + log 10 = 4.76 + 1.00 = 5.76. ✓

## Physiological Buffers Besides Bicarbonate

The **phosphate** pair H₂PO₄⁻/HPO₄²⁻, with its tabulated pKa of 6.86, sits almost on top of intracellular pH, making phosphate the principal small-molecule buffer of the cytosol and of urine, where its concentration is high enough to matter.

Proteins buffer too, and one side chain does most of that work: **histidine's imidazole**, with a pKa near 6.0, is the only side chain that trades protons readily near physiological pH. Hemoglobin's histidines are a significant share of blood's total buffering power — a fact that returns in chapter I.4 as the Bohr effect.`,
        quiz: [
          {
            question:
              'A weak acid has pKa 4.8. At pH 6.8, what is the approximate ratio of conjugate base to acid?',
            options: ['1:1', '10:1', '100:1', '2:1'],
            correctIndex: 2,
            explanation:
              'pH − pKa = 2, and by Henderson-Hasselbalch, log([A⁻]/[HA]) = 2, so the ratio is 10² = 100:1 in favor of the conjugate base. Each pH unit above the pKa multiplies the base:acid ratio by 10.',
          },
        ],
      },
      {
        id: 'cpb1_w_bicarb',
        title: 'The Bicarbonate System and Acid-Base Physiology',
        content: `## An Open Buffer

Blood pH is defended mainly by a chain of three linked equilibria:

CO₂(g, lungs) ⇌ CO₂(aq) ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻

In red blood cells, **carbonic anhydrase** makes the hydration step fast. Carbonic acid's true pKa is about 3.57 at 37 °C — but H₂CO₃ is in rapid equilibrium with a much larger pool of dissolved CO₂, and when the two acid-side species are combined into one effective reservoir, the system behaves as an acid with an **effective pKa of 6.1** (the standard physiological value).

Even 6.1 is more than a unit below blood pH, which by the ±1 rule should make bicarbonate a poor buffer at 7.4. It works anyway because it is an **open system**. The acid side is dissolved CO₂, in equilibrium with an effectively unlimited gas reservoir in the lungs: exhalation removes acid within minutes. The base side, HCO₃⁻, is managed by the kidneys, which excrete or reclaim bicarbonate over hours to days. Neither side can be exhausted the way a closed beaker buffer can.

**Worked example, run twice.** Normal plasma has about 24 mM HCO₃⁻ and 1.2 mM dissolved CO₂. The ratio is 24/1.2 = 20, and log 20 = log 2 + log 10 = 0.30 + 1.00 = 1.30, so pH = 6.1 + 1.30 = 7.40. Check: 10¹·³⁰ ≈ 20, consistent. ✓ Blood pH is a 20:1 story.

## Respiration Moves the Curve in Minutes

The brainstem monitors blood pCO₂ and pH and adjusts ventilation continuously. Trace any disturbance through the equilibria:

- **Hyperventilation** blows off CO₂ → the equilibria pull H⁺ and HCO₃⁻ back toward CO₂ → [H⁺] falls → pH rises: **respiratory alkalosis**. The classic paper-bag remedy works by rebreathing CO₂-enriched air.
- **Hypoventilation** (or lung disease) traps CO₂ → more carbonic acid → pH falls: **respiratory acidosis**.

Metabolic disturbances load the other side of the equation. Vigorous exercise dumps lactic acid into blood; untreated diabetes produces **ketoacidosis**, in which ketone-body acids overwhelm the buffer and depress plasma pH — one of the classic life-threatening acid-base emergencies. In each case the lungs compensate first (fast) and the kidneys second (slow).`,
        examTip:
          'If a passage manipulates respiration rate, translate it to CO₂ first: more ventilation → less CO₂ → less H⁺ → higher pH (respiratory alkalosis), and the reverse for hypoventilation.',
        quiz: [
          {
            question:
              'The effective pKa of the bicarbonate system (6.1) lies more than one unit below blood pH (7.4), yet bicarbonate is the dominant blood buffer. What resolves the paradox?',
            options: [
              'Carbonic anhydrase raises the effective pKa toward 7.4',
              'The system is open: the lungs exchange CO₂ and the kidneys manage HCO₃⁻, so neither reserve can be exhausted',
              'Blood contains far more carbonic acid than bicarbonate',
              'Phosphate continuously regenerates carbonic acid',
            ],
            correctIndex: 1,
            explanation:
              'A closed buffer more than one unit from its pKa would have a lopsided, easily exhausted acid reserve. The bicarbonate system escapes this because it is open at both ends: dissolved CO₂ equilibrates with the lung gas reservoir (minutes) and the kidneys adjust bicarbonate (days). Carbonic anhydrase accelerates equilibration but does not change the pKa.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Water is bent (104.5°) and strongly polar; up to four hydrogen bonds per molecule (~23 kJ/mol each) explain its high heat capacity, boiling point, and solvent power.',
      'The hydrophobic effect is entropy-driven: released water, not attraction between nonpolar groups, drives membranes and protein folding.',
      'Osmolarity counts particles (Π = icRT); hypotonic surroundings swell and can lyse animal cells; polymeric fuel storage sidesteps osmotic load.',
      'Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 25 °C; pH = −log[H⁺]; blood pH 7.4 means [H⁺] ≈ 4 × 10⁻⁸ M.',
      'pKa is the pH of half-dissociation; pH above pKa → deprotonated form dominates. Buffers work best at pH = pKa, within roughly ±1 unit.',
      'Henderson-Hasselbalch in one variable: 1:1 → pH = pKa; each factor of 10 in the ratio moves pH one unit.',
      'Bicarbonate (effective pKa 6.1) buffers blood because it is open — lungs control CO₂ in minutes, kidneys control HCO₃⁻ over days; plasma runs at a 20:1 base:acid ratio. Phosphate (pKa 6.86) and histidine side chains buffer the cytosol.',
    ],
  },

  // ── Biochemistry I.2: Amino acids and the peptide bond ──────────────────
  cpb1_amino_acids: {
    topicId: 'cpb1_amino_acids',
    title: 'Amino Acids and the Peptide Bond',
    domainWeight: '25%',
    overview:
      'Twenty side chains generate all of protein chemistry, and the MCAT expects you to know each one\'s class, charge at pH 7.4, and letter codes on sight. This chapter organizes the twenty by chemistry rather than by rote list, puts numbers on ionization — pKa and pI — and closes with the peptide bond, whose planar geometry constrains everything a protein can do.',
    sections: [
      {
        id: 'cpb1_aa_backbone',
        title: 'The Shared Backbone, Stereochemistry, and 280 nm',
        content: `## One Scaffold, Twenty Variations

Every standard amino acid is an α-carbon carrying four groups: an amino group, a carboxyl group, a hydrogen, and the variable side chain (R). At pH 7.4 the free molecule is a **zwitterion** — amino group protonated (−NH₃⁺), carboxyl deprotonated (−COO⁻) — carrying both charges at once. Because it can act as acid or base, an amino acid is **amphoteric**.

With four different substituents, the α-carbon is a stereocenter in every amino acid except glycine (whose R group is a second hydrogen), so each of the other nineteen exists as a pair of enantiomers. By convention these are labeled **L and D** by comparison to the reference molecule glyceraldehyde, and ribosomes build proteins exclusively from the **L** series. D-amino acids are real but marginal: they appear in bacterial cell-wall peptides and a few nonribosomally made peptide antibiotics — a favorite passage topic.

Beyond the standard twenty, cells generate specialized residues mostly by modifying proteins after synthesis: **4-hydroxyproline** in collagen, phosphorylated serine/threonine/tyrosine in signaling, and γ-carboxyglutamate in clotting factors. **Selenocysteine** is the notable exception — a twenty-first amino acid inserted during translation in a few proteins.

## Aromatic Residues Report at 280 nm

Tryptophan and tyrosine absorb ultraviolet light with maxima near **280 nm**; phenylalanine absorbs only weakly and can be ignored. Since nearly every protein contains some Trp or Tyr, absorbance at 280 nm is the standard instant assay for protein concentration, through the **Beer-Lambert law**: A = εcl, absorbance proportional to concentration times path length. Tryptophan absorbs several-fold more strongly than tyrosine, so Trp-rich proteins read higher at identical concentrations — a classic experimental-passage trap.`,
        examTip:
          'Any question tying protein detection to ultraviolet absorbance is asking about tryptophan and tyrosine at 280 nm. Nucleic acids absorb at 260 nm — the 260/280 ratio distinguishes the two.',
      },
      {
        id: 'cpb1_aa_families',
        title: 'Twenty Side Chains, Five Families',
        content: `## The Complete Table

Learn the twenty as five chemical families; the table's side-chain pKa values are the tabulated constants used everywhere in this course.

| Amino acid | 3-letter | 1-letter | Side-chain pKa | Side-chain character |
|------------|----------|----------|----------------|----------------------|
| Glycine | Gly | G | — | H only; smallest, most flexible |
| Alanine | Ala | A | — | Methyl; compact hydrophobe |
| Valine | Val | V | — | Branched aliphatic |
| Leucine | Leu | L | — | Branched aliphatic |
| Isoleucine | Ile | I | — | Branched aliphatic; second stereocenter |
| Proline | Pro | P | — | Ring fused to backbone N; rigid |
| Methionine | Met | M | — | Thioether; initiator residue |
| Phenylalanine | Phe | F | — | Benzyl; purely hydrophobic aromatic |
| Tryptophan | Trp | W | — | Indole; strongest 280 nm absorber |
| Tyrosine | Tyr | Y | 10.07 | Phenol; H-bonds, phosphorylation site |
| Serine | Ser | S | — | −OH; phosphorylation site |
| Threonine | Thr | T | — | −OH; phosphorylation site; second stereocenter |
| Cysteine | Cys | C | 8.18 | Thiol; forms disulfide bonds |
| Asparagine | Asn | N | — | Amide; H-bonding, N-glycosylation site |
| Glutamine | Gln | Q | — | Amide; H-bonding |
| Lysine | Lys | K | 10.53 | Primary amine; + at pH 7.4 |
| Arginine | Arg | R | 12.48 | Guanidinium; + at pH 7.4, most basic |
| Histidine | His | H | 6.00 | Imidazole; mostly neutral at pH 7.4 |
| Aspartate | Asp | D | 3.65 | Carboxylate; − at pH 7.4 |
| Glutamate | Glu | E | 4.25 | Carboxylate; − at pH 7.4 |

Nonpolar aliphatic residues (Gly, Ala, Val, Leu, Ile, Pro, Met) pack protein cores; the aromatics (Phe, Trp, Tyr) are mostly hydrophobic, with Tyr's phenol the polar exception; polar uncharged residues (Ser, Thr, Cys, Asn, Gln) hydrogen-bond and host modifications; Lys and Arg are reliably positive at pH 7.4, Asp and Glu reliably negative — apply the pH-versus-pKa rule from chapter I.1 and every entry follows.

## Five Residues Worth Singling Out

- **Glycine** — no side chain to clash; the most conformationally free residue, common in tight turns.
- **Proline** — its side chain closes back onto the backbone nitrogen, locking rotation and deleting the backbone N–H; it kinks helices.
- **Cysteine** — two thiols oxidize to a covalent **disulfide bond**, the cross-link of secreted proteins.
- **Histidine** — the only side chain with a pKa (6.0) near physiological pH, so it can donate or accept a proton on demand; it populates active sites and buffers blood.
- **Arginine** — the guanidinium group's resonance-delocalized positive charge makes it the last side chain to ever deprotonate (pKa 12.48).`,
        examTip:
          'Know both letter codes cold — passages switch without warning, and the odd ones (K = lysine, R = arginine, W = tryptophan, Q = glutamine, D = aspartate, E = glutamate) are the usual traps.',
        quiz: [
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
      {
        id: 'cpb1_aa_ionization',
        title: 'Titration, pI, and Electrophoresis Logic',
        content: `## Titrating an Amino Acid

Each ionizable group lets go of its proton as the pH climbs past its own pKa. For glycine the tabulated backbone values are 2.34 (α-carboxyl) and 9.60 (α-amino). Notice how acidic that carboxyl is compared with acetic acid's 4.76: the neighboring −NH₃⁺ pulls electron density toward itself, stabilizing the carboxylate and making the proton easier to shed. A glycine titration shows two buffering plateaus, one around each pKa, with the zwitterion dominating in between. An ionizable side chain simply adds a third plateau — glutamate is the classic case, its side-chain carboxyl (pKa 4.25) titrating between the two backbone events.

![Fraction protonated versus pH for each ionizable group of free glutamate, computed from its tabulated pKa values: 2.19 (α-carboxyl), 4.25 (side-chain carboxyl), and 9.67 (α-amino). Each curve crosses its halfway point exactly at that group's pKa, and the pI (3.22) sits midway between the two acidic pKa values.](/courses/mcat/biochem/bc1-amino-acid-ionization.svg)

## The Isoelectric Point, Computed Four Times

The **pI** is the pH of zero net charge — always the average of the two pKa values that bracket the neutral species:

- **Glycine**: pI = (2.34 + 9.60)/2 = 11.94/2 = **5.97**
- **Glutamate** (acidic): the neutral form sits between the two carboxyl ionizations, so average the two lowest: pI = (2.19 + 4.25)/2 = 6.44/2 = **3.22**
- **Histidine** (basic): average the two highest: pI = (6.00 + 9.17)/2 = 15.17/2 = **7.59**
- **Lysine** (basic): pI = (8.95 + 10.53)/2 = 19.48/2 = **9.74**

Each arithmetic line above is its own check: sum, then halve. The pattern to internalize — acidic amino acids have pI near 3, neutral ones near 6, basic ones from about 7.6 up to 10.8 (arginine).

## The Payoff Rule

**Below its pI a molecule is net positive; above its pI, net negative.** That single line runs all electrophoresis and ion-exchange questions. At pH 6.0, glutamate (pI 3.22) is well above its pI, carries net negative charge, and migrates toward the anode; lysine (pI 9.74) is below its pI, net positive, and migrates toward the cathode. Peptides obey the same logic: only the free N-terminus, the free C-terminus, and ionizable side chains count, because every backbone amide in between is locked in a peptide bond and cannot ionize. A quick tally for Asp–Gly–Lys–Ala at pH 7.4: N-terminus +1, C-terminus −1, Asp −1, Lys +1 — net zero.`,
        importantNote:
          'For amino acids with an ionizable side chain, never average all three pKa values — identify which two pKa values bracket the neutral species and average only those.',
        quiz: [
          {
            question:
              'In an electrophoresis apparatus at pH 6.0, free glutamate (pI = 3.22) will:',
            options: [
              'Migrate toward the cathode (−), because it carries net positive charge',
              'Migrate toward the anode (+), because it carries net negative charge',
              'Remain stationary, because pH 6.0 is within one unit of its side-chain pKa',
              'Precipitate, because amino acids are least soluble above their pI',
            ],
            correctIndex: 1,
            explanation:
              'The operating pH (6.0) is far above glutamate\'s pI (3.22), so both carboxyl groups are deprotonated while the α-amino group is still protonated: net charge −1. Net-negative species migrate toward the positive electrode (anode). Molecules are stationary in an electric field only at their pI.',
          },
        ],
      },
      {
        id: 'cpb1_aa_peptide',
        title: 'The Peptide Bond and Primary Structure',
        content: `## Forming and Breaking the Bond

Two amino acids join when the α-carboxyl of one condenses with the α-amino of the next, expelling water and forming an amide — the **peptide bond**. The joined units are called **residues**. Thermodynamics actually favors the reverse reaction: hydrolysis of a peptide bond is exergonic, and cells must activate the carboxyl group (ultimately at ATP's expense, on the ribosome) to drive synthesis. But hydrolysis has a high activation barrier, so peptide bonds are kinetically rock-solid — half-lives measured in years without a protease. Favorable yet frozen: a classic thermodynamics-versus-kinetics contrast the MCAT loves.

## Why the Bond Is Planar

The amide nitrogen's lone pair delocalizes into the carbonyl, giving the C–N linkage roughly 40% double-bond character. Three tested consequences:

- The six atoms around the bond are locked in a **plane**; there is no rotation about C–N.
- The **trans** configuration dominates overwhelmingly — over 99.9% for ordinary residues — because cis puts adjacent side chains in collision. Proline is the partial exception: about 6% of X–Pro bonds are cis, many of them sitting in tight turns.
- All backbone flexibility lives in the two single bonds flanking each α-carbon: the **φ** (N–Cα) and **ψ** (Cα–C) dihedral angles, which chapter I.3 maps on the Ramachandran plot.

## Naming, Size, and Add-Ons

Sequences are written and synthesized **from N-terminus to C-terminus** — residue 1 is the free amino end, always drawn at the left. A handful of residues is an oligopeptide; longer chains are polypeptides; above roughly 10,000 daltons the molecule is conventionally called a protein. Small peptides can still be potent biology — hypothalamic releasing hormones, oxytocin, and the enkephalins are just a few residues each, and the sweetener aspartame is simply a dipeptide ester.

**Primary structure** means the full covalent description: the sequence plus the positions of any disulfide cross-links (two cysteines joined this way count as one cystine unit). Many proteins also carry non-amino-acid components — **prosthetic groups** — permanently bound: heme in hemoglobin, carbohydrate in glycoproteins, lipid in lipoproteins. Such **conjugated proteins** are named for the add-on, and sequence determines everything downstream: fold, function, and the diseases of chapter I.4.

A sizing shortcut worth carrying: the average residue contributes about 110 Da to a protein's mass (the mean amino acid mass of ~128 minus the water lost in condensation — standard values). A 33,000-Da protein therefore holds roughly 33,000/110 = 300 residues; check by inverting, 300 × 110 = 33,000. ✓`,
        examTip:
          'If a question shows a peptide, find the N-terminus first — by convention it is written on the left, and residue numbering starts there.',
      },
      {
        id: 'cpb1_aa_methods',
        title: 'Purifying and Sequencing Proteins',
        content: `## Separation Logic

Every purification exploits some property that differs between proteins: size, charge, or binding behavior. From a crude cell extract, classic first steps are salting out (high ammonium sulfate concentrations precipitate proteins differentially) and dialysis (small solutes diffuse out through a semipermeable membrane; proteins stay). Then chromatography, one honest sentence per class: **ion-exchange** columns carry charged beads and retain proteins of opposite charge, releasing them on a salt or pH gradient; **size-exclusion** (gel filtration) columns hold porous beads that delay small proteins inside the pores, so the largest proteins elute first; **affinity** columns display a specific ligand and capture only the protein that binds it — the sharpest single purification step available. High-performance liquid chromatography (HPLC) is any of these run at high pressure on fine resins for better resolution. Progress is tracked as **specific activity** — activity per milligram of total protein — which climbs as contaminants fall away.

## Electrophoresis

**SDS-PAGE**: the detergent SDS coats every polypeptide with uniform negative charge and strips native shape, so migration through the gel reports molecular mass alone — small proteins run farthest, and standards let you estimate an unknown's mass. **Isoelectric focusing** runs proteins through a stable pH gradient; each protein migrates until it reaches the pH equal to its pI, where its net charge — and therefore its motion — is zero. Running IEF in one dimension and SDS-PAGE in the second yields a two-dimensional gel that can resolve over a thousand spots by the two independent coordinates of pI and mass.

## Two Ways to Read a Sequence

**Edman degradation**, the classical chemistry: a reagent (phenylisothiocyanate) tags the N-terminal residue, mild acid releases that one residue as an identifiable derivative, and the cycle repeats on the shortened chain — sequencing step by step from the amino end, practical for a few dozen residues. It is slow and demands a pure peptide, but it reads a sequence directly and still appears in passages.

**Mass spectrometry**, the modern workhorse: peptides are ionized intact (by MALDI or electrospray), and a tandem instrument (MS/MS) isolates one peptide, shatters it along the backbone, and reads the sequence from the mass ladder of the fragments. It is fast, needs almost no material, handles mixtures, and simultaneously reveals modifications like phosphorylation; today most full sequences come from translating gene sequences, with MS confirming the protein actually made.

Long proteins are sequenced in pieces. Proteases with known specificity do the cutting — **trypsin** cleaves on the carboxyl side of Lys and Arg; chymotrypsin after the bulky aromatics (Phe, Trp, Tyr); cyanogen bromide after Met. Disulfides are broken first (reduce with dithiothreitol, then alkylate the thiols so they cannot re-pair). Sequence the fragments from two different digests, and the points where one digest's fragments span another's cut sites dictate the original order — the same overlap reasoning genome assembly uses.

Two codas complete the toolkit. Chemistry can also run in reverse: solid-phase synthesis builds peptides of up to about a hundred residues one activated amino acid at a time on a resin bead — the route to custom peptides and hapten conjugates. And once sequences exist, comparison becomes data: aligned sequences of **homologous** proteins measure evolutionary distance, with orthologs (same protein, different species) tracing species divergence and paralogs (duplicated genes within a genome) tracing new functions — the logic behind every "percent identity" table a passage shows you.`,
        quiz: [
          {
            question:
              'A 25-residue peptide contains lysine at positions 5 and 12 and arginine at position 18, with no prolines. Complete digestion with trypsin yields how many fragments?',
            options: ['Two', 'Three', 'Four', 'Five'],
            correctIndex: 2,
            explanation:
              'Trypsin cleaves on the carboxyl side of each lysine and arginine. Three internal cut sites (after residues 5, 12, and 18) divide the chain into four fragments: 1–5, 6–12, 13–18, and 19–25. Every fragment except the C-terminal one ends in Lys or Arg.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'All amino acids share the α-carbon scaffold and are zwitterions at pH 7.4; every one except glycine is chiral, and proteins use only L stereoisomers.',
      'Group the twenty by chemistry: nonpolar aliphatic, aromatic, polar uncharged, positive (Lys, Arg, His), negative (Asp, Glu) — with side-chain pKa values 10.53, 12.48, 6.00, 3.65, 4.25 respectively.',
      'Trp and Tyr absorb at 280 nm (Beer-Lambert A = εcl) — the standard quick assay for protein concentration.',
      'pI averages the two pKa values flanking the neutral species: Gly 5.97, Glu 3.22, His 7.59, Lys 9.74. Below pI net positive, above pI net negative — the whole of electrophoresis logic.',
      'The peptide bond is planar from resonance and overwhelmingly trans (Pro allows ~6% cis); rotation happens only at φ and ψ. Hydrolysis is thermodynamically favorable but kinetically negligible.',
      'Purification exploits charge (ion-exchange), size (size-exclusion, SDS-PAGE), pI (isoelectric focusing), or binding (affinity); specific activity tracks progress.',
      'Sequencing: Edman reads from the N-terminus chemically; MS/MS reads fragment mass ladders and dominates today; overlapping protease digests (trypsin after Lys/Arg) order the fragments.',
    ],
  },

  // ── Biochemistry I.3: Protein architecture ──────────────────────────────
  cpb1_protein_structure: {
    topicId: 'cpb1_protein_structure',
    title: 'Protein Architecture',
    domainWeight: '25%',
    overview:
      'Protein structure is a hierarchy: a sequence folds into local motifs, motifs pack into a three-dimensional fold, and folded chains can assemble into larger complexes. The MCAT tests which interactions stabilize each level, what denaturation does and does not destroy, and what happens when folding goes wrong — chaperones, aggregates, and prions.',
    sections: [
      {
        id: 'cpb1_ps_hierarchy',
        title: 'The Four Levels and What Stabilizes Them',
        content: `## From Sequence to Assembly

![The four levels of protein structure, from amino acid sequence to assembled multi-subunit complex. Schematic — the shapes are illustrative, not a real protein's coordinates.](/courses/mcat/biochem/bc1-structure-hierarchy.svg)

- **Primary** — the covalent description: the sequence itself plus any disulfide bonds.
- **Secondary** — local, repeating backbone patterns (α-helix, β-sheet, turns) held by **backbone** hydrogen bonds only; side chains are bystanders at this level.
- **Tertiary** — the complete 3-D fold of one chain, stabilized by **side-chain** interactions.
- **Quaternary** — the arrangement of two or more folded chains into one functional unit; only multimeric proteins have it.

A protein's specific folded shape is its **conformation** — interconvertible without breaking covalent bonds, unlike configuration. The native conformation is only marginally more stable than the unfolded ensemble; the free-energy gap for a typical small protein is on the order of a few dozen kJ/mol, roughly the worth of a handful of hydrogen bonds. Function often requires that marginality: proteins must flex.

## The Stabilizer Inventory

The dominant contribution is the **hydrophobic effect**: nonpolar side chains bury themselves in a water-free core, releasing ordered surface water (chapter I.1's entropy argument, now applied). Hydrogen bonds and salt bridges refine the fold — with the accounting caveat that a polar group buried without a hydrogen-bond partner costs stability, so folds maximize satisfied partners. Van der Waals packing adds up across a tightly fitted core. **Disulfide bonds** are the lone covalent stabilizer, and because the cytosol is chemically reducing, they mark mostly secreted and extracellular proteins.

## The Backbone's Rulebook

Chapter I.2 established that each peptide bond is planar and trans, leaving only φ and ψ rotations at each α-carbon. Most φ/ψ combinations put backbone or side-chain atoms into collision. The **Ramachandran plot** maps the survivors: plot ψ against φ and the sterically allowed combinations cluster into a few islands — one containing the right-handed α-helix, another the extended β conformation. Glycine, with no side chain to clash, roams outside the islands; proline, ring-locked, barely moves within them. The plot is also a quality check: residues of a well-determined structure should land in allowed territory.`,
        importantNote:
          'Keep the hydrogen-bond bookkeeping straight: secondary structure uses backbone C=O···H−N bonds; tertiary structure recruits the side chains.',
      },
      {
        id: 'cpb1_ps_secondary',
        title: 'Secondary Structure by the Numbers',
        content: `## The α-Helix

The α-helix is a right-handed coil with the standard tabulated geometry: **3.6 residues per turn**, a pitch (rise per turn) of **5.4 Å**, and therefore a rise of **1.5 Å per residue**. Check the arithmetic both ways: 3.6 × 1.5 = 5.4 ✓, and a 36-residue helix spans 36 × 1.5 = 54 Å, or exactly ten turns ✓. Each backbone carbonyl hydrogen-bonds to the backbone N–H four residues along (i → i+4), so every amide in the body of the helix is satisfied — a big part of why the helix is so common. Side chains project outward, which means a helix can be assembled **amphipathic**: with the 3.6-residue period, hydrophobic residues spaced every three to four positions line up on one face, polar residues on the other — the standard design for helices lying on membranes or coiled against another helix.

Helix breakers and benders: **proline** (its backbone nitrogen has no H to donate and its ring forbids the required φ angle) and **glycine** (so flexible it prefers other conformations). Runs of same-charge residues repel, and the helix also has an overall **dipole** — amino end positive, carboxyl end negative — because every peptide-bond dipole points the same way; negatively charged residues stabilize the N-terminal end.

## The β Conformation

A β strand is the backbone pulled nearly taut into a zigzag, advancing roughly 3.5 Å per residue (standard value) — more than twice the helix's rise, with side chains alternating above and below the pleated plane. Strands hydrogen-bond side by side into **sheets**: **antiparallel** sheets (adjacent strands running opposite directions) have straight, in-line hydrogen bonds; **parallel** sheets have slightly angled ones and are marginally less stable. The strands of one sheet are often distant in sequence — secondary structure is local along each strand, but a sheet can organize the entire chain.

## Turns

A **β turn** reverses chain direction in four residues, held by a hydrogen bond between residue 1's carbonyl and residue 4's N–H. Glycine (small and flexible) and proline (its cis peptide bond suits a hairpin) dominate turns, which sit at protein surfaces and typically connect antiparallel strands. Without turns there are no compact proteins — just fibers.

In the lab, **circular dichroism (CD)** spectroscopy reads overall secondary-structure content from how a protein absorbs polarized UV light — the standard quick tool for watching a protein fold or melt.`,
        examTip:
          'Proline the helix-breaker is one of the highest-yield single facts in this chapter: expect a mutation-based passage where inserting a proline destroys a helix, or a transmembrane segment question hinging on helix formation.',
        quiz: [
          {
            question:
              'Which statement correctly contrasts α-helices and β-sheets?',
            options: [
              'Helices are held by side-chain hydrogen bonds; sheets by backbone hydrogen bonds',
              'Helix hydrogen bonds link residues close in sequence (i → i+4); a sheet\'s hydrogen bonds can join strands far apart in the sequence',
              'Sheets have a larger rise per turn because they are coiled more tightly than helices',
              'Parallel sheets have straighter hydrogen bonds than antiparallel sheets',
            ],
            correctIndex: 1,
            explanation:
              'Both structures use backbone hydrogen bonds. In a helix each bond connects residue i to residue i+4 — always local. In a sheet the bonded strands may come from widely separated parts of the chain, so the hydrogen bonding can be long-range in sequence terms. Antiparallel (not parallel) sheets have the straighter, slightly stronger hydrogen-bond geometry.',
          },
        ],
      },
      {
        id: 'cpb1_ps_fibrous',
        title: 'Fibrous Proteins: Keratin, Collagen, Silk',
        content: `## Built for Mechanics

Fibrous proteins trade versatility for strength: each is dominated by a single repeating secondary structure, is largely insoluble, and does structural work. Three canonical designs carry the exam material.

**α-Keratin** (hair, wool, nails, horn): two right-handed α-helices wind around each other into a left-handed **coiled coil**. The interface works because the sequence places small hydrophobic residues in a repeating stripe along one helix face — the two helices zip together hydrophobe-to-hydrophobe, and supertwisting tightens the apparent helical repeat to about 5.2 Å (tabulated) from the 5.4 Å of an isolated helix. Coiled coils bundle into intermediate filaments, and **disulfide cross-links** between chains set the hardness — abundant in fingernail, sparser in hair. Permanent waving is applied redox chemistry: reduce the disulfides, reshape the hair, reoxidize them in the new configuration.

**Collagen** (tendon, bone matrix, skin, cartilage): the collagen helix is its own secondary structure, not an α-helix — each chain is a **left-handed** extended helix of about 3 residues per turn, and three chains supertwist into a right-handed triple helix. The chains run the repeating sequence **Gly–X–Y**, where X is often proline and Y often **4-hydroxyproline**; roughly one-third of all residues are glycine because the three chains pack so tightly at the axis that only glycine's hydrogen fits there. The enzyme that hydroxylates the prolines, prolyl hydroxylase, requires **vitamin C (ascorbate)**; without it, under-hydroxylated collagen chains form unstable helices, and the result is **scurvy** — fragile vessels, bleeding gums, failed wound healing. Genetic substitutions of the essential glycines disrupt the triple helix and produce brittle-bone and hyperextensible-connective-tissue diseases (osteogenesis imperfecta, Ehlers-Danlos syndrome). With age, covalent cross-links between Lys residues accumulate and tissues stiffen.

**Silk fibroin** (spider and silkworm silk): layer upon layer of **antiparallel β-sheets**, rich in glycine and alanine — the two smallest side chains, which lets sheets stack face to face. Silk does not stretch (its strands are already extended — pulling would mean breaking covalent bonds) yet is flexible, because whole sheets slide over each other on weak van der Waals contacts.`,
        quiz: [
          {
            question:
              'A sailor on a months-long voyage without fresh produce develops bleeding gums and skin lesions. At the molecular level, the direct defect is:',
            options: [
              'Failure to form disulfide cross-links in keratin coiled coils',
              'Loss of hydroxylation of proline residues, destabilizing the collagen triple helix',
              'Substitution of glycine in the Gly–X–Y repeat by bulkier residues',
              'Aggregation of collagen into amyloid fibrils',
            ],
            correctIndex: 1,
            explanation:
              'The presentation is scurvy — vitamin C deficiency. Ascorbate is required by prolyl hydroxylase, which converts proline to 4-hydroxyproline in collagen\'s Gly–X–Y repeat. Without hydroxylation the triple helix is unstable, and collagen-dependent tissues (vessels, gums, skin, healing wounds) degenerate. Glycine substitution causes genetic collagen diseases, not dietary ones.',
          },
        ],
      },
      {
        id: 'cpb1_ps_globular',
        title: 'Globular Architecture and Quaternary Structure',
        content: `## Compact Machines

Globular proteins mix helices, sheets, and turns in one compact body — the design that makes enzymes, transporters, and antibodies possible. The first one solved at atomic detail (by x-ray diffraction) was myoglobin, and it confirmed the two governing rules: the interior packs hydrophobic side chains almost completely away from water, and nearly every buried polar group finds a hydrogen-bond partner.

Recurring folding patterns — **motifs**, such as a β-α-β unit or a barrel of strands — are the vocabulary of protein architecture; a few hundred motifs account for the folds of the many thousands of known structures. A **domain** is a segment of chain (commonly on the order of a hundred-plus residues) that folds stably on its own; large proteins are strings of domains, and evolution reshuffles them like modules, often one function per domain. Shared folds group proteins into families and superfamilies, frequently revealing distant common ancestry that sequences alone no longer show.

Not all of a protein need be folded: **intrinsically disordered** proteins and segments have sequences rich in charged residues and proline that resist forming a hydrophobic core. Their flexibility is functional — a disordered arm can wrap different partners, which is why signaling hubs such as p53 use disordered regions to bind many targets.

## Quaternary Structure

Separate folded chains (subunits) associate through the same noncovalent inventory — often in symmetric arrangements of a repeating unit (**protomer**). Hemoglobin, two α and two β chains, is the canonical example, and its subunit interfaces are exactly what make cooperative oxygen binding possible in chapter I.4. Multimeric design also buys economy (one small gene, many copies assembled into a large machine) and error control (a bad subunit can be rejected before assembly).

How structures are seen, in one honest paragraph: **x-ray crystallography** diffracts x-rays off protein crystals and yields most known structures at the highest resolution; **NMR** reads through-space contacts of proteins in solution — no crystal needed, best for small proteins and for motion; **cryo-electron microscopy** freezes thousands of single particles and averages their images, and it now solves large complexes and membrane proteins that crystallography could not touch.`,
      },
      {
        id: 'cpb1_ps_folding',
        title: 'Folding, Chaperones, and Misfolding',
        content: `## Denaturation and the Anfinsen Experiment

**Denaturation** — by heat, pH extremes, organic solvents, urea or guanidinium, or detergents — strips secondary through quaternary structure and abolishes function while leaving every peptide bond intact. The agents attack the stabilizers, not the covalent chain: heat feeds the entropy of unfolding, pH extremes recharge side chains and detonate salt bridges, and urea, organic solvents, and detergents undercut the hydrophobic effect and hydrogen-bond networks. For many proteins unfolding is cooperative: stability gives way all at once over a narrow range around a characteristic melting temperature (Tm), because losing part of the core loosens the rest.

The classic refolding experiment made denaturation's converse famous: ribonuclease unfolded in urea, with its four disulfides reduced, spontaneously refolds when the denaturant and reductant are removed — recovering full activity and re-forming the correct four disulfide pairs out of the many possible pairings. Conclusion, tested endlessly: **the amino acid sequence contains all the information needed to specify the native fold.** No template, no instructor.

## How Folding Actually Proceeds

A chain cannot find its fold by random search — the conformations are too numerous for any random walk to finish in a lifetime, yet real proteins fold in milliseconds to seconds. Folding is therefore hierarchical and funneled: local secondary structure forms fast, elements collapse together into compact intermediates (a loosely packed **molten globule** on many pathways), and the free-energy landscape narrows like a **funnel** toward the single native minimum — each downhill step discarding vast numbers of alternatives.

The crowded cell adds a hazard: unfinished chains expose hydrophobic patches, and exposed patches aggregate. **Chaperones** manage the risk. The Hsp70 class (heat-shock proteins, induced by thermal stress) binds hydrophobic stretches on nascent or stress-unfolded chains and, through ATP-driven cycles of binding and release, blocks aggregation while allowing repeated folding attempts. **Chaperonins** (the GroEL/GroES type) go further, enclosing one misfolded protein at a time inside a barrel where it can refold in isolation. Two accessory enzymes deserve names: protein disulfide isomerase shuffles wrong disulfide pairings, and peptidyl prolyl isomerase accelerates the slow cis-trans flip at proline bonds. The whole maintenance economy — synthesis, folding, refolding, degradation — is called **proteostasis**.

## When Folding Fails

- **Amyloid**: many proteins can misfold into fibrils built of β strands running perpendicular to the fiber axis — the cross-β architecture shared by all amyloids. Deposits define the **amyloidoses**: extracellular amyloid-β peptide (a proteolytic fragment of a larger membrane precursor protein) plus intracellular tau tangles in Alzheimer disease; α-synuclein aggregates (Lewy bodies) in Parkinson disease; polyglutamine-expanded huntingtin in Huntington disease. Onset is slow because only a small fraction of molecules misfolds — but fibrils grow by recruiting more.
- **Misfolding without amyloid**: in the most common form of cystic fibrosis, deletion of a single phenylalanine (ΔF508) in the CFTR chloride channel yields a protein that folds badly and is degraded before reaching the membrane — the disease is a folding failure, and corrector drugs ("pharmacological chaperones") that rescue the fold are in clinical use.
- **Prions**: the normal cellular prion protein (PrPᶜ, α-helix-rich) can be converted by contact with its misfolded, β-rich counterpart (PrPˢᶜ) into more of the misfolded form — a self-propagating conformation that is infectious with no nucleic acid involved. The template is a protein shape. This mechanism underlies Creutzfeldt-Jakob disease in humans and the related spongiform encephalopathies of livestock, and it is the reason such diseases can be simultaneously inherited (a destabilizing PrP mutation), sporadic (a rare spontaneous misfold), and transmissible (acquired seed).`,
        examTip:
          'Chaperones do not carry folding instructions — the sequence does. Chaperones only prevent aggregation and allow refolding attempts; an answer choice giving them a template role is wrong.',
        quiz: [
          {
            question:
              'Which level of protein structure is maintained after denaturation?',
            options: ['Secondary', 'Tertiary', 'Quaternary', 'Primary'],
            correctIndex: 3,
            explanation:
              'Denaturation disrupts secondary (α-helices, β-sheets), tertiary (3D folding), and quaternary (subunit association) structure. The primary structure (amino acid sequence held by covalent peptide bonds) remains intact because peptide bonds require hydrolysis to break.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Secondary structure = backbone hydrogen bonds; tertiary = side-chain interactions; only multimeric proteins have quaternary structure. Native folds are only marginally stable.',
      'The Ramachandran plot maps sterically allowed φ/ψ pairs; helix and sheet occupy separate islands, glycine escapes them, proline is confined.',
      'α-helix: 3.6 residues/turn, 5.4 Å pitch, 1.5 Å rise per residue, i → i+4 hydrogen bonds; proline and glycine disrupt it. β strands rise ~3.5 Å per residue; antiparallel sheets have straighter hydrogen bonds than parallel.',
      'Fibrous designs: keratin = disulfide-cross-linked coiled coils; collagen = Gly–X–Y triple helix requiring vitamin-C-dependent proline hydroxylation (scurvy when it fails); silk = stacked antiparallel β-sheets.',
      'Globular proteins bury hydrophobics and satisfy buried polar groups; motifs and independently folding domains are the architectural vocabulary; disordered segments are functional, not broken.',
      'Refolding experiments prove sequence encodes structure; folding is funneled, not random; Hsp70 and chaperonins prevent aggregation without dictating the fold.',
      'Misfolding diseases: cross-β amyloids (Alzheimer, Parkinson, Huntington), degradation of misfolded CFTR in cystic fibrosis, and self-templating prion conformations.',
    ],
  },

  // ── Biochemistry I.4: Proteins at work: binding ─────────────────────────
  cpb1_protein_binding: {
    topicId: 'cpb1_protein_binding',
    title: 'Proteins at Work: Binding',
    domainWeight: '25%',
    overview:
      'Myoglobin and hemoglobin bind the same ligand with the same heme chemistry, yet their binding curves look nothing alike — and that contrast is the MCAT\'s favorite way to test cooperativity. This chapter reads the sigmoidal curve, explains it with the T-to-R transition, and then shifts it with H⁺, CO₂, 2,3-BPG, and the fetal γ subunit.',
    sections: [
      {
        id: 'cpb1_pb_quant',
        title: 'Binding by the Numbers: Kd and the Hyperbola',
        content: `## The Vocabulary of Binding

A **ligand** is whatever a protein binds, at a **binding site** shaped to complement it — in size, charge, and hydrogen-bonding pattern. Specificity comes from many weak interactions demanding simultaneous satisfaction, and binding is rarely passive: protein and ligand routinely adjust each other's conformations (**induced fit**).

For P + L ⇌ PL at equilibrium, the association constant Ka = [PL]/([P][L]) measures affinity directly, but biochemists usually quote its reciprocal, the **dissociation constant Kd = [P][L]/[PL]**, in molar units, because Kd has a physical reading you can use instantly: **Kd equals the ligand concentration at which half the binding sites are occupied.** Lower Kd = tighter binding. The fraction of sites occupied follows a hyperbola:

θ = [L] / ([L] + Kd)

**Worked example, run twice.** A receptor has Kd = 4 μM and free ligand is at 12 μM: θ = 12/(12 + 4) = 12/16 = 0.75. Check: at three times the Kd, three-quarters occupancy — and the algebra confirms 3Kd/(3Kd + Kd) = 3/4. ✓ The hyperbola's signature is gradual saturation: 50% at Kd, 75% at 3 × Kd, 91% at 10 × Kd.

Typical tabulated Kd values span an enormous range: avidin binds biotin near 10⁻¹⁵ M (the tightest known noncovalent pairing), antibodies bind antigens near 10⁻¹⁰ M, and many enzyme-substrate interactions sit around 10⁻⁴ to 10⁻⁶ M. For a gaseous ligand like O₂, concentration is expressed as partial pressure and Kd becomes **P50** — the pressure at half saturation:

θ = pO₂ / (pO₂ + P50)

**Myoglobin's P50 is 0.26 kPa** (about 2 torr; the tabulated value). At the pO₂ of working tissue, roughly 4 kPa, θ = 4/(4 + 0.26) = 4/4.26 ≈ 0.94 — check: 0.94 × 4.26 ≈ 4.0 ✓. Myoglobin is still 94% loaded at venous oxygen pressures. That is exactly what a storage-and-delivery protein should do, and exactly what a transport protein must not.`,
        examTip:
          'Given any saturation curve, extract two numbers first: the half-saturation point (Kd or P50 — lower means higher affinity) and the shape (hyperbolic means independent sites, sigmoidal means cooperative).',
        quiz: [
          {
            question:
              'A protein binds its ligand with Kd = 4 μM. At a free ligand concentration of 12 μM, what fraction of binding sites is occupied?',
            options: ['25%', '50%', '75%', '94%'],
            correctIndex: 2,
            explanation:
              'θ = [L]/([L] + Kd) = 12/(12 + 4) = 12/16 = 0.75. At a ligand concentration equal to Kd, occupancy is 50%; at three times the Kd it is 75%. Full saturation is approached only asymptotically.',
          },
        ],
      },
      {
        id: 'cpb1_pb_globins',
        title: 'Heme Chemistry and the Two Globins',
        content: `## The Heme Group

Neither globin touches O₂ with its amino acids: the chemistry runs through **heme**, a flat porphyrin ring holding one **Fe²⁺** at its center. Four of the iron's six coordination positions are taken by the ring's nitrogens; the fifth is claimed from below by the **proximal histidine** (His F8) of the protein; the sixth, on the open face, is where O₂ binds. Only the ferrous (Fe²⁺) state binds oxygen — oxidation to Fe³⁺ (as in methemoglobin) kills binding — and free heme in water is rapidly oxidized. Burying the heme in a hydrophobic protein pocket is what keeps the iron reduced and reusable.

The pocket edits chemistry a second way. Carbon monoxide binds free heme roughly 20,000 times more tightly than O₂ (tabulated). In the protein, the **distal histidine** (His E7) on the open face donates a hydrogen bond to bound O₂ — which is strongly polarized on iron — while offering no such favor to CO, whose preferred linear binding geometry the pocket also crowds. The result: the protein selectively boosts O₂ binding and cuts CO's advantage by orders of magnitude — protection enough against the small amounts of CO normal metabolism generates, though not against a faulty furnace (see the final section's CO discussion in context).

## Myoglobin, the Monomer

Myoglobin is a single chain of 153 residues folded into eight α-helices around one heme — the **globin fold**. Abundant in muscle (spectacularly so in diving mammals), it stores O₂ and shuttles it toward mitochondria. One site, no partners: its binding curve is the simple hyperbola of the previous section, essentially saturated at every physiological pO₂.

## Hemoglobin, the Tetramer

Hemoglobin is an α₂β₂ tetramer (Mr about 64,500; α chains 141 residues, β chains 146 — standard values), each subunit a globin fold with its own heme, the whole assembly behaving as two αβ protomers. Its job specification is brutal: load fully at arterial pO₂ (~13.3 kPa, 100 torr) yet surrender a large fraction at tissue pO₂ (~4 kPa, 30 torr). Run the numbers for a hypothetical hyperbolic transporter and you find it either grips too hard to unload or too loosely to load — a protein with independent sites cannot serve both depots. In transit, hemoglobin actually releases about a third of its cargo to resting tissue, with more on demand. The trick that makes it possible is cooperativity — the subject of the next section.`,
        importantNote:
          'Keep the two histidines straight: the proximal His (F8) is covalently coordinated to the iron and transmits the T→R conformational signal; the distal His (E7) is not bonded to iron — it hydrogen-bonds to bound O₂ and discriminates against CO.',
      },
      {
        id: 'cpb1_pb_coop',
        title: 'Cooperativity: The Sigmoid and the T→R Switch',
        content: `## Reading the Curves

![Oxygen saturation curves: hemoglobin's sigmoidal curve computed from the Hill equation with n = 2.8 and P50 = 26 torr, beside a hyperbolic, myoglobin-style curve with n = 1. The steep middle of the sigmoid spans exactly the pO₂ range between tissues and lungs.](/courses/mcat/biochem/bc1-oxygen-binding.svg)

Hemoglobin half-saturates near a P50 of 26 torr (the standard textbook value for adult blood), and its curve is **sigmoidal**: shallow at low pO₂, steepest through the tissue-to-lung window, flattening near saturation. The steep segment is the entire point — a modest pressure drop between lungs and tissue moves the protein across the biggest possible change in occupancy.

Cooperativity is quantified by the **Hill coefficient** nH, the slope of log[θ/(1−θ)] plotted against log pO₂ at half saturation. Independent sites give nH = 1 (myoglobin); hemoglobin's measured nH ≈ 3 (tabulated) against a theoretical maximum of 4, its number of sites — strong positive cooperativity, though not perfect concert. Any nH above 1 means occupied sites raise the affinity of empty ones.

## The Mechanical Story

Deoxyhemoglobin rests in the **T (tense) state**, braced by a network of ion pairs within and between subunits — several involving the C-terminal histidine of each β chain — and with each iron pulled slightly out of its heme plane toward the proximal His. O₂ binding tugs the iron flat into the ring plane; the proximal His and its whole helix follow; the shift strains and breaks interface ion pairs, and the tetramer snaps into the **R (relaxed) state**, in which the remaining hemes are better aligned for binding. Affinity rises as sites fill; run backward, each O₂ departure re-forms T-state contacts and loosens the grip on what remains. The sigmoid is this switch, read as a population average over all four sites.

Two classical models frame it: the **concerted** model (all subunits flip T→R together; ligand binding biases the all-or-none equilibrium) and the **sequential** model (each binding event converts its own subunit and nudges its neighbors). Hemoglobin's real behavior borrows from both; the MCAT asks only that you recognize the vocabulary and the shared core — cooperativity is subunit communication, which is why it strictly requires **quaternary structure**. Monomeric myoglobin has no one to talk to and no sigmoid.

Hemoglobin is also the model **allosteric protein**: its behavior is regulated by molecules binding away from the O₂ sites. O₂ itself, acting on its own kind of site, is a **homotropic** effector; H⁺, CO₂, and BPG — different molecules acting at different sites — are **heterotropic** effectors. All of them work by the same lever: choosing between T and R.`,
        importantNote:
          'Cooperativity does not change WHAT binds — it changes the affinity of the remaining sites after each event. Binding curves report the population average over all four sites.',
      },
      {
        id: 'cpb1_pb_effectors',
        title: 'Shifting the Curve: Bohr, BPG, CO, and Sickle Cell',
        content: `## The Bohr Effect: H⁺ and CO₂

Working tissue is acidic and CO₂-rich; blood leaving it sits near pH 7.2 versus about 7.6 in the lungs. Protons stabilize the T state chemically: at lower pH, specific residues — chiefly the C-terminal histidine of each β chain, which when protonated forms a salt bridge to a nearby aspartate, plus the α-chain amino termini — pick up H⁺ and lock T-state ion pairs in place. Lower affinity, more O₂ released exactly where acid is being made. The relationship is reciprocal: in the lungs, O₂ binding drives those protons off, and hemoglobin hands its H⁺ to the bicarbonate equilibrium just as CO₂ is being exhaled. This coupled O₂/H⁺ exchange is the **Bohr effect**.

CO₂ acts twice. Indirectly, its hydration (fast in red cells via carbonic anhydrase) generates H⁺ for the mechanism above. Directly, CO₂ condenses with the α-amino group at each chain's N-terminus to form a **carbamate**, converting a positive amine into a negatively charged group that forms additional T-stabilizing salt bridges. By standard accounting, hemoglobin itself carries roughly 40% of respiratory H⁺ and 15–20% of CO₂; most CO₂ travels as plasma bicarbonate.

## 2,3-BPG: The Set-Point Dial

**2,3-Bisphosphoglycerate** — a small, intensely anionic red-cell metabolite at about 5 mM (tabulated) — binds in the central cavity of the tetramer, a pocket lined with positive groups that exists only in the T state: one BPG per tetramer, clamping T shut. Stripped of BPG, hemoglobin would bind O₂ so avidly it could barely unload in tissue; with it, the P50 sits at the useful 26 torr. The concentration is adjustable physiology: at high altitude BPG rises toward 8 mM over hours to days, right-shifting the curve so that unloading is maintained despite thinner air.

**Fetal hemoglobin (HbF, α₂γ₂)** exploits the same site in reverse: its γ subunits present a weaker BPG pocket, so HbF binds BPG poorly, sits left-shifted relative to maternal HbA — and O₂ flows across the placenta from mother to fetus, down the affinity gradient.

## Two Molecular Pathologies

**Carbon monoxide** binds hemoglobin about 250-fold more tightly than O₂ (tabulated), forming carboxyhemoglobin. The insult is double: occupied sites carry no O₂, and CO-liganded subunits hold the tetramer toward the R state, so the surviving sites bind O₂ tightly and release less in tissue — delivery collapses faster than occupancy alone predicts. Baseline COHb is about 1%; heavy smokers run several-fold higher; ambient CO in the hundreds of ppm can push COHb toward 50%, which is life-threatening. Treatment is mass action: 100% (or hyperbaric) oxygen to outcompete CO.

**Sickle-cell anemia** is the textbook molecular disease: a single substitution, Glu6→Val on each β chain, replaces a surface carboxylate with a hydrophobic knob. On the **deoxy (T) conformation**, that knob complements a pocket on a neighboring tetramer, so at low pO₂ HbS polymerizes into stiff fibers that deform red cells into sickles — vessel occlusion, hemolysis, pain crises. Oxygenated HbS does not polymerize, which is why the pathology concentrates where O₂ is unloaded. The mutation is recessive at the disease level, and carrier frequency is high where malaria is endemic — heterozygote advantage, a genetics crossover the MCAT loves.`,
        examTip:
          'Right-shifters are the signals of working tissue: ↑H⁺, ↑CO₂, ↑BPG, ↑temperature all stabilize T and promote unloading. Anything fetal, alkaline, cold, or BPG-poor shifts left.',
        quiz: [
          {
            question:
              'During strenuous exercise, skeletal muscle becomes warmer, more acidic, and richer in CO₂. What happens to hemoglobin\'s oxygen saturation curve locally?',
            options: [
              'It shifts left, increasing O₂ affinity',
              'It shifts right, promoting O₂ unloading',
              'It becomes hyperbolic',
              'It is unchanged — only 2,3-BPG shifts the curve',
            ],
            correctIndex: 1,
            explanation:
              'Heat, H⁺, and CO₂ all stabilize the T state, lowering affinity and shifting the curve right (the Bohr effect for H⁺/CO₂). Lower affinity at tissue pO₂ means more O₂ is released exactly where metabolism demands it. The curve remains sigmoidal — cooperativity is not abolished.',
          },
          {
            question:
              'Fetal hemoglobin (α₂γ₂) sustains O₂ transfer from maternal blood primarily because:',
            options: [
              'Its γ subunits bind 2,3-BPG weakly, so HbF has a higher O₂ affinity than maternal HbA',
              'Its γ subunits contain extra heme groups',
              'HbF is insensitive to the Bohr effect',
              'Fetal red cells lack carbonic anhydrase, keeping fetal blood alkaline',
            ],
            correctIndex: 0,
            explanation:
              'The γ subunits form a weaker BPG-binding pocket than β subunits, so HbF is less T-stabilized by BPG and its curve sits left of HbA\'s. At placental pO₂, maternal HbA unloads while fetal HbF loads — O₂ moves down the affinity gradient from mother to fetus. Subunit count, heme number, and the Bohr mechanism are unchanged in HbF.',
          },
        ],
      },
      {
        id: 'cpb1_pb_paradigms',
        title: 'Two More Binding Paradigms: Antibodies and Motors',
        content: `## Antibodies: Binding as Recognition

The adaptive immune system runs on binding specificity. Its humoral arm is the **immunoglobulins** secreted by B lymphocytes (T cells carry the receptors of the cellular arm). An **antigen** is whatever elicits the response; the antibody actually engages only a patch of it, the **epitope**; and a small molecule too tiny to provoke immunity alone becomes antigenic when coupled to a carrier protein — a **hapten**.

IgG, the workhorse class, is a Y-shaped assembly of two heavy and two light chains, disulfide-linked, about 150,000 in molecular weight. The protease papain splits it into two **Fab** fragments (the arms, each ending in an antigen-binding site formed jointly by the variable domains of one heavy and one light chain) and one **Fc** stem (which recruits effector cells and complement). Every domain in the molecule is a β-sandwich — the **immunoglobulin fold** — with binding diversity concentrated in hypervariable loops at the arm tips. Typical antibody-antigen Kd values run near 10⁻¹⁰ M, and binding often involves induced fit. Five classes divide the labor: IgG (blood, most abundant), IgM (a pentamer, the first responder), IgA (secretions), IgE (allergy and antiparasite responses), IgD (B-cell surface roles).

One distinction worth its own sentence pair: **affinity** is the strength of one binding site for one epitope — a true Kd. **Avidity** is the effective overall grip of a multivalent antibody on a multivalent target: pentameric IgM, with ten modest-affinity sites, can hold a pathogen surface far more tenaciously than any single site's Kd suggests. Laboratory medicine is built on this specificity — monoclonal antibodies (one B-cell clone, one epitope) versus polyclonal mixtures, deployed in ELISA and western blotting.

## Actin-Myosin: Binding Cycled by ATP

Muscle shows binding used a third way: cyclic, energy-driven, and productive of force. **Myosin** — two heavy chains whose long tails form a coiled coil, plus light chains decorating two globular heads — bundles into thick filaments. **Actin** polymerizes from G-actin monomers into helical F-actin thin filaments, wrapped by tropomyosin with troponin stationed periodically. Contraction is the two filament sets sliding past each other within each sarcomere.

The crossbridge cycle in one lap: ATP binding makes the myosin head let go of actin; hydrolysis to ADP + Pi cocks the head into its high-energy position; the head rebinds the thin filament one station along; Pi release triggers the **power stroke**, dragging the thin filament as the head snaps back; ADP leaves, and tight binding resumes until the next ATP. Without ATP the cycle freezes with heads locked onto actin — rigor. Control is a Ca²⁺ switch: nerve stimulation releases Ca²⁺ from the sarcoplasmic reticulum; Ca²⁺ binds troponin, troponin rolls tropomyosin off the myosin-binding sites, and the cycle engages. Where hemoglobin uses conformational change to tune affinity, myosin strings conformational changes into a ratchet — binding turned into work.`,
        quiz: [
          {
            question:
              'Pentameric IgM often grips a pathogen surface far more strongly than the modest Kd of any one of its binding sites would predict. The property being described is:',
            options: [
              'Affinity maturation',
              'Avidity — the cumulative strength of multivalent binding',
              'Cooperativity between Fab arms transmitted through the Fc region',
              'Opsonization',
            ],
            correctIndex: 1,
            explanation:
              'Affinity describes a single site\'s Kd; avidity describes the effective overall attachment when multiple sites engage a multivalent target simultaneously — for the pathogen to escape, all contacts must release at once. IgM\'s ten sites give it high avidity despite ordinary per-site affinity. This is not cooperativity: the sites do not change each other\'s intrinsic affinity.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Kd is the ligand concentration at half occupancy (θ = [L]/([L]+Kd)); lower Kd means tighter binding. For O₂, P50 plays the same role: myoglobin 0.26 kPa, hemoglobin ≈ 26 torr.',
      'Heme holds Fe²⁺ (only the ferrous state binds O₂); the proximal His coordinates the iron, the distal His hydrogen-bonds O₂ and discriminates against CO.',
      'Myoglobin: monomer, storage, hyperbolic. Hemoglobin: α₂β₂, transport, sigmoidal with Hill nH ≈ 3 — cooperativity is the T ⇌ R switch communicated across subunit interfaces, impossible without quaternary structure.',
      'Right-shifters (↑H⁺, ↑CO₂, ↑BPG, ↑temperature) are the signals of working tissue; the Bohr effect couples O₂ release to H⁺/CO₂ uptake, with CO₂ also bound directly as N-terminal carbamate.',
      'BPG (~5 mM, rising to ~8 mM at altitude) clamps the T state via the central cavity; fetal γ subunits bind it poorly, left-shifting HbF for placental transfer.',
      'CO binds Hb ~250× more tightly than O₂ and locks remaining sites toward R — blocking and hoarding at once. Sickle-cell disease is one β-chain substitution (Glu6→Val) polymerizing deoxy-HbS.',
      'Antibodies bind with Kd ~10⁻¹⁰ M via the immunoglobulin fold; affinity is one site\'s strength, avidity the multivalent total. Actin-myosin turns cyclic, ATP-driven binding into force via the crossbridge cycle under Ca²⁺-troponin control.',
    ],
  },
};

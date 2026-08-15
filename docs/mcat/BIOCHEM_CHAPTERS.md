# MCAT Biochemistry I & II — chapter model

Status: **complete — all 26 chapters live (25 modeled + II.15 DNA Technology, added to close the AAMC 1B recombinant-DNA block).** Every chapter below has been
authored and wired into `EXAM_CURRICULA.MCAT` with its lesson content (the
catalogue invariant test requires written material behind every live
chapter, and all 25 now satisfy it). This document remains the
authoritative chapter model the implementation followed.

Coverage was benchmarked against a standard full-length biochemistry
textbook's table of contents supplied by the project owner, then reshaped
for the MCAT: chapter boundaries redrawn around how the AAMC tests the
material, low-yield research-methods asides dropped, and every heading and
description written fresh — nothing here reproduces the source's wording.
AAMC Foundational Concept / content-category tags are noted per chapter.

The registry's original placeholder topics have both been replaced with
real chapter sequences: Biochemistry I is live as the `cpb1_*` topics
(I.1–I.11), and Biochemistry II is live in full as the `bb2_*` topics
(II.1–II.14 — metabolism in wave A, the information-flow chapters in
wave B).

---

## Biochemistry I — molecules, structure, catalysis (11 chapters)

Home: Chemical & Physical Foundations (`cp_biochem_1` becomes chapters I.1–I.11).

| # | Chapter | Covers | AAMC |
|---|---|---|---|
| I.1 | Water, pH, and the chemistry of life | Water as solvent; noncovalent forces; ionization, pH and pKa; buffers in physiology (bicarbonate, phosphate); Henderson–Hasselbalch in one variable | 5A |
| I.2 | Amino acids and the peptide bond | The twenty side chains grouped by chemistry; ionization states and pI; the planar peptide bond; primary structure; sequencing logic | 1A |
| I.3 | Protein architecture | Secondary motifs (α-helix, β-sheet, turns); tertiary folds; quaternary assemblies; the folding funnel, chaperones, and misfolding disease | 1A |
| I.4 | Proteins at work: binding | Myoglobin vs hemoglobin; cooperativity and the sigmoidal curve; Bohr effect, 2,3-BPG, fetal hemoglobin; allostery as a general principle | 1A |
| I.5 | Enzymes: how catalysis happens | Activation energy and transition states; active-site strategies (proximity, strain, acid–base, covalent); cofactors and vitamins as coenzyme precursors | 1A |
| I.6 | Enzyme kinetics and inhibition | Michaelis–Menten meaning of Km and Vmax; double-reciprocal reading; competitive / noncompetitive / uncompetitive / mixed inhibitors; irreversible inactivation | 1A |
| I.7 | Enzyme control | Allosteric regulation; covalent modification (phosphorylation foremost); zymogens; feedback in pathways; isozymes | 1A |
| I.8 | Carbohydrates | Monosaccharide stereochemistry; ring forms and anomers; glycosidic bonds; storage and structural polysaccharides; glycoproteins and blood-group sugars | 1D |
| I.9 | Lipids | Fatty acid structure and nomenclature; triacylglycerols; membrane lipids (phospholipids, sphingolipids, cholesterol); steroids and fat-soluble vitamins as signals | 1D |
| I.10 | Membranes and transport | Bilayer fluidity; integral vs peripheral proteins; passive vs facilitated diffusion; primary and secondary active transport; the Na+/K+ pump | 1A, 3A |
| I.11 | Nucleotides and nucleic acid structure | Purines and pyrimidines; nucleoside/nucleotide naming; the double helix, base pairing and stacking; denaturation and hybridization; nucleotides beyond heredity (ATP, cAMP, NAD+) | 1B |

## Biochemistry II — metabolism and the flow of genetic information (14 chapters)

Home: Biological & Biochemical Foundations (II.1–II.14 live as the `bb2_*` topics).

| # | Chapter | Covers | AAMC |
|---|---|---|---|
| II.1 | Bioenergetics and metabolic logic | Free energy in the cell; why ATP is the currency; coupled reactions; redox carriers (NAD+, FAD); anabolism vs catabolism as opposing one-way streets | 1D |
| II.2 | Glycolysis and its mirror | The ten steps in functional groups (investment vs payoff); regulation at the three control points; gluconeogenesis and why it is not simple reversal; the Cori cycle; fermentation | 1D |
| II.3 | Glycogen and the pentose phosphate shunt | Glycogen synthesis vs breakdown and their reciprocal hormonal control; glycogen storage in liver vs muscle; NADPH and ribose from the pentose phosphate pathway | 1D |
| II.4 | Pyruvate to acetyl-CoA and the citric acid cycle | The PDH complex and its regulation; cycle chemistry in one turn; amphibolic roles and anaplerosis; cycle regulation by energy charge | 1D |
| II.5 | Oxidative phosphorylation | The four complexes and mobile carriers; the proton-motive force; ATP synthase as a rotary machine; uncouplers and inhibitors; shuttles for cytosolic NADH | 1D |
| II.6 | Lipid metabolism | β-oxidation arithmetic; ketone bodies in fasting; fatty acid synthesis and its separation from breakdown; cholesterol synthesis in outline; lipoprotein traffic | 1D |
| II.7 | Nitrogen: amino acid metabolism and the urea cycle | Transamination and PLP; oxidative deamination; the urea cycle and its cost; glucogenic vs ketogenic skeletons; heme in outline | 1D |
| II.8 | Metabolic integration | Fed vs fasting vs starvation; insulin, glucagon, epinephrine, cortisol as metabolic switches; organ specialization (liver, muscle, brain, adipose); diabetes as integration failure | 1D, 3B |
| II.9 | Genomes and chromosome packaging | Genes as functional units; how a meter of DNA fits a nucleus: supercoiling and topoisomerases, nucleosomes, chromatin orders; dosage compensation by a noncoding RNA; prokaryotic nucleoid contrast | 1B |
| II.10 | Copying DNA | The replication rules (semiconservative, bidirectional, semidiscontinuous); polymerase chemistry and proofreading; the replisome cast (helicase, primase, ligase, clamp); leading vs lagging strands; eukaryotic complications and telomerase | 1B |
| II.11 | Protecting DNA: mutation, repair, recombination | Mutation classes and their cancer link; mismatch, base-excision, nucleotide-excision and direct repair; double-strand breaks — homologous recombination vs end joining; recombination in meiosis; antibody-gene assembly as programmed rearrangement | 1B |
| II.12 | Transcription and RNA maturation | RNA polymerase mechanics; promoters and terminators; the three eukaryotic polymerases; 5′ capping, splicing (spliceosome, self-splicing), poly(A) tails; alternative splicing as proteome multiplier; mRNA lifetime; reverse transcriptase, retroviruses and HIV therapy as the RNA-to-DNA counterflow | 1B |
| II.13 | Translation and the protein's afterlife | The code's properties (degenerate, unpunctuated, near-universal) and third-position flexibility; tRNA charging as the true decoding step; ribosome structure; initiation, elongation, termination; antibiotics as translation inhibitors; ER entry, glycosylation, signal sequences; ubiquitin–proteasome disposal | 1B |
| II.14 | Gene regulation | Operon logic — lac negative and positive control; repressors, activators and their DNA-binding domains; eukaryotic layers: chromatin state, enhancers and coactivators, transcription-factor modularity, hormonal induction; translational repression and RNA interference; regulation cascades in development; stem-cell potency | 1B, 1C |

---

## What was deliberately reshaped from the source outline

- **Chapter boundaries redrawn.** The source's five information-pathway
  chapters map here to II.9–II.14: its DNA-metabolism chapter splits into
  copying (II.10) vs protecting (II.11); its RNA chapter folds
  RNA-dependent synthesis into II.12 rather than standing alone; catalytic
  RNA appears inside II.12's splicing rather than as its own chapter.
- **Trimmed as beyond MCAT scope:** in-vitro RNA selection methods,
  transcription attenuation mechanics, the bacterial SOS response detail,
  site-specific recombination and transposon taxonomy (transposition kept
  only as one line of context), ribosomal-protein autoregulation.
- **Kept despite being easy to trim**, because the AAMC tests them:
  telomerase, reverse transcriptase and HIV, antibody-gene rearrangement,
  X-inactivation, alternative splicing, RNAi, stem-cell potency.
- **All wording original.** Chapter titles and coverage descriptions were
  written fresh for this document; none reproduces the source outline's
  headings.

## Sequencing note

Authoring order should follow the ladder a learner climbs: I.1–I.7 first
(everything else leans on protein and enzyme literacy), then I.8–I.11,
then II.1–II.8 (metabolism), then II.9–II.14 (information pathways — the
span the source outline covered in most detail). Each authored chapter
moves from this document into `EXAM_CURRICULA.MCAT` with its lesson in the
same commit, keeping the catalogue invariant green throughout.
